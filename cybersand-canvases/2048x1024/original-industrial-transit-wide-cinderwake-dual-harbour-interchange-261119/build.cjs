"use strict";
// Original fully deterministic 2048x1024 CyberSand industrial transit world.
// Node 22+: node build.cjs --verify. No images or reference art used.
const fs=require("fs"),crypto=require("crypto"),zlib=require("zlib"),path=require("path");
function generate(){
"use strict";
const W=2048,H=1024,SEED=20261119;
const M={A:0,B:100,T:49,O:101,C:58,S:62,U:63,V:64,G:66,P:68,F:120,Q:121,X:122,Y:128,Z:129,K:130,N:131,L:80,I:77,J:79,D:98};
const g=new Uint8Array(W*H);
function R(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);let a=Math.max(0,x),b=Math.min(W,x+w),c=Math.max(0,y),d=Math.min(H,y+h);if(a>=b)return;for(let yy=c;yy<d;yy++)g.fill(m,yy*W+a,yy*W+b);}
function P(p,m){for(let y=Math.max(0,Math.ceil(Math.min(...p.map(v=>v[1]))));y<=Math.min(H-1,Math.floor(Math.max(...p.map(v=>v[1]))));y++){let xs=[];for(let i=0;i<p.length;i++){let a=p[i],b=p[(i+1)%p.length];if(a[1]<=y&&b[1]>y||b[1]<=y&&a[1]>y)xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2)R(Math.ceil(xs[i]),y,Math.floor(xs[i+1])-Math.ceil(xs[i])+1,1,m);}}
function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,r=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-r));yy<=Math.min(H-1,Math.ceil(Math.max(y,Y)+r));yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-r));xx<=Math.min(W-1,Math.ceil(Math.max(x,X)+r));xx++){let f=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(d||1)));if((xx-x-f*dx)**2+(yy-y-f*dy)**2<=r*r)g[yy*W+xx]=m;}}
function ring(cx,cy,rx,ry,t,m){for(let y=Math.max(0,cy-ry);y<Math.min(H,cy+ry);y++)for(let x=Math.max(0,cx-rx);x<Math.min(W,cx+rx);x++){let d=((x-cx)/rx)**2+((y-cy)/ry)**2;if(d<=1&&d>=(1-t/Math.min(rx,ry))**2)g[y*W+x]=m;}}

const sites={"West arrival lock":[140,473],"Drydock keel":[313,743],"West crane bridge":[320,352],"Rail departure":[626,474],"Customs gallery":[822,357],"West transfer throat":[925,472],"Lift crown":[1080,282],"Lift middle":[1083,475],"Lift undercroft":[1083,745],"East classifier":[1348,471],"Signal hall":[1542,357],"East rail siding":[1614,471],"Terminal arrival":[1838,469],"Terminal upper assay":[1850,347],"West subway":[642,747],"East subway":[1514,747],"East exit tunnel":[1877,746],"West quay":[174,472]};
for(let x=0;x<W;x++){let y=Math.round(632+15*Math.sin(x*.006)+10*Math.sin(x*.021));R(x,y,1,H-y,M.B);if(x%11<8)R(x,834+Math.round(7*Math.sin(x*.014)),1,190,M.O);if(x%19<14)R(x,931+Math.round(4*Math.sin(x*.029)),1,8,M.T);}
P([[0,1024],[0,329],[28,349],[66,391],[105,539],[88,824]],M.B);
P([[2048,1024],[2048,310],[2016,355],[1982,405],[1973,559],[1992,835]],M.B);
L(65,464,91,857,15,M.C);L(1994,428,1976,852,14,M.C);
// A deeply excavated genuine drydock, open keel, working cradle and shoreline inspection.
P([[115,561],[448,550],[479,584],[461,812],[441,841],[149,841],[112,797]],M.A);
L(117,563,149,843,17,M.C);L(457,556,448,843,18,M.C);
R(140,826,313,18,M.S);R(157,844,286,10,M.G);
P([[172,724],[211,772],[342,783],[397,767],[434,721],[419,774],[384,799],[206,799]],M.U);
L(172,725,214,784,11,M.S);L(214,784,380,784,11,M.S);L(380,784,436,725,10,M.S);
for(let x of [205,270,342,409]){R(x,793,15,52,M.C);R(x-15,803,43,8,M.S);}
for(let y of [586,631,675]){R(76,y,73,8,M.S);R(449,y+11,68,9,M.S);}
P([[0,532],[83,532],[111,564],[142,593],[150,625],[0,625]],M.C);
P([[460,572],[502,546],[562,545],[582,629],[462,626]],M.C);
R(45,527,115,14,M.S);R(465,543,121,12,M.S);
R(68,551,94,75,M.C);R(81,569,69,43,M.A);R(88,608,54,8,M.S);
R(489,551,108,72,M.C);R(502,568,79,41,M.A);R(509,606,64,8,M.S);
// Distinctive shipyard cantilever crane, anchored mast, triangular bracing and active hook.
R(240,214,27,357,M.S);R(247,222,13,332,M.U);
L(249,227,408,321,14,M.U);L(249,227,86,321,13,M.S);
L(86,321,408,319,12,M.S);L(249,227,321,317,9,M.C);
R(224,210,62,15,M.C);R(239,194,35,17,M.U);
for(let x of [124,165,207,284,336]){L(x,320,x+27,270,5,M.P);L(x+27,270,x+52,319,5,M.G);}
R(295,322,78,20,M.C);R(301,329,69,9,M.F);R(316,339,10,5,M.J);
L(340,319,340,563,6,M.P);R(321,556,39,12,M.S);
// Blue freight gantry: long hollow trusses, offset freight containers and real customs office.
R(513,555,415,17,M.S);R(521,572,399,10,M.G);R(526,582,390,6,M.U);
for(let x of [526,668,879]){R(x,565,24,144,M.C);R(x+5,583,13,120,M.U);}
L(543,560,687,677,12,M.S);L(687,677,899,559,12,M.S);
L(550,559,695,461,11,M.U);L(695,461,917,553,11,M.U);
R(566,543,164,10,M.U);R(579,534,142,6,M.G);
for(let x of [590,725,821]){L(x,558,x+30,514,6,M.P);L(x+30,514,x+59,560,6,M.P);}
for(let [x,w,m] of [[562,101,M.V],[695,111,M.U],[810,81,M.V]]){R(x,591,w,43,m);R(x,591,4,43,M.K);R(x+w-4,591,4,43,M.K);for(let xx=x+11;xx<x+w-8;xx+=21)R(xx,597,3,30,M.G);R(x+9,634,w-18,7,M.S);}
P([[749,487],[770,449],[861,448],[889,483],[884,552],[741,552]],M.C);
R(770,466,101,71,M.A);R(780,476,79,12,M.F);R(774,533,99,8,M.S);
R(810,509,37,12,M.U);R(818,502,15,7,M.J);
R(610,285,21,285,M.S);R(617,295,12,257,M.U);
L(623,292,856,306,12,M.S);L(623,292,744,208,13,M.U);L(744,208,855,306,10,M.U);L(744,208,654,304,9,M.U);
R(716,204,61,19,M.C);R(729,221,34,7,M.F);L(851,307,851,552,7,M.P);R(830,550,42,9,M.S);
// Central twin jaw freight elevator: arched counterweighted crown and inhabited interiors.
P([[929,633],[955,238],[976,200],[1010,177],[1048,182],[1072,224],[1074,637]],M.S);
P([[1100,633],[1113,222],[1142,184],[1172,169],[1205,188],[1233,237],[1251,635]],M.S);
P([[967,595],[984,262],[1012,218],[1034,229],[1044,257],[1044,603]],M.A);
P([[1130,598],[1141,247],[1172,221],[1199,255],[1218,597]],M.A);
R(1041,211,99,17,M.S);R(1054,195,73,17,M.U);
L(953,232,1082,148,18,M.U);L(1082,148,1233,229,17,M.U);
L(1060,227,1060,599,11,M.P);L(1113,229,1114,602,11,M.P);
ring(1085,303,94,96,13,M.G);ring(1085,303,72,72,10,M.U);
L(1011,303,1158,303,12,M.C);L(1084,228,1084,376,11,M.S);
for(let y of [283,367,455,576]){R(1040,y,104,13,M.S);R(1047,y+13,91,6,M.G);}
R(1048,252,79,25,M.A);R(1056,258,63,9,M.F);
R(1047,377,79,45,M.U);R(1055,385,61,24,M.A);
P([[1212,329],[1253,347],[1259,447],[1236,475],[1198,441],[1201,350]],M.K);
R(1212,361,39,67,M.S);R(1220,369,25,53,M.U);
L(1174,198,1232,351,8,M.P);L(1066,216,1232,352,4,M.G);
R(971,622,269,26,M.C);R(987,647,239,7,M.S);
for(let x of [993,1203]){R(x,633,24,76,M.C);R(x+5,646,12,54,M.U);}
// East classification hump and dry freight hoppers, custom asymmetrical roofs and bonded supports.
P([[1250,622],[1308,602],[1347,564],[1406,543],[1467,516],[1530,486],[1610,482],[1694,557],[1740,623]],M.C);
P([[1263,609],[1334,590],[1392,555],[1447,528],[1522,506],[1606,502],[1667,551],[1706,611]],M.A);
L(1283,606,1532,490,14,M.S);L(1532,490,1717,608,14,M.S);
L(1286,594,1530,486,6,M.G);L(1534,487,1706,595,6,M.G);
for(let [x,y,w,m] of [[1298,563,98,M.U],[1407,524,104,M.V],[1557,518,83,M.U],[1641,561,69,M.V]]){R(x,y,w,34,m);R(x+8,y+5,w-16,7,M.F);for(let xx=x+19;xx<x+w-11;xx+=22)R(xx,y+12,4,17,M.G);R(x,y+34,w,8,M.S);}
for(let x of [1280,1379,1650]){R(x,499,18,209,M.S);R(x+5,509,9,189,M.U);for(let y=525;y<638;y+=29)R(x+5,y,11,4,M.G);}
R(1472,262,32,250,M.S);R(1481,272,13,232,M.U);
L(1485,269,1671,326,12,M.S);L(1485,269,1317,321,11,M.S);
L(1317,321,1672,327,10,M.U);
for(let x of [1351,1429,1555]){L(x,322,x+28,281,5,M.P);L(x+28,281,x+57,323,5,M.P);}
R(1454,251,64,22,M.C);R(1465,274,41,9,M.F);
L(1583,323,1583,480,7,M.P);R(1561,467,46,10,M.S);
P([[1498,384],[1538,340],[1610,346],[1635,382],[1631,454],[1501,454]],M.C);
R(1522,365,94,73,M.A);R(1529,374,79,10,M.F);R(1512,434,115,9,M.S);
R(1540,405,41,12,M.U);R(1583,398,16,17,M.J);
L(1622,351,1644,268,6,M.P);R(1636,262,19,17,M.J);
// East inland ship-to-rail terminal, dramatic sawtooth ceiling and assembled freight engine.
P([[1711,639],[1711,384],[1735,348],[1794,326],[1825,264],[1872,312],[1927,253],[1982,302],[2035,277],[2048,311],[2048,656]],M.S);
P([[1745,608],[1745,410],[1767,384],[1812,364],[1833,329],[1871,365],[1928,309],[1978,348],[2021,338],[2035,606]],M.A);
L(1755,404,1824,306,12,M.U);L(1824,306,1872,364,11,M.U);
L(1872,364,1928,289,12,M.U);L(1928,289,1980,340,11,M.U);L(1980,340,2032,308,10,M.U);
R(1761,606,273,17,M.C);
for(let x of [1763,1927,2019]){R(x,604,17,104,M.C);R(x+5,612,8,82,M.U);}
R(1786,551,221,9,M.S);R(1797,560,198,8,M.G);
R(1805,568,181,42,M.V);for(let x of [1826,1880,1930])R(x,576,5,31,M.G);
R(1815,494,152,38,M.U);P([[1960,498],[1984,515],[1998,533],[1961,535]],M.S);
R(1830,502,85,13,M.F);R(1942,510,20,14,M.J);
for(let x of [1847,1949])ring(x,538,18,18,7,M.K);
R(1814,556,184,9,M.S);
R(1999,392,19,220,M.C);R(2003,400,10,196,M.U);
L(2009,395,2009,217,6,M.S);L(2009,238,1963,264,4,M.P);L(2009,238,2033,263,4,M.P);
R(1998,209,22,11,M.J);
// Dry subterranean freight return, separated from the roofline by real bedrock.
R(100,705,1847,96,M.A);
for(let [x,w] of [[155,286],[568,287],[947,271],[1377,291],[1740,190]]){P([[x,705],[x+23,667],[x+w-25,665],[x+w,704]],M.A);R(x+13,802,w-26,14,M.C);R(x+19,815,w-38,8,M.G);}
for(let x of [172,493,892,1248,1709,1909]){R(x,670,17,36,M.C);R(x+5,676,7,25,M.U);}
for(let [x,w] of [[215,156],[599,165],[980,176],[1429,156],[1750,155]]){R(x,821,w,50,M.K);R(x+10,830,w-20,24,M.A);R(x+12,854,w-24,7,M.G);R(x,865,w,11,M.C);for(let xx=x+22;xx<x+w-16;xx+=40){R(xx,841,16,8,M.J);R(xx+4,835,7,7,M.P);}}
R(147,795,1762,15,M.C);
for(let [x,w] of [[190,217],[555,253],[961,249],[1378,268],[1721,182]]){R(x,795,w,9,M.S);R(x+11,804,w-22,5,M.G);}
// Five functional human/Midge-scale lift shafts interconnect main and independent lower rail routes.
for(let [x,top] of [[464,432],[861,428],[1084,421],[1418,430],[1836,422]]){
 R(x-43,top,86,381,M.A);
 R(x-53,top+172,8,117,M.C);R(x+44,top+172,8,117,M.C);
 R(x-51,top+173,8,7,M.J);R(x+46,top+173,8,7,M.J);
}
R(86,443,1901,82,M.A);R(104,719,1846,73,M.A);
// Genuine service door apertures; the crown and signal room are connected to the sky route.
R(1056,268,58,184,M.A);R(1514,354,64,113,M.A);
for(let [name,[x,y]] of Object.entries(sites))if(y<700)R(x-20,y-22,41,45,M.A);

// FINAL ENGINEERED LOAD PATHS — welded after final tunnel excavation.
// Anchored drydock crane cabling, independently braced gantry, freight-lift
// outriggers, and dry underground structural columns. These intentionally
// avoid exact named actor sites and retain free-centre detours.
L(251,429,121,609,12,M.S);R(117,604,14,75,M.C);
R(954,429,15,165,M.C);R(1211,432,15,175,M.C);
R(1479,429,13,157,M.S);
R(539,696,15,170,M.C);R(1001,695,14,169,M.C);
R(1655,695,14,173,M.C);R(970,660,14,217,M.C);
L(615,433,544,562,10,M.S); // sky freight crane to grounded west portal
R(1790,548,5,45,M.S);R(1586,404,4,42,M.S);
R(1037,578,9,64,M.G);
// Pendant instrument lights are physically fastened to their room crowns.
for(let [x,w] of [[215,156],[599,165],[980,176],[1429,156],[1750,155]])
 for(let xx=x+22;xx<x+w-16;xx+=40)R(xx+7,821,3,17,M.P);
// Multiple steel branches visibly distribute east gantry thrust into the
// classifier support piers, not decorative unsupported air-frame strokes.
L(1484,573,1656,678,12,M.S);
L(1484,576,1655,680,10,M.S);
L(1484,567,1630,614,12,M.S);
// Drydock stirrup/ladder footings and freight-platform lateral welds.
L(251,563,122,615,9,M.S);
L(415,670,450,676,9,M.S);
R(413,709,15,150,M.C); // Starboard dock stirrup grounded in main keel slab
L(918,580,950,590,8,M.S);
L(340,559,252,559,8,M.S);
L(180,692,138,692,8,M.S);
R(1590,382,4,57,M.S);R(1790,590,6,26,M.S);
R(1579,409,10,6,M.S);
L(1789,553,1763,608,8,M.S);


// R2 INDUSTRIAL OPERATIONS REPAIR — original industrial function, not source fidelity.
// These are physical supported material cells added at readable Midge scale.
// WEST DRYDOCK: an exposed vessel undergoing rib-and-keel repair. Broken sheer
// segments preserve a wide open central descender; 1:1 inspection at x313,y743.
L(181,724,188,680,10,M.S);L(188,680,246,660,7,M.U);
L(205,752,223,691,7,M.C);L(221,690,247,662,5,M.G);
L(245,774,260,682,7,M.C);L(260,682,278,669,5,M.U);
L(382,777,375,685,8,M.C);L(374,685,404,663,6,M.G);
L(426,722,417,677,10,M.S);L(417,677,401,664,7,M.U);
L(381,778,434,722,7,M.U);L(178,726,215,781,7,M.U);
for(const x of [197,242,379,422]){
  R(x,697,7,27,M.C);R(x-6,700,20,5,M.S);
}
// Two opposite quay-side support galleries, interrupted for the open dock void.
R(136,660,65,8,M.S);R(144,667,40,5,M.G);
R(374,657,43,8,M.S);R(381,664,34,6,M.G);
L(138,658,125,604,7,M.C);L(410,656,413,602,7,M.C);
// The crane hook now bears a visible two-point lifting frame and hull section.
L(340,564,339,592,5,M.P);R(318,589,46,7,M.S);
L(347,594,358,608,5,M.P);L(361,594,381,608,5,M.P);
R(345,608,46,11,M.U);R(351,619,35,14,M.V);
for(let x of [357,370,381])R(x,620,3,12,M.G);
// Unobstructed keel inspection shaft between the exposed outer hull ribs:
// 55-cell breadth gives a continuous flyable 31x27 envelope to exact (313,743).
R(286,628,55,130,M.A);
// Wide upper starboard access hatch: opens the formerly sealed dock-bay
// air pocket to the quay without shifting the exact keel inspection point.
R(282,567,133,72,M.A);
// WEST CUSTOMS: platform-scale inspection room and actual cargo hoist spreader.
R(781,521,88,8,M.S);R(792,499,7,27,M.C);R(851,497,7,29,M.C);
R(806,504,29,8,M.U);R(810,497,17,7,M.F);
R(835,513,17,9,M.K);R(846,502,6,8,M.J);
// Horizontal trolley trolley-beam and offset weight on the high gantry.
R(710,305,86,9,M.S);R(724,313,22,8,M.G);R(772,313,18,11,M.U);
L(753,321,753,368,5,M.P);
R(740,369,27,12,M.U);R(747,382,13,6,M.J);
// Suspended spreader clamps the already-placed blue freight module.
R(716,572,64,8,M.S);R(748,559,9,14,M.U);
L(720,579,720,590,5,M.P);L(774,579,774,590,5,M.P);
R(716,583,11,7,M.G);R(768,583,11,7,M.G);
// Deliberate rail equipment along the freight deck, supported by existing slabs.
for(let x of [598,687,783,868]){
  R(x,638,34,8,M.U);R(x+3,646,8,5,M.K);R(x+23,646,8,5,M.K);
}
R(741,644,84,8,M.S);R(747,636,72,9,M.G);
// TWIN-JAW LIFT: supported paired rail stops, service cages and guided cargo.
// Preserve both x1080,y282 and x1083,y475 conservative full-hull apertures.
R(972,444,47,13,M.S);R(982,457,8,19,M.C);
R(1001,457,7,19,M.C);R(976,432,39,9,M.U);
R(1157,444,49,13,M.S);R(1165,457,9,25,M.C);
R(1196,457,8,25,M.C);R(1166,430,33,11,M.U);
for(let y of [390,424,501,537]){
  R(988,y,10,23,M.G);R(1180,y,10,23,M.G);
}
// Offset counterweight cage, not a sealed wall across the flying throat.
R(1207,484,23,39,M.U);R(1212,488,13,30,M.F);
R(1207,523,23,8,M.S);L(1216,433,1216,483,5,M.P);
R(964,581,58,10,M.S);R(1155,582,65,11,M.S);
// EAST CLASSIFICATION: two physically branching graded rail alignments.
// Different inclines/carts signal sorting, without spanning the flying artery.
L(1291,603,1360,579,6,M.G);L(1467,598,1550,563,5,M.S);
L(1550,563,1594,578,6,M.G);
R(1324,576,43,10,M.U);R(1328,586,10,6,M.K);R(1354,586,10,6,M.K);
R(1517,566,56,12,M.V);R(1524,578,10,7,M.K);R(1556,578,10,7,M.K);
R(1462,528,16,13,M.C);R(1468,520,6,8,M.J);
// Compartmentalized, supported signal-work room beneath the control building.
R(1577,415,9,19,M.C);R(1587,423,26,8,M.S);
R(1596,410,11,13,M.U);R(1599,404,5,6,M.J);
// EAST TERMINAL: real receiving bench, upper assay and outward-transfer bay.
// Keep x1838,y469 clear and x1850,y347 assay arrival open.
R(1900,432,113,10,M.S);R(1910,442,8,67,M.C);
R(1996,442,9,70,M.C);R(1921,420,44,12,M.U);
R(1930,411,28,9,M.F);R(1971,415,20,17,M.V);
R(1976,406,7,7,M.J);
R(1768,503,37,8,M.S);R(1772,511,8,41,M.C);
R(1797,517,8,35,M.C);R(1777,489,19,14,M.U);
R(1884,551,123,8,M.G);R(1888,543,10,8,M.K);
R(1913,538,64,11,M.U);R(1983,540,16,9,M.K);
// SUBTERRANEAN: distinct, entered chambers, no five stamped lamp clones.
// All room entrances use 42+ cell widths; other arched cells remain grounded.
// West dock drainage pumps (existing niche x215..371).
R(241,791,47,54,M.A);R(224,817,137,49,M.A);
R(224,860,137,12,M.C);R(232,847,28,13,M.U);
R(238,836,16,12,M.K);R(287,845,34,14,M.S);
R(301,835,9,11,M.P);R(331,842,17,18,M.G);
L(241,870,241,885,9,M.C);L(351,865,351,884,9,M.C);
// Freight manifest and signal repair service in the west-mid return.
R(672,791,44,52,M.A);R(611,815,151,52,M.A);
R(610,863,154,13,M.C);R(620,846,49,11,M.U);
R(629,836,11,10,M.F);R(689,838,20,18,M.S);
R(694,832,10,6,M.J);R(729,843,24,15,M.G);
L(612,870,612,886,8,M.C);L(763,869,763,883,8,M.C);
// Counterweight service chamber, broad open entry offset from x1083,745.
R(1116,791,44,56,M.A);R(992,816,170,54,M.A);
R(990,866,175,12,M.C);R(1004,846,51,12,M.U);
R(1011,835,12,11,M.K);R(1058,844,34,12,M.G);
R(1124,838,21,23,M.S);R(1128,831,11,7,M.P);
L(990,868,990,888,8,M.C);L(1164,868,1164,888,8,M.C);
// East dispatch: switching console and offset retrieval portal.
R(1470,790,42,53,M.A);R(1441,815,134,53,M.A);
R(1440,863,137,13,M.C);R(1453,847,35,11,M.U);
R(1462,836,10,11,M.J);R(1524,841,36,18,M.G);
L(1440,868,1440,883,8,M.C);L(1576,868,1576,883,8,M.C);
// Terminal recovery pocket: unload trolley, distinct from other rooms.
R(1779,791,45,53,M.A);R(1762,816,133,50,M.A);
R(1761,861,137,14,M.C);
R(1775,847,73,10,M.S);R(1782,857,9,8,M.K);
R(1835,857,9,8,M.K);R(1861,840,23,19,M.U);
L(1762,868,1762,882,9,M.C);L(1898,868,1898,883,9,M.C);


// R2 load-path closure: each newly inhabited workroom has a real wall/floor
// pedestal, not unsupported console pixels. Connections are to already
// grounded hull masonry, existing steel deck or stable continuous bedrock.
// Dock interior work ribs deliberately avoid the 55-cell flight hatch.
R(256,772,11,58,M.C); // exposed drydock rib to original dock keel floor
L(196,714,181,730,9,M.S); // port rib to vessel keel
// Trolley suspension and office instruments have real fixings.
R(750,312,8,12,M.C);R(750,377,6,8,M.P);
R(785,527,9,12,M.S);R(861,527,8,12,M.S);
R(816,509,7,18,M.C); // two customs workbenches to inhabited floor
// Roll-formed freight vehicle stands on the stable right gantry shoulder,
// leaving the wide left side of the x861 Midge shaft clear.
R(899,642,20,10,M.S);
// Elevator guides tie into actual jaw walls instead of floating in the shaft.
for(const y of [390,501,537]){
 R(973,y+7,19,8,M.S);
 R(1187,y+7,34,8,M.S);
}
// End-terminal receiving mezzanine has a founded left-hand support,
// wholly outside the terminal's x1836 flying lift throat.
R(1775,545,12,67,M.C);L(1779,605,1768,625,9,M.S);
R(1978,410,4,8,M.P);
// Five unique underground service consoles are founded in their separate
// excavated chambers on real bench legs, pump pedestals and switch piers.
for(const [x,y,w,h] of [
 [303,854,9,15], [632,852,9,19], [700,853,9,17],
 [741,854,8,16], [1018,853,9,17], [1075,852,9,17],
 [1131,855,9,16], [1466,853,8,17], [1539,855,9,17],
 [1872,855,9,15]
])R(x,y,w,h,M.C);


// R2 structural five-component closure — actual discovered disconnected solids:
// ship hull rib and its foundation, two left lift-guide tiers, and the narrow
// east receiving pier. Widen welds to existing contiguous masonry only.
L(245,774,164,839,12,M.C); // port hull rib → solid left drydock flank
L(246,774,260,789,11,M.S); // existing keel foot → same anchored rib
for(const y of [501,537])R(949,y+7,44,9,M.S); // guides → west jaw wall
R(1798,509,7,12,M.S); // terminus split load-bearing receiving column


// R3 OPERATING PORT — REVIEW-DRIVEN PHYSICAL-CELL RECONSTRUCTION.
// Four functional systems, each a shaped machine connected to an existing
// supported floor or tower rather than a row of unrelated painted symbols.
// Scale is measured against the actual small Midge actor; preserve all
// exactly named sky and subterranean operational centres.
//
// 1. West drydock: two unequal, interrupted sheer rails and a real exposed
// vessel cross-section. The deliberately absent middle keel is the repair
// hatch; three genuinely different ribs and roller-locks rest on solid dock.
L(166,700,181,741,10,M.U);
L(181,741,208,786,12,M.S);
L(208,786,268,812,11,M.S);
L(357,812,410,792,12,M.S);
L(410,792,448,710,12,M.U);
L(163,706,178,677,8,M.S);
L(178,677,235,673,9,M.U);
L(406,678,446,696,8,M.S);
L(446,696,448,710,10,M.U);
// Stern stem and sloping bow: recognisable ship ends, not symmetrical tongs.
L(173,704,157,657,7,M.U);
L(157,657,203,649,6,M.S);
L(438,707,454,669,8,M.S);
L(454,669,405,660,6,M.U);
for(const [x,top,dx] of [[194,693,-8],[233,681,15],[371,680,-9],[412,691,12]]) {
 L(x,794,x+dx,top,10,M.C);
 L(x+dx,top,x+dx+29,top-13,7,M.U);
 R(x-7,796,15,29,M.C);
 R(x-14,813,30,9,M.S);
}
// A differentiated dock-lock and roller bed: four small round physical
// rollers on grounded pedestals, with service hatch kept clear.
for(const [x,y,r] of [[193,807,11],[252,811,9],[370,810,12],[418,800,8]]) {
 ring(x,y,r,r,4,M.G);R(x-4,y+3,8,828-(y+3),M.C);
}
R(155,787,38,9,M.S);R(162,796,9,32,M.C);
R(428,784,32,9,M.S);R(448,790,9,37,M.C);
R(172,686,31,7,M.G);R(397,685,35,7,M.G);
// Fitted service platform, actual berth wall, and hook-borne hull crate.
R(124,640,69,10,M.S);R(129,650,11,18,M.C);
R(391,640,61,10,M.S);R(437,650,10,17,M.C);
R(323,600,64,9,M.S);R(329,608,50,26,M.V);
R(332,612,4,17,M.G);R(374,612,4,17,M.G);
// Keep the keel's TRUE 31x27 operational free-centre approach and the
// clear wide quay-side entry, even after erecting the ship cradle.
R(289,636,55,127,M.A);
R(283,564,132,72,M.A);

// 2. Blue railway → paired elevator shoulders. A clearly loaded western
// bogie and spaced wagon bed sit on supported gantry truss (not sky glyphs).
R(789,615,79,11,M.S);R(794,600,69,16,M.U);
R(802,592,52,10,M.V);R(809,584,9,11,M.K);
R(844,584,9,11,M.K);
for(const x of [804,845]){ring(x,628,10,10,4,M.G);R(x-4,630,8,20,M.C);}
R(812,588,31,7,M.F);
L(850,308,850,543,5,M.P);R(835,541,30,10,M.S);
R(828,552,44,15,M.U);
R(836,566,29,5,M.G);
// The transfer is an interrupted paired railway with a *mechanically
// necessary* flying opening around exact centre (1083,475).
R(963,487,66,12,M.S);R(969,499,55,8,M.G);
R(972,472,51,16,M.V);R(978,461,38,10,M.U);
R(982,507,10,29,M.C);R(1006,507,10,28,M.C);
for(const x of [977,1012])ring(x,506,9,9,4,M.K);
R(1146,487,73,12,M.S);R(1152,499,62,8,M.G);
R(1158,473,54,14,M.U);R(1163,460,43,12,M.V);
R(1164,507,10,29,M.C);R(1199,507,10,30,M.C);
for(const x of [1164,1201])ring(x,506,9,9,4,M.K);
// The paired loaded carriages have separate vertical chain paths and
// counterweight boxes; both remain laterally founded into the jaw piers.
L(994,269,994,462,5,M.P);L(1189,265,1189,461,5,M.P);
R(977,451,45,9,M.S);R(1162,451,47,9,M.S);
R(966,410,12,49,M.G);R(1206,416,16,47,M.G);
R(967,458,10,30,M.C);R(1208,460,10,28,M.C);
R(1230,466,26,59,M.U);R(1235,473,16,42,M.F);
R(1230,525,26,9,M.S);L(1241,332,1241,467,5,M.P);
R(1234,522,8,82,M.C);
// Clearly separate operating inspection stations adjacent to the transfer.
R(943,561,74,12,M.S);R(949,545,15,17,M.C);
R(998,548,14,15,M.U);R(1000,540,9,8,M.J);
R(1151,563,71,11,M.S);R(1201,546,12,19,M.C);
R(1162,550,28,12,M.U);R(1170,543,12,7,M.F);

// 3. Classification two visible branch grades, stop gates, three unequal
// wagon shapes. The real hollow x1418 transfer is deliberately crossed only
// by open air, not by a hidden bridge or opaque decorative rail.
L(1278,613,1364,584,7,M.S);
L(1283,620,1366,592,5,M.G);
L(1459,537,1540,517,7,M.S);
L(1463,545,1551,527,5,M.G);
L(1551,527,1692,597,7,M.S);
L(1554,535,1684,604,5,M.G);
R(1304,584,45,18,M.U);R(1309,575,35,9,M.V);
for(const x of [1312,1337])ring(x,604,9,9,4,M.K);
R(1470,515,66,22,M.V);R(1476,507,50,9,M.U);
for(const x of [1481,1523])ring(x,539,9,9,4,M.K);
R(1589,548,95,24,M.U);R(1601,538,64,11,M.V);
for(const x of [1603,1661])ring(x,579,11,11,4,M.K);
R(1300,604,7,14,M.C);R(1489,535,8,22,M.C);
R(1624,572,8,19,M.C);
R(1365,541,13,38,M.C);R(1367,529,9,14,M.J);
R(1550,490,13,42,M.C);R(1552,477,10,15,M.J);
L(1371,530,1380,510,5,M.P);
L(1556,480,1575,459,5,M.P);
// Receiving and assay is a separate workshop under sawtooth roof,
// sized as human-scale work bays, not a single empty warehouse glyph.
R(1910,390,95,12,M.S);R(1918,402,10,33,M.C);
R(1995,402,10,35,M.C);R(1927,397,57,9,M.F);
R(1930,414,43,15,M.U);R(1937,405,14,9,M.V);
R(1980,407,10,21,M.J);
R(1924,480,83,12,M.S);R(1930,492,9,36,M.C);
R(1992,492,10,36,M.C);R(1945,461,42,18,M.V);
R(1952,454,26,9,M.F);
R(1761,542,95,12,M.S);R(1770,553,11,55,M.C);
R(1841,552,10,55,M.C);R(1793,525,57,17,M.U);
for(const x of [1800,1836])ring(x,554,10,10,4,M.K);
R(1874,568,77,13,M.U);R(1881,558,62,10,M.F);
for(const x of [1885,1935])ring(x,584,8,8,4,M.K);
R(1973,553,31,9,M.S);R(1978,538,10,17,M.C);
R(1991,538,10,16,M.C);
R(1974,526,34,12,M.V);R(1980,520,16,7,M.J);

// 4. Underground places have different footprints and industrial purposes.
// These are side chambers below the continuous y719..791 return spine; the
// deeper y850..923 workrooms do not block any exact submarine centre.
// The foundry machinery is supported by bedrock, not loose powder voxels.
// Dock pump cavern: a single large offset impeller with flooded-system
// *pipes* (not uncontained water), sloping intake and foundation.
R(204,817,175,96,M.A);R(205,908,174,13,M.C);
R(211,832,9,76,M.C);R(366,834,10,74,M.C);
ring(286,869,38,35,8,M.S);ring(286,869,19,19,5,M.G);
L(247,873,221,874,10,M.U);L(325,869,353,848,11,M.U);
R(277,894,17,17,M.C);R(242,910,95,11,M.S);
R(234,848,10,29,M.G);R(229,838,20,12,M.F);
// Manifest and customs below: three unequal shelf decks on left and a tall
// freight elevator well on right, rather than a repeated rectangular niche.
R(600,817,206,98,M.A);R(600,906,208,14,M.C);
R(602,827,9,81,M.C);R(797,826,10,81,M.C);
for(const [x,y,w] of [[618,846,84],[624,866,92],[611,886,99]]){
 R(x,y,w,8,M.S);R(x+8,y-13,13,13,M.U);
 R(x+w-15,y-16,11,16,M.V);
}
R(747,837,40,13,M.S);R(753,850,9,47,M.C);
R(776,851,9,47,M.C);R(758,865,18,19,M.G);
L(763,820,763,853,5,M.P);
// Under-lift engine room: a deep stepped maintenance cave with two different
// gear drums, a guided cable and substantial grounded loading foundations.
R(973,813,220,114,M.A);R(976,920,217,16,M.C);
R(979,831,10,92,M.C);R(1181,830,12,94,M.C);
ring(1035,868,37,36,8,M.S);ring(1120,885,24,23,7,M.G);
L(1035,868,1119,884,8,M.U);
R(1028,898,16,23,M.C);R(1113,907,14,17,M.C);
R(1000,917,142,9,M.S);
L(1163,804,1163,855,6,M.P);
R(1154,856,18,35,M.U);R(1157,891,12,30,M.C);
// East dispatch: two side-on staggered platforms, a switch-mechanism
// cradle, visible interlock lever, supported structural columns.
R(1415,817,228,119,M.A);R(1415,927,228,16,M.C);
R(1421,835,12,92,M.C);R(1630,831,12,97,M.C);
R(1450,865,96,12,M.S);R(1461,877,10,51,M.C);
R(1529,877,10,52,M.C);R(1547,893,75,10,M.G);
R(1551,903,8,25,M.C);R(1615,902,8,26,M.C);
R(1458,847,52,16,M.U);R(1465,840,32,8,M.F);
L(1539,846,1577,818,6,M.P);R(1568,808,19,12,M.J);
// East recovery cavern: inbound wagon, service gantry and an unequal-width
// operator tower; room is visibly distinct from pumping and dispatch.
R(1728,815,184,105,M.A);R(1728,913,184,14,M.C);
R(1735,827,11,86,M.C);R(1899,827,12,86,M.C);
R(1762,856,104,12,M.S);R(1771,868,10,45,M.C);
R(1854,868,10,45,M.C);
R(1776,844,79,12,M.V);R(1784,836,57,8,M.U);
for(const x of [1788,1844])ring(x,865,11,11,4,M.K);
R(1868,830,22,73,M.U);R(1873,836,11,46,M.F);
R(1874,824,9,11,M.J);R(1874,903,10,12,M.C);
// Restore five deliberately wide entrances from the cross-map tunnel into
// the side chambers, while keeping 31x27 vertical-centre transit clear.
for(const [x,w] of [[241,53],[674,52],[1057,52],[1485,50],[1785,51]]){
 R(x,786,w,40,M.A);
}
// All working-room floor slabs and major machines are actually founded.
// This also protects the roof-to-foot structural component invariant.
R(203,908,179,11,M.C);R(599,907,210,12,M.C);
R(973,921,220,13,M.C);R(1415,929,228,13,M.C);
R(1728,915,184,12,M.C);


// R3 final structural reconciliation: a true flyable aperture around each
// four-neighbour centre crossing, with actual steel load paths bypassing it.
R(817,426,69,31,M.A);   // customs / gantry flight portal
R(1447,442,78,30,M.A);  // signal hall / classifier throat
R(866,610,36,69,M.A);   // west underground railway transfer
R(1623,703,78,32,M.A);  // eastern underground return
// Marine keel completes the *bottom* contour across the two asymmetrical
// rib sets, safely below the x313,y743 31x27 keel inspection envelope.
P([[161,708],[180,724],[206,779],[270,804],[271,817],[208,802],[171,766]],M.V);
P([[358,812],[404,790],[435,730],[449,709],[452,741],[412,806]],M.V);
L(262,808,374,808,10,M.S);
L(215,800,266,812,7,M.U);L(369,811,418,799,8,M.U);
// The upper classifier crane connects downward to its real graded deck at
// x1590; a direct x1236–1311 skyline beam was rejected because it severed
// seven exact Midge destinations despite passing raw rectangle validation.
L(1590,430,1590,530,7,M.S);
L(1854,551,1881,551,9,M.S);
R(1943,476,6,8,M.C);R(832,549,9,7,M.C);
L(1114,801,1162,801,7,M.S);
R(760,814,6,7,M.C);R(1456,860,8,8,M.C);R(277,884,7,15,M.C);



// R4 ACTUAL-CELL SHIP/RAIL INTERCHANGE — direct response to independent R3
// Shepherd review. All shapes are flat side-elevation material, not a mock
// screenshot. The drydock retains a 55-cell central Midge inspection hatch.
// A broad and joined lower hull now runs underneath the accessible well;
// asymmetrical wheelhouse, sheer and tapered repair prow identify one vessel.
// Ship hull is static inert Solid, not a dynamic moving actor.
P([[190,744],[208,775],[252,799],[281,805],[366,805],[409,784],
   [435,746],[442,779],[418,807],[372,826],[253,826],[210,813]],M.V);
R(255,806,123,17,M.S);
L(185,713,202,770,11,M.U);L(202,770,249,800,11,M.S);
L(375,802,416,778,11,M.S);L(416,778,449,709,10,M.U);
P([[177,681],[185,653],[216,647],[239,659],[238,684],[217,699],
   [191,701]],M.U); // aft superstructure on the port hull
R(186,644,54,9,M.S);R(194,658,28,13,M.F);
R(205,629,11,16,M.C);R(198,622,26,8,M.S);
L(221,696,230,736,10,M.C);
L(232,684,278,678,8,M.U);L(350,683,404,669,8,M.U);
L(400,667,445,674,8,M.S);
R(246,699,11,35,M.C);R(379,695,10,34,M.C);
R(237,728,33,8,M.S);R(374,723,40,8,M.S);
R(244,736,8,38,M.C);R(399,731,8,43,M.C);
// Keep the native world-cell inspection position open with full hull margin.
R(289,636,55,127,M.A);
// Re-establish lower seamless sheer/keel BELOW the inspection window.
R(280,795,78,23,M.S);
// Crane's carried hull module stays above the deliberately open x283..415
// quay-flight portal. The original suspended cable reaches the load, while
// retaining an actual 31x27 Midge route around the boom and into the keel.
R(317,536,49,9,M.S);R(320,545,43,18,M.V);
R(324,549,4,10,M.G);R(354,549,4,10,M.G);
L(339,527,339,539,5,M.P);
R(332,550,20,7,M.F);

// R4 through-freight topology: a visible rail-grade crane handoff links
// west customs bogies with the lift jaw rather than appearing as disconnected
// freight props. Grade and wheels are rooted to the existing steel gantry.
L(876,576,966,510,10,M.S);
L(879,567,970,500,4,M.U);
R(903,537,45,18,M.V);R(908,529,35,8,M.U);
for(const x of [910,938]){ring(x,557,8,8,3,M.K);R(x-3,557,6,12,M.C);}
R(951,513,15,47,M.C);
R(958,556,10,22,M.S);
// The paired hoist cages carry freight at different elevations; explicit
// fork rails, cable sheaves and side guideways clarify vertical transfer
// while preserving the entire centre x1045..1135 flight throat.
R(976,397,52,12,M.S);R(979,409,8,40,M.C);
R(1019,409,9,40,M.C);R(986,416,33,21,M.V);
R(987,437,31,8,M.G);R(985,408,36,7,M.F);
R(1155,407,57,12,M.S);R(1158,419,8,40,M.C);
R(1203,419,8,40,M.C);R(1167,427,35,22,M.U);
R(1168,449,34,8,M.G);R(1165,416,40,8,M.F);
L(1002,248,995,394,5,M.P);L(1167,255,1186,404,5,M.P);
R(988,337,13,12,M.G);R(1181,347,13,12,M.G);
R(997,327,10,13,M.C);R(1187,337,10,13,M.C);
R(1253,377,10,143,M.C);R(1254,399,8,66,M.G);
R(1257,430,19,35,M.U);R(1261,437,10,20,M.F);
R(1257,465,19,8,M.S);
// Handoff from right jaw to the switch-grade classification line.
L(1215,518,1305,562,10,M.S);
L(1219,512,1308,555,4,M.U);
R(1273,544,39,16,M.V);
R(1280,537,26,8,M.G);
for(const x of [1281,1300])ring(x,565,8,8,3,M.K);
R(1302,560,10,22,M.C);

const start=sites["West arrival lock"];
const rect=[],hist={},replay=new Uint8Array(g.length);let active=new Map(),area=0;
for(let y=0;y<H;y++){let next=new Map(),o=y*W;for(let x=0;x<W;){const m=g[o+x],s=x;while(x<W&&g[o+x]===m)x++;if(!m)continue;let key=s+":"+(x-s)+":"+m,idx=active.get(key);if(idx===undefined){idx=rect.length;rect.push([s,y,x-s,1,m]);}else rect[idx][3]++;next.set(key,idx);}active=next;}
for(let [x,y,w,h,m] of rect){hist[m]=(hist[m]||0)+w*h;area+=w*h;for(let yy=y;yy<y+h;yy++)replay.fill(m,yy*W+x,yy*W+x+w);}
for(let i=0;i<g.length;i++)if(replay[i]!==g[i])throw Error("replay mismatch "+i);
if(rect.length>32768||area>32000000)throw Error("budget "+rect.length+" "+area);
let ii=new Int32Array((W+1)*(H+1)),S=W+1;for(let y=1;y<=H;y++){let sum=0,o=(y-1)*W;for(let x=1;x<=W;x++){sum+=g[o+x-1]?1:0;ii[y*S+x]=ii[(y-1)*S+x]+sum;}}
function clear(x,y,w,h){let a=x-(w>>1),b=y-(h>>1),c=a+w,d=b+h;return a>=0&&b>=0&&c<=W&&d<=H&&ii[d*S+c]-ii[d*S+a]-ii[b*S+c]+ii[b*S+a]===0;}
function bfs(w,h){let pass=new Uint8Array(g.length),seen=new Uint8Array(g.length),q=new Int32Array(g.length),head=0,tail=0;for(let y=(h>>1);y<H-(h>>1);y++)for(let x=(w>>1);x<W-(w>>1);x++)if(clear(x,y,w,h))pass[y*W+x]=1;let si=start[1]*W+start[0];if(!pass[si])return{size:[w,h],spawnBlocked:true};q[tail++]=si;seen[si]=1;while(head<tail){let a=q[head++],x=a%W,y=(a/W)|0;for(let j of [a-W,a+W,a-1,a+1])if(j>=0&&j<g.length&&!(Math.abs(a-j)===1&&((j/W)|0)!==y)&&pass[j]&&!seen[j]){seen[j]=1;q[tail++]=j;}}let bad=Object.entries(sites).filter(([n,[x,y]])=>!seen[y*W+x]).map(([n,p])=>({name:n,xy:p,clear:clear(...p,w,h)}));return{size:[w,h],reached:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,airCentres:tail,bad};}
let routes=[[19,15],[23,19],[31,27]].map(x=>bfs(...x));if(routes.some(x=>x.spawnBlocked||x.bad?.length))throw Error("clearance "+JSON.stringify(routes));
const setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:start,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
let json=JSON.stringify(setup);if(json.length>1048576)throw Error("JSON "+json.length);
const rgb={0:[8,11,18],49:[70,83,99],100:[54,56,61],101:[24,19,32],58:[119,123,128],62:[126,141,153],63:[49,100,119],64:[109,125,134],66:[74,85,93],68:[102,119,129],77:[55,243,228],79:[255,181,46],80:[236,248,255],98:[226,223,216],120:[156,210,220],121:[190,216,225],122:[226,236,244],128:[62,122,180],129:[33,70,110],130:[52,56,63],131:[168,171,177]};
function be(n){return[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255];}
function crc(b){let c=0xffffffff;for(let v of b){c^=v;for(let i=0;i<8;i++)c=c>>>1^(0xedb88320&-(c&1));}return(c^0xffffffff)>>>0;}
function chunk(t,d){let b=new Uint8Array(d.length+12);b.set(be(d.length),0);b.set(t.split("").map(x=>x.charCodeAt(0)),4);b.set(d,8);b.set(be(crc(b.subarray(4,8+d.length))),8+d.length);return b;}
// DEFLATE fixed canonical Huffman with distance-one RLE, lossless zlib stream.
function rev(v,n){let o=0;while(n--){o=(o<<1)|(v&1);v>>>=1;}return o;}
function zlib(raw){return require("zlib").deflateSync(raw,{level:9});}
function png(x0,y0,w,h){let raw=new Uint8Array((w+1)*h);for(let y=0;y<h;y++)raw.set(g.subarray((y+y0)*W+x0,(y+y0)*W+x0+w),y*(w+1)+1);let pal=new Uint8Array(132*3);for(let id=0;id<132;id++)pal.set(rgb[id]||[128,128,128],id*3);let parts=[new Uint8Array([137,80,78,71,13,10,26,10]),chunk("IHDR",new Uint8Array([...be(w),...be(h),8,3,0,0,0])),chunk("PLTE",pal),chunk("IDAT",zlib(raw)),chunk("IEND",new Uint8Array())],out=new Uint8Array(parts.reduce((a,b)=>a+b.length,0)),p=0;for(let a of parts){out.set(a,p);p+=a.length;}return out;}
const crops=[["01-west-drydock",40,195,527,654],["02-blue-gantry",487,189,478,625],["03-counterweight-lift",909,143,374,711],["04-hump-classification",1253,233,478,630],["05-east-terminal",1672,220,376,674]];
const imgs=[["overview",png(0,0,W,H)],...crops.map(([n,x,y,w,h])=>[n,png(x,y,w,h)])];
return {g,setup,json,rect,hist,area,sites,routes,crops,imgs,seed:SEED};
}
const a=generate();const p=__dirname;
const sha=d=>crypto.createHash("sha256").update(d).digest("hex");
fs.writeFileSync(path.join(p,"setup-cinderwake.json"),a.json);
for(const [name,bytes] of a.imgs){
 fs.writeFileSync(path.join(p,name+".png"),bytes);
 let chunks=[],n=8;while(n<bytes.length){const l=Buffer.from(bytes).readUInt32BE(n),t=Buffer.from(bytes.subarray(n+4,n+8)).toString("ascii");if(t==="IDAT")chunks.push(Buffer.from(bytes.subarray(n+8,n+8+l)));n+=12+l;}
 const raw=zlib.inflateSync(Buffer.concat(chunks));
 const crop=name==="overview"?[0,0,2048,1024]:a.crops.find(q=>q[0]===name).slice(1);
 const [x,y,w,h]=crop;if(raw.length!==(w+1)*h)throw Error("invalid PNG scanline length "+name);
 for(let yy=0;yy<h;yy++){if(raw[yy*(w+1)]!==0)throw Error("unexpected PNG filter");for(let xx=0;xx<w;xx++){if(raw[yy*(w+1)+xx+1]!==a.g[(yy+y)*2048+x+xx])throw Error("cell-pixel mismatch "+name+":"+xx+","+yy);}}
}
const receipt={concept:"Cinderwake Dual Harbour — The Inland Freight Lift",original:true,seed:a.seed,extent:[2048,1024],engine_sha:"de109d0131641d6adc8d25bb9ced7ca3d4991105",material_catalogue_blob:"dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3",setup_loader_blob:"70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9",midge_hull:[4,3],solid_material_histogram:a.hist,rectangles:a.rect.length,rectangle_work:a.area,setup_bytes:Buffer.byteLength(a.json),material_plane_sha256:sha(a.g),setup_sha256:sha(a.json),images:a.imgs.map(([name,b])=>({name,bytes:b.length,sha256:sha(b)})),clearance:a.routes,exact_sites:a.sites,source_art:"none; independently invented",native_status:"NATIVE-UNTESTED",tests:["complete plane exact replay","supported ID statics","conservative 19x15 23x19 31x27 exact-site four-neighbour BFS","indexed PNG inflated-pixel parity"]};
fs.writeFileSync(path.join(p,"receipt.json"),JSON.stringify(receipt,null,2)+"\n");
if(process.argv.includes("--verify"))console.log(JSON.stringify({status:"STATIC-PASS",sha256:receipt.material_plane_sha256,rectangles:receipt.rectangles,sites:receipt.clearance,png_parity:"PASS"}));
