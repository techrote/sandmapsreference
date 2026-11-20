# Aureole Delta — Xenolens Excursion Array

**Original non-reference CyberSand landscape, 2048×1024 physical material cells.** Independently designed from scratch in strictly flat perpendicular side elevation; unrelated to existing Morrow Array and Peregrine Cleft levels. All visual evidence is generated from the same physical material-ID grid imported by Workbench.

## Narrative and physical districts

Aureole Delta is a remote xenogeological survey station built around a cracked alien optical array. Two enormous open crescent lens components sit in a pumice basin. Wide clear flightspace separates a western inhabited settlement and asymmetrical polar observatory from eastern quarantine, freight and thermal work facilities. A lower bored geological return offers Midge a recoverable path beneath the open ring.

- **West service settlement:** nursery cultivation/sampling bench, rover lift and wheel cradle, arrival shelf, technical bay and deep west access shaft.
- **Survey observatory:** elevated polar dome and optics mast, operator polarimeter, spectroscopy workstations, archival specimen level, three open traversable decks.
- **Xenolens:** physically braced broken concentric crescents, radial facet joints, suspended diagnostic workroom and under-ring maintenance shelf with broad lateral air gates.
- **East quarantine refinery:** decontamination scrubber, staged handoff, freight hoist, separate thermal coil and cargo press, cliffside emergency recovery.
- **Deep geological return:** fully excavated interlinked bore, west/east vent elevators, mineral assay, xenocore probe, drill station and raised structural maintenance stringer.

## Exact destination route graph

**Primary:** West arrivals (456,510) → survey nursery (245,466) → observatory crown (662,282) → optical polarimeter (633,353) → spectroscopy lab (696,518) → lens west access (963,464) → xenolens diagnostics (1144,476) → lens east access (1307,463) → east quarantine (1549,475) → scrubber lock (1597,519) → east cargo (1744,691).

**Alternate:** West vent (345,851) → west bore elevator (350,919) → mineral assay (792,902) → xenocore probe (1098,901) → deep bore drill (1281,925) → east vent recovery (1670,920) → thermal recycler (1612,662). Vertical upper flight recovery (1137,107), lens sky rendezvous (1140,302) and lower inspection (1149,790) allow additional routes and recovery.

The complete 25 exact named coordinate pairs are in `receipt.json`. All 25 are 4-connected from exact Midge spawn at 19×15, 23×19 and 31×27 fully in-bounds hulls, without any nearest-site substitution or radius waiver. Blocking the real cells in [1082,446,1208,516] makes only the intentionally obstructed diagnostics destination inaccessible (24/25 still reachable).

## Technical reproducibility

The deterministic no-source geometry builder is `build.cjs`, fixed seed `0x26A120`. It builds exactly 2,097,152 material-ID cells, encodes nonoverlapping maximal vertically coalesced row-run rectangles, exhaustively replays them, and validates connected support and exact 4-neighbour hull reachability. Then it serializes a genuine 14-key Workbench Setup-v2 `setup.json`, `receipt.json`, a complete genuine indexed-material `overview.png`, and five actual unscaled 1:1 PNG district crops. Each palette index equals the material ID for the corresponding raw cell; no AI concept image or fake native screenshot is used.

Run `node build.cjs --verify` from the map folder to independently compare generated files to the committed bytes. Node additionally cross-checks SHA-256 with crypto, checks PNG chunk CRCs, decodes PNGs with zlib, and compares every actual material pixel against the original grid. Run `node build.cjs` to regenerate.

Accepted CyberSand `main` consulted **read-only**: `de109d0131641d6adc8d25bb9ced7ca3d4991105`. `sandmapsreference/main` at branch creation: `99a166e7fcae45eb22be1740e9f33f62faccbcc7`. Current known static inert IDs: 49, 62, 63, 66, 68, 77, 79, 100, 101, 120, 121, 129, 130, 131. No mobile powder/fluids, unstable unsupported floating decorative material or invented material ID. Rectangle source cap 32,768; JSON cap 1 MiB; work cap 32M material cells. Old installed CyberDemoBridge may only expose 4,096, so **native admission requires installed capacity measurement**. Actual Godot/Midge/Rapier collisions, progression and fresh-process persistence are **NATIVE-UNTESTED**.

**Creator-only static qualification. OPEN Draft/HOLD.** Independent exact-HEAD Art / Technical / Shepherd reviews and compatible native qualification are outstanding; never merge, Ready or claim owner acceptance.
