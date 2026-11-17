#!/usr/bin/env python3
"""Rebuild the reviewed Setup-v2 from an immutable parent PR commit plus sparse overlay rectangles."""
from pathlib import Path
import argparse, json, subprocess
here=Path(__file__).resolve().parent
p=json.loads((here/"rework_patch.json").read_text())
root=Path(subprocess.check_output(["git","rev-parse","--show-toplevel"],cwd=here,text=True).strip())
rel=(here/root).as_posix() if False else here.relative_to(root).as_posix()
raw=subprocess.check_output(["git","show",f"{p['baseline_commit']}:{rel}/setup-filament-shaft-cavern.json"],cwd=root,text=True)
baseline=json.loads(raw)
assert baseline["extent"]==p["extent"]
assert len(baseline["edits"])==p["baseline_rectangles"]
stage_a=baseline["edits"]+p["patches"]
c=json.loads((here/"rework_c_patch.json").read_text())
assert c["baseline_head"]=="b9268544e32ceeffa26cdfb9b95c9773ef0bcf84"
assert c["baseline_edit_count"]==len(stage_a)
assert c["world_extent"]==baseline["extent"]
assert c["patch_rectangles"]==len(c["patches"])
rebuild=dict(baseline,edits=stage_a+c["patches"])
out=here/"setup-filament-shaft-cavern.json"
a=argparse.ArgumentParser()
a.add_argument("--write",action="store_true",help="Replace setup JSON with the deterministic rebuild")
args=a.parse_args()
if args.write:
 out.write_text(json.dumps(rebuild,separators=(",",":")))
else:
 assert json.loads(out.read_text())==rebuild,"Committed setup disagrees with baseline+patches"
 print(f"PASS: {len(rebuild['edits'])} rectangles / {len(p['patches'])} A and {len(c['patches'])} C overlays")
