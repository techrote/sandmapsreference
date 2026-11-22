# GOLD-ASTRA-001 B2: bounded architectural candidate

The trial candidate is `setup.json`. The frozen original Setup and unchanged original builder are in `baseline/`. The original parent-map files are not modified.

## Reproduction

Requires Python 3 with numpy, scipy and Pillow; Node is also needed only for optional verification of a JavaScript original builder.

```sh
python reproduce.py --out reproduced --verify-original-build
python validate.py
```

The reproducer verifies frozen input SHA-256 values, reconstructs actual material cells, applies the explicit bounded operations, runs the frozen final anchoring/pruning policy, emits canonical disjoint Setup-v2 rectangles, and regenerates native-size before/after PNGs at identical source coordinates. Every PNG has one output pixel per material cell.

The original builder and its deterministic pruning are preserved unchanged; this trial's final pruning is additional and explicit. Changed-cell counts, bounds, material transitions and raw row-major uint8 material-plane SHA-256 values appear in `cell-diff.json` and `build-result.json`.

`fixture.json` contains the pre-registered exact centres, original physical obstructions and original upper/lower route bans. All three conservative envelopes, 19×15, 23×19 and31×27, remain in force. The actual Midge is a continuous 4×3 COM-centred rectangle with bounds [-2,-1.5,4,3]; no invented integer-centred actual-hull mask is used.

Status here is SOURCE-STATIC author evidence only. ART and native qualification require independent results. No native flight, save/reopen, owner acceptance, Gold selection or merge is asserted.

See `rationale.md` for the arm-specific judgment, preservation and inherited limits.
