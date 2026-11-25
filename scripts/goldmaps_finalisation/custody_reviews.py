#!/usr/bin/env python3
"""Index exact historical review provenance without assigning new artistic acceptance."""
import argparse
import hashlib
import json
import re
from pathlib import Path


def record(comment, reviewed_head, verdict, role):
    return {"reviewed_head": reviewed_head, "verdict": verdict, "historical_role": role,
            "url": comment["url"], "comment_id": comment["id"],
            "account": comment.get("account", comment.get("user", {}).get("login")),
            "created_at": comment.get("created_at"), "updated_at": comment.get("updated_at"),
            "body_sha256": hashlib.sha256(comment["body"].encode()).hexdigest()}


def art_records(comments):
    rows = []
    for c in comments:
        body = c["body"]
        direct = re.match(r"CANVAS-ORIGINAL-ART-AUDIT:\s*([0-9a-f]{40})\s+(PASS|REWORK)", body)
        if direct:
            rows.append(record(c, direct[1], direct[2], "original specialist Art"))
            continue
        if body.startswith("PORTRAIT-REVIEW:") or body.startswith("INDEPENDENT PORTRAIT ART"):
            head = re.search(r"[0-9a-f]{40}", body[:250])
            verdict = re.search(r"verdict:\s*(PASS|REWORK)", body[:600], flags=re.I)
            if head and verdict:
                rows.append(record(c, head[0], verdict[1].upper(), "portrait transfer Art"))
    return rows


def build(directory: Path, inventory: Path):
    index = json.loads(inventory.read_text())
    sources = json.loads((directory / "source-discussions.v1.json").read_text())["sources"]
    heads = {x["pr"]: x["sha"] for name in ("gold25", "prepass") for x in index[name]}
    equivalents = {x["pr"]: x for x in json.loads((directory / "art-geometry-equivalence.v1.json").read_text())["records"]}
    rows = []
    for item in sources:
        pr = item["pr"]
        records = art_records(item["comments"])
        current = [r for r in records if r["reviewed_head"] == heads[pr]]
        status = current[-1]["verdict"] if current else "UNKNOWN_CURRENT_SPECIALIST_ART"
        equivalence = None
        if not current and pr in equivalents:
            e = equivalents[pr]
            equivalent = [r for r in records if r["reviewed_head"] == e["earlier_art_reviewed_commit"] and r["verdict"] == "PASS"]
            if equivalent and e["material_cells_identical"] and e["extent_identical"]:
                status = "PASS_SAME_MATERIAL_EARLIER_HEAD"
                equivalence = e
        rows.append({"pr": pr, "head": heads[pr], "historical_specialist_art_status": status,
                     "art_reviews": records, "material_equivalence": equivalence,
                     "owner_acceptance": "PENDING", "new_art_review_inferred": False})
    originals = []
    original_comments = json.loads((directory / "original-portrait-discussions.v1.json").read_text())["sources"]
    original_heads = {x["pr"]: x["sha"] for x in index["original_portraits"]}
    for item in original_comments:
        records = [r for r in art_records(item["comments"]) if r["reviewed_head"] == original_heads[item["pr"]]]
        if len(records) != 1:
            raise ValueError(f"Ambiguous original portrait review: {item['pr']}")
        originals.append({"pr": item["pr"], "head": original_heads[item["pr"]], "art_review": records[0],
                          "original_baseline_never_replaced_by_repair": True})
    counts = {v: sum(r["art_review"]["verdict"] == v for r in originals) for v in ("PASS", "REWORK")}
    if counts != {"PASS": 5, "REWORK": 7}:
        raise ValueError("Original portrait baseline differs from frozen 5 PASS / 7 REWORK")
    repairs = []
    repair_heads = {x["pr"]: x for x in index["repair_children"]}
    for item in json.loads((directory / "portrait-repair-discussions.v1.json").read_text())["repairs"]:
        source = repair_heads[item["pr"]]
        art = [r for r in art_records(item["comments"]) if r["reviewed_head"] == source["sha"]]
        tech = []
        for c in item["comments"]:
            first = c["body"][:500]
            if "INDEPENDENT PORTRAIT TECHNICAL" in first and source["sha"] in first and re.search(r"TECHNICAL PASS", first, re.I):
                tech.append(record(c, source["sha"], "PASS_SOURCE_STATIC_ONLY", "portrait technical"))
        if len(art) != 1 or art[0]["verdict"] != "PASS" or len(tech) != 1:
            raise ValueError(f"Missing exact repaired-HEAD Art/Technical pair: {source['pr']}")
        repairs.append({"pr": source["pr"], "head": source["sha"], "parent_pr": source["parent"],
                        "art_review": art[0], "technical_review": tech[0],
                        "native_status_from_these_reviews": "NOT_TESTED", "owner_acceptance": "PENDING",
                        "superseded_art_reviews": [r for r in art_records(item["comments"]) if r["reviewed_head"] != source["sha"]]})
    return {"schema_version": "goldmaps-review-provenance.v1", "source_records": rows,
            "original_portrait_baseline": {"counts": counts, "records": originals},
            "repair_children": repairs,
            "reviewer_independence_limit": "Role-labelled historical reviews are preserved; the shared GitHub account does not identify distinct human assessors.",
            "acceptance_limit": "This index verifies exact review/source references, not the artistic truth of their judgments or native/owner acceptance."}


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--custody-dir", required=True, type=Path)
    ap.add_argument("--inventory", required=True, type=Path)
    args = ap.parse_args()
    report = build(args.custody_dir, args.inventory)
    (args.custody_dir / "review-provenance.v1.json").write_text(json.dumps(report, indent=2) + "\n")
    print(f"PASS: {len(report['source_records'])} source records; original portraits 5 PASS / 7 REWORK; all seven current repairs exact Art + source-static Technical PASS")


if __name__ == "__main__":
    main()
