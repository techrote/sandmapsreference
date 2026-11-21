"use strict";
function sha256(input){
 const a=typeof input==="string"?Uint8Array.from(input,c=>c.charCodeAt(0)):input;
 const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
 const n=(a.length+72)&~63,b=new Uint8Array(n);b.set(a);b[a.length]=128;let bits=a.length*8;for(let i=0;i<8;i++){b[n-1-i]=bits&255;bits=Math.floor(bits/256);}
 let h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64),rot=(x,n)=>x>>>n|x<<(32-n);
 for(let o=0;o<n;o+=64){for(let j=0;j<16;j++){let i=o+j*4;w[j]=(b[i]<<24|b[i+1]<<16|b[i+2]<<8|b[i+3])>>>0;}
 for(let j=16;j<64;j++){let p=w[j-15],q=w[j-2];w[j]=(w[j-16]+(rot(p,7)^rot(p,18)^(p>>>3))+w[j-7]+(rot(q,17)^rot(q,19)^(q>>>10)))>>>0;}
 let [A,B,C,D,E,F,G,H]=h;for(let j=0;j<64;j++){let t1=(H+(rot(E,6)^rot(E,11)^rot(E,25))+((E&F)^(~E&G))+K[j]+w[j])>>>0,t2=((rot(A,2)^rot(A,13)^rot(A,22))+((A&B)^(A&C)^(B&C)))>>>0;H=G;G=F;F=E;E=(D+t1)>>>0;D=C;C=B;B=A;A=(t1+t2)>>>0;}let v=[A,B,C,D,E,F,G,H];for(let j=0;j<8;j++)h[j]=(h[j]+v[j])>>>0;}
 return h.map(n=>n.toString(16).padStart(8,"0")).join("");
}
function b64(bytes){const c="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",a=[];let s="";for(let i=0;i<bytes.length;i+=3){let x=bytes[i],y=bytes[i+1]||0,z=bytes[i+2]||0;s+=c[x>>2]+c[(x&3)<<4|y>>4]+(i+1<bytes.length?c[(y&15)<<2|z>>6]:"=")+(i+2<bytes.length?c[z&63]:"=");if(s.length>10000){a.push(s);s="";}}return a.join("")+s;}
function png(g,x0,y0,w,h){
 const be=n=>[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255],raw=new Uint8Array(h*(w+1));
 for(let y=0;y<h;y++)raw.set(g.subarray((y+y0)*2048+x0,(y+y0)*2048+x0+w),y*(w+1)+1);
 const rev=(v,n)=>{let a=0;while(n--){a=a<<1|v&1;v>>>=1;}return a;};
 function zip(raw){let out=[120,1],bits=0,nb=0;function wr(v,k){bits|=v<<nb;nb+=k;while(nb>=8){out.push(bits&255);bits>>>=8;nb-=8;}}
 function sym(v){let k,x;if(v<=143){x=v+48;k=8;}else if(v<=255){x=v+256;k=9;}else if(v<=279){x=v-256;k=7;}else{x=v-280+192;k=8;}wr(rev(x,k),k);}
 const lb=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],ex=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
 wr(3,3);for(let i=0;i<raw.length;){let r=1;while(i+r<raw.length&&r<258&&raw[i]===raw[i+r])r++;if(r>=4&&i>0&&raw[i]===raw[i-1]){let j=0;while(j<28&&lb[j+1]<=r)j++;sym(257+j);if(ex[j])wr(r-lb[j],ex[j]);wr(0,5);i+=r;}else sym(raw[i++]);}
 sym(256);if(nb)out.push(bits&255);let a=1,b=0;for(let v of raw){a=(a+v)%65521;b=(b+a)%65521;}out.push(...be((b<<16|a)>>>0));return Uint8Array.from(out);}
 function crc(a){let c=0xffffffff;for(let v of a){c^=v;for(let j=0;j<8;j++)c=c>>>1^(0xedb88320&-(c&1));}return(c^0xffffffff)>>>0;}
 function chunk(name,d){let b=new Uint8Array(d.length+12);b.set(be(d.length));b.set([...name].map(c=>c.charCodeAt(0)),4);b.set(d,8);b.set(be(crc(b.subarray(4,d.length+8))),d.length+8);return b;}
 let pal=new Uint8Array(132*3),cols={0:[8,11,18],49:[95,98,107],58:[119,123,128],62:[126,141,153],66:[74,85,93],68:[102,119,129],77:[55,243,228],79:[250,184,86],100:[54,56,61],101:[24,19,32],120:[156,210,220],129:[33,70,110],131:[168,171,177]};
 for(let [k,v] of Object.entries(cols))pal.set(v,Number(k)*3);
 let pieces=[Uint8Array.from([137,80,78,71,13,10,26,10]),chunk("IHDR",Uint8Array.from([...be(w),...be(h),8,3,0,0,0])),chunk("PLTE",pal),chunk("IDAT",zip(raw)),chunk("IEND",new Uint8Array())],b=new Uint8Array(pieces.reduce((n,v)=>n+v.length,0));let off=0;for(let v of pieces){b.set(v,off);off+=v.length;}return b;
}

function build(){
 const W=2048,H=1024,N=W*H,g=new Uint8Array(N),M={basalt:100,schist:101,slate:49,steel:62,grate:66,pipe:68,cyan:77,amber:79,glass:120,blue:129,shield:131};
 function R(x,y,w,h,v){let a=Math.max(0,Math.round(x)),b=Math.min(W,Math.round(x+w)),c=Math.max(0,Math.round(y)),d=Math.min(H,Math.round(y+h));for(let j=c;j<d;j++)g.fill(v,j*W+a,j*W+b);}
 function L(x,y,X,Y,t,v){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,r=t/2,rr=r*r;for(let j=Math.max(0,Math.floor(Math.min(y,Y)-r));j<Math.min(H,Math.ceil(Math.max(y,Y)+r+1));j++)for(let i=Math.max(0,Math.floor(Math.min(x,X)-r));i<Math.min(W,Math.ceil(Math.max(x,X)+r+1));i++){let p=Math.max(0,Math.min(1,((i-x)*dx+(j-y)*dy)/(d||1)));if((i-x-p*dx)**2+(j-y-p*dy)**2<=rr)g[j*W+i]=v;}}
 function P(a,v){let low=Math.max(0,Math.floor(Math.min(...a.map(p=>p[1])))),high=Math.min(H-1,Math.ceil(Math.max(...a.map(p=>p[1]))));for(let y=low;y<=high;y++){let xs=[];for(let i=0;i<a.length;i++){let p=a[i],q=a[(i+1)%a.length];if((p[1]<=y&&q[1]>y)||(q[1]<=y&&p[1]>y))xs.push(p[0]+(y-p[1])*(q[0]-p[0])/(q[1]-p[1]));}xs.sort((x,y)=>x-y);for(let k=0;k+1<xs.length;k+=2)R(Math.ceil(xs[k]),y,Math.max(0,Math.floor(xs[k+1])-Math.ceil(xs[k])+1),1,v);}}




 // ORIGINAL THESIS: an excavated drydock with an incomplete, two-piece spore ark.
 // No predecessor material coordinates, shapes, stamps or routes are imported.
 let rng=0x6deab7c1;function rand(){rng^=rng<<13;rng^=rng>>>17;rng^=rng<<5;return (rng>>>0)/4294967296;}
 // Geological floor, deliberately excavated dry lower return.
 R(0,910,W,114,M.basalt);R(0,999,W,25,M.schist);
 R(64,945,1914,50,0);
 for(let x=0;x<W;x+=73){R(x,900+Math.floor(rand()*8),73,12,M.basalt);}
 // Unequal western/eastern buttresses frame a broad open drydock.
 P([[336,909],[362,835],[394,768],[427,690],[470,681],[516,743],[545,819],[560,909]],M.basalt);
 P([[1450,909],[1489,822],[1525,754],[1564,699],[1601,713],[1651,802],[1674,909]],M.basalt);
 // Dock sill is only beneath the split ark, not a floor across the flight aperture.
 R(576,861,841,24,M.schist);R(588,851,819,10,M.steel);
 for(let x=603;x<1390;x+=91){R(x,848,55,9,M.grate);R(x+8,834,9,14,M.pipe);}
 // Drydock two immense shear-resistant cradle ribs, structurally tied to the sill.
 for(let [x,y,X] of [[670,810,716],[821,828,840],[1206,830,1190],[1368,808,1328]]){
   L(x,y,X,860,18,M.steel);L(x+18,y+4,X+32,858,7,M.pipe);
 }
 // Split vessel: asymmetric port seed hull and weathered east quarantine half.
 // Each hull is an open ribbed side-elevation section, never a solid disk.
 L(646,547,718,608,17,M.shield);L(718,608,874,636,18,M.steel);
 L(874,636,947,573,15,M.shield);L(652,547,779,494,11,M.steel);
 L(779,494,950,513,13,M.steel);L(947,573,950,513,9,M.pipe);
 L(1109,518,1290,477,12,M.shield);L(1290,477,1412,538,17,M.steel);
 L(1412,538,1334,621,19,M.shield);L(1334,621,1139,622,18,M.steel);
 L(1139,622,1081,551,11,M.shield);L(1081,551,1109,518,8,M.pipe);
 // The visible broken structural gap is 130 px wide: authored missing keel.
 for(let [x,y,t] of [[725,568,7],[763,581,9],[805,592,7],[847,592,8],[1185,564,8],[1223,552,8],[1266,540,7],[1311,550,9]]){
   L(x,y-41,x+3,y+33,t,M.grate);R(x-6,y-31,16,9,M.cyan);
 }
 // Damaged snapped spars and exposed tiedown sockets.
 L(950,514,996,493,6,M.amber);L(1083,550,1034,567,6,M.amber);
 R(976,489,23,12,M.glass);R(1036,560,17,8,M.cyan);
 for(let [x,y,w] of [[695,656,91],[820,663,87],[1154,649,95],[1305,652,87]]){
   R(x,y,w,10,M.steel);R(x+14,y-16,14,15,M.blue);R(x+w-23,y-29,7,29,M.cyan);
 }
 // Twin outward gantries: nonmatching support/load paths and staggered suspended booms.
 L(474,704,512,243,19,M.steel);L(511,242,836,309,13,M.grate);
 L(485,402,668,279,9,M.pipe);L(553,252,567,399,9,M.slate);
 R(567,390,59,14,M.shield);R(583,405,24,30,M.amber);
 L(1598,722,1527,205,21,M.steel);L(1529,207,1182,258,11,M.grate);
 L(1544,333,1367,262,8,M.pipe);R(1476,391,68,14,M.shield);
 L(1501,403,1501,510,6,M.pipe);R(1490,509,24,30,M.cyan);
 // Native xenobiological shipping/assay installations: bounded passive hardware.
 P([[42,909],[42,812],[110,792],[174,811],[234,785],[300,812],[322,910]],M.basalt);
 for(let [x,y,w] of [[74,628,170],[124,727,159],[219,672,111]]){R(x,y,w,11,M.steel);R(x+11,y-24,12,23,M.slate);R(x+w-20,y-24,12,23,M.slate);}
 for(let [x,y,w,h] of [[90,560,120,59],[139,658,101,57],[229,610,78,50]]){
   R(x,y,w,9,M.shield);R(x+1,y+9,10,h,M.slate);R(x+w-12,y+9,10,h,M.slate);
   R(x+21,y+17,Math.max(20,w-44),15,M.glass);R(x+23,y+35,14,8,M.amber);
 }
 for(let [x,y] of [[91,775],[182,770],[257,759]]){R(x,y,40,9,M.steel);R(x+7,y-39,16,36,M.glass);R(x+13,y-51,8,12,M.cyan);}
 // East decontamination outpost built on rooted geological shelf.
 P([[1700,908],[1714,792],[1756,764],[1801,792],[1868,758],[1953,782],[2047,748],[2047,909]],M.basalt);
 for(let [x,y,w] of [[1667,633,177],[1764,704,171],[1888,624,151]]){
   R(x,y,w,11,M.steel);R(x+13,y-28,11,27,M.pipe);R(x+w-23,y-35,13,33,M.shield);}
 for(let [x,y,w,h] of [[1709,553,104,69],[1846,548,150,65],[1771,649,122,43]]){
   R(x,y,w,8,M.shield);R(x+4,y+8,9,h,M.slate);R(x+w-12,y+8,9,h,M.slate);
   R(x+21,y+20,Math.min(58,w-39),19,M.glass);R(x+24,y+49,21,5,M.cyan);
 }
 // Post-industrial wreckage is sparse and edit-friendly, not ubiquitous decoration.
 for(let [x,y] of [[566,760],[989,751],[1044,739],[1446,762]]){L(x,y,x+28,y-18,7,M.slate);R(x+29,y-26,15,8,M.amber);}
 // Three service wells give a physically open alternative to high dock flight.
 for(let [x,w,top] of [[222,107,788],[971,123,785],[1753,119,705]])R(x,top,w,996-top,0);
 // Bottom inspection stations below full-hull-safe service roof.
 // Deliberately keep the entire 50-cell-high basal service clear for all Midge envelopes.
 // Empty bays are reserved for later manual construction and scripted traffic.
 R(60,1005,1921,7,M.schist);
 // Contrasting upper intake and quarantine pylons remain open to the sky.
 L(159,557,207,904,10,M.pipe);L(1905,551,1948,900,11,M.steel);
 let tieCount=0;
 function tie(){
  let mark=new Int32Array(N),q=new Int32Array(N),parts=[{edge:true}],edges=new Map();
  for(let i=0;i<N;i++)if(g[i]&&!mark[i]){let id=parts.length,h=0,t=1,edge=false;q[0]=i;mark[i]=id;while(h<t){let a=q[h++],x=a%W,y=a/W|0;if(!x||x===W-1||!y||y===H-1)edge=true;for(let b of [a-W,a+W,x?a-1:-1,x<W-1?a+1:-1])if(b>=0&&b<N&&g[b]&&!mark[b]){mark[b]=id;q[t++]=b;}}parts.push({edge,count:t});}
  let owner=new Int32Array(N),origin=new Int32Array(N),dist=new Uint16Array(N),qq=new Int32Array(N),h=0,t=0;
  for(let i=0;i<N;i++)if(mark[i]){owner[i]=mark[i];origin[i]=i;qq[t++]=i;}
  while(h<t){let a=qq[h++],x=a%W,v=owner[a];for(let b of [a-W,a+W,x?a-1:-1,x<W-1?a+1:-1])if(b>=0&&b<N){
   if(!owner[b]){owner[b]=v;origin[b]=origin[a];dist[b]=dist[a]+1;qq[t++]=b;}
   else if(owner[b]!==v){let key=Math.min(v,owner[b])+":"+Math.max(v,owner[b]),len=dist[a]+dist[b]+1,z=edges.get(key);if(!z||len<z.len)edges.set(key,{a:origin[a],b:origin[b],oa:v,ob:owner[b],len});}}}
  let parent=new Int32Array(parts.length);for(let i=0;i<parts.length;i++)parent[i]=parts[i].edge?0:i;
  function root(a){while(parent[a]!==a){parent[a]=parent[parent[a]];a=parent[a];}return a;}
  let joins=0,max_span=0;for(let e of [...edges.values()].sort((a,b)=>a.len-b.len)){let a=root(e.oa),b=root(e.ob);if(a===b)continue;L(e.a%W,e.a/W|0,e.b%W,e.b/W|0,4,M.grate);parent[a]=b;joins++;max_span=Math.max(max_span,e.len);}
  for(let i=1;i<parts.length;i++)if(root(i)!==root(0))throw Error("Disconnected rock "+i);
  return {raw_components:parts.length-1,ties:joins,max_span};
 }


 
 const sites={
 "West intake arrival":[99,395],
 "West seed ledger":[255,449],
 "West reed filters":[141,505],
 "West upper portal":[356,343],
 "West drydock lip":[416,541],
 "Port crane crown":[535,157],
 "Port gantry flight":[704,338],
 "Port vessel overlook":[793,419],
 "Port open berth":[855,744],
 "Mid dock upper void":[1021,300],
 "Broken keel reveal":[1016,614],
 "Drydock lower workface":[1019,691],
 "East hull overlook":[1182,398],
 "Starboard gantry head":[1402,174],
 "East crane inspection":[1594,404],
 "East quarantine approach":[1661,477],
 "East sterile cabin":[1825,467],
 "East freight clearance":[1953,425],
 "Distant export sky":[2015,304],
 "West descent entrance":[275,851],
 "Central descent entrance":[1024,862],
 "East descent entrance":[1812,772],
 "West deep recovery":[467,971],
 "Central deep recovery":[1160,972],
 "East deep recovery":[1552,974],
 "Eastern purge berth":[1776,477]
 };
 const reconciled=tie();
 const ties={joins:tieCount+reconciled.ties,max_span:reconciled.max_span};
 let rect=[],prev=new Map(),hist={},area=0,replay=new Uint8Array(N),overlap=0;
 for(let y=0;y<H;y++){let next=new Map(),o=y*W;for(let x=0;x<W;){let v=g[o+x],s=x;while(x<W&&g[o+x]===v)x++;if(!v)continue;let key=s+":"+(x-s)+":"+v,i=prev.get(key);if(i===undefined){i=rect.length;rect.push([s,y,x-s,1,v]);}else rect[i][3]++;next.set(key,i);}prev=next;}
 for(let [x,y,w,h,v] of rect){hist[v]=(hist[v]||0)+w*h;area+=w*h;for(let j=y;j<y+h;j++){for(let i=x;i<x+w;i++)if(replay[j*W+i])overlap++;replay.fill(v,j*W+x,j*W+x+w);}}
 if(rect.length>32768||area>32000000||overlap)throw Error("Rect budget failure "+JSON.stringify({rectangles:rect.length,area,overlap}));
 for(let i=0;i<N;i++)if(g[i]!==replay[i])throw Error("Rectangle replay failure at "+i);
 let seen=new Uint8Array(N),q=new Int32Array(N),grounded=0,detached=0,components=0;
 for(let i=0;i<N;i++)if(g[i]&&!seen[i]){let h=0,t=1,edge=false;seen[i]=1;q[0]=i;while(h<t){let a=q[h++],x=a%W,y=a/W|0;if(!x||x===W-1||!y||y===H-1)edge=true;for(let b of [a-W,a+W,x?a-1:-1,x<W-1?a+1:-1])if(b>=0&&b<N&&g[b]&&!seen[b]){seen[b]=1;q[t++]=b;}}components++;if(edge)grounded+=t;else detached+=t;}
 if(detached)throw Error("Unrooted solids "+detached);
 function flood(w,h,box){let stride=W+1,I=new Int32Array((W+1)*(H+1));for(let y=1;y<=H;y++){let row=0,o=(y-1)*W;for(let x=1;x<=W;x++){let solid=g[o+x-1]||(box&&x-1>=box[0]&&x-1<box[2]&&y-1>=box[1]&&y-1<box[3]);row+=solid?1:0;I[y*stride+x]=I[(y-1)*stride+x]+row;}}
 let pass=new Uint8Array(N),vis=new Uint8Array(N),queue=new Int32Array(N);for(let y=h>>1;y<H-(h>>1);y++)for(let x=w>>1;x<W-(w>>1);x++){let a=x-(w>>1),b=y-(h>>1),c=a+w,d=b+h;if(!(I[d*stride+c]-I[d*stride+a]-I[b*stride+c]+I[b*stride+a]))pass[y*W+x]=1;}
 let s=sites["West intake arrival"],i=s[1]*W+s[0],hd=0,tl=0;if(!pass[i])throw Error("Spawn obstructed");queue[tl++]=i;vis[i]=1;
 while(hd<tl){let a=queue[hd++],x=a%W;for(let b of [a-W,a+W,x?a-1:-1,x<W-1?a+1:-1])if(b>=0&&b<N&&pass[b]&&!vis[b]){vis[b]=1;queue[tl++]=b;}}
 let bad=Object.entries(sites).filter(([n,p])=>!vis[p[1]*W+p[0]]).map(([name,p])=>({name,point:p}));return {envelope:[w,h],reachable_centres:tl,passed:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,bad};}
 const routes=[[19,15],[23,19],[31,27]].map(p=>flood(...p)),box=[1746,447,1806,510],obstruction=flood(31,27,box);
 if(routes.some(r=>r.bad.length)||obstruction.bad.length!==1||obstruction.bad[0].name!=="Eastern purge berth")throw Error("Full body or obstruction failure "+JSON.stringify({routes,obstruction}));
 const liquid_policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
 const setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:sites["West intake arrival"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
 const json=JSON.stringify(setup);if(json.length>1048576)throw Error("Serialized Setup >1MiB");
 return {g,json,rect,hist,area,grounded,components,ties,sites,routes,box,obstruction,crops:[["01-west-intake",24,445,552,432],["02-twin-gantry",460,180,1150,375],["03-sundered-ark",603,470,844,345],["04-east-quarantine",1575,440,473,445],["05-deep-service",70,830,1858,194]]};
}


function packageFiles(){
 const a=build(),images=[],records=[];
 for(const [name,x,y,w,h] of [["overview",0,0,2048,1024],...a.crops]){
   let bytes=png(a.g,x,y,w,h);images.push({name:name+".png",bytes});
   records.push({name:name+".png",origin:[x,y],extent:[w,h],bytes:bytes.length,sha256:sha256(bytes),pixel_parity:"DIRECT_FROM_EXACT_FINAL_GRID"});
 }
 const receipt={
  project:"CYBERSAND WORLD-GROUP XENOBIOME",family:"Mireward Levee Communes",sibling:5,
  role:"Sundered Spore Ark / Excavated Drydock Quarantine",
  seed:"mireward-sundered-spore-ark-drydock-261121-v1",
  map_base:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",
  engine_readonly_main:"f7e056c9b8791106e22f2d1c295043783d8a9701",
  donors:[{slug:"wide-harrow-mere-spore-dam",pr:64,head:"1202aea8d696e2bfecd7e4f3353c9738a9435858"},{slug:"wide-graftloom-slipway",pr:22,head:"b0d1e5216aabb9b5e009e599ffbffcec6fd8a657"},{slug:"wide-threnody-scar-foldwing-seedlift",pr:73,head:"00cb6b6b86b875d8b81cc387c711aa56f172d9dd"}],
  extent:[2048,1024],cell_count:2097152,material_histogram:a.hist,occupied_cells:a.area,grounded_cells:a.grounded,detached_cells:0,
  solid_components:a.components,physical_tethers:a.ties,lossless_rectangles:a.rect.length,source_rectangle_limit:32768,source_max_json_bytes:1048576,
  rectangle_work_cells:a.area,setup_bytes:a.json.length,plane_sha256:sha256(a.g),setup_sha256:sha256(a.json),literal_sites:a.sites,
  midge_full_hull_clearances:a.routes,obstruction:{box:a.box,blocked_site:"Eastern purge berth",result:a.obstruction},
  indexed_images:records,qualification:"CREATOR-STATIC-PASS",independent_reviews:"PENDING",native:"NATIVE-UNTESTED",pr_gate:"OPEN DRAFT/HOLD",
  caveat:"Static full-hull reachability is not dynamic gameplay or persistence verification."
 };
 const exemplar={
  schema_version:1,purpose:["human_editable_canvas","procedural_exemplar","scripted_setpiece_source"],
  family:"Mireward Levee Communes",lane:"Xenobiome / Frontier Clusters",
  map_role:"Sibling 05 — Sundered Spore Ark / Excavated Drydock Quarantine",
  anchor_donors:["wide-harrow-mere-spore-dam","wide-graftloom-slipway","wide-threnody-scar-foldwing-seedlift"],
  macro_topology:["drydock","mixed"],
  density_profile:"Dense opposed rooted intake and quarantine workyards flank one immense open drydock, divided half-vessel, sparse lower recovery",
  route_grammar:{primary:"West inoculation intake through open drydock vessel berth to east quarantine and freight",
   alternate:"Upper gantry overflight, broad broken-keel centre and three descent wells into a dry parallel service lane",
   recovery:"Blocking one eastern purge station preserves all other named flight sites and independent lower passage"},
  strong_motifs:["sundered two-piece seed ark","unequal opposed cantilever gantries","dry excavated cradle","rooted reed assay and xenoseed custody","triple service wells"],
  interesting_relationships:["Ship carcass retained in separated structurally unequal halves","Asymmetric gantry anchors carry different loads into two unequal basalt buttresses","Open lower industrial floor contrasts with a high flying crane network","Deep return permits alternate traversal despite a sterile berth obstruction"],
  authoring_affordances:[{site:"Keel fracture",center:[1016,614],use:"Bridge rebuild, reveal or destructible seam"},{site:"Central dry cradle",center:[1019,691],use:"Additional sample apparatus or NPC convoy"},{site:"Port overhead gantry",center:[704,338],use:"Reroutable suspended crossing"},{site:"Basal blank storage",center:[1160,972],use:"Expandable underground service room"}],
  setpiece_candidates:[{name:"Broken ark reveal",center:[1016,614],kind:"reveal vista / collapsible reconstruction",exits:"Port and starboard sky"},{name:"Quarantine berth isolation",center:[1776,477],kind:"holdout / purge gate",exits:"Exterior sky and east shaft"},{name:"Crane failure",center:[704,338],kind:"bridge-failure point",exits:"Open dock below"},{name:"Lower freight recovery",center:[1160,972],kind:"chase and reroute",exits:"Three vertical wells"}],
  procedural_exemplar_value:["Vessel drydock wall-to-gantry spatial relationships","Separated damaged hull halves as incomplete modular-part grammar","Opposed rooted asymmetric lifting supports","Parallel basal service lane connected by three shafts"],
  similarity_avoidance:"Unlike Mireward polder islands, descending filtering escarpment, roof-hung culture, or broken stationary annular commons, this world places a two-part damaged vessel into a huge excavated terrestrial drydock with opposed crane families and triple-well undercroft; no geometry copied.",
  diversity_axes:{macro_topology:["drydock"],altitude_grammar:["high_low_bypass","multi_strata"],density_cadence:["edge_dense_center_open"],route_structure:["parallel_lanes","branch_rejoin"],landmark_family:["vessel","crane"],support_form:["twin_pier","edge_rooted"],environment_relation:["damaged","biological"],incompleteness:["damaged","modular_append_zones"]},
  geometry_evidence:{literal_sites:a.sites,obstruction_box:a.box,material_grid_sha256:receipt.plane_sha256}
 };
 const readme=[
 "# Mireward Levee Communes — Sibling 05: Sundered Spore Ark / Excavated Drydock Quarantine","",
 "**NEW original 2048×1024 material-cell world · CREATOR STATIC-PASS · NATIVE-UNTESTED · OPEN Draft/HOLD.**","",
 "World-group: Xenobiome / Frontier Clusters. Sibling role: a damaged seed-vessel retrieval, assay and quarantine drydock. Opposed asymmetrical anchored gantries frame a two-part broken spore ark above a dry dockbed. Three carved wells link the massive central flight volume to an independently traversable low service passage. The break, unused storage, unfinished berth and broad empty workfaces are intentional authoring affordances, not unfinished mandatory art.","",
 "Anchor donors: Harrow Mere #64, Graftloom Slipway #22, Threnody Scar #73 at HEADs listed in receipt. Inherits founded basalt, materialized seed logistics, xenocustody apparatus and nonuniform crane engineering culture. No exact donor pixels, rectangle streams, paths, coordinates, names or layouts reused.",
 "New structural argument: drydock, damaged divided vessel, opposed gantries, edge-dense and centre-open industrial volume, lower parallel bypass rather than polder arch, cascade, roof suspension or radial ring.","",
 "## Source-static qualification","",
 "- Exact final 2,097,152 indexed material-ID cells; "+a.area+" occupied and "+a.grounded+" grounded; zero detached or invalid writes.",
 "- "+a.rect.length+" lossless disjoint in-bounds ordered Setup-v2 rectangles (source limit 32,768), JSON "+a.json.length+" bytes (source limit 1,048,576). Histogram and material plane SHA-256 "+receipt.plane_sha256+".",
 "- Exact conservative Midge centres at 19×15, 23×19, 31×27: "+a.routes.map(z=>z.passed+"/"+z.total).join(", ")+". Physical purge obstruction "+JSON.stringify(a.box)+" leaves "+a.obstruction.passed+"/"+a.obstruction.total+" destinations reachable.",
 "- Fixed seed "+receipt.seed+"; reproducible with node build.cjs; node build.cjs --verify tests committed bytes. Six indexed PNGs represent authentic full-grid and true 1:1 crops, no scaling.",
 "- Read-only CyberSand main "+receipt.engine_readonly_main+"; source limit acceptance is not installed/native admission. Godot/Workbench/CyberDemoBridge/Rapier actor movement, ticks, collision and save/reopen **NATIVE-UNTESTED**. Independent Art/Technical/Shepherd PENDING. Keep Draft/HOLD; do not merge or promote.",
 "",
 "## Authentic material-cell gallery","", "![Complete original material grid](./overview.png)","",
 ...images.slice(1).map(z=>"!["+z.name+"](./"+z.name+")"),""
 ].join("\n");
 return {a,images,receipt,exemplar,readme};
}
const fs=require("fs");const a=packageFiles();const files=[["setup.json",a.a.json+"\n"],["receipt.json",JSON.stringify(a.receipt,null,2)+"\n"],["exemplar.json",JSON.stringify(a.exemplar,null,2)+"\n"],["README.md",a.readme],...a.images.map(x=>[x.name,x.bytes])];for(let [name,d]of files){let b=Buffer.from(d),p=__dirname+"/"+name;if(process.argv.includes("--verify")){if(!fs.existsSync(p)||!fs.readFileSync(p).equals(b))throw Error("Byte mismatch "+name);}else fs.writeFileSync(p,b);}console.log(JSON.stringify({qualification:"CREATOR-STATIC-PASS",rectangles:a.a.rect.length,routes:a.a.routes.map(x=>x.passed),native:"NATIVE-UNTESTED"}));
