import copy
import unittest

from tools.native_admission import catalog
from tools.native_admission.common import IntegrityError, PREFIX, canonical_bytes, record_id, sha256
try:
    from .test_evidence import NativeFixture, observation, publication
except ImportError:
    from test_evidence import NativeFixture, observation, publication


def query_args(record):
    m, runtime = record["map"], record["runtime"]
    return {"pr": m["pr"], "head_sha": m["head_sha"], "setup_path": m["setup_path"],
            "setup_sha256": m["setup_sha256"], "engine_sha": runtime["engine_sha"],
            "native_dll_sha256": runtime["native_dll_sha256"]}


class CatalogTests(unittest.TestCase):
    def test_immutable_merge_and_duplicate_replay(self):
        records = NativeFixture().records()
        run = publication(records)
        index, files, changed = catalog.merge(catalog.empty_index(), run, records)
        self.assertTrue(changed)
        self.assertEqual(len(index["records"]), 1)
        again, changes, changed = catalog.merge(index, run, records)
        self.assertFalse(changed)
        self.assertEqual(changes, {})
        self.assertEqual(again, index)
        loaded, loaded_records = catalog.read_snapshot(files.__getitem__)
        self.assertEqual(loaded_records, records)
        self.assertEqual(loaded, index)

    def test_attempt_cannot_be_republished_as_another_archive(self):
        records = NativeFixture().records()
        run = publication(records)
        index, _, _ = catalog.merge(catalog.empty_index(), run, records)
        for change in ({"archive_sha256": "2" * 64}, {"run_key": "another-key", "archive_sha256": "2" * 64}):
            with self.subTest(change=change), self.assertRaises(IntegrityError):
                catalog.merge(index, {**run, **change}, records)

    def test_conflicting_exact_source_failure_is_retained_and_exposed(self):
        passed = NativeFixture().records()[0]
        failed = copy.deepcopy(passed)
        failed["execution"]["run_id"] = "1235"
        failed["evidence"]["artifact_url"] = failed["evidence"]["artifact_url"].replace("/1234/", "/1235/")
        failed["evidence"]["archive_sha256"] = "2" * 64
        failed["qualification"]["basic_native"] = "FAIL_NATIVE"
        failed["record_id"] = record_id(failed)
        index, files, _ = catalog.merge(catalog.empty_index(), publication([passed]), [passed])
        index, changed, _ = catalog.merge(index, publication([failed], "1235", "2" * 64), [failed])
        files.update(changed)
        self.assertEqual(len(catalog.read_snapshot(files.__getitem__)[1]), 2)
        result = catalog.query([passed, failed], **query_args(passed))
        self.assertEqual(result["status"], "CONFLICT")
        self.assertFalse(result["current"])

    def test_exact_source_lookup_never_borrows_other_head_setup_or_runtime(self):
        record = NativeFixture().records()[0]
        args = query_args(record)
        changes = [({"head_sha": "f" * 40}, "SUPERSEDED"),
                   ({"setup_sha256": "0" * 64}, "SETUP_MISMATCH"),
                   ({"engine_sha": "f" * 40}, "RUNTIME_MISMATCH"),
                   ({"native_dll_sha256": "0" * 64}, "RUNTIME_MISMATCH"),
                   ({"setup_path": "another/setup.json"}, "MISSING")]
        for change, expected in changes:
            result = catalog.query([record], **{**args, **change})
            with self.subTest(change=change):
                self.assertEqual(result["status"], expected)
                self.assertFalse(result["current"])

    def test_latest_engine_and_current_head_are_required_for_current_pass(self):
        record = NativeFixture().records()[0]
        args = query_args(record)
        current = observation(record["map"]["head_sha"])
        result = catalog.query([record], **args, current_head=current,
                               current_engine_sha=record["runtime"]["engine_sha"])
        self.assertTrue(result["current"])
        self.assertEqual(result["art"], "UNTESTED")
        self.assertFalse(catalog.query([record], **args)["current"])
        unknown = observation(record["map"]["head_sha"], "UNVERIFIED")
        result = catalog.query([record], **args, current_head=unknown,
                               current_engine_sha=record["runtime"]["engine_sha"])
        self.assertEqual(result["status"], "NATIVE_PASS_PENDING_HEAD")
        result = catalog.query([record], **args, current_head=current, current_engine_sha="f" * 40)
        self.assertEqual(result["status"], "ENGINE_SUPERSEDED")
        self.assertFalse(result["current"])

    def test_current_claim_with_different_observed_sha_is_rejected(self):
        record = NativeFixture().records()[0]
        observation_bad = {**observation(record["map"]["head_sha"]), "observed_head_sha": "f" * 40}
        with self.assertRaises(IntegrityError):
            catalog.query([record], **query_args(record), current_head=observation_bad,
                          current_engine_sha=record["runtime"]["engine_sha"])

    def test_snapshot_rejects_index_and_record_byte_or_identity_changes(self):
        records = NativeFixture().records()
        index, files, _ = catalog.merge(catalog.empty_index(), publication(records), records)
        for case in ("index", "record", "index_projection"):
            changed = dict(files)
            if case == "index":
                changed[PREFIX + "/latest.json"] += b" "
            elif case == "record":
                changed[index["records"][0]["path"]] += b" "
            else:
                altered = copy.deepcopy(index)
                altered["records"][0]["map"]["pr"] = 99
                data = canonical_bytes(altered)
                changed[PREFIX + "/latest.json"] = data
                changed[PREFIX + "/latest.sha256"] = (sha256(data) + "  latest.json\n").encode()
            with self.subTest(case=case), self.assertRaises(IntegrityError):
                catalog.read_snapshot(changed.__getitem__)

    def test_run_inventory_must_match_records_before_publication(self):
        records = NativeFixture().records()
        run = publication(records)
        run["record_ids"] = []
        with self.assertRaises(IntegrityError):
            catalog.merge(catalog.empty_index(), run, records)


if __name__ == "__main__":
    unittest.main()
