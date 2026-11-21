"""Validate native receipts and build a complete manifest-bound evidence ZIP."""
from __future__ import annotations

import argparse
import json
import math
import os
from pathlib import Path
import re
import zipfile

from .common import (ENGINE_REPOSITORY, REPOSITORY, SCHEMA, IntegrityError,
                     canonical_bytes, load_json, record_id, require, safe_path,
                     safe_zip, sha256, validate_record, write_json)

ERROR_PATTERN = re.compile(r"(?im)(?:^|\s)(?:SCRIPT ERROR|ERROR|CANVAS_NATIVE_FAIL):?\s")


def verify_head_observation(observation: dict, head_sha: str) -> str:
    require(isinstance(observation, dict) and observation.get("expected_head_sha") == head_sha,
            "HEAD observation expected-source mismatch")
    state, observed = observation.get("state"), observation.get("observed_head_sha")
    if state == "VERIFIED_CURRENT":
        require(observed == head_sha and observation.get("pr_state") == "open", "contradictory current HEAD observation")
    elif state == "STALE_CONFIRMED":
        require(isinstance(observed, str) and bool(re.fullmatch(r"[0-9a-f]{40}", observed)) and observed != head_sha,
                "stale classification lacks a changed HEAD")
    elif state == "CLOSED":
        require(observation.get("pr_state") == "closed", "closed classification lacks closed PR")
    elif state == "UNVERIFIED":
        require(observed is None, "unverified observation asserts an observed HEAD")
    else:
        raise IntegrityError("unknown HEAD observation")
    return state


def verify_manifest(files: dict[str, bytes]) -> dict:
    require("manifest.json" in files, "missing evidence manifest")
    manifest = load_json(files["manifest.json"])
    require(manifest.get("schema") == "cybersand-native-files-v1", "manifest schema mismatch")
    entries = manifest.get("files")
    require(isinstance(entries, list), "missing file inventory")
    listed = set()
    for entry in entries:
        path = safe_path(entry.get("path"))
        require(path != "manifest.json" and path not in listed, "duplicate/self manifest entry")
        listed.add(path)
        require(path in files, "manifest member missing: " + path)
        require(type(entry.get("bytes")) is int and len(files[path]) == entry["bytes"], "manifest size mismatch")
        require(sha256(files[path]) == entry.get("sha256"), "manifest digest mismatch: " + path)
    require(listed == set(files) - {"manifest.json"}, "unmanifested archive member")
    return manifest


def marker(raw: bytes, expected: str) -> dict:
    try:
        text = raw.decode("utf-8-sig")
    except UnicodeError as exc:
        raise IntegrityError("non-UTF8 native log") from exc
    hits = [line[len(expected) + 1:] for line in text.splitlines() if line.startswith(expected + " ")]
    require(len(hits) == 1, "missing/ambiguous " + expected + " receipt")
    return load_json(hits[0])


def _phase(phase: dict, name: str, files: dict[str, bytes], m: dict) -> dict:
    require(isinstance(phase, dict), "missing " + name + " phase")
    require(type(phase.get("exit_code")) is int and phase["exit_code"] == 0, "nonzero/invalid process exit")
    require(phase.get("timeout") is False, "timed-out/incomplete process")
    require(type(phase.get("pid")) is int and phase["pid"] > 0, "missing process identity")
    logs = {}
    for channel in ("stdout", "stderr"):
        path = safe_path(phase.get(channel))
        require(path in files, "missing native log: " + path)
        logs[channel] = files[path]
        require(sha256(files[path]) == phase.get(channel + "_sha256"), "native log digest mismatch")
        require(not ERROR_PATTERN.search(files[path].decode("utf-8-sig")), "unexpected Godot error in log")
    receipt = marker(logs["stdout"], "CANVAS_NATIVE_EVIDENCE")
    require(receipt == phase.get("receipt"), "embedded/raw native receipt contradiction")
    require(receipt.get("phase") == name and receipt.get("errors") == [], "wrong/error native phase")
    require(receipt.get("version") == "4.7-stable (official)" or str(receipt.get("version", "")).startswith("4.7.stable."), "wrong native Godot version")
    for field in ("source_parse", "native_bridge", "load", "full_grid", "published_image",
                  "actor_adopted", "rapier_space_valid"):
        require(receipt.get(field) is True, "native receipt missing " + field)
    require(receipt.get("worker_failed") is False, "native worker failed")
    require(receipt.get("extent") == [2048, 1024], "native extent mismatch")
    require(type(receipt.get("rectangles")) is int and receipt["rectangles"] == m["rectangle_count"], "native rectangle count mismatch")
    grid = receipt.get("grid_check", {})
    require(grid.get("ok") is True and type(grid.get("pixels")) is int and grid["pixels"] == 2097152,
            "incomplete full-grid comparison")
    require(type(grid.get("mismatches")) is int and grid["mismatches"] == 0, "native grid mismatch")
    # The official console executable launches the engine process. Its child PID
    # is different from the wrapper PID recorded by subprocess.Popen.
    require(type(receipt.get("process_id")) is int and receipt["process_id"] > 0, "missing Godot process identity")
    if name == "load":
        for field in ("physics_tick", "midge_drive", "save_readback"):
            require(receipt.get(field) is True, "native load missing " + field)
        distance = receipt.get("midge_displacement_cells")
        require(type(distance) in (int, float) and math.isfinite(distance) and distance > 0.05,
                "directed Midge movement missing")
        start, end = receipt.get("drive_start"), receipt.get("drive_end")
        require(isinstance(start, list) and isinstance(end, list) and len(start) == len(end) == 2 and
                all(type(v) in (int, float) and math.isfinite(v) for v in start + end), "Midge control coordinates missing")
        projection = receipt.get("directed_up_displacement_cells")
        require(receipt.get("drive_key") == "W" and type(receipt.get("drive_ticks_elapsed")) is int and
                receipt["drive_ticks_elapsed"] >= 20 and type(projection) in (int, float) and
                math.isfinite(projection) and projection > 0.05 and
                math.isclose(projection, start[1] - end[1], abs_tol=1e-5), "directed W thrust was not demonstrated")
    else:
        require(receipt.get("fresh_reopen") is True, "fresh-process reopen missing")
    return receipt


def native_records(files: dict[str, bytes], artifact: dict | None = None) -> tuple[dict, list[dict]]:
    require("run.json" in files, "missing run manifest")
    run = load_json(files["run.json"])
    require(run.get("schema") == "cybersand-native-run-v1", "run schema mismatch")
    require(run.get("complete") is True and run.get("errors") == [], "incomplete qualification run")
    execution = run.get("execution", {})
    require(execution.get("origin") == "github-hosted-windows", "wrong hosted execution origin")
    require(execution.get("repository") == REPOSITORY, "wrong producer repository")
    require(str(execution.get("runner_os", "")).lower() == "windows", "not Windows execution")
    require(execution.get("runner_environment") == "github-hosted", "not standard hosted execution")
    runtime = run.get("runtime", {})
    require(runtime.get("repository") == ENGINE_REPOSITORY, "wrong engine repository")
    require("candidate-provenance.json" in files, "native candidate manifest missing")
    candidate = load_json(files["candidate-provenance.json"])
    require(sha256(files["candidate-provenance.json"]) == runtime.get("provenance", {}).get("candidate_manifest_sha256"), "candidate manifest digest mismatch")
    require(candidate.get("schema_version") == 1 and candidate.get("kind") == "source-built-windows-candidate", "unexpected native candidate kind")
    require(candidate.get("source_commit") == candidate.get("build_commit") == runtime.get("engine_sha"), "candidate engine source mismatch")
    require(candidate.get("source_tree") == runtime.get("source_tree_sha") and candidate.get("sha256") == runtime.get("native_dll_sha256"), "candidate source/DLL identity mismatch")
    require(candidate.get("source_inputs") == runtime.get("provenance", {}).get("source_inputs"), "candidate native inputs mismatch")
    paths = run.get("qualifications")
    require(isinstance(paths, list) and 1 <= len(paths) <= 6 and len(set(paths)) == len(paths), "invalid pilot qualification inventory")
    selection = run.get("selection", [])
    require(isinstance(selection, list) and len(selection) == len(paths), "selection/receipt inventory mismatch")
    by_identity = {(m["pr"], m["head_sha"], m["setup_path"], m["setup_sha256"]): m for m in selection}
    require(len(by_identity) == len(selection), "duplicate selected fixture")
    records = []
    seen = set()
    for path in paths:
        safe_path(path)
        require(path in files, "missing qualification receipt")
        q = load_json(files[path])
        require(q.get("schema") == "cybersand-native-qualification-v1", "qualification schema mismatch")
        m = q.get("map", {})
        key = (m.get("pr"), m.get("head_sha"), m.get("setup_path"), m.get("setup_sha256"))
        require(key in by_identity and key not in seen, "receipt refers to wrong/duplicate PR or Setup")
        require(m == by_identity[key], "selection/receipt map identity mismatch")
        seen.add(key)
        require(q.get("runtime") == runtime, "receipt/run runtime mismatch")
        before_state = verify_head_observation(q.get("head_before"), m["head_sha"])
        after_state = verify_head_observation(q.get("head_after"), m["head_sha"])
        original_path = safe_path(q.get("original_setup_path"))
        require(original_path in files, "missing original Setup bytes")
        original = files[original_path]
        require(sha256(original) == m.get("setup_sha256") and len(original) == m.get("setup_bytes"), "Setup byte identity mismatch")
        setup = load_json(original)
        require(setup.get("extent") == [2048, 1024] and setup.get("version") == 2, "Setup-v2 contract mismatch")
        require(len(setup.get("edits", [])) == m.get("rectangle_count"), "Setup count mismatch")
        status = q.get("status")
        native_status = q.get("native_status")
        if native_status == "PASS_BASIC_NATIVE":
            a = _phase(q.get("load_evidence"), "load", files, m)
            b = _phase(q.get("reopen_evidence"), "reopen", files, m)
            require(q["load_evidence"]["pid"] != q["reopen_evidence"]["pid"], "reopen did not use a fresh process")
            require(a["process_id"] != b["process_id"], "reopen reused the Godot process")
            saved_path = safe_path(q.get("saved_setup_path"))
            require(saved_path in files, "saved copy bytes absent")
            saved = files[saved_path]
            require(sha256(saved) == q.get("saved_setup_sha256"), "saved copy digest mismatch")
            saved_doc = load_json(saved)
            for field in ("extent", "edits", "actors"):
                require(saved_doc.get(field) == setup.get(field), "saved starting setup changed: " + field)
            require(a.get("setup_sha256") == m["setup_sha256"], "load used wrong source Setup")
            require(b.get("setup_sha256") == sha256(saved), "reopen used wrong saved file")
            require(b.get("active_label") == a.get("saved_label") == b.get("saved_label"), "saved/reopen label mismatch")
            require(a.get("midge_id") == b.get("midge_id") == setup["actors"][0]["id"], "native actor identity mismatch")
            state = after_state
            expected = {"VERIFIED_CURRENT": "PASS_BASIC_NATIVE", "UNVERIFIED": "NATIVE_PASS_PENDING_HEAD",
                        "STALE_CONFIRMED": "STALE_CONFIRMED", "CLOSED": "CLOSED"}.get(state)
            require(status == expected, "HEAD verification/status contradiction")
            require(before_state == "VERIFIED_CURRENT", "native pass lacks initial HEAD verification")
        else:
            require(status != "PASS_BASIC_NATIVE", "success claimed without valid native receipt")
            require(native_status in ("FAIL_NATIVE", "UNTESTED"), "invalid native result")
        ev = {"receipt_path": path, "receipt_sha256": sha256(files[path]),
              "validation": "complete", "publication": "validated-unpublished"}
        if artifact:
            ev.update(artifact)
            ev["publication"] = "published"
        record_execution = dict(execution)
        if artifact:
            record_execution["evidence_id"] = str(artifact["artifact_id"])
        record = {"schema": SCHEMA, "map": m, "runtime": runtime, "execution": record_execution,
                  "qualification": {"basic_native": status, "collision": "UNTESTED", "hazards": "UNTESTED", "gui": "UNTESTED"},
                  "head_verification": {"before": q.get("head_before"), "after": q.get("head_after")},
                  "evidence": ev,
                  "provenance": {"quality": "raw-evidence-verified", "runtime_identity": "source-and-binary-verified",
                                 "missing_evidence": [], "native_status": native_status}}
        record["record_id"] = record_id(record)
        validate_record(record, require_published=bool(artifact))
        records.append(record)
    return run, records


def verify_archive(path_or_bytes, artifact=None):
    files = safe_zip(path_or_bytes)
    verify_manifest(files)
    run, records = native_records(files, artifact)
    return files, run, records


def export(directory: Path, output: Path) -> dict:
    directory = directory.resolve()
    files = {}
    secrets = [os.environ.get(x, "") for x in ("GITHUB_TOKEN", "GH_TOKEN", "ACTIONS_RUNTIME_TOKEN")]
    for path in sorted(directory.rglob("*")):
        require(not path.is_symlink(), "evidence symlink")
        if not path.is_file():
            continue
        name = safe_path(path.relative_to(directory).as_posix())
        require(name != "manifest.json", "preexisting manifest")
        require(path.stat().st_size <= 32 * 1024 * 1024, "oversized evidence member")
        data = path.read_bytes()
        require(not any(s and len(s) >= 12 and s.encode() in data for s in secrets), "secret detected in evidence")
        require(not re.search(rb"(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{30,})", data), "credential-shaped evidence")
        files[name] = data
    try:
        run, records = native_records(files)
        validation = {"schema": "cybersand-native-validation-v1", "status": "VALIDATED",
                      "records": len(records), "statuses": [r["qualification"]["basic_native"] for r in records],
                      "missing_evidence": [], "publication": "NOT_YET_PUBLISHED"}
    except (IntegrityError, KeyError, TypeError, IndexError) as exc:
        validation = {"schema": "cybersand-native-validation-v1", "status": "REJECTED",
                      "records": 0, "statuses": [], "missing_evidence": [str(exc)[:300]],
                      "publication": "FORBIDDEN_INCOMPLETE_EVIDENCE"}
    files["validation.json"] = canonical_bytes(validation)
    files["manifest.json"] = canonical_bytes({"schema": "cybersand-native-files-v1", "files": [
        {"path": name, "bytes": len(data), "sha256": sha256(data)} for name, data in sorted(files.items())]})
    output.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(output, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
        for name, data in sorted(files.items()):
            info = zipfile.ZipInfo(name, (2020, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            archive.writestr(info, data)
    # Read the actual completed ZIP back. In-memory generation is not integrity proof.
    verified_files = safe_zip(output)
    verify_manifest(verified_files)
    if validation["status"] == "VALIDATED":
        native_records(verified_files)
    return {**validation, "archive_sha256": sha256(output.read_bytes()), "archive_bytes": output.stat().st_size}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)
    pack = sub.add_parser("export")
    pack.add_argument("--directory", type=Path, required=True)
    pack.add_argument("--output", type=Path, required=True)
    check = sub.add_parser("verify")
    check.add_argument("archive", type=Path)
    args = parser.parse_args()
    try:
        if args.command == "export":
            result = export(args.directory, args.output)
        else:
            _, run, records = verify_archive(args.archive)
            result = {"status": "VALIDATED", "records": len(records), "archive_sha256": sha256(args.archive.read_bytes())}
        print(json.dumps(result, sort_keys=True))
        if result.get("status") == "REJECTED":
            raise SystemExit(2)
    except (IntegrityError, OSError) as exc:
        print(json.dumps({"status": "REJECTED", "error": str(exc)}))
        raise SystemExit(2)


if __name__ == "__main__":
    main()
