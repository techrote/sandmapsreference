"use strict";
function build(){
 const W=2048,H=1024,SEED=0x26B520, g=new Uint8Array(W*H);
 const M={rock:100,schist:101,iron:49,wall:58,steel:62,blue:63,conduit:66,titanium:68,window:120,frost:121,quartz:122,glassDark:129,ceramic:130,chrome:131,signal:77,amber:79,white:80};
 let rng=SEED; function rand(){rng^=rng<<13;rng^=rng>>>17;rng^=rng<<5;return(rng>>>0)/4294967296;}
 function R(x,y,w,h,m){let x0=Math.max(0,Math.round(x)),x1=Math.min(W,Math.round(x+w)),y0=Math.max(0,Math.round(y)),y1=Math.min(H,Math.round(y+h));if(x0>=x1||y0>=y1)return;for(let yy=y0;yy<y1;yy++)g.fill(m,yy*W+x0,yy*W+x1);}
 function P(p,m){let ymin=Math.max(0,Math.floor(Math.min(...p.map(a=>a[1])))),ymax=Math.min(H-1,Math.ceil(Math.max(...p.map(a=>a[1]))));for(let y=ymin;y<=ymax;y++){let xs=[];for(let i=0;i<p.length;i++){let a=p[i],b=p[(i+1)%p.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2)R(Math.ceil(xs[i]),y,Math.max(0,Math.floor(xs[i+1])-Math.ceil(xs[i])+1),1,m);}}
 function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,r=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-r));yy<Math.min(H,Math.ceil(Math.max(y,Y)+r)+1);yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-r));xx<Math.min(W,Math.ceil(Math.max(x,X)+r)+1);xx++){let f=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(d||1)));if((xx-x-f*dx)**2+(yy-y-f*dy)**2<=r*r)g[yy*W+xx]=m;}}
 function ellipse(cx,cy,rx,ry,mat){for(let y=Math.max(0,cy-ry);y<Math.min(H,cy+ry+1);y++)for(let x=Math.max(0,cx-rx);x<Math.min(W,cx+rx+1);x++)if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)g[y*W+x]=mat;}




 // NACRE FAULT — BIOFOUNDRY CABLEWAY. An invented inhabited xenobotanical
 // laboratory spanning a tectonic fault on a twin-buttress cableborne railway.
 // True perpendicular side elevation, no visual perspective or reference image.
 const shelf=x=>Math.round(895+11*Math.sin(x*.010)+7*Math.cos(x*.025));
 for(let x=0;x<W;x++){let y=shelf(x);R(x,y,1,H-y,M.rock);}
 P([[0,1024],[0,314],[51,328],[142,381],[248,463],[355,621],[472,861],[514,1024]],M.rock);
 P([[2048,1024],[2048,335],[1998,362],[1918,397],[1791,491],[1706,650],[1602,856],[1568,1024]],M.rock);
 // Strata are actual stationary solid IDs; no sand or falling pseudo-support.
 for(let y=0;y<H;y++){let off=y*W;for(let x=0;x<W;x++)if(g[off+x]===M.rock){
 let k=(y+Math.floor(x/13)+Math.round(6*Math.sin(x*.022)))%137;
 if(k<7)g[off+x]=M.schist;else if(k<10)g[off+x]=M.iron;
 }}
 // Long subterranean transit route, side-entry galleries and lower catch tunnels.
 R(400,920,1262,62,0);R(349,835,95,168,0);R(1600,846,108,150,0);
 for(const [x,y,w,h] of [[32,367,358,119],[55,500,377,112],[99,626,373,111],[163,754,318,92],
 [1628,403,385,107],[1616,525,402,117],[1592,667,407,108],[1638,788,363,80]])R(x,y,w,h,0);
 // Excavated floors, aligned to industrial door and Midge hull scales.
 for(let [x,y,w] of [[58,485,325],[68,610,357],[112,736,351],[177,845,293],
 [1645,510,360],[1630,642,370],[1606,775,380],[1652,866,331]]){
 R(x,y,w,11,M.steel);R(x+12,y+11,w-24,5,M.blue);
 }
 // Deep rock bore support ties and two separated access shafts.
 for(let x of [463,759,1118,1451]){
 R(x,981,24,43,M.titanium);R(x+5,985,14,35,M.conduit);
 }
 // Central negative space retains a genuine traversable open aerial basin.
 // Grounded asymmetrical pylons and diagonal compression members, not scenery.
 L(495,883,665,416,29,M.titanium);
 L(539,891,729,444,17,M.steel);
 L(1570,880,1341,430,31,M.titanium);
 L(1534,888,1299,459,17,M.steel);
 L(655,427,711,361,13,M.chrome);
 L(1360,424,1299,352,13,M.chrome);
 // Sagging dual guideways, with physically intelligible tension struts.
 const cable=[[388,318],[530,346],[674,385],[826,410],[1018,423],[1210,409],[1379,384],[1533,347],[1674,320]];
 for(let i=1;i<cable.length;i++){let a=cable[i-1],b=cable[i];
 L(a[0],a[1],b[0],b[1],9,M.titanium);L(a[0],a[1]+24,b[0],b[1]+24,6,M.conduit);}
 for(let i=0;i<cable.length;i++){let [x,y]=cable[i];L(x,y,x,y+26,5,M.chrome);}
 // Paired but intentionally asymmetric pods: left seedfoundry, right xenoculture clinic.
 // Their side walls, roof ribs, floors, process machines are actual cells.
 function pod(x,y,w,h,variant){
 R(x,y,w,12,M.titanium);R(x,y+h-12,w,12,M.steel);
 R(x,y,13,h,M.titanium);R(x+w-13,y,13,h,M.steel);
 R(x+24,y+72,w-48,9,M.ceramic);
 for(let xx=x+24;xx<x+w-24;xx+=34){
  R(xx,y+12,24,24,(xx/34|0)%2?M.window:M.glassDark);
  R(xx+4,y+42,16,10,M.blue);
 }
 for(let xx=x+20;xx<x+w-20;xx+=55){
  L(xx,y+12,xx+24,y-26,5,M.chrome);
  R(xx+14,y+80,10,23,M.conduit);
 }
 if(variant===1){
  R(x+35,y+137,w-70,12,M.steel);R(x+46,y+112,18,24,M.frost);
  for(let i=0;i<4;i++){let xx=x+72+i*36;R(xx,y+118,20,18,M.window);R(xx+6,y+107,8,10,M.signal);}
  R(x+38,y+176,w-78,9,M.ceramic);
  L(x+53,y+171,x+64,y+138,6,M.chrome);
 }else{
  R(x+44,y+142,w-87,12,M.steel);
  for(let i=0;i<4;i++){let xx=x+65+i*44;R(xx,y+111,24,30,M.frost);R(xx+8,y+103,8,8,M.amber);}
  R(x+40,y+174,w-79,9,M.chrome);
  L(x+w-68,y+140,x+w-43,y+174,6,M.conduit);
 }
 }
 pod(677,460,249,237,1);
 pod(1132,467,270,225,2);
 // Main aerial people-scale gantries; deliberately wide spaces above and below.
 R(921,555,226,12,M.titanium);R(935,575,200,4,M.conduit);
 L(902,694,938,566,10,M.steel);L(1390,690,1145,566,11,M.steel);
 // Vertical trolley hangers and two service cages.
 for(let [x,y] of [[744,387],[1218,407]]){
 L(x,y,x,y+56,9,M.chrome);
 R(x-31,y+57,62,9,M.titanium);R(x-29,y+69,10,49,M.steel);
 R(x+19,y+69,10,49,M.steel);R(x-19,y+107,38,7,M.ceramic);
 }
 // West rider docking, rover garages, seedbank assay and quarantine worktops.
 R(100,469,116,12,M.chrome);L(112,464,142,434,8,M.steel);
 R(154,444,45,21,M.window);R(168,428,16,14,M.signal);
 R(247,468,125,11,M.titanium);R(263,435,72,28,M.iron);R(289,423,28,11,M.window);
 for(let xx of [109,142,175,208]){R(xx,581,19,26,M.window);R(xx+6,570,7,11,M.amber);}
 R(276,586,93,13,M.steel);R(283,559,13,27,M.chrome);
 R(312,572,41,14,M.glassDark);R(327,562,10,10,M.signal);
 R(124,710,124,12,M.ceramic);
 for(let xx of [140,172,204]){R(xx,674,20,34,M.frost);R(xx+6,666,8,8,M.signal);}
 R(295,716,124,11,M.titanium);R(306,679,25,36,M.chrome);
 R(346,693,48,22,M.iron);R(352,683,12,10,M.amber);
 R(190,821,135,12,M.steel);R(205,787,78,30,M.glassDark);
 R(215,773,15,13,M.signal);R(348,812,90,9,M.chrome);
 // East receiving district: decon, sample cleanroom, battery/rover freight.
 R(1689,495,124,11,M.ceramic);
 for(let xx of [1699,1735,1771]){R(xx,464,22,29,M.frost);R(xx+6,454,8,10,M.signal);}
 R(1851,492,129,12,M.chrome);R(1865,459,25,31,M.window);
 R(1908,473,52,17,M.glassDark);
 R(1648,623,148,12,M.steel);
 for(let xx of [1670,1711,1752]){R(xx,588,25,33,M.window);R(xx+7,579,10,9,M.amber);}
 R(1838,621,140,13,M.titanium);R(1855,590,29,29,M.iron);
 R(1906,584,41,35,M.glassDark);R(1939,571,12,14,M.signal);
 R(1620,755,159,11,M.ceramic);R(1642,723,23,31,M.chrome);
 R(1691,732,68,19,M.iron);R(1721,717,13,13,M.signal);
 R(1820,752,152,11,M.steel);R(1836,717,22,32,M.window);R(1880,731,73,18,M.glassDark);
 R(1657,842,128,12,M.chrome);R(1674,805,24,35,M.iron);
 R(1730,821,35,16,M.signal);R(1847,842,126,12,M.ceramic);
 // Underground service islands - distinct geology, water-reclamation and archive.
 const vaults=[[530,972,165],[808,973,145],[1080,973,163],[1362,973,152]];
 for(let [x,y,w] of vaults){
 R(x,y,w,10,M.titanium);R(x+15,y-35,w-30,9,M.ceramic);
 L(x+8,y-26,x+8,y+2,5,M.steel);L(x+w-8,y-25,x+w-8,y+2,5,M.steel);
 }
 for(let xx of [548,584,620]){R(xx,949,18,21,M.window);R(xx+5,940,8,8,M.signal);}
 for(let xx of [823,875,919]){R(xx,948,23,23,M.glassDark);R(xx+6,940,9,8,M.amber);}
 for(let xx of [1095,1136,1177]){R(xx,941,22,29,M.frost);R(xx+5,933,9,8,M.signal);}
 for(let xx of [1377,1420,1464]){R(xx,949,20,23,M.window);R(xx+6,941,8,8,M.amber);}
 // Single exact-position Midge spawn, independently reachable named destinations.
 const sites={
 "West rover checkpoint":[228,552],"Rover crane":[159,412],
 "Biofoundry assay":[211,652],"Specimen freezer":[261,793],
 "West cliff turnout":[466,731],"Winch lookout":[527,365],
 "Upper guideway west":[700,324],"Seedfoundry entry":[773,521],
 "Seedfoundry lower lab":[810,630],"Midline service hatch":[1000,526],
 "Lagrange transfer":[1006,360],"Cableway sky recovery":[1023,120],
 "Xenoculture east":[1233,527],"Quarantine research pod":[1252,627],
 "Upper guideway east":[1379,330],"East aero stairs":[1507,706],
 "Eastern decon":[1760,440],"East xenoculture library":[1841,570],
 "Freight battery room":[1815,710],"East descent":[1748,905],
 "Underfault geoarchive":[606,914],"Return pump plant":[866,914],
 "Biomass reclaimed store":[1151,914],"Deep climatology":[1451,915],
 "Open basin recovery":[1027,794],"Ridge observation":[1822,365]
 };
 // Author route graph before clearing: high guideway, central staffed lab
 // traversal, underground alternative, and open-sky rescue.
 const paths=[
 [[228,552],[411,530],[565,501],[710,521],[773,521],[923,526],[1000,526],[1118,527],[1233,527],[1457,523],[1656,530],[1841,570]],
 [[228,552],[230,412],[159,412],[300,328],[527,365],[700,324],[1006,360],[1379,330],[1600,350],[1822,365],[1760,440]],
 [[773,521],[810,630],[945,643],[1027,794],[1140,644],[1252,627],[1233,527]],
 [[228,552],[211,652],[261,793],[466,731],[606,914]],
 [[606,914],[866,914],[1151,914],[1451,915],[1748,905],[1815,710]],
 [[1841,570],[1815,710],[1748,905]],
 [[1000,526],[1006,360],[1023,120],[1379,330]],
 [[527,365],[640,145],[1023,120],[1475,161],[1822,365]],
 [[466,731],[620,770],[1027,794],[1415,772],[1507,706],[1815,710]],
 [[1151,914],[1252,627]],[[866,914],[810,630]],
 [[1507,706],[1233,527]],[[1760,440],[1841,570],[1815,710]]
 ];
 const carve=(a,b,t=76)=>L(a[0],a[1],b[0],b[1],t,0);
 for(let path of paths)for(let j=1;j<path.length;j++)carve(path[j-1],path[j],78);
 // Main belowground gallery: one unbroken navigable tunnel, genuine rock above/below.
 R(431,895,1205,56,0);R(397,845,83,117,0);R(1590,848,119,120,0);
 for(let [name,[x,y]] of Object.entries(sites))R(x-21,y-19,43,39,0);
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
 // Reclear exact named spawn and site hulls after connectivity anchoring.
 for(let [name,[x,y]] of Object.entries(sites))R(x-22,y-20,45,41,0);
 // The fault bore remains a genuine lower return even if transfer is blocked.
 R(454,902,1164,46,0);
 const r2_connection_bridges=tieStructures();
 for(let [name,[x,y]] of Object.entries(sites))R(x-21,y-19,43,39,0);

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
  let s=sites["West rover checkpoint"],si=s[1]*W+s[0];if(!pass[si])throw Error("Spawn blocked "+w+" "+h);
  queue[tl++]=si;vis[si]=1;while(hd<tl){let a=queue[hd++],x=a%W;let j=a-W;if(j>=0&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}j=a+W;if(j<g.length&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}j=a-1;if(x>0&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}j=a+1;if(x<W-1&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}}
  let bad=Object.entries(sites).filter(([n,p])=>!vis[p[1]*W+p[0]]).map(([n,p])=>[n,p,clearAt(p[0],p[1])]);
  return {envelope:[w,h],centres:tl,passed:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,bad};}
 if(unrooted!==0)throw Error("Detached material cells: "+unrooted);
 let clearances=[[19,15],[23,19],[31,27]].map(v=>flood(...v));if(clearances.some(v=>v.bad.length))throw Error("Failed exact-site clearance "+JSON.stringify(clearances));
 
 let obstructions=[[964,495,1039,557]];
 let bypass=obstructions.map(b=>flood(31,27,b)); if(bypass[0].passed!==Object.keys(sites).length-1||bypass[0].bad[0]?.[0]!=="Midline service hatch")throw Error("Bypass "+JSON.stringify(bypass));
 // Source loader exact 14-root-key v2 payload, 20? budget and accepted Midge definition.
 let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:sites["West rover checkpoint"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
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
 const crops=[["01-west-rover",0,310,500,574],["02-seedfoundry",534,268,435,506],["03-cable-transfer",907,275,277,469],["04-xenoculture",1109,285,446,490],["05-east-quarantine",1590,346,458,546],["06-underfault",468,843,1150,181]];
 const images=[["overview.png",png(0,0,W,H)],...crops.map(([name,x,y,w,h])=>[name+".png",png(x,y,w,h)])];
 return {g,json,rect,hist,area,sites,clearances,bypass,rooted,unrooted,componentCount,rootedComponents,crops,images,tie_info,r2_extra_ties:r2_connection_bridges,seed:SEED};
}

function sha256(input){let b=typeof input==="string"?Uint8Array.from(input,c=>c.charCodeAt(0)):input;
const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
const n=(b.length+9+63)&~63,buf=new Uint8Array(n);buf.set(b);buf[b.length]=128;let bits=b.length*8;for(let i=0;i<8;i++){buf[n-1-i]=bits&255;bits=Math.floor(bits/256);}
let h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64);let rotr=(x,n)=>(x>>>n)|(x<<(32-n));
for(let off=0;off<n;off+=64){for(let j=0;j<16;j++){let i=off+j*4;w[j]=((buf[i]<<24)|(buf[i+1]<<16)|(buf[i+2]<<8)|buf[i+3])>>>0;}for(let j=16;j<64;j++){let p=w[j-15],q=w[j-2];w[j]=(w[j-16]+(rotr(p,7)^rotr(p,18)^(p>>>3))+w[j-7]+(rotr(q,17)^rotr(q,19)^(q>>>10)))>>>0;}let [a,b0,c,d,e,f,g,z]=h;for(let j=0;j<64;j++){let t1=(z+(rotr(e,6)^rotr(e,11)^rotr(e,25))+((e&f)^(~e&g))+K[j]+w[j])>>>0,t2=((rotr(a,2)^rotr(a,13)^rotr(a,22))+((a&b0)^(a&c)^(b0&c)))>>>0;z=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b0;b0=a;a=(t1+t2)>>>0;}for(let j=0;j<8;j++)h[j]=(h[j]+[a,b0,c,d,e,f,g,z][j])>>>0;}return h.map(n=>n.toString(16).padStart(8,"0")).join("");}
function makeReceipt(a){return {concept:"Nacre Fault - Biofoundry Cableway",lane:"original/scifi-frontier-wide",original_no_source:true,seed:a.seed,extent:[2048,1024],material_cell_count:a.g.length,engine_accepted_main:"de109d0131641d6adc8d25bb9ced7ca3d4991105",reference_repo_default_main:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",source_loader_max_rectangles:32768,source_loader_max_setup_bytes:1048576,source_rectangle_work_budget:32000000,bridge_legacy_capacity_risk:4096,material_rule_assumption:"Accepted catalog inert static solid IDs only (Basalt/Obsidian and architectural solids), no fluid or reactive foundation",material_histogram:a.hist,filled_material_cells:a.area,grounded_cells:a.rooted,ungrounded_cells:a.unrooted,grounded_components:a.rootedComponents,all_solid_components:a.componentCount,physical_fixture_ties:a.tie_info,final_anchor_ties:a.r2_extra_ties,nonoverlapping_ordered_rectangles:a.rect.length,rectangle_work:a.area,setup_bytes:a.json.length,material_plane_sha256:sha256(a.g),setup_sha256:sha256(a.json),images:a.images.map(([name,b])=>({name,bytes:b.length,sha256:sha256(b)})),clearance:a.clearances,physical_obstruction:{cell_box_xyxy:[964,495,1039,557],material_id:58,purpose:"Blocks only literal central Midline service hatch; all other sites recover over the high guideway and below the fault",result:a.bypass},sites:a.sites,crops:a.crops,source_art:"None; original science fiction level geometry",static_construction:"PASS",native_status:"NATIVE-UNTESTED",review_status:"Independent exact-head Art / Technical / Shepherd pending; Draft/HOLD"};}

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
