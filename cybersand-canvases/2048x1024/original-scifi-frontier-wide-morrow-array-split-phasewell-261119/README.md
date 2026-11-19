# Morrow Array — The Split Phasewell

**Original from-scratch 2048×1024 sci-fi frontier CyberSand material-cell landscape. DRAFT/HOLD — owner acceptance pending.**

An off-world colonist citadel and rover hangar occupy the western rock shoulder, a monumental *split phasewell* spans the enormous central rift, and a freighter quarantine district clings to the eastern cliff. Above, asymmetric heliosails and survey bridges frame a huge open sky. Below, rock-cut diagnostics and archives form a second, independent flyable return route.

## Five traversable districts
- **West Rover / Civic Citadel:** inhabitated multilevel settlement, xenology porches, assay and protected rover lock.
- **Phasewell Sky Transit:** two separately elevated asymmetric trusses, aerated approach gates, winged solar antenna.
- **Split Phasewell Reactor:** distinctive interrupted elliptical arms and rooted V-braces, two through-route altitudes.
- **East Quarantine Cargo Harbour:** breached asymmetric roof, specimen galleries, parked freighters, operational dock.
- **Lower Geologic Survey:** three undercuts, rock-cut service return, communications assay, separate vertical interlinks.

All walls and bracing are static physically admissible solids from the accepted catalogue, not powder foundation. Full cell plane is authored with polygon spans, line bracing, architectural cuts and deterministic strata. NO uploaded images, AI illustration, reference conversion or raster tracing. Flat perpendicular 2D only.

## Reproducible artifacts
- `build.cjs` regenerates the original 2048×1024 material plane, runs full-plane exact replay and conservative actor envelopes, emits indexed pixel PNGs and verifies PNG inflation/raw material-pixel parity.
- `setup-morrow-array.json`: Setup-v2 ready for Workbench, 7950 five-word ordered nonoverlapping rectangle edits (149494 bytes, 829363 filled cells).
- `overview.png`: one image pixel per actual original material cell, 2048×1024; no artistic mockup.
- Five authentic 1:1 scene crops: `01-west-citadel.png`, `02-split-phasewell.png`, `03-rift-geology.png`, `04-east-cargo.png`, `05-deep-survey.png`.
- `receipt.json`: exact site list, conservative clearances, edit budget and histogram. The builder regenerates full SHA256 receipts.

**Exact CyberSand accepted main:** `de109d0131641d6adc8d25bb9ced7ca3d4991105`; Setup-v2 loader blob `70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9`; material catalogue blob `dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3`. Authored Midge rectangle 4×3; conservative centre footprints **19×15, 23×19, 31×27** all reach all 16 exact named sites via true four-neighbour BFS; no closest-site waiver. Nonzero cells 829363; construction work below 32M cap; edit count below 32,768; file below 1 MiB. No fluid, explosive, combustible or mobile material.

**NATIVE-UNTESTED**: no source-compatible native Godot + Rapier binary or Windows Workbench evaluation was run. Dynamic flight/control and fresh-process save/reopen remain separate owner/technical gates. Require independent exact-HEAD technical, art and Shepherd review before Ready or merge.

## Exact destination coordinates
- Rover gate: 135,495
- Citadel porch: 289,402
- Upper xenology: 322,304
- Western assay: 317,577
- Archive lower: 265,750
- West rift dock: 650,496
- Helio skywalk: 792,264
- Phasewell top: 1020,284
- Phasewell central: 1020,494
- Phasewell undercroft: 1020,751
- East tram bridge: 1365,495
- Quarantine lock: 1558,496
- Cargo bay: 1812,495
- Eastern observatory: 1694,304
- Ion exchanger: 1815,748
- Deep mineral survey: 1305,748

## Rebuild
Run `node build.cjs --verify` (no npm dependency); reruns cell, receipt, compression and site checks. PNGs contain exact palette-index values equal to material IDs; they are static physical-plane evidence, not a native screenshot.
