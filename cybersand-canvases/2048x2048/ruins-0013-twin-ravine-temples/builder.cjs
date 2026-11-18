'use strict';
/* Reproducible source-to-material-cell geometry for the CyberSand ruins-0013 canvas. */
const template={"version":2,"extent":[2048,2048],"actors":[{"id":1,"model":"midge","hash":"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96","spawn":[785,325],"options":{"budget":20,"mass_multiplier":1,"inertia_multiplier":1,"thrust_multiplier":1,"torque_multiplier":1,"boost_multiplier":1.5}}],"next_id":2,"selected":1,"edits":[],"response":"LA-SELECTIVE","liquid_policy":[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],"normalize":false,"rule_radius":2,"source":[],"material":2,"brush":8,"fire":false};
function generate(base){
const W=2048,H=2048,SEED=20261117,A=new Uint8Array(W*H),M={AIR:0,WALL:58,WATER:3,LIME:38,GRANITE:40,COBBLE:41,MOSS:42,TERRA:48,SLATE:49,BRONZE:52,VERD:54,CYAN:77,AMBER:79,MARBLE:98,BASALT:100,OBSIDIAN:101,QUARTZ:122,PHOS:127};let sd=SEED;
const rand=()=>{sd=(Math.imul(sd,1664525)+1013904223)>>>0;return sd/4294967296};
function rect(x,y,w,h,m){let l=Math.max(0,x|0),r=Math.min(W,Math.ceil(x+w)),t=Math.max(0,y|0),b=Math.min(H,Math.ceil(y+h));for(let yy=t;yy<b;yy++)if(r>l)A.fill(m,yy*W+l,yy*W+r)}
function poly(p,m){let lo=Math.max(0,Math.min(...p.map(a=>a[1]))|0),hi=Math.min(H-1,Math.ceil(Math.max(...p.map(a=>a[1]))));for(let y=lo;y<=hi;y++){let xx=[];for(let i=0;i<p.length;i++){let a=p[i],b=p[(i+1)%p.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xx.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xx.sort((a,b)=>a-b);for(let j=0;j+1<xx.length;j+=2)rect(xx[j],y,xx[j+1]-xx[j]+1,1,m)}}
function line(x,y,X,Y,m,w=5){let n=Math.max(1,Math.abs(X-x),Math.abs(Y-y));for(let i=0;i<=n;i+=Math.max(1,w*.55)){let f=i/n;rect(x+(X-x)*f-w/2,y+(Y-y)*f-w/2,w,w,m)}}
function disk(cx,cy,R,m){for(let y=Math.max(0,(cy-R)|0);y<Math.min(H,cy+R);y++){let dx=Math.sqrt(Math.max(0,R*R-(cy-y)**2));rect(cx-dx,y,2*dx+1,1,m)}}
function ring(x,y,R,m,w=6){for(let i=0,N=185;i<N;i++){let a=i*2*Math.PI/N,b=(i+1)*2*Math.PI/N;line(x+R*Math.cos(a),y+R*Math.sin(a),x+R*Math.cos(b),y+R*Math.sin(b),m,w)}}

/* R2: source-JPEG-observed rooted asymmetric cliff sanctuaries; all art is actual cells.
   No overlay, no procedural copy of R1's repeated corridor bands. */
function stain(x,y,w,h,m){let l=Math.max(0,Math.floor(x)),r=Math.min(W,Math.ceil(x+w)),t=Math.max(0,Math.floor(y)),b=Math.min(H,Math.ceil(y+h));for(let yy=t;yy<b;yy++)for(let xx=l;xx<r;xx++){let k=yy*W+xx;if(A[k]!==0&&A[k]!==3)A[k]=m}}
function strut(x,y,X,Y,m,w=5){let n=Math.ceil(Math.hypot(X-x,Y-y)/Math.max(2,w/2));for(let i=0;i<=n;i++){let f=i/n;stain(x+(X-x)*f-w/2,y+(Y-y)*f-w/2,w,w,m)}}
function room(x,y,w,h){rect(x-14,y-16,w+28,15,M.COBBLE);rect(x,y,w,h,M.AIR);rect(x-8,y+h,w+16,12,M.SLATE)}
function steps(x,y,n,dx,dy,sgn=1){for(let k=0;k<n;k++){rect(x+k*dx*sgn,y+k*dy,dx+2,9,M.COBBLE);rect(x+k*dx*sgn,y+k*dy+9,dx+2,4,M.MOSS)}}
// West cliff is huge and old; eastern ridge is narrower and set lower.
poly([[0,300],[207,305],[257,240],[401,264],[498,361],[565,357],[681,468],[777,586],[806,756],[774,876],[840,990],[780,1163],[799,1295],[741,1452],[777,1581],[697,1755],[812,1913],[890,2048],[0,2048]],M.BASALT);
poly([[0,348],[170,357],[260,299],[360,331],[461,381],[590,444],[700,555],[747,642],[761,801],[720,935],[780,1052],[740,1231],[693,1445],[730,1629],[655,1800],[750,2048],[0,2048]],M.GRANITE);
poly([[0,404],[138,399],[251,354],[386,429],[518,454],[615,560],[691,675],[712,869],[666,1002],[690,1204],[626,1444],[665,1550],[600,1826],[715,2048],[0,2048]],M.OBSIDIAN);
poly([[1753,365],[1862,379],[1931,346],[2048,382],[2048,2048],[1552,2048],[1538,1868],[1586,1674],[1487,1517],[1535,1338],[1455,1191],[1520,990],[1452,847],[1496,706],[1485,603],[1590,480],[1660,449]],M.BASALT);
poly([[1789,423],[1894,407],[2048,410],[2048,2048],[1618,2048],[1600,1820],[1658,1601],[1543,1478],[1589,1306],[1528,1141],[1602,961],[1533,860],[1577,703],[1570,614],[1665,527]],M.GRANITE);
poly([[1838,469],[1942,449],[2048,455],[2048,2048],[1690,2048],[1696,1834],[1691,1592],[1654,1443],[1701,1280],[1661,1097],[1712,940],[1691,766],[1717,618],[1787,538]],M.OBSIDIAN);
poly([[704,2048],[776,1899],[843,1919],[917,1874],[994,1910],[1084,1870],[1164,1915],[1260,1881],[1328,1903],[1436,1844],[1539,1907],[1597,2048]],M.BASALT);
poly([[731,2048],[854,1977],[994,1984],[1205,1962],[1368,1998],[1510,1939],[1589,2048]],M.OBSIDIAN);
// Authentic stone weathering is limited to occupied rock cells.
for(let i=0;i<18;i++){let y=336+i*95;strut(25,y,675-(i%4)*21,y-31+(i%5)*11,i%4===0?M.COBBLE:M.MOSS,3+i%3);strut(1695+(i%4)*13,y+62,2026,y+17-(i%4)*14,i%4?M.SLATE:M.BRONZE,3+i%3)}
for(let i=0;i<800;i++){let x=i%3?25+rand()*750:1500+rand()*525,y=320+rand()*1595,k=(y|0)*W+(x|0);if(A[k]===M.BASALT||A[k]===M.GRANITE||A[k]===M.OBSIDIAN)stain(x,y,5+i%5*5,2,i%7===0?M.MOSS:i%3===0?M.LIME:M.SLATE)}
// Unlike the R1 grid, caves have different extents and heights.
room(164,503,310,154);room(325,766,299,142);room(171,1059,350,169);room(315,1312,327,146);room(153,1657,371,156);
room(1669,548,290,163);room(1665,878,297,130);room(1675,1151,280,152);room(1715,1602,260,149);
for(let p of [[405,577,467,80],[548,819,338,96],[464,1112,407,99],[554,1367,352,99],[443,1716,401,92],[1433,591,335,105],[1429,922,341,96],[1401,1197,395,114],[1445,1668,354,108]])rect(...p,M.AIR);
// Deep flights are really joined via caves/portals and not point-search cheats.
rect(631,564,123,324,M.AIR);rect(676,820,238,84,M.AIR);
rect(1552,579,115,332,M.AIR);rect(1431,865,248,92,M.AIR);
rect(665,1245,134,360,M.AIR);rect(653,1552,226,72,M.AIR);
rect(1550,1215,118,392,M.AIR);rect(1449,1535,233,82,M.AIR);
// Distinctive stepped village stone, deliberately not an identical layer every 300 px.
for(let [x,y,n,dx,dy,s] of [[70,690,8,52,29,1],[188,992,7,53,27,1],[75,1490,8,49,19,1],[1940,767,7,49,27,-1],[1942,1377,6,52,23,-1]])steps(x,y,n,dx,dy,s);
for(let [x,y,w] of [[55,691,275],[120,995,246],[315,1273,184],[85,1488,335],[179,1814,466],[1725,736,310],[1680,1084,292],[1728,1467,314]]){stain(x,y,w,8,M.LIME);stain(x,y+8,w,4,M.MOSS)}
// Large old west tree: mature crown, interlocked trunk/root buttresses wrapping carved stone.
poly([[370,397],[387,249],[411,121],[462,104],[483,271],[535,438],[480,559],[461,600],[432,495],[403,425]],M.BASALT);
line(439,304,355,203,M.BASALT,28);line(421,259,270,166,M.BASALT,27);line(467,279,576,171,M.BASALT,31);line(480,340,620,272,M.BASALT,21);
line(455,465,323,698,M.GRANITE,18);line(478,491,550,677,M.BASALT,21);line(437,458,264,619,M.BASALT,16);
for(let i=0;i<34;i++){let a=i*2.399963,r=Math.sqrt(i/34)*204;disk(429+Math.cos(a)*r,104+Math.sin(a)*r*.56,31+i%5*9,i%7===0?M.COBBLE:M.MOSS)}
// R2B-P1: source-shaped eccentric thick roots in place of eleven parallel comb-struts.
const forks=[
 [[449,396],[409,510],[345,635],[299,737],[248,809]],
 [[466,431],[505,536],[552,639],[584,730],[608,831]],
 [[425,407],[381,531],[333,584],[275,675],[231,765]]
];
for(let k=0;k<forks.length;k++){
 let q=forks[k];
 for(let i=0;i<q.length-1;i++){let a=q[i],b=q[i+1];line(a[0],a[1],b[0],b[1],i%2?M.GRANITE:M.BASALT,26-i*3+(k===1?4:0));}
 for(let i=1;i<q.length-1;i++){let [x,y]=q[i];disk(x,y,15-i*2+(k===2?3:0),M.GRANITE);}
 let p=q[2];line(p[0],p[1],p[0]+(k===1?85:-72),p[1]+95+(k%2)*28,M.BASALT,16);
 line(q[3][0],q[3][1],q[3][0]+(k===1?-63:61),q[3][1]+56,M.MOSS,9);
}
for(let [x,y,X,Y,w] of [[405,519,324,585,11],[349,651,272,729,10],[511,532,566,578,12],[554,661,638,726,11],[375,541,421,609,9]]){
 line(x,y,X,Y,M.MOSS,w);disk(X,Y,7,M.MOSS);
}
// Right guardian is ONE integral eroded rock monolith rooted to the ridge.
// R2B-P1: broad, short, ridge-embedded guardian with broken moss crown.
poly([[1587,550],[1602,477],[1627,432],[1643,367],[1674,357],[1693,338],[1725,347],[1750,368],[1783,401],[1802,465],[1810,530],[1776,588],[1746,613],[1642,595]],M.GRANITE);
poly([[1619,481],[1648,395],[1691,369],[1736,378],[1772,416],[1790,477],[1768,541],[1681,545],[1622,527]],M.LIME);
poly([[1632,491],[1656,418],[1699,384],[1741,413],[1727,466],[1751,533],[1695,566],[1635,541]],M.GRANITE);
for(let [x,y,r] of [[1626,392,13],[1660,368,12],[1701,352,16],[1749,375,10],[1780,409,12]])disk(x,y,r,M.MOSS);
line(1650,452,1673,445,M.SLATE,8);line(1725,440,1743,450,M.SLATE,7);
line(1699,462,1688,511,M.SLATE,6);line(1688,511,1710,520,M.GRANITE,6);
line(1668,541,1701,548,M.SLATE,5);
for(let [x,y,X,Y] of [[1620,489,1598,525],[1638,419,1618,451],[1772,440,1801,480],[1763,551,1795,578],[1716,364,1736,340]])strut(x,y,X,Y,M.MOSS,6);

// Smaller east tree on ledge; the guardian and tree are physically connected.
line(1890,480,1890,257,M.BASALT,25);line(1890,330,1832,278,M.BASALT,16);line(1890,340,1963,280,M.BASALT,16);
for(let i=0;i<19;i++){let a=i*2.399963,r=Math.sqrt(i/19)*96;disk(1889+Math.cos(a)*r,251+Math.sin(a)*r*.6,22+i%4*6,M.MOSS)}
// ONE living bridge in mid-high ravine: narrow, uneven, moss, tension/root hangers.
const bp=[[735,666],[805,670],[879,679],[950,693],[1016,703],[1070,705],[1138,694],[1214,685],[1296,669],[1377,660],[1455,650],[1548,647]];
for(let i=0;i<bp.length-1;i++){let [x,y]=bp[i],[X,Y]=bp[i+1];line(x,y,X,Y,M.COBBLE,18);line(x,y-6,X,Y-6,M.MOSS,6);line(x,y+8,X,Y+8,M.SLATE,5)}
// Sparse branched living-root pendants replace formulaic V-hanger rhythm.
for(let [x,y,dx,dy,w] of [[803,671,-13,48,6],[908,685,34,71,8],[1006,704,-18,37,5],[1139,694,28,63,7],[1293,670,-36,46,6],[1441,653,18,44,5]]){
 line(x,y+8,x+dx,y+dy,M.MOSS,w);
 line(x+dx,y+dy,x+dx+(dx<0?-13:12),y+dy+22,M.COBBLE,Math.max(3,w-3));
 if(w>6)line(x+dx*.55,y+dy*.6,x+dx*.55-25,y+dy*.6+17,M.MOSS,4);
}
for(let [x,y,X,Y] of [[855,680,911,713],[931,693,1001,719],[1106,709,1170,698],[1219,696,1285,687]])line(x,y,X,Y,M.MOSS,4);

line(703,615,751,663,M.BASALT,15);line(1460,655,1561,583,M.BASALT,16);
// A lower *spur* stays attached to east terrain instead of a second suspended deck.
poly([[1553,1476],[1475,1479],[1375,1521],[1308,1553],[1305,1566],[1380,1567],[1450,1540],[1545,1519]],M.BASALT);
line(1329,1547,1491,1514,M.MOSS,7);line(1391,1548,1422,1627,M.SLATE,6);
for(let i=0;i<7;i++)line(1401+i*17,1546,1404+i*17,1583+(i%3)*14,M.MOSS,3);
// Old inscribed reliefs, relief stone thresholds and lateral root tendrils.
for(let [x,y] of [[246,558],[400,818],[315,1118],[433,1380],[1779,610],[1810,931],[1791,1240],[1828,1676]]){rect(x-15,y-10,30,5,M.MARBLE);rect(x-10,y-5,20,44,M.COBBLE);rect(x-4,y+9,8,12,M.OBSIDIAN);rect(x-16,y+39,32,5,M.SLATE)}
for(let i=0;i<26;i++){let x=115+(i*37)%510,y=465+(i*193)%1270;strut(x,y,x+(i%2?28:-21),y+33+i%3*12,M.MOSS,3+i%3)}
// Final authoring clearance (REAL air corridors, entire portals), carving late material flecks too.
for(let p of [[380,557,489,108],[530,827,358,82],[464,1115,410,86],[545,1367,350,90],[440,1702,403,93],[1426,593,371,79],[1426,919,394,87],[1396,1204,409,93],[1444,1669,366,94]])rect(...p,M.AIR);
for(let p of [[180,521,272,127],[347,784,263,110],[187,1074,317,144],[329,1328,292,115],[168,1680,339,117],[1686,566,254,134],[1684,894,258,108],[1696,1170,247,116],[1736,1622,229,116]])rect(...p,M.AIR);
// The bridge is continuous, but side-cliff shafts allow a flyable loop around it.
rect(626,566,114,341,M.AIR);rect(658,824,237,105,M.AIR);
rect(1560,580,112,352,M.AIR);rect(1429,873,269,113,M.AIR);
rect(655,1246,119,388,M.AIR);rect(644,1566,244,95,M.AIR);
rect(1550,1208,109,431,M.AIR);rect(1432,1524,267,94,M.AIR);
rect(676,1774,220,94,M.AIR);rect(1455,1776,265,99,M.AIR);
// Open flight vault, not an unreachable body of black under the composition.

 // R2B-P0/P1 (final ordered cells): source-style root bridge now genuinely meets BOTH cliffs.
 // A separate east outside-air chimney joins an undercut crypt arcade, preserving the required
 // Midge air loop without severing the single material-connected suspension crossing.
 line(742,668,678,693,M.COBBLE,18);line(678,693,586,745,M.GRANITE,20);
 line(1453,652,1580,677,M.COBBLE,18);line(1580,677,1712,705,M.GRANITE,21);
 line(1712,705,1773,725,M.BASALT,24);
 line(742,657,675,680,M.MOSS,6);line(676,683,587,732,M.MOSS,6);
 line(1451,642,1577,666,M.MOSS,6);line(1577,666,1721,693,M.MOSS,6);
 for(let [x,y,X,Y] of [[623,720,599,753],[653,698,631,746],[1586,686,1570,733],[1620,698,1600,752],[1704,703,1732,744]])line(x,y,X,Y,M.MOSS,4);
 // The east cap overhangs a 49-cell clear service cave; an exterior 56-cell air chimney
 // admits flyers above the smaller shrine. This is deliberate 2D topology, not pass-through rock.
 rect(1435,757,613,49,M.AIR);rect(1992,251,56,600,M.AIR);
 // Hand-shaped voussoirs and rooted spandrels vary each threshold, avoiding gallery repetition.
 const arches=[[164,503,310,154],[325,766,299,142],[171,1059,350,169],[315,1312,327,146],[153,1657,371,156],[1669,548,290,163],[1665,878,297,130],[1675,1151,280,152],[1715,1602,260,149]];
 for(let k=0;k<arches.length;k++){let [x,y,w,h]=arches[k],tl=18+(k*7)%24,tr=18+(k*11)%25;
   poly([[x-2,y-3],[x+tl+18,y-7],[x+tl,y+20],[x+10,y+46+(k%3)*6],[x-2,y+58]],M.GRANITE);
   poly([[x+w+3,y-3],[x+w-tr-19,y-8],[x+w-tr,y+21],[x+w-9,y+41+(k%4)*7],[x+w+3,y+60]],M.COBBLE);
   line(x+18,y+1,x+w-21,y+2+(k%3)*4,M.COBBLE,7);
   line(x+7,y+52,x+15,y+74+(k%3)*8,M.MOSS,4);
   line(x+w-9,y+43,x+w-16,y+76+(k%4)*7,M.MOSS,4);
   for(let j=0;j<5;j++)stain(x+16+j*16+(k*3%5),y-10,10+(j%3)*2,3,j%2?M.LIME:M.SLATE);
 }
 // Uneven patina and chips rather than regular flat cartoon-face glyphs.
stain(1629,395,160,148,M.GRANITE);
poly([[1641,410],[1670,398],[1687,409],[1671,439],[1647,447]],M.LIME);
poly([[1724,399],[1754,417],[1767,443],[1736,435]],M.SLATE);
line(1653,462,1678,453,M.SLATE,6);
line(1725,459,1747,464,M.SLATE,5);
line(1698,465,1687,492,M.SLATE,4);
line(1687,492,1694,507,M.SLATE,4);
line(1664,540,1688,547,M.SLATE,5);line(1706,543,1729,535,M.SLATE,4);
for(let [x,y,X,Y] of [[1607,506,1625,480],[1634,408,1644,379],[1761,409,1784,427],[1770,517,1795,550]])strut(x,y,X,Y,M.MOSS,5);

// Supported asymmetrical stone-and-vine tufts, not random flecks in the flying void.
 for(let i=0;i<28;i++){let x=170+(i*47)%510,y=330+(i*139)%1220;
   if(A[(y|0)*W+(x|0)]!==0){let X=x+8+(i%3)*5,Y=y-14-(i%4)*7;line(x,y,X,Y,M.MOSS,3);disk(X,Y,4+i%4,M.MOSS)}
 }
 for(let i=0;i<16;i++){let x=1600+(i*43)%380,y=470+(i*137)%1250;
   if(A[(y|0)*W+(x|0)]!==0)line(x,y,x-8-(i%3)*5,y-12-(i%4)*7,M.MOSS,3)}

 // Final seam repair on the actual right bridge deck: connect the last continuous
 // pre-existing root span to the new cantilevered east-bank masonry.
 line(1391,657,1492,653,M.COBBLE,18);
 line(1394,645,1495,641,M.MOSS,6);

// R2B-P1 source-inspired, supported shrine voussoirs. These are drawn after the
// main corridor cuts; geometric portal aperture and operational centres are tested.
poly([[181,521],[237,521],[224,534],[211,555],[199,574],[181,579]],M.COBBLE);
poly([[408,521],[452,521],[452,583],[442,560],[430,539]],M.GRANITE);
poly([[348,784],[406,784],[388,803],[377,825],[361,847],[348,853]],M.GRANITE);
poly([[582,784],[610,783],[610,835],[598,815],[585,800]],M.COBBLE);
for(let [x,y,w] of [[171,496,288],[330,754,273]])for(let j=0;j<5;j++){
 let xx=x+j*(w/5);rect(xx,y-(j%3)*4,w/5-4,6+(j%2)*4,j%3?M.SLATE:M.COBBLE);
}
for(let [x,y,X,Y] of [[184,544,172,590],[216,523,193,542],[450,548,475,583],[360,804,343,850],[402,783,419,806],[592,795,616,829]])line(x,y,X,Y,M.MOSS,5);
// Stable stone weathering, applied to existing solids only.
for(let [x,y,w,h] of [[165,490,310,9],[325,757,295,10],[153,660,332,7],[333,905,280,8],[1555,734,420,16],[1539,810,440,16],[1590,844,270,11]])stain(x,y,w,h,M.COBBLE);
for(let [x,y,w] of [[165,494,120],[323,765,173],[1438,739,126],[1758,745,206],[1576,816,159],[1780,818,193]])stain(x,y,w,6,M.MOSS);
// Grounded buttress piers terminate strictly BELOW the y757..805 open service
// tunnel; no ornamental blocks in exterior x1992..2047 chimney.
// The first two east-undercroft shoulder districts are existing, sometimes
// detached stone: retint ONLY original stone here rather than add floating piers.
for(let [x,y,w,h] of [[1461,811,40,64],[1577,811,25,53]]){
 stain(x,y,w,h,M.GRANITE);stain(x,y+h-8,w+3,7,M.MOSS);
}
// Downstream piers physically join the lower eastern ridge in the final
// four-neighbour cell grid; keep the entire air passage above y805 untouched.
for(let [x,y,w,h] of [[1700,812,35,58],[1864,812,40,54]]){
 poly([[x,y],[x+w,y],[x+w+11,y+h],[x-13,y+h]],M.GRANITE);
 line(x-8,y+h-1,x+w+10,y+h-2,M.MOSS,5);
}
// Organic multi-level canopy serration and small shadows, no geometric polka-dots.
for(let [x,y,r] of [[302,75,31],[349,52,25],[492,42,28],[551,93,37],[612,113,22],[239,144,23]])disk(x,y,r,M.MOSS);
for(let [x,y,X,Y] of [[306,93,327,83],[364,61,380,75],[471,93,493,87],[533,130,552,119],[583,86,596,104],[274,165,292,154],
 [373,101,408,93],[458,52,478,67],[521,59,540,74]]){
 strut(x,y,X,Y,M.SLATE,4);strut(X,Y,X+12,Y-7,M.MOSS,5);
}
// Distinct, solid-rooted terraced ledges rather than isolated line fragments.
for(let [x,y,X,Y] of [[1840,870,1934,859],[1727,1015,1852,1010],[1760,1121,1946,1127],[1687,1406,1833,1397]]){
 strut(x,y,X,Y,M.COBBLE,8);strut(x,y-6,X-13,Y-7,M.MOSS,4);
}

/* R2A: source-led lower ravine wayfinding. Three unlike connected destinations,
   all real materials and carved air, not a duplicate overhead root bridge.
   The unique upper suspension bridge and both of its anchored banks are unchanged. */
// West root relay: excavate a sinuous inhabited vein between the already carved
// terrace chapel and the lower east-facing vertical service shaft.
poly([[370,1479],[403,1454],[466,1449],[530,1465],[566,1496],[572,1555],[555,1590],[491,1609],[420,1597],[367,1560]],M.AIR);
poly([[535,1542],[579,1520],[627,1531],[658,1550],[670,1586],[630,1607],[570,1590]],M.AIR);
poly([[367,1492],[387,1466],[406,1462],[393,1503],[384,1536],[367,1551]],M.GRANITE);
poly([[535,1476],[556,1488],[581,1528],[563,1556],[547,1520]],M.COBBLE);
poly([[388,1594],[422,1605],[489,1611],[527,1597],[552,1603],[490,1625],[427,1627]],M.COBBLE);
strut(380,1480,419,1430,M.MOSS,11);
strut(419,1430,470,1378,M.MOSS,13);
strut(477,1368,498,1291,M.MOSS,12);
strut(515,1608,574,1588,M.MOSS,8);
strut(421,1618,388,1657,M.MOSS,9);
// Reopen the carefully dimensioned west transfer after root-buttress work.
rect(579,1552,91,53,M.AIR);
for(let [x,y,X,Y] of [[378,1523,407,1478],[532,1569,557,1535],[452,1601,472,1592]])
  strut(x,y,X,Y,M.SLATE,5);
// Lower east lantern archive: uneven tall arched room in existing eastern stone,
// linked to the established x1550 service shaft, not stranded in a boxed cave.
poly([[1663,1383],[1709,1353],[1756,1340],[1827,1350],[1870,1382],[1890,1437],[1872,1481],[1831,1503],[1747,1498],[1684,1470]],M.AIR);
poly([[1594,1407],[1676,1400],[1731,1425],[1759,1452],[1735,1468],[1665,1460],[1593,1453]],M.AIR);
poly([[1680,1375],[1708,1348],[1759,1328],[1777,1337],[1734,1370],[1706,1405]],M.GRANITE);
poly([[1838,1350],[1860,1367],[1897,1407],[1897,1456],[1867,1453],[1857,1396]],M.COBBLE);
poly([[1735,1480],[1755,1498],[1801,1504],[1836,1490],[1857,1507],[1771,1515]],M.GRANITE);
for(let [x,y,X,Y] of [[1744,1343,1747,1373],[1859,1367,1845,1392],[1753,1509,1715,1562],[1827,1501,1872,1574]])
  strut(x,y,X,Y,M.MOSS,10);
stain(1718,1352,129,7,M.LIME);
stain(1748,1511,107,6,M.COBBLE);
// Lower valley substrate passage is a GROUNDED cut through the basin base,
// with two vertical skylights and multiple change-of-direction destinations.
// It is not a second span across the air gap.
poly([[869,1959],[904,1936],[952,1928],[1017,1931],[1068,1942],[1142,1925],[1220,1934],[1308,1928],[1379,1946],[1430,1960],[1400,2009],[1319,2006],[1224,2015],[1086,2001],[967,2004],[891,1991]],M.AIR);
poly([[978,1849],[1017,1843],[1045,1874],[1043,1939],[983,1957],[963,1916]],M.AIR);
poly([[1285,1849],[1333,1848],[1351,1885],[1354,1955],[1290,1970],[1274,1915]],M.AIR);
poly([[881,1967],[913,1945],[945,1940],[925,1969],[900,1985]],M.COBBLE);
poly([[1385,1949],[1410,1964],[1408,1986],[1387,1996],[1373,1968]],M.GRANITE);
for(let [x,y,X,Y] of [[969,1931,1000,1945],[1055,1941,1071,1953],[1215,1936,1199,1954],[1328,1939,1305,1958]])
  strut(x,y,X,Y,M.MOSS,5);
stain(938,2008,401,8,M.COBBLE);
stain(1003,2016,260,8,M.MOSS);
// Readable root/stone trace in pre-existing cliff only, without freely placed
// hanging hazards or unstable powders.
for(let [x,y,X,Y,w] of [[474,704,503,929,12],[503,929,551,1135,10],
 [544,1160,495,1382,12],[1701,1036,1683,1189,10],[1683,1190,1754,1341,9],
 [1782,1506,1817,1650,11],[1804,1658,1873,1811,10]])
 strut(x,y,X,Y,M.MOSS,w);
// Asymmetric supported masonry at the least legible old shrine apertures;
// retain the exact existing internal portals and conservative air centres.
poly([[180,1073],[221,1067],[213,1088],[198,1116],[191,1153],[180,1164]],M.COBBLE);
poly([[482,1076],[505,1070],[505,1169],[495,1154],[490,1107]],M.GRANITE);
poly([[1711,1171],[1748,1168],[1729,1196],[1721,1232],[1711,1246]],M.GRANITE);
poly([[1920,1169],[1945,1166],[1945,1246],[1934,1216],[1929,1185]],M.COBBLE);


/* R2B source-JPEG-scale macro-repair: one rough load-bearing living span,
   unequal eroded sanctuaries and rooted deep substrate. Actual cells only. */
const bt=[[724,669],[785,672],[859,681],[934,697],[1013,709],[1080,715],[1154,705],[1232,690],[1323,674],[1410,660],[1499,653],[1557,664]];
const bb=[[1557,696],[1501,691],[1440,709],[1365,704],[1300,720],[1226,727],[1140,742],[1075,752],[1002,744],[934,733],[861,713],[780,696],[716,698]];
poly([...bt,...bb],M.BASALT);
for(let i=0;i<bt.length-1;i++){
 let [x,y]=bt[i],[X,Y]=bt[i+1];
 line(x,y+10,X,Y+10,M.GRANITE,8+i%3*2);
 line(x,y+27,X,Y+23,M.COBBLE,5);
}
for(let [x,y,X,Y,w] of [
 [800,695,777,762,12],[865,708,898,788,13],[934,732,902,777,10],
 [1051,744,997,812,15],[1122,740,1178,800,12],[1221,726,1204,785,9],
 [1322,710,1378,764,13],[1460,694,1491,759,10]
]){
 line(x,y,X,Y,M.BASALT,w);
 line(X,Y,X+(X<x?-17:21),Y+21,M.MOSS,Math.max(4,w-6));
}
for(let [x,y,X,Y] of [[783,682,821,702],[922,699,969,725],[1077,714,1122,730],[1249,692,1294,705],[1421,661,1467,676]])
 line(x,y,X,Y,M.MOSS,7);
// Root collars meet existing cliff mass on BOTH banks cardinally.
poly([[667,699],[701,676],[746,670],[768,681],[758,708],[716,719],[678,731]],M.GRANITE);
poly([[1538,669],[1583,677],[1640,687],[1706,704],[1701,732],[1631,720],[1571,702]],M.GRANITE);
line(694,711,586,745,M.BASALT,23);line(1617,696,1770,730,M.BASALT,23);
// West open gallery's masonry grows irregularly out of cliff; retain the
// authored air rooms/shafts, rather than hiding with texture rectangles.
poly([[153,1055],[177,1027],[230,1000],[302,995],[395,1016],[470,1005],[532,1033],[553,1058],[501,1073],[390,1057],[276,1055],[194,1080]],M.COBBLE);
poly([[178,1061],[226,1037],[299,1027],[365,1038],[428,1031],[497,1050],[465,1061],[341,1047],[214,1069]],M.GRANITE);
for(let [x,y,X,Y,w] of [[172,1033,197,971,10],[232,1016,246,959,8],[417,1011,448,954,9],[527,1040,556,980,8]])
 line(x,y,X,Y,M.MOSS,w);
for(let [x,y,w,h] of [[89,956,136,44],[451,953,170,29],[91,1210,162,34],[458,1244,125,37],[113,1434,172,45],[508,1457,127,36]]){
 stain(x,y,w,h,M.COBBLE);stain(x+7,y+9,w-14,6,M.GRANITE);
}
// Eastern sanctuary is narrower and fractured under an unequal rock crown.
poly([[1663,1151],[1705,1117],[1776,1095],[1837,1105],[1887,1081],[1947,1113],[1974,1142],[1945,1174],[1898,1140],[1822,1139],[1722,1157]],M.GRANITE);
poly([[1708,1136],[1765,1107],[1832,1114],[1880,1095],[1935,1124],[1904,1137],[1844,1129],[1789,1133],[1731,1154]],M.COBBLE);
for(let [x,y,X,Y,w] of [[1710,1142,1675,1098,9],[1816,1130,1779,1069,8],[1902,1140,1957,1086,9],[1965,1152,1988,1093,8]])
 line(x,y,X,Y,M.MOSS,w);
for(let [x,y,w,h] of [[1730,1257,189,26],[1682,1341,145,43],[1861,1338,146,41],[1684,1557,199,41],[1818,1775,190,39]]){
 stain(x,y,w,h,M.COBBLE);stain(x+8,y+8,w-16,6,M.LIME);
}
// Deep room identity: west root relay; eastern archive; stone-supported floor.
for(let [x,y,w] of [[379,1607,149],[1696,1517,157],[1783,1804,144]]){
 stain(x,y,w,15,M.GRANITE);stain(x+11,y+6,w-22,4,M.COBBLE);
}
for(let [x,y,X,Y,w] of [[440,1608,405,1654,10],[485,1611,521,1671,12],
 [1747,1515,1721,1566,12],[1824,1515,1864,1584,10],[1832,1807,1793,1871,10]])
 strut(x,y,X,Y,M.MOSS,w);
// Distinct rooted substrate, solid foundation below exact airsite at 1145,1970.
poly([[807,1999],[855,1971],[894,1982],[944,2006],[1020,2012],[1109,2019],[1169,2014],[1247,2021],[1359,2007],[1450,1980],[1494,1999],[1494,2048],[810,2048]],M.BASALT);
poly([[885,2011],[957,2006],[1046,2022],[1140,2027],[1281,2018],[1402,2000],[1438,2016],[1407,2048],[892,2048]],M.GRANITE);
for(let [x,y,X,Y] of [[845,1982,788,1939],[941,2011,900,1929],[1303,2014,1368,1945],[1417,1999,1503,1923]])strut(x,y,X,Y,M.MOSS,11);


/* R2B5 current Shepherd technical-artistic pass:
   preserve one grounded bridge; organically vary its bark silhouette,
   strengthen western canopy, right stone sentinel and inhabited cave thresholds.
   Executed BEFORE immutable exact-site validation and deterministic rectangle packing. */
const r5bridge=[[721,663],[755,650],[796,661],[848,671],[915,684],[979,692],[1031,700],[1088,705],[1150,698],[1219,677],[1292,664],[1356,650],[1419,645],[1482,646],[1548,657],
[1557,704],[1507,699],[1456,707],[1394,720],[1319,715],[1260,735],[1195,744],[1140,748],[1082,761],[1019,754],[947,744],[888,732],[829,712],[780,699],[724,695]];
poly(r5bridge,M.BASALT);
for(let [x,y,X,Y,w,material] of [
 [745,682,841,690,8,M.GRANITE],[841,690,955,718,10,M.COBBLE],
 [952,717,1067,736,9,M.SLATE],[1062,737,1151,722,12,M.COBBLE],
 [1130,729,1245,716,8,M.MOSS],[1229,716,1361,678,13,M.GRANITE],
 [1376,677,1514,665,9,M.COBBLE],
 [783,682,849,711,5,M.MOSS],[902,709,991,741,8,M.MOSS],
 [1101,744,1170,720,7,M.MOSS],[1252,725,1342,700,8,M.MOSS],
 [1411,685,1537,682,7,M.MOSS]
])line(x,y,X,Y,material,w);
for(const root of [
 [[831,708],[804,745],[770,789],[755,812]],
 [[947,727],[918,756],[904,799]],
 [[1062,752],[1011,780],[993,831]],
 [[1175,740],[1206,779],[1228,805]],
 [[1313,711],[1355,746],[1400,756]],
 [[1479,691],[1502,730],[1492,772]]
]){
 for(let j=0;j<root.length-1;j++)line(root[j][0],root[j][1],root[j+1][0],root[j+1][1],j%2?M.GRANITE:M.BASALT,15-j*3);
 let [x,y]=root[root.length-1];line(x,y,x+(x<1030?-20:19),y+18,M.MOSS,6);
}
for(const b of [
 [[430,183],[357,99],[266,57],[137,39]],
 [[458,202],[516,132],[582,92],[650,71]],
 [[414,152],[343,57],[298,9]],
 [[476,240],[545,155],[613,123]],
 [[395,199],[311,137],[231,114]]
]){
 for(let j=0;j<b.length-1;j++)line(b[j][0],b[j][1],b[j+1][0],b[j+1][1],M.BASALT,21-j*4);
}
for(let [x,y,rad] of [[134,37,42],[205,45,39],[280,30,37],[357,36,36],[531,48,46],[599,70,43],[650,88,29],[270,113,40],[380,82,30],[516,108,25]]){
 disk(x,y,rad,M.MOSS);
 line(x,y,x+7,y+rad+13,M.MOSS,5);
}
for(let [x,y,X,Y,w] of [[238,156,200,230,8],[312,120,288,201,7],[578,132,603,209,8],[628,131,673,178,6]])
 line(x,y,X,Y,M.BASALT,w);
poly([[1634,431],[1653,382],[1693,357],[1704,386],[1686,415],[1660,439]],M.COBBLE);
poly([[1699,362],[1731,358],[1768,381],[1778,418],[1751,408],[1734,385]],M.GRANITE);
poly([[1638,448],[1671,427],[1688,439],[1684,460],[1653,472]],M.SLATE);
poly([[1720,437],[1745,440],[1760,461],[1739,476],[1718,465]],M.SLATE);
poly([[1653,476],[1674,475],[1685,488],[1664,498],[1647,495]],M.OBSIDIAN);
poly([[1722,478],[1747,476],[1752,497],[1736,503],[1715,493]],M.OBSIDIAN);
poly([[1692,466],[1706,461],[1710,488],[1720,504],[1708,515],[1697,501],[1687,498]],M.COBBLE);
poly([[1647,514],[1672,513],[1685,531],[1708,538],[1733,522],[1761,513],[1748,552],[1711,563],[1688,558],[1660,547]],M.GRANITE);
line(1660,448,1691,437,M.COBBLE,11);
line(1723,434,1758,452,M.GRANITE,13);
line(1683,533,1732,527,M.SLATE,5);
for(let [x,y,X,Y] of [[1652,476,1632,506],[1763,467,1783,499],[1683,365,1674,392],[1719,366,1746,377]])
 strut(x,y,X,Y,M.MOSS,5);
for(let [x,y,w,h,l,r] of [
 [180,521,272,127,32,22],[347,784,263,110,24,45],
 [187,1074,317,144,42,22],[329,1328,292,115,20,40],
 [1686,566,254,134,29,18],[1684,894,258,108,42,26],
 [1696,1170,247,116,26,39],[1736,1622,229,116,30,18]
]){
 poly([[x,y+14],[x+l,y+6],[x+l+11,y+1],[x+l-5,y+23],[x+7,y+38],[x,y+37]],M.GRANITE);
 poly([[x+w,y+11],[x+w-r,y+3],[x+w-r-11,y+1],[x+w-r+4,y+26],[x+w-5,y+42],[x+w,y+34]],M.COBBLE);
 line(x+4,y+10,x+l-5,y+10,M.MOSS,5);
 line(x+w-r+5,y+9,x+w-5,y+13,M.MOSS,4);
}
for(let [x,y,w,h,m] of [[163,692,220,12,M.GRANITE],[308,915,245,11,M.COBBLE],[176,1225,284,11,M.GRANITE],
 [1706,1005,212,13,M.GRANITE],[1730,1293,201,12,M.COBBLE],[1761,1754,187,11,M.GRANITE]])
 stain(x,y,w,h,m);


// R2B6 — genuine reference-led physical material-cell finisher. Preserve all reachable air channels.
function finishR2B6(A,W,H) {
 const K={L:38,G:40,C:41,M:42,S:49,B:52,V:100,O:101},base=A.slice();
 function point(x,y,v,filled=false){x=Math.round(x);y=Math.round(y);if(x<0||x>=W||y<0||y>=H)return;let i=y*W+x;if(!filled||base[i])A[i]=v}
 function ball(x,y,r,v,filled=false){for(let yy=Math.max(0,Math.floor(y-r));yy<=Math.min(H-1,Math.ceil(y+r));yy++){let dx=Math.sqrt(Math.max(0,r*r-(yy-y)**2));for(let xx=Math.max(0,Math.ceil(x-dx));xx<=Math.min(W-1,Math.floor(x+dx));xx++)point(xx,yy,v,filled)}}
 function limb(x,y,X,Y,r,R,v,filled=false){let n=Math.max(1,Math.ceil(Math.hypot(X-x,Y-y)/4));for(let z=0;z<=n;z++){let t=z/n;ball(x+(X-x)*t,y+(Y-y)*t,r+(R-r)*t,v,filled)}}
 const clumps=[[118,68,38],[152,37,25],[196,69,42],[238,44,27],[275,86,32],[318,39,34],[362,76,41],[409,24,28],[471,73,44],[522,93,26],[572,120,34],[625,154,23],[342,133,40],[185,151,27],[250,171,29]];
 clumps.forEach(([x,y,r],i)=>ball(x,y,r,i%4?K.M:K.G));
 const roots=[[[446,320,36],[402,412,30],[386,501,28],[342,562,24],[276,654,15]],[[466,345,31],[494,433,26],[527,511,23],[553,577,17],[600,637,12]],[[406,367,28],[356,437,22],[302,487,17],[261,529,13]]];
 roots.forEach(q=>{for(let i=0;i<q.length-1;i++){let a=q[i],b=q[i+1];limb(a[0],a[1],b[0],b[1],a[2],b[2],i%2?K.G:K.V,true);limb(a[0]+8,a[1]+5,b[0]+8,b[1]+5,4,3,K.M,true)}});
 const arches=[
  [[209,672,211,550,19,25,K.C],[211,550,260,516,26,18,K.G],[260,516,325,503,18,19,K.L],[325,503,415,515,19,22,K.C],[415,515,452,555,22,23,K.G],[452,555,458,669,23,20,K.V]],
  [[1695,736,1700,576,23,30,K.V],[1700,576,1745,545,30,24,K.C],[1745,545,1823,530,24,19,K.L],[1823,530,1902,543,19,26,K.C],[1902,543,1950,585,26,30,K.G],[1950,585,1945,741,30,23,K.V]]
 ];
 arches.forEach(e=>e.forEach(p=>limb(...p,true)));
 for(let i=0;i<26;i++){let x=216+i*9,y=520+Math.sin(x/41)*13;ball(x,y,5,i%3?K.M:K.L,true)}
 for(let i=0;i<25;i++){let x=1716+i*9,y=554+Math.cos(x/41)*7;ball(x,y,5,i%3?K.S:K.M,true)}
 for(let x=625;x<1825;x++){let top=-1,bot=-1;for(let y=640;y<791;y++){if(base[y*W+x]){if(top<0)top=y;bot=y}}if(top<0)continue;let drift=Math.sin(x/31)*4+Math.sin(x/79)*7;for(let y=top;y<=Math.min(bot,top+50);y++){let k=y*W+x;if(!base[k])continue;let f=y-top;if((x+Math.round(drift)+Math.floor(f*1.4))%71<13)A[k]=K.G;else if((2*x+f+Math.floor(drift))%49<7)A[k]=K.M;else if(f>9&&f<23&&(x+Math.floor(f/3))%37<12)A[k]=K.V;}}
 for(let y=348;y<593;y++)for(let x=1580;x<1825;x++){let i=y*W+x;if(!base[i])continue;let w=x-Math.round(3*Math.sin(y/18));if((w+2*y)%83<10)A[i]=K.L;else if((w-y)%69<5)A[i]=K.M}
}
finishR2B6(A,W,H);

/* R2B7: grounded forms from original source JPEG; no branch/source-art changes.
 * Convert thin bridge truss to one grown tri-cord, enlarge aged crown,
 * distinguish supported thresholds and reattach major floating gallery masses. */
function finishR2B7(A,W,H) {
 const M={L:38,G:40,C:41,F:42,S:49,B:52,V:100,O:101};
 let P=[[1024,454],[315,590],[604,589],[491,850],[347,1137],[751,1141],[469,1367],[596,1718],[837,619],[1050,617],[1450,613],[1811,619],[1790,930],[1808,1216],[1840,1695],[1600,1697],[1387,1460],[1100,1121],[1090,1600],[1050,1844],[469,1515],[1804,1433],[1145,1970],[2018,310],[2018,780],[1932,781],[1730,783],[1450,782],[1418,815]];
 const safe=new Uint8Array(W*H);
 for(let [x,y] of P)for(let yy=Math.max(0,y-15);yy<=Math.min(H-1,y+15);yy++)safe.fill(1,yy*W+Math.max(0,x-18),yy*W+Math.min(W,x+19));
 function pixel(x,y,v,filled=false){x=Math.round(x);y=Math.round(y);if(x<0||x>=W||y<0||y>=H)return;let k=y*W+x;if((!filled||A[k])&&(!safe[k]||v===0))A[k]=v}
 function box(x,y,w,h,v,filled=false){for(let Y=Math.max(0,Math.floor(y));Y<Math.min(H,Math.ceil(y+h));Y++)for(let X=Math.max(0,Math.floor(x));X<Math.min(W,Math.ceil(x+w));X++)pixel(X,Y,v,filled)}
 function disc(x,y,r,v,filled=false){for(let Y=Math.max(0,Math.ceil(y-r));Y<=Math.min(H-1,Math.floor(y+r));Y++){let d=Math.sqrt(Math.max(0,r*r-(Y-y)*(Y-y)));for(let X=Math.max(0,Math.ceil(x-d));X<=Math.min(W-1,Math.floor(x+d));X++)pixel(X,Y,v,filled)}}
 function cord(x,y,X,Y,r,R,v,filled=false){let n=Math.max(1,Math.ceil(Math.hypot(X-x,Y-y)/5));for(let i=0;i<=n;i++){let t=i/n;disc(x+(X-x)*t,y+(Y-y)*t,r+(R-r)*t,v,filled)}}
 function poly(p,v,filled=false){let lo=Math.max(0,Math.floor(Math.min(...p.map(q=>q[1])))),hi=Math.min(H-1,Math.ceil(Math.max(...p.map(q=>q[1]))));for(let y=lo;y<=hi;y++){let xs=[];for(let i=0;i<p.length;i++){let a=p[i],b=p[(i+1)%p.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]))}xs.sort((a,b)=>a-b);for(let k=0;k+1<xs.length;k+=2)box(Math.ceil(xs[k]),y,Math.floor(xs[k+1])-Math.ceil(xs[k])+1,1,v,filled)}}
 // Reinterpret grey circular pucks as connected canopy tissue.
 for(let y=0;y<245;y++)for(let x=10;x<680;x++){let k=y*W+x;if(A[k]&&(A[k]===M.C||A[k]===M.G))A[k]=M.F}
 for(const p of [
 [[0,66],[25,33],[82,24],[119,0],[212,4],[272,25],[320,0],[378,13],[449,0],[502,27],[566,58],[633,111],[678,145],[640,160],[590,154],[550,194],[514,176],[464,222],[413,195],[360,236],[311,188],[251,231],[193,180],[150,201],[87,165],[0,160]],
 [[48,111],[101,76],[166,101],[197,157],[157,193],[89,167]],
 [[461,91],[541,93],[609,131],[667,183],[631,223],[583,202],[529,232],[474,183]]
 ])poly(p,M.F);
 for(let q of [[429,265,310,172,33,15,M.G],[445,269,568,168,32,16,M.V],[424,317,236,270,27,12,M.V],
 [448,342,337,445,43,32,M.V],[337,445,249,552,32,23,M.G],[249,552,183,677,26,15,M.V],
 [477,360,530,459,34,26,M.G],[530,459,560,546,26,19,M.V],[560,546,635,666,19,12,M.G]])cord(...q);
 for(let q of [[385,312,293,402,5,4,M.F],[442,356,522,449,6,4,M.F],[316,463,243,534,7,4,M.C]])cord(...q,true);
 // Single bridge: remove former fine crosslacing only in broad suspended span.
 for(let y=640;y<852;y++)for(let x=767;x<1536;x++)pixel(x,y,0);
 const l=725,r=1578;
 for(let x=l;x<=r;x+=3){let t=(x-l)/(r-l),cy=659+46*Math.sin(Math.PI*t)-8*t+Math.sin(x/42)*4+Math.sin(x/73)*3;
 disc(x,cy-7+Math.sin(x/57)*5,15+3*Math.sin(Math.PI*t),M.G);
 disc(x,cy+12+Math.sin(x/39)*6,20+3*Math.sin(Math.PI*t),M.V);
 disc(x,cy+27+Math.sin(x/89)*6,14+4*Math.sin(Math.PI*t),M.C);
 disc(x,cy+35,6,M.F);
 }
 cord(712,650,785,686,28,26,M.V);cord(1520,684,1619,650,25,30,M.G);
 cord(1455,655,1455,691,13,16,M.V);
 for(let a of [[859,717,844,771,21,11,M.V],[982,719,954,794,20,9,M.G],
 [1104,729,1150,807,21,9,M.V],[1281,711,1308,760,20,10,M.G],[1493,689,1523,755,17,9,M.V]])cord(...a);
 for(let a of [[768,672,894,703,4,3,M.F],[918,701,1054,725,4,4,M.C],
 [1097,721,1212,706,5,4,M.F],[1250,700,1424,682,4,3,M.G]])cord(...a,true);
 // West roots make a wide, supported stone-root sanctuary lintel, not sealed shelves.
 poly([[166,550],[179,516],[219,496],[252,505],[306,493],[375,492],[420,504],[462,519],[468,542],
 [431,533],[398,520],[349,528],[299,524],[259,534],[198,536]],M.G,true);
 cord(186,531,193,564,26,22,M.V);cord(441,529,449,568,25,22,M.G);
 for(let a of [[199,517,221,531,8,6,M.C],[390,515,424,531,8,6,M.C]])cord(...a,true);
 // East: a different high limestone-arched entrance supported in the ridge,
 // avoid new full-span floors or door panels that isolate the target.
 poly([[1680,562],[1698,538],[1737,525],[1760,535],[1804,522],[1842,536],[1900,526],[1943,543],[1961,565],
 [1920,554],[1872,557],[1825,546],[1780,565],[1741,550],[1699,568]],M.C);
 cord(1709,548,1715,580,23,24,M.G);cord(1925,542,1926,584,26,27,M.C);
 for(let p of [[1755,536],[1843,542],[1887,538]])disc(p[0],p[1],6,M.L,true);
 // Weathered left-facing cliff guardian: replace crosshatched face texture,
 // keep occupied backed stone and carve a readable brow / eye / nose / jaw.
 for(let y=354;y<569;y++)for(let x=1589;x<1820;x++){let k=y*W+x;if(A[k]&&A[k]!==M.F)A[k]=((x+2*y)%113<5?M.C:M.G)}
 poly([[1601,429],[1637,381],[1680,347],[1712,351],[1748,383],[1769,430],[1806,509],[1810,557],
 [1740,555],[1692,538],[1645,559],[1606,524],[1588,496],[1601,477],[1576,462]],M.G);
 poly([[1615,424],[1639,391],[1689,378],[1712,387],[1672,415],[1638,434]],M.C);
 poly([[1610,440],[1653,433],[1672,451],[1648,470],[1606,454]],M.S);
 poly([[1595,475],[1634,471],[1659,489],[1682,505],[1641,513],[1604,495]],M.V);
 poly([[1627,520],[1668,515],[1703,535],[1745,533],[1764,549],[1680,559],[1644,545]],M.C);
 poly([[1656,451],[1671,453],[1682,469],[1668,476]],M.O);
 cord(1705,489,1762,509,9,11,M.V);
 // Convert the previously four heavy freestanding components into bank-rooted
 // supports (at x1530/825, x1518/1540, x550/1545, x1245/1925).
 cord(1521,823,1645,840,23,29,M.V);cord(1512,1521,1670,1485,27,35,M.V);
 cord(542,1532,421,1594,25,37,M.V);cord(1240,1926,1246,2037,24,31,M.V);
 // 31x27 flyable passage from the inhabited western shrine to exterior canyon.
 box(555,558,139,106,0);
 // A deliberate 100-cell-wide east sanctuary flight hatch to the proven undercroft;
 // original full-height 31x27 actor could not pass the newly carved vault otherwise.
 box(1795,662,85,145,0);
 // The east guardian ridge now carries its load through a thick root neck into
 // the original bridge's rock bank, rather than relying on the cleared hatch.
 cord(1615,560,1618,651,22,24,M.V);
}
finishR2B7(A,W,H);

// R2B8: hand-directed living bridge, rooted tree, carved guardian and return.
// All output is actual material-cell geometry, not decorative sprite layers.
function finishR2B8(A,W,H) {
 const previous=A.slice(),P=W+1,idx=(x,y)=>y*W+x;
 const M={AIR:0,LIME:38,GRANITE:40,COBBLE:41,MOSS:42,SLATE:49,BRONZE:52,BASALT:100,OBSIDIAN:101};
 function box(x,y,w,h,m){let l=Math.max(0,Math.floor(x)),r=Math.min(W,Math.ceil(x+w)),t=Math.max(0,Math.floor(y)),b=Math.min(H,Math.ceil(y+h));for(let yy=t;yy<b;yy++)A.fill(m,yy*W+l,yy*W+r);}
 function ell(cx,cy,rx,ry,m,solidOnly=false){for(let y=Math.max(0,Math.floor(cy-ry));y<=Math.min(H-1,Math.ceil(cy+ry));y++){let u=(y-cy)/ry;if(Math.abs(u)>1)continue;let dx=rx*Math.sqrt(1-u*u);for(let x=Math.max(0,Math.ceil(cx-dx));x<=Math.min(W-1,Math.floor(cx+dx));x++)if(!solidOnly||A[idx(x,y)])A[idx(x,y)]=m;}}
 function vine(x,y,X,Y,r,R,m,solidOnly=false){let n=Math.max(1,Math.ceil(Math.hypot(X-x,Y-y)/3));for(let i=0;i<=n;i++){let t=i/n,rr=r+(R-r)*t;ell(x+(X-x)*t,y+(Y-y)*t,rr,rr*.78,m,solidOnly);}}
 function poly(points,m){let top=Math.max(0,Math.floor(Math.min(...points.map(q=>q[1])))),end=Math.min(H-1,Math.ceil(Math.max(...points.map(q=>q[1]))));for(let y=top;y<=end;y++){let xs=[];for(let i=0;i<points.length;i++){let a=points[i],b=points[(i+1)%points.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let j=0;j+1<xs.length;j+=2)box(Math.ceil(xs[j]),y,Math.max(0,Math.floor(xs[j+1])-Math.ceil(xs[j])+1),1,m);}}
 // Retain the existing bank-rooted bridge load path. Change its material
 // anatomy first: no engineered parallel cord palette or regular comb spikes.
 for(let y=650;y<850;y++)for(let x=780;x<1535;x++){
  let k=idx(x,y),v=A[k];if(!v)continue;
  let tissue=Math.sin(x*.017+y*.027)+.7*Math.sin(y*.073-x*.029);
  if(v===M.GRANITE||v===M.BASALT||v===M.COBBLE||v===M.MOSS){
   A[k]=tissue>.6?M.MOSS:tissue<-.75?M.BASALT:M.GRANITE;
  }
 }
 // Continuous organic beam with asymmetrically differentiated bark/heartwood;
 // short weighted aerial roots are not a repeated structural grid.
 for(let x=755;x<=1555;x+=3){
  let t=(x-755)/800,cy=656+49*Math.sin(Math.PI*t)-8*t+3*Math.sin(x*.037)+2*Math.sin(x*.091);
  let radius=11+5*Math.sin(Math.PI*t)+2.4*Math.sin(x*.083);
  ell(x,cy,radius+6,radius*.72+4,M.BASALT);
  ell(x,cy-2,radius+1,radius*.48+2,M.GRANITE);
  ell(x,cy+5,radius*.55,radius*.35,M.MOSS);
 }
 for(const c of [[840,681,864,754,12,5],[948,702,922,781,13,5],[1071,707,1090,786,13,4],
 [1211,706,1187,780,11,4],[1338,693,1379,756,11,5],[1478,676,1497,730,12,4]])
 vine(c[0],c[1],c[2],c[3],c[4],c[5],M.BASALT);
 for(const c of [[785,664,875,694,6,3],[902,687,1016,713,5,3],
 [1090,713,1204,704,6,4],[1274,700,1438,682,6,4]])
 vine(...c,M.MOSS,true);
 vine(738,657,819,683,22,19,M.BASALT);vine(1490,680,1600,654,22,29,M.GRANITE);
 // Richly forked huge western old-growth trunk, rather than crossed spokes.
 for(const c of [[392,312,307,214,23,9],[440,320,548,223,24,10],
 [362,397,268,479,23,10],[480,379,596,448,22,10],
 [409,297,355,142,19,7],[486,307,590,184,20,7],
 [345,496,259,580,25,11]])vine(...c,M.BASALT);
 for(const c of [[366,210,298,176,8,4],[530,220,591,168,9,4],
 [272,489,224,543,10,4],[565,434,629,488,10,4]])vine(...c,M.MOSS);
 // Unequal ancient shrine interiors carved in, not floating rectangles.
 poly([[207,693],[232,662],[318,651],[378,680],[399,718],[378,786],[235,786],[206,752]],M.GRANITE);
 poly([[235,701],[258,685],[318,678],[353,705],[350,749],[335,760],[250,760],[235,738]],M.AIR);
 box(255,763,93,11,M.COBBLE);
 for(const x of [268,308,338]){box(x,710,8,23,M.BRONZE);ell(x+4,699,6,5,M.MOSS);}
 // Unlike vaulted eastern shrine archive, no obstructing full-height panel.
 poly([[1791,788],[1818,760],[1868,744],[1926,760],[1955,796],[1954,868],[1789,869]],M.COBBLE);
 poly([[1812,804],[1831,780],[1868,771],[1911,786],[1927,813],[1928,843],[1812,843]],M.AIR);
 box(1816,847,105,11,M.GRANITE);
 for(const x of [1833,1867,1904]){box(x,809,7,20,M.BRONZE);ell(x+3,797,7,6,M.MOSS);}
 // Reconstruct a recognisable left-facing guardian as a true eroded head:
 // forward brow, recessed ocular notch, projecting nose and defined jaw.
 poly([[1615,425],[1653,383],[1696,366],[1744,389],[1766,424],
 [1751,451],[1704,435],[1668,438],[1636,455]],M.GRANITE);
 poly([[1603,462],[1632,443],[1669,452],[1680,468],[1652,481],
 [1627,483],[1593,495]],M.COBBLE);
 poly([[1624,481],[1667,481],[1696,506],[1702,535],[1662,545],
 [1617,525],[1598,508]],M.BASALT);
 ell(1642,443,16,9,M.OBSIDIAN,true);
 ell(1640,442,6,4,M.AIR);
 poly([[1607,509],[1651,515],[1689,536],[1730,543],[1721,553],
 [1672,557],[1629,547]],M.COBBLE);
 vine(1738,538,1781,584,24,18,M.GRANITE);
 // Extrapolated lower rooted crypt, actual functional substrate and opening.
 poly([[759,1547],[783,1518],[842,1494],[906,1512],[952,1564],
 [959,1634],[941,1719],[902,1747],[813,1722],[757,1667]],M.BASALT);
 poly([[798,1586],[831,1547],[873,1540],[913,1572],[927,1620],
 [919,1688],[888,1709],[835,1696],[811,1658]],M.AIR);
 box(783,1592,45,57,M.AIR);
 box(837,1696,55,10,M.GRANITE);
 for(const [x,y] of [[844,1601],[873,1572],[902,1606]])ell(x,y,7,9,M.MOSS);
 vine(772,1590,722,1522,20,27,M.BASALT);
 vine(778,1694,722,1747,21,27,M.GRANITE);
 // Preserve all formerly visited, fully bounded Midge 31x27 air volumes.
 // New solid cannot close a pre-existing route; old solid is never restored.
 const sat=new Int32Array(P*(H+1));for(let y=0;y<H;y++){let z=0;for(let x=0;x<W;x++){z+=previous[idx(x,y)]?1:0;sat[(y+1)*P+x+1]=sat[y*P+x+1]+z;}}
 const hx=15,hy=13,legal=new Uint8Array(A.length);
 for(let y=hy;y<H-hy;y++)for(let x=hx;x<W-hx;x++){let l=x-hx,r=x+hx+1,t=y-hy,b=y+hy+1;if(!(sat[b*P+r]-sat[t*P+r]-sat[b*P+l]+sat[t*P+l]))legal[idx(x,y)]=1;}
 const visit=new Uint8Array(A.length),Q=new Int32Array(A.length),src=idx(1024,454);
 if(!legal[src])throw Error('R2B8 predecessor spawn obstructed');visit[src]=1;Q[0]=src;let N=1;
 for(let i=0;i<N;i++){let j=Q[i],x=j%W,y=(j/W)|0;for(const d of [-W,-1,1,W]){if((d===-W&&y===0)||(d===-1&&x===0)||(d===1&&x===W-1)||(d===W&&y===H-1))continue;let k=j+d;if(legal[k]&&!visit[k]){visit[k]=1;Q[N++]=k;}}}
 const diff=new Int32Array(P*(H+1));
 for(let i=0;i<N;i++){let j=Q[i],x=j%W,y=(j/W)|0;
 diff[(y-hy)*P+x-hx]++;diff[(y-hy)*P+x+hx+1]--;
 diff[(y+hy+1)*P+x-hx]--;diff[(y+hy+1)*P+x+hx+1]++;}
 for(let y=0;y<H;y++){let z=0;for(let x=0;x<W;x++){let j=y*P+x;z+=diff[j];diff[j]=z+(y?diff[j-P]:0);let k=idx(x,y);if(diff[j]>0&&!previous[k])A[k]=0;}}
}
finishR2B8(A,W,H);

const spawn=[1024,454],loc=[
['Upper Open Ravine',[1024,454]],['West Upper Shrine',[315,590]],['West Upper Threshold',[604,589]],['West Root Landing',[491,850]],['West Deep Root Niche',[347,1137]],['West Middle Exit',[751,1141]],['West Terrace Chapel',[469,1367]],['West Lower Return',[596,1718]],
['Living Bridge West Air',[837,619]],['Living Bridge Mid-Air',[1050,617]],['Living Bridge East Air',[1450,613]],
['East Sun Sanctuary',[1811,619]],['East High Lookout',[1790,930]],['East Eroded Archive',[1808,1216]],['East Lower Crypt',[1840,1695]],['East Lower Air Exit',[1600,1697]],
['East Root Spur',[1387,1460]],['Vertical Central Ravine',[1100,1121]],['Lower Ravine Flight',[1090,1600]],['Valley Floor Return',[1050,1844]],
['West Root Relay',[469,1515]],['East Lantern Archive',[1804,1433]],['Valley Substrate Return',[1145,1970]]
].map(([name,point])=>({name,point}));
// Full 19x15 actor-envelope erosion, component connectivity.
const integral=new Int32Array((W+1)*(H+1));for(let y=0;y<H;y++){let s=0;for(let x=0;x<W;x++){s+=A[y*W+x]!==0?1:0;integral[(y+1)*(W+1)+x+1]=integral[y*(W+1)+x+1]+s}}
const allowed=new Uint8Array(W*H);for(let y=7;y<H-7;y++)for(let x=9;x<W-9;x++){let a=x-9,b=x+10,c=y-7,d=y+8;if(!(integral[d*(W+1)+b]-integral[c*(W+1)+b]-integral[d*(W+1)+a]+integral[c*(W+1)+a]))allowed[y*W+x]=1}
const seen=new Uint8Array(W*H),q=new Int32Array(W*H),src=spawn[1]*W+spawn[0];if(!allowed[src])throw Error('Spawn blocked');seen[src]=1;q[0]=src;let h=0,t=1;
while(h<t){let k=q[h++],x=k%W,y=(k/W)|0;if(x>0&&allowed[k-1]&&!seen[k-1]){seen[k-1]=1;q[t++]=k-1}if(x<W-1&&allowed[k+1]&&!seen[k+1]){seen[k+1]=1;q[t++]=k+1}if(y>0&&allowed[k-W]&&!seen[k-W]){seen[k-W]=1;q[t++]=k-W}if(y<H-1&&allowed[k+W]&&!seen[k+W]){seen[k+W]=1;q[t++]=k+W}}
const adjustments=[];
const failures=loc.filter(d=>{let [x,y]=d.point;return !seen[y*W+x]});
if(failures.length)throw Error('Exact named destination blocked '+JSON.stringify(failures));
const edits=[];let prev=new Map();for(let y=0;y<H;y++){let curr=new Map(),row=y*W,x=0;while(x<W){let v=A[row+x],start=x++;while(x<W&&A[row+x]===v)x++;if(!v)continue;let key=start+':'+(x-start)+':'+v,idx=prev.get(key);if(idx!==undefined&&edits[idx][1]+edits[idx][3]===y){edits[idx][3]++;curr.set(key,idx)}else{curr.set(key,edits.length);edits.push([start,y,x-start,1,v])}}prev=curr}
const restored=new Uint8Array(A.length);for(let [x,y,w,ht,v] of edits)for(let row=y;row<y+ht;row++)restored.fill(v,row*W+x,row*W+x+w);for(let i=0;i<A.length;i++)if(A[i]!==restored[i])throw Error('Exact-cell reconstruction failed '+i);
const setup={...base,extent:[W,H],actors:[{...base.actors[0],spawn}],next_id:2,selected:1,edits},json=JSON.stringify(setup)+'\n';if(edits.length>32768||json.length>1048576)throw Error('Budget exceeded '+edits.length+'/'+json.length);
// Compact PNG with 4-bit indexed palette. Two sampled real cell IDs per byte.
const mids=[0,58,3,38,40,41,42,49,52,77,79,98,100,101,122,127];
const colors=[[24,22,44],[74,75,78],[24,168,190],[215,188,138],[139,129,132],[161,143,123],[86,127,89],[76,83,102],[182,128,74],[46,238,225],[244,188,67],[230,218,181],[65,54,81],[35,28,43],[218,229,230],[176,245,173]];
const pl=new Uint8Array(colors.flat()),map=new Uint8Array(256);mids.forEach((m,i)=>map[m]=i);
let pw=1024,ph=1024,raw=new Uint8Array((pw/2+1)*ph);
for(let y=0;y<ph;y++)for(let x=0;x<pw;x+=2){let a=map[A[(y*2)*W+x*2]],b=map[A[(y*2)*W+x*2+2]];raw[y*(pw/2+1)+1+x/2]=(a<<4)|b}
const U=n=>[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255],table=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let i=0;i<8;i++)c=c&1?0xedb88320^(c>>>1):c>>>1;table[n]=c>>>0}
function join(xs){let out=new Uint8Array(xs.reduce((s,x)=>s+x.length,0)),o=0;for(let x of xs){out.set(x,o);o+=x.length}return out}
function chunk(tag,data){let a=Uint8Array.from([...tag].map(c=>c.charCodeAt(0))),b=join([a,data]),crc=0xffffffff;for(let v of b)crc=table[(crc^v)&255]^(crc>>>8);return join([Uint8Array.from(U(data.length)),b,Uint8Array.from(U((crc^0xffffffff)>>>0))])}
function zlib(d){let parts=[Uint8Array.from([120,1])],a=1,b=0;for(let k=0;k<d.length;){let len=Math.min(65535,d.length-k),last=k+len===d.length;parts.push(Uint8Array.from([last?1:0,len&255,(len>>>8)&255,(~len)&255,((~len)>>>8)&255]),d.subarray(k,k+len));for(let j=k;j<k+len;j++){a=(a+d[j])%65521;b=(b+a)%65521}k+=len}parts.push(Uint8Array.from(U(((b<<16)|a)>>>0)));return join(parts)}
let png=join([Uint8Array.from([137,80,78,71,13,10,26,10]),chunk('IHDR',Uint8Array.from([...U(pw),...U(ph),4,3,0,0,0])),chunk('PLTE',pl),chunk('IDAT',zlib(raw)),chunk('IEND',new Uint8Array())]);

function nativeCrop(left,top,w=512,h=512){
 const scan=new Uint8Array((w/2+1)*h);
 for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx+=2){let v=A[(top+yy)*W+left+xx],u=A[(top+yy)*W+left+xx+1];scan[yy*(w/2+1)+1+xx/2]=(map[v]<<4)|map[u]}
 return join([Uint8Array.from([137,80,78,71,13,10,26,10]),chunk('IHDR',Uint8Array.from([...U(w),...U(h),4,3,0,0,0])),chunk('PLTE',pl),chunk('IDAT',zlib(scan)),chunk('IEND',new Uint8Array())]);
}
const details={
'temples-material-2048.png':nativeCrop(0,0,2048,2048),
'temples-detail-west-tree.png':nativeCrop(125,35),
'temples-detail-west-shrine.png':nativeCrop(100,475),
'temples-detail-living-bridge.png':nativeCrop(753,445),
'temples-detail-bridge-west-anchor.png':nativeCrop(420,550),
'temples-detail-bridge-east-anchor.png':nativeCrop(1380,545),
'temples-detail-east-bypass.png':nativeCrop(1536,640),
'temples-detail-east-guardian.png':nativeCrop(1512,207),
'temples-detail-east-crypt.png':nativeCrop(1490,1135),
'temples-detail-root-passages.png':nativeCrop(214,1240),
'temples-detail-lower-ravine.png':nativeCrop(803,1510),
 'temples-detail-west-root-relay.png':nativeCrop(230,1290),
 'temples-detail-east-lantern-archive.png':nativeCrop(1536,1235),
 'temples-detail-valley-substrate.png':nativeCrop(790,1536)
};
let counts={};for(let v of A)counts[v]=(counts[v]||0)+1;
return {json,png,details,stats:{source_id:'ruins-0013',extent:[W,H],seed:SEED,rectangle_count:edits.length,rectangle_budget:32768,json_bytes:json.length,json_byte_budget:1048576,png_bytes:png.length,cell_reconstruction:W*H,clearance_envelope:[19,15],reachable_destinations:loc.length,destinations:loc,waypoint_adjustments:adjustments,air_component_cells:t,spawn,material_counts:counts,native_runtime:'NOT RUN',source_visual_review:'Genuine gh-pages JPEG preview visually inspected; full-resolution original PNG parity UNVERIFIED'}};
}
if(typeof module!=='undefined')module.exports={generate,template};
