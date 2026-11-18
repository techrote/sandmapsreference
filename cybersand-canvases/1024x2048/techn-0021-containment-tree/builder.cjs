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
function le(y){return 166+15*Math.sin(y*.009)+12*Math.sin(y*.037+1.2)+6*Math.sin(y*.11);}
function re(y){return 851+17*Math.sin(y*.013+1.7)+14*Math.sin(y*.048)+6*Math.sin(y*.1);}
for(let y=0;y<H;y++){let t=shades.find(z=>y>=z[0]&&y<z[1]);let l=Math.max(235,Math.min(313,Math.round(le(y)))),r=Math.max(712,Math.min(794,Math.round(re(y))));rect(0,y,l,1,t[2]);rect(r,y,W-r,1,t[2]);if(y%47<6){rect(0,y,30+Math.round(10*Math.sin(y*.04)),1,t[3]);rect(r+35,y,W-r-35,1,t[3]);}if(y%89<3){rect(8,y,83,1,M.IRON);rect(W-94,y,86,1,M.IRON);}}
for(let j=0;j<1300;j++){let y=12+(rnd()*2020|0),left=j%2===0,x=left?(18+rnd()*205|0):(795+rnd()*207|0),n=12+rnd()*65,m=[M.GRANITE,M.MOSS,M.VERDIGRIS,M.SANDSTONE,M.COPPER,M.IRON,M.QUARTZ,M.BASALT][(j+(y/250|0))%8];if(A[y*W+x]!==M.AIR){line(x,y,x+(left?n:-n),y+(rnd()*8|0)-4,m,1+(j%3));}}
// Tectonic fins and brown biolith veins, composed into the immobile wall masses.
// Bespoke, unequal cliff strata replace repeating diamond-wall wallpaper.
for(const [x,y,w,h,m] of [[48,105,109,37,M.GRANITE],[102,393,85,65,M.MOSS],[26,825,143,84,M.COPPER],[94,1198,116,76,M.BASALT],[22,1692,121,94,M.MOSS],[842,166,97,53,M.VERDIGRIS],[897,681,88,75,M.GRANITE],[820,1118,151,66,M.COPPER],[892,1532,114,113,M.BASALT],[830,1886,123,49,M.MOSS]]){
 poly([[x,y+h/3],[x+w*.3,y-9],[x+w,y+h*.15],[x+w*.66,y+h],[x+w*.19,y+h*.83]],m);
 line(x+w*.22,y+h*.2,x+w*.67,y+h*.64,M.SLATE,3);
}
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
// First-generation mirrored eleven-chamber grid removed by R2 redesign.
// Edge rail & distinct ledges, out of main flight lanes.
for(let i=0;i<18;i++){let y=78+i*110;let l=Math.round(le(y)),r=Math.round(re(y));
rect(l-21,y,36,7,M.IRON);rect(r-12,y+13,35,7,M.STEEL);
if(i%3===0){rect(l-26,y-16,4,18,M.VERDIGRIS);rect(r+18,y-10,5,24,M.AMBER);}
}


// ROUND 2 — original source JPEG observed; physically authored 2D containment silhouette.
// Replace repeated specimen tokens with one connected specimen at useful Midge scale.
const coreX=615;
function branch(points,material=M.COPPER,width=14){
 for(let i=1;i<points.length;i++)line(points[i-1][0],points[i-1][1],points[i][0],points[i][1],material,Math.max(4,width-2*i));
}
function dome(cx,cy,rx,ry){
 for(let j=0;j<26;j++){let a=Math.PI+j*Math.PI/25,b=Math.PI+(j+1)*Math.PI/25;
 line(cx+rx*Math.cos(a),cy+ry*Math.sin(a),cx+rx*Math.cos(b),cy+ry*Math.sin(b),M.FROST,7);}
 for(let j=1;j<9;j++){let x=cx-rx+j*rx/4,y=cy-ry*Math.sqrt(Math.max(0,1-((x-cx)/rx)**2));line(cx,cy,x,y,M.BRASS,3);}
}
function sampleRoom(x,y,w,h,style){
 rect(x,y,w,h,M.CONCRETE);rect(x+9,y+10,w-18,h-27,M.AIR);rect(x,y+h-17,w,17,M.STEEL);
 rect(x+14,y+26,w-28,5,M.COPPER);
 for(let j=0;j<3;j++){let xx=x+24+j*(w-65)/3;rect(xx,y+43,31,24,M.GLASSBLOCK);rect(xx+4,y+47,23,16,M.OBSIDIAN);rect(xx+10,y+53,11,4,j%2?M.PHOSPHOR:M.CYAN);}
 if(style===0){for(let j=0;j<3;j++){let xx=x+43+j*50;rect(xx,y+h-100,33,78,M.GLASSBLOCK);rect(xx+5,y+h-94,23,63,M.OBSIDIAN);disk(xx+16,y+h-62,10,M.URANIUM);}}
 if(style===1){for(let j=0;j<5;j++){let xx=x+27+j*32;line(xx,y+h-80,xx+13,y+h-30,M.VERDIGRIS,4);disk(xx+10,y+h-65,5,M.PHOSPHOR);}}
 if(style===2){for(let j=0;j<3;j++){let xx=x+55+j*48;disk(xx,y+h-55,23,M.BRASS);disk(xx,y+h-55,14,M.OBSIDIAN);disk(xx,y+h-55,7,M.CYAN);}}
 if(style===3){for(let j=0;j<4;j++){let xx=x+35+j*42;rect(xx,y+h-99,29,80,M.STEEL);rect(xx+4,y+h-93,21,63,M.OBSIDIAN);rect(xx+8,y+h-66,12,5,M.PHOSPHOR);}}
}
// Remove square inherited core from all five 'token motif' historical tiers.
rect(398,137,308,1869,M.AIR);
// Broad central roof and dome silhouette, distinct source-derived research wings.
dome(206,257,116,107);
rect(75,258,288,13,M.STEEL);rect(78,274,282,6,M.BRASS);
rect(85,275,7,128,M.IRON);rect(313,275,7,128,M.IRON);
for(let j=0;j<4;j++){rect(98+j*52,296,40,40,M.GLASSBLOCK);rect(102+j*52,300,32,32,M.OBSIDIAN);rect(108+j*52,314,20,4,M.CYAN);}
sampleRoom(122,435,230,172,0);
// Open western cultivation grotto with asymmetric rooted vessels.
poly([[126,678],[162,644],[306,665],[362,707],[352,833],[316,850],[145,838]],M.BASALT);
poly([[142,697],[170,667],[300,683],[338,721],[333,809],[310,826],[161,811]],M.AIR);
rect(147,812,189,13,M.STEEL);rect(151,824,178,5,M.BRASS);
for(const [xx,yy] of [[169,746],[227,765],[285,743]]){line(xx,814,xx-11,yy,M.VERDIGRIS,10);line(xx-11,yy,xx-22,yy-24,M.COPPER,7);disk(xx-24,yy-23,13,M.MOSS);disk(xx-28,yy-27,4,M.PHOSPHOR);}
line(132,718,170,680,M.COPPER,9);line(341,739,302,682,M.MOSS,10);
sampleRoom(133,1092,231,178,2);
// Western root-vault socket, open fly-through with actual geologic containment.
poly([[131,1452],[196,1418],[289,1443],[377,1509],[357,1629],[305,1661],[143,1647]],M.GRANITE);
poly([[155,1480],[203,1455],[288,1473],[347,1519],[329,1617],[288,1630],[165,1616]],M.AIR);
rect(159,1618,174,15,M.STEEL);rect(171,1633,149,5,M.BRASS);
for(const [xx,yy,rr] of [[182,1548,14],[255,1564,17],[314,1536,11]]){line(xx,1609,xx,yy,M.COPPER,8);disk(xx,yy,rr,M.VERDIGRIS);disk(xx-3,yy-3,5,M.PHOSPHOR);}
sampleRoom(113,1813,247,179,1);
sampleRoom(786,366,231,190,0);
sampleRoom(787,775,230,177,3);
// East logistics manifold with irregular excavated hull and three distinct pumps.
poly([[780,1237],[853,1214],[976,1226],[1019,1267],[1008,1401],[959,1434],[796,1423]],M.CONCRETE);
poly([[794,1261],[858,1239],[962,1251],[992,1283],[986,1383],[940,1405],[805,1395]],M.AIR);
rect(798,1391,196,16,M.STEEL);rect(802,1406,185,6,M.BRASS);
for(const [xx,yy,rr] of [[827,1320,20],[889,1309,27],[961,1332,15]]){disk(xx,yy,rr,M.BRONZE);disk(xx,yy,rr-8,M.OBSIDIAN);rect(xx-6,yy-5,12,10,M.CYAN);}
line(799,1273,858,1242,M.COPPER,7);line(972,1254,1000,1292,M.STEEL,7);
sampleRoom(771,1746,252,211,0);
// Exposed, physically rooted west observation/service shaft and right lab link.
rect(68,273,7,1432,M.IRON);rect(109,273,7,1432,M.IRON);
for(let y=299;y<1698;y+=22)rect(74,y,35,4,M.AMBER);
for(let y=294;y<1680;y+=145){rect(60,y,60,6,M.STEEL);rect(61,y-23,4,25,M.BRASS);}
rect(263,627,154,12,M.STEEL);rect(263,641,145,6,M.BRASS);
rect(751,644,180,11,M.STEEL);
for(let j=0;j<4;j++){let xx=811+j*43;rect(xx,397,30,114,M.GLASSBLOCK);rect(xx+5,405,20,98,M.OBSIDIAN);disk(xx+15,466,9+(j%3),M.URANIUM);line(xx+10,453,xx+21,476,M.PHOSPHOR,3);}
// ONE dominant physically coherent organism with supported roots and heterogeneous crown.
poly([[608,510],[649,538],[668,658],[655,790],[665,1019],[651,1210],[671,1489],[649,1717],[622,1918],[603,2020],[572,2020],[600,1836],[603,1551],[597,1231],[604,976],[590,734],[593,586]],M.COPPER);
poly([[621,533],[638,611],[645,804],[636,1049],[650,1410],[626,1755],[602,1963],[610,1675],[616,1360],[621,1016],[613,740]],M.OBSIDIAN);
const rootedBranches=[
[[630,610],[571,481],[504,368],[455,272]],
[[627,610],[694,475],[774,352],[821,261]],
[[625,564],[603,398],[565,258],[525,166]],
[[643,759],[730,653],[795,588]],
[[605,865],[517,787],[442,699]],
[[631,1120],[728,1045],[800,987]],
[[610,1303],[519,1242],[436,1153]],
[[637,1509],[736,1469],[836,1492]],
[[621,1720],[505,1663],[374,1653]],
[[616,1855],[716,1813],[854,1882]],
[[602,1961],[504,1995],[351,2014]]
];
rootedBranches.forEach((p,i)=>branch(p,i%3?M.VERDIGRIS:M.COPPER,20));
const crown=[[443,330],[470,252],[536,176],[602,153],[693,190],[769,244],[824,334],[784,397],[723,426],[640,437],[540,452],[479,405]];
for(let j=0;j<crown.length;j++){const a=crown[j],b=crown[(j+1)%crown.length];line(a[0],a[1],b[0],b[1],j%3?M.MOSS:M.VERDIGRIS,17);}
for(let j=0;j<11;j++){let xx=505+(j*41%273),yy=245+(j*37%155);
 line(623,464,xx,yy,j%2?M.COPPER:M.VERDIGRIS,5);
 disk(xx,yy,11+(j*7%19),j%2?M.MOSS:M.VERDIGRIS);
 disk(xx+2,yy-3,3+(j%3),M.PHOSPHOR);
}
// R2B follow-on: source's broad porous organism, rooted lobes and tissue chambers.
for(const [mat,p] of [
[M.COPPER,[[620,547],[565,491],[504,435],[463,374],[476,302],[527,260],[556,189],[607,170],[654,185],[689,256],[737,294],[780,364],[757,423],[699,482],[668,563]]],
[M.MOSS,[[586,448],[518,408],[487,355],[507,290],[562,245],[592,212],[647,207],[685,257],[731,318],[750,362],[712,415],[670,455],[631,491]]],
[M.VERDIGRIS,[[577,399],[523,382],[514,343],[551,296],[584,268],[644,254],[692,294],[718,335],[692,383],[662,425],[605,453]]]
])poly(p,mat);
for(const p of [
 [[618,575],[603,495],[577,421],[533,344],[491,310]],
 [[634,553],[654,474],[700,410],[738,361],[781,332]],
 [[641,553],[621,452],[613,349],[591,269],[568,196]],
 [[665,539],[675,465],[707,404],[748,384]]
])branch(p,M.COPPER,22);
for(const [x,y,w,h] of [[554,332,43,34],[633,295,52,43],[673,375,37,37],[580,417,43,28]]){
 poly([[x,y+8],[x+12,y-3],[x+w-9,y],[x+w,y+h-12],[x+w-12,y+h],[x+6,y+h-4]],M.URANIUM);
 disk(x+w*.47,y+h*.4,Math.min(w,h)*.19,M.PHOSPHOR);
}
// Bioluminescent specimen heart is not a mechanical ring.
disk(647,538,92,M.VERDIGRIS);disk(650,537,74,M.MOSS);disk(650,534,59,M.URANIUM);
disk(657,519,44,M.PHOSPHOR);disk(649,498,23,M.QUARTZ);
for(let j=0;j<17;j++){let a=j*6.283185/17;line(646+83*Math.cos(a),537+86*Math.sin(a),650+46*Math.cos(a+.25),535+50*Math.sin(a+.25),j%3?M.COPPER:M.MOSS,5);}
for(let j=0;j<18;j++){let xx=492+(j*47%308),yy=211+(j*33%160),len=37+j%5*23;line(xx,yy,xx+(j%2?8:-6),yy+len,j%3?M.VERDIGRIS:M.COPPER,2+(j%3));disk(xx+(j%2?8:-6),yy+len,3,M.PHOSPHOR);}
// Large descending tributaries in geologic transition, no recurring specimen medallions.
for(let j=0;j<8;j++){let yy=1113+j*122,xx=627+16*Math.sin(j*.68);
 branch([[xx,yy],[xx-57,yy+58],[xx-102-(j%3)*15,yy+92]],M.COPPER,12);
 branch([[xx,yy+18],[xx+69,yy+69],[xx+96+(j%4)*9,yy+118]],M.MOSS,11);
}
// A grounded continuous mid-shelf gantry; side bypass remains outside solid deck.
rect(250,1000,520,12,M.STEEL);rect(253,1012,514,7,M.BRASS);
for(let j=0;j<13;j++){let xx=256+j*39;line(xx,1010,xx+27,1034,j%2?M.COPPER:M.IRON,3);rect(xx,974,4,25,M.BRASS);rect(xx,975,36,3,M.BRASS);}
for(let xx of [252,428,739]){rect(xx,1014,10,67,M.CONCRETE);rect(xx+4,1021,3,44,M.IRON);}
// Mid-gantry transfer approaches now attach to unequal material-bank abutments.
poly([[253,999],[233,987],[201,1007],[208,1055],[249,1087],[278,1027]],M.GRANITE);
poly([[764,999],[788,986],[825,1015],[806,1063],[772,1084],[746,1018]],M.BASALT);
for(const [x,y,xe,ye] of [[267,1020,314,1102],[749,1020,714,1082],[458,1017,481,1100],[635,1020,616,1080]])line(x,y,xe,ye,M.BRONZE,8);
for(const [xx,yy,ww] of [[297,956,84],[472,948,116],[632,960,85]]){
 rect(xx,yy,ww,8,M.STEEL);rect(xx+9,yy-13,5,12,M.BRASS);rect(xx+17,yy-12,22,4,M.CYAN);
}
// Deeper root-service terraces show a real laboratory legacy, not copied upper tiers.
rect(159,1249,229,11,M.STEEL);rect(751,1416,232,12,M.STEEL);
rect(151,1643,246,13,M.CONCRETE);rect(778,1939,214,11,M.STEEL);
for(let j=0;j<4;j++){let xx=819+j*42;rect(xx,1793,29,66,M.STEEL);rect(xx+5,1798,19,54,M.OBSIDIAN);rect(xx+9,1829,11,5,M.CYAN);}
for(let j=0;j<4;j++){let xx=160+j*49;rect(xx,1502,31,69,M.GLASSBLOCK);rect(xx+5,1508,21,56,M.OBSIDIAN);line(xx+12,1517,xx+21,1540,M.PHOSPHOR,4);}
// Larger real cave apertures and varied supported root stone where old rooms were cleared.
poly([[0,1410],[110,1390],[157,1432],[218,1512],[176,1600],[0,1650]],M.BASALT);
poly([[1024,1388],[930,1417],[852,1470],[816,1590],[923,1651],[1024,1610]],M.GRANITE);
poly([[0,1807],[184,1722],[285,1811],[344,1956],[289,2035],[0,2048]],M.OBSIDIAN);
poly([[1024,1770],[926,1731],[819,1843],[791,1961],[862,2048],[1024,2048]],M.SLATE);


// Late R2 art pass: natural porous roof, layered crown and coherent lower ecology.
// Thick/luminous vascular forms are attached to the single central bole, not floating sprites.
function limb(pts,mat,width){for(let i=1;i<pts.length;i++)line(pts[i-1][0],pts[i-1][1],pts[i][0],pts[i][1],mat,Math.max(4,width-i*2));}
for(let j=0;j<25;j++){
  let xx=437+j*16,base=12+(j*9%24),drop=35+(j*23%70);
  rect(xx,0,11,base+12,j%4?M.OBSIDIAN:M.SLATE);
  line(xx+5,base,xx+10+(j%3)*6,base+drop,j%3?M.MOSS:M.VERDIGRIS,5+(j%3));
}
for(let j=0;j<34;j++){
  let xx=482+(j*59%297),yy=207+(j*47%217),anchor=[629,470+(j%4)*27];
  if(j%2===0)limb([anchor,[xx+27,yy+18],[xx,yy]],j%3?M.VERDIGRIS:M.MOSS,9);
  else limb([[632,507],[xx+15,yy+27],[xx,yy]],j%3?M.COPPER:M.MOSS,7);
  if(j%5===0){disk(xx,yy,13+(j%4)*4,M.MOSS);disk(xx+3,yy-5,5,M.PHOSPHOR);}
  else disk(xx,yy,5+(j%4)*2,M.VERDIGRIS);
}
// Dense wispy vascular crown weaving around genuinely traversable open cavities.
for(let j=0;j<11;j++){
  let yy=251+j*23,x=486+(j*17%77);
  limb([[620,567],[571,451],[x,yy]],j%3?M.VERDIGRIS:M.COPPER,8);
  disk(x-4,yy+3,7,M.MOSS);
}
for(let j=0;j<7;j++){
  let yy=300+j*25,x=747+(j*9%41);
  limb([[665,557],[707,440],[x,yy]],j%2?M.VERDIGRIS:M.MOSS,9);
}
// Specimen heart outer fleshy sheath and ribbed luminosity, still leaving 31x27 viewpoints free.
for(let j=0;j<9;j++){
  let a=-1.9+j*.48,xx=646+89*Math.cos(a),yy=537+87*Math.sin(a);
  line(xx,yy,646+68*Math.cos(a+.21),537+62*Math.sin(a+.21),j%3?M.MOSS:M.COPPER,7);
  disk(xx,yy,5,j%2?M.PHOSPHOR:M.URANIUM);
}
// Root-vault system gets genuine broad clustered buttresses, nested supports, vents and pores.
const deepRoots=[
 [[641,1146],[553,1216],[486,1306],[447,1380]],
 [[625,1265],[679,1329],[753,1395],[819,1436]],
 [[640,1460],[571,1538],[505,1610],[447,1714]],
 [[638,1562],[710,1650],[763,1727],[810,1814]],
 [[618,1772],[542,1844],[447,1912],[356,2019]],
 [[635,1838],[711,1901],[783,1965],[842,2020]]
];
deepRoots.forEach((p,i)=>{limb(p,i%2?M.MOSS:M.COPPER,26-i%3*3);
  for(let j=1;j<p.length;j++){let [x,y]=p[j],o=i%2?24:-21;limb([[x,y],[x+o,y-31],[x+o*1.5,y-49]],j%2?M.VERDIGRIS:M.COPPER,8);}}
);
for(let i=0;i<13;i++){
  let yy=1180+i*61,x=602+Math.sin(i*.47)*22;
  line(x,yy,x+34+(i%3)*10,yy+46,i%3?M.VERDIGRIS:M.BRONZE,6);
  rect(x-3,yy+13,6,13,i%2?M.PHOSPHOR:M.AMBER);
}
// Distinct supported geological alveoli around the lower roots; actual open cavities.
for(let i=0;i<11;i++){
 let y=1167+i*74,l=158+(i*13%68),r=847-(i*17%67);
 poly([[l-38,y+5],[l+18,y-24],[l+64,y+9],[l+34,y+40]],i%3?M.SLATE:M.MOSS);
 poly([[r+38,y+6],[r-18,y-22],[r-55,y+12],[r-24,y+42]],i%3?M.BASALT:M.VERDIGRIS);
}
for(let i=0;i<14;i++){
 let xx=424+(i*47%234),y=1895+(i*19%81);
 if(y<2019)line(xx,2019,xx+(i%3-1)*12,y,i%2?M.COPPER:M.VERDIGRIS,7);
}
// Rhizome geological transition, independent of upper laboratory grammar.
for(const [mat,p] of [
[M.BASALT,[[439,1203],[477,1195],[505,1219],[502,1263],[468,1291],[428,1265]]],
[M.GRANITE,[[667,1356],[710,1326],[744,1361],[726,1420],[683,1435],[656,1402]]],
[M.OBSIDIAN,[[439,1613],[479,1570],[530,1590],[536,1640],[495,1665],[450,1642]]],
[M.SLATE,[[685,1769],[720,1731],[767,1774],[741,1825],[688,1838],[667,1800]]]
])poly(p,mat);
for(const [x,y,dx,dy] of [[475,1222,-26,-58],[702,1390,26,-54],[493,1608,-36,-71],[723,1786,22,-66]]){
 line(x,y,x+dx,y+dy,M.COPPER,10);line(x+dx,y+dy,x+dx-17,y+dy-18,M.VERDIGRIS,6);
}
// Lower service corridors and destination variety.
rect(143,1732,189,11,M.STEEL);rect(144,1743,186,6,M.BRASS);
for(let i=0;i<4;i++){let xx=165+i*39;rect(xx,1666,26,58,M.FROST);rect(xx+4,1670,18,49,M.OBSIDIAN);disk(xx+13,1690,7,M.URANIUM);}
rect(783,1537,172,12,M.STEEL);
for(let i=0;i<3;i++){let xx=799+i*46;rect(xx,1473,33,57,M.BRONZE);rect(xx+5,1477,23,48,M.OBSIDIAN);rect(xx+8,1501,17,5,M.CYAN);}


// Real four-neighbour upper cliff attachment: organism is grounded through the
// eastern crown root into the roof, not just touching via visual pixels.
line(820,261,800,16,M.VERDIGRIS,13);
rect(789,0,26,43,M.SLATE);


// R2C — source-led organism and functional-ecology reconstruction, physical cells.
// Genuine source core is the upper/biosphere district; y>1000 is original,
// functionally connected subterranean extrapolation, NOT vertically stretched art.
// Replace prior little two-bulb crown and uniform-stalk geometry at its source.
rect(430,143,345,484,M.AIR);
// A broad asymmetric one-piece organic membrane, with distinct bony and soft rims.
poly([[443,260],[471,216],[504,206],[519,158],[567,174],[611,131],
 [648,161],[693,164],[735,193],[768,242],[757,280],[784,322],
 [761,359],[722,412],[684,454],[628,462],[599,491],[557,438],
 [526,435],[486,395],[448,367],[462,319]],M.MOSS);
poly([[454,273],[491,227],[538,221],[551,183],[594,206],[638,169],
 [687,211],[725,216],[747,262],[726,306],[751,336],[712,381],
 [693,422],[643,429],[613,448],[580,407],[542,407],[468,351]],M.VERDIGRIS);
poly([[479,269],[512,239],[551,250],[581,217],[629,199],[661,229],
 [703,246],[715,297],[685,349],[701,397],[654,411],
 [622,378],[578,400],[532,373],[493,351]],M.COPPER);
// Physical porous lacunae. Jagged, irregular holes permit readable large-scale
// branch silhouette; smaller off-axis pores carry a stronger mid-scale language.
const pores=[
 [[468,271],[484,249],[515,248],[525,277],[502,303],[474,299]],
 [[539,267],[563,232],[591,237],[594,264],[570,289]],
 [[623,207],[646,191],[672,210],[670,244],[638,260]],
 [[697,266],[720,263],[737,289],[705,316],[682,301]],
 [[484,326],[510,316],[532,330],[522,356],[489,356]],
 [[554,317],[573,293],[594,315],[581,344],[562,342]],
 [[598,376],[614,347],[638,351],[647,378],[625,398]],
 [[704,349],[730,334],[746,346],[717,374],[697,373]],
 [[555,386],[570,369],[586,388],[569,409],[546,405]]];
for(const p of pores)poly(p,M.AIR);
// An unusually large off-centre irregular bioluminescent biological heart,
// not an indexed pair of circles or an all-solid rectangle.
poly([[592,285],[615,254],[652,243],[682,255],[718,288],
 [721,328],[701,375],[668,407],[635,396],[608,377],
 [580,356],[578,315]],M.VERDIGRIS);
poly([[600,299],[625,272],[661,259],[686,279],[701,311],
 [692,353],[670,383],[643,385],[612,365],[590,335]],M.URANIUM);
poly([[613,301],[646,270],[671,279],[690,311],[675,337],
 [683,356],[647,373],[612,349],[599,325]],M.PHOSPHOR);
poly([[633,296],[653,281],[667,299],[654,319],[628,314]],M.QUARTZ);
for(const [m,p] of [
 [M.URANIUM,[[592,320],[605,311],[616,324],[612,342],[598,349]]],
 [M.QUARTZ,[[662,346],[677,335],[683,349],[671,367],[653,364]]],
 [M.VERDIGRIS,[[701,313],[715,301],[728,324],[714,341],[699,337]]]
])poly(p,m);
// Irregular bounded vascular woven ribs: no repeated radius fans or detached
// pixel confetti. Rooted to the envelope and into the lower axial system.
for(const [m,w,p] of [
 [M.COPPER,13,[[619,384],[578,395],[535,412],[512,438]]],
 [M.MOSS,17,[[678,386],[716,416],[731,455]]],
 [M.VERDIGRIS,14,[[590,315],[566,276],[543,235]]],
 [M.COPPER,11,[[687,290],[715,263],[750,254]]],
 [M.MOSS,17,[[628,270],[610,233],[599,199]]],
 [M.COPPER,12,[[672,372],[690,403],[675,461]]]
])for(let i=1;i<p.length;i++)line(...p[i-1],...p[i],m,Math.max(7,w-i));
// Roof-root attachment (actual connected canopy, not suspended art).
for(const [x,y,xx,yy,w] of [
 [454,0,482,245,20],[533,0,554,194,14],[626,0,628,171,19],
 [743,0,755,242,15],[794,0,759,302,17]
])line(x,y,xx,yy,M.OBSIDIAN,w);
// Three substantial drifting differentiated trunks, not one ruler-straight
// column. Branched together into the source's deep organism foundation.
const axes=[
 [M.COPPER,34,[[581,421],[559,530],[584,653],[550,790],[577,919],
 [552,1074],[574,1217],[546,1399],[579,1580],[567,1760],[603,1950],[607,2041]]],
 [M.VERDIGRIS,42,[[649,400],[650,547],[623,680],[652,824],[623,1003],
 [650,1159],[613,1324],[648,1520],[613,1683],[644,1858],[610,2041]]],
 [M.MOSS,32,[[689,403],[715,531],[681,688],[699,809],[670,973],
 [689,1136],[668,1290],[685,1468],[651,1617],[681,1736],[664,1903],[611,2041]]]];
for(const [m,w,p] of axes){
 for(let i=1;i<p.length;i++){
  line(...p[i-1],...p[i],m,Math.max(23,w+(i%3)*3-4));
  if(i%3===2)line(p[i-1][0]+3,p[i-1][1],p[i][0]-2,p[i][1],M.COPPER,5);
 }
}
for(const [m,w,p] of [
 [M.COPPER,31,[[562,727],[520,755],[466,813],[425,853]]],
 [M.MOSS,34,[[684,833],[730,774],[771,736],[813,705]]],
 [M.VERDIGRIS,34,[[562,1155],[518,1210],[475,1237],[430,1261]]],
 [M.COPPER,37,[[663,1268],[710,1324],[748,1395],[823,1454]]],
 [M.MOSS,31,[[568,1518],[528,1586],[464,1640],[420,1707]]],
 [M.COPPER,39,[[660,1746],[715,1802],[751,1885],[832,1938]]],
 [M.VERDIGRIS,34,[[613,1905],[537,1963],[464,2009],[380,2044]]]
])for(let i=1;i<p.length;i++)line(...p[i-1],...p[i],m,Math.max(17,w-i*3));
// Biological siphon pockets, with cavities varied by district and asymmetry,
// not repeated rings. Distinct source glows follow rooted vascular contact.
const vessels=[
 [M.MOSS,[[556,698],[581,676],[625,705],[636,755],[601,786],[557,761]],
          [[580,726],[598,712],[621,735],[614,756],[587,763]]],
 [M.COPPER,[[599,1082],[650,1044],[689,1089],[672,1182],[632,1192],[587,1144]],
            [[614,1113],[642,1091],[665,1118],[651,1152],[620,1145]]],
 [M.VERDIGRIS,[[562,1436],[611,1402],[677,1443],[672,1531],[624,1556],[571,1517]],
               [[587,1473],[623,1451],[655,1470],[652,1501],[608,1512]]],
 [M.MOSS,[[570,1789],[624,1769],[695,1813],[691,1893],[644,1911],[578,1865]],
          [[605,1831],[644,1806],[676,1839],[662,1873],[627,1864]]]];
for(const [m,outer,inner] of vessels){poly(outer,m);poly(inner,M.AIR);}
for(const [m,p] of [
 [M.URANIUM,[[539,692],[557,680],[576,696],[569,715],[546,718]]],
 [M.PHOSPHOR,[[684,841],[706,822],[724,833],[712,853],[688,858]]],
 [M.URANIUM,[[657,1351],[682,1348],[696,1366],[676,1390],[653,1377]]],
 [M.PHOSPHOR,[[538,1641],[559,1614],[580,1638],[570,1658],[548,1654]]]
])poly(p,m);
// Two architecturally distinct functional chambers outside the source core:
// a west organic resin assay grotto and east specialist vial manifold; each has
// thick real walls, clear purpose and connected low-level floor structure.
rect(122,1086,253,194,M.AIR);
poly([[138,1135],[181,1096],[285,1102],[359,1147],[365,1238],
 [344,1268],[160,1268],[129,1239]],M.GRANITE);
poly([[154,1147],[187,1119],[287,1121],[336,1157],[343,1226],
 [328,1245],[176,1248],[148,1225]],M.AIR);
rect(152,1247,195,14,M.STEEL);rect(161,1261,181,8,M.BRASS);
poly([[171,1243],[177,1204],[191,1188],[213,1192],[230,1212],[232,1244]],M.COPPER);
poly([[182,1227],[190,1206],[213,1209],[218,1229]],M.OBSIDIAN);
for(const [x,y] of [[268,1179],[303,1189],[327,1174]]){line(x,1241,x-10,y,M.VERDIGRIS,9);line(x-10,y,x-28,y-17,M.MOSS,7);}
rect(150,1137,13,107,M.BASALT);rect(338,1159,11,88,M.BASALT);
rect(786,770,238,192,M.AIR);
poly([[789,814],[820,780],[979,788],[1013,826],[1024,852],
 [1024,956],[806,957],[786,939]],M.CONCRETE);
poly([[802,830],[828,801],[961,808],[990,835],[1008,868],
 [1008,922],[803,923]],M.AIR);
rect(800,925,219,16,M.STEEL);rect(813,941,187,7,M.BRASS);
for(const [x,w,h] of [[836,38,72],[887,50,96],[955,37,61]]){
 rect(x,831,w,h,M.GLASSBLOCK);rect(x+5,837,w-10,h-12,M.OBSIDIAN);
 poly([[x+12,859],[x+w/2,846],[x+w-13,863],[x+w-13,879],
 [x+w/2,892],[x+11,876]],M.URANIUM);
 rect(x-5,830,6,h+2,M.COPPER);rect(x+w,834,5,h,M.COPPER);
}
line(813,914,812,815,M.IRON,8);line(1006,919,996,821,M.IRON,8);
// Unique accessible lower root-processing/service alcoves, fully supported,
// no recycled windows or sparse floating striped ledges.
for(const [m,p] of [
 [M.BASALT,[[429,1274],[463,1238],[503,1252],[524,1290],[487,1321],[439,1312]]],
 [M.OBSIDIAN,[[736,1513],[771,1504],[814,1545],[789,1592],[742,1587],[724,1552]]],
 [M.GRANITE,[[455,1803],[498,1772],[543,1799],[530,1847],[481,1850],[449,1822]]]
])poly(p,m);
for(const [x,y,w] of [[438,1334,120],[639,1587,98],[465,1880,99]]){
 rect(x,y,w,10,M.STEEL);rect(x+8,y+10,w-20,8,M.BRASS);
 line(x+10,y+12,x+25,y+58,M.BRONZE,8);
 line(x+w-12,y+10,x+w-31,y+62,M.BRONZE,8);
}

// R2C self-critique: the first reconstruction retained polygonal empty sockets
// and disconnected-looking service shelves. Interweave organic vein ribs and
// give transfer decks physically traceable rooted/braced support.
for(const [m,w,p] of [
 [M.MOSS,6,[[486,269],[500,271],[523,291]]],
 [M.COPPER,7,[[540,257],[564,269],[586,260]]],
 [M.MOSS,5,[[623,209],[646,232],[667,228]]],
 [M.VERDIGRIS,8,[[686,272],[701,294],[728,286]]],
 [M.MOSS,6,[[485,340],[509,346],[532,340]]],
 [M.VERDIGRIS,6,[[555,321],[570,331],[591,320]]],
 [M.MOSS,7,[[608,363],[623,380],[641,377]]],
 [M.COPPER,6,[[705,350],[721,352],[738,347]]]
])for(let i=1;i<p.length;i++)line(...p[i-1],...p[i],m,w);
for(const [m,w,p] of [
 [M.COPPER,11,[[306,952],[290,989],[257,1004]]],
 [M.BRONZE,12,[[478,949],[499,985],[563,1002]]],
 [M.MOSS,15,[[641,961],[674,988],[721,1000]]],
 [M.STEEL,12,[[440,1336],[464,1376],[484,1435]]],
 [M.STEEL,11,[[465,1886],[493,1926],[539,1967]]]
])for(let i=1;i<p.length;i++)line(...p[i-1],...p[i],m,w);
// Bottom-right return vault is a crescent chemical collection and geological
// service chamber, not a mirrored bank of four specimen-window lab modules.
rect(778,1743,246,214,M.AIR);
poly([[778,1791],[819,1746],[929,1742],[993,1781],[1024,1826],
 [1024,1949],[962,1955],[848,1942],[789,1901]],M.BASALT);
poly([[800,1811],[835,1773],[932,1768],[977,1796],[1009,1836],
 [1008,1914],[954,1930],[850,1919],[805,1892]],M.AIR);
rect(807,1918,200,16,M.STEEL);rect(821,1935,183,7,M.BRASS);
for(const [xx,yy,rr] of [[839,1866,24],[911,1855,29],[982,1870,18]]){
 poly([[xx-rr,yy-4],[xx-rr+7,yy-rr],[xx+rr-5,yy-rr+4],
 [xx+rr,yy+rr-8],[xx+6,yy+rr],[xx-rr+4,yy+rr-6]],M.BRONZE);
 poly([[xx-rr+8,yy-4],[xx-rr+12,yy-rr+9],[xx+rr-13,yy-rr+10],
 [xx+rr-9,yy+rr-13],[xx+6,yy+rr-11],[xx-rr+10,yy+rr-12]],M.OBSIDIAN);
 rect(xx-6,yy-6,13,8,M.URANIUM);
}
line(817,1908,808,1825,M.COPPER,8);line(1001,1913,986,1820,M.IRON,9);
// Wide source-derived overhead canopy rest zone remains free of unsafe loose
// leaves; deep geology is extrapolated and none of this uses powder or liquid.

// The builder's existing late in-bounds actual Midge portal masks are retained
// verbatim and applied AFTER this authored geometry; no waypoint relocation.

// Deliberate collision-safe corridors, access portals and trans-bole openings.
// Last-pass cuts are deliberate no-build clearance masks and never secretly substituted waypoint anchors.
rect(343,22,74,2000,M.AIR);rect(702,22,74,2000,M.AIR);
for(const r of left){let cy=r.y+Math.floor(r.h*.58);rect(265,cy-45,160,90,M.AIR);rect(260,cy-30,90,60,M.AIR);}
for(const r of right){let cy=r.y+Math.floor(r.h*.58);rect(704,cy-45,75,90,M.AIR);rect(701,cy-30,78,60,M.AIR);}
const crossings=[490,922,1318,1576,1890];for(const y of crossings)rect(398,y-31,143,64,M.AIR);
// A top service traverse and lower escape lane without blocking floor closure.
rect(338,66,448,64,M.AIR);rect(340,2000,445,22,M.AIR);
// Exact semantic inspection anchors are located in real entrance-side airspace,
// deliberately separated from specimen exhibits, sensor machinery and biology.
const destinations=[
 ...left.map(r=>[r.name,[286,r.y+Math.floor(r.h*.58)]]),
 ...right.map(r=>[r.name,[742,r.y+Math.floor(r.h*.58)]]),
 ["CROWN ATRIUM",[514,94]],["UPPER ANASTOMOSIS",[515,490]],
 ["MIDDLE VASCULAR",[515,922]],["LOWER LUMEN",[515,1576]],
 ["ROOT RETURN",[514,1890]],["DEEP EXIT",[368,1994]]
];

// New R2 semantic sites supplement and do not rewrite the 17 historical targets.
destinations.push(
 ["WEST DOME",[369,208]],["LIFT SERVICE",[368,550]],
 ["LUMINOUS CANOPY VIEW",[513,532]],["EAST VIAL WINDOWS",[743,484]],
 ["GANTRY WEST PORTAL",[370,930]],["GANTRY EAST PORTAL",[742,931]],
 ["DEEP ROOT TRAVERSE",[515,1750]]
);
const spawn=[369,95];

/* Distinct open biological passageways between trunk segments. These are
   solid upper/lower framing details, not blocked navigation crossings:
   a >=46-cell uninterrupted central passage is retained in each frame. */
for(const [i,y] of [490,922,1318,1576,1890].entries()){
 const top=i%2?M.COPPER:M.VERDIGRIS,bottom=i%2?M.STEEL:M.BRONZE;
 // Broken upper/lower sheath creates a believable service portal instead of
 // two abruptly sliced trunk stumps. A 50px-tall unobstructed core remains.
 rect(435,y-30,151,4,top);
 rect(441,y+28,147,4,bottom);
 for(let j=0;j<6;j++){
   const xx=449+j*25;
   rect(xx,y-29,7,3,j%2?M.AMBER:M.PHOSPHOR);
   rect(xx+4,y+29,7,3,j%2?M.CYAN:M.BRASS);
 }
 // Root sockets above/below (no vertical wall is allowed in the lane).
 line(437,y-30,449,y-39,top,4);
 line(585,y-29,573,y-40,top,4);
 line(442,y+31,456,y+39,bottom,4);
 line(590,y+31,576,y+39,bottom,4);
}
// Last-pass real observation access preserved after decorative portal sheaths.
rect(402,500,148,68,M.AIR);
// Fully closed exterior frame; always leave room-side portals intact.
rect(0,0,9,H,M.BASALT);rect(W-9,0,9,H,M.BASALT);rect(0,H-9,W,9,M.BASALT);
// The single giant specimen is physically anchored into the actual bottom rock.
// A 20-cell root footing intentionally interrupts the lowest open emergency line;
// upper and side bypass corridors retain all exact Midge operational sites.
line(610,1969,610,2044,M.COPPER,20);
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
const details={upper:pngRegion(192,115,640,640,1),middle:pngRegion(191,715,640,640,1),lower:pngRegion(191,1295,640,640,1),west:pngRegion(35,90,640,640,1),east:pngRegion(382,260,640,640,1)};
const evidence={rework_b:{date:'2026-11-17',scope:'physical terrain geometry and lab architecture',baseline_head:'1088e49b2537a9c7805b1a5efe263b203141ddc5',baseline_rectangles:27428,baseline_reachable_clearance_centres:649989,notes:'Six distinct botanical root/vascular strata, eleven individually dressed functional labs, five root-framed cross-portals; clearances cut and verified after detail geometry'},source_public_id:"techn-0021",source_key:"batch1/image-0058",target:[W,H],seed:SEED,rectangles:edits.length,rectangle_budget:32768,json_bytes:json.length,json_byte_budget:1048576,stamped_cells:stamped,material_cells_verified:A.length,mismatches,used_material_ids:Object.keys(hist).map(Number).sort((a,b)=>a-b),material_counts:hist,clearance_envelope:[19,15],connected_clearance_centres:count,spawn,waypoints,actual_native_godot_rapier_qualification:"NOT EXECUTED",original_reference_pixel_comparison:"NOT EXECUTED: GitHub binary image connector refuses PNG bytes",original_dimensions:"UNVERIFIED"};

function envelopeAudit(w,h){
 const hx=(w-1)>>1,hy=(h-1)>>1,pitch=W+1;
 const I=new Int32Array((W+1)*(H+1));for(let y=0;y<H;y++){let s=0;for(let x=0;x<W;x++){s+=A[y*W+x]?1:0;I[(y+1)*pitch+x+1]=I[y*pitch+x+1]+s;}}
 const free=new Uint8Array(A.length);for(let y=hy;y<H-hy;y++)for(let x=hx;x<W-hx;x++){
  let l=x-hx,r=x+hx+1,t=y-hy,b=y+hy+1;if(I[b*pitch+r]-I[t*pitch+r]-I[b*pitch+l]+I[t*pitch+l]===0)free[y*W+x]=1;
 }
 let q=new Int32Array(A.length),vis=new Uint8Array(A.length),sp=spawn[1]*W+spawn[0];
 if(!free[sp])throw Error('Blocked original spawn at '+w+'x'+h);
 q[0]=sp;vis[sp]=1;let n=1;
 for(let k=0;k<n;k++){let p=q[k],x=p%W,y=(p/W)|0;
  if(x>0&&free[p-1]&&!vis[p-1]){vis[p-1]=1;q[n++]=p-1;}
  if(x<W-1&&free[p+1]&&!vis[p+1]){vis[p+1]=1;q[n++]=p+1;}
  if(y>0&&free[p-W]&&!vis[p-W]){vis[p-W]=1;q[n++]=p-W;}
  if(y<H-1&&free[p+W]&&!vis[p+W]){vis[p+W]=1;q[n++]=p+W;}
 }
 const failed=destinations.filter(d=>!free[d[1][1]*W+d[1][0]]||!vis[d[1][1]*W+d[1][0]]).map(d=>({name:d[0],point:d[1]}));
 return {envelope:[w,h],legal_connected_centres:n,exact_sites:destinations.length,passed:destinations.length-failed.length,failed};
}
const audits=[[19,15],[23,19],[31,27]].map(([w,h])=>envelopeAudit(w,h));
if(audits.some(a=>a.failed.length))throw Error('Exact Midge site clearance failure: '+JSON.stringify(audits));
evidence.rework_b={date:'2026-11-18',scope:'second substantive source-led organism canopy and differentiated districts / gantry / lower rhizome repair',starting_head:'134b4dadf74a3df45362d92d6c869c21ecf814b2',source_jpeg_seen:true,original_png_pixels_verified:false,archival_merged_baseline_unvalidated:true,notes:'Historical source is 640x360 landscape; this tall 1024x2048 adaptation preserves the visible source complex at a deliberately scaled upper district and authors coherent older root/service levels below; not stretched screenshot or repeated organism.'};
evidence.rework_c={"date":"2026-11-18","assigned_head":"c40e9b4dff051e833316c38a3c885781a332aece","source_jpeg_blob":"64d7df6352b12d1aa57ce85f4925a722705bba1d","source_jpeg_actually_viewed":true,"original_full_png_parity":"UNVERIFIED","source_derived":"upper local one-specimen biosphere: dome, lift, vial wing and guarded gantry","newly_extrapolated":"older deep rhizome, assay grotto, rooted geology and return services below","repairs":"porous integrated crown/bright off-centre bioheart, multiple drifting supported trunks, asymmetrical scientific districts, braced transfers, distinctive service vault, secondary vein polish","native":"NATIVE-UNTESTED"};
evidence.clearance_envelopes=audits;
evidence.waypoints=destinations.map(([name,point])=>({name,point,clear:true,reachable:true}));
evidence.actual_native_godot_rapier_qualification='NATIVE-UNTESTED: compatible installed binary, Midge input/collision/simulation and save/reopen not exercised.';
evidence.original_reference_pixel_comparison='AUTHENTIC JPEG preview viewed and compared; full-resolution original PNG parity UNVERIFIED';
evidence.original_dimensions='JPEG preview 640x360; original full PNG dimensions UNVERIFIED';
evidence.material_physics='All non-Empty IDs are accepted-main immutable Solid / RuleKernel::None; excludes powder Stone, fluids, growth, agents and unsupported pseudo IDs.';
evidence.installed_bridge_rectangle_capacity='UNMEASURED: accepted source 32768; older fallback 4096 would reject this manifest.';
evidence.material_cell_png_crops={
  'containment-tree-preview.png':{rect:[0,0,1024,2048],step:2},
  'containment-tree-detail-upper.png':{rect:[192,115,640,640],step:1},
  'containment-tree-detail-middle.png':{rect:[191,715,640,640],step:1},
  'containment-tree-detail-lower.png':{rect:[191,1295,640,640],step:1},
  'containment-tree-detail-west.png':{rect:[35,90,640,640],step:1},
  'containment-tree-detail-east.png':{rect:[382,260,640,640],step:1}
};

return {json,png,details,evidence};
}
module.exports={generate};
