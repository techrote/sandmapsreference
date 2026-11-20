"use strict";
const lib=(function factory(){
"use strict";
const W=2048,H=1024,N=W*H,SEED=0xCA1D320,IDS=[0,100,58,62], M={AIR:0,ROCK:100,WALL:58,STEEL:62};
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
const g=new Uint8Array(N),sites={"West slip ingress":[111,415],"Quay tally loft":[317,418],"Serviced hull interior":[330,676],"Jackyard cargo handoff":[624,414],"Lift crown inspection":[628,126],"West flight summit":[815,146],"First incline switch":[806,405],"Second inclined handoff":[1050,381],"Skyline return gap":[1075,166],"Middle grade-control":[1236,467],"Counterweight crown":[1385,166],"Counterweight repair bay":[1411,452],"Traverse rolling cradle":[1540,438],"Consolidation outer yard":[1710,435],"Warehouse freight assay":[1790,614],"East dispatch beacon":[1920,408],"Slip basin pump":[258,833],"Lift gearbox lower":[681,833],"Ridge drainage winch":[1100,833],"Traverse switch service":[1485,833],"Outbound recovery":[1860,833]};
function R(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);let a=Math.max(0,x),b=Math.min(W,x+w),c=Math.max(0,y),d=Math.min(H,y+h);if(a>=b||c>=d)return;for(let yy=c;yy<d;yy++)g.fill(m,yy*W+a,yy*W+b);}
function P(v,m){let lo=Math.max(0,Math.ceil(Math.min(...v.map(a=>a[1])))),hi=Math.min(H-1,Math.ceil(Math.max(...v.map(a=>a[1]))));for(let y=lo;y<=hi;y++){let xx=[];for(let j=0;j<v.length;j++){let a=v[j],b=v[(j+1)%v.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xx.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xx.sort((a,b)=>a-b);for(let j=0;j+1<xx.length;j+=2)R(Math.ceil(xx[j]),y,Math.floor(xx[j+1])-Math.ceil(xx[j])+1,1,m);}}
function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,rad=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-rad));yy<Math.min(H,Math.ceil(Math.max(y,Y)+rad+1));yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-rad));xx<Math.min(W,Math.ceil(Math.max(x,X)+rad+1));xx++){let s=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(d||1)));if((xx-x-s*dx)**2+(yy-y-s*dy)**2<=rad*rad)g[yy*W+xx]=m;}}
function ring(cx,cy,rx,ry,t,m){for(let y=Math.max(0,cy-ry);y<Math.min(H,cy+ry);y++)for(let x=Math.max(0,cx-rx);x<Math.min(W,cx+rx);x++){let n=((x-cx)/rx)**2+((y-cy)/ry)**2;if(n<=1&&n>=(1-t/Math.min(rx,ry))**2)g[y*W+x]=m;}}



/* ORIGINAL CALDER STEP — a tall ship-to-rail three-grade switchback transfer.
   Authored topology: west dry basin, freight jacklift, three incline traverses,
   counterpoise tower, offloaded warehouse, five independently staffed lower bays. */
function truss(x,y,X,Y){L(x,y,X,Y,12,M.STEEL);L(x,y+26,X,Y+26,8,M.WALL);
 const steps=Math.max(2,Math.floor(Math.hypot(X-x,Y-y)/65));
 for(let i=0;i<steps;i++){const t=(i+.5)/steps,a=x+(X-x)*t,b=y+(Y-y)*t;L(a,b,a+17,b+27,5,M.STEEL);L(a+17,b+27,a+40,b,5,M.WALL);}}
function cab(x,y,w,h){R(x,y,w,h,M.WALL);R(x+4,y+4,w-8,h-11,M.STEEL);R(x+8,y+8,w-16,5,M.WALL);}
function wagon(x,y,w){R(x,y,w,21,M.STEEL);R(x+6,y+6,w-12,9,M.WALL);for(const a of [14,w-15])ring(x+a,y+25,10,10,5,M.WALL);}
for(let x=0;x<W;x++){
 let floor=746+Math.round(11*Math.sin(x*.014)+6*Math.sin(x*.041));
 if(x>720&&x<1380)floor+=Math.round(109*Math.sin(Math.PI*(x-720)/660)**2);
 if(x>1540)floor-=Math.round(34*Math.min(1,(x-1540)/340));
 R(x,floor,1,H-floor,M.ROCK);}
P([[0,1024],[0,370],[30,382],[61,475],[76,668],[68,853]],M.ROCK);
P([[2048,1024],[2048,397],[2017,417],[1988,522],[2008,804]],M.ROCK);
R(0,993,2048,31,M.WALL);
P([[134,635],[170,605],[475,604],[518,655],[506,817],[155,820]],M.AIR);
R(74,793,1927,85,M.AIR);
for(const [x,w] of [[165,246],[526,236],[934,306],[1365,255],[1762,232]]){
 R(x,871,w,100,M.AIR);R(x,963,w,14,M.WALL);}
/* Distinctive continuous *supported* long-distance freight tie, rather than
   disconnected upper-stage decorations. It becomes navigable above and below. */
for(const [a,b,c,d] of [[0,752,510,739],[510,739,853,768],[853,768,1200,753],
 [1200,753,1510,740],[1510,740,1830,754],[1830,754,2047,738]])
 L(a,b,c,d,15,M.STEEL);
for(const [x,top] of [[225,704],[455,676],[575,680],[745,683],[897,702],
 [1117,674],[1319,692],[1514,692],[1690,680],[1910,697]]){
 R(x,top,17,76,M.WALL);
 R(x+5,top+5,7,60,M.STEEL);}
/* Ship: single stepped continuous hull / asymmetric bridge / two open holds. */
P([[153,714],[184,691],[398,687],[456,724],[440,767],[399,798],
 [223,802],[171,765]],M.STEEL);
P([[179,721],[208,710],[394,707],[438,739],[417,772],[387,788],
 [230,791],[185,754]],M.WALL);
P([[210,722],[390,720],[417,738],[401,769],[232,771],[207,744]],M.AIR);
P([[352,711],[353,652],[380,630],[410,635],[430,663],[432,711]],M.STEEL);
P([[366,699],[366,658],[384,645],[401,650],[417,665],[418,699]],M.AIR);
R(365,700,65,10,M.WALL);R(379,670,24,11,M.WALL);
R(296,698,66,74,M.AIR);R(292,777,77,13,M.STEEL);
R(228,720,12,52,M.WALL);R(395,725,12,46,M.STEEL);
for(const [x,y,w] of [[241,739,42],[319,741,49]]){cab(x,y,w,23);R(x+10,y+23,8,12,M.STEEL);}
for(const x of [194,285,374,442]){R(x,796,16,73,M.STEEL);L(x-11,805,x+30,786,8,M.WALL);}
R(189,807,277,13,M.STEEL);
L(406,773,496,665,13,M.STEEL);
L(439,729,504,624,9,M.STEEL);
/* West tally hall is genuinely entered and functional; berth-jack handoff. */
R(457,554,116,14,M.STEEL);
R(461,568,14,88,M.WALL);R(558,568,14,88,M.WALL);
R(476,582,80,62,M.AIR);R(480,646,84,12,M.STEEL);
cab(484,614,29,28);R(528,614,21,12,M.WALL);
L(541,618,560,591,6,M.STEEL);
L(485,681,604,618,13,M.STEEL);
/* Jacklift two asymmetrical founded legs, sheave and serviceable cargo cage. */
for(const [x,top,w] of [[548,221,28],[729,282,32]]){
 R(x,top,w,538,M.WALL);R(x+9,top+8,9,524,M.STEEL);
 R(x-12,742,w+46,18,M.STEEL);}
truss(563,224,644,154);truss(644,154,752,287);
R(609,145,80,16,M.STEEL);
ring(648,202,27,24,9,M.STEEL);ring(690,222,19,18,7,M.WALL);
L(649,222,649,528,8,M.STEEL);L(690,240,690,562,8,M.WALL);
R(588,514,137,16,M.STEEL);R(599,530,112,64,M.WALL);
R(611,540,89,41,M.AIR);R(594,592,122,14,M.STEEL);
R(611,602,14,51,M.WALL);R(692,602,14,51,M.WALL);
R(567,651,176,15,M.STEEL);
cab(584,676,35,27);R(663,680,45,17,M.WALL);
cab(623,552,49,29);
L(690,277,784,345,11,M.STEEL);
/* Three nonparallel distinct freight grades, grounded every span by towers. */
truss(744,345,1108,289);truss(829,490,1242,397);truss(765,620,1108,556);
wagon(821,309,74);wagon(968,448,53);wagon(1008,554,90);
for(const [x,y,h] of [[773,370,347],[911,485,282],[1130,434,337]]){
 R(x,y,18,h,M.WALL);R(x+6,y+5,7,h-11,M.STEEL);
 L(x,y+h*.46,x+74,y+h*.76,11,M.STEEL);
 L(x+14,y+h*.74,x+84,y+h*.49,8,M.WALL);}
L(741,341,686,282,15,M.STEEL);
L(1107,289,1324,278,12,M.STEEL);
L(1242,397,1339,357,13,M.STEEL);
L(1108,556,1297,578,13,M.STEEL);
R(852,516,100,13,M.STEEL);
R(862,529,14,73,M.WALL);R(935,529,14,72,M.WALL);
R(878,537,56,55,M.AIR);cab(884,565,28,24);
R(1066,635,114,12,M.STEEL);R(1075,647,13,76,M.WALL);
R(1164,647,14,76,M.WALL);R(1088,654,75,61,M.AIR);
R(1093,708,56,11,M.STEEL);
ring(1113,681,18,15,6,M.STEEL);
L(1127,685,1158,647,6,M.WALL);
/* Vertical four-guide counterpoise with differentiated inside/outside work. */
for(const [x,top,w] of [[1307,244,27],[1446,306,24]]){
 R(x,top,w,521-top+251,M.WALL);R(x+8,top+8,8,733-top,M.STEEL);}
L(1320,245,1386,177,16,M.STEEL);
L(1386,177,1460,308,14,M.WALL);
R(1350,176,68,16,M.STEEL);
ring(1386,258,48,45,12,M.STEEL);
ring(1386,258,19,18,7,M.WALL);
for(let k=0;k<8;k++){let t=k*Math.PI/4;
 L(1386+19*Math.cos(t),258+18*Math.sin(t),1386+45*Math.cos(t),258+42*Math.sin(t),6,M.STEEL);}
L(1381,300,1381,561,9,M.STEEL);
R(1355,541,52,14,M.WALL);
R(1360,558,41,85,M.STEEL);R(1369,569,24,65,M.WALL);
R(1338,654,103,15,M.STEEL);
R(1350,669,14,70,M.WALL);R(1421,669,14,70,M.WALL);
R(1367,676,54,54,M.AIR);cab(1372,703,25,24);
L(1314,651,1290,744,12,M.STEEL);
L(1460,644,1504,744,12,M.WALL);
R(1297,743,204,17,M.STEEL);
/* Parallel traverse instead of a second rotary wheel: visible wagon handoff. */
R(1491,558,219,17,M.STEEL);
R(1504,575,16,123,M.WALL);R(1683,575,16,123,M.WALL);
R(1520,589,163,85,M.AIR);
R(1517,674,158,17,M.STEEL);
wagon(1532,528,70);wagon(1628,518,81);
L(1497,557,1550,480,13,M.STEEL);
L(1661,556,1752,622,12,M.STEEL);
L(1513,699,1797,655,14,M.STEEL);
R(1543,692,15,57,M.WALL);
R(1681,691,15,54,M.WALL);
cab(1538,639,35,29);cab(1608,637,47,24);
R(1508,744,222,16,M.STEEL);
/* Splayed-roof consolidation hall and actually staffed scale/dispatch. */
P([[1705,727],[1719,422],[1759,360],[1817,367],[1870,326],
   [1950,337],[2033,409],[2048,713]],M.WALL);
P([[1731,703],[1742,452],[1776,387],[1816,392],[1880,353],
   [1942,358],[2008,425],[2019,704]],M.AIR);
R(1723,703,308,17,M.STEEL);
R(1769,565,228,16,M.STEEL);
R(1779,580,15,91,M.WALL);R(1981,580,15,89,M.WALL);
R(1793,590,185,69,M.AIR);
R(1793,660,194,14,M.STEEL);
R(1817,597,81,13,M.STEEL);
R(1832,609,15,49,M.WALL);R(1882,609,15,49,M.WALL);
R(1847,622,33,27,M.AIR);
cab(1911,602,43,30);
R(1743,437,91,12,M.STEEL);
R(1751,447,15,43,M.WALL);R(1812,447,14,43,M.WALL);
R(1768,456,42,23,M.AIR);
R(1867,380,102,12,M.STEEL);
R(1879,392,14,44,M.WALL);R(1952,392,14,44,M.WALL);
R(1894,399,57,24,M.WALL);
R(1801,680,111,13,M.STEEL);
R(1820,693,13,33,M.WALL);R(1894,693,13,33,M.WALL);
R(1845,700,34,18,M.STEEL);
wagon(1940,684,61);
R(2010,595,13,85,M.STEEL);L(2014,601,1970,549,9,M.WALL);
/* Five distinct lower-world service machines, not wallpaper. */
R(75,794,1925,81,M.AIR);
R(190,952,163,13,M.STEEL);
ring(249,925,42,34,10,M.STEEL);ring(249,925,19,15,5,M.WALL);
L(210,922,185,880,8,M.STEEL);L(291,920,336,880,8,M.WALL);
cab(308,929,33,24);
R(574,953,180,13,M.STEEL);
ring(613,925,22,18,6,M.WALL);ring(677,927,31,25,9,M.STEEL);
L(634,925,649,926,7,M.WALL);cab(717,932,30,23);
R(972,952,255,14,M.STEEL);
ring(1032,924,37,30,9,M.STEEL);
ring(1131,928,23,20,6,M.WALL);
L(1067,924,1107,927,9,M.STEEL);
L(994,945,1020,892,10,M.WALL);
R(1382,953,237,13,M.STEEL);
R(1405,919,92,12,M.WALL);
L(1460,919,1512,889,10,M.STEEL);
L(1512,889,1555,935,9,M.WALL);cab(1537,932,34,23);
R(1760,951,214,15,M.STEEL);
R(1805,923,107,13,M.WALL);
for(const x of [1829,1882])ring(x,947,13,13,6,M.STEEL);
L(1919,944,1966,892,10,M.STEEL);
/* Five genuine 73-wide shafts keep alternate recovery and exits accessible. */
for(const [cx,top] of [[265,458],[682,445],[1100,471],[1485,483],[1860,494]])
 R(cx-36,top,73,421,M.AIR);
for(const p of Object.values(sites))R(p[0]-20,p[1]-18,41,37,M.AIR);
R(0,993,2048,31,M.WALL);

/* Founded structural portal piers; aircraft return requires the separate shafts. */
for(const [x,w] of [[478,110],[866,110],[1210,120],[1635,117],[1937,102]]){
 R(x,736,w,257,M.WALL); R(x+20,797,w-40,95,M.AIR);
 R(x+24,910,w-48,50,M.AIR);
}
/* Genuine large side-entry slots from each open flight lane. */
R(527,366,88,113,M.AIR);R(729,370,90,118,M.AIR);
R(1286,376,89,119,M.AIR);R(1429,374,84,120,M.AIR);
R(1688,387,92,122,M.AIR);R(1710,537,115,119,M.AIR);
R(632,367,76,129,M.AIR);R(1113,423,93,120,M.AIR);
R(1230,356,102,141,M.AIR);

/* Two root-preserving hoist/counterweight guide rods. The staggered
   73x149 and 80x127 open transfer apertures are authentic full-hull
   transit gates between the upper, middle and lowest grade decks. */
L(646,157,715,259,11,M.STEEL);R(708,258,14,484,M.WALL);
R(1378,295,14,381,M.STEEL);
R(938,273,73,149,M.AIR);
R(1045,410,80,127,M.AIR);
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
function BFS(w,h,ob){let pass=new Uint8Array(N),seen=new Uint8Array(N),queue=new Int32Array(N),first=0,last=0;let ox=ob?.[0]||-1,oy=ob?.[1]||-1,ow=ob?.[2]||0,oh=ob?.[3]||0;for(let y=h>>1;y<H-(h>>1);y++)for(let x=w>>1;x<W-(w>>1);x++){if(!clear(x,y,w,h))continue;let left=x-(w>>1),top=y-(h>>1);if(ob&&left<ox+ow&&left+w>ox&&top<oy+oh&&top+h>oy)continue;pass[y*W+x]=1;}let spawn=sites["West slip ingress"],n=spawn[1]*W+spawn[0];if(!pass[n])return {size:[w,h],error:"spawn blocked",pos:spawn};seen[n]=1;queue[last++]=n;while(first<last){let a=queue[first++],x=a%W,y=(a/W)|0;for(let b of [a-W,a+W,a-1,a+1])if(b>=0&&b<N&&!(Math.abs(a-b)===1&&((b/W)|0)!==y)&&pass[b]&&!seen[b]){seen[b]=1;queue[last++]=b;}}let bad=Object.entries(sites).filter(([n,p])=>!seen[p[1]*W+p[0]]).map(([n,p])=>({name:n,xy:p,clear:clear(p[0],p[1],w,h)}));return {size:[w,h],reached:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,component:last,bad,pass,seen};}
let routes=[[19,15],[23,19],[31,27]].map(([w,h])=>BFS(w,h,null)),barrier=[169,363,75,111],detour=BFS(31,27,barrier);
function dist(pass,start,end){let a=start[1]*W+start[0],b=end[1]*W+end[0],seen=new Int32Array(N),Q=new Int32Array(N),first=0,last=0;if(!pass[a]||!pass[b])return -1;Q[last++]=a;seen[a]=1;while(first<last){let n=Q[first++];if(n===b)return (seen[n]-1);let x=n%W,y=(n/W)|0;for(let v of [n-W,n+W,n-1,n+1])if(v>=0&&v<N&&!(Math.abs(n-v)===1&&((v/W)|0)!==y)&&pass[v]&&!seen[v]){seen[v]=seen[n]+1;Q[last++]=v;}}return -1;}
let start=sites["West slip ingress"],finish=sites["Quay tally loft"];
let routeDistance=[dist(routes[2].pass,start,finish),dist(detour.pass,start,finish)];
let status=routes.map(r=>({size:r.size,reached:r.reached,total:r.total,free_centres:r.component,bad:r.bad,error:r.error||null}));
if(status.some(x=>x.reached!==x.total)||detour.reached!==Object.keys(sites).length||routeDistance[0]<0||routeDistance[1]<=routeDistance[0])throw Error('Exact Midge clearance, route or obstruction qualification failure '+JSON.stringify({status,detour:detour.bad,routeDistance}));
if(rect.length>32768||area>32000000)throw Error("budget "+rect.length+"/"+area);
const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:start,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false},json=JSON.stringify(setup),jbytes=utf8(json);
if(jbytes.length>1048576)throw Error("JSON over budget");
let crops=[["01-drydock-vessel",105,430,423,400],["02-jacklift",480,115,312,680],["03-trigrade-rail",745,229,582,565],["04-counterpoise",1284,134,295,662],["05-consolidation",1674,299,374,493],["06-underground-return",890,780,464,244]];
let images=[["overview",[0,0,W,H]],...crops.map(c=>[c[0],c.slice(1)])].map(([name,rect])=>{let data=png(g,rect),pixels=verifyPng(g,rect,data);return{name,rect,bytes:data,sha256:sha256(data),pixels};});
let receipt={concept:"Calder Step — Tri-Grade Ship-to-Rail Incline",original:true,seed:SEED,engine_sha:"de109d0131641d6adc8d25bb9ced7ca3d4991105",source_reference_head:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",material_catalogue_blob:"dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3",setup_loader_blob:"70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9",extent:[W,H],route_graph:{main:["West slip ingress","Quay tally loft","Jackyard cargo handoff","First incline switch","Second inclined handoff","Middle grade-control","Traverse rolling cradle","Consolidation outer yard","East dispatch beacon"],upper:["Lift crown inspection","West flight summit","Skyline return gap","Counterweight crown"],lower:["Slip basin pump","Lift gearbox lower","Ridge drainage winch","Traverse switch service","Outbound recovery"]},material_ids:{"0":"Empty","100":"BasaltColumns Solid immovable None","58":"ReinforcedConcrete Solid immovable None","62":"SteelPlate Solid immovable None"},midge_authored_hull:[4,3],hull_envelopes:[[19,15],[23,19],[31,27]],exact_sites:sites,material_histogram:hist,stable_occupied_cells:area,grounded:area,detached_cells:0,pruned_disconnected_decor_cells:pruned,rectangles:rect.length,rectangle_work:area,setup_bytes:jbytes.length,material_plane_sha256:sha256(g),setup_sha256:sha256(jbytes),clearance:status,obstruction:{material:58,rect:barrier,from:"West slip ingress",to:"Quay tally loft",size:[31,27],sites_reached:detour.reached,unreachable:detour.bad,distance_before_after:routeDistance},images:images.map(z=>({name:z.name,rect:z.rect,bytes:z.bytes.length,sha256:z.sha256,pixel_parity:z.pixels})),native_status:"NATIVE-UNTESTED",bridge_source_max_rectangles:32768,installed_fallback_risk:4096,proof:"Exhaustive material-ID grid, disjoint ordered rectangle replay, full in-bounds three-envelope 4-BFS, obstacle return, verified indexed PNG CRC/zlib/Adler/pixel parity"};
return {g,rect,sites,crops,images,receipt,setup,json,jbytes,status,detour:{reached:detour.reached,bad:detour.bad,component:detour.component},distance:routeDistance,pruned};
}
return {generate,sha256,base64,utf8};
})();
if(typeof module!=="undefined"){
 module.exports=lib;
 if(require.main===module){
  const fs=require("fs"),path=require("path");
  const a=lib.generate(),p=__dirname,verify=process.argv.includes("--verify");
  const outputs=[["setup-calder-step.json",Buffer.from(a.json,"utf8")],
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
