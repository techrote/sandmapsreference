# Ferroveil Twin-Ramp Crucibleworks — original CyberSand 2048×1024 landscape

**AUTHOR ORIGINAL · perpendicular side elevation · creator source-static PASS · DRAFT/HOLD · NATIVE-UNTESTED.**

New independent fixed-seed material-cell construction. No reference/source images, prior map geometry, cloned production modules, generated scenery substitutes or fake native captures. Only this independent folder belongs to the creator branch.

## Immutable authority / exact identities

- Authored from `techrote/sandmapsreference main@99a166e7fcae45eb22be1740e9f33f62faccbcc7` (read-only baseline).
- Read-only accepted CyberSand `techrote/cybersand main@7b03aa437561ec63e31fd09531171360ab60eeb4`.
- Source: `build.cjs` (`node build.cjs` regenerates all Setup, receipts and seven PNGs; `node build.cjs --verify` checks byte equivalence).
- Fixed design seed: `261120191`; complete 2,097,152-material-ID plane SHA-256 `9f18a5af794bec044da59b00dbc0c9ecb1e688b6ce625063f8c97b22d7a423b5`.
- Complete source-static Setup-v2: `setup.json` SHA-256 is recorded in `receipt.json`; **1,937** ordered, disjoint, lossless nonoverlapping rectangles; **36,923 bytes** JSON; **959,835** nonempty construction-cell writes.
- The source 32,768-rectangle ceiling and 1 MiB JSON limit are satisfied. An **installed/legacy 4,096 bridge capacity is still unverified**: 1,937 is below both, but installed-native admission is NOT inferred.

## Real location, manufacturing chain and industrial load paths

A deep-sided cliff foundry with opposed gullwing roof pitches and two steeply inclined heat-shield retorts rather than repetitive rectangular blast furnaces. All roof, process shelf and industrial machinery are perpendicular XY side-elevation material cells. Through-running overhead hoist and side-on castings are *not* tilted camera views.

1. **Dry receiving / weighhouse:** guided side-tip, real railed wagon, protected hopper, weigh window, charge throat and ducted transfer. The plant operates at the material-cell storytelling level; it does not claim animated manufacturing.
2. **Paired inclined retorts:** unequal slanted superstructures, asymmetric charging jackets, refractory-lined and *sealed* molten cores, separate exhaust geometry and joined high collection manifold.
3. **Pivot ladle / ceramic receiving shoe:** two unequal suspended handling systems, supported dry receiver, insulation and offset spout feed the casting station.
4. **Draw-caster fan / shearing:** four separately pitched and sized dies, unlike ejection rams, headstock and a guarded hydraulic shear, laid out for maintenance access.
5. **Sealed stepped quench / freight:** individually dimensioned insulated quench cassettes and an operable-looking side-on export roller gantry.
6. **Undercroft trades:** rooted west return winch, massive lathe/spindle exchange, asymmetric copper-strapping station, four-gauge valve diagnostics, staged filtration and east pump-control workstation. A rooted western shear wall divides the lower level into **two independently accessible maintenance galleries**; do not mistake them for an uninterrupted underground through-route.

Foundations are tied into 104-pixel basalt and 25-pixel structural load transfer at the canvas bottom. Side buttresses ground the upper roof. The west interior tie pier explicitly roots the central production shelf without using a cosmetic detached bridge through the recovery lane. All 949,010 inert solid cells are boundary-connected, 0 detached.

## Exact 1:1 flight and recovery graph

**Goal:** west rail spawn `[91,263]` → ore weighhouse `[382,261]` → first/second retorts `[676,258]`, `[895,259]` → heat exchanger `[760,237]` → pivot ladle `[1088,259]` → pour shoe `[1169,259]` → caster intake `[1260,258]` → drawbed `[1439,259]` → shear `[1606,259]` → quench survey `[1698,259]` → freight goal `[1964,259]`.

**Optional overroof lookout:** `[459,261]`. **West recovery arm:** west shaft `[288,424]` → west ledge `[288,815]` → winch `[141,814]`. **East recovery arm:** east shaft `[1797,424]` → east ledge `[1796,817]` → pump `[1900,816]` → filter `[1488,808]` → valve `[1119,808]` → copper winding `[830,815]` → roll exchange `[491,814]`. The central pier makes the two undercroft arms intentionally separate; cross-plant transit and return use the open upper service spine. Every site is in the actual grid at the stated coordinate.

The independent `receipt.json` stores *all 23 literal named site coordinates*, explicit full-body legal-centre tests and exact four-neighbour connected free-centre BFS at **19×15, 23×19 and 31×27**. Results: **23/23 PASS at every envelope**, no coordinate substitutions, nearest-site snapping, radius exemptions or partial-hull assumptions. The accepted Midge JSON body is 4×3, with these deliberately larger conservative envelopes.

A **real separate-grid obstruction** of material 58 at XYWH **`[1194,200,47,139]`** cuts the direct upper approach between the pour shoe and caster intake. The actual wide-body 31×27 route diverts into the open below-obstacle overhead service void and returns to the casting flight lane. **All 23 exact sites remain reachable** after that obstruction. This tests a meaningful upper-flight bypass without pretending that the two lower galleries constitute a through-tunnel.

## Material law and physics receipt

Allowed accepted native IDs here are empty **0**, contained Water **3**, contained Lava **8**, and stable inert hard-surface supports **58, 62, 65, 66, 68, 69, 72, 76, 77, 79, 100, 104, 117, 131**. These are source-designated solid/nonmoving/None-kernel materials; Water and Lava are *mobile reactive liquid kernels*, not engineering supports. No Sand, Dust, fallers, raw movable Metal, free Lava/Water, invalid ID or unrooted construction.

- Replayed every rectangle in committed order across the full 2,097,152 cells; **0 overlaps, 0 bounds failures, 0 source-grid mismatches**.
- Flood fill from the physical bottom boundary: **949,010 / 949,010 inert solid cells rooted; 0 detached, 0 autobridge repairs**.
- Initially sealed **6,247 Water cells** and **4,578 Lava cells**, **zero initial liquid-to-empty cardinal faces**, **zero direct Water-Lava contacts**.
- Initial containment is NOT proof of evolved fluid behavior; native simulation, thermal reaction, collision and persistence remain NATIVE-UNTESTED.
- Installed bridge capability, actual Rapier/Midge physical flight and collision, progression, save/reopen and source-matched Godot/Workbench loading must be tested downstream with **compatible exact binaries and hashes**; no claim of native acceptance or passing CI.

## Genuine material-cell PNG gallery

All images are indexed-color PNGs, material ID per pixel from the final byte-exact grid, produced by `build.cjs` itself. This is not an artist rendering or screenshot from Godot.

| Image | Exact crop coordinates XYWH | Role |
|---|---|---|
| `overview.png` | `[0,0,2048,1024]` | Entire source material plane |
| `01-ore-tip.png` | `[345,465,245,239]` | Hopper/charge machinery |
| `02-opposed-retorts.png` | `[588,289,406,415]` | Angled sealed furnace pair |
| `03-pivot-ladle.png` | `[977,345,268,359]` | Suspended handling and receiving shoe |
| `04-caster-fan.png` | `[1220,422,430,282]` | Draw-caster fan and shear |
| `05-quench-dispatch.png` | `[1570,450,447,254]` | Quench cells and east rail |
| `06-service-undercroft.png` | `[40,791,1969,103]` | Six service trades and two lower galleries |

The builder verifies PNG signatures, full IHDR and dimension, chunk CRC, zlib Adler32, IEND and complete material-grid pixel parity for all **2,858,014 indexed pixels**, zero mismatches. Every crop is genuinely 1 material cell per PNG pixel with no resampling. The complete large overview is verified locally at generation; external **post-commit** binary-byte and pixel readback must be documented separately, not silently assumed.

## Review / merge gates

Request *fresh independent exact-HEAD Art, Technical and Shepherd* assessments for credible process stages, actor-scale readability, rooted load-bearing geometry, safe material kernels, 23 literal exact sites, real obstructed return and all committed PNGs. Maintain this individual PR **OPEN DRAFT/HOLD** regardless of the backlog and **do not Ready, merge, auto-merge or claim owner acceptance**. Native qualification is a downstream independent gate, never a reason to block independent new original map production.
