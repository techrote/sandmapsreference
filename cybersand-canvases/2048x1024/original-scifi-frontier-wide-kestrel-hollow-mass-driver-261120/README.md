# Kestrel Hollow — Cryogenic Mass Driver

**New from-scratch 2048×1024 CyberSand material-ID world, no source/traced art.** Orthographic perpendicular XY side elevation; actual collision solids and air voids, not a perspective painting.

## Place and purposeful physical architecture

A disused off-world mass-driver accelerator climbs diagonally out of a breached impact crater. A wide double-rail accelerating spine carries cryogenic capsules between a cliff-cut western intake and eastern quarantine/power export. A huge evacuated flight cleft, staggered engineering struts, cliff-rooted crew laboratories and a side-fed underground service return allow Midge to investigate the entire facility. The partly severed midspan rail is an intentional navigational/repair discontinuity rather than an illustrated backdrop.

Six distinct functional districts consist of: (1) western cryogenic intake, payload machining and crew exchange, including spool geometry, forge ram and controls; (2) high meteorology mast with crown antenna and mechanical storm sampler; (3) traversable diagonal mass-driver and separate alpha/beta coil workfaces; (4) elevated switching laboratory with shielded coil gauge and operator workrooms; (5) eastern decontamination, cargo hoist and condenser plant; (6) excavated lower fossil sorting, superconducting splice and heat exchange return chambers.

## Named routes and physical checkpoints

**Main traverse:** West arrivals → cryo cartridge intake → pilots exchange → payload machining → driver west gate → coil bank alpha → mass driver flight lane → core switching lab → coil bank beta → launch nose → east quarantine → freight handling → condenser plant.

**Underground recovery:** West service shaft → west bore rescue → fossil sorting → cable splice vault → thermal return → east bore rescue → east quarantine. The lower cut rock bore is actually excavated material space, not a decorative background. Upper recovery uses the meteorology crown, storm sampler, telemetry middeck, launch nose and upper recovery airspace.

All exact centre locations, including original Midge spawn and destination names, are recorded in `receipt.json`:

- West arrivals: (376, 626)
- Cryo cartridge intake: (180, 481)
- Pilots exchange: (272, 610)
- Payload machining: (293, 762)
- West service shaft: (366, 854)
- Meteorology crown: (736, 256)
- Storm sampler: (727, 349)
- Telemetry middeck: (735, 490)
- Driver west gate: (554, 574)
- Coil bank alpha: (820, 623)
- Mass driver flight lane: (930, 550)
- Core switching lab: (1053, 364)
- Upper recovery: (1120, 157)
- Coil bank beta: (1272, 602)
- Launch nose: (1467, 280)
- East quarantine: (1780, 470)
- Scrubber transfer: (1910, 572)
- Freight handling: (1770, 647)
- Condenser plant: (1901, 742)
- East ridge exit: (1945, 405)
- West bore rescue: (369, 920)
- Fossil sorting: (634, 909)
- Cable splice vault: (1003, 905)
- Thermal return: (1370, 919)
- East bore rescue: (1739, 904)
- Driver underside: (1080, 742)

## Source-static receipts

| Gate | Result |
|---|---:|
| Complete material plane | 2,097,152 IDs |
| Grounded immobile solids | 429354 / 429354 |
| Detached cells | 0 |
| Nonoverlapping, vertically merged rectangles | 6903 / 32768 |
| Actual rectangle construction work | 429354 / 32000000 cells |
| Actual Setup-v2 JSON bytes | 128549 / 1048576 |
| Exact site clearance at 19×15 / 23×19 / 31×27 | 26/26 / 26/26 / 26/26 |
| 31×27 physical core obstruction [1010,327,1111,409] | 25/26 (only Core switching lab intentionally blocked) |
| Whole-plane SHA-256 | `b3f00e8d5a90ee99884437280b6debd01dd5fda256e3a1486997ab62241903f6` |
| Setup SHA-256 | `0620559fcbda2dab4b102f3769164428b9ac1f9f9babb6c32976c14405edaefc` |
| PNG gallery | One 2048×1024 full world + five actual unscaled 1:1 material crops |

`build.cjs` is the deterministic fixed-seed generator, with `node build.cjs --verify` rebuilding and byte-checking `setup.json`, `receipt.json`, all PNG chunks, Node `zlib` decompression and every image pixel against material grid cells. The source generator's exhaustive nonoverlap replay, hull-envelope 4-neighbour BFS, groundedness and obstruction checks pass in the author execution environment. The authored world uses ONLY the accepted catalog's inert Solid/None/immobile IDs 49, 62, 63, 66, 68, 77, 79, 100, 101, 120, 121, 129, 130, 131. No liquids, sand foundation, fake materials or floating detached fragments.

**Provenance:** repository `techrote/sandmapsreference` from accepted default `main@99a166e7fcae45eb22be1740e9f33f62faccbcc7`; schema/material/Midge authority read-only `techrote/cybersand/main@de109d0131641d6adc8d25bb9ced7ca3d4991105`. Workbench Setup-v2 loader `godot/scripts/workbench_setup.gd` blob `70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9`; material catalog `native/include/cybersand/material.hpp` blob `dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3`; authored Midge hull 4×3 at `godot/authoring/flyers/midge.json` blob `228399e38a0e0ab215b9f48698edce67a7a35799`.

**Installed-bridge admission risk:** accepted source advertises 32,768 rectangles, but an older installed CyberDemoBridge may only admit 4,096. This source requires 6903 and MUST NOT be described as compatible until installed-capability measurement. No matching Godot/Workbench/CyberDemoBridge/Rapier compiled execution here: Midge steering, native collision, simulation, persistence and save/reopen are **NATIVE-UNTESTED**.

**Review gates:** creator-side static tests only, independent Art/Technical/Shepherd exact-head audit requested. Retain OPEN Draft/HOLD. No merge, Ready promotion or owner acceptance.
