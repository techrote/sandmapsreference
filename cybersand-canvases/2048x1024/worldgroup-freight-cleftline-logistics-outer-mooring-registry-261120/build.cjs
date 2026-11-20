"use strict";
const lib=(function factory(){
"use strict";
const W=2048,H=1024,N=W*H,SEED=0xC1EF112,IDS=[0,100,58,62], M={AIR:0,ROCK:100,WALL:58,STEEL:62};
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
const g=new Uint8Array(N),sites={"Mooring arrivals":[114,501],"Quay manifest office":[291,508],"West mooring control":[342,266],"Salt basin dock":[377,636],"Customs tally desk":[551,505],"Weighgate inspection":[721,508],"Raised audit bridge":[755,255],"Weigh cradle service":[671,633],"Ballast master valve":[907,502],"Transfer cistern":[1118,635],"Remote pump keeper":[1156,506],"Tide monitor cupola":[1315,255],"Hydraulic separator":[1372,772],"Ballast subfloor gallery":[1006,774],"Freight lane sorter":[1532,505],"Signal mezzanine":[1588,260],"Outbound railway":[1779,505],"East sail dispatch":[1914,505],"West service return":[252,772],"Weigh pit return":[660,773],"Pump recovery":[1121,774],"East service return":[1824,772],"Emergency lifeboat quay":[146,655],"Cargo reconciliation":[1701,636]};
function R(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);let a=Math.max(0,x),b=Math.min(W,x+w),c=Math.max(0,y),d=Math.min(H,y+h);if(a>=b||c>=d)return;for(let yy=c;yy<d;yy++)g.fill(m,yy*W+a,yy*W+b);}
function P(v,m){let lo=Math.max(0,Math.ceil(Math.min(...v.map(a=>a[1])))),hi=Math.min(H-1,Math.ceil(Math.max(...v.map(a=>a[1]))));for(let y=lo;y<=hi;y++){let xx=[];for(let j=0;j<v.length;j++){let a=v[j],b=v[(j+1)%v.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xx.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xx.sort((a,b)=>a-b);for(let j=0;j+1<xx.length;j+=2)R(Math.ceil(xx[j]),y,Math.floor(xx[j+1])-Math.ceil(xx[j])+1,1,m);}}
function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,rad=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-rad));yy<Math.min(H,Math.ceil(Math.max(y,Y)+rad+1));yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-rad));xx<Math.min(W,Math.ceil(Math.max(x,X)+rad+1));xx++){let s=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(d||1)));if((xx-x-s*dx)**2+(yy-y-s*dy)**2<=rad*rad)g[yy*W+xx]=m;}}
function ring(cx,cy,rx,ry,t,m){for(let y=Math.max(0,cy-ry);y<Math.min(H,cy+ry);y++)for(let x=Math.max(0,cx-rx);x<Math.min(W,cx+rx);x++){let n=((x-cx)/rx)**2+((y-cy)/ry)**2;if(n<=1&&n>=(1-t/Math.min(rx,ry))**2)g[y*W+x]=m;}}





/* CLEFTLINE LOGISTICS / OUTER MOORING REGISTRY AND BALLAST EXCHANGE.
   Distinct landside quayside world; no arkship in ravine and no tipped hull.
   Side elevation, hand-authored workfaces and machinery. */
function steel(x,y,w,h){R(x,y,w,h,M.STEEL);}
function wall(x,y,w,h){R(x,y,w,h,M.WALL);}
function basalt(x,y,w,h){R(x,y,w,h,M.ROCK);}
function cut(x,y,w,h){R(x,y,w,h,M.AIR);}
function brace(x,y,X,Y,t=9){L(x,y,X,Y,t,M.STEEL);}
function cage(x,y,w,h){wall(x,y,w,h);cut(x+9,y+10,w-18,h-16);steel(x+6,y+h-13,w-12,9);for(let q=x+14;q<x+w-14;q+=31)steel(q,y+14,5,16);}
function crate(x,y,w,h){steel(x,y,w,h);wall(x+6,y+7,w-12,h-14);steel(x+11,y+10,5,h-18);steel(x+w-17,y+10,5,h-18);}
function dial(x,y,r=17){ring(x,y,r,r,7,M.STEEL);ring(x,y,r-8,r-8,4,M.WALL);brace(x-r+3,y,x+r-3,y,3);}
function cantilever(x,top,h){wall(x,top,18,h);steel(x+6,top+5,5,h-12);brace(x-28,top+20,x+24,top+52,7);}
function rail(x,y,w){steel(x,y,w,10);for(let q=x+16;q<x+w-15;q+=50)steel(q,y+11,8,15);}
/* Geologically founded terraced basin, distinct from Graven Keel shipbreaker. */
for(let x=0;x<W;x++){let y=816+Math.round(22*Math.sin(x/183)+8*Math.sin(x/31));
  if(x>780&&x<1400)y+=Math.round(48*Math.sin(Math.PI*(x-780)/620)**2);
  basalt(x,y,1,H-y);
}
P([[0,676],[68,669],[124,714],[132,1024],[0,1024]],M.ROCK);
P([[2048,673],[1983,688],[1950,744],[1938,1024],[2048,1024]],M.ROCK);
wall(0,997,W,27);
steel(72,982,1892,13);
/* Entire lower transfer culvert and maritime emergency return. */
cut(84,745,1881,72);
for(const [x,y,w] of [[110,611,19],[403,666,23],[499,577,20],[793,618,27],
 [1044,650,26],[1341,659,27],[1514,632,25],[1703,626,25],[1913,608,21]]){
 wall(x,y,w,989-y);steel(x+6,y+7,5,970-y);
}
rail(120,709,372); rail(524,719,310); rail(873,704,517);rail(1411,713,493);
/* Low western quayside: open bollards, buoy winch, life raft, cargo slabs. */
P([[146,658],[164,612],[224,597],[426,622],[451,681],[442,711],[156,708]],M.STEEL);
P([[166,645],[191,623],[409,637],[430,679],[412,693],[178,694]],M.WALL);
cut(178,647,231,41);
for(let x of [184,292,403]){wall(x,626,13,68);steel(x-9,621,31,10);}
brace(191,625,243,559,9);brace(243,559,322,584,7);dial(253,565,17);
crate(270,677,61,30);crate(340,677,47,27);
steel(148,677,39,9);wall(159,657,11,22);
steel(410,626,18,20);
cage(220,521,171,75);
rail(172,609,248);
for(let k=0;k<6;k++)steel(235+25*k,557,7,13);
/* Wide customs/audit house: two physically separate bays, offset windows. */
P([[483,640],[482,477],[524,447],[756,448],[783,489],[784,647]],M.WALL);
P([[505,621],[507,482],[528,468],[743,468],[762,495],[760,620]],M.AIR);
steel(493,631,282,16);steel(505,557,260,12);
wall(534,562,13,69);wall(744,562,12,69);
cut(520,485,222,49);cut(510,570,249,51);
crate(562,597,44,25);crate(633,597,51,24);dial(704,593,14);
for(let x of [546,609,671,729])steel(x,483,5,24);
brace(491,478,536,451,11);brace(743,451,782,488,11);
/* Weighgate: tall slender counterweight crane and stepped inspection mast. */
cantilever(793,307,377);
cantilever(863,362,297);
brace(803,331,853,296,10);steel(808,296,80,13);
steel(812,370,185,13);
brace(871,369,981,452,12);
wall(854,385,47,39);cut(863,393,28,24);
dial(848,404,20);
L(953,381,953,591,7,M.STEEL);
steel(917,598,100,13);wall(936,610,13,46);wall(995,610,11,46);
crate(918,575,56,24);
/* Ballast exchange is a LOW, excavated basin: twin tall cylindrical cisterns
   braced into founded load walls rather than a floating ship silhouette. */
P([[913,688],[932,579],[985,540],[1266,541],[1345,599],[1368,680],
 [1329,726],[942,722]],M.WALL);
P([[938,676],[952,603],[992,567],[1249,568],[1324,613],[1337,676],
 [1318,708],[960,708]],M.AIR);
wall(946,689,379,17);steel(953,702,359,11);
for(const [cx,cy,rx,ry] of [[1066,617,57,83],[1222,618,61,84]]){
 ring(cx,cy,rx,ry,11,M.STEEL);ring(cx,cy,rx-18,ry-18,6,M.WALL);
 steel(cx-7,cy+ry-1,14,56);
 for(let x of [-25,0,25])steel(cx+x,cy-41,5,22);
}
steel(1038,651,217,13);
for(let x of [979,1330]){wall(x,531,20,204);steel(x+5,538,6,181);}
rail(893,538,470);
dial(1160,547,19);
brace(1001,521,1121,447,11);brace(1121,447,1279,523,9);
wall(1104,453,35,31);cut(1112,459,19,18);
/* Pump/tide process rack with physically distinguishable equipment. */
wall(828,646,86,23);dial(855,655,16);
for(let x of [916,949,982]){steel(x,650,8,39);steel(x-5,650,18,7);}
wall(1390,596,91,51);cut(1401,605,69,30);
for(let i=0;i<5;i++){steel(1404+i*13,609,7,17);}
/* Raised port authority signal bridge: airy, transverse stepped gantry. */
brace(278,625,308,284,13);brace(308,284,442,338,10);steel(297,281,153,13);
cage(305,234,114,65);
steel(295,216,151,14);brace(333,219,352,176,6);steel(342,170,27,13);
cage(701,213,102,65);steel(695,199,119,15);
brace(726,290,735,441,8);
brace(1265,581,1295,232,13);brace(1295,232,1393,277,10);
cage(1269,194,131,77);steel(1256,186,149,16);
steel(1305,164,7,25);steel(1321,142,46,13);
dial(1355,208,12);
/* Eastern freight classifier: non-tip weigh-bogie, hand-off crane, rail lift. */
P([[1423,697],[1439,527],[1474,480],[1647,484],[1689,532],[1693,699]],M.WALL);
P([[1443,677],[1459,549],[1490,504],[1630,508],[1668,551],[1672,676]],M.AIR);
steel(1440,682,241,15);steel(1455,605,217,12);
crate(1474,634,51,31);crate(1572,635,66,28);
wall(1493,615,12,59);wall(1625,615,12,61);
steel(1488,579,144,13);dial(1573,585,18);
cantilever(1470,336,350);cantilever(1651,376,312);
brace(1478,338,1552,268,11);brace(1552,268,1661,374,11);
steel(1535,261,57,14);
cage(1543,230,104,63);
L(1613,296,1613,558,6,M.STEEL);
/* Dispatch: broad asymmetric stepped container transit instead of a crane bay. */
P([[1691,695],[1709,516],[1763,470],[1803,489],[1827,449],
 [1894,465],[1952,519],[1960,696]],M.WALL);
P([[1716,675],[1731,543],[1770,496],[1793,509],[1844,470],
 [1886,490],[1928,538],[1938,676]],M.AIR);
steel(1712,678,230,17);steel(1736,611,181,12);
crate(1764,646,69,29);crate(1850,644,45,29);
cage(1795,547,114,60);
rail(1692,692,258);
brace(1733,523,1780,495,8);brace(1878,475,1936,535,8);
/* Underworks: entered distinct repair stages—not duplicate circles. */
for(const [x,y,w] of [[198,820,177],[540,816,263],[870,814,330],[1260,818,272],[1690,812,215]]){
 wall(x,y,w,20);steel(x+17,y+21,12,63);steel(x+w-29,y+21,11,64);
}
dial(266,848,21);steel(296,845,64,13);wall(328,858,17,53);
steel(603,839,149,13);dial(715,849,21);wall(630,854,12,47);
for(let x of [951,999,1047])wall(x,850,15,48);
steel(920,844,188,12);dial(1120,875,21);
wall(1309,852,19,54);brace(1335,863,1426,899,10);crate(1459,857,53,31);
steel(1722,847,125,14);wall(1735,865,17,51);dial(1860,875,20);
/* Strong accessible trunk/underfloor routes cut into real physical geometry,
   followed by portals on each genuine room/workface. */
cut(90,403,1875,81);
cut(92,716,1842,85);
for(const [x,top] of [[148,450],[433,493],[599,505],[811,480],[1113,493],
 [1361,500],[1552,489],[1825,486]])cut(x-34,top,69,288);
for(const [x,y] of Object.values(sites))cut(x-23,y-20,47,41);
/* Open the special upper-level channels, but keep gallery/pilot workfaces. */
cut(122,313,1776,59);
for(const [x,top] of [[339,270],[756,264],[1314,269],[1585,272]])cut(x-32,top,65,168);
/* Final founded base remains continuous under all maintenance culverts. */
wall(0,997,W,27);

/* Grounded service port lattice and wide, explicit through-gates. */
steel(125,385,1778,13);steel(120,704,1815,14);
for(const x of [444,812,1401,1669,1934]){wall(x,380,17,608);steel(x+5,393,6,588);}
brace(329,289,351,387,10);brace(747,283,779,385,10);
brace(1324,273,1293,389,12);brace(1590,292,1561,389,9);
brace(238,612,253,706,9);brace(534,618,558,704,10);
brace(739,625,759,704,10);brace(1035,700,1085,704,11);
brace(1449,688,1449,708,10);brace(1804,682,1816,706,10);
for(const x of [299,642,1030,1493,1814])cut(x-46,375,93,65);
for(const x of [298,620,1084,1508,1831])cut(x-46,695,93,56);
cut(336,485,74,303); /* lower-left dock-to-service rescue shaft */
/* Four entered, separately engineered port-authority watch stations.
   Deliberately generous physical side portals are essential for Midge. */
function pod(x,y,w,h){
 steel(x,y,w,11);wall(x,y+11,13,h-11);wall(x+w-13,y+11,13,h-11);
 steel(x,y+h-12,w,12);
 cut(x-2,y+20,36,67);cut(x+w-34,y+20,36,67);
}
pod(275,206,159,105);steel(296,243,24,12);wall(310,256,12,21);
steel(395,242,27,7);brace(292,308,325,386,10);
pod(685,190,150,110);steel(701,240,29,9);wall(787,242,27,10);
brace(784,296,770,385,11);
pod(1236,174,173,119);dial(1269,230,14);steel(1367,233,28,11);
wall(1346,258,12,16);brace(1314,290,1279,386,10);
pod(1512,201,153,110);steel(1535,245,28,10);
for(let i=0;i<3;i++)wall(1604+i*12,247,7,17);
brace(1585,307,1558,386,10);
/* Keep exact destinations genuinely accessible after structural tie-ins. */
for(const [x,y] of Object.values(sites))cut(x-24,y-22,49,45);

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
function BFS(w,h,ob){let pass=new Uint8Array(N),seen=new Uint8Array(N),queue=new Int32Array(N),first=0,last=0;let ox=ob?.[0]||-1,oy=ob?.[1]||-1,ow=ob?.[2]||0,oh=ob?.[3]||0;for(let y=h>>1;y<H-(h>>1);y++)for(let x=w>>1;x<W-(w>>1);x++){if(!clear(x,y,w,h))continue;let left=x-(w>>1),top=y-(h>>1);if(ob&&left<ox+ow&&left+w>ox&&top<oy+oh&&top+h>oy)continue;pass[y*W+x]=1;}let spawn=sites["Mooring arrivals"],n=spawn[1]*W+spawn[0];if(!pass[n])return {size:[w,h],error:"spawn blocked",pos:spawn};seen[n]=1;queue[last++]=n;while(first<last){let a=queue[first++],x=a%W,y=(a/W)|0;for(let b of [a-W,a+W,a-1,a+1])if(b>=0&&b<N&&!(Math.abs(a-b)===1&&((b/W)|0)!==y)&&pass[b]&&!seen[b]){seen[b]=1;queue[last++]=b;}}let bad=Object.entries(sites).filter(([n,p])=>!seen[p[1]*W+p[0]]).map(([n,p])=>({name:n,xy:p,clear:clear(p[0],p[1],w,h)}));return {size:[w,h],reached:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,component:last,bad,pass,seen};}
let routes=[[19,15],[23,19],[31,27]].map(([w,h])=>BFS(w,h,null)),barrier=[178,459,66,94],detour=BFS(31,27,barrier);
function dist(pass,start,end){let a=start[1]*W+start[0],b=end[1]*W+end[0],seen=new Int32Array(N),Q=new Int32Array(N),first=0,last=0;if(!pass[a]||!pass[b])return -1;Q[last++]=a;seen[a]=1;while(first<last){let n=Q[first++];if(n===b)return (seen[n]-1);let x=n%W,y=(n/W)|0;for(let v of [n-W,n+W,n-1,n+1])if(v>=0&&v<N&&!(Math.abs(n-v)===1&&((v/W)|0)!==y)&&pass[v]&&!seen[v]){seen[v]=seen[n]+1;Q[last++]=v;}}return -1;}
let start=sites["Mooring arrivals"],finish=sites["Quay manifest office"];
let routeDistance=[dist(routes[2].pass,start,finish),dist(detour.pass,start,finish)];
let status=routes.map(r=>({size:r.size,reached:r.reached,total:r.total,free_centres:r.component,bad:r.bad,error:r.error||null}));
if(status.some(x=>x.reached!==x.total)||detour.reached!==Object.keys(sites).length||routeDistance[0]<0||routeDistance[1]<=routeDistance[0])throw Error('Exact Midge clearance, route or obstruction qualification failure '+JSON.stringify({status,detour:detour.bad,routeDistance}));
if(rect.length>32768||area>32000000)throw Error("budget "+rect.length+"/"+area);
const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:start,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false},json=JSON.stringify(setup),jbytes=utf8(json);
if(jbytes.length>1048576)throw Error("JSON over budget");
let crops=[["01-tally-quay",144,424,360,333],["02-customs-weighgate",479,228,421,490],["03-ballast-exchange",900,420,488,330],["04-classifier-dispatch",1415,223,555,495],["05-service-culverts",190,710,1600,240]];
let images=[["overview",[0,0,W,H]],...crops.map(c=>[c[0],c.slice(1)])].map(([name,rect])=>{let data=png(g,rect),pixels=verifyPng(g,rect,data);return{name,rect,bytes:data,sha256:sha256(data),pixels};});
let receipt={concept:"Cleftline Logistics — Outer Mooring Registry and Ballast Exchange",original:true,seed:SEED,engine_sha:"7b03aa437561ec63e31fd09531171360ab60eeb4",source_reference_head:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",material_catalogue_blob:"dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3",setup_loader_blob:"70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9",extent:[W,H],route_graph:{"main":["Mooring arrivals","Quay manifest office","Customs tally desk","Weighgate inspection","Ballast master valve","Remote pump keeper","Freight lane sorter","Outbound railway","East sail dispatch"],"upper":["West mooring control","Raised audit bridge","Tide monitor cupola","Signal mezzanine"],"lower":["West service return","Weigh pit return","Ballast subfloor gallery","Hydraulic separator","East service return"]},material_ids:{"0":"Empty","100":"BasaltColumns Solid immovable None","58":"ReinforcedConcrete Solid immovable None","62":"SteelPlate Solid immovable None"},midge_authored_hull:[4,3],hull_envelopes:[[19,15],[23,19],[31,27]],exact_sites:sites,material_histogram:hist,stable_occupied_cells:area,grounded:area,detached_cells:0,pruned_disconnected_decor_cells:pruned,rectangles:rect.length,rectangle_work:area,setup_bytes:jbytes.length,material_plane_sha256:sha256(g),setup_sha256:sha256(jbytes),clearance:status,obstruction:{material:58,rect:barrier,from:"Mooring arrivals",to:"Quay manifest office",size:[31,27],sites_reached:detour.reached,unreachable:detour.bad,distance_before_after:routeDistance},images:images.map(z=>({name:z.name,rect:z.rect,bytes:z.bytes.length,sha256:z.sha256,pixel_parity:z.pixels})),native_status:"NATIVE-UNTESTED",bridge_source_max_rectangles:32768,installed_fallback_risk:4096,proof:"Exhaustive material-ID grid, disjoint ordered rectangle replay, full in-bounds three-envelope 4-BFS, obstacle return, verified indexed PNG CRC/zlib/Adler/pixel parity"};
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
