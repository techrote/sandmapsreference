"""Offline, fail-closed import of Fleet v1.4 owner-Windows evidence.

This module never contacts GitHub or launches Godot.  A verified historical
observation remains owner-local evidence at its original verification time.
Run ``python -m tools.native_admission.history --help`` for the dry-run CLI.
"""

from __future__ import annotations

import argparse
import hashlib
import io
import json
import math
import os
from pathlib import Path, PurePosixPath
import re
import stat
import sys
import tempfile
import zipfile

from .common import validate_record


MAP_REPOSITORY = "techrote/sandmapsreference"
ENGINE_REPOSITORY = "techrote/cybersand"
MAX_ARCHIVE_BYTES = 64 * 1024 * 1024
MAX_EXPANDED_BYTES = 128 * 1024 * 1024
MAX_MEMBER_BYTES = 16 * 1024 * 1024
MAX_FILES = 4096
RUN_RE = re.compile(r"[0-9]{8}-[0-9]{6}-[0-9a-f]{6}\Z")
SHA_RE = re.compile(r"[0-9a-f]{64}\Z")
COMMIT_RE = re.compile(r"[0-9a-f]{40}\Z")
MARKER_RE = re.compile(r"^CANVAS_NATIVE_EVIDENCE (\{[^\r\n]*\})\r?$", re.M)
WINDOWS_RESERVED = re.compile(r"(?:CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\..*)?\Z", re.I)


class HistoryError(ValueError):
    """An archive cannot support a trustworthy historical observation."""


def _require(condition: bool, message: str) -> None:
    if not condition:
        raise HistoryError(message)


def _sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def _canonical(value: object) -> bytes:
    return (json.dumps(value, sort_keys=True, separators=(",", ":"),
                       ensure_ascii=True, allow_nan=False) + "\n").encode("utf-8")


def _json(data: bytes) -> object:
    _require(len(data) <= MAX_MEMBER_BYTES, "JSON exceeds size limit")

    def pairs(items):
        result = {}
        for key, value in items:
            _require(key not in result, "Duplicate JSON key")
            result[key] = value
        return result

    def constant(_):
        raise HistoryError("Non-finite JSON number")

    try:
        value = json.loads(data.decode("utf-8-sig"), object_pairs_hook=pairs,
                           parse_constant=constant)
    except HistoryError:
        raise
    except (UnicodeError, json.JSONDecodeError, RecursionError, ValueError) as exc:
        raise HistoryError("Invalid JSON") from exc
    pending = [(value, 0)]
    nodes = 0
    while pending:
        node, depth = pending.pop()
        nodes += 1
        _require(depth <= 48 and nodes <= 1_000_000, "JSON structure exceeds limits")
        if isinstance(node, dict):
            _require(not any(any(0xD800 <= ord(c) <= 0xDFFF for c in key) for key in node), "Invalid JSON Unicode")
            pending.extend((v, depth + 1) for v in node.values())
        elif isinstance(node, list):
            pending.extend((v, depth + 1) for v in node)
        elif isinstance(node, float):
            _require(math.isfinite(node), "Non-finite JSON number")
        elif isinstance(node, str):
            _require(not any(0xD800 <= ord(c) <= 0xDFFF for c in node), "Invalid JSON Unicode")
    return value


def _integer(value, minimum=0, maximum=2**53 - 1) -> bool:
    return type(value) is int and minimum <= value <= maximum


def _hash(value, size=64) -> bool:
    return isinstance(value, str) and bool((SHA_RE if size == 64 else COMMIT_RE).fullmatch(value))


def _path(value: str) -> str:
    _require(isinstance(value, str) and 0 < len(value) <= 512, "Invalid evidence path")
    _require(not any(ord(c) < 32 for c in value) and "\\" not in value and ":" not in value,
             "Unsafe evidence path")
    parts = value.split("/")
    _require(all(p and p not in (".", "..") and not p.endswith((".", " "))
                 and not WINDOWS_RESERVED.fullmatch(p) for p in parts), "Unsafe evidence path")
    _require(not PurePosixPath(value).is_absolute(), "Absolute evidence path")
    return value


def _archive(path: Path) -> tuple[dict[str, bytes], str]:
    _require(path.is_file() and not path.is_symlink(), "Input archive must be a regular file")
    _require(path.stat().st_size <= MAX_ARCHIVE_BYTES, "Archive exceeds size limit")
    data = path.read_bytes()
    _require(len(data) <= MAX_ARCHIVE_BYTES, "Archive exceeds size limit")
    files: dict[str, bytes] = {}
    seen = set()
    expanded = 0
    try:
        with zipfile.ZipFile(io.BytesIO(data)) as archive:
            entries = archive.infolist()
            _require(0 < len(entries) <= MAX_FILES, "Archive member limit exceeded")
            for entry in entries:
                name = entry.filename[:-1] if entry.is_dir() else entry.filename
                _path(name)
                folded = name.casefold()
                _require(folded not in seen, "Duplicate or case-colliding archive path")
                seen.add(folded)
                mode = stat.S_IFMT(entry.external_attr >> 16)
                _require(mode in (0, stat.S_IFREG, stat.S_IFDIR), "Archive links/devices are forbidden")
                _require(not entry.flag_bits & 1, "Encrypted archives are unsupported")
                if entry.is_dir():
                    _require(entry.file_size == 0, "Directory has file content")
                    continue
                _require(mode != stat.S_IFDIR, "Archive file type contradiction")
                _require(entry.file_size <= MAX_MEMBER_BYTES, "Archive member exceeds size limit")
                expanded += entry.file_size
                _require(expanded <= MAX_EXPANDED_BYTES, "Archive expanded-size limit exceeded")
                _require(entry.file_size <= max(1024 * 1024, entry.compress_size * 1000),
                         "Archive compression ratio exceeds limit")
                content = archive.read(entry)
                _require(len(content) == entry.file_size, "Archive member size mismatch")
                files[name] = content
    except (zipfile.BadZipFile, RuntimeError, OSError) as exc:
        raise HistoryError("Unreadable or corrupt evidence ZIP") from exc
    return files, _sha(data)


def _verified_archive(path: Path, expected_sha256: str | None):
    files, archive_sha = _archive(path)
    if expected_sha256 is not None:
        _require(_hash(expected_sha256) and archive_sha == expected_sha256,
                 "Archive SHA-256 does not match expected digest")
    roots = {name.split("/", 1)[0] for name in files}
    _require(len(roots) == 1, "Expected exactly one Fleet run root")
    run_id = next(iter(roots))
    _require(bool(RUN_RE.fullmatch(run_id)), "Invalid Fleet run directory")
    prefix = run_id + "/"
    files = {name[len(prefix):]: content for name, content in files.items()}
    manifest_data = files.get("evidence-files.sha256.json")
    _require(manifest_data is not None, "Evidence SHA-256 manifest missing")
    manifest = _json(manifest_data)
    _require(isinstance(manifest, dict) and manifest.get("schema") == "cybersand-fleet-evidence-file-list-v1.4.2"
             and manifest.get("run_id") == run_id, "Unsupported or mismatched Fleet manifest")
    entries = manifest.get("files")
    _require(isinstance(entries, list) and len(entries) <= MAX_FILES, "Malformed evidence manifest")
    listed = set()
    for entry in entries:
        _require(isinstance(entry, dict), "Malformed evidence manifest entry")
        name = _path(entry.get("path"))
        _require(name not in listed and name != "evidence-files.sha256.json", "Duplicate/self-listed manifest path")
        listed.add(name)
        _require(_integer(entry.get("bytes")) and _hash(entry.get("sha256")), "Malformed manifest digest/size")
        content = files.get(name)
        _require(content is not None, "Manifest file missing: " + name)
        _require(len(content) == entry["bytes"] and _sha(content) == entry["sha256"],
                 "Manifest digest/size mismatch: " + name)
    _require(listed == set(files) - {"evidence-files.sha256.json"}, "Unmanifested archive files")
    # Parse every JSON member, including preserved snapshots, before trusting any.
    for name, content in files.items():
        if name.endswith((".json", ".json.last-good")):
            _json(content)
    return files, archive_sha, run_id


def _object(files, name):
    _require(name in files, "Required evidence missing: " + name)
    result = _json(files[name])
    _require(isinstance(result, dict), "Expected JSON object: " + name)
    return result


def _identity(record):
    _require(isinstance(record, dict), "Malformed qualification record")
    _require(_integer(record.get("pr"), 1), "Invalid PR number")
    for key in ("head_sha", "pinned_engine_sha", "setup_blob_sha"):
        _require(_hash(record.get(key), 40), "Invalid " + key)
    for key in ("native_sha256", "setup_sha256"):
        _require(_hash(record.get(key)), "Invalid " + key)
    _path(record.get("setup_path"))
    _require(record["setup_path"].endswith(".json"), "Setup must be JSON data")
    _require(_integer(record.get("rectangle_count"), 0, 32768), "Invalid rectangle count")
    _require(_integer(record.get("setup_bytes"), 1, MAX_MEMBER_BYTES), "Invalid Setup size")
    _require(isinstance(record.get("godot_version"), str) and record["godot_version"].startswith("4.7"),
             "Unsupported Godot version")
    key = "|".join(str(record[k]) for k in ("pr", "head_sha", "setup_path", "pinned_engine_sha", "native_sha256"))
    _require(record.get("key") == key, "Exact map/runtime qualification key mismatch")
    return key


def _phase(files, directory, name, record, task):
    phase = record.get(name + "_evidence")
    _require(isinstance(phase, dict) and type(phase.get("exit_code")) is int and phase["exit_code"] == 0,
             name + " process did not exit successfully")
    raw = {}
    for stream in ("stdout", "stderr"):
        filename = directory + "/" + name + "." + stream + ".log"
        _require(filename in files and _hash(phase.get(stream + "_sha256")), name + " log/digest missing")
        raw[stream] = files[filename]
        _require(_sha(raw[stream]) == phase[stream + "_sha256"], name + " log SHA mismatch")
    _require(raw["stderr"] == b"", name + " unexpected Godot stderr")
    try:
        stdout = raw["stdout"].decode("utf-8-sig")
    except UnicodeError as exc:
        raise HistoryError(name + " invalid stdout encoding") from exc
    uncolored = re.sub(r"\x1b\[[0-?]*[ -/]*[@-~]", "", stdout)
    _require(not re.search(r"(?:^|\n)\s*(?:SCRIPT ERROR|ERROR|CANVAS_NATIVE_FAIL):?", uncolored),
             name + " unexpected Godot error")
    markers = MARKER_RE.findall(stdout)
    _require(len(markers) == 1, name + " needs exactly one native receipt")
    receipt = _json(markers[0].encode("utf-8"))
    _require(isinstance(receipt, dict) and _canonical(receipt) == _canonical(phase.get("receipt")), name + " raw/embedded receipt disagreement")
    _require(receipt.get("phase") == name and receipt.get("label") == task["label"], name + " source label/phase mismatch")
    for key in ("native_bridge", "source_parse", "load", "full_grid", "published_image", "actor_adopted", "rapier_space_valid"):
        _require(receipt.get(key) is True, name + " missing " + key)
    _require(receipt.get("worker_failed") is False and receipt.get("errors") == [], name + " native worker error")
    _require(receipt.get("extent") == [2048, 1024] and all(type(n) is int for n in receipt["extent"]), name + " extent mismatch")
    _require(type(receipt.get("rectangles")) is int and receipt["rectangles"] == record["rectangle_count"], name + " rectangle mismatch")
    grid = receipt.get("grid_check")
    _require(isinstance(grid, dict) and grid.get("ok") is True
             and type(grid.get("pixels")) is int and grid["pixels"] == 2097152
             and type(grid.get("mismatches")) is int and grid["mismatches"] == 0, name + " full-grid comparison failed")
    if name == "load":
        for key in ("physics_tick", "midge_drive", "save_readback"):
            _require(receipt.get(key) is True, name + " missing " + key)
        displacement = receipt.get("midge_displacement_cells")
        _require(type(displacement) in (int, float) and math.isfinite(displacement) and displacement > 0.05,
                 "Midge displacement was not observed")
        _require(receipt.get("saved_label") == task["saved_label"], "Saved-copy label mismatch")
    else:
        _require(receipt.get("fresh_reopen") is True, "Fresh-process reopen missing")
    return receipt


def _native(files, directory, record, summary, provenance):
    key = _identity(record)
    task = _object(files, directory + "/worker-task.json")
    _require(task.get("schema") == "cybersand-fleet-worker-task-v1.4", "Unsupported worker-task schema")
    for field in ("key", "pr", "head_sha", "setup_path", "setup_blob_sha", "setup_sha256", "setup_bytes", "rectangle_count", "native_sha256", "godot_version"):
        _require(_canonical(task.get(field)) == _canonical(record[field]), "Worker/receipt identity mismatch: " + field)
    engine = record["pinned_engine_sha"]
    _require(task.get("engine_sha") == engine == summary.get("runtime_engine_sha") == provenance.get("pinned_engine_sha"),
             "Engine identity mismatch")
    _require(record["native_sha256"] == provenance.get("native_dll_sha256"), "Native DLL identity mismatch")
    for task_key, provenance_key in (("rapier_sha256", "rapier_dll_sha256"), ("godot_sha256", "godot_binary_sha256")):
        _require(_hash(task.get(task_key)) and task[task_key] == provenance.get(provenance_key), "Runtime binary identity mismatch")
    _require(task["godot_version"] == provenance.get("godot_version"), "Godot identity mismatch")
    _require(_hash(task.get("runner_sha256")), "Runner hash missing")
    label = task.get("label")
    _require(isinstance(label, str) and bool(re.fullmatch(r"fleet-pr[0-9]+-[0-9a-f]{8}-[0-9]+-[0-9a-f]{6}", label)), "Unsafe source label")
    _require(task.get("saved_label") == label + "-native-copy", "Wrong saved-copy label")
    _require(label.startswith(f"fleet-pr{record['pr']}-{record['head_sha'][:8]}-"), "Label map identity mismatch")
    filename = directory + "/original-setup.json"
    _require(filename in files, "Original Setup bytes missing")
    data = files[filename]
    _require(_sha(data) == record["setup_sha256"] and len(data) == record["setup_bytes"], "Original Setup digest/size mismatch")
    blob = hashlib.sha1(b"blob " + str(len(data)).encode("ascii") + b"\0" + data).hexdigest()
    _require(blob == record["setup_blob_sha"], "Original Setup Git blob mismatch")
    setup = _json(data)
    _require(isinstance(setup, dict) and type(setup.get("version")) is int and setup["version"] == 2
             and setup.get("extent") == [2048, 1024] and all(type(x) is int for x in setup["extent"]), "Original Setup-v2 dimensions mismatch")
    _require(isinstance(setup.get("edits"), list) and len(setup["edits"]) == record["rectangle_count"], "Original Setup rectangle count mismatch")
    _require(isinstance(setup.get("actors"), list) and any(isinstance(a, dict) and a.get("model") == "midge" for a in setup["actors"]), "No authored Midge actor")
    for edit in setup["edits"]:
        _require(isinstance(edit, list) and len(edit) in (4, 5) and all(_integer(n, 0, 32768) for n in edit), "Invalid Setup edit")
        if len(edit) == 5:
            x, y, width, height, material = edit
            _require(width > 0 and height > 0 and x + width <= 2048 and y + height <= 1024 and material <= 255, "Out-of-bounds Setup rectangle")
        else:
            _require(edit[0] < 2048 and edit[1] < 1024 and edit[2] <= 2048 and edit[3] <= 255, "Invalid Setup circle")
    load = _phase(files, directory, "load", record, task)
    reopen = _phase(files, directory, "reopen", record, task)
    _require(load.get("midge_id") == reopen.get("midge_id") and _integer(load.get("midge_id")), "Reopened actor identity mismatch")
    for stream in ("stdout", "stderr"):
        filename = directory + "/worker." + stream + ".log"
        _require(filename in files and _hash(record.get("worker_" + stream + "_sha256")), "Worker log/digest missing")
        _require(_sha(files[filename]) == record["worker_" + stream + "_sha256"], "Worker log hash mismatch")
    _require(files[directory + "/worker.stderr.log"] == b"", "Worker stderr was not empty")
    _require(type(record.get("worker_exit_code")) is int and record["worker_exit_code"] == 0
             and record.get("worker_timed_out") is False, "Worker did not exit cleanly")
    for field in ("source_parser", "installed_bridge", "physics_ticks", "fresh_process_reopen"):
        _require(record.get(field) == "PASS", "Incomplete native summary gate: " + field)
    _require(record.get("midge_drive") == "OBSERVED" and _hash(record.get("saved_setup_sha256")), "Missing Midge/save digest evidence")
    return key, task, load, reopen


def _head(record, reconciliation, summary_sha):
    original = record.get("status")
    error = record.get("error", "")
    _require(isinstance(original, str) and isinstance(error, str), "Malformed historical status")
    if original == "PASS_BASIC_NATIVE":
        _require(isinstance(record.get("final_head_verified_utc"), str) and record["final_head_verified_utc"], "Historical PASS lacks final HEAD verification time")
        state = {"status": "historical-verified", "verified_at": record["final_head_verified_utc"],
                 "verified_head_sha": record["head_sha"], "method": "owner-final-receipt", "current_status": "UNVERIFIED"}
        status = "PASS_BASIC_NATIVE"
    elif original in ("STALE", "PENDING_HEAD_VERIFICATION", "NATIVE_PASS_PENDING_HEAD"):
        # The legacy STALE label alone supplies no proof that a HEAD changed.
        state = {"status": "unverified", "current_status": "UNVERIFIED"}
        status = "NATIVE_PASS_PENDING_HEAD"
    else:
        raise HistoryError("Raw-success evidence has an unsupported original classification")
    quality = "raw-evidence-verified"
    reconciliation_info = None
    if reconciliation is not None:
        _require(reconciliation.get("source_summary_sha256") == summary_sha, "Reconciliation points to a different summary")
        rows = reconciliation.get("results")
        _require(isinstance(rows, list), "Malformed reconciliation results")
        matches = [row for row in rows if isinstance(row, dict) and row.get("pr") == record["pr"] and row.get("setup_path") == record["setup_path"]]
        _require(len(matches) <= 1, "Duplicate reconciliation target")
        if matches:
            row = matches[0]
            tested = row.get("tested_head_sha", row.get("head_sha"))
            _require(tested == record["head_sha"], "Reconciliation tested HEAD mismatch")
            current = row.get("current_head_sha")
            valid_direct = (reconciliation.get("schema") == "cybersand-fleet-native-reconciliation-v1.4.4"
                            and _hash(current, 40) and row.get("current_state") in ("open", "closed")
                            and row.get("current_head_repo") == MAP_REPOSITORY
                            and row.get("current_base_repo") == MAP_REPOSITORY)
            # v1.4.3's absent inventory entry is retained, never accepted as stale.
            if valid_direct:
                _require(row.get("native_execution") == "PASS_BASIC_NATIVE"
                         and row.get("original_classification") == original
                         and row.get("local_hashes_and_raw_godot_logs") == "VERIFIED", "Reconciliation/native contradiction")
                match = (current == record["head_sha"] and row["current_state"] == "open"
                         and row.get("current_branch") == record.get("branch") and row.get("current_draft") is True)
                expected = "PASS_BASIC_NATIVE" if match else "STALE_CONFIRMED"
                _require(row.get("reconciled_status") == expected, "Contradictory reconciliation verdict")
                _require(isinstance(row.get("current_head_verified_utc"), str) and row["current_head_verified_utc"], "Missing reconciliation time")
                state = {"status": "historical-verified", "verified_at": row["current_head_verified_utc"],
                         "verified_head_sha": current, "pr_state": row["current_state"],
                         "method": "owner-direct-PR-reconciliation-v1.4.4", "current_status": "UNVERIFIED"}
                # Preserve the legacy verdict in reconciliation_info, but its
                # broad STALE label must not manufacture a changed Git HEAD.
                if row["current_state"] == "closed":
                    status = "CLOSED"
                elif current != record["head_sha"]:
                    status = "STALE_CONFIRMED"
                elif match:
                    status = "PASS_BASIC_NATIVE"
                else:
                    status = "NATIVE_PASS_PENDING_HEAD"
                    state["status"] = "historical-metadata-mismatch"
                    state["reason"] = "unchanged-head-but-branch-or-draft-state-changed"
                quality = "historical-reconciled"
            elif reconciliation.get("schema") == "cybersand-fleet-native-reconciliation-v1.4.4":
                raise HistoryError("v1.4.4 reconciliation lacks valid direct PR identity")
            reconciliation_info = {"schema": reconciliation.get("schema"), "reported_status": row.get("reconciled_status"),
                                   "accepted_as_direct_verification": bool(valid_direct)}
    return status, state, quality, reconciliation_info


def inspect_archive(path: str | Path, expected_sha256: str | None = None) -> dict:
    """Verify every archive member, raw receipt and source identity offline."""
    path = Path(path)
    files, archive_sha, run_id = _verified_archive(path, expected_sha256)
    summary = _object(files, "fleet-summary.json")
    provenance = _object(files, "run-provenance.json")
    exported = _object(files, "evidence-export.json")
    _require(summary.get("schema") == "cybersand-fleet-admission-summary-v1", "Unsupported summary schema")
    _require(provenance.get("schema") == "cybersand-original-fleet-native-admission-v1", "Unsupported provenance schema")
    _require(exported.get("schema") in ("cybersand-fleet-evidence-export-v1.4.2", "cybersand-fleet-evidence-export-v1.4.3"), "Unsupported export schema")
    _require(all(doc.get("run_id") == run_id for doc in (summary, provenance, exported)), "Run identity mismatch")
    _require(exported.get("engine_sha") == summary.get("runtime_engine_sha") == provenance.get("pinned_engine_sha"), "Run engine identity mismatch")
    _require(type(exported.get("coordinator_exit_code")) is int, "Coordinator exit code is not numeric")
    rows = summary.get("results")
    _require(isinstance(rows, list) and len(rows) <= 1024 and _integer(summary.get("attempted"))
             and summary["attempted"] == len(rows) == exported.get("attempted"), "Incomplete/contradictory run inventory")
    by_key = {}
    for row in rows:
        key = _identity(row)
        _require(key not in by_key, "Duplicate exact-source result in summary")
        by_key[key] = row
    reconciliation = _object(files, "fleet-reconciliation.json") if "fleet-reconciliation.json" in files else None
    if reconciliation:
        _require(reconciliation.get("run_id") == run_id and reconciliation.get("original_run_preserved") is True
                 and reconciliation.get("no_godot_rerun") is True, "Invalid reconciliation identity/provenance")
        _require(reconciliation.get("schema") in ("cybersand-fleet-native-reconciliation-v1.4.3", "cybersand-fleet-native-reconciliation-v1.4.4"),
                 "Unsupported reconciliation schema")
        recon_rows = reconciliation.get("results")
        _require(isinstance(recon_rows, list), "Invalid reconciliation result inventory")
        targets = {(row["pr"], row["setup_path"]): row for row in rows}
        recon_seen = set()
        for row in recon_rows:
            _require(isinstance(row, dict), "Malformed reconciliation row")
            _require(_integer(row.get("pr"), 1) and isinstance(row.get("setup_path"), str), "Malformed reconciliation target")
            target = (row.get("pr"), row.get("setup_path"))
            _require(target in targets and target not in recon_seen, "Wrong or duplicate reconciliation target")
            recon_seen.add(target)
        if "direct_pr_responses_verified" in reconciliation:
            _require(type(reconciliation["direct_pr_responses_verified"]) is int
                     and reconciliation["direct_pr_responses_verified"] == len(recon_rows), "Direct verification count mismatch")
    receipt_paths = sorted(name for name in files if re.fullmatch(r"pr[0-9]+-[0-9a-f]{8}-[0-9]+/qualification\.json", name))
    _require(len(receipt_paths) == len(rows), "Receipt count differs from completed run inventory")
    observations = []
    seen_keys = set()
    summary_sha = _sha(files["fleet-summary.json"])
    for receipt_path in receipt_paths:
        directory = receipt_path.rsplit("/", 1)[0]
        record = _object(files, receipt_path)
        key, task, load, reopen = _native(files, directory, record, summary, provenance)
        _require(key in by_key and _canonical(record) == _canonical(by_key[key]), "Stored receipt differs from original summary")
        _require(key not in seen_keys, "Multiple receipt directories for one exact-source result")
        seen_keys.add(key)
        status, head, quality, reconciled = _head(record, reconciliation, summary_sha)
        execution_id = _sha(_canonical(["owner-local-windows", run_id, key, record["setup_sha256"]]))
        phase_hashes = {name: _sha(files[directory + "/" + name]) for name in
                        ("load.stdout.log", "load.stderr.log", "reopen.stdout.log", "reopen.stderr.log", "worker.stdout.log", "worker.stderr.log", "original-setup.json")}
        native_fingerprint = _sha(_canonical({"phases": phase_hashes, "harness_sha256": task["runner_sha256"],
                                             "rapier_sha256": task["rapier_sha256"], "godot_sha256": task["godot_sha256"],
                                             "saved_setup_sha256": record["saved_setup_sha256"]}))
        observation = {
            "schema": "cybersand-native-admission-v1",
            "map": {"repository": MAP_REPOSITORY, "pr": record["pr"], "head_sha": record["head_sha"],
                    "setup_path": record["setup_path"], "setup_sha256": record["setup_sha256"],
                    "setup_blob_sha": record["setup_blob_sha"], "setup_bytes": record["setup_bytes"],
                    "rectangle_count": record["rectangle_count"], "extent": [2048, 1024]},
            "runtime": {"repository": ENGINE_REPOSITORY, "engine_sha": record["pinned_engine_sha"],
                        "native_dll_sha256": record["native_sha256"], "rapier_dll_sha256": task["rapier_sha256"],
                        "godot_sha256": task["godot_sha256"], "godot_version": record["godot_version"]},
            "execution": {"origin": "owner-local-windows", "run_id": run_id,
                          "execution_id": execution_id, "evidence_id": "owner-archive-sha256:" + archive_sha,
                          "started_at": provenance.get("started_utc"), "completed_at": record.get("date_utc")},
            "qualification": {"basic_native": status, "native_execution": "PASS_BASIC_NATIVE",
                              "collision": "UNTESTED", "hazards": "UNTESTED", "gui": "UNTESTED",
                              "performance": "UNTESTED", "art": "UNTESTED", "shepherd": "UNTESTED"},
            "evidence": {"archive_sha256": archive_sha, "archive_file_name": "CyberSand-Fleet-Evidence-" + run_id + ".zip",
                         "receipt_sha256": _sha(files[receipt_path]), "receipt_path": run_id + "/" + receipt_path,
                         "manifest_sha256": _sha(files["evidence-files.sha256.json"]),
                         "native_fingerprint": native_fingerprint, "phase_sha256": phase_hashes},
            "provenance": {"quality": quality, "original_status": record["status"],
                           "original_coordinator_exit": exported["coordinator_exit_code"],
                           "original_completion_class": exported.get("completion_class"),
                           "original_error_class": ("github-rate-limited" if "rate limit" in record.get("error", "").lower()
                                                    else "head-verification-unavailable" if record.get("error", "").startswith("Cannot verify final PR HEAD")
                                                    else "recorded-error" if record.get("error") else "none"),
                           "original_error_sha256": _sha(record.get("error", "").encode("utf-8")),
                           "runtime_identity": "recorded-in-owner-receipts",
                           "missing_evidence": ["saved-copy-bytes-excluded-by-fleet-export", "runtime-binary-bytes-excluded-by-fleet-export",
                                                "source-audit-bytes-excluded-by-fleet-export", "raw-final-GitHub-response-not-exported"],
                           "saved_setup_sha256": record["saved_setup_sha256"],
                           "source_audit_sha256": provenance.get("source_audit_sha256"),
                           "source_files_reported_verified": provenance.get("source_files_verified"),
                           "original_summary_sha256": summary_sha, "harness_sha256": task["runner_sha256"]},
            "head_verification": head,
            "phases": {"load": {"exit_code": 0, "receipt": load}, "reopen": {"exit_code": 0, "receipt": reopen}},
        }
        if reconciled is not None:
            observation["provenance"]["reconciliation"] = reconciled
            observation["provenance"]["reconciliation_sha256"] = _sha(files["fleet-reconciliation.json"])
        preserved = [name for name in sorted(files) if name.startswith("fleet-reconciliation") and name != "fleet-reconciliation.json"]
        observation["provenance"]["preserved_reconciliation_sidecars"] = [
            {"path": run_id + "/" + name, "sha256": _sha(files[name])} for name in preserved]
        observation["record_id"] = _sha(_canonical(observation))
        validate_record(observation)
        observations.append(observation)
    inventory = {"schema": "cybersand-native-history-inventory-v1", "origin": "owner-local-windows",
                 "run_id": run_id, "engine_sha": summary["runtime_engine_sha"], "archive_sha256": archive_sha,
                 "reported_run_attempts": summary["attempted"], "reported_run_passes": summary.get("basic_native_pass", 0),
                 "reported_previously_passed_skipped": summary.get("previously_passed_skipped", 0),
                 "materialized_records": len(observations), "scope": "Run inventory only; skipped/index totals are not imported records."}
    return {"archive_sha256": archive_sha, "archive_file_name": path.name, "run_id": run_id,
            "manifest_file_count": len(files) - 1, "records": observations, "inventory_summary": inventory}


def inspect_index(path: str | Path) -> dict:
    """Retain an index export as summary-only; never manufacture raw evidence."""
    path = Path(path)
    _require(path.is_file() and not path.is_symlink() and path.stat().st_size <= MAX_MEMBER_BYTES, "Invalid index input")
    data = path.read_bytes()
    document = _json(data)
    _require(isinstance(document, dict) and document.get("schema") == "cybersand-fleet-qualification-index-v1", "Unsupported historical index schema")
    entries = document.get("entries")
    _require(isinstance(entries, list) and len(entries) <= 10000, "Malformed historical index")
    digest = _sha(data)
    records, seen = [], set()
    for entry in entries:
        key = _identity(entry)
        _require(key not in seen, "Duplicate index key")
        seen.add(key)
        record = {"schema": "cybersand-native-admission-v1",
                  "map": {"repository": MAP_REPOSITORY, "pr": entry["pr"], "head_sha": entry["head_sha"],
                          "setup_path": entry["setup_path"], "setup_sha256": entry["setup_sha256"]},
                  "runtime": {"repository": ENGINE_REPOSITORY, "engine_sha": entry["pinned_engine_sha"],
                              "native_dll_sha256": entry["native_sha256"], "godot_version": entry["godot_version"]},
                  "execution": {"origin": "owner-local-windows", "run_id": "index-" + digest,
                                "execution_id": _sha(_canonical(["summary-only", digest, key])),
                                "evidence_id": "owner-index-sha256:" + digest},
                  "qualification": {"basic_native": "NATIVE_PASS_PENDING_EVIDENCE", "collision": "UNTESTED", "hazards": "UNTESTED", "gui": "UNTESTED"},
                  "evidence": {"index_sha256": digest, "index_file_name": "qualification-index-" + digest + ".json", "receipt_sha256": _sha(_canonical(entry))},
                  "provenance": {"quality": "summary-only", "original_status": entry.get("status"),
                                 "runtime_identity": "recorded-in-owner-index",
                                 "missing_evidence": ["archive-manifest", "original-setup-bytes", "raw-native-logs", "runtime-binary-bytes", "saved-copy-bytes"]},
                  "head_verification": {"status": "unverified", "current_status": "UNVERIFIED"}}
        record["record_id"] = _sha(_canonical(record))
        validate_record(record)
        records.append(record)
    return {"index_sha256": digest, "index_file_name": path.name, "records": records,
            "inventory_summary": {"schema": "cybersand-native-history-inventory-v1", "origin": "owner-local-windows",
                                  "quality": "summary-only", "reported_entries": len(entries), "materialized_raw_executions": 0,
                                  "index_sha256": digest}}


def _write_immutable(path: Path, value) -> str:
    data = _canonical(value)
    _require(not any(p.is_symlink() for p in path.parents), "Output ancestor may not be a symlink")
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists():
        _require(path.is_file() and not path.is_symlink() and path.read_bytes() == data, "Immutable historical output conflict")
        return "existing"
    with tempfile.NamedTemporaryFile(prefix=".history-", dir=path.parent, delete=False) as stream:
        temporary = Path(stream.name)
        stream.write(data)
        stream.flush()
        os.fsync(stream.fileno())
    try:
        # Atomic no-replace installation. A second importer cannot overwrite.
        try:
            os.link(temporary, path)
        except FileExistsError:
            _require(path.is_file() and not path.is_symlink() and path.read_bytes() == data, "Concurrent historical output conflict")
            return "existing"
    finally:
        temporary.unlink(missing_ok=True)
    return "created"


def import_inputs(paths, output: str | Path | None = None) -> dict:
    """Inspect all inputs before optional immutable output; never publish remotely."""
    observations, inventories, archives = [], [], []
    source_seen, record_seen = set(), set()
    duplicates = 0
    for value in paths:
        path = Path(value)
        result = inspect_archive(path) if path.suffix.lower() == ".zip" else inspect_index(path)
        identity = result.get("archive_sha256", result.get("index_sha256"))
        if identity in source_seen:
            duplicates += 1
            continue
        source_seen.add(identity)
        archives.append({key: value for key, value in result.items() if key not in ("records", "inventory_summary")})
        inventories.append(result["inventory_summary"])
        for record in result["records"]:
            if record["record_id"] not in record_seen:
                record_seen.add(record["record_id"])
                observations.append(record)
    executions = {}
    conflicts = []
    for record in observations:
        if record["provenance"]["quality"] == "summary-only":
            continue
        identity = record["execution"]["execution_id"]
        previous = executions.get(identity)
        if previous and previous["evidence"]["native_fingerprint"] != record["evidence"]["native_fingerprint"]:
            conflicts.append({"execution_id": identity, "record_ids": sorted([previous["record_id"], record["record_id"]]),
                              "reason": "Same historical execution has different raw native evidence"})
        elif previous is None or (record["provenance"]["quality"] == "historical-reconciled"):
            executions[identity] = record
    report = {"schema": "cybersand-native-history-import-v1", "mode": "dry-run", "validation": "VERIFIED" if not conflicts else "CONFLICT",
              "archives": archives, "inventory_summaries": inventories, "records": sorted(observations, key=lambda row: row["record_id"]),
              "duplicate_archives": duplicates, "observation_count": len(observations), "unique_executions": len(executions),
              "raw_historical_passes": sum(r["qualification"]["basic_native"] == "PASS_BASIC_NATIVE" for r in executions.values()),
              "summary_only_records": sum(r["provenance"]["quality"] == "summary-only" for r in observations), "conflicts": conflicts,
              "current_head_verification": "UNVERIFIED", "github_hosted_executions": 0,
              "limits": "Historical owner-local evidence only. Runtime binaries, source audits and saved copies are not included in Fleet run exports. No current HEAD, CI, GUI, collision, art or Shepherd acceptance is inferred."}
    if output is not None:
        _require(not conflicts, "Conflicting historical evidence; immutable output refused")
        destination = Path(output)
        _require(not destination.is_symlink(), "Output may not be a symlink")
        # Complete validation and a dry-run report precede every write batch.
        batch_id = _sha(_canonical(sorted(source_seen)))
        _write_immutable(destination / "reports" / (batch_id + "-dry-run.json"), report)
        for record in report["records"]:
            _write_immutable(destination / "records" / (record["record_id"] + ".json"), record)
        report["mode"] = "written-immutable"
        report["batch_id"] = batch_id
    return report


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("inputs", nargs="+", type=Path, help="Fleet evidence ZIPs or qualification-index.json exports")
    parser.add_argument("--output", type=Path, help="Write validated immutable observations after saving a dry-run report")
    args = parser.parse_args(argv)
    try:
        result = import_inputs(args.inputs, args.output)
        print(_canonical(result).decode("utf-8"), end="")
        return 0 if not result["conflicts"] else 2
    except (HistoryError, OSError) as exc:
        # Validation diagnostics contain only schema labels and archive-relative
        # names; never echo raw owner errors, local paths, API responses or tokens.
        print(json.dumps({"schema": "cybersand-native-history-import-v1", "validation": "REJECTED",
                          "error": str(exc) if isinstance(exc, HistoryError) else "File operation failed"}), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
