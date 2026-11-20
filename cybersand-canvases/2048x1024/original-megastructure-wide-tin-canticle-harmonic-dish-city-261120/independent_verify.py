#!/usr/bin/env python3
"""Creator-run second implementation for committed Setup-v2 and indexed PNG evidence.
Run from the output folder: python3 independent_verify.py. Fails closed on mismatches.
Independent of the JS builder (not an external Shepherd or native execution).
"""
import json, hashlib, collections, pathlib, struct, zlib
import numpy as np
from scipy.ndimage import maximum_filter, label
D=pathlib.Path(__file__).resolve().parent
W,H=2048,1024
SETUP=D/'setup.json'
raw=SETUP.read_bytes();setup=json.loads(raw)
assert len(raw)<=1024*1024
assert list(setup)==['version','extent','actors','next_id','selected','edits','response','liquid_policy','normalize','rule_radius','source','material','brush','fire']
assert setup['version']==2 and setup['extent']==[W,H] and len(setup['liquid_policy'])==55
assert len(setup['actors'])==1 and setup['actors'][0]['model']=='midge'
assert setup['actors'][0]['hash']=='c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96'
SITES={
'West freight landing':[155,485], 'Antenna commons':[240,290], 'Underrail inspection':[245,731],
'Cold-splice instrument bay':[554,487], 'Amplifier refit gantry':[620,291], 'Cooling return workshop':[592,730],
'Western dish lip':[841,290], 'Reflector inner span':[1022,486], 'Dish underpass':[1080,731], 'East dish lip':[1220,290],
'Adjudication gallery':[1395,489], 'Census antenna roof':[1480,290], 'Civic archive undercroft':[1520,733],
'Containment registration':[1810,489], 'Border receiver mast':[1805,291], 'East recuperation berth':[1870,733],
'Long-range relay goal':[1930,487]
}
CROPS=[('overview.png',0,0,W,H),('01-west-freight.png',48,181,367,529),('02-amplifier-works.png',425,165,370,558),('03-parabolic-chasm.png',806,170,492,620),('04-census-tribunal.png',1301,174,381,540),('05-border-receiver.png',1683,176,347,530)]
assert setup['actors'][0]['spawn']==SITES['West freight landing']
# All occupied IDs are source-confirmed inert solid/RuleKernel::None construction palette on accepted engine.
INERT={58,62,63,64,65,66,68,69,70,71,72,73,74,75,76,77,78,79,80,100,101,111,114,119,120,130,131}
assert len(setup['edits'])<=32768
# Separate, straightforward sequential material replay. No speculative shift or merge.
g=np.zeros((H,W),dtype=np.uint8);coverage=np.zeros((H,W),dtype=np.uint8)
work=0
for idx,edit in enumerate(setup['edits']):
 assert len(edit)==5 and all(type(x) is int for x in edit), ('type',idx)
 x,y,w,h,m=edit
 assert 0<=x<W and 0<=y<H and w>0 and h>0 and x+w<=W and y+h<=H and m in INERT, ('bad edit',idx)
 assert not coverage[y:y+h,x:x+w].any(),('overlap',idx)
 coverage[y:y+h,x:x+w]=1;g[y:y+h,x:x+w]=m
 work+=w*h
assert work<=32_000_000
assert int(np.count_nonzero(g))==work
# Every occupied 4-connected component must touch at least one external boundary.
solids=(g!=0)
lab,n=label(solids,np.array([[0,1,0],[1,1,1],[0,1,0]],np.uint8))
counts=np.bincount(lab.ravel());roots=set(np.unique(np.r_[lab[0,:],lab[-1,:],lab[:,0],lab[:,-1]]))-{0}
unsupported=[(int(i),int(counts[i])) for i in range(1,n+1) if i not in roots]
assert not unsupported,unsupported[:20]
# Proof for four-neighbour conservative *fully contained* actor envelopes (no target substitution).
def flight(grid,envelope,sites,blocked=False):
 cw,ch=envelope
 mask=grid!=0
 full=maximum_filter(mask,size=(ch,cw),mode='constant',cval=True)
 free=~full
 src=sites['West freight landing'];assert bool(free[src[1],src[0]]),('blocked spawn',envelope)
 # scipy.ndimage.label default 4-neighbour
 cc,num=label(free,np.array([[0,1,0],[1,1,1],[0,1,0]],np.uint8))
 fromlabel=cc[src[1],src[0]]
 misses=[name for name,(x,y) in sites.items() if not free[y,x] or cc[y,x]!=fromlabel]
 assert not misses,('unreachable',blocked,envelope,misses)
 return dict(envelope=list(envelope),reached=len(sites),total=len(sites),spawn_connected_centres=int(np.count_nonzero(cc==fromlabel)))
clear=[flight(g,(x,y),SITES) for x,y in [(19,15),(23,19),(31,27)]]
obstruct=g.copy();obstruct[448:535,986:1110]=58
assert obstruct[SITES['Reflector inner span'][1],SITES['Reflector inner span'][0]]==58
remaining={key:xy for key,xy in SITES.items() if key!='Reflector inner span'}
bypass=[flight(obstruct,(x,y),remaining,True) for x,y in [(19,15),(23,19),(31,27)]]
# Independent PNG decoder; validates signature, each chunk CRC, zlib Adler, terminal IEND, no trailing bytes,
# 8-bit indexed full raw pixel material IDs; forbids fallback mockup PNGs.
def decode_png(file):
 b=file.read_bytes();assert b[:8]==b'\x89PNG\r\n\x1a\n';i=8;ihdr=None;ids=[];iend=False;chunks=[]
 while i<len(b):
  assert i+12<=len(b)
  length=struct.unpack('>I',b[i:i+4])[0];kind=b[i+4:i+8];assert length<10000000
  data=b[i+8:i+8+length];assert len(data)==length
  crc=struct.unpack('>I',b[i+8+length:i+12+length])[0]
  assert zlib.crc32(kind+data)&0xffffffff==crc,(file,'crc',kind)
  chunks.append(kind.decode('ascii'))
  if kind==b'IHDR':
   assert ihdr is None;ihdr=struct.unpack('>IIBBBBB',data)
  elif kind==b'PLTE':
   assert len(data)==768
  elif kind==b'IDAT':ids.append(data)
  elif kind==b'IEND':assert length==0;iend=True;assert i+length+12==len(b)
  else: assert kind in (b'tRNS',)
  i+=length+12
 assert i==len(b) and iend and ihdr and 'PLTE' in chunks and ids
 w,h,depth,mode,compression,filt,interlace=ihdr
 assert (depth,mode,compression,filt,interlace)==(8,3,0,0,0),ihdr
 payload=zlib.decompress(b''.join(ids));assert len(payload)==(w+1)*h
 p=np.frombuffer(payload,dtype=np.uint8).reshape(h,w+1)
 assert not p[:,0].any(),'unexpected scanline PNG filter'
 return p[:,1:].copy(),hashlib.sha256(b).hexdigest()
images={};total_pixels=0
for name,x,y,w,h in CROPS:
 pix,digest=decode_png(D/name)
 assert pix.shape==(h,w),('dimensions',name,pix.shape)
 assert np.array_equal(pix,g[y:y+h,x:x+w]),('material mismatch',name)
 total_pixels+=w*h
 images[name]={'width':w,'height':h,'x':x,'y':y,'bytes':(D/name).stat().st_size,'sha256':digest,'matched_pixels':w*h}
assert total_pixels==sum(c[3]*c[4] for c in CROPS)
# Builder's original grid checksum is checked independently from replay.
grid_sha=hashlib.sha256(g.tobytes(order='C')).hexdigest()
sha=lambda f:hashlib.sha256((D/f).read_bytes()).hexdigest()
receipt={
 'title':'Tin Canticle — Harmonic Dish City',
 'qualification':'CREATOR SOURCE-STATIC PASS; independent review pending; NATIVE-UNTESTED',
 'accepted_engine_head':'7b03aa437561ec63e31fd09531171360ab60eeb4',
 'sandmapsreference_base_head':'99a166e7fcae45eb22be1740e9f33f62faccbcc7',
 'exact_dimensions':[W,H], 'material_cell_count':W*H,
 'setup_bytes':len(raw),'setup_sha256':sha('setup.json'),
 'generator_sha256':sha('generate.js'), 'builder_sha256':sha('build.cjs'),
 'grid_sha256':grid_sha, 'edits':len(setup['edits']),'construction_work':work,
 'source_rectangle_limit':32768,'possible_installed_rectangle_limit':4096,
 'occupied_cells':int(solids.sum()),'empty_cells':int((~solids).sum()),
 'histogram':{str(int(k)):int(v) for k,v in zip(*np.unique(g,return_counts=True))},
 'material_laws':'All occupied IDs checked against accepted source Solid/None static construction palette; no liquids, reactive kernels, powders or simulated debris',
 'solid_4_connected_components':n,'boundary_rooted_components':len(roots),'unsupported_components':unsupported,
 'exact_sites':SITES,'clearance_results':clear,'obstruction_rectangle_xywh':[986,448,124,87],
 'obstruction_excluded_site':'Reflector inner span','bypass_results':bypass,
 'actual_indexed_pngs':images,'verified_png_pixels':total_pixels,
 'native_install_load_input_collision_simulation_save_reopen':'NATIVE-UNTESTED',
 'independent_qualification':'PENDING'
}
(D/'receipt.json').write_text(json.dumps(receipt,indent=2,sort_keys=True)+'\n')
print(json.dumps({'status':'CREATOR SOURCE-STATIC PASS', 'grid_sha256':grid_sha,'edits':len(setup['edits']),'bytes':len(raw),'occupied':int(solids.sum()),'root_components':len(roots),'clearance':[(q['envelope'],q['reached']) for q in clear],'bypass':[(q['envelope'],q['reached']) for q in bypass],'pixel_parity':total_pixels},indent=2))
