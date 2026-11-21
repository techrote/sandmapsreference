'use strict';
// Original Shearline Split-Lane Trials 02 — Knuckle-Bend Rally / Pit Chicane District.
// A grounded horizontal braided racing course with two independent full-hull alpha/beta weave gaps.
// Unequal fast/safe lanes, grounded equipment, entered pit workfaces and blocked-splice recovery.
function buildWorld(){
 const W=2048,H=1024,N=W*H,g=new Uint8Array(N);
 const M={frame:49,iron:58,plate:62,rock:100,dark:101,amber:113,steel:117,ivory:122};
 const palette={0:[8,14,22],49:[70,90,110],58:[132,146,161],62:[179,188,202],100:[41,51,65],101:[23,34,49],113:[238,181,81],117:[105,132,154],122:[231,223,190]};
 const MODEL="c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96";
 const POLICY=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
 function rect(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);if(x<0||y<0||w<1||h<1||x+w>W||y+h>H)throw Error("BOUNDS "+[x,y,w,h,m]);if(m&&!palette[m])throw Error("MATERIAL "+m);for(let yy=y;yy<y+h;yy++)g.fill(m,yy*W+x,yy*W+x+w);}
 function line(ax,ay,bx,by,r,m){let dx=bx-ax,dy=by-ay,den=dx*dx+dy*dy||1;for(let y=Math.max(0,Math.floor(Math.min(ay,by)-r));y<Math.min(H,Math.ceil(Math.max(ay,by)+r+1));y++)for(let x=Math.max(0,Math.floor(Math.min(ax,bx)-r));x<Math.min(W,Math.ceil(Math.max(ax,bx)+r+1));x++){let t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/den)),xx=x-ax-t*dx,yy=y-ay-t*dy;if(xx*xx+yy*yy<=r*r)g[y*W+x]=m;}}
 function joined(p,r,m){for(let i=1;i<p.length;i++)line(p[i-1][0],p[i-1][1],p[i][0],p[i][1],r,m);}



 // SHEARLINE 02: KNUCKLE-BEND RALLY / PIT CHICANE DISTRICT.
 // Opposed wide S-turn monoliths with upper risky crest shortcuts, a lower
 // sheltered slalom, and two route split/rejoin sequences, NOT straight counterflow.
 rect(0,0,W,84,M.rock);
 for(const [x,w,h] of [[0,235,37],[235,266,16],[501,265,49],[766,280,23],[1046,317,51],[1363,307,17],[1670,378,45]]){
  rect(x,84,w,h,M.rock);rect(x,84+h-6,w,6,M.dark);
 }
 for(const [x,w,y] of [[0,250,881],[250,267,898],[517,235,911],[752,261,894],[1013,288,903],[1301,249,886],[1550,263,904],[1813,235,867]]){
  rect(x,y,w,H-y,M.rock);rect(x,y,w,8,M.plate);
  for(let yy=y+56;yy<H-6;yy+=62)rect(x,yy,w,6,M.dark);
 }
 // West timing launch with founded asymmetric cable support.
 joined([[58,407],[181,373],[314,393],[408,444]],10,M.plate);
 line(117,404,136,882,9,M.frame);line(328,405,350,898,11,M.steel);
 joined([[105,232],[230,221],[351,264]],9,M.steel);
 line(137,100,139,228,10,M.frame);line(331,100,347,261,9,M.frame);
 rect(190,265,89,14,M.iron);rect(223,279,34,28,M.amber);
 // A: first heavy sloping, abruptly returning Knuckle, founded on two legs.
 const a=[[349,548],[485,513],[591,355],[731,347],[872,485]];
 joined(a,53,M.frame);joined(a,38,M.iron);joined(a,30,M.steel);
 line(396,552,370,882,14,M.steel);line(840,477,867,894,15,M.steel);
 line(373,687,339,877,7,M.frame);line(858,699,897,888,9,M.frame);
 joined([[505,426],[569,312],[658,301],[746,314]],9,M.plate);
 rect(576,261,76,13,M.amber);rect(598,274,32,20,M.ivory);
 joined([[406,709],[528,755],[663,691],[804,735],[910,778]],9,M.plate);
 line(525,749,521,890,8,M.frame);line(789,738,804,901,8,M.frame);
 rect(584,738,75,12,M.steel);rect(608,750,22,20,M.amber);
 // Wide interval at centre provides visible reset before the reverse bend.
 joined([[902,505],[974,442],[1058,473]],11,M.iron);
 // mid-span roof-to-island closed-wall link omitted for actual safe bypass
 rect(925,360,124,13,M.plate);rect(966,374,24,20,M.amber);
 joined([[919,773],[995,729],[1070,753]],8,M.steel);
 line(999,731,1021,893,8,M.frame);
 // B: asymmetric high reverse-camber bend, physically larger and lower.
 const b=[[1049,480],[1168,352],[1323,394],[1433,578],[1592,524]];
 joined(b,59,M.rock);joined(b,45,M.steel);joined(b,31,M.frame);
 line(1101,480,1102,903,15,M.iron);line(1558,542,1574,904,15,M.iron);
 joined([[1132,311],[1218,269],[1328,304]],9,M.plate);
 rect(1254,251,68,13,M.amber);rect(1274,264,22,20,M.ivory);
 joined([[1130,737],[1252,784],[1364,728],[1509,763],[1639,741]],10,M.plate);
 line(1252,780,1248,886,9,M.frame);line(1511,764,1498,902,9,M.frame);
 rect(1360,756,84,12,M.steel);rect(1387,768,28,18,M.ivory);
 // East braking harp, interrupted upper spur and continuous rescue apron.
 joined([[1603,422],[1700,375],[1784,410]],10,M.steel);
 joined([[1856,442],[1935,416],[1990,461]],10,M.iron);
 rect(1785,414,43,11,M.amber);rect(1857,410,42,10,M.ivory);
 joined([[1730,301],[1848,268],[1971,326]],13,M.plate);
 for(const [x,dx] of [[1748,-29],[1848,35],[1950,-16]])line(x,309,x+dx,867,10,M.frame);
 rect(1756,348,58,10,M.steel);rect(1780,359,24,19,M.amber);
 joined([[1653,740],[1759,701],[1844,727],[1951,761]],11,M.plate);
 line(1670,743,1654,907,8,M.steel);line(1921,757,1944,869,8,M.steel);
 // Four genuinely entered service districts, floor-rooted cave workshops
 // with clearance-height direct access shafts. Empty sockets are intentional.
 for(const [x,y,w,h,sx] of [[98,932,265,80,232],[589,930,247,82,717],[922,939,205,75,1004],[1735,917,281,96,1840]]){
  rect(x,y,w,h,0);rect(sx-66,762,132,y-743,0);
  rect(x+17,y+h-27,76,15,M.iron);rect(x+50,y+h-47,22,21,M.amber);
  rect(x+w-102,y+h-24,80,13,M.steel);rect(x+w-67,y+h-44,27,20,M.ivory);
 }
 for(const [x,y] of [[174,976],[666,974],[957,974],[1796,966]]){
  rect(x,y,43,10,M.frame);rect(x+12,y-20,14,20,M.amber);
 }
 // Actual diverge/rejoin pass-throughs. Bounded excavations are not
 // script-only teleportation: every 31x27 hull centre has clear material.
 // The upper risky A crest blocks independently; low bypass remains viable.
 rect(438,164,97,706,0);rect(948,165,99,705,0);rect(1604,165,93,702,0);
 rect(812,577,105,208,0);rect(1052,573,100,195,0);
 rect(168,626,125,315,0);rect(1781,510,143,435,0);
 // Two true pit entrances pierce continuous industrial overhangs.
 rect(180,355,110,75,0);rect(1800,245,99,255,0);
 const sites=[
 ["West rally start",110,326],["West launch rail",281,340],
 ["A fast approach",418,326],["A risky crest",683,231],
 ["A leading turn",535,625],["A south shelter",648,626],
 ["A lower bypass",707,800],["A clear rejoin",936,425],
 ["Mid timing post",1013,308],["Mid lower muster",981,659],
 ["B fast approach",1068,293],["B risky lip",1354,277],
 ["B lower shelter",1352,688],["B turnback",1483,440],
 ["B clear rejoin",1620,337],["East brake entry",1679,310],
 ["Damaged spur",1820,470],["Outer catch",2014,520],
 ["East rescue return",2008,800],["West lower passage",441,785],
 ["Center lower passage",994,800],["East lower passage",1638,808],
 ["West pit shaft",232,838],["West pit bench",263,974],
 ["A tuning shaft",717,855],["A tuning bench",768,973],
 ["Mid check shaft",1004,850],["Mid check bench",1053,979],
 ["East rescue shaft",1840,829],["East rescue bench",1904,964]
 ];
 const obs=[637,118,135,319];
 const crops=[["overview.png",0,0,W,H],
 ["01-rally-launch-and-timing.png",0,140,490,690],
 ["02-knuckle-a-risky-sheltered.png",385,172,555,675],
 ["03-mid-span-transfer-and-pit.png",855,233,445,755],
 ["04-reverse-camber-knuckle-b.png",1102,187,570,665],
 ["05-east-brake-damaged-spur.png",1640,183,408,650],
 ["06-entered-service-bays.png",0,785,2048,239]];
 // All final solids must be 4-connected to the authoritative world's boundaries.
 const attached=new Uint8Array(N),q=new Int32Array(N);let hd=0,tl=0;
 function put(z){if(g[z]&&!attached[z]){attached[z]=1;q[tl++]=z;}}
 for(let x=0;x<W;x++){put(x);put((H-1)*W+x);}
 for(let y=0;y<H;y++){put(y*W);put(y*W+W-1);}
 while(hd<tl){let z=q[hd++],x=z%W;if(x)put(z-1);if(x<W-1)put(z+1);if(z>=W)put(z-W);if(z+W<N)put(z+W);}
 let detached=0;for(let i=0;i<N;i++)if(g[i]&&!attached[i]){g[i]=0;detached++;}
 const histogram={};for(let v of g)histogram[v]=(histogram[v]||0)+1;
 const edits=[],active=new Map();let visits=0;
 for(let y=0;y<H;y++){let next=new Map();for(let x=0;x<W;){let m=g[y*W+x],s=x;while(x<W&&g[y*W+x]===m)x++;if(!m)continue;let key=s+":"+(x-s)+":"+m,e=active.get(key);if(e&&e[1]+e[3]===y)e[3]++;else{e=[s,y,x-s,1,m];edits.push(e);}next.set(key,e);visits+=x-s;}active.clear();for(const [k,v]of next)active.set(k,v);}
 function free(block,ww,hh){
  const stride=W+1,P=new Int32Array((W+1)*(H+1));
  for(let y=0;y<H;y++){let row=0;for(let x=0;x<W;x++){let solid=g[y*W+x]!==0;if(block&&x>=block[0]&&x<block[0]+block[2]&&y>=block[1]&&y<block[1]+block[3])solid=true;row+=solid?1:0;P[(y+1)*stride+x+1]=P[y*stride+x+1]+row;}}
  let rx=(ww-1)/2,ry=(hh-1)/2,open=new Uint8Array(N);
  for(let y=ry;y<H-ry;y++)for(let x=rx;x<W-rx;x++){let l=x-rx,r=x+rx+1,t=y-ry,b=y+ry+1;if(P[b*stride+r]-P[t*stride+r]-P[b*stride+l]+P[t*stride+l]===0)open[y*W+x]=1;}return open;
 }
 function flood(open,from,to){
  const start=from[2]*W+from[1],goal=to?to[2]*W+to[1]:-1;
  if(!open[start])return {seen:new Uint8Array(N),distance:null,visited:0};
  const seen=new Uint8Array(N),q=new Int32Array(N),dist=to?new Int32Array(N):null;
  let hd=0,tl=0;q[tl++]=start;seen[start]=1;if(dist){dist.fill(-1);dist[start]=0;}
  while(hd<tl){let z=q[hd++],x=z%W;if(z===goal)break;for(let v of [x>0?z-1:-1,x<W-1?z+1:-1,z>=W?z-W:-1,z+W<N?z+W:-1])if(v>=0&&open[v]&&!seen[v]){seen[v]=1;q[tl++]=v;if(dist)dist[v]=dist[z]+1;}}
  return {seen,distance:dist?dist[goal]:null,visited:tl};
 }
 function reach(open,wh){const r=flood(open,sites[0]);let missing=sites.filter(s=>!r.seen[s[2]*W+s[1]]).map(s=>s[0]);return {hull:wh,reachable:sites.length-missing.length,total:sites.length,missing,visited_centres:r.visited};}
 const clear={},full={};for(let wh of [[19,15],[23,19],[31,27]]){full[wh.join("x")]=free(null,...wh);clear[wh.join("x")]=reach(full[wh.join("x")],wh);}
 const closed=free(obs,31,27),blocked=reach(closed,[31,27]);
 let start=sites.find(s=>s[0]==="A fast approach"),end=sites.find(s=>s[0]==="A clear rejoin");
 let before=flood(full["31x27"],start,end).distance,after=flood(closed,start,end).distance;
 const detour={from:start[0],to:end[0],hull:[31,27],baseline_steps:before,obstructed_steps:after,extra_steps:after-before,method:"Conservative full 31x27 hull BFS measures alternate sheltered passage after the upper A crest is physically blocked"};
 const setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:MODEL,spawn:[sites[0][1],sites[0][2]],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits,response:"LA-SELECTIVE",liquid_policy:POLICY,normalize:false,rule_radius:2,source:[],material:2,brush:8,fire:false};
 return {W,H,N,g,M,palette,sites,obs,crops,edits,visits,detached,histogram,grounded:visits,clear,blocked,detour,setup};
}
module.exports={buildWorld};
