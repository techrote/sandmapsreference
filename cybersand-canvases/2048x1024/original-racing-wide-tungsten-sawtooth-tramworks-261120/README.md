# Tungsten Sawtooth Tramworks — original 2048×1024 racing-wide CyberSand world

**Status: creator SOURCE-STATIC PASS; independent Art/Technical/Shepherd qualification PENDING; NATIVE-UNTESTED; Draft/HOLD only.**

An entirely original, dry electro-industrial tram-switching and energy-recovery facility in **true perpendicular 2D side elevation**. All geometry is material-ID cells; neither an AI render nor a reference-art conversion. Built from accepted inert, nonmoving solids; no animated/fluid/particle foundations, fake walkable scenery or altered engine code.

## Functional districts and recognizable macrostructure

1. **West impulse injector (x 0–390).** Roof-founded paired accelerator jaws, low brake recoverer, a staffed roof console and true foundation workshop. Midge starts at (140,444); the west rejoin at (157,446) ends the loop.
2. **Sawtooth capacitor field (x 390–862).** A roof-supported down-sweeping shear tooth, a genuinely floor-founded up-sweeping concrete tooth and a second roof shear. Their alternating silhouettes support readable rise/descent decisions; a separate substation lies below the founded machinery.
3. **Radial brake interlock (x 862–1280).** Giant single-piece ring/six-spoke driven braking wheel in a grounded floor saddle, with a physically excavated east-side emergency egress and a lower bearing-service shop. Both upper and lower conservative-hull bypasses remain accessible.
4. **Dry salt-screen condenser (x 1280–1690).** Three unequal roof-fed charge nozzles, three differently tall boundary-founded condensing collectors, connected service routes and an enterable salt servicing bay. No actual falling salt or active liquid is used.
5. **East turnaround catcher (x 1690–2048).** Broad, opposing upper capture jaws, open descending reorientation gap, lower mechanically supported return gate and an east foundation-recovery garage.

**Negative space is intentionally real flight space**, not decoration. Control and garage interiors are physically excavated from the roof and foundation at true Midge scale. Equipment lives on structural foundations rather than unsupported scenery islands.

## Intended Midge course and alternate

**Outbound east:** Start / ignition (140,444) → West injector gate (319,438) → Sawtooth climb 1 (440,374) → Shear bridge crest (674,324) → Shear descent (800,537) → Rotor top bypass (1005,324) → Rotor exit (1238,533) → Salt screen approach (1365,402) → Condenser gate (1603,449) → East capture inlet (1900,458).

**Turn / return west:** East descent (1901,596) → East lower loop (1900,712) → Condenser return (1556,714) → Rotor return (1120,751) → Shear westbound return (584,727) → West recovery (191,662) → Finish / west rejoin (157,446).

**Alternative:** At the ring, Rotor top bypass can divert through Rotor bottom bypass (1053,702) before Rotor exit. The independent route audit tests that connection in a bounded full-hull corridor. Physically filling the *actual* 100×68 route block at XY (1332,370) occludes only literal **Salt screen approach**, leaving 26/27 named locations, including finish and the emergency route, reachable at full 31×27 clearance.

**Accessible non-teleport destinations:** Injector control (226,101); Shear control (712,108); Rotor watch (1250,102); East dispatcher (1808,101); West machine shop (257,940); Sawtooth substation (738,924); Rotor bearing shop (1085,937); Salt service bay (1460,931); East recovery garage (1855,934). All 27 named sites are checked literally, not moved to nearby free cells.

These are **source-static** route and clearance claims, not native steering, lap time or collision gameplay claims.

## Exact reproducible construction and qualification

Run `node build.cjs` inside this directory. It deterministically creates exactly 2,097,152 actual 8-bit material-ID cells, losslessly coalesces each material row and vertically merges equal runs into ordered nonoverlapping Setup-v2 rectangle edits, writes `setup-tungsten-sawtooth-tramworks.json`, `qualification.json`, `overview.png`, and six authentic native-resolution indexed-material crops. No reference images are used. Seed `0x261120f7`.

Then run **independent committed-payload verification**: `node verify-independent.cjs`. This separately reads the committed Setup JSON rather than the builder's constructed grid, exhaustively replays every rectangle, checks exact JSON/histogram/grid SHA, re-floods boundary-grounded solids, performs literal 4-neighbour 19×15, 23×19, 31×27 Midge clearance tests, inserts the real obstruction, and decodes each committed indexed PNG (CRC, zlib, raw pixel parity). Run `node local-route-audit.cjs` for 27 ordered main, bypass and service legs with exact 31×27 hull centres constrained to each leg's own endpoint bounding region extended by 400 cells. The verbatim results are `local-route-qualification.json`.

| Static receipt | Measured R1 |
|---|---:|
| Extent / actual material cells | 2048×1024 / 2,097,152 |
| Ordered rectangles / accepted source max | 4,334 / 32,768 |
| Setup-v2 bytes / accepted source max | 82,335 / 1,048,576 |
| Material-cell work / accepted source max | 713,378 / 32,000,000 |
| Fully boundary-grounded final inert solids | 713,378 / 713,378; zero detached final |
| Falling, flowing, reactive, non-authorized material IDs | 0 / 0 / 0 / 0 |
| Exact destinations 19×15 / 23×19 / 31×27 | 27/27 each |
| Real blocked-route alternative | 26/27, finish still reached |
| Full 31×27 bounded legs | 27/27, including services and ring diversion |
| True full-size material overview / true unscaled crops | 1 / 6 |
| Ordered replay overlap/mismatch | 0 / 0 |
| Material grid SHA-256 | `7e7c752c04793be96162586d9a808f8b3d79a0b18a557f258286d78f890269fb` |
| Accepted CyberSand authority, READ ONLY | `de109d0131641d6adc8d25bb9ced7ca3d4991105` |
| Native Workbench, installed bridge, Rapier, flight/contact, save/reopen | **NATIVE-UNTESTED** |

**Material laws:** 49 Slate, 58 ReinforcedConcrete, 62 SteelPlate, 100 BasaltColumns, 101 Obsidian, 113 ZincSheet, 117 BareIron, 122 QuartzCrystal. In accepted `native/include/cybersand/material.hpp` each chosen material is Solid/nonmoving with RuleKernel::None. 0 water, lava, unstable sand or reactive sources. 55,585 disconnected *intermediate design* cells were discarded during source generation; **none survive in the final published material grid**.

**Installed bridge risk:** The accepted Setup-v2 source advertises 32,768 rectangles but an existing installed/legacy CyberDemoBridge may expose a 4,096-rectangle maximum. This map contains 4,334, **238 above that hypothetical installed limit**. No truncation or reduction to an unverified runtime cap is performed. Verify `workbench_start_rectangle_capacity()` from the actually installed DLL/SO before native qualification; then perform genuine Godot/Workbench/Rapier flight, collision, simulation and cold-process save/reopen tests. A source-static PASS must **never** be reinterpreted as native PASS or an owner merge acceptance.

## Images (all are cell-derived)

- `overview.png` — indexed 2048×1024 material IDs, entire world, (0,0)
- `01-impulse-injector.png` — 1:1 west controls and approach
- `02-sawtooth-capacitors.png` — 1:1 alternating real-cell shears
- `03-rotor-interlock.png` — 1:1 physical wheel and alternate bay
- `04-crystal-screen.png` — 1:1 dry salt-screen machinery
- `05-reversal-catcher.png` — 1:1 east descent and return
- `06-machinery-underworks.png` — 1:1 equipment and lower return

Every PNG's palette index represents **the exact material ID**, not a visual-only screenshot. `qualification.json` reports each PNG's independent byte SHA-256, CRC/zlib, crop origin and pixel count; the standalone verifier checks every pixel against the reconstructed committed grid.

### Review gate

Creator generation and independent-from-builder local replay passed; independent Art/Technical/Shepherd examinations and native admission remain pending. The PR is exclusively **OPEN Draft/HOLD**, with no Ready, merge, auto-merge or owner acceptance.
