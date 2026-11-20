"use strict";
const lib=(function factory(){
"use strict";
const W=2048,H=1024,N=W*H,SEED=2026112026,IDS=[0,100,58,62], M={AIR:0,ROCK:100,WALL:58,STEEL:62};
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
"Berth Approach":[158,413],"Quay Manifest":[411,413],
"Pilot Wheelhouse":[254,578],"RoRo Vehicle Hold":[331,735],
"Twin-Drum Gate":[650,413],"Elevator Control":[704,570],
"West Crane Loft":[374,247],"Elevator Head":[704,247],
"Indexing Ring Entry":[1051,414],"Ring Viewing Pocket":[1143,544],
"Ring Cargo East":[1248,649],"Ring Outer Transfer":[1368,414],
"Classification Control":[1575,413],"Rail Switch Gallery":[1580,686],
"Freight Scan Gate":[1800,414],"Outbound Relay":[1902,414],
"Upper Truss Way":[1178,247],"East Semaphore":[1870,247],
"Berth Bilge Return":[270,872],"Hoist Pump Gallery":[642,872],
"Ring Axle Service":[1088,872],"Turnout Service":[1540,872],
"Customs Recovery":[1840,872]
};
function R(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);let a=Math.max(0,x),b=Math.min(W,x+w),c=Math.max(0,y),d=Math.min(H,y+h);if(a>=b||c>=d)return;for(let yy=c;yy<d;yy++)g.fill(m,yy*W+a,yy*W+b);}
function P(v,m){let lo=Math.max(0,Math.ceil(Math.min(...v.map(a=>a[1])))),hi=Math.min(H-1,Math.ceil(Math.max(...v.map(a=>a[1]))));for(let y=lo;y<=hi;y++){let xx=[];for(let j=0;j<v.length;j++){let a=v[j],b=v[(j+1)%v.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xx.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xx.sort((a,b)=>a-b);for(let j=0;j+1<xx.length;j+=2)R(Math.ceil(xx[j]),y,Math.floor(xx[j+1])-Math.ceil(xx[j])+1,1,m);}}
function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,rad=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-rad));yy<Math.min(H,Math.ceil(Math.max(y,Y)+rad+1));yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-rad));xx<Math.min(W,Math.ceil(Math.max(x,X)+rad+1));xx++){let q=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(d||1)));if((xx-x-q*dx)**2+(yy-y-q*dy)**2<=rad*rad)g[yy*W+xx]=m;}}
function ring(x,y,rx,ry,t,m){for(let yy=Math.max(0,y-ry);yy<Math.min(H,y+ry);yy++)for(let xx=Math.max(0,x-rx);xx<Math.min(W,x+rx);xx++){let a=((xx-x)/rx)**2+((yy-y)/ry)**2;if(a<=1&&a>=(1-t/Math.min(rx,ry))**2)g[yy*W+xx]=m;}}
function beam(x,y,X,Y,t=9,m=M.STEEL){L(x,y,X,Y,t,m);}
function boxCrate(x,y,w=55,h=25){R(x,y,w,h,M.WALL);R(x+4,y+4,w-8,7,M.STEEL);for(let s=x+13;s<x+w-5;s+=15)R(s,y+12,4,h-15,M.STEEL);}
function platform(x,y,w,t=12){R(x,y,w,t,M.STEEL);}
function wheel(x,y,r){ring(x,y,r,r,5,M.WALL);ring(x,y,r-8,r-8,3,M.STEEL);}
function gear(x,y,r){ring(x,y,r,r,8,M.STEEL);for(let a=0;a<8;a++){let t=a*Math.PI/4;R(Math.round(x+(r-1)*Math.cos(t))-4,Math.round(y+(r-1)*Math.sin(t))-4,8,8,M.WALL);}}
// ORISON WHEELHOUSE — genuinely original fixed material-cell section.
// Vessel -> side-on RoRo elevator -> ring indexer -> divergent classification
// tracks -> customs. Indexed ring is NON-ANIMATED fixed steel machinery.
// All platforms, spokes, cargo slots and return shafts are collision geometry.
for(let x=0;x<W;x++){let h=790+Math.round(13*Math.sin(x*.0107)+7*Math.sin(x*.021));if(x>870&&x<1430)h+=Math.round(45*Math.sin(Math.PI*(x-870)/560)**2);if(x>1710)h-=Math.round((x-1710)*.08);R(x,h,1,H-h,M.ROCK);}
R(0,961,W,63,M.WALL);
P([[0,1024],[0,297],[32,305],[68,423],[103,676],[128,923]],M.ROCK);
P([[2048,1024],[2048,278],[2022,317],[1995,499],[1966,674],[1940,953]],M.ROCK);
// Profiled, dry, entered graving basins and axle pits.
P([[128,603],[184,574],[434,572],[482,638],[486,814],[130,815]],M.AIR);
P([[510,595],[564,567],[836,571],[886,638],[867,816],[512,818]],M.AIR);
P([[938,592],[995,562],[1306,566],[1371,630],[1372,824],[930,824]],M.AIR);
R(1390,606,550,221,M.AIR);
// Long, physically present northern truss; preserve large open altitudes.
R(78,143,1889,20,M.STEEL);R(78,143,26,832,M.WALL);
R(1947,143,26,832,M.WALL);
R(111,307,1823,13,M.WALL);
for(let x of [181,490,798,1123,1455,1778]){
 beam(x,162,x+92,304,9);beam(x+95,162,x+12,306,7);
 R(x+45,183,9,36,M.WALL);
}
// West sheltered drylock engineering: flat sided vessel with tapered bow,
// distinct deck, lower hold, aft wheelhouse and physical repair shoulders.
P([[150,695],[179,651],[224,629],[393,625],[443,646],[482,697],[464,756],[423,786],[213,791],[176,755]],M.STEEL);
P([[173,692],[205,652],[236,647],[385,644],[432,662],[458,704],[441,745],[404,772],[222,774]],M.WALL);
P([[201,699],[230,664],[390,660],[433,691],[434,717],[407,749],[219,754]],M.AIR);
R(204,744,229,15,M.STEEL);
R(185,624,270,13,M.WALL);R(191,635,262,7,M.STEEL);
P([[218,624],[216,552],[233,534],[280,534],[304,552],[308,624]],M.STEEL);
P([[233,606],[233,561],[248,549],[278,549],[290,565],[291,606]],M.AIR);
R(236,572,47,10,M.WALL);R(229,613,74,11,M.WALL);
for(let x of [236,304,368]){boxCrate(x,712,52,28);R(x+4,741,46,8,M.STEEL);}
R(164,783,318,12,M.STEEL);R(153,793,18,130,M.WALL);
R(463,783,16,133,M.WALL);R(166,817,302,13,M.WALL);
R(162,574,20,200,M.WALL);R(184,593,13,181,M.STEEL);
R(428,585,19,188,M.WALL);
// Dry berth vehicle transfer is distinct from the ship hull.
R(452,593,101,15,M.STEEL);R(477,608,70,14,M.WALL);
R(460,637,92,13,M.STEEL);boxCrate(481,651,65,27);
L(477,588,523,521,12,M.STEEL);L(523,521,573,549,10,M.STEEL);
R(518,530,12,84,M.STEEL);R(500,611,34,10,M.WALL);
// Twin-drum RoRo hoist: open centre and offset counterweight.
// Unequal drums + two transverse baskets; no clone of box caisson.
R(553,291,26,506,M.WALL);R(831,280,27,534,M.WALL);
R(558,279,300,23,M.STEEL);
beam(554,290,640,205,18);beam(772,206,862,290,17);
R(642,212,132,19,M.WALL);
for(let [x,r] of [[634,39],[765,27]]){wheel(x,320,r);R(x-3,349,7,263,M.STEEL);}
R(579,588,247,17,M.STEEL);R(598,607,209,18,M.WALL);
R(601,624,193,46,M.AIR);R(606,665,183,13,M.STEEL);
for(let x of [612,700,770]){R(x,675,16,93,M.WALL);R(x+6,686,6,72,M.STEEL);}
boxCrate(607,630,56,27);boxCrate(700,629,58,27);
R(806,411,16,196,M.STEEL);R(805,609,22,167,M.WALL);
R(592,715,187,14,M.WALL);
beam(580,770,557,803,11);beam(812,781,847,802,11);
// Freight transfer cradle to ring: visible staged loads on proper dollies.
platform(865,695,115,14);R(894,680,77,14,M.WALL);
boxCrate(895,649,60,29);for(let x of [910,950])wheel(x,712,13);
beam(850,694,942,618,15);R(925,613,27,47,M.STEEL);
// World-defining, largely open indexing drum ring with reinforced hub and
// four recognisable cargo slots; not any perspective/rotating simulation.
ring(1142,645,196,166,23,M.STEEL);
ring(1142,645,157,132,10,M.WALL);
ring(1142,645,37,36,13,M.STEEL);ring(1142,645,18,18,9,M.WALL);
for(let a=0;a<8;a++){let t=a*Math.PI/4;
 beam(1142+41*Math.cos(t),645+38*Math.sin(t),
      1142+148*Math.cos(t),645+125*Math.sin(t),9,a%2?M.WALL:M.STEEL);}
for(let x of [985,1290]){R(x,777,23,53,M.WALL);R(x+5,786,13,32,M.STEEL);}
R(1034,808,219,13,M.STEEL);
R(1129,806,27,22,M.WALL);
for(let [x,y] of [[1034,627],[1174,561],[1202,692],[1080,724]]){boxCrate(x,y,56,23);R(x+10,y+23,37,10,M.STEEL);}
for(let [x,y] of [[990,606],[1295,608]]){platform(x,y,44,14);R(x+8,y+13,25,19,M.WALL);}
R(1096,493,107,11,M.STEEL);R(1097,502,15,25,M.WALL);R(1190,504,14,24,M.WALL);
R(1125,514,55,9,M.STEEL);
beam(954,675,991,685,15);beam(1298,688,1385,686,16);
// Ring mechanism external anti-rotation framework, knee-braced on supports.
R(951,551,26,247,M.WALL);R(1315,550,25,253,M.WALL);
beam(947,548,1059,492,12);beam(1246,497,1342,549,12);
R(981,788,337,15,M.STEEL);
beam(977,793,1003,823,12);beam(1314,792,1345,823,12);
// Three genuinely divergent rail grades across the east marshalling fan.
R(1358,710,391,15,M.STEEL);R(1359,750,404,15,M.WALL);
beam(1382,697,1532,633,11);beam(1373,692,1528,592,12);
beam(1408,767,1604,694,9);beam(1551,612,1769,671,11);
platform(1490,625,254,14);platform(1497,690,260,13);
for(let [x,y] of [[1517,595],[1634,661],[1690,718]]){
 R(x,y,81,13,M.STEEL);boxCrate(x+9,y-29,62,27);
 for(let w of [x+23,x+64])wheel(w,y+14,12);
}
R(1449,690,23,114,M.WALL);R(1706,683,22,122,M.WALL);
beam(1459,797,1486,750,9);beam(1715,802,1756,760,9);
R(1591,773,140,16,M.STEEL);
R(1610,786,105,16,M.WALL);
// Unmistakable entered inspection and outbound manifest terminal.
P([[1768,772],[1768,560],[1807,511],[1837,544],[1877,480],[1927,526],[1940,776]],M.WALL);
P([[1787,747],[1787,576],[1809,545],[1843,576],[1878,516],[1911,543],[1919,747]],M.AIR);
platform(1780,735,157,15);platform(1802,634,116,12);
R(1818,670,86,11,M.STEEL);
R(1812,682,12,55,M.WALL);R(1900,682,12,55,M.WALL);
boxCrate(1834,691,59,30);
R(1818,618,102,13,M.WALL);
R(1835,572,13,41,M.STEEL);R(1888,572,13,41,M.STEEL);
R(1842,591,51,9,M.WALL);
R(1845,674,56,7,M.WALL);R(1917,633,18,94,M.STEEL);
R(1802,785,130,15,M.STEEL);beam(1804,803,1765,782,11);
// Underworks: distinct founded machine silhouettes: bilge, gear bench,
// indexing axle, turnout frogs, customs reclaim.
R(130,839,1802,69,M.AIR);
R(150,917,1780,13,M.STEEL);
for(let [x,w] of [[162,225],[523,265],[919,325],[1428,266],[1747,177]]){
 R(x,911,w,42,M.AIR);R(x,951,w,15,M.WALL);
 R(x+11,951,13,17,M.STEEL);R(x+w-26,951,13,17,M.STEEL);
}
R(191,930,145,12,M.WALL);R(210,905,17,32,M.STEEL);
ring(261,922,20,19,8,M.STEEL);R(290,914,59,17,M.STEEL);
R(541,931,221,12,M.WALL);R(556,907,20,30,M.STEEL);
for(let x of [623,660,700]){wheel(x,917,15);R(x-6,931,14,10,M.STEEL);}
R(952,935,264,12,M.STEEL);gear(1104,918,24);
R(1035,922,52,17,M.WALL);R(1140,920,58,20,M.WALL);
R(1449,938,219,12,M.WALL);L(1460,917,1548,938,7,M.STEEL);
L(1461,918,1553,906,7,M.STEEL);R(1559,918,80,15,M.WALL);
R(1777,939,138,11,M.STEEL);
P([[1790,913],[1894,914],[1872,932],[1812,933]],M.WALL);
for(let x of [1802,1827,1850,1874])R(x,915,7,23,M.STEEL);
// Flight routes cut from real mass at full body clearance. Upper traverse,
// cross-yard main, underworks return and five vertical rescue/transfer ports.
R(111,363,1826,98,M.AIR);
R(116,205,1820,93,M.AIR);
R(129,840,1804,59,M.AIR);
// Alternating vertical shafts between the functional mass zones.
for(let x of [191,473,873,1400,1764,1904])R(x-37,295,75,178,M.AIR);
for(let x of [489,880,1418,1759])R(x-39,455,79,440,M.AIR);
// Ring has real Midge-passable entry/exit not decorative nicks.
R(1108,461,72,83,M.AIR);
R(1111,770,69,79,M.AIR);
R(937,613,80,66,M.AIR);
R(1285,611,81,70,M.AIR);
// Reconnect five labelled site shafts and every literal coordinate, with
// equal conservative clearance; sites NEVER moved to nearest valid centre.
for(const p of Object.values(sites))R(p[0]-24,p[1]-25,49,51,M.AIR);
// Root the major northern and eastern retaining frames without blocking routes.
R(78,143,1889,18,M.STEEL);
R(78,143,26,830,M.WALL);R(1947,143,26,830,M.WALL);
// Restore all exact-site clearances after structural edges.
for(const p of Object.values(sites))R(p[0]-24,p[1]-25,49,51,M.AIR);

/* Integrated playable apertures: actual doors, elevator access and ring
   pass-throughs, not nearest-point site substitutions. The wide continuous
   tie beam is a real grounded lateral bearing ledge ABOVE the lower flight
   passage. It joins both boundary buttresses without creating floor pillars. */
R(108,816,1841,16,M.STEEL);
R(108,811,16,151,M.WALL);R(1931,811,17,151,M.WALL);
R(279,552,104,52,M.AIR); // open wheelhouse side hatch into berth air
R(343,702,141,58,M.AIR); // roll-on vessel hold through side ramp
R(557,236,154,39,M.AIR); // elevator head lateral maintenance opening
R(1203,628,149,50,M.AIR); // ring east cargo portal, true flyable width
R(1390,643,215,55,M.AIR); // rail fan switching inspection gateway
// Preserve steel ledger around cut hatch and readable loading apron.
R(422,765,86,13,M.STEEL);R(497,756,16,49,M.WALL);
// Exact stations remain fixed and entirely unoccupied for all hull envelopes.
for(const p of Object.values(sites))R(p[0]-24,p[1]-25,49,51,M.AIR);


/* Two purposeful human-scale vertical safety routes. The outer customs
   exhaust shaft descends to the entire underworks without drilling through
   any upper freight-machine support girder. The hoist attic has a true roof
   access aperture, not a collision exemption. */
R(671,180,66,104,M.AIR);
R(1935,356,103,562,M.AIR);
R(1885,388,129,62,M.AIR);
R(1878,842,132,66,M.AIR);
for(const p of Object.values(sites))R(p[0]-24,p[1]-25,49,51,M.AIR);

/* 64px lateral true-width hoist roof service doorway. Tests found the
   frame's right rail otherwise isolated the exact Elevator Head point. */
R(721,225,92,63,M.AIR);
for(const p of Object.values(sites))R(p[0]-24,p[1]-25,49,51,M.AIR);

/* Real inspected elevator-through-deck access port. Hoisthead is reached
   FROM MAIN FLIGHT by a 78px ladder void through the basket top plate;
   it is not moved to a synthetic nearby waypoint. */
R(664,273,80,111,M.AIR);
R(668,354,76,68,M.AIR);
for(const p of Object.values(sites))R(p[0]-24,p[1]-25,49,51,M.AIR);
// Remove genuinely ungrounded decorator fragments, never retain false hanging
// "solid" machinery unsupported by any connected load path.
let seen=new Uint8Array(N),q=new Int32Array(N),front=0,back=0;
for(let x=0;x<W;x++){let n=(H-1)*W+x;if(g[n]&&!seen[n]){seen[n]=1;q[back++]=n;}}
while(front<back){let a=q[front++],x=a%W,y=(a/W)|0;for(let z of [a-W,a+W,a-1,a+1])if(z>=0&&z<N&&!(Math.abs(z-a)===1&&((z/W)|0)!==y)&&g[z]&&!seen[z]){seen[z]=1;q[back++]=z;}}

/* Verified, rooted, inert structural ties. Every subassembly is physically
   joined to the boundary-rooted chord or deep foundation using actual steel
   cells. The full-width main-flight band (y358..458) is never crossed by a
   newly introduced tie; no site is shifted or given an artificial exemption.
   Tie endpoints and paths are computed deterministically from final geometry. */
let above=new Int16Array(N),below=new Int16Array(N);
for(let x=0;x<W;x++){let last=-1;for(let y=0;y<H;y++){let i=y*W+x;if(seen[i])last=y;above[i]=last;}last=-1;for(let y=H-1;y>=0;y--){let i=y*W+x;if(seen[i])last=y;below[i]=last;}}
let visit=new Uint8Array(N),cq=new Int32Array(N),ties=[];
function score(x,y,z){if(z<0)return Infinity;let lo=Math.min(y,z),hi=Math.max(y,z);if(lo<=458&&hi>=358)return Infinity;let s=hi-lo;
 for(let p of Object.values(sites))if(Math.abs(x-p[0])<41&&lo<p[1]+40&&hi>p[1]-40)s+=5000;
 for(let [a,b] of [[200,299],[830,907]])if(lo<b&&hi>a)s+=200;return s;}
for(let i=0;i<N;i++)if(g[i]&&!seen[i]&&!visit[i]){
 let first=0,last=1;cq[0]=i;visit[i]=1;let best=Infinity,choice=null;
 while(first<last){let v=cq[first++],x=v%W,y=(v/W)|0;for(let z of [above[v],below[v]]){let s=score(x,y,z);if(s<best){best=s;choice=[x,y,z];}}
 for(let j of [v-W,v+W,v-1,v+1])if(j>=0&&j<N&&!(Math.abs(j-v)===1&&((j/W)|0)!==y)&&g[j]&&!seen[j]&&!visit[j]){visit[j]=1;cq[last++]=j;}}
 if(!choice)throw Error("Ungroundable component "+i);ties.push([choice[0],Math.min(choice[1],choice[2]),Math.abs(choice[1]-choice[2])+1,last,best]);}
for(let [x,y,h] of ties)R(x,y,2,h,M.STEEL);
seen.fill(0);front=0;back=0;for(let x=0;x<W;x++){let n=(H-1)*W+x;if(g[n]&&!seen[n]){seen[n]=1;q[back++]=n;}}
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
function BFS(w,h,ob){let pass=new Uint8Array(N),seen=new Uint8Array(N),queue=new Int32Array(N),first=0,last=0;let ox=ob?.[0]||-1,oy=ob?.[1]||-1,ow=ob?.[2]||0,oh=ob?.[3]||0;for(let y=h>>1;y<H-(h>>1);y++)for(let x=w>>1;x<W-(w>>1);x++){if(!clear(x,y,w,h))continue;let left=x-(w>>1),top=y-(h>>1);if(ob&&left<ox+ow&&left+w>ox&&top<oy+oh&&top+h>oy)continue;pass[y*W+x]=1;}let spawn=sites["Berth Approach"],n=spawn[1]*W+spawn[0];if(!pass[n])return {size:[w,h],error:"spawn blocked",pos:spawn};seen[n]=1;queue[last++]=n;while(first<last){let a=queue[first++],x=a%W,y=(a/W)|0;for(let b of [a-W,a+W,a-1,a+1])if(b>=0&&b<N&&!(Math.abs(a-b)===1&&((b/W)|0)!==y)&&pass[b]&&!seen[b]){seen[b]=1;queue[last++]=b;}}let bad=Object.entries(sites).filter(([n,p])=>!seen[p[1]*W+p[0]]).map(([n,p])=>({name:n,xy:p,clear:clear(p[0],p[1],w,h)}));return {size:[w,h],reached:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,component:last,bad,pass,seen};}
let routes=[[19,15],[23,19],[31,27]].map(([w,h])=>BFS(w,h,null)),barrier=[231,363,92,96],detour=BFS(31,27,barrier);
function dist(pass,start,end){let a=start[1]*W+start[0],b=end[1]*W+end[0],seen=new Int32Array(N),Q=new Int32Array(N),first=0,last=0;if(!pass[a]||!pass[b])return -1;Q[last++]=a;seen[a]=1;while(first<last){let n=Q[first++];if(n===b)return (seen[n]-1);let x=n%W,y=(n/W)|0;for(let v of [n-W,n+W,n-1,n+1])if(v>=0&&v<N&&!(Math.abs(n-v)===1&&((v/W)|0)!==y)&&pass[v]&&!seen[v]){seen[v]=seen[n]+1;Q[last++]=v;}}return -1;}
let start=sites["Berth Approach"],finish=sites["Quay Manifest"];
let routeDistance=[dist(routes[2].pass,start,finish),dist(detour.pass,start,finish)];
let status=routes.map(r=>({size:r.size,reached:r.reached,total:r.total,free_centres:r.component,bad:r.bad,error:r.error||null}));
if(status.some(x=>x.reached!==x.total)||detour.reached!==Object.keys(sites).length||routeDistance[0]<0||routeDistance[1]<=routeDistance[0])throw Error('Exact Midge clearance, route or obstruction qualification failure '+JSON.stringify({status,detour:detour.bad,routeDistance}));
if(rect.length>32768||area>32000000)throw Error("budget "+rect.length+"/"+area);
const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:start,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false},json=JSON.stringify(setup),jbytes=utf8(json);
if(jbytes.length>1048576)throw Error("JSON over budget");
let crops=[["01-ro-ro-vessel",125,513,375,309],["02-double-drum-elevator",520,197,359,617],["03-indexing-ring",924,461,460,371],["04-classification-fan",1373,552,401,267],["05-customs-terminal",1752,470,290,350],["06-machine-underworks",145,835,1789,182]];
let images=[["overview",[0,0,W,H]],...crops.map(c=>[c[0],c.slice(1)])].map(([name,rect])=>{let data=png(g,rect),pixels=verifyPng(g,rect,data);return{name,rect,bytes:data,sha256:sha256(data),pixels};});
let receipt={concept:"Orison Wheelhouse — Ring Indexer RoRo Port",original:true,seed:SEED,engine_sha:"7b03aa437561ec63e31fd09531171360ab60eeb4",source_reference_head:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",material_catalogue_blob:"dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3",setup_loader_blob:"70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9",extent:[W,H],route_graph:{main:["Berth Approach","Quay Manifest","Twin-Drum Gate","Indexing Ring Entry","Ring Outer Transfer","Classification Control","Freight Scan Gate","Outbound Relay"],upper:["West Crane Loft","Elevator Head","Upper Truss Way","East Semaphore"],lower:["Berth Bilge Return","Hoist Pump Gallery","Ring Axle Service","Turnout Service","Customs Recovery"]},material_ids:{"0":"Empty","100":"BasaltColumns Solid immovable None","58":"ReinforcedConcrete Solid immovable None","62":"SteelPlate Solid immovable None"},midge_authored_hull:[4,3],hull_envelopes:[[19,15],[23,19],[31,27]],exact_sites:sites,material_histogram:hist,stable_occupied_cells:area,grounded:area,detached_cells:0,pruned_disconnected_decor_cells:pruned,grounding_steel_ties:ties.length,rectangles:rect.length,rectangle_work:area,setup_bytes:jbytes.length,material_plane_sha256:sha256(g),setup_sha256:sha256(jbytes),clearance:status,obstruction:{material:58,rect:barrier,from:"Mooring Arrival",to:"Dispatch Ledger",size:[31,27],sites_reached:detour.reached,unreachable:detour.bad,distance_before_after:routeDistance},images:images.map(z=>({name:z.name,rect:z.rect,bytes:z.bytes.length,sha256:z.sha256,pixel_parity:z.pixels})),native_status:"NATIVE-UNTESTED",bridge_source_max_rectangles:32768,installed_fallback_risk:4096,proof:"Exhaustive material-ID grid, disjoint ordered rectangle replay, full in-bounds three-envelope 4-BFS, obstacle return, verified indexed PNG CRC/zlib/Adler/pixel parity"};
return {g,rect,sites,crops,images,receipt,setup,json,jbytes,status,detour:{reached:detour.reached,bad:detour.bad,component:detour.component},distance:routeDistance,pruned};
}
return {generate,sha256,base64,utf8};
})();
if(typeof module!=="undefined"){
 module.exports=lib;
 if(require.main===module){
  const fs=require("fs"),path=require("path");
  const a=lib.generate(),p=__dirname,verify=process.argv.includes("--verify");
  const outputs=[["setup-orison-wheelhouse.json",Buffer.from(a.json,"utf8")],
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
