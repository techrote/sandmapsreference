'use strict';
// Switchglass Civic Transit 03 — Estuary Signal Chain: separated civic piers and freight cableway.
// Entirely original 2048x1024 orthographic material-cell side elevation.
// No source geometry, pixel placement or track route reused from any donor.
function buildWorld(){
 const W=2048,H=1024,N=W*H,g=new Uint8Array(N);
 const M={frame:49,iron:58,plate:62,rock:100,dark:101,amber:113,steel:117,ivory:122};
 const palette={0:[8,14,22],49:[70,90,110],58:[132,146,161],62:[179,188,202],100:[41,51,65],101:[23,34,49],113:[238,181,81],117:[105,132,154],122:[231,223,190]};
 const MODEL="c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96";
 const POLICY=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
 function rect(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);if(x<0||y<0||w<1||h<1||x+w>W||y+h>H)throw Error("BOUNDS "+[x,y,w,h,m]);if(m&&!palette[m])throw Error("MATERIAL "+m);for(let yy=y;yy<y+h;yy++)g.fill(m,yy*W+x,yy*W+x+w);}
 function line(ax,ay,bx,by,r,m){let dx=bx-ax,dy=by-ay,den=dx*dx+dy*dy||1;for(let y=Math.max(0,Math.floor(Math.min(ay,by)-r));y<Math.min(H,Math.ceil(Math.max(ay,by)+r+1));y++)for(let x=Math.max(0,Math.floor(Math.min(ax,bx)-r));x<Math.min(W,Math.ceil(Math.max(ax,bx)+r+1));x++){let t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/den)),xx=x-ax-t*dx,yy=y-ay-t*dy;if(xx*xx+yy*yy<=r*r)g[y*W+x]=m;}}
 // Five unequal and entirely floor-rooted pier masses; navigable empty estuary voids separate them.
 // Piers do not form a repeating terrain staircase; no solids are suspended without load paths.
 const piers=[
  {x:0,w:343,top:772,name:"West civic berth"},
  {x:579,w:251,top:668,name:"Haul-battery pier"},
  {x:1001,w:299,top:735,name:"Cargo transfer mole"},
  {x:1476,w:258,top:635,name:"Brake signal islet"},
  {x:1886,w:162,top:781,name:"Outer rescue outpost"}
 ];
 for(let p of piers){
  // Boundary-grounded basalt body, small stratigraphy and conspicuous steel upper ledge.
  rect(p.x,p.top,p.w,H-p.top,M.rock);
  rect(p.x,p.top,p.w,13,M.plate);
  for(let y=p.top+54;y<H;y+=103)rect(p.x,y,p.w,8,M.dark);
  rect(p.x+Math.min(18,p.w-18),p.top+15,13,H-p.top-15,M.frame);
  rect(p.x+p.w-21,p.top+15,12,H-p.top-15,M.iron);
 }
 // Four entered and deliberately incomplete under-pier service districts.
 // Each room is excavated out of its rock pier and has a >80px direct sky-entry throat.
 const rooms=[
  {x:87,y:867,w:190,h:113,shaft:181,cap:772,role:0},
  {x:602,y:819,w:203,h:139,shaft:700,cap:668,role:1},
  {x:1045,y:851,w:205,h:131,shaft:1166,cap:735,role:2},
  {x:1503,y:755,w:202,h:194,shaft:1582,cap:635,role:3}
 ];
 for(const c of rooms){
  rect(c.x,c.y,c.w,c.h,0);
  rect(c.shaft-45,c.cap-11,90,c.y-c.cap+75,0);
  // Grounded repair furnishings: no central-room blockage or cosmetic sealed cavity.
  rect(c.x+13,c.y+c.h-28,44,26,M.steel);
  rect(c.x+20,c.y+c.h-40,22,12,M.amber);
  rect(c.x+c.w-56,c.y+c.h-32,36,30,M.iron);
  rect(c.x+c.w-45,c.y+c.h-45,14,13,M.ivory);
 }
 // Open-topped passenger/operation decks: four districts with different silhouette and scale.
 // Western platform: twin short arcade roofs and a sloping tram-receipt gantry.
 rect(41,634,263,11,M.plate);
 for(const x of [44,279])rect(x,645,12,127,M.frame);
 rect(59,672,68,8,M.steel);rect(64,681,12,27,M.iron);
 rect(186,682,74,9,M.iron);rect(213,691,18,24,M.amber);
 line(75,634,138,572,9,M.frame);line(138,572,289,619,8,M.steel);
 line(137,573,281,607,4,M.amber);
 rect(132,558,16,17,M.ivory);rect(88,622,61,10,M.plate);
 // Battery pier: open compression gallows and exposed counterweighted haul gantry.
 rect(609,626,190,12,M.plate);
 for(const x of [615,780])rect(x,638,12,30,M.frame);
 line(630,631,666,456,11,M.frame);
 line(666,456,765,487,8,M.steel);
 line(765,487,784,629,9,M.frame);
 line(665,459,699,512,4,M.amber);
 line(706,503,750,486,6,M.iron);
 rect(635,584,33,33,M.iron);rect(644,573,15,13,M.ivory);
 rect(749,583,32,32,M.iron);rect(758,575,12,11,M.amber);
 // Cargo mole: two uneven loading cranes and a low supported weighing deck.
 rect(1030,690,229,12,M.plate);
 rect(1058,701,13,34,M.frame);rect(1236,702,13,33,M.frame);
 line(1074,691,1074,529,10,M.frame);
 line(1074,529,1147,524,7,M.steel);
 line(1147,524,1170,583,5,M.iron);
 rect(1155,582,32,12,M.amber);
 line(1242,687,1270,594,9,M.frame);
 line(1270,594,1307,571,6,M.steel);
 rect(1198,663,28,25,M.iron);
 rect(1210,654,10,10,M.ivory);
 // Brake signal islet: remote twin-mast switching semaphore, no central wheel or rotor.
 rect(1497,598,215,11,M.plate);
 rect(1512,609,13,26,M.frame);rect(1687,609,13,26,M.frame);
 line(1552,598,1574,367,11,M.frame);
 line(1574,367,1648,416,7,M.steel);
 line(1632,412,1680,575,7,M.iron);
 rect(1566,349,23,17,M.plate);
 rect(1588,381,65,8,M.amber);
 rect(1589,405,42,8,M.ivory);
 line(1600,397,1660,453,4,M.amber);
 rect(1653,565,38,29,M.iron);rect(1665,555,12,11,M.ivory);
 // Outer rescue outpost intentionally tiny, isolated and mechanically recognisable.
 rect(1896,716,142,12,M.plate);
 rect(1902,728,13,53,M.frame);rect(2018,728,12,53,M.frame);
 line(1992,716,1999,540,8,M.frame);
 line(1999,540,2040,578,6,M.steel);
 rect(1996,527,19,12,M.amber);
 rect(1932,730,44,19,M.iron);rect(1941,717,12,13,M.ivory);
 // World landmark: independent five-span asymmetric dual catenary freight aerial.
 // Each segment is mechanically attached at its endpoints to real founded pierwork.
 const links=[
  [304,633,606,627],[785,628,1030,690],[1259,690,1497,598],[1699,598,1900,716]
 ];
 for(let k=0;k<links.length;k++){
  let [ax,ay,bx,by]=links[k];
  line(ax,ay,bx,by,6,M.steel);
  line(ax,ay-26,bx,by-18,3,M.amber);
  // Sparse underhung static truss to teach connection grammar.
  for(let j=1;j<=4;j++){let t=j/5,x=ax+(bx-ax)*t,y=ay+(by-ay)*t;line(x,y-17,x,y,3,M.frame);}
 }
 // Fragmented lower handoff bridge, visibly damaged and left as an editable reconstruction seam.
 line(321,828,415,833,9,M.plate);
 line(499,839,581,828,9,M.plate);
 line(381,837,409,865,7,M.iron);
 line(512,844,543,879,7,M.frame);
 // Founders for the broken bridge are rooted in the adjacent pier bodies only at its ends.
 line(321,833,338,923,12,M.frame);
 line(580,828,596,900,11,M.frame);
 // Long-void sightlines and alternate high aerial entry are intentional, not missing finish.
 // Route sites: exact conservative full hull centres, no nearest-point snapping.
 const sites=[
  ["West embarkation",119,535],["West tram ticket",204,519],["West repair gallery",124,900],
  ["West expansion pier",313,691],["Open strait approach",398,525],
  ["Cable exchange arrival",612,550],["Battery pier operator",720,555],
  ["Haul power inspection",642,873],["Battery shaft recovery",701,750],
  ["Upper aerial handoff",912,530],["Cargo mole entry",1017,619],
  ["Cargo crane dispatch",1118,631],["Freight scale",1196,611],
  ["Mole maintenance cell",1093,904],["Lower cargo rescue",1166,796],
  ["Central severable cable span",1390,558],["Signal islet approach",1485,523],
  ["Upper semaphore gallery",1695,346],["Signal relay operator",1732,513],
  ["Brake signal service",1529,788],["Remote signal shaft",1582,694],
  ["Outer bridge approach",1812,595],["Rescue watchtower",1946,631],
  ["Outer exit",1924,671]
 ];
 const obs=[1343,507,96,124];
 const crops=[
  ["overview.png",0,0,W,H],
  ["01-west-passenger-arrival.png",0,490,410,520],
  ["02-power-haul-island.png",556,377,342,647],
  ["03-cargo-crane-and-plant.png",987,500,375,524],
  ["04-remote-brake-semaphore.png",1441,312,360,712],
  ["05-rescue-tower-and-estuary.png",1712,465,336,559],
  ["06-cable-strut-and-broken-spur.png",286,572,708,380]
 ];
 // Open civic pier entries and high/low catenary transfer breaks; all are material cells.
 rect(159,551,78,115,0);rect(683,441,76,222,0);
 rect(416,564,86,108,0); // under-strait egress through freight wire
 rect(1122,675,93,47,0);rect(1541,579,91,49,0);
 // A split in the remote signal arch makes an honest open-to-sky full-envelope emergency entry.
 rect(1595,373,35,75,0);
 // Erase only truly unattached preliminary decorative solids; retain all grounded engineering.
 const attached=new Uint8Array(N),q=new Int32Array(N);let tail=0,head=0;
 function push(z){if(g[z]&&!attached[z]){attached[z]=1;q[tail++]=z;}}
 for(let x=0;x<W;x++){push(x);push((H-1)*W+x);}for(let y=0;y<H;y++){push(y*W);push(y*W+W-1);}
 while(head<tail){let z=q[head++],x=z%W;if(x)push(z-1);if(x<W-1)push(z+1);if(z>=W)push(z-W);if(z+W<N)push(z+W);}
 let detached=0;for(let i=0;i<N;i++)if(g[i]&&!attached[i]){g[i]=0;detached++;}
 const histogram={};for(let i=0;i<N;i++)histogram[g[i]]=(histogram[g[i]]||0)+1;
 // Lossless, disjoint row-run/vertical-coalesced rectangles.
 const edits=[],active=new Map();let visits=0;
 for(let y=0;y<H;y++){let next=new Map();for(let x=0;x<W;){let m=g[y*W+x],s=x;while(x<W&&g[y*W+x]===m)x++;if(!m)continue;let key=s+":"+(x-s)+":"+m,entry=active.get(key);if(entry&&entry[1]+entry[3]===y)entry[3]++;else{entry=[s,y,x-s,1,m];edits.push(entry);}next.set(key,entry);visits+=x-s;}active.clear();for(let [k,v]of next)active.set(k,v);}
 function reach(wh,block){
  const [ww,hh]=wh,rx=(ww-1)/2,ry=(hh-1)/2,stride=W+1,P=new Int32Array((W+1)*(H+1));
  for(let y=0;y<H;y++){let row=0;for(let x=0;x<W;x++){let solid=g[y*W+x]!==0;if(block&&x>=block[0]&&x<block[0]+block[2]&&y>=block[1]&&y<block[1]+block[3])solid=true;row+=solid?1:0;P[(y+1)*stride+x+1]=P[y*stride+x+1]+row;}}
  let open=new Uint8Array(N);for(let y=ry;y<H-ry;y++)for(let x=rx;x<W-rx;x++){let l=x-rx,r=x+rx+1,t=y-ry,b=y+ry+1;if(P[b*stride+r]-P[t*stride+r]-P[b*stride+l]+P[t*stride+l]===0)open[y*W+x]=1;}
  let spawn=sites[0][2]*W+sites[0][1];if(!open[spawn])throw Error("BLOCKED SPAWN "+wh);
  let seen=new Uint8Array(N),queue=new Int32Array(N),hd=0,tl=0;queue[tl++]=spawn;seen[spawn]=1;
  while(hd<tl){let z=queue[hd++],x=z%W;for(let v of [x>0?z-1:-1,x<W-1?z+1:-1,z>=W?z-W:-1,z+W<N?z+W:-1])if(v>=0&&open[v]&&!seen[v]){seen[v]=1;queue[tl++]=v;}}
  let missing=sites.filter(s=>!seen[s[2]*W+s[1]]).map(s=>s[0]);return {hull:wh,reachable:sites.length-missing.length,total:sites.length,missing,visited_centres:tl};
 }
 const clear={};for(let s of [[19,15],[23,19],[31,27]])clear[s.join("x")]=reach(s,null);
 const blocked=reach([31,27],obs);
 const setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:MODEL,spawn:[sites[0][1],sites[0][2]],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits,world_policy:POLICY};
 return {W,H,N,g,M,palette,sites,obs,crops,edits,visits,detached,histogram,grounded:visits,clear,blocked,setup};
}
module.exports={buildWorld};
