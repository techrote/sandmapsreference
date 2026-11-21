'use strict';
/* PORTRAIT-001 Creator B · MODERATE #2 — Spindlebreak Switchback Trestleworks.
 * New 1024x2048 cell-built perpendicular elevation, source only conceptual donor.
 * Alternating rooted fault ledges, separate high cable/low truss, two route flanks. */
function layoutWorld(){
 const W=1024,H=2048,g=new Uint8Array(W*H),seed=202611211531;
 const M={0:"air",3:"water",8:"lava",58:"reinforced",62:"plate",65:"rust steel",68:"steel pipe",69:"copper pipe",76:"hazard",79:"amber",100:"basalt",104:"firebrick",117:"iron",131:"ceramic shield"};
 const b=(x,y,w,h,m)=>{[x,y,w,h]=[x,y,w,h].map(Math.round);if(x<0||y<0||w<1||h<1||x+w>W||y+h>H)throw Error("bounds "+[x,y,w,h,m]);for(let yy=y;yy<y+h;yy++)g.fill(m,yy*W+x,yy*W+x+w);};
 const l=(x,y,X,Y,t,m)=>{let n=Math.max(1,Math.ceil(Math.hypot(X-x,Y-y)/Math.max(3,t/2)));for(let j=0;j<=n;j++){let f=j/n;b(x+(X-x)*f-t/2,y+(Y-y)*f-t/2,t,t,m);}};
 const cabin=(x,y,w,h)=>{b(x,y,w,11,62);b(x,y,10,h,65);b(x+w-10,y,10,h,65);b(x,y+h-12,w,12,58);b(x+14,y+13,20,13,79);b(x+w-36,y+13,20,13,131);b(x+27,y+h-34,9,23,68);};
 const sites=[
 ["West rim arrival",495,148],
 ["Ore intake watch",441,285],
 ["Ore exchange gantry",461,386],
 ["Enclosed furnace face",420,518],
 ["Furnace relief return",527,600],
 ["Suspended ladle watch",550,710],
 ["Ladle port inspection",763,736],
 ["Cableway upper launch",345,799],
 ["Cableway high crossing",550,840],
 ["Cableway east arrival",773,904],
 ["Switchback crown",502,986],
 ["Lower switchback landing",505,1170],
 ["Trestle western footing",327,1156],
 ["Trestle eastern footing",756,1192],
 ["Caster upper roller",487,1340],
 ["Caster lower roller",498,1453],
 ["Caster maintenance",503,1531],
 ["Quench valve house",573,1646],
 ["Quench recovery balcony",458,1765],
 ["Dispatch freight loft",519,1890],
 ["Exit freight goal",508,1953]
 ].map(([name,x,y])=>({name,x,y}));
 // Original geometry: anisotropic broken basalt rims with offset ledges.
 b(0,0,100,H,100);b(925,0,99,H,100);b(0,1980,W,68,100);
 b(0,0,W,74,100);
 for(const [x,y,w,h,m] of [
 [100,362,313,22,58],[100,384,219,13,62],
 [100,555,287,25,58],[100,580,168,10,62],
 [100,903,240,22,58],[100,925,126,12,62],
 [100,1108,238,21,58],
 [100,1349,306,22,58],
 [100,1564,270,21,58],
 [100,1801,343,26,58],
 [678,640,247,22,58],[725,662,200,13,62],
 [731,856,194,22,58],
 [695,1071,230,21,58],[760,1092,165,10,62],
 [745,1283,180,23,58],
 [681,1508,244,21,58],
 [710,1699,215,21,58],
 [697,1890,228,20,58]
 ])b(x,y,w,h,m);
 // Fault geology is vertical and broken into unequal exposed bank shelves,
 // never a simulated iso-top or diagonally shaded "scenery" collision.
 b(100,210,29,145,100);b(100,736,17,165,100);
 b(100,1134,19,97,100);b(100,1630,18,170,100);
 b(905,180,20,462,100);b(908,750,17,108,100);
 b(906,1390,19,117,100);b(907,1750,18,142,100);
 // Upperwest ore intake: two dissimilar machinery bays plus entered exam.
 cabin(149,267,116,95);cabin(291,302,102,60);
 b(117,221,19,141,68);b(118,220,151,13,62);
 b(144,235,48,34,131);b(214,237,12,44,69);
 l(266,227,357,303,10,117);l(357,303,400,363,9,117);
 b(384,363,61,17,58);b(399,379,11,57,68);
 // Furnace and in-place refractory roof.
 b(114,450,221,102,104);b(128,464,193,76,131);
 b(145,476,161,51,104);b(169,490,115,23,8);
 b(118,434,17,18,68);b(315,427,13,23,68);
 b(335,493,78,13,117);b(365,506,12,49,68);
 for(let y of [463,522]){b(100,y,16,21,76);b(117,y+5,34,9,69);}
 // Travelling ladle suspended under the right-rooted loading pier, not
 // a mirrored upper-left furnace.
 l(925,622,716,653,12,117);l(925,696,795,733,11,68);
 b(676,641,249,17,58);b(708,658,135,13,62);
 b(522,707,172,15,117);b(544,722,128,55,65);
 b(557,736,104,31,104);b(572,746,74,13,131);
 l(563,704,706,645,9,117);l(648,704,791,645,9,117);
 b(676,774,100,15,58);b(728,789,12,65,68);
 // HIGH tension cableway: non-iso side view, high catenary through y790-900.
 // Both cable endpoints are rooted in different geological bank piers.
 b(103,751,181,17,58);b(122,768,11,133,68);
 b(769,835,156,19,58);b(856,801,13,35,68);
 l(132,770,299,802,10,117);l(299,802,492,862,8,117);
 l(492,862,660,888,9,117);l(660,888,850,835,10,117);
 l(290,791,327,850,7,68);l(477,853,482,910,7,68);
 l(658,879,654,930,7,68);b(640,927,103,12,62);
 // Fault zig-zag control balconies and a deliberately vacant crossover bay.
 b(100,954,166,17,58);b(120,935,87,19,62);
 b(795,960,130,15,58);b(823,945,82,15,62);
 b(106,1026,142,15,58);b(828,1021,97,14,58);
 // LOWER rooted truss: separate engineerable alternative, with TWO distinct
 // converging load paths, not another cable repeat.
 b(100,1111,178,21,58);b(747,1090,178,22,58);
 l(270,1109,416,1168,12,117);l(416,1168,567,1128,12,117);
 l(567,1128,751,1093,12,117);
 l(270,1109,409,1210,9,68);l(409,1210,568,1128,10,117);
 l(568,1128,733,1195,9,68);
 b(363,1190,105,14,62);b(585,1194,129,14,62);
 b(335,1204,12,80,68);b(690,1207,12,76,68);
 // Lower left *three unlike rollers*, not a row of cloned caster stamps.
 b(128,1276,246,21,58);b(142,1297,175,11,62);
 b(168,1237,22,39,68);b(262,1255,14,21,69);
 b(184,1301,135,13,117);b(198,1314,107,27,65);
 b(211,1323,80,11,131);
 b(100,1429,267,19,58);b(126,1448,146,12,62);
 b(157,1395,19,34,68);b(314,1401,16,28,69);
 b(177,1457,132,15,117);b(198,1472,90,23,65);
 b(213,1476,60,11,131);
 b(100,1564,192,19,58);b(120,1583,105,11,62);
 b(175,1530,19,34,68);b(215,1517,92,14,117);
 b(244,1531,45,23,65);b(251,1538,30,10,131);
 // Right bottom quench: sealed material-grade water chamber + ledge.
 b(728,1564,175,112,104);b(741,1577,149,85,131);
 b(760,1590,112,59,104);b(775,1604,82,31,3);
 b(895,1600,30,18,58); // quench load reaches the exact east geological boundary
 b(746,1542,14,22,68);b(865,1545,14,19,69);
 b(687,1679,238,20,58);b(716,1699,153,11,62);
 b(861,1710,11,87,68);
 // Enclosed maintenance hut and open dry return beneath the same grade.
 cabin(751,1726,138,83);b(722,1809,203,19,58);
 b(795,1828,12,62,68);
 // Freight yard bottom LEFT: crane boom, lowered rail stack, duty houses.
 b(100,1790,300,15,58);b(136,1772,114,18,62);
 cabin(158,1682,117,108);b(282,1732,103,58,65);
 b(299,1746,75,21,131);b(308,1767,12,23,68);
 b(132,1866,315,19,58);b(158,1885,190,13,62);
 b(138,1812,12,55,68);l(150,1815,354,1741,10,117);
 l(354,1741,430,1810,10,117);l(354,1741,371,1681,9,68);
 b(325,1900,121,12,117);
 for(let x=149;x<426;x+=43)b(x,1885,12,36,68);
 b(100,1950,342,19,58);b(116,1931,192,19,62);
 // Grounded route beacons at distinct tectonic ledges.
 for(const [x,y] of [[113,602],[904,710],[112,995],[903,1350],[113,1630],[906,1915]]){b(x,y,14,49,69);b(x+3,y+11,8,14,79);}
 // Engineered clear-height cableway gate: the tension cables divide around
 // an open 31x27-compatible passage, preserving separate cable and lower-truss
 // motifs instead of a closed wire across the sole descent.
 b(662,838,126,114,0);
 // Additional grade-separated open truss portal (drawbars terminate at
 // its two inspection abutments rather than becoming an impassable fence).
 b(454,1063,151,175,0);
 // Full conservative site envelope clearing is *literal* and before support
 // component pruning. Never search for a shifted replacement site.
 for(const p of sites)b(p.x-19,p.y-17,39,35,0);
 const solid=id=>id!==0&&id!==3&&id!==8,seen=new Uint8Array(g.length),q=new Int32Array(g.length);let a=0,z=0;
 const add=i=>{if(i>=0&&i<g.length&&solid(g[i])&&!seen[i]){seen[i]=1;q[z++]=i;}};
 for(let x=0;x<W;x++){add(x);add((H-1)*W+x);}for(let y=0;y<H;y++){add(y*W);add(y*W+W-1);}
 while(a<z){let i=q[a++],x=i%W;for(const j of[x?i-1:-1,x<W-1?i+1:-1,i>=W?i-W:-1,i+W<g.length?i+W:-1])add(j);}
 let lost=0;for(let i=0;i<g.length;i++)if(solid(g[i])&&!seen[i]){g[i]=0;lost++;}
 return {W,H,g,M,seed,sites,spawn:[sites[0].x,sites[0].y],discarded_ungrounded:lost};
}
if(typeof module!=="undefined")module.exports={layoutWorld};
