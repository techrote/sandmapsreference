#!/usr/bin/env python3
"""Verify the shipped reference cards with the unchanged existing Batch adapter.

Only a tiny temporary, read-only Godot reference project is created. The consumer
branch is never checked out or modified, and no native module import is claimed.
"""
from __future__ import annotations
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import urllib.request

CONSUMER="fe2395c7060dae736dc2e5dc8d1e4e050b2d2e52"
ADAPTER_SHA="a9c130afc9cdf3b53f45bab00c950eb573168021074ed004c926e55e83f8c1f2"
LINUX_GODOT="f85bbc6b15e22416c7d797cd60b63286dd67b9cb13498847056c18520ae55a75"
WINDOWS_GODOT="d8055fb8c7e7f5010d7439ec69be051554055dae55a265f8647bd7301c34161c"


def digest(path):return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument("--package",type=Path,required=True)
    p.add_argument("--godot",type=Path,required=True)
    p.add_argument("--out",type=Path,required=True)
    p.add_argument("--adapter",type=Path,help="Exact previously acquired consumer script; omit for immutable verified download")
    args=p.parse_args()
    if args.out.exists():raise ValueError("Refuse to overwrite evidence")
    godot=args.godot.resolve()
    godot_sha=digest(godot)
    if godot_sha not in (LINUX_GODOT,WINDOWS_GODOT):raise ValueError("Need exact qualified Godot4.7 binary")
    if args.adapter:
        raw=args.adapter.read_bytes()
    else:
        url=f"https://raw.githubusercontent.com/techrote/cybersand/{CONSUMER}/godot/scripts/batch_lab/architectural_retrieval.gd"
        with urllib.request.urlopen(url,timeout=45) as response:raw=response.read(131073)
    if hashlib.sha256(raw).hexdigest()!=ADAPTER_SHA:raise ValueError("Existing consumer adapter identity differs")
    args.out.parent.mkdir(parents=True,exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="goldmaps-consumer-") as temporary:
        root=Path(temporary)
        (root/"architectural_retrieval.gd").write_bytes(raw)
        probe=Path(__file__).with_suffix(".gd")
        shutil.copyfile(probe,root/"check_consumer.gd")
        (root/"project.godot").write_text('config_version=5\n[application]\nconfig/name="Goldmaps read-only adapter check"\n[rendering]\nrenderer/rendering_method="gl_compatibility"\n',encoding="utf-8")
        cards=(args.package/"corpus-export/batch-lab/architectural_design_cards.v1.json").resolve()
        process=subprocess.run([str(godot),"--headless","--path",str(root),"--script","res://check_consumer.gd","--",
            "--cards="+str(cards),"--output="+str(args.out.resolve())],capture_output=True,text=True,timeout=90)
        if process.returncode or not args.out.is_file():
            raise RuntimeError(process.stdout+process.stderr)
        result=json.loads(args.out.read_text(encoding="utf-8"))
        result["godot_sha256"]=godot_sha
        result["probe_sha256"]=digest(probe)
        result["runner_sha256"]=digest(__file__)
        result["stdout_sha256"]=hashlib.sha256(process.stdout.encode()).hexdigest()
        args.out.write_text(json.dumps(result,indent=2)+"\n",encoding="utf-8")
        print(json.dumps({"pass":result["pass"],"queries":len(result["queries"]),"negative_guards":result["negative_guards"]},indent=2))


if __name__=="__main__":main()
