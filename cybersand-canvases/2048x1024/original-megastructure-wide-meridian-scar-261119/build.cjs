"use strict";
// ORIGINAL 2048x1024 CyberSand material-cell world; wholly independent design.
// The Meridian Scar / Severed Clockwork Concourse. Fixed seed 0x260B19.
// Node: node build.cjs [--verify]. No reference artwork, no AI images.
const W=2048,H=1024,SEED=0x260B19;
const M={E:0,B:100,O:101,C:58,S:62,T:63,U:64,R:65,G:66,P:68,Q:69,K:70,D:72,X:74,Y:75,H:76,N:77,F:78,A:79,L:80,V:98,Z:111,I:114,J:119,GL:120,FR:121,CF:130,HS:131};
const NAMES={"0":"Empty","58":"ReinforcedConcrete","62":"SteelPlate","63":"PaintedSteel","64":"CorrugatedSteel","65":"RustedSteel","66":"SteelGrating","68":"SteelPipe","69":"CopperPipe","70":"CeramicTile","72":"DarkGlass","74":"CableBundle","75":"Insulation","76":"HazardStripe","77":"NeonCyan","78":"NeonMagenta","79":"NeonAmber","80":"LEDWhite","98":"Marble","100":"BasaltColumns","101":"Obsidian","111":"Terrazzo","114":"AluminiumPanel","119":"BrassPanel","120":"GlassBlock","121":"FrostedGlass","130":"CarbonFibre","131":"HeatShieldTile"};
const PAL={0:[8,11,18],58:[119,123,128],62:[126,141,153],63:[49,100,119],64:[109,125,134],65:[124,63,43],66:[74,85,93],68:[102,119,129],69:[165,92,54],70:[200,210,203],72:[37,60,76],74:[60,53,68],75:[214,197,92],76:[227,182,47],77:[55,243,228],78:[255,61,184],79:[255,181,46],80:[236,248,255],98:[226,223,216],100:[54,56,61],101:[24,19,32],111:[200,196,186],114:[184,192,200],119:[196,160,72],120:[156,210,220],121:[206,226,232],130:[34,36,41],131:[26,26,29]};
const POLICY=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
const MIDGE_HASH="c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96";
const SITES={
"West ferryman ingress":[114,478],
"Arcade lantern gallery":[278,311],
"West heat-return subway":[284,749],
"Electromagnetic forge":[588,468],
"Loom overhead cabin":[658,307],
"Loom undercroft":[664,747],
"Fault-eye crossing":[1024,475],
"Meridian zero chamber":[1058,289],
"Null bypass":[1036,742],
"Oracle chronometric nave":[1434,313],
"Oracle public tribunal":[1444,480],
"Oracle machine archive":[1464,742],
"East quarantine intake":[1747,481],
"Quarantine shield crown":[1822,313],
"Isolation return":[1806,749],
"Beacon of twelve hours":[1952,480]
};
const CROPS=[
["01-arcade-ingress",68,192,380,320],
["02-electromagnetic-loom",453,185,430,370],
["03-meridian-fault-eye",870,136,360,460],
["04-oracle-tribunal",1256,178,391,365],
["05-quarantine-terminus",1641,194,394,370]
];
function generate(){
const a=new Uint8Array(W*H);
function R(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);const l=Math.max(0,x),t=Math.max(0,y),r=Math.min(W,x+w),b=Math.min(H,y+h);if(r<=l||b<=t)return;for(let yy=t;yy<b;yy++)a.fill(m,yy*W+l,yy*W+r);}
function poly(pts,m){let lo=Math.max(0,Math.ceil(Math.min(...pts.map(p=>p[1])))),hi=Math.min(H-1,Math.floor(Math.max(...pts.map(p=>p[1]))));for(let y=lo;y<=hi;y++){let q=[];for(let i=0;i<pts.length;i++){const p=pts[i],n=pts[(i+1)%pts.length];if((p[1]<=y&&n[1]>y)||(n[1]<=y&&p[1]>y))q.push(p[0]+(y-p[1])*(n[0]-p[0])/(n[1]-p[1]));}q.sort((l,r)=>l-r);for(let j=0;j+1<q.length;j+=2)R(Math.ceil(q[j]),y,Math.floor(q[j+1])-Math.ceil(q[j])+1,1,m);}}
function L(x,y,xx,yy,t,m){const dx=xx-x,dy=yy-y,dd=dx*dx+dy*dy,rad=t*.5;for(let row=Math.max(0,Math.floor(Math.min(y,yy)-rad));row<=Math.min(H-1,Math.ceil(Math.max(y,yy)+rad));row++){let begin=-1;for(let col=Math.max(0,Math.floor(Math.min(x,xx)-rad));col<=Math.min(W-1,Math.ceil(Math.max(x,xx)+rad));col++){const q=Math.max(0,Math.min(1,((col-x)*dx+(row-y)*dy)/(dd||1))),inside=(col-x-q*dx)**2+(row-y-q*dy)**2<=rad*rad;if(inside){if(begin<0)begin=col;}else if(begin>=0){R(begin,row,col-begin,1,m);begin=-1;}}if(begin>=0)R(begin,row,Math.min(W,Math.ceil(Math.max(x,xx)+rad)+1)-begin,1,m);}}
function ring(cx,cy,rx,ry,t,m,start=-Math.PI,end=Math.PI){let outer=1,inner=(1-t/Math.min(rx,ry))**2;for(let y=Math.max(0,cy-ry);y<=Math.min(H-1,cy+ry);y++){let run=-1;for(let x=Math.max(0,cx-rx);x<=Math.min(W-1,cx+rx);x++){let q=((x-cx)/rx)**2+((y-cy)/ry)**2,theta=Math.atan2(y-cy,x-cx),inside=q<=outer&&q>=inner&&theta>=start&&theta<=end;if(inside){if(run<0)run=x;}else if(run>=0){R(run,y,x-run,1,m);run=-1;}}if(run>=0)R(run,y,W-run,1,m);}}
function pipe(x,y,xx,yy,m){L(x,y,xx,yy,9,M.C);L(x,y,xx,yy,4,m);}
function windows(x,y,w,h,dx,dy,m){for(let yy=y;yy+h<=y+h*3&&yy<y+dy*3;yy+=dy)for(let xx=x;xx<x+w;xx+=dx)R(xx,yy,Math.min(17,dx-10),h,m);}
// Original big silhouettes: two unequal sediment shoulders and the engineered spillway foundation.
for(let x=0;x<W;x++){const top=Math.round(857+27*Math.sin(x*.0043)+14*Math.cos(x*.013)+8*Math.sin(x*.033));R(x,top,1,H-top,M.B);if(x%27<18)R(x,top+53,1,5,M.O);}
poly([[0,1024],[0,245],[32,243],[68,290],[91,370],[73,560],[54,690],[98,850],[125,1024]],M.B);
poly([[2048,1024],[2048,203],[2018,233],[1995,315],[1997,534],[1950,746],[1986,874],[1903,1024]],M.B);
L(40,264,74,743,26,M.C);L(2008,234,1968,789,23,M.C);
for(let y of [448,575,738]){R(8,y,71,15,M.S);R(1970,y+5,71,15,M.S);}
// West arcade-city: sawtooth skyline, cliff-anchored market hall, distinctly curved public promenade.
poly([[72,442],[80,290],[128,256],[160,198],[225,218],[262,273],[297,232],[349,262],[387,316],[427,396],[430,615],[103,619]],M.C);
poly([[96,434],[106,306],[155,289],[181,242],[238,278],[265,301],[309,275],[349,307],[405,403],[405,587],[102,587]],M.T);
poly([[136,319],[160,302],[207,300],[225,331],[217,381],[146,393]],M.D);
poly([[256,331],[279,313],[344,320],[364,355],[353,398],[252,398]],M.D);
R(111,398,298,16,M.S);R(130,414,271,7,M.Z);
for(let [x,y,w] of [[133,263,34],[172,253,45],[276,289,47],[341,326,29]]){R(x,y,w,7,M.S);R(x+6,y+9,w-12,5,M.N);}
for(let [x,y,w] of [[128,342,27],[183,334,19],[264,347,28],[309,350,23],[347,376,25]]){R(x,y,w,9,M.GL);R(x+4,y+11,w-8,4,M.F);}
poly([[112,561],[145,519],[190,519],[206,553],[205,619],[122,619]],M.R);
poly([[274,568],[305,521],[372,529],[408,562],[408,626],[283,627]],M.S);
for(let x of [136,185,287,339,388]){R(x,610,11,248,M.C);R(x+3,632,5,207,M.U);}
L(100,628,433,628,15,M.S);L(119,642,404,675,9,M.G);
for(let x=116;x<413;x+=41){R(x,683,28,11,M.T);R(x+5,694,19,4,M.A);}
for(let x of [156,263,370])pipe(x,240,x+18,630,M.P);
// Freight/forge loom: staggered sawblade sheds, hollow loom yoke and huge suspended magnet capsule.
poly([[448,592],[455,370],[498,329],[536,270],[610,269],[656,217],[700,261],[772,286],[830,353],[867,579],[848,617]],M.S);
poly([[476,573],[489,386],[528,364],[550,312],[605,315],[657,254],[707,304],[759,326],[812,370],[826,557],[475,556]],M.C);
poly([[502,429],[543,377],[632,367],[659,389],[642,462],[511,478]],M.D);
poly([[694,398],[736,356],[793,383],[816,424],[814,480],[697,482]],M.D);
R(497,489,321,21,M.U);R(503,511,313,8,M.G);
for(let x of [516,573,634,706,781]){R(x,522,17,174,M.S);R(x+5,534,7,159,M.T);R(x-7,620,31,7,M.H);}
L(475,340,821,341,15,M.S);L(518,313,701,216,12,M.U);L(701,216,829,347,12,M.U);
L(527,337,663,455,11,M.P);L(663,455,809,343,10,M.P);
ring(663,445,130,112,17,M.C,-2.72,-.40);ring(663,445,104,86,9,M.I,-2.67,-.44);
for(let x of [563,603,742,781]){L(x,347,x+12,396,8,M.G);R(x+5,402,11,17,M.N);}
for(let [x,y,w] of [[511,395,75],[699,416,98]]){R(x,y,w,11,M.GL);R(x+4,y+13,w-8,6,M.N);}
R(449,641,403,29,M.C);R(463,672,384,11,M.S);R(478,700,340,10,M.U);
for(let x of [481,549,624,705,777,831]){R(x,665,19,198,M.C);R(x+5,679,9,165,M.S);L(x,671,x+33,726,6,M.P);}
for(let x=510;x<803;x+=48){R(x,816,23,24,M.R);R(x+5,815,13,8,M.A);}
// Meridian Scar: two sheared jaws and a circular slitted beam-array with distinct huge negative space.
poly([[861,116],[887,105],[938,154],[988,199],[1000,227],[971,364],[937,385],[925,275],[904,226],[858,220]],M.O);
poly([[1203,101],[1234,116],[1236,236],[1194,269],[1178,372],[1146,360],[1139,229],[1160,155]],M.B);
L(904,140,1014,213,21,M.S);L(1165,148,1116,216,18,M.C);
L(952,213,1084,255,14,M.U);L(1084,255,1168,192,12,M.U);
ring(1070,367,163,156,19,M.C,-3.08,-1.07);ring(1070,367,163,156,19,M.C,-.54,2.02);
ring(1070,367,134,128,8,M.I,-3.08,-1.12);ring(1070,367,134,128,8,M.I,-.47,2.04);
L(949,339,1005,388,13,M.J);L(1134,319,1094,383,14,M.J);
R(1016,333,102,25,M.S);R(1029,341,77,9,M.N);
poly([[860,852],[885,755],[915,691],[959,627],[979,655],[971,778],[1005,821],[1019,878]],M.B);
poly([[1198,852],[1178,752],[1157,674],[1137,612],[1104,639],[1105,760],[1083,828],[1063,878]],M.O);
L(881,848,968,639,16,M.C);L(1174,850,1119,634,15,M.C);
L(942,824,1184,812,15,M.S);L(975,824,1092,790,11,M.T);
for(let x of [925,969,1138,1196]){L(x,822,x+3,928,9,M.P);}
// Oracle/Data Tribunal: irregular taper and layered monolithic cold-stone navigation chambers.
poly([[1210,592],[1251,404],[1305,349],[1331,289],[1364,242],[1408,225],[1451,146],[1487,199],[1525,244],[1597,261],[1618,363],[1648,590]],M.C);
poly([[1238,575],[1285,410],[1329,371],[1358,294],[1397,266],[1443,219],[1481,252],[1545,285],[1597,331],[1623,563]],M.T);
poly([[1311,419],[1351,356],[1422,319],[1470,329],[1512,363],[1553,419],[1546,460],[1318,459]],M.D);
poly([[1335,531],[1365,487],[1542,488],[1572,539],[1559,581],[1344,580]],M.D);
L(1320,423,1538,423,13,M.I);L(1361,353,1470,264,9,M.J);L(1470,264,1546,347,9,M.I);
L(1255,399,1474,166,12,M.J);L(1474,166,1617,375,13,M.J);
for(let [x,y,w] of [[1364,373,111],[1341,499,91],[1470,500,87],[1438,246,38]]){R(x,y,w,11,M.GL);R(x+8,y+14,w-16,5,M.N);}
for(let x of [1285,1338,1550,1614]){R(x,582,19,271,M.C);R(x+6,607,7,236,M.U);}
R(1282,619,337,26,M.S);R(1293,647,315,11,M.Z);
L(1278,691,1598,691,18,M.S);L(1304,705,1577,709,9,M.G);
for(let x of [1305,1351,1404,1520,1573]){R(x,714,25,102,M.T);R(x+5,727,15,44,M.GL);R(x+2,806,21,6,M.F);}
for(let x=1349;x<1572;x+=54){R(x,797,19,12,M.V);R(x+5,810,10,7,M.N);}
// East Quarantine Terminus: unequal shield petals and beamwork, no generic hangar or copy.
poly([[1635,592],[1651,377],[1697,324],[1718,277],[1770,268],[1792,227],[1861,233],[1892,282],[1946,316],[1974,397],[1986,594]],M.S);
poly([[1658,573],[1678,405],[1718,362],[1752,307],[1801,289],[1838,275],[1871,311],[1922,353],[1965,414],[1968,563]],M.C);
ring(1813,456,161,157,18,M.U,-2.91,-.16);ring(1813,456,140,133,14,M.H,-2.83,-.24);
poly([[1710,405],[1740,367],[1780,357],[1792,395],[1773,449],[1708,465]],M.D);
poly([[1856,388],[1894,361],[1938,396],[1949,454],[1887,465],[1858,436]],M.D);
L(1677,386,1812,249,16,M.U);L(1812,249,1964,413,17,M.U);
L(1658,520,1819,563,12,M.R);L(1819,563,1968,521,13,M.R);
R(1691,605,283,22,M.S);R(1712,630,250,10,M.G);
for(let x of [1670,1733,1858,1927]){R(x,633,19,226,M.C);R(x+5,644,9,198,M.T);}
L(1663,691,1965,691,14,M.P);L(1676,710,1960,713,6,M.A);
for(let x of [1684,1748,1880,1939]){R(x,716,27,89,M.R);R(x+4,729,20,19,M.H);R(x+7,753,13,10,M.N);}
for(let x of [1711,1779,1875,1928]){L(x,280,x+9,359,5,M.Q);R(x+4,348,10,8,M.A);}
// Tie roof beams into front and back structural shoulders; enclosed underspan stays traversable.
for(let x of [428,847,1203,1641]){R(x,571,16,295,M.C);R(x+5,604,7,234,M.S);}
L(80,849,2006,849,14,M.S);L(96,865,1975,867,7,M.G);

// R2: the great suspended catenary transport deck that binds every district.
// Irregular catenary chain, tied to wall anchors and crowned stations.
const high=[[72,194],[212,147],[397,160],[583,131],[755,162],[933,121],[1072,154],[1234,127],[1433,170],[1604,135],[1802,164],[1988,204]];
for(let i=0;i<high.length-1;i++){const p=high[i],q=high[i+1],mid=(p[0]+q[0])/2,ym=(p[1]+q[1])/2;L(p[0],p[1],q[0],q[1],15,M.S);L(p[0],p[1]-22,q[0],q[1]-22,6,M.U);
L(p[0],p[1]-22,mid,ym,6,M.C);L(mid,ym,q[0],q[1]-22,6,M.C);L(p[0],p[1],mid,ym-22,6,M.C);L(mid,ym-22,q[0],q[1],6,M.C);
for(let x=p[0]+32;x<q[0]-15;x+=55){let t=(x-p[0])/(q[0]-p[0]),yy=p[1]+(q[1]-p[1])*t;L(x,yy-24,x,yy-1,6,M.G);}}
L(72,194,76,300,20,M.S);L(1972,196,1965,319,18,M.S);
for(let [x,top,bottom] of [[211,149,259],[596,131,276],[1434,171,230],[1810,164,270]]){L(x,top,x+4,bottom,13,M.C);L(x+6,top,x+10,bottom-3,6,M.U);}
// Transit cars, located at explicitly supported offsets, visibly different masses.
poly([[291,180],[342,165],[447,175],[476,190],[464,224],[310,227]],M.T);
poly([[300,195],[322,183],[446,191],[451,213],[316,216]],M.D);
for(let x of [325,350,377,403,428])R(x,192,18,16,M.GL);
R(315,225,135,8,M.S);R(348,232,39,5,M.N);L(382,158,382,177,6,M.P);
poly([[800,190],[824,171],[893,158],[953,173],[968,207],[941,230],[822,222]],M.U);
poly([[828,192],[863,174],[928,184],[949,202],[929,214],[836,210]],M.D);
for(let x of [847,886,914])R(x,192,17,10,M.N);
R(824,221,121,11,M.S);R(842,233,23,5,M.F);L(922,126,920,166,7,M.P);
poly([[1589,201],[1622,178],[1712,178],[1745,201],[1730,229],[1616,225]],M.C);
poly([[1610,204],[1634,190],[1714,194],[1727,210],[1712,218],[1615,218]],M.D);
for(let x of [1638,1663,1690])R(x,199,17,11,M.GL);
R(1620,226,104,9,M.S);R(1654,235,38,5,M.A);L(1691,151,1691,180,7,M.P);
// Meridian zero-dial: an eight-hour fractured clock driven by two opposing jaws.
ring(1072,193,120,91,16,M.J);ring(1072,193,88,60,10,M.T);
for(let d of [0,Math.PI/4,Math.PI/2,3*Math.PI/4,Math.PI,5*Math.PI/4,3*Math.PI/2,7*Math.PI/4]){let ax=1072+76*Math.cos(d),ay=193+54*Math.sin(d),bx=1072+100*Math.cos(d),by=193+75*Math.sin(d);L(ax,ay,bx,by,6,d%1>0.3?M.N:M.A);}
L(1072,193,1138,157,9,M.A);L(1072,193,1025,174,7,M.N);
L(959,156,944,175,10,M.S);L(1188,175,1227,167,11,M.C);
// District-specific sign panels and radial keels at Midge-scale
for(let [x,y,w,m] of [[132,237,68,M.N],[525,248,87,M.A],[1384,250,50,M.N],[1785,261,87,M.F]]){R(x,y,w,10,M.C);R(x+8,y+2,w-16,5,m);}

// Human-readable navigation: three wide intentionally routed passages, 5 transfer shafts.
// Polygonal/tubular negative space includes indoor galleries, ducts and the great central magnetic air void.
function tunnel(path,width){for(let i=0;i<path.length-1;i++)L(path[i][0],path[i][1],path[i+1][0],path[i+1][1],width,0);for(let p of path)R(p[0]-width/2,p[1]-width/2,width,width,0);}
tunnel([[105,319],[313,313],[526,308],[701,311],[885,307],[1085,289],[1283,312],[1442,315],[1613,321],[1820,311],[1970,329]],65);
tunnel([[104,480],[311,483],[511,477],[702,473],[872,478],[1043,477],[1254,473],[1445,485],[1628,480],[1812,479],[1977,487]],83);
tunnel([[110,749],[295,751],[508,750],[688,750],[884,742],[1038,741],[1238,742],[1456,743],[1660,751],[1812,748],[1973,749]],83);
for(let [x,y0,y1,w] of [[243,312,751,74],[652,305,751,74],[1040,288,751,94],[1453,314,743,80],[1816,311,751,72]])tunnel([[x,y0],[x+8,Math.floor((y0+y1)/2)],[x,y1]],w);
// Intentional accessible rooms off passages, not decorative unreachable niches.
for(let [x,y,w,h] of [[160,350,94,45],[299,359,79,43],[508,361,95,54],[696,357,84,47],[1324,351,109,49],[1501,360,100,53],[1695,351,70,58],[1885,352,72,62],[252,556,89,46],[531,556,96,48],[1373,548,120,54],[1739,553,106,44],[268,666,84,48],[579,655,104,53],[1378,662,101,48],[1752,655,99,54]])R(x,y,w,h,0);
// Deliberately grow functional approaches to all exact named centres; never shift locations in validation.
for(const [name,xy] of Object.entries(SITES))R(xy[0]-18,xy[1]-17,37,35,0);
// Marker-free functional text substitute: patterned signalling anchored in actual structural material.
for(let x of [118,355,548,765,1281,1587,1694,1959]){R(x,420,42,5,M.H);R(x+8,426,9,4,M.N);R(x+24,426,9,4,M.F);}
for(let x of [111,390,544,805,1245,1602,1680,1950]){R(x,813,55,7,M.G);R(x+15,820,18,5,M.A);}
// Stabilising and decorative hull edges are real solid cells, cannot cross flight-corridor clearance.
for(let x=24;x<2040;x+=128){R(x,904,81,7,M.O);R(x+11,930,49,4,M.C);}


// R3 independent P1 repair — functional inhabited architecture, not a repeated hall stamp.
// All work is indexed material-cell state; preserve the generous through-flight corridors.
// ARC: ferry ticketing above, asymmetric freight weighbridge beside it, service below.
R(103,358,108,63,0);R(294,353,108,73,0); // remove clone-facade infill, not route
L(107,387,210,387,8,M.S);R(110,388,10,44,M.C);R(199,388,10,39,M.C);
R(122,394,76,7,M.J);R(126,401,31,28,M.D);R(130,407,24,11,M.GL);
R(161,410,28,17,M.S);R(165,405,18,5,M.N);R(174,415,7,10,M.H);
R(119,429,92,7,M.V);L(112,432,96,454,8,M.S);
R(297,365,111,10,M.R);L(300,373,299,424,9,M.S);
R(305,382,65,8,M.U);R(312,391,52,22,M.C);
R(318,395,40,10,M.GL);R(331,410,17,10,M.H);
L(361,386,393,414,10,M.S);R(373,412,34,9,M.G);
for(let x of [319,338,354]){R(x,421,12,8,M.R);R(x+3,424,6,4,M.A);}
R(112,548,91,76,0); // separate ferry maintenance stilt from prior red box
poly([[112,603],[129,573],[163,566],[182,594],[196,625],[112,625]],M.R);
R(125,592,36,15,M.D);R(133,592,20,11,M.GL);
L(143,609,143,659,10,M.C);R(112,626,84,9,M.S);
for(let i=0;i<5;i++){R(174-i*8,567+i*13,23,4,M.G);}
R(289,535,112,78,0); // freight exchange differs in mass and internal access
poly([[291,592],[311,553],[360,545],[398,569],[401,626],[285,626]],M.U);
R(306,577,47,25,M.D);R(310,582,38,9,M.GL);
R(356,569,30,12,M.C);R(360,580,23,9,M.A);
L(313,626,313,681,9,M.S);L(379,624,395,686,9,M.S);
R(291,644,99,9,M.R);R(306,654,69,5,M.G);
for(let i=0;i<5;i++)R(306+i*14,660,7,11,i%2?M.Y:M.H);
// LOOM: distinct feed → winding → output with service gantry, inspection bench.
R(489,368,150,69,0);R(691,364,120,73,0); // unbuild the two identical blind pod interiors
R(485,375,15,61,M.C);R(493,384,12,44,M.R);
R(510,394,53,12,M.U);R(515,407,43,9,M.G);R(523,417,27,8,M.A);
L(491,379,523,356,10,M.S);R(528,360,33,8,M.J);
R(556,422,177,8,M.S);R(564,430,160,5,M.G);
for(let x of [573,609,666,707]){R(x,423,14,6,M.V);R(x+4,418,6,5,M.N);}
ring(610,396,37,31,9,M.P);ring(610,396,25,19,6,M.J);
L(577,398,646,392,6,M.I);L(611,364,611,371,10,M.S);
R(637,400,32,10,M.U);R(644,409,18,10,M.N);
L(669,405,706,386,9,M.P);
poly([[708,367],[776,369],[794,395],[790,421],[707,422]],M.C);
R(714,375,68,33,M.D);R(720,380,55,13,M.GL);
R(722,405,40,8,M.Z);R(772,405,12,9,M.H);
L(782,370,803,350,7,M.S);R(750,423,44,9,M.G);
R(497,547,116,71,0);R(697,547,118,70,0);
L(491,559,610,559,11,M.U);R(501,562,15,47,M.C);
L(535,566,535,606,9,M.S);R(550,578,56,11,M.R);
for(let i=0;i<3;i++){R(555+i*14,591,10,16,M.C);R(557+i*14,594,6,9,M.A);}
R(560,610,54,8,M.S);L(605,607,636,640,8,M.P);
poly([[704,559],[745,540],[786,548],[807,590],[805,616],[698,618]],M.S);
R(713,561,76,43,M.D);R(720,569,62,14,M.GL);
R(718,590,62,6,M.N);R(783,566,9,43,M.H);
R(711,621,92,9,M.U);L(767,628,765,689,9,M.C);
ring(564,675,32,28,8,M.R);L(547,675,583,675,6,M.J);
R(519,696,110,7,M.S);R(543,686,44,10,M.G);
// FAULT-EYE: two anchored diagnostic stations, not a plug across the central void.
R(881,414,69,9,M.S);L(884,421,870,572,9,M.C);
R(889,390,50,23,M.D);R(896,395,35,9,M.GL);
R(903,405,20,5,M.N);L(933,414,943,437,6,M.P);
R(1134,401,78,8,M.S);L(1200,410,1212,555,9,M.C);
R(1144,379,52,20,M.D);R(1150,385,41,9,M.GL);
R(1168,393,16,5,M.H);L(1150,401,1136,431,7,M.J);
R(911,670,52,12,M.C);R(917,659,36,11,M.D);
R(918,664,18,5,M.N);L(931,681,943,823,9,M.S);
R(1130,671,48,11,M.C);R(1139,660,28,11,M.D);
R(1143,665,19,5,M.F);L(1151,683,1137,824,9,M.S);
for(let x of [924,1142]){R(x,688,7,15,M.G);R(x-5,701,17,4,M.H);}
// TRIBUNAL: one dignified dais, unequal citizen and archive galleries, side service.
R(1323,365,239,70,0); // replace clone of upper box with genuine nested public interior
L(1310,373,1561,373,12,M.V);L(1316,377,1320,426,9,M.J);
R(1330,388,41,33,M.D);R(1333,392,34,11,M.GL);
R(1336,415,29,6,M.G);R(1376,406,35,8,M.S);
R(1383,414,29,11,M.V);R(1402,424,106,12,M.Z);
R(1420,401,73,22,M.J);R(1425,397,60,6,M.A);
R(1440,386,32,11,M.C);R(1446,389,20,7,M.GL);
R(1518,380,39,41,M.D);R(1522,384,30,10,M.GL);
R(1532,401,17,11,M.N);R(1522,415,29,6,M.G);
L(1555,386,1588,357,7,M.S);R(1326,438,236,6,M.S);
R(1338,541,72,68,0);R(1510,539,88,75,0);
poly([[1300,583],[1320,544],[1370,550],[1408,580],[1407,623],[1304,623]],M.T);
R(1318,571,55,24,M.D);R(1322,577,43,8,M.GL);
R(1373,576,17,35,M.C);R(1380,585,8,18,M.N);
R(1312,627,95,8,M.V);L(1331,634,1328,692,9,M.C);
poly([[1511,589],[1535,539],[1560,544],[1593,576],[1604,619],[1508,621]],M.C);
R(1532,564,53,35,M.D);R(1538,569,40,12,M.GL);
R(1548,589,20,8,M.F);R(1519,624,79,8,M.S);
L(1565,630,1571,693,9,M.C);
for(let x of [1365,1390,1519,1551]){R(x,671,13,24,M.U);R(x+4,675,6,11,M.N);}
R(1361,699,212,8,M.S);
// QUARANTINE: actual process sequence: sample dock / seal passage / release controls.
R(1682,366,98,66,0);R(1860,363,92,70,0);
R(1685,373,79,9,M.H);R(1692,383,18,42,M.C);
R(1715,386,49,34,M.D);R(1720,393,38,15,M.GL);
R(1734,411,15,7,M.F);R(1697,424,79,9,M.S);
L(1774,379,1800,354,10,M.S);R(1780,414,21,16,M.U);
R(1785,419,12,7,M.N);R(1806,378,11,58,M.U);R(1810,388,4,30,M.H);
R(1841,377,11,60,M.U);R(1845,386,4,33,M.F);
R(1860,371,82,10,M.S);R(1869,382,67,40,M.D);
R(1875,390,53,16,M.GL);R(1886,414,31,7,M.A);
R(1858,428,88,7,M.H);L(1940,384,1959,357,10,M.C);
R(1708,541,84,72,0);R(1871,539,74,76,0);
R(1680,553,19,85,M.C);R(1702,551,67,9,M.S);
R(1710,562,55,40,M.D);R(1714,568,46,10,M.GL);
R(1744,586,13,7,M.F);R(1710,605,64,11,M.U);
L(1741,616,1739,679,9,M.S);
ring(1865,580,54,45,10,M.U);ring(1865,580,37,29,8,M.H);
L(1828,581,1902,581,8,M.P);L(1864,535,1865,548,10,M.S);
R(1840,624,58,10,M.S);R(1849,635,44,8,M.G);
L(1880,641,1892,693,9,M.C);
for(let x of [1777,1805,1933]){R(x,650,15,45,M.T);R(x+4,653,7,17,M.N);}
R(1711,694,90,9,M.H);R(1824,694,113,8,M.S);
// P2: asymmetric district cues along the lower return, keep y715..780 open.
ring(585,806,25,17,6,M.P);R(532,823,107,10,M.S);
R(914,797,57,8,M.U);L(935,805,964,840,8,M.S);
R(1752,798,67,8,M.H);R(1763,807,34,10,M.C);

// R3 service attachment: substantial actual beam paths to surrounding infrastructure,
// not fake 1-pixel cables spanning the fault void.
R(494,380,14,49,M.S);R(495,389,75,9,M.U);R(526,390,36,13,M.S);
R(542,581,69,11,M.C);R(550,588,58,15,M.S);
R(561,603,53,9,M.U);R(553,606,60,9,M.S);
R(720,415,73,9,M.S);
R(1315,392,26,12,M.C);R(1327,389,10,37,M.S);
// Retain all original guaranteed free routes/shafts and the 16 fixed actual points.
// This may remove interface features within functional flyer envelopes by design.
tunnel([[105,319],[313,313],[526,308],[701,311],[885,307],[1085,289],[1283,312],[1442,315],[1613,321],[1820,311],[1970,329]],65);
tunnel([[104,480],[311,483],[511,477],[702,473],[872,478],[1043,477],[1254,473],[1445,485],[1628,480],[1812,479],[1977,487]],83);
tunnel([[110,749],[295,751],[508,750],[688,750],[884,742],[1038,741],[1238,742],[1456,743],[1660,751],[1812,748],[1973,749]],83);
for(let [x,y0,y1,w] of [[243,312,751,74],[652,305,751,74],[1040,288,751,94],[1453,314,743,80],[1816,311,751,72]])tunnel([[x,y0],[x+8,Math.floor((y0+y1)/2)],[x,y1]],w);
for(const xy of Object.values(SITES))R(xy[0]-18,xy[1]-17,37,35,0);

function anchorStructure(){
const seen=new Uint8Array(a.length),queue=new Int32Array(a.length),islands=[];
for(let k=0;k<a.length;k++){if(!a[k]||seen[k])continue;let head=0,tail=1,edge=false,minx=W,maxx=0,miny=H,maxy=0;queue[0]=k;seen[k]=1;let cells=[];while(head<tail){let u=queue[head++],xx=u%W,yy=(u/W)|0;cells.push(u);if(xx===0||xx===W-1||yy===H-1)edge=true;minx=Math.min(minx,xx);maxx=Math.max(maxx,xx);miny=Math.min(miny,yy);maxy=Math.max(maxy,yy);for(let v of [u-1,u+1,u-W,u+W])if(v>=0&&v<a.length&&Math.abs(v%W-xx)+Math.abs(((v/W)|0)-yy)===1&&a[v]&&!seen[v]){seen[v]=1;queue[tail++]=v;}}
islands.push({cells,edge,box:[minx,miny,maxx,maxy]});}
const main=new Uint8Array(a.length),dist=new Int32Array(a.length),parent=new Int32Array(a.length),q=new Int32Array(a.length);dist.fill(-1);let h=0,t=0;for(let z of islands)if(z.edge){for(let u of z.cells){main[u]=1;dist[u]=0;q[t++]=u;}}
while(h<t){let u=q[h++],xx=u%W,yy=(u/W)|0;for(let v of [u-1,u+1,u-W,u+W])if(v>=0&&v<a.length&&Math.abs(v%W-xx)+Math.abs(((v/W)|0)-yy)===1&&dist[v]===-1&&!a[v]){dist[v]=dist[u]+1;parent[v]=u;q[t++]=v;}}
let ties=[];for(let z of islands){if(z.edge||z.cells.length<100)continue;let best=-1,cost=2147483647;for(let u of z.cells){let x=u%W,y=(u/W)|0;for(let v of [u-1,u+1,u-W,u+W])if(v>=0&&v<a.length&&Math.abs(v%W-x)+Math.abs(((v/W)|0)-y)===1&&dist[v]>=0&&dist[v]<cost){best=v;cost=dist[v];}}
if(best<0||cost>205)continue;let path=[],u=best;while(dist[u]>0){path.push(u);u=parent[u];}path.push(u);
if(path.length>=2){let step=path.filter((v,i)=>i%5===0||i===path.length-1);for(let v of step){let x=v%W,y=(v/W)|0;R(x-2,y-2,5,5,M.P);}ties.push({cells:z.cells.length,link:cost,box:z.box});}}
return ties;}
const structuralTies=anchorStructure();
// R3 conservative Midge recovery: open a bounded relief through the east Fault-Eye
// service tie (not the clock), preserving the 31x27 alternative after mid-bridge seal.
tunnel([[1119,410],[1123,463]],53);


// No unsupported decorations: remove any residual solid component not tied to grounded superframe.
function pruneUngrounded(){
 const seen=new Uint8Array(a.length),q=new Int32Array(a.length);let removed=0,components=0;
 for(let k=0;k<a.length;k++){if(!a[k]||seen[k])continue;let head=0,tail=1,rooted=false;q[0]=k;seen[k]=1;
 while(head<tail){const u=q[head++],x=u%W,y=(u/W)|0;if(x===0||x===W-1||y===H-1)rooted=true;
 for(let v of [u-1,u+1,u-W,u+W])if(v>=0&&v<a.length&&Math.abs(v%W-x)+Math.abs(((v/W)|0)-y)===1&&a[v]&&!seen[v]){seen[v]=1;q[tail++]=v;}}
 if(!rooted){components++;removed+=tail;for(let j=0;j<tail;j++)a[q[j]]=0;}}
 return {removed,components};
}
const finalPrune=pruneUngrounded();

const hist={},used=new Set();for(const v of a){hist[v]=(hist[v]||0)+1;used.add(v);}
for(const v of used)if(v!==0&&!NAMES[v])throw Error("unknown material "+v);
const edits=[],prior=new Map();for(let y=0;y<H;y++){let now=new Map();for(let x=0;x<W;){let m=a[y*W+x],left=x;while(x<W&&a[y*W+x]===m)x++;if(!m)continue;let k=left+","+ (x-left)+","+m,old=prior.get(k);if(old!=null){edits[old][3]++;now.set(k,old);}else{now.set(k,edits.length);edits.push([left,y,x-left,1,m]);}}prior.clear();for(let [k,v] of now)prior.set(k,v);}
const replay=new Uint8Array(W*H);let work=0;for(let [x,y,w,h,m] of edits){work+=w*h;for(let yy=y;yy<y+h;yy++)replay.fill(m,yy*W+x,yy*W+x+w);}for(let i=0;i<a.length;i++)if(a[i]!==replay[i])throw Error("material replay mismatch at "+i);
const setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:MIDGE_HASH,spawn:SITES["West ferryman ingress"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits,response:"LA-SELECTIVE",liquid_policy:POLICY,normalize:false,rule_radius:2,source:[],material:2,brush:8,fire:false};
const json=JSON.stringify(setup);
if(edits.length>32768||json.length>1048576||work>4194304)throw Error("budget exceeded "+edits.length+" "+json.length+" "+work);
return{g:a,sites:SITES,crops:CROPS,setup,json,edits,hist,work,seed:SEED,structuralTies,finalPrune};}
function clearances(g,sites){const stride=W+1,cum=new Uint32Array((W+1)*(H+1));for(let y=0;y<H;y++){let row=0;for(let x=0;x<W;x++){row+=+(g[y*W+x]!==0);cum[(y+1)*stride+x+1]=cum[y*stride+x+1]+row;}}let out=[];for(let [cw,ch] of [[19,15],[23,19],[31,27]]){const hx=(cw-1)>>1,hy=(ch-1)>>1,air=new Uint8Array(W*H);let n=0;for(let y=hy;y<H-hy;y++)for(let x=hx;x<W-hx;x++){let x0=x-hx,y0=y-hy,x1=x+hx+1,y1=y+hy+1,s=cum[y1*stride+x1]-cum[y1*stride+x0]-cum[y0*stride+x1]+cum[y0*stride+x0];if(s===0){air[y*W+x]=1;n++;}}const p=sites["West ferryman ingress"],s=p[1]*W+p[0];if(!air[s])throw Error("spawn blocked "+cw+"x"+ch);const seen=new Uint8Array(W*H),queue=new Uint32Array(W*H);queue[0]=s;seen[s]=1;let head=0,tail=1;while(head<tail){let u=queue[head++],x=u%W,y=(u/W)|0;for(let v of [u-1,u+1,u-W,u+W])if(v>=0&&v<W*H&&Math.abs(v%W-x)+Math.abs(((v/W)|0)-y)===1&&air[v]&&!seen[v]){seen[v]=1;queue[tail++]=v;}}const missing=[];for(let [name,[x,y]] of Object.entries(sites))if(!air[y*W+x]||!seen[y*W+x])missing.push({name,at:[x,y],air:!!air[y*W+x],reached:!!seen[y*W+x]});out.push({clearance:[cw,ch],airCentres:n,reachable:Object.keys(sites).length-missing.length,total:Object.keys(sites).length,component:tail,missing});}return out;}
function crc(bytes){let c=0xffffffff;for(const b of bytes){c^=b;for(let k=0;k<8;k++)c=(c&1)?(c>>>1)^0xedb88320:c>>>1;}return (c^0xffffffff)>>>0;}
function be(n){return [(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255];}
function b64(bs){const abc="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",out=[];for(let i=0;i<bs.length;i+=3){let a=bs[i],b=bs[i+1],c=bs[i+2];out.push(abc[a>>2],abc[((a&3)<<4)|((b||0)>>4)],i+1<bs.length?abc[((b&15)<<2)|((c||0)>>6)]:"=",i+2<bs.length?abc[c&63]:"=");}return out.join("");}
function zFixed(raw){const result=[0x78,0x01];let bits=0,count=0;function put(v,n){bits|=v<<count;count+=n;while(count>=8){result.push(bits&255);bits>>>=8;count-=8;}}function rev(v,n){let o=0;for(let k=0;k<n;k++){o=(o<<1)|(v&1);v>>>=1;}return o;}function lit(s){let c,n;if(s<144){c=s+48;n=8;}else if(s<256){c=s+256;n=9;}else if(s<280){c=s-256;n=7;}else{c=s-280+192;n=8;}put(rev(c,n),n);}
const lb=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],le=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],db=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],de=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];put(3,3);const table=new Int32Array(65536);table.fill(-1);const n=raw.length;let i=0;while(i<n){let best=0,d=0;if(i+2<n){let key=((raw[i]*257+raw[i+1])*257+raw[i+2])&65535,j=table[key];if(j>=0&&i-j<=32768){let max=Math.min(258,n-i),k=0;while(k<max&&raw[i+k]===raw[j+k])k++;if(k>=3){best=k;d=i-j;}}}const advance=best||1;for(let k=0;k<advance;k++){let p=i+k;if(p+2<n){let key=((raw[p]*257+raw[p+1])*257+raw[p+2])&65535;table[key]=p;}}if(best){let ix=lb.length-1;for(let k=0;k<lb.length;k++){let max=lb[k]+((1<<le[k])-1);if(best<=max){ix=k;break;}}lit(257+ix);put(best-lb[ix],le[ix]);let di=db.length-1;for(let k=0;k<db.length;k++)if(d<=db[k]+((1<<de[k])-1)){di=k;break;}put(rev(di,5),5);put(d-db[di],de[di]);}else lit(raw[i]);i+=advance;}lit(256);if(count>0)result.push(bits&255);
let s1=1,s2=0;for(let i=0;i<n;i++){s1=(s1+raw[i])%65521;s2=(s2+s1)%65521;}result.push(...be((s2<<16)|s1));return new Uint8Array(result);}
function png(g,x,y,w,h){const raw=new Uint8Array((w+1)*h);for(let yy=0;yy<h;yy++){raw[yy*(w+1)]=0;raw.set(g.subarray((yy+y)*W+x,(yy+y)*W+x+w),yy*(w+1)+1);}const compressed=zFixed(raw),palette=new Uint8Array(768);for(let [id,color] of Object.entries(PAL))palette.set(color,+id*3);const chunks=[];function chunk(name,data){let nameBytes=[...name].map(c=>c.charCodeAt(0)),payload=[...nameBytes,...data];for(let x of [...be(data.length),...payload,...be(crc(payload))])chunks.push(x);}chunk("IHDR",[...be(w),...be(h),8,3,0,0,0]);chunk("PLTE",palette);chunk("IDAT",compressed);chunk("IEND",[]);const out=new Uint8Array(8+chunks.length);out.set([137,80,78,71,13,10,26,10]);out.set(chunks,8);return out;}
function pngChunksValid(p){let sig=[137,80,78,71,13,10,26,10];if(sig.some((x,i)=>p[i]!==x))return false;let n=8,end=false;while(n+12<=p.length){let len=(((p[n]*16777216)+(p[n+1]<<16)+(p[n+2]<<8)+p[n+3])>>>0),tp=String.fromCharCode(...p.subarray(n+4,n+8)),dat=p.subarray(n+4,n+8+len),given=((p[n+8+len]*16777216)+(p[n+9+len]<<16)+(p[n+10+len]<<8)+p[n+11+len])>>>0;if(crc(dat)!==given)return false;n+=12+len;if(tp==="IEND"){end=true;break;}}return end&&n===p.length;}
if(typeof module!=="undefined"&&module.exports){module.exports={generate,clearances,png,pngChunksValid,PAL,M,NAMES,SITES,CROPS,SEED,W,H};if(require.main===module){const fs=require("fs"),path=require("path"),zlib=require("zlib"),crypto=require("crypto"),dir=__dirname,world=generate(),checks=clearances(world.g,world.sites);if(checks.some(q=>q.missing.length))throw Error(JSON.stringify(checks));const blockedWorld=new Uint8Array(world.g);
for(let y=440;y<544;y++)blockedWorld.fill(M.C,y*W+975,y*W+1108);
const unblockedSites=Object.fromEntries(Object.entries(world.sites).filter(([k])=>k!=="Fault-eye crossing"));
const blockedChecks=clearances(blockedWorld,unblockedSites);
if(blockedChecks.some(q=>q.missing.length))throw Error("R3 3-envelope obstruction bypass fails");
const images=[["overview",0,0,W,H],...world.crops],out=[];for(let [name,x,y,w,h] of images){const bytes=png(world.g,x,y,w,h);if(!pngChunksValid(bytes))throw Error("PNG CRC "+name);let pos=8,packed=[];while(pos<bytes.length){let size=bytes.readUInt32BE?bytes.readUInt32BE(pos):((bytes[pos]<<24)|(bytes[pos+1]<<16)|(bytes[pos+2]<<8)|bytes[pos+3])>>>0,tp=String.fromCharCode(...bytes.slice(pos+4,pos+8));if(tp==="IDAT")packed.push(bytes.slice(pos+8,pos+8+size));pos+=size+12;}const inflated=zlib.inflateSync(Buffer.concat(packed.map(x=>Buffer.from(x))));if(inflated.length!==(w+1)*h)throw Error("inflate length "+name);for(let yy=0;yy<h;yy++){if(inflated[yy*(w+1)]!==0)throw Error("PNG filter");for(let xx=0;xx<w;xx++)if(inflated[yy*(w+1)+1+xx]!==world.g[(yy+y)*W+x+xx])throw Error("PNG pixel parity "+name);}const hash=v=>crypto.createHash("sha256").update(v).digest("hex");fs.writeFileSync(path.join(dir,name+".png"),bytes);out.push({name,bytes:bytes.length,sha256:hash(bytes),cell_parity:true});}fs.writeFileSync(path.join(dir,"setup-meridian-scar.json"),world.json+"\n");const hash=v=>crypto.createHash("sha256").update(v).digest("hex");const receipt={original:true,concept:"The Meridian Scar — Severed Clockwork Concourse",seed:SEED,engine_sha:"de109d0131641d6adc8d25bb9ced7ca3d4991105",extent:[W,H],midge_hull:[4,3],source_art:"none",material_histogram:world.hist,material_names:NAMES,edits:world.edits.length,work:world.work,setup_bytes:Buffer.byteLength(world.json+"\n"),material_sha256:hash(world.g),setup_sha256:hash(world.json+"\n"),clearances:checks,blocked_route:{obstruction:[975,440,1108,544],occupied_site:"Fault-eye crossing",clearances:blockedChecks},structural:{remaining_detached:0,pruned:world.finalPrune},sites:SITES,images:out,native:"NATIVE-UNTESTED"};fs.writeFileSync(path.join(dir,"receipt.json"),JSON.stringify(receipt,null,2)+"\n");console.log(JSON.stringify({static:"PASS",edits:receipt.edits,bytes:receipt.setup_bytes,clearances:checks,images:out}));}}
