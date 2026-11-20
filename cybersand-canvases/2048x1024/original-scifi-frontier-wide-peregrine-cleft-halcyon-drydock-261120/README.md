# Peregrine Cleft — Halcyon Ark Drydock

**Genuinely new authored sci-fi frontier landscape, 2048×1024, entirely material cells. Original/no reference. DRAFT / HOLD. NATIVE-UNTESTED.**

An abandoned colony-ark *Halcyon* hangs in a brutal off-world rift. Two distant rock shoulders enclose a navigable drydock. The vessel's asymmetrically smashed tail, broad hollow crewdeck, giant forward ram, hooked launch antenna and offset shipbreaker derrick dominate the silhouette. There is no simulated perspective, platform top, source photograph, concept raster, or decorative collision-independent painting. Each visible pixel is one committed material cell.

## Districts and function

1. **West pilots' exchange:** cliff-carved arrival lobby, habitation overlook, rover service, specimen assay and underground archives; a full-height service route leads to the drydock fabrication apron.
2. **Fabrication spine:** two anchored, nonparallel launch-girder masts, an inspection lookout and a mid-level heavy truss; it communicates with the ark's aft access.
3. **Halcyon ship interior:** an actual side-elevation hollow wreck with a broken aft crucible, bow ram, separate specimen, galley, navigation and decontamination workstations; two 80+-cell-wide lower access apertures.
4. **Great salvage derrick:** tall grounded extraction mast, crossarm, hoist lines, control pod and physical service bridge to the eastern containment harbour.
5. **East quarantine/salvage:** tiered cliff-carved freight rooms, cryochemical assay racks, thermal recovery and a separate lower mineral intake.
6. **Lower xenogeology:** a long basal survey return, stable rock-backed boring stations, a lower assay and lateral bypass to both inhabited shoulders.

All six districts have actual grounded engineering. The construction uses a fixed set of individually authored cliff polygons, hull plates, ship compartments, level-size portals and asymmetrical gantry members. A deterministic shortest-component structural tether pass grounds 67 small inert fixtures to existing load paths (maximum 47 material cells). It is not procedural wallpaper. Materials are accepted stable inert/immobile solids; exposed ore strata and shallow signal panels have no water, powder or combustible reactions.

## Gameplay route graph

**Spawn:** West arrivals (120,524). Main progression: West arrivals -> Pilots exchange -> Fabrication platform -> Ark aft hatch -> Ark specimen bay -> Ark living galley -> Ark navigation core -> Ark bow hatch -> Great crane console -> East quarantine lock -> East cargo.

**Lower independent return:** West arrivals -> West assay -> West rock archive -> Western vent recovery -> Lower mineral assay -> Lower bore drill -> East survey -> East thermal salvage -> East cargo.

**Sky recovery:** Fabricator lookout -> Ark roof rendezvous -> Great crane console -> East quarantine lock. Vertical connections and side returns are genuine clear material-cell passages; no rooms are implied by concept-only overlays.

The in-repository deterministic builder verifies **all 21 exact written checkpoints** with three complete in-bounds Midge centre hull envelopes (**19×15, 23×19, 31×27**) and a four-neighbour free-centre BFS. No target coordinates are shifted or granted waivers. One deliberately inserted *physical* wall (x968..1112, y454..606 inclusive) blocks Drydock centre (1000,515), but every one of the other 20 exact checkpoints remains reachable with a 31×27 hull. Static connectivity does not prove dynamic thrust, steering, collision, inertia, or gameplay difficulty.

## Exact functional checkpoint coordinates

| Exact Midge centre | X | Y |
|---|---:|---:|
| West arrivals | 120 | 524 |
| Pilots exchange | 244 | 418 |
| West assay | 235 | 645 |
| West rock archive | 266 | 787 |
| Fabrication platform | 539 | 507 |
| Fabricator lookout | 556 | 281 |
| Ark aft hatch | 718 | 492 |
| Ark specimen bay | 855 | 329 |
| Ark living galley | 964 | 326 |
| Ark navigation core | 1091 | 328 |
| Ark bow hatch | 1366 | 500 |
| Ark roof rendezvous | 1115 | 210 |
| Great crane console | 1394 | 294 |
| East quarantine lock | 1820 | 402 |
| East cargo | 1891 | 533 |
| East thermal salvage | 1810 | 636 |
| East survey | 1875 | 783 |
| Drydock centre | 1000 | 515 |
| Lower mineral assay | 959 | 744 |
| Lower bore drill | 1265 | 756 |
| Western vent recovery | 617 | 725 |

## Material and proof

- Engine accepted read-only **techrote/cybersand main**: `de109d0131641d6adc8d25bb9ced7ca3d4991105`; inspected Workbench Setup-v2 14-key schema, 2048×1024 extent support, Midge hash/hull, supported catalogue and physics kernels. Source loader allows 32768 ordered rectangles, 1 MiB JSON and separately bounded construction work.
- Map forked from **techrote/sandmapsreference main**: `99a166e7fcae45eb22be1740e9f33f62faccbcc7`. No modification to CyberSand engine, prior maps, legacy references, other creators' branches or workflows.
- **Plane:** 2,097,152 complete final material-ID cells, 792,346 rooted stable occupied cells, **zero detached solid cells**. 10,038 nonoverlapping ordered five-word rectangles; 186,903 setup bytes. Whole-plane SHA-256: `15db2e5cf9b94f844adf7a3472a412c747ab73a284a7e1c762e42ddbdb650a6e`; setup SHA-256: `d0a4dc58f8b8865b2c23cf0acfc443a3a6bfa121d6b841488a3503ee5da4a65a`.
- Valid **Setup-v2:** `setup.json`. **Builder:** `build.cjs`, fixed seed `0x260B20`; run `node build.cjs` to regenerate or `node build.cjs --verify` to recompute and compare all committed generated files and decode indexed PNG pixels independently using Node's zlib. No npm packages.
- **Machine receipt:** `receipt.json` includes per-ID histogram, all exact site coordinates, image hashes, structural/route verification, obstruction, source identity, rectangle count, JSON bytes and native status.
- **Genuine PNGs:** `overview.png` (2048×1024) and *five real unscaled 1:1 material-cell crops*: west arrivals (475×515), ship (705×320), fabrication (315×535), east salvage (473×520), lower mineral (968×285). Each indexed pixel equals the authoritative material ID, not an RGB-converted concept render. CRC/inflation and complete cell-parity verification is included in reproducibility checks.
- **Installed native hazard:** older installed CyberDemoBridge may only admit **4096 rectangles**. This file requires 10038; therefore the actual loaded binary MUST report enough capacity before any Workbench attempt. Source-advertised 32768 is not evidence of the installed bridge.
- **Not yet performed:** actual compatible native Godot/Workbench/CyberDemoBridge/Rapier import, Midge collisions and progression, runtime work budget/performance, simulation, native persistence and fresh-process save/reopen. **NATIVE-UNTESTED; no owner acceptance.**

## Independent qualification and HOLD

Request independent Art, Technical and Shepherd review on the exact new PR HEAD. Observe the entire real-cell overview and each 1:1 crop at ordinary zoom; test collisions, travel paths, contained rooms and potential manoeuvring traps, not just the mathematical centre graph. Keep the PR **Draft / HOLD**, without merge, Ready, auto-merge or owner acceptance. All previously published original maps remain untouched.

## R8 functional architecture repair (20 November 2026)

This is a **material-cell change**, not a README-only revision. Responds to independent Shepherd P1 and Art P1 on predecessor `a923264e0b577ddb9c3251fce0b3c1c6fa1f9d06`. Changed exactly **29,626** material IDs (**25,842 newly occupied, 2,310 rematerialized, 1,474 erased**). Keeps the same broad flying basin, all 21 exact checkpoints, complete 31×27 shipboard traversal, and the physical Drydock-centre blocked route.

- Halcyon now has **three different physical workface vocabularies**: specimen containment carousel with cells/tank indicators, two rack-grown galley planters and cooktop, and twin navigation chart/helm panels. They occupy separate floor-connected bays without dividing the upper 31×27 flying aisle into traps.
- Western fabrication has an actual **dual-ram hydraulic press and operator station** plus a second instrumented service cradle; both are rooted inert-solid equipment, not decorative overlays.
- Eastern quarantine contains a **side-access scrubber-transfer lock** with upper/lower bulkhead jaws; cargo has a hoist and pallet transfer while thermal salvage has its own finned heat exchanger and diagnostics.
- Lower return distinguishes the **X-ray/sample assay stage** from two torque-shaft drilling mechanisms and their control head; passage clearance remains exact-centre verified.

**R8 static receipt:** 792,346 grounded occupied cells, zero detached; 10,038 legal ordered rectangles; 186,903 JSON bytes; 21/21 three-hull exact sites and 20/20 remaining through the physical centre obstruction; six independently fixed-Huffman-decoded indexed PNGs with full material-ID pixel parity. Source-limit capacity 32,768; installed 4,096 bridge capability not measured. **NATIVE-UNTESTED; independent new-HEAD Art/Technical/Shepherd re-review required.**
