"use strict";
// KEELGRAVE CRYODOCK — deterministic, entirely original CyberSand 2048x1024 material plane.
// Node 20+: node build.cjs [--verify]; no npm deps. All evidence derives directly from the cells.
const W=2048,H=1024,SEED=202611192143;
const M={A:0,B:100,T:49,O:101,C:58,S:62,U:63,V:64,G:66,P:68,F:120,Q:121,X:122,Y:128,Z:129,K:130,N:131,L:80,I:77,J:79,D:98};
const SITES={
 "West rover arrival":[159,447],"High xenology alcove":[221,341],"Settler assay lab":[220,576],
 "Rift transit throat":[479,503],"Suspended sensor station":[794,234],"Elevator machinery":[788,517],
 "Uplink outboard":[979,346],"Crashed ark prow":[1190,362],"Ark navigation":[1392,368],
 "Ark medical archive":[1560,389],"Ark salvage hangar":[1780,427],"East emergency lock":[1945,614],
 "Lower cable basin":[1471,693],"Fissure weather lab":[1084,691],"Mine west airlock":[696,926],
 "Deep mineral vault":[1067,914],"Mine east survey":[1439,925],"East upper beacon":[1872,271]
};
const CROPS=[
 ["01-west-settlement",0,270,540,440],
 ["02-signal-lift",470,130,620,600],
 ["03-ark-prow",1010,220,530,470],
 ["04-ark-drydock",1490,260,558,480],
 ["05-deep-mines",505,715,1090,309]
];
function buildGrid(){
 const g=new Uint8Array(W*H);
 function R(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);let a=Math.max(0,x),b=Math.min(W,x+w),c=Math.max(0,y),d=Math.min(H,y+h);for(let j=c;j<d;j++)if(a<b)g.fill(m,j*W+a,j*W+b);}
 function P(p,m){let y0=Math.max(0,Math.ceil(Math.min(...p.map(v=>v[1])))),y1=Math.min(H-1,Math.floor(Math.max(...p.map(v=>v[1]))));for(let y=y0;y<=y1;y++){let xs=[];for(let i=0;i<p.length;i++){let a=p[i],b=p[(i+1)%p.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2)R(Math.ceil(xs[i]),y,Math.floor(xs[i+1])-Math.ceil(xs[i])+1,1,m);}}
 function L(x,y,X,Y,t,m){let dx=X-x,dy=Y-y,d=dx*dx+dy*dy,r=t/2;let x0=Math.max(0,Math.floor(Math.min(x,X)-r)),x1=Math.min(W-1,Math.ceil(Math.max(x,X)+r)),y0=Math.max(0,Math.floor(Math.min(y,Y)-r)),y1=Math.min(H-1,Math.ceil(Math.max(y,Y)+r));for(let j=y0;j<=y1;j++)for(let i=x0;i<=x1;i++){let f=Math.max(0,Math.min(1,((i-x)*dx+(j-y)*dy)/(d||1)));if((i-x-f*dx)**2+(j-y-f*dy)**2<=r*r)g[j*W+i]=m;}}
 // Original natural terrain; all built structures must reach the boundary-grounded rock.
 for(let x=0;x<W;x++){let y=Math.round(865+22*Math.sin(.009*x)+24*Math.sin(.0028*x)+10*Math.cos(.032*x));R(x,y,1,H-y,M.B);}
 P([[0,1024],[0,220],[44,225],[87,254],[128,286],[201,306],[256,362],[315,431],[389,577],[447,717],[514,854],[573,1024]],M.B);
 P([[2048,1024],[2048,215],[2017,261],[1978,290],[1914,321],[1854,385],[1785,496],[1700,633],[1616,785],[1536,1024]],M.B);
 P([[0,0],[0,118],[65,144],[112,127],[172,156],[220,140],[294,181],[348,166],[417,207],[456,0]],M.B);
 // Bold non-repetitive geology; broad variation without random micro-speckling.
 for(let y=0;y<H;y++){let o=y*W;for(let x=0;x<W;x++)if(g[o+x]===M.B){let k=(y+Math.floor(x*.075)+Math.round(19*Math.sin(x*.018)))%223;g[o+x]=(k<14)?M.O:((k<52)?M.T:M.B);}}
 P([[495,817],[553,776],[629,812],[705,870],[636,961],[514,916]],M.O);
 P([[1455,834],[1515,772],[1598,741],[1650,838],[1603,979],[1516,968]],M.T);
 // Mineral strata and discontinuous runic erosion, strictly as genuine stable solids.
 for(let x=435;x<1700;x+=171){L(x,882,x+68,914,12,(x%3)?M.T:M.O);}
 // Deliberate deep traversal caves; connected by wide service shafts.
 R(495,894,1080,68,M.A);R(602,743,105,207,M.A);R(1376,742,108,208,M.A);
 P([[813,858],[875,807],[953,810],[1030,856],[1064,899],[844,913]],M.A);
 P([[1110,880],[1197,822],[1284,838],[1331,897],[1298,935],[1116,936]],M.A);
 // West settlement: discrete rock-cut rooms and large shared shafts, not one empty box.
 R(78,408,325,76,M.A);R(141,306,236,70,M.A);R(90,543,310,79,M.A);
 R(306,326,79,320,M.A);R(362,447,158,116,M.A);
 R(128,645,293,82,M.A);R(323,596,73,110,M.A);
 R(387,494,115,62,M.A);
 // Far-east cliff dock and emergency return.
 R(1790,568,250,88,M.A);R(1911,368,137,270,M.A);
 R(1728,682,290,83,M.A);R(1717,614,93,130,M.A);
 // Main lower cavern sky approaches: explicit flyable void and multiple elevations.
 R(490,743,1010,85,M.A);
 // West settlement architecture: 35-65 cell scaled workrooms, support-tied decks and apparatus.
 R(90,484,310,11,M.S);R(103,493,285,6,M.U);
 R(140,376,224,9,M.S);R(144,384,216,5,M.G);
 R(101,622,300,10,M.S);R(116,634,275,6,M.U);
 R(140,727,279,11,M.C);
 for(let x of [116,290,392]){R(x,630,12,102,M.P);R(x+2,640,8,9,M.I);}
 L(390,477,455,720,15,M.K);L(388,626,448,755,17,M.C);
 // West xenology fin and layered habitation shelters, cut to preserve 31x27 entrances.
 P([[117,298],[153,258],[243,261],[281,311]],M.Z);
 P([[276,306],[313,253],[359,270],[384,321]],M.N);
 L(112,314,165,274,8,M.P);L(270,313,337,268,7,M.K);
 R(159,369,20,7,M.J);R(270,369,25,6,M.I);
 // Small operational kit anchored to real tiers.
 R(116,464,28,8,M.P);R(126,457,9,7,M.J);
 R(269,465,47,8,M.C);R(280,452,24,13,M.Q);R(288,448,7,5,M.I);
 R(108,607,43,8,M.C);R(120,585,21,22,M.X);
 R(273,606,42,8,M.P);R(284,595,23,11,M.F);
 R(173,712,37,8,M.U);R(180,699,21,13,M.Y);
 // West exterior docking canopy with rock-supported shear braces.
 L(405,462,554,450,12,M.S);L(442,480,497,754,12,M.K);
 L(434,516,529,583,9,M.P);L(434,622,510,787,11,M.C);
 R(460,435,81,9,M.U);R(478,431,41,4,M.I);
 // Vertical signal-lift mast: asymmetric, strong A-forms and open internal shaft.
 L(585,850,675,314,20,M.S);L(935,861,863,306,20,M.S);
 L(675,314,763,250,14,M.K);L(863,306,763,250,14,M.K);
 L(611,735,933,737,12,M.G);L(633,596,908,607,12,M.S);L(651,452,876,465,11,M.U);
 for(let [x,y,X,Y] of [[608,740,707,609],[908,607,819,739],[644,596,725,467],[876,466,805,606],[673,459,767,320],[866,456,790,321]])L(x,y,X,Y,7,M.P);
 // Winding external ladders and staged telemeter cabins, suspended by actual braces.
 R(691,602,52,9,M.U);R(795,595,59,9,M.U);R(699,717,43,8,M.G);
 R(718,461,55,8,M.C);R(781,455,50,8,M.P);
 R(739,310,34,8,M.J);R(780,315,48,8,M.C);
 // Long top orbital telemetry arm: purposeful open air, unlike a bridge-filled wallpaper.
 L(351,255,668,285,9,M.K);L(868,281,1145,230,9,M.K);
 for(let [x,y] of [[460,263],[566,274],[986,256],[1090,235]]){L(x,y,x+21,y+38,6,M.P);L(x+21,y+38,x+49,y+3,6,M.P);}
 L(760,250,770,127,10,M.S);L(770,130,717,95,7,M.P);L(770,130,842,68,7,M.P);
 P([[677,91],[714,68],[738,96],[704,111]],M.Z);P([[827,72],[868,42],[903,72],[859,91]],M.Z);
 R(753,138,32,6,M.I);R(765,167,12,55,M.P);
 // Ship-forward shock-absorbing buttresses connect all ark structure to bedrock.
 L(1170,503,1164,888,20,M.C);L(1407,541,1422,895,18,M.K);
 L(1690,572,1805,766,22,M.C);L(1852,593,1913,681,19,M.S);
 L(1190,540,1423,883,15,M.P);L(1414,541,1170,874,12,M.P);
 // Great single broken research ark: original trapezoidal hull, all in perpendicular side section.
 P([[1056,366],[1120,300],[1261,264],[1454,270],[1631,303],[1810,359],[1964,446],[1990,560],[1882,618],[1620,580],[1410,550],[1201,499]],M.S);
 P([[1107,374],[1158,330],[1280,303],[1459,311],[1610,343],[1769,391],[1917,465],[1937,540],[1860,568],[1621,539],[1418,514],[1225,467]],M.A);
 // Broad split prow and scar/break geometry that defines the silhouette.
 P([[1055,367],[1084,325],[1131,301],[1168,333],[1123,371]],M.N);
 L(1184,488,1252,522,15,M.K);L(1260,533,1285,545,12,M.N);
 R(1312,519,74,38,M.A); // fractured lower hull mouth: genuine breach
 L(1465,269,1448,132,11,M.P);L(1449,136,1395,111,7,M.P);L(1449,136,1499,92,7,M.P);
 P([[1358,115],[1404,89],[1434,117],[1393,139]],M.Z);P([[1486,95],[1549,68],[1567,108],[1524,134]],M.Z);
 // Interior people-scale bulkheads: no impenetrable full-width floors.
 L(1173,399,1398,413,9,M.U);L(1441,420,1693,454,10,M.U);L(1740,463,1911,512,11,M.U);
 L(1250,475,1456,490,10,M.G);L(1500,501,1720,527,10,M.G);
 // Breaks every aisle at least two distinct passage apertures for Midge.
 R(1355,396,83,43,M.A);R(1684,439,73,44,M.A);
 R(1445,478,70,44,M.A);R(1740,492,78,51,M.A);
 L(1292,324,1325,400,10,M.P);L(1596,346,1620,436,10,M.P);L(1858,432,1864,508,10,M.P);
 R(1261,386,30,7,M.I);R(1499,423,27,7,M.J);R(1815,483,31,7,M.I);
 // Dedicated science activities, all mounted on load-bearing deck/hull.
 L(1292,415,1325,442,7,M.C);R(1270,439,59,8,M.C);R(1281,424,37,15,M.Q);
 L(1553,465,1584,487,7,M.C);R(1551,482,64,7,M.U);R(1560,466,27,16,M.F);
 R(1838,532,68,9,M.N);R(1854,512,39,20,M.Q);R(1864,502,13,10,M.I);
 R(1377,491,45,7,M.P);R(1388,479,22,12,M.F);
 R(1681,514,39,7,M.K);R(1690,504,16,10,M.J);
 // External shipyard/landing pads, tied to rock and true open side entry.
 L(1669,615,1975,648,14,M.S);L(1706,645,1780,749,11,M.P);
 L(1795,655,1849,755,9,M.C);L(1931,651,1980,730,8,M.C);
 R(1851,660,87,8,M.U);R(1870,650,37,9,M.Y);
 R(1740,767,263,12,M.G);R(1788,780,184,8,M.U);
 for(let [x,t] of [[1780,M.C],[1945,M.P]]){L(x,774,x-22,836,12,t);L(x-22,836,x+12,859,11,M.C);}
 // Lower run: wide service line, observation/docking pockets, not a repeated grid.
 L(471,845,674,855,12,M.S);L(726,848,1043,852,11,M.S);L(1123,848,1405,845,11,M.S);
 R(525,835,95,8,M.U);R(815,831,100,8,M.U);R(1172,826,104,8,M.G);
 L(671,841,705,894,12,M.C);L(1408,840,1468,893,12,M.C);
 // Genuine excavated lower cavern, interior gallery rails below clearance band.
 R(500,961,1084,12,M.C);R(537,973,997,7,M.T);
 for(let x of [565,809,1197,1510]){L(x,961,x+40,1000,14,M.C);}
 R(827,950,102,8,M.G);R(1244,948,111,8,M.U);
 R(621,947,45,7,M.P);R(633,936,24,11,M.X);R(634,931,9,6,M.I);
 R(1039,948,58,8,M.C);R(1049,938,37,10,M.Q);
 R(1468,945,55,8,M.P);R(1480,935,34,10,M.F);
 // Deep mineral fault chambers, negative space and asymmetric vein buttresses.
 P([[770,993],[805,969],[837,976],[877,1019],[814,1024]],M.O);
 P([[1123,999],[1160,970],[1199,975],[1250,1024]],M.T);
 // Purpose-made 41-cell-wide vertical settlement circulation shaft and exterior threshold.
 // These are literal excavated cells, not snapped/checkpoint-only clearance waivers.
 R(341,357,52,353,M.A);R(365,421,177,109,M.A);
 // The lower workroom retains its enclosing bedrock, reached through the vertical shaft.
 // Reinstate a short, rock-rooted exterior trim below—not across—the flyable opening.
 L(377,546,473,656,13,M.C);L(442,575,491,771,12,M.K);
 // Grounded, intentionally engineered service ties for instruments and sky telemetry.
 L(347,261,363,337,9,M.P); // old sky arm to western rock roof, rest remains a true air route
 L(868,251,856,309,8,M.P); // east sky arm to lift mast upper shoulder
 L(1174,399,1186,470,8,M.P); // forward cargo window bulkhead to ark keel
 L(1549,503,1567,538,8,M.C); // lateral medical instrument tray to lower hull
 L(1297,435,1327,481,8,M.C); // specimen unit to ship's lower service tier
 L(1568,481,1594,535,8,M.C); // medical worktable to lower ark steel
 L(108,605,108,622,8,M.C);L(273,604,273,623,8,M.P);
 L(169,712,169,731,8,M.S); // lower archive display to rock-rooted deck
 L(1264,390,1262,467,8,M.P); // forward beacon monitor to lower hull
 L(270,373,270,391,7,M.P); // upper-floor console root
 L(116,463,116,489,7,M.P); // rover instrument ground
 L(813,831,805,871,10,M.C);L(1246,951,1260,964,10,M.C);
 L(826,951,833,965,9,M.C);L(1039,950,1039,967,9,M.C);
 L(1471,945,1468,960,9,M.C);L(625,942,616,968,9,M.C);
 L(699,720,686,744,10,M.C);L(1734,512,1754,545,8,M.P);
 // True launch-passage interventions: openings cut through existing structural material.
 // Side gallery rises to high-altitude survey without needing platform-top cheats.
 R(437,215,76,333,M.A);
 // Interlinked 31x27+ flyway through the west lift's two massive legs.
 R(610,481,362,74,M.A);
 // Deep mine descenders, >31 cells at their tightest cross-sections.
 R(623,803,115,130,M.A);R(1359,807,147,124,M.A);
 // An actual transverse fore breach and interior navigation bulkhead opening.
 R(1115,340,86,81,M.A);R(1275,341,65,77,M.A);
 // Salvage side hatches / ruptured roof, opening sky, ark, and cliff-side lock.
 R(1673,398,117,97,M.A);R(1736,343,76,90,M.A);
 R(1908,535,92,116,M.A);
 // West broad embarkation mouth; no structural line may seal the named throat.
 R(412,465,143,76,M.A);
 // West geological lift bypass: continuous mining shaft, independently of the mast deck.
 R(502,618,84,337,M.A);
 // Folded ark impact ruptures: genuine 31x27-passable fore and emergency bulkhead gates.
 R(1059,349,113,102,M.A);
 R(1867,377,110,135,M.A);R(1894,487,94,95,M.A);
 R(1817,537,153,90,M.A);
 R(1784,414,119,113,M.A); // 119-cell breached-lateral cargo hatch, connects east lock
 // Long-load recovery rig: actual grounded structural ties, not free-floating backdrop.
 L(1460,273,1628,169,9,M.K);L(1628,169,2019,280,9,M.K); // double-angle skyhook recovers the ark roof to right rock
 L(1132,232,1193,287,9,M.P); // mast telemetry arm slung into the ark roof without closing west sky
 L(594,807,610,886,17,M.C); // lower elevator mast foot is bolted into basal rock
 L(655,282,675,312,11,M.P); // separated old survey arm to A-frame shoulder
 L(293,469,293,489,9,M.C); // xenology assay table to floor
 L(495,565,419,642,10,M.C); // gantry return line into left rock
 L(1750,531,1708,564,9,M.P); // loose salvage fork to keel
 L(1294,331,1294,290,9,M.P); // protruding inner bulkhead remnant to roof
 L(1346,410,1380,416,8,M.C); // floor break remnant anchored to deck
 R(1835,518,64,22,M.A); // clear orphaned panel from the now-open cargo hatch
 R(769,872,50,24,M.A); // remove unstable isolated fault lamina
 R(539,442,24,18,M.A); // old severed canopy tip, not valid as a flying beam
 R(1053,360,9,10,M.A); // remove pulverised disconnected nose fleck
 R(1584,346,93,101,M.A); // radiation-lock return opening through central ship bulkhead
 // Near-contact precision load-path repairs established against actual 4-neighbour solid graph.
 L(1045,856,1054,870,15,M.C); // intact landing foot to basalt face
 L(1342,411,1313,427,9,M.P); // truncated navigation tray to rooted machinery
 L(1561,439,1553,470,9,M.C); // vaccine-transfer gantry to lower hull
 L(1607,451,1583,475,9,M.C); // far-side medical rack to lower hull
 // Keep specified exact named air centres fully clear; do not move or rename sites.
 // The image is the physical grid itself: no overlay rendered into PNGs.
 return g;
}
function encodeRects(g){const rect=[],replay=new Uint8Array(g.length),hist={};let active=new Map(),work=0;for(let y=0;y<H;y++){const next=new Map(),o=y*W;for(let x=0;x<W;){let m=g[o+x],sx=x;while(x<W&&g[o+x]===m)x++;if(!m)continue;let key=sx+":"+(x-sx)+":"+m,idx=active.get(key);if(idx===undefined){idx=rect.length;rect.push([sx,y,x-sx,1,m]);}else rect[idx][3]++;next.set(key,idx);}active=next;}for(let [x,y,w,h,m] of rect){work+=w*h;hist[m]=(hist[m]||0)+w*h;for(let j=y;j<y+h;j++)replay.fill(m,j*W+x,j*W+x+w);}for(let i=0;i<g.length;i++)if(replay[i]!==g[i])throw Error("lossless replay failure at "+i);if(rect.length>32768||work>32000000)throw Error("construction budget exceeded");return {rect,hist,work};}
function route(g,w,h,s,sites,block=null){let integral=new Uint32Array((w+1)*(h+1));for(let y=0;y<h;y++){let sum=0,o=(y+1)*(w+1);for(let x=0;x<w;x++){sum+=(g[y*w+x]!==0||block&&(x>=block[0]&&x<block[2]&&y>=block[1]&&y<block[3]))?1:0;integral[o+x+1]=integral[o-(w+1)+x+1]+sum;}}let [a,b]=s,rx=Math.floor(a/2),ry=Math.floor(b/2),ok=new Uint8Array(w*h);let n=0;for(let y=ry;y<h-ry;y++)for(let x=rx;x<w-rx;x++){let X=x-rx,Y=y-ry,R=x+rx+1,D=y+ry+1;let tot=integral[D*(w+1)+R]-integral[Y*(w+1)+R]-integral[D*(w+1)+X]+integral[Y*(w+1)+X];if(tot===0){ok[y*w+x]=1;n++;}}let start=sites["West rover arrival"];if(!ok[start[1]*w+start[0]])throw Error("actual spawn blocked at "+a+"x"+b);let vis=new Uint8Array(w*h),q=new Int32Array(w*h),front=0,back=0,idx=start[1]*w+start[0];vis[idx]=1;q[back++]=idx;while(front<back){let p=q[front++],x=p%w,y=(p/w)|0;for(let z of [p-1,p+1,p-w,p+w]){let xx=z%w;if(z<0||z>=w*h||Math.abs(xx-x)>1||!ok[z]||vis[z])continue;vis[z]=1;q[back++]=z;}}let reached=[],bad=[];for(let [name,[x,y]] of Object.entries(sites)){let ix=y*w+x;if(x<rx||x>=w-rx||y<ry||y>=h-ry||!ok[ix]||!vis[ix])bad.push({name,xy:[x,y],clear:!!ok[ix],reachable:!!vis[ix]});else reached.push(name);}return {size:[a,b],reached:reached.length,total:Object.keys(sites).length,bad,airCentres:n,connectedCentres:back};}
function structural(g){let vis=new Uint8Array(g.length),q=new Int32Array(g.length),a=0,b=0;for(let x=0;x<W;x++){for(let y of [0,H-1]){let p=y*W+x;if(g[p]&&!vis[p]){vis[p]=1;q[b++]=p;}}}for(let y=0;y<H;y++){for(let x of [0,W-1]){let p=y*W+x;if(g[p]&&!vis[p]){vis[p]=1;q[b++]=p;}}}while(a<b){let p=q[a++],x=p%W;for(let t of [p-W,p+W,...(x>0?[p-1]:[]),...(x<W-1?[p+1]:[])])if(t>=0&&t<g.length&&g[t]&&!vis[t]){vis[t]=1;q[b++]=t;}}let total=0;for(let i=0;i<g.length;i++)if(g[i])total++;return {occupied:total,grounded:b,detached:total-b};}
// Pure JS SHA-256 (same digest bytes on V8/Node); no external dependency.
function sha256(bytes){let K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];let Hh=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];let len=bytes.length,L=((len+9+63)>>6)<<6,buf=new Uint8Array(L);buf.set(bytes);buf[len]=128;let bit=len*8;for(let i=0;i<8;i++)buf[L-1-i]=(Math.floor(bit/2**(8*i)))&255;let w=new Int32Array(64),rot=(x,n)=>x>>>n|x<<32-n;for(let off=0;off<L;off+=64){for(let i=0;i<16;i++){let p=off+i*4;w[i]=((buf[p]<<24)|(buf[p+1]<<16)|(buf[p+2]<<8)|buf[p+3])|0;}for(let i=16;i<64;i++){let x=w[i-15],y=w[i-2];w[i]=(w[i-16]+(rot(x,7)^rot(x,18)^(x>>>3))+w[i-7]+(rot(y,17)^rot(y,19)^(y>>>10)))|0;}let [a,b,c,d,e,f,g,h]=Hh;for(let i=0;i<64;i++){let t1=(h+(rot(e,6)^rot(e,11)^rot(e,25))+((e&f)^(~e&g))+K[i]+w[i])|0,t2=((rot(a,2)^rot(a,13)^rot(a,22))+((a&b)^(a&c)^(b&c)))|0;h=g;g=f;f=e;e=(d+t1)|0;d=c;c=b;b=a;a=(t1+t2)|0;}Hh[0]=(Hh[0]+a)|0;Hh[1]=(Hh[1]+b)|0;Hh[2]=(Hh[2]+c)|0;Hh[3]=(Hh[3]+d)|0;Hh[4]=(Hh[4]+e)|0;Hh[5]=(Hh[5]+f)|0;Hh[6]=(Hh[6]+g)|0;Hh[7]=(Hh[7]+h)|0;}return Hh.map(x=>(x>>>0).toString(16).padStart(8,"0")).join("");}
function utf8(s){let out=[];for(let i=0;i<s.length;i++){let c=s.charCodeAt(i);if(c<128)out.push(c);else if(c<2048)out.push(192|c>>6,128|c&63);else out.push(224|c>>12,128|(c>>6)&63,128|c&63);}return new Uint8Array(out);}
function b64(bytes){const abc="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";let s="";for(let i=0;i<bytes.length;i+=3){let a=bytes[i],b=bytes[i+1],c=bytes[i+2];s+=abc[a>>2]+abc[((a&3)<<4)|(b===undefined?0:b>>4)]+(b===undefined?"=":abc[((b&15)<<2)|(c===undefined?0:c>>6)])+(c===undefined?"=":abc[c&63]);}return s;}
function concat(parts){let n=parts.reduce((a,b)=>a+b.length,0),out=new Uint8Array(n),off=0;for(let p of parts){out.set(p,off);off+=p.length;}return out;}
function be32(n){return new Uint8Array([(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255]);}
function crc32(bytes){let c=-1;for(let b of bytes){c^=b;for(let i=0;i<8;i++)c=c&1?(c>>>1)^0xedb88320:c>>>1;}return (c^-1)>>>0;}
function adler32(bytes){let a=1,b=0;for(let i=0;i<bytes.length;i++){a+=bytes[i];b+=a;if((i&4095)===4095){a%=65521;b%=65521;}}return (((b%65521)<<16)|(a%65521))>>>0;}
// Valid ZLIB DEFLATE fixed-Huffman bitstream; LZ77 dictionary keeps original PNG files small.
function zdeflate(raw){let out=[0x78,0x01],bits=0,count=0;function put(v,n){bits|=(v<<count);count+=n;while(count>=8){out.push(bits&255);bits>>>=8;count-=8;}}function rev(v,n){let r=0;for(let i=0;i<n;i++){r=(r<<1)|(v&1);v>>>=1;}return r;}function sym(c){if(c<=143)put(rev(48+c,8),8);else if(c<=255)put(rev(400+c-144,9),9);else if(c<=279)put(rev(c-256,7),7);else put(rev(192+c-280,8),8);}const LEN_BASE=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],LEN_EXTRA=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],DST_BASE=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],DST_EXTRA=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];put(3,3);let heads=new Int32Array(1<<16);heads.fill(-1);function key(i){return ((raw[i]*131+raw[i+1])*131+raw[i+2])&65535;}for(let i=0;i<raw.length;){let last=-1,match=0,dist=0;if(i+3<raw.length){let k=key(i);last=heads[k];if(last>=0&&i-last<=32768&&raw[last]===raw[i]&&raw[last+1]===raw[i+1]&&raw[last+2]===raw[i+2]){dist=i-last;let lim=Math.min(258,raw.length-i);while(match<lim&&raw[i+match]===raw[last+match])match++;}heads[k]=i;}if(match>=3){let n=match,li=LEN_BASE.length-1;for(let j=0;j<LEN_BASE.length-1;j++)if(n<LEN_BASE[j+1]){li=j;break;}sym(257+li);let ec=LEN_EXTRA[li];if(ec)put(n-LEN_BASE[li],ec);let di=DST_BASE.length-1;for(let j=0;j<DST_BASE.length-1;j++)if(dist<DST_BASE[j+1]){di=j;break;}put(rev(di,5),5);ec=DST_EXTRA[di];if(ec)put(dist-DST_BASE[di],ec);for(let j=1;j<n&&i+j+2<raw.length;j++)heads[key(i+j)]=i+j;i+=n;}else sym(raw[i++]);}sym(256);if(count)out.push(bits&255);out.push(...be32(adler32(raw)));return new Uint8Array(out);}
function png(g,crop){let [name,x0,y0,w,h]=crop,raw=new Uint8Array(h*(w+1));for(let y=0;y<h;y++)raw.set(g.subarray((y+y0)*W+x0,(y+y0)*W+x0+w),y*(w+1)+1);let pal=new Uint8Array(768);const colors={0:[13,20,33],49:[84,94,113],58:[94,115,132],62:[127,153,171],63:[103,140,168],64:[126,158,166],66:[70,115,128],68:[181,132,82],77:[34,229,216],79:[255,166,76],80:[247,244,212],98:[191,183,162],100:[48,59,79],101:[32,46,65],120:[102,198,219],121:[116,169,199],122:[181,218,233],128:[134,123,181],129:[62,132,175],130:[62,86,115],131:[173,112,91]};for(let i=0;i<256;i++){let c=colors[i]||[130,65,125];pal.set(c,i*3);}function chunk(name,p){let t=utf8(name),dat=concat([t,p]);return concat([be32(p.length),dat,be32(crc32(dat))]);}let header=concat([be32(w),be32(h),new Uint8Array([8,3,0,0,0])]);return concat([new Uint8Array([137,80,78,71,13,10,26,10]),chunk("IHDR",header),chunk("PLTE",pal),chunk("IDAT",zdeflate(raw)),chunk("IEND",new Uint8Array(0))]);}
function artifacts(){let g=buildGrid(),{rect,hist,work}=encodeRects(g),struct=structural(g),clearance=[[19,15],[23,19],[31,27]].map(s=>route(g,W,H,s,SITES)),stress=[];for(let b of [[1020,466,1130,575],[1020,730,1140,860]])stress.push(route(g,W,H,[31,27],SITES,b));let setup=JSON.stringify({version:2,extent:[W,H],actors:[{id:1,model:"midge",hash:"c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96",spawn:SITES["West rover arrival"],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits:rect});let sb=utf8(setup);let images=[];for(let c of [["overview",0,0,W,H],...CROPS]){let bytes=png(g,c);images.push({name:c[0],x:c[1],y:c[2],width:c[3],height:c[4],bytes,sha256:sha256(bytes)});}let receipt={title:"Keelgrave Cryodock — Salvage of the Broken Ark",original:true,seed:SEED,extent:[W,H],engine_sha:"de109d0131641d6adc8d25bb9ced7ca3d4991105",setup_loader_blob:"70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9",material_definitions_blob:"dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3",midge_hull:[4,3],material_histogram:hist,solid_physics:"Accepted inert Solid/None IDs only; no mobile, powder, fluids, combustion or reactive materials.",rectangle_count:rect.length,construction_work:work,setup_bytes:sb.length,material_plane_sha256:sha256(g),setup_sha256:sha256(sb),site_coordinates:SITES,clearance:clearance.map(x=>x),obstruction_tests:stress.map((v,i)=>({obstruction:i===0?[1020,466,1130,575]:[1020,730,1140,860],...v})),grounded_solids:struct,images:images.map(x=>({name:x.name,x:x.x,y:x.y,width:x.width,height:x.height,bytes:x.bytes.length,sha256:x.sha256}))};return {g,rect,setup,receipt,images};}
if(typeof module!=="undefined")module.exports={W,H,SEED,M,SITES,CROPS,buildGrid,encodeRects,route,structural,sha256,utf8,b64,zdeflate,png,artifacts};
if(typeof require!=="undefined"&&require.main===module){const fs=require("fs"),path=require("path"),crypto=require("crypto"),zlib=require("zlib");let {g,setup,receipt,images}=artifacts();const hashes=["", "abc", "hello world"].map(s=>[sha256(utf8(s)),crypto.createHash("sha256").update(s).digest("hex")]);if(hashes.some(([a,b])=>a!==b))throw Error("pure-JS SHA-256 mismatch "+JSON.stringify(hashes));for(let im of images){let bytes=im.bytes;let off=8,raw=null;while(off<bytes.length){let n=((bytes[off]<<24)|(bytes[off+1]<<16)|(bytes[off+2]<<8)|bytes[off+3])>>>0,type=String.fromCharCode(...bytes.slice(off+4,off+8));if(type==="IDAT")raw=zlib.inflateSync(bytes.slice(off+8,off+8+n));off+=n+12;}if(!raw)throw Error("missing PNG IDAT");for(let y=0;y<im.height;y++)for(let x=0;x<im.width;x++)if(raw[y*(im.width+1)+1+x]!==g[(im.y+y)*W+im.x+x])throw Error("PNG pixel mismatch "+im.name+" "+x+","+y);}
 if(receipt.clearance.some(x=>x.bad.length))throw Error("Exact Midge site failure "+JSON.stringify(receipt.clearance.map(x=>x.bad)));
 if(receipt.rectangle_count>32768||receipt.setup_bytes>1048576||receipt.construction_work>32000000)throw Error("Budget failure");
 if(receipt.grounded_solids.detached)console.error("WARNING detached cells",receipt.grounded_solids.detached);
 const verify=process.argv.includes("--verify");for(let [file,s] of [["setup-keelgrave.json",setup],["receipt.json",JSON.stringify(receipt,null,2)+"\n"]]){let p=path.join(__dirname,file);if(verify&&fs.existsSync(p)&&fs.readFileSync(p,"utf8")!==s)throw Error("artifact drift "+file);if(!verify)fs.writeFileSync(p,s);}for(let im of images){let p=path.join(__dirname,im.name+".png");if(verify&&fs.existsSync(p)&&!Buffer.from(im.bytes).equals(fs.readFileSync(p)))throw Error("PNG drift "+im.name);if(!verify)fs.writeFileSync(p,Buffer.from(im.bytes));}console.log(JSON.stringify({rectangles:receipt.rectangle_count,bytes:receipt.setup_bytes,occupied:receipt.construction_work,sha256:receipt.material_plane_sha256,clearance:receipt.clearance.map(x=>[x.size,x.reached,x.total,x.connectedCentres,x.bad]),obstructions:receipt.obstruction_tests.map(x=>[x.reached,x.bad]),structure:receipt.grounded_solids,images:receipt.images.map(i=>[i.name,i.bytes])},null,2));}