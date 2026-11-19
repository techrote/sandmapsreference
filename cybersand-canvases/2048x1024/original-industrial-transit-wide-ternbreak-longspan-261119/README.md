# Ternbreak Longspan — Dry Salt Gorge Intermodal Cableway

**ORIGINAL/NO-REFERENCE · 2048 × 1024 native material cells · fixed seed 20261119 · Draft/HOLD · NATIVE-UNTESTED.** This is a true orthographic side-elevation industrial freight place, not a traced image or playable animation.

## Place and gameplay-scale intent

The Salt Gorge separates a western breakwater repair harbour and ship cradle from the uphill classification complex and an eastern dispatch works. One routed load travels **west quay → crane → suspended cable railway → offset balance tower → gravity split switch → east dispatch**. The dramatic open middle chasm is deliberate traversable negative space; large engineered port supports, rail-truss spans and service shafts divide the level into distinct work districts. The asymmetric vessel and keel have grounded structural cradle attachment, not floating powder.

**Flight network:** Start at **West breakwater ingress (110,457)**. Distinct primary route: Quay manifest (339,456), High cargo inspection (607,454), West transfer ramp (720,458), Cable-span centre (1024,451), Freight balance receiver (1383,459), Sorting control (1601,455), Outbound freight gate (1934,468). The upper inspection alternative includes Quayside crane crown (483,285), Windward bridge cable (835,275), Suspended tally pod (961,360), Balance tower crown (1311,283), East dispatch loft (1898,314). A dry lower return has Western service intake (345,813), Gorge inspection artery (1023,814), Classifier return (1628,815), East recovery (1889,814), with transverse service lift throats. All **21 original precise checkpoint sites** including barge, underbeam, balance service and catch siding retain their fixed coordinates in `receipt.json`.

## Source-of-truth files and proof

- `build.cjs` is the complete deterministic reproducible builder: `node build.cjs` regenerates setup JSON, receipt and **seven genuine indexed-material PNGs**. No reference imagery.
- `setup-ternbreak.json` is the whole **2,097,152-cell** Setup-v2 world encoded as disjoint ordered material rectangles. `receipt.json` stores literal material histogram, SHA-256, byte and work budgets, zero-overlap full replay, final boundary-grounded solid count, conservative 19×15, 23×19, 31×27 exact-centre 4-neighbour clearance BFS, and native-independent material law assumptions.
- `overview.png` and six 1:1 unscaled districts (west quay, cableway, balance tower, gravity classifier, dispatch, service artery) are **actual authored material cells**, not engine captures. Indexed PNG CRC32, Adler32 and every displayed pixel are checked against the identical generated material-ID plane.
- A **genuine added 89×85 obstruction** at x185,y416 changes the 31×27 free-centre West breakwater → Quay manifest route from **230 to 338** steps while retaining **21/21** named sites, proving a physical alternative flight route.
- During groundedness repair, 27,100 genuinely unsupported fragment cells are discarded; the receipt and PNGs describe **the final post-prune world**, not ungrounded source drawings.

## Engine and verification boundary

Accepted read-only CyberSand main: `de109d0131641d6adc8d25bb9ced7ca3d4991105`; recorded Setup-v2 loader blob `70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9`, material catalogue blob `dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3`; source root `99a166e7fcae45eb22be1740e9f33f62faccbcc7`. Only IDs **0 Empty**, **100 Basalt**, **58 Hard wall**, **62 Structural solid**; structural/rock IDs are inert Solid/None, without falling/mobile/reactive cells or fluids. The source Setup-v2 limit is 32,768 rectangles, 1 MiB JSON, and 32M work cells; the **installed** CyberDemoBridge may advertise only a 4,096-rectangle fallback. This map uses 4,457 rectangles and must not be called installed-compatible without measured native capability. The actual native Godot/Workbench/Rapier actor physics, imported saved state and fresh-process re-open are **NATIVE-UNTESTED**.

Do not merge, mark Ready or claim owner acceptance; independent Art/Technical/Shepherd exact-HEAD review is required.
