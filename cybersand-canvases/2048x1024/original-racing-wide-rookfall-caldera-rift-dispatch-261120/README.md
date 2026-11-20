# Rookfall Caldera Rift Dispatch — original 2048×1024 CyberSand material-cell landscape

> **DRAFT/HOLD · creator SOURCE-STATIC VERIFIED · NATIVE-UNTESTED.** This is a separate human-editable corpus exemplar, not a source-image conversion, owner acceptance, native flying proof or merge request.

## Structural thesis

A *dry impact caldera* rather than another enclosed freight corridor: a small west rim dispatch, a sloping cableway into the basin, discontinuous bridge caissons held by a distinct high suspension tie, a sparse buried service plant and a tall east-side freight catcher. The upper gap is a deliberate, actionable failure landmark, while the lower caldera and entered chambers are real material-cell voids. Geometry is strictly orthographic perpendicular 2D; no isometric platform tops. Sparse open volume is a deliberate authoring affordance for future SWARM/GENTEK examples, hand-finished scenery and separately scripted event stages.

## Production and reproducibility

- Run `node build.cjs` to regenerate `setup-rookfall-caldera.json`, `qualification.json`, `overview.png` and six actual indexed-material crops. The constant design seed is `0x26112011`. The material source is an **exact 2048×1024 / 2,097,152-cell** byte grid. All inert solids have an explicit 4-neighbour path to the outer bedrock boundary; disconnected decorative construction candidates are culled before delivery.
- Run `python verify.py` for **independent-from-builder** ordered JSON replay, nonoverlap/bounds, histogram and SHA-256, full-body literal 4-neighbour reachability at **19×15, 23×19, 31×27**, actual obstruction, rooted solids and indexed PNG decoded pixel equality. Requires NumPy, SciPy and Pillow.
- Run `python local_route_audit.py` for bounded 31×27 route-leg proof, including the blocked-gap alternative. The exact primary and alternative named waypoint sequences appear in `local-route-qualification.json`. All site coordinates are literals in `verify.py`; there is no shifted, rounded, radius-exempt or closest-free fallback.
- `exemplar.json` is **corpus annotation**, not a CyberSand engine contract. No event is scripted. The full raw material plane and crops are encoded from the same final cells. Source engine `techrote/cybersand/main` SHA and reference repository parent SHA are pinned in `qualification.json`.

## Districts, flight and staging

1. **Western dispatch rim** — spawn `(165,300)` and return finish `(170,355)`, deliberate stacked/partly cleared workrooms and an accessible west vault; checkpoint cues are static side-view construction only.
2. **Cableway descent** — distinct sloping supports and a west shaft/below-cable recovery throat, with a holdout staging site around `(480,465)`; the descending route differs from the high bridge route.
3. **High fracture bridge** — split left/right caissons, surviving upper tension arch, a traversable physical gap centered near `(1030,352)` and a lower underbridge alternative.
4. **Crater basin works** — excavated floor, dry sparse machine supports, reached underfloor cavities and intentional empty space for subsequent human or script authoring.
5. **Eastern cargo catcher** — asymmetric tall freight loading claw, exposed arrestor and east lower-to-upper return; a relatively compact loaded zone balancing the open crater.

**Main route:** west start → west sky → west fracture lip → fracture crossing → underbridge descent → east catcher → lower basin westward → west launch gate → finish. **Alternative:** descend through the cableway worksite and use the lower bowl. The actual `[997,328,70,86]` solid bridge-gap closure removes the fracture checkpoint but leaves **27/28** literal named destinations and every alternative leg and the finish reachable for all three tested envelopes. At 31×27, 14/14 main, 8/8 alternative and 8/8 blocked-alternative legs pass a conservative **100-cell bounding margin**. This is *not* a native flight-speed, actor dynamics or timed-lap test.

## Hard gates and limits

Current accepted engine authority: `techrote/cybersand/main@de58bf1997ca75825cf3b29e046dc1c1022c45bf`. Current map parent: `techrote/sandmapsreference/main@99a166e7fcae45eb22be1740e9f33f62faccbcc7`. Current source contract permits up to **32,768 rectangles**, **1,048,576 JSON bytes**, and true 2048-wide Workbench generated starts; this candidate remains under those bounds. The specific **installed** Windows bridge, actual Rapier Midge response, actor advancement, sustained flight and save/reopen were **not executed**: **NATIVE-UNTESTED**. No claim about race feel, handling, lap timing or independent reviewer acceptance is made. All prior Draft/HOLD map branches are untouched.
