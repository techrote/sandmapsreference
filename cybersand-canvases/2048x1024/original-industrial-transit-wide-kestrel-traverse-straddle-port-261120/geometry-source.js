// KESTREL TRAVERSE — from-scratch physical layout, strict x/y side elevation.
// Phases: native inert terrain; drydock; grounded straddle transfer; saddle-arch
// freight bridge; switchback classification; service-grade return.
const g=new Uint8Array(N);
const sites={
"Breakwater arrival":[120,440],"Ship service gangway":[310,570],
"Quay waybill office":[452,465],"Drydock keel service":[320,835],
"West sky lookout":[262,165],"Crane A-frame inspection":[689,171],
"Straddle load receiver":[738,451],"Straddle underframe":[789,624],
"Arch west approach":[968,455],"Underarch cargo sling":[1081,462],
"Void shipping lane":[1220,441],"Arch east approach":[1457,455],
"Switchback signalman":[1544,468],"Upper branch siding":[1640,389],
"Sorter transfer stage":[1723,522],"East freight manifest":[1848,472],
"Outbound customs":[1940,464],"Upper arch flyway":[1143,165],
"East roof lookout":[1785,166],"Pump repair station":[272,850],
"Portal motor chamber":[700,851],"Arch undercroft repair":[1180,852],
"Switchgear repair":[1590,852],"Outbound recovery bay":[1880,850]};
function B(x,y,w,h,m){R(x,y,w,h,m);}
function beam(x,y,X,Y,t,m){L(x,y,X,Y,t,m);}
function platform(x,y,w){R(x,y,w,12,M.STEEL);}
function cabinet(x,y,w,h){R(x,y,w,h,M.WALL);R(x+7,y+7,w-14,Math.max(5,h-15),M.STEEL);}
// Original landscape: ship repair crescent, inland rise, deep dry central cut.
for(let x=0;x<W;x++){
 let y=742+Math.round(11*Math.sin(x*.008)+6*Math.sin(x*.024));
 if(x>900&&x<1450)y+=Math.round(95*(1-Math.abs(x-1175)/275));
 if(x>1690)y-=Math.round(51*Math.min(1,(x-1690)/358));
 R(x,y,1,H-y,M.ROCK);
}
P([[0,1024],[0,339],[31,350],[57,399],[79,551],[99,767],[77,929]],M.ROCK);
P([[2048,1024],[2048,334],[2020,354],[2008,490],[2007,802],[2041,951]],M.ROCK);
R(0,991,W,33,M.WALL);
P([[126,613],[170,589],[468,589],[512,648],[502,801],[126,801]],M.AIR);
// Wide, genuinely traversable lower rail and five distinct service bays.
R(90,793,1860,94,M.AIR);
for(let [x,w] of [[154,235],[520,236],[931,321],[1470,224],[1794,179]]){
 R(x,858,w,112,M.AIR);R(x,958,w,13,M.STEEL);
}
// Sheer/hull; one aft pilot station, ribbed keel, repair blocks.
P([[155,711],[196,690],[303,691],[416,676],[468,698],[454,773],[403,797],[229,800],[175,755]],M.STEEL);
P([[180,717],[212,704],[418,706],[443,704],[437,753],[396,781],[230,784],[194,748]],M.WALL);
P([[205,715],[221,710],[403,710],[422,716],[413,754],[392,769],[229,770]],M.AIR);
platform(211,769,212);
P([[365,697],[365,622],[391,597],[417,604],[439,631],[446,693]],M.STEEL);
P([[379,684],[379,632],[398,615],[419,630],[429,649],[429,684]],M.AIR);
R(378,645,53,11,M.WALL);R(387,663,32,11,M.STEEL);
for(let x of [197,268,347,451]){R(x,800,16,89,M.WALL);beam(x-9,803,x+23,787,8,M.STEEL);}
cabinet(256,729,43,34);cabinet(327,733,44,28);
R(191,784,276,15,M.STEEL);
// Enterable waybill/work room at transfer, with actual cargo fork.
platform(459,577,113);R(461,589,15,72,M.WALL);R(559,589,14,72,M.WALL);
R(477,599,82,39,M.AIR);platform(475,639,93);
cabinet(492,609,24,25);cabinet(529,607,19,28);
beam(463,663,517,785,15,M.STEEL);
// Straddle port: massive two-founded portal, differentiated crane rail and cage.
// Not a cableway or bascule; stays stationary as authored physical geometry.
for(let x of [573,834]){R(x,268,27,443,M.WALL);R(x+8,281,11,405,M.STEEL);}
beam(587,273,680,176,18,M.STEEL);beam(680,176,848,271,17,M.WALL);
platform(595,245,251);R(672,177,66,21,M.WALL);
for(let k=0;k<7;k++){let x=607+k*32;beam(x,259,x+28,316,7,k%2?M.STEEL:M.WALL);}
for(let x of [658,751]){ring(x,271,23,22,9,M.STEEL);beam(x,292,x,491,7,M.STEEL);}
platform(639,497,144);R(653,513,120,60,M.WALL);
R(663,523,100,36,M.AIR);platform(641,584,146);
R(661,595,13,53,M.WALL);R(767,595,14,53,M.WALL);
platform(583,688,257);beam(590,703,640,785,14,M.STEEL);
beam(834,702,812,786,15,M.STEEL);
R(571,700,16,86,M.WALL);R(830,700,17,88,M.WALL);
beam(579,273,451,352,11,M.STEEL);beam(451,352,373,416,8,M.STEEL);
cabinet(657,465,45,19);cabinet(710,465,54,19);
// Iconic two-deck saddle-arch freight viaduct, inverted load slings, OPEN
// flying void beneath; rooted on two masonry anchor buttresses.
for(let x of [912,1450]){R(x,516,33,273,M.WALL);R(x+9,530,13,250,M.STEEL);}
function archY(x){return 331-149*Math.sin(Math.PI*(x-933)/535);}
for(let x=933;x<1468;x+=12){
 let X=Math.min(1468,x+12),y=archY(x),Y=archY(X);
 beam(x,y,X,Y,14,M.STEEL);beam(x,y+48,X,Y+48,9,M.WALL);
 beam(x,y+(Math.floor(x/12)%2?48:0),X,Y+(Math.floor(x/12)%2?0:48),6,M.STEEL);
}
beam(936,330,929,550,16,M.STEEL);beam(1467,330,1468,551,16,M.STEEL);
platform(927,557,548);R(966,569,454,11,M.WALL);
for(let x of [1018,1190,1339]){
 platform(x,582,90);cabinet(x+12,594,64,30);
 for(let xx of [x+19,x+70])ring(xx,635,11,11,5,M.STEEL);
}
for(let x of [938,1070,1289,1462]){beam(x,575,x,747,14,M.WALL);beam(x-20,732,x+23,751,8,M.STEEL);}
for(let [x,w] of [[963,105],[1168,123],[1371,87]]){
 platform(x,666,w);R(x+2,678,13,58,M.WALL);
 R(x+w-15,679,13,57,M.WALL);R(x+16,693,w-31,31,M.AIR);
 platform(x+16,728,w-31);
}
// Low rail follows true terrain: no perspective tops or fake floating splines.
beam(834,755,961,750,15,M.STEEL);beam(961,751,1200,763,16,M.STEEL);
beam(1200,763,1455,748,16,M.STEEL);
beam(1453,748,1518,728,14,M.STEEL);
// Switchback classification—instead of a wheel, four switch rails, three
// different wagon loads, an enterable interlocking cabin and signal.
beam(1514,703,1680,616,17,M.STEEL);beam(1680,616,1810,663,15,M.STEEL);
beam(1514,725,1723,713,12,M.WALL);beam(1723,714,1810,739,12,M.STEEL);
for(let [x,y,w] of [[1534,585,91],[1636,546,103],[1737,607,89]]){
 platform(x,y,w);cabinet(x+15,y-31,w-30,24);
 for(let xx of [x+22,x+w-22])ring(xx,y+9,13,12,5,M.WALL);
}
R(1540,449,17,259,M.WALL);R(1545,457,8,238,M.STEEL);
beam(1547,457,1607,403,10,M.STEEL);platform(1596,400,64);
R(1542,643,18,77,M.WALL);R(1633,643,16,79,M.WALL);
platform(1541,632,109);R(1562,656,64,41,M.AIR);
beam(1552,680,1612,609,10,M.STEEL);
beam(1609,605,1694,716,10,M.WALL);
beam(1698,717,1769,549,9,M.STEEL);
// Terminal three asymmetric stepped roof grades and interior examination.
P([[1812,692],[1812,407],[1852,360],[1904,341],[1952,374],[1990,412],[2048,411],[2048,710]],M.WALL);
P([[1840,660],[1843,438],[1872,390],[1911,377],[1940,403],[1964,447],[2009,446],[2009,664]],M.AIR);
platform(1818,657,198);platform(1840,539,166);
R(1854,550,14,87,M.WALL);R(1989,550,12,87,M.WALL);
R(1872,566,118,55,M.AIR);platform(1869,626,132);
platform(1867,414,127);R(1880,426,14,56,M.WALL);
R(1967,426,14,56,M.WALL);cabinet(1910,438,55,22);
platform(1862,595,106);R(1874,607,15,47,M.WALL);R(1953,606,13,48,M.STEEL);
R(1888,615,64,24,M.AIR);
beam(1882,748,1882,789,13,M.WALL);
// Five functional different mechanics in lower return, attached to floor:
platform(173,951,219);ring(244,923,32,28,9,M.STEEL);
beam(250,943,269,959,8,M.WALL);R(319,919,14,32,M.WALL);
platform(588,948,191);
for(let [x,r] of [[621,19],[681,29],[736,16]]){ring(x,919,r,r,7,M.STEEL);R(x-8,943,16,13,M.WALL);}
beam(626,920,727,919,8,M.WALL);
platform(997,952,337);ring(1082,922,38,26,9,M.WALL);
ring(1180,929,24,21,7,M.STEEL);beam(1117,925,1163,927,8,M.STEEL);
R(1011,933,16,19,M.WALL);R(1269,932,16,20,M.STEEL);
platform(1462,949,207);platform(1502,913,110);
beam(1515,927,1570,945,8,M.STEEL);R(1592,925,14,23,M.WALL);
platform(1772,949,185);platform(1800,915,133);
R(1810,926,14,22,M.STEEL);
for(let x of [1855,1912])ring(x,944,12,12,5,M.WALL);
// Deliberate structural grounding: continuous bedrock-linked load path, but
// reopen 75-cell wide vertical service shafts after construction.
beam(73,751,242,781,17,M.STEEL);beam(242,781,500,778,16,M.STEEL);
beam(500,778,590,748,16,M.WALL);beam(590,748,848,749,16,M.STEEL);
beam(848,750,935,764,14,M.WALL);beam(1455,752,1542,742,14,M.STEEL);
beam(1542,742,1838,746,14,M.STEEL);beam(1838,746,2027,737,15,M.WALL);
for(let [x,y] of [[586,700],[842,700],[926,724],[1468,709],[1816,690]])beam(x,y,x,765,12,M.WALL);
R(0,991,W,33,M.WALL);
// Actual free-centre passages and recovery at exact authored coordinates.
R(90,799,1860,81,M.AIR);
for(let [x,y] of [[305,745],[691,745],[1161,749],[1577,743],[1861,739]])R(x-38,y,77,141,M.AIR);
for(let [,s] of Object.entries(sites))R(s[0]-23,s[1]-25,47,51,M.AIR);
