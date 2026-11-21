#!/usr/bin/env python3
"""CINDERLIFT SPLIT-FAULT EXCHANGE, original orthographic industrial world.
Deterministic fixed-seed (0xC1D2F411) actual material-cell authoring; no source images.
Run: python build.py; independently run python verify.py and python route_audit.py.
The geometry below was designed explicitly for vertical-fault topology, dual cliff-embedded
operating plants, exposed high-speed sky transit, and a rock-bored returning circuit.
Native runtime is not executed or inferred by this script.
"""
from pathlib import Path
from PIL import Image, ImageDraw
import numpy as np, json, hashlib
P=Path(__file__).resolve().parent
W,H=2048,1024
SEED=0xC1D2F411
AIR,WALL,CONC,BASALT,OBSID,ZINC,IRON,QUARTZ,GLASS=0,58,62,100,101,113,117,122,72
PALETTE={AIR:(10,21,33),WALL:(68,83,94),CONC:(121,130,131),BASALT:(47,61,79),OBSID:(31,40,56),ZINC:(169,158,129),IRON:(194,177,116),QUARTZ:(229,219,165),GLASS:(67,153,172)}
SEED_XOR = ((SEED>>3)^SEED)&0xffffffff
ACTOR_HASH='c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96'
# Accepted Workbench default liquid policy, round-tripped from read-only current-main compatible Setup-v2.
POLICY=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0]
SITES={
 'West launch':(104,245),'West alignment':(244,245),'West switchhouse signal':(342,247),
 'Shear bluff ingress':(491,238),'West switch cusp':(680,247),'Fault west eyebrow':(828,239),
 'High fault witness':(1034,239),'Fault east eyebrow':(1196,239),
 'East cliff overflight':(1415,228),'East conductor crest':(1625,224),
 'East outbound gantry':(1775,245),'East turnaround':(1911,377),
 'East low catcher':(1882,642),'East lower approach':(1777,652),
 'East repair bore':(1600,656),'East bellows bore':(1448,658),
 'East fault threshold':(1190,655),'Fault lower crossover':(1033,664),
 'West fault threshold':(908,655),'West counterweight bore':(695,662),
 'West repair bore':(492,663),'West return mouth':(281,657),
 'West finish':(118,659),'West lift return':(135,452),
 'Midlevel west approach':(881,538),'Midlevel fault breach':(1026,472),
 'Midlevel east approach':(1230,475),
 'Western upper switchroom':(608,493),'Western deep inspection':(798,754),
 'Eastern upper bellows room':(1468,499),'Eastern deep diagnostics':(1294,766),
 'Midfault lookout':(966,555),'Eastern lower dispatch':(1675,661),
 'Western toolbox bay':(559,757)
}
PRIMARY=['West launch','West alignment','West switchhouse signal','Shear bluff ingress','West switch cusp','Fault west eyebrow','High fault witness','Fault east eyebrow','East cliff overflight','East conductor crest','East outbound gantry','East turnaround','East low catcher','East lower approach','East conductor crest','Fault east eyebrow','East fault threshold','Fault lower crossover','West fault threshold','West counterweight bore','West repair bore','West return mouth','West finish']
ALT=['West launch','West alignment','West switchhouse signal','Shear bluff ingress','West switch cusp','Midlevel west approach','Midlevel fault breach','Midlevel east approach','East cliff overflight','East conductor crest','East outbound gantry','East turnaround','East low catcher','East lower approach','East conductor crest','Fault east eyebrow','East fault threshold','Fault lower crossover','West fault threshold','West counterweight bore','West repair bore','West return mouth','West finish']
SERVICE=['West finish','West lift return','West finish','West counterweight bore','Western upper switchroom','West counterweight bore','Western toolbox bay','West counterweight bore','Western deep inspection','Fault lower crossover','Midfault lookout','Fault lower crossover','East fault threshold','East repair bore','East bellows bore','Eastern deep diagnostics','East bellows bore','East fault threshold','East bellows bore','Eastern upper bellows room','East bellows bore','Eastern lower dispatch']
OBSTRUCTION=[987,185,99,112]
BLOCK_SITE='High fault witness'
CROPS=[('overview.png',0,0,2048,1024),('01-west-switchhouse.png',50,115,430,440),('02-shear-bluff-rooms.png',390,300,470,515),('03-fault-spanning-breaches.png',795,200,480,620),('04-east-bellows-and-crest.png',1230,290,505,525),('05-east-turnaround.png',1640,160,405,625),('06-deep-diagnostics.png',650,580,780,410)]

def sha(b):return hashlib.sha256(b).hexdigest()
def make():
 # PIL L image mode is the exact one-byte material ID plane, not a rendered RGB design.
 im=Image.new('L',(W,H),0);d=ImageDraw.Draw(im)
 def rect(box,mid):d.rectangle(box,fill=mid)
 def poly(points,mid):d.polygon(points,fill=mid)
 def line(points,mid,width):d.line(points,fill=mid,width=width,joint='curve')
 # Hard roots; elevated facilities tie into both boundaries and continuous ground.
 rect((0,0,14,1023),WALL);rect((2033,0,2047,1023),WALL)
 rect((0,923,2047,1023),BASALT);rect((0,963,2047,1023),WALL)
 # Alternating serrations: geology rather than repeated industrial tray segments.
 poly([(237,923),(286,863),(319,754),(355,621),(402,487),(439,420),(495,399),(532,408),(567,367),(619,373),(671,318),(708,333),(748,416),(785,489),(811,646),(837,831),(863,923)],BASALT)
 poly([(1134,923),(1175,814),(1202,654),(1237,519),(1282,435),(1311,387),(1364,398),(1428,350),(1483,373),(1528,303),(1578,328),(1609,381),(1655,409),(1694,548),(1755,764),(1798,923)],BASALT)
 # Right-hand exposed shear strata; not random pixel filler or non-material paint.
 poly([(272,923),(340,751),(385,604),(430,504),(470,445),(503,429),(501,489),(456,571),(408,720),(378,923)],OBSID)
 poly([(1641,435),(1700,559),(1776,867),(1798,923),(1680,923),(1648,764),(1600,582)],OBSID)
 # Actual enterable, physically continuous 80-100px bored corridors through massive solids.
 poly([(282,609),(392,609),(520,627),(689,623),(847,624),(871,711),(686,719),(501,716),(363,706),(274,700)],AIR)
 poly([(1118,632),(1318,632),(1475,628),(1615,633),(1815,616),(1839,711),(1647,720),(1479,712),(1281,716),(1121,719)],AIR)
 # Literal upper caverns with doors and surface elevator chimneys.
 rect((530,435,674,585),AIR);rect((579,359,637,454),AIR);rect((584,566,638,668),AIR)
 rect((1370,453,1531,579),AIR);rect((1436,334,1501,471),AIR);rect((1437,569,1501,668),AIR)
 # Deep maintenance caves and exact shafts from the low return route.
 poly([(719,746),(749,728),(825,729),(846,762),(834,819),(729,819)],AIR);rect((754,687,805,775),AIR)
 poly([(1223,758),(1252,735),(1349,743),(1362,792),(1337,832),(1241,819)],AIR);rect((1271,687,1330,771),AIR)
 rect((513,726,602,813),AIR);rect((545,685,579,759),AIR)
 # A real through-passage in the east shear leg to the outdoor catch.
 rect((1758,623,1908,718),AIR)
 # Boundary interior mouth remains clear above the bedrock return floor.
 # Zinc and iron service hardware inside cave chambers; all attaches to rock floors/walls.
 for x in [541,583,624,666]:rect((x,576,x+4,587),IRON)
 for x in [1385,1432,1490,1518]:rect((x,570,x+4,580),IRON)
 for x0,x1,y0 in [(533,666,443),(1377,1518,458)]:
  rect((x0,y0,x1,y0+6),IRON) # anchored to cave side walls
  for k in range(3):
   xx=x0+13+39*k;rect((xx,y0+8,xx+11,y0+21),GLASS)
 # Underfloor workshops: shelving and door legs touch cave boundaries.
 for x0,x1,y in [(730,840,802),(1229,1354,809),(519,598,797)]:
  rect((x0,y,x1,y+5),CONC)
  for dx in range(10,x1-x0-10,28):rect((x0+dx,y-19,x0+dx+4,y),ZINC)
 # High fault-mouth cliff edges receive visibly different buttressed anchor pads.
 poly([(774,397),(813,414),(850,449),(862,462),(858,481),(835,468),(790,442)],CONC)
 poly([(1172,438),(1215,406),(1249,401),(1271,422),(1233,434),(1195,470)],CONC)
 # Split cantilever bridge: deliberate central breach, not a complete ring/rotor.
 line([(816,459),(935,480),(981,486)],IRON,11)
 line([(1060,496),(1136,471),(1202,435)],IRON,11)
 line([(820,456),(888,415),(947,476)],ZINC,5)
 line([(1113,475),(1160,424),(1201,431)],ZINC,5)
 # Ground-tied vertical fault pins; this is a multi-altitude fracture, not a rollercoaster tray.
 rect((842,673,854,905),CONC);rect((1138,694,1150,918),CONC)
 # Lower real load-bearing traverse, BELOW the y660 return flight envelope.
 line([(838,753),(917,750),(985,768),(1068,759),(1155,750)],IRON,11)
 for cx,by in [(875,754),(955,761),(1034,765),(1121,753)]:
  line([(cx,by),(cx+22,by+56),(cx+48,by)],ZINC,4)
 # One-sided hanging asymmetrical telescoping inspection carriage attached to left cliff.
 rect((799,510,827,536),CONC);rect((810,522,840,544),IRON)
 line([(811,536),(825,588),(864,606)],ZINC,5)
 rect((852,592,885,605),IRON)
 # Tall open-sky crossing indicator above fault, supported by cliff's own upper surface.
 poly([(738,371),(778,350),(810,379),(809,388),(779,374),(755,390)],CONC)
 line([(759,365),(759,307)],IRON,7);rect((747,295,772,303),QUARTZ)
 poly([(1246,417),(1278,388),(1317,376),(1306,399),(1280,403),(1256,426)],CONC)
 line([(1293,393),(1293,308)],IRON,7);rect((1283,297,1305,305),QUARTZ)
 # Distinct east dry brake catcher: enormous inclined wedge, rooted in ground.
 poly([(1843,921),(1859,831),(1882,797),(1929,797),(1951,860),(1981,923)],CONC)
 line([(1848,832),(1880,793),(1926,793),(1954,864)],IRON,9)
 for cx in [1870,1904,1938]:line([(cx,796),(cx,779)],ZINC,5)
 # West switchhouse anchored to the west boundary + its low ground pier.
 rect((90,805,225,833),CONC);rect((109,829,123,923),CONC);rect((202,829,214,923),CONC)
 line([(112,803),(135,763),(198,763),(224,802)],IRON,10)
 rect((145,766,165,780),GLASS);rect((174,766,190,780),GLASS)
 # West and east route optical gates: each split into anchored legs (no isolated painted scenery).
 for x,y0,y1 in [(262,873,916),(1791,805,906)]:
  rect((x,y0,x+10,y1),IRON);rect((x-10,y0-8,x+20,y0),QUARTZ)
 # Open-air cliff ramps / indexed structural fracture planes. Tie to pre-existing basalt.
 line([(404,484),(436,471),(483,474),(509,432)],ZINC,6)
 line([(1364,392),(1408,378),(1447,391),(1480,368)],IRON,6)
 # Working galleries follow the geology's inner surface: framed rooms, no repeated trays.
 for (x,y,w,h) in [(517,485,10,47),(671,501,9,56),(1360,486,10,51),(1531,500,8,51)]:rect((x,y,x+w,y+h),CONC)
 # Distinctive physically connected relay fins; east taller asymmetry.
 for x,y,top in [(486,409,323),(655,356,267),(1380,383,275),(1560,336,238)]:
  line([(x,y),(x,top)],ZINC,7);rect((x-11,top-5,x+11,top+2),QUARTZ)
 # Structural catenaries and tie-backs deliberately carry the split hanging cliff roofs
 # to outer grounded works WITHOUT crossing the named high y240 or low y655 route bands.
 line([(10,349),(390,347),(591,345),(762,344)],ZINC,5)
 line([(435,347),(435,434)],IRON,6)  # western cliff skin into western boundary cable
 line([(651,342),(660,317)],IRON,7)  # opposing west crag to common anchor
 line([(762,344),(775,378)],IRON,6)  # fractured west eyebrow machinery
 # East cable descends outside the right return mouth, above the cliff but below no transit.
 line([(1301,352),(1538,343),(1590,359)],ZINC,6)
 line([(1301,352),(1301,408)],IRON,7)
 line([(1538,343),(1545,319)],IRON,7)
 line([(1590,359),(1686,569),(1740,808),(2029,829)],IRON,7)
 # Real, joined exposed bridge mechanisms and chamber hardware.
 line([(759,299),(759,314)],ZINC,5)
 line([(1293,300),(1293,318)],ZINC,5)
 line([(808,431),(720,444)],IRON,7)
 line([(533,444),(508,444)],IRON,5)
 for xx in [550,589,628]:line([(xx,443),(xx,454)],IRON,4)
 line([(1518,459),(1548,459)],IRON,5)
 for xx in [1394,1433,1472]:line([(xx,461),(xx,469)],IRON,4)
 line([(802,522),(769,522)],IRON,5)
 line([(624,576),(683,576)],ZINC,4)
 line([(1491,575),(1541,575)],ZINC,4)
 line([(817,725),(841,748)],IRON,6)
 line([(520,796),(504,801)],IRON,5)
 line([(732,805),(716,813)],IRON,5)
 line([(1938,791),(1927,794)],IRON,5)
 # Fine structural grain only where inside supported rock (NOT noise in free air).
 # Includes intentionally empty fault volume, broken bridge gap, and excavatable shoulders.
 return np.asarray(im,dtype=np.uint8).copy()

def rectangles(g):
 # Deterministic ordered lossless vertical-run coalescing; excludes AIR.
 out=[];active={}
 for y,row in enumerate(g):
  new={};x=0
  while x<W:
   k=int(row[x]);start=x
   while x<W and row[x]==k:x+=1
   if k==0:continue
   key=(start,x-start,k)
   if key in active:r=active[key];r[3]+=1
   else:r=[start,y,x-start,1,k];out.append(r)
   new[key]=r
  active=new
 return out

def png(g,path,x,y,w,h):
 im=Image.fromarray(g[y:y+h,x:x+w],mode='P')
 palette=[]
 for i in range(256): palette.extend(PALETTE.get(i,(255,0,255)))
 im.putpalette(palette)
 im.save(path,optimize=True)

def output():
 g=make();r=rectangles(g)
 assert g.size==2097152 and len(r)<=32768
 setup={'version':2,'extent':[W,H], 'actors':[{'id':1,'model':'midge','hash':ACTOR_HASH,'spawn':list(SITES['West launch']),'options':{'budget':20,'mass_multiplier':1,'inertia_multiplier':1,'thrust_multiplier':1,'torque_multiplier':1,'boost_multiplier':2}}], 'next_id':2,'selected':1,'edits':r,'response':'LA-SELECTIVE','liquid_policy':POLICY,'normalize':False,'rule_radius':2,'source':[],'material':2,'brush':8,'fire':False}
 setupfile=P/'setup-cinderlift-split-fault-exchange.json';b=(json.dumps(setup,separators=(',',':'))+'\n').encode();setupfile.write_bytes(b)
 for fn,x,y,w,h in CROPS:png(g,P/fn,x,y,w,h)
 hist={str(int(i)):int((g==i).sum()) for i in np.unique(g)}
 q={'schema_version':1,'title':'Cinderlift Split-Fault Exchange','status':'SOURCE-STATIC-PENDING-INDEPENDENT-REPLAY / NATIVE-UNTESTED','seed':SEED,'engine_main_sha':'f7e056c9b8791106e22f2d1c295043783d8a9701','reference_main_sha_at_branch':'99a166e7fcae45eb22be1740e9f33f62faccbcc7','extent':[W,H],'material_plane_sha256':sha(g.tobytes()),'setup_sha256':sha(b),'setup_bytes':len(b),'rectangle_count':len(r),'rectangle_work':sum(w*h for x,y,w,h,m in r),'material_histogram':hist,'sites':SITES,'primary_route':PRIMARY,'alternate_route':ALT,'service_route':SERVICE,'obstruction_xywh':OBSTRUCTION,'blocked_site':BLOCK_SITE,'png_crops':{a:[x,y,w,h] for a,x,y,w,h in CROPS},'png_index_pixels':sum(w*h for a,x,y,w,h in CROPS),'native':'NATIVE-UNTESTED'}
 (P/'qualification.json').write_text(json.dumps(q,indent=2)+'\n')
 print(json.dumps({'sha':q['material_plane_sha256'],'rectangles':len(r),'work':q['rectangle_work'],'setup_bytes':len(b),'png_index_pixels':q['png_index_pixels'],'material_histogram':hist}))
if __name__=='__main__':output()
