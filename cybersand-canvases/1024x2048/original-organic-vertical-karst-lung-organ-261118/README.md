# The Karst Lung Organ

**Original CyberSand material-cell canvas, 1024 x 2048, orthographic side elevation.**

## Original spatial thesis

A petrified underground respiratory organ formed naturally over geological time: a continuous curved breathing shaft ventilates offset limestone lobes. Old roots entered from the collapsed skylight and were gradually mineralized into living-looking timber arteries. The porous spore organ, fossil atrium, calcite observatory, moonwell and basal resonating bell retain distinct geological identities. This is a navigable 2D level, not an image-to-map tracing.

## Artistic structure

1. **Sunken Crown (y 0-390):** broken skylight and asymmetric suspending oak/bamboo root arteries; inhabited negative space beneath the fracture.
2. **Root Orchard and Spore Organ (y 390-820):** intertwined soil/lichen west lobe against luminous eastern spore pockets and deliberately different shapes of perforation.
3. **Fossil Atrium and Calcite Observatory (y 820-1220):** chalk pressure ribs in the west, quieter opposite mineral observatory and a large alternate right-hand bypass.
4. **Anastomosis and Moonwell (y 1220-1700):** branching basalt vessels against nacre/quartz eastern mineral garden; forms a side loop below the central obstruction region.
5. **Deep Bell (y 1700-2048):** massive dry calcite resonator and asymmetrical embedded rib crests, with a traversable lower hollow.

## Exact-centre flight map

```text
                         x=0                 x=1024
 y=0          ROCK ROOTS   / SKYLIGHT /    ROCK
                    +------ MIDGE (507,133) ------+
                    |        CROWN               |
 y=535       ROOT ORCHARD == MAIN ORGAN == SPORE ORGAN y=623
                    \\       ||         //
 y=978       FOSSIL ATRIUM == SHAFT == CALCITE OBS. y=1028
                    \\    [central test block]  //
 y=1410      ANASTOMOSIS === SHAFT ====== MOONWELL y=1500
                         \\       //
 y=1826           ==== DEEP BELL ====
 y=2048                 ROOTED ROCK
```

Exact destination centres (no radius or nearest-point waivers):

- Crown skylight: (507, 213)
- Root orchard: (240, 535)
- Spore organ: (792, 623)
- Fossil amphitheatre: (292, 978)
- Calcite observatory: (780, 1028)
- Left anastomosis: (269, 1410)
- Moonwell garden: (786, 1500)
- Deep bell: (514, 1826)

Three conservative axis-aligned Midge envelopes (19 x 15, 23 x 19, 31 x 27) are flood-tested at every exact named site. The lower route is independently tested after blocking x300..708/y965..1148 in actor-centre space. The main shaft and at least one non-central bypass remain part of the same connected component.

## Format and use

`setup-karst-lung-organ.json` is an ordinary strict Setup-v2 authored starting-map document with ordered, losslessly coalesced nonoverlapping [x,y,width,height,material-ID] rectangles. The array reconstructs the **entire** initial material plane; Empty cells are implicit, with no recipe-dependent background. Use **Shared Workbench -> Load start** after installing the JSON as `user://workbench/setup-karst-lung-organ.json` under the **matching accepted CyberSand build**. The installed native rectangle capacity may differ from source; check against the actual GDExtension first. A saved starting map does not persist evolved physics.

All materials are inert immovable solids under the pinned material catalogue. No false falling-stone supports, liquids, burning ecology or self-propagating cells. Organic form is mineral/timber structure; simulated biological dynamics are not claimed.

## Provenance and repeatability

- Fixed seed: `0x4b415253`.
- Deterministic builder: `build-karst-lung-organ.js` (Node.js; no dependencies); writes all artifacts to its optional first directory argument or its own directory.
- Builder SHA-256: `e6accdaff1a3d29de278869ac43919fb2b69d9912b58eda9b75e0340eb446d1f`.
- Full material plane SHA-256: `4f0db935e32c966057b49c63de41bbefc11d282b8cc586b5c4351ba6987260c5`.
- Setup JSON SHA-256: `d47225a2c7671564447b7fc0d1d50695ec1262b232987acc1a8c73d4f1f7c9d2`.
- Full-grid parity: 0 mismatches, 0 overlapping rectangles.
- PNG: uncompressed-deflate, 8-bit indexed palette; palette pixel **index** is real CyberSand material ID, not illustration. All 8 images independently decoded and checked for PNG CRC/Adler/index fidelity.
- Current CyberSand accepted `main`: `018bd09503d7f079ddac52e225c2f7daf8d678bf`.

## Visual and independent acceptance

The full `overview.png` is exactly 1024x2048 physical cells, one actual material ID per PNG pixel. Six `NN-*.png` files are native 1:1 crops of that same grid; `thumbnail.png` is a nearest-neighbor overview only. See `qualification.json` for exact histogram, full-cell source/PNG hashes, connectivity, basins and static/native truth.

**DRAFT / HOLD. NATIVE-UNTESTED.** No Windows/Godot install, actor input/collision, Rapier progression or save/fresh-process reopen is represented as performed; Shepherd and independent auditor assessment remain outstanding.

Two completed self-critique repairs are authored into the deterministic generator itself: extra asymmetric roots and living rim facies in the crown, plus a twelve-rib nonrepeating crystal pressure-bell composition in the deep chamber. Neither changes another repo or any reference artwork.
