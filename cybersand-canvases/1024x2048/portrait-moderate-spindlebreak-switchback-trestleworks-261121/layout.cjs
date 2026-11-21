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
 // R6 HIGH: bank-rooted receiving heads with paired tension cables interrupted at Midge portal.
 // Light catenary and suspension hangers; distinct from lower compression truss.
 b(137,718,15,65,68);b(131,715,39,11,62);b(137,747,33,12,58);
 b(861,748,15,109,68);b(850,744,43,11,62);b(849,828,43,12,58);
 for(const p of [[149,725,280,743],[280,743,430,762],[430,762,584,776],[584,776,718,774],[718,774,871,753]])l(...p,7,117);
 for(const p of [[149,740,280,758],[280,758,430,777],[430,777,584,791],[584,791,718,789],[718,789,871,768]])l(...p,5,68);
 l(137,748,209,835,8,117);l(861,776,812,854,8,117);
 for(const [x,top,bottom] of [[213,747,908],[294,755,911],[404,774,917],[474,784,919],[663,788,930],[737,780,927],[822,766,924]])b(x,top,6,bottom-top,68);
 l(226,908,500,921,12,62);l(623,933,859,926,12,62);
 b(101,902,127,21,58);b(854,923,71,15,58);
 // Two staggered engineered Midge-safe apertures; route witness still pending.
 b(452,738,78,87,0);b(508,873,121,83,0);
 b(494,908,12,31,117);b(632,917,12,32,117);
 b(496,912,9,9,79);b(632,920,9,9,79);
 // Fault zig-zag control balconies and a deliberately vacant crossover bay.
 b(100,954,166,17,58);b(120,935,87,19,62);
 b(795,960,130,15,58);b(823,945,82,15,62);
 b(106,1026,142,15,58);b(828,1021,97,14,58);
 // R6 LOW: independently rooted, genuinely triangulated through-truss.
 b(100,1108,180,25,58);b(744,1090,181,22,58);
 l(258,1118,451,1118,13,117);l(610,1105,821,1105,13,117);
 l(118,1207,271,1247,13,58);l(271,1247,813,1247,13,58);
 l(813,1247,876,1109,13,58);
 for(const [x1,y1,x2,y2] of [[267,1118,302,1246],[302,1246,363,1118],[363,1118,438,1247],[438,1247,443,1118],[614,1105,619,1247],[619,1247,693,1105],[693,1105,742,1247],[742,1247,813,1105]])l(x1,y1,x2,y2,10,68);
 b(303,1240,16,39,58);b(753,1240,16,48,58);
 b(436,1108,13,143,68);b(613,1102,13,149,68);
 b(436,1111,12,14,79);b(613,1109,12,14,79);
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
 b(508,873,121,83,0);
 // Additional grade-separated open truss portal (drawbars terminate at
 // its two inspection abutments rather than becoming an impassable fence).
 b(451,1110,158,124,0);
 // R6 collision-sized worker/flight apertures in the suspension hanger bays
 // and heavy-truss bearing portals. These are deliberate engineered openings,
 // NOT proof that the unconstrained shortest route chooses the crossings.
 for(const x of [213,294,404,474,663,737,822])b(x-15,799,36,67,0);
 b(473,1236,97,40,0); // lower chord Midge inspection hatch
 b(790,725,62,143,0); // high cable east receiver airway
 b(716,876,53,59,0); // east access to suspended transfer deck
 b(337,1089,65,61,0); // lower truss west bearing gate
 b(652,1070,74,74,0); // lower truss east bearing gate
 // Full conservative site envelope clearing is *literal* and before support
 // component pruning. Never search for a shifted replacement site.

 // R6 second pass: pulley-anchored opposed-bank overhead cable, with an
 // engineered open flight exchange seam rather than a solid blocking wall.
 b(100,647,60,21,58);b(141,636,16,106,68);b(140,634,40,12,62);
 b(860,638,17,111,68);b(860,637,65,21,58);b(840,633,45,12,62);
 for(const [cx,cy] of [[164,653],[861,651]]){
  for(const [xa,ya,xb,yb] of [[-15,-6,-9,-14],[-9,-14,9,-14],[9,-14,15,-6],[15,-6,15,7],[15,7,8,15],[8,15,-9,15],[-9,15,-15,7],[-15,7,-15,-6]])
   l(cx+xa,cy+ya,cx+xb,cy+yb,5,117);
  b(cx-5,cy-5,10,10,79);
 }
 l(144,647,100,705,7,117);l(876,642,923,699,7,117);
 for(const [xa,ya,xb,yb] of [[179,652,296,661],[296,661,425,670],[425,670,582,673],[582,673,728,670],[728,670,845,650]])l(xa,ya,xb,yb,6,117);
 for(const [xa,ya,xb,yb] of [[180,664,296,672],[296,672,425,681],[425,681,582,685],[582,685,728,681],[728,681,845,662]])l(xa,ya,xb,yb,4,68);
 l(280,668,280,744,6,68);l(403,681,403,755,6,68);
 // Right receiver is attached through bank plate + pulley, not a full-height
 // hanger that traps the genuine ladle-service flight pocket.
 b(371,671,56,13,62);b(395,685,11,47,68);
 b(812,664,36,14,62);
 b(436,656,13,33,62);b(440,663,8,8,79);
 b(560,655,13,33,62);b(559,664,9,9,79);
 b(476,629,61,83,0); // conservative 31x27 overhead service break
 // R6 bounded Art-P1 third pass: two opposed *broken* haul couplings.
 // Matching clutches and torn strands make deliberate interruption legible;
 // they do not suggest an operable continuous rope across the Midge gate.
 // Preserve every air cell in x476..536,y629..711; NO 2D sealing span.
 b(453,660,18,21,117);b(458,665,9,11,79);
 b(543,660,18,21,117);b(547,665,9,11,79);
 l(468,667,473,661,3,68);l(468,672,473,678,3,68);
 l(545,667,539,661,3,68);l(545,672,539,678,3,68);


 for(const p of sites)b(p.x-19,p.y-17,39,35,0);
 const solid=id=>id!==0&&id!==3&&id!==8,seen=new Uint8Array(g.length),q=new Int32Array(g.length);let a=0,z=0;
 const add=i=>{if(i>=0&&i<g.length&&solid(g[i])&&!seen[i]){seen[i]=1;q[z++]=i;}};
 for(let x=0;x<W;x++){add(x);add((H-1)*W+x);}for(let y=0;y<H;y++){add(y*W);add(y*W+W-1);}
 while(a<z){let i=q[a++],x=i%W;for(const j of[x?i-1:-1,x<W-1?i+1:-1,i>=W?i-W:-1,i+W<g.length?i+W:-1])add(j);}
 let lost=0;for(let i=0;i<g.length;i++)if(solid(g[i])&&!seen[i]){g[i]=0;lost++;}
 return {W,H,g,M,seed,sites,spawn:[sites[0].x,sites[0].y],discarded_ungrounded:lost};
}
if(typeof module!=="undefined")module.exports={layoutWorld};
