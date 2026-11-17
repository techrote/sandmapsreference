# Containment Tree — Amber Canopy Biosphere

**Draft / HOLD.** No merge, auto-merge or Ready promotion without owner acceptance.

## Reference and design intent

- Public artwork ID: `techn-0021`, source key `batch1/image-0058`
- Original: [amber_canopy_biosphere — containment_tree](https://github.com/techrote/sandmapsreference/blob/main/artwork/technical_interiors/batch1/amber_canopy_biosphere-containment_tree-biological_dread.png)
- Original Git blob: `b8075c08c4a3cea84a877b036537dea55c87264f`
- Original SHA-256 from source-map: `e4413f50496dfca2b41d141c272779d6d7fc956588d45e741dc08f0b0263f93f`
- Original source image dimensions: **unverified**; the connector rejects PNG binary bytes.
- Target: exact 1024×2048 CyberSand Workbench Setup-v2. This is a re-composed and authored material terrain, not a bitmap import.
- Composition: a bioindustrial vertical abyss with two divergent research walls, an enormous amber containment crown, a branching copper/verdigris artificial tree, luminous root/spore networks, irregular rock relief, research galleries and upper/lower service crossings. Emphasis is on true front-facing 2D rather than isometric pseudo-architecture.

**Source visual comparison is NOT QUALIFIED:** we inspected the generated PNG repeatedly, corrected excessive repeated ring relief into four morphological types and added differentiated biological strata. The original `techn-0021` image bytes could not be fetched by the available GitHub connector (binary UTF-8 decode error). Therefore we do **not** claim verified resemblance or correct original dimensions. Compare the [original](https://github.com/techrote/sandmapsreference/blob/main/artwork/technical_interiors/batch1/amber_canopy_biosphere-containment_tree-biological_dread.png) with the committed material-cell PNG before quality acceptance.

## Playable layout

- Spawn `Midge` at (369, 95) in the upper main shaft, boost 1.5×. Current source Midge definition hash `c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96`; physical installed registry hash requires confirmation.
- 6 left research rooms: Crown Lab, Spore Bank, Microscope, Resin Well, Root Vault, Seed Bank.
- 5 right stations: Canopy Eye, Biocore 02, Isolation, Lumen Grid, Return Pump.
- Other required destinations: Crown Atrium, Upper Anastomosis, Middle Vascular, Lower Lumen, Root Return and Deep Exit.
- Two continuous vertical free-flight lanes around the sculptural central tree, five cut-through crossings, eleven asymmetrical lateral entrances, no unused decorative one-cell passage certification.
- Every named location has a **deliberate exact interior-doorway inspection airspace**. The tester never substitutes a nearby reachable pixel for a blocked declared destination.
- Structural body and decoration exclusively use current native Material enum solid IDs: 39, 40, 42, 49, 50, 52, 53, 54, 58, 62, 65, 77, 78, 79, 80, 100, 101, 119, 120, 121, 122, 123, 127. No loose powder, Water, Fire or spreading Plant is seeded.

## Deliverables

- `setup-containment-tree.json`: actual Setup-v2 canvas / selected actor.
- `containment-tree-preview.png`: direct 512×1024 palette-derived downsample of the authored 1024×2048 material cells.
- `containment-tree-detail-upper.png` and `containment-tree-detail-lower.png`: actual 640×640 native-resolution cell crops (upper crown and lower network).
- `builder.cjs`: deterministic, seeded authoring implementation including exact-site clearance BFS, material-ID whitelist, exhaustive reconstruction and PNG generation.
- `rebuild.cjs`: dependency-free build/verification runner for Node.js 20+.
- `evidence.json`: exact waypoints, material counts and qualification limitations.

## Offline qualification — CyberSand current accepted `main` at `018bd09503d7f079ddac52e225c2f7daf8d678bf`

| Gate | Result |
|---|---|
| World extent | **1024×2048** |
| Rectangle edits | **27428 / 32,768** |
| Setup JSON size | **503158 / 1,048,576 bytes** |
| Entire cell plane reconstructed | **2097152 cells, 0 mismatches** |
| Conservative Midge envelope | **19×15** cells (actual Midge hull smaller); all non-air blocks assumed solid |
| Connected clearance centres | **649,989** |
| Exact named destinations | **17/17** connected at the actual declared coordinates |
| Used material IDs | **0, 39, 40, 42, 49, 50, 52, 53, 54, 58, 62, 65, 77, 78, 79, 80, 100, 101, 119, 120, 121, 122, 123, 127** |
| Native Workbench / Rapier | **NOT EXECUTED** (runtime unavailable here) |
| Original-image side-by-side | **NOT EXECUTED** (binary source unavailable here) |

The accepted Workbench `godot/scripts/workbench_setup.gd` admits 512–2048 per axis and 32,768 edited rectangles, subject to the installed native bridge's reported capacity; older native builds may support only 4,096. Source enum validity does not replace a real `CyberDemoBridge.inspect_interaction` or actor-hash test.

## Rebuild and owner acceptance

Run `node rebuild.cjs --verify` to independently regenerate and byte-compare five committed artifacts; `node rebuild.cjs` rewrites those artifacts. No npm packages required. Then use the current CyberSand Workbench saved setup import/load path to load the JSON, confirm the exact 1024×2048 canvas, fly Midge through the seventeen named sites, simulate, save and reopen; compare material terrain and test native collision and runtime material admission. Do not label the PR Ready until both side-by-side reference evaluation and native Windows owner acceptance are satisfied.
