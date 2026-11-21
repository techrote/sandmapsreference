# Spindlebreak Switchback Trestleworks — R6 bounded portrait repair

**OPEN Draft/HOLD · third-pass source-static generator PASS · second-pass independent Art REWORK at previous exact HEAD; new-HEAD Art/Technical PENDING · NATIVE-UNTESTED.**

This modifies only the existing 1024×2048 portrait folder on a new **stacked repair branch**. Original portrait [#192](https://github.com/techrote/sandmapsreference/pull/192) @ baseline `101203a124f0ee3ac5613d38956e72f0faae8685` and wide original [#135](https://github.com/techrote/sandmapsreference/pull/135) @ `a3f9962a0107d07bca1116940fde1c825ac76a4f` are read-only. Source-wide material SHA-256 `0c4f5136ef437bf27f00227f7cea4312b6fff7ff2aa228c1fdab1689043caf69`; no donor geometry transplanted.

## Independently observed defect and bounded architectural response

[Independent REWORK review](https://github.com/techrote/sandmapsreference/pull/192#issuecomment-7064489973): the source's **long high tension cableway** and **separately rooted deep truss** were condensed into short, bent, open-ended ledges/wires. The previous 187→337-step obstruction detour proved route change, **not** the claimed use of either engineered portal.

R6 strengthens the high bank-rooted *tension* machinery with two intentionally interrupted wire tracks, opposed mast heads, structural receiving brackets, light suspended deck halves, visibly distinct hangers, service airways and amber-marked cable/deck access. The **lower** system has opposing bank-rooted load paths, a much heavier triangular compression web, rooted deep piers, two unlike entered bearing portals and a lower-chord service opening. These are source-cell geometry, not an image overlay or decorative screenshot. Flight-sized openings in some long hangers and braces keep the real 31×27 Midge corridor available: a physically continuous floor-to-ceiling wall is not a playable cross-bank transfer. The broad central fault, spare human-editing volume, machines, industrial causality, 21 literal site centres and source identity stay intact.

## Exact material and technical gates

| Test | R6 generated result |
|---|---|
| Material grid | 1024×2048 = 2,097,152 cells |
| Grid SHA-256 | `5110336538bb8be20fe2c6b70d689b658faaf2c531f2f73acc7cb8d161ebccb0` |
| Ordered disjoint Setup-v2 rectangles | 1908 / 32,768 |
| Setup size | 36639 / 1,048,576 bytes |
| Material construction cells | 859457 |
| Rooted final stationary solids / detached | 854270/854270 / 0 |
| Contained Water / Lava | 2542/2645; exposed 0, contacts 0 |
| Exact named Midge 19×15, 23×19, 31×27 | 21 / 21 / 21 of 21 per hull |
| Obstruction retaining all 31×27 sites | 21/21; rectangle [440,1010,125,67] |
| Crown→lower landing direct→obstructed shortest | 187→337 steps |
| New **ordered high cable/deck portal route** | 583 steps across 4 explicit 31×27 legs |
| New **ordered lower truss/bearing portal route** | 923 steps across 5 explicit 31×27 legs |
| Source-pixel PNG parity | 3621927 checked pixels, zero generator mismatches |
| Native Godot/Workbench/Rapier, dynamic movement and save/reopen | **NOT RUN / NATIVE-UNTESTED** |

**Precise portal evidence:** `receipt.json.portal_routes` names all literal coordinates, ordered segment lengths, and requires true 31×27 free-centre BFS for each leg. High witness: west launch [345,799] → cable gap [488,800] → deck opening [565,915] → receiving slot [735,902] → east arrival [773,904]. Low witness: west footing [327,1156] → western bearing [370,1118] → central switchback [505,1170] → lower chord hatch [520,1252] → eastern bearing [690,1105] → east footing [756,1192]. This proves a *possible explicit route through named apertures*. It **does not** claim unconstrained shortest paths naturally select them, successful scripted transport, live gameplay, or independent reviewer acceptance.

## Exact reproducibility and gallery

Run `node build.cjs OUTPUT_DIR` to regenerate committed `setup.json`, `receipt.json`, the actual 1024×2048 indexed material `overview.png` and six authentic source-cell 1:1 crops. `node verify.cjs` should confirm byte equality against all nine output artifacts. Both existing crossing gallery crops **include left and right supports**: `03-high-cableway.png` exact [100,610,825,385] and `04-lower-trestle.png` exact [100,1000,825,280]. Machine and other gallery crops are regenerated at unchanged exact coordinates. PNG internal CRC/zlib and source-pixel parity are audited in builder. New-child independent Art/Technical verdicts, native runtime, and separate post-publication binary readback remain outstanding.

## Independent review requested

1. **Art/Transfer:** do the repaired cable/receiver and compression truss read as **mechanically distinct bank-to-bank systems** in true overview plus 1:1 crops? Are high/low portals coherent and industrial identities preserved without gratuitous fill?
2. **Technical:** fetch exact immutable repair HEAD, regenerate deterministic source and byte-match Setup, receipt and PNGs; independently recompute 21 literal 3-hull sites, rooted solids, containment, obstruction and two **ordered portal-waypoint chains**.
3. **Feature Atlas:** record the baseline failure under [FEATURE-ATLAS-001 #200](https://github.com/techrote/sandmapsreference/issues/200) and a *separate* after-state linked to exact child HEAD, without treating this author receipt as independent PASS.

Neither the parent portrait PR, donor, accepted engine/main, sibling repair lanes nor existing Atlas branch were edited. No merge or Ready promotion is authorised.

## Second-pass response to independent Art REWORK (current candidate)

[Independent first repaired-HEAD Art REWORK](https://github.com/techrote/sandmapsreference/pull/207#issuecomment-7069842512) confirmed that the original R6 lower truss was markedly improved but that the high crossing's western platform, under-ladle tension strips and east receiver still read as separate motifs. This second pass introduces visible opposed-bank octagonal pulley/sheave heads, bank-rooted return anchors/backstays, parallel overhead haul lines and sender/receiver brackets, with an intentionally **61-cell-wide open exchange seam** at X476–536, Y629–711. The high 1:1 crop was extended upward to XYWH [100,610,825,385] so both actual pulley heads, source-cell tension geometry, transfer deck and banks appear together. No material/image overlays were used. Geometry below y~750, the distinct lower-truss structure, all genuine fault voids, and unchanged 1:1 lower-truss crop remain protected.

**Exact parent→second-repair delta** relative to first repair commit `077777751d8757b127e95e028404b1cb2067f2b0`: 21353 changed material cells inside inclusive bounding box [97,602,926,826]. Old Art REWORK remains historically valid for its exact first-child HEAD. This second candidate is **not** independently Art/Technical accepted. Ordered high portal route remains feasible but its length changed to 583 steps; the 923-step lower portal chain is unchanged. Neither path claims to be the autonomous preferred shortest path.

## Third-pass bounded Art-P1 response: truthful interrupted cable

The [independent second-child Art REWORK](https://github.com/techrote/sandmapsreference/pull/207#issuecomment-7070530443) at `510bd91cacb4f1d777aff236d8ab3e8c51de192b` confirmed that the upper bank pulleys and lower V-truss are independently visible but the **upper haul lines terminate on either side of the 61-cell protected flight seam**; they do **not** form an intact operable bank-to-bank freight service. The specific remaining failure was an **architectural overclaim**, not a demonstrated route failure. This after-state does not claim a continuous cable or autonomous freight transit.

This third pass adds opposed amber clutch/coupling housings and visibly torn short cable ends to the existing two upper tension segments within **inclusive material bbox [453,660,560,680]**: **746** material cells differ from second pass. The facing couplings intentionally **do not connect** across the protected 61-cell-wide x476–536/y629–711 opening, so the scenario is now expressly an **interrupted aerial freight transfer / bridge-failure set-piece**, with two matching mechanical endpoints. The lower V-braced support system remains the independently described distinct source-static navigable truss; these are **NOT TWO FULLY FUNCTIONAL THROUGH-SERVICES**. Actual upper *flight* via ordered Midge portals is still possible, but it is not cargo hauled along a continuous wire.

A diagnostic, uncommitted candidate for a physically continuous solid wire spanning the protected upper gap caused the existing world source-static free-centre audit to drop to **5/21** reachable named sites at all three conservative Midge hulls (from 21/21). It was rejected, not published, because a solid bank-to-bank line sealed this particular 2D descent. This is a locally tested trade-off, not a claim about all possible cable designs. The committed candidate instead retains 21/21 and exact upper/lower ordered portal chains. Earlier Art REWORK is preserved as exact-HEAD evidence; this third-pass candidate requires a **fresh independent same-HEAD Art and Technical review** and is not native-qualified.

All seven gallery PNGs are generated from the same full material plane; only `overview.png`, `02-furnace-ladle.png` and `03-high-cableway.png` change binary pixels, with `04-lower-trestle.png` and the remaining three crops byte-identical. Fresh overview and full-span 1:1 upper cable crop show both the broken coupling ends and bank roots.
