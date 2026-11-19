"use strict";
// R7 — Functional inhabited workrooms, authored original material cells.
// Three site-specific work chains, explicit Midge-sized openings and rigid
// supported roof-to-floor stations, without closing the west/east rift routes.
module.exports=function workroomsR7({M,R,P,L,sites}) {
  // WEST: sample quarantine -> lift tray -> rover assay (not identical props).
  // Retain x202/y424 and x341/y421 inside 31x27 clear hull envelopes.
  // Existing upper roof and cliff wall carry each side-entry vestibule.
  R(144,388,9,61,M.C);
  R(225,389,8,17,M.C); R(225,443,8,13,M.C); // 37-cell portal
  R(149,447,78,9,M.S);
  // Bonded hanging decontamination canister: extraction neck/round shield,
  // receptacle, floor-run waste conduit. Its silhouette is not a flat stripe.
  R(157,387,8,22,M.P);
  P([[150,410],[158,400],[174,401],[181,414],[176,424],[153,422]],M.Q);
  R(155,423,21,7,M.U); R(160,430,12,18,M.N);
  R(151,443,32,6,M.S); R(166,439,8,10,M.I);
  R(151,454,65,6,M.G);
  // Pair of vestibule thresholds, keeping the open front-facing access way.
  // Upper transfer throat stays open; two processing bays must share a flyable approach.
  // No central bulkhead: this 41+ cell horizontal throat is the Midge return.
  // Discontinuous roof above the transfer is intentional for northern flight.
  // Rover diagnostics bay, 38-cell side-entries and floor-supported tire rig.
  // West diagnostic bay entry remains unobstructed on its intake side.
  R(394,389,9,17,M.C); R(394,443,9,14,M.C);
  R(302,449,99,11,M.S);
  R(311,428,13,21,M.K); R(311,442,26,8,M.U);
  R(313,431,11,13,M.N); R(321,438,9,10,M.I);
  R(381,425,12,24,M.P); R(373,439,22,11,M.N);
  R(373,443,27,7,M.U);
  L(388,384,388,414,5,M.P); R(381,410,15,6,M.G);

  // EAST: a consumable contamination process *before* freight weighing.
  // Deliberate upper-sky openings and exterior air paths are preserved.
  // Quarantine: explicitly connected vertical wet-column and low carrier.
  R(1554,386,10,20,M.C); R(1554,443,10,16,M.C);
  // East isolation side access remains open to the actual 31x27 air graph.
  R(1555,452,143,10,M.S);
  R(1569,382,9,27,M.P); R(1563,405,28,8,M.U);
  R(1559,412,21,29,M.Q); R(1563,438,19,14,M.S);
  R(1580,431,8,20,M.G); R(1597,385,24,6,M.U);
  R(1605,391,8,20,M.P); R(1600,409,21,6,M.G);
  // Freight: roof-loaded industrial hoist versus floor-mounted weigh bridge.
  // Weighing bay left threshold is open to the cargo lift route.
  // Weighing bay right threshold is open to the adjacent service programme.
  R(1754,452,68,10,M.S); // preserve x1825..1882 landing/lift aperture after R5 cut
  R(1771,383,10,26,M.P); R(1767,404,27,8,M.K);
  // The 31x27 cargo transfer envelope forbids placing a hanging hook across this approach.
  // Heavy load cells remain integrated in R6's existing grounded scale, not obstructing the entry.
  // No free-standing lower sensor across the opening.
  // Separate repair/refuel bay with chassis clamp over floor-bonded cradle.
  R(1906,389,9,19,M.C); R(1906,443,9,15,M.C);
  R(1980,389,11,20,M.C); R(1980,443,11,15,M.C);
  R(1910,450,78,10,M.S);
  R(1918,388,8,36,M.P); R(1913,418,22,7,M.K);
  R(1958,388,8,40,M.P); R(1951,422,22,8,M.K);
  R(1916,440,22,10,M.N); R(1951,440,22,10,M.N);
  R(1930,436,24,6,M.U); R(1934,430,14,7,M.I);
};