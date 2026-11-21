"use strict";
// Pure original geometry; PNGs are generated from indexed material cells, not reference art.
const build=function build(){
 const W=2048,H=1024,N=W*H,g=new Uint8Array(N),seed=0x538A11;
 const M={rock:100,schist:101,iron:49,steel:62,titanium:68,blue:63,conduit:66,glass:120,white:121,quartz:122,black:129,ceramic:130,chrome:131,amber:79,signal:77,wall:58};
 function R(x,y,w,h,m){let a=Math.max(0,Math.round(x)),b=Math.min(W,Math.round(x+w)),c=Math.max(0,Math.round(y)),d=Math.min(H,Math.round(y+h));if(a>=b||c>=d)return;for(let k=c;k<d;k++)g.fill(m,k*W+a,k*W+b);}
 function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,r=t/2;for(let j=Math.max(0,Math.floor(Math.min(y,Y)-r));j<Math.min(H,Math.ceil(Math.max(y,Y)+r)+1);j++)for(let i=Math.max(0,Math.floor(Math.min(x,X)-r));i<Math.min(W,Math.ceil(Math.max(x,X)+r)+1);i++){let v=Math.max(0,Math.min(1,((i-x)*dx+(j-y)*dy)/(d||1)));if((i-x-v*dx)**2+(j-y-v*dy)**2<=r*r)g[j*W+i]=m;}}






 // SERRATE MERIDIAN — original side-elevation customs/phasewell switchyard.
 // Three unequal physically supported security gatehouses, distinct workflows,
 // intentional central staging void, and three accesses to one deep rail corridor.
 function surface(x){return Math.round(841+13*Math.sin(x*.014)+6*Math.sin(x*.039));}
 for(let x=0;x<W;x+=3){let y=surface(x);R(x,y,3,H-y,(x%117<3)?M.schist:M.rock);}
 R(0,1005,W,19,M.schist);
 // Pre-cut long low recovery artery; stations expand the passage irregularly.
 R(162,911,1739,73,0);
 for(const [x,y,w,h] of [[182,877,245,109],[475,888,198,99],[783,879,204,107],
 [991,884,237,105],[1375,880,193,106],[1665,877,219,109]])R(x,y,w,h,0);
 function deck(x,y,w,posts){R(x,y,w,11,M.steel);R(x,y+11,w,5,M.titanium);
  for(const p of posts){R(p,y+14,16,surface(p)-y+3,M.iron);R(p+5,y+19,5,surface(p)-y-17,M.chrome);}
 }
 deck(90,652,316,[103,381]);
 deck(484,690,269,[495,728]);
 deck(851,679,322,[863,1150]);
 deck(1518,658,421,[1531,1915]);
 // Gate A / intake: broad, blunt, load-bearing lintel and inspection jib.
 R(420,369,27,480,M.iron);R(642,369,25,479,M.iron);
 R(420,359,247,18,M.titanium);R(429,377,230,7,M.chrome);
 L(433,369,497,452,9,M.steel);L(653,374,607,457,10,M.steel);
 R(469,470,151,11,M.steel);R(493,481,13,78,M.iron);R(591,481,14,79,M.iron);
 R(528,484,49,27,M.ceramic);R(539,492,18,12,M.signal);
 L(629,357,593,303,9,M.chrome);R(586,293,17,18,M.amber);
 // Gate B / phasewell: elevated actuator comb, alternating horizontal process trays.
 R(929,260,28,591,M.iron);R(1214,260,25,596,M.iron);
 R(929,247,310,16,M.titanium);R(946,265,276,8,M.chrome);
 L(943,262,1004,327,10,M.steel);L(1224,264,1169,326,10,M.steel);
 R(960,323,167,13,M.steel);R(1128,330,85,11,M.iron);
 R(1001,347,83,23,M.black);R(1017,354,19,12,M.signal);
 R(1142,369,47,25,M.ceramic);R(1152,376,18,12,M.blue);
 R(954,449,116,11,M.titanium);R(1097,489,117,10,M.steel);
 L(958,454,1003,521,8,M.iron);L(1209,493,1161,534,9,M.iron);
 R(1061,411,55,45,M.ceramic);R(1075,420,15,21,M.amber);
 R(1190,222,16,23,M.signal);
 // Gate C / outward biofilter: divergent equal-time supports and screened receiver.
 R(1381,363,24,487,M.iron);R(1660,363,24,485,M.iron);
 R(1381,351,303,17,M.steel);R(1401,370,254,6,M.chrome);
 L(1392,367,1459,428,9,M.steel);L(1666,369,1613,429,9,M.titanium);
 R(1452,427,71,25,M.ceramic);R(1465,435,17,12,M.blue);
 R(1580,423,59,30,M.white);R(1592,432,18,14,M.signal);
 R(1539,383,11,84,M.chrome);R(1609,329,12,17,M.amber);
 // Portal apertures are real 66-cell-tall holes through otherwise solid load paths.
 // Opposite piers and lintels retain grounding, while gates remain navigable.
 R(420,567,27,75,0);R(642,696,25,75,0);
 R(929,585,28,74,0);R(1214,688,25,70,0);
 R(1381,557,24,78,0);R(1660,698,24,76,0);
 // West clinic: genuine partly roofed side elevation and open 82px roof hatch.
 R(109,541,262,9,M.titanium);R(109,550,12,94,M.iron);R(359,550,12,97,M.iron);
 R(218,538,83,16,0);
 R(142,608,65,35,M.ceramic);R(154,619,20,15,M.blue);
 R(304,609,45,32,M.black);R(318,618,12,15,M.signal);
 R(122,567,47,12,M.steel);R(137,579,10,17,M.chrome);
 R(333,570,14,17,M.amber);
 R(331,747,85,10,M.steel);R(362,756,13,80,M.iron);
 // Intake inspection modules: differing loading, scanner and apron uses.
 R(485,687,228,10,M.steel);R(516,667,58,17,M.ceramic);R(530,656,12,13,M.signal);
 R(638,647,57,32,M.black);R(655,659,13,13,M.amber);
 R(714,592,13,91,M.chrome);R(749,739,86,10,M.steel);
 L(761,746,803,674,8,M.iron);
 // Central wide vacant customs yard deliberately ready for later manual level editing.
 R(813,772,100,12,M.steel);R(824,784,15,56,M.iron);
 R(844,745,47,19,M.black);R(861,753,11,10,M.amber);
 R(1162,735,103,11,M.steel);R(1169,746,14,88,M.iron);
 R(1206,702,47,22,M.ceramic);R(1219,706,14,12,M.signal);
 R(1276,651,58,10,M.titanium);R(1277,661,11,53,M.iron);
 L(1291,657,1361,700,8,M.steel);
 R(1325,707,55,10,M.iron);L(1334,710,1367,772,8,M.chrome);
 // Eastern quarantine: useful inhabited workfaces with evacuation deck.
 R(1537,547,375,11,M.titanium);R(1537,558,12,96,M.iron);
 R(1900,558,12,96,M.iron);R(1720,544,78,16,0);
 R(1568,610,87,32,M.ceramic);R(1582,618,20,15,M.blue);
 R(1694,612,72,29,M.black);R(1710,621,17,14,M.amber);
 R(1810,608,73,36,M.white);R(1827,618,18,14,M.signal);
 R(1947,683,90,12,M.steel);R(1947,695,13,101,M.iron);
 L(1956,687,2018,626,9,M.chrome);R(2004,608,14,17,M.amber);
 // Subgrade 73px free-depth conduit is intentionally sparse but inhabited.
 for(const [x,y,w,m,s] of [[224,957,55,M.black,M.blue],[505,957,45,M.ceramic,M.signal],
 [807,956,65,M.black,M.amber],[1101,953,49,M.ceramic,M.blue],
 [1415,956,61,M.black,M.signal],[1730,956,43,M.ceramic,M.amber]]){
 R(x,979,w+11,6,M.steel);R(x+8,y,Math.floor(w*.6),19,m);
 R(x+13,y+7,13,11,s);}
 // Unfinished service spurs express module attachment, not missing required interiors.
 R(766,613,90,8,M.steel);L(768,619,793,675,7,M.iron);
 R(1321,613,86,8,M.steel);L(1325,620,1351,705,8,M.iron);
 R(1746,752,92,9,M.titanium);R(1825,761,11,75,M.iron);
 // True 70px-wide surface-to-deep shafts, cut last so no deck seals access.
 for(const x of [252,1033,1781])R(x,513,72,472,0);
 const sites={
 "Clinic arrival":[176,592],"Triage desk":[304,590],"Upper clinic hatch":[269,486],
 "Rover dispatch":[364,699],"Inbound crosswind apron":[472,592],
 "Intake scanner":[556,559],"Western lookout":[550,290],"Intake low exit":[597,788],
 "First shaft landing":[283,851],"West sample tunnel":[395,942],
 "Subgrade utility":[572,939],"Phasewell sky antenna":[1096,167],
 "Phasewell east winch":[1272,562],"Phasewell control":[1093,576],
 "Customs lockdown pocket":[800,727],"Customs open staging":[758,786],
 "Central deep assay":[833,937],"Second shaft landing":[1069,849],
 "Deep actuator rail":[1120,938],"Underground transfer":[1321,942],
 "Biofilter inspection":[1494,503],"Eastern gate watch":[1510,291],
 "Quarantine lift":[1640,589],"Bio-custody":[1715,585],
 "Eastern medbay":[1852,592],"Evacuation pad":[1992,581],
 "Third shaft landing":[1817,850],"East deep custody":[1514,936],
 "Return freight cellar":[1698,939],"Deep eastern exit":[1868,939],
 "West boundary survey":[47,715],"East boundary survey":[2014,790],
 "Overflight return":[1768,152]
 };

 // Engineering continuity: independently grounded secondary gussets preserve gate heads
 // even though both main portal piers contain 60+px genuine fly-through slots.
 R(407,359,20,surface(413)-340,M.iron);
 L(418,394,455,457,11,M.titanium);
 R(914,245,19,surface(921)-235,M.iron);
 L(927,276,983,344,10,M.titanium);
 R(1365,347,19,surface(1374)-336,M.iron);
 L(1376,381,1442,440,10,M.titanium);
 // Backing bearers join room appliances and roof walls to the actual platform posts.
 R(108,636,265,18,M.steel);
 R(1536,638,377,21,M.steel);
 R(483,680,230,15,M.iron);
 R(961,334,11,31,M.iron);
 R(1054,335,15,117,M.chrome);
 R(1106,378,13,114,M.iron);
 R(1455,443,12,17,M.iron);
 R(1591,444,15,22,M.iron);
 // Rails have a full 13px bedrock-founded sleeper deck; operational bays stay open.
 R(174,985,1735,13,M.steel);
 // Prevent fill-in of any of the three separately represented surface-to-rail accesses.
 for(const x of [252,1033,1781])R(x,513,72,472,0);

 // Geotechnical abutments: anchor the excavated roof-shell in each zone to
 // actual world-bottom bedrock. These divide the subterranean service line
 // into recoverable compartments with independent 70px external shaft exits.
 R(445,823,29,201,M.rock);R(449,825,8,181,M.schist);
 R(1350,822,29,202,M.rock);R(1354,825,8,180,M.schist);
 // The column-to-gate load paths remain physical, not decorative.
 L(458,827,424,748,12,M.iron);
 L(1362,824,1394,743,12,M.iron);
 
 // Clear three real, purposeful access portals through the anchored gateworks.
 // Intake scanner uses a right-hand 90px free opening; its lower vehicle route
 // also passes through the secondary apron post, not a fake BFS exemption.
 R(636,526,50,117,0);
 R(718,718,34,105,0);
 // Biofilter opens into the neighbouring quarantine worktown from both levels.
 // Its left abutment and independent floor post still carry all upper loads.
 R(1651,476,49,188,0);
 // Keepouts are identical to the committed actual air cells.

 for(const [x,y] of Object.values(sites))R(x-19,y-17,39,35,0);
 // Provisional fragments are discarded before final authored world publication.
 let seen=new Uint8Array(N),q=new Int32Array(N),removed=0,removedGroups=0;
 for(let k=0;k<N;k++)if(g[k]&&!seen[k]){
  let h=0,t=1,edge=false;seen[k]=1;q[0]=k;
  while(h<t){let a=q[h++],x=a%W,y=(a/W)|0;if(!x||x===W-1||!y||y===H-1)edge=true;
   for(let n of [a-W,a+W,x?a-1:-1,x<W-1?a+1:-1])if(n>=0&&n<N&&g[n]&&!seen[n]){seen[n]=1;q[t++]=n;}
  }
  if(!edge){removedGroups++;removed+=t;for(let z=0;z<t;z++)g[q[z]]=0;}
 }
 let r2Features={};
 for(const [name,x0,y0,x1,y1] of [["clinic",105,540,400,654],["intake",420,355,715,835],
 ["phasewell",926,248,1265,833],["quarantine",1535,547,1915,660],
 ["deep_recovery",180,881,1885,999]]){
 let n=0;for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(g[y*W+x]&&g[y*W+x]!==M.rock&&g[y*W+x]!==M.schist)n++;
 r2Features[name]=n;}
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
  let [sx,sy]=sites["Clinic arrival"],si=sy*W+sx;if(!pass[si])throw Error("Blocked spawn");
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
 let obstacle=[1072,555,1114,597],blocked=flood(31,27,obstacle);
 if(blocked.bad.length!==1||blocked.bad[0].name!=="Phasewell control")throw Error("Obstruction failed "+JSON.stringify(blocked.bad));
 let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:sites["Clinic arrival"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
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

 let crops=[["01-clinic-and-west-airlock",50,430,630,430],["02-inbound-gate",385,290,545,550],["03-central-phase-actuator",875,190,560,625],["04-east-quarantine",1410,315,625,520],["05-subgrade-artery",170,735,1720,285]];
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



const receipt=(b)=>({
 concept:"Serrate Meridian - Three-Gate Exodus Spine",lane:"original/scifi-frontier-wide",original_no_source:true,
 seed:b.seed,extent:[2048,1024],material_cell_count:b.g.length,
 engine_accepted_main:"f7e056c9b8791106e22f2d1c295043783d8a9701",
 map_repo_base:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",
 loader_source_max_rectangles:32768,loader_source_max_json_bytes:1048576,source_work_budget:32000000,
 material_rule_assumption:"Only accepted inert Solid/None IDs; no fluid, falling, mobile, reactive or unsupported final material.",
 material_histogram:b.hist,filled_grounded_cells:b.area,detached_final_cells:0,final_fluid_cells:0,
 provisional_disconnected_cells_removed:b.removed,provisional_components_removed:b.removedGroups,
 rectangle_count:b.rect.length,rectangle_work:b.area,setup_bytes:b.json.length,
 grid_sha256:hash(b.g),setup_sha256:hash(b.json),
 images:b.images.map(([name,z])=>({name,bytes:z.length,sha256:hash(z)})),
 clearances:b.clearances,obstruction:{xyxy_halfopen:b.obstacle,material_id:58,
  site:"Phasewell control",purpose:"Physical 42x42 actuator-service blockage, all 32 other named sites retained with full-size 31x27 return.",result:b.blocked},
 named_sites:b.sites,literal_actor_spawn:b.sites["Clinic arrival"],crops:b.crops,
 surviving_functional_footprints:b.r2Features,
 static_status:"CREATOR-STATIC-PASS",native_status:"NATIVE-UNTESTED",
 independent_reviews:"Exact-HEAD Art/Technical/Shepherd reviews pending",
 creator_revision:"Original rooted multi-gate customs switchyard, 2026-11-21"
});
const exemplar=(b)=>({
 schema_version:1,purpose:["human_editable_canvas","procedural_exemplar","scripted_setpiece_source"],
 family:"original/scifi-frontier-wide",map_role:"asymmetric three-gate customs interchange, west rescue clinic, phasewell yard, eastern bioquarantine, three entered subgrade service compartments",
 anchor_donors:[],
 macro_topology:"longitudinal industrial migration corridor of three unlike founded portals above fractured but entered service vaults",
 density_profile:"inhabited western dense cluster, first security inspection, intentionally sparse central customs plaza, complex actuator, east medical-quarantine worktown",
 route_grammar:{spawn:"Clinic arrival",primary:"west clinic to intake portal / phasewell customs / eastern quarantine / outbound evacuation",alternatives:["open-sky high route above the real gateheads","in-ground service shafts from three different districts with surface return","wide gate apertures and western vehicle-apron detour"],named_sites:Object.keys(b.sites).length,obstruction_site:"Phasewell control",obstruction_box:b.obstacle,remaining_reachable:b.blocked.passed},
 strong_motifs:["three unlike braced gate heads, each with real Midge clearance portals","load-bearing geological abutments deliberately break continuous underground rails rather than pretending full through service","partly open clinic and quarantine rooms at ordinary Midge scale","sparse but enterable central staging yard and branching survey routes","separate 72-cell-wide descent shafts to each industrial cellar"],
 interesting_relationships:["frontier security gates and sparse social yard form lateral working infrastructure rather than isolated landscape monuments","floor-rooted and cliff-embedded load paths differ among gatehouses","each inaccessible undercroft segment can escape through its own shaft","direct atmospheric overflight coexists with restricted foot-scale manufacturing rooms"],
 authoring_affordances:["vacant central customs yard for human-built scripted encounters","unfurnished east-west apron seams for Gentek modular parts","each deep workface can be hand-detailed without altering the main flyway","gate openings make viable collapse/lockdown event candidates"],
 setpiece_candidates:[
 {name:"West inbound checkpoint",area:[400,350,752,814],event_type:"security lockdown or convoy approach",scripted:false},
 {name:"Phasewell service interruption",area:[928,240,1242,740],event_type:"machine activation / inspection outage",scripted:false},
 {name:"East quarantine transfer",area:[1515,542,1945,754],event_type:"holdout / medical rescue",scripted:false},
 {name:"Three entered freight cellars",area:[170,840,1910,1000],event_type:"recovery / separate equipment finds",scripted:false}
 ],
 procedural_exemplar_value:"Exemplar of genuinely different gate superstructures, physical load paths, nested room thresholds, editable central negative space and independently entered rail undercrofts.",
 similarity_avoidance:"Not an Orison-style island chain, Nivelle roof-suspension, Cairnstep cascading landscape, Copperwake nested cavity or Penumbral ring mill; it teaches a lateral security-gate settlement and open customs court.",
 diversity_axes:{macro_topology:"corridor",altitude_grammar:"high_low_bypass",density_cadence:"dense_open_dense",route_structure:"parallel_lanes",landmark_family:"gate",support_form:"mixed",environment_relation:"dry",incompleteness:"modular_append_zones"},
 native_status:"NATIVE-UNTESTED",source_grid_sha256:hash(b.g)
});
const routeGraph=(b)=>({
 schema_version:1,kind:"literal all-centre 4-neighbour BFS at three envelopes, plus qualitative route groupings; no assertion of distinct locally certified inter-site edges",
 extent:[2048,1024],source_grid_sha256:hash(b.g),spawn:"Clinic arrival",
 named_sites:b.sites,conservative_envelopes:[[19,15],[23,19],[31,27]],exact_bfs_proof:b.clearances,
 obstruction_test:{xyxy_halfopen:b.obstacle,material_id:58,excluded_site:"Phasewell control",result:b.blocked},
 routes:{
 primary:["Clinic arrival","Triage desk","Inbound crosswind apron","Intake scanner","Customs lockdown pocket","Phasewell control","Biofilter inspection","Bio-custody","Eastern medbay","Evacuation pad"],
 high_bypass:["Upper clinic hatch","Western lookout","Phasewell sky antenna","Eastern gate watch","Overflight return","Evacuation pad"],
 west_service:["Clinic arrival","First shaft landing","West sample tunnel","Subgrade utility"],
 central_service:["Customs open staging","Second shaft landing","Central deep assay","Deep actuator rail","Underground transfer"],
 east_service:["Quarantine lift","Third shaft landing","East deep custody","Return freight cellar","Deep eastern exit"]
 },truthfulness:"A structural grounding wall breaks the underground through passage: users must return to open sky / use other entered shafts. All exact sites are connected to literal spawn at each envelope, permitting reversible navigation."
});
const README=[
 "# Serrate Meridian - Three-Gate Exodus Spine",
 "",
 "New independently designed 2048 x 1024 true orthographic 2D CyberSand material-ID world; no reference art.",
 "",
 "Three individually engineered, tall ground-rooted frontier gates organize west clinic, intake scan, broad editable customs plaza, central phasewell motor, east bioquarantine and evacuation facilities. Deep rail is intentionally split by real bedrock-rooted supports; each resulting industrial cellar has its own 72-cell-wide entered shaft and surface recovery. This is a CORPUS exemplar for human editing and GENTEK/SWARM derivation; vacant bays are intentional.",
 "",
 "Setup-v2 uses current accepted cybersand main f7e056c9b8791106e22f2d1c295043783d8a9701; exact base map main 99a166e7fcae45eb22be1740e9f33f62faccbcc7.",
 "See receipt.json for source-grid SHA256, 2,097,152 actual cells, rectangle replay, material histogram, rooted solids and three-envelope exact-site results. See route_graph.json for reversible routing and real 42x42 actuator obstruction. All PNGs are authentic indexed-material pixels, not native screenshots.",
 "",
 "Run with stock Node.js: node build.cjs; verify exact emitted files: node build.cjs --verify.",
 "",
 "CREATOR-STATIC-PASS / NATIVE-UNTESTED / Draft-HOLD. Requires independent exact-HEAD Art/Technical/Shepherd review and installed Godot/Workbench/CyberDemoBridge/Rapier gameplay and persistence checks; never infer native PASS."
].join("\n")+"\n";
const emitted=(b)=>[
 ["setup.json",b.json],["receipt.json",JSON.stringify(receipt(b),null,2)+"\n"],
 ["exemplar.json",JSON.stringify(exemplar(b),null,2)+"\n"],
 ["route_graph.json",JSON.stringify(routeGraph(b),null,2)+"\n"],
 ["README.md",README],...b.images
];
if(typeof require!=="undefined"&&typeof module!=="undefined"&&require.main===module){
 const fs=require("fs"),path=require("path"),b=build(),files=emitted(b),verify=process.argv.includes("--verify");
 let ok=true;for(const [name,value] of files){const bytes=typeof value==="string"?Buffer.from(value,"utf8"):Buffer.from(value);
 const target=path.join(__dirname,name);
 if(verify){if(!fs.existsSync(target)||!bytes.equals(fs.readFileSync(target))){console.error("MISMATCH "+name);ok=false;}}
 else fs.writeFileSync(target,bytes);
 }
 console.log(JSON.stringify({rectangles:b.rect.length,grounded:b.area,sites:Object.keys(b.sites).length,obstruction:b.blocked.bad,grid_sha256:hash(b.g),verified:ok}));
 if(!ok)process.exitCode=1;
}
