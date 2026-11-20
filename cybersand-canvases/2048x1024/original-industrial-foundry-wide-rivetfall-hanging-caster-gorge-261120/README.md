# Rivetfall Hanging Caster Gorge — an original CyberSand world

**2048×1024 actual material cells · standalone fixed-seed source · Draft/HOLD · NATIVE-UNTESTED.**

An asymmetrical ore-to-bloom suspended foundry spanning a deep dry industrial gorge. The west ore/operated-hoist district feeds two unequal shielded bloom furnaces. A root-supported suspension truss carries a double suspended ladle over a negative-space arch, handing its dry receiving geometry to five different gravity moulds. A guarded shear connects the moulds to an entirely sealed three-cell quench cassette and the east rail freight dispatch. Below the plant is a continuous 77px dry inspection flying route with ventilation, finned coolant, hydraulic return, gear repair, scrubber and dispatch signal workfaces.

## Route graph (authored before construction)

**Primary air route:** Ore wagon arrival → Dry hoist catwalk → Twin furnace control → Secondary bloom overlook → West hanging trestle → First ladle maintenance → Second ladle maintenance → Hanging viaduct air bridge → Caster winch staging → Gravity mould inspection → Shear observation → Sealed quench walkway → Freight dispatch goal.

**Lower recovery and physically blocked alternative:** West recovery riser → Vent repair → Reheat coolant repair → Hydraulic return → Underbridge gearing → Filter scrubbing → Dispatch signal relay → East recovery riser. The two 100px-class risers independently reconnect the main flight to the lower route. The independent audit rebuilds a second full collision plane with an actual 81×562 central obstruction at [996,190], using 31×27 full-envelope four-neighbour BFS with **unaltered named targets**.

## Construction and laws

Source authority is accepted read-only `techrote/cybersand@de109d0131641d6adc8d25bb9ced7ca3d4991105`; starting repository base `techrote/sandmapsreference@99a166e7fcae45eb22be1740e9f33f62faccbcc7`. Setup-v2 contains all 14 required keys, accepted immutable Midge hash, original spawn [87,281], the current 55-word `liquid_policy` and material-ID rectangles. Pixel geometry is entirely orthogonal side elevation.

Fixed seed **261120137**; deterministic builder `build.cjs`, executable via `node build.cjs` or exact-file `node build.cjs --verify`. All actual final 2,097,152 material cells are encoded greedily as ordered, disjoint 5-field rectangles. The builder verifies strict ordered material replay, exact histogram, SHA-256, boundary-rooted nonreactive supports, initial water/lava closure, conservative 19×15 / 23×19 / 31×27 full-body BFS, physical obstruction and every PNG’s signature, chunks, CRC, Adler and original source-cell pixel parity. The 1:1 district gallery and full overview use PNG indexed material IDs, not screenshots or AI art.

**Important:** Sealed initial water/lava is not a dynamic thermal/liquid simulation guarantee. Source supports 32,768 construction rectangles; installed bridge may fall back to 4,096 if the binary has no capacity handshake. Neither installed Godot/CyberDemoBridge/Rapier simulation, Midge control/collision, solver progression nor save/reopen has been run here. No independent Art/Technical/Shepherd acceptance is claimed.

## Authored 1:1 district evidence

- `01-ore-hoist.png` dry ore reception, skip rail and workmen’s controls
- `02-bloom-furnaces.png` deliberately unequal two-stage shielded hearths
- `03-hanging-ladles.png` two different supported ladles and underbridge truss
- `04-gravity-casters.png` five unequal mould/toolheads and guarded shear
- `05-quench-freight.png` three sealed water cassettes and freight operations
- `06-subgrade-repair.png` original wide lower maintenance and Midge return corridor

See `receipt.json` for the exact committed grid hash, construction work/histogram, grounded supports, all named sites, route obstruction and image hashes. Keep OPEN Draft/HOLD for independent reviews and native downstream qualification.
