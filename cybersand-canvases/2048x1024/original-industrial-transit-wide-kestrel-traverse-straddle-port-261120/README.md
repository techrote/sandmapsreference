# Kestrel Traverse — Saddle-Arch Intermodal Straddle Port

**Entirely original side-on 2D CyberSand material-cell world · 2048×1024 · seed 2026112004 · Draft/HOLD · NATIVE-UNTESTED.**

## Site identity and authored scale
Unlike Cinderwake's giant paired lift, Ternbreak's suspended gorge cableway and Silt Meridian's raised bascules/rotary sorter, this is a deeply excavated tidal logistics terminal defined by a single docked asymmetrical steamer, a 270-cell wide straddle-portal crane, a colossal *bowed double-chord freight saddle-arch*, an eastern switchback classifier and a multi-chamber service railway. From left to right the grounded, supported cargo story is **ship hold → dockside waybill and cranes → straddle cage → hanging underarch freight → split-yard wagon switch → customs/outbound**.

The space is designed at physical 1:1 material-cell scale, not a background photograph. Large high-air voids allow Midge to bypass transport congestion. Five shafts and an 81-cell high understructure railway provide recovery after mistakes; rooms, plates, wheels and working machinery are actual solid cells, not illustrations. Freight machinery is physically static, not animated.

Six visually and mechanically different districts:
1. **West drydock and singular vessel** (x108–531): continuous unequal bow/stern sheer and keel, high stern cabin, deck-sized hold, side-access manifest, four attached repair stocks.
2. **Straddle gantry transfer yard** (x506–865): two grounded legs, asymmetric A-frame motor room, transverse cargo trolley, twin sheaves, suspended box carriage and lower running rails.
3. **Saddle-arch industrial transporter** (x865–1500): monumentally curved double-chord truss, diagonal web, two deep rooted buttresses, load-carrying mid-deck, three hanging cargo stations and broad open flight space.
4. **Eastern switchback classifier** (x1470–1835): three distinctly sized wagons, divergent grade rails and a tall signal tower/interlocking cabin.
5. **Stepped customs dispatch** (x1790–2048): three-level roof silhouette, entered inspection room, scale and outgoing freight track.
6. **Service-gallery return** (y793–970): independently sized bilge, portal gear, underarch winch, switchgear and carriage-recovery chambers, accessible through real wide vertical shafts.

## Exact authored destinations (not inferred/shifted)
| Site | X | Y |
|---|---:|---:|
| Breakwater arrival | 120 | 440 |
| Ship service gangway | 310 | 570 |
| Quay waybill office | 452 | 465 |
| Drydock keel service | 320 | 835 |
| West sky lookout | 262 | 165 |
| Crane A-frame inspection | 689 | 171 |
| Straddle load receiver | 738 | 451 |
| Straddle underframe | 789 | 624 |
| Arch west approach | 968 | 455 |
| Underarch cargo sling | 1081 | 462 |
| Void shipping lane | 1220 | 441 |
| Arch east approach | 1457 | 455 |
| Switchback signalman | 1544 | 468 |
| Upper branch siding | 1640 | 389 |
| Sorter transfer stage | 1723 | 522 |
| East freight manifest | 1848 | 472 |
| Outbound customs | 1940 | 464 |
| Upper arch flyway | 1143 | 165 |
| East roof lookout | 1785 | 166 |
| Pump repair station | 272 | 850 |
| Portal motor chamber | 700 | 851 |
| Arch undercroft repair | 1180 | 852 |
| Switchgear repair | 1590 | 852 |
| Outbound recovery bay | 1880 | 850 |

**Main route:** Breakwater arrival → Quay waybill office → Straddle load receiver → Arch west approach → Void shipping lane → Arch east approach → Switchback signalman → East freight manifest → Outbound customs.

**Alternate aerial route:** West sky lookout → Crane A-frame inspection → Upper arch flyway → East roof lookout, using the broad overhead free-air.

**Recovery:** Drydock keel service → Pump repair station → Portal motor chamber → Arch undercroft repair → Switchgear repair → Outbound recovery bay. A real 83×103 solid obstacle at (207,390) reroutes arrival→waybill at 31×27 from 357 to 439 centre steps while preserving all 24 sites.

## Physical contract and reproducibility
- Accepted read-only engine: `techrote/cybersand/main@de109d0131641d6adc8d25bb9ced7ca3d4991105`; Setup-v2 loader blob `70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9`; material catalogue blob `dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3`; sandmapsreference base `99a166e7fcae45eb22be1740e9f33f62faccbcc7`.
- Material IDs 0 Empty, 100 BasaltColumns, 58 ReinforcedConcrete, 62 SteelPlate. All occupied IDs are **inert Solid/RuleKernel::None** per the accepted engine, with no sand/powders, fluid or reactive foundation. Boundary flood removes 26227 unsupported in-progress pixels; final grounded solids 526445/526445; detached **0**.
- `build.cjs`: deterministic fixed-seed complete-grid generator; executable with Node 22, no installed dependencies. `geometry-source.js`: separately recorded original design program used to build the self-contained generator.
- `setup-kestrel.json`: actual complete Setup-v2 world, 4612 disjoint canonical ordered rectangles, 85360 UTF-8 bytes, 526445 painted-work cells, all under accepted source 32,768/1,048,576/32,000,000 caps.
- Material-grid SHA-256: `06b3b07ff0e1829ba66f86937cf4319be51c966528b0f4c1802d54706b198a21`; Setup SHA-256: `06c27d98c591a45ad1d94e96acbe75b6286307281064e24a3b7e3ea40024d867`; exhaustive rectangle replay **zero mismatches**.
- All 24 exact destinations are individually fully in-bounds and 4-connected reachable at conservative [19×15], [23×19], [31×27] Midge envelopes, no radius waivers; physical-obstruction 31×27 detour retains 24/24.
- `receipt.json`: all precise sites, source hashes, material histogram, obstruction, clearance, image hashes and counts.
- `overview.png` = real 2048×1024 indexed material cells; six genuine 1:1 crops. Generator validates PNG chunk CRC, DEFLATE stored-block stream, Adler checks and complete material-ID-to-pixel parity. They are **not** AI scenery or native screenshots.

**HOLD:** Native Godot/CyberDemoBridge/Workbench/Rapier load, Midge piloting, collision, sustained stepping and fresh-process save/reopen have not been run. Source supports 32,768 rectangles, but installed legacy bridge may fall back to **4,096**, so 4612 rectangles may exceed it by 516. Installed compatibility remains UNKNOWN. Await independent exact-HEAD Art/Tech/Shepherd audits; never merge/promote Ready without owner approval.
