'use strict';
function utf(s){let r=[];for(const z of s){let k=z.codePointAt(0);if(k<128)r.push(k);else if(k<2048)r.push(192|(k>>>6),128|(k&63));else if(k<65536)r.push(224|(k>>>12),128|((k>>>6)&63),128|(k&63));else r.push(240|(k>>>18),128|((k>>>12)&63),128|((k>>>6)&63),128|(k&63));}return Uint8Array.from(r);}

function sha256(msg){const k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2],n=(msg.length+9+63)&~63,b=new Uint8Array(n);b.set(msg);b[msg.length]=128;const bit=msg.length*8,view=new DataView(b.buffer);view.setUint32(n-8,Math.floor(bit/4294967296),false);view.setUint32(n-4,bit>>>0,false);let H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64),rr=(x,n)=>(x>>>n)|(x<<(32-n));for(let off=0;off<n;off+=64){for(let i=0;i<16;i++)w[i]=view.getUint32(off+4*i,false);for(let i=16;i<64;i++){let x=w[i-15],y=w[i-2];w[i]=(w[i-16]+(rr(x,7)^rr(x,18)^(x>>>3))+w[i-7]+(rr(y,17)^rr(y,19)^(y>>>10)))|0;}let[a,c,d,e,f,g,h,j]=H;for(let i=0;i<64;i++){let t=(j+(rr(f,6)^rr(f,11)^rr(f,25))+((f&g)^(~f&h))+k[i]+w[i])|0,u=((rr(a,2)^rr(a,13)^rr(a,22))+((a&c)^(a&d)^(c&d)))|0;j=h;h=g;g=f;f=(e+t)|0;e=d;d=c;c=a;a=(t+u)|0;}H=[(H[0]+a)|0,(H[1]+c)|0,(H[2]+d)|0,(H[3]+e)|0,(H[4]+f)|0,(H[5]+g)|0,(H[6]+h)|0,(H[7]+j)|0];}return H.map(x=>(x>>>0).toString(16).padStart(8,"0")).join("");}





function world(){
 const W=1024,H=2048,g=new Uint8Array(W*H),seed=202611211229;
 const M={0:"air",49:"iron",62:"plate",63:"blue",68:"steel",77:"signal",79:"amber",100:"basalt",101:"schist",121:"white",129:"black",130:"ceramic",131:"chrome"};
 const b=(x,y,w,h,m)=>{x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);if(x<0||y<0||w<1||h<1||x+w>W||y+h>H)throw Error("bounds "+[x,y,w,h,m]);for(let j=y;j<y+h;j++)g.fill(m,j*W+x,j*W+x+w);};
 const l=(x,y,X,Y,t,m)=>{let n=Math.ceil(Math.hypot(X-x,Y-y)/Math.max(2,t/2));for(let i=0;i<=n;i++){let q=i/n;b(x+(X-x)*q-t/2,y+(Y-y)*q-t/2,t,t,m);}};
 const sites=[["Upper fault spawn",509,137],["West rover clinic",235,312],["West med analysis",340,425],["East seismic dispatch",766,450],["Fork receiver station",818,568],["Upper bridge landing",521,710],["West ore triage",248,855],["Western crusher",293,1008],["Mid fault exchange",503,915],["East drill bypass upper",756,902],["East drill bypass middle",780,1072],["East drill bypass lower",757,1218],["Lower fault rejoin",513,1250],["West bore rescue",249,1454],["West lower survey",337,1550],["East quarantine intake",757,1467],["East biosieve",839,1584],["Fault archive overlook",516,1648],["West buried archives",240,1810],["East recorder vault",790,1826],["Lower recovery dock",511,1850],["Deep fault exit",514,1920]].map(([name,x,y])=>({name,x,y}));
 b(0,0,W,H,100);b(640,0,384,H,101);b(382,82,258,1909,0);b(389,0,238,94,0);
 // Two new geologically unequal banks, re-excavated as an alternating descent.
 for(const q of [[79,188,355,300],[584,284,361,342],[88,760,340,352],[591,652,342,327],[590,908,357,391],[77,1291,353,285],[585,1327,358,341],[84,1656,349,303],[583,1669,360,297]])b(...q,0);
 for(const q of [[345,215,100,220],[578,336,103,251],[345,809,100,267],[576,716,100,199],[575,963,107,303],[343,1377,107,157],[573,1430,120,200],[350,1696,99,241],[566,1723,132,214]])b(...q,0);
 // Upper west station: rover medicine, sampling, strong bench-bearing ribs.
 b(64,470,352,15,62);b(65,485,18,36,49);
 b(94,389,281,12,68);b(95,401,14,67,49);
 b(112,428,92,41,130);b(128,438,29,19,63);b(183,417,14,49,131);
 b(215,422,67,46,129);b(234,438,21,15,77);b(300,431,56,37,121);b(314,439,19,16,79);
 b(84,307,23,164,49);b(344,316,15,156,49);
 // East fork station: genuine two-prong seismograph, no skyline perspective.
 b(612,610,326,13,62);b(919,623,16,31,49);b(605,507,320,13,68);b(916,518,16,92,49);
 b(640,476,20,127,49);b(888,410,20,197,49);
 l(647,482,759,265,13,49);l(759,265,900,411,13,68);
 b(744,250,50,13,131);b(763,235,13,16,77);
 b(674,568,85,37,130);b(689,578,24,17,63);b(784,555,69,47,129);
 b(796,568,18,22,79);b(859,564,39,42,121);b(874,574,15,15,77);
 // Three independent, non-continuous cross-fault engineering technologies.
 b(368,682,128,11,68);b(494,685,69,8,131);l(612,656,571,694,10,68);b(603,659,52,9,62);
 // West excavation and ore grading: different station scale and inventory.
 b(73,1097,342,15,62);b(74,1112,18,33,49);
 b(90,1023,292,10,68);b(94,1033,15,63,49);
 b(116,1043,70,53,129);b(128,1057,24,20,79);b(198,1047,71,48,130);b(213,1061,24,19,63);
 b(287,1042,75,50,121);b(304,1056,24,16,77);
 b(112,876,280,13,62);b(115,887,19,137,49);
 b(156,927,85,30,129);b(171,936,26,13,79);b(278,931,65,28,130);b(290,938,21,13,63);
 b(373,1132,122,13,68);b(558,1153,98,13,62);
 l(465,1145,482,1168,9,49);l(578,1127,604,1160,9,131);
 // East vertical entered drill gallery is the real alternate around a blocked fault.
 b(654,1260,277,14,62);b(911,1110,15,151,49);
 b(709,1183,121,39,129);b(731,1194,30,16,77);
 b(850,1201,39,41,130);b(857,1211,18,15,63);
 b(689,1087,179,13,68);b(696,1099,14,64,49);
 b(746,1042,21,43,131);b(802,1051,19,36,49);
 // Unfurnished lower-west rescue chamber and a separate eastern quarantine lab.
 b(68,1557,347,14,62);b(81,1467,281,10,68);
 b(93,1477,16,79,49);b(337,1477,15,80,49);
 b(134,1501,81,53,129);b(153,1513,28,17,79);
 b(249,1507,76,46,130);b(265,1515,25,14,77);
 b(589,1647,348,15,62);b(920,1600,15,47,49);
 b(609,1570,311,11,68);b(913,1581,18,66,49);
 b(644,1594,88,49,130);b(660,1606,30,17,63);
 b(761,1601,87,42,129);b(781,1611,25,17,79);
 b(858,1585,47,57,121);b(871,1601,17,21,77);
 b(626,1392,245,12,62);b(636,1404,15,100,49);
 b(691,1469,79,35,129);b(709,1478,24,17,63);
 // Third lower crossing remains broken, leaving fall-through air clearance.
 b(381,1700,93,13,68);b(572,1725,105,13,131);
 l(460,1706,472,1730,9,49);l(602,1715,618,1737,9,49);
 // Deep rock-borne archive and recorder halls, opposite one another.
 b(73,1945,346,13,62);b(91,1864,292,10,68);
 b(90,1874,13,69,49);b(370,1874,13,71,49);
 b(131,1897,79,42,130);b(146,1906,28,16,63);
 b(253,1895,90,44,129);b(274,1907,30,19,77);
 b(595,1948,350,14,62);b(623,1872,291,10,68);
 b(626,1882,13,65,49);b(901,1882,13,65,49);
 b(695,1900,90,41,121);b(719,1914,25,13,79);
 b(805,1902,83,39,129);b(829,1913,24,16,63);
 for(let y of [365,745,1298,1668]){b(353,y,35,11,49);b(637,y+31,42,11,131);}
 // Full-scale alternative drill portals from core to east return corridor.
 b(594,793,112,146,0);b(590,1170,119,148,0);
 // Entered opposed full-hull diagnostic doorways, not scenic instrument gaps.
 b(590,404,226,87,0);b(591,523,253,83,0);
 // Literal site clearance (not a hidden waiver, search or substituted waypoint).
 for(const s of sites)b(s.x-20,s.y-18,41,37,0);
 // Service cabinets deliberately foot into the nearest grounded load-bearing deck.
 for(const [x,y,w,h,id] of [
 [120,432,71,38,130],[224,431,61,39,129],[316,446,51,24,130],
 [684,568,69,42,130],[859,570,48,40,129],
 [132,1032,75,65,129],[217,1043,67,54,130],[326,1050,56,47,129],
 [676,1215,65,45,130],[828,1209,62,51,129],
 [129,1504,74,53,130],[236,1511,58,46,129],
 [668,1593,79,54,130],[854,1601,64,46,129],
 [129,1901,84,44,130],[265,1903,78,42,129],
 [678,1907,79,41,130],[831,1901,74,47,129]
 ])b(x,y,w,h,id);
 for(const [x,y,w,h,id] of [
 [142,442,25,17,63],[245,441,22,16,79],[330,452,22,11,77],
 [705,576,24,18,63],[871,580,19,17,77],
 [150,1044,25,21,79],[237,1055,25,17,63],[344,1059,18,19,77],
 [692,1224,23,18,63],[840,1220,21,15,79],
 [145,1518,25,17,63],[248,1522,18,16,77],
 [683,1608,25,18,63],[871,1613,20,16,79],
 [148,1912,27,16,63],[285,1916,18,14,77],
 [696,1915,24,18,79],[850,1912,20,17,63]
 ])b(x,y,w,h,id);
 // Physically keep only stable boundary-connected material; never mimic air with pseudo-materials.
 const seen=new Uint8Array(g.length),q=new Int32Array(g.length);let a=0,z=0;
 function add(i){if(g[i]&&!seen[i]){seen[i]=1;q[z++]=i;}}
 for(let x=0;x<W;x++){add(x);add((H-1)*W+x);}
 for(let y=0;y<H;y++){add(y*W);add(y*W+W-1);}
 while(a<z){let i=q[a++],x=i%W;for(const j of [x?i-1:-1,x<W-1?i+1:-1,i>=W?i-W:-1,i+W<g.length?i+W:-1])if(j>=0)add(j);}
 let lost=0;for(let i=0;i<g.length;i++)if(g[i]&&!seen[i]){g[i]=0;lost++;}
// PORTRAIT-REPAIR-001 R2. Narrow bank-anchored crossings and drill instrumentation, AFTER source prune.
 b(361,650,24,43,49);
 b(372,644,77,9,68);
 l(380,651,479,679,7,49);
 b(451,658,24,22,130);
 b(458,662,10,10,77);
 b(635,637,20,44,49);
 b(585,645,60,8,68);
 b(611,625,22,19,131);
 b(615,630,12,8,77);
 b(628,632,12,29,49);
 b(370,1087,21,56,49);
 b(384,1085,104,10,68);
 b(394,1100,52,28,129);
 b(415,1107,19,13,79);
 l(463,1118,481,1139,7,49);
 l(378,1568,389,1700,7,49);
 b(373,1667,17,49,49);
 b(390,1666,53,10,68);
 b(443,1667,23,19,129);
 b(450,1672,12,8,79);
 l(459,1683,480,1719,7,49);
 b(923,1685,23,100,49);
 l(931,1700,670,1729,7,68);
 b(681,1720,25,20,129);
 b(919,858,23,83,49);
 l(929,878,839,882,7,62);
 b(844,878,22,26,130);
 b(854,883,10,10,77);
 b(925,1150,30,115,49);
 l(943,1184,833,1190,7,62);
 b(842,1191,24,24,130);
 b(849,1196,11,10,63);

// R2 Art P1 follow-up to independent review 7069837914:
// opposed bank-rooted tension terminals, cargo sender, real entered drill rooms.
// Do not close original open fault, fill authoring voids or relocate sites.
 b(372,626,15,29,49); b(631,623,17,26,49);
 l(380,637,543,618,6,68); l(614,628,640,632,6,62);
 b(477,613,17,13,131); b(484,619,8,48,49);
 b(478,661,25,10,68); b(492,670,7,16,49);
 b(371,637,24,9,131); b(623,626,28,8,131);
 // Distinct middle cargo sender, not another continuous high cable.
 b(480,1105,27,10,68); b(498,1102,12,38,49);
 b(487,1114,40,25,129); b(502,1122,13,10,79);
 // Rock-rooted upper drill inspection bay with left entrance and workhead.
 b(931,988,21,168,49);
 b(809,992,143,15,62); b(814,1139,138,17,68);
 b(809,1007,13,33,49); b(811,1113,13,26,49);
 b(888,1007,13,38,49);
 b(867,1043,53,40,129); b(880,1054,19,15,63);
 l(871,1062,854,1082,7,68);
 b(843,1113,60,26,130); b(858,1120,24,12,77);
 // Separate compressed lower return doorway, sharing real 1260 deck.
 b(808,1165,123,15,62);
 b(816,1243,112,17,68);
 b(816,1180,14,14,49); b(816,1225,14,18,49);
 b(895,1180,13,63,49);
 b(859,1197,48,36,129); b(873,1206,17,15,63);
 l(903,1216,928,1237,7,68);
 return {W,H,g,M,seed,sites,spawn:[sites[0].x,sites[0].y],discarded_ungrounded:lost,braceCount:0,bracedCells:0};
}
function encode(g,W,H){let rects=[],active=new Map();for(let y=0;y<H;y++){let now=new Map();for(let x=0;x<W;){let mat=g[y*W+x],left=x++;while(x<W&&g[y*W+x]===mat)x++;if(!mat)continue;const k=left+":"+ (x-left)+":"+mat;let r=active.get(k);if(r)r[3]++;else{r=[left,y,x-left,1,mat];rects.push(r);}now.set(k,r);}active=now;}return rects;}

function audit(w,rects){
 const {g,W,H,sites,spawn,M}=w,N=g.length,replay=new Uint8Array(N),used=new Uint8Array(N),hist={},legal=new Set(Object.keys(M).map(Number));let work=0,overlaps=0,bad=0;
 for(const [x,y,ww,hh,id]of rects){if(!legal.has(id)||x<0||y<0||ww<=0||hh<=0||x+ww>W||y+hh>H)throw Error("bad rectangle");work+=ww*hh;for(let yy=y;yy<y+hh;yy++)for(let xx=x;xx<x+ww;xx++){const k=yy*W+xx;if(used[k])overlaps++;used[k]=1;replay[k]=id;}}
 for(let i=0;i<N;i++){if(replay[i]!==g[i])bad++;hist[g[i]]=(hist[g[i]]||0)+1;}if(bad||overlaps)throw Error("rect parity "+bad+"/"+overlaps);
 const solid=id=>id!==0&&id!==3&&id!==8,seen=new Uint8Array(N),q=new Int32Array(N);let a=0,b=0;for(let x=0;x<W;x++){for(const i of [x,(H-1)*W+x])if(solid(g[i])&&!seen[i]){seen[i]=1;q[b++]=i;}}while(a<b){let i=q[a++],x=i%W,y=(i/W)|0;for(const j of[x?i-1:-1,x<W-1?i+1:-1,y?i-W:-1,y+1<H?i+W:-1])if(j>=0&&!seen[j]&&solid(g[j])){seen[j]=1;q[b++]=j;}}
 let total=0,airfaces=0,direct=0;for(let i=0;i<N;i++){const id=g[i];if(solid(id))total++;if(id!==3&&id!==8)continue;const x=i%W,y=(i/W)|0;for(const j of[x?i-1:-1,x+1<W?i+1:-1,y?i-W:-1,y+1<H?i+W:-1])if(j>=0){if(g[j]===0)airfaces++;if(id+g[j]===11&&(g[j]===3||g[j]===8))direct++;}}
 function route(ww,hh,block){let grid=block?g.slice():g;if(block){const[x,y,w,h]=block;for(let yy=y;yy<y+h;yy++)grid.fill(58,yy*W+x,yy*W+x+w);}const s=W+1,sum=new Int32Array((W+1)*(H+1));for(let y=1;y<=H;y++){let r=0;for(let x=1;x<=W;x++){r+=grid[(y-1)*W+x-1]?1:0;sum[y*s+x]=sum[(y-1)*s+x]+r;}}
 const dx=ww>>1,dy=hh>>1,free=new Uint8Array(N);let all=0;for(let y=dy;y+hh-dy<=H;y++)for(let x=dx;x+ww-dx<=W;x++){const l=x-dx,t=y-dy,r=l+ww,b=t+hh;if(sum[b*s+r]-sum[t*s+r]-sum[b*s+l]+sum[t*s+l]===0){free[y*W+x]=1;all++;}}
 const reached=new Uint8Array(N),qq=new Int32Array(N);let first=0,last=0,sp=spawn[1]*W+spawn[0];if(free[sp]){reached[sp]=1;qq[last++]=sp;}while(first<last){let i=qq[first++],x=i%W;for(const j of[x?i-1:-1,x<W-1?i+1:-1,i-W,i+W])if(j>=0&&j<N&&free[j]&&!reached[j]){reached[j]=1;qq[last++]=j;}}
 const sr=sites.map(v=>({...v,clear:!!free[v.y*W+v.x],reached:!!reached[v.y*W+v.x]}));return {hull:[ww,hh],valid_centres:all,connected_centres:last,passed:sr.filter(v=>v.reached).length,sites:sr};}
 const flight=[[19,15],[23,19],[31,27]].map(p=>route(...p,null)),obstruction=[389,980,252,79],blocked=route(31,27,obstruction);
 return {rectangles:rects.length,work,hist,rooted:b,total,detached:total-b,airfaces,direct,flight,obstruction,blocked};
}


// Exhaustive shortest path on the full 31x27 FREE-CENTRE 4-neighbour grid:
// no nearest-site substitution, Manhattan shortcut or missing 2D collision checks.
function shortest31(world,block){
 const {W,H,spawn,sites}=world,g=block?world.g.slice():world.g;
 if(block){const[x,y,ww,hh]=block;for(let yy=y;yy<y+hh;yy++)g.fill(58,yy*W+x,yy*W+x+ww);}
 const S=W+1,integral=new Int32Array(S*(H+1));
 for(let y=1;y<=H;y++){let run=0;for(let x=1;x<=W;x++){run+=g[(y-1)*W+x-1]!==0?1:0;integral[y*S+x]=integral[(y-1)*S+x]+run;}}
 const free=new Uint8Array(W*H);
 for(let y=13;y+14<=H;y++)for(let x=15;x+16<=W;x++){
  const l=x-15,t=y-13,rr=l+31,b=t+27;
  if(integral[b*S+rr]-integral[t*S+rr]-integral[b*S+l]+integral[t*S+l]===0)free[y*W+x]=1;
 }
 const end=sites.find(q=>q.name==="Deep fault exit");if(!end)throw Error("missing literal goal");
 const start=spawn[1]*W+spawn[0],finish=end.y*W+end.x,dist=new Int32Array(W*H),queue=new Int32Array(W*H);
 dist.fill(-1);let front=0,tail=0;
 if(!free[start]||!free[finish])throw Error("literal spawn/goal blocked");
 queue[tail++]=start;dist[start]=0;
 while(front<tail&&dist[finish]===-1){
  const i=queue[front++],x=i%W;
  for(const j of[x?i-1:-1,x+1<W?i+1:-1,i-W,i+W]){
   if(j>=0&&j<W*H&&free[j]&&dist[j]===-1){dist[j]=dist[i]+1;queue[tail++]=j;}
  }
 }
 return {steps:dist[finish],visited:tail};
}


function drillWaypointProof31(world,block){
 const {W,H,sites}=world,N=W*H,g=world.g.slice(),[bx,by,bw,bh]=block;
 for(let y=by;y<by+bh;y++)g.fill(58,y*W+bx,y*W+bx+bw);
 const S=W+1,I=new Int32Array(S*(H+1));for(let y=1;y<=H;y++){let run=0;for(let x=1;x<=W;x++){run+=g[(y-1)*W+x-1]!==0?1:0;I[y*S+x]=I[(y-1)*S+x]+run;}}
 const free=new Uint8Array(N);for(let y=13;y+14<=H;y++)for(let x=15;x+16<=W;x++){let a=x-15,t=y-13,r=a+31,d=t+27;if(I[d*S+r]-I[t*S+r]-I[d*S+a]+I[t*S+a]===0)free[y*W+x]=1;}
 function segment(first,last,minx){const start=[...sites,...extraSites].find(s=>s.name===first),end=[...sites,...extraSites].find(s=>s.name===last);if(!start||!end)throw Error("missing literal waypoint");const startId=start.y*W+start.x,finish=end.y*W+end.x,dist=new Int32Array(N),q=new Int32Array(N);dist.fill(-1);let a=0,z=0;if(!free[startId]||!free[finish]||start.x<minx||end.x<minx)return -1;q[z++]=startId;dist[startId]=0;while(a<z&&dist[finish]<0){let i=q[a++],x=i%W;for(const j of[x>minx?i-1:-1,x+1<W?i+1:-1,i-W,i+W])if(j>=0&&j<N&&j%W>=minx&&free[j]&&dist[j]<0){dist[j]=dist[i]+1;q[z++]=j;}}return dist[finish];}
 const extraSites=[{name:"Upper drill inspection mouth",x:835,y:1070},{name:"Lower drill return mouth",x:825,y:1208}];
 const names=["Upper fault spawn","East drill bypass upper","Upper drill inspection mouth","East drill bypass middle","Lower drill return mouth","East drill bypass lower","Lower fault rejoin","Deep fault exit"],legs=[];
 for(let i=1;i<names.length;i++){const minx=(i>=2&&i<=5)?700:0,steps=segment(names[i-1],names[i],minx);if(steps<0)throw Error("drill waypoint "+names[i]);legs.push({from:names[i-1],to:names[i],min_x:minx,steps});}
 const shortest=shortest31(world,block).steps;
 return {hull:[31,27],obstruction:block,entered_mouths:extraSites,ordered_waypoints:names,legs,total_steps:legs.reduce((a,e)=>a+e.steps,0),unconstrained_obstructed_shortest:shortest,forced_shortest:false,interpretation:"Physically obstructed ordered literal route enters both exact 31x27 upper inspection and lower return mouth centres; unrestricted shortest stays shaft-side and is NOT forced through either room. Interior side-gallery legs restrict free-centre x>=700."};
}

function concat(arr){const n=arr.reduce((p,a)=>p+a.length,0),out=new Uint8Array(n);let j=0;for(const a of arr){out.set(a,j);j+=a.length;}return out;}

function b32(k){return Uint8Array.of((k>>>24)&255,(k>>>16)&255,(k>>>8)&255,k&255);}

function crc32(a){let c=-1;for(let i=0;i<a.length;i++){c^=a[i];for(let j=0;j<8;j++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^(-1))>>>0;}

function adler32(a){let u=1,v=0;for(let i=0;i<a.length;i++){u=(u+a[i])%65521;v=(v+u)%65521;}return ((v<<16)|u)>>>0;}

function chunk(tag,data){const body=concat([utf(tag),data]);return concat([b32(data.length),body,b32(crc32(body))]);}

function png(g,W,x,y,w,h){const raw=new Uint8Array((w+1)*h);for(let yy=0;yy<h;yy++)raw.set(g.subarray((y+yy)*W+x,(y+yy)*W+x+w),yy*(w+1)+1);const z=[Uint8Array.of(0x78,0x01)];for(let i=0;i<raw.length;){const n=Math.min(65535,raw.length-i),block=new Uint8Array(n+5);block[0]=i+n===raw.length?1:0;block[1]=n&255;block[2]=n>>>8;block[3]=(~n)&255;block[4]=((~n)>>>8)&255;block.set(raw.subarray(i,i+n),5);z.push(block);i+=n;}z.push(b32(adler32(raw)));
 const colors={0:[8,11,18],49:[89,94,113],62:[124,142,155],63:[41,181,211],68:[181,194,198],77:[255,219,100],79:[206,138,57],100:[45,54,69],101:[63,71,88],121:[220,229,229],129:[28,43,52],130:[151,148,133],131:[180,198,198]},palette=new Uint8Array(132*3);for(const[k,v]of Object.entries(colors))palette.set(v,k*3);
 return concat([Uint8Array.of(137,80,78,71,13,10,26,10),chunk("IHDR",concat([b32(w),b32(h),Uint8Array.of(8,3,0,0,0)])),chunk("PLTE",palette),chunk("IDAT",concat(z)),chunk("IEND",new Uint8Array(0))]);
}

function verifyPNG(p,g,W,x,y,w,h){const v=new DataView(p.buffer,p.byteOffset,p.byteLength);let pos=8,z=null,sections=[];for(let i=0;i<8;i++)if(p[i]!==[137,80,78,71,13,10,26,10][i])throw Error("PNG signature");while(pos<p.length){let n=v.getUint32(pos,false),tag=String.fromCharCode(...p.subarray(pos+4,pos+8));if(crc32(p.subarray(pos+4,pos+8+n))!==v.getUint32(pos+8+n,false))throw Error("CRC");sections.push(tag);if(tag==="IHDR"&&(v.getUint32(pos+8,false)!==w||v.getUint32(pos+12,false)!==h))throw Error("PNG dimensions");if(tag==="IDAT")z=p.subarray(pos+8,pos+8+n);pos+=12+n;if(tag==="IEND")break;}if(pos!==p.length||sections.join()!=="IHDR,PLTE,IDAT,IEND")throw Error("PNG chunks");let raw=new Uint8Array((w+1)*h),j=2,k=0,done=0;while(!done){const header=z[j++];done=header&1;if(header&6)throw Error("DEFLATE mode");let len=z[j]|(z[j+1]<<8),inverse=z[j+2]|(z[j+3]<<8);j+=4;if(((len^inverse)&65535)!==65535)throw Error("DEFLATE stored length");raw.set(z.subarray(j,j+len),k);k+=len;j+=len;}if(k!==raw.length||adler32(raw)!==((z[j]*16777216+z[j+1]*65536+z[j+2]*256+z[j+3])>>>0))throw Error("zlib checksum");for(let yy=0;yy<h;yy++){if(raw[yy*(w+1)]!==0)throw Error("row filter");for(let xx=0;xx<w;xx++)if(raw[yy*(w+1)+xx+1]!==g[(y+yy)*W+x+xx])throw Error("pixel parity");}return w*h;}







function build(){
 const w=world(),rects=encode(w.g,w.W,w.H),a=audit(w,rects),direct=shortest31(w,null),detour=shortest31(w,[389,980,252,79]),drill=drillWaypointProof31(w,[389,980,252,79]);
 if(a.detached||a.airfaces||a.direct||a.flight.some(f=>f.passed!==w.sites.length)||a.blocked.passed!==w.sites.length||detour.steps<=direct.steps||drill.legs.some(e=>e.steps<0))
 throw Error("STATIC_GATE "+JSON.stringify({detached:a.detached,fluid:[a.airfaces,a.direct],passed:a.flight.map(f=>f.passed),bad:a.flight[2].sites.filter(s=>!s.reached),blocked:a.blocked.passed,steps:[direct.steps,detour.steps]}));
 const setup={version:2,extent:[1024,2048],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:w.spawn,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:2}}],next_id:2,selected:1,edits:rects,response:"LA-SELECTIVE",liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
 const setupText=JSON.stringify(setup),sha=sha256(w.g),setupSHA=sha256(utf(setupText));if(rects.length>32768||utf(setupText).length>1048576)throw Error("Setup limit");
 const crops=[["overview.png",0,0,1024,2048],["01-west-clinic.png",58,161,402,402],["02-seismic-fork.png",578,218,375,452],["03-ore-transfer.png",72,752,414,447],["04-east-drill-bypass.png",574,893,377,468],["05-quarantine.png",582,1312,370,367],["06-buried-archives.png",60,1639,888,333],["07-high-tension-joint.png",344,597,374,178],["08-cargo-drill-interface.png",345,990,606,292]],pngs={},pngMeta={};let px=0;
 for(const [n,x,y,ww,hh]of crops){const p=png(w.g,w.W,x,y,ww,hh);px+=verifyPNG(p,w.g,w.W,x,y,ww,hh);pngs[n]=p;pngMeta[n]={xywh:[x,y,ww,hh],bytes:p.length,sha256:sha256(p)};}
 const receipt={schema:1,trial:"PORTRAIT-001",difficulty:"OBVIOUS",source:{pr:177,head:"ed15c1b7d8be98548d087b247ed54b4a70498b01",path:"cybersand-canvases/2048x1024/original-scifi-frontier-wide-orthant-fault-seismic-ladder-261121/"},base:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",engine:"69209acaffb34ebe18c45e19290b5976b7fb2c82",seed:w.seed,dimensions:[1024,2048],cells:2097152,source_grid_sha256:sha,setup_sha256:setupSHA,setup_bytes:utf(setupText).length,rectangles:rects.length,construction_work:a.work,material_histogram:a.hist,ground:{total:a.total,rooted:a.rooted,detached:a.detached,pruned_provisional:w.discarded_ungrounded},fluid:{water:a.hist[3]||0,lava:a.hist[8]||0,exposed_faces:a.airfaces,water_lava_contacts:a.direct},hulls:a.flight,physical_obstruction:a.obstruction,obstructed:a.blocked,goal_distance:{direct:direct.steps,obstructed:detour.steps},repair:{programme:"PORTRAIT-REPAIR-001",lane:"R2 Orthant",original_parent_head:"598e8792b32a4922008b6d3dcb9208d21f03e477",original_setup_sha256:"195393bfca4cdb3f3bf35c6647eb0bdfd48ce5a06ad4ddba823c8a45316e3b30",independent_baseline_review:"https://github.com/techrote/sandmapsreference/pull/186#issuecomment-7062924203",altered_material_cells:45566,changed_bbox_xyxy:[361,613,955,1785],grounded_support:true,independent_art_delta_review:"https://github.com/techrote/sandmapsreference/pull/203#issuecomment-7069837914",prior_first_child_head:"10b045c8de8d4037d02ab998adc2b215ef4c2e23",entered_mouth_centres:[[835,1070],[825,1208]],scope:["opposed high-tension cantilevers/counterweight and central flight gap x371..650/y613..693","separate mid cargo sender x480..527/y1102..1140","entered east-bank upper inspection mouth and workhead x809..952/y988..1156","entered lower east-bank compressed return x808..931/y1165..1260","first R2 work kept: low fracture and original drill markers x373..955/y858..1785"],unchanged_and_protected:["existing 22 literal waypoints","west clinic, east fork, quarantine and entered archives","unfurnished fault void and broken joints"],drill,source_static_only:true,native:"NATIVE-UNTESTED"},pngs:pngMeta,pixel_parity:px,native:"NATIVE-UNTESTED"};
const aspect_transfer={
 source_extent:[2048,1024],target_extent:[1024,2048],source_pr:177,
 source_head:"ed15c1b7d8be98548d087b247ed54b4a70498b01",
 source_map_path:"cybersand-canvases/2048x1024/original-scifi-frontier-wide-orthant-fault-seismic-ladder-261121/",
 difficulty:"OBVIOUS",
 preserved:["unequal tectonic fault banks with root-connected engineering","western rover clinic and ore-processing settlement","asymmetric twin-pronged seismic receiver on an eastern station","eastern biological custody and deep entered archives","multiple broken or offset crossings and open editable shear"],
 transformed:["horizontal western/eastern districts into alternating left/right altitude-separated stations","source three crossing grades into distinct high cable inspection, ore-stage cantilevers and fractured lower deck","two-bank wide survey into descending flight itinerary with opposite-side archive endpoints","wide seismic mast into vertical rock-supported twin fork around an upper east station"],
 discarded:["original pixel positions and landmark coordinates","source exact bridge lengths and horizontal ordering","wide aspect edge-to-edge overflight"],
 newly_introduced:["obstruction-surviving optional route through exact entered upper inspection (835,1070) and lower return (825,1208) drill mouth centres and original drill waypoints; never forced shortest","deep central recovery dock linking separated archive chambers","vacant right maintenance and left bore expansion seams","right-to-left alternate return levels that rejoin a new lower fault exit"]
};
const route_graph={
 spawn:"Upper fault spawn",goal:"Deep fault exit",
 sites:w.sites.map(s=>({name:s.name,xy:[s.x,s.y]})),
 primary:["Upper fault spawn","West rover clinic","Upper bridge landing","Mid fault exchange","Lower fault rejoin","Fault archive overlook","Deep fault exit"],
 branches:[["Upper fault spawn","East seismic dispatch","Fork receiver station","Upper bridge landing"],["East drill bypass upper","East drill bypass middle","East drill bypass lower","Lower fault rejoin"],["West bore rescue","West lower survey","West buried archives","Lower recovery dock"]],
 exact_hull_results:a.flight.map(q=>({hull:q.hull,sites:q.sites})),
 obstruction:{rect:[389,980,252,79],material:58,goal_distance_direct:direct.steps,goal_distance_obstructed:detour.steps,all_named_sites_reachable_after:a.blocked.passed},ordered_drill_obstructed:drill
};
const exemplar={
 schema_version:1,purpose:["human_editable_canvas","procedural_exemplar","scripted_setpiece_source"],
 family:"portrait/obvious/orthant-rift-needle",map_role:"asymmetric alternating-station seismic fault with entered rescue bypass",
 anchor_donors:[{source_pr:177,source_head:aspect_transfer.source_head}],macro_topology:"asymmetric vertical tectonic fault with alternating rock-borne frontier pockets",
 density_profile:"compact inhabited/industrial pockets alternating on either side of a broad permanent open fault",
 route_grammar:{"main":route_graph.primary,"alternate":route_graph.branches},
 strong_motifs:["bank-rooted forked seismic aerial","western clinic to mineral triage","eastern bore bypass and quarantine","lower double-sided archives and recorder","fractured three-level crossing technology"],
 interesting_relationships:["source pairwise horizontal crossings become vertical left-right station alternation","one vertical rift corridor meets actual right-bank entered bypass","medic and mine support work differ from seismic and bio-custody","deep archive recovery remains reachable when central fault is obstructed"],
 authoring_affordances:["large reserved central fault void for live collapse scripting","unfurnished right maintenance cut for modular Gentek parts","left deep excavation seam for manual archaeology","separate broken low bridge ends for SWARM joint closure"],
 setpiece_candidates:[{name:"seismic mast activation",region:[600,225,935,626],scripted:false},{name:"fault lane collapse",region:[386,905,935,1320],scripted:false},{name:"quarantine lockdown",region:[590,1335,942,1660],scripted:false},{name:"deep archive rescue",region:[82,1655,945,1966],scripted:false}],
 procedural_exemplar_value:"Distinct rock-rooted high tension counterweights preserving the flight gap, separate mid cargo sender and low fracture; upper inspection and lower compressed drill portals on the right form an optional ordered 31x27 route under obstruction, not a forced shortest path.",
 similarity_avoidance:"Unlike the source Orthant's lateral fault colony, this portrait descends through sequential left/right stations, adds a separate right drill return and paired deep archive terminal without copying any source coordinates.",
 diversity_axes:{macro_topology:"vertical_fault",altitude_grammar:"vertical_spine",density_cadence:"alternating",route_structure:"branch_rejoin",landmark_family:"tower",support_form:"cliff_embedded",environment_relation:"geological",incompleteness:"modular_append_zones"},
 grid_sha256:sha,repair_parent_head:"598e8792b32a4922008b6d3dcb9208d21f03e477",native:"NATIVE-UNTESTED"
};
const readme=[
 "# Rift Needle - Alternating Seismic Stations",
 "",
 "PORTRAIT-001 Creator A | OBVIOUS | 1024x2048 actual material cells | Draft/HOLD | NATIVE-UNTESTED",
 "Source Orthant Fault PR #177 exact HEAD "+aspect_transfer.source_head,
 "Source folder "+aspect_transfer.source_map_path,
 "Read-only engine authority techrote/cybersand/main@69209acaffb34ebe18c45e19290b5976b7fb2c82.",
 "A genuinely new recomposition: alternating west rover clinic, east seismic mast, west ore, east quarantine and paired deep archives along a tall fault. An entered east drill gallery bypasses a real obstacle.",
 "The map is not rotated, cropped, scaled or coordinate-transplanted from the original. It retains deliberate editing voids.",
 "The reproducible standalone Node.js builder regenerates exact Setup, receipt, route_graph, aspect_transfer, exemplar and all indexed-material PNGs. Run node build.cjs .",
 "Six full-resolution 1:1 crops plus an authentic 1024x2048 indexed overview derive exclusively from the final committed material plane.",
 "The 19x15, 23x19 and 31x27 whole-hull free-centre BFS preserves all 22 original sites. Two extra fixed upper/lower drill-mouth centres are verified by ordered blocked 31x27 x>=700 route proof, not nearest-site substitutes. Actual Workbench/Rapier and save-reopen remain NOT TESTED.",
 "R2 independently reviewed Art P1 follow-up: high tension/counterweight gap, separate middle cargo sender, entered upper rock-founded inspection room and lower compression-framed return. Exact blocked 31x27 route enters both mouth centres, but unrestricted shortest stays shaft-side.",
 "First-child independent Art REWORK: https://github.com/techrote/sandmapsreference/pull/203#issuecomment-7069837914. Earlier independent source-static Technical PASS applies only to prior HEAD; new exact-child Art and Technical reviews required. Original portrait and donor unchanged.",
 "No merge/Ready promotion or owner acceptance."
].join("\n")+"\n";
 return {setupText,receipt,pngs,aspect_transfer,route_graph,exemplar,readme};
}
if(typeof require!=="undefined" && typeof module!=="undefined" && require.main===module){const fs=require("fs"),path=require("path"),d=process.argv[2]||__dirname;fs.mkdirSync(d,{recursive:true});const a=build();fs.writeFileSync(path.join(d,"setup.json"),a.setupText);fs.writeFileSync(path.join(d,"receipt.json"),JSON.stringify(a.receipt,null,2)+"\n");for(const[n,v]of Object.entries(a.pngs))fs.writeFileSync(path.join(d,n),v);for(const [n,v] of [["aspect_transfer.json",a.aspect_transfer],["route_graph.json",a.route_graph],["exemplar.json",a.exemplar]])fs.writeFileSync(path.join(d,n),JSON.stringify(v,null,2)+"\n");fs.writeFileSync(path.join(d,"README.md"),a.readme);console.log(a.receipt);}
if(typeof module!=="undefined")module.exports={build,world,encode,audit,shortest31,png,verifyPNG};