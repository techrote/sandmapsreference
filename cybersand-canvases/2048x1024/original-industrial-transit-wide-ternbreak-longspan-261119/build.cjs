"use strict";
const lib=(function factory(){
"use strict";
const W=2048,H=1024,N=W*H,SEED=20261119,IDS=[0,100,58,62], M={AIR:0,ROCK:100,WALL:58,STEEL:62};
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
"West breakwater ingress":[110,457],"Quay manifest":[339,456],"Serviced barge workbay":[304,713],"Quayside crane crown":[483,285],
"High cargo inspection":[607,454],"West transfer ramp":[720,458],"Windward bridge cable":[835,275],"Cable-span centre":[1024,451],
"Suspended tally pod":[961,360],"Bridge underbeam":[1051,602],"Balance tower crown":[1311,283],"Freight balance receiver":[1383,459],
"Balance service staging":[1440,604],"Sorting control":[1601,455],"Downline catch siding":[1679,594],
"East dispatch loft":[1898,314],"Outbound freight gate":[1934,468],"Western service intake":[345,813],
"Gorge inspection artery":[1023,814],"Classifier return":[1628,815],"East recovery":[1889,814]};
function R(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);let a=Math.max(0,x),b=Math.min(W,x+w),c=Math.max(0,y),d=Math.min(H,y+h);if(a>=b||c>=d)return;for(let yy=c;yy<d;yy++)g.fill(m,yy*W+a,yy*W+b);}
function P(v,m){let lo=Math.max(0,Math.ceil(Math.min(...v.map(a=>a[1])))),hi=Math.min(H-1,Math.ceil(Math.max(...v.map(a=>a[1]))));for(let y=lo;y<=hi;y++){let xx=[];for(let j=0;j<v.length;j++){let a=v[j],b=v[(j+1)%v.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xx.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xx.sort((a,b)=>a-b);for(let j=0;j+1<xx.length;j+=2)R(Math.ceil(xx[j]),y,Math.floor(xx[j+1])-Math.ceil(xx[j])+1,1,m);}}
function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,rad=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-rad));yy<Math.min(H,Math.ceil(Math.max(y,Y)+rad+1));yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-rad));xx<Math.min(W,Math.ceil(Math.max(x,X)+rad+1));xx++){let s=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(d||1)));if((xx-x-s*dx)**2+(yy-y-s*dy)**2<=rad*rad)g[yy*W+xx]=m;}}
function ring(cx,cy,rx,ry,t,m){for(let y=Math.max(0,cy-ry);y<Math.min(H,cy+ry);y++)for(let x=Math.max(0,cx-rx);x<Math.min(W,cx+rx);x++){let n=((x-cx)/rx)**2+((y-cy)/ry)**2;if(n<=1&&n>=(1-t/Math.min(rx,ry))**2)g[y*W+x]=m;}}
// A unique sea-cliff to inland sorting transit geography: unusually deep central
// dry gorge, high cableway, unequal transfer towers, low live-rail underpass.
for(let x=0;x<W;x++){let floor=695+Math.round(12*Math.sin(x*.008)+8*Math.sin(x*.031));if(x>725&&x<1280){let a=Math.min(1,(x-725)/115,(1280-x)/115);floor+=Math.round(Math.max(0,a)*215);}if(x>1530)floor-=Math.round(Math.min(1,(x-1530)/300)*42);R(x,floor,1,H-floor,M.ROCK);if((x%31)<25)R(x,922+Math.round(7*Math.sin(x*.014)),1,8,M.WALL);}
R(0,980,2048,44,M.WALL);R(0,1012,2048,12,M.ROCK);
P([[0,1024],[0,364],[36,365],[60,411],[78,563],[82,730],[74,918]],M.ROCK);
P([[2048,1024],[2048,351],[2018,372],[2000,434],[1997,663],[2015,877]],M.ROCK);
// West hull and the cliff repair slip, different from Cinderwake's twin jaw.
P([[135,680],[184,663],[464,663],[497,695],[477,812],[152,813]],M.AIR);
R(141,799,334,14,M.STEEL);
P([[164,727],[189,753],[245,779],[351,781],[403,768],[446,720],[437,774],[397,799],[231,800],[184,784]],M.STEEL);
P([[195,742],[236,752],[358,752],[415,730],[397,764],[350,776],[245,772]],M.AIR);
L(188,762,248,786,10,M.WALL);L(248,786,370,785,10,M.STEEL);L(370,785,445,736,10,M.WALL);
for(let x of [208,262,372,420]){R(x,803,14,81,M.WALL);R(x-10,798,35,9,M.STEEL);}
P([[314,687],[321,659],[333,644],[395,642],[413,671],[405,694]],M.STEEL);
R(326,658,68,20,M.AIR);R(333,666,40,9,M.WALL);R(389,668,11,17,M.WALL);
R(319,700,97,8,M.STEEL);R(342,708,13,50,M.WALL);R(404,703,10,58,M.WALL);
R(365,720,44,32,M.AIR);R(367,746,42,8,M.STEEL);
for(let x of [168,458]){R(x,635,22,174,M.WALL);R(x-18,624,55,13,M.STEEL);}
R(118,603,107,14,M.STEEL);R(432,607,83,13,M.STEEL);
// Framed tidegate, boom and heavy three-leg intermodal ship crane.
R(472,222,29,467,M.WALL);R(479,229,14,455,M.STEEL);
L(486,232,280,316,14,M.STEEL);L(486,232,740,274,13,M.STEEL);
L(280,316,744,278,10,M.STEEL);L(488,240,641,305,7,M.WALL);
R(452,210,73,15,M.WALL);R(468,195,39,15,M.STEEL);
for(let x of [332,390,574,650]){L(x,307,x+31,252,6,M.WALL);L(x+31,252,x+62,303,6,M.STEEL);}
L(629,291,628,366,5,M.WALL);R(597,360,63,10,M.STEEL);
R(605,370,46,22,M.WALL);R(611,379,33,7,M.STEEL);
R(504,653,200,12,M.STEEL);R(518,665,184,9,M.WALL);
for(let x of [520,679]){R(x,631,23,86,M.WALL);R(x+6,643,10,60,M.STEEL);}
L(530,650,624,515,12,M.STEEL);L(622,516,697,650,11,M.STEEL);
R(539,516,114,11,M.WALL);R(549,525,95,7,M.STEEL);
R(548,531,98,32,M.STEEL);R(555,538,83,13,M.WALL);
for(let x of [560,622]){ring(x,570,13,13,6,M.WALL);R(x-5,565,10,10,M.STEEL);}
R(551,612,83,10,M.STEEL);R(564,595,55,15,M.WALL);
// Massive suspended TRANS-GORGE SPAN, grounded end-pylons and asymmetric
// hung sorting pods. Three independent levels: cable sky, rail lattice, undergorge.
for(let x of [703,1242]){R(x,294,25,449,M.WALL);R(x+7,303,10,430,M.STEEL);R(x-23,287,72,15,M.STEEL);}
for(let x=714;x<1260;x+=8){let X=Math.min(1260,x+8),f=a=>228+Math.round(91*(1-Math.pow((a-987)/275,2)));L(x,f(x),X,f(X),9,M.STEEL);}
L(715,233,692,333,11,M.WALL);L(1255,230,1271,327,11,M.WALL);
L(728,640,1243,642,17,M.STEEL);L(735,651,1234,653,6,M.WALL);
for(let x of [776,842,912,979,1050,1118,1191]){
 let f=228+Math.round(91*(1-Math.pow((x-987)/275,2)));
 L(x,f+7,x,375,5,M.WALL);
 L(x,373,x+35,424,8,M.STEEL);L(x+35,424,x+53,373,7,M.WALL);
}
for(let x of [761,925,1111]){L(x,641,x+65,582,9,M.STEEL);L(x+65,582,x+136,645,10,M.WALL);}
R(811,376,84,12,M.STEEL);R(821,388,66,32,M.WALL);R(826,393,56,17,M.AIR);
R(963,376,80,11,M.STEEL);R(972,388,62,22,M.WALL);R(978,394,48,10,M.AIR);
R(1132,374,78,12,M.STEEL);R(1140,386,62,28,M.WALL);R(1146,391,45,13,M.AIR);
L(845,380,845,421,6,M.STEEL);L(1003,379,1003,413,6,M.STEEL);L(1172,380,1172,414,6,M.STEEL);
for(let x of [780,871,1041,1197]){R(x,650,17,30,M.WALL);R(x+2,672,12,27,M.STEEL);}
// Tall offset balance tower, unique two-column rocker and flyable apertures.
P([[1283,689],[1288,270],[1304,227],[1324,247],[1331,690]],M.STEEL);
P([[1423,692],[1436,263],[1453,221],[1474,247],[1483,693]],M.WALL);
R(1301,232,161,18,M.STEEL);R(1317,250,133,9,M.WALL);
L(1311,233,1202,296,14,M.STEEL);L(1459,228,1555,299,12,M.STEEL);
L(1330,261,1427,308,12,M.WALL);L(1426,308,1350,373,10,M.STEEL);
R(1328,379,87,15,M.STEEL);R(1338,394,65,31,M.WALL);R(1344,401,53,15,M.AIR);
L(1369,255,1369,378,6,M.WALL);L(1419,270,1419,537,6,M.STEEL);
R(1396,535,45,13,M.STEEL);R(1403,548,31,47,M.WALL);
R(1405,556,27,22,M.AIR);R(1397,598,49,12,M.STEEL);
R(1246,648,260,20,M.WALL);R(1267,665,212,9,M.STEEL);
for(let x of [1281,1480]){R(x,660,20,91,M.WALL);R(x+5,681,11,61,M.STEEL);}
R(1340,623,100,12,M.STEEL);R(1353,635,74,7,M.WALL);
// East classification: descending through-rail AND visibly separate gravity
// catch line with a boxed switch frog, not cloned repeating wagons.
L(1488,657,1618,606,14,M.STEEL);L(1618,606,1840,641,14,M.STEEL);
L(1516,652,1650,687,7,M.WALL);L(1650,687,1763,729,9,M.STEEL);
R(1645,689,12,54,M.WALL);R(1752,723,12,42,M.WALL);
R(1753,719,28,9,M.STEEL);R(1760,710,9,8,M.WALL);
for(let [x,y,w] of [[1520,617,87],[1673,607,111],[1740,649,74]]){R(x,y,w,29,M.STEEL);R(x+8,y+5,w-16,13,M.WALL);for(let xx=x+17;xx<x+w-12;xx+=31){ring(xx,y+34,9,9,4,M.WALL);R(xx-3,y+30,6,6,M.STEEL);}}
R(1571,628,12,73,M.WALL);R(1701,629,14,76,M.WALL);
R(1560,350,31,316,M.STEEL);R(1568,357,14,294,M.WALL);
L(1570,351,1777,408,13,M.STEEL);L(1570,351,1511,409,10,M.WALL);
L(1510,410,1778,410,8,M.STEEL);for(let x of [1554,1653,1712]){L(x,410,x+30,363,5,M.WALL);L(x+30,363,x+55,410,5,M.STEEL);}
P([[1621,366],[1637,340],[1700,340],[1718,369],[1713,424],[1627,424]],M.WALL);
R(1640,361,63,37,M.AIR);R(1646,394,53,9,M.STEEL);R(1663,380,22,10,M.STEEL);
R(1669,367,9,14,M.WALL);L(1704,424,1711,603,10,M.WALL);
// East inland dispatch â paired high bay and joined side-enterable scan hall.
P([[1810,676],[1810,350],[1850,313],[1893,295],[1935,316],[1969,346],[1997,333],[2048,373],[2048,693]],M.WALL);
P([[1841,635],[1841,375],[1871,351],[1893,332],[1922,350],[1960,383],[1989,364],[2025,394],[2025,641]],M.AIR);
L(1841,371,1894,322,11,M.STEEL);L(1894,322,1971,364,11,M.STEEL);L(1971,364,2030,377,11,M.STEEL);
R(1839,627,179,15,M.STEEL);
for(let x of [1850,2012]){R(x,625,20,122,M.WALL);R(x+5,637,11,104,M.STEEL);}
R(1878,547,120,13,M.STEEL);R(1890,560,11,59,M.WALL);R(1986,561,10,65,M.WALL);
R(1906,573,64,29,M.WALL);R(1913,582,49,13,M.STEEL);R(1967,574,17,12,M.STEEL);
R(1894,403,106,12,M.STEEL);R(1906,415,12,45,M.WALL);R(1987,417,11,46,M.WALL);
R(1918,426,61,18,M.WALL);R(1922,430,53,8,M.STEEL);
R(1849,680,168,15,M.STEEL);
// Precisely excavated underground rescue/inspection artery, purpose-made
// irregular rooms below the lateral tunnel, and five separate open shafts.
R(82,777,1872,75,M.AIR);
for(let [x,w,h] of [[190,188,98],[545,145,125],[974,172,103],[1511,180,110],[1802,145,107]]){
 R(x,848,w,h,M.AIR);R(x,848+h-13,w,13,M.WALL);
}
for(let [x,top] of [[344,529],[734,543],[1220,540],[1632,529],[1879,523]])R(x-30,top,61,313,M.AIR);
// Each service room is visually and functionally different, no five-stamp pattern.
// Western bilge impeller and discharge to the boat slip.
ring(285,893,37,36,9,M.STEEL);R(276,919,17,36,M.WALL);
R(221,929,104,10,M.STEEL);R(232,937,11,21,M.WALL);R(303,936,11,20,M.WALL);
L(244,890,213,858,9,M.STEEL);L(322,891,369,873,10,M.STEEL);
// Marine manifest with triple unequal load ledges.
for(let [x,y,w] of [[552,887,71],[567,912,96],[554,941,79]]){R(x,y,w,9,M.STEEL);R(x+12,y+9,9,19,M.WALL);}
R(655,881,16,59,M.WALL);R(660,870,42,9,M.STEEL);
// Gorge winch and rescue cart.
ring(1038,899,28,27,7,M.STEEL);ring(1100,916,17,17,6,M.WALL);
L(1064,901,1096,915,8,M.STEEL);R(1011,930,132,12,M.STEEL);
R(1018,942,10,22,M.WALL);R(1127,941,9,23,M.WALL);
// Train control interlocking beneath sorting signal.
R(1536,915,108,11,M.STEEL);R(1548,926,10,20,M.WALL);
R(1626,926,10,20,M.WALL);R(1583,895,18,21,M.WALL);
L(1590,896,1622,865,5,M.STEEL);
// East recovery cross-dock.
R(1814,902,118,12,M.STEEL);R(1821,914,10,29,M.WALL);
R(1914,914,10,30,M.WALL);R(1836,883,89,17,M.WALL);
R(1842,874,68,9,M.STEEL);
for(let x of [1849,1903])ring(x,906,10,10,4,M.STEEL);
// Route pass-through windows and exact in-world destination pockets (never
// nearest-centre substitutions); all locations fixed in the published route graph.
for(let [n,[x,y]] of Object.entries(sites))R(x-23,y-25,47,51,M.AIR);
// Preserve material perimeter and avoid liquid/mobile IDs entirely.
R(0,990,2048,34,M.WALL);
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
function BFS(w,h,ob){let pass=new Uint8Array(N),seen=new Uint8Array(N),queue=new Int32Array(N),first=0,last=0;let ox=ob?.[0]||-1,oy=ob?.[1]||-1,ow=ob?.[2]||0,oh=ob?.[3]||0;for(let y=h>>1;y<H-(h>>1);y++)for(let x=w>>1;x<W-(w>>1);x++){if(!clear(x,y,w,h))continue;let left=x-(w>>1),top=y-(h>>1);if(ob&&left<ox+ow&&left+w>ox&&top<oy+oh&&top+h>oy)continue;pass[y*W+x]=1;}let spawn=sites["West breakwater ingress"],n=spawn[1]*W+spawn[0];if(!pass[n])return {size:[w,h],error:"spawn blocked",pos:spawn};seen[n]=1;queue[last++]=n;while(first<last){let a=queue[first++],x=a%W,y=(a/W)|0;for(let b of [a-W,a+W,a-1,a+1])if(b>=0&&b<N&&!(Math.abs(a-b)===1&&((b/W)|0)!==y)&&pass[b]&&!seen[b]){seen[b]=1;queue[last++]=b;}}let bad=Object.entries(sites).filter(([n,p])=>!seen[p[1]*W+p[0]]).map(([n,p])=>({name:n,xy:p,clear:clear(p[0],p[1],w,h)}));return {size:[w,h],reached:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,component:last,bad,pass,seen};}
let routes=[[19,15],[23,19],[31,27]].map(([w,h])=>BFS(w,h,null)),barrier=[876,402,84,118],detour=BFS(31,27,barrier);
function dist(pass,start,end){let a=start[1]*W+start[0],b=end[1]*W+end[0],seen=new Uint8Array(N),Q=new Int32Array(N),first=0,last=0;if(!pass[a]||!pass[b])return -1;Q[last++]=a;seen[a]=1;while(first<last){let n=Q[first++];if(n===b)return (seen[n]-1);let x=n%W,y=(n/W)|0;for(let v of [n-W,n+W,n-1,n+1])if(v>=0&&v<N&&!(Math.abs(n-v)===1&&((v/W)|0)!==y)&&pass[v]&&!seen[v]){seen[v]=seen[n]+1;Q[last++]=v;}}return -1;}
let start=sites["West breakwater ingress"],finish=sites["Outbound freight gate"];
let routeDistance=[dist(routes[2].pass,start,finish),dist(detour.pass,start,finish)];
let status=routes.map(r=>({size:r.size,reached:r.reached,total:r.total,free_centres:r.component,bad:r.bad,error:r.error||null}));
if(rect.length>32768||area>32000000)throw Error("budget "+rect.length+"/"+area);
const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:start,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false},json=JSON.stringify(setup),jbytes=utf8(json);
if(jbytes.length>1048576)throw Error("JSON over budget");
let crops=[["01-west-quay",82,191,548,625],["02-ternbreak-cableway",655,184,619,548],["03-balance-tower",1214,197,334,571],["04-gravity-classifier",1512,312,326,466],["05-east-dispatch",1792,285,256,520],["06-service-artery",840,733,476,288]];
let images=[["overview",[0,0,W,H]],...crops.map(c=>[c[0],c.slice(1)])].map(([name,rect])=>{let data=png(g,rect),pixels=verifyPng(g,rect,data);return{name,rect,bytes:data,sha256:sha256(data),pixels};});
let receipt={concept:"Ternbreak Longspan â High Freight Cableway over the Dry Salt Gorge",original:true,seed:SEED,engine_sha:"de109d0131641d6adc8d25bb9ced7ca3d4991105",source_reference_head:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",material_catalogue_blob:"dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3",setup_loader_blob:"70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9",extent:[W,H],material_ids:{"0":"Empty","100":"Basalt - Solid/None","58":"Hard wall - Solid/None","62":"structural solid - Solid/None"},midge_authored_hull:[4,3],hull_envelopes:[[19,15],[23,19],[31,27]],exact_sites:sites,material_histogram:hist,stable_occupied_cells:area,grounded:area,detached_cells:0,pruned_disconnected_decor_cells:pruned,rectangles:rect.length,rectangle_work:area,setup_bytes:jbytes.length,material_plane_sha256:sha256(g),setup_sha256:sha256(jbytes),clearance:status,obstruction:{material:58,rect:barrier,size:[31,27],sites_reached:detour.reached,unreachable:detour.bad,distance_before_after:routeDistance},images:images.map(z=>({name:z.name,rect:z.rect,bytes:z.bytes.length,sha256:z.sha256,pixel_parity:z.pixels})),native_status:"NATIVE-UNTESTED",bridge_source_max_rectangles:32768,installed_fallback_risk:4096,proof:"Full grid, zero-overlap rectangle replay, cardinal ground flood, fully in-bounds 4-connected centre BFS, deterministic indexed PNG CRC/Adler/full-pixel parity"};
return {g,rect,sites,crops,images,receipt,setup,json,jbytes,status,detour:{reached:detour.reached,bad:detour.bad,component:detour.component},distance:routeDistance,pruned};
}
return {generate,sha256,base64,utf8};
})();
if(typeof module!=="undefined"){module.exports=lib; if(require.main===module){const fs=require("fs"),path=require("path");const a=lib.generate(),p=__dirname;fs.writeFileSync(path.join(p,"setup-ternbreak.json"),a.json);for(const im of a.images)fs.writeFileSync(path.join(p,im.name+".png"),im.bytes);fs.writeFileSync(path.join(p,"receipt.json"),JSON.stringify(a.receipt,null,2)+"\n");console.log(JSON.stringify({rectangles:a.rect.length,setup_bytes:a.jbytes.length,sites:a.status,pixel_parity:a.receipt.images.map(x=>x.pixel_parity),sha:a.receipt.material_plane_sha256}));}}
