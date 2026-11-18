"use strict";
/* R2A4: source-local inhabited vaulted civic artery, actual physical cells.
 * Restores coherent mass-backed roof, nonuniform vaults, rooms, entrances,
 * integrated transit/service exhibits and broad flight clearance.
 * Appended after R2A3, never touches source art or historical world. */
module.exports=function finishR2A4(G,W,H,M,TARGETS){
const R=(x,y,w,h,v)=>{x=Math.max(0,Math.min(W,x|0));y=Math.max(0,Math.min(H,y|0));w=Math.min(W-x,w|0);h=Math.min(H-y,h|0);if(w<=0||h<=0)return;for(let z=y;z<y+h;z++)G.fill(v,z*W+x,z*W+x+w)};
const L=(x,y,xx,yy,t,v)=>{let dx=Math.abs(xx-x),dy=Math.abs(yy-y),sx=x<xx?1:-1,sy=y<yy?1:-1,e=dx-dy;for(let n=0;n<5000;n++){R(x-(t>>1),y-(t>>1),t,t,v);if(x===xx&&y===yy)break;let f=e*2;if(f>-dy){e-=dy;x+=sx}if(f<dx){e+=dx;y+=sy}}};
// Replace the loose roof/wall fragments only IN the already extrapolated lower district.
// Roof, sidewalls and floor are one grounded urban limestone body, not floating strips.
R(91,1570,1862,271,M.LIME);
R(94,1570,1856,11,M.COBBLE);
R(103,1581,1836,8,M.MARBLE);
for(let [x,y,w] of [[135,1590,305],[457,1583,194],[781,1589,192],[1198,1581,251],[1630,1588,240]]){
 R(x,y,w,8,M.GRANITE);R(x+12,y+8,w-24,5,M.BRASS);
}
// Different-width real arch mouths, carved fully into solid retaining fabric.
// The shared pedestrian/flight floor is uninterrupted below the pendentives.
const vaults=[[135,356,1678,43],[381,611,1673,29],[631,882,1676,53],
 [904,1171,1682,46],[1192,1453,1682,61],[1476,1704,1677,35],
 [1727,1896,1686,49]];
for(let [l,r,shoulder, rise] of vaults){
 const mid=(l+r)/2,half=(r-l)/2;
 for(let x=l;x<=r;x++){
  let u=(x-mid)/half,arched=Math.round(shoulder-rise*Math.sqrt(Math.max(0,1-u*u)));
  R(x,arched,1,1822-arched,M.AIR);
 }
 R(l-5,shoulder+2,7,38,M.COBBLE);R(r-1,shoulder+2,7,37,M.COBBLE);
}
R(137,1705,1754,117,M.AIR); // Single connected main gallery below every vault
// Hand-cut, unequal vertical access between gallery and earlier civic levels.
// Leave daylight/actor access genuine AIR throughout, not false doors or proxy sites.
for(let [x,w,top] of [[155,75,1510],[640,147,1490],[982,94,1443],
 [1465,121,1400],[1843,118,1450]])R(x,top,w,1758-top,M.AIR);
// Masonry-edged thresholds, staggered portals and broad skirt openings.
for(let [x,w,level] of [[160,75,1610],[651,136,1622],[986,88,1625],
 [1468,116,1624],[1846,112,1658]]){
 R(x-13,level,12,57,M.COBBLE);R(x+w+1,level,11,57,M.COBBLE);
 R(x-16,level,15,7,M.MARBLE);R(x+w,level,16,7,M.MARBLE);
}
// Archive behind West Library: two asymmetric inhabitable chambers with
// vaulted plaster ceilings, a true central connecting portal, and book bays.
R(258,1596,305,113,M.AIR);
R(258,1596,305,10,M.COBBLE);R(265,1606,292,5,M.BRASS);
R(273,1622,98,10,M.SLATE);R(386,1627,157,8,M.COBBLE);
for(let [x,w] of [[275,70],[360,51],[429,107]]){
 R(x,1640,w,31,M.IBRICK);R(x+7,1646,w-14,18,M.CGLASS);
 R(x+13,1655,w-26,5,M.DGLASS);
}
R(332,1668,53,76,M.AIR);R(484,1665,59,64,M.AIR);
// West relay stair landing connects source civic building to the actual artery.
R(168,1764,275,9,M.MARBLE);
for(let [x,w] of [[188,65],[286,46],[370,55]]){R(x,1773,w,23,M.COBBLE);R(x+5,1774,w-10,5,M.TERRA)}
// Midpoint transfer hall with nonrepeating broken-spring arch and machinery.
R(790,1607,161,107,M.AIR);R(790,1607,161,8,M.MARBLE);
R(815,1635,74,7,M.COPPER);R(822,1643,10,26,M.BRASS);
R(900,1640,26,39,M.STEEL);R(904,1646,18,26,M.DGLASS);
R(837,1677,73,5,M.BRASS);R(840,1683,68,4,M.CYAN);
R(800,1739,108,11,M.SLATE);R(808,1750,24,22,M.GRANITE);
// Centre court beneath the public promenade: tall air shaft between two
// asymmetrical, physically backed shoprooms with open public doorways.
R(1005,1582,64,166,M.AIR);
R(1033,1610,13,57,M.BRASS);R(1037,1624,5,41,M.COPPER);
R(959,1715,68,11,M.MARBLE);R(1087,1714,78,11,M.MARBLE);
R(1095,1658,82,18,M.SLATE);R(1103,1664,63,8,M.CGLASS);
R(1095,1676,13,31,M.PLASTER);R(1158,1676,12,30,M.PLASTER);
// Distinct eastern maintenance pump chamber: solid inert machinery,
 // maintenance benches and genuine roomy access, no hazardous moving liquid.
R(1247,1599,201,109,M.AIR);R(1251,1599,193,9,M.COBBLE);
R(1273,1642,41,39,M.STEEL);R(1279,1649,29,24,M.DGLASS);
R(1328,1625,90,11,M.COPPER);R(1340,1636,9,50,M.BRASS);
R(1368,1644,53,27,M.IRON);R(1374,1650,41,14,M.AMBER);
R(1254,1770,177,9,M.COBBLE);R(1263,1779,38,23,M.GRANITE);
R(1389,1778,35,20,M.GRANITE);
// Far-east vaulted shelter with blue ceramic mural, accessible bay, display counter.
R(1699,1606,139,103,M.AIR);R(1702,1606,133,9,M.MARBLE);
for(let x=1713;x<1822;x+=28){
 R(x,1636,17,30,M.TILE);R(x+3,1640,11,22,M.CGLASS);
 R(x+6,1646,6,11,M.CYAN);
}
R(1720,1748,101,13,M.COBBLE);R(1726,1761,18,35,M.LIME);
R(1772,1761,40,6,M.BRASS);
// An intentionally continuous floor and subterranean geology, with irregular
// solid-backed wall feet, reading as a real built artery rather than black space.
R(105,1824,1833,19,M.COBBLE);R(105,1824,1833,5,M.MARBLE);
for(let [x,w] of [[145,176],[371,126],[558,192],[805,176],[1044,183],
 [1257,168],[1477,143],[1713,165]]){
 R(x,1814,w,10,M.GRANITE);
 R(x+8,1807,Math.max(16,w-20),6,M.SLATE);
}
for(let [x,y] of [[316,1681],[568,1679],[790,1660],[1181,1680],[1461,1693],[1710,1690]]){
 R(x-13,y-10,26,9,M.MARBLE);R(x-3,y-1,6,26,M.COBBLE);
 R(x-6,y+24,12,5,M.BRASS);
}
// Genuine passability guarantees at FIXED named places — no re-labelling and
// no nearest-point search. These pads only preserve the assigned operational
// anchors; whole-hull BFS subsequently tests all routes independently.
for(let [,x,y] of TARGETS)R(x-19,y-16,39,33,M.AIR);
};