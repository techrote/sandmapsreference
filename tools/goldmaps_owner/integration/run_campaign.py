#!/usr/bin/env python3
"""Consolidated Windows owner-kit qualification and actual archive publication input.

One accepted engine, one assembly, serial native Worlds, preserved negative
receipts, an independently inspected final ZIP and an actual fresh extraction.
This script never creates a release, changes a branch or uploads owner data.
"""
from __future__ import annotations

import argparse
import datetime
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import zipfile

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
sys.path.insert(0, str(HERE.parent / "qualification"))
from verify_payload import file_sha256 as sha, verify_directory, verify_zip
from prepare_runtime import ENGINE
from seal_payload import seal
from run_native_collection import profile_environment
from reuse_native_evidence import reuse


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes((json.dumps(value, indent=2, ensure_ascii=False) + "\n").encode("utf-8"))


def execute(name, command, evidence, env=None, timeout=3600, required=True):
    log = evidence / (name + ".log")
    print("GOLDMAPS_CAMPAIGN_START " + name, flush=True)
    with log.open("wb") as stream:
        process = subprocess.Popen(list(map(str, command)), cwd=ROOT, env=env, stdout=stream, stderr=subprocess.STDOUT)
        expired = False
        try:
            code = process.wait(timeout=timeout)
        except subprocess.TimeoutExpired:
            expired = True
            if os.name == "nt":
                subprocess.run(["taskkill", "/PID", str(process.pid), "/T", "/F"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            else:
                process.kill()
            code = process.wait(timeout=15)
    result = {"name": name, "exit_code": code, "timeout": expired, "log_sha256": sha(log)}
    write_json(evidence / (name + ".process.json"), result)
    print("GOLDMAPS_CAMPAIGN_RESULT " + json.dumps(result), flush=True)
    if required and (code or expired):
        print(log.read_text(encoding="utf-8-sig", errors="replace")[-14000:], flush=True)
        raise RuntimeError(name + " failed; original log and receipts are retained")
    return result


def copy_receipts(source, target):
    target.mkdir(parents=True, exist_ok=True)
    for path in source.iterdir():
        if path.is_file() and path.suffix in (".json", ".log", ".png", ".md"):
            shutil.copyfile(path, target / path.name)


def merge_qualification(required, optional, kit):
    merged = {"schema": "goldmaps.owner-qualification.v1", "engine_head": ENGINE,
              "platform": "native Windows", "owner_accepted": False, "setups": {}, "campaigns": [],
              "scope": "Actual delivery native evidence with explicit executed source/run per campaign. Product-only continuations retain original native receipt identities. Frozen judgments and physical owner acceptance remain separate."}
    for name, directory in (("windows-required", required), ("windows-optional", optional)):
        overlay = json.loads((directory / "delivery-qualification.v1.json").read_text(encoding="utf-8"))
        summary = json.loads((directory / "summary.json").read_text(encoding="utf-8"))
        if overlay["engine_head"] != ENGINE or summary["engine_head"] != ENGINE:
            raise ValueError("Mixed engine authorities")
        if merged.get("godot_sha256", overlay["godot_sha256"]) != overlay["godot_sha256"] or merged.get("probe_sha256", overlay["probe_sha256"]) != overlay["probe_sha256"]:
            raise ValueError("Mixed runtime/probe authorities")
        merged["godot_sha256"] = overlay["godot_sha256"]
        merged["probe_sha256"] = overlay["probe_sha256"]
        merged["campaigns"].append({"kind": name, "summary": "qualification/" + name + "/summary.json",
                                     "summary_sha256": sha(directory / "summary.json"),
                                     "input_manifest_sha256": overlay["input_manifest_sha256"],
                                     "github_run_id": overlay.get("github_run_id"),
                                     "native_execution_source_head": summary["executed_source"]["checkout_head"],
                                     "unique_setups": summary["unique_setups_checked"],
                                     "qualified_unique_setups": summary["qualified_unique_setups"],
                                     "verified_refused_unique_setups": summary["verified_refused_unique_setups"],
                                     "validation_pass": summary["validation_pass"]})
        for digest, record in overlay["setups"].items():
            if digest in merged["setups"]:
                raise ValueError("Required and optional campaigns overlap")
            record = dict(record)
            record["receipt"] = "qualification/" + name + "/" + record["receipt"]
            record["native_execution_source_head"] = summary["executed_source"]["checkout_head"]
            record["native_execution_run_id"] = summary.get("github_run_id")
            record["native_execution_summary_sha256"] = sha(directory / "summary.json")
            merged["setups"][digest] = record
        copy_receipts(directory, kit / "qualification" / name)
    merged["counts"] = {"unique_setups": len(merged["setups"]),
                        "qualified_headless": sum(v["status"] == "QUALIFIED_HEADLESS" for v in merged["setups"].values()),
                        "verified_refused_originals": sum(v["status"] == "REFUSED_INVALID_SOURCE" for v in merged["setups"].values()),
                        "unqualified_reference_only": sum(v["status"] == "UNQUALIFIED" for v in merged["setups"].values()),
                        "owner_accepted": 0}
    write_json(kit / "collection/delivery-qualification.v1.json", merged)
    return merged


def write_variant_matrix(kit, qualification, source_head, graphical):
    """Join logical identities to executed bytes without merging decisions."""
    roster = json.loads((kit / "collection/collection.v1.json").read_text(encoding="utf-8"))
    rows = []
    for logical in roster["maps"]:
        setup = logical["setup"]
        executed = qualification["setups"].get(setup["sha256"])
        if executed is None:
            raise ValueError("Bundled logical identity has no explicit delivery status: " + logical["id"])
        receipt_path = kit / executed["receipt"]
        if sha(receipt_path) != executed["receipt_sha256"]:
            raise ValueError("Per-variant native receipt changed")
        receipt = json.loads(receipt_path.read_text(encoding="utf-8"))
        if receipt["setup_sha256"] != setup["sha256"] or receipt["qualification_status"] != executed["status"]:
            raise ValueError("Native receipt is attached to the wrong Setup/status")
        if executed["status"] == "QUALIFIED_HEADLESS" and not receipt["pass"]:
            raise ValueError("Qualified status lacks positive native gates")
        if executed["status"] == "REFUSED_INVALID_SOURCE" and not receipt["negative_fixture_pass"]:
            raise ValueError("Refusal status lacks its expected negative evidence")
        displayed = [case for case in graphical.get("cases", [])
                     if case.get("map_id") == logical["id"] and case.get("setup_sha256") == setup["sha256"]]
        graphical_record = {"status": displayed[0]["status"] if displayed else "NOT_EXECUTED",
                            "summary": "qualification/graphical/summary.json",
                            "cases": [case["name"] for case in displayed],
                            "scope": "Only these explicit matching cases establish hosted displayed scope; no alias or physical GPU acceptance is inferred."}
        load = receipt["phases"]["load"].get("evidence") or {}
        reopen = receipt["phases"].get("reopen", {}).get("evidence") or {}
        historical = logical.get("native", {}).get("historical") or {}
        rows.append({
            "id": logical["id"], "title": logical["title"], "collections": logical["collections"],
            "variant_role": logical["variant_role"], "parent_id": logical.get("parent_id"),
            "source": logical["source"], "derived_source": logical.get("derived_source"),
            "setup": setup, "engine_head": qualification["engine_head"],
            "godot_sha256": qualification["godot_sha256"], "native_status": executed["status"],
            "native_receipt": executed["receipt"], "native_receipt_sha256": executed["receipt_sha256"],
            "native_execution_source_head": executed["native_execution_source_head"],
            "native_execution_run_id": executed["native_execution_run_id"],
            "native_execution_summary_sha256": executed["native_execution_summary_sha256"],
            "executed_aliases": executed["aliases"],
            "gate_interpretation": "NOT_EXECUTED_AFTER_EXPECTED_POLICY_REFUSAL" if receipt["negative_fixture_pass"] else "Read each executed positive gate separately",
            "native_gates": {"policy": load.get("native_policy"), "ordinary_load": load.get("load"),
                             "complete_material_readback": load.get("full_grid"),
                             "material_plane_matches_corpus": receipt["plane_matches_corpus"],
                             "all_authored_actors_adopted": load.get("all_authored_actors_adopted"),
                             "acknowledged_simulation": load.get("physics_tick"),
                             "movement_applicable": receipt["movement_applicable"], "movement": receipt["movement_pass"],
                             "contact_applicable": receipt["contact_applicable"], "contact": receipt["contact_pass"],
                             "saved_authored_recipe_equal": receipt["saved_setup_semantic_equal"],
                             "fresh_process_reopen": reopen.get("fresh_reopen"),
                             "separate_processes": receipt["separate_processes"],
                             "source_unchanged": receipt["source_unchanged"], "profile_isolated": receipt["profile_isolated"],
                             "expected_refusal_verified": receipt["negative_fixture_pass"]},
            "historical_native": {key: historical.get(key) for key in ("status", "engine_head", "run_id", "scope")},
            "art": logical["art"], "protected_feature_ids": logical["protected_feature_ids"],
            "source_static_qualification": logical["source_static_qualification"],
            "graphical_evidence": graphical_record,
            "owner_status": "Pending / not reviewed", "owner_classification": None, "owner_accepted": False,
        })
    counts = {"logical_entries": len(rows), "unique_setups": len({row["setup"]["sha256"] for row in rows}),
              "qualified_logical_entries": sum(row["native_status"] == "QUALIFIED_HEADLESS" for row in rows),
              "refused_logical_entries": sum(row["native_status"] == "REFUSED_INVALID_SOURCE" for row in rows),
              "unqualified_logical_entries": sum(row["native_status"] == "UNQUALIFIED" for row in rows),
              "owner_accepted": 0}
    matrix = {"schema": "goldmaps.owner-per-variant-matrix.v1", "delivery_source_head": source_head,
              "native_evidence_authority": qualification.get("native_evidence_authority"),
              "engine_head": qualification["engine_head"], "counts": counts, "records": rows,
              "scope": "Authoritative per-logical-variant join of actual delivery native receipts. Byte aliases reuse evidence, never owner decisions. False or absent gates on refused originals are expected and do not become native passes."}
    write_json(kit / "qualification/per-variant-matrix.v1.json", matrix)
    lines = ["# Executed delivery qualification by logical map", "", matrix["scope"], "",
             "All owner classifications and physical Windows/NVIDIA acceptance remain pending.", "",
             "| Logical ID | Title | Variant | Delivery native status | Exact receipt |", "|---|---|---|---|---|"]
    for row in rows:
        title = row["title"].replace("|", "\\|")
        lines.append(f"| `{row['id']}` | {title} | {row['variant_role']} | {row['native_status']} | [{row['setup']['sha256'][:12]}]({row['native_receipt'].removeprefix('qualification/')}) |")
    (kit / "qualification/PER-VARIANT-MATRIX.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    return counts


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--engine", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--source-head", required=True)
    parser.add_argument("--reuse-native-artifact", type=Path,
                        help="Unwrapped actual predecessor playable artifact; exact pins come from qualification-request.v1.json")
    args = parser.parse_args()
    if os.name != "nt":
        raise ValueError("This authoritative launcher/publication campaign requires native Windows")
    head = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip()
    if head != args.source_head:
        raise ValueError("Requested source is not the actual checkout")
    request = json.loads((HERE / "qualification-request.v1.json").read_text(encoding="utf-8"))
    if request["engine_head"] != ENGINE:
        raise ValueError("Qualification request differs from the accepted engine")
    reuse_request = request.get("native_reuse")
    if bool(reuse_request) != bool(args.reuse_native_artifact):
        raise ValueError("Native reuse requires both the explicit request pins and the actual predecessor artifact")
    out = args.out.resolve()
    if out.exists():
        raise ValueError("Refuse to overwrite campaign output")
    evidence, artifacts = out / "evidence", out / "artifacts"
    evidence.mkdir(parents=True)
    artifacts.mkdir()
    kit = out / "work/Goldmaps Owner Evaluation"
    engine = args.engine.resolve()
    python = sys.executable
    env = os.environ.copy()
    env["GOLDMAPS_TEST_SOURCE_HEAD"] = head
    env["PYTHONDONTWRITEBYTECODE"] = "1"
    commands = HERE.parent
    execute("runtime-acquisition", [python, HERE / "prepare_runtime.py", "--engine", engine, "--cache", out / "cache",
                                   "--out", out / "runtime-deps", "--platform", "windows"], evidence, env, 900)
    execute("stage-engine", [python, HERE / "stage_engine.py", "--engine", engine, "--runtime-deps", out / "runtime-deps",
                             "--out", kit, "--platform", "windows"], evidence, env, 300)
    fragment = out / "collection-fragment"
    execute("build-corpus", [python, commands / "corpus/build_collection.py", "--out", fragment, "--cache", out / "source-cache",
                             "--engine-head", ENGINE, "--delivery-source-head", head], evidence, env, 900)
    for folder in ("collection", "corpus-export"):
        shutil.copytree(fragment / folder, kit / folder)
    for name in ("START-HERE.md", "LICENSE-AND-SOURCE.md"):
        shutil.copyfile(HERE / name, kit / name)
    write_json(kit / "collection/delivery-qualification.v1.json", {"schema": "goldmaps.owner-qualification.v1",
               "engine_head": ENGINE, "owner_accepted": False, "setups": {}, "scope": "Pending actual campaign; nothing is enabled by this initial record."})
    execute("assemble-product", [python, commands / "product/assemble_product.py", "--output", kit,
                                 "--engine-head", ENGINE, "--source-head", head], evidence, env, 180)
    initial = seal(kit, head)
    write_json(evidence / "initial-payload.json", verify_directory(kit, initial["payload_manifest_sha256"]))
    godot = kit / "Godot_v4.7-stable_win64_console.exe"
    execute("independent-corpus-audit", [python, commands / "qualification/audit_collection.py", "--package", kit,
                                        "--frozen-repo", ROOT, "--out", evidence / "independent-corpus-audit.json"], evidence, env, 600)
    execute("payload-contracts", [python, commands / "qualification/test_payload_contract.py"], evidence, env, 180)
    execute("acquisition-contracts", [python, commands / "qualification/test_acquisition_contract.py"], evidence, env, 180)
    execute("runtime-package-boundary", [python, commands / "qualification/run_package_boundary_qa.py", "--package", kit,
                                         "--godot", godot, "--out", evidence / "boundary"], evidence, env, 180)
    io_env = profile_environment(kit / "userdata/io-contract")
    execute("runtime-collection-boundary", [godot, "--headless", "--path", kit / "browser", "--script",
                                            commands / "product/test_package_io.gd", "--", kit / "collection/collection.v1.json"],
            evidence, io_env, 180)
    execute("architectural-manifest", [python, commands / "corpus/query.py", "--package", kit, "validate"], evidence, env, 180)
    required, optional = evidence / "windows-required", evidence / "windows-optional"
    reuse_receipt = None
    if reuse_request:
        reuse_receipt, reuse_path = reuse(args.reuse_native_artifact.resolve(), reuse_request, kit, evidence, head)
        write_json(evidence / "native-evidence-reuse.v1.json", reuse_receipt)
        predecessor = json.loads((args.reuse_native_artifact / "campaign.json").read_text(encoding="utf-8"))
        optional_result = {"mode": "REUSED_VERIFIED_EXISTING_EXECUTION", "original_process": predecessor["optional_process"],
                           "original_source_head": reuse_request["source_head"], "original_run_id": reuse_request["github_run_id"]}
        print("GOLDMAPS_NATIVE_EVIDENCE_REUSED " + json.dumps(reuse_receipt["native_evidence_authority"]), flush=True)
    else:
        execute("native-required", [python, commands / "qualification/run_native_collection.py", "--package", kit, "--godot", godot,
                                    "--engine-head", ENGINE, "--manifest-sha256", initial["payload_manifest_sha256"], "--out", required,
                                    "--jobs", "1", "--routes", ROOT / "scripts/goldmaps_finalisation/native_routes.v1.json"], evidence, env, 6500)
        optional_result = execute("native-optional", [python, commands / "qualification/run_native_collection.py", "--package", kit, "--godot", godot,
                                    "--engine-head", ENGINE, "--manifest-sha256", initial["payload_manifest_sha256"], "--out", optional,
                                    "--inputs", "collection/native-inputs-optional.v1.json", "--jobs", "1"], evidence, env, 3300, required=False)
    # An absent/incomplete optional summary is a campaign infrastructure problem;
    # individual fully recorded optional refusals/failures remain reference-only.
    if not (optional / "summary.json").is_file():
        raise RuntimeError("Optional campaign incomplete; no fabricated eligibility or partial summary")
    qualification = merge_qualification(required, optional, kit)
    qualification["native_evidence_authority"] = ({**reuse_receipt["native_evidence_authority"],
        "reuse_receipt": "qualification/native-evidence-reuse.v1.json", "reuse_receipt_sha256": sha(reuse_path)}
        if reuse_receipt else {"source_head": head, "github_run_id": os.environ.get("GITHUB_RUN_ID"), "mode": "EXECUTED_CURRENT_CAMPAIGN"})
    write_json(kit / "collection/delivery-qualification.v1.json", qualification)
    route_summary = []
    for record in json.loads((required / "summary.json").read_text(encoding="utf-8"))["route_results"]:
        route = (record.get("evidence") or {}).get("route") or {}
        route_summary.append({"id": record["id"], "exit_code": record["exit_code"], "timeout": record["timeout"],
                              "completed": route.get("completed", False), "failure": route.get("failure", "no_route_receipt"),
                              "waypoints_reached": route.get("waypoints_reached"), "waypoints_total": route.get("waypoints_total")})
    write_json(kit / "qualification/bounded-route-summary.json", {"scope": "Bounded existing scripted routes; no subjective flight-speed or full-map acceptance",
                                                                  "native_evidence_authority": qualification["native_evidence_authority"],
                                                                  "routes": route_summary})
    copy_receipts(evidence / "boundary", kit / "qualification/package-boundary")
    for name in ("independent-corpus-audit.json", "independent-corpus-audit.log", "payload-contracts.log", "acquisition-contracts.log",
                 "runtime-collection-boundary.log", "architectural-manifest.log"):
        shutil.copyfile(evidence / name, kit / "qualification" / name)
    seal(kit, head)
    execute("product-and-launcher", [python, commands / "qualification/run_product_qa.py", "--package", kit, "--godot", godot,
                                     "--out", evidence / "product", "--disposable-test-profile", "--actual-windows-launcher"], evidence, env, 1200)
    copy_receipts(evidence / "product", kit / "qualification/product")
    # New immutable receipts change the inventory; every subsequent browser
    # starts from a freshly sealed, internally consistent payload.
    seal(kit, head)
    graphical_process = execute("graphical-capture", [python, commands / "product/run_graphical_capture.py", "--package", kit,
                                                       "--out", evidence / "graphical"], evidence, env, 2100, required=False)
    graphical_summary_path = evidence / "graphical/summary.json"
    if not graphical_summary_path.is_file():
        raise RuntimeError("Displayed campaign lacks its explicit scope/failure summary")
    graphical_summary = json.loads(graphical_summary_path.read_text(encoding="utf-8"))
    if graphical_process["timeout"] or graphical_summary.get("product_defect") is not False:
        raise RuntimeError("Displayed execution found a product defect; preserve receipts and repair before delivery")
    if graphical_process["exit_code"] != 0 and not (
            graphical_summary.get("environmental_display_limitation") is True
            and graphical_summary.get("status") == "PARTIAL_DISPLAY_LIMITATION"):
        raise RuntimeError("Displayed execution failed without a recognized native Windows display limitation")
    if graphical_process["exit_code"] == 0 and graphical_summary.get("status") != "CAPTURED_ALL_PLANNED":
        raise RuntimeError("Displayed success lacks its complete planned-case summary")
    if (evidence / "graphical").exists():
        copy_receipts(evidence / "graphical", kit / "qualification/graphical")
    logical_counts = write_variant_matrix(kit, qualification, head, graphical_summary)
    # Record actual scope before finalizing. This is not an all-route pass claim.
    completion = {"schema": "goldmaps.owner-campaign.v1", "source_head": head, "engine_head": ENGINE,
                  "native_evidence_authority": qualification["native_evidence_authority"],
                  "native_population_mode": "REUSED_EXACT_INPUT_EVIDENCE" if reuse_receipt else "EXECUTED_CURRENT_CAMPAIGN",
                  "github_run_id": os.environ.get("GITHUB_RUN_ID"), "created_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                  "qualification": qualification["counts"], "optional_process": optional_result, "routes": route_summary,
                  "logical_counts": logical_counts,
                  "graphical_process": graphical_process, "graphical_summary": graphical_summary,
                  "owner_accepted": False, "physical_windows_nvidia": "OWNER_PENDING", "merge_disposition": "Draft/HOLD"}
    write_json(kit / "qualification/campaign.json", completion)
    archive = artifacts / ("CyberSand-GOLDMAPS-Owner-Evaluator-" + head[:12] + ".zip")
    acquisition = artifacts / "owner-package-acquisition.v1.json"
    final = seal(kit, head, acquisition, archive)
    write_json(artifacts / "archive-verification.json", final)
    (artifacts / (archive.name + ".sha256")).write_text(sha(archive) + "  " + archive.name + "\n", encoding="ascii")
    (artifacts / "owner-package-acquisition.v1.json.sha256").write_text(sha(acquisition) + "  " + acquisition.name + "\n", encoding="ascii")
    shutil.copyfile(HERE / "acquire_owner_package.py", artifacts / "acquire_owner_package.py")
    reconstructed = out / "Exact Reconstruction Check"
    execute("exact-reconstruction", [python, HERE / "acquire_owner_package.py", "--manifest", acquisition,
                                      "--manifest-sha256", sha(acquisition), "--out", reconstructed,
                                      "--cache", out / "cache", "--jobs", "8"], evidence, env, 1800)
    write_json(artifacts / "reconstruction-integrity.json", verify_directory(reconstructed, final["payload_manifest_sha256"]))
    # The full independently acquired tree has been checked; no execution is
    # claimed for it. The actual archive extraction below is the launch target.
    shutil.rmtree(reconstructed)
    fresh = out / "Freshly Extracted Owner Kit"
    with zipfile.ZipFile(archive) as opened:
        opened.extractall(fresh)  # Independent verify_zip already admitted every exact member/path/CRC.
    write_json(artifacts / "fresh-extraction-integrity.json", verify_directory(fresh, final["payload_manifest_sha256"]))
    execute("final-pristine-launcher", [python, commands / "qualification/run_fresh_launcher.py", "--package", fresh,
                                        "--out", evidence / "final-pristine-launcher"], evidence, env, 900)
    shutil.copyfile(evidence / "final-pristine-launcher/summary.json", artifacts / "final-pristine-launcher.json")
    execute("final-extracted-launcher", [python, commands / "qualification/run_product_qa.py", "--package", fresh,
                                         "--godot", fresh / godot.name, "--out", evidence / "final-extracted-product",
                                         "--disposable-test-profile", "--actual-windows-launcher"], evidence, env, 1200)
    shutil.copyfile(evidence / "final-extracted-product/summary.json", artifacts / "final-extracted-product.json")
    write_json(artifacts / "final-extracted-after.json", verify_directory(fresh, final["payload_manifest_sha256"], post_execution=True))
    write_json(artifacts / "campaign.json", {**completion, "archive": final["archive"], "acquisition_manifest_sha256": sha(acquisition),
                                           "actual_final_extracted_launcher": "PASS", "evidence_directory": "separate workflow evidence artifact"})
    (artifacts / "DOWNLOAD-THIS-KIT.md").write_text("# GOLDMAPS owner evaluator\n\nExtract the named `CyberSand-GOLDMAPS-Owner-Evaluator-*.zip` inside this artifact, then double-click `Open GOLDMAPS.cmd`.\n\nThe JSON/log files beside it are receipts and reconstruction inputs, not the game. The inner ZIP is the actual playable Windows kit.\n", encoding="utf-8")
    print("GOLDMAPS_OWNER_DELIVERY_COMPLETE " + json.dumps({"archive": str(archive), **final["archive"]}), flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
