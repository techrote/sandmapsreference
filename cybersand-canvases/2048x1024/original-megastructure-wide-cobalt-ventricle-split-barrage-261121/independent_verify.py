#!/usr/bin/env python3
"""Independent-method exact-cell CyberSand verifier for the Cobalt Ventricle."""
from pathlib import Path
from hashlib import sha256
import json, numpy as np
from PIL import Image
from scipy import ndimage as ndi
D=Path(__file__).resolve().parent
r=json.loads((D/'receipt.json').read_text()); b=(D/'setup.json').read_bytes();s=json.loads(b)
assert sha256(b).hexdigest()==r['setup_sha256']
W,H=s['extent'];assert (W,H)==(2048,1024)
g=np.zeros((H,W),dtype=np.uint8);cover=np.zeros((H,W),dtype=bool)
work=0
for x,y,w,h,m in s['edits']:
 assert w>0 and h>0 and x>=0 and y>=0 and x+w<=W and y+h<=H
 assert m in list(map(int,r['material_laws']))
 assert not cover[y:y+h,x:x+w].any()
 cover[y:y+h,x:x+w]=True;g[y:y+h,x:x+w]=m;work+=w*h
assert work==r['construction_work']; assert sha256(g.tobytes()).hexdigest()==r['grid_sha256']
assert {str(int(x)):int(n) for x,n in zip(*np.unique(g,return_counts=True))}==r['material_histogram']
occupied=g!=0
labels,num=ndi.label(occupied,structure=np.array([[0,1,0],[1,1,1],[0,1,0]],bool))
border=np.concatenate((labels[0,:],labels[-1,:],labels[:,0],labels[:,-1]));root=np.unique(border[border>0])
assert np.isin(labels[occupied],root).all(), 'detached material'
assert int(occupied.sum())==r['grounded_inert_solids']
for name,entry in r['images'].items():
 im=Image.open(D/name);assert im.mode=='P';x,y,w,h=entry['origin'];assert im.size==(w,h)
 assert np.array_equal(np.array(im,dtype=np.uint8),g[y:y+h,x:x+w]),name
 assert sha256((D/name).read_bytes()).hexdigest()==entry['sha256'],name
def check(grid,wh):
 ww,hh=wh;assert ww%2==hh%2==1
 free=~ndi.maximum_filter(grid!=0,size=(hh,ww),mode='constant',cval=1)
 lbl,n=ndi.label(free,structure=np.array([[0,1,0],[1,1,1],[0,1,0]],bool))
 origin=r['sites']['West inlet Midge spawn'];value=lbl[origin[1],origin[0]];assert value>0
 missing=[n for n,(x,y) in r['sites'].items() if lbl[y,x]!=value]
 return len(r['sites'])-len(missing),missing,int((lbl==value).sum())
for rec in r['clearance']:
 n,missing,component=check(g,rec['footprint']);assert n==rec['reachable'] and missing==rec['missing'] and component==rec['component']
ob=g.copy();x,y,w,h=r['obstruction_xywh'];ob[y:y+h,x:x+w]=58
for rec in r['clearance_with_obstruction']:
 n,missing,component=check(ob,rec['footprint']);assert n==rec['reachable'] and missing==rec['missing'] and component==rec['component']
out={'status':'CREATOR-EXECUTED SECOND-METHOD STATIC-PASS', 'native_status':'NATIVE-UNTESTED', 'audit_role':'not independent external reviewer', 'source_grid_sha256':r['grid_sha256'], 'setup_sha256':r['setup_sha256'], 'rectangles':len(s['edits']), 'material_cells':int(g.size), 'grounded_solids':int(occupied.sum()), 'full_hull_site_counts':[rec['reachable'] for rec in r['clearance']], 'obstructed_site_counts':[rec['reachable'] for rec in r['clearance_with_obstruction']], 'images_verified':len(r['images']), 'verified_pixel_count':sum(e['origin'][2]*e['origin'][3] for e in r['images'].values())}
(D/'independent_verification.json').write_text(json.dumps(out,indent=2)+'\n')
print('INDEPENDENT-METHOD SOURCE-STATIC PASS: grid / rectangles / ground / all full hulls / test obstruction / 6 PNGs')
print('NATIVE-UNTESTED. Not a native runtime or external reviewer certificate.')
