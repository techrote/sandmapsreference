# TIN CANTICLE — Harmonic Dish City

**Original 2048×1024 CyberSand landscape / megastructure-wide. Draft / HOLD; NATIVE-UNTESTED.**

An entirely independently authored, true side-elevation material-cell world. No repository image, reference canvas, user picture or historical level supplied this composition. Every wall, reflector panel, fixture and piece of machinery is represented by actual, indexed CyberSand material cells. No platform tops, 3D illusion or scenic background layers are used as gameplay substitutes.

## Architectural thesis and Midge mission

A dead orbital receiver has been converted into an inhabited long-distance carrier-signal city: the antenna's **double parabolic reflector** straddles a vast air chasm; public freight and instrument trades operate on its western bank; bureaucratic transmission licenses and quarantine occupy the eastern bank. A **hanging triptych tuning interferometer** occupies the middle abyss with two long suspension lines visible at macro scale, while three independent air strata connect the settlement. The western signal market features magenta trade sashes; industrial service uses cyan cooling loops; the public tribunal uses pale tile and brass; the border lock uses heat-shield ceramic and amber hazard lines. Massive geological abutments and continuous roof-bearing spine provide a readable load hierarchy.

**Gameplay goal:** Fly the Midge from **West freight landing [155,485]** to **Long-range relay goal [1930,487]**, visiting the amplifier, reflector receiver, tribunal and border apparatus as desired. Every destination is a fixed exact coordinate in the committed cell grid, not a dynamically snapped point. The player may fly under, across or over the reflector; if trapped under the suspended receiver, use the paired low-level service sluices to recover. All rooms and doorways are proportioned relative to Midge's source-authored 4×3 hull and separately qualified with conservative 19×15, 23×19 and 31×27 centre envelopes.

## Distinct functional districts and intended exploration

| District | Horizontal span | Programme | Named example sites |
| --- | --- | --- | --- |
| **West Freight Landing** | x=90–415 | Entered loading check-in, overhead hook, weighbridge and antenna-side public arcade | West freight landing, Antenna commons, Underrail inspection |
| **Cold-Splice Amplifier Works** | x=435–795 | Non-parallel transmitter pylons, powered inductor, current-bus service cubicles and cooling workshops | Cold-splice instrument bay, Amplifier refit gantry, Cooling return workshop |
| **Parabolic Receiver Chasm** | x=795–1326 | Huge overhead dish aperture, supported concave reflector, central targeting pylon, receiver workshop triptych, air bridges and lower bypass | Western dish lip, Reflector inner span, Dish underpass, East dish lip |
| **Census Tribunal** | x=1317–1685 | Pale offset civic halls, rostrum, physically entered book archive, witness galleries and administrative terminals | Adjudication gallery, Census antenna roof, Civic archive undercroft |
| **Border Receiver** | x=1694–1970 | Heat-shield security bastion, three-step inspection/decontamination/export, antenna mast and emergency freight handling | Containment registration, Border receiver mast, East recuperation berth, Long-range relay goal |

### Route graph

- **Upper exposed antenna course:** Antenna commons → Amplifier refit gantry → Western dish lip → East dish lip → Census antenna roof → Border receiver mast. Cross-level portals interrupt the mast galleries where needed; roof fixtures are navigable as obstacles, not walkable platform tops.
- **Middle inhabited course:** West freight landing → Cold-splice instrument bay → Reflector inner span → Adjudication gallery → Containment registration → Long-range relay goal. Alternative approaches pass through the reflector's upper ledges and side slits.
- **Lower emergency and freight route:** Underrail inspection → Cooling return workshop → Dish underpass → Civic archive undercroft → East recuperation berth. The paired physical sluice cuttings through the lower bridge-side locks restore bidirectional recovery while retaining the hanging tuning instrument and the structural roof ties.
- **Transfers:** Multiple Midge-scale vertical shafts connect the upper, middle and lower flight strata near the freight exchange, amplifier works, dish shoulders, tribunal and border terminus. They were cut and repaired in the final committed material plane, not inferred from free-space drawings.

A real material-cell obstruction test paints rectangle **[986,448,124,87]** into the middle crossing. The obstruction intentionally occupies only **Reflector inner span**. All **16 other exact named sites** remain reachable from the original spawn at all three conservative envelopes (19×15, 23×19, 31×27); see `receipt.json`.

## Reproduction / contents

```
node build.cjs
python3 independent_verify.py
```

`generate.js` contains the fixed-seed (`0x20b5619`) original solid-cell authoring and support-pruning algorithm. `build.cjs` losslessly coalesces the final **2,097,152** cells into **7,447** bounded, ordered, nonoverlapping Setup-v2 five-integer rectangle edits, generates the actual Setup JSON and six indexed-material PNGs from the same final grid. `independent_verify.py` is a separate Python/numpy/scipy implementation that replays the *committed JSON*, verifies the 14-key Setup-v2 contract, exact 4-neighbour actor-centre BFS, boundary grounding, byte/hash/material histograms, and individually validates PNG signature, every chunk CRC32, IDAT zlib and Adler-32, IEND termination and all material-pixel comparisons at exact crop offsets.

- `setup.json`: directly loadable Workbench Setup-v2 manifest, exactly 2048×1024.
- `receipt.json`: independent-creator-source-static receipt, true cell histogram, image digests, route results, assumptions.
- `overview.png`: exact **2048×1024** indexed material-cell surface. Pixel value = committed CyberSand material ID, with a PLTE palette for inspection.
- `01-west-freight.png` – `05-border-receiver.png`: genuine unscaled material-ID crops; not concept art, Photoshop, simulated engine captures, or interpolation.

## Accepted source and physical qualification

- Accepted **read-only** CyberSand `main` examined at `7b03aa437561ec63e31fd09531171360ab60eeb4`, `godot/scripts/workbench_setup.gd`, `native/include/cybersand/material.hpp` and native actor/Workbench contracts; start schema source version 2.
- sandmapsreference starting `main` HEAD at creation: `99a166e7fcae45eb22be1740e9f33f62faccbcc7`.
- **Source limits:** 32,768 Workbench rectangles; ordinary generated manifest <=1 MiB; construction work ceiling 32,000,000 cells. Actual: **7,447 rectangles**, **137,528 UTF-8 JSON bytes**, **943,793 occupied, nonoverlapping painted cells**, **2,097,152 exact complete cells** (including empties).
- All **21 occupied material IDs used** are defined native `MaterialState::Solid`, `RuleKernel::None`, nonmoving inert solids in this accepted source. Foundation uses native basalt/obsidian blocks (IDs 100/101), **not the falling `Stone` powder ID 13**. No fluids, fires, reactive elements, moving loose solids or pseudomaterials appear in the authored map. Structural decors are solid colliders, not pass-through illusions.
- Final structural check identifies **one** boundary-connected solid component, zero retained unsupported/detached solids, even after the 5,446-cell deterministic removal of disconnected construction fragments. This removal is explicitly recorded rather than silently described as anchored hardware.
- Exact site-envelope checks: all **17/17** original named centres reached at each of 19×15, 23×19 and 31×27; real central obstruction alternate-path test: remaining **16/16** at each size. All BFS tests are cardinal four-neighbour over full in-bounds rectangular footprints; sites are never relocated or exempted.
- PNG tests: six actual-cell indexed PNGs; total **3,192,445 decoded material pixels** match the replayed original source plane at their exact coordinates. Integrity includes PNG chunk CRCs, zlib/Adler, IEND. The overview itself covers every material cell.

### Hard limitations / review gates

This is **creator-computed source-static qualification**, *not* independent Shepherd, artistic or technical qualification; independent reviewers must inspect this exact committed HEAD and authentic 1:1 crops. The accepted source advertises **32,768** Workbench paint rectangles but an older **installed bridge can report as few as 4,096**. The map's 7,447 rectangles exceed that legacy fallback by **3,351**. **No installed Windows Godot/CyberDemoBridge/Rapier build was run** in this execution environment; native import, actor input, collision, physical ticks, and save/reopen remain explicitly **NATIVE-UNTESTED**, not passed. The engine material palette may display differently from the PNG's faithful indexed-material readout. No gameplay or independent acceptance should be inferred solely from static BFS.

**PR policy:** Keep Draft/HOLD; do not Ready, merge, auto-merge, force-push or declare owner acceptance. Any future material surgery requires full-grid, route and image regeneration plus exact HEAD review.
