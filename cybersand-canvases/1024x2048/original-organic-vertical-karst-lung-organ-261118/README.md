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

Three conservative axis-aligned Midge envelopes (19 x 15, 23 x 19, 31 x 27) are flood-tested at every exact named site. The 31x27 clearance includes shortest cardinal-centre route lengths and at least three of eight distinct reachable 48-cell local approach samples per exact site; these samples do not prove edge-disjoint paths or piloted dynamics. The lower route is independently tested after blocking x300..708/y965..1148 in actor-centre space. The main shaft and at least one non-central bypass remain part of the same connected component.

## Format and use

`setup-karst-lung-organ.json` is an ordinary strict Setup-v2 authored starting-map document with ordered, losslessly coalesced nonoverlapping [x,y,width,height,material-ID] rectangles. The array reconstructs the **entire** initial material plane; Empty cells are implicit, with no recipe-dependent background. Use **Shared Workbench -> Load start** after installing the JSON as `user://workbench/setup-karst-lung-organ.json` under the **matching accepted CyberSand build**. The installed native rectangle capacity may differ from source; check against the actual GDExtension first. A saved starting map does not persist evolved physics.

Every nonempty starting cell is an immovable solid, but the actual accepted physics catalogue marks **OakTimber (46), PinePlanks (81), OakLog (83), Bamboo (86), Driftwood (88), Wicker (92), and MossWall (97) as Combustible**, not inert. Mineral structural supports are RuleKernel::None solids. Organic accents are unignited at spawn; subsequent ignition would change them. No combustion or other dynamic behaviour was natively simulated in this qualification. No false falling-stone supports, liquids, burning ecology or self-propagating cells. Organic form is mineral/timber structure; simulated biological dynamics are not claimed.

## Provenance and repeatability

- Fixed seed: `0x4b415253`.
- Deterministic builder: `build-karst-lung-organ.js` (Node.js; no dependencies); writes all artifacts to its optional first directory argument or its own directory.
- Builder SHA-256: `22991e0831527dbdf1b096062426a4f3e0c9e3fbe74280a5288857ab8e50f217`.
- Full material plane SHA-256: `d5d8b667c36163fdf6d1a656f20114a920b2c83ebf47cc7a9a28a6272a7eb119`.
- Setup JSON SHA-256: `3155ca7c1f03ae90c9a02c634c33e1b7b0b54a83da223601f457d010e41b2490`.
- Full-grid parity: 0 mismatches, 0 overlapping rectangles.
- PNG: uncompressed-deflate, 8-bit indexed palette; palette pixel **index** is real CyberSand material ID, not illustration. All 11 images independently decoded and checked for PNG CRC/Adler/index fidelity.
- Current CyberSand accepted `main`: `018bd09503d7f079ddac52e225c2f7daf8d678bf`.

## Visual and independent acceptance

The full `overview.png` is exactly 1024x2048 physical cells, one actual material ID per PNG pixel. Nine `NN-*.png` files are native 1:1 crops of that same grid; `thumbnail.png` is a nearest-neighbor overview only. See `qualification.json` for exact histogram, full-cell source/PNG hashes, connectivity, basins and static/native truth.

**DRAFT / HOLD. NATIVE-UNTESTED.** No Windows/Godot install, actor input/collision, Rapier progression or save/fresh-process reopen is represented as performed; Shepherd and independent auditor assessment remain outstanding.

R3 independently repaired seven formerly near-empty true-cell districts (crown, root orchard, spore organ, fossil amphitheatre, calcite observatory, dry moonwell, deep bell), plus supported anastomosis; each has large/midscale physical architecture and distinct silhouettes rather than added outline whiskers. Core airway and blocked-centre bypass remain open. No source/reference image or other repository is used.

## R4 physical district rebuild (18 November 2026)

The independent Shepherd and fidelity reviewers requested a substantial second site-scale edit rather than thin detail. R4 replaces the prior root-orchard crossed-stick arrangement with a continuous buttressed tree, three rooted benches, branching irregular canopy and cut geology niches; replaces Spore Organ circles with interconnected irregular membranes, five unequal through-pores, actual approach stages and a route to their service ledges; builds a four-tier stratified fossil amphitheatre opposite a faceted braced observatory; and adds a continuous basalt artery and three dry moonwell service levels. All edits precede full-cell coalescing and independent site/hull/route replay. These are static physical initial-material edits, not live native results.

## R5 inhabited-district rebuild (18 November 2026)

After the independent R4 Fidelity and Shepherd REWORK, the actual physical grid was rebuilt across six previously thin districts, not merely the preview: a wall-rooted orchard retaining trunk with usable harvest terraces and carved root niches; differently scaled enterable cellular spore tissue with inspection decks; a five-tier raked fossil amphitheatre and sheltered fossil altar; a distinct enclosed calcite viewing room with open entry and supported deck; three distinguishable basalt valve junctions; and a dry, nested moonwell basin with two service walks and different mineral catch sockets. The final Midge safety corridors are restored after additions. These are immovable starting material-cell structures, not simulated biological machinery or liquid physics.

**31x27 fully in-bounds exact-centre destination-to-destination static route tests (cardinal steps):**

- Root orchard -> Spore organ: **640** steps
- Fossil amphitheatre -> Calcite observatory: **538** steps
- Left anastomosis -> Moonwell garden: **607** steps
- Moonwell garden -> Deep bell: **598** steps
- Root orchard -> Fossil amphitheatre: **561** steps
- Calcite observatory -> Moonwell garden: **802** steps

The centre-mask stress test is not a physically added obstruction. Inserting actual solid terrain in x300..708/y965..1148 physically overlaps the fossil destination envelope at 31x27; all-eight-sites survival in that physical obstruction is **not claimed**. No native installation or gameplay test has been run.
