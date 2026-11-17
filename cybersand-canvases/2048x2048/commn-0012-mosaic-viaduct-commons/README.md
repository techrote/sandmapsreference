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


## Reworker B — architectural/civic repair (d36ba7ea59e1 baseline)

The original six-arch viaduct, paired wings, centre roundel, basin, selected Midge, and 16 named coordinates are retained. This iteration repairs **real material cells** with a deterministic additive overlay (`rework-append.json`, 1,331 bounded stamps) rather than merely recolouring a screenshot. The edits give the previously repetitive arch courses asymmetrical stone-repair, pilaster, pennant and buttress grammar; articulate the west/east shopfronts with distinct roofs and window bays; tie the large suspended commemorative roundel to civil infrastructure; add a public court pavilion, colonnade and market details; and give the lower gardens and service/water infrastructure more functional spatial hierarchy.

The overlay was conservatively clipped around the original 19×15 shortest-route tree joining the selected spawn and **all 16 exact named anchors**; the resulting full-grid geometry was independently recomputed after editing. No hidden nearest-point substitution. Original contained Water occupancy is unchanged, and only pre-existing supported palette material IDs were authored.

### Exact-HEAD static requalification
- Source and PR baseline: `d36ba7ea59e1fdc511c1b9d717f549e007fa58cd`, material-plane SHA-256 `1127b5d58ecd6a32d22ad255652b698d5fc7d1a7ec25087a825eb7fc2acbe23d`.
- Revised extent: **2048×2048**; **19,357 / 32,768** 5-field rectangle stamps; JSON **376,164 / 1,048,576 bytes**; changed material cells **144,204**.
- Reconstructed cell plane: **4,194,304/4,194,304**; exact SHA-256 `e9d31f0fb6e813e0d22ac3849d1b4cb60fabdd505b64bf508b3ed23e8459fc6a`; zero unsupported/pseudo material IDs.
- Conservative 19×15 all-non-air-blocking Midge occupancy: **16/16 original final declared anchors** connected from spawn [404,502], **617,620** connected legal centres, no substitute waypoints. 7×7 route check: **16/16**, 980,001 centres.
- Dynamic Water: **43,916** original cells retained, zero changed Water cells.
- The full-resolution `preview.png`, 1024² `overview.png`, and native **512×512** `detail-viaduct.png`, `detail-civic.png`, `detail-gardens.png` all directly depict the final material cell plane.
- Reproduce with `python build.py` (requires NumPy, Pillow and SciPy); the builder asserts both exact baseline/final grid hashes, rectangle count, and 16/16 conservative route reachability.

**Evidence limits:** Actual original-source PNG visual comparison remains **UNVERIFIED**; no Godot/CyberDemoBridge native admission, installed DLL capacity, Rapier actor flight/collision, live simulation progression, or save/reopen was exercised. Static-cell admission does not imply physical Windows acceptance. Retain **Draft / HOLD** pending Shepherd and owner review.


## Reworker C — inhabited civic and asymmetric gallery finishing (17 November 2026)

**Starting exact PR HEAD:** `a757285d7495a3c2bcf6a740a9c2de6da193939b`. This pass changes real authored material cells, not the screenshot alone. It preserves the original six arch spans, central commemorative roundel, city wings, named Midge sites and the lower contained reflecting pool. The original source artwork remains binary-inaccessible, so **source-image resemblance is not verified**; these changes respond to independently observed deficiencies in the committed output.

- New western roofed assembly loggia and eastern multi-bay library lookout give the suspended roundel two distinct occupied public-space shoulders rather than detached ornament. Their brackets and piers connect into the central court supports.
- Additional western market terrace, eastern planted cloister, basin-side service shelter and asymmetric viaduct spandrel/masonry repair give the former empty service void coherent destinations and differentiate the two districts. A single material cell is either real stable material, air or the existing water; no new dynamics or unsupported pseudo-materials.
- A second geometry iteration found that the first pass disconnected six exact operational sites. The correction **reopened 10,025 air cells in 176 coalesced clearance rectangles**, protecting 8,250 original 19×15 path centres without moving destinations. The final output was visually reviewed again at whole-map and three original-resolution districts, and the restored passages are actual empty material cells.
- Final **2048×2048**; **21,320/32,768** material edits; serialized JSON **414,119/1,048,576 bytes** (SHA-256 `b9aad3fcda6fab7f1c041c83f941cb27352ff115aed6d173d1f2a2821f579f83`). **94,013 final material cells differ** from Reworker B; 43,916 sealed Water cells unchanged. Final material-plane SHA-256: `237ec6fb387c813babc1893d924d9e07f60cb94998fcbc304273bde3e7913661`.
- Independent 4,194,304/4,194,304 rectangle replay and histogram equivalence; **16/16 exact named destinations** connected using original 19×15 clearance (522,990 connected centres, 122 components overall), plus **16/16 at 7×7** (804,245 centres, 181 total components). No nearest-air waypoint substitution. Static reachability is not actual flight/control qualification.
- Reproduction: `python build.py` with NumPy/Pillow/SciPy and the checked-in `png_fixed.py`. The additional deterministic `rework-c-append.json` contains the final C stamping and explicit air-clearance restoration; `png_fixed.py` emits the byte-stable 8-bit native material-ID PNGs and embedded palette.

**Committed final PNG SHA-256 evidence:** `preview.png` f62bcb2f6046dac2b029114afa73d82d8016ddbc2f3aa291adc1aeb147d73b6f; `overview.png` 7d74a5b20c349d9655db19533398e88252c0db254fc6b41ed5d96aa97022a252; `detail-viaduct.png` ffb6c03a477b31f3b31e7809ffd308fc09c7a7b9cbc2fc8e656618d08580ea9b; `detail-civic.png` bac16c094194f1c928392bb063bdfca46d07fc30fd396d616281fcbef59ed6de; `detail-gardens.png` cce74fae28b77c592eedd18fc9290a6f005b3587e739af64c670a26162c99e79.

**Qualification limitations:** The source PNG's actual pixels have not been viewed. No Godot, installed CyberDemoBridge, Midge input/Rapier progression, or physical save/reopen was tested; the installed native rectangle limit and runtime actor hash remain unverified. The independent static replay and custom PNG emission were executed with a JavaScript GitHub-connected renderer; the patched Python builder itself was **not executed in this runtime**. Maintain **Draft / HOLD** until these gates and owner review.


## Reworker C — final civic / garden structural finishing, 17 November 2026

**Starting exact HEAD:** `0480c5b798b69b893d4b764a89e9678ff9de378d` · **Draft / HOLD retained**. New `rework-c2-append.json` follows and does not replace B/C's earlier deterministic overlays. This is material-cell geometry, not a preview-only edit.

- **Roundel:** paired asymmetric load paths and tension ties from the viaduct to the civic shoulders, with the original central inspection airspace preserved; the ornamental thin suspension rod is partly opened.
- **Public court:** western stepped gathering/gallery terrace and eastern stained-glass reading pavilion now have load-bearing plinths, occupied openings and different profiles rather than two near-identical decorative sail ornaments.
- **Lower terrain:** western supported garden workshop and eastern roofed orchard terrace, both grounded to the existing valley circulation; the existing water cistern is unmodified. One right-hand arch landing gains a recognizable repaired-stone bracket instead of another copy of the regular spandrel.
- **Actual-cell gallery:** `overview.png` (1024², 2:1 downsample), `preview.png` (2048²), `detail-viaduct.png`, `detail-civic.png`, `detail-gardens.png`, `detail-west-gardens.png` and `detail-east-gardens.png` (each 512² native one-cell-per-pixel).
- **Independent artifact replay:** all **4,194,304** cells equal the final ordered JSON stamps; material SHA-256 `59abd884e322edf9258ddb207b4188d8dd0cd6dba9999dbaeb90df2c9a4b7bff`. **100,826** material cells differ from the starting HEAD, with 1665 additional rectangles, **22,985 / 32,768** rectangles total, **446,333 / 1,048,576** JSON bytes, and **2,415,288 / 32,000,000** painting visits. All existing 43,916 Water cells remain in exactly the same locations.
- **Actor envelope:** exact 19×15 Midge clearance from original spawn [404,502] reaches **16/16 unchanged named sites** (483,078 connected centres), without tolerance offsets; a 23×19 sensitivity test still reaches **6/16**. The larger-envelope bottlenecks persist and require live flight evaluation. The route-preservation pass clears 8,195 newly occupied air cells on 8,249 original connected route centres; no Water or original foundation was removed for widening.
- **Rebuild:** run `python build.py` with NumPy/Pillow/SciPy to reproduce JSON, indexed PNGs and evidence. The existing fixed-Huffman PNG writer was independently reimplemented and byte-matched against the starting committed overview before encoding the new gallery. The Python builder itself was **not run** in this tool environment.
- **Limits:** source artwork `artwork/neighbourhoods_commons/batch2/mosaic_viaduct_commons.png` (blob `fb01ca96733623502e99e9734bf4fb7d5d28035e`) remains **SOURCE-UNVERIFIED**; no original pixels were viewed. **NATIVE-UNTESTED**: no Godot/Rapier/installed bridge load, Midge input or collision, water simulation or save/reopen. Owner/Shepherd acceptance remains pending; never infer physical playability from topology alone.
