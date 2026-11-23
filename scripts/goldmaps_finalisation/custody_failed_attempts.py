#!/usr/bin/env python3
"""Recover negative evidence by frozen hashes and documented inverse corrections.

Only bytes matching the pre-existing author-handoff SHA-256 become recovered
originals. Derived operations are reconstruction inputs, never silently claimed
to be the author's lost JSON. Three failed material planes are reconstructable
from explicit final fix-evidence. Two first attempts remain metadata-only.
"""
from __future__ import annotations
import argparse
import copy
import hashlib
import importlib.util
import json
import shutil
import sys
import tempfile
from pathlib import Path

ARMS = {"B1": 212, "B3": 213, "D1": 214}


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def json_bytes(value) -> bytes:
    return (json.dumps(value, indent=2) + "\n").encode()


def bundle(root: Path, pr: int) -> Path:
    matches = list(root.glob(f"PR-{pr:04d}-*/cybersand-canvases/*/*/astra-trial-001/operations.json"))
    if len(matches) != 1:
        raise ValueError(f"Expected one frozen candidate bundle for PR {pr}")
    return matches[0].parent


def inverse_operations(arm: str, final: dict) -> tuple[dict, str]:
    ops = copy.deepcopy(final)
    if arm == "D1":
        values = ops["groups"][-1]["operations"]
        if values[0] != ["R", 930, 1010, 6, 289, 49] or values[13] != ["R", 701, 1288, 237, 5, 62]:
            raise ValueError("Unexpected D1 locked operations")
        values[0][3] = 8
        values[13][4] = 10
        method = "Inverse of exact final fix-evidence: restore right spine width 8 and lower base height 10."
    elif arm == "B1":
        values = ops["groups"][0]["operations"]
        if len(values) != 8:
            raise ValueError("Unexpected B1 locked operations")
        for op in values[:5]:
            op[2] -= 51
            if op[0] == "L":
                op[4] -= 51
        for op in values[5:7]:
            op[2] -= 51
        method = "Inverse of exact final fix-evidence: raise cradle and upper rail endpoints by 51; lower handoff fixed."
    elif arm == "B3":
        ops["groups"][1]["operations"].append(["L", 805, 584, 843, 565, 8, 62])
        method = "Restore explicitly removed terminal [805,584] to [843,565]; thickness 8 is confirmed by the frozen full-plane and Setup hashes."
    else:
        raise ValueError("No documented inverse for this arm")
    return ops, method


def recover(root: Path, master_path: Path, out: Path, execute_validation: bool) -> dict:
    master = json.loads(master_path.read_text())
    lookup = {}
    for artifact in master["artifacts"]:
        path = root / artifact["recovery_location"]
        data = path.read_bytes()
        if digest(data) != artifact["sha256"]:
            raise ValueError(f"Source archive byte drift: {path}")
        lookup.setdefault(artifact["sha256"], (data, artifact["recovery_location"]))
    ledger = next(root.glob("PR-0209-*")) / "docs/corpus/astra-trial-001/author-handoff.v1.json"
    handoff = json.loads(ledger.read_text())
    final = bundle(root, 214)
    # Executed helpers are themselves frozen, byte-verified source artifacts.
    for filename in ("geometry_core.py", "reproduce.py", "validate.py"):
        if digest((final / filename).read_bytes()) not in lookup:
            raise ValueError("Unverified reconstruction helper")
    sys.path.insert(0, str(final))
    rep_spec = importlib.util.spec_from_file_location("custody_frozen_reproduce", final / "reproduce.py")
    rep = importlib.util.module_from_spec(rep_spec)
    rep_spec.loader.exec_module(rep)
    val_spec = importlib.util.spec_from_file_location("custody_frozen_validate", final / "validate.py")
    validator = importlib.util.module_from_spec(val_spec)
    val_spec.loader.exec_module(validator)
    attempts = []
    out.mkdir(parents=True, exist_ok=True)
    for old in handoff["failed_attempts_retained"]:
        arm, number = old["arm"], old["attempt"]
        key = f"{arm}-{number:03d}"
        authority = bundle(root, ARMS[arm])
        expected = {x["path"]: x for x in old["files"]}
        cfg = json.loads((authority / "build-config.json").read_text())
        cfg["attempt"] = number
        cfg["expected_candidate_material_plane_sha256_uint8"] = old["cell_difference"]["after_material_plane_sha256_uint8"]
        config_bytes = json_bytes(cfg)
        if digest(config_bytes) != expected["build-config.json"]["sha256"]:
            raise ValueError(f"Failed build-config reconstruction hash mismatch: {key}")
        generated = {"build-config.json": config_bytes,
                     "cell-diff.json": json_bytes(old["cell_difference"])}
        evidence = None
        method = "Only unchanged files and exact build-config recovered; failed geometry is not available."
        may_reconstruct = (arm, number) in (("D1", 1), ("B1", 2), ("B3", 2))
        if may_reconstruct:
            ops, method = inverse_operations(arm, json.loads((authority / "operations.json").read_text()))
            with tempfile.TemporaryDirectory(prefix="goldmaps-failed-recovery-") as temp:
                staged = Path(temp) / "bundle"
                shutil.copytree(authority, staged)
                (staged / "build-config.json").write_bytes(config_bytes)
                (staged / "operations.json").write_bytes(json_bytes(ops))
                result = rep.build(staged, staged)
                if result["cell_difference"] != old["cell_difference"]:
                    raise ValueError(f"Historical material-plane result mismatch: {key}")
                validation = validator.validate(staged) if execute_validation else None
                if validation is not None:
                    if validation["status"] != "FAIL" or validation["issues"] != old["issues"]:
                        raise ValueError(f"Historical failure does not reproduce: {key}")
                for path in expected:
                    f = staged / path
                    if f.is_file():
                        generated[path] = f.read_bytes()
                derived = out / key / "RECONSTRUCTION-INPUTS"
                derived.mkdir(parents=True, exist_ok=True)
                (derived / "operations.derived.json").write_bytes(json_bytes(ops))
                evidence = {
                    "frozen_setup_sha256": expected["setup.json"]["sha256"],
                    "reconstructed_setup_sha256": digest((staged / "setup.json").read_bytes()),
                    "material_plane_sha256": result["cell_difference"]["after_material_plane_sha256_uint8"],
                    "changed_cells": result["cell_difference"]["changed_cells"],
                    "failure_reexecuted": validation is not None,
                    "observed_issues": validation["issues"] if validation else None,
                    "reconstruction_input": f"{key}/RECONSTRUCTION-INPUTS/operations.derived.json",
                    "operations_are_exact_historical_bytes": digest(json_bytes(ops)) == expected["operations.json"]["sha256"],
                }
        files = []
        for path, pinned in expected.items():
            row = {**pinned, "status": "UNRECOVERED_HASH_RECORD_ONLY", "recovery_location": None}
            if pinned["sha256"] in lookup:
                _, archive_path = lookup[pinned["sha256"]]
                row.update(status="RECOVERED_BYTE_IDENTICAL_SHARED", recovery_location=f"source-archive:{archive_path}")
            elif path in generated and digest(generated[path]) == pinned["sha256"] and len(generated[path]) == pinned["bytes"]:
                recovered = out / key / path
                recovered.parent.mkdir(parents=True, exist_ok=True)
                recovered.write_bytes(generated[path])
                row.update(status="RECONSTRUCTED_EXACT_FROZEN_BYTES", recovery_location=f"{key}/{path}")
            files.append(row)
        attempts.append({"arm": arm, "attempt": number, "historical_status": old["status"],
                         "historical_issues": old["issues"], "historical_cell_difference": old["cell_difference"],
                         "reconstruction_method": method, "reexecution": evidence,
                         "files": files, "original_historical_manifest_unchanged": True})
    recovered_count = sum(f["status"] != "UNRECOVERED_HASH_RECORD_ONLY" for a in attempts for f in a["files"])
    missing_count = sum(f["status"] == "UNRECOVERED_HASH_RECORD_ONLY" for a in attempts for f in a["files"])
    report = {"schema_version": "goldmaps-failed-attempt-custody.v1", "status": "PARTIAL_RECOVERY_EXPLICIT_GAPS",
              "historical_handoff_source": "https://github.com/techrote/sandmapsreference/blob/5982fa553bc6356742cfea0911c848c372dcdb97/docs/corpus/astra-trial-001/author-handoff.v1.json",
              "historical_handoff_sha256": digest(ledger.read_bytes()),
              "five_failed_attempt_records_preserved": True, "failed_setup_bytes_recovered": 3,
              "failed_setup_bytes_unavailable": 2, "recovered_file_occurrences": recovered_count,
              "unrecovered_file_occurrences": missing_count, "attempts": attempts,
              "limits": ["B1 attempt 1 and B3 attempt 1 unique geometry has no surviving recovered bytes or fully specified inverse; no substitute invented",
                         "Derived B1/B3 operations metadata is not the author's original operations.json, although resulting Setup bytes match its frozen hash",
                         "Historical input-access and attempt-history logs are hash records only unless separately recovered",
                         "Reexecuted source-static failures do not claim native gameplay"]}
    (out / "failed-attempt-custody.v1.json").write_bytes(json_bytes(report))
    return report


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--source-root", required=True, type=Path)
    ap.add_argument("--master", required=True, type=Path)
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--execute-validation", action="store_true")
    args = ap.parse_args()
    result = recover(args.source_root, args.master, args.out, args.execute_validation)
    print(json.dumps({k: v for k, v in result.items() if k not in ("attempts",)}, indent=2))


if __name__ == "__main__":
    main()
