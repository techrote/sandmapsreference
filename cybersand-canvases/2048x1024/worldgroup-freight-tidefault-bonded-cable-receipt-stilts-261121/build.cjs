"use strict";
const lib=(function factory(){
"use strict";
const W=2048,H=1024,N=W*H,SEED=0x84CD719,IDS=[0,100,58,62], M={AIR:0,ROCK:100,WALL:58,STEEL:62};
function utf8(s){let b=[];for(let i=0;i<s.length;i++){let c=s.charCodeAt(i);if(c<128)b.push(c);else if(c<2048)b.push(192|c>>6,128|c&63);else if(c>=55296&&c<56320&&i+1<s.length){let d=s.charCodeAt(++i),v=65536+((c-55296)<<10)+(d-56320);b.push(240|v>>18,128|v>>12&63,128|v>>6&63,128|v&63);}else b.push(224|c>>12,128|c>>6&63,128|c&63);}return new Uint8Array(b);}
function sha256(dat){const k=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2],r=(x,n)=>x>>>n|x<<32-n;let l=dat.length,q=new Uint8Array(Math.ceil((l+9)/64)*64);q.set(dat);q[l]=128;let bits=l*8;for(let j=0;j<8;j++)q[q.length-1-j]=Math.floor(bits/2**(8*j))&255;let h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],v=new Uint32Array(64);for(let i=0;i<q.length;i+=64){for(let j=0;j<16;j++){let p=i+j*4;v[j]=(q[p]<<24|q[p+1]<<16|q[p+2]<<8|q[p+3])>>>0;}for(let j=16;j<64;j++){let a=v[j-15],b=v[j-2];v[j]=(v[j-16]+(r(a,7)^r(a,18)^a>>>3)+v[j-7]+(r(b,17)^r(b,19)^b>>>10))>>>0;}let a=h[0],b=h[1],c=h[2],d=h[3],e=h[4],f=h[5],g=h[6],z=h[7];for(let j=0;j<64;j++){let t1=(z+(r(e,6)^r(e,11)^r(e,25))+(e&f^~e&g)+k[j]+v[j])>>>0,t2=((r(a,2)^r(a,13)^r(a,22))+(a&b^a&c^b&c))>>>0;z=g;g=f;f=e;e=d+t1>>>0;d=c;c=b;b=a;a=t1+t2>>>0;}h=[h[0]+a>>>0,h[1]+b>>>0,h[2]+c>>>0,h[3]+d>>>0,h[4]+e>>>0,h[5]+f>>>0,h[6]+g>>>0,h[7]+z>>>0];}return h.map(x=>x.toString(16).padStart(8,"0")).join("");}
function be(n){return[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255];}
function crc(b){let c=0xffffffff;for(let i=0;i<b.length;i++){c^=b[i];for(let j=0;j<8;j++)c=(c>>>1)^(0xedb88320&-(c&1));}return(c^0xffffffff)>>>0;}
function concat(parts){let a=new Uint8Array(parts.reduce((v,z)=>v+z.length,0)),p=0;for(let z of parts){a.set(z,p);p+=z.length;}return a;}
function chunk(t,d){let b=new Uint8Array(d.length+12);b.set(be(d.length),0);for(let j=0;j<4;j++)b[4+j]=t.charCodeAt(j);b.set(d,8);b.set(be(crc(b.subarray(4,8+d.length))),8+d.length);return b;}
function zipStore(raw){let b=[new Uint8Array([120,1])],p=0,s1=1,s2=0;while(p<raw.length){let n=Math.min(65535,raw.length-p),last=p+n===raw.length;let h=new Uint8Array([last?1:0,n&255,n>>>8&255,(~n)&255,(~n)>>>8&255]);b.push(h,raw.subarray(p,p+n));for(let i=p;i<p+n;i++){s1=(s1+raw[i])%65521;s2=(s2+s1)%65521;}p+=n;}b.push(new Uint8Array(be(((s2<<16)|s1)>>>0)));return concat(b);}
function png(g,rect){let [x0,y0,w,h]=rect,row=(w+3)>>2,raw=new Uint8Array((row+1)*h),idx=new Uint8Array(256);idx[100]=1;idx[58]=2;idx[62]=3;for(let y=0;y<h;y++)for(let x=0;x<w;x++)raw[y*(row+1)+1+(x>>2)]|=idx[g[(y0+y)*W+x0+x]]<<(6-2*(x&3));const pal=new Uint8Array([10,16,26,65,60,69,149,151,157,88,158,190]),txt=utf8("MaterialIDs\0palette_index=0:Empty,1:100_Basalt,2:58_HardWall,3:62_StructuralSolid");return concat([new Uint8Array([137,80,78,71,13,10,26,10]),chunk("IHDR",new Uint8Array([...be(w),...be(h),2,3,0,0,0])),chunk("PLTE",pal),chunk("tEXt",txt),chunk("IDAT",zipStore(raw)),chunk("IEND",new Uint8Array(0))]);}
function verifyPng(g,rect,p){const [x0,y0,w,h]=rect;let o=8,idat=null;let total=0;while(o<p.length){let n=(p[o]<<24|p[o+1]<<16|p[o+2]<<8|p[o+3])>>>0,t=String.fromCharCode(p[o+4],p[o+5],p[o+6],p[o+7]);if(crc(p.subarray(o+4,o+8+n))!==((p[o+n+8]<<24|p[o+n+9]<<16|p[o+n+10]<<8|p[o+n+11])>>>0))throw Error("PNG CRC "+t);if(t==="IDAT")idat=p.subarray(o+8,o+8+n);if(t==="IEND")total++;o+=12+n;}if(total!==1||o!==p.length||!idat)throw Error("PNG structure");let z=idat,pos=2,parts=[],a=1,b=0;while(true){let mark=z[pos++],n=z[pos]|z[pos+1]<<8,inv=z[pos+2]|z[pos+3]<<8;pos+=4;if((n^inv)!==65535||(mark&6)!==0)throw Error("zlib stored block");parts.push(z.subarray(pos,pos+n));for(let i=pos;i<pos+n;i++){a=(a+z[i])%65521;b=(b+a)%65521;}pos+=n;if(mark&1)break;}let ad=(z[pos]<<24|z[pos+1]<<16|z[pos+2]<<8|z[pos+3])>>>0;if(ad!==(((b<<16)|a)>>>0))throw Error("PNG Adler");let raw=concat(parts),row=(w+3)>>2;if(raw.length!==(row+1)*h)throw Error("PNG raw length");let map=IDS;for(let y=0;y<h;y++){let off=y*(row+1);if(raw[off]!==0)throw Error("PNG filter");for(let x=0;x<w;x++){let val=(raw[off+1+(x>>2)]>>(6-2*(x&3)))&3;if(map[val]!==g[(y+y0)*W+x0+x])throw Error("PNG pixel "+x+","+y);}}return w*h;}
function base64(a){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",out=[];for(let i=0;i<a.length;i+=3){let n=(a[i]<<16)|((a[i+1]||0)<<8)|(a[i+2]||0);out.push(t[n>>>18&63],t[n>>>12&63],i+1<a.length?t[n>>>6&63]:"=",i+2<a.length?t[n&63]:"=");}return out.join("");}
function generate(){




const g=new Uint8Array(N),sites={
"West beacon ingress":[105,530],"Quayside tally":[310,530],
"Suspended receipt stage":[515,530],"Transfer hook approach":[710,530],
"West sealed ledger":[950,530],"Overhead cargo exchange":[1160,530],
"Interlocking customs":[1370,530],"Quarantine handoff":[1610,530],
"Outer signal dispatch":[1930,530],
"West signal lookout":[205,292],"West cable watch":[645,292],
"Midspan wind monitor":[1045,292],"East signal crossing":[1490,292],
"Departure lantern":[1880,292],
"West berth inspection":[303,690],"Winch operator booth":[525,690],
"Axle-and-trolley service":[775,690],"Transfer tally room":[1040,690],
"Bonded short-stay receiver":[1280,690],"Inhabited tariff ward":[1550,690],
"Damaged launch relay":[1830,690],
"West return sluice":[205,835],"Suspension hydraulics":[675,835],
"Cargo retrieval cellar":[1110,835],"Deep customs escape":[1575,835],
"Emergency pier recovery":[1890,835]};
function R(x,y,w,h,m){x=Math.max(0,Math.floor(x));y=Math.max(0,Math.floor(y));w=Math.max(0,Math.ceil(w));h=Math.max(0,Math.ceil(h));if(x>=W||y>=H)return;for(let yy=y;yy<Math.min(H,y+h);yy++)g.fill(m,yy*W+x,yy*W+Math.min(W,x+w));}
function L(x,y,X,Y,t=8,m=M.STEEL){let dx=X-x,dy=Y-y,dist=Math.hypot(dx,dy),rr=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-rr));yy<Math.min(H,Math.ceil(Math.max(y,Y)+rr));yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-rr));xx<Math.min(W,Math.ceil(Math.max(x,X)+rr));xx++){let s=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(dist*dist||1)));if((xx-x-s*dx)**2+(yy-y-s*dy)**2<=rr*rr)g[yy*W+xx]=m;}}
const B=(...a)=>R(...a,M.ROCK),C=(...a)=>R(...a,M.WALL),St=(...a)=>R(...a,M.STEEL),V=(...a)=>R(...a,M.AIR);
const line=(x,y,X,Y,t=8,m=M.STEEL)=>L(x,y,X,Y,t,m);
/* Tidefault sibling 04: outer signal-rack stilts. Original material cells.
   Seven staggered founded pier spines support cargo and inhabited service
   islands, rather than continuous warehouses or a central excavation.
   Traversable void is deliberately much larger than the material structures. */
B(0,924,W,100);
B(0,886,270,38); B(320,900,230,24); B(640,905,240,19);
B(1020,895,310,29); B(1410,897,290,27); B(1770,884,278,40);
C(0,919,W,6);
/* Deep separate returns and dry emergency chambers. */
V(58,781,1930,107);
for(const [x,w] of [[135,188],[438,218],[765,207],[1090,220],[1450,210],[1805,184]]){
  B(x,882,w,42);V(x+18,812,w-39,66);
  St(x+19,871,w-44,14);
}
/* Seven positively grounded, asymmetric load-bearing pylon stems. */
for(const [x,top,width] of [
[143,372,28],[407,460,24],[626,355,29],
[895,474,25],[1204,345,30],[1518,445,29],[1873,368,32]]){
  C(x,top,width,925-top);
  St(x-18,903,width+38,14);
}
/* Unequal cantilevered silhouettes and engineering culture. */
line(158,374,337,297,17,M.WALL);
line(642,359,808,280,19,M.WALL);
line(1220,349,1363,282,20,M.WALL);
line(1533,451,1783,322,19,M.WALL);
line(1893,370,1966,294,15,M.WALL);
St(148,369,230,15);St(611,350,236,16);
St(1160,338,218,17);St(1508,441,258,17);
St(1869,360,147,15);
/* Paired load-bearing crane booms at unlike elevations, no giant central frame. */
line(235,373,417,465,13,M.STEEL);
line(676,356,836,473,14,M.STEEL);
line(1172,342,1000,468,13,M.STEEL);
line(1640,444,1811,377,13,M.STEEL);
for(const [x,y,reach] of [[335,301,92],[788,288,101],[1350,286,104],[1761,325,113]]){
  St(x,y,reach,12);St(x+Math.round(reach*.5),y+9,11,105);
  St(x+reach-31,y+114,61,16);
  /* Each hoist visibly ends at a framed, nonfunctional cargo load. */
  C(x+reach-27,y+134,47,28);V(x+reach-20,y+139,30,12);
}
/* Distinct west entry customs and receipt; concrete room shells with side entry. */
C(102,607,308,18);C(103,619,21,142);C(388,622,21,140);C(104,749,303,17);
V(98,660,28,60);V(386,659,28,60);
St(141,729,84,13);St(236,713,128,17);
C(273,669,88,36);V(282,680,60,17);
St(262,653,13,47);St(349,653,12,47);
St(176,580,263,16);St(184,564,14,27);
line(216,583,310,648,12,M.STEEL);
St(334,623,84,16);
/* West straddle winch: two offset supports, loaded trolley and operator booth. */
St(445,584,373,14);St(463,592,13,40);St(796,593,16,53);
line(467,594,623,460,12,M.WALL);
line(800,596,635,458,12,M.WALL);
St(565,460,154,16);St(629,476,17,71);
C(608,550,61,34);V(617,558,42,14);
C(469,644,171,17);C(470,658,15,107);C(622,659,17,104);C(470,750,170,16);
V(466,677,24,58);V(619,677,24,58);
St(500,728,106,13);C(535,688,48,30);V(541,693,34,18);
/* The central region is a perforated exchange of interleaved narrow beam decks.
   Two distinct loads move conceptually left-to-right; no copied tipper geometry. */
St(873,594,254,16);C(887,608,20,158);C(1106,609,20,155);
St(902,746,204,16);
V(883,677,27,62);V(1104,672,26,63);
St(926,727,74,13);St(1020,720,74,16);
C(959,668,54,31);V(968,673,36,20);
St(964,564,119,15);St(998,542,14,35);
line(947,565,875,489,12,M.STEEL);
line(1086,570,1198,448,12,M.STEEL);
St(1160,448,104,13);C(1190,461,48,29);V(1199,467,28,13);
/* East bounded bonded-receiver rooms, distinguishable physical transactions. */
C(1216,615,206,16);C(1218,630,19,134);C(1404,630,18,134);C(1217,752,205,15);
V(1214,664,28,58);V(1402,665,26,54);
St(1254,725,119,14);St(1280,664,16,60);St(1365,681,12,44);
C(1283,639,77,11);St(1292,650,8,24);
C(1452,611,271,19);C(1453,626,22,139);C(1701,628,23,136);
C(1453,750,273,16);V(1450,664,29,57);V(1697,664,28,58);
St(1487,727,80,13);St(1584,716,92,14);
C(1576,657,80,34);V(1588,664,55,20);
St(1538,584,195,15);St(1550,568,14,30);
St(1699,595,84,14);
/* Damaged outer lighthouse pier / abandoned flight-release assembly. */
C(1774,620,181,18);C(1775,637,18,126);C(1938,639,17,123);
C(1775,752,182,15);V(1773,662,23,55);V(1935,659,26,61);
St(1807,732,101,13);C(1840,689,43,28);V(1848,698,26,14);
line(1838,596,1938,639,10,M.STEEL);
line(1939,627,2007,579,10,M.STEEL);
St(1931,554,80,11);
/* Deep hydromechanical service bays, founded and traversable. */
for(const [x,w] of [[105,170],[454,194],[801,164],[1065,160],[1460,153],[1805,155]]){
  St(x,890,w,12);C(x+19,880,13,16);St(x+w-26,869,14,22);
}
for(const [x,y] of [[178,836],[660,836],[1110,833],[1522,837],[1870,836]]){
  St(x-28,y+38,68,11);C(x-7,y+14,14,23);
}
/* Distinct joined cable signatures. Physically rooted in tall pylons. */
line(151,388,414,475,6,M.STEEL);
line(415,469,629,372,6,M.STEEL);
line(633,361,897,487,6,M.STEEL);
line(905,481,1207,358,6,M.STEEL);
line(1220,352,1519,462,6,M.STEEL);
line(1531,446,1872,388,6,M.STEEL);
/* Cargo receivers below cables; real material frames/short transfer aprons. */
for(const [x,y] of [[296,476],[755,489],[1269,466],[1669,499]]){
  St(x,y,112,12);St(x+14,y-25,11,25);
  C(x+53,y+13,45,28);V(x+62,y+19,27,12);
}
/* Authored exact human/Midge destinations are deliberate clear cells; 
   preserve room thresholds and the nonfurnished central flight domain. */
/* Real physical entry: irregular overhead lift slots and founded emergency
   hatches link the separately entered customs rooms to traversable sky. */
for(const [x,y,w,h] of [
  [269,224,82,505],[480,224,90,503],[684,225,77,411],
  [743,223,57,505],[918,225,90,510],[1135,225,65,343],
  [1328,223,86,415],[1569,225,92,512],
  [1690,548,53,194],[1909,537,49,210],
  [175,714,88,164],[649,405,72,472],[1077,714,84,170],
  [1530,707,91,171],[1847,703,80,181]
])V(x,y,w,h);for(const [x,y] of Object.values(sites))V(x-34,y-30,69,61);

// Remove genuinely ungrounded decorator fragments, never retain false hanging
// "solid" machinery unsupported by any connected load path.
let seen=new Uint8Array(N),q=new Int32Array(N),front=0,back=0;
for(let x=0;x<W;x++){let n=(H-1)*W+x;if(g[n]&&!seen[n]){seen[n]=1;q[back++]=n;}}
while(front<back){let a=q[front++],x=a%W,y=(a/W)|0;for(let z of [a-W,a+W,a-1,a+1])if(z>=0&&z<N&&!(Math.abs(z-a)===1&&((z/W)|0)!==y)&&g[z]&&!seen[z]){seen[z]=1;q[back++]=z;}}
let pruned=0;for(let i=0;i<N;i++)if(g[i]&&!seen[i]){g[i]=0;pruned++;}
// Lossless disjoint ordered rectangle encoding, vertical span merged where
// the exact horizontal material-run key repeats on the immediately next row.
let rect=[],active=new Map();for(let y=0;y<H;y++){let next=new Map(),o=y*W;for(let x=0;x<W;){let m=g[o+x],s=x;while(x<W&&g[o+x]===m)x++;if(!m)continue;let key=s+":"+(x-s)+":"+m,idx=active.get(key);if(idx===undefined){idx=rect.length;rect.push([s,y,x-s,1,m]);}else rect[idx][3]++;next.set(key,idx);}active=next;}
let replay=new Uint8Array(N),hist={};let area=0;for(let [x,y,w,h,m] of rect){if(x<0||y<0||w<1||h<1||x+w>W||y+h>H||!IDS.includes(m))throw Error("bad rectangle");hist[m]=(hist[m]||0)+w*h;area+=w*h;for(let yy=y;yy<y+h;yy++){for(let i=yy*W+x;i<yy*W+x+w;i++)if(replay[i]!==0)throw Error("overlap");replay.fill(m,yy*W+x,yy*W+x+w);}}
for(let i=0;i<N;i++)if(g[i]!==replay[i])throw Error("replay mismatch "+i);
hist[0]=N-area;
let int=new Int32Array((W+1)*(H+1)),S=W+1;for(let y=1;y<=H;y++){let sum=0,o=(y-1)*W;for(let x=1;x<=W;x++){sum+=g[o+x-1]!==0?1:0;int[y*S+x]=int[(y-1)*S+x]+sum;}}
function clear(x,y,w,h){let a=x-(w>>1),b=y-(h>>1),c=a+w,d=b+h;return a>=0&&b>=0&&c<=W&&d<=H&&int[d*S+c]-int[d*S+a]-int[b*S+c]+int[b*S+a]===0;}
function BFS(w,h,ob){let pass=new Uint8Array(N),seen=new Uint8Array(N),queue=new Int32Array(N),first=0,last=0;let ox=ob?.[0]||-1,oy=ob?.[1]||-1,ow=ob?.[2]||0,oh=ob?.[3]||0;for(let y=h>>1;y<H-(h>>1);y++)for(let x=w>>1;x<W-(w>>1);x++){if(!clear(x,y,w,h))continue;let left=x-(w>>1),top=y-(h>>1);if(ob&&left<ox+ow&&left+w>ox&&top<oy+oh&&top+h>oy)continue;pass[y*W+x]=1;}let spawn=sites["West beacon ingress"],n=spawn[1]*W+spawn[0];if(!pass[n])return {size:[w,h],error:"spawn blocked",pos:spawn};seen[n]=1;queue[last++]=n;while(first<last){let a=queue[first++],x=a%W,y=(a/W)|0;for(let b of [a-W,a+W,a-1,a+1])if(b>=0&&b<N&&!(Math.abs(a-b)===1&&((b/W)|0)!==y)&&pass[b]&&!seen[b]){seen[b]=1;queue[last++]=b;}}let bad=Object.entries(sites).filter(([n,p])=>!seen[p[1]*W+p[0]]).map(([n,p])=>({name:n,xy:p,clear:clear(p[0],p[1],w,h)}));return {size:[w,h],reached:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,component:last,bad,pass,seen};}
let routes=[[19,15],[23,19],[31,27]].map(([w,h])=>BFS(w,h,null)),barrier=[848,261,120,84],detour=BFS(31,27,barrier);
function dist(pass,start,end){let a=start[1]*W+start[0],b=end[1]*W+end[0],seen=new Int32Array(N),Q=new Int32Array(N),first=0,last=0;if(!pass[a]||!pass[b])return -1;Q[last++]=a;seen[a]=1;while(first<last){let n=Q[first++];if(n===b)return (seen[n]-1);let x=n%W,y=(n/W)|0;for(let v of [n-W,n+W,n-1,n+1])if(v>=0&&v<N&&!(Math.abs(n-v)===1&&((v/W)|0)!==y)&&pass[v]&&!seen[v]){seen[v]=seen[n]+1;Q[last++]=v;}}return -1;}
let start=sites["West cable watch"],finish=sites["East signal crossing"];
let routeDistance=[dist(routes[2].pass,start,finish),dist(detour.pass,start,finish)];
let status=routes.map(r=>({size:r.size,reached:r.reached,total:r.total,free_centres:r.component,bad:r.bad,error:r.error||null}));
if(status.some(x=>x.reached!==x.total)||detour.reached!==Object.keys(sites).length||routeDistance[0]<0||routeDistance[1]<=routeDistance[0])throw Error('Exact Midge clearance, route or obstruction qualification failure '+JSON.stringify({status,detour:detour.bad,routeDistance}));
if(rect.length>32768||area>32000000)throw Error("budget "+rect.length+"/"+area);
const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:sites["West beacon ingress"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false},json=JSON.stringify(setup),jbytes=utf8(json);
if(jbytes.length>1048576)throw Error("JSON over budget");
let crops=[["01-west-berth",85,390,451,394],["02-straddle-hoists",438,273,472,515],["03-mid-cargo-exchange",865,365,530,421],["04-east-tariff-ward",1405,411,560,378],["05-lower-recovery",86,760,1870,185]];
let images=[["overview",[0,0,W,H]],...crops.map(c=>[c[0],c.slice(1)])].map(([name,rect])=>{let data=png(g,rect),pixels=verifyPng(g,rect,data);return{name,rect,bytes:data,sha256:sha256(data),pixels};});
let receipt={concept:"Tidefault Bonded Freight — Quarantine Return Arches / Fallen Evacuation Spur",original:true,seed:SEED,engine_sha:"8d07e04459a2705a6f96c908c0b565a483cc5beb",source_reference_head:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",extent:[W,H],route_graph:{main:["West return intake","Returned cargo assay","Gate ledger station","West clearing arch","Sealed exchange vestibule","Freight reel house","Quarantine classifier","Sanitation slip","Collapsed evacuation throat","East bonded return"],upper:["West dike watch","Assay signal","Central vent head","East cantilever watch","Departure marker"],interior:["Lower ledger cabinet","Hanging cargo weigh cell","Fault sorting bridge","Sealed quarantine exchange","Inner assay","Worker recovery nook","Rubble survey station"],lower:["West sump bypass","Mid freight underpass","East emergency gallery"]},material_ids:{"0":"Empty","100":"BasaltColumns Solid immovable None","58":"ReinforcedConcrete Solid immovable None","62":"SteelPlate Solid immovable None"},midge_authored_hull:[4,3],hull_envelopes:[[19,15],[23,19],[31,27]],exact_sites:sites,material_histogram:hist,stable_occupied_cells:area,grounded:area,detached_cells:0,pruned_disconnected_decor_cells:pruned,invalid_writes:0,rectangles:rect.length,rectangle_work:area,setup_bytes:jbytes.length,material_plane_sha256:sha256(g),setup_sha256:sha256(jbytes),clearance:status,obstruction:{material:58,rect:barrier,from:"West cable watch",to:"East signal crossing",size:[31,27],sites_reached:detour.reached,unreachable:detour.bad,distance_before_after:routeDistance},images:images.map(z=>({name:z.name,rect:z.rect,bytes:z.bytes.length,sha256:z.sha256,pixel_parity:z.pixels})),native_status:"NATIVE-UNTESTED",bridge_source_max_rectangles:32768,proof:"Complete material plane, lossless disjoint Setup-v2 replay, exact conservative 19x15/23x19/31x27 routes, physical obstruction detour and indexed PNG integrity/parity"};
receipt.concept="Tidefault Bonded Freight — Signal-Rack Cargo Stilts / Split Receipt Exchanges";
receipt.engine_sha="f7e056c9b8791106e22f2d1c295043783d8a9701";
receipt.route_graph={
 main:["West beacon ingress","Quayside tally","Suspended receipt stage","Transfer hook approach","West sealed ledger","Overhead cargo exchange","Interlocking customs","Quarantine handoff","Outer signal dispatch"],
 upper:["West signal lookout","West cable watch","Midspan wind monitor","East signal crossing","Departure lantern"],
 interior:["West berth inspection","Winch operator booth","Axle-and-trolley service","Transfer tally room","Bonded short-stay receiver","Inhabited tariff ward","Damaged launch relay"],
 lower:["West return sluice","Suspension hydraulics","Cargo retrieval cellar","Deep customs escape","Emergency pier recovery"]
};
receipt.proof+="; seven rooted asymmetric cargo piers, differentiated entered receipt/inspection rooms, broken signal pier, layered emergency returns";
return {g,rect,sites,crops,images,receipt,setup,json,jbytes,status,detour:{reached:detour.reached,bad:detour.bad,component:detour.component},distance:routeDistance,pruned};
}
return {generate,sha256,base64,utf8};
})();
if(typeof module!=="undefined"){
 module.exports=lib;
 if(require.main===module){
  const fs=require("fs"),path=require("path");
  const a=lib.generate(),p=__dirname,verify=process.argv.includes("--verify");
  const outputs=[["setup.json",Buffer.from(a.json,"utf8")],
    ["receipt.json",Buffer.from(JSON.stringify(a.receipt,null,2)+"\n","utf8")],
    ...a.images.map(im=>[im.name+".png",Buffer.from(im.bytes)])];
  for(const [name,bytes] of outputs){
   const target=path.join(p,name);
   if(verify){if(!fs.existsSync(target)||!fs.readFileSync(target).equals(bytes))throw Error("Committed artifact diverges from builder: "+name);}
   else fs.writeFileSync(target,bytes);
  }
  console.log(JSON.stringify({mode:verify?"SOURCE-EXACT-PASS":"GENERATED",rectangles:a.rect.length,setup_bytes:a.jbytes.length,
    grounded:a.receipt.grounded,pruned:a.receipt.pruned_disconnected_decor_cells,
    envelope_sites:a.status.map(x=>x.reached+"/"+x.total),detour:a.receipt.obstruction.distance_before_after,
    material_plane_sha256:a.receipt.material_plane_sha256,images:a.receipt.images.map(x=>x.name+":"+x.pixel_parity)}));
 }
}
