"use strict";
const lib=(function factory(){
"use strict";
const W=2048,H=1024,N=W*H,SEED=0x26B0853,IDS=[0,100,58,62], M={AIR:0,ROCK:100,WALL:58,STEEL:62};
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
const g=new Uint8Array(N);
const sites={
"Western lift apron":[112,582],"Strip entry":[280,699],"Hull clamp control":[425,623],
"Grading forks":[920,495],"Grading air lane":[730,695],"Grading exchange":[1110,715],
"Rotor lookout":[940,341],"Quarantine registry":[1650,645],"Tariff lookout":[1660,408],
"Workers shelter":[1418,775],"Quarantine roof":[1846,367],"Eastern dispatch":[1956,567],
"West gantry sky":[301,347],"Grading chimney":[780,335],"Upper court bridge":[1285,422],
"Quarantine upper":[1560,412],"West underworks":[330,870],"Grading underworks":[807,871],
"Hub underpass":[1224,873],"Registry underpass":[1490,873],"East underworks":[1740,873],
"Western signal tower":[447,227],"Grading roof lantern":[1014,219],"Quarantine mast lookout":[1895,198],
"Broken annex":[2010,771],"Transfer shelf":[1242,710],"Workers repair bay":[1480,730],
"Quarantine interview":[1830,736],"Keel receiving platform":[610,725]};
function R(x,y,w,h,m){x=Math.max(0,Math.floor(x));y=Math.max(0,Math.floor(y));w=Math.max(0,Math.ceil(w));h=Math.max(0,Math.ceil(h));if(x>=W||y>=H)return;for(let yy=y;yy<Math.min(H,y+h);yy++)g.fill(m,yy*W+x,yy*W+Math.min(W,x+w));}
function L(x,y,X,Y,t=8,m=M.STEEL){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,rad=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-rad));yy<Math.min(H,Math.ceil(Math.max(y,Y)+rad+1));yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-rad));xx<Math.min(W,Math.ceil(Math.max(x,X)+rad+1));xx++){let s=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(d||1)));if((xx-x-s*dx)**2+(yy-y-s*dy)**2<=rad*rad)g[yy*W+xx]=m;}}
const B=(...a)=>R(...a,M.ROCK),C=(...a)=>R(...a,M.WALL),St=(...a)=>R(...a,M.STEEL),V=(...a)=>R(...a,M.AIR);
const line=(x,y,X,Y,t=8,m=M.STEEL)=>L(x,y,X,Y,t,m);
function arc(cx,cy,rx,ry,a,b,t,m=M.STEEL){let x0=cx+rx*Math.cos(a),y0=cy+ry*Math.sin(a);const n=Math.ceil(Math.max(rx,ry)*(b-a)/5);for(let k=1;k<=n;k++){let u=a+(b-a)*k/n,x=cx+rx*Math.cos(u),y=cy+ry*Math.sin(u);L(x0,y0,x,y,t,m);x0=x;y0=y;}}
/* KEELBONE 04: three unequal interleaved reclamation courts around a workers'
 quarantine hub, real parcel handoffs, a lower recovery gallery and a broken
 annex. Visibly different from Keelbone 03's repeated roof bay sequence. */
B(0,921,W,103);B(0,883,153,138);B(1902,872,146,152);
B(40,903,260,18);B(410,909,220,12);B(752,907,145,14);B(1043,904,227,17);B(1505,912,215,9);
V(136,854,1760,52);
St(150,913,1750,9);
for(const [x,w] of [[168,23],[580,25],[747,25],[1180,23],[1525,25],[1913,25]])C(x,830,w,111);
/* Court A — the low broken-keel receiving hall. A distinctive zigzag
   canopy, arced bottom hull-clamp and continuous handed-off parcel tray. */
C(124,472,22,350);C(621,499,20,330);
line(125,472,314,429,13);line(314,429,461,468,13);line(461,468,620,451,13);
St(126,493,500,13);St(193,784,455,15);
St(184,647,404,14);C(202,657,19,124);C(563,660,18,119);
arc(380,610,178,102,0.10,Math.PI-.14,15);
arc(383,609,141,70,.10,Math.PI-.12,9);
line(233,602,320,677,16);line(530,621,479,676,15);
St(255,714,116,12);C(279,726,18,56);St(389,742,183,15);
C(410,709,17,33);C(545,754,16,33);
St(567,724,172,15);C(712,732,17,100);
St(106,817,570,15);C(183,793,18,35);
St(184,536,120,12);C(186,548,16,57);
St(452,531,138,11);C(575,544,14,77);
line(270,464,310,522,11);St(304,519,79,10);
/* Court B — tall triangular crusher-grader and a physically entered rotor
  classification workface. Large circular bolted vessel is NOT suspended:
  shaft and foot transmit loads into grounded machinery foundations. */
C(748,424,24,407);C(1196,454,21,378);
line(757,421,935,277,19);line(935,277,1207,452,19);
line(936,282,964,350,11);St(901,344,105,15);
St(760,467,445,13);St(774,783,438,16);
arc(974,608,149,143,0,Math.PI*2,14);
arc(974,608,109,106,0,Math.PI*2,8);
C(966,714,22,128);St(902,738,143,18);
line(858,570,965,710,13);line(1099,565,985,709,12);
St(832,689,140,15);C(858,705,17,72);
St(1027,687,128,15);C(1115,701,20,79);
St(678,728,156,16);St(1130,739,182,16);
C(1294,748,17,84);
St(826,523,92,13);C(837,538,16,66);
St(1030,510,94,13);C(1099,522,15,55);
/* Central short inhabited quarantine loop: radically asymmetric low
  stepped roofs, physically entered ledger and 2 separate lower exits. */
C(1248,618,21,212);C(1478,605,22,227);
line(1237,607,1316,560,16);St(1314,560,120,16);
line(1433,567,1492,611,12);St(1248,666,252,13);
St(1268,792,218,15);C(1357,726,17,66);
St(1372,726,104,13);C(1459,738,17,54);
St(1267,707,110,13);C(1308,720,14,71);
St(1389,622,89,10);C(1420,637,13,43);
St(1254,531,112,9);C(1260,541,14,54);
St(1340,826,164,13);
V(1240,695,55,82);V(1459,686,55,81);
/* Court C — serrated quarantine/export ridgeline enclosing unequal
 custody bays and large single offset seal arch. NOT another U-frame row. */
C(1555,511,24,331);C(1941,483,23,349);
line(1555,511,1623,440,17);line(1623,440,1706,477,17);
line(1706,477,1807,418,17);line(1807,418,1937,486,16);
St(1567,552,374,16);St(1565,805,379,17);
St(1592,673,300,13);C(1612,684,18,115);
C(1874,693,20,111);St(1665,744,177,14);
C(1723,752,17,48);St(1775,704,118,13);
arc(1768,644,112,112,Math.PI,Math.PI*2,15);
C(1656,645,19,154);C(1867,645,18,158);
St(1673,633,197,15);V(1721,649,80,73);
St(1810,765,75,14);C(1829,777,16,25);
St(1928,698,120,13);C(1969,715,17,117);
St(1567,601,117,11);C(1601,612,14,60);
/* Deliberately broken east annex and open authoring air. */
V(1986,471,62,244);St(1948,824,98,14);
line(1967,824,2036,790,11);St(1937,493,63,10);
/* Supported upper traverse, exposed but not a continuous roof strip. */
St(226,361,266,11);C(241,372,17,115);
line(453,363,511,458,11);
St(825,315,162,13);C(830,329,17,137);
St(1235,438,167,11);C(1244,451,18,156);
St(1611,376,168,12);C(1614,390,17,61);
/* Visible original transfer transactions; handoff is physical, not a label. */
St(552,698,217,16);C(734,714,15,97);
St(1176,733,162,17);C(1310,751,17,81);
St(1496,737,152,15);C(1625,749,16,72);
/* Actual worker-scale lower service entries: overflight remains open;
 cellar is deliberately pierced by widely spaced grounded piers. */
V(336,831,74,59);V(1019,827,79,62);V(1404,833,68,58);
for(const [x,y] of Object.values(sites)) V(x-27,y-26,55,53);
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
function BFS(w,h,ob){let pass=new Uint8Array(N),seen=new Uint8Array(N),queue=new Int32Array(N),first=0,last=0;let ox=ob?.[0]||-1,oy=ob?.[1]||-1,ow=ob?.[2]||0,oh=ob?.[3]||0;for(let y=h>>1;y<H-(h>>1);y++)for(let x=w>>1;x<W-(w>>1);x++){if(!clear(x,y,w,h))continue;let left=x-(w>>1),top=y-(h>>1);if(ob&&left<ox+ow&&left+w>ox&&top<oy+oh&&top+h>oy)continue;pass[y*W+x]=1;}let spawn=sites["Western lift apron"],n=spawn[1]*W+spawn[0];if(!pass[n])return {size:[w,h],error:"spawn blocked",pos:spawn};seen[n]=1;queue[last++]=n;while(first<last){let a=queue[first++],x=a%W,y=(a/W)|0;for(let b of [a-W,a+W,a-1,a+1])if(b>=0&&b<N&&!(Math.abs(a-b)===1&&((b/W)|0)!==y)&&pass[b]&&!seen[b]){seen[b]=1;queue[last++]=b;}}let bad=Object.entries(sites).filter(([n,p])=>!seen[p[1]*W+p[0]]).map(([n,p])=>({name:n,xy:p,clear:clear(p[0],p[1],w,h)}));return {size:[w,h],reached:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,component:last,bad,pass,seen};}
let routes=[[19,15],[23,19],[31,27]].map(([w,h])=>BFS(w,h,null)),barrier=[970,638,135,126],detour=BFS(31,27,barrier);
function dist(pass,start,end){let a=start[1]*W+start[0],b=end[1]*W+end[0],seen=new Int32Array(N),Q=new Int32Array(N),first=0,last=0;if(!pass[a]||!pass[b])return -1;Q[last++]=a;seen[a]=1;while(first<last){let n=Q[first++];if(n===b)return (seen[n]-1);let x=n%W,y=(n/W)|0;for(let v of [n-W,n+W,n-1,n+1])if(v>=0&&v<N&&!(Math.abs(n-v)===1&&((v/W)|0)!==y)&&pass[v]&&!seen[v]){seen[v]=seen[n]+1;Q[last++]=v;}}return -1;}
let start=sites["Grading air lane"],finish=sites["Quarantine registry"];
let routeDistance=[dist(routes[2].pass,start,finish),dist(detour.pass,start,finish)];
let status=routes.map(r=>({size:r.size,reached:r.reached,total:r.total,free_centres:r.component,bad:r.bad,error:r.error||null}));
if(status.some(x=>x.reached!==x.total)||detour.reached!==Object.keys(sites).length||routeDistance[0]<0||routeDistance[1]<=routeDistance[0])throw Error('Exact Midge clearance, route or obstruction qualification failure '+JSON.stringify({status,detour:detour.bad,routeDistance}));
if(rect.length>32768||area>32000000)throw Error("budget "+rect.length+"/"+area);
const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:sites["Western intake"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false},json=JSON.stringify(setup),jbytes=utf8(json);
if(jbytes.length>1048576)throw Error("JSON over budget");
let crops=[["01-keel-receiving",88,380,603,482],["02-rotor-grading",695,255,573,581],["03-worker-hub",1205,490,350,380],["04-quarantine-arch",1530,365,511,508],["05-service-underworks",585,760,1000,253]];
let images=[["overview",[0,0,W,H]],...crops.map(c=>[c[0],c.slice(1)])].map(([name,rect])=>{let data=png(g,rect),pixels=verifyPng(g,rect,data);return{name,rect,bytes:data,sha256:sha256(data),pixels};});
let receipt={
concept:"Keelbone Reclamation Vaults — Interleaved Reclaim Courtyards / Worker Quarantine Hub",
original:true,seed:SEED,engine_sha:"f7e056c9b8791106e22f2d1c295043783d8a9701",
source_reference_head:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",
extent:[W,H],
route_graph:{main:["Western lift apron","Strip entry","Grading air lane","Grading exchange","Transfer shelf","Quarantine registry","Eastern dispatch"],upper:["West gantry sky","Rotor lookout","Upper court bridge","Quarantine upper","Quarantine roof"],workcells:["Hull clamp control","Grading forks","Workers shelter","Workers repair bay","Quarantine interview"],lower:["West underworks","Grading underworks","Hub underpass","Registry underpass","East underworks"],sky:["Western signal tower","Grading roof lantern","Quarantine mast lookout"]},
material_ids:{"0":"Empty","100":"BasaltColumns Solid immovable None","58":"ReinforcedConcrete Solid immovable None","62":"SteelPlate Solid immovable None"},
midge_authored_hull:[4,3],hull_envelopes:[[19,15],[23,19],[31,27]],
exact_sites:sites,material_histogram:hist,stable_occupied_cells:area,grounded:area,
detached_cells:0,pruned_disconnected_decor_cells:pruned,invalid_writes:0,
rectangles:rect.length,rectangle_work:area,setup_bytes:jbytes.length,
material_plane_sha256:sha256(g),setup_sha256:sha256(jbytes),clearance:status,
obstruction:{material:58,rect:barrier,from:"Grading air lane",to:"Quarantine registry",
size:[31,27],sites_reached:detour.reached,unreachable:detour.bad,distance_before_after:routeDistance},
images:images.map(z=>({name:z.name,rect:z.rect,bytes:z.bytes.length,sha256:z.sha256,pixel_parity:z.pixels})),
native_status:"NATIVE-UNTESTED",bridge_source_max_rectangles:32768,
proof:"Exact source-static replay; bottom-rooted solids; three Midge hulls; physical obstruction and alternative; authentic PNG pixel parity"
};
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
