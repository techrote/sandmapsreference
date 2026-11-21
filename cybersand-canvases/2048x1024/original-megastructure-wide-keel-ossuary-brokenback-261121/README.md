# Keel Ossuary — Broken-Back Ark Drydock

A newly authored, perpendicular **2048×1024** CyberSand cell world, NOT a historic conversion, AI illustration or imported reference. A broken-backed *entered* generation ark sits on individually sized grounded keel cradles. Two wide daylight damage seams interrupt the hull and provide distinct upper/bilge route transfers across a dry maintenance slip. Overhead masts, port exchange and navigation spire make a recognisable engineering culture rather than a bare background silhouette. Sparse bays and unfinished restoration sites are intentional SWARM/GENTEK and human-edit affordances.

## Five functional districts
West Tug Exchange (public customs, hoist, upper dispatch), Aft Propulsion Slip (extraction jacks and motor servicing), Hollow Keel (hull galleries, bilge, drive datum and roof skylights), Astrograph Spire (navigation/survey), East Salvage Lock (cargo dispatch, lock, freight).

**Spawn:** West tug launch (78,780). **Goal:** Departure eastern daylight (1977,782). Route graph and all 20 exact full-hull navigation sites are in receipt.json. Three distinct 19×15, 23×19 and 31×27 clearances have been verified without target shifting. Test-only [1024,574,74,58] concrete closure covers the drive datum while alternate upper and lower routes remain. No scripted events or fluid are in the initial world.

## Exact setup and evidence
Current accepted engine `main@69209acaffb34ebe18c45e19290b5976b7fb2c82`; schema blob `760268107874198c2323dd590d8c0921692c5ba4`; materials blob `dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3`. Validated static size: 2,097,152 cells; rectangle count 3,770/32768; exact Setup UTF-8 69,866/1,048,576 bytes; work 464,115; all retained occupied materials inert Solid / None; zero mobile or fluid.

Source-grid SHA-256: `e33499bc4b8e6779e28aa04b2fe30f0670cefc8fe3d7574d80740dcaf2a17b2d`. Setup SHA-256: `2b402fed48fd3ce0370de527a2038e91f090297d008dd7133fc730c83897dde0`. Deterministic seed: `202611211056`.

Reproduce: `python build.py` (Python3/Pillow/numpy/scipy) then `python independent_verify.py`. The overview is a genuine one-pixel-per-cell indexed material PNG. Five named exact 1:1 grid crops are produced and checked for pixel parity. `exemplar.json` records actual scene features, controlled corpus axes, deliberately vacant interfaces, and four **UNSCRIPTED** event sites.

**Qualification boundary:** creator-run SOURCE-STATIC only. Independent Art/Technical/Shepherd review and actual compatible Windows Godot/Workbench/CyberDemoBridge/Rapier import, movement, save and cold reopen remain **NATIVE-UNTESTED**. Always leave Draft/HOLD.
