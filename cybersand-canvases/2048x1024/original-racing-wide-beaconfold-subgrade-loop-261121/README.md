# Beaconfold Subgrade Loop — original racing-wide corpus exemplar

This is a new, fully authored **2048×1024 true orthographic XY material-cell** world, not a reproduction of reference art. It is an industrial beacon district constructed from four different ground-rooted tower/mast families, entered signal/control interiors, two open flight shafts, and a long, genuinely excavated underground express line. Empty bays are intentionally editable canvas and set-piece space, not placeholder photographs or fake traversable scenery.

## Five functional districts

1. **Western launch and vertical return:** real staging apron, cockpit, anchored launch rig and deep left shaft.
2. **Telemetry Needle:** asymmetrical roof crest, stacked entered gallery and visible bracing to soil.
3. **Beacon Crown:** grounded dual-pier mast, cable-inspection chamber and operator station.
4. **Switchstack Exchange:** off-centre staggered signal crown, operator cabin, and open transfer to the fifth district.
5. **Eastern Arrestor / Subgrade Terminal:** Y-braced signal catcher, entered operator platform and genuine deep shaft, with accessible below-grade rail relief shops and deliberately vacant expansion pockets distributed under the facility.

## Explicit race route graph and geometric limitations

The original building is tall rather than merely a line of shallow identical bays. The **primary route** flies east over the beacon skyline, reverses at the eastern high mast, returns to the western lift, descends, travels east along the full-width below-grade express, reverses at the eastern downshaft, travels west along the express, and ascends the western lift to finish. This intentionally double-reversed route is recorded as literal named sites in `qualification.json`; it does **not** claim a direct aerial east-to-subgrade descent at the eastern mast. The eastern shaft is accessible from the subgrade, but the high Y-guyline and grounded machinery prevent treating the high-east sky and deep-east shaft as one direct local manoeuvre. The **alternative course** enters the west shaft immediately and uses only the underground east/west return. Thus the map offers different real travel elevations, not merely decorative lane markers.

Every one of the 27 named positions is a literal unclipped 4-neighbour-reachable free centre under conservative 19×15, 23×19 and 31×27 occupied-cell envelopes. `route_audit.py` independently tests each consecutive primary and alternate course leg using a **300px expanded local XY bounding window**, and tests four adjacent cardinal centres for both shaft junctions and the west finish. A real 40×38 wall shutter at `[651,147]` removes only the named High suspension cue; **all lower-alternative route legs remain accessible** under a 31×27 envelope. Source-static route tests are topology/clearance checks, not thrust, speed, collision, lap timing or event-script evidence.

## Reproducibility and independent qualification

- `build.py`: deterministic authored source, fixed seed `0xB34C0F11`, and lossless nonoverlapping row-run XYWH+material Setup-v2 rectangle encoder.
- `setup-beaconfold-subgrade-loop.json`: canonical 14-field Setup-v2, exactly 2,097,152 final cell positions.
- `qualification.json`: source-grid SHA-256, Setup bytes/hash, exact material histogram, rectangle and construction-work counts, 27 literal sites, source graph, and obstruction geometry.
- `verify.py` / `independent-verification.json`: separate replay from committed Setup rather than calling builder; no overlap, no invalid material, exact full-grid SHA and histogram, all solid components boundary-rooted, all site envelopes and physically blocked map; **every PNG palette index is mapped back to its committed material-ID cell** for pixel parity.
- `route_audit.py` / `local-route-qualification.json`: separate conservative locally bounded 31×27 site-to-site cardinal connectivity, including actual obstruction with lower route.
- `physical-laws.json`: allowed fixed-solid material subset; no powder, fluid or reactive cells.
- `exemplar.json`: corpus schema v1 including eight controlled diversity axes and four unscripted authoring/event sites.
- `overview.png`: actual full-grid 2048×1024 material image; six `01-`–`06-` images are **unscaled 1:1 district crops** of that same grid. No generated scenic art or native screenshots are substituted.

Recreate with `python build.py` and verify independently with `python verify.py` then `python route_audit.py` (Python 3, NumPy, SciPy, Pillow). Regeneration should preserve byte-identical grid and receipt hashes, provided the same Python/Pillow PNG conventions.

## Canonical authority and hold gate

CyberSand accepted read-only main: `f7e056c9b8791106e22f2d1c295043783d8a9701`. Reference repository accepted `main` at branch point: `99a166e7fcae45eb22be1740e9f33f62faccbcc7` (the branch-from SHA should be rechecked at publication). The accepted Workbench Setup-v2 loader declares up to **32,768** construction rectangles and a **1 MiB** setup JSON file budget; any separate installed binary must still be checked as part of native admission, but speculative old 4,096 limits do not govern this corpus.

**NATIVE-UNTESTED**: no compatible local Godot/GDExtension/Workbench/Rapier binary was executed. No native load, flight, collisions, speed/lap feeling, actor state advancement, scripted event, or cold save/reopen assertion is made. Independent Art, Technical and Shepherd assessment, owner Windows testing and explicit acceptance are all separate. This work must remain **Draft/HOLD**, never Ready or merged automatically.
