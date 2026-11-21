'use strict';
// Switchglass Civic Transit 02: Cutline Incline / Terraced Hillside Transfer.
// New terrain: seven-step hillside, graded tram incline, differentiated passenger towns and cut-and-cover recovery.
// Exact 2048x1024 orthographic CyberSand indexed-material side elevation.
function buildWorld(){
 const W=2048,H=1024,N=W*H,g=new Uint8Array(N);
 const M={iron:58,plate:62,frame:49,rock:100,dark:101,amber:113,steel:117,ivory:122};
 const palette={0:[8,14,22],49:[70,90,110],58:[132,146,161],62:[179,188,202],100:[41,51,65],101:[23,34,49],113:[238,181,81],117:[105,132,154],122:[231,223,190]};
 const MODEL="c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96";
 const POLICY=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
 function rect(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);if(x<0||y<0||w<1||h<1||x+w>W||y+h>H)throw Error("BOUNDS "+[x,y,w,h,m]);if(m&&!palette[m])throw Error("MATERIAL "+m);for(let yy=y;yy<y+h;yy++)g.fill(m,yy*W+x,yy*W+x+w);}
 function line(ax,ay,bx,by,r,m){let dx=bx-ax,dy=by-ay,den=dx*dx+dy*dy||1;for(let y=Math.max(0,Math.floor(Math.min(ay,by)-r));y<Math.min(H,Math.ceil(Math.max(ay,by)+r+1));y++)for(let x=Math.max(0,Math.floor(Math.min(ax,bx)-r));x<Math.min(W,Math.ceil(Math.max(ax,bx)+r+1));x++){let t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/den)),xx=x-ax-t*dx,yy=y-ay-t*dy;if(xx*xx+yy*yy<=r*r)g[y*W+x]=m;}}

 // The Cutline Incline: asymmetrical topographic seven-step hillside, not a flat four-canopy borough.
 // True side elevation, with ground measured at each world X in absolute material-cell space.
 const terraces=[[0,292,866],[292,571,801],[571,827,712],[827,1116,625],[1116,1421,552],[1421,1711,464],[1711,2048,394]];
 for(const [xl,xr,top] of terraces){
  for(let y=top;y<H;y++)for(let x=xl;x<xr;x++)g[y*W+x]=(y-top<11)?M.plate:((y%117<9)?M.dark:M.rock);
  rect(xl,top,xr-xl,9,M.plate);
 }
 // Distinct cliff-face datum markers are FOUNDATION-bound, not hovering decoration.
 for(let [xl,xr,top] of terraces.slice(1)){
   rect(xl,top,18,Math.min(175,H-top),M.frame);
   rect(xl+18,top+12,58,8,M.iron);
   rect(xl+25,top+22,10,18,M.amber);
 }
 // Cut-and-cover undergrade network: a stepped undertrack emergency line,
 // opened from actual rock mass, with overlapping vertical transfer shafts.
 for(const [x,y,w,h] of [
  [378,874,315,77],[636,786,342,78],[914,704,342,78],
  [1193,622,346,78],[1473,548,326,78],
  [617,806,95,139],[914,721,96,134],[1196,637,98,125],[1471,563,101,116]
 ])rect(x,y,w,h,0);
 // Five true hillside entries, carved from surface through excavated lower corridor.
 for(const [x,y,h] of [[528,747,194],[787,647,202],[1084,557,211],[1373,469,230],[1642,382,224]])
   rect(x-48,y,96,h,0);
 // Functional cut-and-cover repair chambers with grade-joined (not purely decorative) service routes.
 const chambers=[
 [415,887,177,54],[705,791,175,63],[988,707,176,65],[1257,625,169,67],[1555,551,173,66]
 ];
 for(const [x,y,w,h] of chambers){
   // Chambers connect to each shared main emergency corridor; only small floor-tied equipment.
   rect(x,y,w,h,0);
   rect(x+18,y+h-16,49,12,M.steel);
   rect(x+25,y+h-36,21,20,M.iron);
   rect(x+w-67,y+h-20,37,15,M.frame);
   rect(x+w-57,y+h-35,12,15,M.amber);
 }
 // Surface passenger/freight districts: staggered roofs, unequal silhouette and tangible piers.
 // All roof loads run down into the rock; a true entered cabin below every roof.
 const precincts=[
 {x:80,w:285,roof:660,base:866,role:0},
 {x:629,w:300,roof:493,base:712,role:1},
 {x:1006,w:293,roof:401,base:552,role:2},
 {x:1456,w:256,roof:299,base:464,role:3},
 {x:1782,w:229,roof:218,base:394,role:4}
 ];
 for(const p of precincts){
   rect(p.x,p.roof,p.w,15,M.plate);
   rect(p.x,p.roof+15,16,p.base-p.roof-15,M.frame);
   rect(p.x+p.w-16,p.roof+15,16,p.base-p.roof-15,M.frame);
   // Physically plausible entrance mouths, with conservative full-hull clearance.
   rect(p.x,p.base-124,17,91,0);
   rect(p.x+p.w-16,p.base-124,17,91,0);
   // Reflected glazing is restrained and hangs from real roof structure.
   for(let i=0;i<3;i++){
     let xx=p.x+33+i*Math.floor((p.w-76)/3);
     rect(xx,p.roof+26,30,12,M.iron);
     rect(xx+8,p.roof+29,14,7,(i+p.role)%2?M.ivory:M.amber);
   }
   // Distinct service furniture on the founded floor, no filling usable route centers.
   for(let i=0;i<2;i++){
     let xx=p.x+52+i*(p.w-116);
     rect(xx,p.base-37,34,31,i%2?M.iron:M.steel);
     rect(xx+9,p.base-49,15,12,i%2?M.amber:M.ivory);
   }
 }
 // Primary landmark: *diagonal* two-wire tram incline with real rock-founded outrigger bents.
 // Interrupted grade gates (large Midge-size apertures) offer high/low route decisions.
 const grade=(x)=>790-(x-225)*0.309;
 for(const [xa,xb] of [[227,525],[610,984],[1096,1362],[1484,1703]]){
   line(xa,grade(xa),xb,grade(xb),8,M.steel);
   line(xa,grade(xa)-14,xb,grade(xb)-14,3,M.amber);
 }
 for(const x of [268,466,676,878,1139,1327,1550,1656]){
   const y=Math.round(grade(x)),rock=terraces.find(z=>x>=z[0]&&x<z[1])[2];
   if(rock>y+8){
     line(x,y+8,x+9,rock+7,5,M.frame);
     line(x+9,rock-7,x-16,y+17,3,M.iron);
   }
 }
 // Passenger lift and inclined hauler marker: separate from the anchor's radial brake wheel.
 line(804,664,955,490,8,M.frame);
 line(817,662,968,488,3,M.ivory);
 rect(806,660,49,19,M.plate);
 rect(942,485,48,19,M.plate);
 rect(938,467,12,18,M.amber);
 // Broad concourse platforms have side-facing signs and material-defined operator functions.
 rect(151,842,148,8,M.steel);rect(179,821,34,21,M.frame);
 rect(663,690,192,9,M.iron);rect(728,671,21,18,M.amber);
 rect(1036,532,165,8,M.steel);rect(1092,511,31,21,M.iron);
 rect(1496,440,139,9,M.iron);rect(1549,423,18,17,M.ivory);
 rect(1822,373,142,8,M.steel);rect(1901,354,17,19,M.amber);
 // Mechanical wayfinding: grade-enumerated orange/ivory semaphore fingers.
 for(const [x,y,k] of [[145,660,0],[696,493,1],[1040,401,2],[1499,299,3],[1813,218,4]]){
   rect(x,y-33,9,33,M.frame);rect(x+9,y-30,36,7,k%2?M.ivory:M.amber);
 }
 // A physically failed transfer spur with an explicit, unconnected future editing socket.
 line(1331,426,1430,381,7,M.plate);
 rect(1410,375,27,11,M.amber);
 rect(1398,378,28,19,0); // broken diagonal end, not a completed bridge
 // Long grounded buttress and cantilever step-links connect the freight/pedestrian terraces.
 for(const [x,y,w] of [[387,780,108],[908,609,88],[1291,533,99],[1695,439,80]]){
   rect(x,y,w,9,M.plate);
   rect(x+5,y+9,13,23,M.frame);
   rect(x+w-19,y+9,13,21,M.frame);
 }

 // Founded bridge-load ribs reconnect every excavated hillside cap to the deep
 // boundary-grounded rock. These deliberately divide some lower service pockets;
 // recovery can climb through the large neighboring shafts to the next grade.
 for(const [x,top] of [[404,866],[603,712],[864,625],[1023,625],[1264,552],[1541,464],[1817,394]]){
   rect(x,top,21,H-top,M.frame);
   rect(x-9,top,39,12,M.plate);
 }
 // Recut formal east / west access and underwork shafts *after* furnishing to preserve exact interiors.
 for(const p of precincts){
   rect(p.x,p.base-126,19,99,0);
   rect(p.x+p.w-18,p.base-126,19,99,0);
 }
 // The actual mid-hill public lift is an open-to-sky rescue throat, not
 // an invisible teleport through a sealed station roof / diagonal track.
 rect(753,466,77,399,0);
 for(const [x,y,h] of [[528,747,194],[787,647,202],[1084,557,211],[1373,469,230],[1642,382,224]])rect(x-42,y,84,h,0);
 // Lower emergency inlets are open to each main undertrack corridor; this is physical excavation.
 // The grade-gap and skyline guarantee both surface and emergency branch/rejoin alternatives.
 const sites=[
 ["West arrival apron",62,755],["Low passenger hall",194,746],
 ["West freight workface",282,707],["West platform lip",322,705],
 ["First incline pass",435,685],["Low recovery shaft",528,829],
 ["Freight return machinery",482,899],
 ["Mid transfer landing",686,560],["Terraced passenger hall",716,566],
 ["Incline-hauler observation",920,455],["Mid cutline shaft",787,752],
 ["Mid service switchbox",800,813],
 ["Central fare exchange",1056,480],["Severable graded switch",1189,466],
 ["Third terrace transfer",1350,493],["Central lower recovery",1084,739],
 ["Cable machinery room",1085,730],
 ["Upper incline approach",1450,357],["Signal hill settlement",1508,345],
 ["High emergency shaft",1373,589],["Switchgear service room",1340,656],
 ["Upper freight arrival",1755,315],["Crest platform hall",1872,310],
 ["Outpost exit",1983,310],["Crest recovery shaft",1642,520],
 ["Upper repair alcove",1630,581]
 ];
 const obs=[1170,461,85,94];
 const crops=[
 ["overview.png",0,0,W,H],
 ["01-low-passenger-freight-arrival.png",40,625,535,365],
 ["02-incline-transfer-and-hauler.png",584,436,467,417],
 ["03-middle-passenger-cutline.png",961,362,446,452],
 ["04-upper-signal-town-and-damaged-switch.png",1285,259,491,477],
 ["05-crest-freight-outpost.png",1699,181,349,467],
 ["06-stepped-undertrack-recovery.png",422,699,1163,325]
 ];
 const attached=new Uint8Array(N),q=new Int32Array(N);let tail=0,head=0;
 function push(z){if(g[z]&&!attached[z]){attached[z]=1;q[tail++]=z;}}
 for(let x=0;x<W;x++){push(x);push((H-1)*W+x);}for(let y=0;y<H;y++){push(y*W);push(y*W+W-1);}
 while(head<tail){let z=q[head++],x=z%W;if(x)push(z-1);if(x<W-1)push(z+1);if(z>=W)push(z-W);if(z+W<N)push(z+W);}
 let detached=0;for(let i=0;i<N;i++)if(g[i]&&!attached[i]){g[i]=0;detached++;}
 const histogram={};for(let i=0;i<N;i++)histogram[g[i]]=(histogram[g[i]]||0)+1;
 const edits=[],active=new Map();let visits=0;
 for(let y=0;y<H;y++){let next=new Map();for(let x=0;x<W;){let m=g[y*W+x],s=x;while(x<W&&g[y*W+x]===m)x++;if(!m)continue;let key=s+":"+(x-s)+":"+m,entry=active.get(key);if(entry&&entry[1]+entry[3]===y)entry[3]++;else{entry=[s,y,x-s,1,m];edits.push(entry);}next.set(key,entry);visits+=x-s;}active.clear();for(let [k,v]of next)active.set(k,v);}
 function reach(wh,block){const [ww,hh]=wh,rx=(ww-1)/2,ry=(hh-1)/2,stride=W+1,P=new Int32Array((W+1)*(H+1));
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
