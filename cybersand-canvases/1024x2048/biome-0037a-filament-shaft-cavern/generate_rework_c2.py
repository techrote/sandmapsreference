#!/usr/bin/env python3
"""Reproduce C2 bounded material-geometry overlay; never writes image-only geometry."""
from pathlib import Path
import math,json,argparse
here=Path(__file__).resolve().parent
patch=[]
def emit(x,y,w,h,m):
    x=math.floor(x+0.5);w=math.floor(w+0.5)
    if w>0:patch.append([x,y,w,h,m])
strata={1600,1601,1617,1618,1635,1636,1658,1659,1682,1683}
for y in range(1588,1708):
    t=(y-1588)/119
    x=102+94*t+4*math.sin(y/14)+2*math.sin(y/4.3)
    wid=122*pow(1-t,0.86)+3+2.8*math.sin(y/9)
    xx=math.floor(x+0.5);ww=max(3,math.floor(wid+0.5))
    emit(xx,y,ww,1,100)
    if y in strata and ww>18:emit(xx+math.floor(ww*0.19),y,max(4,math.floor(ww*0.53)),1,49)
accents={1702,1703,1726,1727,1751,1752}
for y in range(1672,1783):
    t=(y-1672)/110
    reach=22+94*t/0.43 if t<0.43 else 116-94*(t-0.43)/0.57
    length=max(20,math.floor(reach+4.8*math.sin(y/11)+2.1*math.sin(y/3.7)+0.5))
    emit(20,y,length,1,49)
    if y in accents and length>40:emit(20+math.floor(length*0.62),y,max(4,math.floor(length*0.26)),1,42)
emit(346,1269,111,43,0)
parser=argparse.ArgumentParser();parser.add_argument("--write",action="store_true")
args=parser.parse_args()
p=here/"rework_c2_patch.json"
committed=json.loads(p.read_text())
if args.write:
    committed["patches"]=patch;committed["patch_rectangles"]=len(patch)
    p.write_text(json.dumps(committed,separators=(",",":")))
else:
    assert committed["patches"]==patch,"C2 geometry recipe differs from committed patch"
    print(f"PASS: {len(patch)} deterministic C2 material overlays")
