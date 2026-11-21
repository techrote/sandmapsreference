# Nadirspan Deep-Hanger Furnace Shaft — PORTRAIT-001 (Creator B / OBVIOUS #2)

**New original recomposed 1024×2048 orthographic material-ID world, not a rotated, cropped, stretched, pixel-reused or coordinate-transferred source.** Source PR #146 at exact SHA `c6a83f6fa0545fc3a29058341d14d7cf2f412c29` is read-only; original horizontal identity becomes seven unequal descending overhangs along a single industrial shaft. See `aspect_transfer.json` and `exemplar.json` for provenance, preservation/transformation decisions, corpus axes and proposed unscripted set pieces.

Process from top to bottom: roof-loaded ore hoppers → opposite-wall refractory furnace with sealed lava → heavy suspended ladle with independent counterweight → three differently scaled rotors → shielded, fully enclosed water quench → triangular freight davit and lower export. Sidewall service bays remain deliberate editable gaps. All material IDs are native 1:1 cells, with no isometric or foreshortened platform geometry.

## Reproducibility / qualification
Run `node build.cjs [output-folder]` with `layout.cjs` alongside it to reproduce exact `setup.json`, `receipt.json`, seven indexed-palette PNGs. Fixed seed 202611211336; accepted read-only engine `techrote/cybersand/main@69209acaffb34ebe18c45e19290b5976b7fb2c82`; corpus base `sandmapsreference/main@99a166e7fcae45eb22be1740e9f33f62faccbcc7`. The builder checks 2,097,152 exact cells, lossless ordered non-overlapping replay, grid/JSON SHA-256, solid boundary grounding, sealed fluids, every named literal target under 19×15/23×19/31×27 full hull BFS, and reaccess after insertion of actual [450,980,200,130] material obstruction. Upper thermal interlock to Lower quench interlock 31×27 shortest: 319 → 501 steps. No nearest-site substitution or clearance exceptions. PNG integrity, full indexed pixels and crop parity are verified by the builder, not by fake native captures.

### Gallery (all authentic 1:1 material slices)
- `overview.png` — complete material plane (1024×2048).
- `01-ore-hangers.png` — 744×330 at (124,135).
- `02-sealed-furnace.png` — 782×310 at (125,466).
- `03-suspended-ladle.png` — 779×316 at (125,725).
- `04-unequal-extruders.png` — 780×542 at (125,1010).
- `05-enclosed-quench.png` — 780×256 at (125,1553).
- `06-freight-davit.png` — 780×211 at (124,1745).

**Creator source-static PASS only; NATIVE-UNTESTED.** No compatible installed Godot/Workbench/CyberDemoBridge/Rapier load, live Midge movement/collision, dynamic fluid behaviour or fresh-process save/reopen was executed. Independent Art/Technical/Shepherd exact-HEAD review, exact-HEAD CI and Windows owner acceptance remain open. Keep PR Draft/HOLD; never merge or mark Ready automatically.
