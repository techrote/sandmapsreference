import copy
import hashlib
import json
from pathlib import Path
import tempfile
import unittest

from tools.native_admission.discovery import DiscoveryError, discover_maps, material_ids_from_header, safe_setup_path, validate_setup


def setup():
    return {"version": 2, "extent": [2048, 1024],
            "actors": [{"id": 1, "model": "midge", "hash": "b" * 64, "spawn": [115, 448],
                        "options": {"budget": 20, "mass_multiplier": 1, "inertia_multiplier": 1,
                                    "thrust_multiplier": 1, "torque_multiplier": 1, "boost_multiplier": 2}}],
            "next_id": 2, "selected": 1, "edits": [[0, 0, 2048, 4, 58]], "response": "LA-SELECTIVE",
            "liquid_policy": [0], "normalize": False, "rule_radius": 2, "source": [],
            "material": 58, "brush": 8, "fire": False}


def encoded(value):
    return json.dumps(value, separators=(",", ":")).encode()


class FixtureClient:
    def __init__(self, count=1):
        self.raw = encoded(setup())
        self.sha = hashlib.sha1(b"blob " + str(len(self.raw)).encode() + b"\0" + self.raw).hexdigest()
        self.pr = {"number": 25, "state": "open", "draft": True,
                   "head": {"sha": "a" * 40, "ref": "original/fixture", "repo": {"full_name": "techrote/sandmapsreference"}},
                   "base": {"sha": "b" * 40, "repo": {"full_name": "techrote/sandmapsreference"}}}
        self.entries = [{"path": f"cybersand-canvases/2048x1024/map/setup-{n}.json", "mode": "100644",
                         "type": "blob", "sha": self.sha, "size": len(self.raw)} for n in range(count)]
        self.base_entries = []
        self.truncated = False
        self.verification = "VERIFIED_CURRENT"
        self.calls = []

    def get_json(self, path):
        self.calls.append(path)
        if "/pulls/" in path:
            return copy.deepcopy(self.pr)
        if "/git/commits/" in path:
            sha = path.rsplit("/", 1)[-1]
            return {"sha": sha, "tree": {"sha": ("c" if sha == "a" * 40 else "d") * 40}}
        if "/git/trees/" in path:
            current = path.endswith("c" * 40 + "?recursive=1")
            return {"sha": ("c" if current else "d") * 40, "truncated": self.truncated,
                    "tree": copy.deepcopy(self.entries if current else self.base_entries)}
        raise AssertionError("unexpected request")

    def fetch_blob(self, repository, sha, max_bytes):
        self.calls.append("blob:" + sha)
        return self.raw

    def verify_pr(self, repository, pr, head_sha):
        return {"state": self.verification}


class DiscoveryTests(unittest.TestCase):
    def test_valid_grid_identity_and_circle_contract(self):
        value = setup()
        value["edits"].append([0, 0, 2, 62])
        raw = encoded(value)
        result = validate_setup(raw)
        self.assertEqual(result["setup_sha256"], hashlib.sha256(raw).hexdigest())
        self.assertEqual(result["rectangle_count"], 1)
        self.assertEqual(result["stamp_count"], 2)

    def test_invalid_json_boolean_numeric_and_materials(self):
        cases = []
        for field, val in (("version", True), ("extent", [2048, 1023]), ("rule_radius", "2"),
                           ("edits", [[0, 0, 1, 1, 10]]), ("edits", [[0, 0, 1, 1, 132]]),
                           ("edits", [[2047, 0, 2, 1, 58]]), ("edits", [[0, 0, 1.5, 1, 58]]),
                           ("edits", [[False, 0, 1, 1, 58]]), ("selected", 7)):
            value = setup()
            value[field] = val
            cases.append(encoded(value))
        cases += [b'{"version":2,"version":2}', b'{"version":NaN}', b"[" * 100 + b"0" + b"]" * 100]
        for raw in cases:
            with self.subTest(raw=raw[:60]), self.assertRaises(DiscoveryError):
                validate_setup(raw)

    def test_limits_and_untrusted_resources(self):
        value = setup()
        value["edits"] = [[0, 0, 1, 1, 58]] * 32769
        with self.assertRaisesRegex(DiscoveryError, "SETUP_EDITS"):
            validate_setup(encoded(value))
        value["edits"] = [[0, 0, 2048, 1024, 58]] * 16
        with self.assertRaisesRegex(DiscoveryError, "SETUP_WORK_LIMIT"):
            validate_setup(encoded(value))
        value = setup()
        value["script"] = "res://evil.gd"
        with self.assertRaises(DiscoveryError):
            validate_setup(encoded(value))
        value = setup()
        value["actors"].append(copy.deepcopy(value["actors"][0]))
        with self.assertRaisesRegex(DiscoveryError, "SETUP_ACTOR"):
            validate_setup(encoded(value))
        value = setup()
        value["actors"][0]["options"]["budget"] = 10 ** 400
        with self.assertRaises(DiscoveryError):
            validate_setup(encoded(value))

    def test_unsafe_paths(self):
        for path in ("/setup.json", "cybersand-canvases/2048x1024/../setup.json",
                     "cybersand-canvases/2048x1024/a/./setup.json", "cybersand-canvases/2048x1024/a/setup.json:evil",
                     "cybersand-canvases/2048x1024/a\\setup.json", "cybersand-canvases/2048x1024/a/setup%2f.json",
                     "cybersand-canvases/2048x1024/a/build.py"):
            with self.subTest(path=path), self.assertRaises(DiscoveryError):
                safe_setup_path(path)

    def test_same_pr_multiple_setups_writes_exact_originals(self):
        client = FixtureClient(count=2)
        client.entries.append({"path": "tools/evil.py", "mode": "100755", "type": "blob", "sha": "f" * 40})
        with tempfile.TemporaryDirectory() as directory:
            maps = discover_maps(client, [25], output_dir=directory)
            originals = list(Path(directory).glob("*/original-setup.json"))
            self.assertEqual(len(maps), 2)
            self.assertEqual(len(originals), 2)
            self.assertTrue(all(path.read_bytes() == client.raw for path in originals))
            self.assertTrue(all(item["head_sha"] == "a" * 40 for item in maps))
            self.assertNotEqual(maps[0]["setup_path"], maps[1]["setup_path"])
            self.assertNotIn("blob:" + "f" * 40, client.calls)

    def test_base_fixtures_excluded_without_mutable_pr_file_list(self):
        client = FixtureClient(count=2)
        client.base_entries = [copy.deepcopy(client.entries[0])]
        maps = discover_maps(client, [25])
        self.assertEqual(len(maps), 1)
        self.assertTrue(maps[0]["setup_path"].endswith("setup-1.json"))

    def test_head_changes_and_unverified_block_discovery(self):
        for state in ("STALE_CONFIRMED", "UNVERIFIED", "CLOSED"):
            client = FixtureClient()
            client.verification = state
            with self.subTest(state=state), self.assertRaisesRegex(DiscoveryError, "HEAD_NOT_CURRENT"):
                discover_maps(client, [25])

    def test_truncated_tree_symlink_and_wrong_commit_block(self):
        client = FixtureClient()
        client.truncated = True
        with self.assertRaisesRegex(DiscoveryError, "TREE_INCOMPLETE"):
            discover_maps(client, [25])
        client = FixtureClient()
        client.entries[0]["mode"] = "120000"
        with self.assertRaisesRegex(DiscoveryError, "UNSAFE_BLOB"):
            discover_maps(client, [25])
        client = FixtureClient()
        client.entries.append(copy.deepcopy(client.entries[0]))
        with self.assertRaisesRegex(DiscoveryError, "TREE_INVALID"):
            discover_maps(client, [25])

    def test_six_fixture_limit_and_duplicate_prs(self):
        with self.assertRaisesRegex(DiscoveryError, "PILOT_BUDGET"):
            discover_maps(FixtureClient(count=7), [25])
        with self.assertRaisesRegex(DiscoveryError, "PILOT_BUDGET"):
            discover_maps(FixtureClient(), [25, 25])

    def test_catalogue_is_parsed_without_executing_source(self):
        header = b'enum class Material : std::uint8_t { Empty = 0, Smoke = 4, Gas = Smoke, Wall = 58, };'
        self.assertEqual(material_ids_from_header(header), frozenset({0, 4, 58}))
        with self.assertRaises(DiscoveryError):
            material_ids_from_header(b'enum class Material : std::uint8_t { Empty = 0, Evil = call(), };')


if __name__ == "__main__":
    unittest.main()
