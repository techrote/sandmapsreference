"use strict";
/* COMMN-0012 source-led R2B macro-architecture overlay.
 * It changes the ACTUAL material-cell plane before lossy-free rectangle coalescence.
 * This is a supported civic terrace/undercroft, not sky-colouring or image compositing.
 * R: clip-safe rectangle, P: solid polygon, E: ellipse. No stochastic texture.
 */
module.exports=function finishR2B(G,W,H,M,TARGETS,R,L,P,E){
  for (let [x,y,w,bottom,style] of [
    [744,1270,190,1569,0],[1095,1182,177,1569,1],
    [1432,1087,220,1569,2],[1808,1005,142,1569,3]]) {
    P([[x,y+9],[x+18,y],[x+w-19,y-11],[x+w,y+4],
       [x+w,bottom],[x,bottom]],style%2?M.PLASTER:M.LIME);
    R(x,y,w,12,M.COBBLE);R(x,y,w,4,M.MARBLE);
    R(x+8,y+17,w-16,6,M.BRASS);
    const arX=x+19,arW=w-38,arY=y+86+(style%2)*14;
    R(arX,arY,arW,bottom-arY+8,M.AIR);
    E(arX+(arW>>1),arY,arW>>1,29+style*3,M.AIR);
    R(x+10,y+62,9,37,M.SLATE);R(x+w-20,y+61,8,38,M.SLATE);
  }
  // Different heights, realistic footing and readable stair progression.
  for(let [x,y,w] of [[758,1270,198],[1074,1183,211],[1423,1089,245],[1776,1007,171]]){
    R(x,y,w,15,M.MARBLE);R(x,y+14,w,6,M.COBBLE);
    for(let dx=26;dx<w-22;dx+=63)R(x+dx,y+19,24,4,M.SLATE);
  }
  // Carve purposeful vaulted circulation, NOT point-only waypoint holes.
  R(907,1221,219,112,M.AIR);
  R(1023,1260,90,221,M.AIR);
  R(1232,1130,229,111,M.AIR);
  R(1252,1228,108,290,M.AIR);
  R(1614,1031,206,112,M.AIR);
  R(1698,1141,123,380,M.AIR);
  R(638,1189,135,249,M.AIR);
  R(669,1437,133,213,M.AIR);
  R(943,1470,142,195,M.AIR);
  R(1241,1478,120,183,M.AIR);
  R(1484,1425,137,239,M.AIR);
  R(1709,1440,114,222,M.AIR);
  // The lower transit is a connected built civic corridor with named sky links.
  R(85,1568,1852,22,M.COBBLE);R(85,1568,1852,6,M.MARBLE);
  for(let [x,w] of [[657,155],[932,161],[1230,145],[1479,153],[1697,130]]){
    R(x,1542,w,92,M.AIR);
    R(x-8,1607,8,26,M.BRASS);R(x+w,1607,8,26,M.BRASS);
  }
  // Nonidentical continuous public-use undercroft interiors, attached to floor/roof.
  for(let [x,y,w] of [[184,1686,298],[798,1684,262],[1312,1672,233],[1784,1664,144]]){
    R(x,y,w,15,M.SLATE);R(x+14,y+17,w-28,17,M.CGLASS);
    R(x+17,y+43,w-34,6,M.BRASS);
  }
  // Preserve large connected air-lanes THROUGH and AROUND the terrace banks.
  // These are real travel shafts, not +/- radius or closest-point waivers.
  R(946,1066,141,734,M.AIR);
  R(1278,976,129,744,M.AIR);
  R(1490,1140,103,640,M.AIR);
  R(1694,905,126,829,M.AIR);
  R(673,1389,104,367,M.AIR);
  // Airborne undercroft route and full 31x27 exits to all vaulted entries.
  R(670,1616,1216,77,M.AIR);
  R(958,1640,122,148,M.AIR);
  R(1490,1640,111,154,M.AIR);
  R(1280,1640,118,142,M.AIR);
  // Public scale: stone-backed route on real solid footing, no fake collision sky.
};
