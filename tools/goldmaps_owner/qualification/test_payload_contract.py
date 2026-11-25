#!/usr/bin/env python3
"""Hostile fixtures for the independent portable payload boundary."""
import copy
import hashlib
import io
import json
from pathlib import Path
import tempfile
import unittest
import warnings
import zipfile

import verify_payload as audit


class PayloadContract(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="goldmaps package with spaces ")
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name) / "payload"
        self.root.mkdir()
        self.files = {"Open GOLDMAPS.cmd": b"@echo off\r\n", "collection/setups/example.json": b'{"version":2}\n'}
        self.manifest = {"schema": audit.SCHEMA, "engine_head": "1" * 40,
                         "mutable_roots": list(audit.MUTABLE_ROOTS), "files": [
                             {"path": path, "bytes": len(data), "sha256": audit.sha256(data),
                              "origin": {"kind": "fixture", "purpose": "qualification-negative-test"}}
                             for path, data in self.files.items()]}
        for name, data in self.files.items():
            path = self.root / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(data)
        self.write_manifest()

    def write_manifest(self, raw=None):
        raw = raw or (json.dumps(self.manifest, indent=2) + "\n").encode()
        (self.root / audit.MANIFEST).write_bytes(raw)
        (self.root / audit.SIDECAR).write_text(audit.sha256(raw) + "  " + audit.MANIFEST + "\n")

    def archive(self, additions=(), prefix="Owner Kit/"):
        path = Path(self.temp.name) / "evaluation package.zip"
        with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
            for p in self.root.rglob("*"):
                if p.is_file():
                    z.write(p, prefix + p.relative_to(self.root).as_posix())
            with warnings.catch_warnings():
                warnings.simplefilter("ignore", UserWarning)
                for name, data in additions:
                    z.writestr(name, data)
        return path

    def test_valid_directory_and_space_path(self):
        report = audit.verify_directory(self.root)
        self.assertTrue(report["pass"])
        self.assertEqual(report["total_files"], 4)

    def test_valid_actual_zip_and_crc(self):
        report = audit.verify_zip(self.archive())
        self.assertEqual(report["zip_crc"], "PASS")
        self.assertEqual(report["total_files"], 4)

    def test_missing_required_file(self):
        (self.root / "Open GOLDMAPS.cmd").unlink()
        with self.assertRaisesRegex(ValueError, "inventory mismatch"):
            audit.verify_directory(self.root)

    def test_corrupted_same_size_file(self):
        p = self.root / "Open GOLDMAPS.cmd"
        p.write_bytes(b"X" + p.read_bytes()[1:])
        with self.assertRaisesRegex(ValueError, "byte mismatch"):
            audit.verify_directory(self.root)

    def test_substituted_setup(self):
        (self.root / "collection/setups/example.json").write_bytes(b'{"version":3}\n')
        with self.assertRaisesRegex(ValueError, "byte mismatch"):
            audit.verify_directory(self.root)

    def test_extra_executable(self):
        (self.root / "unreviewed.exe").write_bytes(b"not permitted")
        with self.assertRaisesRegex(ValueError, "inventory mismatch"):
            audit.verify_directory(self.root, post_execution=True)

    def test_postrun_mutable_is_narrow(self):
        p = self.root / "userdata/reviews/decision.json"
        p.parent.mkdir(parents=True)
        p.write_text("{}")
        self.assertEqual(audit.verify_directory(self.root, post_execution=True)["mutable_additions"],
                         ["userdata/reviews/decision.json"])
        with self.assertRaisesRegex(ValueError, "inventory mismatch"):
            audit.verify_directory(self.root)

    def test_mutable_prefix_not_substring(self):
        p = self.root / "userdata-untrusted/file.exe"
        p.parent.mkdir()
        p.write_bytes(b"unapproved")
        with self.assertRaisesRegex(ValueError, "inventory mismatch"):
            audit.verify_directory(self.root, post_execution=True)

    def test_shipped_cache_file_still_immutable(self):
        name = "browser/.godot/shipped.cache"
        p = self.root / name
        p.parent.mkdir(parents=True)
        p.write_bytes(b"original")
        self.manifest["files"].append({"path": name, "bytes": 8, "sha256": audit.sha256(b"original"), "origin": {"kind": "fixture"}})
        self.write_manifest()
        p.write_bytes(b"modified")
        with self.assertRaisesRegex(ValueError, "byte mismatch"):
            audit.verify_directory(self.root, post_execution=True)

    def test_manifest_cannot_broaden_exclusion(self):
        self.manifest["mutable_roots"].append("runtime/")
        self.write_manifest()
        with self.assertRaisesRegex(ValueError, "broaden"):
            audit.verify_directory(self.root)

    def test_manifest_duplicate_path(self):
        self.manifest["files"].append(copy.deepcopy(self.manifest["files"][0]))
        self.write_manifest()
        with self.assertRaisesRegex(ValueError, "duplicate"):
            audit.verify_directory(self.root)

    def test_manifest_case_alias(self):
        alias = copy.deepcopy(self.manifest["files"][0])
        alias["path"] = alias["path"].upper()
        self.manifest["files"].append(alias)
        self.write_manifest()
        with self.assertRaisesRegex(ValueError, "aliased"):
            audit.verify_directory(self.root)

    def test_duplicate_json_key(self):
        self.write_manifest(b'{"schema":"x","schema":"goldmaps.owner-payload.v1"}')
        with self.assertRaisesRegex(ValueError, "duplicate JSON key"):
            audit.verify_directory(self.root)

    def test_manifest_sidecar_tampering(self):
        (self.root / audit.SIDECAR).write_text("0" * 64 + "  " + audit.MANIFEST)
        with self.assertRaisesRegex(ValueError, "sidecar mismatch"):
            audit.verify_directory(self.root)

    def test_external_manifest_pin(self):
        with self.assertRaisesRegex(ValueError, "externally pinned"):
            audit.verify_directory(self.root, "0" * 64)

    def test_absent_origin(self):
        self.manifest["files"][0]["origin"] = {}
        self.write_manifest()
        with self.assertRaisesRegex(ValueError, "provenance"):
            audit.verify_directory(self.root)

    def test_boolean_byte_count(self):
        self.manifest["files"][0]["bytes"] = True
        self.write_manifest()
        with self.assertRaisesRegex(ValueError, "file size"):
            audit.verify_directory(self.root)

    def test_unsafe_paths(self):
        for name in ("../outside", "/absolute", "C:/drive", "a\\b", "a//b", "a/./b", "a/../b",
                     "a/CON.txt", "a/file.", "a/file ", "a/file:stream", "a/\x00bad"):
            with self.subTest(name=name), self.assertRaises(ValueError):
                audit.safe_path(name)

    def test_symlink_refused(self):
        target = self.root / "link"
        try:
            target.symlink_to(self.root / "Open GOLDMAPS.cmd")
        except OSError:
            self.skipTest("host does not permit symlink creation")
        with self.assertRaisesRegex(ValueError, "symlink"):
            audit.verify_directory(self.root)

    def test_zip_duplicate_member(self):
        with self.assertRaisesRegex(ValueError, "duplicate"):
            audit.verify_zip(self.archive([("Owner Kit/Open GOLDMAPS.cmd", b"malicious")]))

    def test_zip_case_alias(self):
        with self.assertRaisesRegex(ValueError, "aliased"):
            audit.verify_zip(self.archive([("Owner Kit/open goldmaps.CMD", b"malicious")]))

    def test_zip_path_traversal(self):
        with self.assertRaisesRegex(ValueError, "unsafe"):
            audit.verify_zip(self.archive([("Owner Kit/../../escaped", b"malicious")]))

    def test_zip_extra_payload(self):
        with self.assertRaisesRegex(ValueError, "inventory mismatch"):
            audit.verify_zip(self.archive([("Owner Kit/unknown.exe", b"malicious")]))

    def test_zip_envelope_escape(self):
        with self.assertRaisesRegex(ValueError, "outside"):
            audit.verify_zip(self.archive([("outside.exe", b"malicious")]))

    def test_zip_symlink(self):
        info = zipfile.ZipInfo("Owner Kit/alias")
        info.create_system = 3
        info.external_attr = 0o120777 << 16
        with self.assertRaisesRegex(ValueError, "nonregular"):
            audit.verify_zip(self.archive([(info, b"../outside")]))


if __name__ == "__main__":
    unittest.main(verbosity=2)
