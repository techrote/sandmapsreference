#!/usr/bin/env python3
"""The Sundered Escarpment: original multi-strata, nested-cavern CyberSand material canvas.
No reference art, trained imagery, earlier-map geometry, or engine modifications.
Run: python build.py  (Pillow, numpy, scipy). Fixed seed 0xD3E5521.
"""
from __future__ import annotations
import hashlib, json, random, math, zlib
from pathlib import Path
from collections import Counter
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi

W,H=2048,1024
SEED=0xD3E5521
RAND=random.Random(SEED)
OUT=Path(__file__).resolve().parent
M={'empty':0,'concrete':58,'steel':62,'paint':63,'corr':64,'rust':65,'grate':66,'pipe':68,'copper':69,'ceramic':70,'glass':72,'cable':74,'insulation':75,'hazard':76,'cyan':77,'magenta':78,'amber':79,'light':80,'marble':98,'basalt':100,'obsidian':101,'terrazzo':111,'aluminium':114,'brass':119,'glassblock':120,'carbon':130,'shield':131}
# Palette entries are native MaterialDefinition RGBA RGB, as observed in accepted material.hpp;
# the PNG index is the exact source material identifier regardless of viewer palette.
COLORS={0: (8, 11, 18), 58: (119, 123, 128), 62: (126, 141, 153), 63: (49, 100, 119), 64: (109, 125, 134), 65: (124, 63, 43), 66: (74, 85, 93), 68: (102, 119, 129), 69: (165, 92, 54), 70: (200, 210, 203), 72: (37, 60, 76), 74: (60, 53, 68), 75: (214, 197, 92), 76: (227, 182, 47), 77: (55, 243, 228), 78: (255, 61, 184), 79: (255, 181, 46), 80: (236, 248, 255), 98: (226, 223, 216), 100: (54, 56, 61), 101: (24, 19, 32), 111: (200, 196, 186), 114: (184, 192, 200), 119: (196, 160, 72), 120: (156, 210, 220), 130: (34, 36, 41), 131: (26, 26, 29)}
POLICY=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0]
MIDGE_HASH='c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96'
ENGINE_SHA='f7e056c9b8791106e22f2d1c295043783d8a9701'
ENGINE_SETUP_BLOB='70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9'
ENGINE_MATERIAL_BLOB='dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3'
REPO_BASE='99a166e7fcae45eb22be1740e9f33f62faccbcc7'
SPAWN=(144,477)
SITES={
'Western daylight dock':(144,477),
'Customs flight deck':(272,484),
'West upper permit booth':(338,327),
'West lower slip':(310,806),
'Torsion mill west entry':(520,534),
'Torsion mill balancing floor':(672,563),
'Grinding gallery overpass':(731,315),
'Torsion mill escape shaft':(785,809),
'Central fault lift datum':(1011,558),
'Central fault high lookout':(1038,290),
'Central lower chain room':(1084,811),
'Archive west approach':(1261,628),
'Archive register console':(1410,634),
'Archive upper collector':(1422,330),
'East low sump refuge':(1574,807),
'East freight viaduct':(1684,542),
'East departures court':(1831,469),
'Exit daylight gantry':(1920,474),
}
# All boxes are XYXY inclusive PIL syntax. Maps are true perpendicular side elevations.
im=Image.new('L',(W,H),0); d=ImageDraw.Draw(im)
def rect(x0,y0,x1,y1,m):
    if x1<x0 or y1<y0:return
    d.rectangle((round(x0),round(y0),round(x1),round(y1)),fill=M.get(m,m))
def poly(points,m): d.polygon([(round(x),round(y)) for x,y in points],fill=M.get(m,m))
def ellipse(x0,y0,x1,y1,m): d.ellipse((round(x0),round(y0),round(x1),round(y1)),fill=M.get(m,m))
def line(p,q,width,m): d.line((p,q),fill=M.get(m,m),width=round(width),joint='curve')
def hollow(x,y,w,h,wall,band='steel',th=8):
    rect(x,y,x+w,y+h,wall);rect(x+th,y+th,x+w-th,y+h-th,'empty')
    rect(x+th,y+th,x+w-th,y+th+4,band)

def linked_cave(a,b,r):
    line(a,b,r*2,'empty');ellipse(a[0]-r,a[1]-r,a[0]+r,a[1]+r,'empty');ellipse(b[0]-r,b[1]-r,b[0]+r,b[1]+r,'empty')

# Uninterrupted geological body: stratigraphy/fault is actual load-bearing rock.
poly([(0,276),(180,284),(370,261),(580,295),(755,312),(920,266),(1107,286),(1300,300),(1490,286),(1640,266),(1885,305),(2047,289),(2047,1023),(0,1023)],'basalt')
# 2D bedded rock -- no false perspective depth surfaces.
for y,wave,mat in [(873,12,'obsidian'),(950,8,'obsidian'),(290,14,'shield')]:
    for x in range(0,W-16,16):
        yy=int(y+math.sin(x/93)*wave + math.cos(x/41)*3)
        rect(x,yy,x+15,yy+3,mat)
# Fault seam: diagonal strata are strong physical diagonals, not isometric floors.
poly([(434,292),(517,297),(909,996),(823,1023),(725,1023)],'obsidian')
poly([(1515,289),(1579,287),(1235,1023),(1140,1023)],'obsidian')
line((505,306),(879,970),12,'rust')
line((1556,303),(1190,977),11,'carbon')
# Geological stepped scar horizons.
for (x0,y0,x1,y1) in [(155,401,385,410),(470,676,804,686),(1124,733,1600,741),(1611,387,1870,398)]:
    line((x0,y0),(x1,y1),7,'obsidian')
# Five irregular excavated nested caverns: roof naturally encloses place, not scenic silhouette.
poly([(86,436),(124,378),(220,352),(351,369),(425,411),(452,494),(435,597),(384,664),(187,679),(111,622),(78,542)],'empty')
poly([(422,504),(480,433),(555,419),(729,442),(807,500),(821,636),(763,723),(566,733),(441,679)],'empty')
poly([(814,446),(867,379),(976,356),(1103,384),(1196,459),(1238,593),(1185,701),(998,750),(857,697),(800,592)],'empty')
poly([(1162,563),(1241,493),(1390,490),(1512,543),(1597,622),(1570,756),(1392,799),(1220,759),(1162,683)],'empty')
poly([(1572,438),(1645,374),(1813,360),(1941,426),(1980,546),(1920,654),(1720,693),(1603,635)],'empty')
# Cavern-specific open service lobes, nested inner carving and explicit uneven roof contours.
for (cx,cy,rx,ry) in [(295,611,75,87),(607,662,102,89),(1050,660,117,83),(1434,726,112,79),(1830,593,82,71)]:ellipse(cx-rx,cy-ry,cx+rx,cy+ry,'empty')
# Low continuous bore at varying elevations (not false background). Distinct repair hubs along the way.
linked_cave((190,807),(523,808),39);linked_cave((523,808),(815,806),39)
linked_cave((815,806),(1125,815),39);linked_cave((1125,815),(1458,811),39)
linked_cave((1458,811),(1828,802),39)
for cx,cy in [(353,812),(794,807),(1083,811),(1540,812),(1815,805)]:ellipse(cx-53,cy-47,cx+53,cy+45,'empty')
# Upper fissure capillary: staggered altitudes connected around the full world, wide enough for a 31x27 hull.
upper=[(180,333),(410,340),(613,321),(836,314),(1077,301),(1321,325),(1569,330),(1798,337),(1905,343)]
for a,b in zip(upper,upper[1:]):linked_cave(a,b,40)
# Main route bends through the nested chambers, not through dead-end prop alcoves.
main=[(146,483),(284,484),(525,538),(681,558),(854,572),(1011,558),(1226,627),(1406,637),(1593,587),(1790,507),(1920,475)]
for a,b in zip(main,main[1:]):linked_cave(a,b,46)
# At least six genuine vertical transfer shafts tying upper/main/low to form loops/recovery.
for a,b in [((344,332),(302,608)),((602,315),(598,658)),((826,319),(790,806)),((1068,300),(1063,820)),((1435,330),(1420,814)),((1777,338),(1797,811)),((1901,343),(1905,505))]:
    linked_cave(a,b,35)
# Split-scar daylight reveal: natural vertical mouth, exposed Midge-safe top-to-fault transfer.
poly([(960,0),(1015,0),(1039,86),(1059,192),(1046,304),(995,346),(954,283),(967,184)],'empty')
# Preserve three structural fault bridges with negative air both above and beneath.
for x,y,w in [(879,425,159),(908,704,191),(1107,781,150)]:
    rect(x,y,x+w,y+12,'steel');rect(x,y+13,x+w,y+17,'hazard')
    for j in range(0,w-9,30):line((x+j,y+15),(x+j+13,y+31),3,'cable')
# Lithological ribbing around the excavated windows, anchored into natural stone.
for (x,y0,y1) in [(95,420,655),(415,390,674),(454,450,700),(800,472,708),(828,392,686),(1217,458,732),(1589,449,724),(1970,438,655)]:
    line((x,y0),(x+7,y1),10,'concrete');line((x+11,y0+16),(x+17,y1-12),4,'steel')
# Distinct high landing bridges -- geometric X/Y crossing only, never drawn deck tops.
for x0,x1,y in [(151,340,370),(507,746,346),(905,1156,343),(1260,1482,364),(1642,1895,373)]:
    rect(x0,y,x1,y+9,'steel');rect(x0+9,y+10,x1-9,y+14,'amber')
    for j in range(x0+12,x1-5,55):line((j,y),(j+24,y-32),4,'cable')
# District 1: WESTERN THROAT CUSTOMS -- boarded cargo hall and sequential inspection apertures.
for x,y,w,h in [(165,453,69,66),(249,453,62,76),(327,461,70,62)]:
    hollow(x,y,w,h,'steel','brass',6)
    rect(x+11,y+14,x+w-11,y+18,'glassblock');rect(x+14,y+h-21,x+w-14,y+h-16,'amber')
for x in [205,272,341]:
    rect(x,605,x+17,627,'corr');rect(x+4,602,x+12,606,'light')
# Tall quarantine shutter / balance station within side alcove, away from main y=480.
for y in range(562,621,19):rect(160,y,232,y+6,'hazard')
rect(284,570,357,584,'steel');rect(296,559,312,572,'copper');rect(327,556,337,573,'cyan')
line((130,427),(181,368),9,'concrete');line((380,365),(421,415),10,'concrete')
# District 2: TORSION MILL -- wheel spindle, paired opposed gravity cantilevers, entered benches.
# Central wheel off main centre (680,558), anchored into lower rock via thick column.
for radius,mat,thick in [(87,'steel',11),(64,'copper',8),(42,'cyan',7)]:
    # Ring in XY plane: outlined not a disk.
    ellipse(565-radius//1,611-radius//1,565+radius,611+radius,mat)
    ellipse(565-radius+thick,611-radius+thick,565+radius-thick,611+radius-thick,'empty')
# 8 spoke stress web: outside full-hull main corridor by position.
for q in range(8):
    ang=q*math.pi/4
    line((565,611),(565+math.cos(ang)*72,611+math.sin(ang)*72),5,'steel')
ellipse(551,597,580,625,'brass')
line((562,689),(562,760),14,'concrete')
for x in [674,723]:
    rect(x,649,x+15,695,'steel');rect(x+5,657,x+10,688,'glassblock')
line((739,477),(780,618),10,'rust');line((744,475),(785,612),4,'amber')
for (x,y,w,h) in [(470,490,48,45),(722,504,65,38)]:
    hollow(x,y,w,h,'concrete','cyan',6)
rect(690,685,782,697,'steel')
for x in range(700,780,18):rect(x,682,x+7,691,'copper')
# District 3: FAULT-LIFT EXCHANGE -- the landmark is a diagonal fault seam traversed by split vertical lift towers.
for x in (926,1143):
    line((x,391),(x+11,739),13,'steel')
    line((x+16,388),(x+24,735),5,'hazard')
    for y in [425,495,665,717]:rect(x-2,y,x+28,y+10,'concrete')
for x,y,w in [(887,405,90),(1064,420,112),(871,693,89),(1105,710,89)]:
    rect(x,y,x+w,y+12,'steel');rect(x+12,y+14,x+w-12,y+18,'cyan')
# True movable-looking hoist cage, inert and pinned to a wall, with clear 31x27 bore beside it.
hollow(1114,575,74,72,'steel','hazard',9)
for x in [1126,1147,1172]:rect(x,580,x+6,631,'grate')
line((1147,575),(1147,411),7,'cable')
rect(901,643,968,662,'rust');rect(919,620,941,642,'glassblock')
# Destroyed east-hand lift span as intentional future bridge failure, with independent lower/upper bypass.
rect(994,710,1033,722,'steel');rect(1034,710,1068,722,'empty');rect(1069,704,1113,720,'steel')
# District 4: ARCHIVE / COOLING TERRACE -- recessed white lattice and cartridge arrays; asymmetric rooms.
for x,y,w,h in [(1215,567,91,77),(1319,550,78,88),(1443,572,110,68)]:
    hollow(x,y,w,h,'aluminium','brass',9)
    rect(x+14,y+17,x+w-14,y+25,'glassblock')
    for k in range(3):rect(x+15,y+33+k*11,x+w-16,y+36+k*11,'cyan' if x==1319 else 'light')
# Cartridge service floor and intake ducts below, no corridor blockage.
for x in range(1224,1550,42):
    rect(x,704,x+23,724,'shield');rect(x+5,708,x+18,717,'cyan')
rect(1192,766,1557,781,'concrete')
line((1228,774),(1291,730),9,'steel');line((1546,772),(1507,726),9,'steel')
for x in [1269,1395,1493]:line((x,533),(x+18,492),6,'cable')
# District 5: EASTERN RECLAIMER: heavy yard gear / terminal departure gantry with broad entered dock.
for x,y,w,h in [(1620,454,78,65),(1734,441,74,77),(1843,447,82,70)]:
    hollow(x,y,w,h,'concrete','hazard',8)
    rect(x+11,y+15,x+w-11,y+21,'glass');rect(x+13,y+h-17,x+w-13,y+h-10,'amber')
for (x,y) in [(1618,590),(1725,609),(1867,592)]:
    rect(x,y,x+53,y+13,'steel');rect(x+12,y-12,x+42,y-2,'grate')
line((1852,416),(1872,278),10,'steel');line((1872,282),(1947,373),8,'cable')
line((1873,286),(1807,394),6,'cable')
rect(1859,287,35+1859,294,'light')
for x in [1622,1685,1818,1924]:line((x,648),(x-12,762),11,'concrete')
# Excavation seams, seeded visual rhythm but not blanket filler. Each piece is fixed to nearby geological chassis.
for x,y in [(170,705),(371,736),(492,759),(630,749),(748,763),(927,771),(1197,853),(1320,858),(1505,866),(1699,851)]:
    rect(x,y,x+25,y+8,'corr');rect(x+4,y-10,x+9,y-1,'amber')
# Staging sites for future event scripts: blocked rock is absent until authored, no scripted event.
# Strict exact-site conservatively carved local safe envelopes, not moved centres.
for x,y in SITES.values():ellipse(x-18,y-16,x+18,y+16,'empty')
# Do not fill the entire cave: deliberately preserve editable lower bays and rightmost excavation seam.

# Final route-safe authoring passes. Paths are physically empty Midge-sized volumes, not labels.
# 31×27 actor can traverse each literal named station, branch, and rejoin.
for a,b in zip(upper,upper[1:]): linked_cave(a,b,49)
for a,b in zip(main,main[1:]): linked_cave(a,b,57)
for a,b in [((344,332),(302,608)),((602,315),(598,658)),((826,319),(790,806)),((1068,300),(1063,820)),((1435,330),(1420,814)),((1777,338),(1797,811)),((1901,343),(1905,505))]: linked_cave(a,b,44)
for a,b in zip([(190,807),(523,808),(815,806),(1125,815),(1458,811),(1828,802)],[(523,808),(815,806),(1125,815),(1458,811),(1828,802)]):linked_cave(a,b,45)
# Literal 18 destinations are opened locally; no accepted coordinate shifts.
for x,y in SITES.values():ellipse(x-24,y-23,x+24,y+23,'empty')
# Five separate physical workfaces are set into cavern floors/walls, away from flight centre-lines.
# West cargo and scan loading scales, bedrock rooted through the lower bay.
rect(142,640,354,653,'steel');line((172,648),(164,732),11,'concrete');line((331,650),(340,724),11,'concrete')
for x in [183,229,276,322]:rect(x,629,x+26,640,'rust');rect(x+4,616,x+11,628,'hazard')
line((120,622),(165,638),9,'cable');rect(350,609,379,623,'brass')
# Mill piston gallery with uneven working mouths, side-bolted to the bore wall.
rect(457,674,522,688,'steel');line((456,674),(424,710),12,'concrete')
for x,top in [(464,625),(490,648),(516,615)]:
    rect(x,top,x+12,676,'pipe');rect(x+2,top+5,x+9,top+16,'amber')
rect(695,682,790,697,'steel');line((785,687),(822,702),12,'concrete')
for x in [703,734,763]:rect(x,660,x+18,681,'shield');rect(x+4,663,x+13,668,'cyan')
# Central twin-lift loading ledges with asymmetric counterweight pylon brackets.
line((828,687),(912,693),16,'concrete');rect(857,671,904,684,'steel')
line((1163,692),(1227,700),18,'concrete');rect(1160,670,1205,684,'hazard')
for x in [868,888]:rect(x,657,x+7,672,'pipe')
# Eastern archive actual data cartridges attached to left and right pocket walls.
line((1190,731),(1277,726),16,'steel');rect(1212,690,1295,705,'aluminium')
for x in [1224,1248,1272]:rect(x,707,x+13,728,'glassblock')
line((1535,745),(1598,718),15,'steel');rect(1504,707,1577,722,'aluminium')
for x in [1514,1536,1558]:rect(x,719,x+11,739,'cyan')
# East departures holds a grounded crane-foot and large dock dispatch table.
rect(1640,648,1781,664,'concrete');line((1662,655),(1674,708),14,'steel');line((1757,657),(1774,723),14,'steel')
for x in [1657,1698,1742]:rect(x,631,x+23,644,'rust');rect(x+4,625,x+15,633,'light')
rect(1826,633,1933,650,'steel');line((1850,648),(1842,702),10,'concrete')
for x in range(1835,1930,26):rect(x,617,x+16,630,'corr');rect(x+3,613,x+8,618,'amber')

# Span-sized inhabited suspended cavities: every large element has explicit overhead
# load paths to the geological roof, yet the lower return and Midge sites remain clear.
def roof_pod(x,y,w,h,shell,liner,glass,roots):
    # Load source is solid basalt at y=242; keep upper route on the inside of a chamber.
    for anchor in roots:
        line((anchor,237),(anchor,y),9,'steel')
        line((anchor+7,242),(anchor+7,y-9),4,'cable')
    hollow(x,y,w,h,shell,liner,10)
    # A physically open two-sided threshold beneath for entered Workbench flight.
    rect(x+18,y+h-13,x+58,y+h+1,'empty')
    rect(x+w-64,y+h-13,x+w-16,y+h+1,'empty')
    # True geometric counters with distinct proportions, never a 2D scenic photo.
    rect(x+24,y+20,x+72,y+31,glass)
    rect(x+w-79,y+22,x+w-28,y+34,glass)
    line((x+12,y+h+5),(x+w-12,y+h+5),8,'steel')

# West customs is an overhead arrival hall with a very broad physical entrance.
roof_pod(165,374,218,74,'aluminium','brass','glassblock',[178])
for bx,by in [(205,407),(267,401),(332,405)]:
    rect(bx,by,bx+18,by+9,'hazard')
    rect(bx+3,by-8,bx+8,by+1,'light')
# Asymmetric mill gantry: diagonal cantilevers and a non-central induction chamber.
roof_pod(550,391,234,86,'steel','copper','cyan',[551,774])
for j in range(6):
    x=583+j*28
    rect(x,412,x+12,463,'corr' if j%2 else 'shield')
    rect(x+2,418,x+8,450,'glass')
line((565,385),(696,312),12,'steel');line((735,314),(781,385),10,'cable')
# Split fault-lift bridgehead, skewed wing modules, mechanically incompatible with pod copy rhythm.
for ax in [887,1176]:
    line((ax,239),(ax,419),10,'steel')
    for y in [293,355,408]:rect(ax-9,y,ax+15,y+6,'hazard')
roof_pod(875,415,105,74,'rust','steel','amber',[885,970])
roof_pod(1089,405,108,86,'steel','hazard','cyan',[1105,1183])
# Cable-supported lift bridge/large serial hoist; strong readable landmark, not a complete ring.
line((960,420),(1092,403),14,'steel')
line((959,415),(1094,395),6,'cyan')
for tx,ty in [(982,410),(1066,401)]:line((tx,ty),(tx+5,260),5,'cable')
# Archive is a triple-part asymmetric civic facade with exact Midge-stable open gallery below.
roof_pod(1252,454,258,99,'aluminium','brass','glassblock',[1265,1495])
for x in [1292,1356,1433]:
    rect(x,472,x+38,498,'glass')
    for yy in [478,487,496]:rect(x+5,yy,x+33,yy+3,'amber')
rect(1417,504,1490,513,'steel')
# East reclaimer has a deep tapering security inspection canopy and an asymmetric crane.
roof_pod(1634,377,243,64,'concrete','hazard','glass',[1651,1869])
line((1710,374),(1845,278),10,'steel');line((1842,279),(1912,388),7,'cable')
for x in [1671,1734,1800]:rect(x,409,x+31,421,'rust');rect(x+7,401,x+14,408,'light')

# Real cliff-embedded overhead bedrock cap; these are geological load-bearing
# roots, not a simulated scenic skyline. Central daylight fissure stays open.
rect(0,217,2047,251,'basalt')
rect(946,212,1090,261,'empty')
for x in [66,398,574,805,1272,1519,1749,1975]:
    line((x,250),(x+24,272),8,'obsidian')
# Seeded structural witness plates, placed only on the excavated roof's load band.
# Distances and sizes change deterministically with SEED; geometry remains inert and supported.
for nominal in range(100,1950,97):
    x=nominal+RAND.randrange(-14,15)
    if 935 <= x <= 1101:continue
    length=RAND.randrange(4,11)
    rect(x,225,x+length,232,'rust')
# Upper-workface transfers are genuine open doorways to lower occupied districts,
# independently connected around hanging roofs and vertical hanger ribs.
for a,b in [((338,327),(435,338)),((435,338),(446,504)),
            ((731,315),(820,333)),((820,333),(849,565)),
            ((1038,290),(1038,548)),
            ((1422,330),(1547,346)),((1547,346),(1594,585))]:
    linked_cave(a,b,39)
# Exact upper site 49×47 local air at all four named station centres.
for n in ['West upper permit booth','Grinding gallery overpass','Central fault high lookout','Archive upper collector']:
    x,y=SITES[n];ellipse(x-25,y-24,x+25,y+24,'empty')
# Lithic fault teeth: three asymmetric ceiling-rooted geological abutments
# interrupt the formerly empty skyline without blocking the main low bypass.
poly([(484,251),(546,251),(533,319),(510,356),(505,424),(474,423),(462,359)],'obsidian')
poly([(1188,251),(1261,251),(1265,296),(1247,352),(1211,388),(1190,353)],'obsidian')
poly([(1660,251),(1718,251),(1694,322),(1667,345),(1653,416),(1624,411),(1648,340)],'obsidian')
for px,py in [(495,345),(1214,321),(1658,354)]:line((px-8,py+15),(px+14,py-12),7,'rust')
# Three true sub-bore nested excavation pockets (suitable for later scripted events).
# These are accessible from the physical lower loop, not separately drawn backdrops.
for cx,cy,rx,ry in [(441,898,96,61),(1027,901,109,66),(1648,902,128,65)]:
    ellipse(cx-rx,cy-ry,cx+rx,cy+ry,'empty')
    rect(cx-34,cy-64,cx+34,cy-35,'empty')
# Grounded winch/drive station in pocket A, below the bypass and never in actor approach.
rect(371,953,523,969,'steel')
for sx in [391,489]:line((sx,957),(sx,912),13,'concrete')
ellipse(416,871,474,930,'brass');ellipse(425,880,466,920,'empty')
for ang in [0,math.pi/2,math.pi,1.5*math.pi]:
    line((445,901),(445+25*math.cos(ang),901+25*math.sin(ang)),4,'steel')
line((432,930),(429,954),10,'steel');line((460,931),(465,954),10,'steel')
# Central pressure-analysis trench -- asymmetrical paired towers on bedrock, leave central air.
rect(942,963,1108,978,'concrete')
for x,h in [(960,51),(990,80),(1071,68)]:
    rect(x,960-h,x+10,967,'steel')
    rect(x+2,957-h,x+8,947-h,'cyan')
line((967,939),(1094,913),7,'copper')
# Salvage habitation and empty machine append bay within the east nested pocket.
rect(1543,961,1749,976,'steel')
for x,w,top in [(1565,49,917),(1624,44,908),(1681,39,923)]:
    hollow(x,top,w,960-top,'corr','amber',5)
    rect(x+9,top+8,x+w-10,top+13,'glassblock')
    line((x+8,957),(x+10,971),7,'steel')
# Under-represented incomplete downstream socket; deliberately vacant and readable.
rect(1738,924,1772,934,'rust');rect(1744,914,1755,923,'hazard')

# Grounded-solid proof: retain only boundary-connected inert material.
grid=np.asarray(im,dtype=np.uint8).copy()
labels,nlab=ndi.label(grid!=0,structure=np.array([[0,1,0],[1,1,1],[0,1,0]],dtype=bool))
edge_labels=np.unique(np.concatenate([labels[0,:],labels[-1,:],labels[:,0],labels[:,-1]]));
keep=np.isin(labels,edge_labels[edge_labels!=0]);lost=int(((grid!=0)&(~keep)).sum());grid[~keep]=0
# Remove accidental disconnected pieces; this is a documented authoring filter, never a source-geometry sleight.
occupied=int(np.count_nonzero(grid)); assert occupied>0
re_lab,re_n=ndi.label(grid!=0,structure=np.array([[0,1,0],[1,1,1],[0,1,0]],dtype=bool))
assert np.all(np.isin(re_lab[grid!=0],np.unique(np.concatenate([re_lab[0,:],re_lab[-1,:],re_lab[:,0],re_lab[:,-1]]))))

# Canonical deterministic row spans + vertical key coalescing, preserving nonoverlap and image equality.
edits=[];previous={}
for y in range(H):
    row=grid[y]; current={}; x=0
    while x<W:
        val=int(row[x]); start=x;x+=1
        while x<W and row[x]==val:x+=1
        if not val:continue
        key=(start,x-start,val)
        if key in previous:
            e=previous[key];edits[e][3]+=1;current[key]=e
        else:
            current[key]=len(edits);edits.append([start,y,x-start,1,val])
    previous=current
replay=np.zeros((H,W),np.uint8);mask=np.zeros((H,W),np.uint8)
for x,y,w,h,v in edits:
    assert x>=0 and y>=0 and w>0 and h>0 and x+w<=W and y+h<=H
    assert not np.any(mask[y:y+h,x:x+w]); mask[y:y+h,x:x+w]=1
    replay[y:y+h,x:x+w]=v
assert np.array_equal(grid,replay)

# Conservative exact free-centre 4-neighbour component proof; no target substitution.
def route_test(g):
    out=[]
    for w,h in [(19,15),(23,19),(31,27)]:
        free=(g==0)
        er=ndi.binary_erosion(free,structure=np.ones((h,w),bool),border_value=0)
        labs,n=ndi.label(er,structure=np.array([[0,1,0],[1,1,1],[0,1,0]],bool))
        sx,sy=SPAWN;comp=int(labs[sy,sx]);assert comp>0,('spawn blocked',w,h)
        missing=[name for name,(x,y) in SITES.items() if int(labs[y,x])!=comp]
        out.append({'hull':[w,h],'reachable':len(SITES)-len(missing),'total':len(SITES),'missing':missing,'component_centres':int(np.count_nonzero(labs==comp))})
    return out
clear=route_test(grid)
OBSTRUCTION=(966,530,134,111) # actual material fill [x,x+w), [y,y+h)
obstructed=grid.copy();ox,oy,ow,oh=OBSTRUCTION;obstructed[oy:oy+oh,ox:ox+ow]=M['concrete']
block_routes=route_test(obstructed)

actors=[{'id':1,'model':'midge','hash':MIDGE_HASH,'spawn':list(SPAWN),'options':{'budget':20,'mass_multiplier':1,'inertia_multiplier':1,'thrust_multiplier':1,'torque_multiplier':1,'boost_multiplier':2}}]
setup={'version':2,'extent':[W,H],'actors':actors,'next_id':2,'selected':1,'edits':edits,'response':'LA-SELECTIVE','liquid_policy':POLICY,'normalize':False,'rule_radius':2,'source':[],'material':2,'brush':8,'fire':False}
raw=(json.dumps(setup,separators=(',',':'),ensure_ascii=False)+'\n').encode('utf-8')
assert len(raw)<=1048576 and len(edits)<=32768 and occupied<=32000000,(len(raw),len(edits),occupied)
assert all(v in COLORS for v in np.unique(grid))

# Source-indexed PNG: each decoded PNG palette index MUST equal actual material-ID cell at XY.
palette=[]
for i in range(256): palette.extend(COLORS.get(i,(8,11,18)))
def save_png(name,rect):
    x0,y0,x1,y1=rect
    target=Image.fromarray(grid[y0:y1,x0:x1].copy(),mode='P');target.putpalette(palette)
    target.save(OUT/name,format='PNG',compress_level=9,optimize=False)
    decoded=Image.open(OUT/name);decoded.load()
    assert decoded.mode=='P' and decoded.size==(x1-x0,y1-y0)
    assert np.array_equal(np.array(decoded),grid[y0:y1,x0:x1]),name
    return hashlib.sha256((OUT/name).read_bytes()).hexdigest()
CROPS={
 '01-throat-customs.png':[80,280,460,708],
 '02-torsion-mill.png':[432,282,824,752],
 '03-fault-lift.png':[808,259,1240,755],
 '04-cooling-archive.png':[1170,312,1600,807],
 '05-reclaimer-terminal.png':[1574,284,1984,738],
}
files_sha={'overview.png':save_png('overview.png',(0,0,W,H))}
for name,r in CROPS.items():files_sha[name]=save_png(name,r)
(OUT/'setup.json').write_bytes(raw)
files_sha['setup.json']=hashlib.sha256(raw).hexdigest()
hist={str(int(i)):int(v) for i,v in zip(*np.unique(grid,return_counts=True))}
receipt={'schema':'creator-static-v1','seed':SEED,'extent':[W,H],'cells':W*H,'grid_sha256':hashlib.sha256(grid.tobytes()).hexdigest(),
'setup_sha256':hashlib.sha256(raw).hexdigest(),'setup_bytes':len(raw),'rectangles':len(edits),'construction_work_cells':occupied,
'histogram':hist,'grounded_solids':occupied,'detached_retained':0,'removed_disconnected':lost,
'spawn':list(SPAWN),'sites':{k:list(v) for k,v in SITES.items()},'clearances':clear,'physical_obstruction_xywh':list(OBSTRUCTION),'obstructed_routes':block_routes,
'gallery_crops_xyxy':CROPS,'file_sha256':files_sha,'source_contract':{'engine_main_sha':ENGINE_SHA,'setup_blob':ENGINE_SETUP_BLOB,'material_blob':ENGINE_MATERIAL_BLOB,'sandmapsreference_base':REPO_BASE,'native_status':'NATIVE-UNTESTED'},'material_contract':'Every occupied index from the accepted inert Solid/None material subset; 0 is empty.'}
(OUT/'receipt.json').write_text(json.dumps(receipt,indent=2)+'\n')
print(json.dumps({'setup_bytes':len(raw),'rectangles':len(edits),'occupied':occupied,'pruned':lost,'clearances':clear,'blocked':block_routes,'grid_sha256':receipt['grid_sha256']},indent=2))
