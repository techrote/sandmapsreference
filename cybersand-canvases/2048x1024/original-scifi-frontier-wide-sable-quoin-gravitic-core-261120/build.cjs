"use strict";
function build(){
 const W=2048,H=1024,SEED=0x26B20F, g=new Uint8Array(W*H);
 const M={rock:100,schist:101,iron:49,wall:58,steel:62,blue:63,conduit:66,titanium:68,window:120,frost:121,quartz:122,glassDark:129,ceramic:130,chrome:131,signal:77,amber:79,white:80};
 let rng=SEED; function rand(){rng^=rng<<13;rng^=rng>>>17;rng^=rng<<5;return(rng>>>0)/4294967296;}
 function R(x,y,w,h,m){let x0=Math.max(0,Math.round(x)),x1=Math.min(W,Math.round(x+w)),y0=Math.max(0,Math.round(y)),y1=Math.min(H,Math.round(y+h));if(x0>=x1||y0>=y1)return;for(let yy=y0;yy<y1;yy++)g.fill(m,yy*W+x0,yy*W+x1);}
 function P(p,m){let ymin=Math.max(0,Math.floor(Math.min(...p.map(a=>a[1])))),ymax=Math.min(H-1,Math.ceil(Math.max(...p.map(a=>a[1]))));for(let y=ymin;y<=ymax;y++){let xs=[];for(let i=0;i<p.length;i++){let a=p[i],b=p[(i+1)%p.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2)R(Math.ceil(xs[i]),y,Math.max(0,Math.floor(xs[i+1])-Math.ceil(xs[i])+1),1,m);}}
 function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,r=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-r));yy<Math.min(H,Math.ceil(Math.max(y,Y)+r)+1);yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-r));xx<Math.min(W,Math.ceil(Math.max(x,X)+r)+1);xx++){let f=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(d||1)));if((xx-x-f*dx)**2+(yy-y-f*dy)**2<=r*r)g[yy*W+xx]=m;}}
 function ellipse(cx,cy,rx,ry,mat){for(let y=Math.max(0,cy-ry);y<Math.min(H,cy+ry+1);y++)for(let x=Math.max(0,cx-rx);x<Math.min(W,cx+rx+1);x++)if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)g[y*W+x]=mat;}




 // SABLE QUOIN — wholly new star-arm gravimetric core survey
 // True perpendicular 2D; left cliff rover laboratory, star collimator,
 // right sterile depot, dry understrata service chambers, sky bypass.
 const grade=x=>Math.round(911+12*Math.sin(x*.011)+5*Math.sin(x*.033));
 for(let x=0;x<W;x++)R(x,grade(x),1,H-grade(x),M.rock);
 P([[0,1024],[0,318],[45,326],[109,365],[188,420],[266,504],[345,600],[411,714],[482,848],[515,1024]],M.rock);
 P([[2048,1024],[2048,341],[2000,358],[1944,391],[1873,449],[1799,520],[1735,602],[1659,725],[1567,860],[1515,1024]],M.rock);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(g[y*W+x]===M.rock){
 let v=(y+Math.floor(x/31)+Math.round(7*Math.sin(x*.018)))%137;
 if(v<5)g[y*W+x]=M.schist;else if(v<9)g[y*W+x]=M.iron;}
 // Three inhabited left and right rock-cut storeys with genuine side exits.
 R(38,397,426,132,0);R(66,542,425,151,0);R(120,702,404,154,0);
 R(1632,407,407,137,0);R(1588,550,439,156,0);R(1565,715,459,143,0);
 R(309,900,1433,79,0);R(367,811,146,168,0);R(1526,798,147,181,0);
 for(let [x,y,w] of [[50,526,400],[77,692,400],[134,853,372],
 [1641,542,383],[1599,705,414],[1580,855,430]]){
 R(x,y,w,12,M.titanium);R(x+19,y+12,w-38,5,M.blue);}
 // West upper inhabited receipt, assay, waterless ice/isotope processing.
 R(76,511,134,10,M.steel);R(93,470,24,39,M.chrome);
 R(138,480,45,29,M.glassDark);R(169,466,10,12,M.signal);
 L(114,474,158,447,7,M.conduit);
 R(244,513,171,9,M.ceramic);R(258,464,27,46,M.frost);
 R(301,481,43,29,M.window);R(361,488,38,23,M.iron);
 R(371,473,12,12,M.amber);
 R(91,674,162,11,M.steel);R(112,625,28,46,M.chrome);
 R(160,642,50,29,M.glassDark);R(191,627,12,12,M.signal);
 R(287,680,173,10,M.titanium);R(303,633,28,44,M.iron);
 R(354,645,65,31,M.frost);L(317,635,376,617,8,M.conduit);
 R(151,839,151,11,M.ceramic);R(174,796,26,41,M.steel);
 R(209,811,55,24,M.window);R(280,812,12,20,M.glassDark);
 R(347,838,148,11,M.titanium);R(370,792,24,44,M.chrome);
 R(421,808,56,26,M.frost);R(444,791,10,15,M.signal);
 // Two unequal rooted megastanchions support the suspended five-armed device.
 L(575,910,667,447,31,M.titanium);L(655,899,742,333,18,M.chrome);
 L(1471,907,1392,402,33,M.titanium);L(1381,904,1307,299,20,M.steel);
 L(548,914,840,550,15,M.iron);L(1513,914,1235,565,14,M.chrome);
 // Broken outer observation gantries; central airspace intentionally open.
 L(480,530,719,459,15,M.titanium);L(705,467,850,482,9,M.steel);
 L(1539,509,1340,481,15,M.titanium);L(1351,475,1240,492,11,M.steel);
 for(let [x,y] of [[591,496],[691,476],[1402,480],[1482,499]]){
 L(x,y,x+10,y+50,6,M.conduit);R(x-5,y+51,26,6,M.chrome);}
 // Five distinct asymmetrical collimator ribs, not a ring or decorative roof.
 const arms=[[1079,231],[840,397],[906,680],[1169,731],[1305,462]];
 for(let i=0;i<arms.length;i++){
 let [x,y]=arms[i];L(1043,465,x,y,18,i%2?M.chrome:M.titanium);
 L(1052,475,x+9,y+9,5,M.blue);}
 ellipse(1043,465,38,36,M.iron);ellipse(1043,465,21,21,M.glassDark);
 // Offset counterweight inspection wing has open underside.
 L(1079,232,1113,172,14,M.titanium);L(1113,172,1199,215,11,M.chrome);
 R(1139,219,115,13,M.titanium);R(1157,232,77,6,M.blue);
 R(1172,187,23,31,M.frost);R(1202,200,22,17,M.glassDark);
 L(743,338,941,276,11,M.steel);L(941,276,1086,239,12,M.titanium);
 L(741,341,652,897,9,M.conduit);
 // Anchored process decks: differential sensor, comparative magnetometry.
 R(764,579,159,12,M.steel);R(782,592,119,5,M.blue);
 R(1200,600,135,13,M.titanium);R(1218,613,92,5,M.blue);
 R(784,541,22,35,M.chrome);R(817,555,47,21,M.glassDark);
 R(877,553,32,21,M.frost);R(849,537,12,13,M.signal);
 R(1216,556,24,40,M.chrome);R(1252,568,37,27,M.glassDark);
 L(1236,555,1294,531,8,M.conduit);R(1291,544,12,11,M.amber);
 // Lower bridge fragments, open flight-recovery basin between them.
 R(659,764,172,13,M.titanium);R(1261,773,156,13,M.steel);
 R(680,730,24,32,M.iron);R(715,736,51,24,M.window);
 R(1296,734,26,36,M.frost);R(1342,741,44,29,M.glassDark);
 // East: pressure isolation/vertical scrubber, spectrometer, freight transfer.
 R(1662,528,126,11,M.ceramic);R(1679,468,25,57,M.frost);
 R(1716,488,32,36,M.glassDark);R(1756,490,19,34,M.blue);
 L(1694,470,1738,453,8,M.conduit);R(1737,441,12,10,M.amber);
 R(1829,529,178,9,M.steel);R(1846,472,23,52,M.chrome);
 R(1888,492,59,29,M.window);R(1963,489,29,34,M.glassDark);
 R(1907,476,12,14,M.signal);
 R(1613,692,151,12,M.titanium);R(1634,630,24,58,M.iron);
 R(1674,641,26,47,M.frost);R(1712,657,37,30,M.glassDark);
 R(1799,690,204,12,M.steel);R(1816,633,28,55,M.chrome);
 R(1861,652,56,32,M.glassDark);R(1930,638,54,45,M.window);
 L(1839,636,1900,614,7,M.conduit);
 R(1590,840,169,11,M.ceramic);R(1615,795,23,42,M.frost);
 R(1660,807,68,30,M.window);
 R(1800,838,196,11,M.titanium);R(1817,793,25,41,M.iron);
 R(1869,787,65,47,M.glassDark);R(1941,806,35,29,M.blue);
 L(1660,850,1583,930,12,M.chrome);
 // Understrata 1: crane assay; 2: seismic press; 3: isotope filtering;
 // 4: thermal fin exchanger. Distinct rooted apparatus per reachable bay.
 R(552,982,192,10,M.steel);R(561,943,23,37,M.chrome);
 R(607,953,58,26,M.glassDark);L(571,942,625,921,6,M.conduit);
 R(684,958,41,20,M.frost);
 R(821,981,231,11,M.titanium);R(837,936,30,42,M.iron);
 R(881,946,41,31,M.blue);R(933,948,62,29,M.glassDark);
 L(849,936,967,921,7,M.conduit);R(975,913,12,11,M.amber);
 R(1131,980,211,11,M.ceramic);R(1147,944,29,34,M.chrome);
 for(let i=0;i<4;i++)R(1190+i*28,947,19,30,i%2?M.frost:M.window);
 L(1153,938,1300,922,7,M.conduit);R(1299,911,10,12,M.signal);
 R(1380,981,183,10,M.steel);R(1392,947,27,32,M.iron);
 R(1438,955,37,22,M.blue);for(let x=1495;x<1557;x+=12)R(x,938,5,39,M.chrome);
 R(1539,925,10,11,M.amber);
 // Route graph (exact coordinates; no nearest-site substitutions).
 const sites={
 "West rover arrivals":[205,451],"West isotope dock":[328,453],
 "West assay lab":[166,614],"West machine bay":[355,615],
 "West seismic studio":[236,759],"West sparework":[422,759],
 "West ridge escape":[450,353],"West rescue throat":[460,863],
 "West gantry overlook":[618,430],"Upper sky bypass":[1013,125],
 "Upper counterweight observation":[1192,147],
 "West comparator":[821,525],"Core diagnostic viewport":[1043,372],
 "Core lower cathode":[1049,617],"East comparator":[1258,550],
 "West basin recovery":[740,713],"East basin recovery":[1371,719],
 "East ridge lookdown":[1540,364],"East rescue throat":[1603,867],
 "East decon":[1773,459],"Sterile isotope lab":[1901,456],
 "East scrubber":[1677,607],"East shipping":[1884,612],
 "East rover evacuation":[1908,755],"Deep mineral assay":[632,918],
 "Deep seismic press":[922,913],"Deep isotope sorting":[1228,914],
 "Deep thermal service":[1468,914]
 };
 // Broad side-entry corridors link district decks to open basin and both exits.
 R(454,471,132,166,0);R(1468,473,165,170,0);
 R(592,422,75,174,0);R(1374,446,80,178,0);
 R(781,517,83,103,0);R(1212,523,81,112,0);
 R(1014,330,60,92,0);R(1013,577,78,74,0);
 R(322,900,1402,78,0);R(378,809,132,168,0);R(1526,804,150,174,0);
 for(const [name,[x,y]] of Object.entries(sites))R(x-19,y-17,39,35,0);
 function tieStructures(){
  const N=g.length,mark=new Int32Array(N),q=new Int32Array(N),comps=[null];
  for(let k=0;k<N;k++)if(g[k]&&!mark[k]){
   let id=comps.length,hd=0,tl=1,edge=false;q[0]=k;mark[k]=id;
   while(hd<tl){let a=q[hd++],x=a%W,y=(a/W)|0;if(!x||x===W-1||!y||y===H-1)edge=true;
    for(let n of [a-W,a+W,x?a-1:-1,x<W-1?a+1:-1])if(n>=0&&n<N&&g[n]&&!mark[n]){mark[n]=id;q[tl++]=n;}}
   comps.push({edge,count:tl});
  }
  let owner=new Int32Array(N),distance=new Uint16Array(N),origin=new Int32Array(N);
  let queue=new Int32Array(N),hd=0,tl=0;
  for(let i=0;i<N;i++)if(mark[i]){owner[i]=mark[i];origin[i]=i;queue[tl++]=i;}
  let edges=new Map();
  while(hd<tl){let a=queue[hd++],x=a%W,d=distance[a],oa=owner[a];
   for(let n of [a-W,a+W,x?a-1:-1,x<W-1?a+1:-1])if(n>=0&&n<N){
    if(!owner[n]){owner[n]=oa;origin[n]=origin[a];distance[n]=d+1;queue[tl++]=n;}
    else if(owner[n]!==oa){
     let ob=owner[n],key=Math.min(oa,ob)+":"+Math.max(oa,ob),length=d+distance[n]+1,best=edges.get(key);
     if(!best||length<best.length)edges.set(key,{a:origin[a],b:origin[n],oa,ob,length});
    }
   }
  }
  let parent=new Int32Array(comps.length);for(let i=0;i<parent.length;i++)parent[i]=i;
  function find(x){while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x];}return x;}
  for(let i=1;i<comps.length;i++)if(comps[i].edge)parent[i]=0;
  let ties=0, longest=0;
  for(let e of [...edges.values()].sort((a,b)=>a.length-b.length)){
   let a=find(e.oa),b=find(e.ob);if(a===b)continue;parent[a]=b;
   L(e.a%W,(e.a/W)|0,e.b%W,(e.b/W)|0,4,M.conduit);
   ties++;longest=Math.max(longest,e.length);
  }
  for(let i=1;i<comps.length;i++)if(find(i)!==find(0))throw Error("Disconnected component graph "+i);
  return {ties,longest};
 }



 const tie_info=tieStructures();
 // Reopen the two evacuation shafts and literal centres after anchoring.
 R(327,902,1391,75,0);R(378,816,132,160,0);R(1530,804,145,173,0);
 for(const [name,[x,y]] of Object.entries(sites))R(x-20,y-18,41,37,0);
 const r2_workcell_anchors={ties:0,longest:0};

 // Heavy load paths tie five-arm survey core and low eastern brace into 
 // native basalt outside the understrata air passage. No scenic floating mass.
 L(1079,231,20,336,8,M.conduit);
 L(1195,218,2029,356,8,M.conduit);
 L(1291,778,1391,402,9,M.chrome);
 // Two severed decorative fragments from emergency-shaft carving are erased.
 R(1609,791,61,16,0);
 R(1055,894,40,9,0);
 // Reconfirm all literal site envelopes, avoiding structure across a spawn.
 for(const [name,[x,y]] of Object.entries(sites))R(x-20,y-18,41,37,0);
 // Compact canonical full-row run vertical coalescing: 5-element ordered edits.
 let rect=[],prev=new Map(),hist={},area=0,replay=new Uint8Array(g.length);
 for(let y=0;y<H;y++){let next=new Map(),base=y*W;for(let x=0;x<W;){let m=g[base+x],s=x;while(x<W&&g[base+x]===m)x++;if(!m)continue;let k=s+":"+(x-s)+":"+m,idx=prev.get(k);if(idx===undefined){idx=rect.length;rect.push([s,y,x-s,1,m]);}else rect[idx][3]++;next.set(k,idx);}prev=next;}
 for(let [x,y,w,h,m] of rect){area+=w*h;hist[m]=(hist[m]||0)+w*h;for(let yy=y;yy<y+h;yy++)replay.fill(m,yy*W+x,yy*W+x+w);}
 if(rect.length>32768||area>32000000)throw Error("Budget "+rect.length+" "+area);
 for(let i=0;i<g.length;i++)if(replay[i]!==g[i])throw Error("Replay diverged "+i);
 // Stable inert-solid connectedness grounded to one or more real canvas edges.
 let seen=new Uint8Array(g.length),q=new Int32Array(g.length),rooted=0,unrooted=0,componentCount=0,rootedComponents=0;
 for(let k=0;k<g.length;k++)if(g[k]&&!seen[k]){componentCount++;let hq=0,tq=1,edge=false;q[0]=k;seen[k]=1;while(hq<tq){let a=q[hq++],x=a%W,y=(a/W)|0;if(x===0||x===W-1||y===0||y===H-1)edge=true;let n=[a-W,a+W,a-1,a+1];for(let j=0;j<4;j++){let b=n[j];if(b>=0&&b<g.length&&(j<2||(j===2&&x>0)||(j===3&&x<W-1))&&g[b]&&!seen[b]){seen[b]=1;q[tq++]=b;}}}if(edge){rooted+=tq;rootedComponents++;}else unrooted+=tq;}
 
 // Exact full hull 4-connected free centre BFS using area integral, no proxy targets.
 const ii=new Int32Array((W+1)*(H+1)),IW=W+1;for(let y=1;y<=H;y++){let row=0,o=(y-1)*W;for(let x=1;x<=W;x++){row+=g[o+x-1]!==0?1:0;ii[y*IW+x]=ii[(y-1)*IW+x]+row;}}
 function clear(x,y,w,h){let a=x-(w>>1),b=y-(h>>1),c=a+w,d=b+h;return a>=0&&b>=0&&c<=W&&d<=H&&ii[d*IW+c]-ii[d*IW+a]-ii[b*IW+c]+ii[b*IW+a]===0;}
 function flood(w,h,blocked){let pass=new Uint8Array(g.length),vis=new Uint8Array(g.length),queue=new Int32Array(g.length),hd=0,tl=0;
  // Physical temporary solid wall, not a centre-point-only exclusion.
  let source=ii;if(blocked){let test=g.slice();
   for(let y=blocked[1];y<blocked[3];y++)test.fill(M.wall,y*W+blocked[0],y*W+blocked[2]);
   source=new Int32Array((W+1)*(H+1));
   for(let y=1;y<=H;y++){let sum=0,o=(y-1)*W;for(let x=1;x<=W;x++){sum+=test[o+x-1]?1:0;source[y*IW+x]=source[(y-1)*IW+x]+sum;}}
  }
  function clearAt(x,y){let a=x-(w>>1),b=y-(h>>1),c=a+w,d=b+h;return a>=0&&b>=0&&c<=W&&d<=H&&source[d*IW+c]-source[d*IW+a]-source[b*IW+c]+source[b*IW+a]===0;}
  for(let y=h>>1;y<H-(h>>1);y++)for(let x=w>>1;x<W-(w>>1);x++)if(clearAt(x,y))pass[y*W+x]=1;
  let s=sites["West rover arrivals"],si=s[1]*W+s[0];if(!pass[si])throw Error("Spawn blocked "+w+" "+h);
  queue[tl++]=si;vis[si]=1;while(hd<tl){let a=queue[hd++],x=a%W;let j=a-W;if(j>=0&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}j=a+W;if(j<g.length&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}j=a-1;if(x>0&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}j=a+1;if(x<W-1&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}}
  let bad=Object.entries(sites).filter(([n,p])=>!vis[p[1]*W+p[0]]).map(([n,p])=>[n,p,clearAt(p[0],p[1])]);
  return {envelope:[w,h],centres:tl,passed:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,bad};}
 let clearances=[[19,15],[23,19],[31,27]].map(v=>flood(...v));if(clearances.some(v=>v.bad.length))throw Error("Failed exact-site clearance "+JSON.stringify(clearances));
 
 let obstructions=[[1016,329,1074,416]];
 let bypass=obstructions.map(b=>flood(31,27,b)); if(bypass[0].passed!==Object.keys(sites).length-1||bypass[0].bad[0]?.[0]!=="Core diagnostic viewport")throw Error("Bypass "+JSON.stringify(bypass));
 // Source loader exact 14-root-key v2 payload, 20? budget and accepted Midge definition.
 let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:sites["West arrivals"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
 const json=JSON.stringify(setup);if(json.length>1048576)throw Error("Setup bytes "+json.length);
 // Indexed PNG palette has ID == raw material cell, every output scanline is unfiltered.
 const colors={0:[8,11,18],49:[70,83,99],58:[119,123,128],62:[126,141,153],63:[49,100,119],66:[74,85,93],68:[102,119,129],77:[55,243,228],79:[255,181,46],80:[236,248,255],100:[54,56,61],101:[24,19,32],120:[156,210,220],121:[190,216,225],122:[226,236,244],129:[33,70,110],130:[52,56,63],131:[168,171,177]};
 function be(n){return[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255];}
 function crc(a){let c=0xffffffff;for(let v of a){c^=v;for(let j=0;j<8;j++)c=c>>>1^(0xedb88320&-(c&1));}return(c^0xffffffff)>>>0;}
 function chunk(name,d){let b=new Uint8Array(d.length+12);b.set(be(d.length));b.set(name.split("").map(c=>c.charCodeAt(0)),4);b.set(d,8);b.set(be(crc(b.subarray(4,d.length+8))),d.length+8);return b;}
 function rev(v,n){let z=0;while(n--){z=(z<<1)|(v&1);v>>>=1;}return z;}
 function zip(raw){let o=[120,1],bits=0,n=0;
  function wr(v,k){bits|=v<<n;n+=k;while(n>=8){o.push(bits&255);bits>>>=8;n-=8;}}
  function sym(s){let v,k;if(s<=143){v=48+s;k=8;}else if(s<=255){v=400+s-144;k=9;}else if(s<=279){v=s-256;k=7;}else{v=192+s-280;k=8;}wr(rev(v,k),k);}
  const lb=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],le=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
  function run(len){let a=0;while(a<28&&lb[a+1]<=len)a++;sym(a+257);if(le[a])wr(len-lb[a],le[a]);wr(0,5);}
  wr(1,1);wr(1,2);for(let i=0;i<raw.length;){let l=1;while(i+l<raw.length&&l<258&&raw[i+l]===raw[i])l++;if(l>=4&&i>0&&raw[i-1]===raw[i]){run(l);i+=l;}else{sym(raw[i]);i++;}}sym(256);if(n)o.push(bits&255);
  let a=1,b=0;for(let x of raw){a=(a+x)%65521;b=(b+a)%65521;}o.push(...be(((b<<16)|a)>>>0));return new Uint8Array(o);}
 let pal=new Uint8Array(132*3);for(let k=0;k<132;k++)pal.set(colors[k]||[100,100,100],k*3);
 function png(x0,y0,w,h){let raw=new Uint8Array((w+1)*h);for(let y=0;y<h;y++)raw.set(g.subarray((y+y0)*W+x0,(y+y0)*W+x0+w),y*(w+1)+1);
  let a=[new Uint8Array([137,80,78,71,13,10,26,10]),chunk("IHDR",new Uint8Array([...be(w),...be(h),8,3,0,0,0])),chunk("PLTE",pal),chunk("IDAT",zip(raw)),chunk("IEND",new Uint8Array())];
  let b=new Uint8Array(a.reduce((s,p)=>s+p.length,0)),i=0;for(let p of a){b.set(p,i);i+=p.length;}return b;}
 const crops=[["01-west-isotope-port",0,320,552,580],["02-west-collimator-support",525,270,600,580],["03-star-core-laboratory",753,170,665,620],["04-east-sterile-depot",1480,320,568,580],["05-understrata-workcells",432,811,1192,213]];
 const images=[["overview.png",png(0,0,W,H)],...crops.map(([name,x,y,w,h])=>[name+".png",png(x,y,w,h)])];
 return {g,json,rect,hist,area,sites,clearances,bypass,rooted,unrooted,componentCount,rootedComponents,crops,images,tie_info,r2_workcell_anchors,seed:SEED};
}

function sha256(input){let b=typeof input==="string"?Uint8Array.from(input,c=>c.charCodeAt(0)):input;
const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
const n=(b.length+9+63)&~63,buf=new Uint8Array(n);buf.set(b);buf[b.length]=128;let bits=b.length*8;for(let i=0;i<8;i++){buf[n-1-i]=bits&255;bits=Math.floor(bits/256);}
let h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64);let rotr=(x,n)=>(x>>>n)|(x<<(32-n));
for(let off=0;off<n;off+=64){for(let j=0;j<16;j++){let i=off+j*4;w[j]=((buf[i]<<24)|(buf[i+1]<<16)|(buf[i+2]<<8)|buf[i+3])>>>0;}for(let j=16;j<64;j++){let p=w[j-15],q=w[j-2];w[j]=(w[j-16]+(rotr(p,7)^rotr(p,18)^(p>>>3))+w[j-7]+(rotr(q,17)^rotr(q,19)^(q>>>10)))>>>0;}let [a,b0,c,d,e,f,g,z]=h;for(let j=0;j<64;j++){let t1=(z+(rotr(e,6)^rotr(e,11)^rotr(e,25))+((e&f)^(~e&g))+K[j]+w[j])>>>0,t2=((rotr(a,2)^rotr(a,13)^rotr(a,22))+((a&b0)^(a&c)^(b0&c)))>>>0;z=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b0;b0=a;a=(t1+t2)>>>0;}for(let j=0;j<8;j++)h[j]=(h[j]+[a,b0,c,d,e,f,g,z][j])>>>0;}return h.map(n=>n.toString(16).padStart(8,"0")).join("");}
function makeReceipt(a){return {concept:"Sable Quoin - Gravitic Core Survey and Fracture Bridge",lane:"original/scifi-frontier-wide",original_no_source:true,seed:a.seed,extent:[2048,1024],material_cell_count:a.g.length,engine_accepted_main:"de109d0131641d6adc8d25bb9ced7ca3d4991105",reference_repo_default_main:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",source_loader_max_rectangles:32768,source_loader_max_setup_bytes:1048576,source_rectangle_work_budget:32000000,bridge_legacy_capacity_risk:4096,material_rule_assumption:"Only catalogue-supported static inert immobile Solid/None IDs; no powder, fluids, reactive or combustible foundation",material_histogram:a.hist,filled_material_cells:a.area,grounded_cells:a.rooted,ungrounded_cells:a.unrooted,grounded_components:a.rootedComponents,all_solid_components:a.componentCount,physical_fixture_ties:a.tie_info,r2_workcell_anchors:a.r2_workcell_anchors,creator_revision:'R1 original from-scratch star-collimator engineering 2026-11-20',nonoverlapping_ordered_rectangles:a.rect.length,rectangle_work:a.area,setup_bytes:a.json.length,material_plane_sha256:sha256(a.g),setup_sha256:sha256(a.json),images:a.images.map(([name,b])=>({name,bytes:b.length,sha256:sha256(b)})),clearance:a.clearances,physical_obstruction:{cell_box_xyxy:[1016,329,1074,416],material_id:58,purpose:"Blocks only exact Core diagnostic viewport; all other named destinations remain recoverable",result:a.bypass},sites:a.sites,crops:a.crops,source_art:"None; wholly new original invented sci-fi frontier",static_construction:"PASS",native_status:"NATIVE-UNTESTED",review_status:"Await independent exact-head Art / Technical / Shepherd; Draft/HOLD"};}

if(typeof require!=="undefined"&&require.main===module){
 const fs=require("fs"),path=require("path"),crypto=require("crypto"),zlib=require("zlib");
 const a=build(),receipt=JSON.stringify(makeReceipt(a),null,2)+"\n";
 const output=[["setup.json",Buffer.from(a.json)],["receipt.json",Buffer.from(receipt)],...a.images.map(([n,b])=>[n,Buffer.from(b)])];
 function cmpCrypto(v){return crypto.createHash("sha256").update(v).digest("hex");}
 for(const [name,buf] of output)if(sha256(buf)!==cmpCrypto(buf))throw Error("SHA256 crosscheck "+name);
 // Independent Node zlib decode, CRC-32 per chunk, dimensions, raw palette indices.
 function crc(b){let c=0xffffffff;for(let v of b){c^=v;for(let i=0;i<8;i++)c=(c>>>1)^(0xedb88320&-(c&1));}return(c^0xffffffff)>>>0;}
 for(let [name,bytes] of a.images){
  let b=Buffer.from(bytes),i=8,w,h,ids=[],count=0;if(b.subarray(0,8).toString("hex")!=="89504e470d0a1a0a")throw Error("PNG signature "+name);
  while(i<b.length){let n=b.readUInt32BE(i),k=b.toString("ascii",i+4,i+8),span=b.subarray(i+4,i+8+n);if(crc(span)!==b.readUInt32BE(i+8+n))throw Error("CRC "+name+" "+k);
   if(k==="IHDR"){w=b.readUInt32BE(i+8);h=b.readUInt32BE(i+12);if(b[i+17]!==3)throw Error("Not indexed material PNG");}
   if(k==="IDAT")ids.push(b.subarray(i+8,i+8+n));if(k==="IEND")count++;i+=n+12;}
  if(i!==b.length||count!==1)throw Error("PNG length/IEND "+name);
  let [x0,y0,ew,eh]=name==="overview.png"?[0,0,2048,1024]:a.crops.find(c=>c[0]+".png"===name).slice(1);
  if(w!==ew||h!==eh)throw Error("PNG crop size "+name);
  let raw=zlib.inflateSync(Buffer.concat(ids));if(raw.length!==(w+1)*h)throw Error("Inflated raw length "+name);
  for(let y=0;y<h;y++){let p=y*(w+1);if(raw[p]!==0)throw Error("Filter "+name);for(let x=0;x<w;x++)if(raw[p+1+x]!==a.g[(y+y0)*2048+x+x0])throw Error("Grid-to-PNG pixel mismatch "+name+" "+x+","+y);}
 }
 let verify=process.argv.includes("--verify");
 for(const [name,buf] of output){let target=path.join(__dirname,name);if(verify){if(!fs.existsSync(target)||!fs.readFileSync(target).equals(buf))throw Error("Noncanonical output: "+name);}
  else fs.writeFileSync(target,buf);}
 console.log(JSON.stringify({status:"CREATOR-STATIC-PASS",verified_files:output.map(q=>q[0]),plane_sha256:makeReceipt(a).material_plane_sha256,rectangles:a.rect.length,sites:a.clearances.map(c=>c.passed),obstruction_other_sites:Object.keys(a.sites).length-1,png_decoded_pixel_parity:"PASS",native:"NATIVE-UNTESTED",verify},null,2));
}
