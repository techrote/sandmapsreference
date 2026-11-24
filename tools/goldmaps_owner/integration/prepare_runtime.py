#!/usr/bin/env python3
"""Acquire exact accepted CyberSand runtime dependencies without rebuilding.

Run against the independently checked-out accepted engine. Binary materialization
is permitted only when its SHA-256 and length match committed LFS/provenance.
No source, pin, historical manifest or production profile is changed.
"""
from __future__ import annotations

import argparse
from concurrent.futures import ThreadPoolExecutor
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import urllib.request
import zipfile

ENGINE = "00cdb02f103265b6dc5224c68283e9a0c8cb449f"
SCIENTIFIC_ENGINE = "662df51cd8409a52332fa7ef15d06d8ab8945aed"
GODOT_VERSION = "4.7.stable.official.5b4e0cb0f"
GODOT_LINUX_SHA256 = "f85bbc6b15e22416c7d797cd60b63286dd67b9cb13498847056c18520ae55a75"
ROOT = Path(__file__).resolve().parents[3]


def sha(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            h.update(block)
    return h.hexdigest()


def verified(path: Path, digest: str, size: int | None = None) -> bool:
    return path.is_file() and (size is None or path.stat().st_size == size) and sha(path) == digest


def fetch(url: str, dest: Path, digest: str, size: int | None = None) -> None:
    if verified(dest, digest, size):
        return
    dest.parent.mkdir(parents=True, exist_ok=True)
    temporary = dest.with_name(dest.name + ".acquiring")
    request = urllib.request.Request(url, headers={"User-Agent": "GOLDMAPS-OWNER-DELIVERY-001"})
    try:
        with urllib.request.urlopen(request, timeout=60) as source, temporary.open("wb") as target:
            total = 0
            while block := source.read(1024 * 1024):
                total += len(block)
                if total > (size if size is not None else 256 * 1024 * 1024):
                    raise ValueError("Download exceeds pinned bound: " + dest.name)
                target.write(block)
        if not verified(temporary, digest, size):
            raise ValueError("Downloaded dependency identity mismatch: " + dest.name)
        temporary.replace(dest)
    finally:
        temporary.unlink(missing_ok=True)


def git(engine: Path, *args: str) -> bytes:
    return subprocess.check_output(["git", "-C", str(engine), *args])


def read_committed(engine: Path, path: str) -> bytes:
    return git(engine, "show", ENGINE + ":" + path)


def check_provenance(engine: Path, relative: str) -> dict:
    encoded = read_committed(engine, relative)
    if (engine / relative).read_bytes() != encoded:
        raise ValueError("Provenance file differs from accepted source: " + relative)
    record = json.loads(encoded)
    for path, expected in record["source_inputs"].items():
        data = read_committed(engine, path)
        if hashlib.sha256(data.replace(b"\r\n", b"\n")).hexdigest() != expected:
            raise ValueError("Accepted source requires rebuild: " + path)
        actual = engine / path
        if not actual.is_file() or actual.read_bytes() != data:
            raise ValueError("Local source differs from accepted engine: " + path)
    pointer = read_committed(engine, record["artifact"])
    expected = f"version https://git-lfs.github.com/spec/v1\noid sha256:{record['sha256']}\nsize {record['size']}\n".encode()
    if pointer != expected:
        raise ValueError("Committed LFS pointer differs from provenance: " + relative)
    return record


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--engine", type=Path, required=True)
    parser.add_argument("--cache", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--historical-cache", type=Path)
    parser.add_argument("--platform", choices=("windows", "linux", "both"), default="both")
    args = parser.parse_args()
    engine, cache, out = args.engine.resolve(), args.cache.resolve(), args.out.resolve()
    if git(engine, "rev-parse", "HEAD").decode().strip() != ENGINE:
        raise ValueError("Engine checkout is not the explicitly qualified delivery source")
    out.mkdir(parents=True, exist_ok=True)
    cache.mkdir(parents=True, exist_ok=True)
    records = []
    manifests = {
        "windows": ["godot/addons/cybersand_native/runtime-provenance.json", "godot/addons/godot-rapier2d/runtime-provenance.windows.json"],
        "linux": ["godot/addons/cybersand_native/runtime-provenance.linux.json", "godot/addons/godot-rapier2d/runtime-provenance.linux.json"],
    }
    selected = ("windows", "linux") if args.platform == "both" else (args.platform,)
    jobs = []
    for platform in selected:
        for provenance_path in manifests[platform]:
            record = check_provenance(engine, provenance_path)
            target = engine / record["artifact"]
            origin = "https://media.githubusercontent.com/media/techrote/cybersand/" + ENGINE + "/" + record["artifact"]
            cached = args.historical_cache / record["artifact"] if args.historical_cache else None
            if cached and verified(cached, record["sha256"], record["size"]):
                shutil.copyfile(cached, target)
            jobs.append((origin, target, record["sha256"], record["size"]))
            records.append({"kind": "native", "platform": platform, "path": record["artifact"],
                            "sha256": record["sha256"], "bytes": record["size"],
                            "origin": {"kind": "url", "url": origin},
                            "provenance_path": provenance_path, "provenance_sha256": sha(engine / provenance_path),
                            "built_source": record.get("source_commit", record.get("build_commit")),
                            "accepted_source_inputs_equal": True})
    with ThreadPoolExecutor(max_workers=4) as pool:
        list(pool.map(lambda item: fetch(*item), jobs))

    historical = json.loads((ROOT / "docs/corpus/goldmaps-recovery-001/snapshot/owner-package-files.v2.json").read_text())
    wanted = {"Godot_v4.7-stable_win64.exe", "Godot_v4.7-stable_win64_console.exe", "vcruntime140.dll",
              "Godot-COPYRIGHT.txt", "Godot-LICENSE.txt", "Microsoft-Visual-C-Runtime-LICENSE.docx", "Microsoft-Visual-Studio-2022-LICENSE.docx"}
    if "windows" in selected:
        for row in historical["files"]:
            if row["path"] not in wanted:
                continue
            dest = out / row["path"]
            cached = args.historical_cache / row["path"] if args.historical_cache else None
            if cached and verified(cached, row["sha256"], row["bytes"]):
                shutil.copyfile(cached, dest)
            if not verified(dest, row["sha256"], row["bytes"]):
                origin = row["origin"]
                if origin["kind"] == "url":
                    fetch(origin["url"], dest, row["sha256"], row["bytes"])
                else:
                    archive = cache / (origin["archive_sha256"] + ".zip")
                    fetch(origin["url"], archive, origin["archive_sha256"])
                    with zipfile.ZipFile(archive) as z:
                        info = z.getinfo(origin["member"])
                        if info.file_size != row["bytes"]:
                            raise ValueError("Godot archive member size mismatch")
                        dest.write_bytes(z.read(info))
                if not verified(dest, row["sha256"], row["bytes"]):
                    raise ValueError("Runtime member identity mismatch")
            records.append({"kind": "runtime", "platform": "windows", **row})

    if "linux" in selected:
        lock = json.loads(read_committed(engine, "third_party/godot-runtime.lock.json"))
        if lock["godot_version"] != GODOT_VERSION:
            raise ValueError("Godot approved pin changed")
        archive = cache / lock["editor"]["filename"]
        origin = "https://github.com/godotengine/godot-builds/releases/download/4.7-stable/" + archive.name
        fetch(origin, archive, lock["editor"]["sha256"], lock["editor"]["size"])
        dest = out / "Godot_v4.7-stable_linux.x86_64"
        if not verified(dest, GODOT_LINUX_SHA256):
            with zipfile.ZipFile(archive) as z:
                dest.write_bytes(z.read(dest.name))
        if not verified(dest, GODOT_LINUX_SHA256):
            raise ValueError("Linux Godot executable differs from native research pin")
        dest.chmod(0o755)
        version = subprocess.check_output([str(dest), "--version"], text=True).strip()
        if version != GODOT_VERSION:
            raise ValueError("Linux Godot version mismatch: " + version)
        records.append({"kind": "runtime", "platform": "linux", "path": dest.name,
                        "bytes": dest.stat().st_size, "sha256": sha(dest),
                        "origin": {"kind": "zip_member", "url": origin,
                                   "archive_sha256": lock["editor"]["sha256"], "member": dest.name}})
    receipt = {"schema": "goldmaps.owner-runtime.v1", "engine_head": ENGINE,
               "scientific_engine_head": SCIENTIFIC_ENGINE, "godot_version": GODOT_VERSION,
               "native_source_provenance": "Every recorded build input matches accepted engine source; later unrelated commits do not require rebuilding identical inputs.",
               "files": records, "owner_accepted": False,
               "limitations": ["Acquisition and source equality are not native execution, graphical or owner acceptance."]}
    (out / "runtime-identity.v1.json").write_text(json.dumps(receipt, indent=2) + "\n")
    print(json.dumps({"status": "ACQUIRED_IDENTITY_VERIFIED", "engine_head": ENGINE, "files": len(records), "out": str(out)}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
