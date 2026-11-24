#!/usr/bin/env python3
"""Independent actual-browser, paint/save/reopen and local-review contract QA.

Use only an explicitly disposable extracted kit. Synthetic review records are
Pending/Unclassified and never enter a published archive. Windows can execute
the actual one-click .cmd with its opt-in QA headless switch. A displayed run
is reported separately from headless behavior; neither is physical owner GPU
acceptance. No network operation is performed.
"""
from __future__ import annotations

import argparse
import copy
import csv
import hashlib
import json
import os
from pathlib import Path
import platform
import shutil
import subprocess
import uuid

from audit_collection import plane
from run_native_collection import profile_environment, record, run, write_json
from verify_payload import MANIFEST, file_sha256 as sha, strict_json, verify_directory

HERE = Path(__file__).resolve().parent


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--package", type=Path, required=True)
    parser.add_argument("--godot", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--disposable-test-profile", action="store_true", required=True)
    parser.add_argument("--actual-windows-launcher", action="store_true")
    parser.add_argument("--graphical", action="store_true")
    parser.add_argument("--map-id", default="derived-155-policy")
    args = parser.parse_args()
    root, godot, out = args.package.resolve(), args.godot.resolve(), args.out.resolve()
    if out.exists():
        raise ValueError("refuse to overwrite product QA receipts")
    if (root / "userdata/reviews/decisions.json").exists():
        raise ValueError("refuse to overwrite existing owner decisions; use a fresh disposable extraction")
    if args.actual_windows_launcher and os.name != "nt":
        raise ValueError("actual .cmd execution requires Windows")
    before = verify_directory(root, post_execution=True)
    out.mkdir(parents=True)
    env = profile_environment(root / "userdata")
    env.update(GOLDMAPS_PACKAGE_ROOT=str(root), GOLDMAPS_QA_OUTPUT=str(out))
    for key in ("GOLDMAPS_QA_MAP", "GOLDMAPS_QA_SMOKE", "GOLDMAPS_QA_EDIT"):
        env.pop(key, None)
    display = [] if args.graphical else ["--headless"]
    base = [godot, *display, "--path", root / "browser"]
    checks, phases = [], {}

    def check(name, condition, detail=None):
        checks.append({"name": name, "pass": bool(condition), "detail": detail})

    for phase in ("author", "reopen"):
        phase_env = dict(env, GOLDMAPS_BROWSER_QA_PHASE=phase)
        receipt, text = run([*base, "--script", HERE / "product_browser_probe.gd"], out / ("browser-" + phase + ".log"), phase_env, 180)
        receipt["evidence"] = record(text, "GOLDMAPS_BROWSER_CONTRACT ")
        phases[phase] = receipt
        check("actual browser " + phase + " contract", receipt["exit_code"] == 0 and (receipt["evidence"] or {}).get("pass"))
        if not checks[-1]["pass"]:
            write_json(out / "failure.json", {"checks": checks, "phases": phases})
            raise RuntimeError("actual browser contract failed; preserved receipts in " + str(out))
    check("review reopened in independent process", phases["author"]["process_id"] != phases["reopen"]["process_id"])
    decisions = strict_json((root / "userdata/reviews/decisions.json").read_bytes())
    fixture = decisions["decisions"]["gold-106"]
    export_dirs = sorted((root / "userdata/reviews/exports").iterdir())
    check("local export created", bool(export_dirs))
    exports = export_dirs[-1]
    exported = strict_json((exports / "decisions.json").read_bytes())
    with (exports / "decisions.csv").open(newline="", encoding="utf-8") as stream:
        csv_records = list(csv.DictReader(stream))
    markdown = (exports / "decisions.md").read_text(encoding="utf-8")
    check("JSON export preserves exact repeated note", exported["decisions"]["gold-106"] == fixture)
    check("CSV export preserves commas quotes and newlines", len(csv_records) == 1 and csv_records[0]["playability_notes"] == fixture["playability_notes"])
    check("Markdown export preserves note and source", fixture["playability_notes"] in markdown and fixture["setup_sha256"] in markdown)
    check("synthetic reviews remain unclassified", fixture["classification"] == "Unclassified" and fixture["status"] == "Pending / not reviewed")
    roster = strict_json((root / "collection/collection.v1.json").read_bytes())
    logical = next(row for row in roster["maps"] if row["id"] == args.map_id)
    original_path = root / logical["setup"]["path"]
    original = strict_json(original_path.read_bytes())
    original_digest = sha(original_path)
    sessions = root / "userdata/sessions"
    sessions.mkdir(parents=True, exist_ok=True)
    prior = set(sessions.glob("*.json"))
    play_env = dict(env, GOLDMAPS_QA_MAP=args.map_id, GOLDMAPS_QA_SMOKE="1", GOLDMAPS_QA_EDIT="1")
    if args.actual_windows_launcher:
        play_env["GOLDMAPS_QA_HEADLESS"] = "0" if args.graphical else "1"
        command = ["cmd", "/d", "/c", str(root / "Open GOLDMAPS.cmd")]
    else:
        command = base
    receipt, text = run(command, out / "browser-native-edit.log", play_env, 360)
    if args.actual_windows_launcher:
        log = root / "userdata/browser.log"
        if log.exists():
            shutil.copyfile(log, out / "actual-launcher-browser.log")
            text += "\n" + log.read_text(encoding="utf-8-sig", errors="replace")
    receipt["launch"] = record(text, "GOLDMAPS_BROWSER_LAUNCHED ")
    receipt["returned"] = record(text, "GOLDMAPS_BROWSER_QA_COMPLETED ")
    phases["browser_native_edit"] = receipt
    new_sessions = set(sessions.glob("*.json")) - prior
    check("actual browser launched one new native session", receipt["exit_code"] == 0 and len(new_sessions) == 1 and receipt["launch"] is not None)
    if not checks[-1]["pass"]:
        write_json(out / "failure.json", {"checks": checks, "phases": phases})
        raise RuntimeError("browser-to-native edit path failed")
    session_file = next(iter(new_sessions))
    session = strict_json(session_file.read_bytes())
    shutil.copyfile(session_file, out / "native-edited-session.json")
    check("ordinary Workbench native load", session["status"] == "QA_SAVED" and session["native_load"]["ordinary_workbench"] and session["native_load"]["full_grid_match"])
    lifecycle = session.get("qa_lifecycle", {})
    check("actual close warning and cancel preserve same World", lifecycle.get("close_warning_visible") and lifecycle.get("cancel_preserved_same_world"))
    check("existing evaluation save name refused without overwriting", lifecycle.get("existing_name_refused") and lifecycle.get("saved_copy_sha256_unchanged"))
    check("actual save-and-return dialog completed", lifecycle.get("save_and_return_dialog_visible") and session.get("returned_via_close_confirmation"))
    check("browser observed safe native return", (receipt.get("returned") or {}).get("data", {}).get("status") == "QA_SAVED")
    edit = session.get("qa_edit", {})
    check("ordinary paint acknowledged by native cells", edit.get("ordinary_workbench_paint") and edit.get("native_seen") and edit.get("before") != edit.get("after"))
    saved = session["saved_copies"][-1]
    saved_path = Path(saved["path"])
    saved_recipe = strict_json(saved_path.read_bytes())
    expected = copy.deepcopy(original)
    expected["edits"].append([32, 32, original["brush"], edit["after"]])
    check("named authored copy contains only deliberate paint stamp", saved_recipe == expected)
    check("new saved copy distinct from source bytes", sha(saved_path) == saved["sha256"] and saved["sha256"] != original_digest)
    check("save stays in portable profile", saved_path.resolve().is_relative_to((root / "userdata").resolve()))
    check("source Setup immutable after edit", sha(original_path) == original_digest == session["source_sha256_after_load"])
    expected_plane = hashlib.sha256(plane(saved_recipe).tobytes()).hexdigest()
    reopen_env = dict(env, GOLDMAPS_QA_SMOKE="1", GOLDMAPS_QA_EDIT="1", GOLDMAPS_BROWSER_QA_PHASE="open_saved",
                      GOLDMAPS_QA_SAVED_MAP=args.map_id, GOLDMAPS_QA_SAVED_LABEL=saved["label"], GOLDMAPS_QA_SAVED_SHA=saved["sha256"])
    prior = set(sessions.glob("*.json"))
    receipt, text = run([*base, "--script", HERE / "product_browser_probe.gd"], out / "browser-saved-reopen.log", reopen_env, 360)
    receipt["request"] = record(text, "GOLDMAPS_BROWSER_SAVED_REQUEST ")
    phases["browser_saved_reopen"] = receipt
    new_sessions = set(sessions.glob("*.json")) - prior
    check("actual browser reopened named copy", receipt["exit_code"] == 0 and len(new_sessions) == 1 and receipt["request"] is not None)
    if not checks[-1]["pass"]:
        write_json(out / "failure.json", {"checks": checks, "phases": phases})
        raise RuntimeError("browser saved-copy reopen failed")
    reopened_file = next(iter(new_sessions))
    reopened = strict_json(reopened_file.read_bytes())
    shutil.copyfile(reopened_file, out / "native-reopened-session.json")
    check("fresh native World preserves exact edited material plane", reopened["native_load"]["material_plane_sha256"] == expected_plane and reopened["native_load"]["full_grid_match"])
    check("fresh native World observes deliberately painted cell", reopened.get("qa_edit_reopen", {}).get("native_material") == edit["after"])
    check("native reopen is a distinct process", reopened["process_id"] != session["process_id"])
    check("reopened copy close and cancel preserve same World", reopened.get("qa_lifecycle", {}).get("cancel_preserved_same_world") and reopened.get("returned_via_close_confirmation"))
    check("saved input protected during reopen", sha(saved_path) == saved["sha256"])
    check("original remains immutable after both sessions", sha(original_path) == original_digest)
    after = verify_directory(root, before["manifest_sha256"], post_execution=True)
    summary = {"schema": "goldmaps.owner-product-qa.v1", "platform": platform.platform(), "graphical_requested": args.graphical,
               "actual_windows_launcher": args.actual_windows_launcher, "engine_head": before["engine_head"],
               "package_before": before, "package_after": after, "godot_sha256": sha(godot),
               "checks": checks, "phases": phases, "pass": all(row["pass"] for row in checks),
               "map_id": args.map_id, "original_setup_sha256": original_digest, "saved_setup_sha256": saved["sha256"],
               "edited_material_plane_sha256": expected_plane,
               "scope": "Actual browser controls and subprocess path; repeated local pending-review persistence/export; native ordinary paint, named save and browser-led fresh-process reopen. A single representative map; not all-map editing or subjective owner playfeel.",
               "owner_acceptance": "PENDING; all synthetic review fixtures remain Pending/Unclassified"}
    write_json(out / "summary.json", summary)
    print("GOLDMAPS_PRODUCT_QA " + json.dumps({"pass": summary["pass"], "checks": len(checks), "failed": [row["name"] for row in checks if not row["pass"]], "engine_head": summary["engine_head"]}))
    return 0 if summary["pass"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
