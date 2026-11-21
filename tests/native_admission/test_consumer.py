import copy
import unittest

from tools.native_admission import catalog, consumer
from tools.native_admission.common import IntegrityError, PREFIX, REPOSITORY, record_id
from tools.native_admission.github import GitHubError
try:
    from .test_evidence import NativeFixture, observation, publication
except ImportError:
    from test_evidence import NativeFixture, observation, publication


class ConsumerClient:
    def __init__(self, files=None):
        self.files = files or {}
        self.commit = "9" * 40
        self.live_ref = self.commit
        self.engine = "c" * 40
        self.heads = {}
        self.verification = "VERIFIED_CURRENT"
        self.json_calls = []
        self.byte_calls = []
        self.rate_limited = False

    def get_json(self, path):
        self.json_calls.append(path)
        if "/git/ref/" in path:
            return {"object": {"sha": self.live_ref}}
        if path.endswith("/commits/main"):
            return {"sha": self.engine}
        if "/pulls/" in path:
            if self.rate_limited:
                raise GitHubError("RATE_LIMITED", "synthetic rate limit", 403)
            pr = int(path.rsplit("/", 1)[-1])
            return {"head": {"sha": self.heads.get(pr, "a" * 40)}}
        raise AssertionError("unexpected read")

    def get_bytes(self, url):
        self.byte_calls.append(url)
        prefix = f"https://raw.githubusercontent.com/{REPOSITORY}/{self.commit}/"
        if not url.startswith(prefix):
            raise AssertionError("consumer mixed mutable and immutable reads")
        self.live_ref = "8" * 40
        return self.files[url[len(prefix):]]

    def verify_pr(self, repository, pr, head):
        return observation(head, self.verification)


class ConsumerTests(unittest.TestCase):
    def test_snapshot_resolves_ref_once_and_pins_every_read(self):
        records = NativeFixture().records()
        _, files, _ = catalog.merge(catalog.empty_index(), publication(records), records)
        client = ConsumerClient(files)
        commit, index, observed = consumer.remote_snapshot(client)
        self.assertEqual(commit, "9" * 40)
        self.assertEqual(client.live_ref, "8" * 40)
        self.assertEqual(len(client.json_calls), 1)
        self.assertTrue(all("/" + commit + "/" in url for url in client.byte_calls))
        self.assertEqual(observed, records)
        self.assertEqual(len(index["records"]), 1)

    def test_explicit_snapshot_commit_needs_no_branch_lookup(self):
        records = NativeFixture().records()
        _, files, _ = catalog.merge(catalog.empty_index(), publication(records), records)
        client = ConsumerClient(files)
        consumer.remote_snapshot(client, "9" * 40)
        self.assertEqual(client.json_calls, [])

    def test_current_match_and_independent_superseded_demonstration(self):
        records = NativeFixture().records()
        result = consumer.consume(ConsumerClient(), records, [25],
            expected_dll=records[0]["runtime"]["native_dll_sha256"], prove_superseded=True,
            origin="github-hosted-windows")
        self.assertEqual(result["status"], "VERIFIED_CURRENT")
        self.assertTrue(result["results"][0]["current"])
        self.assertEqual(result["changed_head_checks"][0]["status"], "SUPERSEDED")
        self.assertFalse(result["changed_head_checks"][0]["modified_repository"])
        for aspect in ("art", "shepherd", "gui", "collision", "hazards"):
            self.assertEqual(result[aspect], "UNTESTED")

    def test_owner_success_does_not_satisfy_required_hosted_origin(self):
        record = NativeFixture().records()[0]
        owner = copy.deepcopy(record)
        owner["execution"].update(origin="owner-local-windows", run_id="owner-test",
                                  evidence_id="owner-archive-sha256:" + owner["evidence"]["archive_sha256"])
        owner["provenance"]["quality"] = "historical-reconciled"
        owner["record_id"] = record_id(owner)
        result = consumer.consume(ConsumerClient(), [owner], [25], expected_dll=owner["runtime"]["native_dll_sha256"],
                                  origin="github-hosted-windows")
        self.assertEqual(result["status"], "NOT_ACCEPTED")
        self.assertEqual(result["results"][0]["status"], "MISSING")
        self.assertFalse(result["results"][0]["current"])
        own_result = consumer.consume(ConsumerClient(), [owner], [25], expected_dll=owner["runtime"]["native_dll_sha256"],
                                      origin="owner-local-windows")
        self.assertEqual(own_result["results"][0]["origins"], ["owner-local-windows"])

    def test_current_changed_head_is_superseded_and_unknown_is_pending(self):
        records = NativeFixture().records()
        client = ConsumerClient()
        client.heads[25] = "f" * 40
        result = consumer.consume(client, records, [25], expected_dll=records[0]["runtime"]["native_dll_sha256"])
        self.assertEqual(result["results"][0]["status"], "SUPERSEDED")
        self.assertEqual(result["status"], "NOT_ACCEPTED")
        client = ConsumerClient()
        client.verification = "UNVERIFIED"
        result = consumer.consume(client, records, [25], expected_dll=records[0]["runtime"]["native_dll_sha256"])
        self.assertEqual(result["results"][0]["status"], "NATIVE_PASS_PENDING_HEAD")
        self.assertFalse(result["results"][0]["current"])

    def test_wrong_dll_new_engine_or_missing_pr_never_borrow_old_pass(self):
        records = NativeFixture().records()
        client = ConsumerClient()
        result = consumer.consume(client, records, [25], expected_dll="0" * 64)
        self.assertEqual(result["status"], "NOT_ACCEPTED")
        client.engine = "f" * 40
        result = consumer.consume(client, records, [25], expected_dll=records[0]["runtime"]["native_dll_sha256"])
        self.assertEqual(result["status"], "NOT_ACCEPTED")
        result = consumer.consume(ConsumerClient(), records, [999], expected_dll=records[0]["runtime"]["native_dll_sha256"])
        self.assertEqual(result["results"][0]["status"], "MISSING")

    def test_one_pr_with_two_setups_has_two_exact_lookups(self):
        fixture = NativeFixture(2)
        fixture.qualifications[1]["map"]["pr"] = 25
        fixture.sync()
        records = fixture.records()
        result = consumer.consume(ConsumerClient(), records, [25], expected_dll=fixture.runtime["native_dll_sha256"])
        self.assertEqual(result["status"], "VERIFIED_CURRENT")
        self.assertEqual(len(result["results"]), 2)
        self.assertEqual(len({r["query"]["setup_path"] for r in result["results"]}), 2)

    def test_network_and_integrity_failure_cannot_return_acceptance(self):
        records = NativeFixture().records()
        client = ConsumerClient()
        client.rate_limited = True
        with self.assertRaises(GitHubError):
            consumer.consume(client, records, [25], expected_dll=records[0]["runtime"]["native_dll_sha256"])
        _, files, _ = catalog.merge(catalog.empty_index(), publication(records), records)
        files[PREFIX + "/latest.json"] += b" "
        with self.assertRaises(IntegrityError):
            consumer.remote_snapshot(ConsumerClient(files))


if __name__ == "__main__":
    unittest.main()
