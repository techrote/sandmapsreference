# Severed Counterweight | original industrial vertical canvas

> DRAFT / HOLD. Original authored physical-cell design, not sourced from reference art. Engine native load and owner acceptance remain UNTESTED.

**Creative thesis.** A once-balanced deep ore lift has snapped its eastern counterweight chain. A narrow steel skyline feeds a central offset flight spine; two service shafts provide long alternative ascents. The flyable traversals reveal five vertically distinct industrial districts, each with framed equipment and real crossover apertures rather than scenic panels.

**Canvas:** 1024 x 2048 native material cells, exact. **Seed:** 638654469. **Accepted CyberSand main:** `018bd09503d7f079ddac52e225c2f7daf8d678bf` (read-only authority). **Base:** `techrote/sandmapsreference` current main at branch creation.

## Intended playable structure

1. Sky intake (y 60-380): roof-level duct towers, landing bridge, crown signal and structural cross-brace.
2. Counterweight cathedral (y 380-815): a static hanging ore mass, cable/sheave banks, west winch room and eastern control desk.
3. Sorting / crushers (y 815-1200): tapering feed hoppers, ore assay, central exchange, paired material chutes.
4. Rail funnel (y 1200-1590): switch interlocks, transverse trusses and pressurization switchroom.
5. Quench and salvage (y 1590-2048): retrieval dock, heat-shield furnace, sealed cooling trough and bottom lift terminal.

**Engineering semantics:** gantries, rail stops and counterweights are solid static architecture; the scene does not pretend these are animated machines. Every lateral aperture is cut through both structural and decorative paint. A left (x~205), right (x~800) and offset center spine offer multiple independent ways around the primary material obstructions. Continuous rock shoulders terminate the structural members.

## Exact named sites

| ID | Site | Exact (x,y) | District |
|---|---|---|---|
| A | Crown dispatch | (520, 145) | Sky intake |
| B | Signal lantern bridge | (520, 290) | Sky intake |
| C | Western winch desk | (205, 575) | Counterweight cathedral |
| D | Eastern thrust control | (800, 700) | Counterweight cathedral |
| E | Ore assay alcove | (205, 1030) | Sorting and crushers |
| F | Main ore exchange | (595, 1060) | Sorting and crushers |
| G | Central rail interlock | (514, 1335) | Rail funnel |
| H | Pressure switchroom | (800, 1400) | Rail funnel |
| I | Salvage retrieval dock | (205, 1765) | Quench and reclamation |
| J | Furnace inspection perch | (800, 1750) | Quench and reclamation |
| K | Bottom lift terminal | (494, 1910) | Quench and reclamation |

## Route graph (flight)

Central spine: (520,145) -> (520,342) -> (558,342) -> (558,620) -> (484,620) -> (484,930) -> (595,930) -> (595,1125) -> (514,1125) -> (514,1420) -> (576,1420) -> (576,1640) -> (494,1640) -> (494,1940).
West shaft: (205,300) -> (205,1850). East shaft: (800,270) -> (800,1880).
Crossovers: (205,450) - (558,450); (205,900) - (595,900); (205,1460) - (576,1460); (205,1825) - (494,1825); (558,350) - (800,350); (484,760) - (800,760); (514,1190) - (800,1190); (576,1640) - (800,1640); (494,1850) - (800,1850).
Connectivity is proven from the **exact Midge spawn** to **each exact site** at 19x15, 23x19 and 31x27, with zero nearest-cell substitution; a separate 31x27 throat-block test verifies west/east bypass.

## Artifact and reproducibility

`build.cjs` is a fixed-seed, dependency-free Node.js builder. Run `node build.cjs` from any directory: it rebuilds `setup-severed-counterweight.json`, `qualification.json` and all full-resolution material-identity indexed PNGs in its own directory, then reopens/decodes every generated PNG in memory to check chunk CRC, zlib, Adler-32, IEND and per-cell ID parity. The source grid is reconstructed from hand-authored geometric primitives and exact route masks, never derived from a source image or compressed/reprojected reference PNG.

**JSON format:** ordinary Workbench Setup-v2, not a fabricated generated-start receipt. Ordered, nonoverlapping, vertically coalesced rectangular edits exactly reconstruct the 2097152 source cells. JSON bytes 186196 / 1,048,576, 10179 rectangles / 32,768 source max, 948067 painted cell writes in a 32000000 theoretical work envelope.

**SHA-256 identity:** material grid `fe86695ae3d9529bb3b39566328baffd5a78965ab44c293bd8ba48c66306ccd2`; JSON `c50f385fa8f967831db89fed0c26820755dcb28c528719d2bd7aef154d9b9f4c`.

**Physically fixed materials:** `38:1242 40:95383 50:50785 58:165055 62:113346 64:2381 65:86666 68:18737 69:11523 72:3162 73:9145 76:16937 77:3402 78:424 79:5170 100:184304 101:91359 119:23166 120:1435 130:52924 131:4996`. All are accepted-main Solid/non-movable/RuleKernel::None; only Water (3) is dynamic, within the walled lower quench basin. Visual metal pipes and LEDs are material cells, not sprite decals.

**Render evidence:** `overview.png` is the complete 1024x2048 material map; the five numbered crops are native 1:1 unresampled windows of that *same cell grid*. These are palette-identity PNGs, **not** Godot screenshots, not AI concept art, and not a claim that the native renderer has been tested.

## Actual-cell art review and repair log

Viewed the *complete* 1024x2048 identity-plane PNG and the 1:1 crops. Initial composition was too skeletal through the ore and rail levels, with small isolated fittings. Revised the physical grid rather than painting a cosmetic preview: mounted a 136x132 east-side crusher cassette and a 111x62 service subdeck, inserted a 126x95 pressurized switch rack and a large 120x152 salvage hoist. Each is attached to existing spines, braces or cable tracks.

1. **Crown 1:1:** the status/workshop shell read as a disconnected box; added wall brackets and two explicit roof hangers. The silhouette now has asymmetric intakes and an inhabited dispatch room.
2. **Counterweight 1:1:** strong hung counterweight and left winch bank, but the control panel lacked attachment; added a steel bracket to its permanent pier. Lateral bridges terminate at deliberate flight apertures, not accidental holes.
3. **Crusher 1:1:** the previous midshaft had too much empty striping and insufficient machinery; mounted a large braced crusher cassette, rail brackets and a subordinate hoist dock. Source grid inspection confirms the offset Midge tube remains open.
4. **Rail 1:1:** repetitive cross-trusses needed one clear focal function; added a lit pressure switch rack tied to the east pipe main, retaining west/east crossovers.
5. **Quench 1:1:** the right flight carving had opened the coolant vessel lid; repaired this *after* all corridor erasures, explicitly checked every perimeter cell, and reran 31x27 center flood-fill and main-throat bypass.

**Remaining artistic limitation:** machinery is made of true physical material cells, so several gantries have intentional large aircraft-clearance gaps and cannot visually behave like a continuous solid deck. The high-level east/west service supports repeat for structural plausibility. This is a gameplay/engineering compromise, not final owner art acceptance.

## Shepherd-directed R3 industrial physical-cell rework

18 November 2026: independent original-art audit and Shepherd both requested substantive redesign of the same lane-owned PR, not another original branch. This post-baseline sculptural pass changes **93,351 exact material identities** through 224 deterministic rectangle/line operations, guarded away from every primary 31x27 navigation corridor and exact site.

- **Severed counterweight cathedral:** an offset 167x180 riveted suspended load, broken copper-steel suspension and heavy twin catch trusses now establish a clear damaged-machine focal point, retaining the side bypasses.
- **Ore chain:** a framed west feed-hopper, nested discharge throat and east-stage reinforced enclosed cascade, visually connecting assay/crushing toward transfer without sealing the Midge through-routes.
- **Rail switching yard:** an asymmetric truss/switch drum at the central west edge, hanging eastern cargo cradle, loading braces and apron replace the prior nearly vacant repeated truss tier.
- **Different wall districts:** expanded west foundry nook and lower service gallery contrasted against elevated east utility/electrical rooms; local geometry changes without damaging the main bridge spans.
- **Salvage/quench:** a ribbed heat-shield furnace and overhead handling beam turn the lower equipment into a more legible destination, preserving all 6,525 physical Water cells and their sealed vessel.

**Actual-cell evidence:** the complete material-ID plane and five original 1:1 windows were regenerated from these same cells, and rechecked by PNG chunk CRC, zlib/Adler, IEND and every indexed material pixel. Self-critique: mechanical load paths are clearer but some service shafts retain repeatable functional steel modules; no active elevator motion or native coolant stability is asserted.

**Independent bounded gates:** the 19x15 / 23x19 / 31x27 fully contained envelopes still reach all original 11 exact coordinates; blocked central throat retains a 31x27 bypass. 8176 nonoverlapping rectangles, 149799 JSON bytes, 885624 painted cells; 0 replay mismatches. **NATIVE-UNTESTED** until a source-compatible installed GDExtension confirms constructor capacity, simulation, collision and fresh save/reopen.

## R4 physical structural closure

Seven former major (>10000-cell) detached industrial assemblies now have genuine cardinally connected steel paths to world-edge-anchored Solid. The transverse crusher-to-exchange bridge and rising ore-transfer conduit connect previously disconnected process groups. The eastern gravity downfeed is purposefully interrupted by a 57-cell flight-passage gap; there is no false claim of a seamless moving conveyor.

R4 changed 11419 actual material identities, including 7909 in former protected route space. The old ROUTES coordinate arrays are original design wayfinding guides, NOT a claim that every straight crossover remains unobstructed: selected service channels are interrupted by grounded braces. The full 19x15, 23x19 and 31x27 exact-centre traversability graph, 31x27 blocked-main-throat recovery, and all named sites are rebuilt from final cells and retested.

Seven named large assembly witness points and all unanchored components above 1000 cells are listed in qualification.json. Remaining unanchored smaller static cabinets (>1000 cells): 6; these are not represented as physically anchored and warrant further finish review. The 2D world has no true structural stress model. Native Workbench input, collision, Water settling and fresh-process save/reopen remain NATIVE-UNTESTED.

## R5 broken-counterweight / industrial operation rework (18 November 2026)

A final original-cell construction pass responds to the independent R4 Fidelity Auditor and Shepherd REWORK. A fractured crown traction beam and deliberately broken paired cable paths terminate above a dramatically enlarged skewed counterweight body; the weight has been arrested by a real diagonal steel catch frame tied into the western pier. The visual is a static broken-lift disaster, not simulated motion. Added a supported crusher-discharge bridge and split feed with a deliberate open flyer passage, a rail hall with a single loaded cart and two separated tracks, and safe quench viewing balconies. No Water identities or quench perimeter were edited.

R5 changed 75382 final material identities. Significant detached static assemblies >1,000 cells went from 6 (R4) to 1 (R5). The current structural census, explicit bounds, all seven major anchored witnesses and three exact Midge hull results are recorded in qualification.json. Not every indicated straight guide is traversable after the support work: true exact-air connectivity is tested instead. The obstruction fallback is **bottom-terminal bypass only**; the mid-level ore exchange need not remain reachable when the main throat is artificially sealed.

The Setup-v2 receipt now distinguishes the JSON payload without its terminal LF from the actual committed file including that LF. Native bridge binary, input/collision, fluid ticks and fresh-process save/reopen remain **NATIVE-UNTESTED**.

## R6 original industrial level finish (18 November 2026)

Following the independent exact-R5 Fidelity Auditor and Shepherd REWORK, the huge louvered machine was recut into a fractured, asymmetric, angular counterweight face with broken crown-to-attachment cables and a compressed braced catch. It is static immovable engineering sculpture, not animated or falling machinery. The inherited shell retains some rounded outer casing; this remains a potential artistic weakness for independent review.

The ore operation now shows two segmented supported feed trays with intentional flyable separation, differentiated inlet/discharge ends and a bolted downstream receiving bin. No ore gravity-movement or mechanical transport is represented as running. The freight hall receives an open compact loading hood over the ONE existing loaded cart and two buffered rail termini. An upper transfer shield/handling threshold visibly joins the salvage apron toward the original sealed quench sump; there are no changes to the original Water cells or basin perimeter.

**R6 exact physical change:** 44496 of the 2,097,152 material IDs differ from committed R5; all 6,525 genuine Water ID3 cells are unchanged. All seven world-rooted machinery witnesses remain rooted and the sole 1,306-cell east control is explicitly independent non-loadbearing fixed console. No wall-mounted controls or gantries have active moving mechanisms.

**Playable route caveat:** all 11 author-specified unrelocated sites remain reached with 19x15, 23x19 and 31x27 fully contained Midge envelopes. The deliberate central obstruction keeps the BOTTOM TERMINAL reachable but does not assert redundant access to every intermediate site. The rail/ore transfer discontinuities are the literal collision-open passages, not accidental fake conveyor continuity.

**Material evidence/self-critique:** regenerated full overview and all five full-resolution 1:1 crops from the exact authored grid. The sheared cap is more angular, the crane hood aligns with its wagon, and east receiver is readable, while a large amount of negative airspace and regular side truss rhythm remain. Independent artistic/technical review is still outstanding; built-in PNG parity and offline access tests do not constitute native Workbench acceptance.

## Qualification and limitations

- Offline full grid, nonoverlap, exact replay, PNG structural/inflate/CRC and material-ID parity: PASS; see `qualification.json`.
- The source reader admits each extent component 512..2048 in multiples of 64, 32,768 stamps and 1 MiB JSON. `native_rectangle_budget()` may fall back to **4,096** without a bridge and otherwise asks the loaded compiled library, up to 32,768; our actual rectangle count must be compared to that installed capacity before loading.
- Midge pinned definition has a 4x3 rectangular hull; 19x15/23x19/31x27 are conservative inflated clearance envelopes, not dynamic flight guarantees.
- The source Setup-v2 validator uses live `CyberDemoBridge.inspect_interaction` to admit staged additional material IDs; absent the matching library, dynamic material admission is NOT verified.
- **NATIVE-UNTESTED:** no compatible Workbench runtime was available for loaded native `rectangles()`, actual world install, user input, collision, pressure/Water settle, rendering, save/reopen across a fresh OS process. Rebuild the matching GDExtension and run these gates before claiming compatibility.
- Quench fluid is statically contained in a reinforced basin; no time-evolved solver stability or leaks are claimed.
- Static lift sculptures are traversable architecture, not powered animated elevators.
- Draft/HOLD; independent fidelity and technical auditors, Shepherd and owner must review before status promotion.

## Required owner native acceptance

Use the engine SHA above. Rebuild/load the matching extension, query `CyberDemoBridge.workbench_start_rectangle_capacity`, run Setup.validate/rectangles, install the canvas, compare native material identities and render, pilot Midge to all named destinations, test loops and alternate approach, run the water simulation, save a uniquely named start, quit and reopen in a clean process, compare material and actor state. Refuse, do not degrade, if a capacity/policy/material check fails.

## Originality and ownership

Created solely for the `original/industrial-vertical` lane in `techrote/sandmapsreference`. No existing canvas, GitHub image, reference artwork, PR branch or CyberSand source was altered. Source files in `techrote/cybersand` were inspected only for schema/material/actor technical admission.

**Completion marker:** `ORIGINAL-CANVAS-INDUSTRIAL-VERTICAL: <current-head-sha>` (replace placeholder with actual PR HEAD in PR description).
