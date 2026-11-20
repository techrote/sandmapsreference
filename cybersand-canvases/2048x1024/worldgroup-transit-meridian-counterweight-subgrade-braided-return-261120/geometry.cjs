'use strict';
// MERIDIAN COUNTERWEIGHT CORRIDOR / SIBLING 03 / NEW ORIGINAL GEOMETRY.
// Structural thesis: two continuous low excavated traffic arteries, linked by
// uncommon wide shafts and off-axis recovery bypasses; no central wheel or mast row.
function buildWorld(){
const W=2048,H=1024,N=W*H,G=new Uint8Array(N);
const M={rock:100,dark:101,iron:58,plate:62,silver:117,signal:113,ivory:122,frame:49};
const palette={0:[10,14,22],49:[79,97,119],58:[139,150,163],62:[178,190,202],100:[40,50,65],101:[24,34,49],113:[227,183,100],117:[111,128,148],122:[236,229,199]};
const model='c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96';
const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
let badWrites=0;
function rect(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);if(x<0||y<0||w<1||h<1||x+w>W||y+h>H){badWrites++;throw Error('out of bounds '+[x,y,w,h,m]);}for(let yy=y;yy<y+h;yy++)G.fill(m,yy*W+x,yy*W+x+w)}
function line(ax,ay,bx,by,r,m){let dx=bx-ax,dy=by-ay,L=dx*dx+dy*dy||1;let x0=Math.max(0,Math.floor(Math.min(ax,bx)-r)),x1=Math.min(W,Math.ceil(Math.max(ax,bx)+r+1)),y0=Math.max(0,Math.floor(Math.min(ay,by)-r)),y1=Math.min(H,Math.ceil(Math.max(ay,by)+r+1));for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){let t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/L)),dx2=x-ax-t*dx,dy2=y-ay-t*dy;if(dx2*dx2+dy2*dy2<=r*r)G[y*W+x]=m}}
const roof=new Int16Array(W);
for(let x=0;x<W;x++){let r=262+Math.round(16*Math.sin(x/151)+8*Math.sin(x/41));roof[x]=r;for(let y=r;y<H;y++){let m=(y%113<7)?M.dark:M.rock;if(y-r<14)m=M.iron;G[y*W+x]=m}}
// Two unequal long horizontal arteries across the whole horizontal extent.
rect(94,390,1862,132,0);rect(112,628,1826,130,0);
// Asymmetric, large transverse changeovers, not repeated switch matrices.
for(const [x,w] of [[236,116],[681,129],[1066,143],[1567,121],[1807,116]])rect(x,385,w,378,0);
// Rock-light exterior crossing: the north route becomes a broad exposed cutting.
// A visually memorable open slot rather than a sawtooth or radial brake.
rect(901,0,290,425,0);
rect(876,235,27,182,M.iron);rect(1191,234,28,183,M.iron);
line(874,253,833,375,13,M.frame);line(1214,249,1252,373,13,M.frame);
// A low side bypass between the two arteries around the service plant.
rect(805,542,436,83,0);rect(811,507,90,100,0);rect(1165,506,78,110,0);
// Four entered subgrade repair bays, deliberately different widths and adjacencies.
const bays=[[180,801,253,156,291],[763,814,232,144,857],[1261,803,248,154,1379],[1672,809,251,149,1795]];
for(const [x,y,w,h,entry] of bays){rect(x,y,w,h,0);rect(entry-47,745,95,y+65-745,0)}
// Deliberate long void above upper roadway: this is an editable route skyline.
for(const [x,y,w,h] of [[120,331,325,34],[1424,316,244,48]])rect(x,y,w,h,0);
// Material-cell engineering: cuttings have well rooted contact rails.
for(let x=132;x<1932;x+=53){
 if(x>901&&x<1192)continue;
 rect(x,390,21,9,x%3?M.iron:M.silver);
 rect(x+5,511,14,11,M.plate);
 rect(x,628,23,9,M.iron);rect(x+8,747,11,11,M.plate);
}
// Off-axis grounded load paths from upper artery floor to lower artery roof.
for(const [x,yTop,yBot,lean] of [[418,520,627,1],[564,520,627,-1],[1328,522,627,-1],[1457,520,627,1],[1719,520,627,-1]]){
 line(x,yTop,x+lean*43,yBot,9,M.frame);
 line(x+lean*43,yBot,x+lean*69,yBot+43,8,M.iron);
 rect(x-11,517,22,14,M.silver);
}
// Nonparallel recovery rails in lower channel: not impassable obstacles.
for(const [ax,ay,bx,by] of [[165,744,575,744],[590,742,825,748],[1218,747,1442,743],[1450,748,1845,746]]){
 line(ax,ay,bx,by,5,M.signal);line(ax,ay-105,bx,by-99,4,M.plate);
}
// Braided threshold plates and wayfinding in widening interchange chambers.
for(const [x,dir]of [[265,1],[716,-1],[1092,1],[1589,-1],[1833,1]]){
 line(x,390,x+dir*32,377,8,M.plate);
 line(x+dir*32,377,x+dir*75,344,5,M.signal);
 rect(x+19,515,51,8,M.ivory);rect(x+19,626,51,8,M.signal);
 line(x+15,752,x+67,769,8,M.frame);
}
// 4 spatially independent workfaces: anchored to lower bay floors, each with
// visible input / energy conversion / mechanical receiver, no scripts implied.
function pedestal(x,y,w=32){rect(x,y,w,14,M.iron);rect(x+8,y-40,w-16,41,M.plate)}
// West: opposed oil-free friction rams and catch shoes.
for(let j=0;j<5;j++){let x=195+j*39;pedestal(x,925,31);line(x+8,914,x+26,858+(j%2)*13,7,j%2?M.frame:M.silver)}
line(198,946,413,946,10,M.frame);rect(194,845,82,13,M.ivory);rect(360,848,48,12,M.signal);
// Central: staggered cable tension comb (NOT a wheel).
line(781,941,977,941,12,M.frame);
for(let j=0;j<7;j++){let x=789+j*26;line(x,934,x+11,845+(j%3)*12,6,M.plate);rect(x-4,855+(j%3)*10,20,10,j%2?M.signal:M.ivory)}
rect(806,823,140,11,M.iron);
// Eastern catch magazine: two opposed magnetic blade housings with spare gap.
rect(1279,939,215,11,M.iron);line(1290,936,1340,839,13,M.frame);line(1485,936,1430,839,12,M.frame);
for(let j=0;j<6;j++){rect(1340+j*22,859+(j%2)*13,13,59,j%2?M.silver:M.signal)}
// Far-east fault traction rescue: chain-like static links and forked cradle.
rect(1693,943,208,13,M.frame);line(1710,930,1760,858,10,M.iron);line(1870,930,1820,853,10,M.iron);
for(let j=0;j<9;j++){let x=1736+j*15;rect(x,878+(j%3)*9,8,26,j%3?M.signal:M.ivory)}
line(1760,863,1820,856,7,M.plate);
// Services are physically entered via their vertical relief shafts. Wall fixtures
// are attached to rock roofs / full stone floors, avoiding unattached islands.
for(const [x,y,w,h] of bays){
 rect(x,y,w,8,M.silver);rect(x,y+h-11,w,11,M.iron);
 rect(x+8,y+27,26,12,M.signal);rect(x+w-39,y+26,30,12,M.ivory);
}
// Compact energy-tap clusters; distributed along corridors instead of a skyline.
for(const [x,alt]of [[375,0],[558,1],[818,0],[1275,1],[1509,0],[1753,1]]){
 let y=alt?633:396;
 rect(x,y,42,11,M.plate);rect(x+9,y+11,14,22,M.signal);
 rect(x+33,y+8,8,30,M.ivory);
 // housing anchored to solid tunnel roof with clearance preserved below
}
// Exposed gorge includes twin tension harps suspended from side bedrock.
// All lines visibly reach rock at their roots and never close the flight gap.
for(let i=0;i<5;i++){
 line(880,282+i*15,923+i*19,351,4,i%2?M.signal:M.silver);
 line(1211,280+i*17,1173-i*18,353,4,i%2?M.silver:M.signal);
}
// Smaller bilateral relief alcoves for future destructible machinery additions.
for(const [x,y,w,h] of [[488,756,144,53],[1462,760,115,40]])rect(x,y,w,h,0);
// The low, shared access throat is carved AFTER machinery is mounted. It is not
// a teleport / site exemption: actual rock removal creates full-hull tunnels.
for(const [x,w] of [[236,116],[681,129],[1066,143],[1567,121],[1807,116]])rect(x+20,381,w-40,396,0);
for(const [x,y,w,h,entry] of bays){
 rect(entry-43,730,87,y+80-730,0);
 // The rooms have no solid membrane separating their entrance from the shaft.
 rect(entry-43,y,87,15,0);
}
// Repeat corridor clearing where shaft throat must remain 31x27-compatible:
// do NOT erase embedded machinery elsewhere; just preserve literal free centres.
const sites=[
['West entry',144,458],['West upper run',455,457],
['West interchange',287,572],['West lower return',478,691],
['West rejoin',751,465],['West subgrade',751,682],
['Blocked upper checksum',617,459],
['Exterior reveal',1018,455],['Exterior lower recovery',1023,694],
['Middle low through',1249,690],['Mid-east high through',1359,461],
['Crosslink east',1618,577],['Eastern lower return',1519,697],
['Final high return',1901,458],['Finish',1940,461],
['West ram bay',291,852],['Tension-comb bay',865,858],
['Catch magazine',1392,851],['Rescue cradle',1800,850],
['Far east turnaround',1844,686],['West egress',202,457]];
const obs=[570,387,103,140];
const crops=[['overview.png',0,0,W,H],
 ['01-west-dual-artery.png',70,228,560,746],
 ['02-first-countershaft.png',516,315,400,638],
 ['03-exterior-traction-aperture.png',876,195,386,757],
 ['04-east-subgrade-rejoin.png',1200,308,430,647],
 ['05-emergency-rescue-works.png',1599,284,449,714],
 ['06-undertrack-machine-workfaces.png',159,768,1759,228]];
// Discard any accidentally stranded decorative strokes. All remaining solids
// physically connect to boundary rock; no "floating" technical credit claimed.
const seen=new Uint8Array(N),q=new Int32Array(N);let back=0,front=0;
function push(i){if(G[i]&&!seen[i]){seen[i]=1;q[back++]=i}}
for(let x=0;x<W;x++){push(x);push((H-1)*W+x)}
for(let y=0;y<H;y++){push(y*W);push(y*W+W-1)}
while(front<back){let z=q[front++],x=z%W,y=(z/W)|0;if(x)push(z-1);if(x+1<W)push(z+1);if(y)push(z-W);if(y+1<H)push(z+W)}
let discarded=0;for(let i=0;i<N;i++)if(G[i]&&!seen[i]){G[i]=0;discarded++}
if(badWrites)throw Error('invalid writes '+badWrites);
const histogram={};for(let i=0;i<N;i++)histogram[G[i]]=(histogram[G[i]]||0)+1;
let edits=[],active=new Map();
for(let y=0;y<H;y++){let next=new Map(),x=0;while(x<W){let m=G[y*W+x];if(!m){x++;continue}let start=x;while(x<W&&G[y*W+x]===m)x++;let w=x-start,key=start+','+w+','+m,entry=active.get(key);if(entry&&entry[1]+entry[3]===y)entry[3]++;else {entry=[start,y,w,1,m];edits.push(entry)}next.set(key,entry)}active=next}
function clearData(bounds=null){
 const P=new Int32Array((W+1)*(H+1));
 for(let y=0;y<H;y++){let row=0;for(let x=0;x<W;x++){let solid=!!G[y*W+x];if(bounds&&x>=bounds[0]&&x<bounds[0]+bounds[2]&&y>=bounds[1]&&y<bounds[1]+bounds[3])solid=true;row+=solid?1:0;P[(y+1)*(W+1)+x+1]=P[y*(W+1)+x+1]+row}}
 return P;
}
function route(size,bounds=null){
 const [ww,hh]=size,rx=(ww-1)/2,ry=(hh-1)/2,P=clearData(bounds),open=new Uint8Array(N),visited=new Uint8Array(N),qq=new Int32Array(N);let qt=0,qh=0;
 for(let y=ry;y<H-ry;y++)for(let x=rx;x<W-rx;x++){
 let l=x-rx,t=y-ry,r=x+rx+1,b=y+ry+1,n=P[b*(W+1)+r]-P[t*(W+1)+r]-P[b*(W+1)+l]+P[t*(W+1)+l];if(n===0)open[y*W+x]=1}
 const [,,]=sites[0];let sx=sites[0][1],sy=sites[0][2],s=sy*W+sx;
 if(!open[s])throw Error('spawn envelope blocked at '+size);
 qq[qt++]=s;visited[s]=1;
 while(qh<qt){let z=qq[qh++],x=z%W,y=(z/W)|0;
 if(x&&open[z-1]&&!visited[z-1]){visited[z-1]=1;qq[qt++]=z-1}
 if(x<W-1&&open[z+1]&&!visited[z+1]){visited[z+1]=1;qq[qt++]=z+1}
 if(y&&open[z-W]&&!visited[z-W]){visited[z-W]=1;qq[qt++]=z-W}
 if(y<H-1&&open[z+W]&&!visited[z+W]){visited[z+W]=1;qq[qt++]=z+W}
 }
 const missing=sites.filter(a=>!open[a[2]*W+a[1]]||!visited[a[2]*W+a[1]]).map(a=>a[0]);
 return {size,reachable:sites.length-missing.length,total:sites.length,missing,visited_centres:qt,spawn:[sx,sy]};
}
let clear={};for(let sz of [[19,15],[23,19],[31,27]]){let r=route(sz);clear[sz.join('x')]=r}
let blocked=route([31,27],obs);
let grounded=0;for(const [k,v] of Object.entries(histogram))if(+k)grounded+=v;
const setup={version:2,extent:[W,H],actors:[{id:1,model:'midge',hash:model,spawn:[144,458],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits,response:'LA-SELECTIVE',liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:2,brush:8,fire:false};
return {W,H,N,G,M,palette,sites,crops,obs,edits,setup,histogram,grounded,visits:grounded,discarded,clear,blocked};
}
module.exports={buildWorld};
