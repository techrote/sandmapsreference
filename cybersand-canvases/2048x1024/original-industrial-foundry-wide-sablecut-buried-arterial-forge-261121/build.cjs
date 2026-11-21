'use strict';
function utf(s){let r=[];for(const z of s){let k=z.codePointAt(0);if(k<128)r.push(k);else if(k<2048)r.push(192|(k>>>6),128|(k&63));else if(k<65536)r.push(224|(k>>>12),128|((k>>>6)&63),128|(k&63));else r.push(240|(k>>>18),128|((k>>>12)&63),128|((k>>>6)&63),128|(k&63));}return Uint8Array.from(r);}

function sha256(msg){const k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2],n=(msg.length+9+63)&~63,b=new Uint8Array(n);b.set(msg);b[msg.length]=128;const bit=msg.length*8,view=new DataView(b.buffer);view.setUint32(n-8,Math.floor(bit/4294967296),false);view.setUint32(n-4,bit>>>0,false);let H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64),rr=(x,n)=>(x>>>n)|(x<<(32-n));for(let off=0;off<n;off+=64){for(let i=0;i<16;i++)w[i]=view.getUint32(off+4*i,false);for(let i=16;i<64;i++){let x=w[i-15],y=w[i-2];w[i]=(w[i-16]+(rr(x,7)^rr(x,18)^(x>>>3))+w[i-7]+(rr(y,17)^rr(y,19)^(y>>>10)))|0;}let[a,c,d,e,f,g,h,j]=H;for(let i=0;i<64;i++){let t=(j+(rr(f,6)^rr(f,11)^rr(f,25))+((f&g)^(~f&h))+k[i]+w[i])|0,u=((rr(a,2)^rr(a,13)^rr(a,22))+((a&c)^(a&d)^(c&d)))|0;j=h;h=g;g=f;f=(e+t)|0;e=d;d=c;c=a;a=(t+u)|0;}H=[(H[0]+a)|0,(H[1]+c)|0,(H[2]+d)|0,(H[3]+e)|0,(H[4]+f)|0,(H[5]+g)|0,(H[6]+h)|0,(H[7]+j)|0];}return H.map(x=>(x>>>0).toString(16).padStart(8,"0")).join("");}


function world(){
const W=2048,H=1024,g=new Uint8Array(W*H),seed=261121311;
const M={0:"empty",3:"water",8:"lava",58:"hard-wall",62:"steel-plate",65:"rusted-steel",68:"steel-pipe",69:"copper-pipe",76:"hazard",77:"neon",79:"lamp",100:"basalt",104:"firebrick",117:"iron",131:"heat-shield"};
g.fill(100);
function r(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);if(x<0||y<0||x+w>W||y+h>H||w<=0||h<=0)throw Error("rect "+[x,y,w,h,m]);for(let yy=y;yy<y+h;yy++)g.fill(m,yy*W+x,yy*W+x+w);}
function beam(x1,y1,x2,y2,t,m){const n=Math.ceil(Math.hypot(x2-x1,y2-y1)),half=Math.floor(t/2);for(let i=0;i<=n;i+=Math.max(1,Math.floor(t/3))){let a=i/Math.max(n,1);r(x1+(x2-x1)*a-half,y1+(y2-y1)*a-half,t,t,m);}r(x2-half,y2-half,t,t,m);}
function ring(cx,cy,rx,ry,t,m){for(let dy=-ry;dy<=ry;dy++){const a=Math.floor(rx*Math.sqrt(Math.max(0,1-dy*dy/(ry*ry)))),bx=rx-t,by=ry-t,b=Math.abs(dy)<by?Math.floor(bx*Math.sqrt(1-dy*dy/(by*by))):-1;if(b>=0){r(cx-a,cy+dy,a-b,1,m);r(cx+b+1,cy+dy,a-b,1,m);}else r(cx-a,cy+dy,2*a+1,1,m);}}
// Rooted strata and three interconnected excavation arteries: one continuous
// geologic mass, NOT another surface skyline, separated island or ring crater.
for(const [y,h,m]of [[45,7,58],[118,10,131],[790,9,58],[886,15,58],[962,62,58]])r(0,y,W,h,m);
const voids=[
[55,305,1940,128],[200,162,1640,91],[242,672,1560,103],
[282,239,91,112],[1058,239,99,118],[1709,238,95,114],
[356,424,103,273],[1081,422,123,295],[1653,421,120,296],
[78,270,303,284],[387,341,338,290],[735,261,321,220],
[930,444,480,285],[1401,435,351,286],[1758,275,233,310],
[500,615,322,201],[1195,705,312,125],[805,480,104,144],[1832,593,97,116]
];for(const b of voids)r(b[0],b[1],b[2],b[3],0);
for(const b of [[107,246,140,32],[420,313,149,28],[571,312,72,30],[768,247,83,29],[937,247,91,28],[1240,417,131,27],[1471,411,112,26],[1809,247,93,27],[1250,829,166,46],[547,817,90,42],[715,795,68,35]])r(...b,0);
// Slab edges, shaft lips and geologic load transfers.
for(const b of [
[61,427,323,15,62],[385,435,329,12,62],[725,429,307,12,62],
[1215,429,180,12,62],[1420,428,328,12,62],[1772,432,209,13,62],
[232,257,418,11,117],[705,257,339,10,117],[1171,257,322,10,117],[1555,257,276,10,117],
[266,768,466,14,65],[753,768,265,13,65],[1239,768,415,12,65],
[369,586,83,13,62],[509,621,185,12,62],[959,610,191,12,62],
[1297,646,96,13,62],[1801,560,180,14,62],
[298,283,17,33,68],[1097,275,18,37,68],[1741,264,16,39,68]
])r(...b);
r(281,251,89,75,0);r(1056,250,104,80,0);r(1707,252,98,83,0);
// Ore lift: dry reception, chain cage and rooted cutter fixture.
r(117,451,232,19,62);r(142,474,18,77,65);r(314,473,17,81,65);
beam(150,495,218,540,12,117);beam(320,490,268,540,12,117);
r(122,278,240,13,62);r(140,289,12,76,68);r(333,289,13,76,68);
r(171,292,34,14,69);r(290,292,23,17,69);
ring(260,493,48,44,12,117);ring(260,493,24,20,8,69);
r(214,533,110,13,65);r(190,549,160,8,76);
for(let i=0;i<6;i++)r(182+i*22,460+(i%3)*4,12,10,i%2?65:117);
// Closed refractory furnace and side transfer. Lava has zero air faces.
r(479,483,210,139,65);r(494,496,178,113,131);
r(508,505,150,95,104);r(522,519,121,66,8);
r(512,474,152,11,117);r(480,622,211,15,62);
r(474,490,17,175,68);r(686,490,17,176,68);
beam(480,644,457,677,14,68);beam(693,646,707,673,14,68);
r(398,274,305,16,62);r(410,290,12,78,68);r(679,290,12,93,68);
for(let x=438;x<=676;x+=40){r(x,313,13,13,69);r(x,326,12,12,79);}
r(477,457,180,12,131);r(639,469,13,15,76);
beam(686,544,755,510,12,117);
// Distinct overhead ladle assembly and rooted lift chains.
r(758,263,273,14,62);r(787,277,15,94,68);r(997,276,13,96,68);
r(828,277,143,12,117);r(856,290,12,20,69);r(951,290,13,22,69);
r(826,451,169,14,65);r(842,464,137,13,131);
r(854,477,113,47,104);r(868,488,86,22,8);r(849,526,125,12,117);
r(899,535,15,77,68);r(978,535,14,78,68);
r(783,457,30,49,69);beam(808,506,840,524,9,68);
r(821,286,13,163,68);r(1003,285,13,173,68);
beam(838,297,882,351,8,65);beam(1003,298,971,351,8,65);
// A straight-stroke opposed-hammer caster, not circular machinery.
r(1072,466,303,17,62);r(1086,482,16,170,68);r(1350,482,17,171,68);
for(const x of [1154,1292]){
r(x,490,27,124,117);r(x-17,608,61,24,76);
r(x-7,528,42,15,69);r(x-12,561,51,14,65);}
r(1117,647,240,18,65);r(1132,664,206,15,131);
r(1139,681,190,16,117);
r(1166,579,114,22,104);r(1191,585,64,9,69);
for(let x=1132;x<1370;x+=43){r(x,467,12,17,79);r(x+8,679,10,11,76);}
beam(1202,650,1252,706,11,68);beam(1355,643,1407,695,11,68);
r(1385,459,105,14,62);r(1403,469,15,72,68);beam(1420,500,1504,530,10,117);
// Sealed quench tank. Dry maintenance air on both sides.
r(1505,543,189,111,65);r(1519,555,160,89,104);r(1532,565,134,64,3);
r(1501,534,197,11,131);r(1495,655,209,15,117);
r(1497,674,17,96,68);r(1680,673,18,100,68);
r(1430,472,264,15,62);r(1447,486,15,49,68);r(1677,485,13,49,68);
r(1480,491,18,22,79);r(1646,494,23,17,69);
for(let x=1487;x<1680;x+=28)r(x,521,13,12,76);
// Rail dispatch and alternative shaft approach.
r(1788,443,190,17,62);r(1795,458,16,98,68);r(1952,459,13,103,68);
r(1810,522,142,15,65);r(1822,536,117,13,104);
for(let x=1828;x<1930;x+=38){r(x,507,16,15,69);r(x+4,489,8,15,77);}
r(1787,265,197,13,62);r(1798,278,12,66,68);r(1952,278,13,61,68);
beam(1830,277,1912,319,10,117);r(1892,296,14,27,79);
// Lower mechanical workshops; empty seams remain useful for authors.
r(499,783,281,12,62);r(524,795,14,25,68);r(759,795,15,29,68);
for(const [x,m]of [[553,65],[611,117],[671,68],[734,69]]){r(x,739,17,27,m);r(x-10,731,35,9,62);}
ring(624,706,29,22,7,69);ring(733,700,20,15,6,117);
r(974,774,154,10,62);r(981,784,12,40,68);r(1117,783,12,45,68);
r(1344,777,161,10,65);r(1353,788,12,38,68);r(1482,788,11,43,68);
r(1562,718,43,14,117);r(1606,713,23,17,79);
r(1741,777,84,12,62);r(1755,790,12,21,68);
const sites=[
["West gallery spawn",110,363],["Ore exchange",237,365],
["Excavator gallery",313,382],["Furnace approach",454,366],
["Furnace upper inspection",584,359],["Ladle reception",775,376],
["Ladle carriage",930,367],["Caster threshold",1095,367],
["Hammer observation",1265,367],["Quench approach",1457,368],
["Freight platform",1847,366],["East rim goal",1955,370],
["West overhead",302,205],["Central overhead",1107,204],
["East overhead",1738,204],["West repair shaft",393,557],
["Underplant service",551,703],
["Caster undercroft",1123,716],
["East return",1727,681],["Upper ladle bypass",888,206]
].map(([name,x,y])=>({name,x,y}));
return {W,H,g,M,seed,sites,spawn:[110,363]};
}
function bridgeSupport(w){
const {g,W,H}=w,N=g.length,isSolid=v=>v!==0&&v!==3&&v!==8;const root=new Uint8Array(N),q=new Int32Array(N),neighbors=i=>{const x=i%W;return [x?i-1:-1,x<W-1?i+1:-1,i>=W?i-W:-1,i+W<N?i+W:-1];};
let front=0,tail=0;for(let x=0;x<W;x++){const i=(H-1)*W+x;if(isSolid(g[i])){root[i]=1;q[tail++]=i;}}
while(front<tail){const i=q[front++];for(const j of neighbors(i))if(j>=0&&isSolid(g[j])&&!root[j]){root[j]=1;q[tail++]=j;}}
const seen=new Uint8Array(N),parts=[];for(let i=0;i<N;i++)if(isSolid(g[i])&&!root[i]&&!seen[i]){const comp=[i];seen[i]=1;let p=0;while(p<comp.length){for(const j of neighbors(comp[p++]))if(j>=0&&!seen[j]&&!root[j]&&isSolid(g[j])){seen[j]=1;comp.push(j);}}parts.push(comp);}
const dist=new Int32Array(N),parent=new Int32Array(N),qq=new Int32Array(N);dist.fill(-1);parent.fill(-1);front=0;tail=0;for(let i=0;i<N;i++)if(root[i]){dist[i]=0;qq[tail++]=i;}
while(front<tail){const i=qq[front++];for(const j of neighbors(i))if(j>=0&&dist[j]<0&&g[j]!==3&&g[j]!==8){dist[j]=dist[i]+1;parent[j]=i;qq[tail++]=j;}}
let links=0,maxLink=0;for(const comp of parts){let best=-1,d=2147483647;for(const i of comp)if(dist[i]>=0&&dist[i]<d){d=dist[i];best=i;}if(best<0||d>340)throw Error("ground component unreachable "+comp.length+" at "+d);maxLink=Math.max(maxLink,d);for(let i=best;i>=0&&!root[i];i=parent[i])if(g[i]===0){g[i]=68;links++;}}
return {components:parts.length,links,maxLink};
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
 const reached=new Uint8Array(N),qq=new Int32Array(N);let first=0,last=0,sp=spawn[1]*W+spawn[0];if(free[sp]){reached[sp]=1;qq[last++]=sp;}while(first<last){let i=qq[first++],x=i%W;for(const j of[x?i-1:-1,x<W-1?i+1:-1,i-W,i+W])if(j>=0&&j<N&&free[j]&&!reached[j]){reached[j]=1;qq[last++]=j;}}
 const sr=sites.map(v=>({...v,clear:!!free[v.y*W+v.x],reached:!!reached[v.y*W+v.x]}));return {hull:[ww,hh],valid_centres:all,connected_centres:last,passed:sr.filter(v=>v.reached).length,sites:sr};}
 const flight=[[19,15],[23,19],[31,27]].map(p=>route(...p,null)),obstruction=[965,306,86,128],blocked=route(31,27,obstruction);
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
 const end=sites.find(q=>q.name==="East rim goal");if(!end)throw Error("missing literal goal");
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




function finalise(w){
const W=w.W,H=w.H,N=W*H,solid=i=>w.g[i]!==0&&w.g[i]!==3&&w.g[i]!==8;
const preliminary=bridgeSupport(w);
function cut(x,y,ww,hh){for(let yy=y;yy<y+hh;yy++)w.g.fill(0,yy*W+x,yy*W+x+ww);}
const protectedPassages=[
[55,340,1936,86],[275,207,100,217],[1058,207,100,217],
[1703,207,108,217],[360,385,95,350],[1070,390,131,355],
[1704,390,96,355],[242,685,1570,59],[265,179,930,72],
[275,218,100,210],[1062,216,109,217],[857,217,78,213]];
for(const b of protectedPassages)cut(...b);
// Enumerate all disconnected structural islands BEFORE adding new grounding
// members; otherwise late component enumeration would erase new anchor rods.
const vis=new Uint8Array(N),q=new Int32Array(N);let head=0,tail=0;
for(let x=0;x<W;x++){let i=(H-1)*W+x;if(solid(i)){vis[i]=1;q[tail++]=i;}}
while(head<tail){let i=q[head++],x=i%W;for(let j of[x?i-1:-1,x<W-1?i+1:-1,i-W,i+W])if(j>=0&&j<N&&!vis[j]&&solid(j)){vis[j]=1;q[tail++]=j;}}
let todo=[],remove=[];
for(let i=0;i<N;i++){
 if(!solid(i)||vis[i])continue;
 head=0;tail=1;q[0]=i;vis[i]=1;
 let mnx=W,mxx=0,mxy=0,parts=[];
 while(head<tail){
  let k=q[head++],x=k%W,y=(k/W)|0;parts.push(k);
  mnx=Math.min(mnx,x);mxx=Math.max(mxx,x);mxy=Math.max(mxy,y);
  for(let j of[x?k-1:-1,x<W-1?k+1:-1,k-W,k+W])if(j>=0&&j<N&&!vis[j]&&solid(j)){vis[j]=1;q[tail++]=j;}
 }
 // Tiny disconnected scraps and the small abandoned overhead block
 // are excavated, not hidden as unsupported scenery.
 if(parts.length<500||(mxy<350&&parts.length<6000)){remove.push(...parts);continue;}
 let targetx=mxy<350?(mnx<500?Math.max(mnx+5,400):Math.min(mxx,1500)):mxy<500?mxx:mnx+Math.floor((mxx-mnx)*.35);
 let candidates=parts.filter(k=>k%W===targetx);
 if(!candidates.length){
  let dist=1e9;for(let k of parts){let d=Math.abs(k%W-targetx);
   if(d<dist){dist=d;candidates=[k];}else if(d===dist)candidates.push(k);
  }
 }
 let k=candidates.reduce((best,i)=>mxy<350?Math.min(best,i):Math.max(best,i));
 let x=k%W,y=(k/W)|0,to=mxy<350?0:1023;
 todo.push([x,y,to,parts.length]);
}
for(let i of remove)w.g[i]=0;
for(const[x,y,to]of todo)for(let yy=Math.min(y,to);yy<=Math.max(y,to);yy++){
 let z=yy*W+x;if(w.g[z]===0)w.g[z]=68;
}
return {preliminary,unrooted_components_repaired:todo.length,anchors:todo,excavated_scraps:remove.length};
}


function build(){
const w=world(),finalisation=finalise(w),rects=encode(w.g,w.W,w.H),
a=audit(w,rects),obstruction=[965,306,86,128],
direct=shortest31(w,null),blocked=shortest31(w,obstruction);
if(a.detached||a.airfaces||a.direct||a.flight.some(x=>x.passed!==w.sites.length)||a.blocked.passed!==w.sites.length||direct.steps<0||blocked.steps<=direct.steps)
throw Error("STATIC_GATE "+JSON.stringify({detached:a.detached,fluid_air:a.airfaces,fluid_contact:a.direct,flights:a.flight.map(x=>[x.hull,x.passed]),blocked:a.blocked.passed,sites:w.sites.length,route:[direct.steps,blocked.steps]}));
if(rects.length>32768||a.work>32000000)throw Error("source construction budget");
const setup={version:2,extent:[2048,1024],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:w.spawn,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:2}}],next_id:2,selected:1,edits:rects,response:"LA-SELECTIVE",liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
const j=JSON.stringify(setup),hash=sha256(w.g),setupHash=sha256(utf(j));
if(utf(j).length>1048576)throw Error("source Setup JSON budget");
const views=[["overview.png",0,0,2048,1024],
["01-ore-exchange.png",55,253,379,368],
["02-thermal-furnace.png",383,267,374,405],
["03-ladle-haul.png",726,245,373,396],
["04-dual-hammer-caster.png",1039,426,416,347],
["05-quench-shaft.png",1400,411,379,392],
["06-east-dispatch.png",1716,244,332,396]],
imgs={},pn={};let px=0;
for(const [name,x,y,ww,hh] of views){
 const p=png(w.g,2048,x,y,ww,hh);
 px+=verifyPNG(p,w.g,2048,x,y,ww,hh);
 pn[name]={xywh:[x,y,ww,hh],sha256:sha256(p),bytes:p.length};imgs[name]=p;
}
const receipt={schema:1,original_no_source:true,concept:"Sablecut Buried Arterial Forge",
seed:w.seed,base_main_sha:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",
engine_sha:"d5b0371501eb7ccd32c261f738b4a2612218fbc1",extent:[w.W,w.H],
plane_sha256:hash,setup_sha256:setupHash,json_bytes:utf(j).length,
rectangle_count:rects.length,source_rectangle_limit:32768,construction_work:a.work,
material_histogram:a.hist,ground:{total:a.total,rooted:a.rooted,detached:a.detached,finalisation},
fluid:{water:a.hist[3]||0,lava:a.hist[8]||0,exposed_air_faces:a.airfaces,water_lava_contacts:a.direct},
flight:a.flight,obstruction,blocked:a.blocked,
shortest_goal:{direct,blocked,detour:blocked.steps-direct.steps},
pngs:pn,material_pixel_parity:px,native:"NATIVE-UNTESTED"};
const exemplar=JSON.parse("{\"schema_version\":1,\"purpose\":[\"human_editable_canvas\",\"procedural_exemplar\",\"scripted_setpiece_source\"],\"family\":\"original/industrial-foundry-wide\",\"map_role\":\"Subterranean three-artery pressure forge with excavation and repair zones\",\"anchor_donors\":[],\"macro_topology\":\"Nested underground chambers in continuous rooted basalt, linked by long parallel process/inspection/return arteries\",\"density_profile\":\"Dense functional machines separated by deliberate flyable rock-cut halls and unfurnished excavation seams\",\"route_grammar\":{\"main\":[\"West gallery spawn\",\"Ore exchange\",\"Furnace approach\",\"Ladle reception\",\"Caster threshold\",\"Hammer observation\",\"Quench approach\",\"Freight platform\",\"East rim goal\"],\"alternative\":[\"West overhead\",\"Upper ladle bypass\",\"Central overhead\",\"East overhead\",\"Freight platform\"],\"recovery\":[\"West repair shaft\",\"Underplant service\",\"Caster undercroft\",\"East return\"]},\"strong_motifs\":[\"Three horizontal underground transport arteries\",\"Open Midge-scale inter-gallery access shafts\",\"Two sealed reactive fluid cores in a credible furnace-to-quench process\",\"Paired straight-stroke casting ram\",\"Rooted rock vault and inspection-truss distinction\",\"Deliberate excavated append seams\"],\"interesting_relationships\":[\"The geological mass serves as structure rather than scenery\",\"A real obstruction forces detour through separate vertical circulation\",\"Thermal and water modules are kept physically separate\",\"Upper inspection loops and underplant recovery serve the same central production sequence\"],\"authoring_affordances\":[{\"name\":\"West mould service seam\",\"region_xywh\":[805,480,104,144],\"use\":\"future inspection control room\",\"state\":\"unfinished\"},{\"name\":\"Underplant extension cut\",\"region_xywh\":[1195,705,312,125],\"use\":\"SWARM/GENTEK modular-assembly experiments\",\"state\":\"empty carved annex\"},{\"name\":\"Freight salvage shaft\",\"region_xywh\":[1832,593,97,116],\"use\":\"NPC supply or salvage stage\",\"state\":\"partially fitted\"},{\"name\":\"Quench access service alcove\",\"region_xywh\":[1401,435,351,286],\"use\":\"future thermal gate control\",\"state\":\"functional shell with editable air\"}],\"setpiece_candidates\":[{\"name\":\"Main arterial cave-in\",\"anchor\":\"Caster threshold\",\"kind\":\"route_obstruction\",\"staging\":\"overhead bypass and east rejoin\"},{\"name\":\"Twin ram activation\",\"anchor\":\"Hammer observation\",\"kind\":\"machinery_activation\",\"staging\":\"accessible pressure press chamber\"},{\"name\":\"Furnace emergency isolation\",\"anchor\":\"Furnace approach\",\"kind\":\"thermal_release\",\"staging\":\"initially enclosed lava core\"},{\"name\":\"East freight departure\",\"anchor\":\"Freight platform\",\"kind\":\"departure\",\"staging\":\"loading rail and vertical service access\"}],\"procedural_exemplar_value\":[\"Three-layer excavated traffic graph with actual whole-hull site proof\",\"Geological envelope as positive structural grammar\",\"Underground furnace and straight-line press rather than exposed circular landmarks\",\"Undeveloped but route-safe service and expansion seams\"],\"similarity_avoidance\":\"Distinct from Vespergate's open ring caldera, Saltglass's discontinuous high islands, and the flat stripworks family: this is an enclosed interior with multiple long communicating excavations and paired linear hammers.\",\"diversity_axes\":{\"macro_topology\":\"nested_cavities\",\"altitude_grammar\":\"multi_strata\",\"density_cadence\":\"alternating\",\"route_structure\":\"layered\",\"landmark_family\":\"central_machine\",\"support_form\":\"cliff_embedded\",\"environment_relation\":\"geological\",\"incompleteness\":\"excavation\"},\"engine_contract\":{\"accepted_main\":\"d5b0371501eb7ccd32c261f738b4a2612218fbc1\",\"setup_version\":2,\"rectangle_limit\":32768}}");
exemplar.static_proof={cells:2097152,plane_sha256:hash,rectangles:rects.length,obstructed_sites:a.blocked.passed};
const readme="# Sablecut Buried Arterial Forge - 2048x1024 ORIGINAL\n\n"+
"Original excavated underground foundry: ore exchange, refractory furnace, suspended ladle, twin straight-stroke pressure casters, sealed quench and dispatch lift. Three traversable horizontal galleries, vertical shafts and a genuine obstructed alternate path make a distinctive nested-cavern procedural exemplar. Intentional unfinished rooms are authoring affordances, not mandatory prop-fill defects.\n\n"+
"Grid 2,097,152 exact final material-ID cells. Ordered lossless rectangles "+rects.length+
", Setup bytes "+utf(j).length+", construction cell writes "+a.work+". Source plane SHA-256 "+
hash+". Entire inert solid plane rooted "+a.rooted+"/"+a.total+"; no detached solids. Initial Water "+
(a.hist[3]||0)+", Lava "+(a.hist[8]||0)+", exposed fluid faces "+a.airfaces+".\n"+
"Literal-centre conservative hull BFS: "+w.sites.length+"/"+w.sites.length+
" at 19x15, 23x19 and 31x27; real physical obstruction "+JSON.stringify(obstruction)+
" leaves "+a.blocked.passed+"/"+w.sites.length+" reachable, direct goal "+direct.steps+
" to "+blocked.steps+" steps. Authenticated indexed PNG material pixel parity "+
px+", zero mismatches.\n\n"+
"Rebuild all authored outputs: node build.cjs <output-folder>. Engine authority (read only) d5b0371501eb7ccd32c261f738b4a2612218fbc1. No engine or schedule changes. Creator-side static proof only; native Workbench, Midge collision, Rapier, fluids, and fresh process Save/reopen NATIVE-UNTESTED. Keep Draft/HOLD; seek exact-HEAD independent Art, Tech and Shepherd review.\n";
return {files:{"setup.json":j,"receipt.json":JSON.stringify(receipt,null,2)+"\n",
"exemplar.json":JSON.stringify(exemplar,null,2)+"\n","README.md":readme,...imgs},receipt};
}

const fs=require('node:fs'),path=require('node:path');
if(require.main===module){const out=process.argv[2]||__dirname;fs.mkdirSync(out,{recursive:true});const q=build();for(const[name,data]of Object.entries(q.files))fs.writeFileSync(path.join(out,name),data);process.stdout.write(JSON.stringify({sha:q.receipt.plane_sha256,rectangles:q.receipt.rectangle_count})+'\n');}
module.exports={world,bridgeSupport,encode,audit,build};
