/** CyberSand filament cave R2A follow-on; deterministic actual-cell morphology.
 * Lower galleries are invented extrapolations, not literal source pixels.
 * Only 0/38/49/62/99/100/122; untouched original Water remains truly liquid.
 */
function finishR2A3(a,W,H){
 const id=(x,y)=>y*W+x, oldWater=3;
 const sites=[[512,107],[355,187],[205,230],[740,320],[274,608],[151,800],
 [626,783],[600,992],[888,1035],[820,1100],[144,1363],[833,1545],
 [138,1695],[520,1864],[830,413],[219,588],[829,772],[233,976],
 [824,1160],[224,1359],[832,1567],[219,1764],[514,362],[512,854],
 [513,1335],[518,1706]];
 const reserved=(x,y)=>sites.some(([sx,sy])=>Math.abs(x-sx)<=17&&Math.abs(y-sy)<=15);
 const put=(x,y,m)=>{if(x<18||x>=1006||y<27||y>=2048||a[id(x,y)]===oldWater||m&&reserved(x,y))return;a[id(x,y)]=m;};
 const pipe=(ax,ay,bx,by,r,m)=>{
  const dx=bx-ax,dy=by-ay,q=dx*dx+dy*dy;
  for(let y=Math.max(27,Math.floor(Math.min(ay,by)-r-1));y<=Math.min(2047,Math.ceil(Math.max(ay,by)+r+1));y++)
  for(let x=Math.max(18,Math.floor(Math.min(ax,bx)-r-1));x<=Math.min(1005,Math.ceil(Math.max(ax,bx)+r+1));x++){
    const t=q?Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/q)):0;
    const ex=x-ax-t*dx,ey=y-ay-t*dy;if(ex*ex+ey*ey<=r*r)put(x,y,m);
  }
 };
 const trace=(p,r,m)=>{for(let i=1;i<p.length;i++)pipe(...p[i-1],...p[i],Math.max(2,r-i*.5),m)};
 // Source-derived connected pale west filaments. Unequal diagonal arcs and
 // tertiary forks break up repetitive large blank apertures.
 for(const [p,r,m] of [
  [[[28,280],[80,270],[125,295],[176,304],[218,281]],8,99],
  [[[39,318],[85,331],[118,346]],4,122],
  [[[25,449],[67,462],[110,435],[149,458],[208,467]],7,99],
  [[[112,443],[131,415],[154,404]],4,122],
  [[[25,707],[62,682],[127,705],[169,685],[201,695]],7,99],
  [[[119,705],[149,747],[189,766]],4,122],
  [[[25,898],[72,884],[105,861],[174,876]],6,99],
  [[[33,570],[86,587],[119,608]],4,122]
 ])trace(p,r,m);
 // Varied much smaller natural pores, only cutting existing solid. Their
 // sizes and orientation are deliberately non-periodic.
 for(let k=0;k<31;k++){
   const cx=47+(k*83+Math.floor(13*Math.sin(k*1.71)))%383;
   const cy=66+(k*163+Math.floor(15*Math.sin(k*.87)))%844;
   if(a[id(cx,cy)]===0)continue;
   const rx=4+(k*7)%11,ry=6+(k*9)%17;
   for(let y=Math.max(28,cy-ry-3);y<=Math.min(950,cy+ry+3);y++)
   for(let x=Math.max(19,cx-rx-3);x<=Math.min(445,cx+rx+3);x++){
      const dx=(x-cx)/rx,dy=(y-cy)/ry,phi=Math.atan2(dy,dx);
      const rad=1+.09*Math.sin(3*phi+k)+.04*Math.sin(7*phi+k*.73);
      if(dx*dx+dy*dy<rad*rad)put(x,y,0);
   }
 }
 // One predominant uneven amphitheatre exit into the right-hand air shaft,
 // enlarged at mid-altitude, not five cloned arches. Keep all exact sites.
 trace([[322,613],[359,608],[411,629],[472,636]],28,0);
 trace([[345,665],[387,648],[444,655]],21,0);
 // Actual steel ladder is not a fictional climbing mechanic: reinforce its
 // rock-backed access ledges while retaining the true open transfer.
 for(const [y,x0] of [[767,429],[922,441],[1008,452]]){
  for(let x=x0;x<470;x++){let top=y+Math.round(2*Math.sin(x/14));for(let z=top;z<top+6;z++)put(x,z,z<top+2?62:49)}
  pipe(x0-10,y+15,x0+12,y+5,4,49);
 }

 // Geologically coherent west/east load-bearing masses. The source photograph
 // ends at the shelf; these are purpose-designed LOWER extrapolations, not a
 // stretched reference or a solid-colour visual backdrop.
 const bell=(y,cy,s)=>Math.exp(-Math.pow((y-cy)/s,2));
 for(let y=1135;y<1838;y++){
   const wReach=Math.max(68,Math.min(363,Math.round(132+
     166*bell(y,1319,142)+125*bell(y,1550,112)+170*bell(y,1740,134)+
     20*Math.sin(y/87)+9*Math.sin(y/27))));
   for(let x=18;x<wReach;x++){
     const edge=(x>wReach-13);
     const strata=Math.sin(y/52+x/147)+.27*Math.sin(y/14);
     put(x,y,edge?38:(strata>.95?49:100));
   }
   if(y>1260){
     const eReach=Math.max(649,Math.min(957,Math.round(944-
       242*bell(y,1532,146)-170*bell(y,1730,125)+
       21*Math.sin(y/79)+9*Math.sin(y/22))));
     for(let x=eReach;x<1006;x++){
       const edge=x<eReach+12;
       const strata=Math.sin(y/47+x/94);
       put(x,y,edge?38:(strata>.9?49:100));
     }
   }
 }
 // Unequal inhabited west chambers with distinct traversable air volumes.
 const room=(cx,cy,rx,ry,ph)=>{
  for(let y=Math.max(28,cy-ry-12);y<=Math.min(1838,cy+ry+12);y++)
  for(let x=Math.max(19,cx-rx-12);x<1005&&x<=cx+rx+12;x++){
   const dx=(x-cx)/rx,dy=(y-cy)/ry,ang=Math.atan2(dy,dx);
   const jitter=1+.075*Math.sin(3*ang+ph)+.035*Math.sin(9*ang+1.7*ph);
   if(dx*dx+dy*dy<jitter*jitter)put(x,y,0);
  }
 };
 room(171,1354,118,91,.4);
 room(123,1542,76,64,2.1);
 room(169,1695,122,77,1.3);
 room(225,1771,80,48,2.6);
 trace([[190,1354],[298,1341],[387,1339],[473,1340]],40,0);
 trace([[180,1540],[263,1520],[368,1535],[475,1548]],37,0);
 trace([[135,1695],[211,1695],[297,1688],[397,1704],[473,1707]],45,0);
 trace([[205,1760],[294,1752],[383,1744],[468,1745]],33,0);
 // East gallery and second independent return; truly open exact site centres.
 room(854,1554,95,64,1.3);
 room(856,1740,102,67,2.8);
 trace([[836,1548],[743,1547],[668,1539],[614,1528]],43,0);
 trace([[842,1725],[742,1724],[653,1737],[605,1759]],43,0);
 // Porous west roof side ducts diversify entrances and prevent dead ends.
 trace([[119,1261],[181,1297],[250,1327]],27,0);
 trace([[81,1640],[117,1673],[146,1703]],23,0);
 // Rock core is a continuous 4-neighbour scaffold: openings to central
 // Empty are deliberate and must still independently pass strict actor masks.

 // Extrapolated western relay, sheltered intermediate niche, deep return.
 // Roof + substantial mass-backed landings meet a real west attachment.
 const west=[
  {x0:24,x1:352,roof:1228,floor:1434,arch:20},
  {x0:24,x1:334,roof:1493,floor:1618,arch:13},
  {x0:24,x1:382,roof:1658,floor:1817,arch:25}
 ];
 for(let j=0;j<west.length;j++){
  const c=west[j];
  for(let x=c.x0;x<c.x1;x++){
    const t=(x-c.x0)/(c.x1-c.x0);
    const roof=Math.round(c.roof+c.arch*Math.sin(Math.PI*t)+7*Math.sin(x/37+j));
    const floor=Math.round(c.floor+10*Math.sin(x/51+j)+5*Math.sin(Math.PI*t));
    const thick=Math.max(2,Math.round(12*(.28+.72*Math.sin(Math.PI*t))));
    for(let y=roof;y<roof+thick;y++)put(x,y,j===0?99:38);
    for(let y=floor;y<floor+thick+4;y++)put(x,y,y<floor+4?122:49);
  }
  pipe(35,c.floor+9,96,c.floor+49,8,100);
 }
 // Unequal inner ribs are rooted to western wall and give the destination
 // distinct geology. Carve multiple separate fully open routes to free shaft.
 trace([[27,1304],[96,1288],[144,1298],[181,1305]],7,49);
 trace([[30,1521],[88,1543],[144,1528],[169,1511]],8,99);
 trace([[28,1731],[88,1750],[162,1718]],8,38);
 for(const p of [
  [[230,1324],[298,1309],[372,1324],[465,1340]],
  [[215,1540],[301,1521],[393,1531],[469,1549]],
  [[226,1728],[304,1710],[398,1716],[470,1731]]
 ])trace(p,34,0);
 // Different east-side galleries each have west-facing open mouths and
 // separate load-bearing landings attached to the existing right cliff.
 for(let x=723;x<1004;x++){
   const t=(x-723)/281;
   for(const [floor,mat] of [[1607,49],[1812,100]]){
      const yy=Math.round(floor-18*Math.sin(Math.PI*t)+5*Math.sin(x/36+floor));
      const thick=Math.max(3,Math.round(17*(.30+.70*t)));
      for(let y=yy;y<yy+thick;y++)put(x,y,y<yy+4?122:mat);
   }
 }
 trace([[1001,1492],[958,1480],[896,1464],[840,1452]],9,49);
 trace([[1001,1655],[951,1652],[890,1660]],11,100);
 for(const p of [
  [[941,1537],[879,1545],[773,1557],[669,1547]],
  [[976,1735],[905,1715],[817,1732],[747,1745]]
 ])trace(p,35,0);
 // A real maintenance gantry integrates the historic Water rectangle
 // x287..764 y1913..1988 without changing a single dynamic-liquid cell.
 // The saved overlook (520,1864) stays in 31x27-clear open air above.
 for(let x=278;x<=774;x++){
   const y0=1892+Math.round(3*Math.sin(x/43));
   for(let y=y0;y<y0+(x<325||x>727?13:7);y++)put(x,y,y<y0+3?62:49);
 }
 for(const [lo,hi] of [[278,315],[745,773]])
   for(let y=1901;y<1925;y++)for(let x=lo;x<=hi;x++)put(x,y,49);
 for(let x=360;x<694;x+=86)pipe(x,1883,x+12,1892,4,62);
trace([[91,1695],[180,1695],[287,1690],[384,1704],[473,1707]],39,0);
 // Tiny completely separated upper pale debris = actual collision needles.
 // Removing detached microspecks is not a waiver of blocked operating sites.
 const n=W*960,seen=new Uint8Array(n),queue=new Int32Array(n);
 const tissue=m=>m===38||m===99||m===122;
 let detached=0;
 for(let start=0;start<n;start++){
   if(seen[start]||!tissue(a[start]))continue;
   let f=0,z=1;queue[0]=start;seen[start]=1;
   while(f<z){let v=queue[f++],x=v%W,y=v/W|0;
      for(let nx of [v-1,v+1,v-W,v+W]){
        if(nx<0||nx>=n||seen[nx]||!tissue(a[nx]))continue;
        let xx=nx%W,yy=nx/W|0;
        if(Math.abs(xx-x)+Math.abs(yy-y)!==1)continue;
        seen[nx]=1;queue[z++]=nx;
      }
   }
   if(z<=15){for(let i=0;i<z;i++)a[queue[i]]=0;detached+=z;}
 }
}
if(typeof module!=="undefined")module.exports=finishR2A3;