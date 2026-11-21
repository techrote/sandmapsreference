import copy
import hashlib
import json
import os
from pathlib import Path
import sys
import tempfile
import time
import unittest
from unittest.mock import patch

from tools.native_admission import runner
from tools.native_admission.runtime import RuntimeIntegrityError


def receipt(phase="load"):
    result = {"label": "source", "saved_label": "copy", "active_label": "source" if phase == "load" else "copy",
              "phase": phase, "version": "4.7-stable (official)", "setup_sha256": "1" * 64, "process_id": 100,
              "source_parse": True, "native_bridge": True, "load": True, "full_grid": True,
              "published_image": True, "actor_adopted": True, "rapier_space_valid": True,
              "worker_failed": False, "extent": [2048, 1024], "rectangles": 1, "midge_id": 1,
              "collision_observed": False, "errors": [], "grid_check": {"ok": True, "pixels": 2097152, "mismatches": 0}}
    if phase == "load":
        result.update(physics_tick=True, midge_drive=True, save_readback=True, midge_displacement_cells=1.2,
                      drive_start=[20.0, 30.0], drive_end=[20.0, 28.8], drive_key="W", drive_ticks_elapsed=20,
                      directed_up_displacement_cells=1.2)
    else:
        result["fresh_reopen"] = True
    return result


def setup():
    return {"version": 2, "extent": [2048, 1024], "actors": [{"id": 1, "model": "midge"}],
            "edits": [[2, 3, 4, 5, 2]]}


class RunnerTests(unittest.TestCase):
    def test_exact_phase_receipts(self):
        for phase in ("load", "reopen"):
            runner.validate_receipt(receipt(phase), phase, "source", "copy", 1, 1, "1" * 64)

    def test_bool_numeric_cannot_forge_pass(self):
        for change in ({"rectangles": True}, {"process_id": True}, {"native_bridge": 1},
                       {"worker_failed": 0}, {"errors": None}, {"midge_displacement_cells": float("nan")},
                       {"midge_displacement_cells": True}, {"midge_id": 99}, {"collision_observed": True},
                       {"grid_check": {"ok": True, "pixels": 2097151, "mismatches": 0}},
                       {"grid_check": {"ok": True, "pixels": 2097152, "mismatches": False}}):
            with self.subTest(change=change), self.assertRaises(RuntimeIntegrityError):
                runner.validate_receipt({**receipt(), **change}, "load", "source", "copy", 1, 1, "1" * 64)

    def test_wrong_saved_file_or_phase_rejected(self):
        for change in ({"active_label": "source"}, {"setup_sha256": "2" * 64},
                       {"saved_label": "other"}, {"phase": "load"}, {"fresh_reopen": False}):
            with self.subTest(change=change), self.assertRaises(RuntimeIntegrityError):
                runner.validate_receipt({**receipt("reopen"), **change}, "reopen", "source", "copy", 1, 1, "1" * 64)

    def test_uncommanded_drift_cannot_pass_directed_movement(self):
        for change in ({"drive_start": None}, {"drive_key": "S"}, {"drive_ticks_elapsed": 19},
                       {"drive_ticks_elapsed": True}, {"directed_up_displacement_cells": 0.0},
                       {"drive_end": [20.0, 32.0], "directed_up_displacement_cells": -2.0},
                       {"drive_end": [22.0, 30.0], "directed_up_displacement_cells": 2.0},
                       {"directed_up_displacement_cells": 999.0}):
            with self.subTest(change=change), self.assertRaises(RuntimeIntegrityError):
                runner.validate_receipt({**receipt(), **change}, "load", "source", "copy", 1, 1, "1" * 64)

    def test_windows_launch_assigns_before_resuming(self):
        order = []
        class Process:
            def __init__(self, *args):
                order.append("created-suspended")
            def resume(self):
                order.append("resumed")
        class Job:
            def __init__(self, process):
                order.append("assigned-to-bounded-job")
        with patch.object(runner.os, "name", "nt"), patch.object(runner, "SuspendedWindowsProcess", Process), \
                patch.object(runner, "WindowsJob", Job):
            runner.start_process([], None, None, {})
        self.assertEqual(order, ["created-suspended", "assigned-to-bounded-job", "resumed"])

    @unittest.skipUnless(os.name == "nt", "Requires actual Windows job-object execution; Linux is not Windows qualification")
    def test_windows_immediate_child_is_inside_job_and_terminated(self):
        import ctypes
        from ctypes import wintypes
        api = ctypes.WinDLL("kernel32", use_last_error=True)
        api.OpenProcess.argtypes = [wintypes.DWORD, wintypes.BOOL, wintypes.DWORD]
        api.OpenProcess.restype = wintypes.HANDLE
        api.IsProcessInJob.argtypes = [wintypes.HANDLE, wintypes.HANDLE, ctypes.POINTER(wintypes.BOOL)]
        api.IsProcessInJob.restype = wintypes.BOOL
        api.WaitForSingleObject.argtypes = [wintypes.HANDLE, wintypes.DWORD]
        api.WaitForSingleObject.restype = wintypes.DWORD
        api.CloseHandle.argtypes = [wintypes.HANDLE]
        with tempfile.TemporaryDirectory() as name:
            root = Path(name)
            marker = root / "immediate-child.json"
            helper = root / "spawn.py"
            helper.write_text("import subprocess, sys, os, json, time\n"
                              "child = subprocess.Popen([sys.executable, '-c', 'import time; time.sleep(60)'])\n"
                              "with open(sys.argv[1] + '.tmp', 'w') as f: json.dump({'parent':os.getpid(),'child':child.pid},f)\n"
                              "os.replace(sys.argv[1] + '.tmp', sys.argv[1])\n"
                              "time.sleep(60)\n", encoding="utf-8")
            real_job = runner.WindowsJob
            def delayed_assignment(process):
                # Before the repair this delay lets the wrapper spawn its child
                # outside our job. A suspended process cannot reach the marker.
                time.sleep(0.3)
                self.assertFalse(marker.exists(), "child executed before job assignment")
                return real_job(process)
            process, job, child_handle = None, None, None
            with (root / "stdout.log").open("wb") as stdout, (root / "stderr.log").open("wb") as stderr:
                try:
                    with patch.object(runner, "WindowsJob", side_effect=delayed_assignment):
                        process, job = runner.start_process([sys.executable, str(helper), str(marker)],
                                                           stdout, stderr, runner.native_environment())
                    deadline = time.monotonic() + 10
                    while not marker.exists() and time.monotonic() < deadline:
                        time.sleep(0.02)
                    self.assertTrue(marker.exists(), "immediate child did not start after resume")
                    identities = json.loads(marker.read_text())
                    self.assertEqual(identities["parent"], process.pid)
                    child_handle = api.OpenProcess(0x1000 | 0x100000, False, identities["child"])
                    self.assertTrue(child_handle, "cannot inspect immediately spawned child")
                    for handle in (process._handle, child_handle):
                        inside = wintypes.BOOL()
                        self.assertTrue(api.IsProcessInJob(handle, job.handle, ctypes.byref(inside)))
                        self.assertTrue(inside.value, "a process escaped the bounded Windows job")
                    runner.terminate_tree(process, job)
                    self.assertIsNotNone(process.poll())
                    self.assertEqual(api.WaitForSingleObject(child_handle, 10000), 0,
                                     "child survived process-tree termination")
                finally:
                    if process is not None:
                        runner.terminate_tree(process, job)
                    if job is not None:
                        job.close()
                    if child_handle:
                        api.CloseHandle(child_handle)
                    if process is not None:
                        process.close()

    def test_missing_duplicate_or_malformed_marker(self):
        valid = "CANVAS_NATIVE_EVIDENCE " + json.dumps(receipt())
        self.assertEqual(runner.parse_marker(valid, "CANVAS_NATIVE_EVIDENCE"), receipt())
        for raw in ("success", valid + "\n" + valid, 'CANVAS_NATIVE_EVIDENCE {"x":1,"x":2}'):
            with self.subTest(raw=raw[:20]), self.assertRaises(RuntimeIntegrityError):
                runner.parse_marker(raw, "CANVAS_NATIVE_EVIDENCE")

    def test_numeric_exit_timeout_and_error_enforcement(self):
        base = {"exit_code": 0, "timeout": False, "log_limit_exceeded": False, "unexpected_godot_errors": False}
        runner.validate_process(base)
        for changes in ({"exit_code": "0"}, {"exit_code": False}, {"exit_code": None}, {"exit_code": 1},
                        {"timeout": True}, {"log_limit_exceeded": True}, {"unexpected_godot_errors": True}):
            with self.subTest(changes=changes), self.assertRaises(RuntimeIntegrityError):
                runner.validate_process({**base, **changes})

    def test_real_subprocess_failure_timeout_and_error_logs(self):
        with tempfile.TemporaryDirectory() as name:
            root = Path(name)
            env = runner.native_environment()
            record = runner.run_process([sys.executable, "-c", "raise SystemExit(7)"], root / "exit", env, timeout=3)
            self.assertEqual(record["exit_code"], 7)
            record = runner.run_process([sys.executable, "-c", "import time; time.sleep(5)"], root / "timeout", env, timeout=1)
            self.assertTrue(record["timeout"])
            self.assertIs(type(record["exit_code"]), int)
            record = runner.run_process([sys.executable, "-c", "print('SCRIPT ERROR: bad')"], root / "errors", env, timeout=3)
            self.assertTrue(record["unexpected_godot_errors"])
            with patch.object(runner, "MAX_LOG_BYTES", 128):
                record = runner.run_process([sys.executable, "-c", "print('x'*256)"], root / "huge", env, timeout=3)
            self.assertTrue(record["log_limit_exceeded"])

    def test_full_grid_checks_materials_and_saved_semantics(self):
        original = setup()
        grid = runner.material_grid(original)
        self.assertEqual(len(grid), 2097152)
        self.assertEqual(grid.count(2), 20)
        changed = copy.deepcopy(original)
        changed["edits"][0][-1] = 14
        self.assertNotEqual(runner.material_grid(changed), grid)
        equivalent = copy.deepcopy(original)
        equivalent["edits"] = [[2, 3, 4, 2, 2], [2, 5, 4, 3, 2]]
        self.assertEqual(runner.material_grid(equivalent), grid)
        for stamp in ([2040, 0, 20, 20, 2], [0, 0, 1, 1, 10], [0, 0, 1, 1, 256], [0, 0, -1, 1, 2]):
            changed = {**original, "edits": [stamp]}
            with self.subTest(stamp=stamp), self.assertRaises(RuntimeIntegrityError):
                runner.material_grid(changed)
        self.assertEqual(runner.material_grid({**original, "edits": [[3, 3, 2, 2]]}).count(2), 13)

    def test_missing_head_never_stale_or_pass(self):
        current, unknown, stale, closed = [{"state": value} for value in ("VERIFIED_CURRENT", "UNVERIFIED", "STALE_CONFIRMED", "CLOSED")]
        self.assertEqual(runner.final_status("PASS_BASIC_NATIVE", current, current), "PASS_BASIC_NATIVE")
        self.assertEqual(runner.final_status("PASS_BASIC_NATIVE", current, unknown), "NATIVE_PASS_PENDING_HEAD")
        self.assertEqual(runner.final_status("PASS_BASIC_NATIVE", unknown, current), "NATIVE_PASS_PENDING_HEAD")
        self.assertEqual(runner.final_status("PASS_BASIC_NATIVE", current, stale), "STALE_CONFIRMED")
        self.assertEqual(runner.final_status("PASS_BASIC_NATIVE", current, closed), "CLOSED")
        self.assertEqual(runner.final_status("FAIL_NATIVE", current, unknown), "FAIL_NATIVE")
        self.assertEqual(runner.final_status("UNTESTED", unknown, current), "INCOMPLETE")

    def test_actual_linux_cannot_claim_hosted_windows(self):
        with patch.object(sys, "platform", "linux"), self.assertRaises(RuntimeIntegrityError):
            runner.execution_identity(None)

    def test_crash_before_reopen_and_wrong_saved_copy_fail_closed(self):
        identity = {"repository": "techrote/sandmapsreference", "pr": 1, "head_sha": "1" * 40,
                    "setup_path": "example/setup.json", "rectangle_count": 1}
        data = json.dumps(setup()).encode()
        identity.update(setup_sha256=hashlib.sha256(data).hexdigest(), setup_bytes=len(data))
        with tempfile.TemporaryDirectory() as name:
            root = Path(name)
            output = root / "maps" / runner.fixture_key(identity)
            output.mkdir(parents=True)
            (output / "original-setup.json").write_bytes(data)
            userdir = root / "user"
            userdir.mkdir()
            worker = {"slot": 1, "userdir": userdir}
            with patch.object(runner, "verify_worker_source"), patch.object(runner, "native_phase", side_effect=RuntimeError("worker crashed")):
                result = runner.qualify_one(identity, worker, {}, {}, root, {"state": "VERIFIED_CURRENT"})
            self.assertEqual(result["native_status"], "FAIL_NATIVE")
            self.assertIsNone(result["reopen_evidence"])
            self.assertTrue((output / "qualification.json").exists())
            for path in userdir.iterdir():
                path.unlink()
            def wrong_saved(*args, **kwargs):
                altered = setup()
                altered["edits"][0][-1] = 14
                (userdir / ("setup-" + args[3] + ".json")).write_text(json.dumps(altered))
                return {"pid": 1, "receipt": {"process_id": 2}}
            with patch.object(runner, "verify_worker_source"), patch.object(runner, "native_phase", side_effect=wrong_saved):
                result = runner.qualify_one(identity, worker, {}, {}, root, {"state": "VERIFIED_CURRENT"})
            self.assertEqual(result["native_status"], "FAIL_NATIVE")
            self.assertIn("not the original", result["error"])

    def test_coordinator_preserves_other_maps_after_one_native_failure(self):
        data = json.dumps(setup()).encode()
        identities = [{"repository": "techrote/sandmapsreference", "pr": pr, "head_sha": str(pr) * 40,
                       "setup_path": "cybersand-canvases/2048x1024/example/setup.json", "rectangle_count": 1,
                       "setup_sha256": hashlib.sha256(data).hexdigest(), "setup_bytes": len(data)} for pr in (1, 2)]
        class Client:
            def get_bytes(self, *args, **kwargs):
                return data
            def verify_pr(self, repository, pr, head_sha):
                return {"state": "VERIFIED_CURRENT", "observed_head_sha": head_sha}
        def qualify(identity, slot, runtime, execution, evidence_root, before):
            return {"key": runner.fixture_key(identity), "map": identity,
                    "status": "FAIL_NATIVE", "native_status": "FAIL_NATIVE" if identity["pr"] == 1 else "PASS_BASIC_NATIVE",
                    "head_before": before, "qualification": {"basic_native": "FAIL_NATIVE"}}
        with tempfile.TemporaryDirectory() as name:
            root = Path(name)
            candidate = root / "candidate"
            candidate.mkdir()
            (candidate / "candidate-provenance.json").write_text("{}")
            runtime = {"engine_sha": "3" * 40, "local": {"candidate_dir": str(candidate)}}
            execution = {"run_id": "123", "attempt": 1, "finished_at": None}
            def slot(number, *args):
                return {"slot": number, "userdir": root / f"user{number}"}
            with patch.object(runner, "validate_runtime_files"), patch.object(runner, "execution_identity", return_value=execution), \
                    patch.object(runner, "make_worker", side_effect=slot), patch.object(runner, "qualify_one", side_effect=qualify):
                result = runner.execute({"engine": {"head_sha": "3" * 40}, "maps": identities}, runtime,
                                        root / "evidence", root / "work", Client(), workers=2)
            self.assertTrue(result["complete"])
            self.assertEqual(len(result["qualifications"]), 2)
            self.assertEqual({r["map"]["pr"]: r["status"] for r in result["records"]},
                             {1: "FAIL_NATIVE", 2: "PASS_BASIC_NATIVE"})

    def test_unverified_initial_head_never_launches_native_worker(self):
        data = json.dumps(setup()).encode()
        identity = {"repository": "techrote/sandmapsreference", "pr": 1, "head_sha": "1" * 40,
                    "setup_path": "cybersand-canvases/2048x1024/example/setup.json", "rectangle_count": 1,
                    "setup_sha256": hashlib.sha256(data).hexdigest(), "setup_bytes": len(data)}
        class Client:
            def get_bytes(self, *args, **kwargs):
                return data
            def verify_pr(self, *args):
                return {"state": "UNVERIFIED", "diagnostic": "RATE_LIMITED"}
        with tempfile.TemporaryDirectory() as name:
            root = Path(name)
            (root / "candidate").mkdir()
            (root / "candidate/candidate-provenance.json").write_text("{}")
            runtime = {"engine_sha": "3" * 40, "local": {"candidate_dir": str(root / "candidate")}}
            with patch.object(runner, "validate_runtime_files"), \
                    patch.object(runner, "execution_identity", return_value={"run_id": "123", "attempt": 1}), \
                    patch.object(runner, "make_worker") as launch:
                result = runner.execute({"engine": {"head_sha": "3" * 40}, "maps": [identity]}, runtime,
                                        root / "evidence", root / "work", Client())
            launch.assert_not_called()
            self.assertEqual(result["records"][0]["status"], "INCOMPLETE")
            self.assertEqual(result["records"][0]["native_status"], "UNTESTED")


if __name__ == "__main__":
    unittest.main()
