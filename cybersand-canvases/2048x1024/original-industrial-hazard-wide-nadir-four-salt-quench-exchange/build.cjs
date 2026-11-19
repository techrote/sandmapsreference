'use strict';
// ORIGINAL material-cell world, fixed seed 19042647. No external visual reference.
// Read-only engine authority: de109d0131641d6adc8d25bb9ced7ca3d4991105
const fs=require('node:fs'),path=require('node:path');
const W=2048,H=1024,NAME="Nadir-4 Salt-Quench Exchange",SEED=19042647,ENGINE="de109d0131641d6adc8d25bb9ced7ca3d4991105",BASE="99a166e7fcae45eb22be1740e9f33f62faccbcc7",HASH="c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96";
const sites=[["Arrival aerostat",80,420],["West weighing hall",215,440],["Interchange flight lock",478,415],["Vacuum skylane",554,375],["Condensate landing",956,427],["Phase-gate overlook",1055,392],["Thermal diagnostic",1473,423],["Cold-water exchange",1556,494],["Exhaust service apron",1950,424],["Safe eastern extraction",1981,625],["West subterranean hatch",502,928],["Middle pressure undercroft",1035,929],["East sump return",1605,929]],crops=[["barge",10,225,485,600],["vacuum",490,135,460,695],["thermal",975,170,485,680],["cold",1475,200,545,675],["subgrade",860,790,580,205]],policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
function world(){
const W=2048,H=1024,g=new Uint8Array(W*H),M={W:58,S:62,P:63,G:66,I:68,C:70,Z:76,N:77,A:79,B:100,O:101,F:104,T:117,V:120,Q:122,U:123};
function b(x,y,w,h,k){x=Math.floor(x);y=Math.floor(y);w=Math.floor(w);h=Math.floor(h);for(let Y=Math.max(0,y);Y<Math.min(H,y+h);Y++)g.fill(k,Y*W+Math.max(0,x),Y*W+Math.min(W,x+w))}
function l(x,y,X,Y,t,k){const n=Math.max(1,Math.ceil(Math.max(Math.abs(X-x),Math.abs(Y-y))/3));for(let i=0;i<=n;i++){const p=i/n;b(x+(X-x)*p-t/2,y+(Y-y)*p-t/2,t,t,k)}}
function fr(x,y,w,h,t,k){b(x,y,w,t,k);b(x,y+h-t,w,t,k);b(x,y,t,h,k);b(x+w-t,y,t,h,k)}
function surf(x){let anchors=[[0,834],[175,846],[420,815],[640,843],[875,819],[1120,838],[1310,805],[1540,834],[1740,811],[2048,844]],j=1;while(j<anchors.length-1&&anchors[j][0]<x)j++;let a=anchors[j-1],c=anchors[j],p=(x-a[0])/(c[0]-a[0]);return Math.round(a[1]+(c[1]-a[1])*p+5*Math.sin(x/17)+3*Math.sin(x/31))}
function column(x,y,w,k=M.W){b(x,y,w,surf(x+w/2)-y+14,k)}
function plat(x,y,w,t=11){b(x,y,w,t,M.S);b(x,y+t,w,4,M.P)}
function vessel(x,y,w,h,k){b(x,y,w,h,M.W);b(x+12,y+12,w-24,h-24,k);b(x+12,y+1,w-24,8,M.V);b(x+1,y+14,9,h-28,M.P);b(x+w-10,y+14,9,h-28,M.P)}
for(let x=0;x<W;x++)b(x,surf(x),1,H-surf(x),M.B);
b(0,0,16,H,M.W);b(W-16,0,16,H,M.W);
// Accessible lower horizontal return and three fully open vertical access shafts.
b(130,900,1790,66,0);for(const [x,w] of [[463,100],[1010,100],[1511,102]])b(x,772,w,175,0);b(130,974,1790,10,M.W);
// BARGE INTAKE: two asymmetric rooted gantry cranes, entered scalehouse, wide upper and lower ports.
column(103,260,26);column(320,332,23);plat(110,323,218,15);plat(50,579,315,13);plat(105,743,290,13);
l(115,263,235,189,9,M.T);l(235,189,337,291,9,M.S);l(117,320,270,560,7,M.T);
b(225,184,18,71,M.W);b(225,184,115,8,M.S);b(333,191,11,90,M.T);
fr(125,645,220,103,12,M.W);b(295,674,53,48,0);b(185,641,76,38,0);
b(146,716,80,10,M.C);b(159,700,16,18,M.N);b(239,672,33,9,M.Z);
l(320,346,360,560,6,M.T);plat(349,590,99,12);
for(const [x,y,len] of [[125,585,40],[160,595,30],[206,593,39]]){b(x,y,9,len,M.T);b(x+12,y+len-5,30,5,M.A)}
// Real, wide 90-cell upper flying entrance into original enclosed crane hall.
// Retain column-bearing ends of load deck, remove obstructing central diagonal within the entry.
b(190,311,90,54,0);b(155,360,155,175,0);
// VACUUM NEEDLES: a deliberately different three-spire skyline and two sealed water-condensers.
column(605,199,21);column(746,138,24);column(868,258,26);plat(605,542,289,15);plat(605,697,291,11);
l(613,211,758,150,8,M.S);l(757,152,880,265,7,M.T);l(627,270,745,512,6,M.I);l(763,258,867,495,8,M.I);
b(601,174,31,22,M.U);b(736,99,39,36,M.N);b(861,221,39,35,M.U);
vessel(627,576,102,108,3);vessel(781,614,99,71,3);l(678,547,678,575,10,M.I);l(832,553,832,613,8,M.I);
fr(619,733,275,85,11,M.W);b(614,759,40,43,0);b(858,759,41,44,0);plat(680,802,170,10);
for(let i=0;i<4;i++){b(655+i*49,555,8,22,M.Z);b(666+i*49,556,23,7,M.N)}
// PHASE-GATE: twin concrete cheeks, two distinct refractory baffles and sealed hot reactor capsule.
column(1136,244,24);column(1325,282,25);plat(1139,341,211,13);plat(1139,616,214,14);
l(1139,286,1329,327,10,M.S);l(1146,347,1230,563,7,M.T);l(1335,347,1272,571,8,M.I);
b(1164,515,52,91,M.F);b(1173,526,18,66,M.A);b(1295,501,35,101,M.F);b(1310,525,12,73,M.U);
vessel(1191,674,119,107,8);plat(1142,791,212,12);l(1226,638,1226,673,10,M.I);l(1282,638,1282,673,9,M.I);
fr(1384,655,163,115,10,M.W);b(1380,685,43,60,0);b(1509,687,45,55,0);
for(let i=0;i<3;i++){b(1401+i*38,725,10,33,M.T);b(1401+i*38,721,10,7,M.A)}
// COLD RECOVERY: individually differing cooling fins, two water retorts, inhabited inspection hall.
column(1636,318,23);column(1768,241,20);column(1888,345,25);plat(1639,578,276,12);plat(1639,730,282,13);
l(1649,335,1777,249,9,M.S);l(1778,250,1900,348,9,M.I);
b(1629,290,42,26,M.N);b(1757,203,36,38,M.U);b(1881,308,35,35,M.N);
vessel(1662,626,92,94,3);vessel(1810,649,96,70,3);
l(1708,591,1708,625,9,M.I);l(1855,592,1855,648,10,M.I);
fr(1680,759,215,79,11,M.W);b(1675,782,44,49,0);b(1860,759,41,37,0);
for(const [x,y,h] of [[1610,391,19],[1729,310,24],[1802,366,22],[1918,302,29]]){column(x,y,13,M.S);b(x-5,y,23,8,M.C)}
return g;
}

function connect(g,fix){const W=2048,H=1024,s=g.length,seen=new Uint8Array(s),q=new Int32Array(s),solid=k=>k!==0&&k!==3&&k!==8;function scan(){seen.fill(0);let i=0,j=0;function add(v){if(solid(g[v])&&!seen[v]){seen[v]=1;q[j++]=v}}for(let x=0;x<W;x++){add(x);add((H-1)*W+x)}for(let y=0;y<H;y++){add(y*W);add(y*W+W-1)}while(i<j){let v=q[i++],x=v%W,y=v/W|0;if(x>0)add(v-1);if(x<W-1)add(v+1);if(y>0)add(v-W);if(y<H-1)add(v+W)}return j}
let bearings=[],grounded=scan(),total=0;for(const k of g)if(solid(k))total++;
if(fix&&grounded<total)for(let step=0;step<3&&grounded<total;step++){const root=seen.slice(),handled=new Uint8Array(s),list=new Int32Array(s);for(let p=0;p<s;p++){if(root[p]||handled[p]||!solid(g[p]))continue;let r=0,n=1,bottom=p;list[0]=p;handled[p]=1;while(r<n){let v=list[r++],x=v%W,y=v/W|0;if(y>(bottom/W|0))bottom=v;for(const z of [x>0?v-1:-1,x<W-1?v+1:-1,y>0?v-W:-1,y<H-1?v+W:-1])if(z>=0&&!handled[z]&&!root[z]&&solid(g[z])){handled[z]=1;list[n++]=z}}const x=bottom%W,y=bottom/W|0;let end=H-1;for(let yy=y+1;yy<H;yy++)if(root[yy*W+x]&&solid(g[yy*W+x])){end=yy;break}for(let yy=y+1;yy<=end;yy++)for(let dx=-2;dx<=2;dx++){const X=x+dx,p=yy*W+X;if(X>16&&X<W-16&&g[p]===0)g[p]=62}bearings.push([x,y+1,end,n])}grounded=scan();total=0;for(const k of g)if(solid(k))total++;}
return {grounded,total,detached:total-grounded,bearings};
}

function rectangles(g){const W=2048,H=1024,a=[],past=new Map();for(let y=0;y<H;y++){const now=new Map();for(let x=0;x<W;){let m=g[y*W+x],start=x;x++;while(x<W&&g[y*W+x]===m)x++;if(!m)continue;let key=start+","+ (x-start)+","+m,old=past.get(key);if(old===undefined){old=a.length;a.push([start,y,x-start,1,m])}else a[old][3]++;now.set(key,old)}past.clear();for(const [k,v] of now)past.set(k,v)}return a}

function clearance(g,w,h){const W=2048,H=1024,I=W+1,s=new Uint32Array(I*(H+1)),allowed=new Uint8Array(W*H),rx=w>>1,ry=h>>1;for(let y=0;y<H;y++){let t=0;for(let x=0;x<W;x++){t+=g[y*W+x]?1:0;s[(y+1)*I+x+1]=s[y*I+x+1]+t}}let count=0;for(let y=ry;y<H-ry;y++)for(let x=rx;x<W-rx;x++){let a=x-rx,b=x+rx+1,c=y-ry,d=y+ry+1;if(s[d*I+b]-s[c*I+b]-s[d*I+a]+s[c*I+a]===0){allowed[y*W+x]=1;count++}}return {allowed,count}}

function flood(allowed){const W=2048,H=1024,q=new Int32Array(W*H),seen=new Uint8Array(W*H),start=420*W+80; if(!allowed[start])throw Error("spawn collides");let n=1,i=0;q[0]=start;seen[start]=1;while(i<n){let v=q[i++],x=v%W,y=v/W|0;for(let z of [x>0?v-1:-1,x<W-1?v+1:-1,y>0?v-W:-1,y<H-1?v+W:-1])if(z>=0&&allowed[z]&&!seen[z]){seen[z]=1;q[n++]=z}}return{seen,count:n}}

function replay(edits){const W=2048,H=1024,g=new Uint8Array(W*H);for(const [x,y,w,h,m] of edits){if(x<0||y<0||w<1||h<1||x+w>W||y+h>H||m===0||m>131)throw Error("invalid rectangle");for(let Y=y;Y<y+h;Y++)for(let X=x;X<x+w;X++){let k=Y*W+X;if(g[k])throw Error("overlap");g[k]=m}}return g}

function qualify(g,edits,sites){const W=2048,H=1024,t=replay(edits),hist={},liquids={open_faces:0,cross_reaction:0};for(let i=0;i<t.length;i++){if(t[i]!==g[i])throw Error("material rectangle replay mismatch");hist[g[i]]=(hist[g[i]]||0)+1}for(let y=0;y<H;y++)for(let x=0;x<W;x++){const k=y*W+x,m=g[k];if(m!==3&&m!==8)continue;for(let z of [x>0?k-1:-1,x<W-1?k+1:-1,y>0?k-W:-1,y<H-1?k+W:-1])if(z>=0){let v=g[z];if(v===0)liquids.open_faces++;if((m===3&&v===8)||(m===8&&v===3))liquids.cross_reaction++}}if(liquids.open_faces||liquids.cross_reaction)throw Error("fluid breach");let support=connect(g,false);if(support.detached)throw Error("detached solids "+support.detached);const route={};for(const [w,h] of [[19,15],[23,19],[31,27]]){let pass=clearance(g,w,h),r=flood(pass.allowed),miss=sites.filter(z=>!r.seen[z[2]*W+z[1]]).map(z=>z[0]);route[w+"x"+h]={passable_centres:pass.count,reachable_centres:r.count,sites:sites.length,missing:miss};if(miss.length)throw Error("route "+w+"x"+h+" "+JSON.stringify(miss))}let obstructions=[];for(let [x,y] of [[930,500],[1502,560]]){let a=g.slice();for(let Y=y;Y<y+64;Y++)a.fill(58,Y*W+x,Y*W+x+52);let r=flood(clearance(a,31,27).allowed),miss=sites.filter(z=>!r.seen[z[2]*W+z[1]]).map(z=>z[0]);obstructions.push({rectangle:[x,y,52,64,58],missing:miss,reachable_centres:r.count});if(miss.length)throw Error("blocked "+JSON.stringify(miss))}return{hist,liquids,support,route,obstructions}}

function ascii(s){let a=new Uint8Array(s.length);for(let i=0;i<a.length;i++){if(s.charCodeAt(i)>127)throw Error("non-ASCII "+s.charCodeAt(i));a[i]=s.charCodeAt(i)}return a}

function sha256(arr){const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];let s=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],n=arr.length,L=((n+9+63)>>6)<<6,b=new Uint8Array(L);b.set(arr);b[n]=128;let bits=n*8;b[L-4]=bits>>>24;b[L-3]=bits>>>16;b[L-2]=bits>>>8;b[L-1]=bits&255;const ro=(v,c)=>(v>>>c)|(v<<(32-c));for(let base=0;base<L;base+=64){let v=new Uint32Array(64);for(let i=0;i<16;i++){let j=base+i*4;v[i]=((b[j]<<24)|(b[j+1]<<16)|(b[j+2]<<8)|b[j+3])>>>0}for(let i=16;i<64;i++){let t=v[i-15],u=v[i-2];v[i]=(v[i-16]+(ro(t,7)^ro(t,18)^(t>>>3))+v[i-7]+(ro(u,17)^ro(u,19)^(u>>>10)))>>>0}let [a,c,d,e,f,g,h,z]=s;for(let i=0;i<64;i++){let T1=(z+(ro(f,6)^ro(f,11)^ro(f,25))+((f&g)^(~f&h))+K[i]+v[i])>>>0,T2=((ro(a,2)^ro(a,13)^ro(a,22))+((a&c)^(a&d)^(c&d)))>>>0;z=h;h=g;g=f;f=(e+T1)>>>0;e=d;d=c;c=a;a=(T1+T2)>>>0}for(let i=0;i<8;i++)s[i]=(s[i]+[a,c,d,e,f,g,h,z][i])>>>0}return s.map(x=>x.toString(16).padStart(8,"0")).join("")}

function crc(arr){let c=-1;for(const b of arr){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0)}return(c^(-1))>>>0}

function join(parts){let n=parts.reduce((s,p)=>s+p.length,0),r=new Uint8Array(n),at=0;for(const p of parts){r.set(p,at);at+=p.length}return r}

function png(g,x0,y0,w,h){const raw=new Uint8Array((w+1)*h);for(let y=0;y<h;y++)raw.set(g.subarray((y0+y)*2048+x0,(y0+y)*2048+x0+w),y*(w+1)+1);let a=1,b=0;for(const v of raw){a=(a+v)%65521;b=(b+a)%65521}let z=[[120,1]],p=0;while(p<raw.length){let n=Math.min(65535,raw.length-p),fin=p+n===raw.length;z.push([fin?1:0,n&255,n>>8,(~n)&255,((~n)>>8)&255]);z.push(raw.subarray(p,p+n));p+=n}z.push([b>>>8,b&255,a>>>8,a&255]);const palette=new Uint8Array(768),cl={0:[9,14,25],3:[41,128,184],8:[240,94,37],58:[78,84,99],62:[133,146,160],63:[53,102,131],66:[113,135,153],68:[83,123,141],70:[192,191,172],76:[228,185,63],77:[70,243,227],79:[250,161,74],100:[45,55,66],101:[32,37,50],104:[133,64,55],117:[145,153,169],120:[77,183,205],122:[175,225,225],123:[88,226,160]};for(let i=0;i<256;i++)palette.set(cl[i]||[164,85,141],3*i);const U=(v)=>[(v>>>24)&255,(v>>>16)&255,(v>>>8)&255,v&255];const chunk=(t,d)=>{let c=join([ascii(t),d]);return join([U(d.length),c,U(crc(c))])};return join([[137,80,78,71,13,10,26,10],chunk("IHDR",join([U(w),U(h),[8,3,0,0,0]])),chunk("PLTE",palette),chunk("IDAT",join(z)),chunk("IEND",[])])}

function checkPng(bytes,g,x0,y0,w,h){const u=p=>((bytes[p]*16777216)+(bytes[p+1]<<16)+(bytes[p+2]<<8)+bytes[p+3])>>>0;let at=8,ids=[],iend=false;while(at<bytes.length){let n=u(at),type=String.fromCharCode(...bytes.subarray(at+4,at+8));if(u(at+8+n)!==crc(bytes.subarray(at+4,at+8+n)))throw Error("PNG CRC");if(type==="IHDR"&&(u(at+8)!==w||u(at+12)!==h||bytes[at+17]!==3))throw Error("PNG IHDR");if(type==="IDAT")ids.push(bytes.subarray(at+8,at+8+n));if(type==="IEND")iend=true;at+=12+n}if(!iend)throw Error("missing IEND");const z=join(ids),r=new Uint8Array((w+1)*h);let p=2,j=0;while(true){let f=z[p++],n=z[p]|z[p+1]<<8,N=z[p+2]|z[p+3]<<8;p+=4;if((n^N)!==65535||(f&6))throw Error("Bad DEFLATE");r.set(z.subarray(p,p+n),j);p+=n;j+=n;if(f&1)break}if(j!==r.length)throw Error("PNG scanline");for(let y=0;y<h;y++){let s=y*(w+1);if(r[s])throw Error("PNG filter");for(let x=0;x<w;x++)if(r[s+x+1]!==g[(y+y0)*2048+x+x0])throw Error("PNG index parity mismatch")}return w*h}
const g=world(),support=connect(g,true),edits=rectangles(g),check=qualify(g,edits,sites);
const setup={version:2,extent:[W,H],actors:[{id:1,model:'midge',hash:HASH,spawn:[80,420],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:2}}],next_id:2,selected:1,edits,response:'LA-SELECTIVE',liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
const setupBytes=ascii(JSON.stringify(setup)+'\n');if(edits.length>32768||setupBytes.length>1048576)throw Error('Workbench budget');
const outputs={'setup.json':setupBytes};let imgs=[],pixel=0;
for(const [name,x,y,w,h] of [['overview',0,0,W,H],...crops]){let data=png(g,x,y,w,h),p=checkPng(data,g,x,y,w,h);imgs.push({name:name+'.png',x,y,width:w,height:h,bytes:data.length,sha256:sha256(data),material_pixels_checked:p});outputs[name+'.png']=data;pixel+=p;}
const receipt={schema:'original-landscape-static-v1',name:NAME,seed:SEED,engine_sha:ENGINE,base_sha:BASE,dimensions:[W,H],actual_cells:g.length,plane_sha256:sha256(g),setup_sha256:sha256(setupBytes),setup_bytes:setupBytes.length,rectangle_count:edits.length,construction_writes:edits.reduce((s,e)=>s+e[2]*e[3],0),histogram:check.hist,structural_grounded:check.support,added_steel_bearings:support.bearings,initial_liquid_isolation:check.liquids,sites,clearance:check.route,physical_obstructions:check.obstructions,images:imgs,decoded_material_pixels_compared:pixel,native:'NATIVE-UNTESTED',installed_bridge_capacity:'UNKNOWN; source 32768 / possible old installed 4096'};
outputs['receipt.json']=ascii(JSON.stringify(receipt,null,2)+'\n');
const verifying=process.argv.includes('--verify');
for(const [name,content] of Object.entries(outputs)){const p=path.join(__dirname,name);if(verifying){if(!fs.existsSync(p)||!Buffer.from(content).equals(fs.readFileSync(p)))throw Error('Byte mismatch '+name);}else fs.writeFileSync(p,content);}
console.log(JSON.stringify({status:'PASS',mode:verifying?'verify':'build',rectangles:edits.length,json_bytes:setupBytes.length,full_plane_sha256:sha256(g),pixels_checked:pixel}));
