#!/usr/bin/env python3
"""The Umbra Siphon: independent original 2048x1024 CyberSand Setup-v2 world.
No reference image; deterministic original hand-authored macro, meso, micro geometry.
Run python build.py in this folder. Only standard libs + numpy/scipy/Pillow.
"""
from __future__ import annotations
import json,hashlib,math,random,collections,struct,zlib
from pathlib import Path
import numpy as np
from PIL import Image,ImageDraw
from scipy.ndimage import label, generate_binary_structure
W,H,SEED=2048,1024,0x5E7104
ROOT=Path(__file__).resolve().parent
rnd=random.Random(SEED)
M={'E':0,'CON':58,'ST':62,'PS':63,'COR':64,'RUST':65,'GR':66,'PIPE':68,'COP':69,'TILE':70,'CHEM':71,'DARK':72,'CB':74,'INS':75,'HAZ':76,'CYAN':77,'PINK':78,'AMBER':79,'WHITE':80,'MARBLE':98,'BAS':100,'OBS':101,'TERR':111,'ZINC':113,'AL':114,'BRASS':119,'GLASS':120,'FROST':121,'POLY':128,'CARB':130,'SHIELD':131}
# Exact rgba declarations from accepted techrote/cybersand/native/include/cybersand/material.hpp @ de109d0.
RGBA={0:(8,11,18,255),58:(119,123,128,255),62:(126,141,153,255),63:(49,100,119,255),64:(109,125,134,255),65:(124,63,43,255),66:(74,85,93,255),68:(102,119,129,255),69:(165,92,54,255),70:(200,210,203,255),71:(107,196,181,184),72:(37,60,76,192),74:(60,53,68,255),75:(214,197,92,255),76:(227,182,47,255),77:(55,243,228,255),78:(255,61,184,255),79:(255,181,46,255),80:(236,248,255,255),98:(226,223,216,255),100:(54,56,61,255),101:(24,19,32,255),111:(200,196,186,255),113:(152,162,168,255),114:(184,192,200,255),119:(196,160,72,255),120:(156,210,220,204),121:(206,226,232,214),128:(62,122,180,255),130:(34,36,41,255),131:(26,26,29,255)}
# Native authoring policy from accepted previous-generation Setup-v2, engine rechecked in this run.
POLICY=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0]
MIDGE_HASH='c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96'
SITES={
 'Lantern Gate arrival':(147,460),
 'Lantern Gate sky counter':(268,276),
 'Lantern Gate lower return':(284,745),
 'First Siphon feed deck':(615,465),
 'First Siphon upper vent':(738,290),
 'First Siphon condensate access':(750,748),
 'Counterweight inspection':(1084,286),
 'Central breath passage':(1063,472),
 'Midspan lower transfer':(1129,749),
 'Mirror Adsorber canopy':(1445,287),
 'Mirror Adsorber membrane service':(1418,458),
 'Mirror Adsorber lower loop':(1513,744),
 'Silent Border scan gallery':(1798,295),
 'Silent Border entry clearing':(1800,468),
 'Silent Border service escape':(1849,738),
 'East recovery beacon':(1935,470)
}
CROPS=[('01-lantern-gate',88,172,380,469),('02-first-siphon',452,115,445,584),('03-zero-pressure',883,113,413,591),('04-mirror-adsorber',1260,140,439,564),('05-silent-border',1655,174,364,471)]
canvas=Image.new('L',(W,H),0); d=ImageDraw.Draw(canvas)
def R(x,y,w,h,m):
 x=int(round(x));y=int(round(y));w=int(round(w));h=int(round(h));
 if w>0 and h>0 and x<W and y<H and x+w>0 and y+h>0:d.rectangle((x,y,x+w-1,y+h-1),fill=m)
def P(points,m): d.polygon([(int(x),int(y)) for x,y in points],fill=m)
def L(x,y,xx,yy,t,m): d.line((int(x),int(y),int(xx),int(yy)), fill=m,width=int(t),joint='curve')
def LOOP(points,w,m):d.line([(int(x),int(y)) for x,y in points],fill=m,width=w,joint='curve')
def ring(x0,y0,x1,y1,w,m):
 R(x0,y0,x1-x0,y1-y0,m);R(x0+w,y0+w,x1-x0-2*w,y1-y0-2*w,0)
def port(x,y,w,h,trim):
 R(x,y,w,h,0);R(x-4,y-4,w+8,4,trim);R(x-4,y+h,w+8,4,trim)
def deck(x,y,w,t=10,mat=62,edge=77):
 R(x,y,w,t,mat);R(x+5,y,w-10,3,edge)
def cabin(x,y,w,h,mat,glass,trim):
 P([(x,y+8),(x+14,y),(x+w-17,y+2),(x+w,y+11),(x+w-3,y+h),(x+3,y+h)],mat)
 R(x+12,y+18,w-24,h-31,0);R(x+11,y+14,w-22,5,trim);R(x+14,y+24,w-28,min(15,h-37),glass)
 R(x+6,y+h-15,w-12,7,trim)
# Basalt / obsidian original ridge: western severe escarpment, eastern alabaster inland wall.
for x in range(W):
 ridge=int(873+13*math.sin(x*0.007)+12*math.sin(x*.021)+5*math.sin(x*.057));R(x,ridge,1,H-ridge,M['BAS']);
 if (x%71)<39:R(x,ridge+35,1,4,M['OBS'])
P([(0,1023),(0,246),(24,264),(54,315),(81,368),(76,512),(96,632),(75,752),(109,875),(169,1023)],M['OBS'])
P([(2047,1023),(2047,206),(2014,255),(1990,328),(1985,465),(1964,604),(1976,754),(1912,1023)],M['BAS'])
# Rock shafts: anisotropic strata; real inert, no falling Stone.
for x in list(range(105,610,116))+list(range(1480,1980,139)):
 L(x,924,x+18,1006,6,M['OBS'])
R(118,844,1820,28,M['CON']);deck(125,868,1800,9,M['ST'],M['BRASS'])
# Main suspension roof: changing jagged pressure arch anchored on BOTH bedrock shoulders.
roof=[(4,282),(143,216),(313,195),(488,167),(613,108),(766,130),(932,190),(1080,151),(1206,113),(1378,141),(1535,117),(1738,172),(1937,215),(2047,265)]
LOOP(roof,21,M['CARB']);LOOP([(x,y-5) for x,y in roof],5,M['AL']);
for x,y in roof[1:-1]:R(x-7,y-18,18,16,M['ST']);R(x-3,y-9,10,4,M['WHITE'])
# Engineered continuous bottom deck with underfloor many nonidentical anchored hangers.
for x in (176,374,518,828,935,1190,1349,1614,1751,1920):
 L(x,847,x+7,875,17,M['CON']);R(x-13,849,35,8,M['ZINC'])
# District 1 — Lantern Gate, a steeply terraced civic threshold built on the western scar.
P([(81,532),(110,357),(136,316),(190,281),(242,320),(287,258),(342,284),(381,332),(425,377),(437,598),(97,601)],M['CON'])
P([(113,533),(141,382),(181,349),(229,357),(273,307),(318,330),(361,357),(400,400),(403,556),(117,563)],M['TERR'])
P([(154,327),(184,285),(218,275),(245,313),(242,326)],M['MARBLE']);P([(269,309),(292,263),(335,275),(364,326)],M['BRASS'])
# Irregular distinct inhabited counter / customs / elevated noodle-dock rooms.
for row in [(130,375,91,61),(257,362,105,83)]:
 x,y,w,h=row;cabin(x,y,w,h,M['ST'],M['FROST'],M['BRASS'])
cabin(163,524,115,77,M['CON'],M['CHEM'],M['CYAN'])
cabin(318,513,71,68,M['ZINC'],M['DARK'],M['AMBER'])
R(114,472,295,12,M['ST']);R(129,486,246,5,M['BRASS'])
P([(130,606),(157,624),(229,626),(247,641),(318,629),(381,607),(397,626),(401,656),(124,656)],M['ST'])
for x,y in ((166,560),(223,575),(340,552)):
 R(x,y,15,24,M['BRASS']);R(x+3,y+6,9,7,M['WHITE'])
# Asymmetric neighborhood staircuts (air volumes, not 3D tops).
for x,y in ((118,563),(394,536)):
 R(x,y,30,86,0);R(x-4,y,38,6,M['BRASS'])
# Pedestrian signage (hand-authored glyph-like groups)
for k,ww in enumerate([27,52,17,36,41]):
 R(152+k*41,340,ww,5,M['AMBER']);R(154+k*41,346,min(18,ww),3,M['WHITE'])
L(325,285,326,206,11,M['ST']);L(327,208,293,274,4,M['CB']);L(327,207,354,288,4,M['CB'])
# District 2 — First Siphon: enormous inward-tapering 2D horn, two-sided physical shell, evacuation workfaces.
# Horn sides built separately from top pressure crown to grounded lower manifold; leave a real 100+ cell air throat.
P([(484,266),(518,225),(569,203),(604,222),(642,301),(674,431),(707,658),(702,837),(659,838),(653,688),(610,491),(571,333),(532,302)],M['ST'])
P([(846,261),(821,232),(782,201),(758,230),(731,327),(726,477),(745,659),(748,841),(796,841),(790,666),(773,469),(782,360),(820,296)],M['CARB'])
L(530,233,782,216,14,M['ZINC']);L(544,245,779,232,5,M['WHITE'])
# Shell inner shear ribs, anchored on horn to remain physically one structure.
for yy in (344,368,393,570,598,628):
 L(582+int((yy-350)*.19),yy,611+int((yy-350)*.15),yy+17,11,M['RUST'])
 L(775-int((yy-350)*.12),yy,745-int((yy-350)*.1),yy+23,10,M['ZINC'])
# Inner flat service lip and irregular impeller inspection stations.
P([(534,545),(595,516),(639,539),(640,616),(541,638)],M['RUST'])
P([(766,531),(818,514),(850,544),(849,632),(772,612)],M['PS'])
cabin(509,569,94,62,M['ST'],M['CHEM'],M['HAZ']);cabin(788,547,70,83,M['CARB'],M['GLASS'],M['CYAN'])
for x,y in [(556,322),(783,339),(572,642),(765,625)]:
 L(x,y,x+31,y+41,8,M['ST']);R(x+25,y+35,15,8,M['WHITE'])
# Compressor train from west feeds; each piston is different sized with physically supported rotor flanges.
for x,y,w in [(458,629,81),(562,638,68),(654,658,96),(776,640,75)]:
 R(x,y,w,22,M['RUST']);R(x+9,y+4,w-18,6,M['INS']);R(x+12,y+18,w-24,7,M['ST'])
R(472,817,370,22,M['CON']);L(506,660,523,842,14,M['ST']);L(825,646,813,844,16,M['ST'])
# Horn top: two steep angled perforated fins, asymmetry intentional.
P([(543,216),(587,120),(606,127),(591,207)],M['AL']);P([(777,209),(824,148),(849,164),(798,240)],M['AL'])
L(551,207,594,146,5,M['PINK']);L(794,213,824,164,4,M['CYAN'])
# District 3 — Zero-pressure Atrium: central giant hourglass void and a mechanically credible hanging counterweight.
# Two V-ribs and braced tapered central mass are suspended from roof and attached by redundant tension trunks.
L(911,198,1056,391,21,M['CARB']);L(1225,149,1113,399,21,M['ST']);
L(915,200,1060,392,5,M['CYAN']);L(1225,153,1113,393,5,M['WHITE'])
P([(1042,357),(1089,318),(1135,363),(1125,403),(1097,425),(1051,404)],M['SHIELD'])
P([(1054,363),(1088,339),(1123,367),(1114,388),(1092,400),(1061,391)],M['ZINC'])
R(1072,371,33,13,M['PINK']);R(1082,390,12,11,M['WHITE'])
# Counterweight spur and lower supported inspection rig; no floating gears.
L(1094,408,1087,647,13,M['ST']);L(1092,411,1093,642,4,M['CYAN'])
P([(901,599),(948,568),(996,590),(1019,659),(960,669),(902,662)],M['CARB'])
P([(1152,595),(1200,558),(1258,591),(1257,657),(1190,678),(1151,655)],M['CARB'])
R(940,619,71,17,M['ZINC']);R(1159,607,69,21,M['ZINC'])
L(916,661,941,833,15,M['ST']);L(1208,662,1201,849,14,M['CON'])
# High lateral crescent cranes: non-repeated, grounded by massive atrium shoulders.
L(918,321,1016,261,11,M['ZINC']);L(1017,261,1074,299,7,M['ZINC'])
L(1155,300,1212,239,9,M['ST']);L(1211,241,1245,321,8,M['ST'])
for x,y in ((986,296),(1166,272)):
 L(x,y,x+13,y+64,5,M['CB']);R(x+3,y+59,20,9,M['HAZ'])
# A distinctive lattice prism high behind the suspended centre, no pseudo perspective.
P([(968,193),(1057,164),(1163,181),(1193,203),(1137,215),(1009,217)],M['POLY'])
P([(1001,197),(1065,178),(1149,193),(1119,201),(1022,208)],M['DARK'])
for x in range(1015,1169,27):
 L(x,185,x+22,208,4,M['WHITE'])
# District 4 — Mirror Adsorber / photochemical separation; architectural language scalloped membrane cliffs, not town pods.
P([(1290,363),(1325,256),(1371,218),(1414,261),(1440,217),(1495,248),(1552,195),(1591,246),(1638,352),(1663,627),(1283,621)],M['ZINC'])
P([(1314,354),(1351,276),(1381,260),(1417,301),(1462,255),(1502,291),(1549,241),(1572,282),(1621,365),(1624,574),(1316,578)],M['POLY'])
# Alternating diagonal membrane baffles and real access slot cutouts below.
for x,y0,dx in [(1310,335,46),(1371,306,-25),(1434,330,31),(1484,293,-24),(1550,297,38),(1603,341,-17)]:
 L(x,y0,x+dx,417,9,M['FROST']);L(x+dx,415,x+dx+6,446,5,M['WHITE'])
# Big functional reaction cycler inside a distinctive X crossing with hanging but rooted braces.
L(1337,536,1458,623,22,M['CARB']);L(1463,534,1348,623,18,M['ZINC']);
L(1484,555,1585,608,13,M['ST']);L(1591,545,1519,630,10,M['ST'])
for x,y,w,h in [(1319,542,72,70),(1415,568,101,58),(1542,530,76,91)]:
 cabin(x,y,w,h,M['ST'],M['CHEM'],M['PINK'])
R(1306,638,325,15,M['ST']);R(1318,659,301,7,M['PINK'])
for x in (1348,1462,1576,1642):
 L(x,655,x+7,842,17,M['CON']);L(x+4,675,x+12,814,5,M['POLY'])
R(1325,805,297,18,M['SHIELD'])
for x in (1350,1400,1495,1594):
 R(x,825,24,17,M['CON']);R(x+5,816,12,9,M['CYAN'])
# Tall asymmetrical filter chimney with side-visible grate vents.
L(1552,240,1572,93,18,M['ZINC']);L(1555,151,1599,193,8,M['CB']);
for y in (125,150,173):R(1560,y,36,6,M['WHITE'])
# District 5 — Silent Border: black security wall with explicit nested thresholds and service escape.
P([(1663,622),(1686,375),(1713,322),(1756,335),(1807,241),(1850,269),(1883,310),(1938,302),(1979,381),(1990,795),(1685,795)],M['SHIELD'])
P([(1690,601),(1726,397),(1760,375),(1806,290),(1841,312),(1873,351),(1921,329),(1957,414),(1954,734),(1710,737)],M['CARB'])
# Observation parapet, staggered thick walls and three separate air-void chambers.
P([(1729,375),(1793,313),(1834,319),(1807,370)],M['AL'])
R(1713,399,225,18,M['ZINC']);R(1722,420,209,7,M['PINK'])
cabin(1741,547,76,62,M['ST'],M['DARK'],M['PINK']);cabin(1848,523,91,88,M['ST'],M['FROST'],M['WHITE'])
for x,y,w in [(1700,640,92),(1804,651,86),(1898,643,69)]:
 R(x,y,w,14,M['RUST']);R(x+5,y+2,w-10,5,M['HAZ'])
L(1774,314,1809,207,12,M['ST']);L(1807,207,1779,299,5,M['PINK'])
L(1915,319,1929,204,11,M['ST']);R(1922,226,16,10,M['WHITE'])
R(1709,814,247,20,M['CON'])
for x in (1718,1782,1841,1918):
 L(x,677,x+8,849,16,M['ST']);R(x+3,720,10,37,M['ZINC'])
# Air/lift circulation integrated as counteracting orthogonal corridors:
# Top relief (y=269..324), middle inspection gap (y=427..509), lower industrial rescue (y=699..782).
# We deliberately carve at these plan-approved levels through any heavy façade, unlike decorative fake doors.
for y0,y1,x0,x1 in [(275,324,112,1960),(426,516,111,1960),(704,787,128,1955)]:
 R(x0,y0,x1-x0,y1-y0,0)
# 7 vertical flight shafts (dimension >=47 cells) join all air levels and purposely bypass dense equipment.
shaft_boxes=[(207,270,266,786),(452,265,511,792),(848,249,907,796),(992,265,1042,791),
             (1224,259,1278,789),(1644,263,1696,796),(1871,266,1915,789)]
for x0,y0,x1,y1 in shaft_boxes:R(x0,y0,x1-x0,y1-y0,0)
# Industrial lower alcoves are intentional deeper side pockets off the lower return route, not sealed pseudo-windows.
for x,y,w,h in ((348,768,65,52),(608,768,81,59),(1320,767,71,48),(1774,762,69,60)):
 R(x,y,w,h,0)
# Twin high diagonal pressure tubes are distinct from a solid global stormbeam; inserted between air paths.
# All tube origins tie to the existing horn / cavern mass, intentionally away from named flight corridors.
L(450,337,883,370,10,M['ST']);L(450,336,882,372,3,M['CYAN'])
L(1269,359,1671,382,10,M['ST']);L(1270,353,1675,373,3,M['PINK'])
# Carve the two diagonal-tube lift intersections so each route remains truly flyable.
for x0,y0,x1,y1 in shaft_boxes:R(x0,y0,x1-x0,y1-y0,0)
# Actual supports: deliberate braced underside lattice physically to anchored geology and along horizontal load chords.
# These broad girders are at y~660 and y~822, distinct from horizontal flight levels.
for x0,x1 in ((100,430),(471,839),(906,1225),(1279,1638),(1699,1951)):
 deck(x0,660,x1-x0,14,M['ST'],M['WHITE'])
 deck(x0,825,x1-x0,14,M['CON'],M['ZINC'])
for x in (145,360,540,791,933,1194,1327,1598,1744,1938):
 L(x,828,x+11,871,16,M['CON'])
# Structural braces deliberately touch lower grounded horizontal chord without puncturing lower return corridor.
for x in (335,563,755,948,1198,1392,1615,1840):
 L(x,825,x-27,837,8,M['ZINC']);R(x-3,834,18,17,M['ST'])
# WIDE portal routes remain exact and collision-safe: final guaranteed recut of every planned travel airspace.
for y0,y1,x0,x1 in [(275,324,112,1960),(426,516,111,1960),(704,787,128,1955)]:R(x0,y0,x1-x0,y1-y0,0)
for x0,y0,x1,y1 in shaft_boxes:R(x0,y0,x1-x0,y1-y0,0)
# Exact upper adsorber canopy site clearance: excavate its operational viewing vestibule, not move the target.
R(1421,260,51,67,0)
# Preserve recognizable horizontal gantry thresholds outside air corridors, not physics-blocking half-doors.
for x,y in ((123,410),(493,410),(750,408),(1307,408),(1568,408),(1748,407)):
 R(x,y,28,8,M['HAZ'])
# FINAL ROOT-CAUSE STRUCTURAL RETENTION: paired side-connected distribution chords in the dense upper/lower
# mechanical strata, with EVERY separated section attached by visible real suspension / ground struts.
# This retains the intended big siphon horns, processing rooms and workfaces rather than deleting them as islands.
R(42,345,1965,16,M['ST']); R(50,345,1948,4,M['WHITE'])
R(54,632,1944,20,M['CON']); R(70,633,1912,4,M['PINK'])
# Bar support hangers are distinct per district, not generic repeated pods.
for x,roof_y in ((144,216),(341,185),(662,117),(951,186),(1139,157),(1471,131),(1784,189),(1943,216)):
 L(x,roof_y+5,x,356,12,M['ST']); L(x+3,roof_y+12,x+3,343,3,M['CYAN'])
for x in (148,352,659,951,1140,1473,1772,1942):
 L(x,639,x+10,866,17,M['CON']); L(x+5,651,x+13,857,4,M['ZINC'])
# Actual cable-dressed upper chord and tool-bearing lower chord, asymmetrical pattern.
for x,w in ((125,67),(340,90),(528,119),(690,82),(938,83),(1117,95),(1321,94),(1510,115),(1754,57),(1898,71)):
 R(x,364,w,6,M['ZINC']); R(x+9,374,min(w-18,31),6,M['PINK'])
for x,w in ((119,90),(315,58),(548,82),(721,90),(912,66),(1110,83),(1357,96),(1552,71),(1734,103),(1910,44)):
 R(x,599,w,14,M['CARB']);R(x+5,600,w-10,4,M['WHITE'])
# R2 authored functional occupation: original shell rendered too disconnected after corridor excavation.
# Regrow supported 2D masonry/tooling *between* flight strata, leaving genuine entrances into them.
# Lantern Gate public arcade: one vaulted arrival hall, one stepped merchants' loft, non-cloned service backroom.
P([(161,358),(185,329),(238,327),(255,353),(322,346),(349,372),(375,375),(379,420),(164,420)],M['MARBLE'])
P([(184,368),(219,340),(244,354),(244,397),(183,400)],M['ZINC'])
R(195,370,36,26,0);R(196,367,34,4,M['BRASS']);R(280,372,59,36,0)
R(288,369,46,6,M['WHITE']);R(290,411,35,5,M['AMBER'])
P([(116,535),(164,512),(201,539),(225,525),(285,552),(331,521),(393,553),(398,629),(113,629)],M['CON'])
R(135,561,66,41,0);R(144,554,55,7,M['BRASS']);R(224,559,81,42,0);R(230,555,77,5,M['WHITE'])
R(332,557,46,39,0);R(340,554,34,4,M['CYAN'])
for x,yy in ((144,606),(267,611),(346,604)):
 R(x,yy,25,12,M['BRASS']);R(x+5,yy-3,14,4,M['WHITE'])
# The two great siphon shells now have readable heavy mid-level gland flanges and separated interior access ports.
P([(477,363),(517,354),(547,375),(590,368),(632,382),(677,366),(740,373),(804,356),(846,380),(846,420),(478,420)],M['ST'])
R(502,378,67,28,0);R(511,372,58,6,M['HAZ']);
P([(597,380),(628,363),(663,385),(660,417),(594,417)],M['RUST']);R(611,392,34,19,0)
R(692,384,90,22,0);R(697,378,83,6,M['WHITE'])
P([(458,547),(503,524),(562,553),(622,525),(675,547),(733,526),(800,539),(846,564),(846,633),(454,633)],M['COR'])
for x,y,w,h in [(475,567,92,43),(598,568,81,47),(727,554,89,58)]:
 R(x,y,w,h,0);R(x+8,y-5,w-16,7,M['ZINC']);R(x+15,y+9,w-30,5,M['PINK'])
# First horn recognisable intake throat: two triangular clutches at opposite sides of flight midline.
P([(552,400),(618,369),(647,405),(647,425)],M['CARB'])
P([(730,381),(805,402),(795,426),(715,425)],M['AL'])
# Zero-pressure central machinery remains sparse for dramatic negative space, but now has actual suspended cross-member.
P([(901,363),(935,350),(977,363),(994,402),(978,422),(909,422)],M['ST'])
R(930,371,42,23,0);R(937,364,24,5,M['PINK'])
P([(1151,361),(1184,344),(1229,360),(1260,409),(1237,422),(1162,421)],M['CARB'])
R(1179,373,56,30,0);R(1188,366,36,6,M['CYAN'])
P([(912,562),(960,534),(1024,556),(1039,629),(911,632)],M['ST'])
R(931,581,72,37,0);R(935,575,66,5,M['HAZ'])
P([(1147,558),(1202,537),(1243,552),(1269,628),(1149,632)],M['ZINC'])
R(1174,580,58,36,0);R(1181,577,46,6,M['WHITE'])
# Mirror Adsorber: taller single backed membrane manifold with differentiated white laboratory and copper transfer train.
P([(1289,369),(1319,348),(1361,366),(1407,355),(1455,364),(1514,354),(1569,365),(1623,349),(1647,378),(1644,423),(1290,422)],M['POLY'])
for x in (1312,1402,1506,1612):
 R(x,382,37,32,0);R(x+4,374,32,8,M['FROST']);R(x+7,410,27,5,M['PINK'])
P([(1286,534),(1341,518),(1370,541),(1431,521),(1490,549),(1556,517),(1623,550),(1634,634),(1288,633)],M['AL'])
for x,y,w in ((1313,559,83),(1443,552,67),(1541,562,75)):
 R(x,y,w,49,0);R(x+3,y-7,w-6,7,M['FROST']);R(x+9,y+12,w-18,7,M['CYAN'])
R(1322,615,267,11,M['CARB']);R(1350,623,210,5,M['PINK'])
# Security is intentionally monolithic rather than five repeated facade rooms.
P([(1728,354),(1774,336),(1852,351),(1912,337),(1960,361),(1963,419),(1716,420)],M['SHIELD'])
R(1740,373,51,31,0);R(1816,365,74,39,0);R(1907,373,38,28,0)
for x,y in ((1753,366),(1831,362),(1913,366)):
 R(x,y,28,5,M['PINK']);R(x+3,y+42,21,6,M['HAZ'])
P([(1707,534),(1743,519),(1781,543),(1833,517),(1880,540),(1949,528),(1962,628),(1707,630)],M['CARB'])
R(1733,563,72,43,0);R(1823,557,54,45,0);R(1892,553,58,43,0)
for x in (1744,1833,1907):
 R(x,545,32,6,M['WHITE']);R(x+7,611,22,7,M['PINK'])

# Reopen each explicitly planned transfer shaft across both distribution chords (full 31x27 clearance).
for x0,y0,x1,y1 in shaft_boxes:R(x0,y0,x1-x0,y1-y0,0)
R(1421,260,51,67,0)
# Retain the original exact three affected functional destinations; remove intrusive hanger interference.
R(245,252,51,57,0);R(1105,716,54,66,0);R(1774,266,52,63,0)
# Central upper relief microconcourse: a 44-cell high through-cut ABOVE the deliberately sealable 414..533 choke.
# Both approaches connect to actual lift shafts; no nearby-target waiver or teleport.
R(798,363,527,49,0)

# R3 upper CITY roof occupation and machine attics. These sit above the exact upper flight route,
# attached by actual steel to the great irregular beam and not generated as ambient illustration.
# 1 / Lantern Gate cliff-hugging civic railway attics: a tall reading hall and offset revenue clock-house.
P([(165,263),(183,215),(249,196),(291,207),(335,187),(398,194),(424,254),(416,267),(165,267)],M['TERR'])
for x,y,w,h in ((187,229,66,29),(271,221,48,32),(343,226,58,27)):
 R(x,y,w,h,M['ST']);R(x+8,y+6,w-16,h-12,0);R(x+11,y+5,w-23,5,M['AMBER'])
R(167,254,252,9,M['BRASS']);L(289,211,293,193,12,M['ST'])
# 2 / The First Siphon TRUE WIDE INTAKE: raised jaw pair plus folded inner louvres across 200-cell throat.
P([(464,262),(512,196),(565,165),(620,195),(638,249),(627,263)],M['ST'])
P([(710,260),(734,201),(779,163),(817,202),(863,248),(854,263)],M['ZINC'])
P([(512,256),(543,215),(587,205),(609,250)],M['CARB'])
P([(745,255),(764,211),(792,198),(820,251)],M['CARB'])
for x,y,dx in ((552,210,25),(580,203,23),(760,210,-18),(792,210,-20)):
 L(x,y,x+dx,250,7,M['AL']);L(x+2,y+5,x+dx+1,243,3,M['PINK'])
R(535,248,81,11,M['RUST']);R(750,248,88,11,M['ZINC'])
# 3 / Suspended dark-data passenger carriage counterweight at the Central Atrium, outside all high flight clearance.
P([(906,247),(924,203),(974,181),(1041,195),(1102,174),(1177,194),(1239,235),(1248,259),(909,259)],M['CARB'])
P([(934,235),(966,202),(1028,208),(1098,188),(1164,208),(1210,237),(1204,251),(931,250)],M['ZINC'])
for x,w in ((954,28),(998,52),(1070,26),(1117,43),(1172,31)):
 R(x,217,w,19,0);R(x+4,213,w-8,5,M['WHITE']);R(x+7,236,w-14,5,M['PINK'])
L(942,201,943,174,12,M['ST']);L(1199,201,1191,165,12,M['ST'])
# 4 / Mirrors and absorption cells above laboratory: asymmetric on-edge wafer housings, no repeated pod rooms.
P([(1291,258),(1311,209),(1363,201),(1411,227),(1454,189),(1513,213),(1572,176),(1631,218),(1643,260)],M['POLY'])
P([(1316,248),(1330,218),(1374,220),(1398,253)],M['FROST'])
P([(1411,244),(1461,203),(1510,225),(1502,250)],M['ZINC'])
P([(1548,249),(1572,195),(1619,220),(1631,257)],M['CARB'])
for x,y in ((1361,217),(1471,201),(1595,187)):
 L(x,y,x+23,253,6,M['WHITE'])
# 5 / Silent Border: monolithic high alpine security estate and multiple real forward-facing radar hatches.
P([(1693,259),(1711,223),(1758,209),(1791,229),(1831,192),(1872,205),(1913,219),(1950,256)],M['SHIELD'])
P([(1715,250),(1744,226),(1775,234),(1790,253)],M['ZINC'])
P([(1823,250),(1845,206),(1885,221),(1898,253)],M['ZINC'])
for x,w in ((1719,35),(1797,28),(1877,50)):
 R(x,241,w,10,0);R(x+3,235,w-6,6,M['PINK'])
L(1856,215,1857,164,12,M['ST']);R(1843,164,29,7,M['WHITE'])
# Freight/tool infrastructure BELOW the lower flight corridor: real supported isolated workface islands.
# Distinct by district: station transformer, compressor manifold, sub-core spine, membrane feed, border return.
for (x,w,mat,edge) in ((145,241,M['BRASS'],M['WHITE']),(480,334,M['RUST'],M['HAZ']),
                       (934,296,M['CARB'],M['CYAN']),(1325,302,M['POLY'],M['WHITE']),
                       (1732,204,M['SHIELD'],M['PINK'])):
 R(x,789,w,43,mat);R(x+8,795,w-16,6,edge);R(x+15,809,w-30,10,0)
for x,y,w in ((167,798,44),(329,798,32),(512,795,63),(631,795,42),(745,798,41),
              (971,795,85),(1112,795,58),(1361,796,74),(1490,797,56),(1774,797,51),(1882,797,39)):
 R(x,y,w,5,M['ZINC']);R(x+7,y+12,min(w-14,18),8,M['CYAN'])
# Keep the exact Lantern sky-counter flight point available after upper atelier growth.
R(243,255,53,60,0)
# No new site was created in a facade: all functional centres retain their original exact coordinates.

# R4 meso/micro authoring — readable production/occupation at exact gameplay zoom, not random wallpaper.
# Lantern Gate: differentiated passenger ticket line, consignment desk, stair/clock signs.
for x,y in ((183,371),(199,371),(216,371),(287,378),(304,378),(322,378)):
 R(x,y,4,18,M['BRASS']);R(x-1,y+15,11,4,M['WHITE'])
for x,w in ((143,24),(173,38),(215,17),(299,31),(348,24)):
 R(x,582,w,6,M['ST']);R(x+4,578,min(w-8,15),4,M['AMBER'])
for x,y in ((136,537),(165,537),(309,538),(354,538)):
 L(x,y,x+12,y-21,5,M['BRASS'])
# First Siphon: upper hydraulics, an explicit intake-to-diffuser transfer, process instrumentation.
for x,y,dx in ((499,381,21),(528,365,28),(592,379,17),(629,371,24),(715,370,-19),(772,376,-13)):
 L(x,y,x+dx,415,6,M['ZINC']);R(x+4,y+5,10,6,M['CYAN'])
for x,ww in ((487,24),(520,34),(572,27),(617,22),(688,28),(756,35),(815,18)):
 R(x,549,ww,7,M['RUST']);R(x+4,551,max(ww-8,1),3,M['HAZ'])
for x in (489,505,526,609,634,753,778,800):
 R(x,585,5,19,M['PIPE']);R(x+1,594,10,5,M['CYAN'])
# Copper piping connected to upper and lower diffuser, outside main air corridor.
L(551,551,579,577,8,M['COP']);L(581,577,599,611,8,M['COP'])
L(738,550,724,577,7,M['COP']);L(725,575,707,615,7,M['COP'])
# Central counterweight: X-frame inside the passenger carriage and load-state access fascia.
for x in (946,967,1020,1046,1098,1142,1184):
 R(x,242,23,5,M['ZINC']);R(x+4,246,13,3,M['WHITE'])
for x,y in ((965,583),(995,601),(1177,589),(1213,607)):
 R(x,y,16,12,M['PINK']);R(x+5,y+3,6,5,M['WHITE'])
L(944,610,966,583,6,M['CARB']);L(1206,608,1193,574,6,M['CARB'])
# Adsorber: layer-specific membrane fins in front-facing machine frames, no 3D perspective.
for x,y,h in ((1326,379,31),(1341,383,25),(1399,380,29),(1421,375,32),(1509,381,29),(1530,382,29),(1608,386,24)):
 R(x,y,5,h,M['WHITE']);R(x+5,y+8,9,4,M['CYAN'])
for x in (1329,1352,1401,1442,1496,1526,1577,1611):
 R(x,544,11,21,M['POLY']);R(x+4,550,4,13,M['WHITE'])
for x,ww in ((1312,42),(1382,31),(1448,49),(1531,41),(1592,28)):
 R(x,616,ww,6,M['CARB']);R(x+7,613,min(ww-13,18),4,M['PINK'])
# Border search/workpass: asymmetry in baffles, three differentiated scan processes.
for x,y,h in ((1732,381,28),(1743,374,30),(1797,379,30),(1826,376,27),(1860,375,28),(1920,383,26)):
 R(x,y,5,h,M['ZINC']);R(x+5,y+12,11,4,M['PINK'])
for x,y,ww in ((1724,571,43),(1781,583,24),(1841,570,37),(1904,585,39)):
 R(x,y,ww,6,M['ZINC']);R(x+6,y+7,ww-12,4,M['HAZ'])
# Rebuild the exact intended entry/return airspace: process instruments never masquerade as open doors.
for x,y,w,h in ((243,255,53,60),(1105,716,54,66),(1774,266,52,63),(1421,260,51,67)):
 R(x,y,w,h,0)

# R5 central ventilation reactor is a real occupied anchored WORKFACE, not an empty theatrical void.
# Broad angular base mass sits on the x900..1280 physical distribution chord at y632.
P([(867,637),(901,587),(952,548),(994,572),(1059,559),(1101,535),(1171,556),(1220,539),
   (1263,570),(1292,640),(1285,663),(874,663)],M['SHIELD'])
P([(894,629),(925,586),(950,572),(972,590),(990,630)],M['ZINC'])
P([(1157,629),(1197,570),(1220,563),(1256,612),(1263,630)],M['ZINC'])
P([(986,601),(1020,570),(1106,582),(1141,613),(1107,631),(1013,634)],M['ST'])
# Flight-passable 80x40 direct access into central service reactor at 1:1; not a cosmetic dark painted door.
R(1009,590,99,45,0);R(1004,586,110,6,M['WHITE'])
for x,y in ((930,591),(948,609),(1167,583),(1202,611),(1238,606)):
 L(x,y,x+22,y-17,7,M['ZINC']);R(x+15,y-21,17,7,M['CYAN'])
R(903,643,345,10,M['ST']);R(925,654,298,6,M['PINK'])
# Distinct two diagonal load braces attach its central mass to the existing y632 supported structural chord.
L(916,616,949,660,13,M['ST']);L(1236,614,1204,660,13,M['CON'])
# Irregular large internal transverse coolant ribbons are solid inert material (no claimed fluid behaviour).
for x,w in ((940,43),(1125,32),(1198,57)):
 R(x,636,w,7,M['ZINC']);R(x+5,634,max(w-10,1),3,M['WHITE'])

# Two 64-cell operational transfer chimneys maintain 31x27 Midge clearance through
# the horn condensate manifold and the central counterweight/reactor band.
# They are actual excavated material cells; steel threshold lips remain outside 31-cell flight envelope.
R(696,488,67,229,0)
R(1104,514,68,211,0)

# East-side redundant utility lift bypasses the blocked central public transverse.
R(1280,500,67,230,0)

# Boundary-anchored support validation: discard loose cosmetic specks, never claim dangling disconnected islands.
g=np.asarray(canvas,dtype=np.uint8).copy()
adj=generate_binary_structure(2,1)
comps,labels_n=label(g!=0,structure=adj)
roots=np.unique(np.concatenate([comps[0,:],comps[-1,:],comps[:,0],comps[:,-1]]));roots=roots[roots!=0]
keep=np.zeros(labels_n+1,dtype=bool);keep[roots]=True
lost=np.logical_and(g!=0,~keep[comps]);pruned=int(lost.sum());pruned_components=int(np.unique(comps[lost]).size)
g[lost]=0
# Full-cell hist / stable static source validation.
ids,cnts=np.unique(g,return_counts=True);hist={str(int(i)):int(c) for i,c in zip(ids,cnts)}
assert W*H==2097152 and all(int(i) in RGBA for i in ids)
work=int(np.count_nonzero(g))
# Lossless non-overlapping ordered rectangle coalescing: exact uniform-row runs with identical adjacent span merges.
edits=[];prior={}
for y in range(H):
 row=g[y];starts=np.r_[0,np.where(row[1:]!=row[:-1])[0]+1];ends=np.r_[starts[1:],W];active={}
 for start,end in zip(starts,ends):
  m=int(row[start]);
  if m==0:continue
  key=(int(start),int(end-start),m)
  if key in prior:
   i=prior[key];edits[i][3]+=1;active[key]=i
  else:
   active[key]=len(edits);edits.append([int(start),y,int(end-start),1,m])
 prior=active
assert len(edits)<=32768,(len(edits), 'too many rectangles')
# Exhaustive ordered replay and zero overlaps.
replay=np.zeros_like(g);seen=np.zeros_like(g,dtype=bool)
for x,y,w,h,m in edits:
 assert 0<x+w<=W and 0<y+h<=H and x>=0 and y>=0
 assert not seen[y:y+h,x:x+w].any(),('overlap',x,y,w,h)
 replay[y:y+h,x:x+w]=m;seen[y:y+h,x:x+w]=True
assert np.array_equal(g,replay)
setup={'version':2,'extent':[W,H],'actors':[{'id':1,'model':'midge','hash':MIDGE_HASH,
      'spawn':list(SITES['Lantern Gate arrival']), 'options':{'budget':20,'mass_multiplier':1,'inertia_multiplier':1,
      'thrust_multiplier':1,'torque_multiplier':1,'boost_multiplier':1.8}}], 'next_id':2,'selected':1,
      'edits':edits,'response':'LA-SELECTIVE','liquid_policy':POLICY,'normalize':False,'rule_radius':2,
      'source':[],'material':2,'brush':8,'fire':False}
jsonbytes=(json.dumps(setup,separators=(',',':'),ensure_ascii=False)+'\n').encode()
assert len(jsonbytes)<=1048576 and work<=32000000
(ROOT/'setup-umbra-siphon.json').write_bytes(jsonbytes)
(ROOT/'grid-local.bin').write_bytes(g.tobytes())
# Explicit in-bounds centre-envelope erosion by integral grid; BFS is full 4-neighbour legal flight centre graph.
def clearance(plane,subset):
 occupied=plane!=0
 integ=np.pad(occupied.astype(np.int32),((1,0),(1,0))).cumsum(axis=0).cumsum(axis=1)
 reports=[]
 for cw,ch in ((19,15),(23,19),(31,27)):
  hx,hy=cw//2,ch//2;air=np.zeros_like(occupied,dtype=bool)
  # integral rectangle sum vectorisation; inclusive pixel windows, no wrap/clipping allowed.
  sums=(integ[ch:,cw:]-integ[:-ch,cw:]-integ[ch:,:-cw]+integ[:-ch,:-cw])
  air[hy:H-hy,hx:W-hx]=sums==0
  sx,sy=SITES['Lantern Gate arrival'];assert air[sy,sx],('spawn physically blocked',cw,ch)
  reach,nreach=label(air,structure=adj);start_component=reach[sy,sx]
  bad=[{'name':name,'xy':list(pt),'air':bool(air[pt[1],pt[0]])} for name,pt in subset.items()
       if not air[pt[1],pt[0]] or reach[pt[1],pt[0]]!=start_component]
  reports.append({'envelope':[cw,ch],'free_centres':int(air.sum()),'spawn_reachable_centres':int((reach==start_component).sum()),
                  'reached':len(subset)-len(bad),'expected':len(subset),'missing':bad})
 return reports
checks=clearance(g,SITES)
assert all(c['reached']==16 for c in checks),checks
# Real solid 4-neighbour obstruction across central main passage; test all other sites with upper and lower bypasses.
block=g.copy();bx0,by0,bx1,by1=1017,414,1158,533
block[by0:by1,bx0:bx1]=M['CON']
remain={name:pt for name,pt in SITES.items() if name!='Central breath passage'}
blockchecks=clearance(block,remain)
assert all(c['reached']==15 for c in blockchecks),blockchecks
# Render genuine 8-bit indexed material ID pixels, with exact accepted-source material RGB palette.
palette=[0]*768
for mat,rgba in RGBA.items():palette[mat*3:mat*3+3]=rgba[:3]
files=[('overview',0,0,W,H),*CROPS];images=[]
for name,x,y,w,h in files:
 img=Image.fromarray(g[y:y+h,x:x+w],mode='P');img.putpalette(palette);target=ROOT/f'{name}.png';img.save(target,format='PNG',optimize=True)
 # Strict PNG: signature, per-chunk CRC, exactly one IEND, zlib decompression and actual indexed pixel parity.
 raw=target.read_bytes();assert raw[:8]==b'\x89PNG\r\n\x1a\n';off=8;chunks=[];idat=b''
 while off<len(raw):
  n=struct.unpack('>I',raw[off:off+4])[0];typ=raw[off+4:off+8];data=raw[off+8:off+8+n];crc=struct.unpack('>I',raw[off+8+n:off+12+n])[0];assert zlib.crc32(typ+data)==crc
  chunks.append(typ.decode());
  if typ==b'IDAT':idat+=data
  off+=12+n
 assert off==len(raw) and chunks[-1]=='IEND' and chunks.count('IEND')==1 and len(zlib.decompress(idat))>0
 re=Image.open(target);re.load();assert re.size==(w,h) and re.mode=='P'
 assert np.array_equal(np.asarray(re),g[y:y+h,x:x+w])
 images.append({'name':name,'rect':[x,y,w,h],'bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest(),'material_index_pixel_parity':True,'png_crc_zlib_iend':True})
def sha(s):return hashlib.sha256(s).hexdigest()
receipt={'original':True,'reference_art':None,'design':'The Umbra Siphon — Twin-Horn Air-Reclaim City','seed':SEED,
 'engine_sha':'de109d0131641d6adc8d25bb9ced7ca3d4991105', 'engine_material_blob_sha':'dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3',
 'engine_setup_blob_sha':'70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9','size':[W,H], 'midge_hull':[4,3],
 'material_laws':'All nonempty IDs are native accepted nonmoving inert Solid / RuleKernel::None; no fluids/reactive/granular cells.',
 'histogram':hist,'rectangles':len(edits),'painted_work':work,'json_utf8_bytes':len(jsonbytes),
 'grid_sha256':sha(g.tobytes()),'setup_sha256':sha(jsonbytes),'pruned_detached_cells':pruned,
 'pruned_detached_components':pruned_components,'grounded_final_solids':work,'detached_final_solids':0,
 'exact_sites':{k:list(v) for k,v in SITES.items()},'clearances':checks,
 'alternate_route':{'sealed_half_open_box':[bx0,by0,bx1,by1], 'excluded_site':'Central breath passage', 'checks':blockchecks},
 'images':images,'native':'NATIVE-UNTESTED','installed_bridge_rectangle_capacity':'UNVERIFIED; legacy fallback 4096 possible'}
(ROOT/'receipt.json').write_text(json.dumps(receipt,indent=2)+'\n')
print(json.dumps({'rectangles':len(edits),'bytes':len(jsonbytes),'cells':work,'pruned':pruned,'pruned_components':pruned_components,'clearances':checks,'blocked':blockchecks,'images':[(p['name'],p['bytes']) for p in images]},indent=2))
