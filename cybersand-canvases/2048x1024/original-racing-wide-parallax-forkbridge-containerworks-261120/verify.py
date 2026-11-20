#!/usr/bin/env python3
"""Independent source-static auditor: reads committed Setup, receipts and PNGs; does NOT import build.py."""
import os,struct,json,hashlib,zlib,collections
from pathlib import Path
W,H=2048,1024
DIR=Path(__file__).resolve().parent
setup_bytes=(DIR/'setup-parallax-forkbridge-containerworks.json').read_bytes()
s=json.loads(setup_bytes);q=json.loads((DIR/'qualification.json').read_text())
assert set(s)=={'version','extent','actors','next_id','selected','edits','response','liquid_policy','normalize','rule_radius','source','material','brush','fire'}
assert s['version']==2 and s['extent']==[W,H] and s['actors'][0]['model']=='midge'
assert s['actors'][0]['hash']=='c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96'
assert len(s['liquid_policy'])==55
assert len(setup_bytes)==q['setup_bytes'] and len(setup_bytes)<=1048576
assert hashlib.sha256(setup_bytes).hexdigest()==q['setup_sha256']
assert len(s['edits'])==q['rectangles'] and len(s['edits'])<=32768
# Reconstruct exact 2M cells from ordered five-tuple rectangles, refusing overlaps.
g=bytearray(W*H);seen=bytearray(W*H);visits=0
for e in s['edits']:
    assert len(e)==5 and all(type(i) is int for i in e)
    x,y,w,h,m=e
    assert 0<=x<W and 0<=y<H and w>0 and h>0 and x+w<=W and y+h<=H
    assert m in (49,58,62,100,101,113,117,122)
    for yy in range(y,y+h):
        p=yy*W+x; e=p+w
        assert 1 not in seen[p:e], 'overlapping material edits'
        seen[p:e]=b'\x01'*w;g[p:e]=bytes([m])*w
    visits+=w*h
assert visits==q['work_visits'] and visits<=32000000
assert hashlib.sha256(g).hexdigest()==q['grid_sha256']
hist={str(k):v for k,v in sorted(collections.Counter(g).items())}
assert hist=={str(k):v for k,v in q['histogram'].items()}

# Independent canonical row-runs: report a mismatch if source rectangles are split or redundant.
prev={}; canonical=[]
for y in range(H):
    nextrow={};x=0
    while x<W:
        m=g[y*W+x]
        if m==0:x+=1;continue
        end=x+1
        while end<W and g[y*W+end]==m:end+=1
        key=(x,end-x,m)
        if key in prev:
            val=prev.pop(key);val[3]+=1
        else:val=[x,y,end-x,1,m]
        nextrow[key]=val;x=end
    canonical.extend(prev.values());prev=nextrow
canonical.extend(prev.values());canonical.sort(key=lambda a:(a[1],a[0],a[4]))
assert canonical==s['edits'],'not canonical maximal row-run / vertical coalescing'

# Verify literal 4-connected boundary grounding, not just total material count.
marked=bytearray(W*H);queue=collections.deque()
for j in range(W):
    for i in (j,(H-1)*W+j):
        if g[i] and not marked[i]:marked[i]=1;queue.append(i)
for y in range(H):
    for i in (y*W,y*W+W-1):
        if g[i] and not marked[i]:marked[i]=1;queue.append(i)
while queue:
    i=queue.popleft(); x=i%W; yy=i//W
    for j,okay in ((i-1,x>0),(i+1,x<W-1),(i-W,yy>0),(i+W,yy<H-1)):
        if okay and g[j] and not marked[j]:marked[j]=1;queue.append(j)
assert sum(marked)==visits,'unsupported detached physical cells'

# PNG: parse chunk CRC, indexed PLTE, RFC1950 zlib, unfiltered bytes and parity.
def decode_png(filename,record):
    b=(DIR/filename).read_bytes()
    assert hashlib.sha256(b).hexdigest()==record['sha256'] and len(b)==record['bytes']
    assert b[:8]==b'\x89PNG\r\n\x1a\n'
    p=8;idat=bytearray();width=height=None;plte=0;close=False
    while p<len(b):
        n=struct.unpack_from('>I',b,p)[0];p+=4; typ=b[p:p+4];p+=4
        payload=b[p:p+n];p+=n; crc=struct.unpack_from('>I',b,p)[0];p+=4
        assert (zlib.crc32(typ+payload)&0xffffffff)==crc,'PNG chunk CRC'
        if typ==b'IHDR':
            width,height,depth,color,method,flt,interlace=struct.unpack('>IIBBBBB',payload)
            assert (depth,color,method,flt,interlace)==(8,3,0,0,0)
        elif typ==b'PLTE':plte=len(payload)//3
        elif typ==b'IDAT':idat.extend(payload)
        elif typ==b'IEND':close=True
    assert close and p==len(b) and plte==256
    assert width==record['width'] and height==record['height']
    unpacked=zlib.decompress(idat)
    assert len(unpacked)==height*(width+1)
    x0=record['x'];y0=record['y']; assert 0<=x0 and 0<=y0 and x0+width<=W and y0+height<=H
    for yy in range(height):
        start=yy*(width+1)
        assert unpacked[start]==0,'unanticipated scanline filter'
        assert unpacked[start+1:start+1+width]==g[(yy+y0)*W+x0:(yy+y0)*W+x0+width]
    return width*height
px=0
for filename,record in q['pngs'].items():px+=decode_png(filename,record)

# Distinct implementation of exact full-footprint 4-neighbour free-centre BFS.
# Build blocking map with Cartesian rectangle occupancy at each candidate centre.
def reachable(width,height,block=None):
    halfw=width//2;halfh=height//2
    # Prefix sums of occupied pixels; extra row/column are explicit zeros.
    prefix=[0]*((W+1)*(H+1));pwidth=W+1
    for y in range(H):
        cumulative=0
        for x in range(W):
            occupied=(g[y*W+x]!=0)
            if block is not None:
                ax,ay,bw,bh=block
                occupied|=(ax<=x<ax+bw and ay<=y<ay+bh)
            cumulative+=int(occupied)
            prefix[(y+1)*pwidth+x+1]=prefix[y*pwidth+x+1]+cumulative
    free=bytearray(W*H)
    for y in range(halfh,H-halfh):
        a=(y-halfh)*pwidth;b=(y+halfh+1)*pwidth
        for x in range(halfw,W-halfw):
            left=x-halfw;right=x+halfw+1
            count=prefix[b+right]+prefix[a+left]-prefix[a+right]-prefix[b+left]
            if not count:free[y*W+x]=1
    sx,sy=s['actors'][0]['spawn'];start=sy*W+sx
    assert free[start], 'literal Midge actor spawn is blocked'
    visit=bytearray(W*H);visit[start]=1;todo=collections.deque([start]); total=1
    while todo:
        i=todo.popleft();x=i%W;y=i//W
        if x>0 and free[i-1] and not visit[i-1]:visit[i-1]=1;todo.append(i-1);total+=1
        if x<W-1 and free[i+1] and not visit[i+1]:visit[i+1]=1;todo.append(i+1);total+=1
        if y>0 and free[i-W] and not visit[i-W]:visit[i-W]=1;todo.append(i-W);total+=1
        if y<H-1 and free[i+W] and not visit[i+W]:visit[i+W]=1;todo.append(i+W);total+=1
    missing=[site['name'] for site in q['named_sites'] if not visit[site['y']*W+site['x']]]
    return {'connected':total,'reached':len(q['named_sites'])-len(missing),'missing':missing}, visit
for width,height in ((19,15),(23,19),(31,27)):
    stats,_=reachable(width,height)
    assert stats==q['clearances'][f'{width}x{height}'], f'{width}x{height} source proof changed'
obs,seen_recovery=reachable(31,27,q['obstruction']['xywh'])
assert all(obs[k]==q['obstruction'][k] for k in ('connected','reached','missing'))
assert obs['missing']==['Upper fork gate'] and obs['reached']==len(q['named_sites'])-1
for name in ('Finish | West ignition','Alternative central ramp','Alternative fork rejoin',
             'Eastern capture entry','East downward turn','East return approach','Under cargo berth'):
    site=next(p for p in q['named_sites'] if p['name']==name)
    assert seen_recovery[site['y']*W+site['x']], name

print('INDEPENDENT SOURCE STATIC PASS | cells',len(g),'rectangles',len(s['edits']),'bytes',len(setup_bytes),
      'grounded',visits,'PNG pixels',px,'all envelopes 31/31','obstruction 30/31, alternate+finish yes')
print('GRID_SHA256',hashlib.sha256(g).hexdigest())
