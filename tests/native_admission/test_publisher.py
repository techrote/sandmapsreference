import base64
import copy
import hashlib
import unittest

from tools.native_admission import catalog, publisher
from tools.native_admission.common import (EVIDENCE_BRANCH, PREFIX, REPOSITORY, IntegrityError,
    canonical_bytes, load_json, record_id, sha256)
from tools.native_admission.github import GitHubError
try:
    from .test_evidence import NativeFixture, observation, packed, publication
except ImportError:
    from test_evidence import NativeFixture, observation, packed, publication


class MemoryWriter:
    """An in-memory Git graph with non-fast-forward rejection and crash injection."""
    def __init__(self):
        self.main = "1" * 40
        self.head = None
        self.blobs = {}
        self.trees = {"2" * 40: {"README.md": b"accepted main must remain unchanged"}}
        self.commits = {self.main: {"tree": {"sha": "2" * 40}, "parents": []}}
        self.calls = []
        self.interrupt = False
        self.race = None
        self._serial = 100

    def _sha(self):
        self._serial += 1
        return f"{self._serial:040x}"

    def get(self, path):
        if path == "/git/ref/heads/" + EVIDENCE_BRANCH:
            if self.head is None:
                raise GitHubError("HTTP_404", "missing ref", 404)
            return {"object": {"sha": self.head}}
        if path == "/commits/main":
            return {"sha": self.main}
        if path.startswith("/git/commits/"):
            return self.commits[path.rsplit("/", 1)[-1]]
        if path.startswith("/git/trees/"):
            sha = path.split("/git/trees/", 1)[1].split("?", 1)[0]
            return {"truncated": False, "tree": [{"path": name} for name in self.trees[sha]]}
        raise AssertionError("unexpected Git read " + path)

    def write(self, method, path, value):
        self.calls.append((method, path, copy.deepcopy(value)))
        if path == "/git/blobs":
            raw = base64.b64decode(value["content"])
            sha = hashlib.sha1(b"blob " + str(len(raw)).encode() + b"\0" + raw).hexdigest()
            self.blobs[sha] = raw
            return {"sha": sha}
        if path == "/git/trees":
            tree = dict(self.trees.get(value.get("base_tree"), {}))
            tree.update({entry["path"]: self.blobs[entry["sha"]] for entry in value["tree"]})
            sha = self._sha()
            self.trees[sha] = tree
            return {"sha": sha}
        if path == "/git/commits":
            sha = self._sha()
            self.commits[sha] = {"tree": {"sha": value["tree"]}, "parents": value["parents"]}
            return {"sha": sha}
        if path.startswith("/git/refs"):
            if self.interrupt:
                raise publisher.WriteError(500)
            if self.race is not None:
                concurrent, self.race = self.race, None
                publisher.publish(self, concurrent[0], concurrent[1])
            if method == "POST":
                if self.head is not None:
                    raise publisher.WriteError(422)
                if value.get("ref") != "refs/heads/" + EVIDENCE_BRANCH:
                    raise AssertionError("foreign ref")
            else:
                if value.get("force") is not False or self.commits[value["sha"]]["parents"] != [self.head]:
                    raise publisher.WriteError(422)
            self.head = value["sha"]
            return {"object": {"sha": self.head}}
        raise AssertionError("unexpected Git write " + path)

    def read_file(self, path, commit):
        return self.trees[self.commits[commit]["tree"]["sha"]][path]


class ActionsClient:
    def __init__(self, fixture=None):
        self.fixture = fixture or NativeFixture()
        f = self.fixture
        self.archive = f.archive()
        self.wrapper = packed({"native-evidence.zip": self.archive}, manifest=False)
        self.head_state = "VERIFIED_CURRENT"
        self.setup_override = None
        self.path_override = None
        self.json = {
            f"/repos/{REPOSITORY}/actions/runs/1234/attempts/1": {
                "id": 1234, "run_attempt": 1, "head_sha": "d" * 40,
                "path": ".github/workflows/native-admission-windows.yml", "event": "push"},
            f"/repos/{REPOSITORY}/actions/artifacts/10": {
                "id": 10, "expired": False, "name": "native-evidence-1234-1",
                "workflow_run": {"id": 1234, "head_sha": "d" * 40}, "digest": "sha256:" + sha256(self.wrapper)},
            f"/repos/{REPOSITORY}/actions/runs/1234/attempts/1/jobs?per_page=100": {
                "total_count": 1, "jobs": [{"id": 555, "name": "Windows native qualification", "status": "completed",
                    "labels": ["windows-2022"], "conclusion": "success"}]},
            "/repos/techrote/cybersand/actions/artifacts/20": {
                "id": 20, "expired": False, "workflow_run": {"id": 999, "head_sha": "c" * 40},
                "name": "native-candidate-windows-999-1", "digest": "sha256:" + sha256(f.source_archive)},
            "/repos/techrote/cybersand/actions/runs/999": {
                "id": 999, "head_sha": "c" * 40, "conclusion": "success", "status": "completed",
                "event": "push", "head_branch": "main", "path": ".github/workflows/gdextension.yml", "run_attempt": 1}}

    def get_json(self, path):
        if "/contents/" in path:
            source_path = path.split("/contents/", 1)[1].split("?", 1)[0]
            identity = next(q["map"] for q in self.fixture.qualifications if q["map"]["setup_path"] == source_path)
            return {"type": "file", "path": self.path_override or source_path, "sha": identity["setup_blob_sha"]}
        return copy.deepcopy(self.json[path])

    def get_bytes(self, url, max_bytes):
        return self.fixture.source_archive if "/cybersand/" in url else self.wrapper

    def fetch_blob(self, repository, sha, max_bytes):
        return self.setup_override or self.fixture.files[self.fixture.qualifications[0]["original_setup_path"]]

    def verify_pr(self, repository, pr, head):
        return observation(head, self.head_state)


def check_bundle(client):
    return publisher.verified_actions_bundle(client, 10, "1234", 1, "d" * 40)


class PublisherTests(unittest.TestCase):
    def test_full_artifact_upstream_blob_chain_and_publication_head(self):
        for state, expected in (("VERIFIED_CURRENT", "PASS_BASIC_NATIVE"), ("UNVERIFIED", "NATIVE_PASS_PENDING_HEAD"),
                                ("STALE_CONFIRMED", "STALE_CONFIRMED"), ("CLOSED", "CLOSED")):
            client = ActionsClient()
            client.head_state = state
            run, records = check_bundle(client)
            with self.subTest(state=state):
                self.assertEqual(records[0]["qualification"]["basic_native"], expected)
                self.assertEqual(records[0]["provenance"]["qualification_at_execution"], "PASS_BASIC_NATIVE")
                self.assertEqual(run["record_ids"], [records[0]["record_id"]])
                self.assertEqual(run["archive_sha256"], sha256(client.archive))

    def test_wrong_attempt_artifact_source_and_expiry_reject_publication(self):
        mutations = [
            (f"/repos/{REPOSITORY}/actions/runs/1234/attempts/1", {"run_attempt": 2}),
            (f"/repos/{REPOSITORY}/actions/runs/1234/attempts/1", {"head_sha": "a" * 40}),
            (f"/repos/{REPOSITORY}/actions/artifacts/10", {"expired": True}),
            (f"/repos/{REPOSITORY}/actions/artifacts/10", {"name": "native-evidence-1234-2"}),
            (f"/repos/{REPOSITORY}/actions/artifacts/10", {"digest": "sha256:" + "0" * 64}),
            (f"/repos/{REPOSITORY}/actions/artifacts/10", {"workflow_run": {"id": 777, "head_sha": "d" * 40}}),
            ("/repos/techrote/cybersand/actions/artifacts/20", {"name": "native-candidate-windows-999-2"}),
            ("/repos/techrote/cybersand/actions/artifacts/20", {"digest": "sha256:" + "0" * 64}),
            ("/repos/techrote/cybersand/actions/runs/999", {"run_attempt": 2}),
            ("/repos/techrote/cybersand/actions/runs/999", {"conclusion": "failure"}),
            ("/repos/techrote/cybersand/actions/runs/999", {"head_sha": "f" * 40})]
        for path, change in mutations:
            client = ActionsClient()
            client.json[path].update(change)
            with self.subTest(path=path, change=change), self.assertRaises(IntegrityError):
                check_bundle(client)

    def test_cancelled_unapproved_or_missing_job_is_not_publishable(self):
        for update in ({"conclusion": "cancelled"}, {"status": "in_progress"},
                       {"labels": ["self-hosted", "windows-2022"]}, {"id": 999}):
            client = ActionsClient()
            client.json[f"/repos/{REPOSITORY}/actions/runs/1234/attempts/1/jobs?per_page=100"]["jobs"][0].update(update)
            with self.subTest(update=update), self.assertRaises(IntegrityError):
                check_bundle(client)

    def test_consistently_forged_local_candidate_cannot_replace_authoritative_dll(self):
        fixture = NativeFixture()
        fixture.candidate["sha256"] = "0" * 64
        fixture.runtime["native_dll_sha256"] = "0" * 64
        fixture.runtime["provenance"]["candidate_manifest_sha256"] = sha256(canonical_bytes(fixture.candidate))
        fixture.sync()
        with self.assertRaisesRegex(IntegrityError, "authoritative"):
            check_bundle(ActionsClient(fixture))

    def test_authoritative_setup_bytes_and_path_are_bound(self):
        client = ActionsClient()
        client.setup_override = b"wrong Setup"
        with self.assertRaisesRegex(IntegrityError, "Setup blob"):
            check_bundle(client)
        client = ActionsClient()
        client.path_override = "wrong/setup.json"
        with self.assertRaisesRegex(IntegrityError, "path/commit"):
            check_bundle(client)

    def test_atomic_publication_and_duplicate_retry_preserve_commit(self):
        records = NativeFixture().records()
        run = publication(records)
        writer = MemoryWriter()
        result = publisher.publish(writer, run, records)
        self.assertEqual(result["status"], "PUBLISHED")
        self.assertNotIn("README.md", writer.trees[writer.commits[writer.head]["tree"]["sha"]])
        self.assertEqual(writer.main, "1" * 40)
        count = len(writer.calls)
        retry = publisher.publish(writer, run, records)
        self.assertEqual(retry["status"], "ALREADY_PUBLISHED")
        self.assertEqual(retry["commit"], result["commit"])
        self.assertEqual(len(writer.calls), count)
        catalog.read_snapshot(lambda path: writer.read_file(path, writer.head))

    def test_interruption_before_ref_update_leaves_no_partial_publication(self):
        records = NativeFixture().records()
        writer = MemoryWriter()
        writer.interrupt = True
        with self.assertRaises(publisher.WriteError):
            publisher.publish(writer, publication(records), records)
        self.assertIsNone(writer.head)
        writer.interrupt = False
        self.assertEqual(publisher.publish(writer, publication(records), records)["status"], "PUBLISHED")

    def test_concurrent_first_publishers_merge_without_lost_records_or_force(self):
        first = NativeFixture().records()
        second = copy.deepcopy(first)
        second[0]["execution"]["run_id"] = "1235"
        second[0]["evidence"]["artifact_url"] = second[0]["evidence"]["artifact_url"].replace("/1234/", "/1235/")
        second[0]["record_id"] = record_id(second[0])
        writer = MemoryWriter()
        writer.race = (publication(second, "1235"), second)
        result = publisher.publish(writer, publication(first), first)
        self.assertEqual(result["retries"], 1)
        index, records = catalog.read_snapshot(lambda path: writer.read_file(path, writer.head))
        self.assertEqual(len(index["runs"]), 2)
        self.assertEqual({r["execution"]["run_id"] for r in records}, {"1234", "1235"})
        self.assertTrue(all(payload.get("force") is False for method, path, payload in writer.calls if method == "PATCH"))

    def test_extra_files_cannot_escape_evidence_location(self):
        records = NativeFixture().records()
        for path in ("main.json", PREFIX + "/schemas/../../main.json"):
            with self.subTest(path=path), self.assertRaises(IntegrityError):
                publisher.publish(MemoryWriter(), publication(records), records, extra_files={path: b"{}"})


if __name__ == "__main__":
    unittest.main()
