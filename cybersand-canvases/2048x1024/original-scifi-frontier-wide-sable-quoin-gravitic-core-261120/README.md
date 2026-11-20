# Sable Quoin — Gravitic Core Survey and Fracture Bridge

**ORIGINAL / NO REFERENCE ART · 2048×1024 actual material cells · R3 CREATOR STATIC PASS · independent exact-head review pending · OPEN Draft/HOLD · NATIVE-UNTESTED**

## Site and authorship

An inhabited offworld geodesy station occupies two fractured basalt escarpments enclosing a huge clear flight basin. The five-arm asymmetric gravimetric collimator is suspended by a visible upper tension path rooted in the western bedrock and by uneven structural struts; its core is physically entered and inspected rather than a decorative circle. The western rover/assay settlement, core comparison works, eastern sterile/quarantine service port and deep four-bay dry understrata form differentiated functional districts.

The following material-cell assemblies are original to this map, not stamps copied from any other canvas: five unequal collimator ribs, offset counterweight wing, two uneven embedded rover tiers, two nonidentical side-entry gantries, east sterilization/scrubbing chain and four distinct understrata apparatus bays (crane-fed mineral comparator, ram seismic press, four-cassette isotope sorter, finned thermal exchanger).

**Player goal:** arrive at western rover port; survey the collimator via both comparator stations; secure eastern sterilization and freight operations; return through the accessible dry understrata or overhead route.

**Route graph:** West rover arrivals → West isotope dock → West assay lab / machine bay → West gantry overlook → West comparator → Core diagnostic viewport / lower cathode → East comparator → East decon → Sterile isotope lab → East rover evacuation. Parallel loops: Western ridge → upper sky bypass → Eastern ridge; western rescue throat → four physically entered understrata stations → eastern rescue throat. Local basin recovery sites provide staging after collision or missed approach.

## Exactly reproducible material source

Run `node build.cjs` within this folder to reproduce the committed `setup.json`, `receipt.json` and every PNG. `node build.cjs --verify` checks byte-for-byte identity, SHA-256 using independent Node crypto, independent Node zlib PNG decompression, CRC-32, image dimensions and every material-index pixel against regenerated cells. Deterministic seed **2535951**. No external images, learned textures, screenshots or native execution are involved.

- Accepted CyberSand read-only main: `de109d0131641d6adc8d25bb9ced7ca3d4991105`.
- Map repository default main at branch creation: `99a166e7fcae45eb22be1740e9f33f62faccbcc7`.
- Source final material-grid SHA-256: `9021072dc0a5f2906671d17487150fdd92236d1639c7926364397a3146c9ff68`.
- Source Setup-v2 SHA-256: `e9483425d8752532feee25a292630a731fc69ea87121b438ad37d98343a53121`.
- Dimensions: **2048×1024 = 2,097,152 indexed material cells**.
- Canonical lossless ordered disjoint edits: **5267**, Setup JSON **97979 bytes**, rectangle work **442895**.
- Solids: **442895/442895 rooted**, **0 detached**, **1** final solid connected component(s).
- All nonzero material IDs from accepted static inert solid/None catalogue; no unstable powder, mobile fluid, reactive support or free liquid.
- Exact named checkpoints: **28/28** connected at all **19×15, 23×19, 31×27** collision envelopes with unshifted literal coordinates and complete in-bounds 4-neighbour free-centre BFS.
- Literal physical obstruction **[1016,329,1074,416]** blocks **Core diagnostic viewport** and still permits 27/27 other destinations at conservative 31×27.
- Source claims rectangle budget 32,768 / JSON cap 1,048,576 bytes / work 32,000,000; installed legacy CyberDemoBridge may permit only ~4,096 rectangles. **These 5267 rectangles require installed-capability revalidation.** Do not weaken design to meet unverified legacy capacity.
- **NATIVE-UNTESTED:** no actual installed Godot/Workbench/CyberDemoBridge/Rapier actor play, collision, advancement, save/reopen or persistence was performed.

## Authentic images (indexed material IDs, no AI artwork)

![Actual 2048x1024 material cell overview](overview.png)

| Genuine 1:1 physical district crop | Image |
|---|---|
| Western isotope rover port, inhabited workshops | ![West port](01-west-isotope-port.png) |
| West upper structural tension and comparator support | ![Support](02-west-collimator-support.png) |
| Five-arm survey collimator and active comparative workfaces | ![Survey core](03-star-core-laboratory.png) |
| Eastern quarantine, sterile assay and freight handling | ![East depot](04-east-sterile-depot.png) |
| All four individual understrata laboratories/service bays | ![Subsurface](05-understrata-workcells.png) |

All images are palette-indexed PNGs in which the pixel index equals the actual material ID from the committed setup; 1:1 district crops have no scaling. Image audit metadata and hashes are in `receipt.json`.

## Reviewer checkpoints and HOLD

Independently replay committed Setup edits across all cells, check material state/kernels and support, canonical rectangles/histograms, exact centres and obstruction, each PNG's pixel parity, life-scale interior widths and distinct functional machinery, and provenance. Request separate source-pinned Art/Technical/Shepherd decisions. Source-static success is **not** native-engine acceptance. Remain **Draft/HOLD**, no Ready, merge or owner acceptance.

## R3 P0 correction — 20 November 2026

Reproduced the independent Shepherd's accepted-loader failure: R2 `build.cjs` indexed `sites["West arrivals"]`, which is undefined; `JSON.stringify` silently omitted the required actor `spawn` field. Corrected the lookup to the existing exact literal `sites["West rover arrivals"] = [205,451]`. The committed Setup-v2 now includes `spawn:[205,451]` in the Midge actor's **exact five-key schema**; the builder asserts the exact 14-root and five-actor key contracts, verifies the literal spawn/site at 19×15, 23×19, 31×27 and independently replays all material rectangles. Regenerated every PNG from the *actual updated builder* so the new understrata workfaces are committed material pixels rather than builder-only claims. All 28/28 literal sites and 27/27 unaffected obstruction sites pass, 442,895/442,895 occupied cells are grounded. **No actual native runtime or installed bridge test was performed.** Previous Art/Technical/Shepherd assessments are stale for this new HEAD; fresh independent reviews requested. Draft/HOLD remains.
