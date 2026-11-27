"use strict";
/* COMMN-0012 R2A6: three connected inhabited vaulted underground districts.
   Source-led, real physical cells; preserve the previously fixed grounded ribs
   and the unchanged strict 16 Midge operating destinations. */
module.exports=function finishR2A6(G,W,H,M,TARGETS){
const R=(x,y,w,h,v)=>{x=Math.max(0,x|0);y=Math.max(0,y|0);w=Math.min(W-x,w|0);h=Math.min(H-y,h|0);if(w<=0||h<=0)return;for(let j=y;j<y+h;j++)G.fill(v,j*W+x,j*W+x+w)};
const arch=(x,w,crown,depth)=>{let a=x+19,b=x+w-20,h=(b-a)/2,mid=(a+b)/2;
for(let xx=a;xx<=b;xx++){let u=Math.abs((xx-mid)/h),y=crown+Math.round(depth*u*u);R(xx,y,1,1751-y,M.AIR)}};
const halls=[[204,440,1618,51],[756,502,1614,61],[1310,537,1624,49]];
for(let [x,w,c,d] of halls){
 R(x,1589,w,239,M.LIME);R(x-8,1589,w+16,12,M.COBBLE);
 R(x-4,1596,w+8,5,M.MARBLE);arch(x,w,c,d);
 R(x-4,1751,w+8,81,M.LIME);R(x-4,1751,w+8,8,M.MARBLE);
 R(x-13,1686,71,65,M.AIR);R(x+w-59,1686,74,65,M.AIR);
 R(x+30,1625,w-60,5,M.BRASS);R(x+45,1636,w-90,4,M.COPPER);
 // Unequal root-connected art deco buttresses carved around 45-cell air portals.
 R(x+16,1661,12,25,M.COBBLE);R(x+w-28,1660,12,27,M.COBBLE);
}
R(169,1689,1722,62,M.AIR); // Fully clear shared 31x27 flight spine
R(160,1749,1740,8,M.MARBLE);
for(let [x,w] of [[640,115],[1254,60],[1845,58]]){
 R(x,1588,w,19,M.COBBLE);R(x+9,1593,w-18,5,M.BRASS);
 R(x,1751,w,82,M.LIME);R(x,1751,w,6,M.MARBLE);
}
// WEST: book archive, visible shelves and warm inhabited counter, not racks
R(242,1651,133,10,M.COBBLE);R(249,1661,15,28,M.LIME);
R(356,1661,13,28,M.LIME);
for(let [x,w,y] of [[259,79,1640],[403,93,1635],[522,86,1655]]){
 R(x,y,w,7,M.SLATE);R(x+7,y+7,7,32,M.IBRICK);R(x+w-14,y+7,7,32,M.IBRICK);
 for(let k=x+14;k<x+w-10;k+=13){R(k,y+12,7,18,k%3?M.TERRA:M.TILE);R(k,y+19,5,6,M.AMBER)}
 R(x-4,y+39,w+8,5,M.BRASS);
}
R(390,1672,98,9,M.COBBLE);R(401,1681,15,8,M.LIME);
R(469,1681,13,8,M.LIME);
R(259,1733,121,9,M.SLATE);R(265,1742,19,10,M.COBBLE);
R(353,1742,20,10,M.COBBLE);R(299,1725,49,8,M.IBRICK);
// EXCHANGE: separated ticket office, waiting hall and paired service passages
R(785,1651,149,9,M.COBBLE);R(799,1660,20,29,M.LIME);
R(913,1660,14,29,M.LIME);
R(814,1637,106,12,M.DGLASS);R(821,1641,92,5,M.CYAN);
for(let x of [827,866,901]){R(x,1619,7,18,M.BRASS);R(x-7,1614,21,6,M.AMBER)}
R(1125,1631,92,11,M.SLATE);R(1137,1642,14,46,M.LIME);
R(1194,1642,15,46,M.LIME);R(1157,1648,29,24,M.CGLASS);
R(1160,1675,24,7,M.AMBER);R(1132,1680,79,7,M.BRASS);
for(let [x,w] of [[802,83],[1127,91]]){
 R(x,1734,w,9,M.COBBLE);R(x+8,1743,12,9,M.LIME);R(x+w-20,1743,12,9,M.LIME);
}
// EAST: deep service/freight plant and luminous mural, inert solid mechanisms
R(1344,1640,132,12,M.COBBLE);R(1357,1652,15,35,M.LIME);
R(1457,1652,15,35,M.LIME);
R(1395,1624,40,17,M.STEEL);R(1399,1642,36,30,M.DGLASS);
R(1403,1648,27,16,M.CYAN);R(1410,1615,8,9,M.BRASS);
R(1606,1624,205,10,M.COBBLE);R(1617,1634,19,54,M.LIME);
R(1784,1634,19,54,M.LIME);
for(let [x,w] of [[1647,38],[1704,52],[1771,25]]){
 R(x,1644,w,28,M.TILE);R(x+5,1648,w-10,18,M.CGLASS);
 R(x+8,1654,Math.max(5,w-16),5,M.CYAN);
}
R(1376,1730,164,9,M.SLATE);R(1382,1739,22,13,M.LIME);
R(1510,1739,22,13,M.LIME);R(1437,1720,49,10,M.STEEL);
R(1604,1732,164,11,M.COBBLE);R(1614,1743,19,9,M.LIME);
R(1740,1743,19,9,M.LIME);R(1667,1724,46,8,M.SLATE);
// The inherited plaza->subway shafts MUST remain continuous AIR. No bars
// across full-width portal mouths or isolated rail islands.
R(983,1495,101,211,M.AIR);R(1464,1473,130,233,M.AIR);
R(630,1522,103,184,M.AIR);
for(let [x,y] of [[245,1613],[590,1617],[857,1608],[1208,1615],[1355,1617],[1800,1615]]){
 R(x,y,27,7,M.BRASS);R(x+7,y+7,13,12,M.AMBER);R(x+10,y+9,7,7,M.WHITE);
}
 // Source-scale connected east portico, while preserving the old west
 // stair shaft at exact site x680,y1583 as an unbroken transit airway.
 R(1247,1628,68,30,M.LIME);
 R(1251,1628,60,7,M.COBBLE);
 R(1253,1658,56,92,M.AIR);
 R(1243,1683,14,19,M.COBBLE);
 R(1308,1683,13,19,M.COBBLE);

};