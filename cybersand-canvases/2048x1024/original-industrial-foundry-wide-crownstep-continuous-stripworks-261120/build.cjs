'use strict';
function utf(s){let r=[];for(const z of s){let k=z.codePointAt(0);if(k<128)r.push(k);else if(k<2048)r.push(192|(k>>>6),128|(k&63));else if(k<65536)r.push(224|(k>>>12),128|((k>>>6)&63),128|(k&63));else r.push(240|(k>>>18),128|((k>>>12)&63),128|((k>>>6)&63),128|(k&63));}return Uint8Array.from(r);}

function sha256(msg){const k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2],n=(msg.length+9+63)&~63,b=new Uint8Array(n);b.set(msg);b[msg.length]=128;const bit=msg.length*8,view=new DataView(b.buffer);view.setUint32(n-8,Math.floor(bit/4294967296),false);view.setUint32(n-4,bit>>>0,false);let H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64),rr=(x,n)=>(x>>>n)|(x<<(32-n));for(let off=0;off<n;off+=64){for(let i=0;i<16;i++)w[i]=view.getUint32(off+4*i,false);for(let i=16;i<64;i++){let x=w[i-15],y=w[i-2];w[i]=(w[i-16]+(rr(x,7)^rr(x,18)^(x>>>3))+w[i-7]+(rr(y,17)^rr(y,19)^(y>>>10)))|0;}let[a,c,d,e,f,g,h,j]=H;for(let i=0;i<64;i++){let t=(j+(rr(f,6)^rr(f,11)^rr(f,25))+((f&g)^(~f&h))+k[i]+w[i])|0,u=((rr(a,2)^rr(a,13)^rr(a,22))+((a&c)^(a&d)^(c&d)))|0;j=h;h=g;g=f;f=(e+t)|0;e=d;d=c;c=a;a=(t+u)|0;}H=[(H[0]+a)|0,(H[1]+c)|0,(H[2]+d)|0,(H[3]+e)|0,(H[4]+f)|0,(H[5]+g)|0,(H[6]+h)|0,(H[7]+j)|0];}return H.map(x=>(x>>>0).toString(16).padStart(8,"0")).join("");}

function world(){
 const W=2048,H=1024,g=new Uint8Array(W*H);
 const M={0:"empty",3:"water",8:"lava",58:"reinforced-concrete",62:"steel-plate",65:"rusted-steel",66:"steel-grating",68:"steel-pipe",69:"copper-pipe",72:"dark-glass",76:"hazard-stripe",77:"neon-cyan",79:"neon-amber",100:"basalt-columns",104:"firebrick",117:"bare-iron",131:"heat-shield-tile"};
 function rect(x,y,w,h,id){x=Math.floor(x);y=Math.floor(y);w=Math.ceil(w);h=Math.ceil(h);if(x<0||y<0||w<1||h<1||x+w>W||y+h>H)throw Error("bad box "+[x,y,w,h,id]);for(let yy=y;yy<y+h;yy++)g.fill(id,yy*W+x,yy*W+x+w);}
 function beam(x,y,X,Y,t,id){const n=Math.max(Math.abs(X-x),Math.abs(Y-y));for(let k=0;k<=n;k+=Math.max(1,Math.floor(t/4))){const f=k/n;rect(x+(X-x)*f-t/2,y+(Y-y)*f-t/2,t,t,id);}}
 function ellipse(cx,cy,rx,ry,id){for(let y=-ry;y<=ry;y++){let s=Math.floor(rx*Math.sqrt(Math.max(0,1-y*y/(ry*ry))));rect(cx-s,cy+y,2*s+1,1,id);}}
 // CROWNSTEP CONTINUOUS STRIPWORKS: dedicated side-tip, three thermal hearths,
 // twin dry siphon ladles, crownwheel strip finishing, sealed water quench and freight.
 // The upper air bridge and six real-rooted underplant shops are different routes.
 rect(0,920,2048,104,100);rect(0,899,2048,21,58);
 rect(0,450,39,449,100);rect(2009,450,39,449,100);
 rect(39,143,1970,20,65);rect(39,163,1970,9,62);
 rect(39,172,15,280,58);rect(1994,172,15,280,58);
 for(let x=78;x<1840;x+=172){beam(x,174,x+82,195+(x%4)*4,7,68);beam(x+82,195+(x%4)*4,x+160,174,7,68);}
 rect(38,695,1972,27,58);rect(45,687,1956,8,62);rect(38,722,1972,18,65);
 rect(48,740,1952,153,0);rect(48,893,1952,6,65);
 // Intake: horizontal side-tip rather than an inclined hoist.
 rect(75,634,299,53,58);rect(90,621,270,13,66);
 rect(98,572,172,40,117);rect(106,560,154,12,76);
 for(let x=111;x<257;x+=25){rect(x,585,14,12,79);rect(x+3,603,17,8,65);}
 rect(120,482,180,16,65);rect(131,498,14,123,58);rect(282,498,14,123,58);
 rect(149,505,115,55,72);rect(169,521,19,12,77);
 ellipse(323,574,35,35,117);ellipse(323,574,21,19,72);
 rect(337,604,42,12,62);rect(365,579,38,9,69);
 // Triple nested sealed thermal chambers with unequal vertically stacked firebox geometry.
 rect(399,621,404,66,58);
 for(const [x,w,h]of [[412,125,145],[549,111,112],[673,121,126]]){
   rect(x,615-h,w,h,104);rect(x+12,628-h,w-24,h-29,131);
   rect(x+32,659-h,w-66,h-76,8);
   rect(x-4,602-h,w+8,13,65);rect(x+5,589-h,w-10,10,76);
   rect(x+6,615,15,72,62);rect(x+w-21,615,15,72,62);
 }
 // Bounded pipe handoff to two separately supported counterweight ladles.
 rect(780,558,130,18,68);rect(792,545,105,13,69);
 rect(819,393,286,18,65);rect(825,411,274,9,76);
 rect(820,420,18,267,58);rect(1080,420,17,267,58);
 for(let x=845;x<1047;x+=46){beam(x,423,x+35,469,7,68);beam(x+35,423,x,469,6,69);}
 for(const [x,y,w,h] of [[862,565,77,74],[991,588,69,53]]){
   rect(x-6,472,12,y-472,69);rect(x+w-6,472,12,y-472,68);
   rect(x-8,y-16,w+16,16,117);rect(x,y,w,h,104);
   rect(x+13,y+15,w-26,h-30,131);rect(x-5,y+h,w+10,12,62);
   rect(x+5,y+h+12,14,687-(y+h+12),58);
 }
 rect(946,512,42,15,69);rect(958,527,12,39,69);
 // Three truly different powered, concentric crown wheel assemblies.
 rect(1090,651,477,36,58);rect(1106,636,450,15,62);
 rect(1102,554,440,14,117);rect(1109,568,429,8,76);
 for(const [cx,cy,rx,ry]of [[1183,538,56,63],[1346,536,80,87],[1513,541,41,48]]){
   ellipse(cx,cy,rx,ry,117);ellipse(cx,cy,rx-13,ry-13,72);
   ellipse(cx,cy,18,18,65);ellipse(cx,cy,8,8,79);
   beam(cx-rx+8,cy,cx+rx-8,cy,8,68);beam(cx,cy-ry+8,cx,cy+ry-8,7,68);
   rect(cx-12,cy+ry,24,651-cy-ry,62);
 }
 for(const [x,y,w]of [[1101,613,113],[1237,610,76],[1392,614,88],[1495,624,57]]){
   rect(x,y,w,12,65);rect(x+7,y+12,w-14,6,66);
   for(let a=x+15;a<x+w-14;a+=22){ellipse(a,y-8,9,9,117);ellipse(a,y-8,4,4,72);}
 }
 // Mechanical shear: a distinct hydraulic ram and guarded terminal knife.
 rect(1558,505,45,129,58);rect(1569,526,26,24,117);
 rect(1579,551,9,64,69);rect(1571,576,25,13,76);
 beam(1561,617,1607,603,8,62);
 // Sealed triple quench below crosshead gantry, strictly separated from molten hearth.
 rect(1605,520,221,167,58);rect(1618,537,193,133,104);
 for(const [x,w]of [[1629,47],[1690,38],[1742,53]])rect(x,550,w,107,3);
 rect(1618,527,193,23,131);rect(1618,657,193,13,104);
 rect(1609,492,209,15,65);rect(1618,507,192,12,76);
 rect(1600,508,13,179,69);rect(1815,508,13,179,68);
 // Short freight shed beyond right-hand recovery riser.
 rect(1902,634,105,53,58);rect(1909,623,94,11,66);
 rect(1914,573,82,35,117);rect(1923,563,65,10,76);
 for(const x of [1923,1957,1985]){rect(x,607,10,24,68);rect(x+2,614,6,8,79);}
 rect(1950,432,27,119,58);rect(1957,447,13,90,72);rect(1963,477,7,21,77);
 // Six distinct access-repair shops on a continuous lower traversable circuit.
 rect(73,865,254,35,58);rect(89,848,228,17,65);
 rect(131,831,118,11,117);rect(159,818,15,19,69);rect(214,819,15,18,69);
 rect(429,864,225,36,58);rect(441,848,201,16,62);
 for(let x=457;x<620;x+=19)rect(x,823,10,25+(x%4),131);
 rect(453,818,180,7,69);
 rect(753,862,258,38,58);rect(767,846,229,16,65);
 ellipse(834,860,37,27,117);ellipse(834,860,21,13,72);
 ellipse(939,860,22,20,117);ellipse(939,860,10,9,72);
 rect(860,852,57,11,68);
 rect(1103,864,235,36,58);rect(1115,848,211,16,65);
 for(const x of [1142,1183,1253,1304])rect(x,821,12,27,69);
 rect(1141,816,173,7,68);rect(1155,851,17,13,77);
 rect(1425,864,237,36,58);rect(1438,848,212,16,62);
 for(const [cx,rx,ry]of [[1470,19,15],[1537,26,20],[1616,16,12]]){ellipse(cx,851,rx,ry,117);ellipse(cx,851,rx-6,ry-6,72);}
 rect(1486,816,123,8,68);rect(1588,811,13,13,76);
 rect(1908,862,92,38,58);rect(1917,846,76,16,117);
 rect(1925,823,53,23,72);rect(1940,832,13,9,77);
 // Central rooted torque tower is aligned within the audited upper choke; lower gallery remains unobstructed.
 rect(1017,172,20,515,58);rect(1023,195,8,192,72);
 // Carve true recovery voids LAST so exact full-hull destinations cannot become decorative pixels.
 rect(325,326,94,520,0);rect(1830,326,70,520,0);
 rect(51,742,1947,77,0);
 rect(313,509,8,178,76);rect(425,509,8,178,76);
 rect(1818,509,8,178,76);rect(1904,509,8,178,76);

 // Crownstep process-legibility P1: physically mounted (not floating) detail.
 // Three different staffed hearth charge/inspection structures.
 rect(420,465,27,18,65);rect(426,459,16,6,76);
 rect(432,481,18,31,69);rect(436,487,11,13,72);
 rect(497,507,34,16,117);rect(504,509,19,10,72);
 rect(550,488,35,27,58);rect(558,480,19,8,66);
 rect(571,494,18,24,69);rect(577,499,10,13,131);
 for(const x of [608,625,644])rect(x,512,7,33,117);
 rect(679,474,34,30,65);rect(685,468,20,6,76);
 rect(704,492,27,25,69);rect(712,497,14,9,72);
 rect(755,516,32,18,117);rect(764,523,13,8,79);
 // Solid-to-solid short interstage transfer rather than detached pipes.
 rect(529,599,35,15,69);rect(549,603,28,9,104);
 rect(650,610,39,13,68);rect(668,605,24,14,104);
 rect(775,617,42,13,104);rect(792,612,24,18,117);
 // The suspended cups now have visibly tilted pour lips, connected to each cup.
 rect(919,614,44,11,117);rect(929,607,16,12,69);
 rect(957,617,44,11,104);rect(973,622,28,9,62);
 rect(1046,613,51,15,117);rect(1079,620,27,11,69);
 rect(1091,622,41,12,104);rect(1112,631,14,20,58);
 // Distinct entry, compression, cutoff and inspected mill outfeed.
 rect(1110,613,40,13,66);rect(1116,607,16,9,76);
 rect(1239,608,38,13,117);rect(1246,605,17,9,69);
 rect(1389,613,34,15,62);rect(1396,609,19,7,77);
 rect(1496,620,42,14,117);rect(1506,613,24,9,76);
 rect(1568,599,23,24,117);rect(1576,603,10,10,72);
 // Quench dry-feed and inspection face tied to the existing sealed tank.
 rect(1612,514,35,16,58);rect(1622,518,15,9,72);
 rect(1765,511,40,17,65);rect(1775,516,19,10,79);
 rect(1802,609,30,12,62);rect(1819,618,31,12,66);
 // Five genuinely distinct floor-founded underplant workstations.
 // All remain BELOW the 77px clear flyway and outside both rescue shafts.
 rect(125,843,36,13,117);rect(132,838,21,9,68);
 rect(181,838,57,13,62);rect(197,833,31,8,72);
 rect(462,844,48,14,131);rect(477,836,20,10,69);
 rect(566,837,29,12,68);rect(573,832,15,9,77);
 rect(780,843,27,14,65);rect(787,837,14,9,69);
 rect(866,838,71,14,117);rect(878,834,24,8,72);
 rect(1133,839,28,14,62);rect(1140,834,14,9,77);
 rect(1194,838,48,13,68);rect(1206,834,26,9,72);
 rect(1473,844,38,12,117);rect(1483,838,19,9,69);
 rect(1575,838,45,13,62);rect(1587,833,18,9,77);
 const sites=[
 ["Ore rail arrival",86,272],["Tip lock operator",222,272],["West shaft",370,534],
 ["First hearth",474,268],["Second hearth",631,268],["Third hearth",729,268],
 ["Dry transfer",808,272],["Primary ladle",889,271],["Counterweight ladle",1089,270],
 ["Mill portal",1119,270],["First crownwheel",1227,270],["Main crownwheel",1362,270],
 ["Pinch finish",1506,270],["Shear control",1591,270],["Quench inspection",1714,270],
 ["East shaft",1867,534],["Freight goal",1948,272],["Press service",213,780],
 ["Heat exchanger service",537,780],["Gear repair",854,780],
 ["Coolant manifold",1223,780],["Bladder isolation",1537,780],["Relay room",1948,780]
 ].map(([name,x,y])=>({name,x,y}));
 return {g,W,H,M,sites,seed:261120211,spawn:[86,272]};
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
 const flight=[[19,15],[23,19],[31,27]].map(p=>route(...p,null)),obstruction=[996,181,74,505],blocked=route(31,27,obstruction);
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

function build(){
 const w=world(),support=bridgeSupport(w),rects=encode(w.g,w.W,w.H),a=audit(w,rects);
 if(a.detached||a.airfaces||a.direct||a.flight.some(v=>v.passed!==w.sites.length)||a.blocked.passed!==w.sites.length)throw Error('native-independent static qualification failed');
 const setup={version:2,extent:[2048,1024],actors:[{id:1,model:'midge',hash:'c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96',spawn:w.spawn,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:2}}],next_id:2,selected:1,edits:rects,response:'LA-SELECTIVE',liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false},setupText=JSON.stringify(setup);
 const views=[["overview.png",0,0,2048,1024],["01-side-tip-charge.png",58,417,347,281],["02-thermal-hearths.png",395,412,412,286],["03-siphon-ladles.png",809,381,302,317],["04-crowned-stripmill.png",1087,415,521,282],["05-quench-dispatch.png",1594,419,454,282],["06-repair-rooms.png",59,743,1941,157]],imgs={},imeta={};let pixels=0;for(const[name,x,y,ww,hh]of views){let b=png(w.g,2048,x,y,ww,hh);pixels+=verifyPNG(b,w.g,2048,x,y,ww,hh);imgs[name]=b;imeta[name]={crop:[x,y,ww,hh],bytes:b.length,sha256:sha256(b)};}
 const receipt={schema:1,original_no_source:true,concept:'Crownstep Continuous Stripworks',seed:261120211,engine_sha:'de109d0131641d6adc8d25bb9ced7ca3d4991105',extent:[2048,1024],plane_sha256:sha256(w.g),setup_sha256:sha256(utf(setupText)),json_bytes:utf(setupText).length,rectangle_count:rects.length,source_rectangle_limit:32768,possible_installed_fallback_untested:4096,construction_work:a.work,material_histogram:a.hist,ground:{total:a.total,rooted:a.rooted,detached:a.detached,repair:support},fluid:{water:a.hist[3],lava:a.hist[8],initial_fluid_air_faces:a.airfaces,initial_water_lava_contacts:a.direct},flight:a.flight,obstruction:{box:a.obstruction,flight:a.blocked},pngs:imeta,pixel_material_parity_count:pixels,native:'NATIVE-UNTESTED'};
 return {'setup.json':utf(setupText),'receipt.json':utf(JSON.stringify(receipt,null,2)+'\n'),...imgs};
}

const fs=require('node:fs'),path=require('node:path');
const result=build(),verify=process.argv.includes('--verify');
for(const [name,contents]of Object.entries(result)){const f=path.join(__dirname,name);if(verify){const b=fs.readFileSync(f);if(b.length!==contents.length||!b.every((v,i)=>v===contents[i]))throw Error('Mismatch in '+name);}else fs.writeFileSync(f,contents);}
console.log((verify?'VERIFIED ':'GENERATED ')+Object.keys(result).length+' files');
