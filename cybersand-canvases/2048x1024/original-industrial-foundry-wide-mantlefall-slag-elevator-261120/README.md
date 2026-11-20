# Mantlefall Slag Elevator — original 2048 × 1024 material-cell foundry

**Draft / HOLD · ORIGINAL-NO-SOURCE · creator STATIC-PASS · independent Art/Technical/Shepherd PENDING · NATIVE-UNTESTED**

This is a completely invented, perpendicular **2D side-elevation** CyberSand workplace: a deep slaglift excavation supporting a giant tapered coke-to-melt shaft and offset suspended counterweight. This geometry is not derived from any source image and does not reuse the previous foundries' map layouts. All visual evidence is produced from the final full-scale material IDs, not AI-generated scene art.

## Designed production chain and deliberate playable spaces

1. **West ore landing and skip works** (x 60–488). Dry freight hoppers, diagonal operated ore feed and operator cabins sit beside a usable western rescue riser.
2. **Mantlefall tapered shaft furnace** (x 490–780). A distinctive inward-tapered, circumferentially braced chimney, sealed inner Lava #8 heart, ceramic firebrick casing and asymmetrical cooling hookups occupy the deepest central macro-silhouette.
3. **Counterweight + ladle service** (x 775–1240). A separate overhead tram and counterslung lift feed a supported gantry and suspended dry ladle. The operator throat deliberately has a conservative-hull-sized access portal rather than an impassable scenic illusion.
4. **Stepped casting and shear** (x 1260–1600). Four unequal enclosed mould cells, differentiated inspection housings, rollers and an independently supported shear station establish a clear downstream handoff.
5. **Three sealed quench cells and freight gate** (x 1605–1990). Isolated Water #3 reservoirs, protected transfer pipes and departure coupling form a separate cold process, away from the heated furnace.
6. **Subgrade service railway** (y 759–907). Six different mechanical maintenance workfaces line an intentionally open 76-pixel-tall recovery lane. The two dedicated 94/96-pixel wide vertical risers allow recovery after mistakes; the rooms are not decorative scenery.

The primary exploration moves west-to-east through the upper and midline plant galleries with shaft transfers where grounded structural piers interrupt flight; a lower excavated service railway and the opposite riser form the deliberately redundant return path. The retained plant is physically grounded. Open high sky contrasts with the furnace, machine housings and compact lower service workshops. No isometric tops, forced perspective or inaccessible scenic floor is counted as traversable.

## Actual source and fixed-seed reproduction

- Exact original plane: **2048 × 1024 = 2,097,152 material-ID cells**.
- Seed: **261120113**; builder: `node build.cjs`; strict byte/hash, PNG and grid replay verification: `node build.cjs --verify`.
- Grid SHA-256: `f99dc6a967055c5ee0984a0a924a95e3ce8b92a6f52fe77365e81ae132d915ed`.
- Setup JSON SHA-256: `4a9bfb61fd2325cbaf6c3b552cc5b614a854c3e9d6f3318976b4b58fa699cd75`, **37766 bytes**.
- Lossless nonoverlapping five-field Setup-v2 edit rectangles: **1994**; construction work: **757257 cell visits**. Source cap 32,768; potentially installed fallback **4,096**. Actual installed bridge handshake/capacity has NOT been measured.
- Exact full grid replay: all **2,097,152** cells, zero invalid/out-of-bounds/overlapping stamps.
- Grounded stable inert solids: **745289 / 745289**, detached **0**. Support closure adds **1** short steel connector cell to a previously detached auxiliary, maximum connector length **1**.
- Initial Water cells: **7546**; Lava cells **4422**. Initial fluid-to-empty faces **0**; direct water/lava interfaces **0**. These are time-zero containment checks, NOT a dynamic solver stability claim.
- All materials used are accepted read-only source-defined stable/inert building materials or the two explicitly separately contained reactive liquids. No sand/other falling construction foundations.
- Accepted read-only engine authority: `techrote/cybersand@de109d0131641d6adc8d25bb9ced7ca3d4991105`; repository base main `99a166e7fcae45eb22be1740e9f33f62faccbcc7`. These are **source** assumptions, not an installed-native result.

## Full-hull exact-centre flight and fallback route evidence

Each declared coordinate is tested *in place* with an entirely in-bounds empty rectangular envelope, using 4-neighbour BFS on valid free centres — never target snapping, radius waivers or proximity substitution. Spawn is **(97,283)**.

| Full Midge envelope | Exact sites reachable | Connected free centres |
|---|---:|---:|
| 19 × 15 | 19/19 | 1050702 |
| 23 × 19 | 19/19 | 1020865 |
| 31 × 27 | 19/19 | 962611 |

**Real obstruction experiment:** physical solid insertion at `[1004,200,74,466]` on a separate test copy, overlapping the primary upper service throat, followed by exact 31×27 four-neighbour retesting. All **19/19** named sites remain reachable via the separate subgrade recovery route; blocked run connected **940563** free centres.

| # | Exact named site | Cell centre | 31 × 27 clearance / reachability |
|---|---|---|---|
| 1 | West ore landing | (97, 283) | PASS |
| 2 | Dry charge exchange | (263, 286) | PASS |
| 3 | West rescue riser | (365, 529) | PASS |
| 4 | Furnace crown access | (518, 280) | PASS |
| 5 | Counterweight inspection | (803, 225) | PASS |
| 6 | Hot throat overlook | (667, 284) | PASS |
| 7 | West transfer catwalk | (936, 280) | PASS |
| 8 | Ladle service bridge | (1101, 280) | PASS |
| 9 | Mould crane access | (1288, 280) | PASS |
| 10 | Caster stage three | (1469, 281) | PASS |
| 11 | Quench inspection | (1631, 281) | PASS |
| 12 | East recovery riser | (1796, 520) | PASS |
| 13 | Freight gate destination | (1948, 280) | PASS |
| 14 | Vent cyclone | (183, 795) | PASS |
| 15 | Cooler repair | (557, 796) | PASS |
| 16 | Ballast shop | (865, 797) | PASS |
| 17 | Gear-repair gallery | (1256, 798) | PASS |
| 18 | Return scrubber | (1614, 799) | PASS |
| 19 | East dispatch relay | (1907, 797) | PASS |

## Committed indexed material-cell PNG evidence

`overview.png` is the **entire 2048×1024 ID plane** rendered as an 8-bit indexed-material PNG. The six other PNGs are literal 1:1 pixel crops of that same final plane. Each image has PNG signature/IHDR/PLTE/IDAT/IEND checks, complete zlib CRC/Adler checksum validation and **zero** source-ID pixel mismatches. Checks cover **3013787** image pixels including the overview. No source art, generated painting or mock native screenshot is substituted.

- `overview.png` — [x,y,w,h] `0,0,2048,1024`, PNG SHA-256 `96f3fda4d0b899b08d13bee6c407e8bfcc053250e91b0212e37b1191ea9a47e5`.
- `01-ore-skip.png` — [x,y,w,h] `64,387,430,297`, PNG SHA-256 `2e0032ee180b3da79153197a193c2bf6fe3eb1c7effdbf11a4a4e65cdf30a572`.
- `02-tapered-furnace.png` — [x,y,w,h] `488,300,324,383`, PNG SHA-256 `d8f6aaa3526dbebafb802e087d065b2f529d0ca48f2790bb7da098cbd9358f9b`.
- `03-elevator-and-ladle.png` — [x,y,w,h] `774,236,448,448`, PNG SHA-256 `9cc37537a67c3a41e29be5fc2cdc9f05b68d69b95bb445d5b10fe36446fffe10`.
- `04-stepped-caster.png` — [x,y,w,h] `1265,446,337,237`, PNG SHA-256 `2257b6ed87eeafbb26391f95660bfa3365721c0e4db463f772bf71a869d0294f`.
- `05-quench-and-dispatch.png` — [x,y,w,h] `1590,452,400,233`, PNG SHA-256 `9c910da30e16b9c0b0473167c3be007e6a5bcea88813536c760281b050b6b925`.
- `06-subgrade-maintenance.png` — [x,y,w,h] `72,751,1890,154`, PNG SHA-256 `fe3734ca8b909190011f1051eb11667040135ec36c918a3595002df893102409`.

## Mandatory downstream gates

**NATIVE-UNTESTED:** no compatible Windows/Godot/Workbench/CyberDemoBridge/Rapier executable was run in this construction environment. Native Setup admission, dynamic input and collision, fluid/rule progression, installed rectangle capability and fresh-process save/reopen all remain outstanding. In particular, the 32,768 source contract must not be confused with measured installed DLL/SO capability.

This is a creator-static exact-material receipt, not independent art/technical approval or owner acceptance. Keep the PR **OPEN Draft/HOLD**; request independent Art/Technical/Shepherd review against the final PR HEAD, then native qualification separately. Do not merge or mark Ready.
