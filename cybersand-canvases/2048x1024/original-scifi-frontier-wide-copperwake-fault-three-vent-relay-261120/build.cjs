"use strict";
// Original Copperwake Fault deterministic material-cell authoring, no reference art.
const fs=require("fs"),path=require("path");
const build=function build(){
 const W=2048,H=1024,N=W*H,g=new Uint8Array(N),seed=0xC0F001;
 const M={rock:100,schist:101,iron:49,steel:62,titanium:68,blue:63,conduit:66,glass:120,white:121,quartz:122,black:129,ceramic:130,chrome:131,amber:79,signal:77,wall:58};
 function R(x,y,w,h,m){let a=Math.max(0,Math.round(x)),b=Math.min(W,Math.round(x+w)),c=Math.max(0,Math.round(y)),d=Math.min(H,Math.round(y+h));if(a>=b||c>=d)return;for(let k=c;k<d;k++)g.fill(m,k*W+a,k*W+b);}
 function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,r=t/2;for(let j=Math.max(0,Math.floor(Math.min(y,Y)-r));j<Math.min(H,Math.ceil(Math.max(y,Y)+r)+1);j++)for(let i=Math.max(0,Math.floor(Math.min(x,X)-r));i<Math.min(W,Math.ceil(Math.max(x,X)+r)+1);i++){let v=Math.max(0,Math.min(1,((i-x)*dx+(j-y)*dy)/(d||1)));if((i-x-v*dx)**2+(j-y-v*dy)**2<=r*r)g[j*W+i]=m;}}


 // COPPERWAKE FAULT: three nested, differently sized underground caverns,
 // sky vents, bore connectors and a continuous dry deep-return braid.
 for(let x=0;x<W;x+=8){let y=223+Math.round(18*Math.sin(x*.009)+9*Math.sin(x*.031));R(x,y,8,H-y,M.rock);}
 R(0,971,W,53,M.schist);
 for(let j=0;j<5;j++)L(0,321+j*125,2047,282+j*115,6,j%2?M.schist:M.iron);
 for(let x of [505,1454])L(x,230,x+110,1023,11,M.schist);
 function E(cx,cy,rx,ry){for(let y=cy-ry;y<=cy+ry;y++){let k=1-((y-cy)/ry)**2;if(k>=0){let dx=Math.floor(rx*Math.sqrt(k));R(cx-dx,y,dx*2+1,1,0);}}}
 E(346,438,286,186);E(1035,502,368,224);E(1722,426,289,190);
 R(548,428,238,112,0);R(1319,433,230,116,0);
 R(172,812,1704,110,0);R(225,540,126,320,0);R(986,627,125,235,0);R(1660,537,131,318,0);
 for(let [x,y,w,h] of [[400,758,257,90],[785,752,174,100],[1200,750,245,96],[1530,750,190,93]])R(x,y,w,h,0);
 R(1850,555,102,289,0);R(243,0,125,366,0);R(982,0,133,347,0);R(1703,0,126,363,0);
 // West living ledges and fail-safe lift supports physically bonded outside its vent shaft.
 R(177,563,275,14,M.steel);R(405,577,17,160,M.iron);R(178,575,12,84,M.steel);
 R(195,552,86,8,M.ceramic);R(237,516,26,36,M.black);R(247,520,8,17,M.amber);
 R(310,558,72,9,M.titanium);R(327,528,17,29,M.ceramic);L(344,540,381,520,7,M.chrome);
 R(391,551,62,9,M.iron);R(415,518,11,33,M.chrome);R(426,515,29,7,M.titanium);
 // First bore boasts an asymmetric articulated fault-jaw.
 L(566,412,664,332,13,M.steel);L(664,332,735,404,12,M.titanium);
 L(576,420,732,422,7,M.chrome);R(645,409,13,12,M.amber);
 // Central paired assay and archive workstations leave central shaft clear.
 R(806,653,156,13,M.steel);R(845,665,17,100,M.iron);R(934,666,16,98,M.titanium);
 R(828,622,41,28,M.black);R(874,615,53,34,M.ceramic);
 for(let j=0;j<5;j++)R(881+j*9,622,5,16,j%2?M.blue:M.white);
 R(1173,650,151,13,M.steel);R(1191,663,15,90,M.iron);R(1304,663,14,105,M.steel);
 for(let j=0;j<5;j++){R(1211+j*20,622,14,27,M.ceramic);R(1214+j*20,628,7,10,j%2?M.blue:M.amber);}
 // Three vent scaffolds rooted into rock sidewalls, not simulated hanging bodies.
 for(let [x,y] of [[197,210],[943,208],[1664,210]]){R(x,y,28,19,M.iron);R(x+11,y-66,9,66,M.steel);R(x+4,y-73,25,10,M.chrome);}
 // B/C diaphragm is a compression arch rather than a mirrored sail.
 L(1360,418,1450,366,20,M.iron);L(1450,366,1540,424,18,M.steel);R(1442,356,16,16,M.amber);
 // East contamination, salvage, dispatch: functionally distinct side bays.
 R(1503,559,159,13,M.steel);R(1541,571,17,97,M.iron);
 R(1527,530,26,28,M.black);for(let j=0;j<4;j++){R(1560+j*20,529,13,29,M.ceramic);R(1563+j*20,537,7,12,M.blue);}
 R(1802,557,170,13,M.titanium);R(1893,571,16,110,M.steel);
 R(1835,524,52,30,M.black);R(1854,531,11,14,M.amber);L(1897,549,1931,523,9,M.chrome);
 // Four actual workface families tied to deep rock floor.
 R(375,910,211,13,M.steel);R(392,884,20,26,M.iron);R(432,875,15,35,M.chrome);
 R(463,879,62,12,M.ceramic);for(let j=0;j<5;j++)R(469+j*10,891,7,19,j%2?M.amber:M.blue);
 R(795,910,165,12,M.titanium);R(826,881,36,28,M.black);R(839,886,11,18,M.white);
 R(875,871,49,12,M.iron);L(898,884,935,905,10,M.chrome);
 R(1169,910,183,12,M.steel);R(1192,876,57,33,M.ceramic);
 for(let j=0;j<5;j++)R(1199+j*10,884,6,16,j%2?M.blue:M.white);
 L(1255,903,1305,863,10,M.chrome);R(1285,852,37,14,M.amber);
 R(1510,910,245,12,M.iron);R(1533,881,68,27,M.black);
 R(1552,889,25,11,M.amber);L(1626,902,1692,860,11,M.chrome);R(1678,851,35,11,M.titanium);
 // Deliberately unfilled editing bays and bridge-failure/holdout staging voids.
 R(626,775,88,70,0);R(1378,770,104,76,0);

 // Purposeful physical load paths: separated fault-roof masses carry loads to rooted bedrock.
 // Each new pier is a proposed obstruction/set-piece; upper and lower braids are still tested.
 R(627,407,19,343,M.rock);
 R(1434,410,20,355,M.rock);
 // Slender tension bridge ties central under-roof substrate to rooted eastern abutment.
 R(1406,763,623,12,M.steel);
 // Furniture support bolts physically link inert housings to their load decks.
 for(let [x,y,w,h] of [[246,543,5,19],[335,550,6,15],[419,544,6,16],
 [845,649,7,14],[882,642,7,14],[1193,640,8,15],[1220,646,7,13],
 [1538,551,7,12],[1570,550,7,11],[1848,549,7,12],[1865,549,7,13],
 [830,902,7,10],[1199,904,7,10],[1540,902,7,10]])R(x,y,w,h,M.chrome);
 const sites={
 "West airlock":[191,417],"West clinic":[364,417],"West nursery":[456,370],
 "West overhead":[332,307],"West spare bay":[465,496],"West shaft foot":[317,544],
 "West sky vent":[302,232],"West surface":[132,121],"Surface transit":[649,127],
 "Mid upper intake":[1040,240],"Mid roof gallery":[1053,354],
 "West transfer":[675,476],"Mid assay":[833,478],"Relay cradle":[1040,486],
 "Mid archive":[1199,494],"Mid garden":[970,600],
 "Mid shaft return":[1046,700],"Mid deep return":[1044,844],
 "East transfer":[1476,477],"East quarantine":[1598,426],
 "East rover service":[1851,427],"East lift staging":[1715,544],
 "East sky vent":[1768,234],"East lookout":[1919,375],
 "East surface":[1917,125],"Deep west return":[287,846],
 "Deep ore sieve":[518,845],"Deep relay buffer":[902,847],
 "Deep assay sampler":[1315,845],"Deep freight":[1647,845],
 "Deep exit":[1813,845],"West low bypass":[629,844],
 "East low bypass":[1418,844]
 };
 // Exactly bounded keepouts: centres never shifted. Keep machinery elsewhere.
 for(let [,p] of Object.entries(sites))R(p[0]-19,p[1]-17,39,35,0);
 // Every final feature must survive physical grounding; disconnected prototypes are removed.
 let seen=new Uint8Array(N),q=new Int32Array(N),removed=0,removedGroups=0;
 for(let k=0;k<N;k++)if(g[k]&&!seen[k]){
  let h=0,t=1,edge=false;seen[k]=1;q[0]=k;
  while(h<t){let a=q[h++],x=a%W,y=(a/W)|0;if(!x||x===W-1||!y||y===H-1)edge=true;
   for(let n of [a-W,a+W,x?a-1:-1,x<W-1?a+1:-1])if(n>=0&&n<N&&g[n]&&!seen[n]){seen[n]=1;q[t++]=n;}
  }
  if(!edge){removedGroups++;removed+=t;for(let z=0;z<t;z++)g[q[z]]=0;}
 }

 let r2Features={};
 for(let [name,x0,y0,x1,y1,needed] of [
 ["West living",170,510,475,741,400],["Mid assay",805,610,965,790,300],
 ["Mid archive",1170,610,1340,790,300],["East sterile",1500,515,1670,690,300],
 ["East freight",1800,513,1985,690,300],["Deep loop",370,865,1760,946,1200]]){
  let n=0,hist={};for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){
   let m=g[y*W+x];if(m&&m!==M.rock&&m!==M.schist){n++;hist[m]=(hist[m]||0)+1;}}
  if(n<needed||Object.keys(hist).length<3)throw Error("Lost module "+name+" "+n+" "+Object.keys(hist).length);
  r2Features[name]={nongeological_cells:n,histogram:hist};
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
  let [sx,sy]=sites["West airlock"],si=sy*W+sx;if(!pass[si])throw Error("Blocked spawn");
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
 let obstacle=[1014,457,1067,512],blocked=flood(31,27,obstacle);
 if(blocked.bad.length!==1||blocked.bad[0].name!=="Relay cradle")throw Error("Obstruction failed "+JSON.stringify(blocked.bad));
 let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:sites["West airlock"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
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

 let crops=[["01-west-colony",80,265,540,425],["02-mid-relay",718,276,680,500],
 ["03-east-quarantine",1476,242,572,465],["04-deep-return",338,744,1420,240],
 ["05-upper-vent-network",174,0,1670,330]];
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

const receipt=function receipt(a,sha){return {
 concept:"Copperwake Fault — Three-Vent Relay Colonies",lane:"original/scifi-frontier-wide",original_no_source:true,seed:a.seed,
 extent:[2048,1024],material_cell_count:a.g.length,
 engine_accepted_main:"de58bf1997ca75825cf3b29e046dc1c1022c45bf",map_repo_base:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",
 loader_source_max_rectangles:32768,loader_source_max_json_bytes:1048576,source_work_budget:32000000,
 material_rule_assumption:"Only inert immovable Solid/None accepted kernels; no powders or liquids",
 material_histogram:a.hist,filled_grounded_cells:a.area,detached_final_cells:0,
 prototype_disconnected_cells_removed:a.removed,prototype_components_removed:a.removedGroups,
 rectangle_count:a.rect.length,rectangle_work:a.area,setup_bytes:a.json.length,
 grid_sha256:sha(a.g),setup_sha256:sha(a.json),
 images:a.images.map(([name,b])=>({name,bytes:b.length,sha256:sha(b)})),
 clearance:a.clearances,obstruction:{xyxy_halfopen:a.obstacle,material_id:58,purpose:"Blocks only Relay cradle; all named alternatives remain",result:a.blocked},
 named_sites:a.sites,literal_actor_spawn:a.sites["West airlock"],crops:a.crops,
 feature_survival:a.r2Features,static_status:"CREATOR-STATIC-PASS",native_status:"NATIVE-UNTESTED",
 independent_reviews:"Exact-HEAD independent Art/Tech/Shepherd pending",
 creator_revision:"New nested-cavern three-vent fault-colony exemplar, 2026-11-20"};};
const a=build(),r=receipt(a,hash);let ok=true;
for(const [name,data] of [["setup.json",a.json],["receipt.json",JSON.stringify(r,null,2)+"\n"],...a.images]){let expected=typeof data==="string"?Buffer.from(data,"utf8"):Buffer.from(data),f=path.join(__dirname,name);if(process.argv.includes("--verify")){if(!fs.existsSync(f)||!expected.equals(fs.readFileSync(f))){console.error("MISMATCH "+name);ok=false;}}else fs.writeFileSync(f,expected);}
console.log(JSON.stringify({cells:a.g.length,rectangles:a.rect.length,solid:a.area,sites:Object.keys(a.sites).length,obstruction:a.blocked.bad,hash:r.grid_sha256,verified:ok}));if(!ok)process.exit(1);
