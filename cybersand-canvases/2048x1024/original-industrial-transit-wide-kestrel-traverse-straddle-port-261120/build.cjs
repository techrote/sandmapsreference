"use strict";
const lib=(function factory(){
"use strict";
const W=2048,H=1024,N=W*H,SEED=2026112004,IDS=[0,100,58,62], M={AIR:0,ROCK:100,WALL:58,STEEL:62};
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
function R(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);let a=Math.max(0,x),b=Math.min(W,x+w),c=Math.max(0,y),d=Math.min(H,y+h);if(a>=b||c>=d)return;for(let yy=c;yy<d;yy++)g.fill(m,yy*W+a,yy*W+b);}
function P(v,m){let lo=Math.max(0,Math.ceil(Math.min(...v.map(a=>a[1])))),hi=Math.min(H-1,Math.ceil(Math.max(...v.map(a=>a[1]))));for(let y=lo;y<=hi;y++){let xx=[];for(let j=0;j<v.length;j++){let a=v[j],b=v[(j+1)%v.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xx.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xx.sort((a,b)=>a-b);for(let j=0;j+1<xx.length;j+=2)R(Math.ceil(xx[j]),y,Math.floor(xx[j+1])-Math.ceil(xx[j])+1,1,m);}}
function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,rad=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-rad));yy<Math.min(H,Math.ceil(Math.max(y,Y)+rad+1));yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-rad));xx<Math.min(W,Math.ceil(Math.max(x,X)+rad+1));xx++){let s=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(d||1)));if((xx-x-s*dx)**2+(yy-y-s*dy)**2<=rad*rad)g[yy*W+xx]=m;}}
function ring(cx,cy,rx,ry,t,m){for(let y=Math.max(0,cy-ry);y<Math.min(H,cy+ry);y++)for(let x=Math.max(0,cx-rx);x<Math.min(W,cx+rx);x++){let n=((x-cx)/rx)**2+((y-cy)/ry)**2;if(n<=1&&n>=(1-t/Math.min(rx,ry))**2)g[y*W+x]=m;}}


// KESTREL TRAVERSE — from-scratch physical layout, strict x/y side elevation.
// Phases: native inert terrain; drydock; grounded straddle transfer; saddle-arch
// freight bridge; switchback classification; service-grade return.
const g=new Uint8Array(N);
const sites={
"Breakwater arrival":[120,440],"Ship service gangway":[310,570],
"Quay waybill office":[452,465],"Drydock keel service":[320,835],
"West sky lookout":[262,165],"Crane A-frame inspection":[689,171],
"Straddle load receiver":[738,451],"Straddle underframe":[789,624],
"Arch west approach":[968,455],"Underarch cargo sling":[1081,462],
"Void shipping lane":[1220,441],"Arch east approach":[1457,455],
"Switchback signalman":[1544,468],"Upper branch siding":[1640,389],
"Sorter transfer stage":[1723,522],"East freight manifest":[1848,472],
"Outbound customs":[1940,464],"Upper arch flyway":[1143,165],
"East roof lookout":[1785,166],"Pump repair station":[272,850],
"Portal motor chamber":[700,851],"Arch undercroft repair":[1180,852],
"Switchgear repair":[1590,852],"Outbound recovery bay":[1880,850]};
function B(x,y,w,h,m){R(x,y,w,h,m);}
function beam(x,y,X,Y,t,m){L(x,y,X,Y,t,m);}
function platform(x,y,w){R(x,y,w,12,M.STEEL);}
function cabinet(x,y,w,h){R(x,y,w,h,M.WALL);R(x+7,y+7,w-14,Math.max(5,h-15),M.STEEL);}
// Original landscape: ship repair crescent, inland rise, deep dry central cut.
for(let x=0;x<W;x++){
 let y=742+Math.round(11*Math.sin(x*.008)+6*Math.sin(x*.024));
 if(x>900&&x<1450)y+=Math.round(95*(1-Math.abs(x-1175)/275));
 if(x>1690)y-=Math.round(51*Math.min(1,(x-1690)/358));
 R(x,y,1,H-y,M.ROCK);
}
P([[0,1024],[0,339],[31,350],[57,399],[79,551],[99,767],[77,929]],M.ROCK);
P([[2048,1024],[2048,334],[2020,354],[2008,490],[2007,802],[2041,951]],M.ROCK);
R(0,991,W,33,M.WALL);
P([[126,613],[170,589],[468,589],[512,648],[502,801],[126,801]],M.AIR);
// Wide, genuinely traversable lower rail and five distinct service bays.
R(90,793,1860,94,M.AIR);
for(let [x,w] of [[154,235],[520,236],[931,321],[1470,224],[1794,179]]){
 R(x,858,w,112,M.AIR);R(x,958,w,13,M.STEEL);
}
// Sheer/hull; one aft pilot station, ribbed keel, repair blocks.
P([[155,711],[196,690],[303,691],[416,676],[468,698],[454,773],[403,797],[229,800],[175,755]],M.STEEL);
P([[180,717],[212,704],[418,706],[443,704],[437,753],[396,781],[230,784],[194,748]],M.WALL);
P([[205,715],[221,710],[403,710],[422,716],[413,754],[392,769],[229,770]],M.AIR);
platform(211,769,212);
P([[365,697],[365,622],[391,597],[417,604],[439,631],[446,693]],M.STEEL);
P([[379,684],[379,632],[398,615],[419,630],[429,649],[429,684]],M.AIR);
R(378,645,53,11,M.WALL);R(387,663,32,11,M.STEEL);
for(let x of [197,268,347,451]){R(x,800,16,89,M.WALL);beam(x-9,803,x+23,787,8,M.STEEL);}
cabinet(256,729,43,34);cabinet(327,733,44,28);
R(191,784,276,15,M.STEEL);
// Enterable waybill/work room at transfer, with actual cargo fork.
platform(459,577,113);R(461,589,15,72,M.WALL);R(559,589,14,72,M.WALL);
R(477,599,82,39,M.AIR);platform(475,639,93);
cabinet(492,609,24,25);cabinet(529,607,19,28);
beam(463,663,517,785,15,M.STEEL);
// Straddle port: massive two-founded portal, differentiated crane rail and cage.
// Not a cableway or bascule; stays stationary as authored physical geometry.
for(let x of [573,834]){R(x,268,27,443,M.WALL);R(x+8,281,11,405,M.STEEL);}
beam(587,273,680,176,18,M.STEEL);beam(680,176,848,271,17,M.WALL);
platform(595,245,251);R(672,177,66,21,M.WALL);
for(let k=0;k<7;k++){let x=607+k*32;beam(x,259,x+28,316,7,k%2?M.STEEL:M.WALL);}
for(let x of [658,751]){ring(x,271,23,22,9,M.STEEL);beam(x,292,x,491,7,M.STEEL);}
platform(639,497,144);R(653,513,120,60,M.WALL);
R(663,523,100,36,M.AIR);platform(641,584,146);
R(661,595,13,53,M.WALL);R(767,595,14,53,M.WALL);
platform(583,688,257);beam(590,703,640,785,14,M.STEEL);
beam(834,702,812,786,15,M.STEEL);
R(571,700,16,86,M.WALL);R(830,700,17,88,M.WALL);
beam(579,273,451,352,11,M.STEEL);beam(451,352,373,416,8,M.STEEL);
cabinet(657,465,45,19);cabinet(710,465,54,19);
// Iconic two-deck saddle-arch freight viaduct, inverted load slings, OPEN
// flying void beneath; rooted on two masonry anchor buttresses.
for(let x of [912,1450]){R(x,516,33,273,M.WALL);R(x+9,530,13,250,M.STEEL);}
function archY(x){return 331-149*Math.sin(Math.PI*(x-933)/535);}
for(let x=933;x<1468;x+=12){
 let X=Math.min(1468,x+12),y=archY(x),Y=archY(X);
 beam(x,y,X,Y,14,M.STEEL);beam(x,y+48,X,Y+48,9,M.WALL);
 beam(x,y+(Math.floor(x/12)%2?48:0),X,Y+(Math.floor(x/12)%2?0:48),6,M.STEEL);
}
beam(936,330,929,550,16,M.STEEL);beam(1467,330,1468,551,16,M.STEEL);
platform(927,557,548);R(966,569,454,11,M.WALL);
for(let x of [1018,1190,1339]){
 platform(x,582,90);cabinet(x+12,594,64,30);
 for(let xx of [x+19,x+70])ring(xx,635,11,11,5,M.STEEL);
}
for(let x of [938,1070,1289,1462]){beam(x,575,x,747,14,M.WALL);beam(x-20,732,x+23,751,8,M.STEEL);}
for(let [x,w] of [[963,105],[1168,123],[1371,87]]){
 platform(x,666,w);R(x+2,678,13,58,M.WALL);
 R(x+w-15,679,13,57,M.WALL);R(x+16,693,w-31,31,M.AIR);
 platform(x+16,728,w-31);
}
// Low rail follows true terrain: no perspective tops or fake floating splines.
beam(834,755,961,750,15,M.STEEL);beam(961,751,1200,763,16,M.STEEL);
beam(1200,763,1455,748,16,M.STEEL);
beam(1453,748,1518,728,14,M.STEEL);
// Switchback classification—instead of a wheel, four switch rails, three
// different wagon loads, an enterable interlocking cabin and signal.
beam(1514,703,1680,616,17,M.STEEL);beam(1680,616,1810,663,15,M.STEEL);
beam(1514,725,1723,713,12,M.WALL);beam(1723,714,1810,739,12,M.STEEL);
for(let [x,y,w] of [[1534,585,91],[1636,546,103],[1737,607,89]]){
 platform(x,y,w);cabinet(x+15,y-31,w-30,24);
 for(let xx of [x+22,x+w-22])ring(xx,y+9,13,12,5,M.WALL);
}
R(1540,449,17,259,M.WALL);R(1545,457,8,238,M.STEEL);
beam(1547,457,1607,403,10,M.STEEL);platform(1596,400,64);
R(1542,643,18,77,M.WALL);R(1633,643,16,79,M.WALL);
platform(1541,632,109);R(1562,656,64,41,M.AIR);
beam(1552,680,1612,609,10,M.STEEL);
beam(1609,605,1694,716,10,M.WALL);
beam(1698,717,1769,549,9,M.STEEL);
// Terminal three asymmetric stepped roof grades and interior examination.
P([[1812,692],[1812,407],[1852,360],[1904,341],[1952,374],[1990,412],[2048,411],[2048,710]],M.WALL);
P([[1840,660],[1843,438],[1872,390],[1911,377],[1940,403],[1964,447],[2009,446],[2009,664]],M.AIR);
platform(1818,657,198);platform(1840,539,166);
R(1854,550,14,87,M.WALL);R(1989,550,12,87,M.WALL);
R(1872,566,118,55,M.AIR);platform(1869,626,132);
platform(1867,414,127);R(1880,426,14,56,M.WALL);
R(1967,426,14,56,M.WALL);cabinet(1910,438,55,22);
platform(1862,595,106);R(1874,607,15,47,M.WALL);R(1953,606,13,48,M.STEEL);
R(1888,615,64,24,M.AIR);
beam(1882,748,1882,789,13,M.WALL);
// Five functional different mechanics in lower return, attached to floor:
platform(173,951,219);ring(244,923,32,28,9,M.STEEL);
beam(250,943,269,959,8,M.WALL);R(319,919,14,32,M.WALL);
platform(588,948,191);
for(let [x,r] of [[621,19],[681,29],[736,16]]){ring(x,919,r,r,7,M.STEEL);R(x-8,943,16,13,M.WALL);}
beam(626,920,727,919,8,M.WALL);
platform(997,952,337);ring(1082,922,38,26,9,M.WALL);
ring(1180,929,24,21,7,M.STEEL);beam(1117,925,1163,927,8,M.STEEL);
R(1011,933,16,19,M.WALL);R(1269,932,16,20,M.STEEL);
platform(1462,949,207);platform(1502,913,110);
beam(1515,927,1570,945,8,M.STEEL);R(1592,925,14,23,M.WALL);
platform(1772,949,185);platform(1800,915,133);
R(1810,926,14,22,M.STEEL);
for(let x of [1855,1912])ring(x,944,12,12,5,M.WALL);
// Deliberate structural grounding: continuous bedrock-linked load path, but
// reopen 75-cell wide vertical service shafts after construction.
beam(73,751,242,781,17,M.STEEL);beam(242,781,500,778,16,M.STEEL);
beam(500,778,590,748,16,M.WALL);beam(590,748,848,749,16,M.STEEL);
beam(848,750,935,764,14,M.WALL);beam(1455,752,1542,742,14,M.STEEL);
beam(1542,742,1838,746,14,M.STEEL);beam(1838,746,2027,737,15,M.WALL);
for(let [x,y] of [[586,700],[842,700],[926,724],[1468,709],[1816,690]])beam(x,y,x,765,12,M.WALL);
R(0,991,W,33,M.WALL);
// Actual free-centre passages and recovery at exact authored coordinates.
R(90,799,1860,81,M.AIR);
for(let [x,y] of [[305,745],[691,745],[1161,749],[1577,743],[1861,739]])R(x-38,y,77,141,M.AIR);
for(let [,s] of Object.entries(sites))R(s[0]-23,s[1]-25,47,51,M.AIR);


// Authorial full-hull doors, never nearest-centre substitutions:
// A 74-cell dockside descending service shaft, a shipyard-portal transverse
// service gate, the straddle-side cage recovery well, and east customs entry.
R(506,503,67,383,M.AIR);
R(548,412,98,108,M.AIR);
R(782,510,50,184,M.AIR);
R(1800,431,197,95,M.AIR);
// Redundant secondary underarch shaft into the real lower service rail.
R(1131,572,69,313,M.AIR);
// All exact targets remain at original authored coordinates.
for(let [,s] of Object.entries(sites))R(s[0]-23,s[1]-25,47,51,M.AIR);


// SECOND DESIGN PASS — MATERIAL-CELL OPERATIONS, NOT AN IMAGE OVERLAY.
// Make the drydocked ship load-bearing, inhabited and unambiguously separate
// from dock gantry hardware; keep a Midge-width 66-cell top access.
R(272,677,75,42,M.AIR);
R(218,751,183,13,M.STEEL);
for(let [x,w,h] of [[231,34,26],[277,46,31],[343,36,22]]){
 R(x,751-h,w,h,M.WALL);R(x+4,754-h,w-8,8,M.STEEL);
 R(x+9,746,11,8,M.STEEL);
}
R(352,613,86,11,M.STEEL);
R(357,626,11,53,M.WALL);R(427,626,11,53,M.WALL);
R(365,634,62,37,M.AIR);
R(371,643,20,12,M.WALL);R(397,643,22,12,M.WALL);
L(365,610,397,588,9,M.STEEL);L(397,588,435,611,10,M.STEEL);
R(409,563,13,38,M.WALL);R(406,559,21,8,M.STEEL);
R(436,681,14,21,M.STEEL);
L(435,702,475,664,9,M.STEEL);
// Dock cargo crane: asymmetric boom on the portal's grounded west footing,
// continuous trolley cable and a distinct locked container over manifest grade.
L(584,285,499,351,13,M.STEEL);L(499,351,419,420,11,M.WALL);
L(493,346,625,346,9,M.STEEL);ring(536,345,13,13,5,M.WALL);
L(534,356,534,524,6,M.STEEL);
R(502,526,65,11,M.STEEL);R(511,537,49,38,M.WALL);
R(518,542,35,10,M.STEEL);
L(525,574,525,640,9,M.WALL);
R(481,640,86,9,M.STEEL);
// Freight straddle platform receives and exports actual load cells.
// Join trolley sheaves to suspended cage instead of disconnected strokes.
L(658,480,658,532,10,M.STEEL);
L(751,480,751,529,10,M.STEEL);
R(670,565,92,13,M.STEEL);
R(682,576,72,33,M.WALL);
R(686,582,64,12,M.STEEL);
R(689,610,14,75,M.WALL);R(739,610,13,73,M.WALL);
R(669,672,99,12,M.STEEL);
R(606,650,45,17,M.WALL);R(614,643,30,10,M.STEEL);
L(624,669,624,684,9,M.STEEL);
// Arch load stations gain true tiedown connection to continuous mid-deck.
for(let x of [1018,1190,1339]){
 R(x+41,562,11,28,M.WALL);
 R(x+15,586,62,14,M.STEEL);
 R(x+19,600,54,18,M.WALL);
 R(x+24,607,44,7,M.STEEL);
 L(x+12,621,x+79,621,7,M.STEEL);
}
// Switchback load wagon/contact group, controlled yard switching frog.
for(let [x,y,w] of [[1534,585,91],[1636,546,103],[1737,607,89]]){
 R(x+19,y-26,w-38,26,M.WALL);
 R(x+24,y-22,w-48,9,M.STEEL);
 R(x+27,y+3,w-54,10,M.STEEL);
}
L(1524,705,1580,651,12,M.STEEL);
L(1580,651,1688,610,11,M.STEEL);
L(1580,651,1662,707,11,M.WALL);
R(1571,648,15,42,M.STEEL);
R(1685,612,16,91,M.WALL);
R(1689,696,19,25,M.STEEL);
// East examination conveyor / freight weighing scale has visible structure
// and attached drive stocks; preserve a wide actual side entry.
R(1880,566,98,12,M.STEEL);
R(1889,579,13,37,M.WALL);R(1964,579,13,38,M.WALL);
R(1909,592,44,12,M.WALL);R(1918,604,25,10,M.STEEL);
L(1863,633,1910,605,10,M.STEEL);
R(1850,641,145,12,M.STEEL);
R(1950,618,13,23,M.WALL);
R(1826,680,105,15,M.WALL);
L(1829,690,1885,752,9,M.STEEL);
// Revalidate fixed named workstations without snapping or substituting.
for(let [,s] of Object.entries(sites))R(s[0]-23,s[1]-25,47,51,M.AIR);


// Final physically authored bypasses post-detailing. Keep the laden crane
// module; use the dedicated outward 53-cell underbridge emergency descent
// instead of deleting the new manifest freight workface.
R(867,465,53,424,M.AIR);
R(553,412,94,115,M.AIR);
R(776,509,58,190,M.AIR);
// Preserve exact declared site centres; verify their entire hull envelopes.
for(let [,s] of Object.entries(sites))R(s[0]-23,s[1]-25,47,51,M.AIR);


// Straddle inside is an actual fly-through cargo portal, not a sealed display
// cage. Open a 102-cell longitudinal door through crossing cable planes;
// lower cage and adjacent right-hand recovery slot remain rooted.
R(626,404,204,103,M.AIR);
R(763,486,68,220,M.AIR);
for(let [,s] of Object.entries(sites))R(s[0]-23,s[1]-25,47,51,M.AIR);


// Actual culprit isolated by exact 31x27 centre scan: a 6-cell hoist cable at
// x534 split the apparently broad portal gate into separate air components.
// Recess it through a protected 48-cell-wide loading threshold.
R(510,411,50,105,M.AIR);
for(let [,s] of Object.entries(sites))R(s[0]-23,s[1]-25,47,51,M.AIR);


// Final rooted portal restoration after route excavations. The starboard
// column remains completely outside the 31x27 transverse flight doorway,
// transmitting the A-frame and carriage weight to native bedrock at x842.
R(839,259,23,519,M.WALL);R(846,277,9,491,M.STEEL);
R(836,765,37,17,M.STEEL);
R(577,245,275,16,M.STEEL);
L(581,247,669,180,16,M.STEEL);L(734,181,851,254,17,M.STEEL);
R(656,176,91,16,M.WALL);
for(let x of [646,757]){
 L(x,246,x,272,8,M.STEEL);
 ring(x,277,21,20,8,M.STEEL);
 L(x,296,x,395,6,M.STEEL);
}
for(let k=0;k<6;k++){let x=597+k*39;L(x,260,x+30,321,7,k%2?M.STEEL:M.WALL);}
L(842,276,842,723,9,M.STEEL);
// Distinguish the still-connected lower carriage platform from freely flying
// doorway with two short outer-side loadbearers and a guarded steel rail.
R(824,541,21,141,M.STEEL);
R(698,676,145,12,M.STEEL);
R(728,660,14,19,M.WALL);
L(790,684,842,684,10,M.STEEL);
// Exact authored target space always receives final physical clearance.
for(let [,s] of Object.entries(sites))R(s[0]-23,s[1]-25,47,51,M.AIR);


// The lower 81-cell rail deliberately disconnects vertical foundations from
// bedrock. Support the portal through a tensile upper transfer chord at y322
// to the already rooted saddle arch instead, ABOVE the x867 emergency shaft.
// This keeps BOTH the solid load path and lower Midge air route continuous.
L(849,316,944,335,18,M.STEEL);
L(849,332,939,370,11,M.WALL);
for(let [,s] of Object.entries(sites))R(s[0]-23,s[1]-25,47,51,M.AIR);


// West drydock transfer recovers through a full 70-cell-wide service well.
// Cargo cradle is held above the entrance by the portal's anchored beam.
// This connects free shipping air to all five underground chambers without
// cutting the grounded double-chord saddle arch or main crane's A-frame.
L(471,379,591,379,12,M.STEEL);
R(497,390,67,12,M.STEEL);R(505,402,52,19,M.WALL);
R(512,407,37,9,M.STEEL);
R(494,435,70,454,M.AIR);
for(const [,site] of Object.entries(sites))R(site[0]-23,site[1]-25,47,51,M.AIR);

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
let int=new Int32Array((W+1)*(H+1)),S=W+1;for(let y=1;y<=H;y++){let sum=0,o=(y-1)*W;for(let x=1;x<=W;x++){sum+=g[o+x-1]!==0?1:0;int[y*S+x]=int[(y-1)*S+x]+sum;}}
function clear(x,y,w,h){let a=x-(w>>1),b=y-(h>>1),c=a+w,d=b+h;return a>=0&&b>=0&&c<=W&&d<=H&&int[d*S+c]-int[d*S+a]-int[b*S+c]+int[b*S+a]===0;}
function BFS(w,h,ob){let pass=new Uint8Array(N),seen=new Uint8Array(N),queue=new Int32Array(N),first=0,last=0;let ox=ob?.[0]||-1,oy=ob?.[1]||-1,ow=ob?.[2]||0,oh=ob?.[3]||0;for(let y=h>>1;y<H-(h>>1);y++)for(let x=w>>1;x<W-(w>>1);x++){if(!clear(x,y,w,h))continue;let left=x-(w>>1),top=y-(h>>1);if(ob&&left<ox+ow&&left+w>ox&&top<oy+oh&&top+h>oy)continue;pass[y*W+x]=1;}let spawn=sites["Breakwater arrival"],n=spawn[1]*W+spawn[0];if(!pass[n])return {size:[w,h],error:"spawn blocked",pos:spawn};seen[n]=1;queue[last++]=n;while(first<last){let a=queue[first++],x=a%W,y=(a/W)|0;for(let b of [a-W,a+W,a-1,a+1])if(b>=0&&b<N&&!(Math.abs(a-b)===1&&((b/W)|0)!==y)&&pass[b]&&!seen[b]){seen[b]=1;queue[last++]=b;}}let bad=Object.entries(sites).filter(([n,p])=>!seen[p[1]*W+p[0]]).map(([n,p])=>({name:n,xy:p,clear:clear(p[0],p[1],w,h)}));return {size:[w,h],reached:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,component:last,bad,pass,seen};}
let routes=[[19,15],[23,19],[31,27]].map(([w,h])=>BFS(w,h,null)),barrier=[207,390,83,103],detour=BFS(31,27,barrier);
function dist(pass,start,end){let a=start[1]*W+start[0],b=end[1]*W+end[0],seen=new Int32Array(N),Q=new Int32Array(N),first=0,last=0;if(!pass[a]||!pass[b])return -1;Q[last++]=a;seen[a]=1;while(first<last){let n=Q[first++];if(n===b)return (seen[n]-1);let x=n%W,y=(n/W)|0;for(let v of [n-W,n+W,n-1,n+1])if(v>=0&&v<N&&!(Math.abs(n-v)===1&&((v/W)|0)!==y)&&pass[v]&&!seen[v]){seen[v]=seen[n]+1;Q[last++]=v;}}return -1;}
let start=sites["Breakwater arrival"],finish=sites["Quay waybill office"];
let routeDistance=[dist(routes[2].pass,start,finish),dist(detour.pass,start,finish)];
let status=routes.map(r=>({size:r.size,reached:r.reached,total:r.total,free_centres:r.component,bad:r.bad,error:r.error||null}));
if(rect.length>32768||area>32000000)throw Error("budget "+rect.length+"/"+area);
const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:start,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false},json=JSON.stringify(setup),jbytes=utf8(json);
if(jbytes.length>1048576)throw Error("JSON over budget");
let crops=[["01-west-drydock",108,390,423,440],["02-straddle-gantry",506,165,359,630],["03-saddle-arch",865,170,635,624],["04-switchback",1470,260,365,510],["05-east-dispatch",1790,285,258,514],["06-service-gallery",938,785,476,239]];
let images=[["overview",[0,0,W,H]],...crops.map(c=>[c[0],c.slice(1)])].map(([name,rect])=>{let data=png(g,rect),pixels=verifyPng(g,rect,data);return{name,rect,bytes:data,sha256:sha256(data),pixels};});
let receipt={concept:"Kestrel Traverse — Saddle-Arch Intermodal Straddle Port",original:true,seed:SEED,engine_sha:"de109d0131641d6adc8d25bb9ced7ca3d4991105",source_reference_head:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",material_catalogue_blob:"dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3",setup_loader_blob:"70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9",extent:[W,H],route_graph:{main:['Breakwater arrival','Quay waybill office','Straddle load receiver','Arch west approach','Void shipping lane','Arch east approach','Switchback signalman','East freight manifest','Outbound customs'],upper:['West sky lookout','Crane A-frame inspection','Upper arch flyway','East roof lookout'],lower:['Drydock keel service','Pump repair station','Portal motor chamber','Arch undercroft repair','Switchgear repair','Outbound recovery bay']},material_ids:{"0":"Empty","100":"Basalt - Solid/None","58":"Hard wall - Solid/None","62":"structural solid - Solid/None"},midge_authored_hull:[4,3],hull_envelopes:[[19,15],[23,19],[31,27]],exact_sites:sites,material_histogram:hist,stable_occupied_cells:area,grounded:area,detached_cells:0,pruned_disconnected_decor_cells:pruned,rectangles:rect.length,rectangle_work:area,setup_bytes:jbytes.length,material_plane_sha256:sha256(g),setup_sha256:sha256(jbytes),clearance:status,obstruction:{material:58,rect:barrier,from:"Breakwater arrival",to:"Quay waybill office",size:[31,27],sites_reached:detour.reached,unreachable:detour.bad,distance_before_after:routeDistance},images:images.map(z=>({name:z.name,rect:z.rect,bytes:z.bytes.length,sha256:z.sha256,pixel_parity:z.pixels})),native_status:"NATIVE-UNTESTED",bridge_source_max_rectangles:32768,installed_fallback_risk:4096,proof:"Full grid, zero-overlap rectangle replay, cardinal ground flood, fully in-bounds 4-connected centre BFS, deterministic indexed PNG CRC/Adler/full-pixel parity"};
return {g,rect,sites,crops,images,receipt,setup,json,jbytes,status,detour:{reached:detour.reached,bad:detour.bad,component:detour.component},distance:routeDistance,pruned};
}
return {generate,sha256,base64,utf8};
})();

if(typeof module!=="undefined"){module.exports=lib; if(require.main===module){const fs=require("fs"),path=require("path");const a=lib.generate(),p=__dirname;fs.writeFileSync(path.join(p,"setup-kestrel.json"),a.json);for(const im of a.images)fs.writeFileSync(path.join(p,im.name+".png"),im.bytes);fs.writeFileSync(path.join(p,"receipt.json"),JSON.stringify(a.receipt,null,2)+"\n");console.log(JSON.stringify({rectangles:a.rect.length,setup_bytes:a.jbytes.length,sites:a.status,pixel_parity:a.receipt.images.map(x=>x.pixel_parity),sha:a.receipt.material_plane_sha256}));}}
