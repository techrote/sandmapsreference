'use strict';
function utf(s){let r=[];for(const z of s){let k=z.codePointAt(0);if(k<128)r.push(k);else if(k<2048)r.push(192|(k>>>6),128|(k&63));else if(k<65536)r.push(224|(k>>>12),128|((k>>>6)&63),128|(k&63));else r.push(240|(k>>>18),128|((k>>>12)&63),128|((k>>>6)&63),128|(k&63));}return Uint8Array.from(r);}

function sha256(msg){const k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2],n=(msg.length+9+63)&~63,b=new Uint8Array(n);b.set(msg);b[msg.length]=128;const bit=msg.length*8,view=new DataView(b.buffer);view.setUint32(n-8,Math.floor(bit/4294967296),false);view.setUint32(n-4,bit>>>0,false);let H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64),rr=(x,n)=>(x>>>n)|(x<<(32-n));for(let off=0;off<n;off+=64){for(let i=0;i<16;i++)w[i]=view.getUint32(off+4*i,false);for(let i=16;i<64;i++){let x=w[i-15],y=w[i-2];w[i]=(w[i-16]+(rr(x,7)^rr(x,18)^(x>>>3))+w[i-7]+(rr(y,17)^rr(y,19)^(y>>>10)))|0;}let[a,c,d,e,f,g,h,j]=H;for(let i=0;i<64;i++){let t=(j+(rr(f,6)^rr(f,11)^rr(f,25))+((f&g)^(~f&h))+k[i]+w[i])|0,u=((rr(a,2)^rr(a,13)^rr(a,22))+((a&c)^(a&d)^(c&d)))|0;j=h;h=g;g=f;f=(e+t)|0;e=d;d=c;c=a;a=(t+u)|0;}H=[(H[0]+a)|0,(H[1]+c)|0,(H[2]+d)|0,(H[3]+e)|0,(H[4]+f)|0,(H[5]+g)|0,(H[6]+h)|0,(H[7]+j)|0];}return H.map(x=>(x>>>0).toString(16).padStart(8,"0")).join("");}


function world(){
const W=2048,H=1024,g=new Uint8Array(W*H),seed=261120571,M={0:"empty",3:"water",8:"lava",58:"hard-wall",62:"steel-plate",65:"rusted-steel",68:"steel-pipe",69:"copper-pipe",72:"glass",76:"hazard",77:"neon",79:"lamp",100:"basalt",104:"firebrick",117:"iron",131:"heat-shield"};
function r(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);if(x<0||y<0||x+w>W||y+h>H||w<=0||h<=0)throw Error("rect "+[x,y,w,h,m]);for(let yy=y;yy<y+h;yy++)g.fill(m,yy*W+x,yy*W+x+w);}
function beam(x1,y1,x2,y2,t,m){const n=Math.ceil(Math.hypot(x2-x1,y2-y1)),half=Math.floor(t/2);for(let i=0;i<=n;i+=Math.max(1,Math.floor(t/4))){let a=i/Math.max(n,1);r(x1+(x2-x1)*a-half,y1+(y2-y1)*a-half,t,t,m);}r(x2-half,y2-half,t,t,m);}
function oval(cx,cy,rx,ry,m){for(let dy=-ry;dy<=ry;dy++){const a=Math.floor(rx*Math.sqrt(Math.max(0,1-dy*dy/(ry*ry))));r(cx-a,cy+dy,2*a+1,1,m);}}
function ring(cx,cy,rx,ry,t,m){for(let dy=-ry;dy<=ry;dy++){const a=Math.floor(rx*Math.sqrt(Math.max(0,1-dy*dy/(ry*ry)))),bx=rx-t,by=ry-t,b=Math.abs(dy)<by?Math.floor(bx*Math.sqrt(1-dy*dy/(by*by))):-1;if(b>=0){if(a>b){r(cx-a,cy+dy,a-b,1,m);r(cx+b+1,cy+dy,a-b,1,m);}}else r(cx-a,cy+dy,2*a+1,1,m);}}
const ground=x=>Math.min(913,Math.max(430,x<515?445+Math.floor(.82*x):x>1540?445+Math.floor(.82*(2047-x)):866+Math.floor(10*Math.sin(x/53)+4*Math.cos(x/17))));
// Continuous basin, excavated below rim, fundamentally unlike the separate-islands donor.
for(let y=430;y<1024;y++){let start=-1;for(let x=0;x<=2048;x++){let solid=x<2048&&y>=ground(x);if(solid&&start<0)start=x;if(!solid&&start>=0){r(start,y,x-start,1,y>=952?58:100);start=-1;}}}
r(0,952,2048,72,58);r(490,856,1056,23,58);r(0,440,42,512,58);r(2006,440,42,512,58);
for(const[x,y,w,h]of [[330,772,182,76],[568,795,148,56],[755,800,118,50],[1170,793,169,58],[1397,788,178,60],[1660,712,120,76]]){r(x,y,w,h,0);r(x+9,y+h-12,w-18,9,62);}
// Deep west ore skip and side-tapping furnace with grounded asymmetric supports.
r(215,432,323,18,62);r(236,449,288,12,117);r(251,450,17,260,68);beam(253,704,302,767,14,68);r(471,442,17,295,68);beam(480,684,517,788,11,65);
beam(196,397,359,435,16,117);r(216,380,99,28,62);r(239,364,52,17,76);
for(let x=220;x<350;x+=31){r(x,414,8,12,69);r(x-5,424,18,6,117);}r(343,433,82,13,104);r(395,412,27,20,65);
r(380,450,181,201,65);r(396,468,149,165,131);r(411,480,118,136,104);r(428,515,90,82,58);r(439,529,69,52,8);
r(426,488,91,22,104);r(420,592,118,19,104);r(380,450,23,218,65);r(538,450,23,218,65);r(389,438,159,12,62);
for(let y=464;y<635;y+=34){r(368,y,12,12,69);r(548,y,12,12,69);}
r(409,632,124,17,117);r(429,649,16,205,68);r(523,649,15,208,68);
beam(555,587,669,533,14,65);beam(556,603,662,552,10,117);r(615,525,84,16,62);r(630,519,45,9,79);
// Paired counterweight, sealed ladle, and overhead hoist frame.
r(661,443,151,15,62);r(683,458,11,69,68);r(791,458,11,70,68);
r(681,523,123,83,65);r(693,532,99,59,131);r(703,542,79,37,8);r(692,513,100,19,104);r(685,587,114,19,117);
beam(731,610,824,540,12,68);r(801,520,23,29,65);
r(544,284,290,15,62);r(555,300,12,138,68);r(818,300,11,139,68);
beam(560,307,610,359,9,68);beam(820,306,778,353,9,68);r(630,268,91,16,117);
r(650,250,12,18,69);r(711,251,11,17,69);
// Geological ring: a breached navigable annular caster anchored into basin floor.
ring(1001,536,151,167,22,65);ring(1001,536,125,140,8,117);
r(924,685,18,177,68);r(1082,684,17,178,68);beam(926,686,865,757,11,117);beam(1092,692,1157,769,11,117);
r(941,694,139,16,62);r(958,715,109,11,76);
ring(1001,596,52,45,10,117);oval(1001,596,21,17,69);r(990,580,22,10,77);r(988,622,28,13,62);
r(962,646,77,15,65);r(980,661,16,35,68);
for(const[dx,dy]of [[-59,-5],[58,-5],[-29,-52],[30,-51]])beam(1001+dx,596+dy,1001+dx*.68,596+dy*.7,9,65);
r(835,280,355,14,62);r(847,294,12,98,68);r(1167,294,12,90,68);
r(885,266,72,14,76);r(1117,268,62,12,76);beam(862,348,917,287,10,68);beam(1165,348,1115,287,10,68);
beam(1139,533,1275,581,14,62);beam(1139,552,1253,597,9,117);r(1217,579,151,13,65);r(1225,591,138,11,117);
for(const[x,rad]of [[1245,29],[1320,19]]){ring(x,549,rad,rad,8,68);r(x-5,549,10,55,69);}
r(1250,602,14,240,68);r(1349,599,12,258,68);r(1218,625,139,12,104);
// Right quench: no fluid exposure; useful reserve release point.
r(1397,665,228,77,65);r(1411,676,199,53,104);r(1422,684,176,32,3);
r(1408,660,206,17,131);r(1402,734,214,16,117);r(1432,750,17,108,68);r(1569,750,16,104,68);
r(1375,623,34,39,62);r(1391,608,12,15,69);r(1515,638,22,21,79);r(1545,627,25,18,69);r(1581,629,15,25,76);
r(1424,647,169,12,62);beam(1369,601,1430,636,11,117);r(1595,610,66,12,68);
// Right cliff freight, crane, dispatch assembly.
r(1716,475,247,18,62);r(1730,494,225,15,117);r(1738,508,19,116,68);r(1919,508,17,106,68);
r(1734,599,199,14,62);
for(const x of[1757,1830,1894]){r(x,578,13,21,69);r(x-11,569,35,10,76);}
r(1786,543,106,25,65);r(1802,548,76,13,104);r(1811,465,18,18,77);r(1869,455,14,20,79);
r(1765,346,16,128,68);beam(1773,351,1926,360,13,62);r(1898,360,13,107,68);r(1870,358,16,14,69);
// Anterior underplant foundation for human edit, gaps intended.
r(321,744,125,13,62);r(328,757,12,43,68);r(404,757,13,39,68);r(597,751,93,11,65);
r(606,762,15,44,68);r(659,762,12,41,68);r(769,756,92,11,62);r(782,767,10,41,68);r(845,767,11,40,68);
r(1175,745,129,13,62);r(1184,758,15,42,68);r(1280,758,13,42,68);
r(1431,756,121,11,65);r(1442,767,11,35,68);r(1529,767,11,40,68);
r(1662,689,105,13,62);r(1673,702,10,62,68);r(1744,702,9,41,68);
r(585,807,66,33,0);r(1230,814,49,28,0);
r(770,598,13,275,68);r(792,430,45,37,68); // grounded ladle inspection stay and roof tie
// Precisely authored 35+ cell hatchways that give true free-centre passages into
// enclosed machinery zones while retaining alternate rooted support paths.
r(525,345,165,75,0);              // approach into ladle gallery
r(834,461,101,123,0);           // west annulus portal through both shells
r(1068,461,123,123,0);          // east annulus portal through both shells
r(1760,381,50,72,0);            // freight crane cage side entrance
r(904,734,60,80,0);             // ring undercroft western entry
r(1240,691,45,84,0);            // caster maintenance entry
r(1379,774,94,69,0);           // quench maintenance entry
const sites=[["West rim spawn",124,298],["Ore skip observation",290,306],["Furnace approach",408,340],["Furnace return overhead",552,232],["Suspended ladle",713,380],["West annulus gate",823,506],["Caster heart",998,502],["East annulus gate",1197,506],["Sky ring bypass",1007,164],["Caster east",1279,412],["Quench regulator",1498,557],["Quench overhead",1617,564],["Freight crane",1788,287],["Freight interior",1837,408],["East rim goal",1947,295],["East maintenance",1313,731],["Rim recovery",1684,617],["High approach return",738,224]].map(([name,x,y])=>({name,x,y}));
return {W,H,g,M,seed,sites,spawn:[124,298]};
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
 const flight=[[19,15],[23,19],[31,27]].map(p=>route(...p,null)),obstruction=[894,211,222,134],blocked=route(31,27,obstruction);
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


function build(){
const w=world(),support=bridgeSupport(w);for(let yy=333;yy<434;yy++)w.g.fill(0,yy*w.W+536,yy*w.W+584);for(let yy=296;yy<306;yy++)w.g.fill(68,yy*w.W+555,yy*w.W+570);const rects=encode(w.g,w.W,w.H),a=audit(w,rects),direct=shortest31(w,null),blocked=shortest31(w,[894,211,222,134]);
const failed=a.flight.map(x=>({hull:x.hull,sites:x.sites.filter(y=>!y.clear||!y.reached)}));
if(a.detached||a.airfaces||a.direct||a.flight.some(x=>x.passed!==w.sites.length)||a.blocked.passed!==w.sites.length||direct.steps<0||blocked.steps<0)throw Error("STATIC_GATE "+JSON.stringify({detached:a.detached,air:a.airfaces,fluid_contact:a.direct,failed,blocked:a.blocked.sites.filter(x=>!x.reached||!x.clear),direct_steps:direct.steps,blocked_steps:blocked.steps,support}));
const setup={version:2,extent:[2048,1024],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:w.spawn,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:2}}],next_id:2,selected:1,edits:rects,response:"LA-SELECTIVE",liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
const j=JSON.stringify(setup),hash=sha256(w.g),setupHash=sha256(utf(j)),views=[["overview.png",0,0,2048,1024],["01-ore-furnace.png",188,275,450,425],["02-suspended-ladle.png",545,291,440,422],["03-annular-caster.png",861,335,440,425],["04-thermal-quench.png",1304,420,420,426],["05-east-freight.png",1625,241,420,430]],imgs={},pn={};let px=0;
for(const[name,x,y,ww,hh]of views){const p=png(w.g,2048,x,y,ww,hh);px+=verifyPNG(p,w.g,2048,x,y,ww,hh);pn[name]={xywh:[x,y,ww,hh],sha256:sha256(p),bytes:p.length};imgs[name]=p;}
const receipt={schema:1,original_no_source:true,concept:"Vespergate Caldera Ringforge",seed:w.seed,base_main_sha:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",engine_sha:"de58bf1997ca75825cf3b29e046dc1c1022c45bf",extent:[w.W,w.H],plane_sha256:hash,setup_sha256:setupHash,json_bytes:utf(j).length,rectangle_count:rects.length,source_rectangle_limit:32768,construction_work:a.work,material_histogram:a.hist,ground:{total:a.total,rooted:a.rooted,detached:a.detached,repair:support},fluid:{water:a.hist[3]||0,lava:a.hist[8]||0,exposed_air_faces:a.airfaces,water_lava_contacts:a.direct},flight:a.flight,obstruction:[894,211,222,134],blocked:a.blocked,shortest_goal:{direct:direct,blocked:blocked,detour:blocked.steps-direct.steps},pngs:pn,material_pixel_parity:px,native:"NATIVE-UNTESTED"};
const exemplar={schema_version:1,purpose:["human_editable_canvas","procedural_exemplar","scripted_setpiece_source"],family:"original/industrial-foundry-wide",map_role:"Geological caldera reclamation forge with internally flyable caster ring and two-tier recovery",anchor_donors:[],macro_topology:"One rooted basin between unequal forge and freight shoulders, breached annular caster and exposed central well",density_profile:"Dense ore/fire and quench/dispatch shoulders; exposed central annulus and open upper sky; lower incomplete service excavation",route_grammar:{main:["West rim spawn","Furnace approach","Suspended ladle","West annulus gate","Caster heart","East annulus gate","Quench regulator","East rim goal"],alternative:["Furnace return overhead","Sky ring bypass","Caster east","Freight crane"],recovery:["East maintenance"]},strong_motifs:["Excavated single caldera","Giant double-rim casting annulus with two traversable portals","Rooted unequal process shoulder buttresses","Hanging insulated transfer ladle","East cliffside freight crane","Sealed furnace melt and sealed quench cells"],interesting_relationships:["Two navigable layers flank a single interior casting landmark","Western deep refractory furnace contrasts with open eastern freight rim","Crater geological shape defines clearance and load paths","Deliberate excavation voids preserve human intervention sites"],authoring_affordances:[{name:"Unfinished west service cavern",region_xywh:[568,795,148,56],state:"partial excavation",use:"future maintenance room"},{name:"Annulus undercroft",region_xywh:[942,721,138,117],state:"editable incomplete",use:"scripted door or collapse"},{name:"East quench bay",region_xywh:[1397,788,178,60],state:"partial excavation",use:"quench equipment extension"},{name:"Freight dispatch apron",region_xywh:[1734,508,199,105],state:"arrival stage",use:"NPC or scripted departure"}],setpiece_candidates:[{name:"Caster activation",anchor:"Caster heart",kind:"machinery_activation",staging:"two open annular entrances"},{name:"Gantry break",anchor:"Sky ring bypass",kind:"bridge_failure",staging:"lower recovery route"},{name:"Quench discharge",anchor:"Quench regulator",kind:"thermal_release",staging:"still-sealed water cell"},{name:"Freight extraction",anchor:"East rim goal",kind:"departure",staging:"truck crane and open upper air"}],procedural_exemplar_value:["Large ring with open internal route as grammar motif","One geologically anchored macro basin rather than separated islands","Three-altitude flight graph with returning lower access","Deliberately incomplete safe editing bays"],similarity_avoidance:"Not another Saltglass chain of floating process islands or Crownstep straight hall. Uses a continuous asymmetric caldera, enormous traversable annulus and stacked lower/upper access tied to geological load paths.",diversity_axes:{macro_topology:"basin",altitude_grammar:"multi_strata",density_cadence:"edge_dense_center_open",route_structure:"layered",landmark_family:"ring",support_form:"cliff_embedded",environment_relation:"geological",incompleteness:"excavation"},engine_contract:{accepted_main:"de58bf1997ca75825cf3b29e046dc1c1022c45bf",setup_version:2,rectangle_limit:32768},static_proof:{cells:2097152,plane_sha256:hash,rectangles:rects.length,obstructed_sites:a.blocked.passed}};
const readme="# Vespergate Caldera Ringforge — 2048×1024 ORIGINAL\n\nOne deep, continuous self-authored industrial caldera: ore skip, insulated furnace, suspended sealed ladle, a breached internally navigable giant casting annulus, two outfeed rollers, sealed quench and east freight lift. Distinct from recent separated-island and linear foundries. Purposeful excavation voids, 4 unscripted event-site options and multiple levels make the map a human-editable SWARM/GENTEK corpus exemplar.\n\n**Static receipt:** actual cells 2,097,152; "+rects.length+" exact replay rectangles; "+utf(j).length+" Setup-v2 JSON bytes; work "+a.work+"; solids "+a.rooted+"/"+a.total+" rooted; exposed initial fluid faces "+a.airfaces+"; "+w.sites.length+"/"+w.sites.length+" literal Midge sites reached at 19×15, 23×19 and 31×27, and after a real [894,211,222,134] obstruction. Goal distances "+direct.steps+" / "+blocked.steps+". Material plane SHA-256 `"+hash+"`; indexed PNG parity "+px+" pixels, zero mismatch. Full proof and metadata in receipt.json and exemplar.json.\n\n**Qualification:** creator source-static only; native Godot/Workbench/CyberDemoBridge/Rapier, actor collision, actual fluid evolution and save/reopen NATIVE-UNTESTED. Independent Art/Technical/Shepherd pending. Main CyberSand `de58bf1997ca75825cf3b29e046dc1c1022c45bf` read-only; no engine/schedule changes. Keep Draft/HOLD.\n";
return {files:{"setup.json":j,"receipt.json":JSON.stringify(receipt,null,2)+"\n","exemplar.json":JSON.stringify(exemplar,null,2)+"\n","README.md":readme,...imgs},receipt};
}

const fs=require('node:fs'),path=require('node:path');
if(require.main===module){const out=process.argv[2]||__dirname;fs.mkdirSync(out,{recursive:true});const q=build();for(const[name,data]of Object.entries(q.files))fs.writeFileSync(path.join(out,name),data);process.stdout.write(JSON.stringify({sha:q.receipt.plane_sha256,rectangles:q.receipt.rectangle_count})+'\n');}
module.exports={world,bridgeSupport,encode,audit,build};
