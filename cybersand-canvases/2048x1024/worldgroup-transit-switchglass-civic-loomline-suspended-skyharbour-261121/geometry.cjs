'use strict';
// Original Switchglass Civic Transit 06 — Loomline Suspended Sky-Harbour.
// A roof-rooted suspended tram exchange across two separated full-hull skylight gates.
// Lower repair service survives a blocked west hatch. No central wheel or alternating baffles.
function buildWorld(){
 const W=2048,H=1024,N=W*H,g=new Uint8Array(N);
 const M={frame:49,iron:58,plate:62,rock:100,dark:101,amber:113,steel:117,ivory:122};
 const palette={0:[8,14,22],49:[70,90,110],58:[132,146,161],62:[179,188,202],100:[41,51,65],101:[23,34,49],113:[238,181,81],117:[105,132,154],122:[231,223,190]};
 const MODEL="c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96";
 const POLICY=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
 function rect(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);if(x<0||y<0||w<1||h<1||x+w>W||y+h>H)throw Error("BOUNDS "+[x,y,w,h,m]);if(m&&!palette[m])throw Error("MATERIAL "+m);for(let yy=y;yy<y+h;yy++)g.fill(m,yy*W+x,yy*W+x+w);}
 function line(ax,ay,bx,by,r,m){let dx=bx-ax,dy=by-ay,den=dx*dx+dy*dy||1;for(let y=Math.max(0,Math.floor(Math.min(ay,by)-r));y<Math.min(H,Math.ceil(Math.max(ay,by)+r+1));y++)for(let x=Math.max(0,Math.floor(Math.min(ax,bx)-r));x<Math.min(W,Math.ceil(Math.max(ax,bx)+r+1));x++){let t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/den)),xx=x-ax-t*dx,yy=y-ay-t*dy;if(xx*xx+yy*yy<=r*r)g[y*W+x]=m;}}
 function joined(p,r,m){for(let i=1;i<p.length;i++)line(p[i-1][0],p[i-1][1],p[i][0],p[i][1],r,m);}

 // Switchglass 06: suspended freight/signal sky-harbour, NOT a horizontal civic boulevard,
 // geological fault, continuous hillside, island pier chain, or concave ground basin.
 // 4 load zones: western ticket sally, hanging dispatch loft, main asymmetric
 // chain-weave transfer, east dry cargo control and entered subterranean salvage.
 // Entire suspended steel assembly is mechanically anchored to the ceiling.
 rect(0,0,W,29,M.rock);
 for(const [x,w,d] of [[0,200,74],[200,270,46],[470,200,83],[670,290,36],[960,340,65],[1300,260,42],[1560,240,95],[1800,248,53]]){
  rect(x,29,w,d,M.rock);rect(x,29+d-6,w,6,M.dark);
 }
 // A continuous suspended tram diaphragm divides UPPER signaling sky from LOWER
 // freight sky. Two separated FULL-HULL clearance hatches create a physical
 // branch/rejoin puzzle rather than a decorative bridge.
 for(const [x,w]of [[0,510],[674,766],[1600,448]]){
  rect(x,504,w,33,M.frame);rect(x,504,w,7,M.plate);
  for(let xx=x+22;xx+35<x+w;xx+=82){
   rect(xx,522,29,7,M.iron);rect(xx+9,530,9,6,M.amber);
  }
 }
 // Roof-rooted hanger towers and tensile webs distribute load, not radial machinery.
 for(const [roof,deck,tilt]of [[150,440,-22],[356,492,34],[765,452,-24],[922,495,25],[1182,475,-35],[1380,492,20],[1693,468,-19],[1917,482,25]]){
  line(roof,81,roof+tilt,deck,7,M.steel);
  line(roof+tilt,deck,roof+tilt+36,504,8,M.iron);
 }
 for(const [a,b,c,d]of [[165,112,378,365],[378,365,765,145],[765,145,1004,407],[1030,380,1250,130],[1250,130,1703,359],[1710,359,1898,120]]){
  line(a,b,c,d,5,M.frame);
 }
 // Arrival / pedestrian cabin: open roof silhouette, real suspended access ledge.
 rect(73,384,342,13,M.plate);rect(90,397,12,102,M.iron);
 rect(401,397,12,102,M.iron);
 joined([[83,384],[143,328],[263,312],[395,384]],8,M.steel);
 rect(152,346,70,9,M.iron);rect(179,355,20,18,M.amber);
 rect(300,347,66,9,M.iron);rect(324,357,16,18,M.ivory);
 // Four-way hanging dispatch loft: asymmetrical catenary, deliberately *not* a rotor.
 rect(740,294,513,13,M.plate);
 for(const [x,d] of [[762,110],[861,86],[1034,124],[1224,93]]){
  line(x,112,x+28,294,9,M.frame);rect(x+14,273,35,9,M.steel);
 }
 for(let j=0;j<7;j++){
  const x=805+j*62;
  line(x,293,x+42,368+(j%3)*26,5,M.iron);
  rect(x+7,380+(j%3)*25,25,7,M.amber);
 }
 rect(915,219,156,11,M.steel);rect(957,230,40,11,M.iron);
 rect(973,241,14,18,M.ivory);
 // Operator loft above the main sorting beam; top-open and deliberately editable.
 rect(1101,185,130,11,M.plate);
 line(1106,185,1128,112,8,M.frame);line(1231,185,1192,111,8,M.frame);
 rect(1130,200,28,8,M.amber);
 // Eastern freight toll and counterbalance loom: non-radial, skewed.
 rect(1680,367,306,13,M.plate);
 joined([[1690,367],[1773,294],[1888,313],[1977,367]],8,M.iron);
 line(1734,372,1746,487,8,M.frame);
 line(1887,371,1861,489,8,M.frame);
 rect(1762,323,59,10,M.steel);rect(1783,333,18,19,M.amber);
 rect(1910,328,41,9,M.iron);rect(1920,337,13,16,M.ivory);
 // Intermediate bracing and mechanical route markers, never spanning hatch openings.
 for(const [x,y] of [[88,483],[244,490],[820,475],[1194,475],[1390,478],[1666,482],[1917,482]]){
  rect(x,y,15,9,M.amber);
 }
 // Multigrade low yard geology: a lower recovery substrate with NO symmetry.
 for(const [x,w,top]of [[0,310,856],[310,292,876],[602,220,895],[822,337,915],[1159,292,888],[1451,251,864],[1702,346,840]]){
  rect(x,top,w,H-top,M.rock);rect(x,top,w,7,M.plate);
  for(let y=top+61;y+7<H;y+=74)rect(x,y,w,6,M.dark);
 }
 // Under-canopy practical freight: lower support stacks and five physical work districts.
 rect(48,700,347,13,M.steel);
 line(67,710,111,856,9,M.frame);line(374,710,342,872,9,M.frame);
 joined([[56,700],[140,630],[302,660],[389,700]],8,M.iron);
 rect(172,716,69,9,M.steel);rect(189,725,24,22,M.amber);
 rect(312,722,49,9,M.iron);rect(325,731,14,18,M.ivory);
 rect(789,665,369,11,M.plate);
 line(819,676,791,897,9,M.frame);line(1135,676,1153,898,9,M.steel);
 joined([[811,663],[918,616],[1030,633],[1143,663]],7,M.iron);
 rect(938,683,74,9,M.steel);rect(960,692,16,19,M.amber);
 rect(1180,741,200,13,M.steel);
 line(1215,748,1204,891,9,M.frame);
 line(1359,750,1372,880,9,M.iron);
 rect(1285,763,40,9,M.plate);rect(1298,773,15,17,M.ivory);
 // Damaged elevated bypass / expansion socket: two grounded pieces do not join.
 line(1220,620,1295,575,9,M.steel);line(1347,568,1394,537,8,M.iron);
 rect(1296,568,20,9,M.amber);
 // East cargo interface with uneven floor-rooted trestles and emergency sliplane.
 rect(1626,687,388,13,M.plate);
 line(1667,697,1641,851,9,M.frame);
 line(1940,697,1964,844,9,M.frame);
 joined([[1630,687],[1703,613],[1874,645],[1995,686]],8,M.steel);
 rect(1724,708,75,10,M.iron);rect(1748,719,22,21,M.amber);
 rect(1900,715,68,9,M.steel);rect(1924,725,17,17,M.ivory);
 // The lower service settlements are actually entered via broad vertical relief
 // shafts, not sealed below their terrain. Four separately recognisable bays.
 for(const [x,y,w,h,sx]of [[29,915,262,87,158],[484,929,302,75,632],[973,938,334,66,1120],[1738,901,272,101,1863]]){
  rect(x,y,w,h,0);
  rect(sx-57,699,114,y-685,0);
  rect(x+20,y+h-25,51,19,M.iron);
  rect(x+34,y+h-39,18,13,M.amber);
  rect(x+w-77,y+h-25,48,19,M.steel);
  rect(x+w-61,y+h-38,16,13,M.ivory);
 }
 // Raised, unscripted attachment points / slalom signal on the low recovery lane.
 line(541,783,572,704,7,M.frame);rect(564,698,32,9,M.amber);
 line(1471,815,1519,723,9,M.frame);rect(1514,718,44,10,M.ivory);
 // Three broad and deliberate air-traffic relief cuts connect all upper districts.
 // Cables remain firmly rooted to both roof and beam, with a free manoeuvre
 // window designed into the tensile joint above the tram diaphragm.
 rect(0,421,W,68,0);
 // Two actually entered ground shops are reached through openings in low decks.
 rect(103,666,110,111,0);
 rect(1806,664,110,114,0);
 // Open west roof passenger canopy so it has a second physical ingress.
 rect(173,275,86,215,0);
 // Architectural access slots to hanging control rooms and entered low-level bays.
 rect(1048,115,113,327,0);
 rect(1700,210,100,251,0);
 rect(70,739,176,152,0);
 rect(1771,731,241,169,0);
 // Preserve BOTH canopy passages: no structural ornament may obstruct their 160px apertures.
 rect(510,481,164,75,0);
 rect(1440,481,160,75,0);
 // Full-length central diaphragm is rooted through a dedicated tensile kingpost;
 // the emergency passenger aperture remains physically independent of the west hatch.
 line(950,83,950,512,8,M.frame);
 rect(270,493,135,65,0);
 // Four shop fixtures are tied into their room floors after final shaft cuts.
 for(const [x,y] of [[51,979],[506,981],[997,982],[1759,981]]){
  rect(x,y,38,10,M.iron);rect(x+12,y-12,14,12,M.amber);
 }


 const sites=[
  ["West embarkation",110,301],["West ticket gantry",284,292],
  ["West windward signal",445,377],["Suspended transfer west",705,216],
  ["Suspended transfer centre",1093,165],["Top operator gallery",1125,265],
  ["Eastern weather gauge",1735,260],["Remote dispatch",1960,285],
  ["Upper west hatch approach",583,422],["West sky hatch",584,519],
  ["West hatch recovery",585,650],["Upper east hatch approach",1507,421],
  ["East sky hatch",1528,519],["East hatch recovery",1530,612],
  ["West underdeck passenger",290,598],["West lower signal",470,628],
  ["Central salvage arrival",833,584],["Central freight bypass",1069,577],
  ["Underdeck switch gear",1250,624],["Eastern recovery spur",1730,581],
  ["Eastern cargo despatch",1951,588],["Western service shaft",158,826],
  ["Western repair bay",167,948],["Inner repair shaft",632,820],
  ["Inner repair bay",669,962],["Central service shaft",1120,820],
  ["Central repair bay",1190,964],["Eastern service shaft",1863,817],
  ["Eastern repair bay",1870,953],["Outer arrival finish",2000,789]
 ];


 const obs=[498,466,187,140];
 const crops=[["overview.png",0,0,W,H],
  ["01-west-embarkation.png",0,214,500,610],
  ["02-hanging-dispatch-loft.png",685,90,620,450],
  ["03-west-sky-hatch.png",425,368,382,405],
  ["04-central-freight-underhang.png",775,560,690,464],
  ["05-eastern-toll-gantry.png",1600,230,448,590],
  ["06-entered-salvage-bays.png",0,795,2048,229]];
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
 let start=sites.find(s=>s[0]==="Upper west hatch approach"),end=sites.find(s=>s[0]==="West hatch recovery");
 let before=flood(full["31x27"],start,end).distance,after=flood(closed,start,end).distance;
 const detour={from:start[0],to:end[0],hull:[31,27],baseline_steps:before,obstructed_steps:after,extra_steps:after-before,method:"Conservative full 31x27 Midge hull BFS between literal high gate approaches, forcing the passenger relief descent after west hatch obstruction"};
 const setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:MODEL,spawn:[sites[0][1],sites[0][2]],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits,response:"LA-SELECTIVE",liquid_policy:POLICY,normalize:false,rule_radius:2,source:[],material:2,brush:8,fire:false};
 return {W,H,N,g,M,palette,sites,obs,crops,edits,visits,detached,histogram,grounded:visits,clear,blocked,detour,setup};
}
module.exports={buildWorld};
