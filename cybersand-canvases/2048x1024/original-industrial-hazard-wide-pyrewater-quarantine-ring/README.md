# Pyrewater Quarantine Ring — ORIGINAL Industrial Hazard Wide

**OPEN Draft/HOLD original-creator PR #23. R2 physical support + process-detail rework, independently review again at new HEAD; NATIVE-UNTESTED.** 2048×1024 full physical material cells, perpendicular 2D side elevation, zero external reference artwork. No isometric geometry or platform-top perspective. Midge authored rectangular hull is 4×3 cells.

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

All reactor outlines, girders, tank walls, shrouds, pipework, support ribs, lamp inlays and stratified basalt are **real stored material-ID cells**. Static inert construction IDs: 58,62,63,68,70,76,77,79,100,101,104,117,120,122,123,128,131. Dynamic IDs: Water 3, Lava 8; enclosed separately, never structural foundations. The story describes process installations, **not active authored pumps, electrically working reactors or simulated chemistry**; no native runtime admission or chemistry test occurred. Further review is required for 956 non-perimeter-connected inert cells, and Midge collision and real structural plausibility. Materials are grounded in the accepted kernel definitions, not guessed from their names.

## Reproduce exact source plane

Immutable authority: [techrote/cybersand accepted main de109d0131641d6adc8d25bb9ced7ca3d4991105](https://github.com/techrote/cybersand/commit/de109d0131641d6adc8d25bb9ced7ca3d4991105). Source builder `tools/original-industrial-hazard-wide/build.cjs` with `finish.cjs`, `reengineer.cjs` and `render.cjs`, seed **27111941**. Node command at repo root: `node tools/original-industrial-hazard-wide/build.cjs` then `node tools/original-industrial-hazard-wide/build.cjs --verify` (command exercised successfully in exact-source repository CI on 19 November 2026). The builder constructs the full 2097152-cell plane, losslessly encodes horizontal runs merged into optimized vertical rectangles, and replays every edit. It validates exact named Midge sites with full in-bounds 19×15, 23×19 and 31×27 clearances plus four-neighbour centre BFS; no radius waivers. An earlier source HEAD passed Node 22 and independent source-plane/PNG/BFS CI. This R2 HEAD has been rebuilt and source-replayed in isolated JavaScript; its **new-head on-disk Actions replay and independent PNG verification are still required** before qualification is promoted. Godot/Rapier remain untested.

**R2 deterministic source-level qualification (new HEAD pending independent Actions replay):** 2734 optimized rectangles / 4096 conservative fallback; 52705 UTF-8 Setup-v2 bytes / 1 MiB; work 562221 / 32M; replay mismatches **0**. Full material plane SHA256 `477b4b7051b038f0a2161701bb0ba79a6aaba864c8d4948fdcd60a63939503c8`; JSON SHA256 `d498b91ee09f726e4192d80c0046a70ba8f72b9ddc142a130fcd4cd03bf3c5cc`. Perimeter-anchored structural solid 535872 / 536828; detached 956. All 14 exact named sites accessible at 19×15, 23×19 and 31×27.

## Real-material images

[Full world `overview.png`](./overview.png) and five truly 1:1 cell crops: [freight](./freight.png), [quench](./quench.png), [reactor](./reactor.png), [distillation](./distillation.png), [evacuation](./evacuation.png). The actual PNG image pixels are material IDs (8-bit indexed PNG, palette for viewing), **not rendered concept art**. All generated from the same full source grid. Image dimensions, SHA256, cells and source crop boxes are in `receipt.json` for independent auditor recheck. No original-source JPEG/PNG is involved because this is wholly invented.

## R2 engineered structural and process repair (19 November 2026)

Rebuilt **real stored material cells**, not render decoration. 8 actual steel web/bearing connections and 9 material inlays change **2213 empty cells into inert structure** plus **2317 existing inert-solid cells** for process readability. No Water or Lava cell changes. Reactor outer frame, east chemistry, quench roof and *east bearing of the inner gyre* are grounded by physical metal links; the south 31×27 gallery aperture stays open. The remaining detached non-load-bearing inner markers need independent structural assessment.

The revised Setup/PNG/receipt are regenerated from the same single material plane. Conservative full-hull cardinal BFS still reaches all exact named sites. Static clearance is not dynamic Midge steering; Water/Lava dynamic containment remains NATIVE-UNTESTED.

## HOLD conditions

Static clearance is not flight dynamics. Installed bridge capacity (4096 fallback, 32768 source workbench maximum), actual CyberDemoBridge import, Rapier/Midge input and collision, bounded live Water/Lava stability, native performance and fresh-process save/reopen are **NATIVE-UNTESTED**. Do not merge, mark Ready or claim owner acceptance without independent current-head Shepherd, art and technical review.

**Qualification:** [independent exact-source Actions workflow](https://github.com/techrote/sandmapsreference/actions/workflows/original-industrial-hazard-wide.yml) · [Draft/HOLD PR #23](https://github.com/techrote/sandmapsreference/pull/23). Unlinked immobile solids remain subject to independent structural/art review.
