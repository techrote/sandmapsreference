"""Deterministic adversarial tests for offline historical Fleet imports."""

import copy
import hashlib
import json
from pathlib import Path
import stat
import tempfile
import unittest
import zipfile

from tools.native_admission import history


RUN = "20261121-141811-8a006a"
HEAD = "1" * 40
ENGINE = "2" * 40
NATIVE = "3" * 64
DIR = "pr25-11111111-1"
DATE = "2026-11-21T14:18:00Z"


def encoded(value):
    return (json.dumps(value, sort_keys=True, separators=(",", ":")) + "\n").encode()


def sha(value):
    return hashlib.sha256(value).hexdigest()


def make_files(status="PASS_BASIC_NATIVE", reconciliation=False, engine=ENGINE):
    setup = encoded({"version": 2, "extent": [2048, 1024], "edits": [[1, 2, 3, 4, 5]],
                     "actors": [{"id": 1, "model": "midge", "position": [20, 30]}]})
    key = "|".join(["25", HEAD, "canvases/setup.json", engine, NATIVE])
    task = {"schema": "cybersand-fleet-worker-task-v1.4", "key": key, "pr": 25,
            "head_sha": HEAD, "setup_path": "canvases/setup.json", "setup_sha256": sha(setup),
            "setup_blob_sha": hashlib.sha1(b"blob " + str(len(setup)).encode() + b"\0" + setup).hexdigest(),
            "setup_bytes": len(setup), "rectangle_count": 1, "engine_sha": engine, "native_sha256": NATIVE,
            "godot_version": "4.7.stable.official.5b4e0cb0f", "rapier_sha256": "4" * 64,
            "godot_sha256": "5" * 64, "runner_sha256": "6" * 64,
            "label": "fleet-pr25-11111111-1-aabbcc", "saved_label": "fleet-pr25-11111111-1-aabbcc-native-copy"}
    record = {k: v for k, v in task.items() if k in ("key", "pr", "head_sha", "setup_path", "setup_sha256", "setup_blob_sha", "setup_bytes", "rectangle_count", "native_sha256", "godot_version")}
    record.update(status=status, branch="original/test", pinned_engine_sha=engine,
                  error="Cannot verify final PR HEAD/state; no PASS asserted: API rate limit exceeded for 192.0.2.1" if status == "STALE" else "",
                  date_utc=DATE, source_parser="PASS", installed_bridge="PASS", physics_ticks="PASS", midge_drive="OBSERVED",
                  fresh_process_reopen="PASS", worker_exit_code=0, worker_timed_out=False, saved_setup_sha256="7" * 64)
    if status == "PASS_BASIC_NATIVE":
        record["final_head_verified_utc"] = DATE
    files = {DIR + "/original-setup.json": setup, DIR + "/worker-task.json": encoded(task),
             DIR + "/worker.stdout.log": b"PASS_BASIC_NATIVE\n", DIR + "/worker.stderr.log": b""}
    for name in ("load", "reopen"):
        receipt = {"phase": name, "label": task["label"], "native_bridge": True, "source_parse": True,
                   "load": True, "full_grid": True, "published_image": True, "actor_adopted": True,
                   "rapier_space_valid": True, "worker_failed": False, "errors": [], "extent": [2048, 1024],
                   "rectangles": 1, "grid_check": {"ok": True, "pixels": 2097152, "mismatches": 0}, "midge_id": 1}
        if name == "load":
            receipt.update(physics_tick=True, midge_drive=True, save_readback=True,
                           midge_displacement_cells=4.1, saved_label=task["saved_label"])
        else:
            receipt["fresh_reopen"] = True
        stdout = b"Godot 4.7\nCANVAS_NATIVE_EVIDENCE " + encoded(receipt)
        files[DIR + "/" + name + ".stdout.log"] = stdout
        files[DIR + "/" + name + ".stderr.log"] = b""
        record[name + "_evidence"] = {"receipt": receipt, "exit_code": 0, "stdout_sha256": sha(stdout), "stderr_sha256": sha(b"")}
    for stream in ("stdout", "stderr"):
        record["worker_" + stream + "_sha256"] = sha(files[DIR + "/worker." + stream + ".log"])
    summary = {"schema": "cybersand-fleet-admission-summary-v1", "run_id": RUN,
               "runtime_engine_sha": engine, "attempted": 1, "basic_native_pass": int(status == "PASS_BASIC_NATIVE"),
               "previously_passed_skipped": 98, "results": [record]}
    files[DIR + "/qualification.json"] = encoded(record)
    files["fleet-summary.json"] = encoded(summary)
    files["run-provenance.json"] = encoded({"schema": "cybersand-original-fleet-native-admission-v1", "run_id": RUN,
              "pinned_engine_sha": engine, "native_dll_sha256": NATIVE, "rapier_dll_sha256": task["rapier_sha256"],
              "godot_binary_sha256": task["godot_sha256"], "godot_version": task["godot_version"], "started_utc": DATE,
              "source_audit_sha256": "8" * 64, "source_files_verified": 936})
    files["evidence-export.json"] = encoded({"schema": "cybersand-fleet-evidence-export-v1.4.3", "run_id": RUN,
              "engine_sha": engine, "attempted": 1, "coordinator_exit_code": 2 if status == "STALE" else 0,
              "completion_class": "completed-error" if status == "STALE" else "completed-success"})
    if reconciliation:
        files["fleet-reconciliation.json"] = encoded({"schema": "cybersand-fleet-native-reconciliation-v1.4.4",
            "run_id": RUN, "original_run_preserved": True, "no_godot_rerun": True,
            "source_summary_sha256": sha(files["fleet-summary.json"]), "results": [{
                "pr": 25, "setup_path": "canvases/setup.json", "tested_head_sha": HEAD, "current_head_sha": HEAD,
                "current_state": "open", "current_draft": True, "current_head_repo": history.MAP_REPOSITORY,
                "current_base_repo": history.MAP_REPOSITORY, "current_branch": "original/test",
                "native_execution": "PASS_BASIC_NATIVE", "original_classification": status,
                "local_hashes_and_raw_godot_logs": "VERIFIED", "reconciled_status": "PASS_BASIC_NATIVE",
                "current_head_verified_utc": DATE}]})
    return files


def mutate_json(files, name, fn):
    value = json.loads(files[name])
    fn(value)
    files[name] = encoded(value)


def mutate_record(files, fn):
    record = json.loads(files[DIR + "/qualification.json"])
    fn(record)
    files[DIR + "/qualification.json"] = encoded(record)
    mutate_json(files, "fleet-summary.json", lambda s: s.update(results=[record]))


def write_zip(path, files, extra=None):
    manifest = {"schema": "cybersand-fleet-evidence-file-list-v1.4.2", "run_id": RUN,
                "files": [{"path": name, "bytes": len(content), "sha256": sha(content)} for name, content in sorted(files.items())]}
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as archive:
        for name, content in files.items():
            archive.writestr(RUN + "/" + name, content)
        archive.writestr(RUN + "/evidence-files.sha256.json", encoded(manifest))
        if extra:
            extra(archive)
    return path


class HistoryTests(unittest.TestCase):
    def test_legacy_closed_or_metadata_change_is_not_changed_head(self):
        for mutation, expected in [({"current_state": "closed"}, "CLOSED"),
                                   ({"current_draft": False}, "NATIVE_PASS_PENDING_HEAD"),
                                   ({"current_branch": "renamed"}, "NATIVE_PASS_PENDING_HEAD")]:
            with self.subTest(mutation=mutation):
                files = make_files(status="STALE", reconciliation=True)
                mutate_json(files, "fleet-reconciliation.json", lambda d: d["results"][0].update(
                    **mutation, reconciled_status="STALE_CONFIRMED"))
                result = history.inspect_archive(self.archive(files))
                record = result["records"][0]
                self.assertEqual(record["qualification"]["basic_native"], expected)
                self.assertEqual(record["provenance"]["reconciliation"]["reported_status"], "STALE_CONFIRMED")

    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)

    def tearDown(self):
        self.temp.cleanup()

    def archive(self, files=None, name="evidence.zip", extra=None):
        return write_zip(self.root / name, files or make_files(), extra)

    def reject(self, files, message):
        with self.assertRaisesRegex(history.HistoryError, message):
            history.inspect_archive(self.archive(files))

    def test_valid_pass_retains_owner_origin_and_missing_evidence(self):
        result = history.inspect_archive(self.archive())
        record = result["records"][0]
        self.assertEqual(record["qualification"]["basic_native"], "PASS_BASIC_NATIVE")
        self.assertEqual(record["execution"]["origin"], "owner-local-windows")
        self.assertEqual(record["head_verification"]["current_status"], "UNVERIFIED")
        self.assertIn("saved-copy-bytes-excluded-by-fleet-export", record["provenance"]["missing_evidence"])
        self.assertEqual(record["qualification"]["gui"], "UNTESTED")

    def test_aggregate_skips_never_materialized(self):
        report = history.import_inputs([self.archive()])
        self.assertEqual(report["observation_count"], 1)
        self.assertEqual(report["unique_executions"], 1)
        self.assertEqual(report["inventory_summaries"][0]["reported_previously_passed_skipped"], 98)

    def test_rate_limited_legacy_stale_is_pending(self):
        row = history.inspect_archive(self.archive(make_files("STALE")))["records"][0]
        self.assertEqual(row["qualification"]["basic_native"], "NATIVE_PASS_PENDING_HEAD")
        self.assertEqual(row["provenance"]["original_status"], "STALE")
        self.assertEqual(row["provenance"]["original_coordinator_exit"], 2)
        self.assertNotIn("192.0.2.1", json.dumps(row))
        self.assertNotIn("C:\\Users", json.dumps(row))

    def test_reconciliation_preserves_original_pending_observation(self):
        first = self.archive(make_files("STALE"), "original.zip")
        second = self.archive(make_files("STALE", True), "reconciled.zip")
        report = history.import_inputs([first, second])
        self.assertEqual((report["observation_count"], report["unique_executions"], report["raw_historical_passes"]), (2, 1, 1))
        reconciled = next(row for row in report["records"] if row["provenance"]["quality"] == "historical-reconciled")
        self.assertEqual(reconciled["provenance"]["original_coordinator_exit"], 2)
        self.assertEqual(reconciled["provenance"]["original_status"], "STALE")

    def test_old_inventory_absence_never_confirms_stale(self):
        files = make_files("STALE", True)
        def change(doc):
            doc["schema"] = "cybersand-fleet-native-reconciliation-v1.4.3"
            doc["results"][0]["current_head_sha"] = ""
            doc["results"][0]["reconciled_status"] = "STALE_CONFIRMED"
        mutate_json(files, "fleet-reconciliation.json", change)
        record = history.inspect_archive(self.archive(files))["records"][0]
        self.assertEqual(record["qualification"]["basic_native"], "NATIVE_PASS_PENDING_HEAD")
        self.assertFalse(record["provenance"]["reconciliation"]["accepted_as_direct_verification"])

    def test_real_head_mismatch_is_historically_stale(self):
        files = make_files("STALE", True)
        def change(doc):
            doc["results"][0].update(current_head_sha="a" * 40, reconciled_status="STALE_CONFIRMED")
        mutate_json(files, "fleet-reconciliation.json", change)
        record = history.inspect_archive(self.archive(files))["records"][0]
        self.assertEqual(record["qualification"]["basic_native"], "STALE_CONFIRMED")

    def test_sidecar_cannot_change_source_summary(self):
        files = make_files("STALE", True)
        mutate_json(files, "fleet-reconciliation.json", lambda d: d.update(source_summary_sha256="a" * 64))
        self.reject(files, "different summary")

    def test_sidecar_wrong_pr_cannot_recover_another_result(self):
        files = make_files("STALE", True)
        mutate_json(files, "fleet-reconciliation.json", lambda d: d["results"][0].update(pr=26))
        self.reject(files, "Wrong or duplicate reconciliation target")

    def test_missing_current_head_in_v144_rejected(self):
        files = make_files("STALE", True)
        mutate_json(files, "fleet-reconciliation.json", lambda d: d["results"][0].update(current_head_sha=""))
        self.reject(files, "direct PR identity")

    def test_malformed_reconciliation_target_rejected(self):
        files = make_files("STALE", True)
        mutate_json(files, "fleet-reconciliation.json", lambda d: d["results"][0].update(pr=[]))
        self.reject(files, "Malformed reconciliation target")

    def test_duplicate_archive_is_idempotent(self):
        archive = self.archive()
        report = history.import_inputs([archive, archive])
        self.assertEqual(report["duplicate_archives"], 1)
        self.assertEqual(report["observation_count"], 1)

    def test_archive_rename_does_not_change_observation_identity(self):
        first = self.archive()
        second = self.root / "renamed.zip"
        second.write_bytes(first.read_bytes())
        self.assertEqual(history.inspect_archive(first)["records"], history.inspect_archive(second)["records"])

    def test_cross_engine_results_are_separate(self):
        first = self.archive(name="first.zip")
        second = self.archive(make_files(engine="b" * 40), "second.zip")
        report = history.import_inputs([first, second])
        self.assertEqual(report["unique_executions"], 2)
        self.assertEqual(report["conflicts"], [])

    def test_different_native_logs_same_execution_is_conflict(self):
        first = self.archive(name="first.zip")
        files = make_files()
        files[DIR + "/load.stdout.log"] = b"new output\n" + files[DIR + "/load.stdout.log"]
        mutate_record(files, lambda r: r["load_evidence"].update(stdout_sha256=sha(files[DIR + "/load.stdout.log"])))
        second = self.archive(files, "second.zip")
        report = history.import_inputs([first, second])
        self.assertEqual(len(report["conflicts"]), 1)
        with self.assertRaisesRegex(history.HistoryError, "Conflicting"):
            history.import_inputs([first, second], self.root / "out")
        self.assertFalse((self.root / "out").exists())

    def test_dry_run_does_not_write_and_explicit_output_is_immutable(self):
        archive = self.archive()
        before = set(self.root.iterdir())
        self.assertEqual(history.import_inputs([archive])["mode"], "dry-run")
        self.assertEqual(set(self.root.iterdir()), before)
        first = history.import_inputs([archive], self.root / "out")
        second = history.import_inputs([archive], self.root / "out")
        self.assertEqual(first, second)
        path = next((self.root / "out" / "records").glob("*.json"))
        path.write_text("{}")
        with self.assertRaisesRegex(history.HistoryError, "Immutable"):
            history.import_inputs([archive], self.root / "out")

    def test_missing_raw_receipt_and_wrong_saved_label_rejected(self):
        files = make_files()
        del files[DIR + "/reopen.stdout.log"]
        self.reject(files, "log/digest missing")
        files = make_files()
        mutate_json(files, DIR + "/worker-task.json", lambda d: d.update(saved_label="unrelated-copy"))
        self.reject(files, "saved-copy label")

    def test_non_numeric_and_nonzero_exit_codes_rejected(self):
        for code in ("0", False, 1):
            files = make_files()
            mutate_record(files, lambda r: r["load_evidence"].update(exit_code=code))
            self.reject(files, "process did not exit")

    def test_worker_timeout_rejected(self):
        files = make_files()
        mutate_record(files, lambda r: r.update(worker_timed_out=True))
        self.reject(files, "Worker did not exit")

    def test_embedded_receipt_disagreement_rejected(self):
        files = make_files()
        mutate_record(files, lambda r: r["load_evidence"]["receipt"].update(native_bridge=1))
        self.reject(files, "raw/embedded")

    def test_grid_mismatch_cannot_be_success(self):
        files = make_files()
        record = json.loads(files[DIR + "/qualification.json"])
        record["load_evidence"]["receipt"]["grid_check"]["mismatches"] = 2
        raw = b"CANVAS_NATIVE_EVIDENCE " + encoded(record["load_evidence"]["receipt"])
        files[DIR + "/load.stdout.log"] = raw
        record["load_evidence"]["stdout_sha256"] = sha(raw)
        mutate_record(files, lambda r: r.update(record))
        self.reject(files, "full-grid")

    def test_missing_final_head_time_cannot_be_pass(self):
        files = make_files()
        mutate_record(files, lambda r: r.pop("final_head_verified_utc"))
        self.reject(files, "HEAD verification time")

    def test_setup_digest_and_engine_identity_mismatches(self):
        files = make_files()
        files[DIR + "/original-setup.json"] += b"\n"
        self.reject(files, "Original Setup digest")
        files = make_files()
        mutate_json(files, "run-provenance.json", lambda d: d.update(native_dll_sha256="f" * 64))
        self.reject(files, "Native DLL identity")

    def test_hash_manifest_mismatch(self):
        archive = self.archive(extra=lambda z: z.writestr(RUN + "/unsigned.txt", b"extra"))
        with self.assertRaisesRegex(history.HistoryError, "Unmanifested"):
            history.inspect_archive(archive)

    def test_expected_archive_hash_must_match(self):
        archive = self.archive()
        with self.assertRaisesRegex(history.HistoryError, "expected digest"):
            history.inspect_archive(archive, "0" * 64)

    def test_duplicate_json_key_and_nonfinite_rejected(self):
        for bad in (b'{"a":1,"a":2}', b'{"x":NaN}', b'{"x":1e999}'):
            files = make_files()
            files["preserved.json"] = bad
            self.reject(files, "Duplicate|Non-finite")
        files = make_files()
        files["preserved.json"] = b'{"x":' + b'9' * 5000 + b'}'
        self.reject(files, "Invalid JSON")

    def test_traversal_case_collision_and_symlink_archives(self):
        for name in ("../escape", "C:/escape", "..\\escape", "unsafe/CON", "unsafe/ending."):
            with self.subTest(name=name):
                archive = self.archive(extra=lambda z: z.writestr(name, b"x"))
                with self.assertRaises(history.HistoryError):
                    history.inspect_archive(archive)
        archive = self.archive(extra=lambda z: z.writestr(RUN + "/FLEET-SUMMARY.JSON", b"{}"))
        with self.assertRaisesRegex(history.HistoryError, "case-colliding"):
            history.inspect_archive(archive)
        def link(z):
            entry = zipfile.ZipInfo(RUN + "/link")
            entry.create_system = 3
            entry.external_attr = (stat.S_IFLNK | 0o777) << 16
            z.writestr(entry, "../../outside")
        archive = self.archive(extra=link)
        with self.assertRaisesRegex(history.HistoryError, "links/devices"):
            history.inspect_archive(archive)

    def test_index_export_remains_summary_only(self):
        files = make_files()
        record = json.loads(files[DIR + "/qualification.json"])
        path = self.root / "qualification-index.json"
        path.write_bytes(encoded({"schema": "cybersand-fleet-qualification-index-v1", "entries": [record]}))
        report = history.import_inputs([path])
        self.assertEqual(report["records"][0]["qualification"]["basic_native"], "NATIVE_PASS_PENDING_EVIDENCE")
        self.assertEqual(report["summary_only_records"], 1)
        self.assertEqual(report["raw_historical_passes"], 0)
        self.assertEqual(report["unique_executions"], 0)


if __name__ == "__main__":
    unittest.main()
