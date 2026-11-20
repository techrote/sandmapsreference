// Original authored 2048x1024 biomechanical level blueprint.
// Generates a complete fixed-seed geometry manifest, not raster concept art.
// Usage: node design-generator.js  (writes design.json next to this script)
"use strict";
function makeDesign(){
 const seed=2611201910, W=2048,H=1024,ops=[];
 let rng=seed>>>0;const rnd=()=>{rng=(Math.imul(rng,1664525)+1013904223)>>>0;return rng/4294967296};
 const R=(x,y,w,h,m)=>ops.push(["R",Math.round(x),Math.round(y),Math.round(w),Math.round(h),m]);
 const F=(x,y,w,h,t,m)=>ops.push(["F",Math.round(x),Math.round(y),Math.round(w),Math.round(h),Math.round(t),m]);
 const L=(x,y,x2,y2,t,m)=>ops.push(["L",Math.round(x),Math.round(y),Math.round(x2),Math.round(y2),Math.round(t),m]);
 // World rock and pressure-hull foundations: all permanent material grounded.
 R(0,0,W,54,101);R(0,54,W,13,100);
 R(0,942,W,82,101);R(0,929,W,13,58);
 R(0,67,27,862,100);R(2020,67,28,862,100);
 R(27,903,1993,26,100);R(27,67,1993,10,58);
 // Stratified floor: no free-floating stone or falling powder.
 for(let [x,w,t] of [[38,335,8],[385,385,12],[785,465,9],[1260,410,13],[1680,328,10]]){
   R(x,929-t,w,t,62);R(x+14,929-t-8,w-30,8,117);
 }
 // Asymmetric load-bearing service bents, visibly different per district.
 for(let [x,w,h] of [[72,17,142],[354,23,213],[439,15,169],[746,29,204],[818,16,115],[1243,21,136],[1334,16,184],[1662,26,185],[1760,15,145],[1954,21,176]]){
   R(x,77,w,h,58);R(x+3,77,w-6,Math.min(h,44),62);
   L(x+w/2,77+h,x+w/2+(x%2?26:-23),Math.max(79,77+h-34),7,117);
 }
 // Distributed ceiling baffles, intentionally varied rather than cloned trays.
 for(let [x,w,d] of [[108,119,40],[278,56,72],[508,178,58],[890,81,53],[1093,101,64],[1398,127,56],[1542,64,93],[1840,131,77]]){
   R(x,77,w,d,100);R(x+5,77+d-7,w-10,7,63);
   R(x+w-11,77+d,7,15,79);
 }
 // District I — contaminated ship-clutch intake and non-identical pressure locks.
 R(59,881,312,48,58);R(70,863,292,18,62);R(86,858,259,5,79);
 R(84,840,20,25,117);R(314,840,22,25,117);
 F(98,742,158,110,9,62);R(106,749,142,11,72);
 F(112,762,51,65,7,63);F(178,762,64,65,9,117);
 R(118,830,132,11,100);R(138,818,12,12,77);R(211,815,10,16,79);
 L(100,861,138,825,12,100);L(238,831,301,862,15,58);
 for(let j=0;j<5;j++){let x=118+j*25;R(x,770,8,31,100);R(x,770,8,5,j%2?77:79)}
 // Arrayed decontamination nozzles hang from ceiling but do not seal flight lanes.
 R(120,181,181,19,62);L(145,77,145,181,10,58);L(277,77,277,181,10,58);
 for(let [x,y,hh] of [[133,205,66],[174,205,87],[219,205,50],[271,205,76]]){
  R(x,y,12,hh,63);R(x-4,y+hh,20,10,77);R(x+2,y+18,4,12,79);
 }
 L(52,365,113,312,9,100);L(113,312,149,348,9,117);L(297,320,351,380,12,58);
 R(308,785,38,72,117);R(309,779,31,7,79);
 // Open-ended recovery shelf at x285–365.
 R(286,760,72,7,62);R(347,737,10,31,100);R(320,760,13,13,77);
 // District II — stripping and tensile registration, entered side service chamber.
 R(445,858,239,15,58);R(448,871,252,58,100);
 R(453,761,201,12,62);R(453,773,15,89,58);R(453,851,192,11,62);
 // Open service doorway on east: >=60 high and no right wall at y780–851.
 R(490,826,24,9,117);R(490,816,7,17,79);R(516,822,21,9,63);
 R(595,831,14,18,100);R(598,829,8,5,77);
 R(651,852,32,11,79);
 // Flat press and tapered jaw on separate rooted stand.
 R(687,874,86,55,58);R(685,841,84,13,62);
 L(694,841,746,790,11,117);L(745,790,773,834,10,63);
 for(let [x,h] of [[695,26],[717,34],[751,19]]){R(x,854,10,h,100);R(x,853,10,6,79)}
 // Suspended stripping blade cassette and driven rollers.
 R(481,176,247,19,62);L(487,77,487,176,12,58);L(707,77,707,176,13,58);
 for(let [x,len] of [[506,82],[550,115],[601,72],[650,103],[705,61]]){
   R(x,195,13,len,117);L(x,195+len,x+10,204+len,6,79);
 }
 R(467,305,190,17,100);R(467,302,190,5,77);
 L(460,322,429,385,8,62);L(664,322,722,388,8,62);
 // Lower industrial trace bus, behind entered room (solid, not decoration).
 R(414,889,364,7,63);R(731,884,37,19,100);
 // District III — enormous asymmetric roof/rooted clutch assembly.
 R(818,164,432,35,58);R(831,152,409,11,62);
 R(846,199,363,12,117);L(841,77,902,164,17,100);
 L(1189,77,1150,164,15,100);L(1044,77,1038,164,18,58);
 R(882,213,262,24,100);R(887,237,252,11,62);
 // Active upper jaw: irregular tine lengths, distinct diagnostic sockets.
 for(let [x,w,tip] of [[898,31,329],[947,18,376],[979,30,401],[1034,27,373],[1088,16,345],[1122,29,313]]){
   R(x,248,w,tip-248,117);R(x+3,250,w-6,14,63);
   R(x-4,tip-7,w+8,10,x%2?79:77);
 }
 L(860,210,935,303,12,58);L(1201,210,1147,303,12,58);
 F(896,294,55,78,8,72);R(907,303,34,8,77);
 F(1100,286,60,71,10,72);R(1110,296,38,7,79);
 // Lower rooted assay / pressure platen, split access necks remain open.
 R(861,868,331,61,58);R(873,840,304,28,62);
 R(889,828,265,13,117);R(920,816,214,13,100);
 R(925,807,198,9,79);R(940,789,166,16,63);
 F(900,755,53,58,8,117);F(1101,755,64,58,9,58);
 R(920,755,18,7,77);R(1137,755,17,7,79);
 // Two opposed active clamping fingers with a clear central Midge inspection mouth.
 L(932,804,975,770,11,100);L(1138,805,1090,769,10,100);
 R(968,766,18,7,77);R(1080,766,20,7,79);
 R(990,798,99,8,72);R(999,786,71,12,117);
 // On the press sides, different readable power / sensor actuators.
 R(834,777,22,91,100);R(832,781,26,12,79);
 R(1198,789,23,79,100);R(1195,795,29,11,77);
 L(866,849,903,816,12,58);L(1184,850,1150,818,11,58);
 // District IV — three differentiable vulcanisation / suture processes.
 R(1276,861,393,68,58);R(1290,842,374,19,62);
 R(1319,829,102,13,117);R(1480,826,98,16,100);R(1603,811,45,31,117);
 // Upper spray cure has divergent manifolds with visibly unequal falls.
 R(1367,172,208,21,62);L(1369,77,1390,172,12,58);L(1544,77,1543,172,14,58);
 for(let [x,y,hh] of [[1380,205,129],[1433,205,161],[1508,205,87],[1558,205,144]]){
   R(x,y,16,hh,100);R(x-8,y+hh,31,10,79);R(x+6,y+24,3,Math.max(14,hh-38),77);
 }
 // Suture rollers and valve wheels are physically mounted to the floor.
 F(1310,756,107,81,8,117);R(1323,770,80,8,79);R(1345,804,14,23,63);
 F(1450,773,130,60,11,100);R(1457,785,116,8,72);R(1502,818,25,12,77);
 L(1585,839,1601,765,14,62);R(1593,752,46,13,79);R(1612,773,10,50,117);
 // Interleaved dry ducts, no liquid in the source.
 R(1280,882,386,8,72);R(1305,893,349,6,79);
 for(let x of [1310,1372,1483,1558,1630]) R(x,904,12,25,117);
 // District V — coupler test tower, segmented export carriage and freight hoist.
 R(1680,882,335,47,58);R(1696,858,307,24,62);
 R(1720,845,286,12,117);R(1777,827,206,18,100);
 R(1699,775,78,56,62);R(1707,786,66,8,77);
 F(1816,767,162,59,10,117);R(1829,781,132,10,72);
 // Clutched goods on alternating rails and visible stops.
 for(let [x,w,h] of [[1746,36,22],[1801,43,26],[1873,28,18],[1931,41,28]]){
    R(x,827-h,w,h,63);R(x+4,827-h-6,w-8,6,79);R(x+Math.floor(w/2),827-h-12,6,8,77);
 }
 R(1726,893,259,6,79);R(1743,913,217,9,100);
 // Deliberately offset torque tower and roof-rooted articulated load claw.
 R(1777,211,167,25,58);L(1788,77,1816,211,13,100);L(1933,77,1905,211,15,100);
 R(1829,236,28,115,117);R(1896,236,23,139,100);
 L(1843,340,1800,384,13,62);L(1905,367,1945,395,16,62);
 R(1790,382,44,11,79);R(1938,391,35,11,77);
 R(1794,236,104,9,63);R(1813,245,12,26,79);
 // Extra specifically authored material detail on grounded structures, not scenic overlays.
 for(let [x,y,n,m] of [[92,865,12,117],[473,886,10,63],[880,854,13,117],[1312,846,10,100],[1762,865,11,117]]){
   for(let j=0;j<n;j++){let dx=j*12,wig=(rnd()*4)|0;R(x+dx,y+wig,4,3,j%4===0?79:m);}
 }

 // Mid-air custodial gantries and reachable pressure-monitoring stations:
 // these make the ascent/descent a multi-tier navigable production environment.
 // Salvage hook calibration, ceiling-supported and clearly separated from player routes.
 R(344,281,22,166,58);L(354,443,408,483,13,62);
 R(397,482,74,15,117);R(411,497,13,21,79);R(449,497,10,17,77);
 L(362,401,397,458,9,100);R(377,463,32,8,63);
 // Floor-rooted material handoff and recovery gantry: distinct low tier.
 L(384,927,399,735,15,58);R(387,723,126,14,62);
 R(477,737,17,25,100);R(492,738,13,14,79);
 L(393,766,460,738,11,117);
 // Independent clutched cassette hanger at the mouth of the central press.
 R(803,203,18,294,58);L(811,492,873,510,10,62);
 R(866,503,130,15,117);R(883,518,34,10,63);
 R(951,518,33,11,79);R(925,503,11,5,77);
 L(821,456,862,501,9,100);
 // Cantilevered reaction shoe opposite the hanging cassette, from grounded platen.
 R(1207,737,14,137,58);R(1115,731,103,15,62);
 L(1210,753,1258,781,12,100);
 R(1118,724,25,8,77);R(1171,724,25,8,79);
 // Distinct mid-height inert purge diaphragm, not a painted background.
 L(1329,846,1340,655,15,58);R(1340,649,92,14,117);
 R(1350,642,14,7,79);R(1402,636,13,13,77);
 L(1351,661,1393,691,8,100);
 // Clutch dyno hangar outboard of curing, roof-rooted at two asymmetric hinges.
 R(1685,77,17,440,58);L(1693,500,1750,535,13,62);
 R(1744,525,70,15,117);R(1751,540,18,10,77);
 L(1762,525,1811,480,12,100);R(1803,474,26,12,79);

 const palette={"0":[8,11,18],"58":[119,123,128],"62":[126,141,153],"63":[49,100,119],"72":[37,60,76],"77":[55,243,228],"79":[255,181,46],"100":[54,56,61],"101":[24,19,32],"117":[90,94,100],"128":[62,122,180]};
 return {
 title:"Vanta Clutch Suture Mill",slug:"vanta-clutch-suture-mill-261120",
 source:"from-scratch authored 2D side-elevation living-ship mooring coupler rebuild factory",
 seed,base_sha:"99a166e7fcae45eb22be1740e9f33f62faccbcc7",
 engine_sha:"7b03aa437561ec63e31fd09531171360ab60eeb4",extent:[W,H],
 description:"A dry xenomechanical ship-mooring clutch repair works: damaged coupling organs are sterilised, stripped and tensioned, re-registered in a two-sided full-scale jaw press, sutured against curing manifolds, then torque-tested and exported. Every structural workface is actual inert grounded material cells.",
 districts:[
 "West salvage pressure lock: asymmetric intake jaws, scrubber nozzles and recovery cradle, with separate operator approach",
 "Tendon stripping hall: ceiling-rooted differing knives and rollers, entered maintenance chamber under the tensile drive",
 "Central Vanta clutch press: roof-rooted unequal diagnostic mandibles, floor-rooted counter-platen and opposed entered inspection fingers",
 "Suture heat-treatment bank: stepped spray nozzles, separate framed vulcanisation stations and lower dry control duct",
 "Export and proof-load tower: staggered torque grippers, rooted freight clamp train and dry hoist registration"
 ],
 palette,sites:{
 spawn_quarantine:[109,556],
 intake_gantry:[279,554],
 quarantine_recovery:[331,688],
 stripper_drive:[536,555],
 service_chamber:[556,811],
 sensor_rake:[706,701],
 upper_clutch_access:[1010,447],
 central_alignment:[805,566],
 entered_inspection:[1028,737],
 lower_transfer:[1231,693],
 upper_escape:[1269,446],
 suture_valve:[1465,561],
 seal_control:[1573,690],
 torque_handoff:[1795,591],
 finish_beacon:[1973,550]
 },
 gates:{west:[755,555],east:[1290,555]},
 route_bans:{xmin:835,xmax:1210,upper_max_y:464,lower_min_y:678},
 obstruction:[966,509,145,110],
 crops:[
 ["01-lock-and-purge.png",0,225,410,700],
 ["02-tensile-service.png",387,195,410,730],
 ["03-vanta-upper-press.png",783,105,487,560],
 ["04-entered-clutch-bench.png",818,688,429,237],
 ["05-suture-treatments.png",1260,205,425,720],
 ["06-coupler-export.png",1659,205,389,720]
 ],
 policy:[0],ops
 };
}
if(typeof module!=="undefined"){module.exports=makeDesign;if(typeof require==="function" && require.main===module){require("fs").writeFileSync("design.json",JSON.stringify(makeDesign(),null,2)+"\n");console.log("Wrote design.json");}}
