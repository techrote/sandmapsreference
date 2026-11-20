# Ferric Pendulum — Four Islands on the Roof Catenary

**ORIGINAL 2048×1024 CyberSand true 2D material-cell design corpus exemplar. Creator-static qualification only; Draft/HOLD, native runtime NATIVE-UNTESTED.**

## Thesis and intended use

The east-west carrier cableway suspends four independent settlements at deliberately staggered elevations: Warden public freight reception, Gallows exposed traction workshop, Crosswind switch conductor exchange, and Frost reclamation filters. The fifth functional district is a partially inhabited grounded salvage/repair field. The high suspended settlements and low salvage world are physically different authoring layers, not parallax backdrop. Spaces between islands are usable Midge flight volumes and explicitly valuable expansion seams; preserve these voids for subsequent human editing, GENTEK/SWARM parts and future unscripted chase/bridge/collapse events.

## Gameplay route and scale

Midge spawns at **[113,717]** at the western air arrival gantry, collects a hypothetical freight handover from **Warden exchange [314,524]**, visits **Gallows traction inspection [737,410]**, **Crosswind operator [1202,527]**, **Frost valves [1650,355]**, then reaches **Eastern terminal [1849,762]**. These are distinct physical locations, not engine-internal triggers or currently scripted objectives. Safe alternate path descends below the four pods via the undercroft and salvaging piers, with recovery access through open between-pod shafts. All 19 literal site coordinates are recorded in `receipt.json`.

Pod architectural openings are at least 61 cells in the principal entered galleries. A conservative **31×27** Midge centre footprint is used for static 4-neighbour reachability; 19×15 and 23×19 are additionally checked. Hull movement, thrust, fall, collision resolution and persistence are not native-tested here.

### Deliberate unscripted set-piece / edit targets

- **Gallows rotor service opening** (~737,303): roof-rooted gimbal for a later activation/seizure or GN/KNE-X style derived motif.
- **Crosswind conductor throat** (~1172,520): local breakdown/bridge failure staging above a retained low bypass.
- **Frost reclaim valves** (~1650,355): potential NPC checkpoint or controlled chemical event (no fluid/reactive cells authored).
- **Under-deck repair quarter** (~1632,845): arrival/departure, dialogue, ambush or manually filled module zone; nearby bays intentionally spare.

## Provenance and limits

Accepted CyberSand read-only authority: `techrote/cybersand/main@de58bf1997ca75825cf3b29e046dc1c1022c45bf`; Workbench Setup `godot/scripts/workbench_setup.gd` Git blob `70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9`; native material catalogue `native/include/cybersand/material.hpp` blob `dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3`. Original random/fixed seed: `202611202249`. This builder reads no art reference and no previous map layout. The opaque `liquid_policy` default vector and Midge actor definition mirror the accepted Setup-v2 contract.

Exact material IDs used: **58, 62, 63, 64, 68, 69, 72, 74, 76, 77, 78, 79, 80, 98, 100, 119**, all accepted **Solid, stationary, RuleKernel::None**, zero powders, liquids, gases, dynamic agents, combustion or reactive hazards. Each structure is boundary-grounded; original 4-connected isolated ungrounded debris is removed deterministically, and the final encoded plane contains no unsupported retained material cells. No actual chemical containment, flowing water, moving platforms or NPC scripts are asserted.

Full grid **2048×1024 = 2,097,152** exact bytes/cells; row-major SHA-256: `21c33c991967e7a27e235ba0c3296999825a072f2293116288949ffe95d37165`; complete Setup-v2 SHA-256: `5938892f744c91a32e0152e51a877a96379105c143a1d172768db20bff11670d`. Packed Setup-v2 **60348 bytes**, **3308** legal disjoint rectangle edits / accepted 32,768, **490121** painted cells / 32M paint work. Four-neighbour grounded components: 0 ungrounded retained. 19/19 named sites at 19×15, 23×19, 31×27; obstruction XYWH [914,625,156,154] leaves 18/18 other sites reachable, with deliberately blocked central-passage point correctly refused. Full histogram, exact route report, file SHA-256 receipts, crop windows and work limits in `receipt.json`.

## Reproduce and verify

Python 3 with `numpy`, `Pillow`, `scipy` installed: `python build.py` regenerates all bytes, `python independent_verify.py` separately reads the committed Setup and indexed PNGs, replays all 2,097,152 cells, checks every material, grounding, full-body reachable centre, actual obstruction, full indexed PNG chunks/CRC/zlib/Adler and every material-pixel. The image palette is intentionally colorized for visibility; **indexed pixel values are the exact material IDs**. All five actual 1:1 crops are uncropped from full material data at receipt crop windows.

**Native gate:** Godot/Shared Workbench/CyberDemoBridge/Rapier actor input, real collision/tick progression, save/reopen and source-matched binary identity were not executed. NATIVE-UNTESTED. Current accepted host claims 32,768 rectangles; do not impose obsolete hypothetical 4,096 constraints. Independent Art/Technical/Shepherd exact-HEAD qualification and owner acceptance remain separate HOLD gates.
