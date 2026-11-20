# Saltglass Scatterforge — original industrial foundry, 2048x1024

**Draft/HOLD design corpus**, original perpendicular side-elevation. Neither native acceptance nor an engine implementation.

## Structural thesis / deliberately varied axes

Five separated production islets perched at **different altitudes**, crossing an exposed industrial gorge in a descending-rising-descending process cascade. This reverses the typical flat-strip workbench layout. Distinct axes: **island macro topology** (instead of a continuous factory), **sawtooth altitude grammar**, **high-sky and lower trestle route branching**, **asymmetric load-bearing dual piers**, and **deliberately unfinished human-editable cavities**. No reference-art conversion or copied earlier map geometry.

## Physical process and game route

**West lip spawn [116,251]** to ore weighbridge/hoist, enclosed thermal retort, overhead ladle transfer, three unequal radial caster wheels, ceramic descending transfer, initially sealed water quench, and freight apron ending at literal **East slip goal [1952,670]**. All 21 literal named checkpoints are in `receipt.json` with free-centre connectivity at 19x15, 23x19 and 31x27 Midge collision-clearance envelopes, with zero centre reassignments. This verifies **static geometric routes**, not piloted flight.

The eastgoing direct 31x27 free-centre shortest path has **2343 cardinal steps**. Inserting a real 56x130 solid obstruction at **XYWH [750,185,56,130]** produces an independently recomputed **2415-step** path (+72) while all 21 literal checkpoints remain reachable. The high-altitude bypass is an alternative to the interrupted main traversal. The obstruction is diagnostic only; it is **not** part of the authored Setup.

Do not confuse incomplete lower maintenance cavities with qualified access routes. They are intentionally reserved for later human editing, procedural grammar learning and potential scripted events, and are not named spawn/checkpoint targets. A 50-cell caster inspection opening offers an additional future connection point. No event is scripted.

## Reproducible material-cell and constructor proof

Run `node build.cjs` from this map folder, or `node build.cjs --verify` to regenerate and verify the exact committed Setup JSON, receipt, indexed-material overview and six unscaled true 1:1 crops.

- Engine source authority: `techrote/cybersand main@de58bf1997ca75825cf3b29e046dc1c1022c45bf` (read-only). Midge authoring file reports a 4x3 hull, and static tests use more conservative 19x15, 23x19 and 31x27 envelopes.
- Art source baseline: `techrote/sandmapsreference main@99a166e7fcae45eb22be1740e9f33f62faccbcc7`.
- Exact final material plane: **2,097,152 bytes/cells**; SHA256 `6772bc4c0eeb149f6a9e878f7310c05be1523e4598b15b2235555a8efef7e51a`.
- Lossless nonoverlapping ordered rectangle replay: **2380** records, 568662 material writes, 45236 Setup JSON bytes; full Setup SHA256 `6184355631b3e40fb0ed3c77875a735afbc58ce6a0eb474e29cd5c09ee991533`.
- Boundary rooted inert structure: 566370/566370 cells, detached 0. Before final commit the builder replaces 24 disconnected engineered-component segments with **539** rooted connecting pipe cells, maximum bridge length 64. These connectors are part of the final Setup plane and PNGs.
- Initial sealed liquid: 1972 water and 320 lava cells, 0 exposed fluid-air faces, 0 Water/Lava contacts. Dynamic evolution not simulated.
- All 7 8-bit indexed-material PNGs pass CRC/Adler/IEND and source material-ID pixel parity; full view is an honest **2048x1024 1-cell-per-pixel** image, with six unscaled district crops.
- Accepted 32,768-rectangle source capacity is not approached. No hypothetical old installer limit is used to constrain the design.

## Draft/HOLD evidence gates

Creator reproducibility checks are not independent review. Request exact-HEAD Art, Technical and Shepherd qualification. **NATIVE-UNTESTED:** No compatible installed Workbench/CyberDemoBridge/Godot/Rapier executable was loaded; live collisions, controls, fluids, progression and fresh-process save/reopen remain unmeasured. CI status is not implied by source-static proof.

## Event / editing affordances

The central diagonal trestle can support a bridge-loss scene; unequal caster drums can host machinery activation; the initially sealed quench pool can host a future deliberately authored release; the freight dock can host arrival/departure. The vacant central seam and unfurnished lower service chambers are intentional editable canvas, not unfinished-P1 cleanup targets. See `exemplar.json` for machine-readable, factual corpus annotations.
