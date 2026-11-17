# Asteroid Ladder Galleries — CyberSand 1024×2048
**Draft / HOLD — owner-gated.** This is a genuine Workbench Setup-v2 material-cell canvas. Never merge or promote Ready without owner acceptance.

## Reference provenance
- Repository: [techrote/sandmapsreference](https://github.com/techrote/sandmapsreference), image `artwork/spacecraft_orbital_structures/batch2/asteroid_ladder_galleries.png`.
- Public ID `orbit-0006a`; source key `batch2/images/img-029.png`; original Git blob `686bd6acce83445567cbd71069dc5c31445519c0`; SHA-256 `e663ce4379554b49c168447b023f24481ad7df3dc9106bddcd29ed40c952cf28`.
- Original image size 1,869,336 bytes. Original dimensions and original-to-conversion visual fidelity remain **UNVERIFIED**, because the source PNG binary was unavailable to this runner. Do not claim an image-faithful reproduction.

## Layout and repair
Seven differentiated asteroid excavation galleries on the west flank; five instrumented pods on the east; twin-rail service mast, copper cross-trusses, midshaft tether reel, ore/fossil/drill installations, open flight voids, and upper/lower exits. Geometry is true orthographic 2D material cells. No image pixels are embedded as a background.

The prior canvas had a **false-positive 16/16 navigation receipt**: a hidden ±99-cell nearest-point proxy admitted offsets up to 105, even when intended centres were inside solid instruments or mast rails. Independent Shepherd review showed only **4/16** original exact centres were valid. This repair:
- Cuts a targeted 100×24 Survey Gallery service hatch near `[126,163]` so its previously isolated exact flight centre `[133,174]` connects to the main room, without destroying the lower scientific equipment.
- Makes **11 explicit semantic relocations** from machinery/rail/cross-gantry coordinates to accessible interior inspection airspace, rather than silently accepting nearby proxies.
- Completely removes nearest-point search and offset tolerance. The deterministic builder now hard-fails unless **every declared exact centre** is 19×15 clear and connected to spawn.

### Explicit waypoint relocations
| Site | Previous x,y | Final x,y | Meaning |
|---|---|---|---|
| Core Drill | `159,515` | `260,467` | Lift inspection station above the solid drill rack |
| Drill Stacks | `180,760` | `252,739` | Clear upper aisle beside the drill stack, not inside machinery |
| Fossil Hall | `155,1065` | `248,1021` | Open exhibition airspace beside fossil and microscope cabinets |
| Stress Laboratory | `160,1322` | `261,1290` | Clear overhead instrument inspection lane |
| Seam Gallery | `155,1590` | `255,1584` | Clear aisle free of isolated decorative fragments |
| Anchor Winch | `162,1935` | `263,1858` | Upper winch observation aisle above the solid wheel |
| Pod B | `846,677` | `810,631` | Upper pod inspection aisle, above the solid lower gantry |
| Pod C | `846,1016` | `840,982` | Unobstructed upper pod lane outside steel instrument frame |
| Pod E | `833,1758` | `835,1713` | Upper pod aisle above crossing copper rig |
| Ladder Mast Upper | `618,474` | `580,474` | West-side accessible ladder-platform standoff, not inside rail |
| Ladder Mast Lower | `628,1485` | `580,1485` | West-side lower mast standoff, preserving continuous rail |

Unchanged exact centres: Survey Gallery `[133,174]` (now connected after the hatch); Pod A `[849,316]`; Pod D `[844,1367]`; Tether Reel `[541,1027]`; Lower Exit `[517,1999]`. The final declared centres are not advertised as the unchanged original centres: their deliberate changes are recorded here and in `evidence.json`.

## Reproduce and load
Requires Node.js. From this directory:
```sh
node -e "const fs=require('fs'),{generate}=require('./builder.cjs'); const v=generate(); fs.writeFileSync('setup-asteroid-ladder-galleries.json',v.json); fs.writeFileSync('asteroid-ladder-galleries-preview.png',v.png); for(const [name,bytes] of Object.entries(v.crops)) fs.writeFileSync(name,bytes); fs.writeFileSync('evidence.json',JSON.stringify(v.stats,null,2)+'\\n')"
```
The committed builder uses a fixed seed and the final `A` material plane. Its full-map PNG is a **512×1024 2× diagnostic**, not a native gameplay screenshot. All three district PNGs use **1 material cell per PNG pixel**:
- `asteroid-ladder-galleries-detail-survey-core.png`: west Survey/Core access (origin 30,85; 485×570).
- `asteroid-ladder-galleries-detail-pod-mast.png`: pod/mast crossing (origin 520,550; 465×610).
- `asteroid-ladder-galleries-detail-lower.png`: lower excavation galleries (origin 20,1450; 500×580).

Install the Setup-v2 JSON as a named Workbench starting setup under Godot `user://workbench/`. Select it in a CyberSand build whose native `workbench_start_rectangle_capacity()` admits at least **17145** rectangles; older binaries may cap at 4,096.

## Exact-HEAD static qualification
- Target extent **1024×2048**; current CyberSand Setup-v2 allows sides 512–2048 in multiples of 64 (source reference `techrote/cybersand@018bd09503d7f079ddac52e225c2f7daf8d678bf`).
- Rectangle edits **17145/32,768**; UTF-8 JSON **312391/1,048,576** bytes.
- Exact full-plane material serialization independently reconstructed **2097152/2097152** cells; author reconstruction mismatches **0** and independent material histogram matches.
- Conservative **19×15** all-non-air collision-envelope BFS independently ran from selected Midge spawn **[528,93]**: **723803** connected legal flight centres; **16/16 exact final declared anchors**, **zero hidden offsets**.
- The 100×24 Survey service hatch changes **329** final material cells from solid to air; all other terrain remains preserved.
- **NOT RUN:** Godot/CyberDemoBridge native material/actor hash admission, installed DLL/SO rectangle capacity, Rapier progression, input/collision, and Workbench save/reopen. Source-image visual comparison is also **UNVERIFIED**. Static success must not be described as physical Workbench acceptance.

**Status:** Draft / HOLD; return repaired exact HEAD to Shepherd for independent review.
