"use strict";
const lib=(function factory(){
"use strict";
const W=2048,H=1024,N=W*H,SEED=0xC1EF228,IDS=[0,100,58,62], M={AIR:0,ROCK:100,WALL:58,STEEL:62};
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
"West breakwater ingress":[130,490],"Hull intake quay":[309,491],"Securement clamp ledger":[498,492],
"Refusal inspection station":[646,491],"Salvage cut bay":[913,652],"Rigging strip station":[1028,653],
"Recovery gantry pilot":[900,349],"Crown cable switch":[1160,349],
"Upper dry inspection":[374,347],"Cofferdam gate captain":[1340,492],
"Materials sorter":[1530,492],"Recovery freight dispatch":[1817,491],
"East bridge lookout":[1652,348],"Undercradle sampling":[1185,651],
"Breakwater refuge":[193,750],"West service return":[475,750],
"Basin emergency bay":[744,748],"Rigging descent":[1118,750],
"Separator service":[1479,748],"Eastern recovery":[1818,751],
"West pump station":[298,911],"Capstan engine vault":[646,910],
"Basin filter gallery":[1067,911],"Rig retrieval vault":[1438,910],
"Outbound utility exchange":[1788,911]};
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
/* CLEFTLINE LOGISTICS — BREAKWATER RECOVERY AND HULL DE-RIGGING BASIN
   New topology: asymmetric, deep V-shaped salvage trench; inward-facing
   heavy rooted shoulders; a suspended-from-rooted gantry crowning the void.
   No arkship in cliff, no tipper, no double ballast cistern or linear quay. */
/* Carved V-trench, heaving geological shoulders and secure continuous foot. */
for(let x=0;x<W;x++){
 let notch=Math.max(0,1-Math.abs(x-1035)/660);
 let y=590+Math.round(319*notch+13*Math.sin(x/137)+4*Math.sin(x/19));
 if(x>850&&x<1210)y=913+Math.round(6*Math.sin(x/37));
 rock(x,y,1,H-y);
}
rock(0,980,W,44);
P([[0,570],[90,549],[166,573],[213,660],[270,771],[338,821],[291,1024],[0,1024]],M.ROCK);
P([[2048,540],[1987,550],[1889,580],[1845,662],[1784,777],[1706,836],[1806,1024],[2048,1024]],M.ROCK);
rock(0,1005,W,19);
/* Western exposed breakwater wall: fitted docks and hull intake. */
P([[70,565],[136,550],[215,575],[270,623],[261,675],[86,680]],M.WALL);
P([[88,586],[150,568],[216,590],[239,619],[220,648],[92,651]],M.AIR);
steel(102,659,205,18);rock(85,678,83,77);
for(let x of [130,202,271]){wall(x,596,17,76);steel(x+4,601,6,61);}
track(102,676,492);
hull(271,547,483,144);
steel(325,688,336,18);beam(343,699,356,744,11);
wall(382,682,31,60);wall(615,678,35,61);
for(let x of [348,438,532,629]){steel(x,674,17,15);steel(x+5,667,8,10);}
P([[657,621],[694,591],[738,590],[777,627],[778,698],[667,709]],M.WALL);
P([[684,639],[702,612],[736,614],[757,643],[754,681],[682,682]],M.AIR);
steel(681,691,91,14);
for(let x of [403,466,539,612]){steel(x,561,14,63);wall(x+4,568,5,43);}
bolts(365,578,11);
cage(378,568,153,95);
gauge(548,588);
cabinet(572,632,73,48);
track(228,717,490);
/* Immense asymmetric structural shoulders. Cross-section is the hero shape. */
P([[575,807],[622,676],[675,681],[713,735],[741,855],[732,957],[636,965]],M.WALL);
P([[598,858],[647,719],[667,723],[696,755],[707,863],[689,930],[632,937]],M.AIR);
for(let y of [722,790,858]){steel(615,y,118,15);beam(624,y+12,681,y+62,9);}
P([[1393,798],[1418,684],[1486,628],[1549,678],[1576,822],[1592,974],[1448,967]],M.WALL);
P([[1432,818],[1454,721],[1490,683],[1518,714],[1544,844],[1557,942],[1461,938]],M.AIR);
for(let y of [708,778,853]){steel(1404,y,154,16);beam(1427,y+9,1514,y+79,10);}
/* Secondary heavily bracketed basin cradle across lower V, reached from service road. */
P([[724,785],[771,757],[865,748],[1223,749],[1329,769],[1392,803],[1392,842],[734,842]],M.STEEL);
P([[753,790],[799,778],[1241,780],[1345,800],[1346,822],[762,822]],M.AIR);
for(let xx=790;xx<1330;xx+=86){wall(xx,821,24,126);beam(xx+3,821,xx+49,901,8);}
steel(743,837,650,19);
track(751,843,640);
for(let x of [801,938,1115,1273]){steel(x,769,25,15);steel(x+8,753,9,17);}
hull(786,633,399,93);
for(let x of [821,944,1054]){steel(x,703,33,23);wall(x+10,696,10,40);}
/* Clamp and rig stripping: caged fixture, hook, cutaway cargo and two distinct workfaces. */
beam(842,659,871,606,11);beam(871,606,935,602,12);
wall(870,632,24,103);steel(871,622,38,14);steel(897,653,52,11);
cabinet(901,684,84,45);gauge(1041,687);
for(let j=0;j<4;j++){wall(1113+j*24,673,9,37);steel(1110+j*24,685,15,5);}
steel(1007,708,204,12);
/* Huge raised de-rigging gantry, asymmetric double-pier and cable transaction. */
for(let x of [638,1400]){wall(x,270,28,662);steel(x+6,270,16,648);beam(x+15,595,x+81,744,12);}
steel(641,265,782,23);
steel(694,245,637,20);
for(let x=694;x<1340;x+=73){beam(x,245,x+73,286,9);beam(x,286,x+73,245,9);steel(x,246,7,39);}
beam(644,273,793,165,12);beam(793,165,1187,165,15);beam(1187,165,1410,272,12);
for(let x of [794,978,1185]){steel(x,160,10,93);wall(x-6,170,21,12);}
steel(925,281,164,28);wall(953,307,105,24);steel(962,311,23,21);hoop(1038,306,19);
/* Suspended hoist is explicitly guided and material-handling, with rooted leg supports. */
beam(1010,323,1009,592,5);beam(1062,325,1065,581,5);
hoop(1035,571,26);steel(1001,600,75,21);
beam(1050,592,1165,659,11);steel(1148,653,68,19);wall(1182,672,19,57);
/* Behind-gantry high access weather screens and inhabited operator rooms. */
P([[330,395],[348,245],[411,206],[483,230],[514,385]],M.WALL);
P([[355,377],[369,262],[410,235],[469,246],[492,378]],M.AIR);
steel(349,382,148,16);cabinet(382,315,90,51);gauge(452,336);
beam(387,398,416,497,12);beam(466,398,504,493,12);
P([[1527,391],[1547,210],[1612,188],[1706,246],[1735,395]],M.WALL);
P([[1556,369],[1568,236],[1612,215],[1683,260],[1709,368]],M.AIR);
steel(1546,388,169,15);cabinet(1590,313,89,54);gauge(1548,335);
beam(1563,403,1538,492,12);beam(1678,397,1724,494,11);
/* East recovered-cargo station: non-identical sorter tiers and rail dispatch. */
P([[1450,660],[1481,574],[1549,531],[1867,520],[1978,594],[1951,701],[1463,700]],M.WALL);
P([[1474,650],[1503,595],[1557,555],[1847,546],[1951,601],[1933,679],[1486,680]],M.AIR);
steel(1477,680,461,19);track(1465,706,475);
steel(1533,612,320,15);
for(let x of [1532,1650,1758]){wall(x,615,15,62);beam(x+5,625,x+70,671,8);}
pallet(1538,682);pallet(1669,681);pallet(1790,681);
steel(1579,561,170,14);steel(1720,580,166,13);wall(1740,593,21,66);
cabinet(1633,557,99,55);gauge(1846,579);
for(let x of [1568,1644,1739,1828])bolts(x,622,3);
P([[1906,654],[1927,571],[1982,559],[2048,586],[2048,697]],M.STEEL);
P([[1928,647],[1948,588],[1984,581],[2048,607],[2048,672]],M.AIR);
beam(1934,686,1992,769,13);
/* Four genuinely different maintenance zones in the service geology. */
for(let x of [205,489,799,1164,1515,1812]){
  wall(x,795,20,188);steel(x+5,802,9,168);
}
for(let x of [180,452,731,1044,1355,1699]){steel(x,816,198,16);beam(x+11,826,x+75,909,7);}
hoop(275,868,30);steel(302,861,97,11);cabinet(360,865,63,49);
steel(546,871,141,12);for(let x of [575,602,629]){wall(x,832,12,44);steel(x-5,827,22,7);}
hoop(745,869,22);beam(741,875,813,921,8);
for(let i=0;i<5;i++){steel(930+i*31,843,16,40);wall(937+i*31,849,7,24);}
steel(1200,866,187,15);cabinet(1286,844,78,47);
beam(1449,845,1535,909,11);gauge(1570,850);pallet(1678,899);
steel(1778,862,86,15);hoop(1840,862,20);
/* Three deliberately separate flyable strata, unlike sibling 01's four pods.
   Preserve real workface equipment by putting travel passages in planned zones. */
voidRect(103,449,1850,82);  // Primary high-sided cargo corridor
voidRect(135,327,1772,53);  // Upper gantry hazard bypass
voidRect(117,730,1839,64);  // Lower V-cradle and recovery route
voidRect(145,898,1768,42);  // Deep underworks return
/* Limited shafts link all strata without destroying independent workfaces. */
for(const x of [158,576,729,1330,1457,1913])voidRect(x-26,358,53,410);
for(const x of [319,678,1061,1501,1803])voidRect(x-27,741,55,179);
/* Explicit entered machinery nooks and supporting station side doorways. */
for(const [x,y] of [[400,608],[579,600],[902,683],[1035,680],[1605,588],
 [1704,597],[1756,653],[1578,832],[364,862],[1283,854]])voidRect(x-22,y-14,45,30);
for(const [x,y] of Object.values(sites))voidRect(x-23,y-20,47,41);
rock(0,1005,W,19);
/* Explicit transverse recovery rails and occasional large architectural portals. */
steel(124,547,1794,16);steel(110,703,1810,15);
for(let x of [356,600,873,1227,1555,1870]){wall(x,561,20,135);beam(x+5,615,x+58,696,10);}
for(let x of [224,500,803,1229,1636,1830])voidRect(x-44,538,89,80);
for(let x of [282,673,1031,1540,1841])voidRect(x-43,693,87,63);
for(const [x,y] of Object.values(sites))voidRect(x-24,y-22,49,45);
rock(0,1005,W,19);


steel(568,254,22,751);steel(1398,255,22,750);
steel(568,267,101,19);steel(1390,270,49,21);
steel(785,818,660,19);
for(let [x,top] of [[841,667],[1258,673]])steel(x,top,19,820-top);
steel(110,961,1815,20);
for(let x of [241,493,1838])steel(x,836,17,169);
hull(794,558,437,144);
steel(799,699,451,16);
for(let x of [835,947,1066,1184]){steel(x,691,18,23);wall(x+5,678,8,35);}
cabinet(865,615,78,52);gauge(1168,615);pallet(1059,683);
beam(819,713,844,788,9);beam(1225,712,1260,780,9);
voidRect(97,95,1837,49);
for(const [x,y,w,h] of [[503,136,53,244],[1089,139,56,242],[1525,139,61,246],
 [131,526,64,243],[692,527,65,246],[1304,528,65,246],[1882,527,62,247],
 [1085,519,59,246],[866,629,238,59]])voidRect(x,y,w,h);
for(const [x,y] of Object.values(sites))voidRect(x-24,y-22,49,45);
/* R3 verified bounded functional-art repair. Two descended hoist lines, 
   split grippers and the seated receiver/clamp under the salvage crown.
   Leave the Midge-clear lateral passage between hoist and cradle. */
beam(1004,330,1004,425,8);beam(1056,329,1056,425,8);
steel(988,420,84,13);wall(1014,433,34,20);
beam(1019,447,990,473,7);beam(1044,447,1070,473,7);
steel(977,471,27,10);steel(1057,471,26,10);
steel(964,560,118,14);wall(958,569,16,57);wall(1071,569,16,57);
beam(970,576,992,607,9);beam(1074,576,1052,607,9);
steel(967,620,119,14);steel(1016,602,21,32);
rock(0,1005,W,19);

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
function BFS(w,h,ob){let pass=new Uint8Array(N),seen=new Uint8Array(N),queue=new Int32Array(N),first=0,last=0;let ox=ob?.[0]||-1,oy=ob?.[1]||-1,ow=ob?.[2]||0,oh=ob?.[3]||0;for(let y=h>>1;y<H-(h>>1);y++)for(let x=w>>1;x<W-(w>>1);x++){if(!clear(x,y,w,h))continue;let left=x-(w>>1),top=y-(h>>1);if(ob&&left<ox+ow&&left+w>ox&&top<oy+oh&&top+h>oy)continue;pass[y*W+x]=1;}let spawn=sites["West breakwater ingress"],n=spawn[1]*W+spawn[0];if(!pass[n])return {size:[w,h],error:"spawn blocked",pos:spawn};seen[n]=1;queue[last++]=n;while(first<last){let a=queue[first++],x=a%W,y=(a/W)|0;for(let b of [a-W,a+W,a-1,a+1])if(b>=0&&b<N&&!(Math.abs(a-b)===1&&((b/W)|0)!==y)&&pass[b]&&!seen[b]){seen[b]=1;queue[last++]=b;}}let bad=Object.entries(sites).filter(([n,p])=>!seen[p[1]*W+p[0]]).map(([n,p])=>({name:n,xy:p,clear:clear(p[0],p[1],w,h)}));return {size:[w,h],reached:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,component:last,bad,pass,seen};}
let routes=[[19,15],[23,19],[31,27]].map(([w,h])=>BFS(w,h,null)),barrier=[208,460,78,81],detour=BFS(31,27,barrier);
function dist(pass,start,end){let a=start[1]*W+start[0],b=end[1]*W+end[0],seen=new Int32Array(N),Q=new Int32Array(N),first=0,last=0;if(!pass[a]||!pass[b])return -1;Q[last++]=a;seen[a]=1;while(first<last){let n=Q[first++];if(n===b)return (seen[n]-1);let x=n%W,y=(n/W)|0;for(let v of [n-W,n+W,n-1,n+1])if(v>=0&&v<N&&!(Math.abs(n-v)===1&&((v/W)|0)!==y)&&pass[v]&&!seen[v]){seen[v]=seen[n]+1;Q[last++]=v;}}return -1;}
let start=sites["West breakwater ingress"],finish=sites["Hull intake quay"];
let routeDistance=[dist(routes[2].pass,start,finish),dist(detour.pass,start,finish)];
let status=routes.map(r=>({size:r.size,reached:r.reached,total:r.total,free_centres:r.component,bad:r.bad,error:r.error||null}));
if(status.some(x=>x.reached!==x.total)||detour.reached!==Object.keys(sites).length||routeDistance[0]<0||routeDistance[1]<=routeDistance[0])throw Error('Exact Midge clearance, route or obstruction qualification failure '+JSON.stringify({status,detour:detour.bad,routeDistance}));
if(rect.length>32768||area>32000000)throw Error("budget "+rect.length+"/"+area);
const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:start,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false},json=JSON.stringify(setup),jbytes=utf8(json);
if(jbytes.length>1048576)throw Error("JSON over budget");
let crops=[["01-breakwater-hull-intake",108,415,650,345],["02-offcentre-gantry-pilot",619,152,811,403],["03-rigging-strip-basin",707,548,722,322],["04-recovered-cargo-dispatch",1432,451,573,335],["05-founded-recovery-works",143,765,1790,217]];
let images=[["overview",[0,0,W,H]],...crops.map(c=>[c[0],c.slice(1)])].map(([name,rect])=>{let data=png(g,rect),pixels=verifyPng(g,rect,data);return{name,rect,bytes:data,sha256:sha256(data),pixels};});
let receipt={concept:"Cleftline Logistics — Breakwater Recovery & Hull De-rigging Basin",original:true,seed:SEED,engine_sha:"de58bf1997ca75825cf3b29e046dc1c1022c45bf",source_reference_head:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",material_catalogue_blob:"dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3",setup_loader_blob:"70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9",extent:[W,H],route_graph:{"main":["West breakwater ingress","Hull intake quay","Securement clamp ledger","Refusal inspection station","Cofferdam gate captain","Materials sorter","Recovery freight dispatch"],"upper":["Upper dry inspection","Recovery gantry pilot","Crown cable switch","East bridge lookout"],"salvage":["Salvage cut bay","Rigging strip station","Undercradle sampling"],"recovery":["Breakwater refuge","West service return","Basin emergency bay","Rigging descent","Separator service","Eastern recovery"],"underworks":["West pump station","Capstan engine vault","Basin filter gallery","Rig retrieval vault","Outbound utility exchange"]},material_ids:{"0":"Empty","100":"BasaltColumns Solid immovable None","58":"ReinforcedConcrete Solid immovable None","62":"SteelPlate Solid immovable None"},midge_authored_hull:[4,3],hull_envelopes:[[19,15],[23,19],[31,27]],exact_sites:sites,material_histogram:hist,stable_occupied_cells:area,grounded:area,detached_cells:0,pruned_disconnected_decor_cells:pruned,rectangles:rect.length,rectangle_work:area,setup_bytes:jbytes.length,material_plane_sha256:sha256(g),setup_sha256:sha256(jbytes),clearance:status,obstruction:{material:58,rect:barrier,from:"West breakwater ingress",to:"Hull intake quay",size:[31,27],sites_reached:detour.reached,unreachable:detour.bad,distance_before_after:routeDistance},images:images.map(z=>({name:z.name,rect:z.rect,bytes:z.bytes.length,sha256:z.sha256,pixel_parity:z.pixels})),native_status:"NATIVE-UNTESTED",bridge_source_max_rectangles:32768,legacy_installed_fallback_not_applicable:true,proof:"Exhaustive material-ID grid, disjoint ordered rectangle replay, full in-bounds three-envelope 4-BFS, obstacle return, verified indexed PNG CRC/zlib/Adler/pixel parity"};
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
