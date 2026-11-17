'use strict';
/* Deterministic map-cell authoring and evidence renderer. */
const generate = function generate(){
const W=1024,H=2048,SEED=620029,A=new Uint8Array(W*H);
const M={AIR:0,STONE:13,SLATE:49,LIME:38,GRANITE:40,BRICK:43,TERRA:48,IRON:50,COPPER:53,EARTH:56,INDUSTRIAL:57,CONCRETE:58,STEEL:62,RUST:65,GRATE:66,PIPE:68,CABLE:74,HAZARD:76,CYAN:77,MAGENTA:78,AMBER:79,WHITE:80,BASALT:100,OBSIDIAN:101,RAMMED:109,BRASS:119,QUARTZ:122,GLASS:120};
let seed=SEED;function rnd(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;}
function rect(x,y,w,h,m){x=Math.floor(x);y=Math.floor(y);w=Math.ceil(w);h=Math.ceil(h);let l=Math.max(x,0),r=Math.min(x+w,W),t=Math.max(y,0),b=Math.min(y+h,H);if(l>=r||t>=b)return;for(let j=t;j<b;j++)A.fill(m,j*W+l,j*W+r);}
function poly(p,m){let ya=Math.max(0,Math.floor(Math.min(...p.map(q=>q[1])))),yb=Math.min(H-1,Math.ceil(Math.max(...p.map(q=>q[1]))));for(let y=ya;y<=yb;y++){let xs=[];for(let j=0;j<p.length;j++){let a=p[j],b=p[(j+1)%p.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let k=0;k+1<xs.length;k+=2)rect(xs[k],y,xs[k+1]-xs[k]+1,1,m);}}
function line(x0,y0,x1,y1,m,w=3){const n=Math.ceil(Math.hypot(x1-x0,y1-y0)/Math.max(1,w*.6));for(let i=0;i<=n;i++){let t=i/n;rect(x0+(x1-x0)*t-w/2,y0+(y1-y0)*t-w/2,w,w,m);}}
function disk(cx,cy,r,m){for(let y=Math.max(0,Math.ceil(cy-r));y<Math.min(H,Math.ceil(cy+r));y++){let dx=Math.sqrt(Math.max(0,r*r-(y-cy)*(y-cy)));rect(cx-dx,y,2*dx+1,1,m);}}
function ring(cx,cy,r,m,w){for(let k=0;k<180;k++){let a=k*Math.PI/90,b=(k+1)*Math.PI/90;line(cx+r*Math.cos(a),cy+r*Math.sin(a),cx+r*Math.cos(b),cy+r*Math.sin(b),m,w);}}
const rockset=new Set([M.STONE,M.SLATE,M.LIME,M.GRANITE,M.BRICK,M.TERRA,M.EARTH,M.BASALT,M.RAMMED]);
function rock(x,y,w,h,m){let l=Math.max(0,x|0),t=Math.max(0,y|0),r=Math.min(W,l+w),b=Math.min(H,t+h);for(let j=t;j<b;j++)for(let i=l;i<r;i++){let k=j*W+i;if(rockset.has(A[k]))A[k]=m;}}
const font={A:"010101111101101",B:"110101110101110",C:"011100100100011",D:"110101101101110",E:"111100110100111",F:"111100110100100",G:"011100101101011",H:"101101111101101",I:"111010010010111",J:"011001001101010",K:"101101110101101",L:"100100100100111",M:"101111111101101",N:"101111111111101",O:"010101101101010",P:"110101110100100",Q:"010101101111011",R:"110101110101101",S:"011100010001110",T:"111010010010010",U:"101101101101111",V:"101101101101010",W:"101101111111101",X:"101101010101101",Y:"101101010010010",Z:"111001010100111","0":"111101101101111","1":"010110010010111","2":"110001010100111","3":"110001010001110","4":"101101111001001","5":"111100110001110","6":"011100110101010","7":"111001010010010","8":"010101010101010","9":"010101011001110","-":"000000111000000"," ":"000000000000000"};
function label(x,y,s,m=M.CYAN,scale=2){for(const c of s){const g=font[c]||font[" "];for(let i=0;i<15;i++)if(g[i]==="1")rect(x+(i%3)*scale,y+((i/3)|0)*scale,scale,scale,m);x+=4*scale;}}
function sign(x,y,s,color){rect(x-5,y-4,12+s.length*8,24,M.STEEL);rect(x,y,8+s.length*8,15,M.OBSIDIAN);label(x+4,y+3,s,color);}
function deck(x,y,w,color=M.AMBER){rect(x,y,w,10,M.STEEL);rect(x,y+10,w,7,M.RUST);rect(x,y-4,w,4,color);for(let i=x+12;i<x+w-8;i+=32)rect(i,y+4,9,4,M.IRON);}
function truss(x1,y1,x2,y2){line(x1,y1,x2,y2,M.STEEL,6);line(x1,y1+16,x2,y2+16,M.RUST,5);let n=Math.floor(Math.hypot(x2-x1,y2-y1)/28);for(let i=0;i<n;i++){let t=i/n,s=(i+1)/n;line(x1+(x2-x1)*t,y1+(y2-y1)*t+16,x1+(x2-x1)*s,y1+(y2-y1)*s,M.COPPER,3);}}

function frame(x,y,w,h,m=M.STEEL,t=9){rect(x,y,w,t,m);rect(x,y+h-t,w,t,m);rect(x,y,t,h,m);rect(x+w-t,y,t,h,m);}
const rockL=[[0,0],[356,0],[371,90],[337,160],[378,234],[341,304],[387,365],[360,433],[402,509],[362,585],[398,657],[365,734],[393,823],[348,914],[387,996],[353,1081],[398,1159],[354,1236],[386,1307],[354,1384],[401,1461],[365,1554],[397,1637],[364,1728],[393,1813],[365,1901],[396,1988],[361,2048],[0,2048]];
poly(rockL,M.GRANITE);
for(const [y0,y1,m] of [[0,182,M.SLATE],[182,368,M.BASALT],[368,627,M.STONE],[627,876,M.SLATE],[876,1122,M.GRANITE],[1122,1350,M.BASALT],[1350,1562,M.STONE],[1562,1800,M.SLATE],[1800,2048,M.GRANITE]])for(let y=y0;y<y1;y++){let xmax=Math.min(300,280+16*Math.sin(y*.015));rect(0,y,xmax,1,m);}
poly([[982,0],[1024,0],[1024,2048],[961,2048],[940,1946],[975,1820],[929,1700],[971,1578],[925,1458],[956,1320],[917,1205],[952,1084],[923,960],[965,849],[936,725],[969,596],[931,473],[969,358],[944,247],[983,126]],M.BASALT);
for(let i=0;i<870;i++){let x=Math.floor(rnd()*337),y=Math.floor(rnd()*H),w=3+Math.floor(rnd()*32),h=1+Math.floor(rnd()*5);let k=y*W+x;if(A[k])rect(x,y,w,h,[M.GRANITE,M.SLATE,M.BASALT,M.STONE,M.QUARTZ][i%5]);}
for(let i=0;i<185;i++){let y=Math.floor(rnd()*H),x=944+Math.floor(rnd()*67);rect(x,y,12+Math.floor(rnd()*27),1+Math.floor(rnd()*7),[M.STONE,M.SLATE,M.GRANITE][i%3]);}
for(let j=0;j<22;j++){let y=45+j*90,x=277+Math.floor(rnd()*75);poly([[x-30,y],[x+10,y-11],[x+45,y+20],[x+5,y+43]],j%4?M.SLATE:M.OBSIDIAN);line(x+10,y+7,x+48,y+29,j%3?M.COPPER:M.QUARTZ,4);}
const galleries=[[36,98,306,186,"SURVEY 01"],[43,378,310,204,"CORE 02"],[30,660,318,181,"DRILL 03"],[48,933,287,201,"FOSSIL 04"],[39,1204,318,196,"STRESS 05"],[29,1493,323,207,"SEAM 06"],[42,1809,316,201,"ANCHOR 07"]];
for(let j=0;j<galleries.length;j++){const [x,y,w,h,name]=galleries[j];rect(x,y,w,h,M.IRON);rect(x+9,y+12,w-18,h-24,M.CONCRETE);rect(x+22,y+29,w-44,h-54,M.AIR);rect(x+25,y+24,w-49,5,M.RUST);rect(x+27,y+h-28,w-55,10,M.STEEL);rect(x+27,y+h-18,w-55,3,M.AMBER);for(let k=0;k<4;k++)rect(x+33+k*52,y+17,19,4,M.COPPER);sign(x+37,y+44,name);rect(x+43,y+h-90,76,47,M.IRON);rect(x+49,y+h-84,64,33,M.OBSIDIAN);for(let k=0;k<8;k++)rect(x+53+k*7,y+h-79+(k%3)*6,4,16,k%2?M.CYAN:M.AMBER);if(j%2===0){disk(x+160,y+h-64,25,M.RUST);ring(x+160,y+h-64,22,M.COPPER,5);disk(x+160,y+h-64,9,M.CYAN);}else{for(let k=0;k<5;k++){rect(x+136+k*20,y+h-76,15,38,k%2?M.STEEL:M.BASALT);rect(x+140+k*20,y+h-70,8,27,k%2?M.CYAN:M.AMBER);}}for(let k=0;k<5;k++)rect(x+52+k*38,y+h-41,18,5,k%2?M.COPPER:M.STEEL);}
ring(226,221,43,M.COPPER,6);disk(226,221,18,M.OBSIDIAN);disk(226,221,8,M.CYAN);for(let j=0;j<8;j++){let a=j*Math.PI/4;line(226+29*Math.cos(a),221+29*Math.sin(a),226+38*Math.cos(a),221+38*Math.sin(a),M.AMBER,3);}
line(152,453,254,519,M.STEEL,17);for(let i=0;i<8;i++){let t=i/8;line(145+t*108,465+t*63,167+t*107,449+t*63,M.COPPER,6);}
for(let j=0;j<5;j++){let x=138+j*28;rect(x,765,19,38,M.IRON);rect(x+4,769,10,29,j%2?M.AMBER:M.CYAN);}
for(let j=0;j<6;j++){let x=154+j*25;line(x,1041,x-9,1078,M.GRANITE,7);line(x-9,1078,x+10,1103,M.QUARTZ,6);}
for(let x of [195,266]){ring(x,1347,29,M.COPPER,6);disk(x,1347,17,M.OBSIDIAN);disk(x,1347,6,M.MAGENTA);}
ring(226,1921,48,M.COPPER,7);ring(226,1921,35,M.STEEL,5);disk(226,1921,12,M.AMBER);for(let j=0;j<12;j++){let a=j*Math.PI/6;line(226+12*Math.cos(a),1921+12*Math.sin(a),226+43*Math.cos(a),1921+43*Math.sin(a),M.IRON,4);}
for(const x of [609,645])rect(x,62,7,1918,M.STEEL);
for(let y=92;y<1972;y+=34){rect(615,y,30,5,(y%4)?M.RUST:M.AMBER);rect(607,y+3,9,4,M.COPPER);rect(643,y+3,10,4,M.COPPER);}
for(let y=132;y<1990;y+=183){rect(595,y,73,15,M.IRON);rect(601,y+3,60,5,M.CYAN);}
const pods=[[730,205,224,188,"POD A"],[710,553,246,200,"POD B"],[749,909,205,205,"POD C"],[710,1265,244,217,"POD D"],[737,1660,217,200,"POD E"]];
for(let i=0;i<pods.length;i++){const [x,y,w,h,name]=pods[i];rect(x,y,w,h,M.IRON);rect(x+9,y+9,w-18,h-18,M.INDUSTRIAL);rect(x+20,y+23,w-40,h-47,M.AIR);frame(x+10,y+10,w-20,h-20,M.STEEL,9);rect(x+27,y+h-33,w-51,9,M.BRASS);rect(x+26,y+19,w-51,5,M.COPPER);sign(x+30,y+41,name);rect(x+w-91,y+57,60,60,M.RUST);rect(x+w-85,y+63,48,49,M.OBSIDIAN);ring(x+w-62,y+87,18,M.COPPER,4);disk(x+w-62,y+87,9,i%2?M.MAGENTA:M.CYAN);for(let j=0;j<5;j++){rect(x+36+j*23,y+h-60,11,21,j%2?M.STEEL:M.BASALT);rect(x+38+j*23,y+h-55,7,12,j%2?M.AMBER:M.CYAN);}for(let j=0;j<5;j++)rect(x+34+j*30,y+14,12,3,M.QUARTZ);}
line(791,297,849,255,M.COPPER,6);ring(846,259,23,M.STEEL,4);line(839,261,865,244,M.AMBER,4);
for(let j=0;j<4;j++){rect(765+j*16,349+(j%2)*4,12,12,M.IRON);rect(768+j*16,351+(j%2)*4,7,7,M.CYAN);}
for(let j=0;j<4;j++){rect(752+j*24,705,17,27,M.IRON);rect(756+j*24,710,9,20,j%2?M.AMBER:M.CYAN);}
line(748,695,857,695,M.COPPER,6);for(let j=0;j<8;j++)rect(765+j*13,680-(j%3)*4,7,11,M.STEEL);
rect(783,1053,73,13,M.COPPER);rect(787,1020,9,44,M.STEEL);rect(845,1020,9,44,M.STEEL);disk(818,1035,24,M.IRON);ring(818,1035,19,M.AMBER,4);disk(818,1035,6,M.CYAN);
for(let j=0;j<3;j++){let x=754+j*35;rect(x,1380,28,58,M.STEEL);rect(x+5,1385,18,45,M.GLASS);line(x+12,1397,x+12,1425,j%2?M.MAGENTA:M.CYAN,4);rect(x+6,1430,16,5,M.BRASS);}
ring(811,1776,30,M.COPPER,5);disk(811,1776,10,M.OBSIDIAN);disk(811,1776,5,M.AMBER);line(840,1776,893,1748,M.CABLE,5);line(891,1748,891,1812,M.STEEL,6);for(let j=0;j<4;j++)rect(776+j*28,1812-(j%2)*9,21,11,M.BRASS);
for(let j=0;j<30;j++){let y=28+j*67,x=80+Math.floor(rnd()*140);line(x,y,x+25,y+14,j%4?M.SLATE:M.COPPER,3);line(x+25,y+14,x+13,y+38,M.OBSIDIAN,2);}
for(let j=0;j<12;j++){let y=87+j*155;for(let k=0;k<4;k++){let x=17+k*12;line(x,y+k*5,x+6,y-17+k*3,k%2?M.QUARTZ:M.COPPER,2);}}
for(let j=0;j<7;j++){let y=190+j*263;line(678,y,703,y-53,M.CABLE,4);line(703,y-53,724,y-31,M.CABLE,4);rect(699,y-56,9,9,M.AMBER);}
for(const [a,b,c,d] of [[357,145,726,205],[354,531,722,621],[345,782,747,984],[356,1266,715,1336],[349,1679,735,1757]]){truss(a,b,c,d);line(a+3,b+30,c-9,d+30,M.CABLE,4);}
truss(673,388,909,471);truss(668,831,904,796);truss(676,1190,915,1151);truss(679,1590,898,1528);
for(const [x,y,r] of [[681,367,32],[684,809,41],[671,1180,28],[686,1543,36],[690,1991,36]]){ring(x,y,r,M.BRASS,7);ring(x,y,r-10,M.IRON,4);disk(x,y,11,M.OBSIDIAN);disk(x,y,5,M.CYAN);line(x-r-20,y,x-r-6,y,M.CABLE,4);}
for(let j=0;j<10;j++){let y=120+j*195;line(958,y,980,y-20,M.STEEL,5);line(958,y+13,988,y+3,M.COPPER,3);rect(966,y,18,6,M.AMBER);}
ring(502,1050,116,M.STEEL,10);ring(502,1050,89,M.COPPER,7);for(let j=0;j<12;j++){let a=j*Math.PI/6;line(502+24*Math.cos(a),1050+24*Math.sin(a),502+106*Math.cos(a),1050+106*Math.sin(a),j%2?M.IRON:M.RUST,6);}disk(502,1050,24,M.IRON);disk(502,1050,9,M.CYAN);
for(const [x,y,w] of [[360,307,111],[673,429,86],[374,625,90],[670,857,102],[360,1176,101],[688,1211,76],[362,1449,111],[670,1600,93],[366,1744,105],[668,1946,99]])deck(x,y,w);
for(const [x,y,w,h] of galleries){let cy=y+Math.floor(h*.66);rect(x+w-55,cy-47,151,94,M.AIR);}
for(const [x,y,w,h] of pods){let cy=y+Math.floor(h*.63);rect(x-109,cy-49,164,98,M.AIR);}
rect(448,45,57,1960,M.AIR);
for(const y of [212,468,746,1033,1305,1593,1910])rect(335,y,277,46,M.AIR);
for(const y of [312,653,998,1367,1751])rect(492,y,289,52,M.AIR);
rect(0,0,11,H,M.BASALT);rect(W-11,0,11,H,M.BASALT);rect(0,2040,W,8,M.BASALT);
// Reworker B: targeted Survey Gallery service hatch. The previously isolated
// x=133,y=174 flight station now connects to the main gallery airspace without
// deleting the lower survey equipment or the station's ring landmark.
rect(126,163,100,24,M.AIR);
const spawn=[528,93];
// Intentionally placed clear-air inspection stations, not equipment or rail centres.
// Historical anchor locations and explanations are in README/evidence.
const destinations=[
["Survey Gallery",[133,174]],["Core Drill",[260,467]],["Drill Stacks",[252,739]],
["Fossil Hall",[248,1021]],["Stress Laboratory",[261,1290]],["Seam Gallery",[255,1584]],
["Anchor Winch",[263,1858]],["Pod A",[849,316]],["Pod B",[810,631]],
["Pod C",[840,982]],["Pod D",[844,1367]],["Pod E",[835,1713]],
["Ladder Mast Upper",[580,474]],["Ladder Mast Lower",[580,1485]],
["Tether Reel",[541,1027]],["Lower Exit",[517,1999]]];

const sat=new Int32Array((W+1)*(H+1));for(let y=0;y<H;y++){let s=0;for(let x=0;x<W;x++){s+=A[y*W+x]!==0?1:0;sat[(y+1)*(W+1)+x+1]=sat[y*(W+1)+x+1]+s;}}
const nav=new Uint8Array(A.length);
for(let y=7;y<H-7;y++)for(let x=9;x<W-9;x++){let x0=x-9,x1=x+10,y0=y-7,y1=y+8;let n=sat[y1*(W+1)+x1]-sat[y0*(W+1)+x1]-sat[y1*(W+1)+x0]+sat[y0*(W+1)+x0];if(n===0)nav[y*W+x]=1;}
let p=spawn[1]*W+spawn[0];if(!nav[p])throw Error("Spawn blocked, center="+A[p]);
const q=new Int32Array(A.length),seen=new Uint8Array(A.length);q[0]=p;seen[p]=1;let count=1;for(let i=0;i<count;i++){let j=q[i],x=j%W,y=(j/W)|0;for(const d of [-W,-1,1,W]){if(d===-W&&y===0||d===-1&&x===0||d===1&&x===W-1||d===W&&y===H-1)continue;let k=j+d;if(nav[k]&&!seen[k]){seen[k]=1;q[count++]=k;}}}
// Exact-centre conservative 19x15 clearance: no nearest-point search or
// distance tolerance. A blocked or disconnected destination fails the build.
const waypoints=destinations.map(([name,[x,y]])=>({
name,intended:[x,y],point:[x,y],reachable:!!seen[y*W+x],offset:0
}));
const failed=waypoints.filter(x=>!x.reachable);
if(failed.length)throw Error("Exact waypoint clearance/connectivity failure: "+JSON.stringify(failed));
const edits=[];let open=new Map();
for(let y=0;y<H;y++){let cur=new Map(),row=y*W,x=0;while(x<W){let m=A[row+x],start=x++;while(x<W&&A[row+x]===m)x++;if(!m)continue;let key=start+":"+(x-start)+":"+m,j=open.get(key);if(j!==undefined&&edits[j][1]+edits[j][3]===y){edits[j][3]++;cur.set(key,j);}else{let k=edits.length;edits.push([start,y,x-start,1,m]);cur.set(key,k);}}open=cur;}
const check=new Uint8Array(A.length);for(const [x,y,w,h,m] of edits)for(let yy=y;yy<y+h;yy++)check.fill(m,yy*W+x,yy*W+x+w);
let mismatch=0;for(let i=0;i<A.length;i++)if(A[i]!==check[i])mismatch++;if(mismatch)throw Error("reconstruction="+mismatch);
const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
const setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.5}}],next_id:2,selected:1,edits,response:"LA-SELECTIVE",liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:2,brush:8,fire:false};
const json=JSON.stringify(setup)+"\n";if(edits.length>32768||json.length>1048576)throw Error("Budget "+edits.length+", "+json.length);
const palette=new Uint8Array(256*3),colors={0:[8,12,20],13:[113,114,119],38:[187,180,157],40:[105,111,118],43:[159,95,71],48:[171,103,69],49:[61,77,96],50:[69,73,77],53:[186,114,68],56:[135,99,80],57:[94,103,115],58:[116,126,130],62:[137,148,157],65:[117,65,50],66:[81,91,100],68:[98,121,126],74:[83,70,99],76:[235,181,50],77:[52,239,220],78:[244,70,178],79:[252,179,61],80:[235,242,243],100:[49,55,66],101:[25,31,42],109:[164,119,84],119:[207,162,73],120:[75,166,180],122:[221,231,240]};
for(let i=0;i<256;i++)palette.set(colors[i]||[22,23,28],i*3);
const PW=512,PH=1024,raw=new Uint8Array((PW+1)*PH);for(let y=0;y<PH;y++){raw[y*(PW+1)]=0;for(let x=0;x<PW;x++)raw[y*(PW+1)+x+1]=A[(y*2)*W+x*2];}
function u32(n){return [(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255];}
function join(arrs){let sz=0;for(const a of arrs)sz+=a.length;let out=new Uint8Array(sz),p=0;for(const a of arrs){out.set(a,p);p+=a.length;}return out;}
const ct=new Uint32Array(256);for(let i=0;i<256;i++){let c=i;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;ct[i]=c>>>0;}
function crc(a){let c=0xffffffff;for(let i=0;i<a.length;i++)c=ct[(c^a[i])&255]^(c>>>8);return (c^0xffffffff)>>>0;}
function chunk(t,d){let a=join([Uint8Array.from([...t].map(ch=>ch.charCodeAt(0))),d]);return join([Uint8Array.from(u32(d.length)),a,Uint8Array.from(u32(crc(a)))]);}
function stored(a){let out=[Uint8Array.from([120,1])],s1=1,s2=0;for(let p=0;p<a.length;){let n=Math.min(65535,a.length-p),b=new Uint8Array(n+5);b[0]=p+n===a.length?1:0;b[1]=n&255;b[2]=n>>>8;b[3]=(~n)&255;b[4]=((~n)>>>8)&255;for(let i=0;i<n;i++){let v=a[p+i];b[i+5]=v;s1+=v;if(s1>=65521)s1-=65521;s2+=s1;if(s2>=65521)s2-=65521;}out.push(b);p+=n;}out.push(Uint8Array.from(u32(((s2<<16)|s1)>>>0)));return join(out);}
const png=join([Uint8Array.from([137,80,78,71,13,10,26,10]),chunk("IHDR",Uint8Array.from([...u32(PW),...u32(PH),8,3,0,0,0])),chunk("PLTE",palette),chunk("IDAT",stored(raw)),chunk("IEND",new Uint8Array())]);

function nativeCrop(x0,y0,w,h){
  const pixels=new Uint8Array((w+1)*h);
  for(let cy=0;cy<h;cy++){
    const offset=cy*(w+1);pixels[offset]=0;
    for(let cx=0;cx<w;cx++)pixels[offset+cx+1]=A[(y0+cy)*W+x0+cx];
  }
  return join([Uint8Array.from([137,80,78,71,13,10,26,10]),
    chunk("IHDR",Uint8Array.from([...u32(w),...u32(h),8,3,0,0,0])),
    chunk("PLTE",palette),chunk("IDAT",stored(pixels)),
    chunk("IEND",new Uint8Array())]);
}
const crops={
  "asteroid-ladder-galleries-detail-survey-core.png":nativeCrop(30,85,485,570),
  "asteroid-ladder-galleries-detail-pod-mast.png":nativeCrop(520,550,465,610),
  "asteroid-ladder-galleries-detail-lower.png":nativeCrop(20,1450,500,580)
};
const counts={};for(const x of A)counts[x]=(counts[x]||0)+1;
return {json,png,crops,stats:{source_public_id:"orbit-0006a",target:[W,H],seed:SEED,rectangles:edits.length,rectangle_budget:32768,json_bytes:json.length,json_byte_budget:1048576,material_cells_verified:A.length,material_mismatches:mismatch,clearance_envelope:[19,15],connected_clearance_centres:count,spawn,waypoints,material_counts:counts,png_dimensions:[PW,PH],png_bytes:png.length,preview_crops:[
{path:"asteroid-ladder-galleries-detail-survey-core.png",origin:[30,85],extent:[485,570],pixel_scale:"1:1"},
{path:"asteroid-ladder-galleries-detail-pod-mast.png",origin:[520,550],extent:[465,610],pixel_scale:"1:1"},
{path:"asteroid-ladder-galleries-detail-lower.png",origin:[20,1450],extent:[500,580],pixel_scale:"1:1"}
],anchor_relocations:[{"name":"Core Drill","previous":[159,515],"final":[260,467],"reason":"Lift inspection station above the solid drill rack"},{"name":"Drill Stacks","previous":[180,760],"final":[252,739],"reason":"Clear upper aisle beside the drill stack, not inside machinery"},{"name":"Fossil Hall","previous":[155,1065],"final":[248,1021],"reason":"Open exhibition airspace beside fossil and microscope cabinets"},{"name":"Stress Laboratory","previous":[160,1322],"final":[261,1290],"reason":"Clear overhead instrument inspection lane"},{"name":"Seam Gallery","previous":[155,1590],"final":[255,1584],"reason":"Clear aisle free of isolated decorative fragments"},{"name":"Anchor Winch","previous":[162,1935],"final":[263,1858],"reason":"Upper winch observation aisle above the solid wheel"},{"name":"Pod B","previous":[846,677],"final":[810,631],"reason":"Upper pod inspection aisle, above the solid lower gantry"},{"name":"Pod C","previous":[846,1016],"final":[840,982],"reason":"Unobstructed upper pod lane outside steel instrument frame"},{"name":"Pod E","previous":[833,1758],"final":[835,1713],"reason":"Upper pod aisle above crossing copper rig"},{"name":"Ladder Mast Upper","previous":[618,474],"final":[580,474],"reason":"West-side accessible ladder-platform standoff, not inside rail"},{"name":"Ladder Mast Lower","previous":[628,1485],"final":[580,1485],"reason":"West-side lower mast standoff, preserving continuous rail"}],
geometry_repairs:[{site:"Survey Gallery",kind:"service hatch",rectangle:[126,163,100,24],purpose:"Connect original exact site to principal connected flight airspace"}],
native_qualification:"NOT EXECUTED",original_reference_visual_comparison:"NOT EXECUTED: source PNG binary inaccessible"}};
};
module.exports={generate};
