"use strict";
/* CANVAS R2A2: material-cell structural anchorage, 18 Nov 2026.
 * Full-width stone load paths, not single-pixel decorative supports. Each isolated
 * named major mass is tied through existing solid tissue to real y=2047 geology.
 * Each independent Midge flight lane remains open at 19x15/23x19/31x27.
 * Execute after finish-r2a.cjs and before deterministic coalescence. */
module.exports=function(G,W,H,M){
 const R=(x,y,w,h,v)=>{x=Math.max(0,Math.min(W,x|0));y=Math.max(0,Math.min(H,y|0));w=Math.min(w|0,W-x);h=Math.min(h|0,H-y);if(w<=0||h<=0)return;for(let yy=y;yy<y+h;yy++)G.fill(v,yy*W+x,yy*W+x+w)};
 // Library load-bearing west wall; fully touches elevated civic body and geology.
 // Rooted east terrace terminus; lower civic wing secures the subway floor.
 for(let [x,top,w,bottom,m] of [
  [54,1150,38,1855,M.LIME], [1899,1740,41,1856,M.LIME],
  [116,1780,31,1855,M.LIME]
 ]){
  R(x,top,w,bottom-top,m);
  R(x-9,bottom-28,w+18,33,M.GRANITE);
  for(let yy=top+28;yy<bottom-50;yy+=91)R(x+5,yy,w-10,4,M.COBBLE);
 }
 // Bounded stone ties marry existing separated civic bank, eastern stair and
 // planted terrace piers to the newly grounded eastern/civic material component.
 for(let [x,y,w,h] of [[1126,1231,29,61],[1417,1154,31,105],
                       [1630,1150,32,62],[1627,1590,30,265],
                       [1223,1778,30,82]]) {
  R(x,y,w,h,M.LIME);
  for(let yy=y+14;yy<y+h-7;yy+=67)R(x+4,yy,w-8,4,M.COBBLE);
 }
 // The long rising plaza stringer joins the detached west stair bank to the
 // grounded east masonry, ABOVE the full conservative southern overlook hull.
 R(932,1190,168,15,M.COBBLE);
 R(937,1190,158,4,M.MARBLE);
 // The western subterranean wing joins the true west load wall without
 // filling the human-scale passage or erasing the mosaicked colonnade.
 R(88,1325,36,18,M.LIME);
 R(94,1325,25,4,M.MARBLE);
};
