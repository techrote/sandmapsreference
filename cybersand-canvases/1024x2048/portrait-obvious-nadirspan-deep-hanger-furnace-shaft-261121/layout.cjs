'use strict';
/* PORTRAIT-001 Creator B, OBVIOUS #2, Nadirspan deep-hanger transfer.
 * All final cells are freshly laid out in portrait coordinates. None copied
 * or rotated from source geometry. Native material-ID grid at 1:1 scale.
 */
function layoutWorld(){
 const W=1024,H=2048,g=new Uint8Array(W*H),seed=202611211336;
 const M={0:"air",3:"water",8:"lava",58:"reinforced",62:"plate",65:"rust",68:"steel-pipe",69:"copper-pipe",76:"hazard",79:"amber",100:"basalt",104:"firebrick",117:"iron",131:"shield"};
 const b=(x,y,w,h,m)=>{[x,y,w,h]=[x,y,w,h].map(Math.round);if(x<0||y<0||w<1||h<1||x+w>W||y+h>H)throw Error("bounds "+[x,y,w,h,m]);for(let yy=y;yy<y+h;yy++)g.fill(m,yy*W+x,yy*W+x+w);};
 const l=(x,y,X,Y,t,m)=>{let n=Math.ceil(Math.hypot(X-x,Y-y)/Math.max(3,t/2));for(let i=0;i<=n;i++){let f=i/n;b(x+(X-x)*f-t/2,y+(Y-y)*f-t/2,t,t,m);}};
 const ring=(cx,cy,r,t,m)=>{let pts=[];for(let i=0;i<12;i++){let a=2*Math.PI*i/12;pts.push([cx+r*Math.cos(a),cy+r*Math.sin(a)]);}for(let i=0;i<12;i++)l(...pts[i],...pts[(i+1)%12],t,m);};
 const sites=[
 ["Entrance cradle",528,146],["Ore hopper watch",490,360],["High hanger inspection",766,385],
 ["Furnace face",528,574],["Furnace repair",298,610],["Ladle watch",532,784],
 ["Ladle counterweight",753,864],["Upper thermal interlock",525,926],
 ["Extruder crown",520,1150],["Rotor west service",340,1220],
 ["Lower quench interlock",525,1245],["Long ram observation",760,1320],
 ["Extruder pit",505,1456],["Quench lookout",530,1570],
 ["Quench undercroft",313,1715],["Freight davit watch",761,1770],
 ["Dispatch gallery",522,1848],["Exit freight goal",510,1920]
 ].map(([name,x,y])=>({name,x,y}));
 // Continuous rocky shaft walls and foundation, deliberately *not* seven horizontal
 // clone stages. Cantilever overhangs are uneven and alternate left/right.
 b(0,0,121,2048,100);b(908,0,116,2048,100);
 b(0,0,1024,77,100);b(0,1958,1024,90,100);
 for(const [x,y,w,h,m] of [
 [118,223,332,23,58],[124,246,249,12,62],[137,258,12,95,68],
 [662,475,246,24,58],[687,499,192,12,62],[878,511,12,125,58],
 [118,713,305,24,58],[124,737,244,12,62],[136,749,13,104,68],
 [683,1008,225,24,58],[700,1032,184,11,62],[884,1043,13,124,68],
 [118,1328,280,23,58],[130,1351,230,10,62],[136,1361,13,122,68],
 [662,1571,246,24,58],[694,1595,188,11,62],[881,1606,12,128,68],
 [118,1845,314,24,58],[130,1869,225,10,62],[140,1880,12,61,68],
 ])b(x,y,w,h,m);
 // Early ore station: stepped hopper array and right-side measuring gantry.
 b(166,284,172,17,65);b(179,302,146,47,104);
 for(let x of [189,235,280]){b(x,309,30,27,131);b(x+11,336,7,30,69);}
 b(176,258,13,30,68);b(309,258,11,31,68);
 b(820,140,16,281,68);b(815,145,93,13,62);
 l(837,177,908,141,10,117);l(837,177,908,253,8,117);
 b(844,263,40,28,65);b(852,269,23,14,131);
 b(815,367,93,12,58);b(842,378,12,29,69);
 // Main hot furnace beneath second *right* anchored suspension.
 b(725,533,128,93,104);b(737,547,103,61,131);
 b(752,556,73,42,104);b(767,565,41,24,8); // sealed lava inside chamotte and shields
 b(737,500,15,35,68);b(833,510,15,24,68);
 b(785,628,12,79,69);b(809,655,99,13,58);
 for(let y of [545,590]){b(892,y,16,13,76);b(856,y-4,36,8,69);}
 // Opposed maintenance vault, entered and useful for human re-authoring.
 b(118,560,199,17,58);b(139,538,68,22,62);
 b(154,511,48,27,65);b(164,518,29,12,131);b(153,577,12,61,68);
 b(118,642,177,12,62);b(131,654,10,39,58);
 // Descending ladle and twin support cables rooted from the *left* third overhang.
 b(230,780,150,16,117);b(246,796,124,65,65);
 b(259,811,99,35,104);b(270,819,76,19,131);
 b(248,738,10,43,68);b(355,738,12,42,68);
 b(280,859,12,70,69);b(358,869,13,49,68);
 l(365,858,414,896,9,117);b(381,896,58,11,62);
 // Independently braced counterweight bays above and below ladle.
 b(759,785,149,18,58);b(798,767,79,18,62);
 b(819,736,12,31,68);b(845,803,12,64,69);
 b(773,883,135,12,58);b(787,895,12,52,68);
 b(818,866,60,17,65);b(828,871,41,9,131);
 // Three *unlike* extrusion machines: upper right vertical drum,
 // lower-left broad transfer wheel, lower-right small auxiliary feeder.
 ring(758,1129,61,11,117);ring(758,1129,42,8,69);
 b(817,1119,91,18,58);b(869,1095,14,25,68);
 b(750,1067,14,25,79);b(693,1118,13,17,76);
 b(729,1180,10,60,68);b(745,1240,163,14,58);
 b(752,1254,13,56,68);
 ring(292,1395,73,13,117);ring(292,1395,47,9,68);
 b(118,1384,115,22,58);b(231,1387,19,17,58);
 b(278,1328,13,18,79);b(219,1377,17,11,76);
 b(308,1467,14,82,68);b(322,1511,97,16,58);
 ring(784,1469,37,10,117);ring(784,1469,22,7,69);
 b(819,1462,89,15,58);b(793,1505,13,66,68);
 b(840,1425,68,11,62);b(870,1436,12,39,68);
 // Deliberately open transfer gulf around y960-1140: unobstructed central
 // column is the shortest flight; a REAL temporary solid blockade requires
 // routing around its side into the secondary maintenance lane.
 b(120,973,171,16,58);b(139,952,91,21,62);
 b(170,934,55,18,65);b(180,939,36,8,131);
 b(778,956,130,16,58);b(813,934,77,22,62);
 b(824,940,52,10,131);b(864,972,11,52,68);
 // Quench is a sealed water receiver, not a liquid hazard in free air.
 b(740,1614,143,104,104);b(756,1629,111,73,131);
 b(768,1642,85,49,104);b(782,1652,57,29,3);
 b(757,1607,13,12,68);b(864,1596,13,19,68);
 b(808,1720,100,14,58);b(869,1734,12,41,68);
 // Lower maintenance / inspection: distinct roof-to-wall load path.
 b(120,1635,203,18,58);b(140,1617,107,18,62);
 b(161,1580,70,37,65);b(173,1590,43,16,131);
 b(173,1653,11,65,68);b(221,1703,91,15,62);
 b(238,1718,13,48,58);b(158,1758,152,12,62);
 // Freight discharge deliberately occupies a sharp triangular davit
 // rather than a full-width horizontal plant tray.
 b(270,1813,143,14,117);l(307,1809,390,1747,12,117);
 l(390,1747,435,1820,11,117);l(390,1747,427,1666,8,68);
 b(117,1775,208,14,58);b(133,1758,102,17,62);
 b(146,1730,64,28,65);b(157,1740,43,12,131);
 b(814,1810,94,15,58);b(851,1786,48,24,65);
 b(860,1793,30,11,131);b(884,1825,12,49,68);
 b(700,1900,208,17,58);b(752,1877,111,23,62);
 b(764,1849,72,28,65);b(776,1858,49,13,131);
 b(826,1917,12,41,68);
 // Line-specific sensor and thermal warning vocabulary.
 for(const [x,y] of [[123,415],[888,693],[125,1098],[892,1400],[124,1549],[888,1904]]){b(x,y,18,55,69);b(x+3,y+12,12,12,79);}
 // Clear literal site envelopes, not shifted towards nearest free points.
 for(const p of sites)b(p.x-19,p.y-17,39,35,0);
 // Eliminate any inert parts not rooted to actual solid world boundary.
 const solid=id=>id!==0&&id!==3&&id!==8,seen=new Uint8Array(g.length),q=new Int32Array(g.length);let a=0,z=0;
 const add=i=>{if(i>=0&&i<g.length&&solid(g[i])&&!seen[i]){seen[i]=1;q[z++]=i;}};
 for(let x=0;x<W;x++){add(x);add((H-1)*W+x);}for(let y=0;y<H;y++){add(y*W);add(y*W+W-1);}
 while(a<z){let i=q[a++],x=i%W;for(let j of[x?i-1:-1,x<W-1?i+1:-1,i>=W?i-W:-1,i+W<g.length?i+W:-1])add(j);}
 let lost=0;for(let i=0;i<g.length;i++)if(solid(g[i])&&!seen[i]){g[i]=0;lost++;}
 return {W,H,g,M,seed,sites,spawn:[sites[0].x,sites[0].y],discarded_ungrounded:lost};
}
if(typeof module!=="undefined")module.exports={layoutWorld};
