import copy
import hashlib
import json
import os
from pathlib import Path
import stat
import subprocess
import tempfile
import unittest
from unittest.mock import patch
import zipfile

from tools.native_admission import runtime


class RuntimeTests(unittest.TestCase):
    def test_archive_rejects_traversal_symlink_case_alias_and_windows_names(self):
        cases = [("../escape", None), ("a/../../escape", None), ("C:/escape", None),
                 ("a\\b", None), ("a\x00hidden", None), ("AUX.txt", None), ("folder./x", None),
                 ("link", stat.S_IFLNK | 0o777)]
        with tempfile.TemporaryDirectory() as name:
            root = Path(name)
            for index, (member, mode) in enumerate(cases):
                archive = root / f"{index}.zip"
                with zipfile.ZipFile(archive, "w") as z:
                    info = zipfile.ZipInfo(member)
                    info.filename = info.orig_filename = member
                    if mode:
                        info.external_attr = mode << 16
                    z.writestr(info, b"target")
                with self.subTest(member=member), self.assertRaises(runtime.RuntimeIntegrityError):
                    runtime.safe_extract(archive, root / f"out{index}")
            archive = root / "alias.zip"
            with zipfile.ZipFile(archive, "w") as z:
                z.writestr("One.json", b"a")
                z.writestr("one.json", b"b")
            with self.assertRaises(runtime.RuntimeIntegrityError):
                runtime.safe_extract(archive, root / "aliases")
            self.assertFalse((root.parent / "escape").exists())

    def test_archive_budget_and_crc_validation(self):
        with tempfile.TemporaryDirectory() as name:
            root = Path(name)
            archive = root / "ordinary.zip"
            with zipfile.ZipFile(archive, "w") as z:
                z.writestr("x/file", b"12345")
            with self.assertRaises(runtime.RuntimeIntegrityError):
                runtime.safe_extract(archive, root / "out", maximum=4)
            self.assertEqual(runtime.safe_extract(archive, root / "good"), ["x/file"])
            self.assertEqual((root / "good/x/file").read_bytes(), b"12345")

    def test_strict_json_duplicate_nonfinite(self):
        for value in ('{"x":1,"x":2}', '{"x":NaN}', '{"x":Infinity}'):
            with self.subTest(value=value), self.assertRaises(runtime.RuntimeIntegrityError):
                runtime.strict_json(value)

    def test_secret_environment_is_not_inherited(self):
        with patch.dict(os.environ, {"GITHUB_TOKEN": "secret", "GH_TOKEN": "secret2", "AWS_SECRET_ACCESS_KEY": "secret3",
                                     "ACTIONS_RUNTIME_TOKEN": "secret4", "CUSTOM_SECRET": "secret5"}):
            env = runtime.native_environment({"CYBERSAND_ADMISSION_PHASE": "load"})
        self.assertFalse(any("TOKEN" in key or "SECRET" in key for key in env))
        self.assertEqual(env["CYBERSAND_ADMISSION_PHASE"], "load")

    def metadata(self):
        sha = "1" * 40
        run = {"id": 10, "run_attempt": 2, "head_sha": sha, "head_branch": "main", "event": "push",
               "status": "completed", "conclusion": "success", "path": ".github/workflows/gdextension.yml"}
        artifact = {"id": 20, "name": "native-candidate-windows-10-2", "expired": False,
                    "workflow_run": {"id": 10, "head_sha": sha}, "digest": "sha256:" + "2" * 64,
                    "size_in_bytes": 2000}
        return sha, run, artifact

    def test_wrong_artifact_attempt_source_or_status_fails(self):
        sha, run, artifact = self.metadata()
        runtime.verify_artifact_metadata(run, artifact, sha, 10, 2)
        for field, value in (("run_attempt", 3), ("head_sha", "4" * 40), ("head_branch", "experiment"),
                             ("event", "pull_request"), ("status", "in_progress"), ("conclusion", "failure"),
                             ("path", ".github/workflows/other.yml")):
            changed = {**run, field: value}
            with self.subTest(field=field), self.assertRaises(runtime.RuntimeIntegrityError):
                runtime.verify_artifact_metadata(changed, artifact, sha, 10, 2)
        for field, value in (("expired", True), ("name", "native-candidate-windows-10-1"),
                             ("digest", "sha256:bad"), ("size_in_bytes", 40 * 1024 * 1024),
                             ("workflow_run", {"id": 11, "head_sha": sha})):
            changed = {**artifact, field: value}
            with self.subTest(field=field), self.assertRaises(runtime.RuntimeIntegrityError):
                runtime.verify_artifact_metadata(run, changed, sha, 10, 2)

    def test_exact_checkout_and_dll_manifest(self):
        with tempfile.TemporaryDirectory() as name:
            root = Path(name) / "engine"
            root.mkdir()
            def git(*args):
                return subprocess.check_output(["git", "-C", str(root), *args], stderr=subprocess.DEVNULL).decode().strip()
            git("init")
            git("config", "user.email", "tests@example.invalid")
            git("config", "user.name", "Tests")
            for directory in runtime.SOURCE_SCOPES:
                path = root / directory / "source.cpp"
                path.parent.mkdir(parents=True)
                path.write_text("int fixture = 1;\n")
            (root / "godot/project.godot").write_text("[application]\n")
            git("add", ".")
            git("commit", "-m", "fixture")
            sha = git("rev-parse", "HEAD")
            tree, inputs = runtime.validate_checkout(root, sha)
            candidate = Path(name) / "candidate"
            candidate.mkdir()
            native = candidate / Path(runtime.NATIVE_PATH).name
            native.write_bytes(b"MZcandidate-fixture")
            native_sha = runtime.digest(native)
            manifest = {"schema_version": 1, "kind": "source-built-windows-candidate", "artifact": runtime.NATIVE_PATH,
                        "source_commit": sha, "build_commit": sha, "source_tree": tree, "source_inputs": inputs,
                        "sha256": native_sha, "size": native.stat().st_size}
            runtime.write_json(candidate / "candidate-provenance.json", manifest)
            (candidate / "source-sha.txt").write_text(sha + "\n")
            (candidate / "runtime.sha256").write_text(native_sha + "  " + native.name + "\n")
            self.assertEqual(runtime.verify_candidate(root, candidate, sha)["sha256"], native_sha)
            with self.assertRaises(runtime.RuntimeIntegrityError):
                runtime.verify_candidate(root, candidate, sha, "0" * 64)
            with self.assertRaises(runtime.RuntimeIntegrityError):
                runtime.verify_candidate(root, candidate, "1" * 40)
            native.write_bytes(b"MZdifferent")
            with self.assertRaises(runtime.RuntimeIntegrityError):
                runtime.verify_candidate(root, candidate, sha)
            native.write_bytes(b"MZcandidate-fixture")
            manifest["source_inputs"][next(iter(inputs))] = "3" * 64
            runtime.write_json(candidate / "candidate-provenance.json", manifest)
            with self.assertRaises(runtime.RuntimeIntegrityError):
                runtime.verify_candidate(root, candidate, sha)


if __name__ == "__main__":
    unittest.main()
