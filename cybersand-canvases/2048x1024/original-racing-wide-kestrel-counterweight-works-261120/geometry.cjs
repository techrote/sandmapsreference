'use strict';
const W=2048,H=1024,N=W*H,SEED=0x26112026;
const M={E:0,S:49,C:58,T:62,B:100,O:101,Z:113,I:117,Q:122,P:128};
const PALETTE={0:[8,12,20],49:[75,91,111],58:[134,146,160],62:[168,188,203],100:[44,55,68],101:[25,36,51],113:[223,182,103],117:[105,113,137],122:[244,231,198],128:[46,175,168]};
const SITES=[['Launch / start',145,372],['West speed aperture',335,371],['Hoist transfer 1',604,371],['Interchange upper',1001,370],['Cold bank outbound',1430,370],['East switch approach',1750,370],['East capture upper',1903,379],['East descend',1910,526],['East lower release',1895,655],['Cold bank return',1545,655],['Interchange return',1117,652],['Hoist return',754,655],['West brake',390,653],['West ascent',131,522],['Finish / west gate',156,372],['Launch controller',269,118],['Central supervision',945,119],['East dispatcher',1638,125],['West repair garage',264,914],['Interchange service bay',922,920],['Cryo service bay',1455,917],['East recovery garage',1863,916]];
const CROPS=[['overview.png',0,0,W,H],['01-launch-arch.png',0,25,445,660],['02-hoist-cradles.png',405,194,469,695],['03-interchange.png',810,177,486,757],['04-cryo-bank.png',1240,212,457,706],['05-east-reversal.png',1640,190,408,760],['06-service-bays.png',763,657,595,367]];
const POLICY=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
const MODEL_HASH='c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96';
function generate(){
 const g=new Uint8Array(N),roof=new Int16Array(W),floor=new Int16Array(W);let seed=SEED>>>0;function rand(){seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return (seed>>>0)/4294967296}
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));const bell=(x,c,r)=>Math.exp(-Math.pow((x-c)/r,2));
 function box(x,y,w,h,m,ink=false){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);for(let yy=Math.max(0,y);yy<Math.min(H,y+h);yy++)for(let xx=Math.max(0,x);xx<Math.min(W,x+w);xx++){let i=yy*W+xx;if(!ink||g[i])g[i]=m;}}
 function beam(x0,y0,x1,y1,r,m,ink=false){let dx=x1-x0,dy=y1-y0,len=dx*dx+dy*dy;for(let y=Math.max(0,Math.floor(Math.min(y0,y1)-r));y<Math.min(H,Math.ceil(Math.max(y0,y1)+r));y++)for(let x=Math.max(0,Math.floor(Math.min(x0,x1)-r));x<Math.min(W,Math.ceil(Math.max(x0,x1)+r));x++){let t=clamp(((x-x0)*dx+(y-y0)*dy)/(len||1),0,1),vx=x-x0-t*dx,vy=y-y0-t*dy;if(vx*vx+vy*vy<=r*r){let i=y*W+x;if(!ink||g[i])g[i]=m;}}}
 function oval(cx,cy,rx,ry,m){for(let y=Math.max(0,Math.floor(cy-ry));y<Math.min(H,Math.ceil(cy+ry));y++){let dx=rx*Math.sqrt(Math.max(0,1-Math.pow((y-cy)/ry,2)));box(cx-dx,y,dx*2+1,1,m);}}
 function polygon(P,m){for(let y=Math.max(0,Math.floor(Math.min(...P.map(p=>p[1]))));y<Math.min(H,Math.ceil(Math.max(...P.map(p=>p[1]))));y++){let xs=[];for(let i=0;i<P.length;i++){let a=P[i],b=P[(i+1)%P.length];if(a[1]!==b[1]&&y>=Math.min(a[1],b[1])&&y<Math.max(a[1],b[1]))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let j=0;j+1<xs.length;j+=2)box(xs[j],y,xs[j+1]-xs[j]+1,1,m);}}
 for(let x=0;x<W;x++){roof[x]=Math.round(167+10*Math.sin(x*.007)+7*Math.sin(x*.022)+30*bell(x,555,170)+43*bell(x,1025,165)+34*bell(x,1580,185));floor[x]=Math.round(833+10*Math.sin(x*.006)+6*Math.sin(x*.018)-29*bell(x,974,180));for(let y=0;y<roof[x];y++)g[y*W+x]=y>=roof[x]-15?M.T:y<27?M.S:y%127<8?M.O:M.B;for(let y=floor[x];y<H;y++)g[y*W+x]=y<floor[x]+15?M.C:y>970&&Math.floor(x/174)%3===0?M.O:M.B;}
 // Long roof galleries: each cut includes a true, hull-clear vertical mouth to open sky.
 for(let [x,y,w,h,mouth] of [[142,69,238,151,265],[850,63,233,160,940],[1578,65,213,155,1640]]){
  box(x,y,w,h,0);box(mouth-42,191,84,206,0);box(x+9,y+8,w-18,10,M.S);box(x+9,y+h-25,48,13,M.C);box(x+w-58,y+h-25,49,13,M.C);box(x+7,y+23,13,72,M.I);
 }
 // Four open, detailed garages (one extra shaft chamber extends the central installation).
 for(let [x,y,w,h,mouth] of [[115,856,291,134,267],[792,854,243,137,927],[1339,855,255,135,1459],[1741,855,235,134,1856]]){
  box(x,y,w,h,0);box(mouth-48,654,96,318,0);box(x+9,y+h-21,w-18,11,M.C);box(x+9,y+13,14,77,M.T);box(x+w-23,y+14,14,77,M.T);
 }
 // LAUNCH OPERATIONS: a true supported gantry, asymmetric accelerator jaws, recovery winches.
 beam(53,roof[53]-12,87,315,15,M.T);beam(87,315,138,299,7,M.Q);beam(406,roof[406]-12,374,310,15,M.T);beam(374,310,340,296,7,M.Z);
 beam(204,roof[204]-8,176,276,11,M.I);beam(176,276,246,273,8,M.T);beam(246,273,288,315,8,M.I);
 for(let i=0;i<4;i++){let x=163+49*i;box(x,108,15,65-i%2*12,M.T);box(x+6,119,6,38,M.Q,true);}box(162,186,174,11,M.Z);
 box(158,942,39,12,M.I);box(173,919,12,24,M.T);box(200,930,45,12,M.I);box(269,915,23,39,M.T);box(293,927,51,13,M.Z);
 beam(42,floor[42]+3,65,745,14,M.T);beam(65,745,112,761,8,M.Z);
 // WEST gate has a single pale ascending motif, materially on grounded upper arch.
 beam(55,roof[55]-9,72,326,9,M.T);beam(72,326,120,306,9,M.Q);
 // CABLE HOISTS: three different suspensions with visible nonidentical load shoes; lower winch drum grounded.
 for(let [x,dx,tip,r] of [[482,47,301,13],[618,-26,317,12],[764,56,308,11]]){beam(x,roof[x]-12,x+dx,tip,r,M.T);beam(x+dx,tip,x+dx+(dx>0?29:-25),tip-16,6,M.Z);beam(x,roof[x]-12,x+dx,tip-13,4,M.Q,true);}
 oval(586,807,105,81,M.T);oval(586,807,84,62,0);oval(586,807,68,49,M.I);oval(586,807,44,32,0);
 box(485,801,202,29,M.C,true);box(495,828,183,23,M.C);beam(479,floor[479]+8,503,752,13,M.T);beam(687,floor[687]+8,685,747,13,M.T);
 box(550,790,14,39,M.Z,true);box(629,793,11,37,M.Z,true);for(let j=0;j<6;j++){let x=514+j*30;box(x,841,16,7,j%2?M.Z:M.Q,true);}
 box(820,952,186,12,M.C);box(831,917,23,35,M.T);box(855,922,54,13,M.I);box(931,906,18,47,M.T);box(951,924,48,13,M.Z);
 // INTERCHANGE: twin opposing side-on supported lattice gantries, deliberate clear central service lumen.
 beam(845,roof[845]-8,901,306,16,M.T);beam(901,306,954,290,9,M.Q);beam(1199,roof[1199]-8,1120,305,16,M.T);beam(1120,305,1080,290,9,M.Z);
 beam(867,floor[867]+5,918,732,18,M.C);beam(918,732,969,758,11,M.I);beam(1218,floor[1218]+5,1165,725,19,M.C);beam(1165,725,1118,752,11,M.I);
 beam(900,floor[900]+9,948,775,6,M.Z,true);beam(1184,floor[1184]+5,1149,774,7,M.Q,true);
 box(1024,213,28,86,M.I);box(1045,249,50,12,M.Z);box(1008,778,36,38,M.T);box(1067,770,36,44,M.C);box(1115,788,22,26,M.Z);
 for(let j=0;j<5;j++){let x=952+j*37;box(x,804,18,10,j%2?M.Q:M.Z,true);}
 for(let j=0;j<3;j++){let x=842+j*51;box(x,929,18,26,M.T);box(x+17,932,27,11,M.I);box(x+7,920,6,12,M.Q,true);}
 // CRYOGENIC BALLAST: roof-rooted asymmetrical header pipes; each stage distinct floor-backed pressure tower.
 for(let [x,dx,t] of [[1274,-34,302],[1392,45,318],[1510,-29,295],[1610,39,303]]){beam(x,roof[x]-9,x+dx,t,12,M.T);beam(x+dx,t,x+dx+Math.sign(dx)*25,t-17,6,M.Q);}
 for(let [x,w,h] of [[1260,74,110],[1392,90,133],[1538,61,100]]){let y=floor[x];polygon([[x,y+13],[x+8,y-h+16],[x+22,y-h],[x+w-20,y-h-13],[x+w-8,y-h+13],[x+w,y+13]],M.T);box(x+15,y-h+24,w-30,14,M.I,true);box(x+20,y-h+45,w-39,8,M.Z,true);}
 beam(1332,floor[1332],1370,748,7,M.I);beam(1474,floor[1474],1518,741,7,M.I);
 for(let j=0;j<4;j++){let x=1366+j*53;box(x,948,37,11,M.T);box(x+6,919-(j%2)*9,15,29,M.I);box(x+15,909-(j%2)*9,8,10,M.Q,true);}
 // EJECTOR: permanent full-body direction gates are mismatched upper/lower jaws, no invisible checkpoint collisions.
 beam(1722,roof[1722]-8,1778,319,15,M.T);beam(1778,319,1818,301,8,M.Z);beam(2013,roof[2013]-8,1950,325,16,M.T);beam(1950,325,1903,307,8,M.Q);
 beam(1720,floor[1720]+6,1760,731,16,M.T);beam(1760,731,1799,747,8,M.Z);beam(2013,floor[2013]+7,1972,716,17,M.C);beam(1972,716,1930,733,9,M.Z);
 box(1747,931,53,12,M.I);box(1762,905,13,26,M.T);box(1817,935,63,11,M.I);box(1878,909,22,43,M.T);beam(1890,937,1946,919,9,M.Z);
 // Machine-service entrances are actual 31x27-clear cuts, not teleporting named sites.
 box(982,660,79,228,0); // Interchange inspection hoist, accessible from lower racing corridor.
 box(1417,673,85,213,0); // Ballast filter walk-through. Keep outer filter pedestals.
 // Three inhabited control galleries: tables, instrument buses, switchgear and roof-rooted stands.
 for(let [x,y,w,h] of [[142,69,238,151],[850,63,233,160],[1578,65,213,155]]){
  box(x+27,y+18,w-55,8,M.I,true);
  box(x+28,y+h-44,47,19,M.T);box(x+33,y+h-38,24,8,M.Z,true);
  box(x+w-98,y+h-50,67,22,M.I);box(x+w-89,y+h-43,29,7,M.Q,true);
  box(x+w-43,y+h-70,10,24,M.T);box(x+87,y+h-30,47,8,M.Z,true);
  beam(x+77,y+h-27,x+96,y+h-57,5,M.I);
 }
 // Ground-floor workshops are not vacant excavation trays. Distinct hard machinery, tied to foundation.
 for(let [x,y,w,h] of [[115,856,291,134],[792,854,243,137],[1339,855,255,135],[1741,855,235,134]]){
  let base=y+h-21;
  box(x+24,base-38,47,38,M.T);box(x+34,base-48,25,11,M.I);
  box(x+82,base-17,44,17,M.I);box(x+93,base-31,16,14,M.Z);
  box(x+w-91,base-55,19,55,M.T);box(x+w-70,base-24,39,24,M.I);
  box(x+w-65,base-17,27,8,M.Q,true);
  box(x+24,base-3,w-47,6,M.Z,true);
 }
 // Physically differentiated side-on workfaces in the wide hoist hall (away from flight centres).
 box(501,276,65,24,M.I);box(503,280,38,7,M.Z,true);box(581,298,53,16,M.T);
 box(723,281,81,22,M.I);box(729,286,42,7,M.Q,true);
 box(1290,270,43,18,M.T);box(1377,286,58,17,M.I);box(1565,270,57,23,M.T);
 // True boundary-tied shop foundations: no removable disconnected painted furniture.
 for(let [x,y,w,h] of [[115,856,291,134],[792,854,243,137],[1339,855,255,135],[1741,855,235,134]]){
  box(x-12,y+h-21,w+24,15,M.C);
  box(x-12,y+h-70,26,56,M.T);box(x+w-14,y+h-69,26,55,M.T);
  box(x+18,y+h-65,48,8,M.I);box(x+w-72,y+h-63,53,8,M.I);
 }
 // Roof-attached operator consoles: paired edge balconies leave the 84px entry shafts open.
 for(let [x,y,w,h] of [[142,69,238,151],[850,63,233,160],[1578,65,213,155]]){
  box(x-14,y+h-65,78,12,M.T);box(x+w-66,y+h-63,81,12,M.T);
  box(x+11,y+h-84,29,20,M.I);box(x+17,y+h-79,13,7,M.Q,true);
  box(x+w-48,y+h-90,26,28,M.I);box(x+w-45,y+h-83,17,8,M.Z,true);
 }
 // Gate colour is applied exclusively to rooted entrance skins, not free floating solid glyphs.
 beam(1778,319,1818,301,5,M.Q,true);beam(1972,716,1930,733,6,M.Z,true);
 // Mandatory full-hull access corridors, bored *after* equipment fitting; no target waivers.
 for(let mouth of [265,940,1640])box(mouth-39,138,78,267,0);
 box(967,651,91,265,0);box(898,855,133,49,0);box(891,880,76,71,0);
 box(1413,668,91,242,0);
 box(1818,853,87,87,0);
 // Real source materials only; low-noise index bands on already collidable roof/floor skin.
 for(let x=53;x<2025;x+=57)box(x,roof[x]-8,23,7,x<445?M.Q:x<835?M.Z:x<1210?M.S:x<1660?M.Z:M.Q,true);
 for(let x=81;x<2013;x+=61)box(x,floor[x]+3,26,8,x<450?M.Z:x<820?M.S:x<1250?M.Q:x<1680?M.S:M.Z,true);
 // Mark deterministic calibration plates; no disconnected decorative particles: plates are painted on existing foundations.
 for(let i=0;i<13;i++){let x=170+(rand()*1680)|0;box(x,floor[x]+7,13,6,i%3?M.Z:M.Q,true);}
 // Independent 4-way boundary grounding: discard any truly detached collidable assembly before qualification.
 let seen=new Uint8Array(N),queue=new Int32Array(N),head=0,tail=0;function push(i){if(g[i]&&!seen[i]){seen[i]=1;queue[tail++]=i;}}for(let x=0;x<W;x++){push(x);push((H-1)*W+x);}for(let y=0;y<H;y++){push(y*W);push(y*W+W-1);}while(head<tail){let i=queue[head++],x=i%W,y=(i-x)/W;if(x)push(i-1);if(x<W-1)push(i+1);if(y)push(i-W);if(y<H-1)push(i+W);}let discarded=0;for(let i=0;i<N;i++)if(g[i]&&!seen[i]){g[i]=0;discarded++;}
 return {g,grounded:tail,discarded};
}
function freeMask(g,w,h){let s=new Uint32Array((W+1)*(H+1)),stride=W+1;for(let y=1;y<=H;y++){let c=0,at=y*stride,p=(y-1)*stride;for(let x=1;x<=W;x++){c+=g[(y-1)*W+x-1]!==0?1:0;s[at+x]=c+s[p+x];}}let ok=new Uint8Array(g.length),l=w>>1,r=w-l-1,t=h>>1,b=h-t-1;for(let y=t;y<H-b;y++){let a=(y-t)*stride,z=(y+b+1)*stride;for(let x=l;x<W-r;x++){let xa=x-l,xb=x+r+1;if(s[z+xb]-s[a+xb]-s[z+xa]+s[a+xa]===0)ok[y*W+x]=1;}}return ok;}
function reach(g,w,h){let ok=freeMask(g,w,h),seen=new Uint8Array(g.length),q=new Int32Array(g.length),s=SITES[0][2]*W+SITES[0][1];if(!ok[s])throw Error('BLOCKED SPAWN '+w+'x'+h);let a=0,b=1;q[0]=s;seen[s]=1;while(a<b){let i=q[a++],x=i%W,y=(i-x)/W;for(let j of [x?i-1:-1,x<W-1?i+1:-1,y?i-W:-1,y<H-1?i+W:-1])if(j>=0&&ok[j]&&!seen[j]){seen[j]=1;q[b++]=j;}}return {connected:b,missing:SITES.filter(p=>!seen[p[2]*W+p[1]]).map(p=>p[0])};}
function encodeRects(g){let edits=[],active=new Map(),visits=0;for(let y=0;y<H;y++){let next=new Map(),o=y*W;for(let x=0;x<W;){let m=g[o+x],s=x;while(x<W&&g[o+x]===m)x++;if(!m)continue;let k=s+':'+(x-s)+':'+m,r=active.get(k);if(r)r[3]++;else{r=[s,y,x-s,1,m];edits.push(r);}next.set(k,r);visits+=x-s;}active=next;}return {edits,visits};}
module.exports={generate,freeMask,reach,encodeRects,SITES,CROPS,PALETTE,M,POLICY,MODEL_HASH,W,H,N,SEED};
