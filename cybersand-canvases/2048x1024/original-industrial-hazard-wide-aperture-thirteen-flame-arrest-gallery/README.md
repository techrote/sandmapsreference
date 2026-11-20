# Aperture-13 Flame Arrest Gallery

**ORIGINAL-NO-REFERENCE | 2048 x 1024 CyberSand material-cell side elevation | Draft / HOLD | NATIVE-UNTESTED**

A self-authored hazardous plasma pulse arrest and cooling station occupying five asymmetrical, physically distinct work districts on an old basalt fault. All pixels in the indexed PNGs are genuine material IDs from the committed complete grid, not illustrations, reference-image reproductions or native screenshot imitations. No foreshortening or platform tops. The industrial equipment is a collision-physical architectural design: it does **not** implement simulated pumps, heating controls or process machinery.

## Landscape structure and gameplay

This is a real traversable 2D cross-section, authored at playable Midge scale with thick structural mass, high vertical voids, moderate flight shafts and dry recovery space.

| District | Horizontal span | Real machinery and movement role |
|---|---|---|
| Blast Assay Yard | x=70-435 | Unequal raking assay crane, thick load-bearing piers, clamped and hoisted assay specimen, side-entered control room and inspected cargo lock and high staging route |
| Ceramic Splitter Field | x=435-865 | Three deliberately different grounded splitter vanes, accessible calibration aperture and contact relays, dry service watchroom, paired but unequally charged sealed quench cells, upper and lower maneuvering |
| Pulse Shield Hollow | x=865-1330 | Massive refractory blast arch with a deep flyable central void, breached flash-vent at the crown, two separately entered side sensor/isolation rooms, independent below-shield bypass, isolated sealed lava capsule |
| Condenser Drum Works | x=1330-1730 | High/low/medium condenser supports, two isolated water reservoirs, twin-door instrument cabin and closed inert transfer/valve manifold, dry upper ventilation and lower inspection exit |
| Exhaust and Extraction | x=1730-2010 | Distinct descending wind vane, staffed extraction load fixture and sheltered double-ended exit gallery, extended low external extraction position |

**Authoring route graph (all nodes exact):** Aerostat arrival -> Blast assay deck -> Slag arrival lock -> Quench relay -> Ceramic vane overlook -> Shield west gate -> Shield hollow -> Shield east recovery -> Vapor drum service -> Retort return gallery -> Quarantine departure -> Eastern emergency exit.

**Recoverable alternatives:** From the ceramic vanes, descend to Coolant bypass west and recover to the main route through the service duct; from the Shield hollow, climb through Upper rupture lookout and traverse the open overflight space or drop via Damped lower transit. Downstream, Cold isolation refuge gives a second lower recovery route into the exhaust districts. These are paths through physical empty cells, not one-way fiction.

## Exact Midge site coordinates

```
Aerostat arrival               (80, 420)
Blast assay deck               (263, 445)
Slag arrival lock              (438, 485)
Quench relay                   (617, 414)
Ceramic vane overlook          (772, 472)
Shield west gate               (904, 392)
Shield hollow                  (1109, 480)
Upper rupture lookout          (1109, 157)
Shield east recovery           (1353, 440)
Vapor drum service             (1515, 447)
Retort return gallery          (1660, 561)
Quarantine departure           (1852, 315)
Eastern emergency exit         (1982, 679)
Coolant bypass west            (778, 773)
Damped lower transit           (1172, 754)
Cold isolation refuge          (1660, 780)
```

The authored spawn and each of the 22 exact targets are checked in bounds with **19x15**, **23x19**, and **31x27** full rectangular Midge clearance, followed by 4-neighbour centre flood from the exact spawn. No waypoint displacement, nearby-site fallback or radius concession. Two independently inserted **52x64** solid obstructions test recovery and return, rather than assuming an alternate route exists.

## Deterministic physical contract

* Fixed seed: **19260483** (the design is deliberately deterministic, not random scene filling).
* Read-only accepted CyberSand main: `de109d0131641d6adc8d25bb9ced7ca3d4991105`.
* Sandmapsreference default-main base when branched: `99a166e7fcae45eb22be1740e9f33f62faccbcc7`.
* Final grid: 2048x1024 = 2,097,152 material IDs, all legal and exhaustively covered by lossless ordered, nonoverlapping rectangles.
* Structural IDs: 58, 62, 63, 66, 68, 76, 77, 79, 100, 104, 117, 120, 123 (accepted inert Solid/None). Water=3 and Lava=8 are mobile/reactive, enclosed in actual inert-solid vessels and never used as foundation.
* Source-advertised max is 32,768 edits and 1 MiB JSON. The **installed** CyberDemoBridge may be older (possibly 4096); its exact runtime admission and engine DLL/source identity need independent verification.
* There are no initial water/lava-to-air cardinal faces and no direct Water/Lava interfaces. This is **time-zero isolation only**, not a native dynamic containment claim.
* The bottom basalt bed is rooted in the outer World boundary, all structural solid regions are component-audited and rooted by actual steel bearings. Support post-processing introduces only actual cells, preserved in the committed grid.

## Reproduction, receipt and truthful boundaries

Run `node build.cjs` from this folder to deterministically recreate all six indexed material PNGs, Setup-v2 JSON and independent evidence JSON from the source; run `node build.cjs --verify` to byte-compare the committed versions. The builder itself does exhaustive rectangle replay, legal material and bounds checks, material histograms, 3 conservative full-hull BFS sweeps, both obstruction sweeps, initial fluid isolation, rooted structural connectivity, CRC-verified indexed PNG decoding and complete per-index grid parity.

This run's full grid SHA-256 is `cdf45bae5e9101989dab1a4c73d4610acb38b61b77c21e253808f3fd1bd5e2f9`; Setup-v2 SHA-256 `f221337ff6e141f40c8f184223efad2c056ad52182672b4253a3594ff56a726c`. See `receipt.json` for exact byte, rectangle, hash, support, material histogram and checkpoint evidence. Self-qualified on the exact generated source, **not** independently accepted or native-tested.

## Genuine 1:1 indexed material-cell PNG gallery

* [Full-resolution overview](./overview.png) -- exactly 2048x1024
* [Blast assay and cargo lock](./assay.png) -- 1 material pixel per cell
* [Ceramic splitters and sealed quench](./vanes.png) -- 1 material pixel per cell
* [Pulse-shield central hollow and plasma containment](./shield.png) -- 1 material pixel per cell
* [Unequal condenser retorts and instrument gallery](./retorts.png) -- 1 material pixel per cell
* [Exhaust and emergency return](./exit.png) -- 1 material pixel per cell


## R7 — genuine reviewer P1 material-cell repair (20 November 2026)

The first independent Art and Shepherd assessments of R6 identified skeletal machinery and poorly entered service interfaces. R7 changes the actual final material-ID plane and regenerates **all** committed artifacts, preserving the unequal skyline, central void and original 16 Midge destinations. Newly rooted load/hoist inspection, ceramic contact/calibration, west/east shield sensor/isolation booths, retort transfer-valve manifold and quarantine extraction apparatus replace empty schematic workfaces. Three genuine opened access shafts (assay overhead/west and splitter calibration) and physically cleared shield entrances prevent the new workrooms being purely scenic. Existing safe bypasses, Water and Lava cassettes remain.

**Six additionally verified exact operational Midge destinations:**

| New entered checkpoint | Exact cell centre |
|---|---|
| Assay entered inspection | (204, 699) |
| Splitters calibration | (653, 674) |
| West shield sensor | (1014, 645) |
| East shield isolation | (1309, 620) |
| Retort operator console | (1515, 534) |
| Quarantine extraction | (1848, 701) |

All **22/22** old/new exact sites are reachable from original spawn at all three full rectangular 19×15, 23×19, 31×27 envelopes, and survive each original real 52×64 obstruction independently. Independently generated material support, fluid-interface, complete ordered edit replay, CRC/index parity and SHA-256 receipts are in `receipt.json`. R7 has **2011** optimized disjoint material rectangles, **38201** Setup-v2 JSON bytes and full plane SHA-256 `b3cd784a0ddcee229ea66f9d67d727536014690f7e1962a03c2367dc1971292b`. **0** detached inert cells; zero time-zero fluid leak or Water–Lava contact. These are creator static tests, not independent new-HEAD or native qualification. The visible valves, gauges and retort connections are inert material-cell architecture, not animated process simulation.

The accepted engine source read remains `de109d0131641d6adc8d25bb9ced7ca3d4991105`; installed CyberDemoBridge capability, live Midge physics/fluid containment and save/reopen remain **NATIVE-UNTESTED**. This new R7 HEAD is OPEN Draft/HOLD awaiting independent Art/Technical/Shepherd requalification.

## HOLD

Native Godot/Workbench/CyberDemoBridge/Rapier import, installed rectangle cap, physically advancing Midge, Water/Lava stability after ticks and save/reopen are **NATIVE-UNTESTED**. Exact new-HEAD Art/Technical/Shepherd audits are required. Remain OPEN DRAFT; never Ready, merge, auto-merge or claim owner acceptance.
