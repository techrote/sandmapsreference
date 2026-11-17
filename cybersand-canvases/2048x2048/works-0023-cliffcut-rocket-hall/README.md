# Cliff-Cut Rocket Assembly Hall — A-3 Orbital Assembly

**CyberSand Workbench · genuine 2048×2048 material-cell canvas · Draft / HOLD**

## Source identity and scope
- Catalogue public ID: **works-0023**; group `orbital_assembly_hangars`.
- Artwork: [original reference](https://github.com/techrote/sandmapsreference/blob/main/artwork/works_yards/batch1/orbital_assembly_hangars-rocket_assembly_hall-cool_precision.png).
- Original artwork path: `artwork/works_yards/batch1/orbital_assembly_hangars-rocket_assembly_hall-cool_precision.png`.
- Source Git blob SHA: `167c7873e9637cb3930fe7504a0e463cbfe8983e`.
- Catalogue source SHA-256: `033534dc0971a8250f27a7d9a91e60af6230559a872107505f574c33e1420fef`.
- Source key: `batch1/image-0052`; legacy record ID: `image-0052`.
- Source dimensions reported in catalogue: **1536×1024**.
- CyberSand accepted engine/schema authority: [main at 018bd09503d7f079ddac52e225c2f7daf8d678bf](https://github.com/techrote/cybersand/tree/018bd09503d7f079ddac52e225c2f7daf8d678bf).
- **Original PNG not decoded in the historical R1 run.** R2 directly inspected the byte-identical committed original **JPEG preview** and compared it against the true material-grid overview and crops. Pixel-level parity with the untouched full-resolution original PNG is still **UNVERIFIED**.

## Playable 2D translation
The reference's towering vertical vehicle, cliff-cut hangar, massive overhead gantry, asymmetric engineering districts and continuous underground route are converted into actual cellular world geometry. A cold, stationary multi-stage rocket dominates a central high-bay. Painted-steel fabrication galleries, amber safety rails, a motorless hook and crane, blue-lit control banks, five-storey engineering wings, a lower maintenance undercroft and a sidecut basalt cliff form a navigable level.

The center is a real **empty-cell flying void**; the rocket, balconies, side rooms, cabling, control panels, signs, retaining walls and rock are actual CyberSand materials. There is no background PNG or isometric scene. All visual lights are solid color IDs, not simulated lighting; the rocket does not ignite. The current Midge model is selected. All structures remain inert physical cell terrain, not a decorative overlay.

The engineering and source reference were recomposed into a square canvas rather than stretching the 3:2 artwork. Passage clearances, actual portal cuts through lift-guide walls, and uninterrupted lower transit were repaired after the first structural review. The final screenshot and four 1:1 district crops are regenerated from the corrected material plane.

## Reworker B — 17 November 2026 actual-cell repair
This rework differentiates the five western **heavy fabrication programmes** (gantry receiving, plate forming, booster jig, punch press and engine preparation) from the eastern **precision-control programmes** (flight control, vacuum optics, metrology, vibration sensing and payload inspection). Their individual machine envelopes, instrumentation, labels and overhead service ducts now replace generic repeated display banks. The cold centre vehicle gains a nose optical port, staged inspection clamps, avionics/umbilical manifolds and a more legible engine skirt. The undercroft gains rail stock, grounded trolleys, lift machinery and hydraulic servicing; the overhead rail deliberately breaks at both lift exits to preserve Midge access.

The exact original inspection coordinates and their **entire 19×15 envelope** remain clearance-certified: no nearest-position fallback. The west receiving crane suspension was repositioned away from A3 Control Gallery, and a 33-cell-high metrology service aisle keeps the east inspection point connected. There are **17/17 exact reachable markers** and no material reconstruction mismatches. All active materials in the final grid are frozen accepted CyberSand **Solid / immovable / None-kernel** IDs: no dynamic powders, fluids, plants, heat or unsupported pseudo IDs.

This passage records the historical R1 repair; R2 JPEG-preview-led comparison and new cell edits appear below. No native Godot/CyberDemoBridge/Rapier tests were performed: **NATIVE UNTESTED**.

## Artifacts
- `setup-works-0023-cliffcut-rocket-hall.json`: **playable file** — generated-start v1 wrapper with actual Workbench version-2 starting setup; not an arbitrary scene manifest.
- `preview.png`: **entire** 2048×2048 authored plane rendered from real material IDs as a legible **512×512, 4:1 downsampled** indexed PNG. This is a diagnostic preview, not copied reference art.
- `crop-rocket-gantry.png`: 660×720 native-cell crop at (705,285), showing the central vehicle and overhead gantry.
- `crop-west-fabrication.png`: 510×650 native-cell crop at (185,790), showing distinct western fabrication facilities.
- `crop-east-metrology.png`: 510×650 native-cell crop at (1367,790), showing precision/metering laboratories.
- `crop-undercroft.png`: 1490×460 native-cell crop at (280,1580), showing actual lower transfer and lift machinery.
- `build.js`: deterministic, seed 23071; self-contained geometry, physical rectangle packer, full-cell reconstruction verification, 19×15 occupancy-dilation/connected-component proof, and indexed PNG encoder.
- `base-setup.json`, `generated-start-template.json`, `material-palette.json`: frozen authoring inputs from a previously qualified same-engine canvas in this repo, for offline rebuilds.
- `evidence.json`: machine-readable targets, static budget counts, exact source/engine provenance, and remaining qualification gates.

Rebuild with **Node.js 22+** from this folder: `node build.js` (no external packages or network).

## Loading
Copy the `setup-works-0023-cliffcut-rocket-hall.json` file into the running CyberSand Workbench `user://workbench` directory. On the reference Windows installation, this normally resolves under `%APPDATA%\Godot\app_userdata\Cyber Sand Reference Sandbox\workbench\`. Open the generated-start file and install it in the Workbench, then use the selected Midge from **(730,370)**. Fly through the control-gallery floors, both service shafts, around the rocket/boosters, and along the continuous undercroft.

## Historical R1 static qualification (archived; superseded by R2 evidence below)
- World extent: **2048×2048** (4,194,304 cells), exact.
- Coalesced edit rectangles: **10,344 / 32,768**.
- JSON bytes (ASCII): **201600 / 1,048,576**.
- Exact rectangle-to-cell reconstruction: **4,194,304 / 4,194,304, zero mismatches**.
- Conservative body envelope: **19×15 cells**, full rectangular expansion, no single-pixel shortcut.
- **17/17** named districts/destinations reachable from spawn in one connected component (**1,044,221** safe actor-center positions).
- Dynamic hazards/liquids intentionally omitted: no spontaneous lava, water or reaction can destroy the designed assembly routes.
- File generated and validated with a pure-JavaScript builder on the current available execution environment.

**Not yet qualified:** native Godot/Rapier runtime load, actual simulated physics progression, Midge input/handling, physical Windows 11 NVIDIA evaluation, exact source-image comparison, and Workbench save/reopen. The build proves static schema structure/material equivalence/actor-center geometry, **not** runtime acceptance. This PR must remain Draft/HOLD for Shepherd review and owner acceptance.

Do not merge or mark Ready.


## R2 — source-preview-led actual-cell repair, 17 November 2026

**Source personally examined:** committed, byte-identical `source-reference-preview.jpg` from the repository gh-pages branch (Git blob `0b7872f4869c70dd2463f58dda48bfeda0d1e315`). This is the original composition in JPEG-preview form, **not** a generated illustration. It shows a broad blue industrial roof with cross-braced steel, amber travelling cranes/hoists, irregular brown excavated cliff banks, a central silver launch vehicle, the upper-right *cantilevered glazed control pod*, and a lower through-logistics route. The historical 1536×1024 original PNG exists and is unchanged (blob `167c7873e9637cb3930fe7504a0e463cbfe8983e`), but **full-resolution source pixel fidelity is UNVERIFIED**.

**Real terrain changes:** 464,492 final material cells differ from archived R1. The self-contained deterministic `rework-r2-geometry.js` is called after the established builder's hand-authored rooms and rocket rather than replacing them. Changes restore the entire diagonal overhead roof truss, two supported travelling hoist assemblies, asymmetric terraced west rust/basalt and eastern cliff, a projecting blue-glazed upper-right control deck entered through an actual **78×86 clear portal**, large identifiable western booster/mill fixtures, eastern electronic/optical-control bays, and a continuous reinforced lower freight rail with explicit gaps at both lift shafts. Source-composition improvement is substantial but stylized; the existing five-tier room regularity is not completely eliminated. No source artwork, historical PR or engine code changed.

**Exact static qualification:** world **2048×2048** = 4,194,304 final cells; **16,065/32,768** losslessly packed material rectangles; **308,109/1,048,576** generated JSON bytes; exhaustive 4,194,304-cell rectangle reconstruction **zero mismatches**. All 18 nonempty material IDs are found in accepted `techrote/cybersand@018bd09503d7f079ddac52e225c2f7daf8d678bf` native `material.hpp`, with **Solid / immovable / None** physics, no powder rock, unstable growth, active hazard rules, fluids or pseudo IDs. Midge's actual authoring hull is **4×3**; conservative exact **19×15** actor-centre occupancy analysis gives **960,846** connected safe centres and **21/21** named exact points reachable from unchanged spawn **(730,370)**. This includes the original 17 exact sites plus pod interior (1915,440), pod access (1840,443), high-bay hoist (1240,350) and continuous freight passage (1170,1850), **without nearest-point relocation or waivers**.

**Committed true-grid PNG evidence:** `preview.png` shows the full world downsampled 4:1 from actual authored material IDs; seven separately generated **1:1** native-cell districts: `crop-roof-truss.png` (1650×285 at 205,95), `crop-glazed-pod.png` (380×405 at 1668,276), `crop-west-cliff.png` (420×810 at 0,330), and updated `crop-rocket-gantry.png`, `crop-west-fabrication.png`, `crop-east-metrology.png`, `crop-undercroft.png`. All are derived from the same final deterministic cell array as JSON; no concept-art substitution.

**Unqualified / HOLD:** Godot native build/install, bridge's actual 32,768-rectangle admission, runtime collision/input/Rapier, bounded simulation and Workbench save/reopen were **NOT EXECUTED**. A bridge-unavailable 4,096 fallback cannot admit this file; real CyberDemoBridge native runtime is required. Original full-resolution source PNG pixel parity and owner aesthetic/gameplay acceptance remain outstanding. Static Midge clearance does not constitute a native gameplay test. Keep **Draft / HOLD**.
