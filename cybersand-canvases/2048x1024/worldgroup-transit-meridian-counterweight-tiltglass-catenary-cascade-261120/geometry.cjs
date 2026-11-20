'use strict';
// MERIDIAN COUNTERWEIGHT CORRIDOR — SIBLING 04, TILTGLASS CATENARY CASCADE.
// ORIGINAL geometry. An asymmetric open-air five-grade elevator/glide cascade;
// no central wheel, mirrored gorge, repeating switchyard or twin parallel tunnels.
function buildWorld(){
 const W=2048,H=1024,N=W*H,G=new Uint8Array(N);
 const M={rock:100,dark:101,iron:58,plate:62,silver:117,signal:113,ivory:122,frame:49};
 const palette={0:[9,14,23],49:[68,90,116],58:[127,145,166],62:[176,188,206],100:[42,51,66],101:[22,32,48],113:[233,183,89],117:[96,126,156],122:[230,224,199]};
 const model='c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96';
 const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
 let invalid=0;
 function rect(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);if(x<0||y<0||w<1||h<1||x+w>W||y+h>H){invalid++;throw Error('bounds '+[x,y,w,h,m]);}for(let yy=y;yy<y+h;yy++)G.fill(m,yy*W+x,yy*W+x+w)}
 function line(ax,ay,bx,by,r,m){
  let dx=bx-ax,dy=by-ay,L=dx*dx+dy*dy||1,x0=Math.max(0,Math.floor(Math.min(ax,bx)-r)),x1=Math.min(W,Math.ceil(Math.max(ax,bx)+r+1)),y0=Math.max(0,Math.floor(Math.min(ay,by)-r)),y1=Math.min(H,Math.ceil(Math.max(ay,by)+r+1));
  for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){let t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/L)),u=x-ax-t*dx,v=y-ay-t*dy;if(u*u+v*v<=r*r)G[y*W+x]=m}
 }
 // Low, irregular industrial floodplain instead of a buried dual-carriageway.
 for(let x=0;x<W;x++){let top=871+Math.round(15*Math.sin(x/123)+8*Math.sin(x/47));for(let y=top;y<H;y++)G[y*W+x]=(y-top<10)?M.iron:((y%91<5)?M.dark:M.rock)}
 rect(0,549,36,475,M.rock);rect(2016,609,32,415,M.rock);
 // Wide lower ground rescue route, with short protective rail islands, never a
 // continuous two-band excavation. The lower route has long open sightlines.
 line(85,841,1970,841,7,M.iron);
 for(let x=100;x<1910;x+=94){rect(x,844,19,11,M.silver);rect(x+36,844,7,7,M.signal)}
 // Discontinuous founded catwalks; levels are deliberately unequal and grades
 // shift in only one direction from west intake to tall centre-left transfer.
 const segments=[
  [82,600,408,600], [408,600,548,463],
  [548,463,895,463], [895,463,1007,342],
  [1007,342,1271,342], [1271,342,1433,490],
  [1433,490,1753,490], [1753,490,1935,612]
 ];
 for(let [ax,ay,bx,by]of segments){line(ax,ay+11,bx,by+11,11,M.frame);line(ax,ay,bx,by,5,M.plate)}
 // Make the high machine levels strongly supported. This is a long asymmetrical
 // load-path sequence, NOT mirrored on either side of a central gorge.
 function pier(x,y,width,lean){rect(x-width/2,y,width,870-y,M.frame);rect(x-width/2-18,858,width+36,19,M.iron);line(x,y+20,x+lean*83,850,7,M.iron);line(x,y+95,x-lean*64,y+185,6,M.silver)}
 pier(154,605,26,1);pier(340,605,22,-1);pier(574,467,29,-1);pier(823,465,31,1);
 pier(1062,345,33,1);pier(1248,349,25,-1);pier(1527,495,26,1);pier(1710,496,29,-1);pier(1909,610,25,1);
 // Deliberately irregular A-to-Z stepping: 4 stepped traction slipplates and
 // short landing tongues below the main lane, not parallel full-width lanes.
 for(let [x,y,w]of [[185,680,192],[635,572,173],[1089,451,144],[1483,604,175]]){
  rect(x,y,w,12,M.frame);rect(x+12,y-4,w-24,7,M.silver);
  rect(x+22,y+12,13,24,M.iron);rect(x+w-37,y+12,13,24,M.iron);
 }
 // Off-axis 420px mechanical tall hoist: founded side-by-side rack guides,
 // counterstroke needles and diagonal compression outriggers.
 rect(692,271,15,569,M.frame);rect(774,324,14,516,M.frame);
 for(let y=315;y<760;y+=55){line(709,y,768,y+26,6,M.plate);line(768,y+26,709,y+54,5,M.iron)}
 line(702,289,611,475,9,M.frame);line(781,341,838,461,9,M.iron);
 rect(662,265,74,14,M.iron);rect(754,316,58,15,M.plate);
 rect(683,431,103,18,M.silver);rect(692,457,88,10,M.signal);
 // Catenary power-transfer cable starts high west, dips through off-centre
 // hoist, then runs east to an uneven remote jib. Crossbows are source solids.
 const cable=[[215,339,444,253],[444,253,700,276],[785,336,1040,234],[1040,234,1344,252],[1344,252,1600,202]];
 for(let [a,b,c,d]of cable)line(a,b,c,d,3,M.signal);
 for(let [a,b,c,d]of [[410,596,444,253],[702,277,702,470],[785,336,823,460],[1040,234,1064,346],[1344,252,1465,488],[1600,202,1596,486]])line(a,b,c,d,5,M.silver);
 // Long, offset freight/crane transfer jib at right. No central circular rotor.
 rect(1577,174,23,314,M.frame);
 line(1587,192,1836,296,9,M.iron);line(1585,194,1499,262,7,M.frame);
 line(1699,241,1709,492,5,M.silver);line(1830,295,1832,486,5,M.silver);
 rect(1771,319,102,17,M.plate);rect(1790,336,65,11,M.signal);
 // Four visibly distinct operations, each attached to support/foundation.
 // West impulse sorting, differential hoist, east transformer fins, catch-depot.
 for(let j=0;j<5;j++){let x=172+j*43;rect(x,576,25,12,M.iron);line(x+13,574,x+23,530-(j%2)*19,7,M.silver)}
 rect(174,492,129,13,M.signal);rect(195,505,14,60,M.iron);rect(281,505,15,60,M.iron);
 for(let j=0;j<7;j++){let x=927+j*41;line(x,333,x+23,278+(j%3)*15,7,j%2?M.signal:M.silver);rect(x-10,332,40,11,M.iron)}
 rect(1395,447,172,11,M.frame);
 for(let j=0;j<9;j++){let x=1402+j*18;rect(x,413+(j%3)*10,10,29,j%2?M.ivory:M.signal)}
 line(1771,616,1930,616,10,M.iron);
 for(let j=0;j<4;j++){let x=1791+j*35;rect(x,562+(j%2)*8,22,50,M.frame);rect(x+3,560,16,10,M.signal)}
 // Four original entry-to-service shafts and intentionally open editing bays.
 const bays=[[239,897,206,78,345],[822,904,221,73,931],[1327,895,210,83,1431],[1744,902,213,76,1849]];
 for(let [x,y,w,h,entry]of bays){
  rect(x,y,w,h,0);rect(entry-39,786,79,y+32-786,0);
  // Workface layout intentionally leaves a central >31px traversable section.
  rect(x+10,y+h-11,w-20,11,M.iron);
  rect(x+16,y+16,18,10,M.signal);rect(x+w-39,y+16,25,11,M.ivory);
 }
 // Mechanical equipment on grounded bay floors, with distinct grammar.
 for(let j=0;j<4;j++){let x=255+j*38;rect(x,952,27,11,M.iron);line(x+13,953,x+19,928+(j%2)*8,6,M.silver)}
 for(let j=0;j<7;j++){let x=837+j*28;rect(x,950,18,14,M.frame);rect(x+5,937+(j%3)*5,10,16,M.signal)}
 rect(1350,960,170,10,M.iron);line(1367,958,1427,936,9,M.frame);line(1510,958,1464,928,8,M.frame);
 for(let j=0;j<5;j++)rect(1437+j*13,932+(j%2)*8,9,19,j%2?M.silver:M.ivory);
 rect(1764,964,178,9,M.frame);line(1783,959,1826,934,9,M.iron);line(1927,959,1890,934,8,M.iron);
 for(let j=0;j<6;j++)rect(1815+j*17,941+(j%2)*8,12,17,M.signal);
 // Grounded platform-edge switches, physical sites with distinct routing.
 for(let [x,y]of [[294,599],[629,462],[1132,340],[1660,490],[1850,612]]){
  rect(x,y+11,46,9,M.ivory);rect(x+28,y+20,12,18,M.signal);
 }
 // Hollow side docks, uncovered for event scripting and later human extensions.
 rect(460,710,160,64,0);rect(1195,722,128,61,0);rect(1654,741,122,47,0);
 // Reopen shaft cores and the main lower recovery flight path AFTER structure,
 // so decorative mechanics never silently reduce needed conservative hull space.
 for(let [x,y,w,h,entry]of bays){rect(entry-32,807,65,y+21-807,0);rect(entry-30,y,61,22,0)}
 // Five physically open lift/return slots across the staggered mechanical
 // flight separator; essential 31x27 portals, not site-specific snapping.
 for(let [x,w] of [[447,85],[887,90],[1320,100],[1618,100],[1895,100]])rect(x,210,w,652,0);
 // High transfer throat retains a literal stoppable checkpoint with a lower bypass.
 rect(979,254,92,83,0);
 const sites=[
 ['Start intake',104,548],['West ramp',422,526],['West open dispatch',297,548],
 ['Tower low approach',604,421],['Tower inspection',622,388],
 ['Upper glide',877,401],['Blocked high interchange',1018,295],
 ['High grade return',1230,293],['Transformer rise',1372,401],
 ['Freight glide',1635,443],['Crane lookoff',1671,301],
 ['East catch',1879,561],['East turn',1938,725],
 ['Low rescue west',215,792],['Low bypass lift',629,784],
 ['Low open runway',1200,789],['East rescue',1680,786],
 ['Finish',1917,781],['West ram workshop',346,923],
 ['Hoist repair workshop',933,926],['Transformer inspection bay',1429,911],
 ['Crane recovery workshop',1850,920]
 ];
 const obs=[979,254,92,84];
 const crops=[['overview.png',0,0,W,H],
 ['01-west-pulse-dock.png',50,429,460,370],
 ['02-offset-telescopic-lift.png',530,232,410,624],
 ['03-five-grade-cascade.png',884,239,490,397],
 ['04-asymmetric-catenary-jib.png',1350,140,615,590],
 ['05-low-recovery-works.png',85,730,1878,292],
 ['06-grounded-workface-bays.png',804,790,1151,230]];
 // Only structures with a true rock/base/boundary support path survive.
 const seen=new Uint8Array(N),q=new Int32Array(N);let tail=0,head=0;
 function push(z){if(G[z]&&!seen[z]){seen[z]=1;q[tail++]=z}}
 for(let x=0;x<W;x++){push(x);push((H-1)*W+x)}
 for(let y=0;y<H;y++){push(y*W);push(y*W+W-1)}
 while(head<tail){let z=q[head++],x=z%W,y=(z/W)|0;if(x)push(z-1);if(x+1<W)push(z+1);if(y)push(z-W);if(y+1<H)push(z+W)}
 let discarded=0;for(let i=0;i<N;i++)if(G[i]&&!seen[i]){G[i]=0;discarded++}
 if(invalid)throw Error('invalid writes');
 const histogram={};for(let i=0;i<N;i++)histogram[G[i]]=(histogram[G[i]]||0)+1;
 const edits=[],active=new Map();
 for(let y=0;y<H;y++){const next=new Map();let x=0;while(x<W){let m=G[y*W+x];if(!m){x++;continue}let left=x;while(x<W&&G[y*W+x]===m)x++;const width=x-left,key=left+','+width+','+m;let entry=active.get(key);if(entry&&entry[1]+entry[3]===y)entry[3]++;else{entry=[left,y,width,1,m];edits.push(entry)}next.set(key,entry)}active.clear();for(let [k,v]of next)active.set(k,v)}
 function route(size,bounds=null){
  const [ww,hh]=size,rx=(ww-1)/2,ry=(hh-1)/2,P=new Int32Array((W+1)*(H+1));
  for(let y=0;y<H;y++){let row=0;for(let x=0;x<W;x++){let solid=G[y*W+x]!==0;if(bounds&&x>=bounds[0]&&x<bounds[0]+bounds[2]&&y>=bounds[1]&&y<bounds[1]+bounds[3])solid=true;row+=solid?1:0;P[(y+1)*(W+1)+x+1]=P[y*(W+1)+x+1]+row}}
  const open=new Uint8Array(N),vis=new Uint8Array(N),queue=new Int32Array(N);let tail=0,head=0;
  for(let y=ry;y<H-ry;y++)for(let x=rx;x<W-rx;x++){let l=x-rx,t=y-ry,r=x+rx+1,b=y+ry+1;if(P[b*(W+1)+r]-P[t*(W+1)+r]-P[b*(W+1)+l]+P[t*(W+1)+l]===0)open[y*W+x]=1}
  const spawn=sites[0],start=spawn[2]*W+spawn[1];if(!open[start])throw Error('Blocked spawn '+size);
  queue[tail++]=start;vis[start]=1;
  while(head<tail){let z=queue[head++],x=z%W;if(x&&open[z-1]&&!vis[z-1]){vis[z-1]=1;queue[tail++]=z-1}if(x<W-1&&open[z+1]&&!vis[z+1]){vis[z+1]=1;queue[tail++]=z+1}if(z>=W&&open[z-W]&&!vis[z-W]){vis[z-W]=1;queue[tail++]=z-W}if(z+W<N&&open[z+W]&&!vis[z+W]){vis[z+W]=1;queue[tail++]=z+W}}
  let missing=sites.filter(s=>!vis[s[2]*W+s[1]]).map(s=>s[0]);
  return {size,reachable:sites.length-missing.length,total:sites.length,missing,visited_centres:tail,spawn:[spawn[1],spawn[2]]};
 }
 const clear={};for(let sz of [[19,15],[23,19],[31,27]])clear[sz.join('x')]=route(sz);
 const blocked=route([31,27],obs);
 let grounded=0;for(let [m,n] of Object.entries(histogram))if(+m)grounded+=n;
 const setup={version:2,extent:[W,H],actors:[{id:1,model:'midge',hash:model,spawn:[104,548],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits,response:'LA-SELECTIVE',liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:2,brush:8,fire:false};
 return {W,H,N,G,M,palette,sites,crops,obs,edits,setup,histogram,grounded,visits:grounded,discarded,clear,blocked};
}
module.exports={buildWorld};
