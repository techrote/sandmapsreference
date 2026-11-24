#!/usr/bin/env python3
"""Qualify exact bundled Setups through the delivered ordinary Workbench.

This is new delivery evidence. Frozen GOLD-ASTRA evidence and classifications
are not rewritten. Each unique Setup executes in two independent Godot
processes; aliases share bytes and receipts, never owner decisions. Native
material identity, actor adoption, progression, movement/contact, authored-save
readback and fresh-process reopen are distinct gates.
"""
from __future__ import annotations

import argparse
import concurrent.futures
import datetime
import hashlib
import json
import os
from pathlib import Path
import platform
import shutil
import subprocess
import time
import uuid

from verify_payload import MANIFEST, file_sha256 as sha, safe_path, strict_json, verify_directory

HERE = Path(__file__).resolve().parent
FROZEN = "662df51cd8409a52332fa7ef15d06d8ab8945aed"


def write_json(path, value):
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    Path(path).write_text(json.dumps(value, indent=2) + "\n", encoding="utf-8")


def run(argv, log, env, timeout=240):
    started = time.monotonic()
    with log.open("wb") as stream:
        proc = subprocess.Popen(list(map(str, argv)), stdout=stream, stderr=subprocess.STDOUT, env=env)
        expired = False
        try:
            code = proc.wait(timeout=timeout)
        except subprocess.TimeoutExpired:
            expired = True
            if os.name == "nt":
                subprocess.run(["taskkill", "/PID", str(proc.pid), "/T", "/F"],
                               stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=False)
            else:
                proc.kill()
            code = proc.wait(timeout=15)
    return {"exit_code": code, "timeout": expired, "process_id": proc.pid,
            "seconds": round(time.monotonic() - started, 3), "log_sha256": sha(log)}, log.read_text(encoding="utf-8-sig", errors="replace")


def record(text, prefix):
    rows = [json.loads(line[len(prefix):]) for line in text.splitlines() if line.startswith(prefix)]
    return rows[-1] if rows else None


def profile_environment(root):
    env = os.environ.copy()
    paths = {"APPDATA": "roaming", "LOCALAPPDATA": "local", "XDG_DATA_HOME": "data",
             "XDG_CONFIG_HOME": "config", "XDG_CACHE_HOME": "cache", "TEMP": "temp", "TMP": "temp",
             "TMPDIR": "temp", "MESA_SHADER_CACHE_DIR": "mesa"}
    for key, suffix in paths.items():
        path = root / suffix
        path.mkdir(parents=True, exist_ok=True)
        env[key] = str(path)
    env["GOLDMAPS_EXPECTED_PROFILE_ROOT"] = str(root)
    return env


def source_identity():
    repo = HERE.parents[2]
    paths = [HERE / name for name in ("run_native_collection.py", "native_probe.gd", "profile_probe.gd", "verify_payload.py")]
    result = {"checkout_head": None, "files_match_commit": False,
              "files": {p.relative_to(repo).as_posix(): sha(p) for p in paths}}
    try:
        head = subprocess.check_output(["git", "-C", str(repo), "rev-parse", "HEAD"], text=True).strip()
        result["checkout_head"] = head
        matches = []
        for path in paths:
            blob = subprocess.check_output(["git", "-C", str(repo), "show", head + ":" + path.relative_to(repo).as_posix()], stderr=subprocess.DEVNULL)
            matches.append(hashlib.sha256(blob).hexdigest() == sha(path))
        result["files_match_commit"] = all(matches)
    except (OSError, subprocess.CalledProcessError):
        pass
    expected = os.environ.get("GOLDMAPS_TEST_SOURCE_HEAD")
    if expected and (result["checkout_head"] != expected or not result["files_match_commit"]):
        raise ValueError("actual qualification source differs from requested commit")
    return result


def verify_companion(package, project, manifest):
    """Linux companion may add native .so files; all shipped source stays exact."""
    comparisons = 0
    for row in manifest["files"]:
        if not row["path"].startswith("runtime/project/"):
            continue
        relative = row["path"][len("runtime/project/"):]
        path = project / relative
        if not path.is_file() or sha(path) != row["sha256"]:
            raise ValueError("companion differs from shipped runtime file: " + relative)
        comparisons += 1
    natives = []
    for name in ("cybersand_native", "godot-rapier2d"):
        provenance_path = project / "addons" / name / "runtime-provenance.linux.json"
        provenance = strict_json(provenance_path.read_bytes())
        relative = Path(provenance["artifact"]).relative_to("godot")
        binary = project / relative
        if not binary.is_file() or sha(binary) != provenance["sha256"]:
            raise ValueError("Linux companion differs from source-pinned native provenance: " + name)
        natives.append({"path": relative.as_posix(), "sha256": sha(binary), "provenance_sha256": sha(provenance_path)})
    return {"kind": "separate Linux companion", "shipped_runtime_files_verified": comparisons,
            "native_libraries": natives, "claim": "Linux evidence only; not Windows launcher or GPU evidence"}


def prepare_bootstraps(package, project, file_index):
    """Mirror the shipped launcher; editor import would mutate static source."""
    names = (".gdignore", "extension_list.cfg", "global_script_class_cache.cfg")
    cache = project / ".godot"
    cache.mkdir(exist_ok=True)
    receipts = []
    for name in names:
        relative = "runtime/bootstrap/" + name
        if relative not in file_index:
            raise ValueError("source-bound portable bootstrap missing: " + name)
        source = package / relative
        if sha(source) != file_index[relative]["sha256"]:
            raise ValueError("portable bootstrap bytes differ: " + name)
        destination = cache / name
        shutil.copyfile(source, destination)
        receipts.append({"path": relative, "sha256": sha(source), "copied_sha256": sha(destination)})
    return {"pass": True, "method": "copy the three accepted portable Godot bootstrap files; no editor import",
            "files": receipts}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--package", type=Path, required=True)
    parser.add_argument("--godot", type=Path, required=True)
    parser.add_argument("--godot-sha256", help="Required for an external, source-pinned Linux Godot binary")
    parser.add_argument("--engine-head", required=True)
    parser.add_argument("--manifest-sha256")
    parser.add_argument("--linux-project", type=Path)
    parser.add_argument("--inputs", default="collection/native-inputs.v1.json")
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--ids", help="Comma-separated aliases; omitted means the full declared delivery campaign")
    parser.add_argument("--jobs", type=int, default=1, choices=(1, 2, 3, 4))
    parser.add_argument("--routes", type=Path)
    args = parser.parse_args()
    package, godot, out = args.package.resolve(), args.godot.resolve(), args.out.resolve()
    if out.exists():
        raise ValueError("refuse to overwrite qualification evidence")
    before = verify_directory(package, args.manifest_sha256, post_execution=True)
    manifest = strict_json((package / MANIFEST).read_bytes())
    if manifest["engine_head"] != args.engine_head:
        raise ValueError("package engine differs from requested accepted engine")
    file_index = {row["path"]: row for row in manifest["files"]}
    if godot.is_relative_to(package):
        relative = godot.relative_to(package).as_posix()
        if relative not in file_index or sha(godot) != file_index[relative]["sha256"]:
            raise ValueError("Godot is not an immutable packaged executable")
    elif not args.godot_sha256 or sha(godot) != args.godot_sha256 or os.name == "nt":
        raise ValueError("external Godot requires explicit Linux executable SHA-256")
    input_path = package / safe_path(args.inputs)
    if args.inputs not in file_index:
        raise ValueError("native input roster is outside the payload manifest")
    inputs = strict_json(input_path.read_bytes())
    if inputs["engine_head"] != args.engine_head:
        raise ValueError("native input roster claims a different engine")
    records = inputs["records"]
    all_records = records
    if args.ids:
        selected = set(args.ids.split(","))
        records = [row for row in records if row["id"] in selected]
        if {row["id"] for row in records} != selected:
            raise ValueError("unknown input alias")
    if not records or len({row["id"] for row in records}) != len(records):
        raise ValueError("empty or duplicate logical input IDs")
    groups = {}
    for row in records:
        safe_path(row["id"])
        path = safe_path(row["package_path"])
        if path not in file_index or file_index[path]["sha256"] != row["setup_sha256"] or file_index[path]["bytes"] != row["setup_bytes"]:
            raise ValueError("native input differs from immutable payload: " + row["id"])
        groups.setdefault(row["setup_sha256"], []).append(row)
    for aliases in groups.values():
        expected = aliases[0].get("expected_native_refusal")
        if any(row.get("expected_native_refusal") != expected for row in aliases):
            raise ValueError("byte-identical aliases claim different native eligibility")
    project = package / "runtime/project"
    companion = None
    if args.linux_project:
        if os.name == "nt":
            raise ValueError("Windows qualification must execute the shipped project")
        project = args.linux_project.resolve()
        companion = verify_companion(package, project, manifest)
    out.mkdir(parents=True)
    source = source_identity()
    nonce = uuid.uuid4().hex[:10]
    profile_root = package / "userdata" / ("qualification-" + nonce)
    env = profile_environment(profile_root)
    bootstrap_receipt = prepare_bootstraps(package, project, file_index)
    pre, text = run([godot, "--headless", "--path", project, "--script", HERE / "profile_probe.gd"], out / "profile.log", env, 60)
    profile = record(text, "GOLDMAPS_PROFILE ")
    if pre["exit_code"] or not profile or not profile["isolated"] or not profile["native_bridge"]:
        raise RuntimeError("actual native runtime or isolated Godot user-data routing failed")
    version = profile["godot_version"]
    if (version.get("major"), version.get("minor"), version.get("patch"), version.get("status")) != (4, 7, 0, "stable"):
        raise ValueError("qualification requires exact Godot 4.7 stable, not an adjacent release")
    workbench = Path(profile["workbench_dir"]).resolve()
    if not workbench.is_relative_to(profile_root.resolve()) or any(workbench.iterdir()):
        raise ValueError("refuse nonempty or incorrectly routed native profile")

    def qualify(item):
        digest, aliases = item
        case_id = aliases[0]["id"]
        label = "gm-" + nonce + "-" + digest[:12]
        saved = label + "-saved"
        original = package / aliases[0]["package_path"]
        staged = workbench / ("setup-" + label + ".json")
        with staged.open("xb") as stream:
            stream.write(original.read_bytes())
        result = {"id": case_id, "aliases": [row["id"] for row in aliases],
                  "setup_sha256": digest, "source_records": aliases, "phases": {}}
        for phase in ("load", "reopen"):
            phase_env = env.copy()
            phase_env.update(CYBERSAND_ADMISSION_LABEL=label, CYBERSAND_ADMISSION_SAVED_LABEL=saved, CYBERSAND_ADMISSION_PHASE=phase)
            tick_limit = max(int(row.get("contact_probe_tick_limit", 900)) for row in aliases)
            if tick_limit not in (900, 1800):
                raise ValueError("unreviewed contact continuation budget")
            phase_env["GOLDMAPS_CONTACT_TICK_LIMIT"] = str(tick_limit)
            receipt, text = run([godot, "--headless", "--path", project, "--script", HERE / "native_probe.gd"],
                                out / (case_id + "." + phase + ".log"), phase_env, 300)
            receipt["evidence"] = record(text, "CANVAS_NATIVE_EVIDENCE ")
            result["phases"][phase] = receipt
            if receipt["exit_code"] or not (workbench / ("setup-" + saved + ".json")).is_file():
                break
        savedpath = workbench / ("setup-" + saved + ".json")
        saveddata = strict_json(savedpath.read_bytes()) if savedpath.exists() else None
        result["saved_setup_semantic_equal"] = saveddata == strict_json(original.read_bytes())
        result["saved_setup_sha256"] = sha(savedpath) if savedpath.exists() else None
        result["source_unchanged"] = sha(staged) == sha(original) == digest
        lo, reopened = result["phases"].get("load", {}), result["phases"].get("reopen", {})
        le, re = lo.get("evidence") or {}, reopened.get("evidence") or {}
        result["separate_processes"] = bool(reopened) and lo["process_id"] != reopened["process_id"]
        gates = ("native_bridge", "load", "full_grid", "actor_adopted", "all_authored_actors_adopted", "physics_tick", "save_readback")
        has_midge = le.get("midge_id", -1) >= 0
        result["movement_applicable"] = has_midge
        result["contact_applicable"] = has_midge
        result["movement_pass"] = bool(le.get("midge_drive")) if has_midge else None
        result["contact_pass"] = bool(le.get("collision_observed")) if has_midge else None
        plane = (le.get("grid_check") or {}).get("native_plane_sha256")
        expected_planes = {row.get("material_plane_sha256", row.get("plane_sha256")) for row in aliases} - {None}
        result["plane_matches_corpus"] = bool(plane) and (not expected_planes or expected_planes == {plane})
        result["actual_native_plane_sha256"] = plane
        result["profile_isolated"] = all(Path(ev["user_data_dir"]).resolve().is_relative_to(profile_root.resolve())
                                          for ev in (le, re) if ev and "user_data_dir" in ev) and bool(le.get("user_data_dir"))
        result["pass"] = bool(lo.get("exit_code") == 0 and reopened.get("exit_code") == 0
            and all(le.get(key) for key in gates) and re.get("fresh_reopen")
            and (not has_midge or (result["movement_pass"] and result["contact_pass"]))
            and result["saved_setup_semantic_equal"] and result["source_unchanged"] and result["separate_processes"]
            and result["saved_setup_sha256"] == re.get("setup_sha256") and result["plane_matches_corpus"] and result["profile_isolated"])
        expected = aliases[0].get("expected_native_refusal")
        refusal = (le.get("native_policy") or {}).get("refusal") or {}
        result["expected_native_refusal"] = expected
        result["negative_fixture_pass"] = bool(expected and lo.get("exit_code") == 1 and not lo.get("timeout")
            and le.get("source_parse") and (le.get("native_policy") or {}).get("accepted") is False
            and all(refusal.get(key) == value for key, value in expected.items())
            and not le.get("native_bridge") and not le.get("load") and result["source_unchanged"] and saveddata is None)
        result["qualification_status"] = "REFUSED_INVALID_SOURCE" if result["negative_fixture_pass"] else "QUALIFIED_HEADLESS" if result["pass"] else "UNQUALIFIED"
        write_json(out / (case_id + ".receipt.json"), result)
        print("GOLDMAPS_OWNER_NATIVE_CASE " + json.dumps({key: result[key] for key in ("id", "aliases", "setup_sha256", "qualification_status", "pass", "negative_fixture_pass")}), flush=True)
        return result

    with concurrent.futures.ThreadPoolExecutor(max_workers=args.jobs) as pool:
        results = list(pool.map(qualify, groups.items()))
    route_results = []
    if args.routes:
        fixtures = strict_json(args.routes.read_bytes())
        for route in fixtures["routes"]:
            matches = [row for row in records if row["id"] == route["setup_id"]]
            if not matches:
                continue
            row = matches[0]
            if row["setup_sha256"] != route["setup_sha256"]:
                raise ValueError("bounded route fixture differs from actual Setup")
            routefile = out / (safe_path(route["id"]) + ".route.json")
            write_json(routefile, route)
            label = "gm-" + nonce + "-" + row["setup_sha256"][:12]
            route_env = env.copy()
            route_env.update(CYBERSAND_ADMISSION_LABEL=label, CYBERSAND_ADMISSION_SAVED_LABEL=label + "-route",
                             CYBERSAND_ADMISSION_PHASE="load", GOLDMAPS_ROUTE_FILE=str(routefile))
            receipt, text = run([godot, "--headless", "--path", project, "--script", HERE / "native_probe.gd"],
                                out / (route["id"] + ".log"), route_env, 360)
            receipt.update(id=route["id"], setup_id=row["id"], setup_sha256=row["setup_sha256"], evidence=record(text, "CANVAS_NATIVE_EVIDENCE "))
            route_results.append(receipt)
            write_json(out / (route["id"] + ".receipt.json"), receipt)
    after = verify_directory(package, before["manifest_sha256"], post_execution=True)
    summary = {"schema": "goldmaps.owner-native-matrix.v1", "created_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
               "platform": platform.platform(), "engine_head": args.engine_head, "frozen_scientific_engine": FROZEN,
               "godot_sha256": sha(godot), "godot_version": version, "probe_sha256": sha(HERE / "native_probe.gd"),
               "executed_source": source, "inputs_sha256": sha(input_path), "github_run_id": os.environ.get("GITHUB_RUN_ID"),
               "github_sha": os.environ.get("GITHUB_SHA"), "runner_image": os.environ.get("ImageVersion"),
               "runtime_kind": "shipped Windows project" if os.name == "nt" else "Linux companion" if companion else "shipped project on Linux",
               "linux_companion": companion, "package_before": before, "package_after": after,
               "bootstrap": bootstrap_receipt, "profile": profile, "results": results, "route_results": route_results,
               "aliases_checked": len(records), "unique_setups_checked": len(results), "declared_campaign_aliases": len(all_records),
               "qualified_unique_setups": sum(row["pass"] for row in results),
               "verified_refused_unique_setups": sum(row["negative_fixture_pass"] for row in results),
               "validation_pass": all(row["pass"] or row["negative_fixture_pass"] for row in results),
               "all_playable_pass": all(row["pass"] for row in results if not row["expected_native_refusal"]),
               "scope": "Actual ordinary Workbench load, exact complete native material plane, authored actor adoption, native progression, applicable Midge movement/contact, authored save and independent-process reopen. No physical GPU, full route, subjective playfeel or owner acceptance."}
    write_json(out / "summary.json", summary)
    delivery = {"schema": "goldmaps.owner-qualification.v1", "engine_head": args.engine_head,
                "platform": platform.platform(), "godot_sha256": sha(godot), "probe_sha256": sha(HERE / "native_probe.gd"),
                "input_manifest_sha256": before["manifest_sha256"], "summary_sha256": sha(out / "summary.json"),
                "github_run_id": os.environ.get("GITHUB_RUN_ID"), "owner_accepted": False,
                "scope": summary["scope"], "setups": {row["setup_sha256"]: {
                    "status": row["qualification_status"], "aliases": row["aliases"], "owner_accepted": False,
                    "material_plane_sha256": row["actual_native_plane_sha256"],
                    "receipt": row["id"] + ".receipt.json", "receipt_sha256": sha(out / (row["id"] + ".receipt.json")),
                    "refusal": row["expected_native_refusal"] if row["negative_fixture_pass"] else None}
                    for row in results}}
    write_json(out / "delivery-qualification.v1.json", delivery)
    print("GOLDMAPS_OWNER_NATIVE_SUMMARY " + json.dumps({key: summary[key] for key in ("engine_head", "aliases_checked", "unique_setups_checked", "qualified_unique_setups", "verified_refused_unique_setups", "validation_pass")}), flush=True)
    return 0 if summary["validation_pass"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
