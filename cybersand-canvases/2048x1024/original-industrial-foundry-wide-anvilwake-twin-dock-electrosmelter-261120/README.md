# Anvilwake Twin-Dock Electrosmelter — ORIGINAL 2048×1024 CyberSand canvas

**Draft/HOLD; creator SOURCE-STATIC PASS; independent Art, Technical and Shepherd reviews pending; NATIVE-UNTESTED.** Do not merge, promote Ready, or treat this as owner acceptance.

This is genuinely authored perpendicular 2D side-elevation industrial geography. It does not reproduce an illustration or share any former landscape's geometry. Fresh from accepted `sandmapsreference main@99a166e7fcae45eb22be1740e9f33f62faccbcc7`; accepted **READ-ONLY** CyberSand authority `main@de109d0131641d6adc8d25bb9ced7ca3d4991105`. Deterministic seed `0x261120a9` (decimal 638656681).

## Physical manufacturing location

The ore dock (west) weighs and side-tips dry charge into **two independently shaped, fully enclosed induction smelters**. A large counterweighted bridge with suspended dry receiving crucible occupies the centre. A defended, grounded transfer line leads east to **two unequal horizontal continuous-casting drums**, extraction and shear, **two fully sealed quench tanks**, then a guarded outgoing rail-loading dock. The skyline has five unequal sloped industrial roof segments, a tall central inverted crane arch and two functional open-roof egress shafts. Lower excavated machine rooms include a dry-wagon pump, piston teardown, coil rebuilding, hydraulic control laboratory, spindle service, and filter/pump benches. Every machine has an inert load path to a boundary-anchored structure, with no artificially floating solids.

This is *geometry*, not an assertion that the furnace, transfer hardware, machinery or cooling plant is animated or has scripted manufacturing interaction. The only liquids present at time zero are **15,603 molten Lava ID8 cells inside insulated sealed hot chambers** and **6,640 Water ID3 cells in sealed cassettes**. Native fluid and heat evolution remain untested.

## Flight graph planned as real traversable space

Spawn **Ore arrival** `(101,232)` → **Charge gantry** `(363,231)` → **Left/Right induction hearth** `(476,231)`, `(699,233)` → **West transfer inspection** `(832,231)` → **East counterweight escape** `(1210,274)` → **Ladle gallery** `(1186,232)` → **Drum drive** `(1306,232)` → **Second drum** `(1455,232)` → **Shear** `(1594,233)` → **Quench** `(1741,232)` → **Outbound dispatch goal** `(1970,232)`.

Physical separation matters. The crane occupies substantial upper space. There is no invented direct route *through* its solid casing. The **upper alternative** uses two fully open roof egress portals near x709–794 and x1384–1485 with in-bounds conservative whole-body clearance around the highest roof. The **lower dry return** descends west shaft x198–310 to six enterable maintenance sites around y810, traverses a lower 101-pixel excavated passage, and returns up east shaft x1828–1942. Both sky and lower routes are connected to the named main districts. At each destination the original exact centre is evaluated without translation or nearest-free substitution.

**Real collision test:** for conservative 31×27 Midge envelope, a real extra solid 48×37 obstruction `[908,790,48,37]` placed on the lower transit changes the exact spawn→outbound-dispatch shortest four-neighbour legal-centre path from **3,011** to **3,085** steps (**+74**) without moving the spawn or any of the **21** real named sites. This is a separate test grid; the committed actual world is unchanged by the obstruction.

## Reproducible material contract

Run `node build.cjs` from this directory to generate exact Setup-v2, receipt, full overview and six true unscaled 1:1 indexed-material PNG crops. Run `node build.cjs --verify` to byte-match every generated artifact against the committed bytes. All seven PNG images are produced directly from final material ID cells (no AI imagery, no screenshot substitutions), with PNG signature, IHDR, PLTE, per-chunk CRC, stored-deflate, Adler-32, IEND and material-pixel identity tests in the builder.

- 2,048×1,024 **2,097,152** actual material cells; full grid SHA-256 `0c8753e36942fca2f9e72ce4e543900933a2c853136729126b7fa4e7791af395`.
- **2,417** canonical lossless ordered disjoint Setup-v2 rectangles, **46,242** JSON bytes and **952,134** construction cell visits. Within the accepted **32,768** source rectangle / 1 MiB JSON / 32M work limits; also below **possibly installed, unverified 4,096** rectangle fallback.
- **929,891 / 929,891** inert solid material cells ground-connected; **0 detached**. No falling support material, unknown material IDs or exposed mobile-fluid faces.
- **6,640 Water** and **15,603 Lava**, **0 initial fluid-to-air cardinal faces**, **0 direct Water–Lava contacts**.
- **21/21** named sites PASS full-body free-centre 4-neighbour reachability at each of **19×15, 23×19 and 31×27**, including **21/21** at 31×27 with an actual extra obstruction, with positive shortest-path detour above.
- Seven genuine cell-index PNGs: `overview.png`, `01-ore-dock.png`, `02-dual-hearths.png`, `03-gantry-ladle.png`, `04-horizontal-drums.png`, `05-quench-export.png`, `06-underplant.png`. The committed receipt contains all crop extents, hashes and byte counts. **2,952,618** indexed source-pixel parity comparisons passed at construction time.

## Qualification gates

The complete deterministic builder independently replays every material cell from its rectangles, rejects overdraw/overlap, validates all three conservative Midge hulls, performs all-inert-solid boundary-grounding flood and detects initial fluid leaks. Source hash, Setup hash, full material histogram, site distances, injected obstruction and PNG metadata are retained in `receipt.json`.

**NATIVE-UNTESTED:** no compatible installed Godot / Workbench / CyberDemoBridge / Rapier binaries or installed bridge handshake were executed. No actual Midge input, collision, physics frame progression, dynamic molten/water flow or fresh-process save/reopen is asserted. Native capacity, performance and real gameplay remain separate downstream gates. Source static proof does not equal native PASS. Independent exact-HEAD Art, Technical and Shepherd review is explicitly required.

No other original-map PR, creator branch, historic reference art, CyberSand engine, schedule, permissions or unrelated files are to be modified as part of this artifact.
