#!/usr/bin/env python3
"""Independent read-only inspection of the downloaded Windows evaluator ZIP.

This checks the actual archive and joins raw executed receipts to its logical
roster. It performs no native execution and grants no owner acceptance. Supply
the unpacked GitHub outer artifact directory; the inner game ZIP is read in
place without extracting another runtime. The report records exact inspected
bytes and the distinction between required and optional native scope.
"""
from __future__ import annotations

import argparse
import ast
from collections import Counter
import copy
import hashlib
import json
import math
from pathlib import Path, PurePosixPath
import re
import struct
import subprocess
import zipfile

from verify_payload import MANIFEST, SIDECAR, file_sha256, safe_path, strict_json, verify_zip

GOLD25 = {106, 109, 125, 130, 131, 136, 143, 146, 147, 148, 150, 153, 155,
          159, 163, 168, 174, 175, 176, 179, 182, 184, 193, 197, 207}
ENGINE = "00cdb02f103265b6dc5224c68283e9a0c8cb449f"
SCIENTIFIC = "662df51cd8409a52332fa7ef15d06d8ab8945aed"
UI_CASES = {"comparison-popup": "trial-D1-original", "decision-dialog": "gold-125",
            "overview-zoom": "gold-197"}
CONTACT_INPUT = "collection/native-contact-followup-inputs.v1.json"
CONTACT_KIND = "windows-contact-followup"
CONTACT_TARGETS = {
    "corpus-188": {"setup_sha256": "2e0dda555e841a3d13a4cf7b84dea6f0036aaa22b012cb58246edaf4c6edf420",
                   "material_plane_sha256": "d839766373ef4e7a964ede02298118ff4c0de2b4a0d96fcde4c0ec8e73d3b6fd",
                   "x": 505, "first_hard_y": 1923, "material_id": 68},
    "corpus-189": {"setup_sha256": "32639654b818580f4c55dcb2439f0d44e03d59b906cd84956af32c5d38420a0b",
                   "material_plane_sha256": "b19c8c358dd33e7a6aac284eedbea0503dbe54f62bae67953681684ad2c6bc1d",
                   "x": 528, "first_hard_y": 1958, "material_id": 100},
    "corpus-192": {"setup_sha256": "752c423fa011f98ebbf4fc9c5a49c9a8cb416881c1a852c2e8fdd26f732eae08",
                   "material_plane_sha256": "30c6668a34341b172d231e4d257175a76b35b314e15dfb468a218d4970c56397",
                   "x": 495, "first_hard_y": 1980, "material_id": 100},
}


def digest(data):
    return hashlib.sha256(data).hexdigest()


def demand(condition, message):
    if not condition:
        raise ValueError(message)


def committed_digest(repo, head, path):
    safe_path(path)
    return digest(subprocess.check_output(["git", "-C", str(repo), "show", head + ":" + path], stderr=subprocess.DEVNULL))


def graphical_plan(repo, head):
    """Read the committed constant without importing or executing its driver."""
    path = "tools/goldmaps_owner/product/run_graphical_capture.py"
    source = subprocess.check_output(["git", "-C", str(repo), "show", head + ":" + path])
    constants = {}
    for node in ast.parse(source).body:
        if isinstance(node, ast.Assign):
            for target in node.targets:
                if isinstance(target, ast.Name) and target.id in ("CASES", "UI_CASES"):
                    constants[target.id] = ast.literal_eval(node.value)
    cases = constants["CASES"]
    plan = [{"name": name, "map_id": map_id} for name, map_id, _ in cases]
    demand(len({row["name"] for row in plan}) == len(plan) and len(plan) >= 15,
           "Committed graphical plan is duplicated or incomplete")
    ui_cases = constants.get("UI_CASES", {})
    demand(not ui_cases or ui_cases == UI_CASES, "Unexpected graphical popup contract")
    demand({row["name"] for row in plan if row["name"] in UI_CASES} == set(ui_cases),
           "Committed popup views differ from the UI map contract")
    return plan, ui_cases


def inspect_gallery_layout(capture):
    layout = capture["initial_gallery_layout"]
    viewport, grid = layout["viewport_size"], layout["map_list_bounds"]
    navigation, item = layout["navigation_bounds"], layout["first_item_bounds_local"]
    demand(len(viewport) == 2 and len(grid) == len(navigation) == len(item) == 4
           and all(isinstance(value, (int, float)) and not isinstance(value, bool) and math.isfinite(value)
                   for value in viewport + grid + navigation + item), "Malformed displayed gallery bounds")
    demand(layout["map_count"] == 25 and layout["map_list_visible"] is True
           and layout["visible_popup_titles"] == [] and grid[2] >= 225 and grid[3] >= 180
           and 0 < navigation[3] <= 50 and item[2] >= 210 and item[3] >= 126,
           "Displayed catalogue collapsed, navigation stretched or an unrequested popup opened")
    for bounds in (grid, navigation):
        x, y, width, height = bounds
        demand(x >= 0 and y >= 0 and width > 0 and height > 0
               and x + width <= viewport[0] and y + height <= viewport[1],
               "Displayed gallery controls extend outside their actual viewport")
    demand(item[0] >= 0 and item[1] >= 0 and item[0] < grid[2] and item[1] < grid[3],
           "The first map card is not inside the visible list")
    if capture.get("view_kind") == "gallery":
        demand(viewport == [capture["width"], capture["height"]], "Gallery layout and captured viewport differ")
    return layout


def inspect_browser_capture(capture, case, maps, raw, ui_cases):
    """Join actual rendered UI labels to exact sources without claiming a World."""
    depicted = capture["selected_id"]
    demand(depicted in maps and capture["engine_head"] == ENGINE,
           "Browser capture lacks its actual selected source/runtime identity")
    kind = capture.get("view_kind", "gallery")
    if ui_cases:
        demand(capture["selected_setup_sha256"] == maps[depicted]["setup"]["sha256"],
               "Rendered browser selection has the wrong Setup digest")
        inspect_gallery_layout(capture)
    if kind == "gallery":
        demand(case["name"] not in ui_cases and capture["visible_maps"] == 25
               and capture["active_collection"] == "gold25",
               "Gallery capture lacks the actual Gold25 selection")
        return {"depicted_map_id": depicted, "kind": "browser gallery", "view_kind": kind,
                "initial_gallery_layout": capture.get("initial_gallery_layout")}
    demand(kind in ui_cases and case["name"] == kind and case["map_id"] is None
           and case.get("requested_ui_action") == kind and case.get("requested_ui_map_id") == ui_cases[kind]
           and depicted == ui_cases[kind], "Popup view is attached to the wrong requested identity")
    popup = capture["popup"]
    demand(popup["visible"] is True and isinstance(popup["title"], str) and popup["title"]
           and popup["window_size"] == [capture["width"], capture["height"]],
           "Popup PNG does not match its visible Window viewport")
    demand(capture["active_collection"] == "all" and capture["visible_maps"] == len(maps)
           and capture["native_world_opened"] is False and case["new_session_count"] == 0
           and capture["owner_decision_written"] is False and capture["review_file_unchanged"] is True
           and capture["review_file_sha256_before"] == capture["review_file_sha256_after"],
           "Popup interaction changes owner data or falsely claims a native World")
    before = capture["review_file_sha256_before"]
    demand(before == "" or isinstance(before, str) and re.fullmatch(r"[0-9a-f]{64}", before),
           "Popup review-file identity is malformed")
    result = {"depicted_map_id": depicted, "kind": "rendered " + kind, "view_kind": kind,
              "popup": popup, "owner_decision_written": False, "native_world_opened": False,
              "initial_gallery_layout": capture["initial_gallery_layout"],
              "review_file_sha256_before": before, "review_file_sha256_after": before}
    if kind == "comparison-popup":
        expected = {"repair-203", "trial-D1-original", "trial-D1-candidate", "trial-D1-reference"}
        mounted = capture["mounted_variant_ids"]
        shown = capture["depicted_variant_ids"]
        demand(len(mounted) == len(expected) and set(mounted) == expected
               and len(shown) == len(set(shown)) and set(shown) <= expected
               and {"trial-D1-original", "trial-D1-candidate"} <= set(shown)
               and bool({"repair-203", "trial-D1-reference"} & set(shown)),
               "D1 comparison loses a logical identity or lacks a displayed original/candidate/reference")
        demand(maps["repair-203"]["setup"]["sha256"] == maps["trial-D1-reference"]["setup"]["sha256"],
               "D1 reference aliases no longer denote the same exact Setup")
        visible_ids, fully_visible_ids, visible_legends, full_legends = set(), set(), [], []
        for label in capture["visible_label_records"]:
            bounds, clipped = label["bounds"], label["visible_bounds"]
            demand(len(bounds) == len(clipped) == 4 and all(isinstance(n, (int, float)) and not isinstance(n, bool)
                   and math.isfinite(n) for n in bounds + clipped), "Displayed label bounds are malformed")
            x, y, width, height = bounds
            demand(width > 0 and height > 0 and x < capture["width"] and y < capture["height"]
                   and x + width > 0 and y + height > 0, "Claimed visible label does not intersect the actual popup")
            vx, vy, vw, vh = clipped
            demand(vw > 0 and vh > 0 and vx >= max(0, x) and vy >= max(0, y)
                   and vx + vw <= min(capture["width"], x + width) + 0.00001
                   and vy + vh <= min(capture["height"], y + height) + 0.00001,
                   "Clip-aware label bounds extend beyond the actual label or popup")
            fully_visible = all(math.isclose(a, b, abs_tol=0.00001, rel_tol=0) for a, b in zip(bounds, clipped))
            demand(label["fully_visible"] is fully_visible, "Reported full label visibility disagrees with actual clipped bounds")
            text = label["text"]
            demand(isinstance(text, str), "Displayed label text is malformed")
            candidate = text.split(" · ", 1)[0]
            if candidate in maps:
                visible_ids.add(candidate)
                if fully_visible:
                    fully_visible_ids.add(candidate)
            if text.startswith("Archived crop legend"):
                visible_legends.append(text)
                if fully_visible:
                    full_legends.append(text)
        legend = capture["neutral_label_legend"]
        demand(set(shown) == visible_ids and legend in visible_legends and all(text in legend for text in
               ("A = trial-D1-reference (PR #203)", "B = trial-D1-candidate (PR #214)",
                "C = trial-D1-original (PR #186)")), "Displayed D1 neutral legend or label-derived identities differ")
        demand({"trial-D1-original", "trial-D1-candidate"} <= fully_visible_ids
               and bool({"repair-203", "trial-D1-reference"} & fully_visible_ids)
               and legend in full_legends, "D1 source roles or neutral legend are clipped in the actual popup")
        result.update(mounted_variant_ids=mounted, depicted_variant_ids=shown, neutral_label_legend=legend,
                      fully_visible_variant_ids=sorted(fully_visible_ids),
                      image_scope="Archived source visualizations displayed side by side; no native World or synchronized simulation")
    elif kind == "decision-dialog":
        demand(capture["decision_map_id"] == depicted and capture["decision_status"] == "Pending / not reviewed"
               and capture["decision_classification"] == "Unclassified", "Displayed review is not pending and unclassified")
        result.update(decision_status=capture["decision_status"], decision_classification=capture["decision_classification"])
    else:
        preview = maps[depicted]["preview"]
        demand(capture["preview_path"] == preview["path"] and capture["preview_kind"] == preview["kind"]
               and capture["preview_sha256"] == digest(raw(preview["path"]))
               and capture["image_scope"] == "Full-resolution archived material-plane visualization inside actual rendered UI; not a native World screenshot",
               "Zoom popup source or material-visualization scope differs")
        result.update(preview_path=preview["path"], preview_sha256=capture["preview_sha256"],
                      image_scope=capture["image_scope"])
    return result


def normalized_roster(value, head):
    result = copy.deepcopy(value)
    generator = result["authority"]["delivery_generator_source"]
    demand(generator["repo"] == "techrote/sandmapsreference"
           and generator["path"] == "tools/goldmaps_owner/corpus/build_collection.py",
           "Unexpected collection generator source")
    original_generator = copy.deepcopy(generator)
    expected_url = "https://github.com/techrote/sandmapsreference/blob/" + head + "/" + generator["path"]
    demand(generator["commit"] == head and generator["url"] == expected_url
           and generator["commit_bytes_verified"] is True, "Regenerated collection authority is not explicitly source-pinned")
    generator["commit"] = "IDENTICAL_GENERATOR_COMMIT"
    generator["url"] = "IDENTICAL_GENERATOR_URL"
    derived = next(row for row in result["maps"] if row["id"] == "derived-183-policy")["derived_source"]
    demand(derived["commit"] == head and derived["generator_source"]["commit"] == head
           and derived["generator_source"]["url"] == expected_url
           and derived["generator_source"] == original_generator,
           "#183 regenerated authority is not explicitly source-pinned")
    derived["commit"] = "IDENTICAL_GENERATOR_COMMIT"
    derived["generator_source"]["commit"] = "IDENTICAL_GENERATOR_COMMIT"
    derived["generator_source"]["url"] = "IDENTICAL_GENERATOR_URL"
    return result


def inspect_native_reuse(raw, inventory, roster, overlay, native, source_head, run_id, repo):
    """Independently compare both actual inner ZIPs and exact committed code."""
    archives = list(native["artifact_dir"].glob("CyberSand-GOLDMAPS-Owner-Evaluator-*.zip"))
    demand(len(archives) == 1, "Native predecessor must be one actual playable ZIP")
    prior_archive = archives[0]
    prior_verified = verify_zip(prior_archive)
    demand(prior_verified["archive_sha256"] == native["archive_sha256"], "Externally pinned native predecessor archive differs")
    authority = {"source_head": native["source_head"], "github_run_id": native["github_run_id"],
                 "archive_sha256": native["archive_sha256"], "payload_manifest_sha256": prior_verified["manifest_sha256"]}
    receipt_path = "qualification/native-evidence-reuse.v1.json"
    receipt_raw = raw(receipt_path)
    receipt = strict_json(receipt_raw)
    demand(receipt["schema"] == "goldmaps.owner-native-evidence-reuse.v1" and receipt["pass"] is True
           and receipt["native_evidence_authority"] == authority,
           "Native reuse receipt does not bind the externally pinned predecessor")
    demand(receipt["delivery_authority"]["source_head"] == source_head
           and str(receipt["delivery_authority"]["github_run_id"]) == run_id
           and receipt["delivery_authority"]["engine_head"] == ENGINE, "Native reuse receipt has wrong delivery authority")
    demand(overlay["native_evidence_authority"] == {**authority, "reuse_receipt": receipt_path,
           "reuse_receipt_sha256": digest(receipt_raw)}, "Eligibility overlay does not bind the exact reuse receipt")
    demand(receipt["checks"] and all(check["pass"] is True for check in receipt["checks"]), "Native reuse gate failed")
    outer = strict_json((native["artifact_dir"] / "campaign.json").read_bytes())
    demand(outer["source_head"] == native["source_head"] and str(outer["github_run_id"]) == native["github_run_id"]
           and outer["actual_final_extracted_launcher"] == "PASS", "Native predecessor is not the claimed completed artifact")

    def native_path(path):
        if path.startswith("runtime/"):
            return not path.startswith("runtime/project/goldmaps/")
        if path.startswith("collection/setups/"):
            return True
        if path in ("collection/native-inputs.v1.json", "collection/native-inputs-optional.v1.json"):
            return True
        return "/" not in path and (path.startswith("Godot_") or path.lower().endswith(".dll"))

    with zipfile.ZipFile(prior_archive) as previous:
        prefix = prior_verified["envelope_directory"]

        def previous_raw(path):
            safe_path(path)
            info = previous.getinfo(prefix + path)
            demand(info.file_size <= 64 * 1024 * 1024, "Oversized predecessor review metadata")
            return previous.read(info)

        previous_manifest = strict_json(previous_raw(MANIFEST))
        demand(previous_manifest["delivery_source_head"] == native["source_head"]
               and previous_manifest["engine_head"] == ENGINE, "Prior manifest authority differs")
        prior = {row["path"]: row for row in previous_manifest["files"]}
        expected_paths = {path for path in prior if native_path(path)}
        demand(expected_paths == {path for path in inventory if native_path(path)}, "Native runtime/input inventory changed")
        expected_unchanged = []
        for path in sorted(expected_paths):
            demand((prior[path]["bytes"], prior[path]["sha256"]) == (inventory[path]["bytes"], inventory[path]["sha256"]),
                   "Native runtime/input bytes changed: " + path)
            expected_unchanged.append({"path": path, "bytes": prior[path]["bytes"], "sha256": prior[path]["sha256"]})
        demand(receipt["unchanged_payload_files"] == expected_unchanged, "Reuse payload comparison inventory is incomplete")
        prior_roster = strict_json(previous_raw("collection/collection.v1.json"))
        demand(normalized_roster(prior_roster, native["source_head"]) == normalized_roster(roster, source_head),
               "Original source/scientific/owner/map metadata changed beyond the explicit generator pin")
        generator = roster["authority"]["delivery_generator_source"]
        demand(committed_digest(repo, native["source_head"], generator["path"])
               == committed_digest(repo, source_head, generator["path"]) == generator["sha256"], "Collection generator code changed")
        evidence_paths = {path for path in prior if path.startswith(("qualification/windows-required/", "qualification/windows-optional/"))}
        demand(evidence_paths == {path for path in inventory if path.startswith(("qualification/windows-required/", "qualification/windows-optional/"))},
               "Raw native evidence was omitted or added during reuse")
        raw_inventory = []
        for path in sorted(evidence_paths):
            old_raw, new_raw = previous_raw(path), raw(path)
            demand(old_raw == new_raw, "Raw native evidence was rewritten: " + path)
            raw_inventory.append({"path": path, "bytes": len(old_raw), "sha256": digest(old_raw)})
        demand(sorted(receipt["raw_native_files"], key=lambda row: row["path"]) == raw_inventory,
               "Raw reused native evidence inventory is incomplete")
        code = {}
        for kind in ("windows-required", "windows-optional"):
            summary = strict_json(previous_raw("qualification/" + kind + "/summary.json"))
            for path, expected in summary["executed_source"]["files"].items():
                demand(committed_digest(repo, native["source_head"], path) == expected
                       == committed_digest(repo, source_head, path), "Executed native harness changed: " + path)
                code[path] = {"path": path, "native_sha256": expected, "current_sha256": expected}
        demand(sorted(receipt["executed_source_files"], key=lambda row: row["path"]) == [code[path] for path in sorted(code)],
               "Native harness comparison inventory is incomplete")
        route = receipt["route_contract"]
        demand(route["path"] == "scripts/goldmaps_finalisation/native_routes.v1.json"
               and committed_digest(repo, native["source_head"], route["path"]) == route["sha256"]
               == committed_digest(repo, source_head, route["path"]), "Bounded route contract changed")
        contract = strict_json(subprocess.check_output(["git", "-C", str(repo), "show", native["source_head"] + ":" + route["path"]]))
        for expected in contract["routes"]:
            path = "qualification/windows-required/" + expected["id"] + ".route.json"
            demand(strict_json(previous_raw(path)) == expected, "Actual executed route coordinates differ from committed contract: " + expected["id"])
    return {"native_evidence_authority": authority, "reuse_receipt_sha256": digest(receipt_raw),
            "predecessor_archive": prior_verified, "unchanged_native_payload_files": len(expected_unchanged),
            "raw_native_files_retained_exactly": len(raw_inventory), "unchanged_native_harness_files": len(code),
            "route_contract": route, "independent_old_new_byte_comparison": "PASS",
            "scope": "Actual predecessor and final ZIPs compared directly; old native receipts and run/source remain unchanged. New product evidence is separate."}


def inspect_contact_followup(raw, overlay, source_head, run_id, native_head, native_run, repo):
    """Verify the exact additional population and its unsanitized old history."""
    authority = overlay["native_followup_authority"]
    summary_path = "qualification/" + CONTACT_KIND + "/summary.json"
    demand(authority["source_head"] == source_head and str(authority["github_run_id"]) == run_id
           and authority["summary"] == summary_path and authority["summary_sha256"] == digest(raw(summary_path))
           and authority["inputs"] == CONTACT_INPUT and authority["inputs_sha256"] == digest(raw(CONTACT_INPUT))
           and authority["targets"] == list(CONTACT_TARGETS), "Fresh contact authority is not separately source/run/input-bound")
    inputs = strict_json(raw(CONTACT_INPUT))
    original_input = strict_json(raw("collection/native-inputs-optional.v1.json"))
    originals = {row["id"]: row for row in original_input["records"]}
    expected_records = []
    for map_id, target in CONTACT_TARGETS.items():
        original = originals[map_id]
        demand("contact_probe_tick_limit" not in original and original["setup_sha256"] == target["setup_sha256"]
               and original["material_plane_sha256"] == target["material_plane_sha256"]
               and original["extent"] == [1024, 2048], "Contact follow-up source or original budget changed")
        expected_records.append({**original, "contact_probe_tick_limit": 1800})
    demand(inputs["records"] == expected_records and inputs["counts"] == {"logical_aliases": 3, "unique_setups": 3}
           and inputs["engine_head"] == ENGINE and inputs["scientific_engine_head"] == SCIENTIFIC
           and inputs["schema"] == original_input["schema"]
           and inputs["source_static_contact_targets"] == CONTACT_TARGETS
           and inputs["prior_input"] == {"path": "collection/native-inputs-optional.v1.json",
                                         "sha256": digest(raw("collection/native-inputs-optional.v1.json"))},
           "Contact follow-up changes more than the reviewed three observation budgets")
    audit = inputs["source_static_audit"]
    demand(audit["path"] == "docs/corpus/goldmaps-owner-delivery-001/corpus/optional-contact-static-assessment.v1.json"
           and audit["sha256"] == committed_digest(repo, source_head, audit["path"])
           == digest(raw("collection/contact-followup-source-static-audit.v1.json")),
           "Contact continuation lacks the exact committed geometry assessment")
    prior_summary_path = "qualification/windows-optional/summary.json"
    prior_summary_hash = digest(raw(prior_summary_path))
    prior_overlay = strict_json(raw("qualification/windows-optional/delivery-qualification.v1.json"))
    fresh_overlay = strict_json(raw("qualification/" + CONTACT_KIND + "/delivery-qualification.v1.json"))
    summary = strict_json(raw(summary_path))
    demand(not summary["route_results"] and len(summary["results"]) == 3
           and {row["id"] for row in summary["results"]} == set(CONTACT_TARGETS)
           and set(fresh_overlay["setups"]) == {row["setup_sha256"] for row in CONTACT_TARGETS.values()},
           "Contact follow-up is incomplete or adds another population")
    transitions = []
    observations = []
    for result in summary["results"]:
        map_id, setup_hash = result["id"], result["setup_sha256"]
        demand(setup_hash == CONTACT_TARGETS[map_id]["setup_sha256"], "Contact follow-up substitutes a Setup")
        prior = copy.deepcopy(prior_overlay["setups"][setup_hash])
        prior.update(receipt="qualification/windows-optional/" + prior["receipt"],
                     native_execution_source_head=native_head, native_execution_run_id=native_run,
                     native_execution_summary_sha256=prior_summary_hash)
        old_raw = raw(prior["receipt"])
        old = strict_json(old_raw)
        demand(prior["status"] == "UNQUALIFIED" and prior["aliases"] == [map_id]
               and digest(old_raw) == prior["receipt_sha256"] and old["contact_pass"] is False
               and old["pass"] is False and old["movement_pass"] is True
               and old["phases"]["load"]["evidence"]["collision_probe"]["tick_budget"] == 900,
               "Original contact failure was changed or hidden")
        current = overlay["setups"][setup_hash]
        demand(current["native_history"] == [prior], "Full previous qualification entry is not retained verbatim with its authority")
        base = copy.deepcopy(current)
        base.pop("native_history")
        reason = base.pop("followup_reason")
        demand(isinstance(reason, str) and reason, "Separate contact observation lacks an explicit reason")
        expected = copy.deepcopy(fresh_overlay["setups"][setup_hash])
        expected.update(receipt="qualification/" + CONTACT_KIND + "/" + expected["receipt"],
                        native_execution_source_head=source_head, native_execution_run_id=summary["github_run_id"],
                        native_execution_summary_sha256=authority["summary_sha256"])
        demand(base == expected and current["status"] in ("QUALIFIED_HEADLESS", "UNQUALIFIED"),
               "Effective contact result differs from its actual fresh overlay")
        probe = result["phases"]["load"]["evidence"]["collision_probe"]
        demand(probe["tick_budget"] == 1800 and probe["wall_budget_ms"] == 90000,
               "Contact follow-up exceeds or changes the reviewed observation bounds")
        if current["status"] == "QUALIFIED_HEADLESS":
            demand(result["pass"] is True and result["contact_pass"] is True
                   and result["phases"]["load"]["evidence"]["collision_observed"] is True
                   and probe["max_contacts"] > 0 and len(probe["witnesses"]) > 0,
                   "No contact promotion without an actual native contact witness")
        transitions.append({"id": map_id, "setup_sha256": setup_hash, "prior_status": prior["status"],
                            "prior_receipt": prior["receipt"], "prior_receipt_sha256": prior["receipt_sha256"],
                            "current_status": current["status"], "current_receipt": current["receipt"],
                            "current_receipt_sha256": current["receipt_sha256"]})
        observations.append({"id": map_id, "prior_status": prior["status"], "current_status": current["status"],
                             "tick_budget": probe["tick_budget"], "max_contacts": probe["max_contacts"],
                             "native_execution_source_head": source_head, "native_execution_run_id": run_id})
    demand(authority["transitions"] == transitions, "Contact transition summary changes actual prior or fresh statuses")
    affected = {row["setup_sha256"] for row in CONTACT_TARGETS.values()}
    demand(all(not record.get("native_history") for key, record in overlay["setups"].items() if key not in affected),
           "Contact history spread to an unexecuted source")
    return {"pass": True, "authority": authority, "observations": observations,
            "additional_distinct_setups": 0, "unchanged_source_records": 3, "original_no_contact_results_retained": 3,
            "scope": "Separate full native observations of three unchanged Setups; original 900-tick failures remain intact. No result inferred from static floor proximity."}


def inspect(directory: Path, source_head: str, run_id: str, native=None, source_repo=None):
    native_head = native["source_head"] if native else source_head
    native_run = native["github_run_id"] if native else run_id
    source_repo = source_repo or Path(__file__).resolve().parents[3]
    archives = list(directory.glob("CyberSand-GOLDMAPS-Owner-Evaluator-*.zip"))
    demand(len(archives) == 1, "Exactly one named inner owner kit is required")
    archive = archives[0]
    verified = verify_zip(archive)
    demand(verified["engine_head"] == ENGINE, "Unexpected delivery engine authority")
    demand((directory / (archive.name + ".sha256")).read_text().strip().split()
           == [verified["archive_sha256"], archive.name], "Archive sidecar mismatch")
    inspected_external = {}

    def external(name):
        raw = (directory / name).read_bytes()
        inspected_external[name] = {"bytes": len(raw), "sha256": digest(raw)}
        return strict_json(raw)

    sealing = external("archive-verification.json")
    demand(sealing["archive"] == verified, "Published archive verification is not this exact ZIP")
    outer_campaign = external("campaign.json")
    demand(outer_campaign["source_head"] == source_head
           and str(outer_campaign["github_run_id"]) == run_id
           and outer_campaign["actual_final_extracted_launcher"] == "PASS",
           "Outer campaign source/run/final-launch identity mismatch")
    with zipfile.ZipFile(archive) as opened:
        prefix = verified["envelope_directory"]

        def raw(name):
            safe_path(name)
            info = opened.getinfo(prefix + name)
            demand(info.file_size <= 64 * 1024 * 1024, "Review metadata exceeds bounded read: " + name)
            return opened.read(info)

        def data(name):
            return strict_json(raw(name))

        manifest = data(MANIFEST)
        demand(manifest["delivery_source_head"] == source_head
               and manifest["scientific_engine_head"] == SCIENTIFIC
               and manifest["owner_accepted"] is False, "Mixed source/scientific/owner authority")
        inventory = {row["path"]: row for row in manifest["files"]}
        demand(not any(path.startswith(("userdata/", "browser/.godot/", "runtime/project/.godot/"))
                       for path in inventory), "Mutable owner data or runtime caches were shipped")
        for name in ("Open GOLDMAPS.cmd", "START-HERE.md", "LICENSE-AND-SOURCE.md",
                     "Godot_v4.7-stable_win64.exe", "Godot_v4.7-stable_win64_console.exe"):
            demand(name in inventory, "Actual playable kit input missing: " + name)
        native_pins = {
            "runtime/project/addons/cybersand_native/bin/cybersand_native.windows.x86_64.dll":
                "668f2dd094fca611a97c2b6aa38c4cd072179fe9cf591e53578ef57c7db1625e",
            "runtime/project/addons/godot-rapier2d/bin/libgodot_rapier.windows.x86_64-pc-windows-msvc.dll":
                "b54e54bd1a03ae9094b788bf869212b5405b4a04793792d5a7cd81632cb10dd7",
        }
        for name, expected in native_pins.items():
            demand(inventory[name]["sha256"] == expected, "Shipped native dependency differs from qualified source: " + name)
        roster = data("collection/collection.v1.json")
        maps = {row["id"]: row for row in roster["maps"]}
        demand(len(maps) == len(roster["maps"]), "Duplicate logical map identity")
        gold = [row for row in maps.values() if "gold25" in row["collections"]]
        demand({row["source"]["pr"] for row in gold} == GOLD25 and len(gold) == 25,
               "Gold25 recommendation roster changed")
        demand(len([row for row in maps.values() if "corpus" in row["collections"]]) == 70,
               "All-70 source index is incomplete")
        portraits = [row for row in maps.values() if "portraits" in row["collections"]]
        demand({row["source"]["pr"] for row in portraits} == set(range(202, 209)) and len(portraits) == 7,
               "Seven portrait repair identities are incomplete")
        trials = {f"trial-{arm}-{role}" for arm in ("B1", "B2", "B3", "C1", "C2", "C3", "D1", "D2")
                  for role in ("original", "candidate")} | {"trial-D1-reference", "trial-D2-reference"}
        demand(trials <= maps.keys(), "Required original/candidate/prior-reference identities are missing")
        demand({"derived-155-policy", "derived-183-policy", "gold-155", "corpus-183"} <= maps.keys(),
               "Policy originals and separate descendants are missing")
        demand("gold25" not in maps["derived-183-policy"]["collections"], "#183 silently entered Gold25")
        setups = {}
        for row in maps.values():
            owner = row["owner"]
            demand(owner["accepted"] is False and owner["classification"] is None and owner["status"] == "pending",
                   "Bundled owner classification is not neutral: " + row["id"])
            setup = row["setup"]
            listed = inventory[setup["path"]]
            demand((listed["sha256"], listed["bytes"]) == (setup["sha256"], setup["bytes"]),
                   "Setup is substituted or mismatched: " + row["id"])
            setups.setdefault(setup["sha256"], []).append(row)
        overlay = data("collection/delivery-qualification.v1.json")
        demand(overlay["engine_head"] == ENGINE and overlay["platform"] == "native Windows"
               and overlay["owner_accepted"] is False, "Delivery eligibility is not explicitly native Windows")
        demand(overlay["godot_sha256"] == inventory["Godot_v4.7-stable_win64_console.exe"]["sha256"],
               "Qualified Godot differs from shipped executable")
        demand(set(overlay["setups"]) == set(setups), "Not every bundled unique Setup has an explicit status")
        reuse_review = inspect_native_reuse(raw, inventory, roster, overlay, native, source_head, run_id, source_repo) if native else None
        demand(native is not None or not overlay.get("native_evidence_authority", {}).get("reuse_receipt"),
               "Reused native evidence requires an explicitly pinned predecessor artifact for this independent review")
        followup_authority = overlay.get("native_followup_authority")
        demand(not followup_authority or native is not None, "Contact follow-up omits its explicit prior native authority")
        followup_review = inspect_contact_followup(raw, overlay, source_head, run_id, native_head, native_run, source_repo) if followup_authority else None
        demand(bool(followup_authority) == (CONTACT_INPUT in inventory), "Contact input and effective authority disagree")
        campaign_inputs = {"windows-required": "collection/native-inputs.v1.json",
                           "windows-optional": "collection/native-inputs-optional.v1.json"}
        if followup_authority:
            campaign_inputs[CONTACT_KIND] = CONTACT_INPUT
        demand({row["kind"] for row in overlay["campaigns"]} == set(campaign_inputs)
               and len(overlay["campaigns"]) == len(campaign_inputs), "Native campaign list is incomplete or duplicated")
        native_campaigns = []
        executed_receipts = {}
        route_projection = []
        route_contract_path = "scripts/goldmaps_finalisation/native_routes.v1.json"
        route_contract = strict_json(subprocess.check_output(["git", "-C", str(source_repo), "show", native_head + ":" + route_contract_path]))
        route_specs = {row["id"]: row for row in route_contract["routes"]}
        for campaign in overlay["campaigns"]:
            kind = campaign["kind"]
            campaign_head = source_head if kind == CONTACT_KIND else native_head
            campaign_run = run_id if kind == CONTACT_KIND else native_run
            demand(campaign["summary"] == "qualification/" + kind + "/summary.json", "Native summary path differs from campaign identity")
            summary_raw = raw(campaign["summary"])
            summary = strict_json(summary_raw)
            demand(digest(summary_raw) == campaign["summary_sha256"]
                   and summary["engine_head"] == ENGINE and summary["frozen_scientific_engine"] == SCIENTIFIC
                   and summary["godot_sha256"] == overlay["godot_sha256"]
                   and summary["probe_sha256"] == overlay["probe_sha256"]
                   and str(summary["github_run_id"]) == campaign_run and summary["github_sha"] == campaign_head
                   and summary["executed_source"]["checkout_head"] == campaign_head
                   and summary["executed_source"]["files_match_commit"] is True
                   and summary["runtime_kind"] == "shipped Windows project", "Native campaign source/runtime mismatch")
            demand(summary["profile"]["isolated"] is True and summary["profile"]["native_bridge"] is True
                   and summary["godot_version"]["hash"] == "5b4e0cb0fd279832bbdd69fed5354d4e5ad26f88",
                   "Exact native runtime or portable profile is not proved")
            for path, expected_hash in summary["executed_source"]["files"].items():
                demand(committed_digest(source_repo, campaign_head, path) == expected_hash,
                       "Recorded native harness differs from executed source commit: " + path)
            input_bytes = raw(campaign_inputs[kind])
            input_records = strict_json(input_bytes)["records"]
            groups = {}
            for record in input_records:
                groups.setdefault(record["setup_sha256"], []).append(record)
            demand(summary["inputs_sha256"] == digest(input_bytes)
                   and summary["aliases_checked"] == summary["declared_campaign_aliases"] == len(input_records)
                   and summary["unique_setups_checked"] == len(summary["results"]) == len(groups)
                   and {row["setup_sha256"] for row in summary["results"]} == set(groups),
                   "Native campaign population differs from its actual input bytes")
            demand(summary["qualified_unique_setups"] == sum(row["pass"] is True for row in summary["results"])
                   and summary["verified_refused_unique_setups"] == sum(row["negative_fixture_pass"] is True for row in summary["results"])
                   and summary["validation_pass"] == all(row["pass"] or row["negative_fixture_pass"] for row in summary["results"])
                   and summary["package_before"]["manifest_sha256"] == summary["package_after"]["manifest_sha256"]
                   == campaign["input_manifest_sha256"], "Native campaign summary changes actual outcomes or input custody")
            for key in ("unique_setups", "qualified_unique_setups", "verified_refused_unique_setups", "validation_pass"):
                expected = summary["unique_setups_checked"] if key == "unique_setups" else summary[key]
                demand(campaign[key] == expected, "Projected native campaign count or status differs: " + key)
            if native:
                demand(campaign["native_execution_source_head"] == campaign_head
                       and str(campaign["github_run_id"]) == campaign_run, "Projected native campaign authority differs")
            for row in summary["results"]:
                receipt_path = str(PurePosixPath(campaign["summary"]).parent / (row["id"] + ".receipt.json"))
                stored = data(receipt_path)
                demand(stored == row and row["source_records"] == groups[row["setup_sha256"]]
                       and row["aliases"] == [record["id"] for record in groups[row["setup_sha256"]]],
                       "Native summary result differs from raw receipt or exact source-input aliases")
                executed_receipts[receipt_path] = {"source_head": campaign_head, "run_id": campaign_run,
                                                    "summary_sha256": campaign["summary_sha256"], "receipt": row}
            for row in summary["route_results"]:
                base = PurePosixPath(campaign["summary"]).parent
                fixture = raw(str(base / (row["id"] + ".route.json")))
                demand(strict_json(fixture) == route_specs[row["id"]], "Executed route coordinates differ from source contract")
                demand(data(str(base / (row["id"] + ".receipt.json"))) == row
                       and digest(raw(str(base / (row["id"] + ".log")))) == row["log_sha256"],
                       "Route summary differs from actual receipt/log")
                observed = (row.get("evidence") or {}).get("route") or {}
                if "fixture_sha256" in observed:
                    demand(observed["fixture_sha256"] == digest(fixture), "Native route fixture digest differs from actual archived input")
                route_projection.append({"id": row["id"], "exit_code": row["exit_code"], "timeout": row["timeout"],
                    "completed": observed.get("completed", False), "failure": observed.get("failure", "no_route_receipt"),
                    "waypoints_reached": observed.get("waypoints_reached"), "waypoints_total": observed.get("waypoints_total")})
            native_campaigns.append({"kind": campaign["kind"], "summary_sha256": campaign["summary_sha256"],
                                     "native_execution_source_head": campaign_head, "native_execution_run_id": campaign_run,
                                     "unique_setups": summary["unique_setups_checked"],
                                     "qualified_unique_setups": summary["qualified_unique_setups"],
                                     "verified_refused_unique_setups": summary["verified_refused_unique_setups"],
                                     "validation_pass": summary["validation_pass"]})
        demand({row["id"] for row in route_projection} == set(route_specs)
               and len(route_projection) == len(route_specs), "Route result population is incomplete or duplicated")
        route_summary = data("qualification/bounded-route-summary.json")
        demand(route_summary["routes"] == route_projection, "Bounded route projection changes actual observed outcomes")
        if native:
            demand(route_summary["native_evidence_authority"] == overlay["native_evidence_authority"],
                   "Bounded route projection omits or changes retained execution authority")
        receipt_by_digest = {}
        counts = Counter()
        for setup_hash, status in overlay["setups"].items():
            path = status["receipt"]
            receipt_raw = raw(path)
            receipt = strict_json(receipt_raw)
            demand(digest(receipt_raw) == status["receipt_sha256"] and receipt["setup_sha256"] == setup_hash
                   and receipt["qualification_status"] == status["status"]
                   and receipt == executed_receipts[path]["receipt"], "Wrong native receipt: " + path)
            if native:
                authority = executed_receipts[path]
                demand(status["native_execution_source_head"] == authority["source_head"]
                       and str(status["native_execution_run_id"]) == authority["run_id"]
                       and status["native_execution_summary_sha256"] == authority["summary_sha256"],
                       "Effective native result is attached to the wrong execution authority")
            demand(status["owner_accepted"] is False and set(status["aliases"]) == set(receipt["aliases"]),
                   "Alias or owner authority differs: " + path)
            for phase_name, phase in receipt["phases"].items():
                log = str(PurePosixPath(path).parent / (receipt["id"] + "." + phase_name + ".log"))
                demand(digest(raw(log)) == phase["log_sha256"], "Native phase log mismatch: " + log)
            load = receipt["phases"]["load"]
            evidence = load.get("evidence") or {}
            native_status = status["status"]
            if native_status == "QUALIFIED_HEADLESS":
                positive = ("pass", "plane_matches_corpus", "saved_setup_semantic_equal", "source_unchanged",
                            "profile_isolated", "separate_processes")
                demand(all(receipt.get(key) is True for key in positive), "Missing native positive gate: " + path)
                demand(load["exit_code"] == 0 and load["timeout"] is False, "Positive load did not finish: " + path)
                gates = ("source_parse", "native_bridge", "load", "full_grid", "all_authored_actors_adopted", "physics_tick")
                demand(all(evidence.get(key) is True for key in gates), "Missing actual native load evidence: " + path)
                demand(evidence["native_policy"]["accepted"] is True
                       and evidence["native_policy"]["receipt"]["platform"] == "windows", "Policy platform mismatch")
                for logical in setups[setup_hash]:
                    demand(receipt["actual_native_plane_sha256"] == logical["setup"]["material_plane_sha256"],
                           "Native plane differs from logical source: " + logical["id"])
                    expected = {(int(a["id"]), a["model"]) for a in logical["actors"]}
                    adopted = {(int(a["id"]), a["adopted_model"]) for a in evidence["all_authored_actors"] if a["adopted"]}
                    demand(expected == adopted, "Actual adopted actors differ from source: " + logical["id"])
                for gate in ("movement", "contact"):
                    demand(not receipt[gate + "_applicable"] or receipt[gate + "_pass"] is True,
                           "Applicable real gameplay gate failed: " + path)
                reopen = receipt["phases"]["reopen"]
                demand(reopen["exit_code"] == 0 and reopen["timeout"] is False
                       and reopen["process_id"] != load["process_id"]
                       and reopen["evidence"]["fresh_reopen"] is True
                       and reopen["evidence"]["full_grid"] is True, "Fresh process reopen is not proved: " + path)
            elif native_status == "REFUSED_INVALID_SOURCE":
                demand(receipt["negative_fixture_pass"] is True and receipt["pass"] is False
                       and load["exit_code"] == 1 and not load["timeout"]
                       and evidence["native_policy"]["accepted"] is False
                       and evidence["native_policy"]["refusal"]["code"] == "malformed_policy"
                       and evidence["native_policy"]["refusal"]["detail"] == "bad magic",
                       "Expected original refusal was not actually observed: " + path)
            else:
                demand(native_status == "UNQUALIFIED" and receipt["pass"] is False
                       and receipt["negative_fixture_pass"] is False, "Unknown or misleading native status")
            receipt_by_digest[setup_hash] = receipt
            counts[native_status] += 1
        demand(overlay["counts"] == {"unique_setups": len(setups), "qualified_headless": counts["QUALIFIED_HEADLESS"],
               "verified_refused_originals": counts["REFUSED_INVALID_SOURCE"], "unqualified_reference_only": counts["UNQUALIFIED"],
               "owner_accepted": 0}, "Effective eligibility counts differ from actual distinct-Setup outcomes")
        for original in ("gold-155", "corpus-183"):
            demand(overlay["setups"][maps[original]["setup"]["sha256"]]["status"] == "REFUSED_INVALID_SOURCE",
                   "Original known-invalid policy is not visibly refused")
        for required in data("collection/native-inputs.v1.json")["records"]:
            demand(overlay["setups"][required["setup_sha256"]]["status"] in ("QUALIFIED_HEADLESS", "REFUSED_INVALID_SOURCE"),
                   "Required minimum variant is unqualified: " + required["id"])
        matrix = data("qualification/per-variant-matrix.v1.json")
        joined = {row["id"]: row for row in matrix["records"]}
        demand(set(joined) == set(maps) and matrix["delivery_source_head"] == source_head, "Logical matrix coverage/source mismatch")
        logical_counts = {"logical_entries": len(maps), "unique_setups": len(setups),
                          "qualified_logical_entries": sum(row["native_status"] == "QUALIFIED_HEADLESS" for row in joined.values()),
                          "refused_logical_entries": sum(row["native_status"] == "REFUSED_INVALID_SOURCE" for row in joined.values()),
                          "unqualified_logical_entries": sum(row["native_status"] == "UNQUALIFIED" for row in joined.values()),
                          "owner_accepted": 0}
        demand(matrix["counts"] == logical_counts and outer_campaign["logical_counts"] == logical_counts
               and outer_campaign["qualification"] == overlay["counts"], "Published counts confuse logical aliases and unique outcomes")
        for map_id, row in joined.items():
            expected = overlay["setups"][maps[map_id]["setup"]["sha256"]]
            demand(row["native_status"] == expected["status"] and row["native_receipt_sha256"] == expected["receipt_sha256"]
                   and row["owner_accepted"] is False and row["owner_classification"] is None,
                   "Matrix silently changes native or owner verdict: " + map_id)
            demand(row["source"] == maps[map_id]["source"] and row["setup"] == maps[map_id]["setup"]
                   and row.get("derived_source") == maps[map_id].get("derived_source"),
                   "Matrix source or derived-variant identity differs from roster: " + map_id)
            receipt = receipt_by_digest[maps[map_id]["setup"]["sha256"]]
            load_evidence = receipt["phases"].get("load", {}).get("evidence") or {}
            reopen_evidence = receipt["phases"].get("reopen", {}).get("evidence") or {}
            expected_gates = {"policy": load_evidence.get("native_policy"), "ordinary_load": load_evidence.get("load"),
                "complete_material_readback": load_evidence.get("full_grid"), "material_plane_matches_corpus": receipt["plane_matches_corpus"],
                "all_authored_actors_adopted": load_evidence.get("all_authored_actors_adopted"),
                "acknowledged_simulation": load_evidence.get("physics_tick"),
                "movement_applicable": receipt["movement_applicable"], "movement": receipt["movement_pass"],
                "contact_applicable": receipt["contact_applicable"], "contact": receipt["contact_pass"],
                "saved_authored_recipe_equal": receipt["saved_setup_semantic_equal"],
                "fresh_process_reopen": reopen_evidence.get("fresh_reopen"), "separate_processes": receipt["separate_processes"],
                "source_unchanged": receipt["source_unchanged"], "profile_isolated": receipt["profile_isolated"],
                "expected_refusal_verified": receipt["negative_fixture_pass"]}
            demand(row["native_gates"] == expected_gates and row["art"] == maps[map_id]["art"]
                   and row["source_static_qualification"] == maps[map_id]["source_static_qualification"]
                   and row["protected_feature_ids"] == maps[map_id]["protected_feature_ids"]
                   and row["owner_status"] == "Pending / not reviewed",
                   "Logical matrix changed a gate, artistic/source-static result or owner status")
            if native:
                demand(row["native_execution_source_head"] == expected["native_execution_source_head"]
                       and str(row["native_execution_run_id"]) == str(expected["native_execution_run_id"])
                       and row["native_execution_summary_sha256"] == expected["native_execution_summary_sha256"]
                       and row.get("native_history", []) == expected.get("native_history", []),
                       "Per-variant native evidence was relabelled as fresh execution: " + map_id)
        if followup_authority:
            demand(matrix["native_followup_authority"] == followup_authority
                   and outer_campaign["native_followup_authority"] == followup_authority,
                   "Published matrix or campaign omits separate contact authority")
        graphics = data("qualification/graphical/summary.json")
        demand(graphics["product_defect"] is False and graphics["engine_head"] == ENGINE
               and graphics["delivery_source_head"] == source_head and str(graphics["github_run_id"]) == run_id,
               "Graphical source/runtime/run identity mismatch")
        if native:
            executed = graphics["executed_source"]
            demand(executed["checkout_head"] == source_head and executed["files_match_commit"] is True,
                   "Fresh graphical driver lacks actual executing source identity")
            for path, expected_hash in executed["files"].items():
                demand(committed_digest(source_repo, source_head, path) == expected_hash,
                       "Fresh graphical driver differs from committed source: " + path)
        planned_views, ui_cases = graphical_plan(source_repo, source_head)
        observed_views = [{"name": case["name"], "map_id": case["map_id"]} for case in graphics["cases"]]
        demand(observed_views + graphics["not_executed"] == planned_views,
               "Graphical views do not match the actual committed execution plan")
        captured_count = sum(case["status"] == "CAPTURED" for case in graphics["cases"])
        demand(graphics["captured_cases"] == captured_count
               and graphics["planned_cases"] == len(planned_views),
               "Graphical planned/executed/captured population mismatch")
        if graphics["status"] == "CAPTURED_ALL_PLANNED":
            demand(not graphics["environmental_display_limitation"] and captured_count == graphics["planned_cases"]
                   and not graphics["not_executed"], "Graphical success omits planned views")
        else:
            demand(graphics["status"] == "PARTIAL_DISPLAY_LIMITATION"
                   and graphics["environmental_display_limitation"] is True
                   and any(case["status"] == "UNAVAILABLE_DISPLAY" for case in graphics["cases"]),
                   "Graphical omission lacks an explicit observed display limitation")
        captures = []
        for case in graphics["cases"]:
            demand(case["product_defect"] is False and case["headless"] is False
                   and case["engine_head"] == ENGINE and case["delivery_source_head"] == source_head,
                   "Graphical product defect or mixed displayed authority remains unresolved")
            demand(data("qualification/graphical/" + case["name"] + "-result.json") == case,
                   "Graphical summary changes its actual per-case receipt")
            requested = case["map_id"] or ui_cases.get(case["name"])
            if requested:
                source = maps[requested]
                demand(case["source"] == source["source"] and case.get("derived_source") == source.get("derived_source")
                       and case["setup_sha256"] == source["setup"]["sha256"],
                       "Graphical case source differs from the actual requested identity")
            demand(case["status"] in ("CAPTURED", "UNAVAILABLE_DISPLAY"), "Unexpected graphical case status")
            if case["status"] == "CAPTURED":
                demand(case["exit_code"] == 0 and case["timeout"] is False
                       and len(case["captures"]) == (2 if case["map_id"] is not None else 1),
                       "Claimed graphical success lacks its actual required viewports")
            if case["map_id"] is not None and case["status"] == "CAPTURED":
                source = maps[case["map_id"]]
                native_load = case["native_session"]["native_load"]
                session = data("qualification/graphical/" + case["name"] + "-session.json")
                demand(session["native_load"] == native_load and session["map_id"] == case["map_id"]
                       and session["engine_head"] == ENGINE
                       and session["original_setup_sha256"] == source["setup"]["sha256"]
                       and session["source_sha256_on_close"] == source["setup"]["sha256"]
                       and session["status"] == "QA_SAVED" and session["returned_via_close_confirmation"] is True,
                       "Displayed raw session is attached to the wrong map/runtime: " + case["name"])
                expected = {(int(actor["id"]), actor["model"]) for actor in source["actors"]}
                adopted = {(int(actor["id"]), actor["model"]) for actor in native_load["actors_adopted"]}
                demand(expected == adopted and native_load["ordinary_workbench"] is True and native_load["full_grid_match"] is True
                       and native_load["material_plane_sha256"] == source["setup"]["material_plane_sha256"]
                       and case["setup_sha256"] == source["setup"]["sha256"],
                       "Displayed source, native geometry or authored actors differ: " + case["name"])
            for capture in case["captures"]:
                path = "qualification/graphical/" + capture["path"]
                image = raw(path)
                demand(digest(image) == capture["sha256"] and image[:8] == b"\x89PNG\r\n\x1a\n",
                       "Rendered PNG identity mismatch")
                demand(struct.unpack(">II", image[16:24]) == (capture["width"], capture["height"])
                       and capture["display_driver"] not in (None, "", "headless"), "Capture is not a labelled rendered viewport")
                browser_capture = capture.get("schema") == "goldmaps.browser-graphical.v1"
                if browser_capture:
                    view = inspect_browser_capture(capture, case, maps, raw, ui_cases)
                else:
                    demand(case["map_id"] is not None and any(shot["sha256"] == capture["sha256"]
                           for shot in session["screenshots"]), "Native screenshot lacks its raw session binding")
                    if ui_cases:
                        demand(capture["content_scale_size"] == capture["window_size"] == capture["viewport_size"]
                               == [capture["width"], capture["height"]], "Displayed native UI is not using the fitted client-sized canvas")
                    view = {"depicted_map_id": case["map_id"], "kind": "actual native Workbench"}
                captures.append({"case": case["name"], "requested_case_map_id": case["map_id"],
                                 "requested_ui_map_id": case.get("requested_ui_map_id"), **view,
                                 "path": path,
                                 "sha256": capture["sha256"], "width": capture["width"], "height": capture["height"],
                                 "display_driver": capture["display_driver"], "renderer": capture.get("renderer")})
        for map_id, row in joined.items():
            applicable = [case for case in graphics["cases"] if case["map_id"] == map_id
                          and case["setup_sha256"] == maps[map_id]["setup"]["sha256"]]
            demand(row["graphical_evidence"]["cases"] == [case["name"] for case in applicable],
                   "Graphical scope spread to an unexecuted logical alias: " + map_id)
        for name in ("fresh-extraction-integrity.json", "final-extracted-after.json", "reconstruction-integrity.json"):
            receipt = external(name)
            demand(receipt["pass"] is True and receipt["manifest_sha256"] == verified["manifest_sha256"],
                   "Final extracted/reconstructed custody differs: " + name)
        for name in ("final-pristine-launcher.json", "final-extracted-product.json"):
            receipt = external(name)
            demand(receipt["pass"] is True and all(check["pass"] is True for check in receipt["checks"])
                   and receipt["package_before"]["manifest_sha256"] == verified["manifest_sha256"]
                   and receipt["package_after"]["manifest_sha256"] == verified["manifest_sha256"],
                   "Actual final launcher/product qualification failed: " + name)
            if native:
                executed = receipt["executed_source"]
                demand(executed["checkout_head"] == source_head and executed["files_match_commit"] is True,
                       "Fresh product qualification does not bind its actual executing source")
                for path, expected_hash in executed["files"].items():
                    demand(committed_digest(source_repo, source_head, path) == expected_hash,
                           "Fresh product driver/probe differs from committed source: " + path)
            if name.startswith("final-pristine"):
                demand(receipt["caller_created_userdata"] is False and receipt["initial_userdata_absent"] is True,
                       "Caller prepared profile before claimed first launch")
            else:
                demand(receipt["actual_windows_launcher"] is True and "windows" in receipt["platform"].lower(),
                       "Final product receipt did not execute actual Windows launcher")
        acquisition = external("owner-package-acquisition.v1.json")
        expected_files = {name: (row["bytes"], row["sha256"]) for name, row in inventory.items()}
        for name in (MANIFEST, SIDECAR):
            value = raw(name)
            expected_files[name] = (len(value), digest(value))
        demand({row["path"]: (row["bytes"], row["sha256"]) for row in acquisition["files"]} == expected_files
               and len(acquisition["files"]) == len(expected_files)
               and acquisition["delivery_source_head"] == source_head, "Reconstruction inventory differs from actual ZIP")
        demand(outer_campaign["acquisition_manifest_sha256"] == file_sha256(directory / "owner-package-acquisition.v1.json"),
               "Acquisition manifest lacks matching campaign digest")
        return {"schema": "goldmaps.independent-final-artifact-review.v1", "pass": True,
                "reviewer": "Specialist C, independent assurance agent; not a separate human owner",
                "review_tool_sha256": file_sha256(Path(__file__)),
                "delivery_source_head": source_head, "github_run_id": run_id, "engine_head": ENGINE,
                "scientific_engine_head": SCIENTIFIC, "archive": verified,
                "logical_maps": len(maps), "unique_setups": len(setups), "native_status_counts": dict(counts),
                "native_campaigns": native_campaigns, "native_dependency_sha256": native_pins,
                "native_evidence_reuse_review": reuse_review,
                "native_contact_followup_review": followup_review,
                "bounded_routes": {"executed": len(route_projection), "completed": sum(row["completed"] for row in route_projection),
                                   "results": route_projection, "scope": "Actual bounded scripted outcomes retained; no subjective/full-route acceptance inferred"},
                "gold_nominees": len(gold), "portrait_repair_aliases": len(portraits), "astra_aliases": len(trials),
                "all_corpus_index": 70, "per_variant_matrix_sha256": digest(raw("qualification/per-variant-matrix.v1.json")),
                "actual_launcher_and_reconstruction_receipts": inspected_external,
                "graphical_status": graphics["status"], "rendered_capture_inventory": captures,
                "owner_accepted": False,
                "scope": "Read-only audit of the actual downloaded inner ZIP, every immutable file and CRC, raw native receipts/logs, logical status joins, actual freshly extracted Windows launcher/product records and exact reconstruction inventory. No new native execution is claimed by this audit; rendered image quality is reviewed separately.",
                "remaining_owner_gates": ["Physical Windows/NVIDIA presentation", "Subjective full-route flight and B3 high-speed readability",
                                          "D1/D2 variant preference", "Gold/Platinum/Pyrite classification and production adoption"]}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--artifact-dir", type=Path, required=True)
    parser.add_argument("--source-head", required=True)
    parser.add_argument("--run-id", required=True)
    parser.add_argument("--native-artifact-dir", type=Path)
    parser.add_argument("--native-source-head")
    parser.add_argument("--native-run-id")
    parser.add_argument("--native-archive-sha256")
    parser.add_argument("--source-repo", type=Path, default=Path(__file__).resolve().parents[3])
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    demand(bool(re.fullmatch(r"[0-9a-f]{40}", args.source_head)), "An exact external source commit is required")
    demand(args.run_id.isdigit(), "An exact numeric run ID is required")
    native_values = (args.native_artifact_dir, args.native_source_head, args.native_run_id, args.native_archive_sha256)
    demand(not any(native_values) or all(native_values), "Native reuse review requires all four explicit predecessor pins")
    native = None
    if all(native_values):
        demand(bool(re.fullmatch(r"[0-9a-f]{40}", args.native_source_head)) and args.native_run_id.isdigit()
               and bool(re.fullmatch(r"[0-9a-f]{64}", args.native_archive_sha256)), "Malformed external native authority pins")
        native = {"artifact_dir": args.native_artifact_dir.resolve(), "source_head": args.native_source_head,
                  "github_run_id": args.native_run_id, "archive_sha256": args.native_archive_sha256}
    result = inspect(args.artifact_dir.resolve(), args.source_head, args.run_id, native, args.source_repo.resolve())
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({key: result[key] for key in ("pass", "logical_maps", "unique_setups", "native_status_counts", "graphical_status")}))


if __name__ == "__main__":
    main()
