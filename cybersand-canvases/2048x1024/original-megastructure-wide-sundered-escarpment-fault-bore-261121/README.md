# The Sundered Escarpment — Fault-Bore Nested City

An independently designed, actual **2048×1024** CyberSand material-ID side elevation for the original/megastructure-wide design corpus. **Draft/HOLD · creator STATIC-PASS · NATIVE-UNTESTED · independent Art/Technical/Shepherd pending.** No source images, old-source conversions, copied previous-map cells, AI map artwork, scripts, engine writes or implied owner acceptance.

## Thesis and meaningful distinction

The megastructure is **cliff-embedded rather than a skyline object**: three irregular deep service excavations lie under an occupied west–east cavern chain, with diagonal opposing fault masses, rock-rooted hanging teeth, roof-bolted work areas, and one genuine daylight breach. This is a subtractive/nested-cavity architecture useful to example-derived GENTEK/SWARM grammars; deliberately vacant alcoves and expansion seams are retained for later owner editing and set-piece placement. There are no perspectival or isometric surfaces.

The five distinguishable districts are **Throat Customs** (west stepped arrival and cargo weighing), **Torsion Mill** (off-axis winch, split pistons, induction gantry), **Fault Lift Exchange** (two counterweighted, canyon-bolted cage wings), **Archive/Cooling Terrace** (white three-part civic processing and cartridge storage), and **Eastern Reclaimer** (security dock, crane and salvager workshops). Three lower service niches provide separate future winch operation, diagnostic equipment and salvage-encounter bays. Distinct massive hanging rock teeth and naturally enclosed structural roofs keep the centre void intentionally useful for flight and human editing.

## Midge site graph (exact XY material-cell centres)

**Goal:** enter at `Western daylight dock` (144,477), fly through `Customs flight deck` (272,484) → `Torsion mill balancing floor` (672,563) → `Central fault lift datum` (1011,558) → `Archive register console` (1410,634) → `East departures court` (1831,469) → `Exit daylight gantry` (1920,474). The rest of the names in `receipt.json` are exact-checkpoint/access sites, not proxies.

The **upper braided exit** passes `West upper permit booth` (338,327), `Grinding gallery overpass` (731,315), `Central fault high lookout` (1038,290), and `Archive upper collector` (1422,330), with real carved transfers to the primary galleries. The **low salvage/recovery route** runs from `West lower slip` (310,806), through `Torsion mill escape shaft` (785,809), `Central lower chain room` (1084,811), and `East low sump refuge` (1574,807). Site reachability is tested at literal XY and all three in-bounds conservative hulls. No nearest-site relocation or radius exemptions.

`physical_obstruction_xywh=[966,530,134,111]` fills **actual final material cells** in a duplicate plane, closing the central lift site, while all remaining 17 stations stay reachable under 19×15, 23×19 and 31×27 clearance. Sub-bore side pockets and the open central fissure are additional future edit/set-piece affordances, not pre-scripted triggers.

## Material law / Setup-v2

World is exactly 2,097,152 row-major *real* final material bytes. `build.py` is fixed-seed (`0xD3E5521`), deterministic and fully reproducible; the seed controls a small set of roof witness plates. All retained painted IDs were checked against `techrote/cybersand` accepted `native/include/cybersand/material.hpp`: defined, nonmovable `Solid` and `RuleKernel::None`. No sand, liquid, gas, plant, combustible or mobile/reactive foundations. Any disconnected generated solid is removed *before* final setup encoding, and the exact number of removed cells is recorded; all committed cells are fully perimeter-grounded. Final run/vertical-coalescing rectangles are disjoint and ordered, fully replayed to the source plane with no erasures. No simulation-side geometry changes are claimed.

| Contract | Actual result |
|---|---:|
| Grid | 2048×1024, exactly 2,097,152 cells |
| Setup-v2 limit | 32,768 rectangles, 1,048,576 JSON bytes, 32 million work cells |
| Rectangles | See `receipt.json`, independently verified |
| Actors | One accepted Midge, auth hash in setup, spawn (144,477) |
| Material and PNG parity | Full-grid row-major SHA-256, complete material histogram and six independently decoded indexed-material PNGs |

Current read-only accepted engine authority at authoring: `techrote/cybersand@f7e056c9b8791106e22f2d1c295043783d8a9701`, parser blob `70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9`, materials blob `dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3`; `sandmapsreference` base `99a166e7fcae45eb22be1740e9f33f62faccbcc7`. The accepted host-claims rectangle limit is **32,768**; no authoring restriction based on obsolete 4,096-third-party binary fallback.

## Authentic gallery and independent check

`overview.png` is the **full 2048×1024 palette-indexed material-cell plane** (index = actual native material ID). `01-throat-customs.png`, `02-torsion-mill.png`, `03-fault-lift.png`, `04-cooling-archive.png`, `05-reclaimer-terminal.png` are **1:1 material-ID** rectangular crops; bounds are committed in `receipt.json`, no scaling or AI rendering. PNG palettes encode accepted native RGB (dark glass alpha is presentation-only; material index remains authoritative). `independent_verify.py` parses committed setup from scratch, replays ordered nonoverlap, computes full-grid SHA, 4-neighbour supports and explicit 4-neighbour BFS at all three full footprints, obstructs the actual central patch, checks PNG signature/chunk CRC/decompression/full indexed pixel equality. Its run receipt is committed as `independent_verification.json`.

**Execution:** run `python build.py` for deterministic regeneration; `python independent_verify.py` for a separate source-based static check (requires Python 3 with Pillow, NumPy and SciPy). Existing outputs were recreated in the author environment, but **Godot / Workbench / CyberDemoBridge / Rapier import, collision, Midge movement/advancement and save/reopen are NATIVE-UNTESTED**, not a native PASS. Obtain independent Art, Technical and Shepherd exact-head qualification before any owner acceptance or Ready/merge action. Preserve this Draft/HOLD source unchanged except for evidence-supported P0 or exemplar-breaking P1.
