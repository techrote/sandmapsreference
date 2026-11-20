# Graven Keel — Ship-Tipper Crossdock (R3)

**Wholly original 2048×1024 CyberSand material-ID world · horizontal side elevation, no source image · R3 STATIC-CREATOR-PASS / NATIVE-UNTESTED · DRAFT/HOLD.**

Accepted CyberSand source (READ ONLY): `de109d0131641d6adc8d25bb9ced7ca3d4991105`. sandmapsreference parent: `99a166e7fcae45eb22be1740e9f33f62faccbcc7`. Material descriptor Git blob `dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3`; Setup-v2 loader blob `70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9`. Seed `152731237`. 4×3 authored Midge model hash `c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96`.

## R3 owner-authored material repair — 20 November 2026

Independent R2 [Art P1](https://github.com/techrote/sandmapsreference/pull/45#issuecomment-7035483181) identified two remaining bounded **real-cell functional transactions**. R3 repairs their physical geometry: (1) the western hold/berth jaws engage a **loaded founded roller-transfer frame** and the inclined tipper heel, and (2) the crossdock now contains a genuinely connected **upper trolley, lower load/receiving deck, side-entry control room and independently founded guide**. The cargo access route was deliberately re-excavated where the stable guide would otherwise isolate the exact Crossdock cargo bay. This is not a new art brief and no existing destination was moved.

**Exact R2→R3 cell comparison:** 20,696 actual material-ID cells changed (14,826 additions, 753 excavations, 5,117 rematerialisations). 6,572 disjoint legal rectangles, 119,608 Setup-v2 JSON bytes, 589,992 grounded stable cells, **zero detached**, **22/22** literal sites at 19×15, 23×19 and 31×27, and the same obstruction detour **241 → 263**. Entire grid re-encoded/replayed; **7/7** genuine indexed-material PNG parity checks PASS. See `r3-change-proof.json`.

**Gates:** Creator source-static pass only. New-head independent Art, Technical and Shepherd receipts required. Legacy installed bridge capacity may be 4096, below this 6572 rectangle map. Godot/Rapier collision, flight, sustained simulation and cold save/reopen remain **NATIVE-UNTESTED**. Draft/HOLD; not owner accepted.

| Genuine district crop | Changed material cells |
|---|---:|
| 01-tidal-berth | 991 |
| 02-tipped-hull | 6,805 |
| 03-crossdock | 9,930 |
| 04-rail-sorter | 0 |
| 05-customs | 0 |
| 06-underworks | 2,362 |

## Location and freight logistics

**Graven Keel** is a salt-dried industrial shipbreaking port with a functioning load chain. A western customs tally berth receives modular freight from a grounded old freighter. Its usable hold and ledgers connect to an **inclined rotary salvage cradle**, shown in one *fixed tipped position*, where the vessel's angled working deck and bearer struts transfer modules into an overhead **crossdock hoist**. A forked two-grade shunting apron deposits sorted containers at the eastern stepped customs/completion warehouse. The highline's three large open crowned gates create a second high-altitude inspection route, while five fitted underworks service chambers form an underground recovery chain. Machinery is static physical geometry; no animated operation is claimed.

**Districts and visual hierarchy.** (1) Tidal berth x112–477: stern/keel, asymmetric pilot house, cutaway cargo modules, tally workroom, crane hook. (2) Hull tipper x490–920: inclined hull with ribbed pivot bearing, diagonal service deck and founded dual-leg jack, high gantry, salvage aperture. (3) Crossdock x921–1381: long asymmetric A-frame and underslung hoist, entered two-storey pick bay with side-access crane maintenance. (4) Sorting apron x1370–1700: forked raised tracks, diverging transfer incline, wagon cradles and staffed switch. (5) Eastern consolidation x1700–2048: broken sawtooth roof, side-entered assay, outbound tram. (6) Underworks y785–999: pumps, jack hydraulics, valve wheel, relay and tram traction, all founded.

**Route graph** (the following are *exact*, not nearest-site surrogates):

- Freight chain: West tidal ingress → Keel ledger room → Hull tipper intake → Cradle operator bay → Slipway transfer throat → Crossdock pick station → Forked rail switch → East dispatch loading → Outbound overlook
- High inspection bypass: Tipper upper gantry → South truss inspection → Crane bridge crown
- Lower recovery: West bilge recover → Tipper hydraulic service → Midspan valve room → Rail relay rescue → East tram recovery

| Exact named Midge functional site | X | Y |
|---|---:|---:|
| West tidal ingress | 125 | 425 |
| Keel ledger room | 315 | 476 |
| Dry berth interior | 338 | 695 |
| Hull tipper intake | 568 | 425 |
| Tipper upper gantry | 718 | 174 |
| Cradle operator bay | 833 | 478 |
| Tipper keel gallery | 783 | 659 |
| Slipway transfer throat | 960 | 425 |
| South truss inspection | 1120 | 180 |
| Crossdock pick station | 1109 | 475 |
| Crane bridge crown | 1322 | 196 |
| Crossdock cargo bay | 1318 | 594 |
| Forked rail switch | 1478 | 425 |
| Classification underside | 1550 | 671 |
| East dispatch loading | 1783 | 422 |
| Terminal assay bay | 1825 | 609 |
| Outbound overlook | 1953 | 429 |
| West bilge recover | 258 | 839 |
| Tipper hydraulic service | 693 | 844 |
| Midspan valve room | 1119 | 843 |
| Rail relay rescue | 1506 | 841 |
| East tram recovery | 1845 | 840 |

Midge spawn: **West tidal ingress** at `(125,425)`. Every exact site remains four-neighbour reachable from this spawn using a *fully in-bounds* conservative 19×15, 23×19 and 31×27 empty-material envelope. A *physical* additional 58-material rectangular obstruction at `[169,363,75,111]` increases the west-berth approach from **241 to 263 cardinal centre steps** with the 31×27 hull while all exact destinations remain reachable. This proves static collision-free connectivity, not piloted flight performance.

## Full material-cell receipt

| Measure | Exact generated value |
|---|---:|
| Cell grid | 2048 × 1024 = 2,097,152 |
| Source generator seed | 152731237 |
| Material IDs | 0 Empty; 58 ReinforcedConcrete; 62 SteelPlate; 100 BasaltColumns |
| Per-ID accepted physics | 58/62/100 immovable Solid, RuleKernel::None |
| Final material histogram | 0:1521233, 58:236752, 62:189942, 100:149225 |
| Final occupied stable cells | 575919 |
| Grounded solids / detached | 575919 / 0 |
| Unsupported intermediate candidates removed (not in final map) | 39267 |
| Disjoint canonical rectangles | 6314 / 32,768 source capacity |
| Setup-v2 JSON UTF-8 bytes | 114980 / 1,048,576 |
| Rectangle paint work | 575919 / 32,000,000 |
| Exact 19×15 / 23×19 / 31×27 destination reachability | 22/22 / 22/22 / 22/22 |
| Obstruction route length | 241 → 263 |
| Full-grid material-ID SHA-256 | `7d3de7bb24abcf022723617e4764cf4c54a6ab570cf9d3554a07c155d4df856c` |
| Serialized Setup-v2 SHA-256 | `4c6491b58b32efe47203cda2a5b89b29576680102beb0d3708a449d157f3d7f1` |
| PNG CRC/zlib/Adler/full pixel parity | 7/7 PASS |

The serializer row-run/vertical-coalesces the **actual final material-ID plane**, producing disjoint ordered five-field rectangles. It then *exhaustively replays* every edit and compares all 2,097,152 cells. Candidate decoration without a supported load path is removed before final serialization; retained final material is entirely grounded inert solid. This provenance does not turn site clearance into a native Workbench test.

True full 2048×1024 material PNG: [overview.png](overview.png). Real unscaled 1:1 physical crops: [tidal berth](01-tidal-berth.png), [tilted hull](02-tipped-hull.png), [crossdock](03-crossdock.png), [sorter](04-rail-sorter.png), [east customs](05-customs.png), [underworks](06-underworks.png). These are indexed-material PNGs with one physical source cell per pixel, no AI art or photographic references. Exact PNG dimensions, integrity and decoded source-cell parity are checked in builder.

## Reproduce and admission cautions

Run `node build.cjs` (Node 22) to regenerate `setup-graven-keel.json`, `receipt.json` and all seven authentic PNGs. Run `node build.cjs --verify` for a deterministic in-memory rebuild and byte-equality test against all nine committed outputs. This algorithm shares **only serialization/PNG/static-verification helper techniques** with earlier Industrial Transit lane work; landscape geography, site topology, vessels and machinery were freshly authored.

**Legacy bridge risk:** accepted CyberSand source advertises **32,768** records, but an installed CyberDemoBridge without `workbench_start_rectangle_capacity` may fall back to **4,096**, **2218 fewer** than this map requires. Do not truncate or silently reshape the map. Verify installed binary/engine IDs and capability, then genuinely test Setup-v2 import, Midge movement/collisions, sustained simulation and a cold save/reopen. They have **not** been performed here: **NATIVE-UNTESTED**.

Requires independent Art, Technical and Shepherd exact-HEAD inspection, then owner acceptance. Remains **OPEN DRAFT/HOLD**; never merge, Ready or auto-merge on this receipt.
