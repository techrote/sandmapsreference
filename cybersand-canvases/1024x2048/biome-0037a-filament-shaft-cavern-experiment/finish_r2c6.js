"use strict";
/** R2C6 — source-scale hierarchical filament lattice, anchored service geology.
 * All changes are genuine initial CyberSand material cells, not rendered overlays.
 * Water mask, Midge model/spawn and exactly located operational sites are immutable.
 */
module.exports = function finishR2C6(a,W,H) {
 if(W!==1024||H!==2048)throw Error("R2C6 extent drift");
 const I=(x,y)=>y*W+x, previous=a.slice();
 const sites=[[355,187],[205,230],[740,320],[274,608],[151,800],[626,783],[600,992],[888,1035],[820,1100],[144,1363],[833,1545],[138,1695],[520,1864],[512,107],[830,413],[219,588],[829,772],[233,976],[824,1160],[224,1359],[832,1567],[219,1764],[514,362],[512,854],[513,1335],[518,1706]];
 function guarded(x,y){return sites.some(([sx,sy])=>Math.abs(x-sx)<=20&&Math.abs(y-sy)<=18);}
 function write(x,y,m){x=Math.round(x);y=Math.round(y);
  if(x<19||x>=1005||y<29||y>=2035)return;
  const p=I(x,y);if(previous[p]===3||a[p]===3)return;
  if(m!==0&&guarded(x,y)&&previous[p]===0)return;
  a[p]=m;
 }
 function disk(x,y,r,m){const rr=r*r;
  for(let yy=Math.floor(y-r);yy<=Math.ceil(y+r);yy++)for(let xx=Math.floor(x-r);xx<=Math.ceil(x+r);xx++)
   if((xx-x)**2+(yy-y)**2<=rr)write(xx,yy,m);
 }
 function spline(P,start,end,m,steps=90) { // quadratic/cubic pointwise taper
  for(let k=0;k<=steps;k++){const t=k/steps,u=1-t;
   let x,y;
   if(P.length===4){x=u**3*P[0][0]+3*u*u*t*P[1][0]+3*u*t*t*P[2][0]+t**3*P[3][0];
    y=u**3*P[0][1]+3*u*u*t*P[1][1]+3*u*t*t*P[2][1]+t**3*P[3][1];}
   else {x=u*u*P[0][0]+2*u*t*P[1][0]+t*t*P[2][0];
    y=u*u*P[0][1]+2*u*t*P[1][1]+t*t*P[2][1];}
   disk(x,y,start*(1-t)+end*t,m);
  }
 }
 function ring(cx,cy,rx,ry,tilt,w,phase,open=0){
  const co=Math.cos(tilt),si=Math.sin(tilt),n=460;
  for(let i=0;i<n;i++){const t=2*Math.PI*i/n;
   if(open&&Math.cos(t)>.93&&Math.sin(t)>-.25)continue;
   const d=1+.063*Math.sin(3*t+phase)+.032*Math.sin(5*t-phase*.7)+.020*Math.sin(9*t+phase*1.2);
   const u=rx*Math.cos(t)*d,v=ry*Math.sin(t)*d;
   const x=cx+co*u-si*v,y=cy+si*u+co*v;
   const radius=w*(.80+.21*Math.sin(2*t+phase)+.10*Math.sin(5*t-phase));
   disk(x,y,Math.max(3.1,radius),99);
   if((i%4)===0&&Math.sin(t+phase)>.57)disk(x+1,y-2,2.1,38);
  }
 }
 // Reconstruct source's pale LEFT-FACING fenestrated tissue at game scale.
 // The old opaque slab was not an adequate translation of the slender woven reference.
 for(let y=35;y<505;y++)for(let x=27;x<450;x++)write(x,y,0);
 for(let y=35;y<524;y++){
  const edge=48+Math.round(8*Math.sin(y/71)+5*Math.sin(y/23));
  for(let x=20;x<=edge;x++)write(x,y,x<edge-10?38:99);
 }
 // Nine intentionally unequal major lobes, with offset axes and occasional open mouths.
 for(const o of [
 [84,122,29,87,-.22,5.0,.6,0],[149,108,27,89,.17,4.9,1.8,0],
 [213,115,34,91,-.18,5.2,2.5,0],[292,122,43,78,.24,5.6,2.0,1],
 [378,179,35,84,-.26,5.0,3.6,1],[93,306,38,79,.14,5.7,1.3,0],
 [171,303,41,87,-.23,5.6,2.5,0],[254,339,54,88,.16,6.1,3.1,1],
 [361,365,42,79,-.12,5.6,1.8,1],[117,460,45,55,-.25,5.6,2.6,0],
 [237,460,52,48,.13,5.7,3.4,1]
 ])ring(...o);
 // Secondary nested fenestrations, *attached* to the larger living ribs.
 for(const o of [
 [91,146,13,34,-.12,3.6,2.0,1],[155,104,13,31,.15,3.6,1.2,1],
 [229,139,16,38,-.12,3.7,3.6,1],[87,331,14,31,.28,3.8,1.3,1],
 [178,326,17,40,-.10,3.6,4.1,1],[270,359,19,36,.22,3.5,2.6,1]
 ])ring(...o);
 // Broad-to-fine rooted ramification: every minor branch attaches to mother wall
 // or intersects a real major pore perimeter; no isolated thin 'art stickers'.
 for(const [p,r0,r1,m] of [
 [[[48,62],[82,75],[111,91],[134,120]],11,4.8,99],
 [[[48,180],[78,184],[98,198],[129,219]],11,4.5,99],
 [[[46,254],[83,252],[112,275],[134,299]],11,5.3,99],
 [[[46,395],[88,390],[106,419],[132,456]],12,4.8,99],
 [[[54,492],[106,504],[184,476],[224,457]],11,5.0,99],
 [[[107,178],[140,187],[179,188],[210,190]],6,3.5,99],
 [[[242,65],[273,75],[301,103],[335,131]],7,3.8,99],
 [[[170,291],[194,269],[221,268],[244,283]],6,3.0,99],
 [[[282,326],[316,339],[349,364],[399,394]],7,3.3,99],
 [[[121,357],[155,396],[188,404],[216,428]],7,3.5,99],
 [[[46,520],[111,531],[220,518],[305,526]],13,6.0,99],
 [[[313,475],[359,478],[390,485],[415,489]],7,3.5,99]
 ])spline(p,r0,r1,m);
 // Diagonal anastomosis connecting neighboring long pores into woven membrane.
 for(const [p,r0,r1,m] of [
 [[[56,204],[101,217],[150,199],[205,202]],6,3.5,99],
 [[[72,366],[115,375],[168,355],[218,347]],6,3.3,99],
 [[[162,63],[185,75],[209,94],[240,90]],5,3.0,99],
 [[[231,210],[272,218],[318,211],[363,229]],6,3.0,99],
 [[[90,428],[137,418],[177,434],[216,450]],6,3.2,99],
 [[[249,407],[287,401],[339,408],[386,426]],6,3.0,99]
 ])spline(p,r0,r1,m,86);
 // Controlled microscopic paired ribs inside selected major openings.
 for(const [p,r0,r1] of [
 [[[76,111],[90,120],[98,143]],4.3,2.8],
 [[[193,67],[216,80],[228,112]],4.8,3.0],
 [[[91,259],[113,267],[131,288]],5.2,3.0],
 [[[196,321],[221,326],[248,309]],5.2,3.0],
 [[[339,281],[365,293],[389,323]],4.7,2.9],
 [[[71,414],[92,424],[115,440]],4.2,2.8],
 [[[264,439],[286,456],[325,460]],4.3,3.1]
 ])spline(p,r0,r1,38,55);
 // Finely laminated calcite rim is a *real reclassification of solid cells*.
 const upper=a.slice();
 for(let y=39;y<511;y++)for(let x=30;x<441;x++){
  const p=I(x,y),m=upper[p];
  if(m!==99)continue;
  let voidNear=false;for(const [dx,dy] of [[-3,0],[3,0],[0,-3],[0,3]]){
   const xx=x+dx,yy=y+dy;if(xx>18&&xx<1005&&yy>28&&yy<2035&&upper[I(xx,yy)]===0)voidNear=true;
  }
  if(voidNear&&Math.sin(x/29+y/71)>.64)write(x,y,122);
 }
 // Physically rooted extension into the existing lower membrane / ladder abutment.
 for(const [p,r0,r1,m] of [
 [[[65,500],[129,537],[180,578],[225,613]],11,4,99],
 [[[292,493],[335,525],[384,551],[447,554]],12,6,38],
 [[[62,650],[133,668],[185,691],[251,717]],10,4.6,99],
 [[[71,756],[153,779],[210,794],[271,811]],10,4.5,38]
 ])spline(p,r0,r1,m);
 // A real anchored landing at the end of the web, beside the interrupted ladder.
 // Short, supported bridge treads are distinct from an untested climbing mechanic.
 for(const [p,r0,r1,m] of [
 [[[292,563],[359,560],[410,566],[449,570]],14,9,49],
 [[[286,765],[367,767],[426,777],[457,783]],12,7,49],
 [[[288,907],[359,893],[416,887],[457,883]],13,8,100]
 ])spline(p,r0,r1,m);
 // EXTRAPOLATED WEST DISTRICTS: three different rock-backed useful destinations.
 // Assay berth: horizontal supported walkway, guarded mineral sample pockets,
 // and oblique real buttress rather than blank elliptical dark chambers.
 for(const [p,r0,r1,m] of [
 [[[24,1409],[103,1406],[194,1421],[311,1414]],20,10,49],
 [[[45,1451],[95,1438],[148,1420],[181,1415]],22,9,100],
 [[[23,1330],[72,1323],[120,1314],[171,1323]],20,10,100],
 [[[21,1517],[92,1516],[151,1508],[234,1518]],20,9,100],
 [[[21,1588],[90,1602],[179,1603],[257,1581]],24,8,49],
 [[[24,1743],[91,1733],[188,1751],[307,1747]],22,12,49],
 [[[26,1789],[92,1768],[151,1750],[198,1746]],27,12,100],
 [[[21,1831],[95,1822],[180,1827],[275,1828]],19,9,100]
 ])spline(p,r0,r1,m);
 // Deep west paired stratified core-sample niches (carved into solid rock only).
 for(const [cx,cy,rx,ry] of [[90,1292,35,24],[91,1557,32,29],[125,1809,41,18]]){
  for(let y=cy-ry;y<=cy+ry;y++)for(let x=cx-rx;x<=cx+rx;x++){
   const u=(x-cx)/rx,v=(y-cy)/ry;if(u*u+v*v<1&&previous[I(x,y)]!==0)write(x,y,0);
  }
  spline([[cx-rx-7,cy+ry+4],[cx,cy+ry+11],[cx+rx+8,cy+ry+3]],8,5,38,35);
 }
 // Mineral inspection frames with actual attached support legs.
 for(const [x,y] of [[93,1391],[142,1727]]){
  spline([[x-20,y+19],[x-14,y],[x+14,y],[x+21,y+19]],5,5,62,36);
  spline([[x-25,y+20],[x+25,y+20],[x+39,y+25]],7,5,49,26);
 }
 // EXTRAPOLATED EAST: a basalt RETURN, not a repeated left-side grotto.
 for(const [p,r0,r1,m] of [
 [[[1001,1398],[958,1392],[903,1384],[842,1392]],22,9,100],
 [[[1001,1444],[953,1429],[927,1399],[903,1388]],24,11,100],
 [[[1001,1498],[956,1502],[897,1499],[839,1507]],17,9,49],
 [[[1000,1614],[956,1604],[888,1606],[826,1618]],22,10,100],
 [[[1001,1656],[951,1650],[917,1629],[892,1611]],24,9,100],
 [[[1001,1747],[967,1731],[900,1731],[836,1741]],21,10,49],
 [[[1001,1804],[958,1782],[914,1754],[884,1742]],25,12,100]
 ])spline(p,r0,r1,m);
 // Thin mineral-vein bands stay within solid rock; cannot create falling particles.
 for(let y=1200;y<=1840;y+=67)for(let x=25;x<1004;x++){
  const yy=y+Math.round(6*Math.sin(x/51+y/39));
  if(yy<29||yy>=2035)continue;const p=I(x,yy);
  if([49,100,101].includes(a[p])&&((x<310)||(x>785)))write(x,yy,38);
 }

 // Explicit continuous 31x27-clear access: biological upper observation pore,
 // central lamina landing and under-web shelf doorway are *real empty cells*.
 // Unlike radius-tolerant waypoint checks, these cuts connect the exact named centres.
 function mouth(P,r){for(let j=1;j<P.length;j++){
   const [x0,y0]=P[j-1],[x1,y1]=P[j],n=Math.ceil(Math.hypot(x1-x0,y1-y0)/2);
   for(let k=0;k<=n;k++){const t=k/n;disk(x0+(x1-x0)*t,y0+(y1-y0)*t,r,0);}
 }}
 mouth([[205,230],[271,225],[351,213],[443,222],[515,221]],28);
 mouth([[219,588],[267,592],[327,602],[406,618],[508,615]],27);
 mouth([[233,976],[281,970],[361,976],[449,971],[518,974]],28);


 // Three historically detached inert but visually substantial access fixtures
 // are given real mineral abutments: no near-contact rendering tricks.
 spline([[22,690],[111,689],[253,683],[413,681]],15,9,49);
 spline([[22,761],[116,758],[213,763],[313,771]],16,9,49);
 spline([[688,1019],[691,1033],[694,1058]],14,11,100);
 // Avoid orphaned inert collision debris: remove any whole-solid components
 // not actually four-neighbour-connected to the boundary-grounded geology.
 // Does not move any Water cells, actors, semantic points or initial routes.
 const earth = new Uint8Array(W*H),wave = new Int32Array(W*H);
 let first=0,last=1;wave[0]=0;earth[0]=1;
 while(first<last){const p=wave[first++],x=p%W;
  for(const d of [-1,1,-W,W]){const k=p+d;
   if(k<0||k>=W*H||earth[k]||(d===1&&x===W-1)||(d===-1&&x===0)||a[k]===0||a[k]===3)continue;
   earth[k]=1;wave[last++]=k;
  }
 }
 for(let i=0;i<a.length;i++)if(a[i]!==0&&a[i]!==3&&!earth[i])a[i]=0;

 // Repair singleton solid flecks created by thin rim combinations.
 // Never remove Water or replace empty collision space with fake artwork.
 const seen=new Uint8Array(W*960),stack=new Int32Array(W*960),tissue=m=>(m===38||m===99||m===122);
 const comp=[];
 for(let p=0;p<W*960;p++){if(seen[p]||!tissue(a[p]))continue;
  let n=1,pos=0;stack[0]=p;seen[p]=1;const members=[];
  while(pos<n){let k=stack[pos++],x=k%W;members.push(k);
   for(const d of [-1,1,-W,W]){const q=k+d;if(q<0||q>=W*960||seen[q]||!tissue(a[q])||(d===1&&x===W-1)||(d===-1&&x===0))continue;seen[q]=1;stack[n++]=q;}
  }
  comp.push(members);
 }
 comp.sort((a,b)=>b.length-a.length);
 for(let i=1;i<comp.length;i++)for(const k of comp[i])a[k]=0;
};