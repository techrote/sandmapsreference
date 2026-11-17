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
- Rectangle runs: **29103 / 32768**.
- JSON bytes: **526235 / 1048576**.
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
