"use strict";
function upgrade(g){
 const W=2048,H=1024,M={iron:49,steel:62,blue:63,conduit:66,titanium:68,signal:77,amber:79,window:120,frost:121,quartz:122,glassDark:129,ceramic:130,chrome:131,schist:101};
 const R=(x,y,w,h,m)=>{let x0=Math.max(0,Math.round(x)),x1=Math.min(W,Math.round(x+w)),y0=Math.max(0,Math.round(y)),y1=Math.min(H,Math.round(y+h));for(let yy=y0;yy<y1;yy++)g.fill(m,yy*W+x0,yy*W+x1);};
 const L=(x,y,X,Y,t,m)=>{let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,r=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-r));yy<Math.min(H,Math.ceil(Math.max(y,Y)+r)+1);yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-r));xx<Math.min(W,Math.ceil(Math.max(x,X)+r)+1);xx++){let f=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(d||1)));if((xx-x-f*dx)**2+(yy-y-f*dy)**2<=r*r)g[yy*W+xx]=m;}};
 const O=(cx,cy,rx,ry,m)=>{for(let y=Math.max(0,cy-ry);y<Math.min(H,cy+ry+1);y++)for(let x=Math.max(0,cx-rx);x<Math.min(W,cx+rx+1);x++)if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)g[y*W+x]=m;};
 // West custody and assay: triple sealed sample feeder and distinct pipette station.
 R(208,513,42,8,M.titanium);R(213,474,9,40,M.chrome);R(234,480,7,31,M.chrome);
 for(let i=0;i<3;i++){R(212+i*12,484,9,18,i===1?M.frost:M.quartz);R(215+i*12,479,4,5,M.signal);}
 L(240,495,262,510,5,M.conduit);R(266,493,66,7,M.steel);R(270,470,9,28,M.chrome);
 R(288,479,40,12,M.glassDark);R(289,477,38,3,M.window);R(319,473,5,7,M.amber);
 R(345,508,73,7,M.chrome);L(357,505,378,482,6,M.titanium);R(373,470,8,16,M.chrome);
 O(388,479,12,11,M.frost);O(388,479,4,5,M.glassDark);R(404,490,10,15,M.blue);
 R(210,662,13,21,M.titanium);R(216,642,52,7,M.conduit);R(265,640,10,41,M.chrome);
 R(228,653,31,20,M.glassDark);for(let i=0;i<4;i++)R(231+i*7,658,5,9,i%2?M.window:M.frost);
 R(420,663,7,16,M.chrome);L(423,660,442,643,5,M.conduit);R(433,631,10,15,M.signal);
 // Central xenoseed custody: winch/rail, paired gripping jaws, enclosed payload, lowered platform.
 // Preserve the precise [1116,594] lower transfer; no continuous right-hand barrier.
 R(976,504,8,45,M.chrome);L(980,504,996,494,5,M.conduit);
 R(1045,505,8,44,M.titanium);L(1048,507,1043,495,5,M.conduit);
 R(982,500,64,5,M.blue);R(988,511,54,4,M.steel);
 L(982,534,1001,546,6,M.chrome);L(1048,534,1040,546,6,M.chrome);
 O(1021,539,21,13,M.titanium);O(1021,538,15,8,M.glassDark);O(1021,536,9,5,M.frost);
 R(1016,529,5,6,M.signal);R(1027,529,6,7,M.amber);R(1003,550,37,6,M.ceramic);
 // East receiver, anchored to the eastern wing without blocking the flight corridor.
 R(1225,516,58,6,M.ceramic);R(1239,495,7,24,M.chrome);R(1269,493,9,25,M.chrome);
 R(1249,500,21,13,M.glassDark);R(1254,498,12,4,M.frost);
 L(1234,513,1307,476,4,M.conduit);
 // East quarantine is a double sealed sluice; freight has overhead lifting, not duplicate tables.
 R(1758,470,8,43,M.chrome);L(1761,472,1805,466,5,M.conduit);R(1799,465,12,51,M.steel);
 R(1772,486,20,25,M.glassDark);R(1775,484,13,4,M.window);
 R(1946,513,49,7,M.titanium);R(1971,473,7,43,M.chrome);
 R(1762,675,10,12,M.chrome);R(1775,649,64,6,M.titanium);L(1787,650,1826,637,5,M.chrome);
 R(1830,636,8,41,M.conduit);R(1839,661,66,12,M.steel);R(1854,640,24,18,M.frost);
 // Four distinct rooted understrata mechanisms: corer, membrane rotor, heat manifold, rover repair.
 R(546,932,8,31,M.steel);R(565,919,6,45,M.chrome);L(565,922,602,920,5,M.titanium);
 R(594,921,5,41,M.conduit);R(593,938,17,14,M.schist);R(610,933,68,7,M.ceramic);
 for(let i=0;i<5;i++)R(618+i*10,941,7,19,i%2?M.quartz:M.glassDark);R(677,940,8,22,M.iron);
 R(820,925,6,38,M.steel);R(835,921,44,6,M.titanium);L(853,928,871,941,7,M.conduit);
 O(887,942,33,20,M.chrome);O(887,942,25,13,M.glassDark);O(887,942,9,8,M.signal);
 L(919,941,951,934,7,M.conduit);R(947,925,11,37,M.iron);R(957,932,31,7,M.steel);
 R(1079,928,8,35,M.chrome);R(1083,918,106,7,M.conduit);
 for(let i=0;i<8;i++)R(1104+10*i,929+(i%2)*5,5,31,M.titanium);
 R(1192,926,12,37,M.steel);R(1208,936,35,8,M.blue);L(1237,943,1242,960,7,M.chrome);
 R(1343,924,10,39,M.steel);L(1348,927,1395,917,7,M.chrome);R(1395,916,14,8,M.titanium);
 R(1401,924,7,14,M.conduit);R(1380,943,97,12,M.ceramic);R(1393,934,59,11,M.glassDark);
 for(const x of [1395,1459]){O(x,955,14,10,M.iron);O(x,955,6,5,M.window);}
 R(1483,936,11,25,M.chrome);R(1497,937,24,7,M.signal);
}
function build(){
 const W=2048,H=1024,SEED=0x3E717A, g=new Uint8Array(W*H);
 const M={rock:100,schist:101,iron:49,wall:58,steel:62,blue:63,conduit:66,titanium:68,window:120,frost:121,quartz:122,glassDark:129,ceramic:130,chrome:131,signal:77,amber:79,white:80};
 let rng=SEED; function rand(){rng^=rng<<13;rng^=rng>>>17;rng^=rng<<5;return(rng>>>0)/4294967296;}
 function R(x,y,w,h,m){let x0=Math.max(0,Math.round(x)),x1=Math.min(W,Math.round(x+w)),y0=Math.max(0,Math.round(y)),y1=Math.min(H,Math.round(y+h));if(x0>=x1||y0>=y1)return;for(let yy=y0;yy<y1;yy++)g.fill(m,yy*W+x0,yy*W+x1);}
 function P(p,m){let ymin=Math.max(0,Math.floor(Math.min(...p.map(a=>a[1])))),ymax=Math.min(H-1,Math.ceil(Math.max(...p.map(a=>a[1]))));for(let y=ymin;y<=ymax;y++){let xs=[];for(let i=0;i<p.length;i++){let a=p[i],b=p[(i+1)%p.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2)R(Math.ceil(xs[i]),y,Math.max(0,Math.floor(xs[i+1])-Math.ceil(xs[i])+1),1,m);}}
 function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,r=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-r));yy<Math.min(H,Math.ceil(Math.max(y,Y)+r)+1);yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-r));xx<Math.min(W,Math.ceil(Math.max(x,X)+r)+1);xx++){let f=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(d||1)));if((xx-x-f*dx)**2+(yy-y-f*dy)**2<=r*r)g[yy*W+xx]=m;}}
 function ellipse(cx,cy,rx,ry,mat){for(let y=Math.max(0,cy-ry);y<Math.min(H,cy+ry+1);y++)for(let x=Math.max(0,cx-rx);x<Math.min(W,cx+rx+1);x++)if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)g[y*W+x]=mat;}





 // Threnody Scar: entirely new perpendicular 2D foldwing seedlift, no source art.
 // Opposing inhabited rift shelves, articulated asymmetric lift wings and dry return.
 const grade=x=>Math.round(968+4*Math.sin(x*.009)+3*Math.sin(x*.035));
 for(let x=0;x<W;x++)R(x,grade(x),1,H-grade(x),M.rock);
 P([[0,1024],[0,296],[65,311],[157,394],[263,527],[373,678],[490,846],[608,1024]],M.rock);
 P([[2048,1024],[2048,292],[1984,313],[1888,411],[1806,524],[1703,689],[1562,901],[1508,1024]],M.rock);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(g[y*W+x]===M.rock){let v=(y+(x>>5)+Math.floor(6*Math.sin(x*.021)))%127;if(v<5)g[y*W+x]=M.schist;else if(v<9)g[y*W+x]=M.iron;}
 // Three legitimate workrooms and separated decks in each wall.
 for(let [x,y,w,h] of [[34,388,438,139],[63,548,441,144],[95,706,420,149],[1591,391,436,140],[1550,550,469,147],[1531,714,492,144],[345,859,1357,112],[370,785,139,184],[1547,787,147,183]])R(x,y,w,h,0);
 for(let [x,y,w,m] of [[40,521,414,M.steel],[72,688,419,M.ceramic],[104,849,399,M.titanium],[1600,526,406,M.ceramic],[1561,693,450,M.steel],[1550,850,453,M.titanium]]){R(x,y,w,12,m);R(x+15,y+12,w-30,4,M.blue);}
 // West cold delivery, microscopy, inhabited triage, each with different hardware.
 R(72,505,145,12,M.chrome);R(90,465,25,38,M.frost);R(132,482,54,19,M.glassDark);R(166,465,13,12,M.signal);
 R(244,511,171,11,M.ceramic);R(258,472,29,37,M.chrome);for(let k=0;k<5;k++)R(303+k*19,486,12,23,k%2?M.window:M.quartz);
 R(86,675,159,11,M.steel);R(112,631,24,41,M.iron);R(148,638,66,33,M.glassDark);L(130,628,186,612,6,M.conduit);
 R(271,677,163,10,M.titanium);R(296,631,28,43,M.chrome);R(342,651,59,24,M.frost);R(364,636,11,13,M.amber);
 R(118,834,156,11,M.ceramic);R(139,799,26,32,M.chrome);R(182,807,64,22,M.window);
 R(325,837,178,10,M.steel);R(348,799,28,35,M.iron);R(395,811,63,22,M.glassDark);
 // Gigantic original opposed folded planes, anchored to bedrock outside flight corridor.
 L(515,899,681,301,29,M.titanium);L(668,324,826,264,23,M.chrome);L(822,268,965,372,19,M.steel);
 L(1518,909,1371,291,33,M.steel);L(1361,299,1202,249,22,M.titanium);L(1210,254,1081,371,17,M.chrome);
 L(530,890,828,589,18,M.iron);L(1529,894,1227,581,18,M.chrome);
 L(694,330,848,429,11,M.conduit);L(1356,326,1200,430,11,M.conduit);
 R(719,304,51,13,M.blue);R(1299,293,58,13,M.blue);
 // Central open-faced life support lift with differentiated seed separation benches.
 R(847,653,349,14,M.steel);R(870,668,301,6,M.blue);
 L(860,657,826,485,12,M.titanium);L(1186,656,1211,484,12,M.chrome);
 R(860,543,123,11,M.ceramic);R(1062,550,117,11,M.ceramic);
 R(881,506,24,34,M.chrome);R(918,520,46,21,M.window);
 R(1085,510,26,35,M.iron);R(1122,523,37,24,M.frost);
 L(996,401,996,616,8,M.conduit);L(1043,401,1043,609,8,M.chrome);
 R(991,578,67,12,M.titanium);R(1011,555,30,22,M.glassDark);
 R(1018,544,13,9,M.signal);R(1021,594,32,23,M.quartz);
 R(746,474,107,11,M.steel);R(761,442,24,30,M.chrome);R(805,452,33,20,M.glassDark);
 R(1306,476,120,11,M.titanium);R(1329,440,23,31,M.iron);R(1370,455,41,20,M.frost);
 L(847,658,733,835,17,M.steel);L(1195,656,1302,841,17,M.titanium);
 R(676,808,163,13,M.ceramic);R(1222,807,153,13,M.steel);
 R(694,779,30,28,M.iron);R(741,786,58,20,M.window);
 R(1256,776,27,29,M.chrome);R(1299,790,47,17,M.glassDark);
 // Eastern sterile intake -> advanced sorting -> freight -> evacuation.
 R(1614,515,168,11,M.ceramic);R(1638,470,25,41,M.frost);R(1680,484,43,28,M.glassDark);R(1740,483,24,27,M.blue);
 R(1823,518,173,11,M.steel);R(1849,466,28,46,M.chrome);R(1889,486,64,27,M.window);R(1958,478,27,34,M.glassDark);
 R(1591,678,171,11,M.titanium);R(1619,633,26,43,M.iron);R(1658,647,29,28,M.frost);R(1713,651,29,23,M.glassDark);
 R(1785,682,215,12,M.ceramic);R(1810,635,25,45,M.chrome);R(1856,649,61,29,M.window);R(1934,633,45,45,M.frost);
 R(1563,835,159,11,M.steel);R(1584,800,24,32,M.chrome);R(1624,809,61,23,M.glassDark);
 R(1772,836,227,12,M.titanium);R(1800,793,27,40,M.iron);R(1847,812,54,22,M.window);R(1922,806,52,24,M.frost);
 // Four unlike, truly understrata floor-rooted material machines.
 R(527,962,190,10,M.steel);R(541,936,24,28,M.chrome);L(554,936,619,921,7,M.conduit);R(590,947,49,14,M.glassDark);R(651,946,46,16,M.quartz);
 R(802,961,196,11,M.ceramic);R(817,937,26,25,M.iron);ellipse(873,948,24,14,M.glassDark);ellipse(873,948,7,6,M.signal);
 for(let k=0;k<4;k++)R(914+18*k,935,9,25,k%2?M.frost:M.window);
 R(1069,961,180,11,M.titanium);R(1081,940,25,23,M.chrome);R(1122,946,45,17,M.blue);
 for(let x=1181;x<1238;x+=10)R(x,932,5,28,M.iron);R(1205,922,11,11,M.amber);
 R(1334,961,195,11,M.steel);R(1350,939,28,23,M.iron);R(1394,945,63,15,M.glassDark);
 R(1463,935,41,24,M.frost);R(1479,926,11,10,M.signal);
 // Literal centre path graph: every site must be truly reachable after physical collision.
 const sites={
 "West rover intake":[171,443],"West nursery portal":[327,443],"West cold assay":[160,607],"West spinner":[370,608],
 "West refuge":[207,765],"West dispatch":[425,762],"West escarpment":[473,362],"West rescue shaft":[465,822],
 "West foldwing observation":[756,211],"West side transfer":[815,573],"Overflight bypass":[1031,144],
 "Lift upper arrival":[1016,378],"Lift junction":[1029,451],"Lift lower transfer":[1116,594],
 "East foldwing observation":[1297,207],"East side transfer":[1288,578],
 "West basin recovery":[613,716],"East basin recovery":[1410,716],
 "East escarpment":[1584,365],"East sterile intake":[1691,450],"East telemetry":[1910,449],
 "East isolation":[1700,611],"East freight":[1894,611],"East rover garage":[1902,766],"East rescue shaft":[1615,819],
 "Understrata assay":[613,899],"Understrata rotor":[894,898],"Understrata heat":[1158,897],"Understrata repair":[1436,897]
 };
 // Authored distinct three-path overflight / basin / underground flight circulation.
 R(480,316,150,549,0);R(1445,317,166,549,0);R(556,688,931,83,0);
 R(348,855,1354,80,0);R(377,793,134,143,0);R(1548,794,145,142,0);
 R(445,466,172,183,0);R(1420,469,200,180,0);
 R(447,637,133,157,0);R(1441,637,140,155,0);
 R(787,347,102,133,0);R(1199,348,134,138,0);
 R(957,335,136,88,0);R(987,405,102,101,0);R(1052,481,152,152,0);
 R(858,558,120,95,0);R(1163,555,163,97,0);

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
 // Finish authoring with the exact site envelopes; never fake or shift a destination.
 for(const [label,[x,y]] of Object.entries(sites))R(x-25,y-23,51,47,0);
 // Remove at most strictly nonloadbearing disconnected ornamental shards.
 // Every remaining nonempty stored cell must be rooted at a true world boundary.
 let island_removed=0,seenI=new Uint8Array(g.length),queueI=new Int32Array(g.length);
 for(let k=0;k<g.length;k++)if(g[k]&&!seenI[k]){
  let h=0,t=1,edge=false;queueI[0]=k;seenI[k]=1;
  while(h<t){let a=queueI[h++],x=a%W,y=(a/W)|0;if(!x||x===W-1||!y||y===H-1)edge=true;
   for(let n of [a-W,a+W,x?a-1:-1,x<W-1?a+1:-1])if(n>=0&&n<g.length&&g[n]&&!seenI[n]){seenI[n]=1;queueI[t++]=n;}}
  if(!edge){island_removed+=t;for(let z=0;z<t;z++)g[queueI[z]]=0;}
 }
 if(island_removed>16000)throw Error("Too much structural island pruning "+island_removed);
 const r2_workcell_anchors={ties:tie_info.ties,longest:tie_info.longest,island_removed};

 upgrade(g);
 const detail_ties=tieStructures();
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
  let s=sites["West rover intake"],si=s[1]*W+s[0];if(!pass[si])throw Error("Spawn blocked "+w+" "+h);
  queue[tl++]=si;vis[si]=1;while(hd<tl){let a=queue[hd++],x=a%W;let j=a-W;if(j>=0&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}j=a+W;if(j<g.length&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}j=a-1;if(x>0&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}j=a+1;if(x<W-1&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}}
  let bad=Object.entries(sites).filter(([n,p])=>!vis[p[1]*W+p[0]]).map(([n,p])=>[n,p,clearAt(p[0],p[1])]);
  return {envelope:[w,h],centres:tl,passed:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,bad};}
 let clearances=[[19,15],[23,19],[31,27]].map(v=>flood(...v));if(clearances.some(v=>v.bad.length))throw Error("Failed exact-site clearance "+JSON.stringify(clearances));
 
 let obstructions=[[1002,431,1059,484]];
 let bypass=obstructions.map(b=>flood(31,27,b)); if(bypass[0].passed!==Object.keys(sites).length-1||bypass[0].bad[0]?.[0]!=="Lift junction")throw Error("Bypass "+JSON.stringify(bypass));
 // Source loader exact 14-root-key v2 payload, 20? budget and accepted Midge definition.
 let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:sites["West rover intake"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
 const expectedKeys=["actors","brush","edits","extent","fire","liquid_policy","material","next_id","normalize","response","rule_radius","selected","source","version"];
 if(JSON.stringify(Object.keys(setup).sort())!==JSON.stringify(expectedKeys))throw Error("Invalid Setup-v2 root schema");
 if(setup.actors.length!==1||JSON.stringify(Object.keys(setup.actors[0]).sort())!==JSON.stringify(["hash","id","model","options","spawn"]))throw Error("Invalid actor schema");
 if(setup.actors[0].spawn.length!==2||setup.actors[0].spawn.some((v,i)=>v!==sites["West rover intake"][i]))throw Error("Wrong literal Midge spawn");
 if(clearances.some(z=>z.passed!==Object.keys(sites).length))throw Error("Spawn / site blocked");
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
 const crops=[["01-west-nursery",0,334,545,537],["02-foldwing-west",518,208,530,580],["03-xenoseed-lift",793,245,510,513],["04-east-quarantine",1503,327,545,540],["05-dry-understrata",450,853,1130,171]];
 const images=[["overview.png",png(0,0,W,H)],...crops.map(([name,x,y,w,h])=>[name+".png",png(x,y,w,h)])];
 return {g,json,rect,hist,area,sites,clearances,bypass,rooted,unrooted,componentCount,rootedComponents,crops,images,tie_info,r2_workcell_anchors,detail_ties,seed:SEED};
}

function sha256(input){let b=typeof input==="string"?Uint8Array.from(input,c=>c.charCodeAt(0)):input;
const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
const n=(b.length+9+63)&~63,buf=new Uint8Array(n);buf.set(b);buf[b.length]=128;let bits=b.length*8;for(let i=0;i<8;i++){buf[n-1-i]=bits&255;bits=Math.floor(bits/256);}
let h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64);let rotr=(x,n)=>(x>>>n)|(x<<(32-n));
for(let off=0;off<n;off+=64){for(let j=0;j<16;j++){let i=off+j*4;w[j]=((buf[i]<<24)|(buf[i+1]<<16)|(buf[i+2]<<8)|buf[i+3])>>>0;}for(let j=16;j<64;j++){let p=w[j-15],q=w[j-2];w[j]=(w[j-16]+(rotr(p,7)^rotr(p,18)^(p>>>3))+w[j-7]+(rotr(q,17)^rotr(q,19)^(q>>>10)))>>>0;}let [a,b0,c,d,e,f,g,z]=h;for(let j=0;j<64;j++){let t1=(z+(rotr(e,6)^rotr(e,11)^rotr(e,25))+((e&f)^(~e&g))+K[j]+w[j])>>>0,t2=((rotr(a,2)^rotr(a,13)^rotr(a,22))+((a&b0)^(a&c)^(b0&c)))>>>0;z=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b0;b0=a;a=(t1+t2)>>>0;}for(let j=0;j<8;j++)h[j]=(h[j]+[a,b0,c,d,e,f,g,z][j])>>>0;}return h.map(n=>n.toString(16).padStart(8,"0")).join("");}
function makeReceipt(a){return {concept:"Threnody Scar - Foldwing Xenoseed Lift",lane:"original/scifi-frontier-wide",original_no_source:true,seed:a.seed,extent:[2048,1024],material_cell_count:a.g.length,engine_accepted_main:"7b03aa437561ec63e31fd09531171360ab60eeb4",reference_repo_default_main:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",source_loader_max_rectangles:32768,source_loader_max_setup_bytes:1048576,source_rectangle_work_budget:32000000,bridge_legacy_capacity_risk:4096,material_rule_assumption:"Only catalogue-supported static inert immobile Solid/None IDs; no powder, fluids, reactive or combustible foundation",material_histogram:a.hist,filled_material_cells:a.area,grounded_cells:a.rooted,ungrounded_cells:a.unrooted,grounded_components:a.rootedComponents,all_solid_components:a.componentCount,physical_fixture_ties:a.tie_info,foldwing_support_anchors:a.r2_workcell_anchors,detail_ties:a.detail_ties,creator_revision:'R2 custody lift and mechanized entered workfaces 2026-11-20',nonoverlapping_ordered_rectangles:a.rect.length,rectangle_work:a.area,setup_bytes:a.json.length,material_plane_sha256:sha256(a.g),setup_sha256:sha256(a.json),images:a.images.map(([name,b])=>({name,bytes:b.length,sha256:sha256(b)})),clearance:a.clearances,physical_obstruction:{cell_box_xyxy:[1002,431,1059,484],material_id:58,purpose:"Blocks only exact Lift junction; all other named destinations remain recoverable",result:a.bypass},sites:a.sites,accepted_actor_schema:["id","model","hash","spawn","options"],literal_midge_spawn:a.sites["West rover intake"],crops:a.crops,source_art:"None; wholly new original invented sci-fi frontier",static_construction:"PASS",native_status:"NATIVE-UNTESTED",review_status:"Await independent exact-head Art / Technical / Shepherd; Draft/HOLD"};}

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
