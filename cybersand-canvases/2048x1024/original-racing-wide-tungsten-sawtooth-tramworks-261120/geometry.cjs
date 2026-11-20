'use strict';
// Tungsten Sawtooth Tramworks: original perpendicular 2D 2048x1024 racing world.
// New authoring geometry, not based on a previous map's geometry or reference art.
const W=2048,H=1024,N=W*H,SEED=0x261120f7;
const M={E:0,S:49,C:58,T:62,B:100,O:101,Z:113,I:117,Q:122};
const PALETTE={0:[8,12,20],49:[75,91,111],58:[134,146,160],62:[168,188,203],100:[44,55,68],101:[25,36,51],113:[223,182,103],117:[105,113,137],122:[244,231,198]};
const SITES=[
['Start / ignition',140,444],['West injector gate',319,438],['Sawtooth climb 1',440,374],
['Shear bridge crest',674,324],['Shear descent',800,537],['Rotor top bypass',1005,324],
['Rotor bottom bypass',1053,702],['Rotor exit',1238,533],['Salt screen approach',1365,402],
['Condenser gate',1603,449],['East capture inlet',1900,458],['East descent',1901,596],
['East lower loop',1900,712],['Condenser return',1556,714],['Rotor return',1120,751],
['Shear westbound return',584,727],['West recovery',191,662],['Finish / west rejoin',157,446],
['Injector control',226,101],['Shear control',712,108],['Rotor watch',1250,102],
['East dispatcher',1808,101],['West machine shop',257,940],['Sawtooth substation',738,924],
['Rotor bearing shop',1085,937],['Salt service bay',1460,931],['East recovery garage',1855,934]
];
const CROPS=[['overview.png',0,0,W,H],['01-impulse-injector.png',0,12,440,703],
['02-sawtooth-capacitors.png',388,207,470,735],['03-rotor-interlock.png',823,151,511,799],
['04-crystal-screen.png',1270,185,436,764],['05-reversal-catcher.png',1620,169,428,788],
['06-machinery-underworks.png',560,675,932,349]];
const POLICY=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
const MODEL_HASH='c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96';
function generate(){
 const g=new Uint8Array(N),roof=new Int16Array(W),floor=new Int16Array(W);
 let seed=SEED>>>0;const rand=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296};
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function box(x,y,w,h,m,ink=false){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);for(let yy=Math.max(y,0);yy<Math.min(H,y+h);yy++)for(let xx=Math.max(x,0);xx<Math.min(W,x+w);xx++){let i=yy*W+xx;if(!ink||g[i])g[i]=m;}}
 function beam(x0,y0,x1,y1,r,m,ink=false){const dx=x1-x0,dy=y1-y0,len=dx*dx+dy*dy;for(let y=Math.max(0,Math.floor(Math.min(y0,y1)-r));y<Math.min(H,Math.ceil(Math.max(y0,y1)+r));y++)for(let x=Math.max(0,Math.floor(Math.min(x0,x1)-r));x<Math.min(W,Math.ceil(Math.max(x0,x1)+r));x++){let t=clamp(((x-x0)*dx+(y-y0)*dy)/(len||1),0,1),vx=x-x0-t*dx,vy=y-y0-t*dy;if(vx*vx+vy*vy<=r*r){let i=y*W+x;if(!ink||g[i])g[i]=m;}}}
 function oval(cx,cy,rx,ry,m){for(let y=Math.max(0,Math.floor(cy-ry));y<Math.min(H,Math.ceil(cy+ry));y++){let dx=rx*Math.sqrt(Math.max(0,1-((y-cy)/ry)**2));box(cx-dx,y,dx*2+1,1,m);}}
 function polygon(P,m){for(let y=Math.max(0,Math.floor(Math.min(...P.map(p=>p[1]))));y<Math.min(H,Math.ceil(Math.max(...P.map(p=>p[1]))));y++){let xs=[];for(let i=0;i<P.length;i++){let a=P[i],b=P[(i+1)%P.length];if(a[1]!==b[1]&&y>=Math.min(a[1],b[1])&&y<Math.max(a[1],b[1]))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let j=0;j+1<xs.length;j+=2)box(xs[j],y,xs[j+1]-xs[j]+1,1,m);}}
 const bell=(x,c,r)=>Math.exp(-(((x-c)/r)**2));
 // Deep roof rock and dry, massive floor bedplate, not floating facades.
 for(let x=0;x<W;x++){
  roof[x]=Math.round(188+11*Math.sin(x*.009)+6*Math.sin(x*.027)+34*bell(x,550,155)+26*bell(x,1020,190)+36*bell(x,1510,160));
  floor[x]=Math.round(863+7*Math.sin(x*.009)+5*Math.sin(x*.021)-42*bell(x,585,175)-21*bell(x,1120,235));
  for(let y=0;y<roof[x];y++)g[y*W+x]=y<22?M.S:y>roof[x]-16?M.T:y%137<11?M.O:M.B;
  for(let y=floor[x];y<H;y++)g[y*W+x]=y<floor[x]+16?M.C:y>974&&Math.floor(x/213)%2===1?M.O:M.B;
 }
 // Roof-rooted four enterable control nests with generous full-hull access shafts.
 for(let [x,y,w,h,mouth] of [[115,49,236,154,226],[625,50,208,173,712],[1150,47,219,179,1250],[1720,49,225,165,1808]]){
  box(x,y,w,h,0);box(mouth-46,164,92,252,0);box(x+16,y+28,15,61,M.I);box(x+w-35,y+28,14,52,M.T);
  box(x+18,y+h-28,47,12,M.C);box(x+w-73,y+h-28,53,12,M.C);
  box(x+24,y+h-60,40,28,M.T);box(x+30,y+h-52,22,9,M.Z,true);
  box(x+w-105,y+h-55,65,27,M.I);box(x+w-98,y+h-46,30,8,M.Q,true);
  box(x+23,y+18,w-47,7,M.Z,true);
 }
 // Genuine mechanical underworks: independent service bays, spacious entry shafts and founded platforms.
 for(let [x,w,mouth,type] of [[106,315,258,0],[612,274,738,1],[958,249,1086,2],[1327,260,1460,3],[1748,232,1853,4]]){
  let y=881,h=113;box(x,y,w,h,0);box(mouth-48,663,96,310,0);
  box(x+7,y+h-27,w-14,14,M.C);box(x-8,y+h-39,24,40,M.T);box(x+w-17,y+h-40,24,41,M.T);
  if(type===0){box(x+33,930,62,36,M.I);box(x+39,915,33,15,M.Z);beam(x+96,957,x+148,911,8,M.T);box(x+w-81,934,54,24,M.I);}
  if(type===1){oval(x+87,930,47,41,M.T);oval(x+87,930,29,25,0);box(x+159,936,74,28,M.I);box(x+179,910,20,27,M.Z);}
  if(type===2){box(x+27,911,40,53,M.T);beam(x+64,923,x+126,947,9,M.I);box(x+119,936,56,28,M.Z);}
  if(type===3){for(let j=0;j<3;j++){let xx=x+32+j*61;box(xx,923-j%2*7,34,44+j%2*7,M.T);box(xx+7,913-j%2*7,13,14,M.Q,true);}}
  if(type===4){beam(x+38,956,x+98,903,12,M.T);box(x+105,933,56,32,M.I);box(x+w-52,914,25,51,M.Z);}
 }
 // WEST INJECTOR: founded magnetic approach mandibles with a paired high/low brake indicator.
 polygon([[21,roof[21]-5],[108,roof[108]-5],[187,309],[134,342],[81,327]],M.T);
 box(115,308,76,12,M.Z,true);beam(347,roof[347]-5,313,334,17,M.T);
 beam(313,334,260,347,8,M.Q);beam(55,floor[55]+4,91,738,17,M.T);
 beam(91,738,154,746,9,M.Z);beam(338,floor[338]+4,316,737,16,M.C);
 // SAWTOOTH CAPACITOR: deliberately alternating roof/floor grounded baffles.
 polygon([[418,roof[418]-1],[473,roof[473]-1],[548,493],[519,506],[476,449]],M.T);
 beam(473,roof[473],506,469,9,M.Z,true);
 polygon([[593,floor[593]+3],[670,floor[670]+3],[692,507],[655,476],[617,535]],M.C);
 beam(628,floor[628],649,551,11,M.I,true);
 polygon([[749,roof[749]-4],[823,roof[823]-4],[862,481],[830,508],[789,417]],M.T);
 beam(813,roof[813],834,460,8,M.Q,true);
 // Counterpart independent support ladders on solid bedrock and workface instead of visual stamps.
 for(let [x,h] of [[403,91],[719,117],[843,104]]){
  box(x,floor[x]-h,25,h+13,M.I);box(x+5,floor[x]-h-16,15,18,M.Z);box(x+3,floor[x]-h+20,19,7,M.Q,true);
 }
 // CENTRE RADIAL BRAKE: huge sideways flywheel in a grounded saddle, hollow and physically traversable around it.
 // Each spoke is a real radial steel assembly tied through ring to floor pier; no fake scenery.
 oval(1071,513,137,132,M.T);oval(1071,513,116,111,0);
 oval(1071,513,42,43,M.I);oval(1071,513,21,23,0);
 for(let theta of [0,Math.PI/3,2*Math.PI/3,Math.PI,4*Math.PI/3,5*Math.PI/3]){
  beam(1071+Math.cos(theta)*40,513+Math.sin(theta)*41,1071+Math.cos(theta)*137,513+Math.sin(theta)*132,8,M.I);
 }
 beam(956,floor[956]+2,985,613,21,M.C);beam(1180,floor[1180]+2,1159,619,22,M.C);
 beam(998,627,1042,637,14,M.T);beam(1142,637,1166,628,13,M.T);
 box(1065,639,23,54,M.I);box(1071,662,9,25,M.Z,true);
 // Crisp attached mechanical indicators, not unsupported free paint.
 beam(967,444,1000,420,5,M.Q,true);beam(1139,426,1178,455,5,M.Z,true);
 // SALT-SCREEN CONDENSER: roof hung sorting nozzles vs individually founded dry cyclone separators.
 for(let [x,dx,tip] of [[1369,-46,405],[1485,41,433],[1603,-29,420]]){
  beam(x,roof[x]-6,x+dx,tip,16,M.T);beam(x+dx,tip,x+dx+(dx<0?-43:43),tip+17,11,M.Z);
  beam(x+dx,tip+6,x+dx+(dx<0?-45:45),tip+19,5,M.Q,true);
 }
 for(let [x,w,h] of [[1327,67,119],[1447,93,149],[1590,77,125]]){
  let y=floor[x];polygon([[x,y+11],[x+6,y-h+30],[x+23,y-h],[x+w-17,y-h+8],[x+w,y-h+31],[x+w+8,y+12]],M.C);
  box(x+16,y-h+37,w-30,13,M.T,true);box(x+21,y-h+64,w-40,8,M.Z,true);
 }
 beam(1410,floor[1410]+9,1442,765,12,M.I);beam(1551,floor[1551]+4,1580,759,13,M.I);
 // EAST TURNBACK: asymmetrical upper/lower catcher jaws, a genuinely open 200px vertical shaft.
 polygon([[1708,roof[1708]-3],[1773,roof[1773]-2],[1860,344],[1826,372],[1761,356]],M.T);
 beam(1821,365,1862,349,7,M.Q,true);
 polygon([[1987,roof[1987]-2],[2047,roof[2047]-3],[2047,336],[1973,351],[1900,375]],M.T);
 beam(1956,364,1904,377,7,M.Z,true);
 beam(1701,floor[1701],1747,740,21,M.C);beam(1747,740,1803,727,9,M.I);
 beam(2030,floor[2030],1971,722,23,M.C);beam(1971,722,1922,740,11,M.Z);
 // A large paired descent arch/exit defines high-speed choice without filling the 31x27 return mouth.
 beam(1867,roof[1867]-10,1882,407,13,M.T);beam(1882,407,1910,423,8,M.Q);
 beam(1818,floor[1818]+2,1828,761,11,M.T);beam(1828,761,1868,749,6,M.Z);
 // Machine-integral stripe surfaces repeat at different scales across distinct districts.
 for(let x=55;x<2000;x+=79){box(x,roof[x]-11,24,7,x<410?M.Z:x<860?M.Q:x<1300?M.S:x<1700?M.Z:M.Q,true);}
 for(let x=62;x<2015;x+=83){box(x,floor[x]+5,29,8,x<410?M.Q:x<860?M.Z:x<1300?M.S:x<1700?M.Q:M.Z,true);}
 // Enforce actual gallery and garage entry after fitting machinery. No nearest-site site shifts.
 for(let mouth of [226,712,1250,1808])box(mouth-39,122,78,285,0);
 for(let mouth of [258,738,1086,1460,1853])box(mouth-40,653,80,298,0);
 // Explicit real 90px-wide emergency egress from below the rotor saddle into the flight loop.
 // The western pier remains firmly attached to bedrock; the ring is not a floating ornament.
 box(1150,669,100,108,0);
 // R2 SHEPHERD P1: FUNCTIONAL plant equipment after final access cuts.
 // All controls terminate on actual roof/floor sidewalls; no floating foreground signage.
 // Four deliberately DIFFERENT roof control stations: injector, shear, radial brake, dispatch.
 // West injector telemetry: top-wall longitudinal pressure recorder, sidewall tube array and dump valve.
 box(115,72,34,102,M.I);box(125,79,26,82,M.C);box(132,89,12,65,M.O);
 for(let y of [91,116,141]){box(137,y,24,7,M.Z);box(156,y-6,13,21,M.I);}
 beam(350,86,307,113,8,M.T);box(293,101,45,15,M.Z);box(298,133,41,32,M.I);
 box(321,147,16,20,M.Q);beam(336,166,349,174,6,M.C);
 // Shear switchboard: cantilevered distribution comb, stacked contactors and rooted cooling exchanger.
 box(625,77,29,115,M.C);for(let j=0;j<4;j++)box(647,88+j*22,23,12,j%2?M.Z:M.I);
 beam(833,83,777,101,10,M.T);box(763,107,67,15,M.Z);
 box(790,127,33,60,M.I);box(798,135,17,37,M.O);box(787,175,44,8,M.Q);
 // Brake-watch operation: two opposed interlocks and a stepped mechanical status rack.
 box(1150,83,34,111,M.I);beam(1176,91,1197,151,10,M.C);
 box(1155,98,41,14,M.Z);box(1167,130,32,9,M.Q);
 box(1360,79,9,107,M.T);for(let j=0;j<3;j++){box(1301+j*18,91+j*17,54-j*13,12,M.I);}
 box(1310,164,48,20,M.Z);box(1321,170,27,8,M.Q);
 // East dispatcher: shuttered capture schedule drums, pneumatic readout and lower power tap.
 box(1720,76,36,118,M.C);for(let j=0;j<3;j++){box(1744,82+j*31,22,16,M.I);box(1748,86+j*31,12,6,M.Z);}
 beam(1944,79,1905,110,8,M.T);box(1858,108,70,19,M.I);box(1867,115,53,8,M.Q);
 box(1899,137,31,48,M.C);box(1904,146,17,33,M.Z);
 // Five genuinely furnished founded underworks, kept outside the open 80px entry shafts.
 // Injector overhaul: pressure piston and bolted radial compressor, two different service faces.
 box(128,943,69,51,M.I);oval(164,922,27,26,M.C);oval(164,922,12,12,M.O);
 box(188,899,21,95,M.T);box(192,903,13,76,M.Z);beam(298,986,330,903,13,M.I);
 box(318,918,63,76,M.C);box(331,921,39,23,M.Z);box(342,949,23,35,M.I);
 // Sawtooth substation: paired electrical stators and visible feed bus.
 box(627,949,73,45,M.I);for(let j=0;j<4;j++)box(634+j*14,911+j%2*10,9,45,M.Z);
 box(675,898,15,67,M.T);box(625,896,64,9,M.C);
 box(787,936,78,58,M.I);box(795,901,25,66,M.T);box(831,915,23,53,M.C);
 beam(809,904,845,893,7,M.Q);box(794,939,50,11,M.Z);
 // Brake-bearing workshop: anchored gear-ring diagnostic drum, double-cradle access and a toothed dog-clutch.
 box(969,955,69,39,M.C);oval(1003,924,36,37,M.T);oval(1003,924,22,23,M.O);
 for(let a of [0,1,2,3]){let yy=901+a*15;box(966,yy,10,8,M.Z);}
 box(1132,938,63,56,M.I);box(1137,906,15,62,M.C);box(1167,921,16,45,M.T);
 for(let j=0;j<4;j++)box(1152+j*10,953-j%2*7,7,25,M.Z);
 // Salt service: pressure-separated cyclone vessels, rinsing channels and a dry sample rack.
 box(1340,946,70,48,M.T);oval(1372,932,29,34,M.C);oval(1372,932,17,20,M.O);
 box(1399,936,15,58,M.I);box(1513,922,62,72,M.C);
 for(let j=0;j<3;j++)box(1519+j*17,910-j%2*11,12,52+j%2*11,M.T);
 box(1519,965,53,9,M.Z);box(1531,900,26,9,M.Q);
 // East recovery: geared haul winch, articulated jack, redirection drum and tool crib.
 box(1760,948,60,46,M.I);oval(1792,923,26,28,M.C);oval(1792,923,13,14,M.O);
 beam(1768,914,1799,894,9,M.T);box(1902,946,68,48,M.C);
 beam(1912,945,1945,903,12,M.I);box(1949,911,16,55,M.T);box(1916,963,44,10,M.Z);
 // Six-spoke RADIAL BRAKE now has an operable axial transfer assembly:
 // founded west drive chain, two asymmetrical interlocking shoes, ring-top encoder,
 // and an *open* physical maintenance bypass beneath the right-hand shoe.
 beam(930,floor[930]+3,944,666,18,M.C);
 box(921,663,55,31,M.I);for(let j=0;j<5;j++)box(930+j*9,658,5,21,M.Z);
 beam(951,672,977,627,12,M.T);box(944,676,27,15,M.Q);
 // Motor drive is grounded through its west foot; ring rests on the two original founded bearings.
 beam(1036,639,1061,661,10,M.I);box(1042,658,41,13,M.C);
 // Brake gates are segmented supported shoes, NOT solid doors across the course.
 beam(991,629,1008,602,10,M.Z);beam(1152,624,1139,605,10,M.Q);
 for(let j=0;j<4;j++)box(1031+j*18,381-j%2*3,12,10,M.Z,true);
 beam(1172,675,1186,651,9,M.I);box(1184,665,24,16,M.C);
 // Speed-readable but structural wayfinding: sawtooth UP markers on roof-backed machinery;
 // rotor upper bypass and lower emergency egress are two differentiated *physical* landmarks.
 beam(745,roof[745],777,266,7,M.Z);beam(777,266,796,278,7,M.Q);
 beam(820,roof[820],788,279,7,M.I);
 beam(971,roof[971],983,276,10,M.T);beam(983,276,1007,290,8,M.Q);
 beam(1140,roof[1140],1126,284,9,M.T);beam(1126,284,1107,297,7,M.Z);
 // Lower return uses a triple supported rail-end distinction (horizontal, not another roof tooth).
 for(let j=0;j<3;j++){let xx=1191+j*25;box(xx,floor[xx]-61+j*8,12,65-j*8,M.C);box(xx-6,floor[xx]-67+j*8,24,9,M.Z);}
 // West recovery portal: double-height cowl physically joined to bedplate, leaving centre lane clear.
 beam(166,floor[166],179,790,13,M.T);beam(204,floor[204],213,794,12,M.C);
 box(170,793,42,10,M.Q);box(182,806,17,11,M.Z);
 // Avoid accidental hard material over literal named race sites, not clear-radius exemptions.
 // Each named centre must be passed by full 31x27 clearance checker.
 // Discard unattached candidate steel details; final real-world material plane is grounded.
 const seen=new Uint8Array(N),q=new Int32Array(N);let head=0,tail=0;
 function push(i){if(g[i]&&!seen[i]){seen[i]=1;q[tail++]=i;}}
 for(let x=0;x<W;x++){push(x);push((H-1)*W+x);}for(let y=0;y<H;y++){push(y*W);push(y*W+W-1);}
 while(head<tail){let i=q[head++],x=i%W,y=(i-x)/W;if(x)push(i-1);if(x<W-1)push(i+1);if(y)push(i-W);if(y<H-1)push(i+W);}
 let discarded=0;for(let i=0;i<N;i++)if(g[i]&&!seen[i]){g[i]=0;discarded++;}
 return {g,grounded:tail,discarded};
}
function freeMask(g,w,h){let s=new Uint32Array((W+1)*(H+1)),stride=W+1;for(let y=1;y<=H;y++){let c=0,at=y*stride,p=(y-1)*stride;for(let x=1;x<=W;x++){c+=g[(y-1)*W+x-1]!==0?1:0;s[at+x]=c+s[p+x];}}let ok=new Uint8Array(g.length),l=w>>1,r=w-l-1,t=h>>1,b=h-t-1;for(let y=t;y<H-b;y++){let a=(y-t)*stride,z=(y+b+1)*stride;for(let x=l;x<W-r;x++){let xa=x-l,xb=x+r+1;if(s[z+xb]-s[a+xb]-s[z+xa]+s[a+xa]===0)ok[y*W+x]=1;}}return ok;}
function reach(g,w,h){let ok=freeMask(g,w,h),seen=new Uint8Array(g.length),q=new Int32Array(g.length),s=SITES[0][2]*W+SITES[0][1];if(!ok[s])throw Error('BLOCKED SPAWN '+w+'x'+h);let a=0,b=1;q[0]=s;seen[s]=1;while(a<b){let i=q[a++],x=i%W,y=(i-x)/W;for(let j of [x?i-1:-1,x<W-1?i+1:-1,y?i-W:-1,y<H-1?i+W:-1])if(j>=0&&ok[j]&&!seen[j]){seen[j]=1;q[b++]=j;}}return {connected:b,missing:SITES.filter(p=>!seen[p[2]*W+p[1]]).map(p=>p[0])};}
function encodeRects(g){let edits=[],active=new Map(),visits=0;for(let y=0;y<H;y++){let next=new Map(),o=y*W;for(let x=0;x<W;){let m=g[o+x],s=x;while(x<W&&g[o+x]===m)x++;if(!m)continue;let k=s+':'+(x-s)+':'+m,r=active.get(k);if(r)r[3]++;else{r=[s,y,x-s,1,m];edits.push(r);}next.set(k,r);visits+=x-s;}active=next;}return {edits,visits};}
module.exports={generate,freeMask,reach,encodeRects,SITES,CROPS,PALETTE,M,POLICY,MODEL_HASH,W,H,N,SEED};
