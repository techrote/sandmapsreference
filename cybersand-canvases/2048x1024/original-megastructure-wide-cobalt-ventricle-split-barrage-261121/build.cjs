#!/usr/bin/env node
// CyberSand Cobalt Ventricle — deterministic material-cell builder. No dependencies.
const fs=require('fs'), path=require('path');
function generate() {
  // Original CyberSand 2048x1024 corpus exemplar; no external artwork or map geometry.
  // Entire generator is deterministic, portable ES2020 (Node and GitHub publisher).
  const W=2048,H=1024,N=W*H,SEED=202611210647;
  const G=new Uint8Array(N);let rng=SEED>>>0;
  function next(){rng^=rng<<13;rng^=rng>>>17;rng^=rng<<5;return rng>>>0;}
  const C={empty:0,concrete:58,steel:62,painted:63,corrugated:64,rust:65,grate:66,pipe:68,copper:69,darkglass:72,cable:74,hazard:76,cyan:77,amber:79,white:80,marble:98,basalt:100,obsidian:101,terrazzo:111,brass:119,carbon:130,shield:131};
  const palette={0:[8,11,18],58:[119,123,128],62:[126,141,153],63:[49,100,119],64:[109,125,134],65:[124,63,43],66:[74,85,93],68:[102,119,129],69:[165,92,54],72:[37,60,76],74:[60,53,68],76:[227,182,47],77:[55,243,228],79:[255,181,46],80:[236,248,255],98:[226,223,216],100:[54,56,61],101:[24,19,32],111:[200,196,186],119:[196,160,72],130:[35,41,47],131:[138,104,72]};
  const operations=[];
  function rect(x0,y0,x1,y1,id){x0=Math.max(0,Math.floor(x0));y0=Math.max(0,Math.floor(y0));x1=Math.min(W,Math.ceil(x1));y1=Math.min(H,Math.ceil(y1));if(x1<=x0||y1<=y0)return;for(let y=y0;y<y1;y++)G.fill(id,y*W+x0,y*W+x1);}
  function stroke(x0,y0,x1,y1,r,id){const dx=x1-x0,dy=y1-y0,n=Math.max(Math.abs(dx),Math.abs(dy));for(let i=0;i<=n;i+=Math.max(1,Math.floor(r*.65))){let t=i/n,x=Math.round(x0+dx*t),y=Math.round(y0+dy*t);rect(x-r,y-r,x+r+1,y+r+1,id);}rect(x1-r,y1-r,x1+r+1,y1+r+1,id);}
  function ring(cx,cy,rx,ry,t,id){const steps=Math.ceil(2*Math.PI*Math.max(rx,ry)*1.2);for(let i=0;i<steps;i++){const a=2*Math.PI*i/steps,x=Math.round(cx+Math.cos(a)*rx),y=Math.round(cy+Math.sin(a)*ry);rect(x-t,y-t,x+t+1,y+t+1,id);}}
  function poly(points,id){let ymin=H,ymax=0;for(const [x,y] of points){ymin=Math.min(ymin,y);ymax=Math.max(ymax,y);}for(let y=Math.max(0,Math.floor(ymin));y<Math.min(H,Math.ceil(ymax));y++){let xs=[];for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];if((a[1]<=y+.5&&b[1]>y+.5)||(b[1]<=y+.5&&a[1]>y+.5))xs.push(a[0]+((y+.5-a[1])/(b[1]-a[1]))*(b[0]-a[0]));}xs.sort((a,b)=>a-b);for(let k=0;k+1<xs.length;k+=2)rect(Math.ceil(xs[k]),y,Math.ceil(xs[k+1]),y+1,id);}}
  function casing(x,y,w,h){rect(x,y,x+w,y+7,C.steel);rect(x,y+h-7,x+w,y+h,C.concrete);rect(x,y,x+8,y+h,C.concrete);rect(x+w-8,y,x+w,y+h,C.concrete);}
  function hatch(x,y){rect(x,y,x+29,y+41,C.painted);rect(x+5,y+5,x+24,y+34,C.darkglass);rect(x+26,y+15,x+29,y+20,C.amber);}
  function bench(x,y,w,id){rect(x,y,x+w,y+5,id);rect(x+6,y+5,x+11,y+24,C.steel);rect(x+w-11,y+5,x+w-6,y+24,C.steel);}
  function cable(x0,y0,x1,y1){stroke(x0,y0,x1,y1,1,C.cable);}
  // Grounded subgrade and rubble terraces; high horizontal open air is deliberate.
  for(let x=0;x<W;x++){const e=906+Math.floor(11*Math.sin(x/91)+6*Math.sin(x/31)+4*Math.sin(x/13));rect(x,e,x+1,H,C.basalt);if((x%43)<3)rect(x,e-4,x+1,e,C.obsidian);}
  // Root-level utilities, separate leg pairs and lateral basal inspection platform.
  rect(64,856,1988,865,C.concrete);for(const x of [72,326,578,733,1257,1431,1691,1952]){rect(x,855,x+18,928,C.steel);rect(x+3,856,x+14,908,C.painted);}
  for(const [a,b] of [[150,300],[375,540],[785,900],[1135,1240],[1480,1585],[1780,1895]]){rect(a,846,b,860,C.grate);}
  // West Inlet Commune: staggered actual interior rooms rather than screen scenery.
  rect(96,396,138,857,C.concrete);rect(384,435,418,858,C.concrete);rect(96,389,418,405,C.steel);
  casing(120,422,246,133);casing(120,585,258,125);
  rect(137,470,186,478,C.marble);hatch(166,496);hatch(274,496);
  rect(126,550,177,556,C.grate);rect(208,550,361,557,C.grate);
  for(const x of [144,219,310]){rect(x,437,x+28,451,C.darkglass);rect(x+4,442,x+24,446,C.cyan);}
  bench(237,628,90,C.terrazzo);bench(140,628,62,C.steel);
  // Cistern communal hall above a lower enclosed store and a deliberately open parcel stage.
  rect(145,715,340,727,C.steel);rect(145,728,155,817,C.concrete);rect(327,728,337,817,C.concrete);
  for(const x of [161,196,231,266,301]){rect(x,743,x+20,772,x%2?C.corrugated:C.rust);}
  stroke(122,386,192,327,4,C.steel);stroke(192,327,368,345,5,C.steel);stroke(368,345,396,389,4,C.steel);
  // West pulse gate: two *diagonal* foot-rooted retaining structures with perforated webs.
  poly([[526,858],[590,858],[846,287],[795,287]],C.concrete);
  poly([[566,858],[594,858],[844,324],[816,324]],C.steel);
  stroke(565,820,804,321,6,C.painted);
  for(let k=0;k<6;k++){const y=345+k*68,x=812-Math.floor(k*30);rect(x-46,y,x+2,y+13,C.steel);rect(x-34,y+13,x-26,y+40,C.copper);}
  // West gate's entered production hall and hydraulic manifold; bridge over recovery level.
  rect(443,605,707,621,C.steel);rect(443,621,454,855,C.concrete);rect(689,621,704,855,C.concrete);
  rect(457,471,670,482,C.corrugated);rect(460,481,473,602,C.concrete);rect(655,481,670,605,C.concrete);
  ring(578,548,58,51,6,C.brass);ring(578,548,34,27,4,C.steel);
  rect(574,517,584,576,C.copper);rect(538,541,618,551,C.copper);
  for(let i=0;i<4;i++){let x=465+i*45;rect(x,587,x+27,600,C.hazard);rect(x+6,579,x+21,587,C.white);}
  rect(495,728,638,739,C.grate);rect(495,739,510,854,C.steel);rect(623,739,638,853,C.steel);
  // Separate passenger stairs and exposed powered ram linkage above west pulse deck.
  stroke(391,628,450,555,4,C.steel);stroke(707,606,760,542,4,C.copper);
  // Central dry ventricle: open dual-sided void with below-grade return and unfilled editor seam.
  // Twin grounded pressure pistons carry a 3-part keyed seal, NOT a ring/dish/city hull.
  rect(912,670,937,856,C.steel);rect(1120,670,1145,856,C.steel);
  rect(907,665,1148,678,C.concrete);rect(941,670,1116,677,C.grate);
  rect(947,645,954,705,C.pipe);rect(1104,645,1111,705,C.pipe);
  rect(964,594,1089,608,C.painted);
  for(const x of [973,1011,1052]){rect(x,590,x+29,602,C.hazard);rect(x+7,601,x+22,625,C.steel);}
  stroke(920,780,977,690,3,C.copper);stroke(1135,780,1074,690,3,C.copper);
  // Vertical edge-light pointers signal different traversal heights, do not close airspace.
  for(const [x,y] of [[903,504],[1147,504],[889,331],[1161,331]]){rect(x,y,x+7,y+25,C.cyan);rect(x-3,y+25,x+10,y+30,C.steel);}
  // Upper decompression maintenance jib and two asymmetric lift stations, grounded via gate buttresses.
  stroke(818,320,883,299,4,C.steel);stroke(1172,300,1258,318,4,C.steel);
  rect(824,295,868,310,C.grate);rect(1181,295,1238,310,C.grate);
  for(const x of [844,1203]){rect(x,287,x+5,300,C.white);}
  // East governor gate: inverse diagonal blade, load path descends to the bottom-right.
  poly([[1206,304],[1255,304],[1528,858],[1462,858]],C.concrete);
  poly([[1218,330],[1246,330],[1485,858],[1461,858]],C.steel);
  stroke(1232,336,1484,830,6,C.painted);
  for(let k=0;k<6;k++){let y=360+k*71,x=1236+Math.floor(k*31);rect(x,y,x+58,y+12,C.steel);rect(x+17,y+12,x+25,y+38,C.copper);}
  // Governor relay house; unlike the domestic rooms this is a long staggered industrial control wing.
  rect(1354,484,1605,498,C.steel);rect(1354,498,1367,850,C.concrete);rect(1590,498,1604,855,C.concrete);
  rect(1369,527,1588,538,C.grate);rect(1368,617,1577,628,C.corrugated);
  for(let j=0;j<4;j++){let x=1391+j*48;rect(x,556,x+34,590,C.darkglass);rect(x+7,562,x+27,567,C.amber);rect(x+7,575,x+26,579,C.cyan);}
  for(const [x,y] of [[1379,640],[1438,666],[1499,635]]){bench(x,y,42,C.brass);rect(x+8,y-12,x+27,y,C.painted);}
  rect(1395,731,1557,742,C.steel);rect(1409,743,1420,844,C.concrete);rect(1545,743,1557,844,C.concrete);
  for(const x of [1436,1475,1514]){rect(x,755,x+25,790,C.corrugated);rect(x+6,767,x+20,771,C.hazard);}
  // East Egress freight town: wide unloading elevation and arrival/departure stage.
  rect(1687,366,1729,860,C.concrete);rect(1919,394,1953,861,C.concrete);rect(1687,366,1953,380,C.steel);
  casing(1749,414,154,111);rect(1766,442,1810,449,C.marble);hatch(1854,470);
  rect(1728,560,1953,571,C.steel);rect(1741,571,1751,710,C.concrete);rect(1929,571,1942,710,C.concrete);
  for(let i=0;i<4;i++){let x=1770+i*38;rect(x,584,x+26,605,C.corrugated);rect(x+4,589,x+22,596,C.rust);}
  stroke(1739,700,1841,649,4,C.steel);stroke(1841,649,1934,699,4,C.steel);
  rect(1755,726,1931,738,C.grate);for(const x of [1774,1824,1874]){rect(x,738,x+34,780,C.painted);rect(x+4,743,x+30,753,C.white);}
  rect(1742,815,1933,826,C.steel);rect(1765,826,1774,855,C.steel);rect(1911,826,1920,855,C.steel);
  // A few route-relevant articulated bridges: explicit breaks and transfer shafts (no cloned trays).
  rect(735,529,908,537,C.grate);rect(908,537,916,566,C.steel);
  rect(1148,528,1315,537,C.grate);rect(1307,537,1314,574,C.steel);
  for(const [x0,x1,y] of [[384,464,535],[760,818,411],[1239,1289,411],[1587,1692,563]]){
    rect(x0,y,x1,y+7,C.steel);rect(x0,y+7,x0+7,y+29,C.painted);rect(x1-7,y+7,x1,y+29,C.painted);
  }
  // Settled industrial patina and individual station instrumentation, deterministic not noise wallpaper.
  for(let i=0;i<42;i++){const x=90+(next()%1860),y=865+(next()%20);if(G[y*W+x])rect(x,y,x+3,y+3,(i%4===0)?C.rust:C.obsidian);}
  // Grounded trans-basin circulation spine with deliberate transfer gaps; no fully solid plane.
  for(const [a,b] of [[80,207],[250,482],[522,694],[749,866],[918,1122],[1174,1301],[1360,1589],[1644,1840],[1881,1973]])rect(a,834,b,842,C.grate);
  // Physical Midge-scale doors, vertical relief hatches and deliberate low-level
  // maintenance passages. Cut in source geometry, never exempt collision checks.
  rect(208,389,266,610,0);                  // Commune roof-to-store transfer shaft
  rect(488,512,683,574,0);                  // Pulse governor true full-hull traversable gate
  rect(989,661,1063,689,0);                 // Ventricle lower access hatch
  rect(1582,547,1614,613,0);               // Governor east full-hull door
  rect(1586,720,1610,797,0);               // Emergency pocket west connection
  // Keep the western Egress pier intact as the roof load path; the pocket has
  // its real traversable western door via the governor aperture.
  rect(1758,410,1820,434,0);               // Skylight to egress civic desk
  rect(1735,608,1760,703,0);               // Left access into freight sort hall
  rect(1910,590,1968,724,0);               // Right emergency egress from freight sort hall
  rect(375,504,481,589,0);                 // West industrial full-width freight entry
  rect(1758,437,1821,460,0);               // Clear terrace skylight below upper glazed shelf
  rect(1495,478,1570,551,0);               // Governor through-roof Midge transfer shaft
  rect(364,430,374,851,C.steel);            // Reinstate commune upper/lower load path
  rect(360,400,374,435,C.steel);           // Crown tie to interior service post
  rect(84,611,151,694,0);                 // Full-hull exterior emergency access from customs floor
  rect(1758,347,1821,401,0);             // Egress upper skylight through continuous roof into open flight airspace
  // Operational workfaces mechanically tied to real structural floor/roof.
  // Upper Inlet is an entered civic exchange rather than ungrounded window scenery.
  rect(174,527,180,553,C.steel);          // Customs check-in terminal ties to the raised shelf
  rect(286,530,292,553,C.steel);          // Second intake cubicle floor fixing
  rect(311,648,318,711,C.steel);          // Ledger counter full grounded column (outside named site envelope)
  rect(141,646,147,715,C.steel);          // Communal bench support into load-bearing floor
  for(const x of [147,316]){rect(x+10,423,x+14,439,C.steel);} // Glazed upper signal windows rooted into casing
  // Eastern archive/civic registration wing retained on real abutments; its
  // existing canopy skylight is a distinct Midge-sized route, not scenery.
  rect(1708,515,1765,525,C.steel);
  rect(1897,515,1930,525,C.steel);
  rect(1802,501,1870,507,C.marble);      // Public registration counter
  rect(1811,506,1817,519,C.steel);
  rect(1856,506,1862,519,C.steel);
  rect(1861,468,1886,483,C.darkglass);   // Tied service/status terminal
  rect(1875,482,1881,520,C.steel);
  rect(1866,472,1882,476,C.amber);
  // Exact authored centres, fixed before validation. No target substitution or snapping.
  const SITES={
    'West inlet Midge spawn':[70,583], 'Inlet terrace overlook':[212,270], 'Commons customs floor':[344,662],
    'Western cargo descent':[723,730], 'Pulse gate upper bypass':[742,223], 'Pulse governor hall':[500,541],
    'Hydraulic collar inspection':[806,700], 'West gate face':[824,477], 'Central pressure datum':[1027,530],
    'Ventricle upper release':[1056,281], 'Dry return access':[1024,792], 'Opposite valve tower':[1203,457],
    'Eastern upper bypass':[1302,215], 'Governor controls':[1461,572], 'Governor lower service':[1315,784],
    'Egress civic desk':[1780,480], 'Eastern cargo sorting':[1805,635],
    'Terminal emergency pocket':[1657,764], 'East daylight departure':[1970,641]};
  // Materials are strictly accepted inert Solid/None IDs. Before export drop any
  // unanchored disconnected art: impossible to treat unsupported solids as stable.
  const seen=new Uint8Array(N),Q=new Int32Array(N);let tail=0;
  function root(i){if(G[i]&&!seen[i]){seen[i]=1;Q[tail++]=i;}}
  for(let x=0;x<W;x++){root(x);root((H-1)*W+x);}for(let y=0;y<H;y++){root(y*W);root(y*W+W-1);}
  for(let head=0;head<tail;head++){const i=Q[head],x=i%W;if(x>0)root(i-1);if(x<W-1)root(i+1);if(i>=W)root(i-W);if(i<N-W)root(i+W);}
  let pruned=0;for(let i=0;i<N;i++)if(G[i]&&!seen[i]){G[i]=0;pruned++;}
  // Canonical horizontal-run and exact vertical coalescence, legal five-field edits.
  const edits=[];let prev=new Map();for(let y=0;y<H;y++){const cur=new Map();for(let x=0;x<W;){const id=G[y*W+x],start=x;while(x<W&&G[y*W+x]===id)x++;if(!id)continue;const key=start+','+(x-start)+','+id;const old=prev.get(key);if(old!==undefined){edits[old][3]++;cur.set(key,old);}else{cur.set(key,edits.length);edits.push([start,y,x-start,1,id]);}}prev=cur;}
  const options={budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:2};
  const setup={version:2,extent:[W,H],actors:[{id:1,model:'midge',hash:'c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96',spawn:SITES['West inlet Midge spawn'],options}],next_id:2,selected:1,edits,response:'LA-SELECTIVE',liquid_policy:Array(55).fill(0),normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
  const encoder=new TextEncoder();function bytes(s){return encoder.encode(s);}
  function sha256(data){const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];let Hh=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];const n=data.length,total=Math.ceil((n+9)/64)*64,a=new Uint8Array(total);a.set(data);a[n]=0x80;const bit=n*8;for(let k=0;k<8;k++)a[total-1-k]=Math.floor(bit/(2**(8*k)))&255;const w=new Int32Array(64);const rotr=(x,s)=>(x>>>s)|(x<<(32-s));for(let p=0;p<total;p+=64){for(let i=0;i<16;i++){let j=p+4*i;w[i]=(a[j]<<24)|(a[j+1]<<16)|(a[j+2]<<8)|a[j+3];}for(let i=16;i<64;i++){let s0=rotr(w[i-15],7)^rotr(w[i-15],18)^(w[i-15]>>>3),s1=rotr(w[i-2],17)^rotr(w[i-2],19)^(w[i-2]>>>10);w[i]=(w[i-16]+s0+w[i-7]+s1)|0;}let [A,B,c,d,e,f,g,h]=Hh;for(let i=0;i<64;i++){let s1=rotr(e,6)^rotr(e,11)^rotr(e,25),ch=(e&f)^(~e&g),t1=(h+s1+ch+K[i]+w[i])|0,s0=rotr(A,2)^rotr(A,13)^rotr(A,22),maj=(A&B)^(A&c)^(B&c),t2=(s0+maj)|0;h=g;g=f;f=e;e=(d+t1)|0;d=c;c=B;B=A;A=(t1+t2)|0;}const z=[A,B,c,d,e,f,g,h];for(let i=0;i<8;i++)Hh[i]=(Hh[i]+z[i])|0;}return Hh.map(x=>(x>>>0).toString(16).padStart(8,'0')).join('');}
  const bin=(v)=>new Uint8Array([v>>>24&255,v>>>16&255,v>>>8&255,v&255]);
  function crc32(a){let c=~0;for(const b of a){c^=b;for(let k=0;k<8;k++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (~c)>>>0;}
  function adler32(a){let A=1,B=0;for(let i=0;i<a.length;i++){A=(A+a[i])%65521;B=(B+A)%65521;}return (B<<16|A)>>>0;}
  function concat(arr){let n=0;for(const x of arr)n+=x.length;const out=new Uint8Array(n);let i=0;for(const x of arr){out.set(x,i);i+=x.length;}return out;}
  function deflate(raw){let arr=[0x78,0x01],bits=0,nbits=0;const out=[];const push=(v,n)=>{bits|=v<<nbits;nbits+=n;while(nbits>=8){out.push(bits&255);bits>>>=8;nbits-=8;}};const reverse=(v,n)=>{let t=0;for(let i=0;i<n;i++){t=t<<1|(v&1);v>>>=1;}return t;};function lit(v){if(v<=143)push(reverse(0x30+v,8),8);else if(v<=255)push(reverse(0x190+v-144,9),9);else if(v<=279)push(reverse(v-256,7),7);else push(reverse(0xc0+v-280,8),8);}const LL=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],LE=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
    push(3,3);for(let i=0;i<raw.length;){const b=raw[i];let run=1;while(i+run<raw.length&&run<258&&raw[i+run]===b)run++;if(run>=4&&i>0&&raw[i-1]===b){let li=0;while(li<28&&LL[li+1]<=run)li++;lit(257+li);if(LE[li])push(run-LL[li],LE[li]);push(reverse(0,5),5);i+=run;}else {lit(b);i++;}}lit(256);if(nbits>0)out.push(bits&255);arr.push(...out);arr.push(...bin(adler32(raw)));return new Uint8Array(arr);}
  function png(x0,y0,w,h){const raw=new Uint8Array((w+1)*h);for(let y=0;y<h;y++)raw.set(G.subarray((y0+y)*W+x0,(y0+y)*W+x0+w),y*(w+1)+1);const plte=new Uint8Array(256*3);for(const [s,rgb] of Object.entries(palette))plte.set(rgb,Number(s)*3);function chunk(type,data){const t=bytes(type);return concat([bin(data.length),t,data,bin(crc32(concat([t,data])))]);}const ihdr=concat([bin(w),bin(h),new Uint8Array([8,3,0,0,0])]);return concat([new Uint8Array([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('PLTE',plte),chunk('IDAT',deflate(raw)),chunk('IEND',new Uint8Array())]);}
  // Verify every canonical record and source material row, and calculate work and histogram.
  const replay=new Uint8Array(N),cover=new Uint8Array(N);let work=0;for(const [x,y,w,h,m] of edits){if(!(x>=0&&y>=0&&w>0&&h>0&&m>0&&x+w<=W&&y+h<=H))throw Error('rectangle bounds');for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){const i=yy*W+xx;if(cover[i])throw Error('overlap '+i);cover[i]=1;replay[i]=m;work++;}}for(let i=0;i<N;i++)if(replay[i]!==G[i])throw Error('replay mismatch');
  const hist={};for(let i=0;i<N;i++){const v=G[i];hist[v]=(hist[v]||0)+1;}
  const legal=Object.keys(hist).filter(k=>Number(k)>0).map(Number);
  const integral=(g)=>{const s=new Uint32Array((W+1)*(H+1));for(let y=0;y<H;y++){let row=0;for(let x=0;x<W;x++){row+=(g[y*W+x]!==0?1:0);s[(y+1)*(W+1)+x+1]=s[y*(W+1)+x+1]+row;}}return s;};
  function traversals(grid,ww,hh){const ii=integral(grid),hx=(ww-1)/2,hy=(hh-1)/2,free=new Uint8Array(N);for(let y=hy;y<H-hy;y++)for(let x=hx;x<W-hx;x++){const a=x-hx,b=x+hx+1,c=y-hy,d=y+hy+1;free[y*W+x]=(ii[d*(W+1)+b]-ii[d*(W+1)+a]-ii[c*(W+1)+b]+ii[c*(W+1)+a]===0)?1:0;}const seen=new Uint8Array(N),q=new Int32Array(N),start=SITES['West inlet Midge spawn'][1]*W+SITES['West inlet Midge spawn'][0];if(!free[start])throw Error('spawn blocked '+ww+' '+hh);let head=0,t=1;q[0]=start;seen[start]=1;while(head<t){const i=q[head++],x=i%W;if(x>0&&free[i-1]&&!seen[i-1]){seen[i-1]=1;q[t++]=i-1;}if(x<W-1&&free[i+1]&&!seen[i+1]){seen[i+1]=1;q[t++]=i+1;}if(i>=W&&free[i-W]&&!seen[i-W]){seen[i-W]=1;q[t++]=i-W;}if(i<N-W&&free[i+W]&&!seen[i+W]){seen[i+W]=1;q[t++]=i+W;}}const missing=[],blocked_sites=[];for(const [name,[x,y]] of Object.entries(SITES)){if(!free[y*W+x])blocked_sites.push(name);if(!seen[y*W+x])missing.push(name);}return {footprint:[ww,hh],free_centres:free.reduce((a,b)=>a+b,0),component:t,reachable:Object.keys(SITES).length-missing.length,missing,blocked_sites};}
  const footprints=[[19,15],[23,19],[31,27]],reach=footprints.map(x=>traversals(G,...x));
  const obstruction=[991,510,82,61], blocked=new Uint8Array(G);for(let y=obstruction[1];y<obstruction[1]+obstruction[3];y++)blocked.fill(C.concrete,y*W+obstruction[0],y*W+obstruction[0]+obstruction[2]);const obstructed=footprints.map(x=>traversals(blocked,...x));
  const total=Object.keys(SITES).length;if(reach.some(v=>v.reachable!==total))throw Error('ORIGINAL EXACT SITES FAIL '+JSON.stringify(reach));if(obstructed.some(v=>v.reachable!==total-1||v.missing.length!==1||v.missing[0]!=='Central pressure datum'))throw Error('REAL OBSTRUCTION BYPASS FAIL '+JSON.stringify(obstructed));
  if(edits.length>32768)throw Error('rectangle budget');
  const sourceHash=sha256(G),json=JSON.stringify(setup),jsonBytes=bytes(json),setupHash=sha256(jsonBytes);if(jsonBytes.length>1048576)throw Error('json budget');
  const CROPS=[['01-inlet-commune.png',65,305,370,505],['02-pulse-gate.png',410,270,438,580],['03-dry-ventricle.png',805,225,460,610],['04-governor-house.png',1270,340,360,520],['05-egress-freight.png',1635,330,360,535]];
  const imgs={'overview.png':png(0,0,W,H)};for(const [name,x,y,w,h] of CROPS)imgs[name]=png(x,y,w,h);
  const receipt={title:'The Cobalt Ventricle — Split-Barrage Valve City',generated_utc_date:'2026-11-21',builder_seed:SEED,source_authority:'techrote/cybersand/main@f7e056c9b8791106e22f2d1c295043783d8a9701',schema_blob:'70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9',material_blob:'dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3',world:[W,H],cell_count:N,grid_sha256:sourceHash,setup_sha256:setupHash,setup_bytes:jsonBytes.length,rectangles:edits.length,rectangle_budget:32768,construction_work:work,grounded_inert_solids:work,removed_detached_cells:pruned,retained_detached_cells:0,material_histogram:hist,material_laws:Object.fromEntries(legal.map(id=>[id,{state:'Solid',kernel:'None',movable:false}])),mobile_cells:0,liquid_cells:0,reactive_cells:0,sites:SITES,clearance:reach,obstruction_xywh:obstruction,clearance_with_obstruction:obstructed,images:Object.fromEntries(Object.entries(imgs).map(([n,b])=>[n,{sha256:sha256(b),bytes:b.length,origin:n==='overview.png'?[0,0,W,H]:CROPS.find(c=>c[0]===n).slice(1)}])),native_status:'NATIVE-UNTESTED',independent_review:'PENDING',ci_status:'UNVERIFIED'};
  const exemplar={schema_version:1,purpose:['human_editable_canvas','procedural_exemplar','scripted_setpiece_source'],family:'original/megastructure-wide',map_role:'split-barrage dry flood-control settlement and inspectable valve modules',anchor_donors:[],macro_topology:['basin','bridge'],density_profile:'west and east active settlement density around a deliberately open dry central decompression basin',route_grammar:{main:'West inlet / pulse inspection / central valve datum / east governor / daylight egress',upper:'West gate overlook / release jib / opposite upper deck',lower:'Western cargo descent / lower dry service / eastern freight sorting',obstruction:'blocking the central pressure datum leaves an upper or lower local bypass and return'},strong_motifs:['two opposite leaning ground-rooted floodgate blades','open central dry pressure ventricle','irregular articulated gatework rather than repeated trays','separate operator houses and off-axis relief galleries'],interesting_relationships:['inhabited west and export east bracket a substantially unoccupied editable pressure basin','diagonal gate blades carry short orthogonal works platforms','high release and lower salvage passages afford two distinct routing rhythms'],authoring_affordances:['central dry basin usable for future fluid event without pre-spawned mobile water','unfurnished lower valve pockets','west overhead service jib can be expanded by hand','east freight bay permits new modular attachments'],setpiece_candidates:[{name:'Main dry-gate closure',site:'Central pressure datum',kind:'bridge_failure',scripted:false},{name:'Pressure-release reveal',site:'Ventricle upper release',kind:'machinery_activation',scripted:false},{name:'Export holdout',site:'Eastern cargo sorting',kind:'npc_encounter',scripted:false},{name:'Lower emergency return',site:'Dry return access',kind:'recovery_chase',scripted:false}],procedural_exemplar_value:'paired counter-inclined grounded superstructures with keyed void and asymmetrical inhabited banks; root-to-web-to-gallery hierarchy for procedural load-path grammars',similarity_avoidance:'Compared with Ferric Pendulum roof islands, Sundered Escarpment nested caves, Tin Canticle twin dish and Pilgrim Gait six legs, uses an open dry engineered basin, opposing ground-rooted diagonal gate leaves, and asymmetric mixed civic-industrial banks.',diversity_axes:{macro_topology:'basin',altitude_grammar:'tri_level',density_cadence:'dense_open_dense',route_structure:'branch_rejoin',landmark_family:'gate',support_form:'twin_pier',environment_relation:'fluid_containment',incompleteness:'modular_append_zones'}};
  const README=`# The Cobalt Ventricle — Split-Barrage Valve City\n\nGenuinely new original **2048×1024** CyberSand material-ID world. No source-image conversions, AI pictures, or simulated native screenshots. Exact orthographic side elevation.\n\n## Topological thesis\nTwo massive **opposed diagonal dry floodgate blades**, with separate grounded load paths, concentrate into a wide open **decompression ventricle**. Unlike a reflector/dish, this is an engineered dry *basin* with human-sized inspection chambers and accessible release controls. West Inlet Commune, West Pulse Gate industrial manifold, Central Dry Ventricle, East Governor House, and Egress Freight Town have distinguishable entered workfaces and editable service pockets. Three altitude bands support main travel, high-air detour and lower recovery. Floor-rooted, stable inert materials only. No actual water or event scripts.\n\n## Fixed gameplay sites\nSpawn **West inlet Midge spawn** \`(70,583)\`; goal **East daylight departure** \`(1970,641)\`. All ${total} literal sites are in receipt.json and are tested at complete Midge clearances 19×15, 23×19 and 31×27 via exact 4-neighbour free-centre flood fill; no site is shifted. Center datum ${JSON.stringify(SITES['Central pressure datum'])} is blocked by the test-only physical solid rectangle ${JSON.stringify(obstruction)}, leaving ${obstructed[2].reachable}/${total} reachable exact centres and both higher/lower clearance regions. No gameplay event is yet scripted.\n\n## Static construction receipt\n- Real material grid: ${N} bytes, SHA-256 \`${sourceHash}\`.\n- Setup-v2 JSON: ${jsonBytes.length} bytes, SHA-256 \`${setupHash}\`.\n- Lossless row-run/coalesced nonoverlapping rectangles: ${edits.length} / 32768; paint work ${work} cells.\n- All final occupied material cells are boundary-rooted inert Solid/None; ${pruned} provisional detached deco cells removed before serialization. No sand, liquid, gas, chemical or reactive cells.\n- Palette PNG indices are actual committed material IDs; overview and five 1:1 literal coordinate crops are generated directly from the same final grid.\n\n## Reproduction\nRun \`node build.cjs\` in this directory (Node.js 20+; no npm packages). Run \`python independent_verify.py\` (numpy/scipy/Pillow) for second-method reconstructed grid, material pixel and route tests. The generator emits exact Setup, receipts, corpus metadata and gallery PNGs deterministically.\n\n**NATIVE-UNTESTED:** no actual compatible Windows Godot/Workbench/CyberDemoBridge/Rapier import, collision ticks, Midge movement or save/cold-reopen was observed. Independent Art/Tech/Shepherd reviewer qualification pending. Keep Draft/HOLD, never owner accepted or Ready/merged automatically.\n`;
  const verifier=`#!/usr/bin/env python3\n\"\"\"Independent-method exact-cell CyberSand verifier for the Cobalt Ventricle.\"\"\"\nfrom pathlib import Path\nfrom hashlib import sha256\nimport json, numpy as np\nfrom PIL import Image\nfrom scipy import ndimage as ndi\nD=Path(__file__).resolve().parent\nr=json.loads((D/'receipt.json').read_text()); b=(D/'setup.json').read_bytes();s=json.loads(b)\nassert sha256(b).hexdigest()==r['setup_sha256']\nW,H=s['extent'];assert (W,H)==(2048,1024)\ng=np.zeros((H,W),dtype=np.uint8);cover=np.zeros((H,W),dtype=bool)\nwork=0\nfor x,y,w,h,m in s['edits']:\n assert w>0 and h>0 and x>=0 and y>=0 and x+w<=W and y+h<=H\n assert m in list(map(int,r['material_laws']))\n assert not cover[y:y+h,x:x+w].any()\n cover[y:y+h,x:x+w]=True;g[y:y+h,x:x+w]=m;work+=w*h\nassert work==r['construction_work']; assert sha256(g.tobytes()).hexdigest()==r['grid_sha256']\nassert {str(int(x)):int(n) for x,n in zip(*np.unique(g,return_counts=True))}==r['material_histogram']\noccupied=g!=0\nlabels,num=ndi.label(occupied,structure=np.array([[0,1,0],[1,1,1],[0,1,0]],bool))\nborder=np.concatenate((labels[0,:],labels[-1,:],labels[:,0],labels[:,-1]));root=np.unique(border[border>0])\nassert np.isin(labels[occupied],root).all(), 'detached material'\nassert int(occupied.sum())==r['grounded_inert_solids']\nfor name,entry in r['images'].items():\n im=Image.open(D/name);assert im.mode=='P';x,y,w,h=entry['origin'];assert im.size==(w,h)\n assert np.array_equal(np.array(im,dtype=np.uint8),g[y:y+h,x:x+w]),name\n assert sha256((D/name).read_bytes()).hexdigest()==entry['sha256'],name\ndef check(grid,wh):\n ww,hh=wh;assert ww%2==hh%2==1\n free=~ndi.maximum_filter(grid!=0,size=(hh,ww),mode='constant',cval=1)\n lbl,n=ndi.label(free,structure=np.array([[0,1,0],[1,1,1],[0,1,0]],bool))\n origin=r['sites']['West inlet Midge spawn'];value=lbl[origin[1],origin[0]];assert value>0\n missing=[n for n,(x,y) in r['sites'].items() if lbl[y,x]!=value]\n return len(r['sites'])-len(missing),missing,int((lbl==value).sum())\nfor rec in r['clearance']:\n n,missing,component=check(g,rec['footprint']);assert n==rec['reachable'] and missing==rec['missing'] and component==rec['component']\nob=g.copy();x,y,w,h=r['obstruction_xywh'];ob[y:y+h,x:x+w]=58\nfor rec in r['clearance_with_obstruction']:\n n,missing,component=check(ob,rec['footprint']);assert n==rec['reachable'] and missing==rec['missing'] and component==rec['component']\nout={'status':'CREATOR-EXECUTED SECOND-METHOD STATIC-PASS', 'native_status':'NATIVE-UNTESTED', 'audit_role':'not independent external reviewer', 'source_grid_sha256':r['grid_sha256'], 'setup_sha256':r['setup_sha256'], 'rectangles':len(s['edits']), 'material_cells':int(g.size), 'grounded_solids':int(occupied.sum()), 'full_hull_site_counts':[rec['reachable'] for rec in r['clearance']], 'obstructed_site_counts':[rec['reachable'] for rec in r['clearance_with_obstruction']], 'images_verified':len(r['images']), 'verified_pixel_count':sum(e['origin'][2]*e['origin'][3] for e in r['images'].values())}\n(D/'independent_verification.json').write_text(json.dumps(out,indent=2)+'\\n')\nprint('INDEPENDENT-METHOD SOURCE-STATIC PASS: grid / rectangles / ground / all full hulls / test obstruction / 6 PNGs')\nprint('NATIVE-UNTESTED. Not a native runtime or external reviewer certificate.')\n`;
  const files={'setup.json':json+'\n','receipt.json':JSON.stringify(receipt,null,2)+'\n','exemplar.json':JSON.stringify(exemplar,null,2)+'\n','README.md':README,'independent_verify.py':verifier,...imgs};
  // Serialization SHA is for the EXACT bytes actually committed: no trailing newline.
  files['setup.json']=json;
  return {files,summary:{rectangles:edits.length,setup_bytes:jsonBytes.length,sourceHash,setupHash,work,pruned,clearance:reach,blocked:obstructed,images:Object.fromEntries(Object.entries(imgs).map(([k,v])=>[k,v.length]))}};
}
const generated=generate();
for(const [name,payload] of Object.entries(generated.files))fs.writeFileSync(path.join(__dirname,name), typeof payload==='string'?payload:Buffer.from(payload));
console.log(JSON.stringify(generated.summary,null,2));
