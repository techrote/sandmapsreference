# WORKS-0036 · Dry-Magnitude Bucketwheel Quarry — CyberSand 2048×2048

**Draft / HOLD. Do not merge or promote to Ready before owner playtest.**

## Provenance
- Source reference: [`artwork/works_yards/batch1/terraced_orefields-bucketwheel_quarry-dry_magnitude.png`](https://github.com/techrote/sandmapsreference/blob/main/artwork/works_yards/batch1/terraced_orefields-bucketwheel_quarry-dry_magnitude.png)
- Public ID: **works-0036**; source key: `batch1/image-0081`.
- Git object SHA: `a96b91af219962dd219ffe3b8ea48f2d0668eda9`; catalogue/source-map SHA-256: `9307625500b4026ad09e24c3fc953da2a37a855ad4eea76869863900931ccc59`.
- Reference image dimensions: **not independently available** in the current tool runtime (image asset is binary and inaccessible to the canvas builder); original image must be visually compared during owner/shepherd review.
- Engine schema authority: [CyberSand `main` at `018bd09503d7f079ddac52e225c2f7daf8d678bf`](https://github.com/techrote/cybersand/tree/018bd09503d7f079ddac52e225c2f7daf8d678bf).

## Design translation
Instead of rasterising the source, the builder creates a side-elevation open-cut quarry with terraced iron-rich geology, elevated ore-yard shacks and crusher galleries, steel conveyors and hanging sensors, an overscale bucket wheel and wheel-support gantry, a hoist/control wing, ore veins and a deep extraction seam. Routes link upper service terraces with the excavator, side benches and deep transit using broad flight volume. The dry-quarry theme is intentional: no live sand or uncontrolled liquid is spawned.

The raw material plane, not this illustration, is the playable CyberSand terrain. The PNG is a **1024×1024 full-area overview** sampled directly from the exact 2048×2048 authoritative material cells.

![Actual CyberSand material-cell preview](bucketwheel-quarry-preview.png)

## Install and playtest
Copy `setup-bucketwheel-quarry.json` to the running CyberSand project's `user://workbench/setup-bucketwheel-quarry.json`, use its ordinary Workbench setup loader and select **bucketwheel-quarry**. Confirm that the native bridge advertises at least 13,531 start rectangles (current source permits 32,768; an older native library can cap at 4,096). Spawn is the current Midge, with a 1.5× boost multiplier. This is a regular Workbench setup **version 2**, not a generated-start wrapper.

## Static qualification (builder's in-memory reconstruction)
| Check | Result |
|---|---:|
| Exact terrain extent | 2048×2048 |
| 5-field material rectangles | 13,531 / 32,768 |
| JSON UTF-8 bytes | 259,620 / 1,048,576 |
| Reconstructed material cells equal authored plane | 4,194,304 / 4,194,304 |
| Conservative clearance envelope | 19×15 cells |
| **Exact-site** reachable named destinations from Midge spawn | **14 / 14; no surrogate positions** |
| Largest destination waypoint adjustment | **0 cells** |
| Native Workbench / Rapier exercise | **Not run** |
| Direct source PNG visual comparison | **Not run** |

Static clearance uses a summed-area blocked-cell mask for the entire 19×15 envelope, then a flood-fill over the legal center positions. The full-map preview and the three native-resolution district PNGs are generated from the authored material plane. Exact intended points must themselves be free and connected; nearest-point fallback has been deleted. See `evidence.json` for all waypoints and counts.

## Reworker B engineering repair — strict endpoints

**Shepherd review:** [initial review of HEAD `6ef631d64891`](https://github.com/techrote/sandmapsreference/pull/2#issuecomment-6937464744).

The processing-bench waypoint **[1460,780]** previously sat inside solid steel housing (its claimed pass used [1410,780], **50 cells away**). A western service-body access notch now opens the actual position while retaining the large housing and cyan instrument window.

The excavator-gantry waypoint **[1430,890]** was inside a diagonal steel truss (claimed substitute [1410,860], **36 cells away**). An intentional maintenance break now provides Midge-envelope clearance at the actual gantry waypoint, not a renamed substitute. The rest of the conveyor, wheel and gantry structure remain.

The middle-pit anchor **[815,870]** was also on a conveyor truss. Its semantic destination is an **airspace waypoint**, so it was deliberately relocated to **[815,820] above the conveyor**, in actual open flight volume rather than its former collidable center or the previous [810,850] nearest-point surrogate.

The builder now fails if **any** exact named coordinate is not reached by the selected Midge's conservatively oversized **19×15** all-non-air-blocking flood-fill. No 105-cell fallback, fake adjustment or silent destination substitution. Final result is **14/14 exact anchors, all offsets 0**, from the original spawn. The edited geometry remains a real 2048×2048 Workbench Setup-v2 JSON.

### Native-resolution material-grid evidence

Each crop covers **512×512 original cells at 1:1**, without interpolation or painted-in imagery:

![Bucket wheel and central supports](bucketwheel-quarry-detail-wheel.png)

![Processing housing and gantry service openings](bucketwheel-quarry-detail-processing.png)

![Deep ore seam and lower route](bucketwheel-quarry-detail-deep.png)

**Remaining gates:** Native engine material-ID / actor-hash acceptance, actual Workbench gameplay and save/reopen were not exercised here; source artwork binary was not visually available through the GitHub connector, so no source-image pixel-level or compositional fidelity claim is made. The Overview PNG remains a downsampled 1024×1024 representation of the final material grid. Keep Draft / HOLD pending independent visual/source review and physical Windows Workbench evaluation.

## Reproducible builder
Run from this directory with Node.js:
```powershell
node -e "const fs=require('fs'),{generate}=require('./builder.cjs');const a=generate();fs.writeFileSync('setup-bucketwheel-quarry.json',a.json);fs.writeFileSync('bucketwheel-quarry-preview.png',a.png);for(const [k,p] of Object.entries(a.detail_pngs))fs.writeFileSync('bucketwheel-quarry-detail-'+k+'.png',p);fs.writeFileSync('evidence.json',JSON.stringify(a.stats,null,2)+'\n');console.log(a.stats)"
```

No bitmap is imported as level geometry. Geology, platforms, wheel, truss, rooms and detail are computed from a fixed seed; rectangle vertical coalescing is lossless. **Open questions for owner/shepherd:** physical Windows/Godot/Native load, exact material catalogue admission in the installed native bridge, real flight/input/collision and save/reopen; independent comparison against the original source image. These are not claimed as passes.
