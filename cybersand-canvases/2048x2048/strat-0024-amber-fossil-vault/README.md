# Amber Fossil Vault — The Ancient Silence

**CyberSand Workbench generated-start canvas** · **2048×2048** · **Draft/HOLD**

## Reference and provenance

- Source: [`artwork/rock_ice_caverns/batch1/amber_fossil_vault-fossil_skeleton-ancient_silence.png`](https://github.com/techrote/sandmapsreference/blob/main/artwork/rock_ice_caverns/batch1/amber_fossil_vault-fossil_skeleton-ancient_silence.png)
- Permanent public ID: `strat-0024`; source key: `batch1/image-0252`
- Original source Git blob: `5a02202f041d1db3f78cea822019ba844dfc721c`
- Original reference SHA-256 (catalogue/source-map): `2ef3a791276231e5fee07a27a37fcc7b0c7cfee8ff216f13651d78125e34ca5c`
- CyberSand engine/schema authority: accepted `techrote/cybersand` `main` at `018bd09503d7f079ddac52e225c2f7daf8d678bf`
- **This canvas is a creative side-elevation adaptation of the fossil-skeleton concept, not an embedded/rendered copy of the original image.** Source binary was not available for direct side-by-side pixel viewing in this run, so precise source-composition parity is an **outstanding visual-review item**, not claimed as verified.

## Level design

A huge primordial skeleton occupies the middle of a stone-and-amber vault. The skull/mandible at the left transitions into a segmented spine and overhanging ribs, limbs, and tapered right-side tail. Two offset upper skylight access shafts, asymmetrical west/east side grottoes, layered fossil-bearing basalt, amber crystal clusters, examination stands, suspended inspection catwalks, and a lower excavation undercroft create multiple exploration routes. Seventeen named destinations are reachable by Midge free flight; crossings are deliberately open around the specimen rather than sealed rooms.

The work-light and sign details are deliberately authored **in material cells** rather than overlay sprites. The bottom contains a small sealed water lens; the bone/amber/cavern dressing is made from stable materials, not dynamic spreaders. Platforms and fossils are physical solid matter, not background art.

## Artifacts and reproduction

- `setup-strat-0024-amber-fossil-vault.json`: actual CyberSand Workbench generated-start v1 artifact. Use this, **not the PNG**, to load the level.
- `preview.png`: 2048×2048 full material-cell RGB render.
- `overview.png`: 1024×1024 downsampled visual overview derived from the same cells.
- `build.py`: deterministic 2048×2048 terrain builder (seed 252024) and static verification.
- `base-setup.json`, `generated-start-template.json`, `material-palette.json`: frozen authoring inputs retained to make the builder rerunnable without the CyberSand checkout.
- `evidence.json`: exact SHA and static qualification results.

Rerun with Python 3, Pillow, NumPy and SciPy: `python build.py`. The builder generates identical material-plane and setup hashes when invoked with the same dependencies and input files.

## Workbench loading

1. Copy `setup-strat-0024-amber-fossil-vault.json` to `%APPDATA%\Godot\app_userdata\Cyber Sand Reference Sandbox\workbench\` on Windows (or the platform equivalent of `user://workbench`).
2. Select the saved generated start `strat-0024-amber-fossil-vault`. Reopen/Verify if the UI requires it, then **Install into Workbench**.
3. Spawn as the selected Midge and explore the fossil nave, suspended gantries, side vaults, and lower archaeological levels.

The generated-start format preserves the known empty-baseline generation substrate and applies the material overlay as `starting_setup.edits`; it is **not** a raw bitmap pasted into an unsupported world.

## Static qualification

| Requirement | Result |
|---|---|
| Extent | **2048×2048** |
| Material rectangle count | **24943 / 32,768** |
| Serialized generated-start JSON | **479181 / 1,048,576 bytes** |
| Exact reconstructed material cells | **4,194,304 / 4,194,304** |
| Material-plane SHA-256 | `4c2a93272905b1b28f460a1bbac7b25b95fe39a281081fd482e242ec96c60334` |
| Named destinations reachable | **17 / 17** at 19×15 envelope; 17/17 at 7×7 |
| Native Workbench / Godot / Rapier | **NOT executed in this environment** |

The Midge hull is 4×3 in the accepted engine definition; the 19×15 clearance check is a conservative geometric free-flight proof, not a physical Windows acceptance. It establishes component connectivity, not path planning under propulsion or moving fluids. The original image remains available via its immutable source path and SHA, but side-by-side review against those exact pixels was not possible in this execution. 

## Owner review gate

Keep this PR **Draft/HOLD** until independent reference visual review and genuine Windows 11 Godot/Rapier Workbench install, actor input, progression, and save/reopen acceptance. Do not merge or promote Ready autonomously.

## Reworker A — layered archaeology and functional excavation repair

**Repair input:** `3302306cd2136172f363b3f4dbcf812a2f55a86c` (PR #6); **target remains 2048×2048**; **Draft / HOLD**. The original fossil skull, backbone, ribs, long tail and central open flight nave are retained rather than replaced. This pass changes **125,631 final material cells** and adds **3,015 non-destructive material rectangles**.

The material-grid repair adds (1) stratigraphic transects and irregular rock/talus shelves at perimeter faces, (2) an independently supported upper-left bone-research platform with service ladder and analysis consoles, (3) a braced upper-right hoist with suspended calibrated instrument gear, (4) a western dig-gallery support/lift zone beneath the skull, (5) a differently equipped eastern survey/microscopy bay, and (6) an actual undercroft sample tram/service bay with gantry and geological coring support. These are real, collidable 2D material cells, not PNG-only effects. Deliberately omitted: a solid floor across the fossil nave, global geometric noise and uncontrolled dynamic materials.

**Exact final static checks:** 27,958 / 32,768 rectangles; 535,498 / 1,048,576 JSON bytes; 1,730,518 total stamped-cell operations; 4,194,304 material cells reconstructed with SHA-256 `4c2a93272905b1b28f460a1bbac7b25b95fe39a281081fd482e242ec96c60334`; 1,846,105 connected 19×15 clearance centers; **17/17 named destinations directly legal and reachable from Midge spawn [460,470]**. No approximate/nearest-anchor waiver. The existing Water basin remains physically bounded and no new reactive liquid or spreading Plant cells were introduced. Source-level material IDs are listed in evidence; actual CyberDemoBridge/native acceptance has **not** been tested.

**Reproducibility:** Start from this directory and run `python3 build.py && python3 replay_rework.py` (Python, NumPy, Pillow, SciPy). `build.py` recreates the frozen, deterministic baseline; `replay_rework.py` verifies its plane hash, appends only committed `rework_patch.json` rectangles, validates complete reconstruction, exact Midge-envelope reachability, native-enum-sourced valid palette IDs, budgets, and regenerates the JSON, overview, full-resolution preview, three native-cell district crops and evidence receipt. The replay is also idempotent when its patch is already present.

**Preview evidence:** `preview.png` (2048×2048), `overview.png` (1024×1024 true material-cell sampling), `detail-upper-access.png` (768×512), `detail-fossil-nave.png` (1024×512), `detail-lower-excavation.png` (1024×512). All are actual material-grid renders. The material texture has the same stable ±2 rock-grain arithmetic as the original generator. Different PNG compression streams are not evidence of a material mismatch.

**Unresolved:** the exact original `strat-0024` reference PNG cannot be decoded with the currently available connector (blob provenance verified, pixel-level fidelity **unverified**). No Godot/CyberDemoBridge/Rapier or Windows Workbench install, movement, simulation or save/reopen has occurred; **native qualification remains untested**. Keep Draft/HOLD pending independent Shepherd review and owner acceptance.
