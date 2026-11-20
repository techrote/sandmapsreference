# Torsion Rift Cryoline — original 2048x1024 racing-wide Midge landscape

**ORIGINAL-NO-REFERENCE · perpendicular 2D side elevation · OPEN DRAFT/HOLD · self-verified SOURCE-STATIC · INDEPENDENT REVIEW REQUIRED · NATIVE-UNTESTED.** No scene painting, reference reproduction, fake native screenshot or owner acceptance.

## Distinct authoring thesis
A broken industrial torque transfer trench runs lower-east outbound and upper-west on return: the reverse of the older racing-wide courses. A dramatic large grounded **Rift spear-arch** physically forces the lower racing line to climb through a real aerial aperture before descending. Five identifiable functional districts, not cloned trays or decorative hall volumes:
1. **West ignition lock** (x=0-395) — two accessible roof-level operator structures, 90-cell full-width lift, rooted capacitor consoles, and a lower emergency garage
2. **Torque foundry** (x=396-835) — asymmetric ceiling suspension truss; two unequal hollow material-cell flywheel bearings; three grounded service compressors and an enterable shaft
3. **Central Rift Exchange** (x=836-1280) — massive tapered ground-anchored spear, narrow return skyline, overhead control booth, exposed climb-and-recovery alternative, carved air-gap
4. **Cryogenic filter banks** (x=1281-1700) — four differently articulated roof-fed fingers, three nonidentical dry founded collection towers, genuinely accessible conditioning vault; no active fluid
5. **East recovery lift** (x=1701-2048) — paired asymmetrical capture jaws, flyable 300-cell vertical switchback, grounded maintenance room and westward release

## Route and physical scale
Midge is the accepted 4x3 material-cell hull. **Lower outbound:** West Lock Start (136,629) -> Ignition Straight (346,629) -> Torque Foundry Approach (601,630) -> Rift Lower Approach (910,626) -> **climb to Rift Aperture High (1090,416)** -> Rift Landing (1262,630) -> Cryo Lower (1480,626) -> East Braking (1760,631) -> East Recovery Pivot (1910,515) -> East Upper Return (1900,398). **Upper westbound return:** Cryo Upper (1540,393) -> Rift Upper (1240,394) -> Torque Upper (766,393) -> West Upper (397,390) -> West Dive (175,512) -> Finish (186,630).

**Local recovery:** central Rift aperture connects the return altitude and lower outbound; four-enterable roof and underfloor galleries allow reaching alternate service locations. Listed 23 exact named sites are not shifted, radius-waived or replaced by nearest accessible ones. A physically inserted **159x94 temporary hard-wall block at (840,590)** covers only the named Rift Lower Approach; 22/23 sites including finish remain reachable at 31x27 after the obstruction; the blocker is not exported.

## Fixed-seed source and receipts
Generator: `build.cjs`, fixed seed `0x77F12026`, deterministic cell geometry and ordered nonoverlapping row-run/vertical merge; `node build.cjs` rewrites byte-equivalent Setup-v2, receipt and PNGs. Source authority is [accepted CyberSand main at de109d0131641d6adc8d25bb9ced7ca3d4991105](https://github.com/techrote/cybersand/commit/de109d0131641d6adc8d25bb9ced7ca3d4991105), read-only: `godot/scripts/workbench_setup.gd`, `godot/native_extension/cyber_demo_bridge.hpp`, native material laws, authored Midge definition. Exact loader payload has all 14 canonical Setup-v2 root keys including the source-pinned 55-integer liquid policy (even though final grid has no liquids).

| Measured proof | Value |
|---|---:|
| Full true material-ID plane | 2,097,152 cells |
| Nonoverlapping Setup rectangles | 5283 / 32768 |
| Compact Setup JSON bytes | 100339 / 1048576 |
| Actual constructed material-cell work visits | 689230 / 32000000 |
| Literal ordered replay | 0 overlaps / 0 mismatches |
| Inert grounded final solids / detached remainder | 689230 / 0 |
| Prior unanchored authoring cells excavated before final output | 48704 |
| Active fluid / reactive cells | 0 / 0 |
| Exact full-body clearance 19x15, 23x19, 31x27 | 23/23 at every envelope |
| After physical obstruction at 31x27 | 22/23, only Rift Lower Approach excluded |
| Source grid SHA-256 | `1e71b704c9acf8ac2880f9a470e98a4762f98e2592b18ce70878d569435fa003` |
| Setup SHA-256 | `6b67d7d3bcde90c1447f8ed2794d44426f7af8bab52b7e88990f45d37672865d` |
| Material-ID PNG integrity / indexed parity | 7/7, including full 2048x1024 overview |

Built-in self-checks validate signature/chunk CRC/Adler, complete indexed pixels, literal ordered replay, bounds, site BFS at exact centres, grounded solids and obstruction. `verify-independent.cjs` parses the **committed** files instead of trusting the builder to reconstruct proof.

### Genuine material-indexed gallery
- [overview.png](./overview.png) — **2048x1024**, source rectangle x=0, y=0; one PNG material-index pixel per real cell
- [01-west-lock.png](./01-west-lock.png) — **454x578**, source rectangle x=0, y=28; one PNG material-index pixel per real cell
- [02-torque-foundry.png](./02-torque-foundry.png) — **478x657**, source rectangle x=382, y=253; one PNG material-index pixel per real cell
- [03-rift-spire.png](./03-rift-spire.png) — **502x698**, source rectangle x=829, y=248; one PNG material-index pixel per real cell
- [04-cryo-filter.png](./04-cryo-filter.png) — **454x704**, source rectangle x=1267, y=226; one PNG material-index pixel per real cell
- [05-east-recovery.png](./05-east-recovery.png) — **398x686**, source rectangle x=1650, y=238; one PNG material-index pixel per real cell
- [06-underground-services.png](./06-underground-services.png) — **564x374**, source rectangle x=459, y=650; one PNG material-index pixel per real cell

### Unresolved gates
- Installed CyberDemoBridge rectangle capacity **unknown**; accepted source states 32768 but legacy fallback is ~4096. This payload uses 5283 rectangles and **must not** be silently degraded. 
- Installed native Godot/Workbench/Rapier load, steering, collisions, racing speed/feel/lap, tick progression and cold-process save/reopen are all **NATIVE-UNTESTED**.
- Independent exact-HEAD Art/Technical/Shepherd evaluation required. No merge/Ready/auto-merge.
