# Keelglass Vertical Twin-Keel Works

**PORTRAIT-001 / DIFFICULT · 1024×2048 actual indexed material-cell world · OPEN Draft/HOLD · NATIVE-UNTESTED**

Source: [Keelglass Twin-Drydock Smeltery #160](https://github.com/techrote/sandmapsreference/pull/160), exact source HEAD `cf47967470e402693957ab04ebfb3fe6d787d943`; source folder `cybersand-canvases/2048x1024/original-industrial-foundry-wide-keelglass-twin-drydock-261121/`. **Source branch and pixels unchanged.** Authored this portrait as a fresh vertical composition, not a rotated, cropped, stretched or spatially transplanted raster.

## Composition and playable route

The left ore/intake terrace and entered inspection window occupy the top-left, dual sealed arc-furnace hearths the top-right, and an exposed shaft-facing travelling ladle drives production toward a distinct right-hand caster bay. Drydock A and its nearly continuous hull keel descend into the west strata. Dock B is a different broken-backed ship cradle on the lower east wall. A fully sealed left quench tank and east export/gantry complete the process at the bottom. Two separate high/low side openings connect the **right-hand dock maintenance return**, leaving the central lift recoverable during an obstruction. Deliberate spare cavities are authoring affordances, not a source-fidelity failure.

Spawn `West entry spawn (517,132)`; endpoint `East rim goal (690,1865)`. 3 conservative literal-centre whole-hull checks: `19×15: 18/18 · 23×19: 18/18 · 31×27: 18/18`. A *real obstructing material rectangle* `[391,1160,256,87]` produces 1906 → 1976 31×27 four-neighbour steps; all 18 sites remain reachable. No nearest-anchor substitution or site radius waiver.

## Evidence

- Exact row-major plane SHA-256: `7d8775ba992138e8cfe3075a4d54a1607037e110da4a4a4bf6e53b7b1aa99345`; Setup-v2 SHA-256: `1b8a3bf5f06082589c6321285b5971a8996a76970352d5cb2892cc7773aa7f86`.
- 2,097,152 cells, 750 ordered lossless disjoint five-word rectangles / 32,768 accepted Workbench cap; JSON 15103 bytes / 1 MiB.
- Source-matched read-only accepted engine: `techrote/cybersand/main@69209acaffb34ebe18c45e19290b5976b7fb2c82`. Grounded stationary solids 1076355/1076355, detached 0; provisional unsupported non-final bits discarded 1970.
- Initial sealed Water 12768, Lava 7531, exposed fluid-air faces 0, water-lava contacts 0.
- 1 full native-indexed material overview + **7 unscaled authentic 1:1 district PNG crops**, all decoded and exact-cell parity verified during construction (2999106 pixels). The image bytes come directly from the final material plane; they are not AI images or native runtime screenshots.
- Rebuild using `node build.cjs .`; run `node verify-independent.cjs` for Node crypto, zlib, CRC and Setup replay independent method. No actual Node/Workbench/CyberDemoBridge/Rapier installation test was executed during this connector-only authoring run.

## Source-derived gallery

- [overview.png](./overview.png) — 0, 0, 1024, 2048; 2099836 bytes
- [01-ore-hoist.png](./01-ore-hoist.png) — 76, 159, 346, 320; 111521 bytes
- [02-twin-furnaces.png](./02-twin-furnaces.png) — 624, 290, 344, 392; 135726 bytes
- [03-upper-drydock.png](./03-upper-drydock.png) — 77, 801, 350, 381; 134217 bytes
- [04-casters-and-return.png](./04-casters-and-return.png) — 611, 833, 360, 340; 123221 bytes
- [05-lower-drydock.png](./05-lower-drydock.png) — 618, 1202, 350, 380; 133866 bytes
- [06-quench-maintenance.png](./06-quench-maintenance.png) — 76, 1446, 348, 377; 132059 bytes
- [07-freight-exit.png](./07-freight-exit.png) — 610, 1655, 360, 379; 137305 bytes

Independent Art / Technical / Shepherd exact-HEAD review required. Actual Godot/Workbench/Bridge/Rapier load, Midge dynamics, simulated quench evolution, save and cold reopen are **NATIVE-UNTESTED**. Do not Ready, merge or mark owner-accepted.
