#!/usr/bin/env python3
"""Reuse an executed native population only across proved product-only changes.

The externally pinned predecessor is the actual playable ZIP. Its native
receipts retain their original source/run identities. This module does not
execute a World or promote an unqualified map; the changed product must pass
its own launcher, lifecycle, graphical and final-extraction campaign.
"""
from __future__ import annotations

import copy
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import zipfile

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
sys.path.insert(0, str(HERE.parent / "qualification"))
from verify_payload import MANIFEST, file_sha256 as sha, safe_path, strict_json, verify_directory, verify_zip
from prepare_runtime import ENGINE


def demand(condition, message):
    if not condition:
        raise ValueError("Native evidence reuse refused: " + message)


def digest(raw):
    return hashlib.sha256(raw).hexdigest()


def committed_bytes(path, head):
    safe_path(path)
    raw = subprocess.check_output(["git", "-C", str(ROOT), "show", head + ":" + path])
    demand((ROOT / path).read_bytes() == raw, "current source is not committed: " + path)
    return raw


def native_payload(path):
    return ((path.startswith("runtime/") and not path.startswith("runtime/project/goldmaps/"))
            or ("/" not in path and (path.startswith("Godot_") or path.lower().endswith(".dll")))
            or path.startswith("collection/setups/")
            or path in ("collection/native-inputs.v1.json", "collection/native-inputs-optional.v1.json"))


def normalize_roster(value):
    """Only the explicitly regenerated, byte-identical generator pin may vary."""
    value = copy.deepcopy(value)
    generator = value["authority"]["delivery_generator_source"]
    generator["commit"] = "REGENERATED_IDENTICAL_SOURCE"
    generator["url"] = "REGENERATED_IDENTICAL_SOURCE_URL"
    for row in value["maps"]:
        if row["id"] == "derived-183-policy":
            row["derived_source"]["commit"] = "REGENERATED_IDENTICAL_SOURCE"
            row["derived_source"]["generator_source"]["commit"] = "REGENERATED_IDENTICAL_SOURCE"
            row["derived_source"]["generator_source"]["url"] = "REGENERATED_IDENTICAL_SOURCE_URL"
    return value


def validate_generator_pins(roster, head):
    generator = roster["authority"]["delivery_generator_source"]
    path = "tools/goldmaps_owner/corpus/build_collection.py"
    demand(generator["repo"] == "techrote/sandmapsreference" and generator["path"] == path
           and generator["commit"] == head and generator["commit_bytes_verified"] is True
           and generator["url"] == "https://github.com/techrote/sandmapsreference/blob/" + head + "/" + path
           and generator["sha256"] == digest(committed_bytes(path, head)),
           "collection generator provenance does not bind its exact authority")
    descendants = [row for row in roster["maps"] if row["id"] == "derived-183-policy"]
    demand(len(descendants) == 1 and descendants[0]["derived_source"]["commit"] == head
           and descendants[0]["derived_source"]["generator_source"] == generator,
           "#183 generator provenance differs from its collection authority")


def reuse(artifact_dir: Path, request: dict, kit: Path, evidence: Path, source_head: str):
    archives = list(artifact_dir.glob("CyberSand-GOLDMAPS-Owner-Evaluator-*.zip"))
    demand(len(archives) == 1, "one actual predecessor kit is required")
    archive = archives[0]
    demand(sha(archive) == request["archive_sha256"], "externally pinned predecessor ZIP differs")
    verified = verify_zip(archive, request["payload_manifest_sha256"])
    demand(verified["engine_head"] == ENGINE, "predecessor engine is not the accepted delivery pin")
    outer = strict_json((artifact_dir / "campaign.json").read_bytes())
    native_head, native_run = request["source_head"], str(request["github_run_id"])
    demand(outer["source_head"] == native_head and str(outer["github_run_id"]) == native_run,
           "predecessor source/run differs")
    demand(outer["actual_final_extracted_launcher"] == "PASS", "predecessor campaign was incomplete")
    current = strict_json((kit / MANIFEST).read_bytes())
    verify_directory(kit)
    demand(current["engine_head"] == ENGINE and current["delivery_source_head"] == source_head,
           "new staging authority differs")
    current_index = {row["path"]: row for row in current["files"]}
    checks, unchanged, executed_files, raw_files, campaign_rows = [], [], {}, [], []
    with zipfile.ZipFile(archive) as opened:
        prefix = verified["envelope_directory"]

        def raw(path):
            safe_path(path)
            info = opened.getinfo(prefix + path)
            demand(info.file_size <= 64 * 1024 * 1024, "oversized metadata: " + path)
            return opened.read(info)

        def data(path):
            return strict_json(raw(path))

        prior = data(MANIFEST)
        demand(prior["delivery_source_head"] == native_head and prior["owner_accepted"] is False,
               "predecessor manifest has a different authority")
        prior_index = {row["path"]: row for row in prior["files"]}
        old_native = {path for path in prior_index if native_payload(path)}
        new_native = {path for path in current_index if native_payload(path)}
        demand(old_native == new_native, "runtime, bootstrap, dependency or Setup inventory changed")
        for path in sorted(old_native):
            old, new = prior_index[path], current_index[path]
            demand((old["bytes"], old["sha256"]) == (new["bytes"], new["sha256"]),
                   "native input bytes changed: " + path)
            unchanged.append({"path": path, "bytes": old["bytes"], "sha256": old["sha256"]})
        checks.append({"name": "exact accepted runtime, bootstraps, dependencies, Setups and native-input JSON", "pass": True,
                       "files": len(unchanged)})
        old_roster = data("collection/collection.v1.json")
        new_roster = strict_json((kit / "collection/collection.v1.json").read_bytes())
        validate_generator_pins(old_roster, native_head)
        validate_generator_pins(new_roster, source_head)
        demand(normalize_roster(old_roster) == normalize_roster(new_roster),
               "corpus identity, role, actors, geometry, science, owner state or scheduling changed")
        generator = old_roster["authority"]["delivery_generator_source"]
        demand(generator["commit"] == native_head and digest(committed_bytes(generator["path"], source_head)) == generator["sha256"],
               "collection generator changed")
        demand(digest(committed_bytes(generator["path"], native_head)) == generator["sha256"],
               "original committed generator differs from predecessor provenance")
        checks.append({"name": "complete roster unchanged except explicit regenerated generator commit metadata", "pass": True})
        route_path = request["route_contract"]["path"]
        route_raw = committed_bytes(route_path, source_head)
        demand(digest(route_raw) == request["route_contract"]["sha256"], "bounded route contract changed")
        demand(committed_bytes(route_path, native_head) == route_raw, "original committed route contract differs")
        route_contract = strict_json(route_raw)
        # The frozen route input is source-pinned separately because the old
        # native summary records each route result, not a copy of this file.
        checks.append({"name": "exact frozen route contract", "pass": True})
        previous_digests = set()
        input_names = {"windows-required": "collection/native-inputs.v1.json",
                       "windows-optional": "collection/native-inputs-optional.v1.json"}
        expected_counts = {"windows-required": (53, 44), "windows-optional": (28, 28)}
        for kind, input_path in input_names.items():
            base = "qualification/" + kind + "/"
            summary_raw = raw(base + "summary.json")
            summary = strict_json(summary_raw)
            demand(digest(summary_raw) == request["summary_sha256"][kind], "externally pinned native summary differs: " + kind)
            demand(summary["engine_head"] == ENGINE and summary["github_sha"] == native_head
                   and str(summary["github_run_id"]) == native_run
                   and summary["executed_source"]["checkout_head"] == native_head
                   and summary["executed_source"]["files_match_commit"] is True
                   and summary["runtime_kind"] == "shipped Windows project", "executed native authority differs: " + kind)
            demand(summary["inputs_sha256"] == current_index[input_path]["sha256"], "native admission input changed: " + kind)
            demand(summary["godot_sha256"] == current_index["Godot_v4.7-stable_win64_console.exe"]["sha256"],
                   "native Godot differs")
            demand(summary["profile"]["isolated"] is True and summary["profile"]["native_bridge"] is True,
                   "original profile/native bridge was not proved")
            demand((summary["aliases_checked"], summary["unique_setups_checked"]) == expected_counts[kind]
                   and summary["declared_campaign_aliases"] == summary["aliases_checked"], "incomplete native population: " + kind)
            if kind == "windows-required":
                demand(summary["validation_pass"] is True and summary["qualified_unique_setups"] == 42
                       and summary["verified_refused_unique_setups"] == 2, "required minimum is not qualified")
                demand({row["id"] for row in summary["route_results"]} == {row["id"] for row in route_contract["routes"]}
                       and len(summary["route_results"]) == len(route_contract["routes"]), "bounded route evidence is incomplete")
            else:
                demand(not summary["route_results"], "optional campaign unexpectedly claims routes")
            expected_harness = {"tools/goldmaps_owner/qualification/" + name for name in
                                ("run_native_collection.py", "native_probe.gd", "profile_probe.gd", "verify_payload.py")}
            demand(set(summary["executed_source"]["files"]) == expected_harness, "native source binding is incomplete")
            for path, expected in summary["executed_source"]["files"].items():
                actual = digest(committed_bytes(path, source_head))
                demand(actual == expected, "native harness changed: " + path)
                demand(digest(committed_bytes(path, native_head)) == expected, "original committed native harness differs: " + path)
                executed_files[path] = {"path": path, "native_sha256": expected, "current_sha256": actual}
            demand(summary["probe_sha256"] == executed_files["tools/goldmaps_owner/qualification/native_probe.gd"]["current_sha256"],
                   "native probe authority mismatch")
            inputs = strict_json((kit / input_path).read_bytes())["records"]
            aliases = {item["id"]: item["setup_sha256"] for item in inputs}
            results = summary["results"]
            result_digests = {item["setup_sha256"] for item in results}
            demand(len(results) == len(result_digests) == expected_counts[kind][1]
                   and result_digests == set(aliases.values()) and not (result_digests & previous_digests),
                   "native populations overlap, omit or substitute Setups")
            previous_digests |= result_digests
            demand({alias: row["setup_sha256"] for row in results for alias in row["aliases"]} == aliases,
                   "logical aliases differ from executed inputs")
            for result in results:
                demand(data(base + result["id"] + ".receipt.json") == result, "raw native receipt differs from summary")
                for phase, receipt in result["phases"].items():
                    demand(digest(raw(base + result["id"] + "." + phase + ".log")) == receipt["log_sha256"],
                           "native phase log differs")
                demand(result["qualification_status"] in ("QUALIFIED_HEADLESS", "REFUSED_INVALID_SOURCE", "UNQUALIFIED"),
                       "unknown native status")
            for route in summary["route_results"]:
                demand(data(base + route["id"] + ".receipt.json") == route
                       and digest(raw(base + route["id"] + ".log")) == route["log_sha256"], "raw route evidence differs")
                fixture_raw = raw(base + route["id"] + ".route.json")
                expected_fixture = next(item for item in route_contract["routes"] if item["id"] == route["id"])
                demand(strict_json(fixture_raw) == expected_fixture, "executed bounded route fixture differs from contract")
                observed = (route.get("evidence") or {}).get("route")
                if observed:
                    demand(observed["fixture_sha256"] == digest(fixture_raw), "observed route fixture hash differs")
            dest = evidence / kind
            dest.mkdir(parents=True, exist_ok=False)
            for path in sorted(prior_index):
                if not path.startswith(base):
                    continue
                remainder = path.removeprefix(base)
                demand("/" not in remainder and Path(remainder).suffix in (".json", ".log", ".png", ".md"),
                       "unexpected raw native evidence path")
                content = raw(path)
                (dest / remainder).write_bytes(content)
                raw_files.append({"path": path, "bytes": len(content), "sha256": digest(content)})
            campaign_rows.append({"kind": kind, "summary_sha256": digest(summary_raw),
                                  "qualified_unique_setups": summary["qualified_unique_setups"],
                                  "verified_refused_unique_setups": summary["verified_refused_unique_setups"],
                                  "unique_setups": summary["unique_setups_checked"]})
        demand(len(previous_digests) == 72, "complete distinct population is not preserved")
        checks.extend([{"name": "all native harness files match exact current committed bytes", "pass": True},
                       {"name": "complete disjoint 44 plus 28 native population retained verbatim", "pass": True}])
    result = {
        "schema": "goldmaps.owner-native-evidence-reuse.v1", "pass": True,
        "native_evidence_authority": {"source_head": native_head, "github_run_id": native_run,
                                      "archive_sha256": request["archive_sha256"],
                                      "payload_manifest_sha256": request["payload_manifest_sha256"]},
        "delivery_authority": {"source_head": source_head, "github_run_id": os.environ.get("GITHUB_RUN_ID"), "engine_head": ENGINE},
        "unchanged_payload_files": unchanged, "executed_source_files": list(executed_files.values()),
        "route_contract": request["route_contract"], "raw_native_files": raw_files,
        "campaigns": campaign_rows, "checks": checks,
        "regenerated_metadata": ["authority.delivery_generator_source.commit", "authority.delivery_generator_source.url",
                                 "derived-183-policy.derived_source.commit", "derived-183-policy.derived_source.generator_source.commit",
                                 "derived-183-policy.derived_source.generator_source.url"],
        "scope": "Retained actual native execution from the explicit predecessor source/run, proved byte-equivalent for all native inputs. No fresh all-map native execution, new owner acceptance or graphical acceptance is inferred. The current product is separately executed."
    }
    target = kit / "qualification/native-evidence-reuse.v1.json"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    return result, target
