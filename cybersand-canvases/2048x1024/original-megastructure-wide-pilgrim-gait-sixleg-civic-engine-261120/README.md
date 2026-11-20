# The Pilgrim Gait — Stranded Six-Leg Civic Engine (R3)

**Original wholly authored** 2048×1024 orthographic CyberSand material-cell side elevation. No reference image, historical canvas, prior-map source geometry or AI-rendered pixel evidence. DRAFT/HOLD; not owner-accepted, not native-qualified.

## Architectural and gameplay thesis

A failed planetary cargo walker is converted into a roof-rooted civic city. The six struts connect upper segmented refuge hull, grounded lower foot chassis and two geological shoulders. Four selected legs now exhibit different elbow/knee offset directions, pinned brass/obsidian pivot sockets, exposed copper/cyan piston runs and lower ankle shock collars. The other two retain long suspension profiles; no fake operating animation is implied.

Five inhabited functional districts differ by transaction, scale, and construction language:

1. **Rook Anchorage** (public/freight): original beaked docking canopy, newly differentiated weighed cargo receipt, overhead hoist, pallet classification, nested habitation and lower ballast.
2. **Hydraulic Cloister** (industrial): diagonal load rams, dual distinct pressure/service workfaces, copper/heat-shield instruments and cooling housings, high hoist and sump return.
3. **Gyro Crucible** (mechanical control): exposed eight-spoke ballast wheel, sensor surveillance, real central circulation and down-bypass, no mandatory combat/hazards.
4. **Commons Forum** (civic/library): actually entered asymmetric folio shelving/index terminal, public raised rostrum, independent registry desk, recycling underspaces.
5. **Eastern Relief Terminal** (security/medical/freight): physically sequential quarantine scan/classification/shutter and separate freight containers/crane on the outer mast side.

The material-cell work is static industrial architecture. All occupied materials are accepted inert immovable Solid/RuleKernel::None materials; no staged liquids, powders, fire, reactive substrates, or unsupported floating decoration.

## Objective, scale and topology

Start **Rook berth spawn (136,500)**. Fly to **Pilgrim terminal destination (1934,498)**. Traverse west/east at three physical flight levels: upper y267–324, middle y468–541, lower y713–789. The independent through-rise shafts are x225–277, 605–658, 861–910, 1150–1207, 1414–1462, 1748–1806 and 1870–1915. The main route crosses the lived-in public concourse and gyro datum; the upper way bypasses midline obstruction via western hoist / Commons transfer; the lower underbody flight lane provides an alternative eastbound recovery loop. Dead-end functions are side-entered and reversible. Doors and passages are assessed at exact 19×15, 23×19 and 31×27 Midge envelopes rather than decorative sprite scale.

### Exact unshifted named actor centres

- Rook berth spawn: (136, 500)
- Rook starboard lantern: (320, 294)
- Rook ballast return: (295, 748)
- Piston wrench control: (545, 498)
- Piston high hoist: (692, 297)
- Piston sump bypass: (687, 748)
- Gyro catenary monitor: (912, 294)
- Gyro central datum: (1040, 500)
- Gyro lower service: (1036, 748)
- Commons library mezzanine: (1329, 296)
- Commons public counter: (1375, 499)
- Commons waste descent: (1491, 749)
- East beacon mast: (1733, 296)
- East quarantine wicket: (1838, 498)
- East freight recovery: (1788, 748)
- Pilgrim terminal destination: (1934, 498)

## Technical and reproducible material contract

**Read-only accepted engine:** `techrote/cybersand/main@de109d0131641d6adc8d25bb9ced7ca3d4991105`. Workbench parser `godot/scripts/workbench_setup.gd` blob `70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9`; native `material.hpp` blob `dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3`; Midge actor 4×3 authored hash `c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96`.

**World:** 2048×1024 exactly = 2,097,152 one-byte material-ID cells. Fixed seed 39916038 / `0x2611206`. **Setup JSON** 127553 UTF-8 bytes (cap 1,048,576), **nonoverlapping disjoint canonical merged rectangles** 6827 (source cap 32,768), **paint work** 860737 (cap 32,000,000). All 860737 retained solid cells are boundary-grounded; zero detached final solid cells; generator pruned 52417 residual optional cells across 31 disconnected clusters. Full lossless ordered paint replay equals the source plane at all 2,097,152 cells.

**Grid SHA-256:** `da835ce1e46bab147554bdb03527f83d73a5f86dbc4f5ca14e7c2514408e0f6b`
**Setup SHA-256:** `1900bcbfbaeae76072b7fbf4f36d98962ce319984a7eda380c7414985b52c8a1`

**Exact-centre Midge:** all 16/16 sites reachable from (136,500) with fully in-bounds 19×15, 23×19 and 31×27 envelopes, each using four-neighbour free-centre BFS, no relocation or waived radius. Physically seal `[990,1111)×[465,543)` (121×78) in a separate copy: the intentionally covered Gyro central datum is excluded, and all other **15/15** sites remain reachable at all three envelopes. Quantitative legal/connected centre counts and per-ID histogram in `receipt.json`.

### Real same-plane PNGs

Unscaled 2048×1024 `overview.png` and five authentic cell-resolution source windows:

- 01-rook-anchorage.png: 47,137 at 396×548 actual cells
- 02-hydraulic-cloister.png: 431,155 at 410×581 actual cells
- 03-gyro-crucible.png: 842,144 at 435×663 actual cells
- 04-commons-forum.png: 1242,141 at 406×550 actual cells
- 05-terminal-eastern-spire.png: 1618,130 at 402×578 actual cells

All six PNGs were *generated from the final post-prune byte-exact material plane*. Creator checks validate signature, complete PNG chunk CRCs/IEND, independent fixed-Huffman zlib/DEFLATE decoding, Adler-32, each filter-0 indexed row and **3,296,431 / 3,296,431 actual source material-pixel parity**. `verify-grid.py` supplies a separate Python standard-library independent verifier of saved JSON and PNGs for review.

Run `node build.cjs --write` to regenerate exact Setup and six PNGs, and `node build.cjs --verify` for bytewise reproducibility. Run `python3 verify-grid.py` to replay the committed Setup-v2 and compare actual PNG pixels to committed material. No external photo/AI image acts as evidence.

**Bridge/runtime limitation:** accepted source allows up to **32,768** rectangles but installed CyberDemoBridge capability may fall back to **4,096**, below this map's 6827. Do not truncate cells or assume the installed binary accepts it. Windows Godot/Workbench/CyberDemoBridge/Rapier load, actor movement/collision/tick, persisted save and cold reopen are **NATIVE-UNTESTED**. This is creator/static qualification pending independent Art/Technical/Shepherd exact-HEAD review.

## R3 exact-cell repair and R2 retention

Independent R2 Shepherd and Art P1 found six nominal legs read as plain columns, while Rook/Commons/Eastern facilities repeated schematic rooms. **R3 modifies 31,889 actual cell identities** vs the frozen R2 grid (14,911 added, 4,301 excavated, 12,677 rematerialised). Four different knees/ankles, supported linkages and distinctive entered function modules now materially address the findings while preserving all 16 exact route sites, central gyro, six-leg silhouette and all three bypass levels.

Prior R2 qualification was 6,309 rectangles, 117,987 setup bytes, 850,127 grounded cells and source SHA `8298c548105469c798ff644a36e16a18c85d2979eba5db43a89dc9fd7bfc7644`. R2 is preserved in Git history, but its audit disposition **does not automatically qualify R3**. Reviewer checks must target this new immutable HEAD. Keep Draft/HOLD; never merge, promote Ready or claim owner acceptance.
