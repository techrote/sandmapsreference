"use strict";
const lib=(function factory(){
"use strict";
const W=2048,H=1024,N=W*H,SEED=0xC1EFA05,IDS=[0,100,58,62], M={AIR:0,ROCK:100,WALL:58,STEEL:62};
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


const g=new Uint8Array(N),sites={"West labour arrival":[122,425],"Mooring stock levy":[298,425],"West refugee kitchen":[414,425],"First workers causeway":[577,425],"Cooperative tool loft":[731,425],"Coop trade table":[873,425],"Central rubble sluice":[1013,425],"Reclaim exchange stalls":[1162,425],"Eastern sort shed":[1328,425],"Customs tally lodge":[1531,425],"High outbound socket":[1713,425],"Remote transit mouth":[1910,425],"West canopy commons":[271,235],"Cooperative upper watch":[730,182],"Upper transit crossing":[1085,189],"East suspended shelter":[1609,175],"Derelict spur watch":[1841,182],"West lower refuge":[310,785],"Causeway underpass":[939,784],"Reclaimer undercroft":[1052,783],"East low retrieval":[1550,786],"Deep west medical lock":[241,892],"Deep return coop":[1032,892],"Deep eastern escape":[1950,893]};
function R(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);const a=Math.max(0,x),b=Math.min(W,x+w),c=Math.max(0,y),d=Math.min(H,y+h);if(a>=b||c>=d)return;for(let yy=c;yy<d;yy++)g.fill(m,yy*W+a,yy*W+b);}
function P(v,m){let lo=Math.max(0,Math.ceil(Math.min(...v.map(a=>a[1])))),hi=Math.min(H-1,Math.ceil(Math.max(...v.map(a=>a[1]))));for(let y=lo;y<=hi;y++){let xx=[];for(let j=0;j<v.length;j++){let a=v[j],b=v[(j+1)%v.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xx.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xx.sort((a,b)=>a-b);for(let j=0;j+1<xx.length;j+=2)R(Math.ceil(xx[j]),y,Math.floor(xx[j+1])-Math.ceil(xx[j])+1,1,m);}}
function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,rad=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-rad));yy<Math.min(H,Math.ceil(Math.max(y,Y)+rad+1));yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-rad));xx<Math.min(W,Math.ceil(Math.max(x,X)+rad+1));xx++){let s=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(d||1)));if((xx-x-s*dx)**2+(yy-y-s*dy)**2<=rad*rad)g[yy*W+xx]=m;}}
function ring(cx,cy,rx,ry,t,m){for(let y=Math.max(0,cy-ry);y<Math.min(H,cy+ry);y++)for(let x=Math.max(0,cx-rx);x<Math.min(W,cx+rx);x++){let n=((x-cx)/rx)**2+((y-cy)/ry)**2;if(n<=1&&n>=(1-t/Math.min(rx,ry))**2)g[y*W+x]=m;}}
const steel=(...a)=>R(...a,M.STEEL), wall=(...a)=>R(...a,M.WALL),rock=(...a)=>R(...a,M.ROCK),voidRect=(...a)=>R(...a,M.AIR);
const beam=(x,y,X,Y,t=9)=>L(x,y,X,Y,t,M.STEEL);
function hoop(x,y,r){ring(x,y,r,r,8,M.STEEL);ring(x,y,r-10,r-10,3,M.WALL);beam(x-r+5,y,x+r-5,y,4);}
function gauge(x,y){wall(x,y,64,43);voidRect(x+8,y+7,48,27);hoop(x+20,y+21,12);steel(x+39,y+14,8,12);}
function cabinet(x,y,w=78,h=54){wall(x,y,w,h);voidRect(x+9,y+8,w-18,h-17);steel(x+8,y+h-13,w-16,8);steel(x+17,y+18,12,15);steel(x+w-30,y+19,11,19);}
function hull(x,y,w,h){P([[x,y+15],[x+38,y],[x+w-69,y+5],[x+w,y+35],[x+w-38,y+h-10],[x+100,y+h],[x+27,y+h-30]],M.STEEL);P([[x+21,y+38],[x+56,y+24],[x+w-77,y+26],[x+w-29,y+48],[x+w-59,y+h-36],[x+95,y+h-22],[x+41,y+h-41]],M.AIR);}
function bolts(x,y,n=5){for(let k=0;k<n;k++){steel(x+k*22,y,9,9);steel(x+k*22+3,y+12,3,11);}}
function cage(x,y,w,h){wall(x,y,w,h);voidRect(x+12,y+14,w-24,h-25);steel(x+7,y+h-13,w-14,12);steel(x+18,y+16,10,21);steel(x+w-30,y+16,11,21);}
function pallet(x,y){steel(x,y,94,13);steel(x+9,y-31,72,31);wall(x+16,y-25,60,20);for(let i=0;i<3;i++)steel(x+18+i*20,y-24,4,18);}
function track(x,y,w){steel(x,y,w,12);for(let xx=x+17;xx<x+w-17;xx+=48)steel(xx,y+13,9,18);}



/* Sibling 05: original discontinuous populated reclamation colonies. This
   asymmetric multi-settlement/causeway graph is new, not a donor derivation. */
const V=(x,y,w,h)=>R(x,y,w,h,0),B=(x,y,w,h)=>R(x,y,w,h,100);
function home(x,y,w,h){wall(x,y,w,h);V(x+10,y+13,w-20,h-26);steel(x+11,y+h-17,w-22,10);V(x+w-29,y+h-24,25,34);wall(x+16,y+17,29,7);steel(x+22,y+36,17,12);}
function stall(x,y){steel(x,y,86,13);wall(x+12,y-48,58,43);V(x+20,y-40,39,27);steel(x+14,y-12,58,7);steel(x+6,y-53,70,6);}
function stock(x,y){steel(x,y,99,12);wall(x+9,y-29,74,27);for(let k=0;k<4;k++)steel(x+13+k*18,y-28,4,23);}
function truss(x,y,X,Y){beam(x,y,X,Y,15);beam(x,y+51,X,Y+45,9);for(let k=0;k<=5;k++){let t=k/5,xx=x+(X-x)*t,yy=y+(Y-y)*t;beam(xx,yy,xx,yy+49,6);}}
function hook(x,y){steel(x-6,y-28,12,95);steel(x-35,y+60,70,10);steel(x-26,y+69,11,20);steel(x+18,y+69,11,20);}
function ram(x,y){steel(x,y,96,17);steel(x+14,y-71,15,72);steel(x+66,y-71,15,72);steel(x+14,y-69,67,11);steel(x+32,y-55,29,27);}
B(0,928,W,96);
P([[0,578],[110,538],[306,564],[411,624],[469,753],[470,928],[0,928]],100);
P([[542,741],[604,639],[742,606],[858,665],[916,767],[901,928],[540,928]],100);
P([[1006,775],[1051,677],[1204,604],[1314,641],[1414,753],[1413,928],[1007,928]],100);
P([[1506,739],[1592,601],[1742,554],[1933,593],[2048,675],[2048,928],[1520,928]],100);
V(110,749,1830,100);V(130,868,1779,55);
for(let x of [268,666,1117,1605])V(x,545,79,365);
V(445,704,127,202);V(927,727,120,193);V(1400,715,119,199);
/* District A: labour refuge, levy and inhabited import offices. */
steel(99,592,350,19);steel(142,606,22,217);steel(401,607,18,226);
home(135,485,124,91);home(284,489,126,89);
stall(140,587);stock(272,581);
wall(132,354,243,16);steel(149,369,15,118);steel(338,372,15,121);
steel(188,340,77,15);beam(190,341,163,373,10);
/* District B: small tool cooperative above its own founded shelf. */
steel(577,633,308,20);steel(591,650,17,177);steel(848,644,16,189);
home(606,527,104,99);home(748,512,116,113);
stall(620,623);ram(749,623);
steel(645,349,201,16);steel(647,365,15,170);steel(818,365,16,157);
stock(693,344);beam(652,332,730,277,13);
/* District C: multi-cell reclaim exchange plus minor presses. */
steel(1052,643,302,19);steel(1074,656,20,180);steel(1323,654,17,175);
home(1071,536,109,99);home(1227,542,111,100);
stall(1111,636);stock(1220,631);
steel(1080,386,198,16);steel(1109,403,15,140);steel(1240,403,13,151);
ram(1197,627);
/* District D: customs village with a partly abandoned east spur. */
steel(1561,604,391,20);steel(1581,620,20,218);steel(1914,617,17,212);
home(1594,493,127,101);home(1760,496,124,101);
stall(1591,595);stock(1773,595);
wall(1602,347,267,15);steel(1647,364,17,133);steel(1839,360,17,145);
truss(1757,318,1890,270);beam(1889,270,1952,239,11);
beam(1921,256,1950,218,8);steel(1885,270,12,68);
beam(1834,341,1860,388,10);steel(1780,343,20,145);
steel(1928,242,34,8);steel(1905,230,11,33);
/* Three unequal trussed worker causeways, not another repeating crossdock. */
truss(371,549,596,623);beam(401,575,433,747,12);
beam(582,626,573,811,13);
truss(858,635,1084,643);beam(890,654,897,829,11);
beam(1089,657,1105,831,11);
truss(1335,644,1598,609);beam(1355,657,1378,832,12);
beam(1575,624,1594,826,11);
/* Small dispersed lifted loads: no central giant machine. */
beam(361,344,737,228,6);beam(737,228,1153,335,6);
beam(1125,329,1661,245,7);beam(1641,246,1883,281,7);
steel(353,344,20,202);steel(728,228,18,326);
steel(1139,332,17,317);steel(1649,247,19,354);
hook(568,310);hook(1240,349);hook(1714,287);
beam(568,343,568,567,7);beam(1240,378,1240,575,7);beam(1714,321,1714,558,7);
/* Excavated lower refugee chambers, unfitted bays for manual editing. */
for(let [x,y,w,h] of [[138,681,211,120],[605,735,227,115],[1066,735,290,122],[1572,723,302,133]]){V(x,y,w,h);wall(x+15,y+62,w-30,13);V(x+26,y+70,68,42);}
for(let x of [201,622,1090,1669]){steel(x,841,127,14);steel(x+19,853,16,62);steel(x+91,853,13,62);}
for(let x of [305,799,1181,1760]){wall(x,912,81,17);V(x+9,913,61,9);}
/* Multiple flight-level/underworks rejoining access. Real air in cells. */
V(71,405,1903,57);
for(let x of [466,938,1446,1952])V(x-41,444,82,479);
V(125,755,1801,82);V(126,871,1800,56);
for(let x of [306,1050,1589])V(x-40,802,82,117);


/* Real-founded independent populated shelves; preserve passable air gaps. */
for(const [x,y] of [[590,620],[847,632],[1073,638],[1320,636],[1581,601],[1910,603]])steel(x,y,15,1024-y);
/* Damaged east spur: a physically attached, incomplete cantilever and
   absent return segment, rather than an unfounded cartoon silhouette. */
steel(1801,286,12,211);beam(1807,290,1931,260,12);
steel(1927,261,13,37);steel(1942,243,18,7);
beam(1916,266,1930,243,7);
 /* Exact sites must be in air, and actual named site connection checked after
   all carving; these pockets alone do not establish reachable passages. */
for(const [x,y] of Object.values(sites))V(x-28,y-26,57,53);
B(0,1000,W,24);
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
function BFS(w,h,ob){let pass=new Uint8Array(N),seen=new Uint8Array(N),queue=new Int32Array(N),first=0,last=0;let ox=ob?.[0]||-1,oy=ob?.[1]||-1,ow=ob?.[2]||0,oh=ob?.[3]||0;for(let y=h>>1;y<H-(h>>1);y++)for(let x=w>>1;x<W-(w>>1);x++){if(!clear(x,y,w,h))continue;let left=x-(w>>1),top=y-(h>>1);if(ob&&left<ox+ow&&left+w>ox&&top<oy+oh&&top+h>oy)continue;pass[y*W+x]=1;}let spawn=sites["West labour arrival"],n=spawn[1]*W+spawn[0];if(!pass[n])return {size:[w,h],error:"spawn blocked",pos:spawn};seen[n]=1;queue[last++]=n;while(first<last){let a=queue[first++],x=a%W,y=(a/W)|0;for(let b of [a-W,a+W,a-1,a+1])if(b>=0&&b<N&&!(Math.abs(a-b)===1&&((b/W)|0)!==y)&&pass[b]&&!seen[b]){seen[b]=1;queue[last++]=b;}}let bad=Object.entries(sites).filter(([n,p])=>!seen[p[1]*W+p[0]]).map(([n,p])=>({name:n,xy:p,clear:clear(p[0],p[1],w,h)}));return {size:[w,h],reached:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,component:last,bad,pass,seen};}
let routes=[[19,15],[23,19],[31,27]].map(([w,h])=>BFS(w,h,null)),barrier=[471,392,80,88],detour=BFS(31,27,barrier);
function dist(pass,start,end){let a=start[1]*W+start[0],b=end[1]*W+end[0],seen=new Int32Array(N),Q=new Int32Array(N),first=0,last=0;if(!pass[a]||!pass[b])return -1;Q[last++]=a;seen[a]=1;while(first<last){let n=Q[first++];if(n===b)return (seen[n]-1);let x=n%W,y=(n/W)|0;for(let v of [n-W,n+W,n-1,n+1])if(v>=0&&v<N&&!(Math.abs(n-v)===1&&((v/W)|0)!==y)&&pass[v]&&!seen[v]){seen[v]=seen[n]+1;Q[last++]=v;}}return -1;}
let start=sites["West refugee kitchen"],finish=sites["Coop trade table"];
let routeDistance=[dist(routes[2].pass,start,finish),dist(detour.pass,start,finish)];
let status=routes.map(r=>({size:r.size,reached:r.reached,total:r.total,free_centres:r.component,bad:r.bad,error:r.error||null}));
if(status.some(x=>x.reached!==x.total)||detour.reached!==Object.keys(sites).length||routeDistance[0]<0||routeDistance[1]<=routeDistance[0])throw Error('Exact Midge clearance, route or obstruction qualification failure '+JSON.stringify({status,detour:detour.bad,routeDistance}));
if(rect.length>32768||area>32000000)throw Error("budget "+rect.length+"/"+area);
const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:start,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false},json=JSON.stringify(setup),jbytes=utf8(json);
if(jbytes.length>1048576)throw Error("JSON over budget");
let crops=[["01-west-labour-quarter",60,295,435,450],["02-upper-tool-cooperative",535,206,410,535],["03-reclaimer-exchange",981,323,447,516],["04-customs-abandoned-spur",1497,204,533,590],["05-causeway-underworks",95,697,1850,278]];
let images=[["overview",[0,0,W,H]],...crops.map(c=>[c[0],c.slice(1)])].map(([name,rect])=>{let data=png(g,rect),pixels=verifyPng(g,rect,data);return{name,rect,bytes:data,sha256:sha256(data),pixels};});
let receipt={concept:"Cleftline Logistics — Dispersed Reclamation Enclave / Workers' Causeways",original:true,seed:SEED,engine_sha:"de58bf1997ca75825cf3b29e046dc1c1022c45bf",source_reference_head:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",extent:[W,H],route_graph:{"main":["West labour arrival","Mooring stock levy","West refugee kitchen","First workers causeway","Cooperative tool loft","Coop trade table","Central rubble sluice","Reclaim exchange stalls","Eastern sort shed","Customs tally lodge","High outbound socket","Remote transit mouth"],"upper":["West canopy commons","Cooperative upper watch","Upper transit crossing","East suspended shelter","Derelict spur watch"],"lower":["West lower refuge","Causeway underpass","Reclaimer undercroft","East low retrieval"],"deep":["Deep west medical lock","Deep return coop","Deep eastern escape"]},material_ids:{"0":"Empty","100":"BasaltColumns Solid immovable None","58":"ReinforcedConcrete Solid immovable None","62":"SteelPlate Solid immovable None"},midge_authored_hull:[4,3],hull_envelopes:[[19,15],[23,19],[31,27]],exact_sites:sites,material_histogram:hist,stable_occupied_cells:area,grounded:area,detached_cells:0,pruned_disconnected_decor_cells:pruned,invalid_writes:0,rectangles:rect.length,rectangle_work:area,setup_bytes:jbytes.length,material_plane_sha256:sha256(g),setup_sha256:sha256(jbytes),clearance:status,obstruction:{material:58,rect:barrier,from:"West refugee kitchen",to:"Coop trade table",size:[31,27],sites_reached:detour.reached,unreachable:detour.bad,distance_before_after:routeDistance},images:images.map(z=>({name:z.name,rect:z.rect,bytes:z.bytes.length,sha256:z.sha256,pixel_parity:z.pixels})),native_status:"NATIVE-UNTESTED",bridge_source_max_rectangles:32768,proof:"Complete material plane, lossless disjoint Setup-v2 replay, exact conservative 19x15/23x19/31x27 routes, physical obstruction detour and indexed PNG integrity/parity"};
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
