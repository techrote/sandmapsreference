#!/usr/bin/env python3
"""Deterministic CyberSand 2048x2048 material-cell translator for strat-0024.

Generates Workbench generated-start v1 JSON, direct material-cell PNG, route review,
and exact plane reconstruction evidence.  No source image pixels are embedded.
"""
from pathlib import Path
import math, random, json, hashlib
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

ROOT=Path(__file__).parent
BASE=ROOT
W=H=2048; SEED=252024; rand=random.Random(SEED)
A=0; LIMESTONE=38; GRANITE=40; COBBLE=41; MOSS_STONE=42; TERRACOTTA=48; SLATE=49
BRONZE=52; COPPER=53; EARTH=56; BRICK=57; CONCRETE=58; STEEL=62; RUST=65; GRATING=66
PIPE=68; CHEM_GLASS=71; DARK_GLASS=72; HAZARD=76; CYAN=77; MAGENTA=78; AMBER=79
WHITE=80; MOSS=97; MARBLE=98; BASALT=100; OBSIDIAN=101; GYPSUM=107; BRASS=119
GLASS_BLOCK=120; QUARTZ=122; SUGAR=124; PHOSPHOR=127; WATER=3

im=Image.new('L',(W,H),BASALT); d=ImageDraw.Draw(im)

def rect(x,y,w,h,m):
    x,y,w,h=map(int,(x,y,w,h))
    if w>0 and h>0:d.rectangle((x,y,x+w-1,y+h-1),fill=int(m))
def line(points,m,width=2): d.line([(int(x),int(y)) for x,y in points],fill=int(m),width=max(1,int(width)),joint='curve')
def poly(points,m): d.polygon([(int(x),int(y)) for x,y in points],fill=int(m))
def circle(x,y,rx,ry,m):d.ellipse((int(x-rx),int(y-ry),int(x+rx),int(y+ry)),fill=int(m))
def ring(x,y,rx,ry,outer,inner,t):
    circle(x,y,rx,ry,outer);circle(x,y,max(1,rx-t),max(1,ry-t),inner)

def crystal(x,y,scale,mat=AMBER,reflect=True):
    # Layered transparent-looking amber/quartz shards made entirely of stable cells.
    h=int(scale);w=max(5,int(h*.30));
    poly([(x-w,y),(x-int(w*.7),y-h*.74),(x,y-h),(x+w,y-h*.64),(x+w,y)],mat)
    if reflect:
        poly([(x-int(w*.16),y-h*.10),(x-int(w*.34),y-h*.67),(x,y-h*.90),(x,y-h*.14)],SUGAR)
        line([(x+w*.48,y-h*.58),(x+w*.48,y-h*.14)],BRASS,max(2,w//9))

def gem_cluster(x,y,s,n=5):
    for i in range(n):
        dx=(i-(n-1)/2)*s*.38+rand.randint(-8,8)
        h=s*rand.uniform(.48,1.15)
        crystal(int(x+dx),int(y),h,rand.choice([AMBER,BRONZE,SUGAR,BRASS]),True)

# Basalt/ochre stone bedding with fine, controlled strata — only within rock.
for k in range(24):
    y=68*k+rand.randint(-10,10)
    line([(0,y+28),(280,y+30),(650,y+rand.randint(-8,8)),(1040,y+rand.randint(-12,12)),(1500,y+rand.randint(-8,8)),(2048,y+8)],
         rand.choice([GRANITE,SLATE,OBSIDIAN,EARTH]),rand.choice([3,4,6,9]))
for i in range(200):
    x=rand.randrange(0,W-50);y=rand.randrange(0,H)
    rect(x,y,rand.randrange(10,92),rand.choice([3,4,6,8]),rand.choice([GRANITE,EARTH,SLATE]))

# Broad main fossil gallery. Cavern sidewall shelves remain large and readable.
cave1=[(200,350),(265,300),(460,272),(690,290),(795,225),(1120,238),(1270,305),
       (1490,268),(1670,321),(1790,442),(1832,650),(1797,906),(1876,1150),
       (1773,1455),(1793,1600),(1600,1730),(1450,1775),(1320,1700),(1110,1760),
       (880,1710),(655,1805),(390,1728),(236,1610),(179,1375),(247,1100),
       (190,865),(226,632)]
poly(cave1,A)
# Lower sinkhole and lower fossil archives, open to the main chamber via two tall openings.
poly([(290,1590),(420,1560),(605,1650),(860,1630),(1120,1620),(1330,1565),
      (1596,1598),(1745,1715),(1660,1910),(1370,1972),(1100,1955),(835,1980),
      (540,1943),(320,1865)],A)
# Upper entrance and vertical service canyon.
poly([(330,0),(544,0),(602,255),(580,400),(362,430),(322,215)],A)
poly([(1480,0),(1660,0),(1650,328),(1470,418),(1445,246)],A)
# Narrow exploratory side chambers, broad enough for 19x15 envelope.
poly([(55,700),(260,660),(375,762),(320,1005),(90,1060),(32,897)],A)
poly([(1728,645),(2008,680),(2048,800),(2020,1150),(1795,1180),(1720,1015)],A)
poly([(30,1350),(260,1230),(358,1340),(295,1600),(45,1660)],A)
poly([(1762,1270),(2010,1210),(2048,1340),(2048,1620),(1795,1620)],A)
# Expose upper vaulted skylight / fossil crescent (no rasterized scenic background).
poly([(620,260),(756,185),(968,174),(1168,215),(1232,305),(1128,365),(874,330),(732,355)],A)

# Layered sculpted geological skirts, without blocking the navigable interior.
for i in range(17):
    x=rand.randint(10,215);y=rand.randint(350,1760)
    line([(x,y),(x+rand.randint(10,35),y+rand.randint(32,180))],rand.choice([SLATE,EARTH,GRANITE]),rand.randint(6,16))
for i in range(17):
    x=rand.randint(1815,2030);y=rand.randint(300,1780)
    line([(x,y),(x-rand.randint(10,35),y+rand.randint(32,170))],rand.choice([GRANITE,SLATE,EARTH]),rand.randint(7,17))

# Continuous sculptural upper cavern lip, cutaway side silhouettes.
poly([(0,0),(320,0),(306,110),(305,275),(210,395),(175,520),(75,505),(0,555)],OBSIDIAN)
poly([(1670,0),(2048,0),(2048,520),(1912,530),(1870,390),(1785,302),(1680,220)],OBSIDIAN)
# Cut playable vertical access through both upper ledges.
rect(382,32,126,412,A);rect(1530,38,90,367,A)
# Bottom bedrock geometry, strata and carved inspection ledge.
poly([(0,1920),(360,1900),(488,1945),(735,1995),(1130,1986),(1430,1945),(1700,1940),(2048,1878),(2048,2048),(0,2048)],OBSIDIAN)
poly([(0,1993),(350,1974),(690,2038),(1170,2032),(1600,1984),(2048,1970),(2048,2048),(0,2048)],GRANITE)
line([(0,1989),(360,1958),(720,2017),(1185,2006),(1630,1972),(2048,1962)],EARTH,7)

# Amber windows/crystal seams in large rock faces, away from navigation.
for x,y,s in [(150,605,118),(1680,520,95),(270,1195,89),(1750,1490,127),
              (448,1736,108),(1565,1792,100),(990,158,80),(1230,250,82),
              (90,1810,112),(1885,1880,115),(120,310,72),(1930,520,94)]:
    gem_cluster(x,y,s,n=rand.choice([3,4,5]))
for x,y,rx,ry in [(145,1200,80,122),(1890,320,77,110),(163,1740,115,84),
                  (1950,1742,83,99),(780,1980,172,68)]:
    ring(x,y,rx,ry,BRONZE,OBSIDIAN,13)
    for j in range(8):
        q=j*math.pi/4
        circle(x+math.cos(q)*(rx-18),y+math.sin(q)*(ry-18),9,12,AMBER)

# Huge primordial vertebrate skeleton in the central amber fossil crypt.
# The skull looks right; skull openings and segmented ribs make it readable from map scale.
# Spine follows a gently arched trajectory.
spine=[]
for j in range(53):
    x=575+j*20
    y=788-80*math.sin(j/52*math.pi)+42*(j/52)**2
    spine.append((x,y))
line(spine,GYPSUM,26)
line([(x,y-5) for x,y in spine],SUGAR,6)
# Vertebrae nodes + ventral cross processes, slightly differentiated bone material.
for j in range(4,50,3):
    x,y=spine[j];circle(x,y,16,13,MARBLE)
    line([(x-8,y+4),(x-15,y+25)],LIMESTONE,6)
# Rib vault: drawn individually, dangling away from head and lower walkways.
for j in range(13):
    a=j/12; x=700+j*63
    y=790-66*math.sin((x-580)/1050*math.pi)
    depth=145+125*math.sin(a*math.pi)
    pts=[(x,y+4),(x+rand.randint(7,19),y+37),(x+28,y+depth*.57),(x+41,y+depth)]
    line(pts,LIMESTONE,15)
    line([(x+6,y+14),(x+31,y+depth*.75)],GYPSUM,5)
    circle(x+41,y+depth,8,9,MARBLE)
# Lower smaller belly ribs with spare intervals leaving skylit corridors.
for j in range(11):
    x=780+j*61; y=792-53*math.sin((x-580)/1050*math.pi)
    line([(x,y),(x-16,y-42),(x-23,y-76)],SUGAR,8)
# Powerful femur/tibia arcs connecting hip/shoulder to embedded talus.
for pts in [([(790,796),(708,965),(658,1092)],23),
            ([(817,815),(858,977),(795,1110)],20),
            ([(1450,780),(1495,1000),(1540,1117)],22),
            ([(1425,800),(1356,985),(1313,1112)],20)]:
    line(pts[0],GYPSUM,pts[1]);line(pts[0],SUGAR,7)
for x,y in [(658,1090),(795,1105),(1540,1117),(1313,1112)]:
    circle(x,y,17,17,MARBLE)
# Tail tapering up right with articulated sectioning.
line([(1515,756),(1632,714),(1710,665),(1782,636)],LIMESTONE,17)
for k in range(9):
    x=1528+k*29;y=756-k*15
    circle(x,y,10-k*.5,7-k*.2,GYPSUM)
# Large fossil skull in left side chamber, jaws with teeth.
poly([(362,745),(402,694),(487,674),(566,707),(603,762),(581,819),(521,831),
      (486,874),(411,863),(363,823)],LIMESTONE)
poly([(375,755),(419,713),(477,699),(553,739),(566,765),(536,785),(471,785),
      (431,811),(381,802)],GYPSUM)
circle(467,758,24,22,OBSIDIAN)
circle(475,754,8,7,BRONZE)
poly([(407,827),(438,846),(484,844),(524,811),(576,812),(551,859),(486,881),(435,873)],MARBLE)
for k in range(7):
    tx=435+k*20; ty=841-11*math.sin(k/6*math.pi)
    poly([(tx,ty),(tx+12,ty),(tx+7,ty+28)],GYPSUM)
# Warm amber halo / geode at excavation pocket; must not seal passages.
for x,y,s in [(622,638,115),(1520,575,99),(1135,1250,105),(444,1410,86),
              (1682,1110,73),(1240,1735,76),(342,1743,104)]:
    gem_cluster(x,y,s)
# Geological scratch lines/veins in exterior rock, sparse and long.
for k in range(155):
    side=rand.choice(['left','right','top','bottom'])
    x,y={'left':(rand.randint(0,155),rand.randint(60,1920)),
         'right':(rand.randint(1890,2030),rand.randint(20,1900)),
         'top':(rand.randint(0,2040),rand.randint(0,150)),
         'bottom':(rand.randint(0,2040),rand.randint(1980,2038))}[side]
    line([(x,y),(x+rand.randint(-20,28),y+rand.randint(-15,22))],
         rand.choice([EARTH,SLATE,GRANITE,BRONZE]),rand.randint(2,6))

# Architectural archaeology: delicately framed elevated excavation walkways.
def platform(x1,x2,y,catwalk=True):
    # Metal is integrated as actual 2D platform; nav route remains around/beneath.
    rect(x1,y,x2-x1,13,STEEL)
    rect(x1,y,x2-x1,4,BRASS)
    if catwalk:
        for xx in range(int(x1)+12,int(x2)-8,31):rect(xx,y+6,18,2,GRATING)
    for xx in range(int(x1)+18,int(x2)-8,108):
        rect(xx,y+13,8,19,COPPER)
        circle(xx+4,y+13,3,3,AMBER)
# Three tiered foreground archaeology platforms, staggered into central vault.
platform(304,703,1210);platform(807,1183,1285);platform(1320,1737,1190)
platform(380,790,1550);platform(860,1230,1504);platform(1410,1730,1585)
platform(348,793,1803);platform(1110,1570,1828)
# Contrasting bridge spans with exposed pylons and inspection alcoves.
for x,y in [(415,1210),(1040,1285),(1510,1190),(615,1550),(1035,1504),(1560,1585)]:
    line([(x,y+23),(x+16,y+65)],BRONZE,9)
    circle(x+15,y+67,10,9,AMBER)
# Accessible service platforms in left and right niches.
platform(60,300,960);platform(1760,2048,1015)
platform(80,320,1490);platform(1745,2010,1480)
# Suspended gantry/capsule near top: integrated, functional silhouette.
rect(385,386,300,15,STEEL);rect(405,405,126,6,BRASS)
for x in (421,503,620):
    rect(x,326,7,60,COPPER);circle(x+3,322,7,7,AMBER)
rect(1552,397,210,14,STEEL)
for x in (1595,1713):rect(x,331,8,65,COPPER)
# Field-lab station: open facades/overhang, never an impassable sealed box.
def station(x,y,w,label_color=AMBER):
    rect(x,y,w,12,BRONZE);rect(x,y+12,11,87,STEEL);rect(x+w-11,y+12,11,87,STEEL)
    rect(x+21,y+28,w-42,7,DARK_GLASS)
    rect(x+26,y+40,w-52,9,CYAN)
    rect(x+26,y+65,w-52,5,label_color)
    rect(x+22,y+78,24,19,COPPER)
    rect(x+w-47,y+78,26,19,COPPER)
station(432,1445,170);station(1410,1370,225)
# Work lights: (cable poles, focused amber pools); keep overhead.
for x,y in [(314,1150),(780,1240),(1250,1240),(1740,1115),(405,1510),(1435,1547),(750,1780),(1310,1805)]:
    line([(x,y),(x,y+23)],COPPER,7);circle(x,y+25,12,7,AMBER)
    line([(x-10,y+38),(x+10,y+38)],BRASS,2)
# Fossil observation glass; sealed small specimens only, no false transparent solids in travel lanes.
for x,y in [(140,1350),(1825,1390),(350,1695),(1580,1670)]:
    rect(x,y,72,80,STEEL);rect(x+7,y+7,58,61,CHEM_GLASS)
    poly([(x+26,y+48),(x+32,y+18),(x+45,y+49)],QUARTZ)
    rect(x+7,y+66,58,6,AMBER)
# An actual contained water lens, only at bottom of the lower chamber.
rect(880,1879,273,14,STEEL);rect(880,1893,12,50,STEEL);rect(1141,1893,12,50,STEEL)
rect(892,1893,249,48,WATER);rect(880,1941,273,15,STEEL)

# Route marker lettering in physical cells; positioned in material facades.
FONT={
'A':['010','101','111','101','101'],'B':['110','101','110','101','110'],
'C':['011','100','100','100','011'],'D':['110','101','101','101','110'],
'E':['111','100','110','100','111'],'F':['111','100','110','100','100'],
'G':['011','100','101','101','011'],'H':['101','101','111','101','101'],
'I':['111','010','010','010','111'],'J':['011','001','001','101','010'],
'K':['101','101','110','101','101'],'L':['100','100','100','100','111'],
'M':['101','111','111','101','101'],'N':['101','111','111','111','101'],
'O':['010','101','101','101','010'],'P':['110','101','110','100','100'],
'Q':['010','101','101','111','011'],'R':['110','101','110','101','101'],
'S':['011','100','010','001','110'],'T':['111','010','010','010','010'],
'U':['101','101','101','101','111'],'V':['101','101','101','101','010'],
'W':['101','101','111','111','101'],'X':['101','101','010','101','101'],
'Y':['101','101','010','010','010'],'Z':['111','001','010','100','111'],
'0':['111','101','101','101','111'],'1':['010','110','010','010','111'],
'2':['110','001','010','100','111'],'3':['110','001','010','001','110'],
'4':['101','101','111','001','001'],'5':['111','100','110','001','110'],
'6':['011','100','110','101','010'],'7':['111','001','010','010','010'],
'8':['010','101','010','101','010'],'9':['010','101','011','001','110'],
'-':['000','000','111','000','000'],' ':['000']*5}
def text(x,y,name,scale=3):
    for c in name:
        for iy,row in enumerate(FONT.get(c,FONT[' '])):
            for ix,v in enumerate(row):
                if v=='1':rect(x+ix*scale,y+iy*scale,scale,scale,AMBER)
        x+=scale*4

def sign(x,y,name,scale=3):
    w=len(name)*scale*4+20
    rect(x-7,y-7,w+14,scale*5+28,STEEL)
    rect(x,y,w,scale*5+14,DARK_GLASS)
    text(x+9,y+6,name,scale)
sign(310,119, 'FOSSIL 07',4)
sign(1170,188, 'BONE VAULT',4)
sign(326,1320,'DIG SITE',3)
sign(1450,1300,'SURVEY 02',3)
sign(1040,1696,'AMBER WELL',3)

# Critical structural portal repairs around platforms: remove narrow shafts/corridor choke points
# only where they are required for mandatory traversal (no destructive global erosion).
# After finishing the artwork, carefully choose milestones in open-air pockets.
DEST=[
 ('Upper left entrance',(460,470)),('Western alcove',(180,820)),
 ('Left fossil approach',(320,1100)),('Skull observation',(540,940)),
 ('Upper bone hall',(1000,440)),('Right upper route',(1720,592)),
 ('Rib nave overlook',(1060,1040)),('Tail overlook',(1710,815)),
 ('East service alcove',(1930,1120)),('Survey platform',(1575,1270)),
 ('Left excavation gallery',(692,1378)),('Upper amber lens',(880,1368)),
 ('Lower middle crossing',(1270,1410)),('West undercroft',(735,1705)),
 ('East undercroft',(1700,1712)),('Deep vault',(1080,1765)),
 ('Lower water overlook',(970,1854))]

# ----------------------------------------------------------------------------
# Decode exact material state and qualify with actor envelope.
# ----------------------------------------------------------------------------
# Second detail pass: clipped micro-strata within the existing bedrock, never new air blockers.
rock=np.asarray(im).copy()
rockmask=np.isin(rock,[BASALT,OBSIDIAN,GRANITE,SLATE,EARTH])
for k in range(410):
    x=rand.randrange(10,2030);y=rand.randrange(10,2030)
    if not rockmask[y,x]:continue
    w=rand.choice([7,9,11,14,17,21,28]);h=rand.choice([2,3,4])
    sl=rock[y:y+h,x:x+w];mk=rockmask[y:y+h,x:x+w]
    tone=rand.choice([GRANITE,SLATE,EARTH,BRONZE,OBSIDIAN])
    sl[mk]=tone
# Small bone chips embedded only in pre-existing rock near the excavations.
for k in range(160):
    x=rand.randint(210,1860);y=rand.choice([rand.randint(265,400),rand.randint(1720,1955)])
    if not rockmask[y,x]:continue
    w=rand.randint(5,14);h=rand.randint(2,5)
    sl=rock[y:y+h,x:x+w];mk=rockmask[y:y+h,x:x+w]
    sl[mk]=rand.choice([LIMESTONE,GYPSUM,MARBLE])
im=Image.fromarray(rock,'L')
arr=np.asarray(im).copy()
def rectangles(a):
    result=[]; opened={}
    for y,row in enumerate(a):
        changes=np.flatnonzero(np.r_[True,row[1:]!=row[:-1],True]);active={}
        for start,end in zip(changes[:-1],changes[1:]):
            m=int(row[start]);
            if m==0:continue
            key=(int(start),int(end-start),m)
            idx=opened.get(key,-1)
            if idx>=0 and result[idx][1]+result[idx][3]==y:
                result[idx][3]+=1;active[key]=idx
            else:
                idx=len(result);result.append([int(start),y,int(end-start),1,m]);active[key]=idx
        opened=active
    return result
runs=rectangles(arr)
recon=np.zeros((H,W),np.uint8)
for x,y,w,h,m in runs:recon[y:y+h,x:x+w]=m
assert np.array_equal(arr,recon)
setup=json.loads((BASE/'base-setup.json').read_text())
setup['actors']=[{'hash':'c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96',
                  'id':1,'model':'midge','options':{'boost_multiplier':1.5,'budget':20.0,'inertia_multiplier':1.0,'mass_multiplier':1.0,'thrust_multiplier':1.0,'torque_multiplier':1.0},'spawn':[460.0,470.0]}]
setup['selected']=1;setup['next_id']=2;setup['edits']=runs
wrapped=json.loads((BASE/'generated-start-template.json').read_text());wrapped['starting_setup']=setup
serialized=json.dumps(wrapped,separators=(',',':'))+'\n'
name='strat-0024-amber-fossil-vault'
(ROOT/f'setup-{name}.json').write_text(serialized)

for ex,ey in [(19,15),(7,7)]:
    free=ndimage.binary_erosion(arr==A,np.ones((ey,ex),bool),border_value=0)
    labels,n=ndimage.label(free)
    root=labels[470,460]
    print(f'clearance {ex}x{ey}, spawn component {root}, size {np.count_nonzero(labels==root)}, components {n}')
    bad=[]
    for nm,(x,y) in DEST:
        if not root or labels[y,x]!=root: bad.append((nm,(x,y),int(labels[y,x]),int(arr[y,x])))
    print('BAD:',bad)
    assert not bad, f'{ex}x{ey} clearance failed: {bad}'

palette=json.loads((BASE/'material-palette.json').read_text())
pal=np.zeros((256,3),dtype=np.uint8)
for p in palette:pal[int(p['id'])]=p['rgba'][:3]
rgb=pal[arr]
y,x=np.indices(arr.shape)
gr=((x*7+y*11+(x//17)*5)%5-2).astype(np.int16)
stable=~np.isin(arr,[A,WATER,CYAN,MAGENTA,AMBER,WHITE,QUARTZ,PHOSPHOR,GLASS_BLOCK])
rgb=np.clip(rgb.astype(np.int16)+stable[:,:,None]*gr[:,:,None],0,255).astype(np.uint8)
preview=Image.fromarray(rgb)
preview.save(ROOT/'preview.png')
preview.resize((1024,1024),Image.Resampling.LANCZOS).save(ROOT/'overview.png')

sha=hashlib.sha256(arr.tobytes()).hexdigest()
report={'title':'Amber Fossil Vault — The Ancient Silence','public_id':'strat-0024',
 'source_path':'artwork/rock_ice_caverns/batch1/amber_fossil_vault-fossil_skeleton-ancient_silence.png',
 'source_blob_sha':'5a02202f041d1db3f78cea822019ba844dfc721c',
 'source_sha256':'2ef3a791276231e5fee07a27a37fcc7b0c7cfee8ff216f13651d78125e34ca5c',
 'source_key':'batch1/image-0252','cybersand_main':'018bd09503d7f079ddac52e225c2f7daf8d678bf',
 'extent':[W,H],'rectangle_count':len(runs),'json_bytes':len(serialized.encode()),
 'rectangle_budget':32768,'json_budget':1048576,'authored_cells':W*H,
 'plane_sha256':sha,'reconstructed_sha256':hashlib.sha256(recon.tobytes()).hexdigest(),
 'major_destinations':len(DEST),
 'destinations':[{'name':nm,'point':[int(x),int(y)]} for nm,(x,y) in DEST],
 'materials':{str(k):int(v) for k,v in zip(*np.unique(arr,return_counts=True))},
 'native_execution':'Not run in this environment; native Workbench install/actor operation/save-reopen pending owner qualification.',
 'visual_reference':'The original binary artwork was identified by catalogue and SHA but not directly decoded in this environment; compositional comparison to original remains pending.',
 'representation':'CyberSand generated-start v1 with valid Workbench starting_setup rectangle overlay on a retained empty substrate',
 'preview':'Direct RGB rendering of reconstructed material-cell grid, not source-image pixels'}
(ROOT/'evidence.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'rectangles':len(runs),'json_bytes':len(serialized),'material_plane_sha':sha,'destinations':len(DEST)},indent=2))
assert len(runs)<32768
assert len(serialized.encode())<1048576
