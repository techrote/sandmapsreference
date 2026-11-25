#!/usr/bin/env python3
"""Replay the eight locked arms with an independently implemented decoder.

Usage: python scripts/goldmaps_finalisation/audit.py --sources <71-PR archive>
The report is deterministic and leaves all inputs untouched.
"""
from __future__ import annotations
import argparse
from pathlib import Path
import numpy as np
from core import (ENGINE, LEDGER, RECOVERY, connectivity, decode_setup, digest,
                  image_parity, json_load, source_dir, support, write_json)


def run(sources: Path):
    ledger = source_dir(sources,209,LEDGER)/"docs/corpus/astra-trial-001"
    originals = json_load(ledger/"experiment-manifest.v1.json")
    locked = {r["arm"]:r for r in json_load(ledger/"all-eight-output-lock.v1.json")["arms"]}
    contract = json_load(ledger/"preservation-contract.v1.json")
    catalogue = json_load(ledger/"material-catalogue.json")
    if catalogue["engine_head"] != ENGINE:
        raise ValueError("Catalogue engine identity changed")
    legal = {m["id"] for m in catalogue["materials"] if m["valid"]}
    hard = {m["id"] for m in catalogue["materials"] if m["valid"] and m["hard_surface"]}
    encodings = json_load(ledger/"qualification-original-encoding-amendment.v1.json")["image_encoding"]
    results = []
    for original in originals["arms"]:
        arm = original["arm"]; output = locked[arm]
        original_dir = source_dir(sources,original["pr"],original["head"])/original["map_directory"]
        output_path = source_dir(sources,output["output_pr"] or output["original_pr"],output["output_head"])/output["setup_path"]
        original_setup, before, before_info = decode_setup(original_dir/original["setup_filename"],legal)
        final_setup, after, after_info = decode_setup(output_path,legal)
        failures = []
        for label,actual,expected in [
            ("original_setup",before_info["setup_sha256"],original["setup_sha256"]),
            ("original_plane",before_info["plane_sha256"],original["source_grid_sha256_row_major_uint8"]),
            ("output_setup",after_info["setup_sha256"],output["setup_sha256"]),
            ("output_plane",after_info["plane_sha256"],output["grid_sha256_row_major_uint8"]),
        ]:
            if actual != expected:
                failures.append(label+" identity mismatch")
        if before.shape != after.shape or before.size != 2097152 or after.size != 2097152:
            raise ValueError(arm+" extent/coverage mismatch")
        changed = before != after
        changes = int(changed.sum())
        if changes != output["changed_cells"]:
            failures.append("Changed cell count differs from lock")
        nongeometry = [k for k in original_setup if k != "edits" and original_setup[k] != final_setup.get(k)]
        if nongeometry or set(final_setup) != set(original_setup):
            failures.append("Nongeometry fields changed")
        allowance = contract["arms"][arm]
        allowed = np.zeros_like(changed)
        for region in allowance.get("regions",[]):
            x,y,w,h = region["xywh"]; allowed[y:y+h,x:x+w] = True
        outside = int(np.count_nonzero(changed & ~allowed))
        if outside or changes > allowance["maximum_changed_cells"]:
            failures.append("Intervention allowance violated")
        fixture = json_load(ledger/f"fixtures/{arm}.v1.json")
        footprints = []
        for point in fixture["points"]:
            x,y = point["xy"]
            count = int(np.count_nonzero(changed[max(0,y-13):y+14,max(0,x-15):x+16]))
            if count:
                footprints.append({"site":point["id"],"changed_cells":count})
        if footprints:
            failures.append("Protected 31x27 site footprint changed")
        old_routes = connectivity(before,fixture,hard)
        new_routes = connectivity(after,fixture,hard)
        regressions, gains = [], []
        for old,new in zip(old_routes,new_routes):
            lost = sorted(set(old["reachable"])-set(new["reachable"]))
            gained = sorted(set(new["reachable"])-set(old["reachable"]))
            if lost:
                regressions.append({"case":old["case"],"envelope":old["envelope"],"lost_sites":lost})
            if gained:
                gains.append({"case":old["case"],"envelope":old["envelope"],"gained_sites":gained})
        if regressions:
            failures.append("Named-site static connectivity regression")
        b_support,b_unrooted = support(before,hard,arm=="B2")
        a_support,a_unrooted = support(after,hard,arm=="B2")
        new_unrooted = int(np.count_nonzero(changed & a_unrooted & np.isin(after,list(hard))))
        if new_unrooted:
            failures.append("New edited solid cells lack source boundary root")
        index_map = {int(k):v for k,v in encodings.get(arm,{}).get("map",{}).items()} or None
        if arm == "B2":
            palette_ids = sorted(map(int,json_load(original_dir/"design.json")["palette"]))
            index_map = dict(enumerate(palette_ids))
        original_image = image_parity(original_dir/"overview.png",before,index_map)
        if output["output_pr"]:
            candidate_image = image_parity(output_path.parent/"images/overview-after.png",after,palette=json_load(output_path.parent/"palette.json"))
        else:
            candidate_image = original_image.copy()
        if any(i["status"] != "PASS" for i in (original_image,candidate_image)):
            failures.append("Overview pixel parity not established")
        references = []
        if arm in ("D1","D2"):
            reference_pr = {"D1":203,"D2":208}[arm]
            reference_head = {"D1":"922a27926ea7338e9a1ce09fc64222b1094a9737","D2":"94eccd23024254fbbfb02cd6cdfef8753dd89c3c"}[arm]
            reference_dir = source_dir(sources,reference_pr,reference_head)
            reference_path = reference_dir/original["map_directory"]/'setup.json'
            rs,rg,ri = decode_setup(reference_path,legal)
            # The durable custody manifest independently binds reference bytes
            # to a complete immutable Git identity, rather than a folder prefix.
            custody_path=Path(__file__).resolve().parents[2]/'docs/corpus/goldmaps-finalisation-001/custody/master-artifacts.v1.json'
            master=json_load(custody_path)
            ref_relative=reference_path.relative_to(reference_dir).as_posix()
            expected=next(r for r in master['artifacts'] if r['source_pr']==reference_pr and r['commit']==reference_head and r['path']==ref_relative)
            if ri['setup_sha256']!=expected['sha256'] or ri['git_blob_sha1']!=expected['git_blob']:
                failures.append('Prior reworker reference source identity mismatch')
            references.append({"pr":reference_pr,"head":reference_head,"identity":ri,
                "changed_cells_from_original":int(np.count_nonzero(rg!=before)),
                "nongeometry_changed_fields":[k for k in original_setup if k!="edits" and rs.get(k)!=original_setup[k]],
                "role":"Prior reworker comparison, never an input to the frozen author experiment"})
        transitions = []
        codes = before[changed].astype(np.uint16)*256 + after[changed]
        for value,count in zip(*np.unique(codes,return_counts=True)):
            transitions.append({"from":int(value)//256,"to":int(value)%256,"cells":int(count)})
        results.append({"arm":arm,"status":"PASS" if not failures else "FAIL","failures":failures,
            "source_pr":original["pr"],"source_head":original["head"],"output_pr":output["output_pr"],"output_head":output["output_head"],
            "original":before_info,"candidate":after_info,"changed_cells":changes,
            "byte_identical_control":not output["output_pr"] and before_info["setup_sha256"]==after_info["setup_sha256"],
            "nongeometry_changed_fields":nongeometry,"changed_outside_allowance":outside,
            "protected_site_footprint_changes":footprints,"material_transitions":transitions,
            "route_regressions":regressions,"route_gains":gains,
            "routes_original":old_routes,"routes_candidate":new_routes,
            "support_original":b_support,"support_candidate":a_support,"new_unrooted_edited_solids":new_unrooted,
            "original_overview":original_image,"candidate_overview":candidate_image,"prior_reworker_references":references})
    return {"schema_version":"goldmaps-independent-replay.v1","source_recovery_head":RECOVERY,"ledger_head":LEDGER,"engine_head":ENGINE,
        "method":"Independent bytearray rectangle replay, brute integer discs, summed-area clearance, four-neighbour component labelling; historical creator/validator code is not imported.",
        "source_static_only":True,"owner_accepted":False,"status":"PASS" if all(r['status']=='PASS' for r in results) else "FAIL",
        "counts":{"arms":len(results),"positive_abstention_controls":sum(r['byte_identical_control'] for r in results),"changed_cells":sum(r['changed_cells'] for r in results)},
        "arms":results,
        "limits":["Static connectivity does not prove controlled flight, route completion, racing readability, structural strength or simulated mechanism operation.",
                  "No source file, frozen output, fixture, or expected failure was edited.","Historical failed attempts and metadata-only aliases remain separate evidence; they cannot be erased by these passing final outputs."]}


if __name__ == "__main__":
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--sources',type=Path,required=True)
    parser.add_argument('--output',type=Path,default=Path('docs/corpus/goldmaps-finalisation-001/technical/independent-replay.v1.json'))
    args=parser.parse_args()
    report=run(args.sources)
    write_json(args.output,report)
    print(report['status'],report['counts'])
    for row in report['arms']:
        print(row['arm'],row['status'],row['changed_cells'],row['failures'])
    raise SystemExit(0 if report['status']=='PASS' else 1)
