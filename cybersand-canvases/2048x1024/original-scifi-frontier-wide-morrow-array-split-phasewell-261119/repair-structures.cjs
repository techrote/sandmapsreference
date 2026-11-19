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

  // R3: material-cell load paths, not visual overlay. Every unchanged exact
  // named site was preflighted using full 19x15,23x19,31x27 envelope floods.
  // Bracing stays near existing terrain and avoids severing the flight lanes.
  // Overhead geological attachment for the inhabited east roof and airlock.
  L(1600,350,1611,160,18,M.S);
  L(1588,389,1583,314,14,M.S);
  L(1600,419,1600,455,12,M.S);
  // West xenology ceiling anchored diagonally to real rock, ABOVE the
  // access envelope; rejected long vertical piers divided the whole world.
  L(410,351,275,319,11,M.S);
  L(405,383,411,350,11,M.S);
  // Distinct short rooted joints for mid-rift tram and inner right ledge.
  L(1229,555,1229,595,12,M.S);
  L(1193,592,1205,592,12,M.S);
  // The split crescents now have ASYMMETRIC grounded upper/lower load paths.
  L(900,392,900,586,16,M.S);
  L(1215,247,1215,236,12,M.S);
  L(1180,340,1215,243,12,M.S);
  L(1155,350,1180,340,11,M.S);
  // Ruptured left emitter shield, indexed core and distinct inspection ledge.
  P([[837,380],[861,354],[884,363],[896,395],[881,419],[844,410]],M.K);
  R(853,377,22,8,M.U);
  L(882,406,899,391,11,M.S);
  R(858,390,10,13,M.I);
  R(876,543,45,9,M.U);
  L(880,545,900,569,8,M.P);
  // Underpin instead of leaving lower archival and field-survey slabs afloat.
  L(203,826,203,837,14,M.C);
  L(834,873,834,913,12,M.C);

  // R4 | owner-directed inhabited engineering finish. Repairs are true
  // material-ID cells. Leave the 2048x1024 coordinates and all 16 sites
  // untouched; full-hull flight and physical-obstruction probes must pass.
  //
  // 1. WEST: fasten the upper rover mezzanine to a real habitable shell,
  // then give xenology, rover diagnostics and assay distinct operations.
  // A short forked rock bracket avoids an impenetrable central pillar.
  L(393,453,419,438,13,M.C);
  L(419,438,431,425,13,M.C);
  R(385,444,24,9,M.S);
  // West wet-lab / glass specimen carousel, instrument and extraction duct.
  P([[156,414],[168,408],[194,411],[206,423],[197,439],[163,438]],M.Q);
  P([[169,419],[191,420],[188,432],[174,432]],M.A);
  R(154,440,52,6,M.U); R(184,435,9,8,M.G);
  L(211,440,214,391,5,M.P); R(207,391,15,8,M.I);
  // Distinct rover-wheel borescope and roof-fastened charging mast.
  R(319,435,65,9,M.K);
  for(const x of [328,368]){R(x,428,15,8,M.N);R(x+5,422,6,8,M.P);}
  L(355,422,356,388,5,M.P);
  R(346,394,24,7,M.G);
  // Lower assay/analyser: a tall vertical probe and offset working plinth.
  L(366,614,366,587,7,M.P);
  R(359,602,20,8,M.I);
  P([[384,616],[402,604],[412,618],[407,631],[389,631]],M.G);
  R(385,633,25,6,M.U);

  // 2. WESTERN UNDERGEOLOGY: attach formerly aerial assay shelf to a
  // worked bedrock shoulder and existing lower survey rock-backed tie.
  // This lies below all 16 named site approach envelopes.
  L(790,816,834,858,12,M.C);
  L(834,858,834,878,12,M.C);
  R(795,816,18,8,M.S);
  // A borehole feed with safety head at the mouth of the dry geolab.
  R(850,850,10,24,M.P);
  R(841,844,28,7,M.U);
  R(854,834,7,12,M.I);

  // 3. PHASEWELL: an asymmetrical operator station, separated from the
  // luminous broken-ring silhouette, communicates with grounded diagnostics.
  // Its inspection line follows the right lower crescent, not the central void.
  L(1120,631,1178,605,10,M.S);
  R(1114,620,47,9,M.K);
  R(1120,608,7,12,M.P);
  R(1130,609,22,9,M.Q);
  R(1136,602,13,5,M.I);
  L(1178,605,1191,584,8,M.P);
  R(1183,580,34,7,M.U);
  R(1198,573,11,7,M.I);
  // Secondary small red-tag safety mast, deliberately offset from emitter.
  L(849,448,839,431,8,M.P);
  R(833,424,13,8,M.I);

  // 4. EAST: quarantine inspection is separated from refuel/repair by
  // selective open thresholds; a cargo hook and rover cradle are actual
  // supported geometry, not repeated little rectangles on an empty shelf.
  // Sealed twin quarantine payloads and overhead specimen handling frame.
  L(1636,379,1636,418,6,M.P);
  L(1636,418,1603,431,6,M.K);
  R(1600,430,37,7,M.G);
  R(1606,417,21,9,M.Q);
  R(1620,409,10,7,M.I);
  // West side quarantine decontamination nozzle and wash-test receiver.
  L(1563,392,1592,399,6,M.P);
  R(1590,395,28,6,M.U);
  R(1596,403,9,12,M.I);
  // Freight weighing station: articulated overhead hook and rail cradle.
  L(1829,380,1829,406,8,M.P);
  L(1829,406,1803,417,8,M.P);
  R(1797,414,16,10,M.K);
  R(1783,436,44,8,M.U);
  R(1800,425,13,11,M.N);
  // A physically different repair/refuel lane, twin grounded rocker arms
  // beneath a high functional service gantry, not a duplicate cargo pod.
  L(1916,403,1906,428,9,M.K);
  L(1965,405,1975,430,9,M.K);
  R(1903,434,81,8,M.S);
  R(1924,423,32,11,M.N);
  R(1931,416,18,6,M.I);
  R(1914,407,7,16,M.P);
  R(1967,410,7,18,M.P);
  // Under-bay service crane heads anchored in the cargo-floor structure.
  L(1667,578,1667,612,7,M.K);
  L(1667,582,1702,584,7,M.K);
  R(1694,583,15,13,M.N);
  R(1659,612,28,8,M.U);
  L(1909,579,1909,616,8,M.P);
  L(1909,584,1950,594,7,M.K);
  R(1944,588,15,16,M.N);
  R(1903,613,26,8,M.U);

  // 5. Small supported survey receiving port. Keep >31x27 margin from
  // the deep-survey site at 1305,748, and avoid forming a new world wall.
  L(1253,852,1253,889,10,M.C);
  R(1244,845,20,8,M.U);
  R(1248,837,12,8,M.I);
  R(1364,850,22,8,M.G);
  L(1372,857,1401,888,7,M.P);

  // R5: Subtractive, original sci-fi engineering and authentic traversable
  // inhabited workspaces; all pre-existing named sites and rift void survive.
  R(861,254,53,29,M.A);
  R(1453,674,43,46,M.A);
  R(569,667,44,44,M.A);
  R(1839,345,48,15,M.A);
  // Short anchored bridges, not artificial valley-spanning collision walls.
  L(210,708,213,686,11,M.C);
  L(420,708,428,683,11,M.C);
  L(702,850,748,862,11,M.C);
  L(1060,857,1101,873,11,M.C);
  // Open west xenology doorframes and retain roof-supported lintels.
  R(220,397,12,45,M.A);
  R(328,398,12,42,M.A);
  R(215,392,17,6,M.U);
  R(325,393,17,5,M.U);
  // East quarantine and freight upper-level thresholds.
  R(1682,400,14,43,M.A);
  L(1678,377,1689,395,10,M.C);
  R(1680,391,14,6,M.U);
  R(1843,399,12,43,M.A);
  R(1840,393,18,6,M.U);
  // Solid ties into lower geological assay structure and instrumentation.
  L(1230,791,1222,811,11,M.C);
  L(1390,791,1399,811,11,M.C);
  R(1263,807,7,45,M.P);
  R(1363,824,7,28,M.P);
  R(1380,846,14,6,M.U);
  // A broken-ring-connected spectroscopy vane, not a new full ring.
  L(1192,345,1176,380,9,M.S);
  L(1176,380,1163,428,7,M.P);
  R(1155,427,29,10,M.K);
  R(1161,438,8,22,M.I);
  R(1168,447,35,7,M.U);
  L(1197,451,1216,471,7,M.P);
  R(1191,457,16,9,M.Q);
  L(1118,605,1128,594,7,M.P);
  R(1122,589,17,8,M.I);
  L(963,354,920,328,5,M.P);
  // Close physical 4-neighbour support gaps on critical functional details.
  R(1163,433,7,12,M.P);
  L(964,352,888,342,6,M.P);
  L(1880,434,1908,452,11,M.C);
  L(1364,814,1364,826,8,M.P);
  L(867,817,870,830,9,M.C);
  L(776,838,773,859,8,M.P);
  R(885,661,7,16,M.P);
  // Remove floating mini-pavers and duplicated unreachable cargo trays.
  for(const x of [600,684,936,1020])R(x,869,32,17,M.A);
  for(const x of [192,294,421])R(x,795,12,17,M.A);
  R(1644,798,35,15,M.A);
  R(1746,798,35,15,M.A);
  // Four *actual* generous 31x27 Midge circulation envelopes inside
  // distinct machine-facing west/east rooms, never surrogate waypoint names.
  R(187,399,63,48,M.A);
  R(336,398,44,48,M.A);
  R(1628,399,67,46,M.A);
  R(1816,398,52,47,M.A);
  // Freight weigh office: an authentic 57-cell underdeck cargo-lift throat.
  R(1825,443,57,23,M.A);
  R(1818,450,7,9,M.U);
  R(1882,449,8,9,M.U);
  // Genuinely grounded status equipment and benches kept beside corridors.
  R(859,651,7,18,M.P);
  L(855,475,846,450,7,M.P);
  L(1158,675,1149,651,8,M.P);
  R(162,442,8,12,M.C);
  R(325,438,7,16,M.C);
  L(387,402,387,385,7,M.P);
  R(380,436,7,16,M.C);

  // R6 | Final four functional support/finish junctions. Reproduced at the
  // R5 exact material plane (no source-image tracing). All four isolated
  // fragments are small native-approved inert panels, preserved as
  // purposeful equipment and bonded to the nearest structural load path:
  //   east solar telemetry vane       243 cells, 8-cell attachment
  //   west xenology instrument board  176 cells, 33-cell roof hanger
  //   west assay dashboard             18 cells, 5-cell wall flange
  //   west tram signalling panel      175 cells, 28-cell deck bus
  // Tests before publication: zero detached occupied components, all 20
  // original R5 exact site envelopes at 19x15, 23x19, 31x27, both bypasses.
  L(1694,233,1694,225,4,M.P);
  L(278,372,278,339,4,M.P);
  L(236,397,231,397,4,M.P);
  L(497,558,469,558,4,M.P);
};
