#!/usr/bin/env python3
"""Independent static Midge route proof from committed Setup-v2 cells.
No builder imports; no nearest-point shifting, no radius exemptions, no native claims.
"""
from pathlib import Path
import json,hashlib
import numpy as np
from scipy import ndimage as ndi
P=Path(__file__).resolve().parent
s=json.loads((P/'setup-canton-mesa-switchback.json').read_text())
q=json.loads((P/'qualification.json').read_text())
W,H=s['extent'];assert (W,H)==(2048,1024)
g=np.zeros((H,W),dtype=np.uint8)
for x,y,w,h,m in s['edits']:g[y:y+h,x:x+w]=m
sites=q['sites'];primary=q['primary'];alternative=q['alternative'];block=q['obstruction']
structure=np.array([[0,1,0],[1,1,1],[0,1,0]],dtype='uint8')

def clear_cells(g,w,h):
 return ndi.maximum_filter((g!=0).astype('uint8'),size=(h,w),mode='constant',cval=1)==0

def full_reach(clear):
 labels,n=ndi.label(clear,structure=structure)
 sx,sy=sites['West launch gantry'];origin=int(labels[sy,sx]);assert origin!=0
 return {name: bool(int(labels[y,x])==origin) for name,(x,y) in sites.items()},labels

def bounded_leg(clear,start,end,margin=220):
 x0,y0=sites[start];x1,y1=sites[end]
 l=max(0,min(x0,x1)-margin);r=min(W,max(x0,x1)+margin+1)
 t=max(0,min(y0,y1)-margin);b=min(H,max(y0,y1)+margin+1)
 crop=clear[t:b,l:r]
 lab,n=ndi.label(crop,structure=structure)
 return bool(lab[y0-t,x0-l] and lab[y0-t,x0-l]==lab[y1-t,x1-l]),[l,t,r-l,b-t]

report={'envelopes':{},'leg_margin_cells':220,'local_legs':{},'blocked_case':{},'status':'SOURCE-STATIC PASS / NATIVE-UNTESTED'}
for w,h in [(19,15),(23,19),(31,27)]:
 clear=clear_cells(g,w,h);reach,_=full_reach(clear)
 card={k:all(0<=x+dx<W and 0<=y+dy<H and clear[y+dy,x+dx] for dx,dy in [(-1,0),(1,0),(0,-1),(0,1)]) for k,(x,y) in sites.items()}
 report['envelopes'][f'{w}x{h}']={'reachable':sum(reach.values()),'sites':len(sites),'failed':[k for k,v in reach.items() if not v],'four_cardinal_clear':sum(card.values()),'four_cardinal_failed':[k for k,v in card.items() if not v]}
 assert all(reach.values()),report['envelopes'][f'{w}x{h}']
 assert all(card.values()),report['envelopes'][f'{w}x{h}']
 if (w,h)==(31,27):
  for label,route in [('primary',primary),('alternative',alternative)]:
   items=[]
   for a,b in zip(route,route[1:]):
    ok,bounds=bounded_leg(clear,a,b)
    items.append({'from':a,'to':b,'bbox':bounds,'pass':ok})
   report['local_legs'][label]=items
   assert all(i['pass'] for i in items),[(i['from'],i['to']) for i in items if not i['pass']]
  # Assert secondary destinations are locally approached from nearest designated
  # district, never by substituting altered target coordinates.
  hubs={'West machinist chamber':'Western service cruise','West pump bridge':'Western service cruise',
        'Old load cellar':'Basin lateral','Central survey stage':'Middle canton passage',
        'East fabricator lookout':'Eastern interchange','Deep east annex':'East turnaround',
        'Deep middle spur':'Central basin return','Mesa view stair':'Basin lateral'}
  services=[]
  for dest,src in hubs.items():
   ok,bounds=bounded_leg(clear,src,dest,margin=220)
   services.append({'from':src,'to':dest,'bbox':bounds,'pass':ok})
  report['local_legs']['service']=services
  assert all(x['pass'] for x in services),[x for x in services if not x['pass']]
# Actual material obstruction, NOT a virtual graph edge removal.
gb=g.copy();x,y,w,h=block;gb[y:y+h,x:x+w]=58
for w,h in [(19,15),(23,19),(31,27)]:
 clear=clear_cells(gb,w,h);reach,_=full_reach(clear)
 report['blocked_case'][f'{w}x{h}']={'reachable':sum(reach.values()),'unreachable':[k for k,v in reach.items() if not v],
    'finish_survives':reach['West finish'],'alternative_destinations_survive':all(reach[n] for n in alternative)}
 assert report['blocked_case'][f'{w}x{h}']['unreachable']==[q['blocked_upper_cue']],report['blocked_case'][f'{w}x{h}']
 assert report['blocked_case'][f'{w}x{h}']['alternative_destinations_survive']
 if (w,h)==(31,27):
  blocks=[]
  for a,b in zip(alternative,alternative[1:]):
   ok,bounds=bounded_leg(clear,a,b)
   blocks.append({'from':a,'to':b,'bbox':bounds,'pass':ok})
  report['local_legs']['blocked_alternative']=blocks
  assert all(z['pass'] for z in blocks),[(z['from'],z['to']) for z in blocks if not z['pass']]
(P/'local-route-qualification.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'status':report['status'],'envelopes':report['envelopes'],
 'legs':{k:sum(x['pass'] for x in v) for k,v in report['local_legs'].items()},
 'blocked':report['blocked_case']}))
