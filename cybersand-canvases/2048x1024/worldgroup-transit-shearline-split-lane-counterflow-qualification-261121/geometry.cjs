'use strict';
// Original Shearline Split-Lane Trials 01 — Counterflow Qualification Circuit.
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


 // SHEARLINE SPLIT-LANE TRIALS 01 — COUNTERFLOW QUALIFICATION CIRCUIT
 // Orthographic race-course in air-filled, material-cell XY. Two unequal
 // longitudinal flight bands split by a grounded traction divider, with
 // TWO discrete interchange gaps and an emergency perimeter return.
 // Fixed geometry. Long clear sightlines and real 31x27 passages take priority.
 rect(0,0,W,40,M.rock);
 for(const [x,w,h] of [[0,260,43],[260,300,22],[560,250,55],[810,300,24],[1110,310,48],[1420,320,29],[1740,308,58]]){
  rect(x,40,w,h,M.rock);
  rect(x,40+h-5,w,5,M.dark);
 }
 // Unequal, contoured terrain supports the whole physical track grammar.
 for(const [x,w,y]of [[0,250,868],[250,260,892],[510,284,916],[794,293,902],[1087,280,914],[1367,270,887],[1637,411,865]]){
  rect(x,y,w,H-y,M.rock);rect(x,y,w,7,M.plate);
  for(let yy=y+61;yy<H-5;yy+=73)rect(x,yy,w,5,M.dark);
 }
 // Race separator: continuous high-speed upper band versus sheltered lower
 // counterflow. NOT a gate pair or single giant aperture. Two broad transfer
 // exchanges interrupt the grounded slab at x=540..710 and x=1340..1510.
 for(const [x,w]of [[235,305],[710,630],[1510,345]]){
  rect(x,503,w,40,M.frame);
  rect(x,503,w,7,M.plate);
  rect(x,536,w,7,M.steel);
 }
 // Strong floor-rooted structural load paths: separated transom segments
 // are connected to geological underworks by explicitly grounded towers.
 for(const [top,bot,k]of [[340,870,-28],[890,900,34],[1240,910,-42],[1655,874,28]]){
  // High traction load path is physically carried down to a founded
  // service pier, but the broad low lane has an intentional 155px
  // Midge-rated crossing port through the column itself.
  line(top,529,top+k,608,11,M.steel);
  line(top+24,551,top+k+24,608,5,M.iron);
  line(top+k,804,top+k,bot,11,M.steel);
  line(top+k+24,804,top+k+24,bot,5,M.iron);
  rect(top-27,548,65,9,M.plate);
 }
 // Lateral bracing carries different load shapes across the upper/lower
 // divide; deliberately sparse, allowing a wide horizontal lower sliplane.
 for(const [ax,bx,dy]of [[310,420,110],[775,870,117],[1145,1250,122],[1550,1690,125]]){
  line(ax,550,bx,550+dy,7,M.iron);
  line(bx,550+dy,bx+44,830,7,M.frame);
 }
 // WEST LAUNCH: asymmetrical acceleration gantry and operator timing roof.
 joined([[75,413],[141,354],[260,335],[332,408]],9,M.iron);
 rect(105,414,229,10,M.plate);
 line(138,406,151,850,7,M.frame);
 line(322,407,347,884,7,M.steel);
 rect(191,325,118,9,M.steel);
 rect(224,333,29,24,M.amber);
 rect(279,338,13,18,M.ivory);
 // Roof signal walk has an open flight corridor below and above.
 rect(78,206,274,13,M.plate);
 line(98,82,112,206,8,M.frame);line(329,64,318,206,8,M.frame);
 for(let x=119;x<332;x+=52){rect(x,218,28,7,M.iron);rect(x+8,227,9,14,M.amber);}
 // ALPHA SPLICE: a physically broad vertical cross-traffic decision, with
 // off-axis deflector blades and multiple recognizable working fixtures.
 joined([[390,452],[460,473],[524,452]],7,M.steel);
 line(465,465,496,495,7,M.iron);
 rect(506,467,26,8,M.amber);
 joined([[715,551],[756,579],[814,563]],8,M.plate);
 rect(735,594,58,8,M.iron);
 rect(754,604,16,19,M.ivory);
 // First weave gap is open 170px horizontally: no bridge / no false floor.
 // At-rest calibration lamps live on the adjoining rooted slab, NOT inside gate.
 for(let x=280;x<528;x+=57){rect(x,483,21,9,M.amber);}
 for(let x=727;x<1317;x+=89){rect(x,483,24,8,M.ivory);}
 // CENTRAL COUNTERFLOW: two distinct control lines; upper sightline broad
 // and unbroken; lower guarded by distributed service trestles and signals.
 rect(801,273,460,12,M.plate);
 line(826,66,856,272,8,M.frame);
 line(1171,85,1186,272,8,M.steel);
 joined([[851,275],[937,236],[1031,252],[1169,275]],7,M.iron);
 rect(937,296,71,11,M.steel);rect(958,307,22,17,M.amber);
 rect(1124,295,76,10,M.iron);rect(1145,305,22,18,M.ivory);
 // Instrumented lower transit station: entered control room, connected to bedrock.
 rect(871,785,399,15,M.plate);
 line(908,795,922,907,9,M.frame);
 line(1214,796,1206,911,9,M.frame);
 joined([[875,784],[936,738],[1099,752],[1263,784]],7,M.iron);
 rect(940,812,88,10,M.steel);rect(965,822,26,18,M.amber);
 rect(1112,809,90,9,M.steel);rect(1140,819,20,17,M.ivory);
 for(let x=940;x<1240;x+=73){rect(x,767,19,8,M.amber);}
 // BETA EXCHANGE: second genuine opening; gates are spatially independent,
 // unlike the former Switchglass fault's single big aperture.
 line(1301,488,1341,456,7,M.iron);
 rect(1292,470,43,9,M.amber);
 line(1546,565,1597,593,8,M.steel);
 rect(1556,605,67,8,M.iron);
 rect(1575,614,20,19,M.ivory);
 // EAST BRAKE CATCH: not a central wheel, but a three-legged airbreak harp
 // rooted in the bedrock and visually skewed as a race braking approach.
 rect(1741,336,231,12,M.plate);
 joined([[1758,335],[1805,272],[1920,292],[1970,335]],8,M.iron);
 for(const [x,xx,top]of [[1768,1754,370],[1829,1843,380],[1911,1894,371]]){
  line(x,348,xx,top+95,7,M.frame);
  line(xx,top+95,xx+13,857,9,M.steel);
 }
 rect(1816,378,48,10,M.iron);rect(1833,388,17,18,M.amber);
 rect(1926,393,39,8,M.steel);rect(1938,401,13,15,M.ivory);
 // A deliberately BROKEN high spur and viable low rescue landing.
 // No claimed scripted failure or moving gate.
 line(1648,422,1716,394,9,M.steel);
 line(1786,399,1824,380,8,M.iron);
 rect(1702,388,18,8,M.amber);
 rect(1791,678,215,13,M.plate);
 line(1820,687,1800,862,9,M.frame);
 line(1987,690,1968,865,9,M.steel);
 rect(1886,696,48,8,M.iron);rect(1902,704,15,17,M.ivory);
 // West recovery lower guide does NOT seal or dead-end the safe line.
 rect(64,769,351,13,M.steel);
 line(97,779,124,870,8,M.frame);
 line(388,783,376,884,9,M.frame);
 joined([[75,768],[135,723],[282,730],[398,768]],7,M.iron);
 rect(169,794,70,8,M.plate);rect(190,802,20,19,M.amber);
 // Three DIFFERENT, materially entered service rooms, not sealed decorative
 // cutouts. Wide shafts approach from open lower route.
 for(const [x,y,w,h,sx]of [[157,923,250,89,278],[889,932,305,79,1035],[1688,906,292,107,1807]]){
  rect(x,y,w,h,0);
  rect(sx-64,710,128,y-695,0);
  rect(x+20,y+h-27,64,18,M.iron);
  rect(x+44,y+h-45,18,17,M.amber);
  rect(x+w-89,y+h-27,61,17,M.steel);
  rect(x+w-62,y+h-42,17,15,M.ivory);
 }
 // Additional distinct populated working stations and functional markers.
 for(const [x,y]of [[265,969],[966,978],[1772,966]]){
  rect(x,y,36,10,M.frame);rect(x+13,y-18,11,18,M.amber);
 }

 // R2 material-cell P1 repair: directional portals actually rooted in divider.
 // Both high approach and low rejoin brackets occupy solid-backed sides of
 // two 159px weave exchanges: open central Midge corridor is preserved.
 for(const [x,y] of [[509,445],[1312,451]]){
  line(x+15,y+56,x+15,505,8,M.steel);
  line(x-28,y+8,x+18,y-10,8,M.iron);
  line(x-26,y+31,x+18,y+7,7,M.iron);
  rect(x-25,y+40,55,9,M.amber);
  rect(x+8,y+19,18,23,M.ivory);
 }
 for(const [x,y] of [[724,542],[1524,542]]){
  line(x+15,y-4,x+15,y+63,9,M.steel);
  line(x+4,y+36,x+63,y+54,8,M.iron);
  line(x+10,y+58,x+62,y+73,7,M.iron);
  rect(x+2,y+19,42,11,M.ivory);
  rect(x+22,y+31,19,15,M.amber);
 }
 joined([[468,482],[499,475],[534,489]],6,M.plate);
 joined([[1275,480],[1309,478],[1339,489]],6,M.plate);
 joined([[715,575],[733,584],[780,598]],6,M.plate);
 joined([[1514,577],[1540,586],[1590,600]],6,M.plate);

 // Final access slots clear ornamental bracing only at two weave exchanges.
 rect(545,475,159,105,0);
 rect(1345,475,159,105,0);
 // A wide, genuinely continuous 145-cell safe counterflow passage reclaims
 // the lower service line from transverse trusses. Overhead trusses retain
 // their mass above; subterranean footing retains material below. Deliberate
 // unobstructed 31x27 Midge transit is more valuable than pseudo supports.
 rect(0,615,W,145,0);
for(const x of [330,1100,1700]) line(x,82,x,505,8,M.frame);
 // Separator sections are genuinely rooted through their own ceiling-to-deck load paths.
 // External side recovery survives blocked alpha splice as a physical choice.


 const sites=[
  ["West timing launch",113,324],["West upper signal",254,277],
  ["Alpha fast approach",492,401],["Alpha weave gate",624,518],
  ["Alpha safe exit",742,651],["Upper overtake shelf",795,390],
  ["Central racing line",1026,392],["Upper relay gauge",1057,365],
  ["Central lower return",1061,651],["Counterflow lower relay",1018,729],
  ["Beta fast approach",1326,408],["Beta weave gate",1427,519],
  ["Beta sheltered approach",1558,650],["East fast brake",1673,320],
  ["Outer catch",1980,462],["East lower rescue",1940,754],
  ["Underpass middle",1242,663],["West lower safe",433,670],
  ["Western recovery",142,656],["Damaged spur reveal",1722,435],
  ["West pit shaft",278,832],["West pit workface",322,972],
  ["Central pit shaft",1035,835],["Central pit workface",1091,968],
  ["East rescue shaft",1807,806],["East rescue room",1860,948],
  ["Finish lower",2011,786]
 ];
 const obs=[750,335,123,123];
 const crops=[["overview.png",0,0,W,H],
  ["01-launch-impulse-and-timing.png",0,165,510,590],
  ["02-alpha-grade-splice.png",375,348,490,435],
  ["03-counterflow-metering.png",790,235,545,650],
  ["04-beta-passing-exchange.png",1248,348,482,435],
  ["05-brake-harp-and-damaged-spur.png",1640,240,408,620],
  ["06-entered-pit-services.png",0,789,2048,235]];

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
 let start=sites.find(s=>s[0]==="Alpha fast approach"),end=sites.find(s=>s[0]==="Central racing line");
 let before=flood(full["31x27"],start,end).distance,after=flood(closed,start,end).distance;
 const detour={from:start[0],to:end[0],hull:[31,27],baseline_steps:before,obstructed_steps:after,extra_steps:after-before,method:"Conservative full 31x27 Midge hull BFS between literal high gate approaches, forcing a 31x27 high-line passing detour around the covered upper overtake checkpoint"};
 const setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:MODEL,spawn:[sites[0][1],sites[0][2]],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits,response:"LA-SELECTIVE",liquid_policy:POLICY,normalize:false,rule_radius:2,source:[],material:2,brush:8,fire:false};
 return {W,H,N,g,M,palette,sites,obs,crops,edits,visits,detached,histogram,grounded:visits,clear,blocked,detour,setup};
}
module.exports={buildWorld};
