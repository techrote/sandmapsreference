#!/usr/bin/env python3
"""Independent delivery-roster audit against immutable finalisation records.

Replays only the already authored material planes to detect delivery changes.
It does not score art, rerun the frozen experiment, infer owner preferences, or
admit static reference maps into native play. The reviewer implementation is
separate from the collection builder.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
from pathlib import Path

import numpy as np
from PIL import Image

from verify_payload import file_sha256 as sha, safe_path, strict_json

GOLD = {106, 109, 125, 130, 131, 136, 143, 146, 147, 148, 150, 153, 155, 159, 163, 168, 174, 175, 176, 179, 182, 184, 193, 197, 207}
REPAIRS = {202, 203, 204, 205, 206, 207, 208}
EXPECTED_CELLS = {"B1": 3283, "B2": 5195, "B3": 2376, "C1": 0, "C2": 0, "C3": 0, "D1": 15807, "D2": 7692}
RECOVERED_155 = "3d0f9c9efd293eed5a38b59c89fd0754a0a202a730bcd0fbe011237fb58772f0"


def plane(setup):
    def integer(value):
        if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or int(value) != value:
            raise ValueError("nonintegral material-plane value")
        return int(value)
    width, height = map(integer, setup["extent"])
    if any(n < 512 or n > 2048 or n % 64 for n in (width, height)):
        raise ValueError("delivery extent outside admitted corpus bounds")
    grid = np.zeros((height, width), dtype=np.uint8)
    if len(setup["edits"]) > 32768:
        raise ValueError("delivery stamp budget exceeded")
    for original_stamp in setup["edits"]:
        stamp = list(map(integer, original_stamp))
        if len(stamp) not in (4, 5):
            raise ValueError("invalid integral material stamp")
        x, y, material = stamp[0], stamp[1], stamp[-1]
        if not (0 <= material < 132 and material != 10 and 0 <= x < width and 0 <= y < height):
            raise ValueError("invalid material or stamp origin")
        if len(stamp) == 5:
            w, h = stamp[2:4]
            if w <= 0 or h <= 0 or x + w > width or y + h > height:
                raise ValueError("rectangle exceeds original material extent")
            grid[y:y+h, x:x+w] = material
        else:
            radius = stamp[2]
            if not 2 <= radius <= 24:
                raise ValueError("invalid authored brush radius")
            left, right = max(0, x-radius), min(width, x+radius+1)
            top, bottom = max(0, y-radius), min(height, y+radius+1)
            yy, xx = np.ogrid[top:bottom, left:right]
            area = grid[top:bottom, left:right]
            area[(xx-x)**2 + (yy-y)**2 <= radius**2] = material
    return grid


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--package", type=Path, required=True)
    parser.add_argument("--frozen-repo", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--native-profile-log", type=Path, help="Optional actual runtime default-policy receipt; not an all-map native gate")
    args = parser.parse_args()
    root, frozen = args.package.resolve(), args.frozen_repo.resolve()
    collection_path = root / "collection/collection.v1.json"
    collection = strict_json(collection_path.read_bytes())
    authority_path = frozen / "docs/corpus/goldmaps-finalisation-001/corpus.v1.json"
    authority = strict_json(authority_path.read_bytes())
    old_inputs = strict_json((frozen / "scripts/goldmaps_finalisation/native_inputs.v1.json").read_bytes())["records"]
    expected_sources = {row["pr"]: row for row in authority["maps"]}
    maps = collection["maps"]
    by_id = {row["id"]: row for row in maps}
    if len(by_id) != len(maps):
        raise ValueError("duplicate logical map identity")
    corpus_view = [row for row in maps if "corpus" in row["collections"]]
    if len(corpus_view) != 70 or {row["source"]["pr"] for row in corpus_view} != set(expected_sources):
        raise ValueError("all-corpus index does not preserve exactly the frozen 70 source identities")
    for key, prs, count in (("gold25", GOLD, 25), ("portraits", REPAIRS, 7)):
        view = [row for row in maps if key in row["collections"]]
        if len(view) != count or {row["source"]["pr"] for row in view} != prs:
            raise ValueError(key + " collection membership differs from authority")
    if any(row.get("owner_accepted") is not False or row.get("owner", {}).get("accepted") is not False for row in maps):
        raise ValueError("delivery silently adopts an owner classification")
    for expected in old_inputs:
        actual = by_id.get(expected["id"])
        if actual is None or actual["setup"]["sha256"] != expected["setup_sha256"]:
            raise ValueError("historical required alias lost or substituted: " + expected["id"])
        if expected["id"] != "derived-155-policy" and (actual["source"]["pr"], actual["source"]["commit"], actual["source"]["path"]) != (expected["pr"], expected["head"], expected["path"]):
            raise ValueError("historical alias source provenance changed: " + expected["id"])
    setups, tested, previews, checks = {}, {}, set(), []
    for row in maps:
        record = row["setup"]
        path = root / safe_path(record["path"])
        if sha(path) != record["sha256"] or path.stat().st_size != record["bytes"]:
            raise ValueError("Setup bytes differ: " + row["id"])
        setup = strict_json(path.read_bytes())
        setups[row["id"]] = setup
        if row["actors"] != setup["actors"] or row["authored_selected_actor"] != setup["selected"] or record["dimensions"] != setup["extent"]:
            raise ValueError("metadata misidentifies native actors or dimensions: " + row["id"])
        if record["sha256"] not in tested:
            material = plane(setup)
            digest = hashlib.sha256(material.tobytes()).hexdigest()
            if digest != record["material_plane_sha256"]:
                raise ValueError("independent material replay disagrees: " + row["id"])
            tested[record["sha256"]] = digest
        if "policy" not in row["collections"]:
            original = expected_sources[row["source"]["pr"]]
            source = original["source"]
            if (row["source"]["commit"], row["source"]["path"], record["sha256"]) != (original["head"], source["path"], source["sha256"]):
                raise ValueError("original source identity changed: " + row["id"])
            if record["material_plane_sha256"] != original["material_plane"]["plane_sha256"]:
                raise ValueError("geometry differs from frozen material lock: " + row["id"])
        preview = row["preview"]
        image_path = root / safe_path(preview["path"])
        if sha(image_path) != preview["sha256"]:
            raise ValueError("preview source bytes changed: " + row["id"])
        with Image.open(image_path) as image:
            if list(image.size) != record["dimensions"]:
                raise ValueError("preview is not native-resolution full extent: " + row["id"])
        previews.add(preview["sha256"])
        checks.append({"id": row["id"], "source_pr": row["source"]["pr"], "setup_sha256": record["sha256"],
                       "plane_sha256": tested[record["sha256"]], "actors_equal_metadata": True, "pass": True})
    corrections = []
    for pr, parent_id in ((155, "gold-155"), (183, "corpus-183")):
        derived_id = "derived-" + str(pr) + "-policy"
        parent, child = setups[parent_id], setups[derived_id]
        changed = sorted(key for key in set(parent) | set(child) if parent.get(key) != child.get(key))
        if changed != ["liquid_policy"] or set(parent) != set(child) or any(parent["liquid_policy"]):
            raise ValueError("policy descendant modified artwork/actors or misstates original refusal")
        if np.any(plane(parent) != plane(child)):
            raise ValueError("policy correction changed the original material plane")
        if by_id[derived_id]["parent_id"] != parent_id or "gold25" in by_id[derived_id]["collections"]:
            raise ValueError("policy descendant silently replaced or promoted original")
        corrections.append({"parent_id": parent_id, "derived_id": derived_id, "changed_fields": changed,
                            "material_plane_identical": True, "all_nonpolicy_fields_equal": True,
                            "policy_equivalence_claimed": False, "correction_semantics": "new supported native-default envelope; invalid zero policy has no executable equivalent"})
    if by_id["derived-155-policy"]["setup"]["sha256"] != RECOVERED_155:
        raise ValueError("previously verified #155 descendant was regenerated or substituted")
    policy_receipt = None
    if args.native_profile_log:
        lines = args.native_profile_log.read_text(encoding="utf-8", errors="replace").splitlines()
        actual_profiles = [strict_json(line.removeprefix("GOLDMAPS_PROFILE ").encode())
                           for line in lines if line.startswith("GOLDMAPS_PROFILE ")]
        if len(actual_profiles) != 1:
            raise ValueError("expected exactly one real native profile receipt")
        profile = actual_profiles[0]
        admission = profile.get("native_default_admission", {})
        if not profile.get("native_bridge") or admission.get("accepted") is not True:
            raise ValueError("native runtime did not admit its own declared policy defaults")
        for child in ("derived-155-policy", "derived-183-policy"):
            if setups[child]["liquid_policy"] != profile.get("native_default_policy"):
                raise ValueError("policy descendant differs from actual native default envelope: " + child)
        policy_receipt = {"profile_log_sha256": sha(args.native_profile_log), "os": profile["os"],
                          "godot_version": profile["godot_version"], "native_default_admission": admission,
                          "both_descendant_envelopes_match": True,
                          "scope": "Exact default-policy semantic identity only; per-map native loading/save/reopen remains in separate qualification matrix."}
    comparison_checks = []
    for arm, expected in EXPECTED_CELLS.items():
        original = plane(setups["trial-" + arm + "-original"])
        candidate = plane(setups["trial-" + arm + "-candidate"])
        changed = int(np.count_nonzero(original != candidate))
        if changed != expected:
            raise ValueError("delivered comparison geometry differs from frozen output lock: " + arm)
        comparison_checks.append({"arm": arm, "changed_cells": changed, "matches_frozen_output": True,
                                  "meaning": "custody only; no new artistic adjudication"})
    export_path = root / "corpus-export/knowledge.v1.json"
    knowledge = strict_json(export_path.read_bytes())
    for key, expected in (("maps", 70), ("protected_features", 27), ("immutable_feature_states", 76),
                          ("comparative_families", 12), ("negative_interventions", 5)):
        if len(knowledge[key]) != expected:
            raise ValueError("knowledge export lost frozen evidence: " + key)
    if knowledge["negative_interventions"] != authority["negative_examples"] or knowledge["immutable_feature_states"] != authority["feature_history"]:
        raise ValueError("knowledge export rewrote immutable negative/state evidence")
    if any(row["owner_accepted"] for row in knowledge["maps"]):
        raise ValueError("knowledge export misrepresents owner approval")
    for candidate in knowledge["module_candidates"]:
        if candidate["owner_accepted"] or candidate["native_module_import_eligible"] or candidate["geometry_included"]:
            raise ValueError("inferred module hint silently promoted to an accepted native part")
    missing = knowledge["failed_attempt_custody"]
    if (missing["recorded_file_occurrences"], missing["recovered_file_occurrences"], missing["hash_only_missing_occurrences"]) != (182, 154, 28):
        raise ValueError("failed-attempt byte custody limitation changed")
    report = {"schema": "goldmaps.independent-collection-review.v1", "pass": True,
              "reviewer_role": "Specialist C; did not author corpus builder", "collection_sha256": sha(collection_path),
              "frozen_corpus_sha256": sha(authority_path), "knowledge_sha256": sha(export_path),
              "logical_entries": len(maps), "unique_setup_bytes": len(tested), "unique_native_overviews": len(previews),
              "corpus_index": len(corpus_view), "gold_nominees": 25, "portrait_repairs": 7,
              "frozen_required_aliases_preserved": len(old_inputs), "owner_accepted": 0,
              "records": checks, "policy_corrections": corrections, "comparisons": comparison_checks,
              "actual_default_policy_crosscheck": policy_receipt,
              "changed_cells_total": sum(row["changed_cells"] for row in comparison_checks),
              "knowledge_evidence_preserved": True,
              "scope": "Independent exact source/bytes/geometry/roster/negative-evidence audit; no native, physical graphical, artistic preference or owner adoption claim"}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({key: report[key] for key in ("pass", "logical_entries", "unique_setup_bytes", "corpus_index", "gold_nominees", "portrait_repairs", "changed_cells_total", "owner_accepted")}))


if __name__ == "__main__":
    main()
