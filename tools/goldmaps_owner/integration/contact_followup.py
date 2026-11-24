#!/usr/bin/env python3
"""Keep an explicitly bounded three-map contact follow-up separate from N.

The prior complete native campaign remains immutable. These three portrait
sources had positive load, movement, save and fresh reopen but no contact in
900 ticks; exact source geometry places a hard floor below that observation.
The unchanged native harness already supports a prereviewed 1800-tick budget.
This module changes no Setup, runtime, native probe or original input roster.
"""
from __future__ import annotations

import copy
import json
import os
from pathlib import Path
import shutil

from prepare_runtime import ENGINE
from verify_payload import file_sha256 as sha, strict_json


INPUT = "collection/native-contact-followup-inputs.v1.json"
KIND = "windows-contact-followup"
TARGETS = {
    "corpus-188": {
        "setup_sha256": "2e0dda555e841a3d13a4cf7b84dea6f0036aaa22b012cb58246edaf4c6edf420",
        "material_plane_sha256": "d839766373ef4e7a964ede02298118ff4c0de2b4a0d96fcde4c0ec8e73d3b6fd",
        "x": 505, "first_hard_y": 1923, "material_id": 68,
    },
    "corpus-189": {
        "setup_sha256": "32639654b818580f4c55dcb2439f0d44e03d59b906cd84956af32c5d38420a0b",
        "material_plane_sha256": "b19c8c358dd33e7a6aac284eedbea0503dbe54f62bae67953681684ad2c6bc1d",
        "x": 528, "first_hard_y": 1958, "material_id": 100,
    },
    "corpus-192": {
        "setup_sha256": "752c423fa011f98ebbf4fc9c5a49c9a8cb416881c1a852c2e8fdd26f732eae08",
        "material_plane_sha256": "30c6668a34341b172d231e4d257175a76b35b314e15dfb468a218d4970c56397",
        "x": 495, "first_hard_y": 1980, "material_id": 100,
    },
}


def demand(condition, message):
    if not condition:
        raise ValueError("Bounded contact follow-up refused: " + message)


def write(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2) + "\n", encoding="utf-8")


def prepare(kit: Path, request: dict, repo: Path):
    """Seal a new input, preserving both original declared populations exactly."""
    demand(request.get("ids") == list(TARGETS) and request.get("tick_budget") == 1800,
           "only the three reviewed optional portraits and 1800 ticks are allowed")
    audit_path = repo / request["source_static_audit"]["path"]
    demand(sha(audit_path) == request["source_static_audit"]["sha256"], "source-static audit changed")
    original = strict_json((kit / "collection/native-inputs-optional.v1.json").read_bytes())
    records = {row["id"]: row for row in original["records"]}
    selected = []
    for map_id, target in TARGETS.items():
        row = copy.deepcopy(records[map_id])
        demand(row["setup_sha256"] == target["setup_sha256"]
               and row["material_plane_sha256"] == target["material_plane_sha256"]
               and row["extent"] == [1024, 2048]
               and not row.get("expected_native_refusal")
               and "contact_probe_tick_limit" not in row, "source identity or prior budget differs: " + map_id)
        demand(sha(kit / row["package_path"]) == target["setup_sha256"], "Setup bytes changed: " + map_id)
        row["contact_probe_tick_limit"] = 1800
        selected.append(row)
    value = {"schema": original["schema"], "engine_head": original["engine_head"],
             "scientific_engine_head": original["scientific_engine_head"],
             "counts": {"logical_aliases": 3, "unique_setups": 3}, "records": selected,
             "source_static_contact_targets": TARGETS,
             "source_static_audit": request["source_static_audit"],
             "prior_input": {"path": "collection/native-inputs-optional.v1.json",
                             "sha256": sha(kit / "collection/native-inputs-optional.v1.json")},
             "scope": "Separate full load/movement/contact/save/reopen observation for exactly three unchanged portraits. Only the supported gravity contact budget changes from 900 to 1800 ticks. Original no-contact receipts remain immutable; geometry, actors, policy, probes and acceptance gates do not change."}
    write(kit / INPUT, value)
    shutil.copyfile(audit_path, kit / "collection/contact-followup-source-static-audit.v1.json")
    return value


def apply(kit: Path, directory: Path, qualification: dict, source_head: str):
    """Use each fresh complete result, retaining its original native history."""
    summary_path = directory / "summary.json"
    demand(summary_path.is_file(), "incomplete native campaign cannot produce partial eligibility")
    summary = strict_json(summary_path.read_bytes())
    overlay = strict_json((directory / "delivery-qualification.v1.json").read_bytes())
    inputs = strict_json((kit / INPUT).read_bytes())
    expected = {row["id"]: row for row in inputs["records"]}
    demand(summary["engine_head"] == ENGINE and summary["godot_sha256"] == qualification["godot_sha256"]
           and summary["probe_sha256"] == qualification["probe_sha256"]
           and summary["inputs_sha256"] == sha(kit / INPUT)
           and summary["executed_source"]["checkout_head"] == source_head
           and summary["executed_source"]["files_match_commit"] is True
           and summary["github_sha"] == source_head
           and str(summary["github_run_id"]) == str(os.environ.get("GITHUB_RUN_ID"))
           and summary["runtime_kind"] == "shipped Windows project", "fresh execution authority differs")
    demand(summary["aliases_checked"] == summary["unique_setups_checked"] == summary["declared_campaign_aliases"] == 3
           and len(summary["results"]) == 3 and not summary["route_results"]
           and {row["id"] for row in summary["results"]} == set(TARGETS), "follow-up scope differs")
    demand(set(overlay["setups"]) == {target["setup_sha256"] for target in TARGETS.values()},
           "follow-up overlay omits or substitutes a source")
    transition_rows = []
    base = "qualification/" + KIND + "/"
    for result in summary["results"]:
        map_id, setup_hash = result["id"], result["setup_sha256"]
        demand(result["source_records"] == [expected[map_id]] and result["aliases"] == [map_id]
               and setup_hash == TARGETS[map_id]["setup_sha256"]
               and result["expected_native_refusal"] is None, "wrong source or alias")
        old = qualification["setups"][setup_hash]
        demand(old["status"] == "UNQUALIFIED" and old["aliases"] == [map_id],
               "only a previously unqualified contact case may receive a follow-up")
        prior = strict_json((kit / old["receipt"]).read_bytes())
        demand(sha(kit / old["receipt"]) == old["receipt_sha256"]
               and prior["contact_pass"] is False and prior["movement_pass"] is True
               and prior["saved_setup_semantic_equal"] is True and prior["plane_matches_corpus"] is True
               and prior["phases"]["load"]["evidence"]["collision_probe"]["tick_budget"] == 900
               and prior["phases"]["reopen"]["evidence"]["fresh_reopen"] is True,
               "original observation no longer matches the limited contact gap")
        current = copy.deepcopy(overlay["setups"][setup_hash])
        receipt_path = directory / current["receipt"]
        demand(sha(receipt_path) == current["receipt_sha256"] and strict_json(receipt_path.read_bytes()) == result,
               "fresh raw result differs from its summary")
        load = result["phases"]["load"].get("evidence") or {}
        demand((load.get("collision_probe") or {}).get("tick_budget") == 1800,
               "fresh observation did not execute the reviewed contact budget")
        demand(current["status"] in ("QUALIFIED_HEADLESS", "UNQUALIFIED")
               and (current["status"] == "QUALIFIED_HEADLESS") == (result["pass"] is True),
               "no qualified state without all unchanged native gates")
        current.update(receipt=base + current["receipt"], native_execution_source_head=source_head,
                       native_execution_run_id=summary["github_run_id"],
                       native_execution_summary_sha256=sha(summary_path),
                       native_history=[copy.deepcopy(old)],
                       followup_reason="Original 900-tick contact window ended above an exact source hard floor; separate unchanged-Setup 1800-tick observation.")
        qualification["setups"][setup_hash] = current
        transition_rows.append({"id": map_id, "setup_sha256": setup_hash, "prior_status": old["status"],
                                "prior_receipt": old["receipt"], "prior_receipt_sha256": old["receipt_sha256"],
                                "current_status": current["status"], "current_receipt": current["receipt"],
                                "current_receipt_sha256": current["receipt_sha256"]})
    target = kit / "qualification" / KIND
    target.mkdir(parents=True, exist_ok=False)
    for path in directory.iterdir():
        demand(path.is_file() and path.suffix in (".json", ".log"), "unexpected native evidence member")
        shutil.copyfile(path, target / path.name)
    campaign = {"kind": KIND, "summary": base + "summary.json", "summary_sha256": sha(summary_path),
                "input_manifest_sha256": overlay["input_manifest_sha256"],
                "github_run_id": summary["github_run_id"], "native_execution_source_head": source_head,
                "unique_setups": 3, "qualified_unique_setups": summary["qualified_unique_setups"],
                "verified_refused_unique_setups": 0, "validation_pass": summary["validation_pass"],
                "scope": "Additional observation of three previously unqualified exact inputs; not an additional distinct Setup population."}
    qualification["campaigns"].append(campaign)
    qualification["native_followup_authority"] = {"source_head": source_head, "github_run_id": summary["github_run_id"],
                                                 "summary": base + "summary.json", "summary_sha256": sha(summary_path),
                                                 "inputs": INPUT, "inputs_sha256": sha(kit / INPUT),
                                                 "targets": list(TARGETS), "transitions": transition_rows}
    qualification["counts"] = {"unique_setups": len(qualification["setups"]),
        "qualified_headless": sum(v["status"] == "QUALIFIED_HEADLESS" for v in qualification["setups"].values()),
        "verified_refused_originals": sum(v["status"] == "REFUSED_INVALID_SOURCE" for v in qualification["setups"].values()),
        "unqualified_reference_only": sum(v["status"] == "UNQUALIFIED" for v in qualification["setups"].values()), "owner_accepted": 0}
    return qualification["native_followup_authority"]
