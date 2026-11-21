#!/usr/bin/env python3
"""Independent from-builder literal-site, eroded-hull and locally bounded path audit."""
import json,collections,numpy as np,hashlib
from scipy import ndimage as ndi
from pathlib import Path
p=Path(__file__).resolve().parent
setup=json.loads((p/'setup-morrow-dry-cable-islands.json').read_text())
route=json.loads((p/'route-data.json').read_text())
W,H=2048,1024;g=np.zeros((H,W),dtype=np.uint8)
for x,y,w,h,m in setup['edits']:
 assert 0<=x and 0<=y and w>0 and h>0 and x+w<=W and y+h<=H and m in [58,62,100,101,113,117,122,72]
 assert not np.any(g[y:y+h,x:x+w]);g[y:y+h,x:x+w]=m
sites=route['sites'];root=sites['Launch western quay'];BLOCK=route['blocked_site'];bx,by,bw,bh=route['obstruction_xywh']
def clear_map(mat,hw,hh):return ndi.binary_erosion(mat==0,structure=np.ones((hh,hw),bool),border_value=0)
def connected(clear):return ndi.label(clear,structure=np.array([[0,1,0],[1,1,1],[0,1,0]]))[0]
checks={}
for hw,hh in [(19,15),(23,19),(31,27)]:
 free=clear_map(g,hw,hh);labels=connected(free);x,y=root;target=labels[y,x]
 fails=[name for name,(x,y) in sites.items() if labels[y,x]!=target or not target]
 assert not fails,(hw,hh,fails)
 assert all(free[y+dy,x+dx] for x,y in sites.values() for dx,dy in [(1,0),(-1,0),(0,1),(0,-1)]), [(name, [d for d in [(1,0),(-1,0),(0,1),(0,-1)] if not free[y+d[1],x+d[0]]]) for name,(x,y) in sites.items() if any(not free[y+d[1],x+d[0]] for d in [(1,0),(-1,0),(0,1),(0,-1)])]
 alt=g.copy();alt[by:by+bh,bx:bx+bw]=58
 blocked=clear_map(alt,hw,hh);bl=connected(blocked);label=bl[root[1],root[0]]
 failures=[name for name,(x,y) in sites.items() if name!=BLOCK and bl[y,x]!=label]
 assert not failures,(hw,hh,failures)
 assert not blocked[sites[BLOCK][1],sites[BLOCK][0]]
 checks[f'{hw}x{hh}']={'exact_reached':len(sites),'blocked_reached':len(sites)-1,'local_approaches':len(sites)*4,'blocked_site':BLOCK}
print('site proof',checks)
# 31x27 bounded BFS: exact source and target; no shifting, no substitutions.
# Coordinates bound every leg independently, avoiding accidental reliance on a world-wrap detour.
def local_pass(grid,at,to,pad=205):
 x0,y0=sites[at];x1,y1=sites[to];left=max(0,min(x0,x1)-pad);right=min(W,max(x0,x1)+pad+1);top=max(0,min(y0,y1)-pad);bottom=min(H,max(y0,y1)+pad+1)
 block=grid[top:bottom,left:right]
 free=clear_map(block,31,27); ax,ay=x0-left,y0-top; bx,by=x1-left,y1-top
 if not(free[ay,ax] and free[by,bx]):return False
 labels=connected(free);return labels[ay,ax]==labels[by,bx] and labels[ay,ax]>0
cases={}
for name,key,scenario in [('primary','PRIMARY',g),('alternative','ALTERNATE',g),('blocked_alternative','ALTERNATE',None)]:
 if scenario is None:scenario=g.copy();scenario[by:by+bh,bx:bx+bw]=58
 names=route[{'PRIMARY':'primary_route','ALTERNATE':'alternate_route'}[key]];failed=[]
 for a,b in zip(names,names[1:]):
  if not local_pass(scenario,a,b):failed.append([a,b])
 cases[name]={'legs':len(names)-1,'passed':len(names)-1-len(failed),'failures':failed}
 print(name,cases[name])
 assert not failed
out={'site_proof':checks,'route_leg_proof':cases,'obstruction':route['obstruction_xywh'],'blocked_site':BLOCK,'site_count':len(sites),'status':'SOURCE-STATIC-QUALIFIED / NATIVE-UNTESTED'}
(p/'local-route-qualification.json').write_text(json.dumps(out,indent=2)+'\n')
