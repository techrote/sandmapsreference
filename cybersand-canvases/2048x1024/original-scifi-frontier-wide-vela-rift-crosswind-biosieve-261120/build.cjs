"use strict";
// Original Vela Rift deterministic material-cell authoring, no reference art.
const fs=require("fs"),path=require("path");
const build=function build(){
 const W=2048,H=1024,N=W*H,g=new Uint8Array(N),seed=0xB1051E;
 const M={rock:100,schist:101,iron:49,steel:62,titanium:68,blue:63,conduit:66,glass:120,white:121,quartz:122,black:129,ceramic:130,chrome:131,amber:79,signal:77,wall:58};
 function R(x,y,w,h,m){let a=Math.max(0,Math.round(x)),b=Math.min(W,Math.round(x+w)),c=Math.max(0,Math.round(y)),d=Math.min(H,Math.round(y+h));if(a>=b||c>=d)return;for(let k=c;k<d;k++)g.fill(m,k*W+a,k*W+b);}
 function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,r=t/2;for(let j=Math.max(0,Math.floor(Math.min(y,Y)-r));j<Math.min(H,Math.ceil(Math.max(y,Y)+r)+1);j++)for(let i=Math.max(0,Math.floor(Math.min(x,X)-r));i<Math.min(W,Math.ceil(Math.max(x,X)+r)+1);i++){let v=Math.max(0,Math.min(1,((i-x)*dx+(j-y)*dy)/(d||1)));if((i-x-v*dx)**2+(j-y-v*dy)**2<=r*r)g[j*W+i]=m;}}

 // Vela Rift. This entirely new source geometry is drafted as actual material cells:
 // dual anchored wind-sieves, crew laboratories, sample transfer, dry recovery trench.
 for(let y=342;y<948;y+=12){let left=440-Math.floor((y-342)*.08)+Math.round(9*Math.sin(y*.035)),right=1600+Math.floor((y-342)*.10)+Math.round(11*Math.sin(y*.027));
  R(0,y,left,12,M.rock);R(right,y,W-right,12,M.rock);}
 for(let x=0;x<W;x+=24){let y=941+Math.round(5*Math.sin(x*.019)+4*Math.sin(x*.038));R(x,y,24,H-y,M.rock);R(x,y+48,24,H-y-48,M.schist);}
 // Physically excavated place-sized rooms, generous flyable access and a deep dry bypass.
 for(let y of [390,531,681]){R(65,y,472,99,0);R(1503,y,474,100,0);}
 R(404,346,147,573,0);R(1493,345,141,574,0);
 R(434,803,1166,112,0);
 for(let y of [491,631,782]){R(0,y,432,11,M.steel);R(1614,y,434,11,M.titanium);}
 for(let x of [567,766,975,1184,1389])R(x,923,141,14,M.steel);
 // Human-scale west seed culture, microscopy assay and rover repair, all with floor-foot bonds.
 R(226,471,155,12,M.steel);for(let x of [236,271,306,341]){R(x,443,15,29,M.ceramic);R(x+4,449,7,16,M.black);R(x+5,437,5,7,M.signal);}
 R(235,479,12,25,M.iron);R(346,479,12,25,M.iron);
 R(228,609,150,12,M.chrome);R(252,581,69,27,M.black);R(274,571,12,10,M.amber);
 for(let x of [333,354]){R(x,568,13,39,M.blue);R(x+3,580,7,14,M.white);}
 R(335,603,11,10,M.blue);R(355,603,11,10,M.blue);R(235,618,12,25,M.steel);R(350,618,12,25,M.steel);
 R(231,754,146,13,M.titanium);L(301,753,329,730,9,M.chrome);R(303,719,57,14,M.black);
 R(240,766,12,27,M.steel);R(355,765,12,27,M.steel);
 // East sterile isolation, classifier and export crane; unlike west machinery.
 R(1697,469,145,12,M.steel);R(1710,422,12,46,M.iron);R(1730,425,94,31,M.black);
 for(let x of [1739,1768,1797]){R(x,433,10,19,M.blue);R(x+3,437,5,10,M.signal);}
 R(1706,479,12,22,M.iron);R(1824,480,12,22,M.iron);
 R(1696,608,150,13,M.ceramic);for(let x of [1715,1744,1773,1802]){R(x,576,13,31,M.blue);R(x+3,585,7,15,M.white);}
 R(1708,619,12,23,M.steel);R(1822,620,12,23,M.steel);
 R(1696,755,155,12,M.iron);L(1775,754,1800,732,9,M.chrome);R(1779,707,55,9,M.amber);
 R(1704,766,12,26,M.steel);R(1833,766,12,26,M.steel);
 // Giant non-repeating sails rooted in opposite cliff walls; 2D silhouette, no perspective.
 L(409,364,626,215,26,M.steel);L(626,215,835,467,27,M.titanium);
 L(415,412,676,294,14,M.chrome);L(676,294,831,485,14,M.iron);
 L(516,332,745,402,12,M.iron);
 for(let j=0;j<8;j++){let x=632+j*20,y=238+j*26;L(x,y,x+58,y+5,9,j%2?M.blue:M.white);L(x+58,y+6,x+72,y+24,6,M.chrome);}
 L(1636,366,1392,249,31,M.iron);L(1392,249,1209,479,29,M.steel);
 L(1628,415,1451,304,12,M.chrome);L(1451,304,1228,493,13,M.titanium);
 for(let j=0;j<8;j++){let x=1383-j*22,y=259+j*27;L(x,y,x-52,y+5,9,j%2?M.blue:M.ceramic);R(x-30,y-3,10,10,M.amber);}
 // Suspended but *grounded through the sail frames* custody transect.
 L(829,459,911,666,20,M.steel);L(1212,477,1146,663,21,M.titanium);
 L(841,469,935,635,9,M.chrome);L(1200,485,1122,638,9,M.chrome);
 R(907,660,243,12,M.steel);R(925,667,12,43,M.titanium);R(1130,667,12,43,M.steel);
 R(945,647,60,10,M.ceramic);R(954,634,28,12,M.amber);
 L(1005,642,1023,624,9,M.chrome);R(1022,618,37,15,M.black);
 L(1062,635,1095,647,9,M.chrome);R(1090,647,47,11,M.ceramic);R(1101,635,24,12,M.white);
 // Four entered, different-function deep work stations; actual cell materials.
 R(583,910,117,14,M.iron);L(599,906,650,874,12,M.chrome);R(652,865,35,12,M.amber);
 R(787,909,110,13,M.titanium);for(let j=0;j<6;j++){R(798+j*16,880,9,28,M.blue);R(800+j*16,889,5,12,M.white);}
 R(997,909,114,13,M.ceramic);for(let j=0;j<8;j++){let t=j*Math.PI/4;L(1052,876,1052+26*Math.cos(t),876+24*Math.sin(t),7,M.chrome);}R(1042,867,21,19,M.amber);
 R(1203,909,129,13,M.steel);R(1224,885,29,23,M.black);L(1264,906,1315,859,11,M.chrome);R(1302,853,24,11,M.white);
 R(1406,907,105,12,M.iron);L(1432,906,1472,866,9,M.chrome);R(1457,863,35,9,M.titanium);
 for(let x of [591,791,1003,1208,1412])R(x,912,11,49,M.steel);
 // Two deliberately engineered access gaps in left grounded sieve and tether.
 R(721,338,83,82,0);R(850,556,65,66,0);
 // Physical gameplay graph: all named checkpoints are literal unmodified centre positions.
 const sites={
  "West rover spawn":[151,435],"West nursery":[390,435],
  "West sample lab":[153,576],"West classifier":[390,580],
  "West rover bay":[152,729],"West service hatch":[388,732],
  "West recovery throat":[496,707],"West upper survey":[625,157],
  "Left sail viewport":[830,527],"Lower west sail":[784,731],
  "High open canopy":[1043,153],"Filter custody":[1035,570],
  "East sail viewport":[1223,527],"East upper survey":[1438,162],
  "Lower east sail":[1290,725],"East recovery throat":[1542,700],
  "East sterile lock":[1910,433],"East isolation":[1647,433],
  "East classifier":[1908,579],"East spectrometry":[1643,579],
  "East cargo receiver":[1913,729],"East dispatch":[1645,729],
  "Understrata west":[562,843],"Core sampling":[682,849],
  "Membrane drive":[869,849],"Rotor processor":[1092,849],
  "Archive crane":[1288,850],"Return hoist":[1494,846],
  "Understrata east":[1554,846]
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
 for(let [name,x0,y0,x1,y1,need] of [
 ["west culture",215,433,382,505,400],["west assay",215,560,381,643,450],
 ["west rover",219,703,388,795,400],["east quarantine",1690,413,1856,506,500],
 ["east scan",1690,564,1852,649,400],["east freight",1690,705,1852,796,400],
 ["left sail",590,210,905,513,3000],["right sail",1180,240,1460,530,3000],
 ["centre custody",904,605,1153,720,450],["deep recovery",565,853,1520,952,2400]]){
  let hist={},count=0;for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){let m=g[y*W+x];if(!m||m===M.rock||m===M.schist)continue;hist[m]=(hist[m]||0)+1;count++;}
  const kinds=Object.keys(hist).length;
  if(count<need||kinds<3)throw Error("Functional workface lost "+name+": "+count+"/"+kinds);
  r2Features[name]={nongeological_cells:count,distinct_nonrock_materials:kinds,histogram:hist};
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
  let [sx,sy]=sites["West rover spawn"],si=sy*W+sx;if(!pass[si])throw Error("Blocked spawn");
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
 let obstacle=[1010,548,1059,597],blocked=flood(31,27,obstacle);
 if(blocked.bad.length!==1||blocked.bad[0].name!=="Filter custody")throw Error("Obstruction failed "+JSON.stringify(blocked.bad));
 let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:sites["West rover spawn"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
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
 let crops=[["01-west-bioscience-port",0,349,547,460],["02-crosswind-sails",515,147,1020,483],["03-central-custody",856,510,345,258],["04-east-quarantine-freight",1501,348,547,460],["05-understrata-facilities",511,797,1093,216]];
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
const receipt=function receipt(a,sha){return {concept:"Vela Rift - Crosswind Biosieve Research Yard",lane:"original/scifi-frontier-wide",original_no_source:true,seed:a.seed,extent:[2048,1024],material_cell_count:a.g.length,engine_accepted_main:"7b03aa437561ec63e31fd09531171360ab60eeb4",map_repo_base:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",loader_source_max_rectangles:32768,loader_source_max_json_bytes:1048576,source_work_budget:32000000,installed_bridge_legacy_capacity_risk:4096,material_rule_assumption:"Only accepted inert immovable Solid/None kernels; no powders or liquids",material_histogram:a.hist,filled_grounded_cells:a.area,detached_final_cells:0,prototype_disconnected_cells_removed:a.removed,prototype_components_removed:a.removedGroups,rectangle_count:a.rect.length,rectangle_work:a.area,setup_bytes:a.json.length,grid_sha256:sha(a.g),setup_sha256:sha(a.json),images:a.images.map(([name,b])=>({name,bytes:b.length,sha256:sha(b)})),clearance:a.clearances,obstruction:{xyxy_halfopen:a.obstacle,material_id:58,purpose:"Blocks only Filter custody",result:a.blocked},named_sites:a.sites,literal_actor_spawn:a.sites["West rover spawn"],crops:a.crops,static_status:"CREATOR-STATIC-PASS",native_status:"NATIVE-UNTESTED",independent_reviews:"Original new physical world, independent exact-head Art/Tech/Shepherd checks pending",r2_feature_survival:a.r2Features,creator_revision:"Original crosswind biofiltration research installation 2026-11-20"};};
const a=build(),r=receipt(a,hash);let ok=true;
for(const [name,data] of [["setup.json",a.json],["receipt.json",JSON.stringify(r,null,2)+"\n"],...a.images]){let expected=typeof data==="string"?Buffer.from(data,"utf8"):Buffer.from(data),f=path.join(__dirname,name);if(process.argv.includes("--verify")){if(!fs.existsSync(f)||!expected.equals(fs.readFileSync(f))){console.error("MISMATCH "+name);ok=false;}}else fs.writeFileSync(f,expected);}
console.log(JSON.stringify({cells:a.g.length,rectangles:a.rect.length,solid:a.area,sites:Object.keys(a.sites).length,obstruction:a.blocked.bad,hash:r.grid_sha256,verified:ok}));if(!ok)process.exit(1);
