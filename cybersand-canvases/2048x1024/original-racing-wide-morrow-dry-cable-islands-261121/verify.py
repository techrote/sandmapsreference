#!/usr/bin/env python3
"""Independent-from-builder material, RGB-index and deterministic replay audit.
Dependencies: Python 3, NumPy, SciPy, Pillow. Never invokes native Workbench.
"""
import json,hashlib
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
P=Path(__file__).resolve().parent
q=json.loads((P/'qualification.json').read_text())
s=json.loads((P/'setup-morrow-dry-cable-islands.json').read_text())
assert len(s)==14 and s['version']==2 and s['extent']==[2048,1024]
assert s['actors'][0]['spawn']==q['sites']['Launch western quay']
assert len(s['edits'])<=32768
raw=(P/'setup-morrow-dry-cable-islands.json').read_bytes()
assert len(raw)<=1048576 and hashlib.sha256(raw).hexdigest()==q['setup_sha256']
W,H=2048,1024
g=np.zeros((H,W),dtype=np.uint8);vis=np.zeros((H,W),dtype=bool)
allowed={58,62,100,101,113,117,122,72}
for i,(x,y,w,h,mid) in enumerate(s['edits']):
 assert 0<=x<W and 0<=y<H and 0<w<=W-x and 0<h<=H-y and mid in allowed,(i,x,y,w,h,mid)
 assert not vis[y:y+h,x:x+w].any(),('overlap',i)
 g[y:y+h,x:x+w]=mid;vis[y:y+h,x:x+w]=True
hist={str(int(k)):int((g==k).sum()) for k in np.unique(g)}
assert hist==q['material_histogram']
assert hashlib.sha256(g.tobytes()).hexdigest()==q['source_grid_sha256']
assert len(s['edits'])==q['rectangle_count']
assert int(vis.sum())==q['rectangle_work']
lab,n=ndi.label(vis,structure=np.array([[0,1,0],[1,1,1],[0,1,0]]))
roots=np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]]))
assert all(i in roots for i in range(1,n+1)),('detached component',n,roots)
for filename,(x,y,w,h) in q['png_crops'].items():
 with Image.open(P/filename) as im:im.verify()
 with Image.open(P/filename) as im:
  assert im.mode=='P' and im.size==(w,h)
  pixels=np.asarray(im)
 assert np.array_equal(pixels,g[y:y+h,x:x+w]),('pixel mismatch',filename)
# Exact nonoverlap proof, no air rectangles, canonical vertical run merging.
re=[];active={}
for y,row in enumerate(g):
 new={};x=0
 while x<W:
  k=int(row[x]);start=x
  while x<W and int(row[x])==k:x+=1
  if k==0:continue
  key=(start,x-start,k)
  if key in active:r=active[key];r[3]+=1
  else:r=[start,y,x-start,1,k];re.append(r)
  new[key]=r
 active=new
assert re==s['edits'],'canonical ordered replay differs'
print(json.dumps({'status':'SOURCE-STATIC PASS / NATIVE-UNTESTED','dimensions':[W,H],
 'source_sha256':q['source_grid_sha256'],'rectangles':len(re),'occupied':int(vis.sum()),
 'grounded':int(vis.sum()),'png_pixels':sum(v[2]*v[3] for v in q['png_crops'].values()),
 'images':len(q['png_crops']),'material_ids':list(hist)}))
