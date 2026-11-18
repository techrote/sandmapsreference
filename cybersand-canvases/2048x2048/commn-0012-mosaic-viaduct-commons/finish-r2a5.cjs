"use strict";
/* R2A5 source-JPEG-guided structural/gallery pass; actual material cells. */
module.exports = function finishR2A5(G,W,H,M){
  const R=(x,y,w,h,v)=>{x=Math.max(0,x|0);y=Math.max(0,y|0);w=Math.min(W-x,w|0);h=Math.min(H-y,h|0);if(w<=0||h<=0)return;for(let yy=y;yy<y+h;yy++)G.fill(v,yy*W+x,yy*W+x+w)};
  // Four 38–42-cell wide cardinally contiguous masonry ribs attach the
  // west archive, central transfer, east machine hall and eastern shelter to
  // existing grounded plaza retaining fabric, not 1-cell cables.
  for(let [x,a,b,w] of [[303,1455,1640,38],[898,1368,1565,39],[1132,1357,1570,39],[1620,1350,1555,42]]){
    R(x,a,w,b-a,M.LIME);R(x-8,a+8,w+16,10,M.COBBLE);
    R(x-5,b-9,w+10,13,M.GRANITE);R(x+7,a+15,4,b-a-28,M.MARBLE);
  }
  // Real masonry spring blocks tie ribs to solid gallery crowns.
  for(let [x,y,w] of [[235,1545,102],[875,1500,103],[1095,1500,113],[1590,1496,110]]){
    R(x,y,w,22,M.COBBLE);R(x+7,y+2,w-14,6,M.MARBLE);
  }
  // Four unequal grounded transit/mezzanine landings with 24-cell thick legs:
  // keep the existing cross-gallery air and wide vertical transfers intact.
  for(let [x,w,top] of [[289,162,1785],[771,138,1788],[1211,203,1782],[1675,151,1778]]){
    R(x,top,w,12,M.COBBLE);R(x+5,top-7,w-10,7,M.MARBLE);
    R(x,top+12,24,1834-(top+12),M.LIME);
    R(x+w-24,top+12,24,1834-(top+12),M.LIME);
    R(x+11,top+16,5,20,M.BRASS);R(x+w-17,top+16,5,20,M.BRASS);
  }
  // Inert and supported exhibits: archive freight, mechanical probe,
  // east works console, and asymmetrical blue civic-mosaic display.
  R(328,1766,56,12,M.IBRICK);R(333,1760,44,6,M.COPPER);R(392,1769,34,9,M.SLATE);
  R(810,1769,52,12,M.STEEL);R(826,1761,19,8,M.CGLASS);R(834,1755,4,6,M.BRASS);
  R(1252,1762,116,13,M.SLATE);R(1270,1758,22,4,M.BRASS);
  R(1323,1755,34,7,M.DGLASS);R(1332,1752,13,3,M.CYAN);
  R(1703,1756,84,12,M.TILE);R(1715,1750,27,6,M.CGLASS);R(1760,1747,16,9,M.CGLASS);
};
