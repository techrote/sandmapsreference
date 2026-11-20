# Sable-12 — deterministic creator static qualification

**CREATOR SOURCE-STATIC PASS; NATIVE-UNTESTED; OPEN DRAFT/HOLD.** This is not an independent reviewer verdict.

## Exact identity

- 2048×1024; seed `2026112012`
- Engine read-only `de58bf1997ca75825cf3b29e046dc1c1022c45bf`; map default-base `99a166e7fcae45eb22be1740e9f33f62faccbcc7`
- Full grid SHA-256: `e2b6a16be93dbbd5ebdbec1568356c69b15d5b3ee7fd820192376596aee75674`
- Serialized Setup JSON SHA-256: `fc5278e3fe25de4e4e320b91f4237fd76ee861588e32b52b406f428524a51968`
- Final cells: 2,097,152; rectangles **3446** / source 32,768, below unverified legacy installed 4,096; bytes **65572** / 1,048,576; paint work **522097**
- Structural inert cell grounding **510381/510381** (detached **0**)
- Fluid IDs 3 and 8: **7954 / 3762** time-zero sealed, with no air faces, world-boundary contacts or mutually reactive 4-neighbour contacts.
- Actor: accepted `midge` hull 4×3; source-rounded-up hull envelopes **19×15**, **23×19**, **31×27**, all **16/16 exact destinations** clear and reachable by full in-bounds free-centre 4-neighbour BFS; no nearest sites / no special thresholds.
- Found accessible free centres: 19×15 **1056387**, 23×19 **1009753**, 31×27 **919488**.
- Actual physical blockage region `[980,50,60,365]` tested at 31×27; 16/16 sites retained; **10** routes made strictly longer, with local return intact.
- Lossless rectangle ordered replay, boundedness and overlap: exact entire-grid comparison, zero mismatches and zero overlaps.
- Seven source-derived indexed PNGs, CRC/DEFLATE/Adler and full material-pixel parity checked by a separate implementation against all **3,746,802 pixels** of the full overview plus six exact 1:1 crops; all zero mismatches. This is generated-asset validation, with committed blob reread still to be verified.
- Native installed bridge capacity, game load, actor movement/collision, fluid time evolution, save/reopen and GPU display: **not executed (NATIVE-UNTESTED)**.

## Full histogram

| Material ID | Final cells |
|---|---:|
| 0 | 1,575,055 |
| 3 | 7,954 |
| 8 | 3,762 |
| 58 | 140,948 |
| 62 | 112,103 |
| 68 | 14,481 |
| 70 | 19,657 |
| 76 | 921 |
| 77 | 1,755 |
| 79 | 846 |
| 100 | 72,524 |
| 101 | 77,824 |
| 104 | 21,694 |
| 117 | 46,440 |
| 120 | 1,188 |

## Exact site obstruction receipt, 31×27 full hull

| Literal named destination | Baseline free-centre steps | After physical obstacle | Forced extra |
|---|---:|---:|---:|
| West service-bay spawn | 0 | 0 | 0 |
| Capture control transfer | 969 | 969 | 0 |
| Intake recovery hatch | 1163 | 1163 | 0 |
| Absorber upper intake | 1106 | 1106 | 0 |
| Tri-fork inspection berth | 1589 | 1589 | 0 |
| Scrubber sump return | 1748 | 1748 | 0 |
| Cold-cassette skylight | 1664 | 1916 | +252 |
| Cryogenic sampling access | 2081 | 2333 | +252 |
| Dry isotope return bay | 2204 | 2456 | +252 |
| Membrane canopy survey | 2053 | 2305 | +252 |
| Pressure-relief inspection | 2352 | 2604 | +252 |
| Depressurisation lower loop | 2581 | 2833 | +252 |
| Collector crown survey | 2359 | 2577 | +218 |
| Fraction metrology workface | 2761 | 2979 | +218 |
| East rescue catchment | 2985 | 3203 | +218 |
| Safety extraction hatch | 2644 | 2862 | +218 |

## Indexed PNG receipts

| Exact source-derived PNG | x, y, width, height | SHA-256 |
|---|---|---|
| [overview.png](overview.png) | 0, 0, 2048, 1024 | d1372421f7c841ecb8c05b14326d63a2da279e2fefc860f5743a55b6fb912def |
| [01-capture-yard.png](01-capture-yard.png) | 32, 192, 387, 700 | 36698e60aafe7c7af9d3e8bc45c531c050f291677fe3b0e7c8df7b298f3a99bc |
| [02-trifork-absorbers.png](02-trifork-absorbers.png) | 420, 157, 391, 735 | 7f28323787377c52a0f11dc13b43df2b9ed6bdfc623d05f7a106017602c5c8c0 |
| [03-cryo-cassettes.png](03-cryo-cassettes.png) | 808, 163, 454, 727 | 610b0f401445e2eacbe4fa1c62c6486fbc890413ca855e4e38f46884e1dcd310 |
| [04-membrane-viaduct.png](04-membrane-viaduct.png) | 1256, 171, 409, 724 | 28c36a9218fcc0d2b3275430acbb5a0c3d66a0421c6910c569f7d7109a06dc3e |
| [05-fraction-collectors.png](05-fraction-collectors.png) | 1657, 91, 389, 806 | f65b72ab44b8b09bfcafff8e682f56f2333a276504a1474b57fffe4173745e52 |
| [06-dry-culvert.png](06-dry-culvert.png) | 800, 760, 811, 187 | c4e2a4fecc20f3f2eb43995085a77bd44496ca263994038be18f6658c8f3b770 |

## Qualification boundary

Reviewers must recheck Art, Technical and Shepherd evidence at the **actual PR HEAD**. The source accepts 32,768 records but older installed bridges can still be limited to 4,096. This map is below both nominal thresholds; actual host bridge admission is nonetheless untested. Static material containment is a **time-zero** property, not a physics-evolution or processing-simulation claim. Remain Draft/HOLD.
