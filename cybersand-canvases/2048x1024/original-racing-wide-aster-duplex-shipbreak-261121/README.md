# Aster Duplex Shipbreak — original 2048×1024 material-cell racing landscape

**Delivery:** independent original sci-fi/industrial side elevation, authored entirely as actual CyberSand material IDs. No source image, AI visualization, historical source geometry or scene-only decoration. **DRAFT / HOLD — NATIVE-UNTESTED.**

## Design thesis and flight graph

A roof-rigged decommissioning dock contains two huge salvaged industrial vessel hulls at staggered heights. The western cutter's keel is higher than the eastern cutter's, and both have genuine entered cargo apertures rather than merely graphic windows. Four strongly identifiable working districts plus a basin service district are: (1) west breaker customs and launch; (2) elevated first cutter with entered forward, middle and aft hold; (3) central hanging shear crane and separation void; (4) lower second vessel with three service compartments and through-hatches; (5) east catcher and reversal; floor-rooted bedrock service vaults form a sixth optional lower district.

**Primary conceptual route:** west customs start → bow arrival → beneath first cutter → central crane underpass → beneath second cutter → east inverted catcher → turned west through lower-cutter holds → upper first-cutter holds → western finish. The alternative avoids the aft cutter's obstructed gallery via the true continuous under-keel bypass. All exact named points are in `independent-verification.json`; the receipt also specifies the ordered main and blocked alternative routes with checked 31×27-bounded local legs. This is a static route graph, **not** a claim of achieved flight speed, steering comfort, timed laps, collision feel or native progression.

**Human edit / scripted set-piece affordances:** deliberately underoccupied bedrock vaults for NPC work crews, an unscripted shear-crane transfer release at the ship-gap, a removable aft cutter segment creating a proper reroute, lower cargo-hold ambush/maintenance pockets and an underdeveloped eastern vault. These are editable geometry, not scripted events. The vessel hulls, support ties, hatches and all floor openings are true orthogonal single-cell material geometry; the camera is pure perpendicular side elevation.

## Static material and host contract

- Current read-only accepted CyberSand engine: `techrote/cybersand/main@d5b0371501eb7ccd32c261f738b4a2612218fbc1` (2026-11-21); Workbench Setup-v2 `workbench_setup.gd` advertises **32,768** construction rectangles and **1 MiB** JSON, with 14 required root fields. The existing 32,768 native host-claims repair has been merged; no obsolete 4,096 cap is assumed.
- Branch base at initial investigation: `techrote/sandmapsreference/main@99a166e7fcae45eb22be1740e9f33f62faccbcc7`.
- `build.py` deterministically generates exactly **2048×1024 = 2,097,152** actual material-ID bytes from fixed seed `0xA57E2611` using only inert approved staged solid IDs: `58, 62, 72, 100, 101, 113, 117, 122`. Air is `0`. No sand, unsupported falling solids, mobile particles, reactive source materials, uncontrolled liquids or thermal sources.
- `setup-aster-duplex-shipbreak.json` is complete ordered Setup-v2, with preserved literal Midge spawn. Material grid SHA-256, exact rectangle total, complete histogram, JSON SHA/bytes and filled-cell construction work are in `qualification.json`. The root keys, 55-int liquid-policy envelope, full actor, selected ID and source limits are independently asserted.
- `verify.py` deliberately never imports `build.py`: it replays **every** ordered stamped rectangle into a fresh plane, rejects any overwrite/overlap, independently re-encodes the grid to verify exact rectangle equality, checks all solids are **4-neighbour boundary rooted**, and checks every PNG against the original material-ID bytes one-to-one. PNG indices are material-ID references through an explicit palette, not artistic restyling.
- Full in-bounds literal free-centre 4-neighbour reachability (no radius exception, target shifting, or nearest-site substitution) is tested for Midge envelopes **19×15, 23×19 and 31×27** at all 30 named destinations. An actual solid XYWH rectangle `(864,466,52,66)` obstructs the *Cutter aft cargo gallery*, while alternative under-keel route and finish remain accessible. `verify.py` verifies the return and route legs in bounded spatial crops, not just global free-space membership.
- A genuine full-grid indexed-material PNG plus six authentic 1:1 district crops live beside the builder and JSON. `exemplar.json` uses corpus schema v1 and all eight prescribed diversity axes.

## Reproduce

```bash
python -m pip install numpy scipy pillow
python build.py
python verify.py
```

Builder writes identical source JSON, PNGs and qualification; independent verifier writes `independent-verification.json`. For the externally held candidate, GitHub checks and exact-HEAD Art / Technical / Shepherd review remain separate. **Godot / CyberDemoBridge / Rapier actual native load, Midge collisions, advancement and cold-save reopen were not run** because no matching Godot and compiled bridge executable was available in this working environment. No acceptance, Ready promotion or merge is authorized by this static proof.
