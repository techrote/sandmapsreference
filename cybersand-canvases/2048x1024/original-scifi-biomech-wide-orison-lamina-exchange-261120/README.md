# Orison Lamina Exchange — original 2048×1024 CyberSand industrial/biomechanical map

**Draft/HOLD · AUTHOR STATIC-PASS · INDEPENDENT Art/Technical/Shepherd review REQUIRED · NATIVE-UNTESTED.**

This is a new perpendicular **true 2D side-elevation** material-cell facility, not an adaptation of a photograph, prior CyberSand world, existing PR, or generated concept-art image. It produces dry, organism-tempered ship-hull lamina by transferring sealed coupons through an inert extrusion and assay line. The Midge begins at the western isolation dock and must inspect an actual enterable lower assay cradle before reaching east freight recovery.

## Grounded industrial location and five districts

1. **Quarantine and purging (x0–350):** unequal dry containment shells, transfer pipe, operator decontamination bay, index gauges and rooted supports; Midge opens from the western intake.
2. **Preform extrusion and tension transfer (x350–750):** floor-anchored diagonal frame, irregular three-drum machinery, handoff ledgers, a full-height material reading spine and specimen gauges, with multiple alternate fly-through heights.
3. **Lamina exchange and diagnostic (x750–1320):** four *differently profiled* roof-held cassette blades and a twin-sampling shuttle above an asymmetric floor-anchored lamina cradle. The real **entered_assay_cradle (1025,831)** has opposed manipulator shoulders, calibration lamps, a diagnostic deck and an open Midge-scale flight throat. Upper cassette and lower cradle are intentionally separated by working open-air flight space, not a fake unsupported contact.
4. **Membrane curing and transfer (x1320–1690):** three unequally proportioned rooted polymer/ceramic curing retorts, visually differentiated left valve, raised extraction service and anchored readout/interface masts.
5. **Freight recovery (x1690–2048):** roof-rooted inspection probe opposite a forked bedrock-supported loading cableway, multiple grounded operator pads, articulated sling, scan pallet and finish gate.

**Macro silhouette:** two separated retaining roof scars, a central multi-finger descending lamina shuttle and offset low assay saddle, a single isolated tall readout spine to the west and folded east freight gantries. All material is on the same orthographic 2048×1024 plane; zero background-only/scenic shape layers.

## Literal route graph / no target shifting

Spawn `spawn_isolation_port (126,518)` → `west_quarantine_hatch (255,620)` → `extraction_ledger (465,680)` → `sawtooth_spool (608,500)` → `upper_shuttle (975,363)` → `central_lamina_focus (1024,532)` → `entered_assay_cradle (1025,831)` → `lower_return (1280,739)` → `east_polymer_valve (1435,590)` → `drying_controls (1625,625)` → `export_cableway (1831,652)` → `finish_freight_gate (1958,548)`.

The source grid gives **12/12 exact-centre** named sites, all with four immediately legal cardinal approaches at each conservative **19×15, 23×19, 31×27** envelope. These are in-bounds full-hull free-centre 4-neighbour BFS checks — not guessed camera positions, visual sightlines, circles, nearest-cell substitutions, or native movement claims.

Independent high/low alternatives use west gate **(682,548)** and east gate **(1339,545)**. In the central span **830≤x≤1210**, the high traversal must remain **y≤397** and low traversal **y≥711**. Both separately constrained 31×27 paths pass **before and after inserting a genuine 173×172 solid obstruction at (941,452)**. A literal site buried by the obstruction is *not* claimed recovered; this test proves the redundant bypass and return route remain open.

## Deterministic full-material static receipt

- Seed **2611200739**, author geometry **328 authored operations** (including bespoke asymmetry and component subassemblies). Reproduce: `node build.js design.json ./rebuilt` (Node ≥18, no dependencies).
- Accepted read-only CyberSand engine authority: **de109d0131641d6adc8d25bb9ced7ca3d4991105**; source repository main: **99a166e7fcae45eb22be1740e9f33f62faccbcc7**. All source/actor/physics conclusions refer to those exact commits, not an installed executable.
- Exactly **2,097,152** final one-byte material-ID cells (**2048×1024**); SHA-256 **09ccfd9b22d532e8ac39014232bae8dd1b8848cbb451b93a730590b4f3b7ee56**.
- **601,760/601,760** physical inert-solid cells are four-neighbour **boundary-grounded**, with **0** detached final solids. **9,124** unsupported *nominal pre-final* decorative cells are intentionally rejected before serialization. Final grid: 0 powders, fluids, moving or reactive materials.
- Valid accepted *static inert* materials: 58 reinforced concrete; 62 steel plate; 63 painted steel; 72 dark glass; 77 neon cyan; 79 neon amber; 100 basalt columns; 101 obsidian; 117 bare iron; 128 polymer panel; 130 carbon fibre. Engine descriptor properties (Solid / immovable / RuleKernel::None) are the source authority.
- Exactly **6,944** nonoverlapping ordered five-field Setup-v2 rectangles, 0 invalid/overlap/replay mismatches, **131,743** UTF-8 Setup bytes, **601,760** construction-cell work; within source budget **32,768 rectangles**, **1 MiB JSON**, **32 million** construction visits.
- `setup-orison-lamina-exchange.json` SHA-256 **f88da8dc8253a8e36a284d48b8f6871ee2e9527270b1fe275f94108797e0883d**.
- Indexed PNGs (literal material-ID pixel indices with stable presentation PLTE): **overview.png** is the entire 2048×1024 grid, with **six authentic unscaled 1:1 district crops**. Author verifies PNG signature, chunk CRC, stored zlib Adler32, IEND and every material pixel against the actual final grid; file/pixel SHA-256 and crop rectangles are enumerated in `qualification.json`. These are *not* native screenshots or image-generation art.

## Admission, review and remaining risk

This is **AUTHOR STATIC-PASS**, not independent source-static Art/Technical/Shepherd acceptance. Native loading, installed `CyberDemoBridge` capacity handshake, Midge/Rapier steering/contact, time-advanced physics, persistence and cold-process save/reopen are **NATIVE-UNTESTED**. Accepted source advertises **32,768** rectangle stamps, but older *installed* bridges may expose only **4,096**; check `workbench_start_rectangle_capacity()` on the actual binary before making any native admission claim. Do not re-encode a weaker map under an unverified legacy limit.

Review the committed Setup, builder and six material-cell district images at the **exact PR HEAD**. Independent Art should focus on credible five-district production relationships, useful exposed inspection station, scale, playable entry/return and non-repetitive frame silhouettes; independent Technical should reproduce the byte grid and hashes, inert-solid descriptor classes, canonical rectangle replay, exact-site BFS, obstruction bypass and PNG parity; Shepherd should check distinctness and quality of routes/negative space. Hold in Draft; **do not merge, mark Ready, enable auto-merge or claim owner acceptance**.
