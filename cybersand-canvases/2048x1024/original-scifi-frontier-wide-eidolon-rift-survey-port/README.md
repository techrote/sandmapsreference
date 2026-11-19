# Eidolon Rift Survey Port — original CyberSand sci-fi frontier world

**Status: OPEN Draft/HOLD only; creator-level static geometry checks passed, independent art/technical/Shepherd review and native acceptance PENDING.**
**No reference images, traced photographs, historical map conversions or engine/source modifications.** True perpendicular side elevation. All renders are authentic material-ID cells, one image pixel per actual cell.

## Physical scale and world concept

2048×1024 world: a decommissioned extrasolar survey port spanning an eroded fault plain. An arriving Midge pilot begins in a weathered shuttle exchange to the west, gains control of a solar signal mast, enters a two-storey xenolith processing wing, crosses the suspended rift freight/sky tram, examines an instrumented quartz meridian, sorts cargo and samples at the industrial east complex, and explores the buried silicate records below the central fault. The site was physically imagined for 4×3-cell Midge gameplay, rather than enlarging a small picture to fill the canvas.

**Original districts and negative-space plan:** (1) Solar landing civic exchange/antenna (x54–404); (2) double-storey regolith and xenolith geology wing (x416–803); (3) broad freighter rift and split flight heights (x803–1289); (4) Glass Meridian observatory, spectral sample access and true air portals (x1290–1589); (5) east customs, industrial sawtooth workhall and sorting equipment (x1616–1969); (6) distinct buried silicate archive (x917–1300, y900–994). High open-air access, enclosed medium interiors, supported lower geological access, and both short and long return routes create different navigational choices.

## Exact spawn and named destinations

**Spawn: Landing Exchange (272,571).** Never snap an objective to a nearby legal point.

| Site | Exact centre | Route status |
|---|---|---|
| Landing Exchange | (272, 571) | Both high and low transit connect to the same 31×27 centre graph |
| Solar Mast Control | (242, 332) | Both high and low transit connect to the same 31×27 centre graph |
| Geology Receiving Hall | (514, 590) | Both high and low transit connect to the same 31×27 centre graph |
| Xenolith Analysis Chamber | (700, 594) | Both high and low transit connect to the same 31×27 centre graph |
| Rift Sky Tram | (995, 570) | Both high and low transit connect to the same 31×27 centre graph |
| Fault Descent | (1002, 824) | Both high and low transit connect to the same 31×27 centre graph |
| Glass Meridian Observatory | (1390, 510) | Both high and low transit connect to the same 31×27 centre graph |
| Spectral Sample Gallery | (1434, 665) | Both high and low transit connect to the same 31×27 centre graph |
| Eastern Cargo Customs | (1696, 620) | Both high and low transit connect to the same 31×27 centre graph |
| Foundry Sorting Hall | (1843, 652) | Both high and low transit connect to the same 31×27 centre graph |
| Deep Silicate Archive | (1107, 942) | Both high and low transit connect to the same 31×27 centre graph |

All **11/11 named sites** are exact-centre free and reachable by 4-neighbour BFS at **19×15, 23×19 and 31×27** fully in-bounds conservative envelopes. The routing contract operates on actual final material IDs (solid=occupied), not visual approximation or image-colour heuristics. Both high/low central route choices and independently inserted obstruction alternatives are tested.

The engineering finisher `repair-admission.cjs` applies fixed material-cell airlock geometry and rooted load connections, cuts the **minimum-occupancy-weighted** clearance passage from any disconnected exact destination to the already accessible flight network, then culls all residual unsupported fragments as a deliberate structural safety policy. This process is deterministic and does not shift or rename objectives. Notable direct authored additions: west Landing→Geology receiving exchange, meridian side service entry, freight return throat and rooted meridian structural tether. Large geological and aerial voids remain intentionally negative.

## Reconstruction and qualification

Rebuild on Node 22+: `node build.cjs`. Reproduce byte-identical artefacts with `node build.cjs --verify`. Build contains indexed-PNG DEFLATE/CRC verification against every source material cell, an ordered-rectangle full replay and three conservative flight BFS checks. The generation seed is **2611190120**; changing it is not implied or needed for replay. **No imported artwork** is required.

| Machine-check field | Current result |
|---|---|
| Accepted READ-ONLY CyberSand main | `de109d0131641d6adc8d25bb9ced7ca3d4991105` |
| Setup-v2 loader Git blob | `70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9` |
| Material catalogue Git blob | `dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3` |
| Midge authored actor blob | `228399e38a0e0ab215b9f48698edce67a7a35799` |
| Original generator Git blob at publication | `a4d73ff11066871ca819acde15d1cc0f437f7c5f` |
| Full actual material plane | **2,097,152** cells (2048×1024) |
| Grid SHA-256 | `b51d2e1d3d204fc634a31cda3dd4f0b940febca63face3ebc8c474c733e4bba5` |
| Grid FNV32 secondary | `844c45bf` |
| Setup SHA-256 | `775a555533cf6068eb45586a69707527bbf702cd2a15df96344a91b75dddde33` |
| Nonempty stable occupied material cells | **505,849** |
| Nonoverlapping ordered rectangles | **3,019 / 32768** |
| Setup JSON UTF-8 bytes | **58,187 / 1048576** |
| Work cell budget | **505,849 / 32000000** |
| Illegal IDs / overlapped rectangles / replay mismatches | **0 / 0 / 0** |
| Fully rooted solids | All retained; **49** unsupported parts (total 17,025 cells) excluded at generation |
| Midge legal and connected | **11/11** at each of the **19×15, 23×19, 31×27** envelopes |
| Alternative route: real 31×27 obstructions | **4/4 PASS**, eight cross-district critical sites remain reachable |
| Actual complete overview + district crops | **7** real 8-bit indexed PNGs; palette index equals source material ID |

**Physics assumptions from accepted native definitions:** Uses 49 Slate, 58 ReinforcedConcrete, 62 SteelPlate, 100 BasaltColumns, 102 AdobeBrick, 114 AluminiumPanel, 118 GoldLeaf, 121 FrostedGlass and 129 SolarPanel exclusively. All are accepted Solid, non-movable, `RuleKernel::None`; no sand, powder, water, lava, mobile/combustible/reactive foundations. Blank pixels are ID 0 Empty. Every structural island retained after repair touches a world boundary, grounded geological mass or constructed support; detached decorative remnants are removed from *the committed plane*, not excluded only from statistics.

## Genuine actual-cell gallery

![Eidolon full material plane](overview.png)

District crops are genuine **unscaled 1:1** rectangles taken from the same final grid (not AI concept art): [Landing](01-west-landing.png), [Geology laboratories](02-regolith-labs.png), [Rift transit](03-rift-transit.png), [Glass Meridian](04-meridian-observatory.png), [Eastern freight hall](05-eastern-freight.png), [Deep archive](06-deep-archive.png).

## Limitations / gates

**NATIVE-UNTESTED**: No matching installed Godot/CyberDemoBridge/Rapier binary was available in this generator environment. The accepted source advertises 32768 rectangles; a legacy installed bridge may only admit 4096. The current 3019 edits are under both thresholds, but no installed-binary capability handshake, Workbench import, actor collision/physics advance, or fresh-process save/reopen has occurred. Static path/BFS checks are not equivalent to a successful native playtest. Independent art/technical/Shepherd exact-HEAD reviews are REQUIRED; creator-level pass is not owner acceptance. Keep Draft/HOLD, do not merge/promote/auto-merge.

