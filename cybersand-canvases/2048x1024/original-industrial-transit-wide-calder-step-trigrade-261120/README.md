# Calder Step — Tri-Grade Ship-to-Rail Incline

**ORIGINAL, NOT SOURCE-LED · 2048×1024 landscape · true flat orthographic side elevation · Draft/HOLD · NATIVE-UNTESTED.** Fixed seed `0xCA1D320`; engine authority read-only `de109d0131641d6adc8d25bb9ced7ca3d4991105`; repository parent `99a166e7fcae45eb22be1740e9f33f62faccbcc7`.

## Place and physical operations

A weather-beaten coastal freighter is dismantled into standardized cargo blocks at the western slip. Unequal steel jacklift towers recover blocks from the hull, raising them to a **three-tier stepped freight-incline** on the ravine's inland side. A massive offset counterpoise winding house controls the grade change; a level-wagon traverser reconnects the cargo stream to an unusually tall eastern consolidation/assay station. Beneath the entire freight geography is a five-station repair/recovery system in excavated basalt. This is a NEW authored 2D material-cell location. The rails, hoist, winch and loading events are **static** geometry, not animated machinery.

The original silhouette was authored before detailed cells. No source reference image, prior-map rectangle set, scenic render or traced geometry was used. Basic serialization/verification helper techniques are adapted from the Industrial Transit lane's earlier deterministic tooling; **all major physical geography and sites are new**.

### Six functional districts

1. **Ship slip & tally (x105–510)**: single off-centre pilot cabin, cutaway hold, grounded repair stocks, two clamp blocks, entered toll/manifest booth, side-on transfer yoke.
2. **Dual-leg jacklift (x475–794)**: distinct guide-leg offsets, A-frame load path and sheave, rising freight cage, approached controls, crown inspection and two-way side-entry.
3. **Tri-grade rail (x745–1300)**: three *different*, positively supported incline levels with diagonal trestles, a wagon at each level, grade instrumentation, and two wide staggered cargo/Midge transfer gaps cut through the upper and mid rails.
4. **Counterpoise tower (x1284–1510)**: tall asymmetric load-bearing winding wheel, grounded tie rod, moving-weight representation, lower entered inspection bay.
5. **Traverse & outbound plant (x1500–2048)**: transverse wagon rails and maintenance shop, stepped consolidator roofline, scale/inspection bay and outbound trolley.
6. **Five-station lower service network (y790–988)**: bilge reciprocator, lift gearbox, ridge draining winch, grade switch maintenance, outbound wheeled recovery. Five broad independent shafts provide transfer between grades. Large founded portal piers divide the low horizontal gallery: connected alternative routes can require ascent through a shaft and return, not an uninterrupted straight floor-level flight.

## Midge navigation and topology

**Exact start:** West slip ingress `(111,415)`. **Primary:** West slip ingress → Quay tally loft → Jackyard cargo handoff → First incline switch → Second inclined handoff → Middle grade-control → Traverse rolling cradle → Consolidation outer yard → East dispatch beacon.

**Upper inspection alternative:** Lift crown inspection → West flight summit → Skyline return gap → Counterweight crown. **Low recovery alternatives:** Slip basin pump → Lift gearbox lower → Ridge drainage winch → Traverse switch service → Outbound recovery; if a founded pier blocks direct passage, use an explicitly open shaft and upper transfer corridor. These are connected free-centre components, not scripted Midge flight.

All destinations are tested at their **exact authored centres**, with fully-in-bounds **19×15, 23×19 and 31×27** conservative empty hull envelopes and 4-neighbour BFS from the exact spawn. The same results are checked after insertion of an actual solid obstruction `[169,363,75,111]`, from West slip ingress to Quay tally loft, increasing the shortest 31×27 route from 209 to 341 centre-steps.

| Named functional destination | X | Y |
|---|---:|---:|
| West slip ingress | 111 | 415 |
| Quay tally loft | 317 | 418 |
| Serviced hull interior | 330 | 676 |
| Jackyard cargo handoff | 624 | 414 |
| Lift crown inspection | 628 | 126 |
| West flight summit | 815 | 146 |
| First incline switch | 806 | 405 |
| Second inclined handoff | 1050 | 381 |
| Skyline return gap | 1075 | 166 |
| Middle grade-control | 1236 | 467 |
| Counterweight crown | 1385 | 166 |
| Counterweight repair bay | 1411 | 452 |
| Traverse rolling cradle | 1540 | 438 |
| Consolidation outer yard | 1710 | 435 |
| Warehouse freight assay | 1790 | 614 |
| East dispatch beacon | 1920 | 408 |
| Slip basin pump | 258 | 833 |
| Lift gearbox lower | 681 | 833 |
| Ridge drainage winch | 1100 | 833 |
| Traverse switch service | 1485 | 833 |
| Outbound recovery | 1860 | 833 |

## Source-exact physical qualification

| Check | Final builder result |
|---|---:|
| Actual material plane | 2048×1024 = **2,097,152 cells** |
| Material IDs | 0 Empty, 58 ReinforcedConcrete, 62 SteelPlate, 100 BasaltColumns |
| Accepted per-ID law | 58/62/100 = Solid, immovable, RuleKernel::None |
| Occupied solid cells | **517495 / 517495 grounded** |
| Full material-ID histogram | 0=1579657; 58=269200; 62=125396; 100=122899 |
| Disjoint ordered Setup-v2 rectangles | **4669 / 32768** |
| Setup-v2 JSON bytes | **85356 / 1048576** |
| Painted rectangle work | **517495 / 32000000** |
| Full-grid rectangle replay | **Exact cell parity, zero overlaps** |
| Detached final solids | **0** |
| Pruned unsupported authored candidates | **23477 (not present in final cells)** |
| Exact 19×15 / 23×19 / 31×27 named destinations | **21/21, 21/21, 21/21** |
| Physically obstructed alternative | **21/21, 209 → 341 steps** |
| PNG integrity and source-grid pixel parity | **7/7**, one full 2048×1024 and six true 1:1 crops |
| Material-plane SHA-256 | `83e8bfe9cc2b0ae91cc296f9515e0e26d12e7482bb499c2cf9349d8a95ccc70e` |
| Setup JSON SHA-256 | `4f63a89bc2093e7496564a4eee2aefc29800d3dcd5569da7dd184874c42a6f3d` |
| Native Workbench / installed bridge / Rapier / save and reopen | **NATIVE-UNTESTED** |

The full-grid PNG and each unscaled crop are indexed 2-bit material PNGs whose palette corresponds to the exact final material plane (0 Empty, 1 BasaltColumns/100, 2 ReinforcedConcrete/58, 3 SteelPlate/62). The builder checks stored-zlib chunk CRC, Adler, IEND, and every decoded material pixel against the 2,097,152-cell final plane. The canonical ordered rectangle algorithm merges matching row runs vertically, disallows overlapping paints and exhaustively replays them back to the exact grid.

## Run / audit

`node build.cjs` deterministically regenerates `setup-calder-step.json`, `receipt.json`, `overview.png` and the six district PNGs. `node build.cjs --verify` independently regenerates in memory and **byte-compares all 9 committed artifacts** without writing them. No third-party dependencies; Node 22 recommended. Reviewers should independently parse `setup-calder-step.json` and reconstruct the 2,097,152-cell material plane, recompute grid/JSON SHA-256 and actual Midge envelope BFS, then check all PNG bytes, not simply trust the receipt. Genuine native execution has not occurred.

**Installed bridge warning:** accepted source declares 32768 rectangle capacity, but installed legacy CyberDemoBridge missing `workbench_start_rectangle_capacity` may return a Workbench fallback of **4096**, 573 fewer than this world requires. Do NOT silently truncate records or degrade the physical map to satisfy an unverified binary. Measure exact installed bridge/engine hashes and capabilities, import/start as authored, steer the Midge through real collisions and steps, then save and reopen in a fresh process. Until these tests happen: **NATIVE-UNTESTED**, not playable-runtime PASS.

No merge, Ready promotion, auto-merge or owner acceptance authorised.
