# Mosaic Viaduct Commons — CyberSand source-led R2

**2048 × 2048 real material cells · Draft / HOLD · PR #11.** The archived R1 is preserved on main; this R2 rebuild exists on its separate assigned branch, with no source-art or engine edits.

## Ground truth and fidelity

- Original PNG: artwork/neighbourhoods_commons/batch2/mosaic_viaduct_commons.png, catalogue ID commn-0012, source key batch2/images/img-040.png, original Git blob fb01ca96733623502e99e9734bf4fb7d5d28035e.
- **Actually inspected:** committed genuine repository source-reference-preview.jpg, blob 8cf59bbba8c4a4037924490b7d158872be876abd, plus committed before/after real material-grid previews and seven native-cell 1:1 crops. Original full-resolution PNG **not independently pixel-decoded**; parity UNVERIFIED.
- Actual authored changes: restored the asymmetrical left pale-tile civic block, open two-level rooms, blue-and-white mural, orange awnings, continuous rising broad public steps, large broad-canopy right-rooted tree, inhabited terrace and continuous illuminated **dry buried corridor**. Removed the unrelated giant roundel, six identical viaduct arches, mirrored housing, sign glyphs and water basin. **2,287,869/4,194,304 cell identities changed** from archived main.
- Render honesty: the source's blue photographic daylight sky is physically **Empty**, so the native-cell preview displays CyberSand's dark Empty colour. No screenshot-only backdrop, pseudo-materials or solid sky were inserted. This is a stylized orthographic *playable material translation*, not a claim of original-pixel parity.
- Tree leaves are legal immovable physical materials. Two decorative solids (pine-plank accents and moss-wall canopy) have Combustible laws, but there are no initial Fire/heat sources or unrestricted growing Plant/Cloner agents. No water, powders, gas or reactive liquid appears at start.

## Artifacts and offline regeneration

The playable artifact is **setup-mosaic-viaduct-commons.json**, a generated-start v1 manifest with unchanged verified empty GEN-007 recipe provenance and a strict starting Setup-v2 containing 7,608 actual non-overlapping coalesced material rectangles. The PNG files are only previews.

With Node 20+ in this folder run **node build-r2.cjs** followed by **node verify-r2.cjs**. build-r2.cjs is the deterministic source of truth for 4,194,304 material cells and indexed PNGs; verify-r2.cjs is a separate JSON/PNG/material actor-envelope checker using Node's native zlib. Legacy **python build.py** now forwards to the Node R2 generator; the old R1 authoring program remains available in archival main. Neither generator requires network access, image services or third-party packages. Frozen material-palette.json and generated-start template remain in this folder.

### Source vs actual material-cell gallery

- [Genuine source-reference JPEG](source-reference-preview.jpg) vs [2048² physical-cell preview](preview.png), with [1024² sampled overview](overview.png).
- [Civic facade at 1:1](detail-civic.png) — origin (39,365), 512²; [upper arcade transition](detail-viaduct.png) — (715,736), 512².
- [Canopy and rooted tree at 1:1](detail-gardens.png) — (1211,549), 512²; [west shops](detail-west-gardens.png) — (45,1050), 512²; [right terrace](detail-east-gardens.png) — (1320,1010), 512².
- [Stepped plaza at 1:1](crop-stair-plaza.png) — (890,929), 512²; [continuous lit buried corridor at 1:1](crop-buried-corridor.png) — (825,1468), 512².

All gallery PNG pixel indices are sampled from the *same final 2048² grid* and the exact accepted native palette. Detail crops are truly one cell per pixel; overview is nearest-neighbour 2:1 sampling.

## Structural and playability evidence

| Gate | Exact static result |
|---|---|
| Dimension / material-plane cells | 2048×2048 / 4,194,304 |
| Rectangles / Setup native constructor capacity | **7,608 / 32,768** |
| Manifest / 1 MiB limit | **150,270 / 1,048,576 bytes** |
| Physical material and Empty cells | 1,268,041 / 2,926,263 |
| Full independent cell replay | 4,194,304 / 4,194,304; no mismatch |
| SHA-256 of material plane | e813e22edb7da8752245bcebff5eb835670e4d4c580f73adbd7d3b8ec4ac052b |
| Initially dynamic/movable materials | None (old 43,916 Water cells removed) |
| Valid native solid material identifiers | 30, all immovable, 2 Combustible without ignition |
| Exact 19×15 strict hull-centre 4-neighbour BFS | **16/16 named sites**; 2,405,124 connected centres |
| Exact 23×19 conservative sensitivity | **16/16**; 2,317,984 connected centres |
| 31×27 extra sensitivity (not admission floor) | **15/16**, East underpass not connected, though its centre is clear |

Actor remains the original Midge definition/hash and exact spawn (404,502), actual hull **4×3**. All original 16 named coordinates remain exact with no nearest-waypoint substitution; their R1 names are *position regression labels*, not a claim the retired ring/arcade exhibits are still present. Primary outdoor route, upper/library egress, public stair maintenance opening, lower lateral corridor and descending access shafts are actual unobstructed cells.

Exact engine authority checked: techrote/cybersand main 018bd09503d7f079ddac52e225c2f7daf8d678bf, godot/scripts/workbench_setup.gd, native/include/cybersand/material.hpp and godot/authoring/flyers/midge.json. The 32,768 construction capacity applies to the source-matched native bridge. **Without its capability method, Setup.native_rectangle_budget() falls back to 4,096; this 7,608-rectangle map can be rejected by an older installed runtime.**

**NATIVE-UNTESTED:** no source-matched Godot/GDExtension/Rapier installation was present, so runtime native admission/capability readback, live Midge input, impact/collision, bounded simulation and fresh-process save/reopen remain external acceptance gates. Static BFS does not prove piloting dynamics. Shepherd independently reviews exact final HEAD. **Do not merge, Ready-promote, auto-merge, or edit any historical source or other PR.**
