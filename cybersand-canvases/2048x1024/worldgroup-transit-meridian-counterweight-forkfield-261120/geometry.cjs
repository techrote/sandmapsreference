'use strict';
// NEW ORIGINAL / MERIDIAN COUNTERWEIGHT CORRIDOR / SIBLING 02
// Forkfield signal classification yard: low three-way freight switching, branching rail
// lattices, small freestanding signal platforms and four entered field-service chambers.
function buildWorld(){
const W=2048,H=1024,N=W*H,G=new Uint8Array(N),M={B:100,C:58,S:62,I:117,Z:113,Q:122,O:101,R:49};
const palette={0:[8,12,20],49:[75,91,111],58:[134,146,160],62:[168,188,203],100:[44,55,68],101:[25,36,51],113:[223,182,103],117:[105,113,137],122:[244,231,198]};
const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
const model='c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96';
const sites=[
['West embark',134,524],['Inbound rake',335,518],['High west decision',548,395],
['West relief approach',530,681],['Signal loft west',719,285],['West matrix',796,525],
['Upper tally traverse',905,396],['Fault recovery lane',940,714],
['Comparator gallery',1063,288],['Identity checkpoint',1005,521],
['Divergent central turnout',1253,524],['Deep sliplane',1281,687],
['Signal loft east',1510,286],['Upper east classification',1603,392],
['Low dispatch approach',1628,711],['East recovery signal',1821,291],
['Recovery cradle',1814,711],['East turnback',1922,527],
['Return to marshalling',337,707],['Finish west',172,520],
['Turnout actuator workface',317,929],['Bifurcation comparator',816,927],
['Shear coupling pit',1306,932],['Emergency traction bay',1775,931]];
const crops=[['overview.png',0,0,W,H],['01-west-fork-and-rake.png',28,275,535,695],
['02-west-relay-field.png',520,202,490,785],['03-comparator-interlocking.png',940,210,495,775],
['04-dispatch-divergence.png',1403,199,500,783],['05-east-recovery-turn.png',1708,230,340,774],
['06-four-entered-service-chambers.png',155,802,1762,210]];
function box(x,y,w,h,m,ink=false){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);
for(let yy=Math.max(0,y);yy<Math.min(H,y+h);yy++)for(let xx=Math.max(0,x);xx<Math.min(W,x+w);xx++){let i=yy*W+xx;if(!ink||G[i])G[i]=m}}
function beam(x1,y1,x2,y2,r,m){let dx=x2-x1,dy=y2-y1,L=dx*dx+dy*dy||1;
for(let y=Math.max(0,Math.floor(Math.min(y1,y2)-r));y<Math.min(H,Math.ceil(Math.max(y1,y2)+r));y++)for(let x=Math.max(0,Math.floor(Math.min(x1,x2)-r));x<Math.min(W,Math.ceil(Math.max(x1,x2)+r));x++){
let t=Math.max(0,Math.min(1,((x-x1)*dx+(y-y1)*dy)/L)),u=x-x1-t*dx,v=y-y1-t*dy;if(u*u+v*v<=r*r)G[y*W+x]=m}}
function hatch(x,y,w,h,spacing=11){for(let xx=x;xx<x+w;xx+=spacing)beam(xx,y,xx+Math.min(spacing,w-(xx-x)),y+h,2,M.S)}
function cavity(x,y,w,h){box(x,y,w,h,0);box(x,y,8,h,M.I);box(x+w-8,y,8,h,M.I);box(x,y, w,7,M.I);box(x,y+h-7,w,7,M.I)}
let floor=new Int16Array(W),hill=(x,c,r)=>Math.exp(-Math.pow((x-c)/r,2));
for(let x=0;x<W;x++){floor[x]=Math.round(823+9*Math.sin(x*.01)-22*hill(x,600,210)+20*hill(x,1180,240)-15*hill(x,1750,220));
for(let y=floor[x];y<H;y++)G[y*W+x]=y<floor[x]+16?M.C:(y%132<9?M.O:M.B)}
// Cut unusually wide open-window lower workshops, each separately entered via a shaft.
for(let [x,y,w,h]of [[171,847,285,145],[703,850,259,143],[1178,857,289,135],[1636,849,284,143]])cavity(x,y,w,h);
// Routing network first: east-west primary, northern classification, low recovery.
// Seven transverse service cuttings prevent visually fenced lanes and preserve fallback.
for(let [y,h]of [[361,52],[496,58],[696,60]])box(95,y,1845,h,0);
for(let x of [178,470,706,1045,1402,1726,1906])box(x-41,274,82,527,0);
for(let [x,y,w,h,c]of [[171,847,285,145,317],[703,850,259,143,816],[1178,857,289,135,1306],[1636,849,284,143,1775]]){
box(c-44,723,88,242,0);box(c-45,901,90,65,0)}
// Mechanical roadbed: three independent splitting lines with shallow, open-side cuts.
const rails=[
[130,568,362,564],[362,564,668,456],[668,456,918,464],[918,464,1165,519],
[1165,519,1471,451],[1471,451,1728,462],[1728,462,1950,564],
[130,613,510,610],[510,610,806,594],[806,594,1088,597],[1088,597,1408,576],
[1408,576,1722,603],[1722,603,1955,619],
[319,666,621,692],[621,692,854,685],[854,685,1101,657],
[1101,657,1390,697],[1390,697,1661,682],[1661,682,1914,663]];
for(let [a,b,c,d]of rails){beam(a,b,c,d,5,M.C);beam(a,b+12,c,d+12,3,M.Z)}
// Seven rooted signal interlock towers — different heights and laterally braced silhouettes.
for(let [i,x,y]of [[0,290,273],[1,624,286],[2,901,265],[3,1121,321],
[4,1412,283],[5,1640,333],[6,1903,280]]){
let lift=(i%2? -1:1);
beam(x,floor[x]-4,x,y+35,10,M.I);
beam(x,y+34,x+lift*80,y+61,9,M.C);
beam(x+lift*80,y+61,x+lift*116,y+101,6,M.S);
box(x-15,y,30,55,M.S);box(x-9,y+3,18,19,M.Q);
box(x+lift*32-11,y+42,76,8,M.Z);
for(let j=0;j<5;j++)box(x+lift*15+j*11,y+75+(j%2)*9,7,28,j%2?M.C:M.Z);
}
// Four offset signal galleries short enough NOT to become roof-level cabinet clones.
// Their bays have controllers, switchboard tongues and individually angled access struts.
for(let [x,y,d]of [[679,314,1],[1034,329,-1],[1482,310,1],[1771,334,-1]]){
beam(x,floor[x],x+d*13,y+62,14,M.C);
beam(x+d*13,y+62,x+d*109,y+62,10,M.I);
beam(x+d*13,y+62,x+d*84,y+116,8,M.S);
box(x+d*17-5,y+44,57,12,M.Z);
for(let j=0;j<5;j++)box(x+d*22+j*9,y+7+(j%2)*14,7,34,j%2?M.S:M.Q);
}
// Macro morphology: three different non-concentric fan-out matrices.
for(let [x,y,span,polarity]of [[432,578,210,1],[972,570,300,-1],[1479,588,235,1]]){
beam(x-span*.48,y-98,x+span*.48,y+73,11,M.I);
beam(x-span*.43,y+81,x+span*.5,y-72,9,M.S);
beam(x-span*.48,y+81,x+span*.5,y+81,13,M.C);
for(let j=0;j<7;j++){let xx=x-span*.38+j*(span*.75/6);
box(xx,y+48+j%3*10,12,40,j%2?M.C:M.Z);box(xx+3,y+58+j%3*10,7,13,M.Q)}
}
// Grounded track flanges and long under-rail support: absent at site-clearance shafts.
for(let x of [226,397,591,770,949,1153,1341,1535,1696,1874]){
let y=620+(x%3)*12;beam(x,floor[x],x+18,y,13,M.C);
beam(x+18,y,x+91,y+23,9,M.I);box(x-22,floor[x]-8,65,12,M.S);
}
// Four unique processing stations have explicit anchored functional transactions.
for(let [x,y,w]of [[257,746,173],[762,744,185],[1214,751,215],[1677,742,165]]){
beam(x+9,floor[x],x+9,y+12,15,M.C);beam(x+w-18,floor[x+w-18],x+w-18,y+12,12,M.S);
box(x,y+3,w,15,M.I);box(x+14,y-45,w-27,13,M.C);
for(let j=0;j<6;j++){let xx=x+17+j*(w-35)/6;box(xx,y-35+(j%3)*8,12,31,j%2?M.Z:M.S)}
}
// Entered workface 1: an indexed turnout actuator with opposed rams.
beam(185,979,237,893,13,M.C);beam(245,902,278,969,9,M.I);
for(let j=0;j<8;j++)box(190+j*29,966-j%2*24,17,21,j%2?M.Z:M.S);
box(409,904,19,72,M.Z);beam(362,975,421,928,8,M.C);
// Workface 2: six comparator blade stages and a large grounded receiver.
for(let j=0;j<6;j++){box(715+j*39,889+(j%2)*12,21,91,j%2?M.I:M.S);
box(719+j*39,896,11,9,M.Q)}box(722,979,214,14,M.C);
beam(917,979,943,914,10,M.C);
// Workface 3: toothed slip clutch plates, axial shaft, release pedal not a rotor.
box(1192,961,249,19,M.C);box(1201,911,231,16,M.I);
for(let j=0;j<8;j++)box(1211+j*29,910+(j%3)*7,14,51,j%2?M.Z:M.S);
beam(1226,981,1387,930,8,M.S);
// Workface 4: emergency traction winch and rescue hoist linkage.
beam(1657,980,1729,891,14,M.C);beam(1729,895,1880,921,10,M.I);
for(let j=0;j<7;j++)box(1712+j*26,934-(j%3)*11,16,49,j%2?M.S:M.Z);
box(1881,924,24,67,M.I);
// Dense material-specific workface notation: no decorative empty chambers.
for(let [x,y,cols]of [[202,874,9],[720,877,7],[1205,880,9],[1660,875,8]]){
for(let j=0;j<cols;j++){box(x+j*24,y,8,17,j%3?M.Z:M.Q);
beam(x+j*24,y+20,x+j*24+10,y+27,3,M.S)}
}
// Distinct high-speed navigation syntax: fork yellow, resilience ivory, underworks pale.
for(let [x,y,d] of [[336,459,1],[601,437,-1],[881,467,1],[1266,466,-1],[1534,428,1],[1844,468,-1]]){
beam(x,y,x+30*d,y-13,7,M.Z);beam(x,y,x+30*d,y+12,6,M.Q)}
for(let x of [287,608,1003,1320,1668,1888]){box(x,floor[x]-26,30,9,M.Q);box(x+7,floor[x]-43,7,18,M.Z)}
// Extra founded perimeter details to avoid silhouette monotony: short paired shutters
// and non-repeating mechanical lattice, keyed to deterministic x-position.
for(let x=130;x<1980;x+=47){let y=floor[x];box(x,y-16,12,18,M.I,true);
if(x%4===0)beam(x+9,y-19,x+19,y-27,4,M.Z);
for(let yy=y+24;yy<1020;yy+=31){box(x+6,yy,10,5,x%3?M.C:M.S,true)}}
// Deliberate final navigable cuttings: one continuous high-throughput middle lane,
// selective lower relief around the comparator, service shafts with Midge-sized access.
for(let [y,h]of [[497,65]])box(85,y,1890,h,0);
for(let x of [174,481,701,1045,1401,1730,1905])box(x-38,270,77,700,0);
for(let x of [317,816,1306,1775])box(x-40,730,81,240,0);
box(762,682,278,55,0);box(788,608,75,340,0);
// Solid-rooted spare signal gantries reconnect real overhead mechanical members
// across the yard without surrendering the large navigable interlocking voids.
for(let px of [259,605,923,1152,1490,1840]){
 beam(px,floor[px],px,277,19,M.C);
 beam(px,277,px+85,344,10,M.S);
 beam(px,floor[px]-14,px-47,587,10,M.I);
}
// Densified actual operational workfaces at the ground-supported service apron:
// every cluster has load->mechanism->control->receiving apparatus visible as material cells.
for(let [x,w,type]of [[198,212,0],[740,176,1],[1122,236,2],[1543,168,3],[1868,115,4]]){
let top=floor[x]-87;
beam(x+13,floor[x],x+13,top+15,11,M.C);
beam(x+w-18,floor[x+w-18],x+w-18,top+15,11,M.C);
box(x,top+7,w,12,M.I);box(x+17,top+58,w-34,13,M.C);
for(let j=0;j<Math.floor((w-36)/25);j++){
let xx=x+18+j*25;
box(xx,top+26+(j%3)*7,12,23,type%2?M.S:M.Z);
box(xx+5,top+20+(j%2)*9,5,13,M.Q);
}
if(type===0){beam(x+22,top+40,x+82,top-20,8,M.S);box(x+91,top+15,23,49,M.C);}
else if(type===1){box(x+40,top-12,27,69,M.I);beam(x+89,top+49,x+135,top-15,9,M.S);}
else if(type===2){beam(x+20,top+64,x+92,top-27,12,M.C);beam(x+104,top-24,x+175,top+64,9,M.I);}
else if(type===3){box(x+37,top-12,29,68,M.I);beam(x+66,top+3,x+106,top-22,10,M.S);}
else {beam(x+13,top+52,x+54,top-15,9,M.I);box(x+68,top+5,19,56,M.Z)}
}
// Four grouped signal/traffic identity slabs on existing anchored masts.
// Distinct fan-out plate motifs, not Latchreach's suspended crosshead cabinets.
for(let [x,y,dir]of [[259,327,1],[923,332,-1],[1152,319,1],[1490,334,-1]]){
box(x-21,y,45,30,M.I);box(x+dir*18,y+5,62,9,M.Z);
for(let j=0;j<4;j++){box(x+dir*18+j*12,y+17+(j%2)*6,9,23,M.S);
box(x+dir*18+j*12,y+15,8,5,M.Q)}
}
// Restore Midge-scale salvage/low-link passages around the new freight apparatus.
box(785,698,68,274,0);box(1210,681,153,63,0);
// Final explicit route windows: connect sites literally, without snapping.
for(let [name,x,y]of sites){box(x-24,y-21,49,43,0);if(y<350)box(x-28,y+15,57,130,0)}

 // Ensure spatially unsupported accents do not silently become floating material.
 const seen=new Uint8Array(N),q=new Int32Array(N);let h=0,t=0;function push(i){if(G[i]&&!seen[i]){seen[i]=1;q[t++]=i}}
 for(let x=0;x<W;x++){push(x);push((H-1)*W+x)}for(let y=0;y<H;y++){push(y*W);push(y*W+W-1)}
 while(h<t){let i=q[h++],x=i%W;if(x>0)push(i-1);if(x<W-1)push(i+1);if(i>=W)push(i-W);if(i+W<N)push(i+W)}
 let discarded=0,grounded=0;for(let i=0;i<N;i++){if(G[i]&&!seen[i]){G[i]=0;discarded++}if(G[i])grounded++}
 function reach(grid,w,hh){let S=new Uint32Array((W+1)*(H+1)),ww=W+1,free=new Uint8Array(N),mark=new Uint8Array(N),Q=new Int32Array(N),hd=0,tl=0;for(let y=1;y<=H;y++){let run=0;for(let x=1;x<=W;x++){run+=grid[(y-1)*W+x-1]?1:0;S[y*ww+x]=S[(y-1)*ww+x]+run}}let rx=w>>1,ry=hh>>1;for(let y=ry;y<H-(hh-ry-1);y++)for(let x=rx;x<W-(w-rx-1);x++){let x0=x-rx,y0=y-ry,x1=x0+w,y1=y0+hh;if(S[y1*ww+x1]-S[y1*ww+x0]-S[y0*ww+x1]+S[y0*ww+x0]===0)free[y*W+x]=1}let id=sites[0][2]*W+sites[0][1];if(free[id]){Q[tl++]=id;mark[id]=1}while(hd<tl){let i=Q[hd++],x=i%W;if(x>0&&free[i-1]&&!mark[i-1]){mark[i-1]=1;Q[tl++]=i-1}if(x+1<W&&free[i+1]&&!mark[i+1]){mark[i+1]=1;Q[tl++]=i+1}if(i>=W&&free[i-W]&&!mark[i-W]){mark[i-W]=1;Q[tl++]=i-W}if(i+W<N&&free[i+W]&&!mark[i+W]){mark[i+W]=1;Q[tl++]=i+W}}return {connected:tl,missing:sites.filter(s=>!mark[s[2]*W+s[1]]).map(s=>s[0]),free_sites:sites.filter(s=>free[s[2]*W+s[1]]).length}}
 let clear={};for(let [w,h]of [[19,15],[23,19],[31,27]])clear[w+'x'+h]=reach(G,w,h);
 const obs=[954,475,104,66],B=G.slice();for(let y=obs[1];y<obs[1]+obs[3];y++)for(let x=obs[0];x<obs[0]+obs[2];x++)B[y*W+x]=M.C;let blocked=reach(B,31,27);
 let edits=[],active=new Map(),visits=0;for(let y=0;y<H;y++){let next=new Map(),x=0;while(x<W){let m=G[y*W+x];if(!m){x++;continue}let x0=x;while(x<W&&G[y*W+x]===m)x++;let key=x0+','+(x-x0)+','+m,a=active.get(key);if(a&&a[1]+a[3]===y){a[3]++;next.set(key,a)}else{a=[x0,y,x-x0,1,m];edits.push(a);next.set(key,a)}visits+=x-x0}active=next}edits.sort((a,b)=>a[1]-b[1]||a[0]-b[0]);
 const setup={version:2,extent:[W,H],actors:[{id:1,model:'midge',hash:model,spawn:[sites[0][1],sites[0][2]],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits,response:'LA-SELECTIVE',liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:2,brush:8,fire:false};
 let histogram={};for(let m of G)histogram[m]=(histogram[m]||0)+1;
 return {W,H,N,G,sites,crops,palette,setup,grounded,discarded,edits,visits,clear,obs,blocked,histogram};
}
if(typeof module!=='undefined'&&module.exports)module.exports={buildWorld};
