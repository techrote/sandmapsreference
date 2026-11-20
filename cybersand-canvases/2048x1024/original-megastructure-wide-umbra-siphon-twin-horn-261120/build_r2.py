#!/usr/bin/env python3
"""Umbra Siphon R2: deterministic author-owned actual-cell material repair.
Source seed 0x5E7104 originally authored by build-r1.py; R2's explicit
geometry-r2.txt is applied to its byte-exact, committed R1 source grid.
Python standard library only. No AI / reference art images.
"""
import json,math,struct,zlib,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parent
W,H=2048,1024
CROPS=[("01-lantern-gate",88,172,380,469),
       ("02-first-siphon",452,115,445,584),
       ("03-zero-pressure",883,113,413,591),
       ("04-mirror-adsorber",1260,140,439,564),
       ("05-silent-border",1655,174,364,471)]
# Exact PNG PLTE/tRNS from original committed accepted-material palette.
PNG_PALETTE_HEX="080b12000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000777b800000000000000000007e8d993164776d7d867c3f2b4a555d000000667781a55c36c8d2cb6bc4b5253c4c0000003c3544d6c55ce3b62f37f3e4ff3db8ffb52eecf8ff000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e2dfd800000036383d181320000000000000000000000000000000000000000000000000000000c8c4ba00000098a2a8b8c0c8000000000000000000000000c4a0489cd2dccee2e80000000000000000000000000000000000003e7ab40000002224291a1a1d000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
PNG_ALPHA_HEX=""
def replay(edits):
    g=bytearray(W*H)
    for x,y,w,h,material in edits:
        if not (0<=x<W and 0<=y<H and w>0 and h>0 and x+w<=W and y+h<=H):
            raise ValueError("invalid original rectangle")
        for yy in range(y,y+h):
            g[yy*W+x:yy*W+x+w]=bytes((material,))*w
    return g
def stamp(g,x,y,w,h,material):
    for yy in range(max(0,y),min(H,y+h)):
        a=yy*W+max(0,x);b=yy*W+min(W,x+w)
        if b>a:g[a:b]=bytes((material,))*(b-a)
def apply(g,commands):
    for record in commands.splitlines():
        record=record.strip()
        if not record or record.startswith("#"):continue
        cmd,*numbers=record.split()
        n=list(map(int,numbers))
        if cmd=="r":
            stamp(g,*n)
        elif cmd=="l":
            x,y,xx,yy,t,material=n
            steps=max(abs(xx-x),abs(yy-y))
            rad=t//2
            for i in range(steps+1):
                px=math.floor(x+(xx-x)*i/steps+0.5)
                py=math.floor(y+(yy-y)*i/steps+0.5)
                stamp(g,px-rad,py-rad,rad*2+1,rad*2+1,material)
        elif cmd=="o":
            cx,cy,rx,ry,material=n
            for deg in range(0,360,4):
                angle=deg*math.pi/180
                stamp(g,math.floor(cx+rx*math.cos(angle)+0.5)-2,
                      math.floor(cy+ry*math.sin(angle)+0.5)-2,5,5,material)
        else:raise ValueError("unknown R2 geometry command: "+cmd)
def rects(grid):
    out=[];prev={}
    for y in range(H):
        current={};x=0;row=y*W
        while x<W:
            m=grid[row+x]
            if not m:x+=1;continue
            st=x
            while x<W and grid[row+x]==m:x+=1
            w=x-st
            key=(st,w,m)
            if key in prev:
                index=prev[key];out[index][3]+=1
            else:
                index=len(out);out.append([st,y,w,1,m])
            current[key]=index
        prev=current
    return out
def u32(n):return struct.pack(">I",n)
def chunk(name,data):
    tag=name.encode("ascii")
    return u32(len(data))+tag+data+u32(zlib.crc32(tag+data)&0xffffffff)
def zlib_stored(data):
    o=bytearray((0x78,0x01))
    for start in range(0,len(data),65535):
        block=data[start:start+65535];length=len(block);final=start+length>=len(data)
        o.append(1 if final else 0)
        o.extend(struct.pack("<HH",length,length^65535));o.extend(block)
    o.extend(u32(zlib.adler32(data)&0xffffffff))
    return bytes(o)
def indexed_png(grid,x,y,w,h):
    raw=bytearray()
    for yy in range(y,y+h):
        raw.append(0)
        raw.extend(grid[yy*W+x:yy*W+x+w])
    payload=[chunk("IHDR",u32(w)+u32(h)+bytes((8,3,0,0,0))),
             chunk("PLTE",bytes.fromhex(PNG_PALETTE_HEX))]
    if PNG_ALPHA_HEX:payload.append(chunk("tRNS",bytes.fromhex(PNG_ALPHA_HEX)))
    payload.extend([chunk("IDAT",zlib_stored(raw)),chunk("IEND",b"")])
    return b"\x89PNG\r\n\x1a\n"+b"".join(payload)
def main():
    source=(ROOT/"setup-r1.json").read_bytes()
    original=json.loads(source)
    if original["version"]!=2 or original["extent"]!=[W,H]:raise ValueError("R1 source identity mismatch")
    g=replay(original["edits"])
    apply(g,(ROOT/"geometry-r2.txt").read_text(encoding="utf-8"))
    original["edits"]=rects(g)
    setup=(json.dumps(original,separators=(",",":"),ensure_ascii=False)+"\n").encode("utf-8")
    (ROOT/"setup-umbra-siphon.json").write_bytes(setup)
    (ROOT/"overview.png").write_bytes(indexed_png(g,0,0,W,H))
    for name,x,y,w,h in CROPS:
        (ROOT/(name+".png")).write_bytes(indexed_png(g,x,y,w,h))
    print(json.dumps({"size":[W,H],"rectangles":len(original["edits"]),
        "json_bytes":len(setup),"setup_sha256":hashlib.sha256(setup).hexdigest(),
        "grid_sha256":hashlib.sha256(g).hexdigest(),"seed":0x5E7104},
        indent=2))
if __name__=="__main__":main()
