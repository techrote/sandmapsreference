'use strict';
function utf(s){let r=[];for(const z of s){let k=z.codePointAt(0);if(k<128)r.push(k);else if(k<2048)r.push(192|(k>>>6),128|(k&63));else if(k<65536)r.push(224|(k>>>12),128|((k>>>6)&63),128|(k&63));else r.push(240|(k>>>18),128|((k>>>12)&63),128|((k>>>6)&63),128|(k&63));}return Uint8Array.from(r);}

function sha256(msg){const k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2],n=(msg.length+9+63)&~63,b=new Uint8Array(n);b.set(msg);b[msg.length]=128;const bit=msg.length*8,view=new DataView(b.buffer);view.setUint32(n-8,Math.floor(bit/4294967296),false);view.setUint32(n-4,bit>>>0,false);let H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64),rr=(x,n)=>(x>>>n)|(x<<(32-n));for(let off=0;off<n;off+=64){for(let i=0;i<16;i++)w[i]=view.getUint32(off+4*i,false);for(let i=16;i<64;i++){let x=w[i-15],y=w[i-2];w[i]=(w[i-16]+(rr(x,7)^rr(x,18)^(x>>>3))+w[i-7]+(rr(y,17)^rr(y,19)^(y>>>10)))|0;}let[a,c,d,e,f,g,h,j]=H;for(let i=0;i<64;i++){let t=(j+(rr(f,6)^rr(f,11)^rr(f,25))+((f&g)^(~f&h))+k[i]+w[i])|0,u=((rr(a,2)^rr(a,13)^rr(a,22))+((a&c)^(a&d)^(c&d)))|0;j=h;h=g;g=f;f=(e+t)|0;e=d;d=c;c=a;a=(t+u)|0;}H=[(H[0]+a)|0,(H[1]+c)|0,(H[2]+d)|0,(H[3]+e)|0,(H[4]+f)|0,(H[5]+g)|0,(H[6]+h)|0,(H[7]+j)|0];}return H.map(x=>(x>>>0).toString(16).padStart(8,"0")).join("");}

function world(){
 const W=2048,H=1024,g=new Uint8Array(W*H),M={0:"empty",3:"water",8:"lava",57:"industrial-brick",58:"reinforced-concrete",62:"steel-plate",65:"rusted-steel",66:"steel-grating",68:"steel-pipe",69:"copper-pipe",72:"dark-glass",76:"hazard-stripe",77:"neon-cyan",79:"neon-amber",100:"basalt-columns",104:"firebrick",117:"bare-iron",131:"heat-shield-tile"};
 function rect(x,y,w,h,id){x=Math.floor(x);y=Math.floor(y);w=Math.ceil(w);h=Math.ceil(h);for(let yy=Math.max(y,0);yy<Math.min(H,y+h);yy++)g.fill(id,yy*W+Math.max(x,0),yy*W+Math.min(W,x+w));}
 function beam(x,y,xx,yy,w,id){let n=Math.max(Math.abs(xx-x),Math.abs(yy-y));for(let t=0;t<=n;t+=Math.max(2,w/3)){const p=t/n;rect(x+(xx-x)*p-w/2,y+(yy-y)*p-w/2,w,w,id);}}
 function oval(cx,cy,rx,ry,id){for(let y=-ry;y<=ry;y++){const dx=Math.floor(rx*Math.sqrt(Math.max(0,1-y*y/(ry*ry))));rect(cx-dx,cy+y,dx*2+1,1,id);}}
 // Single mechanically coherent geological cross section and excavated central undercroft.
 rect(0,680,2048,344,100);rect(0,680,2048,97,58);rect(0,761,2048,16,62);
 rect(54,777,1940,125,0);rect(0,902,2048,19,62);rect(0,921,2048,103,100);
 rect(0,104,38,576,58);rect(2010,104,38,576,58);
 rect(25,110,1996,22,62);rect(28,132,1990,9,65);
 for(const[x,w]of[[61,179],[260,215],[502,211],[743,215],[992,223],[1242,192],[1469,212],[1711,267]]){
  rect(x,144,w,9,66);beam(x,152,x+w/2,188,5,65);beam(x+w,152,x+w/2,188,5,62);rect(x+w/2-3,151,6,35,68);
 }
 // Ore reception and crooked mono-rail dry charge lift, entirely supported from the foundry floor.
 rect(153,413,256,24,65);rect(174,437,207,20,100);rect(153,394,19,66,62);rect(390,394,19,67,62);
 rect(190,457,21,223,58);rect(362,457,21,223,58);
 beam(219,464,460,561,23,65);beam(218,458,460,555,5,76);beam(228,477,470,573,11,62);
 for(let i=0;i<10;i++){rect(234+i*21,475+i*8,13,7,i%2?117:79);}
 rect(411,518,38,80,131);rect(420,527,21,60,104);rect(450,545,77,15,69);
 rect(240,617,132,16,66);rect(245,633,16,47,58);rect(349,633,16,47,58);
 rect(285,621,35,24,72);rect(299,629,10,6,77);
 // Extraordinary long low horizontal rotary kiln with enclosed liquid heat, refractory and trunnions.
 oval(766,470,273,114,65);oval(766,470,261,102,62);oval(766,470,243,84,104);oval(766,470,212,54,8);
 for(const x of[547,659,787,932]){rect(x,368,14,203,131);rect(x+4,371,7,194,104);}
 rect(519,573,492,14,62);rect(518,589,492,8,76);
 for(const x of[584,750,921]){rect(x-24,572,48,27,117);rect(x-14,596,28,84,58);rect(x-31,652,62,28,65);}
 for(const x of[635,872]){rect(x-13,319,26,38,65);rect(x-4,305,9,56,104);}
 for(let i=0;i<7;i++){let x=550+i*69;rect(x,602,53,28,131);rect(x+6,607,40,10,i%2?79:77);rect(x+20,628,9,52,68);}
 rect(521,639,484,12,66);rect(521,651,484,15,62);
 // No suspended prop, real grounded ceramic-receiver and tapered tundish, visibly linked to kiln.
 beam(1017,480,1160,505,18,104);beam(1017,489,1158,516,6,69);
 rect(1145,407,169,24,65);rect(1148,429,20,164,62);rect(1293,429,20,164,62);
 rect(1167,537,126,22,104);rect(1178,559,103,50,131);rect(1188,567,83,23,8);
 rect(1158,607,142,15,62);rect(1165,620,17,60,58);rect(1284,620,17,60,58);
 rect(1145,652,169,28,58);rect(1173,391,112,16,62);rect(1210,379,44,12,79);
 rect(1315,539,79,16,104);rect(1331,554,18,126,68);
 // Distinct unequal vertical billet-drawing die stacks and sliding rail after crucible transfer.
 for(const[x,y,w,h]of[[1397,474,71,137],[1514,449,82,163],[1636,492,69,120]]){
  rect(x,y,w,h,62);rect(x+9,y+10,w-18,h-29,131);rect(x+17,y+21,w-34,h-54,65);
  rect(x+6,y+h-12,w-12,12,76);rect(x+w/2-4,y+h,8,680-y-h,68);rect(x+20,y+26,12,7,79);
 }
 rect(1359,620,360,18,66);rect(1368,638,342,16,62);rect(1362,654,352,26,58);
 for(let i=0;i<12;i++)rect(1373+i*28,626,11,12,117);
 rect(1495,404,140,13,65);rect(1523,417,15,35,68);rect(1590,417,12,33,68);
 rect(1550,388,45,15,72);rect(1561,394,13,6,77);
 // Guarded shear -> blue quench -> steel-rail dispatch, liquids encased in inert refractory solids.
 rect(1719,539,32,141,58);rect(1727,563,16,89,131);rect(1754,612,46,13,76);
 rect(1788,538,159,142,131);rect(1800,550,135,121,104);rect(1815,567,104,84,3);
 rect(1796,525,142,13,65);rect(1810,508,116,16,62);
 rect(1841,493,37,14,77);rect(1947,619,59,18,66);rect(1947,637,50,43,62);
 rect(1740,679,263,11,76);
 // Continuous tall 104-cell shaft makes lower service tunnel reachable from both above and below.
 rect(1051,298,104,604,0);
 // Underdeck workshop fixtures are rooted directly in the bedrock below y902.
 for(const[x,w]of[[184,169],[496,172],[802,149],[1201,200],[1538,175],[1780,161]]){
  rect(x,883,w,19,62);rect(x+11,858,15,25,68);rect(x+46,865,58,18,65);rect(x+52,869,20,7,79);
 }
 rect(217,852,101,31,117);rect(239,860,48,12,72);
 rect(550,844,95,39,131);rect(562,855,26,7,77);
 rect(1291,844,117,39,65);rect(1308,854,68,14,72);
 rect(1600,847,76,36,68);rect(1612,854,45,9,77);
 for(const[x,w]of[[204,126],[467,106],[734,138],[1195,107],[1479,93],[1833,131]]){rect(x,921,w,13,57);rect(x+20,934,12,33,65);}

 // R2: fix independent Art and Shepherd functional P1 using only real material cells.
 const __r2_before=g.slice(); // sealed fluids must keep identical original material IDs.
 // Dry ore charge clevis, hoist posts and sloped conveyor gate.
 for(const t of [
 [396,520,19,90,62],[400,524,7,81,76],[407,506,49,14,65],
 [416,520,11,71,68],[436,520,11,71,68],[405,593,53,14,62],
 [412,606,12,74,58],[445,607,12,73,58],[407,551,45,9,117],
 [410,555,39,5,79],[452,545,72,11,65],[468,553,46,8,69],
 [486,526,32,32,131],[493,534,19,14,117],[516,542,26,10,62],
 [523,550,16,57,104],[519,607,16,72,68],[414,633,36,20,72],
 [423,641,17,6,77],[462,605,46,10,66]])rect(...t);
 // Canted kiln discharge and isolated protected receiver, preserving 104-cell shaft.
 for(const t of [
 [1000,481,27,61,131],[1005,490,17,38,104],[1019,515,29,15,104],
 [1023,524,25,7,69],[1039,532,14,15,131],[1041,539,10,7,76],
 [1156,531,28,21,131],[1160,534,23,12,104],[1165,553,26,14,62],
 [1170,563,19,7,69],[1136,581,24,14,76],[1158,597,12,81,62],
 [1280,589,11,31,68],[1277,553,17,11,69],[1287,569,39,12,104],
 [1325,567,63,12,62],[1328,578,12,42,68],[1351,582,37,9,69],
 [1338,602,47,17,131],[1341,609,40,6,79]])rect(...t);
 // Individualised three billet withdrawal stations, cam shears, shaft-guided rollers.
 for(const t of [
 [1369,568,25,52,117],[1376,559,16,10,79],[1467,580,40,12,65],
 [1471,573,9,21,117],[1493,573,8,24,117],[1505,584,10,34,68],
 [1507,592,8,6,77],[1596,579,38,12,117],[1603,568,11,26,68],
 [1620,572,10,20,69],[1706,581,19,38,117],[1713,570,12,14,76],
 [1723,546,21,13,62],[1731,552,10,60,68],
 [1752,587,33,14,131],[1759,578,21,11,117],[1765,573,9,6,77],
 [1769,601,11,19,69],[1775,649,16,14,104],[1762,646,11,20,72],
 [1764,652,7,6,79],[1942,566,16,70,131],[1947,570,8,62,68],
 [1958,581,38,10,69],[1960,591,9,46,62],[1975,595,22,12,117]])rect(...t);
 for(const x of [1389,1419,1467,1487,1522,1543,1597,1618,1672,1697]){
  rect(x,610,13,10,117);rect(x+3,606,7,5,79);
 }
 for(const [x,w] of [[1361,29],[1452,31],[1577,31],[1683,29]]){
  rect(x,652,w,7,76);rect(x+4,659,9,21,62);
 }
 // Undercroft radial blower and variable extraction damper (grounded).
 for(const t of [
 [254,850,108,52,58],[266,840,85,10,65],[298,847,10,41,68],
 [284,861,39,7,62],[257,891,94,11,65],[244,836,13,63,68],
 [351,855,42,12,69],[377,857,16,45,58],[385,839,7,17,77]])rect(...t);
 oval(303,867,37,24,117);oval(303,867,23,14,72);
 // Thermal testing: finned horizontal refractory exchanger and pressure stack.
 for(const t of [
 [537,854,161,48,131],[545,845,149,9,65],[551,892,141,10,62],
 [575,834,12,11,69],[593,828,62,9,68],[647,820,12,30,131],
 [652,826,5,21,79]])rect(...t);
 for(const x of [550,569,589,610,630,649,671,687])rect(x,855,7,36,117);
 // Die-coolant rotor pump, twin filters and pipe manifolds.
 for(const t of [
 [1228,861,202,41,58],[1234,851,191,10,65],[1281,850,12,38,68],
 [1320,857,50,11,69],[1371,832,11,46,68],[1371,828,60,9,62],
 [1396,851,11,36,131],[1415,847,13,40,131],[1398,853,6,9,77],
 [1417,853,6,9,79]])rect(...t);
 oval(1287,872,35,24,117);oval(1287,872,21,13,72);
 // East pit distinctive service-valve / drain-bypass array.
 for(const t of [
 [1566,862,193,40,65],[1575,851,172,11,131],[1580,837,29,14,69],
 [1611,839,22,24,68],[1640,829,18,34,72],[1670,840,18,24,69],
 [1718,832,12,39,68],[1733,841,25,9,79]])rect(...t);
 for(const x of [1602,1666,1720]){rect(x,876,24,12,117);rect(x+5,887,11,15,62);}
 // Shallow overhead utility buses preserve full 31x27 Midge undercroft routes.
 for(const t of [
 [182,779,191,7,69],[540,779,146,7,68],[1239,779,177,7,69],
 [1570,780,177,7,68],[195,786,8,12,68],[550,786,8,12,68],
 [1250,786,8,12,69],[1585,787,8,11,68]])rect(...t);
 // Re-establish original sealed reactive materials: machinery may never erase a liquid cell.
 for(let i=0;i<g.length;i++)if(__r2_before[i]===3||__r2_before[i]===8)g[i]=__r2_before[i];
 const sites=[
 ["West freight spawn",88,268],["Ore hoist control",280,266],["Charge gate lookdown",456,274],
 ["Rotary-kiln crown",664,270],["Trunnion diagnostic",899,265],
 ["Receiver control",1199,266],["First mould overlook",1432,269],["Second mould overlook",1554,269],
 ["Shear service",1711,266],["Quench inspection",1850,269],["East dispatch",1973,271],
 ["Centre access shaft",1100,742],["West blower shop",413,813],["Kiln thermal service",744,816],
 ["Die coolant control",1478,813],["East underfloor",1860,813]
 ].map(([name,x,y])=>({name,x,y}));
 return {g,W,H,M,sites,seed:26112071,spawn:[88,268]};
}

function bridgeSupport(world) {
 const {g,W,H}=world,N=g.length,solid=v=>v!==0&&v!==3&&v!==8,root=new Uint8Array(N),q=new Int32Array(N);let at=0,tail=0;
 for(let x=0;x<W;x++){let p=(H-1)*W+x;if(solid(g[p])){root[p]=1;q[tail++]=p;}}
 while(at<tail){const i=q[at++],x=i%W,y=(i/W)|0;for(const j of[x?i-1:-1,x+1<W?i+1:-1,y?i-W:-1,y+1<H?i+W:-1])if(j>=0&&solid(g[j])&&!root[j]){root[j]=1;q[tail++]=j;}}
 const visited=new Uint8Array(N),components=[];let maxSize=0;
 for(let i=0;i<N;i++)if(solid(g[i])&&!root[i]&&!visited[i]){let comp=[],front=0,end=0;const queue=[i];visited[i]=1;while(front<queue.length){let v=queue[front++];comp.push(v);let x=v%W,y=(v/W)|0;for(const j of[x?v-1:-1,x+1<W?v+1:-1,y?v-W:-1,y+1<H?v+W:-1])if(j>=0&&solid(g[j])&&!root[j]&&!visited[j]){visited[j]=1;queue.push(j);}}components.push(comp);maxSize=Math.max(maxSize,comp.length);}
 if(!components.length)return {components:0,links:0,maxSize:0,maxLink:0};
 // Exact shortest empty-cell connectors from existing rooted structure (unobstructed 4-neighbour construction).
 const dist=new Int32Array(N),parent=new Int32Array(N);dist.fill(-1);parent.fill(-1);const mq=new Int32Array(N);let h=0,t=0;
 for(let i=0;i<N;i++)if(root[i]){dist[i]=0;mq[t++]=i;}
 while(h<t){const i=mq[h++],x=i%W,y=(i/W)|0;for(const j of[x?i-1:-1,x+1<W?i+1:-1,y?i-W:-1,y+1<H?i+W:-1])if(j>=0&&g[j]===0&&dist[j]===-1){dist[j]=dist[i]+1;parent[j]=i;mq[t++]=j;}}
 let links=0,maxLink=0;
 for(const comp of components){let best=-1,bestDist=2147483647;for(const idx of comp){const x=idx%W,y=(idx/W)|0;for(const ni of[x?idx-1:-1,x+1<W?idx+1:-1,y?idx-W:-1,y+1<H?idx+W:-1])if(ni>=0&&g[ni]===0&&dist[ni]>=0&&dist[ni]<bestDist){best=ni;bestDist=dist[ni];}}
  if(best<0||bestDist>220)throw Error("Unsupported component needs long spanning false brace length "+bestDist+", size "+comp.length);
  maxLink=Math.max(maxLink,bestDist);let at=best;while(at>=0&&!root[at]){if(g[at]===0){g[at]=68;links++;}at=parent[at];}
 }
 return {components:components.length,links,maxSize,maxLink};
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
 const flight=[[19,15],[23,19],[31,27]].map(p=>route(...p,null)),obstruction=[986,257,55,65],blocked=route(31,27,obstruction);
 return {rectangles:rects.length,work,hist,rooted:b,total,detached:total-b,airfaces,direct,flight,obstruction,blocked};
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
const fs=require('node:fs'),path=require('node:path');
function build(){
 const w=world(),support=bridgeSupport(w),rects=encode(w.g,w.W,w.H),a=audit(w,rects);
 if(a.detached||a.airfaces||a.direct||a.flight.some(v=>v.passed!==w.sites.length)||a.blocked.passed!==w.sites.length)throw Error('native-independent static qualification failed');
 const setup={version:2,extent:[2048,1024],actors:[{id:1,model:'midge',hash:'c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96',spawn:w.spawn,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:2}}],next_id:2,selected:1,edits:rects,response:'LA-SELECTIVE',liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false},setupText=JSON.stringify(setup);
 const views=[["overview.png",0,0,2048,1024],["01-ore-reception.png",138,373,390,307],["02-canted-rotary-kiln.png",482,303,554,376],["03-crucible-transfer.png",1096,359,249,321],["04-billet-casting.png",1344,370,410,316],["05-sealed-quench.png",1740,483,267,221],["06-service-undercroft.png",187,772,1751,131]],imgs={},imeta={};let pixels=0;for(const[name,x,y,ww,hh]of views){let b=png(w.g,2048,x,y,ww,hh);pixels+=verifyPNG(b,w.g,2048,x,y,ww,hh);imgs[name]=b;imeta[name]={crop:[x,y,ww,hh],bytes:b.length,sha256:sha256(b)};}
 const receipt={schema:1,original_no_source:true,concept:'Cinderlock Rotary Tiltworks',seed:26112071,engine_sha:'de109d0131641d6adc8d25bb9ced7ca3d4991105',extent:[2048,1024],plane_sha256:sha256(w.g),setup_sha256:sha256(utf(setupText)),json_bytes:utf(setupText).length,rectangle_count:rects.length,source_rectangle_limit:32768,possible_installed_fallback_untested:4096,construction_work:a.work,material_histogram:a.hist,ground:{total:a.total,rooted:a.rooted,detached:a.detached,repair:support},fluid:{water:a.hist[3],lava:a.hist[8],initial_fluid_air_faces:a.airfaces,initial_water_lava_contacts:a.direct},flight:a.flight,obstruction:{box:a.obstruction,flight:a.blocked},pngs:imeta,pixel_material_parity_count:pixels,native:'NATIVE-UNTESTED'};
 return {'setup.json':utf(setupText),'receipt.json':utf(JSON.stringify(receipt,null,2)+'\n'),...imgs};
}
const result=build(),verify=process.argv.includes('--verify');
for(const[name,contents]of Object.entries(result)){const f=path.join(__dirname,name);if(verify){let b=fs.readFileSync(f);if(b.length!==contents.length||!b.every((v,i)=>v===contents[i]))throw Error('Mismatch in committed file: '+name);}else fs.writeFileSync(f,contents);}
console.log((verify?'VERIFIED ':'GENERATED ')+Object.keys(result).length+' files');
