#!/usr/bin/env python3
"""Run immutable Goldmaps Setups through actual Workbench/Rapier processes.

The frozen Windows package is verified before and after execution. On Linux,
the additional native libraries must match the exact accepted engine hashes.
The only source adaptation is a separate test project configuration and probe.
No map edit, position setter, simulation substitute, or owner acceptance exists.
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
import urllib.request
import uuid

ENGINE = "662df51cd8409a52332fa7ef15d06d8ab8945aed"
MANIFEST = "d26829e44ef697966ffde81424d8c22d9ae154b75e42122b4ac172e5c707dae0"
LINUX_NATIVE = "a15fc422313eb01e79bc904f44cc8879816484ae4fc98c63ac4b815afdb6a5e7"
LINUX_RAPIER = "566e68ae53bfb2eb7018c8e7d0dd3727121bf696462039b780a33d6b8369c66a"
LINUX_GODOT = "f85bbc6b15e22416c7d797cd60b63286dd67b9cb13498847056c18520ae55a75"
WINDOWS_GODOT = "d8055fb8c7e7f5010d7439ec69be051554055dae55a265f8647bd7301c34161c"
HERE = Path(__file__).resolve().parent


def sha(path):
    h = hashlib.sha256()
    with Path(path).open("rb") as f:
        for b in iter(lambda: f.read(1024 * 1024), b""):
            h.update(b)
    return h.hexdigest()


def write_json(path, value):
    Path(path).write_text(json.dumps(value, indent=2) + "\n", encoding="utf-8")


def verify_package(package):
    manifest = package / "package-files.v1.json"
    if sha(manifest) != MANIFEST:
        raise ValueError("Frozen package manifest identity mismatch")
    m = json.loads(manifest.read_text(encoding="utf-8"))
    if m["engine_head"] != ENGINE or len(m["files"]) != 586:
        raise ValueError("Frozen package identity/scope mismatch")
    bad = [r["path"] for r in m["files"] if not (package/r["path"]).is_file()
           or (package/r["path"]).stat().st_size != r["bytes"]
           or sha(package/r["path"]) != r["sha256"]]
    result = {"files_checked": 586, "bytes_checked": sum(r["bytes"] for r in m["files"]),
              "manifest_sha256": MANIFEST, "mismatches": bad, "pass": not bad}
    if bad:
        raise ValueError("Frozen package mismatch: " + ", ".join(bad))
    return result


def run(argv, log, env=None, timeout=180):
    started = time.monotonic()
    with log.open("wb") as f:
        p = subprocess.Popen(list(map(str, argv)), stdout=f, stderr=subprocess.STDOUT, env=env)
        expired = False
        try:
            code = p.wait(timeout=timeout)
        except subprocess.TimeoutExpired:
            expired = True
            if os.name == "nt":
                subprocess.run(["taskkill", "/PID", str(p.pid), "/T", "/F"],
                               stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=False)
            else:
                p.kill()
            code = p.wait(timeout=15)
    return {"exit_code": code, "timeout": expired, "process_id": p.pid,
            "seconds": round(time.monotonic()-started, 3), "log_sha256": sha(log)}, log.read_text(encoding="utf-8-sig", errors="replace")


def record(text, prefix):
    rows = [json.loads(line[len(prefix):]) for line in text.splitlines() if line.startswith(prefix)]
    return rows[-1] if rows else None


def executed_source_identity():
    repo = HERE.parent.parent
    paths = [HERE/"native_matrix.py", HERE/"native_probe.gd", HERE/"native_inputs.v1.json", HERE/"native_helper_tests.ps1"]
    identity = {"event_github_sha":os.environ.get("GITHUB_SHA"),
                "requested_checkout_head":os.environ.get("GOLDMAPS_TEST_SOURCE_HEAD"),
                "executed_checkout_head":None,"files_match_commit":False,
                "files":{p.relative_to(repo).as_posix():sha(p) for p in paths}}
    try:
        identity["executed_checkout_head"] = subprocess.check_output(["git","-C",str(repo),"rev-parse","HEAD"],text=True).strip()
        matched = []
        for p in paths:
            relative = p.relative_to(repo).as_posix()
            blob = subprocess.check_output(["git","-C",str(repo),"show",identity["executed_checkout_head"]+":"+relative])
            matched.append(hashlib.sha256(blob).hexdigest()==sha(p))
        identity["files_match_commit"] = all(matched)
    except (OSError,subprocess.CalledProcessError):
        pass
    expected = identity["requested_checkout_head"]
    if expected and (expected != identity["executed_checkout_head"] or not identity["files_match_commit"]):
        raise ValueError("CI executed checkout/native files differ from requested source HEAD")
    return identity


def acquire_inputs(records, package, source_archive, out):
    target = out / "inputs"
    target.mkdir()
    frozen = json.loads((package/"package-files.v1.json").read_text())
    local = {r["sha256"]: package/r["path"] for r in frozen["files"] if r["path"].endswith("setup.json")}
    paths = {}
    for row in records:
        digest = row["setup_sha256"]
        if digest in paths:
            continue
        dest = target/(digest+".json")
        source = local.get(digest)
        if row.get("input_kind") == "integration_descendant":
            name = Path(row["local_path"])
            if name.is_absolute() or ".." in name.parts:
                raise ValueError("Unsafe descendant input path")
            source = HERE.parent.parent/name
        elif source is None and source_archive:
            candidate = source_archive/f"PR-{row['pr']:04d}-{row['head'][:12]}"/row["path"]
            if candidate.is_file():
                source = candidate
        if source:
            shutil.copyfile(source, dest)
        else:
            url = row["url"]
            if not url.startswith("https://raw.githubusercontent.com/techrote/sandmapsreference/"+row["head"]+"/"):
                raise ValueError("Unpinned input URL")
            with urllib.request.urlopen(url, timeout=45) as r:
                data = r.read(1048577)
            if len(data) > 1048576:
                raise ValueError("Setup exceeds native format budget")
            dest.write_bytes(data)
        if sha(dest) != digest or dest.stat().st_size != row["setup_bytes"]:
            raise ValueError("Input identity mismatch: " + row["id"])
        paths[digest] = dest
    return paths


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--package", type=Path, required=True)
    ap.add_argument("--godot", type=Path, required=True)
    ap.add_argument("--linux-project", type=Path)
    ap.add_argument("--source-archive", type=Path)
    ap.add_argument("--inputs", type=Path, default=HERE/"native_inputs.v1.json")
    ap.add_argument("--out", type=Path, required=True)
    ap.add_argument("--ids", help="Comma-separated input aliases; default all")
    ap.add_argument("--jobs", type=int, default=1, choices=(1, 2, 3, 4))
    ap.add_argument("--routes", type=Path, help="Execute separately labelled bounded route probes")
    args = ap.parse_args()
    source_identity = executed_source_identity()
    package, godot, out = args.package.resolve(), args.godot.resolve(), args.out.resolve()
    if out.exists():
        raise ValueError("Refuse to overwrite qualification evidence")
    before = verify_package(package)
    required_godot = WINDOWS_GODOT if os.name == "nt" else LINUX_GODOT
    if sha(godot) != required_godot:
        raise ValueError("Godot executable differs from frozen 4.7 runtime")
    inputs = json.loads(args.inputs.read_text(encoding="utf-8"))
    if inputs["engine_head"] != ENGINE:
        raise ValueError("Wrong experimental engine")
    records = inputs["records"]
    if args.ids:
        ids = set(args.ids.split(","))
        records = [r for r in records if r["id"] in ids]
        if {r["id"] for r in records} != ids:
            raise ValueError("Unknown input alias")
    out.mkdir(parents=True)
    paths = acquire_inputs(records, package, args.source_archive, out)
    project = out/"runtime-project"
    shutil.copytree(package/"godot", project, ignore=shutil.ignore_patterns(".godot", "project.godot"))
    linux_receipt = None
    if os.name != "nt":
        if not args.linux_project:
            raise ValueError("Source-pinned Linux project is required")
        lp = args.linux_project.resolve()
        n = lp/"addons/cybersand_native/bin/libcybersand_native.linux.x86_64.so"
        if sha(n) != LINUX_NATIVE:
            raise ValueError("Linux native bridge source identity mismatch")
        # Frozen Windows source files must match the experimental Linux source,
        # excluding Windows-only binaries and runtime/platform metadata.
        compared = 0
        mismatch = []
        for p in project.rglob("*"):
            if not p.is_file() or p.suffix.lower() not in (".gd", ".tscn", ".gdextension", ".json"):
                continue
            name = p.relative_to(project)
            if "runtime-provenance" in name.name or "runtime-manifest" in name.name:
                continue
            other = lp/name
            if not other.exists() or sha(p) != sha(other):
                mismatch.append(name.as_posix())
            compared += 1
        if mismatch:
            raise ValueError("Frozen/pinned project source mismatch: "+str(mismatch))
        rn = lp/"addons/godot-rapier2d/bin/libgodot_rapier.linux.x86_64-unknown-linux-gnu.so"
        if sha(rn) != LINUX_RAPIER:
            raise ValueError("Linux Rapier library differs from pinned experimental source")
        provenance = json.loads((lp/"addons/godot-rapier2d/runtime-provenance.linux.json").read_text())
        # The pinned lock/provenance is recorded; immutable binary digest below
        # is also included in receipts for independent runtime matching.
        for f in (n, rn):
            dest = project/f.relative_to(lp)
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(f, dest)
        linux_receipt = {"source_files_compared": compared, "source_mismatches": mismatch,
                         "native_sha256": sha(n), "rapier_sha256": sha(rn), "rapier_provenance": provenance}
    nonce = uuid.uuid4().hex[:10]
    name = "GOLDMAPS Qualification " + nonce
    config = ('config_version=5\n[application]\nconfig/name='+json.dumps(name)+
              '\nconfig/features=PackedStringArray("4.7")\n[autoload]\n'
              'FeatureNavigation="*res://scripts/feature_navigation.gd"\n[cybersand]\nnative_worker_threads=2\n'
              '[physics]\n2d/physics_engine="Rapier2D"\n[rendering]\nrenderer/rendering_method="gl_compatibility"\n')
    (project/"project.godot").write_text(config, encoding="utf-8")
    shutil.copyfile(HERE/"native_probe.gd", project/"goldmaps-native-probe.gd")
    shutil.copyfile(package/"Owner-Preflight.gd", project/"goldmaps-preflight.gd")
    runtime_before = {p.relative_to(project).as_posix(): sha(p) for p in project.rglob("*") if p.is_file()}
    imp, text = run([godot, "--headless", "--path", project, "--import"], out/"import.log", timeout=240)
    if imp["exit_code"]:
        raise RuntimeError("Actual native resource import failed; see import.log")
    pre, text = run([godot, "--headless", "--path", project, "--script", "res://goldmaps-preflight.gd"], out/"preflight.log", timeout=45)
    preflight = record(text, "GOLD_ASTRA_OWNER_PREFLIGHT=")
    if pre["exit_code"] or not preflight or not preflight["native_bridge_class_registered"]:
        raise RuntimeError("Actual native bridge unavailable")
    workbench = Path(preflight["workbench_dir"])
    if name not in workbench.parts or any(workbench.iterdir()):
        raise RuntimeError("Refuse nonempty or nonisolated Workbench profile")
    groups = {}
    for row in records:
        groups.setdefault(row["setup_sha256"], []).append(row)

    def qualify(item):
        digest, aliases = item
        case_id = aliases[0]["id"]
        label = "gm-"+nonce+"-"+digest[:8]
        saved = label+"-saved"
        source = paths[digest]
        staged = workbench/("setup-"+label+".json")
        with staged.open("xb") as f:
            f.write(source.read_bytes())
        result = {"id": case_id, "aliases": [r["id"] for r in aliases], "source_records": aliases,
                  "setup_sha256": digest, "phases": {}}
        for phase in ("load", "reopen"):
            env = os.environ.copy()
            env.update(CYBERSAND_ADMISSION_LABEL=label, CYBERSAND_ADMISSION_SAVED_LABEL=saved,
                       CYBERSAND_ADMISSION_PHASE=phase)
            tick_limit = int(aliases[0].get("contact_probe_tick_limit",900))
            if tick_limit not in (900,1800):
                raise ValueError("Unreviewed contact fixture tick limit")
            env["GOLDMAPS_CONTACT_TICK_LIMIT"] = str(tick_limit)
            rec, text = run([godot, "--headless", "--path", project, "--script", "res://goldmaps-native-probe.gd"],
                            out/(case_id+"."+phase+".log"), env=env, timeout=240)
            rec["evidence"] = record(text, "CANVAS_NATIVE_EVIDENCE ")
            result["phases"][phase] = rec
            if phase == "load" and (rec["exit_code"] or not (workbench/("setup-"+saved+".json")).exists()):
                break
        savedpath = workbench/("setup-"+saved+".json")
        saveddata = json.loads(savedpath.read_text()) if savedpath.exists() else None
        result["saved_setup_semantic_equal"] = saveddata == json.loads(source.read_text())
        result["saved_setup_sha256"] = sha(savedpath) if savedpath.exists() else None
        result["source_unchanged"] = sha(staged) == sha(source) == digest
        lo, re = result["phases"].get("load", {}), result["phases"].get("reopen", {})
        le, ree = lo.get("evidence") or {}, re.get("evidence") or {}
        result["separate_processes"] = bool(re) and lo["process_id"] != re["process_id"]
        req = ("native_bridge", "load", "full_grid", "actor_adopted", "physics_tick", "midge_drive", "save_readback")
        result["basic_native_pass"] = bool(lo.get("exit_code") == 0 and re.get("exit_code") == 0
            and all(le.get(k) for k in req) and ree.get("fresh_reopen")
            and result["saved_setup_semantic_equal"] and result["source_unchanged"] and result["separate_processes"]
            and result["saved_setup_sha256"] == ree.get("setup_sha256"))
        result["collision_observed"] = bool(le.get("collision_observed"))
        result["pass"] = result["basic_native_pass"] and result["collision_observed"]
        expected = aliases[0].get("expected_native_refusal")
        refusal = (le.get("native_policy") or {}).get("refusal") or {}
        result["expected_native_refusal"] = expected
        result["negative_fixture_pass"] = bool(expected and lo.get("exit_code") == 1 and not lo.get("timeout")
            and le.get("source_parse") and (le.get("native_policy") or {}).get("accepted") is False
            and all(refusal.get(k) == v for k,v in expected.items())
            and not le.get("native_bridge") and not le.get("load")
            and result["source_unchanged"] and saveddata is None)
        result["qualification_status"] = "REFUSED_INVALID_SOURCE" if result["negative_fixture_pass"] else "QUALIFIED_HEADLESS" if result["pass"] else "FAILED_OR_INCONCLUSIVE"
        write_json(out/(case_id+".receipt.json"), result)
        print("GOLDMAPS_NATIVE_CASE "+json.dumps(result), flush=True)
        return result

    with concurrent.futures.ThreadPoolExecutor(max_workers=args.jobs) as pool:
        results = list(pool.map(qualify, groups.items()))
    route_results = []
    if args.routes:
        routes = json.loads(args.routes.read_text())
        for route in routes["routes"]:
            if route["setup_id"] not in {r["id"] for r in records}:
                continue
            source_row = next(r for r in records if r["id"] == route["setup_id"])
            label = "gm-"+nonce+"-"+source_row["setup_sha256"][:8]
            routepath = out/(route["id"]+".route.json")
            write_json(routepath, route)
            env = os.environ.copy()
            env.update(CYBERSAND_ADMISSION_LABEL=label, CYBERSAND_ADMISSION_SAVED_LABEL=label+"-route",
                       CYBERSAND_ADMISSION_PHASE="load", GOLDMAPS_ROUTE_FILE=str(routepath))
            rec, text = run([godot, "--headless", "--path", project, "--script", "res://goldmaps-native-probe.gd"],
                            out/(route["id"]+".log"), env=env, timeout=360)
            rec.update(id=route["id"], setup_id=route["setup_id"], setup_sha256=source_row["setup_sha256"],
                       evidence=record(text, "CANVAS_NATIVE_EVIDENCE "))
            route_results.append(rec)
            write_json(out/(route["id"]+".receipt.json"), rec)
            print("GOLDMAPS_NATIVE_ROUTE "+json.dumps(rec), flush=True)
    after = verify_package(package)
    changes = [p for p, h in runtime_before.items() if not (project/p).is_file() or sha(project/p) != h]
    summary = {"schema": "goldmaps.native-matrix.v1", "created_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
               "platform": platform.platform(), "engine_head": ENGINE, "godot_sha256": sha(godot),
               "godot_version": preflight["godot_version"], "probe_sha256": sha(HERE/"native_probe.gd"),
               "runner_sha256": sha(Path(__file__)), "inputs_sha256": sha(args.inputs),
               "github_run_id": os.environ.get("GITHUB_RUN_ID"), "github_sha": os.environ.get("GITHUB_SHA"),
               "executed_source": source_identity,
               "runner_image": os.environ.get("ImageVersion"), "linux_identity": linux_receipt,
               "package_before": before, "package_after": after, "import": imp, "preflight": preflight,
               "runtime_source_files": len(runtime_before), "runtime_source_changes": changes,
               "project_configuration_sha256": sha(project/"project.godot"), "results": results,
               "aliases_checked": len(records), "unique_setups_checked": len(results), "route_results": route_results,
               "scope": "Actual hosted headless Workbench/GDExtension/Rapier load, complete material plane, Midge adoption, controlled upward movement, contact, authored-start save and separate-process reopen. Route results are separately bounded; no human/GPU/visual acceptance."}
    summary["pass"] = bool(results and all(r["pass"] for r in results) and after["pass"] and not changes)
    summary["negative_fixtures_verified"] = sum(r["negative_fixture_pass"] for r in results)
    summary["validation_pass"] = bool(results and all(r["pass"] or r["negative_fixture_pass"] for r in results) and after["pass"] and not changes)
    summary["qualification_status"] = "QUALIFIED_WITH_EXPLICIT_REFUSED_ORIGINAL" if summary["validation_pass"] and summary["negative_fixtures_verified"] else "QUALIFIED_HEADLESS" if summary["pass"] else "FAILED_OR_INCONCLUSIVE"
    write_json(out/"summary.json", summary)
    print("GOLDMAPS_NATIVE_SUMMARY "+json.dumps({k:v for k,v in summary.items() if k not in ("results","route_results","linux_identity")}), flush=True)
    # A green test gate can prove an expected refusal, but never turns that
    # historical source into a native-qualified map: its pass remains false.
    return 0 if summary["validation_pass"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
