"use strict";
const BASE="99a166e7fcae45eb22be1740e9f33f62faccbcc7",ENGINE="69209acaffb34ebe18c45e19290b5976b7fb2c82",DONORS=[{"slug":"wide-threnody-scar-foldwing-seedlift","pr":73,"head":"00cb6b6b86b875d8b81cc387c711aa56f172d9dd"},{"slug":"wide-graftloom-slipway","pr":22,"head":"b0d1e5216aabb9b5e009e599ffbffcec6fd8a657"}];
function sha256(input){
 const a=typeof input==="string"?Uint8Array.from(input,c=>c.charCodeAt(0)):input,K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2],n=(a.length+72)&~63,b=new Uint8Array(n);b.set(a);b[a.length]=128;let bits=a.length*8;for(let i=0;i<8;i++){b[n-1-i]=bits&255;bits=Math.floor(bits/256);}let h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64),rot=(x,n)=>x>>>n|x<<(32-n);
 for(let o=0;o<n;o+=64){for(let j=0;j<16;j++){let i=o+j*4;w[j]=(b[i]<<24|b[i+1]<<16|b[i+2]<<8|b[i+3])>>>0;}for(let j=16;j<64;j++){let p=w[j-15],q=w[j-2];w[j]=(w[j-16]+(rot(p,7)^rot(p,18)^(p>>>3))+w[j-7]+(rot(q,17)^rot(q,19)^(q>>>10)))>>>0;}let [A,B,C,D,E,F,G,H]=h;for(let j=0;j<64;j++){let t1=(H+(rot(E,6)^rot(E,11)^rot(E,25))+((E&F)^(~E&G))+K[j]+w[j])>>>0,t2=((rot(A,2)^rot(A,13)^rot(A,22))+((A&B)^(A&C)^(B&C)))>>>0;H=G;G=F;F=E;E=(D+t1)>>>0;D=C;C=B;B=A;A=(t1+t2)>>>0;}let v=[A,B,C,D,E,F,G,H];for(let j=0;j<8;j++)h[j]=(h[j]+v[j])>>>0;}return h.map(n=>n.toString(16).padStart(8,"0")).join("");
}
function b64(bytes){const c="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",a=[];let s="";for(let i=0;i<bytes.length;i+=3){let x=bytes[i],y=bytes[i+1]||0,z=bytes[i+2]||0;s+=c[x>>2]+c[(x&3)<<4|y>>4]+(i+1<bytes.length?c[(y&15)<<2|z>>6]:"=")+(i+2<bytes.length?c[z&63]:"=");if(s.length>10000){a.push(s);s="";}}return a.join("")+s;}
function utf8(s){const o=[];for(const c of s){let n=c.codePointAt(0);if(n<128)o.push(n);else if(n<2048)o.push(192|(n>>6),128|(n&63));else if(n<65536)o.push(224|(n>>12),128|((n>>6)&63),128|(n&63));else o.push(240|(n>>18),128|((n>>12)&63),128|((n>>6)&63),128|(n&63));}return Uint8Array.from(o);}
function png(g,x0,y0,w,h){
 const be=n=>[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255],raw=new Uint8Array(h*(w+1));for(let y=0;y<h;y++)raw.set(g.subarray((y+y0)*2048+x0,(y+y0)*2048+x0+w),y*(w+1)+1);
 const rev=(v,n)=>{let a=0;while(n--){a=a<<1|v&1;v>>>=1;}return a;};
 function zip(raw){let out=[120,1],bits=0,nb=0;function wr(v,k){bits|=v<<nb;nb+=k;while(nb>=8){out.push(bits&255);bits>>>=8;nb-=8;}}function sym(v){let k,x;if(v<=143){x=v+48;k=8;}else if(v<=255){x=v+256;k=9;}else if(v<=279){x=v-256;k=7;}else{x=v-280+192;k=8;}wr(rev(x,k),k);}
 const lb=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],ex=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
 wr(3,3);for(let i=0;i<raw.length;){let r=1;while(i+r<raw.length&&r<258&&raw[i]===raw[i+r])r++;if(r>=4&&i>0&&raw[i]===raw[i-1]){let j=0;while(j<28&&lb[j+1]<=r)j++;sym(257+j);if(ex[j])wr(r-lb[j],ex[j]);wr(0,5);i+=r;}else sym(raw[i++]);}sym(256);if(nb)out.push(bits&255);let a=1,b=0;for(let v of raw){a=(a+v)%65521;b=(b+a)%65521;}out.push(...be((b<<16|a)>>>0));return Uint8Array.from(out);}
 function crc(a){let c=0xffffffff;for(let v of a){c^=v;for(let j=0;j<8;j++)c=c>>>1^(0xedb88320&-(c&1));}return(c^0xffffffff)>>>0;}
 function chunk(name,d){let b=new Uint8Array(d.length+12);b.set(be(d.length));b.set([...name].map(c=>c.charCodeAt(0)),4);b.set(d,8);b.set(be(crc(b.subarray(4,d.length+8))),d.length+8);return b;}
 let pal=new Uint8Array(132*3),cols={0:[8,11,18],49:[95,98,107],58:[119,123,128],62:[126,141,153],66:[74,85,93],68:[102,119,129],77:[55,243,228],79:[250,184,86],100:[54,56,61],101:[24,19,32],120:[156,210,220],129:[33,70,110],131:[168,171,177]};for(let [k,v] of Object.entries(cols))pal.set(v,Number(k)*3);
 let pieces=[Uint8Array.from([137,80,78,71,13,10,26,10]),chunk("IHDR",Uint8Array.from([...be(w),...be(h),8,3,0,0,0])),chunk("PLTE",pal),chunk("IDAT",zip(raw)),chunk("IEND",new Uint8Array())],b=new Uint8Array(pieces.reduce((n,v)=>n+v.length,0));let off=0;for(let v of pieces){b.set(v,off);off+=v.length;}return b;
}
function build(){
 const W=2048,H=1024,N=W*H,g=new Uint8Array(N),M={basalt:100,schist:101,slate:49,steel:62,grate:66,pipe:68,cyan:77,amber:79,glass:120,blue:129,shield:131};
 let rng=0x624ba721;function rand(){rng^=rng<<13;rng^=rng>>>17;rng^=rng<<5;return(rng>>>0)/4294967296;}
 function R(x,y,w,h,v){let a=Math.max(0,Math.round(x)),b=Math.min(W,Math.round(x+w)),c=Math.max(0,Math.round(y)),d=Math.min(H,Math.round(y+h));for(let j=c;j<d;j++)g.fill(v,j*W+a,j*W+b);}
 function L(x,y,X,Y,t,v){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,r=t/2,rr=r*r;for(let j=Math.max(0,Math.floor(Math.min(y,Y)-r));j<Math.min(H,Math.ceil(Math.max(y,Y)+r+1));j++)for(let i=Math.max(0,Math.floor(Math.min(x,X)-r));i<Math.min(W,Math.ceil(Math.max(x,X)+r+1));i++){let p=Math.max(0,Math.min(1,((i-x)*dx+(j-y)*dy)/(d||1)));if((i-x-p*dx)**2+(j-y-p*dy)**2<=rr)g[j*W+i]=v;}}
 function P(a,v){let lo=Math.max(0,Math.floor(Math.min(...a.map(p=>p[1])))),hi=Math.min(H-1,Math.ceil(Math.max(...a.map(p=>p[1]))));for(let y=lo;y<=hi;y++){let xs=[];for(let i=0;i<a.length;i++){let p=a[i],q=a[(i+1)%a.length];if((p[1]<=y&&q[1]>y)||(q[1]<=y&&p[1]>y))xs.push(p[0]+(y-p[1])*(q[0]-p[0])/(q[1]-p[1]));}xs.sort((x,y)=>x-y);for(let k=0;k+1<xs.length;k+=2)R(Math.ceil(xs[k]),y,Math.max(0,Math.floor(xs[k+1])-Math.ceil(xs[k])+1),1,v);}}

 // Geography is original: buried nested caverns, compact loops and thick excavated thresholds.
 P([[0,502],[166,444],[321,461],[536,409],[767,439],[954,390],[1120,465],[1351,398],[1547,453],[1792,439],[2048,501],[2048,1024],[0,1024]],M.basalt);
 R(0,967,2048,57,M.schist);R(0,1009,2048,15,M.basalt);
 for(let x=54;x<1970;x+=103){let y=423+Math.floor(22*rand());R(x,y,21,7,M.schist);}
 P([[54,559],[113,514],[322,511],[422,544],[446,615],[414,675],[85,680],[57,641]],0);
 P([[473,555],[538,482],[617,450],[838,475],[957,515],[942,611],[880,656],[493,658]],0);
 P([[994,589],[1048,533],[1115,508],[1353,516],[1454,569],[1449,681],[1034,680]],0);
 P([[1493,575],[1593,487],[1762,471],[1904,535],[1951,600],[1904,680],[1532,679]],0);
 R(67,696,1918,79,0);
 for(let [x,y,w,h] of [[217,622,94,160],[648,619,96,163],[1211,637,99,151],[1687,640,93,147]])R(x,y,w,h,0);
 R(407,605,111,65,0);R(912,612,125,69,0);R(1430,619,103,66,0);
 R(0,561,108,111,0);R(0,593,184,72,0);R(1927,612,121,97,0);
 // Recovery route A: short return with two entrances and a vacant excavation pocket.
 R(341,823,564,67,0);R(365,763,84,91,0);R(827,763,83,98,0);
 P([[480,882],[540,894],[633,887],[675,915],[646,936],[510,932]],0);R(527,859,64,75,0);
 // Recovery route B: offset lower level, separate from loop A.
 R(1114,842,653,69,0);R(1145,764,93,108,0);R(1696,761,87,123,0);
 P([[1385,892],[1451,881],[1540,894],[1585,940],[1538,965],[1377,962]],0);R(1449,894,68,63,0);
 // An incompletely excavated irregular high archive; deliberately NOT a fifth finished room.
 P([[529,372],[613,344],[765,371],[791,411],[750,441],[560,441]],0);R(638,415,67,60,0);
 // Receiving: keyed two-bay intake and specimen separation; physical solids are material cells.
 R(107,642,110,13,M.steel);R(112,608,15,35,M.shield);R(144,617,20,24,M.glass);R(176,621,36,21,M.blue);
 R(329,639,62,13,M.grate);R(340,616,17,21,M.cyan);R(372,615,12,24,M.amber);
 L(116,545,192,563,9,M.pipe);L(285,528,357,549,10,M.shield);
 // Assay: tall drum, human-sized workface, unlike spec analyzers, sparse ceiling hangers.
 R(541,628,112,14,M.steel);R(555,566,13,62,M.shield);R(582,585,52,41,M.glass);
 R(794,626,111,15,M.grate);R(805,582,21,42,M.blue);R(843,602,38,21,M.shield);
 L(581,500,615,542,12,M.pipe);L(862,524,880,573,9,M.pipe);
 R(737,485,17,56,M.shield);R(731,485,35,11,M.steel);R(752,495,11,30,M.cyan);
 // An unequal two-stage isolation seal with wall-embedded test cells.
 R(992,601,23,68,M.shield);R(1001,647,21,18,M.amber);R(1028,610,13,58,M.steel);
 R(1081,644,104,16,M.steel);R(1095,597,19,48,M.shield);R(1125,605,41,36,M.glass);
 R(1341,649,82,12,M.grate);R(1359,608,24,40,M.blue);R(1390,611,16,37,M.amber);
 R(1253,523,16,85,M.shield);R(1247,523,34,13,M.steel);
 R(1415,544,18,71,M.shield);R(1420,557,14,32,M.glass);
 // Staffed refuge: distinct bed-bank scale, medical viewing, overhead folded brace.
 R(1583,647,128,14,M.steel);R(1591,599,14,47,M.shield);R(1615,612,67,29,M.glass);
 R(1787,648,91,12,M.grate);R(1801,598,19,49,M.steel);R(1840,615,22,31,M.cyan);
 L(1581,539,1656,509,12,M.pipe);L(1806,513,1849,558,11,M.shield);
 // Eight small, intentionally asymmetric gateway piers; clear 31x27 shafts are wider than the piers.
 for(let [x,y] of [[209,668],[319,663],[640,658],[752,660],[1202,682],[1310,681],[1678,682],[1782,683]]){
  R(x,y,8,39,M.steel);R(x,y,16,7,M.shield);R(x+3,y-11,7,10,M.cyan);
 }
 // Dry service archaeology and human-edit sites.
 for(let [x,y,w] of [[468,846,66],[722,844,72],[1251,866,92],[1550,859,90]]){
  R(x,y,8,16,M.shield);R(x+13,y+2,w-28,7,M.grate);R(x+w-11,y,8,16,M.pipe);
 }
 L(498,839,521,867,7,M.pipe);L(1525,852,1554,877,6,M.shield);
 R(561,878,24,19,M.glass);
 R(1406,929,101,11,M.grate);R(1435,903,37,21,M.blue);
 for(let [x,y,w] of [[130,510,114],[572,459,127],[1101,520,112],[1616,493,129]]){
  L(x,y,x+w/2,y-22,7,M.schist);L(x+w/2,y-22,x+w,y+5,6,M.slate);
 }
 function tie(){
  let mark=new Int32Array(N),q=new Int32Array(N),parts=[{edge:true}],edges=new Map();
  for(let i=0;i<N;i++)if(g[i]&&!mark[i]){let id=parts.length,h=0,t=1,edge=false;q[0]=i;mark[i]=id;while(h<t){let a=q[h++],x=a%W,y=a/W|0;if(!x||x===W-1||!y||y===H-1)edge=true;for(let b of [a-W,a+W,x?a-1:-1,x<W-1?a+1:-1])if(b>=0&&b<N&&g[b]&&!mark[b]){mark[b]=id;q[t++]=b;}}parts.push({edge,count:t});}
  let owner=new Int32Array(N),origin=new Int32Array(N),dist=new Uint16Array(N),qq=new Int32Array(N),h=0,t=0;for(let i=0;i<N;i++)if(mark[i]){owner[i]=mark[i];origin[i]=i;qq[t++]=i;}
  while(h<t){let a=qq[h++],x=a%W,v=owner[a];for(let b of [a-W,a+W,x?a-1:-1,x<W-1?a+1:-1])if(b>=0&&b<N){if(!owner[b]){owner[b]=v;origin[b]=origin[a];dist[b]=dist[a]+1;qq[t++]=b;}else if(owner[b]!==v){let key=Math.min(v,owner[b])+":"+Math.max(v,owner[b]),len=dist[a]+dist[b]+1,z=edges.get(key);if(!z||len<z.len)edges.set(key,{a:origin[a],b:origin[b],oa:v,ob:owner[b],len});}}}
  let parent=new Int32Array(parts.length);for(let i=0;i<parts.length;i++)parent[i]=parts[i].edge?0:i;function root(a){while(parent[a]!==a){parent[a]=parent[parent[a]];a=parent[a];}return a;}
  let joins=0,max_span=0;for(let e of [...edges.values()].sort((a,b)=>a.len-b.len)){let a=root(e.oa),b=root(e.ob);if(a===b)continue;L(e.a%W,e.a/W|0,e.b%W,e.b/W|0,4,M.grate);parent[a]=b;joins++;max_span=Math.max(max_span,e.len);}for(let i=1;i<parts.length;i++)if(root(i)!==root(0))throw Error("Disconnected "+i);
  return {raw_components:parts.length-1,ties:joins,max_span};
 }
 const structural=tie();

 const sites={
 "Outer seed approach":[53,607],"Receiving clerk bay":[172,583],"Receiving freight latch":[371,597],
 "Receiving south hatch":[273,690],"Main west spine":[476,732],
 "Diagnostic observation booth":[682,550],"Diagnostic counter-a":[778,567],"Assay sterility wicket":[819,543],
 "Assay west threshold":[675,685],"Diagnostic deep passage":[923,731],
 "Isolation intake":[1085,575],"Isolation quarantine pocket":[1322,569],"Isolation eastern gate":[1336,579],
 "Sterile control floor":[1258,681],"Main east spine":[1484,731],
 "Refuge medical alcove":[1623,559],"Refuge courier bunks":[1765,588],"Refuge east exit":[1880,585],
 "Receiving lower drop":[403,803],"Dry loop A west":[604,851],"Dry loop A centre":[663,860],"Dry loop A east":[867,850],
 "Isolation lower drop":[1186,816],"Dry loop B west":[1370,862],"Dry loop B centre":[1471,873],"Dry loop B east":[1711,850],
 "Dry assay expansion":[610,913],"Dry archive cavity":[1518,908]
 };
 let rect=[],prev=new Map(),hist={},area=0,replay=new Uint8Array(N),overlap=0;
 for(let y=0;y<H;y++){let next=new Map(),o=y*W;for(let x=0;x<W;){let v=g[o+x],s=x;while(x<W&&g[o+x]===v)x++;if(!v)continue;let key=s+":"+(x-s)+":"+v,i=prev.get(key);if(i===undefined){i=rect.length;rect.push([s,y,x-s,1,v]);}else rect[i][3]++;next.set(key,i);}prev=next;}
 for(let [x,y,w,h,v]of rect){hist[v]=(hist[v]||0)+w*h;area+=w*h;for(let j=y;j<y+h;j++){for(let i=x;i<x+w;i++)if(replay[j*W+i])overlap++;replay.fill(v,j*W+x,j*W+x+w);}}
 if(rect.length>32768||area>32000000||overlap)throw Error("Rect budget "+JSON.stringify({rectangles:rect.length,area,overlap}));
 for(let i=0;i<N;i++)if(g[i]!==replay[i])throw Error("Replay mismatch at "+i);
 let seen=new Uint8Array(N),q=new Int32Array(N),grounded=0,detached=0,components=0;
 for(let i=0;i<N;i++)if(g[i]&&!seen[i]){let h=0,t=1,edge=false;seen[i]=1;q[0]=i;while(h<t){let a=q[h++],x=a%W,y=a/W|0;if(!x||x===W-1||!y||y===H-1)edge=true;for(let b of [a-W,a+W,x?a-1:-1,x<W-1?a+1:-1])if(b>=0&&b<N&&g[b]&&!seen[b]){seen[b]=1;q[t++]=b;}}components++;if(edge)grounded+=t;else detached+=t;}
 if(detached)throw Error("Detached "+detached);
 function flood(w,h,box,restricted,startName){
  const stride=W+1,I=new Int32Array((W+1)*(H+1));for(let y=1;y<=H;y++){let row=0,o=(y-1)*W;for(let x=1;x<=W;x++){let solid=g[o+x-1]||(box&&x-1>=box[0]&&x-1<box[2]&&y-1>=box[1]&&y-1<box[3]);row+=solid?1:0;I[y*stride+x]=I[(y-1)*stride+x]+row;}}
  let pass=new Uint8Array(N),vis=new Uint8Array(N),queue=new Int32Array(N);
  for(let y=h>>1;y<H-(h>>1);y++)for(let x=w>>1;x<W-(w>>1);x++){let a=x-(w>>1),b=y-(h>>1),c=a+w,d=b+h;if(!(I[d*stride+c]-I[d*stride+a]-I[b*stride+c]+I[b*stride+a])&&(!restricted||restricted(x,y)))pass[y*W+x]=1;}
  let s=restricted?sites[startName||"Dry loop A west"]:sites["Outer seed approach"],i=s[1]*W+s[0],hd=0,tl=0;
  if(!pass[i])throw Error("Spawn obstructed "+JSON.stringify({w,h,s,restricted:!!restricted}));
  queue[tl++]=i;vis[i]=1;while(hd<tl){let a=queue[hd++],x=a%W;for(let b of [a-W,a+W,x?a-1:-1,x<W-1?a+1:-1])if(b>=0&&b<N&&pass[b]&&!vis[b]){vis[b]=1;queue[tl++]=b;}}
  let check=restricted?Object.fromEntries(Object.entries(sites).filter(([n])=>n.startsWith(startName&&startName.includes("B")?"Dry loop B":"Dry loop A"))):sites;
  let bad=Object.entries(check).filter(([n,p])=>!vis[p[1]*W+p[0]]).map(([name,p])=>({name,point:p,occupied:g[p[1]*W+p[0]]}));
  return {envelope:[w,h],reachable_centres:tl,passed:Object.keys(check).length-bad.length,total:Object.keys(check).length,bad};
 }

 const routes=[[19,15],[23,19],[31,27]].map(p=>flood(...p));
 const box=[800,524,840,562],obstruction=flood(31,27,box);
 const loopA=flood(31,27,null,(x,y)=>x>=355&&x<=919&&y>=804&&y<=912,"Dry loop A west");
 const loopB=flood(31,27,null,(x,y)=>x>=1125&&x<=1791&&y>=804&&y<=920,"Dry loop B west");
 if(routes.some(r=>r.bad.length)||obstruction.bad.length!==1||obstruction.bad[0].name!=="Assay sterility wicket"||loopA.bad.length||loopB.bad.length)throw Error("Route failure "+JSON.stringify({routes,obstruction,loopA,loopB}));
 const liquid_policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
 const setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:sites["Outer seed approach"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
 const json=JSON.stringify(setup);if(json.length>1048576)throw Error("Setup too big");
 return {g,json,rect,hist,area,grounded,components,structural,sites,routes,box,obstruction,loopA,loopB,crops:[["01-receiving-vault",35,479,452,305],["02-diagnostic-lab",480,420,488,351],["03-sterile-isolation",992,493,485,282],["04-refuge-croft",1489,454,559,338],["05-two-short-recovery-loops",305,750,1496,241]]};
}

function packageFiles(){
 const a=build(),images=[],records=[];
 for(const [name,x,y,w,h] of [["overview",0,0,2048,1024],...a.crops]){
  const bytes=png(a.g,x,y,w,h);images.push({name:name+".png",bytes});
  records.push({name:name+".png",origin:[x,y],extent:[w,h],bytes:bytes.length,sha256:sha256(bytes),pixel_parity:"DIRECT_FROM_FINAL_GRID"});
 }
 const receipt={
  project:"CYBERSAND WORLD-GROUP XENOBIOME",
  family:"Cinderfold Seed Courier Districts",sibling:3,role:"Buried Assay Interchange / Seed-Vault Croft",
  seed:"cinderfold-buried-assay-interchange-261121-v1-0x624ba721",
  map_base:BASE,engine_readonly_main:ENGINE,donors:DONORS,
  extent:[2048,1024],cell_count:2097152,material_histogram:a.hist,
  occupied_cells:a.area,grounded_cells:a.grounded,detached_cells:0,
  solid_components:a.components,physical_tethers:a.structural,
  lossless_rectangles:a.rect.length,source_rectangle_limit:32768,source_max_json_bytes:1048576,
  rectangle_work_cells:a.area,setup_bytes:a.json.length,
  plane_sha256:sha256(a.g),setup_sha256:sha256(a.json),
  literal_sites:a.sites,midge_full_hull_clearances:a.routes,
  obstruction:{box:a.box,blocked_site:"Assay sterility wicket",result:a.obstruction},
  two_restricted_short_returns:{western:a.loopA,eastern:a.loopB},
  indexed_images:records,qualification:"CREATOR-STATIC-PASS",independent_reviews:"PENDING",
  native:"NATIVE-UNTESTED",pr_gate:"OPEN DRAFT/HOLD",
  caveat:"Full-body static free-centre routes are not actual native Rapier movement, simulation ticks or persistence."
 };
 const exemplar={
  schema_version:1,purpose:["human_editable_canvas","procedural_exemplar","scripted_setpiece_source"],
  family:"Cinderfold Seed Courier Districts",lane:"Xenobiome / Frontier Clusters",
  map_role:"Sibling 03 - Buried Assay Interchange / Seed-Vault Croft",
  anchor_donors:["wide-threnody-scar-foldwing-seedlift","wide-graftloom-slipway"],
  macro_topology:["nested_cavities","corridor"],
  density_profile:"Dense irregular roof-enclosed intake, laboratory, quarantine and refuge inside a thick geological mass. Vast sparse exterior and two largely vacant underground relief pockets.",
  route_grammar:{
   primary:"An entered four-cell intake, diagnosis, isolation, refuge network over a continuous rock-enclosed service spine",
   alternate:"Two independent short branch-rejoin dry service routes, one under receiving and diagnosis, another under quarantine and refuge",
   recovery:"Separate lower loops admit 31x27 full hulls; a physical diagnostic wicket obstruction leaves all other literal stations reachable"
  },
  strong_motifs:["nested unequal rock-cut workfaces","real unlike receiving, diagnostic and isolation equipment at human scale","buried xenoseed medical refuge","asymmetric folded-brace geological ridge","two short independently usable below-grade return corridors","unfinished acoustic excavation"],
  interesting_relationships:[
   "Unlike the aerial trestles, four chambers occupy a single continuous mass but use different interior proportions and threshold geometry",
   "Two small return branches connect pairs of distant chambers without occupying the whole canvas underground",
   "The intake, assay, isolation and refuge have distinct large mechanical interfaces, not identical palettes"
  ],
  authoring_affordances:[
   {site:"Unfinished ridge archive",center:[683,386],use:"Excavate a new specimen observatory"},
   {site:"Receiving east margin",center:[371,597],use:"Staffed freight encounter or extra sample racks"},
   {site:"Assay chamber",center:[682,550],use:"Enlarge diagnostic machine or trigger a later scripted sequence"},
   {site:"Under-rock eastern loop",center:[1471,873],use:"Construct a reroutable maintenance/evacuation branch"}
  ],
  setpiece_candidates:[
   {name:"Cold courier arrival",center:[53,607],kind:"arrival and NPC encounter",exits:"Western exterior and interior receiving room"},
   {name:"Sample drum activation",center:[682,550],kind:"machine activation",exits:"Room side passage and service spine"},
   {name:"Quarantine wicket",center:[819,543],kind:"holdout or seal",exits:"Assay loft and lower branch-rejoin circulation"},
   {name:"Eastern service recovery",center:[1471,873],kind:"chase or controlled excavation",exits:"Two separate maintenance-loop mouths"}
  ],
  procedural_exemplar_value:[
   "Thick geological envelope over Midge-entered multi-function chambers",
   "Compact branch/rejoin loops as small reusable authoring modules",
   "Nonnatural mechanical fittings rooted into biologically interpreted cliff strata",
   "Unfinished chambers and sockets intentionally left for manual and SWARM/GENTEK authoring"
  ],
  similarity_avoidance:"Unlike Cinderfold Sibling 01 open gabled post sheds or Sibling 02 airy braided two-level trestles, this is an almost entirely cliff-embedded nested-cavity quarter with separate short low-level returns.",
  diversity_axes:{
   macro_topology:["nested_cavities","corridor"],
   altitude_grammar:["dual_level"],
   density_cadence:["clustered"],
   route_structure:["branch_rejoin"],
   landmark_family:["gate"],
   support_form:["cliff_embedded","edge_rooted"],
   environment_relation:["geological","biological"],
   incompleteness:["excavation","editable_gaps"]
  },
  geometry_evidence:{literal_sites:a.sites,obstruction_box:a.box,plane_sha256:receipt.plane_sha256}
 };
 const readme=[
 "# Cinderfold Seed Courier Districts - Sibling 03: Buried Assay Interchange / Seed-Vault Croft","",
 "**Original 2048x1024 material-cell canvas. CREATOR SOURCE-STATIC PASS. NATIVE-UNTESTED. OPEN Draft/HOLD.**","",
 "World-group: Xenobiome / Frontier Clusters. Role: inhabited, geology-embedded xenoseed intake, diagnostics, isolation and staffed refuge, with two short looped lower-service alternatives.",
 "Donor anchors (read-only): Threnody Scar #73 @ "+DONORS[0].head+" and Graftloom Slipway #22 @ "+DONORS[1].head+". Only material palette, seeded-sample engineering culture and folded brace language inherited; no donor geometry, pixels, routes or rectangle streams.",
 "New structural idea: deeply roof-enclosed and uneven interlocking rooms, separate 31x27-safe floor penetrations, thick rock thresholds, two NON-full-width loops, and preserved vacant upper excavation. Distinct from both Cinderfold 01 open sheds and 02 aerial trestles.","",
 "## Source qualification","",
 "- Full material grid: 2097152 cells, "+a.area+" occupied and "+a.grounded+" grounded, zero detached, replayed rectangular encoding exact.",
 "- Setup-v2: "+a.rect.length+" ordered, legal, disjoint rectangles / 32768, "+a.json.length+" JSON bytes / 1048576; rectangle work "+a.area+" / 32000000.",
 "- Midge exact full-hull static point routes at 19x15, 23x19, 31x27: "+a.routes.map(r=>r.passed+"/"+r.total).join(" | ")+". No nearest-point substitutions.",
 "- A literal blocked assay wicket leaves "+a.obstruction.passed+"/"+a.obstruction.total+" sites; two separate restricted lower loops "+a.loopA.passed+"/"+a.loopA.total+" and "+a.loopB.passed+"/"+a.loopB.total+" for 31x27.",
 "- Deterministic node build.cjs generator recreates full indexed PNG overview and five exact material-cell crops, setup.json, receipt.json, exemplar.json and README.md; use node build.cjs --verify to compare output bytes.",
 "- Source SHA-256 of full material grid: "+receipt.plane_sha256+".","",
 "## Actual engine truth","",
 "Accepted CyberSand main "+ENGINE+" read-only authority. Reference repository baseline "+BASE+". Godot/Workbench/CyberDemoBridge/Rapier movement, collisions, ticks and cold save/reopen NATIVE-UNTESTED; independent Art/Technical/Shepherd current-HEAD reviews pending.","",
 "## Authentic material-ID overview and true 1:1 district crops","",
 "![Complete original 2048x1024 grid](./overview.png)",
 ...images.slice(1).map(x=>"!["+x.name+"](./"+x.name+")"),"",
 "Intentionally unfinished ridge annex and service pockets are corpus authoring opportunities, not technical qualification defects. Do not merge or Ready promote without owner approval."
 ].join("\n");
 return {a,images,receipt,exemplar,readme};
}

const fs=require("fs"),out=packageFiles();
const files=[["setup.json",out.a.json+"\n"],["receipt.json",JSON.stringify(out.receipt,null,2)+"\n"],["exemplar.json",JSON.stringify(out.exemplar,null,2)+"\n"],["README.md",out.readme],...out.images.map(x=>[x.name,x.bytes])];
for(const [name,d] of files){
 let b=Buffer.from(d),p=__dirname+"/"+name;
 if(process.argv.includes("--verify")){if(!fs.existsSync(p)||!fs.readFileSync(p).equals(b))throw Error("Mismatch "+name);}
 else fs.writeFileSync(p,b);
}
console.log(JSON.stringify({pass:true,rectangles:out.a.rect.length,sites:out.a.routes.map(r=>r.passed),native:"NATIVE-UNTESTED"}));
