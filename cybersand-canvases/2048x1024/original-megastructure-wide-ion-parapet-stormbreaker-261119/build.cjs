'use strict';
// ORIGINAL independently authored 2048x1024 CyberSand Setup-v2 world: The Ion Parapet.
// No reference artwork; seed 0x19b260. RUN: node build.cjs
const fs=require('fs'),zlib=require('zlib'),crypto=require('crypto'),path=require('path');
const W=2048,H=1024,SEED=0x19b260;
const M={E:0,CON:58,STEEL:62,PAINT:63,CORR:64,RUST:65,GRATE:66,PIPE:68,COP:69,TILE:70,GLASS:72,CABLE:74,INS:75,HAZ:76,CYAN:77,MAG:78,AMBER:79,WHITE:80,BAS:100,OBS:101,TERR:111,AL:114,BRASS:119,GLASSB:120,CARB:130,HEAT:131};
const NAMES={0:'Empty',58:'ReinforcedConcrete',62:'SteelPlate',63:'PaintedSteel',64:'CorrugatedSteel',65:'RustedSteel',66:'SteelGrating',68:'SteelPipe',69:'CopperPipe',70:'CeramicTile',72:'DarkGlass',74:'CableBundle',75:'Insulation',76:'HazardStripe',77:'NeonCyan',78:'NeonMagenta',79:'NeonAmber',80:'LEDWhite',100:'BasaltColumns',101:'Obsidian',111:'Terrazzo',114:'AluminiumPanel',119:'BrassPanel',120:'GlassBlock',130:'CarbonFibre',131:'HeatShieldTile'};
const PAL={0:[8,13,23],58:[104,109,117],62:[122,141,153],63:[43,99,114],64:[92,110,122],65:[138,76,56],66:[82,96,108],68:[112,128,142],69:[175,101,58],70:[209,212,207],72:[33,56,74],74:[54,53,71],75:[205,192,108],76:[230,183,45],77:[65,237,218],78:[236,62,177],79:[250,169,52],80:[236,245,250],100:[56,57,66],101:[27,31,43],111:[191,190,176],114:[179,189,203],119:[203,169,81],120:[147,207,220],130:[35,41,49],131:[41,38,41]};
const POLICY=[1279479895,1,1,-2102023270,1854385793,1886533889,84225930,1522979054,582168604,-646713377,-939672877,868616440,1977866421,1930370363,-2119873090,-6981196,870342995,1443932351,-1569267145,11,3,1,0,8,2,0,12,2,0,16,2,0,20,2,0,21,2,0,24,2,0,30,2,0,32,2,0,33,2,0,36,2,0,0,0];
const MIDGE_HASH='c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96';
const SITES={
 'Signal Bazaar landing':[135,487],
 'Signal Bazaar observation':[276,301],
 'Signal Bazaar subpassage':[245,736],
 'Inductor cargo manifold':[578,475],
 'Inductor vane watch':[685,288],
 'Inductor coolant return':[748,743],
 'Parapet top transfer':[1045,284],
 'Plasma trench neutral line':[1050,476],
 'Trench emergency underpass':[1104,737],
 'Civic registry upper gallery':[1471,286],
 'Civic registry main kiosk':[1474,477],
 'Civic archive circulation':[1552,734],
 'Sable Lock shield control':[1793,306],
 'Lock security inspection':[1816,472],
 'Lock return airlock':[1871,741],
 'East beacon destination':[1930,479]
};
const CROPS=[['01-signal-bazaar',38,175,400,410],['02-inductor-mill',432,170,443,450],['03-plasma-trench',858,140,450,540],['04-civic-registry',1278,174,423,453],['05-sable-lock',1664,171,370,450]];
function generate(){
 const a=new Uint8Array(W*H);let state=SEED>>>0;
 const rnd=()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return(state>>>0)/4294967296;};
 function R(x,y,w,h,m){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);let x0=Math.max(0,x),y0=Math.max(0,y),x1=Math.min(W,x+w),y1=Math.min(H,y+h);if(x1<=x0||y1<=y0)return;for(let yy=y0;yy<y1;yy++)a.fill(m,yy*W+x0,yy*W+x1);}
 function L(x,y,xx,yy,t,m){let dx=xx-x,dy=yy-y,dd=dx*dx+dy*dy,rad=t/2;for(let row=Math.max(0,Math.floor(Math.min(y,yy)-rad));row<=Math.min(H-1,Math.ceil(Math.max(y,yy)+rad));row++){let start=-1;for(let col=Math.max(0,Math.floor(Math.min(x,xx)-rad));col<=Math.min(W-1,Math.ceil(Math.max(x,xx)+rad));col++){let q=Math.max(0,Math.min(1,((col-x)*dx+(row-y)*dy)/(dd||1))),inside=(col-x-q*dx)**2+(row-y-q*dy)**2<=rad*rad;if(inside){if(start<0)start=col;}else if(start>=0){R(start,row,col-start,1,m);start=-1;}}if(start>=0)R(start,row,Math.min(W,Math.ceil(Math.max(x,xx)+rad)+1)-start,1,m);}}
 function poly(pts,m){let lo=Math.max(0,Math.ceil(Math.min(...pts.map(p=>p[1])))),hi=Math.min(H-1,Math.floor(Math.max(...pts.map(p=>p[1]))));for(let y=lo;y<=hi;y++){let hits=[];for(let i=0;i<pts.length;i++){let p=pts[i],q=pts[(i+1)%pts.length];if((p[1]<=y&&q[1]>y)||(q[1]<=y&&p[1]>y))hits.push(p[0]+(y-p[1])*(q[0]-p[0])/(q[1]-p[1]));}hits.sort((u,v)=>u-v);for(let j=0;j+1<hits.length;j+=2)R(Math.ceil(hits[j]),y,Math.floor(hits[j+1])-Math.ceil(hits[j])+1,1,m);}}
 function bay(x,y,w,h,mat,trim,win){R(x,y,w,h,mat);R(x+7,y+9,w-14,h-19,M.E);R(x+8,y+8,w-16,6,trim);R(x+10,y+19,w-20,Math.min(23,h-27),win);R(x+6,y+h-11,w-12,8,trim);}
 function hatch(x,y,w,h,m){R(x,y,w,h,M.E);R(x,y,w,4,m);R(x,y,4,h,m);R(x+w-4,y,4,h,m);R(x,y+h-4,w,4,m);}
 function cable(x,y,xx,yy){L(x,y,xx,yy,8,M.CABLE);L(x,y,xx,yy,3,M.CYAN);}
 // 01. Basalt world shoulders & bedded bedrock; significant constructed foundation with differentiated layering.
 for(let x=0;x<W;x++){const ridge=Math.round(865+15*Math.sin(x*.009)+13*Math.sin(x*.023)+4*Math.sin(x*.061));R(x,ridge,1,H-ridge,M.BAS);if(x%33<22)R(x,ridge+42,1,5,M.OBS);}
 poly([[0,1024],[0,186],[32,210],[72,258],[91,385],[76,568],[101,760],[130,920],[159,1024]],M.OBS);
 poly([[2048,1024],[2048,174],[2022,197],[1992,263],[1984,398],[1964,586],[1973,737],[1890,1024]],M.BAS);
 L(40,237,97,810,22,M.CON);L(2005,231,1950,820,22,M.CON);
 R(111,836,1813,24,M.CON);R(122,861,1794,12,M.STEEL);
 // Three uninterrupted traversable air bands (upper 250-337, central 442-523, lower 698-788), deliberately not obstructed by buildings.
 // Structural spine: stepped pylons with large real hull-sized open apertures; underpasses remain clear.
 for(const [x,top] of [[420,285],[837,235],[1300,256],[1700,302]]){
   R(x-26,top,52,614,M.CON);R(x-20,top+21,40,590,M.STEEL);
   R(x-34,440,68,96,M.E);R(x-33,691,66,112,M.E);R(x-36,250,72,91,M.E);
   R(x-32,436,64,7,M.HAZ);R(x-32,534,64,8,M.HAZ);R(x-34,680,68,8,M.CYAN);R(x-34,803,68,8,M.STEEL);
   R(x-26,560,52,102,M.CORR);R(x-18,577,36,58,M.GLASS);
 }
 // West public Signal Bazaar: irregular stepped rain canopies, floodlit multilingual terminal sections.
 poly([[82,394],[87,280],[124,262],[147,222],[200,236],[218,190],[259,226],[308,246],[326,279],[356,260],[389,300],[411,406],[410,604],[87,603]],M.PAINT);
 poly([[105,408],[111,310],[145,295],[168,261],[208,268],[222,238],[263,271],[308,286],[349,295],[385,357],[384,566],[109,565]],M.CON);
 R(105,408,293,11,M.STEEL);R(110,419,279,5,M.AMBER);
 // Public serviced interiors with varied entry proportions and functional platforms.
 for(const [x,y,w,h,col] of [[110,327,68,67,M.GLASS],[193,308,77,82,M.GLASSB],[288,333,92,59,M.GLASS]])bay(x,y,w,h,M.STEEL,M.CYAN,col);
 for(const [x,y,w,h] of [[115,546,91,59],[231,527,64,79],[311,535,70,65]]){bay(x,y,w,h,M.CON,M.STEEL,M.GLASS);R(x+14,y+h-23,13,11,M.AMBER);}
 R(114,623,272,13,M.STEEL);R(119,642,258,6,M.CYAN);
 // Signal mast and asymmetric triangular aerial supports.
 L(183,260,183,128,12,M.STEEL);L(183,129,133,251,6,M.CABLE);L(183,130,230,231,6,M.CABLE);
 for(const [x,y] of [[165,160],[176,180],[185,201]])R(x,y,35,8,M.AMBER);
 poly([[298,333],[327,302],[366,338],[358,358],[315,359]],M.GLASSB);
 for(let x of [150,267,349]){R(x,651,12,191,M.STEEL);R(x+3,660,6,180,M.CON);}
 for(let x=126;x<389;x+=37){R(x,671,23,9,M.CORR);R(x+7,682,9,5,M.AMBER);}
 // 02. Inductor mill: three leaning asymmetrical induction fins, grounded through heavy floors and trussed load-handling rails.
 poly([[449,411],[463,331],[496,278],[521,258],[545,301],[558,329],[592,273],[616,246],[645,285],[677,310],[705,230],[731,267],[776,307],[806,354],[818,427],[815,634],[451,633]],M.STEEL);
 poly([[469,406],[481,354],[507,321],[534,337],[568,361],[619,290],[654,350],[697,330],[722,276],[765,339],[788,384],[791,580],[477,581]],M.CORR);
 // big different triangular heat exchange blades, are fastened at foot to roof flange.
 for(const [x,yt,ang] of [[491,150,78],[602,109,-58],[730,166,58]]){
   poly([[x,399],[x+28,399],[x+ang,yt],[x+ang+17,yt+6]],M.CON);
   L(x+8,388,x+ang+9,yt+8,8,M.AMBER);L(x+25,391,x+ang+17,yt+12,5,M.CYAN);
 }
 // Face-recesses and feed troughs use different sizes.
 for(const [x,y,w,h] of [[489,350,79,64],[602,355,81,58],[715,359,70,59]])bay(x,y,w,h,M.STEEL,M.HAZ,M.GLASS);
 R(475,542,322,20,M.STEEL);R(485,562,302,6,M.CYAN);
 for(let x=483;x<798;x+=61){R(x,600,22,61,M.CORR);R(x+6,608,10,35,M.GLASS);R(x+1,653,19,7,M.AMBER);}
 R(453,642,364,15,M.CON);R(471,661,328,9,M.GRATE);
 for(let x of [481,561,645,747,800]){R(x,676,14,173,M.STEEL);R(x+4,688,6,152,M.CORR);}
 for(let x=502;x<795;x+=51){R(x,815,30,21,M.RUST);R(x+4,810,22,7,M.HAZ);}
 // Diagonal freight hoist across above the top air band, with attached gantries.
 L(466,235,813,186,14,M.STEEL);L(470,225,813,176,5,M.WHITE);
 for(const x of [490,580,670,764]){let y=235-(x-466)*49/347;L(x,y,x+44,359,6,M.CABLE);R(x-5,356,28,11,M.HAZ);}
 // 03. Exposed plasma trench — enormous material-negative void, two serrated grounded conductor jaws, no decorative random chips.
 poly([[850,568],[860,392],[875,361],[895,377],[910,324],[945,374],[963,346],[981,408],[974,574],[946,628],[933,817],[851,851]],M.OBS);
 poly([[1198,848],[1207,797],[1200,647],[1179,587],[1169,424],[1194,369],[1221,392],[1231,340],[1253,381],[1276,355],[1296,413],[1300,848]],M.OBS);
 L(866,357,950,585,12,M.COP);L(1280,360,1205,582,11,M.CYAN);
 for(let i=0;i<6;i++){let y=377+i*43;L(865,y,940+Math.sin(i)*9,y+20,8,i%2?M.STEEL:M.HEAT);L(1287,y,1214-Math.cos(i)*8,y+15,9,i%2?M.HEAT:M.STEEL);}
 // Massive suspended central orbital freight cradles; continuous main route remains below at 466.
 poly([[956,182],[991,142],[1105,158],[1133,204],[1120,255],[974,258],[947,228]],M.STEEL);
 poly([[970,188],[998,160],[1099,174],[1117,208],[1106,236],[974,237]],M.GLASS);
 for(let x=984;x<1108;x+=21){R(x,200,13,26,x%3?M.GLASSB:M.CYAN);R(x+2,225,9,3,M.HAZ);}
 L(894,111,973,188,14,M.CON);L(1173,104,1110,187,14,M.CON);
 L(851,238,967,191,9,M.CABLE);L(1131,189,1280,226,10,M.CABLE);
 // Two long narrow engineered transit bridges: overhead at y342 and low y805; leave 2 other flight bands unobstructed.
 L(859,346,1295,344,12,M.STEEL);L(859,358,1290,357,6,M.CYAN);
 for(let x=873;x<1285;x+=42){R(x,360,25,4,M.HAZ);L(x,344,x+30,374,3,M.CABLE);}
 L(842,806,1307,804,23,M.CON);L(845,793,1303,793,7,M.GRATE);
 for(let x=884;x<1300;x+=53){R(x,809,10,34,M.STEEL);R(x+2,813,6,25,M.AMBER);}
 // Tiny control pods are fastened to trestle, away from actor main path.
 bay(931,575,103,70,M.STEEL,M.CYAN,M.GLASS);bay(1078,569,97,80,M.CORR,M.AMBER,M.GLASS);
 L(976,646,976,805,10,M.STEEL);L(1122,648,1122,807,9,M.STEEL);
 // 04. Civic Registry: angular white stepped facades, accessible registration balcony and archive with broad concourse.
 poly([[1315,415],[1318,282],[1358,252],[1399,211],[1435,237],[1482,175],[1510,205],[1549,251],[1592,229],[1634,274],[1675,330],[1683,584],[1316,590]],M.AL);
 poly([[1338,422],[1347,312],[1382,285],[1426,272],[1488,209],[1508,242],[1557,282],[1612,261],[1654,336],[1654,553],[1337,553]],M.TILE);
 for(const [x,y,w,h] of [[1350,338,74,64],[1439,315,91,80],[1559,335,80,67]])bay(x,y,w,h,M.AL,M.BRASS,M.GLASSB);
 R(1352,409,280,13,M.BRASS);R(1362,424,260,5,M.AMBER);
 // Tall civic antenna with triple oblique bracing.
 L(1480,209,1480,119,11,M.AL);L(1480,129,1438,214,5,M.CABLE);L(1480,130,1543,249,5,M.CABLE);R(1465,138,30,7,M.CYAN);
 // Staggered civic service floors with real portals and interior machine cabinets.
 for(const [x,y,w,h] of [[1348,546,122,89],[1484,538,82,97],[1581,553,75,78]]){bay(x,y,w,h,M.AL,M.BRASS,M.GLASS);R(x+16,y+h-24,28,15,M.GLASSB);}
 R(1321,644,361,16,M.CON);R(1332,663,338,5,M.CYAN);
 for(let x of [1346,1450,1557,1650]){R(x,672,13,178,M.CON);R(x+4,686,5,150,M.AL);}
 // Civic slanted archive risers and archives, asymmetric shelving and light wells.
 for(const [x,y,w,h] of [[1364,783,73,52],[1454,764,82,70],[1551,782,96,51]]){R(x,y,w,h,M.STEEL);R(x+7,y+7,w-14,h-16,M.GLASS);for(let k=0;k<3;k++)R(x+10,y+14+k*11,w-20,3,M.AMBER);}
 L(1327,232,1680,226,12,M.STEEL);L(1341,221,1677,212,5,M.WHITE);
 for(let x=1357;x<1670;x+=47)L(x,230,x+15,301,4,M.CABLE);
 // 05. Sable Lock: brutal wedge security shutters, asymmetric military mast and containment ducts.
 poly([[1711,405],[1718,290],[1742,247],[1795,271],[1813,209],[1847,235],[1885,208],[1926,258],[1951,312],[1970,403],[1954,642],[1710,644]],M.CON);
 poly([[1737,418],[1744,333],[1780,298],[1810,314],[1836,248],[1885,272],[1925,309],[1940,368],[1938,593],[1735,598]],M.HEAT);
 for(const [x,y,w,h] of [[1754,344,70,61],[1848,322,69,85]])bay(x,y,w,h,M.STEEL,M.HAZ,M.GLASS);
 R(1736,417,220,20,M.STEEL);R(1746,437,192,5,M.AMBER);
 // Door has 2D front-facing leaves hinged to solid wall; corridor is an explicit opening, never decorative fake doorway.
 R(1723,541,226,10,M.RUST);
 for(let i=0;i<6;i++){R(1740+i*34,552,28,84,i%2?M.CORR:M.STEEL);R(1743+i*34,559,22,5,M.HAZ);}
 R(1718,649,228,16,M.STEEL);R(1723,669,219,8,M.CYAN);
 for(let x of [1737,1801,1878,1928]){R(x,680,13,171,M.CON);R(x+5,692,5,145,M.STEEL);}
 bay(1748,781,91,50,M.HEAT,M.HAZ,M.GLASS);bay(1850,776,77,56,M.CON,M.CYAN,M.GLASS);
 L(1901,272,1910,124,13,M.STEEL);L(1912,130,1881,258,6,M.CABLE);L(1908,127,1957,291,6,M.CABLE);R(1899,143,24,7,M.MAG);
 // Universal side-elevation dual transit circulation: three broad air paths, roomy vertical transfers.
 // Explicitly excavate to guarantee corridors without preserving artificial view-only interiors.
 for(const [y0,y1] of [[444,522],[702,780],[265,319]])R(104,y0,1845,y1-y0,M.E);
 for(let [x0,x1] of [[216,265],[558,603],[797,836],[1033,1095],[1400,1455],[1590,1646],[1822,1870]])R(x0,270,x1-x0,510,M.E);
 // Restore primary catwalks/decor only outside tested corridors; cut has removed scenery that would obstruct routes.
 for(let [x,y,w] of [[102,435,270],[481,435,320],[1322,435,348],[1710,435,234]]){R(x,y,w,6,M.STEEL);R(x+10,y+6,w-20,3,M.AMBER);}
 for(let [x,y,w] of [[113,668,282],[469,668,339],[1328,668,354],[1720,668,217]]){R(x,y,w,7,M.STEEL);R(x+5,y+7,w-10,4,M.GRATE);}
 // Surface engineering: anti-symmetric diagonal gussets from bedrock to transfer bridge.
 for(const [x,dir] of [[133,1],[387,-1],[495,1],[792,-1],[859,1],[1281,-1],[1350,1],[1684,-1],[1720,1],[1941,-1]]){
   L(x,843,x+dir*20,802,10,M.CON);R(x-10,838,24,12,M.STEEL);
 }
 // Architectural load-path repair: four actual connected planar chords tie the engineered city to both canyon shoulders.
 // They intentionally stand BETWEEN flyable air corridors rather than intersecting a Midge route.
 R(20,214,2010,12,M.STEEL);R(28,214,1994,3,M.AMBER);
 for(let x=103;x<1940;x+=92){L(x,227,x+19,253,4,M.CABLE);R(x-4,210,30,4,M.CYAN);}
 R(56,412,1934,14,M.STEEL);R(64,425,1916,3,M.AMBER);
 for(let x=101;x<1911;x+=113){L(x,407,x+34,373,6,M.STEEL);R(x+5,424,23,5,M.GRATE);}
 R(38,640,1959,18,M.CON);R(48,659,1938,5,M.CYAN);
 for(let x=119;x<1920;x+=103){L(x,637,x+33,598,8,M.STEEL);R(x+8,657,20,5,M.HAZ);}
 R(85,837,1878,19,M.CON);R(96,857,1856,5,M.RUST);
 for(let x=122;x<1901;x+=127)R(x,846,19,42,M.STEEL);
 // Operable through-rise transfer slots: explicitly open every plan-named lift shaft after laying supporting chords.
 for(let [x0,x1] of [[216,265],[558,603],[797,836],[1033,1095],[1400,1455],[1590,1646],[1822,1870]])R(x0,270,x1-x0,510,M.E);
 // Each broken chord bay has an actual material tether to the continuous upper load girder.
 // Staggered steel tension hangers carry the middle decks; solid supports have no unsupported magical islands.
 for(let x of [139,345,736,934,1204,1525,1732,1903]){L(x,218,x+3,416,9,M.STEEL);L(x+3,220,x+6,407,3,M.CYAN);}
 // Lower suspended undercroft also has explicit drawbar ties to the grounded bottom chassis.
 for(let x of [145,343,685,1519,1736,1906]){L(x,647,x+11,857,11,M.CON);L(x+1,655,x+11,849,4,M.CORR);}
 // Authored east/west emergency ramps around the plasma trench's main inspection choke.
 // Each cuts the mid-to-low deck only at the intended shaft, providing a testable lower flight bypass.
 R(899,522,56,228,M.E);R(1337,522,58,228,M.E);
 // Right-side inspection-to-overhead relief at the fault fringe, explicitly outside obstruction.
 R(1141,267,45,256,M.E);
 // Explicit human-scale clear inspection alcove near the shield-control observation coordinate.
 R(1774,286,42,43,M.E);
 // Keep all retained components physically attached to the boundary superstructure; prune optional detached decor.
 function prune(){const seen=new Uint8Array(a.length),q=new Uint32Array(a.length);let comps=0,removed=0;for(let i=0;i<a.length;i++){if(!a[i]||seen[i])continue;let p=0,n=1,root=false;q[0]=i;seen[i]=1;while(p<n){let u=q[p++],x=u%W,y=(u/W)|0;if(x===0||x===W-1||y===H-1)root=true;for(const v of [u-1,u+1,u-W,u+W])if(v>=0&&v<a.length&&Math.abs(v%W-x)+Math.abs(((v/W)|0)-y)===1&&a[v]&&!seen[v]){seen[v]=1;q[n++]=v;}}if(!root){comps++;removed+=n;for(let j=0;j<n;j++)a[q[j]]=0;}}return {components:comps,cells:removed};}
 const pruned=prune();
 const hist={};let work=0;for(const m of a){hist[m]=(hist[m]||0)+1;if(m)work++;if(!(m in NAMES))throw Error('invalid ID '+m);}
 const edits=[],prev=new Map();for(let y=0;y<H;y++){const current=new Map();for(let x=0;x<W;){let mat=a[y*W+x],s=x;while(x<W&&a[y*W+x]===mat)x++;if(!mat)continue;let key=s+','+(x-s)+','+mat,old=prev.get(key);if(old!==undefined){edits[old][3]++;current.set(key,old);}else{current.set(key,edits.length);edits.push([s,y,x-s,1,mat]);}}prev.clear();for(const [key,v] of current)prev.set(key,v);}
 const replay=new Uint8Array(W*H),used=new Uint8Array(W*H);for(const [x,y,w,h,mat] of edits)for(let row=y;row<y+h;row++){for(let col=x;col<x+w;col++){let i=row*W+col;if(used[i])throw Error('overlap '+i);used[i]=1;}replay.fill(mat,row*W+x,row*W+x+w);}for(let i=0;i<a.length;i++)if(a[i]!==replay[i])throw Error('Replay mismatch '+i);
 const setup={version:2,extent:[W,H],actors:[{id:1,model:'midge',hash:MIDGE_HASH,spawn:SITES['Signal Bazaar landing'],options:{budget:20,mass_multiplier:1,inertia_multiplier:1,thrust_multiplier:1,torque_multiplier:1,boost_multiplier:1.8}}],next_id:2,selected:1,edits,response:'LA-SELECTIVE',liquid_policy:POLICY,normalize:false,rule_radius:2,source:[],material:2,brush:8,fire:false};
 const json=JSON.stringify(setup)+'\n';if(json.length>1048576||edits.length>32768||work>32000000)throw Error('Budget '+json.length+' '+edits.length+' '+work);
 return {g:a,json,edits,work,hist,pruned};
}
function clearances(g,sites){const stride=W+1,cum=new Uint32Array((W+1)*(H+1));for(let y=0;y<H;y++){let row=0;for(let x=0;x<W;x++){row+=(g[y*W+x]!==0)?1:0;cum[(y+1)*stride+x+1]=cum[y*stride+x+1]+row;}}
 const result=[];for(const [cw,ch] of [[19,15],[23,19],[31,27]]){let hx=(cw-1)>>1,hy=(ch-1)>>1,air=new Uint8Array(W*H),count=0;for(let y=hy;y<H-hy;y++)for(let x=hx;x<W-hx;x++){let x0=x-hx,y0=y-hy,x1=x+hx+1,y1=y+hy+1;let n=cum[y1*stride+x1]-cum[y1*stride+x0]-cum[y0*stride+x1]+cum[y0*stride+x0];if(n===0){air[y*W+x]=1;count++;}}
 let s=sites['Signal Bazaar landing'],sp=s[1]*W+s[0];if(!air[sp])throw Error('spawn blocked '+cw);let seen=new Uint8Array(W*H),queue=new Uint32Array(W*H),head=0,tail=1;queue[0]=sp;seen[sp]=1;while(head<tail){let u=queue[head++],x=u%W,y=(u/W)|0;for(let v of [u-1,u+1,u-W,u+W]){if(v>=0&&v<W*H&&Math.abs(v%W-x)+Math.abs(((v/W)|0)-y)===1&&air[v]&&!seen[v]){seen[v]=1;queue[tail++]=v;}}}
 let missing=[];for(let [name,[x,y]] of Object.entries(sites)){if(!seen[y*W+x]||!air[y*W+x])missing.push({name,point:[x,y],air:!!air[y*W+x]});}result.push({size:[cw,ch],legalCentres:count,component:tail,reached:Object.keys(sites).length-missing.length,total:Object.keys(sites).length,missing});}return result;}
function render(g,x,y,w,h){const rgb=Buffer.alloc(w*h*3);let k=0;for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){let c=PAL[g[yy*W+xx]];rgb[k++]=c[0];rgb[k++]=c[1];rgb[k++]=c[2];}let rows=Buffer.alloc((w*3+1)*h);for(let r=0;r<h;r++)rgb.copy(rows,r*(w*3+1)+1,r*w*3,(r+1)*w*3);
 const crcTable=Array.from({length:256},(_,i)=>{let c=i;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c>>>0;});const crc=b=>{let c=0xffffffff;for(let i=0;i<b.length;i++)c=crcTable[(c^b[i])&255]^(c>>>8);return(c^0xffffffff)>>>0;};const chunk=(t,d)=>{let z=Buffer.from(t),out=Buffer.alloc(12+d.length);out.writeUInt32BE(d.length,0);z.copy(out,4);d.copy(out,8);out.writeUInt32BE(crc(Buffer.concat([z,d])),out.length-4);return out;};
 let header=Buffer.alloc(13);header.writeUInt32BE(w,0);header.writeUInt32BE(h,4);header[8]=8;header[9]=2;let out=Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',zlib.deflateSync(rows,{level:9})),chunk('IEND',Buffer.alloc(0))]);return out;}
const world=generate(),checks=clearances(world.g,SITES);if(checks.some(c=>c.missing.length))throw Error('Site clearance failed: '+JSON.stringify(checks));
const block=new Uint8Array(world.g);for(let y=443;y<526;y++)block.fill(M.CON,y*W+976,y*W+1134);const remain=Object.fromEntries(Object.entries(SITES).filter(([k])=>k!=='Plasma trench neutral line'));const blockchecks=clearances(block,remain);if(blockchecks.some(c=>c.missing.length))throw Error('Bypass failed: '+JSON.stringify(blockchecks));
const sha=v=>crypto.createHash('sha256').update(v).digest('hex'),files=[['overview',0,0,W,H],...CROPS];let evidence=[];
for(let [n,x,y,w,h] of files){const img=render(world.g,x,y,w,h);if(!img.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))throw Error('PNG signature');fs.writeFileSync(path.join(__dirname,n+'.png'),img);evidence.push({name:n,rect:[x,y,w,h],bytes:img.length,sha256:sha(img)});}
fs.writeFileSync(path.join(__dirname,'setup-ion-parapet.json'),world.json);
const receipt={original:true,design:'The Ion Parapet — Stormbreaker Freight Terraces',seed:SEED,engine_sha:'de109d0131641d6adc8d25bb9ced7ca3d4991105',size:[W,H],midge_hull:[4,3],materials:NAMES,histogram:world.hist,edits:world.edits.length,work:world.work,bytes:Buffer.byteLength(world.json),grid_sha256:sha(world.g),setup_sha256:sha(world.json),pruned:world.pruned,clearances:checks,blocked_route:{rect:[976,443,1134,526],excludes:'Plasma trench neutral line',checks:blockchecks},sites:SITES,images:evidence,native:'NATIVE-UNTESTED'};
fs.writeFileSync(path.join(__dirname,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({edits:world.edits.length,work:world.work,bytes:world.json.length,pruned:world.pruned,checks,blocked:blockchecks,images:evidence},null,2));
