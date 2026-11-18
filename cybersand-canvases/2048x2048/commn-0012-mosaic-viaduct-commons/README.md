# Mosaic Viaduct Commons — CyberSand source-led R2

**2048 × 2048 real material cells · Draft / HOLD · PR #11.**

**CURRENT HEAD R2A4:** 8,434 rectangles, 163,421-byte generated-start manifest, 16/16 strict sites at all three clearances, new grounded inhabited civic subway. Previous numeric tables below document earlier iterations; latest counts are in the R2A4 section. The archived R1 is preserved on main; this R2 rebuild exists on its separate assigned branch, with no source-art or engine edits.

## Ground truth and fidelity

- Original PNG: artwork/neighbourhoods_commons/batch2/mosaic_viaduct_commons.png, catalogue ID commn-0012, source key batch2/images/img-040.png, original Git blob fb01ca96733623502e99e9734bf4fb7d5d28035e.
- **Actually inspected:** committed genuine repository source-reference-preview.jpg, blob 8cf59bbba8c4a4037924490b7d158872be876abd, plus committed before/after real material-grid previews and seven native-cell 1:1 crops. Original full-resolution PNG **not independently pixel-decoded**; parity UNVERIFIED.
- Actual authored changes: restored the asymmetrical left pale-tile civic block, open two-level rooms, blue-and-white mural, orange awnings, continuous rising broad public steps, large broad-canopy right-rooted tree, inhabited terrace and continuous illuminated **dry buried corridor**. Removed the unrelated giant roundel, six identical viaduct arches, mirrored housing, sign glyphs and water basin. **2,287,869/4,194,304 cell identities changed** from archived main.
- Render honesty: the source's blue photographic daylight sky is physically **Empty**, so the native-cell preview displays CyberSand's dark Empty colour. No screenshot-only backdrop, pseudo-materials or solid sky were inserted. This is a stylized orthographic *playable material translation*, not a claim of original-pixel parity.
- Tree leaves are legal immovable physical materials. Two decorative solids (pine-plank accents and moss-wall canopy) have Combustible laws, but there are no initial Fire/heat sources or unrestricted growing Plant/Cloner agents. No water, powders, gas or reactive liquid appears at start.

## Artifacts and offline regeneration

The playable artifact is **setup-mosaic-viaduct-commons.json**, a generated-start v1 manifest with unchanged verified empty GEN-007 recipe provenance and a strict starting Setup-v2 containing the current packed nonoverlapping material rectangles (see R2A4 below). The PNG files are only previews.

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
| Rectangles / Setup native constructor capacity | **7,863 / 32,768** |
| Manifest / 1 MiB limit | **152,210 / 1,048,576 bytes** |
| Physical material and Empty cells | 1,289,475 / 2,904,829 |
| Full independent cell replay | 4,194,304 / 4,194,304; no mismatch |
| SHA-256 of material plane | fcdab739ad94aae88ceaf1fc565951ba8afa7533c13876f81990b892ca7a1318 |
| Initially dynamic/movable materials | None (old 43,916 Water cells removed) |
| Valid native solid material identifiers | 30, all immovable, 2 Combustible without ignition |
| Exact 19×15 strict hull-centre 4-neighbour BFS | **16/16 named sites**; 2,370,337 connected centres |
| Exact 23×19 conservative sensitivity | **16/16**; 2,276,913 connected centres |
| 31×27 extra sensitivity (not admission floor) | **16/16**, all exact named sites connected |

Actor remains the original Midge definition/hash and exact spawn (404,502), actual hull **4×3**. All original 16 named coordinates remain exact with no nearest-waypoint substitution; their R1 names are *position regression labels*, not a claim the retired ring/arcade exhibits are still present. Primary outdoor route, upper/library egress, public stair maintenance opening, lower lateral corridor and descending access shafts are actual unobstructed cells.

Exact engine authority checked: techrote/cybersand main 018bd09503d7f079ddac52e225c2f7daf8d678bf, godot/scripts/workbench_setup.gd, native/include/cybersand/material.hpp and godot/authoring/flyers/midge.json. The 32,768 construction capacity applies to the source-matched native bridge. **Without its capability method, Setup.native_rectangle_budget() falls back to 4,096; this 7,863-rectangle map can be rejected by an older installed runtime.**

**NATIVE-UNTESTED:** no source-matched Godot/GDExtension/Rapier installation was present, so runtime native admission/capability readback, live Midge input, impact/collision, bounded simulation and fresh-process save/reopen remain external acceptance gates. Static BFS does not prove piloting dynamics. Shepherd independently reviews exact final HEAD. **Do not merge, Ready-promote, auto-merge, or edit any historical source or other PR.**

## Shepherd-assigned R2C finishing pass — 17 November 2026

Starting source HEAD: `362f86f0ea18b2e49ae8301a14c562310f87df1b`. This bounded follow-on responds to the genuine JPEG-source fidelity and technical reviews of the previous R2 commit. The earlier historical 'initial R2' statistics in REWORK-R2.md remain a record of the *previous* pass, not the final values here.

- **Stairs:** replaced thin periodically striped floating treads and sparse posts with uneven stone-mass risers, four differentiated public landings and a single stepped retaining spine. Existing air access is retained via a designed shaded civic opening, not by relocating a Midge destination.
- **Sails:** moved three real terracotta fabric roofs down over usable civic terraces and added hard-surface legible anchors. These are physical cells, not image overlays.
- **Tiles and rooms:** replaced large random-colour checker tiling with narrow ivory/cobalt floral bands, smaller differentiated glazing and occupied frontage. The exact Midge spawn remains open; an initial glass-window placement that trapped the spawn was rejected during iteration.
- **Tree:** replaced repeated ellipse/dot crown stamps with irregular overlapping polygon silhouettes attached to the original right-rooted trunk. No active plant growth, powder supports or ignition sources were introduced.
- **Buried corridor:** strengthened continuously identifiable masonry roof and gallery bays, with intentional large access shafts; a 31×27-compatible east maintenance chimney is true Empty air rather than a substituted waypoint.

**Final static receipts:** 2048×2048 = 4,194,304 material cells, 7,863 non-overlapping coalesced five-field rectangles (limit 32,768), 152,210 JSON bytes (limit 1,048,576), 1,289,475 occupied and 2,904,829 Empty, 369,139 material IDs changed from assigned HEAD, SHA-256 `fcdab739ad94aae88ceaf1fc565951ba8afa7533c13876f81990b892ca7a1318`. Independently reconstructed every JSON rectangle/cell against the new builder grid, zero mismatches. All 28 used non-Empty materials are valid non-movable accepted native solids; combustible ID(s) 97 remain unignited. Authored actor, exact spawn, 16 positional targets and native generator provenance are unchanged. Exact zero-offset four-neighbour rectangular actor-centre connectivity: 19×15 **16/16** (2,370,337 centres), 23×19 **16/16** (2,276,913), 31×27 **16/16** (2,132,661); no nearest-point waiver. Current loaded bridge capacity not interrogated: older fallback remains 4,096, which would reject 7863 rectangles. The output PNGs are real material-index PNGs rendered from the reconstructed grid, and the committed independent validator `node verify-r2.cjs` is provided for fresh local reproduction; it was not executed inside the GitHub connector environment. **NATIVE-UNTESTED** (Godot/GDExtension/Rapier admission, flight/collision/simulation, fresh-process save/reopen). Genuine committed JPEG is retained untouched; previous independent reviewers directly inspected it, while this execution could not decode the binary through the connector. Full original PNG pixel parity remains **UNVERIFIED**.


## Current R2B follow-on — physically grounded civic terrace (18 November 2026)

**This table supersedes the preceding R2C totals as the final artifact receipt.** Source-JPEG comparison directly performed: the original's rising terrace, continuous support and underground civic use informed new real-material masonry banks, asymmetrical vaulted halls, connected roofed undercroft and broad open Midge egress. No faux sky material, duplicate source art, or screenshot-only geometry. Rebuilt with deterministic `finish-r2b.cjs` integrated *before* the main builder's rectangle coalescence.

| Gate | Exact final R2B result |
|---|---|
| Cell plane | 2048×2048; 4,194,304 cells |
| Physical cells changed against assigned HEAD | 268,733 |
| Rectangles | 7,508 / 32,768 |
| JSON bytes | 145,339 / 1,048,576 |
| Solid/Empty cells | 1,191,548 / 3,002,756 |
| Full grid replay | 4,194,304 reconstructed, 0 mismatch |
| Grid SHA-256 | `5b94f810cc5a43476f59abf3ffc3b207ff73b3ec4672655a18e585e950ced390` |
| Exact target clearance, 19×15, 23×19, 31×27 | 19x15:16/16 (2547576 centres); 23x19:16/16 (2474690 centres); 31x27:16/16 (2299280 centres) |
| Genuine PNGs | Nine previews/crops rendered directly from this final material-cell grid |
| Native import/bridge capacity, simulation, input/collision, save/reopen | **NATIVE-UNTESTED**; source max 32,768, old installed fallback 4,096 |

Reference image is the unchanged committed genuine JPEG; original large PNG direct parity remains **UNVERIFIED**. The old 7,863-rectangle/152,210-byte receipts above document predecessor HEAD, **not** the current artifact. No owner acceptance or Ready/merge.


### 18 November 2026 Reworker A structural geometry
`build-r2.cjs` deterministically applies `finish-r2a.cjs` after previous R2B layers. Rebuild the committed Setup/PNG/evidence from one authored material plane. See the R2A section of `REWORK-R2.md`; original source preserved, native untested.

## R2A2 — Independent Shepherd P1 grounded-topology repair, 18 November 2026

**Exact exclusive input HEAD** `859bda5e937f343f3722a50e050d7a529f00f7f0`. Genuine committed source JPEG blob `8cf59bbba8c4a4037924490b7d158872be876abd` directly viewed beside the former real cell overview and 1:1 crops; full original-PNG pixel parity **UNVERIFIED**. Deterministically changed **52,068 real material cells** in `finish-r2a2.cjs`, called after pre-existing overlays.

Restored masonry load paths: western library wall **x54–91/y1150–1854**, west subway footing **x116–146/y1780–1854**, east rooted terrace terminal support **x1899–1939/y1740–1855**, five distinct short pier/wing connectors, west subterranean facade tie, and the **168×15-cell continuous rising plaza stringer** at x932–1099/y1190–1204. These connect the former 311,066-cell west civic mass, 264,064-cell eastern garden/tree body, 83,916-cell west lower wing and 61,199-cell stair bank to actual geologically grounded components, without one-cell cables or point-only operational clearances.

**Static evidence at this exact regenerated state:** 2048×2048, 8,148 supported physical rectangles / 32,768, 157,753 UTF-8 JSON bytes / 1,048,576, 1,372,176 occupied cells, full ordered rectangle replay **0 mismatches**, material SHA-256 `0c306366e3f0c27037263abe87e8cb18a099b516c00dcb692d16ce4e9dd3fbaa`. From genuine y=2047 Solid four-neighbour BFS **1,289,425 connected physical support cells**, six specified original structure checkpoints pass, **65 small separate decorative/secondary components remain** for independent scrutiny. Current accepted-main placed material types all immovable Solid, no added liquids or powder-rock materials. Exact named Midge static cardinal-clearance 16/16 at 19×15, 23×19 and 31×27, no nearest-site substitution. All nine real-grid PNG images rebuilt and 1:1 crops retained (7,077,888 deterministic material-index samples). `verify-r2.cjs` now includes 31×27 and grounded-component gate. PNGs generated from same final cell plane; independent readback remains for auditors.

**NATIVE-UNTESTED**: no physical Godot/CyberDemoBridge/Rapier load/install, actor movement/collision, simulation or save/reopen. Installed bridge capacity **UNMEASURED**, legacy 4,096 fallback would reject this rectangle count. OPEN Draft/HOLD; not Ready, merge or owner acceptance.


## Reworker A R2A3 — contiguous civic ascent, inhabited arcade and lower artery (18 Nov 2026)

**Assigned START:** `51a32d850f41466bdb18522e4ddf766a9cb35291`. The *genuine committed* 640×360 source JPEG `source-reference-preview.jpg` (blob `8cf59bbba8c4a4037924490b7d158872be876abd`) was actually viewed alongside the former and revised physical-cell overview. Original full-resolution PNG pixel parity **UNVERIFIED**.

The source's one continuous ascending civic public landscape has been reconstructed from **354,753 changed material cells**, not as rendered decoration: materially backed irregular stairs, planted rest landings, visible shop facades, asymmetric masonry arcade arches, supported room/vault bays and a full-length dry roofed subway artery with meaningful entrances and separate service openings. Preserved the distinctive western blue/ivory library, suspended orange sails, eastern rooted tree, open flight sky and 16 unchanged exact named Midge sites. All new geography is authored physical cells.

**Exact static replay:** 2048×2048, **8,581 / 32,768** rectangles, **166,245 / 1,048,576** Setup JSON bytes. All 4,194,304 cells independently replayed with zero difference; SHA-256 `ded00c67d55d9406cc9d2f159c2a32f38914a314808f3058def61727266b1beb`. All materials legal stationary Solid IDs according to accepted CyberSand main `018bd09503d7f079ddac52e225c2f7daf8d678bf`. World-bottom-connected solid component **1,430,519** cells. Fully in-bounds conservative 4-neighbour Midge centre-envelope reachability: **16/16** exact sites at **19×15, 23×19 and 31×27**. Pairwise 31×27 travel steps: West underpass → East underpass 1,427; West underpass → Reflecting basin 923; South mosaic overlook → East shelter 570; Western lower terrace → Central garden court 595; West high entry → East high entry 1,273. Blocking centre rectangle x1100–1250/y1420–1520 preserves lower alternate routes: 1,511 and 923 steps. Deterministic double regeneration plus **7,077,888** decoded indexed PNG pixel samples passed material-ID/palette parity, PNG chunk CRC32, DEFLATE and Adler32.

**Unresolved:** **NATIVE-UNTESTED**; actual Godot/CyberDemoBridge/Rapier loading, installed bridge rectangle capacity, Midge input/collision, simulation and save/reopen were not exercised. The 4,096 legacy native rectangle fallback would reject 8,581 rectangles; source code supports 32,768 but installed capacity remains unmeasured. Static actor-centre paths do not establish actual flight gameplay. Full original-PNG pixel comparison unverified. Remain **OPEN Draft/HOLD**, independent Shepherd/fidelity and owner evaluation required. Engine, history, original art, other PR branches and actor definition unchanged.


## Reworker A · R2A4 grounded, inhabited civic subway (18 November 2026)

The genuine, unchanged committed source JPEG (Git blob `8cf59bbba8c4a4037924490b7d158872be876abd`) was **viewed** alongside the real previous/final overview and native 1:1 buried-corridor crop. **Full-resolution original-PNG pixel parity UNVERIFIED.** Original reference work remains untouched. The illustrated civic library, orange shade sails, broad climbing public stair and rooted right-side canopy retain their prior authored source-derived layout; the newly refined lower subway is **extrapolated beyond the source core**.

**269,373 actual cell changes** in the existing lower district: the former detached roof/rack collection has been reconstructed as a load-bearing limestone/terracotta retaining body with seven **unequal carved usable vaults**, a continuous clear main artery, five open utility/daylight entries, a west civic archive, a central transfer bay/light court, an inert eastern pump maintenance chamber and an unequal eastern mural shelter. Structural shoulders, piers and floor masonry connect the underground into existing civic foundations. Equipment/glazing is now seated within physically supported chambers, rather than simply suspended in blank black air. The coherent upper stair and source landmarks were not flattened or re-scaled.

**Rebuilt exact cells:** 2048×2048, 8,434/32,768 nonoverlapping packed rectangles, 163,421/1,048,576 JSON UTF-8 bytes, 1,521,862 occupied material cells, zero full-plane replay mismatch. SHA-256 `6e10cf26d48a7671987614db4120714fa1ad931c3da4e4a8c5e4104b18cf7727`. All 28 used nonzero IDs match valid accepted immovable Solid palette laws. Strict full-in-bounds 4-neighbour Midge clearance from unchanged spawn and **16/16 original exact sites** at 19×15, 23×19 and 31×27 (2,192,965 / 2,115,437 / 1,968,058 connected centres). **1,294,115** foundation-connected solid cells; six named structural checkpoints grounded. At 31×27, West Underpass→East Underpass path length **1,087** centres normally, **1,121** with an independent artificial central-rectangle exclusion x=980–1115, y=1685–1755. This verifies static bypass, not kinetic piloting.

**Authentic material gallery:** Rebuilt full [2048² physical plane](preview.png), [overview](overview.png), seven existing 1:1 crops including [old underpass footprint](crop-buried-corridor.png), and three **new true native 1:1 views**: [west archive](crop-west-archive.png), [central transfer](crop-subway-transfer.png), [east shelter](crop-east-subway.png). All **12 PNGs** were generated from the same exact grid; 7,864,320 sampled physical-cell pixel positions, PNG chunk CRC, indexed material palette were checked. **Independent PNG decompression/readback NOT RUN**, so do not claim binary pixel-parity independently verified. Deterministic JavaScript builder executed in V8; **standalone Node command was not run**.

**NATIVE-UNTESTED:** no installed CyberDemoBridge rectangular capacity readback, Godot/Rapier import, native Midge control/collision, bounded physics progression or save/reopen. The accepted source advertises 32,768 rectangles; an older installed fallback may still limit acceptance to 4,096. OPEN Draft/HOLD for Shepherd and auditors; no merge, Ready or owner acceptance.
