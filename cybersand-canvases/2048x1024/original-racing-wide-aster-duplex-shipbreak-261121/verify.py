#!/usr/bin/env python3
"""Standalone exact-Setup replay, full-body literal-site, grounding, route and PNG audit.
DO NOT import the original builder; inputs are the committed Setup JSON and PNGs.
"""
from pathlib import Path
import hashlib, json
import numpy as np
from scipy import ndimage as ndi
from PIL import Image

W,H=2048,1024
P=Path(__file__).resolve().parent
IDS=(0,58,62,100,101,113,117,122,72)
PALETTE=((9,17,24),(62,80,88),(93,105,111),(34,49,65),(21,37,51),(150,165,169),(180,185,176),(209,211,175),(79,130,148))
CROPS={
 'overview.png':(0,0,W,H),
 '01-west-breakers.png':(34,350,390,520),
 '02-raised-hull.png':(390,375,660,390),
 '03-suspended-interstice.png':(1000,235,235,610),
 '04-lower-salvage-hull.png':(1160,490,570,365),
 '05-eastern-slip-gate.png':(1700,340,330,520),
 '06-bedrock-vaults.png':(850,745,760,260)
}
SITES={
'Start / west breaker launch':(162,351),
'West injection fork':(375,342),
'Cutter bow arrival chute':(487,616),
'Cutter fore service hold':(640,489),
'Cutter main salvage hold':(755,488),
'Cutter aft cargo gallery':(885,486),
'Interstice crane approach':(1065,580),
'Double hull separation vista':(1090,540),
'Lower hull foredeck':(1200,476),
'Lower hull forward hold':(1283,604),
'Lower hull mid hold':(1410,612),
'Lower hull aft hold':(1585,605),
'East signal portal':(1755,468),
'East braking capture':(1845,580),
'East reversal pocket':(1970,720),
'Lower east return':(1770,760),
'Lower second vessel return':(1530,775),
'Under forward vessel':(1320,773),
'Under second bow':(1190,755),
'Under crane bridge':(1080,750),
'Below cutter stern':(920,745),
'Below cutter bow':(590,740),
'West recovery throat':(375,740),
'Finish / west customs':(180,351),
'West entered service vault':(210,940),
'Centre shaft portal':(1120,855),
'Under-crane service room':(1100,950),
'Lower shipbreaking vault':(1533,943),
'East salvage vault':(1890,940),
'Lower winch staging':(1030,615),
}
PRIMARY=['Start / west breaker launch','West injection fork','Cutter bow arrival chute',
 'Below cutter bow','Below cutter stern','Under crane bridge','Under second bow',
 'Under forward vessel','Lower second vessel return','Lower east return',
 'East reversal pocket','East braking capture','East signal portal',
 'Lower hull aft hold','Lower hull mid hold','Lower hull forward hold',
 'Lower hull foredeck','Interstice crane approach','Cutter aft cargo gallery',
 'Cutter main salvage hold','Cutter fore service hold','West recovery throat',
 'Finish / west customs']
ALTERNATIVE=['Start / west breaker launch','West injection fork','Cutter bow arrival chute',
 'Below cutter bow','Below cutter stern','Under crane bridge','Under second bow',
 'Under forward vessel','Lower second vessel return','Lower east return',
 'East reversal pocket','Lower east return','Lower second vessel return',
 'Under forward vessel','Under second bow','Under crane bridge','Below cutter stern',
 'Below cutter bow','West recovery throat','Finish / west customs']
OBSTRUCTION=(864,466,52,66)
OBSTRUCTED_SITE='Cutter aft cargo gallery'
FOUR=np.array([[0,1,0],[1,1,1],[0,1,0]],np.uint8)

def sha(b):return hashlib.sha256(b).hexdigest()
def replay(setup):
 assert set(setup)==set(['version','extent','actors','next_id','selected','edits','response','liquid_policy','normalize','rule_radius','source','material','brush','fire'])
 assert setup['version']==2 and setup['extent']==[W,H]
 assert len(setup['actors'])==1 and setup['actors'][0]['model']=='midge'
 assert setup['actors'][0]['spawn']==list(SITES['Start / west breaker launch'])
 assert len(setup['liquid_policy'])==55
 g=np.zeros((H,W),np.uint8);occupied=np.zeros((H,W),bool);work=0
 for row in setup['edits']:
  assert len(row)==5 and all(type(v)==int for v in row),row
  x,y,w,h,m=row
  assert 0<=x<x+w<=W and 0<=y<y+h<=H and m in IDS[1:],row
  assert not occupied[y:y+h,x:x+w].any(),('overlap',row)
  occupied[y:y+h,x:x+w]=True;g[y:y+h,x:x+w]=m;work+=w*h
 assert np.array_equal(occupied,g!=0)
 return g,work

def free_centres(grid,w,h):
 # Integral occupied-cell sum: exact whole-hull rectangle in bounds.
 oc=(grid!=0).astype(np.uint8)
 c=np.pad(oc,((1,0),(1,0))).cumsum(0,dtype=np.int32).cumsum(1,dtype=np.int32)
 a=w//2;b=h//2
 count=c[h:,w:]-c[:-h,w:]-c[h:,:-w]+c[:-h,:-w]
 result=np.zeros(grid.shape,bool)
 result[b:H-b,a:W-a]=count==0
 return result

def sites_connected(free):
 labels,components=ndi.label(free,FOUR);sx,sy=SITES['Start / west breaker launch'];tag=labels[sy,sx]
 assert tag!=0,'spawn physically obstructed'
 missing={name:('body blocked' if not free[y,x] else 'disconnected') for name,(x,y) in SITES.items() if labels[y,x]!=tag}
 return labels,tag,missing,int((labels==tag).sum()),int(components)

def leg_check(free,src,dst):
 x1,y1=SITES[src];x2,y2=SITES[dst]
 for pad in (85,135,200,270,330):
  x0=max(0,min(x1,x2)-pad);x3=min(W,max(x1,x2)+pad+1)
  y0=max(0,min(y1,y2)-pad);y3=min(H,max(y1,y2)+pad+1)
  crop=free[y0:y3,x0:x3];labs,_=ndi.label(crop,FOUR)
  l=labs[y1-y0,x1-x0];r=labs[y2-y0,x2-x0]
  if l and l==r:return {'from':src,'to':dst,'padding':pad,'rect':[x0,y0,x3-x0,y3-y0],'full_body_free_centres':int((labs==l).sum())}
 raise AssertionError(('no spatially bounded 31x27 route leg',src,dst))

def main():
 raw=(P/'setup-aster-duplex-shipbreak.json').read_bytes()
 setup=json.loads(raw);receipt=json.loads((P/'qualification.json').read_text())
 g,work=replay(setup)
 assert g.size==W*H==2097152
 assert len(raw)<=1048576 and len(setup['edits'])<=32768
 assert work<=32000000
 assert sha(g.tobytes())==receipt['grid_sha256']
 assert sha(raw)==receipt['setup_sha256']
 assert work==receipt['construction_work'] and len(setup['edits'])==receipt['rectangles']
 ids,cts=np.unique(g,return_counts=True)
 histogram={str(int(i)):int(v) for i,v in zip(ids,cts)}
 assert histogram==receipt['histogram']
 # Original-order five-field rectangle replay is exhaustive; independently row-run
 # re-encode using vertical coalescing to test canonical lossless source rectangle equality.
 canonical=[];active={}
 for y in range(H):
  row=g[y];x=0;new={}
  while x<W:
   v=int(row[x])
   if not v:x+=1;continue
   e=x+1
   while e<W and int(row[e])==v:e+=1
   key=(x,e-x,v)
   if key in active:r=active[key];r[3]+=1
   else:r=[x,y,e-x,1,v];canonical.append(r)
   new[key]=r;x=e
  active=new
 assert canonical==setup['edits'],'ordered source run decomposition changed'
 comp,n=ndi.label(g!=0,FOUR)
 edge=np.unique(np.r_[comp[0,:],comp[-1,:],comp[:,0],comp[:,-1]])
 detach=np.isin(comp,np.setdiff1d(np.arange(1,n+1),edge)).sum()
 assert detach==0,('unrooted inert solid',detach)
 image_data={};pixel_sum=0
 for filename,(x,y,w,h) in CROPS.items():
  with Image.open(P/filename) as im:
   im.load()
   assert im.format=='PNG' and im.mode=='P' and im.size==(w,h)
   palette=im.getpalette()
   assert all(tuple(palette[3*i:3*i+3])==color for i,color in enumerate(PALETTE))
   p=np.asarray(im).astype(np.uint8)
   assert np.max(p)<len(IDS)
   assert np.array_equal(np.asarray(IDS,dtype=np.uint8)[p],g[y:y+h,x:x+w]),('PNG pixel mismatch',filename)
  image_data[filename]={'extent':[x,y,w,h],'sha256':sha((P/filename).read_bytes()),'pixels':w*h,'bytes':(P/filename).stat().st_size}
  pixel_sum+=w*h
 stats={}
 for w,h in ((19,15),(23,19),(31,27)):
  labs,tag,missing,visited,count=sites_connected(free_centres(g,w,h))
  assert not missing,(w,h,missing)
  stats[f'{w}x{h}']={'literal_sites':len(SITES),'reachable':len(SITES),'connected_free_centres':visited,'free_components':count}
 bg=g.copy();ox,oy,ow,oh=OBSTRUCTION;bg[oy:oy+oh,ox:ox+ow]=58
 obstruction_receipts={}
 for w,h in ((19,15),(23,19),(31,27)):
  free=free_centres(bg,w,h);labs,tag,missing,visited,comps=sites_connected(free)
  assert missing=={OBSTRUCTED_SITE:'body blocked'},(w,h,missing)
  assert labs[SITES['Finish / west customs'][1],SITES['Finish / west customs'][0]]==tag
  obstruction_receipts[f'{w}x{h}']={'remaining_sites':len(SITES)-1,'blocked_sites':list(missing),'finish_reachable':True,'connected_free_centres':visited}
 original_route=[leg_check(free_centres(g,31,27),a,b) for a,b in zip(PRIMARY,PRIMARY[1:])]
 alternative_route=[leg_check(free_centres(bg,31,27),a,b) for a,b in zip(ALTERNATIVE,ALTERNATIVE[1:])]
 out={'schema_version':1,'map':'Aster Duplex Shipbreak','source_setup_sha256':sha(raw),'source_grid_sha256':sha(g.tobytes()),
      'cells':g.size,'rectangles':len(setup['edits']),'construction_work':work,'setup_bytes':len(raw),
      'material_histogram':histogram,'rooted_inert_solids':int((g!=0).sum()),'unrooted_solids':0,
      'mobile_falling_reactive_fluid_cells':0,'canonical_rectangle_equality':True,'ordered_replay_overlaps':0,
      'exact_literal_sites':{k:list(v) for k,v in SITES.items()},'clearance':stats,
      'obstruction_xywh':list(OBSTRUCTION),'obstruction':obstruction_receipts,
      'primary_leg_proofs':original_route,'blocked_alternative_leg_proofs':alternative_route,
      'pngs':image_data,'verified_material_png_pixels':pixel_sum,'native':'NATIVE-UNTESTED'}
 (P/'independent-verification.json').write_text(json.dumps(out,indent=2)+'\n')
 print(json.dumps({'cells':g.size,'rectangles':len(setup['edits']),'sites':len(SITES),
 'primary_31x27_legs':len(original_route),'blocked_alternative_31x27_legs':len(alternative_route),
 'grounded':int((g!=0).sum()),'png_pixels':pixel_sum},indent=2))
if __name__=='__main__':main()
