"use strict";
// Original Rime Accord deterministic material-cell authoring, no reference art.
const fs=require("fs"),path=require("path");
const build=function build(){
 const W=2048,H=1024,N=W*H,g=new Uint8Array(N),seed=0xC1A26E;
 const M={rock:100,schist:101,iron:49,steel:62,titanium:68,blue:63,conduit:66,glass:120,white:121,quartz:122,black:129,ceramic:130,chrome:131,amber:79,signal:77,wall:58};
 function R(x,y,w,h,m){let a=Math.max(0,Math.round(x)),b=Math.min(W,Math.round(x+w)),c=Math.max(0,Math.round(y)),d=Math.min(H,Math.round(y+h));if(a>=b||c>=d)return;for(let k=c;k<d;k++)g.fill(m,k*W+a,k*W+b);}
 function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,r=t/2;for(let j=Math.max(0,Math.floor(Math.min(y,Y)-r));j<Math.min(H,Math.ceil(Math.max(y,Y)+r)+1);j++)for(let i=Math.max(0,Math.floor(Math.min(x,X)-r));i<Math.min(W,Math.ceil(Math.max(x,X)+r)+1);i++){let v=Math.max(0,Math.min(1,((i-x)*dx+(j-y)*dy)/(d||1)));if((i-x-v*dx)**2+(j-y-v*dy)**2<=r*r)g[j*W+i]=m;}}
 // Rime Accord: distinct two-jaw extraction machine over a dry alien quarry.
 for(let x=0;x<W;x+=32){let y=932+Math.round(6*Math.sin(x*.012)+4*Math.sin(x*.027));R(x,y,32,H-y,M.rock);R(x,y+50,32,H-y-50,M.schist);}
 for(let y=348;y<943;y+=23){let left=448-Math.round((y-348)*.11)+Math.round(10*Math.sin(y*.024)),right=1596+Math.round((y-348)*.13)+Math.round(12*Math.sin(y*.031));R(0,y,left,23,M.rock);R(right,y,W-right,23,M.rock);}
 // Real three-room excavated west and east districts, and the dry lower escape.
 for(let y of [374,522,668]){R(46,y,500,94,0);R(1500,y,502,96,0);}
 R(430,340,126,587,0);R(1491,340,124,587,0);
 R(430,825,1180,94,0);
 R(505,292,1036,84,0);R(510,747,1030,57,0);
 // Open site-labelled storeys connect to the broad central air via their real mouths.
 // Floors are mechanically rooted in boundary rock, open-mouth shafts remain clear.
 for(let y of [470,619,766]){R(0,y,421,9,M.iron);R(1628,y,420,9,M.steel);}
 for(let y of [375,524,670]){
  R(65,y+12,9,75,M.steel);R(364,y+12,10,73,M.iron);R(1692,y+12,9,74,M.steel);R(1982,y+12,9,74,M.iron);
  R(80,y+15,67,7,M.blue);R(269,y+13,69,10,M.ceramic);R(1714,y+13,79,10,M.blue);R(1845,y+15,107,8,M.ceramic);
 }
 // Human-scale mechanically different apparatus: west rover, isotope analyser, service arm.
 R(120,427,111,11,M.steel);for(let x of [132,172,212]){R(x,402,13,24,M.iron);R(x+3,396,7,7,M.amber);}
 R(279,402,75,39,M.ceramic);R(290,410,50,19,M.black);
 R(120,572,60,11,M.titanium);L(136,568,163,542,9,M.chrome);
 for(let x of [207,229,251]){R(x,549,10,23,M.white);R(x+3,544,4,5,M.signal);}
 R(303,553,60,8,M.iron);
 R(115,723,98,10,M.steel);L(129,722,170,693,9,M.chrome);L(171,693,209,718,9,M.chrome);
 R(264,722,105,9,M.ceramic);for(let x of [274,297,320,343])R(x,689,11,30,M.blue);
 // Eastern quarantine, spectrometry and cargo-handling are visually distinct.
 R(1731,403,89,52,M.ceramic);R(1740,410,69,26,M.black);
 for(let x of [1746,1774,1802])R(x,437,13,12,M.white);
 R(1861,412,91,9,M.steel);R(1904,421,11,31,M.chrome);
 R(1734,561,51,53,M.iron);R(1742,568,35,30,M.black);
 for(let y of [555,567,579,591])R(1816,y,133,5,M.blue);
 R(1900,547,12,54,M.chrome);
 R(1733,711,94,9,M.steel);R(1760,721,13,27,M.chrome);
 for(let x of [1844,1875,1906,1937]){R(x,688,14,57,M.ceramic);R(x+4,697,6,25,M.black);}
 // Heavy cantilever jaws, BOTH tied to physical basalt sidewalls at interstorey y=629.
 L(388,632,674,610,30,M.iron);L(1664,630,1384,611,27,M.titanium);
 L(668,613,883,436,27,M.steel);L(1391,613,1186,432,30,M.iron);
 L(679,615,894,443,7,M.chrome);L(1385,619,1181,441,7,M.chrome);
 L(879,435,1034,413,26,M.titanium);L(1034,413,1184,436,24,M.steel);
 // Unequal serrated jaws, not a decorative ring and not a mass-driver.
 L(992,422,962,647,23,M.iron);L(1114,428,1195,638,25,M.iron);
 for(let j=0;j<6;j++){let y=490+j*26;L(993-j*3,y,954-j*5,y+17,9,M.titanium);L(1144+j*5,y,1184+j*7,y+16,9,M.titanium);}
 R(1023,396,38,19,M.amber);R(1032,403,19,8,M.black);
 L(946,639,1001,651,11,M.chrome);L(1116,646,1196,616,11,M.chrome);
 // Central cargo transaction: sample pickup, guided grippers, guarded assay, outfeed.
 L(824,673,925,623,9,M.conduit);R(1021,603,60,12,M.steel);
 R(1035,588,31,16,M.amber);L(1035,603,1007,628,8,M.chrome);L(1064,602,1092,629,8,M.chrome);
 L(1110,653,1222,680,8,M.conduit);R(1225,684,95,10,M.iron);
 R(1250,662,50,18,M.black);
 // Four *different* rooted understrata machines; real navigable roof clearance.
 for(let x of [635,822,1030,1280])R(x,923,139,9,M.steel);
 R(652,900,77,9,M.chrome);L(681,898,714,851,8,M.titanium);R(708,848,27,10,M.white);
 R(845,908,103,11,M.iron);for(let j=0;j<8;j++){let t=j*Math.PI/4;L(896,893,896+24*Math.cos(t),893+20*Math.sin(t),7,M.chrome);}
 R(887,885,17,17,M.amber);
 R(1049,912,118,9,M.ceramic);for(let x=1060;x<1163;x+=14){R(x,852,8,59,M.blue);R(x+2,862,4,30,M.white);}
 R(1293,910,118,10,M.iron);L(1323,910,1323,849,10,M.chrome);L(1323,853,1388,853,12,M.titanium);
 R(1384,851,8,46,M.chrome);L(1387,894,1364,908,9,M.blue);
 // Reassert purposeful wide flight openings after bracing, avoiding faux scenic rooms.
 R(432,355,116,552,0);R(1495,355,115,552,0);
 for(let y of [387,537,688]){R(70,y,500,58,0);R(1480,y,501,58,0);}
 R(488,759,1049,48,0);R(480,827,1080,50,0);
 // Literal named flyable centres; all paths must meet conservative complete envelopes.
 const sites={
 "West rover spawn":[164,414],"West charging":[332,416],
 "West ore intake":[164,565],"West isotope assay":[334,566],
 "West repair":[160,712],"West shelter":[332,712],
 "West access throat":[512,690],"West rim":[608,246],
 "West arm monitor":[830,388],"West jaw approach":[791,675],
 "Upper open flight":[1039,193],"East jaw approach":[1360,674],
 "East arm monitor":[1275,389],"East rim":[1445,245],
 "Central jaw custody":[1050,564],"Intake shuttle":[912,697],
 "Outfeed receiver":[1248,710],"East access throat":[1543,690],
 "Lower west refuge":[570,783],"Lower east refuge":[1472,784],
 "Deep west entry":[575,850],"Deep probe":[697,845],
 "Deep gear reducer":[886,848],"Deep spectrometer":[1110,844],
 "Deep hoist":[1352,846],"Deep east entry":[1455,853],
 "East quarantine":[1758,420],"East seal":[1911,417],
 "East spectroscope":[1758,568],"East isotope rack":[1905,567],
 "East rover freight":[1754,711],"East loading":[1911,709]
 };
 for(let [n,[x,y]] of Object.entries(sites))R(x-23,y-22,47,45,0);
 
  // R2 physically attached workfaces, placed AFTER the destructive late bulk-room and site cuts.
  // Distinct jaw frame, guarded custody, sheltered workstations and four entered deep machines.
  L(405,355,900,459,25,M.steel);L(1660,355,1195,455,27,M.titanium);
  L(900,459,988,426,22,M.chrome);L(1195,455,1150,485,23,M.iron);
  L(988,426,968,635,19,M.titanium);L(1150,485,1177,638,21,M.steel);
  for(let j=0;j<6;j++){let y=482+j*26;L(980-j*3,y,950-j*4,y+17,9,M.titanium);L(1132+j*3,y,1175+j*4,y+18,9,M.titanium);}
  L(968,634,1009,654,11,M.chrome);L(1177,638,1122,656,11,M.chrome);
  
 // R2 custody material handoff: anchored guide, captured xenolith, sensor and
 // gated receiving rack, separated by a full playable centre flight gap.
 L(971,637,974,682,8,M.iron);R(938,679,82,8,M.ceramic);
 R(994,662,33,12,M.amber);R(1002,653,17,9,M.black);
 L(1176,635,1182,679,9,M.steel);R(1158,676,95,9,M.titanium);
 R(1205,660,36,13,M.black);R(1228,654,8,6,M.signal);
// Twelve distinct anchored gear stations in six room levels.
  for(let [x,y] of [[92,470],[280,470],[92,619],[280,619],[92,766],[280,766],
                     [1724,470],[1870,470],[1724,619],[1870,619],[1724,766],[1870,766]])R(x,y-28,7,28,M.steel);
  R(99,448,90,11,M.chrome);R(111,436,24,12,M.amber);R(156,429,8,19,M.signal);
  R(286,448,76,10,M.ceramic);R(300,431,17,17,M.white);
  L(108,590,162,599,8,M.chrome);R(117,583,48,10,M.black);
  R(289,587,68,11,M.blue);for(let k=0;k<4;k++)R(299+k*15,575,7,13,M.white);
  L(96,738,175,746,11,M.iron);R(121,731,18,10,M.amber);
  R(286,737,76,10,M.ceramic);R(290,725,8,15,M.signal);R(350,725,8,15,M.signal);
  R(1732,446,73,11,M.blue);R(1747,433,45,12,M.black);
  R(1877,446,75,11,M.ceramic);for(let k=0;k<4;k++)R(1881+k*17,435,8,10,M.white);
  R(1732,587,82,10,M.iron);L(1739,587,1773,574,7,M.chrome);
  R(1878,591,79,9,M.blue);for(let k=0;k<3;k++)R(1886+k*25,576,12,14,M.glass);
  R(1733,740,78,10,M.chrome);R(1760,723,16,20,M.amber);
  R(1877,739,78,12,M.titanium);R(1894,720,45,20,M.black);
  // Four contrasting machinery stations bolted through bedrock top.
  for(let x of [636,823,1030,1281])R(x,923,9,25,M.steel);
  R(644,905,84,12,M.chrome);L(650,904,694,878,10,M.iron);R(705,870,22,12,M.white);
  R(834,900,102,12,M.titanium);L(888,901,907,879,13,M.chrome);L(907,879,930,903,13,M.chrome);R(884,877,22,14,M.amber);
  R(1043,906,122,10,M.ceramic);for(let i=0;i<6;i++){R(1052+i*17,876,9,29,M.blue);R(1055+i*17,883,3,13,M.white);}
  R(1293,903,106,11,M.iron);L(1307,902,1319,872,10,M.chrome);L(1319,872,1384,869,10,M.titanium);R(1381,870,12,29,M.blue);
  
 // Deep machine feet actually touch the grounded understrata.
 R(648,911,9,42,M.steel);R(841,907,9,45,M.titanium);
 R(1052,905,9,47,M.steel);R(1300,904,9,48,M.steel);
// Conservative exact-centre keepouts; no shifting any site.
  for(let [,p] of Object.entries(sites))R(p[0]-17,p[1]-15,35,31,0);

 // Preserve an explicit safe slot between the two jaw crown beams.
 R(1013,378,127,112,0);

 // All deposited solids must be boundary-rooted. Prune only disconnected prototypes,
 // then independently verify final connectedness, exact replay and route graph.
 let seen=new Uint8Array(N),q=new Int32Array(N),removed=0,removedGroups=0;
 for(let k=0;k<N;k++)if(g[k]&&!seen[k]){
  let h=0,t=1,edge=false;seen[k]=1;q[0]=k;
  while(h<t){let a=q[h++],x=a%W,y=(a/W)|0;if(!x||x===W-1||!y||y===H-1)edge=true;
   for(let n of [a-W,a+W,x?a-1:-1,x<W-1?a+1:-1])if(n>=0&&n<N&&g[n]&&!seen[n]){seen[n]=1;q[t++]=n;}
  }
  if(!edge){removedGroups++;removed+=t;for(let z=0;z<t;z++)g[q[z]]=0;}
 }

  // R2 hard fail if any independently distinguishable functional area was
  // accidentally cleared or pruned. Count FINAL persisted materials, not the
  // prototype brush calls. Rock/schist cannot satisfy this invariant.
  const zones=[
    ["west-interior",80,420,380,775,2000,5],
    ["east-interior",1700,420,1980,775,2000,5],
    ["west-anchored-jaw",790,400,1010,670,3500,5],
    ["east-anchored-jaw",1120,400,1330,670,3500,5],
    ["custody-pickup",920,630,1035,710,1000,5],
    ["outfeed-receiver",1140,630,1280,710,1000,5],
    ["core-probe",630,869,740,940,1200,4],
    ["gear-reducer",815,869,955,940,1200,4],
    ["spectral-array",1030,869,1180,940,1200,4],
    ["return-hoist",1270,865,1420,940,1200,4]
  ];
  let r2Features={};
  for(let [name,x0,y0,x1,y1,minCells,minKinds] of zones){
    let counts={},total=0;
    for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){
      let m=g[y*W+x];if(!m||m===M.rock||m===M.schist)continue;
      counts[m]=(counts[m]||0)+1;total++;
    }
    let kinds=Object.keys(counts).length;
    if(total<minCells||kinds<minKinds)throw Error("R2 required functional feature lost "+name+" "+total+"/"+kinds);
    r2Features[name]={nongeological_cells:total,distinct_nonrock_materials:kinds,histogram:counts};
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
 let obstacle=[1021,539,1079,589],blocked=flood(31,27,obstacle);
 if(blocked.bad.length!==1||blocked.bad[0].name!=="Central jaw custody")throw Error("Obstruction failed "+JSON.stringify(blocked.bad));
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
 let crops=[["01-west-inhabited-rover",0,306,557,477],["02-jaw-extraction-frame",530,344,990,419],["03-custody-and-receiver",759,440,618,341],["04-east-quarantine-freight",1490,306,558,475],["05-deep-ore-service",484,814,1090,198]];
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
const receipt=function receipt(a,sha){return {concept:"Rime Accord - Xenolith Jaw Excavator",lane:"original/scifi-frontier-wide",original_no_source:true,seed:a.seed,extent:[2048,1024],material_cell_count:a.g.length,engine_accepted_main:"7b03aa437561ec63e31fd09531171360ab60eeb4",map_repo_base:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",loader_source_max_rectangles:32768,loader_source_max_json_bytes:1048576,source_work_budget:32000000,installed_bridge_legacy_capacity_risk:4096,material_rule_assumption:"Only accepted inert immovable Solid/None kernels; no powders or liquids",material_histogram:a.hist,filled_grounded_cells:a.area,detached_final_cells:0,prototype_disconnected_cells_removed:a.removed,prototype_components_removed:a.removedGroups,rectangle_count:a.rect.length,rectangle_work:a.area,setup_bytes:a.json.length,grid_sha256:sha(a.g),setup_sha256:sha(a.json),images:a.images.map(([name,b])=>({name,bytes:b.length,sha256:sha(b)})),clearance:a.clearances,obstruction:{xyxy_halfopen:a.obstacle,material_id:58,purpose:"Blocks only Central jaw custody",result:a.blocked},named_sites:a.sites,literal_actor_spawn:a.sites["West rover spawn"],crops:a.crops,static_status:"CREATOR-STATIC-PASS-R2",native_status:"NATIVE-UNTESTED",independent_reviews:"R1 functional-art P1 addressed in final physical cells; independent exact-R2 Art/Tech/Shepherd RECHECK REQUIRED",r2_feature_survival:a.r2Features,creator_revision:"R2 supported two-jaw industrial mechanism and physical workstations 2026-11-20"};};
const a=build(),r=receipt(a,hash);let ok=true;
for(const [name,data] of [["setup.json",a.json],["receipt.json",JSON.stringify(r,null,2)+"\n"],...a.images]){let expected=typeof data==="string"?Buffer.from(data,"utf8"):Buffer.from(data),f=path.join(__dirname,name);if(process.argv.includes("--verify")){if(!fs.existsSync(f)||!expected.equals(fs.readFileSync(f))){console.error("MISMATCH "+name);ok=false;}}else fs.writeFileSync(f,expected);}
console.log(JSON.stringify({cells:a.g.length,rectangles:a.rect.length,solid:a.area,sites:Object.keys(a.sites).length,obstruction:a.blocked.bad,hash:r.grid_sha256,verified:ok}));if(!ok)process.exit(1);
