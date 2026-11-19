# Ashlight Counterflow Foundry — ORIGINAL Industrial Hazard Wide

**OPEN Draft/HOLD original-creator PR #23. Exact-source Node 22 STATIC-PASS; NATIVE-UNTESTED.** 2048×1024 full physical material cells, perpendicular 2D side elevation, zero external reference artwork. No isometric geometry or platform-top perspective. Midge authored rectangular hull is 4×3 cells.

A frost-and-ash refinery on sheared cliffs, featuring **five distinctive districts**: Ashward Intake Crane, Cold Counterflow Siphon Rack, sweeping diagonal Cyclone Baffle, uneven separated Twin Plasma Towers with their sealed Water/Lava cells, and North Exhaust Vent Conservatory. The central diagonal industrial silhouette is not a recolored clone of Pyrewater's circular reactor. Flight can continue over the high spans, along the public primary hall, or through the deep dry retrieval tunnel.

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

## Physical material design

All reactor outlines, girders, tank walls, shrouds, pipework, support ribs, lamp inlays and stratified basalt are **real stored material-ID cells**. Static inert construction IDs: 58,62,63,68,70,76,77,79,100,101,104,117,120,122,123,128,131. Dynamic IDs: Water 3, Lava 8; enclosed separately, never structural foundations. The story describes process installations, **not active authored pumps, electrically working reactors or simulated chemistry**; no native runtime admission or chemistry test occurred. Further mechanical reviewer work is required for 12743 inert detached-solid cells, and Midge collision and real structural plausibility. Materials are grounded in the accepted kernel definitions, not guessed from their names.

## Reproduce exact source plane

Immutable authority: [techrote/cybersand accepted main de109d0131641d6adc8d25bb9ced7ca3d4991105](https://github.com/techrote/cybersand/commit/de109d0131641d6adc8d25bb9ced7ca3d4991105). Source builder `tools/original-industrial-hazard-wide/build.cjs` with `finish.cjs` and `render.cjs`, seed **27111987**. Node command at repo root: `node tools/original-industrial-hazard-wide/build.cjs` then `node tools/original-industrial-hazard-wide/build.cjs --verify` (command exercised successfully in exact-source repository CI on 19 November 2026). The builder constructs the full 2097152-cell plane, losslessly encodes horizontal runs merged into optimized vertical rectangles, and replays every edit. It validates exact named Midge sites with full in-bounds 19×15, 23×19 and 31×27 clearances plus four-neighbour centre BFS; no radius waivers. The deterministic builder and its on-disk exact receipt/PNG reproduction have also passed Node 22 CI, followed by the separate independent source-plane, CRC, PNG pixel, clearance, alternate-route and containment verifier. Godot/Rapier remain untested.

**Qualification snapshot:** 3482 rectangles (cap 32768); 67083 UTF-8 Setup-v2 JSON bytes (cap 1 MiB); construction work 582349 (cap 32 million); exact grid replay mismatches **0**. Full-plane SHA256 `4e8fbfc453986bcd5ba3578f09c92b1e76b0fc042fbcfbbca777b11b5995e317`; JSON SHA256 `e9790152bd963ca9f1933039dde50d1995aa361db8c261583322acd40cf2ebd2`. Connected structural (perimeter-rooted 4-neighbour) 548918 / 561661; detached 12743. All 13 named checkpoints reach 19×15, 23×19, 31×27 with zero failures.

## Real-material images

[Full world `overview.png`](./overview.png) and five truly 1:1 cell crops: [ashward](./ashward.png), [siphons](./siphons.png), [cascade](./cascade.png), [twins](./twins.png), [vent](./vent.png). The actual PNG image pixels are material IDs (8-bit indexed PNG, palette for viewing), **not rendered concept art**. All generated from the same full source grid. Image dimensions, SHA256, cells and source crop boxes are in `receipt.json` for independent auditor recheck. No original-source JPEG/PNG is involved because this is wholly invented.

## HOLD conditions

Static clearance is not flight dynamics. Installed bridge capacity (4096 fallback, 32768 source workbench maximum), actual CyberDemoBridge import, Rapier/Midge input and collision, bounded live Water/Lava stability, native performance and fresh-process save/reopen are **NATIVE-UNTESTED**. Do not merge, mark Ready or claim owner acceptance without independent current-head Shepherd, art and technical review.

**Qualification:** [independent exact-source Actions workflow](https://github.com/techrote/sandmapsreference/actions/workflows/original-industrial-hazard-wide.yml) · [Draft/HOLD PR #23](https://github.com/techrote/sandmapsreference/pull/23). Unlinked immobile solids remain subject to independent structural/art review.
