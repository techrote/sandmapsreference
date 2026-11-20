# The Pilgrim Gait — Stranded Six-Leg Civic Engine

ORIGINAL 2048x1024 landscape CyberSand material-cell world, true perpendicular side elevation; all geometry authored algorithmically without sourced/reference images. Draft/HOLD, not owner-accepted. Current sandbox builder is deterministic at seed 39916038.

## Thesis and inhabited place
A colossal refugee polity converted a failed six-legged orbital cargo walker into a grounded city spanning two opposed basalt fault shoulders. Six actual steel/concrete/copper actuator legs terminate in the bedrock. A continuous high structural datum carries the five different carapace segments; an exposed gyro ballast wheel below the inhabited hull acts as the leg load stabiliser. Public evacuation and industrial servicing share a deliberately open central transverse flight corridor.

1. **Rook Anchorage** (west): beak-like ship mooring, public berth and two nested habitation wings, starboard lantern and lower ballast maintenance.
2. **Hydraulic Cloister**: three dissimilar diagonal force rams, load-measurement hatches, fluidless inset service rooms, sump recovery and high winch.
3. **Gyro Crucible**: triangular sensor housing, real eight-spoked material-cell ballast wheel, accessible inspections on both sides of the rotating-assembly representation.
4. **Commons Forum**: stepped public archive, white/aluminium civic council bay and lower recycling workshops, asymmetric antenna.
5. **Eastern Relief Terminal**: fortified quarantine intake, classification windows, freight recovery bays, tall emergency radio spire and final sanctuary beacon.

## Game objective and topology
Spawn at **Rook berth spawn (136,500)** and reach **Pilgrim terminal destination (1934,498)**, optionally inspecting 14 named checkpoints. Three open west/east flight levels are y267–324, y468–541 and y713–789. Fully open interlevel shafts at x225–277, 605–658, 861–910, 1150–1207, 1414–1462, 1748–1806 and 1870–1915. Multiple flight loops and backtracking survive physically sealing a central 121x78 rectangle, x990..1110, y465..542, which covers the central datum and must not be treated as reachable. Main course is western public berth → hydraulic transfer → gyro datum → commons → east border. Alternate course climbs via western/gyro shafts to high crossway then descends east; service-recovery course uses underbody return then ascends east. Distinct high/low cross-connectors allow returning from a dead end.

### Exact named sites
- Rook berth spawn: (136, 500)
- Rook starboard lantern: (320, 294)
- Rook ballast return: (295, 748)
- Piston wrench control: (545, 498)
- Piston high hoist: (692, 297)
- Piston sump bypass: (687, 748)
- Gyro catenary monitor: (912, 294)
- Gyro central datum: (1040, 500)
- Gyro lower service: (1036, 748)
- Commons library mezzanine: (1329, 296)
- Commons public counter: (1375, 499)
- Commons waste descent: (1491, 749)
- East beacon mast: (1733, 296)
- East quarantine wicket: (1838, 498)
- East freight recovery: (1788, 748)
- Pilgrim terminal destination: (1934, 498)

## Physics, engineering, proof
Accepted CyberSand `main` at `de109d0131641d6adc8d25bb9ced7ca3d4991105`, read only. Setup-v2 exact 14 root fields, 2048x1024 admitted sides, one Midge with accepted 4x3 authored hull hash, source max 32768 five-field rectangles, 1 MiB JSON, 32M construction work. Only stable native-defined nonmovable Solid / RuleKernel::None IDs are used; no staged fluids, falling powders, biological, combustible or reactive kernels. Physical structures are STATIC symbolic industrial mechanisms, not operating hydraulic/rotary simulations.

Source 32768 rectangles is NOT proof the installed CyberDemoBridge accepts this map; possible legacy 4096-rectangle capacity. Never truncate or silently downconvert. Installation/input/collision/Rapier advancement and cold save/reopen remain NATIVE-UNTESTED.

Full material grid = 2,097,152 one-byte IDs; nonoverlapping ordered horizontal-run/vertical-coalesced rectangles = 4457, UTF8 Setup = 83748 bytes; material work 594337. All 594337 retained solid cells are boundary-grounded. Detached optional remnants pruned during construction: 242592 across 61 components. SHA256 row-major grid `61d8d4d2614d5e3cd708cc06ca13e8f6591601698b22b6ca56d3672c674c5e78`; Setup SHA256 `940f63feec4106cf406dbc840e06c9fc6466ff8909cd898440ee9cd5356c8fba`. No material IDs were fabricated.

Creator-side conservative exact centre BFS (four-neighbour, fully contained 19x15, 23x19 and 31x27, no site shift or waived radius): 16/16 at 19x15; 16/16 at 23x19; 16/16 at 31x27. Midline physically blocked alternate: 15/15 at 19x15; 15/15 at 23x19; 15/15 at 31x27 (central datum excluded by genuine obstruction). Replay all ordered rectangles and compare every final cell; no overlap/out-of-bounds or missing cells.

## Files and reproducibility
`build.cjs`: deterministic generator, replay and images; run `node build.cjs --write` then `node build.cjs --verify`. `setup.json`: genuine full complete Setup-v2. `receipt.json`: source/grid SHA, edits, histogram, exact site coordinates, physics, bytes, crops, obstruction and restrictions. `overview.png`: unscaled actual 2048x1024 indexed-material PNG; `01`–`05` images are separate authentic 1:1 district slices. PNG files use indexed material IDs with palette and fixed-Huffman zlib DEFLATE. The creator checked source-index parity at PNG construction and emitted chunk CRCs/IEND, but a **separate-process decompression/independent PNG-byte audit is not claimed**. Re-run local verifier before formal technical acceptance.

Art, technical and Shepherd independently review exact immutable PR HEAD; keep DRAFT/HOLD, never merge/Ready/auto-merge or declare owner acceptance.
