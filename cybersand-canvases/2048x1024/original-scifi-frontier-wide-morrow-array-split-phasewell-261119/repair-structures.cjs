"use strict";
/*
 * Morrow Array R2: explicit functional architecture and visibly anchored works.
 * These are ORIGINAL, authored material cells, not a photographic trace.
 * Called by build.cjs after baseline terrain/clearance cuts, before ordered
 * rectangle canonicalization. Dimensions are the unchanged 2048x1024 plane.
 */
module.exports=function repairMorrow({M,R,P,L,sites}){
  // WEST CIVIC CITADEL. Three distinguishable horizontal program zones:
  // protected xenology booths above, rover/habitation mezzanine, services below.
  // Keep the 40+ cell west access breaks and the (135,495)/(289,402) flight sites.
  R(114,449,124,10,M.S); R(280,449,119,10,M.S);
  R(128,381,108,7,M.C); R(332,382,76,7,M.C);
  R(131,388,8,55,M.C); R(222,387,8,42,M.P);
  R(329,389,8,38,M.P); R(402,389,8,51,M.C);
  R(145,405,61,5,M.U); R(153,412,7,24,M.G);
  R(165,418,30,8,M.F); R(180,427,6,9,M.I);
  R(346,402,47,5,M.U); R(358,410,22,22,M.Q);
  R(367,412,5,15,M.I);
  // Keep the entire lower west-to-rift hull corridor open; its dynamic
  // maneuver envelope is more important than decorative mezzanine dividers.
  // Compact machinery is instead located on the UPPER working-room shelves.
  R(154,432,56,7,M.F); R(347,434,36,7,M.G);
  // Rover service / lower xenology instrumentation below the central flyway.
  R(147,576,92,9,M.C); R(147,585,10,24,M.C);
  R(213,586,8,16,M.P); R(161,590,31,7,M.G);
  R(195,592,11,12,M.F); R(167,605,25,5,M.I);
  R(344,592,53,7,M.S); R(348,599,8,32,M.P);
  R(378,601,8,25,M.P); R(358,613,22,9,M.Q);
  // In-ground load path from inhabited decks into native west cliff.
  L(132,394,77,465,11,M.C); // outer buttress into native west cliff
  L(434,624,452,685,13,M.C); // grounded lower exit without caging Midge

  // SKY RIFT INFRASTRUCTURE. These diagonals are visible load paths; avoid
  // arbitrary solid fill within the intentionally open 2-altitude transit.
  L(482,238,444,141,12,M.C);  // west upper truss into roof geology
  L(1545,292,1603,137,12,M.C); // east upper truss into rock overhang
  L(1577,313,1650,143,12,M.K); // hanging quarantine roof backstay
  L(464,554,406,676,12,M.S); // western tram into cliff foot
  L(1533,555,1665,752,12,M.S); // eastern transit into east slope
  L(564,557,525,625,8,M.P);
  L(1406,547,1466,633,8,M.P);
  R(497,558,25,7,M.U); R(1459,558,26,7,M.U);
  // The heliosails remain elevated but now have continuous tension
  // conductors leading to two separately anchored rift trusses.
  L(1014,146,767,238,6,M.P);
  L(1014,151,1281,236,6,M.P);
  R(1007,142,16,17,M.S);
  R(758,235,18,8,M.K); R(1273,231,18,8,M.K);

  // SPLIT PHASEWELL. Keep its interrupted ellipse, separated crescents and
  // three original named flight centres. An offset damaged west emitter,
  // access gantry and lower bonded foundation make its failure readable.
  L(897,318,921,374,14,M.C);
  L(921,374,881,418,10,M.K);
  R(861,394,73,10,M.S); R(872,403,23,6,M.U);
  L(850,406,835,455,8,M.P);
  R(839,447,11,23,M.Q);
  R(850,473,24,6,M.I);
  L(908,622,872,646,10,M.S);
  R(841,644,102,9,M.S);
  R(848,655,53,8,M.U);
  R(856,665,10,17,M.G);
  R(878,674,16,7,M.I);
  L(923,858,929,925,18,M.C);  // foundation into lower geology
  L(1100,858,1109,933,18,M.C);
  L(900,645,921,678,9,M.K);
  L(1117,674,1152,638,9,M.K);
  R(1096,644,77,10,M.S); R(1123,656,31,6,M.Q);
  R(1154,669,8,15,M.I);
  // Affixed electrical/control spars asymmetric by design, not mirror copies.
  L(881,372,799,347,7,M.U); R(793,343,28,11,M.Q);
  R(813,354,8,21,M.I);
  L(1147,631,1216,605,8,M.U); R(1199,592,31,10,M.G);

  // EAST QUARANTINE HARBOUR. Original shell retained; occupied rooms are now
  // ~50-70 cells tall, with multiple 40-55-cell vertical entrance gaps.
  R(1547,451,151,11,M.S);
  R(1743,451,112,11,M.S);
  R(1903,451,101,11,M.S);
  R(1552,376,129,9,M.C);
  R(1754,375,94,8,M.C);
  R(1900,382,92,8,M.C);
  R(1551,389,9,49,M.P);
  R(1684,385,9,49,M.P);
  R(1753,384,8,49,M.P);
  R(1844,385,8,49,M.P);
  R(1900,390,8,47,M.P);
  R(1986,394,8,45,M.P);
  // Quarantine unload: low cold-seal tanks, specimen instrument screens.
  R(1564,399,91,7,M.U);
  R(1568,406,23,25,M.Q); R(1595,406,23,25,M.Q);
  R(1568,404,50,4,M.L);
  R(1627,408,24,5,M.I);
  L(1661,410,1661,435,6,M.K);
  // Transit customs office between rooms, intentionally asymmetric.
  R(1759,403,79,5,M.G);
  R(1766,408,12,27,M.F);
  R(1783,414,34,8,M.Q);
  R(1813,423,7,11,M.I);
  // Repair/refuel: separate machine geometry, not duplicated freight pods.
  R(1910,403,72,7,M.U);
  R(1921,413,16,24,M.N);
  R(1946,413,16,24,M.N);
  L(1929,411,1929,396,5,M.P);
  L(1953,410,1953,395,5,M.P);
  R(1964,421,12,7,M.I);
  R(1582,551,156,11,M.C); R(1791,555,184,10,M.S);
  L(1587,554,1603,619,9,M.P);
  L(1729,557,1722,622,8,M.P);
  L(1803,562,1836,626,9,M.K);
  L(1945,562,1960,627,8,M.P);
  R(1643,578,23,7,M.G);
  R(1845,579,42,5,M.U);
  // Dock A becomes quarantine sample processing; Dock B receives a lift
  // winch, refuelling tethers, and a separate floor inspection trench.
  R(1629,595,45,7,M.L); R(1640,603,8,9,M.P);
  R(1685,596,14,13,M.F);
  L(1913,581,1901,542,6,M.P);
  L(1901,542,1940,525,5,M.U);
  R(1942,526,17,10,M.N);
  R(1905,612,23,7,M.C);
  R(1960,615,22,7,M.Q);
  // Ground-connected quarantine logistics: stop the factory rooftop from
  // appearing to be an inert floating abstraction.
  L(1966,355,2020,421,15,M.C);
  // Perimeter braces into outer geological banks preserve the central
  // 31x27 ion-exchanger approach; do not cage its previously open bay.
  L(1609,668,1628,760,10,M.C);
  L(1982,665,2025,795,12,M.C);

  // R2 second-pass structural audit: close major ungrounded edge-load
  // paths with explicit solid joints. All terminals enter bedrock or an
  // anchored truss rather than stopping within a few cells of the support.
  L(619,555,430,684,12,M.S);  // middle west sky deck to rock shoulder
  L(922,681,927,938,16,M.C); // phasewell west foot into deep geology
  L(1102,679,1107,939,16,M.C); // phasewell east foot into deep geology
  L(178,383,175,321,8,M.C); // assay booth hanging from load-bearing upper shell
  L(372,384,371,349,8,M.C); // habitat booth attachment into roof
  // LOWER TECTONIC SURVEY. One carved operations destination, one optional
  // shallow access loop and separate calibration / return infrastructure.
  // The 1305,748 named survey centre remains untouched in 31x27 clearance.
  R(1217,852,177,12,M.S);
  R(1226,787,57,7,M.C);
  R(1337,787,57,7,M.C); // 54-wide access breach in upper assay roof
  R(1216,801,10,54,M.C); R(1395,804,10,49,M.C);
  R(1244,806,35,8,M.G); R(1249,816,13,21,M.Q);
  R(1350,811,29,7,M.U); R(1357,819,14,16,M.I);
  R(1295,853,25,13,M.N);
  L(1218,860,1209,897,12,M.C);
  L(1398,860,1434,919,12,M.C);
  // West survey alcove holds a physically separate inspection programme.
  R(748,858,124,11,M.C);
  R(755,815,42,6,M.S); R(829,815,42,6,M.S);
  R(753,826,9,32,M.C); R(867,824,9,33,M.C);
  R(764,834,26,9,M.G); R(841,832,19,14,M.F);
  R(803,855,13,8,M.I);
  // Bedrock-bound registration poles and small radio beacons distinguish
  // the lower traversable survey route from a generic debris shelf.
  for(const [x,h] of [[592,29],[1053,46],[1480,32]]){
    R(x,865-h,7,h,M.P);
    R(x-10,865-h,27,6,M.U);
    R(x-3,865-h-9,12,9,M.I);
  }
};