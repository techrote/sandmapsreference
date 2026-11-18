"use strict";
/* Source-JPEG-guided R2A physical-cell civic and undercroft repair. */
module.exports=function finishA(G,W,H,M){
 const R=(x,y,w,h,m)=>{x=Math.max(0,Math.min(W,x|0));y=Math.max(0,Math.min(H,y|0));w=Math.min(W-x,w|0);h=Math.min(H-y,h|0);if(w<=0||h<=0)return;for(let yy=y;yy<y+h;yy++)G.fill(m,yy*W+x,yy*W+x+w)};
 const L=(x,y,xx,yy,t,m)=>{let dx=Math.abs(xx-x),dy=Math.abs(yy-y),sx=x<xx?1:-1,sy=y<yy?1:-1,e=dx-dy,j=0;for(;;){R(x-(t>>1),y-(t>>1),t,t,m);if(x===xx&&y===yy)break;let f=e*2;if(f>-dy){e-=dy;x+=sx}if(f<dx){e+=dx;y+=sy}if(++j>5000)throw Error("line")}};
 const tiers=[[677,1271,206,98],[883,1234,191,93],[1074,1197,216,95],[1290,1155,207,99],[1497,1115,212,91],[1709,1073,189,87]];
 for(let i=0;i<tiers.length;i++){
  const [x,y,w,d]=tiers[i];
  R(x,y,w,d,i%3===1?M.PLASTER:M.LIME);R(x,y,w,10,M.MARBLE);R(x,y+10,w,7,M.COBBLE);
  R(x+8,y+29,w-16,6,M.COBBLE);R(x+9,y+47,w-18,5,i%2?M.SLATE:M.TERRA);R(x+6,y+d-12,w-12,8,M.COBBLE);
  let wx=x+30+(i%2)*7,ww=w-65+(i%3)*5;R(wx,y+58,ww,d-50,M.AIR);
  for(let c=0;c<3;c++)R(wx+9+c*(Math.floor(ww/3)),y+52,17+(c%2)*7,5,M.BRASS);
  if(i!==2)R(x+15,y-12,46+(i%2)*27,8,M.COBBLE);
 }
 R(960,1207,90,128,M.AIR);R(953,1191,104,12,M.MARBLE);R(953,1201,104,5,M.BRASS);
 for(const [x,y,w] of [[706,1268,160],[1083,1194,168],[1518,1112,162]])R(x,y,w,7,M.MARBLE);
 for(const [x,top,w,base] of [[822,1323,26,1572],[1124,1291,31,1572],[1424,1251,28,1572],[1624,1204,29,1572],[1881,1160,32,1572]]){
  R(x,top,w,base-top,M.LIME);R(x-7,top-9,w+14,12,M.COBBLE);R(x-8,base-15,w+16,15,M.GRANITE);
  R(x+6,top+38,5,Math.max(5,base-top-78),M.BRASS);
 }
 for(const [x,y,w,h] of [[658,1370,132,246],[943,1261,145,356],[1266,1215,135,398],[1475,1160,126,458],[1682,1125,140,489]]){
  R(x,y,w,h,M.AIR);R(x-10,y+23,8,56,M.PLASTER);R(x+w+2,y+23,8,56,M.PLASTER);
 }
 for(const [x,atY,foot] of [[770,1202,1271],[1100,1135,1197],[1480,1053,1155]]){
  R(x-4,atY,8,foot-atY+4,M.STEEL);R(x-15,foot-5,31,11,M.COBBLE);L(x,foot-45,x+29,foot-6,5,M.BRASS);
 }
 R(76,1573,1872,28,M.LIME);R(76,1573,1872,7,M.MARBLE);
 for(const [x,w] of [[658,143],[939,160],[1252,150],[1470,148],[1680,147]]){
  R(x,1542,w,93,M.AIR);R(x-13,1566,13,65,M.COBBLE);R(x+w,1566,13,65,M.COBBLE);
  R(x-20,1576,7,37,M.BRASS);R(x+w+13,1576,7,37,M.BRASS);
 }
 for(const [x,w] of [[91,562],[804,128],[1104,146],[1405,66],[1628,49],[1833,100]]){
  R(x,1610,w,8,M.COBBLE);R(x+8,1620,w-16,5,M.COPPER);
  for(let xx=x+23;xx<x+w-32;xx+=83){
   R(xx,1634,11,33,M.LIME);R(xx-5,1632,21,8,M.BRASS);
   R(xx+24,1637,35,9,M.CGLASS);R(xx+27,1648,27,3,M.CYAN);
  }
 }
 for(const [x,y,w,k] of [[135,1737,253,0],[409,1750,183,1],[815,1738,173,2],[1148,1754,189,3],[1771,1730,151,4]]){
  R(x,y,w,13,M.COBBLE);R(x+9,y+14,11,39,M.LIME);R(x+w-19,y+14,11,39,M.LIME);
  R(x+23,y+20,w-46,8,M.DGLASS);R(x+23,y+29,w-46,4,M.BRASS);
  if(k%2===0)R(x+45,y-8,34,8,M.AMBER);R(x+17,y+50,w-34,6,M.SLATE);
 }
 R(82,1795,1860,35,M.AIR);R(82,1830,1860,17,M.COBBLE);R(82,1830,1860,5,M.MARBLE);
 for(const [x,y,w,h,v] of [[96,478,35,154,0],[179,482,48,145,1],[265,476,42,166,2],[99,709,43,115,3],[222,708,57,114,4]]){
  R(x,y,w,h,M.PLASTER);R(x,y,5,h,M.TILE);R(x+w-5,y,5,h,M.TILE);
  R(x+4,y+7,w-8,5,M.CGLASS);L(x+w/2|0,y+h-15,x+w/2|0,y+22,3,M.CYAN);
  for(let j=0;j<4+(v%2);j++){
   const yy=y+23+j*24,shift=((j+v)%3-1)*(w/4|0);
   L(x+(w/2|0),yy,x+(w/2|0)+shift,yy-15,3,j%2?M.VERDI:M.TILE);
   R(x+(w/2|0)+shift-4,yy-20,9,7,j%2?M.CYAN:M.CGLASS);
  }R(x+9,y+h-16,w-18,7,M.BRASS);
 }
 const sites=[[404,502],[545,536],[1005,528],[1660,519],[502,916],[681,1100],[895,812],[1000,1236],[1305,1082],[1360,976],[680,1583],[1045,1353],[1326,1480],[521,1712],[1000,1712],[1534,1692]];
 for(const [x,y] of sites)R(x-19,y-16,39,33,M.AIR);
};
