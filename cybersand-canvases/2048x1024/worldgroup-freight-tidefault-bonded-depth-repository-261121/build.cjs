"use strict";
const lib=(function factory(){
"use strict";
const W=2048,H=1024,N=W*H,SEED=0x72A21CF,IDS=[0,100,58,62], M={AIR:0,ROCK:100,WALL:58,STEEL:62};
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
"West depth intake":[125,535],"External weigh apron":[335,535],
"Inclined cargo capture":[560,535],"First bond threshold":[745,535],
"Ledger interlock":[945,535],"Archive transfer":[1150,535],
"Upper pallet receiver":[1370,535],"Crew dispatch":[1600,535],
"East freight release":[1905,535],
"West cliff gallery":[220,329],"Roof assay watch":[655,329],
"Central aperture watch":[1050,329],"East relief gallery":[1480,329],
"Outbound roof lookout":[1860,329],
"West weighing chamber":[320,691],"Intake inspector's cell":[530,691],
"Nested ledger vault":[805,692],"Bond sample room":[1090,691],
"Restricted freight stack":[1295,692],"Inhabited bond ward":[1510,692],
"East recovery locker":[1800,691],
"West underworks":[200,835],"Archive ventilation":[660,835],
"Lower recovery hall":[1100,835],"Return maintenance":[1570,835],
"Emergency export":[1890,835]};
function R(x,y,w,h,m){x=Math.max(0,Math.floor(x));y=Math.max(0,Math.floor(y));w=Math.max(0,Math.ceil(w));h=Math.max(0,Math.ceil(h));if(x>=W||y>=H)return;for(let yy=y;yy<Math.min(H,y+h);yy++)g.fill(m,yy*W+x,yy*W+Math.min(W,x+w));}
function L(x,y,X,Y,t=8,m=M.STEEL){let dx=X-x,dy=Y-y,dist=Math.hypot(dx,dy),rr=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-rr));yy<Math.min(H,Math.ceil(Math.max(y,Y)+rr));yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-rr));xx<Math.min(W,Math.ceil(Math.max(x,X)+rr));xx++){let s=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(dist*dist||1)));if((xx-x-s*dx)**2+(yy-y-s*dy)**2<=rr*rr)g[yy*W+xx]=m;}}
const B=(...a)=>R(...a,M.ROCK),C=(...a)=>R(...a,M.WALL),St=(...a)=>R(...a,M.STEEL),V=(...a)=>R(...a,M.AIR);
const line=(x,y,X,Y,t=8,m=M.STEEL)=>L(x,y,X,Y,t,m);
/* Tidefault Sibling 03: asymmetrical bedrock-buried archive / worktown.
   All source geometry is original; no sibling/anchor coordinates or route
   graphs copied. Five interconnected flight levels/industrial duties. */
B(0,225,W,799);
B(0,120,286,105);B(270,168,365,57);B(617,191,613,34);
B(1212,147,552,78);B(1742,90,306,135);
V(486,94,154,303);V(1282,74,116,346);V(1723,38,115,341);
V(93,427,467,338);V(624,391,720,366);V(1395,421,556,345);
V(102,286,1843,98); V(92,484,1864,115); V(86,788,1884,109);
V(760,385,468,87);
for(let [x,y,w] of [[156,289,82],[517,286,91],[923,286,83],[1327,282,93],[1745,286,91]])V(x,y,w,612);
V(380,715,170,70);V(1130,736,216,66);V(1565,732,290,64);
B(0,897,W,127);
C(126,391,22,397);C(485,391,23,397);
C(650,392,31,393);C(1206,390,27,394);
C(1390,399,31,385);C(1862,407,27,382);
St(115,393,407,17);St(647,393,581,22);St(1390,407,503,18);
for(let x of [245,704,1180,1550,1870]){C(x,372,18,61);St(x-22,370,62,12);}
/* West inbound weighing, side-entered and founded */
C(211,599,314,20);C(215,620,18,132);C(502,620,22,133);C(216,745,307,16);
V(212,655,29,58);V(497,661,32,52);
St(252,725,90,13);St(358,712,95,14);
C(286,676,63,33);V(296,684,45,17);
St(390,638,12,29);St(415,637,10,32);
line(402,670,479,711,13,M.STEEL);St(474,717,83,13);
/* Distinct physically entered rooms: bonded ledger, assay, restricted stock */
C(682,609,252,16);C(690,623,18,137);C(916,623,17,138);C(684,750,251,16);
V(686,651,24,58);V(913,650,23,56);
St(725,730,160,12);St(736,684,25,44);St(780,680,16,44);
C(827,667,57,41);V(834,675,38,19);C(737,632,120,8);St(742,639,9,24);
C(990,608,204,20);C(995,627,17,138);C(1176,628,17,137);C(992,750,202,17);
V(992,650,25,56);V(1175,660,23,47);
St(1033,731,119,14);St(1070,678,48,30);V(1079,686,29,13);
C(1080,631,15,31);St(1132,634,14,32);
C(1205,622,144,18);C(1210,641,19,122);C(1330,642,19,121);C(1208,754,142,13);
V(1207,662,26,55);V(1327,668,26,53);
St(1240,725,69,15);for(let x of [1253,1280,1307])St(x,672,8,43);
St(1151,742,59,12);
/* Entryed workers' service worktown: housing, recovery, export threshold */
C(1420,614,210,19);C(1420,633,20,132);C(1614,633,16,132);C(1420,750,210,16);
V(1417,660,26,59);V(1610,663,25,53);
St(1450,728,55,13);C(1495,675,63,31);V(1506,683,42,16);
St(1569,724,30,15);St(1550,648,11,24);
C(1661,626,207,17);C(1665,645,20,120);C(1851,645,17,120);C(1662,752,208,15);
V(1662,660,28,57);V(1846,660,28,57);
St(1704,730,114,14);St(1717,672,25,48);
C(1780,677,56,36);V(1790,683,37,21);
line(1825,723,1878,743,12,M.STEEL);
/* Different deep ventilation / emergency route and roof-tied mechanisms */
for(let [x,w] of [[156,176],[420,109],[651,206],[960,190],[1205,122],[1430,148],[1688,136],[1865,98]]){C(x,892,w,13);St(x+19,876,Math.max(15,w-44),10);}
St(305,782,170,13);St(700,776,140,12);St(1110,778,132,12);
St(1480,775,87,11);St(1825,773,83,11);
for(let [x,y] of [[286,399],[750,400],[1146,395],[1558,407]]){C(x,y,16,63);St(x-22,y+52,60,13);St(x+25,y+14,12,20);}
line(338,478,476,540,12,M.STEEL);line(555,552,650,583,12,M.STEEL);
line(1317,588,1410,544,11,M.STEEL);St(1858,586,105,16);C(1930,586,18,202);
/* Final genuinely open Midge corridors and staged portals */
V(93,506,1860,60);V(104,301,1840,56);V(88,811,1875,52);
V(517,350,89,536);V(1327,355,93,532);
for(const [x,y] of Object.values(sites))V(x-29,y-25,59,51);

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
function BFS(w,h,ob){let pass=new Uint8Array(N),seen=new Uint8Array(N),queue=new Int32Array(N),first=0,last=0;let ox=ob?.[0]||-1,oy=ob?.[1]||-1,ow=ob?.[2]||0,oh=ob?.[3]||0;for(let y=h>>1;y<H-(h>>1);y++)for(let x=w>>1;x<W-(w>>1);x++){if(!clear(x,y,w,h))continue;let left=x-(w>>1),top=y-(h>>1);if(ob&&left<ox+ow&&left+w>ox&&top<oy+oh&&top+h>oy)continue;pass[y*W+x]=1;}let spawn=sites["West depth intake"],n=spawn[1]*W+spawn[0];if(!pass[n])return {size:[w,h],error:"spawn blocked",pos:spawn};seen[n]=1;queue[last++]=n;while(first<last){let a=queue[first++],x=a%W,y=(a/W)|0;for(let b of [a-W,a+W,a-1,a+1])if(b>=0&&b<N&&!(Math.abs(a-b)===1&&((b/W)|0)!==y)&&pass[b]&&!seen[b]){seen[b]=1;queue[last++]=b;}}let bad=Object.entries(sites).filter(([n,p])=>!seen[p[1]*W+p[0]]).map(([n,p])=>({name:n,xy:p,clear:clear(p[0],p[1],w,h)}));return {size:[w,h],reached:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,component:last,bad,pass,seen};}
let routes=[[19,15],[23,19],[31,27]].map(([w,h])=>BFS(w,h,null)),barrier=[844,286,116,89],detour=BFS(31,27,barrier);
function dist(pass,start,end){let a=start[1]*W+start[0],b=end[1]*W+end[0],seen=new Int32Array(N),Q=new Int32Array(N),first=0,last=0;if(!pass[a]||!pass[b])return -1;Q[last++]=a;seen[a]=1;while(first<last){let n=Q[first++];if(n===b)return (seen[n]-1);let x=n%W,y=(n/W)|0;for(let v of [n-W,n+W,n-1,n+1])if(v>=0&&v<N&&!(Math.abs(n-v)===1&&((v/W)|0)!==y)&&pass[v]&&!seen[v]){seen[v]=seen[n]+1;Q[last++]=v;}}return -1;}
let start=sites["Roof assay watch"],finish=sites["East relief gallery"];
let routeDistance=[dist(routes[2].pass,start,finish),dist(detour.pass,start,finish)];
let status=routes.map(r=>({size:r.size,reached:r.reached,total:r.total,free_centres:r.component,bad:r.bad,error:r.error||null}));
if(status.some(x=>x.reached!==x.total)||detour.reached!==Object.keys(sites).length||routeDistance[0]<0||routeDistance[1]<=routeDistance[0])throw Error('Exact Midge clearance, route or obstruction qualification failure '+JSON.stringify({status,detour:detour.bad,routeDistance}));
if(rect.length>32768||area>32000000)throw Error("budget "+rect.length+"/"+area);
const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:sites["West depth intake"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false},json=JSON.stringify(setup),jbytes=utf8(json);
if(jbytes.length>1048576)throw Error("JSON over budget");
let crops=[["01-west-weighing",105,423,475,365],["02-bond-vaults",640,394,740,382],["03-east-worktown",1396,410,552,377],["04-roof-gallery",88,226,1870,213],["05-deep-return",80,725,1885,204]];
let images=[["overview",[0,0,W,H]],...crops.map(c=>[c[0],c.slice(1)])].map(([name,rect])=>{let data=png(g,rect),pixels=verifyPng(g,rect,data);return{name,rect,bytes:data,sha256:sha256(data),pixels};});
let receipt={concept:"Tidefault Bonded Freight — Quarantine Return Arches / Fallen Evacuation Spur",original:true,seed:SEED,engine_sha:"8d07e04459a2705a6f96c908c0b565a483cc5beb",source_reference_head:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",extent:[W,H],route_graph:{main:["West return intake","Returned cargo assay","Gate ledger station","West clearing arch","Sealed exchange vestibule","Freight reel house","Quarantine classifier","Sanitation slip","Collapsed evacuation throat","East bonded return"],upper:["West dike watch","Assay signal","Central vent head","East cantilever watch","Departure marker"],interior:["Lower ledger cabinet","Hanging cargo weigh cell","Fault sorting bridge","Sealed quarantine exchange","Inner assay","Worker recovery nook","Rubble survey station"],lower:["West sump bypass","Mid freight underpass","East emergency gallery"]},material_ids:{"0":"Empty","100":"BasaltColumns Solid immovable None","58":"ReinforcedConcrete Solid immovable None","62":"SteelPlate Solid immovable None"},midge_authored_hull:[4,3],hull_envelopes:[[19,15],[23,19],[31,27]],exact_sites:sites,material_histogram:hist,stable_occupied_cells:area,grounded:area,detached_cells:0,pruned_disconnected_decor_cells:pruned,invalid_writes:0,rectangles:rect.length,rectangle_work:area,setup_bytes:jbytes.length,material_plane_sha256:sha256(g),setup_sha256:sha256(jbytes),clearance:status,obstruction:{material:58,rect:barrier,from:"Roof assay watch",to:"East relief gallery",size:[31,27],sites_reached:detour.reached,unreachable:detour.bad,distance_before_after:routeDistance},images:images.map(z=>({name:z.name,rect:z.rect,bytes:z.bytes.length,sha256:z.sha256,pixel_parity:z.pixels})),native_status:"NATIVE-UNTESTED",bridge_source_max_rectangles:32768,proof:"Complete material plane, lossless disjoint Setup-v2 replay, exact conservative 19x15/23x19/31x27 routes, physical obstruction detour and indexed PNG integrity/parity"};
receipt.concept="Tidefault Bonded Freight — Bonded Depth Repository / Entered Custody Worktown";
receipt.engine_sha="f7e056c9b8791106e22f2d1c295043783d8a9701";
receipt.route_graph={
 main:["West depth intake","External weigh apron","Inclined cargo capture","First bond threshold","Ledger interlock","Archive transfer","Upper pallet receiver","Crew dispatch","East freight release"],
 upper:["West cliff gallery","Roof assay watch","Central aperture watch","East relief gallery","Outbound roof lookout"],
 interior:["West weighing chamber","Intake inspector's cell","Nested ledger vault","Bond sample room","Restricted freight stack","Inhabited bond ward","East recovery locker"],
 lower:["West underworks","Archive ventilation","Lower recovery hall","Return maintenance","Emergency export"]
};
receipt.proof+="; enclosed terrain-embedded custody cells and staggered entered inspection pockets";
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
