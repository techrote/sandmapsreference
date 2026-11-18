/* CyberSand original industrial vertical: fixed-seed standalone builder. Node >=18. */
const build = function build(){
"use strict";
const W=1024,H=2048,SEED=0x26111805,ENGINE="018bd09503d7f079ddac52e225c2f7daf8d678bf";
const ROOT="cybersand-canvases/1024x2048/original-industrial-vertical-severed-counterweight-261118";
const PAL={0:[8,11,18,255],1:[82,91,106,255],3:[47,127,210,255],14:[218,198,238,255],29:[166,74,42,255],31:[105,108,112,255],38:[197,191,175,255],39:[199,156,98,255],40:[119,119,130,255],43:[163,80,59,255],50:[50,58,64,255],58:[119,123,128,255],62:[126,141,153,255],63:[49,100,119,255],64:[109,125,134,255],65:[124,63,43,255],66:[74,85,93,255],68:[102,119,129,255],69:[165,92,54,255],70:[200,210,203,255],72:[37,60,76,192],73:[36,37,41,255],74:[60,53,68,255],76:[227,182,47,255],77:[55,243,228,255],78:[255,61,184,255],79:[255,181,46,255],80:[236,248,255,255],98:[226,223,216,255],100:[54,56,61,255],101:[24,19,32,255],111:[200,196,186,255],117:[90,94,100,255],119:[196,160,72,255],120:[156,210,220,204],129:[26,46,94,255],130:[34,36,41,255],131:[26,26,29,255]};
const INERT=new Set([1,31,38,39,40,43,50,58,62,63,64,65,66,68,69,70,72,73,74,76,77,78,79,80,98,100,101,111,117,119,120,129,130,131]);
let seed=SEED>>>0;const rand=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296;};
const pick=a=>a[Math.floor(rand()*a.length)],grid=new Uint8Array(W*H);
function box(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);let x1=Math.max(0,x),y1=Math.max(0,y),x2=Math.min(W,x+w),y2=Math.min(H,y+h);if(x2<=x1||y2<=y1)return;for(let yy=y1;yy<y2;yy++)grid.fill(m,yy*W+x1,yy*W+x2);}
function line(x1,y1,x2,y2,thick,m){let dx=x2-x1,dy=y2-y1,n=Math.max(Math.abs(dx),Math.abs(dy));for(let i=0;i<=n;i++){let x=Math.round(x1+dx*i/Math.max(n,1)),y=Math.round(y1+dy*i/Math.max(n,1));box(x-Math.floor(thick/2),y-Math.floor(thick/2),thick,thick,m);}}
function frame(x,y,w,h,t,m){box(x,y,w,t,m);box(x,y+h-t,w,t,m);box(x,y,t,h,m);box(x+w-t,y,t,h,m);}
function lite(x,y,id=79){box(x-5,y-3,10,6,id);box(x-2,y+3,4,3,62);}
function gusset(x,y,w,h,m=50){line(x,y,x+w,y+h,3,m);line(x+w,y,x,y+h,3,m);box(x-2,y-2,w+4,4,62);box(x-2,y+h-2,w+4,4,62);}
function pipe(points,m=69,t=3){for(let i=1;i<points.length;i++)line(points[i-1][0],points[i-1][1],points[i][0],points[i][1],t,m);for(let i=1;i<points.length-1;i++)box(points[i][0]-4,points[i][1]-4,9,9,119);}
function chamber(x,y,w,h,kind){frame(x,y,w,h,7,58);box(x+8,y+9,w-16,6,65);box(x+8,y+h-15,w-16,6,50);for(let k=0;k<3;k++){let xx=x+15+k*Math.floor((w-30)/3);box(xx,y+15,4,h-30,64);}
 if(kind==="winch"){for(let i=0;i<3;i++){let cx=x+24+i*46;frame(cx,y+34,38,52,5,62);box(cx+10,y+48,18,24,130);lite(cx+19,y+26,77);}pipe([[x+8,y+h-30],[x+42,y+h-30],[x+42,y+h-7]],69,4);}
 if(kind==="sorter"){for(let i=0;i<3;i++){let xx=x+14+i*48;line(xx,y+22,xx+42,y+70,5,65);line(xx+42,y+70,xx+46,y+100,5,50);box(xx+9,y+102,28,5,76);}box(x+12,y+h-35,w-24,6,119);}
 if(kind==="pressure"){for(let i=0;i<3;i++){let cx=x+30+i*48;frame(cx-12,y+30,24,72,4,69);box(cx-7,y+41,14,40,72);lite(cx,y+116,i===1?77:79);}pipe([[x+8,y+h-20],[x+w-8,y+h-20]],68,4);}
 if(kind==="relay"){for(let i=0;i<4;i++){let xx=x+18+i*32;box(xx,y+25,23,35,73);box(xx+4,y+29,15,8,i%2?78:77);}for(let yy=y+75;yy<y+h-20;yy+=22)box(x+18,yy,w-36,3,69);}
}
function girder(x,y,w,h){frame(x,y,w,h,5,62);for(let yy=y+15;yy<y+h-24;yy+=36)gusset(x+7,yy,w-14,29,50);}
function gantry(x1,x2,y,gateX){ // bridge with a flight slot through the tie level
 for(let x=x1;x<x2;x+=32){if(Math.abs(x-gateX)<27)continue;box(x,y+21,Math.min(30,x2-x),6,62);box(x+4,y+13,3,8,65);box(x+20,y+13,3,8,65);}
 box(x1,y+32,x2-x1,3,50);for(let x=x1+14;x<x2-20;x+=48){if(Math.abs(x-gateX)<34)continue;line(x,y+32,x+26,y+49,3,65);}
}
function tunnel(points,width){let half=Math.floor(width/2);for(let i=1;i<points.length;i++){let a=points[i-1],b=points[i];if(a[0]===b[0])box(a[0]-half,Math.min(a[1],b[1])-half,width,Math.abs(b[1]-a[1])+width,0);else if(a[1]===b[1])box(Math.min(a[0],b[0])-half,a[1]-half,Math.abs(b[0]-a[0])+width,width,0);else throw Error("nonrectilinear route");}}
const SITES=[
 {id:"A",name:"Crown dispatch",at:[520,145],district:"Sky intake"},
 {id:"B",name:"Signal lantern bridge",at:[520,290],district:"Sky intake"},
 {id:"C",name:"Western winch desk",at:[205,505],district:"Counterweight cathedral"},
 {id:"D",name:"Eastern thrust control",at:[800,700],district:"Counterweight cathedral"},
 {id:"E",name:"Ore assay alcove",at:[205,1030],district:"Sorting and crushers"},
 {id:"F",name:"Main ore exchange",at:[595,1060],district:"Sorting and crushers"},
 {id:"G",name:"Central rail interlock",at:[514,1335],district:"Rail funnel"},
 {id:"H",name:"Pressure switchroom",at:[800,1400],district:"Rail funnel"},
 {id:"I",name:"Salvage retrieval dock",at:[205,1765],district:"Quench and reclamation"},
 {id:"J",name:"Furnace inspection perch",at:[800,1750],district:"Quench and reclamation"},
 {id:"K",name:"Bottom lift terminal",at:[494,1910],district:"Quench and reclamation"}];
const ROUTES={
 central:[[520,145],[520,342],[558,342],[558,620],[484,620],[484,930],[595,930],[595,1125],[514,1125],[514,1420],[576,1420],[576,1640],[494,1640],[494,1940]],
 west:[[205,300],[205,1850]],
 east:[[800,270],[800,1880]],
 crossovers:[
 [[205,450],[558,450]],[[205,900],[595,900]],[[205,1460],[576,1460]],[[205,1825],[494,1825]],
 [[558,350],[800,350]],[[484,760],[800,760]],[[514,1190],[800,1190]],[[576,1640],[800,1640]],[[494,1850],[800,1850]]
 ]};
// 1. Strata and geological curtain; seeded widths but not pixel noise.
for(let y=80;y<H;y+=32){
 let a=94+Math.round(16*Math.sin(y/119)+11*Math.sin(y/43)),b=923+Math.round(14*Math.sin(y/139+2)+7*Math.sin(y/41));
 box(0,y,Math.max(72,a),32,pick([100,100,101,40]));box(b,y,1024-b,32,pick([100,101,40,100]));
 if(y%128===80){box(9,y+7,Math.max(16,a-18),3,65);box(b+4,y+16,1000-b,3,50);}
}
for(let y=125;y<H-70;y+=97){box(24+(y*11)%39,y,26+(y%3)*8,12,pick([40,101,65]));box(934+(y%27),y+18,23,9,pick([38,65,40]));}
// 2. Structural twin spines, orthogonally supported from bedrock.
box(109,92,17,1909,58);box(894,92,18,1909,58);
box(330,160,18,1795,58);box(676,160,18,1795,58);
for(let y=154;y<1942;y+=218){box(94,y,46,14,65);box(879,y,48,14,65);box(321,y,35,12,62);box(667,y,34,12,62);}
for(let y=220;y<1920;y+=154){gusset(127,y,44,94,50);gusset(847,y,44,94,50);}
// 3. Collimated elevator tracks and sheaves, no fake perspective.
for(let x of [363,373,645,655])box(x,133,3,1840,68);
for(let y=188;y<1920;y+=82){box(357,y,25,7,62);box(638,y,25,7,62);box(362,y+5,10,4,76);box(650,y+5,10,4,76);}
for(let y of [154,450,710,963,1220,1470,1780,1920]){
 box(350,y,325,6,50);box(351,y+7,325,3,65);
 for(let x of [375,640])box(x-8,y-5,18,17,119);
}
// 4. High crown: six unequal intake stacks and massive cable bridge.
box(135,95,730,12,62);box(157,79,692,8,65);
for(let [x,w,h] of [[163,35,64],[240,22,84],[291,31,43],[722,38,95],[793,27,58],[839,20,74]]){
 frame(x,95-h,w,h+2,5,58);box(x+5,102-h,w-10,8,50);lite(x+Math.floor(w/2),110-h,79);
}
girder(405,99,214,72);frame(451,183,126,78,6,62);box(462,196,103,20,72);box(474,219,80,7,76);
pipe([[159,194],[159,132],[344,132],[344,218]],69,4);pipe([[870,196],[870,126],[686,126],[686,218]],68,4);
for(let x=428;x<=597;x+=19)lite(x,168,77);
// 5. Counterweight cathedral: left sheave bank, right control, hanging mass.
girder(133,375,190,110);chamber(135,515,188,147,"winch");
girder(707,385,181,134);chamber(712,610,177,136,"relay");
frame(408,475,133,158,7,50);box(420,499,110,108,65);box(428,510,94,17,76);for(let yy=541;yy<595;yy+=14)box(436,yy,78,4,62);
for(let x of [436,505])box(x,342,5,133,68);
frame(585,537,76,91,6,58);box(595,549,56,65,130);for(let yy=556;yy<611;yy+=12)box(603,yy,38,2,119);
for(let y of [320,571,842]){box(127,y,201,10,62);box(696,y+22,193,11,65);}
gantry(352,667,694,484);
for(let [x,y] of [[152,360],[282,498],[727,533],[858,756]]){frame(x,y,28,38,4,62);box(x+7,y+10,14,10,77);}
// 6. Ore handling zone: asymmetric steep ore throats, industrial sorting.
chamber(140,870,184,172,"sorter");chamber(707,935,179,144,"relay");
for(let x of [143,179,285]){box(x,765,9,103,58);box(x-7,757,23,7,76);}
line(275,852,320,895,7,65);line(320,895,274,924,7,62);
frame(394,848,83,68,6,58);box(405,857,60,50,130);for(let yy=867;yy<898;yy+=10)box(410,yy,49,3,119);
for(let y=882;y<1195;y+=77){box(127,y,31,8,65);box(866,y+13,28,7,62);}
for(let x=716;x<887;x+=22){box(x,1135,17,10,76);box(x,1145,17,5,50);}
pipe([[315,806],[315,840],[374,840],[374,1040],[413,1040]],69,5);
pipe([[703,837],[754,837],[754,922],[856,922]],68,4);
// 7. Rail funnel, orthogonal cradles and switchworks.
box(128,1262,198,17,62);box(696,1275,195,17,62);
frame(143,1304,180,126,6,58);chamber(717,1334,168,155,"pressure");
girder(350,1250,144,54);girder(535,1320,132,66);
for(let yy of [1289,1356,1491]){box(354,yy,312,6,62);for(let xx=367;xx<651;xx+=43)gusset(xx,yy+8,35,26,65);}
for(let x=155;x<325;x+=16){box(x,1498,11,7,76);box(x+2,1506,7,4,50);}
pipe([[139,1206],[139,1245],[310,1245],[310,1302]],69,5);
pipe([[887,1224],[863,1224],[863,1325],[812,1325]],68,5);
for(let y of [1230,1530]){lite(365,y,77);lite(655,y,79);}
// 8. Lower reclamation: heat shield, quench vessel and salvage lift dock.
girder(140,1595,184,74);frame(137,1700,192,149,7,58);chamber(718,1695,162,104,"relay");
for(let x=710;x<890;x+=21){box(x,1598,14,33,131);box(x+3,1588,9,9,79);}
frame(720,1875,164,131,9,58);box(730,1948,145,45,3);box(734,1937,137,11,120);
box(719,1998,168,16,58);box(730,2002,147,3,119);
for(let x of [739,801,862]){box(x,1883,6,58,68);box(x,1897,9,7,76);}
frame(381,1807,249,106,7,62);box(391,1821,229,12,65);
for(let x=400;x<616;x+=42)gusset(x,1835,32,41,50);
frame(436,1923,129,89,8,58);box(448,1951,104,24,130);box(447,1979,106,8,76);
pipe([[310,1563],[310,1681],[355,1681],[355,1841]],69,5);
pipe([[711,1730],[697,1730],[697,1890],[716,1890]],68,5);
// 9. Side shaft habitation: levels, switchboards, suspended static gantries.
for(let [y,width] of [[344,196],[693,177],[1049,185],[1539,176],[1885,198]]){
 box(128,y,width,9,65);box(701,y+17,187,10,62);
 for(let x of [136,278]){box(x,y-36,7,34,50);box(x-4,y-43,14,8,76);}
 for(let x of [712,862]){box(x,y-34,7,33,65);box(x-4,y-41,15,7,119);}
}
for(let [y,x1,x2,g] of [[450,339,672,520],[760,350,676,558],[900,345,676,595],[1190,348,676,514],[1460,345,675,576],[1640,345,674,576],[1825,346,670,494]])
 gantry(x1,x2,y,g);
for(let y=210;y<1940;y+=113){box(128,y,14,9,62);box(878,y+36,16,8,62);lite(137,y+12,79);lite(887,y+48,77);}
// 10. Mandatory navigable cores and crossovers carved *after* every fixture.
tunnel(ROUTES.central,54);tunnel(ROUTES.west,60);tunnel(ROUTES.east,60);
for(let p of ROUTES.crossovers)tunnel(p,58);
// carve meaningful subsidiary pockets without adding fake destination substitution
box(139,982,72,58,0);box(800,1530,87,74,0);
box(253,410,77,85,0);box(695,684,104,64,0);
box(250,1772,92,65,0);box(686,1152,93,69,0);
// Add bulkhead visible external to flight envelopes and service markers.
for(let [x,y] of [[343,450],[678,350],[343,900],[678,760],[343,1460],[678,1190],[343,1825],[678,1640]]){
 box(x-4,y-43,8,13,62);box(x-4,y+30,8,13,62);lite(x,y-42,77);lite(x,y+42,79);
}
for(const [x,y] of [[115,520],[231,1030],[763,700],[838,1400],[845,1735],[524,289],[516,1335],[568,1909]]){
 // status beacons intentionally outside 31x27 flight envelope
 lite(x+22,y-28,79);box(x+15,y-26,4,19,69);
}
const HIST={};let occupied=0;for(const m of grid){HIST[m]=(HIST[m]||0)+1;if(m){occupied++;if(!INERT.has(m)&&m!==3)throw Error("Non-inert unexpected material "+m);}}
if(!(HIST[3]>0))throw Error("Quench Water was expected in the sealed lower sump"); // this is fatal only if coolant is fully erased
// Exact optimal by vertical coalescing of horizontal material runs.
let edits=[],prev=new Map();
for(let y=0;y<H;y++){let active=new Map(),off=y*W,x=0;while(x<W){let m=grid[off+x],start=x++;while(x<W&&grid[off+x]===m)x++;if(!m)continue;let width=x-start,key=start+":"+width+":"+m,index=prev.get(key);if(index!==undefined&&edits[index][1]+edits[index][3]===y){edits[index][3]++;active.set(key,index);}else{edits.push([start,y,width,1,m]);active.set(key,edits.length-1);}}prev=active;}
const replay=new Uint8Array(W*H);let work=0;for(const [x,y,w,h,m]of edits){if(!Number.isInteger(x)||x<0||y<0||x+w>W||y+h>H||!PAL[m])throw Error("invalid stamp");work+=w*h;for(let yy=y;yy<y+h;yy++){let p=yy*W+x;for(let xx=0;xx<w;xx++)if(replay[p+xx])throw Error("overlapping rectangle");replay.fill(m,p,p+w);}}
for(let i=0;i<grid.length;i++)if(grid[i]!==replay[i])throw Error("replay mismatch at "+i);
if(edits.length>32768)throw Error("too many rectangles: "+edits.length);
if(work>Math.min(64*W*H,32000000))throw Error("work budget exceeded");
const MIDGE_HASH="c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96";
const LIQ=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
const setup={version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:MIDGE_HASH,spawn:[520,145],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.5}}],next_id:2,selected:1,edits,response:"LA-SELECTIVE",liquid_policy:LIQ,normalize:false,rule_radius:2,source:[],material:2,brush:8,fire:false};
const setupString=JSON.stringify(setup);
if(setupString.length>1048576)throw Error("1 MiB JSON budget exceeded "+setupString.length);
if(!([W,H].every(x=>x>=512&&x<=2048&&x%64===0)))throw Error("dimension mismatch");
// Collision envelope: padded rectangular footprint centered on actual named coordinate.
// No nearest-cell substitution, no pass-through of structural cells.
const st=W+1,sat=new Uint32Array((W+1)*(H+1));
for(let y=0;y<H;y++){let sum=0;for(let x=0;x<W;x++){sum+=(grid[y*W+x]!==0)?1:0;sat[(y+1)*st+x+1]=sat[y*st+x+1]+sum;}}
function clear(x,y,w,h){let l=x-Math.floor(w/2),t=y-Math.floor(h/2),r=l+w,b=t+h;if(l<0||t<0||r>W||b>H)return false;return sat[b*st+r]-sat[b*st+l]-sat[t*st+r]+sat[t*st+l]===0;}
function bfs(w,h,blocked){const vis=new Uint8Array(W*H),q=new Uint32Array(W*H);let sx=SITES[0].at[0],sy=SITES[0].at[1],sp=sy*W+sx;if(!clear(sx,sy,w,h))throw Error("spawn obstructed "+w+"x"+h);q[0]=sp;vis[sp]=1;let head=0,tail=1;while(head<tail){let p=q[head++],x=p%W,y=(p-x)/W;const ns=[[x-1,y],[x+1,y],[x,y-1],[x,y+1]];for(let [xx,yy] of ns){if(xx<0||yy<0||xx>=W||yy>=H)continue;let id=yy*W+xx;if(vis[id])continue;if(blocked&&xx>=blocked[0]&&xx<blocked[2]&&yy>=blocked[1]&&yy<blocked[3])continue;if(!clear(xx,yy,w,h))continue;vis[id]=1;q[tail++]=id;}}return{vis,count:tail};}
const flight=[];
for(let [w,h] of [[19,15],[23,19],[31,27]]){let {vis,count}=bfs(w,h);let reach=[];for(let s of SITES){let [x,y]=s.at,pass=clear(x,y,w,h)&&vis[y*W+x]===1;reach.push({id:s.id,at:s.at,clear:clear(x,y,w,h),reached:pass});if(!pass)throw Error("Unreachable EXACT "+s.id+" "+w+"x"+h);}flight.push({footprint:[w,h],reachable_sites:reach.length,total_sites:SITES.length,reachable_centers:count,sites:reach});}
const alt=bfs(31,27,[420,983,665,1006]);if(!alt.vis[SITES[SITES.length-1].at[1]*W+SITES[SITES.length-1].at[0]])throw Error("alternate route bypass blocked main lift throat");
function bytes(text){let out=[];for(let i=0;i<text.length;i++){let n=text.charCodeAt(i);if(n<128)out.push(n);else if(n<2048)out.push(0xc0|(n>>6),0x80|(n&63));else out.push(0xe0|(n>>12),0x80|((n>>6)&63),0x80|(n&63));}return Uint8Array.from(out);}
function sha256(raw){let K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2],Hh=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];let n=raw.length,total=Math.ceil((n+9)/64)*64,pad=new Uint8Array(total);pad.set(raw);pad[n]=128;let len=n*8;let hi=Math.floor(len/4294967296),lo=len>>>0;for(let j=0;j<4;j++){pad[total-8+j]=(hi>>>(24-j*8))&255;pad[total-4+j]=(lo>>>(24-j*8))&255;}let w=new Int32Array(64),ro=(x,n)=>(x>>>n)|(x<<(32-n));for(let off=0;off<total;off+=64){for(let j=0;j<16;j++){let o=off+j*4;w[j]=(pad[o]<<24)|(pad[o+1]<<16)|(pad[o+2]<<8)|pad[o+3];}for(let j=16;j<64;j++){let a=w[j-15],b=w[j-2];w[j]=(w[j-16]+(ro(a,7)^ro(a,18)^(a>>>3))+w[j-7]+(ro(b,17)^ro(b,19)^(b>>>10)))|0;}let [a,b,c,d,e,f,g,h]=Hh;for(let j=0;j<64;j++){let t1=(h+(ro(e,6)^ro(e,11)^ro(e,25))+((e&f)^(~e&g))+K[j]+w[j])|0,t2=((ro(a,2)^ro(a,13)^ro(a,22))+((a&b)^(a&c)^(b&c)))|0;h=g;g=f;f=e;e=(d+t1)|0;d=c;c=b;b=a;a=(t1+t2)|0;}Hh=Hh.map((v,i)=>(v+[a,b,c,d,e,f,g,h][i])|0);}return Hh.map(v=>(v>>>0).toString(16).padStart(8,"0")).join("");}
if(sha256(bytes("abc"))!=="ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad")throw Error("SHA-256 self-test");
const CRC_TABLE=new Uint32Array(256);for(let i=0;i<256;i++){let c=i;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;CRC_TABLE[i]=c>>>0;}
function crc32(a){let c=0xffffffff;for(let v of a)c=CRC_TABLE[(c^v)&255]^(c>>>8);return(c^0xffffffff)>>>0;}
function u32(x){return[(x>>>24)&255,(x>>>16)&255,(x>>>8)&255,x&255];}
const LB=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],LE=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
const DB=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],DE=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];
function rev(x,n){let y=0;for(let k=0;k<n;k++){y=(y<<1)|(x&1);x>>>=1;}return y;}
function fcode(s){if(s<=143)return[rev(48+s,8),8];if(s<=255)return[rev(400+s-144,9),9];if(s<=279)return[rev(s-256,7),7];return[rev(192+s-280,8),8];}
function deflate(raw,stride){const out=[0x78,0x01];let bits=0,count=0;function put(v,n){bits|=v<<count;count+=n;while(count>=8){out.push(bits&255);bits>>>=8;count-=8;}}
 function sym(s){let a=fcode(s);put(a[0],a[1]);}
 put(1,1);put(1,2);let i=0;while(i<raw.length){let d=0,len=0;if(i>0&&raw[i]===raw[i-1]){let n=1;while(n<258&&i+n<raw.length&&raw[i+n]===raw[i-1])n++;if(n>=3){d=1;len=n;}}
 if(i>=stride&&raw[i]===raw[i-stride]){let n=1;while(n<258&&i+n<raw.length&&raw[i+n]===raw[i+n-stride])n++;if(n>=4&&n>len){d=stride;len=n;}}
 if(len>=3){let j=LB.length-1;while(j>0&&LB[j]>len)j--;sym(257+j);put(len-LB[j],LE[j]);let dc=DB.length-1;while(dc>0&&DB[dc]>d)dc--;put(rev(dc,5),5);put(d-DB[dc],DE[dc]);i+=len;}else{sym(raw[i]);i++;}}
 sym(256);if(count)out.push(bits&255);
 let a=1,b=0;for(let j=0;j<raw.length;j++){a+=raw[j];b+=a;if((j&4095)===4095){a%=65521;b%=65521;}}a%=65521;b%=65521;out.push(...u32(((b<<16)|a)>>>0));return Uint8Array.from(out);}
function pngFromGrid(x,y,w,h){const raw=new Uint8Array((w+1)*h);for(let row=0;row<h;row++)raw.set(grid.subarray((y+row)*W+x,(y+row)*W+x+w),row*(w+1)+1);
 let plte=new Uint8Array(256*3);for(let id of Object.keys(PAL)){let p=+id;plte.set(PAL[p].slice(0,3),p*3);}
 let out=[137,80,78,71,13,10,26,10];function chunk(type,data){let t=bytes(type),check=new Uint8Array(t.length+data.length);check.set(t);check.set(data,t.length);out.push(...u32(data.length));for(let v of t)out.push(v);for(let v of data)out.push(v);out.push(...u32(crc32(check)));}
 let ihdr=new Uint8Array([...u32(w),...u32(h),8,3,0,0,0]);chunk("IHDR",ihdr);chunk("PLTE",plte);
 let trns=new Uint8Array(132);trns.fill(255);for(let id of Object.keys(PAL))trns[+id]=PAL[id][3];chunk("tRNS",trns);
 chunk("IDAT",deflate(raw,w+1));chunk("IEND",new Uint8Array(0));return Uint8Array.from(out);
}
function inflateFixed(z,size){if(z[0]!==0x78||z[1]!==0x01)throw Error("bad zlib");let ptr=2,bit=0;function get(n){let v=0;for(let i=0;i<n;i++){if(ptr>=z.length-4)throw Error("deflate EOF");v|=((z[ptr]>>bit)&1)<<i;bit++;if(bit===8){bit=0;ptr++;}}return v;}
 const lit=new Map(),dist=new Map();for(let i=0;i<=287;i++){let [v,n]=fcode(i);lit.set(n*1024+v,i);}for(let i=0;i<32;i++)dist.set(5*1024+rev(i,5),i);
 function dec(map,max){let val=0;for(let n=1;n<=max;n++){val|=get(1)<<(n-1);let r=map.get(n*1024+val);if(r!==undefined)return r;}throw Error("invalid fixed deflate symbol");}
 let out=new Uint8Array(size),pos=0,finished=false;while(!finished){let last=get(1),typ=get(2);if(typ!==1)throw Error("not fixed deflate");while(true){let sym=dec(lit,9);if(sym<256){if(pos>=size)throw Error("inflate overrun");out[pos++]=sym;continue;}if(sym===256)break;let j=sym-257;if(j<0||j>=LB.length)throw Error("bad len");let len=LB[j]+get(LE[j]),ds=dec(dist,5);if(ds>=DB.length)throw Error("bad dist");let d=DB[ds]+get(DE[ds]);if(d>pos||pos+len>size)throw Error("bad match");for(let k=0;k<len;k++){out[pos]=out[pos-d];pos++;}}finished=!!last;}
 if(pos!==size)throw Error("inflated size "+pos+" != "+size);let a=1,b=0;for(let i=0;i<size;i++){a+=out[i];b+=a;if((i&4095)===4095){a%=65521;b%=65521;}}a%=65521;b%=65521;let expected=((b<<16)|a)>>>0,got=((z[z.length-4]<<24)|(z[z.length-3]<<16)|(z[z.length-2]<<8)|z[z.length-1])>>>0;if(expected!==got)throw Error("adler mismatch");return out;}
function verifyPng(png,x,y,w,h){const signature=[137,80,78,71,13,10,26,10];for(let i=0;i<8;i++)if(png[i]!==signature[i])throw Error("PNG signature");let pos=8,idat=[],ended=false,palette=false,ihdr=false,chunks=0;
 while(pos<png.length){if(pos+12>png.length)throw Error("truncated PNG");let n=((png[pos]<<24)|(png[pos+1]<<16)|(png[pos+2]<<8)|png[pos+3])>>>0,ty=String.fromCharCode(...png.subarray(pos+4,pos+8));if(pos+12+n>png.length)throw Error("chunk overflow "+ty);let slice=png.subarray(pos+4,pos+8+n),got=((png[pos+8+n]<<24)|(png[pos+9+n]<<16)|(png[pos+10+n]<<8)|png[pos+11+n])>>>0;if(crc32(slice)!==got)throw Error("CRC "+ty);if(ty==="IHDR"){if(n!==13||png[pos+12]!==0){}let dw=((png[pos+8]<<24)|(png[pos+9]<<16)|(png[pos+10]<<8)|png[pos+11])>>>0,dh=((png[pos+12]<<24)|(png[pos+13]<<16)|(png[pos+14]<<8)|png[pos+15])>>>0;if(dw!==w||dh!==h||png[pos+16]!==8||png[pos+17]!==3)throw Error("bad IHDR");ihdr=true;}if(ty==="PLTE")palette=true;if(ty==="IDAT")idat.push(png.subarray(pos+8,pos+8+n));if(ty==="IEND"){if(n!==0||pos+12!==png.length)throw Error("bad IEND");ended=true;}chunks++;pos+=n+12;}
 if(!ended||!palette||!ihdr||idat.length!==1)throw Error("incomplete PNG");let raw=inflateFixed(idat[0],(w+1)*h);for(let yy=0;yy<h;yy++){let o=yy*(w+1);if(raw[o]!==0)throw Error("wrong filter");for(let xx=0;xx<w;xx++)if(raw[o+1+xx]!==grid[(y+yy)*W+x+xx])throw Error("PNG ID parity mismatch at "+xx+","+yy);}
 return{chunks,bytes:png.length,signature_crc_zlib_adler_iend:true,material_id_parity:true,dimensions:[w,h],crop_origin:[x,y]};}
let crops=[
 ["overview.png",0,0,W,H],
 ["01-crown-intake.png",110,53,800,390],
 ["02-counterweight-cathedral.png",108,390,812,470],
 ["03-ore-crusher-gallery.png",109,820,810,475],
 ["04-rail-funnel-transfer.png",110,1200,810,420],
 ["05-quench-salvage-terminal.png",105,1615,813,418]];
let images=[],imageChecks=[];for(let [name,x,y,w,h] of crops){let png=pngFromGrid(x,y,w,h);images.push({name,bytes:png});imageChecks.push({name,...verifyPng(png,x,y,w,h)});}
const gridSha=sha256(grid),setupSha=sha256(bytes(setupString));
const receipt={schema:"cybersand-original-industrial-vertical-qualification-v1",engine_accepted_main:ENGINE,creator:"original-industrial-vertical",originality:"original from authored plan; no source/reference image used",seed_decimal:SEED>>>0,extent:[W,H],cells:grid.length,nonempty:occupied,nonempty_materials:HIST,grid_sha256:gridSha,setup_sha256:setupSha,setup_bytes:bytes(setupString).length,edit_rectangles:edits.length,rectangle_budget_source:32768,default_no_bridge_capacity:4096,installed_bridge_capacity:"UNKNOWN - do not assert native load",edit_budget:32768,full_cell_replay:"PASS",edit_overlap_count:0,rectangle_work_estimate:work,generated_start_work_limit:Math.min(64*W*H,32000000),material_laws:"all structural materials Solid, non-movable, RuleKernel::None under recorded accepted main; water 3 contained in dedicated lower sump",flight_checks:flight,alternative_main_throat_block:{rect:[420,983,665,1006],terminal_reachable:true,reachable_centers:alt.count},sites:SITES,routes:ROUTES,image_checks:imageChecks,native_status:"NATIVE-UNTESTED: no CyberDemoBridge binary or Godot runtime supplied; dynamic inspect_interaction IDs, world install, Rapier input/collision, physics, fresh-process save/reopen unproven",approval:"DRAFT/HOLD - independent Shepherd and owner acceptance outstanding"};
const rec=JSON.stringify(receipt,null,2)+"\n";
let readme=[
"# Severed Counterweight | original industrial vertical canvas",
"",
"> DRAFT / HOLD. Original authored physical-cell design, not sourced from reference art. Engine native load and owner acceptance remain UNTESTED.",
"",
"**Creative thesis.** A once-balanced deep ore lift has snapped its eastern counterweight chain. A narrow steel skyline feeds a central offset flight spine; two service shafts provide long alternative ascents. The flyable traversals reveal five vertically distinct industrial districts, each with framed equipment and real crossover apertures rather than scenic panels.",
"",
"**Canvas:** 1024 x 2048 native material cells, exact. **Seed:** "+(SEED>>>0)+". **Accepted CyberSand main:** `"+ENGINE+"` (read-only authority). **Base:** `techrote/sandmapsreference` current main at branch creation.",
"",
"## Intended playable structure",
"",
"1. Sky intake (y 60-380): roof-level duct towers, landing bridge, crown signal and structural cross-brace.",
"2. Counterweight cathedral (y 380-815): a static hanging ore mass, cable/sheave banks, west winch room and eastern control desk.",
"3. Sorting / crushers (y 815-1200): tapering feed hoppers, ore assay, central exchange, paired material chutes.",
"4. Rail funnel (y 1200-1590): switch interlocks, transverse trusses and pressurization switchroom.",
"5. Quench and salvage (y 1590-2048): retrieval dock, heat-shield furnace, sealed cooling trough and bottom lift terminal.",
"",
"**Engineering semantics:** gantries, rail stops and counterweights are solid static architecture; the scene does not pretend these are animated machines. Every lateral aperture is cut through both structural and decorative paint. A left (x~205), right (x~800) and offset center spine offer multiple independent ways around the primary material obstructions. Continuous rock shoulders terminate the structural members.",
"",
"## Exact named sites",
"",
"| ID | Site | Exact (x,y) | District |",
"|---|---|---|---|",
...SITES.map(s=>"| "+s.id+" | "+s.name+" | ("+s.at.join(", ")+") | "+s.district+" |"),
"",
"## Route graph (flight)",
"",
"Central spine: "+ROUTES.central.map(p=>"("+p.join(",")+")").join(" -> ")+".",
"West shaft: "+ROUTES.west.map(p=>"("+p.join(",")+")").join(" -> ")+". East shaft: "+ROUTES.east.map(p=>"("+p.join(",")+")").join(" -> ")+".",
"Crossovers: "+ROUTES.crossovers.map(p=>p.map(v=>"("+v.join(",")+")").join(" - ")).join("; ")+".",
"Connectivity is proven from the **exact Midge spawn** to **each exact site** at 19x15, 23x19 and 31x27, with zero nearest-cell substitution; a separate 31x27 throat-block test verifies west/east bypass.",
"",
"## Artifact and reproducibility",
"",
"`build.cjs` is a fixed-seed, dependency-free Node.js builder. Run `node build.cjs` from any directory: it rebuilds `setup-severed-counterweight.json`, `qualification.json` and all full-resolution material-identity indexed PNGs in its own directory, then reopens/decodes every generated PNG in memory to check chunk CRC, zlib, Adler-32, IEND and per-cell ID parity. The source grid is reconstructed from hand-authored geometric primitives and exact route masks, never derived from a source image or compressed/reprojected reference PNG.",
"",
"**JSON format:** ordinary Workbench Setup-v2, not a fabricated generated-start receipt. Ordered, nonoverlapping, vertically coalesced rectangular edits exactly reconstruct the "+grid.length+" source cells. JSON bytes "+bytes(setupString).length+" / 1,048,576, "+edits.length+" rectangles / 32,768 source max, "+work+" painted cell writes in a "+Math.min(64*W*H,32000000)+" theoretical work envelope.",
"",
"**SHA-256 identity:** material grid `"+gridSha+"`; JSON `"+setupSha+"`.",
"",
"**Physically fixed materials:** `"+Object.entries(HIST).filter(([id,n])=>+id!==0&&+id!==3).map(([id,n])=>id+":"+n).join(" ")+"`. All are accepted-main Solid/non-movable/RuleKernel::None; only Water (3) is dynamic, within the walled lower quench basin. Visual metal pipes and LEDs are material cells, not sprite decals.",
"",
"**Render evidence:** `overview.png` is the complete 1024x2048 material map; the five numbered crops are native 1:1 unresampled windows of that *same cell grid*. These are palette-identity PNGs, **not** Godot screenshots, not AI concept art, and not a claim that the native renderer has been tested.",
"",
"## Qualification and limitations",
"",
"- Offline full grid, nonoverlap, exact replay, PNG structural/inflate/CRC and material-ID parity: PASS; see `qualification.json`.",
"- The source reader admits each extent component 512..2048 in multiples of 64, 32,768 stamps and 1 MiB JSON. `native_rectangle_budget()` may fall back to **4,096** without a bridge and otherwise asks the loaded compiled library, up to 32,768; our actual rectangle count must be compared to that installed capacity before loading.",
"- Midge pinned definition has a 4x3 rectangular hull; 19x15/23x19/31x27 are conservative inflated clearance envelopes, not dynamic flight guarantees.",
"- The source Setup-v2 validator uses live `CyberDemoBridge.inspect_interaction` to admit staged additional material IDs; absent the matching library, dynamic material admission is NOT verified.",
"- **NATIVE-UNTESTED:** no compatible Workbench runtime was available for loaded native `rectangles()`, actual world install, user input, collision, pressure/Water settle, rendering, save/reopen across a fresh OS process. Rebuild the matching GDExtension and run these gates before claiming compatibility.",
"- Quench fluid is statically contained in a reinforced basin; no time-evolved solver stability or leaks are claimed.",
"- Static lift sculptures are traversable architecture, not powered animated elevators.",
"- Draft/HOLD; independent fidelity and technical auditors, Shepherd and owner must review before status promotion.",
"",
"## Required owner native acceptance",
"",
"Use the engine SHA above. Rebuild/load the matching extension, query `CyberDemoBridge.workbench_start_rectangle_capacity`, run Setup.validate/rectangles, install the canvas, compare native material identities and render, pilot Midge to all named destinations, test loops and alternate approach, run the water simulation, save a uniquely named start, quit and reopen in a clean process, compare material and actor state. Refuse, do not degrade, if a capacity/policy/material check fails.",
"",
"## Originality and ownership",
"",
"Created solely for the `original/industrial-vertical` lane in `techrote/sandmapsreference`. No existing canvas, GitHub image, reference artwork, PR branch or CyberSand source was altered. Source files in `techrote/cybersand` were inspected only for schema/material/actor technical admission.",
"",
"**Completion marker:** `ORIGINAL-CANVAS-INDUSTRIAL-VERTICAL: <current-head-sha>` (replace placeholder with actual PR HEAD in PR description).",
""
].join("\n");
const data=[{name:"setup-severed-counterweight.json",text:setupString+"\n"},{name:"qualification.json",text:rec},{name:"README.md",text:readme},...images];
return{root:ROOT,data,metrics:{edits:edits.length,setupBytes:bytes(setupString).length,gridSha,setupSha,materialHistogram:HIST,images:imageChecks,flight:flight.map(v=>({footprint:v.footprint,reachable:v.reachable_sites,centers:v.reachable_centers})),alternativeCenters:alt.count}};
};
if(typeof module!=='undefined') module.exports=build;
if(typeof require!=='undefined'&&typeof module!=='undefined'&&require.main===module){const fs=require('node:fs'),path=require('node:path');const output=build();for(const item of output.data){const dest=path.join(__dirname,item.name);fs.writeFileSync(dest,item.bytes?Buffer.from(item.bytes):item.text);}console.log(JSON.stringify(output.metrics,null,2));}
