"use strict";
const lib=(function factory(){
"use strict";
const W=2048,H=1024,N=W*H,SEED=20261120,IDS=[0,100,58,62], M={AIR:0,ROCK:100,WALL:58,STEEL:62};
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
"Western arrival buoy":[112,447],"Berth customs manifest":[333,465],
"Ship cutaway workface":[310,713],"Quay crane sky inspection":[470,205],
"Rail lift receiver":[652,460],"Lift upper service":[706,220],
"Western bascule hinge":[849,463],"Western raised leaf":[983,342],
"Channel free throat":[1095,474],"Eastern raised leaf":[1214,337],
"Eastern bascule hinge":[1369,462],"Rotary outer inspection":[1450,475],
"Rotary internal bay":[1600,489],"Sorting frog operator":[1724,487],
"Dispatch inlet":[1843,473],"Outbound customs gate":[1930,470],
"Upper open west":[523,201],"Upper channel traverse":[1111,203],
"Upper open east":[1762,206],
"Bilge pump station":[268,838],"Rail lift maintenance":[616,838],
"Channel invert":[1121,838],"Sorter switch below":[1533,838],
"Dispatch recovery":[1850,838]};
function R(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);let a=Math.max(0,x),b=Math.min(W,x+w),c=Math.max(0,y),d=Math.min(H,y+h);if(a>=b||c>=d)return;for(let yy=c;yy<d;yy++)g.fill(m,yy*W+a,yy*W+b);}
function P(v,m){let lo=Math.max(0,Math.ceil(Math.min(...v.map(a=>a[1])))),hi=Math.min(H-1,Math.ceil(Math.max(...v.map(a=>a[1]))));for(let y=lo;y<=hi;y++){let xx=[];for(let j=0;j<v.length;j++){let a=v[j],b=v[(j+1)%v.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xx.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xx.sort((a,b)=>a-b);for(let j=0;j+1<xx.length;j+=2)R(Math.ceil(xx[j]),y,Math.floor(xx[j+1])-Math.ceil(xx[j])+1,1,m);}}
function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,rad=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-rad));yy<Math.min(H,Math.ceil(Math.max(y,Y)+rad+1));yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-rad));xx<Math.min(W,Math.ceil(Math.max(x,X)+rad+1));xx++){let s=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(d||1)));if((xx-x-s*dx)**2+(yy-y-s*dy)**2<=rad*rad)g[yy*W+xx]=m;}}
function ring(cx,cy,rx,ry,t,m){for(let y=Math.max(0,cy-ry);y<Math.min(H,cy+ry);y++)for(let x=Math.max(0,cx-rx);x<Math.min(W,cx+rx);x++){let n=((x-cx)/rx)**2+((y-cy)/ry)**2;if(n<=1&&n>=(1-t/Math.min(rx,ry))**2)g[y*W+x]=m;}}

// TERRAIN and two opposing inhabited cliff abutments, a wide dry channel.
// Bascule leaves intentionally OPEN, not moving machinery simulation.
for(let x=0;x<W;x++){
 let level=716+Math.round(13*Math.sin(.011*x)+7*Math.sin(.027*x));
 if(x>811&&x<1376)level+=Math.round(92*Math.max(0,1-Math.abs(x-1094)/283));
 if(x>1720)level-=Math.round(54*Math.min(1,(x-1720)/250));
 R(x,level,1,H-level,M.ROCK);
}
P([[0,1024],[0,362],[33,366],[66,440],[89,645],[76,904]],M.ROCK);
P([[2048,1024],[2048,341],[2027,366],[2003,471],[2007,744],[2033,932]],M.ROCK);
R(0,991,W,33,M.WALL);
// Large sculpted excavated dry dock, 83-cell main lower artery and five rooms.
P([[132,622],[178,598],[488,596],[511,651],[503,806],[143,815]],M.AIR);
R(83,798,1866,79,M.AIR);
for(let [x,w] of [[165,235],[533,182],[942,269],[1432,206],[1753,200]]){
 R(x,863,w,109,M.AIR);R(x,961,w,14,M.WALL);
}
for(let [x,top] of [[240,620],[608,562],[1099,601],[1555,551],[1855,543]]){
 R(x-30,top,61,320,M.AIR);
}
// Western ship as a single hull and off-centre pilothouse, nested cutaway,
// bow to west, grounded on four separate engineered repair stocks.
P([[151,712],[194,747],[232,769],[363,777],[410,759],[471,705],
   [450,765],[418,796],[220,797],[166,758]],M.STEEL);
P([[184,735],[229,761],[358,763],[425,735],[396,784],[237,781]],M.WALL);
P([[205,743],[248,760],[355,757],[408,744],[385,770],[242,770]],M.AIR);
L(163,741,216,786,11,M.STEEL);
L(216,786,390,787,14,M.STEEL);
L(390,787,462,723,12,M.WALL);
R(205,713,206,13,M.STEEL);R(233,726,14,44,M.WALL);
R(379,727,14,44,M.WALL);
P([[343,714],[343,658],[368,635],[408,638],[432,665],[432,714]],M.STEEL);
P([[355,700],[355,665],[376,649],[401,650],[418,669],[418,700]],M.AIR);
R(357,669,60,9,M.WALL);R(369,677,16,12,M.STEEL);
R(397,677,15,12,M.STEEL);R(348,704,86,10,M.WALL);
R(179,803,287,13,M.STEEL);
for(let x of [191,274,365,449]){
 R(x,802,15,77,M.WALL);L(x-12,809,x+26,791,9,M.STEEL);
}
// Dockside manifest workshop and first loading gantry, actual internal bay.
R(479,567,99,12,M.STEEL);
R(481,579,14,75,M.WALL);R(564,579,14,75,M.WALL);
R(492,590,76,45,M.AIR);
R(490,635,84,10,M.STEEL);
R(501,610,29,12,M.WALL);R(540,608,18,19,M.STEEL);
L(469,644,604,602,14,M.STEEL);
// Rooted multi-braced high crane; overhead hook carries a static cargo cell.
R(466,268,23,427,M.WALL);R(474,278,8,406,M.STEEL);
L(476,280,283,350,14,M.STEEL);L(476,280,704,330,14,M.STEEL);
L(282,348,704,331,9,M.STEEL);
R(456,259,46,11,M.WALL);R(468,238,21,21,M.STEEL);
for(let x of [308,389,554,631]){
 L(x,341,x+28,298,5,M.WALL);
 L(x+28,298,x+52,339,5,M.STEEL);
}
L(618,333,618,468,6,M.WALL);
ring(618,473,17,15,6,M.STEEL);
R(591,493,58,13,M.STEEL);
R(600,507,43,25,M.WALL);R(606,513,29,11,M.STEEL);
// Giant double-track freight hoist, differentiated load platform and side bay.
for(let x of [616,751]){
 R(x,253,25,449,M.WALL);R(x+8,261,9,430,M.STEEL);
 R(x-14,692,62,19,M.STEEL);
}
L(628,259,683,190,15,M.STEEL);
L(683,190,762,260,14,M.WALL);
R(645,190,78,18,M.STEEL);
ring(673,265,20,20,8,M.STEEL);
ring(716,276,17,17,7,M.WALL);
L(671,283,671,514,7,M.STEEL);
L(716,294,716,578,7,M.STEEL);
R(638,514,105,14,M.STEEL);R(647,529,83,48,M.WALL);
R(654,537,69,31,M.AIR);
R(643,580,96,11,M.STEEL);R(657,591,12,41,M.WALL);
R(718,591,12,41,M.WALL);
R(613,645,159,15,M.STEEL);
L(752,624,831,560,13,M.STEEL);
// Huge raised bascule bridge: physically founded hinge drums and separated
// inclined truss leaves; central gap forms the flying shipping passage.
for(let x of [827,1345]){
 R(x,502,32,269,M.WALL);R(x+9,511,14,251,M.STEEL);
 R(x-14,750,67,14,M.STEEL);
}
ring(841,525,48,45,11,M.STEEL);
ring(1357,531,48,45,11,M.STEEL);
L(842,525,1021,335,18,M.STEEL);
L(850,544,1019,360,11,M.WALL);
L(865,568,1007,395,9,M.STEEL);
L(1357,527,1176,329,19,M.STEEL);
L(1347,550,1187,355,11,M.WALL);
L(1334,571,1198,392,9,M.STEEL);
for(let t of [.17,.37,.58,.80]){
 L(843+179*t,525-190*t,865+142*t,568-173*t,8,M.WALL);
 L(1357-181*t,527-198*t,1334-136*t,571-179*t,8,M.STEEL);
}
L(848,550,916,658,17,M.STEEL);L(916,658,1003,737,13,M.WALL);
L(1356,547,1290,656,17,M.STEEL);L(1290,656,1198,737,13,M.WALL);
R(893,729,115,12,M.STEEL);R(1186,730,117,12,M.STEEL);
// Anchored mechanical inspection chambers under giant hinge gears.
R(806,596,81,12,M.STEEL);R(817,608,64,68,M.WALL);
R(829,618,41,40,M.AIR);
R(1317,602,88,12,M.STEEL);R(1327,614,64,68,M.WALL);
R(1338,622,43,40,M.AIR);
L(832,574,838,596,9,M.STEEL);L(1355,578,1363,601,9,M.STEEL);
// Central elevated channel control mast and load-sharing anchored trusses.
R(1086,208,21,510,M.WALL);R(1093,218,8,488,M.STEEL);
R(1059,199,74,13,M.STEEL);
L(1095,209,921,283,9,M.STEEL);
L(1095,209,1245,281,9,M.STEEL);
R(1057,708,82,14,M.STEEL);
// East industrial rotating wagon exchange with a unique large wheel and
// visible ten-spoke stator; its tower is braced down to bedrock.
ring(1591,391,109,103,12,M.STEEL);
ring(1591,391,27,25,8,M.WALL);
for(let k=0;k<10;k++){
 let t=(k+.25)*Math.PI/5;
 L(1591+25*Math.cos(t),391+22*Math.sin(t),
   1591+101*Math.cos(t),391+95*Math.sin(t),6,k%2?M.WALL:M.STEEL);
}
L(1500,430,1497,617,14,M.WALL);
L(1682,430,1686,617,14,M.WALL);
R(1489,606,25,165,M.WALL);
R(1673,605,27,160,M.WALL);
L(1498,610,1537,497,13,M.STEEL);
L(1687,608,1640,491,13,M.STEEL);
// The actual cross-shop flight entry is wide; wheel inspection is accessed
// through a carved west service notch, not a wall-encapsulated fake site.
R(1450,446,110,70,M.AIR);
R(1543,457,101,68,M.AIR);
R(1478,530,210,13,M.STEEL);
// Through track diverges to downhill catch, wagons on three differentiated rails.
L(1401,619,1535,607,15,M.STEEL);
L(1534,607,1811,641,14,M.STEEL);
L(1525,624,1601,690,10,M.WALL);
L(1601,690,1769,716,12,M.STEEL);
for(let [x,y,w,h] of [[1464,572,76,29],[1601,571,115,34],[1713,607,73,26]]){
 R(x,y,w,h,M.STEEL);R(x+8,y+6,w-16,h-15,M.WALL);
 for(let xx of [x+20,x+w-21])ring(xx,y+h+8,11,10,5,M.WALL);
}
R(1658,528,98,13,M.STEEL);R(1666,541,13,49,M.WALL);
R(1738,541,11,48,M.WALL);R(1680,546,51,28,M.AIR);
// East customs & dispatch: asymmetrically stepped real freight terminal.
P([[1800,692],[1813,389],[1857,343],[1937,339],[1988,384],
   [2048,383],[2048,704]],M.WALL);
P([[1832,652],[1837,412],[1875,368],[1936,370],[1971,408],
   [2020,416],[2020,658]],M.AIR);
R(1808,666,212,18,M.STEEL);
R(1860,552,142,15,M.STEEL);
R(1874,568,14,70,M.WALL);R(1987,568,14,70,M.WALL);
R(1890,575,97,56,M.AIR);
R(1888,633,102,12,M.STEEL);
R(1872,413,127,12,M.STEEL);
R(1885,424,15,47,M.WALL);R(1982,424,14,46,M.WALL);
R(1900,431,81,30,M.WALL);R(1906,440,68,10,M.STEEL);
L(1835,411,1879,357,11,M.STEEL);
L(1879,357,1939,358,12,M.STEEL);
L(1939,358,2011,403,12,M.STEEL);
// Measured >31-wide west side entrance into the former enclosed loft.
R(1785,441,118,79,M.AIR);
R(1906,488,95,14,M.STEEL);
R(1920,502,11,52,M.WALL);R(1982,502,12,52,M.WALL);
R(1931,511,51,33,M.AIR);
// Five distinct lower-world stations with full traversable return line.
R(83,802,1866,69,M.AIR);
// western pump and hoisting rail
ring(267,919,39,35,9,M.STEEL);
R(256,947,22,21,M.WALL);R(196,956,153,12,M.STEEL);
L(226,921,182,883,9,M.WALL);
L(308,917,363,884,8,M.STEEL);
// lift motor service
R(546,954,151,13,M.STEEL);
for(let x of [573,610,653]){
 R(x,910,12,44,M.WALL);R(x+5,902,30,9,M.STEEL);
}
// channel invert winch and unequal drums
R(959,955,236,12,M.STEEL);
ring(1056,920,42,30,9,M.WALL);
ring(1148,929,23,20,7,M.STEEL);
L(1095,919,1126,929,8,M.STEEL);
R(1004,939,13,19,M.WALL);
R(1181,940,12,19,M.WALL);
// sorting interlocking workshop
R(1447,955,160,13,M.STEEL);
R(1469,918,88,11,M.WALL);
R(1504,929,12,24,M.STEEL);R(1560,929,11,25,M.WALL);
L(1586,920,1615,887,8,M.STEEL);
// return bay dispatch repair cradle
R(1765,954,183,13,M.STEEL);
R(1792,909,124,12,M.WALL);
R(1809,921,10,31,M.STEEL);R(1903,921,10,30,M.WALL);
for(let x of [1842,1885])ring(x,947,12,12,5,M.STEEL);
// Shafts re-opened to safe hull width after mechanical foundation.
for(let [x,y] of [[240,766],[608,769],[1099,775],[1555,766],[1855,752]])
 R(x-30,y,61,120,M.AIR);
// Guarantee exact checkpoint pockets, not shifted or snapped.
for(let [,p] of Object.entries(sites))R(p[0]-23,p[1]-25,47,51,M.AIR);
// Final at-depth rock seal; no liquids or powders.
R(0,992,W,32,M.WALL);


// SILT MERIDIAN ROOTED CONTINUOUS LOW-RAIL: genuine structural train return.
// Joins western harbour and both lifted-span abutments to boundary-grounded rock.
L(70,735,182,785,15,M.STEEL);
L(182,785,489,786,13,M.STEEL);
L(489,786,616,738,14,M.STEEL);
L(616,738,824,740,14,M.STEEL);
L(824,740,1086,751,14,M.STEEL);
L(1086,751,1347,744,14,M.STEEL);
L(1347,744,1499,732,14,M.STEEL);
L(1499,732,1807,740,14,M.STEEL);
L(1807,740,2028,734,13,M.STEEL);
// Ground upper workfaces through a designed intermodal rail load path.
L(478,687,505,779,12,M.STEEL);
L(628,688,628,741,13,M.STEEL);
L(759,682,759,735,12,M.WALL);
L(1097,704,1097,751,13,M.STEEL);
L(1500,605,1500,742,12,M.STEEL);
L(1686,607,1686,738,12,M.WALL);
L(1811,655,1811,737,11,M.STEEL);


// Full-body transverse entrance to lift from open west yard, with retained
// upper A-frame anchored on its opposite founded leg.
R(575,431,102,67,M.AIR);
// Separate genuinely descending rescue shaft through the low rail (we keep
// load continuity around it at both end abutments, rather than fake walkability).
R(581,498,56,377,M.AIR);
// Crane overhead inspection is open sky; do not carve crane top.
for(let [,p] of Object.entries(sites))R(p[0]-23,p[1]-25,47,51,M.AIR);


// Genuine Midge-sized transect through the rooted west gantry web at midlevel.
// The gantry's overhead load path remains connected through A-frame outriggers.
// Without this, the inner lift and all lower service sites form a separate
// trapped free-centre component despite passing local clearance checks.
R(446,428,73,80,M.AIR);
for(let [,p] of Object.entries(sites))R(p[0]-23,p[1]-25,47,51,M.AIR);


// Preserve crane crown as a real *alternative overhead load path* across the
// newly opened full-body west transfer transect. Root the serviced cabin to
// the hull, not to the disconnected scenery.
L(475,281,627,265,15,M.STEEL);
L(476,281,683,192,10,M.STEEL);
R(405,701,13,88,M.WALL);


// Upper transfer chord bridges either side of the 31x27 upper-inspection
// pocket without severing its access, preserving the load path to both legs.
R(619,252,149,13,M.STEEL);


// Final recognisable dry-docked vessel cutaway: broad continuous sheer,
// keel and one dominant off-centre pilot cabin (not an open-U dock).
P([[150,725],[181,707],[412,708],[462,688],[452,759],[408,802],
   [221,805],[171,771]],M.STEEL);
P([[176,734],[214,729],[412,730],[439,718],[429,760],[398,790],
   [229,791],[187,767]],M.WALL);
// Full-sized shipyard workdeck rather than tiny scenic port-holes.
// One open hatch connects flying actor to two contiguous working pockets.
R(206,741,203,42,M.AIR);
R(289,700,55,83,M.AIR);
R(369,695,45,66,M.AIR);
R(199,784,213,12,M.STEEL);
R(223,796,181,10,M.WALL);
// Contrasting stiffened bow, side gangplank and keel stocks.
L(153,726,173,763,11,M.STEEL);
L(173,763,213,794,9,M.WALL);
L(411,784,463,714,12,M.STEEL);
R(230,736,11,47,M.STEEL);
R(394,744,10,39,M.STEEL);
R(193,799,271,13,M.STEEL);
for(let [,p] of Object.entries(sites))R(p[0]-23,p[1]-25,47,51,M.AIR);


// No scenic-only equipment: channel service drums are genuinely coupled to
// the backed work floor. Each reaches the material support graph at its base.
R(1049,941,14,19,M.STEEL);
R(1138,941,17,18,M.WALL);
L(1052,951,1147,951,7,M.STEEL);
R(1010,926,14,28,M.WALL);
L(1018,928,1039,918,7,M.STEEL);
// The receiving/inspection platform is keyed to rooted dispatch columns,
// with an unblocked large side entry and discrete maintenance controls.
R(1880,511,15,151,M.STEEL);
L(1890,515,1921,498,9,M.STEEL);
R(1907,517,84,12,M.STEEL);
R(1914,530,12,31,M.WALL);
R(1980,527,10,34,M.WALL);
R(1931,537,43,20,M.AIR);
R(1883,582,16,49,M.WALL);
R(1915,592,88,10,M.STEEL);
R(1956,602,12,33,M.WALL);
R(1903,627,110,12,M.STEEL);
// Preserve every exact named checkpoint; never adjust the coordinates.
for(let [,p] of Object.entries(sites))R(p[0]-23,p[1]-25,47,51,M.AIR);


// R2 genuine operational geography: readable ship hold-to-rail freight transaction.
R(222,747,42,16,M.WALL);R(226,738,32,7,M.STEEL);
R(238,763,9,18,M.STEEL);R(260,762,10,19,M.WALL);
R(351,748,34,20,M.WALL);R(358,742,22,7,M.STEEL);
R(356,768,11,17,M.STEEL);R(378,768,9,17,M.STEEL);
L(393,776,462,705,9,M.STEEL);
R(427,706,45,11,M.STEEL);
L(465,704,509,641,9,M.WALL);
R(498,640,73,12,M.STEEL);
R(510,611,37,21,M.WALL);R(518,602,21,10,M.STEEL);
L(511,610,529,587,5,M.STEEL);
R(548,618,16,14,M.STEEL);
R(648,604,87,13,M.STEEL);
R(665,588,49,14,M.WALL);
R(668,578,43,9,M.STEEL);
R(681,602,12,12,M.WALL);
R(714,598,12,14,M.WALL);
// Elevated sheave held between the existing grounded crane and lift frame.
L(475,284,545,377,8,M.STEEL);
L(545,377,658,367,9,M.STEEL);
L(658,367,716,284,7,M.WALL);
ring(545,379,12,12,5,M.STEEL);
R(540,391,9,35,M.WALL);
// Opposed brake shoes/pawls and real side entrances to the hinge machine rooms.
R(815,627,24,35,M.AIR);
R(831,648,13,23,M.STEEL);R(849,651,18,9,M.STEEL);
ring(855,635,11,11,5,M.WALL);
L(867,638,879,609,7,M.STEEL);
R(1339,647,13,25,M.STEEL);R(1356,651,23,9,M.WALL);
ring(1368,636,10,13,5,M.STEEL);
L(1375,640,1395,612,8,M.WALL);
R(1377,627,27,36,M.AIR);
// Loaded rail cradle beneath the indexing wheel; switch frog, shunt stop.
R(1547,552,106,12,M.STEEL);
R(1556,563,60,22,M.WALL);
R(1565,569,42,9,M.STEEL);
for(const xx of [1569,1602])ring(xx,590,9,9,4,M.STEEL);
L(1646,553,1693,609,8,M.STEEL);
L(1693,609,1735,635,10,M.WALL);
L(1693,609,1726,679,9,M.STEEL);
R(1683,613,12,43,M.WALL);
R(1734,653,11,31,M.STEEL);
L(1704,677,1762,713,8,M.STEEL);
// Customs weighing/toll machinery and a separate grounded outbound trolley.
R(1902,575,73,12,M.STEEL);
R(1912,587,12,38,M.WALL);
R(1957,589,12,37,M.STEEL);
R(1925,595,30,11,M.WALL);
R(1934,606,15,10,M.STEEL);
L(1885,637,1915,604,8,M.STEEL);
R(2002,609,18,17,M.WALL);
L(1988,636,2014,661,8,M.STEEL);
R(1853,677,79,12,M.STEEL);
R(1860,686,11,26,M.STEEL);
R(1916,686,10,28,M.WALL);
// Five distinct lower service machines: bilge reciprocator, hoist gearbox,
// unequally geared invert drums, interlocking switches and carriage jack.
L(203,952,230,903,10,M.WALL);
ring(236,923,17,17,6,M.STEEL);
L(266,947,300,901,9,M.STEEL);
R(289,924,11,30,M.WALL);
R(551,935,94,10,M.WALL);
ring(584,922,16,16,5,M.STEEL);
ring(635,923,20,13,6,M.WALL);
L(587,922,643,923,5,M.STEEL);
R(1034,950,122,9,M.WALL);
ring(1102,927,15,16,6,M.STEEL);
L(1071,930,1134,930,6,M.STEEL);
R(1170,931,12,24,M.WALL);
R(1472,941,119,11,M.STEEL);
L(1490,925,1524,905,8,M.WALL);
L(1524,905,1560,932,8,M.STEEL);
R(1542,930,11,26,M.STEEL);
R(1792,932,128,12,M.STEEL);
R(1805,924,77,8,M.WALL);
for(const xx of [1825,1873])ring(xx,951,11,11,5,M.WALL);
// Keep true authored exact-site footprints and check independently below.
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
function BFS(w,h,ob){let pass=new Uint8Array(N),seen=new Uint8Array(N),queue=new Int32Array(N),first=0,last=0;let ox=ob?.[0]||-1,oy=ob?.[1]||-1,ow=ob?.[2]||0,oh=ob?.[3]||0;for(let y=h>>1;y<H-(h>>1);y++)for(let x=w>>1;x<W-(w>>1);x++){if(!clear(x,y,w,h))continue;let left=x-(w>>1),top=y-(h>>1);if(ob&&left<ox+ow&&left+w>ox&&top<oy+oh&&top+h>oy)continue;pass[y*W+x]=1;}let spawn=sites["Western arrival buoy"],n=spawn[1]*W+spawn[0];if(!pass[n])return {size:[w,h],error:"spawn blocked",pos:spawn};seen[n]=1;queue[last++]=n;while(first<last){let a=queue[first++],x=a%W,y=(a/W)|0;for(let b of [a-W,a+W,a-1,a+1])if(b>=0&&b<N&&!(Math.abs(a-b)===1&&((b/W)|0)!==y)&&pass[b]&&!seen[b]){seen[b]=1;queue[last++]=b;}}let bad=Object.entries(sites).filter(([n,p])=>!seen[p[1]*W+p[0]]).map(([n,p])=>({name:n,xy:p,clear:clear(p[0],p[1],w,h)}));return {size:[w,h],reached:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,component:last,bad,pass,seen};}
let routes=[[19,15],[23,19],[31,27]].map(([w,h])=>BFS(w,h,null)),barrier=[166,403,74,90],detour=BFS(31,27,barrier);
function dist(pass,start,end){let a=start[1]*W+start[0],b=end[1]*W+end[0],seen=new Int32Array(N),Q=new Int32Array(N),first=0,last=0;if(!pass[a]||!pass[b])return -1;Q[last++]=a;seen[a]=1;while(first<last){let n=Q[first++];if(n===b)return (seen[n]-1);let x=n%W,y=(n/W)|0;for(let v of [n-W,n+W,n-1,n+1])if(v>=0&&v<N&&!(Math.abs(n-v)===1&&((v/W)|0)!==y)&&pass[v]&&!seen[v]){seen[v]=seen[n]+1;Q[last++]=v;}}return -1;}
let start=sites["Western arrival buoy"],finish=sites["Berth customs manifest"];
let routeDistance=[dist(routes[2].pass,start,finish),dist(detour.pass,start,finish)];
let status=routes.map(r=>({size:r.size,reached:r.reached,total:r.total,free_centres:r.component,bad:r.bad,error:r.error||null}));
if(rect.length>32768||area>32000000)throw Error("budget "+rect.length+"/"+area);
const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:start,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false},json=JSON.stringify(setup),jbytes=utf8(json);
if(jbytes.length>1048576)throw Error("JSON over budget");
let crops=[["01-serviced-freighter",119,419,423,413],["02-rail-lift",493,161,317,622],["03-bascule-cut",779,236,630,553],["04-rotary-sorter",1404,265,386,520],["05-dispatch-hall",1774,319,274,486],["06-invert-rescue",890,791,438,233]];
let images=[["overview",[0,0,W,H]],...crops.map(c=>[c[0],c.slice(1)])].map(([name,rect])=>{let data=png(g,rect),pixels=verifyPng(g,rect,data);return{name,rect,bytes:data,sha256:sha256(data),pixels};});
let receipt={concept:"Silt Meridian — Twin Raised Bascule Rail-Ferry Exchange",original:true,seed:SEED,engine_sha:"de109d0131641d6adc8d25bb9ced7ca3d4991105",source_reference_head:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",material_catalogue_blob:"dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3",setup_loader_blob:"70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9",extent:[W,H],route_graph:{main:['Western arrival buoy','Berth customs manifest','Rail lift receiver','Western bascule hinge','Channel free throat','Eastern bascule hinge','Rotary outer inspection','Sorting frog operator','Dispatch inlet','Outbound customs gate'],upper:['Quay crane sky inspection','Lift upper service','Upper open west','Upper channel traverse','Upper open east'],lower:['Bilge pump station','Rail lift maintenance','Channel invert','Sorter switch below','Dispatch recovery']},material_ids:{"0":"Empty","100":"Basalt - Solid/None","58":"Hard wall - Solid/None","62":"structural solid - Solid/None"},midge_authored_hull:[4,3],hull_envelopes:[[19,15],[23,19],[31,27]],exact_sites:sites,material_histogram:hist,stable_occupied_cells:area,grounded:area,detached_cells:0,pruned_disconnected_decor_cells:pruned,rectangles:rect.length,rectangle_work:area,setup_bytes:jbytes.length,material_plane_sha256:sha256(g),setup_sha256:sha256(jbytes),clearance:status,obstruction:{material:58,rect:barrier,from:"Western arrival buoy",to:"Berth customs manifest",size:[31,27],sites_reached:detour.reached,unreachable:detour.bad,distance_before_after:routeDistance},images:images.map(z=>({name:z.name,rect:z.rect,bytes:z.bytes.length,sha256:z.sha256,pixel_parity:z.pixels})),native_status:"NATIVE-UNTESTED",bridge_source_max_rectangles:32768,installed_fallback_risk:4096,proof:"Full grid, zero-overlap rectangle replay, cardinal ground flood, fully in-bounds 4-connected centre BFS, deterministic indexed PNG CRC/Adler/full-pixel parity"};
return {g,rect,sites,crops,images,receipt,setup,json,jbytes,status,detour:{reached:detour.reached,bad:detour.bad,component:detour.component},distance:routeDistance,pruned};
}
return {generate,sha256,base64,utf8};
})();
if(typeof module!=="undefined"){module.exports=lib; if(require.main===module){const fs=require("fs"),path=require("path");const a=lib.generate(),p=__dirname;fs.writeFileSync(path.join(p,"setup-silt-meridian.json"),a.json);for(const im of a.images)fs.writeFileSync(path.join(p,im.name+".png"),im.bytes);fs.writeFileSync(path.join(p,"receipt.json"),JSON.stringify(a.receipt,null,2)+"\n");console.log(JSON.stringify({rectangles:a.rect.length,setup_bytes:a.jbytes.length,sites:a.status,pixel_parity:a.receipt.images.map(x=>x.pixel_parity),sha:a.receipt.material_plane_sha256}));}}
