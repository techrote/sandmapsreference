"use strict";
function build(){
 const W=2048,H=1024,SEED=0x26A721, g=new Uint8Array(W*H);
 const M={rock:100,schist:101,iron:49,wall:58,steel:62,blue:63,conduit:66,titanium:68,window:120,frost:121,quartz:122,glassDark:129,ceramic:130,chrome:131,signal:77,amber:79,white:80};
 let rng=SEED; function rand(){rng^=rng<<13;rng^=rng>>>17;rng^=rng<<5;return(rng>>>0)/4294967296;}
 function R(x,y,w,h,m){let x0=Math.max(0,Math.round(x)),x1=Math.min(W,Math.round(x+w)),y0=Math.max(0,Math.round(y)),y1=Math.min(H,Math.round(y+h));if(x0>=x1||y0>=y1)return;for(let yy=y0;yy<y1;yy++)g.fill(m,yy*W+x0,yy*W+x1);}
 function P(p,m){let ymin=Math.max(0,Math.floor(Math.min(...p.map(a=>a[1])))),ymax=Math.min(H-1,Math.ceil(Math.max(...p.map(a=>a[1]))));for(let y=ymin;y<=ymax;y++){let xs=[];for(let i=0;i<p.length;i++){let a=p[i],b=p[(i+1)%p.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2)R(Math.ceil(xs[i]),y,Math.max(0,Math.floor(xs[i+1])-Math.ceil(xs[i])+1),1,m);}}
 function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,r=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-r));yy<Math.min(H,Math.ceil(Math.max(y,Y)+r)+1);yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-r));xx<Math.min(W,Math.ceil(Math.max(x,X)+r)+1);xx++){let f=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(d||1)));if((xx-x-f*dx)**2+(yy-y-f*dy)**2<=r*r)g[yy*W+xx]=m;}}
 function ellipse(cx,cy,rx,ry,mat){for(let y=Math.max(0,cy-ry);y<Math.min(H,cy+ry+1);y++)for(let x=Math.max(0,cx-rx);x<Math.min(W,cx+rx+1);x++)if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)g[y*W+x]=mat;}



 // ASTER DRIFT / THREE NEEDLE STORM REFUGE. Three different grounded atmospheric
 // spires and social/science/industrial habitation occupy an eroded off-world shelf.
 const profile=x=>Math.round(858+13*Math.sin(x*.008)+6*Math.cos(x*.031));
 for(let x=0;x<W;x++){let y=profile(x);R(x,y,1,H-y,M.rock);}
 P([[0,1024],[0,375],[65,395],[140,454],[219,550],[300,731],[400,1024]],M.rock);
 P([[2048,1024],[2048,389],[1960,430],[1908,503],[1817,622],[1737,827],[1657,1024]],M.rock);
 for(let y=0;y<H;y++){let o=y*W;for(let x=0;x<W;x++)if(g[o+x]===M.rock){let z=(y+(x>>4)+Math.round(5*Math.sin(x*.013)))%109;if(z<6)g[o+x]=M.schist;else if(z<9)g[o+x]=M.iron;}}
 R(265,880,1512,104,0);R(299,650,104,331,0);R(1691,640,106,342,0);
 for(const [x,w] of [[500,206],[815,214],[1180,235],[1495,153]]){R(x,937,w,77,0);R(x+12,1005,w-24,9,M.steel);}
 // Person-scale excavated habitation (north-west), below a crescent escarpment.
 for(const [x,y,w,h] of [[40,411,336,103],[89,527,330,100],[93,649,339,110],[133,769,310,83],
 [1661,433,369,106],[1598,552,439,116],[1590,675,445,109],[1657,786,376,81]])R(x,y,w,h,0);
 for(const [x,y,w] of [[70,513,288],[100,626,302],[106,755,317],[144,849,279],
 [1680,539,340],[1615,669,398],[1608,780,402],[1667,866,344]]){R(x,y,w,11,M.steel);R(x+13,y+11,w-27,4,M.blue);}
 // Cargo ferry, public meal/workrooms and forging/cryo plant on western inhabited shelves.
 R(99,492,116,11,M.ceramic);L(115,491,132,457,9,M.chrome);L(196,490,187,460,9,M.titanium);
 R(121,453,59,14,M.window);R(136,443,33,10,M.glassDark);
 R(251,493,98,9,M.chrome);R(265,468,20,24,M.signal);R(302,473,33,19,M.window);
 R(133,604,90,13,M.ceramic);for(let x of [145,177,201]){R(x,574,15,28,M.window);R(x+5,563,6,10,M.amber);}
 R(261,610,110,11,M.steel);R(270,584,16,25,M.glassDark);R(309,594,44,15,M.frost);
 R(150,738,158,11,M.titanium);R(160,700,18,37,M.chrome);R(277,704,15,34,M.titanium);
 R(188,717,72,19,M.iron);R(220,691,21,28,M.signal);R(335,711,33,26,M.glassDark);
 R(166,828,144,13,M.ceramic);ellipse(237,800,31,26,M.chrome);ellipse(237,800,20,16,0);
 R(315,805,24,24,M.frost);
 // Three tall structurally separate visual idioms: fork-tip sensor, slotted
 // cryogenic vertical condenser, and asymmetric broad-leaf lightning receiver.
 L(569,861,575,209,24,M.titanium);L(717,861,705,259,22,M.steel);
 L(575,208,634,115,15,M.chrome);L(706,259,657,114,16,M.steel);
 L(633,114,660,72,11,M.titanium);L(660,114,697,158,11,M.chrome);
 R(580,213,132,13,M.titanium);R(590,382,119,14,M.steel);R(585,555,128,14,M.titanium);
 R(606,238,90,10,M.ceramic);R(617,365,80,8,M.chrome);R(604,536,94,12,M.ceramic);
 R(611,345,20,19,M.window);R(653,335,28,27,M.glassDark);R(632,504,18,30,M.signal);
 // Central condenser is twin-legged, not a solid screen of inaccessible pixels.
 L(980,866,971,196,25,M.steel);L(1159,865,1144,235,26,M.titanium);
 L(970,197,1024,115,18,M.chrome);L(1144,235,1095,116,16,M.steel);
 L(1024,115,1058,78,12,M.titanium);L(1095,116,1088,83,12,M.chrome);
 R(985,252,173,15,M.titanium);R(984,425,172,17,M.steel);
 R(988,648,169,16,M.titanium);R(1005,275,120,110,0);R(1005,454,125,137,0);
 R(1031,350,18,27,M.window);R(1071,347,44,12,M.amber);R(1102,363,17,18,M.glassDark);
 R(1022,573,103,12,M.ceramic);R(1035,546,18,26,M.signal);R(1084,552,23,21,M.frost);
 L(1007,121,891,181,12,M.steel);L(1094,120,1215,178,11,M.titanium);
 R(884,171,40,13,M.window);R(1197,166,39,12,M.ceramic);
 // Eastern shield-leaf needle has a different section, operationally connected.
 L(1417,860,1411,286,24,M.steel);L(1539,861,1530,312,22,M.titanium);
 L(1411,286,1465,189,16,M.chrome);L(1530,311,1465,189,17,M.steel);
 L(1465,189,1603,226,14,M.titanium);
 R(1416,377,122,13,M.steel);R(1418,549,129,14,M.titanium);
 R(1416,734,139,15,M.steel);R(1430,358,89,12,M.ceramic);
 R(1440,333,27,26,M.window);R(1483,339,26,21,M.glassDark);
 R(1430,528,102,13,M.chrome);R(1442,499,19,27,M.amber);
 L(1483,524,1505,478,7,M.conduit);R(1498,463,22,15,M.frost);
 R(1431,716,95,14,M.ceramic);R(1442,695,24,20,M.window);
 L(1467,188,1467,110,7,M.steel);L(1436,136,1494,136,7,M.chrome);
 R(1458,117,27,17,M.signal);
 // West and east gantries have clear side approaches; solid trusses are real.
 for(const [x,y,X,Y,w] of [[384,721,567,572,17],[709,567,974,659,14],
 [1156,661,1408,558,15],[1549,560,1673,689,16],[704,390,976,427,11],
 [1155,428,1415,376,12],[1581,732,1695,817,16]]){
 L(x,y,X,Y,w,M.titanium);L(x+16,y+18,X-12,Y+20,5,M.conduit);
 }
 // East shield station: actual wash/scrub workface, specimen nursery, cargo
 // davit/transport and a separate anchored supercapacitor hall.
 R(1710,520,129,11,M.ceramic);R(1724,482,15,37,M.steel);R(1821,485,15,34,M.steel);
 for(let x of [1747,1777,1807]){R(x,486,16,30,M.frost);R(x+4,475,8,11,M.signal);}
 R(1847,518,128,9,M.chrome);R(1878,493,62,24,M.window);
 R(1629,649,142,13,M.ceramic);for(let x of [1645,1678,1712]){R(x,614,19,34,M.window);R(x+6,604,8,10,M.amber);}
 R(1793,650,176,13,M.steel);R(1810,618,19,32,M.chrome);
 R(1855,630,97,19,M.iron);L(1875,626,1890,577,7,M.titanium);
 R(1627,757,181,11,M.titanium);R(1653,726,22,30,M.glassDark);
 R(1690,729,106,17,M.iron);R(1876,758,136,12,M.ceramic);
 R(1892,721,26,34,M.window);R(1941,730,50,21,M.signal);
 R(1687,846,122,12,M.steel);for(let x of [1708,1746,1783]){R(x,809,25,35,M.iron);R(x+9,796,7,12,M.signal);}
 R(1890,845,106,12,M.titanium);R(1906,811,23,31,M.glassDark);
 // Geothermal refuge's four spatially separated maintenance bays.
 for(const [x,y,w] of [[521,999,152],[817,1000,155],[1203,1001,182],[1505,999,130]]){R(x,y,w,11,M.titanium);R(x+19,y-31,w-41,13,M.ceramic);}
 for(const [x,y,m] of [[557,973,M.window],[615,968,M.signal],[852,968,M.glassDark],[925,976,M.frost],
 [1235,966,M.window],[1318,968,M.amber],[1534,964,M.glassDark],[1599,964,M.signal]])R(x,y,20,23,m);
 ellipse(884,976,30,22,M.steel);ellipse(884,976,20,13,0);
 // Exact authored semantic sites: Midge-scale 1:1 game coordinates, no proxies.
 const sites={
 "West stormport":[304,574],"Shield ferry berth":[167,449],"Pilots mess":[238,572],
 "Storm cassette plant":[231,697],"West cryo testing":[244,800],"West descent":[352,919],
 "Anemometer crown":[651,174],"Upper diagnostic dock":[649,307],
 "Tower one midshaft":[647,467],"Wind bridge west":[812,503],
 "Grand atrium":[1008,618],"Crown transfer node":[1068,408],
 "Seismic reference pod":[1060,223],"Jetstream recovery":[1090,53],
 "Biofilter terrace":[1360,502],"Needle three upper":[1467,294],
 "East health quarantine":[1793,461],"Scrub holding bay":[1895,577],
 "Evacuation hangar":[1815,707],"Shield capacitor hall":[1888,802],
 "East tunnel mouth":[1744,922],"Fossil sensor lab":[588,916],
 "Return pump manifold":[886,928],"Thermal archive":[1298,925],
 "Storm cellar refuge":[1559,922],"Basin overflight":[1233,620]
 };
 const carve=(a,b,t=90)=>L(a[0],a[1],b[0],b[1],t,0);
 const paths=[
 [[304,574],[440,584],[650,615],[810,620],[1008,618],[1233,620],[1510,625],[1710,620],[1815,707]],
 [[304,574],[438,439],[503,306],[649,307],[651,174],[818,178],[1059,165],[1060,223]],
 [[1090,53],[1059,165],[1060,223],[1068,408],[1008,618]],
 [[651,174],[651,307],[647,467],[650,615]],
 [[647,467],[812,503],[1008,618]],
 [[1068,408],[1225,450],[1360,502],[1467,294]],
 [[1360,502],[1233,620],[1510,625]],
 [[304,574],[167,449],[238,572],[231,697],[244,800],[352,919]],
 [[304,574],[352,740],[352,919]],
 [[1744,922],[1559,922],[1298,925],[886,928],[588,916],[352,919]],
 [[1815,707],[1744,922]],
 [[1710,620],[1793,461],[1895,577],[1815,707],[1888,802],[1744,922]],
 [[1060,223],[900,114],[651,174]],
 [[1008,618],[967,784],[886,928]],
 [[1360,502],[1420,742],[1298,925]]
 ];
 for(const p of paths)for(let i=1;i<p.length;i++)carve(p[i-1],p[i],82);
 // Rescue sky-route across the condenser, above all grounded mast tips. It makes
 // the high observations recoverable if the central transfer pod is blocked.
 for(const a of [[[651,174],[750,53]],[[750,53],[1090,53]],[[1090,53],[1467,210]],[[1467,210],[1793,461]]])carve(a[0],a[1],77);
 R(268,892,1515,77,0);R(306,851,93,126,0);R(1691,856,105,124,0);
 for(const [name,[x,y]] of Object.entries(sites))R(x-21,y-19,43,39,0);
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
 for(const [name,[x,y]] of Object.entries(sites))R(x-21,y-19,43,39,0);
 // Each of these 3 corridors remains physically flyable at the largest envelope;
 // the separate underground passage is the deliberate primary-obstruction bypass.
 R(368,907,1380,52,0);
 for(const [name,[x,y]] of Object.entries(sites))R(x-21,y-19,43,39,0);
 const final_ties=tieStructures();
 for(const [name,[x,y]] of Object.entries(sites))R(x-21,y-19,43,39,0);
 // Dual physical buttress supports anchor the eastern needle into the inhabited rock ridge.
 L(1512,746,1890,881,18,M.titanium);
 L(1424,735,1838,880,15,M.steel);

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
  let s=sites["West stormport"],si=s[1]*W+s[0];if(!pass[si])throw Error("Spawn blocked "+w+" "+h);
  queue[tl++]=si;vis[si]=1;while(hd<tl){let a=queue[hd++],x=a%W;let j=a-W;if(j>=0&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}j=a+W;if(j<g.length&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}j=a-1;if(x>0&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}j=a+1;if(x<W-1&&pass[j]&&!vis[j]){vis[j]=1;queue[tl++]=j;}}
  let bad=Object.entries(sites).filter(([n,p])=>!vis[p[1]*W+p[0]]).map(([n,p])=>[n,p,clearAt(p[0],p[1])]);
  return {envelope:[w,h],centres:tl,passed:Object.keys(sites).length-bad.length,total:Object.keys(sites).length,bad};}
 let clearances=[[19,15],[23,19],[31,27]].map(v=>flood(...v));if(clearances.some(v=>v.bad.length))throw Error("Failed exact-site clearance "+JSON.stringify(clearances));
 
 let obstructions=[[1034,374,1113,448]];
 let bypass=obstructions.map(b=>flood(31,27,b)); if(bypass[0].passed!==Object.keys(sites).length-1||bypass[0].bad[0]?.[0]!=="Crown transfer node")throw Error("Bypass "+JSON.stringify(bypass));
 // Source loader exact 14-root-key v2 payload, 20? budget and accepted Midge definition.
 let setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:sites["West stormport"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect,response:"LA-SELECTIVE",liquid_policy:[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0],normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
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
 const crops=[["01-west-stormport",0,375,520,510],["02-fork-needle",445,62,419,718],["03-condenser",865,40,460,718],["04-shield-needle",1325,170,723,705],["05-geothermal-return",416,844,1240,180]];
 const images=[["overview.png",png(0,0,W,H)],...crops.map(([name,x,y,w,h])=>[name+".png",png(x,y,w,h)])];
 return {g,json,rect,hist,area,sites,clearances,bypass,rooted,unrooted,componentCount,rootedComponents,crops,images,tie_info,seed:SEED};
}

function sha256(input){let b=typeof input==="string"?Uint8Array.from(input,c=>c.charCodeAt(0)):input;
const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
const n=(b.length+9+63)&~63,buf=new Uint8Array(n);buf.set(b);buf[b.length]=128;let bits=b.length*8;for(let i=0;i<8;i++){buf[n-1-i]=bits&255;bits=Math.floor(bits/256);}
let h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64);let rotr=(x,n)=>(x>>>n)|(x<<(32-n));
for(let off=0;off<n;off+=64){for(let j=0;j<16;j++){let i=off+j*4;w[j]=((buf[i]<<24)|(buf[i+1]<<16)|(buf[i+2]<<8)|buf[i+3])>>>0;}for(let j=16;j<64;j++){let p=w[j-15],q=w[j-2];w[j]=(w[j-16]+(rotr(p,7)^rotr(p,18)^(p>>>3))+w[j-7]+(rotr(q,17)^rotr(q,19)^(q>>>10)))>>>0;}let [a,b0,c,d,e,f,g,z]=h;for(let j=0;j<64;j++){let t1=(z+(rotr(e,6)^rotr(e,11)^rotr(e,25))+((e&f)^(~e&g))+K[j]+w[j])>>>0,t2=((rotr(a,2)^rotr(a,13)^rotr(a,22))+((a&b0)^(a&c)^(b0&c)))>>>0;z=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b0;b0=a;a=(t1+t2)>>>0;}for(let j=0;j<8;j++)h[j]=(h[j]+[a,b0,c,d,e,f,g,z][j])>>>0;}return h.map(n=>n.toString(16).padStart(8,"0")).join("");}
function makeReceipt(a){return {concept:"Aster Drift - Three Needle Storm Refuge",lane:"original/scifi-frontier-wide",original_no_source:true,seed:a.seed,extent:[2048,1024],material_cell_count:a.g.length,engine_accepted_main:"de109d0131641d6adc8d25bb9ced7ca3d4991105",reference_repo_default_main:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",source_loader_max_rectangles:32768,source_loader_max_setup_bytes:1048576,source_rectangle_work_budget:32000000,bridge_legacy_capacity_risk:4096,material_rule_assumption:"Only catalogue-supported static inert immobile Solid/None IDs; no powder, fluids, reactive or combustible foundation",material_histogram:a.hist,filled_material_cells:a.area,grounded_cells:a.rooted,ungrounded_cells:a.unrooted,grounded_components:a.rootedComponents,all_solid_components:a.componentCount,physical_fixture_ties:a.tie_info,nonoverlapping_ordered_rectangles:a.rect.length,rectangle_work:a.area,setup_bytes:a.json.length,material_plane_sha256:sha256(a.g),setup_sha256:sha256(a.json),images:a.images.map(([name,b])=>({name,bytes:b.length,sha256:sha256(b)})),clearance:a.clearances,physical_obstruction:{cell_box_xyxy:[1034,374,1113,448],material_id:58,purpose:"Blocks exact Crown transfer node; all other named destinations remain recoverable",result:a.bypass},sites:a.sites,crops:a.crops,source_art:"None; independently invented level design",static_construction:"PASS",native_status:"NATIVE-UNTESTED",review_status:"Await independent exact-head Art / Technical / Shepherd; Draft/HOLD"};}

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
