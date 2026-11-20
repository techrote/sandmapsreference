#!/usr/bin/env python3
"""Independent-from-builder validator for Duskline Diaphragm Station: only reads committed Setup/PNG/receipt."""
from pathlib import Path
import json,hashlib,zlib,struct,collections,array,sys,time
ROOT=Path(__file__).resolve().parent
W,H=2048,1024
INERT={58,62,100,101,113,117,122}
ROOT_KEYS={'version','extent','actors','next_id','selected','edits','response','liquid_policy','normalize','rule_radius','source','material','brush','fire'}
MODEL_HASH='c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96'

def load():
    blob=(ROOT/'setup-duskline-diaphragm-station.json').read_bytes()
    setup=json.loads(blob)
    receipt=json.loads((ROOT/'qualification.json').read_text())
    assert set(setup)==ROOT_KEYS and setup['version']==2 and setup['extent']==[W,H]
    assert len(blob)==receipt['setup_bytes'] and hashlib.sha256(blob).hexdigest()==receipt['setup_sha256']
    assert setup['response']=='LA-SELECTIVE' and setup['rule_radius']==2
    assert setup['normalize'] is False and setup['fire'] is False
    assert setup['next_id']==2 and setup['selected']==1 and setup['material']==2 and setup['brush']==8
    assert len(setup['liquid_policy'])==55 and all(isinstance(n,int) and -(1<<31)<=n<1<<31 for n in setup['liquid_policy'])
    assert len(setup['actors'])==1 and setup['actors'][0]['model']=='midge'
    assert setup['actors'][0]['hash']==MODEL_HASH
    assert setup['actors'][0]['spawn']==receipt['sites']['Start / west ignition']
    assert len(setup['edits'])<=32768 and len(blob)<=1048576
    grid=bytearray(W*H)
    work=0; overlaps=0
    for e in setup['edits']:
        assert len(e)==5
        x,y,w,h,mat=e
        assert all(isinstance(v,int) for v in e) and mat in INERT
        assert 0<=x<x+w<=W and 0<=y<y+h<=H
        work+=w*h
        for yy in range(y,y+h):
            off=yy*W+x
            overlaps+=sum(t!=0 for t in grid[off:off+w])
            grid[off:off+w]=bytes([mat])*w
    assert work==receipt['construction_work_cells'] and work<=32000000
    assert len(setup['edits'])==receipt['rectangle_count'] and not overlaps and receipt['overlaps']==0
    assert hashlib.sha256(grid).hexdigest()==receipt['grid_sha256']
    assert {str(mid):grid.count(mid) for mid in sorted(set(grid))}==receipt['histogram']
    assert not (set(grid)-({0}|INERT))
    print('REPLAY PASS',len(grid),'rect',len(setup['edits']),'bytes',len(blob),'work',work)
    return grid,receipt

def png_check(grid,receipt):
    for name,details in receipt['pngs'].items():
        b=(ROOT/name).read_bytes()
        assert hashlib.sha256(b).hexdigest()==details['sha256'] and b.startswith(b'\x89PNG\r\n\x1a\n')
        offset=8;idata=bytearray();w=h=None;palette=None
        while offset<len(b):
            n=struct.unpack_from('>I',b,offset)[0];tag=b[offset+4:offset+8];data=b[offset+8:offset+8+n];crc=struct.unpack_from('>I',b,offset+8+n)[0]
            assert zlib.crc32(tag+data)&0xffffffff==crc
            if tag==b'IHDR':
                w,h,depth,mode,comp,fil,inter=struct.unpack('>IIBBBBB',data)
                assert (depth,mode,comp,fil,inter)==(8,3,0,0,0)
            if tag==b'PLTE':palette=data
            if tag==b'IDAT':idata.extend(data)
            offset+=12+n
            if tag==b'IEND':break
        assert palette is not None and w==details['width'] and h==details['height']
        raw=zlib.decompress(idata)
        assert len(raw)==(w+1)*h
        x,y,cw,ch=details['source_box']
        assert (cw,ch)==(w,h)
        for yy in range(h):
            off=yy*(w+1)
            assert raw[off]==0
            assert raw[off+1:off+1+w]==grid[(y+yy)*W+x:(y+yy)*W+x+w]
        print('PNG PARITY',name,f'{w}x{h}',w*h)

def grounding(grid):
    visited=bytearray(W*H);q=collections.deque()
    for x in range(W):
        for y in (0,H-1):
            i=y*W+x
            if grid[i] and not visited[i]:visited[i]=1;q.append(i)
    for y in range(H):
        for x in (0,W-1):
            i=y*W+x
            if grid[i] and not visited[i]:visited[i]=1;q.append(i)
    ct=0
    while q:
        i=q.popleft();ct+=1;x=i%W
        for j in (i-W if i>=W else -1,i+W if i<W*(H-1) else -1,i-1 if x else -1,i+1 if x<W-1 else -1):
            if j>=0 and grid[j] and not visited[j]:visited[j]=1;q.append(j)
    assert ct==len(grid)-grid.count(0)
    print('GROUNDING PASS',ct,'of',ct,'inert solids')

def free_centres(grid,ew,eh):
    # Exhaustive exact rectangular hull, all native material cells block the whole envelope.
    iw=W+1
    prefix=array.array('I',[0])*((W+1)*(H+1))
    for y in range(H):
        row=0;base=y*W;p=(y+1)*iw;prev=y*iw
        for x in range(W):
            row+=(grid[base+x]!=0)
            prefix[p+x+1]=prefix[prev+x+1]+row
    out=bytearray(W*H)
    lx=(ew-1)//2;rx=ew//2;ty=(eh-1)//2;by=eh//2
    for y in range(ty,H-by):
        top=(y-ty)*iw;bot=(y+by+1)*iw;offset=y*W
        for x in range(lx,W-rx):
            left=x-lx;right=x+rx+1
            if prefix[bot+right]-prefix[top+right]-prefix[bot+left]+prefix[top+left]==0:out[offset+x]=1
    return out

def flood(free,start):
    visited=bytearray(len(free));idx=start[1]*W+start[0]
    assert free[idx],f'Spawn not free under literal envelope: {start}'
    visited[idx]=1;queue=collections.deque([idx]);count=0
    while queue:
        i=queue.popleft();count+=1;x=i%W
        for j in (i-W if i>=W else -1,i+W if i<W*(H-1) else -1,i-1 if x else -1,i+1 if x<W-1 else -1):
            if j>=0 and free[j] and not visited[j]:visited[j]=1;queue.append(j)
    return visited,count

def obstruct(grid,xywh):
    result=bytearray(grid)
    x,y,w,h=xywh
    for yy in range(y,y+h):result[yy*W+x:yy*W+x+w]=bytes([58])*w
    return result

def routes(grid,receipt):
    sites=receipt['sites'];start=sites['Start / west ignition']
    counts={}
    for ew,eh in [(19,15),(23,19),(31,27)]:
        free=free_centres(grid,ew,eh)
        vis,total=flood(free,start)
        unreachable=[];not_free=[]
        for name,(x,y) in sites.items():
            assert x-ew//2>=0 and y-eh//2>=0 and x+ew//2<W and y+eh//2<H
            if not free[y*W+x]:not_free.append(name)
            elif not vis[y*W+x]:unreachable.append(name)
        print('EXACT HULL',ew,eh,'reachable',len(sites)-len(unreachable)-len(not_free),'/',len(sites),'free-centres',total,'not_free',not_free,'unreachable',unreachable)
        assert not not_free and not unreachable
        counts[f'{ew}x{eh}']={'reachable':len(sites),'connected_free_centres':total}
    blocked=obstruct(grid,receipt['obstruction_xywh'])
    free=free_centres(blocked,31,27);vis,total=flood(free,start)
    absent=[]
    for name,(x,y) in sites.items():
        if not free[y*W+x] or not vis[y*W+x]:absent.append(name)
    print('OBSTRUCTION 31x27',len(sites)-len(absent),'/',len(sites),'unreachable',absent,'free-centres',total)
    assert absent==['Upper transfer datum']
    for key in ['Finish','Lower bypass datum','Lower bypass exit','East capture','East return','West service return']:
        x,y=sites[key];assert vis[y*W+x]
    return counts,absent

def main():
    g,r=load();png_check(g,r);grounding(g);counts,absent=routes(g,r)
    proof={'schema':'duskline-independent-source-static-v1','exact_grid_sha256':r['grid_sha256'],
           'clearance':counts,'blocked_31x27':{'reachable':len(r['sites'])-len(absent),'unreachable_literal_sites':absent,
           'finish_reachable':True,'lower_bypass_reachable':True},'png_pixel_parity':sum(z['pixel_count'] for z in r['pngs'].values()),
           'native':'NATIVE-UNTESTED'}
    (ROOT/'independent-verification.json').write_text(json.dumps(proof,indent=2)+'\n')
    print('ALL SOURCE-STATIC CHECKS PASS')
if __name__=='__main__':main()
