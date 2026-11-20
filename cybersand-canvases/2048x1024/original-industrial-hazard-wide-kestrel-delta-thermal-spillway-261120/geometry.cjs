'use strict';
// ORIGINAL KESTREL-DELTA THERMAL SPILLWAY — orthographic 2D material cells.
// Designed for this run; no source image or previous map geometry traced.
const W=2048,H=1024,SEED=202611203;
const SITES=[
 ['Landing inspection',235,449],['Drum shear observatory',369,571],
 ['Smelter upper walk',555,475],['Lava-isolation desk',720,562],
 ['West throat gate',856,516],['Cascade throat',1042,538],
 ['East throat gate',1148,570],['Slag recovery',1072,842],
 ['Cryo trestle',1350,472],['Coolant survey',1482,526],
 ['Scrubber upper approach',1673,437],['Condensing gallery',1802,506],
 ['Distal safety exit',1952,578],['Smelter lower return',761,833],
 ['Cooling lower return',1524,858]
];
const CROPS=[
 ['01-drum-shear',40,265,395,565],
 ['02-smelter-cassettes',418,285,425,620],
 ['03-spillway-throat',824,230,430,660],
 ['04-cryo-recovery',1248,315,400,590],
 ['05-plume-scrubber',1630,205,410,690],
 ['06-lower-culvert',808,710,515,295]
];
const COLORS={0:[8,11,18],3:[47,127,210],8:[241,78,31],
 58:[111,118,126],62:[138,151,166],68:[102,124,135],
 70:[211,207,183],76:[230,186,41],77:[25,211,220],
 79:[250,168,44],100:[54,56,61],101:[24,19,32],
 104:[200,152,98],117:[124,134,149],120:[134,189,197]};
function materialWorld(){
 const g=new Uint8Array(W*H); let seed=SEED>>>0;
 const rnd=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return (seed>>>0)/4294967296};
 const rect=(x,y,w,h,m)=>{x=Math.max(0,Math.floor(x));y=Math.max(0,Math.floor(y));const xx=Math.min(W,Math.floor(x+w)),yy=Math.min(H,Math.floor(y+h));for(let j=y;j<yy;j++)g.fill(m,j*W+x,j*W+xx)};
 const line=(x1,y1,x2,y2,t,m)=>{const n=Math.max(1,Math.ceil(Math.max(Math.abs(x2-x1),Math.abs(y2-y1))/3));for(let i=0;i<=n;i++){const u=i/n;rect(Math.round(x1+(x2-x1)*u-t/2),Math.round(y1+(y2-y1)*u-t/2),t,t,m)}};
 const frame=(x,y,w,h,t,m)=>{rect(x,y,w,t,m);rect(x,y+h-t,w,t,m);rect(x,y,t,h,m);rect(x+w-t,y,t,h,m)};
 const ring=(cx,cy,rx,ry,th,m)=>{for(let y=cy-ry;y<=cy+ry;y++){if(y<0||y>=H)continue;const fy=(y-cy)/ry;for(let x=cx-rx;x<=cx+rx;x++){if(x<0||x>=W)continue;const f=((x-cx)/rx)**2+fy**2;if(f<=1&&f>=(1-th/rx)**2)g[y*W+x]=m}}};
 const fastener=(x,y,m=76)=>{rect(x-7,y-7,15,14,58);rect(x-4,y-4,9,8,m)};
 // Rooted dark basalt with an uneven industrial cut profile; single continuous load path.
 for(let x=0;x<W;x+=8){const top=Math.round(922+8*Math.sin(x/129)+5*Math.sin(x/43));rect(x,top,8,H-top,100)}
 rect(0,982,W,42,101);rect(0,916,W,11,58);rect(27,933,1990,9,62);
 // West: asymmetrical roof, cargo hopper/shear drum and entered assay levels.
 rect(82,471,18,457,58);rect(388,496,18,432,58);
 line(83,474,154,298,17,62);line(154,298,330,354,17,62);line(330,354,405,500,17,62);
 line(154,303,158,501,11,68);line(332,360,330,510,12,68);
 rect(108,765,273,14,62);rect(110,770,16,152,58);rect(368,771,16,151,58);
 line(116,516,375,530,14,117);rect(117,602,260,12,68);
 line(179,529,181,767,10,58);line(347,535,347,766,10,58);
 ring(262,674,83,71,13,62);
 rect(251,742,23,23,58);rect(255,751,14,24,117);
 line(192,662,231,646,10,104);line(300,695,326,705,9,104);
 rect(137,623,34,12,70);rect(137,635,10,34,58);
 rect(342,625,31,12,70);rect(365,638,9,31,58);
 rect(198,563,119,12,70);rect(207,574,12,29,58);rect(302,574,12,29,58);
 frame(221,538,78,30,6,68);rect(237,558,39,8,120);rect(246,529,9,12,77);
 rect(148,731,45,11,70);rect(153,741,11,25,58);
 rect(308,734,47,11,70);rect(344,745,10,23,58);
 // Three independent air windows remain between the two dry decks.
 rect(142,525,38,43,0);rect(343,555,28,37,0);
 // High freight transfer: eccentric crane mounted on the load-bearing north mast.
 line(161,359,269,370,10,62);line(266,371,266,461,8,117);
 line(266,457,235,481,8,68);line(266,457,296,481,8,68);
 rect(234,484,64,11,104);rect(235,495,11,23,58);rect(286,495,11,23,58);
 // Stage B: stepped blast cassettes, staggered arched frame, side-approachable isolation desks.
 rect(461,566,18,362,58);rect(816,520,18,408,58);
 line(467,566,513,348,18,58);line(513,348,688,385,18,58);line(688,385,818,520,18,58);
 rect(522,360,15,208,68);line(687,386,687,563,14,117);
 rect(486,600,327,13,62);rect(485,791,330,15,62);
 rect(492,793,16,130,58);rect(800,797,15,126,58);
 rect(554,613,16,184,58);rect(745,612,16,182,58);
 rect(523,630,103,72,8);frame(511,618,127,97,12,104);
 rect(529,713,17,78,58);rect(606,715,17,77,58);
 rect(665,640,102,68,3);frame(653,628,126,92,12,58);
 rect(669,720,16,71,58);rect(746,720,16,71,58);
 rect(498,747,47,10,68);rect(495,756,10,37,58);
 frame(510,727,42,28,5,70);rect(518,748,27,6,79);
 rect(697,748,77,10,68);rect(704,758,10,33,58);
 frame(715,728,47,29,6,62);rect(726,749,26,7,77);
 rect(617,727,10,64,117);line(627,735,656,735,9,68);
 // Dry lower refuge with asymmetrically sloped capture flumes and hanging sample gauges.
 rect(531,853,238,11,117);rect(535,864,10,57,58);rect(760,865,10,57,58);
 line(555,830,625,860,11,68);line(625,860,682,837,11,68);
 rect(614,853,13,25,58);frame(692,812,54,30,6,70);
 rect(709,835,26,6,120);rect(726,842,10,14,58);
 // Stage C: large V-shaped sacrificial deflector and deep aerial throat, with support triangles.
 rect(858,624,21,304,58);rect(1205,660,22,268,58);
 line(864,624,951,321,21,58);line(951,321,1020,389,17,68);
 line(1213,660,1132,366,20,58);line(1132,366,1087,419,18,68);
 line(953,328,1004,242,14,117);line(1130,372,1098,245,14,117);
 // Inverted suspended blast-airfoil held by asymmetric steel connections.
 line(1004,240,1098,240,14,62);
 line(1004,242,1031,341,12,62);line(1098,242,1068,341,12,62);
 rect(1030,327,39,12,76);rect(1038,339,23,14,68);
 rect(862,767,113,13,62);rect(868,780,13,134,58);
 rect(1106,799,112,13,62);rect(1200,812,12,111,58);
 line(881,767,959,804,11,117);rect(956,804,12,113,58);
 line(1110,799,1179,758,11,117);rect(1178,757,11,166,58);
 // Lower contamination return: two independent load-bearing drains, open centre access.
 rect(901,899,259,11,68);rect(917,908,13,19,58);
 rect(1135,908,13,19,58);
 rect(980,862,76,11,70);rect(991,873,11,26,58);
 frame(1008,835,48,27,6,68);rect(1020,855,25,6,120);
 rect(1080,869,56,11,62);rect(1101,880,11,19,58);
 // Reinforced transverse ties attach to deep stakes, never closing the central throat.
 line(863,674,918,704,12,62);line(1208,692,1152,714,12,62);
 // Stage D: discontinuous cooling zig-zag, three different sizes and distinct service elevations.
 rect(1268,588,17,340,58);rect(1601,635,18,293,58);
 line(1272,589,1344,395,18,62);line(1344,395,1474,439,15,62);
 line(1474,439,1610,635,18,62);
 rect(1300,676,295,14,68);rect(1288,792,305,13,62);
 rect(1298,805,14,119,58);rect(1572,804,14,119,58);
 rect(1339,692,17,105,58);rect(1473,692,17,107,58);
 rect(1320,715,82,53,3);frame(1309,703,104,77,11,58);
 rect(1320,779,14,16,58);rect(1390,779,14,16,58);
 rect(1460,730,89,49,3);frame(1449,718,111,72,11,104);
 rect(1459,789,15,8,58);rect(1540,790,15,8,58);
 frame(1354,590,73,39,7,70);rect(1367,620,46,8,120);
 rect(1386,628,11,48,58);rect(1415,628,10,48,58);
 line(1410,607,1493,592,10,68);rect(1490,591,13,85,58);
 frame(1500,563,54,30,6,62);rect(1510,584,34,7,77);
 rect(1499,592,11,33,58);rect(1541,593,11,32,58);
 // Lower access continues between open stairwell apertures, no image-only hatching.
 line(1333,851,1400,880,10,68);line(1400,880,1487,843,10,68);
 rect(1395,878,13,47,58);rect(1483,844,11,81,58);
 frame(1510,816,52,29,5,70);rect(1523,836,28,7,120);
 rect(1552,845,12,18,58);
 // Stage E: single central inverted plume funnel with side-triangulated vacuum canopy.
 rect(1655,621,20,307,58);rect(1996,627,19,301,58);
 line(1661,621,1732,339,20,58);line(1732,339,1848,262,20,62);
 line(1848,262,1957,347,20,62);line(1957,347,2004,627,20,58);
 rect(1841,239,16,60,58);rect(1820,230,57,10,62);
 line(1740,344,1785,578,12,68);line(1952,350,1901,578,12,68);
 rect(1697,622,291,13,62);rect(1681,795,302,14,68);
 rect(1695,810,17,116,58);rect(1963,809,17,117,58);
 rect(1742,641,13,152,58);rect(1901,642,14,152,58);
 rect(1772,671,105,49,3);frame(1761,660,127,72,11,58);
 rect(1773,731,17,65,58);rect(1869,733,17,65,58);
 rect(1701,739,48,11,70);rect(1710,751,10,44,58);
 frame(1724,709,44,28,5,68);rect(1735,730,24,6,120);
 rect(1907,746,53,11,70);rect(1950,757,11,38,58);
 frame(1906,708,50,31,6,62);rect(1919,730,23,7,77);
 // Divergent extractor vanes physically mounted to central freight beam.
 line(1778,627,1814,601,9,117);line(1814,601,1848,627,9,117);
 line(1848,626,1894,588,9,117);rect(1845,626,12,40,58);
 fastener(1814,605,76);fastener(1894,592,79);
 // Continuous low ledges against actual bedrock, with recuperation shelters.
 rect(120,877,239,10,117);rect(487,875,319,10,117);
 rect(1269,881,332,10,117);rect(1658,872,335,10,117);
 rect(140,887,11,39,58);rect(338,887,11,39,58);
 rect(502,887,11,39,58);rect(796,887,11,39,58);
 rect(1283,890,11,39,58);rect(1590,890,11,39,58);
 rect(1675,881,11,45,58);rect(1976,882,11,43,58);
 // Safety markings remain tied to solid platforms; no artificial stand-alone pixels.
 rect(123,778,39,7,76);rect(747,804,39,7,79);
 rect(885,785,34,7,76);rect(1570,794,25,8,77);
 // Purpose-built 68+ cell Midge airlocks between every grounded industrial district.
 // These are physical excavated gates, NOT route waivers or post-processing BFS shifts.
 rect(304,494,63,107,0); // west drum overpass hatch
 rect(365,426,68,229,0); // dock -> exterior transit gap
 rect(449,438,64,211,0); // smelter ingress
 rect(789,432,66,217,0); // smelter east lock
 rect(878,452,79,226,0); // west V-throat emergency port
 rect(1133,449,102,230,0); // east V-throat emergency port
 rect(1240,419,96,254,0); // cooling ingress
 rect(1577,414,96,268,0); // cryo to scrubber
 rect(1645,408,88,273,0); // scrubber ingress
 rect(1930,472,92,227,0); // scrubber right egress
 // Lower habitable recovery hatches bridge upper and below-deck circuits.
 rect(777,758,76,118,0);
 rect(1559,757,86,124,0);
 // Repair continuous actual structural load paths around the excavated service gates.
 rect(520,550,14,70,58); // smelter roof-to-gallery tie
 line(926,450,868,640,13,58); // sloped strut runs along west spillway portal edge
 rect(1114,442,12,375,58); // right spillway hangar mast to deep rooted bench
 rect(1417,679,13,132,58); // cryo ridge connected through the dry separator between liquids
 rect(816,649,18,109,0); // obsolete upper column isolated by the new gateway
 rect(1601,682,18,75,0); // obsolete truncated outlet column
 // Entered local lock openings: real 1:1 clearance, not tolerance in path validation.
 rect(242,420,102,105,0); // landing → entered shear observatory
 rect(918,478,128,121,0); // west arm → inner sacrificial throat
 rect(1723,461,112,116,0); // scrubber → condensing gallery
 rect(1510,790,97,109,0); // dry cryo return ladder/service hatch
 // Remove truncated struts left inside the two entered maintenance portals.
 rect(1552,850,11,58,0);
 rect(1775,575,21,12,0);
 // Full Midge-sized side-lock through the east hangar mast;
 // the opposite west strut carries the roof after the safe opening.
 rect(1106,486,40,171,0);
 rect(1114,442,12,44,0); // discard free-hanging stub above emergency lock
 // Seal the two lava/water process cassettes after ALL structural edits.
 for(let i=0;i<g.length;i++)if(g[i]===3||g[i]===8)g[i]=0;
 rect(523,630,103,73,8);frame(511,618,127,97,12,104);
 rect(665,640,102,68,3);frame(653,628,126,92,12,58);
 rect(1320,714,82,55,3);frame(1309,703,104,77,11,58);
 rect(1460,729,89,50,3);frame(1449,718,111,72,11,104);
 rect(1772,671,105,50,3);frame(1761,660,127,72,11,58);
 // Three exposed service platforms have direct steel-bearing legs into anchored slabs.
 rect(139,662,9,113,58);rect(365,661,9,114,58);

 // R2 / Independent Shepherd P1 — rooted material-cell process machinery.
 // Drums, valves and dry ducts are inert solid depictions, not live mechanisms.
 // I. Drum shear: supported ore discharge, inspected roll-drive and assay gantry.
 rect(348,757,57,12,62);rect(392,767,91,10,68);rect(417,739,31,27,117);rect(424,744,17,10,100);rect(415,760,36,7,76);rect(407,777,9,25,58);
 line(348,759,391,769,9,104);rect(356,750,18,9,70);rect(319,716,17,9,70);rect(325,725,9,26,58);
 frame(337,680,40,26,5,68);rect(346,701,23,6,77);rect(350,708,9,50,58);rect(377,689,13,8,76);
 // II. Hot slag isolates and cold pressure-skimmer: different workfaces.
 rect(571,590,70,11,70);rect(578,559,58,33,62);rect(582,565,48,20,101);rect(588,571,8,8,79);rect(604,570,15,9,76);rect(624,568,6,13,77);rect(581,585,10,12,58);rect(627,585,9,12,58);
 rect(760,594,45,9,70);rect(771,566,27,28,62);rect(777,572,15,12,101);rect(780,574,6,7,77);rect(766,587,9,14,58);
 rect(519,723,100,10,104);rect(526,733,15,28,58);rect(602,734,14,29,58);rect(543,742,59,8,79);rect(558,753,13,22,58);rect(591,752,11,23,58);
 rect(660,731,117,9,68);rect(671,740,12,35,58);rect(754,741,12,35,58);rect(688,742,61,9,120);frame(696,752,47,27,6,70);rect(705,758,29,15,101);rect(710,762,9,7,77);rect(730,764,8,6,76);
 // III. Dry slag removal / weighing below a clear V-throat with retained bypass.
 rect(929,889,118,10,62);rect(938,866,9,25,58);rect(1029,865,9,25,58);rect(947,866,83,8,104);rect(954,852,9,14,58);rect(1018,851,9,15,58);rect(963,848,55,7,70);rect(972,852,8,13,76);line(962,878,1017,887,9,117);
 frame(953,808,64,29,6,68);rect(969,829,30,8,120);rect(968,838,10,28,58);
 rect(1133,886,49,11,62);rect(1140,865,9,22,58);rect(1167,859,11,28,58);frame(1128,833,54,27,6,70);rect(1143,853,26,7,79);rect(1150,861,10,19,58);
 rect(1151,858,8,6,58); // root the second station's independent sample weigh-head
 rect(1191,875,109,11,68);rect(1194,885,11,22,58);rect(1281,886,10,40,58);line(1182,856,1237,876,10,117);
 // IV. Twin coolant cassettes: coil/height gauge versus relief/assay flow.
 rect(1288,732,20,12,68);rect(1290,744,9,47,58);rect(1300,776,14,12,120);rect(1314,782,27,9,77);
 rect(1280,744,12,12,58); // short genuine anchor to the west coolant main pier
 rect(1345,646,58,11,70);rect(1357,654,11,22,58);rect(1391,655,10,22,58);frame(1364,611,47,29,6,62);rect(1375,633,24,7,120);rect(1377,641,9,14,58);
 rect(1555,727,39,10,104);rect(1579,736,11,57,58);rect(1555,780,23,9,79);rect(1569,789,11,12,58);
 rect(1499,647,66,10,68);rect(1510,653,10,23,58);rect(1552,654,9,22,58);frame(1520,610,36,31,6,70);rect(1529,632,17,7,77);rect(1536,642,8,16,58);
 rect(1413,672,38,11,62);rect(1421,658,12,15,58);rect(1436,658,9,15,117);fastener(1426,666,76);rect(1461,671,45,12,62);rect(1472,658,10,13,58);fastener(1494,668,77);
 // V. Condenser: apex-to-scrubber discharge duct and lower dry test rack.
 rect(1843,288,13,332,68);rect(1847,323,5,278,101);rect(1824,594,54,12,62);rect(1819,607,11,23,58);rect(1872,606,11,31,58);rect(1840,630,22,15,76);
 line(1844,621,1775,656,12,117);line(1855,621,1927,652,12,117);rect(1761,649,24,13,62);rect(1918,645,16,20,58);rect(1891,635,79,11,68);rect(1951,643,11,37,58);
 rect(1910,757,57,10,70);rect(1917,738,11,20,58);rect(1951,738,10,20,58);frame(1924,709,40,31,6,62);rect(1933,732,22,7,77);rect(1937,741,9,17,58);
 rect(1772,767,94,9,104);rect(1780,748,10,20,58);rect(1848,747,10,22,58);rect(1791,748,55,9,70);rect(1811,731,14,18,68);rect(1815,734,6,8,76);
 return g;
}
module.exports={W,H,SEED,SITES,CROPS,COLORS,materialWorld};
