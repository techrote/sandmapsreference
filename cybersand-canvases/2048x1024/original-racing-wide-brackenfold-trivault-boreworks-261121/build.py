#!/usr/bin/env python3
"""BRACKENFOLD TRI-VAULT BOREWORKS — original 2048x1024 orthographic sci-fi industrial world.

A wholly new excavated three-vault mine/relay architecture: three unequal interlocking
geological cavities, diagonally rising industrial high-bore outbound flight,
low-bore return, redundant lower-mid bypass, and useful unscripted expansion seams.
The builder authors *every* final material ID cell.  No art inputs or reference assets.
"""
from pathlib import Path
from PIL import Image, ImageDraw
import numpy as np, json, hashlib
P=Path(__file__).resolve().parent
W,H=2048,1024
SEED=0xB2AC6F21
AIR,REINF,STEEL,BASALT,OBSID,ZINC,IRON,QUARTZ,GLASS=0,58,62,100,101,113,117,122,72
PALETTE={AIR:(9,20,32),REINF:(120,133,142),STEEL:(167,164,140),BASALT:(51,68,82),OBSID:(28,43,56),ZINC:(167,153,111),IRON:(191,175,116),QUARTZ:(232,219,161),GLASS:(52,145,171)}
ACTOR_HASH='c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96'
POLICY=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0]
# Names are literal 4-neighbour full-body targets; audit never moves them.
SITES={
 'West ignition nest':(125,312), 'West pressure latch':(257,317),
 'West bearing':(406,303), 'Vault one crown':(567,295),
 'Vault one switch':(679,321), 'North tri-vault throat':(809,317),
 'Triple vault skylane':(988,281), 'Central saltfold beacon':(1115,279),
 'East upper throat':(1298,319), 'East condenser arm':(1443,338),
 'Third vault overflight':(1615,329),'East collector':(1770,352),
 'East return elbow':(1892,487),'East low catch':(1889,715),
 'East foundry return':(1717,739),'Third vault low':(1550,746),
 'Mid seam low':(1338,760),'Central low relay':(1120,780),
 'Central sub-bore':(951,788),'Vault one return':(610,761),
 'West repair return':(533,748),'West lower approach':(364,740),
 'West finish':(154,735),'West recovery shaft':(151,526),
 'South tri-vault bypass':(791,532), 'Central bypass wicket':(976,539),
 'East bypass wicket':(1174,540), 'East lower approach':(1415,529),
 'West upper control':(509,176), 'Central roof control':(1087,165),
 'East ceiling laboratory':(1571,191),
 'West basal workshop':(497,853), 'Central basal workshop':(1080,883),
 'East basal workshop':(1604,855)
}
PRIMARY=['West ignition nest','West pressure latch','West bearing','Vault one crown','Vault one switch',
 'North tri-vault throat','Triple vault skylane','Central saltfold beacon','East upper throat',
 'East condenser arm','Third vault overflight','East collector','East return elbow',
 'East low catch','East foundry return','Third vault low','Mid seam low',
 'Central low relay','Central sub-bore','Vault one return','West repair return',
 'West lower approach','West finish']
ALT=['West ignition nest','West pressure latch','West bearing','Vault one crown',
 'Vault one switch','South tri-vault bypass','Central bypass wicket','East bypass wicket',
 'East lower approach','Third vault overflight','East collector','East return elbow','East low catch',
 'East foundry return','Third vault low','Mid seam low','Central low relay',
 'Central sub-bore','Vault one return','West repair return','West lower approach','West finish']
SERVICE=['West finish','West recovery shaft','West ignition nest',
 'Vault one crown','West upper control','Vault one crown','Vault one return','West basal workshop','Vault one return',
 'Triple vault skylane','Central roof control','Triple vault skylane','Central low relay','Central basal workshop','Central low relay',
 'Third vault overflight','East ceiling laboratory','Third vault overflight',
 'Third vault low','East basal workshop','Third vault low']
# Solid closure in one high bottleneck, exact site is lost; lower-mid alternate must remain.
OBSTRUCTION=[758,267,86,105]
BLOCK_SITE='North tri-vault throat'
CROPS=[('overview.png',0,0,2048,1024),('01-west-ignition-nest.png',50,150,390,635),
 ('02-first-vault-hoists.png',316,115,500,680),('03-central-saltfold-hub.png',757,115,515,760),
 ('04-east-condenser-bore.png',1240,145,510,680),('05-east-catcher-switch.png',1630,230,413,620),
 ('06-deep-service-pockets.png',590,650,875,365)]

def sha(b):return hashlib.sha256(b).hexdigest()

def make():
 im=Image.new('L',(W,H),BASALT)
 d=ImageDraw.Draw(im)
 def box(x0,y0,x1,y1,m): d.rectangle((x0,y0,x1,y1),fill=m)
 def poly(coords,m): d.polygon(coords,fill=m)
 def line(coords,m,width=5): d.line(coords,fill=m,width=width,joint='curve')
 # Banded geological envelope; no unsupported stone motifs or applied image assets.
 box(0,0,2047,75,OBSID)
 box(0,954,2047,1023,REINF)
 poly([(0,792),(137,817),(342,845),(545,828),(718,883),(902,854),(1077,890),(1257,855),(1445,888),(1641,854),(1831,829),(2047,795),(2047,965),(0,965)],OBSID)
 # Deep exposed structural strata inside the rock only; excavations are cut *after* layering.
 line([(0,170),(250,185),(551,154),(776,177),(1039,133),(1280,162),(1512,151),(1820,183),(2047,167)],OBSID,17)
 line([(0,869),(265,833),(550,860),(811,885),(1060,864),(1279,882),(1593,856),(1830,853),(2047,870)],REINF,11)
 # Five unequal cavities: unlike a regular industrial tray or central annulus.
 # Cavern 1 is a fan-shaped polygon; cavern 2 a wide fractured double-lung;
 # cavern 3 narrower with a stepped foot. All walls/floors remain rocky and rooted.
 poly([(62,297),(94,257),(191,236),(299,249),(337,300),(341,423),(322,556),(338,684),(297,802),(220,818),(88,787),(60,702)],AIR)
 poly([(323,356),(355,292),(407,241),(474,207),(587,224),(692,269),(744,345),(747,458),(717,560),(754,682),(717,794),(665,842),(502,844),(393,806),(345,751),(322,621)],AIR)
 poly([(714,338),(765,277),(804,235),(881,185),(1029,176),(1129,215),(1215,275),(1265,344),
       (1289,455),(1250,524),(1298,630),(1257,756),(1191,832),(1037,859),(873,831),(781,779),(742,698),(722,600)],AIR)
 poly([(1231,344),(1300,297),(1362,258),(1482,232),(1598,257),(1699,322),(1749,412),
       (1747,567),(1698,666),(1713,767),(1644,822),(1508,846),(1353,800),(1265,716)],AIR)
 poly([(1710,365),(1770,319),(1882,326),(1963,358),(1998,454),(1998,682),(1966,773),(1811,809),(1734,769)],AIR)
 # Main angled high-bore route and lower bore; each is a material cut rather than scenery.
 for pts in [
  [(105,278),(316,282),(390,270),(568,254),(712,287),(801,285),(992,243),(1140,243),(1300,292),(1515,302),(1738,317),(1895,358)],
  [(120,750),(347,751),(530,761),(745,775),(940,802),(1121,795),(1320,777),(1532,756),(1710,755),(1878,711)]
 ]:
  line(pts,AIR,104)
 # Punctured zigzag alt bore, connected to cavern 1, B and C but not duplicate y-track.
 line([(651,505),(743,529),(825,538),(920,514),(1037,549),(1154,526),(1287,541),(1439,514)],AIR,99)
 # Angled open end transfer shafts and local recovery shafts, generous 31x27 clearance.
 line([(172,326),(148,497),(151,722)],AIR,90)
 line([(1882,397),(1907,542),(1892,719)],AIR,108)
 # Two enormous rooted inter-cavern stone diaphragms. Three unequal bore-gates
 # in each are real traversable openings; this makes three *separate* vaults,
 # rather than one scenic cavern, while preserving primary/alternate/return choices.
 poly([(720,160),(782,169),(806,218),(800,407),(789,507),(802,659),(819,882),(733,892),(735,637),(742,435)],BASALT)
 poly([(1207,144),(1282,162),(1300,243),(1293,423),(1270,568),(1288,761),(1294,877),(1211,876),(1201,640),(1218,451)],BASALT)
 # High gates deliberately differ in grade and angle.
 line([(721,314),(779,318),(828,319)],AIR,107)
 line([(1169,293),(1244,315),(1327,324)],AIR,113)
 # Lower-mid detour and redundancy gates.
 line([(706,511),(768,530),(825,540)],AIR,102)
 line([(1178,536),(1248,541),(1324,525)],AIR,106)
 # Continuous deep service express through *both* diaphragm toes.
 line([(693,765),(769,780),(836,789)],AIR,112)
 line([(1176,784),(1255,769),(1324,760)],AIR,113)
 # Diaphragm stone remains roof- and floor-tied through substantial vertical trunks.
 # High operator room pockets cut separately through upper cliff, with wide shafts.
 for x0,x1,y0,y1,sx in [(470,558,130,204,512),(1043,1132,116,199,1090),(1530,1615,137,217,1570)]:
  box(x0,y0,x1,y1,AIR)
  box(sx-36,y1-5,sx+36,y1+106,AIR)
 # Lower industrial basements and entered access shafts. Deliberate expansion seams.
 for x0,x1,y0,y1,sx in [(452,563,846,927,503),(992,1101,850,932,1041),(1543,1670,840,928,1602)]:
  box(x0,y0,x1,y1,AIR)
  box(sx-38,y0-112,sx+38,y0+6,AIR)
 # Broad independent east-side entry beside the central raised service tower.
 box(1053,740,1138,903,AIR)
 # Partial excavations are editorial authoring sockets, not labels on scenery.
 poly([(601,859),(649,841),(709,862),(713,904),(676,925),(602,920)],AIR)
 poly([(1357,849),(1408,833),(1466,862),(1459,912),(1379,915)],AIR)
 # Structural rock toe pads at some cavity feet; the next industrial legs are rooted in them.
 for x0,x1,y0 in [(369,406,784),(665,696,814),(824,849,793),(1223,1261,786),(1361,1390,805),(1655,1685,811)]:
  box(x0,y0,x1,y0+18,REINF)
 # Non-repeating industrial diagonal rig: two independent side-rooted fan lattices.
 # First-vault hoist: left cantilever ties into cavern wall, symmetric second boom rises from floor.
 line([(354,447),(421,415),(477,374),(529,331)],IRON,10)
 line([(355,462),(452,463),(529,331)],ZINC,6)
 line([(400,432),(420,462)],STEEL,4)
 line([(455,394),(454,463)],STEEL,4)
 line([(638,818),(644,639),(595,560)],IRON,13)
 line([(643,643),(690,561),(733,518)],ZINC,8)
 # Central paired pressure-arch diaphragms: side-rooted and roof-rooted; no unconnected ring.
 line([(770,372),(822,399),(862,448),(895,493)],STEEL,14)
 line([(1235,378),(1181,401),(1150,451),(1122,480)],STEEL,14)
 line([(892,493),(876,544)],IRON,7)
 line([(1123,480),(1138,523)],IRON,7)
 # Central floor-rooted diagnostic tower: narrow enough to preserve side bypasses.
 box(1016,690,1046,858,REINF)
 line([(1031,704),(1031,605)],IRON,12)
 box(1007,605,1055,616,STEEL)
 line([(1009,632),(1033,603),(1053,631)],ZINC,5)
 # Rock-to-metal bridge-like cross ties, positioned below/outside the high route.
 line([(845,582),(902,602),(959,567)],ZINC,7)
 line([(1093,570),(1162,607),(1231,559)],ZINC,7)
 line([(845,582),(844,738)],IRON,8)
 line([(1231,559),(1231,738)],IRON,8)
 # Third-vault counterweight assembly, anchored to cavern wall and bottom rock.
 line([(1351,612),(1408,582),(1472,554),(1517,501)],IRON,11)
 line([(1517,501),(1575,539),(1630,599),(1667,656)],IRON,11)
 line([(1517,501),(1517,382)],ZINC,8)
 box(1506,381,1528,397,QUARTZ)
 line([(1659,810),(1659,677)],REINF,14)
 box(1645,674,1675,689,IRON)
 # Actual entrance-readable pod frames and access hatch edges, not filled-over voids.
 for x0,x1,y0,y1 in [(467,562,129,204),(1042,1133,115,200),(1529,1616,136,217)]:
  line([(x0,y0+3),(x1,y0+3)],STEEL,8)
  line([(x0,y0+3),(x0,y1-24)],IRON,5)
  line([(x1,y0+3),(x1,y1-24)],IRON,5)
  for xx in [x0+15,x0+37,x0+59]: box(xx,y0+16,xx+12,y0+25,GLASS)
 # Basal service vaults remain mostly vacant and independently entered.
 for x0,x1,y0,y1 in [(453,562,847,926),(993,1100,851,931),(1544,1669,841,927)]:
  line([(x0,y1-13),(x1,y1-13)],STEEL,9)
  line([(x0+5,y0+3),(x0+5,y1-12)],IRON,5)
  for xx in [x0+21,x0+55]:box(xx,y1-45,xx+13,y1-23,ZINC)
 # West ignition doors/brake hardware; anchored through rock rim at x56.
 box(58,559,85,690,REINF)
 line([(67,563),(102,539),(124,537)],IRON,10)
 line([(62,557),(62,354)],STEEL,6)
 box(54,347,83,359,QUARTZ)
 # East collector shaped as open tapered wedge at floor; upper lip anchored to eastern sidewall.
 line([(1977,380),(1946,403),(1930,429)],IRON,12)
 line([(1929,680),(1966,712),(1978,757)],IRON,14)
 line([(1930,706),(1950,692),(1978,695)],ZINC,6)
 # Work-route markers are material cells, not invented collision triggers; all touch rock or rig.
 for xx,yy in [(386,259),(739,268),(1259,269),(1731,313)]:
  # Top-of-cavern rooted pilot lamps placed on existing stone near lip.
  box(xx-5,yy-15,xx+5,yy-4,IRON)
  box(xx-9,yy-21,xx+9,yy-16,QUARTZ)
 # Explicit fastener/load-path schedule: every independent fabricated member is tied
 # back to a cavern rim, floor or roof by a grounded tension strut. These are
 # material cells, so they remain collision-relevant rather than cosmetic strokes.
 ties=[
  ((1057,131),(1057,121),STEEL,3),((1079,131),(1079,121),STEEL,3),((1101,131),(1101,121),STEEL,3),
  ((482,145),(482,135),STEEL,3),((504,145),(504,135),STEEL,3),((526,145),(526,135),STEEL,3),
  ((1544,152),(1544,142),STEEL,3),((1566,152),(1566,142),STEEL,3),((1588,152),(1588,142),STEEL,3),
  ((377,238),(375,219),IRON,5),((1740,292),(1747,264),IRON,5),
  ((526,328),(559,201),STEEL,7),((1236,370),(1254,263),STEEL,9),
  ((773,367),(784,263),IRON,8),((1663,659),(1663,673),STEEL,9),
  ((644,814),(665,817),STEEL,9),((1235,738),(1255,827),STEEL,9),
  ((841,738),(831,840),STEEL,7),((770,575),(770,537),STEEL,9),((766,539),(735,521),STEEL,8),((806,725),(838,738),REINF,10),
  ((1016,853),(991,854),REINF,9),((1699,669),(1675,675),STEEL,7),
  ((334,699),(334,805),REINF,7),((369,802),(369,806),REINF,9),
  ((1261,804),(1261,826),REINF,9),((831,811),(831,840),REINF,9),
  ((1549,839),(1542,841),STEEL,5),
  ((1544,910),(1542,910),STEEL,5),((453,909),(451,909),STEEL,5),
  ((993,914),(991,914),STEEL,5),
  ((474,881),(451,881),STEEL,5),((508,903),(508,929),STEEL,5),
  ((1565,882),(1542,882),STEEL,5),((1599,904),(1599,930),STEEL,5),
  ((1014,886),(991,886),STEEL,5),((1048,908),(1048,934),STEEL,5)
 ]
 for a,b,mat,width in ties:line([a,b],mat,width)
 return np.asarray(im,np.uint8).copy()

def rectangles(g):
 out=[];active={}
 for y,row in enumerate(g):
  new={};x=0
  while x<W:
   mid=int(row[x]);sx=x
   while x<W and int(row[x])==mid:x+=1
   if mid==0:continue
   key=(sx,x-sx,mid)
   if key in active:r=active[key];r[3]+=1
   else:r=[sx,y,x-sx,1,mid];out.append(r)
   new[key]=r
  active=new
 return out

def png(g,path,x,y,w,h):
 im=Image.fromarray(g[y:y+h,x:x+w],mode='P')
 pal=[]
 for i in range(256):pal.extend(PALETTE.get(i,(255,0,255)))
 im.putpalette(pal);im.save(path,optimize=True)

def output():
 g=make();edits=rectangles(g)
 assert len(edits)<=32768
 setup={'version':2,'extent':[W,H],
 'actors':[{'id':1,'model':'midge','hash':ACTOR_HASH,'spawn':list(SITES['West ignition nest']),
 'options':{'budget':20,'mass_multiplier':1,'inertia_multiplier':1,'thrust_multiplier':1,'torque_multiplier':1,'boost_multiplier':2}}],
 'next_id':2,'selected':1,'edits':edits,'response':'LA-SELECTIVE','liquid_policy':POLICY,
 'normalize':False,'rule_radius':2,'source':[],'material':2,'brush':8,'fire':False}
 b=(json.dumps(setup,separators=(',',':'))+'\n').encode()
 (P/'setup-brackenfold-trivault-boreworks.json').write_bytes(b)
 for name,x,y,w,h in CROPS:png(g,P/name,x,y,w,h)
 q={'schema_version':1,'title':'Brackenfold Tri-Vault Boreworks',
 'status':'SOURCE-STATIC-AUTHOR-CANDIDATE / NATIVE-UNTESTED',
 'seed':SEED,'engine_main_sha':'f7e056c9b8791106e22f2d1c295043783d8a9701',
 'reference_main_sha_at_branch':'99a166e7fcae45eb22be1740e9f33f62faccbcc7',
 'extent':[W,H],'source_cells':W*H,'material_plane_sha256':sha(g.tobytes()),
 'setup_sha256':sha(b),'setup_bytes':len(b),'rectangle_count':len(edits),
 'rectangle_work':sum(w*h for x,y,w,h,m in edits),
 'material_histogram':{str(int(k)):int(v) for k,v in zip(*np.unique(g,return_counts=True))},
 'sites':SITES,'start_site':'West ignition nest','finish_site':'West finish',
 'primary_route':PRIMARY,'alternate_route':ALT,'service_route':SERVICE,
 'obstruction_xywh':OBSTRUCTION,'blocked_site':BLOCK_SITE,
 'png_crops':{n:[x,y,w,h] for n,x,y,w,h in CROPS},
 'png_index_pixels':sum(w*h for n,x,y,w,h in CROPS),
 'material_law_assumptions':{'inert_solid_ids':[58,62,72,100,101,113,117,122],
  'fluid_falling_mobile_reactive_cells':0},'native':'NATIVE-UNTESTED'}
 (P/'qualification.json').write_text(json.dumps(q,indent=2)+'\n')
 print(json.dumps({k:q[k] for k in ['material_plane_sha256','rectangle_count','rectangle_work','setup_bytes','png_index_pixels','material_histogram']}))
if __name__=='__main__':output()
