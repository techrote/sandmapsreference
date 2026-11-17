# Asteroid Ladder Galleries — CyberSand 1024×2048

**Draft / HOLD. No merge or Ready promotion without owner acceptance.**

## Reference provenance

- Repository: [techrote/sandmapsreference](https://github.com/techrote/sandmapsreference) `main`.
- Reference: [asteroid_ladder_galleries.png](https://github.com/techrote/sandmapsreference/blob/main/artwork/spacecraft_orbital_structures/batch2/asteroid_ladder_galleries.png)
- Public ID: `orbit-0006a`; source key `batch2/images/img-029.png`.
- Original Git blob: `686bd6acce83445567cbd71069dc5c31445519c0`; source-map SHA-256: `e663ce4379554b49c168447b023f24481ad7df3dc9106bddcd29ed40c952cf28`.
- Image file size: 1869336 bytes. **Exact dimensions and visual source comparison unverified**: the available GitHub connector cannot return this PNG's binary bytes. This is a design interpretation of the recorded asteroid/ladder-gallery concept, not a claim of image-perfect reproduction.

## Playable design
A tall asteroid excavation with seven distinct instrument galleries carved into a fractured left wall, a lower-density right docking fragment, five sealed-looking but open-access pressure pods, a two-rail ladder-service mast, exposed cross-braces, gimbal cradles, a huge midshaft tether reel, and deep-space negative space between the two opposing rock masses. Individual rooms house survey optics, an auger, core samples, fossil ribs, magnetic stress coils, an anchoring winch, life-support equipment and service instruments. Portal repair preserves generous paths; no image pixels are embedded.

All level artwork is authored with actual stable CyberSand material IDs (granite/basalt/slate, hard architectural metals, copper/brass and inert luminous trim). The level does not rely on uncontrolled granular or fluid simulation.

## Reproduce and load
Requires Node.js. In this directory run:
```bash
node -e "const fs=require('fs'),{generate}=require('./builder.cjs'); const v=generate(); fs.writeFileSync('setup-asteroid-ladder-galleries.json',v.json); fs.writeFileSync('asteroid-ladder-galleries-preview.png',v.png); fs.writeFileSync('evidence.json',JSON.stringify(v.stats,null,2)+'\\n')"
```
Install the JSON as a named Workbench starting setup under Godot `user://workbench/`. Select it in the Workbench using an accepted CyberSand build whose native `workbench_start_rectangle_capacity()` admits at least 17175 rectangles; older native builds may cap this at 4,096. Extent is exactly 1024×2048. PNG is a diagnostic indexed-material render downsampled to 512×1024, **not a native gameplay screenshot**.

## Qualification, exact-source statement
- CyberSand accepted main: [`018bd09503d7f079ddac52e225c2f7daf8d678bf`](https://github.com/techrote/cybersand/commit/018bd09503d7f079ddac52e225c2f7daf8d678bf). Schema: `godot/scripts/workbench_setup.gd`.
- Extent: **1024×2048** (sides allowed in 512–2048 / 64 multiples).
- Terrain rectangles: **17175 / 32,768**. JSON: **312920 / 1,048,576**.
- Lossless reconstruction: **2097152 material cells checked, 0 mismatches**.
- Reachable clearance destinations: **16/16** using a 19×15 footprint, including all seven excavation rooms and all five docked pods. Largest waypoint offset 71 cells due to large interior machinery.
- Selected actor: current Midge hash from the approved Setup-v2 reference; spawn 528, 93.
- **No real Godot/native/Rapier acceptance was performed here**. Reference-to-canvas visual comparison is not claimed. Owner should inspect source vs PNG and run Workbench on Windows before acceptance.
