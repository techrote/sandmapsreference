# Silt Meridian — Twin Raised Bascule Rail-Ferry Exchange

**ORIGINAL/NO-REFERENCE · 2048×1024 · fixed seed 20261120 · Draft/HOLD · NATIVE-UNTESTED.**

A different place from Cinderwake and Ternbreak: a stranded coastal rail-ferry drydock feeding a colossal pair of **raised bascule rail bridge leaves** across a dry cargo cut. The opposite steel leaves stop short of one another to make a Midge-flight throat. East of the gap a ten-spoke wagon indexing wheel feeds a real split-frog classifier, side-entered customs hall and inland dispatch. Above the engineering is a free-air traverse; below it a separate service artery with five grounded workstations and recovery shafts. R2 adds material-cell ship cargo stocks, a dockside transfer hoist, paired hinge-brake operator stations, indexed sorting wagons/frog, a staffed examination scale, and differentiated lower service machinery, preserving all 24 exact flight destinations. This is a **static** material-cell freight arrangement, not moving bridge, wheel or cargo simulation.

Six functional districts:
1. **Serviced freighter and dry berth, x100–545** — thick asymmetric joined hull, one pilothouse, exposed Midge-sized central cutaway, supported keel blocks, customs manifest and quay crane.
2. **Rail hoist and transfer yard, x493–810** — A-frame-supported multi-sheave hoist, cargo cage, rooted overload girder and a physically carved full-hull midlevel rail-transfer opening.
3. **Parted bascule cut, x779–1409** — left/right inclined triangular trusses, rooted hinge drums and distinct lower service rooms, broad true playable open-air throat.
4. **Rotary sorter, x1404–1790** — grounded ten-spoke indexing wheel, divergent main/siding rails with genuine frog and asymmetrically sized wagons.
5. **East dispatch, x1774–2048** — side-entered customs hall, inward examination workface, elevated roof, outfeed and lower maintenance gallery.
6. **Invert rescue artery, y798–986** — horizontal return with separate bilge, hoist, channel-winch, switch and dispatch repair chambers.

## Exact authored Midge destinations

| Destination | X | Y |
|---|---:|---:|
| Western arrival buoy | 112 | 447 |
| Berth customs manifest | 333 | 465 |
| Ship cutaway workface | 310 | 713 |
| Quay crane sky inspection | 470 | 205 |
| Rail lift receiver | 652 | 460 |
| Lift upper service | 706 | 220 |
| Western bascule hinge | 849 | 463 |
| Western raised leaf | 983 | 342 |
| Channel free throat | 1095 | 474 |
| Eastern raised leaf | 1214 | 337 |
| Eastern bascule hinge | 1369 | 462 |
| Rotary outer inspection | 1450 | 475 |
| Rotary internal bay | 1600 | 489 |
| Sorting frog operator | 1724 | 487 |
| Dispatch inlet | 1843 | 473 |
| Outbound customs gate | 1930 | 470 |
| Upper open west | 523 | 201 |
| Upper channel traverse | 1111 | 203 |
| Upper open east | 1762 | 206 |
| Bilge pump station | 268 | 838 |
| Rail lift maintenance | 616 | 838 |
| Channel invert | 1121 | 838 |
| Sorter switch below | 1533 | 838 |
| Dispatch recovery | 1850 | 838 |

**Primary**: Western arrival buoy → Berth customs manifest → Rail lift receiver → Western bascule hinge → Channel free throat → Eastern bascule hinge → Rotary outer inspection → Sorting frog operator → Dispatch inlet → Outbound customs gate.

**Overhead alternate**: Quay crane sky inspection → Lift upper service → Upper open west → Upper channel traverse → Upper open east. A free-air route bypasses the rail and hinge structures.

**Lower recovery**: Bilge pump station → Rail lift maintenance → Channel invert → Sorter switch below → Dispatch recovery. One deliberate x~581–637 vertical transfer opens through the supported lower-rail deck; it was independently checked for exact 31×27 full-body clearance. An added real physical obstacle at x166, y403, width74, height90 causes Western arrival buoy→Berth customs manifest 31×27 BFS distance to change 239 → 321 without losing any of the 24 sites.

## Committed source and proof

- `build.cjs`: fixed-seed, independent geometry definitions and full deterministic generation; re-run with `node build.cjs` in this directory. Uses standard Node 22 APIs only for writing outputs, all math and validation itself are portable JS.
- `setup-silt-meridian.json`: complete real **2,097,152-cell** material plane serialized as lossless, ordered, nonoverlapping canonical material rectangles, not an illustration, patch-only delta or arbitrary colour map.
- `receipt.json`: complete grid and Setup SHA-256; material histogram; legal counted rectangle/work/JSON budgets; grounded component and 31×27/23×19/19×15 exact-site 4-neighbour flood; real-obstruction route; image integrity and pixel parity.
- `overview.png`: full actual 2048×1024 indexed-material cells, plus six **true unscaled 1:1 source-grid crops**, all verified internally by PNG CRC, zlib Adler and every decoded material-palette index. Material-ID palette: 0 Empty; 100 BasaltColumns; 58 ReinforcedConcrete; 62 SteelPlate.

| Static metric | Generated result |
|---|---:|
| Cells | 2,097,152 |
| Rectangles / accepted source maximum | 7044 / 32,768 |
| Setup UTF-8 bytes / accepted source maximum | 129581 / 1,048,576 |
| Material-work painted cells / max | 615813 / 32,000,000 |
| Grounded occupied / detached | 615813 / 0 |
| Pruned unsupported pre-final fragments (excluded from final world) | 11097 |
| Exact Midge destinations at 19×15, 23×19, 31×27 | 24/24, 24/24, 24/24 |
| Added 74×90 obstacle / exact 31×27 destination reach | 24/24 |
| Real indexed PNG integrity / material-pixel parity | 7/7 PASS |
| Material plane SHA-256 | `78e963437dafb359406779ee13cfef8bd8c6f5c3a7d20f2d7dca8b918ebd9044` |
| Setup JSON SHA-256 | `9f1ac2833afaeb7093d1ab6ae4bcb0b390d2beb7be480f575cf6c37c6a178d91` |

**Read-only accepted CyberSand main:** `de109d0131641d6adc8d25bb9ced7ca3d4991105`. Setup-v2 loader SHA `70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9`; material definitions SHA `dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3`. **Source repo main base:** `99a166e7fcae45eb22be1740e9f33f62faccbcc7`. The supported physical IDs 58, 62 and 100 are inert immovable Solid / RuleKernel::None (as verified against the accepted material descriptors); no unstable powder, fluids, fire, lava or fake IDs.

**Bridge risk:** accepted source advertises 32,768 rectangle support, while an older **installed** CyberDemoBridge that lacks `workbench_start_rectangle_capacity` falls back to **4,096**. This map uses **5845 rectangles (1749 above fallback)**. Installed binary capability is unknown; no native import/load, real Midge/Rapier collision, simulation or cross-process save/reopen was executed. Explicit status **NATIVE-UNTESTED**. This deterministic static proof is not native PASS or owner acceptance.

**Review gate:** independent Art, Technical, Shepherd and subsequent native assessment required. Keep Draft/HOLD; do not merge or promote Ready. All imagery derives from the committed final material IDs; no source tracing, reference photos, concept artwork or fake Workbench captures.
