# Parallax Forkbridge Containerworks — ORIGINAL-LANDSCAPE-RACING-WIDE

**Status: Draft/HOLD. Source-static qualified by creator; independent Art/Technical/Shepherd review required; NATIVE-UNTESTED.**

An independently designed **2048×1024 physical material-cell world** set inside a dry high-tension container relay canyon. This is an actual perpendicular 2D side-elevation layout, not a reference-art conversion, illustrative picture, or fake native screenshot. No isometric surfaces or decorative faux geometry. Every visible PNG pixel identifies one actual material ID from the Setup-v2 payload.

## Original district structure

1. **West magnetic injection and control platform:** a concrete approach saddle, piston collar, energized-but-inert coil shapes, elevated operator pulpit and low pressure-service chamber. Spawn at the physically clear centre `(142,565)`.
2. **Shuttle cable lift:** a diagonal twin rail, suspended cargo shuttle, tall hoist, distinct gearbox workshop and upper crane-inspection airspace. Unlike the previous alternating-teeth racing maps, the principal mechanism is a **single major inclined freight lift**.
3. **Forkbridge transfer signal:** two unequal hollow pylon frames, exposed oblique tension bridge, triangular signal sail and a hydraulically controlled Y-switch with both upper and lower ways through. No circular rotor/wheel centrepiece or repeated upper room grid.
4. **Cargo processing gantry:** two uneven industrial towers carrying an actual heavy container on the hoist, with an open transit clearance below, grounded roller conveyors and entered decontamination/filter workshop.
5. **Eastern V-catcher and braking handoff:** an unmistakable downward open V arrestor, cable-driven winch above, separate rising/east turn and a brake-service workshop accessible from the lower route.

A distinctive **boundary-anchored upper catenary spine** carries upper crane loads through physical inert cables; the lower structural caissons are founded in basalt. Racing apertures are machined from the *actual* grid. Disconnected design-candidate material is removed **before** serialization and before source qualification. All retained solids are 4-neighbour boundary grounded. Large air volumes are deliberate flight space with separate upper/main and lower/return corridors, not scenic rooms.

## Planned Midge route graph (literal destinations)

**Main eastbound:** Start / West ignition → Injector coil exit → Shuttle lift approach → Elevator clearance → Forkbridge western throat → Upper fork gate → Upper fork clearance → Upper fork exit → Cargo gantry arrival → Container loader bypass → Eastern capture entry.

**Eastern descent / westbound return:** Eastern capture entry → East downward turn → East return approach → Under cargo berth → Central lower return → Switch return → Shuttle underpass → West recovery → Finish / West ignition.

**Alternate at fork:** Forkbridge western throat → Alternative central ramp → Alternative fork rejoin → Upper fork exit. This is a *physically separate lower bypass* of the deliberately vulnerable upper fork gate. A **real solid obstruction at XYWH `[933,417,120,124]`** removes the literal Upper fork gate without extinguishing the lower bypass, eastern destination, west return or finish. No target coordinates are moved and no hull-width exceptions are made in the proof.

**Entered operators/services:** West control platform, Shuttle cable operator, Forkbridge overhead signal, Cargo loading attendant, East catcher operator, Pressure service room, Shuttle gearbox service, Fork hydraulics service, Cargo filter service, Brake handoff service. Each is a distinct literal coordinate in `qualification.json` and is 31×27-free and connected to the original spawn. The ten local approaches and all primary/alternate route legs have bounded witness lengths in `local-route-qualification.json` (≤110-cell extra local margin under obstruction; 80 margin for ordinary route legs).

## Source-static evidence (not a playtest)

- **Actual fixed-seed source:** `build.py` (`0x20261120`); requires only Python 3.10+ standard library. The full 2,097,152-byte material plane is generated, disconnected candidates pruned and deterministic canonical horizontal-row / maximal-vertical rectangles encoded. No previous map shape, branch, image or reference grid is imported.
- **Exact saved authored recipe:** `setup-parallax-forkbridge-containerworks.json`, with all 14 accepted Setup-v2 root keys, Midge hash, 55-integer liquid policy, and nonoverlapping `[x,y,width,height,material_id]` edits.
- **Independent proof:** `verify.py` does *not* run/import the builder. It checks Setup schema, exact material IDs, root metadata, source-grid SHA-256, per-ID histogram, canonical rectangle encoding, exhaustive ordered replay, boundary grounding, the literal spawn and every exact named site at full 19×15, 23×19 and 31×27 footprints. It also decodes the actual indexed PNG files, validates per-chunk CRC and zlib, and compares **all image pixels** to reconstructed source cells. The blocked-route fixture is independently rechecked.
- **Local path witnesses:** `route_audit.py` verifies 18 primary, 3 alternative and 10 service legs at conservative 31×27, plus the same bypass/return legs after the real obstruction. Every endpoint is the actual committed literal site.
- **Whole-world material plane:** `overview.png` is actual indexed-material 2048×1024, not a resized illustration. `01`–`06` are true native-resolution contiguous district crops; their source coordinates, byte sizes and hashes are in `qualification.json`. The palette has one distinct RGB triplet per actual material ID.
- **Inert materials only:** 58 Reinforced Concrete, 62 Steel Plate, 100 Basalt Columns, 101 Obsidian, 113 Zinc Sheet, 117 Bare Iron, 122 Quartz Crystal. No falling/liquid/reactive/unknown cells, no unstable unsupported final solids. These are accepted `techrote/cybersand/main@7b03aa437561ec63e31fd09531171360ab60eeb4` IDs with inert Solid/RuleKernel None according to current accepted materials definitions and prior independently qualified source receipts.

### Execute locally

```sh
python3 build.py
python3 verify.py
python3 route_audit.py
```

`build.py` regenerates Setup JSON, qualification receipt and indexed overview/crops from one exact source plane; independent verification must pass again before altering the PR HEAD. Python's Pillow, NumPy, PIL and any AI image generator are **not** required or used.

## Explicit downstream gates

Accepted Workbench source advertises at most **32,768** construction rectangles, **1,048,576** Setup JSON bytes and **32,000,000** edited-cell work visits; however an older **installed** `CyberDemoBridge` may report only 4,096 rectangles. This specific map's count and JSON size are in `qualification.json` and must not be conflated with the actually loaded native capability. A current source capacity value is **not** proof that the user's installed DLL reports it.

**NATIVE-UNTESTED:** Compatible Godot/Workbench, Rapier, CyberDemoBridge binary and save/reopen test environment were not present for this creator execution. Real Midge flight, collision response, blocked-way steering, high-speed feel, lap timing, progression and cold-process persistence have **not** been tested. Static 4-neighbour BFS cannot establish these. Independent Art/Tech/Shepherd review and exact-binary native qualification are required. Stay **OPEN Draft/HOLD**, no Ready, merge, auto-merge or owner acceptance.

**Repository ownership:** Only `techrote/sandmapsreference` under exclusive `original/racing-wide/parallax-forkbridge-containerworks-261120` and `cybersand-canvases/2048x1024/original-racing-wide-parallax-forkbridge-containerworks-261120/`. `techrote/cybersand` is read-only. Existing original maps, source references, PRs and schedules remain untouched.
