#!/usr/bin/env python3
"""Reconstruct the frozen owner package, ZIP/extract, and verify every file.

Standard library only. No repository checkout, native build, or corpus discovery.
The compressed ZIP bytes are incidental; the pinned file inventory is the unit
of identity. The input manifest is included verbatim as package-files.v1.json.
"""
from pathlib import Path, PurePosixPath
from concurrent.futures import ThreadPoolExecutor
import argparse
import hashlib
import json
import shutil
import threading
import urllib.parse
import urllib.request
import zipfile

ENGINE = "662df51cd8409a52332fa7ef15d06d8ab8945aed"
LOCK = "0bdbf3fc524e85c30c7095b7e1dad53159fd7d9c"
HOSTS = {"raw.githubusercontent.com", "media.githubusercontent.com", "github.com"}


def sha(path):
    h = hashlib.sha256()
    with path.open("rb") as f:
        for data in iter(lambda: f.read(1024 * 1024), b""):
            h.update(data)
    return h.hexdigest()


def relative(value):
    if not isinstance(value, str) or "\\" in value or ":" in value:
        raise ValueError("Unsafe package path")
    p = PurePosixPath(value)
    if p.is_absolute() or any(x in ("", ".", "..") for x in value.split("/")):
        raise ValueError("Unsafe package path: " + value)
    if any(x.endswith((".", " ")) for x in p.parts):
        raise ValueError("Ambiguous Windows path: " + value)
    return p


def checked_manifest(path, expected):
    if sha(path) != expected:
        raise ValueError("Acquisition manifest SHA256 mismatch")
    m = json.loads(path.read_text(encoding="utf-8"))
    if m["engine_head"] != ENGINE or m["output_lock_commit"] != LOCK:
        raise ValueError("Engine/output lock differs from frozen study")
    seen = set()
    for f in m["files"]:
        name = str(relative(f["path"]))
        if name.casefold() in seen or name == "package-files.v1.json":
            raise ValueError("Duplicate, case-aliased, or self-referential inventory path")
        seen.add(name.casefold())
        if not isinstance(f["bytes"], int) or not 0 <= f["bytes"] <= 256 * 1024 * 1024:
            raise ValueError("Invalid file size")
        if len(f["sha256"]) != 64 or any(c not in "0123456789abcdef" for c in f["sha256"]):
            raise ValueError("Invalid SHA256")
        if f["origin"]["kind"] not in ("url", "zip_member"):
            raise ValueError("Unresolved or unsupported acquisition origin")
        url = urllib.parse.urlsplit(f["origin"]["url"])
        if url.scheme != "https" or url.hostname not in HOSTS or url.username or url.password:
            raise ValueError("Unexpected acquisition URL")
    if len(m["files"]) != 586 or sum(f["bytes"] for f in m["files"]) > 512 * 1024 * 1024:
        raise ValueError("Unexpected package inventory scope")
    return m


def verify(root, manifest, manifest_path):
    expected = {f["path"]: f for f in manifest["files"]}
    bad = []
    for name, f in expected.items():
        p = root / name
        if not p.is_file() or p.stat().st_size != f["bytes"] or sha(p) != f["sha256"]:
            bad.append(name)
    self_ok = (root / "package-files.v1.json").read_bytes() == manifest_path.read_bytes()
    actual = {p.relative_to(root).as_posix() for p in root.rglob("*") if p.is_file()}
    extra = sorted(actual - set(expected) - {"package-files.v1.json"})
    return {"files_checked": len(expected), "file_mismatches": bad,
            "manifest_bytes_equal": self_ok, "unexpected_files": extra,
            "pass": not bad and self_ok and not extra}


def download(url, path, limit):
    request = urllib.request.Request(url, headers={"User-Agent": "GOLD-ASTRA-001-frozen-package-check"})
    with urllib.request.urlopen(request, timeout=60) as response, path.open("xb") as out:
        total = 0
        while True:
            block = response.read(1024 * 1024)
            if not block:
                break
            total += len(block)
            if total > limit:
                raise ValueError("Download exceeds pinned size bound")
            out.write(block)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--manifest", type=Path, required=True)
    ap.add_argument("--manifest-sha256", required=True)
    ap.add_argument("--workspace", type=Path, required=True)
    ap.add_argument("--verify-local", type=Path, help="Only verify an existing local package; do not download or ZIP")
    args = ap.parse_args()
    manifest_path = args.manifest.resolve()
    m = checked_manifest(manifest_path, args.manifest_sha256)
    if args.verify_local:
        result = verify(args.verify_local.resolve(), m, manifest_path)
        print(json.dumps(result))
        return 0 if result["pass"] else 1
    work = args.workspace.resolve()
    if work.exists():
        raise ValueError("Refuse to overwrite acquisition workspace")
    package = work / "package"
    cache = work / "archive-cache"
    package.mkdir(parents=True)
    cache.mkdir()
    locks = {}
    for f in m["files"]:
        origin = f["origin"]
        if origin["kind"] == "zip_member":
            locks.setdefault(origin["archive_sha256"], threading.Lock())

    def acquire(f):
        dest = package / f["path"]
        dest.parent.mkdir(parents=True, exist_ok=True)
        origin = f["origin"]
        if origin["kind"] == "url":
            download(origin["url"], dest, f["bytes"])
        else:
            digest = origin["archive_sha256"]
            archive = cache / (digest + ".zip")
            with locks[digest]:
                if not archive.exists():
                    download(origin["url"], archive, 256 * 1024 * 1024)
                if sha(archive) != digest:
                    raise ValueError("Upstream archive SHA256 mismatch")
            member = str(relative(origin["member"]))
            with zipfile.ZipFile(archive) as z:
                info = z.getinfo(member)
                if info.file_size != f["bytes"]:
                    raise ValueError("Upstream archive member size mismatch")
                with z.open(info) as source, dest.open("xb") as target:
                    shutil.copyfileobj(source, target, 1024 * 1024)
        if dest.stat().st_size != f["bytes"] or sha(dest) != f["sha256"]:
            raise ValueError("Acquired file identity mismatch: " + f["path"])
        return f["path"]

    with ThreadPoolExecutor(max_workers=8) as pool:
        for i, _ in enumerate(pool.map(acquire, m["files"]), 1):
            if i % 100 == 0:
                print(json.dumps({"acquired_files": i}), flush=True)
    shutil.copyfile(manifest_path, package / "package-files.v1.json")
    before = verify(package, m, manifest_path)
    if not before["pass"]:
        raise ValueError("Reconstructed package failed inventory")
    archive = work / "gold-astra-001-owner-evaluation.zip"
    with zipfile.ZipFile(archive, "x", zipfile.ZIP_DEFLATED, compresslevel=1) as z:
        for p in sorted(package.rglob("*")):
            if p.is_file():
                z.write(p, p.relative_to(package).as_posix())
    extracted = work / "extracted"
    extracted.mkdir()
    with zipfile.ZipFile(archive) as z:
        for info in z.infolist():
            relative(info.filename)
        z.extractall(extracted)
    after = verify(extracted, m, manifest_path)
    receipt = {"manifest_sha256": sha(manifest_path), "engine_head": ENGINE,
               "lock_commit": LOCK, "reconstructed": before, "extracted": after,
               "generated_zip_sha256": sha(archive), "generated_zip_bytes": archive.stat().st_size,
               "identity_claim": "Exact inventory files and manifest bytes; not identical compressed ZIP bytes",
               "extracted_package": str(extracted)}
    (work / "acquisition-receipt.json").write_text(json.dumps(receipt, indent=2) + "\n")
    print("GOLD_WINDOWS_PACKAGE " + json.dumps(receipt), flush=True)
    return 0 if after["pass"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
