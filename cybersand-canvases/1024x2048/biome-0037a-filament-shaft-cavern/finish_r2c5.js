"use strict";
/** R2C5 genuine source-led macro-repair; exact old 31x27 travel volume protected. */
module.exports=function finishR2C5(a,W,H){
 if(W!==1024||H!==2048)throw Error("BIOME R2C5 extent drift");
 const N=W*H,I=(x,y)=>y*W+x,old=a.slice();
 const sites=[[355,187],[205,230],[740,320],[274,608],[151,800],[626,783],[600,992],[888,1035],[820,1100],[144,1363],[833,1545],[138,1695],[520,1864],[512,107],[830,413],[219,588],[829,772],[233,976],[824,1160],[224,1359],[832,1567],[219,1764],[514,362],[512,854],[513,1335],[518,1706]];
 const guarded=(x,y)=>sites.some(([sx,sy])=>Math.abs(x-sx)<=21&&Math.abs(y-sy)<=19);
 function paint(x,y,m){x=Math.round(x);y=Math.round(y);if(x<19||x>1004||y<29||y>2034)return;const p=I(x,y);if(old[p]===3||a[p]===3||(m&&guarded(x,y)))return;a[p]=m;}
 function disk(cx,cy,r,m){for(let y=Math.floor(cy-r);y<=Math.ceil(cy+r);y++)for(let x=Math.floor(cx-r);x<=Math.ceil(cx+r);x++)if((x-cx)**2+(y-cy)**2<=r*r)paint(x,y,m)}
 function stroke(points,r,m){for(let j=1;j<points.length;j++){const [x0,y0]=points[j-1],[x1,y1]=points[j],n=Math.max(1,Math.ceil(Math.hypot(x1-x0,y1-y0)/2));for(let k=0;k<=n;k++){let t=k/n;disk(x0+(x1-x0)*t,y0+(y1-y0)*t,r,m)}}}
 function oval(cx,cy,rx,ry,tilt,phase){
 const co=Math.cos(tilt),si=Math.sin(tilt);
 for(let y=Math.max(29,Math.floor(cy-ry-rx*.3-8));y<=Math.min(2034,Math.ceil(cy+ry+rx*.3+8));y++)
 for(let x=Math.max(19,Math.floor(cx-rx-ry*.3-8));x<=Math.min(1004,Math.ceil(cx+rx+ry*.3+8));x++){
 const dx=x-cx,dy=y-cy,u=(co*dx+si*dy)/rx,v=(-si*dx+co*dy)/ry;
 const t=Math.atan2(v,u),d=Math.sqrt(u*u+v*v),edge=1+.044*Math.sin(3*t+phase)+.022*Math.sin(7*t-phase*2);
 if(d<edge*.93)paint(x,y,0);else if(d<edge*1.09)paint(x,y,38);
 }}
 // Source-derived compact membrane: remodel three dominant galleries as tall,
 // unequal interwoven fenestrations, rather than repeating punched circles.
 for(let y=36;y<=470;y++)for(let x=20;x<=428;x++)paint(x,y,x<32||x>406?38:99);
 for(const o of [[100,107,43,65,-.12,.4],[187,130,43,83,.23,1.8],[295,116,54,67,-.19,2.4],[366,177,40,67,.15,.8],[103,294,56,57,.28,1.8],[204,327,69,60,-.17,.9],[330,349,60,69,.21,2.4],[106,429,39,33,-.24,1.5],[257,436,49,34,.11,.3]])oval(...o);
 for(const o of [[61,218,14,21,.12,1],[267,245,14,24,-.22,1],[397,285,13,22,.3,1],[65,380,18,24,-.1,.1]])oval(...o);
 for(const [p,r] of [
 [[[203,222],[279,205],[352,190],[425,189],[484,190]],28],
 [[[336,345],[399,357],[455,356],[482,357]],28],
 [[[388,165],[440,158],[479,167]],27],
 [[[248,434],[321,442],[422,455],[475,458]],25],
 [[[121,268],[176,245],[206,231]],17]
 ])stroke(p,r,0);
 // Root-connected, curved biological trabeculae with primary and fine branches.
 for(const [p,r,m] of [
 [[[26,69],[56,82],[79,121],[98,153]],8,99],
 [[[23,253],[54,258],[81,281],[117,307]],8,99],
 [[[23,389],[67,390],[91,427],[121,455]],9,99],
 [[[222,35],[226,57],[247,78],[274,94]],6,99],
 [[[280,250],[304,278],[338,297],[355,320]],6,99],
 [[[132,193],[157,181],[182,163],[201,146]],5,99],
 [[[169,357],[202,367],[229,392],[244,419]],6,99],
 [[[28,139],[47,143],[61,154]],4,122],
 [[[22,333],[49,349],[68,361]],4,122]
 ])stroke(p,r,m);
 // Purposeful, rooted ladder landings. The interval between interrupted
 // steel ladder flights remains genuine EMPTY air, not fictitious climbing.
 for(const [p,r,m] of [
 [[[278,542],[332,547],[385,555],[438,560],[466,563]],13,100],
 [[[275,710],[325,725],[385,746],[439,765],[466,774]],12,100],
 [[[271,921],[330,911],[392,891],[443,880],[467,874]],13,100],
 [[[304,1039],[374,1032],[443,1026],[479,1023]],18,100],
 [[[21,1058],[140,1065],[221,1079],[316,1087]],35,100],
 [[[882,1072],[932,1073],[973,1064],[1003,1052]],31,100],
 [[[21,1096],[129,1099],[209,1108],[308,1110]],21,49],
 [[[32,1140],[151,1146],[231,1151]],29,100],
 [[[875,1132],[941,1141],[1002,1138]],26,100]
 ])stroke(p,r,m);
 // Newly extrapolated districts: assay gallery floors/backwalls plus
 // asymmetrical lookout and return portals, NOT copies of the source core.
 for(const [p,r,m] of [
 [[[21,1273],[110,1278],[204,1290],[306,1292]],17,100],
 [[[21,1447],[137,1447],[244,1458],[364,1457]],18,100],
 [[[21,1474],[153,1476],[279,1479]],23,49],
 [[[42,1668],[112,1660],[185,1654]],17,100],
 [[[21,1725],[132,1730],[232,1735],[352,1741]],18,100],
 [[[21,1763],[113,1766],[160,1774]],21,49],
 [[[1003,1435],[951,1452],[907,1466],[859,1461]],15,100],
 [[[1004,1608],[946,1605],[902,1598],[869,1595]],18,100],
 [[[1004,1635],[941,1625],[902,1617]],22,49],
 [[[1004,1747],[936,1752],[893,1761],[857,1770]],18,100],
 [[[999,1809],[944,1799],[891,1784]],22,100],
 [[[925,1582],[925,1541]],7,62],
 [[[878,1585],[925,1585]],7,62],
 [[[62,1416],[112,1416]],7,62],
 [[[92,1411],[92,1393]],4,62],
 [[[251,1420],[295,1420]],7,62],
 [[[270,1416],[270,1400]],4,62],
 [[[59,1704],[94,1704]],6,62],
 [[[166,2021],[189,1942],[234,1895],[273,1874]],24,100],
 [[[999,2017],[893,1941],[827,1886],[779,1879]],21,100],
 [[[195,1881],[234,1861],[272,1866]],8,49],
 [[[806,1857],[846,1870],[891,1894]],9,49]
 ])stroke(p,r,m);
 // Exact operational centres and full flight envelope must never be sealed:
 // retain every pre-existing reachable 31x27 centre and its *entire* hull.
 const S=W+1,pref=new Uint32Array(S*(H+1));
 for(let y=0;y<H;y++){let n=0;for(let x=0;x<W;x++){n+=(old[I(x,y)]!==0);pref[(y+1)*S+x+1]=pref[y*S+x+1]+n;}}
 function legal(x,y){if(x<15||x+15>=W||y<13||y+13>=H)return false;const x0=x-15,x1=x+16,y0=y-13,y1=y+14;return pref[y1*S+x1]-pref[y0*S+x1]-pref[y1*S+x0]+pref[y0*S+x0]===0;}
 const seen=new Uint8Array(N),q=new Int32Array(N);let first=0,last=0;
 if(!legal(512,107))throw Error("Historical spawn not free");
 q[last++]=I(512,107);seen[I(512,107)]=1;
 while(first<last){let p=q[first++],x=p%W,y=p/W|0;
 for(const [xx,yy] of [[x-1,y],[x+1,y],[x,y-1],[x,y+1]]){
 if(xx<0||xx>=W||yy<0||yy>=H)continue;let k=I(xx,yy);
 if(!seen[k]&&legal(xx,yy)){seen[k]=1;q[last++]=k;}
 }}
 // Rectangular union of the old reachable actor hulls as a 2D difference plane.
 const delta=new Int32Array(S*(H+1));
 for(let k=0;k<last;k++){let p=q[k],x=p%W,y=p/W|0;
 const x0=x-15,x1=x+16,y0=y-13,y1=y+14;
 delta[y0*S+x0]++;delta[y0*S+x1]--;delta[y1*S+x0]--;delta[y1*S+x1]++;
 }
 for(let y=0;y<H;y++){let row=0;for(let x=0;x<W;x++){
 const p=y*S+x;row+=delta[p];const coverage=row+(y?delta[p-S]:0);delta[p]=coverage;
 if(coverage>0&&old[I(x,y)]===0&&a[I(x,y)]!==0)a[I(x,y)]=0;
 }}
 // Reserved exact targets are additionally protected against any new blockage.
 for(const [sx,sy] of sites)for(let y=sy-15;y<=sy+15;y++)for(let x=sx-17;x<=sx+17;x++)
 if(x>=0&&x<W&&y>=0&&y<H&&old[I(x,y)]===0&&a[I(x,y)]!==0)a[I(x,y)]=0;
};

const R2C5Main=module.exports;
module.exports=function finishFilamentR2C5Checked(a,W,H){
 R2C5Main(a,W,H);
 // Remove all unattached pale collision ornaments without altering the rooted
 // biological skeleton. Carving only, so the travel volume cannot deteriorate.
 const T=W*960,vis=new Uint8Array(T),wave=new Int32Array(T),parts=[];
 function tissue(m){return m===38||m===99||m===122;}
 for(let seed=0;seed<T;seed++){
  if(vis[seed]||!tissue(a[seed]))continue;
  let first=0,last=1;wave[0]=seed;vis[seed]=1;const members=[];
  while(first<last){let p=wave[first++],x=p%W;members.push(p);
   for(const d of [-1,1,-W,W]){const np=p+d;if(np<0||np>=T||vis[np]||!tissue(a[np])||(d===1&&x===W-1)||(d===-1&&x===0))continue;vis[np]=1;wave[last++]=np;}
  }
  parts.push(members);
 }
 parts.sort((x,y)=>y.length-x.length);
 for(let i=1;i<parts.length;i++)for(const p of parts[i])a[p]=0;
};
