'use strict';
// ORIGINAL author-designed, strictly 2-D perpendicular side elevation, no source image.
// Yardarm-6 Inertial Purge Works, fixed-seed material-ID world.
const W=2048,H=1024,SEED=26112079;
const SITES=[
 ['Midge arrival lock',211,424],['Freight assay',312,460],['Lower freight return',310,855],
 ['Brine sightbridge',554,427],['Cold cartridge approach',704,518],['Separator underflow',747,856],
 ['Bell west mouth',886,533],['Inertial waist',1035,527],['Sky diversion',1049,193],
 ['Bell drain recovery',1140,852],['Ceramic retort inlet',1342,473],['Isolator controls',1492,535],
 ['Upper purge manifold',1572,381],['Filter station',1815,458],
 ['Dry-media salvage',1904,844],['Emergency egress',1972,449]
];
const CROPS=[
 ['01-freight',28,208,392,704],['02-brine',408,286,418,626],
 ['03-inertial-bell',816,163,412,744],['04-retort',1226,279,414,625],
 ['05-exhaust',1636,227,406,684],['06-lower-recovery',480,745,1120,260]
];
const COLORS={0:[8,11,18],3:[47,127,210],8:[241,78,31],58:[111,118,126],
62:[138,151,166],68:[102,124,135],70:[211,207,183],76:[230,186,41],
77:[25,211,220],79:[250,168,44],100:[54,56,61],101:[24,19,32],
104:[200,152,98],117:[124,134,149],120:[134,189,197]};
function materialWorld(){
 const g=new Uint8Array(W*H);let s=SEED>>>0;
 const random=()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return(s>>>0)/4294967296};
 const R=(x,y,w,h,m)=>{x=Math.max(0,Math.floor(x));y=Math.max(0,Math.floor(y));const X=Math.min(W,Math.floor(x+w)),Y=Math.min(H,Math.floor(y+h));for(let j=y;j<Y;j++)g.fill(m,j*W+x,j*W+X)};
 const L=(x,y,X,Y,t,m)=>{let n=Math.ceil(Math.max(Math.abs(X-x),Math.abs(Y-y))/2);for(let k=0;k<=n;k++){let q=k/Math.max(1,n);R(x+(X-x)*q-t/2,y+(Y-y)*q-t/2,t,t,m)}};
 const F=(x,y,w,h,t,m)=>{R(x,y,w,t,m);R(x,y+h-t,w,t,m);R(x,y,t,h,m);R(x+w-t,y,t,h,m)};
 const P=(x,y,w)=>R(x,y,w,925-y,58);
 const T=(x,y,w,h,fluid,m)=>{R(x-13,y-13,w+26,h+26,m);R(x,y,w,h,fluid)};
 // Stratified, bottom-anchored inert terrain and accessible dry lower return.
 for(let x=0;x<W;x+=8){let y=947+Math.round(9*Math.sin(x/115));R(x,y,8,H-y,100)}
 R(0,921,W,18,58);R(0,1006,W,18,58);
 for(let x=16;x<W;x+=121)R(x,939,15,68,58);
 R(365,889,1355,13,62);
 for(let x=385;x<1700;x+=147){R(x,901,14,21,58);R(x+20,911,44,9,117)}
 // I. Asymmetrically loaded decontamination lifting crane and entered freight assay.
 P(82,484,22);P(365,499,23);R(104,602,264,14,62);R(100,770,268,14,117);
 L(84,493,158,259,20,58);L(158,259,372,351,21,62);L(372,351,378,503,20,58);
 R(154,270,12,337,68);R(143,365,27,13,76);R(106,519,259,11,62);
 L(113,613,167,690,12,58);L(167,690,342,690,12,58);L(342,690,353,613,12,58);
 F(208,632,81,43,8,62);R(221,663,51,8,120);
 R(205,675,13,95,58);R(279,675,13,95,58);R(176,677,151,12,70);
 R(134,618,12,53,58);R(134,621,67,9,68);R(189,630,11,29,76);
 R(316,619,12,50,58);R(294,625,34,9,68);R(294,634,10,23,76);
 R(118,786,13,41,58);R(118,816,80,10,70);F(148,782,49,30,6,117);R(157,805,30,6,77);
 R(335,783,13,43,58);R(284,816,61,10,68);F(298,788,39,26,6,70);R(306,808,21,6,79);
 // II. Independently sealed, unequal horizontal cold fractionators and entered dry workfaces.
 P(411,519,20);P(795,564,22);
 L(418,530,518,354,18,58);L(518,354,804,403,17,62);L(804,403,805,565,18,58);
 R(432,617,375,13,62);R(445,797,342,14,117);
 L(438,635,494,794,12,58);L(803,635,734,794,12,58);
 T(477,687,138,70,3,58);T(669,700,102,57,3,62);
 R(481,772,148,13,68);R(656,773,122,13,68);
 R(500,785,13,12,58);R(600,785,13,12,58);R(674,786,13,12,62);R(752,786,13,12,62);
 R(465,630,13,44,58);R(466,637,93,11,70);F(512,603,44,31,6,117);R(526,625,21,6,77);
 R(664,644,13,39,58);R(666,650,100,10,68);F(705,609,53,33,6,70);R(718,635,25,6,79);
 R(448,852,177,13,62);R(461,813,13,39,58);R(610,812,13,40,58);
 F(503,816,60,29,6,70);R(515,837,35,6,120);R(533,845,10,11,58);
 // III. Monumental twin funnel with separate upper flight and genuine hollow waist.
 P(836,790,22);P(1192,788,23);
 L(844,790,939,580,20,58);L(1202,790,1101,579,20,58);
 L(939,580,939,449,19,62);L(1101,579,1101,459,19,62);
 L(939,449,856,305,18,58);L(1101,459,1161,279,20,58);
 L(856,305,987,238,18,62);L(987,238,1161,279,18,62);
 R(848,312,20,126,58);R(1148,282,19,167,58);
 R(847,735,355,14,62);R(854,807,351,14,117);
 R(868,685,103,12,68);R(867,696,13,38,58);
 R(1060,687,123,12,70);R(1170,699,13,35,58);
 R(936,754,12,53,58);R(936,766,93,10,62);
 F(969,723,54,33,6,117);R(982,749,25,6,77);
 R(1074,755,12,52,58);R(1074,769,94,10,62);
 F(1091,728,61,30,6,70);R(1108,750,28,7,79);
 R(942,884,203,12,68);R(951,896,13,27,58);R(1130,896,13,27,58);
 R(968,249,151,12,62);R(981,262,13,29,58);R(1102,262,13,26,58);
 // IV. Distinct hot isolator, separate cold capsule, dry calibrated service balconies.
 P(1227,570,24);P(1610,609,26);
 L(1238,575,1333,401,20,58);L(1333,401,1513,457,22,62);L(1513,457,1624,610,21,58);
 R(1244,649,382,14,62);R(1266,837,352,15,117);
 T(1309,710,132,71,8,104);T(1510,731,70,51,3,58);
 R(1313,794,145,13,62);R(1324,807,13,30,58);R(1423,807,13,30,58);
 R(1505,796,92,12,68);R(1511,808,13,29,58);R(1574,808,13,29,58);
 R(1262,560,315,12,117);R(1291,571,14,75,58);R(1561,571,14,75,58);
 F(1357,519,88,34,7,70);R(1377,545,47,7,120);R(1398,553,12,8,117);
 R(1472,584,13,59,58);R(1475,598,92,11,68);F(1511,563,51,29,6,62);R(1524,585,25,6,79);
 R(1277,872,131,13,62);R(1293,853,13,19,58);R(1395,853,13,19,58);
 F(1330,832,66,31,7,70);R(1347,854,35,7,77);
 // V. Three unequal splayed filter towers, dry recovery and different operator faces.
 P(1668,723,25);P(2014,789,22);
 L(1678,729,1751,326,24,58);L(1751,326,1847,398,19,62);
 L(1840,732,1888,239,27,58);L(1888,239,1942,341,18,62);
 L(1953,786,2001,455,23,58);L(2001,455,2028,497,19,62);
 R(1686,663,329,15,62);R(1707,804,299,14,117);
 R(1731,678,14,126,58);R(1827,678,14,126,58);R(1944,680,14,124,58);
 R(1726,786,54,12,70);R(1825,785,53,12,70);R(1943,785,40,12,70);
 R(1744,562,111,12,68);R(1753,574,13,85,58);R(1838,574,13,85,58);
 F(1771,531,61,28,6,70);R(1786,552,31,6,120);
 R(1874,548,122,13,70);R(1885,561,13,100,58);R(1984,561,13,100,58);
 F(1914,517,66,29,6,62);R(1932,538,31,7,79);
 R(1724,893,292,13,62);R(1740,852,13,41,58);R(1995,851,13,42,58);
 F(1780,852,69,30,7,117);R(1796,875,35,6,77);R(1816,881,10,14,58);
 R(1865,872,64,13,70);R(1884,885,13,9,58);
 // Literal site envelope excavation (not shifted coordinates or nearest-point lookup).
 for(let [name,x,y] of SITES){for(let yy=y-16;yy<=y+16;yy++)for(let xx=x-19;xx<=x+19;xx++)if(g[yy*W+xx]===3||g[yy*W+xx]===8)throw Error('site hits fluid '+name);R(x-19,y-16,39,33,0)}
 const solid=v=>v!==0&&v!==3&&v!==8;
 function rooted(){let seen=new Uint8Array(g.length),q=new Int32Array(g.length),h=0,t=0;
  function add(p){if(solid(g[p])&&!seen[p]){seen[p]=1;q[t++]=p}}
  for(let x=0;x<W;x++){add(x);add((H-1)*W+x)}
  for(let y=0;y<H;y++){add(y*W);add(y*W+W-1)}
  while(h<t){let p=q[h++],x=p%W;if(x)add(p-1);if(x<W-1)add(p+1);if(p>=W)add(p-W);if(p<g.length-W)add(p+W)}
  return seen
 }
 // Explicit physical cable/post connections for disconnected inert assemblies.
 for(let iter=0;iter<110;iter++){let seen=rooted(),target=-1,best=-1;
  for(let i=0;i<g.length;i++)if(solid(g[i])&&!seen[i]){let x=i%W,y=(i/W)|0;
   if(y>best&&x>35&&x<W-35&&SITES.every(z=>Math.abs(z[1]-x)>31||y>z[2]+18)){
    let safe=true;for(let yy=y;yy<940;yy++)if(g[yy*W+x]===3||g[yy*W+x]===8){safe=false;break}
    if(safe){target=i;best=y}}}
  if(target<0)break;let x=target%W,y=(target/W)|0;R(x-3,y,7,945-y,58)
 }
 // Only discard incidental isolated inert ornament cells, never sever a sealed fluid vessel.
 let seen=rooted();
 for(let i=0;i<g.length;i++)if(solid(g[i])&&!seen[i]){
  let x=i%W,y=(i/W)|0;
  if([i-W,i+W,x?i-1:i,x<W-1?i+1:i].some(j=>j>=0&&j<g.length&&(g[j]===3||g[j]===8)))throw Error('disconnected sealed fluid wall');
  g[i]=0;
 }
 return g;
}
module.exports={W,H,SEED,SITES,CROPS,COLORS,materialWorld};
