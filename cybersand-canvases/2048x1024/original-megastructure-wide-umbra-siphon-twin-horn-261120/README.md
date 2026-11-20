# The Umbra Siphon — Twin-Horn Air-Reclaim City

**Independent ORIGINAL Sci-Fi Megastructure Wide | 2048 × 1024 real material cells | Draft/HOLD | NATIVE-UNTESTED**

This is a **from-scratch** original CyberSand Midge flight world, **not** a repaint or derived conversion of `sandmapsreference` image files, earlier reference-led canvases, user images or prior original workers' authored geometry. The real playable XY material plane is the single source of truth. `overview.png` is a direct indexed-material representation of all 2,097,152 committed cells, and the five crop PNGs are unscaled indexed-material tiles of that identical grid. No image generation or scenic art has been used.

## Topological thesis and side-elevation architectural language

The suspended city is built under a long jagged atmospheric pressure roof tied into western and eastern vertical geology. It is a **breathing machine turned into a public border city**. A serrated double-horn pressure intake on the west drives gas separation across a central zero-pressure hangar, then membrane polishing and strict security clearance on the east. Passenger courtyards, freight hydraulic workfaces, service manifolds and gated records offices occupy different altitudes around a large navigable undercroft. This is true perpendicular 2D side elevation with **no visible platform tops, perspective construction or decorative fake depth**.

Five non-interchangeable districts:

1. **Lantern Gate** — west arrival, public ticketing, asymmetrical shops and a stair/service return cut into the shoulder. Spawn at `(147,460)`.
2. **First Siphon** — two steep pressure horns and visibly separated mechanical feed, compressor, underfloor condensate and upper vent maintenance. Several enterable workfaces rather than repeating shop pods.
3. **Zero-Pressure Atrium** — an intentional pressure-free flight volume around the roof-hung carriage/counterweight, inspection bridge and mechanically supported central reactor. The lower-mid transfer is a meaningful bypass, not a backdrop.
4. **Mirror Adsorber** — visibly different white/cyan membrane and laboratory banks with upper canopy, lower pipe/return access and open flight-clear workfaces.
5. **Silent Border** — dark security containment, three inspection workpasses, shutter and release stations, service escape and eastern recovery beacon.

All structures, pipes, cables, lighting strips and apparatus are **actual physically solid material cells** (including luminous neon); these are inert visual depictions of mechanisms, **not** claim of functioning reactive industrial machinery. Prescribed liquid/thermal/chemical simulation is deliberately absent so static flight routes remain stable. Uncontrolled powders, fire, Water, Lava and growth are not authored.

## Flight goal, sites and route graph

**Primary gameplay goal:** depart Lantern Gate, inspect the pressure-control and clean-room workfaces, then clear the Silent Border east checkpoint and reach **East recovery beacon `(1935,470)`**; circle back by a second altitude. Midge is authored as the accepted native 4×3 hull, while static route analysis tests conservative inflated fully-contained centre footprints 19×15, 23×19 and 31×27. Functional access is at named **exact** coordinates, never a nearest reachable substitute. All sites correspond to authored intentional airspace.

| Flight stop | Exact cell centre (x,y) |
|---|---|
| Lantern Gate arrival (Midge spawn) | (147,460) |
| Lantern Gate sky counter | (268,276) |
| Lantern Gate lower return | (284,745) |
| First Siphon feed deck | (615,465) |
| First Siphon upper vent | (738,290) |
| First Siphon condensate access | (750,748) |
| Counterweight inspection | (1084,286) |
| Central breath passage | (1063,472) |
| Midspan lower transfer | (1129,749) |
| Mirror Adsorber canopy | (1445,287) |
| Mirror Adsorber membrane service | (1418,458) |
| Mirror Adsorber lower loop | (1513,744) |
| Silent Border scan gallery | (1798,295) |
| Silent Border entry clearing | (1800,468) |
| Silent Border service escape | (1849,738) |
| East recovery beacon (goal) | (1935,470) |

**Route graph:** `Lantern arrival → First Siphon feed → central breath passage → Mirror membrane service → Silent entry → East beacon`; upper branch `Lantern sky counter → Siphon upper vent → counterweight inspection → Adsorber canopy → Border scan gallery`; lower recovery `Lantern lower return ↔ Siphon condensate ↔ Midspan lower transfer ↔ Adsorber lower loop ↔ Silent service escape`. Deliberate chimney slots at `(696..762,488..716)`, `(1104..1171,514..724)` and `(1280..1346,500..729)` preserve 31×27 flight-centre movement through lower machinery. Tall navigation voids and local side gaps reconnect all altitudes; the spatial argument is independently proved on the full grid, not inferred from visible schematics. Where a corridor is a dead end, it leads back to a traversable service loop.

**Stress-case alternative:** physically replace the half-open box `[1017,1158) × [414,533)` in the actual reconstructed grid with `ReinforcedConcrete` #58, making the named Central breath passage unavailable. The other fifteen exact sites remain connected from spawn for all three hull margins, through independent upper/lower routes. This is **static actor-envelope connectivity**, not a flight-dynamics simulation.

## Source identity and schema contract

- CyberSand accepted `main`: `de109d0131641d6adc8d25bb9ced7ca3d4991105` (READ ONLY).
- Workbench Setup-v2 parser `godot/scripts/workbench_setup.gd` Git blob `70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9`.
- Native material catalogue `native/include/cybersand/material.hpp` Git blob `dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3`.
- Standalone new branch parent: `sandmapsreference/main@99a166e7fcae45eb22be1740e9f33f62faccbcc7` (rechecked before publication).
- Native Midge authored 4×3 hull; original accepted Midge actor hash `c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96`.
- Setup-v2 root contains exact version 2 / extent `[2048,1024]` / 14 standard fields, a single Midge actor, no extensions and nonoverlapping ordered `[x,y,width,height,material_id]` rectangle edits.
- Material IDs used are **defined** valid native Solid / immovable / RuleKernel::None, including `BasaltColumns` (#100), `Obsidian` (#101), `ReinforcedConcrete` (#58), Steel, Aluminium, Composite panels and Neon panels. `Stone` (#13) is an active falling powder and is **never** used as rock. Material color palette for PNGs is taken from exact accepted native descriptors, with PNG material-index pixels authoritative over rendered RGB.
- 1 MiB JSON limit, 32,768 source rectangle cap, and 32M paint-work cells are checked separately. The **installed native CyberDemoBridge may report only 4,096 rectangles**, so the 10,885-rectangle map is **not** claimed installed-compatible.

## Static qualification (reproducible, genuinely independent replay)

| Test | Exact result |
|---|---:|
| World extent / serialized cells | **2048×1024 / 2,097,152** |
| Losslessly coalesced nonoverlapping rectangle edits | **10,885 / 32,768** |
| UTF-8 Setup-v2 JSON | **206,434 / 1,048,576 bytes** |
| Stable nonempty cells / source work | **930,089 / 32,000,000** |
| Final detached inert solids | **0** (single boundary-connected component) |
| Exact named airspace at 19×15, 23×19, 31×27 | **16/16 per envelope** |
| Same, with central corridor physically obstructed | **15/15 other exact sites per envelope** |
| Full-cell material replay and all-ID histogram | **PASS**, independent replay |
| Six genuine indexed-material PNGs | **6/6 CRC, zlib, IEND and exact material-ID pixel parity PASS** |
| Installed Godot / CyberDemoBridge / Rapier / persistence | **NATIVE-UNTESTED** |

`receipt.json` is the creator receipt. `independent_verification.json` records a **second Python process** which does not import the builder and reconstructs all 2,097,152 cells, checks hashes, edit bounds, material IDs, four-neighbour structural grounding, exact-centre BFS with **no target shifting**, the real obstruction, and every decompressed PNG material pixel.

**Grid SHA-256** `5f1c0dd0463e05633ce318705d03d1b7f494ff050b02bbeb228258dfd9a850bf`  
**Setup-v2 SHA-256** `c07e3f7d7144c255fc64f8a16423ed69ab2e7d093248ecfe4b077b224a899595`

## Reproduction / owner test

Run `python build.py` in this directory (requires Python 3, `numpy`, `scipy`, `Pillow`); the fixed seed is `0x5E7104`. The builder authors the complete material grid in memory, prunes unsupported **cosmetic** fragments before final serialization, writes Setup-v2 JSON and all six genuine indexed material PNGs and creator receipt. The temporary `grid-local.bin` is **deliberately excluded** from Git: it can be deterministically reconstructed from the committed Setup JSON. Run `python independent_verify.py` afterward; no builder functions are imported. Do not treat a static PASS as native acceptance.

For Windows owner evaluation: verify your **installed** CyberDemoBridge capability is >=10,885 rectangles before attempting import; a fallback older bridge may report 4,096. From the current compatible CyberSand Workbench, import/load the supplied `setup-umbra-siphon.json`, confirm exact extent and actual material cells, possess/control Midge at `(147,460)`, fly main, upper and lower routes, exercise collision and native simulation progression, then save and reload in a **fresh process** and compare materials and actor state. Preserve the executable/DLL hash and Godot version in the native receipt. None of these native paths have been executed by the creator environment.

## Independent review gates and HOLD

The source-static and pixel-parity checks above passed, but independent exact-HEAD artistic, technical and Shepherd review is outstanding. Structural support check is cardinal component/bedrock connectivity, **not** a structural stress solver. Apparatus/luminous features occupy physical material and may be collision hazards at a zoom smaller than the conservative 31×27 envelope; static testing proves reachability of specified sites, not hand-feel in native Rapier. The 4,096/32,768 installed bridge discrepancy remains a concrete integration risk. **Draft/HOLD**, no Ready/merge/auto-merge, no owner acceptance.
