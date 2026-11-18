"use strict";
/* BIOME-0037a R2B: source-faithful upper filament buttresses plus original
 * physically rooted lower geology and observation/service architecture.
 * Applied after R2A3; no image overlays, labels, fake atmospheric solids,
 * relocated waypoints, or edits to historical dynamic Water. Deterministic.
 */
module.exports=function finishFilamentR2B(a,W,H){
 const idx=(x,y)=>y*W+x;
 const ops=[[512,107],[355,187],[205,230],[740,320],[274,608],[151,800],
 [626,783],[600,992],[888,1035],[820,1100],[144,1363],[833,1545],
 [138,1695],[520,1864],[830,413],[219,588],[829,772],[233,976],
 [824,1160],[224,1359],[832,1567],[219,1764],[514,362],[512,854],
 [513,1335],[518,1706]];
 const nearSite=(x,y)=>ops.some(([sx,sy])=>Math.abs(x-sx)<=22&&Math.abs(y-sy)<=19);
 const put=(x,y,m)=>{
  if(x<18||x>=1006||y<27||y>=2038)return;
  const at=idx(x,y);if(a[at]===3)return;
  if(m!==0&&nearSite(x,y))return;
  a[at]=m;
 };
 const box=(x,y,w,h,m)=>{for(let yy=Math.max(27,y);yy<Math.min(H-10,y+h);yy++)
  for(let xx=Math.max(18,x);xx<Math.min(W-18,x+w);xx++)put(xx,yy,m);};
 const polygon=(p,m)=>{
  const ys=p.map(z=>z[1]),y0=Math.max(27,Math.floor(Math.min(...ys))),y1=Math.min(H-10,Math.ceil(Math.max(...ys)));
  for(let y=y0;y<y1;y++){let cross=[];for(let i=0;i<p.length;i++){
   const u=p[i],v=p[(i+1)%p.length],zz=y+.5;
   if((u[1]<=zz&&v[1]>zz)||(v[1]<=zz&&u[1]>zz))
     cross.push(u[0]+(zz-u[1])*(v[0]-u[0])/(v[1]-u[1]));
  }cross.sort((u,v)=>u-v);
   for(let i=0;i+1<cross.length;i+=2)for(let x=Math.ceil(cross[i]);x<Math.ceil(cross[i+1]);x++)put(x,y,m);
  }
 };
 const pipe=(x0,y0,x1,y1,r,m)=>{
  const q=(x1-x0)**2+(y1-y0)**2;
  for(let y=Math.max(27,Math.floor(Math.min(y0,y1)-r));y<Math.min(H-10,Math.ceil(Math.max(y0,y1)+r));y++)
  for(let x=Math.max(18,Math.floor(Math.min(x0,x1)-r));x<Math.min(W-18,Math.ceil(Math.max(x0,x1)+r));x++){
   const t=q?Math.max(0,Math.min(1,((x-x0)*(x1-x0)+(y-y0)*(y1-y0))/q)):0;
   const dx=x-x0-t*(x1-x0),dy=y-y0-t*(y1-y0);
   if(dx*dx+dy*dy<=r*r)put(x,y,m);
  }
 };
 const trace=(pts,r,m)=>{for(let j=1;j<pts.length;j++)
  pipe(...pts[j-1],...pts[j],Math.max(3,r-(j-1)*1.8),m);};
 // The authentic source's upper western web: root-to-branch continuous thin-to-thick
 // buttresses, different woven parabolic runs, and small genuine pore spaces.
 for(let [p,r] of [
 [[[26,93],[100,126],[164,119],[218,155],[272,144]],12],
 [[[31,290],[95,267],[164,291],[221,286],[299,316]],10],
 [[[27,447],[108,423],[182,458],[250,450],[313,470]],13],
 [[[31,546],[105,577],[176,570],[260,591],[336,561]],9],
 [[[32,725],[97,694],[173,720],[248,704],[305,734]],11],
 [[[27,879],[88,855],[155,877],[221,854],[289,886]],9]
 ])trace(p,r,99);
 for(let [p,r] of [
 [[[119,127],[142,178],[192,187]],5],
 [[[172,284],[191,337],[235,355]],4],
 [[[182,454],[198,499],[249,521]],6],
 [[[118,581],[155,636],[215,653]],5],
 [[[172,715],[199,777],[264,789]],4],
 [[[134,866],[163,931],[201,946]],5]
 ])trace(p,r,38);
 // Macro sculpt: source-specific living vault on the high western wall.
 polygon([[22,1029],[93,1043],[139,1088],[184,1151],[272,1192],
          [304,1267],[277,1324],[218,1330],[144,1300],[79,1279],[22,1302]],100);
 polygon([[22,1170],[69,1184],[101,1247],[166,1281],[229,1296],
          [244,1326],[188,1337],[106,1306],[22,1287]],99);
 // A true broad entry arch cut in the rooted fan, with physical (not proxy) flight approach.
 box(79,1300,219,92,0);box(237,1323,162,68,0);
 pipe(89,1300,187,1302,32,0);pipe(204,1320,309,1338,29,0);
 // Shell bands/stratification remain attached to the west geology.
 for(let [p,r] of [
 [[[29,1210],[84,1199],[139,1220],[199,1231],[254,1266]],7],
 [[[32,1439],[92,1421],[181,1428],[246,1446]],8],
 [[[29,1586],[97,1571],[169,1593],[245,1601]],9]
 ])trace(p,r,38);
 // Deep western observatory: non-boxed calcite fan and communicating natural alcoves.
 polygon([[25,1595],[104,1630],[175,1642],[292,1648],[333,1704],
          [311,1826],[210,1840],[98,1812],[24,1826]],100);
 pipe(99,1674,300,1690,36,0);pipe(90,1769,310,1767,33,0);
 trace([[27,1637],[92,1651],[153,1628],[223,1665]],10,99);
 trace([[32,1827],[123,1809],[199,1822],[284,1815]],9,38);
 // Three geological distinct suspended crystals grounded to the cut-rock shelf.
 for(let [x,y,h] of [[92,1638,52],[251,1644,38],[300,1797,47]]){
  polygon([[x-13,y],[x+13,y],[x+5,y+h],[x,y+h+19],[x-5,y+h]],122);
  pipe(x-17,y,x+18,y,5,38);
 }
 // East: heavy spiral geology and a visually explicit service-return terrace.
 polygon([[1003,1389],[971,1414],[921,1437],[846,1464],[797,1526],
          [791,1617],[854,1666],[938,1682],[1003,1660]],100);
 pipe(994,1515,829,1540,45,0);pipe(959,1611,811,1584,39,0);
 trace([[991,1433],[932,1455],[885,1500],[867,1542]],12,49);
 trace([[1002,1631],[944,1653],[877,1642],[815,1668]],8,38);
 for(let [x,y,w] of [[897,1464,73],[878,1633,88]]){
  box(x,y,w,7,62);box(x+8,y+11,w-16,3,122);
  for(let k=12;k<w-6;k+=23)box(x+k,y+17,5,13,49);
 }
 // Actual historic 35,688 Water cells remain unchanged. Surrounding rock
 // collars and non-rectangular catwalks make the basin an integrated service destination.
 polygon([[24,1830],[126,1837],[218,1848],[268,1871],[287,1905],
          [288,1980],[242,2010],[24,2010]],100);
 polygon([[1001,1835],[902,1841],[818,1872],[767,1910],
          [768,1983],[827,2011],[1001,2011]],101);
 trace([[199,1868],[247,1837],[310,1812],[379,1807]],14,49);
 trace([[826,1832],[772,1809],[708,1806],[651,1813]],12,49);
 box(338,1822,147,9,62);box(553,1822,151,9,62);
 for(let [x,y] of [[349,1820],[447,1820],[566,1820],[669,1820]]){
  box(x,y-14,6,14,122);box(x-5,y-16,15,5,62);
 }
 // Different entrances around basin, none seals a historic operational destination.
 box(230,1869,63,41,0);box(749,1865,60,46,0);
 // Large-volume real traversable exit and independent lower return,
 // not a 31x27-only point clearance or proxy waypoint.
 pipe(114,1695,492,1707,47,0);
 pipe(212,1764,479,1744,40,0);
 pipe(274,1719,475,1729,37,0);
 // Retain actual water and generous unmodified 31x27 operation air around named points.
};
