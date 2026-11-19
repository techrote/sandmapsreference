/* CyberSand original industrial vertical: fixed-seed standalone builder. Node >=18. */
const build = function build(){
"use strict";
const W=1024,H=2048,SEED=0x26111805,ENGINE="018bd09503d7f079ddac52e225c2f7daf8d678bf";
const ROOT="cybersand-canvases/1024x2048/original-industrial-vertical-severed-counterweight-261118";
const PAL={0:[8,11,18,255],1:[82,91,106,255],3:[47,127,210,255],14:[218,198,238,255],29:[166,74,42,255],31:[105,108,112,255],38:[197,191,175,255],39:[199,156,98,255],40:[119,119,130,255],43:[163,80,59,255],50:[50,58,64,255],58:[119,123,128,255],62:[126,141,153,255],63:[49,100,119,255],64:[109,125,134,255],65:[124,63,43,255],66:[74,85,93,255],68:[102,119,129,255],69:[165,92,54,255],70:[200,210,203,255],72:[37,60,76,192],73:[36,37,41,255],74:[60,53,68,255],76:[227,182,47,255],77:[55,243,228,255],78:[255,61,184,255],79:[255,181,46,255],80:[236,248,255,255],98:[226,223,216,255],100:[54,56,61,255],101:[24,19,32,255],111:[200,196,186,255],117:[90,94,100,255],119:[196,160,72,255],120:[156,210,220,204],129:[26,46,94,255],130:[34,36,41,255],131:[26,26,29,255]};
const INERT=new Set([1,31,38,39,40,43,50,58,62,63,64,65,66,68,69,70,72,73,74,76,77,78,79,80,98,100,101,111,117,119,120,129,130,131]);
let seed=SEED>>>0;const rand=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296;};
const pick=a=>a[Math.floor(rand()*a.length)],grid=new Uint8Array(W*H);
function box(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);let x1=Math.max(0,x),y1=Math.max(0,y),x2=Math.min(W,x+w),y2=Math.min(H,y+h);if(x2<=x1||y2<=y1)return;for(let yy=y1;yy<y2;yy++)grid.fill(m,yy*W+x1,yy*W+x2);}
function line(x1,y1,x2,y2,thick,m){let dx=x2-x1,dy=y2-y1,n=Math.max(Math.abs(dx),Math.abs(dy));for(let i=0;i<=n;i++){let x=Math.round(x1+dx*i/Math.max(n,1)),y=Math.round(y1+dy*i/Math.max(n,1));box(x-Math.floor(thick/2),y-Math.floor(thick/2),thick,thick,m);}}
function frame(x,y,w,h,t,m){box(x,y,w,t,m);box(x,y+h-t,w,t,m);box(x,y,t,h,m);box(x+w-t,y,t,h,m);}
function lite(x,y,id=79){box(x-5,y-3,10,6,id);box(x-2,y+3,4,3,62);}
function gusset(x,y,w,h,m=50){line(x,y,x+w,y+h,3,m);line(x+w,y,x,y+h,3,m);box(x-2,y-2,w+4,4,62);box(x-2,y+h-2,w+4,4,62);}
function pipe(points,m=69,t=3){for(let i=1;i<points.length;i++)line(points[i-1][0],points[i-1][1],points[i][0],points[i][1],t,m);for(let i=1;i<points.length-1;i++)box(points[i][0]-4,points[i][1]-4,9,9,119);}
function chamber(x,y,w,h,kind){frame(x,y,w,h,7,58);box(x+8,y+9,w-16,6,65);box(x+8,y+h-15,w-16,6,50);for(let k=0;k<3;k++){let xx=x+15+k*Math.floor((w-30)/3);box(xx,y+15,4,h-30,64);}
 if(kind==="winch"){for(let i=0;i<3;i++){let cx=x+24+i*46;frame(cx,y+34,38,52,5,62);box(cx+10,y+48,18,24,130);lite(cx+19,y+26,77);}pipe([[x+8,y+h-30],[x+42,y+h-30],[x+42,y+h-7]],69,4);}
 if(kind==="sorter"){for(let i=0;i<3;i++){let xx=x+14+i*48;line(xx,y+22,xx+42,y+70,5,65);line(xx+42,y+70,xx+46,y+100,5,50);box(xx+9,y+102,28,5,76);}box(x+12,y+h-35,w-24,6,119);}
 if(kind==="pressure"){for(let i=0;i<3;i++){let cx=x+30+i*48;frame(cx-12,y+30,24,72,4,69);box(cx-7,y+41,14,40,72);lite(cx,y+116,i===1?77:79);}pipe([[x+8,y+h-20],[x+w-8,y+h-20]],68,4);}
 if(kind==="relay"){for(let i=0;i<4;i++){let xx=x+18+i*32;box(xx,y+25,23,35,73);box(xx+4,y+29,15,8,i%2?78:77);}for(let yy=y+75;yy<y+h-20;yy+=22)box(x+18,yy,w-36,3,69);}
}
function girder(x,y,w,h){frame(x,y,w,h,5,62);for(let yy=y+15;yy<y+h-24;yy+=36)gusset(x+7,yy,w-14,29,50);}
function gantry(x1,x2,y,gateX){ // bridge with a flight slot through the tie level
 for(let x=x1;x<x2;x+=32){if(Math.abs(x-gateX)<27)continue;box(x,y+21,Math.min(30,x2-x),6,62);box(x+4,y+13,3,8,65);box(x+20,y+13,3,8,65);}
 box(x1,y+32,x2-x1,3,50);for(let x=x1+14;x<x2-20;x+=48){if(Math.abs(x-gateX)<34)continue;line(x,y+32,x+26,y+49,3,65);}
}
function tunnel(points,width){let half=Math.floor(width/2);for(let i=1;i<points.length;i++){let a=points[i-1],b=points[i];if(a[0]===b[0])box(a[0]-half,Math.min(a[1],b[1])-half,width,Math.abs(b[1]-a[1])+width,0);else if(a[1]===b[1])box(Math.min(a[0],b[0])-half,a[1]-half,Math.abs(b[0]-a[0])+width,width,0);else throw Error("nonrectilinear route");}}
const SITES=[
 {id:"A",name:"Crown dispatch",at:[520,145],district:"Sky intake"},
 {id:"B",name:"Signal lantern bridge",at:[520,290],district:"Sky intake"},
 {id:"C",name:"Western winch desk",at:[205,575],district:"Counterweight cathedral"},
 {id:"D",name:"Eastern thrust control",at:[800,700],district:"Counterweight cathedral"},
 {id:"E",name:"Ore assay alcove",at:[205,1030],district:"Sorting and crushers"},
 {id:"F",name:"Main ore exchange",at:[595,1060],district:"Sorting and crushers"},
 {id:"G",name:"Central rail interlock",at:[514,1335],district:"Rail funnel"},
 {id:"H",name:"Pressure switchroom",at:[800,1400],district:"Rail funnel"},
 {id:"I",name:"Salvage retrieval dock",at:[205,1765],district:"Quench and reclamation"},
 {id:"J",name:"Furnace inspection perch",at:[800,1750],district:"Quench and reclamation"},
 {id:"K",name:"Bottom lift terminal",at:[494,1910],district:"Quench and reclamation"}];
const ROUTES={
 central:[[520,145],[520,342],[558,342],[558,620],[484,620],[484,930],[595,930],[595,1125],[514,1125],[514,1420],[576,1420],[576,1640],[494,1640],[494,1940]],
 west:[[205,300],[205,1850]],
 east:[[800,270],[800,1880]],
 crossovers:[
 [[205,450],[558,450]],[[205,900],[595,900]],[[205,1460],[576,1460]],[[205,1825],[494,1825]],
 [[558,350],[800,350]],[[484,760],[800,760]],[[514,1190],[800,1190]],[[576,1640],[800,1640]],[[494,1850],[800,1850]]
 ]};
// 1. Strata and geological curtain; seeded widths but not pixel noise.
for(let y=80;y<H;y+=32){
 let a=94+Math.round(16*Math.sin(y/119)+11*Math.sin(y/43)),b=923+Math.round(14*Math.sin(y/139+2)+7*Math.sin(y/41));
 box(0,y,Math.max(72,a),32,pick([100,100,101,40]));box(b,y,1024-b,32,pick([100,101,40,100]));
 if(y%128===80){box(9,y+7,Math.max(16,a-18),3,65);box(b+4,y+16,1000-b,3,50);}
}
for(let y=125;y<H-70;y+=97){box(24+(y*11)%39,y,26+(y%3)*8,12,pick([40,101,65]));box(934+(y%27),y+18,23,9,pick([38,65,40]));}
// 2. Structural twin spines, orthogonally supported from bedrock.
box(109,92,17,1909,58);box(894,92,18,1909,58);
box(330,160,18,1795,58);box(676,160,18,1795,58);
for(let y=154;y<1942;y+=218){box(94,y,46,14,65);box(879,y,48,14,65);box(321,y,35,12,62);box(667,y,34,12,62);}
for(let y=220;y<1920;y+=154){gusset(127,y,44,94,50);gusset(847,y,44,94,50);}
// 3. Collimated elevator tracks and sheaves, no fake perspective.
for(let x of [363,373,645,655])box(x,133,3,1840,68);
for(let y=188;y<1920;y+=82){box(357,y,25,7,62);box(638,y,25,7,62);box(362,y+5,10,4,76);box(650,y+5,10,4,76);}
for(let y of [154,450,710,963,1220,1470,1780,1920]){
 box(350,y,325,6,50);box(351,y+7,325,3,65);
 for(let x of [375,640])box(x-8,y-5,18,17,119);
}
// 4. High crown: six unequal intake stacks and massive cable bridge.
box(135,95,730,12,62);box(157,79,692,8,65);
for(let [x,w,h] of [[163,35,64],[240,22,84],[291,31,43],[722,38,95],[793,27,58],[839,20,74]]){
 frame(x,95-h,w,h+2,5,58);box(x+5,102-h,w-10,8,50);lite(x+Math.floor(w/2),110-h,79);
}
girder(405,99,214,72);frame(451,183,126,78,6,62);box(462,196,103,20,72);box(474,219,80,7,76);
pipe([[159,194],[159,132],[344,132],[344,218]],69,4);pipe([[870,196],[870,126],[686,126],[686,218]],68,4);
for(let x=428;x<=597;x+=19)lite(x,168,77);
// 5. Counterweight cathedral: left sheave bank, right control, hanging mass.
girder(133,375,190,110);chamber(135,515,188,147,"winch");
girder(707,385,181,134);chamber(712,610,177,136,"relay");
frame(408,475,133,158,7,50);box(420,499,110,108,65);box(428,510,94,17,76);for(let yy=541;yy<595;yy+=14)box(436,yy,78,4,62);
for(let x of [436,505])box(x,342,5,133,68);
frame(585,537,76,91,6,58);box(595,549,56,65,130);for(let yy=556;yy<611;yy+=12)box(603,yy,38,2,119);
for(let y of [320,571,842]){box(127,y,201,10,62);box(696,y+22,193,11,65);}
gantry(352,667,694,484);
for(let [x,y] of [[152,360],[282,498],[727,533],[858,756]]){frame(x,y,28,38,4,62);box(x+7,y+10,14,10,77);}
// 6. Ore handling zone: asymmetric steep ore throats, industrial sorting.
chamber(140,870,184,172,"sorter");chamber(707,935,179,144,"relay");
for(let x of [143,179,285]){box(x,765,9,103,58);box(x-7,757,23,7,76);}
line(275,852,320,895,7,65);line(320,895,274,924,7,62);
frame(394,848,83,68,6,58);box(405,857,60,50,130);for(let yy=867;yy<898;yy+=10)box(410,yy,49,3,119);
for(let y=882;y<1195;y+=77){box(127,y,31,8,65);box(866,y+13,28,7,62);}
for(let x=716;x<887;x+=22){box(x,1135,17,10,76);box(x,1145,17,5,50);}
pipe([[315,806],[315,840],[374,840],[374,1040],[413,1040]],69,5);
pipe([[703,837],[754,837],[754,922],[856,922]],68,4);
// 7. Rail funnel, orthogonal cradles and switchworks.
box(128,1262,198,17,62);box(696,1275,195,17,62);
frame(143,1304,180,126,6,58);chamber(717,1334,168,155,"pressure");
girder(350,1250,144,54);girder(535,1320,132,66);
for(let yy of [1289,1356,1491]){box(354,yy,312,6,62);for(let xx=367;xx<651;xx+=43)gusset(xx,yy+8,35,26,65);}
for(let x=155;x<325;x+=16){box(x,1498,11,7,76);box(x+2,1506,7,4,50);}
pipe([[139,1206],[139,1245],[310,1245],[310,1302]],69,5);
pipe([[887,1224],[863,1224],[863,1325],[812,1325]],68,5);
for(let y of [1230,1530]){lite(365,y,77);lite(655,y,79);}
// 8. Lower reclamation: heat shield, quench vessel and salvage lift dock.
girder(140,1595,184,74);frame(137,1700,192,149,7,58);chamber(718,1695,162,104,"relay");
for(let x=710;x<890;x+=21){box(x,1598,14,33,131);box(x+3,1588,9,9,79);}
frame(720,1875,164,131,9,58);box(730,1948,145,45,3);box(734,1937,137,11,120);
box(719,1998,168,16,58);box(730,2002,147,3,119);
for(let x of [739,801,862]){box(x,1883,6,58,68);box(x,1897,9,7,76);}
frame(381,1807,249,106,7,62);box(391,1821,229,12,65);
for(let x=400;x<616;x+=42)gusset(x,1835,32,41,50);
frame(436,1923,129,89,8,58);box(448,1951,104,24,130);box(447,1979,106,8,76);
pipe([[310,1563],[310,1681],[355,1681],[355,1841]],69,5);
pipe([[711,1730],[697,1730],[697,1890],[716,1890]],68,5);
// 9. Side shaft habitation: levels, switchboards, suspended static gantries.
for(let [y,width] of [[344,196],[693,177],[1049,185],[1539,176],[1885,198]]){
 box(128,y,width,9,65);box(701,y+17,187,10,62);
 for(let x of [136,278]){box(x,y-36,7,34,50);box(x-4,y-43,14,8,76);}
 for(let x of [712,862]){box(x,y-34,7,33,65);box(x-4,y-41,15,7,119);}
}
for(let [y,x1,x2,g] of [[450,339,672,520],[760,350,676,558],[900,345,676,595],[1190,348,676,514],[1460,345,675,576],[1640,345,674,576],[1825,346,670,494]])
 gantry(x1,x2,y,g);
for(let y=210;y<1940;y+=113){box(128,y,14,9,62);box(878,y+36,16,8,62);lite(137,y+12,79);lite(887,y+48,77);}
// 9b. Three distinctive large-scale machines to break repetition and anchor the skyline.
// The high crusher cassette is bolted to the east main pier, not floating in flight space.
frame(532,797,136,132,7,58);box(540,808,120,103,130);
for(let k=0;k<5;k++){let y=817+k*18;box(552,y,92,5,k%2?65:62);box(559+(k%2)*11,y+6,75,4,119);}
box(539,792,129,11,76);box(644,800,25,22,62);box(662,817,22,8,58);
for(let x of [551,637])box(x,710,4,86,68);
frame(553,951,111,62,6,50);box(560,957,96,46,72);for(let x=565;x<645;x+=15)box(x,982,10,12,79);
// Pressurized rail-logic rack and mechanical return of the broken counterweight.
frame(545,1261,126,95,7,62);box(553,1270,109,70,73);
for(let y=1277;y<1334;y+=12){box(561,y,87,5,65);box(565,y+6,19,4,77);box(614,y+6,27,4,79);}
pipe([[663,1264],[685,1264],[685,1344],[706,1344]],69,5);
box(552,1358,112,9,76);gusset(561,1373,91,44,65);
// The salvage hoist stays on the other side of the actual central return lane.
frame(548,1651,120,152,7,58);box(557,1662,101,126,130);
for(let x of [565,640])box(x,1550,5,101,68);
box(560,1674,96,18,65);for(let y=1703;y<1785;y+=18){box(564,y,88,5,62);box(567,y+6,84,4,119);}
for(let x=572;x<647;x+=22)box(x,1795,15,8,76);
box(656,1705,23,8,58);box(658,1765,21,8,58);
// Literal accessible workshop alcove at the upper western crown.
frame(135,202,178,112,6,58);box(143,211,162,22,130);
for(let x=155;x<289;x+=32){box(x,243,23,28,62);box(x+5,248,13,9,77);}
box(144,284,158,7,65);box(288,206,27,8,69);
// 10. Mandatory navigable cores and crossovers carved *after* every fixture.
tunnel(ROUTES.central,54);tunnel(ROUTES.west,60);tunnel(ROUTES.east,60);
for(let p of ROUTES.crossovers)tunnel(p,58);
// carve meaningful subsidiary pockets without adding fake destination substitution
box(139,982,72,58,0);box(800,1530,87,74,0);
box(253,410,77,85,0);box(695,684,104,64,0);
box(250,1772,92,65,0);box(686,1152,93,69,0);
// Add bulkhead visible external to flight envelopes and service markers.
for(let [x,y] of [[343,450],[678,350],[343,900],[678,760],[343,1460],[678,1190],[343,1825],[678,1640]]){
 box(x-4,y-43,8,13,62);box(x-4,y+30,8,13,62);lite(x,y-42,77);lite(x,y+42,79);
}
for(const [x,y] of [[115,520],[231,1030],[763,700],[838,1400],[845,1735],[524,289],[516,1335],[568,1909]]){
 // status beacons intentionally outside 31x27 flight envelope
 lite(x+22,y-28,79);box(x+15,y-26,4,19,69);
}
// Field review repair: eliminate seemingly suspended fixtures with literal attachments.
box(122,220,20,8,62);box(122,290,20,8,62);
box(466,166,7,22,62);box(558,166,7,22,62);
box(310,507,30,8,62);box(658,554,27,8,62);box(692,545,36,7,65);
// A *sealed* static quench cistern, isolated from the right-hand flight exit;
// replace the roof that the earlier clearance carve intentionally opened.
box(719,1875,167,9,58);box(726,1884,153,3,65);
for(let x=731;x<873;x+=29)box(x,1877,10,3,76);
for(let x=720;x<884;x++){if(grid[1875*W+x]===0||grid[2005*W+x]===0)throw Error("Quench basin upper/lower boundary broken at "+x);}
for(let y=1875;y<2006;y++){if(grid[y*W+720]===0||grid[y*W+883]===0)throw Error("Quench basin sidewall broken at "+y);}
// 11. Shepherd-directed R3 original physical-cell art pass. Post-navigation
// geometry is masked from conservative flight corridors and from the Water tank.
// The ops are immutable deterministic source strokes, not image sampling.
const ART_OPS=[["B",373,473,167,9,50],["B",373,644,167,9,50],["B",373,473,9,180,50],["B",531,473,9,180,50],["B",384,484,145,156,65],["B",389,487,135,20,76],["B",394,516,121,72,130],["B",398,523,110,5,62],["B",404,528,8,7,50],["B",493,528,8,7,50],["B",398,535,110,5,62],["B",404,540,8,7,50],["B",493,540,8,7,50],["B",398,547,110,5,62],["B",404,552,8,7,50],["B",493,552,8,7,50],["B",398,559,110,5,62],["B",404,564,8,7,50],["B",493,564,8,7,50],["B",398,571,110,5,62],["B",404,576,8,7,50],["B",493,576,8,7,50],["L",379,475,360,503,6,62],["L",529,479,550,507,6,62],["B",401,594,113,19,119],["B",391,615,136,14,76],["B",402,633,8,25,50],["B",428,633,8,25,50],["B",485,633,8,25,50],["B",515,633,8,25,50],["L",350,683,414,632,10,62],["L",349,698,424,680,8,58],["L",369,710,441,658,8,65],["B",344,702,104,13,58],["B",342,713,88,9,76],["B",417,353,7,70,68],["L",423,418,445,447,5,68],["L",451,459,464,470,4,69],["L",481,472,503,501,4,69],["B",432,441,12,10,76],["L",410,491,415,514,4,50],["L",430,491,432,514,4,50],["L",450,491,449,514,4,50],["L",470,491,466,514,4,50],["B",375,715,69,8,62],["L",340,707,378,734,6,50],["B",372,946,110,8,58],["B",372,1101,110,8,58],["B",372,946,8,163,58],["B",474,946,8,163,58],["B",381,957,92,15,65],["B",385,978,84,62,130],["L",381,976,421,1031,6,119],["L",471,976,429,1031,6,119],["B",409,1033,35,27,76],["B",415,1060,24,47,119],["B",391,1084,70,7,62],["B",393,980,76,3,62],["B",393,991,76,3,65],["B",393,1002,76,3,62],["B",393,1013,76,3,65],["B",393,1024,76,3,62],["B",348,1075,26,6,62],["L",335,1090,377,1058,6,65],["B",324,1094,20,6,119],["B",612,956,66,7,58],["B",612,1132,66,7,58],["B",612,956,7,183,58],["B",671,956,7,183,58],["B",622,967,46,155,130],["L",629,979,663,990,5,119],["B",631,991,28,4,76],["L",629,1002,663,1013,5,119],["B",631,1014,28,4,76],["L",629,1025,663,1036,5,119],["B",631,1037,28,4,76],["L",629,1048,663,1059,5,119],["B",631,1060,28,4,76],["L",629,1071,663,1082,5,119],["B",631,1083,28,4,76],["L",629,1094,663,1105,5,119],["B",631,1106,28,4,76],["B",642,1138,12,35,68],["B",652,1135,23,7,119],["B",676,1100,29,13,62],["L",687,995,705,1023,6,65],["B",683,1020,39,7,76],["B",694,1106,12,35,68],["B",395,1111,74,13,65],["B",403,1125,10,10,119],["B",418,1125,10,10,119],["B",433,1125,10,10,119],["B",448,1125,10,10,119],["B",463,1125,10,10,119],["L",682,1096,714,1123,4,69],["B",702,1123,12,29,62],["B",378,1242,105,7,62],["B",378,1407,105,7,62],["B",378,1242,7,172,62],["B",476,1242,7,172,62],["B",389,1254,84,137,130],["L",392,1271,461,1321,6,65],["L",461,1271,393,1321,6,65],["B",397,1332,67,9,76],["L",398,1344,454,1382,6,50],["L",454,1344,398,1382,6,50],["B",402,1396,59,10,119],["B",364,1401,110,9,65],["L",336,1413,389,1385,8,58],["B",350,1412,27,12,76],["B",386,1227,10,9,79],["B",403,1227,10,9,79],["B",420,1227,10,9,79],["B",437,1227,10,9,79],["B",454,1227,10,9,79],["B",605,1381,76,8,58],["B",605,1526,76,8,58],["B",605,1381,8,153,58],["B",673,1381,8,153,58],["B",614,1394,58,102,130],["B",617,1401,52,7,119],["B",626,1409,30,4,76],["B",617,1418,52,7,65],["B",626,1426,30,4,76],["B",617,1435,52,7,119],["B",626,1443,30,4,76],["B",617,1452,52,7,65],["B",626,1460,30,4,76],["B",617,1469,52,7,119],["B",626,1477,30,4,76],["B",617,1486,52,7,65],["B",626,1494,30,4,76],["B",609,1504,66,15,65],["B",616,1519,7,8,119],["B",628,1519,7,8,119],["B",640,1519,7,8,119],["B",652,1519,7,8,119],["B",664,1519,7,8,119],["B",629,1315,5,66,68],["B",657,1327,5,54,68],["B",602,1371,83,11,76],["L",688,1383,724,1361,7,62],["B",704,1353,47,9,65],["L",685,1507,744,1541,6,50],["B",692,1544,60,9,65],["B",704,1553,54,10,76],["B",696,1263,50,7,65],["L",696,1263,735,1283,5,62],["B",739,1280,23,9,119],["B",251,1280,68,7,58],["B",251,1402,68,7,58],["B",251,1280,7,129,58],["B",312,1280,7,129,58],["B",259,1292,52,19,131],["B",264,1318,43,56,65],["B",271,1327,29,6,79],["B",271,1338,29,6,79],["B",271,1349,29,6,79],["B",271,1360,29,6,79],["L",317,1284,347,1312,6,62],["L",319,1400,354,1380,7,50],["B",253,1408,66,9,119],["B",274,1424,38,5,62],["B",252,1562,77,7,62],["B",252,1649,77,7,62],["B",252,1562,7,94,62],["B",322,1562,7,94,62],["B",260,1572,59,24,130],["B",270,1607,37,12,76],["L",327,1563,353,1592,5,50],["B",325,1640,24,12,65],["B",709,811,69,7,58],["B",709,890,69,7,58],["B",709,811,7,86,58],["B",771,811,7,86,58],["B",719,823,48,43,130],["B",725,832,34,8,79],["L",688,897,740,921,6,62],["B",690,927,56,10,65],["B",714,1532,58,6,62],["B",714,1625,58,6,62],["B",714,1532,6,99,62],["B",766,1532,6,99,62],["B",724,1545,39,49,73],["B",731,1553,23,5,79],["B",731,1567,23,5,77],["B",731,1581,23,5,79],["L",689,1610,720,1585,6,58],["B",697,1673,68,8,58],["B",697,1819,68,8,58],["B",697,1673,8,154,58],["B",757,1673,8,154,58],["B",706,1684,50,121,131],["B",711,1692,40,8,65],["B",717,1700,28,6,76],["B",711,1708,40,8,65],["B",717,1716,28,6,79],["B",711,1724,40,8,65],["B",717,1732,28,6,79],["B",711,1740,40,8,65],["B",717,1748,28,6,76],["B",711,1756,40,8,65],["B",717,1764,28,6,79],["B",711,1772,40,8,65],["B",717,1780,28,6,79],["B",711,1788,40,8,65],["B",717,1796,28,6,76],["B",700,1815,57,8,119],["B",692,1817,15,11,62],["L",681,1786,703,1820,5,50],["B",673,1694,24,13,76],["L",667,1700,698,1730,6,62],["B",705,1644,66,7,62],["L",691,1623,719,1646,7,50],["B",585,1723,83,6,62],["B",585,1775,83,6,62],["B",585,1723,6,58,62],["B",662,1723,6,58,62],["B",595,1733,65,28,130],["B",601,1742,52,8,119],["L",677,1779,697,1809,6,65],["B",681,1808,19,9,76],["B",713,1830,68,13,65],["L",707,1835,687,1825,5,62]];
const R3_PROTECT=new Uint8Array(W*H);
function r3ProtectBox(x,y,w,h){let x1=Math.max(0,x),y1=Math.max(0,y),x2=Math.min(W,x+w),y2=Math.min(H,y+h);for(let yy=y1;yy<y2;yy++)R3_PROTECT.fill(1,yy*W+x1,yy*W+x2);}
function r3Mark(points,r){for(let k=1;k<points.length;k++){let [x,y]=points[k-1],[u,v]=points[k];r3ProtectBox(Math.min(x,u)-r,Math.min(y,v)-r,Math.abs(x-u)+2*r+1,Math.abs(y-v)+2*r+1);}}
r3Mark(ROUTES.central,43);r3Mark(ROUTES.west,45);r3Mark(ROUTES.east,45);for(const path of ROUTES.crossovers)r3Mark(path,44);for(const site of SITES)r3ProtectBox(site.at[0]-35,site.at[1]-33,71,67);r3ProtectBox(705,1861,199,164);
function r3Put(x,y,m){if(x>=0&&x<W&&y>=0&&y<H&&!R3_PROTECT[y*W+x]&&grid[y*W+x]!==3)grid[y*W+x]=m;}
let r3Changed=0;const r3Prior=grid.slice();for(const op of ART_OPS){if(op[0]==="B"){let [_,x,y,w,h,m]=op;for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)r3Put(xx,yy,m);}else{let [_,x,y,u,v,t,m]=op,dx=u-x,dy=v-y,n=Math.max(Math.abs(dx),Math.abs(dy));for(let k=0;k<=n;k++){let xx=Math.round(x+dx*k/Math.max(n,1)),yy=Math.round(y+dy*k/Math.max(n,1));for(let j=yy-Math.floor(t/2);j<yy-Math.floor(t/2)+t;j++)for(let i=xx-Math.floor(t/2);i<xx-Math.floor(t/2)+t;i++)r3Put(i,j,m);}}}
for(let i=0;i<grid.length;i++)if(grid[i]!==r3Prior[i])r3Changed++;
if(r3Changed!==93351||grid.reduce((a,v)=>a+(v===3),0)!==6525)throw Error("R3 art fingerprint/water preservation mismatch");

 // R4 structural closure: seven previously detached major machine components
 // now have real four-connected load paths to world-edge Solid foundations.
 // Selected gallery crossings are sacrificed rather than drawing fake braces.
 const R4_BRIDGES=[
  ["east crane hanger",[[642,313,7,77,68],[634,310,23,10,62],[634,384,23,10,62]]],
  ["west counterweight catch column",[[327,410,7,80,58],[319,405,23,12,62],[319,484,23,12,62]]],
  ["east crusher transfer support",[[760,931,79,8,62],[751,924,19,21,58],[831,925,18,21,58]]],
  ["rail freight abutment",[[758,1269,85,11,62],[750,1262,20,24,58],[834,1262,18,24,58]]],
  ["lower west cage collar",[[339,1786,8,78,58],[333,1778,20,17,62],[333,1855,20,16,62]]],
  ["lower east salvage hoist",[[642,1810,8,78,68],[635,1801,22,17,62],[635,1880,22,17,62]]],
  ["crusher to exchange transverse load bridge",[[466,1115,167,8,62],[463,1108,15,22,58],[624,1108,15,22,58]]]
 ];
 const beforeR4=grid.slice();
 for(const [name,ops] of R4_BRIDGES)for(const rect of ops)box(...rect);
 // Industrial gravity-feed motifs. The east downfeed has a deliberate free
 // 57-cell crossover gap at y1161..1217; no continuous false machinery bridge.
 for(const op of [
 [454,1083,8,162,69],[448,1082,20,8,62],[445,1239,23,10,119],
 [739,1127,8,34,68],[739,1218,8,52,68],[737,1128,12,13,62],[662,1269,85,9,65]
 ])box(...op);
 let r4Changed=0,r4ProtectedChanged=0;
 for(let i=0;i<grid.length;i++)if(grid[i]!==beforeR4[i]){r4Changed++;if(R3_PROTECT[i])r4ProtectedChanged++;}
 function r4Audit(){
  const label=new Int32Array(W*H),q=new Int32Array(W*H),components=[],unanchored=[];label.fill(-1);
  for(let i=0;i<grid.length;i++){if(label[i]>=0||grid[i]===0||grid[i]===3)continue;
   const id=components.length;let head=0,tail=1,edge=false,l=W,t=H,rr=0,b=0;q[0]=i;label[i]=id;
   while(head<tail){let v=q[head++],x=v%W,y=(v-x)/W;if(x===0||x===W-1||y===0||y===H-1)edge=true;l=Math.min(l,x);rr=Math.max(rr,x);t=Math.min(t,y);b=Math.max(b,y);
    for(const u of [x>0?v-1:-1,x<W-1?v+1:-1,y>0?v-W:-1,y<H-1?v+W:-1]){
     if(u<0||label[u]>=0||grid[u]===0||grid[u]===3)continue;label[u]=id;q[tail++]=u;}}
   const c={id,size:tail,world_edge_anchored:edge,bounds:[l,t,rr,b]};components.push(c);if(!edge&&tail>1000)unanchored.push(c);
  }
  const probes=[
   ["upper east control",[645,379]],["western failed counterweight",[330,479]],
   ["east crusher housing",[769,935]],["central ore exchange",[330,1146]],
   ["rail switch/cargo",[769,1275]],["west salvage processor",[342,1795]],
   ["east salvage plant",[645,1820]]
  ].map(([name,[x,y]])=>({name,point:[x,y],material:grid[y*W+x],component:label[y*W+x],anchored:label[y*W+x]>=0&&components[label[y*W+x]].world_edge_anchored}));
  if(probes.some(p=>!p.anchored))throw Error("R4 major support probe failed: "+JSON.stringify(probes.filter(p=>!p.anchored)));
  if(unanchored.some(c=>c.size>10000))throw Error("R4 retains unanchored >10000-cell assembly");
  return{total_solid_components:components.length,major_world_edge_anchored:components.filter(c=>c.world_edge_anchored&&c.size>10000),unanchored_over_1000:unanchored,all_seven_major_probes_anchored:true,probes};
 }
 const R4_STRUCTURAL=r4Audit();

 // R5: exact-cell industrial calamity, supported process routes and freight hall.
 // Original art, no sampled image, no actor, physics or source material changes.
 const R5_prior=grid.slice();
 function r5Poly(poly,m){let ys=poly.map(v=>v[1]);for(let y=Math.ceil(Math.min(...ys));y<=Math.floor(Math.max(...ys));y++){let xs=[];for(let k=0;k<poly.length;k++){let a=poly[k],b=poly[(k+1)%poly.length];if(a[1]!==b[1]&&y+.5>=Math.min(a[1],b[1])&&y+.5<Math.max(a[1],b[1]))xs.push(a[0]+(y+.5-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let k=0;k+1<xs.length;k+=2){let x=Math.ceil(xs[k]),w=Math.floor(xs[k+1])-x+1;if(w>0)box(x,y,w,1,m);}}}
 // Catastrophic upper lift: rupture in previously intact roof, two cut tensile
 // strands and a heavy slumped eccentric weight caught by real west-pier steel.
 box(337,88,46,23,0);line(320,86,346,102,11,65);line(381,104,405,89,9,62);
 box(344,114,10,64,68);line(349,182,364,253,5,68);box(359,253,5,107,68);
 box(383,110,5,185,69);line(387,295,409,327,5,69);box(406,326,5,49,69);
 for(let i=0;i<5;i++)line(355+i*3,360+i*3,349+i*5,380+i*2,2,i%2?76:68);
 box(401,383,38,15,62);line(397,396,381,422,9,65);
 r5Poly([[326,394],[461,400],[509,420],[532,444],[533,510],[513,553],[469,583],[411,598],[343,590],[294,561],[273,509],[277,451]],50);
 r5Poly([[334,405],[461,412],[497,438],[511,467],[509,520],[484,555],[437,579],[354,572],[311,543],[293,504],[296,452]],65);
 r5Poly([[353,420],[460,424],[490,451],[491,510],[468,550],[421,560],[363,552],[333,515],[326,471]],130);
 for(let j=0;j<7;j++)box(362,443+j*17,105,6,j%2?58:62);
 line(304,448,358,489,10,76);line(491,421,517,464,9,119);
 line(331,568,384,601,9,76);line(470,565,442,590,7,119);
 box(327,573,11,120,58);line(335,680,405,609,13,62);line(351,635,429,676,10,65);
 box(327,682,130,13,58);box(357,694,82,11,76);
 for(let x=351;x<430;x+=20)box(x,658,12,14,119);
 // Crusher line with true 2D overhead intake, transfer bridge and split
 // high/low gravity feed around preserved mid-shaft Midge crossover.
 box(314,814,26,41,62);line(330,854,357,886,8,65);
 line(348,921,380,955,7,65);box(351,935,26,10,119);
 box(378,1102,91,14,65);line(449,1109,476,1121,9,62);
 box(466,1105,167,14,62);for(let x=475;x<619;x+=22)box(x,1108,13,8,119);
 line(639,1110,662,1128,7,69);box(663,1129,8,31,68);
 box(662,1220,9,53,68);line(667,1272,700,1300,8,65);
 // Rail hall: distinctive long continuous double-ended rail and one loaded
 // 2D cart staged ABOVE the track; preserve the y1460 flight crossing.
 box(339,1538,188,12,62);box(608,1538,159,12,62);
 for(let x=351;x<515;x+=28)box(x,1552,13,6,119);
 for(let x=620;x<765;x+=28)box(x,1552,13,6,119);
 box(350,1507,127,12,65);box(359,1494,98,16,130);box(365,1478,85,14,119);
 box(374,1518,19,15,50);box(437,1518,19,15,50);
 box(380,1523,9,7,76);box(443,1523,9,7,76);
 line(351,1443,374,1401,7,62);line(450,1441,469,1410,7,62);
 box(386,1369,7,68,68);box(450,1381,7,58,68);
 box(368,1560,147,10,58);line(367,1566,345,1603,8,62);line(509,1566,524,1602,8,62);
 // Salvage discharge and intentionally separated quench lookout platforms.
 // No altered Water or basin-wall material and no faked animated equipment.
 box(614,1818,80,11,65);line(685,1818,714,1847,8,62);
 box(717,1829,59,8,58);box(729,1838,44,6,119);box(839,1836,39,7,58);
 // Six identified significant formerly unanchored modules: tie five or more
 // physically to nearby actual solid load-bearing spines, not to empty air.
 box(683,393,32,9,62);box(683,647,43,9,62);box(301,1341,39,8,62);
 box(312,1729,30,8,62);box(310,1885,38,9,62);box(545,1960,130,8,62);
 let r5Changed=0,r5LiquidTouched=0;
 for(let i=0;i<grid.length;i++)if(grid[i]!==R5_prior[i]){r5Changed++;if(grid[i]===3||R5_prior[i]===3)r5LiquidTouched++;}
 if(r5LiquidTouched!==0||grid.reduce((a,m)=>a+(m===3),0)!==6525)throw Error("R5 quench Water identity changed");
 const R5_STRUCTURAL=r4Audit();
 if(R5_STRUCTURAL.unanchored_over_1000.length>=R4_STRUCTURAL.unanchored_over_1000.length)throw Error("R5 insufficient support closure");


// R6: fracture/force-path, replacing concentric fan-like load with sheared shell.
 const R6_prior=grid.slice();
 r5Poly([[487,425],[536,419],[537,475],[515,468],[503,454]],0);
 r5Poly([[514,514],[534,512],[538,555],[503,577],[477,570],[496,550]],0);
 box(349,440,127,115,130);
 r5Poly([[345,449],[366,436],[464,443],[478,459],[466,471],[370,469]],58);
 r5Poly([[346,516],[370,529],[463,533],[478,552],[433,565],[363,546]],65);
 for(let y of [471,497,523]){line(353,y,466,y+13,5,62);box(374,y+4,7,4,119);box(440,y+11,7,4,119);}
 line(473,442,500,466,11,76);line(468,526,495,550,10,76);
 line(347,461,330,488,10,65);line(330,488,347,521,9,58);
 box(359,383,26,20,62);box(363,401,21,9,119);
 box(422,382,32,16,62);box(430,397,18,23,65);
 line(376,304,378,349,6,68);line(379,353,393,370,7,68);
 line(411,318,424,348,5,69);line(424,348,435,363,5,69);
 line(387,380,397,394,6,119);line(433,369,445,386,7,119);
 box(418,401,30,14,50);box(424,405,13,5,76);
 r5Poly([[334,573],[367,582],[389,603],[370,619],[328,601]],65);
 line(329,609,371,633,10,62);line(374,627,411,600,9,58);
 box(326,672,132,10,50);for(let x=342;x<445;x+=24)box(x,677,11,12,119);

// R6 ore: geometric ore intake, segmented real stationary chute, buffered receiver.
 r5Poly([[343,942],[368,968],[386,991],[390,1017],[372,1017],[356,990]],65);
 box(369,1018,27,12,62);box(387,1024,10,84,69);
 // Both inlet and outlet walls flank the narrow Midge escape,
 // not an illusory continuous conveyor. Use staged independent trays.
 box(397,1084,83,7,58);box(397,1116,83,7,62);
 for(let x=408;x<470;x+=19){box(x,1092,12,7,119);box(x+4,1100,5,5,65);}
 box(552,1084,82,7,58);box(552,1116,84,7,62);
 for(let x=562;x<629;x+=19){box(x,1092,12,7,119);box(x+4,1100,5,5,65);}
 box(624,1087,17,44,65);box(641,1127,25,9,76);
 line(651,1141,662,1155,7,69); // nozzle terminates here
 box(651,1214,28,8,76);box(663,1222,10,40,65); // receiver begins below the pilot gate
 r5Poly([[685,1240],[749,1240],[746,1269],[732,1284],[708,1284],[694,1268]],50);
 r5Poly([[692,1246],[743,1246],[737,1261],[729,1275],[713,1275],[704,1261]],119);
 box(674,1278,45,10,62);line(685,1286,675,1311,7,58);
 box(722,1281,9,16,65);


// R6 freight/quench: a hanging loading hood directly above the actual wagon.
 box(351,1388,139,9,62);box(346,1397,9,38,58);box(481,1397,9,38,58);
 for(let x of [373,462])box(x,1397,7,54,68);
 box(395,1419,57,5,65);box(395,1424,6,17,65);box(446,1424,6,17,65);
 box(404,1428,38,7,119);for(let x=409;x<442;x+=12)box(x,1435,6,6,76);
 // Deliberately omit hanging diagonals: those sealed the narrow air passage.
 box(336,1506,14,42,50);box(336,1502,23,9,76);
 box(475,1506,11,42,50);box(470,1502,20,9,76);
 box(350,1567,164,7,62);box(615,1567,156,7,62);
 for(let x=359;x<506;x+=37)box(x,1562,7,5,76);
 for(let x=626;x<760;x+=37)box(x,1562,7,5,76);
 box(309,1561,33,8,65);line(312,1568,333,1602,7,58);
 box(687,1557,15,11,65);box(698,1551,9,17,58);
 // Heat-shielded collection runway, above and NOT inside Water.
 box(680,1810,18,34,58);box(687,1823,37,8,65);
 line(717,1835,742,1854,6,62);box(736,1854,39,6,119);
 box(747,1842,6,25,65);box(769,1842,6,25,65);
 box(735,1869,52,6,58);

// R6 angularized sheared forge-mass cap, overpaint old concentric drum.
// Widen engineering plates INSIDE existing mass footprint, never into flight.
 r5Poly([[310,421],[461,417],[500,443],[507,505],[473,558],[357,573],[304,540],[291,491]],65);
 r5Poly([[327,432],[456,429],[490,454],[481,517],[453,545],[353,553],[313,523]],130);
 r5Poly([[326,435],[359,422],[458,428],[481,453],[451,463],[332,458]],62);
 r5Poly([[450,530],[476,498],[509,505],[491,541],[467,556]],50);
 r5Poly([[489,502],[516,493],[519,522],[499,527]],0);
 r5Poly([[470,543],[514,536],[495,571],[460,572]],0);
 line(341,473,418,489,6,58);line(414,489,451,527,9,58);
 line(414,489,436,509,4,101);line(438,511,459,527,5,101);
 line(348,538,443,546,7,62);line(320,518,350,536,9,76);
 line(466,441,493,470,9,119);line(462,525,478,541,8,76);
 for(let y of [472,502,536]){box(340,y,11,6,119);box(449,y+3,10,5,119);}


 // R6 exact-original-cell before/after witness and structural closure.
 let r6Changed=0,r6LiquidChanged=0;
 for(let i=0;i<grid.length;i++)if(R6_prior[i]!==grid[i]){r6Changed++;if(grid[i]===3||R6_prior[i]===3)r6LiquidChanged++;}
 if(r6LiquidChanged||grid.reduce((n,m)=>n+(m===3),0)!==6525)throw Error("R6 Water conservation failure");
 const R6_STRUCTURAL=r4Audit();
 if(!R6_STRUCTURAL.all_seven_major_probes_anchored)throw Error("R6 loses primary rooted structure");
 if(R6_STRUCTURAL.unanchored_over_1000.length>1)throw Error("R6 introduces a large unsupported assembly");


 // R7 ORIGINAL INDUSTRIAL: a visibly failed shear plane and legible process nodes.
 // Guard formerly vacant 31x27-designed flight lanes; an existing solid can be
 // recut or repainted, but previously clear protected openings remain clear.
 const R7_prior=grid.slice();
 function r7ProtectedArt(paint){
   let previous=grid.slice();paint();
   for(let i=0;i<grid.length;i++)if(R3_PROTECT[i]&&previous[i]===0&&grid[i]!==0)grid[i]=0;
 }
 r7ProtectedArt(()=>{
   // Main broken counterweight: remove the circular right quarter as a *large*
   // diagonal shear zone, retain the grounded rear left load and arrest seat.
   r5Poly([[455,420],[537,417],[537,477],[502,480],[474,454]],0);
   r5Poly([[470,478],[507,475],[536,518],[527,568],[486,579],[447,549],[479,520]],0);
   r5Poly([[288,474],[312,434],[355,418],[437,422],[464,447],[459,484],[474,500],[446,553],[348,573],[301,541]],65);
   r5Poly([[304,466],[348,430],[436,435],[453,451],[446,486],[461,504],[439,540],[349,557],[317,523]],130);
   r5Poly([[438,450],[466,451],[448,492],[470,515],[442,552],[429,529],[437,499],[425,477]],50);
   line(435,443,453,472,9,119);
   line(450,478,437,508,8,76);
   line(440,517,457,540,6,69);
   line(338,536,391,559,10,62);
   line(317,497,351,530,8,119);
   // Open-to-air broken offside attachment and dislocated captured wedge.
   r5Poly([[484,521],[515,529],[516,556],[490,575],[473,555]],58);
   line(475,552,506,572,8,76);
   for(let y of [461,492,527,551]){box(326,y,11,7,62);box(415,y+4,8,5,119);}
   // Cable path: loaded western strand and a clearly broken east-ended strand.
   line(367,332,372,383,5,68);line(372,382,390,411,8,68);
   box(390,402,21,13,62);line(398,410,406,426,7,119);
   line(434,333,450,363,5,69);line(450,363,464,373,5,69);
   line(478,392,493,405,4,69);line(496,408,501,416,3,76);
   // Crush flange and structural impact: unequal seat planes and bent stop.
   box(327,649,125,9,50);line(346,638,397,603,11,62);
   line(389,632,447,592,10,58);box(327,679,146,13,65);
 });
 r7ProtectedArt(()=>{
   // Ore workface: distinct inlet throat, twin crusher jaws and binned output.
   r5Poly([[301,876],[352,886],[374,910],[365,927],[341,910],[315,905]],58);
   box(346,916,12,43,50);line(357,947,386,977,8,65);
   frame(362,966,78,74,7,62);box(373,978,56,46,130);
   for(let k=0;k<4;k++){line(377,984+k*11,411,1000+k*8,4,k%2?119:65);}
   box(379,1036,12,48,68);
   // Two unpowered discharge mouths are *separated by a flight aperture*.
   box(393,1073,80,8,65);box(396,1085,10,22,50);
   r5Poly([[400,1093],[441,1093],[452,1103],[420,1112]],119);
   box(558,1073,73,8,65);box(621,1082,12,31,50);
   r5Poly([[558,1093],[603,1093],[617,1103],[581,1112]],119);
   // Right product/waste bins distinctly aligned under its own downpipes.
   box(680,1163,10,31,68);box(713,1163,10,31,68);
   r5Poly([[667,1203],[731,1203],[722,1240],[683,1240]],50);
   r5Poly([[679,1209],[721,1209],[714,1229],[689,1229]],119);
   box(664,1239,71,10,62);
   // A separated, bolted return chute to the subsequent rail switching tier.
   box(689,1300,69,10,58);line(734,1288,745,1304,7,65);
 });
 r7ProtectedArt(()=>{
   // Freight: the single rail cart now has a serviceable, clearly delimited
   // loading platform, two stop buffers and an aimed (terminated) ore hood.
   box(261,1555,79,9,62);box(274,1564,13,43,58);
   box(260,1519,82,7,65);box(259,1527,7,26,50);
   box(321,1527,9,27,50);box(266,1534,47,12,130);
   box(285,1546,6,8,77);box(319,1499,20,21,76);
   box(480,1496,17,28,50);box(471,1494,30,7,76);
   box(390,1365,66,10,62);
   box(398,1375,7,35,68);box(449,1375,7,35,68);
   r5Poly([[402,1413],[455,1413],[445,1446],[412,1446]],50);
   r5Poly([[412,1418],[447,1418],[438,1435],[421,1435]],119);
   box(414,1447,34,5,76); // interrupted hoist: flyer can pass beneath
   // The approach is continuous up to the mandated open central flyer portal.
   box(302,1580,54,8,58);line(312,1587,337,1615,7,62);
 });
 r7ProtectedArt(()=>{
   // Quench service: dry, rooted processing gantry approaching *left end* of
   // the intact sealed tank without touching any Water or the bounding shell.
   box(639,1797,67,10,62);box(660,1790,10,11,119);
   line(702,1803,721,1818,7,65);box(707,1820,35,8,58);
   line(729,1828,743,1841,6,62);box(741,1838,10,28,65);
   box(738,1865,32,6,119);box(721,1870,23,5,62);
   box(676,1772,8,24,68);box(680,1763,25,9,62);
   // Safe control threshold with return-side inspection lamp.
   frame(693,1734,52,31,4,58);box(702,1742,33,8,77);
   box(689,1767,37,6,65);
 });
 let R7_CHANGED=0,R7_WATER_CHANGES=0;
 for(let i=0;i<grid.length;i++)if(grid[i]!==R7_prior[i]){R7_CHANGED++;if(grid[i]===3||R7_prior[i]===3)R7_WATER_CHANGES++;}
 if(R7_WATER_CHANGES!==0||grid.reduce((n,m)=>n+(m===3),0)!==6525)throw Error("R7 Water identities changed");
 const R7_STRUCTURAL=r4Audit();
 if(R7_STRUCTURAL.unanchored_over_1000.length>1)throw Error("R7 introduced detached major fixture "+JSON.stringify(R7_STRUCTURAL.unanchored_over_1000));


// R8 ORIGINAL: major industrial mass and functional plant repair, actual cells.
const R8_prior=grid.slice();
function r8Art(fn){
  const before=grid.slice();fn();
  for(let i=0;i<grid.length;i++){
    if(before[i]===3)grid[i]=3;
    if(R3_PROTECT[i]&&before[i]===0&&grid[i]!==0)grid[i]=0;
  }
}
r8Art(()=>{
  // Delete the dominant old circular/flywheel housing; reconstruct a fractured,
  // non-round shear counterweight tied to the original rooted western arrest.
  box(271,414,269,179,0);
  r5Poly([[295,441],[317,422],[439,420],[459,442],[437,471],[417,489],[433,505],[405,557],[383,584],[316,566],[290,542]],65);
  r5Poly([[306,450],[331,437],[426,437],[438,456],[414,479],[402,508],[416,519],[391,547],[365,564],[312,545],[301,517]],130);
  r5Poly([[326,452],[416,448],[404,465],[327,472]],58);
  r5Poly([[321,493],[397,488],[383,512],[318,522]],50);
  r5Poly([[323,533],[378,529],[360,549],[329,544]],58);
  r5Poly([[426,433],[451,441],[430,477],[409,492],[428,506],[398,550],[382,561],[396,511],[387,494],[412,474]],0);
  line(452,440,418,479,8,119);line(417,482,435,504,6,76);line(432,509,392,557,7,119);
  line(303,451,303,532,9,62);box(311,447,10,95,58);
  box(323,395,17,240,58);box(330,465,12,31,130);
  line(329,568,362,607,12,62);line(360,599,399,628,9,58);
  line(356,330,351,402,6,68);line(351,403,333,430,8,62);box(328,420,27,13,119);
  line(473,350,486,390,5,69);line(486,390,506,401,5,69);line(509,407,517,417,4,76);
  r5Poly([[449,556],[484,549],[510,561],[499,590],[468,607],[444,587]],58);
  r5Poly([[462,561],[492,562],[486,582],[466,591]],65);
  line(443,568,474,600,7,76);line(476,601,454,620,7,62);
  box(348,654,109,13,50);for(let x of [351,380,410,439])box(x,646,9,9,119);
});
r8Art(()=>{
  // Literal upstream feed->twin crusher jaws->terminated gate->receiver;
  // physical flight gaps stay open (no fictitious continuous conveyor).
  r5Poly([[337,841],[375,848],[382,897],[363,920],[352,897]],65);
  box(344,836,36,8,76);box(349,858,7,38,58);box(370,858,7,38,58);
  r5Poly([[356,920],[378,944],[386,964],[366,966],[347,944]],119);
  box(366,964,71,10,62);box(371,976,7,58,65);box(428,976,7,58,65);
  for(let j=0;j<4;j++){
    line(378,984+j*13,406,997+j*9,5,j%2?58:119);
    line(425,984+j*13,396,997+j*9,5,j%2?65:62);
  }
  box(380,1040,59,9,76);
  r5Poly([[381,1050],[440,1050],[427,1071],[395,1071]],50);
  box(401,1072,35,12,119);box(446,1088,24,9,65);
  box(617,1098,49,8,76);
  r5Poly([[629,1105],[668,1105],[685,1142],[653,1142]],65);
  box(647,1143,10,33,62);box(674,1143,10,33,62);
  r5Poly([[641,1170],[695,1170],[687,1201],[651,1201]],50);
  r5Poly([[652,1177],[681,1177],[676,1190],[657,1190]],119);
  box(637,1201,64,10,58);line(692,1200,699,1236,8,62);
});
r8Art(()=>{
  // Freight transfer: exact one-cart hood/load vertical, safe boarding side,
  // supported short tracks with meaningful buffers, no crossing the flight gap.
  box(377,1365,95,8,58);
  line(388,1371,388,1410,6,68);line(454,1371,454,1410,6,68);
  r5Poly([[390,1408],[455,1408],[444,1436],[408,1436]],65);
  r5Poly([[404,1414],[445,1414],[435,1427],[413,1427]],119);
  box(416,1437,8,29,68);box(417,1465,20,7,76);
  r5Poly([[394,1471],[451,1471],[447,1490],[401,1490]],50);
  box(406,1475,36,5,119);
  box(371,1510,97,7,62);box(374,1518,11,17,58);box(456,1518,11,17,58);
  box(253,1530,98,7,62);
  for(let x=265;x<344;x+=23)box(x,1537,9,7,65);
  box(249,1510,8,31,50);box(248,1505,19,7,76);
});
r8Art(()=>{
  // Salvage furnace -> dry receiving mouth -> anchored inspection/hoist
  // before sealed water quench. The Water basin/perimeter are not repainted.
  r5Poly([[632,1777],[676,1777],[692,1806],[662,1806]],65);
  box(648,1785,29,10,119);line(674,1802,714,1831,8,62);
  box(714,1827,92,7,58);line(720,1831,733,1850,7,65);
  line(791,1833,791,1850,6,68);box(764,1850,54,6,62);
  box(779,1857,20,8,119);
  frame(709,1800,47,24,4,58);box(719,1807,27,9,77);
  box(804,1827,5,31,65);
});
let R8_CHANGED=0,R8_WATER_CHANGES=0;
for(let i=0;i<grid.length;i++)if(grid[i]!==R8_prior[i]){
  R8_CHANGED++;if(grid[i]===3||R8_prior[i]===3)R8_WATER_CHANGES++;
}
if(R8_WATER_CHANGES||grid.reduce((n,m)=>n+(m===3),0)!==6525)throw Error("R8 Water identities changed");
const R8_STRUCTURAL=r4Audit();
if(!R8_STRUCTURAL.all_seven_major_probes_anchored)throw Error("R8 lost rooted machinery");
if(R8_STRUCTURAL.unanchored_over_1000.length>1)throw Error("R8 detached significant machinery");

 if(grid.reduce((a,m)=>a+(m===3),0)!==6525)throw Error("R4 Water conservation failure");

const HIST={};let occupied=0;for(const m of grid){HIST[m]=(HIST[m]||0)+1;if(m){occupied++;if(!INERT.has(m)&&m!==3)throw Error("Non-inert unexpected material "+m);}}
if(!(HIST[3]>0))throw Error("Quench Water was expected in the sealed lower sump"); // this is fatal only if coolant is fully erased
// Exact optimal by vertical coalescing of horizontal material runs.
let edits=[],prev=new Map();
for(let y=0;y<H;y++){let active=new Map(),off=y*W,x=0;while(x<W){let m=grid[off+x],start=x++;while(x<W&&grid[off+x]===m)x++;if(!m)continue;let width=x-start,key=start+":"+width+":"+m,index=prev.get(key);if(index!==undefined&&edits[index][1]+edits[index][3]===y){edits[index][3]++;active.set(key,index);}else{edits.push([start,y,width,1,m]);active.set(key,edits.length-1);}}prev=active;}
const replay=new Uint8Array(W*H);let work=0;for(const [x,y,w,h,m]of edits){if(!Number.isInteger(x)||x<0||y<0||x+w>W||y+h>H||!PAL[m])throw Error("invalid stamp");work+=w*h;for(let yy=y;yy<y+h;yy++){let p=yy*W+x;for(let xx=0;xx<w;xx++)if(replay[p+xx])throw Error("overlapping rectangle");replay.fill(m,p,p+w);}}
for(let i=0;i<grid.length;i++)if(grid[i]!==replay[i])throw Error("replay mismatch at "+i);
if(edits.length>32768)throw Error("too many rectangles: "+edits.length);
if(work>Math.min(64*W*H,32000000))throw Error("work budget exceeded");
const MIDGE_HASH="c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96";
const LIQ=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
const setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:MIDGE_HASH,spawn:[520,145],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.5}}],next_id:2,selected:1,edits,response:"LA-SELECTIVE",liquid_policy:LIQ,normalize:false,rule_radius:2,source:[],material:2,brush:8,fire:false};
const setupString=JSON.stringify(setup);
if(setupString.length>1048576)throw Error("1 MiB JSON budget exceeded "+setupString.length);
if(!([W,H].every(x=>x>=512&&x<=2048&&x%64===0)))throw Error("dimension mismatch");
// Collision envelope: padded rectangular footprint centered on actual named coordinate.
// No nearest-cell substitution, no pass-through of structural cells.
const st=W+1,sat=new Uint32Array((W+1)*(H+1));
for(let y=0;y<H;y++){let sum=0;for(let x=0;x<W;x++){sum+=(grid[y*W+x]!==0)?1:0;sat[(y+1)*st+x+1]=sat[y*st+x+1]+sum;}}
function clear(x,y,w,h){let l=x-Math.floor(w/2),t=y-Math.floor(h/2),r=l+w,b=t+h;if(l<0||t<0||r>W||b>H)return false;return sat[b*st+r]-sat[b*st+l]-sat[t*st+r]+sat[t*st+l]===0;}
function bfs(w,h,blocked){const vis=new Uint8Array(W*H),q=new Uint32Array(W*H);let sx=SITES[0].at[0],sy=SITES[0].at[1],sp=sy*W+sx;if(!clear(sx,sy,w,h))throw Error("spawn obstructed "+w+"x"+h);q[0]=sp;vis[sp]=1;let head=0,tail=1;while(head<tail){let p=q[head++],x=p%W,y=(p-x)/W;const ns=[[x-1,y],[x+1,y],[x,y-1],[x,y+1]];for(let [xx,yy] of ns){if(xx<0||yy<0||xx>=W||yy>=H)continue;let id=yy*W+xx;if(vis[id])continue;if(blocked&&xx>=blocked[0]&&xx<blocked[2]&&yy>=blocked[1]&&yy<blocked[3])continue;if(!clear(xx,yy,w,h))continue;vis[id]=1;q[tail++]=id;}}return{vis,count:tail};}
const flight=[];
for(let [w,h] of [[19,15],[23,19],[31,27]]){let {vis,count}=bfs(w,h);let reach=[];for(let s of SITES){let [x,y]=s.at,pass=clear(x,y,w,h)&&vis[y*W+x]===1;reach.push({id:s.id,at:s.at,clear:clear(x,y,w,h),reached:pass});if(!pass)throw Error("Unreachable EXACT "+s.id+" "+w+"x"+h);}flight.push({footprint:[w,h],reachable_sites:reach.length,total_sites:SITES.length,reachable_centers:count,sites:reach});}
const alt=bfs(31,27,[420,983,665,1006]);if(!alt.vis[SITES[SITES.length-1].at[1]*W+SITES[SITES.length-1].at[0]])throw Error("alternate route bypass blocked main lift throat");

function physicalThroatObstruction(){
 const solid=grid.slice(),r=[420,983,665,1006],stride=W+1;
 for(let yy=r[1];yy<r[3];yy++)solid.fill(58,yy*W+r[0],yy*W+r[2]);
 const integral=new Uint32Array((W+1)*(H+1));
 for(let yy=0;yy<H;yy++){let row=0;for(let xx=0;xx<W;xx++){row+=solid[yy*W+xx]!==0?1:0;integral[(yy+1)*stride+xx+1]=integral[yy*stride+xx+1]+row;}}
 function free(xx,yy){const l=xx-15,t=yy-13,r=l+31,b=t+27;
  if(l<0||t<0||r>W||b>H)return false;
  return integral[b*stride+r]-integral[b*stride+l]-integral[t*stride+r]+integral[t*stride+l]===0;
 }
 const start=SITES[0].at,vis=new Uint8Array(W*H),queue=new Uint32Array(W*H);
 if(!free(...start))throw Error("physical-block test spawn enclosed");
 const sp=start[1]*W+start[0];vis[sp]=1;queue[0]=sp;let head=0,tail=1;
 while(head<tail){let p=queue[head++],x=p%W,y=(p-x)/W;
  for(const [xx,yy] of [[x-1,y],[x+1,y],[x,y-1],[x,y+1]]){if(xx<0||yy<0||xx>=W||yy>=H)continue;
   let id=yy*W+xx;if(vis[id]||!free(xx,yy))continue;vis[id]=1;queue[tail++]=id;
  }
 }
 const sites=SITES.map(s=>({id:s.id,reached:!!vis[s.at[1]*W+s.at[0]]}));
 if(!sites.find(s=>s.id==="K").reached)throw Error("physical block closes bottom terminal");
 return {rectangle:r,footprint:[31,27],reachable_centers:tail,reachable_sites:sites.filter(s=>s.reached).length,total_sites:SITES.length,sites,terminal_reachable:true,obstruction:"physical Solid fill + complete 31x27 re-erosion + 4-neighbour BFS"};
}
const altPhysical=physicalThroatObstruction();

function bytes(text){let out=[];for(let i=0;i<text.length;i++){let n=text.charCodeAt(i);if(n<128)out.push(n);else if(n<2048)out.push(0xc0|(n>>6),0x80|(n&63));else out.push(0xe0|(n>>12),0x80|((n>>6)&63),0x80|(n&63));}return Uint8Array.from(out);}
function sha256(raw){let K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2],Hh=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];let n=raw.length,total=Math.ceil((n+9)/64)*64,pad=new Uint8Array(total);pad.set(raw);pad[n]=128;let len=n*8;let hi=Math.floor(len/4294967296),lo=len>>>0;for(let j=0;j<4;j++){pad[total-8+j]=(hi>>>(24-j*8))&255;pad[total-4+j]=(lo>>>(24-j*8))&255;}let w=new Int32Array(64),ro=(x,n)=>(x>>>n)|(x<<(32-n));for(let off=0;off<total;off+=64){for(let j=0;j<16;j++){let o=off+j*4;w[j]=(pad[o]<<24)|(pad[o+1]<<16)|(pad[o+2]<<8)|pad[o+3];}for(let j=16;j<64;j++){let a=w[j-15],b=w[j-2];w[j]=(w[j-16]+(ro(a,7)^ro(a,18)^(a>>>3))+w[j-7]+(ro(b,17)^ro(b,19)^(b>>>10)))|0;}let [a,b,c,d,e,f,g,h]=Hh;for(let j=0;j<64;j++){let t1=(h+(ro(e,6)^ro(e,11)^ro(e,25))+((e&f)^(~e&g))+K[j]+w[j])|0,t2=((ro(a,2)^ro(a,13)^ro(a,22))+((a&b)^(a&c)^(b&c)))|0;h=g;g=f;f=e;e=(d+t1)|0;d=c;c=b;b=a;a=(t1+t2)|0;}Hh=Hh.map((v,i)=>(v+[a,b,c,d,e,f,g,h][i])|0);}return Hh.map(v=>(v>>>0).toString(16).padStart(8,"0")).join("");}
if(sha256(bytes("abc"))!=="ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad")throw Error("SHA-256 self-test");
const CRC_TABLE=new Uint32Array(256);for(let i=0;i<256;i++){let c=i;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;CRC_TABLE[i]=c>>>0;}
function crc32(a){let c=0xffffffff;for(let v of a)c=CRC_TABLE[(c^v)&255]^(c>>>8);return(c^0xffffffff)>>>0;}
function u32(x){return[(x>>>24)&255,(x>>>16)&255,(x>>>8)&255,x&255];}
const LB=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],LE=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
const DB=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],DE=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];
function rev(x,n){let y=0;for(let k=0;k<n;k++){y=(y<<1)|(x&1);x>>>=1;}return y;}
function fcode(s){if(s<=143)return[rev(48+s,8),8];if(s<=255)return[rev(400+s-144,9),9];if(s<=279)return[rev(s-256,7),7];return[rev(192+s-280,8),8];}
function deflate(raw,stride){const out=[0x78,0x01];let bits=0,count=0;function put(v,n){bits|=v<<count;count+=n;while(count>=8){out.push(bits&255);bits>>>=8;count-=8;}}
 function sym(s){let a=fcode(s);put(a[0],a[1]);}
 put(1,1);put(1,2);let i=0;while(i<raw.length){let d=0,len=0;if(i>0&&raw[i]===raw[i-1]){let n=1;while(n<258&&i+n<raw.length&&raw[i+n]===raw[i-1])n++;if(n>=3){d=1;len=n;}}
 if(i>=stride&&raw[i]===raw[i-stride]){let n=1;while(n<258&&i+n<raw.length&&raw[i+n]===raw[i+n-stride])n++;if(n>=4&&n>len){d=stride;len=n;}}
 if(len>=3){let j=LB.length-1;while(j>0&&LB[j]>len)j--;sym(257+j);put(len-LB[j],LE[j]);let dc=DB.length-1;while(dc>0&&DB[dc]>d)dc--;put(rev(dc,5),5);put(d-DB[dc],DE[dc]);i+=len;}else{sym(raw[i]);i++;}}
 sym(256);if(count)out.push(bits&255);
 let a=1,b=0;for(let j=0;j<raw.length;j++){a+=raw[j];b+=a;if((j&4095)===4095){a%=65521;b%=65521;}}a%=65521;b%=65521;out.push(...u32(((b<<16)|a)>>>0));return Uint8Array.from(out);}
function pngFromGrid(x,y,w,h){const raw=new Uint8Array((w+1)*h);for(let row=0;row<h;row++)raw.set(grid.subarray((y+row)*W+x,(y+row)*W+x+w),row*(w+1)+1);
 let plte=new Uint8Array(256*3);for(let id of Object.keys(PAL)){let p=+id;plte.set(PAL[p].slice(0,3),p*3);}
 let out=[137,80,78,71,13,10,26,10];function chunk(type,data){let t=bytes(type),check=new Uint8Array(t.length+data.length);check.set(t);check.set(data,t.length);out.push(...u32(data.length));for(let v of t)out.push(v);for(let v of data)out.push(v);out.push(...u32(crc32(check)));}
 let ihdr=new Uint8Array([...u32(w),...u32(h),8,3,0,0,0]);chunk("IHDR",ihdr);chunk("PLTE",plte);
 let trns=new Uint8Array(132);trns.fill(255);for(let id of Object.keys(PAL))trns[+id]=PAL[id][3];chunk("tRNS",trns);
 chunk("IDAT",deflate(raw,w+1));chunk("IEND",new Uint8Array(0));return Uint8Array.from(out);
}
function inflateFixed(z,size){if(z[0]!==0x78||z[1]!==0x01)throw Error("bad zlib");let ptr=2,bit=0;function get(n){let v=0;for(let i=0;i<n;i++){if(ptr>=z.length-4)throw Error("deflate EOF");v|=((z[ptr]>>bit)&1)<<i;bit++;if(bit===8){bit=0;ptr++;}}return v;}
 const lit=new Map(),dist=new Map();for(let i=0;i<=287;i++){let [v,n]=fcode(i);lit.set(n*1024+v,i);}for(let i=0;i<32;i++)dist.set(5*1024+rev(i,5),i);
 function dec(map,max){let val=0;for(let n=1;n<=max;n++){val|=get(1)<<(n-1);let r=map.get(n*1024+val);if(r!==undefined)return r;}throw Error("invalid fixed deflate symbol");}
 let out=new Uint8Array(size),pos=0,finished=false;while(!finished){let last=get(1),typ=get(2);if(typ!==1)throw Error("not fixed deflate");while(true){let sym=dec(lit,9);if(sym<256){if(pos>=size)throw Error("inflate overrun");out[pos++]=sym;continue;}if(sym===256)break;let j=sym-257;if(j<0||j>=LB.length)throw Error("bad len");let len=LB[j]+get(LE[j]),ds=dec(dist,5);if(ds>=DB.length)throw Error("bad dist");let d=DB[ds]+get(DE[ds]);if(d>pos||pos+len>size)throw Error("bad match");for(let k=0;k<len;k++){out[pos]=out[pos-d];pos++;}}finished=!!last;}
 if(pos!==size)throw Error("inflated size "+pos+" != "+size);let a=1,b=0;for(let i=0;i<size;i++){a+=out[i];b+=a;if((i&4095)===4095){a%=65521;b%=65521;}}a%=65521;b%=65521;let expected=((b<<16)|a)>>>0,got=((z[z.length-4]<<24)|(z[z.length-3]<<16)|(z[z.length-2]<<8)|z[z.length-1])>>>0;if(expected!==got)throw Error("adler mismatch");return out;}
function verifyPng(png,x,y,w,h){const signature=[137,80,78,71,13,10,26,10];for(let i=0;i<8;i++)if(png[i]!==signature[i])throw Error("PNG signature");let pos=8,idat=[],ended=false,palette=false,ihdr=false,chunks=0;
 while(pos<png.length){if(pos+12>png.length)throw Error("truncated PNG");let n=((png[pos]<<24)|(png[pos+1]<<16)|(png[pos+2]<<8)|png[pos+3])>>>0,ty=String.fromCharCode(...png.subarray(pos+4,pos+8));if(pos+12+n>png.length)throw Error("chunk overflow "+ty);let slice=png.subarray(pos+4,pos+8+n),got=((png[pos+8+n]<<24)|(png[pos+9+n]<<16)|(png[pos+10+n]<<8)|png[pos+11+n])>>>0;if(crc32(slice)!==got)throw Error("CRC "+ty);if(ty==="IHDR"){if(n!==13||png[pos+12]!==0){}let dw=((png[pos+8]<<24)|(png[pos+9]<<16)|(png[pos+10]<<8)|png[pos+11])>>>0,dh=((png[pos+12]<<24)|(png[pos+13]<<16)|(png[pos+14]<<8)|png[pos+15])>>>0;if(dw!==w||dh!==h||png[pos+16]!==8||png[pos+17]!==3)throw Error("bad IHDR");ihdr=true;}if(ty==="PLTE")palette=true;if(ty==="IDAT")idat.push(png.subarray(pos+8,pos+8+n));if(ty==="IEND"){if(n!==0||pos+12!==png.length)throw Error("bad IEND");ended=true;}chunks++;pos+=n+12;}
 if(!ended||!palette||!ihdr||idat.length!==1)throw Error("incomplete PNG");let raw=inflateFixed(idat[0],(w+1)*h);for(let yy=0;yy<h;yy++){let o=yy*(w+1);if(raw[o]!==0)throw Error("wrong filter");for(let xx=0;xx<w;xx++)if(raw[o+1+xx]!==grid[(y+yy)*W+x+xx])throw Error("PNG ID parity mismatch at "+xx+","+yy);}
 return{chunks,bytes:png.length,signature_crc_zlib_adler_iend:true,material_id_parity:true,dimensions:[w,h],crop_origin:[x,y]};}
let crops=[
 ["overview.png",0,0,W,H],
 ["01-crown-intake.png",110,53,800,390],
 ["02-counterweight-cathedral.png",108,390,812,470],
 ["03-ore-crusher-gallery.png",109,820,810,475],
 ["04-rail-funnel-transfer.png",110,1200,810,420],
 ["05-quench-salvage-terminal.png",105,1615,813,418]];
let images=[],imageChecks=[];for(let [name,x,y,w,h] of crops){let png=pngFromGrid(x,y,w,h);images.push({name,bytes:png});imageChecks.push({name,sha256:sha256(png),...verifyPng(png,x,y,w,h)});}
const gridSha=sha256(grid),setupSha=sha256(bytes(setupString));
const receipt={r5_original_finish:{artistic_brief:"broken sheave / heavy skewed counterweight / anchored arrest / readable crusher manifold / staged freight wagon / split quench lookouts",actual_changed_cells:r5Changed,physical_Water_cells_unchanged:6525,old_r4_unanchored_over_1000:R4_STRUCTURAL.unanchored_over_1000.length,structural:R5_STRUCTURAL,flight_routes:"all 11 named sites must pass three conservative exact-hull envelope tests; primary-throat obstruction guarantees terminal bypass only",reproducibility:"fixed seed, full cell replay and PNG indexed material parity validated by builder"},r6_finishing:{review_authority:"Shepherd and Fidelity art REWORK exact R5 HEAD",changed_cells:r6Changed,water_cells_changed:r6LiquidChanged,structural:R6_STRUCTURAL,creative_repairs:"asymmetric sheared weight, broken terminal cables and compressed catch; segmented gravity sorting with receiving bin; single wagon loading station; supported quench-transfer threshold",protected:"all exact sites and conservative hull sizes; physical water unchanged",known_static_separation:"1306-cell east control enclosure remains an intentionally non-loadbearing fixed fixture",render:"six material-ID PNGs and complete replay generated from identical grid",native:"NATIVE-UNTESTED - installed binary/rectangle cap and dynamic validation unknown"},r4_support_rework:{ops:R4_BRIDGES.map(b=>b[0]),changed_cells:r4Changed,prior_protected_corridor_cells_changed:r4ProtectedChanged,structural:R4_STRUCTURAL,flight_crossovers:"Some old straight route-guide segments are interrupted by engineered support; exact whole-hull connectivity retested"},schema:"cybersand-original-industrial-vertical-qualification-v1",engine_accepted_main:ENGINE,creator:"original-industrial-vertical",originality:"original from authored plan; no source/reference image used",seed_decimal:SEED>>>0,extent:[W,H],cells:grid.length,nonempty:occupied,nonempty_materials:HIST,grid_sha256:gridSha,setup_sha256:setupSha,setup_bytes:bytes(setupString).length,setup_bytes_excluding_lf:bytes(setupString).length,setup_file_bytes_including_lf:bytes(setupString+"\n").length,edit_rectangles:edits.length,rectangle_budget_source:32768,default_no_bridge_capacity:4096,installed_bridge_capacity:"UNKNOWN - do not assert native load",edit_budget:32768,full_cell_replay:"PASS",edit_overlap_count:0,rectangle_work_estimate:work,generated_start_work_limit:Math.min(64*W*H,32000000),material_laws:"all structural materials Solid, non-movable, RuleKernel::None under recorded accepted main; water 3 contained in dedicated lower sump",flight_checks:flight,alternative_main_throat_block:{rect:[420,983,665,1006],terminal_reachable:true,reachable_centers:alt.count},sites:SITES,routes:ROUTES,image_checks:imageChecks,art_rework:{review_authority:"Shepherd and Fidelity REWORK comments on prior exact head",previous_head:"39644a3a6b0a0500b01faca6c075e08d2054d539",original_cell_changes:r3Changed,operation_records:ART_OPS.length,preservation:"all original exact 11 destinations, three flyable spines and Water 6525 cells retained",districts:"asymmetric severed counterweight/catch; twin ore hoppers/transfer; distinct switch yard/cargo cradle; irregular foundry galleries; furnace-to-quench infrastructure",production_scope:"Only fixed inert physical cells; no runtime physics edits"},native_status:"NATIVE-UNTESTED: no CyberDemoBridge binary or Godot runtime supplied; dynamic inspect_interaction IDs, world install, Rapier input/collision, physics, fresh-process save/reopen unproven",approval:"DRAFT/HOLD - independent Shepherd and owner acceptance outstanding"};
receipt.r7_industrial_finish={review_authority:"independent exact-R6 Fidelity REWORK and Shepherd conditional static HOLD",changed_material_cells:R7_CHANGED,water_cells_changed:R7_WATER_CHANGES,structural:R7_STRUCTURAL,changes:"large diagonal failure shear and offset captured scrap; crusher-to-twin-terminated-feed and bins; single wagon with loading bay and rail buffers; dry salvage-to-quench service gantry",geometry:"strict orthographic 1024x2048 material-ID cells; exact all-11 19x15,23x19,31x27 navigation tests",native:"NATIVE-UNTESTED"};
receipt.r8_original_industrial_rework={review_authority:"independent R7 Shepherd and Fidelity REWORK",changed_material_cells:R8_CHANGED,water_cell_changes:R8_WATER_CHANGES,structural:R8_STRUCTURAL,physical_throat_block:altPhysical,creative_repair:"off-centre planar-sheared counterweight with captured slab and differentiated failed tension lines; staged feed->crusher->terminated split gate->receiver; one vertically loaded wagon; dry salvage and quench inspection gantry",native_status:"NATIVE-UNTESTED"};
receipt.alternative_main_throat_block.physical_solid_full_hull=altPhysical;
const rec=JSON.stringify(receipt,null,2)+"\n";
let readme=[
"# Severed Counterweight | original industrial vertical canvas",
"",
"> DRAFT / HOLD. Original authored physical-cell design, not sourced from reference art. Engine native load and owner acceptance remain UNTESTED.",
"",
"**Creative thesis.** A once-balanced deep ore lift has snapped its eastern counterweight chain. A narrow steel skyline feeds a central offset flight spine; two service shafts provide long alternative ascents. The flyable traversals reveal five vertically distinct industrial districts, each with framed equipment and real crossover apertures rather than scenic panels.",
"",
"**Canvas:** 1024 x 2048 native material cells, exact. **Seed:** "+(SEED>>>0)+". **Accepted CyberSand main:** `"+ENGINE+"` (read-only authority). **Base:** `techrote/sandmapsreference` current main at branch creation.",
"",
"## Intended playable structure",
"",
"1. Sky intake (y 60-380): roof-level duct towers, landing bridge, crown signal and structural cross-brace.",
"2. Counterweight cathedral (y 380-815): a static hanging ore mass, cable/sheave banks, west winch room and eastern control desk.",
"3. Sorting / crushers (y 815-1200): tapering feed hoppers, ore assay, central exchange, paired material chutes.",
"4. Rail funnel (y 1200-1590): switch interlocks, transverse trusses and pressurization switchroom.",
"5. Quench and salvage (y 1590-2048): retrieval dock, heat-shield furnace, sealed cooling trough and bottom lift terminal.",
"",
"**Engineering semantics:** gantries, rail stops and counterweights are solid static architecture; the scene does not pretend these are animated machines. Every lateral aperture is cut through both structural and decorative paint. A left (x~205), right (x~800) and offset center spine offer multiple independent ways around the primary material obstructions. Continuous rock shoulders terminate the structural members.",
"",
"## Exact named sites",
"",
"| ID | Site | Exact (x,y) | District |",
"|---|---|---|---|",
...SITES.map(s=>"| "+s.id+" | "+s.name+" | ("+s.at.join(", ")+") | "+s.district+" |"),
"",
"## Route graph (flight)",
"",
"Central spine: "+ROUTES.central.map(p=>"("+p.join(",")+")").join(" -> ")+".",
"West shaft: "+ROUTES.west.map(p=>"("+p.join(",")+")").join(" -> ")+". East shaft: "+ROUTES.east.map(p=>"("+p.join(",")+")").join(" -> ")+".",
"Crossovers: "+ROUTES.crossovers.map(p=>p.map(v=>"("+v.join(",")+")").join(" - ")).join("; ")+".",
"Connectivity is proven from the **exact Midge spawn** to **each exact site** at 19x15, 23x19 and 31x27, with zero nearest-cell substitution; a separate 31x27 throat-block test verifies west/east bypass.",
"",
"## Artifact and reproducibility",
"",
"`build.cjs` is a fixed-seed, dependency-free Node.js builder. Run `node build.cjs` from any directory: it rebuilds `setup-severed-counterweight.json`, `qualification.json` and all full-resolution material-identity indexed PNGs in its own directory, then reopens/decodes every generated PNG in memory to check chunk CRC, zlib, Adler-32, IEND and per-cell ID parity. The source grid is reconstructed from hand-authored geometric primitives and exact route masks, never derived from a source image or compressed/reprojected reference PNG.",
"",
"**JSON format:** ordinary Workbench Setup-v2, not a fabricated generated-start receipt. Ordered, nonoverlapping, vertically coalesced rectangular edits exactly reconstruct the "+grid.length+" source cells. JSON bytes "+bytes(setupString).length+" / 1,048,576, "+edits.length+" rectangles / 32,768 source max, "+work+" painted cell writes in a "+Math.min(64*W*H,32000000)+" theoretical work envelope.",
"",
"**SHA-256 identity:** material grid `"+gridSha+"`; JSON `"+setupSha+"`.",
"",
"**Physically fixed materials:** `"+Object.entries(HIST).filter(([id,n])=>+id!==0&&+id!==3).map(([id,n])=>id+":"+n).join(" ")+"`. All are accepted-main Solid/non-movable/RuleKernel::None; only Water (3) is dynamic, within the walled lower quench basin. Visual metal pipes and LEDs are material cells, not sprite decals.",
"",
"**Render evidence:** `overview.png` is the complete 1024x2048 material map; the five numbered crops are native 1:1 unresampled windows of that *same cell grid*. These are palette-identity PNGs, **not** Godot screenshots, not AI concept art, and not a claim that the native renderer has been tested.",
"",
"## Actual-cell art review and repair log",
"",
"Viewed the *complete* 1024x2048 identity-plane PNG and the 1:1 crops. Initial composition was too skeletal through the ore and rail levels, with small isolated fittings. Revised the physical grid rather than painting a cosmetic preview: mounted a 136x132 east-side crusher cassette and a 111x62 service subdeck, inserted a 126x95 pressurized switch rack and a large 120x152 salvage hoist. Each is attached to existing spines, braces or cable tracks.",
"",
"1. **Crown 1:1:** the status/workshop shell read as a disconnected box; added wall brackets and two explicit roof hangers. The silhouette now has asymmetric intakes and an inhabited dispatch room.",
"2. **Counterweight 1:1:** strong hung counterweight and left winch bank, but the control panel lacked attachment; added a steel bracket to its permanent pier. Lateral bridges terminate at deliberate flight apertures, not accidental holes.",
"3. **Crusher 1:1:** the previous midshaft had too much empty striping and insufficient machinery; mounted a large braced crusher cassette, rail brackets and a subordinate hoist dock. Source grid inspection confirms the offset Midge tube remains open.",
"4. **Rail 1:1:** repetitive cross-trusses needed one clear focal function; added a lit pressure switch rack tied to the east pipe main, retaining west/east crossovers.",
"5. **Quench 1:1:** the right flight carving had opened the coolant vessel lid; repaired this *after* all corridor erasures, explicitly checked every perimeter cell, and reran 31x27 center flood-fill and main-throat bypass.",
"",
"**Remaining artistic limitation:** machinery is made of true physical material cells, so several gantries have intentional large aircraft-clearance gaps and cannot visually behave like a continuous solid deck. The high-level east/west service supports repeat for structural plausibility. This is a gameplay/engineering compromise, not final owner art acceptance.",
"",
"## Shepherd-directed R3 industrial physical-cell rework",
"",
"18 November 2026: independent original-art audit and Shepherd both requested substantive redesign of the same lane-owned PR, not another original branch. This post-baseline sculptural pass changes **93,351 exact material identities** through 224 deterministic rectangle/line operations, guarded away from every primary 31x27 navigation corridor and exact site.",
"",
"- **Severed counterweight cathedral:** an offset 167x180 riveted suspended load, broken copper-steel suspension and heavy twin catch trusses now establish a clear damaged-machine focal point, retaining the side bypasses.",
"- **Ore chain:** a framed west feed-hopper, nested discharge throat and east-stage reinforced enclosed cascade, visually connecting assay/crushing toward transfer without sealing the Midge through-routes.",
"- **Rail switching yard:** an asymmetric truss/switch drum at the central west edge, hanging eastern cargo cradle, loading braces and apron replace the prior nearly vacant repeated truss tier.",
"- **Different wall districts:** expanded west foundry nook and lower service gallery contrasted against elevated east utility/electrical rooms; local geometry changes without damaging the main bridge spans.",
"- **Salvage/quench:** a ribbed heat-shield furnace and overhead handling beam turn the lower equipment into a more legible destination, preserving all 6,525 physical Water cells and their sealed vessel.",
"",
"**Actual-cell evidence:** the complete material-ID plane and five original 1:1 windows were regenerated from these same cells, and rechecked by PNG chunk CRC, zlib/Adler, IEND and every indexed material pixel. Self-critique: mechanical load paths are clearer but some service shafts retain repeatable functional steel modules; no active elevator motion or native coolant stability is asserted.",
"",
"**Independent bounded gates:** the 19x15 / 23x19 / 31x27 fully contained envelopes still reach all original 11 exact coordinates; blocked central throat retains a 31x27 bypass. 8176 nonoverlapping rectangles, 149799 JSON bytes, 885624 painted cells; 0 replay mismatches. **NATIVE-UNTESTED** until a source-compatible installed GDExtension confirms constructor capacity, simulation, collision and fresh save/reopen.",
"",
"## R4 physical structural closure", "", "Seven former major (>10000-cell) detached industrial assemblies now have genuine cardinally connected steel paths to world-edge-anchored Solid. The transverse crusher-to-exchange bridge and rising ore-transfer conduit connect previously disconnected process groups. The eastern gravity downfeed is purposefully interrupted by a 57-cell flight-passage gap; there is no false claim of a seamless moving conveyor.", "", "R4 changed "+r4Changed+" actual material identities, including "+r4ProtectedChanged+" in former protected route space. The old ROUTES coordinate arrays are original design wayfinding guides, NOT a claim that every straight crossover remains unobstructed: selected service channels are interrupted by grounded braces. The full 19x15, 23x19 and 31x27 exact-centre traversability graph, 31x27 blocked-main-throat recovery, and all named sites are rebuilt from final cells and retested.", "", "Seven named large assembly witness points and all unanchored components above 1000 cells are listed in qualification.json. Remaining unanchored smaller static cabinets (>1000 cells): "+R4_STRUCTURAL.unanchored_over_1000.length+"; these are not represented as physically anchored and warrant further finish review. The 2D world has no true structural stress model. Native Workbench input, collision, Water settling and fresh-process save/reopen remain NATIVE-UNTESTED.", "", "## R5 broken-counterweight / industrial operation rework (18 November 2026)","","A final original-cell construction pass responds to the independent R4 Fidelity Auditor and Shepherd REWORK. A fractured crown traction beam and deliberately broken paired cable paths terminate above a dramatically enlarged skewed counterweight body; the weight has been arrested by a real diagonal steel catch frame tied into the western pier. The visual is a static broken-lift disaster, not simulated motion. Added a supported crusher-discharge bridge and split feed with a deliberate open flyer passage, a rail hall with a single loaded cart and two separated tracks, and safe quench viewing balconies. No Water identities or quench perimeter were edited.","","R5 changed "+r5Changed+" final material identities. Significant detached static assemblies >1,000 cells went from "+R4_STRUCTURAL.unanchored_over_1000.length+" (R4) to "+R5_STRUCTURAL.unanchored_over_1000.length+" (R5). The current structural census, explicit bounds, all seven major anchored witnesses and three exact Midge hull results are recorded in qualification.json. Not every indicated straight guide is traversable after the support work: true exact-air connectivity is tested instead. The obstruction fallback is **bottom-terminal bypass only**; the mid-level ore exchange need not remain reachable when the main throat is artificially sealed.","","The Setup-v2 receipt now distinguishes the JSON payload without its terminal LF from the actual committed file including that LF. Native bridge binary, input/collision, fluid ticks and fresh-process save/reopen remain **NATIVE-UNTESTED**.","", "## R6 original industrial level finish (18 November 2026)","","Following the independent exact-R5 Fidelity Auditor and Shepherd REWORK, the huge louvered machine was recut into a fractured, asymmetric, angular counterweight face with broken crown-to-attachment cables and a compressed braced catch. It is static immovable engineering sculpture, not animated or falling machinery. The inherited shell retains some rounded outer casing; this remains a potential artistic weakness for independent review.","","The ore operation now shows two segmented supported feed trays with intentional flyable separation, differentiated inlet/discharge ends and a bolted downstream receiving bin. No ore gravity-movement or mechanical transport is represented as running. The freight hall receives an open compact loading hood over the ONE existing loaded cart and two buffered rail termini. An upper transfer shield/handling threshold visibly joins the salvage apron toward the original sealed quench sump; there are no changes to the original Water cells or basin perimeter.","","**R6 exact physical change:** "+r6Changed+" of the 2,097,152 material IDs differ from committed R5; all 6,525 genuine Water ID3 cells are unchanged. All seven world-rooted machinery witnesses remain rooted and the sole 1,306-cell east control is explicitly independent non-loadbearing fixed console. No wall-mounted controls or gantries have active moving mechanisms.","","**Playable route caveat:** all 11 author-specified unrelocated sites remain reached with 19x15, 23x19 and 31x27 fully contained Midge envelopes. The deliberate central obstruction keeps the BOTTOM TERMINAL reachable but does not assert redundant access to every intermediate site. The rail/ore transfer discontinuities are the literal collision-open passages, not accidental fake conveyor continuity.","","**Material evidence/self-critique:** regenerated full overview and all five full-resolution 1:1 crops from the exact authored grid. The sheared cap is more angular, the crane hood aligns with its wagon, and east receiver is readable, while a large amount of negative airspace and regular side truss rhythm remain. Independent artistic/technical review is still outstanding; built-in PNG parity and offline access tests do not constitute native Workbench acceptance.","","## Qualification and limitations",
"",
"- Offline full grid, nonoverlap, exact replay, PNG structural/inflate/CRC and material-ID parity: PASS; see `qualification.json`.",
"- The source reader admits each extent component 512..2048 in multiples of 64, 32,768 stamps and 1 MiB JSON. `native_rectangle_budget()` may fall back to **4,096** without a bridge and otherwise asks the loaded compiled library, up to 32,768; our actual rectangle count must be compared to that installed capacity before loading.",
"- Midge pinned definition has a 4x3 rectangular hull; 19x15/23x19/31x27 are conservative inflated clearance envelopes, not dynamic flight guarantees.",
"- The source Setup-v2 validator uses live `CyberDemoBridge.inspect_interaction` to admit staged additional material IDs; absent the matching library, dynamic material admission is NOT verified.",
"- **NATIVE-UNTESTED:** no compatible Workbench runtime was available for loaded native `rectangles()`, actual world install, user input, collision, pressure/Water settle, rendering, save/reopen across a fresh OS process. Rebuild the matching GDExtension and run these gates before claiming compatibility.",
"- Quench fluid is statically contained in a reinforced basin; no time-evolved solver stability or leaks are claimed.",
"- Static lift sculptures are traversable architecture, not powered animated elevators.",
"- Draft/HOLD; independent fidelity and technical auditors, Shepherd and owner must review before status promotion.",
"",
"## Required owner native acceptance",
"",
"Use the engine SHA above. Rebuild/load the matching extension, query `CyberDemoBridge.workbench_start_rectangle_capacity`, run Setup.validate/rectangles, install the canvas, compare native material identities and render, pilot Midge to all named destinations, test loops and alternate approach, run the water simulation, save a uniquely named start, quit and reopen in a clean process, compare material and actor state. Refuse, do not degrade, if a capacity/policy/material check fails.",
"",
"## Originality and ownership",
"",
"Created solely for the `original/industrial-vertical` lane in `techrote/sandmapsreference`. No existing canvas, GitHub image, reference artwork, PR branch or CyberSand source was altered. Source files in `techrote/cybersand` were inspected only for schema/material/actor technical admission.",
"",
"**Completion marker:** `ORIGINAL-CANVAS-INDUSTRIAL-VERTICAL: <current-head-sha>` (replace placeholder with actual PR HEAD in PR description).",
""
].join("\n");
readme+="\n\n## R7 original industrial corrective finish (18 November 2026)\n\nIndependent exact-R6 Fidelity REWORK identified a still-drumlike load, ambiguous crusher handoff, off-target wagon loading, and an isolated quench handling link. This pass removes a large diagonal sheared region from the counterweight and offsets captured scrap while preserving the rooted arrest; emphasizes the crushing workface and deliberately separated flight-clear discharge mouths with aligned bins; adds the ONE cart's stop-buffered service landing and a distinct overhead transfer termination; and provides a short dry cantilever to the quench walkway. All solids are static accepted inert material cells; none imply animated transport. Protected previously empty primary flight channels and every original Water cell. Actual R6-to-R7 changed cells: "+R7_CHANGED+". Rooted major supports: 7/7. Exact conservative 11/11 all-sites reachability is checked at all three hull sizes by the builder; terminal-only obstruction bypass is not universal site redundancy. Source bridge 32,768 vs unverified installed bridge capacity; native NATIVE-UNTESTED. The original partly circular outer shell and segmented process gaps remain transparent artistic/runtime limitations.\n";
readme+="\n\n## R8 broken load and plant-interface repair (19 November 2026)\n\nFollowing the exact-R7 independent Shepherd and Fidelity REWORK, the formerly round flywheel body was physically erased and rebuilt as a stark, eccentric sheared counterweight. Actual mass, western surviving tensile suspension, right-side severed cable, displaced captured slab and grounded arrest are independent material-cell shapes, not a decorative PNG. The sorting process is now staged inlet -> paired crusher jaws -> deliberately interrupted output -> aligned receiver, with protected flyer gaps; freight has exactly one wagon, a vertically aimed overhead loading hood and buffer-ended short track. The lower plant has a dry furnace receiving mouth and inspection crane above the untouched sealed 6,525-cell Water basin. These are immovable static architectural cells, not powered machinery or simulated gravity feed. R8 changed "+R8_CHANGED+" material identities, with zero Water identities altered. Seven rooted support probes remain; all exact sites pass conservative hull travel checks; physical Solid-throat obstruction re-erodes 31x27 and preserves final K only as required, not every site. Standalone native import/tick/flight/Water/save/reopen **NATIVE-UNTESTED**; installed bridge must admit "+edits.length+" rectangles; Draft/HOLD.\n";
const data=[{name:"setup-severed-counterweight.json",text:setupString+"\n"},{name:"qualification.json",text:rec},{name:"README.md",text:readme},...images];
return{root:ROOT,data,metrics:{r8Changed:R8_CHANGED,r8WaterChanged:R8_WATER_CHANGES,r8PhysicalThroat:altPhysical,r8Detached:R8_STRUCTURAL.unanchored_over_1000.length,r7Changed:R7_CHANGED,r7LiquidChanged:R7_WATER_CHANGES,r6Changed,edits:edits.length,setupBytes:bytes(setupString).length,gridSha,setupSha,materialHistogram:HIST,images:imageChecks,flight:flight.map(v=>({footprint:v.footprint,reachable:v.reachable_sites,centers:v.reachable_centers})),alternativeCenters:alt.count}};
};
if(typeof module!=='undefined') module.exports=build;
if(typeof require!=='undefined'&&typeof module!=='undefined'&&require.main===module){const fs=require('node:fs'),path=require('node:path');const output=build();for(const item of output.data){const dest=path.join(__dirname,item.name);fs.writeFileSync(dest,item.bytes?Buffer.from(item.bytes):item.text);}console.log(JSON.stringify(output.metrics,null,2));}
