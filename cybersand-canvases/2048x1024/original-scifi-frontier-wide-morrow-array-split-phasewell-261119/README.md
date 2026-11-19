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


## R4 — grounded frontier instruments and district-scale service repair (19 November 2026)

The exact original 2048×1024 **Morrow Array / Split Phasewell** was improved at the
actual material-ID-cell level, not from a source photograph or an AI picture.
The fixed seed and the unchanged existing 16 site coordinates remain authoritative.
Original generator `build.cjs` and its final `repair-structures.cjs` overlay
regenerate the complete Setup-v2 and all actual indexed-cell PNGs byte-for-byte.

- **West civic/xenology:** the previously detached upper rover deck has a short
  forked structural bracket into the existing shell rather than a world-blocking
  column. The upper lab now has a pierced specimen carousel, extraction duct and
  dedicated rover-wheel diagnostic station; lower assay machinery has a vertical
  probe and non-mirrored readout plinth.
- **Lower geology:** a former detached geolab slab gains a rock-backed diagonal
  to the already rooted lower survey installation, with borehole head servicing.
- **Broken phasewell:** an asymmetrical inspection operator shelf, control mast,
  subordinate luminous diagnostics and physical service rail were added without
  filling the three named phasewell flight centres or completing the broken ring.
- **Eastern harbour:** true-cell quarantine specimen handling, unload weighing
  station and an overhead freight hook are differentiated from the enclosed
  rover-refuel/repair cradle; under-bay cranes visibly return to their decks.
  The added material is selectively structured, not repeated box-wallpaper.
- **Deep survey:** a compact service receiving port and actual structural
  underbracing connect to the lower geology; the critical low flight return
  remains open.

### R4 independently reproduced results

| Gate | R4 final |
|---|---:|
| Material extent | **2048×1024 = 2,097,152 cells** |
| Occupied physical cells | **904,447** |
| Supported/anchored occupied cells | **892,551** |
| Residual detached occupied cells | **11,896 / 35 components**, down from R3 19,047 / 51 |
| Lossless ordered rectangles | **11,224 / 32,768** |
| Setup-v2 bytes | **210,149 / 1,048,576** |
| Whole-plane indexed material SHA-256 | `33fd3e8040bd2c46e38826709ceffd5ae435c60bef26290b36d487c9930106c9` |
| Complete cell replay, legality, no overlaps | **PASS** |
| Exact named centres at 19×15 / 23×19 / 31×27 | **16/16 each** |
| Two separately inserted central/lower route obstructions | **PASS; 7/7 critical cross-district centres retained** |
| Original indexed PNGs, actual pixel parity | **6/6 PASS**, one full-plane and five original unscaled 1:1 crops |
| Installed native bridge, Godot/Rapier/Midge gameplay, save/reopen | **NATIVE-UNTESTED** |

All still-existing detached assemblies are inert, immobile solids per the
read-only accepted CyberSand material catalogue; they do not imply falling
physics. However their intended supporting technology and gameplay purpose
remain open questions for the *next independent exact-HEAD artistic/technical*
review. The geometry proves conservative static clearance, not actual
closed-loop steering, powered machinery, collision runtime performance or
cross-process persistence. Older installed native bridges can report only
4,096 starting rectangles despite accepted source supporting 32,768, so
**no native import or owner-playtest acceptance is claimed**.

The branch-local workflow was temporarily given content write only to commit
fully regenerated material-cell JSON and PNG artifacts; that one-shot step
was then removed and **`contents: read` reinstated**. The independent
verifier now asserts R4 structural non-regression (≤15,000 detached cells
and ≤40 detached components) in addition to full-grid parity and flight tests.

**Status remains OPEN Draft / HOLD.** No source image, historical canvas,
sibling creator branch or accepted CyberSand engine code was modified.


## R5 — Authentic inhabitable circulation and supported phasewell machinery (19 November 2026)

This is new actual-cell construction on the original Morrow Array, responding to [Shepherd R4 REWORK](https://github.com/techrote/sandmapsreference/pull/20#issuecomment-7001001543); not a reworker, source-led conversion, historical-PR change, external illustration or CyberSand engine modification.

**Art/physics changes:** eliminate several unsupported dummy strips and ore fragments rather than crowding the great rift; give the split phasewell an asymmetric crescent-mounted spectrometer, physical support cable and inspection station; ground freight gantries, west and lower geosurvey landing loads; preserve the interrupted crescents, asymmetric upper trusses, cavern bedrock, distinct cargo/xenology districts, wide central negative space, high/low flight paths and all original 16 named sites.

**Four new exact original operational destinations:** West specimen room **(202,424)**, West rover diagnostics **(341,421)**, East quarantine inspection **(1667,424)**, East freight weigh office **(1835,423)**. Rather than merely painting machines behind walls, widen side-entry circulation and open a **57-cell physical freight-lift throat** from the cargo deck to the freight workroom. The retained room hardware receives real deck/roof ties. The four interior centres are validated at all three Midge clearance sizes (19×15, 23×19, 31×27) by independent four-neighbour flood, along with the unmodified original 16. No nearest-site waiver or snapping.

**R5 reproducible source qualification:** exactly 2048×1024 = 2,097,152 material cells; 898,649 non-air inert structural cells; 11,557 lossless nonoverlapping rectangles; 216,013 Setup-v2 JSON bytes; full material plane SHA-256 \`27b3f9970806af111c3c443a74b96af9f87e7ee5509d808730762522e62a4afb\`; all **20/20 exact sites pass each Midge envelope**, both inserted central/lower obstruction tests preserve the critical long-distance alternatives; genuine six indexed material PNGs must be regenerated and CRC/inflated and compared against every source material cell; zero-difference deterministic replay required. Full connected-solid accounting: **898,037 boundary-grounded**, **612 detached cells / four small components**, down from R4 11,896/35. The intentionally detached remaining small pieces require independent artistic judgment; inert material does not prove structural-load simulation.

**HOLD** pending independent R5 exact-HEAD art, technical and Shepherd review, installed native rectangle capacity (older bridge may be 4096 vs current source 32768), Godot/Rapier/Midge steering/collision, and fresh-process save/reopen. **NATIVE-UNTESTED**, no owner acceptance.

## R6 — structural completion of four isolated operational panels (19 November 2026)

On the fully regenerated R5 material plane, an independent four-neighbour occupied-solid
flood identified exactly **612 detached cells in four fixtures**, rather than a large
suspended load: east solar telemetry vane 243, west xenology instrument board 176,
west tram signal panel 175, west lab dashboard 18. The four existing material features
are preserved and given minimal **authored solid** cable/flange links into their nearest
rooted frame (8, 33, 28, 5 centre cells respectively). These are actual inert CyberSand
material-ID edits in `repair-structures.cjs`, not a drawing or PNG-only change.
The added ties were independently preflighted against exact 20 named sites at
all 19×15, 23×19 and 31×27 full hull clearances and both physically blocked
cross-district bypasses before committing this authoring source.

The **R6 committed receipt and PNG assets** supersede R5/R4 cell counts once
the one-shot publication finishes. Reconfirm immutable exact-head independent
GitHub Actions qualification, source-aligned Setup-v2 budget, material-plane SHA,
pixel-perfect genuine PNG crops and functional loads. Installed native bridge,
Godot/Rapier/Midge in-session control and save/reopen remain **NATIVE-UNTESTED**.
Keep Draft/HOLD pending separate new-HEAD art/technical/Shepherd review.


## R7 — functional inhabited workroom construction (19 Nov 2026)

The Shepherd's R6 P1 was **inhabited engineering**, not material support: zero
disconnected solids was already proven, while the upper west and east operations
still read as floating consoles in oversized roofs. The new
`repair-workrooms-r7.cjs` is a separately bounded, deterministic actual-cell
finishing stage layered after all R6 repairs. It adds coherent, materially
load-bearing **west specimen decontamination and rover-diagnostic bays**,
a distinct **east quarantine intake**, an **overhead freight scale/transfer bay**
and an **east refuel/repair cradle**. Operations are differentiated by their
working geometry and material path, not only palette or glow.

Side entry is real: door jambs have 37–40+ cell-high interruptions at meaningful
approaches; the central west transfer throat remains open. Crucially, the
**existing freight scale/lift aperture x1825–1882, y443–466** is protected:
rebuilding a continuous floor over that cut isolates the freight weigh office
under 31×27 Midge clearance and is therefore expressly forbidden. This was
reproduced in construction preflight and corrected in R7's shortened deck
support at x1754–1822. No stage is allowed to inflate a small interior into a
world-sized room or destroy the wide rift's two independent flight returns.

**Prepublication in-memory whole-grid check:** 902,819 occupied stable cells;
**zero detached material cells and zero detached solid components**; exact
20/20 destination reachability at **19×15, 23×19 and 31×27**. Both independent
31×27 inserted-obstacle detours retained all seven named cross-district critical
sites (central gap x920–1099/y430–569 and low return x918–1109/y679–849).
These construction-side measurements are superseded by the committed
regenerated Setup/receipt/full-material PNGs plus independent read-only CI
once those artifacts are published. Native physics/collision/import and
fresh-process save/reopen remain **NATIVE-UNTESTED**.

This remains an original source-free 2048×1024 side-elevation material-cell
landscape on the same creator-owned Draft/HOLD branch. Do not interpret static
reachability, visual design improvements or autonomous construction as owner
acceptance; request an independent new-head Shepherd/art/technical audit.
