#!/usr/bin/env python3
"""Deterministic CyberSand 2048x2048 'Mosaic Viaduct Commons' translator.

Produces a valid generated-start Workbench v1 setup with exact cell material edits,
PNG preview from the same cell plane, full-byte reconstruction proof, and clearance.
Reference artwork is credited, not used as a bitmap or hidden base layer.
"""
from pathlib import Path
import json, random, math, hashlib, urllib.request
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

ROOT=Path(__file__).resolve().parent
W=H=2048
SEED=40012
rng=random.Random(SEED)
# All these are verified solid CyberSand catalogue materials except contained Water.
AIR=0; WATER=3; LIMESTONE=38; GRANITE=40; COBBLE=41; MOSS_STONE=42
OAK=46; TERRA=48; SLATE=49; BRONZE=52; COPPER=53; EARTH=56; BRICK=57
CONCRETE=58; STEEL=62; RUST=65; GRATING=66; PIPE=68; CGLASS=71
DGLASS=72; HAZARD=76; CYAN=77; MAGENTA=78; AMBER=79; WHITE=80
PLANK=81; MOSS=97; MARBLE=98; BASALT=100; OBSIDIAN=101
GYPSUM=107; BRASS=119; GLASS=120; QUARTZ=122; SUGAR=124; PHOS=127
SOURCE_PATH='artwork/neighbourhoods_commons/batch2/mosaic_viaduct_commons.png'
SOURCE_ID='commn-0012'; SOURCE_KEY='batch2/images/img-040.png'
SOURCE_BLOB='fb01ca96733623502e99e9734bf4fb7d5d28035e'
SOURCE_SHA256='2fdd573055f04a2252ce7098c7276db1d9d209e9797ae9e282f15d5e0ef6b8e3'
CYBERSAND_SHA='018bd09503d7f079ddac52e225c2f7daf8d678bf'
PINNED_INPUT_ROOT='https://raw.githubusercontent.com/techrote/sandmapsreference/3302306cd2136172f363b3f4dbcf812a2f55a86c/cybersand-canvases/2048x2048/strat-0024-amber-fossil-vault/'
for file in ('base-setup.json','generated-start-template.json','material-palette.json'):
    if not (ROOT/file).exists():
        urllib.request.urlretrieve(PINNED_INPUT_ROOT+file,ROOT/file)

im=Image.new('L',(W,H),AIR)
d=ImageDraw.Draw(im)
def rect(x,y,w,h,m):
    x,y,w,h=map(int,(x,y,w,h))
    if w>0 and h>0:d.rectangle((x,y,x+w-1,y+h-1),fill=int(m))
def ln(points,m,w=2):d.line([(int(x),int(y)) for x,y in points],fill=int(m),width=max(1,int(w)),joint='curve')
def polygon(points,m):d.polygon([(int(x),int(y)) for x,y in points],fill=int(m))
def ellipse(x,y,rx,ry,m):d.ellipse((int(x-rx),int(y-ry),int(x+rx),int(y+ry)),fill=int(m))
def ring(x,y,rx,ry,outer,inner,t):
    ellipse(x,y,rx,ry,outer);ellipse(x,y,max(1,rx-t),max(1,ry-t),inner)
def beam(x1,y1,x2,y2,thick,mat):ln([(x1,y1),(x2,y2)],mat,thick)

def masonry(x,y,w,h,base=BRICK,joints=SLATE,course=25,brick=64):
    rect(x,y,w,h,base)
    for iy in range(y+course,y+h,course):rect(x,iy,w,2,joints)
    for k,iy in enumerate(range(y,y+h,course)):
        off=(k%2)*(brick//2)
        for ix in range(x+brick-off,x+w,brick):rect(ix,iy,2,min(course,h-(iy-y)),joints)

def tile_trim(x,y,w,h,mat=CYAN,spacing=26):
    rect(x,y,w,h,BRASS)
    for ix in range(x+3,x+w-4,spacing):
        rect(ix,y+3,spacing-5,max(1,h-6),mat if (ix//spacing)%3 else TERRA)
        rect(ix+2,y+5,4,max(1,h-10),AMBER)

def window(x,y,w,h,glass=GLASS):
    rect(x,y,w,h,SLATE);rect(x+5,y+5,w-10,h-10,glass)
    rect(x+w//2-2,y+4,4,h-8,BRASS);rect(x+5,y+h//2-2,w-10,4,BRASS)
    rect(x+7,y+7,max(2,w//4),4,WHITE)

def house(x,y,w,h,levels=3):
    # Narrow self-standing civic dwellings: open portal at ground, colored mosaic facades above.
    masonry(x,y,w,h,TERRA,BRICK,25,60)
    rect(x-14,y-21,w+28,24,SLATE);tile_trim(x-14,y-25,w+28,8,CYAN,19)
    rect(x+12,y+12,w-24,5,BRASS)
    for story in range(levels):
        wy=y+49+story*int((h-91)/levels)
        for xx in range(x+20,x+w-42,78):window(xx,wy,54,60,DGLASS if story%2 else CGLASS)
        rect(x+5,wy+71,w-10,8,BRASS)
        for xx in range(x+14,x+w-10,36):rect(xx,wy+74,5,22,COPPER)
    # The main entrance portal has real clearance; connected commons remain outside.
    rect(x+w//2-26,y+h-108,52,108,OBSIDIAN)
    rect(x+w//2-20,y+h-104,40,104,AIR)
    ln([(x+w//2-35,y+h-112),(x+w//2,y+h-128),(x+w//2+35,y+h-112)],BRONZE,10)
    rect(x+w//2-9,y+h-83,18,5,AMBER)

def line_fern(x,y,scale):
    ln([(x,y),(x,y-int(scale))],MOSS,8)
    for i in range(7):
        yy=y-int(scale)*(i+1)/8
        dx=(scale*.40)*(1-i/8)
        ln([(x,yy),(x-dx,yy-scale*.1)],MOSS,6)
        ln([(x,yy),(x+dx,yy-scale*.1)],PHOS,5)

def column(x,top,bottom,thin=36):
    rect(x-thin//2,top,thin,bottom-top,LIMESTONE)
    rect(x-thin//2+7,top+8,7,bottom-top-17,BRONZE)
    rect(x-thin//2-15,top,thin+30,16,BRASS)
    rect(x-thin//2-11,bottom-18,thin+22,18,BRASS)
    for iy in range(top+25,bottom-30,70):rect(x-thin//2+2,iy,thin-4,3,SLATE)

# EARTH / GEOLOGICAL SETTING: broad irregular banks outside public circulation.
polygon([(0,725),(95,792),(142,886),(185,1146),(130,1320),(250,1540),(280,1800),(418,1950),(0,2048)],GRANITE)
polygon([(2048,710),(1960,747),(1870,970),(1893,1300),(1810,1510),(1810,1740),(1690,2048),(2048,2048)],GRANITE)
polygon([(0,1760),(168,1772),(300,1836),(437,1880),(673,1920),(873,1940),(1150,1955),(1430,1880),(1658,1850),(1820,1803),(2048,1755),(2048,2048),(0,2048)],EARTH)
polygon([(0,1935),(310,1947),(690,1997),(920,1970),(1290,2010),(1580,1951),(2048,1920),(2048,2048),(0,2048)],BASALT)
for j in range(19):
    yy=1895+j*9
    ln([(0,yy+5*math.sin(j)),(445,yy+18),(1080,yy-20),(1605,yy+12),(2048,yy+2)],rng.choice([GRANITE,SLATE,COBBLE]),rng.choice([2,3,5]))
# Terraced garden / pavement bands around lower common ground.
for x,y,w in [(160,1730,445),(615,1766,360),(1110,1760,335),(1460,1735,435)]:
    rect(x,y,w,19,BRONZE);tile_trim(x,y,w,8,CYAN)
    rect(x,y+18,w,24,COBBLE)
    for xx in range(x+18,x+w-10,43):rect(xx,y+24,xx%3+6,3,LIMESTONE)

# LOWER CIVIC CIRCULATION: long colonnaded route over a floodable reflecting cistern.
rect(320,1516,1410,30,CONCRETE);rect(308,1511,1434,7,BRASS)
for xx in range(342,1715,44):
    rect(xx,1529,28,4,GRATING)
    rect(xx+7,1546,5,18,COPPER)
# Distinct west/east long service access and lower shelter platforms.
for x,y,span in [(84,1354,440),(1390,1336,553),(500,1666,425),(1120,1637,412)]:
    rect(x,y,span,20,SLATE);rect(x,y,span,5,BRASS)
    for ix in range(x+15,x+span-10,48):rect(ix,y+8,29,3,GRATING)
    for ix in range(x+35,x+span-20,118):beam(ix,y+21,ix+9,y+68,6,BRONZE)

# PRIMARY VIADUCT: broad raised boulevard across the valley, 6 deep limestone arches.
# All repeated arch voussoirs and their masonry are real solid material cells.
rect(155,602,1738,45,LIMESTONE)
rect(155,601,1738,8,BRASS)
rect(155,647,1738,16,TERRA)
tile_trim(159,663,1730,23,CYAN,37)
rect(160,688,1725,13,SLATE)
for xx in range(180,1880,28):
    rect(xx,615,14,6,COPPER)
    rect(xx,689,7,25,BRASS)
# Side rails above deck leave open skylines and a walkable route.
rect(164,571,1710,8,BRASS)
for xx in range(170,1875,41):
    rect(xx,573,5,29,BRASS)
    rect(xx+9,579,21,4,CYAN if xx%3 else TERRA)
# Dramatic catenary arch geometry. Ring with thick arch stone and angled tile inlays.
arch_centers=[320,610,900,1190,1480,1770]
for cx in arch_centers:
    rx=139
    for xx in range(cx-rx,cx+rx+1,3):
        z=(xx-cx)/rx
        inside=math.sqrt(max(0,1-z*z))
        y_in=int(1023-264*inside)
        y_out=y_in-31
        rect(xx,y_out,4,32,LIMESTONE)
        if xx%23<7:rect(xx,y_out+4,4,5,BRONZE)
    for xx in (cx-147,cx+147):
        column(xx,704,1215 if cx%2 else 1270,37)
    # Crown lockstones at every top of arch.
    polygon([(cx-15,744),(cx+15,744),(cx+8,774),(cx-8,774)],MARBLE)
    rect(cx-8,756,16,5,AMBER)
    # Tiled spandrel under boulevard, not infilling open air.
    for k in range(8):
        tx=cx-117+k*31
        polygon([(tx,704),(tx+22,704),(tx+12,734),(tx+2,734)],
                TERRA if k%2 else MOSS_STONE)

# Main supports are aligned to spare channels between arch bowls; smaller side ribs.
for x in [176,462,753,1043,1336,1622,1908]:
    rect(x-16,712,32,65,GRANITE)
    rect(x-10,750,20,7,BRASS)
# Two elevated side accesses to terrace roofs; open ladderlike vertical skylanes.
for x in (277,1750):
    rect(x-11,515,22,88,STEEL)
    for yy in range(521,594,20):rect(x-23,yy,45,5,BRASS)

# BRIDGE SECTOR: suspended mosaic rondel, courtyard clock and public commemorative arch.
ring(1024,1014,170,160,BRONZE,AIR,23)
ring(1024,1014,135,128,SLATE,AIR,10)
# Infill decorative emblem as rings + tiles. Leave surrounding air routes open.
ring(1024,1014,112,107,TERRA,AIR,13)
ring(1024,1014,85,82,CYAN,AIR,13)
for k in range(16):
    a=2*math.pi*k/16
    xa=int(1024+102*math.cos(a));ya=int(1014+98*math.sin(a))
    xb=int(1024+70*math.cos(a));yb=int(1014+70*math.sin(a))
    beam(xa,ya,xb,yb,6,BRASS if k%2 else TERRA)
for k in range(8):
    a=2*math.pi*k/8
    polygon([(1024+36*math.cos(a),1014+33*math.sin(a)),
            (1024+51*math.cos(a+.15),1014+50*math.sin(a+.15)),
            (1024+51*math.cos(a-.15),1014+50*math.sin(a-.15))],AMBER if k%2 else MARBLE)
ellipse(1024,1014,21,21,AMBER);ring(1024,1014,14,14,BRASS,MAGENTA,5)
for cx in (913,1135):
    beam(cx,605,cx,882,8,COPPER)
    rect(cx-12,882,25,10,BRONZE)
# Balcony at west and east of suspended mosaic ring, leaves approach above and below.
for x in [665,1324]:
    rect(x,1115,60,13,STEEL);rect(x+15,1128,8,36,BRASS)

# BUILDINGS: stepped townhouse terraces, workshops and a small public library.
house(150,1012,243,461,3)
house(405,1135,241,342,2)
house(1410,1122,240,344,2)
house(1667,950,231,518,4)
# Upper half-level floating civic meeting rooms left/right of arch, each with rounded marquee.
for x,y,w in [(200,762,198),(1658,758,205)]:
    masonry(x,y,w,144,BRICK,SLATE,24,44)
    rect(x-12,y-10,w+24,18,COPPER)
    rect(x+12,y+35,w-24,60,DGLASS)
    for tx in range(x+22,x+w-15,30):rect(tx,y+43,12,45,CYAN)
    rect(x+54,y+102,w-108,37,AIR)
    rect(x+25,y+129,w-50,9,BRASS)

# Public mosaic court at y1495: sunburst tiled stone plinth, benches and city plants.
rect(698,1428,650,18,BRONZE)
rect(699,1446,648,13,MARBLE)
for ix in range(716,1330,28):
    # diamond tile inlays keep a continuous walkable course, with intentional visual variation.
    polygon([(ix+12,1430),(ix+23,1437),(ix+12,1443),(ix+1,1437)],
            CYAN if ix//28%3==0 else TERRA if ix//28%3==1 else AMBER)
# Public canopy: architecturally legible broad sail, no diagonal perspective planes.
for xa,xb,ya in [(610,809,1261),(1228,1445,1277)]:
    beam(xa,ya,xb,ya-58,5,STEEL)
    polygon([(xa,ya),(xa+42,ya-88),(xb-43,ya-100),(xb,ya-58)],
            PLANK if xa<1000 else CYAN)
    ln([(xa,ya),(xa+42,ya-88),(xb-43,ya-100),(xb,ya-58)],BRASS,5)
# Mosaic mural panel at east commons wall.
rect(1458,1230,124,95,SLATE);rect(1467,1237,108,81,TERRA)
for k in range(11):
    for j in range(7):
        xx=1470+k*9;yy=1241+j*10
        rect(xx,yy,7,8,[CYAN,AMBER,BRONZE,GLASS,MOSS][(k*5+j*7+k*j)%5])
# Stage and common shelter with true open room (door openings in masonry facade).
rect(772,1540,510,13,BRASS)
for k in range(9):
    xx=802+k*53
    rect(xx,1553,21,13,SLATE)
rect(827,1552,390,45,GRANITE)
for k in range(6):
    rect(842+k*60,1559,38,4,TERRA)
# Rock-cut lower underpass columns and accessible grottoes.
for x in (285,585,905,1245,1560,1810):
    rect(x,1688,28,60,LIMESTONE)
    rect(x-11,1681,50,12,BRONZE)

# MOSAIC / BRIDGE SURFACE DETAIL: sparse rivets, harlequin tesserae and marks.
for i in range(11):
    x=190+i*163
    rect(x,698,71,13,BRONZE)
    for k in range(6):
        mat=[TERRA,BRASS,CYAN,AMBER,BRICK,MOSS_STONE][(k+i)%6]
        rect(x+4+k*10,699,8,7,mat)
for x in (85,1945):
    for j in range(15):
        yy=905+j*48
        rect(x,yy,5,33,BRONZE)
        rect(x+5,yy+9,7,12,AMBER)

# Hanging garden planters / cyan street lamps, deliberately not blocking passages.
for x,y in [(570,1350),(683,1692),(1240,1673),(1488,1376),(310,1604),(1750,1575)]:
    rect(x-31,y,62,12,TERRA);rect(x-28,y+10,56,18,BRICK)
    line_fern(x,y,62)
    for j in [-1,1]:line_fern(x+j*19,y+3,35)
for x,y in [(575,562),(801,562),(1273,562),(1510,562),(705,1393),(1338,1393)]:
    rect(x-5,y,10,39,BRASS);ellipse(x,y+40,15,13,AMBER)
    rect(x-9,y+38,18,4,WHITE)
# High-sky civic shade-festival pennants, suspended from the bridge masts.
# These are isolated, easily flown around, and add an upper-city silhouette.
for xx in (220,1810):
    rect(xx-8,328,16,238,STEEL)
    rect(xx-19,324,38,13,BRONZE)
    ellipse(xx,314,11,16,AMBER)
    for yy in range(355,542,55):
        rect(xx-11,yy,22,4,BRASS)
ln([(230,358),(415,371),(610,401),(1024,432),(1430,401),(1635,370),(1800,356)],BRONZE,4)
for j in range(35):
    xx=258+j*44
    yy=int(358+74*(1-((xx-1024)/790)**2))
    polygon([(xx,yy),(xx+22,yy+2),(xx+9,yy+37)],
            [CYAN,TERRA,AMBER,MOSS_STONE,BRASS][j%5])
    ln([(xx,yy),(xx+9,yy+37)],SLATE,2)
for xx,yy in ((665,407),(1418,408)):
    rect(xx-3,yy,6,45,COPPER)
    ellipse(xx,yy+49,17,10,MAGENTA)
    rect(xx-7,yy+49,14,4,WHITE)
# Transit signage: rendered in materials, not as overlay raster text.
FONT={
'A':['010','101','111','101','101'],'B':['110','101','110','101','110'],
'C':['011','100','100','100','011'],'D':['110','101','101','101','110'],
'E':['111','100','110','100','111'],'F':['111','100','110','100','100'],
'G':['011','100','101','101','011'],'H':['101','101','111','101','101'],
'I':['111','010','010','010','111'],'J':['011','001','001','101','010'],
'K':['101','101','110','101','101'],'L':['100','100','100','100','111'],
'M':['101','111','111','101','101'],'N':['101','111','111','111','101'],
'O':['010','101','101','101','010'],'P':['110','101','110','100','100'],
'R':['110','101','110','101','101'],'S':['011','100','010','001','110'],
'T':['111','010','010','010','010'],'U':['101','101','101','101','111'],
'V':['101','101','101','101','010'],'W':['101','101','111','111','101'],
'Y':['101','101','010','010','010'],
'0':['111','101','101','101','111'],'1':['010','110','010','010','111'],
'2':['110','001','010','100','111'],'4':['101','101','111','001','001'],
'-':['000','000','111','000','000'],' ':['000']*5}
def sign(x,y,name,scale=3):
    w=len(name)*scale*4+20
    rect(x-7,y-7,w+14,scale*5+29,SLATE);rect(x,y,w,scale*5+14,DGLASS)
    for ch in name:
        for iy,row in enumerate(FONT.get(ch,FONT[' '])):
            for ix,val in enumerate(row):
                if val=='1':rect(x+9+ix*scale,y+6+iy*scale,scale,scale,AMBER)
        x+=scale*4
sign(174,490,'VIADUCT 04',4)
sign(1290,490,'MOSAIC COMMONS',3)
sign(200,933,'CIVIC WEST',3)
sign(1582,886,'LIBRARY',3)
sign(805,1315,'SHARED COURT',4)
sign(1490,1610,'GARDEN EAST',3)

# WATER: one actual contained reflecting pool, deliberately below main transit.
rect(780,1777,492,11,STEEL)
rect(774,1777,10,110,STEEL);rect(1272,1777,10,110,STEEL)
rect(784,1788,488,92,WATER)
rect(774,1880,508,16,STEEL)
for ix in range(802,1250,65):
    rect(ix,1788,35,4,CGLASS)
# Clear four intentionally engineered vertical portals through the continuous
# promenade / service concourse. These are true through-openings, not fake ladders.
# Their widths exceed the 19x15 conservative Midge envelope.
for x in (683,1270):
    width=48 if x==683 else 76
    rect(x,564,width,480,AIR)
    rect(x-9,570,7,146,BRASS)
    rect(x+width+2,570,7,146,BRASS)
    rect(x-13,716,12,24,SLATE)
    rect(x+width+5,716,12,24,SLATE)
for x in (733,1325):
    rect(x,1500,60,96,AIR)
    rect(x-10,1520,7,29,BRASS)
    rect(x+62,1520,7,29,BRASS)
# Ground-level archway portals through six side-bearing columns. Their reveals
# retain the architectural shafts above, while linking the civic arcade.
for x in (467,757,1047,1337,1627):
    rect(x-29,1104,58,112,AIR)
    rect(x-34,1100,5,116,BRASS)
    rect(x+30,1100,5,116,BRASS)
# Public pedestrian passage under the side buttresses, above townhouse rooflines.
# These create alternate cross-arcade routes without removing the load-bearing crown.
for x in (466,756,1336,1626):
    rect(x-33,964,66,112,AIR)
    rect(x-37,965,4,103,BRASS)
    rect(x+35,965,4,103,BRASS)
# Passage guardrails flank, but never span, the air-access shafts.
# Water remains below any named route and beneath solid catwalks.
# Add green banks and colorful foothill tiles AFTER building, masked to exterior rock.
arr=np.asarray(im).copy()
rock=(arr==EARTH)|(arr==GRANITE)|(arr==BASALT)
for k in range(420):
    x=rng.randrange(10,2030);y=rng.randrange(800,2040)
    if not rock[y,x]:continue
    width=rng.randint(6,32);height=rng.randint(2,5)
    sl=arr[y:y+height,x:x+width]
    mask=rock[y:y+height,x:x+width]
    sl[mask]=rng.choice([COBBLE,MOSS_STONE,GRANITE,SLATE,TERRA])
im=Image.fromarray(arr,'L')

# Geometry-specific safety fixes: the suspended ring and elevated bridges are navigable
# around, and there are uninterrupted lower air bypasses. This is not a pixel walk.
DEST=[
 ('West high entry',(404,502)),('Upper viaduct approach',(545,536)),
 ('Viaduct center',(1005,528)),('East high entry',(1660,519)),
 ('West arch gallery',(502,916)),('Civic west lane',(681,1100)),
 ('North mosaic overlook',(895,812)),('South mosaic overlook',(1000,1236)),
 ('Civic east lane',(1305,1082)),('Library west overlook',(1360,976)),
 ('Western lower terrace',(680,1583)),('Central garden court',(1045,1353)),
 ('East shelter',(1326,1480)),('West underpass',(521,1712)),
 ('Reflecting basin overlook',(1000,1712)),('East underpass',(1534,1692))]
# Route seeds must be in air. Fixed conservative 19x15 actor-clearance corridor test.

def validate_routes(a,width,height):
    free=ndimage.binary_erosion(a==AIR,np.ones((height,width),dtype=bool),border_value=0)
    labels,n=ndimage.label(free)
    spawn=labels[502,404]
    bad=[]
    for name,(x,y) in DEST:
        if not spawn or labels[y,x]!=spawn:bad.append((name,x,y,int(a[y,x]),int(labels[y,x])))
    return {'envelope':[width,height],'component':int(spawn),'component_cells':int((labels==spawn).sum()) if spawn else 0,
            'components':int(n),'reachable':len(DEST)-len(bad),'destinations':len(DEST),'unreachable':bad}

# Rectangle emission is a strictly lossless maximal-vertical-row-run coalescing.
def runs_of(a):
    runs=[];opened={}
    for y,row in enumerate(a):
        edges=np.flatnonzero(np.r_[True,row[1:]!=row[:-1],True]);active={}
        for xx,end in zip(edges[:-1],edges[1:]):
            m=int(row[xx]);
            if not m:continue
            key=(int(xx),int(end-xx),m);idx=opened.get(key,-1)
            if idx>=0 and runs[idx][1]+runs[idx][3]==y:
                runs[idx][3]+=1;active[key]=idx
            else:
                idx=len(runs);runs.append([int(xx),y,int(end-xx),1,m]);active[key]=idx
        opened=active
    return runs

checks=[validate_routes(arr,19,15),validate_routes(arr,7,7)]
print('route checks',json.dumps(checks))
assert all(c['reachable']==len(DEST) for c in checks), 'Conservative traversal check failed'
runs=runs_of(arr)
assert len(runs)<=32768, f'Rectangle budget exceeded: {len(runs)}'
rec=np.zeros((H,W),np.uint8)
for xx,yy,w,h,m in runs:rec[yy:yy+h,xx:xx+w]=m
assert np.array_equal(rec,arr)
material_hash=hashlib.sha256(arr.tobytes()).hexdigest()
assert material_hash==hashlib.sha256(rec.tobytes()).hexdigest()
setup=json.loads((ROOT/'base-setup.json').read_text())
setup['actors']=[{'hash':'c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96',
 'id':1,'model':'midge','options':{'boost_multiplier':1.5,'budget':20.0,'inertia_multiplier':1.0,
 'mass_multiplier':1.0,'thrust_multiplier':1.0,'torque_multiplier':1.0},'spawn':[404.0,502.0]}]
setup['selected']=1;setup['next_id']=2;setup['edits']=runs
wrapped=json.loads((ROOT/'generated-start-template.json').read_text())
wrapped['starting_setup']=setup
json_text=json.dumps(wrapped,separators=(',',':'))+'\n'
assert len(json_text.encode())<1048576, f'JSON size > budget: {len(json_text)}'
(ROOT/'setup-mosaic-viaduct-commons.json').write_text(json_text)
# RGB material preview uses exact palette catalogue IDs. Small stable grain is display-only.
materials=json.loads((ROOT/'material-palette.json').read_text())
pal=np.zeros((256,3),dtype=np.uint8)
for item in materials:pal[int(item['id'])]=item['rgba'][:3]
rgb=pal[arr]
ys,xs=np.indices((H,W))
shade=(((xs*7+ys*11+(xs//17)*5)%5)-2).astype(np.int16)
stable=~np.isin(arr,[AIR,WATER,CYAN,MAGENTA,AMBER,WHITE,QUARTZ,PHOS])
rgb=np.clip(rgb.astype(np.int16)+stable[:,:,None]*shade[:,:,None],0,255).astype(np.uint8)
Image.fromarray(rgb).save(ROOT/'preview.png')
Image.fromarray(rgb).resize((1024,1024),Image.Resampling.LANCZOS).save(ROOT/'overview.png')

proof={
 'title':'Mosaic Viaduct Commons — Shared City on the Arches',
 'public_id':SOURCE_ID,'source_key':SOURCE_KEY,'source_path':SOURCE_PATH,
 'source_blob_sha':SOURCE_BLOB,'source_sha256':SOURCE_SHA256,
 'source_dimensions':'not independently inspected; GitHub binary image transport unavailable in execution environment',
 'cybersand_main':CYBERSAND_SHA,'extent':[W,H],
 'rectangle_count':len(runs),'rectangle_limit':32768,
 'json_bytes':len(json_text.encode()),'json_limit_bytes':1048576,
 'exact_material_cells':W*H,'material_hash':material_hash,
 'reconstructed_material_hash':hashlib.sha256(rec.tobytes()).hexdigest(),
 'destinations':[{'name':name,'point':[x,y]} for name,(x,y) in DEST],
 'connectivity':checks,'materials':{str(k):int(v) for k,v in zip(*np.unique(arr,return_counts=True))},
 'native_runtime':'NOT exercised; requires Windows 11 Godot/Rapier Workbench load, actor-input, progression, save/reopen',
 'source_visual':'Artwork identified by catalogue SHA/path but original bitmap could not be fetched for side-by-side inspection; fidelity is thematic and geometric only, NOT exact visual fidelity verified',
 'render_method':'full RGB PNG computed from authored material cells and CyberSand colour palette, no source pixels or overlay image',
 'representation':'current CyberSand generated-start-v1 with valid starting_setup.edits rectangle overlay'
}
(ROOT/'evidence.json').write_text(json.dumps(proof,indent=2)+'\n')
print(json.dumps({'rectangles':len(runs),'json_bytes':len(json_text.encode()),'plane_sha':material_hash,
 'reachable':checks[0]['reachable'],'destinations':len(DEST)},indent=2))
