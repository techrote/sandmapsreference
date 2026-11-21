'use strict';
function utf(s){let r=[];for(const z of s){let k=z.codePointAt(0);if(k<128)r.push(k);else if(k<2048)r.push(192|(k>>>6),128|(k&63));else if(k<65536)r.push(224|(k>>>12),128|((k>>>6)&63),128|(k&63));else r.push(240|(k>>>18),128|((k>>>12)&63),128|((k>>>6)&63),128|(k&63));}return Uint8Array.from(r);}

function sha256(msg){const k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2],n=(msg.length+9+63)&~63,b=new Uint8Array(n);b.set(msg);b[msg.length]=128;const bit=msg.length*8,view=new DataView(b.buffer);view.setUint32(n-8,Math.floor(bit/4294967296),false);view.setUint32(n-4,bit>>>0,false);let H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64),rr=(x,n)=>(x>>>n)|(x<<(32-n));for(let off=0;off<n;off+=64){for(let i=0;i<16;i++)w[i]=view.getUint32(off+4*i,false);for(let i=16;i<64;i++){let x=w[i-15],y=w[i-2];w[i]=(w[i-16]+(rr(x,7)^rr(x,18)^(x>>>3))+w[i-7]+(rr(y,17)^rr(y,19)^(y>>>10)))|0;}let[a,c,d,e,f,g,h,j]=H;for(let i=0;i<64;i++){let t=(j+(rr(f,6)^rr(f,11)^rr(f,25))+((f&g)^(~f&h))+k[i]+w[i])|0,u=((rr(a,2)^rr(a,13)^rr(a,22))+((a&c)^(a&d)^(c&d)))|0;j=h;h=g;g=f;f=(e+t)|0;e=d;d=c;c=a;a=(t+u)|0;}H=[(H[0]+a)|0,(H[1]+c)|0,(H[2]+d)|0,(H[3]+e)|0,(H[4]+f)|0,(H[5]+g)|0,(H[6]+h)|0,(H[7]+j)|0];}return H.map(x=>(x>>>0).toString(16).padStart(8,"0")).join("");}



function world(){
 const W=2048,H=1024,g=new Uint8Array(W*H),seed=261121347;
 const M={0:"air",3:"water",8:"lava",58:"reinforced",62:"plate",65:"rusted",68:"pipe",69:"copper",76:"hazard",77:"cyan",79:"amber",100:"basalt",104:"firebrick",117:"iron",131:"shield"};
 function b(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);if(x<0||y<0||w<1||h<1||x+w>W||y+h>H)throw Error("bounds "+[x,y,w,h,m]);for(let j=y;j<y+h;j++)g.fill(m,j*W+x,j*W+x+w);}
 function l(x,y,X,Y,t,m){const n=Math.ceil(Math.hypot(X-x,Y-y)*2/t);for(let i=0;i<=n;i++){const f=i/n;b(x+(X-x)*f-t/2,y+(Y-y)*f-t/2,t,t,m);}}
 function ring(x,y,rx,ry,t,m){for(let dy=-ry;dy<=ry;dy++){let a=Math.floor(rx*Math.sqrt(Math.max(0,1-dy*dy/(ry*ry)))),k=Math.abs(dy)<ry-t?Math.floor((rx-t)*Math.sqrt(Math.max(0,1-dy*dy/((ry-t)*(ry-t))))):-1;if(k>=0){if(a>k){b(x-a,y+dy,a-k,1,m);b(x+k+1,y+dy,a-k,1,m);}}else if(a)b(x-a,y+dy,2*a+1,1,m);}}
 let seedstate=seed;const rand=()=>{seedstate^=seedstate<<13;seedstate^=seedstate>>>17;seedstate^=seedstate<<5;return (seedstate>>>0)/4294967296;};
 const terraces=[[0,225,696],[225,445,643],[445,625,687],[625,712,751],[712,851,913],[851,1084,944],[1084,1190,824],[1190,1390,766],[1390,1580,715],[1580,1785,754],[1785,1905,687],[1905,2048,656]];
 for(const [x,X,y]of terraces){b(x,y,X-x,H-y,100);b(x,y+24,X-x,5,58);for(let k=x+18;k<X-12;k+=39+Math.floor(rand()*17))b(k,y+42,Math.min(12,X-k),5,65);}
 b(0,994,2048,30,58);b(0,978,2048,6,131);
 // Cut editable workshops in the fault's existing rock mass.
 for(const a of[[307,690,263,77],[476,750,152,101],[1170,829,286,94],[1499,793,181,77],[1804,731,164,88]])b(...a,0);
 for(const a of[[567,613,61,230],[1110,716,76,168],[1463,679,70,154],[1768,640,60,128]])b(...a,0);
 for(const a of[[307,767,264,11,62],[480,852,149,11,62],[1168,924,290,13,62],[1498,870,183,11,62],[1802,819,167,13,62]])b(...a);
 // Lower load-bearing truss with piers grounded in the deep fault.
 b(626,800,501,12,62);b(646,813,460,6,65);
 for(let x=664;x<1090;x+=88){l(x,813,x+44,833,7,117);l(x+44,833,x+88,812,7,117);}
 for(let x of[725,886,1053]){b(x,823,16,133,58);b(x-7,810,30,14,117);}
 // High cableway and asymmetric support towers; authorable bridge-failure site.
 b(620,285,581,14,62);b(625,300,570,6,65);
 for(let x=640;x<1152;x+=78){l(x,306,x+39,338,7,68);l(x+39,338,x+78,306,7,68);}
 b(633,321,17,430,58);b(1165,321,18,503,58);
 l(644,290,768,207,9,68);l(1170,289,1070,192,9,68);
 for(const [x,y,r] of [[768,207,33],[1070,192,40]]){ring(x,y,r,r,9,117);ring(x,y,12,12,6,69);}
 l(788,225,956,280,7,68);l(1053,221,957,282,7,68);
 b(920,275,71,12,65);b(947,287,17,60,68);
 // Open two wide full-hull machine-access portals through cableway deck/truss.
 b(790,270,84,91,0);b(1081,270,71,92,0);
 for(let y=370;y<713;y+=34){b(642,y,10,5,79);b(1171,y,10,5,69);}
 // West ore shed, charge incline and hard engineered supports.
 for(const a of[[46,650,190,22,62],[67,630,17,20,68],[205,630,16,20,68],
 [87,534,130,81,65],[101,545,104,57,58],[116,554,74,38,100],
 [109,603,95,14,117],[64,619,170,11,76],
 [280,587,16,59,68],[329,613,16,38,68],[78,491,160,14,62],
 [89,504,13,39,68],[218,504,12,39,68]])b(...a);
 l(222,615,304,576,12,62);l(303,576,348,614,12,62);
 for(let x=108;x<209;x+=27)b(x,483,11,8,79);
 // Rooted refractory furnace with sealed Lava core.
 for(const a of[[358,515,216,121,65],[376,532,181,85,131],[390,546,153,62,104],
 [405,556,121,43,8],[357,636,219,17,62],[350,498,233,17,58],
 [376,481,177,17,117],[401,466,137,13,69],[436,452,90,12,79]])b(...a);
 l(571,581,635,571,12,117);b(593,560,16,29,68);
 // Suspended pivot ladle, guarded pour and service station.
 for(const a of[[736,433,181,15,117],[753,448,15,70,68],[895,448,15,70,68],
 [768,516,142,16,65],[783,530,111,63,131],[793,541,91,42,104],
 [807,553,63,24,8],[760,592,151,12,117],[725,605,204,12,62],
 [750,617,15,154,68],[904,617,14,154,68]])b(...a);
 l(752,449,734,389,9,69);l(903,449,924,390,9,69);
 ring(754,444,18,18,6,117);ring(902,444,18,18,6,117);
 l(910,590,992,574,12,117);
 // East multi-roll caster: unequal rotors + hydraulic shear with distinct machinery grammar.
 for(const a of[[1230,620,232,20,62],[1240,640,17,126,58],[1435,638,17,80,58],
 [1249,537,180,16,117],[1261,552,15,70,68],[1410,552,15,71,68],
 [1248,686,177,13,65],[1258,705,164,9,76],[1330,540,13,39,69],
 [1436,559,35,15,65],[1446,574,17,48,68],[1231,499,211,15,62]])b(...a);
 for(const [x,y,r]of[[1286,583,34],[1377,581,41],[1335,664,29]]){ring(x,y,r,r,10,117);ring(x,y,12,12,6,69);}
 // Closed quench reservoir; initially no exposed fluid face.
 for(const a of[[1538,630,199,117,65],[1551,643,174,91,104],
 [1563,655,148,65,3],[1531,618,215,13,131],[1538,748,199,16,62],
 [1512,583,246,12,62],[1532,595,14,25,68],[1730,595,14,24,68]])b(...a);
 for(let x=1557;x<1715;x+=35)b(x,570,12,11,76);
 // Freight davit, distinct rotor, departure gantry and two recovery galleries.
 for(const a of[[1821,576,192,19,62],[1845,594,16,62,68],[1982,594,17,62,68],
 [1855,540,117,17,65],[1781,426,18,242,58],[1777,410,209,16,62],
 [1885,315,21,19,117],[1890,334,10,70,68],[1813,611,163,13,76]])b(...a);
 ring(1910,513,34,34,9,117);ring(1910,513,11,11,6,69);
 l(1790,412,1894,319,9,68);l(1902,323,1976,411,9,68);
 // Small repair-front details; cavities beyond these remain deliberately open.
 for(const [x,y]of[[335,732],[508,807],[1236,884],[1540,832],[1842,775]]){
  for(const a of[[x,y,108,9,62],[x+8,y-32,12,32,68],[x+75,y-41,14,41,65],
  [x+29,y-18,35,14,117],[x+39,y-30,18,11,69]])b(...a);
 }
 const data=[
 ["West fault spawn",100,380],["Ore dock",192,429],["Thermal oversight",451,399],
 ["Furnace outlet",555,409],["Upper west",556,140],["Cableway west",847,140],
 ["Cableway east",1127,140],["Ladle gallery",836,388],["Fault basin",1020,422],
 ["East fault recovery",1209,401],["Caster inspection",1270,413],
 ["Roller observation",1404,419],["Quench inspection",1570,423],
 ["Quench diagnostics",1707,437],["Freight elevator",1846,438],
 ["East rim goal",1960,441],["Underbridge traverse",934,719],["Fault return",1063,733],
 ["West service recess",546,783],["Eastern annex",1210,851]
 ];
 const sites=data.map(([name,x,y])=>({name,x,y}));
 for(const s of sites)b(s.x-16,s.y-14,33,29,0);
 return {W,H,g,M,seed,sites,spawn:[100,380]};
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
 const flight=[[19,15],[23,19],[31,27]].map(p=>route(...p,null)),obstruction=[926,0,135,351],blocked=route(31,27,obstruction);
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
 const w=world(),support=bridgeSupport(w),rects=encode(w.g,w.W,w.H),a=audit(w,rects);
 const direct=shortest31(w,null),detour=shortest31(w,[926,0,135,351]);
 if(a.detached||a.airfaces||a.direct||a.flight.some(f=>f.passed!==w.sites.length)||a.blocked.passed!==w.sites.length||direct.steps<0||detour.steps<=direct.steps)
 throw Error("STATIC_GATE "+JSON.stringify({ground:[a.rooted,a.total],fluid:[a.airfaces,a.direct],passes:a.flight.map(v=>v.passed),blocked:a.blocked.passed,total:w.sites.length,failed:a.flight[2].sites.filter(q=>!q.reached),badBlocked:a.blocked.sites.filter(q=>!q.reached),steps:[direct.steps,detour.steps]}));
 const setup={version:2,extent:[2048,1024],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:w.spawn,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:2}}],next_id:2,selected:1,edits:rects,response:"LA-SELECTIVE",liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
 const setupText=JSON.stringify(setup),planeHash=sha256(w.g),setupHash=sha256(utf(setupText));
 if(rects.length>32768||utf(setupText).length>1048576)throw Error("source limit");
 const crops=[["overview.png",0,0,2048,1024],["ore.png",0,334,415,380],["thermal.png",330,348,650,385],["fault-cable.png",590,110,640,680],["roller-caster.png",1170,364,330,416],["quench-freight.png",1450,358,598,424],["underbridge.png",624,688,576,300]],pngs={},pn={},pixels=0;
 for(const [n,x,y,ww,hh]of crops){const p=png(w.g,2048,x,y,ww,hh);pixels+=verifyPNG(p,w.g,2048,x,y,ww,hh);pngs[n]=p;pn[n]={xywh:[x,y,ww,hh],bytes:p.length,sha256:sha256(p)};}
 const receipt={schema:1,concept:"Spindlebreak Fault-Cable Smeltery",original_no_source:true,seed:w.seed,base_main_sha:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",engine_sha:"f7e056c9b8791106e22f2d1c295043783d8a9701",extent:[2048,1024],plane_sha256:planeHash,setup_sha256:setupHash,json_bytes:utf(setupText).length,rectangle_count:rects.length,rectangle_limit:32768,construction_work:a.work,material_histogram:a.hist,ground:{total:a.total,rooted:a.rooted,detached:a.detached,finalisation:support},fluid:{water:a.hist[3]||0,lava:a.hist[8]||0,exposed_air_faces:a.airfaces,water_lava_contacts:a.direct},flight:a.flight,obstruction:a.obstruction,blocked:a.blocked,shortest_goal:{direct:direct.steps,blocked:detour.steps,delta:detour.steps-direct.steps},pngs:pn,material_pixel_parity:pixels,native:"NATIVE-UNTESTED"};
 const exemplar={schema_version:1,purpose:["human_editable_canvas","procedural_exemplar","scripted_setpiece_source"],family:"original/industrial-foundry-wide",map_role:"Fault-stepped smeltery with aerial tension-cable logistics, a separate deep-pier bridge and asymmetric casting terraces.",anchor_donors:[],macro_topology:"One geologically rooted vertical fault with unequal shelves, two structurally independent bridge routes and excavated workshops",density_profile:"Dense ore-furnace and caster-quench ends with a deliberately open fault valley and sparse underplant niches",route_grammar:{main:["West fault spawn","Ore dock","Thermal oversight","Ladle gallery","Fault basin","Caster inspection","Quench inspection","Freight elevator","East rim goal"],upper:["Upper west","Cableway west","Cableway east"],lower:["West service recess","Underbridge traverse","Fault return","Eastern annex"]},strong_motifs:["Twin rooted cableway towers","Lower crossing with deep fault piers","Sealed furnace and quench cores","Pivot suspended ladle","Unequal three-rotor caster","Rail freight davit"],interesting_relationships:["Twin-altitude routes reconnect after fault crossing","Geological rock steps determine factory layout","Industrial dense-to-open contrast creates editable seams","Lower repair cavities support future scripted encounters"],authoring_affordances:[{name:"west service recess",region_xywh:[476,750,152,101],use:"human maintenance refit"},{name:"fault crossing",region_xywh:[710,700,360,92],use:"chase bridge / collapse"},{name:"east undercroft",region_xywh:[1170,829,286,94],use:"modular Gentek append"},{name:"freight annex",region_xywh:[1804,731,164,88],use:"future NPC arrival"}],setpiece_candidates:[{name:"Tension cable failure",anchor:"Cableway west",kind:"bridge_failure"},{name:"Casting activation",anchor:"Roller observation",kind:"machine_activation"},{name:"Contained quench release",anchor:"Quench diagnostics",kind:"hazard_release"},{name:"Freight departure",anchor:"Freight elevator",kind:"departure"}],procedural_exemplar_value:["Fault-step load path grammar","Twin-altitude navigation with 31x27 collision proof","Layered suspension and geology-rooted reinforcement","Unfinished repair pockets"],similarity_avoidance:"Unlike the buried Sablecut arterials, Vespergate caldera ring, Saltglass island chain and flat Crownstep, the key topology is a cross-fault cableway plus deeper pier bridge.",diversity_axes:{macro_topology:"vertical_fault",altitude_grammar:"high_low_bypass",density_cadence:"clustered",route_structure:"branch_rejoin",landmark_family:"cableway",support_form:"twin_pier",environment_relation:"geological",incompleteness:"modular_append_zones"},engine_contract:{accepted_main:"f7e056c9b8791106e22f2d1c295043783d8a9701",rectangle_limit:32768},static_proof:{cells:2097152,sha256:planeHash,rectangles:rects.length,obstructed_sites:a.blocked.passed}};
 const readme="# Spindlebreak Fault-Cable Smeltery\n\nOriginal 2048x1024 industrial material-cell level: fault-stepped geology, ore furnace, pivot ladle, three-rotor caster, sealed quench and freight dispatch. A high cableway and a deep truss alternative cross the open fault. Four unscripted staging/authoring seams remain deliberately incomplete. No reference art used.\n\nSource-static: "+rects.length+" exact lossless rectangles, "+a.work+" construction cells; "+a.rooted+"/"+a.total+" rooted structural cells; initial sealed fluid faces "+a.airfaces+". Whole-plane SHA256 "+planeHash+". "+w.sites.length+" named destinations pass conservative 19x15, 23x19, 31x27 exact-centre BFS and a real obstruction. Direct 31x27 "+direct.steps+" steps, blocked "+detour.steps+" steps. Full indexed PNG and six true 1:1 crops parity-checked. NATIVE-UNTESTED; source-static proof does not imply Midge/Rapier/save-reopen PASS.\n\nReproduce using node build.cjs output-folder. Draft/HOLD, request independent Art/Technical/Shepherd review. Read-only engine main f7e056c9b8791106e22f2d1c295043783d8a9701.\n";
 return {files:{"setup.json":setupText,"receipt.json":JSON.stringify(receipt,null,2)+"\n","exemplar.json":JSON.stringify(exemplar,null,2)+"\n","README.md":readme,...pngs},receipt};
}
if(typeof module!=="undefined"&&module.exports){const fs=require("fs"),path=require("path");module.exports={world,bridgeSupport,encode,audit,build};if(require.main===module){let d=process.argv[2]||__dirname;fs.mkdirSync(d,{recursive:true});const a=build();for(const[n,v]of Object.entries(a.files))fs.writeFileSync(path.join(d,n),v);console.log(a.receipt.plane_sha256,a.receipt.rectangle_count);}}
