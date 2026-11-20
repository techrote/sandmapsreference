#!/usr/bin/env python3
"""Independent authoritative-JSON replay, stability, clearance, route and real-PNG parity audit.
No import of build.cjs or access to its private in-memory grid.
Requires numpy, scipy, Pillow. Prints JSON receipt and exits nonzero on failure.
"""
from pathlib import Path
import json, hashlib, numpy as np
from scipy import ndimage as ndi
from PIL import Image
W,H=2048,1024
ROOT=Path(__file__).resolve().parent
IDS=(0,58,62,100,101,113,117,122,72)
PALETTE=((11,16,23),(62,78,88),(71,94,111),(28,41,56),(39,56,69),(115,150,158),(149,186,169),(168,190,205),(77,114,124))
CROPS={
 'overview.png':(0,0,2048,1024),
 '01-rim-dispatch.png':(45,347,390,405),
 '02-cableway-descender.png':(350,390,420,467),
 '03-broken-bridge.png':(757,335,540,470),
 '04-crater-works.png':(845,700,500,290),
 '05-eastern-freight-claw.png':(1530,285,460,465),
 '06-enterable-vaults.png':(55,675,500,315)
}
SITES={
 'Start / west rim dispatch':(165,300),
 'West launch gate':(340,580),
 'West cable descent':(585,466),
 'West lower slope':(706,635),
 'West suspended abutment underpass':(774,629),
 'Central basin':(959,621),
 'Bridge fracture aperture':(1030,352),
 'East suspended abutment underpass':(1264,623),
 'East basin slope':(1375,626),
 'East cargo approach':(1510,622),
 'East capture':(1875,625),
 'East upper lift':(1820,277),
 'East sky return':(1860,270),
 'Upper cliff return':(1485,270),
 'Upper bridge return':(1120,275),
 'Upper west return':(814,275),
 'Upper western rim':(433,300),
 'Finish / west watch':(170,355),
 'West vault entrance':(313,718),
 'West settlement vault':(161,770),
 'Middle recovery shaft':(1028,860),
 'Abandoned central cavity':(1090,924),
 'East vault descent':(1925,693),
 'East service vault':(1805,760),
 'Cableway staged holdout':(480,465),
 'Broken girder west lip':(956,330),
 'Broken girder east lip':(1113,337),
 'Crater underbridge alternative':(1040,610)
}
PRIMARY=['Start / west rim dispatch','Upper western rim','Upper west return','Broken girder west lip','Bridge fracture aperture','Crater underbridge alternative','East basin slope','East capture','East cargo approach','East suspended abutment underpass','Central basin','West suspended abutment underpass','West lower slope','West launch gate','Finish / west watch']
ALT=['Start / west rim dispatch','Upper western rim','Cableway staged holdout','West cable descent','West lower slope','West suspended abutment underpass','Crater underbridge alternative','East basin slope','East capture']
OBSTRUCTION=(997,328,70,86)  # temporary physical filled closure of bridge gap
OBSTRUCTED_NAME='Bridge fracture aperture'

def digest(raw):return hashlib.sha256(raw).hexdigest()
def replay(s):
 assert set(s)==set(['version','extent','actors','next_id','selected','edits','response','liquid_policy','normalize','rule_radius','source','material','brush','fire'])
 assert s['version']==2 and s['extent']==[W,H] and len(s['actors'])==1 and s['actors'][0]['model']=='midge'
 assert s['actors'][0]['spawn']==list(SITES[PRIMARY[0]])
 assert len(s['liquid_policy'])==55 and all(isinstance(x,int) for x in s['liquid_policy'])
 g=np.zeros((H,W),dtype=np.uint8); written=np.zeros((H,W),dtype=bool);work=0
 for r in s['edits']:
  assert len(r)==5 and all(type(v)==int for v in r),r
  x,y,w,h,m=r
  assert 0<=x<x+w<=W and 0<=y<y+h<=H and m in IDS[1:],r
  assert not written[y:y+h,x:x+w].any(),('overlapping',r)
  g[y:y+h,x:x+w]=m;written[y:y+h,x:x+w]=True;work+=w*h
 assert np.array_equal(g!=0,written)
 return g,work

def clearance(g,w,h):
 # Integer summed-area table: exact all-body clearance, full in-bounds; no shifted points.
 occ=(g!=0).astype(np.uint8)
 iy=np.pad(occ,((1,0),(1,0))).cumsum(0,dtype=np.int32).cumsum(1,dtype=np.int32)
 a=w//2;b=h//2
 cnt=iy[h:,w:]-iy[:-h,w:]-iy[h:,:-w]+iy[:-h,:-w]
 out=np.zeros((H,W),dtype=np.bool_)
 out[b:H-b,a:W-a]=cnt==0
 return out

def label_sites(free):
 structure=np.array([[0,1,0],[1,1,1],[0,1,0]],np.uint8)
 labeled,n=ndi.label(free,structure)
 x,y=SITES[PRIMARY[0]];tag=labeled[y,x]
 assert tag!=0,('blocked exact spawn',x,y)
 failures={name:('occupied' if not free[p[1],p[0]] else 'disconnected') for name,p in SITES.items() if labeled[p[1],p[0]]!=tag}
 assert not failures,('literal sites unreachable',failures)
 return int(np.sum(labeled==tag)),int(n)

def run():
 sfile=(ROOT/'setup-rookfall-caldera.json').read_bytes(); s=json.loads(sfile)
 receipt=json.loads((ROOT/'qualification.json').read_text());g,work=replay(s)
 assert len(sfile)<=1048576 and len(s['edits'])<=32768 and work<=32000000
 assert digest(g.tobytes())==receipt['grid_sha256']
 assert digest(sfile)==receipt['setup_sha256']
 assert len(s['edits'])==receipt['rectangles'] and work==receipt['work_cells']
 values,counts=np.unique(g,return_counts=True);hist=dict(zip(map(str,map(int,values)),map(int,counts)))
 assert hist==receipt['histogram']
 comps,n=ndi.label(g!=0,np.array([[0,1,0],[1,1,1],[0,1,0]],np.uint8))
 perimeter=np.unique(np.r_[comps[0],comps[-1],comps[:,0],comps[:,-1]])
 detached=np.isin(comps,np.setdiff1d(np.arange(1,n+1),perimeter)).sum()
 assert detached==0,('unrooted final solids',detached)
 pngs={};pixel_count=0
 for name,(x,y,w,h) in CROPS.items():
  p=ROOT/name
  with Image.open(p) as im:
   assert im.format=='PNG' and im.mode=='P' and im.size==(w,h),(name,im.mode,im.size)
   palette=im.getpalette()
   assert all(tuple(palette[i*3:i*3+3])==rgb for i,rgb in enumerate(PALETTE)),name
   idx=np.asarray(im).astype(np.uint8)
   actual=np.array(IDS,dtype=np.uint8)[idx]
   expected=g[y:y+h,x:x+w]
   assert np.array_equal(actual,expected),('indexed material PNG mismatch',name)
   pngs[name]={'bytes':p.stat().st_size,'sha256':digest(p.read_bytes()),'pixels':w*h}
   pixel_count+=w*h
 stats={}
 for w,h in ((19,15),(23,19),(31,27)):
  free=clearance(g,w,h)
  count,components=label_sites(free)
  stats[f'{w}x{h}']={'literal_sites':len(SITES),'reachable':len(SITES),'connected_free_centres':count,'free_components':components}
 ob_g=g.copy();x,y,w,h=OBSTRUCTION;ob_g[y:y+h,x:x+w]=58
 for width,height in ((19,15),(23,19),(31,27)):
  free=clearance(ob_g,width,height)
  labeled,_=ndi.label(free,np.array([[0,1,0],[1,1,1],[0,1,0]],np.uint8))
  sx,sy=SITES[PRIMARY[0]];tag=labeled[sy,sx]
  assert tag!=0
  failed=[name for name,p in SITES.items() if labeled[p[1],p[0]]!=tag]
  assert failed==[OBSTRUCTED_NAME],('blocked alternate not as designed',width,height,failed)
  for name in [*ALT,'Finish / west watch','East service vault','West settlement vault']:
   if name!=OBSTRUCTED_NAME:assert labeled[SITES[name][1],SITES[name][0]]==tag
 summary={'schema':'rookfall-source-static-audit-v1','source_setup_sha256':digest(sfile),'source_grid_sha256':digest(g.tobytes()),'cells':W*H,'rectangles':len(s['edits']),'work_cells':work,'setup_bytes':len(sfile),'histogram':hist,'grounded_solids':int((g!=0).sum()),'detached_solids':0,'falling_liquid_reactive':0,'envelopes':stats,'physical_obstruction_xywh':OBSTRUCTION,'obstructed_site':OBSTRUCTED_NAME,'obstruction_remaining_reachable_sites':len(SITES)-1,'alternative_and_finish_reachable':True,'pngs':pngs,'verified_png_index_pixels':pixel_count,'native':'NATIVE-UNTESTED'}
 (ROOT/'independent-verification.json').write_text(json.dumps(summary,indent=2)+'\n')
 print('VERIFIED '+json.dumps({k:summary[k] for k in ('cells','rectangles','work_cells','grounded_solids','verified_png_index_pixels','obstruction_remaining_reachable_sites')}))
if __name__=='__main__':run()
