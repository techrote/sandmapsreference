# Pyrewater Quarantine Ring — ORIGINAL Industrial Hazard Wide

**OPEN Draft/HOLD original-creator PR #23. R3 independently verified dry reactor-bypass repair, grounded load-bearing systems and actual material-cell detailing. NATIVE-UNTESTED; new-head Shepherd/Art/Technical re-review required.** 2048×1024 full physical material cells, perpendicular 2D side elevation, zero external reference artwork. No isometric geometry or platform-top perspective. Midge authored rectangular hull is 4×3 cells.

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

All reactor outlines, girders, tank walls, shrouds, pipework, support ribs, lamp inlays and stratified basalt are **real stored material-ID cells**. Static inert construction IDs: 58,62,63,68,70,76,77,79,100,101,104,117,120,122,123,128,131. Dynamic IDs: Water 3, Lava 8; enclosed separately, never structural foundations. The story describes process installations, **not active authored pumps, electrically working reactors or simulated chemistry**; no native runtime admission or chemistry test occurred. Further review is required for 1,146 non-perimeter-connected inert cells, and Midge collision and real structural plausibility. Materials are grounded in the accepted kernel definitions, not guessed from their names.

## Reproduce exact source plane

Immutable authority: [techrote/cybersand accepted main de109d0131641d6adc8d25bb9ced7ca3d4991105](https://github.com/techrote/cybersand/commit/de109d0131641d6adc8d25bb9ced7ca3d4991105). Source builder `tools/original-industrial-hazard-wide/build.cjs` with `finish.cjs`, `reengineer.cjs` and `render.cjs`, seed **27111941**. Node command at repo root: `node tools/original-industrial-hazard-wide/build.cjs` then `node tools/original-industrial-hazard-wide/build.cjs --verify` (command exercised successfully in exact-source repository CI on 19 November 2026). The builder constructs the full 2097152-cell plane, losslessly encodes horizontal runs merged into optimized vertical rectangles, and replays every edit. It validates exact named Midge sites with full in-bounds 19×15, 23×19 and 31×27 clearances plus four-neighbour centre BFS; no radius waivers. The R3 generated source and true on-disk indexed PNGs were rebuilt and checked by the [independent Node 22 workflow](https://github.com/techrote/sandmapsreference/actions/runs/44464547971), including exact-mismatch/CRC/pixel parity and two physical 31×27 obstruction returns. The final report and publication HEAD still require separate new-head reviewer assessment. Godot/Rapier remain untested.

**R3 complete-plane qualification:** 2,735 optimized rectangles / 4,096 conservative fallback; 52,724 UTF-8 Setup-v2 bytes / 1 MiB; 560,948 cell writes / 32M; replay mismatches **0**. Full material plane SHA256 `dd0ddaf2f232faae91c12bd492f7cb0abd68154ae643f0d9a1049a55c64788ab`; JSON SHA256 `85e8aa1b0f08f4a6bcd87d0d15c3f657d5b31a6e10d370a576f6be45da47e847`. Grounded structural solids 534,409 / 535,555; detached 1,146. **All 14 exact named sites pass 19×15, 23×19 and 31×27 centre-hull checks and both 55×45 alternate obstruction fixtures**, with no nearest-point substitutions.

## Real-material images

[Full world `overview.png`](./overview.png) and five truly 1:1 cell crops: [freight](./freight.png), [quench](./quench.png), [reactor](./reactor.png), [distillation](./distillation.png), [evacuation](./evacuation.png). The actual PNG image pixels are material IDs (8-bit indexed PNG, palette for viewing), **not rendered concept art**. All generated from the same full source grid. Image dimensions, SHA256, cells and source crop boxes are in `receipt.json` for independent auditor recheck. No original-source JPEG/PNG is involved because this is wholly invented.

## R3 engineered emergency alternate passage (19 November 2026)

Rebuilt **real stored material cells**, not rendered decoration. The existing eight R2 steel bearing connections remain. An additional **50×67-cell lower east reactor emergency hatch at x1260–1309/y548–614** removes **1,273 existing dry inert-solid cells**, leaving an intact steel web between the original upper port and the new independently navigable return. The process inlays convert **2,213 original empty cells to inert structure** and **2,317 other solid cells to process marker materials**. **No Water or Lava cells changed**. The gyre, quench roof and eastern transfer frames retain real anchored loads; the remaining 1,146 isolated mostly minor inert cells require independent judgment.

The revised Setup/PNG/receipt are regenerated from the same single material plane. Full-hull cardinal BFS reaches every exact named site **with either the 810,515 or 1250,515 alternative-route obstruction inserted independently**. The previous R2 regression stranded both reactor sites behind the 1250,515 obstruction; R3 removes that failure by a real playable secondary ingress. This is static connectivity, not dynamic Midge steering or live Water/Lava containment.

## HOLD conditions

Static clearance is not flight dynamics. Installed bridge capacity (4096 fallback, 32768 source workbench maximum), actual CyberDemoBridge import, Rapier/Midge input and collision, bounded live Water/Lava stability, native performance and fresh-process save/reopen are **NATIVE-UNTESTED**. Do not merge, mark Ready or claim owner acceptance without independent current-head Shepherd, art and technical review.

**Qualification:** [independent exact-source Actions workflow](https://github.com/techrote/sandmapsreference/actions/workflows/original-industrial-hazard-wide.yml) · [Draft/HOLD PR #23](https://github.com/techrote/sandmapsreference/pull/23). Unlinked immobile solids remain subject to independent structural/art review.
