# Filament Shaft Cavern — CyberSand Workbench canvas

**Reference:** [filament_shaft_cavern.png](https://github.com/techrote/sandmapsreference/blob/main/artwork/living_landscapes/batch2/filament_shaft_cavern.png) (public ID `biome-0037a`).

**Reference provenance:** blob SHA `9364b59479bb2eaf4d2a2924abb501ed8d9e26e3`; original SHA256 `51a462e4c1ed83e187a60c8842a3b7104c56ee1152aefde2ae129b2e95aff208`; original dimensions unavailable because the source image's binary content could not be opened in this tool environment.

**CyberSand authority:** `techrote/cybersand@018bd09503d7f079ddac52e225c2f7daf8d678bf` on `main`.

## Level design

An orthographic side-elevation **1024×2048** material-cell cavern with a broad continuous vertical free-flight shaft; nine alternate left/right grotto destinations, calcite and moss strata, luminous stable mineral filaments, suspended pods, natural gallery ledges, and a contained lower water reservoir. The Midge starts at (512,107), with natural cross-corridor portals into the side chambers. Luminous art is true static CyberSand material, not a bitmap overlay or growing Plant/Fungus.

The design translates the **filament shaft** theme of the selected repository artwork; it is **not a verified close visual match**. The original source image could not be visually inspected through the available connector. Shepherd/owner source-image comparison is required.

## Actual setup

`setup-filament-shaft-cavern.json` is plain Workbench **starting setup v2**, containing authentic `extent`, `actors`, `edits`, response and liquid-policy fields. No unsupported generator wrapper or fake extension is involved.

- Exact canvas: 1024×2048.
- Rectangle runs: **30724 / 32768**.
- JSON bytes: **555613 / 1048576**.
- Exact material-cell reconstruction: **0 mismatches / 2097152 cells**.
- 19×15 conservative Midge free-space clearance: **15/15 destinations reachable**.
- Lower contained reservoir: 35688 real water material cells.
- Committed PNG is a 512×1024 overview directly sampled from authored material cells. `rebuild_preview.py` reconstructs a fresh preview from the committed JSON.

## Native qualification

Static reconstruction, budgets and conservative envelope connectivity are tested here. Godot/CyberDemoBridge/native simulation, physical Midge input, Rapier progression, and actual Workbench save/reopen **were not run**, and must not be claimed. The exact original reference pixel composition could not be inspected and must be compared by the shepherd/owner.

## Owner loading

Copy the JSON to the Workbench `workbench` start folder (typically `%APPDATA%\Godot\app_userdata\Cyber Sand Reference Sandbox\workbench\` on Windows), load the named `filament-shaft-cavern` setup, select the Midge, and verify all side grottoes, lower basin containment, and real save/reopen. Keep Draft/HOLD until acceptance.


## Reworker A — organic morphology repair (2026-11-17)

**Starting HEAD:** `d20c42cd9d1058e0aed5779b8ec68d495b4994c6`. Shepherd verdict was **REWORK REQUIRED**. This repair changes **110,701 actual material cells**, not just the preview or documentation. New geometry includes asymmetrical side-grotto roof erosion, three additional natural side passages, zone-dependent lamination and filament networks, denser organic props, divergent fossil/pollen/echo/crystal landmarks, and partial replacement of repeated portal-bulb accents. Original route anchors and the broad central flight shaft are preserved.

Final construction is **29,103 / 32,768** rectangles and **526,235 / 1,048,576** setup bytes. Overlay reconstruction differs by **0 / 2,097,152** cells; an independent rectangle-obstacle integral-image BFS with a **19×15** clearance rectangle reaches **15/15** named sites, including the original Midge spawn. Real Water remains **35,688** cells in the sealed basin. The thumbnail is recomputed directly from final material IDs; `filament-shaft-cavern-detail-upper.png` and `filament-shaft-cavern-detail-lower.png` provide native-resolution crops.

**Reproducibility:** `rework_patch.json` records every sparse overlay rectangle against immutable source commit `d20c42cd9d1058e0aed5779b8ec68d495b4994c6` and `replay_rework.py` reconstructs the published setup from that source. `rebuild_preview.py` regenerates the overview and crops from the JSON's actual cell plane.

**Unresolved / still HOLD:** The original repository PNG binary remains inaccessible in this tool environment, so close visual correspondence to the specific original artwork is still **unverified**. CyberDemoBridge/Godot/Rapier, live material catalogue admission, actor-hash admission, and physical save/reopen were **not** exercised. This is an improved static candidate, **not** native/owner-playtest acceptance.

## Reworker C — macro-composition finishing (2026-11-17)

Starting HEAD `b9268544e32ceeffa26cdfb9b95c9773ef0bcf84`, Shepherd `CANVAS-REWORK-C: 1 @ b9268544e32ceeffa26cdfb9b95c9773ef0bcf84`. The 1024×2048 material plane changes **40356 cells** through **1373 deterministic C overlay rectangles**, keeping all A-stage edits. The repeated middle-left oval is split with an asymmetric roof fissure; the next left chamber receives a wall-anchored laminated rock pocket and cross-height throat. A nonidentical upper-right rocky eyebrow, an opened approach to the preserved luminous ring, a grounded irregular right buttress, and two supported directional rock-root masses strengthen world-scale silhouette and flight wayfinding. No original exhibits or waypoint coordinates were moved. No bitmap-only additions.

**Exact final checks:** 2097152 cells, 0 final-grid mismatches, 30476/32768 stored edits (25417 final coalesced nonempty rectangles), 550855/1048576 JSON bytes, 35688 Water cells (changed 0), valid unchanged material IDs. Full spawn-connected actor-envelope centre clearance is **15/15 exact named sites at both 19×15 and 23×19**; these are static graph checks, not native flight dynamics.

**Evidence:** `rework_c_patch.json` is replayed after the original A overlay by `replay_rework.py`; `rebuild_preview.py` reconstructs the exact full map and four 1:1 512×512 crops. Committed PNGs: `filament-shaft-cavern-preview.png` (512×1024 overview sampled from 1024×2048 cells); `filament-shaft-cavern-detail-upper.png` (x0,y430); `filament-shaft-cavern-detail-lamina.png` (x0,y775); `filament-shaft-cavern-detail-lower.png` (x512,y895); `filament-shaft-cavern-detail-shaft.png` (x312,y1120). RGB values derive from `palette.json`.

**HOLD:** original `biome-0037a` PNG pixels could not be retrieved, so source comparison remains **UNVERIFIED**. Native Godot/CyberDemoBridge/Rapier import/install, real Midge flight/collision, Water simulation, installed rectangle-capacity readback, and save/reopen were **NOT TESTED**. Independent reviewer/owner acceptance required. No merge or Ready.

## Reworker C — targeted C2 composition repair (2026-11-17)

**Starting HEAD:** `fbe9abfbdc00d3583eb4cb48b22933b36c466869`, Shepherd's explicit `CANVAS-REWORK-C: 1 @ fbe9abfbdc00d3583eb4cb48b22933b36c466869`. The lowest remaining left oval room now has an irregular **roof-rooted shale keel** (x≈102–230, y1588–1707) and a distinctive **bank-rooted west geological spur** (x20–140, y1672–1782), changing its complete roof-to-floor silhouette rather than cloning more filament sprays. The redundant floating guide at x346–456/y1269–1311 has been erased from the shaft. Existing upper fissure, lamina, focal ring, semantic targets, spawn and all Water cells are preserved. After reviewing a first native-cell crop, the overly regular keel striations were reduced and both rock contours made less mechanically smooth.

**Exact new result:** **15,573 changed material cells**; `248` authored C2 overlay rectangles, **30,724 / 32,768** final stored edits, **25,520** final native-style coalesced non-air runs, **555,613 / 1,048,576 bytes**. All **2,097,152** cells replay exactly from the stored edits and deterministic overlay; **35,688 Water cells, zero changed**. Legal stable solids only added (IDs 100,49,42), removal to empty ID 0; no Stone powder. **15/15 exact original Midge destinations** reached from spawn (512,107), with 19×15 and 23×19 conservative clearance; 31×27 also 15/15. Static clearance is not native flight behavior.

**Reproduction and real-cell gallery:** `generate_rework_c2.py` regenerates the bounded overlay `rework_c2_patch.json`; `replay_rework.py` replays A→C→C2; `rebuild_preview.py` renders from the final material-cell plane. [Overview](filament-shaft-cavern-preview.png), [upper fissure](filament-shaft-cavern-detail-upper.png), [lamina](filament-shaft-cavern-detail-lamina.png), [luminous core](filament-shaft-cavern-detail-lower.png), [shaft](filament-shaft-cavern-detail-shaft.png), [deep left cavity](filament-shaft-cavern-detail-deep.png). The overview is sampled 2:1; five detail crops are **native 1 cell = 1 pixel, 512×512**.

**Draft / HOLD:** original Git source image `biome-0037a` at blob `9364b59479bb2eaf4d2a2924abb501ed8d9e26e3` remains **SOURCE-UNVERIFIED** because real original pixels were inaccessible. The Water reservoir is enclosed and its gameplay intent unconfirmed. Installed bridge rectangle limit, Godot/Rapier actual import and Midge flight/collision, dynamic Water and save/reopen are **NATIVE-UNTESTED**. No native/physical acceptance or source-fidelity pass claimed.
