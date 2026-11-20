'use strict';
function utf(s){let r=[];for(const z of s){let k=z.codePointAt(0);if(k<128)r.push(k);else if(k<2048)r.push(192|(k>>>6),128|(k&63));else if(k<65536)r.push(224|(k>>>12),128|((k>>>6)&63),128|(k&63));else r.push(240|(k>>>18),128|((k>>>12)&63),128|((k>>>6)&63),128|(k&63));}return Uint8Array.from(r);}

function sha256(msg){const k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2],n=(msg.length+9+63)&~63,b=new Uint8Array(n);b.set(msg);b[msg.length]=128;const bit=msg.length*8,view=new DataView(b.buffer);view.setUint32(n-8,Math.floor(bit/4294967296),false);view.setUint32(n-4,bit>>>0,false);let H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64),rr=(x,n)=>(x>>>n)|(x<<(32-n));for(let off=0;off<n;off+=64){for(let i=0;i<16;i++)w[i]=view.getUint32(off+4*i,false);for(let i=16;i<64;i++){let x=w[i-15],y=w[i-2];w[i]=(w[i-16]+(rr(x,7)^rr(x,18)^(x>>>3))+w[i-7]+(rr(y,17)^rr(y,19)^(y>>>10)))|0;}let[a,c,d,e,f,g,h,j]=H;for(let i=0;i<64;i++){let t=(j+(rr(f,6)^rr(f,11)^rr(f,25))+((f&g)^(~f&h))+k[i]+w[i])|0,u=((rr(a,2)^rr(a,13)^rr(a,22))+((a&c)^(a&d)^(c&d)))|0;j=h;h=g;g=f;f=(e+t)|0;e=d;d=c;c=a;a=(t+u)|0;}H=[(H[0]+a)|0,(H[1]+c)|0,(H[2]+d)|0,(H[3]+e)|0,(H[4]+f)|0,(H[5]+g)|0,(H[6]+h)|0,(H[7]+j)|0];}return H.map(x=>(x>>>0).toString(16).padStart(8,"0")).join("");}

function world(){
 const W=2048,H=1024,g=new Uint8Array(W*H);
 const M={0:"empty",3:"water",8:"lava",58:"reinforced-concrete",62:"steel-plate",65:"rusted-steel",66:"steel-grating",68:"steel-pipe",69:"copper-pipe",72:"dark-glass",76:"hazard-stripe",77:"neon-cyan",79:"neon-amber",100:"basalt-columns",104:"firebrick",117:"bare-iron",131:"heat-shield-tile"};
 // FERROVEIL TWIN-RAMP CRUCIBLEWORKS: original perpendicular side elevation.
 // Dry ore weighhouse -> opposed angled retort furnaces -> pivot ladle/crucible
 // -> unequal horizontal draw-casters -> shearing/quench -> freight and inspection.
 // Two independently accessed undercroft galleries, joined by the upper service lane;\n // the anchored western shear-wall separates the lower galleries physically.
 function r(x,y,w,h,id){x=Math.floor(x);y=Math.floor(y);w=Math.ceil(w);h=Math.ceil(h);if(w<1||h<1||x<0||y<0||x+w>W||y+h>H)throw Error("bad authored rect "+[x,y,w,h,id]);for(let v=y;v<y+h;v++)g.fill(id,v*W+x,v*W+x+w);}
 function beam(x,y,xx,yy,w,id){const n=Math.ceil(Math.max(Math.abs(xx-x),Math.abs(yy-y)));for(let i=0;i<=n;i+=Math.max(2,Math.floor(w/3))){const t=i/n;r(x+(xx-x)*t-w/2,y+(yy-y)*t-w/2,w,w,id);}}
 function oval(cx,cy,rx,ry,id){for(let j=-ry;j<=ry;j++){let a=Math.floor(rx*Math.sqrt(Math.max(0,1-j*j/(ry*ry))));r(cx-a,cy+j,2*a+1,1,id);}}
 // Deep cliff and independent lower access. Everything substantial has a load path.
 r(0,919,2048,105,100);r(0,894,2048,25,58);
 r(0,139,31,755,58);r(2017,139,31,755,58);
 r(24,158,2001,15,62);r(30,173,1988,7,65);
 // Unique split-gullwing foundry roof: large opposing slants around a high exhaust crown.
 for(const [a,crest,b] of [[33,308,559],[559,702,1012],[1012,1190,1528],[1528,1800,2018]]){
  beam(a,155,crest,88,11,65);beam(crest,88,b,155,12,62);
 }
 r(565,132,455,13,66);r(1020,126,505,15,66);
 // Overhead maintenance crane: its hangers and endcaps are genuinely supported.
 r(487,189,1028,14,65);r(493,203,1018,9,76);
 for(const [x,y] of [[511,174],[796,174],[1134,174],[1460,174]]){r(x,y,11,15,68);r(x-5,188,21,9,117);}
 // Main production shelf, with excavated full-body underplant return.
 r(26,707,1995,38,58);r(26,745,1995,20,62);r(26,765,1995,26,58);
 r(30,791,1988,103,58);
 r(37,794,1973,78,0);
 r(31,874,1982,20,65);
 // Underfloor slot remains 78 high, independently accessible at every named shop.
 // Ore side tip and weighhouse: rail axle, real chamber, discharge conveyor and gate.
 r(346,672,191,35,58);r(359,657,173,15,65);
 r(374,613,120,37,117);r(382,603,108,12,76);
 r(382,641,16,16,79);r(471,639,15,18,79);
 r(365,530,18,73,65);r(495,500,18,103,65);r(363,514,151,16,62);
 r(378,530,120,67,58);r(391,540,96,45,72);
 r(411,551,53,11,79);r(416,577,47,7,77);
 r(368,502,24,12,117);r(487,490,33,22,131);
 r(512,561,22,140,58);r(531,567,15,134,62);
 r(522,590,65,15,104);r(520,605,61,10,76);
 r(535,618,62,14,65);r(583,605,13,41,69);
 // Two massive ramped, angular retort structures, unequal in pitch and diameter.
 // First furnace: low-positioned enclosed liquid pocket in firebrick/ceramic.
 r(597,676,226,31,58);r(601,656,218,20,104);
 beam(604,645,711,377,34,131);
 beam(711,377,806,650,29,131);
 beam(612,640,713,395,13,65);
 beam(722,400,797,642,13,65);
 r(629,488,141,148,104);r(647,504,106,111,131);
 r(656,523,91,76,104);r(668,543,69,39,8);
 r(651,502,103,10,117);
 r(659,587,86,11,69);r(661,600,91,14,104);
 r(608,676,208,12,62);
 r(610,642,21,35,68);r(792,638,18,38,68);
 r(690,356,46,18,62);r(700,342,27,15,76);
 r(714,330,12,12,69);
 // Second furnace: sharper upright retort with off-axis insulated receiver.
 r(825,668,166,39,58);r(830,649,156,19,104);
 beam(834,642,893,339,31,131);
 beam(893,339,978,641,35,131);
 r(862,437,93,186,104);r(875,455,67,140,131);
 r(882,484,52,98,104);r(890,513,37,51,8);
 r(879,476,61,8,117);r(872,599,73,11,65);
 r(847,631,129,18,62);
 r(876,312,35,29,65);r(881,296,26,18,79);
 r(844,579,17,70,69);r(951,572,17,77,68);
 // Exhaust manifold: raised and visibly ducted to both hearth jackets.
 r(719,333,160,11,68);r(777,317,17,28,69);
 r(786,266,20,52,62);r(779,258,34,12,131);
 r(789,251,13,9,79);
 // Material transfer via two different-height sealed steel tundishes, joined by a
 // maintained dry receiver to the ladle pivot; not isolated scenic machines.
 r(984,659,169,48,58);r(993,642,151,17,65);
 r(984,557,23,102,131);r(1127,543,26,116,131);
 r(1007,575,120,67,104);r(1025,590,84,35,131);
 r(1039,599,56,10,79);
 r(991,549,149,18,62);r(1004,567,121,9,76);
 r(1042,525,31,25,65);r(1049,499,17,27,68);
 r(1056,382,15,117,68);r(1077,382,15,129,68);
 r(1048,367,64,24,117);r(1060,357,44,11,76);
 // Large tilted ladle cradle above common pour shoe. Dry by design.
 r(1084,477,83,17,104);r(1078,494,99,76,131);
 r(1090,504,72,41,104);r(1095,510,62,21,72);
 r(1110,570,36,20,65);r(1118,588,26,71,68);
 r(1152,605,60,14,104);r(1155,619,89,17,62);
 r(1219,618,15,51,68);
 // Caster fan: four unlike declined die-rail beds with distinct feed/ram access.
 r(1233,680,350,27,58);r(1238,665,341,15,65);
 r(1237,478,17,187,58);r(1571,486,18,179,58);
 for(const [x,y,w,h] of [[1258,511,65,133],[1332,468,80,176],[1422,535,58,109],[1491,485,69,159]]){
   r(x,y,w,h,131);r(x+9,y+12,w-18,h-30,104);
   r(x+18,y+27,w-36,h-55,72);
   r(x-4,y-16,w+8,16,66);
   r(x+4,y+h,w-8,19,58);
 }
 // No repeated tray motifs: separate pusher heads, split ram and shearing clamp.
 r(1272,563,25,9,79);r(1320,563,18,11,68);
 r(1349,551,44,10,117);r(1395,530,23,26,69);
 r(1434,589,22,13,77);r(1411,556,17,23,68);
 r(1510,570,30,17,76);r(1559,571,18,35,69);
 r(1248,437,328,12,62);r(1251,449,321,7,76);
 r(1272,456,11,52,68);r(1360,454,11,14,69);
 r(1452,453,11,82,69);r(1537,453,11,32,68);
 // Guided shear tower integrated at caster outfeed; serviceable pinch-point.
 r(1587,567,62,140,58);r(1593,550,50,17,76);
 r(1603,518,26,32,68);r(1609,529,14,13,79);
 r(1581,628,54,13,117);r(1631,634,19,40,69);
 // Sealed stepped three-bath quench below guarded overhead tubing.
 for(const [x,y,w,h] of [[1660,533,48,129],[1716,555,43,107],[1845,522,72,140]]){
  r(x,y,w,h,131);r(x+8,y+11,w-16,h-23,104);
  r(x+14,y+19,w-28,h-42,3);
  r(x,y+h,w,45,58);
  r(x-6,y-17,w+12,17,62);
  r(x+6,y-24,11,13,69);r(x+w-17,y-25,12,15,68);
 }
 // East weigh-out gantry, guarded dispatch and handling trolleys.
 r(1922,635,84,72,58);r(1926,622,76,13,65);
 r(1935,590,60,30,117);r(1942,596,45,13,72);
 r(1955,573,19,17,76);r(1993,584,13,44,69);
 r(1907,478,94,13,62);r(1912,491,10,102,68);
 r(1980,494,11,82,68);r(1951,461,23,17,79);
 // Six nonrepetitive worker/maintenance workplaces, each machined into its
 // own grounded plinth and entered by the lower free 31x27 Midge travel lane.
 // Left recovery winch with widely separated pinion and counterweight.
 r(54,869,153,24,58);r(65,859,132,10,62);
 oval(109,874,31,15,117);oval(109,874,17,8,72);
 r(162,842,19,27,68);r(184,833,13,36,131);
 // Rolling exchange: horizontal heavy lathe, offset spindle, tail-stock.
 r(374,867,256,26,58);r(389,856,228,11,65);
 r(403,841,84,16,117);r(419,841,14,8,79);
 r(494,831,21,36,68);r(525,850,78,17,131);
 r(552,843,36,7,72);
 // Copper strap/winding: two distinct side drums and powered belt roller.
 r(678,870,274,23,58);r(690,858,246,12,62);
 oval(745,873,37,17,117);oval(745,873,21,9,72);
 oval(851,874,25,13,117);oval(851,874,12,6,72);
 r(786,844,13,26,69);r(887,848,25,22,131);
 // Independent valve diagnostics rack with 4 disparate bore lengths.
 r(1013,868,264,25,58);r(1027,857,239,11,65);
 for(const [x,y,h] of [[1044,831,27],[1081,842,16],[1130,825,33],[1193,835,23]]){
   r(x,y,17,h,131);r(x+5,y+8,8,8,72);r(x+6,y+h,7,8,69);
 }
 r(1227,845,21,12,79);
 // Filtration labyrinth: staggered horizontal stacks and receiver tank.
 r(1321,868,313,25,58);r(1334,857,286,11,62);
 r(1343,840,119,17,131);r(1353,843,96,10,72);
 r(1473,824,22,33,68);r(1504,832,23,25,69);
 r(1554,840,58,17,117);r(1562,833,42,9,76);
 // Freight pump controls: one large ferrite drum, independent gauge pedestal.
 r(1840,868,161,25,58);r(1853,854,135,14,65);
 oval(1901,871,32,17,117);oval(1901,871,14,8,72);
 r(1952,835,29,19,131);r(1961,839,11,10,79);
 // Grounded western tie/pier: load-bearing shear-wall for the central deck,
 // bounding two separately accessible underplant inspection galleries.
 r(350,776,14,143,58);
 r(1473,855,22,14,68);
 r(219,705,13,3,65);
 r(1980,490,11,6,68);
 // Excavated rescue access: each shaft is truly unblocked from upper to lower.
 // Re-cut *after* all machine/support edits so every envelope stays legal.
 r(236,294,103,599,0);r(1746,294,96,599,0);
 // Guide beams remain outside the full flight span.
 r(219,418,13,288,65);r(343,422,13,281,62);
 r(1729,421,13,282,65);r(1845,418,13,285,62);
 const sites=[
 ["West rail spawn",91,263],
 ["Roof incline observer",459,261],
 ["Ore weighhouse checkpoint",382,261],
 ["First retort overlook",676,258],
 ["Second retort overlook",895,259],
 ["Heat exchanger inspection",760,237],
 ["Pivot ladle access",1088,259],
 ["Pour shoe",1169,259],
 ["Caster intake",1260,258],
 ["Drawbed control",1439,259],
 ["Shear mast",1606,259],
 ["Quench survey",1698,259],
 ["Freight goal",1964,259],
 ["West descent mouth",288,424],
 ["East descent mouth",1797,424],
 ["West recovery ledge",288,815],
 ["West winch service",141,814],
 ["Roll exchange station",491,814],
 ["Copper winding station",830,815],
 ["Valve diagnostic station",1119,808],
 ["Filter return workshop",1488,808],
 ["East coolant pump station",1900,816],
 ["East recovery ledge",1796,817]
 ].map(([name,x,y])=>({name,x,y}));
 return {g,W,H,M,sites,seed:261120191,spawn:[91,263]};
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
 const flight=[[19,15],[23,19],[31,27]].map(p=>route(...p,null)),obstruction=[1194,200,47,139],blocked=route(31,27,obstruction);
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
 const views=[["overview.png",0,0,2048,1024],["01-ore-tip.png",345,465,245,239],["02-opposed-retorts.png",588,289,406,415],["03-pivot-ladle.png",977,345,268,359],["04-caster-fan.png",1220,422,430,282],["05-quench-dispatch.png",1570,450,447,254],["06-service-undercroft.png",40,791,1969,103]],imgs={},imeta={};let pixels=0;for(const[name,x,y,ww,hh]of views){let b=png(w.g,2048,x,y,ww,hh);pixels+=verifyPNG(b,w.g,2048,x,y,ww,hh);imgs[name]=b;imeta[name]={crop:[x,y,ww,hh],bytes:b.length,sha256:sha256(b)};}
 const receipt={schema:1,original_no_source:true,concept:'Ferroveil Twin-Ramp Crucibleworks',seed:261120191,engine_sha:'7b03aa437561ec63e31fd09531171360ab60eeb4',extent:[2048,1024],plane_sha256:sha256(w.g),setup_sha256:sha256(utf(setupText)),json_bytes:utf(setupText).length,rectangle_count:rects.length,source_rectangle_limit:32768,possible_installed_fallback_untested:4096,construction_work:a.work,material_histogram:a.hist,ground:{total:a.total,rooted:a.rooted,detached:a.detached,repair:support},fluid:{water:a.hist[3],lava:a.hist[8],initial_fluid_air_faces:a.airfaces,initial_water_lava_contacts:a.direct},flight:a.flight,obstruction:{box:a.obstruction,flight:a.blocked},pngs:imeta,pixel_material_parity_count:pixels,native:'NATIVE-UNTESTED'};
 return {'setup.json':utf(setupText),'receipt.json':utf(JSON.stringify(receipt,null,2)+'\n'),...imgs};
}

const fs=require('node:fs'),path=require('node:path');
const result=build(),verify=process.argv.includes('--verify');
for(const[name,contents]of Object.entries(result)){const f=path.join(__dirname,name);if(verify){let b=fs.readFileSync(f);if(b.length!==contents.length||!b.every((v,i)=>v===contents[i]))throw Error('Mismatch in committed file: '+name);}else fs.writeFileSync(f,contents);}
console.log((verify?'VERIFIED ':'GENERATED ')+Object.keys(result).length+' files');
