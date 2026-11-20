# Anvilwake Twin-Dock Electrosmelter R2

**DRAFT / HOLD — original author-designed 2048x1024 source material-cell map. Independent Art/Tech/Shepherd review PENDING; NATIVE-UNTESTED.**

## Functional material-cell repairs

R1 independent Shepherd Art P1 identified weak furnace pickup and ladle-to-drum transfer, and six repetitive low-level equipment pads. R2 physically modifies **56,785 exact material-ID cells**, with **14,715 additions, 9,485 excavations and 32,585 substitutions**. The ore side-tip now has positive receiving gate and supported furnace-entry throat. A continuous refractory-lined transfer channel, isolated nozzle, protected spout and founded receiving shoe join the dry tundish to the first drum. Six entered underplant workplaces are no longer cloned pads: (1) service-return winch with split rail, (2) hydraulic piston strip-down lathe, (3) unequal copper winding reels and spindle drive, (4) multi-cylinder pressure diagnostics and manifold, (5) heavy spindle overhaul lathe and tool-rest, (6) ventilated filter cassette and centrifugal pump/return. All six retain the dry overhead approach corridor and local recovery.

The coherent larger process chain remains: **ore side-tip -> two asymmetric induction hearths -> overhead counterweighted ladle -> paired horizontal continuous-bloom drums -> shear -> isolated water quench -> rail dispatch**. Its upper, overroof and underplant routes remain separate, with two functioning shaft approaches and 21 exact named navigation/checkpoint sites.

## Reproduction and identity

Run `node build.cjs` to regenerate exactly the committed Setup-v2 start, receipt and genuine source material-cell PNG images. Run `node build.cjs --verify` to compare all generated files against their committed bytes. PNG generation is indexed on the **actual 2,097,152-byte material-ID plane**, not a screenshot, reference image or AI illustration. Builder includes lossless ordered rectangle coalescing, exhaustive replay and collision/nav checks.

- Fixed seed: `638656681`
- Read-only CyberSand accepted schema/material/actor authority: `main@7b03aa437561ec63e31fd09531171360ab60eeb4`
- Map parent: `sandmapsreference main@99a166e7fcae45eb22be1740e9f33f62faccbcc7`
- Source-grid SHA-256: `9555efe0d1cdbf7e9db26245a38cbeff9068a34deaf914cdda1a8b590cd8726f`
- Setup SHA-256: `d700d2d708788ed43aa2d9c0560848306c32ed7a4245d0fcf8b40508874a909e`
- Exact grid: `2048x1024 = 2,097,152` cells
- Lossless nonoverlapping ordered rectangles: `2652`
- Setup JSON: `50610` bytes; construction writes: `957364`
- Grounded inert solids: `935121/935121`; detached `0`
- Initial sealed reactive water/lava: `6640/15603`; exposed faces/contacts `0/0`
- Literal Midge site reachability: `21/21 @ 19x15; 21/21 @ 23x19; 21/21 @ 31x27`
- Actual blocked-route alternative: physical obstruction `908,790,48,37`, `21/21` still reachable at 31x27; dispatch detour `+74` steps
- 7 true indexed PNGs, `2952618` pixels verified against material cells (generated outputs)

## Exact route destinations

- Ore arrival / Midge spawn [101,232] — 31x27 shortest cardinal path 0
- Charge gantry [363,231] — 31x27 shortest cardinal path 263
- West recovery shaft [255,396] — 31x27 shortest cardinal path 318
- Left furnace [476,231] — 31x27 shortest cardinal path 376
- Right induction crest [699,233] — 31x27 shortest cardinal path 599
- West transfer inspection [832,231] — 31x27 shortest cardinal path 732
- East counterweight escape [1210,274] — 31x27 shortest cardinal path 3475
- Ladle control gallery [1186,232] — 31x27 shortest cardinal path 3541
- Drum drive gallery [1306,232] — 31x27 shortest cardinal path 3421
- Second drum gallery [1455,232] — 31x27 shortest cardinal path 1744
- Shear booth [1594,233] — 31x27 shortest cardinal path 3132
- Quench surveillance [1741,232] — 31x27 shortest cardinal path 2986
- East elevator shaft [1882,418] — 31x27 shortest cardinal path 2737
- Outbound dispatch goal [1970,232] — 31x27 shortest cardinal path 3011
- West machine cellar [114,810] — 31x27 shortest cardinal path 789
- Piston teardown [440,810] — 31x27 shortest cardinal path 917
- Coil rebuild bay [743,811] — 31x27 shortest cardinal path 1221
- Hydraulics laboratory [1078,810] — 31x27 shortest cardinal path 1555
- Spindle repair shop [1410,810] — 31x27 shortest cardinal path 1887
- Filter and pump cell [1672,810] — 31x27 shortest cardinal path 2149
- East lower landing [1883,809] — 31x27 shortest cardinal path 2359

## Scope and untested conditions

The accepted **source ceiling** is 32,768 Workbench rectangles, 1 MiB JSON, 32M construction writes; an older installed bridge without capability detection may fall back to **4,096 rectangles**. This R2 map is below both counts, but **installed acceptance is not demonstrated**. The Water/Lava containment check is time-zero only; no live fluid solver, Godot, Rapier, Midge controls/collision, cold save/reopen or Windows binary was run. Independent current exact-HEAD Art, Technical and Shepherd review must be requested. Never merge, mark Ready or infer owner acceptance.
