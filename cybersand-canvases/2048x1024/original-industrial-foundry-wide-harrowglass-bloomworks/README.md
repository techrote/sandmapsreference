# Harrowglass Induction Bloomworks — Original Industrial Foundry Wide

**Original-no-source · 2048×1024 actual CyberSand Setup-v2 cells · Draft/HOLD · static creator checks PASS · NATIVE-UNTESTED**

This work is an independently designed material-cell industrial plant, not a conversion from source images or another map. The signature is **a roof-length suspension truss over three ascending/descending induction crucibles, an open vacuum-transfer jaw, a very long four-station hot-bloom drawing line, and a luminous sealed water cassette**. Below, a dry cable-pressure service railway spans nearly the entire map. It is strictly flat orthographic side elevation; every drawn element is a material cell, not a decorative background.

## Gameplay identity and physical scale

**Mission:** fly Midge from the west receiving berth (68,495) to inspect the pneumatic ore lift, all three induction cells, the vacuum ladle and die, tandem drawing stations, coolant inspection, and the eastern shipment relay at (1979,570); return through the service railway if the overhead corridor is obstructed. Supply-shaft detours and inspection booths are genuinely accessible; dead ends have return routes.

Midge's currently accepted authored rectangle hull is 4×3 cells, with gravity, body thrust and contact tumble. Static route admission is deliberately stricter: full-body **19×15, 23×19 and 31×27** swept-centre envelopes, all integer in-bounds, cardinal four-neighbour paths. The overhead flight spine y208–278 is 70 cells high. Five access shafts are at x135–230, 500–589, 910–999, 1460–1551 and 1880–1967, with a dry underdeck detour through y806–978. These are actual material-free regions, not point-radius waivers.

## Functional districts and site route graph

| District (x) | Original mechanical function | Exact inspected locations |
|---|---|---|
| **West aerial freight** (50–430) | Ore cyclone, freight platforms, asymmetrical gravity charge belt, crew portal | West freight spawn (68,495), Ore cyclone inspection (291,312), Charging aisle (391,562) |
| **Induction ladder** (430–850) | Three differently proportioned, separately enclosed hot crucibles with copper coil bands and charge trestle | Induction crown (579,258), Coil yard (837,469) |
| **Vacuum handling jaw** (850–1240) | Open trussed transfer arch, suspended static ladle, dry crew hatch and side service bay | Vacuum gantry (1044,216), Vacuum service port (1155,575) |
| **Bloom drawline** (1240–1680) | Four unequal hydraulic/rolling presses, heated horizontal billet, walk-in control bays | Rolling control (1445,455), Caster exit (1675,548) |
| **Quench/export** (1680–2000) | Permanently enclosed blue water cassette, shielded inspection approach, dry dispatch rails | Quench overseer (1840,432), East shipment (1979,570) |
| **Subgrade service railway** (45–2002) | Rooted monitoring cells, power-feed conduit, sump diversion and alternative west–east rescue route | West underdeck (241,850), Power conduit (696,854), Vacuum sump (1081,860), Return tunnel (1804,851) |

**Main graph:** freight → cyclone → upper crane spine → induction → vacuum gantry/service → bloom presses → quench → shipment.

**Alternate graph:** west freight → western deck portal → underdeck rail → central maintenance → eastern access portal → dispatch; the real 68×70 physical upper-spine obstruction at `[1230,208,68,70]` leaves all fifteen exact 31×27 destinations reachable.

## Accepted engine, laws and admission

**Read-only engine authority:** `techrote/cybersand@de109d0131641d6adc8d25bb9ced7ca3d4991105`, Setup-v2 Workbench/generated-start and `native/include/cybersand/material.hpp`; authored Midge from `godot/authoring/flyers/midge.json` with model hash `c226d73ae56a426820d2ef842a4856bf79ac23efabe64e66569dff8de62a7a96`.

Every structural occupied material uses an accepted **Solid / RuleKernel::None** building ID: 57, 58, 62, 65, 66, 68, 69, 72, 76, 77, 79, 100, 104, 117 or 131. The only mobile/reactive materials are **Water #3** and **Lava #8**, each enclosed with **zero initial fluid-to-empty faces**. Molten visual styling within the separate firebrick/shield tubes is intentionally static at start; this is not a claim of a simulated steelmaking process.

- Exact full final indexed plane: **2,097,152 cells**, SHA-256 `aeae149888b4c1461c745ffa5806e0e547bf9a80146f70cb52816573115cd308`.
- Nonoverlapping, lossless row-run/vertical-merge rectangle edits: **2194** (source cap 32,768; possible installed fallback 4,096).
- Setup-v2 `setup.json`: **41551 bytes**, below 1 MiB.
- Construction writes: **688417**, below 32,000,000.
- Grounded inert-solid connectivity: **648019/648019**, detached **0**.
- Initial Water / Lava: **18240 / 22158** cells; fluid-to-empty faces **0**.
- All fifteen exact destinations: **15/15** at each of 19×15 / 23×19 / 31×27 and **15/15** after the real blocked-upper-spine test.

## Determinism and artifact proof

Run `node generate.cjs && node verify.cjs` inside this directory. `build.cjs` rebuilds every final cell; `format.cjs` writes 8-bit **material-indexed** PNGs with a deterministic DEFLATE stream and the accepted material RGB palette; `audit.cjs` independently replays edits and verifies grounded solids and actual Midge centre flood. `verify.cjs` independently parses the committed PNG chunks (signature, CRC, zlib inflation, IEND, filter byte and every pixel ID), compares the replay grid against the generator, and checks receipt SHA-256 and every exact site.

Committed evidence: `setup.json`, `receipt.json`, `overview.png` (full native 2048×1024 material index plane), and **six authentic 1:1 district crops**. None is a concept rendering or mock engine screenshot.

**Native qualification is not established.** Actual installed bridge admission, Midge controls and collisions, Rapier progression, fluid/heat evolution, saved-area persistence and fresh-process save/reopen are **NATIVE-UNTESTED** until executed against identified binary/source hashes. Retain this PR as Draft/HOLD for independent Art/Tech/Shepherd audits. No owner acceptance, merge or Ready transition is inferred.
