# Nadir-4 Salt-Quench Exchange — Original Industrial Hazard Landscape

**Original 2048x1024 actual material-cell landscape · perpendicular 2D side elevation · OPEN Draft/HOLD · NATIVE-UNTESTED.** All structures are actual stable construction material cells; water and lava are mobile/reactive and fully contained at initial placement. No external source art, JPEG tracing, AI illustration, fake native rendering or modified CyberSand engine.

## Physical architecture and navigable districts
The Nadir-4 geothermal brine-lift lies against a stepped underground salt fault. **Barge Intake** (west): an asymmetric crane with an open-topped aerial inspection void, dry weigh hall, two low staging levels and cargo rail approaches. **Vacuum Needles** (west-central): unequal-height siphon spires with slanted pressure lines, two different sealed condensate basins, inhabited instrument bay and a prominent open skyline. **Phase-Gate** (east-central): isolated squared thermal chamber with two unequal refractory baffles, sealed lava thermal capsule, dry two-entrance diagnostic room and an unroofed observation route. **Cold Recovery** (east): staggered cooling fins, twin individually enclosed water retorts, dual-purpose service floors and exit isolation bay. Four different silhouettes in one actual terrain plane, no isometric surfaces.

## Routes and exact functional destinations
Primary aerial route: Arrival -> Weigh Hall -> Interchange -> Vacuum Skylane -> Condensate Landing -> Phase Lookout -> Thermal Diagnostic -> Cold Exchange -> Exhaust -> Eastern Extraction. Three substantial open excavation shafts give an alternate lower 66-cell-high, end-to-end **dry undercroft**, with named east/west/central return checkpoints. All centres are the authored, immutable site coordinates below; no near-site substitution. Midge's accepted authored hull is 4x3; all sites and four-neighbour spawn-to-centre flood checked at full 19x15, 23x19 and 31x27 conservative envelopes and under two inserted 52x64 blockages. Static navigation is not a substitute for live Rapier steering.

| Checkpoint | Exact centre (x,y) |
|---|---|
| Arrival aerostat | (80, 420) |
| West weighing hall | (215, 440) |
| Interchange flight lock | (478, 415) |
| Vacuum skylane | (554, 375) |
| Condensate landing | (956, 427) |
| Phase-gate overlook | (1055, 392) |
| Thermal diagnostic | (1473, 423) |
| Cold-water exchange | (1556, 494) |
| Exhaust service apron | (1950, 424) |
| Safe eastern extraction | (1981, 625) |
| West subterranean hatch | (502, 928) |
| Middle pressure undercroft | (1035, 929) |
| East sump return | (1605, 929) |

## Deterministic source and technical receipt
Run `node build.cjs` in this folder to deterministically regenerate Setup-v2 and **all six actual indexed material PNGs** from fixed seed `19042647`; `node build.cjs --verify` compares each generated artifact byte-for-byte. Source occupies exactly 2,097,152 material-ID cells, optimized into 1893 ordered nonoverlapping rectangles (35962 Setup-v2 UTF-8 bytes; source ceilings 32768 rects / 1 MiB). Raw-grid SHA256 `2dbf1ad96683690b0828bd99cd61df17896a235c8d2d15a2305c15b1e4e5e2d1` and literal Setup-v2 SHA256 `dbdfb62d06a2daae0357eb5636d04275479cdbb3e235c319556ae1122d940cbb`. Accepted read-only CyberSand main `de109d0131641d6adc8d25bb9ced7ca3d4991105`; sandmapsreference main base `99a166e7fcae45eb22be1740e9f33f62faccbcc7`. See `receipt.json` for complete material histogram, full-cell replay, exact route centres, obstructed-path checks, anchored solids, initial mobile fluid contacts, image dimensions and pixel parity.

Valid stable/inert structural material IDs are 58,62,63,66,68,70,76,77,79,100,104,117,120,123; mobile Water ID3 and mobile/reactive Lava ID8 are separately enclosed and not load-bearing. No floating structural pieces remain: rooted-steel supports are real built cells. There are no fluid-to-empty cardinal contact faces at time zero, nor water-to-lava adjacent faces; this **does not** prove future containment during simulation.

## Authentic raster evidence
[Full 2048x1024 world](./overview.png) plus true 1:1 material crops [barge](./barge.png), [vacuum](./vacuum.png), [thermal](./thermal.png), [cold](./cold.png) and [subgrade](./subgrade.png). Each PNG is indexed with real material IDs as its pixel values; checked 3524427 decoded material indices against the complete grid with zero differences, verified chunks and CRC. No source JPEG or visual concept image was used.

## Draft / HOLD gates
**NATIVE-UNTESTED:** installed CyberDemoBridge rectangle admission/version (source advertises 32768, legacy binary may enforce 4096), native Workbench import, Midge thrust and collision, active Water/Lava settling and containment, Rapier and save/reopen. No independent Art/Technical/Shepherd assessment of this HEAD yet; do not merge or promote Ready. Material geometry represents apparatus without simulated industrial process control.
