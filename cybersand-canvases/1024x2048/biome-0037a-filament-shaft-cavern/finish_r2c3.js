"use strict";
/**
 * CYBERSAND CANVAS REWORKER C — R2C3 source-fidelity geometry.
 * Deterministic material-only overlay. No image layers, source edits or
 * proxy-waypoint manipulation; immutable dynamic Water is retained.
 *
 * Source-derived: x22–444 / y42–930 pale cellular webs, ladder thresholds
 * and rock-shelf origin. Invented playable continuation: deep west/east,
 * lower maintenance terrace around the historically preserved reservoir.
 */
module.exports=function finishFilamentR2C3(a,W,H){
 if(W!==1024||H!==2048)throw Error("Unexpected BIOME-0037a extent");
 const at=(x,y)=>y*W+x;
 // Never silently relocate operational points; newly solid matter is
 // prohibited inside each full 31x27 hull plus a conservative buffer.
 const sites=[
 [512,107],[355,187],[205,230],[740,320],[274,608],[151,800],
 [626,783],[600,992],[888,1035],[820,1100],[144,1363],[833,1545],
 [138,1695],[520,1864],[830,413],[219,588],[829,772],[233,976],
 [824,1160],[224,1359],[832,1567],[219,1764],[514,362],[512,854],
 [513,1335],[518,1706]
 ];
 function protectedSite(x,y){return sites.some(([sx,sy])=>Math.abs(x-sx)<26&&Math.abs(y-sy)<24)}
 let changes=0;
 function put(x,y,m){
   x=Math.round(x);y=Math.round(y);
   if(x<19||x>1004||y<29||y>2034)return;
   const p=at(x,y),old=a[p];
   if(old===3||old===m||(m!==0&&protectedSite(x,y)))return;
   a[p]=m;changes++;
 }
 function disk(cx,cy,r,m){
   const x0=Math.max(19,Math.floor(cx-r)),x1=Math.min(1004,Math.ceil(cx+r));
   const y0=Math.max(29,Math.floor(cy-r)),y1=Math.min(2034,Math.ceil(cy+r));
   for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)
     if((x-cx)*(x-cx)+(y-cy)*(y-cy)<=r*r)put(x,y,m);
 }
 function stroke(points,rad,m){
   for(let k=1;k<points.length;k++){
     const [x0,y0]=points[k-1],[x1,y1]=points[k];
     const n=Math.ceil(Math.hypot(x1-x0,y1-y0)*1.3);
     for(let i=0;i<=n;i++){const t=i/n;
       disk(x0+(x1-x0)*t,y0+(y1-y0)*t,Math.max(1.6,rad*(1-.22*k/(points.length-1))),m);}
   }
 }
 function arc(cx,cy,rx,ry,t0,t1,thick,phase=0){
   const pts=[];const steps=Math.ceil(Math.abs(t1-t0)*Math.max(rx,ry)/2.3);
   for(let k=0;k<=steps;k++){
     const t=t0+(t1-t0)*k/steps;
     const und=1+.045*Math.sin(3*t+phase)+.026*Math.sin(7*t-phase);
     pts.push([cx+rx*Math.cos(t)*und+8*Math.sin(t+phase)*Math.sin(t),
       cy+ry*Math.sin(t)*und]);
   }
   stroke(pts,thick,99);
 }
 const tau=Math.PI*2;
 // Four distinct pendant chambers: thick-then-fine arches, internal
 // partial laminae and web-rooted loops. Do not close the large flyable pores.
 for(const [cx,cy,rx,ry,ph] of [
   [101,128,48,59,.7],[113,349,53,57,2.2],
   [290,465,64,52,1.6],[139,659,59,70,.3]
 ]){
   arc(cx,cy,rx,ry,.45,tau-.33,7,ph);
   arc(cx+4,cy+7,rx*.67,ry*.66,.60,Math.PI*1.85,4.0,ph+.8);
   arc(cx+9,cy+14,rx*.44,ry*.43,Math.PI*.05,Math.PI*1.42,2.6,ph+1.7);
   stroke([[cx-rx-22,cy-ry*.65],[cx-rx*.89,cy-ry*.54],[cx-rx*.73,cy-ry*.25]],7,99);
 }
 // The source's elevated filigree is interwoven and asymmetrical, not
 // oblique disconnected toothpicks: branching tissue junctions are curved.
 for(const [path,r] of [
 [[[29,98],[59,109],[84,142],[129,174],[177,195]],10],
 [[[31,307],[69,318],[90,351],[144,380],[192,392]],9],
 [[[30,537],[66,552],[92,578],[142,588],[188,572]],9],
 [[[31,725],[74,706],[112,679],[165,666],[218,690]],10],
 [[[220,373],[244,393],[269,429],[311,445],[348,430]],7],
 [[[260,523],[295,502],[326,474],[349,450]],6],
 [[[182,733],[225,711],[265,688],[300,686]],7]
 ])stroke(path,r,99);
 // Concentric ruffled voidlets are cut only in thick coherent pale tissue.
 const tissue=m=>m===38||m===99||m===122;
 for(let k=0;k<94;k++){
   const x=42+(k*113+Math.round(12*Math.sin(k*1.47)))%376;
   const y=54+(k*173+Math.round(16*Math.sin(k*.93)))%822;
   if(!tissue(a[at(x,y)])||protectedSite(x,y))continue;
   let solid=0;
   for(let dy=-12;dy<=12;dy+=4)for(let dx=-12;dx<=12;dx+=4)
     if(tissue(a[at(x+dx,y+dy)]))solid++;
   if(solid<38)continue;
   const rx=4+k%8,ry=7+(k*5)%13;
   for(let yy=-ry;yy<=ry;yy++)for(let xx=-rx;xx<=rx;xx++){
     const t=Math.atan2(yy/ry,xx/rx),r=1+.09*Math.sin(5*t+k*.63);
     if(xx*xx/(rx*rx)+yy*yy/(ry*ry)<r*r)put(x+xx,y+yy,0);
   }
 }
 // Clear the isolated opacity left by a previously cut upper transfer;
 // the patch is a genuine aperture, not a visual masking element.
 for(let y=565;y<585;y++)for(let x=345;x<387;x++)
   if(a[at(x,y)]===99||a[at(x,y)]===38||a[at(x,y)]===122)put(x,y,0);
 // One deliberately continuous access language: twin ladder rails,
 // structural tie-back brackets and a clearly intentional threshold
 // interruption at the lower pore; no unsupported scattered rail fragments.
 for(let y=552;y<=1015;y++){
   if(y>=797&&y<=859)continue; // sheltered wide rock-to-shaft crossover
   for(let d=0;d<2;d++){put(467+d,y,62);put(484+d,y,62);}
   if(y%24<3)for(let x=469;x<484;x++)put(x,y,62);
 }
 // Rock-backed top docking and landing; the rock tie-ins project from
 // existing left cliff, not decorative free-standing signage.
 // Removed unrooted upper guide bracket; upper ladder rail tied at intermediate shelves.
 stroke([[422,747],[451,740],[468,739]],9,49);
 stroke([[419,880],[450,875],[467,876]],9,49);
 stroke([[414,999],[439,1010],[466,1015]],14,49);
 // One sheltered portal at the broken rail has a stone jamb and lintel,
 // while preserving the horizontal Midge passage through y797–859.
 stroke([[426,790],[442,784],[456,789]],9,38);
 stroke([[423,864],[444,869],[457,867]],8,38);
 // Shelf stratigraphy: join substantial west rock into an east receiver,
 // leave airy openings underneath and all named sites unobstructed.
 for(let x=233;x<=811;x++){
   const y0=Math.round(1017+3*Math.sin(x/71)+2*Math.sin(x/26));
   const depth=x<376?29+(376-x)*.07:x>728?17+(x-728)*.12:8;
   for(let y=y0;y<y0+depth;y++){
     if(x<370||x>740||y<y0+7)put(x,y,y<y0+4?38:(y<y0+13?49:100));
   }
 }
 // Glacial ribs root into the main shelf at selected geologically plausible
 // positions, not a repeating full-length colonnade.
 for(const p of [
 [[322,1031],[312,1074],[279,1112],[232,1143]],
 [[757,1033],[768,1075],[808,1136],[862,1170]]
 ])stroke(p,12,100);
 // Deep west: distinctive calcite interpretive grotto, asymmetric
 // pavilion-like rock vault, supported seating ledge, physical entry throat.
 // Preserves exact deep old and new destination centres (144,1363 etc.).
 stroke([[24,1259],[75,1249],[131,1267],[177,1291],[219,1320]],22,100);
 stroke([[36,1458],[101,1474],[166,1489],[224,1475],[268,1457]],18,49);
 stroke([[45,1552],[103,1541],[163,1553],[219,1576]],16,100);
 stroke([[49,1817],[98,1814],[153,1796],[208,1784],[253,1793]],18,100);
 // Attached calcareous stalactite curtains distinct from upper botanical mesh.
 for(const [x,y,reach] of [[68,1269,38],[118,1284,54],[195,1311,47],[70,1555,34],[184,1572,32]]){
   stroke([[x,y],[x+9,y+reach*.47],[x+5,y+reach]],7,38);
 }
 // Root-supported observation bench with real double-sided access.
 stroke([[233,1424],[296,1420],[341,1414],[384,1411]],10,49);
 stroke([[255,1424],[248,1460],[240,1481]],10,100);

 // Asymmetric occupied calcareous walk-in chamber rather than ribbon decor.
 // Supported west floor and descending side steps lead to the central void;
 // this is a static landing, not a re-labelled destination proxy.
 for(let x=23;x<=363;x++){
   const y0=Math.round(1424+5*Math.sin(x/77)+3*Math.sin(x/23));
   const d=x<134?29:x<240?15:11;
   for(let y=y0;y<y0+d;y++)put(x,y,y<y0+4?38:(y<y0+12?49:100));
 }
 for(let y=1430;y<1530;y++){
   const edge=Math.round(51+22*Math.sin(y/74));
   for(let x=20;x<edge;x++)put(x,y,100);
 }
 stroke([[291,1428],[312,1395],[329,1374]],13,49);
 // Lower distinctive rooting chamber: a substantial firm floor and an
 // offset tier, connected directly to the left host cliff.
 for(let x=22;x<=326;x++){
   const top=Math.round(1811+6*Math.sin(x/68)+3*Math.sin(x/19));
   for(let y=top;y<top+(x<114?29:14);y++)put(x,y,y<top+4?38:100);
 }
 stroke([[23,1639],[68,1638],[109,1621],[153,1602]],13,49);
 stroke([[23,1664],[73,1678],[102,1694]],11,100);
 // East basalt observatory and alternate return: a real receiving floor,
 // a distinct arch-backed alcove, a geological access lip and split exit.
 stroke([[1003,1489],[965,1494],[922,1487],[897,1468]],20,100);
 stroke([[1003,1614],[965,1596],[924,1597],[885,1604],[861,1624]],14,49);
 stroke([[1003,1779],[957,1783],[906,1797],[852,1800]],19,100);
 stroke([[887,1604],[896,1652],[923,1680]],10,100);
 // Avoid adding unsupported basalt spur in free flight volume.
 // A rocky, legible maintenance approach to the original water excavation:
 // shore/bulkhead transitions only; every original Water cell is immutable.
 stroke([[89,1819],[140,1830],[202,1850],[259,1881]],18,100);
 stroke([[988,1821],[922,1832],[858,1850],[806,1887]],18,100);
 stroke([[231,1863],[266,1849],[318,1843],[358,1848]],12,49);
 stroke([[822,1855],[773,1845],[722,1847],[684,1854]],12,49);

 // Source-derived open pore exits, with width sufficient for exact native
 // 31x27 hull + additional manoeuvring allowance.
 stroke([[268,610],[328,598],[385,620],[443,613],[519,620]],34,0);
 stroke([[261,595],[318,554],[366,545],[422,541],[495,539]],26,0);
 // Former filament nursery transfer: natural, wide dry cave corridor,
 // intentionally reconnecting the long rock shelf approach to open flight.
 stroke([[233,976],[307,965],[389,964],[472,970],[542,968]],35,0);
 // Upper physical ladder head anchors into the real limestone edge,
 // *after* portal excavation: no isolated rail part in free-flying void.
 stroke([[401,518],[417,520],[433,532],[448,549],[467,570]],10,49);
 return {changed_writes:changes};
};
