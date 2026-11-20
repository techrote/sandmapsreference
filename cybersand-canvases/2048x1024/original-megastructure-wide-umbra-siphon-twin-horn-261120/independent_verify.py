#!/usr/bin/env python3
"""Standalone independent source-grid/PNG/route qualification, read-only on committed outputs.
Run: python independent_verify.py. Does not import the authoring builder.
Requires Python, numpy, scipy, Pillow (Pillow only used for exact pixel parity).
"""
import hashlib,json,zlib,struct,collections
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import label, generate_binary_structure
P=Path(__file__).resolve().parent
payload=(P/'setup-umbra-siphon.json').read_bytes();j=json.loads(payload)
r=json.loads((P/'receipt.json').read_text())
W,H=j['extent'];assert (W,H)==(2048,1024)
assert j['version']==2 and j['actors'][0]['model']=='midge' and len(j['actors'])==1
assert j['actors'][0]['spawn']==[147,460]
assert set(j)=={'version','extent','actors','next_id','selected','edits','response','liquid_policy','normalize','rule_radius','source','material','brush','fire'}
assert len(payload)==r['json_utf8_bytes'] and hashlib.sha256(payload).hexdigest()==r['setup_sha256']
a=np.zeros((H,W),dtype=np.uint8);used=np.zeros((H,W),dtype=np.bool_)
for idx,v in enumerate(j['edits']):
 assert len(v)==5,(idx,v)
 x,y,w,h,m=v;assert all(type(k)==int for k in v)
 assert 0<=x<W and 0<=y<H and w>0 and h>0 and x+w<=W and y+h<=H and 0<m<=131
 assert not used[y:y+h,x:x+w].any(),(idx,'overlap')
 a[y:y+h,x:x+w]=m;used[y:y+h,x:x+w]=1
assert len(j['edits'])==r['rectangles'] and int(used.sum())==r['painted_work']
assert hashlib.sha256(a.tobytes()).hexdigest()==r['grid_sha256']
counts={str(int(i)):int(v) for i,v in zip(*np.unique(a,return_counts=True))}
assert counts==r['histogram'] and sum(counts.values())==2097152
# All occupied IDs (compiled, accepted definition at recorded material blob SHA)
stable={58,62,63,64,65,66,68,69,70,71,72,74,75,76,77,78,79,80,98,100,101,111,113,114,119,120,121,128,130,131}
assert set(int(k) for k in counts if int(k)!=0).issubset(stable)
shape=generate_binary_structure(2,1)
c,n=label(a!=0,structure=shape)
roots=set(np.unique(np.r_[c[0,:],c[-1,:],c[:,0],c[:,-1]]))-{0}
assert set(np.unique(c))-{0}==roots, ('floating material components', n)
S=r['exact_sites'];assert len(S)>=16
assert j['actors'][0]['spawn']==S['Lantern Gate arrival']
# Exact full-hull four-connected legal-centre component, never snap a blocked site.
def verify_sites(mat, names):
 v=[]
 occupied=(mat!=0).astype(np.int32)
 integral=np.pad(occupied,((1,0),(1,0))).cumsum(0).cumsum(1)
 for w,h in [(19,15),(23,19),(31,27)]:
  hx=w//2;hy=h//2
  slots=np.zeros_like(mat,dtype=np.bool_)
  summed=integral[h:,w:]-integral[:-h,w:]-integral[h:,:-w]+integral[:-h,:-w]
  slots[hy:H-hy,hx:W-hx]=(summed==0)
  assert slots[460,147],('invalid Midge centre',w,h)
  components,num=label(slots,structure=shape)
  target_component=components[460,147]
  for name in names:
   x,y=S[name];assert 0<=x<W and 0<=y<H
   assert slots[y,x] and components[y,x]==target_component,(name,w,h)
  v.append({'envelope':[w,h],'sites':len(names),'reachable_centres':int(np.count_nonzero(components==target_component))})
 return v
regular=verify_sites(a,list(S))
modified=a.copy();x0,y0,x1,y1=r['alternate_route']['sealed_half_open_box'];modified[y0:y1,x0:x1]=58
other=[v for v in S if v!=r['alternate_route']['excluded_site']]
blocked=verify_sites(modified,other)
assert all(x['sites']==16 for x in regular) and all(x['sites']==15 for x in blocked)
# Distinct zero-copy PNG IDAT correctness + independent actual full-cell parity.
images=[]
for item in r['images']:
 name=item['name'];x,y,w,h=item['rect'];p=P/(name+'.png');src=p.read_bytes()
 assert hashlib.sha256(src).hexdigest()==item['sha256'] and len(src)==item['bytes']
 assert src[:8]==b'\x89PNG\r\n\x1a\n'
 pos=8; chunks=[];idat=bytearray();shape_px=None
 while pos<len(src):
  assert pos+12<=len(src)
  length=struct.unpack('>I',src[pos:pos+4])[0]
  kind=src[pos+4:pos+8];data=src[pos+8:pos+8+length]
  assert len(data)==length
  crc=struct.unpack('>I',src[pos+8+length:pos+12+length])[0]
  assert zlib.crc32(kind+data)&0xffffffff==crc
  chunks.append(kind)
  if kind==b'IDAT':idat.extend(data)
  if kind==b'IHDR':shape_px=struct.unpack('>II',data[:8])
  pos+=12+length
 assert pos==len(src) and chunks[-1]==b'IEND' and chunks.count(b'IEND')==1
 assert shape_px==(w,h) and zlib.decompress(idat)
 im=Image.open(p);im.load();assert im.mode=='P' and im.size==(w,h)
 actual=np.array(im);expect=a[y:y+h,x:x+w]
 assert np.array_equal(actual,expect),(name,'pixel parity')
 images.append({'name':name,'pixels':w*h,'crc_zlib_iend':'PASS','material_pixel_parity':'PASS'})
summary={'status':'STATIC-PASS','authoring_source_SHA':r['engine_sha'],
 'setup_sha256':r['setup_sha256'],'grid_sha256':r['grid_sha256'],
 'actual_material_cells':W*H,'painted_stable_material_cells':int((a!=0).sum()),
 'nonoverlapping_rectangles':len(j['edits']),'setup_bytes':len(payload),
 'boundary_connected_solid_components':len(roots),'detached_solids':0,
 'named_site_tests':regular,'real_obstruction_alternative':blocked,'png_evidence':images,
 'native_Godot_CyberDemoBridge_Rapier':'NATIVE-UNTESTED',
 'installed_bridge_capacity':'UNVERIFIED (may default 4096; this map exceeds fallback)'}
(P/'independent_verification.json').write_text(json.dumps(summary,indent=2)+'\n')
print(json.dumps(summary,indent=2))
