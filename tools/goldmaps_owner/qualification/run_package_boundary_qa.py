#!/usr/bin/env python3
"""Execute hostile package fixtures through the actual shipped Godot boundary."""
from __future__ import annotations

import argparse
import copy
import hashlib
import json
from pathlib import Path

from run_native_collection import profile_environment, record, run, write_json
from verify_payload import file_sha256, verify_directory

HERE = Path(__file__).resolve().parent


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--package", type=Path, required=True)
    parser.add_argument("--godot", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    root, out, godot = args.package.resolve(), args.out.resolve(), args.godot.resolve()
    if out.exists():
        raise ValueError("refuse to overwrite boundary qualification fixtures")
    identity = verify_directory(root, post_execution=True)
    out.mkdir(parents=True)
    data = b"native-source-fixture\n"
    base = {"schema": "goldmaps.owner-payload.v1", "engine_head": identity["engine_head"],
            "files": [{"path": "source.bin", "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest(),
                       "origin": {"kind": "synthetic_hostile_fixture"}}]}
    cases = []

    def fixture(name, expected=False, transform=None, mutate=None, sidecar=None):
        folder = out / "fixtures" / name
        folder.mkdir(parents=True)
        (folder / "source.bin").write_bytes(data)
        document = copy.deepcopy(base)
        if transform:
            transform(document)
        manifest = (json.dumps(document, indent=2) + "\n").encode()
        (folder / "payload-manifest.v1.json").write_bytes(manifest)
        checksum = hashlib.sha256(manifest).hexdigest()
        (folder / "payload-manifest.sha256").write_text(sidecar or checksum + "  payload-manifest.v1.json\n")
        if mutate:
            mutate(folder)
        cases.append({"id": name, "root": str(folder), "expected_accepted": expected})

    fixture("exact_baseline", expected=True)
    fixture("missing_required", mutate=lambda p: (p / "source.bin").unlink())
    fixture("extra_executable", mutate=lambda p: (p / "unexpected.gd").write_text("extends Node\n"))
    fixture("corrupted_bytes", mutate=lambda p: (p / "source.bin").write_bytes(b"!" + data[1:]))
    fixture("truncated_required", mutate=lambda p: (p / "source.bin").write_bytes(data[:-1]))
    fixture("duplicate_path", transform=lambda d: d["files"].append(copy.deepcopy(d["files"][0])))
    fixture("case_alias", transform=lambda d: d["files"].append(dict(d["files"][0], path="SOURCE.bin")))
    fixture("traversal_path", transform=lambda d: d["files"][0].update(path="../source.bin"))
    fixture("fractional_byte_length", transform=lambda d: d["files"][0].update(bytes=len(data) + 0.5))
    fixture("manifest_checksum_substitution", sidecar="f" * 64 + "  payload-manifest.v1.json\n")
    fixture("missing_manifest_checksum", mutate=lambda p: (p / "payload-manifest.sha256").unlink())
    fixture("unapproved_cache_root", mutate=lambda p: ((p / ".godot").mkdir(), (p / ".godot/unapproved.bin").write_bytes(b"cache")))
    fixture("allowed_owner_save", expected=True, mutate=lambda p: ((p / "userdata").mkdir(), (p / "userdata/saved-copy.json").write_text("{}")))
    fixture("mutable_path_cannot_hide_shipped_source", transform=lambda d: d["files"][0].update(path="userdata/source.bin"))
    catalog = out / "fixtures.v1.json"
    write_json(catalog, {"schema": "goldmaps.boundary-fixtures.v1", "cases": cases})
    env = profile_environment(root / "userdata" / "boundary-fixtures")
    env["GOLDMAPS_BOUNDARY_FIXTURES"] = str(catalog)
    process, text = run([godot, "--headless", "--path", root / "browser", "--script", HERE / "package_boundary_probe.gd"],
                        out / "actual-runtime-boundary.log", env, 120)
    evidence = record(text, "GOLDMAPS_PACKAGE_BOUNDARY ")
    result = {"schema": "goldmaps.runtime-boundary-qa.v1", "package_before": identity,
              "package_after": verify_directory(root, identity["manifest_sha256"], post_execution=True),
              "godot_sha256": file_sha256(godot), "boundary_source_sha256": file_sha256(root / "browser/package_io.gd"),
              "probe_sha256": file_sha256(HERE / "package_boundary_probe.gd"), "process": process, "evidence": evidence,
              "pass": process["exit_code"] == 0 and bool(evidence and evidence.get("pass")),
              "owner_accepted": False}
    write_json(out / "summary.json", result)
    print("GOLDMAPS_BOUNDARY_QA " + json.dumps({"pass": result["pass"], "cases": len(cases)}))
    return 0 if result["pass"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
