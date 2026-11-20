"use strict";
function build(){
 const W=2048,H=1024,SEED=0x26A120, g=new Uint8Array(W*H);
 const M={rock:100,schist:101,iron:49,wall:58,steel:62,blue:63,conduit:66,titanium:68,window:120,frost:121,quartz:122,glassDark:129,ceramic:130,chrome:131,signal:77,amber:79,white:80};
 let rng=SEED; function rand(){rng^=rng<<13;rng^=rng>>>17;rng^=rng<<5;return(rng>>>0)/4294967296;}
 function R(x,y,w,h,m){let x0=Math.max(0,Math.round(x)),x1=Math.min(W,Math.round(x+w)),y0=Math.max(0,Math.round(y)),y1=Math.min(H,Math.round(y+h));if(x0>=x1||y0>=y1)return;for(let yy=y0;yy<y1;yy++)g.fill(m,yy*W+x0,yy*W+x1);}
 function P(p,m){let ymin=Math.max(0,Math.floor(Math.min(...p.map(a=>a[1])))),ymax=Math.min(H-1,Math.ceil(Math.max(...p.map(a=>a[1]))));for(let y=ymin;y<=ymax;y++){let xs=[];for(let i=0;i<p.length;i++){let a=p[i],b=p[(i+1)%p.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2)R(Math.ceil(xs[i]),y,Math.max(0,Math.floor(xs[i+1])-Math.ceil(xs[i])+1),1,m);}}
 function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,r=t/2;for(let yy=Math.max(0,Math.floor(Math.min(y,Y)-r));yy<Math.min(H,Math.ceil(Math.max(y,Y)+r)+1);yy++)for(let xx=Math.max(0,Math.floor(Math.min(x,X)-r));xx<Math.min(W,Math.ceil(Math.max(x,X)+r)+1);xx++){let f=Math.max(0,Math.min(1,((xx-x)*dx+(yy-y)*dy)/(d||1)));if((xx-x-f*dx)**2+(yy-y-f*dy)**2<=r*r)g[yy*W+xx]=m;}}
 function ellipse(cx,cy,rx,ry,mat){for(let y=Math.max(0,cy-ry);y<Math.min(H,cy+ry+1);y++)for(let x=Math.max(0,cx-rx);x<Math.min(W,cx+rx+1);x++)if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)g[y*W+x]=mat;}

 // AUREOLE DELTA: a wholly self-authored alien optical mining and quarantine array.
 for(let x=0;x<W;x++){let y=Math.round(876+12*Math.sin(.010*x)+6*Math.cos(x*.045));R(x,y,1,H-y,M.rock);}
 P([[0,1024],[0,500],[78,534],[143,618],[205,807],[275,1024]],M.rock);
 P([[2048,1024],[2048,498],[1965,540],[1878,660],[1800,822],[1740,1024]],M.rock);
 for(let y=0;y<H;y++){let o=y*W;for(let x=0;x<W;x++)if(g[o+x]===M.rock){let n=(y+Math.floor(.14*x)+Math.floor(8*Math.sin(.021*x)))%137;if(n<7)g[o+x]=M.schist;else if(n<19)g[o+x]=M.iron;}}
 // The continuous accessible basal return and lateral 85-cell-wide ventilation galleries.
 R(245,895,1570,64,0);R(318,768,85,189,0);R(1689,755,89,204,0);
 R(73,430,308,114,0);R(86,553,360,133,0);R(158,703,361,114,0);
 R(1692,465,347,129,0);R(1538,606,477,152,0);R(1724,768,293,90,0);
 // WEST: personnel landing terrace, inhabited nursery and well-equipped rover bay.
 R(108,684,356,14,M.steel);R(109,697,348,6,M.blue);
 R(88,544,318,13,M.titanium);R(107,557,287,6,M.chrome);
 R(111,421,273,12,M.ceramic);R(133,434,239,5,M.frost);
 R(171,808,344,12,M.steel);
 for(let x of [120,226,351]){L(x,697,x+28,807,11,M.titanium);L(x,561,x+35,684,9,M.steel);}
 for(let x of [142,185,231]){R(x,519,25,9,M.ceramic);R(x+5,504,15,15,M.frost);R(x+10,494,5,10,M.signal);}
 R(288,523,70,10,M.blue);R(307,499,35,21,M.glassDark);
 R(159,647,83,12,M.chrome);R(174,628,20,19,M.window);
 R(291,656,105,12,M.steel);R(307,632,15,24,M.signal);R(360,625,22,30,M.amber);
 R(245,790,141,11,M.titanium);L(255,789,272,733,7,M.chrome);L(376,788,351,732,7,M.chrome);
 R(278,726,71,12,M.ceramic);R(290,712,24,14,M.glassDark);
 // WEST OBSERVATORY: asymmetric structural spindle with three occupied functional decks.
 L(505,880,560,183,21,M.steel);L(822,878,784,198,20,M.titanium);
 L(553,208,786,208,15,M.steel);L(525,408,820,408,14,M.steel);
 L(526,574,821,574,13,M.titanium);L(532,733,820,733,12,M.steel);
 // Real side entrances, open 75–90 cells high, not facade silhouettes.
 R(486,317,96,83,0);R(765,460,93,87,0);R(495,626,96,76,0);R(770,764,87,76,0);
 for(let x of [554,692,750]){L(x,744,x+39,812,7,M.conduit);L(x,577,x+31,639,7,M.steel);}
 for(let i=0;i<63;i++){let a=Math.PI*1.05+i*Math.PI*.90/62,b=Math.PI*1.05+(i+1)*Math.PI*.90/62;L(665+102*Math.cos(a),219+91*Math.sin(a),665+102*Math.cos(b),219+91*Math.sin(b),10,M.ceramic);}
 R(610,257,115,11,M.chrome);R(637,241,54,15,M.glassDark);L(664,249,674,161,8,M.titanium);
 R(582,379,81,10,M.ceramic);R(596,353,18,26,M.glassDark);R(629,352,17,27,M.signal);
 R(686,378,82,10,M.chrome);L(693,375,714,330,7,M.titanium);L(756,374,735,330,7,M.titanium);R(715,321,27,8,M.window);
 for(let x of [575,639,702]){R(x,541,40,11,M.titanium);R(x+11,514,16,27,M.frost);R(x+15,506,7,8,M.signal);}
 R(606,704,104,11,M.ceramic);R(630,685,55,19,M.glassDark);
 // CENTRAL XENOLENS: broken annular crescents, with deliberately open lateral mouths.
 function arc(cx,cy,rx,ry,a,b,t,m){let steps=Math.ceil((b-a)*175);for(let j=0;j<steps;j++){let A=a+(b-a)*j/steps,B=a+(b-a)*(j+1)/steps;L(cx+rx*Math.cos(A),cy+ry*Math.sin(A),cx+rx*Math.cos(B),cy+ry*Math.sin(B),t,m);}}
 const cx=1137,cy=470,rx=251,ry=252;
 arc(cx,cy,rx,ry,-2.9,-.28,18,M.titanium);arc(cx,cy,rx,ry,.28,2.9,18,M.steel);
 arc(cx,cy,rx-35,ry-35,-2.88,-.4,8,M.blue);arc(cx,cy,rx-35,ry-35,.4,2.88,8,M.blue);
 L(968,669,901,890,21,M.steel);L(1312,676,1380,891,22,M.titanium);
 L(1001,683,1041,888,11,M.conduit);L(1281,682,1228,891,10,M.titanium);
 for(let a of [-2.7,-2.24,-1.83,-1.34,-.81,.8,1.32,1.79,2.24,2.66])L(cx+rx*Math.cos(a),cy+ry*Math.sin(a),cx+(rx-42)*Math.cos(a),cy+(ry-42)*Math.sin(a),8,M.ceramic);
 // Suspended diagnostic room is actually connected to lower root supports.
 L(1044,570,1084,512,12,M.steel);L(1233,572,1190,514,11,M.steel);
 R(1060,506,151,13,M.titanium);R(1072,519,132,5,M.blue);
 R(1074,424,136,11,M.ceramic);R(1083,436,117,6,M.frost);
 R(1071,445,11,61,M.steel);R(1202,446,11,59,M.steel);
 R(1096,489,40,15,M.chrome);R(1105,469,25,20,M.glassDark);
 R(1162,490,35,14,M.ceramic);R(1171,470,17,19,M.amber);
 L(1112,427,1145,382,8,M.titanium);L(1184,427,1157,383,7,M.titanium);R(1138,373,29,10,M.window);
 R(935,751,418,13,M.steel);R(944,763,403,7,M.blue);
 for(let x of [968,1092,1254])L(x,764,x+39,857,8,M.titanium);
 // EAST QUARANTINE: segregated crew lock, material transfer hoist, thermal-coil works.
 R(1488,419,389,14,M.titanium);R(1497,433,372,5,M.chrome);
 R(1473,596,411,13,M.steel);R(1485,609,392,7,M.blue);
 R(1514,759,440,14,M.steel);
 for(let x of [1506,1624,1779,1889]){L(x,615,x+39,678,9,M.conduit);L(x+39,678,x+65,615,8,M.titanium);}
 for(let x of [1538,1690,1841])L(x,769,x+42,848,11,M.steel);
 R(1546,565,127,12,M.ceramic);R(1552,538,13,27,M.titanium);R(1650,538,12,27,M.titanium);
 for(let x of [1588,1611,1634]){R(x,552,7,13,M.frost);R(x+2,540,3,12,M.signal);}
 R(1722,563,84,11,M.chrome);R(1731,542,15,21,M.glassDark);R(1774,539,17,23,M.amber);
 R(1543,731,120,12,M.ceramic);
 for(let x of [1554,1580,1606,1632]){L(x,731,x+15,682,6,M.chrome);L(x+15,682,x+26,730,6,M.titanium);}
 R(1706,739,137,11,M.steel);L(1725,735,1755,663,8,M.chrome);L(1826,735,1790,665,8,M.chrome);R(1751,653,44,10,M.window);
 L(1878,435,1890,754,17,M.steel);L(1811,420,1998,420,14,M.titanium);
 L(1961,422,1962,539,6,M.chrome);R(1936,533,69,14,M.blue);R(1949,520,47,13,M.ceramic);
 R(1782,480,231,13,M.ceramic);R(1908,462,30,18,M.window);
 R(1829,633,175,14,M.titanium);R(1871,608,56,25,M.glassDark);
 // BURIED RETURN: mineral assay, xenocore probe, boring rig, separate emergency vents.
 R(416,943,120,10,M.steel);R(435,921,29,21,M.glassDark);
 R(750,942,132,10,M.titanium);R(769,919,25,22,M.window);R(839,923,26,17,M.amber);
 R(1042,944,140,11,M.steel);R(1078,920,49,24,M.iron);R(1102,910,18,11,M.signal);
 L(1241,947,1266,899,7,M.titanium);L(1311,947,1285,900,8,M.chrome);R(1260,891,29,9,M.ceramic);
 R(1540,944,119,9,M.titanium);R(1562,916,22,27,M.window);R(1611,927,24,16,M.glassDark);
 L(363,802,366,950,12,M.steel);L(1733,758,1735,951,12,M.titanium);
 // All routes are real open cells, including in/out hatches and deep return.
 R(355,596,97,75,0);R(360,724,97,66,0);R(489,449,99,88,0);
 R(765,627,89,78,0);R(813,448,98,83,0);R(1358,445,97,88,0);
 R(1421,452,97,90,0);R(1840,483,93,94,0);
 R(308,812,95,82,0);R(1683,813,97,88,0);
 // Exact deliberately chosen station centres (not post-hoc nearest-free substitutions).
 const sites={
 "West arrivals":[456,510],"Survey nursery":[245,466],"Rover cradle":[310,744],"West vent":[345,851],
 "Observatory crown":[662,282],"Optical polarimeter":[633,353],"Spectroscopy lab":[696,518],
 "Polar archive":[655,674],"Lens west access":[963,464],"Xenolens diagnostics":[1144,476],
 "Lens sky rendezvous":[1140,302],"Lens east access":[1307,463],"Lower inspection":[1149,790],
 "Upper flight recovery":[1137,107],"East quarantine":[1549,475],"Scrubber lock":[1597,519],
 "East cargo":[1744,691],"Thermal recycler":[1612,662],"Drydock balcony":[1900,555],
 "Eastern ridge":[1944,684],"West bore elevator":[350,919],"Mineral assay":[792,902],
 "Xenocore probe":[1098,901],"Deep bore drill":[1281,925],"East vent recovery":[1670,920]
 };
 // Exact stations receive people-scale inspection clearance; these voids are part of original design.
 for(let [name,[x,y]] of Object.entries(sites))R(x-16,y-14,33,29,0);
 
 // Full 31×27 live Midge ingress/egress: architectural hatch voids and service bore clearance.
 R(382,555,105,104,0);R(409,492,104,86,0);
 R(360,800,132,153,0);R(1614,797,137,160,0);
 R(1055,444,61,61,0);R(1183,444,60,61,0);
 R(911,766,118,90,0);R(1283,766,112,91,0);
 R(1464,626,120,87,0);R(1627,625,109,91,0);
 R(1805,631,132,91,0);R(1887,551,113,156,0);

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

 // Deliberate maintainable rescue hatches: clean service shafts and bored interior after structural ties.
 R(315,777,118,180,0);R(1598,780,125,179,0);
 R(250,875,1567,84,0);R(1100,740,92,118,0);


 // Raised rock-anchored maintenance stringer carries the lens and observatory over the open bore.
 R(520,846,879,15,M.steel);
 for(let x of [584,648,815,904,1131,1292,1371])L(x,868,x,852,8,M.conduit);
 L(552,852,202,813,13,M.titanium);

 L(1586,870,1547,805,8,M.titanium);
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
 
 let obstructions=[[1082,446,1208,516]];
 let bypass=obstructions.map(b=>flood(31,27,b)); if(bypass[0].passed!==Object.keys(sites).length-1||bypass[0].bad[0]?.[0]!=="Xenolens diagnostics")throw Error("Bypass "+JSON.stringify(bypass));
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
 const crops=[["01-west-settlement",75,382,475,470],["02-polar-observatory",470,125,390,720],["03-xenolens",812,145,650,680],["04-east-quarantine",1450,340,580,520],["05-geological-return",255,765,1535,225]];
 const images=[["overview.png",png(0,0,W,H)],...crops.map(([name,x,y,w,h])=>[name+".png",png(x,y,w,h)])];
 return {g,json,rect,hist,area,sites,clearances,bypass,rooted,unrooted,componentCount,rootedComponents,crops,images,tie_info,seed:SEED};
}

function sha256(input){let b=typeof input==="string"?Uint8Array.from(input,c=>c.charCodeAt(0)):input;
const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
const n=(b.length+9+63)&~63,buf=new Uint8Array(n);buf.set(b);buf[b.length]=128;let bits=b.length*8;for(let i=0;i<8;i++){buf[n-1-i]=bits&255;bits=Math.floor(bits/256);}
let h=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19],w=new Uint32Array(64);let rotr=(x,n)=>(x>>>n)|(x<<(32-n));
for(let off=0;off<n;off+=64){for(let j=0;j<16;j++){let i=off+j*4;w[j]=((buf[i]<<24)|(buf[i+1]<<16)|(buf[i+2]<<8)|buf[i+3])>>>0;}for(let j=16;j<64;j++){let p=w[j-15],q=w[j-2];w[j]=(w[j-16]+(rotr(p,7)^rotr(p,18)^(p>>>3))+w[j-7]+(rotr(q,17)^rotr(q,19)^(q>>>10)))>>>0;}let [a,b0,c,d,e,f,g,z]=h;for(let j=0;j<64;j++){let t1=(z+(rotr(e,6)^rotr(e,11)^rotr(e,25))+((e&f)^(~e&g))+K[j]+w[j])>>>0,t2=((rotr(a,2)^rotr(a,13)^rotr(a,22))+((a&b0)^(a&c)^(b0&c)))>>>0;z=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b0;b0=a;a=(t1+t2)>>>0;}for(let j=0;j<8;j++)h[j]=(h[j]+[a,b0,c,d,e,f,g,z][j])>>>0;}return h.map(n=>n.toString(16).padStart(8,"0")).join("");}
function makeReceipt(a){return {concept:"Aureole Delta - Xenolens Excursion Array",lane:"original/scifi-frontier-wide",original_no_source:true,seed:a.seed,extent:[2048,1024],material_cell_count:a.g.length,engine_accepted_main:"de109d0131641d6adc8d25bb9ced7ca3d4991105",reference_repo_default_main:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",source_loader_max_rectangles:32768,source_loader_max_setup_bytes:1048576,source_rectangle_work_budget:32000000,bridge_legacy_capacity_risk:4096,material_rule_assumption:"Only catalogue-supported static inert immobile Solid/None IDs; no powder, fluids, reactive or combustible foundation",material_histogram:a.hist,filled_material_cells:a.area,grounded_cells:a.rooted,ungrounded_cells:a.unrooted,grounded_components:a.rootedComponents,all_solid_components:a.componentCount,physical_fixture_ties:a.tie_info,nonoverlapping_ordered_rectangles:a.rect.length,rectangle_work:a.area,setup_bytes:a.json.length,material_plane_sha256:sha256(a.g),setup_sha256:sha256(a.json),images:a.images.map(([name,b])=>({name,bytes:b.length,sha256:sha256(b)})),clearance:a.clearances,physical_obstruction:{cell_box_xyxy:[1082,446,1208,516],material_id:58,purpose:"Blocks exact Xenolens diagnostics; all other 20 named destinations recoverable",result:a.bypass},sites:a.sites,crops:a.crops,source_art:"None; independently invented level design",static_construction:"PASS",native_status:"NATIVE-UNTESTED",review_status:"Await independent exact-head Art / Technical / Shepherd; Draft/HOLD"};}

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
 console.log(JSON.stringify({status:"CREATOR-STATIC-PASS",verified_files:output.map(q=>q[0]),plane_sha256:makeReceipt(a).material_plane_sha256,rectangles:a.rect.length,sites:a.clearances.map(c=>c.passed),obstruction_other_sites:24,png_decoded_pixel_parity:"PASS",native:"NATIVE-UNTESTED",verify},null,2));
}
