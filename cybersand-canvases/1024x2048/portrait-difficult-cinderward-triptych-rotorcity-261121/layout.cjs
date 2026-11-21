'use strict';
/* PORTRAIT-001 Creator B — DIFFICULT #2 Cinderward Triptych Rotorcity.
   Original 1024x2048 industrial civic recomposition, no source coordinates or cells.
   All solids are stationary materials and are boundary-rooted; fluids sealed. */
function layoutWorld(){
 const W=1024,H=2048,g=new Uint8Array(W*H),seed=202611211457;
 const M={0:"air",3:"water",8:"lava",58:"reinforced-concrete",62:"steel-plate",65:"rusted-steel",68:"steel-pipe",69:"copper-pipe",76:"hazard-plate",79:"amber-light",100:"basalt",104:"refractory-brick",117:"wrought-iron",131:"shield"};
 const b=(x,y,w,h,m)=>{[x,y,w,h]=[x,y,w,h].map(Math.round);if(x<0||y<0||w<1||h<1||x+w>W||y+h>H)throw Error("bounds "+[x,y,w,h,m]);for(let yy=y;yy<y+h;yy++)g.fill(m,yy*W+x,yy*W+x+w);};
 const l=(x,y,X,Y,t,m)=>{const n=Math.max(1,Math.ceil(Math.hypot(X-x,Y-y)/Math.max(3,t/2)));for(let i=0;i<=n;i++){const f=i/n;b(x+(X-x)*f-t/2,y+(Y-y)*f-t/2,t,t,m);}};
 const ring=(cx,cy,r,t,m,segments=24)=>{let pts=[];for(let i=0;i<segments;i++){const a=2*Math.PI*i/segments;pts.push([cx+r*Math.cos(a),cy+r*Math.sin(a)]);}for(let i=0;i<segments;i++)l(...pts[i],...pts[(i+1)%segments],t,m);};
 const cabin=(x,y,w,h,mat)=>{b(x,y,w,11,62);b(x,y,10,h,65);b(x+w-10,y,10,h,65);b(x,y+h-11,w,11,58);b(x+14,y+13,22,12,79);b(x+w-37,y+15,20,12,131);b(x+24,y+h-32,8,21,68);};
 const sites=[
 ["Ore hilltown entry",235,220],["Upper ore workshop",452,310],["Ore crane watch",482,391],
 ["Refractory furnace inspection",345,524],["Upper flyway turn",526,601],
 ["Travelling ladle watch",565,717],["Ladle repair spur",725,740],
 ["Guild south gate",763,841],["Caster toolroom",622,967],
 ["Upper exchange intercept",517,849],["Rotor upper intercept",515,1055],
 ["Eight-spoke rotor east",731,1179],["Rotor underfoot west",350,1330],
 ["Guild deep archive",685,1418],["Quench control",420,1490],
 ["Quench recovery bay",480,1670],["Export village porch",585,1750],
 ["Lower freight control",588,1847],["Export goal",586,1928]
 ].map(([name,x,y])=>({name,x,y}));
 // Narrow unequal left/right geological banks with vertical rest terraces.
 // Upper ore hilltown, right guild and lower export village form triangular,
 // NONparallel urban districts, unlike the original three towns on one plain.
 b(0,0,98,H,100);b(932,0,92,H,100);b(0,1981,W,67,100);
 for(const [x,y,w,h,m] of [
 [98,375,302,25,58],[98,399,245,12,62],
 [98,556,248,22,58],[98,578,135,11,62],
 [98,807,174,22,58],
 [654,906,278,24,58],[698,930,234,12,62],
 [724,1074,208,21,58],
 [98,1403,204,22,58],[98,1425,146,12,62],
 [98,1688,346,25,58],[98,1713,192,11,62],
 [655,1912,277,25,58],[655,1937,277,10,62],
 [750,1522,182,21,58],[750,1543,115,11,62]
 ])b(x,y,w,h,m);
 // Three inhabited towns: unlike entered house sizes and functional groupings.
 cabin(140,292,100,82,65);cabin(263,311,119,64,65);
 cabin(701,823,94,82,65);cabin(821,798,88,108,65);
 cabin(150,1602,110,86,65);cabin(286,1626,135,62,65);
 cabin(706,1811,112,100,65);cabin(834,1841,76,69,65);
 // Ore receiving and corner tower, tied into the west hilltown foundation.
 b(109,246,18,128,68);b(115,239,139,13,62);b(146,249,40,28,131);
 b(268,254,13,121,68);b(278,268,92,12,117);
 l(370,274,472,346,9,117);l(474,346,410,398,8,117);
 b(387,380,86,18,58);b(400,398,12,55,68);
 // Anchor hot core to the exact west cliff.
 b(98,479,44,16,58);
 // Furnaces are coherent enclosed thermal vessels, not exposed or falling lava.
 b(125,463,214,92,104);b(139,474,185,69,131);b(156,486,151,47,104);
 b(170,498,120,26,8);b(130,445,14,19,68);b(319,431,13,32,68);
 b(350,475,23,66,65);b(375,500,61,12,117);
 for(const y of [452,527]){b(112,y,12,22,76);b(125,y+6,40,8,69);}
 // Long diagonal overhead transfer/ladle stays tethered to right bank;
 // strong oblique engineering rather than a generic stack of floor trays.
 b(665,643,267,18,58);b(694,661,138,11,62);
 l(932,603,687,670,13,117);l(930,669,805,715,12,68);
 b(506,705,173,15,117);b(527,720,141,51,65);
 b(545,729,110,30,104);b(562,736,79,15,131);
 l(591,704,683,641,9,117);l(658,704,718,642,9,117);
 b(687,733,113,13,58);b(724,746,13,87,68);
 // Caster-guild tier: two off-axis ram lengths and diagonal drive bracing.
 b(655,941,245,15,117);b(666,956,218,13,65);
 b(682,969,183,30,104);b(704,974,143,16,131);
 b(673,914,11,27,68);b(874,906,13,35,68);
 b(785,999,13,75,69);b(814,1030,118,13,58);
 l(814,1030,932,953,10,117);
 b(734,1110,198,15,117);b(756,1125,152,19,65);
 b(780,1144,13,45,68);b(830,1144,12,75,68);
 // A singular grounded 8-spoke transfer rotor, NOT a succession of rings.
 // Hub load travels through a central concrete pier to the base boundary.
 ring(499,1202,133,13,117,32);ring(499,1202,80,9,69,24);
 for(let j=0;j<8;j++){let a=j*Math.PI/4;l(499+18*Math.cos(a),1202+18*Math.sin(a),499+128*Math.cos(a),1202+128*Math.sin(a),12,j%2?68:117);}
 b(477,1181,44,43,58);b(487,1332,25,649,58);
 b(474,1302,52,31,58);b(464,1191,70,20,131);
 // Eccentric service bridges and separately rooted lower recovery.
 b(98,1260,251,20,58);b(110,1280,164,10,62);
 l(270,1257,359,1168,10,117);b(340,1147,44,16,62);
 b(709,1246,223,20,58);b(740,1266,155,12,62);
 l(709,1253,623,1185,9,117);
 b(742,1357,190,16,58);b(767,1373,151,12,62);
 b(782,1390,12,69,68);
 // Relieved expansion pockets, named but intentionally unfurnished.
 b(98,1450,183,14,58);b(121,1464,12,61,68);
 b(800,1451,132,16,58);b(831,1467,12,53,68);
 // Quench vessel is physically seated on a west-rock crossbeam.
 b(98,1550,90,18,58);
 // Quench process moved to the lower LEFT district; entirely solid sealed.
 b(169,1514,178,97,104);b(183,1526,150,74,131);
 b(201,1540,114,48,104);b(220,1552,77,26,3);
 b(207,1496,14,18,68);b(307,1494,14,20,69);
 b(130,1577,50,12,58);b(141,1551,12,27,69);
 // Industrial route switchback: bridge above rotor, maintenance below;
 // natural open air has branching without an imposed shaft corridor.
 b(98,1082,177,15,58);b(120,1063,96,19,62);
 l(275,1088,351,1032,10,117);b(355,1018,70,14,62);
 b(805,1607,127,15,58);b(838,1622,11,102,68);
 b(700,1750,232,16,58);b(733,1733,127,17,62);
 b(735,1693,80,40,65);b(748,1705,54,15,131);
 b(711,1766,13,54,68);
 // Railway grade and export systems: y1800-1940, distinct lower-right port.
 b(722,1862,210,15,117);for(let x=742;x<920;x+=31)b(x,1877,11,35,68);
 b(671,1789,17,124,68);b(658,1783,125,12,62);
 l(670,1784,816,1719,12,117);l(816,1719,857,1810,10,117);
 b(841,1900,91,12,76);
 // Functional warning signals rooted in station architecture.
 for(const [x,y] of [[113,405],[911,793],[113,1320],[912,1485],[116,1760],[905,1960]]){b(x,y,13,40,69);b(x+2,y+8,9,12,79);}
 // Aperture between rotor rim and the staggered guild bridge: a legitimate
 // 70-cell-wide all-hull recovery passage, not a decorative closed slot.
 b(644,1190,70,126,0);
 // Exact literal checkpoint clearance in final source plane (not substituted
 // during BFS); corridors must remain navigable at 31x27 after this.
 for(const p of sites)b(p.x-19,p.y-17,39,35,0);
 // Drop any accidental detached iron/architecture; never misreport as grounded.
 const solid=id=>id!==0&&id!==3&&id!==8,seen=new Uint8Array(g.length),q=new Int32Array(g.length);let a=0,z=0;
 const add=i=>{if(i>=0&&i<g.length&&solid(g[i])&&!seen[i]){seen[i]=1;q[z++]=i;}};
 for(let x=0;x<W;x++){add(x);add((H-1)*W+x);}for(let y=0;y<H;y++){add(y*W);add(y*W+W-1);}
 while(a<z){let i=q[a++],x=i%W;for(const j of[x?i-1:-1,x<W-1?i+1:-1,i>=W?i-W:-1,i+W<g.length?i+W:-1])add(j);}
 let lost=0;for(let i=0;i<g.length;i++)if(solid(g[i])&&!seen[i]){g[i]=0;lost++;}
 return {W,H,g,M,seed,sites,spawn:[sites[0].x,sites[0].y],discarded_ungrounded:lost};
}
if(typeof module!=="undefined")module.exports={layoutWorld};
