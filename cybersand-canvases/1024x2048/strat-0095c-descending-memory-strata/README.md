# Descending Memory Strata — 1024×2048 playable CyberSand canvas

**Status: DRAFT / HOLD — pending independent source-image comparison and native Windows acceptance.**

## Source and adaptation

- **Reference:** `strat-0095c` — [Descending memory strata](https://github.com/techrote/sandmapsreference/blob/main/artwork/rock_ice_caverns/batch2/descending_memory_strata.png)
- **Original path:** `artwork/rock_ice_caverns/batch2/descending_memory_strata.png`
- **Original Git blob SHA:** `b2739b071ef8a1e8391359608e5347ed492b2cea`
- **Original SHA-256 (source-map):** `2246e64ad08db98ab44699512d9de8685770d133d1898c0dfb22eb28dac5a27a`
- **Original dimensions:** `1774×887` (landscape)
- **Catalogue group:** `cantilever_memory_strata`; category: `rock_ice_caverns`; source caption describes a fossil optical network in a suspended limestone wedge, translucent archives, a ladder-accessible excavation shelf, and a copper cable retrieval station below. The catalogue `visual_description` identifies a long ladder beneath a tapered teal-banded cave wedge.
- **Canvas target:** exactly **1024×2048**, recomposed vertically. This is not a stretched bitmap or an imported image; the landscape reference becomes eight descending geological epochs, two irregular broken escarpments, archive galleries, cantilever ledges, and a central service rift. A suspended banded limestone wedge, copper retrieval drum, ladder, optic fibres and archival tablets preserve prominent caption-grounded motifs.

**Source fidelity limitation:** GitHub connector provided source metadata and Git blob identity, but not the original binary PNG pixels. The author visually reviewed the generated PNG, **not the reference side-by-side**. No pixel-level or independent reference-fidelity qualification is claimed. The shepherd should review the linked source image manually against the committed preview.

## Playable design

- **Spawn:** current authored Midge body (`midge`, hull `4×3`) in upper central rift at `(503,75)`; boost `1.5×`.
- **16 named destinations:** Capstone Fossil, Amber Cells, White Tablets, Memory Reel, Obsidian Vault, Quartz Fan, Cenotaph, Sigil Observatory, Lapidary, Archive Index, Echo Chamber, Sentinel Hall, Terminus Reader, Upper Fault Crossing, Lower Fault Crossing, Deep Cleft Exit.
- The free-flight spine is continuous, with left and right side galleries, portals, multiple shelf approaches, and a lower retrieval station. Its wide passages are deliberately clear; non-air materials are treated as obstacles for conservative qualification, even if the native material might be passable.
- All architecture is strict front-facing 2D side elevation. Palette uses inert hard-structure terrain, quartz, stone, metals, inlaid registers and luminescent-looking stable materials. No loose Sand, mobile Stone powder, real liquids, Fire, or active growth is seeded. Geological limestone uses immobile LimestoneBlock ID 38 instead of mobile Stone ID 13.

## Files

- `setup-descending-memory-strata.json` — Workbench Setup-v2 material grid, 24,162 rectangles and a selected Midge actor.
- `descending-memory-strata-preview.png` — directly downsampled 512×1024 index-colour render of authored material cells (not a concept illustration).
- `builder.cjs` — fixed-seed, deterministic Node builder. Includes 19×15 clearance-mask connectivity and exhaustive material-grid reconstruction checks.
- `rebuild.cjs` — dependency-free deterministic rebuild/verification runner including three 512×512 native-material-cell district crops.
- `evidence.json` — exact counts, every route waypoint, material histogram, known qualification gaps.

## Qualification (CyberSand `main` at `018bd09503d7f079ddac52e225c2f7daf8d678bf`)

| Check | Result |
| --- | --- |
| Extent | `1024×2048`, within `512–2048` each side and multiple of 64 |
| Rectangle count | **24,162 / 32,768** |
| Serialized JSON | **445,357 / 1,048,576 bytes** |
| Cells reconstructed exactly from serialized rectangles | **2,097,152 / 2,097,152**, zero mismatches |
| Conservative clearance box | **19×15 cells** (Midge hull 4×3 + a large margin) |
| Accessible named destinations | **16/16 exact declared final inspection points**, measured on the 19×15 clearance-eroded cell grid; the 13 originally blocked semantic centres are transparently relocated to accessible room-interior airspaces |
| Preview dimensions | **512×1024**, directly from same authored material grid |
| Native Godot/Rapier parse, install, actor input, save/reopen | **Not executed** — native Godot/runtime not present in authoring environment |
| Original reference image side-by-side | **Not executed** — image bytes inaccessible through connected GitHub file connector |

The current Setup-v2 GDScript loader allows up to 32,768 rectangles, but older native DLLs can report a smaller limit (down to 4,096). This canvas therefore requires a current native build exposing sufficient capacity. Do not treat offline validation as actual native acceptance.

## Reworker A repair: source-defined materials and exact inspection points

**Critical material fix.** The geological band selector erroneously used the band upper-Y coordinate as an ID, producing native-unsupported IDs 237/250 and unwanted active Plant 11, TarBlock 95, ThermiteBrick 116 and other unintended IDs. The selector now uses the band material field, and immobile LimestoneBlock 38 replaces dynamic Stone powder 13. The final exact-grid histogram contains only native-defined structural IDs: 0, 38, 40, 49, 50, 53, 62, 65, 77, 78, 79, 80, 100, 101, 119, 122. This is source-catalogue validation, not a live bridge acceptance claim.

**Navigation.** The 16/16 nearest-surrogate/offset waiver was removed. All 13 exhibit-centre coordinates that collided with tablets, rings, minerals or machines have been deliberately replaced with named, usable interior gallery inspection positions. Every final coordinate must be legal and connected under the conservative 19×15 envelope, or the deterministic builder fails. We preserved the existing real room-to-cleft passages; no new interior portals or corridors are claimed.

| Destination | Old exhibit centre | New exact inspection point | Reason |
|---|---|---|---|
| Capstone Fossil | (200, 162) | (222, 145) | Capstone gallery viewing space beside intact fossil/cabinets |
| Amber Cells | (171, 441) | (237, 449) | Interior west gallery inspection aisle beside resin inclusions |
| White Tablets | (190, 672) | (257, 667) | Gallery aisle alongside tablet display |
| Memory Reel | (205, 1005) | (317, 1013) | Clear viewing bay east of intact monumental reel |
| Obsidian Vault | (210, 1278) | (243, 1263) | Interior viewing air above obsidian crystal cluster |
| Quartz Fan | (188, 1543) | (235, 1534) | Interior aisle alongside quartz fan |
| Cenotaph | (204, 1850) | (260, 1850) | Eastern clear gallery aisle beside cenotaph and burial rings |
| Sigil Observatory | (844, 234) | (766, 239) | Western observation bay outside monumental sigil |
| Lapidary | (842, 552) | (778, 552) | Western lab aisle avoiding slabs |
| Archive Index | (837, 886) | (765, 886) | Outer catalogue aisle avoiding stacked index registers |
| Echo Chamber | (836, 1250) | (836, 1209) | Upper acoustic chamber airspace over resonator arrays |
| Sentinel Hall | (830, 1600) | (774, 1600) | Clear western aisle beside sentinel columns |
| Terminus Reader | (843, 1920) | (769, 1905) | Viewing bay west of intact roll-reader drum |

Three rift-crossing/exit points remain at their original exact coordinates.

**Independent static verification:** 1024×2048; 24,162 bounded terrain rectangles; 445,357 JSON bytes; 1,061,246 stamped-cell operations; 2,097,152/2,097,152 exact material reconstruction; 682,132 reachable 19×15 Midge-clear centres; 16/16 exact final sites with no hidden offsets. The preview is a genuine material-grid PNG, not concept art. Three committed 512×512 native-cell crops cover upper strata/wedge, central shaft/retrieval drum and lower archives.

**Outstanding qualification:** Original 1774×887 source PNG has not been visually inspected alongside this substantial portrait recomposition. Godot/CyberDemoBridge/Rapier actual load, material and actor-hash admission, physical navigation, simulation and save/reopen are all NOT EXECUTED. Remain Draft/HOLD until independent source comparison and native owner acceptance.

## Owner evaluation

1. Checkout this PR branch or download `setup-descending-memory-strata.json` directly.
2. In a current native CyberSand Workbench build, place/import the JSON as a saved starting setup using the Workbench canvas import/reopen path.
3. Confirm the entire **1024×2048** extent appears, selected Midge spawns in the top-central rift, and all 16 sites can be flown to without obstructed approach paths.
4. Simulate and verify stable terrain and no unintended dynamic material activity. Save and reopen, then compare the actual terrain state against the initial authored canvas.
5. Visually compare [original](https://github.com/techrote/sandmapsreference/blob/main/artwork/rock_ice_caverns/batch2/descending_memory_strata.png) to the preview; decide whether the stylised vertical recomposition retains the reference's signature wedge/cable/layered archive structure.

To regenerate and verify locally with Node ≥20, run `node rebuild.cjs` and `node rebuild.cjs --verify`. No package installation is required.

**Do not merge, auto-merge, or mark Ready without owner acceptance.**
