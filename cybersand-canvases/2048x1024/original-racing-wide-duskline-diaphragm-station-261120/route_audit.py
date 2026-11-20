#!/usr/bin/env python3
"""Source-static 31x27 bounded route leg verification; never substitutes or shifts named sites."""
from pathlib import Path
import json,collections
from verify import load,free_centres,obstruct,W,H,ROOT

SERVICES={
'West operator room':'West braking fin',
'Damping control cell':'Hoist crossing',
'Diaphragm service interior':'Upper transfer datum',
'Cryogenic panel':'Condenser nose',
'Brake control cupola':'Arrestor approach',
'West underworks vault':'West counterweight return',
'Hoist maintenance shaft':'West service return',
'Central pump vault':'Countershaft return',
'Motor clutch vault':'Return crossflow',
'Cryo manifold vault':'Undercondenser return',
'East inspection vault':'East return',
}
def bounded_path(free,a,b,pad=180):
    ax,ay=a;bx,by=b
    assert free[ay*W+ax] and free[by*W+bx]
    l=max(0,min(ax,bx)-pad);r=min(W,max(ax,bx)+pad+1)
    t=max(0,min(ay,by)-pad);bt=min(H,max(ay,by)+pad+1)
    origin=ay*W+ax;target=by*W+bx
    seen={origin};q=collections.deque([(origin,0)])
    while q:
        i,steps=q.popleft()
        if i==target:return steps,len(seen)
        x=i%W;y=i//W
        for nx,ny in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
            if nx<l or nx>=r or ny<t or ny>=bt:continue
            j=ny*W+nx
            if free[j] and j not in seen:
                seen.add(j);q.append((j,steps+1))
    return None,len(seen)
def run():
    g,r=load();sites=r['sites']; free=free_centres(g,31,27)
    legs=[]
    for role,path in [('primary',r['primary_route']),('alternate',r['alternate_route'])]:
        for a,b in zip(path,path[1:]):legs.append((role,a,b))
    for destination,approach in SERVICES.items():legs.append(('service',approach,destination))
    records=[]
    for role,a,b in legs:
        steps,explored=bounded_path(free,sites[a],sites[b]); records.append({'role':role,'from':a,'to':b,'steps':steps,'explored_centres':explored})
        if steps is None:print('FAILED',role,a,'to',b,'explored',explored)
    failures=[x for x in records if x['steps'] is None]
    if failures:raise AssertionError(f'Failed {len(failures)} bounded paths')
    blocked=obstruct(g,r['obstruction_xywh']); bf=free_centres(blocked,31,27)
    blocked_legs=[]
    for a,b in zip(r['alternate_route'],r['alternate_route'][1:]):
        steps,explored=bounded_path(bf,sites[a],sites[b],pad=180)
        blocked_legs.append({'from':a,'to':b,'steps':steps})
        assert steps is not None,('obstructed route',a,b)
    for a,b in [('East capture','East descent'),('East return','Undercondenser return'),('West climb','Finish')]:
        steps,_=bounded_path(bf,sites[a],sites[b]);assert steps is not None
    receipt={'schema':'duskline-bounded-route-audit-v1','hull':[31,27], 'margin_cells':180,
             'legs':records,'blocked_case_alternative':blocked_legs,
             'normal_pass':len(records),'blocked_alternative_pass':len(blocked_legs),
             'route_type':'literal 4-neighbour free-centre paths, no speed/flight claim'}
    (ROOT/'local-route-qualification.json').write_text(json.dumps(receipt,indent=2)+'\n')
    print('BOUNDED ROUTE PASS',len(records),'of',len(records),'primary',sum(x['role']=='primary' for x in records),'alternate',sum(x['role']=='alternate' for x in records),'service',sum(x['role']=='service' for x in records),'blocked',len(blocked_legs))
if __name__=='__main__':run()
