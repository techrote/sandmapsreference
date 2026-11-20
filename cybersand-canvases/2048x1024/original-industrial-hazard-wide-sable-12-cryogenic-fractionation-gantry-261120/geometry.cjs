'use strict';
// SABLE-12 CRYOGENIC FRACTIONATION GANTRY
// Completely new side-elevation material-cell architecture, fixed seed, real 2048x1024 cells.
// Concept: air capture -> tri-fork absorber -> cryogenic cassette train -> membrane-return viaduct -> fraction collector.
const W=2048,H=1024,SEED=2026112012;
const SITES=[
 ['West service-bay spawn',50,520],
 ['Capture control transfer',346,653],
 ['Intake recovery hatch',345,848],
 ['Absorber upper intake',753,207],
 ['Tri-fork inspection berth',608,563],
 ['Scrubber sump return',753,849],
 ['Cold-cassette skylight',1215,303],
 ['Cryogenic sampling access',1020,545],
 ['Dry isotope return bay',1215,843],
 ['Membrane canopy survey',1586,321],
 ['Pressure-relief inspection',1586,620],
 ['Depressurisation lower loop',1586,849],
 ['Collector crown survey',1961,218],
 ['Fraction metrology workface',1961,620],
 ['East rescue catchment',1961,844],
 ['Safety extraction hatch',1961,503]
];
const CROPS=[
 ['01-capture-yard',32,192,387,700],
 ['02-trifork-absorbers',420,157,391,735],
 ['03-cryo-cassettes',808,163,454,727],
 ['04-membrane-viaduct',1256,171,409,724],
 ['05-fraction-collectors',1657,91,389,806],
 ['06-dry-culvert',800,760,811,187]
];
const COLORS={0:[6,15,27],3:[46,122,202],8:[250,82,31],58:[87,108,124],62:[133,158,171],68:[62,120,136],70:[210,226,225],76:[240,175,58],77:[55,212,225],79:[236,138,78],100:[44,58,72],101:[29,39,54],104:[169,97,80],117:[112,149,164],120:[149,208,221]};
function materialWorld(){
 const g=new Uint8Array(W*H);let state=SEED>>>0;
 const rand=()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296};
 const rect=(x,y,w,h,m)=>{x=Math.floor(x);y=Math.floor(y);w=Math.ceil(w);h=Math.ceil(h);
  const a=Math.max(0,x),b=Math.min(W,x+w),c=Math.max(0,y),d=Math.min(H,y+h);
  if(a>=b||c>=d)return;for(let yy=c;yy<d;yy++)g.fill(m,yy*W+a,yy*W+b)};
 const line=(x,y,X,Y,t,m)=>{let n=Math.max(1,Math.ceil(Math.hypot(X-x,Y-y)/2.5));for(let j=0;j<=n;j++){let q=j/n;rect(x+(X-x)*q-t/2,y+(Y-y)*q-t/2,t,t,m)}};
 const frame=(x,y,w,h,t,m)=>{rect(x,y,w,t,m);rect(x,y+h-t,w,t,m);rect(x,y,t,h,m);rect(x+w-t,y,t,h,m)};
 const console=(x,y,w,c)=>{rect(x,y,w,8,70);rect(x+6,y-15,w-12,16,62);rect(x+11,y-11,w-22,6,c);rect(x+8,y+8,9,15,58);rect(x+w-17,y+8,9,15,58)};
 const vessel=(x,y,w,h,liquid)=>{rect(x+13,y+13,w-26,h-26,liquid);frame(x,y,w,h,13,104)};
 const fin=(x,y,w,h,m)=>{rect(x,y,w,h,m);rect(x,y,w,8,70)};
 // Ground-tied frost-black bedrock and continuous dry load path; no falling media.
 for(let x=0;x<W;x+=8){let yy=Math.round(934+4*Math.sin(x/81)+2*Math.sin(x/29));rect(x,yy,8,H-yy,100)}
 rect(0,986,W,38,101);rect(0,932,W,12,58);rect(18,944,2012,7,62);
 // Five individually anchored service-rack zones. Edge portals are kept >= 55 material cells wide.
 const piers=[[81,480],[349,494],[455,465],[767,480],[843,445],[1220,478],[1305,518],[1604,517],[1698,536],[2002,525]];
 for(let [x,y] of piers){rect(x,y,15,932-y,58);rect(x-5,919,25,15,62)}
 // Portals and alternate deep entrances through the otherwise structural right piers.
 for(let x of [349,767,1220,1604,2002]){rect(x-2,558,19,153,0);rect(x-2,810,19,106,0)}
 // Public deep-recovery track is interrupted by four real ladder-width vertical air shafts.
 for(let [a,b] of [[106,362],[461,771],[849,1227],[1310,1612],[1703,1998]]){
  rect(a,880,b-a,11,62);rect(a+11,891,14,42,58);rect(b-27,891,13,42,58)
 }
 // 1. Atmosphere intake berth: double canted aero hood + cargo metering tower and entered control.
 line(83,482,145,305,17,62);line(145,305,250,273,18,62);line(250,273,355,493,18,62);
 line(96,482,158,350,11,117);line(158,350,249,329,10,117);line(249,329,346,496,10,117);
 rect(119,466,234,12,68);rect(113,760,232,12,62);
 rect(126,771,12,115,58);rect(337,771,12,114,58);
 // A large air-capture throat, visibly hanging from its supported cantilever.
 line(172,308,184,487,11,117);rect(178,483,96,13,70);rect(186,496,12,46,58);
 rect(213,541,100,10,62);rect(213,551,10,67,58);
 rect(304,551,10,67,58);rect(221,611,91,9,70);console(237,588,55,77);
 // Independent inlet cargo scale and dry centrifuge cartridge custody.
 rect(137,698,184,11,117);rect(147,709,11,48,58);rect(309,709,12,49,58);
 rect(170,681,52,12,104);rect(183,669,28,12,76);
 console(246,678,54,79);rect(190,723,69,9,68);
 // Deep landing is physically connected to the bedrock by its supporting pier, not air-floating UI.
 rect(164,839,122,12,70);rect(167,851,11,27,58);
 rect(279,851,11,31,58);console(197,820,49,77);
 // 2. Tri-fork absorber: a nonrepeating three-prong vaulted chimney forest.
 line(460,468,503,280,17,62);line(503,280,585,185,17,62);
 line(585,185,646,317,16,62);line(646,317,773,481,18,62);
 line(462,476,577,317,11,117);line(577,317,762,492,11,117);
 rect(470,502,290,13,62);rect(470,763,290,12,62);
 // Independent branch fin columns, taper with distinctive heights.
 for(let [cx,tip,tipWidth,bottom] of [[521,230,39,495],[623,308,46,503],[718,371,32,515]]){
  line(cx-tipWidth,tip+39,cx,tip,12,104);line(cx,tip,cx+tipWidth,tip+39,12,104);
  line(cx-tipWidth,tip+39,cx-10,bottom,10,117);line(cx+tipWidth,tip+39,cx+10,bottom,10,117);
  rect(cx-9,bottom-8,18,30,58);rect(cx-16,bottom+20,32,9,62)
 }
 rect(493,612,241,12,68);rect(493,623,12,136,58);rect(723,623,12,135,58);
 rect(512,665,171,11,70);console(548,642,53,77);console(631,642,44,79);
 // Sealed absorber jacket: actual water in closed structural vessel, anchored from its underside.
 vessel(583,682,88,65,3);rect(594,750,12,18,58);rect(649,750,12,18,58);
 line(545,668,576,681,10,117);line(676,675,712,665,10,117);
 rect(522,824,186,11,62);rect(525,834,13,49,58);rect(692,834,13,47,58);
 console(641,809,49,77);
 // 3. Cryogenic cassette train: not a ring, three slotted stepped cryo shields descending from an H gantry.
 line(845,449,915,261,19,62);line(915,261,1117,278,18,62);
 line(1117,278,1226,479,19,62);
 rect(861,482,345,14,68);rect(864,765,348,13,62);
 rect(872,778,13,155,58);rect(1194,778,13,154,58);
 // Cassettes: staggered in height and span, a compound conductive comb with cut-through flight passages.
 const cassettes=[[893,352,63,89],[1002,328,72,106],[1120,393,56,76]];
 for(let [x,y,w,h] of cassettes){
  frame(x,y,w,h,10,117);rect(x+11,y+12,w-22,11,120);
  rect(x+15,y+h-23,w-30,11,70);
  line(x+w/2,y,x+w/2,y-48,9,58);
  rect(x+w/2-6,y-48,12,8,62);
 }
 line(930,441,930,480,11,58);line(1037,434,1037,481,11,58);
 line(1148,469,1148,480,11,58);
 rect(883,602,298,11,62);rect(883,613,13,149,58);rect(1168,613,13,150,58);
 // Two asymmetric insulated closed vessels with different liquid physics kernels.
 vessel(917,671,82,69,3);vessel(1078,655,92,83,8);
 rect(925,744,11,25,58);rect(982,744,11,25,58);
 rect(1089,741,12,28,58);rect(1149,741,12,28,58);
 console(894,571,49,77);rect(910,594,13,10,58);
 console(1081,576,56,79);rect(1103,599,14,12,58);
 rect(915,831,245,12,70);rect(920,843,11,36,58);rect(1145,843,12,39,58);
 console(1044,816,51,77);
 // 4. Membrane-return viaduct: huge double skew suspension truss, void retained under bridge.
 line(1309,522,1375,316,18,62);line(1375,316,1454,270,17,62);
 line(1454,270,1608,524,18,62);
 line(1312,523,1460,360,11,117);line(1460,360,1607,525,11,117);
 rect(1325,554,257,12,68);rect(1325,566,10,80,58);
 rect(1572,566,11,80,58);
 // Left pressure wheel genuinely attached to the western descending beam.
 for(let [x,y,len] of [[1357,570,55],[1391,604,71],[1433,646,51]]){
  rect(x,y,11,len,117);rect(x,y,62,9,70)
 }
 // Open central canyon and wide flight-negative space, not a filled gallery.
 rect(1515,719,70,13,62);rect(1525,732,13,47,58);
 rect(1417,770,185,11,62);rect(1422,782,14,102,58);rect(1588,782,12,100,58);
 console(1511,747,47,77);
 // A different dry pressure sampling station at the western foot.
 rect(1325,719,108,12,70);rect(1328,732,12,150,58);
 console(1364,696,49,79);
 rect(1345,834,107,10,117);rect(1350,844,12,41,58);
 rect(1436,844,12,37,58);console(1383,807,45,77);
 // Unsupported material never masquerades as active pump: inert valve / manifold geometry.
 line(1478,566,1518,606,10,117);rect(1509,604,31,10,104);
 rect(1523,615,10,65,58);rect(1498,674,43,11,70);
 // 5. Fraction collection crown: humped asymmetric high separators, stepped outlet and extraction.
 line(1702,540,1742,359,17,62);line(1742,359,1791,168,17,62);
 line(1791,168,1863,275,16,62);line(1863,275,1947,399,17,62);
 line(1947,399,2009,527,17,62);
 rect(1714,581,271,13,68);rect(1723,745,262,12,62);
 rect(1733,757,13,124,58);rect(1974,757,12,124,58);
 // Two distinctly sized packed dry collector throats with rooted support legs.
 for(let [x,top,w,h] of [[1752,389,78,157],[1860,473,92,108]]){
  line(x,top,x+w/2,top-41,12,104);line(x+w/2,top-41,x+w,top,12,104);
  rect(x,top,w,11,62);line(x,top,x+16,top+h,10,117);line(x+w,top,x+w-16,top+h,10,117);
  rect(x+13,top+h, w-26,12,70);rect(x+w/2-7,top+h+10,14,35,58)
 }
 rect(1754,659,207,12,70);rect(1754,671,13,76,58);rect(1948,671,12,76,58);
 console(1784,630,55,77);console(1900,627,48,79);
 // Deep sealed ice-quench waste trap: fully contained actual Water, no exposed air.
 vessel(1784,772,94,72,3);rect(1795,848,12,35,58);rect(1854,848,12,34,58);
 rect(1900,823,84,11,117);rect(1910,834,13,47,58);
 console(1928,799,43,77);
 // Grounded bedrock service ribs: every meaningful support reaches an accepted material foundation.
 for(let [x,y] of [[93,760],[343,763],[466,766],[756,772],[848,769],[1210,769],[1308,772],[1601,772],[1698,766],[1999,771]]){
  rect(x,y,12,933-y,58)
 }
 // Portal repairs to prevent fabricated rooms becoming closed static art.
 for(let x of [351,762,1222,1603,1698]){rect(x-4,551,24,143,0);rect(x-4,810,24,88,0)}
 // Open central elevator shafts in raised decks, retaining attachment along alternate beams.
 for(let [x,y,w,h] of [[257,744,55,36],[591,747,58,31],[1007,750,69,43],[1455,746,63,37],[1800,739,68,43]])rect(x,y,w,h,0);
 // Short attached safety markings, never floating visual filler.
 for(let [a,b,y] of [[130,191,761],[485,552,504],[895,954,483],[1336,1393,557],[1730,1800,585]]){
  for(let x=a;x<b;x+=20)rect(x,y-5,9,5,(x%3)?76:77)
 }

 // Explicit load-path closure, anchored along frame edges without filling flight lanes.
 rect(1994,526,12,406,58);rect(884,600,12,333,58);rect(493,617,12,315,58);
 rect(513,677,12,256,58);rect(1327,635,12,298,58);rect(1588,778,12,155,58);
 rect(302,610,12,323,58);rect(594,741,12,192,58);rect(924,739,12,194,58);
 rect(1795,842,12,92,58);rect(1328,723,12,23,58);rect(1102,595,12,22,58);
 rect(1804,650,12,22,58);rect(1401,562,11,52,58);rect(1941,817,12,25,58);
 rect(1359,562,12,21,58);rect(1530,563,11,56,58);rect(1440,609,11,41,58);
 rect(185,690,12,16,58);rect(201,705,11,22,58);rect(1420,775,12,159,58);
 // Empty a stranded bridge mullion segment between two genuine full-width emergency doors.
 rect(1698,694,15,116,0);
 // Attaching the ice/ceramic reflective strips to their actual enclosing cassette frames.
 rect(902,363,7,13,117);rect(901,417,10,12,117);
 rect(1010,339,9,13,117);rect(1010,410,10,13,117);
 rect(1128,404,9,13,117);rect(1128,445,9,13,117);

 rect(548,649,12,284,58);rect(1090,589,12,28,58);rect(1794,635,12,43,58);

 // Five literal full-envelope maintenance flight shafts connect the accessible
 // open atmosphere to each process workface, rather than treating static art as a corridor.
 // Their mouths are intentional roof voids; neither a painted screenshot nor a nearest-site waiver.
 for(let [x,top,w,bottom] of [[321,145,52,899],[729,145,53,899],[1190,145,54,898],[1564,145,56,897],[1938,125,53,898]]){
  rect(x,top,w,bottom-top,0);
 }

 // Post-hatch engineering: alternate rooted piers and beneath-deck hard points
 // carry roofs/transfer racks outside the deliberately open Midge shafts.
 rect(1705,540,13,393,58);rect(1525,770,12,163,58);
 rect(1164,771,12,163,58);rect(689,764,12,169,58);
 rect(1900,752,12,181,58);rect(1930,816,11,117,58);
 return g;
}
if(typeof module!=='undefined') module.exports={W,H,SEED,SITES,CROPS,COLORS,materialWorld};
