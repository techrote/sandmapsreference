'use strict';
function utf(s){let r=[];for(const z of s){let k=z.codePointAt(0);if(k<128)r.push(k);else if(k<2048)r.push(192|(k>>>6),128|(k&63));else if(k<65536)r.push(224|(k>>>12),128|((k>>>6)&63),128|(k&63));else r.push(240|(k>>>18),128|((k>>>12)&63),128|((k>>>6)&63),128|(k&63));}return Uint8Array.from(r);}

function sha256(msg){const k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2],n=(msg.length+9+63)&~63,b=new Uint8Array(n);b.set(msg);b[msg.length]=128;const bit=msg.length*8,view=new DataView(b.buffer);view.setUint32(n-8,Math.floor(bit/4294967296),false);view.setUint32(n-4,bit>>>0,false);let H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64),rr=(x,n)=>(x>>>n)|(x<<(32-n));for(let off=0;off<n;off+=64){for(let i=0;i<16;i++)w[i]=view.getUint32(off+4*i,false);for(let i=16;i<64;i++){let x=w[i-15],y=w[i-2];w[i]=(w[i-16]+(rr(x,7)^rr(x,18)^(x>>>3))+w[i-7]+(rr(y,17)^rr(y,19)^(y>>>10)))|0;}let[a,c,d,e,f,g,h,j]=H;for(let i=0;i<64;i++){let t=(j+(rr(f,6)^rr(f,11)^rr(f,25))+((f&g)^(~f&h))+k[i]+w[i])|0,u=((rr(a,2)^rr(a,13)^rr(a,22))+((a&c)^(a&d)^(c&d)))|0;j=h;h=g;g=f;f=(e+t)|0;e=d;d=c;c=a;a=(t+u)|0;}H=[(H[0]+a)|0,(H[1]+c)|0,(H[2]+d)|0,(H[3]+e)|0,(H[4]+f)|0,(H[5]+g)|0,(H[6]+h)|0,(H[7]+j)|0];}return H.map(x=>(x>>>0).toString(16).padStart(8,"0")).join("");}





function world(){
 const W=1024,H=2048,g=new Uint8Array(W*H),seed=202611211426;
 const M={0:"air",49:"iron",62:"plate",63:"blue",68:"steel",77:"signal",79:"amber",100:"basalt",101:"schist",121:"white",129:"black",130:"ceramic",131:"chrome"};
 const b=(x,y,w,h,m)=>{x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);if(x<0||y<0||w<1||h<1||x+w>W||y+h>H)throw Error("bounds "+[x,y,w,h,m]);for(let j=y;j<y+h;j++)g.fill(m,j*W+x,j*W+x+w);};
 const l=(x,y,X,Y,t,m)=>{let n=Math.ceil(Math.hypot(X-x,Y-y)/Math.max(2,t/2));for(let i=0;i<=n;i++){let q=i/n;b(x+(X-x)*q-t/2,y+(Y-y)*q-t/2,t,t,m);}};
 const sites=[
 ["High suture arrival",573,152],["Registry chamber",230,347],["Intake dispatch",286,446],
 ["West diagnostic",245,638],["Blue assay shelf",267,756],["Open upper crossing",577,797],
 ["East selector",819,931],["Sterile assay",818,1010],["Right sterile entry",791,1065],
 ["Sterile return midpassage",788,1178],["Right sterile lower mouth",794,1347],
 ["Isolation counters",823,1456],["Central return rejoin",558,1395],["Left unfinished archive",189,1650],
 ["Archive outer mouth",399,1578],["Low service connection",534,1665],
 ["Buried dispatch repair",395,1811],["Lower dispatch hatch",553,1867]
 ].map(([name,x,y])=>({name,x,y}));
 // Multibank stepped geology rather than a rotated source or continuous parallel-wall shaft.
 b(0,190,510,660,100);b(0,850,280,640,101);b(650,650,374,850,101);
 b(0,1490,440,410,100);b(640,1500,384,400,101);b(0,1900,1024,148,100);
 b(278,996,189,308,101); // central left buttress grounds the deliberately restricted passage.
 // Real, unlike entered volumes; two west assays, two eastern custody chambers.
 b(90,252,450,246,0);b(392,305,214,125,0);
 b(129,548,458,284,0);b(388,578,218,183,0);
 b(590,851,367,278,0);b(561,874,270,198,0);
 b(588,1226,372,310,0);b(550,1253,287,192,0);
 b(102,1527,431,278,0);b(368,1550,241,150,0);
 b(263,1754,515,137,0);b(449,1657,139,245,0);
 // East service return has both entered high and low portals through the geologic shell.
 b(740,1019,134,398,0);
 // Unlike registration, assay and quarantine apparatus have different visible industrial silhouettes.
 b(87,482,348,14,68);b(101,465,99,30,130);b(123,472,32,15,63);
 b(254,463,128,31,129);b(284,474,25,14,79);b(95,332,15,134,49);
 b(111,329,183,10,62);b(138,310,49,17,121);b(204,308,62,17,77);
 b(125,808,270,15,62);b(143,778,126,29,129);b(165,786,34,15,63);
 b(291,770,115,35,130);b(316,777,33,16,79);
 b(142,578,15,194,49);b(160,585,204,12,68);
 b(178,602,48,18,130);b(261,602,70,21,129);
 // Supported upper short exchange and diagnostic cage hang from west rooted rock.
 b(425,468,14,286,49);b(425,752,101,12,68);
 b(490,765,12,54,49);b(507,814,35,12,77);
 b(507,830,110,10,62);l(507,839,637,913,7,49);
 b(521,806,66,20,130);b(539,810,18,12,63);
 // East selector has a *different* direct cargo transfer and open service rail.
 b(855,1107,156,12,68);b(976,1088,14,22,49);
 b(874,1075,94,27,130);b(893,1082,24,14,63);
 b(651,862,319,11,62);b(671,846,17,18,49);
 b(706,882,98,24,129);b(726,889,25,14,77);
 b(822,886,103,32,130);b(848,894,23,17,63);
 // Three work-facing side-sleeve endpoints: clear passage x740..845 remains.
 b(858,1164,116,13,62);b(883,1135,64,25,129);b(903,1142,18,12,79);
 b(863,1290,131,12,68);b(895,1268,67,21,130);
 b(911,1273,21,13,77);
 b(851,1487,150,13,68);b(964,1469,15,25,49);
 b(868,1458,93,28,130);b(890,1465,22,15,63);
 b(717,1323,231,11,62);b(925,1309,16,18,49);
 b(879,1360,82,26,129);b(903,1368,17,13,79);
 // Broken low handoff has open joints rather than a cloned perfect bridge.
 b(454,1437,96,11,68);b(460,1448,10,45,49);
 b(618,1399,87,12,62);b(693,1411,11,50,49);
 l(477,1490,532,1547,7,49);l(691,1457,655,1513,7,49);
 // Incomplete entered west archive and a low repair/dispatch shop as potential event sites.
 b(99,1770,307,12,68);b(115,1747,114,31,129);
 b(137,1755,25,15,79);b(268,1744,102,30,130);b(298,1752,22,15,63);
 b(268,1882,503,13,62);b(284,1762,14,117,49);
 b(752,1771,14,108,49);b(302,1853,112,26,130);
 b(328,1861,24,14,63);b(455,1842,101,38,129);
 b(476,1851,26,19,79);b(614,1841,111,39,130);
 b(638,1851,27,14,63);
 b(577,802,87,173,0); // engineer a full 31x27 north-south clearance past partly braced high handoff

 // PORTRAIT-REPAIR-001 R4: bounded vault thresholds; preserve the 18 authored centres.
 // High west registry: 70-cell outer portal and 63-cell internal custody threshold.
 b(92,251,450,14,101);b(493,262,18,62,101);b(493,394,18,100,101);
 b(345,260,12,70,100);b(345,393,12,104,100);b(90,408,12,90,101);
 // Lower west diagnostics: separate lower 86-cell doorway and rooted instrument landing.
 b(505,548,17,172,101);b(505,806,17,26,101);b(148,668,127,10,62);
 // Upper east selector: 74-cell side entry, strong overhanging roof, sterile floor hatch.
 b(617,850,343,12,101);b(617,851,18,57,101);b(617,982,18,144,101);
 b(617,1119,124,14,101);b(851,1119,108,14,101);
 b(729,851,14,61,49);b(729,978,14,152,49);
 // 81-cell rock-rooted sterile neck between selector and isolation cavities.
 b(737,1133,30,93,101);b(848,1133,28,93,101);
 // Lower east quarantine: offset roof, 80-cell west threshold, supported assay partition.
 b(631,1212,115,16,101);b(868,1212,92,16,101);
 b(618,1228,18,75,101);b(618,1383,18,151,101);b(618,1529,116,13,101);
 b(884,1228,14,112,49);b(884,1404,14,132,49);
 b(900,1489,45,48,130);b(900,1520,45,16,68);
 // Genuine lower portal through old crossing shelf; no actor-centre shifting.
 b(764,1320,92,17,0);
  // R4 follow-up to independent Art REWORK: unlike entered diagnostic and east custody threshold.
 b(151,549,338,18,101);b(348,567,26,80,101);b(348,731,26,79,101);
 b(382,567,100,17,100);b(418,549,12,31,101);
 b(425,656,14,82,0); // physical 82-cell opening in existing hanger; not a decorative entrance
 b(160,688,126,12,62);b(161,674,12,26,49);b(390,686,42,14,68);
 // Selector offset internal airlock gate, outside original west entry and sterile neck.
 b(657,863,15,68,101);b(657,1002,15,116,101);
 b(697,862,126,14,101);b(679,1030,62,12,62);
 // Unequal lower quarantine vestibule, preserving literal Midge clearance.
 b(636,1228,44,95,101);b(636,1393,44,143,101);
 b(680,1228,66,16,101);b(696,1244,13,48,101);
 // R4 THIRD narrow Art REWORK: distinct west entered geology, unequal east selector vault.
 // Independent Art finding: https://github.com/techrote/sandmapsreference/pull/205#issuecomment-7071145680
 // Rock-cut diagnostic recess: two physically open Midge-scale side thresholds and a
 // bottom access slit around the literal low diagnostic gate, not a display hall fill.
 b(363,575,180,239,101);b(391,612,145,149,0);
 b(361,649,40,84,0);b(531,667,38,81,0);
 b(495,744,44,77,0); // preserve the exact [515,780] 31x27 gate
 b(406,732,70,28,130);b(429,737,22,14,63);
 // Upper selector: compact upper rock-cut vault and lateral entry, unlike
 // the long lower quarantine landing, with open sterile floor return.
 b(682,868,237,244,101);b(705,900,190,185,0);
 b(682,918,30,81,0);b(888,957,35,80,0);
 b(743,1074,99,52,0);b(731,1082,39,10,68);
 // Site hulls are literal authored centres with 39x35 local clean safety, not shifted.
 for(const s of sites)b(s.x-19,s.y-17,39,35,0);
 // Make every inert cell boundary-grounded, discarding only provisional loose detail.
 const seen=new Uint8Array(g.length),q=new Int32Array(g.length);let a=0,z=0;
 function add(i){if(g[i]&&!seen[i]){seen[i]=1;q[z++]=i;}}
 for(let x=0;x<W;x++){add(x);add((H-1)*W+x);}
 for(let y=0;y<H;y++){add(y*W);add(y*W+W-1);}
 while(a<z){let i=q[a++],x=i%W;for(const j of [x?i-1:-1,x<W-1?i+1:-1,i>=W?i-W:-1,i+W<g.length?i+W:-1])if(j>=0)add(j);}
 let lost=0;for(let i=0;i<g.length;i++)if(g[i]&&!seen[i]){g[i]=0;lost++;}
 return {W,H,g,M,seed,sites,spawn:[sites[0].x,sites[0].y],discarded_ungrounded:lost};
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
 const flight=[[19,15],[23,19],[31,27]].map(p=>route(...p,null)),obstruction=[462,1053,220,184],blocked=route(31,27,obstruction);
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
 const end=sites.find(q=>q.name==="Lower dispatch hatch");if(!end)throw Error("missing literal goal");
 const start=spawn[1]*W+spawn[0],finish=end.y*W+end.x,dist=new Int32Array(W*H),parent=new Int32Array(W*H),queue=new Int32Array(W*H);
 dist.fill(-1);let front=0,tail=0;
 if(!free[start]||!free[finish])throw Error("literal spawn/goal blocked");
 queue[tail++]=start;dist[start]=0;
 while(front<tail&&dist[finish]===-1){
  const i=queue[front++],x=i%W;
  for(const j of[x?i-1:-1,x+1<W?i+1:-1,i-W,i+W]){
   if(j>=0&&j<W*H&&free[j]&&dist[j]===-1){dist[j]=dist[i]+1;parent[j]=i;queue[tail++]=j;}
  }
 }
 let entered=0,atLevel=[],walked=0;
 if(dist[finish]>=0){for(let i=finish;i!==start;i=parent[i]){
  if(i<0||walked>W*H)throw Error("invalid route parent");
  const x=i%W,y=(i/W)|0;
  if(y>=1033&&y<=1390&&x>=739&&x<=875)entered++;
  if(y===1000&&atLevel.length<5)atLevel.push([x,y]);
  walked++;
 }}
 return {steps:dist[finish],visited:tail,entered_side_gallery_cells:entered,crossing_at_y1000:atLevel};
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








function r4WaypointProof(w,obstruction){
 const W=w.W,H=w.H,N=W*H,S=W+1,g=w.g.slice(),sat=new Int32Array(S*(H+1)),free=new Uint8Array(N);
 const [bx,by,bw,bh]=obstruction;for(let y=by;y<by+bh;y++)g.fill(58,y*W+bx,y*W+bx+bw);
 for(let y=1;y<=H;y++){let r=0;for(let x=1;x<=W;x++){r+=g[(y-1)*W+x-1]?1:0;sat[y*S+x]=sat[(y-1)*S+x]+r;}}
 for(let y=13;y+14<=H;y++)for(let x=15;x+16<=W;x++){let l=x-15,t=y-13,rr=l+31,b=t+27;if(sat[b*S+rr]-sat[t*S+rr]-sat[b*S+l]+sat[t*S+l]===0)free[y*W+x]=1;}
 const sites=Object.fromEntries(w.sites.map(q=>[q.name,[q.x,q.y]]));
 const mark=new Int32Array(N),parents=new Int32Array(N),queue=new Int32Array(N);let stamp=0;
 function bfs(p,q){
  const a=p[1]*W+p[0],b=q[1]*W+q[0];if(!free[a]||!free[b])throw Error("R4 blocked literal site or gate "+JSON.stringify([p,q]));
  let h=0,t=0;++stamp;mark[a]=stamp;parents[a]=-1;queue[t++]=a;
  while(h<t&&mark[b]!==stamp){let i=queue[h++],x=i%W;for(const j of[x?i-1:-1,x<W-1?i+1:-1,i-W,i+W])if(j>=0&&j<N&&free[j]&&mark[j]!==stamp){mark[j]=stamp;parents[j]=i;queue[t++]=j;}}
  if(mark[b]!==stamp)throw Error("R4 disconnected literal route "+JSON.stringify([p,q]));
  let steps=0,neck=0,upper=false,lower=false;for(let i=b;i!==a;i=parents[i]){let x=i%W,y=(i/W)|0;steps++;if(x>=782&&x<=832&&y>=1146&&y<=1212){neck++;if(y<=1160)upper=true;if(y>=1200)lower=true;}}
  return {steps,sterile_neck_centres:neck,upper_neck:upper,lower_neck:lower};
 }
 const doors=[["registry high gate","Registry chamber",[500,359],70],["diagnostic low gate","West diagnostic",[515,780],86],["selector west gate","East selector",[626,945],74],["quarantine west gate","Right sterile lower mouth",[627,1344],80]]
  .map(([name,site,point,opening_cells])=>({name,site,point,opening_cells,route:bfs(sites[site],point)}));
 const names=["High suture arrival","Right sterile entry","Sterile return midpassage","Right sterile lower mouth","Lower dispatch hatch"];
 const segments=names.slice(1).map((v,i)=>({from:names[i],to:v,...bfs(sites[names[i]],sites[v])}));
 if(!segments[1].upper_neck||!segments[2].lower_neck)throw Error("R4 ordered bypass missed both sterile neck portals");
 return {hull:[31,27],obstruction,method:"exact 31x27 clearance via integral image; literal 4-neighbour BFS; ordered segment backtracking",four_vault_portals:doors,ordered_waypoints:names,segments,via_distance:segments.reduce((n,q)=>n+q.steps,0),forced_shortest:false};
}

function baseBuild(){
 const w=world(),rects=encode(w.g,w.W,w.H),a=audit(w,rects),direct=shortest31(w,null),detour=shortest31(w,[462,1053,220,184]);
 if(a.detached||a.airfaces||a.direct||a.flight.some(f=>f.passed!==w.sites.length)||a.blocked.passed!==w.sites.length||detour.steps<=direct.steps||false)
 throw Error("STATIC_GATE "+JSON.stringify({detached:a.detached,fluid:[a.airfaces,a.direct],passed:a.flight.map(f=>f.passed),bad:a.flight[2].sites.filter(s=>!s.reached),blocked:a.blocked.passed,steps:[direct.steps,detour.steps]}));
 const setup={version:2,extent:[1024,2048],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:w.spawn,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:2}}],next_id:2,selected:1,edits:rects,response:"LA-SELECTIVE",liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
 const setupText=JSON.stringify(setup),sha=sha256(w.g),setupSHA=sha256(utf(setupText));if(rects.length>32768||utf(setupText).length>1048576)throw Error("Setup limit");
 const crops=[["overview.png",0,0,1024,2048],["01-upper-seed-registry.png",89,248,524,271],["02-west-diagnostics.png",124,537,512,312],["03-bridge-assay.png",422,777,298,239],["04-east-sterile-service.png",587,847,423,567],["05-lower-quarantine-archive.png",95,1220,906,587],["06-buried-repair.png",261,1642,518,256]],pngs={},pngMeta={};let px=0;
 for(const [n,x,y,ww,hh]of crops){const p=png(w.g,w.W,x,y,ww,hh);px+=verifyPNG(p,w.g,w.W,x,y,ww,hh);pngs[n]=p;pngMeta[n]={xywh:[x,y,ww,hh],bytes:p.length,sha256:sha256(p)};}
 const receipt={schema:1,trial:"PORTRAIT-001",difficulty:"MODERATE",source:{pr:175,head:"5d97133f3b33bf5b29f92eb65ccf7c884d9e5804",path:"cybersand-canvases/2048x1024/worldgroup-xenobiome-cinderfold-seed-courier-buried-assay-interchange-261121/"},base:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",engine:"69209acaffb34ebe18c45e19290b5976b7fb2c82",seed:w.seed,dimensions:[1024,2048],cells:2097152,source_grid_sha256:sha,setup_sha256:setupSHA,setup_bytes:utf(setupText).length,rectangles:rects.length,construction_work:a.work,material_histogram:a.hist,ground:{total:a.total,rooted:a.rooted,detached:a.detached,pruned_provisional:w.discarded_ungrounded},fluid:{water:a.hist[3]||0,lava:a.hist[8]||0,exposed_faces:a.airfaces,water_lava_contacts:a.direct},hulls:a.flight,physical_obstruction:a.obstruction,obstructed:a.blocked,goal_distance:{direct:direct.steps,obstructed:detour.steps,forced_side_gallery_path_cells:detour.entered_side_gallery_cells,crossing_at_y1000:detour.crossing_at_y1000},pngs:pngMeta,pixel_parity:px,native:"NATIVE-UNTESTED"};
const aspect_transfer={},route_graph={},exemplar={},readme='';
 return {setupText,receipt,pngs,aspect_transfer,route_graph,exemplar,readme};
}
function build(){
 const r=baseBuild(),S="5d97133f3b33bf5b29f92eb65ccf7c884d9e5804",P="cybersand-canvases/2048x1024/worldgroup-xenobiome-cinderfold-seed-courier-buried-assay-interchange-261121/";
 r.receipt.r4_waypoint_proof=r4WaypointProof(world(),[462,1053,220,184]);
 const route=r.route_graph={spawn:"High suture arrival",goal:"Lower dispatch hatch",sites:r.receipt.hulls[2].sites.map(q=>({name:q.name,xy:[q.x,q.y]})),primary:["High suture arrival","Registry chamber","West diagnostic","Open upper crossing","East selector","Isolation counters","Lower dispatch hatch"],branches:[["East selector","Right sterile entry","Sterile return midpassage","Right sterile lower mouth","Central return rejoin"],["Left unfinished archive","Archive outer mouth","Low service connection","Buried dispatch repair"]],obstruction:{rect:[462,1053,220,184],site_count_post_obstruction:r.receipt.obstructed.passed,route:r.receipt.goal_distance},exact_hull_results:r.receipt.hulls};
 r.aspect_transfer={source_extent:[2048,1024],target_extent:[1024,2048],source_pr:175,source_head:S,source_map_path:P,difficulty:"MODERATE",preserved:["four physically entered but unequal geological xenoseed work districts","registry→diagnostic→selector→quarantine→repair custody logic","inert rock-rooted support and archive editing seams"],transformed:["horizontal inset rock chambers into staggered alternate-bank vertical procession","two local service return pockets into an engineered longer east-bank sterile shaft","large continuous roof into unequal staggered root-banks and open courier crossings"],discarded:["source grid, rectangle streams, coordinates and lateral room widths","old contiguous wide roof and parallel local bypass layout"],newly_introduced:["two unlike elevated crossings and partial low freight joint","independently entered multi-height sterile side route","lower dry workshop and archive enlargement"]};
 r.exemplar={schema_version:1,purpose:["human_editable_canvas","procedural_exemplar","scripted_setpiece_source"],family:"portrait/moderate/cinderfold-suture-lantern",map_role:"staggered actual entered xenoseed chambers with geologic two-bank transfer and sterile return",anchor_donors:[{source_pr:175,source_head:S}],macro_topology:"unequal entered alternating-bank vaults, independent right-side return and deep repair",density_profile:"entered high registry and west diagnostic, open transfer, right selector/sterile sequence, low archive",route_grammar:{main:route.primary,alternate:route.branches},strong_motifs:["rock-cut dissimilar process chambers","east-bank long sterile return","intentionally broken low cross-bank cargo interface","opened west archive and basal relief"],interesting_relationships:["horizontal source workface adjacency becomes staggered vertical two-bank custody","one long side sterile return permits recovery after a main-lane obstruction"],authoring_affordances:["west archive and lower repair left with procedural sockets","unfinished low bridge supports event failure or future repair","open sky over actual cliff sequence"],setpiece_candidates:[{name:"suture bridge failure",region:[420,785,700,1005],scripted:false},{name:"sterile return lockdown",region:[730,1010,875,1410],scripted:false},{name:"archive encounter",region:[99,1519,535,1806],scripted:false},{name:"basal freight departure",region:[264,1740,770,1897],scripted:false}],procedural_exemplar_value:"Asymmetric geology-based transformation of a five-step assay custody chain, emphasizing crossed bank ownership rather than vertical dual-wall shafts.",similarity_avoidance:"Distinct from original Cinderfold buried horizontal workrooms and sibling aerial-braided trestle; unlike recent roof-rooted portrait shafts this composition changes bank, root and chamber shape per stage.",diversity_axes:{macro_topology:"mixed",altitude_grammar:"multi_strata",density_cadence:"alternating",route_structure:"branch_rejoin",landmark_family:"gantry",support_form:"cliff_embedded",environment_relation:"geological",incompleteness:"excavation"},grid_sha256:r.receipt.source_grid_sha256,native:"NATIVE-UNTESTED"};
 r.route_graph.obstruction.r4_ordered_sterile_route=r.receipt.r4_waypoint_proof;
 r.aspect_transfer.repair_r4={parent:"089d2cdb6b06b40d53ce9c4c83ef34192567454d",touched_regions:[[89,248,613,519],[124,537,636,849],[587,847,1010,1414],[588,1212,960,1542]],intent:"Distinct entered geologic vaults with thresholds and narrow sterile return",preserve:["18 literal site centres","central air drop","unfinished west archive","two-bank staggered process custody"],native:"NATIVE-UNTESTED",independent_reviews:"PENDING"};
 r.exemplar.repair_r4={source_parent:"089d2cdb6b06b40d53ce9c4c83ef34192567454d",verdict:"PENDING_INDEPENDENT_REVIEW",protected_voids:["central flight drop","west archive expansion seam"],new_relationships:["registry high split","diagnostic lower threshold","selector-side door","sterile 81-cell neck","quarantine-side door"]};
 Object.assign(r.receipt,{difficulty:"MODERATE",source:{pr:175,head:S,path:P}});
 const mid=r.receipt.obstructed.sites.find(q=>q.name==="Sterile return midpassage");
 const goal=r.receipt.obstructed.sites.find(q=>q.name==="Lower dispatch hatch");
 if(!mid||!mid.clear||!mid.reached||!goal||!goal.reached)throw Error("entered waypoint recovery disconnected");
 const {direct,obstructed}=r.receipt.goal_distance;
 r.receipt.goal_distance={direct,obstructed,shortest_path_uses_sterile_return:false,entered_return_waypoint_reachable_after_obstruction:true,alternate_via:"Sterile return midpassage",alternate_existence_proof:"both literal via and goal centres are in spawn's 31x27 free-centre connected component under the physical obstruction"};
 r.route_graph.obstruction.route=r.receipt.goal_distance;

 r.readme="# Cinderfold Suture Lantern — Entered Vault Exchange\n\nPORTRAIT-001 Creator A · MODERATE #1 · 1024×2048 · Draft/HOLD · NATIVE-UNTESTED\n\nRead-only source original PR #175 @ "+S+" in "+P+"\nRead-only CyberSand main @ 69209acaffb34ebe18c45e19290b5976b7fb2c82. Corpus main @ 99a166e7fcae45eb22be1740e9f33f62faccbcc7.\n\nNo crop, rotation, stretch, source coordinate/geometry/pixel reuse or donor branch mutation. Actual 2D material cells. Distinct entering seed vaults, assays, selection and isolation, with separate sterile return.\n\n`node build.cjs` reproducibly generates exact Setup-v2 JSON, SHA and physical-law receipts, full-grid authentic indexed overview, six useful true 1:1 district crops, aspect transfer, route and exemplar. Native flight, collision and persistence NATIVE-UNTESTED. No merge or Ready.\n";
 r.readme+="\\n## R4 bounded repair (separate child branch)\\n\\nBaseline exact portrait HEAD: 089d2cdb6b06b40d53ce9c4c83ef34192567454d. Four distinct 31x27-clear physical chamber thresholds and 81-cell sterile neck. Full obstruction-checked ordered waypoint proof in receipt.json and route_graph.json; not claimed to be the forced shortest route. No change to 18 original centres, central open shaft or unfinished west archive. The parent PNG gallery remains the immutable BEFORE reference; child PNGs are generated from real edited cells. Independent Art/Technical and live Godot/Rapier/persistence still pending.\\n";
 r.receipt.r4_second_stage={"baseline_child_head":"6e670da369b6ac856b821dbebb929ab27a2a126a","independent_art_review":"https://github.com/techrote/sandmapsreference/pull/205#issuecomment-7069838453","design":"distinct diagnostic vaulted pair with actual double-portal entry and offset east selector/quarantine thresholds","delta":{"changed":28613,"air_to_solid":23078,"solid_to_air":2556,"material_replacement":2979,"protected_archive_changes":0},"bbox_inclusive":[151,549,822,1528],"new_head_art":"PENDING","new_head_technical":"PENDING","native":"NATIVE-UNTESTED"};
 r.aspect_transfer.repair_r4_second_stage={"baseline_child_head":"6e670da369b6ac856b821dbebb929ab27a2a126a","independent_art_review":"https://github.com/techrote/sandmapsreference/pull/205#issuecomment-7069838453","preserved":["18 fixed site centres","east 81-cell sterile neck","central Midge flight shaft","entire y>=1546 lower archive"],"scope":"West diagnostic nested threshold and east selector/quarantine separate usable thresholds","new_head_independent_review":"PENDING"};
 r.exemplar.repair_r4_second_stage={"baseline_child_head":"6e670da369b6ac856b821dbebb929ab27a2a126a","independent_art_review":"https://github.com/techrote/sandmapsreference/pull/205#issuecomment-7069838453","preserved":["18 fixed site centres","east 81-cell sterile neck","central Midge flight shaft","entire y>=1546 lower archive"],"scope":"West diagnostic nested threshold and east selector/quarantine separate usable thresholds","new_head_independent_review":"PENDING"};
 r.readme+="\n## Review-driven second bounded R4 repair\n\nAfter independent Art REWORK of first-child HEAD 6e670da369b6ac856b821dbebb929ab27a2a126a, the west diagnostics now has a stepped grounded roof and two traversable successive vault portals; east selector and quarantine have distinct offset internal thresholds. This stage modifies 28,613 real material cells, all within [151,549,822,1528], and leaves every cell at y>=1546 unchanged. Exact 31x27 named routes and ordered sterile return are regenerated. Re-review is required; NATIVE-UNTESTED.\n";
 // Third-stage evidence is specific to the independent Art-only REWORK at the old head.
 // Historical first/second child receipts remain traceable, not retroactively PASS.
 r.receipt.r4_second_stage.new_head_art="REWORK on 16bfa32b8b45dea015b723d72919041773f50ea2";
 r.aspect_transfer.repair_r4_second_stage.new_head_independent_review="Art REWORK at https://github.com/techrote/sandmapsreference/pull/205#issuecomment-7071145680; Technical unverified";
 r.exemplar.repair_r4_second_stage.new_head_independent_review="Art REWORK at https://github.com/techrote/sandmapsreference/pull/205#issuecomment-7071145680; Technical unverified";
 const third={baseline_child_head:"16bfa32b8b45dea015b723d72919041773f50ea2",review_url:"https://github.com/techrote/sandmapsreference/pull/205#issuecomment-7071145680",scope:"West diagnostic fully rock-cut inner recess with two actual side thresholds; east upper selector unlike compact cavern with lateral side-entry and sterile floor return",changed_final_cells:29473,air_to_solid:19321,solid_to_air:3870,material_replacements:6282,bbox_inclusive:[361,575,924,1111],protected:"18 literal sites, all y>=1546, open central shaft, sterile neck and alternate return",source_static:"Pass exact rectangle and full-hull BFS; pending independent same-HEAD Art and Technical",native:"NATIVE-UNTESTED"};
 r.receipt.r4_third_stage=third;
 r.aspect_transfer.repair_r4_third_stage=third;
 r.exemplar.repair_r4_third_stage={...third,independent_art:"PENDING at new HEAD",independent_technical:"PENDING"};
 r.route_graph.r4_third_stage={baseline_child_head:third.baseline_child_head,changed_region_xyxy:third.bbox_inclusive,full_hull_gates:r.receipt.r4_waypoint_proof.four_vault_portals,actual_ordered_sterile_return_steps:r.receipt.r4_waypoint_proof.via_distance,shortest_forced_sterile:false};
 r.readme+="\n## Third narrow R4 repair following exact-HEAD Art REWORK\n\nIndependent Art [REWORK](https://github.com/techrote/sandmapsreference/pull/205#issuecomment-7071145680) at 16bfa32b8b45dea015b723d72919041773f50ea2 found a residual unentered west diagnostic hall and indistinct east selector/quarantine thresholds. This child-only pass uses actual rock material to frame a second entered west diagnostic inner recess and a compact enclosed east selector with lateral door and distinct lower sterile egress. Its 29,473 changed cells are confined to [361,575,924,1111] versus that exact previous child; all y>=1546 remains identical, and all original 18 centres plus 31x27 gate/ordered return checks are rerun. The independent Art/Technical verdict for this new HEAD is PENDING, and native movement and persistence remain NATIVE-UNTESTED.\n";
 return r;
}
if(typeof require!=="undefined" && typeof module!=="undefined" && require.main===module){const fs=require("fs"),path=require("path"),d=process.argv[2]||__dirname;fs.mkdirSync(d,{recursive:true});const a=build();fs.writeFileSync(path.join(d,"setup.json"),a.setupText);fs.writeFileSync(path.join(d,"receipt.json"),JSON.stringify(a.receipt,null,2)+"\n");for(const[n,v]of Object.entries(a.pngs))fs.writeFileSync(path.join(d,n),v);for(const [n,v] of [["aspect_transfer.json",a.aspect_transfer],["route_graph.json",a.route_graph],["exemplar.json",a.exemplar]])fs.writeFileSync(path.join(d,n),JSON.stringify(v,null,2)+"\n");fs.writeFileSync(path.join(d,"README.md"),a.readme);console.log(a.receipt);}
if(typeof module!=="undefined")module.exports={build,world,encode,audit,shortest31,png,verifyPNG};