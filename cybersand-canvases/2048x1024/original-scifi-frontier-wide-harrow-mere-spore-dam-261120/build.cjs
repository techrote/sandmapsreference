"use strict";
function build(){
 const W=2048,H=1024,SEED=0x26D120, g=new Uint8Array(W*H);
 const M={rock:100,schist:101,iron:49,wall:58,steel:62,blue:63,conduit:66,titanium:68,window:120,frost:121,quartz:122,glassDark:129,ceramic:130,chrome:131,signal:77,amber:79,white:80};
 let rng=SEED; function rand(){rng^=rng<<13;rng^=rng>>>17;rng^=rng<<5;return(rng>>>0)/4294967296;}
 function R(x,y,w,h,m){let x0=Math.max(0,Math.round(x)),x1=Math.min(W,Math.round(x+w)),y0=Math.max(0,Math.round(y)),y1=Math.min(H,Math.round(y+h));if(x0>=x1||y0>=y1)return;for(let yy=y0;yy<y1;yy++)g.fill(m,yy*W+x0,yy*W+x1);}
 function P(p,m){let ymin=Math.max(0,Math.floor(Math.min(...p.map(a=>a[1])))),ymax=Math.min(H-1,Math.ceil(Math.max(...p.map(a=>a[1]))));for(let y=ymin;y<=ymax;y++){let xs=[];for(let i=0;i<p.length;i++){let a=p[i],b=p[(i+1)%p.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2)R(Math.ceil(xs[i]),y,Math.max(0,Math.floor(xs[i+1])-Math.ceil(xs[i])+1),1,m);}}
 function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,r=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-r));yy<Math.min(H,Math.ceil(Math.max(y,Y)+r)+1);yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-r));xx<Math.min(W,Math.ceil(Math.max(x,X)+r)+1);xx++){let f=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(d||1)));if((xx-x-f*dx)**2+(yy-y-f*dy)**2<=r*r)g[yy*W+xx]=m;}}
 function ellipse(cx,cy,rx,ry,mat){for(let y=Math.max(0,cy-ry);y<Math.min(H,cy+ry+1);y++)for(let x=Math.max(0,cx-rx);x<Math.min(W,cx+rx+1);x++)if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)g[y*W+x]=mat;}



 // HARROW MERE — original sci-fi pneumatic spore-dam in a basalt crater.
 // All four-meter Midge-scale destinations are actual side-elevation geometry.
 const grade=x=>Math.round(914+10*Math.sin(x*.009)+5*Math.cos(x*.027));
 for(let x=0;x<W;x++){let y=grade(x);R(x,y,1,H-y,M.rock);}
 P([[0,1024],[0,337],[55,346],[136,412],[241,522],[305,672],[395,846],[468,1024]],M.rock);
 P([[2048,1024],[2048,370],[2008,385],[1950,433],[1868,525],[1775,668],[1664,850],[1603,1024]],M.rock);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(g[y*W+x]===M.rock){
  let v=(y+Math.floor(x/17)+Math.round(6*Math.sin(x*.021)))%121;
  if(v<7)g[y*W+x]=M.schist;else if(v<10)g[y*W+x]=M.iron;
 }
 // Genuine open under-dam flight bore and wide two-ended escape shafts.
 R(304,892,1419,86,0);R(370,808,130,168,0);R(1533,796,140,181,0);
 // Personal-scale inhabited rooms cut directly into living rock at the termini.
 R(44,406,412,128,0);R(76,544,424,143,0);R(135,706,381,138,0);
 R(1638,413,404,129,0);R(1590,557,437,143,0);R(1587,713,440,133,0);
 for(let [x,y,w] of [[55,533,383],[91,686,388],[149,842,345],
 [1648,541,377],[1605,700,401],[1599,846,411]]){
  R(x,y,w,12,M.titanium);R(x+13,y+12,w-26,5,M.blue);
 }
 // West: bounded rover maintenance, nursery spinner and cold-cassette intake.
 R(93,508,107,10,M.steel);R(108,481,24,25,M.chrome);
 R(147,474,43,32,M.glassDark);R(163,462,13,11,M.signal);
 R(239,512,136,11,M.ceramic);R(252,482,18,29,M.iron);
 R(305,488,52,23,M.frost);R(318,477,9,10,M.amber);
 R(112,666,141,12,M.steel);R(136,625,24,39,M.window);
 R(178,636,47,28,M.glassDark);R(192,626,12,10,M.signal);
 R(286,671,164,11,M.chrome);R(306,632,25,38,M.iron);
 R(351,642,59,27,M.frost);R(367,628,14,14,M.signal);
 R(181,826,164,12,M.ceramic);R(198,787,31,36,M.iron);
 R(260,801,66,23,M.window);R(274,789,12,11,M.amber);
 L(408,838,423,905,10,M.titanium);
 // Four asymmetrically loaded bulkheads anchored in the crater, not airy sticks.
 L(650,909,705,288,34,M.titanium);L(746,903,785,397,21,M.steel);
 L(1300,904,1307,303,35,M.titanium);L(1417,910,1366,412,23,M.steel);
 L(576,902,795,507,16,M.chrome);L(1495,905,1219,518,18,M.titanium);
 // Broad external stepped pneumatic cap with deliberately open sky above.
 function arc(cx,cy,rx,ry,start,end,t,m){for(let i=0;i<68;i++){
  let a=start+(end-start)*i/68,b=start+(end-start)*(i+1)/68;
  L(cx+rx*Math.cos(a),cy+ry*Math.sin(a),cx+rx*Math.cos(b),cy+ry*Math.sin(b),t,m);
 }}
 arc(1014,404,347,140,Math.PI*1.07,Math.PI*1.93,12,M.titanium);
 arc(1078,445,270,112,Math.PI*1.08,Math.PI*1.85,7,M.conduit);
 L(681,408,709,312,10,M.steel);L(1357,419,1305,306,11,M.steel);
 // Perforated pump diaphragm: incomplete radial lobes preserve side-entry air.
 arc(1020,545,102,111,Math.PI*.20,Math.PI*.78,12,M.chrome);
 arc(1020,545,102,111,Math.PI*.92,Math.PI*1.45,12,M.titanium);
 arc(1020,545,102,111,Math.PI*1.62,Math.PI*2.02,12,M.steel);
 ellipse(1020,543,25,26,M.iron);
 L(1020,542,1097,514,8,M.conduit);L(1019,544,962,616,9,M.chrome);
 // A real double-storey industrial system with accessible inner workstations.
 R(765,344,515,12,M.steel);R(778,356,487,5,M.blue);
 R(786,472,454,13,M.titanium);R(797,485,431,5,M.conduit);
 R(807,695,451,12,M.steel);R(817,707,426,5,M.blue);
 L(779,357,837,473,12,M.titanium);L(1272,357,1194,474,13,M.steel);
 L(817,703,849,907,16,M.titanium);L(1237,704,1265,904,17,M.steel);
 // Purposeful pressure baffle controls, assay, collector and decon manifolds.
 R(821,457,111,12,M.ceramic);R(839,423,17,33,M.chrome);
 R(873,436,47,19,M.glassDark);R(889,423,12,12,M.signal);
 R(1112,459,110,12,M.ceramic);R(1125,426,24,32,M.frost);
 R(1161,435,45,21,M.glassDark);R(1190,421,11,13,M.amber);
 R(825,677,118,10,M.steel);R(840,642,19,34,M.iron);
 R(872,645,49,30,M.window);R(893,635,11,10,M.signal);
 R(1153,674,92,13,M.titanium);R(1164,639,26,33,M.frost);
 R(1203,652,24,20,M.glassDark);R(1211,640,10,11,M.amber);
 for(let i=0;i<4;i++){let x=764+i*23;L(x,591,x+12,636,6,M.chrome);}
 R(770,638,101,9,M.titanium);
 for(let i=0;i<4;i++){let x=1223+i*23;L(x,402,x+10,449,6,M.steel);}
 R(1216,453,102,9,M.chrome);
 R(680,796,105,12,M.steel);R(698,760,27,35,M.iron);
 R(735,769,33,26,M.glassDark);R(746,760,10,10,M.signal);
 R(1298,789,113,12,M.ceramic);R(1324,749,25,39,M.frost);
 R(1369,773,23,15,M.glassDark);R(1377,761,9,10,M.amber);
 // East: real pressure-safe intake and separated containment / scrubber / freight.
 R(1668,526,132,12,M.steel);R(1681,492,21,34,M.chrome);
 R(1725,503,54,21,M.frost);R(1750,489,11,12,M.signal);
 R(1839,523,162,11,M.ceramic);R(1852,489,16,32,M.iron);
 R(1893,497,60,24,M.window);R(1916,485,12,11,M.amber);
 R(1613,683,157,12,M.titanium);R(1632,646,28,35,M.frost);
 R(1688,652,58,28,M.glassDark);R(1707,637,12,13,M.signal);
 R(1808,685,178,12,M.steel);R(1825,647,20,36,M.iron);
 R(1869,657,78,25,M.glassDark);R(1907,645,14,11,M.amber);
 R(1635,831,157,13,M.ceramic);R(1656,796,22,34,M.chrome);
 R(1703,808,62,20,M.iron);R(1730,793,12,13,M.signal);
 R(1830,830,164,12,M.steel);R(1848,797,24,31,M.window);
 R(1885,807,72,21,M.glassDark);
 L(1644,848,1606,934,11,M.titanium);
 // Below the dam: four occupied, 1:1 traversable silt-free dry research ports.
 for(let [x,w] of [[551,192],[849,205],[1171,197],[1401,152]]){
  R(x,977,w,11,M.steel);R(x+16,950,w-32,9,M.ceramic);
  R(x+8,976,9,45,M.titanium);R(x+w-18,977,9,45,M.titanium);
 }
 for(let x of [581,626,670]){R(x,927,24,21,M.glassDark);R(x+8,917,9,10,M.signal);}
 for(let x of [860,922,976]){R(x,927,29,22,M.frost);R(x+7,917,10,9,M.amber);}
 for(let x of [1190,1239,1295]){R(x,927,27,23,M.window);R(x+8,917,9,10,M.signal);}
 for(let x of [1415,1464,1507]){R(x,928,25,22,M.iron);R(x+8,918,9,10,M.amber);}

 const sites={
 "West arrivals":[254,461],"Spore cold intake":[178,615],
 "Machinist exchange":[285,751],"West ridge lookdown":[426,370],
 "West rescue hatch":[427,859],"Dam intake pump":[749,739],
 "West baffle controls":[814,523],"Upper sky overflight":[1024,157],
 "Upper baffle catwalk":[1031,395],"Rotor inspection":[1103,563],
 "West culture assay":[874,605],"East xenology analyzer":[1161,617],
 "East duct loft":[1395,356],"East service deck":[1410,735],
 "Basin low rescue":[1055,825],"Deep silt-free lab":[645,922],
 "Deep sample centrifuge":[940,919],"Deep mineral archive":[1270,921],
 "Deep return east":[1491,920],"East rescue hatch":[1610,862],
 "Eastern decon intake":[1763,472],"Quarantine cleanroom":[1903,457],
 "Biofilter assay":[1769,620],"East rover depot":[1888,759],
 "Eastern ridge lookout":[1860,351],"Vent spill survey":[1004,759]
 };
 // Main, alternative and post-failure routes (cleared actual air space).
 R(327,824,171,153,0);R(1539,825,134,150,0);
 R(314,890,1413,83,0);
 R(447,497,142,204,0);R(1480,475,159,211,0);
 // Major roof-hatch for 31×27 access to upper baffle cell.
 R(1001,335,65,36,0);
 // Rotor is not a sealed scenic circle: actual machined side access.
 R(1096,520,53,61,0);
 // West frame's filter control corridors have generous side-entry thresholds.
 R(783,499,74,55,0);R(873,576,64,59,0);
 // Four authentic 31×27 Midge-clear side-entry machine/service hatches.
 R(746,713,53,60,0);R(793,505,55,178,0);
 R(1006,254,61,170,0);R(1081,548,60,203,0);
 
 for(const [name,[x,y]] of Object.entries(sites))R(x-18,y-16,37,33,0);
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
 // Four authentic 31×27 Midge-clear side-entry machine/service hatches.
 R(746,713,53,60,0);R(793,505,55,178,0);
 R(1006,254,61,170,0);R(1081,548,60,203,0);
 
 for(const [name,[x,y]] of Object.entries(sites))R(x-18,y-16,37,33,0);

 // Harrow R2: real differentiated process hardware and lower entered workcells.
 // Western cold-spore capture and keyed material intake, not repeated consoles.
 R(93,524,125,9,M.titanium);R(108,474,25,47,M.chrome);
 R(146,482,26,38,M.frost);R(181,501,23,19,M.glassDark);
 L(119,475,166,457,8,M.conduit);R(160,445,12,11,M.signal);
 R(245,522,130,11,M.steel);R(261,464,25,56,M.blue);
 R(307,485,51,34,M.window);R(325,470,12,13,M.amber);
 L(287,498,314,498,7,M.conduit);
 // Seed-sieving mill and maintenance transfer below the inhabited port.
 R(114,676,138,9,M.ceramic);R(129,624,25,48,M.chrome);
 R(177,651,31,22,M.frost);R(213,659,25,14,M.glassDark);
 L(149,625,218,618,8,M.conduit);
 R(285,681,163,10,M.titanium);R(304,629,26,48,M.steel);
 R(357,640,54,37,M.window);R(375,624,10,14,M.signal);
 // Pressure-dam control: tall paired pistons, gauges and manifold (not spore crates).
 R(845,473,111,10,M.titanium);R(854,398,26,72,M.chrome);
 R(892,436,39,34,M.glassDark);R(907,422,12,13,M.signal);
 L(874,403,941,382,8,M.conduit);
 R(1144,472,113,11,M.steel);R(1151,394,32,76,M.frost);
 R(1199,421,41,47,M.blue);R(1214,407,10,12,M.amber);
 L(1180,396,1244,380,8,M.conduit);
 // Rotor inspection has oppositely keyed ram cartridges and bearings.
 R(901,678,82,11,M.titanium);R(919,635,24,41,M.chrome);
 R(951,646,20,30,M.frost);R(960,634,9,10,M.signal);
 R(1145,684,93,11,M.ceramic);R(1158,632,24,50,M.steel);
 R(1191,649,29,33,M.glassDark);R(1202,635,9,11,M.amber);
 // Eastern isolation: long scrubber, pressure membrane and freight weighbridge.
 R(1642,540,129,12,M.titanium);R(1654,481,24,57,M.frost);
 R(1700,483,30,55,M.blue);R(1742,505,20,33,M.glassDark);
 L(1715,483,1740,464,8,M.conduit);
 R(1814,696,179,13,M.steel);R(1827,640,26,54,M.chrome);
 R(1871,648,61,46,M.glassDark);R(1949,663,28,30,M.window);
 L(1848,641,1888,623,8,M.conduit);
 // Four unlike below-dam workcells; actual ground-connected mass and
 // introduced air thresholds preserve all original centre coordinates.
 // A. Mineral assay chute and crane-fed comparator.
 R(544,977,197,11,M.titanium);R(551,944,28,32,M.steel);
 R(594,951,62,24,M.glassDark);R(606,940,34,10,M.window);
 L(559,943,598,929,6,M.conduit);R(684,945,39,31,M.frost);
 // B. Paired-bearing centrifuge with nested rotating-drum *geometry*.
 R(841,977,207,11,M.titanium);ellipse(929,953,29,22,M.chrome);
 ellipse(929,953,16,11,M.blue);R(923,942,12,20,M.window);
 R(852,957,27,19,M.steel);R(995,948,39,28,M.glassDark);
 L(925,935,925,913,5,M.conduit);
 // C. Mineral archive scanner vault and suspended specimen grabber.
 R(1169,977,197,11,M.steel);R(1178,941,23,35,M.chrome);
 R(1217,948,50,27,M.window);R(1228,938,31,9,M.signal);
 R(1304,951,44,24,M.glassDark);L(1189,937,1219,926,6,M.conduit);
 // D. Thermal pump: twin manifolds, finned exchanger and side controls.
 R(1402,977,156,11,M.ceramic);R(1417,948,25,28,M.frost);
 R(1452,954,28,22,M.blue);R(1504,950,37,26,M.steel);
 for(let xf=1507;xf<1542;xf+=8)R(xf,938,3,12,M.chrome);
 R(1532,927,9,10,M.amber);
 const r2_workcell_anchors=tieStructures();
 // Tie work must never obstruct literal spawn or destinations.
 for(const [name,[x,y]] of Object.entries(sites))R(x-20,y-18,41,37,0);

 // Ground the cold-intake manifold outside the literal spawn envelope.
 L(216,621,216,688,6,M.conduit);
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
 
 let obstructions=[[997,367,1062,428]];
 let bypass=obstructions.map(b=>flood(31,27,b)); if(bypass[0].passed!==Object.keys(sites).length-1||bypass[0].bad[0]?.[0]!=="Upper baffle catwalk")throw Error("Bypass "+JSON.stringify(bypass));
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
 const crops=[["01-west-sporeport",0,315,555,602],["02-pressure-dam",520,235,680,670],["03-separator-rotor",805,335,635,525],["04-east-isolation",1510,330,538,590],["05-geological-return",445,817,1225,207]];
 const images=[["overview.png",png(0,0,W,H)],...crops.map(([name,x,y,w,h])=>[name+".png",png(x,y,w,h)])];
 return {g,json,rect,hist,area,sites,clearances,bypass,rooted,unrooted,componentCount,rootedComponents,crops,images,tie_info,r2_workcell_anchors,seed:SEED};
}

function sha256(input){let b=typeof input==="string"?Uint8Array.from(input,c=>c.charCodeAt(0)):input;
const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
const n=(b.length+9+63)&~63,buf=new Uint8Array(n);buf.set(b);buf[b.length]=128;let bits=b.length*8;for(let i=0;i<8;i++){buf[n-1-i]=bits&255;bits=Math.floor(bits/256);}
let h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64);let rotr=(x,n)=>(x>>>n)|(x<<(32-n));
for(let off=0;off<n;off+=64){for(let j=0;j<16;j++){let i=off+j*4;w[j]=((buf[i]<<24)|(buf[i+1]<<16)|(buf[i+2]<<8)|buf[i+3])>>>0;}for(let j=16;j<64;j++){let p=w[j-15],q=w[j-2];w[j]=(w[j-16]+(rotr(p,7)^rotr(p,18)^(p>>>3))+w[j-7]+(rotr(q,17)^rotr(q,19)^(q>>>10)))>>>0;}let [a,b0,c,d,e,f,g,z]=h;for(let j=0;j<64;j++){let t1=(z+(rotr(e,6)^rotr(e,11)^rotr(e,25))+((e&f)^(~e&g))+K[j]+w[j])>>>0,t2=((rotr(a,2)^rotr(a,13)^rotr(a,22))+((a&b0)^(a&c)^(b0&c)))>>>0;z=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b0;b0=a;a=(t1+t2)>>>0;}for(let j=0;j<8;j++)h[j]=(h[j]+[a,b0,c,d,e,f,g,z][j])>>>0;}return h.map(n=>n.toString(16).padStart(8,"0")).join("");}
function makeReceipt(a){return {concept:"Harrow Mere - Basalt Spore-Dam Pneumatic Harvest",lane:"original/scifi-frontier-wide",original_no_source:true,seed:a.seed,extent:[2048,1024],material_cell_count:a.g.length,engine_accepted_main:"de109d0131641d6adc8d25bb9ced7ca3d4991105",reference_repo_default_main:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",source_loader_max_rectangles:32768,source_loader_max_setup_bytes:1048576,source_rectangle_work_budget:32000000,bridge_legacy_capacity_risk:4096,material_rule_assumption:"Only catalogue-supported static inert immobile Solid/None IDs; no powder, fluids, reactive or combustible foundation",material_histogram:a.hist,filled_material_cells:a.area,grounded_cells:a.rooted,ungrounded_cells:a.unrooted,grounded_components:a.rootedComponents,all_solid_components:a.componentCount,physical_fixture_ties:a.tie_info,r2_workcell_anchors:a.r2_workcell_anchors,creator_revision:'R2 functional pneumatic and below-dam workcell repair following independent Shepherd P1 2026-11-20',nonoverlapping_ordered_rectangles:a.rect.length,rectangle_work:a.area,setup_bytes:a.json.length,material_plane_sha256:sha256(a.g),setup_sha256:sha256(a.json),images:a.images.map(([name,b])=>({name,bytes:b.length,sha256:sha256(b)})),clearance:a.clearances,physical_obstruction:{cell_box_xyxy:[997,367,1062,428],material_id:58,purpose:"Blocks only exact Upper baffle catwalk; all other named destinations remain recoverable",result:a.bypass},sites:a.sites,crops:a.crops,source_art:"None; wholly new original invented sci-fi frontier",static_construction:"PASS",native_status:"NATIVE-UNTESTED",review_status:"Await independent exact-head Art / Technical / Shepherd; Draft/HOLD"};}

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
