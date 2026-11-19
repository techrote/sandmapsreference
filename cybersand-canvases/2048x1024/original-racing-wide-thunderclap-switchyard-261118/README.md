# Thunderclap Switchyard R10 — original sci-fi industrial Midge racing

**OPEN Draft / HOLD · ORIGINAL-NO-REFERENCE · NATIVE-UNTESTED.** This is the existing racing-wide creator-owned original landscape, not a reworked repository image or imported concept art. Exact playable material plane: **2048×1024**, true flat orthographic 2D side elevation.

## Design thesis, routes and Midge scale

An abandoned interplanetary **magnet-rail switchyard** has become a three-altitude Midge time-trial route through five different industrial functions: **Launch/Dispatch**, fractured **Drift Canyon**, opposed-stator **Split-Current Iris**, working-scale **Glassstorm weigh/inspection**, and the eastern **Catch/Brake/Recovery** station. The skyline alternates large air voids with dense, mechanically legible structures. The selected actor is the accepted `midge` flyer, authored 4×3 cell hull, nominal boost multiplier 1.8. The operational stress checks use fully-contained 19×15, 23×19, and 31×27 footprint envelopes, much larger than that hull.

A world cell is one physical material cell; no background painting, perspective decks, fake platforms, copied source image or AI render enters the authored setup. The deliberately wide primary straight is not blocked to force optional routes.

- **Main high-speed line:** Launch (116,445) → Iris west (841,445) → Iris chamber (1037,448) → east conductor (1323,454) → Glassstorm (1506,453) → catch cliff (1826,449) → real finish (1943,446).
- **Upper alternative:** Dispatch bypass (203,329) → Drift high (617,356) → crown crossing and upper collector → eastern main-line rejoin.
- **Real lower slalom alternative:** West dive (443,612) → west undercroft (614,752) → ceiling/floor banks (728,776) and (854,721) → Iris under-transfer (1072,753) → eastern ceiling/floor banks (1338,772), (1520,742) → east tunnel exit (1614,753) → east lift/recovery. This is genuine full-hull geometry, not a decorative lower strip.
- **Inspection branch:** linked lower-route Glassstorm inspection bay **(1500,670)**, with an approach → weighing scale → released exit and a connected descent at x1400–1457, plus optional recovery basin (1883,767).

## R9 → R10 authoring repair · 19 November 2026

Responding to the independent [R9 Shepherd REWORK](https://github.com/techrote/sandmapsreference/pull/17#issuecomment-6998178287), this revision makes the weigh bay read as a **three-stage operating station** rather than isolated instrumentation. Broad occupied-cell infeed colouring on the left, the central calibration rail/scale bed, and a contrasting right-hand exit are mutually distinguishable at normal cell zoom. Visual clutter from scattered tiny signals around the service zone is consolidated into engineering bands.

West dive and east return receive different, large, solid-backed advance/direction cues. Four lower S-course banks gain larger turn-leading surface contrast without adding collision to the existing racing apertures. The east finish gains a **continuous two-sided brake throat** with grounded steel/iron upper and lower lips around the exact centre y≈446, preserving the 31×27 flight envelope. Small disconnected detail is still honestly classified as decorative unless a physical cardinal support can be demonstrated.

**Actual R9→R10 material delta:** 23,005 changed cell IDs (2,131 added occupied, 0 erased, 20,874 recoloured stable solids). The only added collision geometry is at the new finishing catch lips and their grounded mechanical attachment; the entry/turn/bay cues are rematerialisation of already occupied cells.

## Exact functional destinations

All following sites are **exact** centre coordinates from the final setup and receipt. No substitute position, nearest-clear lookup, or waived waypoint radius is used.

| Site | (x, y) |
|---|---|
| Launch cradle | (116, 445) |
| Dispatch roof bypass | (203, 329) |
| Split-canyon high | (617, 356) |
| West dive shaft | (443, 612) |
| West undercroft | (614, 752) |
| Iris west approach | (841, 445) |
| Iris central chamber | (1037, 448) |
| Iris lower transfer | (1072, 753) |
| East conductor | (1323, 454) |
| Glassstorm viaduct | (1506, 453) |
| Weigh inspection bay | (1500, 670) |
| Eastern underpass | (1571, 756) |
| Catch cliff | (1826, 449) |
| Brake finish | (1943, 446) |
| Recovery basin | (1883, 767) |

## Current accepted-source/schema qualification

Read-only engine: [`techrote/cybersand main@de109d0131641d6adc8d25bb9ced7ca3d4991105`](https://github.com/techrote/cybersand/commit/de109d0131641d6adc8d25bb9ced7ca3d4991105). The accepted Setup-v2 source loader admits axes 512–2048 aligned to 64, up to 32,768 edits/rectangles, maximum 1,048,576 UTF-8 JSON bytes, eight actors, and at most min(64×world cells, 32,000,000) replay work visits. The source `CyberDemoBridge.workbench_start_rectangle_capacity()` advertises 32,768 but an absent or older **installed binary can fall back to only 4,096**. Source admission is NOT proof of the installed bridge's capacity.

| Static gate | Exact R10 result |
|---|---|
| Extent and total grid | **2048×1024**, 2,097,152 material cells |
| Nonoverlapping ordered 5-field rectangles | **13,573 / 32,768** |
| Actual setup JSON | **256,611 / 1,048,576 bytes** |
| Painted work visits | **956,090 / 32,000,000** |
| Full-grid edit overlap/replay disagreement | **0 / 0** |
| Exact named sites reachable at 19×15, 23×19, 31×27 | **15/15, 15/15, 15/15** |
| Full straight high-speed lane at y445, 31×27 envelope | **1,828/1,828 legal consecutive centres** |
| Connected 31×27 actor centres | **649,398** |
| Physically blocked central Iris, including finish | **14/15** (central chamber itself intentionally obstructed) |
| Independently confined lower-only 31×27 course | **7/7**, 69,649 legal connected centres |
| Critical lower bank aperture at x1338 | **21 legal centre rows** |
| Grounding of declared critical structural probes | **24/24** |
| Residual physically detached occupied cells | **6,002**, not all claimed load-bearing |
| Committed indexed PNGs, including 1:1 world + 12 district crops | **14/14** decoded and independent pixel parity PASS |
| Godot/installed CyberDemoBridge/Rapier input, ticks, collision and save/reopen | **NATIVE-UNTESTED** |

The entire grid uses only numeric IDs **49, 58, 62, 100, 101, 113, 117, 120, 122, 123, 128**, each an accepted inert, immovable Solid with RuleKernel::None at this source. No powder foundations, water, uncontained fluid, reactive growth, or fabricated material IDs. Decorative signal colours are themselves real static materials and can collide: the major raceway/side-entry clearances are therefore checked against the full physical cell grid.

**Grid SHA-256:** `8b41a991adadfd5a33cc5269b8fc81cf7efadddd84b6a977a4760b88c304e80f`  
**Setup JSON SHA-256:** `98c71171d40b9c5089ae2db24552c49427f5a782ade42117908e1f3fc6ca48bc`

## Reproducible standalone proof and evidence

From this folder with **Node 22**: `node build.cjs --verify` compares a deterministic full-grid rebuild of the Setup-v2 JSON, the qualification receipt and every indexed PNG to the committed bytes. `node verify-independent.cjs` does **not import the builder**. It separately replays all rectangles, validates material enum, full-grid/hash/histogram, compares exact fully-contained 4-neighbour Midge clearance and lower-corridor/blocked-Iris routes, checks grounded support probes, and validates every PNG signature, chunk CRC, IEND, zlib decompression and **each material-index pixel** against the reconstructed grid.

Both commands **passed in the exact-source [Node 22 GitHub Actions qualification](https://github.com/techrote/sandmapsreference/actions/runs/44450837136)** on 19 November 2026. This run also regenerated and committed the exact output assets.

![Whole-world genuine material-cell PNG, 1:1](overview.png)

![Whole-world genuine material-cell review overview, labelled 1:2](overview-review-2x.png)

| Actual committed image | Pixel dimensions | Sample ratio | SHA-256 |
|---|---:|---:|---|
| [overview.png](overview.png) | 2048×1024 | 1:1 | `38c1314631ec7085…` |
| [overview-review-2x.png](overview-review-2x.png) | 1024×512 | 1:2 | `e9e0abb8ab93aa70…` |
| [01-launch-cradle.png](01-launch-cradle.png) | 512×384 | 1:1 | `45b862009d682f35…` |
| [02-drift-canyon.png](02-drift-canyon.png) | 512×384 | 1:1 | `a84e4a47155793d9…` |
| [03-split-current-iris.png](03-split-current-iris.png) | 512×384 | 1:1 | `dea9af985175c123…` |
| [04-glassstorm-viaduct.png](04-glassstorm-viaduct.png) | 512×384 | 1:1 | `36f0b290f73f4167…` |
| [05-catch-recovery.png](05-catch-recovery.png) | 512×384 | 1:1 | `9635ffaf4287df59…` |
| [06-lower-s-turn-west.png](06-lower-s-turn-west.png) | 512×384 | 1:1 | `3bf7db44a5a5f3a5…` |
| [07-lower-s-turn-east.png](07-lower-s-turn-east.png) | 512×384 | 1:1 | `d91225fdd298ebb7…` |
| [08-iris-service-braces.png](08-iris-service-braces.png) | 512×384 | 1:1 | `d6c74e739e851161…` |
| [09-west-dive-portal.png](09-west-dive-portal.png) | 512×384 | 1:1 | `5e70985441b53c1c…` |
| [10-east-return-portal.png](10-east-return-portal.png) | 512×384 | 1:1 | `7db5f5f3455eaf52…` |
| [11-weigh-inspection-bay.png](11-weigh-inspection-bay.png) | 512×384 | 1:1 | `2c75b2e49f05925b…` |
| [12-finish-catch-jaws.png](12-finish-catch-jaws.png) | 512×384 | 1:1 | `20fc2dfa38ede049…` |

The 1:2 overview is a nearest sampled presentation of the same physical material plane; it does **not** substitute for the 2048×1024 indexed full overview. Crops are original 1:1 cells, not illustrative paintings or screenshots. All evidence is regenerated from the committed deterministic builder.

## Limitations / owner gate

**NATIVE-UNTESTED**, not native PASS: no source-matched installed Godot/Workbench/CyberDemoBridge/Rapier executable was available in this authoring environment. No actual Workbench import/install, live Midge thrust/boost/braking/collision, sustained solver ticks, true checkpoint timing, camera handling, save, full process restart or reopen was exercised. The static reachability checks prove legal collision envelopes, **not** flyable racing speed or human fun at the requested operating zoom. The installed bridge should be queried for `workbench_start_rectangle_capacity` before import; 13,573 rectangles exceed the older 4,096 fallback.

Self-critical review after R10: the infeed/calibration/exit sequence and twin-jaw finish read more coherently in authentic unscaled crops, but the world remains busy in its densest industrial districts and residual decorative free-standing material remains. An independent exact-HEAD Art/Fidelity and Shepherd decision is still required; do not infer acceptance from source-side static PASS.

**Open Draft / HOLD**. No merge, auto-merge, Ready transition, engine modifications, external reference conversion, or owner approval.
