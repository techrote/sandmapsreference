# Pyrewater Quarantine Ring — ORIGINAL Industrial Hazard Wide

**OPEN Draft/HOLD original-creator PR #23. R4 zero-detachment stator-bearings repair, independently verified R3 dry reactor-bypass and genuine material-cell detailing. NATIVE-UNTESTED; new-head Shepherd/Art/Technical re-review required.** 2048×1024 full physical material cells, perpendicular 2D side elevation, zero external reference artwork. No isometric geometry or platform-top perspective. Midge authored rectangular hull is 4×3 cells.

A decommissioned high-pressure quarantine plant anchored between asymmetrical freight cantilevers and an evacuation buttress. The **five distinctive districts** are West Crane and Intake Assay, staggered Cold Quench Tanks, central Magnetoplasma Gyre with sealed Lava Heat Vessel, east Chemical Distillation Cloister, and Quarantine Evacuation Works. A ring-like reactor is a true solid-material geometry around a spacious flyable interior; all tanks are contained and risk zones can be bypassed from high flight or lower air. The 37-cell high excavated service artery provides a second traverse.


## Current R5 final authored-cell identity — 19 November 2026

**Authoritative latest material plane:** 2,097,152 real 2048×1024 cells; **2,782** legal nonoverlapping ordered rectangle edits; **53,625** Setup-v2 UTF-8 bytes; **558,609** construction cell writes; **0 full-plane replay mismatches**; **533,216 / 533,216** rooted inert solids (**0 detached**); water **21,821** and lava **3,572** cells. All **16 named exact centres** pass 19×15, 23×19, and 31×27 fully-in-bounds conservative Midge-hull four-neighbour BFS; the two 55×45 obstruction tests pass in the independent verifier. Material plane SHA256 `ff564f95b85e2db934ceb6fb50a2d3cc0a5044937b8d06aa1cadbc1a39c3cddf`; Setup SHA256 `ed61d935b2edabe4a0f163d0daa01feccefcdc9b2d003f2518d7fc06f2983c85`. Six committed 8-bit indexed physical material-cell PNGs (complete world and five native 1:1 crops) are source-grid pixel-exact by the latest remote deterministic publisher/independent verification. All new R5 dry rooms, floor-supported consoles, entrances and returns are physical material cells (see R5 work below), not an illustrative JPEG or external source tracing. Native actor flight/bridge import/Rapier/live fluid dynamics and save/reopen **NATIVE-UNTESTED**. Engine authority: `de109d0131641d6adc8d25bb9ced7ca3d4991105` (read-only).

## Gameplay / route topology

**Primary traversal:** Freight arrival → High crane gallery → Intake assay → Quench inspection → West maintenance → Upper containment. Other named sites extend to deep maintenance service and outer evacuation exits. **Alternate returns:** continuous high-void flight and more constrained lower 946–982 dry service artery, with separated transfer apertures. Primary/alternate air-space options remain in the grid, but two edge-disjoint Midge routes and dynamic collision timing are not independently proven. Players may inspect Water and sealed Lava from safe platforms or approach the hazardous process enclosures without needing to cross their liquid surfaces.

| Exact site | Cell centre (x,y) | Conservative centre-envelope checks |
|---|---|---|
| Freight arrival | (112,373) | 19×15, 23×19, 31×27 |
| High crane gallery | (360,247) | 19×15, 23×19, 31×27 |
| Intake assay | (455,435) | 19×15, 23×19, 31×27 |
| Quench inspection | (670,395) | 19×15, 23×19, 31×27 |
| West maintenance | (580,841) | 19×15, 23×19, 31×27 |
| Upper containment | (965,132) | 19×15, 23×19, 31×27 |
| Reactor gallery | (1000,395) | 19×15, 23×19, 31×27 |
| Reactor service | (1215,595) | 19×15, 23×19, 31×27 |
| East chemistry | (1410,426) | 19×15, 23×19, 31×27 |
| Glass distillation | (1595,455) | 19×15, 23×19, 31×27 |
| North evacuation | (1750,245) | 19×15, 23×19, 31×27 |
| Quarantine passage | (1780,650) | 19×15, 23×19, 31×27 |
| East helipad | (1945,337) | 19×15, 23×19, 31×27 |
| Dry underpass | (1115,965) | 19×15, 23×19, 31×27 |
| Freight decompression booth | (215,812) | 19×15, 23×19, 31×27 |
| Quarantine scrubber vestibule | (1850,820) | 19×15, 23×19, 31×27 |

## Physical material design

All reactor outlines, girders, tank walls, shrouds, pipework, support ribs, lamp inlays and stratified basalt are **real stored material-ID cells**. Static inert construction IDs: 58,62,63,68,70,76,77,79,100,101,104,117,120,122,123,128,131. Dynamic IDs: Water 3, Lava 8; enclosed separately, never structural foundations. The story describes process installations, **not active authored pumps, electrically working reactors or simulated chemistry**; no native runtime admission or chemistry test occurred. All inert solids now join the boundary-grounded 4-neighbour steel/bedrock network; independent native load behaviour, Midge collision and engineering plausibility remain untested. Materials are grounded in the accepted kernel definitions, not guessed from their names.

## Reproduce exact source plane

Immutable authority: [techrote/cybersand accepted main de109d0131641d6adc8d25bb9ced7ca3d4991105](https://github.com/techrote/cybersand/commit/de109d0131641d6adc8d25bb9ced7ca3d4991105). Source builder `tools/original-industrial-hazard-wide/build.cjs` with `finish.cjs`, `reengineer.cjs` and `render.cjs`, seed **27111941**. Node command at repo root: `node tools/original-industrial-hazard-wide/build.cjs` then `node tools/original-industrial-hazard-wide/build.cjs --verify` (command exercised successfully in exact-source repository CI on 19 November 2026). The builder constructs the full 2097152-cell plane, losslessly encodes horizontal runs merged into optimized vertical rectangles, and replays every edit. It validates exact named Midge sites with full in-bounds 19×15, 23×19 and 31×27 clearances plus four-neighbour centre BFS; no radius waivers. The R4 generated source and true on-disk indexed PNGs were rebuilt and checked by the [independent Node 22 publication workflow](https://github.com/techrote/sandmapsreference/actions/runs/44467391071), including exact-mismatch/CRC/pixel parity and two physical 31×27 obstruction returns. The final report and publication HEAD still require separate new-head reviewer assessment. Godot/Rapier remain untested.

**R4 complete-plane qualification:** 2,743 optimized rectangles / 4,096 conservative installed fallback; 52,873 UTF-8 Setup-v2 bytes / 1 MiB; 561,203 cell writes / 32M; replay mismatches **0**. Full material plane SHA256 `bd3485225e7ca606e9f7399327decfd0150ae976e475955500e142fbc93ad21b`; JSON SHA256 `1e6551b17447c849bc285499d80554d9b88827a3acc306cbc6e429ae0e2c7e5a`. Grounded inert structural solids **535,810 / 535,810; detached 0**. **All 14 exact named sites pass 19×15, 23×19, 31×27** centre-hull checks and both independent 55×45 alternate obstruction fixtures, with no nearest-point substitutions.

## Real-material images

[Full world `overview.png`](./overview.png) and five truly 1:1 cell crops: [freight](./freight.png), [quench](./quench.png), [reactor](./reactor.png), [distillation](./distillation.png), [evacuation](./evacuation.png). The actual PNG image pixels are material IDs (8-bit indexed PNG, palette for viewing), **not rendered concept art**. All generated from the same full source grid. Image dimensions, SHA256, cells and source crop boxes are in `receipt.json` for independent auditor recheck. No original-source JPEG/PNG is involved because this is wholly invented.

## R3 engineered emergency alternate passage (19 November 2026)

Rebuilt **real stored material cells**, not rendered decoration. The existing eight R2 steel bearing connections remain. An additional **50×67-cell lower east reactor emergency hatch at x1260–1309/y548–614** removes **1,273 existing dry inert-solid cells**, leaving an intact steel web between the original upper port and the new independently navigable return. The process inlays convert **2,213 original empty cells to inert structure** and **2,317 other solid cells to process marker materials**. **No Water or Lava cells changed**. The gyre, quench roof and eastern transfer frames retain the R3 real bearings; R4 subsequently anchored or removed all four remaining disconnected fragments.

The revised Setup/PNG/receipt are regenerated from the same single material plane. Full-hull cardinal BFS reaches every exact named site **with either the 810,515 or 1250,515 alternative-route obstruction inserted independently**. The previous R2 regression stranded both reactor sites behind the 1250,515 obstruction; R3 removes that failure by a real playable secondary ingress. This is static connectivity, not dynamic Midge steering or live Water/Lava containment.

## R4 stator ground-path completion (19 November 2026)

Independent full-plane replay of R3 exposed four isolated structural/material components: **691 inner-gyre ring cells (ID68), 97 west ring cells (ID68), 168 emitter cells (ID123), and a 190-cell unsupported wall cap (ID58)** left above the R3 dry emergency hatch. The new *real-cell* R4 builder adds three narrow mechanically attached steel stators at x1041/y350–367, x980/y365–387 and x1046/y450–499 (445 newly occupied dry cells) joining the internal gyre and its emitter to genuinely grounded shells. It deletes the 190-cell detached wall cap over the bypass. **0 detached inert-solid cells remain anywhere in the full world**, measured against true perimeter-connected 4-neighbour support; the original open concentric reactor silhouette is retained. This is physical-cell support connectivity, not a native load test or functioning plasma field.

R3's separate 50×67 dry service hatch and both alternative route fixtures are retained. R4 independently tested the resulting full material plane and found 14/14 exact Midge checkpoints at each of 19×15, 23×19 and 31×27; the two 31×27 blocker cases also preserve all 14/14, with no special-point or nearest-centre exceptions. Water 21,821 and Lava 3,572 material cells are unchanged. Six authentic indexed material-grid PNGs were rebuilt; independent PNG pixel-to-Setup tests and native acceptance remain separate gates.

## HOLD conditions

Static clearance is not flight dynamics. Installed bridge capacity (4096 fallback, 32768 source workbench maximum), actual CyberDemoBridge import, Rapier/Midge input and collision, bounded live Water/Lava stability, native performance and fresh-process save/reopen are **NATIVE-UNTESTED**. Do not merge, mark Ready or claim owner acceptance without independent current-head Shepherd, art and technical review.

**Qualification:** [independent exact-source Actions workflow](https://github.com/techrote/sandmapsreference/actions/workflows/original-industrial-hazard-wide.yml) · [Draft/HOLD PR #23](https://github.com/techrote/sandmapsreference/pull/23). R4 static 4-neighbour anchoring is complete; realistic native load/dynamic flight and art review remain outstanding.

## R5 — new entered process chambers (deterministic static qualification PASS; native untested)

Two dry, properly proportioned, **actual material-cell** safety spaces were reauthored. The freight assay booth has a **76×77-cell east double-leaf airlock**, rooted weighing/air-analysis console plinths, and a real retained-floor pressure head (not decorative overlay). The quarantine scrubber room has a **124×107 west rib-spanning hatch** and a separately traversable **94×90 overhead emergency vent** across the suspended roof beam; two low supported rinse pedestals and retained isolation readouts distinguish its function. End-to-end movement is freight intake → triple quench → ring reactor → distillation → segregated scrubber/evacuation. New exact Midge centres: Freight decompression booth (215,812), Quarantine scrubber vestibule (1850,820). The original 14 centres and reactor emergency hatch stay authoritative. Dry airlocks and statically sealed fluids do **not** imply working pumps, live decontamination, safe dynamic fluid mechanics or native actor acceptance. No original reference image exists.

## R6 — pressure/metrology process and servicing link (original material cells)

A dry, structurally joined quench-throttle landing (x598–788/y529–567) now has two different operator positions, a metering head and a physical secondary connection to the reactor bearing. A refractory dry return from the reactor service side meets three distinct-height fractionator columns, and two rooted sampling/clean-air fittings serve the already entered quarantine scrubber. These are actual inert structural material IDs, not an overlay, pumping logic or liquid simulation. The existing mobile Water/Lava enclosures and R5 double-door escape topology remain untouched.

| Additional exact R6 functional destination | Centre | Conservative clearance |
| --- | --- | --- |
| Quench metering overlook | (680,482) | 19×15, 23×19, 31×27 |
| Distillation fractionator overlook | (1570,472) | 19×15, 23×19, 31×27 |

All 18 old-plus-new site centres, both inserted-blockage reroutes, solid rooting, full-plane replay and genuine 1:1 material PNGs must pass independent tests on the regenerated R6 setup. **NATIVE-UNTESTED:** the stage does not implement pressure valves, reactor controls or active distillation; native import/flight, dynamic fluid stability and save/reopen require separate acceptance.
