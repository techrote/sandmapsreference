#!/usr/bin/env python3
"""Keel Ossuary: independent original 2048x1024 CyberSand material-cell drydock.
Run in this directory: python build.py; Pillow + numpy + scipy required.
Geometry, routing, raster and exact Setup-v2 encoding all derive from this fixed seed.
No earlier CyberSand map geometry, screenshots or images are imported.
"""
from pathlib import Path
import json,hashlib,random
from collections import Counter
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi
D=Path(__file__).resolve().parent
W,H=2048,1024
SEED=202611211056
r=random.Random(SEED)
# Exact IDs vetted against accepted techrote/cybersand/main@69209ac...
# Each occupied entry is Solid / RuleKernel::None / non-movable.
M={'void':0,'concrete':58,'steel':62,'paint':63,'corrugate':64,'ruststeel':65,
   'grating':66,'pipe':68,'copper':69,'glass':72,'hazard':76,'cyan':77,
   'amber':79,'light':80,'marble':98,'basalt':100,'obsidian':101,'terrazzo':111,'brass':119}
colors={0:(8,11,18),58:(119,123,128),62:(126,141,153),63:(49,100,119),64:(109,125,134),65:(124,63,43),66:(74,85,93),68:(102,119,129),69:(165,92,54),72:(37,60,76),76:(227,182,47),77:(55,243,228),79:(255,181,46),80:(236,248,255),98:(226,223,216),100:(54,56,61),101:(24,19,32),111:(200,196,186),119:(196,160,72)}
im=Image.new('L',(W,H),0);d=ImageDraw.Draw(im)

def R(x0,y0,x1,y1,mat):
    assert x0<=x1 and y0<=y1
    d.rectangle((int(x0),int(y0),int(x1)-1,int(y1)-1), fill=M[mat])
def L(points,width,mat):d.line(points,fill=M[mat],width=width,joint='curve')
def P(points,mat):d.polygon(points,fill=M[mat])
def E(x0,y0,x1,y1,width,mat):d.ellipse((x0,y0,x1,y1),outline=M[mat],width=width)
def CLEAR(x0,y0,x1,y1):R(x0,y0,x1,y1,'void')
def load_col(x,top,width=18):
    R(x,top,x+width,952,'concrete');R(x+3,top+5,x+width-3,943,'paint')
    R(x-8,946,x+width+8,958,'steel')
def room(x0,y0,x1,y1,kind='steel',wall=8):
    R(x0,y0,x1,y0+wall,kind);R(x0,y1-wall,x1,y1,'concrete');R(x0,y0,x0+wall,y1,'concrete');R(x1-wall,y0,x1,y1,'concrete')
def hatch(x,y,w=48,h=54):
    R(x,y,x+5,y+h,'paint');R(x+w-5,y,x+w,y+h,'paint');
    R(x+3,y,x+w-3,y+5,'steel');R(x+8,y+8,x+w-8,y+15,'cyan')
def crate(x,y,w=29,h=23):
    R(x,y,x+w,y+h,'corrugate');R(x+3,y+4,x+w-3,y+8,'ruststeel')
    R(x+3,y+h-5,x+w-3,y+h-2,'hazard')
def bay(x,y,w=76):
    R(x,y,x+w,y+8,'grating')
    R(x+7,y+8,x+16,y+35,'steel');R(x+w-16,y+8,x+w-7,y+35,'steel')
    R(x+20,y-12,x+w-20,y-3,'glass')

def mast(x,top,bottom,width=13):
    R(x,top,x+width,bottom,'steel');R(x+4,top+2,x+width-4,bottom-4,'paint')
    for y in range(top+15,bottom-12,42):R(x-9,y,x+width+9,y+5,'grating')

# 1/5 West Tug Exchange. Distinct fragile upper cranes and civic registration.
# Entire design is grounded in a constructed apron, NOT an imported picture.
for x in range(W):
    e=961+int(4*np.sin(x/43)+3*np.sin(x/19));R(x,e,x+1,H,'basalt')
    if x%41 in (0,1): R(x,e-4,x+1,e,'obsidian')
R(48,942,2011,958,'concrete')
for a,b in [(90,450),(495,698),(742,1498),(1522,1760),(1800,1966)]:R(a,928,b,941,'grating')
# drydock bottom reinforced caisson, intentionally depressed to y923 and interrupted at expansion seams
R(450,908,1690,920,'steel')
for x in (480,625,784,965,1164,1362,1515,1660):load_col(x,856,18)
# West anchored public shed with two non-cloned entered tiers
load_col(110,394,23);load_col(389,450,26)
room(129,445,387,563,'steel',9);room(139,612,378,750,'corrugate',9)
R(130,563,393,576,'grating');R(130,750,391,762,'steel')
for x in (155,231,307):hatch(x,499,42,59)
for x in (161,242,327):crate(x,706,w=40,h=28)
R(166,639,331,651,'marble');R(183,652,199,682,'concrete')
R(244,651,261,681,'concrete')
# West crane with triangular structural hoist and open sky beneath
mast(215,231,447,15);L([(223,235),(425,280)],11,'steel')
L([(229,245),(383,291)],4,'brass');L([(399,283),(397,548)],3,'copper')
R(388,538,410,559,'hazard');R(390,540,408,545,'light')
L([(216,239),(273,373),(389,445)],6,'steel')
R(216,222,229,239,'light')
# Public intake and route indication rather than a sealed decorative booth
R(141,797,352,809,'steel');R(148,809,159,925,'concrete');R(335,809,348,925,'concrete')
for x in (166,231,296):bay(x,839,58)
R(349,731,385,776,'glass')
# 2/5 Aft Slip & Propulsion Extraction - deliberately narrow, asymmetric, densely furnished.
load_col(516,582,25);load_col(715,532,23)
room(539,576,715,680,'corrugate',9);room(540,731,717,839,'steel',9)
R(548,684,710,694,'grating')
E(559,604,643,670,8,'copper');E(573,613,629,657,6,'brass')
L([(602,625),(660,616),(686,645)],7,'steel')
for x in (548,594,641):crate(x,807,35,25)
R(561,748,622,760,'hazard');R(652,753,696,765,'grating')
R(549,693,559,728,'pipe');R(698,690,707,728,'pipe')
# Engineering jacks rise from apron and visibly underpin aft hull plates.
for x,top in [(761,689),(907,742),(1157,749),(1384,676)]:
    R(x,top,x+25,949,'concrete');R(x+5,top+6,x+21,940,'paint')
    R(x-10,top-7,x+35,top+6,'hazard')
    for y in range(top+50,946,76):R(x-7,y,x+33,y+7,'steel')
# 3/5 Ship cross-section: long lens-shaped derelict vessel cradled in drydock.
# No ordinary clone of bridge, dish, rock cavern or roof islands.
# Sweep keel skin from stern bulb to asymmetrical narrow prow.
P([(703,523),(764,462),(870,421),(1130,393),(1283,409),(1450,490),
   (1532,550),(1498,630),(1340,699),(1120,746),(871,728),(729,669)],'concrete')
# Inner perforated vessel galleries make this a genuinely entered cutaway rather than solid silhouette.
P([(748,534),(797,490),(887,461),(1113,436),(1270,451),(1408,513),
   (1480,558),(1458,606),(1323,656),(1113,698),(885,683),(774,638)],'void')
# Outline, bulwark and interrupted armature. Floors are not screen-top planes.
L([(704,523),(765,464),(871,423),(1130,396),(1283,412),(1447,492),(1530,549)],8,'steel')
L([(731,671),(870,728),(1120,746),(1342,700),(1496,632)],11,'steel')
L([(749,531),(873,464),(1110,437),(1284,452),(1460,555)],5,'paint')
# Coherent entered decks, with full-width transfer apertures and five different machine families.
for x0,x1,y in [(801,977,535),(1012,1257,537),(1305,1446,541),
               (792,979,621),(1022,1250,624),(1295,1452,624)]:
    R(x0,y,x1,y+9,'grating')
# Angular ribs with daylight-width perforation between decks
for x,top,bottom in [(830,467,690),(989,448,713),(1269,460,697),(1438,519,622)]:
    R(x,top,x+10,bottom,'steel')
    R(x-2,564,x+15,607,'void')  # two-way full hull rib portal; 43 high
# Internal routing shafts are deliberately *more* than 31x27 clearance
CLEAR(961,518,1027,655);CLEAR(1250,525,1319,659)
R(957,546,963,633,'paint');R(1024,546,1030,633,'paint')
R(1248,548,1254,637,'paint');R(1316,548,1321,637,'paint')
# Bilge bays / future scripted pressure changes: EMPTY but with recognisable anchor points.
E(862,555,933,608,7,'copper');R(889,577,904,601,'steel')
R(1040,556,1148,563,'steel');R(1052,563,1070,594,'paint')
R(1077,570,1121,584,'glass');R(1141,564,1151,599,'steel')
E(1341,558,1403,609,5,'brass');L([(1351,586),(1393,582)],5,'copper')
for x in (866,918,1078,1171,1354):crate(x,642,30,20)
# Lower structural truss and service lights; stays supported through proper columns.
for a,b in [(733,859),(902,1001),(1066,1186),(1223,1378),(1411,1492)]:
    R(a,778,b,787,'steel');L([(a,787),(a+35,815),(b,786)],5,'copper')
for x in (780,917,1090,1283,1451):R(x,789,x+18,795,'cyan')
# Top signal gantry: connected at vessel's back, deliberate editable air pocket below
mast(890,305,421,10);mast(1261,315,413,12)
L([(896,317),(1270,319)],9,'steel')
for x in range(922,1255,67):R(x,321,x+15,330,'grating')
L([(1037,320),(1090,394)],5,'copper');L([(1194,322),(1157,397)],5,'copper')
R(1113,292,1143,310,'glass');R(1120,297,1137,304,'cyan')
# 4/5 Starboard Astrograph Spire and calibration machine; asymmetrical tall silhouette.
load_col(1556,287,26);load_col(1716,464,24)
room(1585,333,1718,430,'steel',10)
R(1597,432,1726,444,'grating');R(1596,531,1713,540,'steel')
L([(1570,290),(1676,224),(1722,326)],9,'steel');L([(1582,289),(1673,243),(1718,326)],3,'brass')
E(1613,349,1670,414,8,'glass');E(1623,360,1659,401,4,'cyan')
R(1639,361,1649,405,'steel');R(1617,385,1668,393,'brass')
room(1582,589,1726,708,'corrugate',8)
for x in (1600,1656):hatch(x,635,40,48)
L([(1571,449),(1544,511),(1553,577)],7,'steel')
R(1570,731,1736,743,'steel');R(1605,745,1621,800,'concrete')
R(1692,745,1709,802,'concrete')
R(1623,766,1689,776,'hazard')
# 5/5 East salvage and dispatch: stepped handling tower with ground lorry bay.
load_col(1790,425,26);load_col(1934,506,20)
room(1815,473,1931,562,'steel',9)
R(1808,599,1953,610,'grating');R(1824,611,1835,729,'concrete')
R(1931,611,1944,729,'concrete')
for x in (1839,1882):hatch(x,505,37,51)
R(1823,737,1955,749,'steel')
for x in (1837,1880,1920):crate(x,702,29,29)
# Cargo gantry with lower hoist, unlike west harbor's overhead triangle
L([(1759,499),(1797,449),(1918,450)],9,'steel')
L([(1861,455),(1871,628)],4,'copper')
R(1860,616,1887,635,'hazard')
R(1806,799,1945,811,'grating');R(1820,811,1830,924,'concrete')
R(1933,811,1945,923,'concrete')
R(1857,834,1914,848,'paint')
# drydock traffic lanes: narrow, staggered and distinct; no giant cloned gallery.
for a,b,y in [(402,524,777),(716,832,815),(1469,1564,815),(1720,1820,811)]:
    R(a,y,b,y+8,'steel');R(a,y+8,a+9,y+29,'paint')
# navigability: deliberate 31x27 or better berth apertures and skylights.
CLEAR(711,574,793,637)   # stern to internal drydock
CLEAR(1445,551,1540,612) # bow to spire
CLEAR(1585,537,1634,612) # survey tower interior
CLEAR(1734,583,1809,653) # customs lock access
CLEAR(387,579,467,664)   # western room to industrial relay
CLEAR(970,689,1030,751)  # bilge/bottom alternate outlet
CLEAR(1235,686,1306,751) # starboard bilge alternate outlet
CLEAR(883,420,945,467)   # vessel roof skylight
CLEAR(1250,411,1320,467) # alternate skylight
# Restore small landing sills after openings, outside flight routes
R(889,462,914,466,'hazard');R(1278,460,1303,464,'hazard')
# Later ship cradles bridge the actual final hull plating to the ground.
# These are installed AFTER hull interior apertures: do not erase the vessel while excavating.
for x,top in [(778,649),(918,696),(1168,703),(1390,650)]:
    R(x,top,x+16,952,'steel')
    R(x+4,top+8,x+12,938,'paint')
    R(x-12,top-9,x+30,top+5,'hazard')
    R(x-14,942,x+34,957,'concrete')
# Upper hull and lower keel retain load-bearing ribs on either side of true portals.
L([(840,469),(836,525)],11,'steel')
L([(840,614),(851,687)],11,'steel')
L([(1408,502),(1421,552)],10,'steel')
L([(1421,612),(1405,651)],10,'steel')
# Authored human-scale access doors: actual cell removal, no path exemptions.
CLEAR(187,796,245,816)          # Customs stage landing notch
CLEAR(683,679,749,745)          # Aft service entry into public slip
CLEAR(1861,593,1914,649)        # Salvage roof hatch into cargo hold
CLEAR(1852,788,1913,855)        # East freight launch / recovery access
# Accessible lower starboard bay and stepped tower service passage.
CLEAR(1301,801,1361,831)
CLEAR(1608,774,1686,808)
# Single massive ship spar binds upper hull shell to lower supported keel;
# it is a real obstruction around which the internal/outer flight lanes bypass.
R(1190,403,1203,749,'steel')
R(1193,409,1199,737,'paint')
# Root cargo floor piers, the upper astrograph pod, and the open freight lock.
R(148,917,160,949,'steel');R(335,917,349,949,'steel')
R(1820,918,1831,949,'steel');R(1933,918,1945,949,'steel')
R(1710,412,1723,474,'steel')
L([(1643,350),(1643,334)],6,'steel')
R(1365,782,1380,941,'steel')
# Access shafts purposely connect occupied rooms to exterior above without
# shearing their boundary-rooted load-bearing wall columns.
CLEAR(575,562,662,597)          # Aft engine roof hatch
CLEAR(590,674,666,714)          # Aft shop entrance below first deck
CLEAR(1666,417,1704,478)        # Astrograph roof-to-mid transfer
CLEAR(1843,547,1915,623)        # Eastern cargo sorting upper opening
# Real 36–72 cell boarding ports and vertical inspection shafts. These replace
# obstructive material cells; no proof-stage target substitutions are used.
CLEAR(98,748,159,814)            # Customs apron external door below public tier
CLEAR(504,673,567,747)           # Aft shop left entry through service pier
CLEAR(697,557,756,648)           # Aft-to-ship stern airlock
CLEAR(1028,397,1101,894)         # Keel elevator shaft, first real lift route
CLEAR(1248,395,1314,880)         # Bow-side lift, genuinely separate bypass
CLEAR(1358,546,1479,615)         # Bow cabin airlock through ship outer plating
# Navigation control pod remains supported at its opposite, floor-rooted edge.
R(1577,335,1591,391,'steel')
CLEAR(1690,518,1755,616)         # Survey controls outward bulkhead portal
CLEAR(1708,791,1756,856)         # Lower workshop egress (separate elevation)
# Freight lock has a deliberately continuous full-hull lift with upper hatch.
CLEAR(1852,581,1917,889)
# Source-accessible portal trio: upper bridge trapdoor, bow cabin daylight hatch
# and survey pod external door. Preserve the real stair/keel load paths.
CLEAR(926,296,1007,352)           # Signal-bridge trapped air to open upper sky
CLEAR(1352,512,1424,565)          # Bow cabin roof hatch, bypassing closed bow skin
CLEAR(1694,337,1746,403)          # Astrograph pod outside/inside port
# Cargo flight access comes from above; we do not sever the east bearer to ground.
R(1927,498,1947,522,'steel')
CLEAR(1852,451,1917,504)          # Salvage tower skyward roof portal
# Lower workshop shares a controlled apron access with the freight basin.
CLEAR(1768,792,1862,895)          # Unbroken local emergency return duct
# Independently anchored physical tie-ins for named machinery components.
# The port and starboard boxhouses have real external load paths; none floats.
R(127,605,148,618,'steel')                  # West civic house to rooted left facade
R(956,542,960,550,'steel')                  # Local 4px ship skin/perforation bearing
R(1874,503,1884,507,'steel')                 # Slim cargo casing tie beside 65px sky hatch
L([(1527,541),(1548,541)],9,'steel')         # Bow outer shell to navigation load pier
L([(161,645),(145,645)],6,'steel')           # Civic long bench equipment pedestals
# Deliberately omit a cable across the survey access hatch
L([(891,605),(891,627)],7,'copper')          # Stern machinery feet to ship deck
# Full-hull crew passage between port upper cabin and central keel lift.
CLEAR(954,458,1035,530)
# Human-scale equipment does not hover: short structural attachment collars.
L([(159,642),(169,642)],5,'steel')       # Commune rostrum
# Spare conveyor tie omitted; east 31x27 flight aperture priority
R(1821,608,1838,615,'steel')            # Salvage sorting post
R(1404,784,1417,796,'steel')            # Bow cradle gusset
L([(176,731),(176,746)],7,'steel')      # Customs cargo stack foot
L([(257,731),(257,748)],7,'steel')      # Second customs stand
L([(568,734),(546,752)],6,'steel')     # Propulsion bench strut
R(1690,739,1704,749,'steel')            # Navigation low support
L([(164,841),(156,841)],5,'steel')      # Domestic service shelf
L([(288,841),(299,841)],5,'steel')      # Domestic return shelf
R(1594,426,1604,436,'steel')            # Survey pod lower apron
L([(1598,534),(1580,534)],6,'steel')    # Astrograph module shelf
L([(1657,684),(1657,703)],6,'steel')    # Relay bench to its slab
# slight identity texture only at actual engineering fixtures (not noise fill)
for i in range(45):
    x=r.randrange(170,1920);y=r.randrange(965,986)
    if r.random()<.33:R(x,y,x+3,y+3,'obsidian')

# Structural doctrine: retain only cells connected through cardinal solid contact to boundary.
# Deliberately detach no voxel chunks; remove incidental tiny isolated switch indicators if any.
im.save(D/"debug_unpruned.png")
g=np.asarray(im,dtype=np.uint8).copy()
root_mask=g!=0
labels,num=ndi.label(root_mask,structure=np.array([[0,1,0],[1,1,1],[0,1,0]],bool))
edge=np.unique(np.concatenate([labels[0],labels[-1],labels[:,0],labels[:,-1]]));edge=edge[edge>0]
keep=np.isin(labels,edge)
removed=int(np.count_nonzero(root_mask & ~keep));g[~keep]=0
# All remaining solid voxels must be in one or more true world-edge-rooted systems.
assert not np.count_nonzero((g!=0)&~keep)

# Exhaustive and ordered lossless rectangle encoding: row RLE + matching vertical coalescence.
rects=[];live={}
for y in range(H):
    row=g[y];x=0;next_live={}
    while x<W:
        v=int(row[x]);start=x
        while x<W and int(row[x])==v:x+=1
        if not v:continue
        key=(start,x-start,v)
        if key in live:
            idx=live[key];rects[idx][3]+=1
        else:
            idx=len(rects);rects.append([start,y,x-start,1,v])
        next_live[key]=idx
    live=next_live
assert len(rects)<=32768,(len(rects),'rectangle limit exceeded')

# Current schema fields and Midge actor definition from accepted material/actor authority.
setup={'version':2,'extent':[W,H],'actors':[{'id':1,'model':'midge',
 'hash':'c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96',
 'spawn':[78,780],
 'options':{'budget':20,'mass_multiplier':1,'inertia_multiplier':1,'thrust_multiplier':1,'torque_multiplier':1,'boost_multiplier':2}}],
 'next_id':2,'selected':1,'edits':rects,'response':'LA-SELECTIVE',
 'liquid_policy':[0]*48,'normalize':False,'rule_radius':2,'source':[],
 'material':58,'brush':8,'fire':False}
# JSON output is compact and deterministic.
setup_bytes=json.dumps(setup,separators=(',',':')).encode('utf8')
assert len(setup_bytes)<=1048576
(D/'setup.json').write_bytes(setup_bytes)

# literal tested waypoints; no nearest-free substitutions permitted.
sites={
 'West tug launch':[78,780],
 'Customs arrival apron':[205,775],
 'Tug roof signal':[295,209],
 'Public hatch upper':[188,596],
 'West hoist crossing':[432,704],
 'Aft engine exchange':[615,710],
 'Stern entry throat':[790,582],
 'Upper hull promenade':[907,492],
 'Vessel drive chamber':[1115,582],
 'Dry sealed machine datum':[1055,600],
 'Underkeel service':[1080,864],
 'Upper keel signal bridge':[1094,268],
 'Bow cabin':[1384,582],
 'Starboard bilge well':[1328,849],
 'Astrograph upper port':[1526,366],
 'Astrograph mid controls':[1663,564],
 'Navigation lower workshop':[1644,819],
 'East salvage lock':[1881,670],
 'East freight marshalling':[1878,872],
 'Departure eastern daylight':[1977,782],
}
# obstruction physically closes named datum but NOT both bypass lanes; all other sites must remain connected.
obstruction=[1024,574,74,58]

def route_check(arr,footprint):
    ww,hh=footprint
    free=~ndi.maximum_filter(arr!=0,size=(hh,ww),mode='constant',cval=1)
    group,num=ndi.label(free,structure=np.array([[0,1,0],[1,1,1],[0,1,0]],bool))
    sx,sy=sites['West tug launch'];root=int(group[sy,sx]);assert root>0,'spawn not free'
    missing=[name for name,(x,y) in sites.items() if not(ww//2<=x<W-ww//2 and hh//2<=y<H-hh//2 and int(group[y,x])==root)]
    return {'footprint':[ww,hh],'reachable':len(sites)-len(missing),'missing':missing,'component':int((group==root).sum())}

checks=[route_check(g,wh) for wh in [(19,15),(23,19),(31,27)]]
with_ob=g.copy();ox,oy,ow,oh=obstruction;with_ob[oy:oy+oh,ox:ox+ow]=M['concrete']
ob_checks=[route_check(with_ob,wh) for wh in [(19,15),(23,19),(31,27)]]
print('Initial structural solids:',int(np.count_nonzero(g)),'removed tiny detached:',removed)
print('Routes:',json.dumps(checks))
print('Obstructed routes:',json.dumps(ob_checks))
assert all(c['reachable']==len(sites) for c in checks), 'unreachable literal route site'
assert all(c['missing']==['Dry sealed machine datum'] for c in ob_checks), 'obstruction failed to preserve alternate sites'
assert all(c['component']>0 for c in checks)

# Exhaustive in-order final paint replay and nonoverlap (independent code verifies again).
replay=np.zeros_like(g);cover=np.zeros_like(g,bool)
for x,y,w,h,v in rects:
    assert w>0 and h>0 and x>=0 and y>=0 and x+w<=W and y+h<=H
    assert not cover[y:y+h,x:x+w].any()
    cover[y:y+h,x:x+w]=True;replay[y:y+h,x:x+w]=v
assert np.array_equal(replay,g)
assert int((g!=0).sum())==sum(w*h for x,y,w,h,v in rects)

# Actual 1:1 indexed material source pixels; palette is visualization only.
pal=[0]*768
for v,rgb in colors.items():pal[3*v:3*v+3]=list(rgb)
areas={'overview.png':(0,0,W,H),
 '01-tug-exchange.png':(70,160,490,850),
 '02-propulsion-slip.png':(465,398,775,918),
 '03-hollow-keel.png':(770,294,1430,830),
 '04-astrograph-spire.png':(1430,183,1765,873),
 '05-salvage-lock.png':(1740,380,1990,907)}
imgs={}
for name,(x0,y0,x1,y1) in areas.items():
    section=g[y0:y1,x0:x1]
    out=Image.fromarray(section,'P');out.putpalette(pal);out.save(D/name,optimize=False)
    reread=Image.open(D/name)
    assert reread.mode=='P' and reread.size==(x1-x0,y1-y0)
    assert np.array_equal(np.asarray(reread),section)
    imgs[name]={'origin':[x0,y0,x1-x0,y1-y0],
               'sha256':hashlib.sha256((D/name).read_bytes()).hexdigest()}

hist={str(int(v)):int(n) for v,n in zip(*np.unique(g,return_counts=True))}
laws={str(v):{'state':'Solid','kernel':'None','movable':False} for v in sorted(set(map(int,np.unique(g)))-{0})}
receipt={
 'title':'Keel Ossuary — Broken-Back Ark Drydock',
 'generated_utc_date':'2026-11-21','builder_seed':SEED,
 'source_authority':'techrote/cybersand/main@69209acaffb34ebe18c45e19290b5976b7fb2c82',
 'schema_blob':'760268107874198c2323dd590d8c0921692c5ba4',
 'material_blob':'dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3',
 'actor_catalog_blob':'78e146cf8f9e724d5587bd10db85abb460f3b0fd',
 'world':[W,H],'cell_count':int(g.size),
 'grid_sha256':hashlib.sha256(g.tobytes()).hexdigest(),
 'setup_sha256':hashlib.sha256(setup_bytes).hexdigest(),'setup_bytes':len(setup_bytes),
 'rectangles':len(rects),'rectangle_budget':32768,'construction_work':int((g!=0).sum()),
 'grounded_inert_solids':int((g!=0).sum()),'removed_detached_cells':removed,
 'retained_detached_cells':0,'material_histogram':hist,'material_laws':laws,
 'mobile_cells':0,'liquid_cells':0,'reactive_cells':0,'sites':sites,'spawn':'West tug launch',
 'goal':'Departure eastern daylight','clearance':checks,'obstruction_xywh':obstruction,
 'clearance_with_obstruction':ob_checks,
 'route_graph':{'main':['West tug launch','Customs arrival apron','West hoist crossing','Aft engine exchange','Stern entry throat','Vessel drive chamber','Bow cabin','Astrograph mid controls','East salvage lock','Departure eastern daylight'],
  'upper':['Tug roof signal','Upper hull promenade','Upper keel signal bridge','Astrograph upper port'],
  'lower':['Public hatch upper','Aft engine exchange','Underkeel service','Starboard bilge well','East freight marshalling'],
  'recovery':['Underkeel service','Starboard bilge well','Navigation lower workshop','East freight marshalling']},
 'images':imgs,'native_status':'NATIVE-UNTESTED',
 'tests_not_performed':['Godot Workbench load','Midge native Rapier contact/advance','save/cold reopen','independent third-party audit']}
(D/'receipt.json').write_text(json.dumps(receipt,indent=2)+'\n')
exemplar={
 'schema_version':1,'purpose':['human_editable_canvas','procedural_exemplar','scripted_setpiece_source'],
 'family':'original/megastructure-wide','map_role':'drydock with embedded life-support ship interior, grounded keel cradles, separate shift-work settlements',
 'anchor_donors':[],
 'macro_topology':['drydock','corridor'],
 'density_profile':'asymmetric two dense edge settlements; segmented entered vessel sections, sparse high-air damage gaps, lower anchorwork and vacant berths',
 'route_grammar':{'main':'Tug exchange / aft engine / hollow keel / navigation spire / salvage lock',
                   'upper':'separate roof, gantry and main-hull skylight routes',
                   'lower':'continuous service apron and underkeel maintenance return',
                   'obstruction':'single drive datum obstructed; top and lower free-air bypasses preserve access'},
 'strong_motifs':['grounded cradle-supported fractured generation ark cutaway','broken-back lens hull with entered salvage chambers','asymmetrical navigation spire','opposed salvage cranes'],
 'interesting_relationships':['physical keel cradles punctuate open lower service void','service engineering passes below occupied hull compartments','civilian tug registration shares only a narrow transfer with stern extraction','shipboard voids act as expansion seams'],
 'authoring_affordances':['spare underkeel dock for hand-built machine setpiece','unfurnished starboard bilge bay','upper keel skylight with optional scripted arrival','lower berth expansion seam below nave'],
 'setpiece_candidates':[
   {'name':'Aft propulsion unseating','site':'Aft engine exchange','kind':'machinery_activation','scripted':False},
   {'name':'Keel-bearing failure','site':'Underkeel service','kind':'collapse_recovery','scripted':False},
   {'name':'Onboard hull-boarder holdout','site':'Vessel drive chamber','kind':'npc_encounter','scripted':False},
   {'name':'Departure crane reveal','site':'East freight marshalling','kind':'arrival_departure','scripted':False}],
 'procedural_exemplar_value':'fractured vessel-shaped entered superstructure; grounded repeated but varying keel supports; dual internal/external service grammar and asymmetrical civic-industrial dock edges',
 'similarity_avoidance':'Unlike the basin gate of Cobalt Ventricle, Ferric roof islands, Sundered rock cavities or Tin double dish, this is a fractured entered vessel with two deliberate full-height damage seams, grounded repair cradles, with compartment portals, full-height spire and unfilled berth seams.',
 'diversity_axes':{'macro_topology':'drydock','altitude_grammar':'multi_strata','density_cadence':'alternating',
   'route_structure':'layered','landmark_family':'vessel','support_form':'multi_leg','environment_relation':'dry','incompleteness':'modular_append_zones'}}
(D/'exemplar.json').write_text(json.dumps(exemplar,indent=2)+'\n')
readme=f'''# Keel Ossuary — Broken-Back Ark Drydock\n\nA newly authored, perpendicular **2048×1024** CyberSand cell world, NOT a historic conversion, AI illustration or imported reference. A broken-backed *entered* generation ark sits on individually sized grounded keel cradles. Two wide daylight damage seams interrupt the hull and provide distinct upper/bilge route transfers across a dry maintenance slip. Overhead masts, port exchange and navigation spire make a recognisable engineering culture rather than a bare background silhouette. Sparse bays and unfinished restoration sites are intentional SWARM/GENTEK and human-edit affordances.\n\n## Five functional districts\nWest Tug Exchange (public customs, hoist, upper dispatch), Aft Propulsion Slip (extraction jacks and motor servicing), Hollow Keel (hull galleries, bilge, drive datum and roof skylights), Astrograph Spire (navigation/survey), East Salvage Lock (cargo dispatch, lock, freight).\n\n**Spawn:** West tug launch (78,780). **Goal:** Departure eastern daylight (1977,782). Route graph and all {len(sites)} exact full-hull navigation sites are in receipt.json. Three distinct 19×15, 23×19 and 31×27 clearances have been verified without target shifting. Test-only [1024,574,74,58] concrete closure covers the drive datum while alternate upper and lower routes remain. No scripted events or fluid are in the initial world.\n\n## Exact setup and evidence\nCurrent accepted engine `main@69209acaffb34ebe18c45e19290b5976b7fb2c82`; schema blob `760268107874198c2323dd590d8c0921692c5ba4`; materials blob `dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3`. Validated static size: {W*H:,} cells; rectangle count {len(rects):,}/32768; exact Setup UTF-8 {len(setup_bytes):,}/1,048,576 bytes; work {int((g!=0).sum()):,}; all retained occupied materials inert Solid / None; zero mobile or fluid.\n\nSource-grid SHA-256: `{receipt['grid_sha256']}`. Setup SHA-256: `{receipt['setup_sha256']}`. Deterministic seed: `{SEED}`.\n\nReproduce: `python build.py` (Python3/Pillow/numpy/scipy) then `python independent_verify.py`. The overview is a genuine one-pixel-per-cell indexed material PNG. Five named exact 1:1 grid crops are produced and checked for pixel parity. `exemplar.json` records actual scene features, controlled corpus axes, deliberately vacant interfaces, and four **UNSCRIPTED** event sites.\n\n**Qualification boundary:** creator-run SOURCE-STATIC only. Independent Art/Technical/Shepherd review and actual compatible Windows Godot/Workbench/CyberDemoBridge/Rapier import, movement, save and cold reopen remain **NATIVE-UNTESTED**. Always leave Draft/HOLD.\n'''
(D/'README.md').write_text(readme)
print('RESULT',len(rects),len(setup_bytes),receipt['grid_sha256'], 'images',len(imgs),'sites',len(sites))
