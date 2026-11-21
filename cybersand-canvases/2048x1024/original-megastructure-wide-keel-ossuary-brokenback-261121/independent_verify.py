#!/usr/bin/env python3
"""Second-method source-static verifier, independent of Keel Ossuary's builder.
Performs ordered 2,097,152-cell replay, nonoverlap, image CRC/pixel parity,
independent prefix-summed full-hull center maps and literal 4-neighbour BFS.
Requires numpy, scipy and Pillow. Does not claim any Godot/native run.
"""
from pathlib import Path
from collections import Counter, deque
import hashlib, json, os
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
D=Path(__file__).resolve().parent
W,H=2048,1024
sha=lambda b:hashlib.sha256(b).hexdigest()
raw=(D/'setup.json').read_bytes(); setup=json.loads(raw)
rec=json.loads((D/'receipt.json').read_text())
assert setup['version']==2 and setup['extent']==[W,H]
assert sha(raw)==rec['setup_sha256'] and len(raw)==rec['setup_bytes']<=1048576
assert len(setup['edits'])==rec['rectangles']<=32768
assert setup['actors'][0]['spawn']==rec['sites'][rec['spawn']]
# Independent input pass: full row-major source reconstructed literally in order.
g=np.zeros((H,W),dtype=np.uint8)
painted=np.zeros((H,W),dtype=np.bool_)
for n,record in enumerate(setup['edits']):
    assert type(record)==list and len(record)==5,('invalid record',n)
    assert all(type(q)==int for q in record),('noninteger stamp',n)
    x,y,w,h,m=record
    assert x>=0 and y>=0 and w>0 and h>0 and x+w<=W and y+h<=H and 0<m<=255,(n,record)
    window=painted[y:y+h,x:x+w]
    assert not window.any(),('overlap',n,record)
    window[:]=True
    g[y:y+h,x:x+w]=m
assert g.size==2097152 and sha(g.tobytes())==rec['grid_sha256']
assert rec['construction_work']==int(painted.sum())==int(np.count_nonzero(g))
hist={str(int(x)):int(n) for x,n in zip(*np.unique(g,return_counts=True))}
assert hist==rec['material_histogram']
solid_ids={int(x) for x in hist if x!='0'}
assert solid_ids==set(int(x) for x in rec['material_laws'])
assert all(q['state']=='Solid' and q['kernel']=='None' and q['movable'] is False for q in rec['material_laws'].values())
assert solid_ids<={58,62,63,64,65,66,68,69,72,76,77,79,80,98,100,101,111,119},solid_ids
# Four-cardinal connected components among solids and guaranteed edge-rooted.
structure=np.array([[0,1,0],[1,1,1],[0,1,0]],dtype=np.uint8)
solids=(g!=0)
labels,n=ndi.label(solids,structure=structure)
roots=set(np.concatenate([labels[0,:],labels[-1,:],labels[:,0],labels[:,-1]]).tolist())-{0}
counts=np.bincount(labels.ravel())
rooted=sum(int(counts[q]) for q in roots)
assert rooted==int(solids.sum())==rec['grounded_inert_solids']
assert rec['retained_detached_cells']==0 and rec['liquid_cells']==rec['mobile_cells']==rec['reactive_cells']==0
# Exact full-hull sum from independent padded summed-area table.
# For each VALID centre, at every footprint position obstruction sum must be 0.
def legal_centres(material,w,h):
    occ=(material!=0).astype(np.int32)
    sat=np.pad(occ,((1,0),(1,0)),constant_values=0).cumsum(0,dtype=np.int64).cumsum(1,dtype=np.int64)
    sums=sat[h:,w:]-sat[:-h,w:]-sat[h:,:-w]+sat[:-h,:-w]
    out=np.zeros((H,W),dtype=np.bool_)
    rx,ry=w//2,h//2
    out[ry:ry+H-h+1,rx:rx+W-w+1]=(sums==0)
    return out
# BFS unconditionally uses only 4 cardinal moves, literal sites, no remapping.
def check(material,w,h):
    free=legal_centres(material,w,h)
    sites=rec['sites']; sx,sy=sites[rec['spawn']]
    assert free[sy,sx],('spawn obstructed',(w,h))
    visited=np.zeros((H,W),dtype=np.bool_)
    visited[sy,sx]=True
    todo=deque([sy*W+sx]);total=0
    while todo:
        a=todo.popleft();y,x=divmod(a,W);total+=1
        if x>0 and not visited[y,x-1] and free[y,x-1]:
            visited[y,x-1]=True;todo.append(a-1)
        if x<W-1 and not visited[y,x+1] and free[y,x+1]:
            visited[y,x+1]=True;todo.append(a+1)
        if y>0 and not visited[y-1,x] and free[y-1,x]:
            visited[y-1,x]=True;todo.append(a-W)
        if y<H-1 and not visited[y+1,x] and free[y+1,x]:
            visited[y+1,x]=True;todo.append(a+W)
    missing=[]
    for name,(x,y) in sites.items():
        assert 0<=x<W and 0<=y<H,('site outside grid',name)
        if not visited[y,x]:missing.append(name)
    return {'footprint':[w,h],'reachable':len(sites)-len(missing),'missing':missing,'component':total}
shapes=[(19,15),(23,19),(31,27)]
checks=[check(g,*shape) for shape in shapes]
assert checks==rec['clearance'],('route receipt mismatch',checks,rec['clearance'])
assert all(x['reachable']==len(rec['sites']) for x in checks)
ob=rec['obstruction_xywh'];ox,oy,ow,oh=ob
assert 0<=ox and 0<=oy and ow>0 and oh>0 and ox+ow<=W and oy+oh<=H
blocked=g.copy();blocked[oy:oy+oh,ox:ox+ow]=58
with_ob=[check(blocked,*shape) for shape in shapes]
assert with_ob==rec['clearance_with_obstruction'],('obstruction receipt mismatch',with_ob,rec['clearance_with_obstruction'])
assert all(x['missing']==['Dry sealed machine datum'] for x in with_ob)
# PIL verify checks PNG file structure/CRC; subsequent independent pixel decode compares
# indexed-material exact values, NOT display RGB approximations.
pix=0;outputs={}
for name,meta in rec['images'].items():
    path=D/name; buf=path.read_bytes();assert sha(buf)==meta['sha256'],name
    with Image.open(path) as img: img.verify()
    with Image.open(path) as img:
        assert img.mode=='P',('not actual indexed material',name,img.mode)
        x,y,w,h=meta['origin']
        assert 0<=x and 0<=y and x+w<=W and y+h<=H and img.size==(w,h)
        data=np.asarray(img)
        assert np.array_equal(data,g[y:y+h,x:x+w]),('image not material pixel parity',name)
        pix+=data.size
        outputs[name]={'sha256':sha(buf),'material_pixel_parity':True,'pixels':data.size,'extent':[x,y,w,h]}
assert len(outputs)>=6 and 'overview.png' in outputs
# Source-grid and json are proven by independent decode, not by builder log.
verified={'source_static':'PASS','native_status':'NATIVE-UNTESTED','independent_method':'ordered setup replay + integral-image conservative clearance + deque 4-cardinal BFS + PNG CRC/decoded-pixel parity','engine_authority':rec['source_authority'],
 'setup_sha256':sha(raw),'grid_sha256':sha(g.tobytes()),'world':[W,H],'cells':g.size,
 'rectangles':len(setup['edits']),'setup_bytes':len(raw),'construction_work':int(solids.sum()),
 'retained_inert_boundary_rooted':rooted,'retained_detached':0,'occupied_material_ids':sorted(solid_ids),
 'material_histogram':hist,'site_checks':checks,'obstructed_checks':with_ob,
 'images':outputs,'total_authentic_source_pixels_tested':pix,'art_or_technical_external_review':False,
 'native_tests_performed':False}
(D/'independent_verification.json').write_text(json.dumps(verified,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'PASS':True,'cells':g.size,'rectangles':len(setup['edits']),'sites':[t['reachable'] for t in checks],'obstruction_survivors':[t['reachable'] for t in with_ob],'pixels':pix,'sha256':sha(g.tobytes())}))
