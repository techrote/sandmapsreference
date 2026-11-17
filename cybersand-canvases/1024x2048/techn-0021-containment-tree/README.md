# Containment Tree — Amber Canopy Biosphere

**DRAFT / HOLD.** Reworker B physical map repair, 17 November 2026. Owner acceptance is not claimed.

## Reference and original source

- Public artwork ID **techn-0021**, source key **batch1/image-0058**.
- Original: [Amber Canopy — Containment Tree](https://github.com/techrote/sandmapsreference/blob/main/artwork/technical_interiors/batch1/amber_canopy_biosphere-containment_tree-biological_dread.png).
- Git blob `b8075c08c4a3cea84a877b036537dea55c87264f`; source-map SHA256 `e4413f50496dfca2b41d141c272779d6d7fc956588d45e741dc08f0b0263f93f`.
- Source binary could not be inspected: the GitHub binary reader rejected direct UTF-8 decoding, while its base64 path returned empty content. **Direct artwork comparison and original dimensions remain UNVERIFIED.** These are source-independent design repairs, not a claim of exact reference parity.

## Actual rework on CyberSand material cells

Reworker B started at commit `1088e49b2537a9c7805b1a5efe263b203141ddc5` and changed **124,091** final terrain/material cells while retaining the original exact **1024×2048** layout and the selected Midge at `[369,95]`.

- Reworked the isolated central-tree fragments into six differentiated root/branch/fan zones: upper canopy, middle vascular lattice, lower fossil/root network, with non-uniform side growth and structural support geometry.
- Visibly framed the five deliberate central traversal portals with contained upper/lower root sheaths and material-cell instrumentation instead of abruptly severed stump edges. These are still **passable**, not decorative solid walls.
- Differentiated all **11 research stations** with architecture tied to each room's purpose: canopy quarantine, spore manifolds, microscope sample trays, resin catchment, root vault, seed nursery, observation gantry, biocore pumps, isolation baffles, lumen buses and return sump.
- Preserved the two parallel vertical flight lanes, exact research entry airspaces, five cross-portals, central specimen hierarchy and stable wall/metal/crystal material semantics.
- No floating image/texture overlay, source PNG embedded as scenery, live Plant, falling Stone powder, Fire, free Water or unsupported pseudo-material IDs.

## Reproduction

Run `node rebuild.cjs --verify` from this directory to compare all committed artifacts (builder, Setup-v2 JSON, overview, 3 native-cell crops, evidence). Run `node rebuild.cjs` to regenerate outputs deterministically. The standalone Node scripts require no npm packages.

Material-grid previews:

![Full authored material plane — 512×1024 downsample](containment-tree-preview.png)

[Upper crown and labs — native 640×640](containment-tree-detail-upper.png) · [Middle vascular processing — native 640×640](containment-tree-detail-middle.png) · [Lower roots and galleries — native 640×640](containment-tree-detail-lower.png)

## Static engineering qualification

| Check | Reworked result |
|---|---|
| Extent | **1024×2048** exact |
| Setup-v2 JSON size | **574,876 / 1,048,576 bytes** |
| Terrain rectangles | **31,408 / 32,768** |
| Full material plane reconstruction | **2,097,152 cells; 0 differences** |
| Conservative 19×15 Midge air-only clearance | **611,228 connected legal centres** |
| Exact named destinations | **17/17** original, directly legal and connected, zero nearest-point substitutes |
| Material IDs | **0, 39, 40, 42, 49, 50, 52, 53, 54, 58, 62, 65, 77, 78, 79, 80, 100, 101, 119, 120, 121, 122, 123, 127** |
| Final cells changed vs base | **124,091** |
| Native CyberDemoBridge/Workbench/Rapier | **NOT EXECUTED** |
| Physical Windows actor/collision/save/reopen | **NOT EXECUTED** |
| Visual source fidelity | **UNVERIFIED** (original bitmap inaccessible) |

The generator reconstructs the entire material grid from edit rectangles, and independently generated full-map and native 1:1 PNG districts are derived from that same final plane. Geometry was reviewed on the actual material PNG. Conservative clearance treats **all non-air** as blocking; a 19×15 envelope is not proof of dynamic native collision/control. The accepted CyberSand source may admit the nominal 32,768-stamp budget, but installed bridge capacity can be lower and must be confirmed during physical evaluation.

## Owner/Shepherd remaining gates

The Shepherd should compare the actual original PNG with these real-cell previews, review the eleven individual lab designs and source-specific morphology, then exercise the exact committed setup in a current Windows Workbench and native bridge (material IDs, Midge definition hash, native rectangle capacity, control/collision, simulation and save/reopen). Keep PR **Draft/HOLD** and do not promote or merge without explicit owner approval.
