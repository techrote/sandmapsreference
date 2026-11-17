# Stacked Archive Vault — CyberSand 1024×2048

**Draft / HOLD.** A structurally authored CyberSand Setup-v2 material canvas; no reference pixels are embedded.

## Reference and provenance
- Source repository: `techrote/sandmapsreference`, default branch `main`.
- Permanent catalogue/public ID: `techn-0031a`.
- Source image: [artwork/technical_interiors/batch2/stacked_archive_vault.png](../../../artwork/technical_interiors/batch2/stacked_archive_vault.png).
- Git source blob: `7072fa470d413f1de53c1a57fe129a56639fdf51`.
- Source SHA-256 in `source-map.json`: `8d11239914fea2b80b01874c3a143a121386d72f5ec164f8799e9fc288a62fa7`.
- Original source key: `batch2/images/img-018.png`.
- **Original image dimensions and close visual fidelity remain unverified:** GitHub binary image bytes could not be retrieved by the current connector. The map therefore interprets the named archive concept and vertical technical morphology without claiming pixel-level correspondence.

## Map geometry and art direction
An irregular slate, granite and ochre ceramic excavation containing twelve differently furnished archival galleries: CATALOG 01, INTAKE, SLATE PRESS, INDEX 02, PAPYRUS, STACK 03, FILM 04, RESTORE, REEL HALL, SEALED 05, VAULT 06 and MEMORY. A prominent mechanical memory reel occupies the middle-lower central void. Segmented copper lift cables, offset cross-braces, archive scanners, film spools, document presses, stacked storage and sealed specimen cabinets provide distinct districts. Large negative-space central free-flight, side access ways and multiple vertical levels are deliberate. The imagery is authored as physical material cells rather than a backdrop.

The PNG is an **indexed material-colour diagnostic**, downsampled 2:1 from the genuine 1024×2048 grid. It is not a screenshot from CyberSand's lighting/rendering engine.

## Rebuild exactly
`builder.cjs` is deterministic, uses fixed seed 310118, and requires only Node.js. From the artifact directory:

```bash
node -e "const fs=require('fs'),{generate}=require('./builder.cjs');const z=generate();fs.writeFileSync('setup-stacked-archive-vault.json',z.json);fs.writeFileSync('stacked-archive-vault-preview.png',z.png);fs.writeFileSync('evidence.json',JSON.stringify(z.stats,null,2)+'\n')"
```

The builder enforces the target extent, input-independent deterministic output, budget caps, lossless cell reconstruction, a 19×15 collision clearance envelope and reaching 17 named destinations from the selected Midge spawn.

## Workbench installation
Use a CyberSand Workbench build compatible with the current Setup-v2 loader. Place `setup-stacked-archive-vault.json` into Godot's Workbench `user://workbench/` named-start directory and select the named canvas. Do not assume an old native DLL supports the newer 32,768-rectangle Workbench path: the loader checks `workbench_start_rectangle_capacity()` and older native builds can be limited to 4,096.

## Exact source inspection and static qualification
- Engine reference: `techrote/cybersand` accepted `main` at `018bd09503d7f079ddac52e225c2f7daf8d678bf`.
- Schema/limits: `godot/scripts/workbench_setup.gd`, Setup version 2; 512–2048 per side; 32,768 maximum rectangles/edits; 1 MiB JSON budget.
- Midge model: `godot/authoring/flyers/midge.json`, hull size 4×3 in the authoring record; conservative navigation envelope 19×15.
- Authored extent: **1024×2048** = 2,097,152 material cells.
- Merged non-overlapping rectangles: **9091 / 32768**.
- Serialized JSON: **167602 / 1048576 bytes**.
- Material grid reconstruction: **2,097,152 / 2,097,152 identical** (zero differences).
- Connectivity: **17 / 17 named waypoints reachable** within the 19×15 clearance envelope, including corrected entrances and storage aisles; **723602 connected free-space centres**.
- All dynamically evolving liquids are intentionally omitted. Native material-ID/catalogue acceptance remains pending.

## Remaining gates
A real CyberSand Godot/CyberDemoBridge/Rapier runtime was not available here. **Native load/install, actor input/collision, simulation progression, material catalogue admission and save/reopen were NOT performed**, and physical Windows acceptance is NOT claimed. The original PNG is also not visually verified. These are explicit Draft/HOLD gates for shepherd and owner review; do not promote or merge.
