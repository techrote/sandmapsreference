'use strict';
function utf(s){let r=[];for(const z of s){let k=z.codePointAt(0);if(k<128)r.push(k);else if(k<2048)r.push(192|(k>>>6),128|(k&63));else if(k<65536)r.push(224|(k>>>12),128|((k>>>6)&63),128|(k&63));else r.push(240|(k>>>18),128|((k>>>12)&63),128|((k>>>6)&63),128|(k&63));}return Uint8Array.from(r);}

function sha256(msg){const k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2],n=(msg.length+9+63)&~63,b=new Uint8Array(n);b.set(msg);b[msg.length]=128;const bit=msg.length*8,view=new DataView(b.buffer);view.setUint32(n-8,Math.floor(bit/4294967296),false);view.setUint32(n-4,bit>>>0,false);let H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64),rr=(x,n)=>(x>>>n)|(x<<(32-n));for(let off=0;off<n;off+=64){for(let i=0;i<16;i++)w[i]=view.getUint32(off+4*i,false);for(let i=16;i<64;i++){let x=w[i-15],y=w[i-2];w[i]=(w[i-16]+(rr(x,7)^rr(x,18)^(x>>>3))+w[i-7]+(rr(y,17)^rr(y,19)^(y>>>10)))|0;}let[a,c,d,e,f,g,h,j]=H;for(let i=0;i<64;i++){let t=(j+(rr(f,6)^rr(f,11)^rr(f,25))+((f&g)^(~f&h))+k[i]+w[i])|0,u=((rr(a,2)^rr(a,13)^rr(a,22))+((a&c)^(a&d)^(c&d)))|0;j=h;h=g;g=f;f=(e+t)|0;e=d;d=c;c=a;a=(t+u)|0;}H=[(H[0]+a)|0,(H[1]+c)|0,(H[2]+d)|0,(H[3]+e)|0,(H[4]+f)|0,(H[5]+g)|0,(H[6]+h)|0,(H[7]+j)|0];}return H.map(x=>(x>>>0).toString(16).padStart(8,"0")).join("");}

function world(){
 const W=2048,H=1024,g=new Uint8Array(W*H);
 const M={0:"empty",3:"water",8:"lava",58:"reinforced-concrete",62:"steel-plate",65:"rusted-steel",66:"steel-grating",68:"steel-pipe",69:"copper-pipe",72:"dark-glass",76:"hazard-stripe",77:"neon-cyan",79:"neon-amber",100:"basalt-columns",104:"firebrick",117:"bare-iron",131:"heat-shield-tile"};
 const SEED=0x261120a9;let state=SEED;
 function rand(){state=(Math.imul(1664525,state)+1013904223)>>>0;return state/4294967296;}
 function r(x,y,w,h,id){x=Math.floor(x);y=Math.floor(y);w=Math.ceil(w);h=Math.ceil(h);if(x<0||y<0||w<1||h<1||x+w>W||y+h>H||!(id in M))throw Error("invalid authored rect "+[x,y,w,h,id]);for(let yy=y;yy<y+h;yy++)g.fill(id,yy*W+x,yy*W+x+w);}
 function beam(x,y,x2,y2,w,id){let n=Math.ceil(Math.max(Math.abs(x2-x),Math.abs(y2-y))),step=Math.max(2,Math.floor(w/3));for(let i=0;i<=n;i+=step){let t=i/n;r(x+(x2-x)*t-w/2,y+(y2-y)*t-w/2,w,w,id);} }
 function oval(cx,cy,rx,ry,id){for(let yy=-ry;yy<=ry;yy++){let hx=Math.floor(rx*Math.sqrt(Math.max(0,1-yy*yy/(ry*ry))));r(cx-hx,cy+yy,2*hx+1,1,id);}}
 // ANVILWAKE TWIN-DOCK ELECTROSMELTER. No conversion geometry.
 // A waterborne-side industrial dock in genuine perpendicular 2D.
 // Ore transfer -> coupled opposed induction hearths -> counterweight ferry/crucible
 // -> paired continuous bloom extrusion drums -> segregated quench -> elevated dispatch.
 // Two enormous asymmetric arch-crane pylons and a hollow counterweight well
 // dominate the skyline; a separated, enterable lower mechanical works returns.
 // Foundation, 1:1 manufacturing floor, raised endwall piers.
 r(0,911,W,113,100);r(0,899,W,12,58);
 r(12,126,29,773,58);r(2004,106,29,793,58);
 r(41,694,1963,17,62);r(41,711,1963,34,58);
 r(41,745,1963,25,65);r(41,770,1963,129,58);
 r(44,116,1960,15,65);r(44,131,1960,9,62);
 // Staggered outer roof silhouette: arched transfer mast between two short roofs.
 beam(41,125,260,80,12,65);beam(260,80,535,121,12,62);
 beam(539,116,757,56,13,65);beam(757,56,945,122,13,62);
 beam(947,122,1089,60,17,65);beam(1089,60,1305,120,17,62);
 beam(1307,122,1593,72,12,65);beam(1593,72,1774,122,12,62);
 beam(1778,122,1915,92,10,65);beam(1915,92,2004,125,10,62);
 r(43,138,1959,7,66);
 // The massive weight of roof plus flying crane is actually supported by boundary columns.
 // Exposed door-height service viaduct and longitudinal hanger with daylight beneath.
 r(746,154,583,15,62);r(750,169,575,7,76);
 for(const x of [756,958,1132,1318]){r(x,143,13,21,68);r(x-4,174,22,9,117);}
 // Lower mining/servicing gallery, a dry flight corridor separated from ground.
 r(45,790,1952,101,0);
 // Full Midge elevator wells. Cut last to preserve the physical flight openings.
 r(198,285,113,615,0);r(1828,288,115,612,0);
 r(175,470,13,212,68);r(319,470,12,212,62);
 r(1811,469,12,216,62);r(1949,474,12,209,68);
 // Ore dock: actual side-tip wagon, descending counterweighted charge bin.
 r(58,630,321,64,58);r(73,618,273,12,62);
 r(82,598,243,17,65);r(95,585,151,15,76);
 r(107,554,149,30,117);r(115,559,115,13,72);
 for(let x=121;x<241;x+=32){r(x,584,19,16,117);r(x+5,587,8,10,79);}
 r(77,506,15,78,68);r(255,506,16,79,68);r(79,495,191,11,65);
 r(102,504,141,39,58);r(114,511,119,21,72);
 beam(260,518,398,615,14,62);beam(265,523,396,624,5,76);
 r(373,598,25,96,58);r(381,554,17,45,68);r(366,544,41,14,117);
 r(392,606,50,15,104);r(392,624,62,20,131);
 // Paired furnace heads, explicitly unequal. Internal hot charge completely sealed.
 function hearth(x,y,w,h,hotx,hoty,hotw,hoth,top){
  r(x,y,w,h,131);r(x+12,y+16,w-24,h-43,104);
  r(hotx,hoty,hotw,hoth,8);
  r(x+20,y+25,w-40,13,117);
  r(x+18,y+56,w-36,17,72);
  r(x+32,y+63,17,6,79);
  r(x-11,y+h-14,w+22,14,58);
  r(x+23,y-23,24,23,62);
  r(x+16,top,38,y-top-22,65);
  r(x+11,top-12,48,12,131);
  r(x+26,top-22,18,10,79);
 }
 hearth(436,420,161,274,464,524,105,73,333);
 hearth(631,391,149,303,656,491,98,81,311);
 // Different charging and serviced heat-face mechanics, not cloned taps.
 r(411,511,24,118,68);r(401,518,34,18,76);
 r(601,565,31,17,69);r(598,582,43,16,117);
 r(786,536,21,82,68);r(781,525,35,14,76);
 r(458,640,326,17,62);r(451,657,339,37,58);
 r(523,629,12,29,69);r(690,622,12,36,69);
 beam(587,588,672,601,7,69);
 // Warm overpressure plumbing roots into serviced furnace shells.
 r(493,368,16,53,68);r(671,350,20,42,68);
 r(499,360,163,9,69);r(497,354,16,20,117);
 r(661,349,24,14,65);
 // Central counterweighted transfer ferry: raised bridge gantry, two deep unequal
 // pylons with grounded feet, continuous side-elevation suspension hardware.
 r(822,671,366,23,58);r(841,652,322,19,62);
 r(830,407,26,245,58);r(1157,400,27,252,58);
 beam(828,409,934,196,14,65);beam(1159,404,1110,202,16,65);
 beam(934,196,1084,192,19,62);beam(1084,192,1110,202,18,65);
 r(941,191,162,14,62);r(947,205,150,9,76);
 // Divergent suspended pulley carriages (one large counterweight box at west).
 r(910,227,98,23,117);r(920,250,13,191,68);r(981,250,12,124,68);
 r(887,440,110,85,65);r(895,447,94,67,131);r(910,456,62,46,72);
 r(920,473,39,10,79);r(917,523,51,12,117);
 r(934,534,19,118,68);
 // Central dry ladle with broad receiving snout and service lips; no mobile lava outside hearth.
 r(1000,386,130,19,117);
 r(1015,405,97,120,104);
 r(1025,421,77,81,131);
 r(1006,507,119,21,65);
 r(1047,528,29,123,58);
 r(1000,482,14,20,69);r(989,486,17,12,76);
 r(1124,496,37,12,69);r(1154,500,14,45,117);
 r(1151,546,46,13,65);
 // Transfer mezzanines and reachable inspection bays on each anchored side.
 r(844,629,82,12,66);r(850,610,16,18,68);
 r(1085,611,78,13,66);r(1138,593,13,18,69);
 r(904,594,26,16,72);r(909,599,10,6,77);
 // Two decidedly horizontal, different-length centrifugal extraction drums.
 // Each drum connects with legs to the main production deck. Shallow mechanical
 // colour differentiation encodes actual inspection / uptake / shear operations.
 r(1222,662,376,32,58);r(1235,648,348,14,62);
 oval(1304,574,80,57,117);oval(1304,574,64,45,131);
 oval(1304,574,44,28,72);r(1273,567,61,12,79);
 r(1290,618,30,30,68);r(1253,632,104,15,65);
 oval(1469,565,89,45,65);oval(1469,565,73,33,104);
 oval(1469,565,49,23,72);r(1433,558,68,10,77);
 r(1452,608,28,39,68);r(1420,632,99,15,65);
 // Transmission belts and unequal clutches physically connect the caster drums.
 r(1230,493,336,14,65);r(1240,507,316,7,76);
 r(1298,514,13,25,69);r(1464,514,13,22,68);
 r(1388,574,12,32,117);r(1395,588,26,13,76);
 r(1516,604,26,44,117);r(1524,610,9,21,79);
 r(1560,563,37,98,131);r(1574,535,16,28,68);r(1575,552,10,7,77);
 // Protected inspection throat and shearing ram before quench.
 r(1599,589,19,104,58);r(1606,572,44,17,76);
 r(1628,539,18,33,68);r(1623,559,15,12,117);
 r(1609,624,38,12,72);r(1614,627,16,7,79);
 // Dry, demonstrably closed quench cassette with two tanks of different footprint.
 r(1647,555,103,139,131);r(1658,566,81,107,104);
 r(1669,581,59,81,3);r(1665,578,66,4,104);
 r(1764,586,74,108,131);r(1775,596,52,85,104);
 r(1786,606,30,65,3);r(1782,603,38,4,104);
 r(1646,694,218,13,58);r(1649,540,107,15,65);
 r(1760,571,84,15,62);r(1683,529,17,11,69);
 r(1798,557,14,14,68);
 // Cargo turntable at landward gate, with guarded loading tracks and cranes.
 r(1864,641,135,53,58);r(1866,624,128,17,62);
 r(1950,534,12,91,68);r(1881,533,81,13,65);
 r(1878,547,94,65,117);r(1887,553,77,51,72);
 r(1894,561,61,10,79);r(1890,610,72,14,76);
 r(1970,606,16,18,69);r(1980,577,12,24,68);
 // Operated underplant: all machine workfaces are substantial and grounded through
 // floor. Airy corridor above machinery permits a 31x27 Midge body to navigate.
 r(63,877,132,22,58);r(68,866,117,11,65);
 oval(124,882,43,15,117);oval(124,882,28,8,72);
 r(161,854,16,15,68);r(175,851,18,26,131);
 r(356,876,208,23,58);r(364,859,188,17,62);
 r(372,842,24,18,68);r(413,848,17,11,117);
 r(440,833,20,27,131);r(445,843,9,10,77);
 r(491,846,50,13,65);r(503,835,12,11,69);
 r(611,875,270,24,58);r(620,856,252,19,65);
 oval(675,879,52,18,117);oval(675,879,34,9,72);
 r(742,834,28,23,131);r(749,842,13,9,79);
 r(783,851,22,22,68);r(822,839,42,34,117);
 r(836,843,12,16,72);
 r(974,877,231,22,58);r(983,858,215,19,62);
 for(const [x,h] of [[994,24],[1028,17],[1075,29],[1128,22]]){r(x,858-h,18,h,131);r(x+5,865-h,8,8,77);}
 r(1162,839,27,19,68);
 r(1282,875,265,24,58);r(1291,858,250,17,65);
 r(1307,838,36,19,72);r(1315,845,14,6,79);
 oval(1421,882,47,17,117);oval(1421,882,29,9,72);
 r(1486,847,19,27,69);r(1506,837,28,37,131);
 r(1615,873,185,26,58);r(1625,858,165,15,62);
 r(1640,840,23,18,68);r(1681,838,21,20,131);
 r(1715,849,42,9,117);r(1720,839,32,10,76);
 r(1763,841,16,33,69);
 // A deliberate finite amount of stamped independent structural repair texture.
 for(let i=0;i<42;i++){let x=48+Math.floor(rand()*1950);if(x>1970)continue;let y=745+Math.floor(rand()*16);r(x,y,5+Math.floor(rand()*5),3, i%4?65:76);}

 // Load paths supplied to all independent service assemblies and primary plant mass.
 // Main production deck hangs by a deliberate structural roof-hanger to the boundary-rooted frame.
 r(959,140,18,62,65);
 r(776,534,13,89,68); // furnace uptake service pipe to hearth casing
 r(1316,853,16,23,68); // underplant control bench leg to founded floor
 r(913,606,13,27,68); // west crane inspection booth leg to mezzanine
 r(1983,593,10,56,68); // end switchboard power conduit to freight plinth


 // R2: operated continuous side-tip ore charge (pickup throat, guide roller,
 // heavy shield and furnace entry), without changing transit corridors.
 r(387,560,54,19,62); r(396,548,42,12,131);
 r(404,531,26,17,117); r(411,535,12,8,79);
 r(427,533,17,42,68); r(437,549,11,23,104);
 r(387,579,18,29,58); r(405,601,25,12,65);
 r(423,598,20,17,76); r(390,565,49,5,69);
 // Real nozzle/tundish-to-drum material handoff: refractory transfer
 // channel, isolation gate, lagged spout and a founded receiving shoe.
 r(1108,488,29,35,104); r(1119,504,22,25,117);
 r(1136,517,108,13,131);r(1143,530,105,9,65);
 r(1156,506,77,11,69);r(1229,514,22,37,117);
 r(1236,540,27,16,104);r(1243,550,18,10,76);
 r(1171,538,18,66,68);r(1185,597,33,11,58);
 // Re-author the SIX entered service bays from their true material cells.
 // The upper dry recovery channel at y790-824 is never touched.
 for(const [x,width] of [[62,135],[355,211],[610,276],[972,235],[1280,269],[1612,190]])r(x,827,width,72,0);
 // A. Service-return winch: split runout rail, operator control turntable.
 r(68,885,126,14,58);r(77,872,108,13,62);
 r(86,852,11,20,68);r(165,850,12,23,68);
 r(80,842,100,9,65);r(109,851,18,23,117);
 r(132,854,27,17,72);r(136,859,16,7,77);
 r(94,876,12,9,76);r(164,876,11,9,76);
 // B. Piston dismantling: exposed hydraulic ram, opposed strip-down jaws,
 // linear dismantling rail and overhead receiving hook.
 r(358,879,205,20,58);r(368,870,185,9,65);
 r(378,854,42,16,117);r(390,858,26,8,72);
 r(416,849,101,19,68);r(433,853,87,10,62);
 r(515,842,24,28,131);r(519,850,14,11,76);
 r(382,840,13,14,69);r(484,833,12,15,65);
 r(391,835,97,7,62);r(445,842,8,10,79);
 r(463,870,15,9,68);r(530,870,13,9,68);
 // C. Coil winding: unequal copper windings on shared spindle,
 // central axle, tension feed, motor and guarded inspection point.
 r(612,883,274,16,58);r(620,873,259,10,65);
 oval(684,857,41,20,69);oval(684,857,25,12,72);
 oval(777,860,31,16,69);oval(777,860,18,9,72);
 r(681,838,8,38,117);r(775,845,7,29,117);
 r(715,850,35,10,62);r(744,851,12,7,76);
 r(827,847,39,24,131);r(837,854,15,12,77);
 r(646,875,11,8,68);r(843,871,12,12,68);
 r(656,833,121,7,65);r(668,830,8,8,79);
 // D. Hydraulics diagnostics: tall unequal test cylinders,
 // readable glass gauges, linked manifold and grounded collection rail.
 r(974,881,231,18,58);r(984,870,215,11,62);
 for(const [x,ww,top] of [[997,29,841],[1064,40,834],[1151,25,846]]) {
   r(x,top,ww,870-top,131);r(x+5,top+7,ww-10,17,72);
   r(x+8,top+12,ww-16,7,77);r(x+ww/2-4,top-9,8,10,69);
 }
 r(995,831,183,7,68);r(1029,838,6,24,69);
 r(1110,838,8,30,69);r(1180,853,12,20,117);
 r(1050,870,12,11,76);r(1130,869,15,12,76);
 // E. Spindle overhaul: physically long lathe, unequal chucks,
 // a true tool rest with lift-arm and individual driven gearheads.
 r(1284,881,259,18,58);r(1292,869,245,12,65);
 r(1304,848,38,21,131);r(1311,854,22,10,72);
 r(1342,850,149,14,117);r(1354,854,135,6,62);
 oval(1371,855,24,15,65);oval(1371,855,13,9,72);
 oval(1481,858,30,12,69);oval(1481,858,14,7,117);
 r(1514,843,19,25,131);r(1518,850,11,10,76);
 beam(1457,832,1506,848,6,68);r(1412,829,35,7,65);
 r(1355,868,12,13,68);r(1494,869,15,12,68);
 // F. Filter and service pump: open mesh cassettes, inclined airduct,
 // centrifugal housing, pressure pipe, inspected discharge/return.
 r(1617,881,182,18,58);r(1624,871,169,10,62);
 r(1634,839,58,30,131);r(1640,844,46,20,72);
 for(const x of [1645,1658,1671,1684])r(x,847,5,16,66);
 beam(1693,850,1732,870,7,68);
 oval(1750,856,24,20,117);oval(1750,856,13,11,72);
 r(1745,833,9,11,69);r(1776,842,11,30,131);
 r(1780,848,5,15,77);r(1709,869,10,12,69);
 // All six workshops remain beneath the empty conservative flight lane.
 // Two generous open-sky egress ports make the ABOVE-ROOF Midge route a real
 // second transit path separate from the underdeck technical return. Both are
 // intentional ventilated horizontal roof gaps, not false perspective art.
 r(709,0,85,187,0);
 r(1384,0,101,187,0);
 // Edge protection and load-bearing jambs belong to adjacent intact roof.
 r(697,144,12,43,65);r(794,144,12,43,65);
 r(1372,144,12,43,65);r(1485,144,12,43,65);

 // Structural low-height tie from central crane roof island to east boundary roof.
 // It sits BELOW the open-to-sky ventilation exits, leaving the aerial Midge
 // trajectory above y187 and over the roof unobstructed.
 r(1359,145,15,220,68);r(1495,145,15,220,68);
 r(1359,351,151,14,65);r(1359,365,151,7,76);
 // Re-open only the ACTUAL wing/underplant passage, leaving strong supports outside.
 r(198,285,113,615,0);r(1828,288,115,612,0);
 // Named true coordinates, no shifting or nearest-site substitutes.
 const sites=[
 ["Ore arrival / Midge spawn",101,232],["Charge gantry",363,231],
 ["West recovery shaft",255,396],["Left furnace",476,231],
 ["Right induction crest",699,233],["West transfer inspection",832,231],
 ["East counterweight escape",1210,274],["Ladle control gallery",1186,232],
 ["Drum drive gallery",1306,232],["Second drum gallery",1455,232],
 ["Shear booth",1594,233],["Quench surveillance",1741,232],
 ["East elevator shaft",1882,418],["Outbound dispatch goal",1970,232],
 ["West machine cellar",114,810],["Piston teardown",440,810],
 ["Coil rebuild bay",743,811],["Hydraulics laboratory",1078,810],
 ["Spindle repair shop",1410,810],["Filter and pump cell",1672,810],
 ["East lower landing",1883,809]
 ].map(([name,x,y])=>({name,x,y}));
 return {g,W,H,M,seed:SEED,sites,spawn:[101,232]};
}

function bridgeSupport(world) {
 const {g,W,H}=world,N=g.length,solid=v=>v!==0&&v!==3&&v!==8,root=new Uint8Array(N),q=new Int32Array(N);let at=0,tail=0;
 for(let x=0;x<W;x++){let p=(H-1)*W+x;if(solid(g[p])){root[p]=1;q[tail++]=p;}}
 while(at<tail){const i=q[at++],x=i%W,y=(i/W)|0;for(const j of[x?i-1:-1,x+1<W?i+1:-1,y?i-W:-1,y+1<H?i+W:-1])if(j>=0&&solid(g[j])&&!root[j]){root[j]=1;q[tail++]=j;}}
 const visited=new Uint8Array(N),components=[];let maxSize=0;
 for(let i=0;i<N;i++)if(solid(g[i])&&!root[i]&&!visited[i]){let comp=[],front=0,end=0;const queue=[i];visited[i]=1;while(front<queue.length){let v=queue[front++];comp.push(v);let x=v%W,y=(v/W)|0;for(const j of[x?v-1:-1,x+1<W?v+1:-1,y?v-W:-1,y+1<H?v+W:-1])if(j>=0&&solid(g[j])&&!root[j]&&!visited[j]){visited[j]=1;queue.push(j);}}components.push(comp);maxSize=Math.max(maxSize,comp.length);}
 if(!components.length)return {components:0,links:0,maxSize:0,maxLink:0};
 // Exact shortest empty-cell connectors from existing rooted structure (unobstructed 4-neighbour construction).
 const dist=new Int32Array(N),parent=new Int32Array(N);dist.fill(-1);parent.fill(-1);const mq=new Int32Array(N);let h=0,t=0;
 for(let i=0;i<N;i++)if(root[i]){dist[i]=0;mq[t++]=i;}
 while(h<t){const i=mq[h++],x=i%W,y=(i/W)|0;for(const j of[x?i-1:-1,x+1<W?i+1:-1,y?i-W:-1,y+1<H?i+W:-1])if(j>=0&&g[j]===0&&dist[j]===-1){dist[j]=dist[i]+1;parent[j]=i;mq[t++]=j;}}
 let links=0,maxLink=0;
 for(const comp of components){let best=-1,bestDist=2147483647;for(const idx of comp){const x=idx%W,y=(idx/W)|0;for(const ni of[x?idx-1:-1,x+1<W?idx+1:-1,y?idx-W:-1,y+1<H?idx+W:-1])if(ni>=0&&g[ni]===0&&dist[ni]>=0&&dist[ni]<bestDist){best=ni;bestDist=dist[ni];}}
  if(best<0||bestDist>220)throw Error("Unsupported component needs long spanning false brace length "+bestDist+", size "+comp.length);
  maxLink=Math.max(maxLink,bestDist);let at=best;while(at>=0&&!root[at]){if(g[at]===0){g[at]=68;links++;}at=parent[at];}
 }
 return {components:components.length,links,maxSize,maxLink};
}

function encode(g,W,H){let rects=[],active=new Map();for(let y=0;y<H;y++){let now=new Map();for(let x=0;x<W;){let mat=g[y*W+x],left=x++;while(x<W&&g[y*W+x]===mat)x++;if(!mat)continue;const k=left+":"+ (x-left)+":"+mat;let r=active.get(k);if(r)r[3]++;else{r=[left,y,x-left,1,mat];rects.push(r);}now.set(k,r);}active=now;}return rects;}

function audit(w,rects){
 const {g,W,H,sites,spawn,M}=w,N=g.length,replay=new Uint8Array(N),used=new Uint8Array(N),hist={},legal=new Set(Object.keys(M).map(Number));let work=0,overlaps=0,bad=0;
 for(const [x,y,ww,hh,id]of rects){if(!legal.has(id)||x<0||y<0||ww<=0||hh<=0||x+ww>W||y+hh>H)throw Error("bad rectangle");work+=ww*hh;for(let yy=y;yy<y+hh;yy++)for(let xx=x;xx<x+ww;xx++){const k=yy*W+xx;if(used[k])overlaps++;used[k]=1;replay[k]=id;}}
 for(let i=0;i<N;i++){if(replay[i]!==g[i])bad++;hist[g[i]]=(hist[g[i]]||0)+1;}if(bad||overlaps)throw Error("rect parity "+bad+"/"+overlaps);
 const solid=id=>id!==0&&id!==3&&id!==8,seen=new Uint8Array(N),q=new Int32Array(N);let a=0,b=0;for(let x=0;x<W;x++){let i=(H-1)*W+x;if(solid(g[i])){seen[i]=1;q[b++]=i;}}while(a<b){let i=q[a++],x=i%W,y=(i/W)|0;for(const j of[x?i-1:-1,x<W-1?i+1:-1,y?i-W:-1,y+1<H?i+W:-1])if(j>=0&&!seen[j]&&solid(g[j])){seen[j]=1;q[b++]=j;}}
 let total=0,airfaces=0,direct=0;for(let i=0;i<N;i++){const id=g[i];if(solid(id))total++;if(id!==3&&id!==8)continue;const x=i%W,y=(i/W)|0;for(const j of[x?i-1:-1,x+1<W?i+1:-1,y?i-W:-1,y+1<H?i+W:-1])if(j>=0){if(g[j]===0)airfaces++;if(id+g[j]===11&&(g[j]===3||g[j]===8))direct++;}}
 function route(ww,hh,block){let grid=block?g.slice():g;if(block){const[x,y,w,h]=block;for(let yy=y;yy<y+h;yy++)grid.fill(58,yy*W+x,yy*W+x+w);}const s=W+1,sum=new Int32Array((W+1)*(H+1));for(let y=1;y<=H;y++){let r=0;for(let x=1;x<=W;x++){r+=grid[(y-1)*W+x-1]?1:0;sum[y*s+x]=sum[(y-1)*s+x]+r;}}
 const dx=ww>>1,dy=hh>>1,free=new Uint8Array(N);let all=0;for(let y=dy;y+hh-dy<=H;y++)for(let x=dx;x+ww-dx<=W;x++){const l=x-dx,t=y-dy,r=l+ww,b=t+hh;if(sum[b*s+r]-sum[t*s+r]-sum[b*s+l]+sum[t*s+l]===0){free[y*W+x]=1;all++;}}
 const reached=new Uint8Array(N),qq=new Int32Array(N),dist=new Int32Array(N);dist.fill(-1);let first=0,last=0,sp=spawn[1]*W+spawn[0];if(free[sp]){reached[sp]=1;dist[sp]=0;qq[last++]=sp;}while(first<last){let i=qq[first++],x=i%W;for(const j of[x?i-1:-1,x<W-1?i+1:-1,i-W,i+W])if(j>=0&&j<N&&free[j]&&!reached[j]){reached[j]=1;dist[j]=dist[i]+1;qq[last++]=j;}}
 const sr=sites.map(v=>({...v,clear:!!free[v.y*W+v.x],reached:!!reached[v.y*W+v.x],shortest_4_neighbour_steps:dist[v.y*W+v.x]}));return {hull:[ww,hh],valid_centres:all,connected_centres:last,passed:sr.filter(v=>v.reached).length,sites:sr};}
 const flight=[[19,15],[23,19],[31,27]].map(p=>route(...p,null)),obstruction=[908,790,48,37],blocked=route(31,27,obstruction);
 return {rectangles:rects.length,work,hist,rooted:b,total,detached:total-b,airfaces,direct,flight,obstruction,blocked};
}

function concat(arr){const n=arr.reduce((p,a)=>p+a.length,0),out=new Uint8Array(n);let j=0;for(const a of arr){out.set(a,j);j+=a.length;}return out;}

function b32(k){return Uint8Array.of((k>>>24)&255,(k>>>16)&255,(k>>>8)&255,k&255);}

function crc32(a){let c=-1;for(let i=0;i<a.length;i++){c^=a[i];for(let j=0;j<8;j++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^(-1))>>>0;}

function adler32(a){let u=1,v=0;for(let i=0;i<a.length;i++){u=(u+a[i])%65521;v=(v+u)%65521;}return ((v<<16)|u)>>>0;}

function chunk(tag,data){const body=concat([utf(tag),data]);return concat([b32(data.length),body,b32(crc32(body))]);}

function png(g,W,x,y,w,h){const raw=new Uint8Array((w+1)*h);for(let yy=0;yy<h;yy++)raw.set(g.subarray((y+yy)*W+x,(y+yy)*W+x+w),yy*(w+1)+1);const z=[Uint8Array.of(0x78,0x01)];for(let i=0;i<raw.length;){const n=Math.min(65535,raw.length-i),block=new Uint8Array(n+5);block[0]=i+n===raw.length?1:0;block[1]=n&255;block[2]=n>>>8;block[3]=(~n)&255;block[4]=((~n)>>>8)&255;block.set(raw.subarray(i,i+n),5);z.push(block);i+=n;}z.push(b32(adler32(raw)));
 const colors={0:[8,11,18],3:[47,127,210],8:[241,78,31],57:[116,63,54],58:[119,123,128],62:[126,141,153],65:[124,63,43],66:[74,85,93],68:[102,119,129],69:[165,92,54],72:[37,60,76],76:[227,182,47],77:[55,243,228],79:[255,181,46],100:[54,56,61],104:[200,152,98],117:[90,94,100],131:[26,26,29]},palette=new Uint8Array(132*3);for(const[k,v]of Object.entries(colors))palette.set(v,k*3);
 return concat([Uint8Array.of(137,80,78,71,13,10,26,10),chunk("IHDR",concat([b32(w),b32(h),Uint8Array.of(8,3,0,0,0)])),chunk("PLTE",palette),chunk("IDAT",concat(z)),chunk("IEND",new Uint8Array(0))]);
}

function verifyPNG(p,g,W,x,y,w,h){const v=new DataView(p.buffer,p.byteOffset,p.byteLength);let pos=8,z=null,sections=[];for(let i=0;i<8;i++)if(p[i]!==[137,80,78,71,13,10,26,10][i])throw Error("PNG signature");while(pos<p.length){let n=v.getUint32(pos,false),tag=String.fromCharCode(...p.subarray(pos+4,pos+8));if(crc32(p.subarray(pos+4,pos+8+n))!==v.getUint32(pos+8+n,false))throw Error("CRC");sections.push(tag);if(tag==="IHDR"&&(v.getUint32(pos+8,false)!==w||v.getUint32(pos+12,false)!==h))throw Error("PNG dimensions");if(tag==="IDAT")z=p.subarray(pos+8,pos+8+n);pos+=12+n;if(tag==="IEND")break;}if(pos!==p.length||sections.join()!=="IHDR,PLTE,IDAT,IEND")throw Error("PNG chunks");let raw=new Uint8Array((w+1)*h),j=2,k=0,done=0;while(!done){const header=z[j++];done=header&1;if(header&6)throw Error("DEFLATE mode");let len=z[j]|(z[j+1]<<8),inverse=z[j+2]|(z[j+3]<<8);j+=4;if(((len^inverse)&65535)!==65535)throw Error("DEFLATE stored length");raw.set(z.subarray(j,j+len),k);k+=len;j+=len;}if(k!==raw.length||adler32(raw)!==((z[j]*16777216+z[j+1]*65536+z[j+2]*256+z[j+3])>>>0))throw Error("zlib checksum");for(let yy=0;yy<h;yy++){if(raw[yy*(w+1)]!==0)throw Error("row filter");for(let xx=0;xx<w;xx++)if(raw[yy*(w+1)+xx+1]!==g[(y+yy)*W+x+xx])throw Error("pixel parity");}return w*h;}

function build(){
 const w=world(),support=bridgeSupport(w),rects=encode(w.g,w.W,w.H),a=audit(w,rects);
 const baseLeg=a.flight[2].sites.find(v=>v.name==='Outbound dispatch goal').shortest_4_neighbour_steps,blockedLeg=a.blocked.sites.find(v=>v.name==='Outbound dispatch goal').shortest_4_neighbour_steps;
 if(blockedLeg<=baseLeg)throw Error('test obstruction does not force a real shortest-path detour');
 if(a.detached||a.airfaces||a.direct||a.flight.some(v=>v.passed!==w.sites.length)||a.blocked.passed!==w.sites.length)throw Error("source-static qualification failed: "+JSON.stringify({support,a:{detached:a.detached,airfaces:a.airfaces,direct:a.direct,flight:a.flight.map(x=>x.passed),blocked:a.blocked.passed}}));
 const setup={version:2,extent:[2048,1024],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:w.spawn,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:2}}],next_id:2,selected:1,edits:rects,response:"LA-SELECTIVE",liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false},setupText=JSON.stringify(setup);
 const views=[["overview.png",0,0,2048,1024],["01-ore-dock.png",51,467,405,241],["02-dual-hearths.png",405,290,411,419],["03-gantry-ladle.png",808,180,401,528],["04-horizontal-drums.png",1212,470,401,239],["05-quench-export.png",1598,518,405,190],["06-underplant.png",55,784,1749,115]],imgs={},imeta={};let pixels=0;
 for(const[name,x,y,ww,hh]of views){let b=png(w.g,2048,x,y,ww,hh);pixels+=verifyPNG(b,w.g,2048,x,y,ww,hh);imgs[name]=b;imeta[name]={crop:[x,y,ww,hh],bytes:b.length,sha256:sha256(b)};}
 const receipt={schema:1,original_no_source:true,concept:"Anvilwake Twin-Dock Electrosmelter",seed:w.seed,engine_sha:"7b03aa437561ec63e31fd09531171360ab60eeb4",extent:[2048,1024],plane_sha256:sha256(w.g),setup_sha256:sha256(utf(setupText)),json_bytes:utf(setupText).length,rectangle_count:rects.length,source_rectangle_limit:32768,possible_installed_fallback_untested:4096,construction_work:a.work,material_histogram:a.hist,ground:{total:a.total,rooted:a.rooted,detached:a.detached,repair:support},fluid:{water:a.hist[3]||0,lava:a.hist[8]||0,initial_fluid_air_faces:a.airfaces,initial_water_lava_contacts:a.direct},flight:a.flight,obstruction:{box:a.obstruction,flight:a.blocked,measured_target:'Outbound dispatch goal',shortest_before:baseLeg,shortest_after:blockedLeg,positive_detour:blockedLeg-baseLeg},pngs:imeta,pixel_material_parity_count:pixels,native:"NATIVE-UNTESTED"};
 return {files:{"setup.json":utf(setupText),"receipt.json":utf(JSON.stringify(receipt,null,2)+"\n"),...imgs},receipt};
}
const fs=require("node:fs"),path=require("node:path");
const result=build().files,verify=process.argv.includes("--verify");
for(const[name,contents]of Object.entries(result)){const file=path.join(__dirname,name);if(verify){const v=fs.readFileSync(file);if(v.length!==contents.length||!v.every((x,i)=>x===contents[i]))throw Error("MISMATCH "+name);}else fs.writeFileSync(file,contents);}
console.log((verify?"VERIFIED ":"GENERATED ")+Object.keys(result).length+" authentic files");
