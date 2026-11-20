# Nadir-4 Salt-Quench Exchange — R2 original industrial landscape

**2048x1024 actual material-ID world | fully orthographic side elevation | OPEN DRAFT/HOLD | NATIVE-UNTESTED.** Entirely new original authored environment, unrelated to source-image rework. The apparatus is built from actual accepted material cells, not animated industrial machinery. Water (#3) and Lava (#8) are mobile/reactive, not stable foundation. Every described valve/manifold below is **static geometry**.

## Process districts

1. **Barge Intake** (x50-490): uneven brine-handling gantry, actual cargo clamping jaws, fixed specimen lift, and crew-scale inspection console inside the entered weighing hall.
2. **Vacuum Needles** (x490-970): unequal spires, separately sealed water-condensate vessels, an external differential inlet/outlet contact chain, and a dry instrument-room examination surface.
3. **Phase Gate** (x970-1500): twin thermal baffles, a sealed lava vessel, joined external thermal transfer header and distinctive hot-chain operator controls.
4. **Cold Recovery** (x1500-2020): independent stepped fins, two contained water retorts, a four-section exchanger header and an entered cold finishing bench.
5. **Return Undercroft** (x130-1920,y900-970): continuous flyable dry lower alternative with a two-sided entered drain-test alcove, a separate valve-shuttle alcove and eastern sump instrument island. The R2 subgrade crop is widened to show both stations.

Original macro silhouette and flight voids remain, including three large vertical return shafts. Primary airborne route is arrival -> weighing -> vacuum -> phase-gate -> cold recovery -> eastern extraction. Lower return connects at west/central/east shaft accesses; no site has been moved or waived.

## Exact functional Midge destinations (unchanged from original)

| Name | Cell centre |
|---|---|
| Arrival aerostat | (80,420) |
| West weighing hall | (215,440) |
| Interchange flight lock | (478,415) |
| Vacuum skylane | (554,375) |
| Condensate landing | (956,427) |
| Phase-gate overlook | (1055,392) |
| Thermal diagnostic | (1473,423) |
| Cold-water exchange | (1556,494) |
| Exhaust service apron | (1950,424) |
| Safe eastern extraction | (1981,625) |
| West subterranean hatch | (502,928) |
| Middle pressure undercroft | (1035,929) |
| East sump return | (1605,929) |

All **13 exact named destinations** are checked from spawn (80,420) for fully in-bounds 19x15, 23x19 and 31x27 Midge clearance with 4-connected centre flood; no nearest substitutions. Two physical 52x64 obstruction fixtures independently retain all exact sites. This proves only *static* connectivity, not live handling.

## Deterministic physical-cell proof

- Fixed seed: **19042647**; source generator **build.cjs** is the complete geometry and renderer. Run `node build.cjs` here to regenerate all Setup/receipt/PNG evidence, or `node build.cjs --verify` to re-compute every artifact and fail on byte drift.
- Accepted READ-ONLY CyberSand: `de109d0131641d6adc8d25bb9ced7ca3d4991105`; original sandmapsreference branch base main: `99a166e7fcae45eb22be1740e9f33f62faccbcc7`.
- Exact full material plane **2048x1024 = 2,097,152 cells**, SHA-256 `ef640b99c34c9a2d5bbc1d3a0346ce5ae47a3fe3617c607bc4514b469eb91cdc`.
- **2191** lossless ordered, nonoverlapping Setup-v2 rectangles; **41426** serialized ASCII/UTF-8 bytes; SHA-256 `ab4ad1ecf30f50e8138f5628c4607a7eff6a45f72e1a1e72976132e0af908b60`; **607515** construction visits. Budgets: 32768 source rectangles, 1 MiB JSON, 32M visits.
- Stable boundary-rooted inert Solid/None: **582391/582391**, **0 detached**; actual support bearings are emitted by the deterministic builder.
- Water/Lava initial fluid-exposed faces: **0**; direct Water-to-Lava adjacent faces **0**; original Water/Lava cell values unchanged by R2. Not a dynamic-fluid test.
- Material changes from independent exact-R1 replay: **24692** cells (18157 added, 1030 removed, 5505 rematerialized), spanning (202,484) to (1858,965).
- Genuine 8-bit indexed PNG pixel = exact material cell: full **overview.png** plus five **1:1** district crops barge/vacuum/thermal/cold and widened **subgrade.png**; 3582852 decoded material indices CRC-checked and compared against final grid, zero mismatches. See receipt.json for all hashes/dimensions/histogram and BFS counts.

## Admission / review status

**CREATOR STATIC-PASS, NEW-HEAD ART/TECH/SHEPHERD REVIEW REQUESTED, NATIVE-UNTESTED.** This revision responds to the reviewers' functional industrial art P1; it is not self-declared independent acceptance. Godot, Workbench/CyberDemoBridge installed rectangle capability, Rapier/Midge live collision/flight, fluid settling and fresh-process save/reopen were **not executed**. Native bridge source cap 32768 does not establish installed capacity (legacy ~4096 fallback). Do not merge, mark Ready, auto-merge or claim owner acceptance.
