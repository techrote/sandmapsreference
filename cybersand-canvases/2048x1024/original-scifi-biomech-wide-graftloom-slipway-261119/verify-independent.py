"""Independent from-builder replay, physical topology, clearance and RGB PNG audit.
Input is the *committed* Setup-v2 JSON; intentionally does not import build.py.
Python 3 standard library. This is static verification, NOT a native Workbench pass.
"""
from __future__ import annotations
import array
import collections
import hashlib
import json
import os
from pathlib import Path
import struct
import sys
import zlib

ROOT = Path(__file__).resolve().parent
W, H = 2048, 1024
N = W * H
# Exact accepted catalogue current-shadow RGBs (native material header/cache 19 Nov 2026).
PALETTE = {0:(8,11,18),49:(70,83,99),58:(119,123,128),62:(126,141,153),
           100:(54,56,61),101:(24,19,32),113:(152,162,168),117:(90,94,100),
           120:(156,210,220),123:(152,232,94),128:(62,122,180)}
INERT = set(PALETTE) - {0}
CROPS = [('overview.png',0,0,W,H,1),('review-half.png',0,0,W,H,2),
    ('01-receiving-slip.png',0,160,512,650,1),('02-crane-and-entry.png',320,85,470,610,1),
    ('03-memory-engine.png',657,235,510,545,1),('04-refinery-filter.png',1290,255,430,605,1),
    ('05-aft-dock.png',1710,135,330,750,1),('06-lower-return.png',650,705,770,250,1)]
SIZES = [(19,15),(23,19),(31,27)]

def sha(data):
    return hashlib.sha256(data).hexdigest()

def replay(setup):
    assert setup.get('version') == 2 and setup.get('extent') == [W,H]
    assert len(setup.get('edits', [])) <= 32768
    assert len(setup.get('actors', [])) == 1 and setup['actors'][0]['model'] == 'midge'
    assert setup['actors'][0]['spawn'] == [122,483]
    a = bytearray(N)
    covered = bytearray(N)
    work = 0
    for k, rect in enumerate(setup['edits']):
        assert isinstance(rect,list) and len(rect) == 5, ('bad rectangle', k)
        x,y,w,h,m = rect
        assert all(type(i) is int for i in rect) and m in INERT and w>0 and h>0
        assert 0<=x<x+w<=W and 0<=y<y+h<=H
        mask = b'\x01'*w
        mat = bytes([m])*w
        for yy in range(y,y+h):
            o=yy*W+x
            assert not any(covered[o:o+w]), ('rectangle overlap', k, x, yy)
            covered[o:o+w]=mask
            a[o:o+w]=mat
        work += w*h
    assert a == covered or all(bool(v) == bool(covered[i]) for i,v in enumerate(a))
    return a,work

def png_check(filepath, a, x, y, w, h, step):
    b=filepath.read_bytes()
    assert b[:8]==b'\x89PNG\r\n\x1a\n'
    p=8
    idat=bytearray()
    dims=None
    seen_end=False
    while p<len(b):
        assert p+12<=len(b)
        n=struct.unpack_from('>I',b,p)[0]
        typ=b[p+4:p+8]
        assert p+12+n<=len(b)
        dat=b[p+8:p+8+n]
        c=struct.unpack_from('>I',b,p+8+n)[0]
        assert zlib.crc32(typ+dat)&0xffffffff==c
        if typ==b'IHDR':
            dims=struct.unpack('>IIBBBBB',dat)
        if typ==b'IDAT':
            idat.extend(dat)
        p+=12+n
        if typ==b'IEND':
            assert n==0 and p==len(b)
            seen_end=True
            break
    ow=(w+step-1)//step
    oh=(h+step-1)//step
    assert seen_end and dims==(ow,oh,8,2,0,0,0)
    raw=zlib.decompress(bytes(idat))
    assert len(raw)==oh*(1+3*ow)
    index=0
    for yy in range(y,y+h,step):
        assert raw[index]==0
        index+=1
        for xx in range(x,x+w,step):
            assert tuple(raw[index:index+3])==PALETTE[a[yy*W+xx]], ('wrong material pixel',filepath,xx,yy)
            index+=3
    assert index==len(raw)
    return {'name':filepath.name,'pixels':[ow,oh],'sha256':sha(b),'crc_chunks_and_exact_pixel_parity':'PASS'}

def legal_plane(a,fw,fh):
    integ=array.array('I',[0])*((W+1)*(H+1))
    stride=W+1
    for y in range(H):
        cumulative=0
        src=y*W
        up=y*stride
        dst=(y+1)*stride
        for x in range(W):
            cumulative+=(a[src+x]!=0)
            integ[dst+x+1]=integ[up+x+1]+cumulative
    ok=bytearray(N)
    hw=fw//2
    hh=fh//2
    for y in range(hh,H-hh):
        ya=(y-hh)*stride
        yb=(y+hh+1)*stride
        o=y*W
        for x in range(hw,W-hw):
            xa=x-hw
            xb=x+hw+1
            n=integ[yb+xb]-integ[ya+xb]-integ[yb+xa]+integ[ya+xa]
            if n==0:
                ok[o+x]=1
    return ok

def flood(legal,source,banned=None):
    x,y=source
    i=y*W+x
    assert legal[i], ('blocked exact coordinate',source)
    q=collections.deque([i])
    seen=bytearray(N)
    seen[i]=1
    count=1
    while q:
        v=q.popleft()
        x=v%W
        y=v//W
        for u in ((v-1 if x else -1),(v+1 if x<W-1 else -1),(v-W if y else -1),(v+W if y<H-1 else -1)):
            if u>=0 and legal[u] and not seen[u]:
                if banned is not None and banned(u%W,u//W):
                    continue
                seen[u]=1
                q.append(u)
                count+=1
    return seen,count

def grounding(a):
    seen=bytearray(N)
    detached=[]
    grounded=0
    count=0
    for root,mat in enumerate(a):
        if not mat or seen[root]:
            continue
        count+=1
        seen[root]=1
        queue=collections.deque([root])
        size=0
        boundary=False
        minx=W
        maxx=0
        miny=H
        maxy=0
        while queue:
            v=queue.popleft()
            x=v%W
            y=v//W
            size+=1
            boundary=boundary or x in (0,W-1) or y in (0,H-1)
            minx=min(x,minx)
            maxx=max(x,maxx)
            miny=min(y,miny)
            maxy=max(y,maxy)
            for u in ((v-1 if x else -1),(v+1 if x<W-1 else -1),(v-W if y else -1),(v+W if y<H-1 else -1)):
                if u>=0 and a[u] and not seen[u]:
                    seen[u]=1
                    queue.append(u)
        if boundary:
            grounded+=size
        else:
            detached.append({'cells':size,'bbox':[minx,miny,maxx,maxy]})
    return {'components':count,'boundary_grounded_cells':grounded,'detached_cells':sum(d['cells'] for d in detached),'detached_components':len(detached),'largest_detached_components':sorted(detached,key=lambda d:-d['cells'])[:15]}

def main():
    b=(ROOT/'setup-graftloom-slipway.json').read_bytes()
    q=json.loads((ROOT/'qualification.json').read_text())
    s=json.loads(b)
    assert len(b)<=1048576 and set(s)=={'version','extent','actors','next_id','selected','edits','response','liquid_policy','normalize','rule_radius','source','material','brush','fire'}
    a,work=replay(s)
    assert sha(a)==q['grid_sha256']
    assert sha(b)==q['setup_sha256']
    assert len(a)==N and work==q['painted_cells']
    assert {str(k):a.count(k) for k in PALETTE if a.count(k)}==q['histogram']
    assert len(s['edits'])==q['rectangles']
    imgs=[png_check(ROOT/name,a,x,y,w,h,step) for name,x,y,w,h,step in CROPS]
    sites={k:tuple(v) for k,v in q['site_coordinates'].items()}
    assert sites['spawn_receiving_dock']==(122,483)
    flight={}
    alternate={}
    for fw,fh in SIZES:
        legal=legal_plane(a,fw,fh)
        seen,total=flood(legal,sites['spawn_receiving_dock'])
        counts={}
        for name,(x,y) in sites.items():
            i=y*W+x
            assert legal[i] and seen[i], ('exact site collision or disconnected',fw,fh,name)
            count=sum(bool(legal[(y+dy)*W+x+dx] and seen[(y+dy)*W+x+dx]) for dx,dy in [(1,0),(-1,0),(0,1),(0,-1)])
            assert count>=3, ('site local approaches',fw,fh,name,count)
            counts[name]=count
        flight[f'{fw}x{fh}']={'exact_sites':len(counts),'connected_legal_centres':total,'minimum_approaches':min(counts.values())}
        if fw==31:
            for label,ban in [('upper_via_roof',lambda x,y:650<=x<=1200 and y>=390),('lower_via_sump',lambda x,y:650<=x<=1200 and y<=650)]:
                visited,count=flood(legal,sites['spinal_gate_west'],ban)
                end=sites['spinal_gate_east']
                assert visited[end[1]*W+end[0]], ('alternate flight path failed',label)
                alternate[label]=count
    structure=grounding(a)
    assert structure['detached_cells']==0, ('unanchored structural solids', structure)
    report={'independent':True,'source':'Setup-v2 ordered rectangles, not builder memory',
        'native_status':'NATIVE-UNTESTED','extent':[W,H],'material_plane_sha256':sha(a),
        'setup_bytes':len(b),'setup_sha256':sha(b),'rectangles':len(s['edits']),
        'occupied_cells':work,'png_proofs':imgs,'clearance':flight,'alternate_route_connected_centres':alternate,
        'structural_topology':structure,
        'builder_sha256':sha((ROOT/'build.py').read_bytes())}
    (ROOT/'verification-independent.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps({'result':'PASS static replay, dimensions, PNG CRC/pixel parity, clearance and alternate routes',
      'topology':report['structural_topology'],'rectangles':report['rectangles']},indent=2))
    return 0
if __name__=='__main__':
    sys.exit(main())
