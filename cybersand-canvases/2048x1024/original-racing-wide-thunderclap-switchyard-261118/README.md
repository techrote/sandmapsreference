# Thunderclap Switchyard — ORIGINAL racing-wide CyberSand canvas (R6)

**2048×1024 · OPEN DRAFT/HOLD · ORIGINAL FROM SCRATCH · NATIVE-UNTESTED.**
No reference art was consulted, sampled, converted or traced. Preserve single creator ownership of this original lane. CyberSand code and sibling branches are untouched.

## R6 design and independent-review response

A shattered lightning-conductor railway is a legible five-district high-speed Midge playground: (1) **Launch Cradle** with boundary-rooted dispatch, (2) **Drift Canyon** with asymmetric roof-saw, (3) **Split-Current Iris** with top-anchored crown suspension, (4) **Glassstorm Viaduct** with real support spine, inhabited weigh-station and service railway, and (5) **Braking Claw** with a basin and recovery loop. The world is exact, flat orthographic side elevation.

R5 independent technical review closed the former four >20k disconnected structural assemblies. R6 addresses the Shepherd's separate P1 racing-course/art REWORK: support-rooted fork at the west start, high-canyon hanging saw deflector, an explicit physical high-iris transfer cue, *four alternate roof/floor obstacle banks* in the lower tunnel, a real underdeck weigh station and asymmetric east re-entry/braking teeth. These alter actual material cells. The broad central y445 straight is deliberately preserved as the safer, lower-complexity high-speed racing choice. The high and low options offer different physical clearance/handling patterns; no imaginary timed speed advantage is asserted.

**Rejected candidate:** the first R6 western iris switch bar broke the full 31×27 iris-blocked alternative. This bar was omitted before publication. Full obstacle-hull blocking now passes, not only centre masking. The wide negative-space main lane is retained intentionally; do not fill it with collision greebles.

## Exact functional sites and route graph

Primary: Launch cradle (116,445) → Iris west (841,445) → Central chamber (1037,448) → East conductor (1323,454) → Glassstorm viaduct (1506,453) → Catch cliff (1826,449) → Brake finish (1943,446).

High technical: Dispatch roof bypass (203,329) → Split-canyon high (617,356) → iris west high approach (844,307) → Over-crown gallery (1033,297) → iris upper rejoin (1194,308) → rejoin east conductor. The hanging saw/fork makes this a different technical line while retaining wide conservative Midge clearance.

Low technical/return: West dive shaft (443,612) → West undercroft (614,752) → Western tunnel slalom (640,751) → Iris lower transfer (1072,753) → Eastern tunnel slalom (1614,753) → Eastern underpass (1571,756) → East lower return entry (1760,573) → Recovery basin (1883,767). Banks alternate ceiling/floor support; any site claimed in the receipt uses the exact airspace coordinates with a full 31×27 clear rectangle. Not a nearest-point substitution.

Optional Glassstorm underdeck site (1530,517) is a secondary low-flight line and viewing approach to the fixed weigh-station, not a simulated speed booster. The direct **central iris vertical drop is not available** due to the genuine R5 service spine; use west/east entrances to the lower route.

## Static qualification on current accepted main

Read-only CyberSand engine authority `018bd09503d7f079ddac52e225c2f7daf8d678bf`. Setup-v2 exactly 2048×1024 (2,097,152 cells), 10375 nonoverlapping five-integer rectangles (limit 32,768), 195997 JSON bytes (limit 1,048,576), 927040 edit cell-visits (limit 32,000,000), full-cell deterministic replay 0 mismatches/overlaps. Every placed nonempty ID is a native valid inert immovable solid; material histogram in `qualification.json`. Full source-grid SHA-256 `92c068ab81461565a29f3a7f3d854582d4507ed9339554779f50f0e4b20053cd`; exact setup JSON SHA-256 `0cc8522006a8511cd3cd931d8a830ab12b8a911e89f962f82f8d75422a6bc158`.

All **14 original functional sites** remain exact-centre reachable at **19×15, 23×19 and 31×27**. A **genuine physical iris obstruction** x900–1110/y330–554, expanded to 31×27 legal-centre mask x885–1125/y317–567, still preserves **13/14**, including actual brake finish; only blocked iris central chamber is inaccessible. The whole x116→1943/y445 straight preserves a fully legal **31×27 Midge envelope**, intentionally. The nine optional R6 waypoint coordinates are also individually verified at 31×27.

R5 existing six actual-cell structural-support probes remain embedded in `build.cjs`. The fixed-seed deterministic builder regenerated the actual setup and all seven evidence PNGs with internal PNG signature/IHDR/CRC/zlib/Adler/IEND checks and grid-pixel parity. `node build.cjs --verify` compares all committed JSON/PNGs byte-for-byte when run under Node 22+. The builder itself was executed in an independent V8 environment, **not** in the installed CyberSand native runtime.

**Full evidence:** `overview.png` (actual 2048×1024, every material pixel), `overview-review-2x.png` (actual-grid nearest sample at 1024×512, independently easier to retrieve; *not* a replacement for full resolution), plus five full **512×384 true 1:1 crops**. All PNG/image checksums are in `qualification.json`.

## Native/owner gate

**NATIVE-UNTESTED**: no source-matched installed Godot/CyberDemoBridge/Rapier binary was present. Source bridge admits 32,768 rectangles; an old 4,096-limit DLL would reject this 10375-box setup. Installed capacity/version, actual Workbench install, Midge piloting at race speed, actor collision/handling, bounded native ticks, save/reopen and time-trial functionality are not proven. Real checkpoint timers are **not implemented**. Keep this PR **Draft/HOLD** awaiting exact-HEAD independent technical/artistic/Shepherd review and owner native acceptance. No merge or Ready promotion.
