#!/usr/bin/env python3
"""Independent byte-level audit for committed CyberSand Setup-v2 and indexed PNGs."""
import collections, hashlib, json, pathlib, struct, zlib
ROOT=pathlib.Path(__file__).resolve().parent
setup_bytes=(ROOT/"setup.json").read_bytes()
setup=json.loads(setup_bytes)
receipt=json.loads((ROOT/"receipt.json").read_text())
W,H=setup["extent"]
assert (W,H)==(2048,1024)
assert len(setup_bytes)<=1048576 and len(setup["edits"])<=32768
grid=bytearray(W*H)
used=bytearray(W*H)
work=0
for n,e in enumerate(setup["edits"]):
    assert isinstance(e,list) and len(e)==5
    x,y,w,h,m=e
    assert all(type(v) is int for v in e)
    assert 0<=x<W and 0<=y<H and w>0 and h>0 and x+w<=W and y+h<=H and 0<m<=131
    for yy in range(y,y+h):
        a=yy*W+x;b=a+w
        assert not any(used[a:b]), ("overlap",n)
        used[a:b]=b"\1"*w
        grid[a:b]=bytes([m])*w
    work+=w*h
assert work<=32000000
assert hashlib.sha256(grid).hexdigest()==receipt["grid_sha256"]
assert hashlib.sha256(setup_bytes).hexdigest()==receipt["setup_sha256"]
hist={str(i):n for i,n in enumerate(collections.Counter(grid)) if n}
actual=dict(collections.Counter(map(str,grid)))
assert actual=={k:int(v) for k,v in receipt["histogram"].items()}
assert work==receipt["painted"]==receipt["construction_work"]
total=0
for entry in receipt["images"]:
    fn=ROOT/entry["file"]; png=fn.read_bytes()
    assert png[:8]==b"\x89PNG\r\n\x1a\n"
    assert hashlib.sha256(png).hexdigest()==entry["sha256"]
    p=8; data=b""; size=None; iend=False
    while p<len(png):
        n=struct.unpack(">I",png[p:p+4])[0]; typ=png[p+4:p+8]
        chunk=png[p+8:p+8+n]
        crc=struct.unpack(">I",png[p+8+n:p+12+n])[0]
        assert zlib.crc32(typ+chunk)==crc, (fn,"CRC",typ)
        p+=12+n
        if typ==b"IHDR":
            wd,ht,depth,ctype=struct.unpack(">IIBB",chunk[:10]);size=(wd,ht)
            assert depth==8 and ctype==3
        elif typ==b"IDAT":data+=chunk
        elif typ==b"IEND":
            assert n==0 and p==len(png);iend=True
    assert iend and size==tuple(entry["rect"][2:])
    wd,ht=size
    expanded=zlib.decompress(data)
    assert len(expanded)==(wd+1)*ht
    x0,y0,_,_=entry["rect"]
    for y in range(ht):
        assert expanded[y*(wd+1)]==0, (fn,"nonzero filter")
        assert expanded[y*(wd+1)+1:(y+1)*(wd+1)]==grid[(y0+y)*W+x0:(y0+y)*W+x0+wd], (fn,"pixel mismatch",y)
    total+=wd*ht
assert total==sum(e["matchedMaterialPixels"] for e in receipt["images"])
print("PASS",W,H,"cells",len(grid),"edits",len(setup["edits"]),"painted",work,"material-pixel parity",total)
