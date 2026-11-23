#!/usr/bin/env python3
"""Custody refusal and scientific-identity regression tests (stdlib only)."""
import copy
import hashlib
import struct
import unittest
from custody_verify import (SOURCE_GROUPS, classify, compare_archive_members,
                            git_blob, safe_path, source_set, verify_bytes)
from custody_failed_attempts import inverse_operations


class CustodyRefusalTests(unittest.TestCase):
    def test_exact_blob_and_hash_then_single_byte_tamper(self):
        data = b'{"extent":[2048,1024]}\n'
        verify_bytes(data, git_blob(data), hashlib.sha256(data).hexdigest())
        with self.assertRaisesRegex(ValueError, "Git object"):
            verify_bytes(data.replace(b"2048", b"2049"), git_blob(data))

    def test_independently_wrong_sha256_is_refused(self):
        data = b"frozen bytes"
        with self.assertRaisesRegex(ValueError, "SHA-256"):
            verify_bytes(data, git_blob(data), "0" * 64)

    def test_cross_platform_traversal_and_ambiguity_refused(self):
        for path in ("../x", "/x", "a/../x", "a//x", "a/./x", "a\\x", "C:x", "a./x", "a /x"):
            with self.subTest(path=path), self.assertRaises(ValueError):
                safe_path(path)
        self.assertEqual(safe_path("PR-0001-abcd/images/overview.png"), "PR-0001-abcd/images/overview.png")

    def test_duplicate_zip_member_refused(self):
        with self.assertRaisesRegex(ValueError, "Duplicate"):
            compare_archive_members(["a", "a"], {"a"})

    def test_missing_and_extra_files_refused(self):
        for actual in (["a"], ["a", "b", "c"]):
            with self.assertRaisesRegex(ValueError, "member mismatch"):
                compare_archive_members(actual, {"a", "b"})
        compare_archive_members(["a", "b"], {"a", "b"})

    def test_same_pr_with_conflicting_pins_refused(self):
        index = {name: [] for name in SOURCE_GROUPS}
        index["trial_ledger"] = {"pr": 209, "sha": "a" * 40}
        index["prepass"] = [{"pr": 150, "sha": "b" * 40}]
        index["gold25"] = [{"pr": 150, "sha": "c" * 40}]
        with self.assertRaisesRegex(ValueError, "Conflicting"):
            source_set(index)

    def test_same_source_roles_accumulate_without_duplicate_count(self):
        index = {name: [] for name in SOURCE_GROUPS}
        index["trial_ledger"] = {"pr": 209, "sha": "a" * 40}
        index["prepass"] = [{"pr": 150, "sha": "b" * 40}]
        index["gold25"] = [{"pr": 150, "sha": "b" * 40}]
        result = source_set(index)
        self.assertEqual(len(result), 2)
        self.assertEqual(set(result[0]["roles"]), {"PREPASS", "GOLD25"})

    def test_unpinned_source_refused(self):
        index = {name: [] for name in SOURCE_GROUPS}
        index["trial_ledger"] = {"pr": 209, "sha": "main"}
        with self.assertRaisesRegex(ValueError, "Unpinned"):
            source_set(index)

    def test_setup_dimensions_and_evidence_distinction(self):
        self.assertEqual(classify("setup.json", b'{"version":2,"extent":[1024,2048],"edits":[]}'),
                         ("setup-v2", [1024, 2048]))
        self.assertEqual(classify("receipt.json", b'{"extent":[1024,2048]}'), ("structured-evidence", None))

    def test_unknown_inverse_refused_and_source_input_unchanged(self):
        with self.assertRaises(ValueError):
            inverse_operations("B1-first-attempt", {})
        final = {"groups": [{"operations": []}, {"operations": [["R", 774, 575, 8, 10, 58]]}]}
        frozen = copy.deepcopy(final)
        recovered, _ = inverse_operations("B3", final)
        self.assertEqual(final, frozen)
        self.assertEqual(recovered["groups"][1]["operations"][-1], ["L",805,584,843,565,8,62])


if __name__ == "__main__":
    unittest.main()
