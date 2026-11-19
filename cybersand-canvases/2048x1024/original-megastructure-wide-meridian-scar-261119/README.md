# The Meridian Scar — Severed Clockwork Concourse

**ORIGINAL-NO-REFERENCE · MEGASTRUCTURE-WIDE · 2048 × 1024 · Draft/HOLD only · NATIVE-UNTESTED**

## Creative thesis

A continent-spanning clockwork commuter superstructure was broken by a catastrophic shear along the Meridian. An upper suspension way carries magnetic transit cars over a gaping fault-eye; beneath it public arcades, electromagnetic manufacturing, a chronometric tribunal, and a quarantine frontier continue operating. Their inhabitants maintain three distinct cross-country flight altitudes rather than one forced rail tunnel. This is an original side-elevation CyberSand terrain level, not a sourced painting, reference conversion, background image, or mock-up.

A single huge amber dial acts as map centre; asymmetric catenary trusses and capsule cabins bound the upper void. The western city is small-grain retail and freight servicing, the central loom has heavy industrial bracing, the split-plate Meridian is deliberately open, the Oracle civic nave has monumental sloping gables, and the eastern isolation locks have reinforced shield petals. Black negative space between loaded strata is *traversable Midge airspace*.

## Five differentiated districts and gameplay

1. **Ferryman Arcade** (x 72–437): uneven cliff-anchored shop lanterns, public ingress, old market and western return subway. Checkpoint **West ferryman ingress (114,478)**.
2. **Electromagnetic Loom** (x 448–866): factory shells, hollow magnetic windings, retained loom works, elevated cabin and lower machine undercroft. Targets **Electromagnetic forge (588,468)**, **Loom overhead cabin (658,307)** and **Loom undercroft (664,747)**.
3. **Meridian Fault-Eye** (x 866–1236): severed rock jaws, luminous dial, fracture crossing, null bypass and deep pull-down rail. Targets **Meridian zero chamber (1058,289)**, **Fault-eye crossing (1024,475)**, **Null bypass (1036,742)**.
4. **Oracle Tribunal** (x 1210–1650): sloping civic vault, data chambers, marble public entries, archive and transfer columns. Targets **Oracle chronometric nave (1434,313)**, **Oracle public tribunal (1444,480)**, **Oracle machine archive (1464,742)**.
5. **Quarantine Terminus** (x 1635–2048): split shield petals, customs and heat-lock structures, beacon and isolation return. Targets **East quarantine intake (1747,481)**, **Quarantine shield crown (1822,313)**, **Isolation return (1806,749)**, **Beacon of twelve hours (1952,480)**.

All sixteen exact named functional site centres are recorded in `receipt.json`. No site may be moved to an easier nearby cell for qualification.

**Midge goal:** begin at Ferryman ingress, reach the protected Beacon by way of an upper scenic inspection, a mid-altitude mechanical exchange, or the parallel lower maintenance bypass; recover to the lower line when the Meridian mid-crossing is sealed.

**Route graph:** interconnected upper route y≈310, freight/civic route y≈480, and lower heat-return route y≈745. Vertical ventilation/maintenance transitions at x≈243, 652, 1040, 1453, and 1816; routes intentionally reconverge. The independent blockage probe fills x975..1108/y440..544, excludes only the now-occupied Fault-eye site and verifies **15/15** remaining exact sites at every conservative envelope via the other routes.

## Authentic committed artifacts

- `build.cjs`: fixed seed `2493209`, cell-grid authoring, integer raster geometry, structural attachment and pruning, nonoverlapping lossless run/rectangle optimisation, exact replay, conservative integral-image eroded BFS, indexed PNG writer, and complete Node verifier.
- `setup-meridian-scar.json`: **actual Workbench Setup-v2** terrain material state, not arbitrary scene JSON.
- `overview.png`: 2048×1024 **real material cells** with exact native catalogue RGB indices.
- `01-arcade-ingress.png`, `02-electromagnetic-loom.png`, `03-meridian-fault-eye.png`, `04-oracle-tribunal.png`, `05-quarantine-terminus.png`: five 1:1 native-cell evidence crops.
- `receipt.json`: immutable source identities, full material histogram, site coordinates, game-scale clearance, capacity checks, SHA-256 and Git blob digests, independent PNG checks and test limitations.

Regenerate using **Node 22+**: `node build.cjs --verify`. Builder writes its outputs into the same folder and throws on failed replay, ID, shape, clearance, PNG decompression/CRC or pixel-parity assertions. It contains no source-image input or AI generation.

## Engine/schema and physical contract

Accepted **CyberSand main `de109d0131641d6adc8d25bb9ced7ca3d4991105`**, `workbench_setup.gd` blob `70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9`, native `material.hpp` blob `dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3`, authored Midge file blob `228399e38a0e0ab215b9f48698edce67a7a35799`. This source accepts 2048×1024 (sides 512..2048, 64-cell multiples). Midge authored hull **4×3**, optional conservative operational rectangles **19×15, 23×19 and 31×27**. Real game scale: corridors are usually tens of cells high, hundreds long, intentionally wide for high-speed flight; props/freight bodies and architectural hulls are authored at proportionate pixel-world scale.

All nonempty selected IDs are **static, hard, non-movable solid** in the accepted native descriptor table. In particular, #100 BasaltColumns and #101 Obsidian are native stable blocks; **#13 Stone is a falling powder and deliberately excluded**. No Water/Acid/Lava/Fire/combustible reaction chains, biological growth, or movable decorative powder is staged. Steel, glass, stone, shell, cable, neon and brass are rendered from their authentic per-ID material cells, not colored pixels painted onto a backdrop.

## Static evidence and limits

| Admission or proof | Current result |
|---|---:|
| Extent/material plane | **2048×1024 / 2,097,152** exact cells |
| Setup JSON | **229368 / 1,048,576 bytes** |
| Nonoverlapping native rectangles / edits | **12384 / 32,768** |
| Nonempty authored cell-work | **895176** |
| Full-cell replay/equivalence | **2,097,152 / 2,097,152** |
| 19×15 exact Midge sites | **16/16** |
| 23×19 exact Midge sites | **16/16** |
| 31×27 exact Midge sites | **16/16** |
| Mid-corridor disabled (other sites) | **15/15** at each envelope |
| Solid structural continuity | **895176 connected rooted cells; zero ungrounded** after trimming 239 tiny fragments |
| PNG signatures/CRC/zlib/Adler/index parity | **6/6 PASS**, independently inflated and checked |

Full material grid SHA-256: `e5efc0f27f5cf36e4e8616e81a0f1eb90ac788ea689de98f7c7aa4eeb70b0fad`. Setup SHA-256: `1f4b14793426c4210e7bf7f5c75644a5f9b834f02056785fca36e0660d0f7f88`.

**IMPORTANT — NATIVE-UNTESTED:** source `MAX_RUNS=32768` is not proof of installed `CyberDemoBridge.workbench_start_rectangle_capacity`. If runtime lacks the method or DLL is old the fallback is **4,096** and this map must refuse rather than silently omit geometry. Actual native Workbench install, Rapier actor thrust/collision, bounded progression, renderer fidelity, installed bridge capacity and save/reopen are *not tested*. No owner acceptance claimed.

## Owner / independent-review acceptance

1. Confirm a Windows/Godot build whose installed `CyberDemoBridge` rectangle capacity is ≥ 12384, and which matches the intended accepted source.
2. Place the JSON in `user://workbench/setup-meridian-scar.json` and load it from Workbench saved setups using the name `meridian-scar`; alternatively use a compatible supported Setup-v2 import flow. Do **not** import it as a generated-start packet.
3. Verify exact world size, all material IDs, the physical Midge spawn, and distinct upper, middle and lower route recovery. Examine the eye/clock, Loom factory rooms, Oracle nave and isolation lock at normal zoom.
4. Exercise thrust/input, real collision, bounded simulation and native save/reopen. Capture exact executable/source hashes and findings.
5. Independent art/technical/Shepherd reviewers decide rework or qualification. Keep the PR **DRAFT / HOLD**; never merge or mark Ready by automation.

The actual cell overview and crops are the only visual evidence for this PR. No historical artwork or third-party source references were used.

## R3 independent-review P1 functional repair (19 November 2026)

Same original map revised after the independent [Shepherd](https://github.com/techrote/sandmapsreference/pull/24#issuecomment-6999971951) and [art auditor](https://github.com/techrote/sandmapsreference/pull/24#issuecomment-7000458935) identified empty schematic halls. The committed **actual cell grid** differs at **129890 positions** from the original PR head; no new PR and no reference inputs. Repairs are reproducibly encoded in the committed fixed-seed `build.cjs`.

- **Ferryman Arcade:** ticketing booth, unequal freight-exchange weighbridge, maintenance stilt and legible thresholds in separate arrival/service spaces.
- **Electromagnetic Loom:** supported feed, induction coil, overhead transfer, inspection workbench and lower machine-service modules with differentiated equipment heights.
- **Meridian Fault-Eye:** two anchored diagnostics/perimeter stations and lower measurement supports; a bounded east-side relief preserves the conservative blocked-core bypass rather than closing the clock void.
- **Oracle Tribunal:** integrated public dais, archive/service side galleries and lower record stacks, different from the factory modules.
- **Quarantine Terminus:** staged sample intake, shield baffles, scanner desk, and release-coil equipment rather than repeating market pods.

**Final R3 static proof:** exactly **2048×1024**; **12384** nonoverlapping native rectangles under source 32,768; **229368** Setup-v2 UTF-8 bytes under 1 MiB; **895176** occupied cells. Material-plane SHA-256 `e5efc0f27f5cf36e4e8616e81a0f1eb90ac788ea689de98f7c7aa4eeb70b0fad`, setup SHA-256 `1f4b14793426c4210e7bf7f5c75644a5f9b834f02056785fca36e0660d0f7f88`; exhaustive 2,097,152-cell reconstruction identical. All **16/16** fixed sites pass exact 19×15, 23×19, and 31×27 conservative legal-centre BFS. After physically sealing x975..1108/y440..544, **15/15** other sites remain reachable in all three envelopes. Residual detached solid components were removed by the builder. All six indexed PNGs were constructed directly from the checked grid and passed PNG signature/chunk CRC/IEND verification. Bytewise decompression and independent pixel-parity decoding of the regenerated PNGs must still be repeated by auditors; the builder's Node validation checks these, but standalone Node was not run in this environment.

**Native remains NATIVE-UNTESTED.** Installed bridge may still cap at 4096 vs 12384 rectangles, despite accepted source 32768. No Godot/Rapier install, native inputs/collision, sustained ticks or fresh-process save/reopen. Open Draft/HOLD awaiting fresh independent exact-HEAD Art/Technical/Shepherd results; owner acceptance not claimed. Do not merge or mark Ready.
