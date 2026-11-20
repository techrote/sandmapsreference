# Calyx Severance Yard — ORIGINAL Sci-Fi Biomechanical Wide

> 19 November 2026 · 2048×1024 ACTUAL MATERIAL CELLS · DRAFT/HOLD · author static qualification only · **NATIVE-UNTESTED**

## Concept and side-elevation thesis

An alien living-ship dismantling plant built into a dry excavated extraterrestrial seam. It is a **working severance yard**, not a natural biome, source-image conversion or scenic illustration. The silhouette is a *split descending ship-keel*: an upper ribbed dissection jaw suspended from a roof-rooted catenary, opposed by an upward-growing ventral salvage splint fixed to the regolith. Their separated tips leave an unusually wide traversable central void with an accessible, physically supported specimen workface.

All structures are genuine material-cell collision geometry in perpendicular **flat 2D side elevation**. The geometry uses ordinary Midge scale: the smallest auditable full-body conservative envelope is 19×15; the hardest is 31×27 cells. Flight aisles are substantially wider. There are no isometric roofs or false walkable scenery.

## Districts and engineering hierarchy

1. **Quarantine Sluice / Decontamination Gate** (x=52–459). An asymmetric two-vessel isolation block, with steel jambs, rooted bulkheads, inspection consoles, dry sluice and a purposely cut broad carrier doorway.
2. **Ciliary Graft Gantry** (x=460–820). Four differently lowered cultivation pods hung from a substantial roof truss, with sloping preparation arms, load-bearing access and a high service gallery.
3. **Splayed Ship-Keel Crucible** (x=775–1395). Instead of a decorative ring, two deliberately separated, jagged roof/floor-rooted skeletal jaws define three-dimensional *meaning through 2D geometry*: upper clean flight over the dissection jaw, midline specimen transit, lower salvage return beneath the ventral splint. The dry assay workface is at x≈1109, y≈724, and the primary navigation mouth at x≈1077, y≈480.
4. **Differential Fractionation Towers** (x=1414–1801). Three unequal, stable glass-lined process towers and cross-transfer pipework, physically opened into a shared horizontal maintenance aisle while retained roof and foundation roots keep their remaining solids anchored.
5. **Dry Export and Cable Recovery** (x=1801–2048). A swinging transfer skeleton, tapered salvage cart on a permanently supported rail and the eastern recovery exit, with safe space to recover from a missed approach.

The whole playable field deliberately contrasts packed engineering clusters with negative-space flight volumes. No liquids, living agents, plants, expanding powders, reactor fire or unstable foundations are initially spawned; illuminated detailing is made from inert solid material IDs.

## Route graph, explicit exact points

- **SPAWN** `spawn_decontamination_gate` at (123,554)
- **SITE** `west_quarantine_readout` at (244,556)
- **SITE** `graft_loom_assay` at (604,466)
- **SITE** `upper_splint` at (1092,164)
- **SITE** `ship_keel_mouth` at (1077,480)
- **SITE** `ventral_exam_workface` at (1109,724)
- **SITE** `east_fractionation_entry` at (1407,471)
- **SITE** `fractionation_valves` at (1643,574)
- **SITE** `recovery_cableway` at (1807,617)
- **EXIT** `export_service_exit` at (1942,649)

The intended main objective is **quarantine entry → midlevel graft assay → severance jaw inspection → fractionation control → export recovery**, with recoverable return access from each room. The high alternative runs above the central jaw at a centre height ≤391; the low alternative runs below the ventral splint at centre height ≥663. Both link the exact West (650,550) and East (1430,477) gates. They were checked using a *real inserted midflight obstruction* of 192×159 cells at (992,415) at the conservative 31×27 envelope, without shifting any checkpoint to a nearest legal centre. Every named site admits all four immediate cardinal centre approaches at the largest envelope. See `qualification.json` for all three full BFS receipts and the independent detour bands.

## Physics, geometry and reproduction

- Accepted read-only CyberSand authority: `de109d0131641d6adc8d25bb9ced7ca3d4991105`. Workbench Setup-v2 parser `70dd964b...`; material laws `dcf05895...`; native bridge header `fced1a3f...`.
- Fixed seed: `19112661`. `design.json` now has **568 authored ordered geometry operations** (R2 appends 96); `build.js` deterministically reconstructs the **2,097,152-cell** map, rejects unsupported disconnected stroke remnants before the final grid, run-merges the exact grid into **8287 ordered nonoverlapping rectangle edits**, writes `setup-calyx-severance-yard.json`, and regenerates full-resolution PNG and district crops.
- Grounded cells **612,130 / 612,130**, detached final **0**. An intermediate draft contained 21,931 disconnected fragments following door surgery; these were explicitly **removed from the final committed plane**, not used as hidden supports. This is an honest source-grid condition, not a physics-simulation pass.
- Rectangle limit 32,768, used **8287**; Setup JSON exactly **154146 bytes**, 1,048,576-byte ceiling; construction material cells **612,130**, beneath source work ceiling 32 million. Exact ordered replay has **zero mismatches/overlaps**.
- Grid SHA256: `18cfbe5fca6eae8bb780722f053be77ab15fcae66b454c2a5b4f64578d99db58`; Setup JSON SHA256: `98f88be9c13ab60bc06ed1ebb27c3f546ab92555e5e0839fd8fd180003e08951`.
- Accepted used material IDs: 58, 62, 63, 72, 77, 79, 100, 101, 113, 117, 120, 128, 130. All were verified from `native/include/cybersand/material.hpp` as `Solid`, `movable=false`, `RuleKernel::None`. No unknown IDs.
- Exact grid PNG is **indexed colour** with index value equal to actual material ID. Six **actual 1:1 cell-resolution** district crops and the overview all have verified PNG signature, IHDR, indexed PLTE, IDAT zlib stored blocks, per-chunk CRCs, IEND and full source-index parity. The simple display palette is illustrative; this is **not a native gameplay screenshot**.
- Regenerate with `node build.js design.json ./out`. The Node builder regenerates the setup and all seven material-cell PNGs, checks their exact pixel parity, independently tests replay, grounding, named sites, restricted routes and the 21,931 intentionally rejected prefinal unsupported cells. It compares source-grid, setup and all seven PNG hashes against the committed canonical `qualification.json`, then writes `./out/qualification-rebuilt.json` without overwriting that authoritative receipt. The build fails rather than presenting a false static pass if a check differs.


## R2 — actual grounded industrial servicing repair, 20 November 2026

Addressed [independent Shepherd P1](https://github.com/techrote/sandmapsreference/pull/28#issuecomment-7025440305) in the source material plane, not just the descriptive text. The **quarantine exchange** now has two vessel outlet devices, an entered dry decontamination transfer table at x=213–315/y=589–690 with keyed controls and physical side supports. The **graft gantry** has a cantilevered specimen-handling/assay bench at x=487–589/y=475–513, plus a distinct receiving jaw at x=671–717/y=484–514 and two actual suspended assay probes. The **ventral jaw exam point** (1109,724) is framed by opposed capture actuators, a specimen-feed cradle and explicit lower take-away trays at x≈994–1251/y≈739–817; the site itself retains its fully open conservative Midge envelope. The **three unequal fractionation towers** now have asymmetrically positioned valve readouts/transfer tables, connecting into an **export operator deck** at x≈1872–1965/y≈669–711 and a lower transfer grip.

Compared with author R1, R2 changes **28,630** exact final material-cell values, adds **23,722** grounded occupied cells, has **4,908** rematerialisations, **zero excavations**, preserves all ten exact original waypoints, both restricted high/low 31×27 routes, and both high/low constrained routes under a real 192×159 inserted solid obstruction. The deterministic builder now has **568** authored drawing operations; before structural rejection **21,931** disconnected draft cells are discarded from final grid, **zero** disconnected final structural cells. Rebuilt **8,287** nonoverlapping exact Setup-v2 edits, **154,146** Setup JSON bytes, grid SHA256 `18cfbe5fca6eae8bb780722f053be77ab15fcae66b454c2a5b4f64578d99db58`, Setup SHA256 `98f88be9c13ab60bc06ed1ebb27c3f546ab92555e5e0839fd8fd180003e08951`. Seven genuine indexed-material PNGs and per-pixel parity are regenerated from this exact final grid. The accepted source contract is unchanged; installed owner bridge and real Godot/Midge/Rapier progression/save/reopen remain **NATIVE-UNTESTED**. Independent new-HEAD Art/Technical/Shepherd review is **PENDING**, not a creator-granted PASS.

## Native gate and honest status

**NATIVE-UNTESTED.** Source supports up to 32,768 rectangular edits, but Godot's `native_rectangle_budget()` falls back to 4,096 if no new compatible GDExtension instance is installed. This map uses 8287; verify the actual installed bridge `workbench_start_rectangle_capacity() ≥ 8287`, followed by actual Workbench Setup import, Midge hull collision and input, Rapier stepping, save, close, reopen and retained progression. The current source GitHub CI-built bridge may support 32,768; that does not certify the owner's installed binary. No native claim or owner acceptance is implied.

**Preserve Draft/HOLD.** Independent Art, Technical and Shepherd exact-HEAD review required, with actual gameplay qualification as a separate downstream gate.
