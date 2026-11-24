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
from collections import Counter
import copy
import hashlib
import json
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


def digest(data):
    return hashlib.sha256(data).hexdigest()


def demand(condition, message):
    if not condition:
        raise ValueError(message)


def committed_digest(repo, head, path):
    safe_path(path)
    return digest(subprocess.check_output(["git", "-C", str(repo), "show", head + ":" + path], stderr=subprocess.DEVNULL))


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
        native_campaigns = []
        route_projection = []
        route_contract_path = "scripts/goldmaps_finalisation/native_routes.v1.json"
        route_contract = strict_json(subprocess.check_output(["git", "-C", str(source_repo), "show", native_head + ":" + route_contract_path]))
        route_specs = {row["id"]: row for row in route_contract["routes"]}
        for campaign in overlay["campaigns"]:
            summary_raw = raw(campaign["summary"])
            summary = strict_json(summary_raw)
            demand(digest(summary_raw) == campaign["summary_sha256"]
                   and summary["engine_head"] == ENGINE and summary["frozen_scientific_engine"] == SCIENTIFIC
                   and summary["godot_sha256"] == overlay["godot_sha256"]
                   and summary["probe_sha256"] == overlay["probe_sha256"]
                   and str(summary["github_run_id"]) == native_run and summary["github_sha"] == native_head
                   and summary["executed_source"]["checkout_head"] == native_head
                   and summary["executed_source"]["files_match_commit"] is True
                   and summary["runtime_kind"] == "shipped Windows project", "Native campaign source/runtime mismatch")
            demand(summary["profile"]["isolated"] is True and summary["profile"]["native_bridge"] is True
                   and summary["godot_version"]["hash"] == "5b4e0cb0fd279832bbdd69fed5354d4e5ad26f88",
                   "Exact native runtime or portable profile is not proved")
            for path, expected_hash in summary["executed_source"]["files"].items():
                demand(committed_digest(source_repo, native_head, path) == expected_hash,
                       "Recorded native harness differs from executed source commit: " + path)
            for row in summary["results"]:
                stored = data(str(PurePosixPath(campaign["summary"]).parent / (row["id"] + ".receipt.json")))
                demand(stored == row, "Native summary result differs from raw per-case receipt")
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
                                     "native_execution_source_head": native_head, "native_execution_run_id": native_run,
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
                   and receipt["qualification_status"] == status["status"], "Wrong native receipt: " + path)
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
        for original in ("gold-155", "corpus-183"):
            demand(overlay["setups"][maps[original]["setup"]["sha256"]]["status"] == "REFUSED_INVALID_SOURCE",
                   "Original known-invalid policy is not visibly refused")
        for required in data("collection/native-inputs.v1.json")["records"]:
            demand(overlay["setups"][required["setup_sha256"]]["status"] in ("QUALIFIED_HEADLESS", "REFUSED_INVALID_SOURCE"),
                   "Required minimum variant is unqualified: " + required["id"])
        matrix = data("qualification/per-variant-matrix.v1.json")
        joined = {row["id"]: row for row in matrix["records"]}
        demand(set(joined) == set(maps) and matrix["delivery_source_head"] == source_head, "Logical matrix coverage/source mismatch")
        for map_id, row in joined.items():
            expected = overlay["setups"][maps[map_id]["setup"]["sha256"]]
            demand(row["native_status"] == expected["status"] and row["native_receipt_sha256"] == expected["receipt_sha256"]
                   and row["owner_accepted"] is False and row["owner_classification"] is None,
                   "Matrix silently changes native or owner verdict: " + map_id)
            demand(row["source"] == maps[map_id]["source"] and row["setup"] == maps[map_id]["setup"]
                   and row.get("derived_source") == maps[map_id].get("derived_source"),
                   "Matrix source or derived-variant identity differs from roster: " + map_id)
            if native:
                demand(row["native_execution_source_head"] == native_head
                       and str(row["native_execution_run_id"]) == native_run
                       and expected["native_execution_source_head"] == native_head
                       and str(expected["native_execution_run_id"]) == native_run,
                       "Per-variant native evidence was relabelled as fresh execution: " + map_id)
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
        captured_count = sum(case["status"] == "CAPTURED" for case in graphics["cases"])
        demand(graphics["captured_cases"] == captured_count
               and graphics["planned_cases"] == len(graphics["cases"]) + len(graphics["not_executed"]),
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
            demand(case["product_defect"] is False, "Graphical product defect remains unresolved")
            if case["map_id"] is not None and case["status"] == "CAPTURED":
                source = maps[case["map_id"]]
                native = case["native_session"]["native_load"]
                session = data("qualification/graphical/" + case["name"] + "-session.json")
                demand(session["native_load"] == native and session["map_id"] == case["map_id"]
                       and session["engine_head"] == ENGINE
                       and session["original_setup_sha256"] == source["setup"]["sha256"]
                       and session["source_sha256_on_close"] == source["setup"]["sha256"]
                       and session["status"] == "QA_SAVED" and session["returned_via_close_confirmation"] is True,
                       "Displayed raw session is attached to the wrong map/runtime: " + case["name"])
                expected = {(int(actor["id"]), actor["model"]) for actor in source["actors"]}
                adopted = {(int(actor["id"]), actor["model"]) for actor in native["actors_adopted"]}
                demand(expected == adopted and native["ordinary_workbench"] is True and native["full_grid_match"] is True
                       and native["material_plane_sha256"] == source["setup"]["material_plane_sha256"]
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
                depicted = capture["selected_id"] if browser_capture else case["map_id"]
                if browser_capture:
                    demand(depicted in maps and capture["visible_maps"] == 25 and capture["active_collection"] == "gold25",
                           "Gallery capture lacks its actual visible selection identity")
                else:
                    demand(case["map_id"] is not None and any(shot["sha256"] == capture["sha256"]
                           for shot in session["screenshots"]), "Native screenshot lacks its raw session binding")
                captures.append({"case": case["name"], "requested_case_map_id": case["map_id"],
                                 "depicted_map_id": depicted, "kind": "browser gallery" if browser_capture else "actual native Workbench",
                                 "path": path,
                                 "sha256": capture["sha256"], "width": capture["width"], "height": capture["height"],
                                 "display_driver": capture["display_driver"]})
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
