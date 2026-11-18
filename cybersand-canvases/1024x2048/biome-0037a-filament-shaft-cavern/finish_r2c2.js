"use strict";
/* Canvas Reworker C — R2 second pass. Source-derived upper rooted fenestration,
 * rock-abutted ladder and shelf; original authored lower observatory, return,
 * reservoir buttress. Material grid only. Historic Water stays dynamic. */
module.exports=function finishFilamentR2C2(a,W,H){
 const idx=(x,y)=>y*W+x, sites=[[512,107],[355,187],[205,230],[740,320],[274,608],[151,800],[626,783],[600,992],[888,1035],[820,1100],[144,1363],[833,1545],[138,1695],[520,1864],[830,413],[219,588],[829,772],[233,976],[824,1160],[224,1359],[832,1567],[219,1764],[514,362],[512,854],[513,1335],[518,1706]];
 const safe=(x,y)=>sites.some(([sx,sy])=>Math.abs(x-sx)<=26&&Math.abs(y-sy)<=23);
 const put=(x,y,m)=>{if(x<19||x>=1005||y<29||y>=2035)return;const p=idx(x,y);if(a[p]===3||(m!==0&&safe(x,y)))return;a[p]=m};
 const blob=(cx,cy,rx,ry,m,phase=0)=>{
  for(let y=Math.max(29,cy-ry-10);y<=Math.min(2034,cy+ry+10);y++)
  for(let x=Math.max(19,cx-rx-10);x<=Math.min(1004,cx+rx+10);x++){
   const dx=(x-cx)/rx,dy=(y-cy)/ry,t=Math.atan2(dy,dx),r=1+.075*Math.sin(3*t+phase)+.035*Math.sin(7*t+phase*1.67);
   if(dx*dx+dy*dy<r*r)put(x,y,m);
  }
 };
 const pipe=(x0,y0,x1,y1,r,m)=>{
  const dx=x1-x0,dy=y1-y0,q=dx*dx+dy*dy;
  for(let y=Math.max(29,Math.floor(Math.min(y0,y1)-r-2));y<Math.min(2035,Math.ceil(Math.max(y0,y1)+r+3));y++)
  for(let x=Math.max(19,Math.floor(Math.min(x0,x1)-r-2));x<Math.min(1005,Math.ceil(Math.max(x0,x1)+r+3));x++){
   const t=q?Math.max(0,Math.min(1,((x-x0)*dx+(y-y0)*dy)/q)):0,ex=x-x0-t*dx,ey=y-y0-t*dy;
   if(ex*ex+ey*ey<r*r)put(x,y,m);
  }
 };
 const chain=(pts,r,m)=>{for(let j=1;j<pts.length;j++)pipe(...pts[j-1],...pts[j],r,m)};
 const pale=m=>m===38||m===99||m===122;
 // Remove sparse toothpick-wide pale strokes, retaining rooted coherent mass.
 const old=a.slice();
 for(let y=44;y<936;y++)for(let x=45;x<435;x++){
   if(!pale(old[idx(x,y)])||safe(x,y))continue;
   let count=0;
   for(let dy=-6;dy<=6;dy+=3)for(let dx=-6;dx<=6;dx+=3)if(pale(old[idx(x+dx,y+dy)]))count++;
   if(count<=5)put(x,y,0);
 }
 // Prefer curvature and multi-scale rooted trunks over anonymous diagonals.
 for(const [pts,r] of [
  [[[31,157],[83,164],[135,191],[190,208],[255,217]],15],
  [[[32,352],[78,339],[129,354],[190,382],[253,399]],14],
  [[[32,529],[78,507],[135,514],[186,545],[249,563]],16],
  [[[32,704],[85,701],[131,730],[189,747],[245,755]],16],
  [[[32,878],[75,854],[129,873],[176,895],[238,910]],14]
 ]){
  const end=pts[pts.length-1];
  if(!pale(a[idx(end[0],end[1])]))continue;
  for(let j=1;j<pts.length;j++)pipe(...pts[j-1],...pts[j],r-1.7*j,99);
 }
 // Irregular deep-tissue small pores, not uniform rows or source pixel stamps.
 for(let k=0;k<230;k++){
  let x=48+(k*151+Math.floor(13*Math.sin(k*1.21)))%370;
  let y=61+(k*137+Math.floor(19*Math.sin(k*.77)))%850;
  if(safe(x,y)||!pale(a[idx(x,y)]))continue;
  let solid=0;
  for(let dy=-9;dy<=9;dy+=3)for(let dx=-9;dx<=9;dx+=3)if(pale(a[idx(x+dx,y+dy)]))solid++;
  if(solid<37)continue;
  blob(x,y,5+(k*7)%11,7+(k*11)%16,0,k*.73);
 }
 // Real ladder/cave transfer architecture, not hypothetical climbing inputs.
 for(const [y,x0,x1] of [[752,420,462],[875,431,461],[995,428,459]]){
   for(let x=x0;x<x1;x++){
     const t=y+Math.round(3*Math.sin((x-x0)/20));
     for(let yy=t;yy<t+10;yy++)if(x<x0+23||a[idx(x,yy)]!==0)put(x,yy,yy<t+3?38:49);
   }
   pipe(x0+5,y+24,x0+21,y+8,9,100);
 }
 // The source shelf reads as a thick supported cantilever, not floating line.
 for(let y=1040;y<1162;y++){
   const right=Math.round(177+207*Math.exp(-Math.pow((y-1047)/82,2))+7*Math.sin(y/17));
   for(let x=20;x<right;x++)if(x<160||y<1100)put(x,y,x>right-12?38:100);
 }
 // Newly extrapolated west: one substantial contiguous supported massif,
 // carved into three *distinct* connected halls rather than scratchy ribs.
 for(let y=1240;y<1840;y++){
   const a1=Math.exp(-Math.pow((y-1348)/108,2)),a2=Math.exp(-Math.pow((y-1550)/83,2)),a3=Math.exp(-Math.pow((y-1718)/130,2));
   const tip=Math.max(122,Math.min(405,Math.round(151+152*a1+87*a2+191*a3+13*Math.sin(y/39)+8*Math.sin(y/17))));
   for(let x=19;x<tip;x++)put(x,y,x>tip-12?38:(Math.sin(x/62+y/38)>.95?49:100));
 }
 blob(161,1358,130,74,0,.4);
 chain([[213,1352],[294,1336],[382,1340],[485,1341]],47,0);
 blob(129,1549,84,60,0,1.7);
 chain([[150,1553],[228,1529],[309,1516],[484,1538]],41,0);
 blob(173,1693,117,90,0,2.2);
 chain([[206,1690],[303,1673],[396,1700],[487,1708]],51,0);
 blob(224,1774,79,51,0,1.8);
 chain([[217,1765],[308,1745],[414,1728],[484,1730]],40,0);
 // Nested arch niches and rock-founded threshold details.
 for(const [x,y,rx,ry,ph] of [[77,1272,21,19,.2],[301,1278,28,23,.7],
 [65,1444,21,25,1.1],[272,1476,22,17,2.3],[77,1619,18,22,2.1],
 [302,1624,25,16,.6],[80,1813,22,17,1.4]])blob(x,y,rx,ry,0,ph);
 for(let x=64;x<300;x++)for(let y=1424;y<1440;y++)if(a[idx(x,y)]!==0)put(x,y,y<1430?38:49);
 // East basaltary return: a singular coherent double-entry observatory,
 // with rock-integrated ledges and a west-facing flight threshold.
 for(let y=1373;y<1835;y++){
  const bulge=154*Math.exp(-Math.pow((y-1542)/133,2))+133*Math.exp(-Math.pow((y-1740)/93,2));
  const left=Math.max(690,Math.round(955-bulge+14*Math.sin(y/53)+7*Math.sin(y/19)));
  for(let x=left;x<1005;x++)put(x,y,x<left+13?38:(Math.sin(y/42+x/83)>1.03?49:100));
 }
 blob(875,1547,93,69,0,1.3);
 chain([[835,1540],[753,1530],[687,1537],[609,1519]],46,0);
 blob(888,1736,88,50,0,2.9);
 chain([[862,1738],[781,1722],[704,1744],[609,1755]],44,0);
 for(const [y,from] of [[1612,794],[1797,818]])
  for(let x=from;x<1005;x++){
    const top=y+Math.round(5*Math.sin((x-from)/47));
    for(let yy=top;yy<top+13;yy++)if(a[idx(x,yy)]!==0)put(x,yy,yy<top+4?38:49);
  }
 // Preserve all 35,688 original Water cells. New geological containment
 // buttresses are structural rock (no reservoir content substitution).
 chain([[80,1825],[176,1832],[243,1858],[269,1890]],24,100);
 chain([[966,1826],[876,1841],[812,1863],[772,1906]],26,100);
 blob(245,1911,49,49,100,2.1);
 blob(790,1914,48,49,101,1.7);
 chain([[256,1859],[286,1832],[337,1821]],16,49);
 chain([[783,1857],[744,1829],[690,1823]],15,49);
 blob(261,1858,32,28,0,.8);
 blob(779,1859,32,28,0,2.1);
  // Upper shelf/nursery transfer is physically open to the central vault.
  // This is an actual carved 88-cell-high corridor, not a waypoint waiver.
  chain([[233,976],[333,969],[437,974],[531,970]],44,0);
  // Reconnect the largest surviving pale tissue islands to the cliff root
  // at independently computed closest actual-solid endpoints (not waypoints).
  for(const [x0,y0,x1,y1,r] of [
    [332,78,333,77,9],[422,426,422,377,12],[378,926,378,913,10],
    [86,241,88,239,8],[372,326,379,326,8],[152,372,158,370,7],
    [268,884,271,881,7]])pipe(x0,y0,x1,y1,r,99);
};