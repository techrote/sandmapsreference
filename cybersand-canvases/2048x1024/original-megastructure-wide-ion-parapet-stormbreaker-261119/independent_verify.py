import json,struct,zlib,hashlib,collections, pathlib
from PIL import Image
import numpy as np
from scipy.ndimage import label
p=pathlib.Path(__file__).parent
raw=(p/'setup-ion-parapet.json').read_bytes(); d=json.loads(raw)
assert d['extent']==[2048,1024] and d['version']==2
assert set(d)==set('version extent actors next_id selected edits response liquid_policy normalize rule_radius source material brush fire'.split())
a=np.zeros((1024,2048),dtype=np.uint8);occupied=np.zeros_like(a,dtype=np.bool_)
work=0
for j,(x,y,w,h,m) in enumerate(d['edits']):
 assert w>0 and h>0 and 0<=x<2048 and 0<=y<1024 and x+w<=2048 and y+h<=1024, j
 assert not occupied[y:y+h,x:x+w].any(),j
 occupied[y:y+h,x:x+w]=True;a[y:y+h,x:x+w]=m;work+=w*h
assert work==int((a!=0).sum()); assert work<32000000 and len(d['edits'])<32768 and len(raw)<1048576
r=json.loads((p/'receipt.json').read_text())
assert hashlib.sha256(a.tobytes()).hexdigest()==r['grid_sha256']
assert hashlib.sha256(raw).hexdigest()==r['setup_sha256']
hist=dict(sorted(((int(i),int(c)) for i,c in zip(*np.unique(a,return_counts=True)))))
assert all(hist.get(int(k),0)==v for k,v in r['histogram'].items())
# 4-neighbour connected components of inert nonempty material; root must touch world boundary/bottom.
structure=a!=0
labels,components=label(structure,structure=np.array([[0,1,0],[1,1,1],[0,1,0]],dtype=np.int8))
root=np.unique(np.r_[labels[-1],labels[:,0],labels[:,-1]])
assert set(np.unique(labels)) - set(root)==set(),f'detached solid components {len(set(np.unique(labels))-set(root))}'
# Independently validate all image chunks and parity, down to every pixel.
palette={0:(8,13,23),58:(104,109,117),62:(122,141,153),63:(43,99,114),64:(92,110,122),65:(138,76,56),66:(82,96,108),68:(112,128,142),69:(175,101,58),70:(209,212,207),72:(33,56,74),74:(54,53,71),75:(205,192,108),76:(230,183,45),77:(65,237,218),78:(236,62,177),79:(250,169,52),80:(236,245,250),100:(56,57,66),101:(27,31,43),111:(191,190,176),114:(179,189,203),119:(203,169,81),120:(147,207,220),130:(35,41,49),131:(41,38,41)}
images=[]
for z in r['images']:
 imgpath=p/(z['name']+'.png');bs=imgpath.read_bytes(); assert bs[:8]==b'\x89PNG\r\n\x1a\n';q=8;parts=[];names=[]
 while q<len(bs):
  assert q+12<=len(bs)
  length=struct.unpack_from('>I',bs,q)[0];tp=bs[q+4:q+8];body=bs[q+8:q+8+length];crc=struct.unpack_from('>I',bs,q+8+length)[0]; assert crc==zlib.crc32(tp+body)&0xffffffff
  names.append(tp)
  if tp==b'IDAT':parts.append(body)
  q+=12+length
 assert q==len(bs) and names[0]==b'IHDR' and names[-1]==b'IEND'
 rawpixels=zlib.decompress(b''.join(parts));x,y,w,h=z['rect']
 assert len(rawpixels)==h*(3*w+1)
 reconstructed=np.frombuffer(rawpixels,dtype=np.uint8).reshape(h,3*w+1)
 assert not reconstructed[:,0].any() # filter 0
 pix=reconstructed[:,1:].reshape(h,w,3)
 expected=a[y:y+h,x:x+w];col=np.zeros((h,w,3),dtype=np.uint8)
 for m,c in palette.items():col[expected==m]=c
 assert np.array_equal(pix,col),(z['name'],'pixel mismatch')
 im=Image.open(imgpath);im.load();assert im.size==(w,h)
 assert hashlib.sha256(bs).hexdigest()==z['sha256']
 images.append(z['name'])
print(json.dumps({'result':'PASS','cells':a.size,'edits':len(d['edits']),'work':work,'bytes':len(raw),'histogram':hist,'material_sha256':r['grid_sha256'],'setup_sha256':r['setup_sha256'],'grounded_components':components,'png_parity':images,'clearances':r['clearances'],'blocked_route':r['blocked_route']['checks'],'native':'NATIVE-UNTESTED'},indent=2))
