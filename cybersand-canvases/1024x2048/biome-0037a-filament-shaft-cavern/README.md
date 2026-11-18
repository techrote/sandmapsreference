# BIOME-0037a — Filament Shaft Cavern (current Reworker C physical-cell map)

**DRAFT / HOLD; neither native-tested nor owner accepted.** Source-led **1024×2048** Setup-v2/generated-start canvas in existing PR #12. Original artwork and merged historical first-generation version are untouched.

| Authentic source JPEG | Exact 1:1 final material-cell canvas |
|---|---|
| ![Authentic reference](source-reference-preview.jpg) | ![Current real cells](filament-shaft-cavern-material-1024x2048.png) |

Committed source JPEG blob `168294085274702df98f5698721890fd30874c8f` was directly viewed against current material-cell overview and native crops; original PNG `artwork/living_landscapes/batch2/filament_shaft_cavern.png` blob `9364b59479bb2eaf4d2a2924abb501ed8d9e26e3` remains unchanged and **full original PNG pixel parity is UNVERIFIED**.

## Level / artistic morphology

An attached, bifurcated pale tissue/filament cliff fills the upper-left. Different-size openings and rooted asymmetric forks preserve recognisable source identity without ten repeated identical ellipses, image-only overlays, floating chips or repetitive diagonal textures. The long operational shelf and wall-supported SteelPlate access ladder have explicit attached brackets and a clear mid-flight transfer opening; no native ladder-climb controls are claimed. The dark upper/central free-flight void remains intentional.

The lower half is explicitly **newly extrapolated** organic/geological gameplay outside the short source image: distinguishable warm west limestone terraces versus dark east basalt galleries, supported mineral margins and newly widened side cuts that retain free-flight and alternate returns. The sealed historic bottom Water basin retains its original 35,688 material cells.

## Authentic gallery

| Physical grid PNG | Cell-space origin and extent | Scale |
|---|---|---|
| [filament-shaft-cavern-material-1024x2048.png](filament-shaft-cavern-material-1024x2048.png) | (0,0) 1024×2048 | 1:1 actual cells |
| [filament-shaft-cavern-preview.png](filament-shaft-cavern-preview.png) | (0,0) 1024×2048 | two cells/pixel |
| [filament-shaft-cavern-detail-upper.png](filament-shaft-cavern-detail-upper.png) | (0,35) 512×512 | 1:1 actual cells |
| [filament-shaft-cavern-detail-lamina.png](filament-shaft-cavern-detail-lamina.png) | (0,482) 512×512 | 1:1 actual cells |
| [filament-shaft-cavern-detail-shaft.png](filament-shaft-cavern-detail-shaft.png) | (320,568) 512×512 | 1:1 actual cells |
| [filament-shaft-cavern-detail-lower.png](filament-shaft-cavern-detail-lower.png) | (360,922) 512×512 | 1:1 actual cells |
| [filament-shaft-cavern-detail-deep.png](filament-shaft-cavern-detail-deep.png) | (0,1320) 512×512 | 1:1 actual cells |
| [filament-shaft-cavern-detail-right.png](filament-shaft-cavern-detail-right.png) | (512,1300) 512×512 | 1:1 actual cells |

All eight PNGs were rendered from the final Setup-v2 replay, with integrity/palette/pixel parity verified. The 1024×2048 image is **one PNG pixel per authored material cell**.

## Rebuild and qualification

Node 18+ with Git history available; run inside this directory:

```bash
node build_rework_r2.js --check
node verify_rework_r2.js
node render_material_cells_r2.js
```

Builder reconstructs original immutable R2 seed `8b43319f3eb43d2deef8502d59f70849cd0179f5`, replays R2A and deterministic `finish_r2c.js`, and coalesces the complete real grid. Independent `verify_rework_r2.js` checks source v2 compatibility, exact old/new destination positions, actor clearance and all cells. Previous A stages remain documented in [REWORK-R2.md](REWORK-R2.md).

**Exact static evidence:** 2,097,152 cells, 16,867/32,768 rectangles, 305,470/1,048,576 JSON bytes, zero full-grid replay mismatches; **74,482 real cells changed** since assignment HEAD `b810b1ff4bfef8b6999f4f9bc3147803634d6ebc`. No changed Water cells; 195,488/195,488 contiguous upper tissue cells. Actual 4×3 Midge hull unchanged. Exact centre BFS reaches all 13 new plus 15 historical coordinates with **19×15 / 23×19 / 31×27** fully in-bounds envelopes, connected centres **1,175,509 / 1,121,858 / 1,032,488**, no waypoint proxy or relaxed mask. Real PNGs verified at original material IDs, no image art substitute.

**NATIVE-UNTESTED:** Source-matched native Workbench import/physical Midge flight and collision/Water progression/save-and-reopen not executed. Older native 4,096-rectangle capacity would reject 16,867; accepted CyberSand source permits 32,768. Remain Draft/HOLD for independent Shepherd, fidelity and physical owner evaluation.
