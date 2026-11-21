'use strict';
// Original Switchglass Civic Transit 05 — Faultline Dual-Gate Customs.
// A split industrial settlement cut by a full-height geological shear wall with
// separate high transit and low emergency passages. Not a central-wheel/baffle map.
function buildWorld(){
 const W=2048,H=1024,N=W*H,g=new Uint8Array(N);
 const M={frame:49,iron:58,plate:62,rock:100,dark:101,amber:113,steel:117,ivory:122};
 const palette={0:[8,14,22],49:[70,90,110],58:[132,146,161],62:[179,188,202],100:[41,51,65],101:[23,34,49],113:[238,181,81],117:[105,132,154],122:[231,223,190]};
 const MODEL="c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96";
 const POLICY=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
 function rect(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);if(x<0||y<0||w<1||h<1||x+w>W||y+h>H)throw Error("BOUNDS "+[x,y,w,h,m]);if(m&&!palette[m])throw Error("MATERIAL "+m);for(let yy=y;yy<y+h;yy++)g.fill(m,yy*W+x,yy*W+x+w);}
 function line(ax,ay,bx,by,r,m){let dx=bx-ax,dy=by-ay,den=dx*dx+dy*dy||1;for(let y=Math.max(0,Math.floor(Math.min(ay,by)-r));y<Math.min(H,Math.ceil(Math.max(ay,by)+r+1));y++)for(let x=Math.max(0,Math.floor(Math.min(ax,bx)-r));x<Math.min(W,Math.ceil(Math.max(ax,bx)+r+1));x++){let t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/den)),xx=x-ax-t*dx,yy=y-ay-t*dy;if(xx*xx+yy*yy<=r*r)g[y*W+x]=m;}}
 function joined(p,r,m){for(let i=1;i<p.length;i++)line(p[i-1][0],p[i-1][1],p[i][0],p[i][1],r,m);}
 // Broad unequal west and east work districts and a deliberately deep vacant faultway.
 for(const [x,w,t]of [[0,288,791],[288,286,760],[574,165,854],[739,221,966],[1110,241,964],[1351,151,852],[1502,276,791],[1778,270,784]]){
  rect(x,t,w,H-t,M.rock);rect(x,t,w,8,M.plate);
  for(let y=t+60;y+6<H;y+=78)rect(x,y,w,5,M.dark);
 }
 // Sheared geological monolith physically joins top and bottom map boundaries.
 rect(959,0,151,H,M.rock);rect(947,54,12,227,M.dark);rect(1110,488,12,230,M.frame);
 for(let y=57;y+6<998;y+=82)rect(959,y,151,6,M.dark);
 rect(920,318,225,163,0);rect(920,720,227,155,0);
 rect(930,472,206,7,M.steel);rect(929,866,206,7,M.plate);
 for(const [x,y]of [[944,334],[1090,334],[944,735],[1090,735]])rect(x,y,10,14,M.amber);
 // Four entered understrata shops, no sealed ornamental cavities.
 for(const [x,y,w,h,shaft]of [[44,850,235,144,154],[330,848,222,148,451],[1509,838,244,157,1622],[1795,845,225,155,1900]]){
  rect(x,y,w,h,0);rect(shaft-55,700,110,y-685,0);
  rect(x+15,y+h-29,53,26,M.iron);rect(x+26,y+h-42,18,13,M.amber);
  rect(x+w-70,y+h-28,51,25,M.steel);rect(x+w-49,y+h-41,17,13,M.ivory);
 }
 // Main high tram line, independent cable girders and roof-rooted cantilever mounts.
 joined([[425,418],[599,401],[793,423],[924,410]],7,M.plate);
 joined([[1145,410],[1294,397],[1461,416],[1718,413]],7,M.plate);
 line(520,414,576,248,10,M.frame);line(576,248,841,307,5,M.steel);
 line(1391,408,1454,243,10,M.frame);line(1454,243,1700,320,5,M.steel);
 line(841,307,923,404,5,M.iron);line(1146,404,1207,313,5,M.iron);
 for(const [x,y]of [[480,417],[681,410],[832,422],[1269,399],[1533,420],[1639,418]]){
  line(x,y-12,x+12,y-68,3,M.iron);rect(x+5,y-81,15,8,M.amber);
 }
 // Load paths are actually rooted at different solid founding heights.
 for(const [x,deck,foot]of [[493,417,760],[661,406,854],[1317,400,852],[1570,419,791]]){
  line(x-18,deck+14,x-42,foot+12,9,M.frame);line(x+18,deck+12,x+38,foot+14,8,M.iron);
  line(x-43,foot-5,x+40,foot-5,6,M.steel);
 }
 // West transport settlement: passenger intake, tally office and west fault switch.
 rect(25,705,245,10,M.plate);for(const x of [38,256])rect(x,715,12,75,M.frame);
 line(52,703,115,640,8,M.steel);line(115,640,250,686,8,M.frame);
 rect(85,724,60,10,M.iron);rect(102,734,18,21,M.amber);
 rect(198,724,43,9,M.steel);rect(212,734,14,18,M.ivory);
 line(315,747,359,601,11,M.frame);line(359,601,497,593,9,M.steel);
 rect(378,606,76,12,M.plate);rect(404,618,17,19,M.amber);
 rect(606,679,187,12,M.plate);rect(618,691,11,157,M.frame);
 rect(769,691,12,155,M.iron);line(649,678,672,566,8,M.steel);
 rect(673,545,60,10,M.iron);rect(694,555,17,22,M.amber);
 // Lower bypass is a separate structural mode, not a copy of the elevated track.
 joined([[680,833],[850,853],[942,831]],8,M.steel);
 joined([[1148,829],[1270,851],[1438,832]],8,M.steel);
 for(const [x,deck,foot]of [[786,847,966],[1190,839,964]]){
  line(x-18,deck+11,x-34,foot+12,9,M.frame);
  line(x+20,deck+10,x+35,foot+13,8,M.iron);
  line(x-37,foot-5,x+36,foot-5,5,M.plate);
 }
 // Workfaces in two open deep-fault salvage bays.
 rect(769,921,153,11,M.steel);rect(787,932,9,34,M.frame);
 rect(871,932,47,11,M.iron);rect(888,943,13,15,M.amber);
 line(806,917,841,865,7,M.frame);rect(842,862,38,8,M.ivory);
 rect(1125,919,201,11,M.plate);rect(1147,930,10,34,M.frame);
 rect(1219,930,55,10,M.iron);rect(1236,941,15,17,M.amber);
 // Unfinished witnessed failure that remains open as a useful manual-edit socket.
 line(884,647,917,680,8,M.iron);line(950,704,958,716,7,M.iron);
 rect(911,676,16,11,M.amber);
 // Eastern civic customs, cargo checks and remote semaphore.
 rect(1507,686,258,11,M.plate);for(const x of [1520,1746])rect(x,697,11,88,M.frame);
 line(1544,685,1643,601,8,M.iron);line(1643,601,1743,670,8,M.frame);
 rect(1600,706,58,9,M.steel);rect(1616,715,15,20,M.amber);
 rect(1693,706,48,9,M.iron);rect(1707,715,17,21,M.ivory);
 rect(1798,677,250,11,M.plate);for(const x of [1810,2023])rect(x,688,11,95,M.frame);
 line(1813,758,1840,569,9,M.frame);line(1840,569,1984,604,8,M.steel);
 rect(1849,551,21,13,M.amber);rect(1961,622,43,9,M.ivory);
 // Five broad recovery apertures and an explicit high/low passage (no gate closing).
 for(const [x,down]of [[154,850],[451,848]])rect(x-56,691,112,down-678,0);
 for(const [x,down]of [[1622,838],[1900,845]])rect(x-56,609,112,down-596,0);
 rect(1256,216,142,739,0); // full-height entered lower salvage recovery chimney
 // Deep work equipment is rooted at shop base and survives the last relief cut.
 for(const [x,y]of [[72,962],[352,962],[1534,962],[1828,966]]){
  rect(x,y,44,10,M.iron);rect(x+12,y-11,16,11,M.amber);
 }

 const sites=[
  ["West arrival",100,591],["West ticket ward",205,626],
  ["West operator desk",415,550],["West upper signal",504,320],
  ["West cliff office",712,514],["West engineering workshop",494,918],
  ["West entrant recovery",154,816],["West nearfield service",116,906],
  ["West switchshaft",452,800],["West low yard",808,775],
  ["West high vestibule",922,352],["Upper severable gate",1034,370],
  ["East high vestibule",1206,367],["East signal relay",1470,331],
  ["East cliff operations",1256,538],["East west customs",1635,580],
  ["East customs signal",1700,586],["East departure ward",1964,638],
  ["East works underfloor",1868,913],["East recovery shaft",1900,814],
  ["East shaft one",1622,815],["East first workshop",1568,913],
  ["West low gate approach",824,771],["Low escape gate",1026,775],
  ["East low gate approach",1210,775],["West salvage",872,886],
  ["East salvage",1308,893],["Outbound finish",2015,646]
 ];
 const obs=[984,319,112,158];
 const crops=[["overview.png",0,0,W,H],
  ["01-arrival-customs-west.png",0,528,550,496],
  ["02-west-cantilever.png",384,206,564,628],
  ["03-dual-gate-fault.png",856,0,383,992],
  ["04-east-customs-ward.png",1240,449,536,575],
  ["05-eastern-signal.png",1777,431,271,593],
  ["06-underfault-bypass.png",705,715,695,309]];
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
 let start=sites.find(s=>s[0]==="West high vestibule"),end=sites.find(s=>s[0]==="East high vestibule");
 let before=flood(full["31x27"],start,end).distance,after=flood(closed,start,end).distance;
 const detour={from:start[0],to:end[0],hull:[31,27],baseline_steps:before,obstructed_steps:after,extra_steps:after-before,method:"Conservative full 31x27 Midge hull BFS between literal high gate approaches, forcing low cut-through after temporary physical upper closure"};
 const setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:MODEL,spawn:[sites[0][1],sites[0][2]],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits,response:"LA-SELECTIVE",liquid_policy:POLICY,normalize:false,rule_radius:2,source:[],material:2,brush:8,fire:false};
 return {W,H,N,g,M,palette,sites,obs,crops,edits,visits,detached,histogram,grounded:visits,clear,blocked,detour,setup};
}
module.exports={buildWorld};
