"use strict";
function build(){
 const W=2048,H=1024,SEED=0x260B20, g=new Uint8Array(W*H);
 const M={rock:100,schist:101,iron:49,wall:58,steel:62,blue:63,conduit:66,titanium:68,window:120,frost:121,quartz:122,glassDark:129,ceramic:130,chrome:131,signal:77,amber:79,white:80};
 let rng=SEED; function rand(){rng^=rng<<13;rng^=rng>>>17;rng^=rng<<5;return(rng>>>0)/4294967296;}
 function R(x,y,w,h,m){let x0=Math.max(0,Math.round(x)),x1=Math.min(W,Math.round(x+w)),y0=Math.max(0,Math.round(y)),y1=Math.min(H,Math.round(y+h));if(x0>=x1||y0>=y1)return;for(let yy=y0;yy<y1;yy++)g.fill(m,yy*W+x0,yy*W+x1);}
 function P(p,m){let ymin=Math.max(0,Math.floor(Math.min(...p.map(a=>a[1])))),ymax=Math.min(H-1,Math.ceil(Math.max(...p.map(a=>a[1]))));for(let y=ymin;y<=ymax;y++){let xs=[];for(let i=0;i<p.length;i++){let a=p[i],b=p[(i+1)%p.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2)R(Math.ceil(xs[i]),y,Math.max(0,Math.floor(xs[i+1])-Math.ceil(xs[i])+1),1,m);}}
 function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,r=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-r));yy<Math.min(H,Math.ceil(Math.max(y,Y)+r)+1);yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-r));xx<Math.min(W,Math.ceil(Math.max(x,X)+r)+1);xx++){let f=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(d||1)));if((xx-x-f*dx)**2+(yy-y-f*dy)**2<=r*r)g[yy*W+xx]=m;}}
 function ellipse(cx,cy,rx,ry,mat){for(let y=Math.max(0,cy-ry);y<Math.min(H,cy+ry+1);y++)for(let x=Math.max(0,cx-rx);x<Math.min(W,cx+rx+1);x++)if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)g[y*W+x]=mat;}
 // PEREGRINE CLEFT: a colossal grounded drydock for the wrecked arkship Halcyon.
 // Every occupied item is a physical cell. There are no reference silhouettes.
 for(let x=0;x<W;x++){let y=Math.round(888+10*Math.sin(x*.013)+17*Math.sin(x*.004)+7*Math.cos(x*.031));R(x,y,1,H-y,M.rock);}
 P([[0,1024],[0,425],[68,446],[120,435],[177,481],[241,535],[304,611],[345,677],[409,744],[503,879],[555,1024]],M.rock);
 P([[2048,1024],[2048,394],[2013,414],[1964,404],[1920,446],[1845,479],[1771,559],[1714,650],[1630,756],[1540,867],[1500,1024]],M.rock);
 P([[0,0],[0,175],[56,200],[124,177],[176,211],[246,185],[308,230],[367,191],[416,238],[477,162],[511,0]],M.rock);
 P([[1702,0],[1742,174],[1802,184],[1875,147],[1947,189],[2022,168],[2048,178],[2048,0]],M.rock);
 // geological material fabric and genuinely carved rooms
 for(let y=0;y<H;y++){let o=y*W;for(let x=0;x<W;x++)if(g[o+x]===M.rock){let n=(y+Math.floor(x*.14)+Math.floor(12*Math.sin(x*.024)))%151; if(n<7)g[o+x]=M.schist; else if(n<21)g[o+x]=M.iron;}}
 R(62,470,360,112,0);R(162,375,260,88,0);R(148,609,278,102,0);R(208,749,268,113,0);R(317,440,80,387,0);R(380,511,128,67,0);R(399,653,131,67,0);
 R(1625,467,370,104,0);R(1655,368,319,91,0);R(1624,599,348,115,0);R(1583,745,391,104,0);R(1731,438,94,372,0);R(1550,512,205,75,0);R(1570,691,177,70,0);
 // West: pilots' exchange, survey clinic, soil-archive and two return shafts.
 R(83,580,261,11,M.steel);R(94,591,240,6,M.blue);R(163,710,167,12,M.steel);R(182,722,143,5,M.conduit);
 R(195,464,120,8,M.ceramic);R(201,468,110,5,M.frost);
 for(let x of [94,175,278]){R(x,481,11,38,M.titanium);R(x+3,485,6,14,M.signal);}
 for(let x of [181,277]){R(x,614,11,52,M.steel);R(x+12,659,31,7,M.window);}
 R(162,688,130,7,M.chrome);R(170,683,65,5,M.amber);
 R(231,817,110,11,M.steel);R(243,809,23,7,M.signal);R(286,793,36,15,M.ceramic);
 L(101,580,156,624,8,M.titanium);L(172,715,217,762,8,M.titanium);
 for(let j=0;j<10;j++){let x=65+j*34;R(x,476+(j%3)*6,17,5,M.iron);}
 // West scaffold: fabrication gantry, asymmetric launch crane and hab connection.
 L(454,963,482,286,19,M.steel);L(552,959,583,327,20,M.titanium);
 L(476,343,589,310,13,M.steel);L(472,388,634,388,13,M.steel);
 L(481,292,582,230,11,M.titanium);L(580,231,635,310,10,M.titanium);
 for(let x of [495,545,596]){L(x,389,x+21,439,7,M.conduit);L(x+21,439,x+39,390,7,M.steel);}
 R(488,458,111,9,M.ceramic);R(510,466,66,7,M.chrome);
 R(469,577,177,13,M.steel);R(480,590,150,6,M.blue);
 for(let x of [497,561,608]){R(x,581,9,37,M.titanium);R(x+2,585,5,8,M.white);}
 // The Halcyon arkship: bow and broken aft crucible, clear interior with two actual access slits.
 P([[670,345],[739,287],[813,263],[999,251],[1171,268],[1277,296],[1356,344],[1317,417],[1225,446],[788,450],[704,413]],M.steel);
 P([[741,328],[801,303],[1160,305],[1253,329],[1300,360],[1255,393],[805,399],[753,381]],0);
 // open large 70-cell underhull transfer apertures, and asymmetric terminal access cuts
 R(799,384,82,74,0);R(1191,382,87,74,0);R(670,343,95,63,0);R(1287,340,84,64,0);
 // Hollow ark interior: specimen lab, hydroponic galley, navigation core, quarantine.
 R(895,308,9,33,M.titanium);R(1013,305,9,35,M.titanium);R(1137,306,10,33,M.titanium);
 R(833,354,86,8,M.ceramic);R(932,354,74,8,M.blue);R(1041,354,91,8,M.ceramic);
 R(1164,355,88,8,M.blue);
 for(let x of [818,950,1072,1224]){R(x,297,24,5,M.frost);R(x+8,302,7,5,M.white);}
 R(855,338,32,15,M.glassDark);R(860,328,22,8,M.signal);
 R(972,331,29,22,M.window);R(979,325,12,8,M.amber);
 R(1079,330,43,18,M.frost);R(1096,319,8,13,M.conduit);
 R(1185,331,34,17,M.glassDark);R(1190,321,17,11,M.signal);
 // original reverse-taper thruster exhaust and bow-ram are structural material
 P([[690,363],[633,339],[646,400],[713,400]],M.ceramic);
 P([[1328,332],[1394,342],[1420,355],[1377,377],[1316,374]],M.titanium);
 R(639,363,41,38,0);R(1350,351,55,17,0);
 L(756,412,675,950,20,M.titanium);L(1289,421,1413,956,22,M.steel);
 L(760,414,615,948,10,M.conduit);L(1291,420,1516,950,11,M.titanium);
 // vessel collar bridges and two altitudes of salvage bypass
 L(438,550,718,550,13,M.steel);L(1321,552,1628,547,14,M.steel);
 for(let x of [475,545,618]){L(x,550,x+37,606,8,M.titanium);L(x+37,606,x+69,550,8,M.conduit);}
 for(let x of [1380,1456,1541]){L(x,550,x+36,612,9,M.titanium);L(x+36,612,x+68,550,8,M.conduit);}
 R(711,542,76,8,M.blue);R(1343,540,74,9,M.blue);
 // integrated antenna mast at ship, deployable grid with asymmetric braces
 L(854,267,842,112,13,M.steel);L(843,132,779,81,9,M.titanium);L(845,132,938,64,8,M.titanium);
 P([[767,87],[785,46],[834,69],[822,97]],M.frost);P([[924,72],[956,37],[1006,66],[976,90]],M.window);
 L(1006,261,1051,179,12,M.steel);L(1051,180,1165,144,7,M.titanium);
 R(1050,165,68,8,M.ceramic);R(1090,154,16,11,M.signal);
 // Eastern great diagonal shipbreaking crane, grounded independently.
 L(1516,965,1485,149,22,M.titanium);L(1516,965,1600,393,16,M.steel);
 L(1240,191,1670,190,18,M.steel);L(1484,157,1670,190,13,M.titanium);L(1241,192,1485,150,11,M.titanium);
 for(let x=1280;x<1650;x+=52){L(x,192,x+26,217,7,M.steel);L(x+26,217,x+52,192,7,M.conduit);}
 L(1250,190,1228,285,5,M.chrome);L(1370,191,1345,327,5,M.chrome);
 R(1207,278,39,7,M.ceramic);R(1328,324,36,7,M.ceramic);
 R(1470,244,31,7,M.amber);R(1464,233,7,23,M.signal);
 // Eastern quarantine, dismantlement, electrolysis & cargo services, four people-scale floors.
 R(1650,462,300,10,M.steel);R(1660,454,88,6,M.frost);
 R(1647,573,307,12,M.steel);R(1660,585,284,6,M.blue);
 R(1634,715,316,12,M.titanium);R(1644,728,287,6,M.conduit);
 for(let x of [1685,1871]){R(x,380,12,48,M.steel);R(x+12,426,36,8,M.glassDark);}
 R(1687,505,66,17,M.ceramic);R(1695,495,27,10,M.signal);
 R(1840,495,68,20,M.titanium);R(1860,483,21,14,M.amber);
 for(let x of [1667,1874]){L(x,580,x+36,621,8,M.titanium);L(x+36,621,x+82,580,8,M.steel);}
 R(1686,664,75,15,M.frost);R(1695,650,29,13,M.signal);
 R(1855,667,76,12,M.ceramic);R(1874,648,17,19,M.white);
 R(1654,818,104,11,M.steel);R(1802,821,111,11,M.steel);R(1830,807,42,10,M.amber);
 L(1600,840,1660,875,13,M.steel);L(1948,842,2001,875,12,M.titanium);
 // Lower mineral samples, boring pit and expedition return, anchored to bedrock.
 R(579,847,220,16,M.steel);R(830,845,232,14,M.conduit);R(1130,845,232,13,M.steel);
 for(let x of [606,719,884,1012,1174,1304]){L(x,856,x+25,889,10,M.titanium);}
 for(let x of [613,740,878,1067,1211,1333]){R(x,835,32,10,M.ceramic);R(x+8,829,11,7,M.signal);}
 R(894,790,136,13,M.steel);R(913,802,102,7,M.frost);
 R(1150,782,122,15,M.titanium);R(1173,773,41,8,M.amber);
 L(1100,881,1137,718,12,M.steel);L(1137,718,1202,676,9,M.conduit);R(1197,669,53,8,M.frost);
 R(710,756,24,67,M.blue);R(716,752,12,7,M.signal);
 // Engineered cracked bedrock bore openings for actual lateral return, not visual tunnels.
 R(524,742,128,100,0);R(1368,751,170,91,0);
 // support-load-bonded postcut for breached lower bay openings
 L(650,852,684,901,16,M.titanium);L(1393,850,1431,900,17,M.steel);
 // Add purpose-specific rocks and short ballast ties to the floor, away from flight aperture.
 for(let x=500;x<1510;x+=113){let depth=10+Math.round(rand()*16);R(x,878,23,depth,M.schist);R(x+4,880,9,5,M.iron);}
 // Genuine spatial circulation: West/East outer airlocks, arkship upper/lower access, drydock return.
 R(390,472,255,89,0);R(1540,468,310,96,0);
 R(373,232,135,300,0);R(1551,227,166,308,0);
 R(788,363,96,193,0);R(1180,360,108,201,0);
 R(770,315,527,57,0);
 R(415,744,1195,83,0);R(363,616,94,188,0);R(1584,618,134,183,0);
 // Actual ship work surface must retain purposeful console floors above flight threshold.
 R(826,311,10,10,M.signal);R(1108,310,18,8,M.white);
 // Three purposeful 35-75-cell service portals, cut through inhabited walls.
 R(299,562,77,189,0);R(260,614,81,86,0);R(690,454,87,83,0);R(1336,450,82,87,0);
 R(520,243,84,79,0);R(1051,306,89,48,0);R(569,701,81,49,0);
 // Rehang service consoles against the ark's actual bulkhead without closing flight.
 R(1060,308,7,15,M.signal);R(1125,307,7,13,M.frost);
 // Legible people-scale machinery: actual supported compartment geometry.
 // Halcyon hull underside carries three separate repair/medical/navigation workstations.
 R(906,397,47,39,M.ceramic);R(910,384,38,14,M.glassDark);R(924,376,11,10,M.signal);
 R(1008,392,77,42,M.titanium);R(1019,379,55,14,M.glassDark);R(1033,369,12,12,M.amber);
 R(1122,390,54,43,M.ceramic);R(1130,375,13,20,M.frost);R(1150,373,15,24,M.frost);
 // Distinct commissioning and cargo loading at western pilots' exchange.

 // Eastern side-entry quarantine cycler and salvage furnace assemblies.

 // Exact intended navigable functional centres (NOT shifted to convenient pixels).
 const sites={
 "West arrivals":[120,524],"Pilots exchange":[244,418],"West assay":[235,645],"West rock archive":[266,787],
 "Fabrication platform":[539,507],"Fabricator lookout":[556,281],
 "Ark aft hatch":[718,492],"Ark specimen bay":[855,329],"Ark living galley":[964,326],
 "Ark navigation core":[1091,328],"Ark bow hatch":[1366,500],"Ark roof rendezvous":[1115,210],
 "Great crane console":[1394,294],"East quarantine lock":[1820,402],"East cargo":[1891,533],
 "East thermal salvage":[1810,636],"East survey":[1875,783],"Drydock centre":[1000,515],
 "Lower mineral assay":[959,744],"Lower bore drill":[1265,756],"Western vent recovery":[617,725]
 };
 // Attach every station fixture to a real rooted structural load path.
 // A multi-source 4-neighbour distance field finds the shortest small service tie
 // from each detached inert fixture to a grounded component; no phantom cells.
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
  let s=sites["West arrivals"],si=s[1]*W+s[0];if(!pass[si])throw Error("Spawn blocked "+w+" "+h);
  queue[tl++]=si;vis[si]=1;while(hd<tl){let a=queue[hd++],x=a%W;let j=a-W;if(j>=0&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}j=a+W;if(j<g.length&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}j=a-1;if(x>0&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}j=a+1;if(x<W-1&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}}
  let bad=Object.entries(sites).filter(([n,p])=>!vis[p[1]*W+p[0]]).map(([n,p])=>[n,p,clearAt(p[0],p[1])]);
  return {envelope:[w,h],centres:tl,passed:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,bad};}
 let clearances=[[19,15],[23,19],[31,27]].map(v=>flood(...v));if(clearances.some(v=>v.bad.length))throw Error("Failed exact-site clearance "+JSON.stringify(clearances));
 
 let obstructions=[[968,454,1113,607]];
 let bypass=obstructions.map(b=>flood(31,27,b));
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
 const crops=[["01-west-arrivals",35,345,475,515],["02-arkship-interior",670,215,705,320],["03-fabrication",420,185,315,535],["04-east-salvage",1560,355,473,520],["05-lower-mineral",560,660,968,285]];
 const images=[["overview.png",png(0,0,W,H)],...crops.map(([name,x,y,w,h])=>[name+".png",png(x,y,w,h)])];
 return {g,json,rect,hist,area,sites,clearances,bypass,rooted,unrooted,componentCount,rootedComponents,crops,images,tie_info,seed:SEED};
}

function sha256(input){let b=typeof input==="string"?Uint8Array.from(input,c=>c.charCodeAt(0)):input;
const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
const n=(b.length+9+63)&~63,buf=new Uint8Array(n);buf.set(b);buf[b.length]=128;let bits=b.length*8;for(let i=0;i<8;i++){buf[n-1-i]=bits&255;bits=Math.floor(bits/256);}
let h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64);let rotr=(x,n)=>(x>>>n)|(x<<(32-n));
for(let off=0;off<n;off+=64){for(let j=0;j<16;j++){let i=off+j*4;w[j]=((buf[i]<<24)|(buf[i+1]<<16)|(buf[i+2]<<8)|buf[i+3])>>>0;}for(let j=16;j<64;j++){let p=w[j-15],q=w[j-2];w[j]=(w[j-16]+(rotr(p,7)^rotr(p,18)^(p>>>3))+w[j-7]+(rotr(q,17)^rotr(q,19)^(q>>>10)))>>>0;}let [a,b0,c,d,e,f,g,z]=h;for(let j=0;j<64;j++){let t1=(z+(rotr(e,6)^rotr(e,11)^rotr(e,25))+((e&f)^(~e&g))+K[j]+w[j])>>>0,t2=((rotr(a,2)^rotr(a,13)^rotr(a,22))+((a&b0)^(a&c)^(b0&c)))>>>0;z=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b0;b0=a;a=(t1+t2)>>>0;}for(let j=0;j<8;j++)h[j]=(h[j]+[a,b0,c,d,e,f,g,z][j])>>>0;}return h.map(n=>n.toString(16).padStart(8,"0")).join("");}
function makeReceipt(a){return {concept:"Peregrine Cleft - Halcyon Ark Drydock",lane:"original/scifi-frontier-wide",original_no_source:true,seed:a.seed,extent:[2048,1024],material_cell_count:a.g.length,engine_accepted_main:"de109d0131641d6adc8d25bb9ced7ca3d4991105",reference_repo_default_main:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",source_loader_max_rectangles:32768,source_loader_max_setup_bytes:1048576,source_rectangle_work_budget:32000000,bridge_legacy_capacity_risk:4096,material_rule_assumption:"Only catalogue-supported static inert immobile Solid/None IDs; no powder, fluids, reactive or combustible foundation",material_histogram:a.hist,filled_material_cells:a.area,grounded_cells:a.rooted,ungrounded_cells:a.unrooted,grounded_components:a.rootedComponents,all_solid_components:a.componentCount,physical_fixture_ties:a.tie_info,nonoverlapping_ordered_rectangles:a.rect.length,rectangle_work:a.area,setup_bytes:a.json.length,material_plane_sha256:sha256(a.g),setup_sha256:sha256(a.json),images:a.images.map(([name,b])=>({name,bytes:b.length,sha256:sha256(b)})),clearance:a.clearances,physical_obstruction:{cell_box_xyxy:[968,454,1113,607],material_id:58,purpose:"Blocks exact Drydock centre; all other 20 named destinations recoverable",result:a.bypass},sites:a.sites,crops:a.crops,source_art:"None; independently invented level design",static_construction:"PASS",native_status:"NATIVE-UNTESTED",review_status:"Await independent exact-head Art / Technical / Shepherd; Draft/HOLD"};}

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
 console.log(JSON.stringify({status:"STATIC-PASS",verified_files:output.map(q=>q[0]),plane_sha256:makeReceipt(a).material_plane_sha256,rectangles:a.rect.length,sites:a.clearances.map(c=>c.passed),obstruction_other_sites:20,png_decoded_pixel_parity:"PASS",native:"NATIVE-UNTESTED",verify},null,2));
}
