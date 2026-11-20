# Catenary Skyhook Shipyard — original 2048×1024 CyberSand racing world

**Status: DRAFT / HOLD — author static preflight only; independent Art/Technical/Shepherd review requested; NATIVE-UNTESTED.**

## What is here

A self-contained, side-elevation science-fiction salvage yard, designed entirely as 2,097,152 actual CyberSand material IDs. No reference-image conversion, illustration, isometric scaffold, or scenic background. The **upper overhead crane line**, **central suspended cutter / dry graving bay**, **lower ballast workfaces**, and **east gravity reversal** create an industrial racing loop with long, intentionally clear Midge sightlines. The strong horizontal negative space is deliberately reserved for speed and recovering a missed gate, not filler scenery.

Five functional districts: (1) west magnetic launch, staffed controls and return-brake jaw; (2) two nonidentical high cable cranes and service hall; (3) central roof-founded skyhook over an accessible U-shaped graving cut; (4) cold-ballast laboratories with original sealed water cassettes; (5) east brake and turning throat. Grounded machine interiors and wide vertical hatches are genuine occupied/empty cells. No scenery masquerades as reachable structure.

## Flight-scale course and original route graph

Spawn **(124,366)**. Main intended sequence: **West Launch → Crane One (578,365) → Crane Two (816,365) → Drylift Upper (1080,365) → Ballast Upper (1510,365) → East Capture (1875,386) → Return Descent (1925,516) → East Lower (1792,652) → Ballast Return (1510,652) → Drydock Return (1138,651) → Crane Return (710,652) → West Return (290,653) → West Brake (120,538) → West Finish (164,366)**. A mid-altitude graving bypass and independently enterable West Control (269,137), Drylift Interior (1084,875) and Ballast Lab (1573,896) are optional exploration choices. The marked crane/cutter hardware is solid overhead geometry, not simulated moving machinery.

Conservative full Midge envelopes 19×15, 23×19, and 31×27 (authored hull 4×3) were independently applied around **exact** declared points, four-neighbour BFS; all 17/17 are connected at each envelope. An additional actual 222×78 concrete gate at [966,328] blocks Drylift Upper; the remaining 16 sites including finish stay reachable at 31×27. The gate is only a **temporary audit obstruction**, not in committed map. A direct unobstructed 31×27 line exists at both y366 and y652 for x112…1924. This proves static **geometric clearance**, not that turning speeds, boost, checkpoint timing, handling or control feel are playable.

## Exact source assumptions and material laws

Read-only engine authority: **techrote/cybersand main `de109d0131641d6adc8d25bb9ced7ca3d4991105`**, including `godot/scripts/workbench_setup.gd`, `native/include/cybersand/material.hpp`, bridge source, Midge authored hash `c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96`. Stable inert `RuleKernel::None` solids: 49 (Slate), 58 (ReinforcedConcrete), 62 (SteelPlate), 100 (BasaltColumns), 101 (Obsidian), 113 (ZincSheet), 117 (BareIron), 120 (GlassBlock), 122 (QuartzCrystal), 123 (UraniumGlass), 128 (PolymerPanel). Fluid ID 3 is Water with a movable kernel: it is statically fully encased, **not** evidence of simulation safety at subsequent ticks. No falling stone/sand, reactive or combustible material is used as structural support.

World/cell scale: full 2048×1024 cells, all hatches and chambers should be inspected at **1:1 pixels with physical Midge dimensions**, not inferred from rescaled promotional art. Every file here is new to this unique concept folder.

## Reproducibility and static qualification

`node build.cjs` regenerates deterministic `setup-catenary-skyhook-shipyard.json`, `qualification.json`, full-world 8-bit indexed material-ID PNG, and five 1:1 windows. `node verify.cjs` independently reopens the **committed** files, checks SHA-256, all ordered edit bounds/nonoverlap, 2,097,152-cell equality with the builder, integer-ID histogram, counts/work, and every PNG's signature, IHDR, palette, CRC, zlib inflate, IEND and **literal material-pixel parity**.

| Static author receipt | Value |
|---|---:|
| Exactly authored cells | 2,097,152 |
| Nonoverlap rectangle edits | 6725 / 32,768 source |
| Setup-v2 JSON bytes | 129046 / 1,048,576 |
| Construction work | 778600 / 32,000,000 |
| SHA-256 final cell grid | `cf48d320ca988d94a61d1672de424f5845d8635c53791343fe67afa84fd81644` |
| SHA-256 setup JSON | `8efe712127be8964cad3229e26a3a941ddd194aea5e1bcf48ec84e7d55b5a3f1` |
| Boundary-disconnected solids | 0 remaining (author cleaned 923 unsupported decorative cells) |
| Initially enclosed water | 9396 cells, 0 water→air edges |
| Exact sites / 31×27 obstruction alternate | 17/17; 16/17 with intentionally occupied upper site |
| Indexed PNGs | Six (world + five true 1:1 crops) |
| Native Workbench / Rapier / save-reopen | **NATIVE-UNTESTED** |

**Grid histogram:** `0`: 1318552, `3`: 9396, `49`: 32040, `58`: 69925, `62`: 60081, `100`: 531948, `101`: 18520, `113`: 17547, `117`: 22348, `120`: 2554, `122`: 5152, `123`: 6810, `128`: 2279.

Source-advertised 32,768 records and 1 MiB do **not** prove the capacity of the installed Windows CyberDemoBridge, which may still accept **4,096**. This map has 6725 edits and is a **bridge-capacity risk** until tested against the precise native DLL and Godot installation. Static pathfinding does not establish vehicle speed, physics, collisions, water evolution, saving, reopening, or runtime tick progression.

**Read-only, independent exact-HEAD Art / Technical / Shepherd assessment remains required. Do not merge, Ready, auto-merge or assert owner acceptance.**
