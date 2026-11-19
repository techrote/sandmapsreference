# Ternbreak Longspan â High Freight Cableway over the Dry Salt Gorge

Original playable 2048Ã1024 flat 2D side elevation, seed `20261119`. No image source, traced art, AI illustration or prior-map geometry. A grounded western ship-repair quay feeds a massive rope-slung rail span above a deliberately deep, dry freight gorge, through an offset balancing station, gravity classifier, and east dispatch/recovery yard. The lower excavation/rail maintenance artery offers separate cross-map transit and recovery. All machinery is **static geometry**, not working freight animation.

## Route topology and purpose

Spawn **West breakwater ingress** (110,457) â Quay manifest â High cargo inspection â West transfer ramp â Cable-span centre â Freight balance receiver â Sorting control â Outbound freight gate. Alternate upper cable sky via Windward bridge cable and Suspended tally pod; lower return via Western service intake, Gorge inspection artery, Classifier return, and East recovery, with shafts into five individually planned maintenance access points. Bridge underbeam (1051,602) and serviced barge workbay (304,713) are intentional technical landmarks. The upper suspension skyline, mid flight spans, machine bays, gorge and underground rail are geographically different from the previously authored Cinderwake dock/twin-jaw design.

Exact centre coordinates (no shifting, radius waiver or nearest substitute) and complete static full-hull BFS evidence are in `receipt.json`.

## Rebuild and proof

`node build.cjs` regenerates **all** complete `setup-ternbreak.json`, `receipt.json`, authentic 2048Ã1024 indexed `overview.png` and six independently decoded **1:1** district crops. The builder uses four accepted stable inert Solid/None material IDs (`100`, `58`, `62` with `0` empty), true 2-bit indexed PNG with `MaterialIDs` mapping, uncompressed RFC1950/1951 stored DEFLATE blocks, independently checked PNG CRC32, Adler32, and 1:1 decoded material-ID parity. Rectangles are disjoint, horizontally maximal row-runs vertically coalesced, and replayed to a full identical plane. Reproducible SHA-256, material histogram and JSON budgets are recorded.

**Proven static**: fully in-bounds 19Ã15/23Ã19/31Ã27 occupancy erosion, 4-neighbour exact named-site BFS, boundary-rooted solid connectivity, genuine inserted steel obstacle and full candidate route reassessment. Solid fragment pruning is recorded; see receipt. Source-accepted `techrote/cybersand@de109d0131641d6adc8d25bb9ced7ca3d4991105`, Workbench Setup-v2 source `70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9`, material catalogue `dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3`. Workbench source rectangle cap 32768, max JSON 1 MiB, work 32m. **Installed** bridge might cap at legacy 4096, and is not measured. No actual Godot/WorkBench/CyberDemoBridge/Rapier import, flight, simulation, save/reopen or fresh-process restore executed: **NATIVE-UNTESTED**.

Keep OPEN Draft/HOLD for independent exact-HEAD Art, Technical and Shepherd audits. No owner acceptance, Ready, merge or auto-merge.
