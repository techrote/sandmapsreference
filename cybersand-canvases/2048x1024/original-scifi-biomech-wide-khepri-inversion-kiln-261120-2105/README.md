# Khepri Inversion Kiln — ORIGINAL 2048x1024 CyberSand material-cell landscape

**DRAFT / HOLD. Author source-static PASS only. Independent Art, Technical and Shepherd review requested; NATIVE-UNTESTED. No Ready, merge or owner acceptance.**

Original side-elevation xenotechnology starship exoskeleton reclamation yard. Five readable physical processes joined by rigid transfer rails: opposed rib pickup, toothed dry shear mill, octagonal inversion kiln and Midge-enterable service deck, differentiated lamination stacks and braced twin-drum dispatch. Continuous low-pressure flight corridors and two fully excavated service vaults.

## Level design, routes, recovery

1. Opposed quarantined shell ribs and incoming transfer rail at west
2. Paired dry shear saw-drums with tooth drive and waste recovery
3. Suspended octagonal inversion kiln with bottom inspection aperture and grounded service bench
4. Four-level ion lamination racks with live registration instrumentation
5. Braced twin-winch cassette dispatch and outbound cargo rail

All 16 literal checkpoints in design.json are independently tested at full 19x15, 23x19, 31x27 collision envelopes with exact four-neighbour free-centre BFS and four local cardinal approaches. Two underfloor diagnostic vaults are excavated out of actual floor cells and reached through broad conservative-clearance shafts, not scenery. Central maintenance workface is physically grounded at site [1030,741]; the inversion kiln remains roof-grounded. The temporary obstruction [965,598,164,108] forces a real route change while separately restricted high/low bypasses remain feasible.

## Full deterministic proof

Run `node build.js` in this directory (Node >=18, standard library only); reads exact fixed-seed `design.json` geometry; recreates material grid, removes unsupported nominal decorative cells, validates all named routes and obstacles, and writes Setup-v2, qualification.json, indexed actual-material overview and unscaled 1:1 crops. All artwork derives from material bytes, never image synthesis.

- Source sandmapsreference main: `99a166e7fcae45eb22be1740e9f33f62faccbcc7`. Read-only current accepted CyberSand: `de58bf1997ca75825cf3b29e046dc1c1022c45bf`.
- Exactly 2097152 actual final material cells, SHA-256 `fca10a1ca00e39ba6b55206fe7254967a47575933d07e15c9b8fddc3ed9b9877`. Grounded inert solids 724584/724584; detached=0; forbidden mobile/fluids/reactive=0; unsupported nominal cells omitted=32636. Native inert Solid/None material palette: 58, 62, 63, 72, 77, 79, 100, 101, 117, 128.
- 1378 canonical lossless nonoverlapping rectangles / source 32768, 26559 bytes Setup JSON / 1048576, 724584 construction work / 32000000. Replay overlap/mismatches=0; exact coalesced re-encode equality.
- Exact 31x27 gate shortest route: 1778 steps; after physical obstruction: 1894; independently constrained upper: 1894; lower: 1932.
- Full 2048x1024 authentic 4-bit indexed PNG and 8 unscaled native-resolution district crops. The committed encoded images use an explicit ID-to-index palette, each verified by PNG chunk CRC and independently decoded stored-DEFLATE, zlib Adler and per-pixel exact material matching. Image SHA256 values in qualification.json.

## Limits and independent acceptance

No actual Godot/Workbench/CyberDemoBridge/Rapier load, body advancement/collision or fresh-process Save/Reopen was executed. **NATIVE-UNTESTED**. Source advertises 32768 rectangles but older installed bridges may allow 4096; do not assume installed compatibility. A valid source-static pass is NOT playable owner acceptance. Request independent exact-HEAD Art, Tech and Shepherd qualification. Keep Draft/HOLD.
