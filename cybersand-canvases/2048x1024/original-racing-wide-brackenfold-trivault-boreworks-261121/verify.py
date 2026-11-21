#!/usr/bin/env python3
"""Independent decoding/replay/physical & indexed-gallery audit. Never imports build.py."""
import json,hashlib
from pathlib import Path
import numpy as np
from scipy import ndimage as ndi
from PIL import Image
P=Path(__file__).resolve().parent
q=json.loads((P/'qualification.json').read_text())
raw=(P/'setup-brackenfold-trivault-boreworks.json').read_bytes();s=json.loads(raw)
assert list(s)==['version','extent','actors','next_id','selected','edits','response','liquid_policy','normalize','rule_radius','source','material','brush','fire']
assert s['version']==2 and s['extent']==[2048,1024]
assert s['actors'][0]['model']=='midge' and s['actors'][0]['spawn']==q['sites'][q['start_site']]
assert hashlib.sha256(raw).hexdigest()==q['setup_sha256'] and len(raw)==q['setup_bytes']<=1048576
assert len(s['edits'])==q['rectangle_count']<=32768
G=np.zeros((1024,2048),np.uint8);taken=np.zeros(G.shape,bool)
allowed={58,62,100,101,113,117,122,72}
for i,r in enumerate(s['edits']):
 assert len(r)==5
 x,y,w,h,mid=r
 assert 0<=x<2048 and 0<=y<1024 and 1<=w<=2048-x and 1<=h<=1024-y and mid in allowed,(i,r)
 assert not taken[y:y+h,x:x+w].any(),('overlap',i)
 G[y:y+h,x:x+w]=mid;taken[y:y+h,x:x+w]=True
hist={str(int(m)):int((G==m).sum()) for m in np.unique(G)}
assert hist==q['material_histogram']
assert hashlib.sha256(G.tobytes()).hexdigest()==q['material_plane_sha256']
assert int(taken.sum())==q['rectangle_work']
# Independent canonical rectangle reconstruction, exact source ordering.
active={};out=[]
for y,row in enumerate(G):
 new={};x=0
 while x<2048:
  m=int(row[x]);start=x
  while x<2048 and int(row[x])==m:x+=1
  if m==0:continue
  key=(start,x-start,m)
  if key in active:rect=active[key];rect[3]+=1
  else:rect=[start,y,x-start,1,m];out.append(rect)
  new[key]=rect
 active=new
assert out==s['edits'], 'ordered canonical lossless replay mismatch'
# Actual all-solids four-neighbour rooted proof; no floating machine decals.
labels,n=ndi.label(taken,structure=np.array([[0,1,0],[1,1,1],[0,1,0]]))
rootset=set(np.unique(np.concatenate([labels[0,:],labels[-1,:],labels[:,0],labels[:,-1]])))
loose=[(k,int((labels==k).sum())) for k in range(1,n+1) if k not in rootset]
assert not loose,('unrooted materials',loose)
pix=0
for fn,(x,y,w,h) in q['png_crops'].items():
 with Image.open(P/fn) as im:im.verify()
 with Image.open(P/fn) as im:
  assert im.mode=='P' and im.size==(w,h),(fn,im.mode,im.size)
  assert np.array_equal(np.asarray(im),G[y:y+h,x:x+w]),fn
 pix+=w*h
assert pix==q['png_index_pixels']
report={'status':'SOURCE-STATIC-INDEPENDENT-PASS / NATIVE-UNTESTED','source_sha256':q['material_plane_sha256'],'rectangles':len(s['edits']),'material_cells':int(taken.sum()),'rooted_cells':int(taken.sum()),'root_components':len(rootset-{0}),'disconnected':0,'mobile_falling_reactive_or_fluid_cells':0,'pngs':len(q['png_crops']),'png_verified_material_pixels':pix,'canonical_replay':True,'material_histogram':hist}
(P/'independent-verification.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report))
