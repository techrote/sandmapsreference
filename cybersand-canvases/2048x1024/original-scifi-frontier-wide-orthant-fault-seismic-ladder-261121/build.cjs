"use strict";
// Pure original geometry; PNGs are generated from indexed material cells, not reference art.
const build=function build(){
 const W=2048,H=1024,N=W*H,g=new Uint8Array(N),seed=0x4AF1C72;
 const M={rock:100,schist:101,iron:49,steel:62,titanium:68,blue:63,conduit:66,glass:120,white:121,quartz:122,black:129,ceramic:130,chrome:131,amber:79,signal:77,wall:58};
 function R(x,y,w,h,m){let a=Math.max(0,Math.round(x)),b=Math.min(W,Math.round(x+w)),c=Math.max(0,Math.round(y)),d=Math.min(H,Math.round(y+h));if(a>=b||c>=d)return;for(let k=c;k<d;k++)g.fill(m,k*W+a,k*W+b);}
 function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,r=t/2;for(let j=Math.max(0,Math.floor(Math.min(y,Y)-r));j<Math.min(H,Math.ceil(Math.max(y,Y)+r)+1);j++)for(let i=Math.max(0,Math.floor(Math.min(x,X)-r));i<Math.min(W,Math.ceil(Math.max(x,X)+r)+1);i++){let v=Math.max(0,Math.min(1,((i-x)*dx+(j-y)*dy)/(d||1)));if((i-x-v*dx)**2+(j-y-v*dy)**2<=r*r)g[j*W+i]=m;}}








 // ORTHANT FAULT - SEISMIC LADDER COLONIES. New side elevation, independent spatial grammar.
 function grade(x){return Math.round(899+9*Math.sin(x*.013)+5*Math.sin(x*.033));}
 for(let x=0;x<W;x+=4){let y=grade(x);R(x,y,4,H-y,(x%151<4)?M.schist:M.rock);}
 R(0,1004,W,20,M.schist);
 for(let x=55;x<343;x+=4)R(x,542+Math.round(25*Math.sin(x*.014)),4,grade(x)-542,M.rock);
 for(let x=1780;x<2048;x+=4)R(x,577+Math.round(23*Math.sin(x*.011)),4,grade(x)-577,M.schist);
 R(90,598,235,75,0);R(109,740,222,67,0);
 R(1825,626,198,74,0);R(1808,761,216,62,0);
 R(255,490,85,420,0);R(1783,495,87,414,0);
 // WEST clinic: inhabitable bays, real bedrock-bearing bent, weather canopy hatches.
 R(69,457,513,12,M.steel);R(69,469,513,5,M.titanium);
 for(let x of [80,551]){R(x,468,17,grade(x)-468,M.iron);R(x+5,475,6,grade(x)-480,M.chrome);}
 R(99,380,447,9,M.titanium);R(99,389,14,68,M.iron);R(532,389,14,68,M.iron);
 R(250,377,95,35,0);R(120,430,75,18,M.ceramic);R(137,436,20,10,M.blue);
 R(380,428,79,22,M.black);R(399,435,17,10,M.signal);
 R(481,423,49,23,M.white);R(493,433,14,11,M.amber);
 // WEST middle mining and rover service.
 R(359,714,405,13,M.steel);R(359,727,405,5,M.titanium);
 for(let x of [369,735])R(x,727,19,grade(x)-727,M.iron);
 R(377,627,345,9,M.steel);R(377,636,15,77,M.iron);R(708,635,14,77,M.iron);
 R(490,622,104,32,0);
 R(413,674,82,27,M.black);R(432,684,20,10,M.amber);
 R(527,665,74,36,M.ceramic);R(541,673,17,14,M.blue);
 R(629,669,56,29,M.white);R(649,677,16,11,M.signal);
 // EAST medical-research colony, three bedrock-bearing legs, open roof wells.
 R(1265,475,690,13,M.steel);R(1265,488,690,5,M.titanium);
 for(let x of [1276,1520,1924]){R(x,488,19,grade(x)-488,M.iron);R(x+6,497,7,grade(x)-510,M.chrome);}
 R(1310,391,602,11,M.titanium);R(1310,402,15,72,M.iron);R(1897,402,15,72,M.iron);
 R(1500,377,114,43,0);R(1717,377,107,43,0);
 R(1334,444,95,23,M.ceramic);R(1358,451,17,11,M.blue);
 R(1639,437,71,29,M.black);R(1663,447,15,13,M.signal);
 R(1840,440,54,27,M.white);R(1853,449,16,12,M.amber);
 // Asymmetric seismic fork: independently legible paired antenna, horizontal crane only.
 R(1420,216,25,174,M.iron);R(1747,176,26,214,M.iron);
 L(1430,217,1584,129,13,M.steel);L(1584,129,1762,176,12,M.titanium);
 R(1550,119,73,17,M.chrome);R(1580,105,14,14,M.signal);
 L(1760,178,1831,253,10,M.chrome);R(1822,249,31,11,M.amber);
 // EAST containment mezzanine, phasewell and custody.
 R(1351,715,511,13,M.titanium);R(1351,728,511,5,M.steel);
 for(let x of [1363,1830])R(x,728,19,grade(x)-728,M.iron);
 R(1380,630,440,10,M.steel);R(1380,640,14,74,M.iron);R(1807,640,13,75,M.iron);
 R(1510,623,103,30,0);
 R(1405,682,75,25,M.black);R(1420,690,16,11,M.blue);
 R(1543,679,63,28,M.ceramic);R(1555,687,17,12,M.amber);
 R(1695,673,81,29,M.white);R(1713,681,15,12,M.signal);
 // Three staggered crossings and flyable breaks, not a perspectival foreground.
 L(580,452,782,492,13,M.iron);R(784,493,152,11,M.steel);
 L(1125,454,1266,478,12,M.titanium);R(997,446,137,10,M.steel);
 R(735,559,216,12,M.titanium);L(946,569,1015,604,12,M.chrome);
 R(1102,606,174,11,M.steel);
 R(758,785,196,13,M.steel);R(1122,766,206,13,M.titanium);
 L(760,785,798,892,12,M.iron);L(1290,777,1337,898,12,M.iron);
 // EXPOSED rift floor: entered service, carrier stage, room for future collapse.
 R(829,844,390,70,0);R(866,920,310,72,0);
 R(889,982,270,8,M.steel);
 R(914,943,67,26,M.ceramic);R(931,951,14,11,M.blue);
 R(1016,937,72,30,M.black);R(1033,946,17,12,M.signal);
 R(1106,945,47,22,M.white);R(1119,952,15,11,M.amber);
 // Genuinely entered left/right undercroft work areas and recovery shafts.
 R(104,828,345,76,0);R(1808,835,217,70,0);
 R(417,762,86,175,0);R(1591,770,90,169,0);
 R(650,844,116,99,0);R(1281,854,140,95,0);
 R(399,900,367,53,0);R(1260,910,365,45,0);
 R(163,887,178,7,M.steel);R(192,858,54,20,M.black);R(206,866,14,10,M.signal);
 R(1832,890,174,7,M.steel);R(1848,855,55,27,M.ceramic);R(1860,863,17,12,M.blue);
 // Full envelope access via shafts, open air sleeves and cross-level doors.
 R(262,379,91,450,0);R(412,611,88,316,0);R(508,618,93,114,0);
 R(1520,371,104,147,0);R(1605,602,90,330,0);R(1800,390,88,534,0);
 R(1021,730,108,258,0);
 const sites={
 "Rover clinic spawn":[180,417],"Western clinic":[425,418],"West lookout":[370,300],
 "Cliff triage":[182,608],"West assay cavern":[179,763],
 "West buried archive":[219,862],"West logistics shaft":[456,805],
 "Ore triage":[627,674],"Rover service":[698,612],"West mining approach":[769,652],
 "West fault crossing":[864,516],"High cable landing":[1010,371],
 "Upper rift flyover":[1037,207],"Mid-shear bypass":[1085,539],
 "East rift landing":[1191,553],"East seismic gantry":[1381,348],
 "Crown sensor":[1571,78],"Easterly mast":[1812,310],
 "East observation":[1874,430],"East clinic":[1399,426],
 "East survey deck":[1647,409],"East custody":[1465,667],
 "Quarantine recorder":[1559,662],"East biosieve":[1741,657],
 "East cliff diagnostics":[1915,652],"East lower vault":[1914,795],
 "East archival shaft":[1651,806],"East sterile return":[1496,829],
 "Deep fault landing":[1067,862],"Fault lower assay":[950,896],
 "Break bridge west":[900,736],"Break bridge east":[1192,719],
 "West outer survey":[40,800],"East outer survey":[2007,741],
 "Deep left ore store":[690,879],"Deep right sample store":[1347,887],
 "Fault rescue reserve":[1137,681],"Upper western rover pad":[536,529]
 };
 for(const [x,y] of Object.values(sites))R(x-21,y-19,43,39,0);
 R(314,585,116,105,0);R(152,688,128,85,0);
 R(455,740,96,95,0);R(603,695,104,113,0);
 R(1380,700,99,155,0);R(1744,700,83,155,0);
 R(1900,698,81,105,0);R(1022,608,101,143,0);

 // Retained rooted site-specific apparatus; every workface has a mechanical load path.
 // West colony: diagnostic benches, air analyser, blue sample carrier.
 R(211,420,55,38,M.ceramic);R(226,428,19,14,M.blue);R(240,417,9,11,M.signal);
 R(274,400,12,58,M.iron);R(282,435,55,23,M.black);
 R(293,441,14,11,M.amber);R(363,421,32,37,M.white);R(377,434,12,13,M.blue);
 R(487,410,19,48,M.chrome);R(495,416,10,17,M.amber);
 // West ore terrace: guarded crusher, spec meter and forklift bed rooted in mining platform.
 R(391,677,60,39,M.black);R(406,683,22,18,M.amber);R(401,711,13,8,M.iron);
 R(519,647,67,69,M.ceramic);R(534,661,21,32,M.blue);R(570,648,10,68,M.iron);
 L(529,652,572,707,8,M.titanium);L(570,653,532,706,8,M.chrome);
 R(643,674,53,42,M.black);R(653,684,15,13,M.signal);
 R(706,681,35,35,M.white);R(721,690,12,14,M.blue);
 // East seismography: multi-height receiver and signal repeater with material legs.
 R(1452,432,59,45,M.ceramic);R(1463,443,17,19,M.blue);
 R(1489,421,11,56,M.chrome);R(1502,420,8,14,M.signal);
 R(1642,436,35,41,M.black);R(1652,446,14,13,M.amber);
 R(1810,414,53,64,M.white);R(1825,430,16,22,M.blue);
 R(1862,460,19,17,M.iron);
 // Quarantine: two-section reverse-flow exhaust, isolated biomass docket, rover loading.
 R(1395,681,54,36,M.black);R(1407,690,18,11,M.amber);
 R(1494,686,30,31,M.ceramic);R(1503,692,15,14,M.blue);
 R(1615,668,74,49,M.ceramic);R(1632,677,19,24,M.blue);
 R(1677,677,12,40,M.chrome);R(1683,662,9,15,M.signal);
 R(1778,683,44,35,M.black);R(1790,692,16,12,M.amber);
 // Lower rock-cut instrument rooms, equipment tied directly to their actual floors.
 R(278,863,34,40,M.white);R(289,870,15,12,M.blue);
 R(322,874,28,27,M.black);R(327,882,13,11,M.signal);
 R(1888,855,36,38,M.ceramic);R(1900,861,15,15,M.amber);
 R(1964,859,28,35,M.black);R(1971,869,11,12,M.blue);
 // The fault's debris monitor and re-route panel physically share the continuous service deck.
 R(983,939,25,46,M.iron);R(1015,940,38,45,M.black);R(1024,948,15,18,M.signal);
 R(1095,950,51,35,M.ceramic);R(1110,958,15,11,M.blue);

 // Discard only provisional non-boundary-grounded material before publication.
 let seen=new Uint8Array(N),q=new Int32Array(N),removed=0,removedGroups=0;
 for(let k=0;k<N;k++)if(g[k]&&!seen[k]){let h=0,t=1,edge=false;seen[k]=1;q[0]=k;
  while(h<t){let p=q[h++],x=p%W,y=(p/W)|0;if(!x||x===W-1||!y||y===H-1)edge=true;
   for(let v of [p-W,p+W,x?p-1:-1,x<W-1?p+1:-1])if(v>=0&&v<N&&g[v]&&!seen[v]){seen[v]=1;q[t++]=v;}
  }if(!edge){removedGroups++;removed+=t;for(let j=0;j<t;j++)g[q[j]]=0;}}
 let r2Features={};for(let [name,x0,y0,x1,y1] of [["clinic",70,370,580,475],["ore",350,590,780,741],["fault",750,425,1320,1002],["seismic",1290,105,1950,495],["subgrade",100,730,2028,1002]]){
 let cnt=0;for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(g[y*W+x]&&g[y*W+x]!==M.rock&&g[y*W+x]!==M.schist)cnt++;r2Features[name]=cnt;}
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
  let [sx,sy]=sites["Rover clinic spawn"],si=sy*W+sx;if(!pass[si])throw Error("Blocked spawn");
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
 let obstacle=[1537,642,1580,683],blocked=flood(31,27,obstacle);
 if(blocked.bad.length!==1||blocked.bad[0].name!=="Quarantine recorder")throw Error("Obstruction failed "+JSON.stringify(blocked.bad));
 let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:sites["Rover clinic spawn"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
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

 let crops=[["01-rover-clinic",35,265,560,440],["02-ore-and-west-fault",380,455,530,445],["03-braided-bridges",760,300,560,610],["04-forked-seismic-tower",1290,70,730,645],["05-deep-fault-archives",100,730,1870,290]];
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





const receipt=b=>({concept:"Orthant Fault — Seismic Ladder Colonies",seed:b.seed,extent:[2048,1024],
source_family:"original/scifi-frontier-wide",map_base_sha:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",
engine_authority_sha:"69209acaffb34ebe18c45e19290b5976b7fb2c82",
actor_model:"midge",actor_sha256:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",
material_cells:b.g.length,grid_sha256:hash(b.g),setup_sha256:hash(b.json),
ordered_rectangles:b.rect.length,setup_bytes:b.json.length,construction_work_cells:b.area,
source_limits:{max_rectangles:32768,max_setup_bytes:1048576,max_work_cells:32000000},
material_histogram:b.hist,occupied_final_cells:b.area,grounded_final_cells:b.area,detached_final_cells:0,
unstable_mobile_liquid_reactive_cells:0,provisional_discarded:b.removed,discarded_groups:b.removedGroups,
district_footprints:b.r2Features,sites:b.sites,literal_spawn:b.sites["Rover clinic spawn"],
hull_clearance_BFS:b.clearances,physical_obstruction:{rect_xyxy:b.obstacle,material_id:58,excluded:"Quarantine recorder",after_BFS:b.blocked},
images:b.images.map(([name,p])=>({name,size:p.length,sha256:hash(p)})),crop_windows:b.crops,
laws:"All final occupied IDs are accepted stationary Solid/None. No fluids, falling sand, combustible or reactive foundations.",
static:"CREATOR-STATIC-PASS",native:"NATIVE-UNTESTED",independent_review:"Art/Tech/Shepherd pending"});
const exemplar=b=>({schema_version:1,purpose:["human_editable_canvas","procedural_exemplar","scripted_setpiece_source"],
family:"original/scifi-frontier-wide",map_role:"three-strata fault-crossing frontier medical, mining, seismographic and quarantine colony",
anchor_donors:[],macro_topology:"asymmetric vertical tectonic fault with laddered frontier settlements",
density_profile:"inhabited compact edge stations alternate with an enormous open central fault and archaeological undercuts",
route_grammar:{main:["Rover clinic spawn","Western clinic","Ore triage","West fault crossing","Mid-shear bypass","East rift landing","East clinic","East custody","Quarantine recorder"],
alternatives:[["West lookout","Upper rift flyover","East seismic gantry","East observation"],["West logistics shaft","West mining approach","Deep fault landing","East archival shaft","East lower vault"]],obstruction:"Quarantine recorder",all_sites_count:Object.keys(b.sites).length},
strong_motifs:["two geologically unequal bedrock shoulders with large open fault void","three deliberately staggered crossings and independent sky overflight","unequal twin seismographic fork aerial","anchored upper rover clinic, mining terrace and east biological receiving","physically excavated archival passages across lower strata"],
interesting_relationships:["the landing route interleaves settlement, fault exposure, bridge and extraction rather than a single continuous surface","upper and lower flight routes bypass one blocked machine control site","the active seismic aerial is supported by a differently rooted eastern colony, not a scenic freestanding monolith","four reachable lower work areas preserve unfilled excavation seams"],
authoring_affordances:["wide central fault available for scripted collapse or bridge repair","unused eastern cantilever to grow a Gentek settlement","left and right abandoned subterranean bays for local NPC stories","shaft interfaces available for example-derived vertical routing grammar"],
setpiece_candidates:[{name:"Central break bridge",region:[934,740,1150,831],type:"bridge failure / chase",scripted:false},
{name:"Seismic aerial",region:[1420,110,1780,390],type:"machinery activation/reveal",scripted:false},
{name:"Quarantine recorder",region:[1510,620,1660,711],type:"lockdown or holdout",scripted:false},
{name:"Fault deep landing",region:[890,850,1190,1000],type:"rescue and departure",scripted:false}],
procedural_exemplar_value:"A reusable multi-strata vertical-fault grammar: discrete rooted edge settlements, 3 different offset cross-fault joints, multiple bypass levels and editable excavated archive cells.",
similarity_avoidance:"Unlike Arid Helm's entered vessel, Serrate Meridian's lateral gate corridor and Orison's isolated islands, this composition is an open tall shear with offset crossing technologies and vertical neighbourhood separation.",
diversity_axes:{macro_topology:"vertical_fault",altitude_grammar:"multi_strata",density_cadence:"alternating",route_structure:"layered",landmark_family:"tower",support_form:"mixed",environment_relation:"geological",incompleteness:"modular_append_zones"},
grid_sha256:hash(b.g),native:"NATIVE-UNTESTED"});
const routeGraph=b=>({schema_version:1,extent:[2048,1024],spawn_name:"Rover clinic spawn",sites:b.sites,
envelopes:[[19,15],[23,19],[31,27]],whole_envelope_four_neighbour_BFS:b.clearances,
physical_obstruction:{rect_xyxy:b.obstacle,material_id:58,intentionally_excluded:"Quarantine recorder",result:b.blocked},
qualitative_route_graph:exemplar(b).route_grammar,
caveat:"Connected open-cell centres are statically proven, not physical flight simulation or individual pairwise route timings."});
const README="# Orthant Fault — Seismic Ladder Colonies\n\nOriginal 2048x1024 perpendicular 2D CyberSand material-cell world. A split vertical fault separates a western rover-medical/mining colony from a high seismic tower and an eastern quarantine-worktown. Staggered aerial, mid-shear and broken lower bridges join independent sky and excavated service routes. Four accessible undercroft areas and empty scaffold edges remain intentionally human-editable for SWARM/GENTEK and unscripted events.\n\nRun \`node build.cjs\` to reproduce complete outputs, or \`node build.cjs --verify\` for byte-for-byte verification. Setup-v2 created from deterministic 2,097,152 actual material-ID cells. Five authentic pixel-for-cell 1:1 crops, material histogram, lossless rectangle replay, all literal Midge sites at all three conservative envelopes and a physical obstruction test. Read-only CyberSand source baseline 69209acaffb34ebe18c45e19290b5976b7fb2c82; map baseline 99a166e7fcae45eb22be1740e9f33f62faccbcc7. Static evidence only; NATIVE-UNTESTED. Draft/HOLD; Art/Technical/Shepherd independent review pending.\n";
const emitted=b=>[["setup.json",b.json],["receipt.json",JSON.stringify(receipt(b),null,2)+"\n"],["exemplar.json",JSON.stringify(exemplar(b),null,2)+"\n"],
["route_graph.json",JSON.stringify(routeGraph(b),null,2)+"\n"],["README.md",README],...b.images];
if(typeof require!=="undefined"&&typeof module!=="undefined"&&require.main===module){
 const fs=require("fs"),path=require("path"),b=build(),files=emitted(b),verify=process.argv.includes("--verify");let ok=true;
 for(const [name,value] of files){const bytes=typeof value==="string"?Buffer.from(value,"utf8"):Buffer.from(value);
 const target=path.join(__dirname,name);if(verify){if(!fs.existsSync(target)||!bytes.equals(fs.readFileSync(target))){console.error("MISMATCH "+name);ok=false;}}
 else fs.writeFileSync(target,bytes);}
 console.log(JSON.stringify({rectangles:b.rect.length,grounded:b.area,sites:Object.keys(b.sites).length,obstruction:b.blocked.bad,grid_sha256:hash(b.g),verified:ok}));if(!ok)process.exitCode=1;
}
