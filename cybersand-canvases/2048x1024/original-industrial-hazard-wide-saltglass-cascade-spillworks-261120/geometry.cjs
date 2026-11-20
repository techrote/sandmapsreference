'use strict';
// SALTGLASS CASCADE SPILLWORKS - wholly original 2048x1024 perpendicular side elevation.
// First plan: WEST contaminated salvage berth -> membrane wheel chamber ->
// three-stage declining brine clarifier -> high-temperature vitrifier ->
// eastern ceramic quarantine/distribution. Upper overflight and deep dry
// maintenance return, multiple vertical crosslinks and explicit checkpoints.
// Seeded authoring, no reference images and no previous-map geometry.
const W=2048,H=1024,SEED=26112073;
const SITES=[
['Arrival radiation check',76,370],
['Dockside load assay',303,503],
['Dock upper release',400,350],
['Membrane west entry',429,485],
['Membrane wheel inspection',548,454],
['Membrane vent crown',695,279],
['Clarifier inlet overlook',832,392],
['Settling stage A',930,413],
['Settling stage B',1101,413],
['Settling stage C',1199,440],
['Underclarifier pump',1096,777],
['Weir isolation gate',1253,541],
['Vitrifier feed control',1282,444],
['Vitrifier shield overlook',1614,425],
['Kiln underworks return',1374,775],
['Cyclone control gallery',1640,442],
['Ceramic scrubber deck',1830,463],
['East export',1983,315],
['West dry bypass',420,780],
['Quarantine lower exit',1888,781]
];
const CROPS=[
['01-contaminated-berth',35,250,445,530],
['02-membrane-rotor',416,245,433,540],
['03-cascade-clarifier',820,310,440,540],
['04-vitrifier-furnace',1244,220,420,565],
['05-cyclone-quarantine',1620,220,420,560],
['06-dry-lower-return',680,692,700,210]
];
const COLORS={'0':[8,11,18],'3':[47,127,210],'8':[241,78,31],
'58':[111,118,126],'62':[138,151,166],'68':[102,124,135],
'70':[211,207,183],'76':[230,186,41],'77':[25,211,220],
'100':[54,56,61],'101':[24,19,32],'104':[200,152,98],
'117':[124,134,149],'120':[134,189,197]};
function materialWorld(){
const g=new Uint8Array(W*H);let rngstate=SEED>>>0;
const rand=()=>{rngstate^=rngstate<<13;rngstate^=rngstate>>>17;rngstate^=rngstate<<5;return (rngstate>>>0)/4294967296};
function rect(x,y,w,h,m){let x1=Math.max(0,Math.round(x)),y1=Math.max(0,Math.round(y));let x2=Math.min(W,Math.round(x+w)),y2=Math.min(H,Math.round(y+h));if(x2<=x1||y2<=y1)return;for(let yy=y1;yy<y2;yy++)g.fill(m,yy*W+x1,yy*W+x2);}
function line(x1,y1,x2,y2,t,m){let n=Math.ceil(Math.max(Math.abs(x2-x1),Math.abs(y2-y1))/2);for(let k=0;k<=n;k++){let f=k/Math.max(1,n);rect(x1+(x2-x1)*f-t/2,y1+(y2-y1)*f-t/2,t,t,m)}}
function ring(cx,cy,rx,ry,t,m){for(let y=Math.max(0,cy-ry);y<=Math.min(H-1,cy+ry);y++){let ny=(y-cy)/ry;let wid=Math.floor(rx*Math.sqrt(Math.max(0,1-ny*ny)));let iy=(y-cy)/Math.max(1,ry-t), iw=(!isFinite(iy)||Math.abs(iy)>1)?0:Math.floor((rx-t)*Math.sqrt(1-iy*iy));rect(cx-wid,y,wid*2+1,1,m);if(Math.abs(iy)<1)rect(cx-iw,y,iw*2+1,1,0)}}
function frame(x,y,w,h,t,m){rect(x,y,w,t,m);rect(x,y+h-t,w,t,m);rect(x,y,t,h,m);rect(x+w-t,y,t,h,m);}
function vessel(x,y,w,h,medium,wall=58){rect(x,y,w,h,wall);rect(x+9,y+9,w-18,h-18,medium);}
function panel(x,y,w=47){rect(x,y,w,9,70);rect(x+7,y-17,7,17,117);rect(x+w-15,y-17,7,17,117);frame(x+15,y-15,w-30,13,3,68);rect(x+16,y-12,8,8,77);}
function feet(x1,x2,top){rect(x1,top,18,900-top,58);rect(x2,top,18,900-top,58);rect(x1,877,x2-x1+18,13,62);}
// Geological load-bearing datum: deliberately asymmetric but continuous rooted material.
for(let x=0;x<W;x+=8){let top=903+Math.round(7*Math.sin(x/85)+6*Math.sin(x/23));if(x>802&&x<1290)top=926+Math.round(5*Math.sin(x/32));if(x>1680)top=899+Math.round(4*Math.sin(x/26));rect(x,top,8,1024-top,100);}
rect(0,1000,W,24,58);rect(0,990,W,10,62);
// Dry excavation and open rails occupy the lower world; all terrain otherwise
// continues to bottom. Clearance is preserved for the lower return.
rect(42,873,1950,12,62);rect(60,878,1905,7,117);
// WEST DISTRICT - contaminated salvage berth / overhead jaw crane.
rect(95,601,312,18,62);feet(123,370,619);
rect(124,449,254,11,62);rect(139,461,13,139,117);rect(367,461,12,139,117);
rect(116,413,10,187,58);line(116,414,230,311,15,58);line(230,311,385,405,14,58);
rect(224,310,21,88,62);rect(214,361,43,9,76);
line(234,399,234,489,6,117);line(217,480,234,496,7,117);line(252,480,234,496,7,117);
frame(199,495,72,54,9,104);rect(209,505,52,34,100);rect(218,487,10,8,77);
rect(155,565,149,10,117);rect(168,549,9,16,62);rect(270,549,10,16,62);
rect(311,551,69,10,70);panel(321,550,42);
rect(167,619,14,85,117);rect(337,619,14,92,117);rect(152,705,211,10,62);
rect(177,771,12,102,58);rect(348,762,13,111,58);rect(160,761,201,10,62);
panel(224,758,56);rect(214,767,8,27,117);rect(282,767,8,27,117);
// Entry seam and visible overflight passage between west dock and membrane wheel.
line(390,679,427,735,10,68);rect(391,674,36,7,76);
// MEMBRANE DISTRICT - large side-elevation asymmetric perforated filter-wheel;
// unsupported scenery is forbidden; both lower spokes/axle connect to deck+piers.
rect(426,672,375,17,58);feet(459,770,689);
ring(619,485,143,171,17,62);
rect(607,637,26,43,58);rect(582,623,74,16,58);
rect(605,468,29,37,68);rect(613,476,13,13,77);
for(let i=0;i<7;i++){const angle=(i+.25)*Math.PI/3.5;line(619,485,619+115*Math.cos(angle),485+128*Math.sin(angle),8,117);}
line(619,484,520,579,7,117);line(619,484,721,562,7,117);
rect(464,684,90,10,62);rect(489,696,13,53,58);rect(542,696,13,53,58);
vessel(548,692,128,57,3,58);rect(558,692,14,9,70);rect(655,692,13,9,70);
rect(574,751,10,126,58);rect(653,751,11,126,58);
rect(479,744,247,12,117);panel(478,735,53);
rect(734,605,62,10,70);rect(749,615,8,62,117);panel(736,598,45);
// Crown access truss at height: reserve true 31x27 air void above.
line(449,415,485,344,11,58);line(485,344,619,316,10,117);
line(619,316,764,355,10,117);line(764,355,799,418,11,58);
// CASCADE DISTRICT - nonrepeating unequal hydraulics, three physically
// isolated (not communicating) full-water cartridges: no exposed water faces.
rect(826,690,395,14,62);feet(844,1191,704);
rect(835,589,123,13,62);rect(976,558,123,13,117);rect(1102,615,116,13,62);
vessel(848,520,93,66,3);vessel(978,471,105,84,3);vessel(1110,543,92,69,3);
rect(858,603,15,87,58);rect(938,603,15,87,58);
rect(999,573,14,117,58);rect(1073,573,14,117,58);
rect(1120,627,14,63,58);rect(1186,627,14,63,58);
line(878,518,966,467,11,117);line(1095,484,1104,538,11,117);
rect(841,476,88,10,70);panel(844,471,55);
rect(997,422,72,10,62);panel(1000,419,52);
rect(1134,496,75,11,70);panel(1143,491,51);
rect(862,717,316,9,117);rect(880,727,12,88,58);
rect(1164,727,12,98,58);rect(888,811,280,12,62);
rect(946,820,14,57,58);rect(1100,820,14,57,58);
panel(1022,809,65);rect(1039,816,13,48,117);
line(1220,641,1271,595,12,62);line(1211,705,1262,740,10,68);
// VITRIFICATION DISTRICT - inverted wide-mouth tapered hazard hood, not a
// repeating factory tower; controlled encapsulated hot cell below all works.
rect(1266,687,345,18,62);feet(1284,1575,705);
line(1358,358,1307,498,20,58);line(1307,498,1350,676,20,58);
line(1502,320,1572,495,20,58);line(1572,495,1535,676,20,58);
line(1358,358,1502,320,17,62);
line(1369,383,1335,494,9,117);line(1335,494,1377,648,9,117);
line(1487,367,1540,492,9,117);line(1540,492,1500,648,9,117);
rect(1380,647,132,11,58);rect(1395,658,18,29,58);rect(1480,658,18,29,58);
vessel(1389,559,116,82,8,58);rect(1403,557,87,6,104);
rect(1383,472,123,12,62);rect(1405,484,10,76,117);rect(1486,484,10,76,117);
rect(1426,441,37,17,76);line(1444,450,1444,472,9,117);
line(1510,351,1571,275,15,58);rect(1563,259,22,121,58);
rect(1553,259,41,13,62);rect(1564,244,18,17,101);
rect(1281,591,89,11,70);rect(1292,601,13,86,117);panel(1292,582,51);
rect(1535,602,86,10,70);rect(1540,612,10,75,117);panel(1547,592,50);
rect(1292,746,281,12,117);rect(1311,760,15,117,58);rect(1540,760,15,117,58);
rect(1343,815,181,12,62);panel(1456,804,54);
rect(1455,828,16,49,58);
line(1584,668,1648,626,12,68);
// EAST QUARANTINE DISPATCH - two unequal cyclones, descending
// decontamination transfer, accessible plant controls & final extraction lock.
rect(1648,654,352,15,58);feet(1668,1954,669);
rect(1670,511,305,11,62);
function cyclone(cx,top,r,bottom){line(cx-r,top+49,cx-r*0.70,top,13,58);line(cx-r*0.70,top,cx+r*0.65,top,13,58);line(cx+r*0.65,top,cx+r,top+50,13,58);line(cx-r,top+49,cx-15,bottom,14,58);line(cx+r,top+50,cx+15,bottom,14,58);line(cx-15,bottom,cx+15,bottom,12,62);rect(cx-13,bottom,26,655-bottom,58);}
cyclone(1740,337,62,612);cyclone(1880,274,49,618);
rect(1704,560,73,11,70);panel(1711,550,53);
rect(1810,580,65,10,62);panel(1814,570,44);
rect(1910,517,75,10,70);panel(1920,508,52);
rect(1755,673,12,82,117);rect(1894,673,13,82,117);
rect(1717,752,232,14,62);rect(1726,766,12,111,58);rect(1925,766,12,111,58);
rect(1770,809,125,12,117);panel(1808,800,54);rect(1830,820,12,57,58);
rect(1942,410,48,15,62);rect(1952,425,10,86,117);rect(1980,425,10,86,117);
line(1970,405,2013,357,11,58);rect(1993,350,28,10,76);
// Technical isolation surfaces and local dry return inspection stations.
for(const [x,y,w] of [[85,844,74],[463,845,62],[894,851,67],[1343,851,60],[1661,839,70]]){rect(x,y,w,10,117);rect(x+7,y+10,12,22,58);rect(x+w-17,y+10,12,22,58);panel(x+10,y-2,Math.max(36,w-20));}
// Material IDs 58,62,68,70,76,77,100,101,104,117,120 are inert
// fixed Solid/RuleKernel::None in accepted CyberSand; water #3 and lava
// #8 are physically mobile: initial fully enclosed cartridges ONLY.

// Physical couplers close deliberate load-path gaps in entered workfaces.
rect(137,590,17,42,58);rect(344,589,17,43,58);
rect(224,532,10,35,58);
rect(861,581,16,26,58);rect(1013,544,16,31,58);rect(1152,603,16,31,58);
rect(862,484,12,42,117);rect(1039,427,12,49,117);rect(1186,499,11,52,117);
rect(1517,812,29,14,62);rect(1458,805,13,18,58);
line(1268,637,1309,698,13,58);rect(1640,650,29,19,62);

// Closed first-stage load paths and Midge-clear 31x27 emergency entrances.
rect(112,590,18,20,58);rect(368,587,17,26,58);
rect(143,455,14,16,62);rect(367,455,14,16,62);
line(1236,614,1285,691,13,58);rect(1582,654,17,37,58);
// Dry pilot access doors and local bypass apertures. No liquid walls cut.
rect(108,468,52,86,0);rect(464,440,55,100,0);
rect(389,572,65,187,0);rect(1009,676,72,79,0);
rect(1260,675,77,84,0);rect(1805,635,90,125,0);
rect(369,550,13,52,58);rect(690,595,12,77,117);
return g;
}
module.exports={W,H,SEED,SITES,CROPS,COLORS,materialWorld};
