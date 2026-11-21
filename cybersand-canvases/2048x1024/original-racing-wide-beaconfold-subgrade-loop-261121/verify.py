#!/usr/bin/env python3
"""Independent-from-builder setup replay and conservative route/PNG auditor.
Never imports build.py, reads only committed JSON source and image artifacts.
"""
from pathlib import Path
import json, hashlib
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

P=Path(__file__).resolve().parent
setup_file=P/'setup-beaconfold-subgrade-loop.json'
q=json.loads((P/'qualification.json').read_text())
s=json.loads(setup_file.read_text()); H,W=1024,2048
assert s['version']==2 and s['extent']==[W,H]
assert len(s)==14 and len(s['actors'])==1 and s['actors'][0]['model']=='midge'
assert [k for k in s.keys()]==['version','extent','actors','next_id','selected','edits','response','liquid_policy','normalize','rule_radius','source','material','brush','fire']
assert len(s['liquid_policy'])==55
assert len(s['edits'])<=32768 and setup_file.stat().st_size<=1048576
assert len(s['edits'])==q['rectangle_count']
assert hashlib.sha256(setup_file.read_bytes()).hexdigest()==q['setup_sha256']
ids={0,58,62,72,100,101,113,117,122}
canvas=np.zeros((H,W),dtype=np.uint8);used=np.zeros((H,W),dtype=bool)
for ix,r in enumerate(s['edits']):
    assert len(r)==5 and all(type(v) is int for v in r),(ix,r)
    x,y,w,h,m=r
    assert 0<=x<W and 0<=y<H and 0<w<=W-x and 0<h<=H-y and m in ids-{0},(ix,r)
    assert not used[y:y+h,x:x+w].any(),('OVERLAP',ix,r)
    used[y:y+h,x:x+w]=True;canvas[y:y+h,x:x+w]=m
assert np.count_nonzero(canvas)==q['rectangle_work']
assert hashlib.sha256(canvas.tobytes()).hexdigest()==q['source_grid_sha256']
u,c=np.unique(canvas,return_counts=True);hist={str(int(a)):int(b) for a,b in zip(u,c)}
assert hist==q['material_histogram'],hist
for n,v in q['png_crops'].items():
    x,y,w,h=v; im=Image.open(P/n);im.load()
    assert im.mode=='P' and im.size==(w,h),(n,im.mode,im.size)
    palette=[0,58,62,100,101,113,117,122,72]
    rendered=np.array(im,dtype=np.uint8)
    restored=np.asarray(palette,dtype=np.uint8)[rendered]
    assert np.array_equal(restored,canvas[y:y+h,x:x+w]),n
cross=np.array([[0,1,0],[1,1,1],[0,1,0]],dtype=np.uint8)
solids=canvas!=0
solid_labels,n_solid=ndi.label(solids,structure=cross)
root=np.unique(np.concatenate([solid_labels[0],solid_labels[-1],solid_labels[:,0],solid_labels[:,-1]]))
root=set(int(x) for x in root if x)
detached=sorted([(lab,int((solid_labels==lab).sum())) for lab in range(1,n_solid+1) if lab not in root],key=lambda p:-p[1]);
print('solid_components',n_solid,'roots',len(root),'detached',detached[:12],flush=True)
assert not detached,('DETACHED_SOLID',detached[:30])
centres={}
for dims in [(19,15),(23,19),(31,27)]:
    w,h=dims
    # Exact occupied-cell Minkowski expansion, border treated as solid.
    full_free=ndi.maximum_filter(solids.astype(np.uint8),size=(h,w),mode='constant',cval=1)==0
    labels,n=ndi.label(full_free,structure=cross)
    sx,sy=s['actors'][0]['spawn'];sid=labels[sy,sx]
    assert sid>0,('SPAWN_UNCLEAR',dims)
    bad=[]
    for name,(x,y) in q['sites'].items():
        if not (0<=x<W and 0<=y<H) or labels[y,x]!=sid:bad.append((name,[x,y],int(labels[y,x])))
    centres[f'{w}x{h}']={'valid_sites':len(q['sites'])-len(bad),'total_sites':len(q['sites']),
                          'component_centres':int((labels==sid).sum()),'bad':bad}
    print('clearance',dims,'bad',bad,flush=True)
    assert not bad,('SITES',dims,bad)
# Physically seal a room entrance using actual material cells.
block=q['obstruction_xywh'];x,y,w,h=block
altered=canvas.copy();altered[y:y+h,x:x+w]=58
blocked={}
for dims in [(19,15),(23,19),(31,27)]:
    w,h=dims
    free=ndi.maximum_filter((altered!=0).astype(np.uint8),size=(h,w),mode='constant',cval=1)==0
    labels,n=ndi.label(free,structure=cross)
    sx,sy=s['actors'][0]['spawn'];sid=labels[sy,sx]
    absent=[name for name,(px,py) in q['sites'].items() if labels[py,px]!=sid]
    blocked[f'{w}x{h}']={'valid_sites':len(q['sites'])-len(absent),'absent':absent}
    print('blocked',dims,'absent',absent,flush=True)
    assert absent==[q['blocked_site']],('UNEXPECTED_OBSTRUCTION_RESULT',dims,absent)
    assert 'Finish west approach' not in absent
    assert all(name in q['sites'] for name in absent)
receipt={'schema_version':1,'source_grid_sha256':q['source_grid_sha256'],'setup_sha256':q['setup_sha256'],
         'material_histogram':hist,'rectangle_count':len(s['edits']),'rectangle_work':int(np.count_nonzero(canvas)),
         'solid_components':n_solid,'grounded_solids':int(solids.sum()),'detached_solids':len(detached),
         'failing_ids':[], 'pngs_verified':[{'name':n,'size':v[2:],'full_pixel_parity':True} for n,v in q['png_crops'].items()],
         'sites':centres,'with_obstruction':blocked,'native':'NATIVE-UNTESTED'}
(P/'independent-verification.json').write_text(json.dumps(receipt,indent=2)+'\n')
print('static verification COMPLETE')
