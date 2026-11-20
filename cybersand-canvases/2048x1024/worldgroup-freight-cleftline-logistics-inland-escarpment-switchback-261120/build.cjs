"use strict";
const lib=(function factory(){
"use strict";
const W=2048,H=1024,N=W*H,SEED=0xC1EFA03,IDS=[0,100,58,62], M={AIR:0,ROCK:100,WALL:58,STEEL:62};
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


const g=new Uint8Array(N),sites={"Westland inbound gate":[130,476],"Ledger exchange":[347,478],"West upland ridge":[255,252],"West switchback controller":[529,251],"Switchback inspection":[560,474],"Grade shuttle west":[764,474],"Central transfer rail":[998,477],"Central sorter":[1209,473],"Upper signal throat":[915,250],"Western signal gallery":[699,255],"Escarpment command":[1375,256],"East ridge beacon":[1756,252],"Highland export bridge":[1556,477],"Dispatch hoist":[1822,475],"Low intake cavern":[258,679],"Rock-cut weigh room":[471,682],"Reverse grade tender":[757,683],"Gravity classification":[997,681],"East cutaway bins":[1252,679],"Carrier consignment":[1548,683],"East grade exit":[1833,686],"Western pressure works":[267,884],"Lower reversing drum":[727,883],"Deep belt tender":[1157,883],"Eastern water table":[1751,885]};
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

/* Cleftline Logistics world-group sibling 03: inland escarpment grade exchange.
  Three offset, founded, nested terraces with switchback logistics, not the
  linear mooring-quay or V-basin sibling topology. Original independent cells. */
const V=(x,y,w,h)=>R(x,y,w,h,0),B=(x,y,w,h)=>R(x,y,w,h,100);
function strut(x,y,X,Y,t=8,m=62){L(x,y,X,Y,t,m);}
function flywheel(x,y,r=29){ring(x,y,r,r,7,62);ring(x,y,r-10,r-10,4,58);strut(x-r+6,y,x+r-6,y,5);strut(x,y-r+6,x,y+r-6,5);}
function shed(x,y,w,h){R(x,y,w,h,58);V(x+10,y+12,w-20,h-24);R(x+12,y+h-18,w-24,12,62);R(x+25,y+28,17,25,62);R(x+w-42,y+28,15,28,62);}
function track2(x,y,w){R(x,y,w,16,62);for(let i=16;i<w-16;i+=42){R(x+i,y+16,8,11,62);R(x+i-5,y+4,20,6,58);}}
function rack(x,y,n){for(let i=0;i<n;i++){R(x+i*59,y,48,55,58);V(x+i*59+9,y+10,30,30);R(x+i*59+10,y+43,29,11,62);}}
function cargo(x,y,w=63){R(x,y,w,35,62);V(x+9,y+8,w-18,15);R(x+10,y+25,w-20,8,58);}
function switchWedge(x,y,w,h){P([[x,y+h],[x+46,y+13],[x+Math.round(w*.42),y],[x+w-36,y+18],[x+w,y+h]],62);V(x+47,y+h-28,w-94,16);}
function signal(x,y){R(x,y,17,70,62);R(x-18,y+10,50,23,58);V(x-12,y+15,38,12);R(x+6,y+28,7,11,62);}
for(let x=0;x<W;x++){
let z=x<300?578:x<730?465:x<1160?628:x<1620?489:614;
z+=Math.round(16*Math.sin(x/85)+5*Math.sin(x/23));
B(x,z,1,H-z);
}
B(0,994,W,30);
P([[0,576],[100,535],[210,540],[332,468],[390,416],[621,422],[706,480],[701,596],[0,660]],100);
P([[720,652],[818,560],[925,538],[1188,552],[1304,619],[1316,767],[710,804]],100);
P([[1331,564],[1430,403],[1542,354],[1794,364],[1933,429],[2048,585],[2048,724],[1363,702]],100);
/* Three cutaway worksite bowls, at distinct elevations and silhouette. */
P([[189,413],[276,346],[566,344],[641,387],[639,462],[194,483]],58);
P([[211,412],[290,368],[547,365],[605,404],[604,445],[221,452]],0);
P([[786,607],[865,531],[1225,522],[1301,572],[1289,654],[780,685]],58);
P([[809,613],[889,556],[1202,542],[1273,587],[1258,633],[810,650]],0);
P([[1402,418],[1484,314],[1840,321],[1916,390],[1924,482],[1412,491]],58);
P([[1430,422],[1502,343],[1819,343],[1892,405],[1897,460],[1441,462]],0);
/* Traversal atria: wide horizontal and vertical modes, all true 2D volumes. */
V(83,218,1870,86);V(98,437,1848,88);V(105,643,1842,83);V(107,850,1840,81);
for(const x of [166,405,650,954,1355,1717,1894])V(x-32,278,64,657);
for(const x of [322,804,1153,1524,1811])V(x-34,501,68,435);
/* Connected cross-stage supports: intentionally traversable around each mast. */
for(const x of [328,609,844,1230,1513,1858]){
R(x,361,22,635,62);R(x+5,364,12,628,58);
strut(x+11,370,x+76,453,9);strut(x+10,579,x+76,653,8);
}
/* Upper western switchback freight terrace. */
track2(215,400,434);switchWedge(228,352,380,50);
shed(273,309,142,93);shed(453,322,149,87);rack(431,399,3);signal(616,337);
for(let i=0;i<5;i++)cargo(242+i*77,397,65);
strut(627,421,875,612,15);strut(620,423,864,601,7,58);
/* Centre lower terrace with down-graded material sorter. */
track2(787,612,507);switchWedge(830,567,370,43);
shed(870,535,136,79);shed(1075,539,141,81);rack(922,590,5);
signal(1202,549);
for(let i=0;i<5;i++){strut(836+i*68,575,871+i*67,621,5);cargo(851+i*80,627,63);}
/* Eastern highland discharge shelf and switching convergence. */
track2(1410,400,519);switchWedge(1457,350,430,52);
shed(1538,301,163,105);shed(1721,309,140,97);rack(1602,399,4);
for(let i=0;i<6;i++)cargo(1433+i*79,398,63);
signal(1869,332);strut(1274,621,1453,408,18);strut(1195,584,1475,403,9);
/* Characteristic physically distinct reversing drums. */
flywheel(607,406,34);flywheel(1219,594,29);flywheel(1451,406,31);
/* Entered rock-cut utility rooms, open service-return and slotted supports. */
for(const [x,y,w,h] of [[177,554,157,76],[354,568,164,75],[621,576,165,71],
[833,744,177,82],[1041,740,166,85],[1342,555,161,77],
[1584,553,143,80],[1763,559,151,75]]){
R(x,y,w,h,58);V(x+14,y+12,w-28,h-24);R(x+16,y+h-19,w-32,12,62);
R(x+25,y+21,22,29,62);R(x+w-46,y+24,17,27,62);
}
for(let i=0;i<10;i++){let x=166+i*174;R(x,745,16,116,62);strut(x,782,x+58,854,8);}
track2(160,807,1681);
for(let i=0;i<8;i++){let x=203+i*219;R(x,928,147,16,62);flywheel(x+57,903,18);R(x+112,895,10,43,58);}
shed(223,931,171,57);shed(608,931,182,57);shed(1068,931,190,56);shed(1673,931,194,56);
rack(463,947,3);rack(1322,948,4);
for(let x=146;x<1940;x+=119)R(x,960,72,12,62);
/* Authoring affordances include unoccupied bays; keep route-safe voids. */
for(const [x,y] of Object.values(sites))V(x-27,y-25,55,51);
/* Route-safe bounded access galleries, tailored to the three staggered
 freight terraces. This retains founded roofs and most structural steel,
 unlike fully clearing all horizontal/vertical rows. */
V(141,280,60,467);V(378,284,63,465);V(921,282,68,469);
V(1321,282,68,468);V(1680,278,66,475);V(1887,286,64,455);
V(243,641,61,304);V(688,640,65,300);V(1124,642,64,305);V(1604,641,63,304);
/* Portal at the reversing wheel and the deep tender: preserves a literal
  31x27, exact-centre detour rather than granting a nearest-point exemption. */
V(755,656,151,59);V(755,855,151,61);V(685,700,70,173);
for(const [x,y] of Object.values(sites))V(x-26,y-23,53,47);
/* Rooted central transfer mast; other terraces are joined through existing
 rock buttresses and elevated steel transfer beams. */
R(1094,521,21,482,62);
R(411,331,95,11,62);
B(0,1001,W,23);
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
function BFS(w,h,ob){let pass=new Uint8Array(N),seen=new Uint8Array(N),queue=new Int32Array(N),first=0,last=0;let ox=ob?.[0]||-1,oy=ob?.[1]||-1,ow=ob?.[2]||0,oh=ob?.[3]||0;for(let y=h>>1;y<H-(h>>1);y++)for(let x=w>>1;x<W-(w>>1);x++){if(!clear(x,y,w,h))continue;let left=x-(w>>1),top=y-(h>>1);if(ob&&left<ox+ow&&left+w>ox&&top<oy+oh&&top+h>oy)continue;pass[y*W+x]=1;}let spawn=sites["Westland inbound gate"],n=spawn[1]*W+spawn[0];if(!pass[n])return {size:[w,h],error:"spawn blocked",pos:spawn};seen[n]=1;queue[last++]=n;while(first<last){let a=queue[first++],x=a%W,y=(a/W)|0;for(let b of [a-W,a+W,a-1,a+1])if(b>=0&&b<N&&!(Math.abs(a-b)===1&&((b/W)|0)!==y)&&pass[b]&&!seen[b]){seen[b]=1;queue[last++]=b;}}let bad=Object.entries(sites).filter(([n,p])=>!seen[p[1]*W+p[0]]).map(([n,p])=>({name:n,xy:p,clear:clear(p[0],p[1],w,h)}));return {size:[w,h],reached:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,component:last,bad,pass,seen};}
let routes=[[19,15],[23,19],[31,27]].map(([w,h])=>BFS(w,h,null)),barrier=[236,433,86,94],detour=BFS(31,27,barrier);
function dist(pass,start,end){let a=start[1]*W+start[0],b=end[1]*W+end[0],seen=new Int32Array(N),Q=new Int32Array(N),first=0,last=0;if(!pass[a]||!pass[b])return -1;Q[last++]=a;seen[a]=1;while(first<last){let n=Q[first++];if(n===b)return (seen[n]-1);let x=n%W,y=(n/W)|0;for(let v of [n-W,n+W,n-1,n+1])if(v>=0&&v<N&&!(Math.abs(n-v)===1&&((v/W)|0)!==y)&&pass[v]&&!seen[v]){seen[v]=seen[n]+1;Q[last++]=v;}}return -1;}
let start=sites["Westland inbound gate"],finish=sites["Switchback inspection"];
let routeDistance=[dist(routes[2].pass,start,finish),dist(detour.pass,start,finish)];
let status=routes.map(r=>({size:r.size,reached:r.reached,total:r.total,free_centres:r.component,bad:r.bad,error:r.error||null}));
if(status.some(x=>x.reached!==x.total)||detour.reached!==Object.keys(sites).length||routeDistance[0]<0||routeDistance[1]<=routeDistance[0])throw Error('Exact Midge clearance, route or obstruction qualification failure '+JSON.stringify({status,detour:detour.bad,routeDistance}));
if(rect.length>32768||area>32000000)throw Error("budget "+rect.length+"/"+area);
const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:start,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false},json=JSON.stringify(setup),jbytes=utf8(json);
if(jbytes.length>1048576)throw Error("JSON over budget");
let crops=[["01-west-switchback-terrace",145,287,534,300],["02-central-reversal-sorter",730,491,649,303],["03-east-highland-export",1379,277,586,316],["04-embedded-service-caverns",120,539,1820,268],["05-deep-reversing-utility",148,800,1768,194]];
let images=[["overview",[0,0,W,H]],...crops.map(c=>[c[0],c.slice(1)])].map(([name,rect])=>{let data=png(g,rect),pixels=verifyPng(g,rect,data);return{name,rect,bytes:data,sha256:sha256(data),pixels};});
let receipt={concept:"Cleftline Logistics — Inland Escarpment Classification / Switchback Exchange",original:true,seed:SEED,engine_sha:"7b03aa437561ec63e31fd09531171360ab60eeb4",source_reference_head:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",material_catalogue_blob:"dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3",setup_loader_blob:"70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9",extent:[W,H],route_graph:{"main":["Westland inbound gate","Ledger exchange","Switchback inspection","Grade shuttle west","Central transfer rail","Central sorter","Highland export bridge","Dispatch hoist"],"upper":["West upland ridge","West switchback controller","Western signal gallery","Upper signal throat","Escarpment command","East ridge beacon"],"low":["Low intake cavern","Rock-cut weigh room","Reverse grade tender","Gravity classification","East cutaway bins","Carrier consignment","East grade exit"],"deep":["Western pressure works","Lower reversing drum","Deep belt tender","Eastern water table"]},material_ids:{"0":"Empty","100":"BasaltColumns Solid immovable None","58":"ReinforcedConcrete Solid immovable None","62":"SteelPlate Solid immovable None"},midge_authored_hull:[4,3],hull_envelopes:[[19,15],[23,19],[31,27]],exact_sites:sites,material_histogram:hist,stable_occupied_cells:area,grounded:area,detached_cells:0,pruned_disconnected_decor_cells:pruned,rectangles:rect.length,rectangle_work:area,setup_bytes:jbytes.length,material_plane_sha256:sha256(g),setup_sha256:sha256(jbytes),clearance:status,obstruction:{material:58,rect:barrier,from:"Westland inbound gate",to:"Switchback inspection",size:[31,27],sites_reached:detour.reached,unreachable:detour.bad,distance_before_after:routeDistance},images:images.map(z=>({name:z.name,rect:z.rect,bytes:z.bytes.length,sha256:z.sha256,pixel_parity:z.pixels})),native_status:"NATIVE-UNTESTED",bridge_source_max_rectangles:32768,legacy_installed_fallback_not_applicable:true,proof:"Exhaustive material-ID grid, disjoint ordered rectangle replay, full in-bounds three-envelope 4-BFS, obstacle return, verified indexed PNG CRC/zlib/Adler/pixel parity"};
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
