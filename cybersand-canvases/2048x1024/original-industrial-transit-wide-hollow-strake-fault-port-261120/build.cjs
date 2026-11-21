"use strict";
const lib=(function factory(){
"use strict";
const W=2048,H=1024,N=W*H,SEED=2026112033,IDS=[0,100,58,62], M={AIR:0,ROCK:100,WALL:58,STEEL:62};
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
const sites={"Arrival Mooring":[154,438],"Dock Manifest":[1880,438],"Freighter Hold":[318,671],"Dock Transfer":[577,438],"Upper West Gantry":[712,264],"Overfault Ropeway":[1039,264],"Upper East Gantry":[1475,264],"West Vault Aperture":[907,471],"Central Vault":[1051,471],"East Vault Aperture":[1194,471],"West Return":[581,770],"Underfault Return":[1049,770],"East Return":[1520,770],"Rail Sorting":[1620,665],"Customs Inspection":[1840,665],"West Pump":[290,868],"Fault Brake":[971,868],"East Recovery":[1730,868],"West Shaft":[500,631],"East Shaft":[1450,438]};

function R(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);let a=Math.max(0,x),b=Math.min(W,x+w),c=Math.max(0,y),d=Math.min(H,y+h);if(a>=b||c>=d)return;for(let yy=c;yy<d;yy++)g.fill(m,yy*W+a,yy*W+b);}
function P(v,m){let lo=Math.max(0,Math.ceil(Math.min(...v.map(a=>a[1])))),hi=Math.min(H-1,Math.ceil(Math.max(...v.map(a=>a[1]))));for(let y=lo;y<=hi;y++){let xx=[];for(let j=0;j<v.length;j++){let a=v[j],b=v[(j+1)%v.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xx.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xx.sort((a,b)=>a-b);for(let j=0;j+1<xx.length;j+=2)R(Math.ceil(xx[j]),y,Math.floor(xx[j+1])-Math.ceil(xx[j])+1,1,m);}}
function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,rad=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-rad));yy<Math.min(H,Math.ceil(Math.max(y,Y)+rad+1));yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-rad));xx<Math.min(W,Math.ceil(Math.max(x,X)+rad+1));xx++){let q=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(d||1)));if((xx-x-q*dx)**2+(yy-y-q*dy)**2<=rad*rad)g[yy*W+xx]=m;}}
function ring(x,y,rx,ry,t,m){for(let yy=Math.max(0,y-ry);yy<Math.min(H,y+ry);yy++)for(let xx=Math.max(0,x-rx);xx<Math.min(W,x+rx);xx++){let a=((xx-x)/rx)**2+((yy-y)/ry)**2;if(a<=1&&a>=(1-t/Math.min(rx,ry))**2)g[yy*W+xx]=m;}}
function beam(x,y,X,Y,t=9,m=M.STEEL){L(x,y,X,Y,t,m);}
function boxCrate(x,y,w=55,h=25){R(x,y,w,h,M.WALL);R(x+4,y+4,w-8,7,M.STEEL);for(let s=x+13;s<x+w-5;s+=15)R(s,y+12,4,h-15,M.STEEL);}
function platform(x,y,w,t=12){R(x,y,w,t,M.STEEL);}
function wheel(x,y,r){ring(x,y,r,r,5,M.WALL);ring(x,y,r-8,r-8,3,M.STEEL);}
function gear(x,y,r){ring(x,y,r,r,8,M.STEEL);for(let a=0;a<8;a++){let t=a*Math.PI/4;R(Math.round(x+(r-1)*Math.cos(t))-4,Math.round(y+(r-1)*Math.sin(t))-4,8,8,M.WALL);}}

// HOLLOW STRAKE. Perpendicular side elevation: a working shipyard nested in a
// broad mineral fault. Alternative overhead freight gantry and underfault return
// both traverse the geological obstacle, not an open-ravine suspended crossing.
R(0,944,W,80,M.ROCK);
P([[0,1024],[0,171],[24,171],[69,335],[108,867],[135,1024]],M.ROCK);
P([[2048,1024],[2048,174],[2025,198],[1960,483],[1920,854],[1900,1024]],M.ROCK);
P([[775,950],[778,422],[839,348],[1270,347],[1323,433],[1346,950]],M.ROCK);
R(750,928,609,96,M.ROCK);
P([[92,943],[116,814],[171,798],[485,795],[533,932]],M.ROCK);
P([[1390,941],[1468,803],[1520,794],[1871,800],[1933,944]],M.ROCK);
R(100,220,1856,104,M.AIR);R(110,408,632,95,M.AIR);
R(1355,409,600,95,M.AIR);R(817,419,461,112,M.AIR);
R(107,735,1833,89,M.AIR);R(108,826,1812,91,M.AIR);
for(let x of [181,488,704,1020,1395,1837])R(x,300,78,592,M.AIR);
// Braced overhead gantry has explicit rooted edges, inert steel transfer chord.
R(66,164,1918,24,M.STEEL);
R(64,185,23,758,M.WALL);R(1959,184,24,759,M.WALL);
for(let [x,X] of [[88,569],[569,1025],[1025,1487],[1487,1963]]){
 L(x,188,X,227,8,M.STEEL);L(x,226,X,187,7,M.STEEL);
}
R(735,328,626,11,M.STEEL);
for(let x of [305,610,820,1018,1207,1481,1730]){
 L(x,186,x+65,327,6,M.STEEL);R(x-18,328,70,10,M.WALL);
}
// Entered drydock ship. Cabin and hull visually separate from stationary hoist.
R(120,783,348,17,M.STEEL);R(126,795,18,149,M.WALL);
R(451,796,20,149,M.WALL);
P([[151,690],[184,654],[232,632],[372,632],[424,665],[457,711],[437,752],[402,782],[211,782],[175,750]],M.STEEL);
P([[174,685],[212,650],[374,651],[428,705],[407,750],[210,757]],M.WALL);
P([[204,683],[237,667],[369,666],[407,701],[395,737],[225,740]],M.AIR);
P([[236,627],[238,546],[258,529],[301,528],[316,550],[316,626]],M.STEEL);
P([[250,610],[251,560],[267,545],[293,544],[305,566],[302,611]],M.AIR);
R(179,627,249,10,M.WALL);
for(let x of [241,292,350])boxCrate(x,711,37,25);
R(178,781,283,9,M.STEEL);R(179,787,13,159,M.STEEL);
R(428,788,13,160,M.STEEL);
// Freight flows into a rooted fixed hoist with unlike drums and a load shoe.
R(451,698,125,14,M.STEEL);
R(493,484,17,462,M.WALL);R(662,484,19,461,M.WALL);
R(495,481,185,16,M.STEEL);
L(503,496,566,451,9,M.STEEL);L(566,451,674,495,9,M.STEEL);
ring(555,465,26,25,7,M.STEEL);ring(622,466,33,32,9,M.WALL);
R(557,493,7,260,M.STEEL);R(625,497,8,250,M.STEEL);
R(520,733,136,16,M.STEEL);R(520,749,16,196,M.WALL);
R(646,749,16,195,M.STEEL);
// Embedded manufacturing rooms, three different shelving depths, real rock.
R(832,393,435,12,M.STEEL);R(837,406,15,160,M.STEEL);
R(1250,408,16,159,M.STEEL);R(837,538,429,14,M.STEEL);
for(let [x,y] of [[856,587],[956,620],[1081,594],[1180,639]]){
 R(x,y,75,12,M.WALL);R(x+15,y+12,12,106,M.STEEL);
}
R(881,694,300,12,M.STEEL);R(928,710,13,113,M.WALL);
R(1145,708,13,116,M.WALL);
// Eastern three-grade sorting station / customs inspection.
for(let [x,y] of [[1452,616],[1554,668],[1661,714]]){
 R(x,y,156,11,M.STEEL);L(x+10,y+10,x+20,y+91,7,M.WALL);
 R(x+43,y-32,62,23,M.WALL);
}
L(1455,627,1563,675,11,M.STEEL);
L(1557,679,1662,725,11,M.STEEL);L(1660,725,1781,669,12,M.STEEL);
for(let x of [1561,1667,1764]){
 R(x,748,66,10,M.WALL);R(x+7,759,13,16,M.STEEL);
 R(x+49,759,13,16,M.STEEL);
}
R(1780,523,150,14,M.WALL);R(1791,535,14,214,M.STEEL);
R(1917,535,14,214,M.STEEL);
R(1786,746,147,11,M.STEEL);R(1804,605,113,9,M.STEEL);
boxCrate(1847,697,45,27);
// Intentionally sparse underworks and alternative return train/flight track.
R(105,806,1825,12,M.STEEL);
for(let x of [322,675,814,1372,1500,1795])R(x,811,16,134,M.WALL);
R(227,908,124,9,M.STEEL);ring(278,874,24,24,6,M.STEEL);
R(919,908,117,10,M.WALL);ring(976,872,23,23,6,M.STEEL);
R(1661,908,119,10,M.STEEL);R(1709,853,12,56,M.WALL);
// Authored 60–90-cell clear flyable routes; actual excavations in final plane.
R(96,237,1858,68,M.AIR);
R(103,410,640,78,M.AIR);R(1357,410,594,78,M.AIR);
R(815,426,467,100,M.AIR);
R(102,752,1844,62,M.AIR);R(109,844,1809,64,M.AIR);
for(let x of [176,484,697,1018,1388,1831])R(x,300,84,593,M.AIR);
R(850,470,56,304,M.AIR);R(1210,469,57,307,M.AIR);
R(288,655,63,164,M.AIR);R(1598,485,70,299,M.AIR);
R(1808,641,75,166,M.AIR);
for(let x of [253,937,1688])R(x,791,93,110,M.AIR);
for(let [n,[x,y]] of Object.entries(sites))R(x-30,y-29,61,59,M.AIR);

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
function score(x,y,z){if(z<0)return Infinity;let lo=Math.min(y,z),hi=Math.max(y,z);if((lo<=488&&hi>=404)||(lo<=322&&hi>=220)||(lo<=817&&hi>=747)||(lo<=915&&hi>=841))return Infinity;let s=hi-lo;
 for(let p of Object.values(sites))if(Math.abs(x-p[0])<48&&lo<p[1]+43&&hi>p[1]-43)return Infinity;
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
let routes=[[19,15],[23,19],[31,27]].map(([w,h])=>BFS(w,h,null)),barrier=[1094,400,80,140],detour=BFS(31,27,barrier);
function dist(pass,start,end){let a=start[1]*W+start[0],b=end[1]*W+end[0],seen=new Int32Array(N),Q=new Int32Array(N),first=0,last=0;if(!pass[a]||!pass[b])return -1;Q[last++]=a;seen[a]=1;while(first<last){let n=Q[first++];if(n===b)return (seen[n]-1);let x=n%W,y=(n/W)|0;for(let v of [n-W,n+W,n-1,n+1])if(v>=0&&v<N&&!(Math.abs(n-v)===1&&((v/W)|0)!==y)&&pass[v]&&!seen[v]){seen[v]=seen[n]+1;Q[last++]=v;}}return -1;}
let start=sites["Arrival Mooring"],finish=sites["Dock Manifest"];

let routeDistance=[dist(routes[2].pass,start,finish),dist(detour.pass,start,finish)];
for(let cand of [[1094,400,80,140],[794,398,91,142],[1302,400,85,146],[522,395,93,155],[872,395,90,144]]){
let test=BFS(31,27,cand),d=dist(test.pass,start,finish);
if(test.reached===Object.keys(sites).length && d>routeDistance[0]){barrier=cand;detour=test;routeDistance[1]=d;break;}
}

let status=routes.map(r=>({size:r.size,reached:r.reached,total:r.total,free_centres:r.component,bad:r.bad,error:r.error||null}));
if(status.some(x=>x.reached!==x.total)||detour.reached!==Object.keys(sites).length||routeDistance[0]<0||routeDistance[1]<=routeDistance[0])throw Error('Exact Midge clearance, route or obstruction qualification failure '+JSON.stringify({status,detour:detour.bad,routeDistance}));
if(rect.length>32768||area>32000000)throw Error("budget "+rect.length+"/"+area);
const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:start,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false},json=JSON.stringify(setup),jbytes=utf8(json);
if(jbytes.length>1048576)throw Error("JSON over budget");
let crops=[["01-entered-freighter",113,508,369,319],["02-twin-hoist",469,411,248,410],["03-roof-freight-gantry",706,156,678,220],["04-fault-cargo-vaults",785,355,558,470],["05-east-rail-dispatch",1409,502,559,330],["06-low-return-works",108,817,1817,121]];
let images=[["overview",[0,0,W,H]],...crops.map(c=>[c[0],c.slice(1)])].map(([name,rect])=>{let data=png(g,rect),pixels=verifyPng(g,rect,data);return{name,rect,bytes:data,sha256:sha256(data),pixels};});
let receipt={concept:"Hollow Strake — Entered Fault Freight Port",original:true,seed:SEED,engine_sha:"de58bf1997ca75825cf3b29e046dc1c1022c45bf",source_reference_head:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",material_catalogue_blob:"d7a47d60721598a16589daf177a6ff4401b84b43",setup_loader_blob:"70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9",extent:[W,H],route_graph:{main:["Arrival Mooring","Upper West Gantry","Overfault Ropeway","Upper East Gantry","Dock Manifest"],entered_cavern:["West Vault Aperture","Central Vault","East Vault Aperture"],lower:["West Return","Underfault Return","East Return"],cargo:["Freighter Hold","Dock Transfer","Rail Sorting","Customs Inspection"]},material_ids:{"0":"Empty","100":"BasaltColumns Solid immovable None","58":"ReinforcedConcrete Solid immovable None","62":"SteelPlate Solid immovable None"},midge_authored_hull:[4,3],hull_envelopes:[[19,15],[23,19],[31,27]],exact_sites:sites,material_histogram:hist,stable_occupied_cells:area,grounded:area,detached_cells:0,pruned_disconnected_decor_cells:pruned,grounding_steel_ties:ties.length,rectangles:rect.length,rectangle_work:area,setup_bytes:jbytes.length,material_plane_sha256:sha256(g),setup_sha256:sha256(jbytes),clearance:status,obstruction:{material:58,rect:barrier,from:"Arrival Mooring",to:"Dock Manifest",size:[31,27],sites_reached:detour.reached,unreachable:detour.bad,distance_before_after:routeDistance},images:images.map(z=>({name:z.name,rect:z.rect,bytes:z.bytes.length,sha256:z.sha256,pixel_parity:z.pixels})),native_status:"NATIVE-UNTESTED",bridge_source_max_rectangles:32768,accepted_main_max_rectangles:32768,proof:"Exhaustive material-ID grid, disjoint ordered rectangle replay, full in-bounds three-envelope 4-BFS, obstacle return, verified indexed PNG CRC/zlib/Adler/pixel parity"};
return {g,rect,sites,crops,images,receipt,setup,json,jbytes,status,detour:{reached:detour.reached,bad:detour.bad,component:detour.component},distance:routeDistance,pruned};
}
return {generate,sha256,base64,utf8};
})();
if(typeof module!=="undefined"){
 module.exports=lib;
 if(require.main===module){
  const fs=require("fs"),path=require("path");
  const a=lib.generate(),p=__dirname,verify=process.argv.includes("--verify");
  const outputs=[["setup-hollow-strake.json",Buffer.from(a.json,"utf8")],
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
