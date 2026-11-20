# Vesper Ratchet Yard — ORIGINAL-LANDSCAPE-RACING-WIDE

**NEW, 2048×1024 full-grid material-cell world.** No reference image or historical geometry. No engine changes. Entirely perpendicular 2D orthographic side elevation; no isometric floor tops or scene-only platforms. **Creator source-static PASS; native gameplay NOT tested.** This project is a Draft/HOLD review candidate, not owner acceptance.

## Industrial location and physical design

An underground high-voltage **ratchet freight yard** built around a split crossbrace governor. Its long, shallow upper race lane is separated from the lower return by unequal tooth/diagonal steel structures; large volumes of genuinely empty air accommodate Midge flight rather than fake scenic space. All mechanical solids are actual accepted inert material cells, not decals. The arcing/ram-shaped profiles are static material barriers and should not be mistaken for animated actuators.

Distinct operating districts, west to east:

1. **West intake and ignition lock (x0–390):** asymmetric pressure diffuser over a boundary-rooted launching mandible; enterable intake operations room and tuning vault below.
2. **Ratcheted incline conveyance (x390–835):** three deliberately unequal roof/bedplate founded teeth, substantial full-body flight openings, a real machine-shop and roof dispatcher.
3. **Crossbrace split governor (x835–1285):** two separate sloped anchored trusses, genuinely different high/low traversals, an emergency service passage through the southern saddle, ratchet-watch office and lower coupling room.
4. **Cryoseal thermal recovery (x1285–1710):** four different rooted filter-coupling manifolds and two roof-hung relay vanes; separate thermal control and equipped filter service bay.
5. **East arrestor and return collar (x1710–2048):** roof-rooted upper braking horn and floor-rooted lower catcher, broad upper lift transition, enterable east dispatch loft and founded arrestor vault.

Every chamber entered by a free, broad material excavated shaft. Upper control desks and lower apparatus are grounded to the surrounding immobile structural supports. The builder deliberately prunes construction-candidate material islands **before** any encoding or proof; the final grid contains none.

## Exact route graph: conservative Midge centre checkpoints

**Lower outbound → eastern climb → upper west return:**

`Start / loading lock (143,649)` → `West launch portal (307,610)` → `Ratchet lead-in (438,599)` → `First slope lower (617,623)` → `Crossbrace entrance (839,599)` → `Lower bypass (1036,731)` → `Crossbrace departure (1246,559)` → `Cryoseal approach (1370,541)` → `Cold-array gate (1589,523)` → `East capture (1857,541)` → `East lift (1907,435)` → `East upper return (1877,325)` → `Sink return (1604,354)` → `Crossbrace return (1205,360)` → `West upper return (692,361)` → `West landing approach (258,435)` → `Finish / west loop (145,647)`.

**Alternative:** From `Crossbrace entrance (839,599)` ascend the real high-clearance passage to `Upper bypass (1010,366)`, descending after the split truss to `Crossbrace departure (1246,559)`. This is not a fake nearest-free substitute: both literal destinations pass 31×27 free-centre checks.

**Physical blocked-region proof:** In a copy of the final material grid, replace **(1320,482,130,72)** with accepted solid material 58, a genuine obstruction covering `Cryoseal approach`. The exact `(143,649)` spawn still reaches **27/28** original literal destinations at the full 31×27 envelope, including `Finish / west loop`; only the blocked Cryoseal approach becomes inaccessible. No snap, target-moving or radius waivers. A separate independent 28-leg BFS audit constrains each claimed local connection to the endpoint rectangle plus 400 pixels padding; all 28 pass. Static pathfinding cannot establish race speed, handling feel or dynamic collision interactions.

## Physical and output contract

- Grid: **2,097,152 exact final material-ID cells**, in reproducible authored order with fixed seed `0x261120b3`.
- Deterministic authoring `geometry.cjs`; generator `build.cjs`; strict independent validation `verify-independent.cjs`; local corridor audit `local-route-audit.cjs`.
- Final *zero-overlap* vertical-merged five-int Setup-v2 rectangles, literal `setup-vesper-ratchet-yard.json` with accepted **14 root fields**, 55-integer default liquid-policy envelope and `midge` at literal `[143,649]`.
- **Read-only accepted CyberSand engine source `main@7b03aa437561ec63e31fd09531171360ab60eeb4`** at run start: `godot/scripts/workbench_setup.gd` and `native/include/cybersand/material.hpp`; `godot/authoring/flyers/midge.json` is a 4×3 hull. Source accepts 32,768 Workbench paint rectangles, 1 MiB JSON, and 32M work cells. This does not override an installed bridge's independently measured handshake. Installed older interfaces may be **4,096**, so **4,408 rectangles exceed a possible legacy limit by 312**.
- Used IDs **49, 58, 62, 100, 101, 113, 117, 122** only in the final nonempty grid. These are accepted inert solid (nonmoving, RuleKernel None); material 0 is empty. No powders, falling unsupported supports, liquids, lava, reactives, sand or unrecognized IDs. Connected final solid inventory equals total solid inventory; no exposed liquid edges because no liquids.
- `qualification.json` stores exact grid/setup SHA256, histogram, all site coordinates, conservative clearance results, alternate obstruction, per-PNG CRC/zlib/pixel parity, source dimensions, count and budget details.
- `local-route-qualification.json` provides independently bounded 28-leg 31×27 travel checks.

## Authentic material-cell PNGs

`overview.png` is a true 2048×1024 indexed material-ID raster: one source-grid cell = one PNG pixel. Six additional images, with literal XYWH coordinates in `geometry.cjs` and source receipt, are **real 1:1 crops**, not rescaled images, concept art, AI generation, or native flight screenshots:

1. `01-west-intake-and-launch.png`
2. `02-sloped-ratchet-rail.png`
3. `03-crossbrace-switch.png`
4. `04-cold-array-and-couplings.png`
5. `05-east-arrestor-loop.png`
6. `06-enterable-plant-vaults.png`

In a directory containing Node 22+, run `node build.cjs`, `node verify-independent.cjs`, and `node local-route-audit.cjs`. These run locally without external packages and do **not** touch CyberSand source. The independent checker replays every Setup rectangle into its own grid, verifies counts/hashes, boundary-solids connectivity, the exact named 19×15 / 23×19 / 31×27 BFS envelopes, real obstruction, every source-pixel in every PNG after independent CRC/zlib extraction, and all input constraints.

## Open independent review and downstream gates

Request exact-HEAD **Art** (true 1:1 district character, readable high/low fork and control room functionality), **Technical** (accepted source identity, 14 keys, replay/clearance/PNG material and renderer law parity), and **Shepherd** (independently novel playable-level purpose, source geometry and original-lane ownership). Retain Draft/HOLD. **NATIVE-UNTESTED**: no compatible Windows Workbench/CyberDemoBridge binary available in this Linux environment; actual bridge capacity, Rapier/Midge collisions, flight speed/feel, progression, save/reopen and simulation behaviour not established. Do not mark Ready, merge, auto-merge or infer owner approval.
