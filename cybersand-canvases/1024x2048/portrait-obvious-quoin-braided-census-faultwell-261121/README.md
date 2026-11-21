# Quoin Braided Census Faultwell — PORTRAIT-001 B, OBVIOUS

New 1024×2048 native material-cell scene, sourced conceptually from [Quoin Veil split faultwell PR #125](https://github.com/techrote/sandmapsreference/pull/125) @ `e17996dd8a2e1044550a60e75f45780cb6ae868d`, with original source geometry/PR unchanged.

## Design thesis

The source's two unequal survey boreholes, calibration/assay/dry ledger, habitat and quarantine are preserved as functional relationships but **recomposed** around a tall common flight atrium. Unequal rooted ledges, a survey mast and two octagonal instruments occupy alternating altitudes. Side labs, deep rescue and extraction stations remain entered, while deliberately vacant voids are retained for human editing, GENTEK templates and unscripted events. True perpendicular 2D side elevation; no rotation, crop, stretch or copied material plane.

## Rebuild and checks

With Node.js in this directory:

```sh
node build.cjs .
node verify-independent.cjs
```

The deterministic fixed-seed builder regenerates `setup.json`, `receipt.json`, `overview.png` and six **authentic unscaled 1:1** district PNGs from exactly 2,097,152 final material-ID cells. It rejects out-of-bounds rectangles, overlapping ordered replay, any cell mismatches, non-rooted final inert structure, uncontained fluid faces, missing full-hull literal Midge sites or an ineffective physical detour. The separate Node verifier additionally hashes/replays all receipts and decodes PNG/zlib pixels. The verifier is included for independent execution; no Node execution in native owner environment is claimed here.

## Provenance and numeric receipt

- Source `techrote/sandmapsreference` [PR #125](https://github.com/techrote/sandmapsreference/pull/125) at `e17996dd8a2e1044550a60e75f45780cb6ae868d`, folder `cybersand-canvases/2048x1024/worldgroup-xenobiome-quoin-veil-split-faultwell-vertical-census-261121/`.
- Source public grid SHA-256 `de56ecc67744576902ff681768932747cf291608b89adc5078730fc2bfc3f9a3` (source PR claim).
- Portrait base `sandmapsreference/main@99a166e7fcae45eb22be1740e9f33f62faccbcc7`.
- Accepted CyberSand read-only schema/material/actor authority `techrote/cybersand/main@69209acaffb34ebe18c45e19290b5976b7fb2c82`.
- Portrait plane SHA-256 `f770b78e2c84be82874b57d8545f9dae756ef6b7a56937c2dc54c8a39d44992f`; full material cells 2,097,152.
- Lossless disjoint rectangles **1053/32,768**; JSON bytes **20597/1,048,576**; material writes **661970**.
- Stable rooted structure **659879/659879**, 0 detached; **31237** provisional unsupported decorative cells explicitly pruned prior to final material plane.
- Fully enclosed initial water/lava **1092/999**; 0 exposed faces; 0 water–lava touching contacts.
- Exact full-hull Midge **18/18, 18/18, 18/18** at 19×15 / 23×19 / 31×27. Physical blockage `[441,880,151,113]` keeps **18/18** sites and forces **214 → 356** exact 31×27 West mid interlock→East mid assay four-neighbour steps.
- **3523590** actual material-index PNG pixels checked by the builder (overview + six 1:1 crops), zero disagreements. PNG integrity, CRC, stored DEFLATE and SHA-256 are recorded in `receipt.json`.

## Gallery

- `overview.png` — full 1024×2048 exact indexed-material scene
- `01-west-habitat.png` — isotope habitation, anchored instrumentation
- `02-east-calibration.png` — tall optical mast, east calibration
- `03-mid-assay.png` — obstructable interlock, two-bank assay
- `04-west-quarantine.png` — entered lower containment and work stations
- `05-east-recovery.png` — second measurement ring, recovery ledges
- `06-bottom-extraction.png` — deep ledger and east freight extraction

## Delivery gate

**Draft/HOLD, NATIVE-UNTESTED**: source-static checks executed inside authoring JS, *not* actual Godot/Workbench/CyberDemoBridge/Rapier, material physics advancement, dynamic collision, hot load, save/reopen. No native PASS, CI PASS, independent Art/Technical/Shepherd acceptance or owner sign-off is claimed. Request independent exact-HEAD review, preserve authoring voids and source PR unchanged.
