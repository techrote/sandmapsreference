"""Synthetic receipt regressions; these fixtures never assert real native execution."""
import copy
import hashlib
from io import BytesIO
import json
import os
from pathlib import Path
import stat
import tempfile
import unittest
from unittest.mock import patch
import zipfile

from tools.native_admission.common import (ENGINE_REPOSITORY, REPOSITORY, IntegrityError,
    canonical_bytes, load_json, safe_path, safe_zip, sha256)
from tools.native_admission.evidence import export, native_records, verify_archive, verify_head_observation, verify_manifest


def observation(head, state="VERIFIED_CURRENT"):
    return {"state": state, "expected_head_sha": head,
            "observed_head_sha": None if state == "UNVERIFIED" else ("f" * 40 if state == "STALE_CONFIRMED" else head),
            "pr_state": "closed" if state == "CLOSED" else "open", "checked_at": "2026-11-21T12:00:00Z"}


def synthetic_setup():
    return {"version": 2, "extent": [2048, 1024],
            "actors": [{"id": 1, "model": "midge", "hash": "b" * 64, "spawn": [115, 448],
                        "options": {"budget": 20, "mass_multiplier": 1, "inertia_multiplier": 1,
                                    "thrust_multiplier": 1, "torque_multiplier": 1, "boost_multiplier": 2}}],
            "next_id": 2, "selected": 1, "edits": [[0, 0, 2048, 4, 58]], "response": "LA-SELECTIVE",
            "liquid_policy": [0], "normalize": False, "rule_radius": 2, "source": [],
            "material": 58, "brush": 8, "fire": False}


def packed(files, manifest=True):
    members = dict(files)
    if manifest:
        members["manifest.json"] = canonical_bytes({"schema": "cybersand-native-files-v1", "files": [
            {"path": key, "bytes": len(value), "sha256": sha256(value)} for key, value in sorted(files.items())]})
    stream = BytesIO()
    with zipfile.ZipFile(stream, "w", zipfile.ZIP_DEFLATED) as archive:
        for key, value in members.items():
            item = zipfile.ZipInfo(key)
            # Preserve deliberately hostile names even on Windows, where the
            # ZipInfo constructor otherwise normalizes the test input away.
            item.filename = item.orig_filename = key
            item.external_attr = 0o100644 << 16
            archive.writestr(item, value)
    return stream.getvalue()


class NativeFixture:
    def __init__(self, count=1):
        self.files = {}
        self.dll = b"SYNTHETIC TEST DLL BYTES - NEVER EXECUTABLE"
        self.source_inputs = {"native/CMakeLists.txt": "5" * 64, "native/src/bridge.cpp": "6" * 64}
        self.candidate = {"schema_version": 1, "kind": "source-built-windows-candidate",
                          "source_commit": "c" * 40, "build_commit": "c" * 40,
                          "source_tree": "e" * 40, "sha256": sha256(self.dll), "source_inputs": self.source_inputs}
        candidate_bytes = canonical_bytes(self.candidate)
        self.source_archive = packed({"candidate-provenance.json": candidate_bytes,
                                      "cybersand_native.windows.x86_64.dll": self.dll}, manifest=False)
        self.runtime = {"repository": ENGINE_REPOSITORY, "engine_sha": "c" * 40, "source_tree_sha": "e" * 40,
                        "native_dll_sha256": sha256(self.dll), "godot_version": "4.7.stable.official.test",
                        "provenance": {"candidate_manifest_sha256": sha256(candidate_bytes),
                                       "source_inputs": self.source_inputs, "artifact_id": 20,
                                       "runtime_run_id": 999, "runtime_attempt": 1,
                                       "artifact_sha256": sha256(self.source_archive)}}
        self.execution = {"origin": "github-hosted-windows", "repository": REPOSITORY,
                          "runner_os": "Windows", "runner_environment": "github-hosted", "run_id": "1234",
                          "attempt": 1, "workflow_sha": "d" * 40, "job_id": "555"}
        self.qualifications = []
        for index in range(count):
            raw = canonical_bytes(synthetic_setup())
            setup_sha = hashlib.sha1(b"blob " + str(len(raw)).encode() + b"\0" + raw).hexdigest()
            identity = {"repository": REPOSITORY, "pr": 25 + index, "head_sha": "a" * 40,
                        "branch": "original/test-fixture", "setup_path": f"cybersand-canvases/2048x1024/test/setup-{index}.json",
                        "setup_blob_sha": setup_sha, "setup_sha256": sha256(raw), "setup_bytes": len(raw),
                        "rectangle_count": 1, "stamp_count": 1, "extent": [2048, 1024]}
            base = f"maps/{index}"
            self.files[base + "/original-setup.json"] = raw
            self.files[base + "/saved-setup.json"] = raw
            q = {"schema": "cybersand-native-qualification-v1", "map": identity, "runtime": self.runtime,
                 "head_before": observation(identity["head_sha"]), "head_after": observation(identity["head_sha"]),
                 "original_setup_path": base + "/original-setup.json", "saved_setup_path": base + "/saved-setup.json",
                 "saved_setup_sha256": sha256(raw), "status": "PASS_BASIC_NATIVE", "native_status": "PASS_BASIC_NATIVE"}
            for phase, pid in (("load", 101), ("reopen", 202)):
                receipt = {"phase": phase, "version": "4.7-stable (official)", "source_parse": True,
                           "native_bridge": True, "load": True, "full_grid": True, "published_image": True,
                           "actor_adopted": True, "rapier_space_valid": True, "worker_failed": False,
                           "extent": [2048, 1024], "rectangles": 1, "grid_check": {"ok": True, "pixels": 2097152, "mismatches": 0},
                           "errors": [], "process_id": pid + 1000, "setup_sha256": sha256(raw), "saved_label": "saved-test",
                           "active_label": "original-test" if phase == "load" else "saved-test", "label": "original-test",
                           "midge_id": 1, "collision_observed": False}
                if phase == "load":
                    receipt.update(physics_tick=True, midge_drive=True, save_readback=True, midge_displacement_cells=2.0,
                                   drive_start=[115.0, 448.0], drive_end=[115.0, 446.0], drive_key="W",
                                   drive_ticks_elapsed=20, directed_up_displacement_cells=2.0)
                else:
                    receipt["fresh_reopen"] = True
                q[phase + "_evidence"] = {"exit_code": 0, "timeout": False, "pid": pid,
                                          "receipt": receipt, "stdout": base + "/" + phase + ".stdout.log",
                                          "stderr": base + "/" + phase + ".stderr.log"}
            self.qualifications.append(q)
        self.run = {"schema": "cybersand-native-run-v1", "complete": True, "errors": [],
                    "execution": self.execution, "runtime": self.runtime,
                    "selection": [q["map"] for q in self.qualifications],
                    "qualifications": [f"maps/{n}/qualification.json" for n in range(count)]}
        self.sync()

    def sync(self):
        self.files["candidate-provenance.json"] = canonical_bytes(self.candidate)
        self.files["run.json"] = canonical_bytes(self.run)
        for q, name in zip(self.qualifications, self.run["qualifications"]):
            for phase in ("load", "reopen"):
                item = q.get(phase + "_evidence")
                if item is not None:
                    stdout = b"Godot synthetic test fixture\nCANVAS_NATIVE_EVIDENCE " + canonical_bytes(item["receipt"])
                    self.files[item["stdout"]] = stdout
                    self.files[item["stderr"]] = b""
                    item["stdout_sha256"] = sha256(stdout)
                    item["stderr_sha256"] = sha256(b"")
            self.files[name] = canonical_bytes(q)
        return self

    def archive(self):
        return packed(self.files)

    def records(self):
        archive = self.archive()
        return native_records(self.files, {"artifact_id": 10, "archive_sha256": sha256(archive),
            "artifact_sha256": sha256(packed({"native-evidence.zip": archive}, manifest=False)),
            "artifact_url": f"https://github.com/{REPOSITORY}/actions/runs/{self.execution['run_id']}/artifacts/10"})[1]


def publication(records, run_id="1234", archive_sha=None):
    result = {"schema": "cybersand-native-publication-v1", "run_key": "test-" + run_id,
            "origin": records[0]["execution"]["origin"], "run_id": run_id, "attempt": 1,
            "archive_sha256": archive_sha or records[0]["evidence"]["archive_sha256"],
            "record_ids": [r["record_id"] for r in records], "validation": "VERIFIED"}
    execution = records[0]["execution"]
    if execution["origin"] == "github-hosted-windows":
        result["workflow_sha"] = execution["workflow_sha"]
        if "implementation_sha" in execution:
            result["implementation_sha"] = execution["implementation_sha"]
    return result


class EvidenceTests(unittest.TestCase):
    def test_validated_archive_and_actual_export_readback(self):
        fixture = NativeFixture()
        files, run, records = verify_archive(fixture.archive())
        self.assertEqual(records[0]["qualification"]["basic_native"], "PASS_BASIC_NATIVE")
        self.assertEqual(records[0]["qualification"]["gui"], "UNTESTED")
        verify_manifest(files)
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / "evidence"
            for key, data in fixture.files.items():
                path = source / key
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(data)
            output = Path(directory) / "evidence.zip"
            result = export(source, output)
            self.assertEqual(result["status"], "VALIDATED")
            self.assertEqual(result["archive_sha256"], sha256(output.read_bytes()))
            self.assertEqual(len(verify_archive(output)[2]), 1)

    def test_manifest_covers_all_bytes_and_cannot_hide_extra_members(self):
        files = safe_zip(NativeFixture().archive())
        for variant in ("tampered", "missing", "extra", "duplicate"):
            changed = dict(files)
            if variant == "tampered":
                changed["run.json"] += b" "
            elif variant == "missing":
                del changed["run.json"]
            elif variant == "extra":
                changed["hidden.py"] = b"print('not executed')"
            else:
                manifest = load_json(changed["manifest.json"])
                manifest["files"].append(manifest["files"][0])
                changed["manifest.json"] = canonical_bytes(manifest)
            with self.subTest(variant=variant), self.assertRaises(IntegrityError):
                verify_manifest(changed)

    def test_traversal_symlink_case_collision_and_windows_aliases_rejected(self):
        for name in ("../escape", "/absolute", "a\\escape", "a/file:stream", "a/NUL.txt", "a/trailing.", "a\x00hidden"):
            with self.subTest(name=name), self.assertRaises(IntegrityError):
                safe_zip(packed({name: b"test"}, manifest=False))
        with self.assertRaises(IntegrityError):
            safe_zip(packed({"A.json": b"a", "a.json": b"b"}, manifest=False))
        stream = BytesIO()
        with zipfile.ZipFile(stream, "w") as archive:
            info = zipfile.ZipInfo("symlink")
            info.external_attr = (stat.S_IFLNK | 0o777) << 16
            archive.writestr(info, "../outside")
        with self.assertRaises(IntegrityError):
            safe_zip(stream.getvalue())

    def test_process_exits_timeout_missing_reopen_and_grid_mismatch_rejected(self):
        mutations = [lambda q: q["load_evidence"].update(exit_code="0"),
                     lambda q: q["load_evidence"].update(exit_code=False),
                     lambda q: q["load_evidence"].update(exit_code=9),
                     lambda q: q["load_evidence"].update(timeout=True),
                     lambda q: q.update(reopen_evidence=None),
                     lambda q: q["reopen_evidence"]["receipt"]["grid_check"].update(mismatches=1),
                     lambda q: q["reopen_evidence"].update(pid=101),
                     lambda q: q["reopen_evidence"]["receipt"].update(process_id=1101),
                     lambda q: q["reopen_evidence"]["receipt"].update(setup_sha256="0" * 64),
                     lambda q: q["reopen_evidence"]["receipt"].update(active_label="wrong-file")]
        for n, mutate in enumerate(mutations):
            fixture = NativeFixture()
            mutate(fixture.qualifications[0])
            fixture.sync()
            with self.subTest(case=n), self.assertRaises(IntegrityError):
                verify_archive(fixture.archive())

    def test_log_marker_and_errors_are_independently_checked(self):
        for case in ("missing", "duplicate", "error"):
            fixture = NativeFixture()
            phase = fixture.qualifications[0]["load_evidence"]
            raw = fixture.files[phase["stdout"]]
            fixture.files[phase["stdout"]] = {"missing": b"success\n", "duplicate": raw + raw, "error": raw + b"SCRIPT ERROR: broken\n"}[case]
            phase["stdout_sha256"] = sha256(fixture.files[phase["stdout"]])
            fixture.files[fixture.run["qualifications"][0]] = canonical_bytes(fixture.qualifications[0])
            with self.subTest(case=case), self.assertRaises(IntegrityError):
                verify_archive(fixture.archive())

    def test_wrong_pr_setup_runtime_and_candidate_identity_rejected(self):
        for case in ("pr", "setup", "runtime", "candidate"):
            fixture = NativeFixture()
            q = fixture.qualifications[0]
            if case == "pr":
                q["map"] = {**q["map"], "pr": 99}
            elif case == "setup":
                fixture.files[q["original_setup_path"]] += b" "
            elif case == "runtime":
                q["runtime"] = {**fixture.runtime, "native_dll_sha256": "0" * 64}
            else:
                fixture.candidate["source_commit"] = "f" * 40
                fixture.runtime["provenance"]["candidate_manifest_sha256"] = sha256(canonical_bytes(fixture.candidate))
            fixture.sync()
            with self.subTest(case=case), self.assertRaises(IntegrityError):
                verify_archive(fixture.archive())

    def test_head_observation_states_require_matching_actual_evidence(self):
        fixture = NativeFixture()
        head = fixture.qualifications[0]["map"]["head_sha"]
        cases = [observation(head), observation(head, "STALE_CONFIRMED"), observation(head, "UNVERIFIED"), observation(head, "CLOSED")]
        for value in cases:
            self.assertEqual(verify_head_observation(value, head), value["state"])
        contradictions = [{**observation(head), "observed_head_sha": "f" * 40},
                          {**observation(head, "STALE_CONFIRMED"), "observed_head_sha": head},
                          {**observation(head, "UNVERIFIED"), "observed_head_sha": head},
                          {**observation(head, "CLOSED"), "pr_state": "open"}]
        for value in contradictions:
            with self.subTest(value=value), self.assertRaises(IntegrityError):
                verify_head_observation(value, head)

    def test_after_execution_rate_limit_retains_pending_native_result(self):
        fixture = NativeFixture()
        q = fixture.qualifications[0]
        q["head_after"] = observation(q["map"]["head_sha"], "UNVERIFIED")
        q["status"] = "NATIVE_PASS_PENDING_HEAD"
        fixture.sync()
        self.assertEqual(verify_archive(fixture.archive())[2][0]["qualification"]["basic_native"], "NATIVE_PASS_PENDING_HEAD")
        q["status"] = "PASS_BASIC_NATIVE"
        fixture.sync()
        with self.assertRaises(IntegrityError):
            verify_archive(fixture.archive())

    def test_one_failed_map_does_not_upgrade_or_erase_successful_peer(self):
        fixture = NativeFixture(2)
        q = fixture.qualifications[1]
        q.update(status="FAIL_NATIVE", native_status="FAIL_NATIVE", reopen_evidence=None,
                 error="synthetic crash after load")
        fixture.sync()
        records = verify_archive(fixture.archive())[2]
        self.assertEqual([r["qualification"]["basic_native"] for r in records], ["PASS_BASIC_NATIVE", "FAIL_NATIVE"])

    def test_initial_unverified_head_cannot_claim_native_pass(self):
        fixture = NativeFixture()
        q = fixture.qualifications[0]
        q["head_before"] = observation(q["map"]["head_sha"], "UNVERIFIED")
        fixture.sync()
        with self.assertRaises(IntegrityError):
            verify_archive(fixture.archive())

    def test_directed_drive_requires_command_ticks_and_geometric_projection(self):
        for changes in ({"drive_key": "S"}, {"drive_ticks_elapsed": 19}, {"drive_ticks_elapsed": True},
                        {"drive_start": None}, {"directed_up_displacement_cells": 0.0},
                        {"drive_end": [117.0, 448.0]}, {"drive_end": [115.0, 450.0]},
                        {"directed_up_displacement_cells": 2000.0}):
            fixture = NativeFixture()
            fixture.qualifications[0]["load_evidence"]["receipt"].update(changes)
            fixture.sync()
            with self.subTest(changes=changes), self.assertRaises(IntegrityError):
                verify_archive(fixture.archive())

    def test_incomplete_export_retains_verified_diagnostics_without_publishability(self):
        fixture = NativeFixture()
        fixture.qualifications[0]["reopen_evidence"] = None
        fixture.sync()
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / "evidence"
            for key, data in fixture.files.items():
                path = source / key
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(data)
            output = Path(directory) / "diagnostic.zip"
            result = export(source, output)
            self.assertEqual(result["status"], "REJECTED")
            self.assertEqual(result["publication"], "FORBIDDEN_INCOMPLETE_EVIDENCE")
            self.assertTrue(result["missing_evidence"])
            files = safe_zip(output)
            verify_manifest(files)
            self.assertEqual(files["maps/0/load.stdout.log"], fixture.files["maps/0/load.stdout.log"])
            with self.assertRaises(IntegrityError):
                verify_archive(output)

    def test_archive_resource_limits_and_strict_json(self):
        raw = packed({"one": b"x" * 100, "two": b"y"}, manifest=False)
        for limits in ({"max_archive": 10}, {"max_entries": 1}, {"max_member": 99}, {"max_expanded": 100}):
            with self.subTest(limits=limits), self.assertRaises(IntegrityError):
                safe_zip(raw, **limits)
        for raw in (b'{"x":1,"x":2}', b'{"x":NaN}', b'{"x":1e999}', b'{"x":"\\ud800"}'):
            with self.subTest(raw=raw), self.assertRaises(IntegrityError):
                load_json(raw)

    def test_export_does_not_package_tokens(self):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / "evidence"
            source.mkdir()
            secret = "SYNTHETIC_TEST_SECRET_123456"
            (source / "stdout.log").write_text(secret)
            output = Path(directory) / "unsafe.zip"
            with patch.dict(os.environ, {"GITHUB_TOKEN": secret}), self.assertRaises(IntegrityError):
                export(source, output)
            self.assertFalse(output.exists())


if __name__ == "__main__":
    unittest.main()
