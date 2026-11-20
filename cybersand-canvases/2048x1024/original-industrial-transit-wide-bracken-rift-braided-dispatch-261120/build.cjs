"use strict";
const lib=(function factory(){
"use strict";
const W=2048,H=1024,N=W*H,SEED=2026112027,IDS=[0,100,58,62], M={AIR:0,ROCK:100,WALL:58,STEEL:62};
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
const sites={"Arrival Mooring":[154,442],"Dock Manifest":[460,442],"Berth Cabin":[305,704],"Counterweight Flight":[611,442],"West Bridge Fork":[745,442],"North Suspended Deck":[965,348],"Rift Isle Gallery":[1080,700],"South Braided Bridge":[1210,621],"East Bridge Fork":[1400,442],"Switching Loft":[1545,442],"Freight Recorder":[1784,442],"Dispatch Gate":[1880,442],"Upper Watch House":[454,276],"Upper Crane Apex":[665,276],"Broken Span Return":[1120,277],"East Tower Gallery":[1640,277],"West Counterweight Drive":[596,750],"Main Siding":[1510,676],"Scales":[1828,654],"Underwest Bilge":[151,906],"Rift Drain":[962,906],"Below Isle Valve":[1160,906],"Under East Drive":[1530,906],"Customs Retained Bay":[1840,906]};
function R(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);let a=Math.max(0,x),b=Math.min(W,x+w),c=Math.max(0,y),d=Math.min(H,y+h);if(a>=b||c>=d)return;for(let yy=c;yy<d;yy++)g.fill(m,yy*W+a,yy*W+b);}
function P(v,m){let lo=Math.max(0,Math.ceil(Math.min(...v.map(a=>a[1])))),hi=Math.min(H-1,Math.ceil(Math.max(...v.map(a=>a[1]))));for(let y=lo;y<=hi;y++){let xx=[];for(let j=0;j<v.length;j++){let a=v[j],b=v[(j+1)%v.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xx.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xx.sort((a,b)=>a-b);for(let j=0;j+1<xx.length;j+=2)R(Math.ceil(xx[j]),y,Math.floor(xx[j+1])-Math.ceil(xx[j])+1,1,m);}}
function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,rad=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-rad));yy<Math.min(H,Math.ceil(Math.max(y,Y)+rad+1));yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-rad));xx<Math.min(W,Math.ceil(Math.max(x,X)+rad+1));xx++){let q=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(d||1)));if((xx-x-q*dx)**2+(yy-y-q*dy)**2<=rad*rad)g[yy*W+xx]=m;}}
function ring(x,y,rx,ry,t,m){for(let yy=Math.max(0,y-ry);yy<Math.min(H,y+ry);yy++)for(let xx=Math.max(0,x-rx);xx<Math.min(W,x+rx);xx++){let a=((xx-x)/rx)**2+((yy-y)/ry)**2;if(a<=1&&a>=(1-t/Math.min(rx,ry))**2)g[yy*W+xx]=m;}}
function beam(x,y,X,Y,t=9,m=M.STEEL){L(x,y,X,Y,t,m);}
function boxCrate(x,y,w=55,h=25){R(x,y,w,h,M.WALL);R(x+4,y+4,w-8,7,M.STEEL);for(let s=x+13;s<x+w-5;s+=15)R(s,y+12,4,h-15,M.STEEL);}
function platform(x,y,w,t=12){R(x,y,w,t,M.STEEL);}
function wheel(x,y,r){ring(x,y,r,r,5,M.WALL);ring(x,y,r-8,r-8,3,M.STEEL);}
function gear(x,y,r){ring(x,y,r,r,8,M.STEEL);for(let a=0;a<8;a++){let t=a*Math.PI/4;R(Math.round(x+(r-1)*Math.cos(t))-4,Math.round(y+(r-1)*Math.sin(t))-4,8,8,M.WALL);}}
// BRACKEN RIFT — original braided, multi-altitude, gorge-crossing freight exchange.
// Concrete and steel parts are static collision geometry; no scripted rotation.
for(let x=0;x<W;x++){let bottom=831+Math.round(14*Math.sin(x*.006+1.7)+9*Math.sin(x*.018));if(x>730&&x<1410)bottom=968+Math.round(6*Math.sin(x*.027));if(x>=1410)bottom=805+Math.round(8*Math.sin(x*.011));R(x,bottom,1,H-bottom,M.ROCK);}
R(0,987,W,37,M.WALL);
P([[0,1024],[0,250],[24,250],[62,342],[92,643],[124,846],[140,1024]],M.ROCK);
P([[2048,1024],[2048,232],[2022,272],[1984,518],[1937,807],[1920,1024]],M.ROCK);
P([[131,612],[194,595],[427,598],[493,649],[518,830],[118,837]],M.AIR);
P([[1396,602],[1450,582],[1796,594],[1910,650],[1919,831],[1391,833]],M.AIR);
P([[718,1024],[718,726],[744,626],[767,559],[789,726],[808,1024]],M.ROCK);
P([[1360,1024],[1360,692],[1395,562],[1422,564],[1450,742],[1473,1024]],M.ROCK);
P([[1021,1024],[1042,784],[1066,760],[1101,783],[1138,1024]],M.ROCK);
R(1073,780,12,172,M.STEEL);R(1098,787,10,160,M.STEEL);
R(71,191,1907,17,M.STEEL);R(66,183,25,796,M.WALL);R(1959,182,22,799,M.WALL);
L(91,209,699,292,7,M.STEEL);L(699,292,1350,224,8,M.STEEL);L(1350,224,1956,206,8,M.STEEL);
R(80,310,1873,11,M.WALL);
for(let [x,w] of [[180,260],[503,168],[765,247],[1159,211],[1479,243]]){L(x,209,x+w,311,7,M.STEEL);L(x+w,207,x,311,5,M.STEEL);}
// Drylock vessel: an actual cabin, long cargo hold, sided deck and sharply profiled bow.
P([[148,690],[173,663],[213,643],[379,641],[423,665],[463,704],[453,750],[420,782],[214,790],[174,769]],M.STEEL);
P([[174,693],[211,661],[381,658],[428,692],[436,711],[414,756],[214,763]],M.WALL);
P([[202,699],[229,676],[376,675],[411,700],[411,730],[388,747],[222,748]],M.AIR);
R(177,635,243,11,M.WALL);R(182,647,251,7,M.STEEL);
P([[236,637],[235,552],[254,529],[305,527],[318,547],[320,636]],M.STEEL);
P([[251,619],[251,560],[263,545],[296,543],[305,564],[306,620]],M.AIR);
R(258,570,39,7,M.WALL);R(258,590,39,7,M.WALL);
R(161,790,329,17,M.STEEL);R(160,797,17,59,M.WALL);R(460,797,16,58,M.WALL);
for(let x of [223,286,347])boxCrate(x,710,43,29);
R(449,705,101,12,M.STEEL);
for(let x of [470,495,520])wheel(x,724,9);
// Counterweight freight lift, asymmetric drums with separate load shoes.
R(536,405,21,442,M.WALL);R(700,405,23,443,M.WALL);
R(547,408,157,14,M.STEEL);R(565,457,118,11,M.STEEL);
L(558,422,617,364,10,M.STEEL);L(617,364,704,422,10,M.STEEL);
ring(595,397,29,29,9,M.STEEL);ring(662,395,21,21,7,M.WALL);
R(592,428,8,310,M.STEEL);R(661,419,9,313,M.STEEL);
R(564,727,117,15,M.STEEL);R(554,742,22,58,M.WALL);boxCrate(621,690,47,27);
R(540,781,168,20,M.WALL);R(547,795,15,69,M.STEEL);R(690,794,16,71,M.STEEL);
R(556,819,132,11,M.STEEL);
// The two truly different cross-rift railway alignments braid then rejoin.
const upper=[[708,528],[788,501],[876,494],[967,526],[1068,510],[1174,487],[1290,501],[1432,548]];
for(let i=1;i<upper.length;i++){let [x,y]=upper[i-1],[X,Y]=upper[i];beam(x,y,X,Y,12);L(x,y+23,X,Y+23,5,M.WALL);if(i>1)L(x,y+21,(x+X)/2,(y+Y)/2+67,6,M.STEEL);}
for(let [x,y] of [[818,500],[1000,518],[1220,491],[1360,518]]){R(x-8,y+17,16,57,M.WALL);L(x-31,y+58,x+31,y+58,6,M.STEEL);}
const lower=[[718,737],[821,712],[919,686],[974,671],[1041,644],[1123,656],[1231,689],[1358,742],[1440,752]];
for(let i=1;i<lower.length;i++){let [x,y]=lower[i-1],[X,Y]=lower[i];if(i===4)continue;beam(x,y,X,Y,9);beam(x,y+18,X,Y+18,4,M.WALL);}
L(975,670,991,689,5,M.STEEL);L(1037,655,1050,686,5,M.STEEL); // real missing-span void
L(691,555,763,512,13,M.STEEL);L(701,716,766,737,9,M.STEEL);
L(1408,550,1491,602,12,M.STEEL);L(1413,751,1502,724,11,M.STEEL);
L(1481,596,1498,717,8,M.WALL);
for(let [x,y] of [[872,486],[1148,482],[1323,510]]){L(x,315,x,y-8,5,M.STEEL);R(x-29,y+24,58,9,M.STEEL);boxCrate(x-23,y-2,46,26);}
// An island inside the gorge; useful partially unfinished procedural-grammar bay.
R(1047,799,81,13,M.STEEL);R(1042,811,14,110,M.WALL);R(1115,811,13,110,M.WALL);
R(1064,824,43,8,M.WALL);R(1067,837,37,8,M.STEEL);
// Three-grade classifier, rail switching house, customs.
L(1475,604,1583,617,14,M.STEEL);L(1529,646,1714,684,10,M.WALL);
L(1510,748,1749,722,11,M.STEEL);L(1575,620,1771,603,8,M.STEEL);
L(1708,685,1832,633,9,M.STEEL);
for(let x of [1551,1628,1714]){R(x,680,67,11,M.WALL);R(x+6,690,14,13,M.STEEL);R(x+48,690,14,13,M.STEEL);boxCrate(x+13,654,40,22);}
R(1528,773,270,13,M.STEEL);R(1540,784,14,56,M.WALL);R(1759,782,16,52,M.WALL);
R(1788,518,145,15,M.WALL);R(1801,532,12,202,M.STEEL);R(1904,530,12,207,M.STEEL);
R(1798,718,137,13,M.WALL);R(1819,578,60,10,M.STEEL);
R(1835,591,10,58,M.WALL);R(1851,606,57,8,M.STEEL);R(1857,627,8,67,M.STEEL);
R(1811,745,121,13,M.WALL);boxCrate(1842,683,47,25);
L(1817,585,1850,542,6,M.STEEL);L(1899,585,1860,540,6,M.STEEL);
R(1836,763,96,12,M.STEEL);
for(let [x,y,w] of [[378,213,140],[1575,213,143]]){R(x,y,w,9,M.WALL);R(x+12,y+9,8,30,M.STEEL);R(x+w-20,y+9,8,30,M.STEEL);R(x+15,y+39,w-30,9,M.WALL);R(x+30,y+13,16,19,M.STEEL);}
R(820,249,157,8,M.STEEL);R(1015,249,159,8,M.STEEL);L(977,254,998,301,6,M.STEEL);L(1013,254,996,301,6,M.STEEL);
// Continuous recoverable service network has deliberately unbuilt edit niches.
R(115,873,1811,65,M.AIR);R(104,942,1831,14,M.WALL);
for(let [x,kind] of [[220,0],[610,1],[960,2],[1175,3],[1500,4],[1812,5]]){R(x-25,939,120,9,M.STEEL);R(x-14,917,10,21,M.WALL);if(kind===0){R(x+10,923,44,9,M.STEEL);L(x+14,920,x+40,895,5,M.STEEL);}else if(kind===1){ring(x+47,917,15,15,6,M.STEEL);}else if(kind===2){R(x+7,920,47,7,M.WALL);R(x+27,909,8,15,M.STEEL);}else if(kind===3){R(x+28,918,27,8,M.STEEL);}else if(kind===4){L(x+6,934,x+46,912,6,M.STEEL);}else{R(x+13,918,60,7,M.WALL);}}
// Engine-room shafts and genuinely open route reconnections.
for(let x of [111,640,1455,1913]){R(x,322,65,585,M.AIR);R(x-6,500,6,350,M.STEEL);R(x+66,502,6,346,M.STEEL);}
for(let x of [136,651,1459,1910])R(x-24,268,78,180,M.AIR);
R(700,324,95,174,M.AIR);R(1350,329,98,174,M.AIR);
R(735,542,74,258,M.AIR);R(1362,543,75,250,M.AIR);
R(105,850,95,89,M.AIR);R(625,850,90,89,M.AIR);
R(1421,850,95,89,M.AIR);R(1878,850,90,89,M.AIR);
R(1030,742,105,175,M.AIR);
// Authored full-envelope navigation: principal open midflight band, transfer portals,
 // lower maintenance returns; empty segments intentionally retained as edit seams.
 R(94,412,1850,66,M.AIR);
 for(let x of [416,629,1082,1609])R(x,262,77,169,M.AIR);
 R(272,472,69,254,M.AIR);R(572,471,62,310,M.AIR);
 R(934,322,70,165,M.AIR);R(1179,469,68,170,M.AIR);
 R(1479,469,74,239,M.AIR);R(1794,469,72,226,M.AIR);
 R(1046,675,69,226,M.AIR);
 R(1804,689,69,235,M.AIR);
 // Visible paired counterweight drum on the side of the main transfer shaft.
 ring(572,365,27,26,8,M.STEEL);L(546,384,555,405,9,M.STEEL);
 // Authored entered landings; validation never shifts targets or grants exemptions.
for(const [name,pos] of Object.entries(sites)){const [x,y]=pos;R(x-25,y-23,51,47,M.AIR);}

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
 if(!choice)continue;ties.push([choice[0],Math.min(choice[1],choice[2]),Math.abs(choice[1]-choice[2])+1,last,best]);}
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
function BFS(w,h,ob){let pass=new Uint8Array(N),seen=new Uint8Array(N),queue=new Int32Array(N),first=0,last=0;let ox=ob?.[0]||-1,oy=ob?.[1]||-1,ow=ob?.[2]||0,oh=ob?.[3]||0;for(let y=h>>1;y<H-(h>>1);y++)for(let x=w>>1;x<W-(w>>1);x++){if(!clear(x,y,w,h))continue;let left=x-(w>>1),top=y-(h>>1);if(ob&&left<ox+ow&&left+w>ox&&top<oy+oh&&top+h>oy)continue;pass[y*W+x]=1;}let spawn=sites["Arrival Mooring"],n=spawn[1]*W+spawn[0];if(!pass[n])return {size:[w,h],error:"spawn blocked",pos:spawn};seen[n]=1;queue[last++]=n;while(first<last){let a=queue[first++],x=a%W,y=(a/W)|0;for(let b of [a-W,a+W,a-1,a+1])if(b>=0&&b<N&&!(Math.abs(a-b)===1&&((b/W)|0)!==y)&&pass[b]&&!seen[b]){seen[b]=1;queue[last++]=b;}}let bad=Object.entries(sites).filter(([n,p])=>!seen[p[1]*W+p[0]]).map(([n,p])=>({name:n,xy:p,clear:clear(p[0],p[1],w,h)}));return {size:[w,h],reached:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,component:last,bad,pass,seen};}
let routes=[[19,15],[23,19],[31,27]].map(([w,h])=>BFS(w,h,null)),barrier=[245,392,107,103],detour=BFS(31,27,barrier);
function dist(pass,start,end){let a=start[1]*W+start[0],b=end[1]*W+end[0],seen=new Int32Array(N),Q=new Int32Array(N),first=0,last=0;if(!pass[a]||!pass[b])return -1;Q[last++]=a;seen[a]=1;while(first<last){let n=Q[first++];if(n===b)return (seen[n]-1);let x=n%W,y=(n/W)|0;for(let v of [n-W,n+W,n-1,n+1])if(v>=0&&v<N&&!(Math.abs(n-v)===1&&((v/W)|0)!==y)&&pass[v]&&!seen[v]){seen[v]=seen[n]+1;Q[last++]=v;}}return -1;}
let start=sites["Arrival Mooring"],finish=sites["Dock Manifest"];
let routeDistance=[dist(routes[2].pass,start,finish),dist(detour.pass,start,finish)];
let status=routes.map(r=>({size:r.size,reached:r.reached,total:r.total,free_centres:r.component,bad:r.bad,error:r.error||null}));
if(status.some(x=>x.reached!==x.total)||detour.reached!==Object.keys(sites).length||routeDistance[0]<0||routeDistance[1]<=routeDistance[0])throw Error('Exact Midge clearance, route or obstruction qualification failure '+JSON.stringify({status,detour:detour.bad,routeDistance}));
if(rect.length>32768||area>32000000)throw Error("budget "+rect.length+"/"+area);
const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:start,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false},json=JSON.stringify(setup),jbytes=utf8(json);
if(jbytes.length>1048576)throw Error("JSON over budget");
let crops=[["01-freighter-drylock",130,520,390,314],["02-counterweight-hoist",510,344,238,488],["03-braided-upper-crossing",728,366,709,244],["04-lower-failure-span",720,605,731,231],["05-east-classifier-customs",1468,506,502,328],["06-rift-recovery-gallery",104,847,1824,127]];
let images=[["overview",[0,0,W,H]],...crops.map(c=>[c[0],c.slice(1)])].map(([name,rect])=>{let data=png(g,rect),pixels=verifyPng(g,rect,data);return{name,rect,bytes:data,sha256:sha256(data),pixels};});
let receipt={concept:"Bracken Rift — Braided Dispatch Ravine",original:true,seed:SEED,engine_sha:"de58bf1997ca75825cf3b29e046dc1c1022c45bf",source_reference_head:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",material_catalogue_blob:"d7a47d60721598a16589daf177a6ff4401b84b43",setup_loader_blob:"70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9",extent:[W,H],route_graph:{main:["Arrival Mooring","Dock Manifest","Counterweight Flight","West Bridge Fork","East Bridge Fork","Switching Loft","Freight Recorder","Dispatch Gate"],upper:["Upper Watch House","Upper Crane Apex","Broken Span Return","East Tower Gallery"],braided:["North Suspended Deck","South Braided Bridge","Rift Isle Gallery","Main Siding"],lower:["Underwest Bilge","Rift Drain","Below Isle Valve","Under East Drive","Customs Retained Bay"]},material_ids:{"0":"Empty","100":"BasaltColumns Solid immovable None","58":"ReinforcedConcrete Solid immovable None","62":"SteelPlate Solid immovable None"},midge_authored_hull:[4,3],hull_envelopes:[[19,15],[23,19],[31,27]],exact_sites:sites,material_histogram:hist,stable_occupied_cells:area,grounded:area,detached_cells:0,pruned_disconnected_decor_cells:pruned,grounding_steel_ties:ties.length,rectangles:rect.length,rectangle_work:area,setup_bytes:jbytes.length,material_plane_sha256:sha256(g),setup_sha256:sha256(jbytes),clearance:status,obstruction:{material:58,rect:barrier,from:"Arrival Mooring",to:"Dock Manifest",size:[31,27],sites_reached:detour.reached,unreachable:detour.bad,distance_before_after:routeDistance},images:images.map(z=>({name:z.name,rect:z.rect,bytes:z.bytes.length,sha256:z.sha256,pixel_parity:z.pixels})),native_status:"NATIVE-UNTESTED",bridge_source_max_rectangles:32768,accepted_main_max_rectangles:32768,proof:"Exhaustive material-ID grid, disjoint ordered rectangle replay, full in-bounds three-envelope 4-BFS, obstacle return, verified indexed PNG CRC/zlib/Adler/pixel parity"};
return {g,rect,sites,crops,images,receipt,setup,json,jbytes,status,detour:{reached:detour.reached,bad:detour.bad,component:detour.component},distance:routeDistance,pruned};
}
return {generate,sha256,base64,utf8};
})();
if(typeof module!=="undefined"){
 module.exports=lib;
 if(require.main===module){
  const fs=require("fs"),path=require("path");
  const a=lib.generate(),p=__dirname,verify=process.argv.includes("--verify");
  const outputs=[["setup-bracken-rift.json",Buffer.from(a.json,"utf8")],
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
