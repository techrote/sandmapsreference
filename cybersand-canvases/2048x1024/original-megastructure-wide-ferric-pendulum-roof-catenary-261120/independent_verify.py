#!/usr/bin/env python3
"""Second-path verifier of committed Setup-v2 and indexed real material PNGs.
Does not invoke build.py; verifies full replay, byte receipts, all site/obstruction routes,
4-neighbour grounded solidity, strict PNG signature/chunk CRC/deflate/Adler and ID-index parity.
"""
from pathlib import Path
from collections import Counter
from hashlib import sha256
import json, struct, zlib, sys
import numpy as np
from PIL import Image
from scipy import ndimage
P=Path(__file__).resolve().parent
D=json.loads((P/'receipt.json').read_text()); raw=(P/'setup.json').read_bytes(); J=json.loads(raw)
W,H=2048,1024; assert J['version']==2 and J['extent']==[W,H]
assert set(J)=={'version','extent','actors','next_id','selected','edits','response','liquid_policy','normalize','rule_radius','source','material','brush','fire'}
assert len(J['liquid_policy'])==55 and len(J['actors'])==1 and J['actors'][0]['model']=='midge'
assert D['setup_bytes']==len(raw) and D['setup_sha256']==sha256(raw).hexdigest()
assert len(J['edits'])==D['rectangles']<=32768 and len(raw)<=1048576
# These are the only IDs the independent replay accepts: manually checked against
# accepted main native/include/cybersand/material.hpp as Solid+None on 2026-11-20.
VALID={58,62,63,64,68,69,72,74,76,77,78,79,80,98,100,119}
grid=np.zeros((H,W),dtype=np.uint8);painted=np.zeros_like(grid,dtype=bool)
for r in J['edits']:
    assert isinstance(r,list) and len(r)==5 and all(type(v)==int for v in r)
    x,y,w,h,mat=r
    assert 0<=x<W and 0<=y<H and w>0 and h>0 and x+w<=W and y+h<=H and mat in VALID
    assert not painted[y:y+h,x:x+w].any(), ('overlap',r)
    painted[y:y+h,x:x+w]=True;grid[y:y+h,x:x+w]=mat
assert sha256(grid.tobytes()).hexdigest()==D['grid_sha256']
assert int(painted.sum())==D['work_cells']==D['grounded_solids']
hist={str(i):int(v) for i,v in enumerate(np.bincount(grid.ravel(),minlength=256)) if v}
assert hist==D['histogram']
labels,n=ndimage.label(grid!=0,structure=np.array([[0,1,0],[1,1,1],[0,1,0]],dtype=np.uint8))
roots=set(np.unique(np.r_[labels[0],labels[-1],labels[:,0],labels[:,-1]]))
assert all(v in roots for v in np.unique(labels))

def free_centres(g,fw,fh):
    # Intentionally different construction from builder, using scipy maximum_filter.
    occupied=g!=0
    # Filter both axes with zero-padding and require a full inbounds body envelope.
    bad=ndimage.maximum_filter(occupied,size=(fh,fw),mode='constant',cval=True)
    legal=~bad
    legal[:fh//2,:]=False;legal[H-(fh//2):,:]=False
    legal[:,:fw//2]=False;legal[:,W-fw//2:]=False
    return legal

def test(g,fw,fh):
    air=free_centres(g,fw,fh)
    x,y=D['spawn'];assert air[y,x], ('spawn',fw,fh)
    labels,n=ndimage.label(air,structure=np.array([[0,1,0],[1,1,1],[0,1,0]],dtype=np.uint8))
    component=labels[y,x]; assert component
    missing=[n for n,(x,y) in D['sites'].items() if not (air[y,x] and labels[y,x]==component)]
    return (len(D['sites'])-len(missing), missing, int(np.count_nonzero(labels==component)))
for entry in D['clearances']:
    n,miss,cc=test(grid,*entry['hull'])
    assert (n,miss,cc)==(entry['reachable'],entry['errors'],entry['component_centres']),(entry,n,miss,cc)
block=grid.copy();x,y,w,h=D['physical_obstruction_xywh'];block[y:y+h,x:x+w]=62
for entry in D['obstructed_routes']:
    n,miss,cc=test(block,*entry['hull'])
    assert (n,miss,cc)==(entry['reachable'],entry['errors'],entry['component_centres'])

# Explicit PNG signature/CRC/IEND, IDAT zlib, Adler verified by zlib, and decoded
# byte-exact index parity through Pillow; compare every source grid pixel.
def verify_png(name,truth):
    raw=(P/name).read_bytes();assert sha256(raw).hexdigest()==D['file_sha256'][name]
    assert raw[:8]==b'\x89PNG\r\n\x1a\n'
    at=8;chunks=[];idats=[];end=False;ihl=None
    while at<len(raw):
        assert at+12<=len(raw)
        size=struct.unpack('>I',raw[at:at+4])[0];kind=raw[at+4:at+8]
        data=raw[at+8:at+8+size]; crc=struct.unpack('>I',raw[at+8+size:at+12+size])[0]
        assert zlib.crc32(kind+data)&0xffffffff==crc,(name,kind)
        if kind==b'IHDR':
            ihl=struct.unpack('>IIBBBBB',data)
            assert ihl[2]==8 and ihl[3]==3 # indexed, one actual material index per pixel
        if kind==b'IDAT':idats.append(data)
        chunks.append(kind);at+=12+size
        if kind==b'IEND': assert len(data)==0 and at==len(raw);end=True
    assert end and chunks[0]==b'IHDR' and b'PLTE' in chunks and b'IDAT' in chunks
    assert (ihl[0],ihl[1])==(truth.shape[1],truth.shape[0])
    stream=zlib.decompress(b''.join(idats))
    assert len(stream)==truth.shape[0]*(truth.shape[1]+1)
    for i in range(truth.shape[0]):assert stream[i*(truth.shape[1]+1)]==0 # filter 0; source row exact ID data
    rawindices=np.frombuffer(stream,dtype=np.uint8).reshape(truth.shape[0],truth.shape[1]+1)[:,1:]
    assert np.array_equal(rawindices,truth),(name,'raw decompressed ID pixel mismatch')
    pic=Image.open(P/name);assert pic.mode=='P'
    assert np.array_equal(np.asarray(pic,dtype=np.uint8),truth)
    return int(truth.size)
pixels=verify_png('overview.png',grid)
for name,(l,t,r,b) in D['gallery_crops_xyxy'].items():pixels+=verify_png(name,grid[t:b,l:r])
print(json.dumps({'result':'SECOND-PATH VERIFIED','cells':W*H,'rectangles':len(J['edits']),'solids':int(painted.sum()),'sites':[x['reachable'] for x in D['clearances']],'obstructed_reachable':[x['reachable'] for x in D['obstructed_routes']],'pngs':1+len(D['gallery_crops_xyxy']),'decoded_source_pixels':pixels,'setup_sha256':D['setup_sha256'],'grid_sha256':D['grid_sha256']}))
