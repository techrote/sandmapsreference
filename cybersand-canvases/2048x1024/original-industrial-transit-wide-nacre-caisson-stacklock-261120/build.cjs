"use strict";
const lib=(function factory(){
"use strict";
const W=2048,H=1024,N=W*H,SEED=2026112013,IDS=[0,100,58,62], M={AIR:0,ROCK:100,WALL:58,STEEL:62};
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
"Mooring Arrival":[151,409],"Dispatch Ledger":[378,409],
"Vessel Gangway":[332,568],"West Graving Hold":[335,740],
"Caisson Gate":[626,408],"Lift Counterweight":[863,591],
"Lift Inspection Loft":[735,217],"North Crane Catwalk":[348,216],
"Truss West Receiver":[1014,407],"Overcut Transit":[1181,407],
"Truss East Receiver":[1470,407],"Classifier Control":[1580,408],
"Hopper Access":[1615,590],"Dispatch Transfer":[1810,407],
"Outbound Manifest":[1891,407],"East Horizon Beacon":[1925,228],
"Upper Freight Traverse":[1228,228],"Underkeel Pump":[275,871],
"Hydraulic Service":[658,871],"Gantry Bearing Service":[1090,871],
"Rail Switch Workshop":[1518,871],"Reclamation Return":[1870,871]};
function R(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);
 let a=Math.max(0,x),b=Math.min(W,x+w),c=Math.max(0,y),d=Math.min(H,y+h);
 if(a>=b||c>=d)return;for(let yy=c;yy<d;yy++)g.fill(m,yy*W+a,yy*W+b);}
function P(v,m){let lo=Math.max(0,Math.ceil(Math.min(...v.map(a=>a[1])))),hi=Math.min(H-1,Math.ceil(Math.max(...v.map(a=>a[1]))));
 for(let y=lo;y<=hi;y++){let xx=[];for(let j=0;j<v.length;j++){let a=v[j],b=v[(j+1)%v.length];
 if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xx.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
 xx.sort((a,b)=>a-b);for(let j=0;j+1<xx.length;j+=2)R(Math.ceil(xx[j]),y,Math.floor(xx[j+1])-Math.ceil(xx[j])+1,1,m);}}
function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,rad=t/2;
 for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-rad));yy<Math.min(H,Math.ceil(Math.max(y,Y)+rad+1));yy++)
 for(let xx=Math.max(0,Math.floor(Math.min(x,X)-rad));xx<Math.min(W,Math.ceil(Math.max(x,X)+rad+1));xx++){
 let q=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(d||1)));
 if((xx-x-q*dx)**2+(yy-y-q*dy)**2<=rad*rad)g[yy*W+xx]=m;}}
function ring(x,y,rx,ry,t,m){for(let yy=Math.max(0,y-ry);yy<Math.min(H,y+ry);yy++)
 for(let xx=Math.max(0,x-rx);xx<Math.min(W,x+rx);xx++){
 let a=((xx-x)/rx)**2+((yy-y)/ry)**2;
 if(a<=1&&a>=(1-t/Math.min(rx,ry))**2)g[yy*W+xx]=m;}}
function boxCrate(x,y,w=63,h=28){R(x,y,w,h,M.WALL);R(x+5,y+5,w-10,8,M.STEEL);for(let z=x+15;z<x+w-7;z+=19)R(z,y+13,5,h-17,M.STEEL);}
function cabin(x,y,w=75,h=60){R(x,y,w,h,M.WALL);R(x+9,y+9,w-18,h-19,M.AIR);R(x+15,y+16,w-30,12,M.STEEL);R(x+8,y+h-13,w-16,13,M.STEEL);}
function plat(x,y,w,t=13){R(x,y,w,t,M.STEEL);}
function beam(x,y,X,Y,t=10){L(x,y,X,Y,t,M.STEEL);}
// NACRE CAISSON STACKLOCK — physically original transverse section:
// GRAVING SHIP -> RECTANGULAR LOCK/STACKLIFT -> TRUSS TRANSFER ->
// GRANULAR HOPPER/RAIL SORT -> CUSTOMS. Nothing uses perspective tops.
// Coastal geology starts compact, then radically deepens below freight line.
for(let x=0;x<W;x++){
 let z=775+Math.round(11*Math.sin(x*.011)+9*Math.sin(x*.027));
 if(x>900&&x<1510)z+=Math.round(77*Math.sin(Math.PI*(x-900)/610)**2);
 if(x>1600)z-=Math.round(40*Math.min(1,(x-1600)/448));
 R(x,z,1,H-z,M.ROCK);
}
P([[0,1024],[0,317],[35,326],[62,411],[87,671],[103,950]],M.ROCK);
P([[2048,1024],[2048,305],[2022,333],[2009,499],[1976,670],[1954,907]],M.ROCK);
R(0,974,W,50,M.WALL);
// Three distinct industrial voids: graving bed, caisson service pit, air cut.
P([[124,605],[174,578],[455,587],[513,658],[501,804],[125,809]],M.AIR);
P([[527,553],[589,529],[943,533],[998,610],[984,826],[531,827]],M.AIR);
P([[989,586],[1090,563],[1443,573],[1503,636],[1478,828],[1001,828]],M.AIR);
R(1492,604,443,210,M.AIR);
// Low recovery is an ACTUAL 100-cell corridor under the freight foundations.
R(103,834,1844,88,M.AIR);
R(122,925,1810,14,M.STEEL);
R(0,974,W,50,M.WALL);
// Boundary-founded continuous twin transfer chords provide physical attachment
// for the overhead workframes; high open sky remains passable at 1:1 scale.
R(75,139,1910,20,M.STEEL);
R(75,139,27,835,M.WALL);R(1957,145,27,830,M.WALL);
R(104,293,1838,12,M.STEEL);
for(let x of [235,500,825,1190,1530,1827])beam(x,160,x+82,291,9);
for(let x of [230,505,822,1165,1502,1820])beam(x+91,160,x+12,294,7);
// The serviced coastal hopper vessel is asymmetrical and properly distinct
// from surrounding graving supports. Three holds and an enclosed wheelhouse.
P([[161,698],[184,657],[221,643],[386,638],[452,663],[479,706],[453,777],[401,797],[225,802],[179,766]],M.STEEL);
P([[187,700],[212,670],[245,655],[387,654],[434,677],[452,710],[433,753],[398,779],[228,783]],M.WALL);
P([[210,710],[248,669],[386,670],[420,687],[429,716],[408,755],[229,759]],M.AIR);
plat(214,751,213);R(222,759,201,12,M.WALL);
for(let x of [227,293,359]){boxCrate(x,714,54,24);R(x+6,740,38,11,M.STEEL);}
P([[204,651],[202,577],[224,545],[267,553],[279,621],[278,650]],M.STEEL);
P([[215,634],[217,577],[234,562],[255,578],[266,634]],M.AIR);
R(218,603,44,12,M.STEEL);R(210,635,67,12,M.WALL);
R(166,792,330,15,M.STEEL);L(180,781,166,815,12,M.WALL);
R(123,785,61,16,M.STEEL);R(123,807,18,125,M.WALL);
L(441,786,488,763,14,M.STEEL);
// Ship-to-lock loading yard, separate crane and physically engaged spreader.
R(462,495,20,287,M.WALL);L(470,494,541,416,18,M.STEEL);
L(541,416,627,459,16,M.STEEL);L(541,429,544,546,9,M.STEEL);
ring(542,430,25,22,7,M.WALL);
plat(502,545,92);R(513,557,72,13,M.WALL);boxCrate(520,571,61,27);
R(495,605,15,180,M.WALL);R(584,603,13,179,M.WALL);
L(514,782,542,796,12,M.STEEL);
// Principal silhouette: a gigantic squared hydraulic caisson, NOT an arch,
// rotary wheel, bascule, inclined ship-tipper or repeated gondola.
R(557,252,29,539,M.WALL);R(921,242,31,557,M.WALL);
R(570,239,376,23,M.STEEL);
R(586,269,337,18,M.WALL);
R(581,767,357,23,M.STEEL);
L(571,247,647,164,16,M.STEEL);L(885,164,943,242,16,M.STEEL);
plat(630,316,264,15);
for(let x of [610,887]){R(x,298,17,467,M.STEEL);R(x+6,312,6,446,M.WALL);}
for(let x of [639,857]){R(x,337,18,311,M.WALL);R(x+7,351,7,286,M.STEEL);}
ring(715,315,29,27,10,M.STEEL);ring(826,314,29,27,10,M.STEEL);
L(714,342,714,541,8,M.STEEL);L(826,341,826,539,8,M.STEEL);
R(677,547,190,16,M.STEEL);R(684,565,175,56,M.WALL);
R(692,577,158,31,M.AIR);R(702,616,140,13,M.STEEL);
boxCrate(717,578,69,27);boxCrate(794,578,51,27);
R(699,636,20,120,M.WALL);R(839,635,20,123,M.WALL);
R(681,762,183,14,M.STEEL);
cabin(703,265,114,47);
R(603,626,32,128,M.STEEL);R(613,636,12,109,M.WALL);
R(870,629,27,129,M.STEEL);R(878,636,10,110,M.WALL);
L(610,297,688,331,9,M.STEEL);L(849,328,934,282,9,M.STEEL);
// Long DIFFERENTIATED double-rail box-truss rather than a cable/arch:
R(962,500,545,18,M.STEEL);R(962,566,545,16,M.WALL);
for(let x=969;x<1482;x+=52){
 beam(x,517,Math.min(1503,x+51),565,9);
 R(x+5,518,9,47,M.WALL);
}
for(let x of [998,1257,1471]){R(x,580,25,210,M.WALL);R(x+8,595,10,193,M.STEEL);}
L(952,511,1040,443,12,M.STEEL);L(1442,445,1513,513,12,M.WALL);
for(let [x,w] of [[1033,76],[1200,92],[1370,64]]){
 plat(x,483,w);boxCrate(x+8,454,w-15,27);
 for(let t of [x+19,x+w-19])ring(t,496,12,11,5,M.STEEL);
}
plat(1029,643,174);R(1041,657,17,85,M.WALL);
plat(1272,660,154);R(1395,674,17,83,M.WALL);
// Distinct wedge-bottom classifier/hopper: falling powder is NOT simulated;
// funnel, silo and entire load are fixed reinforced concrete/steel cells.
P([[1497,540],[1544,498],[1705,498],[1762,543],[1729,612],[1667,674],[1585,675],[1524,616]],M.STEEL);
P([[1521,541],[1553,519],[1689,519],[1737,547],[1711,604],[1663,646],[1593,646],[1541,602]],M.AIR);
R(1535,491,185,18,M.WALL);
for(let x of [1553,1626,1697]){R(x,532,17,85,M.WALL);L(x+3,612,1626,677,8,M.STEEL);}
R(1612,646,36,96,M.WALL);R(1623,654,14,84,M.STEEL);
plat(1544,706,216);
for(let [x,y] of [[1534,725],[1633,725],[1736,725]]){
 boxCrate(x,y,63,28);R(x-2,y+27,67,11,M.STEEL);
 for(let t of [x+15,x+48])ring(t,y+42,13,12,6,M.WALL);
}
L(1571,795,1603,780,12,M.STEEL);L(1703,788,1731,780,12,M.STEEL);
cabin(1752,611,70,54);
// Eastern customs: stepped container-inspection hall and physically entered
// shipping bay; no foreshortened platforms or decorative platform tops.
P([[1787,751],[1787,549],[1831,511],[1867,531],[1904,489],[1946,528],[1954,756]],M.WALL);
P([[1808,728],[1810,564],[1832,541],[1870,560],[1905,522],[1932,545],[1934,728]],M.AIR);
plat(1798,739,149);plat(1814,646,119);
R(1821,663,16,67,M.WALL);R(1924,663,13,71,M.WALL);
boxCrate(1842,693,69,26);
R(1831,677,89,12,M.STEEL);
R(1833,625,14,51,M.WALL);R(1915,627,13,48,M.WALL);
R(1836,615,95,13,M.STEEL);
R(1870,633,52,11,M.WALL);plat(1814,570,117);
L(1904,742,1958,785,13,M.STEEL);
// Underworks: five separate broad chambers with grounded different machines.
// Physical corridor sits above their workbenches, never behind a flat image.
for(let [x,w] of [[161,237],[525,248],[951,297],[1433,226],[1781,154]]){
 R(x,902,w,43,M.AIR);R(x,945,w,12,M.STEEL);
 R(x+9,958,15,17,M.WALL);R(x+w-23,958,15,17,M.WALL);
}
ring(237,933,23,22,7,M.STEEL);R(273,926,91,18,M.WALL);
L(249,949,292,957,8,M.WALL);
R(570,926,27,28,M.WALL);R(610,913,87,14,M.STEEL);
R(625,927,19,23,M.WALL);R(669,927,16,28,M.STEEL);
R(999,922,21,30,M.STEEL);ring(1092,934,33,21,8,M.WALL);
L(1118,930,1193,945,9,M.STEEL);
R(1475,914,90,15,M.WALL);L(1488,932,1544,951,11,M.STEEL);
R(1580,921,15,25,M.STEEL);
R(1814,927,84,14,M.WALL);R(1828,939,48,12,M.STEEL);
R(1903,917,13,28,M.WALL);
// Deliberately OPEN global flight ways; no fake "visited geometry".
// Main full-hull altitude, upper alternative and transversely separate lower.
R(109,358,1834,101,M.AIR);
R(110,208,1832,87,M.AIR);
R(105,836,1842,62,M.AIR);
for(let x of [153,371,714,1082,1556,1860]){
 R(x-38,287,77,191,M.AIR);
}
for(let x of [321,663,1092,1517,1860])R(x-39,461,79,439,M.AIR);
// A set of exact entered workfaces have true collision-free envelopes.
for(const p of Object.values(sites))R(p[0]-23,p[1]-25,47,51,M.AIR);
// Reinforce source-wide grounded chords, but leave explicit upper portals open.
R(75,139,1910,18,M.STEEL);R(75,140,27,833,M.WALL);
R(1957,142,27,831,M.WALL);
for(let x of [153,371,714,1082,1556,1860])R(x-37,284,75,48,M.AIR);
for(const p of Object.values(sites))R(p[0]-23,p[1]-25,47,51,M.AIR);

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
function BFS(w,h,ob){let pass=new Uint8Array(N),seen=new Uint8Array(N),queue=new Int32Array(N),first=0,last=0;let ox=ob?.[0]||-1,oy=ob?.[1]||-1,ow=ob?.[2]||0,oh=ob?.[3]||0;for(let y=h>>1;y<H-(h>>1);y++)for(let x=w>>1;x<W-(w>>1);x++){if(!clear(x,y,w,h))continue;let left=x-(w>>1),top=y-(h>>1);if(ob&&left<ox+ow&&left+w>ox&&top<oy+oh&&top+h>oy)continue;pass[y*W+x]=1;}let spawn=sites["Mooring Arrival"],n=spawn[1]*W+spawn[0];if(!pass[n])return {size:[w,h],error:"spawn blocked",pos:spawn};seen[n]=1;queue[last++]=n;while(first<last){let a=queue[first++],x=a%W,y=(a/W)|0;for(let b of [a-W,a+W,a-1,a+1])if(b>=0&&b<N&&!(Math.abs(a-b)===1&&((b/W)|0)!==y)&&pass[b]&&!seen[b]){seen[b]=1;queue[last++]=b;}}let bad=Object.entries(sites).filter(([n,p])=>!seen[p[1]*W+p[0]]).map(([n,p])=>({name:n,xy:p,clear:clear(p[0],p[1],w,h)}));return {size:[w,h],reached:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,component:last,bad,pass,seen};}
let routes=[[19,15],[23,19],[31,27]].map(([w,h])=>BFS(w,h,null)),barrier=[213,360,80,91],detour=BFS(31,27,barrier);
function dist(pass,start,end){let a=start[1]*W+start[0],b=end[1]*W+end[0],seen=new Int32Array(N),Q=new Int32Array(N),first=0,last=0;if(!pass[a]||!pass[b])return -1;Q[last++]=a;seen[a]=1;while(first<last){let n=Q[first++];if(n===b)return (seen[n]-1);let x=n%W,y=(n/W)|0;for(let v of [n-W,n+W,n-1,n+1])if(v>=0&&v<N&&!(Math.abs(n-v)===1&&((v/W)|0)!==y)&&pass[v]&&!seen[v]){seen[v]=seen[n]+1;Q[last++]=v;}}return -1;}
let start=sites["Mooring Arrival"],finish=sites["Dispatch Ledger"];
let routeDistance=[dist(routes[2].pass,start,finish),dist(detour.pass,start,finish)];
let status=routes.map(r=>({size:r.size,reached:r.reached,total:r.total,free_centres:r.component,bad:r.bad,error:r.error||null}));
if(status.some(x=>x.reached!==x.total)||detour.reached!==Object.keys(sites).length||routeDistance[0]<0||routeDistance[1]<=routeDistance[0])throw Error('Exact Midge clearance, route or obstruction qualification failure '+JSON.stringify({status,detour:detour.bad,routeDistance}));
if(rect.length>32768||area>32000000)throw Error("budget "+rect.length+"/"+area);
const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:start,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false},json=JSON.stringify(setup),jbytes=utf8(json);
if(jbytes.length>1048576)throw Error("JSON over budget");
let crops=[["01-graving-vessel",112,450,417,365],["02-caisson-stacklift",525,221,456,581],["03-truss-handoff",959,410,549,389],["04-hopper-classifier",1492,474,283,337],["05-east-customs",1770,469,278,338],["06-underworks",519,831,413,190]];
let images=[["overview",[0,0,W,H]],...crops.map(c=>[c[0],c.slice(1)])].map(([name,rect])=>{let data=png(g,rect),pixels=verifyPng(g,rect,data);return{name,rect,bytes:data,sha256:sha256(data),pixels};});
let receipt={concept:"Nacre Caisson — Drylock Ship Stacklift and Freight Truss",original:true,seed:SEED,engine_sha:"de109d0131641d6adc8d25bb9ced7ca3d4991105",source_reference_head:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",material_catalogue_blob:"dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3",setup_loader_blob:"70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9",extent:[W,H],route_graph:{main:["Mooring Arrival","Dispatch Ledger","Caisson Gate","Truss West Receiver","Overcut Transit","Truss East Receiver","Classifier Control","Dispatch Transfer","Outbound Manifest"],upper:["North Crane Catwalk","Lift Inspection Loft","Upper Freight Traverse","East Horizon Beacon"],lower:["Underkeel Pump","Hydraulic Service","Gantry Bearing Service","Rail Switch Workshop","Reclamation Return"]},material_ids:{"0":"Empty","100":"BasaltColumns Solid immovable None","58":"ReinforcedConcrete Solid immovable None","62":"SteelPlate Solid immovable None"},midge_authored_hull:[4,3],hull_envelopes:[[19,15],[23,19],[31,27]],exact_sites:sites,material_histogram:hist,stable_occupied_cells:area,grounded:area,detached_cells:0,pruned_disconnected_decor_cells:pruned,rectangles:rect.length,rectangle_work:area,setup_bytes:jbytes.length,material_plane_sha256:sha256(g),setup_sha256:sha256(jbytes),clearance:status,obstruction:{material:58,rect:barrier,from:"West launch",to:"Harbour clearance",size:[31,27],sites_reached:detour.reached,unreachable:detour.bad,distance_before_after:routeDistance},images:images.map(z=>({name:z.name,rect:z.rect,bytes:z.bytes.length,sha256:z.sha256,pixel_parity:z.pixels})),native_status:"NATIVE-UNTESTED",bridge_source_max_rectangles:32768,installed_fallback_risk:4096,proof:"Exhaustive material-ID grid, disjoint ordered rectangle replay, full in-bounds three-envelope 4-BFS, obstacle return, verified indexed PNG CRC/zlib/Adler/pixel parity"};
return {g,rect,sites,crops,images,receipt,setup,json,jbytes,status,detour:{reached:detour.reached,bad:detour.bad,component:detour.component},distance:routeDistance,pruned};
}
return {generate,sha256,base64,utf8};
})();
if(typeof module!=="undefined"){
 module.exports=lib;
 if(require.main===module){
  const fs=require("fs"),path=require("path");
  const a=lib.generate(),p=__dirname,verify=process.argv.includes("--verify");
  const outputs=[["setup-nacre-caisson.json",Buffer.from(a.json,"utf8")],
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
