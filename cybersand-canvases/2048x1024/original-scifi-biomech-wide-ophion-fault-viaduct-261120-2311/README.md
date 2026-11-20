# Ophion Fault Viaduct — ORIGINAL 2048x1024 CyberSand material-cell landscape

**DRAFT / HOLD. Author source-static PASS only. Independent Art, Technical and Shepherd review requested; NATIVE-UNTESTED. No Ready, merge or owner acceptance.**

Original side-elevation xenobiome memory fault: five asymmetrically terraced industrial districts, three playable excavations, a real indexed cassette on a cable-supported straight viaduct, editable sky-wells and expansion seams. A basin/nested-cavity exemplar rather than the inherited roof-suspended central-vessel pattern.

## Level design, routes, recovery

1. West quarantine ridge and roof-rooted specimen rack
2. Descending asymmetrical fault-jaw extraction and lower recovery vault
3. Cable bridge with visible indexed cassette, entered ground inspection station and underbridge vault
4. East multi-tier dry fractionator with excavated diagnostics
5. Offset dual drydock crane export and departure quay

All 16 literal checkpoints in design.json are independently tested at full 19x15, 23x19, 31x27 collision envelopes with exact four-neighbour free-centre BFS and four local cardinal approaches. Three independently enterable lower diagnostic cavities are carved out of actual floor cells and reached through wide shafts. The physical examination workface is rooted to the terraced basin at [1040,781]. The bridge's indexed cassette and its load cables are rooted to overhead structural supports. The temporary obstruction [958,555,170,131] forces a real route change while separately restricted high/low bypasses remain feasible.

## Full deterministic proof

Run `node build.js` in this directory (Node >=18, standard library only); reads exact fixed-seed `design.json` geometry; recreates material grid, removes unsupported nominal decorative cells, validates all named routes and obstacles, and writes Setup-v2, qualification.json, indexed actual-material overview and unscaled 1:1 crops. All artwork derives from material bytes, never image synthesis.

- Source sandmapsreference main: `99a166e7fcae45eb22be1740e9f33f62faccbcc7`. Read-only current accepted CyberSand: `de58bf1997ca75825cf3b29e046dc1c1022c45bf`.
- Exactly 2097152 actual final material cells, SHA-256 `b351bd89c2c4dcdebaace0cd6bcd345ab85c155524d3ce98cb119203afdc2e16`. Grounded inert solids 655809/655809; detached=0; forbidden mobile/fluids/reactive=0; unsupported nominal cells omitted=18008. Native inert Solid/None material palette: 58, 62, 63, 77, 79, 100, 101, 117, 128.
- 1992 canonical lossless nonoverlapping rectangles / source 32768, 38753 bytes Setup JSON / 1048576, 655809 construction work / 32000000. Replay overlap/mismatches=0; exact coalesced re-encode equality.
- Exact 31x27 gate shortest route: 1803 steps; after physical obstruction: 1949; independently constrained upper: 1967; lower: 2021.
- Full 2048x1024 authentic 4-bit indexed PNG and 7 unscaled native-resolution district crops. The committed encoded images use an explicit ID-to-index palette, each verified by PNG chunk CRC and independently decoded stored-DEFLATE, zlib Adler and per-pixel exact material matching. Image SHA256 values in qualification.json.

## Limits and independent acceptance

No actual Godot/Workbench/CyberDemoBridge/Rapier load, body advancement/collision or fresh-process Save/Reopen was executed. **NATIVE-UNTESTED**. Accepted source permits 32768 rectangles. A matching installed Workbench/bridge and actual actor movement remain NATIVE-UNTESTED. A valid source-static pass is NOT playable owner acceptance. Request independent exact-HEAD Art, Tech and Shepherd qualification. Keep Draft/HOLD.

## Corpus exemplar classification

New map is a **basin / nested-cavity / bridge** rather than a linear suspended-vessel factory. Controlled axes, set-piece staging coordinates and intentional human-editable seams are defined in `exemplar.json`. Preserve empty diagnostic expansion bays unless a collision, central-process or route P0/P1 is demonstrated.

**Site graph:** quarantine intake → west extraction → underbridge inspection → east fractionator → drydock export. Three excavated vaults are literal connected branches with broad return shafts. Route receipts include exact 16-site reachability and the 31×27 temporary-obstruction test. The centre uses upper and lower bypass lanes, not alternative handwaved targets.

**Physical obstruction:** [958,555,170,131]. Conservative 31×27 route distances are {"baseline":1803,"blocked":1949,"upper":1967,"lower":2021} steps. This is author static geometry reasoning; not Godot movement evidence.
