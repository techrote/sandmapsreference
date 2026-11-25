#!/usr/bin/env python3
"""Independent fail-closed audit of an extracted GOLDMAPS payload or its ZIP.

This verifies package custody, not engine execution or owner acceptance. Fresh
archives have an exact inventory. Post-execution inspection permits new files
only in the three declared application-owned data/cache roots; every shipped
file remains immutable and is rehashed, including files within those roots.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import stat
import zipfile

MANIFEST = "payload-manifest.v1.json"
SIDECAR = "payload-manifest.sha256"
SCHEMA = "goldmaps.owner-payload.v1"
MUTABLE_ROOTS = ("userdata/", "browser/.godot/", "runtime/project/.godot/")
MAX_FILES = 25000
MAX_BYTES = 4 * 1024**3
MAX_MANIFEST = 16 * 1024**2
HEX = re.compile(r"^[0-9a-f]{64}$")
SHA1 = re.compile(r"^[0-9a-f]{40}$")
DEVICE = re.compile(r"^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)", re.I)


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def safe_path(value: str) -> str:
    if not isinstance(value, str) or not value or len(value) > 1024:
        raise ValueError("empty, oversized or non-string payload path")
    if "\\" in value or any(ord(c) < 32 for c in value) or ":" in value:
        raise ValueError("nonportable path: " + repr(value))
    parts = value.split("/")
    if any(p in ("", ".", "..") or p.endswith((" ", ".")) or DEVICE.match(p) for p in parts):
        raise ValueError("unsafe or Windows-aliased path: " + repr(value))
    if PurePosixPath(value).is_absolute():
        raise ValueError("absolute payload path")
    return value


def strict_json(raw: bytes):
    def pairs(items):
        output = {}
        for key, value in items:
            if key in output:
                raise ValueError("duplicate JSON key: " + key)
            output[key] = value
        return output

    def constant(value):
        raise ValueError("nonfinite JSON value: " + value)

    return json.loads(raw.decode("utf-8"), object_pairs_hook=pairs, parse_constant=constant)


def read_manifest(raw: bytes, expected_sha256: str | None = None):
    if len(raw) > MAX_MANIFEST:
        raise ValueError("payload manifest exceeds budget")
    if expected_sha256 is not None and sha256(raw) != expected_sha256:
        raise ValueError("externally pinned manifest SHA-256 mismatch")
    manifest = strict_json(raw)
    if manifest.get("schema") != SCHEMA or not SHA1.fullmatch(str(manifest.get("engine_head", ""))):
        raise ValueError("manifest schema or engine source identity missing")
    rows = manifest.get("files")
    if not isinstance(rows, list) or not 1 <= len(rows) <= MAX_FILES:
        raise ValueError("manifest file population outside budget")
    if "mutable_roots" in manifest and tuple(manifest["mutable_roots"]) != MUTABLE_ROOTS:
        raise ValueError("manifest attempts to broaden mutable roots")
    index, aliases = {}, set()
    for row in rows:
        name = safe_path(row["path"])
        if name in (MANIFEST, SIDECAR) or name.casefold() in aliases:
            raise ValueError("duplicate, aliased, or self-listed manifest path: " + name)
        if not isinstance(row.get("bytes"), int) or isinstance(row["bytes"], bool) or not 0 <= row["bytes"] <= MAX_BYTES:
            raise ValueError("invalid manifest file size: " + name)
        if not HEX.fullmatch(str(row.get("sha256", ""))):
            raise ValueError("invalid manifest SHA-256: " + name)
        if not isinstance(row.get("origin"), dict) or not row["origin"]:
            raise ValueError("missing file provenance: " + name)
        index[name] = row
        aliases.add(name.casefold())
    if sum(row["bytes"] for row in rows) > MAX_BYTES:
        raise ValueError("manifest total size exceeds package budget")
    return manifest, index


def verify_sidecar(raw: bytes, manifest_raw: bytes):
    words = raw.decode("ascii").strip().split()
    if words != [sha256(manifest_raw), MANIFEST]:
        raise ValueError("manifest SHA-256 sidecar mismatch")


def _inventory(index, actual, post_execution):
    expected = set(index) | {MANIFEST, SIDECAR}
    missing = sorted(expected - set(actual))
    extra = sorted(set(actual) - expected)
    mutable = []
    if post_execution:
        mutable = [name for name in extra if name.startswith(MUTABLE_ROOTS)]
        extra = [name for name in extra if name not in mutable]
    if missing or extra:
        raise ValueError("payload inventory mismatch: " + json.dumps({"missing": missing, "extra": extra}))
    return mutable


def verify_directory(root: Path, expected_sha256=None, post_execution=False):
    root = root.resolve(strict=True)
    actual, aliases = {}, set()
    for path in root.rglob("*"):
        name = safe_path(path.relative_to(root).as_posix())
        if path.is_symlink():
            raise ValueError("symlink in payload: " + name)
        if path.is_dir():
            continue
        if not path.is_file():
            raise ValueError("nonregular payload file: " + name)
        if name.casefold() in aliases:
            raise ValueError("Windows case alias in payload: " + name)
        aliases.add(name.casefold())
        actual[name] = path
    if MANIFEST not in actual or SIDECAR not in actual:
        raise ValueError("payload manifest and SHA-256 sidecar required")
    raw = actual[MANIFEST].read_bytes()
    manifest, index = read_manifest(raw, expected_sha256)
    verify_sidecar(actual[SIDECAR].read_bytes(), raw)
    mutable = _inventory(index, actual, post_execution)
    mismatches = [name for name, row in index.items()
                  if actual[name].stat().st_size != row["bytes"] or file_sha256(actual[name]) != row["sha256"]]
    if mismatches:
        raise ValueError("payload byte mismatch: " + json.dumps(mismatches))
    return {"schema": "goldmaps.payload-verification.v1", "kind": "directory", "pass": True,
            "manifest_sha256": sha256(raw), "engine_head": manifest["engine_head"],
            "payload_files": len(index), "total_files": len(actual),
            "payload_bytes": sum(row["bytes"] for row in index.values()),
            "total_bytes": sum(path.stat().st_size for path in actual.values()),
            "mutable_additions": mutable, "post_execution": post_execution}


def verify_zip(archive: Path, expected_sha256=None):
    with zipfile.ZipFile(archive) as opened:
        members, aliases = {}, set()
        for info in opened.infolist():
            name = safe_path(info.filename.rstrip("/") if info.is_dir() else info.filename)
            if name.casefold() in aliases:
                raise ValueError("duplicate or Windows-aliased ZIP entry: " + name)
            aliases.add(name.casefold())
            mode = info.external_attr >> 16
            if stat.S_ISLNK(mode) or (stat.S_IFMT(mode) not in (0, stat.S_IFREG, stat.S_IFDIR)):
                raise ValueError("nonregular ZIP entry: " + name)
            if info.flag_bits & 1:
                raise ValueError("encrypted ZIP entry: " + name)
            if not info.is_dir():
                members[name] = info
        locations = [name for name in members if name == MANIFEST or name.endswith("/" + MANIFEST)]
        if len(locations) != 1:
            raise ValueError("ZIP must have one authoritative payload manifest")
        prefix = locations[0][:-len(MANIFEST)]
        if prefix and "/" in prefix.rstrip("/"):
            raise ValueError("ZIP payload has more than one envelope directory")
        if any(not name.startswith(prefix) for name in members):
            raise ValueError("ZIP contains files outside the payload envelope")
        actual = {name[len(prefix):]: info for name, info in members.items()}
        info = actual[MANIFEST]
        if info.file_size > MAX_MANIFEST:
            raise ValueError("ZIP manifest exceeds budget")
        raw = opened.read(info)
        manifest, index = read_manifest(raw, expected_sha256)
        _inventory(index, actual, False)
        if actual[SIDECAR].file_size > 1024:
            raise ValueError("oversized SHA-256 sidecar")
        verify_sidecar(opened.read(actual[SIDECAR]), raw)
        for name, row in index.items():
            info = actual[name]
            if info.file_size != row["bytes"]:
                raise ValueError("ZIP uncompressed size mismatch: " + name)
            digest = hashlib.sha256()
            with opened.open(info) as stream:
                for block in iter(lambda: stream.read(1024 * 1024), b""):
                    digest.update(block)
            if digest.hexdigest() != row["sha256"]:
                raise ValueError("ZIP SHA-256 mismatch: " + name)
        bad = opened.testzip()
        if bad:
            raise ValueError("ZIP CRC mismatch: " + bad)
        return {"schema": "goldmaps.payload-verification.v1", "kind": "zip", "pass": True,
                "archive_sha256": file_sha256(archive), "archive_bytes": archive.stat().st_size,
                "manifest_sha256": sha256(raw), "engine_head": manifest["engine_head"],
                "envelope_directory": prefix, "payload_files": len(index), "total_files": len(actual),
                "payload_bytes": sum(row["bytes"] for row in index.values()),
                "total_uncompressed_bytes": sum(info.file_size for info in actual.values()), "zip_crc": "PASS"}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("payload", type=Path)
    parser.add_argument("--manifest-sha256")
    parser.add_argument("--post-execution", action="store_true")
    parser.add_argument("--out", type=Path)
    args = parser.parse_args()
    if args.payload.is_dir():
        result = verify_directory(args.payload, args.manifest_sha256, args.post_execution)
    else:
        if args.post_execution:
            parser.error("--post-execution is only valid for an extracted directory")
        result = verify_zip(args.payload, args.manifest_sha256)
    output = json.dumps(result, indent=2) + "\n"
    if args.out:
        args.out.parent.mkdir(parents=True, exist_ok=True)
        args.out.write_text(output, encoding="utf-8")
    print(output, end="")


if __name__ == "__main__":
    main()
