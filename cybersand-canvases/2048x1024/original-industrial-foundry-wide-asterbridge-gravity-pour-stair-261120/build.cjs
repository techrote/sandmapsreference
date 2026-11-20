'use strict';
function utf(s){let r=[];for(const z of s){let k=z.codePointAt(0);if(k<128)r.push(k);else if(k<2048)r.push(192|(k>>>6),128|(k&63));else if(k<65536)r.push(224|(k>>>12),128|((k>>>6)&63),128|(k&63));else r.push(240|(k>>>18),128|((k>>>12)&63),128|((k>>>6)&63),128|(k&63));}return Uint8Array.from(r);}

function sha256(msg){const k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2],n=(msg.length+9+63)&~63,b=new Uint8Array(n);b.set(msg);b[msg.length]=128;const bit=msg.length*8,view=new DataView(b.buffer);view.setUint32(n-8,Math.floor(bit/4294967296),false);view.setUint32(n-4,bit>>>0,false);let H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64),rr=(x,n)=>(x>>>n)|(x<<(32-n));for(let off=0;off<n;off+=64){for(let i=0;i<16;i++)w[i]=view.getUint32(off+4*i,false);for(let i=16;i<64;i++){let x=w[i-15],y=w[i-2];w[i]=(w[i-16]+(rr(x,7)^rr(x,18)^(x>>>3))+w[i-7]+(rr(y,17)^rr(y,19)^(y>>>10)))|0;}let[a,c,d,e,f,g,h,j]=H;for(let i=0;i<64;i++){let t=(j+(rr(f,6)^rr(f,11)^rr(f,25))+((f&g)^(~f&h))+k[i]+w[i])|0,u=((rr(a,2)^rr(a,13)^rr(a,22))+((a&c)^(a&d)^(c&d)))|0;j=h;h=g;g=f;f=(e+t)|0;e=d;d=c;c=a;a=(t+u)|0;}H=[(H[0]+a)|0,(H[1]+c)|0,(H[2]+d)|0,(H[3]+e)|0,(H[4]+f)|0,(H[5]+g)|0,(H[6]+h)|0,(H[7]+j)|0];}return H.map(x=>(x>>>0).toString(16).padStart(8,"0")).join("");}

function world(){
 const W=2048,H=1024,g=new Uint8Array(W*H),SEED=0x261120b7,M={0:"empty",3:"water",8:"lava",58:"reinforced-concrete",62:"steel-plate",65:"rusted-steel",66:"steel-grating",68:"steel-pipe",69:"copper-pipe",72:"dark-glass",76:"hazard-stripe",77:"neon-cyan",79:"neon-amber",100:"basalt-columns",104:"firebrick",117:"bare-iron",131:"heat-shield-tile"};
 function r(x,y,w,h,m){x=Math.floor(x);y=Math.floor(y);w=Math.ceil(w);h=Math.ceil(h);if(x<0||y<0||w<1||h<1||x+w>W||y+h>H||!(m in M))throw Error("invalid rectangle "+[x,y,w,h,m]);for(let yy=y;yy<y+h;yy++)g.fill(m,yy*W+x,yy*W+x+w);}
 function beam(x,y,xx,yy,w,m){const n=Math.ceil(Math.max(Math.abs(xx-x),Math.abs(yy-y))),step=Math.max(1,Math.floor(w/2));for(let k=0;k<=n;k+=step){let t=k/n;r(x+(xx-x)*t-w/2,y+(yy-y)*t-w/2,w,w,m);}}
 function ring(cx,cy,rx,ry,th,m){for(let yy=-ry;yy<=ry;yy++){let x=Math.floor(rx*Math.sqrt(Math.max(0,1-yy*yy/ry/ry)));let inner=yy*yy<(ry-th)*(ry-th)?Math.floor((rx-th)*Math.sqrt(Math.max(0,1-yy*yy/(ry-th)/(ry-th)))):-1;if(inner<0)r(cx-x,cy+yy,2*x+1,1,m);else{let n=Math.max(1,x-inner);r(cx-x,cy+yy,n,1,m);r(cx+inner+1,cy+yy,n,1,m);}}}
 // ASTERBRIDGE GRAVITY POUR STAIR — ORIGINAL material-cell geometry.
 // True side elevation, no top surfaces. Process: charge -> two unequal furnaces
 // -> counterweighted ladle traverse -> three descending mould wells
 // -> physically sealed quench -> dispatch. Entrable side wells and six
 // DIFFERENT underplant workshop fronts supply recoverable alternative routes.
 for(const a of [[0,900,2048,124,100],[0,885,2048,15,58],[8,122,25,763,58],[2013,122,25,763,58],[33,124,1980,13,65],[34,137,1978,8,62],[34,145,1978,5,76],[33,693,1980,19,62],[33,712,1980,21,58],[33,733,1980,17,65],[33,750,1980,14,58],[33,878,1980,7,62]])r(...a);
 for(const [a,b,c] of [[36,370,330],[329,192,575],[574,225,820],[815,181,1080],[1080,231,1330],[1330,186,1618],[1614,237,1837],[1836,149,2011]]){beam(a,125,c,b,10,62);beam(c,b,c+4,143,7,65);}
 r(145,286,105,559,0);r(1821,286,114,559,0);r(124,778,137,62,0);r(1810,776,133,64,0);
 // Receiving: rail side tip, hinged paddle and distinct upper controls.
 for(const a of [[42,650,322,43,58],[54,639,284,11,65],[59,595,174,44,117],[67,601,160,30,72],[80,585,157,10,76],[76,562,160,18,65],[266,511,91,56,131],[278,522,67,32,104],[288,523,45,14,72],[316,493,12,18,68],[355,631,30,60,58],[370,594,13,36,69],[385,607,57,18,104],[402,624,46,16,131],[287,456,79,17,62],[297,469,13,40,68],[352,469,13,40,68],[317,445,29,11,79],[317,472,33,18,72]])r(...a);
 beam(216,573,374,652,14,68);beam(217,587,375,666,5,76);
 // High molten furnace; unequal shorter induction partner, both static sealed
 // refractory cells with isolated reactive fill fully buried inside inert stone.
 for(const a of [[437,662,189,31,58],[450,406,158,256,131],[463,417,132,233,104],[485,498,88,108,8],[455,432,148,15,117],[468,455,123,12,62],[487,465,35,9,79],[563,468,20,8,79],[466,385,124,21,65],[482,361,93,24,131],[493,336,71,25,65],[508,319,43,18,68],[521,296,17,24,69],[602,518,22,102,68],[595,530,40,12,76],[603,603,47,16,117],[617,618,32,25,104],[625,632,34,14,131],[662,662,183,31,58],[675,457,151,205,131],[687,471,127,175,104],[716,518,70,92,8],[692,489,112,16,117],[704,503,30,8,79],[705,430,89,27,65],[718,399,65,30,131],[736,379,29,20,68],[746,359,10,20,69],[678,579,13,80,68],[666,584,24,14,76],[806,551,45,15,69],[838,564,22,43,117],[848,601,21,51,104],[533,629,248,12,65],[539,640,240,12,66],[590,396,102,10,69],[595,399,12,42,68],[676,396,15,36,117],[617,387,27,9,79]])r(...a);
 // High open-strut crane and serviced two-stage bucket. No prior-map circle/halo.
 for(const a of [[888,649,308,44,58],[895,631,291,18,62],[893,590,25,41,68],[1160,577,25,54,68],[951,387,170,16,62],[958,403,158,10,76],[981,412,20,40,68],[1091,412,20,48,68],[959,483,107,115,131],[974,497,79,87,104],[973,472,82,11,117],[968,597,110,12,65],[1007,609,22,22,68],[1020,629,56,12,72],[1084,511,64,89,131],[1092,520,48,72,104],[1075,505,79,10,65],[1090,600,51,13,117],[1140,569,25,12,69],[1151,581,33,17,117],[1175,621,54,16,69],[1206,637,67,12,117],[1217,649,34,20,131]])r(...a);
 beam(896,594,961,397,15,65);beam(1172,583,1112,399,15,65);
 // THREE descending vertical gravity moulds: deliberate process stair not rollers.
 for(const a of [[1221,463,113,230,58],[1234,478,87,198,131],[1255,496,48,161,104],[1258,503,42,11,72],[1241,459,71,18,65],[1266,441,18,19,68],[1250,670,53,16,117],[1270,681,11,11,76],[1360,506,147,187,58],[1375,520,118,155,131],[1400,536,66,116,104],[1410,536,44,11,72],[1374,491,119,15,65],[1388,471,18,20,69],[1468,486,20,8,79],[1440,659,36,15,62],[1535,550,103,143,58],[1546,564,82,115,131],[1565,576,44,78,104],[1550,541,69,10,117],[1548,529,16,11,68],[1589,533,12,9,79],[1618,603,40,19,62],[1644,578,25,27,68],[1632,615,34,16,76],[1657,633,17,60,117],[1218,391,374,18,65],[1226,409,357,7,76],[1254,416,15,42,69],[1417,417,17,72,68],[1564,417,15,114,68]])r(...a);
 for(const x of [1236,1398,1551]){r(x,381,36,10,62);r(x+9,372,17,9,79);}
 // Two individually contained water cassettes & covered export rail wagon.
 for(const a of [[1680,539,121,154,131],[1694,553,93,126,104],[1710,568,61,93,3],[1706,564,70,5,104],[1810,573,88,120,131],[1822,585,65,95,104],[1835,599,40,64,3],[1832,594,48,5,104],[1697,518,104,21,65],[1710,507,22,11,68],[1772,521,24,12,79],[1805,548,94,24,62],[1637,489,46,62,58],[1643,494,34,36,72],[1648,510,24,8,77],[1652,551,18,28,69],[1770,473,16,45,68],[1794,482,33,14,62],[1906,634,101,59,58],[1912,619,93,15,62],[1939,520,18,99,68],[1923,519,53,13,65],[1957,542,35,58,117],[1963,549,23,40,72],[1967,554,16,8,79],[1943,601,60,18,76]])r(...a);
 // Subgrade, six machine signatures (each physically founded), flying access
 // above the machinery at 790-810, not a false-scene decorative strip.
 for(const a of [[64,863,91,15,58],[71,843,80,20,131],[81,849,31,13,72],[115,818,17,25,68],[80,810,55,8,65],[139,839,12,24,117],[288,862,221,16,58],[297,845,203,17,62],[359,821,11,31,69],[415,821,17,25,131],[422,828,11,11,79],[460,809,16,35,68],[474,827,21,18,72],[559,860,233,18,58],[571,848,209,12,65],[588,828,41,20,104],[638,819,70,29,131],[647,824,50,17,72],[710,828,58,20,117],[733,812,18,16,69],[602,818,10,10,76],[830,861,282,17,58],[838,850,265,11,62],[897,832,51,9,65],[991,831,57,12,69],[1065,824,28,25,131],[1072,828,14,10,77],[1170,860,264,18,58],[1178,848,249,12,65],[1260,832,29,18,68],[1312,814,66,35,131],[1323,822,44,17,72],[1329,824,8,14,66],[1343,824,8,14,66],[1380,825,33,24,69],[1390,820,13,9,77],[1481,859,309,19,58],[1487,846,298,13,62],[1508,823,43,22,131],[1516,829,26,9,72],[1553,832,151,13,117],[1581,835,56,8,65],[1721,821,13,25,72],[1748,839,20,9,79]])r(...a);
 for(const [x,y,rx,ry,t,m] of [[365,837,48,25,9,117],[881,831,34,19,7,68],[977,835,23,15,6,117],[1225,835,32,24,8,117],[1727,831,36,23,8,69]])ring(x,y,rx,ry,t,m);
 // Fixed literal destinations, all corridors must be 1:1 Midge-clear.
 const sites=[["Ore arrival / Midge spawn",91,275],["Rail-tip controller",302,276],["West rescue-well top",198,416],["Charge throat",396,274],["Tall induction furnace",532,275],["Short electrofurnace",744,276],["Hot bus inspection",831,277],["Travelling crane portal",911,275],["Ladle inspection gantry",1084,279],["Mould comb foreman",1222,273],["High gravity mould",1284,275],["Stepped middle mould",1461,277],["Shear and mould exit",1604,276],["Washdown supervisor",1727,275],["East rescue-well top",1878,420],["Freight departure / dispatch goal",1981,274],["West lower landing",191,789],["Blower overhaul",374,795],["Refractory workbench",669,792],["Gear spindle maintenance",956,794],["Chilled pump service",1284,793],["Rail-brake/winch test",1640,793],["East lower landing",1875,793]].map(([name,x,y])=>({name,x,y}));
 return {g,W,H,M,seed:SEED,sites,spawn:[91,275]};
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
 const reached=new Uint8Array(N),qq=new Int32Array(N),dist=new Int32Array(N);dist.fill(-1);let first=0,last=0,sp=spawn[1]*W+spawn[0];if(free[sp]){reached[sp]=1;dist[sp]=0;qq[last++]=sp;}while(first<last){let i=qq[first++],x=i%W;for(const j of[x?i-1:-1,x<W-1?i+1:-1,i-W,i+W])if(j>=0&&j<N&&free[j]&&!reached[j]){reached[j]=1;dist[j]=dist[i]+1;qq[last++]=j;}}
 const sr=sites.map(v=>({...v,clear:!!free[v.y*W+v.x],reached:!!reached[v.y*W+v.x],shortest_4_neighbour_steps:dist[v.y*W+v.x]}));return {hull:[ww,hh],valid_centres:all,connected_centres:last,passed:sr.filter(v=>v.reached).length,sites:sr};}
 const flight=[[19,15],[23,19],[31,27]].map(p=>route(...p,null)),obstruction=[975,215,87,447],blocked=route(31,27,obstruction);
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
 const baseLeg=a.flight[2].sites.find(v=>v.name==='Freight departure / dispatch goal').shortest_4_neighbour_steps,blockedLeg=a.blocked.sites.find(v=>v.name==='Freight departure / dispatch goal').shortest_4_neighbour_steps;
 if(blockedLeg<=baseLeg)throw Error('physical obstruction must force a positive shortest-path detour');
 if(a.detached||a.airfaces||a.direct||a.flight.some(v=>v.passed!==w.sites.length)||a.blocked.passed!==w.sites.length)throw Error("source-static qualification failed: "+JSON.stringify({support,a:{detached:a.detached,airfaces:a.airfaces,direct:a.direct,flight:a.flight.map(x=>x.passed),blocked:a.blocked.passed}}));
 const setup={version:2,extent:[2048,1024],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:w.spawn,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:2}}],next_id:2,selected:1,edits:rects,response:"LA-SELECTIVE",liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false},setupText=JSON.stringify(setup);
 const views=[["overview.png",0,0,2048,1024],["01-ore-side-tip.png",44,430,407,276],["02-dual-thermal.png",435,288,415,413],["03-bucket-transfer.png",873,375,340,329],["04-cascade-moulds.png",1214,371,441,329],["05-quench-rail.png",1625,460,383,245],["06-underplant.png",55,778,1745,107]],imgs={},imeta={};let pixels=0;
 for(const[name,x,y,ww,hh]of views){let b=png(w.g,2048,x,y,ww,hh);pixels+=verifyPNG(b,w.g,2048,x,y,ww,hh);imgs[name]=b;imeta[name]={crop:[x,y,ww,hh],bytes:b.length,sha256:sha256(b)};}
 const receipt={schema:1,original_no_source:true,concept:"Asterbridge Gravity Pour Stair",seed:w.seed,engine_sha:"7b03aa437561ec63e31fd09531171360ab60eeb4",extent:[2048,1024],plane_sha256:sha256(w.g),setup_sha256:sha256(utf(setupText)),json_bytes:utf(setupText).length,rectangle_count:rects.length,source_rectangle_limit:32768,possible_installed_fallback_untested:4096,construction_work:a.work,material_histogram:a.hist,ground:{total:a.total,rooted:a.rooted,detached:a.detached,repair:support},fluid:{water:a.hist[3]||0,lava:a.hist[8]||0,initial_fluid_air_faces:a.airfaces,initial_water_lava_contacts:a.direct},flight:a.flight,obstruction:{box:a.obstruction,flight:a.blocked,measured_target:'Freight departure / dispatch goal',shortest_before:baseLeg,shortest_after:blockedLeg,positive_detour:blockedLeg-baseLeg},pngs:imeta,pixel_material_parity_count:pixels,native:"NATIVE-UNTESTED"};
 return {files:{"setup.json":utf(setupText),"receipt.json":utf(JSON.stringify(receipt,null,2)+"\n"),...imgs},receipt};
}
const fs=require("node:fs"),path=require("node:path");
const result=build().files,verify=process.argv.includes("--verify");
for(const[name,contents]of Object.entries(result)){const file=path.join(__dirname,name);if(verify){const v=fs.readFileSync(file);if(v.length!==contents.length||!v.every((x,i)=>x===contents[i]))throw Error("MISMATCH "+name);}else fs.writeFileSync(file,contents);}
console.log((verify?"VERIFIED ":"GENERATED ")+Object.keys(result).length+" authentic files");
