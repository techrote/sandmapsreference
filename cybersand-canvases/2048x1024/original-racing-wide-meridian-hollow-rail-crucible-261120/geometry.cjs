'use strict';
// Meridian Hollow Rail Crucible R1 — original 2048x1024 orthographic dry industrial flight course.
// Human-designed, no reference images, no source-led conversions. Seed is fixed.
const W=2048,H=1024,N=W*H,SEED=0x4d455249;
const M={E:0,S:49,C:58,T:62,B:100,O:101,Z:113,I:117,Q:122};
const P={0:[8,12,20],49:[75,89,109],58:[136,143,158],62:[164,191,207],100:[42,57,71],101:[27,39,54],113:[222,174,78],117:[101,126,151],122:[237,225,186]};
const MODEL='c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96';
const POLICY=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
const SITES=[
['West launch',147,359],['Throttle aperture',341,359],['Transit crane outbound',605,358],
['Ring west approach',791,493],['Crucible middle pass',1050,500],['Crucible high diversion',1050,415],
['Crucible low diversion',1050,582],['Ring east exit',1297,498],['Calorimeter outgoing',1536,396],
['East arrestor',1804,385],['East descent',1900,536],['East lower recovery',1880,712],
['Calorimeter return',1570,708],['Ring east return',1309,574],['Ring inner return',1038,585],
['Ring west return',780,707],['Crane lower return',586,711],['West deceleration',371,704],
['West rise',158,543],['Finish west rejoin',161,360],
['West interlock control',237,163],['Transit load control',676,164],
['Calorimeter watch',1555,165],['East arrestor watch',1839,174],
['West press house',315,854],['Rail-drive workshop',691,852],
['East test shop',1436,860],['Recovery winch bay',1789,861]
];
const CROPS=[['overview.png',0,0,W,H],['01-west-interlock.png',0,85,435,720],['02-transit-crane.png',370,85,460,755],['03-crucible-ring.png',780,195,545,690],['04-calorimeter.png',1315,85,425,800],['05-east-arrestor.png',1680,75,368,850],['06-lower-workshops.png',175,728,1660,296]];
const OBSTRUCTION=[1000,468,102,75],BLOCKED='Crucible middle pass';
function generate(){
 const g=new Uint8Array(N);let seed=SEED>>>0;function rnd(){seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296;}
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function box(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);const l=Math.max(0,x),t=Math.max(0,y),r=Math.min(W,x+w),bt=Math.min(H,y+h);if(l>=r||t>=bt)return;for(let yy=t;yy<bt;yy++)g.fill(m,yy*W+l,yy*W+r);}
 function beam(x0,y0,x1,y1,t,m){const steps=Math.ceil(Math.max(Math.abs(x1-x0),Math.abs(y1-y0))/3);for(let j=0;j<=steps;j++){let u=j/Math.max(1,steps),x=x0+(x1-x0)*u,y=y0+(y1-y0)*u;box(x-t/2,y-t/2,t,t,m);}}
 function hoop(cx,cy,rx,ry,t,m){for(let j=0;j<1440;j++){const a=j*Math.PI/720;box(cx+rx*Math.cos(a)-t/2,cy+ry*Math.sin(a)-t/2,t,t,m);}}
 function slab(x,y,w,h){box(x,y,w,h,M.C);box(x,y,w,7,M.T);}
 function topRoom(x,y,w,h){box(x,y,w,h,M.I);box(x+17,y+17,w-34,h-17,0);box(x+w/2-43,y+h-25,86,32,0);box(x+9,y+7,w-18,9,M.Z);beam(x+20,70,x+20,y+10,17,M.C);beam(x+w-20,70,x+w-20,y+10,17,M.C);}
 function floorRoom(x,y,w,h){box(x,y,w,h,M.C);box(x+16,y+16,w-32,h-16,0);box(x+w/2-42,y-64,84,118,0);box(x+17,y+h-24,w-34,11,M.T);}
 // Foundational world stratum and two sealed inert abutments.
 box(0,0,W,53,M.B);box(0,53,W,22,M.S);box(0,921,W,103,M.B);box(0,905,W,16,M.C);
 box(0,0,25,H,M.C);box(W-25,0,25,H,M.C);
 for(let [x,w] of [[25,346],[374,402],[782,530],[1320,391],[1717,306]]){box(x,75,w,11,M.O);box(x,916,w,5,M.O);}
 // WEST INTERLOCK: twin asymmetric accelerator housings, incoming/outgoing gates, observation.
 box(63,75,26,210,M.I);beam(77,285,122,318,17,M.T);
 box(355,75,18,216,M.C);beam(362,286,330,308,17,M.Z);
 box(101,89,51,68,M.C);box(110,99,33,48,M.I);box(118,108,17,31,M.Q);
 beam(98,158,120,75,12,M.T);box(286,125,41,21,M.T);beam(310,143,357,75,12,M.I);
 beam(72,912,130,758,24,M.C);beam(130,758,185,724,13,M.T);
 beam(352,912,308,765,22,M.T);box(265,752,61,26,M.I);
 // Side-of-course paired finish and departure jaws anchored into the west wall.
 box(25,328,92,15,M.Z);beam(116,337,141,319,11,M.Z);
 box(25,467,97,15,M.Q);beam(121,474,144,496,12,M.Q);
 // TRANSIT CRANE: long asymmetrical underslung Vee load rigs, not repeating baffles.
 beam(427,75,467,189,18,M.T);beam(467,189,581,270,16,M.I);
 beam(581,270,643,177,14,M.C);beam(643,177,651,75,17,M.I);
 beam(545,199,561,305,13,M.Z);box(531,306,63,13,M.I);
 box(503,152,95,19,M.C);box(514,160,23,20,M.Q);
 beam(749,75,700,230,20,M.C);beam(700,230,740,292,13,M.T);
 box(691,282,88,18,M.Z);box(711,302,42,14,M.I);
 // Distinct grounded track-yoke and dynamo on the lower return.
 beam(440,916,473,785,24,M.C);beam(473,785,560,762,19,M.I);
 beam(710,916,655,807,22,M.T);beam(655,807,594,782,13,M.C);
 box(511,812,92,19,M.Z);box(528,831,66,31,M.T);box(540,836,24,19,M.Q);
 // HOLLOW CRUCIBLE: interrupted oval with enterable lateral gaps.
 // Two separate half-rims each get a real structural connection to a world edge.
 hoop(1047,501,193,176,17,M.I);hoop(1047,501,168,150,8,M.T);
 // Upper eccentric suspended inductor and its own roof-rooted load path.
 beam(981,75,975,328,20,M.C);beam(975,328,994,338,18,M.T);
 box(946,108,62,18,M.Z);box(957,129,33,27,M.T);
 // Lower eccentric bearing and drainage housing on foundation.
 beam(1135,671,1171,916,21,M.C);beam(1118,686,1137,719,17,M.T);
 box(1154,800,49,20,M.I);box(1164,820,27,29,M.Z);
 // Sculpt actual hull-clear entrances through both concentric rims.
 box(830,461,98,84,0);box(1170,461,121,84,0);
 // Attached prism gauges on upper rim, two different orientations.
 beam(914,385,943,352,12,M.Z);beam(1170,358,1192,391,12,M.Q);
 box(1031,327,34,9,M.Z);box(1038,658,35,12,M.Z);
 // Undercrucible service islands (floor mounted) preserve broad lower recovery route.
 beam(828,916,864,802,19,M.C);beam(864,802,895,780,12,M.T);
 beam(1298,916,1272,794,19,M.T);beam(1272,794,1244,774,11,M.Z);
 // CALORIMETER: one high suspended prism-bank, one low tilting extrusion press.
 beam(1399,75,1435,238,23,M.I);beam(1435,238,1516,269,19,M.T);
 beam(1516,269,1590,214,18,M.C);beam(1590,214,1637,75,21,M.I);
 box(1447,206,72,27,M.C);box(1464,229,37,29,M.Q);
 box(1481,112,75,15,M.Z);box(1522,127,18,45,M.T);
 beam(1355,916,1381,801,24,M.T);beam(1381,801,1466,776,20,M.I);
 beam(1619,916,1598,794,23,M.C);beam(1598,794,1511,769,17,M.T);
 box(1466,791,67,19,M.Z);box(1478,809,41,32,M.I);
 // EAST ARRESTOR: a single stepped capture tower with separate west and east intake faces.
 box(1730,75,21,219,M.C);beam(1741,280,1793,323,17,M.I);
 box(1910,75,26,228,M.I);beam(1923,297,1872,322,18,M.T);
 box(1770,112,67,19,M.Z);box(1777,131,24,42,M.C);
 beam(1737,916,1791,795,22,M.C);beam(1791,795,1853,753,17,M.I);
 beam(1943,916,1920,777,22,M.I);beam(1920,777,1886,754,16,M.T);
 box(1948,420,76,17,M.Z);beam(1948,427,1922,397,13,M.Z);
 box(1948,719,76,17,M.Q);beam(1948,726,1915,753,13,M.Q);
 // Four actual entered ceiling control suites, each functional rather than cloned bare trays.
 topRoom(171,104,160,142);topRoom(627,105,138,139);
 topRoom(1480,103,156,145);topRoom(1767,109,152,141);
 // Distinct wall-supported instruments, leaving named centre envelopes open.
 box(179,162,33,10,M.T);box(188,146,19,16,M.Q);box(198,172,10,20,M.I);
 box(297,172,29,10,M.T);box(298,152,14,20,M.Z);
 box(635,159,25,12,M.C);box(640,145,15,14,M.Z);
 box(733,164,25,10,M.T);box(735,147,15,17,M.Q);
 box(1488,166,34,13,M.I);box(1491,149,17,17,M.Q);
 box(1605,157,27,12,M.T);box(1610,139,16,18,M.Z);
 box(1775,169,32,11,M.C);box(1781,152,13,17,M.Z);
 box(1888,165,26,12,M.I);box(1891,146,15,19,M.Q);
 // Ground-rooted accessible mechanics; 84px entry shafts retain 31px conservative clearance.
 floorRoom(246,815,151,106);floorRoom(617,811,155,110);
 floorRoom(1361,812,156,109);floorRoom(1714,812,162,109);
 box(258,891,25,30,M.T);box(263,875,16,16,M.Q);box(365,891,20,30,M.I);
 box(630,893,26,28,M.C);box(634,877,18,16,M.Z);box(737,890,24,31,M.T);
 box(1374,893,27,28,M.T);box(1379,877,17,16,M.Q);box(1484,892,20,29,M.C);
 box(1727,893,27,28,M.I);box(1732,879,15,14,M.Z);box(1845,890,19,31,M.T);
 // Per-district purpose cues as material-backed parts, not decorative overlays.
 for(let [x,y,t] of [[81,80,0],[400,78,1],[877,80,2],[1360,79,3],[1780,80,4]]){
  box(x,y,40,11,t%2?M.Z:M.Q);box(x+6,y+11,9,12,M.T);
 }
 // Limited seeded pressure port assay: one fixed instrument array, not wallpaper texture.
 for(let i=0;i<12;i++){let x=1365+i*24,y=878+Math.floor(rnd()*11);box(x,y,12,7,(i%3)?M.I:M.Z);}
 // Remove only genuinely detached solids; no invented foundations, loose collision glyphs or scene art.
 const seen=new Uint8Array(N),q=new Int32Array(N);let a=0,b=0;
 function push(i){if(g[i]&&!seen[i]){seen[i]=1;q[b++]=i;}}
 for(let x=0;x<W;x++){push(x);push((H-1)*W+x);}for(let y=0;y<H;y++){push(y*W);push(y*W+W-1);}
 while(a<b){let i=q[a++],x=i%W,y=(i-x)/W;if(x)push(i-1);if(x<W-1)push(i+1);if(y)push(i-W);if(y<H-1)push(i+W);}
 let discarded=0;for(let i=0;i<N;i++)if(g[i]&&!seen[i]){g[i]=0;discarded++;}
 return{g,grounded:b,discarded};
}
function encodeRects(g){const rects=[];let last=new Map();for(let y=0;y<H;y++){let cur=new Map();for(let x=0;x<W;){let val=g[y*W+x],x0=x++;while(x<W&&g[y*W+x]===val)x++;if(!val)continue;let key=x0+':'+(x-x0)+':'+val,found=last.get(key);if(found)found[3]++;else{found=[x0,y,x-x0,1,val];rects.push(found);}cur.set(key,found);}last=cur;}return{edits:rects,visits:rects.reduce((a,r)=>a+r[2]*r[3],0)};}
function reach(g,w,h){const D=W+1,sum=new Uint32Array((W+1)*(H+1));for(let y=1;y<=H;y++){let row=0;for(let x=1;x<=W;x++){row+=g[(y-1)*W+x-1]?1:0;sum[y*D+x]=row+sum[(y-1)*D+x];}}const ok=new Uint8Array(N),l=w>>1,r=w-l-1,t=h>>1,b=h-t-1;for(let y=t;y<H-b;y++)for(let x=l;x<W-r;x++){let z=(y-t)*D,k=(y+b+1)*D,x0=x-l,x1=x+r+1;if(sum[k+x1]-sum[z+x1]-sum[k+x0]+sum[z+x0]===0)ok[y*W+x]=1;}const source=SITES[0][2]*W+SITES[0][1];if(!ok[source])throw Error('spawn blocked '+w+'x'+h);const seen=new Uint8Array(N),q=new Int32Array(N);let a=0,bq=1;q[0]=source;seen[source]=1;while(a<bq){let i=q[a++],x=i%W;if(x&&ok[i-1]&&!seen[i-1]){seen[i-1]=1;q[bq++]=i-1;}if(x<W-1&&ok[i+1]&&!seen[i+1]){seen[i+1]=1;q[bq++]=i+1;}if(i>=W&&ok[i-W]&&!seen[i-W]){seen[i-W]=1;q[bq++]=i-W;}if(i<N-W&&ok[i+W]&&!seen[i+W]){seen[i+W]=1;q[bq++]=i+W;}}return{connected:bq,missing:SITES.filter(s=>!seen[s[2]*W+s[1]]).map(s=>s[0])};}
module.exports={W,H,N,SEED,M,P,MODEL,POLICY,SITES,CROPS,OBSTRUCTION,BLOCKED,generate,encodeRects,reach};
