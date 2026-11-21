"use strict";
const lib=(function factory(){
"use strict";
const W=2048,H=1024,N=W*H,SEED=0x26B0521,IDS=[0,100,58,62], M={AIR:0,ROCK:100,WALL:58,STEEL:62};
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
"Western parcel arrival":[134,475],"Manifest crane approach":[356,475],
"First bonded intake":[549,475],"Sorter service crossing":[780,475],
"Inner custody exchange":[1012,475],"Parcel despatch bridge":[1232,475],
"Workers ward frontage":[1436,475],"Outbound cargo tally":[1678,475],
"Damaged export nose":[1902,475],
"Roof arrival lookout":[205,280],"Western roof dispatcher":[620,280],
"Midroof bridge witness":[1018,280],"Eastern roof inspector":[1460,280],
"Outer roof semaphore":[1838,280],
"West harbour registry":[212,748],"Berth load enclosure":[367,748],
"First hand-sorting bay":[557,748],"Classification conveyor bay":[781,748],
"Bonded receipt cell":[966,748],"Secured examination chamber":[1170,748],
"Workers sleeping ward":[1405,748],"East bonded exit office":[1572,748],
"Damaged release dock":[1850,748],
"West floor return":[216,856],"Parcel maintenance reach":[629,856],
"Bonded utility crossing":[1048,856],"Inhabited ward rescue":[1475,856],
"East derelict escape":[1865,856]};
function R(x,y,w,h,m){x=Math.max(0,Math.floor(x));y=Math.max(0,Math.floor(y));w=Math.max(0,Math.ceil(w));h=Math.max(0,Math.ceil(h));if(x>=W||y>=H)return;for(let yy=y;yy<Math.min(H,y+h);yy++)g.fill(m,yy*W+x,yy*W+Math.min(W,x+w));}
function L(x,y,X,Y,t=8,m=M.STEEL){let dx=X-x,dy=Y-y,dist=Math.hypot(dx,dy),rr=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-rr));yy<Math.min(H,Math.ceil(Math.max(y,Y)+rr));yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-rr));xx<Math.min(W,Math.ceil(Math.max(x,X)+rr));xx++){let s=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(dist*dist||1)));if((xx-x-s*dx)**2+(yy-y-s*dy)**2<=rr*rr)g[yy*W+xx]=m;}}
const B=(...a)=>R(...a,M.ROCK),C=(...a)=>R(...a,M.WALL),St=(...a)=>R(...a,M.STEEL),V=(...a)=>R(...a,M.AIR);
const line=(x,y,X,Y,t=8,m=M.STEEL)=>L(x,y,X,Y,t,m);
/* Original Tidefault 05: an interconnected, low-roofed cargo borough.
Five unlike roofed halls and side-entered workfaces are physically grounded.
The west hook->roller->sorter->bonded receiver->export chain is STATIC.
Monumental roof courtyards and derelict east expansion remain unfurnished. */
B(0,920,2048,104); C(0,911,2048,10);
V(35,810,1974,99);
/* five differently sized, inhabited districts, no tall serial tower grid */
for(const [x,y,w] of [[78,612,335],[455,570,337],[834,628,440],
 [1308,545,326],[1701,625,299]]){
 C(x,y,w,17);C(x,y,18,913-y);C(x+w-18,y,18,913-y);
 C(x,893,w,20);St(x+25,872,w-50,12);
}
line(115,608,235,541,17,M.WALL);line(235,541,389,615,17,M.WALL);
line(481,564,558,524,14,M.WALL);line(558,524,680,569,14,M.WALL);
line(684,569,754,536,15,M.WALL);
line(851,615,933,590,17,M.WALL);line(933,590,1093,625,15,M.WALL);
line(1095,625,1186,579,15,M.WALL);
line(1330,540,1400,483,18,M.WALL);line(1400,483,1494,548,17,M.WALL);
line(1495,545,1606,503,17,M.WALL);
line(1712,616,1780,572,14,M.WALL);line(1780,572,1863,610,14,M.WALL);
St(1916,642,76,15);
for(const [x,y,w] of [[190,541,108],[541,520,112],[914,589,89],[1380,479,44],[1750,566,68]])St(x,y,w,12);
/* staggered roof cargo bridges, not an identical overhead girder on all halls */
line(393,606,482,569,15,M.STEEL);line(766,568,848,626,15,M.STEEL);
line(1252,622,1315,543,15,M.STEEL);line(1621,547,1714,627,12,M.STEEL);
/* West manifest, real hoist load and two receiving rollers */
St(134,671,240,18);C(144,695,58,39);V(153,702,40,19);
St(216,683,11,53);St(248,702,108,13);
for(const x of [260,291,322])St(x,686,8,15);
C(291,717,54,29);V(300,722,35,16);
line(139,619,220,570,14,M.STEEL);St(182,566,107,12);
St(262,577,11,101);St(245,678,56,17);
C(361,499,17,109);line(374,507,469,464,16,M.WALL);
St(365,459,178,14);St(489,473,16,115);St(482,568,75,13);
St(513,480,12,162);C(495,626,47,33);V(502,633,33,15);
/* West sorter — two-grade sloped transfers and a separate entered office */
St(469,670,300,16);St(492,708,245,14);
line(502,687,653,742,12,M.STEEL);line(541,656,701,701,11,M.STEEL);
for(const x of [559,589,618,647,676,706])St(x,698,10,28);
C(691,732,55,32);V(701,739,35,16);
C(517,759,90,11);St(621,766,112,11);
/* Core customs: unequal bounded physical receive, examination, release */
C(860,666,175,16);C(862,681,17,112);C(1016,680,17,112);
St(872,790,161,13);V(860,707,25,62);V(1011,708,28,60);
St(904,724,87,13);C(920,701,56,14);St(944,715,13,21);
C(1059,686,196,16);C(1060,701,19,98);C(1237,701,18,98);
St(1070,791,175,14);V(1055,710,29,63);V(1233,713,27,63);
C(1113,714,84,28);V(1122,721,61,14);
St(1094,764,32,11);St(1201,751,32,11);
St(1038,750,23,11);St(1025,738,39,12);
St(886,652,298,12);St(1144,661,18,26);
C(1002,640,64,24);V(1011,646,44,12);
/* Dense workers' quarters — physically side-entered levels, not trim */
St(1332,646,277,17);St(1330,755,283,14);
for(const x of [1362,1448,1552])C(x,671,14,82);
for(const [x,w] of [[1352,85],[1464,75],[1569,36]]){
 St(x,699,w,11);C(x+15,716,16,16);}
C(1360,779,80,12);C(1474,779,105,12);
St(1372,793,180,12);St(1502,818,55,10);
C(1487,675,48,19);V(1496,680,29,9);
/* Broken east cargo release, retained authoring seam and escape */
St(1733,674,201,15);St(1735,726,126,14);
line(1850,740,1958,775,13,M.STEEL);St(1817,769,100,11);
C(1821,702,68,25);V(1830,709,48,14);
C(1904,700,60,14);St(1951,715,12,44);
St(1770,788,123,11);
/* asymmetrical roof cargo bridges; no duplicate ship-tipper structure */
St(767,511,80,13);line(776,523,803,568,13,M.STEEL);
St(1148,551,169,13);line(1244,558,1273,625,12,M.STEEL);
St(1617,508,81,12);line(1635,517,1667,567,11,M.STEEL);
for(const [x,y,w] of [[174,598,85],[586,558,83],[1017,616,105],
 [1420,530,110],[1772,608,64]])St(x,y,w,12);
/* entered deep recovery workshop niches and running service bypass */
for(const [x,w] of [[114,150],[476,196],[866,155],[1325,171],[1745,175]]){
 St(x,894,w,12);C(x+12,882,13,23);
 C(x+w-23,879,12,25);St(x+30,878,73,10);
}
/* Human-access portals: a roof courtyard per region, side-access doors,
and multiple deep exits. Exact 31x27 clearance verified below. */
for(const [x,y,w,h] of [
 [318,591,89,201],[718,556,87,242],[1192,593,101,204],
 [1582,534,92,269],[1932,614,73,180],
 [400,694,74,104],[783,690,66,110],[1271,693,72,105],
 [1619,690,99,108],
 [331,802,90,91],[744,799,96,93],[1202,799,101,93],
 [1622,798,99,93],[54,809,84,94],[1950,807,65,97]
])V(x,y,w,h);
V(54,822,1910,59); /* full deep recovery line */
for(const [x,y] of Object.values(sites))V(x-37,y-34,75,69);
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
function BFS(w,h,ob){let pass=new Uint8Array(N),seen=new Uint8Array(N),queue=new Int32Array(N),first=0,last=0;let ox=ob?.[0]||-1,oy=ob?.[1]||-1,ow=ob?.[2]||0,oh=ob?.[3]||0;for(let y=h>>1;y<H-(h>>1);y++)for(let x=w>>1;x<W-(w>>1);x++){if(!clear(x,y,w,h))continue;let left=x-(w>>1),top=y-(h>>1);if(ob&&left<ox+ow&&left+w>ox&&top<oy+oh&&top+h>oy)continue;pass[y*W+x]=1;}let spawn=sites["Western parcel arrival"],n=spawn[1]*W+spawn[0];if(!pass[n])return {size:[w,h],error:"spawn blocked",pos:spawn};seen[n]=1;queue[last++]=n;while(first<last){let a=queue[first++],x=a%W,y=(a/W)|0;for(let b of [a-W,a+W,a-1,a+1])if(b>=0&&b<N&&!(Math.abs(a-b)===1&&((b/W)|0)!==y)&&pass[b]&&!seen[b]){seen[b]=1;queue[last++]=b;}}let bad=Object.entries(sites).filter(([n,p])=>!seen[p[1]*W+p[0]]).map(([n,p])=>({name:n,xy:p,clear:clear(p[0],p[1],w,h)}));return {size:[w,h],reached:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,component:last,bad,pass,seen};}
let routes=[[19,15],[23,19],[31,27]].map(([w,h])=>BFS(w,h,null)),barrier=[940,180,160,250],detour=BFS(31,27,barrier);
function dist(pass,start,end){let a=start[1]*W+start[0],b=end[1]*W+end[0],seen=new Int32Array(N),Q=new Int32Array(N),first=0,last=0;if(!pass[a]||!pass[b])return -1;Q[last++]=a;seen[a]=1;while(first<last){let n=Q[first++];if(n===b)return (seen[n]-1);let x=n%W,y=(n/W)|0;for(let v of [n-W,n+W,n-1,n+1])if(v>=0&&v<N&&!(Math.abs(n-v)===1&&((v/W)|0)!==y)&&pass[v]&&!seen[v]){seen[v]=seen[n]+1;Q[last++]=v;}}return -1;}
let start=sites["Western roof dispatcher"],finish=sites["Eastern roof inspector"];
let routeDistance=[dist(routes[2].pass,start,finish),dist(detour.pass,start,finish)];
let status=routes.map(r=>({size:r.size,reached:r.reached,total:r.total,free_centres:r.component,bad:r.bad,error:r.error||null}));
if(status.some(x=>x.reached!==x.total)||detour.reached!==Object.keys(sites).length||routeDistance[0]<0||routeDistance[1]<=routeDistance[0])throw Error('Exact Midge clearance, route or obstruction qualification failure '+JSON.stringify({status,detour:detour.bad,routeDistance}));
if(rect.length>32768||area>32000000)throw Error("budget "+rect.length+"/"+area);
const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:sites["West beacon ingress"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false},json=JSON.stringify(setup),jbytes=utf8(json);
if(jbytes.length>1048576)throw Error("JSON over budget");
let crops=[
["01-west-arrival",68,470,363,356],
["02-roofed-sorter",440,486,376,347],
["03-bonded-exchange",833,545,448,306],
["04-workers-borough",1302,469,338,384],
["05-broken-export-underworks",1652,546,353,364]];
let images=[["overview",[0,0,W,H]],...crops.map(c=>[c[0],c.slice(1)])].map(([name,rect])=>{let data=png(g,rect),pixels=verifyPng(g,rect,data);return{name,rect,bytes:data,sha256:sha256(data),pixels};});
let receipt={
concept:"Tidefault Bonded Freight — Low-Roof Parcel Borough / Stepped Customs Arcade",
original:true,seed:SEED,
engine_sha:"f7e056c9b8791106e22f2d1c295043783d8a9701",
source_reference_head:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",
extent:[W,H],
route_graph:{
main:["Western parcel arrival","Manifest crane approach","First bonded intake","Sorter service crossing","Inner custody exchange","Parcel despatch bridge","Workers ward frontage","Outbound cargo tally","Damaged export nose"],
upper:["Roof arrival lookout","Western roof dispatcher","Midroof bridge witness","Eastern roof inspector","Outer roof semaphore"],
interior:["West harbour registry","Berth load enclosure","First hand-sorting bay","Classification conveyor bay","Bonded receipt cell","Secured examination chamber","Workers sleeping ward","East bonded exit office","Damaged release dock"],
lower:["West floor return","Parcel maintenance reach","Bonded utility crossing","Inhabited ward rescue","East derelict escape"]},
material_ids:{"0":"Empty","100":"BasaltColumns Solid immovable None","58":"ReinforcedConcrete Solid immovable None","62":"SteelPlate Solid immovable None"},
midge_authored_hull:[4,3],hull_envelopes:[[19,15],[23,19],[31,27]],
exact_sites:sites,material_histogram:hist,
stable_occupied_cells:area,grounded:area,detached_cells:0,
pruned_disconnected_decor_cells:pruned,invalid_writes:0,
rectangles:rect.length,rectangle_work:area,setup_bytes:jbytes.length,
material_plane_sha256:sha256(g),setup_sha256:sha256(jbytes),
clearance:status,
obstruction:{material:58,rect:barrier,from:"Western roof dispatcher",to:"Eastern roof inspector",size:[31,27],sites_reached:detour.reached,unreachable:detour.bad,distance_before_after:routeDistance},
images:images.map(z=>({name:z.name,rect:z.rect,bytes:z.bytes.length,sha256:z.sha256,pixel_parity:z.pixels})),
native_status:"NATIVE-UNTESTED",bridge_source_max_rectangles:32768,
proof:"Exact full-grid lossless replay; three full Midge envelopes; physical obstruction detour; source PNG CRC/Adler and pixel parity; five unequal low-rise freight halls, physically distinct bonded transactions, populated ward, cargo transfer and deep recovery"
};
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
