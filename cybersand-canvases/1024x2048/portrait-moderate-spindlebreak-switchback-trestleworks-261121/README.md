# Spindlebreak Switchback Trestleworks — PORTRAIT-001 · Creator B · MODERATE #2

New orthographic true material-cell portrait 1024×2048, 1:1 physical scale. Read-only donor [Spindlebreak Fault-Cable Smeltery PR #135](https://github.com/techrote/sandmapsreference/pull/135) at exact source HEAD `a3f9962a0107d07bca1116940fde1c825ac76a4f`; original material-cell SHA-256 `0c4f5136ef437bf27f00227f7cea4312b6fff7ff2aa228c1fdab1689043caf69`. The source and all other branches are untouched. Neither its pixel data nor original source geometry were reused.

## Architectural thesis
An uneven geological fault is *folded* into a bank-alternating vertical metalworks rather than extended as another empty straight shaft. Upper-west ore workers, entered cabins and fully sealed furnace feed an east-suspended ladle. A HIGH free-air tension cableway hands off to a physically distinct, load-bearing LOW V-braced truss, each with an engineered flight-sized gap; three unlike lower-left casting rams lead to an enclosed right-bank quench and a separate grounded freight/dispatch quarter. The two crossings' asymmetry teaches a modular SWARM/GENTEK settlement and connector grammar. Spare machine bays, above-bridge gates and freight undercroft are deliberately open for manual iteration and unscripted set pieces.

## Route proof and physics
Literal spawn `[495,148]` at "West rim arrival" → ore, furnace and ladle → cableway → switchback → lower trestle → casting machines → quench → final exact "Exit freight goal" `[508,1953]`. Named sites and exact XY are in `receipt.json`; **21/21 whole-hull four-neighbour reachable at 19×15, 23×19 and 31×27**. Real obstruction `[440,1010,125,67]` between "Switchback crown" and "Lower switchback landing" changes their shortest free-centre 31×27 route **187 to 337** steps (+150), with all 21 sites still reachable and reversible. No radius concessions, nearest-site substitution or targets shifted.

Final material plane **2,097,152 cells**; deterministic seed `202611211531`, grid SHA-256 `30c6668a34341b172d231e4d257175a76b35b314e15dfb468a218d4970c56397`; **1070** ordered nonoverlapping lossless Setup-v2 rectangles (below 32,768 accepted contract); 807881 construction cells, 21244 JSON bytes (below 1MiB). 802694/802694 stationary cells rooted in boundary soil, zero detached after pruning 32544 initial provisional unattached decorative parts; Water 2542, Lava 2645, zero fluid-air faces and Water/Lava boundary contacts.

## Reproducible artifacts
Run `node build.cjs OUTPUT_FOLDER` to reconstruct Setup, receipt, genuine indexed-material full overview and SIX real unscaled 1:1 district PNGs; run `node verify.cjs` for byte-identical builder/Setup/receipt/PNG checks. PNG CRC/Adler and **3518802 source-grid pixels** were checked during generation with zero mismatches. `aspect_transfer.json` specifies exact preserved/transformed/discarded/introduced features and both SHAs; `exemplar.json` specifies eight controlled design axes, four event sockets and evidence-tied space/route grammar.

Current accepted **read-only** CyberSand `main@69209acaffb34ebe18c45e19290b5976b7fb2c82` verified 1024×2048 extent, Setup-v2, material stationary/mobile kernels, 32,768 host rectangle and 1MiB JSON. Corpus base `sandmapsreference/main@99a166e7fcae45eb22be1740e9f33f62faccbcc7`.

**OPEN DRAFT/HOLD — NATIVE-UNTESTED.** This is creator static evidence, not independent Art/Tech/Shepherd, exact-HEAD CI, owner Windows/Godot/Workbench/CyberDemoBridge/Rapier actor advancement, fluid simulation or fresh-process save/reopen proof.
