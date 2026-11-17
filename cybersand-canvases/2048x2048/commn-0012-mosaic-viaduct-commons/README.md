# Mosaic Viaduct Commons — Shared City on the Arches

**Actual CyberSand Workbench generated-start canvas** · **2048×2048** · **Draft / HOLD**

## Reference / exact provenance

- Original reference: [`artwork/neighbourhoods_commons/batch2/mosaic_viaduct_commons.png`](https://github.com/techrote/sandmapsreference/blob/main/artwork/neighbourhoods_commons/batch2/mosaic_viaduct_commons.png)
- Public reference ID: `commn-0012`; source key `batch2/images/img-040.png`
- Original Git blob SHA: `fb01ca96733623502e99e9734bf4fb7d5d28035e`
- Original source SHA-256: `2fdd573055f04a2252ce7098c7276db1d9d209e9797ae9e282f15d5e0ef6b8e3`
- CyberSand accepted `main` schema authority: `018bd09503d7f079ddac52e225c2f7daf8d678bf`
- **Original reference image pixels were not available through the read-only GitHub binary-file interface in this execution; source width/height and direct side-by-side image fidelity remain unverified.** Do not treat this as a visually exact tracing.

## Playable translation

A dense two-dimensional mosaic viaduct city with six vaulted limestone arches, terracotta/cyan upper transit deck, suspended circular civic mosaic, west/east townhouse and service quarters, two maintenance portals through the upper viaduct, public tiled court, roof gardens, layered lower passageways, lanterns, shade-festival pennants, a contained reflecting pool, and geological valley banks. The default Midge spawns above the upper viaduct; upper, middle, and lower routes connect through explicit traversal portals. All wall, tile, mosaic, light, water, and plant shapes are authored physical CyberSand materials, not a background illustration.

The output uses an entirely orthographic 2D side elevation, with no isometric platform tops, and avoids unconstrained spreading organisms. Water is confined to the lower service pool. The colored mosaics, lights and foliage are made with stable solid material IDs, so the static composition does not spontaneously grow or dissolve.

## Committed artifacts

- `setup-mosaic-viaduct-commons.json`: the actual Workbench generated-start v1 canvas, with `starting_setup.edits` material rectangles. **Use this file to play; the PNG is only a preview.**
- `preview.png`: full-resolution RGB PNG rendered from the exact authored material IDs and CyberSand's material palette.
- `overview.png`: 1024×1024 review image from the same material-cell plane.
- `build.py`: deterministic map authoring, generation, rectangle coalescing, actor-clearance checks, full reconstruction validation, and PNG rendering; seed `40012`.
- `base-setup.json`, `generated-start-template.json`, `material-palette.json`: frozen schema/palette authoring inputs, pinned to previously accepted evidence.
- `evidence.json`: machine-readable source identity, static budgets, hashes, destinations, and explicit native/visual limitations.

For reproducibility on Python 3 with Pillow, NumPy and SciPy: `python build.py`. The frozen inputs are committed; the script will not need to access the network when rerun from this directory. The same script generates the exact setup and material-plane hash.

## Loading in CyberSand Workbench

1. Place `setup-mosaic-viaduct-commons.json` in the running CyberSand application's `user://workbench` directory (`%APPDATA%\Godot\app_userdata\Cyber Sand Reference Sandbox\workbench\` on the reference Windows configuration).
2. Reopen the Workbench generated-start file, then install it into the current Workbench. The selected Midge begins above the upper viaduct.
3. Fly through the arch galleries, central mosaic passage, side civic quarters, the upper maintenance cuts and the lower basin. Keep the water in its sealed pool unless deliberately performing destructive sandbox testing.

## Static qualification

See `evidence.json` for exact generated counts, output hash, and the 16 named route targets. Acceptance requirements:

- Exact extent **2048×2048** (4,194,304 material cells).
- Workbench `starting_setup` version 2, generated-start wrapper version 1.
- At most **32,768** coalesced terrain rectangles and **1 MiB** JSON.
- Exact roundtrip reconstruction from emitted rectangles back to every authored material cell.
- Every one of 16 named districts/destinations reachable from Midge spawn with **19×15** and **7×7** geometric clearance envelopes. An empty-cell flood fill alone is insufficient.
- True material palette rendering; no source image embedded in the setup.

**Native qualification is NOT complete**: this run did not execute a physical Windows 11 Godot/Rapier Workbench, the live actor controls, real simulation progression, or save/reopen. **Direct original-reference image comparison also remains outstanding** because the artwork's PNG bytes could not be retrieved. These are explicit independent-review and owner-acceptance gates, not silently claimed passes.

**Do not merge or promote Ready.** The shepherd should review this exact HEAD and either commission rework or mark it for owner playtesting after the remaining gates.
