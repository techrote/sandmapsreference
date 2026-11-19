# Pyrewater Quarantine Ring — ORIGINAL Industrial Hazard Wide

**OPEN-PR status: not yet published. Draft/HOLD source candidate. NATIVE-UNTESTED.** 2048×1024 full physical material cells, perpendicular 2D side elevation, zero external reference artwork. No isometric geometry or platform-top perspective. Midge authored rectangular hull is 4×3 cells.

A decommissioned high-pressure quarantine plant anchored between asymmetrical freight cantilevers and an evacuation buttress. The **five distinctive districts** are West Crane and Intake Assay, staggered Cold Quench Tanks, central Magnetoplasma Gyre with sealed Lava Heat Vessel, east Chemical Distillation Cloister, and Quarantine Evacuation Works. A ring-like reactor is a true solid-material geometry around a spacious flyable interior; all tanks are contained and risk zones can be bypassed from high flight or lower air. The 37-cell high excavated service artery provides a second traverse.

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

## Physical material design

All reactor outlines, girders, tank walls, shrouds, pipework, support ribs, lamp inlays and stratified basalt are **real stored material-ID cells**. Static inert construction IDs: 58,62,63,68,70,76,77,79,100,101,104,117,120,122,123,128,131. Dynamic IDs: Water 3, Lava 8; enclosed separately, never structural foundations. The story describes process installations, **not active authored pumps, electrically working reactors or simulated chemistry**; no native runtime admission or chemistry test occurred. Further mechanical reviewer work is required for 55750 inert detached-solid cells, and Midge collision and real structural plausibility. Materials are grounded in the accepted kernel definitions, not guessed from their names.

## Reproduce exact source plane

Immutable authority: [techrote/cybersand accepted main de109d0131641d6adc8d25bb9ced7ca3d4991105](https://github.com/techrote/cybersand/commit/de109d0131641d6adc8d25bb9ced7ca3d4991105). Source builder `tools/original-industrial-hazard-wide/build.cjs` with `finish.cjs` and `render.cjs`, seed **27111941**. Node command at repo root: `node tools/original-industrial-hazard-wide/build.cjs` then `node tools/original-industrial-hazard-wide/build.cjs --verify` (commands documented, not yet executed in this cloud session). The builder constructs the full 2097152-cell plane, losslessly encodes horizontal runs merged into optimized vertical rectangles, and replays every edit. It validates exact named Midge sites with full in-bounds 19×15, 23×19 and 31×27 clearances plus four-neighbour centre BFS; no radius waivers. Source builder static check was executed in V8, but native Godot/Rapier was not.

**Qualification snapshot:** 2642 rectangles (cap 32768); 50948 UTF-8 Setup-v2 JSON bytes (cap 1 MiB); construction work 560008 (cap 32 million); exact grid replay mismatches **0**. Full-plane SHA256 `f5ac56180881916ddff45ff71d975989d5b569f12b609e8233be0815846da96a`; JSON SHA256 `b8eb20399c90d7742b1af0edac9cd2cde4b170f4cb079fe1b328b980cdd94285`. Connected structural (perimeter-rooted 4-neighbour) 478865 / 534615; detached 55750. All 14 named checkpoints reach 19×15, 23×19, 31×27 with zero failures.

## Real-material images

[Full world `overview.png`](./overview.png) and five truly 1:1 cell crops: [freight](./freight.png), [quench](./quench.png), [reactor](./reactor.png), [distillation](./distillation.png), [evacuation](./evacuation.png). The actual PNG image pixels are material IDs (8-bit indexed PNG, palette for viewing), **not rendered concept art**. All generated from the same full source grid. Image dimensions, SHA256, cells and source crop boxes are in `receipt.json` for independent auditor recheck. No original-source JPEG/PNG is involved because this is wholly invented.

## HOLD conditions

Static clearance is not flight dynamics. Installed bridge capacity (4096 fallback, 32768 source workbench maximum), actual CyberDemoBridge import, Rapier/Midge input and collision, bounded live Water/Lava stability, native performance and fresh-process save/reopen are **NATIVE-UNTESTED**. Do not merge, mark Ready or claim owner acceptance without independent current-head Shepherd, art and technical review.
