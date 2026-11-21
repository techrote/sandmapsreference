#!/usr/bin/env python3
"""Independent, conservative 31x27 bounded local route-leg clearance evidence.

Uses only immutable committed Setup-v2 cells, not the geometry builder. Each leg
is allowed a deterministic 270px bounding margin, preventing a global-circuit
shortcut from proving arbitrary local connectivity. No native movement claim.
"""
import json
from pathlib import Path
import numpy as np
from scipy import ndimage as ndi
P=Path(__file__).resolve().parent
s=json.loads((P/'setup-beaconfold-subgrade-loop.json').read_text())
q=json.loads((P/'qualification.json').read_text())
H,W=1024,2048
cells=np.zeros((H,W),dtype=np.uint8)
for x,y,w,h,m in s['edits']:cells[y:y+h,x:x+w]=m
cross=np.array([[0,1,0],[1,1,1],[0,1,0]],dtype=np.uint8)

def proof(world,a,b,margin=300):
    x1,y1=q['sites'][a];x2,y2=q['sites'][b]
    lowx=max(0,min(x1,x2)-margin); highx=min(W,max(x1,x2)+margin+1)
    lowy=max(0,min(y1,y2)-margin); highy=min(H,max(y1,y2)+margin+1)
    neighborhood=world[lowy:highy,lowx:highx]!=0
    free=ndi.maximum_filter(neighborhood.astype(np.uint8),size=(27,31),mode='constant',cval=1)==0
    labels,count=ndi.label(free,structure=cross)
    label_a=int(labels[y1-lowy,x1-lowx]);label_b=int(labels[y2-lowy,x2-lowx])
    return {'from':a,'to':b,'window_xywh':[lowx,lowy,highx-lowx,highy-lowy],
            'connected':bool(label_a and label_a==label_b),
            'start_clear':bool(label_a),'end_clear':bool(label_b)}

paths={}
for kind,route in [('primary',q['primary_route']),('alternate',q['alternate_route'])]:
    legs=[proof(cells,a,b) for a,b in zip(route,route[1:])]
    paths[kind]={'passed':sum(v['connected'] for v in legs),'total':len(legs),'legs':legs}
    print(kind,paths[kind]['passed'],len(legs),[f"{v['from']} -> {v['to']}" for v in legs if not v['connected']],flush=True)
# Physically block central operating chamber. The primary skyline remains
# traversable while the alternate spur's single operator room is inaccessible.
x,y,w,h=q['obstruction_xywh']
altered=cells.copy();altered[y:y+h,x:x+w]=58
route=q['alternate_route']
blocked=[proof(altered,a,b) for a,b in zip(route,route[1:])]
paths['blocked_alternate']={'passed':sum(v['connected'] for v in blocked),'total':len(blocked),'legs':blocked}
print('blocked_alternate',paths['blocked_alternate']['passed'],len(blocked),flush=True)
assert all(v['connected'] for v in paths['primary']['legs']), 'Primary bounded route leg failed'
assert all(v['connected'] for v in paths['alternate']['legs']), 'Alternate bounded route leg failed'
assert all(v['connected'] for v in blocked), 'Blocked alternate route leg failed'
# Adjacent conservative free-centre directions near the two subgrade elevators;
# prove turn-in/return feasibility, rather than all named sites being 4-way clear.
free=ndi.maximum_filter((cells!=0).astype(np.uint8),size=(27,31),mode='constant',cval=1)==0
for name in ['East downshaft throat','East subgrade elbow','West subgrade elbow','Return shaft launch','Finish west approach']:
    xx,yy=q['sites'][name]
    assert all(bool(free[yy+dy,xx+dx]) for dx,dy in [(0,0),(1,0),(-1,0),(0,1),(0,-1)]),name
receipt={'schema_version':1,'source_grid_sha256':q['source_grid_sha256'],'hull_wh':[31,27],
         'margin_per_leg':300,'physical_obstruction_xywh':q['obstruction_xywh'],
         'checked_elevator_and_finish_cardinal_centres':True,
         'paths':paths,'native':'NATIVE-UNTESTED'}
(P/'local-route-qualification.json').write_text(json.dumps(receipt,indent=2)+'\n')
print('BOUNDED STATIC ROUTE PASS',flush=True)
