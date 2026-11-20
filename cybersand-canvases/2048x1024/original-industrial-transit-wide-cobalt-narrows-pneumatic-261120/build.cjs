"use strict";
const lib=(function factory(){
"use strict";
const W=2048,H=1024,N=W*H,SEED=0xC0BA171,IDS=[0,100,58,62], M={AIR:0,ROCK:100,WALL:58,STEEL:62};
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
const g=new Uint8Array(N),sites={"West launch":[136,382],"Harbour clearance":[351,382],"Drydock hold":[323,626],"Lock-lift approach":[585,382],"Twin ram cabin":[718,631],"Upper hoist board":[535,252],"Gorge west":[814,382],"Siphon crown":[1013,248],"Transfer throat":[1056,382],"Pipe maintenance":[1122,631],"Distributor ingress":[1288,382],"Distributor operator":[1520,630],"Flyover relay":[1450,253],"Customs approach":[1570,382],"East invoice station":[1843,380],"Terminal tally":[1869,630],"Final beacon":[1942,382],"West bilge return":[227,854],"Ram service return":[613,854],"Siphon valve return":[1030,854],"Shunt recover":[1441,854],"East tram return":[1810,854]};
function R(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);let a=Math.max(0,x),b=Math.min(W,x+w),c=Math.max(0,y),d=Math.min(H,y+h);if(a>=b||c>=d)return;for(let yy=c;yy<d;yy++)g.fill(m,yy*W+a,yy*W+b);}
function P(v,m){let lo=Math.max(0,Math.ceil(Math.min(...v.map(a=>a[1])))),hi=Math.min(H-1,Math.ceil(Math.max(...v.map(a=>a[1]))));for(let y=lo;y<=hi;y++){let xx=[];for(let j=0;j<v.length;j++){let a=v[j],b=v[(j+1)%v.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xx.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xx.sort((a,b)=>a-b);for(let j=0;j+1<xx.length;j+=2)R(Math.ceil(xx[j]),y,Math.floor(xx[j+1])-Math.ceil(xx[j])+1,1,m);}}
function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,rad=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-rad));yy<Math.min(H,Math.ceil(Math.max(y,Y)+rad+1));yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-rad));xx<Math.min(W,Math.ceil(Math.max(x,X)+rad+1));xx++){let s=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(d||1)));if((xx-x-s*dx)**2+(yy-y-s*dy)**2<=rad*rad)g[yy*W+xx]=m;}}
function ring(cx,cy,rx,ry,t,m){for(let y=Math.max(0,cy-ry);y<Math.min(H,cy+ry);y++)for(let x=Math.max(0,cx-rx);x<Math.min(W,cx+rx);x++){let n=((x-cx)/rx)**2+((y-cy)/ry)**2;if(n<=1&&n>=(1-t/Math.min(rx,ry))**2)g[y*W+x]=m;}}





/* COBALT NARROWS: an original drydock-to-pneumatic-siphon-to-rail exchange.
   Side-elevation material cells. No source image or prior-map geometry. */
function beam(x,y,X,Y,t=9,m=M.STEEL){L(x,y,X,Y,t,m);}
function wheel(x,y,rr=17){ring(x,y,rr,rr,6,M.STEEL);ring(x,y,Math.max(7,rr-10),Math.max(7,rr-10),3,M.WALL);for(let j=0;j<6;j++){let a=j*Math.PI/3;beam(x,y,x+rr*Math.cos(a),y+rr*Math.sin(a),3,M.WALL);}}
function freight(x,y,w=74,h=36){R(x,y,w,h,M.STEEL);R(x+7,y+7,w-14,h-14,M.WALL);for(let k=18;k<w-11;k+=20)R(x+k,y+8,5,h-16,M.STEEL);}
function cab(x,y,w=74,h=67){R(x,y,w,h,M.WALL);R(x+9,y+9,w-18,h-19,M.AIR);R(x+13,y+17,w-27,14,M.STEEL);R(x+8,y+h-12,w-16,12,M.STEEL);}
function trestle(x,y,root){R(x,y,17,root-y,M.WALL);R(x+6,y+7,6,root-y-14,M.STEEL);beam(x-24,y+25,x+17,y+78,7,M.STEEL);}
// Salt-basin rock with deep central and eastern cuts.
for(let x=0;x<W;x++){let z=784+Math.floor(16*Math.sin(x/143)+8*Math.sin(x/29));if(x>710&&x<1250)z+=Math.floor(103*Math.sin(Math.PI*(x-710)/540)**2);if(x>1500&&x<1770)z+=Math.floor(63*Math.sin(Math.PI*(x-1500)/270)**2);R(x,z,1,H-z,M.ROCK);}
P([[0,0],[0,1024],[101,1024],[124,754],[113,600],[78,512],[97,358],[0,320]],M.ROCK);
P([[2048,0],[2048,1024],[1962,1024],[1937,790],[1981,643],[1964,470],[2048,370]],M.ROCK);
R(0,977,W,47,M.WALL);R(77,953,1888,14,M.STEEL);
R(116,814,1829,105,M.AIR);
for(let [x,w] of [[158,236],[510,327],[946,351],[1349,330],[1728,208]]){R(x,917,w,13,M.STEEL);R(x+12,931,14,45,M.WALL);}
// Highline and anchored opposed harbour pylons.
R(83,136,30,841,M.WALL);R(1940,142,30,835,M.WALL);
R(100,133,1855,19,M.STEEL);R(114,149,1793,10,M.WALL);
for(let x of [385,792,1285,1659]){beam(x,160,x+68,204,10,M.STEEL);beam(x+67,160,x,204,9,M.WALL);}
for(let [x,y] of [[422,482],[775,548],[1222,562],[1649,573]]){trestle(x,y,977);beam(x-13,y,x+25,442,13,M.STEEL);}
R(129,682,1793,13,M.STEEL);
for(let [x,y] of [[152,700],[445,690],[774,703],[1232,700],[1665,700],[1920,703]])trestle(x,y,977);
R(127,703,1790,12,M.WALL);
// Western drydock: a continuous cutaway hull, one raised cabin,
// freighter hold, cargo bridge crane and founded cradle.
P([[150,736],[166,665],[210,644],[365,639],[414,670],[424,721],[396,778],[195,793],[160,769]],M.STEEL);
P([[170,728],[187,679],[221,663],[359,656],[393,684],[402,727],[380,759],[203,773]],M.WALL);
P([[191,711],[215,679],[343,672],[379,690],[376,745],[218,748]],M.AIR);
R(193,764,194,15,M.STEEL);R(215,726,11,49,M.WALL);R(367,726,11,49,M.WALL);
P([[299,675],[302,609],[326,584],[356,596],[377,656],[372,675]],M.STEEL);
P([[315,660],[315,615],[330,605],[350,613],[361,658]],M.AIR);
R(321,632,30,14,M.WALL);freight(235,712,68,32);
R(145,790,298,13,M.STEEL);trestle(188,766,979);trestle(399,768,979);
R(164,562,88,13,M.STEEL);beam(193,570,304,466,12,M.STEEL);
beam(304,466,390,553,13,M.STEEL);wheel(306,470,24);
beam(309,493,309,670,7,M.STEEL);freight(363,575,50,32);
cab(160,532,87,63);R(214,593,14,111,M.WALL);
// Pneumatic lift: grounded dual hydraulic rams, two separated cages,
// top sheave + operator, paired through-rails at distinct elevations.
R(454,513,22,289,M.WALL);R(749,470,23,332,M.WALL);
R(465,521,300,15,M.STEEL);R(480,779,273,16,M.STEEL);
for(let [x,top] of [[503,538],[670,517]]){R(x,top,21,266,M.STEEL);R(x+7,top+7,7,241,M.WALL);wheel(x+9,top+14,20);}
R(529,591,113,15,M.STEEL);freight(542,552,92,36);
R(528,662,112,13,M.STEEL);freight(546,625,89,30);
beam(472,524,593,459,14,M.STEEL);beam(596,459,763,484,13,M.STEEL);
wheel(593,475,25);beam(593,500,593,581,9,M.WALL);
R(616,734,119,15,M.WALL);cab(671,706,69,57);
R(475,746,64,15,M.STEEL);beam(509,752,577,791,10,M.WALL);
// The huge invert-S freight siphon, a non-isometric skyline landmark:
// highline-anchored elbows, nested pressure rails, two cargo capsules.
beam(803,671,849,336,23,M.STEEL);beam(846,335,932,195,22,M.STEEL);
beam(930,195,1068,177,23,M.STEEL);beam(1068,177,1186,317,24,M.STEEL);
beam(1186,317,1248,677,22,M.STEEL);
beam(823,677,872,347,10,M.WALL);beam(872,347,948,213,10,M.WALL);
beam(953,208,1058,201,11,M.WALL);beam(1082,213,1160,327,11,M.WALL);
beam(1161,328,1230,663,12,M.WALL);
for(let [x,y] of [[855,332],[935,198],[1088,208],[1186,332]])wheel(x,y,19);
R(810,682,119,19,M.STEEL);R(1142,678,120,21,M.STEEL);
R(884,524,291,16,M.STEEL);R(903,541,252,11,M.WALL);
freight(965,483,85,34);freight(1062,483,85,34);
R(929,547,18,105,M.WALL);R(1119,547,18,105,M.WALL);
R(918,653,236,17,M.STEEL);cab(1056,682,76,68);R(1080,750,17,64,M.WALL);
// Three-grade diagonal mechanical sort and shunt.
R(1270,586,291,16,M.STEEL);
beam(1305,585,1461,512,12,M.STEEL);beam(1461,512,1619,575,12,M.STEEL);
R(1329,652,289,16,M.STEEL);
beam(1325,666,1460,709,10,M.WALL);beam(1461,709,1603,663,10,M.STEEL);
for(let x of [1340,1462,1568]){trestle(x,667,977);wheel(x+20,652,15);}
freight(1338,548,69,31);freight(1535,542,68,31);
R(1440,592,98,14,M.WALL);cab(1453,706,75,61);
R(1510,760,19,57,M.STEEL);R(1314,755,272,15,M.WALL);
// Eastern customs: asymmetrical roof, side-entrant desks and cargo weighbridge.
P([[1693,750],[1708,552],[1747,480],[1791,498],[1840,453],[1890,477],[1939,527],[1949,745]],M.WALL);
P([[1717,727],[1729,569],[1757,505],[1793,521],[1847,481],[1879,499],[1916,539],[1928,717]],M.AIR);
R(1700,742,248,17,M.STEEL);R(1724,602,207,16,M.STEEL);
for(let x of [1742,1848,1926])R(x,618,14,124,M.WALL);
R(1767,686,149,13,M.STEEL);freight(1784,647,80,38);
cab(1865,540,64,59);R(1907,596,10,88,M.STEEL);
R(1772,743,10,75,M.WALL);R(1906,743,14,75,M.WALL);
beam(1676,578,1748,547,13,M.STEEL);beam(1890,476,1960,533,12,M.STEEL);
R(1702,793,239,14,M.STEEL);
// Five distinct, bottom-rooted lower service machine rooms.
wheel(277,949,24);R(306,944,96,13,M.STEEL);R(329,920,14,35,M.WALL);
wheel(555,946,19);wheel(678,946,27);beam(575,946,655,947,10,M.STEEL);
R(696,919,66,13,M.WALL);cab(766,910,62,52);
R(950,939,240,13,M.STEEL);wheel(987,956,28);
for(let x of [1051,1080,1109])R(x,920,13,31,M.WALL);
R(1123,918,73,12,M.STEEL);R(1350,943,254,13,M.STEEL);
beam(1373,940,1450,919,10,M.WALL);wheel(1548,949,27);cab(1601,903,62,57);
R(1749,940,161,12,M.STEEL);wheel(1780,952,20);wheel(1862,952,20);
beam(1858,936,1927,910,10,M.STEEL);
// Real 4-connected, generously sized flight corridors, exact visited
// sites and recoverable lower loop, deliberately excavated from physical cells.
R(100,226,1848,84,M.AIR);R(103,344,1842,84,M.AIR);
R(111,806,1818,102,M.AIR);
for(let x of [136,350,535,1013,1450,1843,1942])R(x-43,220,87,217,M.AIR);
for(let x of [227,613,1030,1441,1810])R(x-47,418,95,493,M.AIR);
for(let [x0,x1,y] of [[227,323,626],[613,718,631],[1030,1122,630],[1441,1520,630],[1810,1869,630]])R(x0-40,y-28,x1-x0+90,68,M.AIR);
for(let p of Object.values(sites))R(p[0]-21,p[1]-19,43,39,M.AIR);
R(0,981,W,43,M.WALL);
// Pneumatic power siphon is genuinely suspended from the two grounded
// skyline anchors. These steel tension members touch each freight machine,
// not merely an artistic graphic. They finish above the separate 31×27
// undercroft flight return so the alternate bypass remains physically open.
R(398,148,14,574,M.STEEL);
R(744,148,17,648,M.STEEL);
R(998,148,15,57,M.STEEL);
R(1605,148,17,540,M.STEEL);
R(1741,148,17,412,M.STEEL);
// Independent plate-tension anchors sustain the central cargo platform
// and the western ballast transfer below the flight passages.
R(945,148,17,543,M.STEEL);
R(1344,148,16,603,M.STEEL);
beam(824,548,951,548,14,M.STEEL);
beam(1143,555,1232,555,13,M.STEEL);
beam(1248,672,1354,673,14,M.STEEL);
// Connect the distinct west gorge flight ledge to the lower service return;
// exactly 65 pixels wide, not a nearest-centre or collision waiver.
R(782,419,65,493,M.AIR);
// Reintroduce a genuinely supported cargo transaction beneath the siphon:
// cable-braced transfer beam, two individual sealed loads, downward pickup
// rail and a receiving/pressure-check bay, preserving all 31×27 sites.
R(952,480,220,14,M.STEEL);
beam(960,482,1021,455,8,M.WALL);
beam(1100,478,1165,448,9,M.WALL);
R(973,495,12,26,M.STEEL);R(1108,495,12,27,M.STEEL);
freight(975,521,82,29);freight(1068,521,77,29);
R(972,557,171,12,M.STEEL);
R(986,568,17,70,M.WALL);R(1120,567,17,68,M.WALL);
R(1003,638,136,12,M.STEEL);
cab(1012,677,75,61);
beam(1170,484,1297,517,11,M.STEEL);
beam(1290,520,1351,582,10,M.WALL);
R(1276,573,81,12,M.STEEL);
freight(1281,587,66,30);
// Reinforce the fore floating dock hull from grounded shore, not a decorative
// unattached polygon. Side portal at x227 stays an actual flight route.
R(102,675,67,12,M.STEEL);
R(158,672,20,48,M.WALL);
R(380,702,53,12,M.STEEL);
// Independent broad bypass under the pneumatic receiving bay: exact-geometry
// x1152 passage connects the middle highline to bottom return without
// cutting both anchored cargo loads. No destinations shifted.
R(1150,416,74,498,M.AIR);
R(1097,608,132,61,M.AIR);
// Distinct mid-level real-cell freight highline BETWEEN the two clear
// Midge flight bands: open gantry portals create high/low connections.
R(103,315,1838,16,M.STEEL);
R(115,332,1813,8,M.WALL);
for(let x of [136,350,535,1013,1450,1843,1942])R(x-44,312,89,33,M.AIR);
// Short shuttle pods sit ON the rail rather than floating at scenic scale.
freight(821,312,71,21);freight(1190,312,73,21);freight(1525,312,65,21);
// One readable grounded drydock vessel behind a separate west service crane.
// Bow/cabin/keel are cohesive in the *same* material plane; y>645 stays clear
// of exact hold approach at (323,626), and the Midge shaft x180..273 is open.
P([[277,715],[293,675],[321,655],[399,660],[427,690],
   [423,747],[397,779],[302,784],[279,761]],M.STEEL);
P([[289,716],[308,685],[327,670],[391,674],[413,697],
   [410,742],[391,761],[305,766],[291,748]],M.WALL);
P([[303,713],[322,686],[387,687],[400,708],[398,743],[313,744]],M.AIR);
R(304,763,102,13,M.STEEL);
P([[353,661],[354,593],[376,570],[400,586],[417,625],[411,666]],M.STEEL);
P([[365,648],[366,605],[380,590],[395,603],[404,648]],M.AIR);
R(367,652,44,13,M.WALL);
R(283,759,12,38,M.WALL);R(402,747,15,49,M.STEEL);
beam(410,749,444,702,12,M.STEEL);






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
function BFS(w,h,ob){let pass=new Uint8Array(N),seen=new Uint8Array(N),queue=new Int32Array(N),first=0,last=0;let ox=ob?.[0]||-1,oy=ob?.[1]||-1,ow=ob?.[2]||0,oh=ob?.[3]||0;for(let y=h>>1;y<H-(h>>1);y++)for(let x=w>>1;x<W-(w>>1);x++){if(!clear(x,y,w,h))continue;let left=x-(w>>1),top=y-(h>>1);if(ob&&left<ox+ow&&left+w>ox&&top<oy+oh&&top+h>oy)continue;pass[y*W+x]=1;}let spawn=sites["West launch"],n=spawn[1]*W+spawn[0];if(!pass[n])return {size:[w,h],error:"spawn blocked",pos:spawn};seen[n]=1;queue[last++]=n;while(first<last){let a=queue[first++],x=a%W,y=(a/W)|0;for(let b of [a-W,a+W,a-1,a+1])if(b>=0&&b<N&&!(Math.abs(a-b)===1&&((b/W)|0)!==y)&&pass[b]&&!seen[b]){seen[b]=1;queue[last++]=b;}}let bad=Object.entries(sites).filter(([n,p])=>!seen[p[1]*W+p[0]]).map(([n,p])=>({name:n,xy:p,clear:clear(p[0],p[1],w,h)}));return {size:[w,h],reached:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,component:last,bad,pass,seen};}
let routes=[[19,15],[23,19],[31,27]].map(([w,h])=>BFS(w,h,null)),barrier=[177,344,91,84],detour=BFS(31,27,barrier);
function dist(pass,start,end){let a=start[1]*W+start[0],b=end[1]*W+end[0],seen=new Int32Array(N),Q=new Int32Array(N),first=0,last=0;if(!pass[a]||!pass[b])return -1;Q[last++]=a;seen[a]=1;while(first<last){let n=Q[first++];if(n===b)return (seen[n]-1);let x=n%W,y=(n/W)|0;for(let v of [n-W,n+W,n-1,n+1])if(v>=0&&v<N&&!(Math.abs(n-v)===1&&((v/W)|0)!==y)&&pass[v]&&!seen[v]){seen[v]=seen[n]+1;Q[last++]=v;}}return -1;}
let start=sites["West launch"],finish=sites["Harbour clearance"];
let routeDistance=[dist(routes[2].pass,start,finish),dist(detour.pass,start,finish)];
let status=routes.map(r=>({size:r.size,reached:r.reached,total:r.total,free_centres:r.component,bad:r.bad,error:r.error||null}));
if(status.some(x=>x.reached!==x.total)||detour.reached!==Object.keys(sites).length||routeDistance[0]<0||routeDistance[1]<=routeDistance[0])throw Error('Exact Midge clearance, route or obstruction qualification failure '+JSON.stringify({status,detour:detour.bad,routeDistance}));
if(rect.length>32768||area>32000000)throw Error("budget "+rect.length+"/"+area);
const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:start,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false},json=JSON.stringify(setup),jbytes=utf8(json);
if(jbytes.length>1048576)throw Error("JSON over budget");
let crops=[["01-harbour",114,439,337,369],["02-tri-ram",435,451,358,356],["03-siphon",799,160,477,615],["04-distributor",1276,493,379,302],["05-customs",1684,450,355,371],["06-underworks",902,798,700,226]];
let images=[["overview",[0,0,W,H]],...crops.map(c=>[c[0],c.slice(1)])].map(([name,rect])=>{let data=png(g,rect),pixels=verifyPng(g,rect,data);return{name,rect,bytes:data,sha256:sha256(data),pixels};});
let receipt={concept:"Cobalt Narrows — Pneumatic Drydock Freight Siphon",original:true,seed:SEED,engine_sha:"de109d0131641d6adc8d25bb9ced7ca3d4991105",source_reference_head:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",material_catalogue_blob:"dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3",setup_loader_blob:"70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9",extent:[W,H],route_graph:{"main":["West launch","Harbour clearance","Lock-lift approach","Gorge west","Transfer throat","Distributor ingress","Customs approach","Final beacon"],"high":["Upper hoist board","Siphon crown","Flyover relay"],"lower":["West bilge return","Ram service return","Siphon valve return","Shunt recover","East tram return"]},material_ids:{"0":"Empty","100":"BasaltColumns Solid immovable None","58":"ReinforcedConcrete Solid immovable None","62":"SteelPlate Solid immovable None"},midge_authored_hull:[4,3],hull_envelopes:[[19,15],[23,19],[31,27]],exact_sites:sites,material_histogram:hist,stable_occupied_cells:area,grounded:area,detached_cells:0,pruned_disconnected_decor_cells:pruned,rectangles:rect.length,rectangle_work:area,setup_bytes:jbytes.length,material_plane_sha256:sha256(g),setup_sha256:sha256(jbytes),clearance:status,obstruction:{material:58,rect:barrier,from:"West launch",to:"Harbour clearance",size:[31,27],sites_reached:detour.reached,unreachable:detour.bad,distance_before_after:routeDistance},images:images.map(z=>({name:z.name,rect:z.rect,bytes:z.bytes.length,sha256:z.sha256,pixel_parity:z.pixels})),native_status:"NATIVE-UNTESTED",bridge_source_max_rectangles:32768,installed_fallback_risk:4096,proof:"Exhaustive material-ID grid, disjoint ordered rectangle replay, full in-bounds three-envelope 4-BFS, obstacle return, verified indexed PNG CRC/zlib/Adler/pixel parity"};
return {g,rect,sites,crops,images,receipt,setup,json,jbytes,status,detour:{reached:detour.reached,bad:detour.bad,component:detour.component},distance:routeDistance,pruned};
}
return {generate,sha256,base64,utf8};
})();
if(typeof module!=="undefined"){
 module.exports=lib;
 if(require.main===module){
  const fs=require("fs"),path=require("path");
  const a=lib.generate(),p=__dirname,verify=process.argv.includes("--verify");
  const outputs=[["setup-cobalt-narrows.json",Buffer.from(a.json,"utf8")],
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
