"use strict";
// Pure original geometry; PNGs are generated from indexed material cells, not reference art.
const build=function build(){
 const W=2048,H=1024,N=W*H,g=new Uint8Array(N),seed=0xC41F21;
 const M={rock:100,schist:101,iron:49,steel:62,titanium:68,blue:63,conduit:66,glass:120,white:121,quartz:122,black:129,ceramic:130,chrome:131,amber:79,signal:77,wall:58};
 function R(x,y,w,h,m){let a=Math.max(0,Math.round(x)),b=Math.min(W,Math.round(x+w)),c=Math.max(0,Math.round(y)),d=Math.min(H,Math.round(y+h));if(a>=b||c>=d)return;for(let k=c;k<d;k++)g.fill(m,k*W+a,k*W+b);}
 function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,r=t/2;for(let j=Math.max(0,Math.floor(Math.min(y,Y)-r));j<Math.min(H,Math.ceil(Math.max(y,Y)+r)+1);j++)for(let i=Math.max(0,Math.floor(Math.min(x,X)-r));i<Math.min(W,Math.ceil(Math.max(x,X)+r)+1);i++){let v=Math.max(0,Math.min(1,((i-x)*dx+(j-y)*dy)/(d||1)));if((i-x-v*dx)**2+(j-y-v*dy)**2<=r*r)g[j*W+i]=m;}}



 // CAIRNSTEP DIVIDE: six asymmetrically grounded dry stepped research platforms.
 // Unlike nested caverns, exposed sails and ring monuments, geology sets an unequal cascade.
 function elevation(x){const a=[650,694,749,803,848,724],k=x<345?0:x<690?1:x<1040?2:x<1375?3:x<1715?4:5;
  return a[k]+Math.round(7*Math.sin(x*.021)+5*Math.sin(x*.065));}
 for(let x=0;x<W;x+=4){let y=elevation(x);R(x,y,4,H-y,(x/4|0)%19?M.rock:M.schist);}
 R(0,994,W,30,M.schist);
 function deck(x,y,w){R(x,y,w,12,M.steel);
  for(let p of [x+10,x+w-24]){let end=elevation(p)+16;R(p,y+8,14,end-y-8,M.iron);}}
 deck(100,558,235);deck(493,618,235);deck(835,672,251);
 deck(1194,724,235);deck(1573,763,223);deck(1859,682,163);
 // West medical/rover arrival hall, slotted real windows and no painted fake platform.
 R(110,475,170,9,M.titanium);R(110,477,13,81,M.iron);
 R(122,532,46,22,M.black);R(133,539,14,9,M.amber);
 R(191,525,43,28,M.ceramic);R(203,533,9,17,M.blue);
 R(254,529,42,24,M.white);
 for(let j=0;j<4;j++)R(139+j*37,549,11,7,j%2?M.signal:M.chrome);
 L(101,502,158,449,9,M.chrome);L(158,449,222,480,10,M.titanium);
 // First threshold gate: distinct diagonal arm and secondary side brace.
 L(326,558,396,461,17,M.steel);L(396,461,474,609,15,M.iron);
 R(390,449,17,21,M.amber);R(397,477,9,82,M.chrome);
 // Assay incubation, separately equipped from sorting and quarantine.
 R(507,532,175,9,M.titanium);R(506,533,13,85,M.iron);
 R(526,578,44,35,M.black);R(540,584,10,18,M.blue);
 R(598,573,65,39,M.ceramic);for(let j=0;j<5;j++)R(606+j*10,581,6,20,j%2?M.white:M.amber);
 R(687,581,24,29,M.chrome);L(667,525,706,489,10,M.titanium);
 // Central ore and xenoparticle separator: different 2-arm silhouette.
 R(850,587,195,9,M.steel);R(850,593,13,79,M.iron);
 R(868,639,53,28,M.black);R(884,645,13,11,M.amber);
 R(940,627,75,36,M.ceramic);R(953,636,17,17,M.blue);
 L(1015,634,1081,546,14,M.iron);L(1081,546,1138,609,10,M.titanium);
 R(1071,534,20,21,M.signal);
 // Biofilter is laterally asymmetric, with a deliberately vacant append bay.
 R(1209,637,160,9,M.titanium);R(1209,642,12,82,M.iron);
 R(1227,688,46,31,M.black);R(1237,694,11,17,M.blue);
 for(let j=0;j<5;j++){R(1283+j*16,685,10,32,M.ceramic);R(1285+j*16,691,5,15,j%2?M.amber:M.white);}
 L(1390,716,1454,599,14,M.steel);L(1454,599,1515,673,11,M.iron);
 R(1446,590,18,21,M.amber);
 // Quarantine scanning and independent sterile cargo receiver.
 R(1584,676,162,9,M.titanium);R(1584,680,13,83,M.steel);
 R(1608,726,47,33,M.black);R(1618,734,12,15,M.blue);
 R(1672,720,73,36,M.ceramic);for(let j=0;j<4;j++)R(1682+j*15,730,7,18,j%2?M.amber:M.chrome);
 R(1761,724,17,30,M.white);
 L(1558,757,1616,638,15,M.titanium);L(1616,638,1805,718,13,M.iron);
 R(1608,625,19,17,M.signal);
 // High eastern relief/medical embarkation rather than fifth repeated machine.
 R(1868,586,149,9,M.steel);R(1868,593,12,89,M.iron);
 R(1888,649,48,28,M.black);R(1902,654,15,14,M.signal);
 R(1949,632,56,40,M.ceramic);R(1961,638,11,25,M.blue);
 L(1881,585,1911,522,10,M.chrome);L(1911,522,1953,544,9,M.titanium);
 // Gallery-like lower verandas are currently edit-ready; no unreachable sites advertised.
 R(225,596,100,9,M.iron);R(239,603,13,65,M.titanium);
 R(593,655,94,8,M.steel);R(605,661,11,75,M.iron);
 R(931,709,93,8,M.titanium);R(950,715,13,54,M.steel);
 R(1291,758,106,9,M.iron);R(1302,764,11,55,M.titanium);
 R(1643,800,110,9,M.steel);R(1664,807,13,55,M.iron);
 // Tactile grounded fasteners, not loose falling terrain particles.
 for(let [x,y] of [[142,550],[210,548],[546,607],[622,606],[890,660],[966,659],
 [1241,711],[1339,710],[1625,752],[1710,751],[1905,674],[1970,672]])R(x,y,5,10,M.chrome);

 const sites={
 "West airlock":[186,508],"West clinic":[263,505],"West rover apron":[325,506],
 "West lookout":[354,342],"West baseline":[50,419],
 "First gate approach":[459,420],"Assay landing":[574,564],
 "Assay incubator":[675,561],"Assay weather deck":[714,439],
 "Mid ore sorting":[913,620],"Mid xenoparticle assay":[1009,612],
 "High mixing switch":[1002,346],"Mid transfer lookout":[1110,473],
 "Biofilter landing":[1272,662],"Biofilter test bay":[1378,658],
 "Second gate lookout":[1505,503],
 "Quarantine approach":[1640,602],"Sterile export":[1769,693],
 "Eastern relief dock":[1914,620],"Relief high balcony":[1980,563],
 "East relief lookout":[2020,418],"Upper overflight":[1070,210],
 "West upper loop":[620,270],"East upper loop":[1622,260]
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
 for(let [n,x0,y0,x1,y1] of [["west",100,470,334,650],["assay",495,520,729,682],["sorter",835,582,1086,728],["biofilter",1194,635,1429,774],["quarantine",1573,674,1796,814],["east",1859,585,2022,730]]){let t=0;for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(g[y*W+x]&&g[y*W+x]!==M.rock&&g[y*W+x]!==M.schist)t++;r2Features[n]=t;}
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
 let obstacle=[983,325,1021,365],blocked=flood(31,27,obstacle);
 if(blocked.bad.length!==1||blocked.bad[0].name!=="High mixing switch")throw Error("Obstruction failed "+JSON.stringify(blocked.bad));
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

 let crops=[["01-west-rover",70,356,610,370],["02-central-sorter",716,464,620,380],
 ["03-east-quarantine",1450,562,598,396],["04-terrace-verandas",250,590,1520,400],
 ["05-switchback-sky",300,220,1500,480]];
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


const receipt=function receipt(b,hash){return{
 concept:"Cairnstep Divide — Five-Tier Xenocascade Yard",lane:"original/scifi-frontier-wide",original_no_source:true,
 seed:b.seed,extent:[2048,1024],material_cell_count:b.g.length,
 engine_accepted_main:"de58bf1997ca75825cf3b29e046dc1c1022c45bf",map_repo_base:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",
 loader_source_max_rectangles:32768,loader_source_max_json_bytes:1048576,source_work_budget:32000000,
 material_rule_assumption:"Inert Solid/None source-authorized IDs only; no powders, fluids or reactive materials",
 material_histogram:b.hist,filled_grounded_cells:b.area,detached_final_cells:0,
 prototype_disconnected_cells_removed:b.removed,prototype_components_removed:b.removedGroups,
 rectangle_count:b.rect.length,rectangle_work:b.area,setup_bytes:b.json.length,
 grid_sha256:hash(b.g),setup_sha256:hash(b.json),
 images:b.images.map(([name,z])=>({name,bytes:z.length,sha256:hash(z)})),
 clearance:b.clearances,obstruction:{xyxy_halfopen:b.obstacle,material_id:58,purpose:"Test-only wall blocks elevated High mixing switch, retaining other routes",result:b.blocked},
 named_sites:b.sites,literal_actor_spawn:b.sites["West airlock"],crops:b.crops,
 feature_survival:b.r2Features,static_status:"CREATOR-STATIC-PASS",native_status:"NATIVE-UNTESTED",
 independent_reviews:"Exact-HEAD independent Art/Technical/Shepherd pending",
 creator_revision:"Original geological dry cascade exemplar, 2026-11-21"};};
const exemplar=function exemplar(b,hash){let e={"schema_version":1,"purpose":["human_editable_canvas","procedural_exemplar","scripted_setpiece_source"],"family":"original/scifi-frontier-wide","map_role":"six asymmetrically stepped dry colonial machine districts on a descending geology-controlled cascade","anchor_donors":[],"macro_topology":"six unequal topographic platforms descend through a dry geological staircase to a raised east relief apron, separated by broad open air gaps","density_profile":"alternating entered machinery halls, open transfer gaps and partly unfinished lower verandas; no obligatory filler in the expansion volumes","route_grammar":{"spawn":"West airlock","primary":"west rover clinic to assay to central ore sorting to biofilter to east quarantine and relief departure","alternatives":["high clear-sky bypass above all stepped thresholds","open lower transfer spaces below piers and between adjacent districts"],"tested_sites":24,"obstruction":{"site":"High mixing switch","box":[983,325,1021,365],"unaffected_reachable":23}},"strong_motifs":["geology-tied six unequal decks","unrepeated asymmetric diagonal step gates","local functional ore, assay and biological custody equipment","twin rooted metal pier support","separate elevated relief dock","unfinished but deliberate lower side verandas"],"interesting_relationships":["west civilian/medical decks occupy higher land than quarantine and freight","workstation families alternate with broader open transition voids","natural terrain changes set deck height and pier length","unfurnished underdeck geometry leaves room for agent-authored modular inserts"],"authoring_affordances":["empty gap beside west gate for collapse edit","unused lower assay veranda","central sorter rear mezzanine for later equipment","low quarantine service veranda for human-built alternate entry"],"setpiece_candidates":[{"name":"West threshold failure","area":[320,450,485,625],"event_type":"collapse/reroute","scripted":false},{"name":"Central sorter start-up","area":[845,545,1145,680],"event_type":"machinery activation","scripted":false},{"name":"Eastern quarantine stand","area":[1570,633,1800,765],"event_type":"NPC holdout","scripted":false},{"name":"Relief evacuation","area":[1840,520,2030,690],"event_type":"arrival/departure","scripted":false}],"procedural_exemplar_value":"Supports rule derivation for variable-height geomorphic platforms, fixed material-pier grounding, asymmetric industrial machine families, and intentionally editable lower verandas.","similarity_avoidance":"Unlike Copperwake Fault's underground three-cavity settlements, Penumbral Sink's central ring, and Vela Rift's opposed wind-sails, this map is an unbalanced dry topographic cascade of small human-scale facilities, with terrain height controlling support lengths and transitions.","diversity_axes":{"macro_topology":"cascade","altitude_grammar":"high_low_bypass","density_cadence":"alternating","route_structure":"branch_rejoin","landmark_family":"gate","support_form":"multi_leg","environment_relation":"geological","incompleteness":"editable_gaps"},"native_status":"NATIVE-UNTESTED","source_grid_sha256":"29520625c24ec49efac6a518085abe9c9098c7825c6b19d601349f3e3654797d"};e.source_grid_sha256=hash(b.g);return e;};

const fs=require("fs"),path=require("path"),a=build(),r=receipt(a,hash),e=exemplar(a,hash);
let ok=true;for(let [name,data] of [["setup.json",a.json],["receipt.json",JSON.stringify(r,null,2)+"\n"],["exemplar.json",JSON.stringify(e,null,2)+"\n"],...a.images]){
 let expected=typeof data==="string"?Buffer.from(data,"utf8"):Buffer.from(data),f=path.join(__dirname,name);
 if(process.argv.includes("--verify")){if(!fs.existsSync(f)||!expected.equals(fs.readFileSync(f))){console.error("MISMATCH "+name);ok=false;}}else fs.writeFileSync(f,expected);}
console.log(JSON.stringify({cells:a.g.length,rectangles:a.rect.length,grounded:a.area,sites:Object.keys(a.sites).length,obstruction:a.blocked.bad,sha256:r.grid_sha256,verified:ok}));if(!ok)process.exit(1);
