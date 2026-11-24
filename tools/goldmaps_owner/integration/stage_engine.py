#!/usr/bin/env python3
"""Stage committed engine source plus only the selected verified native binaries."""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import shutil
import subprocess

from prepare_runtime import ENGINE, SCIENTIFIC_ENGINE, GODOT_VERSION, sha


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--engine", type=Path, required=True)
    parser.add_argument("--runtime-deps", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--platform", choices=("windows", "linux", "both"), default="windows")
    args = parser.parse_args()
    engine, deps, out = args.engine.resolve(), args.runtime_deps.resolve(), args.out.resolve()
    def git(*values):
        return subprocess.check_output(["git", "-C", str(engine), *values])
    if git("rev-parse", "HEAD").decode().strip() != ENGINE:
        raise ValueError("Unexpected delivery engine revision")
    if (out / "runtime/project").exists():
        raise ValueError("Refuse to overwrite staged engine project")
    identity = json.loads((deps / "runtime-identity.v1.json").read_text())
    if identity["engine_head"] != ENGINE or identity["godot_version"] != GODOT_VERSION:
        raise ValueError("Dependency receipt differs from source pin")
    platforms = {"windows", "linux"} if args.platform == "both" else {args.platform}
    native = {r["path"]: r for r in identity["files"] if r["kind"] == "native" and r["platform"] in platforms}
    rows = []
    for encoded in git("ls-tree", "-rz", ENGINE, "--", "godot").split(b"\0"):
        if not encoded:
            continue
        metadata, raw_path = encoded.split(b"\t", 1)
        mode, kind, blob = metadata.decode().split()
        relative = raw_path.decode()
        if kind != "blob" or mode not in ("100644", "100755"):
            raise ValueError("Unsupported engine source entry: " + relative)
        portable_bootstrap = relative in {
            "godot/.godot/.gdignore", "godot/.godot/extension_list.cfg",
            "godot/.godot/global_script_class_cache.cfg"}
        if relative.startswith("godot/.godot/") and not portable_bootstrap:
            continue
        committed = git("cat-file", "blob", blob)
        is_lfs = committed.startswith(b"version https://git-lfs.github.com/spec/v1\n")
        if is_lfs and relative not in native:
            continue  # No unrelated platform pointers masquerade as usable libraries.
        source = engine / relative
        if is_lfs:
            record = native[relative]
            if not source.is_file() or sha(source) != record["sha256"] or source.stat().st_size != record["bytes"]:
                raise ValueError("Materialized native library mismatch: " + relative)
            origin = record["origin"]
        else:
            if not source.is_file() or source.read_bytes() != committed:
                raise ValueError("Engine file differs from committed source: " + relative)
            origin = {"kind": "url", "url": "https://raw.githubusercontent.com/techrote/cybersand/" + ENGINE + "/" + relative}
        destination = (out / "runtime/bootstrap" / relative.removeprefix("godot/.godot/")
                       if portable_bootstrap else out / "runtime/project" / relative.removeprefix("godot/"))
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, destination)
        rows.append({"path": destination.relative_to(out).as_posix(), "source_path": relative,
                     "source_commit": ENGINE, "git_blob": blob, "bytes": destination.stat().st_size,
                     "sha256": sha(destination), "origin": origin})
    for relative in ("LICENSE_STATUS.md", "THIRD_PARTY_NOTICES.md", "third_party/godot-runtime.lock.json",
                     "third_party/native-toolchain.lock.json", "third_party/rapier-bvh-build.lock.json"):
        data = git("show", ENGINE + ":" + relative)
        destination = out / "runtime/source-notices" / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(data)
        rows.append({"path": destination.relative_to(out).as_posix(), "source_path": relative,
                     "source_commit": ENGINE, "bytes": len(data), "sha256": sha(destination),
                     "origin": {"kind": "url", "url": "https://raw.githubusercontent.com/techrote/cybersand/" + ENGINE + "/" + relative}})
    for record in identity["files"]:
        if record["kind"] != "runtime" or record["platform"] not in platforms:
            continue
        source = deps / record["path"]
        if sha(source) != record["sha256"] or source.stat().st_size != record["bytes"]:
            raise ValueError("Godot/dependency identity mismatch")
        destination = out / record["path"]
        shutil.copyfile(source, destination)
        if record["platform"] == "linux":
            destination.chmod(0o755)
        rows.append({"path": record["path"], "bytes": record["bytes"], "sha256": record["sha256"], "origin": record["origin"]})
    receipt = {"schema": "goldmaps.owner-engine-source.v1", "engine_head": ENGINE,
               "scientific_engine_head": SCIENTIFIC_ENGINE, "godot_version": GODOT_VERSION,
               "files": rows, "runtime_identity": identity, "staged_platforms": sorted(platforms),
               "modifications": "No engine source edits. An additive opt-in owner browser/session layer is installed separately.",
               "bootstrap": "Three exact accepted portable bootstrap files are copied into mutable .godot before ordinary runtime; no owner editor import or generated UID sidecars are required.",
               "excluded": "Other-platform LFS payloads and Godot generated caches; all first-run cache writes are isolated."}
    (out / "runtime/source-provenance.v1.json").write_text(json.dumps(receipt, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"status": "STAGED_SOURCE_EXACT", "engine_head": ENGINE, "files": len(rows), "out": str(out)}))


if __name__ == "__main__":
    main()
