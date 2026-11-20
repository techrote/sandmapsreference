'use strict';
// OXBOW-6 CYCLONE TRANSFER LOCK — original orthographic 2-D industrial-process campus.
// All authored coordinates describe actual material cells; no source art or previous map geometry.
const W=2048,H=1024,SEED=202611206;
const SITES=[
 ['Freight airlock spawn',153,480],['Dockside gauge hall',284,698],
 ['West recovery track',332,878],['Cyclone upper approach',522,395],
 ['Cyclone assay station',713,758],['Cyclone bypass ridge',722,253],
 ['Kiln west control',850,569],['Breached kiln interior',1047,550],
 ['Thermal isolation office',1202,711],['Canyon upper survey',1403,395],
 ['Quench sampling berth',1495,638],['Deep coolant return',1350,858],
 ['Exhaust under-gallery',1805,628],['Chimney operator station',1894,723],
 ['Eastern evacuation hatch',1960,485],['Open-sky return',1152,145]
];
const CROPS=[
 ['01-freight-airlock',25,235,395,650],
 ['02-cyclone-separators',413,200,410,675],
 ['03-breached-annular-kiln',822,205,443,680],
 ['04-quenched-canyon',1263,224,418,660],
 ['05-triple-chimney',1662,105,380,800],
 ['06-deep-utility-return',734,775,630,230]
];
const COLORS={0:[7,13,24],3:[49,134,207],8:[248,83,34],58:[98,116,126],
 62:[125,152,168],68:[81,127,139],70:[225,222,197],76:[239,184,41],
 77:[20,214,213],79:[248,151,52],100:[51,58,74],101:[32,36,49],
 104:[186,103,77],117:[113,132,149],120:[142,205,218]};
function materialWorld(){
 const g=new Uint8Array(W*H);let state=SEED>>>0;
 const random=()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296};
 const rect=(x,y,w,h,m)=>{x=Math.floor(x);y=Math.floor(y);w=Math.ceil(w);h=Math.ceil(h);
   let xl=Math.max(0,x),xr=Math.min(W,x+w),yt=Math.max(0,y),yb=Math.min(H,y+h);
   if(xr<=xl||yb<=yt)return;for(let yy=yt;yy<yb;yy++)g.fill(m,yy*W+xl,yy*W+xr)};
 const line=(x,y,X,Y,t,m)=>{const n=Math.max(1,Math.ceil(Math.hypot(X-x,Y-y)/3));
  for(let i=0;i<=n;i++){const z=i/n;rect(Math.round(x+(X-x)*z-t/2),Math.round(y+(Y-y)*z-t/2),t,t,m)}};
 const frame=(x,y,w,h,t,m)=>{rect(x,y,w,t,m);rect(x,y+h-t,w,t,m);rect(x,y,t,h,m);rect(x+w-t,y,t,h,m)};
 const arc=(cx,cy,rx,ry,t,m,gap=false)=>{for(let yy=cy-ry;yy<=cy+ry;yy++){
  if(yy<0||yy>=H)continue;for(let xx=cx-rx;xx<=cx+rx;xx++){
   if(xx<0||xx>=W)continue;let r=((xx-cx)/rx)**2+((yy-cy)/ry)**2;
   if(r<=1&&r>=(1-t/rx)**2&&!(gap&&xx>cx+rx*.35&&yy<cy-ry*.2))g[yy*W+xx]=m;
  }}};
 const lamp=(x,y,c=77)=>{rect(x-5,y-7,10,10,58);rect(x-3,y-5,6,5,c)};
 const console=(x,y,w=42,c=77)=>{rect(x,y,w,8,70);rect(x+5,y-16,w-10,17,62);
  rect(x+10,y-13,Math.max(3,w-20),6,c);rect(x+5,y+8,8,15,58);rect(x+w-14,y+8,8,15,58)};
 const vessel=(x,y,w,h,mat)=>{rect(x+13,y+13,w-26,h-26,mat);frame(x,y,w,h,14,104)};
 // Continuous excavated foundation, not falling powder. Boundary-tied thermal plinth.
 for(let x=0;x<W;x+=8){const p=Math.round(926+6*Math.sin(x/71)+4*Math.sin(x/21));
   rect(x,p,8,H-p,100)}
 rect(0,982,W,42,101);rect(0,923,W,12,58);rect(32,934,W-64,7,62);
 // 1. Port-side Oxbow freight airlock: split roof, hanging cargo clamp, entered weighing hall.
 rect(81,435,19,491,58);rect(385,514,18,413,58);
 line(89,436,160,278,18,62);line(160,278,305,322,18,62);
 line(305,322,391,519,17,62);line(165,288,173,433,11,117);
 line(310,333,304,520,11,117);line(90,440,385,519,9,68);
 rect(116,582,252,13,62);rect(113,792,270,15,62);
 rect(125,804,15,124,58);rect(363,803,15,125,58);
 line(197,367,320,390,9,117);line(319,392,319,491,8,117);
 rect(280,494,77,12,104);rect(278,505,10,28,58);rect(348,505,10,28,58);
 line(221,403,222,487,8,68);rect(209,479,27,12,76);
 // A genuinely entered dry hall: eastern door between y=681 and 751; upper observation vent.
 rect(167,637,168,12,68);rect(167,637,12,147,58);
 rect(324,637,11,48,58);rect(324,755,11,35,58);
 rect(178,779,150,12,70);rect(185,715,92,12,117);
 console(225,756,52,77);rect(190,645,25,11,76);
 rect(172,689,28,5,120);rect(176,695,8,20,58);
 // The cut-through under-deck maintenance and fork balance.
 rect(132,851,215,10,62);rect(143,851,12,69,58);
 console(270,845,38,79);rect(318,824,10,30,117);
 // 2. Twin tapered cyclone separators suspended from rooted header with separate dry service floor.
 rect(435,477,16,449,58);rect(777,478,17,448,58);
 line(442,478,489,313,16,58);line(489,313,698,299,16,58);
 line(698,299,785,477,16,58);rect(486,324,12,156,117);
 rect(690,308,12,162,117);rect(456,501,321,12,62);
 rect(454,809,327,15,62);rect(459,824,13,104,58);
 rect(760,824,14,103,58);
 // Three intentionally unequal side-elevation cyclone hoppers, not cloned trays.
 const cyclones=[[510,500,90,168],[612,512,75,148],[696,529,57,123]];
 for(let [cx,top,rise,drop] of cyclones){line(cx-rise/2,top,cx-drop*.12,top+drop,12,68);
  line(cx+rise/2,top,cx+drop*.12,top+drop,12,68);
  line(cx-rise/2,top,cx+rise/2,top,12,62);
  line(cx-drop*.12,top+drop,cx+drop*.12,top+drop,11,104);
  rect(cx-7,top+drop,14,82,58);line(cx-7,top+drop+81,cx-14,803,9,58);
  rect(cx-10,top+29,20,7,76)}
 rect(477,735,85,12,70);console(489,712,49,77);rect(548,736,10,70,58);
 rect(664,731,89,11,70);console(679,708,52,79);rect(737,740,11,68,58);
 // Distinct lower-contained water cylinder integrated with exterior support and service head.
 vessel(567,713,83,69,3);rect(573,785,13,23,58);rect(629,785,12,24,58);
 console(562,674,43,77);rect(581,700,8,17,58);
 // 3. Breached double-skin thermal annulus, one opened accessible east-side gap.
 rect(844,453,17,474,58);rect(1222,487,17,441,58);
 line(848,454,897,323,16,62);line(897,323,1048,277,16,62);
 line(1048,277,1214,405,16,62);line(1214,405,1230,492,16,62);
 arc(1036,552,156,181,16,104,true);
 arc(1036,552,120,142,9,68,true);
 line(881,565,854,749,17,58);line(884,714,906,827,13,117);
 line(1153,714,1231,793,17,58);
 rect(851,839,378,15,62);rect(853,855,14,73,58);rect(1211,855,15,73,58);
 // Left service mezzanine and internal diagnostic tongue; leave open centre and source-real entry.
 rect(864,639,110,11,62);rect(877,650,12,40,58);
 console(889,615,45,79);rect(920,651,10,40,58);
 rect(995,677,92,12,70);rect(1036,689,12,72,58);
 console(1035,650,44,77);
 // Independent sealed hot cartridge and cold jacket below the broken ring.
 vessel(1094,754,85,66,8);rect(1102,822,13,17,58);rect(1156,823,12,17,58);
 console(1122,727,45,79);rect(1147,747,10,9,58);
 vessel(918,754,81,65,3);rect(924,820,13,20,58);rect(975,820,13,20,58);
 console(907,724,42,77);rect(927,747,8,9,58);
 // Internal navigable redoubt; deliberately open above and between inner arcs.
 line(1013,406,1084,407,7,117);rect(1015,407,10,28,58);lamp(1081,406,79);
 // 4. Vacuum-quench canyon: raked structural diaphragms, dry public maintenance gallery.
 rect(1281,513,17,413,58);rect(1638,513,18,415,58);
 line(1289,514,1354,316,18,62);line(1354,316,1472,273,18,62);
 line(1472,273,1645,515,18,62);line(1472,273,1472,422,12,117);
 rect(1315,524,304,11,62);rect(1310,814,328,15,62);
 rect(1316,829,14,99,58);rect(1620,830,13,99,58);
 // Two opposing stepped baffles with distinct fins; accessible 50+ cell gaps.
 for(let i=0;i<5;i++){const x=1334+i*19,y=554+i*29;rect(x,y,10,83,68);rect(x,y,50,9,117)}
 for(let i=0;i<4;i++){const x=1551-i*18,y=566+i*43;rect(x,y,10,73,58);rect(x-40,y,49,10,70)}
 rect(1360,751,92,11,70);console(1372,729,53,77);
 rect(1495,763,105,10,62);console(1519,739,45,79);
 // Structural cold-storage tank, sealed water at all four boundaries.
 vessel(1455,654,98,77,3);rect(1467,732,13,30,58);rect(1529,732,12,31,58);
 line(1454,655,1435,629,10,58);line(1553,655,1590,628,10,58);
 // Lower return: dry entered station east and barge pump assay, never treated as working pump.
 rect(1339,878,250,12,62);rect(1352,889,12,36,58);rect(1571,889,12,37,58);
 console(1471,863,52,77);rect(1527,862,42,9,76);rect(1561,871,8,11,58);
 // 5. Asymmetrically stacked extraction chimneys, different elevations and ducts.
 rect(1699,560,16,368,58);rect(2018,556,16,370,58);
 rect(1728,746,270,15,62);rect(1726,878,278,12,62);
 rect(1735,762,13,166,58);rect(1984,762,13,166,58);
 const stacks=[[1745,358,56,120],[1851,214,66,150],[1959,416,46,96]];
 for(let [cx,top,wide,stem] of stacks){
  rect(cx-wide/2,top+stem,wide,12,68);
  line(cx-wide/2,top+stem,cx-wide*.75,top+12,14,62);
  line(cx+wide/2,top+stem,cx+wide*.75,top+12,14,62);
  rect(cx-wide*.75,top,wide*1.5,12,104);
  rect(cx-7,top+stem,14,764-(top+stem),58);
  rect(cx-18,764,36,14,117);
 }
 // Shared duct network is visibly routed to the ground-rooted exhaust platform.
 line(1745,628,1846,688,12,68);line(1850,690,1959,637,12,68);
 rect(1733,685,264,12,117);rect(1733,698,12,46,58);rect(1982,698,12,47,58);
 console(1798,722,47,77);console(1910,722,49,79);
 // Entered outboard safety chamber, open on its east face above the door lintel.
 rect(1884,796,114,10,70);rect(1884,807,10,65,58);
 rect(1987,806,10,22,58);rect(1987,856,10,25,58);
 rect(1884,875,112,12,62);console(1912,851,49,77);
 // Real process tie-ups and instrument markings are attached to anchored frames.
 for(let i=0;i<9;i++){let x=116+i*27;rect(x,581,9,5,i%2?76:77)}
 for(let i=0;i<10;i++){let x=465+i*28;rect(x,503,10,6,i%2?76:79)}
 for(let i=0;i<11;i++){let x=1318+i*27;rect(x,525,9,5,i%2?77:76)}
 for(let i=0;i<8;i++){let x=1743+i*31;rect(x,746,12,5,i%2?77:79)}

 // Load-path repairs: connect every free-standing fixture to the structural frame.
 line(1593,765,1643,765,10,58);
 rect(681,804,10,13,58);rect(175,787,12,13,58);rect(923,815,13,12,58);
 line(99,584,119,584,13,58);line(1296,527,1318,527,12,58);
 rect(895,830,11,14,58);rect(1914,870,12,10,58);
 rect(1335,529,12,30,58);rect(1354,530,12,58,58);
 rect(1374,530,12,87,58);rect(1555,529,12,42,58);
 rect(1037,668,12,15,58);rect(189,722,12,77,58);
 rect(936,693,13,23,58);rect(1882,800,13,13,58);
 rect(1979,692,16,13,58);rect(1465,759,15,59,58);
 rect(571,802,15,14,58);
 rect(497,506,12,28,58);line(584,544,608,544,10,58);
 line(648,558,693,558,10,58);

 // Midge-scale dry process portals; connected overhead transfer spine maintains support.
 line(387,514,441,477,14,68);line(782,480,850,453,14,68);
 line(1227,490,1290,515,14,68);line(1643,517,1705,563,14,68);
 rect(383,543,22,111,0);rect(434,548,20,128,0);
 rect(776,548,21,129,0);rect(842,546,23,135,0);
 rect(1220,550,23,139,0);rect(1279,553,23,138,0);
 rect(1636,562,24,150,0);rect(1697,565,22,152,0);
 rect(382,826,25,80,0);
 rect(380,786,11,15,58); // grounded jamb beneath the west maintenance portal
 // An open 67-cell emergency sky hatch, plus an unblocked under-deck escape lintel.
 rect(120,263,67,221,0);rect(358,824,27,85,0);

 // Separated maintenance sky chimneys; real air corridors to fully authored internal sites.
 rect(500,165,60,299,0);rect(688,165,65,627,0);
 rect(816,168,65,426,0);rect(1014,166,68,419,0);
 rect(1172,166,65,575,0);rect(1370,165,64,258,0);
 rect(1463,165,66,484,0);rect(1321,165,63,708,0);
 rect(1774,165,65,485,0);rect(1866,165,65,592,0);
 rect(1932,165,70,355,0);

 // Re-anchor interrupted load paths on the flanks of public air shafts, not across their mouths.
 rect(496,804,11,13,58);rect(283,529,12,59,58);
 line(1710,558,1740,558,11,58);rect(1305,535,12,287,58);
 rect(755,540,12,270,58);rect(999,298,12,86,58);
 rect(1154,375,13,360,58);rect(1555,635,13,15,58);
 rect(669,304,13,204,58);line(1419,620,1435,626,11,58);
 rect(1445,287,12,246,58);rect(1846,220,12,158,58);
 line(1086,385,1162,385,10,58);rect(733,803,13,13,58);
 line(1930,514,1941,524,9,58);rect(1008,405,12,16,58);
 rect(751,488,31,63,58); // cyclone high-bulkhead to recovered load column

 // Dry controlled inspection hatch and accessible subgrade recovery drop.
 rect(256,294,64,414,0);rect(311,738,55,105,0);
 rect(345,419,12,170,58); // rear gantry buttress rooted into assay deck, outside access hatch

 // New standalone buttresses replace the shed/airlock pieces separated by access apertures.
 rect(410,539,13,387,58);line(389,522,416,549,12,58);
 rect(398,818,12,110,58);rect(211,309,13,274,58);
 line(328,644,353,579,10,58);

 // R2: source Art-P1 handoffs. Actual grounded inert material, not simulated machinery.
 // Separate cyclone pickup/cradle/rollers joined to the kiln feed under maintained flight clearance.
 rect(771,818,132,11,62);
 line(783,816,832,799,10,117);line(832,799,874,817,10,117);
 rect(801,786,78,12,70);rect(810,776,15,10,104);rect(856,775,13,11,104);
 for(let i=0;i<5;i++)rect(803+i*15,795,7,7,76);
 rect(797,810,12,15,58);rect(881,807,12,20,58);
 // Differentiated kiln hot-feed/discharge liner to quench staging.
 rect(1210,821,113,11,62);line(1234,819,1295,804,10,117);
 rect(1251,791,57,11,104);rect(1260,783,10,8,79);rect(1293,783,10,8,79);
 rect(1309,803,11,21,58);rect(1320,824,12,16,58);
 // Entered named deep-return coolant pump/filter and a sealed static return-loop housing.
 rect(1228,906,144,13,62);rect(1240,914,12,12,58);rect(1356,914,12,12,58);
 frame(1247,862,71,42,9,68);rect(1262,876,39,8,117);
 rect(1260,904,11,5,58);rect(1297,904,11,5,58);
 arc(1274,882,21,18,7,117);rect(1268,875,12,11,77);
 rect(1302,893,15,10,70);rect(1305,882,8,10,79);
 line(1314,889,1438,889,9,68);rect(1381,889,12,33,58);
 line(1438,889,1441,740,9,68);line(1441,741,1456,735,9,68);
 rect(1242,872,9,6,76);rect(1301,873,9,6,77);
 return g;
}
module.exports={W,H,SEED,SITES,CROPS,COLORS,materialWorld};