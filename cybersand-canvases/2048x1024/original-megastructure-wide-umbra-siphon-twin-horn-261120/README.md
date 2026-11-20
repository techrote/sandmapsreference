# The Umbra Siphon — Twin-Horn Air-Reclaim City (R2)

**Wholly original 2048×1024 orthographic CyberSand material-cell Midge map. OPEN DRAFT/HOLD. AUTHOR STATIC-PASS; independent exact-HEAD art/technical/Shepherd R2 re-review requested; NATIVE-UNTESTED.** No reference images, previous original map geometry or AI art used.

## R2 independent-review repair response

Responds to exact-HEAD 20 Nov 2026 Shepherd P1 and independent Art P1 at prior `a493049fc142f7c0efa283a73c03e36c83512a38`. This is not cosmetic PNG repaint. It alters **45,646** real final material cells (**13,680 added / 8,922 excavated / 23,044 rematerialised**), and every PNG is encoded directly from the R2 final plane.

* **First Siphon:** distinct copper west feed/bearing/rotor versus cyan east compressor, source-rooted dual feed horns, lower condensate separator and visibly accessed diagnostic/vent deck. Original giant twin horn silhouette preserved.
* **Zero-Pressure Atrium:** two asymmetric side-open diagnostic service hatches on the suspended counterweight and an attached pressure-differential instrument; primary central breath volume left open, not filled.
* **Mirror Adsorber:** excavated side-entry cartridge chambers of different shapes, a dedicated instrumented valve/pipe transfer, and lower specimen service/measurement stations rather than identical facade slots.
* **Silent Border:** sequential full-sized detection/examination portals, clearance/shutter operating point and outbound relief cell; four undercroft wagons now receive distinct freight, repair, pressure and recovery workfaces.

Engineering corrections are explicit in `geometry-r2.txt`: a 31×27 fully-contained blocked-route corridor was preserved with 0 constrained material clearances, and all service apparatus is tied to the physical solid structure via micro-tethers rather than left as floating decorations. These are inert material devices, not claims of operating industrial processes.

## Genuine interactive scale, topology and goal

The entire 2048×1024 area is one material collision plane, true orthographic side elevation, no platform tops. Five architecturally divergent districts: western public Lantern Gate; twin-horn First Siphon pressure plant; suspended Zero-Pressure Atrium / carriage inspection; central/eastern Mirror Adsorber industrial polishing laboratory; and Silent Border scan/clearance/freight terminus. The long pressure canopy joins opposite basalt/obsidian geology. Deliberate central negative space and three connected main/upper/low return routes remain legible, not pseudo-3D.

**Goal:** fly Midge from named spawn `(147,460)` through feed-deck `(615,465)`, counterweight inspection `(1084,286)`, membrane service `(1418,458)`, clearance `(1800,468)`, to east recovery beacon `(1935,470)`; upper route visits `(268,276)`, `(738,290)`, `(1445,287)`, `(1798,295)`. Lower loop connects `(284,745)`, `(750,748)`, `(1129,749)`, `(1513,744)`, `(1849,738)`. All **16 exact coordinates** and the full route graph are enumerated in `receipt.json`; each retained 31×27 Midge centre has exact 4-neighbour return, including blocked-midline stress case for all other 15 sites. No snapped destinations or waived margins.

## Source and repeatable exact-cell proof

Accepted READ-ONLY engine `techrote/cybersand@de109d0131641d6adc8d25bb9ced7ca3d4991105`; accepted Setup-v2 parser blob `70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9`; accepted material enum blob `dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3`. All current nonzero IDs are valid inert, nonmovable Solid / RuleKernel::None; no fluids, powders, combustibles or reactive cells. All **934,847** occupied cells boundary-connect to ground, zero unsupported material. Authored Midge 4×3 hash and conservative static envelopes 19×15, 23×19, 31×27 retained.

- Extent **2048×1024 = 2,097,152** material cells, exactly; lossless full-cell ordered replay against 11,681 disjoint canonical rectangles; zero invalid/overlaps, source ceiling 32,768.
- Setup **221,103 bytes**, below 1 MiB; painting **934,847** cells, below 32 million work cap.
- Full-cell SHA-256 `e6523777aec54d1e99254a1d15238096f990c49c499e1abf7d04bdd397ac0739`; Setup JSON SHA-256 `0538ca4c48ca292143478925baabd974cc17b770d57e3d8426856b682feb4c8f`.
- Exact centres pass 16/16 at each envelope, blocked-centre alternative **15/15** (other destinations). Centre component sizes and histogram in receipt.
- Full material-ID overview and five 1:1 indexed PNG crops encoded from same committed material bytes; independently parsed PNG signature, chunk CRC, stored-DEFLATE/zlib Adler, IEND and **every original material-index pixel** during R2 author generation. No screenshot or mock art substituted.

**Reproduce:** Python 3 standard library only: `python build.py` uses exact committed `setup-r1.json`, original seed 0x5E7104, and fully specified `geometry-r2.txt` to regenerate Setup and six indexed PNGs. `build-r1.py` preserves prior original authoring source. `python independent_verify.py` uses numpy/scipy/Pillow to independently reconstruct and test against receipt; it is **not claimed executed on R2** here, so independent verifier and reviewer status remain pending. Images/JSON are not native gameplay tests.

## Qualification separation

**AUTHOR STATIC-PASS only.** Source-side Workbench limit 32,768; installed Windows CyberDemoBridge may advertise only 4,096 rectangles, so **11681** rectangle installation is unverified and should be probed against the owner's actual binary. Godot/Workbench/Midge input, Rapier collisions, tick progression, save and fresh-process reopen: **NATIVE-UNTESTED**. Independent exact-current-HEAD Art / Technical / Shepherd review requested before promotion. This PR remains DRAFT/HOLD, unmerged; no owner acceptance, Ready or auto-merge.
