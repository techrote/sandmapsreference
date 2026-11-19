# Ashlight Counterflow Foundry — ORIGINAL Industrial Hazard Wide

**OPEN Draft/HOLD original-creator PR #23. R4 requalified: all existing grounded twin-reactor supports and process cells preserved, with no Ashlight material-plane change. NATIVE-UNTESTED; new-head independent reviewer assessment required.** 2048×1024 full physical material cells, perpendicular 2D side elevation, zero external reference artwork. No isometric geometry or platform-top perspective. Midge authored rectangular hull is 4×3 cells.

A frost-and-ash refinery on sheared cliffs, featuring **five distinctive districts**: Ashward Intake Crane, Cold Counterflow Siphon Rack, sweeping diagonal Cyclone Baffle, uneven separated Twin Plasma Towers with their sealed Water/Lava cells, and North Exhaust Vent Conservatory. The central diagonal industrial silhouette is not a recolored clone of Pyrewater's circular reactor. Flight can continue over the high spans, along the public primary hall, or through the deep dry retrieval tunnel.


## Current R5 final authored-cell identity — 19 November 2026

**Authoritative latest material plane:** 2,097,152 real 2048×1024 cells; **3,959** legal nonoverlapping ordered rectangle edits; **76,215** Setup-v2 UTF-8 bytes; **576,134** construction cell writes; **0 full-plane replay mismatches**; **555,446 / 555,446** rooted inert solids (**0 detached**); water **18,136** and lava **2,552** cells. All **15 named exact centres** pass 19×15, 23×19, and 31×27 fully-in-bounds conservative Midge-hull four-neighbour BFS; the two 55×45 obstruction tests pass in the independent verifier. Material plane SHA256 `c5ecaf01f2b26cd336998c58f50b6da79beb5fdf25f77c3edbaa3173ddc95c27`; Setup SHA256 `6495dae356e10b0df9e85303180ba90209f52932abd020942f2d9b9829297962`. Six committed 8-bit indexed physical material-cell PNGs (complete world and five native 1:1 crops) are source-grid pixel-exact by the latest remote deterministic publisher/independent verification. All new R5 dry rooms, floor-supported consoles, entrances and returns are physical material cells (see R5 work below), not an illustrative JPEG or external source tracing. Native actor flight/bridge import/Rapier/live fluid dynamics and save/reopen **NATIVE-UNTESTED**. Engine authority: `de109d0131641d6adc8d25bb9ced7ca3d4991105` (read-only).

## Gameplay / route topology

**Primary traversal:** Ashward arrival → Splitter cliff → Cold siphon → Cyclone lip → Lower filter service → Spiral gantry. Other named sites extend to deep maintenance service and outer evacuation exits. **Alternate returns:** continuous high-void flight and more constrained lower 946–982 dry service artery, with separated transfer apertures. Primary/alternate air-space options remain in the grid, but two edge-disjoint Midge routes and dynamic collision timing are not independently proven. Players may inspect Water and sealed Lava from safe platforms or approach the hazardous process enclosures without needing to cross their liquid surfaces.

| Exact site | Cell centre (x,y) | Conservative centre-envelope checks |
|---|---|---|
| Ashward arrival | (108,440) | 19×15, 23×19, 31×27 |
| Splitter cliff | (340,260) | 19×15, 23×19, 31×27 |
| Cold siphon | (510,470) | 19×15, 23×19, 31×27 |
| Cyclone lip | (740,330) | 19×15, 23×19, 31×27 |
| Lower filter service | (645,840) | 19×15, 23×19, 31×27 |
| Spiral gantry | (1080,326) | 19×15, 23×19, 31×27 |
| Cascade observation | (1145,485) | 19×15, 23×19, 31×27 |
| Reactor twin west | (1420,466) | 19×15, 23×19, 31×27 |
| Reactor twin east | (1645,526) | 19×15, 23×19, 31×27 |
| Lower isolation gallery | (1550,545) | 19×15, 23×19, 31×27 |
| Vent conservatory | (1950,388) | 19×15, 23×19, 31×27 |
| Long exhaust exit | (1940,580) | 19×15, 23×19, 31×27 |
| Deep retrieval | (1040,965) | 19×15, 23×19, 31×27 |
| Ashward filter audit | (247,811) | 19×15, 23×19, 31×27 |
| Twin-reactor isolation booth | (1551,840) | 19×15, 23×19, 31×27 |

## Physical material design

All reactor outlines, girders, tank walls, shrouds, pipework, support ribs, lamp inlays and stratified basalt are **real stored material-ID cells**. Static inert construction IDs: 58,62,63,68,70,76,77,79,100,101,104,117,120,122,123,128,131. Dynamic IDs: Water 3, Lava 8; enclosed separately, never structural foundations. The story describes process installations, **not active authored pumps, electrically working reactors or simulated chemistry**; no native runtime admission or chemistry test occurred. All inert cells are connected to boundary-grounded solid structure; independent native collision and structural-plausibility review remains outstanding. Materials are grounded in the accepted kernel definitions, not guessed from their names.

## Reproduce exact source plane

Immutable authority: [techrote/cybersand accepted main de109d0131641d6adc8d25bb9ced7ca3d4991105](https://github.com/techrote/cybersand/commit/de109d0131641d6adc8d25bb9ced7ca3d4991105). Source builder `tools/original-industrial-hazard-wide/build.cjs` with `finish.cjs`, `reengineer.cjs` and `render.cjs`, seed **27111987**. Node command at repo root: `node tools/original-industrial-hazard-wide/build.cjs` then `node tools/original-industrial-hazard-wide/build.cjs --verify` (command exercised successfully in exact-source repository CI on 19 November 2026). The builder constructs the full 2097152-cell plane, losslessly encodes horizontal runs merged into optimized vertical rectangles, and replays every edit. It validates exact named Midge sites with full in-bounds 19×15, 23×19 and 31×27 clearances plus four-neighbour centre BFS; no radius waivers. The [R4 independent Node 22 on-disk verification](https://github.com/techrote/sandmapsreference/actions/runs/44467391071) reran full source reconstruction, rect replay, all three exact full-hull envelopes, two alternate-route obstruction fixtures and indexed PNG pixel/CRC checks. The R3 work changes Pyrewater's true cells, **not Ashlight's already grounded final grid**. New-head external Art/Technical/Shepherd review is still required. Godot/Rapier remain untested.

**R4 repeated full-plane deterministic qualification (Ashlight's R2/R3 physical grid unchanged):** 3947 optimized rectangles / 4096 conservative fallback; 75961 UTF-8 Setup-v2 bytes / 1 MiB; work 582693 / 32M; replay mismatches **0**. Full material plane SHA256 `a67f60f8e8c97da1601e7a0ace75c0861e8cb5ba0f25bc53bb5ffe6cc41100ac`; JSON SHA256 `975c7f516925634d11b836ee1bed0518530402e1f6dfefcea670ed00ba78397c`. Perimeter-anchored structural solid 562005 / 562005; detached 0. All 13 exact named sites accessible at 19×15, 23×19 and 31×27.

## Real-material images

[Full world `overview.png`](./overview.png) and five truly 1:1 cell crops: [ashward](./ashward.png), [siphons](./siphons.png), [cascade](./cascade.png), [twins](./twins.png), [vent](./vent.png). The actual PNG image pixels are material IDs (8-bit indexed PNG, palette for viewing), **not rendered concept art**. All generated from the same full source grid. Image dimensions, SHA256, cells and source crop boxes are in `receipt.json` for independent auditor recheck. No original-source JPEG/PNG is involved because this is wholly invented.

## Retained R2 engineered structural and process repair; R3 requalification (19 November 2026)

Rebuilt **real stored material cells**, not render decoration. 2 actual steel web/bearing connections and 13 material inlays change **344 empty cells into inert structure** plus **4704 existing inert-solid cells** for process readability. No Water or Lava cell changes. The west plasma tower hood and formerly isolated collar now join the load path to the grounded cyclone mast; major detached structural components fall to zero. The cyclone's intake-facing liner and differentiated siphon readouts remain inert material details, not simulated pumps.

The R4 builder reproduces byte-identical Ashlight Setup/PNG source-grid evidence, while documenting the independent Pyrewater R4 stator fix without applying it to Ashlight. Conservative full-hull BFS continues to reach all 13 exact sites after each alternative 55×45 centre obstruction. Neither the material plane nor the existing two structural bearings were changed by Pyrewater's R3 hatch. Static clearance is not dynamic Midge steering; Water/Lava dynamic containment remains NATIVE-UNTESTED.

## HOLD conditions

Static clearance is not flight dynamics. Installed bridge capacity (4096 fallback, 32768 source workbench maximum), actual CyberDemoBridge import, Rapier/Midge input and collision, bounded live Water/Lava stability, native performance and fresh-process save/reopen are **NATIVE-UNTESTED**. Do not merge, mark Ready or claim owner acceptance without independent current-head Shepherd, art and technical review.

**Qualification:** [independent exact-source Actions workflow](https://github.com/techrote/sandmapsreference/actions/workflows/original-industrial-hazard-wide.yml) · [Draft/HOLD PR #23](https://github.com/techrote/sandmapsreference/pull/23). Static anchored connectivity is zero-detachment; native loading and independent art review remain outstanding.

## R5 — entered counterflow and isolation (deterministic static qualification PASS; native untested)

The ash reception/filter chamber now gains an **81×86-cell dry side vestibule** and genuinely floor-rooted weighing and particulate instrument consoles. Between unequal reactor towers, a new dry **west 84×77 / east 91×78 double-entry watchroom** serves a **78×92 below-floor recovery shaft** that physically penetrates the lower girder to reach the existing deep service artery. Here the route is cold siphon → graded cyclone separation → dual thermally isolated plasma watchroom → dry lower retrieval / high exhaust, intentionally distinct from Pyrewater's horizontal quench-to-scrubber chain. New exact conservative-hull checkpoint centres: Ashward filter audit (247,811) and inter-rib Twin-reactor isolation booth (1551,840). Materials are structural and dry at authored source state; there are no working simulations of machinery. Installed native bridge, live Water/Lava and Midge steering remain NATIVE-UNTESTED.

## R6 — graded cyclone recovery and independently serviced hot/cold runs

The diagonal cyclone now feeds a grounded coarse collection step and a differently elevated fine-fraction deck with separate lower retrieval. The hot reactor receives a steel servicing gangway; the cold reactor has its own lower isolated glass reflux landing, with a deliberately different clear volume between landing and pressure vessel. The exhaust gains an unequal lamellar filter with anchored high and low retrieval trays. All are authored material cells, not mock visual effects or functional simulated pumps. Water/Lava cells remain sealed and unchanged.

| Additional exact R6 functional destination | Centre | Conservative clearance |
| --- | --- | --- |
| Cyclone graded separation overlook | (1160,550) | 19×15, 23×19, 31×27 |
| Exhaust filter inspection perch | (1840,588) | 19×15, 23×19, 31×27 |

Independent R6 static tests cover all 17 existing-plus-new exact sites, both artificial route blockages, load-bearing connectivity, 2048×1024 plane replay, material laws and every pixel of the overview/five 1:1 crops. **NATIVE-UNTESTED:** no actual separation machinery, native actor control, dynamic hot/cold fluids or save/reopen is claimed.
