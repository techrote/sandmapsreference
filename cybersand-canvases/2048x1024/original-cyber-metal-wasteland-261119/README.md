# Relay Verge — ORIGINAL cyber metal wasteland (2048 × 1024)

**OPEN Draft/HOLD · ORIGINAL-NO-REFERENCE · NATIVE-UNTESTED.** Original landscape designed from scratch. No reference artwork, source image or traced geometry was used. Every structure is placed by coordinates in `build.cjs`. Engine authority: CyberSand main `018bd09503d7f079ddac52e225c2f7daf8d678bf` (read-only). Midge actor hash and liquid policy are copied unchanged from the accepted racing canvas.

## Concept

A relay city has died in an ash plain. Its power relays still hang from the sky, its coolant basin still holds water, and its scrap-walkers still stand where they stopped. A small flyer threads the wreck through one clear band.

## Layers, left to right

1. **Ash flats (x 0–560).** Asphalt crust over packed earth, gabion rubble, three sheds with glass-block windows, a launch pad with guide lights, a fallen relay tower, and two derelict scrap-walkers.
2. **West shaft and culvert (x 556–1600, y 760–799).** A 40-cell underground culvert entered down a steel-railed shaft. Corrugated ceiling, concrete floor, low route.
3. **Coolant basin (x 1000–1300).** A heat-shield tank with a painted-steel floor and open water. Low enough to fly over.
4. **Terraces (x 1310–1480).** Three stepped solar banks with a phosphor front and a steel frame.
5. **Ceiling rig (above y 330).** Pendants hang from the top edge: a relay bowl on a heat-shield bridge, two aluminium lamp pods on cables, a beacon pendant at the finish. Nothing reaches the flight band from above.
6. **Beacon finish (x 1840–2005).** Neon-stripped barriers flank the finish; a uranium beacon hangs above it.

## Design rule: the band is the road

A flight band at y 432–458 is kept free across the whole width. Every ground barrier stops under y 500, so no wall cuts the route. Walls with holes were tried first and abandoned: a hole through a wall leaves the piece above it floating, and any support column would cross the band. Overhead structures therefore hang from the top edge and end above y 330.

## Materials by role

| Role | Materials |
|---|---|
| Soil and ash | Asphalt (59) crust over packed earth (56); gabion rubble (112) heaps |
| Bedrock | Slate stratum (49), basalt columns (100), obsidian veins (101) |
| Robots and machinery | Corrugated (64), steel plate (62), rust (65) on barriers, rubber wheels (73), LED lamps (80), zinc gripper (113) |
| Relay and power | Heat-shield bridges and tanks (131), aluminium pods and bowl (114), uranium glass beacon and core (123), solar roofs (129), polymer boxes (128), phosphor fronts (127) |
| Neon | Cyan (77), magenta (78), amber (79) strips on barriers and the bridge |
| Culvert | Corrugated ceiling (64), concrete floor (58), steel pipe rails (68), cable (74) |
| Water | Coolant water (3) inside a painted-steel floor and heat-shield walls |

## Sites

| Site | Position | Notes |
|---|---|---|
| Launch pad | (150, 445) | Spawn |
| Ash gap | (560, 445) | Between barrier and rubble |
| Upper sky lane | (300, 110) | High route, west of the rig |
| Relay approach | (770, 360) | Under the relay bowl |
| Basin pass | (1140, 445) | Over the water |
| Terrace gap | (1595, 445) | Between terraces and finish |
| Culvert junction | (700, 780) | Via the west shaft |
| Culvert east | (1480, 780) | Along the culvert |
| Beacon finish | (1930, 445) | Under the beacon |

## Gates (enforced by the builder)

- **Reachability:** from the spawn, all 9 sites are reachable at 19 × 15, 23 × 19 and 31 × 27.
- **Grounding:** 0 ungrounded solid cells. Pendants reach the top edge; ground structures sink into the soil.
- **Reaction guard:** 0 fixes needed; 0 touching pairs remain.
- **Replay:** exact, 0 mismatches.
- **Budget:** 5,816 rectangles (limit 32,768); setup JSON 110,759 bytes (limit 1,048,576).
- **Water:** 5,113 cells, all inside the basin.

## Files

- `build.cjs` — deterministic builder. Run `node build.cjs`.
- `setup-relay-verge.json` — the setup.
- `stats.json` — grid and setup hashes, rectangle counts, flood results, histogram.
- `render/` — overview, review and routes images, five 2× districts and a manifest.

## Limits

- Liquids, powders and in-game behaviour are untested; the copy is NATIVE-UNTESTED.
- The layout is designed for flight in a single band; it has not been played.
- The liquid policy and Midge actor are copied from the accepted racing canvas, not re-derived for this map.
