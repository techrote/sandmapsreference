"use strict";
/* COMMN-0012 R2A3: source-led contiguous, load-bearing civic ascent, roofed
 * inhabited arcade and underground artery. Actual exact material cells only.
 * Runs after R2A2; never changes source art, engine or historic Midge sites. */
module.exports=function finishR2A3(G,W,H,M,TARGETS){
const R=(x,y,w,h,v)=>{x=Math.max(0,Math.min(W,x|0));y=Math.max(0,Math.min(H,y|0));w=Math.min(W-x,w|0);h=Math.min(H-y,h|0);if(w<=0||h<=0)return;for(let z=y;z<y+h;z++)G.fill(v,z*W+x,z*W+x+w)};
const top=x=>x<1540?Math.round(1311-.238*(x-690)):1109;
// Continuous masonry-supported staircase, unequal planted bays and upper sky untouched.
for(let x=690;x<1950;x+=10){let w=Math.min(10,1950-x),y=top(x);R(x,y,w,1560-y,M.LIME);R(x,y,w,7,M.MARBLE);R(x,y+8,w,7,M.COBBLE)}
for(let x=695;x<1540;x+=24){let y=top(x);R(x,y,24,7,M.MARBLE);R(x+1,y+7,23,12,M.COBBLE)}
for(let [x,w] of [[780,114],[1074,137],[1360,119],[1570,149],[1800,119]]){let y=top(x);R(x,y,w,11,M.MARBLE);R(x+15,y-21,Math.min(56,w-32),12,M.TERRA);R(x+15,y-9,Math.min(56,w-32),7,M.BRICK);for(let j=0;j<3;j++)R(x+24+j*13,y-34-(j%2)*6,4,13+(j%2)*6,M.MOSSSTONE)}
// Traverse one coherent sheltered retaining arcade with real asymmetric arched voids.
R(716,1385,1222,133,M.AIR);
for(let [x,w,cy] of [[754,160,1386],[946,192,1365],[1168,206,1367],[1409,181,1358],[1627,194,1351],[1835,82,1355]]){R(x,cy,w,18,M.AIR);for(let j=0;j<24;j++){let half=Math.round(w/2-Math.sqrt(Math.max(0,576-j*j))*.72);R(x+Math.max(0,half-25),cy-j,Math.min(w,Math.max(38,w-2*half+50)),1,M.AIR)}}
for(let [x,w] of [[874,34],[1116,31],[1365,38],[1607,43],[1833,32]]){R(x,1326,w,66,M.COBBLE);R(x-9,1378,w+18,12,M.MARBLE);R(x+6,1389,w-12,41,M.PLASTER);R(x-7,1514,w+14,47,M.LIME);R(x-12,1509,w+24,9,M.COBBLE)}
R(716,1520,1222,16,M.COBBLE);R(718,1520,1218,5,M.MARBLE);
for(let [x,y,w] of [[745,1420,118],[952,1410,134],[1194,1419,108],[1470,1408,111],[1709,1410,103]]){R(x,y,w,10,M.COBBLE);R(x+9,y+11,10,37,M.LIME);R(x+w-18,y+11,10,37,M.LIME);R(x+20,y+18,w-40,6,M.BRASS);R(x+20,y+26,w-40,16,M.CGLASS);R(x+29,y+29,w-58,8,M.DGLASS)}
// Distinct windows and rooms in the terraced retaining mass, not blank concrete.
for(let [x,w,h] of [[1179,127,49],[1415,144,63],[1657,163,78],[1813,91,69]]){let y=top(x)+44;R(x,y,w,h,M.AIR);R(x,y,w,8,M.COBBLE);R(x+6,y+12,w-12,h-18,M.CGLASS);R(x+10,y+18,w-20,9,M.DGLASS);R(x+13,y+33,w-26,4,M.BRASS);R(x+w/2-6|0,y+10,12,h-15,M.LIME);R(x-8,y+h-2,w+16,10,M.MARBLE)}
// Roofed lower civic artery; inhabited metal/glass utility bays, dry flyable interior.
R(676,1571,1274,27,M.LIME);R(676,1571,1274,7,M.MARBLE);
for(let [x,w] of [[712,194],[949,161],[1260,205],[1545,141],[1808,120]]){R(x,1606,w,17,M.COBBLE);R(x+5,1623,w-10,5,M.BRASS);R(x+10,1634,w-20,26,M.SLATE);R(x+20,1640,(w-50)/2|0,13,M.CGLASS);R(x+(w/2|0)+7,1640,(w-50)/2|0,13,M.DGLASS);R(x+(w/2|0)-5,1634,10,26,M.LIME);R(x+13,1661,14,20,M.PLASTER);R(x+w-27,1661,14,20,M.PLASTER)}
for(let [x,w] of [[740,72],[1193,86],[1780,74]]){R(x,1625,w,77,M.AIR);R(x-11,1625,10,78,M.COBBLE);R(x+w+1,1625,10,78,M.COBBLE);R(x+7,1626,w-14,5,M.BRASS)}
for(let [x,w] of [[736,42],[1006,40],[1327,44],[1640,39],[1885,46]]){R(x,1533,w,37,M.GRANITE);R(x+9,1560,w-18,18,M.COBBLE)}
// Genuine west and east daylight entries and two wide inboard utility transfers.
R(662,1342,86,350,M.AIR);R(1897,1307,151,481,M.AIR);R(971,1192,79,140,M.AIR);R(990,1325,62,377,M.AIR);R(1475,1408,89,325,M.AIR);R(1290,1440,300,86,M.AIR);
// Fix the formerly unsupported vitrined mural and lower floating furnishings.
R(341,627,58,17,M.LIME);R(370,627,19,49,M.COBBLE);R(829,1760,26,92,M.LIME);R(816,1830,51,22,M.GRANITE);R(938,1774,27,76,M.LIME);R(930,1830,43,18,M.COBBLE);
// West retaining fabric load path is physically secured to library masonry,
// not left floating behind the western open sky entry.
R(617,1153,110,26,M.LIME);R(700,1150,22,201,M.LIME);
// Exact unchanged named air sites: no tolerance substitution or site renaming.
for(let [name,x,y] of TARGETS)R(x-19,y-16,39,33,M.AIR);
};
