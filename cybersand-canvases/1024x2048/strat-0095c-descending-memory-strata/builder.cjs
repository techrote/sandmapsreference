'use strict';
// Deterministic CyberSand Setup-v2 material-cell construction for Descending Memory Strata.
function generate(){
const W=1024,H=2048,SEED=951371,A=new Uint8Array(W*H);
const M={AIR:0,STONE:38,GRANITE:40,SLATE:49,IRON:50,COPPER:53,INDUSTRIAL:57,CONCRETE:58,STEEL:62,RUST:65,GRATE:66,PIPE:68,CABLE:74,HAZARD:76,CYAN:77,MAGENTA:78,AMBER:79,WHITE:80,BASALT:100,OBSIDIAN:101,BRASS:119,GLASS:120,QUARTZ:122};
let seed=SEED;function rnd(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;}
function rect(x,y,w,h,m){x=Math.floor(x);y=Math.floor(y);w=Math.ceil(w);h=Math.ceil(h);let l=Math.max(x,0),r=Math.min(x+w,W),t=Math.max(y,0),b=Math.min(y+h,H);if(l>=r||t>=b)return;for(let j=t;j<b;j++)A.fill(m,j*W+l,j*W+r);}
function poly(p,m){let ya=Math.max(0,Math.floor(Math.min(...p.map(q=>q[1])))),yb=Math.min(H-1,Math.ceil(Math.max(...p.map(q=>q[1]))));for(let y=ya;y<=yb;y++){let xs=[];for(let j=0;j<p.length;j++){let a=p[j],b=p[(j+1)%p.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let k=0;k+1<xs.length;k+=2)rect(xs[k],y,xs[k+1]-xs[k]+1,1,m);}}
function line(x0,y0,x1,y1,m,w=3){const n=Math.ceil(Math.hypot(x1-x0,y1-y0)/Math.max(1,w*.6));for(let i=0;i<=n;i++){let t=i/n;rect(x0+(x1-x0)*t-w/2,y0+(y1-y0)*t-w/2,w,w,m);}}
function disk(cx,cy,r,m){for(let y=Math.max(0,Math.ceil(cy-r));y<Math.min(H,Math.ceil(cy+r));y++){let dx=Math.sqrt(Math.max(0,r*r-(y-cy)*(y-cy)));rect(cx-dx,y,2*dx+1,1,m);}}
function ring(cx,cy,r,m,w){for(let k=0;k<180;k++){let a=k*Math.PI/90,b=(k+1)*Math.PI/90;line(cx+r*Math.cos(a),cy+r*Math.sin(a),cx+r*Math.cos(b),cy+r*Math.sin(b),m,w);}}
function frame(x,y,w,h,m=M.STEEL,t=9){rect(x,y,w,t,m);rect(x,y+h-t,w,t,m);rect(x,y,t,h,m);rect(x+w-t,y,t,h,m);}
function deck(x,y,w){rect(x,y,w,9,M.STEEL);rect(x,y+9,w,6,M.RUST);rect(x,y-4,w,4,M.AMBER);for(let i=x+9;i<x+w-6;i+=29)rect(i,y+3,11,3,M.IRON);}
function truss(x1,y1,x2,y2){line(x1,y1,x2,y2,M.STEEL,6);line(x1,y1+15,x2,y2+15,M.RUST,5);let n=Math.max(1,Math.floor(Math.hypot(x2-x1,y2-y1)/27));for(let j=0;j<n;j++){let t=j/n,u=(j+1)/n;line(x1+(x2-x1)*t,y1+(y2-y1)*t+15,x1+(x2-x1)*u,y1+(y2-y1)*u,M.COPPER,2);}}
const font={A:'010101111101101',B:'110101110101110',C:'011100100100011',D:'110101101101110',E:'111100110100111',F:'111100110100100',G:'011100101101011',H:'101101111101101',I:'111010010010111',J:'011001001101010',K:'101101110101101',L:'100100100100111',M:'101111111101101',N:'101111111111101',O:'010101101101010',P:'110101110100100',Q:'010101101111011',R:'110101110101101',S:'011100010001110',T:'111010010010010',U:'101101101101111',V:'101101101101010',W:'101101111111101',X:'101101010101101',Y:'101101010010010',Z:'111001010100111','0':'111101101101111','1':'010110010010111','2':'110001010100111','3':'110001010001110','4':'101101111001001','5':'111100110001110','6':'011100110101010','7':'111001010010010','8':'010101010101010','9':'111101111001111','-':'000000111000000',' ':'000000000000000'};
function label(x,y,s,m=M.CYAN,scale=2){for(const c of s){let g=font[c]||font[' '];for(let i=0;i<15;i++)if(g[i]==='1')rect(x+(i%3)*scale,y+((i/3)|0)*scale,scale,scale,m);x+=4*scale;}}
function sign(x,y,s){rect(x-5,y-5,12+s.length*8,23,M.STEEL);rect(x,y,7+s.length*8,13,M.OBSIDIAN);label(x+3,y+2,s,M.CYAN,2);}
// DESCENDING MEMORY STRATA — archaeological vertical cutaway. Designed as real 2D terrain.
// A tectonic cleft separates two unequal escarpments. Horizontal strata repeatedly expose
// ancient ceramic archive terraces, fossil vaults, survey niches and broken memory engines.
// Fix geological epoch bands: never use their upper-Y boundary as a material ID.
// Use immobile LimestoneBlock 38 instead of mobile Stone powder 13.
const MATERIAL_ID_WHITELIST=new Set(Object.values(M));
const bands=[
 [0,237,M.GRANITE,M.STONE,M.QUARTZ],
 [237,506,M.RUST,M.BASALT,M.AMBER],
 [506,779,M.STONE,M.SLATE,M.WHITE],
 [779,1083,M.GRANITE,M.COPPER,M.BRASS],
 [1083,1354,M.BASALT,M.OBSIDIAN,M.MAGENTA],
 [1354,1652,M.SLATE,M.QUARTZ,M.CYAN],
 [1652,1887,M.RUST,M.GRANITE,M.AMBER],
 [1887,2048,M.BASALT,M.IRON,M.WHITE]
];
function leftEdge(y){return 328+28*Math.sin(y*.021)+15*Math.sin(y*.051)+23*Math.sin(y*.007+1);}
function rightEdge(y){return 688+27*Math.sin(y*.018+1.1)+15*Math.sin(y*.042)+22*Math.sin(y*.009);}
// Seam bands: base rock, with curved stratification and substantially different ages.
for(let y=0;y<H;y++){
 let b=bands.find(z=>y>=z[0]&&y<z[1]);
 let le=Math.max(255,Math.min(404,Math.round(leftEdge(y)))), re=Math.max(617,Math.min(778,Math.round(rightEdge(y))));
 let wav=Math.sin(y*.115)*2+Math.sin(y*.026)*9;
 let main=((y-b[0])%43<4)?b[3]:b[2];
 rect(0,y,le+1,1,main);rect(re,y,W-re,1,main);
 if((y+Math.round(wav))%31<3){rect(0,y,Math.min(100,le),1,b[3]);rect(re+11,y,W-re-11,1,b[3]);}
}
// Geological lateral striations and boudinage: texture is painted INSIDE rock only.
function mineralVein(x,y,len,m){for(let i=0;i<len;i+=3){let xx=x+i,yy=y+Math.round(Math.sin(i*.073+y*.05)*4);if(xx>12&&xx<W-12&&A[yy*W+xx]!==0)rect(xx,yy,4,2,m);}}
for(let i=0;i<1000;i++){
 let y=Math.floor(rnd()*H), side=i%2;
 let x=side?Math.floor(740+rnd()*257):Math.floor(rnd()*270), len=6+Math.floor(rnd()*68);
 let m=[M.STONE,M.SLATE,M.GRANITE,M.QUARTZ,M.RUST,M.BASALT,M.OBSIDIAN][(i+Math.floor(y/255))%7];
 mineralVein(x,y,len,m);
}
// Across eight ages, wedge-shaped tectonic thrusts and oxide lenses, always grounded in rock.
for(let i=0;i<28;i++){
 let y=55+i*70, x=75+Math.floor(rnd()*140), d=26+Math.floor(rnd()*46);
 poly([[x,y],[x+d,y-12],[x+d+29,y+5],[x+15,y+22]],i%3===0?M.QUARTZ:M.SLATE);
 let xr=842+Math.floor(rnd()*80);poly([[xr,y],[xr+50,y-5],[xr+31,y+19],[xr-6,y+34]],i%3?M.COPPER:M.AMBER);
}
// A persistent hairline fault, mineral seams, and massive lower rock pillars.
for(let i=0;i<8;i++){
 let y=120+i*251;
 for(let z=0;z<8;z++){
  let x=80+Math.floor(rnd()*170);line(x,y+z*8,x+26+Math.floor(rnd()*30),y+z*8+9,M.OBSIDIAN,2);
  let xr=815+Math.floor(rnd()*100);line(xr,y+z*7,xr-15,y+z*7+14,M.QUARTZ,2);
 }
}
// Deeply incised terraced voids, each epoch has unequal widths and floor silhouettes.
const leftRooms=[
 {x:31,y:77,w:308,h:183,name:'CAPSTONE',tone:M.WHITE},
 {x:24,y:356,w:337,h:173,name:'AMBER',tone:M.AMBER},
 {x:42,y:606,w:301,h:182,name:'TABLETS',tone:M.WHITE},
 {x:39,y:895,w:336,h:216,name:'REEL 04',tone:M.BRASS},
 {x:28,y:1197,w:325,h:188,name:'OBSIDIAN',tone:M.MAGENTA},
 {x:34,y:1457,w:311,h:193,name:'QUARTZ',tone:M.CYAN},
 {x:24,y:1763,w:333,h:193,name:'CENOTAPH',tone:M.AMBER}
];
const rightRooms=[
 {x:709,y:143,w:276,h:195,name:'SIGIL',tone:M.WHITE},
 {x:712,y:476,w:286,h:192,name:'LAPIDARY',tone:M.AMBER},
 {x:702,y:796,w:284,h:220,name:'INDEX',tone:M.BRASS},
 {x:719,y:1163,w:267,h:212,name:'ECHO',tone:M.MAGENTA},
 {x:708,y:1520,w:282,h:194,name:'SENTINEL',tone:M.CYAN},
 {x:711,y:1811,w:277,h:202,name:'TERMINUS',tone:M.WHITE}
];
function archRoom(r,index,side){
 let {x,y,w,h,name,tone}=r;
 // chisel-cut stepped cave cavity; stone lintel and asymmetric sides.
 poly([[x+16,y+34],[x+58,y+10],[x+w-59,y+10],[x+w-12,y+38],[x+w-8,y+h-33],[x+w-39,y+h-13],[x+28,y+h-13],[x+5,y+h-40]],M.OBSIDIAN);
 poly([[x+22,y+39],[x+65,y+19],[x+w-69,y+19],[x+w-22,y+42],[x+w-22,y+h-40],[x+w-46,y+h-27],[x+37,y+h-27],[x+21,y+h-44]],M.AIR);
 // pale ceramic masonry sunk into the rock, with red or gold seam detail.
 line(x+35,y+39,x+69,y+19,M.WHITE,5);rect(x+69,y+18,w-142,5,M.STONE);
 line(x+w-69,y+19,x+w-35,y+40,M.WHITE,5);
 rect(x+34,y+h-35,w-69,7,M.GRANITE);rect(x+40,y+h-28,w-78,5,tone);
 // Inlaid wall reliefs; rectangular 2D front-facing tablets, not faux perspective.
 for(let k=0;k<3;k++){
  let xx=x+46+k*48;rect(xx,y+55,32,46,M.GRANITE);rect(xx+4,y+59,24,35,M.SLATE);
  for(let j=0;j<4;j++)rect(xx+8+(j%2)*3,y+66+j*7,14-3*(j%2),2,k%2?tone:M.QUARTZ);
  rect(xx+3,y+54,26,3,M.QUARTZ);
 }
 // Outside exit/arch is deliberately left clear at the face near central rift.
 let cx=side==='left'?x+w-38:x+38;
 let cy=y+Math.floor(h*.57);
 // label embedded in the rock overhead, not blocking the actor corridor.
 label(x+39,y+33,name,tone,2);
 // Age-specific geological trim / carved friezes.
 for(let k=0;k<6;k++){
  let xx=x+43+k*38;
  line(xx,y+h-51,xx+10,y+h-43,k%2?M.COPPER:M.QUARTZ,2);
 }
 // each room face has a broken outer arch, portal opened later.
 let sideX=side==='left'?x+w-14:x+7;
 rect(sideX,cy-28,13,56,M.AIR);
}
leftRooms.forEach((r,i)=>archRoom(r,i,'left'));rightRooms.forEach((r,i)=>archRoom(r,i,'right'));
// Highly distinct epoch-specific artifacts. Keep them in-room and outside traversal lanes.
// CAPSTONE: an enormous fossil ammonite spiral, fracture markers and projecting ribs.
for(let t=0;t<155;t++){
 let a=t*.142, rad=4+t*.31;
 let px=242+rad*Math.cos(a),py=197+rad*Math.sin(a);
 rect(px,py,3,3,t%13?M.QUARTZ:M.WHITE);
}
for(let j=0;j<7;j++){let x=108+j*24;line(x,235,x-13,248,M.WHITE,4);}
// AMBER: suspended resin cells, dark inclusions, a descending gold hairline.
for(let k=0;k<9;k++){
 let x=112+(k%3)*34,y=437+Math.floor(k/3)*23;
 poly([[x,y],[x+11,y-4],[x+17,y+7],[x+13,y+20],[x-5,y+16]],M.COPPER);
 rect(x+2,y+5,6,8,M.OBSIDIAN);
}
// TABLETS: a tiered amphitheatre of 22 inscribed white stone steles.
for(let k=0;k<12;k++){
 let x=76+k*19,y=700+Math.round(Math.sin(k*.7)*9);
 rect(x,y,14,44,M.WHITE);rect(x+3,y+4,8,34,M.STONE);
 for(let v=0;v<4;v++)rect(x+5,y+8+v*7,4,2,M.SLATE);
}
// REEL 04: giant mechanically broken memory disk and broken ring segment.
ring(218,1024,74,M.BRASS,7);ring(218,1024,59,M.IRON,4);ring(218,1024,33,M.COPPER,4);disk(218,1024,17,M.SLATE);
for(let k=0;k<12;k++){
 let a=k*Math.PI/6;line(218+35*Math.cos(a),1024+35*Math.sin(a),218+68*Math.cos(a),1024+68*Math.sin(a),k%2?M.COPPER:M.WHITE,4);
}
// OBSIDIAN: deep purple stone, a relict glass well and charcoal orthogonal inscriptions.
for(let k=0;k<5;k++){
 let x=91+k*35;poly([[x,1320],[x+17,1271],[x+33,1320]],k%2?M.MAGENTA:M.QUARTZ);
 line(x+10,1313,x+19,1284,M.OBSIDIAN,3);
}
// QUARTZ: white and cyan crystal fan with symmetry broken by isolated fins.
for(let k=0;k<10;k++){
 let x=67+k*25,h=21+(k*23%43);
 poly([[x,1607],[x+7,1607-h],[x+16,1608]],k%3?M.QUARTZ:M.CYAN);
}
// CENOTAPH: tall red ochre draped slab plus ring-shaped burial markers.
rect(94,1838,36,102,M.BASALT);rect(101,1845,22,87,M.RUST);rect(106,1860,12,49,M.AMBER);
for(let k=0;k<5;k++){let x=166+k*27;ring(x,1905+(k%2)*11,12,k%2?M.QUARTZ:M.BRASS,3);}
// RIGHT SIGIL: etched pale rectilinear memorial, direct frontal geometry.
ring(852,248,58,M.WHITE,7);ring(852,248,40,M.STONE,4);
for(let k=0;k<12;k++){let a=k*Math.PI/6;line(852+39*Math.cos(a),248+39*Math.sin(a),852+53*Math.cos(a),248+53*Math.sin(a),M.AMBER,3);}
// LAPIDARY: aligned mineral slabs and brass chisel working bench.
for(let k=0;k<5;k++){let x=774+k*30;rect(x,575-(k%2)*13,23,51,M.GRANITE);rect(x+3,575-(k%2)*13,17,39,k%2?M.AMBER:M.WHITE);}
// INDEX: marble matrix and hanging paper-like stone registers.
for(let k=0;k<9;k++){
 let x=745+(k%3)*45,y=872+Math.floor(k/3)*35;
 rect(x,y,35,30,M.WHITE);rect(x+4,y+4,26,22,M.SLATE);
 for(let j=0;j<4;j++)rect(x+8,y+7+j*5,17,2,j===2?M.COPPER:M.QUARTZ);
}
// ECHO: dark acoustic cones, each with concentric mineral interference rings.
for(let k=0;k<3;k++){
 let x=780+k*56;ring(x,1272,22,M.MAGENTA,4);disk(x,1272,11,M.OBSIDIAN);disk(x,1272,4,M.WHITE);
 line(x-20,1303,x+20,1303,M.COPPER,3);
}
// SENTINEL: quartz resonator fences, white pillars and cyan captured trace.
for(let k=0;k<7;k++){
 let x=751+k*26;rect(x,1622,13,56,M.QUARTZ);rect(x+3,1628,7,43,k%2?M.CYAN:M.STONE);
}
// TERMINUS: sealed ancient roll-reader, monumental one-off ring wheel.
ring(854,1937,49,M.BRASS,6);ring(854,1937,32,M.WHITE,4);disk(854,1937,10,M.OBSIDIAN);disk(854,1937,5,M.AMBER);
for(let k=0;k<8;k++){let a=k*Math.PI/4;line(854+15*Math.cos(a),1937+15*Math.sin(a),854+44*Math.cos(a),1937+44*Math.sin(a),M.STONE,3);}
// Broken archaeological terraces point into the central void. Completely flat side elevation.
function shelf(x,y,w,alt=0){
 rect(x,y,w,11,M.STONE);rect(x,y+11,w,8,M.GRANITE);rect(x,y-4,w,4,alt?M.QUARTZ:M.COPPER);
 for(let k=9;k<w-9;k+=31){rect(x+k,y+12,7,9,M.SLATE);rect(x+k,y-8,14,3,M.WHITE);}
}
const shelfSpecs=[
 [285,289,166,0],[634,404,110,1],[296,553,119,1],[623,700,130,0],
 [299,832,158,1],[618,1091,128,1],[298,1168,153,0],[620,1431,144,0],
 [297,1693,122,1],[616,1770,125,1]
];
for(const [x,y,w,a] of shelfSpecs)shelf(x,y,w,a);
// Central cleft has a sequence of disjoint monumental hanging memory tablets, and broad breathing space.
for(let i=0;i<6;i++){
 let x=561+(i%2)*43,y=179+i*292;
 // thin suspension lines, snap at lower portions, hanging stone plates.
 line(x+2,y-45,x-6,y+10,i%2?M.COPPER:M.GRANITE,3);
 rect(x-20,y+11,43,59,M.WHITE);rect(x-16,y+15,35,51,M.STONE);
 for(let j=0;j<5;j++)rect(x-11,y+22+j*8,24-j*3,2,(i+j)%2?M.SLATE:M.BRASS);
 rect(x-24,y+7,51,4,M.BRASS);
}
// Fault-side elongated ribs, not perspective props or bridge rails.
for(let i=0;i<11;i++){
 let y=39+i*184;
 let x=rightEdge(y);
 line(x,y,x-42,y+28,M.STONE,6);
 line(x-42,y+28,x-30,y+53,M.QUARTZ,3);
}
// Mineral filaments follow the wall curves only. No free floating obstacle islands in the flight lanes.
for(let i=0;i<175;i++){
 let y=12+Math.floor(rnd()*(H-28)), side=i%2;
 let wall=side?rightEdge(y)+21:leftEdge(y)-25;
 let x=Math.round(wall+(side?8:-8)*rnd());
 if(x>0&&x<W-30&&A[y*W+x]!==0){line(x,y,x+(side?12:-12),y+8,i%4?M.QUARTZ:M.COPPER,2);}
}
// Caption-grounded centerpiece: fossil optical network through a suspended limestone wedge.
// This reinterpretation makes the largely horizontal reference's wedge into a descending
// vertical excavation landmark rather than stretching its source proportions.
poly([[539,386],[670,352],[725,384],[706,471],[669,561],[619,627],[566,532]],M.GRANITE);
poly([[550,397],[667,369],[714,389],[692,469],[659,548],[620,602],[580,516]],M.STONE);
for(let j=0;j<8;j++){
 let y=407+j*22, left=558+Math.round(j*3),w=Math.max(18,150-j*14);
 rect(left,y,w,5,j%3?M.CYAN:M.QUARTZ);
 for(let k=0;k<Math.max(1,Math.floor(w/24));k++)rect(left+k*24+7,y+6,4,9,j%2?M.WHITE:M.COPPER);
}
// Copper roots and light waveguide tendrils emerge at the tapered archive tip.
for(let j=0;j<6;j++){
 let x=597+j*11;line(x,564,x-25+j*7,664+j*5,j%2?M.CYAN:M.COPPER,3);
}
// A ladder-accessible cantilever excavation shelf: broken guard rail and revealed archive glass.
shelf(538,682,175,1);
for(let y=692;y<1161;y+=28){rect(570,y,37,4,M.COPPER);rect(564,y,5,23,M.WHITE);rect(609,y,4,23,M.STONE);}
for(let k=0;k<8;k++){
 let x=629+(k%4)*18,y=636+Math.floor(k/4)*21;
 rect(x,y,13,17,M.STONE);rect(x+3,y+3,7,12,k%2?M.CYAN:M.QUARTZ);
}
// Copper cable-retrieval station beneath the hanging archive: asymmetrical carriage,
// a memorable larger drum, pneumatic guide sheaves, and dangling paired cables.
rect(594,1672,99,18,M.STEEL);rect(607,1641,21,32,M.COPPER);rect(665,1641,18,33,M.COPPER);
ring(649,1735,59,M.COPPER,7);ring(649,1735,44,M.BRASS,5);disk(649,1735,18,M.OBSIDIAN);
for(let k=0;k<12;k++){let a=k*Math.PI/6;line(649+23*Math.cos(a),1735+23*Math.sin(a),649+52*Math.cos(a),1735+52*Math.sin(a),M.STONE,3);}
for(let j=0;j<3;j++){
 let x=596+j*27;line(x,1519,x+(j%2?17:-9),1651,M.COPPER,3);
 ring(x+(j%2?17:-9),1660,12,M.STEEL,3);
}
// Distinct recessed inspection lamps with short stone brackets; all above side corridors.
for(const [x,y] of [[381,316],[645,1092],[394,1448],[634,1833]]){
 rect(x,y,24,5,M.STEEL);rect(x+8,y+6,6,15,M.AMBER);rect(x+6,y+21,10,3,M.WHITE);
}
// Room to rift portals: conservative, arched clearances and broad unobstructed centre flight.
for(const r of leftRooms){
 let cy=r.y+Math.floor(r.h*.57);
 rect(r.x+r.w-88,cy-48,177,96,M.AIR);
}
for(const r of rightRooms){
 let cy=r.y+Math.floor(r.h*.58);
 rect(r.x-85,cy-48,161,96,M.AIR);
}
// A continuous central free-flight corridor and epochs' side route in the fissure.
rect(473,24,62,1998,M.AIR);
for(let y of [190,459,702,997,1290,1546,1845])rect(315,y,235,52,M.AIR);
for(let y of [250,570,901,1289,1634,1913])rect(492,y,286,52,M.AIR);
// Anchor strata foot and edge enclosure. Keep 2048x1024 true extent, do not tile.
rect(0,0,10,H,M.BASALT);rect(W-10,0,10,H,M.BASALT);rect(0,H-8,W,8,M.BASALT);
const spawn=[503,75];
// Deliberately declared interior *inspection airspaces*, not landmark material centres.
// Original coordinates are retained in evidence for transparent before/after review.
const destinations=[
 ["Capstone Fossil",[200,162],[222,145],"Capstone gallery viewing space beside intact fossil/cabinets"],
 ["Amber Cells",[171,441],[237,449],"Interior west gallery inspection aisle beside resin inclusions"],
 ["White Tablets",[190,672],[257,667],"Gallery aisle alongside tablet display"],
 ["Memory Reel",[205,1005],[317,1013],"Clear viewing bay east of intact monumental reel"],
 ["Obsidian Vault",[210,1278],[243,1263],"Interior viewing air above obsidian crystal cluster"],
 ["Quartz Fan",[188,1543],[235,1534],"Interior aisle alongside quartz fan"],
 ["Cenotaph",[204,1850],[260,1850],"Eastern clear gallery aisle beside cenotaph and burial rings"],
 ["Sigil Observatory",[844,234],[766,239],"Western observation bay outside monumental sigil"],
 ["Lapidary",[842,552],[778,552],"Western lab aisle avoiding slabs"],
 ["Archive Index",[837,886],[765,886],"Outer catalogue aisle avoiding stacked index registers"],
 ["Echo Chamber",[836,1250],[836,1209],"Upper acoustic chamber airspace over resonator arrays"],
 ["Sentinel Hall",[830,1600],[774,1600],"Clear western aisle beside sentinel columns"],
 ["Terminus Reader",[843,1920],[769,1905],"Viewing bay west of intact roll-reader drum"],
 ["Upper Fault Crossing",[523,316],[523,316],"Central upper free-flight cleft"],
 ["Lower Fault Crossing",[523,1474],[523,1474],"Central lower free-flight cleft"],
 ["Deep Cleft Exit",[503,1995],[503,1995],"Lower rift air exit"]
];
// Integer summed-area table for conservative Midge clearance 19x15.
const sat=new Int32Array((W+1)*(H+1));for(let y=0;y<H;y++){let s=0;for(let x=0;x<W;x++){s+=A[y*W+x]!==0?1:0;sat[(y+1)*(W+1)+x+1]=sat[y*(W+1)+x+1]+s;}}
const nav=new Uint8Array(A.length);for(let y=7;y<H-7;y++)for(let x=9;x<W-9;x++){let x0=x-9,x1=x+10,y0=y-7,y1=y+8;let n=sat[y1*(W+1)+x1]-sat[y0*(W+1)+x1]-sat[y1*(W+1)+x0]+sat[y0*(W+1)+x0];if(n===0)nav[y*W+x]=1;}
let p=spawn[1]*W+spawn[0];if(!nav[p])throw Error('spawn blocked '+A[p]);const q=new Int32Array(A.length),seen=new Uint8Array(A.length);q[0]=p;seen[p]=1;let count=1;for(let i=0;i<count;i++){let j=q[i],x=j%W,y=(j/W)|0;for(const d of [-W,-1,1,W]){if(d===-W&&y===0||d===-1&&x===0||d===1&&x===W-1||d===W&&y===H-1)continue;let k=j+d;if(nav[k]&&!seen[k]){seen[k]=1;q[count++]=k;}}}
// No nearest-air search: every declared location must itself be 19x15 flight-clear.
const waypoints=[];
for(const [name,original_intended,point,reason] of destinations){
 const [x,y]=point;
 if(x<9||y<7||x>=W-9||y>=H-7||!seen[y*W+x])throw Error('blocked exact destination '+name+' @ '+x+','+y);
 waypoints.push({name,original_intended,point,reachable:true,offset:0,relocation_reason:reason});
}
const invalid=new Set();for(const id of A)if(!MATERIAL_ID_WHITELIST.has(id))invalid.add(id);
if(invalid.size)throw Error('Unsupported materials: '+[...invalid].join(','));
const edits=[];let open=new Map();for(let y=0;y<H;y++){let cur=new Map(),row=y*W,x=0;while(x<W){let m=A[row+x],start=x++;while(x<W&&A[row+x]===m)x++;if(!m)continue;let key=start+':'+(x-start)+':'+m,j=open.get(key);if(j!==undefined&&edits[j][1]+edits[j][3]===y){edits[j][3]++;cur.set(key,j);}else{let k=edits.length;edits.push([start,y,x-start,1,m]);cur.set(key,k);}}open=cur;}
const check=new Uint8Array(A.length);for(const [x,y,w,h,m] of edits)for(let yy=y;yy<y+h;yy++)check.fill(m,yy*W+x,yy*W+x+w);let mismatch=0;for(let i=0;i<A.length;i++)if(A[i]!==check[i])mismatch++;if(mismatch)throw Error('reconstruction '+mismatch);
const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
const setup={version:2,extent:[W,H],actors:[{id:1,model:'midge',hash:'c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96',spawn,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.5}}],next_id:2,selected:1,edits,response:'LA-SELECTIVE',liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:2,brush:8,fire:false};
const json=JSON.stringify(setup)+'\n';if(edits.length>32768||json.length>1048576)throw Error('budget '+edits.length+', '+json.length);
const colors={0:[9,13,20],38:[142,121,108],40:[126,112,107],49:[73,77,87],50:[106,94,86],53:[174,103,81],57:[98,104,117],58:[117,128,132],62:[153,149,139],65:[159,79,63],66:[86,94,107],68:[102,113,132],74:[80,74,112],76:[227,178,48],77:[75,218,231],78:[207,102,206],79:[247,175,84],80:[232,231,215],100:[43,48,60],101:[25,29,40],119:[215,165,94],120:[86,170,192],122:[216,236,226]};
const palette=new Uint8Array(256*3);for(let i=0;i<256;i++)palette.set(colors[i]||[20,22,30],i*3);
const PW=512,PH=1024,raw=new Uint8Array((PW+1)*PH);for(let y=0;y<PH;y++){raw[y*(PW+1)]=0;for(let x=0;x<PW;x++)raw[y*(PW+1)+x+1]=A[(y*2)*W+x*2];}
function u32(n){return [(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255];}
function join(arrs){let sz=0;for(const a of arrs)sz+=a.length;let out=new Uint8Array(sz),p=0;for(const a of arrs){out.set(a,p);p+=a.length;}return out;}
const ct=new Uint32Array(256);for(let i=0;i<256;i++){let c=i;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;ct[i]=c>>>0;}
function crc(a){let c=0xffffffff;for(let i=0;i<a.length;i++)c=ct[(c^a[i])&255]^(c>>>8);return (c^0xffffffff)>>>0;}
function chunk(t,d){let a=join([Uint8Array.from([...t].map(ch=>ch.charCodeAt(0))),d]);return join([Uint8Array.from(u32(d.length)),a,Uint8Array.from(u32(crc(a)))]);}
function stored(a){let out=[Uint8Array.from([120,1])],s1=1,s2=0;for(let p=0;p<a.length;){let n=Math.min(65535,a.length-p),b=new Uint8Array(n+5);b[0]=p+n===a.length?1:0;b[1]=n&255;b[2]=n>>>8;b[3]=(~n)&255;b[4]=((~n)>>>8)&255;for(let i=0;i<n;i++){let v=a[p+i];b[i+5]=v;s1+=v;if(s1>=65521)s1-=65521;s2+=s1;if(s2>=65521)s2-=65521;}out.push(b);p+=n;}out.push(Uint8Array.from(u32(((s2<<16)|s1)>>>0)));return join(out);}
function indexedPng(w,h,imageData){return join([Uint8Array.from([137,80,78,71,13,10,26,10]),chunk('IHDR',Uint8Array.from([...u32(w),...u32(h),8,3,0,0,0])),chunk('PLTE',palette),chunk('IDAT',stored(imageData)),chunk('IEND',new Uint8Array())]);}
const png=indexedPng(PW,PH,raw);
function nativeCellCrop(x0,y0,w=512,h=512){const rows=new Uint8Array((w+1)*h);for(let y=0;y<h;y++){let dst=y*(w+1);rows[dst]=0;for(let x=0;x<w;x++)rows[dst+1+x]=A[(y0+y)*W+x0+x];}return indexedPng(w,h,rows);}
const crops={
 'descending-memory-strata-detail-upper.png':nativeCellCrop(300,220),
 'descending-memory-strata-detail-retrieval.png':nativeCellCrop(320,1330),
 'descending-memory-strata-detail-lower-archives.png':nativeCellCrop(490,1510)
};
const counts={};for(const x of A)counts[x]=(counts[x]||0)+1;
return {json,png,crops,stats:{source_public_id:'strat-0095c',target:[W,H],seed:SEED,rectangles:edits.length,rectangle_budget:32768,json_bytes:json.length,json_byte_budget:1048576,material_cells_verified:A.length,material_mismatches:mismatch,clearance_envelope:[19,15],connected_clearance_centres:count,spawn,waypoints,material_counts:counts,png_dimensions:[PW,PH],png_bytes:png.length,detail_crops:Object.keys(crops),native_material_catalogue_check:'All authored IDs appear in accepted native Material enum; physical DLL admission untested',native_qualification:'NOT EXECUTED',original_reference_visual_comparison:'NOT EXECUTED: GitHub connector supplies metadata only for PNG binaries'}};
}
module.exports={generate};
