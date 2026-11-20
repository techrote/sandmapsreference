# Kestrel-Delta Thermal Spillway — R2 industrial process admission repair

**Original 2048×1024 material-ID landscape · OPEN Draft/HOLD · exact branch HEAD is authoritative · creator SOURCE-STATIC PASS · independent Art/Technical/Shepherd R2 reviews pending · NATIVE-UNTESTED.**

## Root-caused P1 material changes

Independent exact-R1 Shepherd review identified schematic, mostly empty processing spaces, especially below the sacrificial V-throat. R2 makes **41,479 real material-cell changes** (31,541 inserted, 9,938 reclassified, 0 erased), **zero Water/Lava cell modifications**, preserving every original source coordinate. This is authored support geometry rather than scenery or a functioning simulation.

- **Drum-shear ore assay:** side-anchored discharge roller, weighed output drive, inspected shutter and a distinct bench physically linking cargo extraction to onward processing.
- **Stepped thermal smelter:** accessible separate hot isolation console and cold-pressure metrology console, two contrasting grounded outlet/skimmer manifolds below the fully sealed Lava and Water cassettes.
- **Sacrificial V spillway:** two joined, dry slag removal and assay workfaces, a graded conveyor and supported transfer into the right handling area, leaving the large airworthy throat empty.
- **Cryo-ribbon reclamation:** an attached return coil/height sampling assembly and separate cassette relief/testing interface with individually identifiable controls.
- **Inverted plume condenser:** apical dry exhaust duct, branched scrubber connection, front-accessible sample rack and outboard discharge-valve station.

All added material is from accepted existing inert solid IDs. The inherited Water/Lava vessels remain sealed at initial state. These pipes and gauges do not implement active mechanical, gas or chemical simulation.

## Geometry, exact routes and provenance

- Source reference repository: `techrote/sandmapsreference/main@99a166e7fcae45eb22be1740e9f33f62faccbcc7` (read-only default branch).
- Accepted engine reference: `techrote/cybersand/main@de109d0131641d6adc8d25bb9ced7ca3d4991105` (read-only).
- Source parent R1: `36ee8b6261a5bba7e691ce2bb79aba215af02471`; R2 only in this PR's owned original-industrial-hazard folder.
- 2048×1024 = **2,097,152 actual cells**, fixed seed `202611203`, complete generated Setup-v2 14-key root.
- **2908 disjoint rectangles**, **54833 exact JSON bytes**, **544413 actual material work cells**; full nonoverlapping rectangle replay equals source plane.
- SHA-256 material plane: `7b20eee1ae78e9018ef2974388fd5857c541cb05af34457457c950a8ce5747d3`; SHA-256 serialized Setup: `93f654278a5dc2e73cf845e6dee86a6a616239bc1f2734f6cae4085af5da9ee2`.
- Boundary-grounded inert structural cells **515748/515748**, detached **0**.
- Water `21146`; Lava `7519`; **zero** at-tick-zero fluid-to-air, fluid-to-boundary or Water/Lava contact.
- Midge exact original named sites **15/15** at all 19×15, 23×19 and 31×27 envelopes, four-neighbour flood from literal spawn with no shifting.
- Real solid obstruction `[1192,420,40,140]` retains **15** sites at 31×27; forced detours: Cascade throat +200; East throat gate +136; Slag recovery +130.
- Source rectangle capacity 32768, source Setup JSON 1 MiB; installed legacy bridge possibly 4096 rectangles **NOT VERIFIED**. Source fitness does not establish native compatibility.

## Authentic final-material gallery

Every image is palette-indexed: one pixel = one real final material ID. Each crop has original 1:1 cell dimensions, not resized artwork.

- [overview.png](overview.png) — crop `0,0,2048,1024`, 32707 bytes, SHA-256 `e23cda1a8a1f96a927690d62888bb1ada1803323b3a518d75caec65a2b16c88e`
- [01-drum-shear.png](01-drum-shear.png) — crop `40,265,395,565`, 7778 bytes, SHA-256 `fe6bda753f53ecf630f36ca0155039225aba5fe9b1e5f7b73033f7ad3fd8aae5`
- [02-smelter-cassettes.png](02-smelter-cassettes.png) — crop `418,285,425,620`, 6765 bytes, SHA-256 `2399b1c6345df7d7d69c4cf8b1bd8902cac14c895d6db141e1806a61a8f4539d`
- [03-spillway-throat.png](03-spillway-throat.png) — crop `824,230,430,660`, 8532 bytes, SHA-256 `7b22fcaf8b94e365009d71391e06308d5eda701142e0f1b9e1d451eb6d8945c2`
- [04-cryo-recovery.png](04-cryo-recovery.png) — crop `1248,315,400,590`, 6774 bytes, SHA-256 `299a3bd30ad87adedfd6b25a39a1ed773d6837375c44405ba179be240d526766`
- [05-plume-scrubber.png](05-plume-scrubber.png) — crop `1630,205,410,690`, 7738 bytes, SHA-256 `7747571b367a2a218f216160c893d9a394823cea74afbce7946b0bc25194aeb1`
- [06-lower-culvert.png](06-lower-culvert.png) — crop `808,710,515,295`, 4329 bytes, SHA-256 `56bde5091a1c00d8333495bc3488c5ed3856a66bdb6a2b4dea5a022f54121dae`

Use `node build.cjs --write` from this directory to regenerate `setup.json`, `receipt.json`, and all seven authentic PNGs; `node build.cjs --verify` for serialized receipts, exact grid, all site clearances, obstruction and zlib-decoded image/cell parity. The deterministic geometry is in `geometry.cjs`, build / proof code in `build.cjs`; the committed receipt gives full histogram, site coordinates, per-image hashes and counts.

## Strict downstream HOLD

Request **fresh independent R2 Art, Technical and Shepherd** reviews of this exact geometry. **NATIVE-UNTESTED:** source-matched Godot Workbench/CyberDemoBridge/Rapier actor collision and movement, actual liquid evolution, installed bridge admission, save/reopen and Windows render publication were not executed. No Ready, merge or owner acceptance is implied.