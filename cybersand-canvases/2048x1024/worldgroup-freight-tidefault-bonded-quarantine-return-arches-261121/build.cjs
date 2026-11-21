"use strict";
const lib=(function factory(){
"use strict";
const W=2048,H=1024,N=W*H,SEED=0x72A11BF,IDS=[0,100,58,62], M={AIR:0,ROCK:100,WALL:58,STEEL:62};
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
"West return intake":[130,644],"Returned cargo assay":[330,644],
"Gate ledger station":[530,644],"West clearing arch":[735,644],
"Sealed exchange vestibule":[930,644],"Freight reel house":[1130,644],
"Quarantine classifier":[1330,644],"Sanitation slip":[1530,644],
"Collapsed evacuation throat":[1745,644],"East bonded return":[1905,644],
"West dike watch":[170,485],"Assay signal":[545,480],
"Central vent head":[1030,480],"East cantilever watch":[1510,485],
"Departure marker":[1880,480],
"Lower ledger cabinet":[275,741],"Hanging cargo weigh cell":[600,739],
"Fault sorting bridge":[830,742],"Sealed quarantine exchange":[1070,743],
"Inner assay":[1240,742],"Worker recovery nook":[1470,742],
"Rubble survey station":[1810,741],
"West sump bypass":[270,819],"Mid freight underpass":[1050,819],
"East emergency gallery":[1750,819]
};
function R(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);const a=Math.max(0,x),b=Math.min(W,x+w),c=Math.max(0,y),d=Math.min(H,y+h);if(a>=b||c>=d)return;for(let yy=c;yy<d;yy++)g.fill(m,yy*W+a,yy*W+b);}
function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,dist=dx*dx+dy*dy,rr=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-rr));yy<Math.min(H,Math.ceil(Math.max(y,Y)+rr));yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-rr));xx<Math.min(W,Math.ceil(Math.max(x,X)+rr));xx++){let s=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(dist||1)));if((xx-x-s*dx)**2+(yy-y-s*dy)**2<=rr*rr)g[yy*W+xx]=m;}}
const B=(...a)=>R(...a,M.ROCK),C=(...a)=>R(...a,M.WALL),St=(...a)=>R(...a,M.STEEL),V=(...a)=>R(...a,M.AIR);
const line=(x,y,X,Y,t=8,m=M.STEEL)=>L(x,y,X,Y,t,m);
function gate(cx,top,span){let l=cx-span,r=cx+span;C(l,top,17,500);C(r-17,top,17,500);C(l,top,r-l,23);St(l+12,top+23,9,50);St(r-22,top+23,9,50);St(l+24,top+50,27,9);St(r-51,top+50,27,9);St(l+16,top+84,13,25);St(r-29,top+84,13,25);}
function crate(x,y,scale=1){let w=Math.round(61*scale),h=Math.round(37*scale);C(x,y,w,h);St(x+6,y+5,5,h-10);St(x+w-11,y+5,5,h-10);St(x+6,y+h-11,w-12,6);}
function desk(x,y){St(x,y,89,11);St(x+8,y+11,9,23);St(x+72,y+11,9,23);C(x+20,y-34,47,28);V(x+28,y-28,31,14);}
function rib(x,y){St(x,y,12,106);St(x+43,y,12,106);St(x-3,y,62,10);St(x+15,y+52,25,12);}
function arch(x,y,w,h){C(x,y,w,16);C(x,y,16,h);C(x+w-16,y,16,h);St(x+18,y+15,16,20);St(x+w-34,y+15,16,20);St(x+38,y+28,w-76,8);}
/* Tidefault sibling 02: horizontal grounded archival-return and quarantine
   underworks. All spatial geometry original, not replicated from sibling 01. */
B(0,887,W,113);
B(0,535,395,35);B(475,526,385,42);B(1015,532,275,36);B(1515,548,355,22);
/* Parallel horizontal freight conduits with unequal shaft connectors. */
V(62,601,1920,102);
V(90,776,1854,111);
for(const [x,y,w,h] of [[99,695,296,91],[474,693,318,91],[887,686,349,93],[1313,697,343,94],[1690,700,297,89]])V(x,y,w,h);
for(const x of [195,565,960,1370,1835])V(x-51,606,102,281);
/* Asymmetric vents and overflight affordances. */
for(const [x,y,w,h] of [[143,452,76,171],[505,449,81,181],[996,443,85,186],[1471,451,79,174],[1846,447,79,177]])V(x,y,w,h);
/* Unequal structural arcade crowns and lower-floor-founded piers. */
for(const [x,y,w,lh,rh] of [[273,557,224,155,137],[780,558,211,149,139],[1224,560,228,155,143],[1664,567,190,145,132]]){
 C(x,y,w,17); C(x,y+17,17,lh); C(x+w-17,y+17,17,rh);
 St(x+28,y+24,53,12); St(x+w-79,y+24,49,12);
}
/* West inward-return inspection ledges, physical two-sided entry. */
C(155,718,125,14);C(155,732,13,55);C(267,732,13,55);
V(153,744,19,40);St(182,774,68,12);
for(let k=0;k<3;k++)St(183+23*k,740,10,30);
line(307,716,380,757,9,M.STEEL);St(302,707,94,12);
/* Rail classifier: handoff chute and unequal lower receiver cells. */
St(584,708,171,13);St(605,721,14,70);St(729,721,13,70);
line(641,729,697,772,12,M.STEEL);St(650,752,51,10);
C(515,731,70,42);V(526,740,48,24);
C(732,741,50,31);St(744,743,22,24);
/* Offset side-entered quarantine crossing and repair receptors. */
C(914,714,281,13); C(914,727,16,62); C(1179,727,16,62);
V(912,738,23,39);V(1177,736,22,43);
St(941,768,100,15);St(1067,771,99,13);
C(984,734,24,34);St(1016,744,40,12);St(1114,740,44,10);
/* Refitting/inhabited crew ward with open seam for procedural extensions. */
C(1340,715,238,15);C(1340,731,15,52); C(1563,731,15,52);
V(1337,742,22,36);V(1560,742,22,36);
St(1372,763,76,11);St(1497,759,56,12);
C(1412,730,65,26);V(1421,735,45,16);
for(const x of [1387,1463,1529])St(x,731,8,21);
/* Earthquake-damaged emergency spur, still recoverable from lower conduit. */
line(1711,717,1764,755,13,M.WALL);
line(1796,704,1841,767,16,M.WALL);
C(1866,727,79,17);line(1895,743,1933,771,13,M.WALL);
C(1780,857,45,18);C(1906,847,36,25);
St(1746,728,50,12);St(1802,756,58,12);
/* Ground-connected squat watch-and-vent silhouettes. */
for(const [x,y,w] of [[160,453,27],[540,448,25],[1019,447,24],[1493,451,24],[1864,450,24]]){
 C(x,y,w,145);St(x-12,y,48,13);
}
/* Ground founded squat transverse receiving hall structures: no floating
   slabs. Unlike Sibling 01, the low-level arches form clustered return
   workfaces and two broad flyable lanes with human-editable gaps. */
for(const [x,y,w] of [[106,663,251],[486,669,313],[907,674,317],[1335,658,288],[1706,678,273]]){
 C(x,y,w,18); C(x,y+18,19,889-y-18); C(x+w-19,y+18,19,889-y-18);
 St(x+32,y+35,w-64,12);
 C(x+42,y+54,48,25);St(x+w-96,y+54,54,14);
 V(x-2,785,24,76); /* Right abutment remains physically grounded. */
}
/* Unequal steel workfaces make the transfer and quarantine roles
   distinguishable even without dynamic mechanisms. */
for(const [x,y,w] of [[214,811,68],[558,805,114],[1010,809,103],[1438,815,91],[1801,819,77]])St(x,y,w,13);
St(607,726,17,64);line(620,730,690,807,10,M.STEEL);
C(1080,756,83,12);St(1095,768,13,47);
line(1761,751,1838,817,13,M.WALL);
/* Additional grounded low industrial transactions and diverse load paths.
   Modules are intentionally sparse editing scaffolds, not decorative fill. */
/* West return stamping arch and transverse low overhead proof rail. */
C(71,748,15,141); C(229,748,15,141); C(71,748,173,17);
St(87,794,80,13); St(112,812,12,71); St(177,810,16,74);
St(188,772,27,9);
/* Classifier suspension/receiving hook, floor rooted on the eastern pier. */
C(846,726,15,163); C(992,724,16,165); C(846,724,162,15);
St(869,744,70,11); line(925,759,946,811,8,M.STEEL);
St(936,808,53,13); C(969,820,21,67);
/* Recessed asymmetrical bonded exchange arch, independent of old gate grids. */
C(1219,744,18,145); C(1365,724,21,165); C(1219,724,167,20);
St(1264,764,71,13);St(1283,777,11,62);
St(1318,819,43,11);
/* Fallen emergency-transfer nose: arrested diagonal shear supported below. */
C(1623,784,19,105);line(1632,788,1704,845,12,M.WALL);
C(1695,845,25,44);St(1645,825,54,10);
/* Preserve exact Midge site clearances, source cell geometry remains full. */
for(const [x,y] of Object.values(sites)){V(x-26,426,53,y-426+25);V(x-25,y-22,51,45);}
B(0,1000,W,24);
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
function BFS(w,h,ob){let pass=new Uint8Array(N),seen=new Uint8Array(N),queue=new Int32Array(N),first=0,last=0;let ox=ob?.[0]||-1,oy=ob?.[1]||-1,ow=ob?.[2]||0,oh=ob?.[3]||0;for(let y=h>>1;y<H-(h>>1);y++)for(let x=w>>1;x<W-(w>>1);x++){if(!clear(x,y,w,h))continue;let left=x-(w>>1),top=y-(h>>1);if(ob&&left<ox+ow&&left+w>ox&&top<oy+oh&&top+h>oy)continue;pass[y*W+x]=1;}let spawn=sites["West return intake"],n=spawn[1]*W+spawn[0];if(!pass[n])return {size:[w,h],error:"spawn blocked",pos:spawn};seen[n]=1;queue[last++]=n;while(first<last){let a=queue[first++],x=a%W,y=(a/W)|0;for(let b of [a-W,a+W,a-1,a+1])if(b>=0&&b<N&&!(Math.abs(a-b)===1&&((b/W)|0)!==y)&&pass[b]&&!seen[b]){seen[b]=1;queue[last++]=b;}}let bad=Object.entries(sites).filter(([n,p])=>!seen[p[1]*W+p[0]]).map(([n,p])=>({name:n,xy:p,clear:clear(p[0],p[1],w,h)}));return {size:[w,h],reached:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,component:last,bad,pass,seen};}
let routes=[[19,15],[23,19],[31,27]].map(([w,h])=>BFS(w,h,null)),barrier=[680,439,100,92],detour=BFS(31,27,barrier);
function dist(pass,start,end){let a=start[1]*W+start[0],b=end[1]*W+end[0],seen=new Int32Array(N),Q=new Int32Array(N),first=0,last=0;if(!pass[a]||!pass[b])return -1;Q[last++]=a;seen[a]=1;while(first<last){let n=Q[first++];if(n===b)return (seen[n]-1);let x=n%W,y=(n/W)|0;for(let v of [n-W,n+W,n-1,n+1])if(v>=0&&v<N&&!(Math.abs(n-v)===1&&((v/W)|0)!==y)&&pass[v]&&!seen[v]){seen[v]=seen[n]+1;Q[last++]=v;}}return -1;}
let start=sites["West dike watch"],finish=sites["Central vent head"];
let routeDistance=[dist(routes[2].pass,start,finish),dist(detour.pass,start,finish)];
let status=routes.map(r=>({size:r.size,reached:r.reached,total:r.total,free_centres:r.component,bad:r.bad,error:r.error||null}));
if(status.some(x=>x.reached!==x.total)||detour.reached!==Object.keys(sites).length||routeDistance[0]<0||routeDistance[1]<=routeDistance[0])throw Error('Exact Midge clearance, route or obstruction qualification failure '+JSON.stringify({status,detour:detour.bad,routeDistance}));
if(rect.length>32768||area>32000000)throw Error("budget "+rect.length+"/"+area);
const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:sites["West return intake"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false},json=JSON.stringify(setup),jbytes=utf8(json);
if(jbytes.length>1048576)throw Error("JSON over budget");
let crops=[["01-west-return-arch",90,523,430,330],["02-classifier-underworks",460,523,455,345],["03-quarantine-exchange",888,535,442,342],["04-damaged-evacuation",1553,555,475,350],["05-two-level-return",80,690,1870,235]];
let images=[["overview",[0,0,W,H]],...crops.map(c=>[c[0],c.slice(1)])].map(([name,rect])=>{let data=png(g,rect),pixels=verifyPng(g,rect,data);return{name,rect,bytes:data,sha256:sha256(data),pixels};});
let receipt={concept:"Tidefault Bonded Freight — Quarantine Return Arches / Fallen Evacuation Spur",original:true,seed:SEED,engine_sha:"8d07e04459a2705a6f96c908c0b565a483cc5beb",source_reference_head:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",extent:[W,H],route_graph:{main:["West return intake","Returned cargo assay","Gate ledger station","West clearing arch","Sealed exchange vestibule","Freight reel house","Quarantine classifier","Sanitation slip","Collapsed evacuation throat","East bonded return"],upper:["West dike watch","Assay signal","Central vent head","East cantilever watch","Departure marker"],interior:["Lower ledger cabinet","Hanging cargo weigh cell","Fault sorting bridge","Sealed quarantine exchange","Inner assay","Worker recovery nook","Rubble survey station"],lower:["West sump bypass","Mid freight underpass","East emergency gallery"]},material_ids:{"0":"Empty","100":"BasaltColumns Solid immovable None","58":"ReinforcedConcrete Solid immovable None","62":"SteelPlate Solid immovable None"},midge_authored_hull:[4,3],hull_envelopes:[[19,15],[23,19],[31,27]],exact_sites:sites,material_histogram:hist,stable_occupied_cells:area,grounded:area,detached_cells:0,pruned_disconnected_decor_cells:pruned,invalid_writes:0,rectangles:rect.length,rectangle_work:area,setup_bytes:jbytes.length,material_plane_sha256:sha256(g),setup_sha256:sha256(jbytes),clearance:status,obstruction:{material:58,rect:barrier,from:"West dike watch",to:"Central vent head",size:[31,27],sites_reached:detour.reached,unreachable:detour.bad,distance_before_after:routeDistance},images:images.map(z=>({name:z.name,rect:z.rect,bytes:z.bytes.length,sha256:z.sha256,pixel_parity:z.pixels})),native_status:"NATIVE-UNTESTED",bridge_source_max_rectangles:32768,proof:"Complete material plane, lossless disjoint Setup-v2 replay, exact conservative 19x15/23x19/31x27 routes, physical obstruction detour and indexed PNG integrity/parity"};
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
