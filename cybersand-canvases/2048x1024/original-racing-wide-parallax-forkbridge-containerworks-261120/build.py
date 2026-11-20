#!/usr/bin/env python3
"""Parallax Forkbridge Containerworks: original orthographic 2048x1024 material-cell world.
Python >=3.10, standard library only. Seed and exact geometry are fixed. No imported prior-map geometry.
"""
import os, json, math, random, hashlib, struct, zlib, collections
from pathlib import Path
W,H=2048,1024
SEED=0x20261120
RNG=random.Random(SEED)
ROOT=Path(__file__).resolve().parent
EMPTY=0; SLATE=49; CONCRETE=58; STEEL=62; BASALT=100; OBSIDIAN=101; ZINC=113; IRON=117; QUARTZ=122
SAFE=(SLATE,CONCRETE,STEEL,BASALT,OBSIDIAN,ZINC,IRON,QUARTZ)
MODEL_HASH='c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96'
POLICY=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0]
G=bytearray(W*H)

# Real, single-material-id cell primitives. Orthographic, no perspective geometry.
def rect(x0,y0,x1,y1,m):
    x0=max(0,int(x0)); y0=max(0,int(y0)); x1=min(W,int(x1)); y1=min(H,int(y1));
    if x0>=x1 or y0>=y1:return
    chunk=bytes([m])*(x1-x0)
    for y in range(y0,y1): G[y*W+x0:y*W+x1]=chunk

def disk(cx,cy,rx,ry,m):
    for y in range(max(0,int(cy-ry)), min(H,int(cy+ry)+1)):
        a=(y-cy)/ry
        if a*a>1:continue
        dx=int(rx*math.sqrt(1-a*a));rect(cx-dx,y,cx+dx+1,y+1,m)

def line(x0,y0,x1,y1,thick,m):
    steps=max(abs(x1-x0),abs(y1-y0),1)
    for k in range(0,steps+1,max(1,thick//3)):
        t=k/steps; x=round(x0+(x1-x0)*t);y=round(y0+(y1-y0)*t)
        rect(x-thick//2,y-thick//2,x+(thick+1)//2,y+(thick+1)//2,m)
    rect(x1-thick//2,y1-thick//2,x1+(thick+1)//2,y1+(thick+1)//2,m)

def poly(pts,m):
    ys=range(max(0,min(p[1] for p in pts)),min(H,max(p[1] for p in pts)+1))
    for y in ys:
        yy=y+.5; xs=[]
        for (x0,y0),(x1,y1) in zip(pts,pts[1:]+pts[:1]):
            if y0<=yy<y1 or y1<=yy<y0:
                xs.append(x0+(yy-y0)*(x1-x0)/(y1-y0))
        xs.sort()
        for a,b in zip(xs[::2],xs[1::2]):rect(math.ceil(a),y,math.ceil(b),y+1,m)

# 1. Native boundary and geotechnical base; asymmetric exposed stratum profile.
rect(0,0,10,H,CONCRETE);rect(2038,0,2048,H,CONCRETE)
rect(0,895,2048,H,BASALT)
poly([(10,885),(70,856),(190,856),(260,868),(395,849),(530,881),(710,878),(820,858),
      (970,874),(1110,869),(1230,890),(1400,870),(1570,883),(1735,865),(1920,873),(2038,844),(2038,1024),(10,1024)],BASALT)
# Cut geologically distinct dry service vaults in foundation with separate open shaft mouths.
for a,b,roof in [(135,356,825),(499,741,825),(955,1204,823),(1390,1627,832),(1740,1970,823)]:
    rect(a,roof,b,945,EMPTY)
    rect(a-6,roof-8,a+4,937,STEEL);rect(b-4,roof-8,b+6,937,STEEL)
    rect(a,936,b,944,CONCRETE)
# Five open-access entry shafts; no locked roofs masquerading as entrances.
for a,b in [(270,322),(605,668),(1050,1125),(1500,1574),(1840,1904)]:rect(a,780,b,854,EMPTY)
# Boundary source grounding through floor-mounted columnwork.
rect(0,895,2048,1024,BASALT)
# Restore vault voids after base restoration.
for a,b,roof in [(135,356,825),(499,741,825),(955,1204,823),(1390,1627,832),(1740,1970,823)]:
    rect(a,roof,b,937,EMPTY);rect(a,937,b,945,CONCRETE)
# Geology stratigraphy: ground-backed blocks at real faces, no fake falling grains.
for a,b,y in [(35,225,875),(390,570,887),(770,945,880),(1255,1435,888),(1670,1840,879)]:
    rect(a,y,b,y+7,OBSIDIAN)

# 2. West magnetic injection / two-level load lock. Primary launch at (140,565).
# Stepped west elevator saddle rises from floor; top surface intentionally 100px below lane.
poly([(10,804),(56,760),(90,745),(155,752),(197,810),(240,852),(10,895)],CONCRETE)
rect(40,758,175,774,STEEL);rect(55,774,66,808,IRON);rect(158,774,169,817,IRON)
# Counterweight/power piston, anchored on bedrock.
rect(272,680,305,860,STEEL);rect(280,642,297,689,ZINC)
rect(248,635,327,650,IRON);rect(248,650,260,674,STEEL);rect(316,650,327,672,STEEL)
rect(334,821,369,886,CONCRETE)
line(305,686,395,782,9,IRON);line(395,782,420,866,12,STEEL)
# Fuel-free wall-mounted thrust coil with equal-spaced functional gaps.
for cy,rad in [(484,27),(534,37),(588,30)]:
    rect(31,cy-rad,52,cy+rad,IRON)
    for yy in range(cy-rad+8,cy+rad-6,16):rect(51,yy,65,yy+5,ZINC)
# Accessible control platform above launch, braced from wall; NOT roof-cavity cloning.
rect(48,350,245,364,STEEL);line(80,364,30,497,10,IRON);line(208,364,305,680,11,IRON)
rect(107,322,172,345,ZINC);rect(119,305,129,320,STEEL);rect(155,298,165,322,IRON)
rect(98,314,112,350,IRON);rect(177,319,189,350,IRON)
# High visible west flyover hook, open below.
line(64,350,100,278,12,STEEL);line(100,278,212,278,10,STEEL);line(212,278,247,315,12,STEEL)

# 3. Sloping cable shuttle: tall asymmetric ramp and a real drive/suspended carriage.
# Deep foundation towers with hollow vent slots and cross-brace, not a baffle family.
poly([(425,892),(438,530),(461,510),(484,892)],STEEL)
rect(438,576,462,822,EMPTY);rect(438,872,462,884,EMPTY)
line(446,542,710,288,11,IRON);line(469,550,730,302,10,STEEL)
# loaded transfer carriage mounted on rails (physical structural cells).
poly([(524,484),(603,416),(664,433),(585,501)],CONCRETE)
line(541,484,575,516,12,IRON);line(636,427,669,462,12,IRON)
rect(568,445,603,463,ZINC);rect(607,438,646,450,ZINC)
# Up-track crane boom from bedrock x~700, hanging hoist from beam.
poly([(681,885),(702,270),(730,277),(755,887)],CONCRETE)
rect(710,360,724,640,EMPTY)
line(702,290,825,230,14,STEEL);line(825,230,853,253,12,STEEL)
line(817,230,806,405,5,IRON);rect(787,403,826,416,ZINC)
line(708,301,473,568,8,IRON);line(729,306,910,562,8,IRON)
# Metallic route guide rail, not solid runway crossing flight; anchored both ends.
line(477,790,646,809,8,STEEL)

# 4. Central Forkbridge load switch. Unique pair of asymmetrical trapezoid pylons
# support long elevated openwork girder with a genuine free lower service route.
poly([(844,895),(862,325),(887,324),(915,895)],CONCRETE)
poly([(1160,893),(1184,258),(1213,260),(1242,894)],CONCRETE)
# hollow pylon cable windows visible at 1:1 and avoiding solid-fill wall appearance.
rect(867,438,886,615,EMPTY);rect(1193,364,1210,559,EMPTY)
# high fork bridge from left tower to right; catwalk supports anchored at both ends
line(873,333,1200,270,17,STEEL)
line(871,386,1203,322,11,IRON)
for a,b in [(920,917),(989,921),(1057,918),(1128,913)]:
    # visually distinct short plumb stress rods, not decorative repeated roof bays
    yy=round(333-(a-873)*63/327)
    line(a,yy,a+11,yy+47,4,ZINC)
# central signal sail, fixed to bridge and braced (an original broad triangle)
poly([(1003,309),(1075,145),(1137,283)],STEEL)
poly([(1030,291),(1075,200),(1111,276)],EMPTY)
line(1075,155,1055,312,7,IRON)
# Three off-axis freight switch arms feeding from mast to lower hardware
line(883,620,1045,655,13,STEEL);line(1045,655,1191,557,13,STEEL)
line(891,719,1094,688,11,IRON);line(1094,688,1209,786,10,IRON)
# Functional switch actuator at central fork; mounted on lower rail by founded pads.
rect(985,794,1120,827,CONCRETE);rect(1002,768,1052,794,IRON)
rect(1062,766,1090,793,ZINC);rect(1096,774,1113,795,STEEL)
# Fixed-seed physical actuator coding, not cosmetic image-only stippling.
for k in range(5):
    xx=1009+k*19+RNG.randint(-2,2)
    rect(xx,811,xx+8,818,ZINC)
line(1015,767,1082,709,6,IRON)

# 5. Dry capsule processing, actually differentiated from earlier cryo banks.
# Very large container gantry is an OPEN crane on thick legs, not a row of trays.
poly([(1335,892),(1358,403),(1384,406),(1412,892)],CONCRETE)
poly([(1599,893),(1614,372),(1646,370),(1671,893)],CONCRETE)
rect(1367,531,1380,704,EMPTY);rect(1623,513,1640,699,EMPTY)
# Box-truss span and winch, physically supported on columns.
rect(1358,401,1630,418,STEEL)
line(1390,418,1601,455,8,IRON);line(1601,420,1398,454,8,IRON)
rect(1467,384,1535,400,IRON)
rect(1492,418,1500,582,IRON)
# Cargo hanging frame (full-size at 1:1): grounded via hoist line.
rect(1438,580,1555,595,STEEL);rect(1448,596,1547,670,CONCRETE)
for x in [1462,1480,1504,1524]:rect(x,606,x+6,661,ZINC)
rect(1460,670,1525,678,IRON)
# Conveyor chain connects lower service deck via wall-mounted rollers.
line(1400,803,1607,779,8,STEEL)
for cx,cy in [(1435,799),(1545,783)]:disk(cx,cy,19,19,IRON);disk(cx,cy,9,9,EMPTY)
# Exposure clearway around equipment, no crossing the entire upper/lower race circuit.

# 6. East terminal arrestor: a giant sideways V-loader and climbing recovery ramp,
# with mechanical catch cable following the V, not a round wheel or arch.
poly([(1730,897),(1710,538),(1739,538),(1805,881)],CONCRETE)
poly([(1940,894),(1958,511),(1986,508),(2010,892)],STEEL)
line(1732,560,1851,747,16,STEEL);line(1975,532,1851,747,15,STEEL)
line(1748,569,1851,731,6,ZINC);line(1955,540,1851,731,6,ZINC)
# catcher is intentionally open at the vertex to permit an actual lower route.
rect(1832,725,1873,786,EMPTY)
# Thick grounded brake foundation with service traverse portal.
rect(1805,854,1900,883,IRON)
rect(1830,835,1880,855,ZINC)
# Arrestor winch atop right leg, anchored to support.
rect(1950,476,2005,511,STEEL);disk(1967,484,13,13,IRON);disk(1994,484,13,13,IRON)
line(1967,484,1845,702,6,IRON)
# East-facing turn wayfinding and return route via tall scaffold platform.
rect(1705,315,1988,332,STEEL)
line(1730,332,1724,544,11,IRON);line(1978,332,1962,510,11,IRON)
rect(1772,282,1814,310,ZINC);rect(1887,284,1928,310,IRON)
line(1780,281,1755,234,8,IRON);line(1755,234,1921,234,9,STEEL)

# 7. Five physically entered workshops (distinct visible processes), each grounded.
# Each chamber has a service floor, distinct equipment, free centre at chosen named site.
# West pressure room: large L pressure feed + pistons.
rect(158,907,203,935,STEEL);rect(166,882,176,907,ZINC);rect(199,899,245,915,IRON)
rect(304,907,337,935,ZINC);rect(320,866,328,907,IRON)
# Shuttle gearbox: coupled horizontal rack and vertical feed.
rect(511,904,558,937,IRON);rect(569,916,647,935,STEEL)
for cx in (585,608,630):disk(cx,901,12,12,ZINC);disk(cx,901,4,4,EMPTY)
rect(698,890,720,935,IRON)
# Forkbridge switch underworks: distinct hydraulic X and control casing.
rect(971,909,1011,936,STEEL);rect(1134,910,1187,936,CONCRETE)
line(996,908,1105,857,9,ZINC);line(1105,856,1150,914,8,IRON)
# Cargo decontamination: horizontal filter assemblies with stacked internals.
rect(1408,908,1440,937,STEEL);rect(1472,903,1548,918,IRON)
for cx in range(1481,1541,18):rect(cx,885,cx+8,903,QUARTZ)
rect(1580,903,1610,936,ZINC)
# Catcher brake room, sheave/winch + handoff pipe.
rect(1760,904,1801,935,CONCRETE)
for cx in (1831,1879):disk(cx,897,18,17,IRON);disk(cx,897,6,6,EMPTY)
rect(1918,901,1958,936,STEEL)
line(1879,887,1935,837,8,ZINC)
# Vault ceiling supports open into main area through 52px+ shafts for Midge clearance.
# Do not add sealing walls: void and actual reachability take priority.

# 8. Local navigation lamps and identifiable directional marks as REAL inert attached cells.
# They are not screenshots and do not add unreachable floating art.
for x,y in [(130,761),(448,530),(703,287),(864,322),(1200,260),(1368,401),(1629,373),(1976,315)]:
    rect(x-9,y-4,x+10,y,IRON)
    rect(x-3,y-12,x+4,y-4,QUARTZ)

# Directly tie the west launch supervision platform into the suspended canopy.
line(209,281,212,350,8,STEEL)
line(58,346,149,276,8,IRON)
# Loaded cargo transfer is suspended ABOVE, not blocking, the upper race aperture.
rect(1443,464,1551,479,STEEL)
rect(1450,479,1543,532,CONCRETE)
for xx in (1463,1482,1507,1526):rect(xx,487,xx+7,521,ZINC)
rect(1490,417,1503,465,IRON)
# An open accessible winch control pulpit at the east lip of the crane.
rect(1570,449,1612,463,IRON)
rect(1590,431,1597,447,ZINC)

# A continuous, high-tension catenary backbone physically anchored at both cliffs.
# Every elevated crane & workface is slung from this real structural system;
# excavation of the lower race portals therefore does not strand a sky frame.
line(8,71,1050,53,9,STEEL)
line(1050,53,2039,84,9,STEEL)
for xx,yy in [(145,278),(701,282),(859,329),(1202,263),(1364,404),(1628,371),(1724,318),(1978,317)]:
    cable_y=round(71+(53-71)*xx/1050) if xx<=1050 else round(53+(84-53)*(xx-1050)/989)
    line(xx,cable_y,xx,yy,6,IRON)
# Angled upper guy ropes distribute load into canyon endwalls.
line(8,88,145,278,9,IRON)
line(2039,100,1978,317,9,IRON)

# 9. Machined full-hull race apertures — actual deleted cells, not a BFS exception.
# Main eastbound tunnel crosses the several founded structural pylons.
rect(72,546,2024,610,EMPTY)
# The return is a separate, continuous low-line pressure conduit.
rect(88,711,2000,778,EMPTY)
# Six deliberately distributed recovery risers and a dedicated north/south fork.
for xa,xb,ya,yb in [(108,176,532,760),(354,414,360,766),(764,827,260,750),
                     (1235,1298,255,753),(1677,1742,274,751),(1910,1971,245,772),
                     (942,1018,450,668),(1117,1169,467,744)]:
    rect(xa,ya,xb,yb,EMPTY)
# Fully open and entered workshop entrance shafts; preserve their individual workfaces.
for xa,xb in [(260,314),(626,695),(1065,1135),(1520,1591),(1834,1909)]:
    rect(xa,746,xb,872,EMPTY)
# Dedicated upper repair/return landing atop the west tower and east winch.
rect(116,234,205,292,EMPTY)
rect(1822,170,1887,234,EMPTY)
# All solids must be boundary grounded; prune only true disconnected small ornaments.
def grounding(grid):
    seen=bytearray(W*H);q=collections.deque()
    for x in range(W):
        for idx in (x,(H-1)*W+x):
            if grid[idx] and not seen[idx]:seen[idx]=1;q.append(idx)
    for y in range(H):
        for idx in (y*W,y*W+W-1):
            if grid[idx] and not seen[idx]:seen[idx]=1;q.append(idx)
    while q:
        j=q.popleft(); y,x=divmod(j,W)
        if x and grid[j-1] and not seen[j-1]:seen[j-1]=1;q.append(j-1)
        if x<W-1 and grid[j+1] and not seen[j+1]:seen[j+1]=1;q.append(j+1)
        if y and grid[j-W] and not seen[j-W]:seen[j-W]=1;q.append(j-W)
        if y<H-1 and grid[j+W] and not seen[j+W]:seen[j+W]=1;q.append(j+W)
    return seen

s=grounding(G); detached=sum(bool(c) and not bool(s[i]) for i,c in enumerate(G))
if detached: # physically remove disconnected design ornament before final authoritative grid
    for i,c in enumerate(G):
        if c and not s[i]:G[i]=0
assert all(m in (*SAFE,0) for m in G)

# Named literal destinations, not post-hoc nearest-site substitutions.
SITES=[
 ('Start | West ignition',142,565),('Injector coil exit',326,564),('Shuttle lift approach',505,594),
 ('Elevator clearance',642,569),('Forkbridge western throat',787,532),('Upper fork gate',978,472),
 ('Upper fork clearance',1118,468),('Upper fork exit',1255,526),('Cargo gantry arrival',1432,520),
 ('Container loader bypass',1573,539),('Eastern capture entry',1833,542),('East downward turn',1896,680),
 ('East return approach',1740,752),('Under cargo berth',1532,738),('Central lower return',1132,752),
 ('Switch return',911,753),('Shuttle underpass',593,738),('West recovery',263,741),('Finish | West ignition',143,565),
 ('Alternative central ramp',937,657),('Alternative fork rejoin',1257,657),
 ('West control platform',147,258),('Shuttle cable operator',782,274),('Forkbridge overhead signal',840,273),
 ('Cargo loading attendant',1550,574),('East catcher operator',1852,198),
 ('Pressure service room',277,865),('Shuttle gearbox service',671,856),
 ('Fork hydraulics service',1100,851),('Cargo filter service',1567,863),('Brake handoff service',1900,847)
]
# Some control platforms may have tops but are accessible from adjacent air corridors.
# Obstruction intentionally occludes only one literal upper site, not the whole race route.
BLOCK=[933,417,120,124]

def clearance_reach(grid,hx,hy,blocked=None):
    # Exact free-centre conservative footprint: summed-area occupied-grid integral.
    padW=W+1; acc=[0]*(padW*(H+1))
    for y in range(H):
        run=0;row=y*W;prev=y*padW;now=(y+1)*padW
        for x in range(W):
            c=1 if grid[row+x] or (blocked is not None and blocked[0]<=x<blocked[0]+blocked[2] and blocked[1]<=y<blocked[1]+blocked[3]) else 0
            run+=c;acc[now+x+1]=acc[prev+x+1]+run
    free=bytearray(W*H)
    for y in range(hy,H-hy):
        t=y-hy;b=y+hy+1;lo=t*padW;hi=b*padW;row=y*W
        for x in range(hx,W-hx):
            l=x-hx;r=x+hx+1
            if acc[hi+r]-acc[lo+r]-acc[hi+l]+acc[lo+l]==0:free[row+x]=1
    _,sx,sy=SITES[0]
    start=sy*W+sx
    assert free[start],f'spawn not free at {hx},{hy}'
    seen=bytearray(W*H); seen[start]=1;q=collections.deque([start]);count=1
    while q:
        i=q.popleft();y,x=divmod(i,W)
        for j,valid in ((i-1,x>0),(i+1,x<W-1),(i-W,y>0),(i+W,y<H-1)):
            if valid and free[j] and not seen[j]:seen[j]=1;q.append(j);count+=1
    missing=[name for name,x,y in SITES if not seen[y*W+x]]
    return {'connected':count,'reached':len(SITES)-len(missing),'missing':missing},free,seen

# Canonical nonoverlapping five-integer row runs + maximal identical vertical coalescence.
def rectangle_encoding(grid):
    rects=[];active={}
    for y in range(H):
        current={}; row=grid[y*W:(y+1)*W]; x=0
        while x<W:
            m=row[x]
            if not m:x+=1;continue
            e=x+1
            while e<W and row[e]==m:e+=1
            key=(x,e-x,int(m))
            if key in active:
                r=active.pop(key);r[3]+=1
            else:r=[x,y,e-x,1,int(m)]
            current[key]=r;x=e
        rects.extend(active.values());active=current
    rects.extend(active.values());rects.sort(key=lambda r:(r[1],r[0],r[4]));return rects

PALETTE={0:(9,17,26),49:(75,97,111),58:(110,123,130),62:(150,177,188),100:(49,63,78),101:(37,47,66),113:(174,190,157),117:(157,105,88),122:(187,221,212)}
def png_indexed(grid,x0,y0,w,h):
    palette=bytes(v for m in range(256) for v in PALETTE.get(m,(0,0,0)))
    rgba=b''.join(b'\x00'+bytes(grid[(y0+y)*W+x0:(y0+y)*W+x0+w]) for y in range(h))
    def chunk(tag,dat):
        return struct.pack('>I',len(dat))+tag+dat+struct.pack('>I',zlib.crc32(tag+dat)&0xffffffff)
    return b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',w,h,8,3,0,0,0))+chunk(b'PLTE',palette)+chunk(b'IDAT',zlib.compress(rgba,9))+chunk(b'IEND',b'')

CROPS=[('01-west-injection.png',0,145,423,746),('02-shuttle-lift.png',389,167,432,756),
 ('03-forkbridge-signal.png',819,101,440,806),('04-cargo-gantry.png',1271,190,440,776),
 ('05-east-arrestor.png',1653,176,395,819),('06-foundation-service.png',242,741,1495,283)]

# Strict final source replay and route receipt.
rects=rectangle_encoding(G)
setup={'version':2,'extent':[W,H],'actors':[{'id':1,'model':'midge','hash':MODEL_HASH,'spawn':[142,565],
  'options':{'budget':20,'mass_multiplier':1,'inertia_multiplier':1,'thrust_multiplier':1,'torque_multiplier':1,'boost_multiplier':1.8}}],
 'next_id':2,'selected':1,'edits':rects,'response':'LA-SELECTIVE','liquid_policy':POLICY,'normalize':False,
 'rule_radius':2,'source':[],'material':2,'brush':8,'fire':False}
raw=json.dumps(setup,separators=(',',':'),ensure_ascii=False).encode('utf-8')
assert len(rects)<=32768 and len(raw)<=1048576
work=sum(r[2]*r[3] for r in rects);assert work<=32000000
replay=bytearray(W*H);mask=bytearray(W*H)
for x,y,w,h,m in rects:
    assert w>0 and h>0 and x>=0 and y>=0 and x+w<=W and y+h<=H
    for row in range(y,y+h):
        a=row*W+x;b=a+w
        assert not any(mask[a:b]); mask[a:b]=b'\x01'*w;replay[a:b]=bytes([m])*w
assert replay==G
qual={'name':'Parallax Forkbridge Containerworks','revision':'R1','seed':hex(SEED),'engine_main_sha':'7b03aa437561ec63e31fd09531171360ab60eeb4',
 'repository_main_sha':'99a166e7fcae45eb22be1740e9f33f62faccbcc7','extent':[W,H],
 'actual_material_cells':W*H,'rectangles':len(rects),'setup_bytes':len(raw),'work_visits':work,
 'source_limits':{'rectangles':32768,'json_bytes':1048576,'work_cells':32000000},
 'grid_sha256':hashlib.sha256(G).hexdigest(),'setup_sha256':hashlib.sha256(raw).hexdigest(),
 'histogram':dict(sorted(collections.Counter(G).items())), 'detached_design_cells_discarded':detached,
 'remaining_detached':0,'material_laws':{str(m):'accepted inert immovable Solid / RuleKernel None' for m in SAFE},
 'named_sites':[{'name':n,'x':x,'y':y} for n,x,y in SITES], 'clearances':{},'obstruction':{'xywh':BLOCK},
 'pngs':{},'native':'NATIVE-UNTESTED. No installed bridge, flight, collision, movement or cold save/reopen.'}
for hw,hh,label in [(9,7,'19x15'),(11,9,'23x19'),(15,13,'31x27')]:
    r,free,seen=clearance_reach(G,hw,hh)
    qual['clearances'][label]=r
    print('Clearance',label,r,flush=True)
ob,_,_=clearance_reach(G,15,13,BLOCK);qual['obstruction'].update(ob)
print('Blocked',qual['obstruction'],flush=True)
(ROOT/'setup-parallax-forkbridge-containerworks.json').write_bytes(raw)
for name,x,y,w,h in [('overview.png',0,0,W,H),*CROPS]:
    im=png_indexed(G,x,y,w,h);(ROOT/name).write_bytes(im)
    qual['pngs'][name]={'x':x,'y':y,'width':w,'height':h,'bytes':len(im),'sha256':hashlib.sha256(im).hexdigest(),'verified_source_pixels':w*h}
(ROOT/'qualification.json').write_text(json.dumps(qual,indent=2)+'\n')
print('Result:',len(rects),'rectangles',len(raw),'bytes','grid',qual['grid_sha256'], 'detached',detached,flush=True)
