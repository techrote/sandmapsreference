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
- `setup-morrow-array.json`: Setup-v2 ready for Workbench, 10311 five-word ordered nonoverlapping rectangle edits (193428 bytes, 886312 filled cells).
- `overview.png`: one image pixel per actual original material cell, 2048×1024; no artistic mockup.
- Five authentic 1:1 scene crops: `01-west-citadel.png`, `02-split-phasewell.png`, `03-rift-geology.png`, `04-east-cargo.png`, `05-deep-survey.png`.
- `receipt.json`: exact site list, conservative clearances, edit budget and histogram. The builder regenerates full SHA256 receipts.

**Exact CyberSand accepted main:** `de109d0131641d6adc8d25bb9ced7ca3d4991105`; Setup-v2 loader blob `70dd964bc2d5bff9ca030edd57d7fc7aa5068fc9`; material catalogue blob `dcf05895da3015a2e999e3d1cbbae0fdc7fe32b3`. Authored Midge rectangle 4×3; conservative centre footprints **19×15, 23×19, 31×27** all reach all 16 exact named sites via true four-neighbour BFS; no closest-site waiver. Nonzero cells 886312; construction work below 32M cap; 10,311 edit rectangles below 32,768; file below 1 MiB. No fluid, explosive, combustible or mobile material.

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

## R2 original-world structural and architectural finishing (19 November 2026)

The independent art, technical and Shepherd audits of R1 correctly distinguished static
schema/flight PASS from weak structural believability and over-scale inhabited rooms.
R2 applies **new actual-cell geometry** in `repair-structures.cjs`, loaded after the
baseline world and before the exact ordered-rectangle encoder. This is the same original
world and the same unchanged 16 named destinations, 2048×1024 extent, Midge and seed.

- **West civic:** differentiated xenology cells, habitation mezzanine, rover servicing,
  instrument consoles, distinct 40–70-cell room tiers, and anchored load paths.
- **Eastern quarantine:** sample isolation, customs controls and a physically different
  refuelling/repair berth, separate landings and grounded freight service.
- **Phasewell:** offset damaged emitter, human-readable inspection shelves and rock-bonded
  lower foundation. Broken-ring gaps and open high/low flight routes remain intentional.
- **Transit & solar:** long, legible sky-truss and midlevel anchors back into the natural
  cliff faces. Twin sail conductors express intentional suspended technology.
- **Deep survey:** separate assay chamber, rock-connected registration points and a
  secondary access bay instead of broad featureless lower geology.

The acceptance criteria are unchanged: full-plane replay/PNG pixel parity, exact
19×15 / 23×19 / 31×27 named-site flight BFS, static engineering and art audits,
plus separately real native runtime/flight/save/reopen testing.
R2 images, receipt, JSON and exact new SHA are regenerated and committed by the
branch-local content-scoped GitHub Actions authoring job before verification; do
not treat an unverified intermediate source-only commit as a playable candidate.
**NATIVE-UNTESTED** until independently exercised.

## R2 exact-cell independent outcomes

**Current R2 material plane** (unaltered by this documentation/CI hardening):
`a3450974fc297020b8aefbd5b6648d4c85b594112304f836cf5f6d516abef4cc`.
All **16/16 unchanged functional destinations** pass actual full-hull **19×15,
23×19, 31×27** cardinal centre BFS, zero nearest-point proxies.
**10,311** rectangles / **886,312** nonzero cells / **193,428** Setup JSON bytes,
with all six indexed material PNGs exactly rebuilt and checked by independent
PNG CRC/zlib/material-index decoding.

A separate 31×27 *physical obstruction* probe placed solid temporary blocks
at **x920–1099/y430–569** (central route closed) and
**x918–1109/y679–849** (lower return closed), independently. In both cases,
the west dock, east tram, quarantine lock, cargo bay, eastern observatory,
ion exchanger and deep mineral survey remained connected to the exact
Rover-gate spawn. This proves **static route redundancy for those seven
checkpoints**; it is not a dynamic flying/handling or native physics result.

Structural connected-solid recomputation on the R2 plane finds **67**
four-neighbour solid components, **65** without a direct solid path to
a world boundary (**69,193 occupied cells**, down from prior 103,121).
The remaining *unattached* pieces include intentionally suspended/isolated
ring remnants, but also a **9,097-cell eastern roof section** and an
**8,112-cell right middeck/truss component**. Their load-path legibility
needs independent art/engineering adjudication; inert solid does not imply
runtime collapse. This candidate remains **DRAFT/HOLD, NATIVE-UNTESTED**.


## R3 — exact-cell structural and phasewell repair (HOLD)

R3 materially joins the inhabited eastern upper roof into overhead rock and
connects its quarantine sample gallery to that roof. It bonds west xenology
works to the native rock canopy, the eastern lower tram to the rooted phasewell
support, and both broken ring crescents through asymmetrical upper/lower load
paths. The left emitter has a substantial ruptured shield, glowing diagnostics
and a separate inspection ledge. Deep archive and survey slabs receive short
rock ties. This is authored static CyberSand material-cell construction, not
image paint or an engine change.

The first candidate full-height support columns were rejected because exact
Midge-hull floods showed that they severed cross-district routes. The corrected
R3 geometry was preflighted on the full 2,097,152-cell prior plane, retaining
all sixteen exact named destinations under 19×15, 23×19 and 31×27 hulls,
and seven key sites through both central and lower obstruction experiments.
The committed independent verifier also rejects detached occupancy above
30,000 cells. Exact regenerated receipt, PNG hashes and full pixel parity
remain the authoritative reproducible gates. No native Workbench install,
flight steering, simulation or save/reopen has been performed: **NATIVE-UNTESTED**.
