#!/usr/bin/env python3
"""Independent hostile exact-byte reconstruction fixtures; no network is used.

These fixtures exercise the actual acquisition implementation, including its
output/cache boundary. They do not execute acquired files or touch user data.
"""
from __future__ import annotations

import base64
import copy
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import zipfile
import zlib

HERE = Path(__file__).resolve().parent
MODULE = Path(os.environ.get("GOLDMAPS_ACQUIRE_MODULE", str(HERE.parent / "integration/acquire_owner_package.py")))
SPEC = importlib.util.spec_from_file_location("owner_acquire_under_review", MODULE)
acquire = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(acquire)


def digest(data):
    return hashlib.sha256(data).hexdigest()


def inline(path, data):
    return {"path": path, "bytes": len(data), "sha256": digest(data),
            "origin": {"kind": "inline_zlib_base64", "data": base64.b64encode(zlib.compress(data)).decode()}}


class ReconstructionContract(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="goldmaps-acquisition-test-")
        self.root = Path(self.temp.name)
        self.doc = {"schema": "goldmaps.owner-acquisition.v1", "engine_head": "0" * 40,
                    "delivery_source_head": "1" * 40, "payload_manifest_sha256": digest(b"{}\n"),
                    "files": [inline("payload-manifest.v1.json", b"{}\n"), inline("sample/source.json", b'{"owner_accepted":false}\n')]}

    def tearDown(self):
        self.temp.cleanup()

    def parsed(self, doc=None, raw=None):
        data = raw if raw is not None else json.dumps(doc or self.doc).encode()
        path = self.root / "acquisition.json"
        path.write_bytes(data)
        return acquire.load_manifest(path, digest(data))

    def reconstruct(self, doc=None):
        return acquire.acquire(self.parsed(doc), self.root / "output", self.root / "cache", jobs=2)

    def test_valid_offline_exact_reconstruction(self):
        result = self.reconstruct()
        self.assertEqual(result["status"], "EXACT_BYTES_RECONSTRUCTED")
        self.assertEqual(result["files"], 2)
        self.assertEqual((self.root / "output/sample/source.json").read_bytes(), b'{"owner_accepted":false}\n')

    def test_external_manifest_hash_required(self):
        path = self.root / "acquisition.json"
        path.write_text(json.dumps(self.doc))
        with self.assertRaises(ValueError):
            acquire.load_manifest(path, "f" * 64)

    def test_duplicate_json_key_refused(self):
        with self.assertRaises(ValueError):
            self.parsed(raw=b'{"schema":"goldmaps.owner-acquisition.v1","schema":"goldmaps.owner-acquisition.v1","files":[]}')

    def test_unsafe_and_overlong_paths_refused(self):
        for name in ("../escaped", "/absolute", "C:/escape", "a\\b", "a//b", "a/./b", "CON.txt", "a/LPT9", "trailing.", "trailing ", "a\x00b", "x" * 1025):
            with self.subTest(name=repr(name)):
                doc = copy.deepcopy(self.doc)
                doc["files"][1]["path"] = name
                with self.assertRaises(ValueError):
                    self.parsed(doc)

    def test_case_aliases_and_file_directory_collisions_refused(self):
        for names in (("a", "A"), ("a", "a/b"), ("A", "a/B")):
            with self.subTest(names=names):
                doc = copy.deepcopy(self.doc)
                doc["files"] = [inline(name, b"x") for name in names]
                with self.assertRaises(ValueError):
                    self.parsed(doc)

    def test_invalid_byte_lengths_refused(self):
        for size in (-1, True, 1.5, acquire.MAX_FILE + 1):
            with self.subTest(size=size):
                doc = copy.deepcopy(self.doc)
                doc["files"][1]["bytes"] = size
                with self.assertRaises(ValueError):
                    self.parsed(doc)

    def test_untrusted_url_authority_refused(self):
        for url in ("http://github.com/a", "https://example.invalid/a", "https://github.com:444/a", "https://user:secret@github.com/a", "file:///etc/passwd"):
            with self.subTest(url=url):
                doc = copy.deepcopy(self.doc)
                doc["files"][1]["origin"] = {"kind": "url", "url": url}
                with self.assertRaises(ValueError):
                    self.parsed(doc)

    def test_unknown_origin_refused(self):
        doc = copy.deepcopy(self.doc)
        doc["files"][1]["origin"] = {"kind": "script", "command": "never executed"}
        with self.assertRaises(ValueError):
            self.parsed(doc)

    def test_bad_digest_and_substituted_inline_bytes_refused(self):
        doc = copy.deepcopy(self.doc)
        doc["files"][1]["sha256"] = "a" * 64
        with self.assertRaises(ValueError):
            self.reconstruct(doc)

    def test_compressed_overrun_refused(self):
        doc = copy.deepcopy(self.doc)
        doc["files"][1]["origin"]["data"] = base64.b64encode(zlib.compress(b"x" * 1024 * 1024)).decode()
        with self.assertRaises(ValueError):
            self.reconstruct(doc)

    def test_trailing_compressed_data_refused(self):
        doc = copy.deepcopy(self.doc)
        encoded = doc["files"][1]["origin"]["data"]
        doc["files"][1]["origin"]["data"] = base64.b64encode(base64.b64decode(encoded) + b"extra").decode()
        with self.assertRaises(ValueError):
            self.reconstruct(doc)

    def test_existing_output_never_overwritten(self):
        output = self.root / "output"
        output.mkdir()
        (output / "owner-save.json").write_text("owner data")
        with self.assertRaises(ValueError):
            self.reconstruct()
        self.assertEqual((output / "owner-save.json").read_text(), "owner data")

    @unittest.skipIf(os.name == "nt", "Creating Windows symlinks may require privileges; Unix fixture is independently recorded.")
    def test_output_and_cache_parent_symlinks_refused(self):
        target = self.root / "elsewhere"
        target.mkdir()
        alias = self.root / "alias"
        alias.symlink_to(target, target_is_directory=True)
        for output, cache in ((alias / "output", self.root / "cache"), (self.root / "output", alias / "cache")):
            with self.subTest(output=str(output), cache=str(cache)):
                with self.assertRaises(ValueError):
                    acquire.acquire(self.parsed(), output, cache)
        self.assertEqual(list(target.iterdir()), [])

    def archive_doc(self, duplicate=False):
        archive = self.root / "upstream.zip"
        with zipfile.ZipFile(archive, "w") as z:
            z.writestr("member.bin", b"verified member")
            if duplicate:
                z.writestr("member.bin", b"verified member")
        archive_sha = acquire.sha(archive)
        doc = copy.deepcopy(self.doc)
        doc["files"][1] = {"path": "sample/member.bin", "bytes": 15, "sha256": digest(b"verified member"),
                           "origin": {"kind": "zip_member", "url": "https://github.com/test/test/releases/download/pinned/upstream.zip",
                                      "archive_sha256": archive_sha, "member": "member.bin"}}
        cache = self.root / "cache"
        cache.mkdir()
        (cache / (archive_sha + ".zip")).write_bytes(archive.read_bytes())
        return doc

    def test_pinned_cached_archive_member(self):
        result = self.reconstruct(self.archive_doc())
        self.assertEqual(result["status"], "EXACT_BYTES_RECONSTRUCTED")
        self.assertEqual((self.root / "output/sample/member.bin").read_bytes(), b"verified member")

    def test_duplicate_upstream_member_refused(self):
        with self.assertRaises(ValueError):
            self.reconstruct(self.archive_doc(duplicate=True))

    @unittest.skipIf(os.name == "nt", "Creating Windows symlinks may require privileges; Unix fixture is independently recorded.")
    def test_cache_member_symlink_cannot_truncate_other_file(self):
        doc = self.archive_doc()
        digest_value = doc["files"][1]["origin"]["archive_sha256"]
        cached = self.root / "cache" / (digest_value + ".zip")
        cached.unlink()
        protected = self.root / "protected.txt"
        protected.write_text("owner save must survive")
        cached.symlink_to(protected)
        with patch.object(acquire, "download") as mocked:
            with self.assertRaises(ValueError):
                self.reconstruct(doc)
            mocked.assert_not_called()
        self.assertEqual(protected.read_text(), "owner save must survive")

    def test_reconstructed_payload_manifest_must_match_pin(self):
        doc = copy.deepcopy(self.doc)
        doc["payload_manifest_sha256"] = "f" * 64
        with self.assertRaises(ValueError):
            self.reconstruct(doc)


if __name__ == "__main__":
    unittest.main(verbosity=2)
