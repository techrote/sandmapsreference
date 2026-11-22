#!/usr/bin/env python3
"""Windows-only qualification of the extracted frozen owner package.

The accepted owner project is never executed or edited. A separate runtime
copy uses the accepted source and exact Windows libraries with a new project
configuration, like the preceding Linux harness. The GDScript is unchanged.
"""
from pathlib import Path
import argparse
import datetime
import hashlib
import json
import os
import shutil
import subprocess
import time
import uuid

from acquire_package import checked_manifest, relative, sha, verify

HARN = "a9a904a4a76c28b8615713c0914381b2916fefcd0f60da9489e9aa18ebf6774a"
HELPER = "4a5e4a2325ac5ec3cf032d7558e9cd684a923bcb8958a92e48d6aa82a0b6ee10"
PINS = {
    "C1": "ad9e041f0eb35bbfd2a97a74ba55cd65925fbeeef79b9ef39b2dfd55a3494789",
    "C2": "93157e701976742f1d249bae47b729d4204784e0b380dfb295b0dc053b863ed4",
    "C3": "7ec7f34816e66bb1f384e198bce6ec41c5ef8b89e601b1daadcf219ff393a67e",
    "B1": "c232c64806a78be32ec5ce86285a7f22ddf703c50a123762d59812e0233e6a4c",
    "B2": "73870c681bb793573fa6bc1e400f97ddcece22e2a90ca4cbddfcdda9ad043f62",
    "B3": "ba648b6d3b187d1d85c796993e9c1eb8122bb629f97bf41200ac82779619f315",
    "D1": "7c1d155a7f647709f0a7fade25ef6981c26fb1fdcfacb492ae1c60b4407a6aab",
    "D2": "0d4c0ad6181b3c99c89f05063e69e2afc27074f4c373566be63c10122b0394bc",
}


def run_child(argv, log, deadline, env=None, maximum=150):
    remaining = deadline - time.monotonic()
    if remaining < 1:
        raise TimeoutError("Bounded Windows qualification deadline exhausted")
    start = time.monotonic()
    with log.open("wb") as out:
        child = subprocess.Popen(list(map(str, argv)), env=env, stdout=out, stderr=subprocess.STDOUT)
        timed_out = False
        try:
            code = child.wait(timeout=min(maximum, remaining))
        except subprocess.TimeoutExpired:
            timed_out = True
            subprocess.run(["taskkill", "/PID", str(child.pid), "/T", "/F"],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=False)
            code = child.wait(timeout=15)
    content = log.read_text(encoding="utf-8-sig", errors="replace")
    # Keep exact runtime evidence in public job logs; no billable artifact upload.
    print("GOLD_WINDOWS_LOG_BEGIN " + log.name, flush=True)
    print(content, flush=True)
    print("GOLD_WINDOWS_LOG_END " + log.name, flush=True)
    return {"exit_code": code, "wrapper_pid": child.pid, "timeout": timed_out,
            "wall_seconds": round(time.monotonic()-start, 3), "log_sha256": sha(log)}, content


def extract_record(text, prefix):
    records = [json.loads(s[len(prefix):]) for s in text.splitlines() if s.startswith(prefix)]
    if not records:
        raise ValueError("Missing runtime evidence: " + prefix)
    return records[-1]


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--package-root", type=Path, required=True)
    ap.add_argument("--manifest", type=Path, required=True)
    ap.add_argument("--manifest-sha256", required=True)
    ap.add_argument("--out", type=Path, required=True)
    args = ap.parse_args()
    if os.name != "nt":
        raise RuntimeError("Windows-only harness; Linux does not qualify this package")
    package = args.package_root.resolve()
    manifest_path = args.manifest.resolve()
    m = checked_manifest(manifest_path, args.manifest_sha256)
    before = verify(package, m, manifest_path)
    if not before["pass"]:
        raise ValueError("Extracted package is not the pinned input")
    out = args.out.resolve()
    if out.exists():
        raise ValueError("Refuse to overwrite Windows qualification output")
    out.mkdir(parents=True)
    deadline = time.monotonic() + 14*60
    ex = {k: package / str(relative(v)) for k, v in m["execution"].items()}
    if sha(ex["harness"]) != HARN or sha(ex["helper"]) != HELPER:
        raise ValueError("Reviewed harness/helper identity differs")
    owner = json.loads(ex["owner_manifest"].read_text(encoding="utf-8-sig"))
    candidates = [row for row in owner["maps"] if row["variant"] == "candidate"]
    if len(candidates) != 8 or {row["arm"] for row in candidates} != set(PINS):
        raise ValueError("Expected exactly the eight locked selected candidates")
    by_arm = {row["arm"]: row for row in candidates}
    for arm, row in by_arm.items():
        if row["setup_sha256"] != PINS[arm] or sha(package / str(relative(row["setup_path"]))) != PINS[arm]:
            raise ValueError("Locked candidate hash mismatch: " + arm)
    powershell = Path(os.environ["WINDIR"]) / "System32/WindowsPowerShell/v1.0/powershell.exe"
    if not powershell.is_file():
        raise ValueError("Actual Windows PowerShell5.1 is unavailable")
    helper_phase, _ = run_child([
        powershell, "-NoProfile", "-NonInteractive", "-File",
        Path(__file__).with_name("Invoke-HelperTests.ps1"), "-HelperPath", ex["helper"],
        "-TestsPath", ex["helper_tests"], "-OutputPath", out/"helper-tests.json"],
        out/"helper-tests.log", deadline, maximum=120)
    helper_result = json.loads((out/"helper-tests.json").read_text(encoding="utf-8-sig")) if (out/"helper-tests.json").exists() else None

    # Owner package source stays unchanged. Only this independent copy gets a
    # new project.godot and two added test scripts; accepted source stays exact.
    project = out/"runtime-project"
    shutil.copytree(ex["project"], project, ignore=shutil.ignore_patterns(".godot", "project.godot"))
    nonce = uuid.uuid4().hex[:8]
    project_name = "GOLD-ASTRA-001 Windows qualification " + nonce
    config = ('config_version=5\n\n[application]\nconfig/name=' + json.dumps(project_name) +
              '\nconfig/features=PackedStringArray("4.7")\n\n[autoload]\n'
              'FeatureNavigation="*res://scripts/feature_navigation.gd"\n\n[physics]\n'
              '2d/physics_engine="Rapier2D"\n\n[rendering]\nrenderer/rendering_method="gl_compatibility"\n')
    (project/"project.godot").write_text(config, encoding="utf-8")
    shutil.copyfile(ex["harness"], project/"gold-native-admission.gd")
    shutil.copyfile(ex["preflight"], project/"gold-owner-preflight.gd")
    source_before = {p.relative_to(project).as_posix(): sha(p) for p in project.rglob("*") if p.is_file()}
    import_phase, _ = run_child([ex["godot"], "--headless", "--path", project, "--import"],
                                out/"import.log", deadline, maximum=180)
    if import_phase["exit_code"] != 0:
        raise RuntimeError("Fresh copied project resource import failed")
    preflight_phase, text = run_child([ex["godot"], "--headless", "--path", project,
                                      "--script", "res://gold-owner-preflight.gd"],
                                     out/"preflight.log", deadline, maximum=45)
    preflight = extract_record(text, "GOLD_ASTRA_OWNER_PREFLIGHT=")
    workbench = Path(preflight["workbench_dir"])
    if preflight_phase["exit_code"] or not preflight["native_bridge_class_registered"]:
        raise RuntimeError("Actual Windows native bridge preflight failed")
    if project_name not in workbench.parts or not workbench.is_dir() or any(workbench.iterdir()):
        raise RuntimeError("Godot did not report a fresh isolated qualification Workbench directory")
    results = []
    for arm in PINS:
        row = by_arm[arm]
        source = package / str(relative(row["setup_path"]))
        label = "gold-astra-001-win-" + arm.lower() + "-" + nonce
        saved = label + "-saved"
        install, _ = run_child([
            powershell, "-NoProfile", "-NonInteractive", "-File", ex["helper"],
            "-ManifestPath", ex["owner_manifest"], "-Arm", arm, "-Variant", "candidate",
            "-WorkbenchDir", workbench, "-Label", label, "-EngineRoot", ex["project"],
            "-GodotExe", ex["godot"]], out/(arm+".install.log"), deadline, maximum=45)
        staged = workbench/("setup-"+label+".json")
        if install["exit_code"] or not staged.is_file() or sha(staged) != PINS[arm]:
            raise RuntimeError("Real helper failed selected-map exact staging: " + arm)
        result = {"arm": arm, "setup_sha256": PINS[arm], "install": install, "phases": {}}
        for phase in ("load", "reopen"):
            env = os.environ.copy()
            env.update({"CYBERSAND_ADMISSION_LABEL": label, "CYBERSAND_ADMISSION_PHASE": phase,
                        "CYBERSAND_ADMISSION_SAVED_LABEL": saved})
            rec, text = run_child([ex["godot"], "--headless", "--path", project,
                                   "--script", "res://gold-native-admission.gd"],
                                  out/(arm+"."+phase+".log"), deadline, env)
            try:
                rec["evidence"] = extract_record(text, "CANVAS_NATIVE_EVIDENCE ")
            except ValueError:
                rec["evidence"] = None
            result["phases"][phase] = rec
            if phase == "load" and (rec["exit_code"] or not (workbench/("setup-"+saved+".json")).is_file()):
                break
        savedpath = workbench/("setup-"+saved+".json")
        source_data = json.loads(source.read_text(encoding="utf-8-sig"))
        saved_data = json.loads(savedpath.read_text(encoding="utf-8-sig")) if savedpath.exists() else None
        load = result["phases"].get("load", {})
        reopen = result["phases"].get("reopen", {})
        le = load.get("evidence") or {}
        re = reopen.get("evidence") or {}
        result.update({"source_unchanged": sha(source) == PINS[arm],
                       "staged_source_unchanged": sha(staged) == PINS[arm],
                       "saved_setup_semantic_equal": saved_data == source_data,
                       "saved_actors_equal": saved_data is not None and saved_data.get("actors") == source_data.get("actors"),
                       "saved_setup_sha256": sha(savedpath) if savedpath.exists() else None,
                       "separate_processes": bool(reopen) and load.get("wrapper_pid") != reopen.get("wrapper_pid"),
                       "collision_observed": bool(le.get("collision_observed"))})
        required = ("native_bridge", "load", "full_grid", "actor_adopted", "physics_tick", "midge_drive", "save_readback")
        result["basic_native_pass"] = bool(load.get("exit_code") == 0 and reopen.get("exit_code") == 0
            and all(le.get(k) for k in required) and re.get("fresh_reopen")
            and result["saved_setup_semantic_equal"] and result["saved_actors_equal"]
            and result["source_unchanged"] and result["separate_processes"]
            and result["saved_setup_sha256"] == re.get("setup_sha256"))
        (out/(arm+".receipt.json")).write_text(json.dumps(result, indent=2)+"\n")
        results.append(result)
        print("GOLD_WINDOWS_MAP_RECEIPT " + json.dumps(result), flush=True)
    after = verify(package, m, manifest_path)
    changed_runtime_source = [name for name, digest in source_before.items() if sha(project/name) != digest]
    summary = {"schema_version": 1, "created_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
               "platform": "Windows", "runner_image_os": os.environ.get("ImageOS"),
               "runner_image_version": os.environ.get("ImageVersion"),
               "github_run_id": os.environ.get("GITHUB_RUN_ID"),
               "github_sha": os.environ.get("GITHUB_SHA"),
               "manifest_sha256": sha(manifest_path), "harness_sha256": HARN,
               "helper_sha256": HELPER, "project_config_sha256": sha(project/"project.godot"),
               "helper_suite": helper_result, "resource_import": import_phase, "preflight": preflight,
               "package_before": before, "package_after": after,
               "runtime_source_files_checked": len(source_before), "runtime_source_changes": changed_runtime_source,
               "runtime_generated_cache_file_count": sum(p.is_file() for p in (project/".godot").rglob("*")),
               "cache_scope": "Accepted package .godot files remain byte-identical and are omitted from the runtime copy; --import regenerates runtime-only caches, separate from accepted source.",
               "results": results,
               "scope": "Hosted Windows headless exact-package source copy; no owner-machine, GUI, complete route or machinery-operation acceptance."}
    summary["pass"] = bool(helper_phase["exit_code"] == 0 and helper_result and helper_result["pass"]
        and len(results) == 8 and all(x["basic_native_pass"] and x["collision_observed"] for x in results)
        and after["pass"] and not changed_runtime_source)
    (out/"summary.json").write_text(json.dumps(summary, indent=2)+"\n")
    print("GOLD_WINDOWS_SUMMARY " + json.dumps(summary), flush=True)
    if os.environ.get("GITHUB_STEP_SUMMARY"):
        with open(os.environ["GITHUB_STEP_SUMMARY"], "a", encoding="utf-8") as f:
            f.write("## GOLD-ASTRA-001 bounded Windows qualification\n\n")
            f.write("Status: **" + ("PASS" if summary["pass"] else "FAIL") + "**.\n\n")
            f.write("Manifest: `"+sha(manifest_path)+"`\n\n")
            f.write("Actual Windows PowerShell5.1 suite; eight selected candidate loads, contacts, saves and fresh-process reopens. Full evidence is in the job log; no artifact or cache upload. Owner acceptance remains pending.\n")
    return 0 if summary["pass"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
