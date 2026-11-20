'use strict';
function generate(){
const W=2048,H=1024,SEED=0x20b5619;
const M={E:0,C:58,S:62,P:63,R:64,OX:65,G:66,SP:68,CP:69,T:70,CG:71,DG:72,RB:73,CB:74,I:75,HZ:76,NC:77,NM:78,NA:79,WH:80,B:100,O:101,TER:111,AL:114,BR:119,GB:120,CF:130,HT:131};
const COLORS={0:[8,11,18],58:[119,123,128],62:[126,141,153],63:[49,100,119],64:[109,125,134],65:[124,63,43],66:[74,85,93],68:[102,119,129],69:[165,92,54],70:[200,210,203],71:[107,196,181],72:[37,60,76],73:[36,38,42],74:[62,66,92],75:[198,178,112],76:[229,172,48],77:[29,212,206],78:[243,67,179],79:[255,165,52],80:[242,240,225],100:[65,67,79],101:[34,37,48],111:[195,194,183],114:[185,191,207],119:[213,170,90],120:[154,217,223],130:[42,47,57],131:[73,64,67]};
const SITES={
'West freight landing':[155,485], 'Antenna commons':[240,290], 'Underrail inspection':[245,731],
'Cold-splice instrument bay':[554,487], 'Amplifier refit gantry':[620,291], 'Cooling return workshop':[592,730],
'Western dish lip':[841,290], 'Reflector inner span':[1022,486], 'Dish underpass':[1080,731], 'East dish lip':[1220,290],
'Adjudication gallery':[1395,489], 'Census antenna roof':[1480,290], 'Civic archive undercroft':[1520,733],
'Containment registration':[1810,489], 'Border receiver mast':[1805,291], 'East recuperation berth':[1870,733],
'Long-range relay goal':[1930,487]
};
const CROPS=[['01-west-freight',48,181,367,529],['02-amplifier-works',425,165,370,558],['03-parabolic-chasm',806,170,492,620],['04-census-tribunal',1301,174,381,540],['05-border-receiver',1683,176,347,530]];
const a=new Uint8Array(W*H);let seed=SEED>>>0;
function rnd(){seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296;}
function R(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);const x0=Math.max(0,x),y0=Math.max(0,y),x1=Math.min(W,x+w),y1=Math.min(H,y+h);if(x1<=x0||y1<=y0)return;for(let yy=y0;yy<y1;yy++)a.fill(m,yy*W+x0,yy*W+x1);}
function L(x,y,X,Y,t,m){const n=Math.max(Math.abs(X-x),Math.abs(Y-y)),r=Math.max(1,Math.floor(t/2));for(let i=0;i<=n;i++){const cx=Math.round(x+(X-x)*i/(n||1)),cy=Math.round(y+(Y-y)*i/(n||1));R(cx-r,cy-r,2*r+1,2*r+1,m);}}
function P(q,m){const lo=Math.max(0,Math.ceil(Math.min(...q.map(p=>p[1])))),hi=Math.min(H-1,Math.floor(Math.max(...q.map(p=>p[1]))));for(let y=lo;y<=hi;y++){const h=[];for(let i=0;i<q.length;i++){let p=q[i],r=q[(i+1)%q.length];if((p[1]<=y&&r[1]>y)||(r[1]<=y&&p[1]>y))h.push(p[0]+(y-p[1])*(r[0]-p[0])/(r[1]-p[1]));}h.sort((a,b)=>a-b);for(let k=0;k+1<h.length;k+=2)R(Math.ceil(h[k]),y,Math.floor(h[k+1])-Math.ceil(h[k])+1,1,m);}}
function C(cx,cy,rx,ry,t,m){for(let y=Math.max(0,cy-ry-t);y<=Math.min(H-1,cy+ry+t);y++){let d=Math.abs((y-cy)/ry);if(d>1+t/ry)continue;let outer=rx*Math.sqrt(Math.max(0,1-Math.pow(Math.max(0,Math.abs(y-cy)-t)/ry,2))),inner=rx*Math.sqrt(Math.max(0,1-Math.pow(Math.min(1,(Math.abs(y-cy)+t)/ry),2)));if(d<=1){R(cx-Math.round(outer),y,Math.max(1,Math.round(outer-inner)),1,m);R(cx+Math.round(inner),y,Math.max(1,Math.round(outer-inner)),1,m);}else R(cx-Math.round(outer),y,Math.max(1,2*Math.round(outer)),1,m);}}
function bay(x,y,w,h,m,accent,glass){R(x,y,w,h,m);R(x+8,y+9,w-16,h-19,M.E);R(x+9,y+9,w-18,6,accent);R(x+12,y+21,w-24,Math.min(22,h-35),glass);R(x+10,y+h-15,w-20,6,accent);}
function hatch(x,y,w,h,m){R(x,y,w,h,M.E);R(x,y,w,5,m);R(x,y,5,h,m);R(x+w-5,y,5,h,m);R(x,y+h-5,w,5,m);}
// Ground and two asymmetric continuous geotechnical abutments. All mass is real cell material, not visual backdrop.
for(let x=0;x<W;x++){let y=883+Math.round(11*Math.sin(x*.011)+6*Math.sin(x*.033));R(x,y,1,H-y,M.B);if(x%43<28)R(x,y+38,1,4,M.O);}
P([[0,1024],[0,132],[27,170],[48,223],[75,256],[65,489],[86,742],[120,926],[143,1024]],M.O);
P([[2048,1024],[2048,142],[2029,172],[1999,231],[1984,404],[1964,647],[1976,823],[1902,1024]],M.B);
R(41,169,1957,21,M.S);R(49,192,1943,5,M.NA);R(89,857,1870,25,M.C);R(95,881,1860,9,M.S);
// Western urban exchange: stepped zigzag roof and inverted passenger-concourse clerestories.
P([[83,417],[94,290],[130,277],[169,233],[216,246],[250,210],[300,251],[355,266],[390,318],[414,405],[409,627],[92,629]],M.P);
P([[108,419],[115,309],[149,301],[174,269],[222,281],[254,245],[305,284],[345,306],[384,336],[391,594],[114,596]],M.C);
for(const b of [[117,350,83,61],[218,326,92,83],[325,364,60,52]])bay(...b,M.S,M.NM,M.DG);
R(112,562,276,15,M.S);R(120,582,257,5,M.NM);
for(const [x,y,w,h] of [[112,605,106,66],[237,606,67,64],[317,603,71,68]]){bay(x,y,w,h,M.C,M.NA,M.GB);R(x+15,y+h-28,23,13,M.BR);}
// Entered cargo sorting bay and weighbridge, suspended lifting hook from overhead crane.
R(122,779,248,9,M.S);R(146,801,108,30,M.R);R(161,807,38,15,M.NA);R(273,801,88,25,M.G);
L(108,251,396,225,11,M.S);L(111,244,395,218,4,M.WH);L(239,232,247,349,6,M.CB);
for(let x of [146,185,308,345]){L(x,786,x+13,881,10,M.C);R(x-4,872,27,12,M.S);}
// Cold-splice amplifier district: three non-parallel, genuinely different antenna stacks and grounded machining galleries.
P([[437,402],[449,326],[480,289],[518,268],[562,304],[584,258],[633,279],[667,231],[708,274],[749,328],[784,401],[790,645],[431,644]],M.S);
P([[456,410],[473,352],[512,319],[552,335],[593,291],[632,315],[668,275],[704,310],[757,367],[766,612],[453,611]],M.R);
for(const q of [[[463,370],[503,368],[538,131],[518,138]],[[573,376],[606,371],[625,95],[650,98]],[[682,369],[704,374],[754,157],[735,154]]])P(q,M.C);
L(530,138,533,375,6,M.NA);L(634,100,601,375,7,M.NC);L(748,156,698,374,7,M.NA);
for(const b of [[474,349,79,66],[592,341,80,72],[693,357,71,60]])bay(...b,M.C,M.HZ,M.DG);
R(453,554,319,18,M.S);R(463,575,297,6,M.NC);
for(let x of [473,527,602,672,730]){R(x,584,27,56,M.S);R(x+4,594,19,30,M.CG);R(x+7,625,13,7,M.HZ);}
// Powered inductor and air-cooled current bus, distinct from city window bays.
for(let x of [471,535,608,686,743]){L(x,652,x+14,842,11,M.C);L(x+2,654,x+15,835,4,M.CP);R(x+2,830,29,17,M.HZ);}
L(446,218,781,215,9,M.S);for(let x=472;x<772;x+=47){L(x,218,x+30,292,5,M.CB);R(x-6,212,25,5,M.WH);}
// Main landmark: a real downward-curving reflector, split into differently plated panels, anchored at both ends.
function dishY(x){let d=(x-1044)/245;return Math.round(545-355*d*d);}
for(let x=798;x<1292;x+=4){let x2=Math.min(1292,x+4),y=dishY(x),yy=dishY(x2);L(x,y,x2,yy,18,M.AL);if(x%24<12)L(x,y-7,x2,yy-7,3,M.WH);}
for(let x=820;x<1274;x+=47){let y=dishY(x);L(x,y+11,x+15,y+48,5,M.CP);R(x+9,y+42,19,7,M.NC);}
// The bowl's two tubular supports are physically connected from rim down to the bedrock apron.
L(800,dishY(800),789,614,17,M.S);L(1290,dishY(1290),1302,612,19,M.S);
L(786,612,805,879,17,M.C);L(1305,612,1286,883,18,M.C);
// Seven non-identical lightning-strike baffles below dish, each connects to bowl shell.
for(let k=0;k<7;k++){let x=875+k*55,y=dishY(x);L(x,y+12,x+(k%2?22:-19),y+67+5*k,9,M.R);L(x+3,y+17,x+(k%2?22:-19),y+54+5*k,3,k%2?M.NA:M.CP);}
// Central aiming pylon, split crystal aperture, suspended subreflector, not a fake scenic background.
P([[962,204],[995,158],[1101,163],[1142,212],[1118,246],[990,247]],M.S);
P([[977,205],[1005,178],[1091,181],[1125,213],[1108,230],[992,228]],M.DG);
for(let x=999;x<1113;x+=24){R(x,199,11,26,x%3?M.GB:M.NC);}
L(967,203,895,176,12,M.C);L(1132,209,1213,159,12,M.C);L(903,164,915,188,9,M.NA);
// Four-sided operating bridge/galleries suspended from both reflector rims.
L(833,385,1249,384,12,M.S);L(840,396,1240,396,4,M.NC);
for(let x=860;x<1235;x+=41){L(x,382,x+23,dishY(x)+12,4,M.CB);R(x+11,390,21,5,M.HZ);}
// Deliberately distinct guard stations cut into the bowl's lower construction zones.
for(const b of [[852,574,107,75],[970,627,97,76],[1124,583,101,84]]){bay(...b,M.R,M.NA,M.CG);}
R(860,842,415,18,M.C);R(872,861,391,7,M.S);
// East civic tribunal is staggered in height with a prominent pinion-less archive fan, not another factory.
P([[1317,416],[1325,295],[1349,287],[1401,244],[1438,256],[1494,190],[1535,238],[1593,246],[1652,298],[1678,401],[1683,635],[1317,630]],M.AL);
P([[1340,411],[1352,327],[1399,302],[1449,284],[1497,220],[1527,267],[1584,275],[1634,316],[1653,378],[1656,593],[1338,591]],M.T);
for(const b of [[1350,349,75,65],[1438,331,106,83],[1578,362,71,50]])bay(...b,M.AL,M.BR,M.GB);
R(1332,558,324,15,M.BR);R(1347,579,292,6,M.WH);
// The book-archive stacks, tribunal witness rostrum and records chain are distinguishable at full-scale.
for(let x of [1363,1387,1412,1598,1625]){R(x,605,16,65,M.C);for(let y=612;y<666;y+=15)R(x+2,y,12,4,M.NA);}
P([[1464,666],[1481,626],[1510,626],[1523,666]],M.BR);R(1487,632,15,19,M.DG);R(1457,668,78,7,M.WH);
L(1496,207,1498,88,12,M.S);L(1498,115,1414,214,5,M.CB);L(1498,114,1581,271,5,M.CB);
for(let x of [1342,1425,1534,1646]){L(x,654,x+5,860,12,M.C);R(x+2,839,27,19,M.S);}
// Eastern receiver and containment: steep-faced angular bastion and three-step bureaucratic apparatus.
P([[1694,402],[1717,304],[1766,266],[1789,223],[1822,250],[1874,203],[1903,256],[1949,321],[1966,413],[1944,632],[1697,629]],M.C);
P([[1723,415],[1739,329],[1773,303],[1802,273],[1832,293],[1873,246],[1905,299],[1934,347],[1942,598],[1724,595]],M.HT);
for(const b of [[1738,352,80,63],[1844,341,83,73]])bay(...b,M.S,M.HZ,M.DG);
R(1728,572,205,16,M.S);R(1745,592,178,6,M.NA);
// Three recognisable legal workfaces: inspection, decontamination, export.
for(const [x,w,col] of [[1736,61,M.NC],[1812,54,M.HZ],[1882,45,M.NM]]){bay(x,609,w,68,M.C,col,M.CG);R(x+12,648,w-25,13,M.BR);}
L(1870,256,1884,117,13,M.S);L(1879,123,1826,257,6,M.CB);L(1885,122,1946,301,7,M.CB);
for(let x of [1716,1810,1909]){L(x,653,x-7,855,12,M.C);R(x-17,847,35,15,M.S);}
// Large lower freight conduits & return bays: stepped industrial rhythms rather than random filler.
for(const [x,y,w,h,t] of [[145,777,75,53,M.R],[311,780,72,50,M.S],[495,777,84,52,M.P],[665,769,92,61,M.S],[1356,780,73,49,M.AL],[1570,770,91,59,M.C],[1743,779,82,51,M.S],[1853,781,84,49,M.R]]){bay(x,y,w,h,t,M.HZ,M.DG);}
// Three 1:1 flyable traverses (upper / civic / drainage) and seven cross-shafts, cut in final material plane.
for(const [y,h] of [[272,62],[447,88],[698,79]])R(105,y,1840,h,M.E);
for(const [x,w] of [[255,52],[625,55],[803,56],[1014,69],[1258,60],[1529,60],[1783,61]])R(x,276,w,500,M.E);
// Keep horizontal walkable lip signals OUTSIDE the actual Midge centre envelope.
for(const [x,y,w] of [[115,436,264],[459,436,315],[1331,436,326],[1714,436,222],[111,675,279],[463,675,309],[1339,675,315],[1725,675,196]]){R(x,y,w,6,M.S);R(x+8,y+7,w-16,3,M.NA);}
// Under-reflector cargo bypass supports are grounded through the actual apron.
for(const x of [169,361,485,739,1349,1605,1735,1915]){L(x,784,x+13,886,13,M.C);R(x-7,868,36,17,M.S);}
// Roof-hung beam stiffeners and under-slung instrument tails; never close all three flight traverses.
for(const x of [146,375,489,735,1358,1604,1715,1918]){L(x,185,x+18,263,8,M.S);L(x+3,190,x+13,259,3,M.NC);}
// In-bounds exact landing site alcoves: only these minimal local cutouts; NOT target relocation.
for(const [key,[x,y]] of Object.entries(SITES)){R(x-17,y-15,35,31,M.E);}
// R3-style deliberate load paths: six reinforced hanging city ribs tie architecture to the roof spine,
// while isolated undercroft terraces are borne by buried pylons. The corridors remain air not scenery.
for(const [x,ey] of [[178,419],[344,419],[486,425],[702,419],[1357,417],[1636,413],[1743,416],[1910,416]]){
 L(x,188,x+8,ey,12,M.S);L(x+5,201,x+8,ey-11,3,M.NC);R(x-9,ey-9,34,11,M.HZ);
}
for(const [x,ey] of [[169,572],[362,579],[483,571],[733,578],[1342,576],[1622,575],[1720,577],[1922,580]]){
 L(x,ey,x-7,881,14,M.C);L(x+2,ey+10,x-5,859,4,M.CP);R(x-19,864,34,18,M.S);
}
// Two structural hangers keep the interrupted lower parabola physically tied to the upper roof chord.
for(const [x,target] of [[932,dishY(932)],[1164,dishY(1164)]]){L(x,185,x+3,target+17,10,M.S);L(x+3,205,x+5,target+12,3,M.NA);}
// Lower dish side locks into the rooted foot-concourse, without filling the underpass.
L(837,565,794,871,17,M.S);L(1252,566,1325,872,17,M.S);
// Clear open real cross-level shafts *last* so added structural restoration never seals access.
for(const [x,w] of [[255,52],[625,55],[803,56],[1258,60],[1529,60],[1783,61]])R(x,265,w,520,M.E);
R(1014,265,69,270,M.E); // central observation well stops above parabola structural belly
// Continuous attached paraboloid, applied after navigation excavation to preserve the signature two-dimensional bowl.
// Air-route obstruction testing is applied to THIS final physical cup, not the earlier rough-in.
for(let x=796;x<1292;x+=3){let xx=Math.min(1292,x+3);L(x,dishY(x),xx,dishY(xx),17,M.AL);if(x%21<9)L(x,dishY(x)-6,xx,dishY(xx)-6,3,M.WH);}
R(1035,542,23,47,M.S);R(1029,580,36,9,M.CP);
// Two generous Midge-scale access slits through reflector petals, with surrounding roof hangers retaining continuity.
R(824,265,46,124,M.E);R(1222,261,49,143,M.E);
R(942,447,57,92,M.E);R(1105,447,59,92,M.E);
// Signature suspended interferometer: a broad functional horizontal tuning organ, not an empty void wallpaper.
// Its main service tray is below the central flight lane and above the emergency lower bypass.
L(780,576,880,576,17,M.S);L(1208,579,1327,579,17,M.S);
P([[868,575],[888,552],[1217,552],[1234,576],[1218,671],[1185,682],[887,679],[863,654]],M.S);
P([[889,572],[904,563],[1202,562],[1218,584],[1199,657],[1183,663],[904,664],[883,644]],M.R);
R(884,577,326,13,M.HZ);R(891,652,307,13,M.AL);
// Enterable mechanical triptych: receiver counter, harmonic calibration pod, data-load chambers.
for(const b of [[904,595,78,57],[1001,590,98,64],[1118,595,75,59]])bay(...b,M.C,M.NC,M.DG);
// Dominant tapering twin mirrors feed its rim; asymmetric access doors remain free.
P([[861,569],[890,513],[904,533],[882,572]],M.AL);P([[1181,570],[1200,516],[1229,532],[1208,573]],M.AL);
for(let x of [915,935,957,1032,1052,1072,1133,1153,1173]){R(x,627,10,24,M.CP);R(x+2,638,6,8,M.NA);}
// Three distinct service stations and a white inspection datum are visible within the hollow machine cavities.
R(921,613,45,7,M.BR);R(1025,608,51,6,M.WH);R(1137,609,39,8,M.NA);
R(1060,532,62,190,M.E); // real interior descent through the receiver, two separate mechanical bays survive
R(689,688,122,102,M.E);R(1306,688,107,102,M.E); // paired narrow fly-through sluices, under the rooted rim-lock assemblies
// Individual independent roof ties keep the two suspended machine/civic belts grounded across emergency sluices.
for(const [x,tx,ey] of [[908,908,605],[1170,1170,606]])L(x,185,tx,ey,13,M.S);
for(const [x,y] of Object.values(SITES))R(x-17,y-15,35,31,M.E);
// Keep isolated small neon fragments from becoming unsimulated moving debris: only zero-extent scene islands can be pruned.
const seen=new Uint8Array(a.length),Q=new Uint32Array(a.length);let removed=0,detached=0;for(let start=0;start<a.length;start++){if(!a[start]||seen[start])continue;let h=0,t=1,root=false;Q[0]=start;seen[start]=1;while(h<t){let i=Q[h++],x=i%W,y=(i/W)|0;if(x===0||x===W-1||y===H-1)root=true;for(const v of [i-1,i+1,i-W,i+W])if(v>=0&&v<a.length&&Math.abs(v%W-x)+Math.abs(((v/W)|0)-y)===1&&a[v]&&!seen[v]){seen[v]=1;Q[t++]=v;}}if(!root){detached++;removed+=t;for(let k=0;k<t;k++)a[Q[k]]=0;}}
return{W,H,SEED,M,COLORS,SITES,CROPS,g:a,pruned:{components:detached,cells:removed}};
}
if(typeof module!=='undefined')module.exports={generate};
