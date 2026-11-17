'use strict';
/* Deterministic map-cell authoring and evidence renderer. */
const generate = function generate(){
const W=1024,H=2048,SEED=310118,A=new Uint8Array(W*H);
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
rect(0,0,W,H,M.GRANITE);
for(const [a,b,m] of [[0,160,M.BASALT],[160,355,M.GRANITE],[355,604,M.LIME],[604,812,M.RAMMED],[812,1033,M.TERRA],[1033,1217,M.LIME],[1217,1446,M.SLATE],[1446,1657,M.BASALT],[1657,1848,M.RAMMED],[1848,2048,M.GRANITE]]){rect(0,a,W,b-a,m);rock(0,a+8,W,3,M.OBSIDIAN);}
poly([[338,0],[667,0],[688,145],[652,255],[712,456],[665,641],[716,811],[664,1027],[690,1241],[635,1454],[704,1616],[658,1833],[692,2048],[318,2048],[294,1840],[354,1660],[317,1471],[365,1278],[304,1050],[356,858],[303,661],[350,452],[312,222]],M.AIR);
const bays=[
 [47,82,302,238,"CATALOG 01","L"],[705,52,273,214,"INTAKE","R"],
 [56,398,300,224,"SLATE PRESS","L"],[700,340,271,304,"INDEX 02","R"],
 [63,744,297,269,"PAPYRUS","L"],[704,798,273,232,"STACK 03","R"],
 [43,1108,313,228,"FILM 04","L"],[692,1155,289,211,"RESTORE","R"],
 [47,1492,308,258,"REEL HALL","L"],[704,1502,276,291,"SEALED 05","R"],
 [53,1854,319,177,"VAULT 06","L"],[700,1876,282,166,"MEMORY","R"]
];
for(let j=0;j<bays.length;j++){
 const [x,y,w,h,name,side]=bays[j];
 rect(x,y,w,h,M.INDUSTRIAL);rect(x+9,y+11,w-18,h-22,M.CONCRETE);rect(x+22,y+29,w-44,h-54,M.AIR);
 rect(x+18,y+20,w-36,6,M.RUST);rect(x+20,y+h-32,w-40,11,M.STEEL);rect(x+20,y+h-21,w-40,4,M.BRASS);
 sign(x+29,y+42,name,j%2?M.AMBER:M.CYAN);
 let rackY=y+95,rackH=Math.min(56,h-128);
 for(let k=0;k<3;k++){if(side==="L"&&k===2||side==="R"&&k===0)continue;
 let q=x+36+k*73;rect(q,rackY,51,rackH,M.RUST);rect(q+4,rackY+4,43,rackH-8,M.OBSIDIAN);
 for(let row=0;row<3;row++){rect(q+6,rackY+8+row*15,38,3,M.COPPER);for(let c=0;c<4;c++)rect(q+8+c*9,rackY+12+row*15,5,9,(c+row+j)%3===0?M.CYAN:(c+j)%2?M.TERRA:M.LIME);}}
 if(j%3===0){disk(x+71,y+h-57,22,M.IRON);disk(x+71,y+h-57,12,M.BRASS);disk(x+71,y+h-57,4,M.CYAN);}
 if(j%3===1){rect(x+w-109,y+h-85,76,49,M.IRON);rect(x+w-102,y+h-78,61,33,M.OBSIDIAN);for(let k=0;k<5;k++)rect(x+w-95+k*12,y+h-74+(k%3)*3,5,19,k%2?M.AMBER:M.CYAN);}
 if(j%3===2){for(let k=0;k<4;k++){let q=x+52+k*34;line(q,y+h-39,q,y+h-76-(k%2)*15,M.PIPE,4);rect(q-5,y+h-85-(k%2)*15,13,9,M.BRASS);}}
 for(let q=x+37;q<x+w-20;q+=31)rect(q,y+16,13,4,M.COPPER);
 for(let q=x+40;q<x+w-20;q+=44)rect(q,y+h-43,6,8,M.CYAN);
}
for(const [x,y,w] of [[260,278,201],[563,575,163],[253,959,171],[570,1279,172],[251,1659,190],[578,1820,160]])deck(x,y,w,y%2?M.CYAN:M.AMBER);
truss(326,376,468,443);truss(579,753,696,678);truss(318,1437,430,1501);truss(573,1723,714,1653);
for(let x of [485,545]){for(const [a,b] of [[0,436],[492,842],[914,1239],[1515,1855]]){rect(x,a,4,b-a,M.CABLE);for(let y=a+37;y<b-10;y+=76)rect(x-7,y,18,7,M.IRON);}}
for(const [x,y,r] of [[515,258,24],[515,604,31],[513,944,24],[503,1208,28],[525,1750,20]]){ring(x,y,r,M.COPPER,5);disk(x,y,Math.floor(r*.42),M.OBSIDIAN);disk(x,y,Math.floor(r*.2),M.CYAN);line(x-57,y,x-r-8,y,M.CABLE,3);line(x+r+8,y,x+58,y,M.CABLE,3);}
let CX=509,CY=1440,R=104;ring(CX,CY,R,M.BRASS,12);ring(CX,CY,R-23,M.IRON,7);for(let k=0;k<12;k++){let t=k*2*Math.PI/12;line(CX+23*Math.cos(t),CY+23*Math.sin(t),CX+(R-11)*Math.cos(t),CY+(R-11)*Math.sin(t),k%2?M.RUST:M.COPPER,7);}disk(CX,CY,24,M.IRON);disk(CX,CY,11,M.AMBER);rect(CX-20,CY-R-16,55,27,M.AIR);rect(CX+R-14,CY+13,27,42,M.AIR);
for(let i=0;i<11;i++){let x=i%2?682:334,y=110+i*166;line(x,y,x+(i%2?19:-20),y+45,M.CABLE,3);rect(x-5,y,14,7,M.AMBER);}
for(let i=0;i<1050;i++){let x=i%2?Math.floor(rnd()*290):731+Math.floor(rnd()*293),y=Math.floor(rnd()*H);rock(x,y,10+Math.floor(rnd()*51),i%6===0?5:2,[M.LIME,M.SLATE,M.GRANITE,M.TERRA,M.RAMMED,M.BASALT,M.COPPER,M.QUARTZ][i%8]);}
for(let i=0;i<150;i++){let x=i%2?Math.floor(rnd()*226):796+Math.floor(rnd()*220),y=Math.floor(rnd()*H);rock(x,y,3+(i%5),20+Math.floor(rnd()*58),i%4?M.OBSIDIAN:M.QUARTZ);}
for(let i=0;i<110;i++){let b=bays[i%bays.length];rect(b[0]+27+Math.floor(rnd()*(b[2]-89)),b[1]+b[3]-20,6+(i%3)*3,3,i%7?M.COPPER:M.AMBER);}
rect(755,1807,176,7,M.STEEL);for(let x=770;x<920;x+=29){rect(x,1837,16,8,M.GLASS);rect(x+4,1838,8,5,M.CYAN);}

// SECOND VISUAL PASS: twelve materially distinct archival installations.
// These objects remain part of the authored material grid, never composited art.
// Catalog room: rotating indexed folio and asymmetric illuminated cabinet.
ring(113,247,27,M.COPPER,5);disk(113,247,9,M.AMBER);
for(let i=0;i<9;i++){let a=i*Math.PI*2/9;line(113+17*Math.cos(a),247+17*Math.sin(a),113+25*Math.cos(a),247+25*Math.sin(a),M.CYAN,3);}
rect(174,233,25,19,M.IRON);rect(179,237,15,10,M.AMBER);
// Intake: tall scanning arch and barcode gantry instead of ordinary shelves.
rect(750,119,7,89,M.BRASS);rect(756,119,95,7,M.BRASS);rect(847,119,7,86,M.BRASS);
for(let i=0;i<8;i++)rect(764+i*9,130,2,49,i%2?M.CYAN:M.COPPER);
rect(768,206,84,5,M.STEEL);
// Slate press: substantial two-column press with compression platen.
rect(97,483,11,92,M.IRON);rect(175,483,11,92,M.IRON);rect(100,478,87,13,M.COPPER);
rect(109,512,64,10,M.RUST);rect(118,523,46,40,M.SLATE);rect(111,574,72,10,M.BRASS);
for(let j=0;j<4;j++)rect(122+j*12,544,7,5,M.AMBER);
// Index hall: sloped ascending storage ladder.
for(let i=0;i<7;i++){let x=727+i*10,y=492-i*11;rect(x,y,9,60+i*8,M.IRON);rect(x+2,y+4,5,8,i%2?M.AMBER:M.CYAN);}
line(714,587,810,471,M.COPPER,4);
// Papyrus chamber: hanging analogue film ribbons, scroll barrels.
for(let i=0;i<9;i++){let x=92+i*12;rect(x,847+(i%3)*10,5,75-(i%4)*9,i%2?M.BRASS:M.COPPER);rect(x-3,842+(i%3)*10,12,6,M.IRON);}
disk(148,967,23,M.IRON);disk(148,967,11,M.GLASS);
// Stack 03: a deeper multilevel vertical vault stack.
rect(727,857,12,108,M.STEEL);rect(778,852,12,113,M.STEEL);
for(let j=0;j<5;j++){rect(734,862+j*20,46,4,M.COPPER);for(let i=0;i<4;i++)rect(739+i*10,868+j*20,7,12,(i+j)%3?M.TERRA:M.CYAN);}
// Film archive: twin media reels and their readable connecting tape.
for(const x of [112,174]){ring(x,1254,27,M.COPPER,6);disk(x,1254,9,M.CYAN);for(let j=0;j<6;j++){let a=j*Math.PI/3;line(x,1254,x+24*Math.cos(a),1254+24*Math.sin(a),M.IRON,3);}}
line(112,1228,174,1228,M.RUST,3);line(112,1281,174,1281,M.RUST,3);
rect(103,1302,95,8,M.STEEL);
// Restore: backlit specimen vitrine and vent tubing.
rect(732,1228,67,82,M.STEEL);rect(739,1235,53,67,M.GLASS);
for(let j=0;j<4;j++){rect(747+j*10,1249+(j%2)*11,7,31,M.CYAN);}
line(768,1233,768,1204,M.PIPE,4);rect(759,1203,22,9,M.BRASS);
// Reel side hall: offset spool recorder and tall blue monitor.
rect(91,1585,50,113,M.IRON);rect(99,1593,35,67,M.OBSIDIAN);
for(let j=0;j<9;j++)rect(103+j*3,1599+(j%4)*10,2,29,j%2?M.CYAN:M.AMBER);
ring(165,1705,28,M.COPPER,7);disk(165,1705,10,M.CYAN);
// Sealed archive: multiple independently framed glass cells.
for(let i=0;i<3;i++){let x=731+i*33;rect(x,1642,28,87,M.IRON);rect(x+5,1648,18,71,M.GLASS);rect(x+9,1660+(i%2)*12,9,31,M.CYAN);rect(x+5,1720,18,6,M.BRASS);}
// Lower vault: broken segmented sarcophagus casing.
rect(84,1928,107,60,M.RUST);rect(92,1936,91,45,M.OBSIDIAN);
for(let j=0;j<6;j++)rect(98+j*14,1941,8,34,j%3?M.GRANITE:M.BRASS);
rect(92,1978,89,7,M.CYAN);
// Memory: staggered copper image tubes and elevated pointer strip.
for(let i=0;i<5;i++){let x=723+i*17,y=1935+(i%2)*11;rect(x,y,10,50,M.IRON);rect(x+2,y+3,6,35,i%3?M.AMBER:M.CYAN);}
rect(724,1995,102,5,M.BRASS);
// Interstitial reinforcement arches and archive lifts, offset rather than repeated.
truss(356,1111,472,1077);truss(552,1543,665,1517);
deck(415,1045,112,M.CYAN);deck(555,1870,92,M.AMBER);
rect(395,823,11,75,M.STEEL);rect(397,831,7,51,M.COPPER);
for(let j=0;j<5;j++)rect(390,838+j*10,20,4,M.AMBER);

rect(0,0,13,H,M.BASALT);rect(W-13,0,13,H,M.BASALT);rect(0,2036,W,12,M.BASALT);
// Final playability-focused portal repair. Does not alter room dressing other than the doorway plane.
for(const [x,y,w,h,name,side] of bays){let cy=y+Math.floor(h*.65);if(side==="L")rect(x+w-52,cy-47,132,94,M.AIR);else rect(x-82,cy-47,137,94,M.AIR);}
// Two narrow open ventilation routes through shaft maintain continuity around the large mechanical reel.
// Open continuous walking/flying aisles through otherwise obstructive right-hand storage racks.
for(const j of [5,7,9,11]){const [x,y,w,h]=bays[j],cy=y+Math.floor(h*.65);rect(x+48,cy-18,w-76,41,M.AIR);}
rect(366,19,35,2009,M.AIR);rect(631,19,35,2009,M.AIR);
rect(503,79,30,63,M.AIR);for(const yy of [184,482,871,1115,1574,1895])rect(400,yy,254,49,M.AIR);const spawn=[518,107];
const destinations=[
["Upper Intake",[833,194]],["Catalog 01",[225,257]],["Shaft Upper",[516,314]],
["Slate Press",[223,569]],["Index 02",[811,572]],["Mnemonic Beacon",[516,697]],
["Papyrus Gallery",[223,917]],["Stack 03",[815,944]],["Shaft Central",[516,1086]],
["Film 04",[214,1267]],["Restoration",[828,1301]],["Reel Approach",[397,1366]],
["Reel Hall",[217,1660]],["Sealed 05",[828,1724]],["Lower Vault",[239,1960]],
["Memory Chamber",[835,1984]],["Lower Transit",[525,1971]]
];
const sat=new Int32Array((W+1)*(H+1));for(let y=0;y<H;y++){let s=0;for(let x=0;x<W;x++){s+=A[y*W+x]!==0?1:0;sat[(y+1)*(W+1)+x+1]=sat[y*(W+1)+x+1]+s;}}
const nav=new Uint8Array(A.length);
for(let y=7;y<H-7;y++)for(let x=9;x<W-9;x++){let x0=x-9,x1=x+10,y0=y-7,y1=y+8;let n=sat[y1*(W+1)+x1]-sat[y0*(W+1)+x1]-sat[y1*(W+1)+x0]+sat[y0*(W+1)+x0];if(n===0)nav[y*W+x]=1;}
let p=spawn[1]*W+spawn[0];if(!nav[p])throw Error("Spawn blocked, center="+A[p]);
const q=new Int32Array(A.length),seen=new Uint8Array(A.length);q[0]=p;seen[p]=1;let count=1;for(let i=0;i<count;i++){let j=q[i],x=j%W,y=(j/W)|0;for(const d of [-W,-1,1,W]){if(d===-W&&y===0||d===-1&&x===0||d===1&&x===W-1||d===W&&y===H-1)continue;let k=j+d;if(nav[k]&&!seen[k]){seen[k]=1;q[count++]=k;}}}
const waypoints=[];
for(const [name,[x,y]] of destinations){let best=null,d2=1e9;for(let dy=-99;dy<=99;dy+=3)for(let dx=-99;dx<=99;dx+=3){let xx=x+dx,yy=y+dy;if(xx<10||yy<8||xx>=W-10||yy>=H-8)continue;let dd=dx*dx+dy*dy;if(dd>=d2)continue;if(seen[yy*W+xx]){d2=dd;best=[xx,yy];}}waypoints.push({name,intended:[x,y],reachable:!!best,point:best,offset:best?Math.round(Math.sqrt(d2)):null});}
const failed=waypoints.filter(x=>!x.reachable||x.offset>105);if(failed.length)throw Error("Waypoints "+JSON.stringify(failed));
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
const counts={};for(const x of A)counts[x]=(counts[x]||0)+1;
return {json,png,stats:{source_public_id:"techn-0031a",target:[W,H],seed:SEED,rectangles:edits.length,rectangle_budget:32768,json_bytes:json.length,json_byte_budget:1048576,material_cells_verified:A.length,material_mismatches:mismatch,clearance_envelope:[19,15],connected_clearance_centres:count,spawn,waypoints,material_counts:counts,png_dimensions:[PW,PH],png_bytes:png.length,native_qualification:"NOT EXECUTED",original_reference_visual_comparison:"NOT EXECUTED: source PNG binary inaccessible"}};
};
module.exports={generate};
