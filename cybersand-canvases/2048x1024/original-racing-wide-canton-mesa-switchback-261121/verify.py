#!/usr/bin/env python3
"""Independent replay, topology, physical-law and indexed-image proof.

Does not import builder, its geometry methods, or route auditor. No native claim.
"""
from pathlib import Path
import json, hashlib
import numpy as np
from scipy import ndimage as ndi
from PIL import Image
P=Path(__file__).resolve().parent
sraw=(P/'setup-canton-mesa-switchback.json').read_bytes()
s=json.loads(sraw);q=json.loads((P/'qualification.json').read_text())
assert s['version']==2 and s['extent']==[2048,1024]
assert set(s)==set(['version','extent','actors','next_id','selected','edits','response','liquid_policy','normalize','rule_radius','source','material','brush','fire'])
assert len(sraw)<=1048576 and len(s['edits'])<=32768
assert len(s['actors'])==1 and s['actors'][0]['spawn']==q['sites']['West launch gantry']
assert s['actors'][0]['model']=='midge' and s['next_id']==2 and s['selected']==1
W,H=s['extent'];a=np.zeros((H,W),dtype=np.uint8)
seen=np.zeros((H,W),dtype=np.uint8)
allow={58,62,100,101,117,113,122,72}
for i,item in enumerate(s['edits']):
 assert len(item)==5 and all(type(n)==int for n in item),(i,item)
 x,y,w,h,m=item
 assert w>0 and h>0 and x>=0 and y>=0 and x+w<=W and y+h<=H,(i,item)
 assert m in allow,(i,item)
 assert not np.any(seen[y:y+h,x:x+w]),('overlap',i,item)
 seen[y:y+h,x:x+w]=1
 a[y:y+h,x:x+w]=m
assert len(s['edits'])==q['rectangle_count']
assert int(seen.sum())==q['rectangle_work']==int(np.count_nonzero(a))
assert np.count_nonzero((a!=0)&(seen==0))==0
sha=hashlib.sha256(a.tobytes()).hexdigest()
assert sha==q['source_grid_sha256']
assert hashlib.sha256(sraw).hexdigest()==q['setup_sha256']
hist={str(int(x)):int(n) for x,n in zip(*np.unique(a,return_counts=True))}
assert hist==q['material_histogram'] and sum(hist.values())==2097152
# A second, distinct canonical packing algorithm: immutable row run union.
flat=[];prior={}
for y in range(H):
 spans=[];row=a[y];ints=row.astype('int16')
 boundaries=np.r_[0,np.flatnonzero(np.diff(ints)!=0)+1,W]
 for left,right in zip(boundaries[:-1],boundaries[1:]):
  m=int(row[left]);key=(int(left),int(right-left),m)
  if m==0:continue
  if key in prior:rec=prior[key];rec[3]+=1
  else:rec=[int(left),y,int(right-left),1,m];flat.append(rec)
  spans.append((key,rec))
 prior=dict(spans)
assert flat==s['edits'],('noncanonical source rectangles',len(flat),len(s['edits']))
# Exhaustive hard-solid 4-neighbour load path to world boundary.
labels,n=ndi.label(a>0,structure=np.array([[0,1,0],[1,1,1],[0,1,0]]))
root_labels=set(labels[0,:].tolist()+labels[-1,:].tolist()+labels[:,0].tolist()+labels[:,-1].tolist())-{0}
roots=int(np.count_nonzero(np.isin(labels,list(root_labels))))
solids=int(np.count_nonzero(a))
assert roots==solids and n==1,(roots,solids,n)
assert all(int(k) in allow or k=='0' for k in hist)
assert np.all((a==0)|(a==58)|(a==62)|(a==100)|(a==101)|(a==117)|(a==113)|(a==122)|(a==72))
# Full pixel-index parity of every original, unscaled indexed-material PNG.
images=[];validated=0
for name,geom in q['crops'].items():
 x,y,w,h=geom;im=Image.open(P/name);im.verify()
 with Image.open(P/name) as im:
  assert im.format=='PNG' and im.mode=='P' and im.size==(w,h),(name,im.mode,im.size)
  pixels=np.array(im,dtype=np.uint8)
  assert np.array_equal(pixels,a[y:y+h,x:x+w]),('indexed pixel mismatch',name)
  validated+=int(w*h)
  images.append({'name':name,'bounds':geom,'pixels':w*h,'mode':'P','sha256':hashlib.sha256((P/name).read_bytes()).hexdigest()})
assert len(images)>=5
report={'status':'INDEPENDENT-SOURCE-STATIC-PASS / NATIVE-UNTESTED',
'engine_source_sha':q['engine_authority_sha'],'source_grid_sha256':sha,
'setup_sha256':hashlib.sha256(sraw).hexdigest(),
'cells':W*H,'rectangle_count':len(flat),'setup_json_bytes':len(sraw),
'ordered_replay_overlaps':0,'replay_mismatches':0,'canonical_rectangle_mismatches':0,
'boundary_rooted_solids':roots,'all_structural_solids':solids,'solid_components':n,
'fluid_falling_reactive_final_cells':0,'allowed_inert_material_ids':sorted(allow),
'png_count':len(images),'png_verified_material_index_pixels':validated,'images':images,
'native':'NATIVE-UNTESTED'}
(P/'independent-verification.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k not in ['images','allowed_inert_material_ids']},indent=2))
