# Catenary Skyhook Shipyard — original 2048×1024 CyberSand racing world

**R2 status: Draft/HOLD; author source-static qualified; independent exact-R2 Art/Technical/Shepherd reviews required; NATIVE-UNTESTED.**

## What is here

A self-contained, side-elevation science-fiction salvage yard, designed entirely as 2,097,152 actual CyberSand material IDs. No reference-image conversion, illustration, isometric scaffold, or scenic background. The **upper overhead crane line**, **central suspended cutter / dry graving bay**, **lower ballast workfaces**, and **east gravity reversal** create an industrial racing loop with long, intentionally clear Midge sightlines. The strong horizontal negative space is deliberately reserved for speed and recovering a missed gate, not filler scenery.

Five functional districts: (1) west magnetic launch, staffed controls and return-brake jaw; (2) two nonidentical high cable cranes and service hall; (3) central roof-founded skyhook over an accessible U-shaped graving cut; (4) cold-ballast laboratories with original sealed water cassettes; (5) east brake and turning throat. Grounded machine interiors and wide vertical hatches are genuine occupied/empty cells. No scenery masquerades as reachable structure.

## Flight-scale course and original route graph

Spawn **(124,366)**. Main intended sequence: **West Launch → Crane One (578,365) → Crane Two (816,365) → Drylift Upper (1080,365) → Ballast Upper (1510,365) → East Capture (1875,386) → Return Descent (1925,516) → East Lower (1792,652) → Ballast Return (1510,652) → Drydock Return (1138,651) → Crane Return (710,652) → West Return (290,653) → West Brake (120,538) → West Finish (164,366)**. A mid-altitude graving bypass and independently enterable West Control (269,137), Drylift Interior (1084,875) and Ballast Lab (1573,896) are optional exploration choices. The marked crane/cutter hardware is solid overhead geometry, not simulated moving machinery.

Conservative full Midge envelopes 19×15, 23×19, and 31×27 (authored hull 4×3) were author-applied around **exact** declared points, four-neighbour BFS; all 17/17 are connected at each envelope. An additional actual 222×78 concrete gate at [966,328] blocks Drylift Upper; the remaining 16 sites including finish stay reachable at 31×27. The gate is only a **temporary audit obstruction**, not in committed map. A direct unobstructed 31×27 line exists at both y366 and y652 for x112…1924. This proves static **geometric clearance**, not that turning speeds, boost, checkpoint timing, handling or control feel are playable.

## Exact source assumptions and material laws

Read-only engine authority: **techrote/cybersand main `de109d0131641d6adc8d25bb9ced7ca3d4991105`**, including `godot/scripts/workbench_setup.gd`, `native/include/cybersand/material.hpp`, bridge source, Midge authored hash `c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96`. Stable inert `RuleKernel::None` solids: 49 (Slate), 58 (ReinforcedConcrete), 62 (SteelPlate), 100 (BasaltColumns), 101 (Obsidian), 113 (ZincSheet), 117 (BareIron), 120 (GlassBlock), 122 (QuartzCrystal), 123 (UraniumGlass), 128 (PolymerPanel). Fluid ID 3 is Water with a movable kernel: it is statically fully encased, **not** evidence of simulation safety at subsequent ticks. No falling stone/sand, reactive or combustible material is used as structural support.

World/cell scale: full 2048×1024 cells, all hatches and chambers should be inspected at **1:1 pixels with physical Midge dimensions**, not inferred from rescaled promotional art. Every file here is new to this unique concept folder.

## R2 substantive repairs

Independent Shepherd demonstrated that R1's six root keys would fail accepted `Setup.validate()` before named Workbench load. R2 serializes **all 14 ROOT_KEYS** and a nonempty **55-int native-default liquid policy**, generated from the source-pinned liquid capability/catalogue SHA digests and 11 default assignments. `verify.cjs` models the strict accepted parser contract; actual Godot `read_named()` has **NOT been executed**.

Independent Art P1 requested a legible east descent, west finish split and actual docked craft. R2 creates roof/floor-rooted high-contrast east and west return gate frames and a physically grounded asymmetric ship bow, stern and handling saddle. Exact cell delta: **23730** (18690 newly occupied, 5040 recoloured, 0 excavated). The 17 exact Midge sites and both 31×27 flight runs remain static-clear, including 16/17 around the genuinely blocked upper gate. Native high-speed behaviour remains untested.

## Reproducibility and static qualification

`node build.cjs` regenerates deterministic `setup-catenary-skyhook-shipyard.json`, `qualification.json`, full-world 8-bit indexed material-ID PNG, and five 1:1 windows. `node verify.cjs` independently reopens the **committed** files, checks SHA-256, all ordered edit bounds/nonoverlap, 2,097,152-cell equality with the builder, integer-ID histogram, counts/work, and every PNG's signature, IHDR, palette, CRC, zlib inflate, IEND and **literal material-pixel parity**.

| Static author receipt | Value |
|---|---:|
| Exactly authored cells | 2,097,152 |
| Nonoverlap rectangle edits | 7366 / 32,768 source |
| Setup-v2 JSON bytes | 141554 / 1,048,576 |
| Construction work | 797290 / 32,000,000 |
| SHA-256 final cell grid | `4c5a25c358d3a172c71f5079826cd831dc4af7fa4cf31a59e2e03425b06f7e29` |
| SHA-256 setup JSON | `4236af7e673d9db51b6c98d6e28cecb871a8bd47c246983bc47a07ee09c87562` |
| Boundary-disconnected solids | 0 remaining (cleaned 923 fragments) |
| Initially enclosed water | 9396 cells, 0 water→air edges |
| Exact sites / 31×27 obstruction alternate | 17/17; 16/17 with intentionally occupied upper site |
| Indexed PNGs | Six (world + five true 1:1 crops) |
| Native Workbench / Rapier / save-reopen | **NATIVE-UNTESTED** |

**Grid histogram:** `0`: 1299862, `3`: 9396, `49`: 32040, `58`: 67730, `62`: 66561, `100`: 531936, `101`: 18520, `113`: 18262, `117`: 30742, `120`: 2509, `122`: 7757, `123`: 9558, `128`: 2279.

Source-advertised 32,768 records and 1 MiB do **not** prove the capacity of the installed Windows CyberDemoBridge, which may still accept **4,096**. This map has 7366 edits and is a **bridge-capacity risk** until tested against the precise native DLL and Godot installation. Static pathfinding does not establish vehicle speed, physics, collisions, water evolution, saving, reopening, or runtime tick progression.

**Read-only, independent exact-HEAD Art / Technical / Shepherd assessment remains required. Do not merge, Ready, auto-merge or assert owner acceptance.**

### R2 authentic material-index PNG receipts

| Image | x,y,w,h | SHA-256 |
|---|---|---|
| overview.png | 0, 0, 2048, 1024 | `06928a988c474cc52df71ed3cdde7ebc4f791c5931d56088dcdeb859956e30f0` |
| 01-magnetic-launch.png | 48, 32, 470, 515 | `d64b7d831c2147c84c4d65358cc554078736901c4b72fb7836a7feeaf2c34d15` |
| 02-skycrane-canyon.png | 414, 128, 490, 425 | `d55b459aa7d3bdf86685651a6bebd228d981b3ad4d2cd47c376e6e261e411219` |
| 03-skyhook-and-graving-bay.png | 800, 178, 515, 800 | `b9fe9253678634372c5730d648ccf6f6f2a9c9c7e82ec8c8f46084fff999751c` |
| 04-ballast-workshops.png | 1360, 495, 450, 495 | `f0a48b3c9c0d053e89d8ab0838c523f339e21a20b46ec1f8436334af38e5963a` |
| 05-east-reversal-throat.png | 1732, 199, 316, 790 | `b3be8c9d9d48c6b9fce5d9863de2586d8755843308d480001b1cca6d9730ed6e` |
