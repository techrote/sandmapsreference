#!/usr/bin/env python3
"""Build a source-exact, deduplicated Goldmaps owner collection fragment.

This is additive delivery data, not a new artistic adjudication. All input URLs
are immutable and every acquired byte is checked against the frozen corpus.
The generated collection is offline; this build tool is never invoked by the
owner launcher. New qualification is an external overlay, not an inferred PASS.
"""
from __future__ import annotations

import argparse
import concurrent.futures
import copy
import hashlib
import json
import re
import shutil
import sys
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "scripts/goldmaps_finalisation"))
from core import decode_setup, digest, git_blob, json_load, safe_relative, write_json
from corpus import Corpus

ARCHIVE = "b9535405853a5cd16e4bba968ec7167222861c42"
EVIDENCE = "40f196f792e4d9e19bbd57fdafd6a90420fadf32"
FROZEN_ENGINE = "662df51cd8409a52332fa7ef15d06d8ab8945aed"
CONSUMER = "fe2395c7060dae736dc2e5dc8d1e4e050b2d2e52"
CARDS_SHA = "9153480ea622d5dc6a78543269840af64b3adbef43074af8cf78cfe685d0b057"
REPOSITORY = "techrote/sandmapsreference"
FROZEN = ROOT / "docs/corpus/goldmaps-finalisation-001"
GOLD = [106,109,125,130,131,136,143,146,147,148,150,153,155,159,163,168,174,175,176,179,182,184,193,197,207]
TITLES = {
    125: "Quoin Veil Split Faultwell / Vertical Census Escarpment",
    152: "Keelbone Switchback Recovery Tenements", 167: "Umbra Rotor Islet Works",
    170: "Brackenfold Tri-Vault Boreworks", 183: "Keel Ossuary — Broken-Back Ark Drydock",
    185: "Quoin Braided Census Faultwell", 186: "Orthant Rift Needle",
    188: "Mireward Lanternwell", 190: "Cinderfold Suture Lantern",
    191: "Cinderward Triptych Rotorcity", 192: "Spindlebreak Switchback Trestleworks",
    196: "Warden Gashlift", 202: "Quoin Braided Census Faultwell — repaired portrait",
    203: "Orthant Rift Needle — prior repair", 204: "Mireward Lanternwell — repaired portrait",
    205: "Cinderfold Suture Lantern — repaired portrait", 206: "Cinderward Triptych Rotorcity — repaired portrait",
    207: "Spindlebreak Switchback Trestleworks — repaired portrait", 208: "Warden Gashlift — prior repair",
    210: "Umbra Rotor Islet Works — Astra candidate", 211: "Warden Gashlift — Astra candidate",
    212: "Keelbone Switchback Recovery Tenements — Astra candidate",
    213: "Brackenfold Tri-Vault Boreworks — Astra candidate", 214: "Orthant Rift Needle — Astra candidate",
}
VERDICTS = {
    "B1": ("Positive uplift", "Inspect the bounded local architectural intervention and its preserved routing."),
    "B2": ("Positive uplift", "Inspect the bounded local architectural intervention and its protected open volume."),
    "B3": ("Intended racing/gameplay benefit inconclusive", "Compare at actual flight speed. Headless route probes cannot decide readability or playfeel."),
    "C1": ("Correct abstention; unchanged material plane", "The original and candidate are intentional logical aliases of exact unchanged source bytes."),
    "C2": ("Correct abstention; unchanged material plane", "The original and candidate are intentional logical aliases of exact unchanged source bytes."),
    "C3": ("Correct abstention; unchanged material plane", "The original and candidate are intentional logical aliases of exact unchanged source bytes."),
    "D1": ("Assessor disagreement retained", "Fresh randomized assessment preferred Astra; reference-aware assessment preferred the prior repair/reference. Choose after your own comparison."),
    "D2": ("Prior reworker reference preferred overall", "Prior reference preference is a research result, not owner adoption. Compare all three native variants."),
}


def acquire(identity: dict, cache: Path) -> bytes:
    """Read only immutable approved repository resources; verify before reuse."""
    expected = identity["sha256"]
    if not re.fullmatch(r"[a-f0-9]{64}", expected):
        raise ValueError("Bad source SHA-256")
    cached = cache / expected
    if cached.is_file():
        raw = cached.read_bytes()
    else:
        head = identity.get("head") or identity.get("commit")
        repo = identity.get("repository", REPOSITORY)
        if repo not in (REPOSITORY, "techrote/cybersand") or not re.fullmatch(r"[a-f0-9]{40}", str(head)):
            raise ValueError("Source must be an exact approved repository commit")
        name = safe_relative(identity["path"]).as_posix()
        url = f"https://raw.githubusercontent.com/{repo}/{head}/" + urllib.parse.quote(name, safe="/")
        cap = min(int(identity.get("bytes", 32*1024*1024)), 32*1024*1024)
        with urllib.request.urlopen(url, timeout=90) as response:
            raw = response.read(cap + 1)
        if len(raw) > cap:
            raise ValueError("Source exceeds its recorded size/bounded acquisition budget")
    if digest(raw) != expected or (identity.get("bytes") is not None and len(raw) != identity["bytes"]):
        raise ValueError(f"Source byte mismatch: {identity['path']}")
    if identity.get("git_blob_sha1") and git_blob(raw) != identity["git_blob_sha1"]:
        raise ValueError("Source Git object mismatch")
    cache.mkdir(parents=True, exist_ok=True)
    if not cached.exists():
        cached.write_bytes(raw)
    return raw


def source_descriptor(source: dict) -> dict:
    return {"repo": source.get("repository", REPOSITORY), "pr": source.get("pr"),
            "commit": source.get("head", source.get("commit")), "path": source["path"],
            "git_blob_sha1": source.get("git_blob_sha1"),
            "url": source.get("url"), "sha256": source["sha256"]}


def list_values(value) -> list[str]:
    if value is None: return []
    if isinstance(value, str): return [value]
    if isinstance(value, list): return [str(x) for x in value]
    return [json.dumps(value, sort_keys=True)]


def overview(row: dict) -> dict:
    extent = row["material_plane"]["extent"]
    choices = [x for x in row["images"] if x.get("dimensions") == extent]
    # Candidate image lists also contain their parents. Never choose "before".
    choices.sort(key=lambda x: ("after" not in x["path"], "before" in x["path"], x["path"]))
    if not choices or "before" in choices[0]["path"]:
        raise ValueError(f"No exact full-plane overview for PR{row['pr']}")
    return choices[0]


def copied_file(out: Path, name: str, raw: bytes, origin: dict, records: dict) -> str:
    relative = safe_relative(name).as_posix()
    if relative in records:
        if records[relative]["sha256"] != digest(raw): raise ValueError("Conflicting deduplicated path")
        return relative
    path = out / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(raw)
    records[relative] = {"path": relative, "bytes": len(raw), "sha256": digest(raw), "origin": origin}
    return relative


def local_frozen(out, relative, source, records, role):
    raw = source.read_bytes()
    return copied_file(out, relative, raw, {"kind": role, "repo": REPOSITORY, "commit": ARCHIVE,
        "path": source.relative_to(ROOT).as_posix(), "git_blob_sha1": git_blob(raw)}, records)


def historical_receipts() -> dict:
    receipt = json_load(FROZEN / "native/receipts/windows-final/summary.json")
    result = {}
    for item in receipt["results"]:
        load = item.get("phases", {}).get("load", {}).get("evidence", {})
        result[item["setup_sha256"]] = {
            "status": item.get("qualification_status", item.get("status", "UNKNOWN")),
            "pass": item.get("pass"), "engine_head": receipt["engine_head"],
            "platform": receipt["platform"], "run_id": receipt["github_run_id"],
            "source_checkout": receipt.get("executed_source", {}).get("executed_checkout_head"),
            "aliases": item["aliases"], "actor_adopted": load.get("actor_adopted"),
            "material_grid": load.get("grid_check"), "native_policy": load.get("native_policy"),
            "source": f"https://github.com/{REPOSITORY}/blob/{ARCHIVE}/docs/corpus/goldmaps-finalisation-001/native/receipts/windows-final/summary.json",
            "scope": "Historical hosted headless qualification only; never new delivery or graphical acceptance",
        }
    return result


def make_183(parent: dict, original: bytes, policy_source: bytes) -> tuple[bytes, dict]:
    value = json.loads(original)
    policy = json.loads(policy_source)["liquid_policy"]
    if value["liquid_policy"] != [0]*48:
        raise ValueError("#183 no longer matches the exact known invalid source")
    changed = copy.deepcopy(value)
    changed["liquid_policy"] = policy
    raw = (json.dumps(changed, ensure_ascii=False, separators=(",", ":")) + "\n").encode()
    if [k for k in value if value[k] != changed[k]] != ["liquid_policy"]:
        raise ValueError("Policy-only descendant changed other data")
    record = {"schema": "goldmaps.owner-policy-derivation.v1", "id": "derived-183-policy",
        "parent": source_descriptor(parent["source"]), "derived_setup_sha256": digest(raw),
        "changed_fields": ["liquid_policy"], "old_value": value["liquid_policy"], "new_value": policy,
        "operation": "Replace the invalid all-zero 48-word placeholder with the exact already native-validated frozen default envelope",
        "policy_source": {"repo": REPOSITORY, "commit": ARCHIVE,
            "path": "docs/corpus/goldmaps-finalisation-001/native/descendants/pr155-policy-repair/setup.json",
            "setup_sha256": digest(policy_source), "engine_head": FROZEN_ENGINE},
        "original_refusal": {"code": "malformed_policy", "detail": "bad magic"},
        "all_other_fields_equal": True, "actors_equal": True, "edits_equal": True,
        "material_plane_sha256": parent["material_plane"]["plane_sha256"],
        "default_semantics": {"water": "freemass_v1/reference", "other_admitted_liquids": "cellular_yield_v1/reference",
            "family_parameter_blocks": [], "material_parameter_blocks": [], "rule_radius_unchanged": value["rule_radius"],
            "normalization_unchanged": value["normalize"]},
        "source_evidence": {"generator": "build.py assigns liquid_policy:[0]*48 explicitly",
            "readme": "No scripted events or fluid in initial World; all retained occupied materials inert Solid / None",
            "url": f"https://github.com/{REPOSITORY}/blob/{parent['head']}/" + str(Path(parent['source']['path']).with_name('README.md'))},
        "semantic_equivalence_to_invalid_source": "UNPROVABLE: the refused zero envelope encodes no accepted policy",
        "classification": "Separate opt-in native-default integration candidate; outside Gold25",
        "owner_acceptance": "PENDING", "adoption_eligibility": "OWNER_DECISION_REQUIRED",
        "native_qualification": "PENDING_NEW_DELIVERY_QUALIFICATION", "historical_original_preserved": True}
    return raw, record


def build(out: Path, cache: Path, engine_head: str, qualify_all: bool = False) -> dict:
    if out.exists() and any(out.iterdir()):
        raise ValueError("Refuse to overwrite a populated collection fragment")
    out.mkdir(parents=True, exist_ok=True)
    corpus = Corpus(FROZEN / "corpus.v1.json").data
    if corpus["counts"]["maps"] != 70 or corpus["counts"]["owner_accepted"] != 0:
        raise ValueError("Frozen corpus population/acceptance changed")
    sources = {m["pr"]: m for m in corpus["maps"]}
    old_inputs = json_load(ROOT / "scripts/goldmaps_finalisation/native_inputs.v1.json")
    if len(old_inputs["records"]) != 51 or sorted({r["pr"] for r in old_inputs["records"] if r["id"].startswith("gold-")}) != GOLD:
        raise ValueError("Frozen minimum roster changed")
    requests = {m["source"]["sha256"]: m["source"] for m in corpus["maps"]}
    for m in corpus["maps"]:
        img = overview(m); requests[img["sha256"]] = img
    for feature in corpus["features"]:
        requests[feature["image"]["sha256"]] = feature["image"]
    card_identity = {"repository": "techrote/cybersand", "head": CONSUMER,
        "path": "godot/data/batch_lab/architectural_design_cards.v1.json", "sha256": CARDS_SHA}
    requests[CARDS_SHA] = card_identity
    print(f"Acquiring {len(requests)} unique immutable payloads", flush=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        acquired = dict(pool.map(lambda kv: (kv[0], acquire(kv[1], cache)), requests.items()))
    files = {}
    paths = {}; previews = {}; setups = {}; replay = {}
    for pr, m in sources.items():
        s = m["source"]; raw = acquired[s["sha256"]]
        name = copied_file(out, f"collection/setups/{s['sha256']}.json", raw, {"kind": "exact_source_setup", **source_descriptor(s)}, files)
        setup, grid, report = decode_setup(out/name)
        if report["plane_sha256"] != m["material_plane"]["plane_sha256"]:
            raise ValueError(f"Full material-plane identity changed for PR{pr}")
        paths[pr] = name; setups[pr] = setup; replay[pr] = report
        image = overview(m)
        image_name = copied_file(out, f"collection/previews/{image['sha256']}.png", acquired[image["sha256"]],
            {"kind": "original_material_plane_visualization", **source_descriptor(image)}, files)
        previews[pr] = {"path": image_name, "sha256": image["sha256"], "dimensions": image["dimensions"],
            "kind": "material_plane_visualization", "provenance": source_descriptor(image),
            "scope": "Exact source-authored one-pixel-per-cell material visualization; not a new graphical GPU capture"}
    descendant155_path = FROZEN / "native/descendants/pr155-policy-repair/setup.json"
    descendant155 = descendant155_path.read_bytes()
    derivation155 = json_load(descendant155_path.with_name("derivation.v1.json"))
    if digest(descendant155) != derivation155["derived_setup_sha256"]:
        raise ValueError("Recovered #155 descendant identity changed")
    raw183, derivation183 = make_183(sources[183], acquired[sources[183]["source"]["sha256"]], descendant155)
    descendants = {155: (descendant155, derivation155), 183: (raw183, derivation183)}
    derived_paths = {}
    for pr, (raw, derivation) in descendants.items():
        origin = {"kind": "recovered_policy_descendant" if pr==155 else "explicit_default_policy_descendant",
            "parent": source_descriptor(sources[pr]["source"]), "derivation": f"collection/derivations/pr{pr}.json"}
        if pr==155:
            origin.update({"repo": REPOSITORY, "commit": ARCHIVE, "path": descendant155_path.relative_to(ROOT).as_posix(), "git_blob_sha1": git_blob(raw)})
        name = copied_file(out, f"collection/setups/{digest(raw)}.json", raw, origin, files)
        setup, grid, report = decode_setup(out/name)
        parent = setups[pr]
        if {k: v for k,v in setup.items() if k!="liquid_policy"} != {k:v for k,v in parent.items() if k!="liquid_policy"}:
            raise ValueError("Policy-only descendant modified another field")
        if report["plane_sha256"] != replay[pr]["plane_sha256"]:
            raise ValueError("Policy-only material plane differs")
        derived_paths[pr] = (name, report)
        copied_file(out, f"collection/derivations/pr{pr}.json", (json.dumps(derivation, indent=2, sort_keys=True)+"\n").encode(),
            {"kind": "derivation_record", "original_preserved": True}, files)
    historical = historical_receipts()
    repair_parents = {x["repair_pr"]:x for x in corpus["comparative_families"] if x["repair_pr"]}
    reviews = json_load(FROZEN / "custody/review-provenance.v1.json")
    source_reviews = {r["pr"]: r for r in reviews["source_records"]}
    repair_reviews = {r["pr"]: r for r in reviews["repair_children"]}
    final_packet = json_load(FROZEN / "FINAL-DECISION-PACKET.json")
    logical = copy.deepcopy(old_inputs["records"])
    present = {x["pr"] for x in logical if x.get("input_kind") != "integration_descendant"}
    for pr, m in sources.items():
        if pr not in present:
            logical.append({"id": f"corpus-{pr}", "roles": ["corpus-reference"], "pr": pr, "head":m["head"],
                "path":m["source"]["path"], "setup_sha256":m["source"]["sha256"], "setup_bytes":m["source"]["bytes"],
                "extent":m["material_plane"]["extent"], "url":m["source"]["raw_url"]})
    logical.append({"id":"derived-183-policy", "roles":["post-experiment-descendant"], "pr":183,
        "head":sources[183]["head"], "path":sources[183]["source"]["path"],
        "setup_sha256":digest(raw183), "setup_bytes":len(raw183), "extent":sources[183]["material_plane"]["extent"],
        "input_kind":"integration_descendant"})
    records = []; targets = []; canonical = {}
    for item in logical:
        pr = item["pr"]; m = sources[pr]; mid = item["id"]
        derived = mid.startswith("derived-")
        setup_path, plane = derived_paths[pr] if derived else (paths[pr], replay[pr])
        if plane["setup_sha256"] != item["setup_sha256"]:
            raise ValueError("Logical alias mismatch")
        collections = []
        if mid.startswith("gold-"): collections.append("gold25")
        if mid.startswith("repair-"): collections.append("portraits")
        if mid.startswith("trial-"): collections.append("astra")
        if derived: collections.append("policy")
        if pr not in canonical and not derived:
            canonical[pr] = mid; collections.append("corpus")
        role = "policy-only descendant" if derived else "repaired portrait" if pr in repair_parents else "original"
        comparison = None
        if mid.startswith("trial-"):
            _, arm, suffix = mid.split("-",2)
            role = {"original":"original","candidate":"Astra candidate","reference":"prior reworker reference"}[suffix]
            comparison = {"arm":arm,"role":suffix,"family_id":"astra-"+arm,
                "frozen_result":VERDICTS[arm][0],"owner_prompt":VERDICTS[arm][1]}
        metadata = m.get("metadata") or {}
        family = metadata.get("family") or "Unspecified family"
        topology = list_values(metadata.get("macro_topology"))
        axes = metadata.get("diversity_axes") or {}
        tags = sorted(set(topology + [str(x) for values in axes.values() for x in (values if isinstance(values,list) else [values])]))
        refusal = pr in (155,183) and not derived
        required = mid in {r["id"] for r in old_inputs["records"]} or pr==183
        entry = {"id":mid,"title":TITLES.get(pr,m["name"])+( " — native-default policy variant" if derived else ""),
            "original_title":m["name"],"collections":collections,"source":source_descriptor(m["source"]),
            "source_corpus_id":m["id"],"variant_role":role,"parent_id":None,
            "setup":{"path":setup_path,"sha256":plane["setup_sha256"],"bytes":plane["setup_bytes"],
                "schema":2,"dimensions":plane["extent"],"material_plane_sha256":plane["plane_sha256"],
                "material_plane_encoding":"row-major uint8; full extent; Empty=0; x right, y down",
                "bundled":True,"immutable_source":True},
            "preview":copy.deepcopy(previews[pr]),"orientation":m["aspect_ratio"],"family":family,"tags":tags,
            "topology":topology,"palette":plane["materials"],"actors":setups[pr]["actors"],
            "authored_selected_actor":setups[pr]["selected"],"authored_settings":{k:setups[pr][k] for k in ("response","normalize","rule_radius","material","brush","fire")},
            "protected_feature_ids":m["atlas_feature_ids"],"historical_roles":m["roles"],
            "art":{"historical_gold_nomination":m["historical_gold_nomination"],"current_recommendation":m["current_recommendation"],
                "frozen_finalisation_recommendation":"Gold nominee; owner pending" if pr in GOLD and not derived else None,
                "finalisation_recommendation_source":f"https://github.com/{REPOSITORY}/blob/{ARCHIVE}/docs/corpus/goldmaps-finalisation-001/FINAL-DECISION-PACKET.json",
                "finalisation_support":final_packet["gold_recommendation"] if pr==125 and not derived else None,
                "historical_specialist_review":source_reviews.get(pr),
                "portrait_art_review":repair_reviews.get(pr,{}).get("art_review"),
                "superseded_portrait_art_reviews":repair_reviews.get(pr,{}).get("superseded_art_reviews",[]),
                "note":"Finalisation explicitly retains exact-source specialist support for #125 to complete the25; earlier conditional history and the earlier custody review's UNKNOWN status remain historical records, not the final recommendation." if pr==125 else "No automatic classification."},
            "source_static_qualification":{"corpus_replay":m["source_static_qualification"],
                "portrait_technical_review":repair_reviews.get(pr,{}).get("technical_review"),
                "native_status_from_portrait_reviews":repair_reviews.get(pr,{}).get("native_status_from_these_reviews"),
                "scope":"Art, independent source-static technical review and native execution are distinct observations."},
            "native":{"eligibility":"refused" if refusal else "pending" if required or qualify_all else "reference_only",
                "status":"REFUSED_INVALID_SOURCE" if refusal else "PENDING_DELIVERY_QUALIFICATION" if required or qualify_all else "NOT_IN_REQUIRED_PLAYABLE_MATRIX",
                "expected_policy":"refuse" if refusal else "admit", "refusal_reason":"malformed_policy / bad magic" if refusal else None,
                "historical":historical.get(plane["setup_sha256"]),"delivery_evidence":None,
                "scope":"Historical native evidence and fresh delivery qualification are independent fields."},
            "graphical":{"status":"OWNER_PHYSICAL_PENDING","preview_is_gpu_capture":False},
            "owner":{"status":"pending","classification":None,"accepted":False},"owner_accepted":False,
            "comparison":comparison,"required_delivery_roster":required,
            "rights":{"license":"UNKNOWN / no map-specific license established by frozen corpus",
                "attribution":"Exact source repository/PR/commit retained; individual human authorship unverified",
                "reuse":"Owner evaluation and reference corpus only; no general training or redistribution permission inferred"}}
        if derived:
            entry["parent_id"] = "gold-155" if pr==155 else "corpus-183"
            entry["derivation_path"] = f"collection/derivations/pr{pr}.json"
            entry["source"]["role"] = "original_parent; descendant custody is separately identified"
            entry["derived_source"] = {"repo":REPOSITORY,"commit":ARCHIVE if pr==155 else None,
                "path":descendant155_path.relative_to(ROOT).as_posix() if pr==155 else "tools/goldmaps_owner/corpus/build_collection.py:make_183",
                "sha256":plane["setup_sha256"],"kind":"recovered_original_descendant" if pr==155 else "deterministic_policy_only_derivation"}
            entry["native"]["adoption_eligibility"] = "OWNER_DECISION_REQUIRED; invalid original policy equivalence is not asserted"
        if pr in repair_parents and not derived:
            p = repair_parents[pr]
            entry["variant_relationship"] = {"kind":"portrait-repair","parent_pr":p["portrait_pr"],"parent_commit":p["portrait_head"],
                "donor_pr":p["donor_pr"],"donor_commit":p["donor_head"]}
        records.append(entry)
        if required or qualify_all:
            target=copy.deepcopy(item)
            target["package_path"]=setup_path; target["material_plane_sha256"]=plane["plane_sha256"]
            if refusal:target["expected_native_refusal"]={"code":"malformed_policy","detail":"bad magic"}
            targets.append(target)
    if len(canonical)!=70: raise ValueError("All-corpus canonical view is incomplete")
    id_by_pr = canonical
    for record in records:
        if record.get("variant_relationship"):
            record["parent_id"] = id_by_pr[record["variant_relationship"]["parent_pr"]]
    collection = {"schema":"goldmaps.owner-collection.v1","title":"GOLDMAPS — Owner Collection",
        "authority":{"repository":REPOSITORY,"archival_commit":ARCHIVE,"scientific_evidence_commit":EVIDENCE,
            "frozen_scientific_engine":FROZEN_ENGINE,"delivery_engine":engine_head,"owner_accepted":0,
            "disposition":"Draft/HOLD","classification_authority":"Explicit owner-local choices only"},
        "collections":[{"id":"gold25","title":"Gold25 nominees"},{"id":"portraits","title":"Repaired portraits"},
            {"id":"astra","title":"Astra comparisons"},{"id":"corpus","title":"All 70 source maps"},{"id":"policy","title":"Policy-only variants"}],
        "maps":records,"counts":{"logical_entries":len(records),"corpus_maps":70,"gold_nominee_aliases":25,
            "portrait_repair_aliases":7,"astra_comparison_aliases":18,"policy_descendants":2,
            "unique_bundled_setups":len({r['setup']['sha256'] for r in records}),
            "qualification_target_aliases":len(targets),"qualification_target_unique_setups":len({r['setup_sha256'] for r in targets}),
            "fresh_qualified_playable_setups":0,"owner_accepted":0},
        "decision_guide":"collection/DECISION-GUIDE.md",
        "qualification_overlay":"collection/delivery-qualification.v1.json",
        "comparison_cards":"collection/comparisons.v1.json",
        "notes":["Logical aliases share payload only by exact Setup SHA-256, never by visual resemblance.",
            "All source files are immutable inputs. Saves and decisions belong in the isolated evaluation workspace.",
            "No 70-map universal native qualification is inferred from this index."]}
    write_json(out/"collection/collection.v1.json",collection)
    write_json(out/"collection/native-inputs.v1.json",{"schema":"goldmaps.owner-native-inputs.v1","engine_head":engine_head,
        "scientific_engine_head":FROZEN_ENGINE,"records":targets,"scope":"New delivery targets; each actual execution/refusal must be recorded separately"})
    comparisons=[]
    key=json_load(FROZEN/"science/comparisons/answer-key.v1.json")
    for case in key["cases"]:
        views=[]
        for p in sorted((FROZEN/"science/comparisons/neutral"/case["case"]).glob("*.png")):
            path=local_frozen(out,"collection/comparisons/"+case["case"]+"/"+p.name,p,files,"archived_neutral_material_comparison")
            views.append({"path":path,"sha256":digest(p.read_bytes()),"kind":"archived_neutral_material_comparison"})
        arm=case["arm"]
        site_views=copy.deepcopy(case["views"])
        for view in site_views:
            view["archived_source_image_path"]=view["image"]
            view["image"]="collection/comparisons/"+case["case"]+"/"+Path(view["image"]).name
        comparisons.append({"arm":arm,"title":case["name"],"frozen_result":VERDICTS[arm][0],"owner_question":VERDICTS[arm][1],
            "variants":[{"id":f"trial-{arm}-{v['role']}","neutral_label":v["label"],"source_pr":v["pr"],"source_commit":v["head"]} for v in case["variants"]],
            "site_views":site_views,"archived_images":views,
            "scope":"Sequential gameplay comparisons are independent Worlds. Images preserve the frozen scientific review; no new preference is asserted."})
    write_json(out/"collection/comparisons.v1.json",{"schema":"goldmaps.owner-comparisons.v1","scientific_evidence_commit":EVIDENCE,"cards":comparisons})
    knowledge=build_export(corpus,records,canonical,previews,acquired,out,files,card_identity)
    shutil.copyfile(Path(__file__).with_name("DECISION-GUIDE.md"),out/"collection/DECISION-GUIDE.md")
    shutil.copyfile(Path(__file__).with_name("BATCH-LAB-HANDOFF.md"),out/"corpus-export/BATCH-LAB-HANDOFF.md")
    (out/"corpus-export/tools").mkdir(parents=True,exist_ok=True)
    shutil.copyfile(Path(__file__).with_name("query.py"),out/"corpus-export/tools/query.py")
    for p in sorted(out.rglob("*")):
        if not p.is_file():continue
        rel=p.relative_to(out).as_posix()
        if rel not in files:
            files[rel]={"path":rel,"bytes":p.stat().st_size,"sha256":digest(p.read_bytes()),"origin":{"kind":"deterministic_delivery_metadata","generator":"tools/goldmaps_owner/corpus/build_collection.py","archive":ARCHIVE}}
    manifest={"schema":"goldmaps.owner-collection-files.v1","archival_commit":ARCHIVE,
        "counts":{"files":len(files),"bytes":sum(r["bytes"] for r in files.values())},
        "manifest_self_excluded":True,"files":list(files.values())}
    write_json(out/"collection/collection-files.v1.json",manifest)
    print(json.dumps(collection["counts"],indent=2),flush=True)
    return collection


def build_export(corpus, records, canonical, previews, acquired, out, files, card_identity):
    maps_by_pr={r["source"]["pr"]:r for r in records if "corpus" in r["collections"]}
    family_groups={}
    for f in corpus["comparative_families"]:
        group=f"portrait-donor-{f['donor_pr']}"
        for key in ("donor_pr","portrait_pr","repair_pr"):
            if f[key]:family_groups.setdefault(f[key],[]).append(group)
    features=[]
    for f in corpus["features"]:
        item=copy.deepcopy(f); image=f["image"]
        target=copied_file(out,f"corpus-export/crops/{image['sha256']}.png",acquired[image["sha256"]],
            {"kind":"exact_frozen_feature_evidence_crop",**source_descriptor(image)},files)
        item["bundled_image_path"]=target; item["kind"]="evidence_crop; not module geometry or edit mask"
        features.append(item)
    maps=[]
    for m in corpus["maps"]:
        r=maps_by_pr[m["pr"]]
        maps.append({"id":m["id"],"collection_id":canonical[m["pr"]],"source":r["source"],"title":r["title"],
            "setup":r["setup"],"material_plane":m["material_plane"],"orientation":m["aspect_ratio"],
            "architectural_family":r["family"],"topology":r["topology"],"tags":r["tags"],
            "visual_family_groups":family_groups.get(m["pr"],[f"source-pr-{m['pr']}"]),
            "source_authored_metadata":m.get("metadata"),"annotation_authority":"source-authored; not proven native function or inferred sockets",
            "protected_feature_ids":m["atlas_feature_ids"],"native":r["native"],"owner_accepted":False,
            "source_static_qualification":m["source_static_qualification"],"rights":r["rights"],"preview":previews[m["pr"]]})
    modules=[{"id":"hint-"+f["feature_id"],"source_feature_id":f["feature_id"],"source_state_id":f["state_id"],
        "source_pr":f["child_pr"],"source_commit":f["child_head"],"kind":"inferred_semantic_module_candidate",
        "observed":f["observed"],"evidence_window_xywh":f["crop_rect_xywh"],"verified_feature_bbox_xyxy":f["feature_bbox_xyxy"],
        "attachments":[],"attachment_status":"UNKNOWN; requires actual native geometry and authored connector contract",
        "clearance_hints":f["do_not_fill"],"must_preserve":f["must_preserve"],"geometry_included":False,
        "native_module_import_eligible":False,"owner_accepted":False,"transforms_permitted":["identity for inspection only"],
        "scope":"A candidate for deliberate later harvest, never an owner-approved reusable part or inferred functioning machine"} for f in features]
    knowledge={"schema_version":"goldmaps.architectural-knowledge.v1","version":1,
        "authority":{"kind":"reference_knowledge_only","execution_authority":False,"owner_accepted":False,
            "repository":REPOSITORY,"archival_commit":ARCHIVE,"scientific_evidence_commit":EVIDENCE,
            "corpus_sha256":digest((FROZEN/'corpus.v1.json').read_bytes())},
        "coordinate_convention":{"origin":"top-left material cell","x":"right","y":"down",
            "extent":"[width,height]","crop_window":"[x,y,width,height]; positive sizes; exclusive end x+width,y+height",
            "material_plane":"complete row-major uint8 source-static identity; consumer native modules use little-endian uint16",
            "evidence_windows_are_edit_masks":False,"unknown_feature_bbox":None},
        "maps":maps,"protected_features":features,"immutable_feature_states":corpus["feature_history"],
        "comparative_families":corpus["comparative_families"],"relationships":corpus["relationships"],
        "negative_interventions":corpus["negative_examples"],"module_candidates":modules,
        "failed_attempt_custody":{"recovered_file_occurrences":154,"recorded_file_occurrences":182,"hash_only_missing_occurrences":28,
            "meaning":"Missing bytes remain missing; no reconstructed success is invented"},
        "qualification_overlay":"collection/delivery-qualification.v1.json",
        "consumer_compatibility":{"consumer_repo":"techrote/cybersand","source_commit":CONSUMER,"pr":770,
            "cards_path":"corpus-export/batch-lab/architectural_design_cards.v1.json","cards_sha256":CARDS_SHA,
            "native_setup_import":"Ordinary Workbench admission; subsequent native-region harvest is a separate action",
            "native_module_import":"NOT_ADMITTED: whole maps, images and semantic candidates are not module programs"},
        "holdout_policy":{"preserve_visual_family_groups":True,"default_use":"reference browsing only",
            "consumer_sealed_families":["bioindustrial","civic","vessel_dock"],
            "restriction":"Do not add this expanded corpus or negatives to a sealed evaluation population; consumer must explicitly preserve its exclusions before retrieval"},
        "counts":{"maps":70,"current_protected_features":27,"immutable_feature_states":76,"comparative_families":12,"negative_interventions":5,"owner_accepted":0},
        "safeguards":corpus["safeguards"]}
    write_json(out/"corpus-export/knowledge.v1.json",knowledge)
    copied_file(out,"corpus-export/batch-lab/architectural_design_cards.v1.json",acquired[CARDS_SHA],
        {"kind":"unchanged_existing_consumer_compatibility_cards",**source_descriptor(card_identity)},files)
    local_frozen(out,"corpus-export/frozen/corpus.v1.json",FROZEN/"corpus.v1.json",files,"frozen_read_only_corpus")
    local_frozen(out,"corpus-export/frozen/corpus.v1.lock.json",FROZEN/"corpus.v1.lock.json",files,"frozen_corpus_lock")
    local_frozen(out,"corpus-export/frozen/FINAL-DECISION-PACKET.md",FROZEN/"FINAL-DECISION-PACKET.md",files,"frozen_scientific_decision")
    local_frozen(out,"corpus-export/frozen/FINAL-DECISION-PACKET.json",FROZEN/"FINAL-DECISION-PACKET.json",files,"frozen_scientific_decision")
    return knowledge


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out",type=Path,required=True)
    parser.add_argument("--cache",type=Path,required=True)
    parser.add_argument("--engine-head",default=FROZEN_ENGINE)
    parser.add_argument("--qualify-all",action="store_true",help="Explicitly target all corpus Setups; does not mark them qualified")
    args=parser.parse_args()
    if not re.fullmatch(r"[a-f0-9]{40}",args.engine_head):raise ValueError("Exact engine source commit required")
    build(args.out,args.cache,args.engine_head,args.qualify_all)


if __name__=="__main__":main()
