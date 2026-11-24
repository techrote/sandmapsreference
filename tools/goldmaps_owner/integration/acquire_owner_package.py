#!/usr/bin/env python3
"""Reconstruct the actual owner kit from a separately SHA-256-pinned manifest.

Standard library only. Does not execute downloaded source or change a game
profile. Source URLs are immutable; generated delivery metadata and original
qualification evidence are retained as bounded compressed exact-byte records.
"""
from __future__ import annotations

import argparse
import base64
from concurrent.futures import ThreadPoolExecutor
import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import shutil
import threading
import urllib.parse
import urllib.request
import zlib
import zipfile

HOSTS = {"raw.githubusercontent.com", "media.githubusercontent.com", "github.com"}
HEX = re.compile(r"^[0-9a-f]{64}$")
DEVICE = re.compile(r"^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)", re.I)
MAX_FILE = 512 * 1024**2
MAX_TOTAL = 4 * 1024**3


def sha(path):
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def relative(value):
    if not isinstance(value, str) or not value or len(value) > 1024 or "\\" in value or ":" in value or any(ord(c) < 32 for c in value):
        raise ValueError("Unsafe acquisition path")
    if PurePosixPath(value).is_absolute() or any(p in ("", ".", "..") or p.endswith((" ", ".")) or DEVICE.match(p) for p in value.split("/")):
        raise ValueError("Unsafe/aliased acquisition path: " + value)
    return value


def unique_object(items):
    value = {}
    for key, item in items:
        if key in value:
            raise ValueError("Duplicate JSON key")
        value[key] = item
    return value


def load_manifest(path, expected):
    if not HEX.fullmatch(expected) or path.stat().st_size > 128 * 1024**2 or sha(path) != expected:
        raise ValueError("Externally supplied acquisition manifest SHA-256 mismatch")
    doc = json.loads(path.read_text(encoding="utf-8"), object_pairs_hook=unique_object)
    if doc.get("schema") != "goldmaps.owner-acquisition.v1":
        raise ValueError("Unsupported acquisition schema")
    rows = doc.get("files")
    if not isinstance(rows, list) or not 1 <= len(rows) <= 25000:
        raise ValueError("Acquisition population outside bounded scope")
    seen = set()
    for row in rows:
        name = relative(row["path"])
        if name.casefold() in seen:
            raise ValueError("Duplicate/case-aliased acquisition target")
        seen.add(name.casefold())
        if type(row["bytes"]) is not int or not 0 <= row["bytes"] <= MAX_FILE or not HEX.fullmatch(row["sha256"]):
            raise ValueError("Invalid acquisition byte identity")
        origin = row["origin"]
        if origin["kind"] not in ("url", "zip_member", "inline_zlib_base64"):
            raise ValueError("Unsupported acquisition origin")
        if origin["kind"] in ("url", "zip_member"):
            parsed = urllib.parse.urlsplit(origin["url"])
            if parsed.scheme != "https" or parsed.hostname not in HOSTS or parsed.username or parsed.password or parsed.port not in (None, 443):
                raise ValueError("Unexpected acquisition URL")
        if origin["kind"] == "zip_member":
            relative(origin["member"])
            if not HEX.fullmatch(origin["archive_sha256"]):
                raise ValueError("Unpinned upstream archive")
    for name in seen:
        parts = name.split("/")
        if any("/".join(parts[:i]) in seen for i in range(1, len(parts))):
            raise ValueError("Acquisition file/directory path collision")
    if sum(row["bytes"] for row in rows) > MAX_TOTAL:
        raise ValueError("Acquisition total exceeds scope")
    return doc


def download(url, path, limit):
    request = urllib.request.Request(url, headers={"User-Agent": "GOLDMAPS-OWNER-DELIVERY-001-acquisition"})
    refuse_symlink_components(path)
    with urllib.request.urlopen(request, timeout=60) as source, path.open("wb") as target:
        total = 0
        while block := source.read(1024 * 1024):
            total += len(block)
            if total > limit:
                raise ValueError("Acquisition exceeds pinned size")
            target.write(block)


def refuse_symlink_components(path):
    absolute = path.absolute()
    for component in [absolute, *absolute.parents]:
        if component.is_symlink():
            raise ValueError("Symlink is not permitted in acquisition/cache paths: " + str(component))


def acquire(manifest, output, cache, jobs=4):
    refuse_symlink_components(output)
    refuse_symlink_components(cache)
    if output.exists():
        raise ValueError("Refuse to overwrite an existing directory")
    output.mkdir(parents=True)
    cache.mkdir(parents=True, exist_ok=True)
    locks = {row["origin"]["archive_sha256"]: threading.Lock() for row in manifest["files"] if row["origin"]["kind"] == "zip_member"}
    def one(row):
        path = output / relative(row["path"])
        path.parent.mkdir(parents=True, exist_ok=True)
        origin = row["origin"]
        if origin["kind"] == "url":
            download(origin["url"], path, row["bytes"])
        elif origin["kind"] == "inline_zlib_base64":
            compressed = base64.b64decode(origin["data"], validate=True)
            decoder = zlib.decompressobj()
            raw = decoder.decompress(compressed, row["bytes"] + 1)
            if len(raw) != row["bytes"] or decoder.unconsumed_tail or decoder.unused_data or not decoder.eof:
                raise ValueError("Embedded exact-byte record exceeds declared size")
            path.write_bytes(raw)
        else:
            digest = origin["archive_sha256"]
            archive = cache / (digest + ".zip")
            with locks[digest]:
                refuse_symlink_components(archive)
                if not archive.is_file() or sha(archive) != digest:
                    download(origin["url"], archive, MAX_FILE)
                if sha(archive) != digest:
                    raise ValueError("Upstream archive identity mismatch")
            with zipfile.ZipFile(archive) as z:
                matches = [info for info in z.infolist() if info.filename == origin["member"]]
                if len(matches) != 1 or matches[0].file_size != row["bytes"]:
                    raise ValueError("Upstream archive member identity mismatch")
                with z.open(matches[0]) as source, path.open("xb") as target:
                    shutil.copyfileobj(source, target, 1024 * 1024)
        if path.stat().st_size != row["bytes"] or sha(path) != row["sha256"]:
            raise ValueError("Acquired file failed exact identity: " + row["path"])
        return row["path"]
    with ThreadPoolExecutor(max_workers=jobs) as pool:
        for number, _ in enumerate(pool.map(one, manifest["files"]), 1):
            if number % 100 == 0:
                print(json.dumps({"files_verified": number}), flush=True)
    expected = {row["path"] for row in manifest["files"]}
    actual = {p.relative_to(output).as_posix() for p in output.rglob("*") if p.is_file()}
    if actual != expected:
        raise ValueError("Reconstructed payload contains missing or extra files")
    if sha(output / "payload-manifest.v1.json") != manifest["payload_manifest_sha256"]:
        raise ValueError("Reconstructed payload manifest differs from qualified record")
    return {"status": "EXACT_BYTES_RECONSTRUCTED", "files": len(actual),
            "bytes": sum(row["bytes"] for row in manifest["files"]),
            "payload_manifest_sha256": manifest["payload_manifest_sha256"],
            "engine_head": manifest["engine_head"], "delivery_source_head": manifest["delivery_source_head"],
            "claim": "Acquisition only; original qualification is preserved, not newly re-executed."}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--manifest-sha256", required=True)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--cache", type=Path, required=True)
    parser.add_argument("--jobs", type=int, choices=(1, 2, 4, 8), default=4)
    args = parser.parse_args()
    manifest = load_manifest(args.manifest, args.manifest_sha256)
    result = acquire(manifest, args.out.absolute(), args.cache.absolute(), args.jobs)
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
