# R2 implementation receipt (17 Nov 2026)

**Source-led material-cell repair complete for independent audit; Draft/HOLD, NOT native/owner accepted.** PR #14 starting head `1e80acc80fa9efb3437ef82ff936a726eb56591c`. Deterministic builder seed 20261117. Full extent 2048x2048, 13387 coalesced non-overlapping rectangles, 256936 bytes, 20/20 exact named destinations reachable in fully-in-bounds 19x15, 23x19 and 31x27 static clearance. 9 genuine material-grid PNGs, zero CRC/pixel mismatches. Original source JPEG blob `adfb56729b2c443a513892fbe803718dc8b71e52` directly viewed. Original PNG full-resolution parity unverified; source-matched native gameplay/installation/save-reopen NOT RUN.

**Actual geometry delivered:** singular anchored irregular moss/root bridge, much larger rooted west temple and tree canopy, independent small right sanctuary with stone guardian physically integrated on the east ledge, stepped terraces, distinct lower cave route system and offset eastern spur. Removed R1's 3 stiff viaducts, detached faces, repetitive 5-tier rooms and rectangular water tank. Reconstructed all 4,194,304 cells; do not interpret positional losses of five retired R1 destinations as substitutions. See README and evidence.json for source-vs-output and exact static gates.

**Original source and archived history remain unchanged.**

---

# Canvas R2 — RUINS-0013 Twin Ravine Temples
**Historical seed brief follows; R2 implementation above supersedes its seed-only status.**
**Worker: B exclusively (after completion of WORKS-0023 PR #13); PR must remain Draft / HOLD.**

## Provenance and authority

- Canonical public reference: `ruins-0013`, `artwork/ruins_monuments/batch1/rootbound_guardians-twin_ravine_temples-suspended_tension.png`
- Catalogue source key: `batch1/image-0212`; full original PNG Git blob: `0611d05df37b443a411c1ebf9dba663082e25975`; published source SHA-256: `47f4039fb0547f6799b0e3b445a12869e1a7dc5904c68e1725d2ba2d52aa5bdb`.
- **Actual source pixels to compare:** byte-identical `gh-pages:previews/ruins_monuments/batch1/rootbound_guardians-twin_ravine_temples-suspended_tension.jpg` copied by blob SHA `adfb56729b2c443a513892fbe803718dc8b71e52` into this folder as `source-reference-preview.jpg`. This derivative has been decoded and visually inspected. Do not re-encode it.
- Full-resolution original PNG is **not decoded/verified**. Do not claim full original pixel parity on the strength of the source JPEG preview.
- Frozen archived R1 map: merged *historical/unvalidated* PR #4; source directory `cybersand-canvases/2048x2048/ruins-0013-twin-ravine-temples/` on `main@99a166e7fcae45eb22be1740e9f33f62faccbcc7`. Do not overwrite history on main.
- Accepted CyberSand schema/material/actor authority: `techrote/cybersand main@018bd09503d7f079ddac52e225c2f7daf8d678bf`; revalidate if main changes. No engine code edits.
- Legacy R1: 2048×2048, 28,733 rectangles (near 32,768 cap), 545,894 bytes, spawn [1024,454], 17/17 legacy 19×15 exact static destinations, 26,928 enclosed Water cells. These are *historical claims to recheck*, not admission or native acceptance.

## Source JPEG: actual observed composition (acceptance authority)

The photo is a **side-on verdant cliff sanctuary with two UNEQUAL rooted masonry masses** split by a large, luminous open-air ravine. The left temple is broad, arboreal, deep terraced and asymmetric: one huge mature tree crowns it, its long roots grow around the carved stone stairs and chambers, and a few dark shrine entrances puncture solid rock. The right temple is **smaller**, with a squat guardian-like eroded monolith on its ridge and tiers of stone steps/terraces. A **single narrow irregular moss/root suspension bridge** connects the sanctuaries around the middle-high elevation. Vertical drops, misty distant landscape, hanging creepers, vine-shadowed ledges and sharp contrast between dense rooted stone and clear central sky dominate the reading. A second lower vegetated spur on the right provides variation, not a second symmetric viaduct.

The surviving historical map image instead shows five broadly equal opposing gallery tiers, an almost empty central shaft with **two disconnected floating face icons** midair, three rigid horizontal decks, spiky decorative fragments and a literal blue water box. This is neither the source silhouette nor its playable spatial premise. Correct that actual material-cell composition, not just its palette.

## Required repair — actual navigable geometry, not a poster

1. **Macro-silhouette first:** Make west cliff larger, denser and rooted; east cliff narrower and offset, with distinct asymmetrical stepped rock and upper guardian *integrated into the solid cliff* rather than floating masks. Preserve a deliberately huge central air ravine with dramatic sky negative space. Avoid reducing it to a monotonous vertical empty tunnel.
2. **One signature suspended living crossing:** A reasonably narrow, irregular, structurally anchored moss/root/stone bridge at the source's high-middle band is the visual traversal hero. Remove/demote extra identical horizontal trusses; if more gameplay crossings are needed, create meaningfully different offset root spur/hidden lower cave routes **inside the cliffs**, not more repeated slabs spanning the entire void.
3. **Source-specific left/right districts:** Left: old tree canopy silhouette, visible descending root buttresses, small asymmetric temple thresholds, terraced ruins and vegetated vertical access. Right: integral monolith sanctuary, irregular stone stairworks, an unevenly layered lower walkway and one distinct high lookout. Maintain flat orthographic 2D, consistent horizontal/vertical collision geometry, no angled false perspective and no cropped features.
4. **Playable actor-scale spaces:** Midge must traverse a continuous connected operational-airspace graph through both sanctuaries, across/around the central divide and to meaningful lower regions. Do not represent a room or shrine as reachable if the exact centre cannot fit the actor. Design source-inspired ledges with enough real flight space/portals, non-trap returns and deliberate open voids. A pure 1-cell flood fill is forbidden.
5. **Safe material physics:** Foundations, roots, bridge supports and cliff volumes must be genuine accepted-main inert **Solid / RuleKernel::None** IDs; not Stone powder ID 13, invented IDs 237/250, reactive growth, loose powders or unsupported floaters. Preserve or responsibly redesign R1's 26,928 Water cells only if a plausible protected basin is spatially justified; fully contain liquids and explicitly evaluate actor access and native progression. Avoid decorative hazards obstructing flight passages.
6. **Rebuild, do not layer to failure:** R1 is already 28,733/32,768 rectangles. Reconstruct the final material plane and **coalesce/repack** it; no accumulation of overlays beyond the 32,768 limit. Keep the serialized JSON ≤1,048,576 bytes. Validate true current Setup-v2 / generated-start acceptance, actor model hash, default native bridge rectangle capacity vs old 4,096 fallback, and all material IDs against accepted source.

## Required deliverables and tests

- Modify existing `builder.cjs` or add a deterministic R2 builder; produce a **new actual Setup-v2/generated-start JSON** at 2048×2048, one true-grid 2048×2048 PNG (overview optionally downscaled from the exact grid), **at least six labelled 1:1 native-cell crops** covering both rooted temples, anchored bridge, upper canopy/guardian, lower passages and water/landmark. The source JPEG remains untouched.
- A concise revised README and machine-readable qualification receipt: exact source IDs/blobs, new material histogram, edits/byte budgets, frozen-material law audit, full 4,194,304-cell replay/PNG parity, actor/spawn identity, no invalid edits, exact target coordinates and actual static graph sizes.
- Define **new meaningful semantic operational targets** in supported in-world airspace (left threshold, west root terrace, living bridge each end, right sanctuary, high lookout, east lower spur, lower return, any basin overlook). For each target, demonstrate exact-centre clearance and four-neighbour reachability from the unchanged Midge spawn using 19×15 minimum conservative footprint plus at least 23×19 handling stress where possible. Use current 4×3 actor hull; nearest-point substitution/large radius waiver invalidates admission. Recheck legacy 17 points as positional regressions but do not falsely claim displaced monuments persist.
- A real source-vs-output JPEG/full-map/1:1 side-by-side comparison including explicit limitations of JPEG-only source. Declare physical Windows/Godot/CyberDemoBridge/Rapier input, collision, native rectangle-capacity readback, bounded simulation and save/reopen **NATIVE-UNTESTED unless exercised on a matching installed runtime**.
- Re-run deterministic full build twice, compare hashes, check PNG integrity and pixel parity, exact setup-schema budgets, source integrity, self-contained artifacts, and document known failure modes. If any qualification fails, repair it before DONE.
- Post `CANVAS-REWORK-B-DONE: <new-head-sha>` on THIS PR when actual cell changes and evidence are committed; leave Draft/HOLD for independent visual/technical review and owner physical acceptance.

**Prohibitions:** No new unrelated map, no changes to the full-resolution artwork, no archive-main changes, no CyberSand engine code, no merge, no Ready, no auto-merge, no AI-lookalike source image. This seed-only PR is **REWORK REQUIRED**, never owner-playtest-ready before cell edits and qualification.
