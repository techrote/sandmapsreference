"use strict";
/** R2C4: source-JPEG-led, true material-grid remodelling; no image overlays.
 * Upper-left = source-derived porous tissue/ladder/shelf. Deep world = extrapolated.
 * Water ID 3, actor manifest and exact operational sites remain untouched. */
module.exports=function finishFilamentR2C4(a,W,H){
 if(W!==1024||H!==2048)throw Error("BIOME extent drift");
 const I=(x,y)=>y*W+x;
 const sites=[[512,107],[355,187],[205,230],[740,320],[274,608],[151,800],[626,783],[600,992],[888,1035],[820,1100],[144,1363],[833,1545],[138,1695],[520,1864],[830,413],[219,588],[829,772],[233,976],[824,1160],[224,1359],[832,1567],[219,1764],[514,362],[512,854],[513,1335],[518,1706]];
 const protectedSite=(x,y)=>sites.some(([sx,sy])=>Math.abs(x-sx)<=24&&Math.abs(y-sy)<=22);
 function put(x,y,m){x=Math.round(x);y=Math.round(y);if(x<19||x>1004||y<29||y>2034)return;const i=I(x,y);if(a[i]===3||(m&&protectedSite(x,y)))return;a[i]=m;}
 function ell(cx,cy,rx,ry,m,phase=0){
  for(let y=Math.max(29,Math.floor(cy-ry*1.1));y<=Math.min(2034,Math.ceil(cy+ry*1.1));y++)
  for(let x=Math.max(19,Math.floor(cx-rx*1.1));x<=Math.min(1004,Math.ceil(cx+rx*1.1));x++){
   const dx=(x-cx)/rx,dy=(y-cy)/ry,t=Math.atan2(dy,dx);
   const r=1+.027*Math.sin(3*t+phase)+.014*Math.sin(7*t-phase);
   if(dx*dx+dy*dy<r*r)put(x,y,m);
  }
 }
 function tube(x0,y0,x1,y1,r,m){
  const vx=x1-x0,vy=y1-y0,d=vx*vx+vy*vy||1;
  for(let y=Math.max(29,Math.floor(Math.min(y0,y1)-r-2));y<=Math.min(2034,Math.ceil(Math.max(y0,y1)+r+2));y++)
  for(let x=Math.max(19,Math.floor(Math.min(x0,x1)-r-2));x<=Math.min(1004,Math.ceil(Math.max(x0,x1)+r+2));x++){
   const t=Math.max(0,Math.min(1,((x-x0)*vx+(y-y0)*vy)/d));
   if((x-x0-vx*t)**2+(y-y0-vy*t)**2<=r*r)put(x,y,m);
  }
 }
 function line(points,r,m){for(let j=1;j<points.length;j++)tube(...points[j-1],...points[j],r,m);}
 function arc(cx,cy,rx,ry,start,end,r,phase=0){
  const n=Math.ceil(Math.max(rx,ry)*(end-start)/2.8);
  for(let k=1;k<=n;k++){
   const t=start+(end-start)*k/n,p=start+(end-start)*(k-1)/n;
   const a=1+.027*Math.sin(3*t+phase),b=1+.027*Math.sin(3*p+phase);
   tube(cx+rx*b*Math.cos(p),cy+ry*b*Math.sin(p),cx+rx*a*Math.cos(t),cy+ry*a*Math.sin(t),r,99);
  }
 }
 // Explicitly replace old crossing sticks, incoherent wedges, and visual
 // one-cell fragments in the source-derived upper organism ONLY.
 for(let y=35;y<947;y++){
  const edge=Math.round(430+27*Math.sin(y/173+.33)+13*Math.sin(y/54+.17));
  for(let x=19;x<=490;x++)if(a[I(x,y)]!==3)a[I(x,y)]=0;
  for(let x=19;x<edge;x++)put(x,y,x>edge-12?38:99);
 }
 // Four deliberately differentiated porous galleries. Broad outlet channels
 // link each cluster to the dark central vault; not closed decorative ovals.
 for(const [cx,cy,rx,ry,ph] of [
  [110,143,73,85,.3],[292,176,111,109,1.3],
  [139,351,99,100,1.8],[320,357,98,91,.8],
  [113,569,92,107,2.1],[301,605,110,102,.5],
  [153,786,117,116,1.5],[326,813,100,100,.6]
 ])ell(cx,cy,rx,ry,0,ph);
 for(const [pts,r] of [
  [[[168,196],[241,200],[307,202],[408,206],[527,205]],40],
  [[[197,352],[277,359],[359,357],[456,358],[530,353]],37],
  [[[185,596],[244,604],[321,606],[416,615],[527,616]],39],
  [[[194,796],[264,808],[364,807],[448,817],[528,832]],42],
  [[[155,271],[186,248],[216,237]],28],
  [[[157,455],[188,489],[228,550]],27],
  [[[175,685],[209,662],[252,631]],26],
  [[[230,973],[329,970],[435,969],[531,976]],42]
 ])line(pts,r,0);
 // Nested C-membranes: no free-sticks, no complete ring enclosing an actor.
 for(const [cx,cy,rx,ry,ph] of [
  [110,144,54,64,.2],[290,174,76,75,1.2],
  [140,354,72,70,1.3],[323,360,68,60,.6],
  [115,568,64,72,.7],[302,604,78,73,2.2],
  [151,783,84,87,.6],[325,812,67,72,1.2]
 ]){
  arc(cx,cy,rx,ry,.48,2.83,5.5,ph);
  arc(cx,cy,rx*.67,ry*.68,1.90,4.32,3.1,ph);
  tube(cx-rx*.91,cy-ry*.28,cx-rx*1.53,cy-ry*.62,7,99);
  tube(cx-rx*.85,cy+ry*.51,cx-rx*1.52,cy+ry*.94,7,99);
 }
 // Organic microfenestration is subordinate to macro arches.
 for(let k=0;k<26;k++){
  const x=49+(k*83)%308,y=78+(k*131)%826;
  if(a[I(x,y)]===99&&!protectedSite(x,y))ell(x,y,7+(k*5)%11,11+(k*7)%18,0,k*.7);
 }
 // Material-index highlights ON the actual solid-air boundaries.
 const old=a.slice();
 for(let y=39;y<931;y++)for(let x=26;x<460;x++){
  if(old[I(x,y)]!==99)continue;
  if(old[I(x-2,y)]===0||old[I(x+2,y)]===0||old[I(x,y-2)]===0||old[I(x,y+2)]===0)put(x,y,122);
  else if(Math.sin(y/45+x/57)>1.43)put(x,y,38);
 }
 // Integrated sequential ladder landings and rocky thresholds, without
 // pretending the interrupted ladder is continuously climbable.
 for(const [y,x] of [[556,384],[742,398],[998,395]]){
  line([[x,y+6],[x+36,y-3],[452,y+4],[465,y+6]],10,49);
 }
 // Shelf anchors become thick tapered rock masses grounded to both walls.
 for(let y=1042;y<1193;y++){
  const l=Math.round(171+211*Math.exp(-Math.pow((y-1041)/103,2))+15*Math.sin(y/32));
  const r=Math.round(946-208*Math.exp(-Math.pow((y-1041)/112,2))-13*Math.sin(y/38));
  for(let x=19;x<l;x++)put(x,y,x>l-13?38:Math.floor(y/31)%4===0?49:100);
  for(let x=r;x<1005;x++)put(x,y,x<r+13?38:Math.floor(y/34)%4===0?49:100);
 }
 // The deeper part is intentionally newly invented geology: west calcite hall
 // and east basalt observation/return must be real walk-in destinations.
 for(let y=1190;y<1838;y++){
  const l=Math.round(182+158*Math.exp(-Math.pow((y-1376)/141,2))
    +143*Math.exp(-Math.pow((y-1715)/133,2))+18*Math.sin(y/66));
  const r=Math.round(937-174*Math.exp(-Math.pow((y-1547)/144,2))
    -148*Math.exp(-Math.pow((y-1741)/102,2))+11*Math.sin(y/52));
  for(let x=19;x<l;x++)put(x,y,x>l-14?38:Math.floor(y/35)%5===0?49:100);
  for(let x=r;x<1005;x++)put(x,y,x<r+14?38:Math.floor(y/43)%5===0?49:100);
 }
 // Inhabitable west calcite hall and second lower return, joined to open vault.
 ell(159,1366,126,91,0,.5);
 line([[197,1363],[292,1350],[405,1351],[520,1355]],44,0);
 ell(155,1681,114,107,0,2.2);
 line([[189,1685],[293,1680],[407,1697],[520,1706]],44,0);
 line([[195,1768],[286,1756],[402,1747],[510,1743]],39,0);
 for(const [y,xend] of [[1455,368],[1812,386]])for(let x=32;x<xend;x++){
  const top=y+Math.round(5*Math.sin(x/47)+2*Math.sin(x/14));
  for(let yy=top;yy<top+20;yy++)put(x,yy,yy<top+4?38:yy<top+10?49:100);
 }
 // Singular two-level basalt gallery with real support beneath observation floor.
 ell(865,1550,100,76,0,1.1);
 line([[870,1547],[785,1544],[699,1542],[618,1528]],43,0);
 ell(865,1723,92,67,0,1.7);
 line([[860,1726],[768,1724],[681,1730],[610,1744]],42,0);
 for(const [y,x0] of [[1634,793],[1803,811]])for(let x=x0;x<1005;x++){
  const top=y+Math.round(5*Math.sin(x/46));
  for(let yy=top;yy<top+22;yy++)put(x,yy,yy<top+4?38:100);
 }
 // Keep ALL 35688 Water positions unchanged and add only dry geological transition.
 line([[48,1822],[139,1826],[223,1830],[280,1841]],19,100);
 line([[1000,1819],[920,1826],[851,1831],[790,1840]],19,100);
 // Final true Empty flight portals cannot be occluded by finishing materials.
 for(const [pts,r] of [
  [[[227,975],[331,970],[440,971],[535,972]],43],
  [[[197,1362],[309,1352],[420,1353],[520,1357]],39],
  [[[195,1685],[313,1683],[432,1704],[530,1708]],39],
  [[[870,1550],[765,1548],[670,1540],[608,1527]],38]
 ])line(pts,r,0);
 // West/east load-bearing abutments retain 31x27 accessible sub-shelf transfer.
 line([[820,1100],[756,1115],[683,1120],[606,1148]],43,0);
 // Genuine right-side vertical flight bypass joining upper shelf and sub-shelf hall.
 line([[886,971],[886,1029],[883,1080],[869,1130],[820,1100]],42,0);
 // Exact upper observatory gets a 31x27-through arched living-gallery mouth.
 line([[205,230],[265,229],[338,204],[453,204],[528,207]],43,0);

 // Second-pass visual critique: restore the JPEG's nested biological mesh
 // instead of a barren cream slab with a few oversized uniform voids.
 for(const [cx,cy,rx,ry,ph] of [
  [256,74,28,29,.6],[367,79,26,24,1.7],
  [71,255,25,25,1.3],[115,475,27,36,.9],
  [62,711,27,31,2.1],[370,487,21,27,.7]
 ])ell(cx,cy,rx,ry,0,ph);
 for(const [cx,cy,rx,ry,ph] of [
  [286,180,58,56,1.2],[322,358,55,49,2.7],
  [306,607,62,57,.7],[324,806,51,57,1.7],
  [124,354,49,53,1.8],[110,564,45,52,.3]
 ]){
  arc(cx,cy,rx,ry,.49,2.81,4.1,ph);
  arc(cx+3,cy+3,rx*.70,ry*.66,1.97,4.20,2.9,ph+.7);
 }
 // Whole rooted, curved branching systems connect each membrane to the left
 // host cliff, so none are floating solid collision artefacts.
 for(const [p,r] of [
  [[[20,104],[65,104],[111,126],[157,152],[229,170]],7],
  [[[20,275],[75,276],[135,295],[201,338],[275,361]],8],
  [[[20,457],[62,467],[112,490],[158,534],[250,594]],7],
  [[[20,692],[61,711],[128,731],[196,763],[269,802]],9],
  [[[20,842],[91,865],[158,854],[217,838],[274,812]],7],
  [[[46,115],[65,147],[104,174]],5],
  [[[77,292],[104,329],[128,355]],5],
  [[[111,488],[143,539],[169,580]],5],
  [[[111,732],[151,773],[187,800]],5],
  [[[221,173],[257,164],[288,154]],6],
  [[[271,356],[299,340],[327,330]],5],
  [[[251,594],[282,577],[309,565]],5]
 ])line(p,r,99);
 // Reinstall a genuinely readable SteelPlate ladder. Prior upper overwrite
 // is deliberately followed by these rails, 23-cell rung cadence and break
 // at the large portal; a rock tie forms each docking.
 for(let y=568;y<=1015;y++){
  if(y>=793&&y<=858)continue;
  for(let dx=0;dx<3;dx++){put(466+dx,y,62);put(485+dx,y,62);}
  if(y%23<3)for(let x=469;x<485;x++)put(x,y,62);
 }
 // West/east deep rooms: remove a mechanically stable but visually false
 // regular horizontal-bar motif; use irregular thin stratified horizons.
 for(let y=1194;y<1835;y++){
  const limit=Math.round(182+158*Math.exp(-Math.pow((y-1376)/141,2))
      +143*Math.exp(-Math.pow((y-1715)/133,2))+18*Math.sin(y/66));
  for(let x=20;x<Math.min(limit,440);x++){
   if(a[I(x,y)]===49&&y!==1455&&y!==1812)put(x,y,100);
  }
 }
 for(const [cy,x0,x1] of [[1286,36,286],[1471,37,300],[1594,36,254],[1819,35,320]]){
  for(let x=x0;x<x1;x++){
   const y=cy+Math.round(3*Math.sin(x/37)+2*Math.sin(x/15));
   for(let t=0;t<3;t++)if(a[I(x,y+t)]===100)put(x,y+t,49);
  }
 }

 // Source-led generous lower fenestration: actual 31x27-open outward gallery.
 line([[151,800],[216,803],[292,814],[381,812],[529,823]],44,0);
 // Remove real physical pale fragments unattached to the principal left host.
 // Only retained principal component has a load path back to the cliff.
 const T=W*960,visited=new Uint8Array(T),queue=new Int32Array(T),parts=[];
 const tissue=m=>m===38||m===99||m===122;
 for(let seed=0;seed<T;seed++){
  if(visited[seed]||!tissue(a[seed]))continue;
  let first=0,last=1;queue[0]=seed;visited[seed]=1;
  while(first<last){
   const p=queue[first++],x=p%W,y=p/W|0;
   for(const q of [p-1,p+1,p-W,p+W]){
    if(q<0||q>=T||visited[q]||!tissue(a[q]))continue;
    if(Math.abs(q%W-x)+Math.abs((q/W|0)-y)!==1)continue;
    visited[q]=1;queue[last++]=q;
   }
  }
  parts.push([last,Array.from(queue.subarray(0,last))]);
 }
 parts.sort((a,b)=>b[0]-a[0]);
 for(let j=1;j<parts.length;j++)for(const p of parts[j][1])a[p]=0;
};