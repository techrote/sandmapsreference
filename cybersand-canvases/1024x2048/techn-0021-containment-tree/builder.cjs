'use strict';
// Reproducible, fixed-seed CyberSand Workbench Setup-v2 authoring for Containment Tree.
function generate(){
const W=1024,H=2048,SEED=210058,A=new Uint8Array(W*H);
const M={AIR:0,STONE:38,SANDSTONE:39,GRANITE:40,MOSS:42,SLATE:49,IRON:50,BRONZE:52,COPPER:53,VERDIGRIS:54,GLASS:55,CONCRETE:58,STEEL:62,RUST:65,GRATE:66,PIPE:68,CABLE:74,HAZARD:76,CYAN:77,MAGENTA:78,AMBER:79,WHITE:80,BASALT:100,OBSIDIAN:101,BRASS:119,GLASSBLOCK:120,FROST:121,QUARTZ:122,URANIUM:123,PHOSPHOR:127,POLYMER:128};
const allowed=new Set(Object.values(M));
let seed=SEED;function rnd(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;}
function rect(x,y,w,h,m){x=Math.floor(x);y=Math.floor(y);w=Math.ceil(w);h=Math.ceil(h);let l=Math.max(0,x),r=Math.min(W,x+w),t=Math.max(0,y),b=Math.min(H,y+h);if(l>=r||t>=b)return;for(let j=t;j<b;j++)A.fill(m,j*W+l,j*W+r);}
function line(x0,y0,x1,y1,m,w=3){const n=Math.max(1,Math.ceil(Math.hypot(x1-x0,y1-y0)/Math.max(1,w*.65)));for(let i=0;i<=n;i++){let t=i/n;rect(x0+(x1-x0)*t-w/2,y0+(y1-y0)*t-w/2,w,w,m);}}
function disk(x,y,r,m){for(let j=Math.floor(y-r);j<=y+r;j++){let d2=r*r-(j-y)*(j-y);if(d2>=0){let dx=Math.sqrt(d2);rect(x-dx,j,dx*2+1,1,m);}}}
function ring(x,y,r,m,w=3){for(let j=0;j<160;j++){let a=2*Math.PI*j/160,b=2*Math.PI*(j+1)/160;line(x+r*Math.cos(a),y+r*Math.sin(a),x+r*Math.cos(b),y+r*Math.sin(b),m,w);}}
function poly(p,m){let top=Math.max(0,Math.floor(Math.min(...p.map(q=>q[1])))),bot=Math.min(H-1,Math.ceil(Math.max(...p.map(q=>q[1]))));for(let y=top;y<=bot;y++){let xs=[];for(let i=0;i<p.length;i++){let a=p[i],b=p[(i+1)%p.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let j=0;j+1<xs.length;j+=2)rect(xs[j],y,xs[j+1]-xs[j]+1,1,m);}}
function truss(x,y,w,h){rect(x,y,w,6,M.STEEL);rect(x,y+h-7,w,6,M.STEEL);for(let i=0;i<w-25;i+=38)line(x+i,y,x+i+31,y+h-8,M.COPPER,3);}
const glyph={A:"010101111101101",B:"110101110101110",C:"011100100100011",D:"110101101101110",E:"111100110100111",F:"111100110100100",G:"011100101101011",H:"101101111101101",I:"111010010010111",J:"011001001101010",K:"101101110101101",L:"100100100100111",M:"101111111101101",N:"101111111111101",O:"010101101101010",P:"110101110100100",Q:"010101101111011",R:"110101110101101",S:"011100010001110",T:"111010010010010",U:"101101101101111",V:"101101101101010",W:"101101111111101",X:"101101010101101",Y:"101101010010010",Z:"111001010010010","0":"111101101101111","1":"010110010010111","2":"110001010100111","3":"110001010001110","4":"101101111001001","5":"111100110001110","6":"011100110101010","7":"111001010010010","8":"010101010101010","9":"111101111001111"," ":"000000000000000"};
function label(x,y,s,m=M.CYAN,z=2){for(let k of s){let g=glyph[k]||glyph[" "];for(let i=0;i<15;i++)if(g[i]==="1")rect(x+(i%3)*z,y+(i/3|0)*z,z,z,m);x+=4*z;}}
const shades=[[0,490,M.SLATE,M.MOSS],[490,1000,M.GRANITE,M.VERDIGRIS],[1000,1530,M.BASALT,M.BRONZE],[1530,2048,M.OBSIDIAN,M.MOSS]];
function le(y){return 277+23*Math.sin(y*.009)+14*Math.sin(y*.037+1.2)+11*Math.sin(y*.11);}
function re(y){return 747+18*Math.sin(y*.013+1.7)+17*Math.sin(y*.048)+8*Math.sin(y*.1);}
for(let y=0;y<H;y++){let t=shades.find(z=>y>=z[0]&&y<z[1]);let l=Math.max(235,Math.min(313,Math.round(le(y)))),r=Math.max(712,Math.min(794,Math.round(re(y))));rect(0,y,l,1,t[2]);rect(r,y,W-r,1,t[2]);if(y%47<6){rect(0,y,30+Math.round(10*Math.sin(y*.04)),1,t[3]);rect(r+35,y,W-r-35,1,t[3]);}if(y%89<3){rect(8,y,83,1,M.IRON);rect(W-94,y,86,1,M.IRON);}}
for(let j=0;j<1300;j++){let y=12+(rnd()*2020|0),left=j%2===0,x=left?(18+rnd()*205|0):(795+rnd()*207|0),n=12+rnd()*65,m=[M.GRANITE,M.MOSS,M.VERDIGRIS,M.SANDSTONE,M.COPPER,M.IRON,M.QUARTZ,M.BASALT][(j+(y/250|0))%8];if(A[y*W+x]!==M.AIR){line(x,y,x+(left?n:-n),y+(rnd()*8|0)-4,m,1+(j%3));}}
// Tectonic fins and brown biolith veins, composed into the immobile wall masses.
for(let k=0;k<14;k++){let y=48+k*147;poly([[65,y],[122,y-15],[177,y+13],[153,y+35],[84,y+40]],k%3?M.GRANITE:M.MOSS);poly([[838,y+14],[909,y-12],[956,y+21],[917,y+48]],k%2?M.VERDIGRIS:M.COPPER);}
const left=[
{y:173,h:225,name:"CROWN LAB",mode:0},{y:523,h:212,name:"SPORE BANK",mode:1},{y:858,h:213,name:"MICROSCOPE",mode:2},
{y:1179,h:220,name:"RESIN WELL",mode:3},{y:1518,h:222,name:"ROOT VAULT",mode:4},{y:1825,h:180,name:"SEED BANK",mode:5}
];
const right=[
{y:259,h:234,name:"CANOPY EYE",mode:6},{y:635,h:217,name:"BIOCORE 02",mode:7},{y:987,h:238,name:"ISOLATION",mode:8},
{y:1363,h:231,name:"LUMEN GRID",mode:9},{y:1725,h:245,name:"RETURN PUMP",mode:10}
];
function chamber(r,side){
let x=side==="L"?23:717,y=r.y,w=side==="L"?291:283,h=r.h;
poly([[x+18,y+40],[x+49,y+12],[x+w-62,y+9],[x+w-12,y+42],[x+w-6,y+h-42],[x+w-33,y+h-14],[x+36,y+h-11],[x+9,y+h-38]],M.CONCRETE);
poly([[x+25,y+49],[x+54,y+20],[x+w-67,y+18],[x+w-23,y+50],[x+w-18,y+h-51],[x+w-39,y+h-23],[x+42,y+h-24],[x+22,y+h-50]],M.AIR);
rect(x+36,y+h-31,w-75,9,M.STEEL);rect(x+39,y+h-22,w-81,7,M.RUST);
rect(x+57,y+24,w-117,5,M.IRON);
for(let j=0;j<5;j++){let xx=x+42+j*48;rect(xx,y+31,4,15,M.BRASS);rect(xx,y+h-39,14,4,M.BRONZE);}
rect(x+34,y+50,5,h-90,M.VERDIGRIS);rect(x+w-37,y+50,5,h-90,M.VERDIGRIS);
label(x+56,y+37,r.name,M.PHOSPHOR,2);
const top=y+73,mid=x+w/2;
switch(r.mode){
case 0: // hanging bioluminescent growth domes
ring(mid,top+62,49,M.COPPER,6);disk(mid,top+62,34,M.OBSIDIAN);disk(mid,top+62,22,M.URANIUM);
for(let k=0;k<9;k++){let a=k*.68;line(mid+32*Math.cos(a),top+62+32*Math.sin(a),mid+56*Math.cos(a),top+62+56*Math.sin(a),k%3?M.VERDIGRIS:M.PHOSPHOR,4);}break;
case 1:
for(let k=0;k<4;k++){let cx=x+73+k*47;rect(cx-15,top,30,91,M.GLASSBLOCK);rect(cx-11,top+9,22,73,M.OBSIDIAN);disk(cx,top+51,6+k%3*3,k%2?M.PHOSPHOR:M.URANIUM);rect(cx-19,top+94,38,8,M.STEEL);}break;
case 2:
disk(mid,top+58,40,M.GRANITE);ring(mid,top+58,37,M.BRASS,5);ring(mid,top+58,20,M.WHITE,4);
for(let k=0;k<5;k++){line(x+50+k*23,top+10,x+65+k*23,top+27,M.CYAN,3);}break;
case 3:
for(let k=0;k<3;k++){let cx=x+82+k*57;disk(cx,top+76,32,M.COPPER);disk(cx,top+76,23,M.OBSIDIAN);disk(cx,top+76,13,M.AMBER);rect(cx-25,top+109,49,5,M.STEEL);}break;
case 4:
for(let k=0;k<6;k++){let xx=x+67+k*29;line(xx,y+h-57,xx-15,top+5,k%2?M.VERDIGRIS:M.MOSS,5);disk(xx-15,top+10,8,M.MOSS);}break;
case 5:
for(let k=0;k<7;k++){let xx=x+62+k*26;rect(xx,top+12,17,61,M.COPPER);rect(xx+3,top+19,11,44,M.OBSIDIAN);disk(xx+8,top+31,4+k%3,M.PHOSPHOR);}break;
case 6:
ring(mid,top+67,66,M.COPPER,5);ring(mid,top+67,46,M.AMBER,4);disk(mid,top+67,26,M.URANIUM);for(let k=0;k<12;k++){let a=k*Math.PI/6;line(mid+48*Math.cos(a),top+67+48*Math.sin(a),mid+65*Math.cos(a),top+67+65*Math.sin(a),M.VERDIGRIS,3);}break;
case 7:
for(let k=0;k<4;k++){let xx=x+56+k*45;rect(xx,top+12,36,100,M.GLASSBLOCK);rect(xx+5,top+15,26,89,M.OBSIDIAN);disk(xx+18,top+47,10,M.URANIUM);rect(xx-5,top+115,45,6,M.STEEL);}break;
case 8:
for(let k=0;k<3;k++){let cx=x+92+k*65;disk(cx,top+73,43,M.FROST);disk(cx,top+73,34,M.OBSIDIAN);for(let t=0;t<6;t++){let a=t*Math.PI/3;disk(cx+22*Math.cos(a),top+73+22*Math.sin(a),6,M.PHOSPHOR);}}break;
case 9:
for(let k=0;k<5;k++){let xx=x+57+k*39;rect(xx,top,27,107,M.STEEL);rect(xx+5,top+8,17,91,M.OBSIDIAN);for(let t=0;t<6;t++)rect(xx+8,top+15+t*13,12,3,(k+t)%2?M.CYAN:M.PHOSPHOR);}break;
case 10:
ring(mid,top+64,61,M.RUST,8);ring(mid,top+64,43,M.COPPER,7);disk(mid,top+64,17,M.BRASS);for(let k=0;k<12;k++){let a=k*Math.PI/6;line(mid+22*Math.cos(a),top+64+22*Math.sin(a),mid+53*Math.cos(a),top+64+53*Math.sin(a),M.AMBER,3);}break;
}
}
left.forEach(r=>chamber(r,"L"));right.forEach(r=>chamber(r,"R"));
// Magnified artificial tree / bioreactor: heavy central bole, ovate translucent crown,
// mycelial circuit-garden, branching bronze roots, and an autonomous core.
poly([[455,443],[482,376],[514,358],[549,400],[574,541],[553,740],[567,919],[556,1138],[579,1358],[569,1615],[540,1831],[495,1918],[468,1740],[477,1528],[462,1334],[476,1120],[460,926],[474,728]],M.COPPER);
poly([[480,448],[511,390],[536,444],[543,740],[535,1044],[546,1440],[525,1812],[497,1850],[496,1486],[486,1080]],M.OBSIDIAN);
for(let j=0;j<33;j++){let y=423+j*40,cx=505+20*Math.sin(j*.5),w=8+5*Math.sin(j*.8);line(cx,y,cx+12*Math.sin(j*.7),y+31,j%5===0?M.URANIUM:M.VERDIGRIS,4+(j%3));if(j%3===0)disk(cx+12*Math.sin(j*.6),y+20,6,M.PHOSPHOR);}
for(let k=0;k<8;k++){let y=510+k*180;let x=508+14*Math.sin(k*1.2);line(x,y,438-20*(k%2),y-77,M.VERDIGRIS,9);line(x,y+18,579+22*(k%2),y-58,M.COPPER,7);line(436-20*(k%2),y-77,418-25*(k%2),y-105,M.MOSS,5);disk(408-20*(k%2),y-115,11,M.PHOSPHOR);}
poly([[491,354],[419,333],[367,285],[355,219],[389,150],[462,137],[492,173],[531,142],[606,151],[648,211],[633,294],[579,343],[541,381]],M.VERDIGRIS);
for(let k=0;k<29;k++){let a=k*2.399963,r=15+Math.sqrt(k/29)*130,cx=505+Math.cos(a)*r,cy=251+Math.sin(a)*r*.81;disk(cx,cy,17+(k*7%18),[M.MOSS,M.VERDIGRIS,M.PHOSPHOR,M.COPPER][k%4]);if(k%3===0)disk(cx-5,cy-4,7,M.URANIUM);}
ring(507,262,158,M.COPPER,7);ring(507,262,145,M.AMBER,3);
for(let k=0;k<20;k++){let a=k*Math.PI/10;line(507+149*Math.cos(a),262+149*Math.sin(a),507+132*Math.cos(a),262+132*Math.sin(a),M.BRASS,4);}
disk(507,263,46,M.OBSIDIAN);disk(507,263,33,M.URANIUM);ring(507,263,45,M.AMBER,4);
for(let k=0;k<12;k++){let a=k*Math.PI/6;line(507+57*Math.cos(a),263+57*Math.sin(a),507+118*Math.cos(a),263+118*Math.sin(a),k%3?M.VERDIGRIS:M.COPPER,4);}
// Vertical life-support layers, unique tanks/collars along trunk.
for(const [cx,cy,r] of [[518,724,70],[514,1124,76],[533,1674,80]]){
ring(cx,cy,r,M.STEEL,7);ring(cx,cy,r-14,M.BRASS,4);disk(cx,cy,36,M.OBSIDIAN);disk(cx,cy,22,M.URANIUM);
for(let k=0;k<8;k++){let a=k*Math.PI/4;line(cx+(r-10)*Math.cos(a),cy+(r-10)*Math.sin(a),cx+(r+8)*Math.cos(a),cy+(r+8)*Math.sin(a),M.COPPER,5);}
}
// Containment bridge struts and fluorescent sensor grids; out of the protected flanking lanes.
for(let k=0;k<12;k++){
let y=398+k*134;
line(418,y,455+8*Math.sin(k),y+27,k%2?M.COPPER:M.STEEL,4);
line(570,y+37,611,y+16,k%2?M.VERDIGRIS:M.COPPER,4);
}
for(let k=0;k<8;k++){let y=480+k*213;rect(418,y,15,55,M.STEEL);rect(595,y+15,18,48,M.STEEL);for(let t=0;t<5;t++){rect(422,y+5+t*10,7,3,M.AMBER);rect(599,y+23+t*8,9,2,M.CYAN);}}
// Root flares at lowest biocore; dense lower chamber but keep both corridors open.
for(let k=0;k<11;k++){let y=1845+k*18,x=518+Math.sin(k*.73)*18;line(x,y,365-(k%4)*26,1980+(k%3)*10,k%2?M.COPPER:M.VERDIGRIS,4+(k%3));line(x,y,656+(k%3)*25,1968+(k%4)*9,M.MOSS,4+(k%4));}
truss(426,1949,170,26);rect(470,1978,95,17,M.STEEL);rect(485,1995,62,13,M.AMBER);
// Edge rail & distinct ledges, out of main flight lanes.
for(let i=0;i<18;i++){let y=78+i*110;let l=Math.round(le(y)),r=Math.round(re(y));
rect(l-21,y,36,7,M.IRON);rect(r-12,y+13,35,7,M.STEEL);
if(i%3===0){rect(l-26,y-16,4,18,M.VERDIGRIS);rect(r+18,y-10,5,24,M.AMBER);}
}

/* Independent visual repair: geological/biological relief between distinct
   rooms. Protected flight corridors and portals are deliberately cut afterwards. */
const wallGlyphs=[
[133,457,42,M.MOSS,M.AMBER],[871,567,38,M.COPPER,M.CYAN],
[135,790,49,M.VERDIGRIS,M.PHOSPHOR],[890,930,42,M.SLATE,M.MAGENTA],
[124,1115,45,M.GRANITE,M.AMBER],[883,1280,44,M.COPPER,M.URANIUM],
[130,1452,48,M.BASALT,M.MAGENTA],[874,1649,47,M.VERDIGRIS,M.CYAN],
[140,1769,35,M.COPPER,M.AMBER],[880,2013,34,M.SLATE,M.PHOSPHOR]];
for(let gi=0;gi<wallGlyphs.length;gi++){
 const [cx,cy,rad,body,light]=wallGlyphs[gi];
 if(gi%4===0){ // fossilized cellular wheel
   disk(cx,cy,rad+8,M.IRON);disk(cx,cy,rad,body);disk(cx,cy,rad-14,M.OBSIDIAN);
   ring(cx,cy,rad+5,M.BRASS,3);for(let k=0;k<7;k++){let a=k*6.283185/7;disk(cx+(rad-25)*Math.cos(a),cy+(rad-25)*Math.sin(a),4+k%3,light);}
 }else if(gi%4===1){ // faceted rhizome crystal
   poly([[cx-rad,cy-10],[cx-rad/2,cy-rad],[cx+rad/3,cy-rad+8],[cx+rad,cy-9],[cx+rad/2,cy+rad],[cx-rad/2,cy+rad/2]],body);
   poly([[cx-rad+9,cy-8],[cx-rad/2,cy-rad+10],[cx+rad/3,cy-rad+17],[cx+rad-11,cy-7],[cx+rad/2,cy+rad-9],[cx-rad/2,cy+rad/2-5]],M.OBSIDIAN);
   for(let k=0;k<6;k++){let t=k/5;line(cx-rad*.66+t*rad*1.5,cy-rad*.38,cx-rad*.55+t*rad*1.2,cy+rad*.45,k%2?light:M.VERDIGRIS,3);}
 }else if(gi%4===2){ // compound biomembrane / pearly egg cluster
   for(let k=0;k<5;k++){let a=k*1.256;disk(cx+rad*.45*Math.cos(a),cy+rad*.45*Math.sin(a),rad*.42,body);}
   disk(cx,cy,rad*.50,M.OBSIDIAN);for(let k=0;k<8;k++){let a=k*.785;disk(cx+rad*.25*Math.cos(a),cy+rad*.25*Math.sin(a),6,light);}
 }else{ // asymmetric root-fan relief, not another circular exhibit
   line(cx,cy-rad,cx,cy+rad,M.IRON,6);
   for(let k=0;k<9;k++){let yy=cy-rad+k*rad*.24,dir=k%2?-1:1,xx=cx+dir*(18+((k*7)%27));
      line(cx,yy,xx,yy+10,body,5);line(xx,yy+10,xx+dir*10,yy+20,light,3);disk(xx+dir*10,yy+20,4,light);}
 }
}
const fanSpecs=[[490,590,-1,M.MOSS],[542,824,1,M.COPPER],[477,1064,-1,M.CYAN],
[545,1232,1,M.PHOSPHOR],[477,1423,-1,M.MAGENTA],[547,1753,1,M.COPPER]];
for(const [x,y,d,t] of fanSpecs){
 for(let k=0;k<7;k++){
  let theta=-.85+k*.275,L=24+k*5,xx=x+d*(25+L*Math.cos(theta)),yy=y+L*Math.sin(theta);
  line(x,y,xx,yy,k%2?M.COPPER:t,3);disk(xx,yy,4,t);
 }
}
// Outside-airshaft rootwork; accents are structurally grounded in cliff stone.
for(let k=0;k<37;k++){
 let y=82+k*52,left=k%2===0,x=left?(48+(k*21%150)):(807+(k*29%146));
 if(A[y*W+x]!==M.AIR){
   let tip=x+(left?1:-1)*(20+k%4*9),ty=y+10+k%3*4;
   line(x,y,tip,ty,k%5===0?M.PHOSPHOR:(y<1060?M.VERDIGRIS:M.COPPER),4);
   disk(tip,ty,4+k%4,k%3===0?M.URANIUM:M.MOSS);
 }
}
for(let k=0;k<9;k++){
 let y=175+k*203,l=Math.round(le(y)),r=Math.round(re(y));
 line(l-18,y-25,l+29,y+30,k%2?M.MOSS:M.VERDIGRIS,5);
 line(r+18,y-32,r-21,y+37,k%2?M.COPPER:M.VERDIGRIS,5);
 disk(l+12,y+17,7,M.PHOSPHOR);disk(r-12,y+16,7,k%3?M.CYAN:M.AMBER);
}

// Deliberate collision-safe corridors, access portals and trans-bole openings.
// Last-pass cuts are deliberate no-build clearance masks and never secretly substituted waypoint anchors.
rect(343,22,74,2000,M.AIR);rect(608,22,78,2000,M.AIR);
for(const r of left){let cy=r.y+Math.floor(r.h*.58);rect(265,cy-45,160,90,M.AIR);rect(260,cy-30,90,60,M.AIR);}
for(const r of right){let cy=r.y+Math.floor(r.h*.58);rect(599,cy-45,167,90,M.AIR);rect(685,cy-30,82,60,M.AIR);}
const crossings=[490,922,1318,1576,1890];for(const y of crossings)rect(398,y-31,235,64,M.AIR);
// A top service traverse and lower escape lane without blocking floor closure.
rect(338,66,350,64,M.AIR);rect(340,2000,345,22,M.AIR);
// Exact semantic inspection anchors are located in real entrance-side airspace,
// deliberately separated from specimen exhibits, sensor machinery and biology.
const destinations=[
 ...left.map(r=>[r.name,[286,r.y+Math.floor(r.h*.58)]]),
 ...right.map(r=>[r.name,[742,r.y+Math.floor(r.h*.58)]]),
 ["CROWN ATRIUM",[514,94]],["UPPER ANASTOMOSIS",[515,490]],
 ["MIDDLE VASCULAR",[515,922]],["LOWER LUMEN",[515,1576]],
 ["ROOT RETURN",[514,1890]],["DEEP EXIT",[368,1994]]
];
const spawn=[369,95];
// Fully closed exterior frame; always leave room-side portals intact.
rect(0,0,9,H,M.BASALT);rect(W-9,0,9,H,M.BASALT);rect(0,H-9,W,9,M.BASALT);
// Conservative full non-air collision mask, 19x15 actor centre clearance.
const sat=new Int32Array((W+1)*(H+1));for(let y=0;y<H;y++){let s=0;for(let x=0;x<W;x++){s+=A[y*W+x]!==0?1:0;sat[(y+1)*(W+1)+x+1]=sat[y*(W+1)+x+1]+s;}}
const nav=new Uint8Array(A.length);
for(let y=7;y<H-7;y++)for(let x=9;x<W-9;x++){let x0=x-9,x1=x+10,y0=y-7,y1=y+8;let n=sat[y1*(W+1)+x1]-sat[y0*(W+1)+x1]-sat[y1*(W+1)+x0]+sat[y0*(W+1)+x0];if(n===0)nav[y*W+x]=1;}
const p=spawn[1]*W+spawn[0];if(!nav[p])throw Error("spawn has insufficient clearance "+JSON.stringify(spawn));
const q=new Int32Array(A.length),seen=new Uint8Array(A.length);q[0]=p;seen[p]=1;let count=1;for(let i=0;i<count;i++){let j=q[i],x=j%W,y=(j/W)|0;for(const d of [-W,-1,1,W]){if((d===-W&&y===0)||(d===-1&&x===0)||(d===1&&x===W-1)||(d===W&&y===H-1))continue;let k=j+d;if(nav[k]&&!seen[k]){seen[k]=1;q[count++]=k;}}}
const waypoints=destinations.map(([name,point])=>({name,point,clear:!!nav[point[1]*W+point[0]],reachable:!!seen[point[1]*W+point[0]]}));
const failed=waypoints.filter(x=>!x.clear||!x.reachable);if(failed.length)throw Error("unreachable exact endpoints: "+JSON.stringify(failed));
// Row-RLE/vertical rectangle coalescing. Non-air only; no overlap.
const edits=[];let active=new Map();for(let y=0;y<H;y++){let cur=new Map(),row=y*W,x=0;while(x<W){let m=A[row+x],start=x++;while(x<W&&A[row+x]===m)x++;if(m===0)continue;let k=start+":"+(x-start)+":"+m,j=active.get(k);if(j!==undefined&&edits[j][1]+edits[j][3]===y){edits[j][3]++;cur.set(k,j);}else{cur.set(k,edits.length);edits.push([start,y,x-start,1,m]);}}active=cur;}
if(edits.length>32768)throw Error("rectangle budget "+edits.length);
// Check exhaustive reconstruction independent of authoring order.
const reconstructed=new Uint8Array(A.length);let stamped=0;for(const [x,y,w,h,m] of edits){if(!allowed.has(m)||m===0)throw Error("invalid material "+m);stamped+=w*h;for(let j=y;j<y+h;j++)reconstructed.fill(m,j*W+x,j*W+x+w);}
let mismatches=0;const hist={};for(let i=0;i<A.length;i++){if(A[i]!==reconstructed[i])mismatches++;hist[A[i]]=(hist[A[i]]||0)+1;}if(mismatches)throw Error("reconstruction mismatches "+mismatches);
const policy=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
const setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn,options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.5}}],next_id:2,selected:1,edits,response:"LA-SELECTIVE",liquid_policy:policy,normalize:false,rule_radius:2,source:[],material:2,brush:8,fire:false};
const json=JSON.stringify(setup)+"\n";if(json.length>1048576)throw Error("JSON bytes "+json.length);
const colors={0:[8,11,18],38:[197,191,175],39:[199,156,98],40:[119,119,130],42:[101,112,90],49:[70,83,99],50:[50,58,64],52:[162,113,56],53:[184,108,64],54:[79,140,121],55:[71,127,168],58:[119,123,128],62:[126,141,153],65:[124,63,43],66:[74,85,93],68:[102,119,129],74:[60,53,68],76:[227,182,47],77:[55,243,228],78:[255,61,184],79:[255,181,46],80:[236,248,255],100:[54,56,61],101:[24,19,32],119:[196,160,72],120:[156,210,220],121:[206,226,232],122:[226,236,244],123:[152,232,94],127:[176,220,172],128:[62,122,180]};
function pngRegion(sx,sy,ww,hh,step=2){
const pw=Math.ceil(ww/step),ph=Math.ceil(hh/step),raw=new Uint8Array((pw+1)*ph),palette=new Uint8Array(768);
for(let i=0;i<256;i++)palette.set(colors[i]||[25,27,34],i*3);
for(let y=0;y<ph;y++){for(let x=0;x<pw;x++){let srcx=Math.min(W-1,sx+x*step),srcy=Math.min(H-1,sy+y*step);raw[y*(pw+1)+x+1]=A[srcy*W+srcx];}}
const u32=n=>Uint8Array.from([(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255]);
function cat(a){let n=a.reduce((s,b)=>s+b.length,0),c=new Uint8Array(n),p=0;for(const b of a){c.set(b,p);p+=b.length;}return c;}
const tbl=new Uint32Array(256);for(let i=0;i<256;i++){let c=i;for(let j=0;j<8;j++)c=c&1?0xedb88320^(c>>>1):c>>>1;tbl[i]=c>>>0;}
function crc(a){let c=0xffffffff;for(let i=0;i<a.length;i++)c=tbl[(c^a[i])&255]^(c>>>8);return (c^0xffffffff)>>>0;}
function chunk(n,data){let typ=Uint8Array.from(n.split("").map(x=>x.charCodeAt(0))),c=cat([typ,data]);return cat([u32(data.length),c,u32(crc(c))]);}
function zstored(data){let arr=[Uint8Array.from([120,1])],s1=1,s2=0;for(let p=0;p<data.length;){let z=Math.min(65535,data.length-p),b=new Uint8Array(z+5);b[0]=p+z===data.length?1:0;b[1]=z&255;b[2]=z>>>8;b[3]=~z&255;b[4]=(~z>>>8)&255;for(let i=0;i<z;i++){let c=data[p+i];b[i+5]=c;s1+=c;if(s1>=65521)s1-=65521;s2+=s1;if(s2>=65521)s2-=65521;}arr.push(b);p+=z;}arr.push(u32(((s2<<16)|s1)>>>0));return cat(arr);}
return cat([Uint8Array.from([137,80,78,71,13,10,26,10]),chunk("IHDR",Uint8Array.from([...u32(pw),...u32(ph),8,3,0,0,0])),chunk("PLTE",palette),chunk("IDAT",zstored(raw)),chunk("IEND",new Uint8Array())]);
}
const png=pngRegion(0,0,W,H,2);
const details={upper:pngRegion(192,115,640,640,1),lower:pngRegion(191,1295,640,640,1)};
const evidence={source_public_id:"techn-0021",source_key:"batch1/image-0058",target:[W,H],seed:SEED,rectangles:edits.length,rectangle_budget:32768,json_bytes:json.length,json_byte_budget:1048576,stamped_cells:stamped,material_cells_verified:A.length,mismatches,used_material_ids:Object.keys(hist).map(Number).sort((a,b)=>a-b),material_counts:hist,clearance_envelope:[19,15],connected_clearance_centres:count,spawn,waypoints,actual_native_godot_rapier_qualification:"NOT EXECUTED",original_reference_pixel_comparison:"NOT EXECUTED: GitHub binary image connector refuses PNG bytes",original_dimensions:"UNVERIFIED"};
return {json,png,details,evidence};
}
module.exports={generate};
