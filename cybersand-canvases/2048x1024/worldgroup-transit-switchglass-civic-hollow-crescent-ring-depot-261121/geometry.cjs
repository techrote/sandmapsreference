'use strict';
// Switchglass Civic Transit 04 — Hollow Crescent Ring Depot. Original concave-loop mechanical transit grammar.
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

 // ORIGINAL Switchglass 04: hollow concave depot; paired bow-grade loop, no central rotor.
 const tiers=[[0,394,766],[394,402,864],[796,491,916],[1287,383,852],[1670,378,750]];
 for(const [x,w,top] of tiers){
  rect(x,top,w,H-top,M.rock);rect(x,top,w,10,M.plate);
  for(let y=top+70;y+6<=H;y+=88)rect(x,y,w,6,M.dark);
  rect(x+7,top+13,9,H-top-13,M.frame);rect(x+w-16,top+12,9,H-top-12,M.iron);
 }
 // Five genuinely entered repair chambers, each with direct 100px sky-to-room shaft.
 const chambers=[[92,854,250,130,226,766],[491,923,247,77,610,864],[883,959,260,59,1013,916],[1351,920,249,89,1472,852],[1729,841,245,158,1842,750]];
 for(const [x,y,w,h,shaft,cap] of chambers){
  rect(x,y,w,h,0);rect(shaft-50,cap-13,100,y-cap+47,0);
  rect(x+12,y+h-23,44,23,M.steel);rect(x+18,y+h-34,20,11,M.amber);
  rect(x+w-53,y+h-25,38,25,M.iron);rect(x+w-40,y+h-37,13,12,M.ivory);
 }
 // Unequal bowed outer and inner routes, connected at both ends: oversized depot loop.
 const outer=[[118,560],[349,498],[654,402],[990,355],[1280,399],[1610,472],[1924,562]];
 const inner=[[338,676],[577,722],[875,762],[1084,785],[1398,748],[1717,681]];
 for(let i=0;i<outer.length-1;i++){
  const a=outer[i],b=outer[i+1];line(a[0],a[1],b[0],b[1],8,M.steel);
  line(a[0],a[1]-12,b[0],b[1]-12,3,M.amber);
  for(let j=1;j<=3;j++){let t=j/4,x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t;line(x,y-12,x,y+10,3,M.frame);}
 }
 for(let i=0;i<inner.length-1;i++){let a=inner[i],b=inner[i+1];line(a[0],a[1],b[0],b[1],9,M.plate);line(a[0],a[1]+14,b[0],b[1]+14,3,M.steel);}
 line(118,560,254,583,9,M.plate);line(254,583,338,676,9,M.plate);
 line(1717,681,1838,601,9,M.plate);line(1838,601,1924,562,9,M.plate);
 // Five founded double-leg viaduct piers; asymmetric bracing teaches load paths.
 for(const [x,deck,ground] of [[175,542,766],[656,401,864],[1128,372,916],[1530,452,852],[1895,554,750]]){
  line(x-25,deck+16,x-42,ground+18,9,M.frame);line(x+25,deck+16,x+47,ground+18,9,M.iron);
  line(x-40,ground-7,x+47,ground-7,7,M.steel);line(x-27,deck+101,x+28,deck+169,5,M.frame);
 }
 for(const [x,track,foot] of [[520,710,864],[814,756,916],[1347,758,852],[1655,695,852]]){
  line(x-16,track+10,x-23,foot+13,9,M.frame);line(x+21,track+8,x+28,foot+10,8,M.iron);
  line(x-23,foot-4,x+28,foot-4,5,M.steel);
 }
 // WEST civic ticket platforms, roof truss and two distinct dispatch stalls.
 rect(36,664,273,10,M.plate);for(const x of [49,290])rect(x,675,12,91,M.frame);
 line(69,663,125,606,8,M.steel);line(125,606,297,647,8,M.frame);
 rect(103,687,51,11,M.steel);rect(117,698,13,21,M.amber);
 rect(223,691,50,8,M.iron);rect(239,699,13,19,M.ivory);
 // NORTHWEST nonradial haul ram with dual telescoping legs.
 rect(478,811,271,12,M.plate);for(const x of [494,720])rect(x,823,12,41,M.frame);
 line(533,811,559,597,12,M.iron);line(559,597,677,619,8,M.steel);
 line(677,619,719,810,10,M.frame);rect(559,610,58,11,M.amber);
 line(603,617,659,566,5,M.iron);rect(652,555,24,17,M.ivory);
 // SOUTH BASIN — undertrack settlement, one open, static three-span shunting gantry.
 rect(833,869,385,12,M.plate);for(const x of [847,1188])rect(x,881,12,35,M.frame);
 rect(875,838,65,10,M.steel);rect(894,849,18,19,M.amber);
 rect(1123,827,64,11,M.iron);rect(1141,839,14,22,M.ivory);
 line(943,866,960,701,10,M.frame);line(960,701,1074,675,8,M.steel);
 line(1074,675,1190,706,8,M.frame);line(1190,706,1202,869,9,M.iron);
 line(1006,681,1055,636,4,M.amber);line(1122,688,1169,646,4,M.ivory);
 rect(1042,700,46,15,M.iron);
 // EAST brake-signal borough; roof-rooted telegraph and tall off-axis relays.
 rect(1379,795,240,10,M.plate);for(const x of [1395,1592])rect(x,805,12,47,M.frame);
 line(1517,790,1553,478,12,M.frame);line(1553,478,1662,495,8,M.steel);
 line(1662,495,1619,615,7,M.iron);rect(1546,452,22,16,M.ivory);
 rect(1582,501,76,8,M.amber);rect(1569,575,48,9,M.plate);
 rect(1419,770,38,21,M.iron);rect(1431,757,12,13,M.amber);
 // FAR EAST unequal freight-departure canopy and repair expansion seam.
 rect(1720,668,298,12,M.plate);for(const x of [1734,1996])rect(x,680,12,70,M.frame);
 line(1776,667,1826,596,9,M.steel);line(1826,596,1993,642,8,M.frame);
 rect(1856,684,72,10,M.iron);rect(1879,696,19,22,M.amber);rect(1969,688,22,15,M.ivory);
 line(726,715,764,750,7,M.iron);line(775,762,795,770,7,M.iron);
 rect(1221,852,54,10,M.plate);
 // Preserve central ring void and five incomplete chassis bays as editable corpus space.
 // Route sites: exact conservative full hull centres, no nearest-point snapping.

 const sites=[
  ["West arrival",111,515],["West ticket precinct",202,622],
  ["West underworks",138,908],["Western ascent seam",320,520],
  ["Outer bow crest",988,284],["West ram control",575,548],
  ["Ram workshop",545,963],["Incline escape shaft",610,850],
  ["West inner grade",474,637],["Crescent low crossing",768,649],
  ["Basin dispatch",884,800],["Basin lower repair",935,983],
  ["Basin shaft recovery",1012,913],["Central high switch",1055,510],
  ["Physical severable midspan",1131,591],["Outer eastern crest",1362,359],
  ["Eastern signal master",1580,390],["East freight approach",1448,714],
  ["East brake works",1392,964],["East shaft recovery",1472,874],
  ["Return east grade",1744,580],["Eastern passenger freight",1920,619],
  ["East undertrack works",1777,893],["Eastern return shaft",1842,778],
  ["Outbound finish",1943,707]
 ];
 const obs=[1084,535,98,112];
 const crops=[
  ["overview.png",0,0,W,H],
  ["01-ticket-ram-west.png",0,456,520,568],
  ["02-elevated-outer-bow.png",430,274,687,500],
  ["03-basin-shunting-gantry.png",815,587,445,437],
  ["04-signal-brake-east.png",1284,371,403,653],
  ["05-departure-return-east.png",1662,489,386,535],
  ["06-nested-repair-chambers.png",398,788,910,236]
 ];
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
