#!/usr/bin/env python3
"""Reproduce neutral, source-cell comparison images without executing builders.

Requires Pillow and NumPy. Inputs are the verified source-archive layout and
immutable recovery snapshot. All paths and hashes are recorded in answer-key.
The neutral directory deliberately omits authorship, PRs, arm names and filenames.
"""
from __future__ import annotations
import argparse
import hashlib
import json
from pathlib import Path
import random

import numpy as np
from PIL import Image, ImageDraw

SEED = "goldmaps-finalisation-001:postlock:8d1341fb:2026-11-23"


def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def read(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def write(path: Path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def source_root(archive: Path, pr: int, head: str) -> Path:
    path = archive / f"PR-{pr:04d}-{head[:12]}"
    if not path.is_dir():
        raise ValueError(f"Missing exact source directory {path}")
    return path


def decode(path: Path):
    document = read(path)
    if document["version"] != 2:
        raise ValueError("Only frozen Setup-v2 is supported")
    width, height = document["extent"]
    plane = np.zeros((height, width), dtype=np.uint8)
    occupied = np.zeros_like(plane, dtype=np.uint8)
    overlaps = 0
    for record in document["edits"]:
        if isinstance(record, dict):
            x, y, w, h, material = [record[k] for k in ("x", "y", "w", "h", "material")]
        else:
            x, y, w, h, material = record
        if any(type(v) is not int for v in (x, y, w, h, material)):
            raise ValueError("Noninteger material rectangle")
        if not (x >= 0 and y >= 0 and w > 0 and h > 0 and x+w <= width and y+h <= height and 0 <= material <= 255):
            raise ValueError("Out-of-bounds rectangle or material")
        overlaps += int(occupied[y:y+h, x:x+w].sum())
        occupied[y:y+h, x:x+w] = 1
        plane[y:y+h, x:x+w] = material
    # Some original authoring contracts permit ordered overlay; record it, never
    # silently relabel a final lossless replay as disjoint.
    return plane, {"setup_sha256": sha(path.read_bytes()), "plane_sha256": sha(plane.tobytes()),
                   "extent": [width, height], "rectangle_overlap_occurrences": overlaps,
                   "default_void_cells": int((occupied == 0).sum())}


def image_for(plane, palette):
    unknown = sorted(set(map(int, np.unique(plane))) - set(map(int, palette)))
    if unknown:
        raise ValueError(f"Missing material palette entries: {unknown}")
    lut = np.zeros((256, 3), dtype=np.uint8)
    for material, rgb in palette.items():
        lut[int(material)] = rgb
    return Image.fromarray(lut[plane], "RGB")


def panel(images, labels, title, out, divisor=1):
    scaled = [im.resize((im.width//divisor, im.height//divisor), Image.Resampling.NEAREST) for im in images]
    gap, top = 12, 48
    result = Image.new("RGB", (sum(im.width for im in scaled) + gap*(len(images)+1), max(im.height for im in scaled)+top+gap), (245,245,245))
    draw = ImageDraw.Draw(result)
    draw.text((gap, 6), title, fill=(20,20,20))
    x = gap
    for label, im in zip(labels, scaled):
        draw.text((x, 27), label, fill=(20,20,20))
        result.paste(im, (x, top)); x += im.width+gap
    out.parent.mkdir(parents=True, exist_ok=True)
    result.save(out)


def build(archive: Path, recovery: Path, out: Path):
    manifest = read(recovery / "snapshot/experiment-manifest.v1.json")
    locks = {r["arm"]: r for r in read(recovery / "snapshot/all-eight-output-lock.v1.json")["arms"]}
    ledger = source_root(archive, 209, "5982fa553bc6356742cfea0911c848c372dcdb97") / "docs/corpus/astra-trial-001"
    roster = list(manifest["arms"])
    random.Random(SEED).shuffle(roster)
    key = {"schema_version": "goldmaps.comparison-key.v1", "seed": SEED,
           "rubric_sha256": sha((Path(__file__).parent/"rubric.v1.json").read_bytes()),
           "rubric_commit": "d94ea98ba07f006db9a8dcfdb994d56cba5e35ca",
           "image_policy": "Exact uint8 material-plane replay, frozen per-case palette, no texture/noise, same world coordinates for all variants. Every native crop pixel represents one material cell. Full-resolution overviews are supplied separately. Overview panels are nearest-neighbour 1:2 inspection aids only.",
           "fully_blinded_team": False, "cases": []}
    neutral = {"schema_version": "goldmaps.neutral-comparison.v1", "policy": key["image_policy"], "cases": []}
    for number, arm in enumerate(roster, 1):
        arm_id = arm["arm"]; lock = locks[arm_id]; case = f"case-{number:02d}"
        origin_root = source_root(archive, arm["pr"], arm["head"])
        origin = origin_root / arm["map_directory"] / arm["setup_filename"]
        candidate_pr = lock["output_pr"] or arm["pr"]
        candidate_root = source_root(archive, candidate_pr, lock["output_head"])
        candidate = candidate_root / lock["setup_path"]
        variants = [("original", arm["pr"], arm["head"], origin), ("candidate", candidate_pr, lock["output_head"], candidate)]
        if arm_id in ("D1", "D2"):
            reference_pr = {"D1":203, "D2":208}[arm_id]
            reference_root = sorted(archive.glob(f"PR-{reference_pr:04d}-*"))[0]
            reference_head = read(ledger/"owner-kit/owner-bundle-manifest.v1.json")
            # Full exact source identity is read from the recovered custody index,
            # never inferred from the directory's shortened head.
            inventory = read(recovery/"inventory.v1.json")
            candidates = []
            def find_identity(value):
                if isinstance(value, dict):
                    if value.get("pr") == reference_pr:
                        for k in ("sha", "head_sha", "head"):
                            h=value.get(k)
                            if isinstance(h,str) and len(h)==40: candidates.append(h)
                    for v in value.values(): find_identity(v)
                elif isinstance(value,list):
                    for v in value: find_identity(v)
            find_identity(inventory)
            if len(set(candidates))!=1: raise ValueError("Ambiguous reference identity")
            reference_head = candidates[0]
            if not reference_root.name.endswith(reference_head[:12]): raise ValueError("Reference path identity mismatch")
            variants.append(("reference", reference_pr, reference_head, reference_root/arm["map_directory"]/arm["setup_filename"]))
        random.Random(SEED+":"+arm_id).shuffle(variants)
        palette = read(ledger/f"owner-kit/maps/{arm_id}/palette.json")
        if arm_id.startswith("C"):
            receipt=read(origin.parent/"receipt.json")
            source_views=receipt.get("images",receipt.get("indexed_images"))
            crops=[(v["name"],v.get("rect",v.get("origin",[])+v.get("extent",[]))) for v in source_views if "overview" not in v["name"]]
        else:
            crops=read(candidate.parent/"build-config.json")["crops"]
        rec={"case":case,"arm":arm_id,"name":arm["name"],"variants":[],"views":[]}
        images=[]; labels=[]
        for idx,(role,pr,head,path) in enumerate(variants):
            plane, facts=decode(path)
            expected=arm["source_grid_sha256_row_major_uint8"] if role=="original" else lock["grid_sha256_row_major_uint8"] if role=="candidate" else None
            if expected and facts["plane_sha256"]!=expected: raise ValueError("Plane lock mismatch")
            label=chr(65+idx); im=image_for(plane,palette); images.append(im); labels.append(label)
            target=out/"neutral"/case/f"{label}-overview-native.png";target.parent.mkdir(parents=True,exist_ok=True);im.save(target)
            rec["variants"].append({"label":label,"role":role,"pr":pr,"head":head,"source_path":str(path.relative_to(archive)),**facts,
                                    "image":str(target.relative_to(out)),"image_sha256":sha(target.read_bytes())})
        panel(images,labels,f"{case} | full world | scale 1:2",out/"neutral"/case/"overview.png",divisor=2)
        for n,(source_name,rect) in enumerate(crops,1):
            x,y,w,h=rect
            if min(x,y)<0 or min(w,h)<=0 or any(x+w>im.width or y+h>im.height for im in images): raise ValueError("Invalid evidence crop")
            name=f"detail-{n:02d}.png"
            panel([im.crop((x,y,x+w,y+h)) for im in images],labels,f"{case} | world x={x}, y={y}, w={w}, h={h} | scale 1:1",out/"neutral"/case/name)
            rec["views"].append({"image":str(Path("neutral")/case/name),"source_evidence_name":source_name,"world_xywh":rect,"geometry_mask":False})
        key["cases"].append(rec)
        neutral["cases"].append({"case":case,"labels":labels,"overview":f"{case}/overview.png","native_overviews":[f"{case}/{label}-overview-native.png" for label in labels],"details":[{"file":f"{case}/detail-{n:02d}.png","world_xywh":rect,"geometry_mask":False} for n,(_,rect) in enumerate(crops,1)]})
    write(out/"answer-key.v1.json",key)
    write(out/"neutral/index.v1.json",neutral)
    commitment={"schema_version":"goldmaps.comparison-commitment.v1","answer_key_sha256":sha((out/"answer-key.v1.json").read_bytes()),"rubric_sha256":key["rubric_sha256"],"rubric_commit":key["rubric_commit"],"neutral_index_sha256":sha((out/"neutral/index.v1.json").read_bytes()),"case_count":len(roster),"fully_blinded_team":False,"assessor_rule":"Do not open answer-key until score submission; all original team assessments remain explicitly mapping-exposed."}
    write(out/"commitment.v1.json",commitment)
    print(json.dumps(commitment,indent=2))


if __name__ == "__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--archive",type=Path,required=True)
    parser.add_argument("--recovery",type=Path,required=True)
    parser.add_argument("--out",type=Path,required=True)
    args=parser.parse_args();build(args.archive,args.recovery,args.out)
