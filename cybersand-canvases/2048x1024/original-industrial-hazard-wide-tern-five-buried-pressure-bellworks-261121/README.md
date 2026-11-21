# Tern-5 Buried Pressure Bellworks

Original sci-fi/industrial CyberSand world, exact 2048 x 1024 orthographic side elevation. Independent geometry, not a source conversion.

**State: Creator SOURCE-STATIC PASS / OPEN DRAFT HOLD / NATIVE-UNTESTED.** No automatic owner approval.

## Structural thesis

A five-cavern pressure-processing installation buried within one rooted geological vault: a public high flight route, a mid-level process interconnect, and a low dry rescue gallery. The enclosed machinery and open satellite voids are intentionally unequal. No isometric roofs or scenic surrogate floors.

Five distinct stations in traversal order: west ore delivery/assay, unequal pair of pressure-bell shells, central winding/equalization headshaft, three sealed quench sample vessels, and dual-stack exhaust clarifier. The five vertical portals lead back into the open air. Inert shells and pipework indicate possible process relationships, NOT working pumping or mechanical simulation.

## Original route and exact named sites

Arrival (66,242) -> West hoist (236,275) -> Pressure bell overlook (632,265) -> Winding head (1035,255) -> Quench lookout (1448,265) -> Exhaust approach (1863,262) -> Extraction (1979,246).

Each portal also reaches its exact mid-level inspection checkpoint near y617-627 and lower recovery checkpoint near y836-840. Mid-process line spans x78..1988 at y617-681; lower dry rescue at x72..1997, y818-888. Some structural columns narrow or interrupt local bands; the per-site conservative four-neighbour clearance proof assesses the final actual plane rather than diagrammatic links.

After a real extra 72 x 332 obstruction at [1205,0], all 17 exact named sites remain reachable without moving any target at 19x15, 23x19, and 31x27. At 31x27, three upper-route destinations incur +160 to +198 steps. This is a static movement-clearance proxy, not Rapier flight validation.

## Native material and physics contract

Read-only accepted CyberSand main: f7e056c9b8791106e22f2d1c295043783d8a9701. Map source main: 99a166e7fcae45eb22be1740e9f33f62faccbcc7. Material IDs: empty 0; water 3, lava 8 (mobile); reinforced concrete 58, basalt 100, obsidian 101, iron 117, glass-block 120 (inert stationary supports). Initial fluid cells are fully enclosed with no mixed water/lava cardinal faces; dynamic pressure/heat and persistence are not tested.

Grid: 2097152 exact final material cells, SHA-256 31602d1009b5b7ae11e50389e5fe7ca08f76628ea6c6b142ea19f6988d5f7ce6. 3475 nonoverlapping [x,y,width,height,material] records, 629078 authored nonzero cells, 67675 Setup-v2 JSON bytes, static full ordered replay equality. 612132/612132 stationary cells boundary-grounded.

Source accepted 32,768 starting construction rectangles; no obsolete 4,096 compatibility reduction. Actual source-matched installed bridge and Workbench import still need Windows-native verification. Recorded native state: NATIVE-UNTESTED.

## Reproducibility and assets

`node build.cjs --write` creates exact `setup.json`, `receipt.json`, `overview.png` and six indexed-material district crops in the map directory (or OUT_DIR). `node build.cjs --verify` regenerates and checks exact byte identity against committed files. Pixel colours in the indexed PNG represent committed cell material IDs. The overview is full 2048x1024, crops are original-scale and declared in `receipt.json`.

`exemplar.json` is descriptive corpus metadata, not a Setup schema. Editable galleries and set-piece suggestions are intentionally unscripted. Do not decorate every unused bay.

## Qualification and unresolved gates

Creator static: full-grid replay, legal bounds, zero overlap, exact histogram, grounded supports, initial liquid containment, literal-site clearance at three full hulls, hard-obstruction rejoin, deterministic gallery. Independent Art, Technical and Shepherd review requested. Binary-native Godot/CyberDemoBridge/Rapier import, collision/flight, dynamic fluids, save/reopen and exact-HEAD CI were **not** performed in this authoring environment.
