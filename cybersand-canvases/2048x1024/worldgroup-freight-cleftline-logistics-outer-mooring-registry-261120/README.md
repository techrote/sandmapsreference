# Cleftline Logistics — Outer Mooring Registry and Ballast Exchange

**NEW original freight-world sibling · 2048×1024 material-cell side elevation · Draft/HOLD · creator source-static PASS · independent review PENDING · NATIVE-UNTESTED.**

**World family:** Cleftline Logistics. **Role:** landward/quayside arrival, inspection, ballast exchange and dispatch; intended first sibling to the Peregrine Cleft / Halcyon Ark drydock design language, *not* a continuation of that map's hull/cleft geometry. **Primary inspiration donor:** [Peregrine Cleft PR #33](https://github.com/techrote/sandmapsreference/pull/33), exact qualified R8 source `0e872ce0987be7e6df047152beac470ba362c7c5`. **Secondary machinery vocabulary:** [Graven Keel PR #45](https://github.com/techrote/sandmapsreference/pull/45), reviewed live current head `7ce39e6eb6d701b515bd4f6b1ccea551bf467a2f`. No donor pixels, shapes, rect stream or route graph were copied; reproducible helpers (Setup/PNG/static replay machinery) adapt a prior original-lane generator.

## Place and scale

Outer Mooring Registry is a lengthy, low civic-industrial berth beyond the ark salvage rift. Its operational transaction is **mooring manifest → staffed quay customs → two-level cargo/weigh inspection → paired reservoir ballast exchange → separator and pressure ledger → freight classifier → outbound rail**. Instead of floating ships, huge diagonal tipping hulls or a deep enclosed canyon, the new silhouette uses an open port lattice, four distinct elevated watch/control cabins, two 80-cell-high grounded ring-cisterns, an entered low weighgate, split outbound lanes, basalt retaining shoulders and a continuous subterranean maintenance/recovery region. The full upper half is actual open flyable space, not perspective scenery; structural supports are actual material cells.

Distinct functions:
1. **West tidal mooring and salt ledger** (x145–450): shore hooks, berth rails, lifeboat quay, manifesto control and backed cargo cradles.
2. **Quayside customs / weighgate** (x480–900): an entered double-bay customs mezzanine, inspection rack, counterweight hoist, raised audit controller and a service pit.
3. **Ballast transfer** (x900–1390): terraced basin, two founded cylindrical cistern envelopes, valve/rotor control, separate upper tide-monitor office and lower separator culvert.
4. **Classification / eastern dispatch** (x1415–1970): weighed cargo staging, diverging carrier transfer, signal mezzanine, stepped receipt office, outward rail head.
5. **Rooted underdeck engineering** (y710–990): separate pumps, hydraulic exchange/repair, vessel ballast diagnostics and a traversable lower recovery network.

These are stationary terrain depictions of operational machinery, **not claims of physically animated freight mechanisms**. Four port watch platforms have actual Midge-size side portals and load-bearing ties; the two ballast cistern rings are connected to the founded quayside.

## Functional routes (exact coordinates; no nearest substitute)

- **Main cargo itinerary:** Mooring arrivals → Quay manifest office → Customs tally desk → Weighgate inspection → Ballast master valve → Remote pump keeper → Freight lane sorter → Outbound railway → East sail dispatch.
- **Aerial audit path:** West mooring control → Raised audit bridge → Tide monitor cupola → Signal mezzanine; entered skybridge and port control cabins open laterally to the external sky.
- **Lower fallback:** West service return → Weigh pit return → Ballast subfloor gallery → Hydraulic separator → East service return. Interleaved shafts, explicit 31×27 truss gates and an independent leftmost dock-to-service rescue shaft prevent blind cul-de-sacs.

| Literal named functional Midge centre | x | y |
|---|---:|---:|
| Mooring arrivals | 114 | 501 |
| Quay manifest office | 291 | 508 |
| West mooring control | 342 | 266 |
| Salt basin dock | 377 | 636 |
| Customs tally desk | 551 | 505 |
| Weighgate inspection | 721 | 508 |
| Raised audit bridge | 755 | 255 |
| Weigh cradle service | 671 | 633 |
| Ballast master valve | 907 | 502 |
| Transfer cistern | 1118 | 635 |
| Remote pump keeper | 1156 | 506 |
| Tide monitor cupola | 1315 | 255 |
| Hydraulic separator | 1372 | 772 |
| Ballast subfloor gallery | 1006 | 774 |
| Freight lane sorter | 1532 | 505 |
| Signal mezzanine | 1588 | 260 |
| Outbound railway | 1779 | 505 |
| East sail dispatch | 1914 | 505 |
| West service return | 252 | 772 |
| Weigh pit return | 660 | 773 |
| Pump recovery | 1121 | 774 |
| East service return | 1824 | 772 |
| Emergency lifeboat quay | 146 | 655 |
| Cargo reconciliation | 1701 | 636 |

**Spawn:** Mooring arrivals **(114,501)**. All **24/24** exact sites pass fully in-bounds four-neighbour free-centre connectivity from that spawn under **19×15, 23×19, and 31×27** full-occupancy footprints. The builder also places a *real temporary 58-material obstruction* at XYWH **[178,459,66,94]** across the direct west berth approach. At 31×27 all 24 sites remain reachable; literal approach distance **184 → 296** cardinal centre steps, demonstrating alternate routing, not merely an abstract route sketch.

## Verifiable actual-cell source and artifacts

| Check | Creator-executed evidence |
|---|---:|
| Exact material plane | 2,097,152 / 2,097,152 cells |
| Valid stable occupied material IDs | 58, 62, 100; empty=0 |
| Final grounded / occupied | 611,876 / 611,876 |
| Unsupported intermediate decoration removed | 52,524 actual cells |
| Detached occupied solids retained | 0 |
| Disjoint canonical Setup-v2 rectangles | 3001 / 32,768 |
| Setup-v2 JSON bytes | 56,766 / 1,048,576 |
| Rectangle paint work | 611,876 / 32,000,000 |
| Exact destination coverage | 24/24 at all 3 Midge envelopes |
| Real obstacle recovery | 24/24, 184 → 296 |
| Final grid SHA-256 | `26542449b04309ef60a6947d82670f48b8d8ff82f7cacf3f24fcccc7316c2c21` |
| Canonical Setup SHA-256 | `44bb61ab6778f0b0804eaa94f26e8a37dbc411d51417ea55be424921bc6e735c` |
| PNG integrity & material-cell pixel parity | 6/6, including full 2,097,152-pixel indexed overview |

[Complete actual-material overview (one cell per PNG pixel)](overview.png)

True unscaled 1:1 district crops, all derived from exactly the same final material plane:

- [01-tally-quay.png](01-tally-quay.png) — exact 360×333 source-cell crop (x144, y424)
- [02-customs-weighgate.png](02-customs-weighgate.png) — exact 421×490 source-cell crop (x479, y228)
- [03-ballast-exchange.png](03-ballast-exchange.png) — exact 488×330 source-cell crop (x900, y420)
- [04-classifier-dispatch.png](04-classifier-dispatch.png) — exact 555×495 source-cell crop (x1415, y223)
- [05-service-culverts.png](05-service-culverts.png) — exact 1600×240 source-cell crop (x190, y710)

The committed `build.cjs` regenerates the complete `setup.json`, `receipt.json` and six PNGs with no third-party packages. **Run** `node build.cjs --verify` in this folder to reconstruct all outputs, verify disjoint replay, full material grid SHA, structurally grounded cells, fully contained Midge footprints, physical alternate-route obstruction, PNG chunk CRC/zlib/Adler validity and full decoded material-pixel equality, then compare each generated artifact with committed bytes. Run `node build.cjs` to regenerate.

## Authority, qualification, and ownership

- sandmapsreference fresh default **main** base at authorship: `99a166e7fcae45eb22be1740e9f33f62faccbcc7`.
- CyberSand accepted read-only **main**: `7b03aa437561ec63e31fd09531171360ab60eeb4`. Exact Setup loader blob `70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9`, material descriptor blob `dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3`. Authored Midge model hash `c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96`.
- Source declares 32,768 Workbench edits; this level uses only 3001, also below the historical 4,096 fallback count, but installed bridge compatibility and native admission remain **unmeasured**.
- No Godot Workbench/CyberDemoBridge/Rapier import, thrust/collision/play session, performance, save or cold reopen has been run here. **NATIVE-UNTESTED.**
- Creator-only source-static PASS; independent source-matched **Art, Technical and Shepherd exact-HEAD reviews are pending**. In particular Art should examine whether freight transaction, Midge-scale entered workfaces, topologically useful recovery and industrial detail remain convincing at 1:1.
- Own branch and folder only. Both inspiration donor PRs and CyberSand accepted source remain unchanged. Draft/HOLD; no merge, Ready, auto-merge, or claim of owner acceptance.
