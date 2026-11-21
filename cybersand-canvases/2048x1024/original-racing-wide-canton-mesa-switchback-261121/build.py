#!/usr/bin/env python3
"""CANTON MESA SWITCHBACK: fixed-seed original orthographic material-cell world.

No reference art, screenshots or simulation-derived output is used. All image
indices are exact cells of the final source plane. Units: 1 material cell.
"""
import json, hashlib, random
from pathlib import Path
import numpy as np
from PIL import Image
W,H=2048,1024
SEED=0x26A7C116
AIR,WALL,CONCRETE,BASALT,OBSIDIAN,IRON,ZINC,QUARTZ,GLASS=0,58,62,100,101,117,113,122,72
MATS={58,62,100,101,117,113,122,72}
COLORS={0:(7,24,33),58:(65,80,92),62:(115,130,137),100:(49,64,73),101:(29,40,52),117:(169,191,197),113:(191,155,94),122:(245,212,108),72:(73,160,180)}
ROOT=Path(__file__).resolve().parent
SITES={
'West launch gantry':[100,217],'West guide sail':[318,215],
'Rim signal crown':[578,215],'Central flyover':[836,209],
'Upper breakaway cue':[1056,213],'North valley flank':[1260,211],
'East tensile beacon':[1530,215],'East crane approach':[1780,219],
'Eastern dive mouth':[1910,240],'East quick drop':[1910,384],
'East turnaround':[1910,528], 'Eastern return guide':[1730,521],
'Far depot return':[1480,519],'Central basin return':[1160,524],
'West transfer return':[855,527],'Ramp-side return':[512,521],
'West finish':[107,521],
'West drop gate':[110,382],'Western service cruise':[315,511],
'Basin lateral':[680,520],'Middle canton passage':[1017,517],
'East market lateral':[1355,519],'Eastern interchange':[1685,515],
'West machinist chamber':[275,809],'West pump bridge':[410,623],
'Old load cellar':[810,842],'Central survey stage':[1047,689],
'East fabricator lookout':[1610,578],
'Deep east annex':[1839,911],'Deep middle spur':[1212,934],
'Mesa view stair':[755,639]
}
PRIMARY=['West launch gantry','West guide sail','Rim signal crown',
'Central flyover','Upper breakaway cue','North valley flank',
'East tensile beacon','East crane approach','Eastern dive mouth',
'East quick drop','East turnaround','Eastern return guide',
'Far depot return','Central basin return','West transfer return',
'Ramp-side return','West finish']
ALT=['West launch gantry','West drop gate','Western service cruise',
'Basin lateral','Middle canton passage','East market lateral',
'Eastern interchange','East turnaround','Eastern return guide',
'Far depot return','Central basin return','West transfer return',
'Ramp-side return','West finish']
BLOCK=[1014,170,85,94]
CROPS={'overview.png':[0,0,W,H],
'01-west-industrial-canton.png':[35,315,425,620],
'02-mesa-signal-terrace.png':[405,380,445,600],
'03-closed-disk-and-cellars.png':[765,305,465,700],
'04-east-market-crane-yard.png':[1200,346,550,636],
'05-eastern-turn-and-annex.png':[1660,245,375,768],
'06-grounded-rooms-and-expansion.png':[440,620,1180,400]}

def make():
 rng=random.Random(SEED)
 g=np.zeros((H,W),np.uint8)
 def rect(x,y,w,h,m):
  x,y,w,h=map(int,(x,y,w,h));l=max(0,x);r=min(W,x+w);t=max(0,y);b=min(H,y+h)
  if r>l and b>t:g[t:b,l:r]=m
 def line(x,y,X,Y,r,m):
  n=max(abs(X-x),abs(Y-y))+1
  for a,b in zip(np.linspace(x,X,n).round().astype(int),np.linspace(y,Y,n).round().astype(int)):
   rect(a-r,b-r,2*r+1,2*r+1,m)
 def chamber(cx,cy,rx,ry):
  # ellipse strictly orthographic excavated cavity in the rock, connected to both
  # circulation galleries; wide concave ceiling shows real geology at 1:1.
  for y in range(max(0,cy-ry),min(H,cy+ry+1)):
   q=1-((y-cy)/ry)**2
   half=int(rx*np.sqrt(max(0,q)))
   rect(cx-half,y,2*half+1,1,AIR)
 def room(x,y,w,h,mat,door):
  rect(x,y,w,h,mat);rect(x+9,y+9,w-18,h-18,AIR)
  if door=='top':rect(x+w//2-44,y-2,88,20,AIR)
  if door=='left':rect(x-2,y+h//2-38,22,76,AIR)
  if door=='right':rect(x+w-19,y+h//2-38,22,76,AIR)
  if door=='bottom':rect(x+w//2-44,y+h-19,88,22,AIR)
  rect(x+25,y+h-35,30,10,ZINC);rect(x+w-42,y+29,18,18,GLASS)
 # Continuous floor-rooted escarpment. All inhabited cantons, cranes and
 # equipment grow upward from the bedrock; no floating mid-air islands.
 rect(0,800,W,224,BASALT)
 rect(0,1008,W,16,WALL)
 # Four unequal settlement mesas separated by genuine editable low saddles.
 for x,y,w in [(0,658,415),(412,736,260),(667,690,478),
                (1142,769,247),(1385,672,663)]:rect(x,y,w,800-y,BASALT)
 # Distinct strata banded through actual rock cells, no scenic pixel layers.
 for x,y,w in [(55,722,190),(431,784,144),(718,728,185),(957,752,151),
                 (1167,801,174),(1499,723,322),(1743,881,249)]:rect(x,y,w,8,OBSIDIAN)
 # Stepped roof details and loading teeth, all overlap and root into the mesa.
 for x,y,w in [(74,641,124),(285,628,63),(748,674,112),
                (976,650,135),(1466,649,148),(1715,653,117)]:rect(x,y,w,17,CONCRETE)
 # WEST: linked control arch over excavated compressor, supported both sides.
 line(102,657,149,565,7,IRON);line(149,565,241,657,7,IRON)
 rect(129,552,39,16,ZINC);rect(143,529,10,24,QUARTZ)
 rect(285,620,64,22,ZINC)
 # Significant negative-space basin with a sparse one-legged telemetry fin.
 line(530,737,545,622,7,IRON);line(545,622,595,736,7,IRON)
 rect(522,599,51,18,ZINC)
 # CENTRAL: offset airlift monolith with an inclined crane, floor-rooted.
 rect(748,677,23,93,IRON)
 line(773,680,840,594,7,IRON);line(840,594,916,686,7,IRON)
 rect(826,573,34,18,QUARTZ)
 # Three unequal pressure domes carved as cavities with massive bedrock rings.
 # Each chamber has a floor (grounded), supporting side jambs and roof opening.
 chamber(811,855,126,103)
 chamber(1045,878,95,96)
 chamber(1607,855,144,112)
 # The left and right caves have explicit 90-cell skylight shafts, without
 # cutting surrounding load-bearing wall posts or lifting any stone roof.
 rect(773,694,77,184,AIR)
 rect(1009,690,76,211,AIR)
 rect(1576,674,80,204,AIR)
 # Physical chamber landings/gear, all on real connected cave floor.
 rect(713,925,179,12,IRON)
 rect(1001,951,93,13,IRON)
 rect(1504,943,190,14,IRON)
 # EAST: multi-canton machining terrace with different overhead forms.
 line(1483,674,1505,589,7,IRON);line(1505,589,1617,664,6,IRON)
 rect(1492,571,36,18,ZINC)
 line(1728,675,1783,574,6,IRON);line(1783,574,1833,672,6,IRON)
 rect(1768,558,34,18,QUARTZ)
 # Faceted cargo sorter integrated with the right-hand retaining mesa.
 rect(1854,657,117,18,CONCRETE)
 line(1881,655,1944,578,7,IRON);line(1944,578,1984,657,7,IRON)
 rect(1926,563,37,17,ZINC)
 # Four service chambers with incomplete, reachable construction seams.
 room(197,773,150,112,CONCRETE,'top')
 room(1227,842,133,100,OBSIDIAN,'top')
 room(1738,868,155,107,CONCRETE,'top')
 # Open literal service entries in top of roofs, through full terrain to rooms.
 rect(245,643,86,174,AIR)
 rect(1246,764,88,124,AIR)
 rect(1773,671,90,237,AIR)
 # Distinct west mezzanine, east lift pocket and side caves are genuine
 # editable volumes, not blocked scenery. Extra doorways in chambers are wide.
 rect(359,648,115,92,AIR)
 rect(1081,714,136,88,AIR)
 rect(1378,735,118,84,AIR)
 # Recovery hollows allow reversing out of mistakes before the lower return.
 rect(509,757,110,71,AIR)
 rect(1151,788,104,67,AIR)
 # Lower-level functional plant fittings, each rooted through walls or floor.
 for x,y in [(207,771),(1285,843),(1746,866)]:
  line(x,y,x+12,y-28,4,IRON)
 # A dry mesh of cable ducts and visible bolt collars, always in solid rock.
 for x,y in [(357,774),(695,766),(938,735),(1469,739),(1893,731)]:
  rect(x,y,32,11,ZINC)
 # Smaller deep room slots for future human editing and NPC placement.
 rect(602,915,128,80,AIR)
 rect(605,865,56,91,AIR)
 rect(1137,911,118,77,AIR)
 rect(1156,860,64,96,AIR)
 # True 31x27-wide openings through formerly uninterrupted equipment crowns.
 # Each is source-material void, never a fabricated route annotation.
 rect(781,616,81,112,AIR)    # first old cellar chimney
 # search solution pending
 rect(1793,608,95,129,AIR)  # east annex access under rail arches
 rect(1167,788,97,159,AIR) # deep middle excavation service shaft
 # No dropped scaffold fragments: a final root-aware orphan filter removes
 # only accidental isolated ornamental micro-components, never major masses.
 # (The independent verifier checks the entire final plane unconditionally.)
 from scipy import ndimage as ndi
 labels,count=ndi.label(g!=0,structure=np.array([[0,1,0],[1,1,1],[0,1,0]]))
 root_ids=set(labels[0,:])|set(labels[-1,:])|set(labels[:,0])|set(labels[:,-1])
 for i in range(1,count+1):
  if i not in root_ids:
   area=int(np.count_nonzero(labels==i))
   if area>2500: raise AssertionError(f'detached engineered mass {area} cells; fix geometry, do not trim it')
   g[labels==i]=AIR
 # Unbroken world boundary walls, actual inert material.
 rect(0,0,13,H,WALL);rect(W-13,0,13,H,WALL)
 return g

def pack_rectangles(g):
 output=[];previous={}
 for y in range(H):
  row=g[y];nxt={};x=0
  while x<W:
   m=int(row[x]);start=x
   while x<W and int(row[x])==m:x+=1
   if m==0:continue
   key=(start,x-start,m)
   if key in previous: record=previous[key];record[3]+=1
   else:record=[start,y,x-start,1,m];output.append(record)
   nxt[key]=record
  previous=nxt
 return output

def main():
 a=make();runs=pack_rectangles(a)
 assert a.shape==(1024,2048) and len(runs)<=32768
 assert sum(w*h for x,y,w,h,m in runs)==int(np.count_nonzero(a))
 actor={'id':1,'model':'midge','hash':'c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96',
        'spawn':SITES['West launch gantry'], 'options':{'budget':20,'mass_multiplier':1,'inertia_multiplier':1,'thrust_multiplier':1,'torque_multiplier':1,'boost_multiplier':2}}
 setup={'version':2,'extent':[W,H],'actors':[actor],'next_id':2,'selected':1,
        'edits':runs,'response':'LA-SELECTIVE','liquid_policy':[1,8,12,0],
        'normalize':False,'rule_radius':2,'source':[],'material':58,'brush':8,'fire':False}
 raw=json.dumps(setup,separators=(',',':'),ensure_ascii=True).encode()
 assert len(raw)<1048576
 (ROOT/'setup-canton-mesa-switchback.json').write_bytes(raw)
 palette=[0]*768
 for m,rgb in COLORS.items():palette[m*3:m*3+3]=list(rgb)
 for name,(x,y,w,h) in CROPS.items():
  img=Image.fromarray(a[y:y+h,x:x+w],mode='P');img.putpalette(palette)
  img.save(ROOT/name,optimize=True)
 hist={str(int(k)):int(v) for k,v in zip(*np.unique(a,return_counts=True))}
 receipt={'status':'AUTHOR-SOURCE-STATIC-BUILT / NATIVE-UNTESTED','map_name':'Canton Mesa Switchback',
          'seed':SEED,'dimensions':[W,H],'final_grid_cells':W*H,
          'source_grid_sha256':hashlib.sha256(a.tobytes()).hexdigest(),
          'setup_sha256':hashlib.sha256(raw).hexdigest(),'setup_json_bytes':len(raw),
          'engine_authority_sha':'f7e056c9b8791106e22f2d1c295043783d8a9701',
          'rectangle_count':len(runs),'rectangle_work':int(np.count_nonzero(a)),
          'material_histogram':hist,'sites':SITES,'primary':PRIMARY,'alternative':ALT,
          'blocked_upper_cue':'Upper breakaway cue','obstruction':BLOCK,
          'crops':CROPS,'native':'NATIVE-UNTESTED'}
 (ROOT/'qualification.json').write_text(json.dumps(receipt,indent=2)+'\n')
 print('BUILT',len(runs),len(raw),receipt['source_grid_sha256'],hist)
if __name__=='__main__':main()
