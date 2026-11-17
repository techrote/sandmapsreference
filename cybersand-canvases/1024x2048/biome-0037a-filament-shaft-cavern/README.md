# BIOME-0037a — Filament Shaft Cavern, source-led R2

**DRAFT / HOLD, not owner-accepted.** This is an actual 1024×2048 Setup-v2 *material-cell* level, not substitute concept art. The archived first-generation material grid remains on [historical main/PR #1](https://github.com/techrote/sandmapsreference/pull/1). No engine code or source artwork changed.

| Original repository source (committed JPEG derivative) | Rebuilt material cells |
|---|---|
| ![Actual source preview](source-reference-preview.jpg) | ![Actual final material-cell grid](filament-shaft-cavern-preview.png) |

**Source provenance:** original full PNG at `artwork/living_landscapes/batch2/filament_shaft_cavern.png`, blob `9364b59479bb2eaf4d2a2924abb501ed8d9e26e3`. Original genuine `gh-pages` JPEG preview blob `168294085274702df98f5698721890fd30874c8f` was **visually inspected**. This is JPEG-source-preview-guided, **not** verified full-resolution PNG pixel parity.

## Real geometry and source composition — current Shepherd finishing pass

The upper pale-left tissue wall remains genuinely connected in final material cells. Fine tributary pore cuts and rooted filament forks break up same-sized oval repetition while preserving the main organic pale cliff. Its former mid-vault free-standing ladder has been **removed**; the revised SteelPlate service ladder is wall-tied at **x466–487, y574–1016**, with natural rock-side brackets, a shelf landing and a deliberately open mid-ladder **flight-transfer passage** at y786–864. This is a visual service ladder, **not** a promise of a Midge climbing control. The broad continuous shelf still spans x246–854 at y1018, with the separate eastern flight bypass intact.

The tall **lower half is an interpretive source-derived geological extension**, not a feature-by-feature reproduction of the short original artwork. Below the shelf, a connected west mass with nonrepeating passage mouths at about y1345 (upper root canyon), y1512 (mid diagonal transfer), and y1694 (deep return) meets two asymmetrical east cliff overhangs with actual hollow galleries. Shelves, cantilevers and landings are wall-rooted geological volumes rather than floating decorated lines. The dark central volume is deliberately reserved for Midge flight; there are multiple lateral returns and differentiated western/eastern destinations. The initial enclosed Water membership is unchanged.

## Exact actual-cell evidence

The [full overview](filament-shaft-cavern-preview.png) is 512×1024, sampled two material cells per output pixel. All six linked crops below are **native-resolution 512×512, one material cell per pixel**, from the exact same committed final grid.

- [Upper pale wall](filament-shaft-cavern-detail-upper.png): x0, y35
- [Mid-lattice](filament-shaft-cavern-detail-lamina.png): x0, y482
- [Ladder / shelf](filament-shaft-cavern-detail-shaft.png): x320, y568
- [Shelf / vertical return](filament-shaft-cavern-detail-lower.png): x360, y922
- [Deep west recess](filament-shaft-cavern-detail-deep.png): x0, y1320
- [East buttress](filament-shaft-cavern-detail-right.png): x512, y1300

## Deterministic reproduction

Node.js 18+ from this directory, with Git history available:

```bash
node build_rework_r2.js --check
node verify_rework_r2.js
node render_material_cells_r2.js
```

Run `node build_rework_r2.js` without `--check` to replace the setup from immutable original R2 assignment commit `8b43319f3eb43d2deef8502d59f70849cd0179f5`. `verify_rework_r2.js` independently checks every material cell, budget, exact spawn, and exact waypoints; `render_material_cells_r2.js` writes indexed lossless PNGs directly from the committed setup. Compatibility Python wrappers now delegate to these R2 tools. The prior C2 patch files are archival and **not** applied to R2.

**Checked (current HEAD):** 2,097,152 cells; **11111 / 32,768** nonoverlapping rectangles, **204439 / 1,048,576** JSON bytes, **0** full replay mismatches; **141,293** changed material cells versus previous R2 HEAD and **779,976** versus archived R1; **35,688** Water cells (0 changed). All 7 actual-grid PNGs independently decoded: **2,097,152** visible material-index pixels with 0 cell mismatches and 0 palette mismatches.

Midge's real rectangle hull is **4×3**. Independent full-grid integral-occupancy BFS at **19×15**, **23×19** and **31×27** conservative clearances reached **13/13 new exact functional sites and 15/15 original exact positional regressions** from unchanged Midge spawn (512,107). Fully bounded component counts: **1,168,018 / 1,122,344 / 1,045,020** respectively. No nearest-point search, offset waypoint, target-centred air carving or tolerance waiver. The historical labels remain positional regression locations, not claims that old exhibits remain.

**NATIVE-UNTESTED:** no installed CyberDemoBridge/Godot/Rapier load, material admission readback, physical Midge input/collision, Water simulation or save/reopen was performed. A legacy 4096-rectangle installed native DLL may refuse this 11111-rectangle candidate despite accepted-main's 32768 limit. Human source/composition assessment and physical Workbench acceptance are still required. Do not merge/mark Ready.

## Independent re-review handoff

The 17 November 2026 Shepherd review of `eddddcec7f3f13a4ef71d9d27152d00c6b88ff43` requested a bounded art/geometry finishing pass. This revision changes **141,293** real cells while retaining exactly **1024×2048**, all 28 exact target coordinates, accepted inert rock/plate material IDs, the original 35,688 Water cells and the committed JPEG reference untouched. `build_rework_r2.js --check` reconstructs from the immutable seed; the independent strict verifier and indexed renderer have been executed on the final plane. Current upper tissue is **190,350 / 190,350 connected cells** with no isolated pale chips. The original high-resolution PNG has not been pixel-compared and the physical native Workbench/GDExtension remains **NATIVE-UNTESTED**. Maintain Draft/HOLD.
