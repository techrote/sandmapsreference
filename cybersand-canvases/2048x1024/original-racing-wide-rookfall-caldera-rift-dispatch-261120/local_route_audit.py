#!/usr/bin/env python3
"""Exact-centre bounded 4-neighbour connectivity for 31x27 full body, independently replayed."""
import json,numpy as np
from pathlib import Path
from scipy import ndimage as ndi
from verify import ROOT,SITES,PRIMARY,ALT,replay,clearance,OBSTRUCTION
G,_=replay(json.loads((ROOT/'setup-rookfall-caldera.json').read_text()))
shape=np.array([[0,1,0],[1,1,1],[0,1,0]],np.uint8)

def leg(a,b,margin,free):
 (xa,ya),(xb,yb)=SITES[a],SITES[b]
 x0=max(0,min(xa,xb)-margin);x1=min(2048,max(xa,xb)+margin+1)
 y0=max(0,min(ya,yb)-margin);y1=min(1024,max(ya,yb)+margin+1)
 labeled,_=ndi.label(free[y0:y1,x0:x1],shape)
 t=int(labeled[ya-y0,xa-x0]);return bool(t and t==labeled[yb-y0,xb-x0])

free=clearance(G,31,27)
blocked=G.copy();x,y,w,h=OBSTRUCTION;blocked[y:y+h,x:x+w]=58
blocked_free=clearance(blocked,31,27)
sections={}
for case,fmap,route in [('primary',free,PRIMARY),('alternative',free,ALT),('obstructed_alternative',blocked_free,ALT)]:
 sections[case]={}
 for margin in [100,200]:
  legs=[{'from':a,'to':b,'pass':leg(a,b,margin,fmap)} for a,b in zip(route,route[1:])]
  assert all(t['pass'] for t in legs),(case,margin,legs)
  sections[case][str(margin)]={'pass':len(legs),'total':len(legs),'legs':legs}
# Local finish return from west launch after blocked fracture
assert leg('West launch gate','Finish / west watch',100,blocked_free)
summary={'schema':'rookfall-bounded-route-qualification-v1','claim':'source-static literal-centre four-neighbour connectivity, not actual flight handling or speed','full_hull':[31,27], 'route_graph':{'primary':PRIMARY,'alternative':ALT},'obstruction_xywh':OBSTRUCTION,'sections':sections,'finish_local_return_under_obstruction':True,'native':'NATIVE-UNTESTED'}
(ROOT/'local-route-qualification.json').write_text(json.dumps(summary,indent=2)+'\n')
print('BOUNDED_PASS',*(f'{k}:{v["100"]["pass"]}/{v["100"]["total"]}' for k,v in sections.items()))
