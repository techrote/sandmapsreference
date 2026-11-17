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
- **Original bitmap was not decoded in this run** because the available GitHub binary read endpoint did not expose its pixels. The map was designed using the catalogue's detailed visual description, source caption and tags. It is **not** claimed as a verified side-by-side pixel-faithful adaptation.

## Playable 2D translation
The reference's towering vertical vehicle, cliff-cut hangar, massive overhead gantry, asymmetric engineering districts and continuous underground route are converted into actual cellular world geometry. A cold, stationary multi-stage rocket dominates a central high-bay. Painted-steel fabrication galleries, amber safety rails, a motorless hook and crane, blue-lit control banks, five-storey engineering wings, a lower maintenance undercroft and a sidecut basalt cliff form a navigable level.

The center is a real **empty-cell flying void**; the rocket, balconies, side rooms, cabling, control panels, signs, retaining walls and rock are actual CyberSand materials. There is no background PNG or isometric scene. All visual lights are solid color IDs, not simulated lighting; the rocket does not ignite. The current Midge model is selected.

The engineering and source reference were recomposed into a square canvas rather than stretching the 3:2 artwork. Passage clearances, actual portal cuts through lift-guide walls, and uninterrupted lower transit were repaired after the first structural review. The final screenshot is regenerated from the corrected material plane.

## Artifacts
- `setup-works-0023-cliffcut-rocket-hall.json`: **playable file** — generated-start v1 wrapper with actual Workbench version-2 starting setup; not an arbitrary scene manifest.
- `preview.png`: **entire** 2048×2048 authored plane rendered from real material IDs as a legible **512×512, 4:1 downsampled** indexed PNG. This is a diagnostic preview, not copied reference art.
- `build.js`: deterministic, seed 23071; self-contained geometry, physical rectangle packer, full-cell reconstruction verification, 19×15 occupancy-dilation/connected-component proof, and indexed PNG encoder.
- `base-setup.json`, `generated-start-template.json`, `material-palette.json`: frozen authoring inputs from a previously qualified same-engine canvas in this repo, for offline rebuilds.
- `evidence.json`: machine-readable targets, static budget counts, exact source/engine provenance, and remaining qualification gates.

Rebuild with **Node.js 22+** from this folder: `node build.js` (no external packages or network).

## Loading
Copy the `setup-works-0023-cliffcut-rocket-hall.json` file into the running CyberSand Workbench `user://workbench` directory. On the reference Windows installation, this normally resolves under `%APPDATA%\Godot\app_userdata\Cyber Sand Reference Sandbox\workbench\`. Open the generated-start file and install it in the Workbench, then use the selected Midge from **(730,370)**. Fly through the control-gallery floors, both service shafts, around the rocket/boosters, and along the continuous undercroft.

## Static qualification (2026-11-17)
- World extent: **2048×2048** (4,194,304 cells), exact.
- Coalesced edit rectangles: **7464 / 32,768**.
- JSON bytes (ASCII): **147496 / 1,048,576**.
- Exact rectangle-to-cell reconstruction: **4,194,304 / 4,194,304, zero mismatches**.
- Conservative body envelope: **19×15 cells**, full rectangular expansion, no single-pixel shortcut.
- **17/17** named districts/destinations reachable from spawn in one connected component (**1,098,167** safe actor-center positions).
- Dynamic hazards/liquids intentionally omitted: no spontaneous lava, water or reaction can destroy the designed assembly routes.
- File generated and validated with a pure-JavaScript builder on the current available execution environment.

**Not yet qualified:** native Godot/Rapier runtime load, actual simulated physics progression, Midge input/handling, physical Windows 11 NVIDIA evaluation, exact source-image comparison, and Workbench save/reopen. The build proves static schema structure/material equivalence/actor-center geometry, **not** runtime acceptance. This PR must remain Draft/HOLD for Shepherd review and owner acceptance.

Do not merge or mark Ready.
