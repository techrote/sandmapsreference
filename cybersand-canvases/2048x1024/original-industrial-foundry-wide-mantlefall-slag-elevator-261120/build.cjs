'use strict';
function utf(s){let r=[];for(const z of s){let k=z.codePointAt(0);if(k<128)r.push(k);else if(k<2048)r.push(192|(k>>>6),128|(k&63));else if(k<65536)r.push(224|(k>>>12),128|((k>>>6)&63),128|(k&63));else r.push(240|(k>>>18),128|((k>>>12)&63),128|((k>>>6)&63),128|(k&63));}return Uint8Array.from(r);}

function sha256(msg){const k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2],n=(msg.length+9+63)&~63,b=new Uint8Array(n);b.set(msg);b[msg.length]=128;const bit=msg.length*8,view=new DataView(b.buffer);view.setUint32(n-8,Math.floor(bit/4294967296),false);view.setUint32(n-4,bit>>>0,false);let H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64),rr=(x,n)=>(x>>>n)|(x<<(32-n));for(let off=0;off<n;off+=64){for(let i=0;i<16;i++)w[i]=view.getUint32(off+4*i,false);for(let i=16;i<64;i++){let x=w[i-15],y=w[i-2];w[i]=(w[i-16]+(rr(x,7)^rr(x,18)^(x>>>3))+w[i-7]+(rr(y,17)^rr(y,19)^(y>>>10)))|0;}let[a,c,d,e,f,g,h,j]=H;for(let i=0;i<64;i++){let t=(j+(rr(f,6)^rr(f,11)^rr(f,25))+((f&g)^(~f&h))+k[i]+w[i])|0,u=((rr(a,2)^rr(a,13)^rr(a,22))+((a&c)^(a&d)^(c&d)))|0;j=h;h=g;g=f;f=(e+t)|0;e=d;d=c;c=a;a=(t+u)|0;}H=[(H[0]+a)|0,(H[1]+c)|0,(H[2]+d)|0,(H[3]+e)|0,(H[4]+f)|0,(H[5]+g)|0,(H[6]+h)|0,(H[7]+j)|0];}return H.map(x=>(x>>>0).toString(16).padStart(8,"0")).join("");}

function world(){
 const W=2048,H=1024,g=new Uint8Array(W*H),M={0:"empty",3:"water",8:"lava",57:"industrial-brick",58:"reinforced-concrete",62:"steel-plate",65:"rusted-steel",66:"steel-grating",68:"steel-pipe",69:"copper-pipe",72:"dark-glass",76:"hazard-stripe",77:"neon-cyan",79:"neon-amber",100:"basalt-columns",104:"firebrick",117:"bare-iron",131:"heat-shield-tile"};
 function rect(x,y,w,h,id){x=Math.floor(x);y=Math.floor(y);w=Math.ceil(w);h=Math.ceil(h);if(x<0||y<0||x+w>W||y+h>H||w<=0||h<=0)throw Error("box "+[x,y,w,h,id]);for(let yy=y;yy<y+h;yy++)g.fill(id,yy*W+x,yy*W+x+w);}
 function strut(x,y,X,Y,t,id){let len=Math.max(Math.abs(X-x),Math.abs(Y-y)),step=Math.max(1,Math.floor(t/4));for(let k=0;k<=len;k+=step){let f=k/len;rect(x+(X-x)*f-t/2,y+(Y-y)*f-t/2,t,t,id);}}
 function oval(cx,cy,rx,ry,id){for(let j=-ry;j<=ry;j++){let a=Math.floor(rx*Math.sqrt(Math.max(0,1-j*j/(ry*ry))));rect(cx-a,cy+j,2*a+1,1,id);}}
 // MANTLEFALL SLAG ELEVATOR: a gigantic offset vertical coke shaft and suspended counterweight.
 // Terrain is a deep human-maintained slag railway cut, not a flat exhibition hall.
 rect(0,935,2048,89,100);rect(0,907,2048,28,58);
 rect(16,167,32,740,100);rect(2000,180,31,727,100);
 rect(48,681,1952,19,62);rect(48,700,1952,25,58);
 // Lower excavated service railway, with dry continuous flight passage at y785-851.
 rect(62,759,1922,148,0);
 rect(66,888,1912,19,65);rect(66,897,1912,10,58);
 // Two widely separated large 90+ cell recovery risers.
 rect(316,318,94,570,0);rect(1750,315,96,575,0);
 // Lower inspection trench has separate physical grates, not full-height partitions.
 rect(90,858,203,38,58);rect(105,844,170,15,65);
 rect(433,865,246,31,58);rect(446,853,222,12,62);
 rect(758,859,238,37,58);rect(770,848,214,11,65);
 rect(1155,862,243,34,58);rect(1166,850,221,12,65);
 rect(1512,858,195,38,58);rect(1523,845,174,14,62);
 rect(1861,855,111,42,58);rect(1873,842,90,13,65);
 // West district: ore barge and lifting skips with real worker access.
 rect(80,632,234,19,65);rect(94,651,202,30,58);
 rect(98,582,113,43,117);rect(107,569,98,16,76);
 for(let i=0;i<6;i++)rect(113+16*i,606,9,8,79);
 rect(107,541,13,41,68);rect(198,548,12,41,68);
 rect(117,530,83,12,62);rect(138,520,38,10,72);
 strut(204,562,456,429,15,65);strut(213,578,471,440,7,76);
 rect(424,401,56,14,62);rect(428,415,12,266,58);
 rect(473,416,16,265,58);rect(438,446,35,41,131);
 rect(445,456,21,21,72);rect(451,462,12,8,77);
 rect(279,564,37,52,58);rect(287,547,22,16,69);
 rect(287,610,20,21,76);
 // Three different access / operator cabins, all mechanically founded.
 rect(60,452,91,14,65);rect(64,465,14,216,58);
 rect(130,466,12,215,58);rect(74,478,56,46,72);
 rect(87,489,30,10,77);
 rect(244,391,70,13,65);rect(251,403,15,278,58);
 rect(296,402,13,279,58);rect(263,425,34,51,72);
 rect(274,443,14,13,79);
 // Furnace: the monumental single tapered industrial vertical coke-to-melt stack.
 // Inward taper, three distinct circumferential armature hoops, a separate hearth liner.
 for(let y=346;y<648;y++){
   const f=(y-346)/302,left=Math.floor(573-55*f),right=Math.ceil(713+59*f);
   rect(left,y,13,1,62);rect(left+13,y,13,1,104);
   rect(left+26,y,right-left-52,1,104);
   rect(right-26,y,13,1,104);rect(right-13,y,13,1,62);
 }
 rect(569,333,147,15,65);rect(582,319,124,14,76);
 rect(604,307,76,12,58);
 for(const [y,w] of [[391,173],[484,206],[588,241]]){
   const x=644-Math.floor(w/2);rect(x,y,w,12,131);rect(x+8,y+12,12,15,65);rect(x+w-20,y+12,12,15,65);
 }
 // Closed, explicitly sealed molten crucible, no mobile foundational material.
 rect(609,512,88,91,131);rect(620,522,67,66,8);
 rect(606,604,94,16,104);rect(599,620,107,28,58);
 rect(569,647,153,34,58);
 // Furnace cooling towers, distinct left/right pumps and load-bearing crossbracing.
 rect(509,481,31,200,58);rect(515,495,19,165,68);
 rect(749,506,29,175,58);rect(757,526,14,124,69);
 strut(522,529,591,648,11,65);strut(765,550,710,645,11,62);
 rect(500,449,44,31,131);rect(511,455,22,15,72);
 rect(738,471,56,33,131);rect(747,481,36,10,72);
 // Furnace crown charge tram and counterslung two-track elevator, not a halo or rotary kiln.
 rect(420,242,470,13,62);rect(424,255,466,9,76);
 rect(447,266,20,171,58);rect(861,265,17,415,58);
 strut(460,270,556,339,13,65);strut(855,276,737,417,11,65);
 rect(775,270,68,26,117);rect(782,281,50,12,72);
 rect(798,296,16,112,69);rect(821,294,12,116,68);
 rect(785,398,57,69,131);rect(791,407,44,48,72);
 rect(800,421,23,19,79);
 // Separate high capture crane and suspended dry transfer: seven mechanical subassemblies.
 rect(895,412,397,18,65);rect(896,429,396,11,76);
 rect(907,441,18,240,58);rect(1256,441,20,240,58);
 strut(911,445,964,659,10,62);strut(1265,448,1204,655,10,65);
 rect(1025,435,53,16,117);rect(1032,452,9,84,68);rect(1060,450,9,87,69);
 rect(1019,532,71,20,65);rect(1029,552,51,63,104);
 rect(1035,562,39,37,131);rect(1020,615,68,13,62);
 rect(1030,627,11,54,58);rect(1079,628,11,53,58);
 // Distinct receiving gate with visual transfer to modular mould strip.
 rect(1109,578,92,17,68);rect(1191,563,24,118,131);
 rect(1125,610,84,40,58);rect(1140,620,55,14,72);
 rect(1147,625,32,6,77);
 // Four stepped non-identical casting stages, each enclosed in own supported body.
 rect(1296,648,251,33,58);rect(1307,629,226,19,62);
 for(const [x,w,top,h] of [[1313,55,506,123],[1383,42,480,149],[1440,58,522,107],[1508,35,491,138]]){
   rect(x,top,w,h,131);rect(x+8,top+13,w-16,h-27,62);
   rect(x+15,top+26,w-30,Math.max(12,h-60),72);
   rect(x+4,top+3,w-8,7,76);
 }
 rect(1282,463,265,13,69);rect(1301,476,13,61,68);
 rect(1403,476,15,29,68);rect(1516,477,12,31,68);
 for(const [x,w] of [[1322,16],[1376,12],[1430,17],[1486,15],[1532,13]]){
   rect(x,625,w,14,117);rect(x+3,629,w-6,7,79);
 }
 // Shear and upper gantry, visibly offset rather than another repeated tray.
 rect(1548,511,40,170,58);rect(1555,522,26,26,117);
 rect(1561,532,14,8,79);rect(1533,555,28,14,65);
 strut(1550,566,1584,599,9,76);
 // Three-basin QUIET quench: sealed water cells, no water-to-air faces.
 rect(1617,526,170,155,58);rect(1630,539,145,122,104);
 for(const [x,w] of [[1641,34],[1687,31],[1730,34]]){
   rect(x,548,w,98,3);rect(x-4,543,4,111,131);
 }
 rect(1630,532,144,12,131);rect(1625,646,156,16,104);
 rect(1605,501,196,15,65);rect(1628,490,137,11,76);
 rect(1610,518,16,162,69);rect(1773,528,14,153,68);
 rect(1789,600,49,18,62);rect(1804,618,34,60,58);
 // Dispatch chamber: physically grounded vehicle bay and two gravity-pulley gates.
 rect(1850,640,134,19,66);rect(1860,659,124,22,58);
 rect(1862,601,94,29,117);rect(1870,588,78,13,76);
 for(const x of[1873,1912,1949]){rect(x,624,15,18,68);rect(x+3,629,9,6,79);}
 rect(1941,457,35,142,58);rect(1948,464,21,103,72);
 rect(1955,493,7,20,77);
 // Functionally distinct lower repair machinery, all grounded to subgrade floor.
 // Ventilation cyclone x100, tile cooling x450, hydraulic ballast x780,
 // dual gear train x1155, return scrubber x1520 and east signalling x1860.
 oval(181,872,61,22,117);oval(181,872,44,13,72);
 rect(108,831,13,26,68);rect(245,832,14,27,68);rect(121,825,123,10,69);
 rect(465,825,182,18,65);for(const x of[474,493,512,531,550,569,588,607,626])rect(x,843,11,31,131);
 rect(777,832,183,16,68);rect(803,847,35,35,117);rect(853,852,34,30,117);rect(909,845,31,37,117);
 rect(814,857,14,9,77);rect(864,862,13,7,79);
 rect(1175,842,191,15,62);for(const [x,r] of [[1213,26],[1290,31]]){
   oval(x,874,r,18,117);oval(x,874,r-12,9,72);
 }
 rect(1542,831,148,18,69);rect(1557,852,26,33,131);rect(1610,853,29,32,117);rect(1658,852,21,33,131);
 rect(1880,831,78,30,117);rect(1888,840,62,15,72);rect(1907,847,17,7,77);
 // Subgrade rescue run; return path is an authored 79px-deep clear passage.
 rect(65,768,1918,76,0);
 // Return the two air risers to full hull width after decorative operations.
 rect(316,315,94,573,0);rect(1750,315,96,573,0);
 // Compensate shaft cuts with grounded gate guide strips outside clear route.
 rect(307,515,8,165,76);rect(411,522,7,157,76);
 rect(1742,520,8,160,76);rect(1847,521,7,159,76);
 // Accepted grounded roof truss crosses the west riser ABOVE its shaft mouth.
 rect(48,190,891,16,65);rect(857,206,21,63,58);
 // Full-height engineering pier creates an intentional forced underdeck diversion.
 rect(857,676,21,7,58);
 // Root short flying auxiliaries with bounded steel and copper joints.
 rect(758,461,19,68,68);rect(741,470,13,34,62);
 rect(519,478,15,9,62);rect(411,674,7,13,65);
 rect(1607,513,16,169,68);
 rect(493,279,80,99,0); // Flight-accessible charge hoist throat
 // Full-body 50x73 operator portal through the western ore-hoist pylon.
 rect(440,283,50,73,0);
 const sites=[
 ["West ore landing",97,283],["Dry charge exchange",263,286],["West rescue riser",365,529],
 ["Furnace crown access",518,280],["Counterweight inspection",803,225],
 ["Hot throat overlook",667,284],["West transfer catwalk",936,280],
 ["Ladle service bridge",1101,280],["Mould crane access",1288,280],
 ["Caster stage three",1469,281],["Quench inspection",1631,281],
 ["East recovery riser",1796,520],["Freight gate destination",1948,280],
 ["Vent cyclone",183,795],["Cooler repair",557,796],["Ballast shop",865,797],
 ["Gear-repair gallery",1256,798],["Return scrubber",1614,799],["East dispatch relay",1907,797]
 ].map(([name,x,y])=>({name,x,y}));
 return {g,W,H,M,sites,seed:261120113,spawn:[97,283]};
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
 const flight=[[19,15],[23,19],[31,27]].map(p=>route(...p,null)),obstruction=[1004,200,74,466],blocked=route(31,27,obstruction);
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
 const views=[["overview.png",0,0,2048,1024],["01-ore-skip.png",64,387,430,297],["02-tapered-furnace.png",488,300,324,383],["03-elevator-and-ladle.png",774,236,448,448],["04-stepped-caster.png",1265,446,337,237],["05-quench-and-dispatch.png",1590,452,400,233],["06-subgrade-maintenance.png",72,751,1890,154]],imgs={},imeta={};let pixels=0;for(const[name,x,y,ww,hh]of views){let b=png(w.g,2048,x,y,ww,hh);pixels+=verifyPNG(b,w.g,2048,x,y,ww,hh);imgs[name]=b;imeta[name]={crop:[x,y,ww,hh],bytes:b.length,sha256:sha256(b)};}
 const receipt={schema:1,original_no_source:true,concept:'Mantlefall Slag Elevator',seed:261120113,engine_sha:'de109d0131641d6adc8d25bb9ced7ca3d4991105',extent:[2048,1024],plane_sha256:sha256(w.g),setup_sha256:sha256(utf(setupText)),json_bytes:utf(setupText).length,rectangle_count:rects.length,source_rectangle_limit:32768,possible_installed_fallback_untested:4096,construction_work:a.work,material_histogram:a.hist,ground:{total:a.total,rooted:a.rooted,detached:a.detached,repair:support},fluid:{water:a.hist[3],lava:a.hist[8],initial_fluid_air_faces:a.airfaces,initial_water_lava_contacts:a.direct},flight:a.flight,obstruction:{box:a.obstruction,flight:a.blocked},pngs:imeta,pixel_material_parity_count:pixels,native:'NATIVE-UNTESTED'};
 return {'setup.json':utf(setupText),'receipt.json':utf(JSON.stringify(receipt,null,2)+'\n'),...imgs};
}
const result=build(),verify=process.argv.includes('--verify');
for(const[name,contents]of Object.entries(result)){const f=path.join(__dirname,name);if(verify){let b=fs.readFileSync(f);if(b.length!==contents.length||!b.every((v,i)=>v===contents[i]))throw Error('Mismatch in committed file: '+name);}else fs.writeFileSync(f,contents);}
console.log((verify?'VERIFIED ':'GENERATED ')+Object.keys(result).length+' files');
