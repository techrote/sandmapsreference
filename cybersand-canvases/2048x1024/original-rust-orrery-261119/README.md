# Rust Orrery — an ORIGINAL dead clockwork sky (2048 × 1024)

**OPEN Draft/HOLD · ORIGINAL-NO-REFERENCE · NATIVE-UNTESTED.** Designed from scratch for fun and artistic expression. No reference artwork, source image or traced geometry was used. Every element is placed by coordinates in `build.cjs`. The engine supplies a background layer, so floating geometry is intended. Engine authority: CyberSand main `018bd09503d7f079ddac52e225c2f7daf8d678bf` (read-only). Midge actor and liquid policy are copied from the accepted racing canvas.

## Concept

A clockwork solar system has stopped over a ruined city. Six gate rings orbit a rusted steel sun, joined to it by spokes. A flyer threads the rings in turn, dips through the sky, and reaches a beacon at the far edge. Floating junk, moons and gold chains fill the sky around the orbit.

## What is in the sky

- **The sun (centre):** a steel gear with twelve teeth around a uranium core. The spokes stop at the rings' sun-facing edges.
- **The orrery (radius 340):** six gate rings at 0°, 60°, 120°, 180°, 240° and 300°. Each ring opens along its orbit tangent, so the flyer passes through the ring's interior. Neon inner edges: cyan, magenta and amber. Ring bands alternate uranium glass and gold leaf.
- **Moons (radius 480):** a heat-shield moon with an LED equator (150°), a basalt moon with obsidian craters (210°), and a polymer moon with a solar band (330°).
- **Gold chains:** from the ceiling to the top rings and moons; from the ground up to the two bottom rings. Beaded, like jewellery.
- **Floating scenery:** a tilted dish wreck, a crystal-cored rock, and a launch island with an LED pad.
- **Skyline (both edges):** towers on the ground, with glass-block windows and neon-lit columns.
- **Coolant bowl (lower right):** a floating heat-shield dish with water.
- **Finish (right):** a gold gate ring open left and right, with a uranium beacon on top.

## Sites

| Site | Position | Notes |
|---|---|---|
| Launch pad | (150, 552) | Spawn |
| Ring 180 gate | (684, 470) | Ring centre |
| Ring 240 gate | (854, 176) | Ring centre |
| Ring 300 gate | (1194, 176) | Ring centre |
| Ring 0 gate | (1364, 470) | Ring centre |
| Ring 60 gate | (1194, 764) | Ring centre |
| Ring 120 gate | (854, 764) | Ring centre |
| Inner sky | (1024, 300) | Between the sun and the top rings |
| Pool skim | (1420, 760) | Above the bowl |
| Finish | (1930, 450) | Inside the finish ring |

## Materials by role

| Role | Materials |
|---|---|
| Sun | Steel plate (62), painted steel (63), uranium glass core (123), LED hub (80) |
| Rings | Uranium glass (123) and gold leaf (118) bands; cyan (77), magenta (78) and amber (79) neon inner edges |
| Spokes | Steel plate (62) |
| Chains | Gold leaf (118) |
| Moons | Heat shield (131) with LED (80); basalt (100) with obsidian (101); polymer (128) with solar (129) |
| Skyline | Steel (62) and corrugated (64) towers; polymer (128) roofs; glass block (120) windows; neon windows (77, 78, 79) |
| Ground | Slate crust (49), basalt (100), obsidian veins (101) |
| Bowl | Heat-shield walls (131), painted-steel floor (63), water (3) |

## Gates (enforced by the builder)

- **Reachability:** all 10 sites are reachable from the spawn at 19 × 15, 23 × 19 and 31 × 27.
- **Reaction guard:** 0 fixes needed; 0 touching pairs remain.
- **Replay:** exact, 0 mismatches.
- **Budget:** 7,006 rectangles (limit 32,768); setup JSON 131,916 bytes (limit 1,048,576).
- **Floating geometry:** allowed by design. 17 floating components (65,064 cells) are recorded in `stats.json`, not rejected.

## Files

- `build.cjs` — deterministic builder. Run `node build.cjs`.
- `setup-rust-orrery.json` — the setup.
- `stats.json` — hashes, rectangle counts, flood results, histogram, floating components.
- `render/` — overview, review and routes images, five 2× districts and a manifest.

## Limits

- The flight has not been played. The rings are sized for the 31 × 27 hull with clearance, but the feel of the orbit is untested.
- Water, liquids and in-game behaviour are untested; the copy is NATIVE-UNTESTED.
- The liquid policy and Midge actor are copied from the accepted racing canvas, not re-derived for this map.
