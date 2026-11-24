#!/usr/bin/env python3
"""Prove the actual Windows one-click launcher creates a pristine kit's profile.

The caller creates no userdata/cache directories and supplies no profile-routing
overrides. The actual shipped .cmd must establish its portable workspace, open
an ordinary source map and the separately identified #183 policy descendant,
save named copies, and return safely. This is a representative first-run check,
not another all-map native campaign or displayed/physical-GPU acceptance.
"""
from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
import shutil

from run_native_collection import record, run, write_json
from product_source_identity import product_source_identity
from verify_payload import MANIFEST, file_sha256 as sha, strict_json, verify_directory

CASES = ("gold-125", "derived-183-policy")
REPLACEMENT_ACTIONS = {"Load start", "New blank", "New from generator…", "Load / reset scene",
                       "Load liquid-lab", "Load reservoir-lab", "Mixed Actor Workshop"}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--package", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    executed_source = product_source_identity(("run_fresh_launcher.py", "run_native_collection.py", "verify_payload.py"))
    if os.name != "nt":
        raise ValueError("A native Windows process is required; this gate cannot be simulated on Linux")
    root, out = args.package.resolve(), args.out.resolve()
    if out.exists() or out.is_relative_to(root):
        raise ValueError("Use a new evidence directory outside the pristine extracted package")
    for relative in ("userdata", "browser/.godot", "runtime/project/.godot"):
        if (root / relative).exists():
            raise ValueError("First-run qualification requires an untouched extraction; already present: " + relative)
    before = verify_directory(root)
    manifest = strict_json((root / MANIFEST).read_bytes())
    roster = strict_json((root / "collection/collection.v1.json").read_bytes())
    overlay = strict_json((root / "collection/delivery-qualification.v1.json").read_bytes())
    if overlay["engine_head"] != manifest["engine_head"] or "windows" not in overlay.get("platform", "").lower():
        raise ValueError("Fresh Windows launch requires the actual source-matched Windows qualification overlay")
    maps = {row["id"]: row for row in roster["maps"]}
    for map_id in CASES:
        if overlay["setups"].get(maps[map_id]["setup"]["sha256"], {}).get("status") != "QUALIFIED_HEADLESS":
            raise ValueError("Required pristine-launch example is not native-qualified: " + map_id)
    out.mkdir(parents=True)
    write_json(out / "executed-source.json", executed_source)
    checks, phases = [], []

    def check(name, condition, detail=None):
        checks.append({"name": name, "pass": bool(condition), "detail": detail})

    env = os.environ.copy()
    # Keep the caller's ordinary OS profile unchanged. The batch launcher, not
    # this driver, must replace routing for its own browser/native children.
    for key in tuple(env):
        if key.startswith("GOLDMAPS_QA_") or key in ("GOLDMAPS_BROWSER_QA_PHASE", "GOLDMAPS_PACKAGE_ROOT", "GOLDMAPS_EXPECTED_PROFILE_ROOT"):
            env.pop(key)
    env.update(GOLDMAPS_QA_HEADLESS="1", GOLDMAPS_QA_SMOKE="1")
    executable = os.environ.get("COMSPEC", r"C:\Windows\System32\cmd.exe")
    launcher = root / "Open GOLDMAPS.cmd"
    if '"' in executable or '"' in str(launcher):
        raise ValueError("Invalid Windows launcher path")
    command = f'"{executable}" /d /s /c ""{launcher}""'
    sessions = root / "userdata/sessions"
    for map_id in CASES:
        row = maps[map_id]
        prior = set(sessions.glob("*.json"))
        case_env = dict(env, GOLDMAPS_QA_MAP=map_id)
        # A structured executable/args call through run() is unsuitable for the
        # outer cmd /s /c quote-pair rules. Popen receives this exact Windows
        # command string with shell=False; its contents are only known paths.
        phase = run_windows(command, out / (map_id + "-launcher.log"), case_env)
        browser_log = root / "userdata/browser.log"
        text = ""
        if browser_log.is_file():
            shutil.copyfile(browser_log, out / (map_id + "-browser.log"))
            text = browser_log.read_text(encoding="utf-8-sig", errors="replace")
        phase["browser_ready"] = record(text, "GOLDMAPS_BROWSER_READY ")
        phase["browser_launch"] = record(text, "GOLDMAPS_BROWSER_LAUNCHED ")
        phase["browser_return"] = record(text, "GOLDMAPS_BROWSER_QA_COMPLETED ")
        phase["map_id"] = map_id
        phases.append(phase)
        added = set(sessions.glob("*.json")) - prior
        check(map_id + ": actual one-click launcher completed", phase["exit_code"] == 0 and not phase["timeout"])
        check(map_id + ": one native session created", len(added) == 1 and phase["browser_launch"] is not None)
        check(map_id + ": browser verified and returned", phase["browser_ready"] is not None and (phase["browser_return"] or {}).get("data", {}).get("status") == "QA_SAVED")
        if len(added) != 1:
            break
        session_path = next(iter(added))
        session = strict_json(session_path.read_bytes())
        shutil.copyfile(session_path, out / (map_id + "-session.json"))
        if session_path.with_suffix(".log").is_file():
            shutil.copyfile(session_path.with_suffix(".log"), out / (map_id + "-session.log"))
        native = session.get("native_load", {})
        expected_actors = [{"id": int(a["id"]), "model": a["model"]} for a in row["actors"]]
        check(map_id + ": exact original and engine identity", session.get("map_id") == map_id
              and session.get("original_setup_sha256") == row["setup"]["sha256"]
              and session.get("engine_head") == manifest["engine_head"])
        check(map_id + ": native Workbench material plane", native.get("ordinary_workbench") and native.get("full_grid_match")
              and native.get("material_plane_sha256") == row["setup"]["material_plane_sha256"])
        check(map_id + ": authored actors adopted", native.get("actors_adopted") == expected_actors)
        observed_profile = Path(session.get("user_data_dir", ""))
        check(map_id + ": launcher-created portable profile", observed_profile.is_absolute()
              and observed_profile.resolve().is_relative_to((root / "userdata").resolve()), str(observed_profile))
        lifecycle = session.get("qa_lifecycle", {})
        check(map_id + ": close cancellation and save protection", lifecycle.get("close_warning_visible")
              and lifecycle.get("cancel_preserved_same_world") and lifecycle.get("existing_name_refused")
              and lifecycle.get("saved_copy_sha256_unchanged"))
        replacements = lifecycle.get("ordinary_replacement_controls", [])
        check(map_id + ": all ordinary replacement controls warn before changing World",
              len(replacements) == len(REPLACEMENT_ACTIONS) and {row.get("action") for row in replacements} == REPLACEMENT_ACTIONS
              and lifecycle.get("actor_composition_opened") is True
              and all(row.get("warning_before_replacement") is True and row.get("cancel_preserved_same_world") is True for row in replacements))
        check(map_id + ": Flatten preserves World and authored history", all(lifecycle.get("flatten_guard", {}).get(key) is True for key in
              ("warning_visible", "same_world_epoch", "authored_setup_unchanged", "material_baseline_unchanged", "no_flatten_pending")))
        attribution = lifecycle.get("ordinary_save_attribution", {})
        check(map_id + ": ordinary Save and Ctrl+S protect names and attribution", all(attribution.get(key) is True for key in
              ("typing_existing_name_did_not_register", "typing_existing_name_left_banner", "existing_name_button_refused", "foreign_file_sha256_unchanged", "uppercase_reserved_name_refused", "ordinary_button_new_label_saved", "keyboard_new_label_saved"))
              and attribution.get("reserved_label") == "GM-SOURCE-" + row["setup"]["sha256"][:20]
              and attribution.get("reserved_before_sha256") == attribution.get("reserved_after_sha256")
              and attribution.get("reserved_after_sha256") in ("", row["setup"]["sha256"]))
        check(map_id + ": saved and safely returned", session.get("status") == "QA_SAVED"
              and session.get("returned_via_close_confirmation") and bool(session.get("saved_copies")))
        original = root / row["setup"]["path"]
        check(map_id + ": immutable original protected", sha(original) == row["setup"]["sha256"]
              == session.get("source_sha256_on_close"))
        original_recipe = strict_json(original.read_bytes())
        foreign = maps.get(attribution.get("foreign_source_map_id"), {})
        foreign_label = attribution.get("foreign_label", "")
        foreign_path = observed_profile / "workbench" / ("setup-" + foreign_label + ".json")
        check(map_id + ": unrelated named file never attributed to this source", foreign.get("setup", {}).get("sha256") == attribution.get("foreign_setup_sha256")
              and attribution.get("foreign_setup_sha256") != row["setup"]["sha256"] and foreign_path.is_file()
              and sha(foreign_path) == attribution.get("foreign_setup_sha256")
              and foreign_label not in {saved["label"] for saved in session.get("saved_copies", [])})
        saved_labels = {saved["label"] for saved in session.get("saved_copies", [])}
        check(map_id + ": reserved source namespace never recorded as an evaluation copy", not any(label.lower().startswith("gm-source-") for label in saved_labels))
        check(map_id + ": both actual ordinary save paths recorded", bool(attribution.get("ordinary_button_label"))
              and bool(attribution.get("keyboard_label")) and attribution["ordinary_button_label"] != attribution["keyboard_label"]
              and {attribution["ordinary_button_label"], attribution["keyboard_label"]} <= saved_labels)
        for saved in session.get("saved_copies", []):
            path = Path(saved["path"])
            valid = path.is_absolute() and path.resolve().is_relative_to((root / "userdata").resolve()) and path.is_file()
            check(map_id + ": exact authored named copy " + saved["label"], valid and sha(path) == saved["sha256"]
                  and strict_json(path.read_bytes()) == original_recipe)
        if not all(item["pass"] for item in checks):
            break
    for name in (".gdignore", "extension_list.cfg", "global_script_class_cache.cfg"):
        cache = root / "runtime/project/.godot" / name
        check("first-run copied exact portable bootstrap " + name, cache.is_file()
              and sha(cache) == sha(root / "runtime/bootstrap" / name))
    check("first-run launcher did not create owner decisions", not (root / "userdata/reviews/decisions.json").exists())
    check("all representative first-run cases executed", len(phases) == len(CASES))
    after = verify_directory(root, before["manifest_sha256"], post_execution=True)
    summary = {"schema": "goldmaps.fresh-windows-launcher.v1", "pass": all(row["pass"] for row in checks),
               "executed_source": executed_source,
               "package_before": before, "package_after": after, "launcher_sha256": sha(launcher),
               "godot_gui_sha256": sha(root / "Godot_v4.7-stable_win64.exe"),
               "engine_head": manifest["engine_head"], "checks": checks, "phases": phases,
               "caller_created_userdata": False, "initial_userdata_absent": True,
               "scope": "Actual freshly extracted Windows .cmd established profile/cache, opened a source original and the separate #183 policy descendant, used ordinary native Workbench and named authored saves, and returned safely. Headless representative first-run scope; no physical GPU, full-route or owner acceptance.",
               "owner_accepted": False}
    write_json(out / "summary.json", summary)
    print("GOLDMAPS_FRESH_LAUNCHER " + json.dumps({"pass": summary["pass"], "checks": len(checks), "cases": len(phases)}))
    return 0 if summary["pass"] else 1


def run_windows(command, log, env):
    import subprocess
    import time
    started = time.monotonic()
    with log.open("wb") as stream:
        process = subprocess.Popen(command, shell=False, stdout=stream, stderr=subprocess.STDOUT, stdin=subprocess.DEVNULL, env=env)
        expired = False
        try:
            code = process.wait(timeout=360)
        except subprocess.TimeoutExpired:
            expired = True
            subprocess.run(["taskkill", "/PID", str(process.pid), "/T", "/F"], stdout=subprocess.DEVNULL,
                           stderr=subprocess.DEVNULL, timeout=15, check=False)
            code = process.wait(timeout=15)
    return {"exit_code": code, "timeout": expired, "process_id": process.pid,
            "seconds": round(time.monotonic() - started, 3), "log_sha256": sha(log)}


if __name__ == "__main__":
    raise SystemExit(main())
