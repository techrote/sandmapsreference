'use strict';
function utf(s){let r=[];for(const z of s){let k=z.codePointAt(0);if(k<128)r.push(k);else if(k<2048)r.push(192|(k>>>6),128|(k&63));else if(k<65536)r.push(224|(k>>>12),128|((k>>>6)&63),128|(k&63));else r.push(240|(k>>>18),128|((k>>>12)&63),128|((k>>>6)&63),128|(k&63));}return Uint8Array.from(r);}

function sha256(msg){const k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2],n=(msg.length+9+63)&~63,b=new Uint8Array(n);b.set(msg);b[msg.length]=128;const bit=msg.length*8,view=new DataView(b.buffer);view.setUint32(n-8,Math.floor(bit/4294967296),false);view.setUint32(n-4,bit>>>0,false);let H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64),rr=(x,n)=>(x>>>n)|(x<<(32-n));for(let off=0;off<n;off+=64){for(let i=0;i<16;i++)w[i]=view.getUint32(off+4*i,false);for(let i=16;i<64;i++){let x=w[i-15],y=w[i-2];w[i]=(w[i-16]+(rr(x,7)^rr(x,18)^(x>>>3))+w[i-7]+(rr(y,17)^rr(y,19)^(y>>>10)))|0;}let[a,c,d,e,f,g,h,j]=H;for(let i=0;i<64;i++){let t=(j+(rr(f,6)^rr(f,11)^rr(f,25))+((f&g)^(~f&h))+k[i]+w[i])|0,u=((rr(a,2)^rr(a,13)^rr(a,22))+((a&c)^(a&d)^(c&d)))|0;j=h;h=g;g=f;f=(e+t)|0;e=d;d=c;c=a;a=(t+u)|0;}H=[(H[0]+a)|0,(H[1]+c)|0,(H[2]+d)|0,(H[3]+e)|0,(H[4]+f)|0,(H[5]+g)|0,(H[6]+h)|0,(H[7]+j)|0];}return H.map(x=>(x>>>0).toString(16).padStart(8,"0")).join("");}





function world(){
const W=1024,H=2048,g=new Uint8Array(W*H),seed=202611211133;
const M={0:"air",3:"water",8:"lava",58:"reinforced",62:"plate",65:"rust",68:"steel-pipe",69:"copper-pipe",76:"hazard",79:"amber",100:"basalt",104:"firebrick",117:"iron",131:"shield"};
const b=(x,y,w,h,m)=>{x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);if(x<0||y<0||w<1||h<1||x+w>W||y+h>H)throw Error("bounds "+[x,y,w,h,m]);for(let j=y;j<y+h;j++)g.fill(m,j*W+x,j*W+x+w);};
const l=(x,y,X,Y,t,m)=>{let n=Math.ceil(Math.hypot(X-x,Y-y)/Math.max(2,t/2));for(let i=0;i<=n;i++){let q=i/n;b(x+(X-x)*q-t/2,y+(Y-y)*q-t/2,t,t,m);}};
const sites=[["West entry spawn",517,132],["Ore window",370,325],["Ore return gallery",280,380],["Upper kiln inspection",755,341],["Arc furnace face",665,533],["Ladle platform",570,696],["Dock A upper lip",322,887],["Keel A inspection",251,1005],["Caster watch",777,1019],["Bypass high mouth",330,1080],["Bypass low mouth",320,1321],["Dock B upper lip",725,1288],["Keel B inspection",800,1430],["Quench watch",333,1619],["Quench service",349,1740],["Freight inspection",775,1807],["East rim goal",690,1865],["Lower shaft return",532,1820]].map(([name,x,y])=>({name,x,y}));
b(0,0,W,H,100);
// Excavated vertical spine, unequal lateral chambers and deliberate two-door west return.
b(389,84,254,1854,0);
for(const q of [[84,173,310,270],[634,292,313,358],[80,814,328,349],[636,846,299,282],[181,1055,222,371],[632,1214,305,361],[81,1460,328,333],[632,1665,308,284],[224,1106,179,282],[349,1090,78,87],[351,1302,80,82]])b(...q,0);
for(const q of [[371,285,40,101],[625,460,41,125],[369,916,47,132],[625,923,45,134],[351,1070,69,94],[351,1295,70,103],[620,1312,62,141],[362,1581,61,128],[619,1785,72,108]])b(...q,0);
b(0,0,W,54,58);b(0,1942,W,106,100);
for(const [x,y,w]of[[88,200,284],[658,310,269],[86,828,294],[655,862,267],[208,1192,184],[650,1241,270],[83,1483,303],[651,1688,275]]){b(x,y,w,9,58);b(x+14,y+9,w-28,6,62);}
// Inward ore hoist and two unlike receiving bins, rooted to western rock.
b(84,238,296,12,62);b(91,238,18,125,68);b(365,238,12,116,68);
for(const [x,y,w]of[[145,275,74],[248,264,89]]){b(x,y,w,56,65);b(x+12,y+10,w-24,22,100);l(x+8,y+56,x+w/2,y+82,8,68);l(x+w-10,y+56,x+w/2,y+82,8,68);}
b(84,362,281,11,62);b(146,369,79,14,104);b(312,368,33,25,131);
b(355,184,14,179,68);b(361,242,19,18,69);b(361,340,19,15,69);
// Two sealed refractory hearths and structural feet into the rooted east shelf.
b(648,365,283,15,58);b(662,380,14,213,117);b(915,380,15,213,117);
for(const [x,y,w,h]of[[695,390,92,140],[792,405,93,125]]){b(x,y,w,h,104);b(x+12,y+12,w-24,h-25,131);b(x+24,y+24,w-48,h-57,8);}
b(669,543,245,14,62);b(671,593,244,14,58);b(780,528,9,20,117);b(871,527,10,23,117);
b(693,580,12,43,68);b(854,580,12,38,69);l(694,563,649,628,8,68);
// Wall-hung ladle, with obvious clearance through central elevator void.
b(640,638,118,14,58);b(646,652,13,135,68);b(734,652,11,133,68);
b(661,690,80,68,117);b(671,700,60,45,104);b(682,712,39,21,8);
b(650,763,106,12,62);b(725,775,10,29,69);
// Upper left drydock: entered long keel, true grounded cradle and incomplete repairs.
b(89,1117,311,24,58);b(89,1117,16,45,58);b(136,1117,16,46,58);
b(119,1099,266,12,62);
l(111,978,183,1073,11,117);l(183,1073,331,1073,12,117);l(331,1073,383,985,11,117);
b(183,1062,154,13,62);b(198,1075,14,42,58);b(329,1075,14,42,58);
b(123,958,215,12,62);b(131,931,15,27,68);b(315,925,16,33,68);
for(let x=214;x<=308;x+=33){b(x,1011,8,42,69);b(x-3,1006,14,7,65);}
b(89,843,16,187,58);b(89,843,279,10,62);b(114,854,12,69,68);
// Different double-ended ram casters on right-hand intermediate shelf.
b(653,879,271,13,58);b(653,879,14,114,58);b(682,908,221,13,62);
b(674,908,11,111,68);b(901,918,12,106,68);
for(const [x,len,y]of[[709,80,940],[809,65,963]]){b(x,y,len,13,117);b(x+9,y+13,len-17,31,68);b(x+13,y+44,len-27,9,76);}
b(664,1047,246,12,62);b(672,1058,14,69,58);
// Entered alternate tunnel between two physically separate lateral ports.
for(let y=1176;y<=1320;y+=69){b(182,y,52,8,62);b(183,y-35,10,35,68);}
// Lower right drydock, asymmetrically disassembled keel and dense repair pads.
b(644,1523,278,18,58);b(658,1523,16,52,58);b(887,1523,12,52,58);
b(662,1506,253,13,62);
l(657,1370,710,1445,11,117);l(710,1445,817,1474,12,117);l(817,1474,910,1390,11,117);
b(709,1456,121,12,62);b(729,1468,13,55,58);b(821,1468,13,55,58);
b(658,1318,253,11,62);b(658,1318,13,59,58);b(891,1318,15,70,58);
for(const [x,y]of[[685,1488],[857,1495]]){b(x,y,36,9,62);b(x+7,y-28,9,28,68);}
// Lower left valve quench with genuinely sealed water and service threshold.
b(80,1538,222,126,58);b(105,1563,168,76,3);
b(80,1686,300,12,62);b(86,1698,13,76,68);b(366,1698,12,76,68);
for(const x of[144,247]){b(x,1516,13,22,69);b(x-8,1507,29,10,79);}
b(316,1628,13,98,68);b(320,1725,55,8,62);
// Freight on unequal cantilever/roof legs, open entering gate.
b(644,1705,286,13,58);b(649,1705,14,190,58);b(905,1705,15,185,58);
l(661,1724,782,1686,9,117);l(782,1686,902,1720,9,117);
b(774,1701,17,154,117);b(722,1827,95,35,65);b(732,1837,75,18,131);
b(843,1802,53,41,65);b(851,1812,37,21,131);
b(672,1910,243,14,62);b(683,1924,14,18,58);b(892,1924,13,18,58);
// Real full-body doorway through the west freight post, maintaining roof-rooted beam.
b(646,1766,66,123,0);b(657,1754,56,18,0);
for(const [x,y,w]of[[116,380,70],[702,578,95],[137,1107,69],[700,1511,92],[737,1900,91]])b(x,y,w,5,76);
// Main shaft never reduced to sub-Midge width. Preserve outboard return corridors.
b(397,88,224,1840,0);
for(const q of [[359,290,58,88],[614,478,77,112],[356,936,66,107],[612,928,75,101],[352,1055,66,100],[353,1304,69,74],[608,1314,81,131],[349,1579,77,121],[338,1675,83,109],[606,1774,86,124]])b(...q,0);
// Only authored literal site footprints are carved; no waiver, relocation, radius exception.
for(const p of sites)b(p.x-19,p.y-17,39,35,0);
// Bypass drill into right-hand caster/keel maintenance shaft.
b(668,1060,128,286,0);b(611,1052,112,94,0);b(612,1280,112,123,0);
// Remove truly unsupported inert fragments (not retained as pseudo-foundations).
const solid=id=>id!==0&&id!==3&&id!==8,seen=new Uint8Array(g.length),q=new Int32Array(g.length);let a=0,z=0;
const add=i=>{if(solid(g[i])&&!seen[i]){seen[i]=1;q[z++]=i;}};
for(let x=0;x<W;x++){add(x);add((H-1)*W+x);}for(let y=0;y<H;y++){add(y*W);add(y*W+W-1);}
while(a<z){let i=q[a++],x=i%W;for(const j of[x?i-1:-1,x<W-1?i+1:-1,i>=W?i-W:-1,i+W<g.length?i+W:-1])if(j>=0)add(j);}
let braceCount=0,bracedCells=0;
const original=new Uint8Array(g.length),extra=new Uint8Array(g.length);for(let i=0;i<g.length;i++)if(solid(g[i])&&!seen[i])original[i]=1;
for(let i=0;i<g.length;i++)if(original[i]&&!extra[i]){
 let comp=[i],at=0;extra[i]=1;while(at<comp.length){let k=comp[at++],x=k%W;for(const j of [x?k-1:-1,x<W-1?k+1:-1,k>=W?k-W:-1,k+W<g.length?k+W:-1])if(j>=0&&original[j]&&!extra[j]){extra[j]=1;comp.push(j);}}
 let best=null;for(let k=0;k<comp.length;k+=Math.max(1,Math.floor(comp.length/80))){
  let p=comp[k],x=p%W,y=p/W|0;
  for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]])for(let d=1;d<=220;d++){
   let xx=x+dx*d,yy=y+dy*d;if(xx<3||yy<3||xx>=W-3||yy>=H-3)break;
   let id=g[yy*W+xx];if(id===3||id===8)break;
   if(sites.some(t=>Math.abs(t.x-xx)<29&&Math.abs(t.y-yy)<25))break;
   if(seen[yy*W+xx]&&solid(id)){if(!best||d<best.d)best={x,y,xx,yy,d};break;}
  }
 }
 if(best){let {x,y,xx,yy,d}=best;if(x===xx)b(x,Math.min(y,yy),2,Math.abs(yy-y)+1,68);else b(Math.min(x,xx),y,Math.abs(xx-x)+1,2,68);braceCount++;bracedCells+=d*2;}
}
seen.fill(0);a=0;z=0;for(let x=0;x<W;x++){add(x);add((H-1)*W+x);}for(let y=0;y<H;y++){add(y*W);add(y*W+W-1);}
while(a<z){let i=q[a++],x=i%W;for(const j of[x?i-1:-1,x<W-1?i+1:-1,i>=W?i-W:-1,i+W<g.length?i+W:-1])if(j>=0)add(j);}
// Retain 70-cell clearance across the brace at the bifurcation.
b(710,1139,70,58,0);
seen.fill(0);a=0;z=0;for(let x=0;x<W;x++){add(x);add((H-1)*W+x);}for(let y=0;y<H;y++){add(y*W);add(y*W+W-1);}
while(a<z){let i=q[a++],x=i%W;for(const j of[x?i-1:-1,x<W-1?i+1:-1,i>=W?i-W:-1,i+W<g.length?i+W:-1])if(j>=0)add(j);}
let lost=0;for(let i=0;i<g.length;i++)if(solid(g[i])&&!seen[i]){g[i]=0;lost++;}
return {W,H,g,M,seed,sites,spawn:[sites[0].x,sites[0].y],discarded_ungrounded:lost,braceCount,bracedCells};
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
 const flight=[[19,15],[23,19],[31,27]].map(p=>route(...p,null)),obstruction=[391,1160,256,87],blocked=route(31,27,obstruction);
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
 const w=world(),rects=encode(w.g,w.W,w.H),a=audit(w,rects),direct=shortest31(w,null),detour=shortest31(w,[391,1160,256,87]);
 if(a.detached||a.airfaces||a.direct||a.flight.some(f=>f.passed!==w.sites.length)||a.blocked.passed!==w.sites.length||detour.steps<=direct.steps)
 throw Error("STATIC_GATE "+JSON.stringify({detached:a.detached,fluid:[a.airfaces,a.direct],passed:a.flight.map(f=>f.passed),bad:a.flight[2].sites.filter(s=>!s.reached),blocked:a.blocked.passed,steps:[direct.steps,detour.steps]}));
 const setup={version:2,extent:[1024,2048],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:w.spawn,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:2}}],next_id:2,selected:1,edits:rects,response:"LA-SELECTIVE",liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
 const setupText=JSON.stringify(setup),sha=sha256(w.g),setupSHA=sha256(utf(setupText));if(rects.length>32768||utf(setupText).length>1048576)throw Error("Setup limit");
 const crops=[["overview.png",0,0,1024,2048],["01-ore-hoist.png",76,159,346,320],["02-twin-furnaces.png",624,290,344,392],["03-upper-drydock.png",77,801,350,381],["04-casters-and-return.png",611,833,360,340],["05-lower-drydock.png",618,1202,350,380],["06-quench-maintenance.png",76,1446,348,377],["07-freight-exit.png",610,1655,360,379]],pngs={},pngMeta={};let px=0;
 for(const [n,x,y,ww,hh]of crops){const p=png(w.g,w.W,x,y,ww,hh);px+=verifyPNG(p,w.g,w.W,x,y,ww,hh);pngs[n]=p;pngMeta[n]={xywh:[x,y,ww,hh],bytes:p.length,sha256:sha256(p)};}
 const receipt={schema:1,trial:"PORTRAIT-001",difficulty:"DIFFICULT",source:{pr:160,head:"cf47967470e402693957ab04ebfb3fe6d787d943",path:"cybersand-canvases/2048x1024/original-industrial-foundry-wide-keelglass-twin-drydock-261121/"},base:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",engine:"69209acaffb34ebe18c45e19290b5976b7fb2c82",seed:w.seed,dimensions:[1024,2048],cells:2097152,source_grid_sha256:sha,setup_sha256:setupSHA,setup_bytes:utf(setupText).length,rectangles:rects.length,construction_work:a.work,material_histogram:a.hist,ground:{total:a.total,rooted:a.rooted,detached:a.detached,pruned_provisional:w.discarded_ungrounded},fluid:{water:a.hist[3]||0,lava:a.hist[8]||0,exposed_faces:a.airfaces,water_lava_contacts:a.direct},hulls:a.flight,physical_obstruction:a.obstruction,obstructed:a.blocked,goal_distance:{direct:direct.steps,obstructed:detour.steps},pngs:pngMeta,pixel_parity:px,native:"NATIVE-UNTESTED"};
 return {setupText,receipt,pngs};
}
if(typeof require!=="undefined" && typeof module!=="undefined" && require.main===module){const fs=require("fs"),path=require("path"),d=process.argv[2]||__dirname;fs.mkdirSync(d,{recursive:true});const a=build();fs.writeFileSync(path.join(d,"setup.json"),a.setupText);fs.writeFileSync(path.join(d,"receipt.json"),JSON.stringify(a.receipt,null,2)+"\n");for(const[n,v]of Object.entries(a.pngs))fs.writeFileSync(path.join(d,n),v);console.log(a.receipt);}
if(typeof module!=="undefined")module.exports={build,world,encode,audit,shortest31,png,verifyPNG};