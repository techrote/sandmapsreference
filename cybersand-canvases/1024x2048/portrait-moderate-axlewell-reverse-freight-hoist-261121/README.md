# PORTRAIT-001 B — Axlewell Reverse Freight Hoist (MODERATE)

**New 1024×2048 CyberSand orthographic material-cell world. Draft/HOLD; SOURCE-STATIC PASS, NATIVE-UNTESTED.** The source remains [Axlewell Reverse-Flow Basin Freight Port PR #176](https://github.com/techrote/sandmapsreference/pull/176) at exact `debc4a61c067f5759860d7f2b16004eeb6e0a59e`, source folder `cybersand-canvases/2048x1024/original-industrial-transit-wide-axlewell-reverse-basin-261121/`. It is read-only.

## Structural thesis

The donor's east-arriving freighter → separate crane → central portal-hoist → three western classification grades is preserved as a **physical cargo-manufacturing relationship**, but its 2048-wide basin and side-by-side platforms are recomposed into a **2048-high descending industrial exchange**. The ship and crane occupy upper-right ports; central hoist ring and freight reception divide upper/middle; successive western classifiers descend to low export, with a distinct east mechanical recovery bank and purposely vacant editing sockets. No source geometry/rectangle/pixel transplant, rotation, crop or stretch. No scenic isometric tops.

## Deterministic rebuilding

From this directory in Node:

```sh
node build.cjs .
node verify-independent.cjs
```

`layout.cjs` authors the complete fixed-seed 2,097,152 material-ID grid. `build.cjs` emits Setup-v2, exhaustive nonoverlapping ordered rectangle replay, SHA-256/histogram receipt, full Midge-hull reachability at 19×15 / 23×19 / 31×27, real midspan obstruction and rerouting, indexed full-material overview and six actual unscaled 1:1 PNG crops. PNG CRC, zlib stored-DEFLATE and material-pixel parity are checked in generation. `verify-independent.cjs` is an additional independently written Node replay+decode verifier **included, not claimed executed under Node here**.

## Exact static evidence

- Portrait final material plane `c62ed301ae39863512d7b85a90066781405ba3328b3547804088c288a58a8dc4` SHA-256 (2,097,152 final material-ID cells).
- Source full-grid SHA-256 `b18b3f2f0bb6b16bae85f0a48bce62179cb244417089c048db5a8b06faa8e442` from source author's PR receipt, provenance only.
- Creation base `sandmapsreference/main@99a166e7fcae45eb22be1740e9f33f62faccbcc7`; accepted read-only engine contract `techrote/cybersand/main@69209acaffb34ebe18c45e19290b5976b7fb2c82`.
- Fixed seed `202611211321`, **635/32,768 lossless rectangles**, **12907/1,048,576 Setup JSON bytes**, **730847** actual material construction writes.
- Physically rooted stable inert cells **730847/730847**, zero detached. Provisional unsupported cells pruned **35275**; these are excluded from the final grid, no unsupported display supports retained.
- No mobile/reactive/liquid initial material cells (source also dry). Initial exposed fluid faces and water/lava contacts both zero.
- Full-hull named literal site accessibility **20/20, 20/20, 20/20** at conservative 19×15, 23×19, 31×27.
- Real middle hoist obstruction `[420,980,264,128]` preserves **20/20** reachable 31×27 sites. Exact four-neighbour Interlock upper → Interlock lower shortest flight rises **222 → 458**, a 236-step detour.
- **3507682** original material-index pixels decoded and compared, 0 mismatches, full-resolution overview plus six 1:1 unscaled PNG districts.
- Two native execution caveats: no live Workbench/Godot/CyberDemoBridge/Rapier actor flight, collisions, physics progression or fresh save/reopen tested; no CI or independent Art/Tech/Shepherd acceptance claimed. **NATIVE-UNTESTED.**

## Real indexed material PNGs

`overview.png` — 1024×2048; `01-east-arrival-ship.png`, `02-crane-customs.png`, `03-central-hoist.png`, `04-east-return.png`, `05-west-classifier.png`, `06-lower-rail-dispatch.png` — true 1:1 material-cell crops.

The complete `aspect_transfer.json` documents preserved/transformed/discarded/new introductions and exact source and target hashes; `exemplar.json` includes corpus controlled diversity axes and unimplemented event/editing sockets. Preserve source/owner data, no Ready/merge.
