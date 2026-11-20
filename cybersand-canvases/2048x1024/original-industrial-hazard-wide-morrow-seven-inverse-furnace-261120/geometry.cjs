'use strict';
// ORIGINAL: Morrow-7 Inverse Furnace, freehand cellular topology, no source image.
const W=2048,H=1024,SEED=19112617;
const SITES=[
 ['Midge induction',228,435],['Freight assay',334,454],['Counterwash overpass',465,415],
 ['Red-line observation',650,486],['Cold cassette access',833,675],
 ['Annulus west lock',890,616],['Inversion chamber',1040,635],['Annulus top flight',1051,431],
 ['Hollow drain return',1200,835],['Radiator inlet',1275,458],
 ['Radiator service',1440,525],['Baffle hatch',1550,476],
 ['Collector manifold',1706,460],['Stack survey',1888,445],['Emergency vent terminal',1940,530]
];
const CROPS=[['01-freight-assay',55,185,415,510],['02-counterwash',405,365,480,510],
 ['03-annulus',830,400,455,500],['04-radiator',1230,355,455,515],
 ['05-exhaust',1600,240,435,600],['06-recovery',830,755,510,255]];
const COLORS={0:[8,11,18],3:[47,127,210],8:[241,78,31],58:[111,118,126],
62:[138,151,166],68:[102,124,135],70:[211,207,183],76:[230,186,41],
77:[25,211,220],79:[250,168,44],100:[54,56,61],101:[24,19,32],104:[200,152,98],
117:[124,134,149],120:[134,189,197]};
function materialWorld(){
 const g=new Uint8Array(W*H);
 let seed=SEED>>>0; const rand=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296};
 const rect=(x,y,w,h,m)=>{x=Math.max(0,Math.floor(x));y=Math.max(0,Math.floor(y));let xx=Math.min(W,Math.floor(x+w)),yy=Math.min(H,Math.floor(y+h));for(let j=y;j<yy;j++)g.fill(m,j*W+x,j*W+xx)};
 const line=(x1,y1,x2,y2,t,m)=>{let n=Math.ceil(Math.max(Math.abs(x2-x1),Math.abs(y2-y1))/3);for(let i=0;i<=n;i++){let a=i/Math.max(1,n);rect(Math.round(x1+(x2-x1)*a-t/2),Math.round(y1+(y2-y1)*a-t/2),t,t,m)}};
 const frame=(x,y,w,h,t,m)=>{rect(x,y,w,t,m);rect(x,y+h-t,w,t,m);rect(x,y,t,h,m);rect(x+w-t,y,t,h,m)};
 const ellipse=(cx,cy,rx,ry,thick,m)=>{for(let y=Math.max(0,cy-ry);y<=Math.min(H-1,cy+ry);y++){let qy=((y-cy)/ry)**2;let dx=rx*Math.sqrt(Math.max(0,1-qy));for(let x=Math.max(0,Math.ceil(cx-dx));x<=Math.min(W-1,Math.floor(cx+dx));x++){let v=((x-cx)/rx)**2+qy;if(v<=1&&v>=((1-thick/rx)**2))g[y*W+x]=m;}}};
 // Basalt cut and layered rock entirely rooted to bottom boundary.
 for(let x=0;x<W;x+=8){let top=Math.round((910+18*Math.sin(x/120)+9*Math.sin(x/49))/8)*8;
   if(x>820&&x<1240)top=948; if(x>1670)top=896;
   rect(x,top,8,H-top,100); rect(x,970,8,54,58);}
 rect(0,1006,W,18,58);rect(34,936,1970,10,62);
 // Dry subterranean recovery channel, with intentionally separated short entry ribs.
 // Dry recovery follows open ground-side gaps; never sever load-bearing bases.
rect(830,854,405,18,0);rect(830,870,405,7,117);
 // WEST: giant sawtooth intake shed, tall single freighter mast, offset internal galleries.
 line(75,510,169,242,18,58);line(169,242,342,312,18,58);line(342,312,401,535,18,58);
 rect(77,505,12,396,58);rect(390,530,12,372,58);rect(85,595,300,12,62);
 rect(105,752,273,12,117);rect(106,346,225,11,62);
 line(174,253,174,603,13,68);rect(162,358,26,12,76);
 line(93,596,106,904,16,58);line(388,596,372,905,16,58);
 rect(207,560,93,14,62);frame(218,513,67,48,7,70);rect(231,548,38,8,120);
 rect(306,572,45,12,68);rect(317,555,9,17,117);rect(335,545,10,27,76);
 line(252,355,252,412,7,117);line(252,484,215,501,7,68);line(252,484,286,501,7,68);
 frame(213,505,76,44,7,62);rect(235,520,32,13,100);rect(234,549,8,11,58);
 // Docked lopsided refractory barge with clamp, entered operator berth.
 rect(99,648,236,12,58);line(112,660,167,720,13,68);line(167,720,314,720,13,68);
 line(314,720,331,660,13,68);rect(153,707,166,8,70);
 frame(178,668,68,36,7,62);rect(191,686,39,9,120);
 rect(113,727,9,23,58);rect(309,727,9,23,58);
 // COUNTERWASH: two separate oblique supported exchange benches, tiered sealed cartridges.
 line(437,880,476,514,18,58);line(811,880,800,532,19,58);
 line(481,521,601,575,15,62);line(601,575,805,520,15,62);
 rect(480,585,317,13,62);rect(490,721,301,12,117);
 line(490,598,491,900,11,58);line(795,598,785,900,11,58);
 rect(521,626,110,77,8);frame(509,614,134,101,12,104);
 rect(519,715,14,15,58);rect(618,715,14,15,58);
 rect(682,628,90,73,3);frame(670,617,114,96,12,58);
 rect(680,713,14,17,58);rect(758,713,14,17,58);
 rect(542,600,62,10,79);rect(705,604,48,9,77);
 rect(518,776,112,11,62);rect(526,758,8,18,117);
 rect(619,758,8,18,117);frame(539,750,74,27,6,70);rect(554,764,45,8,120);
 rect(662,783,99,12,62);rect(671,753,8,30,117);rect(746,753,8,30,117);
 frame(686,746,52,25,6,68);rect(697,765,30,7,77);
 // Upper access fingers hang from grounded pylons, leaving full-width free upper route.
 line(459,543,505,370,12,117);line(788,540,738,355,12,117);
 rect(505,358,233,10,62);rect(533,357,11,14,76);
 // CENTRE: single broken crescent counter-rotor shell. Ring anchored by twin unequal toes.
 ellipse(1046,646,180,163,19,62);
 rect(852,601,50,86,0); // 85-cell breach makes interior genuinely enterable.
 rect(980,799,17,108,58);rect(1101,793,17,114,58);
 rect(952,814,199,13,68);
 rect(910,854,287,13,117);
 line(958,819,945,904,12,58);line(1160,814,1174,905,12,58);
 // Radial service teeth are attached to the ring rather than isolated motifs.
 for(let i=0;i<4;i++){let x=1009+i*27;rect(x,793,11,23,117);
   rect(x,817,11,18,(i%2)?77:76);}
 rect(1006,725,84,13,70);rect(1034,738,12,54,58);
 rect(957,570,169,10,68);rect(970,580,8,27,117);
 rect(1108,580,8,26,117);rect(990,586,70,9,76);
 // Viaduct-like dry return, with different utility cassettes and beam supports.
 rect(842,886,370,9,62);rect(853,864,52,12,70);
 rect(860,876,11,10,117);rect(901,876,10,10,117);
 rect(1150,864,59,12,68);rect(1155,876,10,10,117);
 // RADIATOR: splayed asymmetrical delta fins, separate walled coolant cells.
 rect(1262,795,368,15,62);rect(1257,824,384,13,117);
 for(let i=0;i<4;i++){
  let x=1276+i*89,tip=530+i*33+(i%2?17:-20);
  line(x,807,x+23,tip,14,58);
  line(x+23,tip,x+54,800,12,117);
  rect(x+7,800,56,13,68);
  rect(x+20,tip+12,13,16,i%2?77:79);
 }
 // Core cassettes supported on the delta fin rail, initially fully solid-sealed.
 rect(1301,856,114,53,3);frame(1290,845,136,65,11,58);
 rect(1300,909,17,15,58);rect(1400,909,17,15,58);
 rect(1503,854,92,56,3);frame(1492,843,114,68,11,62);
 rect(1502,911,17,13,62);rect(1588,911,17,13,62);
 rect(1281,606,281,11,62);
 line(1282,608,1293,810,13,58);line(1559,606,1595,808,15,58);
 rect(1335,671,184,10,117);rect(1353,681,9,126,58);rect(1510,681,9,126,58);
 rect(1351,722,144,10,68);frame(1395,685,64,30,6,70);rect(1409,707,34,7,120);
 // EXHAUST: three unequal inverted-rake stacks instead of repeating vertical towers.
 rect(1663,790,361,16,62);rect(1685,857,318,13,117);
 line(1680,800,1752,383,24,58);line(1752,383,1808,435,17,62);
 line(1833,795,1868,283,27,58);line(1868,283,1903,389,18,62);
 line(1970,808,1989,494,21,58);line(1989,494,2018,528,17,62);
 rect(1688,605,314,12,62);
 rect(1709,695,274,11,117);
 // Differentiated readout levels and driven transfer fingers, physically tied to braces.
 rect(1708,638,78,10,70);rect(1718,648,8,46,58);rect(1777,648,8,46,58);
 frame(1736,653,39,24,5,68);rect(1747,670,19,7,77);
 rect(1830,565,104,11,70);rect(1840,577,10,115,117);
 rect(1920,577,10,115,117);frame(1854,587,64,34,6,62);
 rect(1870,614,35,7,120);
 rect(1922,765,83,12,68);rect(1940,777,11,80,58);
 rect(1994,777,10,80,58);frame(1952,787,39,29,5,70);
 rect(1962,807,19,8,76);
 // A different small wheeled collector tub (still immobile material geometry).
 rect(1725,870,84,9,68);rect(1739,879,11,14,58);
 rect(1785,879,11,14,58);rect(1740,858,53,12,70);
 // Foundational load paths, rooted into the continuously connected basalt footing.
 rect(72,886,22,67,58);rect(388,886,18,67,58);
 rect(430,868,18,86,58);rect(785,868,20,86,58);
 rect(977,898,22,70,58);rect(1098,898,22,70,58);
 rect(1251,795,20,159,58);rect(1592,795,21,159,58);
 rect(1667,789,22,162,58);rect(1997,794,21,161,58);
 rect(110,742,16,25,58);rect(306,740,16,28,58);

 // Entered counterwash roof: 74-cell maintenance fly-in hatch between two grounded rafters.
 rect(613,345,74,48,0);
 // Short real steel load-transfer/pipe supports for formerly isolated instruments.
 rect(211,572,12,31,58);rect(287,570,12,30,58);
 rect(525,708,12,68,117);rect(743,708,12,74,117);
 rect(1100,499,12,83,58);rect(1001,577,9,14,117);
 rect(552,593,10,20,117);rect(710,592,10,23,117);
 rect(193,690,10,15,117);rect(233,690,10,18,117);
 rect(319,578,11,25,117);rect(690,768,10,21,117);
 rect(1740,643,10,20,117);
 // FINAL controlled openings between rooms/air, not cosmetic labels.
 rect(359,400,44,87,0);rect(818,420,52,84,0);
 rect(1210,426,55,85,0);rect(1640,410,50,88,0);
 // In the ring breach, entrance envelope to center is the original void.
 // Keep floor crossing passable by varying anchors rather than closing entrances.
 return g;
}
module.exports={W,H,SEED,SITES,CROPS,COLORS,materialWorld};
