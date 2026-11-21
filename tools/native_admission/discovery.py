"""Resolve a bounded pilot to immutable Setup-v2 data; never run map code.

Python checks protect resource and provenance boundaries. The accepted engine's
own Setup.validate remains the final native parser and actor-definition authority.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
from pathlib import Path, PurePosixPath
import re

from .github import GitHubClient, GitHubError, commit_sha, repository_name, strict_json, utc_now

MAP_REPOSITORY = "techrote/sandmapsreference"
ENGINE_REPOSITORY = "techrote/cybersand"
PILOT_PRS = (25, 26, 17, 22)
MAX_SETUP_BYTES = 1024 * 1024
MAX_EDITS = 32768
MAX_PAINT_CELLS = 32000000
ROOT_KEYS = {"version", "extent", "actors", "next_id", "selected", "edits", "response",
             "liquid_policy", "normalize", "rule_radius", "source", "material", "brush", "fire"}
BRUSH_MATERIALS = (2, 14, 29, 13, 19, 23, 25, 26, 27, 3, 58, 0, 8, 16, 12, 7, 9, 28)
OPTION_RANGES = {"budget": (5, 80), "mass_multiplier": (0.01, 64), "inertia_multiplier": (0.01, 64),
                 "thrust_multiplier": (0, 64), "torque_multiplier": (0, 64), "boost_multiplier": (1, 8)}
# Audited at accepted 69209acaffb34ebe18c45e19290b5976b7fb2c82. Discovery plans
# always derive the actual catalogue from their freshly resolved accepted source.
AUDITED_MATERIAL_IDS = frozenset(range(132)) - {10}


class DiscoveryError(RuntimeError):
    def __init__(self, code: str, message: str):
        self.code = code
        super().__init__(f"{code}: {message}")


def _require(condition: bool, code: str, message: str):
    if not condition:
        raise DiscoveryError(code, message)


def _number(value, low, high):
    return type(value) in (int, float) and low <= value <= high and math.isfinite(value)


def _integer(value, low, high):
    return _number(value, low, high) and value == math.floor(value)


def safe_setup_path(value: str) -> str:
    _require(isinstance(value, str) and 1 <= len(value) <= 400, "UNSAFE_PATH", "invalid Setup path")
    path = PurePosixPath(value)
    _require(not path.is_absolute() and str(path) == value and "\\" not in value,
             "UNSAFE_PATH", "Setup path must be canonical POSIX")
    _require(all(re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9_.-]{0,127}", item) for item in path.parts),
             "UNSAFE_PATH", "unsafe Setup path component")
    _require(value.startswith("cybersand-canvases/2048x1024/")
             and re.fullmatch(r"setup(?:-[A-Za-z0-9_-]+)?\.json", path.name) is not None,
             "UNSAFE_PATH", "pilot accepts landscape Setup JSON data only")
    return value


def material_ids_from_header(data: bytes) -> frozenset[int]:
    _require(len(data) <= 256 * 1024, "MATERIAL_CATALOG", "material header exceeds budget")
    try:
        text = data.decode("utf-8")
    except UnicodeError:
        raise DiscoveryError("MATERIAL_CATALOG", "material header is not UTF-8") from None
    text = re.sub(r"/\*.*?\*/|//[^\n]*", "", text, flags=re.S)
    match = re.search(r"enum\s+class\s+Material\s*:\s*std::uint8_t\s*\{([^}]+)\}", text)
    _require(match is not None, "MATERIAL_CATALOG", "accepted material enum not found")
    values = {}
    for entry in match.group(1).split(","):
        if not entry.strip():
            continue
        pair = re.fullmatch(r"\s*([A-Za-z_]\w*)\s*=\s*([A-Za-z_]\w*|\d+)\s*", entry)
        _require(pair is not None, "MATERIAL_CATALOG", "unrecognized material enum expression")
        name, value = pair.groups()
        _require(name not in values, "MATERIAL_CATALOG", "duplicate material enum entry")
        if value.isdigit():
            value = int(value)
        else:
            _require(value in values, "MATERIAL_CATALOG", "unresolved material enum alias")
            value = values[value]
        _require(0 <= value <= 255, "MATERIAL_CATALOG", "material ID outside byte domain")
        values[name] = value
    _require(values.get("Empty") == 0 and len(values) >= 2,
             "MATERIAL_CATALOG", "material catalogue lacks empty material")
    return frozenset(values.values())


def validate_setup(data: bytes, *, valid_materials=AUDITED_MATERIAL_IDS) -> dict:
    """Bound data before loading Godot; accepts the ordinary one-Midge pilot subset."""
    try:
        setup = strict_json(data, max_bytes=MAX_SETUP_BYTES, max_depth=12, max_nodes=300000)
    except GitHubError as exc:
        raise DiscoveryError("SETUP_JSON", exc.code) from None
    _require(isinstance(setup, dict) and set(setup) == ROOT_KEYS and _integer(setup["version"], 2, 2),
             "SETUP_SCHEMA", "ordinary Setup-v2 root fields required")
    extent = setup["extent"]
    _require(isinstance(extent, list) and len(extent) == 2
             and all(_integer(v, 512, 2048) and v % 64 == 0 for v in extent)
             and extent == [2048, 1024], "SETUP_EXTENT", "pilot requires exact 2048x1024 extent")
    width, height = map(int, extent)
    _require(setup["response"] in ("LA-SELECTIVE", "LA", "LA-EVENT-OFF", "RFT")
             and type(setup["normalize"]) is bool and type(setup["fire"]) is bool,
             "SETUP_SETTINGS", "invalid response or boolean settings")
    _require(_integer(setup["rule_radius"], 2, 3) and _integer(setup["brush"], 2, 24)
             and _integer(setup["material"], 0, 255) and setup["material"] in BRUSH_MATERIALS,
             "SETUP_SETTINGS", "invalid brush settings")
    actors = setup["actors"]
    _require(isinstance(actors, list) and len(actors) == 1, "SETUP_ACTOR", "pilot requires exactly one Midge")
    actor = actors[0]
    _require(isinstance(actor, dict) and set(actor) == {"id", "model", "hash", "spawn", "options"}
             and actor["model"] == "midge" and _integer(actor["id"], 1, 2147483646)
             and isinstance(actor["hash"], str) and re.fullmatch(r"[0-9a-f]{64}", actor["hash"]) is not None,
             "SETUP_ACTOR", "invalid Midge identity; engine validates definition hash")
    spawn = actor["spawn"]
    _require(isinstance(spawn, list) and len(spawn) == 2 and _number(spawn[0], 0, width)
             and _number(spawn[1], 0, height), "SETUP_ACTOR", "invalid Midge spawn")
    options = actor["options"]
    _require(isinstance(options, dict) and set(options) == set(OPTION_RANGES)
             and all(_number(options[k], *bounds) for k, bounds in OPTION_RANGES.items()),
             "SETUP_ACTOR", "invalid Midge options")
    _require(setup["response"] != "RFT" or options["budget"] == 20,
             "SETUP_ACTOR", "RFT requires actor budget 20")
    _require(_integer(setup["next_id"], 1, 2147483647) and actor["id"] < setup["next_id"]
             and _integer(setup["selected"], 0, 2147483646) and setup["selected"] in (0, actor["id"]),
             "SETUP_ACTOR", "invalid actor instance sequence or selection")
    edits = setup["edits"]
    _require(isinstance(edits, list) and len(edits) <= MAX_EDITS, "SETUP_EDITS", "too many paint stamps")
    painted = 0
    rectangles = 0
    for stamp in edits:
        _require(isinstance(stamp, list) and len(stamp) in (4, 5), "SETUP_EDITS", "invalid stamp shape")
        _require(_integer(stamp[0], 0, width - 1) and _integer(stamp[1], 0, height - 1),
                 "SETUP_EDITS", "invalid stamp coordinates")
        _require(_integer(stamp[-1], 0, 255) and stamp[-1] in valid_materials,
                 "SETUP_MATERIAL", "stamp material absent from accepted catalogue")
        if len(stamp) == 5:
            _require(_integer(stamp[2], 1, width - stamp[0]) and _integer(stamp[3], 1, height - stamp[1]),
                     "SETUP_EDITS", "rectangle outside canvas")
            painted += int(stamp[2] * stamp[3])
            rectangles += 1
        else:
            _require(_integer(stamp[2], 2, 24), "SETUP_EDITS", "invalid disc radius")
            painted += (int(stamp[2]) * 2 + 1) ** 2
        _require(painted <= MAX_PAINT_CELLS, "SETUP_WORK_LIMIT", "paint work budget exceeded")
    source = setup["source"]
    _require(isinstance(source, list) and (not source or (len(source) == 3
             and _integer(source[0], 0, width - 4) and _integer(source[1], 0, height - 24)
             and _integer(source[2], 0, 255) and source[2] in BRUSH_MATERIALS[:9])),
             "SETUP_SOURCE", "invalid powder source")
    policy = setup["liquid_policy"]
    _require(isinstance(policy, list) and 1 <= len(policy) <= 4096
             and all(_integer(v, -2147483648, 2147483647) for v in policy),
             "SETUP_POLICY", "invalid liquid policy")
    return {"setup": setup, "extent": [width, height], "rectangle_count": rectangles,
            "stamp_count": len(edits), "paint_work_cells_upper_bound": painted,
            "setup_bytes": len(data), "setup_sha256": hashlib.sha256(data).hexdigest()}


def _pr_data(client: GitHubClient, repository: str, pr: int) -> dict:
    _require(type(pr) is int and pr > 0, "PR_ID", "positive PR number required")
    data = client.get_json(f"/repos/{repository}/pulls/{pr}")
    _require(isinstance(data, dict) and type(data.get("number")) is int and data.get("number") == pr
             and isinstance(data.get("base"), dict) and isinstance(data.get("head"), dict),
             "PR_RESPONSE", "incomplete direct PR response")
    head = data["head"]
    _require(data.get("state") == "open" and data.get("draft") is True,
             "PR_STATE", "qualification discovery requires open Draft PR")
    _require(isinstance(head.get("repo"), dict) and head["repo"].get("full_name") == repository
             and data["base"].get("repo", {}).get("full_name") == repository,
             "PR_REPOSITORY", "pilot requires same-repository map source")
    commit_sha(head.get("sha"))
    _require(isinstance(head.get("ref"), str) and len(head["ref"]) <= 255
             and head["ref"].startswith(("original/", "worldgroup/", "exemplar/")),
             "PR_SCOPE", "PR is outside original/world-group pilot scope")
    return data


def _git_tree(client: GitHubClient, repository: str, head_sha: str) -> list[dict]:
    commit = client.get_json(f"/repos/{repository}/git/commits/{head_sha}")
    _require(isinstance(commit, dict) and commit.get("sha") == head_sha and isinstance(commit.get("tree"), dict),
             "COMMIT_MISMATCH", "map commit identity mismatch")
    tree_sha = commit_sha(commit["tree"].get("sha"))
    tree = client.get_json(f"/repos/{repository}/git/trees/{tree_sha}?recursive=1")
    _require(isinstance(tree, dict) and tree.get("sha") == tree_sha and tree.get("truncated") is False
             and isinstance(tree.get("tree"), list) and len(tree["tree"]) <= 20000,
             "TREE_INCOMPLETE", "complete bounded immutable tree required")
    seen = set()
    for entry in tree["tree"]:
        _require(isinstance(entry, dict) and isinstance(entry.get("path"), str),
                 "TREE_INVALID", "malformed Git tree entry")
        path = entry["path"]
        _require(path not in seen, "TREE_INVALID", "duplicate Git tree path")
        seen.add(path)
    return tree["tree"]


def _setup_entries(client: GitHubClient, repository: str, head_sha: str, base_sha: str | None = None) -> list[dict]:
    tree = _git_tree(client, repository, head_sha)
    # Compare exact commit trees rather than a potentially changing PR file list.
    # Existing accepted maps must not accidentally expand a future bounded pilot.
    base = {entry["path"]: entry.get("sha") for entry in _git_tree(client, repository, base_sha)} if base_sha else {}
    entries = []
    for entry in tree:
        path = entry["path"]
        if base.get(path) == entry.get("sha"):
            continue
        if not path.startswith("cybersand-canvases/2048x1024/") or not path.rsplit("/", 1)[-1].startswith("setup"):
            continue
        if not path.endswith(".json"):
            continue
        safe_setup_path(path)
        _require(entry.get("type") == "blob" and entry.get("mode") == "100644",
                 "UNSAFE_BLOB", "Setup must be a regular non-executable Git blob")
        commit_sha(entry.get("sha"))
        _require(type(entry.get("size")) is int and 0 < entry["size"] <= MAX_SETUP_BYTES,
                 "SETUP_SIZE", "Setup blob exceeds byte budget")
        entries.append(entry)
    return sorted(entries, key=lambda entry: entry["path"])


def discover_maps(client: GitHubClient, pr_numbers=PILOT_PRS, *, output_dir: Path | str | None = None,
                  max_maps: int = 6, repository: str = MAP_REPOSITORY,
                  valid_materials=AUDITED_MATERIAL_IDS) -> list[dict]:
    repository_name(repository)
    numbers = list(pr_numbers)
    _require(type(max_maps) is int and 1 <= max_maps <= 6 and 1 <= len(numbers) <= 6
             and len(set(numbers)) == len(numbers), "PILOT_BUDGET", "pilot permits 1-6 unique PRs and at most six setups")
    maps = []
    for number in numbers:
        pr = _pr_data(client, repository, number)
        head = pr["head"]["sha"]
        base_sha = commit_sha(pr["base"].get("sha"))
        entries = _setup_entries(client, repository, head, base_sha)
        _require(entries, "NO_SETUP", "selected PR has no admitted landscape Setup blobs")
        _require(len(maps) + len(entries) <= max_maps, "PILOT_BUDGET", "selected PRs exceed six-Setup pilot budget")
        for entry in entries:
            raw = client.fetch_blob(repository, entry["sha"], max_bytes=MAX_SETUP_BYTES)
            _require(len(raw) == entry["size"], "SETUP_SIZE", "tree and blob sizes disagree")
            checked = validate_setup(raw, valid_materials=valid_materials)
            identity = {"repository": repository, "pr": number, "head_sha": head,
                        "branch": pr["head"]["ref"], "setup_path": entry["path"],
                        "setup_blob_sha": entry["sha"], "setup_sha256": checked["setup_sha256"],
                        "setup_bytes": len(raw), "rectangle_count": checked["rectangle_count"],
                        "stamp_count": checked["stamp_count"], "extent": checked["extent"]}
            if output_dir is not None:
                key = hashlib.sha256(entry["path"].encode("utf-8")).hexdigest()[:16]
                directory = Path(output_dir) / f"pr-{number}-{key}"
                directory.mkdir(parents=True, exist_ok=True)
                path = directory / "original-setup.json"
                _require(not path.is_symlink() and (not path.exists() or path.read_bytes() == raw),
                         "FIXTURE_EXISTS", "refusing conflicting existing fixture")
                path.write_bytes(raw)
            maps.append(identity)
        verification = client.verify_pr(repository, number, head)
        _require(verification.get("state") == "VERIFIED_CURRENT", "HEAD_NOT_CURRENT",
                 "discovery HEAD is changed, closed or temporarily unverifiable; no qualification started")
    return maps


def build_plan(client: GitHubClient, *, pr_numbers=PILOT_PRS, output_dir=None) -> dict:
    from .runtime import resolve_runtime
    branch = client.get_json(f"/repos/{ENGINE_REPOSITORY}/branches/main")
    _require(isinstance(branch, dict) and isinstance(branch.get("commit"), dict),
             "ENGINE_RESPONSE", "accepted engine branch response incomplete")
    engine_sha = commit_sha(branch["commit"].get("sha"))
    commit = client.get_json(f"/repos/{ENGINE_REPOSITORY}/git/commits/{engine_sha}")
    _require(commit.get("sha") == engine_sha, "ENGINE_MISMATCH", "accepted engine commit mismatch")
    tree_sha = commit_sha(commit.get("tree", {}).get("sha"))
    header = client.get_bytes(f"https://raw.githubusercontent.com/{ENGINE_REPOSITORY}/{engine_sha}/native/include/cybersand/material.hpp",
                              max_bytes=256 * 1024)
    materials = material_ids_from_header(header)
    maps = discover_maps(client, pr_numbers, output_dir=output_dir, valid_materials=materials)
    return {"schema": "cybersand-native-plan-v1", "created_at": utc_now(),
            "engine": {"repository": ENGINE_REPOSITORY, "head_sha": engine_sha, "tree_sha": tree_sha},
            "runtime": resolve_runtime(client, engine_sha), "maps": maps,
            "material_catalog_sha256": hashlib.sha256(header).hexdigest(),
            "limits": {"max_maps": 6, "max_workers": 2, "max_setup_bytes": MAX_SETUP_BYTES,
                       "max_edits": MAX_EDITS, "max_paint_cells": MAX_PAINT_CELLS}}


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--fixtures", type=Path)
    parser.add_argument("--prs", type=int, nargs="+", default=list(PILOT_PRS))
    args = parser.parse_args(argv)
    client = GitHubClient(token=os.environ.get("GITHUB_TOKEN"))
    try:
        plan = build_plan(client, pr_numbers=args.prs, output_dir=args.fixtures)
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(json.dumps(plan, indent=2, sort_keys=True) + "\n", encoding="utf-8")
        print(json.dumps({"status": "PLAN_RESOLVED", "maps": len(plan["maps"]),
                          "engine_sha": plan["engine"]["head_sha"], "requests": client.request_count}))
        return 0
    except (DiscoveryError, GitHubError) as exc:
        print(json.dumps({"status": "PLAN_UNVERIFIED", "diagnostic": exc.code}))
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
