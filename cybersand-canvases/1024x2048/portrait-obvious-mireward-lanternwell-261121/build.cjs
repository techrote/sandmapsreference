'use strict';
function utf(s){let r=[];for(const z of s){let k=z.codePointAt(0);if(k<128)r.push(k);else if(k<2048)r.push(192|(k>>>6),128|(k&63));else if(k<65536)r.push(224|(k>>>12),128|((k>>>6)&63),128|(k&63));else r.push(240|(k>>>18),128|((k>>>12)&63),128|((k>>>6)&63),128|(k&63));}return Uint8Array.from(r);}

function sha256(msg){const k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2],n=(msg.length+9+63)&~63,b=new Uint8Array(n);b.set(msg);b[msg.length]=128;const bit=msg.length*8,view=new DataView(b.buffer);view.setUint32(n-8,Math.floor(bit/4294967296),false);view.setUint32(n-4,bit>>>0,false);let H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64),rr=(x,n)=>(x>>>n)|(x<<(32-n));for(let off=0;off<n;off+=64){for(let i=0;i<16;i++)w[i]=view.getUint32(off+4*i,false);for(let i=16;i<64;i++){let x=w[i-15],y=w[i-2];w[i]=(w[i-16]+(rr(x,7)^rr(x,18)^(x>>>3))+w[i-7]+(rr(y,17)^rr(y,19)^(y>>>10)))|0;}let[a,c,d,e,f,g,h,j]=H;for(let i=0;i<64;i++){let t=(j+(rr(f,6)^rr(f,11)^rr(f,25))+((f&g)^(~f&h))+k[i]+w[i])|0,u=((rr(a,2)^rr(a,13)^rr(a,22))+((a&c)^(a&d)^(c&d)))|0;j=h;h=g;g=f;f=(e+t)|0;e=d;d=c;c=a;a=(t+u)|0;}H=[(H[0]+a)|0,(H[1]+c)|0,(H[2]+d)|0,(H[3]+e)|0,(H[4]+f)|0,(H[5]+g)|0,(H[6]+h)|0,(H[7]+j)|0];}return H.map(x=>(x>>>0).toString(16).padStart(8,"0")).join("");}





function world(){
 const W=1024,H=2048,g=new Uint8Array(W*H),seed=202611211342;
 const M={0:"air",49:"iron",62:"plate",63:"blue",68:"steel",77:"signal",79:"amber",100:"basalt",101:"schist",121:"white",129:"black",130:"ceramic",131:"chrome"};
 const b=(x,y,w,h,m)=>{x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);if(x<0||y<0||w<1||h<1||x+w>W||y+h>H)throw Error("bounds "+[x,y,w,h,m]);for(let j=y;j<y+h;j++)g.fill(m,j*W+x,j*W+x+w);};
 const l=(x,y,X,Y,t,m)=>{let n=Math.ceil(Math.hypot(X-x,Y-y)/Math.max(2,t/2));for(let i=0;i<=n;i++){let q=i/n;b(x+(X-x)*q-t/2,y+(Y-y)*q-t/2,t,t,m);}};
 const sites=[
 ["Canopy arrival",505,185],["West root registry",213,331],["West inoculation bench",254,554],
 ["East lumen interpreter",782,384],["East nursery landing",777,682],["Suspension exchange",504,645],
 ["Atrium middle watch",505,821],["Side loop upper entry",772,856],["Side sterile riser",773,1000],
 ["Side loop lower exit",772,1237],["Central return junction",501,1265],
 ["Left spore assay",221,955],["West basal salvage",220,1400],["West biodiagnostic room",254,1537],
 ["East quarantine arrival",777,1452],["East isolation wicket",784,1590],
 ["Open lower transit",509,1536],["Rootfall lookout",507,1693],
 ["West dry repair dock",238,1821],["East export dock",774,1815],
 ["Basal ledger room",504,1855],["Basal export airlock",509,1905]
 ].map(([name,x,y])=>({name,x,y}));
 // Roof-to-earth inversion, all rock and machine structures are real 2D cells.
 b(0,0,1024,106,100);b(0,106,126,1834,100);b(902,106,122,1834,101);
 b(0,1940,1024,108,100);
 for(const [x,w,d,id] of [[47,85,50,100],[185,63,76,101],[325,110,47,100],[575,95,74,101],[742,89,56,100],[855,77,32,101]])b(x,106,w,d,id);
 // Long continuous ceiling root on the left and staggered right supporting coast.
 for(const [x,y,w,h,id] of [[125,202,40,129,100],[123,613,55,130,100],[125,1295,51,254,100],
 [867,505,35,131,101],[866,679,36,92,101],[125,1707,40,230,100],[864,1680,38,257,101]])b(x,y,w,h,id);
 // True entered biological basins at mid-depth (not scenery behind collision walls).
 b(126,760,219,512,100);b(683,745,219,597,101);
 b(704,810,167,490,0);b(622,826,120,75,0);b(620,1190,125,96,0);
 // Left basin cuts, two unequal service coves with separate flight mouths.
 b(126,1289,220,420,100);b(147,1327,171,254,0);
 b(303,1334,104,72,0);b(302,1538,107,82,0);
 // Right sterile settlement beyond the main atrium.
 b(693,1362,209,350,101);b(720,1406,155,262,0);
 b(630,1423,132,79,0);b(631,1598,130,76,0);
 // Rooted floor service/custody with deep dry rooms and upper open intake.
 b(133,1765,757,175,100);b(165,1790,694,143,0);
 b(353,1734,317,85,0);
 // Three unlike upper hanging workfaces, tied visibly to the same roof.
 b(157,106,17,274,49);b(326,111,14,268,49);b(157,379,190,14,68);
 b(172,350,73,26,130);b(185,354,19,14,63);
 b(265,345,64,29,129);b(282,352,19,16,79);
 b(337,106,13,506,49);b(186,610,164,14,62);
 b(200,585,65,22,130);b(211,590,21,12,63);
 b(280,579,55,25,129);b(292,585,21,13,79);
 b(868,106,15,322,49);b(704,427,179,13,68);
 b(714,407,65,17,130);b(725,410,16,11,77);
 b(799,404,61,21,129);b(813,408,17,14,63);
 b(867,110,15,606,49);b(703,716,178,14,62);
 b(713,695,59,18,130);b(727,698,13,12,63);
 b(804,689,59,22,129);b(815,694,17,14,79);
 // Three different roof-founded suspended culture families and distinct pod outlines.
 b(373,106,12,287,49);b(369,393,81,11,68);
 b(385,406,63,153,130);b(395,420,43,108,0);
 b(408,456,13,48,77);b(389,535,55,13,63);
 b(640,106,12,465,49);b(630,570,50,12,131);
 b(633,581,50,180,129);b(644,594,28,127,0);
 b(650,606,13,68,79);b(635,747,46,13,68);
 b(224,106,11,557,49);b(209,665,73,13,62);
 b(213,680,69,163,130);b(221,693,54,120,0);
 b(239,732,14,47,77);b(218,830,60,10,131);
 // Floating exchange is held by a real roof hanger; deliberately fractured cable end.
 b(591,106,12,691,49);b(569,791,53,11,68);
 b(579,786,40,37,129);b(592,793,15,16,79);
 b(430,795,103,11,62);b(434,806,12,45,49);
 l(450,812,501,838,7,131);
 // Distinguish cavity's enclosed return from open atrium via ledgers and side portals.
 b(700,902,12,240,49);b(846,912,16,221,49);
 b(722,938,131,13,62);b(722,1057,130,11,68);
 b(730,1090,48,47,129);b(739,1098,19,22,77);
 b(795,1095,49,36,130);b(803,1100,19,20,63);
 b(720,1266,148,14,68);
 b(748,1241,44,22,130);b(758,1247,15,12,79);
 // Geology-anchored lower cove and genuine entered medical benches.
 b(151,1579,170,13,62);b(157,1475,158,12,68);
 b(167,1550,71,27,130);b(180,1558,22,15,63);
 b(250,1551,59,26,129);b(264,1559,21,15,77);
 b(153,1457,90,11,68);b(164,1433,53,21,130);
 b(175,1437,16,12,79);
 b(724,1659,154,13,62);b(728,1551,143,12,68);
 b(732,1573,64,76,130);b(746,1590,29,30,63);
 b(813,1588,49,59,129);b(823,1600,21,16,79);
 b(742,1493,112,12,68);b(753,1516,45,32,130);b(767,1523,15,15,63);
 // Rootfall diagnostic counters and lower exit transshipment are intentionally different.
 b(176,1922,674,12,68);
 b(174,1890,117,30,130);b(181,1898,30,14,63);
 b(302,1883,89,38,129);b(316,1893,25,18,77);
 b(646,1887,100,33,130);b(668,1897,24,16,63);
 b(761,1884,80,36,129);b(781,1892,23,20,79);
 b(433,1900,156,20,121);b(459,1905,33,12,63);b(537,1908,26,12,77);
 b(170,1779,123,15,68);b(171,1794,12,46,49);
 b(726,1776,126,13,62);b(839,1787,12,50,49);

 // A genuinely entered west spore-assay dead-end (not a bypass of the central obstacle).
 b(139,839,174,251,0);
 b(287,820,118,92,0); // upper portal from main lumen; remains a dead end at the lower lip
 b(128,1069,207,13,68); // both ends physically seat into cliff stone
 b(161,1040,72,26,130);b(171,1046,24,15,63);
 b(246,1028,65,36,129);b(259,1036,21,20,79);
 b(157,987,13,82,49);b(293,998,13,71,49);
 b(164,902,94,10,131);b(182,914,40,20,130);
 b(192,919,19,10,77);
 // Five independently supported, irregular biological forks; no copied stamp or mirrored bank.
 l(371,390,351,463,7,49);l(371,397,412,445,7,49);
 l(639,548,667,612,8,49);l(640,555,615,621,6,49);
 l(855,487,822,534,8,49);l(850,491,862,573,6,49);
 l(208,622,193,679,8,49);l(210,626,252,660,6,49);
 // Short, asymmetrically staggered real custody shelves around central lumen.
 b(322,1269,94,12,62);b(324,1281,12,36,49);
 b(311,1468,107,11,68);b(315,1479,12,52,49);
 b(703,1710,93,12,62);b(785,1681,12,37,49);
 // One partial isolation wall, intentionally entered around its right-hand wicket.
 b(721,1529,93,13,121);b(726,1517,16,12,49);
 b(821,1540,21,22,79);
 // The named centres are literal design clearances authored into real material cells.
 for(const s of sites)b(s.x-19,s.y-17,39,35,0);

 // Four physically excavated side-entry doorways, full-height for Midge; not waypoint substitution.
 b(307,275,121,100,0);  // west roof registry to central high lumen
 b(305,510,163,97,0);   // inoculation workface to the central descent
 b(617,318,141,93,0);   // east interpreter through roof hanger
 b(614,624,145,82,0);   // east nursery through inner pod shell

 // Entered 31x27 doors through otherwise dividing load-bearing stalks and lantern deck.
 b(200,281,135,76,0);   // west registrar side-entry
 b(553,301,90,132,0);   // main lumen to east culture loft (through a hanger)
 b(788,405,68,96,0);    // true passage down through east interpretation deck
 b(608,790,81,11,68);   // lower exchange re-rooted in the east geological bank
 // All accepted non-air material must physically connect to a world boundary.
 const seen=new Uint8Array(g.length),q=new Int32Array(g.length);let a=0,z=0;
 function add(i){if(g[i]&&!seen[i]){seen[i]=1;q[z++]=i;}}
 for(let x=0;x<W;x++){add(x);add((H-1)*W+x);}
 for(let y=0;y<H;y++){add(y*W);add(y*W+W-1);}
 while(a<z){let i=q[a++],x=i%W;for(const j of [x?i-1:-1,x<W-1?i+1:-1,i>=W?i-W:-1,i+W<g.length?i+W:-1])if(j>=0)add(j);}
 let lost=0;for(let i=0;i<g.length;i++)if(g[i]&&!seen[i]){g[i]=0;lost++;}
 return {W,H,g,M,seed,sites,spawn:[sites[0].x,sites[0].y],discarded_ungrounded:lost,braceCount:0,bracedCells:0};
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
 const flight=[[19,15],[23,19],[31,27]].map(p=>route(...p,null)),obstruction=[330,939,375,107],blocked=route(31,27,obstruction);
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
 const end=sites.find(q=>q.name==="Basal export airlock");if(!end)throw Error("missing literal goal");
 const start=spawn[1]*W+spawn[0],finish=end.y*W+end.x,dist=new Int32Array(W*H),parent=new Int32Array(W*H),queue=new Int32Array(W*H);
 dist.fill(-1);let front=0,tail=0;
 if(!free[start]||!free[finish])throw Error("literal spawn/goal blocked");
 queue[tail++]=start;dist[start]=0;
 while(front<tail&&dist[finish]===-1){
  const i=queue[front++],x=i%W;
  for(const j of[x?i-1:-1,x+1<W?i+1:-1,i-W,i+W]){
   if(j>=0&&j<W*H&&free[j]&&dist[j]===-1){dist[j]=dist[i]+1;parent[j]=i;queue[tail++]=j;}
  }
 }
 let entered=0,atLevel=[],walked=0;
 if(dist[finish]>=0){for(let i=finish;i!==start;i=parent[i]){
  if(i<0||walked>W*H)throw Error("invalid route parent");
  const x=i%W,y=(i/W)|0;
  if(y>=945&&y<=1045&&x>=716&&x<=855)entered++;
  if(y===1000&&atLevel.length<5)atLevel.push([x,y]);
  walked++;
 }}
 return {steps:dist[finish],visited:tail,entered_side_gallery_cells:entered,crossing_at_y1000:atLevel};
}

function concat(arr){const n=arr.reduce((p,a)=>p+a.length,0),out=new Uint8Array(n);let j=0;for(const a of arr){out.set(a,j);j+=a.length;}return out;}

function b32(k){return Uint8Array.of((k>>>24)&255,(k>>>16)&255,(k>>>8)&255,k&255);}

function crc32(a){let c=-1;for(let i=0;i<a.length;i++){c^=a[i];for(let j=0;j<8;j++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^(-1))>>>0;}

function adler32(a){let u=1,v=0;for(let i=0;i<a.length;i++){u=(u+a[i])%65521;v=(v+u)%65521;}return ((v<<16)|u)>>>0;}

function chunk(tag,data){const body=concat([utf(tag),data]);return concat([b32(data.length),body,b32(crc32(body))]);}

function png(g,W,x,y,w,h){const raw=new Uint8Array((w+1)*h);for(let yy=0;yy<h;yy++)raw.set(g.subarray((y+yy)*W+x,(y+yy)*W+x+w),yy*(w+1)+1);const z=[Uint8Array.of(0x78,0x01)];for(let i=0;i<raw.length;){const n=Math.min(65535,raw.length-i),block=new Uint8Array(n+5);block[0]=i+n===raw.length?1:0;block[1]=n&255;block[2]=n>>>8;block[3]=(~n)&255;block[4]=((~n)>>>8)&255;block.set(raw.subarray(i,i+n),5);z.push(block);i+=n;}z.push(b32(adler32(raw)));
 const colors={0:[8,11,18],49:[89,94,113],62:[124,142,155],63:[41,181,211],68:[181,194,198],77:[255,219,100],79:[206,138,57],100:[45,54,69],101:[63,71,88],121:[220,229,229],129:[28,43,52],130:[151,148,133],131:[180,198,198]},palette=new Uint8Array(132*3);for(const[k,v]of Object.entries(colors))palette.set(v,k*3);
 return concat([Uint8Array.of(137,80,78,71,13,10,26,10),chunk("IHDR",concat([b32(w),b32(h),Uint8Array.of(8,3,0,0,0)])),chunk("PLTE",palette),chunk("IDAT",concat(z)),chunk("IEND",new Uint8Array(0))]);
}

function verifyPNG(p,g,W,x,y,w,h){const v=new DataView(p.buffer,p.byteOffset,p.byteLength);let pos=8,z=null,sections=[];for(let i=0;i<8;i++)if(p[i]!==[137,80,78,71,13,10,26,10][i])throw Error("PNG signature");while(pos<p.length){let n=v.getUint32(pos,false),tag=String.fromCharCode(...p.subarray(pos+4,pos+8));if(crc32(p.subarray(pos+4,pos+8+n))!==v.getUint32(pos+8+n,false))throw Error("CRC");sections.push(tag);if(tag==="IHDR"&&(v.getUint32(pos+8,false)!==w||v.getUint32(pos+12,false)!==h))throw Error("PNG dimensions");if(tag==="IDAT")z=p.subarray(pos+8,pos+8+n);pos+=12+n;if(tag==="IEND")break;}if(pos!==p.length||sections.join()!=="IHDR,PLTE,IDAT,IEND")throw Error("PNG chunks");let raw=new Uint8Array((w+1)*h),j=2,k=0,done=0;while(!done){const header=z[j++];done=header&1;if(header&6)throw Error("DEFLATE mode");let len=z[j]|(z[j+1]<<8),inverse=z[j+2]|(z[j+3]<<8);j+=4;if(((len^inverse)&65535)!==65535)throw Error("DEFLATE stored length");raw.set(z.subarray(j,j+len),k);k+=len;j+=len;}if(k!==raw.length||adler32(raw)!==((z[j]*16777216+z[j+1]*65536+z[j+2]*256+z[j+3])>>>0))throw Error("zlib checksum");for(let yy=0;yy<h;yy++){if(raw[yy*(w+1)]!==0)throw Error("row filter");for(let xx=0;xx<w;xx++)if(raw[yy*(w+1)+xx+1]!==g[(y+yy)*W+x+xx])throw Error("pixel parity");}return w*h;}







function build(){
 const w=world(),rects=encode(w.g,w.W,w.H),a=audit(w,rects),direct=shortest31(w,null),detour=shortest31(w,[330,939,375,107]);
 if(a.detached||a.airfaces||a.direct||a.flight.some(f=>f.passed!==w.sites.length)||a.blocked.passed!==w.sites.length||detour.steps<=direct.steps||detour.entered_side_gallery_cells<30)
 throw Error("STATIC_GATE "+JSON.stringify({detached:a.detached,fluid:[a.airfaces,a.direct],passed:a.flight.map(f=>f.passed),bad:a.flight[2].sites.filter(s=>!s.reached),blocked:a.blocked.passed,steps:[direct.steps,detour.steps]}));
 const setup={version:2,extent:[1024,2048],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:w.spawn,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:2}}],next_id:2,selected:1,edits:rects,response:"LA-SELECTIVE",liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
 const setupText=JSON.stringify(setup),sha=sha256(w.g),setupSHA=sha256(utf(setupText));if(rects.length>32768||utf(setupText).length>1048576)throw Error("Setup limit");
 const crops=[["overview.png",0,0,1024,2048],["01-canopy-registry.png",133,145,250,310],["02-unequal-hanging-pods.png",193,379,518,508],["03-midair-exchange.png",415,748,459,528],["04-entered-sterile-return.png",684,776,199,568],["05-lower-civic-coves.png",130,1307,760,399],["06-basal-salvage.png",155,1724,716,215]],pngs={},pngMeta={};let px=0;
 for(const [n,x,y,ww,hh]of crops){const p=png(w.g,w.W,x,y,ww,hh);px+=verifyPNG(p,w.g,w.W,x,y,ww,hh);pngs[n]=p;pngMeta[n]={xywh:[x,y,ww,hh],bytes:p.length,sha256:sha256(p)};}
 const receipt={schema:1,trial:"PORTRAIT-001",difficulty:"OBVIOUS",source:{pr:143,head:"cfbeddaccdc81a8e1dcfa924b4c089dbbe65cf41",path:"cybersand-canvases/2048x1024/worldgroup-xenobiome-mireward-levee-vesper-inverted-root-orchard-261121/"},base:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",engine:"69209acaffb34ebe18c45e19290b5976b7fb2c82",seed:w.seed,dimensions:[1024,2048],cells:2097152,source_grid_sha256:sha,setup_sha256:setupSHA,setup_bytes:utf(setupText).length,rectangles:rects.length,construction_work:a.work,material_histogram:a.hist,ground:{total:a.total,rooted:a.rooted,detached:a.detached,pruned_provisional:w.discarded_ungrounded},fluid:{water:a.hist[3]||0,lava:a.hist[8]||0,exposed_faces:a.airfaces,water_lava_contacts:a.direct},hulls:a.flight,physical_obstruction:a.obstruction,obstructed:a.blocked,goal_distance:{direct:direct.steps,obstructed:detour.steps,forced_side_gallery_path_cells:detour.entered_side_gallery_cells,crossing_at_y1000:detour.crossing_at_y1000},pngs:pngMeta,pixel_parity:px,native:"NATIVE-UNTESTED"};
const aspect_transfer={
 source_extent:[2048,1024],target_extent:[1024,2048],source_pr:143,
 source_head:"cfbeddaccdc81a8e1dcfa924b4c089dbbe65cf41",
 source_map_path:"cybersand-canvases/2048x1024/worldgroup-xenobiome-mireward-levee-vesper-inverted-root-orchard-261121/",
 difficulty:"OBVIOUS",
 preserved:["one continuous canopy rooted into boundary geology","variable-depth suspended root cultures and biocustody sleeves","asymmetric western seed registration and eastern quarantine","free central light-and-flight lumen","separate dry basal repair and cargo release"],
 transformed:["one wide horizontal roof exchange becomes a deep dual-atrium inoculation descent","left-right customs transaction becomes upper west registration to lower east isolation","twin interrupted lateral cables become one short suspended midair transfer","wide ground salvage is now a physically entered basal dispatch terminal"],
 discarded:["original source coordinate and bridge lengths","original lateral district ordering","repeated equal-height canopy cassettes"],
 newly_introduced:["roof-grown deep rootfall observation and distinct vertical capsule families","enclosed right bank sterile maintenance return with upper and lower portals","opposite-side basal medical/sterile custody coves","staged salvage ledger with two outward dispatch docks"]
};
const route_graph={
 spawn:"Upper fault spawn",goal:"Basal export airlock",
 sites:w.sites.map(s=>({name:s.name,xy:[s.x,s.y]})),
 primary:["Canopy arrival","Suspension exchange","Atrium middle watch","Central return junction","Open lower transit","Basal export airlock"],
 branches:[["Canopy arrival","West root registry","West inoculation bench","Suspension exchange"],["East lumen interpreter","East nursery landing","Atrium middle watch"],["Side loop upper entry","Side sterile riser","Side loop lower exit","Central return junction"],["Left spore assay","West basal salvage","West biodiagnostic room","Open lower transit"],["East quarantine arrival","East isolation wicket","Basal ledger room"]],
 exact_hull_results:a.flight.map(q=>({hull:q.hull,sites:q.sites})),
 obstruction:{rect:[330,939,375,107],material:58,goal_distance_direct:direct.steps,goal_distance_obstructed:detour.steps,forced_side_gallery_path_cells:detour.entered_side_gallery_cells,crossing_at_y1000:detour.crossing_at_y1000,all_named_sites_reachable_after:a.blocked.passed}
};
const exemplar={
 schema_version:1,purpose:["human_editable_canvas","procedural_exemplar","scripted_setpiece_source"],
 family:"portrait/obvious/mireward-lanternwell",map_role:"roof-rooted inverted inoculation atrium with separated side sterile return and basal refuge",
 anchor_donors:[{source_pr:143,source_head:aspect_transfer.source_head}],macro_topology:"roof-rooted deep hanging cultural descent and lower opposed medical and quarantine coves",
 density_profile:"dense ceiling-root production, open vertical lumen, occupied side inspection chambers, dry basal repair",
 route_grammar:{"main":route_graph.primary,"alternate":route_graph.branches},
 strong_motifs:["continuous rocky roof root and unequal living culture tails","unlike western registrar and eastern sterile lanterns","three distinct suspended capsule lengths","physically entered eastern sterile return","entered midlevel spore assay and opposed late medical and quarantine coves"],
 interesting_relationships:["horizontal opposed communal exchange converted into vertical culture custody sequence","different-depth canopy load paths project into a single unfilled flight lumen","separate entered sterile return reroutes around blocked central airshaft","low salvage hall has distinct entry/exit processing"],
 authoring_affordances:["deliberately open central lumen for future aerial chase and rootfall","modular inoculation append sockets on suspended shafts","a dead-end west spore assay and two service recesses beside entered side return","dry bottom repair extensions for manual or procedural parts"],
 setpiece_candidates:[{name:"living-root release",region:[365,355,683,810],scripted:false},{name:"sterile return lockdown",region:[685,820,877,1300],scripted:false},{name:"quarantine custody",region:[710,1404,874,1677],scripted:false},{name:"basal shipment departure",region:[157,1770,859,1935],scripted:false}],
 procedural_exemplar_value:"Vertical inversion of a horizontally rooted bioindustrial exchange: preserve ceiling-born load paths, vary hanging capsule types and lengths, bring separated communities together through actual entered side passages without closing the central aerial lumen.",
 similarity_avoidance:"Unlike the source Vesper's unbroken horizontal roof across two lateral enclaves, the portrait makes variable-depth vertical transactions and a right-embedded rescue/sterile return; unlike the Orthant portrait, the structure is biological roof suspended rather than opposed fault ledges.",
 diversity_axes:{macro_topology:"suspended",altitude_grammar:"vertical_spine",density_cadence:"dense_open_dense",route_structure:"branch_rejoin",landmark_family:"mixed",support_form:"roof_rooted",environment_relation:"biological",incompleteness:"modular_append_zones"},
 grid_sha256:sha,native:"NATIVE-UNTESTED"
};
const readme=[
 "# Mireward Lanternwell — Descending Inoculation Atrium",
 "",
 "PORTRAIT-001 Creator A | OBVIOUS #2 | 1024x2048 exact material-ID cells | Draft/HOLD | NATIVE-UNTESTED",
 "Source Mireward Vesper inverted orchard PR #143 exact HEAD "+aspect_transfer.source_head,
 "Source owned folder "+aspect_transfer.source_map_path,
 "Read-only accepted engine authority techrote/cybersand/main@69209acaffb34ebe18c45e19290b5976b7fb2c82.",
 "Not a crop, stretch, rotation, scale or coordinate transplant. The roof-grown biological exchange has become a multi-stage vertical custody sequence.",
 "Real side-embedded sterile return portals enable the physical-obstruction recovery. Inoculation, hanging roots, isolation and basal salvage remain distinguishable.",
 "The central airy lumen and uncultured sockets are intentionally open future authoring spaces. The capsules and processes are *inert geometry*, not simulated growing biology.",
 "Regenerate and verify entire Setup, receipt, route graph, aspect transfer, exemplar and 7 true indexed-material PNGs with: node build.cjs",
 "All Midge checks are full literal-site free-centre four-neighbour BFS with 19x15, 23x19 and 31x27 hulls. No native gameplay, collision, evolving biological simulation or persistence was executed.",
 "No source branch edits, Ready promotion, merge, or owner acceptance."
].join("\n")+"\n";
 return {setupText,receipt,pngs,aspect_transfer,route_graph,exemplar,readme};
}
if(typeof require!=="undefined" && typeof module!=="undefined" && require.main===module){const fs=require("fs"),path=require("path"),d=process.argv[2]||__dirname;fs.mkdirSync(d,{recursive:true});const a=build();fs.writeFileSync(path.join(d,"setup.json"),a.setupText);fs.writeFileSync(path.join(d,"receipt.json"),JSON.stringify(a.receipt,null,2)+"\n");for(const[n,v]of Object.entries(a.pngs))fs.writeFileSync(path.join(d,n),v);for(const [n,v] of [["aspect_transfer.json",a.aspect_transfer],["route_graph.json",a.route_graph],["exemplar.json",a.exemplar]])fs.writeFileSync(path.join(d,n),JSON.stringify(v,null,2)+"\n");fs.writeFileSync(path.join(d,"README.md"),a.readme);console.log(a.receipt);}
if(typeof module!=="undefined")module.exports={build,world,encode,audit,shortest31,png,verifyPNG};