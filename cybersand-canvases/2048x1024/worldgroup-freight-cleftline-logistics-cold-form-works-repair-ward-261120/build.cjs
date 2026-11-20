"use strict";
const lib=(function factory(){
"use strict";
const W=2048,H=1024,N=W*H,SEED=0xC1EFA04,IDS=[0,100,58,62], M={AIR:0,ROCK:100,WALL:58,STEEL:62};
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


const g=new Uint8Array(N),sites={"West receiving portal":[136,502],"Intake ledger bay":[288,505],"Unload cradle":[451,503],"Mid transfer throat":[614,505],"Cold-rib forming gate":[744,508],"Press core approach":[865,508],"Inspection die":[1032,506],"Crown observation gallery":[879,291],"North rib service":[1047,320],"Repair infirmary":[1205,501],"Ward common spine":[1378,501],"Recommission dispatch":[1528,505],"Ward upper commons":[1320,346],"Ward outer lodge":[1492,347],"Ward low archive":[1320,658],"Relief shaft head":[1724,227],"Emergency lip":[1820,279],"Export lift transfer":[1720,508],"Relief shaft foot":[1725,737],"West salvage return":[273,793],"Press coolant return":[936,787],"Repair salvage lock":[1465,793],"Deep salvage ledger":[231,902],"Deep return switch":[964,904],"Deep discharge fan":[1750,901]};
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


/* Sibling 04: a nested factory-city and inhabited repair ward.
   The geometry is original: no donor silhouettes, room coordinates, or graphs. */
const V=(x,y,w,h)=>R(x,y,w,h,0),B=(x,y,w,h)=>R(x,y,w,h,100);
function arch(cx,cy,rx,ry,t,m=62){ring(cx,cy,rx,ry,t,m);}
function wardRoom(x,y,w,h){
  wall(x,y,w,h);V(x+12,y+12,w-24,h-25);
  steel(x+14,y+h-18,w-28,10);steel(x+17,y+26,17,24);
  steel(x+w-41,y+30,21,15);wall(x+20,y+12,31,7);
  V(x+w/2-29,y+h-18,58,31);
}
function cargoStack(x,y){steel(x,y,94,13);wall(x+8,y-37,79,33);V(x+16,y-32,61,21);steel(x+21,y-17,7,9);steel(x+61,y-17,7,9);}
function reliefGage(x,y){wall(x,y,120,69);V(x+13,y+13,94,43);steel(x+19,y+23,14,24);steel(x+74,y+23,21,9);steel(x+71,y+43,30,7);}
/* Entire long section is geological interior, with a deliberately different
   asymmetrical vertical sky vent at the eastern dispatch relief cut. */
B(0,177,W,847);B(0,991,W,33);
V(92,250,428,74);V(155,320,340,88);
P([[92,428],[160,335],[353,309],[513,365],[562,475],[543,617],[442,691],[204,668],[92,582]],0);
P([[501,429],[602,301],[731,257],[996,238],[1129,288],[1179,412],[1176,638],[1060,727],[649,752],[537,657]],0);
P([[1110,356],[1171,288],[1435,271],[1586,348],[1582,694],[1490,765],[1169,727],[1107,643]],0);
V(1160,304,410,102);V(1141,452,460,112);V(1176,585,415,136);
P([[1561,312],[1650,170],[1835,165],[1939,275],[1932,775],[1858,865],[1680,870],[1562,735]],0);
V(1676,0,146,266);V(1855,280,111,485);V(1566,447,321,123);
/* Irregular upper gallery; the lower bypass and underworks are independently
   traversable, and not forced into one copy-pasted grid of workfaces. */
V(274,320,340,75);V(540,312,570,73);V(1068,317,535,72);
V(377,351,82,240);V(657,315,80,276);V(1090,341,85,276);
V(1310,302,79,341);V(1565,306,80,306);
V(200,467,347,92);V(518,473,665,94);V(1120,465,476,98);
V(1500,470,410,94);
V(233,711,455,109);V(604,722,535,114);V(1090,740,586,94);
V(133,870,1771,90);
V(242,577,85,375);V(510,548,90,243);V(762,563,78,249);
V(934,598,88,340);V(1427,561,80,373);V(1720,562,75,387);
V(330,590,80,180);V(1091,558,72,257);
/* Receiving classification: readable held cargo and material roller handoff. */
wall(176,600,322,19);steel(185,620,18,55);steel(458,617,19,62);
for(let z=0;z<3;z++)cargoStack(202+z*100,596);
steel(354,424,128,18);beam(375,427,475,476,12);reliefGage(177,367);
/* One enormous COLD rib press, with three nested arched load paths; its central
   horizontal aperture is intentionally wide enough for actual conservative Midge. */
arch(873,515,165,189,21,62);arch(873,515,128,160,13,58);
arch(873,515,88,128,8,62);
beam(706,664,660,744,19);beam(1037,659,1070,741,20);
steel(784,645,177,21);steel(784,658,15,87);steel(957,658,18,85);
for(let z=0;z<5;z++)steel(797+z*37,641,17,15);
V(702,474,350,96);V(690,285,375,66);
steel(620,641,99,14);steel(1030,638,115,16);
beam(639,653,648,729,15);beam(1129,650,1139,736,14);
wall(765,359,210,62);V(781,373,179,34);steel(796,387,28,15);
steel(920,387,27,15);V(849,359,55,69);
/* Unequal inhabited rooms, with connected commons and repair service. */
wardRoom(1179,318,134,102);wardRoom(1401,321,143,100);
wardRoom(1162,577,138,115);wardRoom(1408,585,145,119);
wall(1332,385,19,290);V(1320,433,52,115);V(1320,614,55,90);
steel(1199,549,144,15);steel(1391,547,170,16);
wall(1252,603,80,16);steel(1257,616,61,7);
wall(1446,625,52,27);V(1458,630,28,14);
reliefGage(1188,409);steel(1474,409,63,17);
for(let z=0;z<3;z++){wall(1220+z*95,684,76,27);V(1230+z*95,690,50,14);}
/* Single-sided massive hydraulic relief column, export handoff and spare bays. */
steel(1601,618,98,20);steel(1803,613,120,22);
beam(1612,629,1646,845,18);beam(1884,616,1905,854,17);
steel(1850,312,26,491);wall(1849,342,31,57);
for(let y=391;y<688;y+=72)steel(1830,y,45,14);
steel(1654,798,240,17);reliefGage(1856,704);
/* Deep return: reusable modular bays, with intentional unfilled seams. */
for(let x of [185,533,819,1115,1487,1780]){wall(x,946,139,39);V(x+11,952,111,24);steel(x+15,971,112,9);}
for(let x of [400,710,1198,1550]){beam(x,842,x+40,875,11);steel(x,842,13,35);}
wall(547,788,96,31);V(560,795,70,20);
wall(1206,780,108,37);V(1219,788,82,23);
/* Exact sites must be in air, and actual named site connection checked after
   all carving; these pockets alone do not establish reachable passages. */
for(const [x,y] of Object.values(sites))V(x-28,y-26,57,53);
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
function BFS(w,h,ob){let pass=new Uint8Array(N),seen=new Uint8Array(N),queue=new Int32Array(N),first=0,last=0;let ox=ob?.[0]||-1,oy=ob?.[1]||-1,ow=ob?.[2]||0,oh=ob?.[3]||0;for(let y=h>>1;y<H-(h>>1);y++)for(let x=w>>1;x<W-(w>>1);x++){if(!clear(x,y,w,h))continue;let left=x-(w>>1),top=y-(h>>1);if(ob&&left<ox+ow&&left+w>ox&&top<oy+oh&&top+h>oy)continue;pass[y*W+x]=1;}let spawn=sites["West receiving portal"],n=spawn[1]*W+spawn[0];if(!pass[n])return {size:[w,h],error:"spawn blocked",pos:spawn};seen[n]=1;queue[last++]=n;while(first<last){let a=queue[first++],x=a%W,y=(a/W)|0;for(let b of [a-W,a+W,a-1,a+1])if(b>=0&&b<N&&!(Math.abs(a-b)===1&&((b/W)|0)!==y)&&pass[b]&&!seen[b]){seen[b]=1;queue[last++]=b;}}let bad=Object.entries(sites).filter(([n,p])=>!seen[p[1]*W+p[0]]).map(([n,p])=>({name:n,xy:p,clear:clear(p[0],p[1],w,h)}));return {size:[w,h],reached:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,component:last,bad,pass,seen};}
let routes=[[19,15],[23,19],[31,27]].map(([w,h])=>BFS(w,h,null)),barrier=[512,467,76,113],detour=BFS(31,27,barrier);
function dist(pass,start,end){let a=start[1]*W+start[0],b=end[1]*W+end[0],seen=new Int32Array(N),Q=new Int32Array(N),first=0,last=0;if(!pass[a]||!pass[b])return -1;Q[last++]=a;seen[a]=1;while(first<last){let n=Q[first++];if(n===b)return (seen[n]-1);let x=n%W,y=(n/W)|0;for(let v of [n-W,n+W,n-1,n+1])if(v>=0&&v<N&&!(Math.abs(n-v)===1&&((v/W)|0)!==y)&&pass[v]&&!seen[v]){seen[v]=seen[n]+1;Q[last++]=v;}}return -1;}
let start=sites["Unload cradle"],finish=sites["Cold-rib forming gate"];
let routeDistance=[dist(routes[2].pass,start,finish),dist(detour.pass,start,finish)];
let status=routes.map(r=>({size:r.size,reached:r.reached,total:r.total,free_centres:r.component,bad:r.bad,error:r.error||null}));
if(status.some(x=>x.reached!==x.total)||detour.reached!==Object.keys(sites).length||routeDistance[0]<0||routeDistance[1]<=routeDistance[0])throw Error('Exact Midge clearance, route or obstruction qualification failure '+JSON.stringify({status,detour:detour.bad,routeDistance}));
if(rect.length>32768||area>32000000)throw Error("budget "+rect.length+"/"+area);
const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:start,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false},json=JSON.stringify(setup),jbytes=utf8(json);
if(jbytes.length>1048576)throw Error("JSON over budget");
let crops=[["01-west-receiving-cradle",90,301,520,413],["02-cold-rib-press-vault",562,247,630,507],["03-inhabited-repair-ward",1110,267,491,488],["04-vertical-relief-dispatch",1550,146,439,747],["05-salvage-return-and-ports",128,723,1790,274]];
let images=[["overview",[0,0,W,H]],...crops.map(c=>[c[0],c.slice(1)])].map(([name,rect])=>{let data=png(g,rect),pixels=verifyPng(g,rect,data);return{name,rect,bytes:data,sha256:sha256(data),pixels};});
let receipt={concept:"Cleftline Logistics — Reclaimed-Hull Cold-Form Works / Inhabited Repair Ward",original:true,seed:SEED,engine_sha:"de58bf1997ca75825cf3b29e046dc1c1022c45bf",source_reference_head:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",extent:[W,H],route_graph:{"main":["West receiving portal","Intake ledger bay","Unload cradle","Mid transfer throat","Cold-rib forming gate","Press core approach","Inspection die","Repair infirmary","Ward common spine","Recommission dispatch","Export lift transfer"],"upper":["Crown observation gallery","North rib service","Ward upper commons","Ward outer lodge","Relief shaft head","Emergency lip"],"lower":["Ward low archive","Relief shaft foot","West salvage return","Press coolant return","Repair salvage lock"],"deep":["Deep salvage ledger","Deep return switch","Deep discharge fan"]},material_ids:{"0":"Empty","100":"BasaltColumns Solid immovable None","58":"ReinforcedConcrete Solid immovable None","62":"SteelPlate Solid immovable None"},midge_authored_hull:[4,3],hull_envelopes:[[19,15],[23,19],[31,27]],exact_sites:sites,material_histogram:hist,stable_occupied_cells:area,grounded:area,detached_cells:0,pruned_disconnected_decor_cells:pruned,invalid_writes:0,rectangles:rect.length,rectangle_work:area,setup_bytes:jbytes.length,material_plane_sha256:sha256(g),setup_sha256:sha256(jbytes),clearance:status,obstruction:{material:58,rect:barrier,from:"Unload cradle",to:"Cold-rib forming gate",size:[31,27],sites_reached:detour.reached,unreachable:detour.bad,distance_before_after:routeDistance},images:images.map(z=>({name:z.name,rect:z.rect,bytes:z.bytes.length,sha256:z.sha256,pixel_parity:z.pixels})),native_status:"NATIVE-UNTESTED",bridge_source_max_rectangles:32768,proof:"Complete material plane, lossless disjoint Setup-v2 replay, exact conservative 19x15/23x19/31x27 routes, physical obstruction detour and indexed PNG integrity/parity"};
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
