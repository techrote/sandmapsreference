#!/usr/bin/env python3
"""Offline Goldmaps reference queries, exact evidence crops and source replay.

Python standard library only. This reads a collection fragment or extracted
owner kit; it never executes imported code or writes to the native World.
"""
from __future__ import annotations
import argparse
import copy
import hashlib
import json
import math
from pathlib import Path, PurePosixPath
import re

GOLD={106,109,125,130,131,136,143,146,147,148,150,153,155,159,163,168,174,175,176,179,182,184,193,197,207}


def sha(raw):return hashlib.sha256(raw).hexdigest()


def read_json(path):
    def reject(v):raise ValueError("Non-finite JSON constant: "+v)
    def no_duplicates(pairs):
        result={}
        for key,value in pairs:
            if key in result:raise ValueError("Duplicate JSON member: "+key)
            result[key]=value
        return result
    return json.loads(Path(path).read_text(encoding="utf-8"),parse_constant=reject,object_pairs_hook=no_duplicates)


def beneath(root,name):
    if not isinstance(name,str) or not name or "\\" in name or ":" in name:
        raise ValueError("Unsafe package-relative path")
    p=PurePosixPath(name)
    if p.is_absolute() or any(s in (".","..","") for s in name.split("/")):
        raise ValueError("Unsafe package-relative path")
    root=Path(root).resolve()
    candidate=root.joinpath(*p.parts)
    if not candidate.resolve().is_relative_to(root):raise ValueError("Package path escaped root")
    cursor=root
    for part in p.parts:
        cursor=cursor/part
        if cursor.is_symlink():raise ValueError("Symlink in immutable payload path")
    return candidate


def checked_bytes(root,record):
    p=beneath(root,record["path"])
    raw=p.read_bytes()
    if sha(raw)!=record["sha256"] or (record.get("bytes") is not None and len(raw)!=record["bytes"]):
        raise ValueError("Payload differs: "+record["path"])
    return raw


def integer(value):
    if isinstance(value,bool) or not isinstance(value,(int,float)) or not math.isfinite(value) or int(value)!=value:
        raise ValueError("Nonintegral Setup value")
    return int(value)


def replay(raw):
    """Independent ordered material-stamp replay, not native execution."""
    if len(raw)>1048576:raise ValueError("Setup exceeds 1 MiB")
    value=json.loads(raw)
    if not isinstance(value,dict) or value.get("version")!=2:raise ValueError("Unsupported plain Setup")
    extent=value.get("extent")
    if not isinstance(extent,list) or len(extent)!=2:raise ValueError("Invalid extent")
    width,height=map(integer,extent)
    if any(x<512 or x>2048 or x%64 for x in (width,height)):raise ValueError("Unbounded extent")
    if value.get("source")!=[]:raise ValueError("Generated base is outside this plain-Setup replay")
    edits=value.get("edits")
    if not isinstance(edits,list) or len(edits)>32768:raise ValueError("Unbounded edits")
    cells=bytearray(width*height)
    for edit in edits:
        if not isinstance(edit,list) or len(edit) not in (4,5):raise ValueError("Unsupported stamp")
        fields=list(map(integer,edit)); x,y=fields[:2];material=fields[-1]
        if not 0<=material<132 or material==10 or not 0<=x<width or not 0<=y<height:raise ValueError("Illegal stamp")
        if len(fields)==5:
            w,h=fields[2:4]
            if min(w,h)<=0 or x+w>width or y+h>height:raise ValueError("Rectangle out of bounds")
            row=bytes([material])*w
            for yy in range(y,y+h):cells[yy*width+x:yy*width+x+w]=row
        else:
            radius=fields[2]
            if not 2<=radius<=24:raise ValueError("Disc radius out of bounds")
            for yy in range(max(0,y-radius),min(height,y+radius+1)):
                for xx in range(max(0,x-radius),min(width,x+radius+1)):
                    if (xx-x)**2+(yy-y)**2<=radius*radius:cells[yy*width+xx]=material
    return value,bytes(cells)


class Collection:
    def __init__(self,root):
        self.root=Path(root).resolve()
        self.collection=read_json(beneath(self.root,"collection/collection.v1.json"))
        self.knowledge=read_json(beneath(self.root,"corpus-export/knowledge.v1.json"))
        if self.collection.get("schema")!="goldmaps.owner-collection.v1":raise ValueError("Unsupported collection")
        if self.knowledge.get("schema_version")!="goldmaps.architectural-knowledge.v1":raise ValueError("Unsupported knowledge export")
        self.maps=self.collection["maps"]

    def get(self,mid):
        rows=[m for m in self.maps if m["id"]==mid]
        if len(rows)!=1:raise ValueError("Missing or ambiguous map identity")
        return copy.deepcopy(rows[0])

    def validate(self):
        manifest=read_json(beneath(self.root,"collection/collection-files.v1.json"))
        if manifest.get("schema")!="goldmaps.owner-collection-files.v1":raise ValueError("Unsupported fragment manifest")
        paths=set(); folded=set();total=0
        for row in manifest["files"]:
            name=row["path"]
            if name in paths or name.casefold() in folded:raise ValueError("Duplicate/case-colliding payload")
            paths.add(name);folded.add(name.casefold());total+=len(checked_bytes(self.root,row))
        if manifest["counts"]!={"files":len(paths),"bytes":total}:raise ValueError("Manifest counts differ")
        excluded={"collection/collection-files.v1.json","collection/delivery-qualification.v1.json"}
        observed={p.relative_to(self.root).as_posix() for base in ("collection","corpus-export") for p in (self.root/base).rglob("*") if p.is_file()}
        unexpected=observed-paths-excluded
        if unexpected:raise ValueError("Unlisted collection payloads: "+", ".join(sorted(unexpected)))
        ids=[r["id"] for r in self.maps]
        if len(ids)!=len(set(ids)):raise ValueError("Duplicate logical identity")
        gold={m["source"]["pr"] for m in self.maps if "gold25" in m["collections"]}
        corpus=[m for m in self.maps if "corpus" in m["collections"]]
        if gold!=GOLD or len(corpus)!=70 or len({m["source_corpus_id"] for m in corpus})!=70:raise ValueError("Frozen roster changed")
        if any(m.get("owner_accepted") is not False or m["owner"]!={"status":"pending","classification":None,"accepted":False} for m in self.maps):
            raise ValueError("Bundled recommendations must remain unaccepted; owner decisions are a separate local file")
        for m in self.maps:
            if m["setup"]["path"] not in paths or m["preview"]["path"] not in paths:raise ValueError("Unmanifested map payload")
            checked_bytes(self.root,m["setup"]);checked_bytes(self.root,m["preview"])
            if m["source"]["pr"] in (155,183) and not m["id"].startswith("derived-") and m["native"]["eligibility"]!="refused":
                raise ValueError("Original malformed-policy refusal lost")
            delivery=m["native"].get("delivery_evidence")
            if not isinstance(delivery,dict) or delivery.get("path")!="collection/delivery-qualification.v1.json" or delivery.get("schema")!="goldmaps.owner-qualification.v1" or delivery.get("key_path")!=["setups",m["setup"]["sha256"]] or delivery.get("engine_head")!=self.collection["authority"]["delivery_engine"]:
                raise ValueError("Map delivery qualification reference is missing or mismatched")
        if "fresh_qualified_playable_setups" in self.collection["counts"]:
            raise ValueError("Immutable assembly metadata must not publish a stale fresh-qualified count")
        if self.knowledge["counts"]!={"maps":70,"current_protected_features":27,"immutable_feature_states":76,"comparative_families":12,"negative_interventions":5,"owner_accepted":0}:
            raise ValueError("Knowledge population changed")
        for f in self.knowledge["protected_features"]:
            if f.get("evidence_crop_is_edit_mask") is not False or f.get("geometry_edits_authorized") is not False:
                raise ValueError("Protected-feature evidence boundary lost")
        lineage=[r for r in self.knowledge.get("relationships",[]) if r.get("kind")=="frozen_experiment_lineage"]
        if {r.get("arm") for r in lineage}!={"B1","B2","B3","C1","C2","C3","D1","D2"} or len(lineage)!=8:
            raise ValueError("Frozen experiment lineage is incomplete")
        knowledge_maps={m["source"]["pr"]:m for m in self.knowledge["maps"]}
        for relationship in lineage:
            group=relationship["shared_holdout_group"]
            related=[]
            for variant in relationship["variants"]:
                entry=self.get(variant["collection_id"])
                if entry["source"]!=variant["source"] or entry["setup"]["material_plane_sha256"]!=variant["material_plane_sha256"]:
                    raise ValueError("Lineage variant source differs from the bundled identity")
                groups=set(knowledge_maps[entry["source"]["pr"]]["visual_family_groups"])
                if group not in groups:raise ValueError("Variant lost its experiment holdout group")
                related.append(groups)
            if any(groups!=related[0] for groups in related):
                raise ValueError("Comparison variants do not share closed source ancestry")
        failed_meta=self.knowledge["failed_attempt_custody"]
        failed_raw=checked_bytes(self.root,{"path":failed_meta["detailed_record_path"],"sha256":failed_meta["detailed_record_sha256"]})
        failed=json.loads(failed_raw)
        failed_files=[f for attempt in failed["attempts"] for f in attempt["files"]]
        missing=[f for f in failed_files if f["status"]=="UNRECOVERED_HASH_RECORD_ONLY"]
        if len(failed_files)!=182 or len(missing)!=28 or failed.get("recovered_file_occurrences")!=154:
            raise ValueError("Historical failed-bundle recovery gaps were changed")
        if len(self.knowledge["negative_interventions"])!=5 or any(n.get("accepted_positive_example") is not False for n in self.knowledge["negative_interventions"]):
            raise ValueError("Negative interventions cannot become accepted positive examples")
        return {"status":"PASS","scope":"Exact collection fragment custody/roster; does not qualify executable runtime",
            "files":len(paths),"bytes":total,"logical_aliases":len(ids),"source_maps":len(corpus),
            "unique_setup_payloads":len({m['setup']['sha256'] for m in self.maps}),"owner_accepted":0,
            "external_overlay_present":(self.root/"collection/delivery-qualification.v1.json").exists()}

    def replay(self,mid):
        m=self.get(mid);setup,plane=replay(checked_bytes(self.root,m["setup"]))
        got=sha(plane)
        if got!=m["setup"]["material_plane_sha256"]:raise ValueError("Material-plane digest differs")
        return {"status":"PASS","id":mid,"setup_sha256":m["setup"]["sha256"],"plane_sha256":got,
            "extent":setup["extent"],"cells":len(plane),"scope":"Independent source-static ordered replay; no native or gameplay claim"}

    def search(self,text,limit=5):
        if not 1<=limit<=70 or len(text)>512:raise ValueError("Unbounded query")
        terms=text.casefold().split()
        found=[]
        for m in self.knowledge["maps"]:
            hay=json.dumps({k:m.get(k) for k in ("title","architectural_family","topology","tags","source_authored_metadata")},ensure_ascii=False).casefold()
            score=sum(hay.count(term) for term in terms)
            if terms and not all(term in hay for term in terms):continue
            found.append({"id":m["collection_id"],"title":m["title"],"source":m["source"],"family":m["architectural_family"],
                "visual_family_groups":m["visual_family_groups"],"match_occurrences":score,"native":m["native"]["status"],"owner_accepted":False})
        found.sort(key=lambda r:(-r["match_occurrences"],r["id"]))
        return {"authority":"reference_knowledge_only","query":text,"results":found[:limit],"total_matches":len(found),
            "scope":"Literal metadata search; match counts are neither artistic scores nor retrieval-quality evidence"}

    def feature(self,fid):
        found=[f for f in self.knowledge["protected_features"] if f["feature_id"]==fid]
        if len(found)!=1:raise ValueError("Missing or ambiguous feature")
        return copy.deepcopy(found[0])

    def crop(self,fid,out):
        f=self.feature(fid); image=f["image"]
        raw=checked_bytes(self.root,{"path":f["bundled_image_path"],"sha256":image["sha256"],"bytes":image["bytes"]})
        out=Path(out);receipt=out.with_suffix(out.suffix+".receipt.json")
        if out.exists() or receipt.exists():raise ValueError("Refuse to overwrite crop or receipt")
        out.parent.mkdir(parents=True,exist_ok=True)
        with out.open("xb") as stream:stream.write(raw)
        record={"feature_id":fid,"source_state_id":f["state_id"],"source_image":image,
            "coordinate_window_xywh":f["crop_rect_xywh"],"verified_feature_bbox_xyxy":f["feature_bbox_xyxy"],
            "evidence_crop_is_edit_mask":False,"geometry_edits_authorized":False,"byte_identity_preserved":True,
            "must_preserve":f["must_preserve"],"do_not_fill":f["do_not_fill"]}
        with receipt.open("x",encoding="utf-8") as stream:json.dump(record,stream,indent=2);stream.write("\n")
        return record


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--package",type=Path,required=True)
    commands=parser.add_subparsers(dest="command",required=True)
    commands.add_parser("validate")
    search=commands.add_parser("search");search.add_argument("text");search.add_argument("--limit",type=int,default=5)
    get=commands.add_parser("get");get.add_argument("id")
    replay_cmd=commands.add_parser("replay");replay_cmd.add_argument("id")
    feature=commands.add_parser("feature");feature.add_argument("id")
    crop=commands.add_parser("crop");crop.add_argument("id");crop.add_argument("--out",type=Path,required=True)
    args=parser.parse_args();c=Collection(args.package)
    if args.command=="validate":result=c.validate()
    elif args.command=="search":result=c.search(args.text,args.limit)
    elif args.command=="get":result=c.get(args.id)
    elif args.command=="feature":result=c.feature(args.id)
    elif args.command=="crop":result=c.crop(args.id,args.out)
    else:result=c.replay(args.id)
    print(json.dumps(result,ensure_ascii=False,indent=2))


if __name__=="__main__":main()
