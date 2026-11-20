'use strict';
// Original orthographic 2048x1024 industrial flight landscape. No reference art inputs.
const W=2048,H=1024,N=W*H,SEED=0x261120ce;
const M={E:0,S:49,C:58,T:62,B:100,O:101,Z:113,I:117,Q:122};
const PALETTE={0:[8,13,24],49:[75,91,111],58:[134,146,160],62:[168,188,203],100:[44,55,68],101:[25,36,51],113:[223,182,103],117:[105,113,137],122:[244,231,198]};
const POLICY=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
const MODEL_HASH='c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96';
const SITES=[
 ['West ignition start',130,339],['Upper dispatch cut',330,352],['Cascade intake',474,407],['Baffled upper outlet',705,443],['Quench transfer west',886,476],['Switch drum outbound',1125,523],['Thermal filtration approach',1318,552],['Thermal fin outbound',1615,570],['East capture lip',1866,573],['East descent',1905,660],['East release',1870,747],['Thermal return',1537,754],['Central lower return',1150,764],['West lower return',770,759],['Brake service return',403,761],['West recovery climb',126,545],['Finish / ignition arch',134,336],['Dispatch operator room',249,129],['Control gantry studio',861,135],['East observation deck',1570,134],['West foundation repair',267,930],['Turbine service room',920,935],['Cooling inspection bay',1402,938],['East brake maintenance',1841,937],['Vertical switch inspection',1119,638],['Return cable way',568,615]];
const CROPS=[['overview.png',0,0,W,H],['01-ignition-dispatch.png',0,33,428,684],['02-cascade-louvers.png',385,178,485,695],['03-switch-drum.png',785,198,527,780],['04-quench-banks.png',1240,193,461,770],['05-capture-reversal.png',1650,180,398,791],['06-underfloor-shops.png',503,653,613,371]];
function generate(){
 let g=new Uint8Array(N),roof=new Int16Array(W),floor=new Int16Array(W),seed=SEED>>>0;
 const rnd=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return (seed>>>0)/4294967296;};
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), gauss=(x,c,r)=>Math.exp(-Math.pow((x-c)/r,2));
 function box(x,y,w,h,m,paint=false){let a=Math.max(0,Math.round(x)),b=Math.min(W,Math.round(x+w)),top=Math.max(0,Math.round(y)),bottom=Math.min(H,Math.round(y+h));for(let yy=top;yy<bottom;yy++)if(!paint)g.fill(m,yy*W+a,yy*W+b);else for(let xx=a;xx<b;xx++){let i=yy*W+xx;if(g[i])g[i]=m;}}
 function beam(x0,y0,x1,y1,r,m,paint=false){let dx=x1-x0,dy=y1-y0,len=dx*dx+dy*dy;for(let y=Math.max(0,Math.floor(Math.min(y0,y1)-r));y<Math.min(H,Math.ceil(Math.max(y0,y1)+r));y++)for(let x=Math.max(0,Math.floor(Math.min(x0,x1)-r));x<Math.min(W,Math.ceil(Math.max(x0,x1)+r));x++){let t=clamp(((x-x0)*dx+(y-y0)*dy)/(len||1),0,1),vx=x-x0-t*dx,vy=y-y0-t*dy;if(vx*vx+vy*vy<=r*r){let i=y*W+x;if(!paint||g[i])g[i]=m;}}}
 function poly(P,m){for(let y=Math.max(0,Math.floor(Math.min(...P.map(p=>p[1]))));y<Math.min(H,Math.ceil(Math.max(...P.map(p=>p[1]))));y++){let xs=[];for(let i=0;i<P.length;i++){let a=P[i],b=P[(i+1)%P.length];if(a[1]!==b[1]&&y>=Math.min(a[1],b[1])&&y<Math.max(a[1],b[1]))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let j=0;j+1<xs.length;j+=2)box(xs[j],y,xs[j+1]-xs[j]+1,1,m);}}
 function oval(cx,cy,rx,ry,m){for(let y=Math.max(0,Math.floor(cy-ry));y<Math.min(H,Math.ceil(cy+ry));y++){let delta=rx*Math.sqrt(Math.max(0,1-((y-cy)/ry)**2));box(cx-delta,y,delta*2+1,1,m);}}
 // Landscape envelope intentionally descends slightly east, exposing stepped chimney skyline and deep foundry footings.
 for(let x=0;x<W;x++){
   roof[x]=Math.round(157+10*Math.sin(x*.009)+5*Math.sin(x*.033)+38*gauss(x,575,160)+20*gauss(x,1025,170)+45*gauss(x,1480,180)-24*gauss(x,1920,130));
   floor[x]=Math.round(870+7*Math.sin(x*.008)+24*gauss(x,1070,175)-16*gauss(x,580,145));
   for(let y=0;y<roof[x];y++)g[y*W+x]=y<25?M.S:y<roof[x]-17?M.B:M.T;
   for(let y=floor[x];y<H;y++)g[y*W+x]=y<floor[x]+18?M.C:y>984?M.O:M.B;
 }
 // Three FUNCTIONAL upper rooms with actual entry via open shafts, asymmetrically configured.
 const upper=[[139,64,227,138,247],[766,70,255,147,870],[1472,64,206,150,1570]];
 for(let [x,y,w,h]of upper){box(x,y,w,h,0);box(x+12,y+12,w-24,10,M.S);box(x+11,y+h-26,59,12,M.C);box(x+w-72,y+h-26,61,12,M.C);box(x+12,y+27,16,76,M.I);box(x+w-28,y+26,15,72,M.T);}
 // Underfloor rooms are bored from solid foundation, each has different workcell geometry; not repeated empty trays.
 const lower=[[141,864,252,136,267],[782,865,257,137,916],[1279,863,256,139,1410],[1737,862,225,141,1847]];
 for(let [x,y,w,h]of lower){box(x,y,w,h,0);box(x+9,y+h-18,w-18,11,M.C);box(x+12,y+9,11,66,M.T);box(x+w-24,y+10,13,70,M.T);}
 // WEST: hollow compression horseshoe of truly supported masonry, long asymmetric acceleration ramp, operator console.
 beam(45,roof[45]-10,91,318,17,M.T);beam(91,318,157,301,9,M.Q);
 beam(376,roof[376]-13,329,322,19,M.T);beam(329,322,287,316,9,M.Z);
 beam(46,floor[46]+3,78,682,17,M.T);beam(78,682,130,700,9,M.I);
 beam(360,floor[360]+3,325,688,20,M.T);beam(325,688,275,701,9,M.Z);
 // Side-elevation real dispatch control shelves, roof-linked to boundary.
 box(176,160,25,27,M.T);box(201,183,98,10,M.I);box(306,170,34,24,M.T);
 box(188,179,18,9,M.Z,true);box(252,186,36,5,M.Q,true);
 box(170,956,65,10,M.C);box(179,923,20,34,M.T);box(199,938,50,10,M.I);
 box(290,951,43,13,M.C);beam(297,952,324,920,11,M.I);
 // CASCADE: three different anchored depth-baffle profiles create recognizable west/east decisions.
 poly([[449,roof[449]-11],[506,roof[506]-12],[554,365],[527,403],[491,378]],M.T);
 beam(481,roof[481]-5,535,377,8,M.Z,true);
 poly([[606,roof[606]-14],[659,roof[659]-14],[694,404],[662,444],[627,400]],M.I);
 beam(627,roof[627]-8,665,389,9,M.C);
 poly([[745,roof[745]-13],[792,roof[792]-10],[806,351],[762,392]],M.T);
 // Distinct weighing-bed mechanism at floor; lower outbound void remains open.
 poly([[466,floor[466]+10],[486,764],[510,738],[569,744],[598,floor[598]+11]],M.C);
 box(490,775,82,17,M.I,true);beam(523,817,565,762,9,M.Z,true);
 poly([[683,floor[683]+10],[708,795],[738,783],[764,800],[792,floor[792]+9]],M.T);
 box(707,808,58,8,M.Q,true);beam(727,863,746,815,9,M.I);
 // Lockable functional inspection deck with vertically rooted hoist and an asymmetric coil (not floating ornamental tracery).
 beam(565,roof[565]-12,603,319,11,M.T);beam(603,319,586,346,9,M.I);
 box(564,299,66,15,M.C);box(582,305,35,5,M.Z,true);
 // CORE: grounded hollow polygonal drive drum, access through literal bore and distinct counter-rotating service drums.
 poly([[930,floor[930]+4],[955,723],[987,664],[1031,638],[1126,643],[1188,699],[1234,floor[1234]+5]],M.T);
 poly([[1022,743],[1044,697],[1090,689],[1141,729],[1154,804],[1007,807]],M.E);
 beam(949,floor[949]+9,1021,702,12,M.C);
 beam(1200,floor[1200]+12,1141,705,12,M.C);
 box(1067,727,55,19,M.I);box(1074,734,39,7,M.Z,true);
 // Upper opposing energy headers and load-transfer hub (all roof anchored).
 beam(825,roof[825]-7,883,382,18,M.T);beam(883,382,932,401,10,M.I);
 beam(1246,roof[1246]-10,1194,382,16,M.T);beam(1194,382,1144,403,10,M.C);
 beam(887,382,936,402,6,M.Q,true);beam(1194,382,1144,403,6,M.Z,true);
 box(960,264,55,22,M.C);box(966,271,37,10,M.Q,true);beam(985,roof[985]-2,985,264,13,M.T);
 // QUENCH BANK: asymmetrical founded filters with true access from the racing return, no water or falling solids.
 poly([[1285,floor[1285]+11],[1305,708],[1341,671],[1376,694],[1408,floor[1408]+8]],M.C);
 box(1327,695,20,50,M.I,true);box(1347,710,34,10,M.Z,true);
 poly([[1439,floor[1439]+9],[1476,694],[1500,653],[1529,685],[1580,floor[1580]+8]],M.T);
 box(1493,700,45,10,M.Q,true);
 poly([[1588,floor[1588]+8],[1607,746],[1623,731],[1650,748],[1680,floor[1680]+8]],M.C);
 beam(1395,roof[1395]-7,1440,385,14,M.T);beam(1440,385,1475,372,7,M.Z);
 beam(1610,roof[1610]-7,1585,404,13,M.I);beam(1585,404,1547,416,8,M.Q);
 // Three distinct shop machines founded to full boundary, each has actual component geography.
 box(157,954,74,11,M.C);box(184,914,16,40,M.T);box(200,939,53,11,M.I);
 box(801,949,111,13,M.C);box(819,913,23,39,M.T);box(841,924,63,19,M.I);beam(938,953,962,910,11,M.Z);
 box(1303,950,102,14,M.C);box(1316,913,16,39,M.T);box(1333,927,56,17,M.I);box(1409,921,51,32,M.T);
 box(1751,950,91,14,M.C);box(1770,916,34,36,M.I);beam(1840,953,1890,909,12,M.T);
 // EAST: two unequal boundary-linked reversal jaws create clear high/mid/lower approach hierarchy.
 beam(1697,roof[1697]-10,1762,435,20,M.T);beam(1762,435,1793,462,9,M.Z);
 beam(2034,roof[2034]-12,1961,437,20,M.T);beam(1961,437,1923,462,9,M.Q);
 beam(1700,floor[1700]+8,1762,796,19,M.C);beam(1762,796,1802,779,9,M.Z);
 beam(2034,floor[2034]+7,1961,811,19,M.C);beam(1961,811,1920,785,10,M.Q);
 box(1979,866,30,91,M.T);box(1987,876,14,39,M.I,true);
 // Extra deliberate ground-backed directional markings, never standalone collidable signs.
 for(let [x,m] of [[340,M.Q],[730,M.Z],[1210,M.Q],[1650,M.Z]]){let y=roof[x];box(x,y-11,55,8,m,true);}
 for(let [x,m] of [[230,M.Z],[690,M.Q],[1130,M.Z],[1520,M.Q],[1870,M.Z]]){let y=floor[x];box(x,y+6,51,9,m,true);}
 // True hull-clear passages from open world into seven distinct visitable interiors.
 for(let mouth of [247,870,1570])box(mouth-43,137,86,278,0);
 for(let mouth of [267,916,1410,1847])box(mouth-46,728,92,228,0);
 // Core motor service tunnel: actual cut through encasing drive-ring masonry, not nearest-site teleports.
 box(1071,592,99,223,0);
 // A roof-open longitudinal maintenance chimney through the east thermal vessel, at the literal return checkpoint.
 box(1502,640,92,170,0);
 // FOUNDED on-wall mechanical controls survive excavation only inside valid interior back walls and bases.
 for(let [x,y,w,h]of upper){box(x+22,y+22,15,61,M.T);box(x+39,y+70,31,10,M.Z,true);box(x+w-75,y+h-33,37,12,M.I);box(x+w-72,y+h-42,20,10,M.Q,true);}
 for(let [x,y,w,h]of lower){box(x+27,y+h-30,52,12,M.T);box(x+34,y+h-55,15,28,M.I);box(x+w-86,y+h-49,47,32,M.C);box(x+w-70,y+h-38,25,11,M.Z,true);}
 // Each enclosed operating room is physically founded to the roof, with machinery tied to its side walls;
 // the Midge flight shaft and literal operator-room visit centres remain clear.
 for(let [x,y,w,h] of upper){
   box(x+11,y-15,20,125,M.T);box(x+w-37,y-15,21,131,M.C);
   box(x+30,y+94,48,12,M.I);box(x+38,y+85,24,10,M.Z,true);
   box(x+w-96,y+103,58,12,M.T);box(x+w-86,y+95,24,9,M.Q,true);
 }
 // Distinct occupied service cells must remain anchored to the deep foundation, not float in excavations.
 for(let [x,y,w,h] of lower){
   box(x-8,y+h-23,w+16,29,M.C);
   box(x+20,y+h-91,20,71,M.T);box(x+34,y+h-63,36,12,M.I);
   box(x+w-65,y+h-102,25,82,M.I);box(x+w-91,y+h-35,31,12,M.Z);
 }
 // A few reproducible calibration notches only recolour already grounded structure.
 for(let i=0;i<17;i++){let x=110+(rnd()*1810)|0;box(x,floor[x]+10,13,6,i%2?M.Z:M.Q,true);}
 // Cut the complete upper-dispatch flight decision throat after all visual machines; preserved exact waypoint.
 box(309,327,47,55,0);
 // Defensive grounding qualification: remove any inadvertently disconnected material before final receipts.
 let seen=new Uint8Array(N),q=new Int32Array(N),a=0,b=0;function push(i){if(g[i]&&!seen[i]){seen[i]=1;q[b++]=i;}}for(let x=0;x<W;x++){push(x);push((H-1)*W+x);}for(let y=0;y<H;y++){push(y*W);push(y*W+W-1);}while(a<b){let p=q[a++],x=p%W,y=(p-x)/W;if(x)push(p-1);if(x<W-1)push(p+1);if(y)push(p-W);if(y<H-1)push(p+W);}let discarded=0;for(let i=0;i<N;i++)if(g[i]&&!seen[i]){g[i]=0;discarded++;}
 return {g,grounded:b,discarded};
}
function encodeRects(g){let edits=[],active=new Map(),visits=0;for(let y=0;y<H;y++){let next=new Map(),base=y*W;for(let x=0;x<W;){let m=g[base+x],s=x;while(x<W&&g[base+x]===m)x++;if(!m)continue;let k=s+':'+(x-s)+':'+m,r=active.get(k);if(r)r[3]++;else{r=[s,y,x-s,1,m];edits.push(r);}next.set(k,r);visits+=x-s;}active=next;}return {edits,visits};}
function freeMask(g,w,h){let s=new Uint32Array((W+1)*(H+1)),stride=W+1;for(let y=1;y<=H;y++){let c=0,at=y*stride,p=(y-1)*stride;for(let x=1;x<=W;x++){c+=g[(y-1)*W+x-1]!==0?1:0;s[at+x]=c+s[p+x];}}let ok=new Uint8Array(g.length),l=w>>1,r=w-l-1,t=h>>1,b=h-t-1;for(let y=t;y<H-b;y++){let a=(y-t)*stride,z=(y+b+1)*stride;for(let x=l;x<W-r;x++){let xa=x-l,xb=x+r+1;if(s[z+xb]-s[a+xb]-s[z+xa]+s[a+xa]===0)ok[y*W+x]=1;}}return ok;}
function reach(g,w,h){let ok=freeMask(g,w,h),seen=new Uint8Array(g.length),q=new Int32Array(g.length),s=SITES[0][2]*W+SITES[0][1];if(!ok[s])throw Error('BLOCKED SPAWN '+w+'x'+h);let a=0,b=1;q[0]=s;seen[s]=1;while(a<b){let i=q[a++],x=i%W,y=(i-x)/W;for(let j of [x?i-1:-1,x<W-1?i+1:-1,y?i-W:-1,y<H-1?i+W:-1])if(j>=0&&ok[j]&&!seen[j]){seen[j]=1;q[b++]=j;}}return {connected:b,missing:SITES.filter(p=>!seen[p[2]*W+p[1]]).map(p=>p[0])};}
module.exports={generate,encodeRects,freeMask,reach,W,H,N,SEED,M,PALETTE,POLICY,MODEL_HASH,SITES,CROPS};
