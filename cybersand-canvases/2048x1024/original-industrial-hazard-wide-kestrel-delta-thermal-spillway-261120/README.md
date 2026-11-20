# Kestrel-Delta Thermal Spillway — original 2048×1024 CyberSand landscape

**Draft/HOLD proposed admission · author-designed side elevation, not a source-art conversion · SOURCE-STATIC CREATOR PASS · NATIVE-UNTESTED.** No Ready, merge, owner acceptance or physics-simulation claims.

## Place, visual grammar, and level design

This entirely original abandoned process plant occupies a damaged, ground-rooted basalt spillway. The x-profile is not a repeated factory wallpaper. Five different installations form a physically legible left-to-right processing sequence:

1. **Drum-shear ore assay** (x75–406): skewed cargo roof, suspended hoist, supported rotary shear cavity, upper inspector berth, independent low refuge.
2. **Stepped thermal smelter** (x461–834): sloping upper blast canopy, **fully enclosed** hot Lava caisson, separately enclosed Water quench cassette, entered metrology workfaces and lower capture channels.
3. **Sacrificial V-spillway** (x858–1230): high open triangular containment throat, asymmetric sloped load members, side-accessible centre, deliberately unobstructed tall negative void and deep dry slag recovery.
4. **Cryo-ribbon reclamation** (x1268–1619): offset support terraces and two sealed Water reservoirs, upper inspection benches, downward-return service opening and unequal gauges.
5. **Inverted plume condenser** (x1655–2015): an elevated symmetric-in-outline but off-centre service funnel with interior extraction braces, sealed Water cassette, separate front-facing worker stations and emergency exit passage.

All load-bearing geometric elements use inert solid material IDs with physical boundary-rooted connectivity. This is a **material-cell representation of process machinery**, not a claim of functioning compressors, pumps, crushers, fire, gases, fluid transfers or dynamic chemistry. The visible fluids begin enclosed in material-wall vessels. Interaction rules after simulation tick zero require native testing.

## Exact actor spawn, checkpoints and route graph

The permanent Midge spawn is **Landing inspection (235,449)**. The primary entered route connects:
Landing inspection → Drum shear observatory → Smelter upper walk → Lava-isolation desk → West throat gate → Cascade throat → East throat gate → Cryo trestle → Coolant survey → Scrubber upper approach → Condensing gallery → Distal safety exit.

Recoverable alternatives connect Smelter lower return, Slag recovery, and Cooling lower return with the upper processing route via physically excavated access passages. The routes are tested through free-centre **four-connected** traversability, not drawn as scenic lines. No site coordinate is shifted to a nearest legal centre.

| Exact named checkpoint | X | Y |
|---|---:|---:|
| Landing inspection | 235 | 449 |
| Drum shear observatory | 369 | 571 |
| Smelter upper walk | 555 | 475 |
| Lava-isolation desk | 720 | 562 |
| West throat gate | 856 | 516 |
| Cascade throat | 1042 | 538 |
| East throat gate | 1148 | 570 |
| Slag recovery | 1072 | 842 |
| Cryo trestle | 1350 | 472 |
| Coolant survey | 1482 | 526 |
| Scrubber upper approach | 1673 | 437 |
| Condensing gallery | 1802 | 506 |
| Distal safety exit | 1952 | 578 |
| Smelter lower return | 761 | 833 |
| Cooling lower return | 1524 | 858 |

For each actor envelope 19×15, 23×19 and 31×27, the original spawn and **all 15 named exact centres** are strictly in-bounds, empty across the full envelope and connected. Total reachable free-centres: 19×15 **1,206,118**, 23×19 **1,164,225**, 31×27 **1,085,979**.

**Forced obstruction scenario:** a real injected inert-solid box at **[1192,420,40,140]** (x,y,w,h). At 31×27 the obstruction preserves **15/15** exact sites but forces genuine extra shortest-path travel: Cascade throat +200; East throat gate +136; Slag recovery +130. This tests static alternate routes, not functional retracting doors.

## Serialized material-plane and proof

- World extent **2048×1024**, exactly **2,097,152 final material-ID cells**, fixed seed **202611203**.
- Source: `geometry.cjs` contains this concept's authored topology, real pixel operations and sites. Generic `build.cjs` provides material-plane serialization, SHA-256, PNG generation and replay/BFS qualification, adapted from the existing accepted creator-side serialization approach; it **does not copy another world's geometry**.
- Complete Setup-v2 **14-field root** and Midge actor manifest in `setup.json`, 45378 bytes, **2402 nonoverlapping ordered five-field rectangles** and **512872 material writes**. Zero overlap, zero invalid/out-of-bounds/material-ID edits and full exact-grid replay mismatch.
- Source grid SHA-256: `ab2440341526b99c32881907ab2a8aa719eeeee589e2bf6c6b83e5529e5ff2f6`.
- Exact serialized Setup UTF-8 SHA-256: `4bfa7f6e32c0ea711c4cd532fad634acdcac50d7723cbdb96de185f4ffec5ca2`.
- Physically grounded non-fluid inert cells: **484207/484207**, detached **0**.
- Final histogram (material ID → number of cells): `0`: 1584280, `3`: 21146, `8`: 7519, `58`: 148930, `62`: 74070, `68`: 35742, `70`: 6722, `76`: 1051, `77`: 689, `79`: 444, `100`: 93132, `101`: 86016, `104`: 9408, `117`: 26873, `120`: 1130.
- Fluids: **21146 Water (ID 3)** and **7519 Lava (ID 8)**, both zero initially exposed faces to air and zero direct Water/Lava cardinal contacts; containers completely ringed by inert supports at initial state.
- Source-advertised limits **32,768 rectangles**, **1 MiB JSON**, **32M work units**. Installed/legacy bridge might accept only about **4,096 rectangles**, presently **UNVERIFIED**. This map is under both numerical rectangle thresholds; a matching installed CyberDemoBridge must still confirm admission.
- Accepted read-only CyberSand authority: `techrote/cybersand@de109d0131641d6adc8d25bb9ced7ca3d4991105`, with material enum/kernel and Setup-v2 actors/loader inspected. Sandmapsreference default base `main@99a166e7fcae45eb22be1740e9f33f62faccbcc7`. Source contract does not prove runtime compatibility.

Regenerate via `node build.cjs --write`, then `node build.cjs --verify`. Verification replays the entire edited grid, cross-checks hashes and histograms, conservative all-centre BFS, a real obstruction, material-groundedness and initially sealed fluids; `--verify` also reads committed binary PNGs using Node zlib and independently checks exact indexed material pixels against this builder's reconstructed source-grid. **Independent Art, Technical and Shepherd reviews remain pending.**

## Authentic material-cell gallery

Every PNG is an 8-bit indexed image, **one pixel = one final source material ID**, and all six district crops are genuine 1:1 extracts, not rescaled images or reference JPEGs.

- `overview.png` — 0, 0, 2048, 1024 source-cell crop; 30503 PNG bytes; SHA-256 24ce546db75157cf0cc8dbfdea5fafcd755d725c33feadb786ddfd0ea2119363
- `01-drum-shear.png` — 40, 265, 395, 565 source-cell crop; 7562 PNG bytes; SHA-256 437dc3b1ea01379f977d512abb2a706de489d7d9f05132fe3ddf1007955bf949
- `02-smelter-cassettes.png` — 418, 285, 425, 620 source-cell crop; 6355 PNG bytes; SHA-256 259fe495c9afab8714c4365ba9371964a326aa850c88a64868502ac36517c422
- `03-spillway-throat.png` — 824, 230, 430, 660 source-cell crop; 7946 PNG bytes; SHA-256 13ada35db8be336318045a694c9259b9a134bd33430affe343adedf649de2296
- `04-cryo-recovery.png` — 1248, 315, 400, 590 source-cell crop; 6314 PNG bytes; SHA-256 c100167350d6999d14147dde24326d75cd55ab9c1b561fdc8ef773f631c05b70
- `05-plume-scrubber.png` — 1630, 205, 410, 690 source-cell crop; 7197 PNG bytes; SHA-256 0f77b6b45f023619aa241155ad484629c9830983ff46cb5523c9fe4aca564219
- `06-lower-culvert.png` — 808, 710, 515, 295 source-cell crop; 3623 PNG bytes; SHA-256 1404e8d3f984f8572dff3eac24d30efbd29a4c284da77e880a4e66a726bf288b

`overview.png` is the full 2048×1024 palette-indexed plane. PNG files are deterministic binary outputs from this very same committed source. An actual PNG viewer successfully decoded the overview and spillway district during the creator inspection. Independent full zlib decoded material parity is provided by the committed `--verify` code path, but external exact-HEAD CI has not yet been observed.

## Mandatory review and native admission HOLD

Keep Draft/HOLD. Request independent same-HEAD Art, Technical and Shepherd assessment of real full-grid/crop scale, entered process functions, 15 exact Midge sites, support grounding, forced detour, initial vessel seals, actual Setup schema and installed-vs-source bridge limits.

**NATIVE-UNTESTED:** no source-matched Godot Workbench, CyberDemoBridge/Rapier actor movement/collisions, ticked fluid/material evolution, material publication, or fresh-process save/reopen was executed. This is a statically proven playable *topology*, not a certified dynamic game-level runtime. The native qualification is downstream and does not block creating further independent original maps.
