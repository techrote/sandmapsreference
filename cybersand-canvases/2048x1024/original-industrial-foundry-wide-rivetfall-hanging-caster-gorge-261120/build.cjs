'use strict';
function utf(s){let r=[];for(const z of s){let k=z.codePointAt(0);if(k<128)r.push(k);else if(k<2048)r.push(192|(k>>>6),128|(k&63));else if(k<65536)r.push(224|(k>>>12),128|((k>>>6)&63),128|(k&63));else r.push(240|(k>>>18),128|((k>>>12)&63),128|((k>>>6)&63),128|(k&63));}return Uint8Array.from(r);}

function sha256(msg){const k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2],n=(msg.length+9+63)&~63,b=new Uint8Array(n);b.set(msg);b[msg.length]=128;const bit=msg.length*8,view=new DataView(b.buffer);view.setUint32(n-8,Math.floor(bit/4294967296),false);view.setUint32(n-4,bit>>>0,false);let H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64),rr=(x,n)=>(x>>>n)|(x<<(32-n));for(let off=0;off<n;off+=64){for(let i=0;i<16;i++)w[i]=view.getUint32(off+4*i,false);for(let i=16;i<64;i++){let x=w[i-15],y=w[i-2];w[i]=(w[i-16]+(rr(x,7)^rr(x,18)^(x>>>3))+w[i-7]+(rr(y,17)^rr(y,19)^(y>>>10)))|0;}let[a,c,d,e,f,g,h,j]=H;for(let i=0;i<64;i++){let t=(j+(rr(f,6)^rr(f,11)^rr(f,25))+((f&g)^(~f&h))+k[i]+w[i])|0,u=((rr(a,2)^rr(a,13)^rr(a,22))+((a&c)^(a&d)^(c&d)))|0;j=h;h=g;g=f;f=(e+t)|0;e=d;d=c;c=a;a=(t+u)|0;}H=[(H[0]+a)|0,(H[1]+c)|0,(H[2]+d)|0,(H[3]+e)|0,(H[4]+f)|0,(H[5]+g)|0,(H[6]+h)|0,(H[7]+j)|0];}return H.map(x=>(x>>>0).toString(16).padStart(8,"0")).join("");}

function world(){
 const W=2048,H=1024,g=new Uint8Array(W*H),M={0:"empty",3:"water",8:"lava",58:"reinforced-concrete",62:"steel-plate",65:"rusted-steel",66:"steel-grating",68:"steel-pipe",69:"copper-pipe",72:"dark-glass",76:"hazard-stripe",77:"neon-cyan",79:"neon-amber",100:"basalt-columns",104:"firebrick",117:"bare-iron",131:"heat-shield-tile"};
 function rect(x,y,w,h,id){x=Math.floor(x);y=Math.floor(y);w=Math.ceil(w);h=Math.ceil(h);if(x<0||y<0||w<1||h<1||x+w>W||y+h>H)throw Error("bad box "+[x,y,w,h,id]);for(let yy=y;yy<y+h;yy++)g.fill(id,yy*W+x,yy*W+x+w);}
 function beam(x,y,X,Y,t,id){const n=Math.max(Math.abs(X-x),Math.abs(Y-y));for(let k=0;k<=n;k+=Math.max(1,Math.floor(t/4))){const f=k/n;rect(x+(X-x)*f-t/2,y+(Y-y)*f-t/2,t,t,id);}}
 function ellipse(cx,cy,rx,ry,id){for(let y=-ry;y<=ry;y++){let s=Math.floor(rx*Math.sqrt(Math.max(0,1-y*y/(ry*ry))));rect(cx-s,cy+y,2*s+1,1,id);}}
 // RIVETFALL HANGING CASTER GORGE: dry foundry spanning a 430-cell ravine,
 // real suspended load-path through asymmetrical bridge towers and rooted cable anchors.
 // Main air-flight at y245..340, deep flyable maintenance at y760..835, twin risers.
 rect(0,921,2048,103,100);rect(0,900,2048,21,58);
 rect(0,415,40,485,100);rect(2008,415,40,485,100);
 rect(40,685,1968,17,62);rect(40,702,1968,21,58);
 rect(54,755,1944,138,0);rect(54,893,1944,7,65);
 // Structural roof anchored to both boundary cliffs; deliberately high open nave.
 rect(39,165,1970,18,65);rect(39,183,1970,7,62);
 rect(39,183,15,240,58);rect(1994,183,15,240,58);
 for(const [x,h] of [[606,124],[1009,105],[1499,131]]){
   rect(x,190,18,h,65);rect(x+5,209,8,h-27,72);
   rect(x-13,190+h-15,44,16,62);
 }
 // Roof cable and tie members terminate at designed structural points.
 beam(617,214,727,361,8,68);beam(1020,214,914,359,8,68);
 beam(1020,221,1159,362,8,68);beam(1510,218,1415,371,8,68);
 // West ore intake, inclined hoist, live rail and operator cabin
 rect(74,614,250,20,65);rect(86,634,230,51,58);
 rect(96,570,145,35,117);rect(101,558,134,12,76);
 for(let x=116;x<230;x+=19)rect(x,581,10,10,79);
 rect(112,522,15,35,68);rect(219,526,15,31,68);
 rect(121,508,99,14,62);rect(141,496,43,12,72);
 beam(240,588,351,480,16,65);beam(246,584,357,484,7,76);
 rect(325,449,57,15,62);rect(331,464,13,221,58);rect(369,462,13,223,58);
 rect(348,493,22,37,131);rect(353,503,12,16,72);
 rect(79,417,81,14,65);rect(85,431,16,184,58);rect(144,431,14,184,58);
 rect(100,442,47,55,72);rect(113,457,19,10,77);
 rect(252,420,48,16,62);rect(260,436,12,182,58);
 rect(290,436,10,182,58);rect(270,457,20,42,72);
 // Distinct dual bloom furnaces: stacked heat-shielded hearths, different profiles.
 rect(407,617,293,68,58);rect(417,600,276,17,104);
 rect(430,418,108,181,104);rect(445,432,78,151,131);
 rect(470,457,28,112,8);rect(429,403,110,15,65);
 rect(439,391,87,12,76);
 rect(568,472,122,127,104);rect(582,484,94,100,131);
 rect(605,506,45,66,8);rect(564,459,128,13,65);
 rect(575,447,106,12,76);
 for(const x of [419,540,557,690]){rect(x,501,11,114,62);rect(x+2,515,7,81,76);}
 rect(477,361,16,30,68);rect(613,411,16,36,69);
 rect(468,345,35,16,117);rect(605,392,34,19,117);
 rect(442,635,47,17,117);rect(514,632,41,20,117);rect(564,637,50,18,117);
 // Dry molten tap to twin suspended ladles, with actual supported jackstations.
 rect(685,565,100,18,68);rect(696,583,85,27,131);
 rect(698,611,99,12,65);rect(709,623,16,62,58);rect(773,623,16,62,58);
 rect(731,592,28,9,79);
 rect(706,392,476,16,65);rect(709,408,471,10,76);
 rect(718,418,19,267,58);rect(1147,418,20,267,58);
 for(let x=744;x<1130;x+=53){beam(x,419,x+46,465,8,62);beam(x+46,419,x,465,7,68);}
 rect(774,471,332,14,62);rect(787,485,306,9,65);
 // Single glazed inspection cab and TWO physically different sealed transfer ladles.
 rect(805,489,11,69,68);rect(871,489,11,69,68);
 rect(798,557,94,20,117);rect(807,576,76,65,104);
 rect(821,587,49,38,131);rect(811,643,66,14,62);
 rect(816,657,12,28,58);rect(863,657,12,28,58);
 rect(942,489,12,89,69);rect(1004,489,12,89,68);
 rect(936,574,85,15,117);rect(947,589,64,54,131);
 rect(959,603,41,25,72);rect(940,643,77,13,65);
 rect(945,656,12,29,58);rect(1006,656,12,29,58);
 // Staggered flying-girder underbridge: real steel ribs as loads, not fake 3D.
 rect(711,668,445,17,62);
 for(let x=724;x<=1130;x+=15){
   const u=(x-724)/406,h=Math.round(67*Math.sin(Math.PI*u));
   if(h>0)rect(x,668-h,9,h,65);
 }
 // Casters climb an eccentric stepped cantilever, five different tool heads.
 rect(1180,649,390,36,58);rect(1192,631,368,18,62);
 const bays=[[1197,91,510,121],[1302,54,535,96],[1370,49,487,144],[1437,70,520,111],[1520,34,557,74]];
 for(const [x,w,y,h] of bays){
   rect(x,y,w,h,131);rect(x+8,y+14,w-16,h-29,62);
   if(w>39)rect(x+14,y+28,w-28,Math.max(9,h-61),72);
   rect(x+6,y+3,w-12,8,76);
 }
 rect(1181,431,388,16,65);rect(1185,447,379,9,76);
 rect(1190,456,18,177,58);rect(1542,456,20,177,58);
 for(let x=1210;x<1540;x+=61)beam(x,456,x+48,500,7,68);
 rect(1293,476,19,49,117);rect(1298,490,9,11,79);
 rect(1410,444,18,77,69);rect(1415,458,9,18,77);
 rect(1556,484,45,150,58);rect(1565,502,27,23,117);
 beam(1559,538,1594,598,8,76);
 // Sealed tripartite Water #3 cassette downstream of guarded shear
 rect(1600,536,205,149,58);rect(1614,550,179,120,104);
 for(const [x,w] of [[1624,44],[1680,35],[1729,52]])rect(x,558,w,96,3);
 rect(1612,543,183,15,131);rect(1614,654,179,17,104);
 rect(1590,504,226,17,65);rect(1606,492,192,12,76);
 rect(1604,524,15,161,69);rect(1792,525,15,160,68);
 rect(1794,606,54,17,62);rect(1816,623,32,62,58);
 // East rail freight dispatch, safe flight destination and signal cabin.
 rect(1855,631,132,21,66);rect(1863,652,121,33,58);
 rect(1866,576,93,42,117);rect(1876,562,72,14,76);
 for(const x of [1876,1911,1948]){rect(x,618,11,19,68);rect(x+2,625,7,6,79);}
 rect(1950,428,30,130,58);rect(1956,444,17,104,72);
 rect(1962,479,8,22,77);
 // Five distinguishable underfloor shops. No full-height divider across route.
 rect(80,860,203,33,58);rect(91,847,183,13,65);
 ellipse(169,873,53,16,117);ellipse(169,873,34,9,72);
 rect(112,829,10,18,68);rect(222,831,12,17,68);
 rect(440,859,235,34,58);rect(452,845,213,14,62);
 for(const x of [463,497,539,574,616,643])rect(x,826,10,20,131);
 rect(770,859,233,34,58);rect(781,847,214,12,65);
 rect(786,828,38,30,117);rect(851,829,44,29,117);rect(932,831,44,28,117);
 rect(795,842,15,11,77);rect(944,842,19,9,79);
 rect(1119,859,223,34,58);rect(1132,845,198,14,65);
 ellipse(1189,878,26,14,117);ellipse(1276,876,35,16,117);
 rect(1180,871,18,8,72);rect(1265,870,22,10,72);
 rect(1444,858,239,35,58);rect(1455,845,215,13,62);
 rect(1472,826,21,21,69);rect(1532,822,34,28,117);rect(1611,832,46,16,131);
 rect(1630,838,16,9,77);
 rect(1870,860,118,33,58);rect(1879,846,98,15,117);
 rect(1892,853,65,7,72);rect(1919,851,11,7,79);
 // Actual 77px-clear return flight. Both independent vertical service risers.
 rect(57,757,1934,77,0);
 rect(305,345,100,548,0);rect(1787,345,101,548,0);
 // Explicit guide rails remain beside, never within, the clear service shafts.
 rect(296,500,8,182,76);rect(406,505,7,178,76);
 rect(1778,506,8,178,76);rect(1889,509,8,175,76);
 // A genuine arch-pier breach at x1000 forces alternate from upper to lower gallery.
 // The actual obstruction is inserted in audit, never painted permanently.
 const sites=[
 ["Ore wagon arrival",87,281],["Dry hoist catwalk",249,277],
 ["West recovery riser",355,537],["Twin furnace control",473,280],
 ["Secondary bloom overlook",561,280],["West hanging trestle",725,280],
 ["First ladle maintenance",846,280],["Second ladle maintenance",928,276],
 ["Hanging viaduct air bridge",1175,278],["Caster winch staging",1224,278],
 ["Gravity mould inspection",1425,277],["Shear observation",1545,279],
 ["Sealed quench walkway",1647,280],["East recovery riser",1838,534],
 ["Freight dispatch goal",1921,281],["Vent repair",177,785],
 ["Reheat coolant repair",550,785],["Hydraulic return",875,786],
 ["Underbridge gearing",1227,786],["Filter scrubbing",1541,786],
 ["Dispatch signal relay",1918,784]
 ].map(([name,x,y])=>({name,x,y}));
 return {g,W,H,M,sites,seed:261120137,spawn:[87,281]};
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
 const flight=[[19,15],[23,19],[31,27]].map(p=>route(...p,null)),obstruction=[996,190,81,562],blocked=route(31,27,obstruction);
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
 const views=[["overview.png",0,0,2048,1024],["01-ore-hoist.png",54,389,353,305],["02-bloom-furnaces.png",408,339,296,352],["03-hanging-ladles.png",694,381,489,308],["04-gravity-casters.png",1170,418,405,272],["05-quench-freight.png",1578,428,418,261],["06-subgrade-repair.png",57,757,1934,136]],imgs={},imeta={};let pixels=0;for(const[name,x,y,ww,hh]of views){let b=png(w.g,2048,x,y,ww,hh);pixels+=verifyPNG(b,w.g,2048,x,y,ww,hh);imgs[name]=b;imeta[name]={crop:[x,y,ww,hh],bytes:b.length,sha256:sha256(b)};}
 const receipt={schema:1,original_no_source:true,concept:'Rivetfall Hanging Caster Gorge',seed:261120137,engine_sha:'de109d0131641d6adc8d25bb9ced7ca3d4991105',extent:[2048,1024],plane_sha256:sha256(w.g),setup_sha256:sha256(utf(setupText)),json_bytes:utf(setupText).length,rectangle_count:rects.length,source_rectangle_limit:32768,possible_installed_fallback_untested:4096,construction_work:a.work,material_histogram:a.hist,ground:{total:a.total,rooted:a.rooted,detached:a.detached,repair:support},fluid:{water:a.hist[3],lava:a.hist[8],initial_fluid_air_faces:a.airfaces,initial_water_lava_contacts:a.direct},flight:a.flight,obstruction:{box:a.obstruction,flight:a.blocked},pngs:imeta,pixel_material_parity_count:pixels,native:'NATIVE-UNTESTED'};
 return {'setup.json':utf(setupText),'receipt.json':utf(JSON.stringify(receipt,null,2)+'\n'),...imgs};
}

const fs=require('node:fs'),path=require('node:path');
const result=build(),verify=process.argv.includes('--verify');
for(const [name,contents]of Object.entries(result)){const f=path.join(__dirname,name);if(verify){const b=fs.readFileSync(f);if(b.length!==contents.length||!b.every((v,i)=>v===contents[i]))throw Error('Mismatch in '+name);}else fs.writeFileSync(f,contents);}
console.log((verify?'VERIFIED ':'GENERATED ')+Object.keys(result).length+' files');
