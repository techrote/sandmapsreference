'use strict';
/** PORTRAIT-001 B: original 1024x2048 material-cell recomposition of Quoin split faultwell.
 * Only design vocabulary/provenance is inherited; all geometry is constructed anew.
 * Run via build.cjs. All coordinates are literal native material cells.
 */
function layoutWorld(){
const W=1024,H=2048,g=new Uint8Array(W*H),seed=202611211247;
const M={0:"air",3:"water",8:"lava",58:"reinforced",62:"plate",65:"rust",68:"steel-pipe",69:"copper-pipe",76:"hazard",79:"amber",100:"basalt",104:"firebrick",117:"iron",131:"shield"};
const b=(x,y,w,h,m)=>{[x,y,w,h]=[x,y,w,h].map(Math.round);if(x<0||y<0||w<=0||h<=0||x+w>W||y+h>H)throw Error("bounds "+[x,y,w,h,m]);for(let j=y;j<y+h;j++)g.fill(m,j*W+x,j*W+x+w);};
const l=(x,y,X,Y,t,m)=>{const n=Math.ceil(Math.hypot(X-x,Y-y)/Math.max(2,t/2));for(let i=0;i<=n;i++){let f=i/n;b(x+(X-x)*f-t/2,y+(Y-y)*f-t/2,t,t,m);}};
const sites=[
["West survey arrival",259,154],["East optical mast",768,170],
["Isotope habitat",216,345],["High calibration",812,380],
["West calibration",249,625],["Sterile custody",784,758],
["West mid interlock",406,937],["East mid assay",620,937],
["Lower west quarantine",253,1140],["Lower east spectrum",770,1170],
["Recovery camp",244,1440],["Recorder relay",794,1485],
["Deep western ledger",248,1780],["Deep eastern exchange",770,1760],
["Extraction goal",762,1892],["West fault reveal",380,750],
["East shaft lookout",844,1320],["Lower expansion seam",405,1604]
].map(([name,x,y])=>({name,x,y}));
b(0,0,W,H,100);
b(107,92,817,1858,0); // central double-height cavity, perpendicular side elevation
// Rebuilt opposed rooted ledges, staggered along two vertical survey lanes.
for(const [y,w] of [[278,242],[565,327],[1060,295],[1430,305],[1710,215]]){
 b(106,y,w,16,100);b(110,y,Math.max(80,w-30),8,62);b(108,y+16,11,30,68);}
for(const [y,w] of [[450,263],[803,318],[1258,262],[1585,340],[1834,242]]){
 b(924-w,y,w,17,100);b(924-w+15,y,w-15,7,62);b(911,y+17,11,33,58);}
// Unequal anchored fault vanes are separated by a torn central reveal.
b(490,92,34,442,100);b(498,92,17,450,58);
b(511,1652,35,298,100);b(519,1650,15,300,58);
b(0,0,W,70,58);b(0,1960,W,88,100);
// Independent side-chamber interiors, entered from the main wells.
for(const q of [[35,302,100,230],[30,975,104,270],[33,1513,100,259],
[898,510,100,260],[899,1035,103,290],[899,1620,100,270]])b(...q,0);
// West inhabited isotope habitat and anchored tether.
b(35,329,86,10,62);b(36,339,12,87,58);b(54,353,46,31,104);b(63,359,26,15,131);
b(107,364,91,10,62);b(108,374,11,57,68);b(124,390,39,26,65);
b(35,474,91,10,62);b(40,484,10,38,58);
l(112,302,203,255,7,68);b(125,279,47,7,69);
for(let y=343;y<=422;y+=26){b(117,y,12,13,79);b(127,y+8,39,5,69);}
// East survey mast and optical receivers.
b(910,122,12,225,58);b(845,193,73,11,62);b(857,204,10,89,68);
l(918,166,974,100,7,117);l(902,178,972,224,7,68);
b(897,315,94,11,62);b(982,326,9,34,58);
for(const [x,y]of[[927,242],[952,272],[923,297]]){b(x,y,18,20,104);b(x+4,y+5,10,10,131);}
// Two distinctive early calibration/custody transactions.
b(110,632,93,10,62);b(110,642,12,52,58);
b(130,655,44,34,65);b(138,663,28,17,131);
b(902,570,91,12,58);b(982,582,11,132,58);b(903,710,88,10,62);
for(const [x,y] of [[929,602],[958,644]]){b(x,y,22,28,104);b(x+5,y+7,11,13,131);}
b(899,743,92,11,62);b(984,754,8,19,68);
// Authentic rock-rooted survey booms, not floating visual facades.
for(const [y,dx]of[[715,66],[927,92],[1182,73],[1357,95],[1650,70]]){
 b(107,y,dx,10,58);b(113,y+10,11,31,68);b(128,y+41,28,7,69);b(138,y+48,12,9,79);}
for(const [y,w]of[[916,93],[1091,78],[1418,89],[1725,80]]){
 b(924-w,y,w,10,62);b(911,y+10,12,39,58);b(911-w/2,y-24,9,24,68);}
// Lower quarantine, sealed specimens and entered worker relief.
b(33,1007,94,10,62);b(35,1017,10,125,58);
b(52,1047,41,25,65);b(60,1055,25,10,131);b(67,1093,10,31,69);
b(32,1195,97,11,62);b(36,1206,10,38,58);
b(899,1086,97,12,62);b(986,1098,9,91,58);
b(922,1120,43,26,104);b(931,1128,24,10,131);
b(897,1273,97,11,62);b(986,1284,10,33,58);
// Rescue camp and deep recording, with deliberate module gaps.
b(35,1544,91,12,62);b(35,1556,12,105,58);b(55,1574,51,31,65);
b(63,1581,35,15,131);b(33,1704,91,11,62);b(35,1715,12,48,58);
b(897,1637,98,10,62);b(983,1647,11,135,58);
b(914,1667,53,36,104);b(923,1676,32,15,131);b(900,1804,96,10,62);
// Anchored per-level material conduits.
for(let y=190;y<1820;y+=126){b(107,y,8,55,69);b(116,y+6,11,11,79);
 b(916,y+33,8,55,68);b(899,y+47,17,8,76);}

// Added physically grounded Quoin observatories and nested maintenance transactions.
const ring=(cx,cy,r,t,m)=>{const pts=[];for(let k=0;k<8;k++){const a=2*Math.PI*k/8;pts.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r]);}for(let k=0;k<8;k++){const a=pts[k],p=pts[(k+1)%8];l(a[0],a[1],p[0],p[1],t,m);}};
b(110,481,325,11,58);b(126,471,27,10,62);b(185,468,64,12,65);
b(205,480,12,70,68);b(269,489,12,49,69);
b(183,499,83,18,104);b(197,505,54,7,131);
b(316,496,11,57,68);b(285,528,82,9,62);
b(652,374,270,12,58);b(661,361,63,13,62);
b(711,382,14,62,68);b(740,400,59,20,65);
b(752,404,32,11,131);b(821,387,18,56,69);
// Rooted right-bank annulus, no barrier across west upper 31x27 flight clearance.
b(770,705,154,10,68);l(765,705,759,676,8,68);
ring(700,684,56,10,117);ring(700,684,37,7,69);
b(692,628,15,20,79);b(645,676,13,14,76);
b(761,678,12,16,76);
// West interlock and south cargo-yard metrology, separate entered workplaces.
b(106,810,318,15,58);b(396,823,13,42,69);
b(206,778,74,32,65);b(222,786,42,18,131);
b(308,790,53,20,104);b(319,798,32,11,131);
b(144,823,14,54,68);b(150,842,42,8,62);
b(608,1000,317,15,58);b(629,1015,13,52,68);
b(684,969,70,30,104);b(696,980,47,12,131);
b(817,957,55,42,65);b(825,964,40,14,131);
// Alternating east cantilever scope, an explicit load path to cliff.
b(482,1246,442,15,58);b(495,1127,15,119,68);b(506,1127,12,13,79);
b(515,1202,86,11,62);b(555,1213,13,33,69);
b(615,1218,96,12,117);b(626,1229,11,17,68);
b(685,1246,14,75,68);b(741,1262,12,56,69);
b(778,1284,55,18,65);b(786,1288,38,9,131);
// West grounded rescue machinery.
b(107,1330,301,13,58);b(126,1311,74,19,65);
b(143,1317,43,9,131);b(205,1330,11,63,68);
b(327,1343,14,80,68);b(287,1390,76,9,62);
b(378,1430,16,137,58);b(355,1467,35,8,69);
b(121,1471,81,12,62);b(133,1483,10,45,68);
// East deep nested rotor, anchored in grounded right landing.
b(689,1585,77,10,58);b(704,1552,13,33,68);
ring(729,1496,55,10,117);ring(729,1496,37,7,69);
b(715,1550,12,39,68);b(660,1493,23,9,76);b(775,1493,20,9,76);
b(781,1585,102,13,62);b(843,1598,11,45,68);
// Lower western ledger, east extraction and unscripted repair bays.
b(107,1814,304,15,58);b(136,1790,55,24,65);
b(147,1797,32,11,131);b(209,1761,12,54,68);
b(236,1796,44,18,104);b(245,1802,26,8,131);
b(304,1802,16,12,69);b(356,1829,14,43,68);
b(375,1859,31,9,62);
b(653,1905,265,12,58);b(690,1872,13,33,68);
b(725,1875,46,26,65);b(736,1882,29,10,131);
b(813,1878,52,23,104);b(825,1886,28,10,131);
b(873,1837,12,67,68);b(890,1855,25,9,76);

// Deliberate rock rooted fixed machinery ties, not decorative floating solids.

for(const [x,y,w,h,m] of [
[918,1246,87,14,58],[760,705,245,10,68],[985,571,20,10,58],
[987,1087,18,12,58],[890,1852,115,11,58],
[28,1060,120,11,58],[795,412,140,9,58],[28,1710,114,16,58],
[28,1007,12,11,58],[867,972,64,10,68],[750,980,130,9,68],
[961,1677,44,9,68],[790,1750,215,9,68],
[141,642,8,14,68],[75,339,8,15,68],
[764,386,9,15,68],[45,1585,15,9,68]
])b(x,y,w,h,m);

// Two enclosed fluid specimens, entirely within the outer rock.
b(49,803,39,28,3);b(951,872,37,27,8);
// Explicit exact-site clearance; no target-coordinate shifting.
for(const q of sites)b(q.x-19,q.y-17,39,35,0);
// Remove genuinely unsupported inert fragments rather than retain ungrounded simulacra.
const solid=id=>id!==0&&id!==3&&id!==8,seen=new Uint8Array(g.length),q=new Int32Array(g.length);let a=0,z=0;
const add=i=>{if(solid(g[i])&&!seen[i]){seen[i]=1;q[z++]=i;}};
for(let x=0;x<W;x++){add(x);add((H-1)*W+x);}for(let y=0;y<H;y++){add(y*W);add(y*W+W-1);}
while(a<z){let i=q[a++],x=i%W;for(const j of[x?i-1:-1,x<W-1?i+1:-1,i>=W?i-W:-1,i+W<g.length?i+W:-1])if(j>=0)add(j);}
let lost=0;for(let i=0;i<g.length;i++)if(solid(g[i])&&!seen[i]){g[i]=0;lost++;}
return {W,H,g,M,seed,sites,spawn:[sites[0].x,sites[0].y],discarded_ungrounded:lost};}
if(typeof module!=="undefined")module.exports={layoutWorld};
