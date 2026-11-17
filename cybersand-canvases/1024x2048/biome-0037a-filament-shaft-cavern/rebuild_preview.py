#!/usr/bin/env python3
"""Render committed CyberSand Setup-v2 cell state, with native-resolution district crops."""
from pathlib import Path
from PIL import Image
import numpy as np, json
here=Path(__file__).resolve().parent
s=json.loads((here/"setup-filament-shaft-cavern.json").read_text())
w,h=s["extent"]
assert (w,h)==(1024,2048)
assert len(s["edits"])<=32768
a=np.zeros((h,w),dtype=np.uint8)
for x,y,dx,dy,m in s["edits"]:
    assert 0<=x<w and 0<=y<h and 0<dx<=w-x and 0<dy<=h-y
    a[y:y+dy,x:x+dx]=m
palette={int(k):v for k,v in json.loads((here/"palette.json").read_text()).items()}
def colorize(index):
    rgb=np.zeros((*index.shape,3),dtype=np.uint8)
    for m,c in palette.items():rgb[index==m]=c
    return Image.fromarray(rgb,"RGB")
colorize(a[1::2,1::2]).save(here/"filament-shaft-cavern-preview.png")
colorize(a[430:942,0:512]).save(here/"filament-shaft-cavern-detail-upper.png")
colorize(a[895:1407,512:1024]).save(here/"filament-shaft-cavern-detail-lower.png")
colorize(a[775:1287,0:512]).save(here/"filament-shaft-cavern-detail-lamina.png")
colorize(a[1120:1632,312:824]).save(here/"filament-shaft-cavern-detail-shaft.png")
colorize(a[1460:1972,0:512]).save(here/"filament-shaft-cavern-detail-deep.png")
print(f"PASS: {w}x{h} material cells; {len(s['edits'])} rectangles; overview and five native 512x512 district crops rebuilt")
