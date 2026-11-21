"use strict";
const lib=(function factory(){
"use strict";
const W=2048,H=1024,N=W*H,SEED=0x26B0730,IDS=[0,100,58,62], M={AIR:0,ROCK:100,WALL:58,STEEL:62};
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
"Western intake":[115,489],"Wet-strip vestibule":[311,614],"Catch-tray control":[418,580],
"Magnet sorter":[665,625],"Sorting rail":[710,489],"Torque drive control":[1090,512],
"Torque inspection":[965,377],"Ledger registry":[1370,625],"Ledger loft":[1398,377],
"Workers refuge":[1746,620],"Crew roof maintenance":[1750,374],"Eastern export":[1950,488],
"Western roof watch":[322,374],"Sorting roof watch":[590,370],"Upper branch":[1165,378],
"Eastern upper walkway":[1590,370],"West relief gate":[145,499],"Sorter relief gate":[605,502],
"Torque relief gate":[1081,499],"Ledger relief gate":[1410,502],"East relief gate":[1850,502],
"Roof signal platform":[720,144],"Exhaust rooftop":[1135,125],"Emergency sky lookout":[1895,155],
"Abandoned annex entry":[1980,665],"Torque parcel overlook":[1100,532],"Repair service niche":[1604,705]};
function R(x,y,w,h,m){x=Math.max(0,Math.floor(x));y=Math.max(0,Math.floor(y));w=Math.max(0,Math.ceil(w));h=Math.max(0,Math.ceil(h));if(x>=W||y>=H)return;for(let yy=y;yy<Math.min(H,y+h);yy++)g.fill(m,yy*W+x,yy*W+Math.min(W,x+w));}
function L(x,y,X,Y,t=8,m=M.STEEL){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,rad=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-rad));yy<Math.min(H,Math.ceil(Math.max(y,Y)+rad+1));yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-rad));xx<Math.min(W,Math.ceil(Math.max(x,X)+rad+1));xx++){let s=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(d||1)));if((xx-x-s*dx)**2+(yy-y-s*dy)**2<=rad*rad)g[yy*W+xx]=m;}}
const B=(...a)=>R(...a,M.ROCK),C=(...a)=>R(...a,M.WALL),St=(...a)=>R(...a,M.STEEL),V=(...a)=>R(...a,M.AIR);
const line=(x,y,X,Y,t=8,m=M.STEEL)=>L(x,y,X,Y,t,m);
/* NEW KEELBONE 03: a continuous ground-embedded, densely covered horizontal industrial
   quarter. Not opposed cliff shoulders around a central void; five enterable bays,
   separate inspect/haul/undercut passages, shafts and positive freight fixtures. */

/* One immense covered, continuous below-grade factory chamber — no isolated
   rock islands and no cliff-to-cliff gash. Shell wraps both ends and roots to
   the world floor. Mezzanines hang from roof, machinery stands on bedrock. */
B(0,276,W,H-276);
B(85,259,355,17); B(476,250,350,26);B(864,238,325,38);
B(1310,254,340,22);B(1715,265,249,11);
V(69,329,1949,557); /* long upper + middle + lower freely flyable cavity */
V(1969,0,79,583);  /* emergency sky exit from right cargo exchange */
/* Two local process mezzanines and one long observation walkway; not
   dividing walls: Midge can pass above or underneath the support web. */
for(const [x,w] of [[85,298],[433,289],[785,321],[1150,277],[1461,243],[1776,222]])St(x,431,w,11);
for(const [x,w] of [[135,177],[513,182],[878,199],[1301,171],[1649,186]])St(x,546,w,10);
for(const [x,w] of [[79,206],[339,214],[619,230],[898,253],[1241,225],[1544,197],[1815,151]])St(x,876,w,10);
/* Roof-connected truss and walk supports, staggered to keep air passages */
for(const [x,len] of [[120,151],[425,156],[811,165],[1200,152],[1507,148],[1863,148]])C(x,280,15,len);
for(const [x,y,X,Y] of [[130,300,197,428],[434,305,512,426],[817,295,887,427],[1209,294,1281,430],[1514,294,1582,430],[1872,294,1941,430]])line(x,y,X,Y,8);
/* Roofline crane houses and freight ventilation monuments, fully joined */
C(107,202,22,79);St(106,194,130,14);C(221,207,17,70);
C(500,176,23,100);St(498,166,139,13);C(623,184,18,93);
C(888,161,20,116);St(887,149,141,13);C(1016,174,18,102);
C(1336,195,21,83);St(1335,185,124,14);C(1447,202,18,76);
C(1750,214,20,64);St(1747,202,125,14);C(1860,214,18,64);
line(112,215,186,278,11);line(506,183,573,277,11);
line(898,172,957,276,11);line(1344,199,1416,278,10);
/* District I — dry reclamation washwork. Actual long catch trough with
   fed staging lip, sideentered operator shelf and receiving crate. */
C(118,668,17,220);C(457,646,19,241);St(130,650,322,13);
St(131,827,319,13);C(150,746,20,83);St(168,738,107,12);
C(256,724,17,20);St(301,765,126,14);C(308,743,14,26);
C(409,765,17,60);St(195,814,121,10);St(150,672,115,11);
C(187,682,15,56);St(343,688,96,12);C(382,699,17,54);
St(88,555,172,9);C(118,565,12,46);
/* District II — polarized sorter grid with opposed fork tines and
   a real grounded receiving cradle, unlike the fluid-collection tools. */
C(500,624,18,261);C(808,610,17,275);St(502,608,305,13);
St(510,837,297,13);C(531,738,16,98);St(546,729,123,13);
C(650,702,17,30);St(681,770,105,12);C(765,779,15,58);
line(568,671,615,702,12);line(620,702,659,671,12);
St(555,796,109,12);C(557,807,12,27);St(704,665,68,11);
C(714,676,14,55);St(509,557,181,9);
/* District III — torque spindle press is a wide founded tool with
   visibly separate infeed, press and receiver surfaces, not a sky crane */
C(851,592,19,296);C(1196,576,19,310);St(860,580,335,15);
St(858,846,343,13);C(881,720,17,125);St(896,713,123,12);
C(994,689,19,24);St(1036,767,131,14);C(1150,720,17,47);
St(916,648,111,15);C(919,663,17,37);C(1014,672,18,27);
St(1070,618,115,12);C(1131,630,15,61);
line(957,706,1017,766,12);line(1162,713,1094,777,10);
St(874,556,130,10);
/* District IV — entered bonded ledger / custody with raised counters,
   two distinctive staffed transaction windows and a lower dispatch rack */
C(1232,662,16,225);C(1536,647,18,238);
St(1244,647,299,12);St(1244,843,297,12);
C(1260,738,17,106);St(1274,726,122,13);C(1382,702,15,26);
St(1412,765,113,13);C(1492,739,17,26);
St(1264,679,102,10);C(1292,689,17,34);
St(1440,694,82,11);C(1469,705,16,32);
St(1271,564,171,10);
/* District V — inhabited repair and refugee workrooms, physical bed,
   locker, workshop and safe egress; east fractured bay remains editable. */
C(1572,663,18,224);C(1933,628,19,258);
St(1582,636,340,12);St(1586,846,334,12);
C(1604,735,16,108);St(1618,726,91,12);C(1687,709,15,18);
St(1740,776,135,13);C(1850,743,18,33);
St(1770,679,96,12);C(1786,691,13,48);
St(1596,671,86,10);C(1605,680,15,43);
C(1895,684,18,149);St(1890,820,158,12);
St(1750,557,175,12);C(1840,570,13,45);
/* Real 60-90 cell machine enclosure thresholds. Roofs and sidewalls are
   not sealed display frames; player can enter and exit each working district. */
V(840,628,58,115);V(1186,667,57,116);
V(1223,692,62,113);V(1513,708,69,113);
V(832,778,76,84);V(1201,779,75,91);
/* R2 Art P1: sorter -> torque has a physically continuous tray, a driven
   press intake and a lower receiver on grounded foundations. Deliberately
   avoids occupying any exact named Midge envelope. */
St(764,754,196,13); C(778,757,17,81); St(947,742,99,13);
C(1017,740,18,108); St(953,791,86,14);
C(977,753,17,36); St(940,789,91,12);
/* R2 bonded ledger: distinct counter/portal with a 69x84 side access
   rather than a repeated post rack. Surrounding blank bay retained. */
C(1316,684,18,160); St(1326,680,186,14);
C(1496,694,17,148); St(1379,772,125,15);
C(1450,786,17,57); St(1358,723,97,13);
V(1304,744,69,84);
/* Asymmetric modular firebreak and damaged append zone. Empty volume retained. */
V(1980,606,68,168);St(1969,813,79,12);
C(1972,791,15,22);
/* Observed failure point / alternative-route pressure window (unscripted) */
St(889,522,77,11);C(896,533,15,36);
/* Independent real load paths for each component workface: connect small
   suspended steel shelves and tool arms into the floor, not disconnected greebles.
   Deliberately offset from named Midge routes and parcel infeed doors. */
for(const [x,top,w] of [
[161,638,18],[341,679,17],[551,592,18],[736,604,16],
[899,573,18],[973,641,18],[1146,609,16],
[1280,627,18],[1462,668,18],[1647,659,17],[1816,667,18]
])C(x,top,w,885-top);
/* Clear every named conservative 31x27 actor envelope */
for(const [x,y] of Object.values(sites))V(x-26,y-25,53,51);
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
function BFS(w,h,ob){let pass=new Uint8Array(N),seen=new Uint8Array(N),queue=new Int32Array(N),first=0,last=0;let ox=ob?.[0]||-1,oy=ob?.[1]||-1,ow=ob?.[2]||0,oh=ob?.[3]||0;for(let y=h>>1;y<H-(h>>1);y++)for(let x=w>>1;x<W-(w>>1);x++){if(!clear(x,y,w,h))continue;let left=x-(w>>1),top=y-(h>>1);if(ob&&left<ox+ow&&left+w>ox&&top<oy+oh&&top+h>oy)continue;pass[y*W+x]=1;}let spawn=sites["Western intake"],n=spawn[1]*W+spawn[0];if(!pass[n])return {size:[w,h],error:"spawn blocked",pos:spawn};seen[n]=1;queue[last++]=n;while(first<last){let a=queue[first++],x=a%W,y=(a/W)|0;for(let b of [a-W,a+W,a-1,a+1])if(b>=0&&b<N&&!(Math.abs(a-b)===1&&((b/W)|0)!==y)&&pass[b]&&!seen[b]){seen[b]=1;queue[last++]=b;}}let bad=Object.entries(sites).filter(([n,p])=>!seen[p[1]*W+p[0]]).map(([n,p])=>({name:n,xy:p,clear:clear(p[0],p[1],w,h)}));return {size:[w,h],reached:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,component:last,bad,pass,seen};}
let routes=[[19,15],[23,19],[31,27]].map(([w,h])=>BFS(w,h,null)),barrier=[778,460,75,83],detour=BFS(31,27,barrier);
function dist(pass,start,end){let a=start[1]*W+start[0],b=end[1]*W+end[0],seen=new Int32Array(N),Q=new Int32Array(N),first=0,last=0;if(!pass[a]||!pass[b])return -1;Q[last++]=a;seen[a]=1;while(first<last){let n=Q[first++];if(n===b)return (seen[n]-1);let x=n%W,y=(n/W)|0;for(let v of [n-W,n+W,n-1,n+1])if(v>=0&&v<N&&!(Math.abs(n-v)===1&&((v/W)|0)!==y)&&pass[v]&&!seen[v]){seen[v]=seen[n]+1;Q[last++]=v;}}return -1;}
let start=sites["Sorting rail"],finish=sites["Eastern export"];
let routeDistance=[dist(routes[2].pass,start,finish),dist(detour.pass,start,finish)];
let status=routes.map(r=>({size:r.size,reached:r.reached,total:r.total,free_centres:r.component,bad:r.bad,error:r.error||null}));
if(status.some(x=>x.reached!==x.total)||detour.reached!==Object.keys(sites).length||routeDistance[0]<0||routeDistance[1]<=routeDistance[0])throw Error('Exact Midge clearance, route or obstruction qualification failure '+JSON.stringify({status,detour:detour.bad,routeDistance}));
if(rect.length>32768||area>32000000)throw Error("budget "+rect.length+"/"+area);
const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:sites["Western intake"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false},json=JSON.stringify(setup),jbytes=utf8(json);
if(jbytes.length>1048576)throw Error("JSON over budget");
let crops=[["01-wet-strip",95,320,420,481],["02-magnet-sort",480,323,365,477],["03-torque-spine",814,294,445,544],["04-ledger-custody",1221,300,372,530],["05-crew-emergency",1544,271,504,608]];
let images=[["overview",[0,0,W,H]],...crops.map(c=>[c[0],c.slice(1)])].map(([name,rect])=>{let data=png(g,rect),pixels=verifyPng(g,rect,data);return{name,rect,bytes:data,sha256:sha256(data),pixels};});
let receipt={
concept:"Keelbone Reclamation Vaults — Continuous Covered Reclaim Spine / Five-Quarter Cargo Exchange",
original:true,seed:SEED,engine_sha:"f7e056c9b8791106e22f2d1c295043783d8a9701",
source_reference_head:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",
extent:[W,H],
route_graph:{main:["Western intake","Sorting rail","Torque drive control","Ledger registry","Eastern export","Abandoned annex entry"],upper:["Western roof watch","Sorting roof watch","Torque inspection","Upper branch","Ledger loft","Eastern upper walkway","Crew roof maintenance"],workcells:["Wet-strip vestibule","Catch-tray control","Magnet sorter","Repair service niche","Workers refuge"],lower:["West relief gate","Sorter relief gate","Torque relief gate","Torque parcel overlook","Ledger relief gate","East relief gate"],sky:["Roof signal platform","Exhaust rooftop","Worker emergency chimney"]},
material_ids:{"0":"Empty","100":"BasaltColumns Solid immovable None","58":"ReinforcedConcrete Solid immovable None","62":"SteelPlate Solid immovable None"},
midge_authored_hull:[4,3],hull_envelopes:[[19,15],[23,19],[31,27]],
exact_sites:sites,material_histogram:hist,stable_occupied_cells:area,grounded:area,
detached_cells:0,pruned_disconnected_decor_cells:pruned,invalid_writes:0,
rectangles:rect.length,rectangle_work:area,setup_bytes:jbytes.length,
material_plane_sha256:sha256(g),setup_sha256:sha256(jbytes),clearance:status,
obstruction:{material:58,rect:barrier,from:"Sorting rail",to:"Eastern export",
size:[31,27],sites_reached:detour.reached,unreachable:detour.bad,distance_before_after:routeDistance},
images:images.map(z=>({name:z.name,rect:z.rect,bytes:z.bytes.length,sha256:z.sha256,pixel_parity:z.pixels})),
native_status:"NATIVE-UNTESTED",bridge_source_max_rectangles:32768,
proof:"Exact replay, rooted material supports, three-hull routing, genuine main-aisle block detour, 2-bit indexed material PNG parity"
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
