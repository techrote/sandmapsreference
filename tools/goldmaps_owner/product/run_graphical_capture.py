#!/usr/bin/env python3
"""Capture the actual shipped Windows gallery and ordinary native Workbench.

This intentionally invokes Open GOLDMAPS.cmd, without a headless switch, in an
already qualified disposable kit. It never substitutes image previews for a
rendered viewport. All output is flat and outside the immutable package; the
normal launcher writes only its portable userdata and Godot cache roots.
"""
from __future__ import annotations

import argparse
import ctypes
import datetime
import json
import os
from pathlib import Path
import platform
import shutil
import struct
import subprocess
import sys
import time

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "qualification"))
from verify_payload import file_sha256 as sha, strict_json, verify_directory

CASES = (
    ("gallery", None, "Default Gold25 collection, with the normal launch fitted to the usable desktop"),
    ("gallery-1280x720", None, "Default Gold25 collection at an explicit normal 1280x720 viewport"),
    ("gallery-1380x880", None, "Default Gold25 collection at an explicit larger 1380x880 viewport"),
    ("landscape", "gold-125", "Landscape Gold nominee; historic conditional and final support remain distinct"),
    ("portrait", "gold-197", "Portrait Gold nominee and unchanged Astra control source"),
    ("B3-original", "trial-B3-original", "B3 original; high-speed readability remains an owner question"),
    ("B3-candidate", "trial-B3-candidate", "B3 candidate; no new preference is inferred"),
    ("D1-original", "trial-D1-original", "D1 original; frozen assessor disagreement is preserved"),
    ("D1-candidate", "trial-D1-candidate", "D1 candidate; independent native session"),
    ("D1-reference", "trial-D1-reference", "D1 prior repair reference; independent native session"),
    ("D2-original", "trial-D2-original", "D2 original; frozen prior-reference preference is preserved"),
    ("D2-candidate", "trial-D2-candidate", "D2 candidate; no owner adoption is inferred"),
    ("D2-reference", "trial-D2-reference", "D2 prior repair reference; independent native session"),
    ("policy-155", "derived-155-policy", "Separate native-default descendant; original invalid policy remains refused"),
    ("policy-183", "derived-183-policy", "Separate native-default descendant outside Gold25"),
)

# These are concrete platform/renderer initialization failures. A timeout, a
# missing screenshot, a GDScript error or a refused map is never silently put
# in this category.
DISPLAY_FAILURES = (
    "your video card driver does not support any of the supported opengl versions",
    "opengl 3.3 is not supported",
    "failed to initialize opengl",
    "unable to initialize video driver",
    "unable to create an opengl window",
    "failed to create an opengl rendering context",
    "could not initialize opengl",
    "could not initialize angle opengl",
    "could not initialize native opengl",
    "failed to create native opengl window",
    "failed to create angle opengl window",
    "failed to initialize display server",
    "cannot initialize display server",
)


def write_json(path: Path, value: dict) -> None:
    path.write_bytes((json.dumps(value, indent=2, ensure_ascii=False) + "\n").encode("utf-8"))


def read_json(path: Path) -> dict:
    value = strict_json(path.read_bytes())
    if not isinstance(value, dict):
        raise ValueError("Expected an object: " + str(path))
    return value


def under(path: Path, root: Path) -> bool:
    return path.resolve().is_relative_to(root.resolve())


def png_identity(path: Path) -> dict:
    with path.open("rb") as stream:
        header = stream.read(33)
    if len(header) != 33 or header[:8] != b"\x89PNG\r\n\x1a\n" or header[12:16] != b"IHDR":
        raise ValueError("The rendered capture is not a PNG: " + str(path))
    width, height = struct.unpack(">II", header[16:24])
    if not (320 <= width <= 16384 and 200 <= height <= 16384):
        raise ValueError("Unexpected rendered viewport dimensions")
    return {"bytes": path.stat().st_size, "sha256": sha(path), "width": width, "height": height}


def capture_copy(record: dict, userdata: Path, target: Path) -> dict:
    source = Path(record["path"])
    if not under(source, userdata) or not source.is_file() or sha(source) != record.get("sha256"):
        raise ValueError("Rendered capture path or digest is not the recorded portable output")
    if record.get("display_driver") in (None, "", "headless"):
        raise ValueError("A headless or unlabelled result cannot establish displayed execution")
    shutil.copyfile(source, target)
    return {**record, "original_portable_path": str(source), "path": target.name, **png_identity(target)}


def recorded_capture_exists(record: dict, userdata: Path) -> bool:
    try:
        source = Path(record["path"])
        return (under(source, userdata) and source.is_file() and sha(source) == record.get("sha256")
                and record.get("display_driver") not in (None, "", "headless")
                and bool(png_identity(source)))
    except (KeyError, OSError, TypeError, ValueError):
        return False


def desktop_observation() -> dict:
    if os.name != "nt":
        return {"platform": platform.platform(), "native_windows": False}
    try:
        user32 = ctypes.windll.user32
        return {"native_windows": True, "width": user32.GetSystemMetrics(0),
                "height": user32.GetSystemMetrics(1),
                "scope": "Windows desktop metrics only; actual viewport evidence is checked separately"}
    except Exception as error:
        return {"native_windows": True, "metrics_error": str(error)}


def run_case(package: Path, out: Path, name: str, map_id: str | None, purpose: str,
             row: dict | None, manifest: dict, timeout: int) -> dict:
    userdata = package / "userdata"
    sessions = userdata / "sessions"
    sessions.mkdir(parents=True, exist_ok=True)
    previous = set(sessions.glob("*.json"))
    previous_logs = set(sessions.glob("*.log"))
    # Only stale developer capture outputs are removed. Owner review records and
    # saved copies are left intact; no immutable input is ever edited here.
    for old in (userdata / "qa/browser.png", userdata / "qa/browser-graphical.json"):
        old.unlink(missing_ok=True)
    env = os.environ.copy()
    for key in ("GOLDMAPS_QA_HEADLESS", "GOLDMAPS_QA_MAP", "GOLDMAPS_QA_SMOKE", "GOLDMAPS_QA_VIEWPORT",
                "GOLDMAPS_QA_EDIT", "GOLDMAPS_BROWSER_QA_PHASE"):
        env.pop(key, None)
    env["GOLDMAPS_QA_CAPTURE"] = "1"
    if name == "gallery-1280x720":
        env["GOLDMAPS_QA_VIEWPORT"] = "1280x720"
    elif name == "gallery-1380x880":
        env["GOLDMAPS_QA_VIEWPORT"] = "1380x880"
    if map_id is not None:
        env.update(GOLDMAPS_QA_MAP=map_id, GOLDMAPS_QA_SMOKE="1")
    executable = os.environ.get("COMSPEC", r"C:\Windows\System32\cmd.exe")
    launcher = package / "Open GOLDMAPS.cmd"
    if '"' in str(launcher) or '"' in executable:
        raise ValueError("Invalid Windows launcher path")
    # /s strips one outer quote pair, preserving the quote pair around a batch
    # path containing spaces. shell=False avoids an additional shell layer.
    command = f'"{executable}" /d /s /c ""{launcher}""'
    process_log = out / (name + "-process.log")
    result = {"name": name, "map_id": map_id, "purpose": purpose,
              "engine_head": manifest["engine_head"],
              "delivery_source_head": manifest.get("delivery_source_head"),
              "source": (row or {}).get("source"), "derived_source": (row or {}).get("derived_source"),
              "setup_sha256": (row or {}).get("setup", {}).get("sha256"),
              "material_plane_sha256": (row or {}).get("setup", {}).get("material_plane_sha256"),
              "launcher": str(launcher), "command": command, "headless": False,
              "started_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
              "status": "STARTING", "product_defect": False, "captures": []}
    started = time.monotonic()
    with process_log.open("wb") as stream:
        process = subprocess.Popen(command, shell=False, cwd=package, env=env,
                                   stdout=stream, stderr=subprocess.STDOUT, stdin=subprocess.DEVNULL)
        result["launcher_process_id"] = process.pid
        try:
            result["exit_code"] = process.wait(timeout=timeout)
            result["timeout"] = False
        except subprocess.TimeoutExpired:
            result["timeout"] = True
            subprocess.run(["taskkill", "/PID", str(process.pid), "/T", "/F"],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=15)
            result["exit_code"] = process.wait(timeout=15)
    result["seconds"] = round(time.monotonic() - started, 3)
    logs = process_log.read_text(encoding="utf-8-sig", errors="replace")
    browser_log = userdata / "browser.log"
    if browser_log.is_file():
        shutil.copyfile(browser_log, out / (name + "-browser.log"))
        logs += "\n" + browser_log.read_text(encoding="utf-8-sig", errors="replace")
    new_sessions = sorted(set(sessions.glob("*.json")) - previous)
    result["new_session_count"] = len(new_sessions)
    receipts = []
    for index, source in enumerate(new_sessions):
        destination = out / (name + ("" if len(new_sessions) == 1 else "-" + str(index)) + "-session.json")
        shutil.copyfile(source, destination)
        session = read_json(source)
        receipts.append(session)
    native_logs = ""
    for index, source_log in enumerate(sorted(set(sessions.glob("*.log")) - previous_logs)):
        destination = out / (name + "-native-" + str(index) + ".log")
        shutil.copyfile(source_log, destination)
        native_logs += "\n" + source_log.read_text(encoding="utf-8-sig", errors="replace")
    logs += native_logs
    lower = logs.lower()
    hard_error = any(token in lower for token in ("script error:", "parse error:", "goldmaps_session_refused"))
    gallery_receipt_path = userdata / "qa/browser-graphical.json"
    gallery_record = read_json(gallery_receipt_path) if gallery_receipt_path.is_file() else {}
    gallery_exists = recorded_capture_exists(gallery_record, userdata)
    native_exists = any(recorded_capture_exists(capture, userdata)
                        for session in receipts for capture in session.get("screenshots", []))
    # A native OpenGL failure followed by successful ANGLE fallback is a
    # captured result. Once the gallery rendered, only the new native process
    # logs may explain an absent native viewport; an earlier browser warning
    # must not excuse a later product failure.
    missing_capture = not gallery_exists or (map_id is not None and not native_exists)
    display_text = native_logs.lower() if gallery_exists and map_id is not None else lower
    display_error = next((phrase for phrase in DISPLAY_FAILURES if phrase in display_text), None)
    if missing_capture and display_error and not hard_error:
        result.update(status="UNAVAILABLE_DISPLAY", display_limitation=display_error,
                      scope="Actual launcher attempted; renderer/display initialization failed; no graphical pass")
        write_json(out / (name + "-result.json"), result)
        return result
    try:
        if result["timeout"] or result["exit_code"] != 0:
            raise ValueError("Actual displayed launcher timed out or exited unsuccessfully")
        if hard_error:
            raise ValueError("Actual displayed process reported a script or native admission error")
        gallery = gallery_record
        if gallery.get("schema") != "goldmaps.browser-graphical.v1":
            raise ValueError("Missing actual gallery capture receipt")
        if (gallery.get("active_collection") != "gold25" or gallery.get("visible_maps") != 25
                or not gallery.get("selected_id") or gallery.get("engine_head") != manifest["engine_head"]):
            raise ValueError("Initial gallery did not visibly select the source-matched Gold25 collection")
        result["captures"].append(capture_copy(gallery, userdata, out / (name + "-gallery.png")))
        if map_id is None:
            if receipts:
                raise ValueError("Gallery-only execution unexpectedly opened a native World")
        else:
            if len(receipts) != 1:
                raise ValueError("Expected exactly one native Workbench session")
            session = receipts[0]
            native = session.get("native_load", {})
            expected_actors = [{"id": int(a["id"]), "model": a["model"]} for a in native.get("actors", [])]
            if expected_actors != native.get("actors_adopted"):
                raise ValueError("Authored actors were not adopted in the displayed World")
            if (session.get("map_id") != map_id or session.get("engine_head") != manifest["engine_head"]
                    or session.get("original_setup_sha256") != row["setup"]["sha256"]
                    or session.get("source_sha256_on_close") != row["setup"]["sha256"]
                    or session.get("status") != "QA_SAVED" or not native.get("full_grid_match")
                    or not native.get("ordinary_workbench")
                    or native.get("material_plane_sha256") != row["setup"]["material_plane_sha256"]
                    or not session.get("returned_via_close_confirmation")):
                raise ValueError("Displayed session source/native/save-return identity failed")
            if not under(Path(session["user_data_dir"]), userdata):
                raise ValueError("Displayed Workbench escaped its portable profile")
            screenshots = session.get("screenshots", [])
            if not screenshots:
                raise ValueError("Native Workbench did not produce an actual rendered screenshot")
            result["captures"].append(capture_copy(screenshots[0], userdata, out / (name + "-workbench.png")))
            result["native_session"] = {"session_id": session["session_id"], "process_id": session["process_id"],
                                        "native_load": native, "qa_lifecycle": session.get("qa_lifecycle"),
                                        "saved_copies": session.get("saved_copies", []),
                                        "godot_version": session.get("godot_version"),
                                        "user_data_dir": session["user_data_dir"]}
        result.update(status="CAPTURED", scope="Actual hosted rendered viewport and source-bound execution; no physical NVIDIA, subjective flight-speed or owner classification acceptance")
    except (OSError, KeyError, TypeError, ValueError) as error:
        result.update(status="FAILED", product_defect=True, error=str(error))
    write_json(out / (name + "-result.json"), result)
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--package", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--timeout", type=int, default=150)
    args = parser.parse_args()
    package, out = args.package.resolve(), args.out.resolve()
    if under(out, package) or out.exists() or not 30 <= args.timeout <= 600:
        raise ValueError("Use a new output directory outside the package and a bounded timeout")
    out.mkdir(parents=True)
    summary = {"schema": "goldmaps.owner-graphical-capture.v1", "platform": platform.platform(),
               "github_run_id": os.environ.get("GITHUB_RUN_ID"), "desktop": desktop_observation(),
               "product_defect": False, "environmental_display_limitation": False,
               "owner_accepted": False, "physical_windows_nvidia": "OWNER_PENDING", "cases": [],
               "scope": "Actual shipped Windows launcher and hosted rendered gallery/ordinary Workbench; programmatic navigation/save; subjective gameplay and owner acceptance remain pending"}
    try:
        if os.name != "nt":
            summary.update(status="UNAVAILABLE_PLATFORM", environmental_display_limitation=True,
                           limitation="This campaign requires native Windows and did not execute on this platform")
            return 2
        before = verify_directory(package, post_execution=True)
        manifest = read_json(package / "payload-manifest.v1.json")
        roster = read_json(package / "collection/collection.v1.json")
        overlay = read_json(package / "collection/delivery-qualification.v1.json")
        if overlay["engine_head"] != manifest["engine_head"]:
            raise ValueError("Mixed source/native qualification authorities")
        maps = {row["id"]: row for row in roster["maps"]}
        summary.update(engine_head=manifest["engine_head"], delivery_source_head=manifest.get("delivery_source_head"),
                       payload_manifest_sha256=before["manifest_sha256"],
                       godot_gui_sha256=sha(package / "Godot_v4.7-stable_win64.exe"),
                       launcher_sha256=sha(package / "Open GOLDMAPS.cmd"))
        for name, map_id, purpose in CASES:
            row = maps[map_id] if map_id else None
            if row and overlay["setups"].get(row["setup"]["sha256"], {}).get("status") != "QUALIFIED_HEADLESS":
                raise ValueError("Required graphical target is not native-qualified: " + map_id)
            result = run_case(package, out, name, map_id, purpose, row, manifest, args.timeout)
            summary["cases"].append(result)
            print("GOLDMAPS_GRAPHICAL_CASE " + json.dumps({key: result.get(key) for key in ("name", "map_id", "status", "product_defect", "seconds")}), flush=True)
            if result["product_defect"]:
                summary.update(product_defect=True, status="FAILED")
                break
            if result["status"] == "UNAVAILABLE_DISPLAY":
                summary.update(environmental_display_limitation=True, status="PARTIAL_DISPLAY_LIMITATION",
                               limitation=result["display_limitation"])
                break
        summary["package_after"] = verify_directory(package, before["manifest_sha256"], post_execution=True)
        summary["captured_cases"] = sum(case["status"] == "CAPTURED" for case in summary["cases"])
        summary["planned_cases"] = len(CASES)
        summary["not_executed"] = [{"name": name, "map_id": map_id} for name, map_id, _ in CASES[len(summary["cases"]):]]
        if not summary["product_defect"] and not summary["environmental_display_limitation"]:
            summary["status"] = "CAPTURED_ALL_PLANNED"
        return 1 if summary["product_defect"] else (2 if summary["environmental_display_limitation"] else 0)
    except Exception as error:
        summary.update(status="FAILED", product_defect=True, error=str(error))
        return 1
    finally:
        write_json(out / "summary.json", summary)
        print("GOLDMAPS_GRAPHICAL_SUMMARY " + json.dumps({key: summary.get(key) for key in ("status", "product_defect", "environmental_display_limitation", "captured_cases", "planned_cases")}), flush=True)


if __name__ == "__main__":
    raise SystemExit(main())
