# The Cobalt Ventricle — Split-Barrage Valve City

Genuinely new original **2048×1024** CyberSand material-ID world. No source-image conversions, AI pictures, or simulated native screenshots. Exact orthographic side elevation.

## Topological thesis
Two massive **opposed diagonal dry floodgate blades**, with separate grounded load paths, concentrate into a wide open **decompression ventricle**. Unlike a reflector/dish, this is an engineered dry *basin* with human-sized inspection chambers and accessible release controls. West Inlet Commune, West Pulse Gate industrial manifold, Central Dry Ventricle, East Governor House, and Egress Freight Town have distinguishable entered workfaces and editable service pockets. Three altitude bands support main travel, high-air detour and lower recovery. Floor-rooted, stable inert materials only. No actual water or event scripts.

## Fixed gameplay sites
Spawn **West inlet Midge spawn** `(70,583)`; goal **East daylight departure** `(1970,641)`. All 19 literal sites are in receipt.json and are tested at complete Midge clearances 19×15, 23×19 and 31×27 via exact 4-neighbour free-centre flood fill; no site is shifted. Center datum [1027,530] is blocked by the test-only physical solid rectangle [991,510,82,61], leaving 18/19 reachable exact centres and both higher/lower clearance regions. No gameplay event is yet scripted.

## Static construction receipt
- Real material grid: 2097152 bytes, SHA-256 `e76f280ee631d604c037f307bfafedbd2dad23d198133f4a7084c9848a2ee803`.
- Setup-v2 JSON: 59904 bytes, SHA-256 `e374e46204efa1bef3d6f0c87cfad87a538aaff0c313c2ed30abf8283d8a3c12`.
- Lossless row-run/coalesced nonoverlapping rectangles: 3229 / 32768; paint work 497202 cells.
- All final occupied material cells are boundary-rooted inert Solid/None; 31852 provisional detached deco cells removed before serialization. No sand, liquid, gas, chemical or reactive cells.
- Palette PNG indices are actual committed material IDs; overview and five 1:1 literal coordinate crops are generated directly from the same final grid.

## Reproduction
Run `node build.cjs` in this directory (Node.js 20+; no npm packages). Run `python independent_verify.py` (numpy/scipy/Pillow) for second-method reconstructed grid, material pixel and route tests. The generator emits exact Setup, receipts, corpus metadata and gallery PNGs deterministically.

**NATIVE-UNTESTED:** no actual compatible Windows Godot/Workbench/CyberDemoBridge/Rapier import, collision ticks, Midge movement or save/cold-reopen was observed. Independent Art/Tech/Shepherd reviewer qualification pending. Keep Draft/HOLD, never owner accepted or Ready/merged automatically.
