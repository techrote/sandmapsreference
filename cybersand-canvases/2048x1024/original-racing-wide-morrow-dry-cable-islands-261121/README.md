# Morrow Dry Cable Islands — original CyberSand racing-wide landscape

**OPEN DRAFT / HOLD** source-static candidate; **NATIVE-UNTESTED**. No reference-art conversion, AI-generated source image, native screenshot, or gameplay speed claim.

## Reproduce

Run `node make.cjs` (Node 18+) in this directory to rebuild the complete **2048×1024 final material-ID grid**, compact Setup-v2 JSON, six genuine unscaled 1:1 district crops, true full-grid indexed material overview, checkpoint graph and qualification receipt. Source is `core.js`; `png.js` is a small library-free indexed PNG encoder. Generator seed `0x4d4f5252` is fixed, no random material deposition. Then run `python verify.py` and `python route_audit.py` with NumPy, Pillow and SciPy. These re-read the committed JSON independently, without importing the authoring core, and verify actual crop pixels.

Read-only engine authority `techrote/cybersand` main at `f7e056c9b8791106e22f2d1c295043783d8a9701`; reference base `techrote/sandmapsreference` main at `99a166e7fcae45eb22be1740e9f33f62faccbcc7`. No engine code changed. Setup-v2 includes the 14 required fields, a literal Midge spawn, 55-integer liquid policy, 32,768 rectangle contract and 1 MiB JSON budget.

## Spatial thesis

Three differentiated inhabitated industrial cable islands tied to a boundary-rooted span; a distinctive mid-air tension bridge, open under-slung freight basin and a separate full-width lower return. The left receiving quay carries a split A frame and enterable signal cockpit. The asymmetric middle Tern crane island has split winch piers and an inspection pod. The eastern inhabited switchyard has staggered working galleries, empty modular bays and a V-shaped brake catcher. Dry basalt foundation is excavated into two real maintenance repair pockets and a broad empty cistern.

**Primary:** Spawn at western sky quay, traverse seven named upper eastbound checkpoints, pass East horn throat, descend through actual air gap west of the eastern catcher, and fly west along six named lower return checkpoints to the lower west finish. **Alternative:** After East worktown approach, descend earlier and omit East horn throat; the `[1832,240,75,88]` solid obstruction blocks only that primary checkpoint, and all other 26 literal destinations remain accessible. Route order and full material-cell blocked-case evidence are in `route-data.json` and `local-route-qualification.json`.

The exact named sites are intentionally authored material-cell coordinates. An independent verifier rejects blocked centres, clipped hull clearances, and invalid four-cardinal recovery approaches. All 27 sites pass **19×15, 23×19 and 31×27** conservative clearance with whole-grid four-neighbour connectivity. A distinct local rectangular window (205px padding around each route leg, clamped to world bounds) proves **16/16 primary**, **15/15 alternate**, **15/15 obstruction-alternate** legs without point substitution. This verifies static reachability, **not** native steering, speed or lap playability.

## Composition and authoring purpose

The open central dry basin, imperfectly furnished lower repair bays and southeast modular socket are intentionally retained for human art editing, SWARM/GENTEK grammar extraction and unscripted future event scenes. Four proposed event locations are annotated in `exemplar.json`; none are active scripts. Machine-readable controlled diversity axes: `islands`, `dual_level`, `clustered`, `branch_rejoin`, `cableway`, `suspended`, `dry`, `editable_gaps`.

## Static receipt / unresolved gates

Exactly **2,097,152** indexed material cells; **2,654** lossless ordered nonoverlapping XYWH+ID rectangles; **52,173** byte Setup JSON; **315,074** inert occupied construction cells; **315,074 / 315,074** boundary-grounded final structural cells; **0** illegal, falling, liquid or detached cells. Independent full-grid canonical re-encode and seven PNG source-pixel checks pass. SHA-256 and material histogram are in `qualification.json`.

**NATIVE-UNTESTED:** No local source-matched Godot / CyberDemoBridge / Rapier execution, Midge gameplay steering/collisions/advancement, race speed or cold save/reopen. No owner acceptance, merge or Ready promotion. Request independent exact-head Art, Tech and Shepherd review; preserve draft state and any essential P1 findings.
