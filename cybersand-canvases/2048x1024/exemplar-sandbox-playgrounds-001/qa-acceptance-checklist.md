# EX-PLAY-001 — Owner sandbox-play acceptance checklist

Source: three Setup-v2 2048×1024 authored starts on this **Draft/HOLD** branch. Expected current CyberSand target: accepted `main` and source-matched Windows friend playtest `f7e056c9`.

## Test each exemplar on physical Windows / NVIDIA

- [ ] Extract the map ZIP; run `INSTALL-EXEMPLARS.cmd`; verify no pre-existing user setups are overwritten.
- [ ] Enter **Development workbench**; type the exact name; press **Load start**.
- [ ] Verify full world dimensions, complete terrain geometry, no truncated source rectangles and a spawned **Midge** with working pilot controls.
- [ ] Resume **Play** and observe progress, collision/contact and camera navigation without a sustained stall.
- [ ] Pause; paint a test mark and erase a safe wall panel. Resume; confirm the changed material cells actually affect the running simulation.
- [ ] Save the authored start under a **new name**; fully exit CyberSand; relaunch and load the saved name. Confirm original construction plus paint/erase.
- [ ] Record NVIDIA GPU, Godot version, native source commit, Windows version, frame-time issues and screenshots. Do not mark native acceptance from PNG previews.

## Map-specific gameplay

- **Copperline Switchyard Trials:** fly under crane and between the switchbacks; try destroying crate braces, traversing gantries and opening each material tank. Check that actor contact does not block progress.
- **Tidelock Hydraulic Spillway:** breach wood weirs with Eraser to release water; verify native water behavior, pooling and water/lava reaction. Verify no unexpected spill or immediate hard freeze when paused/resumed.
- **Bloomglass Ruin Conservatory:** inspect all three dome spans, remove selected glazing, paint plants/seed and observe growth and impact in lower cisterns.

## Evidence and blockers

The static JSON / area checks recorded in `qualification.json` demonstrate only syntactic and raster geometry validity. They do **not** establish actual native-world admission, correct Rapier actor spawn, successful Save/Reopen, gameplay feel, camera quality or physical GPU acceptance.

Keep this pull request **Draft/HOLD** until the Windows checks above pass, the map previews are visually approved and an independent reviewer confirms reproducibility. Do not merge automatically and do not promote the three maps to Gold merely because their JSON validates.
