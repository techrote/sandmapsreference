# Ilex-8 — Faultline Retort Lifts

An original 2048×1024 perpendicular 2D material-cell industrial world, not a reference conversion.
Five distinct districts: pressure manifold, offset retorts, tectonic fault-spindle, triple sealed-quench works, uneven exhaust/extraction annex.
Two grounded geological faults frame a negative-space central vertical stage. The incomplete lower floors, disconnected gantry and extra work bays are intentional editing affordances. No functional machinery or scripted event is claimed.

## Exact literal Midge sites

| Site | X | Y |
|---|---:|---:|
| Arrival | 62 | 238 |
| Manifold canopy | 265 | 239 |
| Manifold assay | 268 | 558 |
| Manifold salvage | 265 | 820 |
| Retort overlook | 624 | 240 |
| Retort station | 622 | 605 |
| Retort return | 618 | 816 |
| West fault edge | 817 | 245 |
| Fault recovery | 969 | 819 |
| Spindle overlook | 1095 | 252 |
| Spindle service | 1090 | 635 |
| Quench canopy | 1472 | 246 |
| Quench station | 1494 | 623 |
| Quench recovery | 1501 | 821 |
| Exhaust overlook | 1838 | 245 |
| Exhaust salvage | 1857 | 821 |
| Extraction | 1981 | 243 |

Main: arrival -> manifold canopy -> retort overlook -> spindle overlook -> quench canopy -> exhaust overlook -> extraction. Alternate connections via four full public vertical access shafts, mid-deck entered service areas and dry underdeck recovery.
17/17 sites pass conservative free-centre 4-neighbour BFS at 19×15, 23×19 and 31×27; all 17/17 survive real [926,0,62,355] obstruction at 31×27, with seven forced positive detours. Literal sites are never snapped or exempted.

## Static material and limits

Grid 2048×1024, 2097152 bytes of final material IDs. Seed 2026112108. Grid SHA-256 07c171f92283ad39a3a4a5eda6697b092db580e2531afe3e4238505476c27b57.
Canonical ordered lossless Setup-v2 rectangles 2358/32768; Setup JSON 45382/1048576 bytes; Setup SHA-256 3e38b2c1ac417cf3f2ed153307eb4b3793f7217dbb0d5e0255d46e6ba93b6e18; work cells 508891.
Boundary-grounded inert solids 503753/503753; initial enclosed Water/Lava cells 5138; no initial exposed fluid faces or direct mutual contact.
Read-only CyberSand main f7e056c9b8791106e22f2d1c295043783d8a9701. Sandmapsreference default source 99a166e7fcae45eb22be1740e9f33f62faccbcc7.
Material roles: 58 stable concrete, 100 basalt, 101 obsidian, 117 bare iron, 120 glass block, 3 Water, 8 Lava. No falling sand foundations.
These capsules are unpowered fluid-containing material geometry; no active processing machinery is simulated.

## Authentic image sources

- overview.png: crop [0,0,2048,1024], SHA-256 8fbd16fa3fc65f45defe0a18289fb372a27da6f9c8b53af0507d3575c6482383, 30295 bytes.
- 01-manifold.png: crop [38,308,418,605], SHA-256 9d1a934144de269414626216803d50557c31f77d3acc358bada60aa1c8375450, 7346 bytes.
- 02-retorts.png: crop [471,324,340,596], SHA-256 9144558860eb2bf5325358237d46ce3e473f8a935c21a83642db5714c3f41699, 6697 bytes.
- 03-fault-spindle.png: crop [807,316,510,600], SHA-256 cceb387987fef8f9f5b537055423f3d4bbd9b46f1e2ef810e45d8e0125f3e4e3, 7315 bytes.
- 04-quench.png: crop [1335,320,441,602], SHA-256 c8f17215f43559d11bd16270985f36daaf27a607f158f503b6cc55d4c2b00afc, 6686 bytes.
- 05-exhaust.png: crop [1780,309,257,602], SHA-256 4522db86e98d890cbb85b62438fc302d14c655de5ece27607c8d6d97dbc61439, 5973 bytes.
- 06-recovery.png: crop [707,719,670,205], SHA-256 2ab055fae6ef1416674400ffb3484108a5f704485e3e6ae912f7a27bf1b3f986, 2706 bytes.
All source images are exact-cell indexed PNGs, not AI artwork or native screenshots. The overview and six unscaled district crops are regenerated from the same material plane.
Run `node build.cjs --write` and `node build.cjs --verify` to reproduce and check committed files with Node.js. Machine-readable histogram, site graph, obstruction distances, material and image hashes are in `receipt.json`; descriptive corpus-index V1 information is in `exemplar.json`. A separate PNG decode checked all seven generated files (28 CRCs, DEFLATE/Adler and 3,416,228 pixels) at source-build time.

## HOLD
Creator SOURCE-STATIC PASS only. Independent Art/Tech/Shepherd review pending. Native installed bridge, Godot, Workbench, Rapier, Midge collision and advancement, fluid evolution, real flight performance and save/reopen: NATIVE-UNTESTED. No Ready promotion, merge, acceptance, engine or schedule changes.
