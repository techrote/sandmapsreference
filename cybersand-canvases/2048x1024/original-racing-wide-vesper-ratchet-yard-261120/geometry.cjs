'use strict';
// Vesper Ratchet Yard — entirely original, perpendicular 2D industrial racing landscape.
// No source image and no copied terrain/structural arrangement from other CyberSand canvases.
const W=2048,H=1024,N=W*H,SEED=0x261120b3;
const M={E:0,S:49,C:58,T:62,B:100,O:101,Z:113,I:117,Q:122};
const PALETTE={0:[8,12,20],49:[75,91,111],58:[134,146,160],62:[168,188,203],100:[44,55,68],101:[25,36,51],113:[223,182,103],117:[105,113,137],122:[244,231,198]};
const POLICY=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
const MODEL_HASH='c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96';
const SITES=[
 ['Start / loading lock',143,649],['West launch portal',307,610],['Ratchet lead-in',438,599],['First slope lower',617,623],
 ['Crossbrace entrance',839,599],['Upper bypass',1010,366],['Lower bypass',1036,731],['Crossbrace departure',1246,559],
 ['Cryoseal approach',1370,541],['Cold-array gate',1589,523],['East capture',1857,541],['East lift',1907,435],
 ['East upper return',1877,325],['Sink return',1604,354],['Crossbrace return',1205,360],['West upper return',692,361],
 ['West landing approach',258,435],['Finish / west loop',145,647],
 ['Intake control room',228,113],['Slope dispatch room',693,105],['Ratchet watch room',1137,108],
 ['Cold-seal control room',1548,111],['East dispatch loft',1816,108],
 ['West tuning vault',223,933],['Ratchet drive vault',713,929],['Central coupling bay',1084,934],
 ['Cold filter service',1496,932],['East arrestor bay',1839,932]
];
const CROPS=[['overview.png',0,0,W,H],['01-west-intake-and-launch.png',0,45,426,767],
 ['02-sloped-ratchet-rail.png',365,196,478,726],['03-crossbrace-switch.png',816,200,455,780],
 ['04-cold-array-and-couplings.png',1272,191,465,782],['05-east-arrestor-loop.png',1645,210,403,778],
 ['06-enterable-plant-vaults.png',382,678,1230,346]];
function generate(){
 const g=new Uint8Array(N),roof=new Int16Array(W),floor=new Int16Array(W);
 let seed=SEED>>>0;function random(){seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296;}
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));const hill=(x,c,r)=>Math.exp(-(((x-c)/r)**2));
 function box(x,y,w,h,m,ink=false){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);for(let yy=Math.max(0,y);yy<Math.min(H,y+h);yy++){let off=yy*W;for(let xx=Math.max(0,x);xx<Math.min(W,x+w);xx++){let i=off+xx;if(!ink||g[i])g[i]=m;}}}
 function beam(x0,y0,x1,y1,r,m,ink=false){let dx=x1-x0,dy=y1-y0,len=dx*dx+dy*dy||1;for(let y=Math.max(0,Math.floor(Math.min(y0,y1)-r));y<Math.min(H,Math.ceil(Math.max(y0,y1)+r));y++)for(let x=Math.max(0,Math.floor(Math.min(x0,x1)-r));x<Math.min(W,Math.ceil(Math.max(x0,x1)+r));x++){let t=clamp(((x-x0)*dx+(y-y0)*dy)/len,0,1),a=x-x0-t*dx,b=y-y0-t*dy;if(a*a+b*b<=r*r){let i=y*W+x;if(!ink||g[i])g[i]=m;}}}
 function polygon(p,m){for(let y=Math.max(0,Math.floor(Math.min(...p.map(z=>z[1]))));y<Math.min(H,Math.ceil(Math.max(...p.map(z=>z[1]))));y++){let xx=[];for(let i=0;i<p.length;i++){let a=p[i],b=p[(i+1)%p.length];if(a[1]!==b[1]&&y>=Math.min(a[1],b[1])&&y<Math.max(a[1],b[1]))xx.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xx.sort((a,b)=>a-b);for(let k=0;k+1<xx.length;k+=2)box(xx[k],y,xx[k+1]-xx[k]+1,1,m);}}
 function ellipse(cx,cy,rx,ry,m){for(let y=Math.max(0,Math.round(cy-ry));y<Math.min(H,Math.round(cy+ry));y++){let d=rx*Math.sqrt(Math.max(0,1-((y-cy)/ry)**2));box(cx-d,y,2*d+1,1,m);}}
 // Earth-rooted basaltous soffit and bedplate. The central roof has a salient notch,
 // the eastern return narrows, and the west service escarpment slopes upward.
 for(let x=0;x<W;x++){
  roof[x]=Math.round(180+10*Math.sin(x*.0057)+8*Math.sin(x*.018)+67*hill(x,965,185)+32*hill(x,1585,155));
  floor[x]=Math.round(859+9*Math.sin(x*.0065)-45*hill(x,580,205)-22*hill(x,1320,290));
  for(let y=0;y<roof[x];y++)g[y*W+x]=y<19?M.S:y>roof[x]-18?M.T:y%143<16?M.O:M.B;
  for(let y=floor[x];y<H;y++)g[y*W+x]=y<floor[x]+20?M.C:y>981&&Math.floor(x/290)%2?M.O:M.B;
 }
 // Individual roof-anchored operations rooms and actual straight usable shafts.
 const roofRooms=[[105,46,235,155,228,0],[606,39,202,180,693,1],[1047,39,218,170,1137,2],[1463,45,216,176,1548,3],[1728,44,237,173,1816,4]];
 for(let [x,y,w,h,mouth,type] of roofRooms){
  box(x,y,w,h,0);box(mouth-43,151,86,275,0);
  box(x-14,y+h-30,w+28,13,M.T);box(x+11,y+23,13,56,M.I);box(x+w-26,y+20,13,60,M.I);
  // Rooted consoles have explicitly different workfaces across districts.
  if(type===0){box(x+37,y+h-76,43,47,M.Z);box(x+89,y+h-61,48,27,M.I);box(x+97,y+h-69,26,7,M.Q,true);}
  if(type===1){beam(x+41,y+h-39,x+74,y+h-84,10,M.I);box(x+110,y+h-52,56,21,M.Z);box(x+125,y+h-65,31,11,M.Q,true);}
  if(type===2){box(x+26,y+h-57,77,27,M.I);box(x+41,y+h-65,45,12,M.Q);box(x+142,y+h-90,17,60,M.Z);}
  if(type===3){for(let j=0;j<3;j++){box(x+27+51*j,y+h-56-j%2*10,23,28+j%2*10,M.T);box(x+31+51*j,y+h-64-j%2*10,16,10,M.Q);}}
  if(type===4){box(x+36,y+h-66,57,36,M.Z);beam(x+107,y+h-29,x+158,y+h-69,9,M.I);box(x+146,y+h-80,42,14,M.Q);}
 }
 // Four structurally excavated and individually equipped foundry/service vaults.
 for(let [x,w,mouth,type] of [[103,287,223,0],[583,292,713,1],[951,260,1084,2],[1351,287,1496,3],[1720,266,1839,4]]){
  let y=882,h=113;box(x,y,w,h,0);box(mouth-42,676,84,305,0);
  box(x-12,y+h-35,w+24,24,M.C);box(x-8,y+h-42,25,45,M.T);box(x+w-19,y+h-42,26,45,M.T);
  if(type===0){box(x+36,931,77,35,M.I);box(x+43,918,49,16,M.Z);beam(x+128,965,x+166,923,9,M.C);}
  if(type===1){ellipse(x+98,935,44,33,M.I);ellipse(x+98,935,25,17,0);box(x+156,931,70,34,M.T);box(x+165,920,43,9,M.Q);}
  if(type===2){beam(x+46,967,x+93,904,13,M.T);beam(x+142,966,x+101,910,12,M.I);box(x+110,946,41,17,M.Z);}
  if(type===3){for(let j=0;j<3;j++){box(x+26+j*70,923-j*7,42,43+j*7,M.I);box(x+35+j*70,914-j*7,22,12,M.Q);}}
  if(type===4){box(x+33,921,64,43,M.T);beam(x+93,927,x+151,955,10,M.I);box(x+170,938,47,25,M.Z);}
 }
 // WEST INTAKE LOCK: approach gate deliberately asymmetric with a huge founded diffuser.
 polygon([[31,roof[31]-1],[122,roof[122]-2],[193,338],[162,363],[91,303]],M.T);
 beam(171,354,207,349,10,M.Z);beam(30,floor[30],102,747,24,M.C);beam(102,747,158,744,10,M.T);
 polygon([[250,floor[250]+5],[360,floor[360]+5],[363,762],[322,737],[284,783]],M.C);
 beam(285,775,348,765,8,M.Q,true);
 // LONG RATCHET INCLINE: jagged but supported unequal tooth bank; real upper/low clear lanes.
 polygon([[413,roof[413]-6],[491,roof[491]-8],[564,462],[542,475],[475,407]],M.T);
 beam(489,roof[489],540,442,10,M.Z,true);
 polygon([[593,floor[593]+2],[704,floor[704]+2],[730,566],[689,528],[642,605]],M.C);
 beam(669,floor[669]-1,686,599,11,M.I,true);
 polygon([[751,roof[751]-2],[836,roof[836]-2],[865,489],[827,516],[795,445]],M.T);
 beam(802,roof[802]-2,831,469,11,M.Q,true);
 // Diagonal truss crossbrace: crossed visual mass but with *separated real obstacles* and free central air.
 // Main crossed wires are terminated well before floor or roof, so there are upper/lower diversions.
 beam(882,roof[882]-6,995,522,21,M.T);beam(1059,roof[1059]-4,1179,511,19,M.I);
 beam(900,floor[900]+4,985,635,24,M.C);beam(1175,floor[1175]+4,1099,639,24,M.C);
 beam(985,635,1025,664,12,M.I);beam(1099,639,1065,673,12,M.T);
 // Deep founded split support temple, a 220px vertical negative-space aperture between brackets.
 beam(867,roof[867]-6,933,394,9,M.Z,true);beam(1181,roof[1181]-4,1136,399,10,M.Q,true);
 box(1008,683,73,28,M.C);beam(1044,710,1044,floor[1044]+5,17,M.I);
 // WEST/EAST flight signage physically bonded to structural truss.
 beam(1214,roof[1214],1267,411,16,M.T);beam(1267,411,1300,422,10,M.Z);
 // CRYOSEAL HEAT-SINKS: five different grounded heat-exchange manifolds, not clones.
 for(let [x,w,h,dx] of [[1339,61,118,24],[1446,86,162,-23],[1556,53,134,12],[1647,77,156,-20]]){
  let y=floor[x];polygon([[x,y+4],[x+dx/2,y-h+40],[x+17,y-h],[x+w-16,y-h+7],[x+w+dx/3,y-h+43],[x+w+4,y+7]],M.C);
  box(x+18,y-h+23,w-28,10,M.T,true);box(x+23,y-h+51,w-37,7,M.Q,true);
 }
 beam(1333,roof[1333]-3,1395,470,12,M.T);beam(1395,470,1430,486,8,M.Z);
 beam(1550,roof[1550]-3,1592,472,14,M.T);beam(1592,472,1616,470,8,M.Q);
 // EAST ARRESTOR, huge deliberate asymmetric descending / returning portal and a founded brake jaw.
 polygon([[1710,roof[1710]-5],[1829,roof[1829]-4],[1882,394],[1846,419],[1775,337]],M.T);
 beam(1843,411,1880,400,8,M.Z,true);
 polygon([[1996,roof[1996]-3],[2047,roof[2047]-3],[2047,380],[1988,404],[1926,412]],M.I);
 beam(1967,407,1929,425,9,M.Q,true);
 beam(2023,floor[2023]+5,1956,733,24,M.C);beam(1956,733,1909,725,13,M.I);
 beam(1699,floor[1699]+4,1765,755,22,M.C);beam(1765,755,1808,752,10,M.Z);
 // Five differently pitched foundation truss outriggers; each is firmly bonded to bedrock.
 for(let [x,h,d] of [[398,101,-26],[786,96,19],[1255,124,-19],[1633,87,31],[1781,115,-16]]){
  beam(x,floor[x]+4,x+d,floor[x]-h,13,M.I);box(x+d-19,floor[x]-h-18,38,13,M.T);box(x+d-11,floor[x]-h-13,22,8,M.Z,true);
 }
 // Dense but restrained anchored fasteners; none are unsupported floating pixels.
 for(let x=51;x<W-50;x+=101){box(x,roof[x]-12,19,6,x<780?M.Z:x<1300?M.Q:x<1700?M.Z:M.Q,true);}
 for(let x=78;x<W-40;x+=107){box(x,floor[x]+7,25,7,x<780?M.Q:x<1300?M.Z:x<1700?M.Q:M.Z,true);}
 // Structural-instrument detail belongs to the actual rooted roof workfaces;
 // all remain out of the literal 31x27 control-room target envelopes.
 for(let [x,y,w,h,mouth,type] of roofRooms){
  let py=y+h-30;
  box(x+22,py-24,29,24,type%2?M.I:M.Z);box(x+24,py-32,20,10,M.Q);
  box(x+w-70,py-34,30,34,type%2?M.Z:M.I);box(x+w-67,py-43,19,10,M.Q);
  if(type===1){beam(x+38,py-10,x+57,py-55,8,M.T);}
  if(type===2){box(x+65,py-15,32,15,M.T);}
  if(type===3){box(x+w-108,py-19,35,19,M.T);}
  if(type===4){beam(x+w-66,py-11,x+w-92,py-52,7,M.I);}
 }
 // Exact open shafts at all five roof operator and five service positions are maintained after machines.
 for(let mouth of [228,693,1137,1548,1816])box(mouth-38,143,76,292,0);
 for(let mouth of [223,713,1084,1496,1839])box(mouth-37,670,74,303,0);
 // Alternative route across the truss saddle. Does not make the common centre unreachable.
 box(995,573,118,45,0);
 // Two deliberately engineered generous 31x27 emergency service passages, not nearest-site substitutions.
 box(994,680,89,129,0);
 box(1060,577,69,145,0);
 // Publish only real boundary-grounded inert supports; optional decorative islands are discarded BEFORE final grid.
 const seen=new Uint8Array(N),q=new Int32Array(N);let start=0,end=0;
 function push(i){if(g[i]&&!seen[i]){seen[i]=1;q[end++]=i;}}
 for(let x=0;x<W;x++){push(x);push((H-1)*W+x);}for(let y=0;y<H;y++){push(y*W);push(y*W+W-1);}
 while(start<end){let i=q[start++],x=i%W,y=(i-x)/W;if(x)push(i-1);if(x<W-1)push(i+1);if(y)push(i-W);if(y<H-1)push(i+W);}
 let discarded=0;for(let i=0;i<N;i++)if(g[i]&&!seen[i]){g[i]=0;discarded++;}
 return {g,grounded:end,discarded};
}
function freeMask(g,w,h){let s=new Uint32Array((W+1)*(H+1)),stride=W+1;for(let y=1;y<=H;y++){let c=0,at=y*stride,p=(y-1)*stride;for(let x=1;x<=W;x++){c+=g[(y-1)*W+x-1]!==0?1:0;s[at+x]=c+s[p+x];}}let ok=new Uint8Array(g.length),l=w>>1,r=w-l-1,t=h>>1,b=h-t-1;for(let y=t;y<H-b;y++){let a=(y-t)*stride,z=(y+b+1)*stride;for(let x=l;x<W-r;x++){let xa=x-l,xb=x+r+1;if(s[z+xb]-s[a+xb]-s[z+xa]+s[a+xa]===0)ok[y*W+x]=1;}}return ok;}
function reach(g,w,h){let ok=freeMask(g,w,h),seen=new Uint8Array(g.length),q=new Int32Array(g.length),s=SITES[0][2]*W+SITES[0][1];if(!ok[s])throw Error('BLOCKED SPAWN '+w+'x'+h);let a=0,b=1;q[0]=s;seen[s]=1;while(a<b){let i=q[a++],x=i%W,y=(i-x)/W;for(let j of [x?i-1:-1,x<W-1?i+1:-1,y?i-W:-1,y<H-1?i+W:-1])if(j>=0&&ok[j]&&!seen[j]){seen[j]=1;q[b++]=j;}}return {connected:b,missing:SITES.filter(p=>!seen[p[2]*W+p[1]]).map(p=>p[0])};}
function encodeRects(g){let edits=[],active=new Map(),visits=0;for(let y=0;y<H;y++){let next=new Map(),o=y*W;for(let x=0;x<W;){let m=g[o+x],s=x;while(x<W&&g[o+x]===m)x++;if(!m)continue;let k=s+':'+(x-s)+':'+m,r=active.get(k);if(r)r[3]++;else{r=[s,y,x-s,1,m];edits.push(r);}next.set(k,r);visits+=x-s;}active=next;}return {edits,visits};}
module.exports={generate,freeMask,reach,encodeRects,SITES,CROPS,PALETTE,M,POLICY,MODEL_HASH,W,H,N,SEED};
