'use strict';
function utf(s){let r=[];for(const z of s){let k=z.codePointAt(0);if(k<128)r.push(k);else if(k<2048)r.push(192|(k>>>6),128|(k&63));else if(k<65536)r.push(224|(k>>>12),128|((k>>>6)&63),128|(k&63));else r.push(240|(k>>>18),128|((k>>>12)&63),128|((k>>>6)&63),128|(k&63));}return Uint8Array.from(r);}

function sha256(msg){const k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2],n=(msg.length+9+63)&~63,b=new Uint8Array(n);b.set(msg);b[msg.length]=128;const bit=msg.length*8,view=new DataView(b.buffer);view.setUint32(n-8,Math.floor(bit/4294967296),false);view.setUint32(n-4,bit>>>0,false);let H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64),rr=(x,n)=>(x>>>n)|(x<<(32-n));for(let off=0;off<n;off+=64){for(let i=0;i<16;i++)w[i]=view.getUint32(off+4*i,false);for(let i=16;i<64;i++){let x=w[i-15],y=w[i-2];w[i]=(w[i-16]+(rr(x,7)^rr(x,18)^(x>>>3))+w[i-7]+(rr(y,17)^rr(y,19)^(y>>>10)))|0;}let[a,c,d,e,f,g,h,j]=H;for(let i=0;i<64;i++){let t=(j+(rr(f,6)^rr(f,11)^rr(f,25))+((f&g)^(~f&h))+k[i]+w[i])|0,u=((rr(a,2)^rr(a,13)^rr(a,22))+((a&c)^(a&d)^(c&d)))|0;j=h;h=g;g=f;f=(e+t)|0;e=d;d=c;c=a;a=(t+u)|0;}H=[(H[0]+a)|0,(H[1]+c)|0,(H[2]+d)|0,(H[3]+e)|0,(H[4]+f)|0,(H[5]+g)|0,(H[6]+h)|0,(H[7]+j)|0];}return H.map(x=>(x>>>0).toString(16).padStart(8,"0")).join("");}

function world(){
 const W=2048,H=1024,g=new Uint8Array(W*H),M={0:"empty",3:"water",8:"lava",57:"industrial-brick",58:"reinforced-concrete",62:"steel-plate",65:"rusted-steel",66:"steel-grating",68:"steel-pipe",69:"copper-pipe",72:"dark-glass",76:"hazard-stripe",77:"neon-cyan",79:"neon-amber",100:"basalt-columns",104:"firebrick",117:"bare-iron",131:"heat-shield-tile"};
 // BLACKCAP VACUUM ARCWORKS: new layout, no previous-map geometry reused.
 // Physical route network: upper through-route; west shaft -> tunneled lower bypass -> east shaft;
 // central blast-pressure doorway with return, all service chambers side-enterable.
 function rect(x,y,w,h,id){x=Math.floor(x);y=Math.floor(y);w=Math.ceil(w);h=Math.ceil(h);if(x<0||y<0||x+w>W||y+h>H)throw Error("out of bounds: "+[x,y,w,h]);for(let yy=y;yy<y+h;yy++)g.fill(id,yy*W+x,yy*W+x+w);}
 function beam(x,y,xx,yy,w,id){const n=Math.max(Math.abs(xx-x),Math.abs(yy-y));for(let t=0;t<=n;t+=Math.max(2,w/3)){const p=t/n;rect(x+(xx-x)*p-w/2,y+(yy-y)*p-w/2,w,w,id);}}
 function oval(cx,cy,rx,ry,id){for(let y=-ry;y<=ry;y++){let z=Math.floor(rx*Math.sqrt(Math.max(0,1-y*y/(ry*ry))));rect(cx-z,cy+y,2*z+1,1,id);}}
 function pipe(x,y,w,h){rect(x,y,w,h,68); if(w>h&&w>14)rect(x+2,y+2,w-4,Math.max(1,h-4),69);}
 // Grounded excavation frame, foreground perpendicular side elevation ONLY.
 rect(0,924,W,100,100);rect(0,902,W,22,58);
 rect(0,661,W,21,62);rect(0,682,W,64,58);
 rect(23,111,23,813,58);rect(2002,111,23,813,58);
 // A continuous strong roof is statically connected to grounded end frames, thin, flyable below.
 rect(45,110,1957,19,62);rect(45,129,1957,7,65);
 for(const [x,w] of [[60,256],[455,310],[835,238],[1175,350],[1590,315]]){
  rect(x,139,w,7,66);
  for(const xx of [x+17,x+w-17]){beam(xx,148,xx+14,166,5,65);}
 }
 // Excavate realistic, navigable lower service return and TWO distinct vertical refuge shafts.
 rect(65,747,1926,154,0);
 rect(349,291,105,610,0);rect(1800,291,105,610,0);
 // Shaft entry guide rails only at their outer edges; 105-cell fully clear middle retained.
 rect(325,461,16,201,62);rect(457,462,15,200,62);
 rect(1778,470,14,192,62);rect(1909,468,14,194,62);
 // Restore reachable tunnel near lower floor; two opposite telegraphed access thresholds.
 for(const [x,dir] of [[297,1],[1926,-1]]){
  rect(x,686,47,18,76);rect(x,704,10,42,68);rect(x+26,704,10,42,69);
 }
 // Distinct pressure buttresses connect the middle deck through the tunnel to bedrock.
 // Wide actual 76x116 lower pressure-lock leaves centre corridor clear and statically rooted.
 rect(976,664,126,239,58);rect(995,761,88,119,0);rect(997,760,84,8,76);
 // Force another 31x27-clear side corridor through the centre wall despite y-trim.
 rect(1000,768,79,107,0);
 // Upper machine outline: nonisometric real rooted equipment.
 // DISTRICT 1: dry ore barge, drop skip, sloped charge gantry and operated loading gate.
 rect(70,585,269,23,65);rect(90,608,232,15,66);
 rect(96,626,20,35,58);rect(307,623,19,38,58);
 rect(118,556,84,27,117);rect(127,546,69,10,76);
 for(let i=0;i<7;i++){rect(137+i*18,575,9,7,79);}
 beam(178,558,321,484,17,65);beam(192,554,325,492,6,76);
 for(const t of [[234,451,16,210,58],[298,441,16,220,58],[231,444,86,13,62],
 [255,468,37,75,131],[261,480,25,32,72],[267,490,13,9,77],
 [316,468,32,14,69],[328,481,9,110,68],[320,591,23,14,104],
 [82,455,37,9,66],[80,464,9,118,68],[109,466,8,115,68],
 [81,540,39,13,62],[92,547,17,11,79]])rect(...t);
 // Opposite shaft remains uninterrupted.
 // DISTRICT 2: memorable huge VERTICAL magnetic confinement halo, twin grounded horns.
 // Outer ellipse 435 x 309, interior void; unlike a long rotary kiln this is an upright arc portal.
 oval(707,500,218,158,62);oval(707,495,184,126,0);
 // Interrupted copper field coils, vented top crowning the magnetic enclosure.
 for(const [x,y,w,h,id] of [
 [493,472,21,188,131],[897,468,22,192,131],[505,650,402,11,58],
 [535,622,35,39,104],[850,623,34,38,104],
 [566,589,18,72,62],[822,586,18,75,62],
 [614,362,14,33,69],[779,362,14,33,69],
 [604,331,42,12,65],[767,331,42,12,65],
 [632,399,20,53,69],[760,395,19,58,69],
 [556,543,39,13,76],[820,543,41,13,76],
 [605,601,201,14,65],[605,615,201,46,58],
 [656,581,91,22,117],[652,600,12,18,79],[743,600,12,18,77]])rect(x,y,w,h,id);
 // 8 distinct bolt housings, each part grounded via the outer ring.
 for(const [x,y] of [[515,434],[522,548],[553,384],[612,351],[785,351],[854,388],[881,444],[885,553]]){
  rect(x,y,12,11,117);rect(x+3,y+3,5,5,79);
 }
 // Sealed lava arc crucible, inert shell encloses every fluid face.
 rect(654,518,113,64,104);rect(664,527,94,45,8);
 rect(654,575,113,10,131);rect(660,584,101,11,62);
 // Furnace diagnostics, intact grounded legs and side-enterable hatch.
 rect(548,615,51,46,58);rect(555,622,34,12,72);rect(563,628,17,6,77);
 rect(814,615,51,46,58);rect(823,623,33,12,72);rect(832,628,16,7,79);
 // Connected ladle guidance rail is supported from a grounded tall engineering gantry.
 rect(918,388,404,17,65);rect(918,405,404,9,76);
 for(const [x,y] of [[929,413],[1167,413],[1301,413]]){
   rect(x,y,12,248,68);rect(x+12,653,19,8,62);
 }
 // Inverted triangular bracing between control gantry and deck supports.
 beam(934,430,1000,655,9,62);beam(1174,429,1129,655,9,65);beam(1310,428,1362,657,9,62);
 // DISTRICT 3: visibly carried dry ladle / tundish and opposed isolating pouring workface.
 rect(1049,408,47,12,117);rect(1061,418,10,90,68);rect(1081,416,10,91,69);
 rect(1036,500,72,17,65);rect(1045,517,54,60,104);rect(1051,529,42,32,131);
 rect(1048,575,56,13,62);rect(1057,588,11,73,58);rect(1096,589,12,72,58);
 // Ceramic guided transfer mouth to split strand caster, no open liquid.
 pipe(1106,554,80,12);rect(1176,538,19,123,131);rect(1195,558,23,15,104);
 rect(1203,570,24,91,58);
 rect(1109,634,158,27,58);rect(1124,615,31,19,72);rect(1131,624,14,5,77);
 // DISTRICT 4: split-strand horizontal caster with unequal travelling die beds.
 rect(1245,593,306,20,62);rect(1237,613,321,48,58);
 for(const [x,y,w,h,id] of [
 [1266,470,50,122,131],[1276,482,31,86,62],[1281,507,20,48,72],
 [1330,489,74,103,65],[1344,499,49,70,131],[1355,514,26,38,117],
 [1417,456,64,136,131],[1431,472,37,105,62],[1438,494,25,58,72],
 [1504,499,39,93,65],[1511,517,25,63,104],
 [1259,440,258,12,69],[1272,452,16,29,68],
 [1412,443,16,30,68],[1500,441,15,61,68],
 [1528,451,22,14,76],[1539,458,9,108,69],
 [1290,567,242,14,66]])rect(...[x,y,w,h,id]);
 for(const [x,y] of [[1267,582],[1310,583],[1362,583],[1418,583],[1466,583],[1512,583]]){
  rect(x,y,17,10,117);rect(x+4,y+3,8,5,79);
 }
 // DISTRICT 5: sealed parallel quench baths and insulated discharge conveyor.
 rect(1563,516,196,145,131);rect(1576,530,170,110,104);
 rect(1588,544,67,83,3);rect(1672,544,62,83,3);
 rect(1656,538,14,103,131);rect(1561,640,201,21,58);
 rect(1564,498,195,18,65);rect(1588,480,112,15,62);
 pipe(1586,467,114,12);rect(1681,474,16,22,77);
 rect(1738,545,20,97,69);rect(1745,552,17,16,79);
 // Two service-valve stations rooted to the quench casing.
 for(const [x,y] of [[1590,645],[1692,645]]){
  rect(x,y,43,16,117);rect(x+13,y-10,11,15,69);rect(x+12,y-13,13,8,77);
 }
 // Dispatch train drawbridge and coupler east of right shaft.
 rect(1911,600,73,18,66);rect(1913,619,70,42,58);
 rect(1920,570,34,24,117);rect(1926,579,22,9,72);
 rect(1952,580,11,30,76);rect(1963,574,18,11,69);
 // Lower left: full-life repair system unlike Cinderlock's former plinth rhythm.
 // All lower apparatus grounded against the immutable bedrock top, corridor y795-834 free.
 rect(99,855,172,46,58);rect(114,844,143,13,65);
 oval(172,874,49,24,117);oval(172,874,35,17,72);
 for(const [x,w] of [[117,8],[232,8]]){rect(x,828,w,25,68);rect(x,820,w+4,9,79);}
 // West maintenance shaft inspection cabin, attached to lower floor.
 rect(479,854,278,47,58);rect(488,841,260,13,62);
 rect(494,852,44,30,72);rect(504,861,20,7,77);
 for(const x of [557,582,607,632,657,682,707])rect(x,853,11,35,131);
 pipe(563,832,159,9);rect(722,840,16,58,68);
 // Center access pressure-lock actively designed around 79 x 107 opening.
 rect(992,882,94,18,65);rect(1009,887,43,13,76);
 // East: hydraulic filter bank -> return duct -> freight-airlocks, not cloned trays.
 rect(1174,856,232,45,58);rect(1187,844,206,12,65);
 for(const [x,id] of [[1201,131],[1246,117],[1291,131],[1336,117]]){
  rect(x,856,29,33,id);rect(x+8,865,12,15,72);
 }
 rect(1433,863,278,38,58);rect(1442,851,258,12,62);
 oval(1510,875,39,19,117);oval(1510,875,25,12,72);
 pipe(1557,830,102,12);rect(1649,838,12,40,68);
 rect(1672,864,25,23,131);rect(1680,869,10,8,77);
 // East tunnel dispatcher beside the shaft; no obstruction to full bypass.
 rect(1925,854,60,46,65);rect(1933,843,44,11,72);
 rect(1947,850,12,7,79);
 // Detailed true-world skyline silhouettes: rooted exhaust stacks from main deck only
 // (cannot float or consume flight y245).
 for(const [x,w,h] of [[821,36,170],[1438,31,161],[1643,28,130]]){
  rect(x,661-h,w,h,58);rect(x+6,655-h,w-12,h-2,65);
  rect(x-9,661-h,w+18,14,131);
  rect(x+11,670-h,Math.max(6,w-22),17,79);
 }
 // Solid rooted utility greebles, sparse not clones; intentional dense vs open.
 for(const [x,y] of [[91,633],[259,628],[580,648],[738,648],[1240,644],[1375,644],[1479,644],[1753,646]]){
  rect(x,y,18,12,117);rect(x+4,y+2,9,7,76);
 }
 // Restore exact safe entrances to prevent incidental overlap with end shafts.
 rect(349,291,105,610,0);rect(1800,291,105,610,0);
 // Below y747, shafts join the same open underfloor bypass without target substitution.
 const sites=[
 ["West ore spawn",89,249],["Charge skip watch",253,253],
 ["West emergency shaft",402,461],["Confinement yoke overlook",596,245],
 ["Arc hearth monitor",765,244],["Crucible control",935,247],
 ["Dry transfer inspection",1092,247],["First caster deck",1271,248],
 ["Second strand overlook",1457,247],["Quench valve overlook",1655,246],
 ["East emergency shaft",1851,470],["Freight dispatch goal",1953,249],
 ["West lower blower",200,807],["Rail intercooler shop",603,804],
 ["Central pressure lock",1039,816],["Coolant filters",1305,807],
 ["Recovery pump",1566,807],["East tunnel exit",1950,805]
 ].map(([name,x,y])=>({name,x,y}));
 return {g,W,H,M,sites,seed:26112092,spawn:[89,249]};
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
 const views=[["overview.png",0,0,2048,1024],["01-ore-charge.png",62,426,291,237],["02-magnetic-halo.png",470,306,455,356],["03-ladle-transfer.png",914,376,331,287],["04-split-strand-caster.png",1238,433,318,230],["05-dual-quench.png",1558,454,222,211],["06-subdeck-works.png",90,748,1645,155]],imgs={},imeta={};let pixels=0;for(const[name,x,y,ww,hh]of views){let b=png(w.g,2048,x,y,ww,hh);pixels+=verifyPNG(b,w.g,2048,x,y,ww,hh);imgs[name]=b;imeta[name]={crop:[x,y,ww,hh],bytes:b.length,sha256:sha256(b)};}
 const receipt={schema:1,original_no_source:true,concept:'Blackcap Vacuum Arcworks',seed:26112092,engine_sha:'de109d0131641d6adc8d25bb9ced7ca3d4991105',extent:[2048,1024],plane_sha256:sha256(w.g),setup_sha256:sha256(utf(setupText)),json_bytes:utf(setupText).length,rectangle_count:rects.length,source_rectangle_limit:32768,possible_installed_fallback_untested:4096,construction_work:a.work,material_histogram:a.hist,ground:{total:a.total,rooted:a.rooted,detached:a.detached,repair:support},fluid:{water:a.hist[3],lava:a.hist[8],initial_fluid_air_faces:a.airfaces,initial_water_lava_contacts:a.direct},flight:a.flight,obstruction:{box:a.obstruction,flight:a.blocked},pngs:imeta,pixel_material_parity_count:pixels,native:'NATIVE-UNTESTED'};
 return {'setup.json':utf(setupText),'receipt.json':utf(JSON.stringify(receipt,null,2)+'\n'),...imgs};
}
const result=build(),verify=process.argv.includes('--verify');
for(const[name,contents]of Object.entries(result)){const f=path.join(__dirname,name);if(verify){let b=fs.readFileSync(f);if(b.length!==contents.length||!b.every((v,i)=>v===contents[i]))throw Error('Mismatch in committed file: '+name);}else fs.writeFileSync(f,contents);}
console.log((verify?'VERIFIED ':'GENERATED ')+Object.keys(result).length+' files');
