'use strict';
function utf(s){let r=[];for(const z of s){let k=z.codePointAt(0);if(k<128)r.push(k);else if(k<2048)r.push(192|(k>>>6),128|(k&63));else if(k<65536)r.push(224|(k>>>12),128|((k>>>6)&63),128|(k&63));else r.push(240|(k>>>18),128|((k>>>12)&63),128|((k>>>6)&63),128|(k&63));}return Uint8Array.from(r);}

function sha256(msg){const k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2],n=(msg.length+9+63)&~63,b=new Uint8Array(n);b.set(msg);b[msg.length]=128;const bit=msg.length*8,view=new DataView(b.buffer);view.setUint32(n-8,Math.floor(bit/4294967296),false);view.setUint32(n-4,bit>>>0,false);let H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64),rr=(x,n)=>(x>>>n)|(x<<(32-n));for(let off=0;off<n;off+=64){for(let i=0;i<16;i++)w[i]=view.getUint32(off+4*i,false);for(let i=16;i<64;i++){let x=w[i-15],y=w[i-2];w[i]=(w[i-16]+(rr(x,7)^rr(x,18)^(x>>>3))+w[i-7]+(rr(y,17)^rr(y,19)^(y>>>10)))|0;}let[a,c,d,e,f,g,h,j]=H;for(let i=0;i<64;i++){let t=(j+(rr(f,6)^rr(f,11)^rr(f,25))+((f&g)^(~f&h))+k[i]+w[i])|0,u=((rr(a,2)^rr(a,13)^rr(a,22))+((a&c)^(a&d)^(c&d)))|0;j=h;h=g;g=f;f=(e+t)|0;e=d;d=c;c=a;a=(t+u)|0;}H=[(H[0]+a)|0,(H[1]+c)|0,(H[2]+d)|0,(H[3]+e)|0,(H[4]+f)|0,(H[5]+g)|0,(H[6]+h)|0,(H[7]+j)|0];}return H.map(x=>(x>>>0).toString(16).padStart(8,"0")).join("");}





function world(){
 const W=2048,H=1024,g=new Uint8Array(W*H),seed=261121734;
 const M={0:"air",3:"water",8:"lava",58:"reinforced",62:"plate",65:"rust",68:"pipe",69:"copper",76:"hazard",79:"amber",100:"basalt",104:"firebrick",117:"steel",131:"shield"};
 const b=(x,y,w,h,m)=>{x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);if(x<0||y<0||w<1||h<1||x+w>W||y+h>H)throw Error("bounds "+[x,y,w,h,m]);for(let j=y;j<y+h;j++)g.fill(m,j*W+x,j*W+x+w);};
 const l=(x,y,X,Y,t,m)=>{let n=Math.max(1,Math.ceil(Math.hypot(X-x,Y-y)/Math.max(2,t/2)));for(let i=0;i<=n;i++){let f=i/n;b(x+(X-x)*f-t/2,y+(Y-y)*f-t/2,t,t,m);}};
 const ring=(cx,cy,rx,ry,t,m)=>{for(let yy=-ry;yy<=ry;yy++){let outer=Math.floor(rx*Math.sqrt(Math.max(0,1-yy*yy/(ry*ry)))),inner=(ry>t&&Math.abs(yy)<ry-t)?Math.floor((rx-t)*Math.sqrt(Math.max(0,1-yy*yy/((ry-t)*(ry-t))))):-1;if(outer>inner){b(cx-outer,cy+yy,outer-inner,1,m);b(cx+inner+1,cy+yy,outer-inner,1,m);}}};
 let s=seed;const rand=()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return(s>>>0)/4294967296;};
 // Three distinct structural levels: atmospheric cantilever, dock gantries, excavated twin keel cradles.
 b(0,948,W,76,100); b(0,853,W,95,100);
 for(let x=0;x<W;){let width=Math.min(60+Math.floor(rand()*95),W-x);b(x,820,width,33,100);b(x,815,width,5,58);x+=width;}
 // Excavation first: drydock A has a deep open service well, B has a different displaced sill.
 b(490,775,496,217,0);b(505,791,468,199,0);
 b(1142,799,491,193,0);b(1158,810,464,176,0);
 b(510,975,467,17,100);b(1158,979,465,13,100);
 // Two drydock parapets, unequal height and asymmetric side service fingers.
 for(const [x,y,w,h] of [[483,775,21,207],[972,786,21,195],[1135,786,22,194],[1623,801,21,184]]) b(x,y,w,h,58);
 for(const [x,y,w] of [[495,785,185],[788,793,189],[1150,803,147],[1440,811,192]]) b(x,y,w,9,62);
 b(0,784,270,69,100);b(0,755,203,29,58);b(1830,783,218,70,100);b(1915,757,133,26,58);
 // Full-length structural load path through two dock-end towers and a third central pylon.
 for(const [x,y,h] of [[235,469,379],[1031,347,493],[1758,483,360]]) {
   b(x,y,24,h,58);b(x-13,y+17,50,13,117);b(x-23,y+h-16,70,17,62);
 }
 // Upper skywork engineering rail with gaps; distinctive disconnected spans attached to masts.
 for(const [x,y,w] of [[78,460,304],[438,437,385],[872,415,278],[1201,444,366],[1627,463,360]]){
   b(x,y,w,13,62);b(x+14,y+13,w-28,8,117);
   for(let xx=x+22;xx<x+w-30;xx+=71){l(xx,y+25,xx+29,y+43,5,68);l(xx+29,y+43,xx+62,y+25,5,68);}
 }
 // Ore lift slopes into a double-throat enclosed arc furnace.
 b(79,566,184,17,62);b(103,583,18,85,68);b(231,584,18,81,68);
 b(112,525,67,40,65);b(123,534,45,23,100);b(190,511,50,54,65);b(201,522,29,27,100);
 l(246,536,309,510,10,117);b(259,486,112,10,62);b(273,497,12,40,68);
 // Two thick refractory arches with sealed hot cores and guarded tap way.
 for(const [x,y,w,h] of [[307,361,162,162],[453,388,145,135]]) {
   b(x,y,w,h,117);b(x+12,y+12,w-24,h-24,131);b(x+25,y+25,w-50,h-50,104);b(x+36,y+39,w-72,h-78,8);
 }
 b(304,344,311,17,58);b(321,524,278,16,62);b(353,539,12,146,68);b(573,538,13,151,68);
 b(606,481,104,13,117);l(595,504,714,519,10,68);b(693,512,26,18,69);
 // Gantry-supported travelling ladle in dry handoff between furnace and caster.
 b(638,343,246,15,58);b(669,361,14,76,68);b(837,358,13,78,68);
 b(694,425,132,112,117);b(707,438,106,87,104);b(719,451,82,55,8);
 b(688,537,145,13,62);l(815,525,904,511,9,68);
 b(859,485,129,15,62);b(886,503,18,65,117);b(960,500,17,68,117);
 // Caster has a hinged four-ram rail, not extrusion rotors or caldera annulus.
 b(911,376,332,17,58);b(941,396,15,109,117);b(1189,394,15,101,117);
 b(919,510,337,16,62);b(930,529,314,11,76);b(944,548,292,12,117);
 for(const [x,len] of [[951,49],[1029,64],[1119,39],[1188,25]]) {
   b(x,461,len,12,65);b(x+8,475,len-16,29,68);
   l(x+7,502,x+len-9,534,8,117);
 }
 b(1072,415,48,18,69);b(1081,434,30,46,117);b(1090,445,13,14,79);
 // Dual drydock vessel silhouettes, one settled keel and one open replacement hull.
 for(const [x,y,w] of [[531,876,419],[1191,890,394]]) {
   l(x,y,x+82,y+61,11,117);b(x+75,y+54,w-159,13,58);l(x+w-82,y+61,x+w,y,11,117);
   b(x+24,y-10,w-50,9,62);b(x+40,y-29,12,19,68);b(x+w-54,y-42,12,32,68);
   for(let xx=x+105;xx<x+w-110;xx+=58)b(xx,y+32,9,22,69);
 }
 b(704,938,13,37,58);b(1361,947,13,34,58);
 // Unequal lower cradle scaffolds, access hoists and future machinery sockets.
 for(const [x,y,w] of [[541,820,97],[824,816,103],[1197,833,117],[1459,837,103]]) {
   b(x,y,w,8,62);b(x+9,y+8,11,48,68);b(x+w-20,y+8,11,51,68);
   b(x+29,y-22,37,22,65);b(x+41,y-32,12,10,69);
 }
 // Service gangway on dock shoulders; preserve broad empty above keels.
 for(const [x,y,w] of [[310,750,142],[997,744,102],[1640,753,161]]) {
   b(x,y,w,13,62);b(x+22,y+13,w-47,5,65);b(x+29,y-36,10,36,68);
 }
 // Quench module is a separate vertical fenced tank with sealed Water.
 b(1408,466,214,170,117);b(1426,483,177,137,104);b(1443,501,142,102,3);
 b(1391,447,246,18,58);b(1400,637,226,15,62);
 for(let x=1417;x<1603;x+=46){b(x,420,18,27,68);b(x-5,411,28,10,79);}
 b(1624,533,80,12,68);l(1704,542,1771,525,9,117);
 // Freight rail and two unmatched wagons held by a grounded ship-to-rail gantry.
 b(1697,492,310,17,62);b(1728,511,14,172,68);b(1947,508,14,175,68);
 l(1730,480,1853,376,9,117);l(1853,376,1980,482,9,117);
 ring(1855,386,37,36,9,62);b(1847,424,16,137,117);
 for(const [x,w,y] of [[1751,104,559],[1867,131,575]]) {
   b(x,y,w,41,65);b(x+12,y+10,w-23,19,131);ring(x+22,y+42,12,12,5,117);ring(x+w-23,y+42,12,12,5,117);
 }
 b(1680,633,325,15,62);b(1707,651,285,7,117);
 // Additional differentiated worker facilities, intentionally part-unfinished.
 for(const [x,y,w] of [[134,735,95],[291,783,116],[1041,777,71],[1652,776,108],[1814,730,134]]) {
  b(x,y,w,8,62);b(x+9,y-23,9,23,68);b(x+w-21,y-32,11,32,65);b(x+31,y-19,33,19,117);
 }
 // Dense-to-open cadence: horizontal return between two deep cavities, deliberate upper void.
 // Add grounded load paths to small disconnected steel members (not scenic unattached islands).
 const solid=v=>v!==0&&v!==3&&v!==8;
 function components(){const seen=new Uint8Array(g.length),q=new Int32Array(g.length);let a=0,z=0;
 for(let x=0;x<W;x++)for(const i of[x,(H-1)*W+x])if(solid(g[i])&&!seen[i]){seen[i]=1;q[z++]=i;}
 while(a<z){let i=q[a++],x=i%W;for(const k of[x?i-1:-1,x<W-1?i+1:-1,i>=W?i-W:-1,i+W<g.length?i+W:-1])if(k>=0&&solid(g[k])&&!seen[k]){seen[k]=1;q[z++]=k;}}
 let comps=[];for(let i=0;i<g.length;i++)if(solid(g[i])&&!seen[i]){let arr=[i],j=0;seen[i]=1;while(j<arr.length){let k=arr[j++],x=k%W;for(const h of[x?k-1:-1,x<W-1?k+1:-1,k>=W?k-W:-1,k+W<g.length?k+W:-1])if(h>=0&&solid(g[h])&&!seen[h]){seen[h]=1;arr.push(h);}}comps.push(arr);}return comps;}
 for(let pass=0;pass<3;pass++){let cs=components();if(!cs.length)break;for(const c of cs){let at=c[0];for(let k=0;k<c.length;k+=Math.max(1,Math.floor(c.length/1000))){let p=c[k];if((p/W|0)>(at/W|0))at=p;}let x=at%W,y=(at/W)|0;b(x,y,3,H-y,68);}}
 // Main engineered over-dock flyway; the ship hulls and industrial machines are kept out of its main envelope.
 b(38,650,1972,88,0);
 // Distinct waypoint graph in freely traversable zones around actual modules.
 const sites=[["West arrival",95,690],["Ore hoist",201,691],["Arc furnace face",390,690],["Ladle stage",745,687],["Caster station",1012,688],["Upper gantry west",911,598],["Upper gantry east",1198,598],["Dry-dock A lip",647,741],["Keel A inspection",767,812],["Drydock B lip",1278,735],["Keel B inspection",1390,809],["Quench watch",1527,685],["Quench service",1627,689],["Freight winch",1798,689],["East rim goal",1950,692],["West repair annex",330,714],["Centre pylon",1080,695],["East shop",1725,696]].map(([name,x,y])=>({name,x,y}));
 // Clear only authentic destination envelopes, not arbitrary moved targets.
 for(const p of sites)b(p.x-17,p.y-15,35,31,0);
 // Re-root isolated fragments only when necessary, preserving destination cells.
 for(let pass=0;pass<2;pass++){let cs=components();if(!cs.length)break;for(const c of cs){let at=c[0];for(let k=0;k<c.length;k+=Math.max(1,Math.floor(c.length/500))){let p=c[k];if((p/W|0)>(at/W|0))at=p;}let x=at%W,y=(at/W)|0;b(x,y,2,H-y,68);}}
 // Preserve exact actor endpoints, then reconnect only truly isolated remnants away from every endpoint.
 for(const p of sites)b(p.x-17,p.y-15,35,31,0);
 for(let pass=0;pass<3;pass++){let cs=components();if(!cs.length)break;for(const c of cs){let at=-1,best=-1;for(let k=0;k<c.length;k+=Math.max(1,Math.floor(c.length/1400))){let i=c[k],x=i%W,y=(i/W)|0;if(sites.some(p=>Math.abs(p.x-x)<55))continue;if(y>best){best=y;at=i;}}if(at<0)at=c[c.length-1];let x=at%W,y=(at/W)|0;b(x,y,2,H-y,68);}}
 return {W,H,g,M,seed,sites,spawn:[95,690]};
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
 const flight=[[19,15],[23,19],[31,27]].map(p=>route(...p,null)),obstruction=[910,654,65,76],blocked=route(31,27,obstruction);
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
 const w=world(),support={components:0,links:0,maxLink:0},rects=encode(w.g,w.W,w.H),a=audit(w,rects);
 const direct=shortest31(w,null),detour=shortest31(w,[910,654,65,76]);
 if(a.detached||a.airfaces||a.direct||a.flight.some(f=>f.passed!==w.sites.length)||a.blocked.passed!==w.sites.length||direct.steps<0||detour.steps<=direct.steps)
 throw Error("STATIC_GATE "+JSON.stringify({ground:[a.rooted,a.total],fluid:[a.airfaces,a.direct],passes:a.flight.map(v=>v.passed),blocked:a.blocked.passed,total:w.sites.length,failed:a.flight[2].sites.filter(q=>!q.reached),badBlocked:a.blocked.sites.filter(q=>!q.reached),steps:[direct.steps,detour.steps]}));
 const setup={version:2,extent:[2048,1024],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:w.spawn,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:2}}],next_id:2,selected:1,edits:rects,response:"LA-SELECTIVE",liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
 const setupText=JSON.stringify(setup),planeHash=sha256(w.g),setupHash=sha256(utf(setupText));
 if(rects.length>32768||utf(setupText).length>1048576)throw Error("source limit");
 let crops=[["overview.png",0,0,2048,1024],["01-ore-and-arc.png",73,330,556,391],["02-ladle-gantry.png",608,325,292,420],["03-dock-a.png",485,759,510,254],["04-tandem-caster.png",900,363,365,376],["05-dock-b-quench.png",1130,790,510,222],["06-freight-terminal.png",1654,360,391,404]],pngs={},pn={},pixels=0;
 for(const [n,x,y,ww,hh]of crops){const p=png(w.g,2048,x,y,ww,hh);pixels+=verifyPNG(p,w.g,2048,x,y,ww,hh);pngs[n]=p;pn[n]={xywh:[x,y,ww,hh],bytes:p.length,sha256:sha256(p)};}
 const receipt={schema:1,concept:"Keelglass Twin-Drydock Smeltery",original_no_source:true,seed:w.seed,base_main_sha:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",engine_sha:"f7e056c9b8791106e22f2d1c295043783d8a9701",extent:[2048,1024],plane_sha256:planeHash,setup_sha256:setupHash,json_bytes:utf(setupText).length,rectangle_count:rects.length,rectangle_limit:32768,construction_work:a.work,material_histogram:a.hist,ground:{total:a.total,rooted:a.rooted,detached:a.detached,finalisation:support},fluid:{water:a.hist[3]||0,lava:a.hist[8]||0,exposed_air_faces:a.airfaces,water_lava_contacts:a.direct},flight:a.flight,obstruction:a.obstruction,blocked:a.blocked,shortest_goal:{direct:direct.steps,blocked:detour.steps,delta:detour.steps-direct.steps},pngs:pn,material_pixel_parity:pixels,native:"NATIVE-UNTESTED"};
 const exemplar={"schema_version":1,"purpose":["human_editable_canvas","procedural_exemplar","scripted_setpiece_source"],"family":"original/industrial-foundry-wide","map_role":"Open-air dockside smeltery between two deeply excavated drydock vessel cradles with separate industrial service routes","anchor_donors":[],"macro_topology":"Twin excavated, unequal drydocks below two distinct rail and gantry strata; functional foundry feeds two hull maintenance and freight zones","density_profile":"Dense western furnaces and terminal, broad exposed upper industrial void, lower two concentrated vessel drydocks with intentional vacant edit pockets","route_grammar":{"main":["West arrival","Ore hoist","Arc furnace face","Ladle stage","Caster station","Quench watch","Freight winch","East rim goal"],"alternate":["Upper gantry west","Upper gantry east"],"recovery":["Dry-dock A lip","Keel A inspection","Drydock B lip","Keel B inspection","West repair annex","East shop"]},"strong_motifs":["Unequal twin grounded drydock pits","Two differently framed static vessel hulls","Paired refractory arc furnace throats","Four unequal linear caster rams","Tall gantry and separate freight rail","Open unfinished worker pockets"],"interesting_relationships":["Industrial smelter overhead feeds large grounded drydock production and inspection sites below","Upper travel bridge bypasses congested main approach","Two drydock hull silhouettes have intentionally different excavation and construction states"],"authoring_affordances":[{"name":"Drydock A retrofit","region_xywh":[645,795,190,55],"use":"Unscripted shipyard construction and SWARM modules"},{"name":"Drydock B extension","region_xywh":[1300,808,180,66],"use":"Incomplete vessel-factory additions"},{"name":"Caster gantry","region_xywh":[990,563,178,60],"use":"Future gantry malfunction or NPC holdout"},{"name":"Freight departure","region_xywh":[1771,688,171,66],"use":"Future cargo escape set piece"}],"setpiece_candidates":[{"name":"Keel cradle release","anchor":"Keel A inspection","kind":"cradle_failure"},{"name":"Caster stoppage","anchor":"Caster station","kind":"industrial_holdout"},{"name":"Quench valve incident","anchor":"Quench watch","kind":"thermal_release"},{"name":"Freight evacuation","anchor":"East rim goal","kind":"departure"}],"procedural_exemplar_value":["Grounded vessel-in-excavation grammar for procedural drydock generation","Asymmetric double service troughs contrasting high production gantry","Parallel altitude districts and surviving whole-hull alternate routes","Unfilled dock construction seams for future composition"],"similarity_avoidance":"Unlike Nadirspan's ceiling-hung plant, Spindlebreak's vertical geological fault, Saltglass's separate exposed islands and Vespergate's single ring crater, this map is an engineered side-elevation twin-drydock yard dominated by grounded steel ship-hulls and two excavated work basins.","diversity_axes":{"macro_topology":"drydock","altitude_grammar":"tri_level","density_cadence":"dense_open_dense","route_structure":"layered","landmark_family":"vessel","support_form":"multi_leg","environment_relation":"dry","incompleteness":"modular_append_zones"}};
 const readme="# Keelglass Twin-Drydock Smeltery\n\nDistinct original 2048×1024 CyberSand indexed-cell foundry/drydock. Two unequal excavated drydocks hold grounded ship-hull cradles under a separately supported open-air ladle, four-ram caster, quench and freight line. Orthographic true side elevation only; no source artwork or borrowed map geometry. Intentional vacant pockets are edit sockets.\n\nProduction: ore hoist → twin arc furnace throats → contained travelling ladle → linear four-ram caster → sealed quench → rail export. Literal Midge checkpoints with whole-body static BFS, plus physically blocked main corridor and genuine alternative flight; see receipt.json. Native engine and installed bridge flight/fluid/save still untested. Builder is reproducible via node build.cjs [output-dir]. Remain Draft/HOLD; obtain independent review.\n";
 return {files:{"setup.json":setupText,"receipt.json":JSON.stringify(receipt,null,2)+"\n","exemplar.json":JSON.stringify(exemplar,null,2)+"\n","README.md":readme,...pngs},receipt};
}
if(typeof module!=="undefined"&&module.exports){const fs=require("fs"),path=require("path");module.exports={world,encode,audit,build};if(require.main===module){let d=process.argv[2]||__dirname;fs.mkdirSync(d,{recursive:true});const a=build();for(const[n,v]of Object.entries(a.files))fs.writeFileSync(path.join(d,n),v);console.log(a.receipt.plane_sha256,a.receipt.rectangle_count);}}
