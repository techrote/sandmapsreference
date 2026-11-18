// Pure deterministic original material-cell builder. No images or reference assets are inputs.
// Node 22+; no third-party packages. Usage: node build.cjs [--verify]
"use strict";
const fs=require("fs");
function buildMegaCanvas() {
  "use strict";
  const W=2048,H=2048,seed=0x26111851;
  const mat={E:0,SLATE:49,BASALT:100,OBSIDIAN:101,CONCRETE:58,STEEL:62,IRON:117,ZINC:113,BLUE:128,GLASS:35,GLASSBLOCK:120,QUARTZ:122,SIGNAL:123,MARBLE:98,LIME:38};
  const indexToMaterial=[0,49,100,101,58,62,117,113,128,35,120,122,123,98,38];
  const rgb=[[8,11,18],[70,83,99],[54,56,61],[24,19,32],[119,123,128],[126,141,153],[90,94,100],[152,162,168],[62,122,180],[128,205,220],[156,210,220],[226,236,244],[152,232,94],[226,223,216],[197,191,175]];
  const g=new Uint8Array(W*H);
  let rnd=seed>>>0;
  function random(){ rnd^=rnd<<13;rnd^=rnd>>>17;rnd^=rnd<<5; return ((rnd>>>0)/4294967296); }
  function R(x,y,w,h,m){
    const xa=Math.max(0,Math.round(x)), xb=Math.min(W,Math.round(x+w)), ya=Math.max(0,Math.round(y)),yb=Math.min(H,Math.round(y+h));
    if(xb<=xa||yb<=ya)return;
    for(let yy=ya;yy<yb;yy++)g.fill(m,yy*W+xa,yy*W+xb);
  }
  function P(points,m){
    const lo=Math.max(0,Math.ceil(Math.min(...points.map(a=>a[1])))), hi=Math.min(H-1,Math.floor(Math.max(...points.map(a=>a[1]))));
    for(let y=lo;y<=hi;y++){
      const cuts=[];for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))cuts.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
      cuts.sort((a,b)=>a-b);for(let j=0;j+1<cuts.length;j+=2) R(Math.ceil(cuts[j]),y,Math.max(0,Math.floor(cuts[j+1])-Math.ceil(cuts[j])+1),1,m);
    }
  }
  function L(x0,y0,x1,y1,th,m){
    const rad=th*0.5,r2=rad*rad,dx=x1-x0,dy=y1-y0,len2=dx*dx+dy*dy;
    const xa=Math.max(0,Math.floor(Math.min(x0,x1)-rad)),xb=Math.min(W-1,Math.ceil(Math.max(x0,x1)+rad));
    const ya=Math.max(0,Math.floor(Math.min(y0,y1)-rad)),yb=Math.min(H-1,Math.ceil(Math.max(y0,y1)+rad));
    for(let y=ya;y<=yb;y++)for(let x=xa;x<=xb;x++){const t=Math.max(0,Math.min(1,((x-x0)*dx+(y-y0)*dy)/(len2||1))),xx=x0+t*dx, yy=y0+t*dy;if((x-xx)**2+(y-yy)**2<=r2)g[y*W+x]=m;}
  }
  function ring(cx,cy,rx,ry,t,m,gate){
    const xa=Math.max(0,Math.floor(cx-rx)),xb=Math.min(W-1,Math.ceil(cx+rx));
    for(let y=Math.max(0,Math.floor(cy-ry));y<=Math.min(H-1,Math.ceil(cy+ry));y++)for(let x=xa;x<=xb;x++){
      const dx=x-cx,dy=y-cy,d=Math.sqrt((dx/rx)**2+(dy/ry)**2);
      if(d>1-t/Math.min(rx,ry)&&d<=1&&(!gate||gate(dx,dy,x,y)))g[y*W+x]=m;
    }
  }
  function markAgainstSolid(x0,y0,x1,y1,from,to){for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const i=y*W+x;if(g[i]===from)g[i]=to;}}

  // ORIGINAL DESIGN: THE HOLLOW SOVEREIGN. No reference source or prior scene geometry.
  // Thesis: two different inhabited hulls frame the absence of a gravity spindle.
  // Three traversable horizontal levels at y490,980,1485 plus a full lower drydock.
  // Distinct districts: Nacre Freight Cliff, Mirror Meridian, Broken Gravity Loom,
  // Sky Sacristy, Abyssal Shipyard, Waste-Heat Crypt. Side elevation only.
  // Material keys: E air; BASALT/SLATE/OBSIDIAN inert rock; CONCRETE/STEEL/IRON
  // stable hull; ZINC trim, BLUE polymer, GLASSBLOCK, QUARTZ, SIGNAL inert glazing.
  R(0,0,20,H,mat.OBSIDIAN);R(2028,0,20,H,mat.OBSIDIAN);
  R(0,1981,W,67,mat.BASALT);
  P([[0,1760],[114,1765],[206,1794],[300,1887],[280,2048],[0,2048]],mat.BASALT);
  P([[1815,1860],[1910,1753],[2048,1730],[2048,2048],[1770,2048]],mat.BASALT);
  for(let x=20;x<2028;x++){
    const y=Math.round(1943+22*Math.sin(x*.0081)+10*Math.sin(x*.035)+14*Math.sin(x*.0017));
    R(x,y,1,2048-y,mat.BASALT);
  }
  for(let y=1900;y<2048;y++)for(let x=20;x<2028;x++){
    const i=y*W+x;if(g[i]!==mat.BASALT)continue;
    const p=((y-.11*x+16*Math.sin(x*.011))%114+114)%114;
    if(p<19)g[i]=mat.SLATE;else if(p>102)g[i]=mat.OBSIDIAN;
  }
  // Swept broken roof mass (central sky remains deliberately void).
  P([[0,0],[584,0],[584,105],[519,105],[507,169],[447,187],[439,228],
    [370,213],[331,270],[242,242],[201,326],[120,326],[71,360],[20,326],[0,326]],mat.BASALT);
  P([[1408,0],[2048,0],[2048,360],[1988,358],[1924,330],[1895,277],
    [1837,289],[1772,225],[1712,222],[1684,160],[1603,174],[1551,105],
    [1480,130],[1408,95]],mat.BASALT);
  P([[0,0],[193,0],[126,220],[87,366],[0,430]],mat.OBSIDIAN);
  P([[1800,0],[2048,0],[2048,494],[1964,372],[1927,230]],mat.OBSIDIAN);
  // NACRE FREIGHT CLIFF — asymmetrical civic hull, three differently shaped atria.
  P([[63,402],[148,347],[225,370],[288,331],[388,361],[497,308],[635,359],
    [702,413],[710,1408],[620,1481],[516,1450],[458,1530],[272,1471],
    [185,1540],[88,1429],[63,1137]],mat.CONCRETE);
  P([[124,398],[206,389],[285,405],[375,380],[486,402],[603,390],[659,444],
    [663,1314],[612,1385],[515,1373],[453,1441],[271,1400],[160,1431],[123,1335]],mat.SLATE);
  P([[160,444],[265,424],[384,442],[449,418],[594,462],[616,575],
    [559,627],[453,613],[379,658],[259,619],[172,583]],mat.E);
  P([[169,679],[242,650],[413,665],[476,645],[608,692],[632,878],
    [561,916],[467,882],[385,925],[228,911],[163,848]],mat.E);
  P([[172,1060],[293,1049],[344,1075],[456,1043],[606,1072],[627,1201],
    [571,1306],[451,1287],[389,1334],[218,1289],[169,1216]],mat.E);
  R(160,917,596,120,mat.E);R(278,563,153,590,mat.E);
  R(484,564,137,607,mat.E);R(182,1284,464,110,mat.E);
  R(365,1340,162,345,mat.E);
  // West skyline anchored to the actual roof / heavy braces.
  for(const a of [[93,384,167,355,16],[167,355,257,380,13],[286,357,356,314,14],
     [356,314,457,339,13],[460,344,541,284,16],[541,284,649,345,14]])L(...a,mat.STEEL);
  for(const a of [[137,670,285,657,10],[431,660,628,675,11],[180,891,291,887,9],
    [447,893,625,909,10],[160,1228,284,1228,12],[503,1253,637,1253,10]])L(...a,mat.IRON);
  // Distinct crucible, one enormous angular viewing prism and a control desk.
  P([[535,760],[571,731],[606,760],[597,815],[553,824]],mat.STEEL);
  P([[555,761],[573,744],[585,761],[579,790],[555,790]],mat.SIGNAL);
  L(574,814,574,875,9,mat.IRON);
  R(216,748,43,52,mat.GLASSBLOCK);R(221,757,33,12,mat.BLUE);
  R(189,1125,73,55,mat.STEEL);R(199,1138,53,33,mat.GLASSBLOCK);
  R(219,1146,18,15,mat.SIGNAL);
  for(const [x,y,w,h] of [[107,488,13,121],[110,795,17,103],[657,694,18,100],
       [638,1152,18,113],[99,1176,15,100],[207,1422,84,13]]){
    R(x,y,w,h,mat.STEEL);R(x+3,y+3,Math.max(4,w-6),Math.max(4,h-6),mat.IRON);
  }
  // MIRROR MERIDIAN BASTION — eastern arcology has bifurcated antenna and an
  // unevenly shouldered shelter, deliberately not a mirror copy of the west.
  P([[1312,383],[1428,339],[1528,364],[1588,278],[1704,325],[1797,295],
    [1893,373],[1975,418],[1981,1378],[1886,1503],[1751,1457],
    [1615,1531],[1501,1459],[1386,1514],[1306,1402]],mat.CONCRETE);
  P([[1374,420],[1499,396],[1563,366],[1684,371],[1792,347],[1894,419],
    [1903,1333],[1854,1431],[1745,1390],[1614,1453],[1490,1378],[1363,1429]],mat.SLATE);
  P([[1411,455],[1522,412],[1639,440],[1717,411],[1860,454],[1872,585],
    [1773,619],[1664,589],[1531,638],[1415,595]],mat.E);
  P([[1385,680],[1500,654],[1582,686],[1713,643],[1865,695],[1876,891],
    [1826,923],[1661,902],[1528,921],[1398,884]],mat.E);
  P([[1382,1095],[1507,1053],[1611,1084],[1709,1067],[1862,1096],
    [1871,1266],[1799,1337],[1669,1300],[1563,1378],[1401,1329]],mat.E);
  R(1272,913,692,130,mat.E);
  R(1510,573,144,601,mat.E);R(1712,587,140,624,mat.E);
  R(1450,1260,408,170,mat.E);R(1573,1380,158,304,mat.E);
  L(1514,363,1481,193,17,mat.STEEL);L(1481,193,1525,152,14,mat.ZINC);
  L(1692,355,1707,131,18,mat.STEEL);L(1707,131,1661,112,13,mat.ZINC);
  L(1808,337,1876,197,15,mat.STEEL);L(1876,197,1925,202,11,mat.STEEL);
  L(1281,387,1455,327,17,mat.STEEL);L(1397,368,1464,280,9,mat.IRON);
  L(1826,332,1971,420,18,mat.STEEL);
  P([[1400,768],[1445,735],[1487,767],[1492,834],[1430,844]],mat.STEEL);
  R(1418,778,50,41,mat.GLASSBLOCK);R(1437,789,17,13,mat.SIGNAL);
  P([[1798,741],[1846,709],[1877,755],[1860,819],[1814,828]],mat.STEEL);
  R(1813,750,47,34,mat.BLUE);R(1821,759,29,12,mat.QUARTZ);
  L(1354,870,1490,870,12,mat.STEEL);L(1760,883,1893,883,10,mat.STEEL);
  for(const [x,y] of [[1339,532],[1893,618],[1340,1181],[1878,1256]]){
    R(x,y,17,54,mat.STEEL);R(x+5,y+8,7,19,mat.SIGNAL);
  }
  // BROKEN GRAVITY LOOM: 1200-cell-high vertical negative space, sheared diagonal
  // thrust arms and a hollow tapering instrument, not repetitive chambers.
  for(const a of [[726,293,875,394,22],[875,394,935,596,17],
    [1325,352,1197,416,23],[1197,416,1138,603,17],
    [859,556,778,747,19],[1190,590,1278,766,19],
    [768,1130,884,1250,22],[884,1250,920,1381,15],
    [1289,1122,1180,1258,23],[1180,1258,1140,1390,15]])L(...a,mat.STEEL);
  P([[981,224],[1067,224],[1101,261],[1108,372],[1143,425],[1115,477],
    [1120,590],[1083,649],[1053,644],[1028,625],[1005,643],[956,626],
    [931,581],[953,475],[914,429],[945,371],[944,266]],mat.STEEL);
  P([[997,264],[1059,263],[1077,289],[1079,377],[1089,411],[1064,435],
    [1075,528],[1052,582],[1002,574],[984,526],[994,434],[962,408],
    [985,375],[985,288]],mat.E);
  L(963,279,1093,279,9,mat.ZINC);L(968,368,1088,368,8,mat.ZINC);
  P([[806,260],[899,214],[950,221],[952,277],[886,318],[808,307]],mat.IRON);
  P([[1155,214],[1230,197],[1320,266],[1301,320],[1202,302],[1160,265]],mat.IRON);
  P([[871,224],[899,243],[884,289],[859,276]],mat.QUARTZ);
  P([[1219,237],[1249,212],[1270,263],[1242,283]],mat.SIGNAL);
  L(668,784,858,784,13,mat.STEEL);L(1203,783,1382,783,13,mat.STEEL);
  L(800,1290,929,1290,11,mat.IRON);L(1134,1288,1267,1288,12,mat.IRON);
  L(789,1255,825,1538,14,mat.STEEL);L(1243,1248,1204,1555,15,mat.STEEL);
  // SKY SACRISTY crest, flying ribs attached to the vast opened magnetic loom.
  P([[722,176],[801,126],[892,119],[923,149],[951,112],[1087,113],
    [1124,153],[1211,125],[1343,171],[1283,203],[1199,191],[1132,210],
    [910,203],[842,213]],mat.IRON);
  P([[850,154],[936,138],[1073,138],[1161,169],[1137,186],[935,176]],mat.E);
  L(917,190,958,255,8,mat.ZINC);L(1121,190,1090,254,8,mat.ZINC);
  L(1017,122,1017,55,14,mat.STEEL);
  P([[1006,42],[1021,12],[1036,43],[1021,69]],mat.SIGNAL);
  for(const [x,y] of [[941,163],[982,156],[1064,154],[1110,169]])R(x,y,13,5,mat.GLASSBLOCK);
  L(878,394,843,665,9,mat.IRON);L(1186,415,1215,657,10,mat.IRON);
  P([[815,663],[871,651],[887,685],[855,721],[825,704]],mat.OBSIDIAN);
  P([[1185,651],[1238,648],[1251,689],[1214,715],[1183,683]],mat.OBSIDIAN);
  R(840,677,26,11,mat.SIGNAL);R(1207,680,26,10,mat.QUARTZ);
  // ABYSSAL DRYDOCK — two anchored lifting gantries around a single asymmetric
  // keel-size ship. Hull intentionally non-operating static material, no AI art.
  P([[305,1590],[548,1570],[677,1604],[839,1583],[1061,1605],
    [1201,1573],[1377,1624],[1577,1597],[1715,1636],[1753,1890],
    [1666,1984],[393,1984],[299,1903]],mat.CONCRETE);
  P([[345,1631],[542,1617],[700,1643],[851,1621],[1053,1643],
    [1196,1610],[1365,1658],[1569,1639],[1692,1664],
    [1708,1866],[1643,1909],[410,1911],[342,1864]],mat.E);
  R(388,1675,1286,177,mat.E);
  P([[499,1858],[628,1803],[795,1787],[961,1803],[1123,1786],
    [1325,1810],[1451,1863],[1394,1883],[569,1882]],mat.STEEL);
  P([[594,1848],[669,1816],[769,1808],[874,1823],[1042,1810],
    [1190,1829],[1296,1846],[1267,1856],[633,1856]],mat.BLUE);
  P([[785,1858],[814,1842],[854,1856],[844,1873],[802,1874]],mat.QUARTZ);
  P([[1202,1858],[1230,1842],[1274,1855],[1260,1872],[1216,1875]],mat.SIGNAL);
  L(462,1634,520,1735,16,mat.STEEL);L(1573,1645,1516,1744,15,mat.STEEL);
  L(432,1640,432,1710,14,mat.STEEL);L(430,1660,637,1660,13,mat.STEEL);
  L(598,1660,598,1732,8,mat.IRON);
  P([[582,1724],[612,1724],[619,1740],[602,1757],[583,1743]],mat.IRON);
  L(1515,1648,1515,1721,10,mat.IRON);
  P([[1492,1714],[1532,1714],[1544,1734],[1518,1755],[1497,1739]],mat.STEEL);
  R(1499,1726,29,8,mat.SIGNAL);
  // WASTE-HEAT CRYPT is connected to the dock, with stable lit compartments.
  R(702,1890,244,76,mat.E);R(1070,1889,295,75,mat.E);
  R(802,1868,76,55,mat.E);R(1197,1867,81,58,mat.E);
  L(703,1948,944,1948,11,mat.IRON);L(1078,1951,1357,1951,10,mat.IRON);
  for(const [x,y] of [[726,1926],[784,1926],[1114,1929],[1290,1929]]){
    R(x,y,27,12,mat.GLASSBLOCK);R(x+8,y+3,8,6,mat.SIGNAL);
  }

  // HAND-REVIEW REWORK PASS: first material overview was too diagrammatic.
  // Add purposeful inhabitation at three cell scales without sealing any portals.
  // West freighthouse: a ribbed transverse bay, offset gantries and a HUGE
  // instrument window, all tied to the existing masonry rather than floating.
  L(145,640,276,645,14,mat.STEEL);
  L(149,640,199,694,12,mat.IRON);
  L(258,645,291,685,10,mat.IRON);
  P([[170,691],[253,680],[276,708],[249,744],[174,735]],mat.STEEL);
  P([[180,698],[245,694],[260,710],[243,727],[181,723]],mat.GLASSBLOCK);
  for(const [x,y] of [[193,709],[211,707],[228,706]])R(x,y,9,11,mat.BLUE);
  L(266,746,311,794,11,mat.STEEL);L(318,790,353,824,9,mat.ZINC);
  R(254,818,106,10,mat.IRON);
  // Tilted glass crucible cradle, anchored into southwest slab.
  P([[134,1085],[189,1063],[268,1082],[279,1141],[196,1155],[149,1138]],mat.STEEL);
  P([[158,1095],[193,1079],[251,1096],[255,1130],[197,1139],[165,1127]],mat.BLUE);
  L(155,1132,155,1201,12,mat.IRON);L(260,1140,260,1200,11,mat.IRON);
  // Distinct unequal framed ventilation stacks permanently in wall margins.
  for(const [x,y,w,h] of [[76,476,31,131],[95,756,28,105],[647,812,26,91],
                          [78,1130,32,151],[601,1110,32,153],[193,1348,64,35]]) {
    R(x,y,w,h,mat.STEEL);R(x+6,y+8,w-12,h-18,mat.BLUE);
    R(x+10,y+13,Math.max(4,w-20),Math.min(h-23,12),mat.GLASSBLOCK);
  }
  // Alternating diagonal roof/load struts; irregular silhouette not a pod stack.
  for(const [x,y,dx,dy] of [[207,414,46,-29],[312,407,55,-36],[466,405,45,-44],
                            [570,416,44,-37],[234,1264,43,52],[543,1300,55,73]]) {
    L(x,y,x+dx,y+dy,8,mat.ZINC);
  }
  // Underside civic tram soffits remain CLEAR of main 19x15 centre.
  L(141,1057,291,1057,13,mat.IRON);
  L(455,1059,629,1059,12,mat.STEEL);
  L(171,1402,296,1402,10,mat.ZINC);L(503,1410,647,1410,11,mat.STEEL);
  // The entire WEST gate has different size/window groups than EAST.
  for(const [x,y,w,h] of [[145,845,35,16],[199,864,59,14],[542,839,46,17],
                          [496,1146,65,16],[186,1250,43,13],[548,1331,64,13]]) {
    R(x,y,w,h,mat.IRON);R(x+5,y+4,w-10,h-8,mat.GLASSBLOCK);
  }
  // East night-market: long upside-down cantilever arcade to mark destination.
  P([[1375,690],[1486,663],[1541,708],[1570,771],[1528,820],
    [1470,807],[1436,830],[1381,783]],mat.STEEL);
  P([[1401,710],[1484,682],[1526,721],[1538,769],[1507,792],
    [1462,783],[1428,795],[1406,766]],mat.BLUE);
  L(1414,790,1390,877,11,mat.IRON);L(1520,799,1517,887,11,mat.IRON);
  P([[1763,718],[1815,684],[1889,728],[1904,797],[1844,835],[1791,810]],mat.STEEL);
  P([[1781,734],[1818,709],[1867,739],[1884,784],[1845,807],[1806,790]],mat.GLASSBLOCK);
  R(1827,741,27,18,mat.SIGNAL);
  // Bastion city hull: high-contrast architectural panel language.
  for(const [x,y,w,h] of [[1895,464,33,122],[1940,580,27,137],[1916,785,32,94],
                          [1324,817,27,103],[1309,1098,31,151],[1875,1155,49,118],
                          [1341,1255,28,125]]) {
    R(x,y,w,h,mat.STEEL);R(x+6,y+8,w-12,h-18,mat.BLUE);
    R(x+7,y+18,w-14,9,mat.GLASSBLOCK);
  }
  // Deflector comb roots from main east buttress (mechanically supported).
  for(const [x,y,dx,dy] of [[1386,616,-67,-34],[1804,632,88,-38],
                            [1394,1294,-84,49],[1839,1360,73,-62]]) {
    L(x,y,x+dx,y+dy,10,mat.STEEL);
    L(x+dx*.5,y+dy*.5,x+dx*.6,y+dy*.6,4,mat.SIGNAL);
  }
  // Meridian sawtooth museum exhibits and silhouette of two different pipes.
  P([[1450,1109],[1527,1077],[1558,1091],[1548,1136],[1484,1158]],mat.STEEL);
  P([[1469,1111],[1529,1096],[1545,1110],[1526,1134],[1488,1140]],mat.GLASSBLOCK);
  L(1484,1158,1473,1191,9,mat.IRON);
  P([[1747,1268],[1773,1239],[1816,1265],[1808,1303],[1767,1314]],mat.IRON);
  R(1772,1274,30,14,mat.SIGNAL);
  L(1824,1129,1898,1063,13,mat.STEEL);L(1912,1048,1963,1123,11,mat.IRON);
  // Gravity Loom gets civic scale: large segmented signal vanes, bridge stops,
  // two oblique escalator-like struts, a thronelike lower transfer ring.
  L(777,833,895,815,13,mat.STEEL);L(1171,818,1293,835,13,mat.STEEL);
  L(793,838,847,889,9,mat.IRON);L(1250,842,1201,888,9,mat.IRON);
  P([[833,811],[871,786],[912,813],[895,848],[851,848]],mat.STEEL);
  P([[1181,815],[1221,789],[1260,821],[1240,850],[1200,846]],mat.STEEL);
  P([[852,810],[874,799],[897,815],[882,829],[860,829]],mat.SIGNAL);
  P([[1199,814],[1219,800],[1245,824],[1227,836],[1209,832]],mat.QUARTZ);
  L(855,1120,943,1171,11,mat.STEEL);L(1127,1176,1215,1121,12,mat.STEEL);
  L(848,1224,916,1243,9,mat.ZINC);L(1152,1243,1216,1224,9,mat.ZINC);
  // Large L/R asymmetrical civic escutcheons physically supported on those arms.
  P([[880,1241],[923,1214],[953,1244],[935,1282],[889,1276]],mat.IRON);
  P([[1129,1236],[1167,1201],[1201,1248],[1174,1283],[1141,1274]],mat.IRON);
  R(905,1248,21,12,mat.GLASSBLOCK);R(1154,1243,18,15,mat.SIGNAL);
  // Whole skyline: buttress ribs and tilted translucent advertising plates
  // on sacristy, situated above all flight corridors.
  L(842,212,833,306,8,mat.ZINC);L(1209,211,1239,317,8,mat.ZINC);
  for(const [x,y] of [[757,173],[805,134],[916,139],[1156,135],[1258,169]]) {
    P([[x,y+3],[x+16,y],[x+23,y+16],[x+9,y+25]],mat.IRON);
    R(x+7,y+7,7,9,mat.GLASSBLOCK);
  }
  // Dockhouse: massive horizontal technical decks JUST above the hull,
  // independent optical gantry and differentiated service platforms.
  L(390,1705,572,1705,12,mat.IRON);
  L(1413,1699,1671,1699,13,mat.STEEL);
  L(697,1698,786,1698,11,mat.STEEL);L(1280,1701,1384,1701,11,mat.IRON);
  for(const [x,y,w] of [[410,1692,59],[502,1692,33],[1424,1684,95],[1579,1685,64]]){
    R(x,y,w,9,mat.STEEL);R(x+8,y+2,w-16,5,mat.SIGNAL);
  }
  L(713,1624,743,1686,12,mat.IRON);L(1294,1628,1324,1692,12,mat.IRON);
  P([[680,1703],[704,1688],[730,1707],[712,1733],[684,1730]],mat.IRON);
  P([[1334,1709],[1360,1686],[1391,1710],[1372,1734],[1348,1732]],mat.IRON);
  R(697,1709,14,9,mat.GLASSBLOCK);R(1352,1709,16,8,mat.SIGNAL);
  // Color-coded thrust-repair hangar bays are inset in supported keel,
  // never full-width screen-aligned wallpaper.
  for(const [x,y,w,h] of [[603,1829,68,15],[717,1818,83,17],
                          [906,1829,69,14],[1051,1825,67,14],
                          [1216,1835,61,14]]) {
    R(x,y,w,h,mat.STEEL);R(x+5,y+4,w-10,h-8,mat.BLUE);
  }
  // Recut all primary operational paths AFTER this detail pass below.


  // FINAL MACRO-CRITIQUE REPAIR: the civic heart needed more actual
  // architecture below the absent spindle. Restore a broken halo-station,
  // never more generic room stacks. Navigation cuts follow this layer.
  ring(1032,1214,271,219,22,mat.STEEL,(dx,dy)=>!(Math.abs(dx)<128&&dy>109));
  ring(1032,1214,228,177,9,mat.IRON,(dx,dy)=>!(Math.abs(dx)<116&&dy>110));
  L(766,1220,686,1176,16,mat.STEEL);
  L(1293,1224,1372,1170,16,mat.STEEL);
  P([[795,1111],[842,1082],[910,1087],[927,1119],[877,1144],[813,1141]],mat.IRON);
  P([[1143,1080],[1215,1078],[1268,1118],[1243,1146],[1170,1134]],mat.IRON);
  R(817,1105,72,13,mat.GLASSBLOCK);R(1175,1102,65,12,mat.BLUE);
  L(817,1139,797,1214,10,mat.ZINC);
  L(1241,1140,1263,1212,10,mat.ZINC);
  L(709,1322,944,1304,17,mat.STEEL);
  L(1134,1301,1375,1328,17,mat.STEEL);
  L(731,1327,763,1386,9,mat.IRON);
  L(1331,1327,1297,1394,9,mat.IRON);
  for(const [x,y] of [[743,1317],[818,1310],[1196,1311],[1300,1323]]){
    R(x,y,34,8,mat.ZINC);R(x+8,y+2,13,4,mat.SIGNAL);
  }
  // Sky sacristy, flank hulls anchored through structural cables to roof.
  L(500,84,770,173,14,mat.STEEL);
  L(1536,96,1279,179,14,mat.STEEL);
  L(493,102,493,318,14,mat.STEEL);
  L(1586,110,1586,307,15,mat.STEEL);

  // OPERATIONAL CUTS performed after ornamental construction. Always preserve
  // generous connected upper, middle, lower and vertical Midge routes.
  R(142,468,1762,82,mat.E);
  R(170,489,490,105,mat.E);R(1393,489,490,104,mat.E);
  R(695,455,651,113,mat.E);R(743,652,571,130,mat.E);
  R(133,934,1779,113,mat.E);
  R(126,1436,1780,121,mat.E);R(771,1520,562,123,mat.E);
  R(349,518,130,1085,mat.E);R(979,513,137,1166,mat.E);
  R(1627,519,133,1103,mat.E);
  R(684,786,128,706,mat.E);R(1243,772,128,721,mat.E);
  R(485,1210,209,103,mat.E);R(1362,1181,237,107,mat.E);
  R(787,1520,153,258,mat.E);R(1205,1518,160,264,mat.E);
  R(1384,1037,105,192,mat.E); // connect Bastion undercrypt with mid artery
  // Slim embodied transit glyphs rooted below the low airway, no floating traps.
  for(const [x,y] of [[216,1559],[603,1559],[1442,1560],[1845,1559]]){
    R(x,y,31,10,mat.IRON);R(x+9,y+2,14,5,mat.SIGNAL);
  }

  // Post-carving keel suspension piers: anchored deep into the foundation
  // outside all three main horizontal actor flight levels.
  R(641,1859,13,122,mat.STEEL); R(1396,1859,13,122,mat.STEEL);
  R(633,1939,28,12,mat.IRON);R(1388,1939,28,12,mat.IRON);
  // Compress exact material plane into non-overlapping vertically coalesced five-field boxes.
  function compress(){
    const boxes=[],prev=new Map();
    let last=prev;
    for(let y=0;y<H;y++){
      const next=new Map(),row=y*W;let x=0;
      while(x<W){
        const start=x,m=g[row+x];while(x<W&&g[row+x]===m)x++;
        if(m===0)continue;
        const key=start+"|"+(x-start)+"|"+m,old=last.get(key);
        if(old!==undefined){boxes[old][3]++;next.set(key,old);}
        else{const idx=boxes.length;boxes.push([start,y,x-start,1,m]);next.set(key,idx);}
      }
      last=next;
    }
    return boxes;
  }
  const edits=compress();
  // Reconstruct ALL cells, reject every overlapping pair.
  const replay=new Uint8Array(W*H),hits=new Uint8Array(W*H);
  let collisions=0;
  for(const [x,y,w,h,m] of edits)for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){
    const n=yy*W+xx;if(hits[n])collisions++;hits[n]=1;replay[n]=m;
  }
  let mismatches=0;
  for(let i=0;i<g.length;i++)if(g[i]!==replay[i])mismatches++;
  if(mismatches||collisions)throw Error("LOSSLESS_REPLAY_FAIL "+mismatches+" "+collisions);
  if(edits.length>32768)throw Error("RECT_BUDGET_FAIL "+edits.length);

  const liquid_policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
  const setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:[217,987],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits,response:"LA-SELECTIVE",liquid_policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
  const json=JSON.stringify(setup);
  if(json.length>1048576)throw Error("BYTE_BUDGET_FAIL "+json.length);
  // Strict fully-contained actor-centre envelope 4-neighbour connected pass. No nearest-point relocation.
  const sites=[
    ["Magnet customs",217,987],["West skyline hatch",291,497],
    ["Nacre foundry chamber",513,751],["Freight lift junction",415,1197],
    ["Western high slip",745,496],["Loom aerial transfer",1026,712],
    ["Lost civic core",1047,989],["Underloom service",1046,1486],
    ["Bastion signal loft",1523,497],["Neon Meridian market",1680,986],
    ["Eastern descending lift",1687,1390],["Dock west portal",509,1487],
    ["West keel interrogator",837,1733],["Reactor berth",1281,1733],
    ["East salt gate",1868,986],["Broken-spindle observation",1210,729],
    ["Western crucible transfer",742,1159],["Bastion undercrypt",1439,1261]
  ];
  function flood(fw,fh,blocked){
    const halfw=Math.floor(fw/2),halfh=Math.floor(fh/2),stride=W+1, sat=new Uint32Array((W+1)*(H+1));
    for(let y=0;y<H;y++){
      let s=0;for(let x=0;x<W;x++){s+=(g[y*W+x]!==0)?1:0;sat[(y+1)*stride+x+1]=sat[y*stride+x+1]+s;}
    }
    const pass=new Uint8Array(W*H);
    for(let y=halfh;y<H-halfh;y++)for(let x=halfw;x<W-halfw;x++){
      const a=x-halfw,b=x+halfw, c=y-halfh,d=y+halfh;
      const n=sat[(d+1)*stride+b+1]-sat[c*stride+b+1]-sat[(d+1)*stride+a]+sat[c*stride+a];
      if(!n&&(!blocked||!(x>=blocked[0]&&x<=blocked[2]&&y>=blocked[1]&&y<=blocked[3])))pass[y*W+x]=1;
    }
    const start=987*W+217;if(!pass[start])return {size:0,sites:sites.map(q=>[q[0],false]),error:"SPAWN_OBSTRUCTED"};
    const q=new Int32Array(W*H),seen=new Uint8Array(W*H);let r=0,w=1;q[0]=start;seen[start]=1;
    while(r<w){
      const p=q[r++],x=p%W,y=(p/W)|0;
      const nei=[p-1,p+1,p-W,p+W];
      for(let j=0;j<4;j++){
        if((j===0&&x===0)||(j===1&&x===W-1)||(j===2&&y===0)||(j===3&&y===H-1))continue;
        const n=nei[j];if(pass[n]&&!seen[n]){seen[n]=1;q[w++]=n;}
      }
    }
    return {size:w,sites:sites.map(s=>[s[0],!!seen[s[2]*W+s[1]]])};
  }
  const reachable={};for(const [fw,fh] of [[19,15],[23,19],[31,27]])reachable[fw+"x"+fh]=flood(fw,fh,null);
  const bypass=flood(31,27,[961,931,1152,1044]);
  for(const [k,v] of Object.entries(reachable))if(v.sites.some(s=>!s[1]))
    throw Error("SITE_CLEARANCE_FAIL "+k+": "+v.sites.filter(s=>!s[1]).map(s=>s[0]).join(","));
  // Material catalogue exact RGB palette, indexed 4-bit lossless pixel parity.
  function encodePNG(x0,y0,ww,hh){
    const stride=1+ww/2,raw=new Uint8Array(stride*hh);
    const toIndex=new Int16Array(256);toIndex.fill(-1);for(let i=0;i<indexToMaterial.length;i++)toIndex[indexToMaterial[i]]=i;
    for(let y=0;y<hh;y++)for(let x=0;x<ww;x+=2){
      const a=toIndex[g[(y0+y)*W+x0+x]],b=toIndex[g[(y0+y)*W+x0+x+1]];
      if(a<0||b<0)throw Error("PALETTE_FAIL "+a+" "+b);
      raw[y*stride+1+(x>>1)]=(a<<4)|b;
    }
    function be32(n){return [(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255];}
    function crc32(v){let c=0xffffffff;for(const b of v){c^=b;for(let k=0;k<8;k++)c=(c>>>1)^(0xedb88320&(-(c&1)));}return (c^0xffffffff)>>>0;}
    function adler32(v){let a=1,b=0;for(let i=0;i<v.length;i++){a=(a+v[i])%65521;b=(b+a)%65521;}return ((b<<16)|a)>>>0;}
    function chunk(typ,dat){
      const tb=Array.from(typ).map(s=>s.charCodeAt(0)),res=[...be32(dat.length),...tb,...dat,...be32(crc32([...tb,...dat]))];
      return res;
    }
    const z=[0x78,0x01];for(let off=0;off<raw.length;){
      const len=Math.min(65535,raw.length-off),final=off+len===raw.length;
      z.push(final?1:0,len&255,(len>>8)&255,(~len)&255,((~len)>>8)&255);
      for(let j=0;j<len;j++)z.push(raw[off+j]);off+=len;
    }
    z.push(...be32(adler32(raw)));
    const plte=rgb.flat(),pout=[
      137,80,78,71,13,10,26,10,
      ...chunk("IHDR",[...be32(ww),...be32(hh),4,3,0,0,0]),
      ...chunk("PLTE",plte),
      ...chunk("IDAT",z),
      ...chunk("IEND",[])
    ];
    const png=new Uint8Array(pout);
    // Independently re-parse signature/chunks/CRC, stored zlib, Adler and compare all decoded palette pixels.
    function u32(pos){return (((png[pos]*0x1000000)+(png[pos+1]<<16)+(png[pos+2]<<8)+png[pos+3])>>>0);}
    for(let i=0;i<8;i++)if(png[i]!==[137,80,78,71,13,10,26,10][i])throw Error("PNG_SIG");
    let pos=8,idat=null,terminated=false,chunks=0;
    while(pos<png.length){
      const len=u32(pos),type=String.fromCharCode(...png.slice(pos+4,pos+8)),d=png.slice(pos+8,pos+8+len),crc=u32(pos+8+len);
      const cb=new Uint8Array(4+d.length);cb.set(png.slice(pos+4,pos+8));cb.set(d,4);
      if(crc32(cb)!==crc)throw Error("PNG_CRC "+type);
      if(type==="IDAT")idat=d;
      if(type==="IEND"){terminated=true;pos+=12;break;}
      pos+=12+len;chunks++;
    }
    if(!terminated||pos!==png.length||!idat)throw Error("PNG_IEND");
    const zin=idat;let zi=2,ro=0,decoded=new Uint8Array(raw.length);
    while(zi<zin.length-4){
      const fl=zin[zi++],len=zin[zi]|(zin[zi+1]<<8),nl=zin[zi+2]|(zin[zi+3]<<8);zi+=4;
      if(((len^nl)&65535)!==65535||((fl>>1)&3)!==0)throw Error("PNG_ZLIB_BLOCK");
      decoded.set(zin.slice(zi,zi+len),ro);zi+=len;ro+=len;
      if(fl&1)break;
    }
    const expect=((zin[zin.length-4]*0x1000000)+(zin[zin.length-3]<<16)+(zin[zin.length-2]<<8)+zin[zin.length-1])>>>0;
    if(ro!==raw.length||expect!==adler32(decoded))throw Error("PNG_ADLER");
    let pDiff=0;
    for(let y=0;y<hh;y++)for(let x=0;x<ww;x++){
      const packed=decoded[y*stride+1+(x>>1)],ind=(x&1)?packed&15:packed>>4;
      if(indexToMaterial[ind]!==g[(y+y0)*W+x+x0])pDiff++;
    }
    if(pDiff)throw Error("PNG_PIXEL_PARITY "+pDiff);
    return {bytes:png,pixels:ww*hh,chunkCRC:"PASS",adler:"PASS",materialPixelsVerified:ww*hh};
  }
  const gallery=[
    ["overview.png",0,0,2048,2048],
    ["01-nacre-freight-cliff.png",100,318,610,580],
    ["02-spindle-and-sacristy.png",714,80,618,724],
    ["03-meridian-bastion.png",1340,314,610,590],
    ["04-split-market-artery.png",668,864,686,516],
    ["05-abyssal-drydock.png",497,1545,742,480]
  ].map(p=>({name:p[0],region:p.slice(1),...encodePNG(...p.slice(1))}));
  const hist={};for(const v of g)hist[v]=(hist[v]||0)+1;
  return {W,H,seed,grid:g,json,edits,sites,reachable,bypass,hist,materials:mat,gallery,mismatches,collisions};
}
const r=buildMegaCanvas();
const artifacts=[["setup-hollow-sovereign.json",Buffer.from(r.json,"utf8")],...r.gallery.map(g=>[g.name,Buffer.from(g.bytes)])];
let ok=true;
for(const [name,bytes] of artifacts){
 if(process.argv.includes("--verify")){
   if(!fs.existsSync(name)||!fs.readFileSync(name).equals(bytes)){ console.error("FAIL:",name); ok=false; }
   else console.log("PASS:",name,bytes.length);
 } else {fs.writeFileSync(name,bytes); console.log("WRITE:",name,bytes.length);}
}
if(!ok)process.exitCode=1;
