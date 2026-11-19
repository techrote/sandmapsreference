'use strict';
// ORIGINAL INDUSTRIAL HAZARD WIDE -- wholly authored cell geometry, no source art.
// Node 24: node build.cjs    (builds two independent self-contained Setup-v2 worlds)
// Node 24: node build.cjs --verify  (regenerates and checks all emitted files)
// Accepted read-only CyberSand main 018bd09503d7f079ddac52e225c2f7daf8d678bf
const W=2048,H=1024,ROOT='cybersand-canvases/2048x1024/';
const ENGINE='018bd09503d7f079ddac52e225c2f7daf8d678bf';
const MAT={empty:0,wall:58,basalt:100,obsidian:101,iron:117,glass:120,quartz:122,glow:123,water:3,lava:8};
const MIDGE_HASH='c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96';
const POLICY=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
const specs=[
{slug:'pyrewater-quarantine-ring',seed:27111941,name:'Pyrewater Quarantine Ring',
spawn:[112,373],sites:[
['Freight arrival',[112,373]],['High crane gallery',[360,247]],['Intake assay',[455,435]],
['Quench inspection',[670,395]],['West maintenance',[580,841]],['Upper containment',[965,132]],
['Reactor gallery',[1000,395]],['Reactor service',[1215,595]],['East chemistry',[1410,426]],
['Glass distillation',[1595,455]],['North evacuation',[1750,245]],
['Quarantine passage',[1780,650]],['East helipad',[1945,337]],['Dry underpass',[1115,965]]],
crops:[['freight',30,225,410,570],['quench',395,290,440,560],['reactor',805,130,555,710],['distillation',1310,210,500,650],['evacuation',1670,220,370,650]]},
{slug:'ashlight-counterflow-foundry',seed:27111987,name:'Ashlight Counterflow Foundry',
spawn:[108,440],sites:[
['Ashward arrival',[108,440]],['Splitter cliff',[340,260]],['Cold siphon',[510,470]],
['Cyclone lip',[740,330]],['Lower filter service',[645,840]],['Spiral gantry',[1080,326]],
['Cascade observation',[1145,485]],['Reactor twin west',[1420,466]],['Reactor twin east',[1645,526]],
['Lower isolation gallery',[1550,545]],['Vent conservatory',[1950,388]],['Long exhaust exit',[1940,580]],
['Deep retrieval',[1040,965]]],
crops:[['ashward',20,160,470,650],['siphons',400,250,510,610],['cascade',880,140,460,670],['twins',1305,160,485,675],['vent',1680,225,340,655]]}
];
function makePlane(){return new Uint8Array(W*H);}
function construct(spec,index){
 const g=makePlane(); let op=0;
 function box(x,y,w,h,m) {
   x=Math.floor(x);y=Math.floor(y);w=Math.floor(w);h=Math.floor(h);
   let l=Math.max(0,x),r=Math.min(W,x+w),t=Math.max(0,y),b=Math.min(H,y+h);
   if(l>=r||t>=b)return;
   for(let yy=t;yy<b;yy++)g.fill(m,yy*W+l,yy*W+r);op++;
 }
 function line(x1,y1,x2,y2,t,m) {
   let n=Math.ceil(Math.max(Math.abs(x2-x1),Math.abs(y2-y1))/3);
   for(let k=0;k<=n;k++){let p=k/Math.max(1,n);box(Math.round(x1+(x2-x1)*p-t/2),Math.round(y1+(y2-y1)*p-t/2),t,t,m);}
 }
 function frame(x,y,w,h,t,m) {
   box(x,y,w,t,m);box(x,y+h-t,w,t,m);box(x,y,t,h,m);box(x+w-t,y,t,h,m);
 }
 function rib(x,top,base,width,m) {
   box(x,top,width,base-top,m); // grounded if base reaches bedrock or touches anchored shell
 }
 function tank(x,y,w,h,level,fluid) {
   frame(x,y,w,h,11,MAT.iron);
   box(x+11,y+11,w-22,h-22,MAT.empty);
   box(x+12,y+h-12-level,w-24,level,fluid);
   box(x+11,y+11,w-22,6,MAT.glass);
   box(x+11,y+h-16,w-22,5,MAT.obsidian);
 }
 function vents(x,y,num,step) {
   for(let k=0;k<num;k++){
     const xx=x+k*step;
     box(xx,y,12,54,MAT.iron);box(xx+2,y,8,14,MAT.glow);
   }
 }
 function rail(x1,x2,y,t=10){box(x1,y,x2-x1,t,MAT.iron);}
 function truss(x1,y1,x2,y2,count=5) {
   line(x1,y1,x2,y2,8,MAT.iron);
   for(let i=0;i<count;i++){let p=i/count;line(x1+(x2-x1)*p,y1+(y2-y1)*p,x1+(x2-x1)*(p+1/count),y2,5,MAT.iron);}
 }
 function pipe(x1,y1,x2,y2,t=9){line(x1,y1,x2,y2,t,MAT.quartz);}
 function portal(x,y,w,h){box(x,y,w,h,MAT.empty);}
 // Sculpt a continuous stratified geological plinth, connected to canvas edges.
 for(let x=0;x<W;x++){
   let phase=index===0?x/81:x/61;
   let surface=905+Math.round(19*Math.sin(phase)+11*Math.sin(x/27)+5*Math.cos(x/13));
   if(index===1)surface+=Math.round(20*Math.sin(x/227));
   box(x,surface,1,H-surface,MAT.basalt);
 }
 for(let x=0;x<W;x+=92)box(x,995,48,5,MAT.obsidian);
 box(0,0,W,20,MAT.wall);box(0,0,18,H,MAT.wall);box(W-18,0,18,H,MAT.wall);
 // Long lower dry service artery is cut from actual solid, roof/floor remain substantial.
 portal(84,946,1880,37);
 for(let x=225;x<1960;x+=354){portal(x,872,48,84);box(x-10,900,10,46,MAT.iron);box(x+48,900,10,46,MAT.iron);}
 rail(84,1964,985,8);
 // Upper grounded sky manifold with six long ribs, unevenly interrupted for optical silhouette.
 box(25,55,350,9,MAT.iron);box(410,83,250,9,MAT.iron);
 box(725,65,480,9,MAT.iron);box(1275,90,335,9,MAT.iron);box(1680,57,320,9,MAT.iron);
 for(const [xx,yb] of [[125,55],[572,83],[840,65],[1250,90],[1830,57]]){
   box(xx,19,13,yb-19,MAT.iron);
 }
 if(index===0){
   // District I - asymmetric freight frontier: two unequal crane mast bays.
   rib(72,315,932,20,MAT.wall);rib(312,418,935,18,MAT.iron);
   rail(72,334,316,14);rail(72,344,520,14);rail(72,335,709,13);
   box(100,334,160,13,MAT.quartz);box(100,539,130,9,MAT.iron);
   rib(164,520,700,13,MAT.iron);
   box(218,235,17,81,MAT.wall);box(228,206,90,12,MAT.iron);
   truss(228,217,330,312,6);box(328,290,18,55,MAT.iron);
   pipe(102,460,312,460,9);vents(100,700,3,65);
   frame(95,748,195,116,11,MAT.wall);
   portal(270,786,25,55);box(104,770,46,25,MAT.glass);
   // District II - triple containment/quench tanks, all water physically closed.
   rib(423,355,928,18,MAT.wall);rib(788,330,932,17,MAT.wall);
   rail(423,805,355,16);rail(423,805,585,14);
   tank(454,630,105,143,82,MAT.water);
   tank(583,662,118,111,49,MAT.water);
   tank(718,609,70,164,110,MAT.water);
   pipe(477,579,477,631,11);pipe(638,586,638,660,10);
   vents(464,286,5,64);rail(450,786,292,10);
   frame(467,797,287,105,11,MAT.wall);portal(520,798,65,18);portal(693,843,66,48);
   // District III - enormous asymmetric double reactor vault with full open interior.
   rib(832,242,930,18,MAT.wall);rib(1270,288,939,19,MAT.wall);
   line(832,244,932,157,15,MAT.obsidian);
   line(932,157,1135,150,16,MAT.obsidian);
   line(1135,150,1288,287,17,MAT.obsidian);
   // Outer high ribs, deliberate broken industrial silhouette.
   line(856,340,930,238,11,MAT.iron);line(1261,360,1175,224,13,MAT.iron);
   rail(845,1288,777,17);rail(850,1010,616,12);rail(1120,1281,622,12);
   rib(1030,600,784,16,MAT.wall);rib(1099,642,783,19,MAT.wall);
   tank(1042,665,100,106,51,MAT.lava); // fully closed heat-source vessel
   box(1032,797,112,18,MAT.obsidian);
   box(888,475,85,11,MAT.quartz);box(1170,470,83,11,MAT.quartz);
   vents(901,688,2,58);vents(1180,690,2,42);
   // Large Midge-safe inbound/outbound threshold spaces, both true material void.
   portal(830,405,34,91);portal(1268,446,32,92);
   // District IV - chemical mixing cloister, linked service and tall condenser spires.
   rib(1345,321,932,22,MAT.wall);rib(1665,400,935,19,MAT.wall);
   rail(1345,1690,321,17);rail(1345,1690,608,14);
   frame(1370,654,266,150,13,MAT.wall);portal(1398,652,65,16);portal(1612,690,27,70);
   tank(1395,681,89,99,57,MAT.water);tank(1510,690,96,90,45,MAT.water);
   pipe(1430,610,1430,652,9);pipe(1553,610,1553,686,9);
   rib(1460,242,321,18,MAT.wall);rib(1547,192,321,21,MAT.iron);
   pipe(1470,224,1556,203,10);vents(1378,527,4,70);
   // District V - quarantine dusk tunnel with evacuation arch and pier.
   rib(1715,385,940,22,MAT.wall);rib(1995,462,948,21,MAT.wall);
   rail(1715,2020,385,15);rail(1715,2020,704,14);
   frame(1750,730,206,153,13,MAT.wall);portal(1735,769,29,64);portal(1944,773,29,63);
   box(1765,754,155,12,MAT.glass);
   rib(1885,192,384,16,MAT.iron);box(1825,188,128,14,MAT.iron);
   truss(1730,401,1830,263,6);
   box(1838,268,18,80,MAT.quartz);vents(1800,650,3,74);
 } else {
   // Map B is NOT a recolour of A: suspended diagonal siphon canyon and twin towers.
   // I - sheared ashward intake cliff, terraces face a broad navigable weather gap.
   rib(70,382,928,22,MAT.wall);rib(382,510,928,19,MAT.obsidian);
   rail(70,405,383,18);rail(70,317,633,13);
   line(93,365,234,206,16,MAT.obsidian);line(234,206,310,244,16,MAT.obsidian);
   truss(234,215,405,383,5);box(165,330,135,13,MAT.quartz);
   rib(221,548,630,12,MAT.iron);frame(102,736,260,134,12,MAT.wall);
   portal(345,780,33,60);box(120,753,94,13,MAT.glass);
   vents(111,680,3,82);
   // II - stepwise cryosiphon rack, staggered connected pressure vessels.
   rib(432,407,937,19,MAT.wall);rib(832,497,937,21,MAT.wall);
   rail(432,856,504,15);rail(432,780,357,15);
   tank(468,625,100,163,110,MAT.water);
   tank(605,657,134,130,58,MAT.water);
   tank(763,696,79,91,31,MAT.water);
   // membrane ribs grow from real manifold, not floating hazard decoration.
   for(let j=0;j<5;j++){let xx=485+j*70;line(xx,356,xx-17,438,10,MAT.iron);}
   pipe(475,440,780,440,10);pipe(516,506,516,619,10);
   frame(480,810,292,97,11,MAT.wall);portal(738,837,39,51);
   // III - long diagonal suspended counterflow slant, grounded two endpoints.
   rib(903,359,932,22,MAT.wall);rib(1295,287,943,19,MAT.wall);
   line(905,377,1130,185,24,MAT.obsidian);
   line(1130,185,1313,303,21,MAT.obsidian);
   line(925,555,1190,367,15,MAT.iron);
   line(1190,367,1302,433,13,MAT.iron);
   for(let j=0;j<7;j++){
     let xx=954+j*42,yy=520-j*29;
     line(xx,yy,xx+18,yy+61,7,MAT.wall);
   }
   rail(910,1310,790,14);rail(930,1290,684,10);
   // Keep large void between span and service gantry, visible from ordinary zoom.
   frame(960,813,296,98,11,MAT.wall);portal(960,842,33,53);portal(1224,843,33,49);
   box(1035,207,120,12,MAT.glow);vents(1010,616,3,75);
   // IV - very asymmetric twin reactor monoliths with distinct tier heights.
   rib(1345,246,947,26,MAT.wall);rib(1505,353,947,20,MAT.wall);
   rib(1580,194,947,30,MAT.wall);rib(1706,389,947,23,MAT.wall);
   rail(1345,1524,245,19);rail(1580,1730,193,19);
   rail(1345,1730,569,13);rail(1345,1730,744,14);
   tank(1392,627,82,105,48,MAT.lava);
   tank(1596,632,83,98,49,MAT.water);
   truss(1372,266,1514,354,5);truss(1609,214,1720,377,4);
   box(1374,393,84,16,MAT.glass);box(1602,424,83,14,MAT.quartz);
   frame(1375,786,309,110,10,MAT.wall);portal(1680,820,28,51);
   // V - exhaust forest and dry isolation returns.
   rib(1770,439,946,18,MAT.wall);rib(2002,477,950,18,MAT.wall);
   line(1804,426,1859,268,13,MAT.obsidian);
   line(1859,268,1910,314,12,MAT.obsidian);
   rail(1770,2021,476,14);rail(1770,2021,693,11);
   frame(1790,743,200,144,12,MAT.wall);portal(1772,781,33,70);portal(1974,787,30,63);
   vents(1788,636,4,61);box(1824,493,125,12,MAT.glass);
   pipe(1776,701,1968,701,9);
 }

 // Functional passages cut through genuine wall and slab material, not viewpoint aliases.
 if(index===0){
   portal(415,392,46,122);portal(779,388,53,120);
   portal(580,572,78,69);portal(547,781,77,69);
   portal(1334,390,50,135);portal(1659,434,47,118);
   portal(1705,573,50,125);portal(1985,572,52,124);
   portal(1798,698,65,62);
 }else{
   portal(422,391,54,139);portal(824,449,58,152);
   portal(620,493,80,92);portal(552,790,72,72);
   portal(891,416,55,145);portal(1284,432,55,145);
   portal(1336,374,57,130);portal(1498,409,50,125);
   portal(1571,368,50,148);portal(1693,440,55,120);
   portal(1757,490,50,130);portal(1980,518,53,125);
 }
 // Large-scale repeated strata discontinuities follow geology, not arbitrary wallpaper.
 for(let x=120;x<1950;x+=214){
   box(x,999,92,3,MAT.obsidian);
 }
 // Actual continuous load-transfer girder sits above the dry maintenance tunnel.
 // It unifies galleries and geological bearing; service void below remains open.
 box(18,916,2012,27,MAT.iron);
 // Three elevated suspension rods meet the real top boundary, not floating paint.
 box(1425,19,10,74,MAT.iron);
 box(1540,19,10,76,MAT.iron);
 // Shaft reaches the continuous dry maintenance artery at an explicitly designed
 // split in the upper deck; 65-cell aperture preserves 31x27 manoeuvring.
 portal(547,816,67,159);
 return {grid:g,op};
}
function rects(g){
 const out=[],active=new Map();let runs=0;
 for(let y=0;y<H;y++){
   const next=new Map();let x=0;
   while(x<W){
     const m=g[y*W+x],x0=x;
     while(x<W&&g[y*W+x]===m)x++;
     if(!m)continue;
     const key=x0+':'+(x-x0)+':'+m,old=active.get(key);
     if(old!==undefined){out[old][3]++;next.set(key,old);}
     else{next.set(key,out.length);out.push([x0,y,x-x0,1,m]);}
     runs++;
   }
   active.clear();
   for(const [k,v] of next)active.set(k,v);
 }
 return {edits:out,rowRuns:runs};
}
function replay(edits){
 const g=makePlane();let overlap=0;
 for(const [x,y,w,h,m] of edits){
   if(x<0||y<0||w<1||h<1||x+w>W||y+h>H||![3,8,58,100,101,117,120,122,123].includes(m))throw Error('bad edit '+JSON.stringify([x,y,w,h,m]));
   for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){
     const p=yy*W+xx;if(g[p])overlap++;g[p]=m;
   }
 }
 if(overlap)throw Error('overlapping rectangles '+overlap);
 return g;
}
function legalCentres(g,bw,bh){
 const sat=new Int32Array((W+1)*(H+1));const stride=W+1;
 for(let y=1;y<=H;y++){
   let row=0;
   for(let x=1;x<=W;x++){
     const m=g[(y-1)*W+x-1];row+=(m!==0?1:0);
     sat[y*stride+x]=sat[(y-1)*stride+x]+row;
   }
 }
 const clear=new Uint8Array(W*H),hw=(bw-1)>>1,hh=(bh-1)>>1;
 let count=0;
 for(let y=hh;y<H-hh;y++)for(let x=hw;x<W-hw;x++){
   const l=x-hw,r=x+hw+1,t=y-hh,b=y+hh+1;
   let occupied=sat[b*stride+r]-sat[t*stride+r]-sat[b*stride+l]+sat[t*stride+l];
   if(!occupied){clear[y*W+x]=1;count++;}
 }
 return {clear,count};
}
function reachable(clear,start,sites){
 const at=(p)=>p[1]*W+p[0];
 const startIndex=at(start);
 if(!clear[startIndex])throw Error('spawn hull clearance failed at '+start);
 const flags=new Uint8Array(W*H),q=new Int32Array(W*H);
 let tail=0,head=0;q[tail++]=startIndex;flags[startIndex]=1;
 while(head<tail){
   const p=q[head++],x=p%W,y=(p/W)|0;
   if(x>0&&clear[p-1]&&!flags[p-1]){flags[p-1]=1;q[tail++]=p-1;}
   if(x<W-1&&clear[p+1]&&!flags[p+1]){flags[p+1]=1;q[tail++]=p+1;}
   if(y>0&&clear[p-W]&&!flags[p-W]){flags[p-W]=1;q[tail++]=p-W;}
   if(y<H-1&&clear[p+W]&&!flags[p+W]){flags[p+W]=1;q[tail++]=p+W;}
 }
 const bad=sites.filter(([name,point])=>!clear[at(point)]||!flags[at(point)]).map(x=>x[0]+'@'+x[1]);
 return {visited:tail,bad};
}
function connectedSolids(g){
 const mark=new Uint8Array(W*H),q=new Int32Array(W*H);let n=0,r=0,total=0;
 const solid=p=>{const m=g[p];return m!==0&&m!==3&&m!==8;};
 for(let p=0;p<g.length;p++)if(solid(p))total++;
 const add=p=>{if(solid(p)&&!mark[p]){mark[p]=1;q[n++]=p;}};
 for(let x=0;x<W;x++){add(x);add((H-1)*W+x);}
 for(let y=0;y<H;y++){add(y*W);add(y*W+W-1);}
 while(r<n){
   const p=q[r++],x=p%W,y=(p/W)|0;
   if(x>0)add(p-1);if(x+1<W)add(p+1);
   if(y>0)add(p-W);if(y+1<H)add(p+W);
 }
 return {total,anchored:n,detached:total-n};
}
function qualify(spec,g,edits){
 if(edits.length>32768)throw Error('rectangle cap '+edits.length);
 const setup={version:2,extent:[W,H],actors:[{id:1,model:'midge',hash:MIDGE_HASH,spawn:spec.spawn,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:2}}],next_id:2,selected:1,edits,response:'LA-SELECTIVE',liquid_policy:POLICY,normalize:false,rule_radius:2,source:[],material:58,brush:8,fire:false};
 const json=JSON.stringify(setup);
 if(BufferLikeLength(json)>1048576)throw Error('JSON too big '+json.length);
 const copy=replay(edits);
 let mismatch=0,hist={};
 for(let p=0;p<g.length;p++){if(copy[p]!==g[p])mismatch++;const id=g[p];hist[id]=(hist[id]||0)+1;}
 if(mismatch)throw Error('grid mismatch '+mismatch);
 const envelopes={};
 for(const [bw,bh] of [[19,15],[23,19],[31,27]]){
   const lc=legalCentres(g,bw,bh),path=reachable(lc.clear,spec.spawn,spec.sites);
   envelopes[bw+'x'+bh]={legal:lc.count,reachable:path.visited,sites:spec.sites.length,failed:path.bad};
   if(path.bad.length)throw Error(spec.slug+' '+bw+'x'+bh+' '+path.bad.join('; '));
 }
 const solids=connectedSolids(g);
 const work=edits.reduce((a,e)=>a+e[2]*e[3],0);
 if(work>32000000)throw Error('construction work '+work);
 return {setup,json,receipt:{concept:spec.name,slug:spec.slug,seed:spec.seed,engine_main:ENGINE,dimensions:[W,H],cells:W*H,rectangles:edits.length,setup_utf8_bytes:BufferLikeLength(json),construction_work:work,material_histogram:hist,replay_mismatch:mismatch,solid_connectivity:solids,clearance:envelopes,native:'NATIVE-UNTESTED',installed_bridge_capacity:'UNKNOWN; source 32768, fallback 4096',source_art:'NONE: original design'}};
}
function BufferLikeLength(str){return unescape(encodeURIComponent(str)).length;}
function build(i){
 const spec=specs[i],r=construct(spec,i),z=rects(r.grid),result=qualify(spec,r.grid,z.edits);
 result.grid=r.grid;result.spec=spec;result.receipt.paint_operations=r.op;
 result.receipt.unmerged_row_runs=z.rowRuns;
 return result;
}
module.exports={build,specs,W,H,MAT,rects,replay,legalCentres,reachable,connectedSolids,ENGINE};
if(typeof require!=='undefined' && require.main===module){
 const fs=require('fs'),path=require('path'),zlib=require('zlib'),crypto=require('crypto');
 const VERIFY=process.argv.includes('--verify');
 const palette=new Uint8Array(256*3);for(let i=0;i<256;i++){palette[3*i]=8;palette[3*i+1]=11;palette[3*i+2]=20;}
 const colors={0:[8,13,27],3:[36,137,214],8:[238,99,37],58:[83,96,117],100:[60,74,83],101:[34,38,57],117:[165,166,172],120:[108,209,223],122:[230,217,156],123:[150,224,120]};
 for(const [id,rgb] of Object.entries(colors))palette.set(rgb,3*Number(id));
 function crc(bytes){let c=-1;for(const v of bytes){c^=v;for(let k=0;k<8;k++)c=c&1?(c>>>1)^0xedb88320:c>>>1;}return (c^-1)>>>0;}
 function chunk(type,data){
   const name=Buffer.from(type,'ascii'),n=Buffer.alloc(4),c=Buffer.alloc(4);n.writeUInt32BE(data.length);
   c.writeUInt32BE(crc(Buffer.concat([name,data])));return Buffer.concat([n,name,data,c]);
 }
 function png(g,x0,y0,w,h){
   const raw=Buffer.alloc(h*(w+1));
   for(let y=0;y<h;y++)raw.set(g.subarray((y+y0)*W+x0,(y+y0)*W+x0+w),y*(w+1)+1);
   const hdr=Buffer.alloc(13);hdr.writeUInt32BE(w);hdr.writeUInt32BE(h,4);hdr[8]=8;hdr[9]=3; // indexed, actual ID indices
   return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',hdr),chunk('PLTE',Buffer.from(palette)),chunk('IDAT',zlib.deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0))]);
 }
 function checkPng(bytes,g,x0,y0,w,h){
   let p=8,data=[];
   if(!bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))throw Error('bad png signature');
   while(p<bytes.length){let len=bytes.readUInt32BE(p),type=bytes.toString('ascii',p+4,p+8),payload=bytes.subarray(p+8,p+8+len);
     if(crc(bytes.subarray(p+4,p+8+len))!==bytes.readUInt32BE(p+8+len))throw Error('CRC '+type);
     if(type==='IDAT')data.push(payload);
     if(type==='IHDR'&&(payload.readUInt32BE(0)!==w||payload.readUInt32BE(4)!==h||payload[9]!==3))throw Error('IHDR');
     p+=len+12;
     if(type==='IEND'){if(p!==bytes.length)throw Error('PNG extra bytes');break;}
   }
   const raw=zlib.inflateSync(Buffer.concat(data));if(raw.length!==h*(w+1))throw Error('PNG raw');
   for(let y=0;y<h;y++){if(raw[y*(w+1)]!==0)throw Error('PNG filtered');for(let x=0;x<w;x++){
     if(raw[y*(w+1)+x+1]!==g[(y0+y)*W+x0+x])throw Error('PNG pixel mismatch at '+x+','+y);
   }}return w*h;
 }
 for(let i=0;i<specs.length;i++){
   const r=build(i),sp=r.spec,dir=path.join(ROOT,'original-industrial-hazard-wide-'+sp.slug);
   const files={'setup.json':r.json,'receipt.json':JSON.stringify(r.receipt,null,2)+'\n'};
   files['overview.png']=png(r.grid,0,0,W,H);
   for(const [name,x,y,w,h] of sp.crops)files[name+'.png']=png(r.grid,x,y,w,h);
   for(const [fn,bytes] of Object.entries(files)){
     if(fn.endsWith('.png')){checkPng(bytes,r.grid,...(fn==='overview.png'?[0,0,W,H]:sp.crops.find(c=>c[0]+'.png'===fn).slice(1))); }
     const target=path.join(dir,fn);
     if(VERIFY){if(!fs.existsSync(target)||!fs.readFileSync(target).equals(Buffer.isBuffer(bytes)?bytes:Buffer.from(bytes)))throw Error('stale '+target);}
     else {fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(target,bytes);}
   }
   const h=crypto.createHash('sha256').update(r.grid).digest('hex');
   console.log(sp.slug+' rectangles='+r.receipt.rectangles+' bytes='+r.receipt.setup_utf8_bytes+' solids='+JSON.stringify(r.receipt.solid_connectivity)+' plane_sha256='+h);
 }
}
