#!/usr/bin/env python3
"""Standalone exact-site conservative Midge 4-neighbour BFS and physical blockage.
Reconstructs plane from committed Setup, never imports original geometry source.
"""
from pathlib import Path
import numpy as np,json
from scipy import ndimage as ndi
P=Path(__file__).resolve().parent
s=json.loads((P/'setup-cinderlift-split-fault-exchange.json').read_text())
q=json.loads((P/'qualification.json').read_text())
G=np.zeros((1024,2048),dtype=np.uint8)
for x,y,w,h,m in s['edits']:
 assert not G[y:y+h,x:x+w].any();G[y:y+h,x:x+w]=m
S=q['sites'];start=S['West launch'];bx,by,bw,bh=q['obstruction_xywh'];bad=q['blocked_site']
assert (bx,by,bw,bh)==(987,185,99,112)
se=np.array([[0,1,0],[1,1,1],[0,1,0]],dtype=bool)
def free(g,w,h):
 return ndi.binary_erosion(g==0,structure=np.ones((h,w),bool),border_value=0)
def labels(g,w,h):return ndi.label(free(g,w,h),se)[0]
def connected(l,a,b):return l[a[1],a[0]]>0 and l[a[1],a[0]]==l[b[1],b[0]]
block=G.copy();block[by:by+bh,bx:bx+bw]=58
result={};fails=[]
for w,h in [(19,15),(23,19),(31,27)]:
 f=free(G,w,h);l=ndi.label(f,se)[0]
 z=free(block,w,h);lb=ndi.label(z,se)[0]
 exact=[name for name,pt in S.items() if not connected(l,start,pt)]
 covered=[name for name,pt in S.items() if name!=bad and not connected(lb,start,pt)]
 illegal=[name for name,(x,y) in S.items() if not all(f[y+dy,x+dx] for dx,dy in [(0,1),(1,0),(0,-1),(-1,0)])]
 if exact or covered or illegal or z[S[bad][1],S[bad][0]]:fails.append({'hull':[w,h],'missing':exact,'blocked_unexpected':covered,'local_approach':illegal,'blocked_site_clear':bool(z[S[bad][1],S[bad][0]])})
 result[f'{w}x{h}']={'site_count':len(S),'reachable':len(S)-len(exact),'blocked_surviving':len(S)-1-len(covered),'local_approaches_passed':len(S)-len(illegal),'unexpected_failures':{'primary':exact,'blocked':covered,'approach':illegal}}
print('Exact-site proof:',json.dumps(result))
if fails:print('FAILURES',json.dumps(fails));raise SystemExit(2)
# Bbox-constrained, exact target local BFS. A generous 235px halo allows grade changes
# while preventing a false route via remote world-edge sky.
def leg(g,a,b,pad=240):
 x0,y0=S[a];x1,y1=S[b]
 lft=max(0,min(x0,x1)-pad);rgt=min(2048,max(x0,x1)+pad+1)
 top=max(0,min(y0,y1)-pad);bottom=min(1024,max(y0,y1)+pad+1)
 z=g[top:bottom,lft:rgt];f=free(z,31,27)
 aa=(x0-lft,y0-top);bb=(x1-lft,y1-top)
 if not (f[aa[1],aa[0]] and f[bb[1],bb[0]]):return False
 comp=ndi.label(f,se)[0];return connected(comp,aa,bb)
legs={}
for label,route,g in [('primary',q['primary_route'],G),('alternative',q['alternate_route'],G),('blocked_alternative',q['alternate_route'],block),('service',q['service_route'],G)]:
 failure=[[a,b] for a,b in zip(route,route[1:]) if not leg(g,a,b)]
 legs[label]={'tested':len(route)-1,'passed':len(route)-1-len(failure),'failed':failure}
print('Local leg proof:',json.dumps(legs))
if any(v['failed'] for v in legs.values()):raise SystemExit(3)
out={'status':'SOURCE-STATIC-ROUTE-PASS / NATIVE-UNTESTED','literal_named_sites':len(S),'hull_result':result,'local_legs':legs,'physical_obstruction_xywh':q['obstruction_xywh'],'obstructed_site':bad,'site_target_substitution':False,'native':'NATIVE-UNTESTED'}
(P/'local-route-qualification.json').write_text(json.dumps(out,indent=2)+'\n')
