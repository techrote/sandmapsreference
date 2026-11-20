#!/usr/bin/env python3
"""Independent bounded 31x27 route-leg witness; no snapping or hull exemptions."""
import collections,json
from pathlib import Path
W,H=2048,1024
root=Path(__file__).resolve().parent
setup=json.loads((root/'setup-parallax-forkbridge-containerworks.json').read_text())
receipt=json.loads((root/'qualification.json').read_text())
grid=bytearray(W*H)
for x,y,w,h,m in setup['edits']:
    for yy in range(y,y+h):grid[yy*W+x:yy*W+x+w]=bytes([m])*w
# 31x27 exact occupancy mask via summed-area table.
p=[0]*((W+1)*(H+1));ww=W+1
for y in range(H):
    acc=0
    for x in range(W):
        acc+=bool(grid[y*W+x]);p[(y+1)*ww+x+1]=p[y*ww+x+1]+acc
free=bytearray(W*H)
for y in range(13,H-13):
    top=(y-13)*ww;bot=(y+14)*ww
    for x in range(15,W-15):
        left=x-15;right=x+16
        if p[bot+right]-p[bot+left]-p[top+right]+p[top+left]==0:free[y*W+x]=1
byname={s['name']:(s['x'],s['y']) for s in receipt['named_sites']}
PRIMARY=['Start | West ignition','Injector coil exit','Shuttle lift approach','Elevator clearance',
'Forkbridge western throat','Upper fork gate','Upper fork clearance','Upper fork exit',
'Cargo gantry arrival','Container loader bypass','Eastern capture entry','East downward turn',
'East return approach','Under cargo berth','Central lower return','Switch return',
'Shuttle underpass','West recovery','Finish | West ignition']
ALT=['Forkbridge western throat','Alternative central ramp','Alternative fork rejoin','Upper fork exit']
ROOMS=['West control platform','Shuttle cable operator','Forkbridge overhead signal',
'Cargo loading attendant','East catcher operator','Pressure service room','Shuttle gearbox service',
'Fork hydraulics service','Cargo filter service','Brake handoff service']

def traverse(a,b,margin,occupancy=None):
    area=occupancy if occupancy is not None else free
    x1,y1=byname[a];x2,y2=byname[b]
    lo=max(15,min(x1,x2)-margin);hi=min(W-16,max(x1,x2)+margin)
    top=max(13,min(y1,y2)-margin);bot=min(H-14,max(y1,y2)+margin)
    start=y1*W+x1;goal=y2*W+x2
    assert area[start] and area[goal],(a,b)
    q=collections.deque([start]);vis=bytearray(W*H);vis[start]=1;dist={start:0}
    while q:
        idx=q.popleft()
        if idx==goal:return dist[idx]
        y,x=divmod(idx,W)
        for k,nx,ny in ((idx-1,x-1,y),(idx+1,x+1,y),(idx-W,x,y-1),(idx+W,x,y+1)):
            if lo<=nx<=hi and top<=ny<=bot and area[k] and not vis[k]:
                vis[k]=1;dist[k]=dist[idx]+1;q.append(k)
    return None
receipt2={'clearance':'31x27','exact_site_checks':{},'primary':[], 'alternate':[], 'service_access':[]}
for kind,arr in [('primary',PRIMARY),('alternate',ALT)]:
    for a,b in zip(arr,arr[1:]):
        results={}
        for margin in (80,120,180,260):
            found=traverse(a,b,margin)
            if found is not None:results={'from':a,'to':b,'length':found,'local_margin':margin};break
        if not results:results={'from':a,'to':b,'length':None,'local_margin':None}
        receipt2[kind].append(results)
# Each service site should be approachable from the main course with a bounded local connection.
for site in ROOMS:
    options=[]
    for base in PRIMARY:
        if base==site:continue
        a=byname[base];b=byname[site]
        metric=abs(a[0]-b[0])+abs(a[1]-b[1])
        if metric>500:continue
        dist=traverse(base,site,170)
        if dist is not None:options.append({'from':base,'to':site,'length':dist,'local_margin':170})
    receipt2['service_access'].append({'site':site,'best':sorted(options,key=lambda v:v['length'])[0] if options else None})
# Literal hard wall obstruction, dilated by the full 31x27 hull footprint.
obx,oby,obw,obh=receipt['obstruction']['xywh']
obfree=bytearray(free)
for yy in range(max(13,oby-13),min(H-13,oby+obh+13)):
    for xx in range(max(15,obx-15),min(W-15,obx+obw+15)):
        obfree[yy*W+xx]=0
receipt2['blocked_alternate'] = []
for a,b in zip(ALT,ALT[1:]):
    dist=traverse(a,b,110,obfree)
    receipt2['blocked_alternate'].append({'from':a,'to':b,'length':dist,'margin':110})
receipt2['blocked_return'] = []
for a,b in zip(PRIMARY[7:],PRIMARY[8:]):
    dist=traverse(a,b,110,obfree)
    receipt2['blocked_return'].append({'from':a,'to':b,'length':dist,'margin':110})
(root/'local-route-qualification.json').write_text(json.dumps(receipt2,indent=2)+'\n')
failed=[x for k in ('primary','alternate') for x in receipt2[k] if x['length'] is None]
noaccess=[x['site'] for x in receipt2['service_access'] if x['best'] is None]
print('PRIMARY',len(receipt2['primary']), 'ALTERNATE',len(receipt2['alternate']), 'SERVICE',len(receipt2['service_access']))
print('FAILED',failed)
print('NO_ACCESS',noaccess)
for x in receipt2['primary']+receipt2['alternate']:
    print(x['from'],'->',x['to'], 'dist',x['length'],'margin',x['local_margin'])
if failed or noaccess or any(x['length'] is None for x in receipt2['blocked_alternate']+receipt2['blocked_return']):raise SystemExit(1)
