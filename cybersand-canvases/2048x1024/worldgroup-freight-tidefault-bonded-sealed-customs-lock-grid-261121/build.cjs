"use strict";
const lib=(function factory(){
"use strict";
const W=2048,H=1024,N=W*H,SEED=0x71DEF17,IDS=[0,100,58,62], M={AIR:0,ROCK:100,WALL:58,STEEL:62};
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
"West bonded intake":[125,463],"Arrival weigh registry":[340,462],
"First inspection lock":[555,463],"Seal witness office":[744,462],
"Bond vault threshold":[1012,460],"Custody sorter":[1245,460],
"Pressure gate crossing":[1440,459],"Isolation checkpoint":[1646,460],
"Abandoned annex entry":[1786,459],"East bonded exit":[1921,462],
"West signal parapet":[215,262],"Ledger watch":[489,282],
"Overhead bond signal":[885,254],"High ward monitor":[1450,255],
"Ruined annex lookout":[1830,278],
"West tally room":[192,694],"Sample seal laboratory":[402,690],
"Bonded rack chamber":[778,709],"Custody inspection vault":[1010,707],
"Dry lock equipment":[1325,692],"Quarantine custody":[1536,703],
"Damaged archive":[1844,712],"West underpass":[280,826],
"Central maintenance return":[875,827],"East evacuation culvert":[1709,828]
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
/* Entirely new Tidefault bonded freight districts: compact sealed warehouse
   and customs cell grids; distributed thresholds rather than a central machine. */
B(0,951,W,73);B(0,924,94,100);B(1954,924,94,100);
B(74,592,479,359);B(571,554,487,397);B(1082,562,474,389);B(1573,604,414,347);
/* Four unlike grounded warehouse masses with inner working rooms. */
V(96,621,170,126);V(290,618,221,118);V(97,769,440,107);
V(597,586,143,151);V(770,577,264,143);V(595,766,442,101);
V(1105,594,151,140);V(1285,604,230,122);V(1104,778,432,92);
V(1594,625,183,116);V(1808,660,149,102);V(1589,784,376,87);
/* Main high air road; deep cut-through loops and entry shafts. */
V(50,421,1958,121);
for(const [x,y,w,h] of [[157,538,84,269],[418,532,91,261],[645,535,94,264],[954,539,94,251],[1204,539,96,274],[1499,534,99,284],[1800,532,94,281]])V(x,y,w,h);
/* Portal ribs, transverse room separation and low occupied workfaces. */
C(270,625,15,117);V(269,676,21,49);C(756,585,16,155);V(753,650,27,55);
C(1270,590,17,147);V(1269,657,28,51);C(1785,635,16,126);V(1781,697,27,51);
desk(132,716);crate(344,693);crate(421,690,.72);
desk(622,713);crate(818,688,1.25);crate(906,698,.8);
rib(1109,603);desk(1324,696);crate(1401,685,1.08);
desk(1627,708);crate(1825,729,.82);
for(let k=0;k<4;k++)St(815+k*39,649,12,18);
for(let k=0;k<3;k++)C(1394+k*30,634,17,22);
St(306,734,189,14);St(783,738,222,14);St(1125,736,312,14);St(1607,756,320,14);
/* Interlocking transverse pressure-lock thresholds: static architecture. */
gate(542,356,76);gate(1120,341,84);gate(1665,382,74);
arch(866,370,125,168);arch(1460,362,125,166);
St(460,397,25,41);St(655,392,29,46);St(1037,389,19,45);
St(1230,380,23,46);St(1589,401,16,45);St(1740,411,16,35);
/* Independent headed offices and local customs lookouts. */
C(138,329,183,27);C(150,356,16,235);C(302,356,17,232);
St(174,344,77,18);C(170,365,58,30);V(178,369,41,20);
C(779,300,176,22);C(798,322,16,233);C(928,322,16,230);
St(829,329,95,16);C(841,341,67,30);V(850,344,47,19);
C(1360,304,204,24);C(1385,328,17,229);C(1534,328,17,222);
St(1423,342,94,16);C(1432,361,71,25);V(1442,364,49,17);
/* Low signal/stamp equipment and inspected rail levels. */
for(let x of [505,522,540,1077,1096,1115,1635,1656,1677])St(x,356,8,22);
for(let x of [260,301,600,650,745,980,1250,1520,1708])St(x,556,28,11);
for(let x of [225,432,850,1290,1471,1856]){St(x,754,75,10);C(x+12,738,44,17);}
/* Drained lower return and damaged, vacant pressure-ward annex. */
V(90,798,1855,60);
for(let x of [241,666,1055,1429,1850])V(x-30,726,61,130);
for(let x of [378,882,1332,1709]){St(x,886,109,13);St(x+16,901,13,48);St(x+80,901,11,48);}
C(1597,741,121,15);C(1766,735,168,15);
St(1610,749,12,33);St(1857,752,12,33);
C(1925,562,14,92);line(1931,570,2005,606,13,M.WALL);
line(1945,592,2010,631,11,M.WALL);C(1940,631,45,11);
V(1887,625,58,31);C(1920,580,19,38);
C(1860,719,31,15);St(1902,705,16,31);
/* Vacant underfloor expansion seams, unscripted future setpieces. */
for(let [x,w] of [[151,133],[815,145],[1192,122],[1799,104]])V(x,852,w,68);
/* Relief vents/loops; thick founded banks retained for static solidity. */
for(let x of [204,698,1180,1725])V(x-42,518,85,340);
V(79,426,1939,101);
for(const [x,y] of Object.values(sites))V(x-23,y-21,47,43);
/* Engineered rooted load paths: reclaim the formerly disconnected heavy
   vaulted districts as fully founded structures, not floating decorations.
   Distinctly spaced piers preserve open over-roof Midge alternatives. */
for(const [x,y,w] of [[74,592,20],[533,592,20],[571,554,20],[1038,554,20],[1082,562,20],[1536,562,20],[1573,604,20],[1967,604,20]])B(x,y,w,1000-y);
for(const [x,y,w] of [[150,329,16],[302,329,17],[466,356,17],[601,356,17],[798,300,16],[928,300,16],[866,370,16],[975,370,16],[1036,341,17],[1187,341,17],[1385,304,17],[1534,304,17],[1460,362,16],[1569,362,16],[1591,382,17],[1722,382,17]])C(x,y,w,1000-y);
/* Lock thresholds have physically open side reveals, not sealed traps. */
V(590,431,56,104);
V(1355,418,100,122);
V(1699,427,75,109);
/* Side-enterable upper-to-lower maintenance ducts and editing receptors. */
for(const [name,p] of Object.entries(sites)){if(p[1]>=600)V(p[0]-25,515,51,367);}
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
function BFS(w,h,ob){let pass=new Uint8Array(N),seen=new Uint8Array(N),queue=new Int32Array(N),first=0,last=0;let ox=ob?.[0]||-1,oy=ob?.[1]||-1,ow=ob?.[2]||0,oh=ob?.[3]||0;for(let y=h>>1;y<H-(h>>1);y++)for(let x=w>>1;x<W-(w>>1);x++){if(!clear(x,y,w,h))continue;let left=x-(w>>1),top=y-(h>>1);if(ob&&left<ox+ow&&left+w>ox&&top<oy+oh&&top+h>oy)continue;pass[y*W+x]=1;}let spawn=sites["West bonded intake"],n=spawn[1]*W+spawn[0];if(!pass[n])return {size:[w,h],error:"spawn blocked",pos:spawn};seen[n]=1;queue[last++]=n;while(first<last){let a=queue[first++],x=a%W,y=(a/W)|0;for(let b of [a-W,a+W,a-1,a+1])if(b>=0&&b<N&&!(Math.abs(a-b)===1&&((b/W)|0)!==y)&&pass[b]&&!seen[b]){seen[b]=1;queue[last++]=b;}}let bad=Object.entries(sites).filter(([n,p])=>!seen[p[1]*W+p[0]]).map(([n,p])=>({name:n,xy:p,clear:clear(p[0],p[1],w,h)}));return {size:[w,h],reached:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,component:last,bad,pass,seen};}
let routes=[[19,15],[23,19],[31,27]].map(([w,h])=>BFS(w,h,null)),barrier=[414,423,93,104],detour=BFS(31,27,barrier);
function dist(pass,start,end){let a=start[1]*W+start[0],b=end[1]*W+end[0],seen=new Int32Array(N),Q=new Int32Array(N),first=0,last=0;if(!pass[a]||!pass[b])return -1;Q[last++]=a;seen[a]=1;while(first<last){let n=Q[first++];if(n===b)return (seen[n]-1);let x=n%W,y=(n/W)|0;for(let v of [n-W,n+W,n-1,n+1])if(v>=0&&v<N&&!(Math.abs(n-v)===1&&((v/W)|0)!==y)&&pass[v]&&!seen[v]){seen[v]=seen[n]+1;Q[last++]=v;}}return -1;}
let start=sites["Arrival weigh registry"],finish=sites["Bond vault threshold"];
let routeDistance=[dist(routes[2].pass,start,finish),dist(detour.pass,start,finish)];
let status=routes.map(r=>({size:r.size,reached:r.reached,total:r.total,free_centres:r.component,bad:r.bad,error:r.error||null}));
if(status.some(x=>x.reached!==x.total)||detour.reached!==Object.keys(sites).length||routeDistance[0]<0||routeDistance[1]<=routeDistance[0])throw Error('Exact Midge clearance, route or obstruction qualification failure '+JSON.stringify({status,detour:detour.bad,routeDistance}));
if(rect.length>32768||area>32000000)throw Error("budget "+rect.length+"/"+area);
const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:start,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false},json=JSON.stringify(setup),jbytes=utf8(json);
if(jbytes.length>1048576)throw Error("JSON over budget");
let crops=[["01-west-bond-ledgers",78,304,498,490],["02-vault-cell-grid",576,293,493,506],["03-pressure-locks",1080,309,508,495],["04-abandoned-ward",1570,376,470,490],["05-lower-relief-ways",86,739,1850,205]];
let images=[["overview",[0,0,W,H]],...crops.map(c=>[c[0],c.slice(1)])].map(([name,rect])=>{let data=png(g,rect),pixels=verifyPng(g,rect,data);return{name,rect,bytes:data,sha256:sha256(data),pixels};});
let receipt={concept:"Tidefault Bonded Freight — Sealed Customs-Lock Grid / Abandoned Pressure Ward",original:true,seed:SEED,engine_sha:"de58bf1997ca75825cf3b29e046dc1c1022c45bf",source_reference_head:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",extent:[W,H],route_graph:{"main":["West bonded intake","Arrival weigh registry","First inspection lock","Seal witness office","Bond vault threshold","Custody sorter","Pressure gate crossing","Isolation checkpoint","Abandoned annex entry","East bonded exit"],"upper":["West signal parapet","Ledger watch","Overhead bond signal","High ward monitor","Ruined annex lookout"],"interior":["West tally room","Sample seal laboratory","Bonded rack chamber","Custody inspection vault","Dry lock equipment","Quarantine custody","Damaged archive"],"lower":["West underpass","Central maintenance return","East evacuation culvert"]},material_ids:{"0":"Empty","100":"BasaltColumns Solid immovable None","58":"ReinforcedConcrete Solid immovable None","62":"SteelPlate Solid immovable None"},midge_authored_hull:[4,3],hull_envelopes:[[19,15],[23,19],[31,27]],exact_sites:sites,material_histogram:hist,stable_occupied_cells:area,grounded:area,detached_cells:0,pruned_disconnected_decor_cells:pruned,invalid_writes:0,rectangles:rect.length,rectangle_work:area,setup_bytes:jbytes.length,material_plane_sha256:sha256(g),setup_sha256:sha256(jbytes),clearance:status,obstruction:{material:58,rect:barrier,from:"Arrival weigh registry",to:"Bond vault threshold",size:[31,27],sites_reached:detour.reached,unreachable:detour.bad,distance_before_after:routeDistance},images:images.map(z=>({name:z.name,rect:z.rect,bytes:z.bytes.length,sha256:z.sha256,pixel_parity:z.pixels})),native_status:"NATIVE-UNTESTED",bridge_source_max_rectangles:32768,proof:"Complete material plane, lossless disjoint Setup-v2 replay, exact conservative 19x15/23x19/31x27 routes, physical obstruction detour and indexed PNG integrity/parity"};
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
