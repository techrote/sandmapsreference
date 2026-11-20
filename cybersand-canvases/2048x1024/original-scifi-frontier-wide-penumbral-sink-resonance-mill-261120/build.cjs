"use strict";
function build(){
 const W=2048,H=1024,SEED=0x3E717A, g=new Uint8Array(W*H);
 const M={rock:100,schist:101,iron:49,wall:58,steel:62,blue:63,conduit:66,titanium:68,window:120,frost:121,quartz:122,glassDark:129,ceramic:130,chrome:131,signal:77,amber:79,white:80};
 let rng=SEED; function rand(){rng^=rng<<13;rng^=rng>>>17;rng^=rng<<5;return(rng>>>0)/4294967296;}
 function R(x,y,w,h,m){let x0=Math.max(0,Math.round(x)),x1=Math.min(W,Math.round(x+w)),y0=Math.max(0,Math.round(y)),y1=Math.min(H,Math.round(y+h));if(x0>=x1||y0>=y1)return;for(let yy=y0;yy<y1;yy++)g.fill(m,yy*W+x0,yy*W+x1);}
 function P(p,m){let ymin=Math.max(0,Math.floor(Math.min(...p.map(a=>a[1])))),ymax=Math.min(H-1,Math.ceil(Math.max(...p.map(a=>a[1]))));for(let y=ymin;y<=ymax;y++){let xs=[];for(let i=0;i<p.length;i++){let a=p[i],b=p[(i+1)%p.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2)R(Math.ceil(xs[i]),y,Math.max(0,Math.floor(xs[i+1])-Math.ceil(xs[i])+1),1,m);}}
 function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,r=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-r));yy<Math.min(H,Math.ceil(Math.max(y,Y)+r)+1);yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-r));xx<Math.min(W,Math.ceil(Math.max(x,X)+r)+1);xx++){let f=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(d||1)));if((xx-x-f*dx)**2+(yy-y-f*dy)**2<=r*r)g[yy*W+xx]=m;}}
 function ellipse(cx,cy,rx,ry,mat){for(let y=Math.max(0,cy-ry);y<Math.min(H,cy+ry+1);y++)for(let x=Math.max(0,cx-rx);x<Math.min(W,cx+rx+1);x++)if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)g[y*W+x]=mat;}






 // PENUMBRAL SINK — Split-Mirror Resonance Mill. Entirely new material geography.
 // An enormous broken oval listening dish, not a foldwing, spans a mined sink.
 const grade=x=>Math.round(970+3*Math.sin(x*.011)+2*Math.sin(x*.035));
 for(let x=0;x<W;x++)R(x,grade(x),1,H-grade(x),M.rock);
 P([[0,1024],[0,274],[66,298],[164,376],[277,529],[383,733],[486,1024]],M.rock);
 P([[2048,1024],[2048,284],[1962,309],[1870,385],[1759,540],[1654,725],[1541,1024]],M.rock);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(g[y*W+x]===M.rock){let s=(y+(x>>5))%119;if(s<4)g[y*W+x]=M.schist;else if(s<7)g[y*W+x]=M.iron;}
 // Inhabited west and east, three separate accessible operations per wall.
 for(let [x,y,w,h] of [[30,394,515,142],[75,558,502,148],[105,718,500,150],[1519,391,501,145],[1486,553,526,152],[1490,712,530,155],[440,844,1191,105],[466,744,112,208],[1472,748,119,205]])R(x,y,w,h,0);
 for(let [x,y,w,m] of [[43,529,474,M.steel],[81,703,467,M.ceramic],[113,863,483,M.titanium],[1532,530,465,M.ceramic],[1499,702,492,M.steel],[1500,861,505,M.titanium]]){R(x,y,w,12,m);R(x+9,y+12,w-18,4,M.blue);}
 // West rover depot, high-pressure machine, resonant sample laboratories.
 R(77,515,171,11,M.chrome);R(92,465,24,45,M.iron);R(135,481,75,28,M.glassDark);R(222,474,15,33,M.signal);
 R(266,513,218,12,M.titanium);R(285,460,24,49,M.chrome);R(320,479,71,26,M.frost);L(296,457,347,439,7,M.conduit);R(344,438,14,10,M.amber);
 R(105,692,187,10,M.steel);R(129,644,25,43,M.iron);R(168,659,94,28,M.glassDark);for(let k=0;k<5;k++)R(177+16*k,663,10,12,k%2?M.window:M.quartz);
 R(323,692,220,10,M.ceramic);R(339,646,25,43,M.chrome);ellipse(406,670,34,19,M.titanium);ellipse(406,670,25,13,M.glassDark);ellipse(406,670,8,5,M.signal);
 R(143,851,192,9,M.steel);R(159,805,22,41,M.iron);R(218,816,91,25,M.frost);
 R(358,850,216,10,M.titanium);R(373,803,23,43,M.chrome);R(423,813,108,28,M.glassDark);
 // Giant inverted elliptical baffle; hollow real-space ring, never a filled scenic panel.
 ellipse(1027,463,339,224,M.chrome);ellipse(1027,463,320,207,0);
 ellipse(1027,463,321,208,M.steel);ellipse(1027,463,308,194,0);
 // Four deliberately engineered missing mirror segments permit entrances and overflight.
 R(990,212,78,70,0);R(1001,657,70,65,0);
 R(683,433,183,99,0);R(1192,431,180,102,0);
 // Dish is grounded by two asymmetric load frames in geological floor.
 L(734,571,601,961,21,M.titanium);L(1323,575,1457,961,22,M.steel);
 L(704,473,566,816,11,M.conduit);L(1349,479,1494,810,11,M.conduit);
 R(706,540,48,11,M.blue);R(1300,544,57,11,M.blue);
 // Mid-depth pressure analyzer, independently operated at one-to-one Midge scale.
 R(823,683,426,16,M.steel);R(844,699,380,7,M.blue);
 L(839,688,759,962,14,M.chrome);L(1228,686,1333,965,14,M.titanium);
 R(860,645,147,11,M.ceramic);R(874,601,24,41,M.chrome);R(916,619,69,23,M.glassDark);R(985,606,16,35,M.signal);
 R(1075,645,147,11,M.ceramic);R(1090,600,25,42,M.iron);R(1127,615,68,24,M.window);
 L(996,433,996,595,8,M.conduit);L(1060,430,1060,596,8,M.chrome);
 R(990,555,81,11,M.titanium);R(1010,574,44,20,M.glassDark);ellipse(1032,579,14,10,M.frost);
 R(1030,545,13,9,M.amber);
 // Basin rescue staging, different from central mill equipment.
 R(619,834,214,15,M.ceramic);R(637,793,22,40,M.chrome);R(682,809,96,22,M.glassDark);
 R(1225,834,217,15,M.steel);R(1245,792,24,39,M.iron);R(1292,810,101,20,M.frost);
 // East specimen sluice, sorting centrifuge, radiation archive, rover services.
 R(1570,515,195,11,M.ceramic);R(1594,469,23,42,M.chrome);R(1633,481,66,27,M.glassDark);R(1717,468,21,40,M.frost);
 R(1800,516,193,10,M.steel);R(1813,469,22,42,M.iron);R(1854,481,59,27,M.window);R(1926,470,18,39,M.chrome);
 R(1542,689,209,10,M.titanium);R(1565,643,24,42,M.chrome);L(1578,642,1632,624,7,M.conduit);R(1627,619,15,12,M.signal);
 for(let k=0;k<4;k++)R(1653+19*k,660,10,24,k%2?M.glassDark:M.frost);
 R(1785,692,224,10,M.ceramic);R(1804,641,25,47,M.iron);R(1851,663,75,24,M.window);R(1931,645,44,40,M.frost);
 R(1527,850,227,11,M.steel);R(1546,808,24,41,M.chrome);R(1605,819,90,28,M.glassDark);
 R(1785,851,224,11,M.titanium);R(1803,811,25,36,M.iron);R(1852,816,98,30,M.window);R(1950,819,33,24,M.frost);
 // Four entered industrial process bays within deep cross-rift return.
 R(601,942,185,15,M.steel);R(620,911,26,30,M.chrome);L(634,909,680,898,7,M.conduit);R(675,924,87,17,M.glassDark);
 R(815,941,204,17,M.ceramic);R(833,909,23,30,M.iron);ellipse(910,925,30,15,M.chrome);ellipse(910,925,22,10,M.glassDark);ellipse(910,925,7,5,M.signal);R(952,916,55,24,M.frost);
 R(1062,941,197,16,M.titanium);R(1080,918,20,22,M.chrome);for(let k=0;k<7;k++)R(1114+17*k,918+k%2*4,8,22,M.iron);R(1234,916,16,24,M.amber);
 R(1310,943,187,15,M.steel);R(1327,912,24,29,M.iron);L(1341,908,1390,896,6,M.chrome);R(1391,917,78,23,M.glassDark);R(1475,919,15,22,M.conduit);
 for(let x of [611,824,1070,1318,1482])R(x,940,10,33,M.steel);
 // Deliberate wide flight corridors, shafts, and low recovery.
 R(459,460,128,460,0);R(1478,461,121,461,0);
 R(551,467,932,73,0);R(549,740,952,74,0);R(520,855,1016,73,0);
 R(554,555,91,361,0);R(1429,550,91,366,0);
 R(862,445,336,83,0);R(988,257,87,79,0);
 const sites={
 "West rover arrivals":[180,445],"West compressor":[336,448],
 "West laboratory":[203,612],"West sample custody":[416,618],
 "West refuge":[249,781],"West mechanical workshop":[459,782],
 "West service exit":[527,574],"West rim sensor":[730,238],
 "Upper sky bypass":[1032,150],"East rim sensor":[1321,239],
 "West ring portal":[830,486],"Ring centre":[1032,462],"East ring portal":[1222,485],
 "Mill intake":[923,573],"Mill drop transfer":[1034,576],"Mill receiver":[1153,571],
 "East service exit":[1550,571],"West lower basin":[678,759],
 "Central basin recovery":[1032,770],"East lower basin":[1352,761],
 "Deep west shaft":[560,885],"Deep ore assay":[699,881],
 "Deep pressure rotor":[915,881],"Deep archive":[1157,879],
 "Deep rover garage":[1408,885],"Deep east shaft":[1510,885],
 "East quarantine":[1698,447],"East classifier":[1902,443],
 "East sterile sluice":[1695,621],"East radiation archive":[1901,620],
 "East geology":[1689,776],"East rover freight":[1900,779]
 };
 // Explicit cardinal-reachable alternate circulation, no target coordinate substitution.
 for(const [x,y,X,Y,t] of [
 [182,445,610,494,63],[610,494,1435,494,66],[1436,494,1902,445,64],
 [600,495,600,885,66],[600,885,1488,885,72],[1487,885,1487,497,66],
 [685,505,685,761,68],[1352,506,1353,760,68],[687,761,1353,761,69],
 [737,478,731,230,62],[1321,481,1322,232,62],[732,225,1032,150,63],[1031,150,1321,228,63],
 [910,490,919,575,61],[1153,493,1152,575,61],[922,575,1153,573,64],
 [530,576,560,883,61],[1550,571,1510,882,62]
 ])L(x,y,X,Y,t,0);
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

 /* Old generator geometry not used. */

 // PENUMBRAL_R2_REPAIR: independently requested mill-process and lower-return
 // machinery are physical IDs added AFTER named-site clearance and island repair.
 // Open upper 31x27 flight envelopes remain empty; all devices are loadbearing
 // and seat directly on existing deck surfaces or the grounded lower floor.
 // (A) Mill inlet: open-bed coaxial clamp, offset metering fingers, feed rollers.
 R(846,665,155,12,M.titanium);R(851,655,146,7,M.chrome);
 R(858,639,16,14,M.iron);R(877,649,20,5,M.blue);
 for(let k=0;k<6;k++){R(886+k*17,652,11,8,k&1?M.frost:M.window);}
 L(860,644,880,621,6,M.conduit);R(875,616,19,12,M.signal);
 // (B) Central physical milling contact: guarded drum and staggered stylus.
 R(1002,668,105,14,M.steel);R(1010,661,87,7,M.ceramic);
 ellipse(1050,643,40,19,M.chrome);ellipse(1050,643,29,13,M.glassDark);
 ellipse(1050,643,13,6,M.iron);R(1045,635,11,5,M.amber);
 R(1017,620,9,18,M.conduit);L(1020,620,1046,631,6,M.titanium);
 R(1084,618,13,23,M.frost);L(1091,616,1111,600,5,M.conduit);
 // (C) Outfeed: distinct receiving cradle and indexed examination cassette.
 R(1115,662,104,14,M.ceramic);R(1122,656,93,5,M.chrome);
 R(1131,636,13,18,M.iron);R(1150,637,43,16,M.window);
 R(1197,622,13,31,M.signal);R(1162,628,16,8,M.amber);
 L(1151,638,1131,628,5,M.conduit);
 // Real readout/tether carried to mirror baffle, without filling ring portal.
 L(993,612,997,635,5,M.conduit);L(997,635,1013,639,5,M.blue);
 // Deep bay (1): serrated core-bite assay and a graduated optical sampler.
 R(619,923,153,13,M.titanium);R(629,914,133,8,M.chrome);
 for(let k=0;k<6;k++){R(635+k*17,909,10,12,k&1?M.quartz:M.iron);}
 R(642,899,14,11,M.conduit);L(649,899,676,908,5,M.chrome);
 // Deep bay (2): pressure rotor with concentric physical hubs/guard.
 R(836,923,177,13,M.iron);ellipse(910,925,36,18,M.chrome);
 ellipse(910,925,25,12,M.glassDark);ellipse(910,925,11,7,M.amber);
 R(960,913,45,16,M.window);R(980,906,11,9,M.signal);
 // Deep bay (3): upright sealed sample-archive rack, individual glass cassettes.
 R(1080,924,162,13,M.titanium);R(1092,910,11,14,M.steel);
 for(let k=0;k<6;k++){let x=1110+k*19;R(x,909,13,17,k&1?M.window:M.frost);R(x+3,906,7,4,M.signal);}
 R(1224,909,12,16,M.iron);
 // Deep bay (4): asymmetric rover recovery hitch and low hoist.
 R(1325,926,153,12,M.ceramic);R(1332,915,29,11,M.iron);
 L(1363,923,1393,913,7,M.chrome);
 R(1394,915,58,18,M.glassDark);R(1450,917,12,14,M.amber);
 R(1461,919,14,11,M.steel);
 // Distinct non-rock meaningful material must survive into final cell plane.
 const featureRegions=[
  ["mill operation",850,615,1224,684,600],
  ["ore assay",612,905,785,941,250],
  ["pressure rotor",812,905,1025,941,250],
  ["archive",1055,904,1262,941,250],
  ["rover recovery",1300,907,1500,942,250]
 ];
 // Component tethering follows; region check happens after it.
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
  let s=sites["West rover arrivals"],si=s[1]*W+s[0];if(!pass[si])throw Error("Spawn blocked "+w+" "+h);
  queue[tl++]=si;vis[si]=1;while(hd<tl){let a=queue[hd++],x=a%W;let j=a-W;if(j>=0&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}j=a+W;if(j<g.length&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}j=a-1;if(x>0&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}j=a+1;if(x<W-1&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}}
  let bad=Object.entries(sites).filter(([n,p])=>!vis[p[1]*W+p[0]]).map(([n,p])=>[n,p,clearAt(p[0],p[1])]);
  return {envelope:[w,h],centres:tl,passed:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,bad};}
 let clearances=[[19,15],[23,19],[31,27]].map(v=>flood(...v));if(clearances.some(v=>v.bad.length))throw Error("Failed exact-site clearance "+JSON.stringify(clearances));
 
 let obstructions=[[1006,547,1067,606]];
 let bypass=obstructions.map(b=>flood(31,27,b)); if(bypass[0].passed!==Object.keys(sites).length-1||bypass[0].bad[0]?.[0]!=="Mill drop transfer")throw Error("Bypass "+JSON.stringify(bypass));
 // Source loader exact 14-root-key v2 payload, 20? budget and accepted Midge definition.
 let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:sites["West rover arrivals"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
 const expectedKeys=["actors","brush","edits","extent","fire","liquid_policy","material","next_id","normalize","response","rule_radius","selected","source","version"];
 if(JSON.stringify(Object.keys(setup).sort())!==JSON.stringify(expectedKeys))throw Error("Invalid Setup-v2 root schema");
 if(setup.actors.length!==1||JSON.stringify(Object.keys(setup.actors[0]).sort())!==JSON.stringify(["hash","id","model","options","spawn"]))throw Error("Invalid actor schema");
 if(setup.actors[0].spawn.length!==2||setup.actors[0].spawn.some((v,i)=>v!==sites["West rover arrivals"][i]))throw Error("Wrong literal Midge spawn");
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
 const crops=[["01-west-compressor",0,280,568,630],["02-split-mirror",560,170,936,610],["03-mill-chamber",786,416,515,417],["04-east-quarantine",1487,290,561,621],["05-deep-machinery",430,818,1210,184]];
 const images=[["overview.png",png(0,0,W,H)],...crops.map(([name,x,y,w,h])=>[name+".png",png(x,y,w,h)])];
 return {g,json,rect,hist,area,sites,clearances,bypass,rooted,unrooted,componentCount,rootedComponents,crops,images,tie_info,r2_workcell_anchors,detail_ties,seed:SEED};
}

function sha256(input){let b=typeof input==="string"?Uint8Array.from(input,c=>c.charCodeAt(0)):input;
const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
const n=(b.length+9+63)&~63,buf=new Uint8Array(n);buf.set(b);buf[b.length]=128;let bits=b.length*8;for(let i=0;i<8;i++){buf[n-1-i]=bits&255;bits=Math.floor(bits/256);}
let h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64);let rotr=(x,n)=>(x>>>n)|(x<<(32-n));
for(let off=0;off<n;off+=64){for(let j=0;j<16;j++){let i=off+j*4;w[j]=((buf[i]<<24)|(buf[i+1]<<16)|(buf[i+2]<<8)|buf[i+3])>>>0;}for(let j=16;j<64;j++){let p=w[j-15],q=w[j-2];w[j]=(w[j-16]+(rotr(p,7)^rotr(p,18)^(p>>>3))+w[j-7]+(rotr(q,17)^rotr(q,19)^(q>>>10)))>>>0;}let [a,b0,c,d,e,f,g,z]=h;for(let j=0;j<64;j++){let t1=(z+(rotr(e,6)^rotr(e,11)^rotr(e,25))+((e&f)^(~e&g))+K[j]+w[j])>>>0,t2=((rotr(a,2)^rotr(a,13)^rotr(a,22))+((a&b0)^(a&c)^(b0&c)))>>>0;z=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b0;b0=a;a=(t1+t2)>>>0;}for(let j=0;j<8;j++)h[j]=(h[j]+[a,b0,c,d,e,f,g,z][j])>>>0;}return h.map(n=>n.toString(16).padStart(8,"0")).join("");}
function makeReceipt(a){return {concept:"Penumbral Sink - Split-Mirror Resonance Mill",lane:"original/scifi-frontier-wide",original_no_source:true,seed:a.seed,extent:[2048,1024],material_cell_count:a.g.length,engine_accepted_main:"7b03aa437561ec63e31fd09531171360ab60eeb4",reference_repo_default_main:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",source_loader_max_rectangles:32768,source_loader_max_setup_bytes:1048576,source_rectangle_work_budget:32000000,bridge_legacy_capacity_risk:4096,material_rule_assumption:"Only catalogue-supported static inert immobile Solid/None IDs; no powder, fluids, reactive or combustible foundation",material_histogram:a.hist,filled_material_cells:a.area,grounded_cells:a.rooted,ungrounded_cells:a.unrooted,grounded_components:a.rootedComponents,all_solid_components:a.componentCount,physical_fixture_ties:a.tie_info,resonance_support_anchors:a.r2_workcell_anchors,detail_ties:a.detail_ties,creator_revision:'R2 P1 grounded mill transaction and differentiated deep machinery 2026-11-20',nonoverlapping_ordered_rectangles:a.rect.length,rectangle_work:a.area,setup_bytes:a.json.length,material_plane_sha256:sha256(a.g),setup_sha256:sha256(a.json),images:a.images.map(([name,b])=>({name,bytes:b.length,sha256:sha256(b)})),clearance:a.clearances,physical_obstruction:{cell_box_xyxy:[1006,547,1067,606],material_id:58,purpose:"Blocks only exact Mill drop transfer; all other named destinations remain recoverable",result:a.bypass},sites:a.sites,accepted_actor_schema:["id","model","hash","spawn","options"],literal_midge_spawn:a.sites["West rover arrivals"],crops:a.crops,source_art:"None. Original quarry, broken elliptical mirror and inhabited machinery",static_construction:"PASS",native_status:"NATIVE-UNTESTED",review_status:"Await independent exact-head Art / Technical / Shepherd; Draft/HOLD"};}

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

