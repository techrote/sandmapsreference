# Warden Scrapline — Fractured Trestle Salvage Port

**Original, fixed-seed 2026112102, true perpendicular side elevation, actual 2048×1024 material cells. DRAFT/HOLD; NATIVE-UNTESTED.**

An entered stranded freighter and dry cradle, a grounded yet broken long-boom crane and salvage magnet, three individually founded interrupted suspended rail-trestles, an enclosed sorting press, an eastern three-grade rail yard and customs settlement, and three intentionally expandable service/maintenance bays. This is an operational salvage chain (unload → cable lift → press/sort → rail dispatch), with damaged connections left as authored expansion seams, not a screenshot representation.

## Authentic source-grid gallery

- [overview.png](overview.png) — original unscaled 1:1 material crop XYWH 0,0,2048,1024
- [01-derelict-freighter.png](01-derelict-freighter.png) — original unscaled 1:1 material crop XYWH 65,558,520,286
- [02-damaged-crane-and-trestle.png](02-damaged-crane-and-trestle.png) — original unscaled 1:1 material crop XYWH 420,235,519,460
- [03-press-and-broken-relay.png](03-press-and-broken-relay.png) — original unscaled 1:1 material crop XYWH 914,351,442,502
- [04-scrap-to-rail-yard.png](04-scrap-to-rail-yard.png) — original unscaled 1:1 material crop XYWH 1230,476,479,407
- [05-customs-dispatch.png](05-customs-dispatch.png) — original unscaled 1:1 material crop XYWH 1695,454,340,397
- [06-underground-service-lanes.png](06-underground-service-lanes.png) — original unscaled 1:1 material crop XYWH 107,852,1874,117

PNG colour indices are stable material IDs 0/58/62/100. No AI graphics or native screenshot claims. Each unscaled PNG is regenerated from the exact final material plane.

## Source-static proof

- Real grid **2,097,152 material-ID cells**, no invented IDs, falling/floating/unstable fluids or reactive supports.
- **420352/420352** bottom-grounded inert solids. Exact nonoverlapping, lossless ordered Setup-v2 construction: **1174/32768 rectangles**, **22413 bytes** JSON, work 420352 cells.
- Native-authored Midge hull 4×3; conservative **19×15, 23×19, 31×27** envelopes. **18/18 exact saved site centres** reachable by 4-neighbour BFS at all three envelopes from spawn [162,432]. No goal relocation or exemption.
- True physically blocked travel from **Freight Gallery West** to **Freight Gallery East** through XYWH [1037,307,74,95]: **122 → 224** steps at 31×27, without losing any named checkpoint; return remains possible.
- SHA-256 full-plane `1c6d5228867b07ffb29227adafd8455f40988c2e5f7ef2efb87b2276546fe748`. Full setup, histogram, independent-rectangle replay and image hashes in [receipt.json](receipt.json).
- Execute `node build.cjs` from this directory to regenerate complete Setup, receipt, exemplar and true indexed-material gallery deterministically from [design.json](design.json).

## Corpus use

The deliberate outlier here is a **damaged, fragmented, clustered heavy-industry yard** rather than an intact bridged gorge or central mechanical ring. Edit seams include the broken trestle joining points, pierced freighter hull, salvage press activation hall and unfinished entered underworks. No NPCs or events are scripted.

## Honest acceptance gate

Source checked against accepted CyberSand Workbench Setup-v2, but **no installed Godot/CyberDemoBridge/Rapier gameplay test, actor flight/collision, world advancement or save/reopen** was executed. **NATIVE-UNTESTED; independent Art/Tech/Shepherd reviews pending. No exact-head CI PASS claimed.** Draft/HOLD, no Ready or merge.
