#!/usr/bin/env python3
"""Rebuild exact material-plane preview from the committed CyberSand v2 setup."""
from pathlib import Path
from PIL import Image
import numpy as np, json
here=Path(__file__).resolve().parent
s=json.loads((here/"setup-filament-shaft-cavern.json").read_text())
w,h=s["extent"]
assert (w,h)==(1024,2048),s["extent"]
assert len(s["edits"])<=32768
a=np.zeros((h,w),dtype=np.uint8)
for x,y,dx,dy,m in s["edits"]:
    assert x>=0 and y>=0 and dx>0 and dy>0 and x+dx<=w and y+dy<=h
    a[y:y+dy,x:x+dx]=m
palette={int(k):v for k,v in json.loads((here/"palette.json").read_text()).items()}
render=np.zeros((h//2,w//2,3),dtype=np.uint8)
sample=a[1::2,1::2]
for m,c in palette.items():render[sample==m]=c
Image.fromarray(render,"RGB").save(here/"filament-shaft-cavern-preview-rebuilt.png")
print("Rebuilt %sx%s from %s committed rectangles" % (w,h,len(s["edits"])))
