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
from product_source_identity import product_source_identity
from run_native_collection import profile_environment, record, run, write_json
from verify_payload import MANIFEST, file_sha256 as sha, strict_json, verify_directory

HERE = Path(__file__).resolve().parent
REPLACEMENT_ACTIONS = {"Load start", "New blank", "New from generator…", "Load / reset scene",
                       "Load liquid-lab", "Load reservoir-lab", "Mixed Actor Workshop"}
FLATTEN_GATES = ("warning_visible", "same_world_epoch", "authored_setup_unchanged", "material_baseline_unchanged", "no_flatten_pending")
SAVE_ATTRIBUTION_GATES = ("typing_existing_name_did_not_register", "typing_existing_name_left_banner", "existing_name_button_refused",
                         "foreign_file_sha256_unchanged", "uppercase_reserved_name_refused", "ordinary_button_new_label_saved", "keyboard_new_label_saved")


def replacement_controls_pass(session):
    rows = session.get("qa_lifecycle", {}).get("ordinary_replacement_controls", [])
    return (len(rows) == len(REPLACEMENT_ACTIONS) and {row.get("action") for row in rows} == REPLACEMENT_ACTIONS
            and session.get("qa_lifecycle", {}).get("actor_composition_opened") is True
            and all(row.get("warning_before_replacement") is True and row.get("cancel_preserved_same_world") is True for row in rows))


def save_attribution_pass(session, roster):
    """Check actual named-file bytes, not only the session's asserted booleans."""
    receipt = session.get("qa_lifecycle", {}).get("ordinary_save_attribution", {})
    if not all(receipt.get(key) is True for key in SAVE_ATTRIBUTION_GATES):
        return False
    if (receipt.get("reserved_label") != "GM-SOURCE-" + session["original_setup_sha256"][:20]
            or receipt.get("reserved_before_sha256") != receipt.get("reserved_after_sha256")
            or receipt.get("reserved_after_sha256") not in ("", session["original_setup_sha256"])):
        return False
    maps = {row["id"]: row for row in roster["maps"]}
    foreign = maps.get(receipt.get("foreign_source_map_id"), {})
    if foreign.get("setup", {}).get("sha256") != receipt.get("foreign_setup_sha256") or receipt.get("foreign_setup_sha256") == session["original_setup_sha256"]:
        return False
    foreign_path = Path(session["user_data_dir"]) / "workbench" / ("setup-" + receipt["foreign_label"] + ".json")
    if not foreign_path.is_file() or sha(foreign_path) != receipt["foreign_setup_sha256"]:
        return False
    saved = {row["label"]: row for row in session["saved_copies"]}
    labels = {receipt["ordinary_button_label"], receipt["keyboard_label"]}
    if len(labels) != 2 or receipt["foreign_label"] in saved or not labels <= saved.keys():
        return False
    if any(label.lower().startswith("gm-source-") for label in saved):
        return False
    return all(Path(saved[label]["path"]).is_file() and sha(Path(saved[label]["path"])) == saved[label]["sha256"] for label in labels)


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
    executed_source = product_source_identity(("run_product_qa.py", "product_browser_probe.gd", "audit_collection.py",
                                               "run_native_collection.py", "verify_payload.py"))
    root, godot, out = args.package.resolve(), args.godot.resolve(), args.out.resolve()
    if out.exists():
        raise ValueError("refuse to overwrite product QA receipts")
    if (root / "userdata/reviews/decisions.json").exists():
        raise ValueError("refuse to overwrite existing owner decisions; use a fresh disposable extraction")
    if args.actual_windows_launcher and os.name != "nt":
        raise ValueError("actual .cmd execution requires Windows")
    before = verify_directory(root, post_execution=True)
    out.mkdir(parents=True)
    write_json(out / "executed-source.json", executed_source)
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
    check("all ordinary replacement controls warn and preserve edited World on cancel", replacement_controls_pass(session))
    check("Flatten remains guarded without changing World or authored history", all(lifecycle.get("flatten_guard", {}).get(key) is True for key in FLATTEN_GATES))
    check("ordinary Save button and Ctrl+S create protected correctly attributed copies", save_attribution_pass(session, roster))
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
    check("all ordinary replacement controls protect the reopened World", replacement_controls_pass(reopened))
    check("reopened copy Flatten guard preserves authored history", all(reopened.get("qa_lifecycle", {}).get("flatten_guard", {}).get(key) is True for key in FLATTEN_GATES))
    check("reopened ordinary Save attribution and existing-name protection", save_attribution_pass(reopened, roster))
    check("saved input protected during reopen", sha(saved_path) == saved["sha256"])
    check("original remains immutable after both sessions", sha(original_path) == original_digest)
    after = verify_directory(root, before["manifest_sha256"], post_execution=True)
    summary = {"schema": "goldmaps.owner-product-qa.v1", "platform": platform.platform(), "graphical_requested": args.graphical,
               "executed_source": executed_source,
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
