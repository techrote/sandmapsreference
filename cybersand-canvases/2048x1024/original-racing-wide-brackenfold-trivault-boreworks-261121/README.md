# Brackenfold Tri-Vault Boreworks — original CyberSand racing-wide corpus exemplar

**2026-11-21 • 2048×1024 • 2,097,152 real final material-ID cells • original orthographic perpendicular elevation • DRAFT/HOLD • NATIVE-UNTESTED.** No source/reference image, game runtime or scripted event is used by this submission. Do not merge or promote Ready without owner approval.

## Why this design belongs in the corpus

This industrial mine station is built *inside a dense rock envelope*, with **three unequal excavated cavities** and two **rooted inter-vault bulkheads**. It avoids a recurrent outdoor elevated strip / U-shaped racing tray: the decisive authored grammar is that each adjacent cavity can be connected by **a high outbound bore, a different mid-height bypass, and a low westward return** without making any cavity into an unplayable display enclosure. The western hoist gallery, central split pressure arm, third-vault condenser, east reversal catcher and low-bedrock workshops have physically different working purposes.

The upper departure starts at `(125,312)` and visits each named high gate before the eastern descent, then returns via the deep quarry bore to the finish `(154,735)`. A deliberately separate mid-level branch from the first vault reconnects at the third vault; a real material-cell closure at `[758,267,86,105]` occludes **only** the `North tri-vault throat` among 34 destinations. The branch remains connected at all three conservative Midge bounding boxes. These are **topological and whole-body clearance** proofs, not evidence of high-speed steering, timings, actual collision behaviour or enjoyable race feel.

## Construction and replay

- `build.py` is the sole deterministic authoring source; its fixed seed is `0xB2AC6F21`. It has no source-art dependencies. `python build.py` rebuilds an exact 2,097,152-byte material plane, lossless nonoverlapping vertical run rectangles, a Setup-v2 JSON, genuine indexed `overview.png`, and six real 1:1 district crops.
- `verify.py` independently reconstructs the plane **from committed Setup JSON, without importing the builder**, checks canonical rectangle ordering, SHA-256, material histogram, all solids rooted by 4-neighbour paths to world boundary, no illegal materials, and pixel-perfect palette index parity for every PNG.
- `route_audit.py` separately replays the Setup plane, constructs full-body free-centre components at 19×15, 23×19 and 31×27 using exact 4-neighbour reachability, checks all 34 literal site coordinates and four cardinal approaches, materialises the stated solid gate closure, and checks primary, alternate, blocked-alternate and service legs with **400-cell local XY windows**. The wider 400-cell window is explicitly disclosed: some legs around the rock diaphragms require a substantial route detour; a shorter 240-cell window does not establish those legs. No destination relocation, nearest-site fallback or closure radius exemption occurs in any audit. The bound is not an inference of race speed or track tightness.
- `qualification.json`, `independent-verification.json`, `local-route-qualification.json` and `physical-laws.json` record the hashes, areas, laws and evidence. `exemplar.json` is annotation only, NOT an engine format.

## Validity, exact source, and limits

Read-only CyberSand authority: `main@f7e056c9b8791106e22f2d1c295043783d8a9701` and `godot/scripts/workbench_setup.gd`; reference repository branch source `main@99a166e7fcae45eb22be1740e9f33f62faccbcc7`. The accepted Workbench Setup-v2 source permits **32,768 construction rectangles** (five-word `[x,y,w,h,material]` nonoverlapping cells), one MiB JSON, 512–2048 sides in multiples of 64, and actor model `midge` with the pinned accepted hash. Our materials are dry, deterministic grounded hard-cell types only; **no falling, reactive, fluid or mobile cells** are authored. Several mineral bands and tension support ties are genuine collidable material, not perspective scenery.

**NATIVE-UNTESTED**: No source-matched Godot 4.7 / installed `CyberDemoBridge` / Rapier execution was performed. Actor flight response, collision dynamics, progression, race feel, actual frame timings and fresh-process save/reopen all require native owner-side testing. No downloaded binary or CPU-only BFS can establish those gates.

## Suggested future human or procedural use

Keep the substantial unfinished excavatable pockets intact. Candidate unscripted events are a collapsible upper diaphragm gate, pressure-arm activation, third-vault ambush and lower-floor workshop expansion. No event engine logic or enemy, sensor or race trigger is shipped. All four are geometry affordances, not claims of working gameplay mechanisms.

The same exact HEAD requires independent **Art**, **Technical** and **Shepherd** reviews. Preserve all previous Draft/HOLD map PRs, other creators' branches, accepted engine main and schedules.
