#!/usr/bin/env python3
"""Independent exact-source verifier. Does not call or import build.py.
Usage: python independent_verify.py. PIL, numpy and scipy are used for decoding and labeling;
rectangle reconstruction, PNG CRCs, and all-body integral clearance are independent of creator.
"""
import json,hashlib,zlib,struct
from pathlib import Path
from collections import Counter, deque
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
P=Path(__file__).parent;W=2048;H=1024
source=(P/'setup.json').read_bytes();s=json.loads(source);rec=json.loads((P/'receipt.json').read_text())
assert set(s)=={'version','extent','actors','next_id','selected','edits','response','liquid_policy','normalize','rule_radius','source','material','brush','fire'}
assert s['version']==2 and s['extent']==[W,H] and len(s['liquid_policy'])==55
assert s['actors'][0]['model']=='midge' and s['actors'][0]['spawn']==rec['spawn']
assert len(source)<=1048576 and len(s['edits'])<=32768
assert hashlib.sha256(source).hexdigest()==rec['setup_sha256']
allowed={0,58,62,63,64,65,66,68,69,70,72,74,75,76,77,78,79,80,98,100,101,111,114,119,120,130,131}
g=np.zeros((H,W),dtype=np.uint8);claimed=np.zeros((H,W),dtype=bool)
for row in s['edits']:
    assert isinstance(row,list) and len(row)==5
    x,y,w,h,mat=row
    assert all(isinstance(v,int) and not isinstance(v,bool) for v in row)
    assert mat in allowed-{0} and 0<=x<W and 0<=y<H and w>0 and h>0 and x+w<=W and y+h<=H
    assert not np.any(claimed[y:y+h,x:x+w]),f'overlap: {row}'
    claimed[y:y+h,x:x+w]=True
    g[y:y+h,x:x+w]=mat
assert int(np.count_nonzero(g))==rec['construction_work_cells']
assert hashlib.sha256(g.tobytes()).hexdigest()==rec['grid_sha256']
assert {str(int(x)):int(n) for x,n in zip(*np.unique(g,return_counts=True))}==rec['histogram']
# Independent rooted-solids proof by four-neighbour connected-component identity.
labels,n=ndi.label(g!=0,structure=np.array([[0,1,0],[1,1,1],[0,1,0]],dtype=bool))
outer=np.unique(np.concatenate([labels[0],labels[-1],labels[:,0],labels[:,-1]]))
assert np.all(np.isin(labels[g!=0],outer[outer>0]))

def grounded_flight(data):
    # Independently use a true summed-area-table of occupied material cells (not scipy morphology).
    occ=(data!=0).astype(np.int64)
    integral=np.pad(occ,((1,0),(1,0))).cumsum(axis=0).cumsum(axis=1)
    results=[]
    for w,h in [(19,15),(23,19),(31,27)]:
        tl=integral[h:,w:]-integral[:-h,w:]-integral[h:,:-w]+integral[:-h,:-w]
        assert tl.shape==(H-h+1,W-w+1)
        legal=np.zeros((H,W),dtype=np.uint8)
        hx=w//2;hy=h//2
        legal[hy:H-hy,hx:W-hx]=(tl==0)
        sx,sy=rec['spawn'];assert legal[sy,sx] == 1
        # Independent explicit 4-neighbour BFS (never nearest-site or radius exemption).
        buf=memoryview(legal).cast('B');visited=bytearray(W*H)
        start=sy*W+sx;q=deque([start]);visited[start]=1;count=0
        while q:
            at=q.popleft();count+=1;x=at%W
            if x>0:
                nb=at-1
                if buf[nb] and not visited[nb]:visited[nb]=1;q.append(nb)
            if x<W-1:
                nb=at+1
                if buf[nb] and not visited[nb]:visited[nb]=1;q.append(nb)
            if at>=W:
                nb=at-W
                if buf[nb] and not visited[nb]:visited[nb]=1;q.append(nb)
            if at<W*(H-1):
                nb=at+W
                if buf[nb] and not visited[nb]:visited[nb]=1;q.append(nb)
        missing=[name for name,(x,y) in rec['sites'].items() if not visited[y*W+x]]
        results.append({'hull':[w,h],'reachable':len(rec['sites'])-len(missing),'total':len(rec['sites']),'missing':missing,'component_centres':count})
    return results
assert grounded_flight(g)==rec['clearances']
ob=g.copy();x,y,w,h=rec['physical_obstruction_xywh'];ob[y:y+h,x:x+w]=58
assert grounded_flight(ob)==rec['obstructed_routes']

def check_png(filename,region):
    raw=(P/filename).read_bytes()
    assert raw[:8]==b'\x89PNG\r\n\x1a\n'
    pos=8;finished=False;chunks=[]
    while pos<len(raw):
        assert pos+12<=len(raw)
        n=struct.unpack('>I',raw[pos:pos+4])[0];chunk=raw[pos+4:pos+8];data=raw[pos+8:pos+8+n]
        assert len(data)==n and pos+12+n<=len(raw)
        crc=struct.unpack('>I',raw[pos+8+n:pos+12+n])[0]
        assert crc==(zlib.crc32(chunk+data)&0xffffffff)
        chunks.append(chunk.decode('ascii'))
        pos+=12+n
        if chunk==b'IEND':assert not finished and n==0 and pos==len(raw);finished=True;break
    assert finished and chunks[0]=='IHDR' and 'IDAT' in chunks
    im=Image.open(P/filename);assert im.mode=='P'
    im.load()
    x0,y0,x1,y1=region
    assert im.size==(x1-x0,y1-y0)
    assert np.array_equal(np.asarray(im),g[y0:y1,x0:x1])
    assert hashlib.sha256(raw).hexdigest()==rec['file_sha256'][filename]
    return {'file':filename,'indexed_pixels':int((x1-x0)*(y1-y0)),'sha256':hashlib.sha256(raw).hexdigest(),'png_crc':True,'grid_parity':True}
images=[check_png('overview.png',[0,0,W,H])]
for name,region in rec['gallery_crops_xyxy'].items():images.append(check_png(name,region))
result={'result':'STATIC-RECONSTRUCTION-PASS','native':'NATIVE-UNTESTED','engine_ref':rec['source_contract']['engine_main_sha'],
'grid_sha256':rec['grid_sha256'],'setup_sha256':rec['setup_sha256'],'rectangles':len(s['edits']),
'full_grid_cells':W*H,'solid_cells':int(np.count_nonzero(g)),'full_hull_routes':rec['clearances'],'obstruction_routes':rec['obstructed_routes'],
'pngs':images,'png_pixels_verified':sum(x['indexed_pixels'] for x in images)}
(P/'independent_verification.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({'result':result['result'],'rectangles':len(s['edits']),'sites':rec['clearances'],'blocked':rec['obstructed_routes'],'png_count':len(images),'pixels':result['png_pixels_verified']}))
