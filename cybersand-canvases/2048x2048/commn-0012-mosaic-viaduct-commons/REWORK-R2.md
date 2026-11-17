# Canvas rework R2 — COMMN-0012 Mosaic Viaduct Commons

**Draft / HOLD; branch only; do not merge, mark Ready or modify CyberSand engine or original artwork.**
Historical accepted-as-archive-only parent: [PR #8](https://github.com/techrote/sandmapsreference/pull/8), archived on main. This is a NEW artistic rework, not a replacement of the preserved historical snapshot.

## Visual authority (source INCLUDED in this PR)

![Exact catalogue-derived source JPEG](source-reference-preview.jpg)

- Original immutable PNG: [artwork/neighbourhoods_commons/batch2/mosaic_viaduct_commons.png](https://github.com/techrote/sandmapsreference/blob/198bf5bc793e59006b7ccc9e587971e3d9a857f9/artwork/neighbourhoods_commons/batch2/mosaic_viaduct_commons.png); Git blob `fb01ca96733623502e99e9734bf4fb7d5d28035e`.
- This committed `source-reference-preview.jpg` is an **actual repository gh-pages reference JPEG blob** (`8cf59bbba8c4a4037924490b7d158872be876abd`), copied without visual alteration; it is not a generated concept image. Preview is lower resolution than original PNG.
- Historical CyberSand output: [archived material-cell preview](preview.png); original source/preview and output are separate. Source dimensions and exact original-pixel parity must not be inferred from the JPEG.

## Priority repair brief — use actual source pixels, not catalogue prose

The source is a *horizontally distributed urban civic plaza*: asymmetric masonry/tiled left civic block, long stepped/public stair on the right, **dominant broad rooted tree at right-center**, orange shade sails, broad daylight sky, blue patterned glazed surfaces, planting and a **continuous buried tunnel underneath**. The historical conversion heavily substitutes repeated symmetrical arches + large mechanical circular roundel + black central void, losing the original spatial hierarchy.

1. **P0 macro composition**: restore stepped civic promenade/plaza and public stair as the dominant navigable feature. Place the right-side spreading tree with branches/canopy as primary landmark (model with stable CyberSand solids, not uncontrolled live growth); preserve the left asymmetrical tiled facade and accessible balcony. Subordinate/replace the giant central roundel and regular viaduct arches if they harm the reference.
2. **P0 orthographic geometry / routes**: preserve a continuous high-level promenade, clear primary and alternate Midge flight corridors, traversable terraced stair and rooftop/underpass transitions. Keep the long lower buried corridor legible and connected. No angled pseudo-isometric tops.
3. **P1 local architecture**: differentially sculpt blue-and-white tilework, glazed shopfront/library, colonnade, planters, under-stair retaining walls, functional street furnishing, and irregular upper balconies. Avoid cloned red brick blocks, equally spaced arch modules, evenly repeated circular greebles, clipped title signs.
4. **P1 colour/space**: reconcile source daylight/sky and warm terracotta vs blue glazed stone without inventing a backdrop that is not true authored terrain. Balance negative space; no vast unearned black gulf replacing civic space.
5. **P0 physics + evidence**: re-read CyberSand accepted main; use correct non-falling support and valid enum IDs, current Midge hull plus conservative operational margin, zero hidden waypoint proxying. Require exact target-airspace connectivity, original 2048×2048 extent and JSON/rectangle limits. Rebuild all cells independently and regenerate full-map PNG and >=3 native-cell district crops from the same authored grid.
6. **P0 integrity**: deterministic builder (fixed seed), real Setup-v2/generated-start, portable load instructions. If native Workbench/Rapier absent say NATIVE-UNTESTED; no fabricated run or save/reopen. Repair actual cells, not just this brief, before owner review.

## Handoff and role coordination

Initial PR commit only carries this rework brief and the embedded exact source preview. **The subsequent source-led actual-cell reconstruction has now been implemented; see this handoff.** The assigned Reworker C should implement and qualify subsequent commits *on this same PR branch*. Shepherd must review final HEAD, and owner acceptance controls merge.


## R2 source-led actual-cell repair — Reworker C, 17 November 2026

**Assigned starting HEAD** 42ea7c415f749fe595dd035b54610a575e23f93d. Genuine committed JPEG source blob 8cf59bbba8c4a4037924490b7d158872be876abd **visually inspected** beside the original R1 actual-cell overview and regenerated R2 native-cell gallery. The original full-resolution PNG is unchanged, and **full-resolution pixel parity is unverified**.

**Before → after:** giant unrelated mechanical roundel/six cloned viaduct arches/equivalent houses/large unsupported water pool → source-led left tiled asymmetric civic building with inhabited rooms and balcony, orange source sails, right-rising supported public stairs, enormous right-rooted multi-lobe tree/canopy, populated market platforms, and continuous lit dry underground civic artery. No artificial solid-coloured sky; empty flight space is native dark Empty.

**Two art+gameplay iterations actually tested:** initial reconstruction found an upper-room structural column snag; opened an intentional 150-cell-wide egress. A stair overlook also failed exact clearance; inserted a source-plausible 82-cell service stair air opening. Further detail added civic shops, tree twigs, conduits, stairs supports, material-cell furnishings, and underpass archive; the first iteration accidentally bridged the eastern vertical shaft with a copper conduit, cutting the exact East-underpass graph. The cross-shaft segment was removed and the complete grid rebuilt; 19×15 and 23×19 reachability returned to 16/16, with no moved or proxy coordinates.

**Exact static counts:** 2,287,869/4,194,304 changed cells from archived baseline; 7,608/32,768 rectangles, 150,270/1,048,576 JSON bytes, 1,268,041 final occupied cells, 2,926,263 air cells, original 43,916 Water cells removed. SHA-256 e813e22edb7da8752245bcebff5eb835670e4d4c580f73adbd7d3b8ec4ac052b. All materials validated as legal immovable solid IDs against current engine, no powder supports. One combustible foliage/wood family without startup ignition is retained as physical material rather than uncontrolled growth. Full 4,194,304-cell independent rectangle replay and same-grid indexed-PNG generation. Actual Midge hull 4×3, original unchanged spawn/hash and 16 original exact coordinates: 16/16 clear/connectable at strict 19×15 and 23×19; 31×27 extra stress: 15/16 (east underpass remains a larger-envelope limitation). No hidden nearest-point substitution.

**Direct image evidence**: [true-cell full PNG](preview.png), [overview](overview.png), [civic facade](detail-civic.png), [canopy](detail-gardens.png), [public steps](crop-stair-plaza.png), [underground corridor](crop-buried-corridor.png), with four more native-cell crops. All originals remain preserved.

**NATIVE-UNTESTED**, no source-matched physical Godot/Rapier Workbench runtime, actual collision/pilot/stream/save-reopen, or installed native bridge 32,768-capability readback. The 4,096 fallback is lower than 7,608. Independent Shepherd/source-fidelity review and owner native acceptance remain required. Draft/HOLD.

---

## Shepherd-assigned R2C finishing pass — 17 November 2026

Starting source HEAD: `362f86f0ea18b2e49ae8301a14c562310f87df1b`. This bounded follow-on responds to the genuine JPEG-source fidelity and technical reviews of the previous R2 commit. The earlier historical 'initial R2' statistics in REWORK-R2.md remain a record of the *previous* pass, not the final values here.

- **Stairs:** replaced thin periodically striped floating treads and sparse posts with uneven stone-mass risers, four differentiated public landings and a single stepped retaining spine. Existing air access is retained via a designed shaded civic opening, not by relocating a Midge destination.
- **Sails:** moved three real terracotta fabric roofs down over usable civic terraces and added hard-surface legible anchors. These are physical cells, not image overlays.
- **Tiles and rooms:** replaced large random-colour checker tiling with narrow ivory/cobalt floral bands, smaller differentiated glazing and occupied frontage. The exact Midge spawn remains open; an initial glass-window placement that trapped the spawn was rejected during iteration.
- **Tree:** replaced repeated ellipse/dot crown stamps with irregular overlapping polygon silhouettes attached to the original right-rooted trunk. No active plant growth, powder supports or ignition sources were introduced.
- **Buried corridor:** strengthened continuously identifiable masonry roof and gallery bays, with intentional large access shafts; a 31×27-compatible east maintenance chimney is true Empty air rather than a substituted waypoint.

**Final static receipts:** 2048×2048 = 4,194,304 material cells, 7,863 non-overlapping coalesced five-field rectangles (limit 32,768), 152,210 JSON bytes (limit 1,048,576), 1,289,475 occupied and 2,904,829 Empty, 369,139 material IDs changed from assigned HEAD, SHA-256 `fcdab739ad94aae88ceaf1fc565951ba8afa7533c13876f81990b892ca7a1318`. Independently reconstructed every JSON rectangle/cell against the new builder grid, zero mismatches. All 28 used non-Empty materials are valid non-movable accepted native solids; combustible ID(s) 97 remain unignited. Authored actor, exact spawn, 16 positional targets and native generator provenance are unchanged. Exact zero-offset four-neighbour rectangular actor-centre connectivity: 19×15 **16/16** (2,370,337 centres), 23×19 **16/16** (2,276,913), 31×27 **16/16** (2,132,661); no nearest-point waiver. Current loaded bridge capacity not interrogated: older fallback remains 4,096, which would reject 7863 rectangles. The output PNGs are real material-index PNGs rendered from the reconstructed grid, and the committed independent validator `node verify-r2.cjs` is provided for fresh local reproduction; it was not executed inside the GitHub connector environment. **NATIVE-UNTESTED** (Godot/GDExtension/Rapier admission, flight/collision/simulation, fresh-process save/reopen). Genuine committed JPEG is retained untouched; previous independent reviewers directly inspected it, while this execution could not decode the binary through the connector. Full original PNG pixel parity remains **UNVERIFIED**.
