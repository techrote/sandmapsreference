"use strict";
// Pure original geometry; PNGs are generated from indexed material cells, not reference art.
const build=function build(){
 const W=2048,H=1024,N=W*H,g=new Uint8Array(N),seed=0xC0A711;
 const M={rock:100,schist:101,iron:49,steel:62,titanium:68,blue:63,conduit:66,glass:120,white:121,quartz:122,black:129,ceramic:130,chrome:131,amber:79,signal:77,wall:58};
 function R(x,y,w,h,m){let a=Math.max(0,Math.round(x)),b=Math.min(W,Math.round(x+w)),c=Math.max(0,Math.round(y)),d=Math.min(H,Math.round(y+h));if(a>=b||c>=d)return;for(let k=c;k<d;k++)g.fill(m,k*W+a,k*W+b);}
 function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,r=t/2;for(let j=Math.max(0,Math.floor(Math.min(y,Y)-r));j<Math.min(H,Math.ceil(Math.max(y,Y)+r)+1);j++)for(let i=Math.max(0,Math.floor(Math.min(x,X)-r));i<Math.min(W,Math.ceil(Math.max(x,X)+r)+1);i++){let v=Math.max(0,Math.min(1,((i-x)*dx+(j-y)*dy)/(d||1)));if((i-x-v*dx)**2+(j-y-v*dy)**2<=r*r)g[j*W+i]=m;}}





 // ORISON STRAND — ORIGINAL FRACTURE-ISLAND SALVAGE EXCHANGE.
 // Five physically rooted inhabited mesas; broken elevated transit beams; five
 // entered side-cut service vaults; asymmetrical crane and exposed deep byways.
 const mesas=[[100,423,477],[525,811,551],[927,1249,532],[1378,1698,488],[1782,2036,606]];
 function floor(x){return Math.round(900+19*Math.sin(x*.0121)+8*Math.sin(x*.043));}
 for(let x=0;x<W;x+=4){let z=floor(x);R(x,z,4,H-z,((x/4|0)%29===0)?M.schist:M.rock);}
 R(0,995,W,29,M.schist);
 function top(ix,x){let [l,r,y]=mesas[ix];let u=(x-l)/(r-l);return Math.round(y+37*(2*u-1)*(2*u-1)+11*Math.sin(x*.044+ix*1.3+(seed%991)/991));}
 for(let j=0;j<mesas.length;j++){let [l,r]=mesas[j];for(let x=l;x<r;x+=3){
  R(x,top(j,x),Math.min(3,r-x),H-top(j,x),((x+j*11)%23<3)?M.schist:M.rock);
 }}
 // Five enterable rock-cut chambers. Side passages meet the open inter-island ravines.
 R(150,605,193,100,0);R(331,626,131,69,0);
 R(583,657,153,93,0);R(484,675,119,61,0);
 R(1011,680,175,100,0);R(1174,698,136,65,0);
 R(1440,646,183,102,0);R(1606,671,152,65,0);
 R(1840,740,149,94,0);R(1716,756,143,66,0);
 for(const [x,y,w] of [[172,700,152],[601,749,126],[1025,777,146],[1455,745,140],[1853,830,121]]){
  R(x,y,w,7,M.iron);R(x+12,y-16,8,16,M.chrome);
 }
 // Each upper settlement deck is pinned down into its mesa by paired deep piers.
 function deck(x,y,w,pierXs){R(x,y,w,13,M.steel);R(x,y-7,w,7,M.titanium);for(const a of pierXs){
  R(a,y,13,116,M.iron);R(a+4,y+10,5,106,M.chrome);
  L(a+6,y+140,Math.max(x+6,a-35),y+7,7,M.titanium);
 }}
 deck(119,456,287,[162,337]);deck(534,529,268,[581,761]);
 deck(947,512,283,[987,1177]);deck(1393,464,291,[1426,1659]);
 deck(1800,581,230,[1830,1993]);
 // Western rover triage and inhabited field medicine.
 R(147,371,209,12,M.steel);R(147,382,12,73,M.iron);
 R(157,431,70,20,M.black);R(170,436,17,12,M.blue);
 R(242,423,64,28,M.ceramic);R(252,430,10,11,M.amber);
 R(319,427,25,22,M.white);R(327,433,6,10,M.signal);
 R(277,371,68,12,0);L(155,377,127,344,8,M.chrome);R(124,339,9,13,M.amber);
 R(386,466,96,9,M.iron);L(392,467,361,449,10,M.iron);
 // Second mesa thermal assay and deliberately unfinished service wing.
 R(557,453,169,12,M.titanium);R(558,464,10,64,M.iron);
 R(592,491,56,31,M.black);R(605,499,13,16,M.amber);
 R(659,474,45,46,M.ceramic);R(670,488,16,24,M.blue);
 R(730,536,78,8,M.iron);L(741,538,776,482,10,M.titanium);
 // Two elevated, SHEARED transit cantilevers; actual ruin gaps expose ravines.
 R(342,310,248,10,M.steel);R(345,321,245,5,M.chrome);
 R(371,320,12,138,M.iron);L(371,436,577,312,10,M.titanium);
 R(562,305,22,7,M.iron);R(559,297,7,16,M.amber);
 R(728,293,278,10,M.steel);R(728,304,278,5,M.chrome);
 R(756,302,12,230,M.iron);L(756,504,987,296,9,M.titanium);
 R(736,285,22,7,M.iron);R(741,279,7,11,M.signal);
 // Breakthroughs in both suspended transit spans create honest vertical flight exits.
 R(457,284,71,91,0);R(837,264,70,94,0);
 // Central irregular crane: grounded mast, heavy triangular jib, service wheelhouse.
 R(1056,156,24,368,M.iron);R(1063,165,10,358,M.chrome);
 R(1033,156,320,13,M.titanium);R(1067,169,278,6,M.iron);
 L(1059,165,1321,176,9,M.steel);L(1072,260,1320,171,10,M.iron);
 L(1082,371,1328,176,10,M.chrome);
 R(1285,176,9,146,M.iron);R(1286,308,24,8,M.chrome);
 R(1281,315,28,9,M.black);R(1289,324,8,14,M.amber);
 R(996,457,130,12,M.steel);R(1002,467,14,46,M.iron);
 R(1016,476,77,29,M.black);R(1029,485,19,12,M.signal);
 R(1112,466,83,38,M.ceramic);R(1129,478,13,15,M.blue);
 L(1070,371,1007,459,10,M.titanium);
 R(1152,415,66,13,M.iron);R(1166,426,12,82,M.iron);
 L(1171,437,1129,400,7,M.chrome);L(1171,437,1210,400,7,M.chrome);
 // Eastern clean-room biocustody and deep quarantine clinic.
 R(1410,379,212,12,M.titanium);R(1410,390,13,73,M.steel);
 R(1441,421,71,36,M.ceramic);R(1454,430,14,21,M.blue);
 R(1530,416,66,40,M.white);R(1546,428,17,17,M.signal);
 R(1650,469,71,8,M.iron);L(1671,470,1637,440,10,M.chrome);
 R(1505,370,82,30,0); // roof hatch opens room to accessible exterior
 // Far-right evacuation ferry and mast signal.
 R(1807,513,177,12,M.titanium);R(1811,525,12,55,M.iron);
 R(1842,547,62,28,M.black);R(1850,555,19,12,M.blue);
 R(1927,541,43,32,M.ceramic);R(1936,552,14,12,M.signal);
 R(1968,512,11,62,M.chrome);
 L(1971,514,2023,447,10,M.iron);R(2012,436,12,15,M.amber);
 // Five DIFFERENT ground-coupled underground apparatus.
 R(177,672,56,25,M.ceramic);R(190,680,16,14,M.blue);
 R(261,660,55,39,M.black);R(271,676,12,19,M.amber);
 R(615,713,37,33,M.ceramic);R(624,722,16,18,M.signal);
 R(683,705,37,40,M.black);R(695,713,10,28,M.blue);
 R(1036,746,56,31,M.black);R(1049,754,13,19,M.amber);
 R(1120,731,43,42,M.ceramic);R(1131,741,15,20,M.signal);
 R(1468,709,62,32,M.ceramic);R(1481,719,18,16,M.blue);
 R(1559,710,46,28,M.black);R(1568,719,13,14,M.amber);
 R(1854,794,51,35,M.black);R(1865,801,13,20,M.signal);
 R(1928,792,44,36,M.ceramic);R(1942,802,10,20,M.blue);
 // Open-ended scaffolds for future SWARM/Painter extension, not completed rooms.
 R(819,630,82,8,M.steel);L(819,636,786,531,10,M.iron);
 R(1265,601,95,9,M.titanium);L(1269,601,1215,515,9,M.iron);
 R(1698,623,91,8,M.iron);L(1712,627,1663,465,9,M.chrome);
 R(1297,580,65,73,0); // leave damaged crane-side flyable gap
 R(1724,601,63,68,0); // broken deep-truss gap allows local recovery
 for(const [x,y] of [[184,447],[300,445],[590,520],[688,519],[984,502],
 [1179,502],[1447,451],[1592,451],[1852,570],[1981,567]])R(x,y,5,7,M.signal);
 const sites={
 "West triage arrival":[205,408],"West medical bay":[279,412],"West side apron":[451,404],
 "West low vault":[239,652],"West vault outlet":[452,666],
 "Second island air gate":[545,396],"Thermal assay":[677,419],"Second underpass":[514,627],
 "Second deep lab":[666,685],"Second eastern saddle":[842,432],
 "Broken transfer inspection":[673,268],"West transit lookout":[412,268],
 "Crane control":[1135,392],"Crane lift station":[1001,393],
 "Crane hook approach":[1276,373],"Central instrument vault":[1074,714],
 "Central eastern bore":[1308,696],"Central western crossing":[915,622],
 "Fourth island biocustody":[1534,389],"Quarantine dispatch":[1570,407],
 "Fourth deep clinic":[1512,677],"Fourth eastern portal":[1757,666],
 "Outer beacon launch":[1903,467],"Ferry freight":[1965,485],
 "Far east deep shelter":[1907,772],"Last western slot":[1728,698],
 "High overflight":[1131,109],"Deep canyon bypass":[899,786],
 "West boundary scan":[45,720],"East boundary scan":[2010,370],
 "Upper sky return":[805,191]
 };
 // Source-authored ground pins: remaining bridge limbs, roof and ore cassettes.
 R(945,305,12,271,M.iron);
 R(560,308,12,330,M.iron);R(743,288,7,14,M.iron);R(1615,380,9,98,M.steel);
 R(277,693,11,14,M.iron);R(697,738,8,15,M.iron);R(1146,766,8,15,M.iron);R(1570,733,8,17,M.iron);R(1948,821,8,14,M.iron);
 R(839,268,83,210,0); // Midge-class rescue gap through damaged tram and cable diagonal
 // Midge 31x27 keepouts at exact named locations, no target substitutions.
 for(const p of Object.values(sites))R(p[0]-19,p[1]-17,39,35,0);
 // Remove only unreachable as-yet uncommitted prototype fragments.
 let seen=new Uint8Array(N),q=new Int32Array(N),removed=0,removedGroups=0;
 for(let k=0;k<N;k++)if(g[k]&&!seen[k]){
  let h=0,t=1,edge=false;seen[k]=1;q[0]=k;
  while(h<t){let a=q[h++],x=a%W,y=(a/W)|0;if(!x||x===W-1||!y||y===H-1)edge=true;
   for(let n of [a-W,a+W,x?a-1:-1,x<W-1?a+1:-1])if(n>=0&&n<N&&g[n]&&!seen[n]){seen[n]=1;q[t++]=n;}
  }
  if(!edge){removedGroups++;removed+=t;for(let z=0;z<t;z++)g[q[z]]=0;}
 }
 let r2Features={west_medical:0,thermal_assay:0,central_crane:0,biocustody:0,departure:0,subsurface_workfaces:0};
 for(const [name,x0,y0,x1,y1] of [
 ["west_medical",119,360,405,478],["thermal_assay",534,445,815,550],
 ["central_crane",990,155,1355,530],["biocustody",1393,370,1700,477],
 ["departure",1800,505,2030,599],["subsurface_workfaces",145,605,1995,839]]){
  for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(g[y*W+x]&&g[y*W+x]!==M.rock&&g[y*W+x]!==M.schist)r2Features[name]++;
 }
 let rect=[],prev=new Map(),hist={},area=0,replay=new Uint8Array(N);
 for(let y=0;y<H;y++){let next=new Map(),b=y*W;for(let x=0;x<W;){let m=g[b+x],s=x;while(x<W&&g[b+x]===m)x++;if(!m)continue;let key=s+":"+(x-s)+":"+m,i=prev.get(key);if(i===undefined){i=rect.length;rect.push([s,y,x-s,1,m]);}else rect[i][3]++;next.set(key,i);}prev=next;}
 for(let [x,y,w,h,m] of rect){area+=w*h;hist[m]=(hist[m]||0)+w*h;for(let j=y;j<y+h;j++)replay.fill(m,j*W+x,j*W+x+w);}
 if(rect.length>32768||area>32000000)throw Error("Source limits exceeded "+rect.length);
 for(let i=0;i<N;i++)if(g[i]!==replay[i])throw Error("Lossless replay mismatch "+i);
 function flood(w,h,box){
  let src=g;if(box){src=g.slice();for(let y=box[1];y<box[3];y++)src.fill(M.wall,y*W+box[0],y*W+box[2]);}
  let iw=W+1,ii=new Int32Array((W+1)*(H+1));
  for(let y=1;y<=H;y++){let sum=0;for(let x=1;x<=W;x++){sum+=(src[(y-1)*W+x-1]!==0)?1:0;ii[y*iw+x]=ii[(y-1)*iw+x]+sum;}}
  let hw=w>>1,hh=h>>1;function clear(x,y){let a=x-hw,b=y-hh,c=a+w,d=b+h;return a>=0&&b>=0&&c<=W&&d<=H&&ii[d*iw+c]-ii[d*iw+a]-ii[b*iw+c]+ii[b*iw+a]===0;}
  let pass=new Uint8Array(N),vis=new Uint8Array(N),queue=new Int32Array(N),h0=0,t0=0;
  for(let y=hh;y<H-hh;y++)for(let x=hw;x<W-hw;x++)if(clear(x,y))pass[y*W+x]=1;
  let [sx,sy]=sites["West triage arrival"],si=sy*W+sx;if(!pass[si])throw Error("Blocked spawn");
  vis[si]=1;queue[t0++]=si;
  while(h0<t0){let a=queue[h0++],x=a%W,n=a-W;if(n>=0&&pass[n]&&!vis[n]){vis[n]=1;queue[t0++]=n;}
   n=a+W;if(n<N&&pass[n]&&!vis[n]){vis[n]=1;queue[t0++]=n;}
   n=a-1;if(x>0&&pass[n]&&!vis[n]){vis[n]=1;queue[t0++]=n;}
   n=a+1;if(x<W-1&&pass[n]&&!vis[n]){vis[n]=1;queue[t0++]=n;}}
  let bad=Object.entries(sites).filter(([n,[x,y]])=>!vis[y*W+x]).map(([name,p])=>({name,xy:p,clear:clear(...p)}));
  return {envelope:[w,h],centres:t0,passed:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,bad};
 }
 let clearances=[[19,15],[23,19],[31,27]].map(v=>flood(...v));
 if(clearances.some(v=>v.bad.length))throw Error("Route failure "+JSON.stringify(clearances.map(z=>z.bad)));
 let obstacle=[653,249,694,290],blocked=flood(31,27,obstacle);
 if(blocked.bad.length!==1||blocked.bad[0].name!=="Broken transfer inspection")throw Error("Obstruction failed "+JSON.stringify(blocked.bad));
 let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:sites["West triage arrival"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
 let json=JSON.stringify(setup);if(json.length>1048576||Object.keys(setup).length!==14)throw Error("Setup violation "+json.length);
 // Index palette: each pixel sample is precisely one original stored material ID.
 function be(n){return[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255];}
 function crc(a){let c=0xffffffff;for(let v of a){c^=v;for(let j=0;j<8;j++)c=c>>>1^(0xedb88320&-(c&1));}return(c^0xffffffff)>>>0;}
 function chunk(name,d){let b=new Uint8Array(d.length+12);b.set(be(d.length));b.set(name.split("").map(c=>c.charCodeAt(0)),4);b.set(d,8);b.set(be(crc(b.subarray(4,d.length+8))),d.length+8);return b;}
 function rev(v,n){let z=0;while(n--){z=(z<<1)|(v&1);v>>>=1;}return z;}
 function zip(raw){let o=[120,1],bits=0,n=0;function wr(v,k){bits|=v<<n;n+=k;while(n>=8){o.push(bits&255);bits>>>=8;n-=8;}}
  function sym(s){let v,k;if(s<=143){v=48+s;k=8;}else if(s<=255){v=400+s-144;k=9;}else if(s<=279){v=s-256;k=7;}else{v=192+s-280;k=8;}wr(rev(v,k),k);}
  const lb=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],le=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
  function run(len){let a=0;while(a<28&&lb[a+1]<=len)a++;sym(a+257);if(le[a])wr(len-lb[a],le[a]);wr(0,5);}
  wr(1,1);wr(1,2);for(let i=0;i<raw.length;){let l=1;while(i+l<raw.length&&l<258&&raw[i+l]===raw[i])l++;if(l>=4&&i>0&&raw[i-1]===raw[i]){run(l);i+=l;}else{sym(raw[i]);i++;}}sym(256);if(n)o.push(bits&255);
  let a=1,b=0;for(let v of raw){a=(a+v)%65521;b=(b+a)%65521;}o.push(...be(((b<<16)|a)>>>0));return new Uint8Array(o);}
 let colors={0:[8,11,18],49:[70,83,99],58:[119,123,128],62:[126,141,153],63:[49,100,119],66:[74,85,93],68:[102,119,129],77:[55,243,228],79:[255,181,46],100:[54,56,61],101:[24,19,32],120:[156,210,220],121:[190,216,225],122:[226,236,244],129:[33,70,110],130:[52,56,63],131:[168,171,177]};
 let pal=new Uint8Array(132*3);for(let k=0;k<132;k++)pal.set(colors[k]||[100,100,100],3*k);
 function png(x0,y0,w,h){let raw=new Uint8Array((w+1)*h);for(let y=0;y<h;y++)raw.set(g.subarray((y+y0)*W+x0,(y+y0)*W+x0+w),y*(w+1)+1);
  let p=[new Uint8Array([137,80,78,71,13,10,26,10]),chunk("IHDR",new Uint8Array([...be(w),...be(h),8,3,0,0,0])),chunk("PLTE",pal),chunk("IDAT",zip(raw)),chunk("IEND",new Uint8Array())];
  let b=new Uint8Array(p.reduce((s,x)=>s+x.length,0)),i=0;for(let x of p){b.set(x,i);i+=x.length;}return b;}

 let crops=[["01-medical-transit",65,230,650,350],["02-west-deep-vaults",388,460,600,520],["03-salvage-crane",889,109,660,560],["04-quarantine-interchange",1320,338,720,478],["05-deep-service-rooms",940,563,970,450]];
 let images=[["overview.png",png(0,0,W,H)],...crops.map(([name,x,y,w,h])=>[name+".png",png(x,y,w,h)])];
 return {g,json,rect,hist,area,removed,removedGroups,sites,clearances,blocked,obstacle,crops,images,seed,r2Features};
};

const hash=function hash(b){if(typeof b==="string")b=Uint8Array.from(b,c=>c.charCodeAt(0));
 const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
 let n=(b.length+9+63)&~63,z=new Uint8Array(n);z.set(b);z[b.length]=128;let bits=b.length*8;for(let i=0;i<8;i++){z[n-1-i]=bits&255;bits=Math.floor(bits/256);}
 let h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64),rr=(v,n)=>(v>>>n)|(v<<(32-n));
 for(let off=0;off<n;off+=64){for(let j=0;j<16;j++){let i=off+j*4;w[j]=((z[i]<<24)|(z[i+1]<<16)|(z[i+2]<<8)|z[i+3])>>>0;}for(let j=16;j<64;j++){let p=w[j-15],q=w[j-2];w[j]=(w[j-16]+(rr(p,7)^rr(p,18)^(p>>>3))+w[j-7]+(rr(q,17)^rr(q,19)^(q>>>10)))>>>0;}
  let [a,b,c,d,e,f,g,k]=h;for(let j=0;j<64;j++){let t1=(k+(rr(e,6)^rr(e,11)^rr(e,25))+((e&f)^(~e&g))+K[j]+w[j])>>>0,t2=((rr(a,2)^rr(a,13)^rr(a,22))+((a&b)^(a&c)^(b&c)))>>>0;k=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0;}
  for(let j=0;j<8;j++)h[j]=(h[j]+[a,b,c,d,e,f,g,k][j])>>>0;}
 return h.map(v=>v.toString(16).padStart(8,"0")).join("");
};


const receipt=function receipt(b,hash){return {
 concept:"Orison Strand — Fracture-Island Salvage Exchange",
 lane:"original/scifi-frontier-wide",original_no_source:true,seed:b.seed,extent:[2048,1024],
 material_cell_count:b.g.length,engine_accepted_main:"f7e056c9b8791106e22f2d1c295043783d8a9701",
 map_repo_base:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",
 loader_source_max_rectangles:32768,loader_source_max_json_bytes:1048576,
 source_work_budget:32000000,
 material_rule_assumption:"All final nonzero cells drawn from current validated inert Solid/None native material palette; no powders, fluids, lava or acid.",
 material_histogram:b.hist,filled_grounded_cells:b.area,detached_final_cells:0,final_fluid_cells:0,
 prototype_disconnected_cells_removed:b.removed,prototype_components_removed:b.removedGroups,
 rectangle_count:b.rect.length,rectangle_work:b.area,setup_bytes:b.json.length,
 grid_sha256:hash(b.g),setup_sha256:hash(b.json),
 images:b.images.map(([name,z])=>({name,bytes:z.length,sha256:hash(z)})),
 clearance:b.clearances,
 obstruction:{xyxy_halfopen:b.obstacle,material_id:58,purpose:"Physically obstruct the isolated damaged-rail inspection destination; preserve all other named sites",result:b.blocked},
 named_sites:b.sites,literal_actor_spawn:b.sites["West triage arrival"],crops:b.crops,
 surviving_functional_footprints:b.r2Features,
 static_status:"CREATOR-STATIC-PASS",native_status:"NATIVE-UNTESTED",
 independent_reviews:"Independent exact-HEAD Art/Technical/Shepherd pending",
 creator_revision:"First source-authored fracture-island/multi-settlement salvage interchange, 2026-11-21"
};};
const exemplar=function exemplar(b,hash){return {
 schema_version:1,purpose:["human_editable_canvas","procedural_exemplar","scripted_setpiece_source"],
 family:"original/scifi-frontier-wide",anchor_donors:[],
 map_role:"fractured volcanic island chain with five rooted settlements, deliberately broken tram cantilevers, central crane, enterable side-cut service vaults and flight-scale rescue byways",
 macro_topology:"five floor-rooted geological island-mesas separated by actual air ravines, with two fragmented high transit spans and one immense asymmetrical crane",
 density_profile:"clustered workface modules alternate with large open air and rock voids; five usable underground rooms and three incomplete expansion interfaces",
 route_grammar:{spawn:"West triage arrival",primary:"western med-bay to thermal audit and salvage crane through eastern bioquarantine to rescue ferry",alternatives:["elevated open-sky flight over broken beams","ravine underflight and side-cut vault entrances","southbound deep bypass with reversible canyon climbs"],named_sites:Object.keys(b.sites).length,obstruction:{site:"Broken transfer inspection",box:b.obstacle,unaffected_reachable:b.blocked.passed}},
 strong_motifs:["asymmetric basalt islands under five settlement deck elevations","two realistically fractured tram limbs with independent piers","crane mast/jib with anchored triangulated load-path","entered underground rock-cut instrument vaults","five district-specific machinery silhouettes","exposed lateral recovery corridors and incomplete scaffold seams"],
 interesting_relationships:["slender transit components root into geological islands rather than float in air","the interrupted high route is optional for a flight actor and the canyons have deep return options","inhabited settlements sit above useful but separately accessible rock-cut rooms","the giant crane creates a dominant vertical movement landmark above a salvage yard"],
 authoring_affordances:["sheared tram ends can accept a destructible span","an open crane loading pocket has unused machinery slots","unfurnished geothermal assay space can receive hand-authored NPC/parts","eastern deep support stub can become a future attached world area"],
 setpiece_candidates:[
 {name:"Damaged high tram interruption",area:[440,230,910,370],event_type:"bridge failure or chase/rejoin",scripted:false},
 {name:"Heavy crane lift",area:[1000,145,1360,530],event_type:"crane activation and rescue",scripted:false},
 {name:"Eastern quarantine withdrawal",area:[1380,370,1750,740],event_type:"holdout with deep escape",scripted:false},
 {name:"Departure ferry arrival",area:[1790,435,2045,620],event_type:"landing/rescue",scripted:false}],
 procedural_exemplar_value:"An example-derived generator can infer fragmented transit assemblies rooted by differing local geological supports, five nonuniform settlement nodes, deliberate traversable ravine gaps, and rejoinable underground chamber modules.",
 similarity_avoidance:"Contrasts with Nivelle's roof-hung settlements and counterweights, Cairnstep's descending terrace cascade, Copperwake's enclosed connected cavern network, and Penumbral's annular reflector: five isolated-in-profile mesa settlements with disconnected tram spans and a single central mechanical crane.",
 diversity_axes:{macro_topology:"islands",altitude_grammar:"multi_strata",density_cadence:"alternating",route_structure:"branch_rejoin",landmark_family:"crane",support_form:"floor_rooted",environment_relation:"geological",incompleteness:"damaged"},
 native_status:"NATIVE-UNTESTED",source_grid_sha256:hash(b.g)
};};
const fs=require("fs"),path=require("path"),a=build(),r=receipt(a,hash),e=exemplar(a,hash);
let ok=true;for(let [name,data] of [["setup.json",a.json],["receipt.json",JSON.stringify(r,null,2)+"\n"],["exemplar.json",JSON.stringify(e,null,2)+"\n"],...a.images]){
 let expected=typeof data==="string"?Buffer.from(data,"utf8"):Buffer.from(data),f=path.join(__dirname,name);
 if(process.argv.includes("--verify")){if(!fs.existsSync(f)||!expected.equals(fs.readFileSync(f))){console.error("MISMATCH "+name);ok=false;}}else fs.writeFileSync(f,expected);}
console.log(JSON.stringify({cells:a.g.length,rectangles:a.rect.length,grounded:a.area,sites:Object.keys(a.sites).length,obstruction:a.blocked.bad,sha256:r.grid_sha256,verified:ok}));if(!ok)process.exit(1);
