# Thunderclap Switchyard — ORIGINAL high-speed racing-wide CyberSand canvas

> **R5 (18 November 2026) — OPEN Draft / HOLD; NATIVE-UNTESTED; not owner-accepted.**
>
> Entirely original designed-from-scratch material-cell environment. No reference image or artwork was selected, inspected, traced, transformed, or reused. Owned racing-wide creator branch only.

## Design / playable race

A lightning-conductor railway torn apart over a tectonic return valley. Five visually different districts form a fast 2D left-to-right Midge flight course: Launch Cradle, Drift Canyon, Split-Current Iris, Glassstorm Viaduct, and the eastern Braking Claw. Its three altitude bands are a broad main acceleration flight (y around 445), an elevated obstructed-main bypass (y around 174–320), and a grounded undercroft return (y around 752).

True 2D orthographic side elevation. No isometric platforms. Checkpoint chevrons and luminous apparatus are actual inert material cells, **not** working timing triggers.

## R5 physical structural repair

Independent review of prior R4 material cells revealed four large invented “support” claims that did not connect cardinally to any boundary-anchored material. R5 changes **48,029 actual cells** and replaces these unattached motifs with real material-cell load paths:

- **West dispatch + launch apron:** real western boundary attachment and top-overburden stem, without blocking the Midge launch lane.
- **Drift Canyon engineering:** a continuous steel service spine physically joining it to the eastern Glassstorm span, with offset triangular truss bracing in the no-race y635–680 band.
- **Split-Current Iris:** a heavy world-top-supported beam and central hanger support the upper crown, with an oversized **440×79-cell** passable over-crown route below, retaining the 31×27 blocked-main bypass. This is not a fake flight portal or screenshot-only opening.
- **Glassstorm service viaduct:** steel bridge continues to and actually touches the eastern world-boundary rock.
- **Braking Claw:** upper jaw joined to the east massif and lower structure tied to the service span, without obstructing exact finish centre (1943,446).

**Planar-route limitation:** the physically continuous service spine at y635 crosses the former open central iris dive. The eastern and western descent/return connections remain, but the centre shaft cannot be claimed as a straight unobstructed vertical portal through that spine. The exact named *Iris lower transfer* point remains reachable, and bypass tests still pass. This trade-off requires owner physical playtesting, not cosmetic relabelling.

## Actual route graph and named functional airspace centres

| Site | Exact material-cell position |
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
| Eastern underpass | (1571, 756) |
| Catch cliff | (1826, 449) |
| Brake finish | (1943, 446) |
| Recovery basin | (1883, 767) |

Primary speed line: Launch Cradle → west straight → Iris west approach → Iris central chamber → East conductor → Glassstorm → Catch cliff → Brake finish.

Alternate high line: split into the overhead canyon break → pass the supported iris over-crown gallery → rejoin eastern conductor without entering the blocked central iris chamber. A virtual exclusion of actor centres x900–1110/y330–554 leaves **13/14 named points reachable**, including exact finish and recovery; the deliberately excluded Iris central chamber is the sole missing target.

Lower service route: western broad drop shaft → West undercroft → Iris lower transfer → Eastern underpass → Recovery basin. Connected at exact 31×27 stress envelope. The continuous above-tunnel service structure is an actual support, so test vertical entrances and their approaches under native flight dynamics.

## Exact-source and static qualification

| Gate | R5 result |
|---|---|
| CyberSand accepted read-only authority | `018bd09503d7f079ddac52e225c2f7daf8d678bf` |
| Actual Setup-v2 extent | **2048×1024** = 2,097,152 material cells |
| Deterministically compressed ordered non-overlap rectangles | **9329 / 32,768** |
| Setup-v2 JSON | **176,448 / 1,048,576 bytes** |
| All material cells faithfully serialized and replayed | **PASS — 0 overlaps / mismatches** |
| Material IDs | 49, 58, 62, 100, 101, 113, 117, 120, 122, 123, 128; inert immovable Solid, kernel 0 |
| Midge | authored 4×3 rectangle, model definition hash `c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96`; spawn (116,445); 1.8× boost |
| 19×15 exact conservative actor-envelope reach | **14/14** |
| 23×19 exact conservative actor-envelope reach | **14/14** |
| 31×27 exact stress actor-envelope reach | **14/14** |
| 31×27 main-iris-blocked alternate route | **13/14, exact finish PASS** |
| Six actual material-index PNGs, CRC/Adler/IEND and all indexed pixel parity | **PASS, 3,080,192 pixels verified** |
| Boundary-connected physical load probes at six stated sites | **PASS** |
| Installed binary rectangle capacity | **NOT TESTED** — source 32,768; older bridge may expose only 4,096 |
| Native Workbench/Godot/Rapier install, control, collision, simulation, save/reopen | **NATIVE-UNTESTED** |

Material grid SHA-256: `9bd6914d06c5a7ddfde1f24677a3b61a7d6cea6f167daeede4c445dfae125a56`  
Exact Setup JSON SHA-256: `cc734fdd702a5acd4353b333f1fbbc57d416ce344cdf905668989309d868cb1a`

The builder's deterministic `node build.cjs` regenerates the complete Setup-v2 JSON and every genuine material-cell PNG; `node build.cjs --verify` compares them byte-for-byte. Its R5 structural sample check rejects any detached major facility before publishing the generated assets. This run evaluated the same JavaScript builder function in a V8 execution environment and independently re-parsed its PNG chunks; a locally installed native CyberSand binary was not available.

## Evidence gallery

- `overview.png` — full genuine 2048×1024 physical-cell map.
- `01-launch-cradle.png`, `02-drift-canyon.png`, `03-split-current-iris.png`, `04-glassstorm-viaduct.png`, `05-catch-recovery.png` — 512×384 pixel true 1:1 district crops.
- `qualification.json` — exact histograms, checksums, 14 saved site coordinates, actor envelopes, support probes and limitations.
- `build.cjs` — fixed-seed, zero-dependency builder + executable verification.

## Owner/Shepherd gates before acceptance

Reinspect the R5 full composition and five crops, especially the supported canopy, upper iris gallery, long service-deck spans and western/eastern descent approaches. On a source-matched installed Workbench first interrogate `CyberDemoBridge.workbench_start_rectangle_capacity` and verify >= 9329; then load, fly the high/main/lower paths at racing speed, test actual collision and 31×27 recovery routes, bounded physics progression and save/reopen. **No native outcome or owner acceptance is asserted. Do not merge or mark Ready.**
