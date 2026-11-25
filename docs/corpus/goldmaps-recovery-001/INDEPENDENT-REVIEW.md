# GOLDMAPS-RECOVERY-001 — independent exact-HEAD audit and artifact recovery verdict

**Observation:** 22 November 2026. **Review scope:** frozen [GOLD-ASTRA-001 ledger #209](https://github.com/techrote/sandmapsreference/pull/209) at `5982fa553bc6356742cfea0911c848c372dcdb97` and all associated source PRs. **Authority:** read-only preservation, independent source-static verification and isolated evaluation delivery. No original branch rewrite, merge, Ready promotion, Gold/Platinum acceptance, production schedule or CyberSand engine change.

## Recovery and custody facts

1. **Exact-source references:** 71 distinct GitHub PRs (40 registered prepasses, 12 original portrait targets, 25 proposed Gold exemplars, 8 trial originals, 5 changed trial descendants, 7 portrait repairs and supporting infrastructure with overlaps) rechecked against their pinned HEAD SHA. All matched, remain OPEN Draft/HOLD; 71 is the distinct union, not the sum of categories.
2. **586-file owner evaluator:** a one-off read-only GitHub [reconstruction run #45055686071](https://github.com/techrote/sandmapsreference/actions/runs/45055686071) PASS, artifact [#14766779315](https://github.com/techrote/sandmapsreference/actions/runs/45055686071/artifacts/14766779315). Original `owner-package-files.v2.json` manifest SHA256 `d26829e44ef697966ffde81424d8c22d9ae154b75e42122b4ac172e5c707dae0`; 586 files, 200,610,152 uncompressed bytes, zero mismatches/extra files. Locally recovered inner evaluator ZIP: 98,078,242 bytes, SHA256 `c49b784776fa66795755253921bcb99e9ca688c07e1cf36c579e545c08a97669`. Compressed ZIP hash depends on archiver; **individual manifest-pinned file hashes are canonical**.
3. **71-PR artifact preservation:** second one-off read-only GitHub [source export run #45056414055](https://github.com/techrote/sandmapsreference/actions/runs/45056414055) PASS, artifact [#14767751599](https://github.com/techrote/sandmapsreference/actions/runs/45056414055/artifacts/14767751599); 1,343 changed-file occurrences, 1,124 distinct Git blobs, including 604 PNG occurrences. Exact source-delta inner archive is 6,730,063 bytes SHA256 `ea32029b77983e8d2b12f3ee485629347239f11537e77f8e21f1ced3e0953419`. An independent post-download audit recalculated all 1,343 Git blob hashes and SHA256 receipts: **0 mismatches**. Original accepted-main files are not redundantly duplicated. Recovery script `archive_goldmaps_sources.py` is committed on this branch; this does not add or execute creator-authored scripts.
4. **Durable review evidence:** complete 151 KB [Windows qualification #44990714746](https://github.com/techrote/sandmapsreference/actions/runs/44990714746) log and parsed JSON are mirrored in this recovery branch, including 21 passing Windows PowerShell installer checks, full 586-file manifest check, 8 headless Godot native tests with Midge actuation/contact, normal save and fresh-process reopen. Earlier Windows runs #44990138494/#44990272976 failed and remain historical evidence; not overwritten.
5. **Immutable scientific originals:** preregistration, output lock, gold25 selection, source-plane audit, per-arm source-to-candidate qualification and native summaries remain byte-identical to #209. Seven separately sampled snapshots have equal Git blob IDs on recovery branch and source.

## Independent material-cell replay

**Method:** separate Python implementation reads recovered frozen Setup-v2 JSON (without invoking author builders), validates 2,097,152 pixel material planes per arm as nonoverlapping in-bounds rectangle writes, recomputes row-major uint8 material SHA-256, compares original/candidate cells and non-`edits` Setup fields, then tests conservative Midge-centre reachability on 19×15, 23×19 and 31×27 rectangular hulls, with and without each documented obstruction. This is source-static *connectivity* and does not imply actual flying, shortest-path equivalence, engineering loads or physics.

| Arm | PR source → candidate | Changed material cells | Changed XYXY bbox | Named original centres | Change-count SHA/geometry and reachability |
|---|---|---:|---|---:|---|
| C1 | #159 → byte-identical | 0 | — | 27 | PASS |
| C2 | #150 → byte-identical | 0 | — | 29 | PASS |
| C3 | #197 → byte-identical | 0 | — | 25 | PASS |
| B1 | #152 → #212 | 3,283 | [1020,628,1230,743] | 24 | PASS |
| B2 | #167 → #210 | 5,195 | [944,868,1182,914] | 19 | PASS |
| B3 | #170 → #213 | 2,376 | [726,250,837,589] | 34 | PASS |
| D1 | #186 → #214 | 15,807 | [362,634,938,1741] | 22 | PASS |
| D2 | #196 → #211 | 7,692 | [355,581,930,1443] | 24 | PASS |

**Results:** all eight reconstructed candidate material-plane SHA256 digests match the frozen owner manifest, 34,353 altered cells across the five edited maps, no changes to settings other than `edits`, and no new lost named-site connectivity in any of 48 hull/obstruction test cases. The original documented obstruction exceptions (e.g. a covered centre in C2/B3) remain unchanged rather than being falsely called reachable. This is an independent evidence supplement, not a reissue of an earlier author's SOURCE-STATIC PASS.

**Art inspection:** inspected actual recovered original/candidate same-coordinate 1:1 crops and independently generated changed-pixel masks for receiving cradle (B1), examination table (B2), racing fork (B3), high crossing and entered drill workface (D1), and suspended magnet/compression workface (D2). B1/B2 show direct missing causal/structural junctions made legible; B3 intervention is modest and real racing-choice comprehension needs dynamic player evaluation; D1's additional drill route remains optional; D2's magnet and press are static geometry, not mechanically running components. These are grounded observations rather than a new blinded aesthetic verdict.

## Red-team disposition and uncompleted acceptance

- **Gold25 remains 24 core plus conditional #125**; neither the 25 Gold slate nor any Platinum/Pyrite label is owner-accepted.
- **C1/C2/C3 No-change** are positive abstention outcomes, not failed edits.
- **B1/B2** are strongest uncomplicated improvements; **B3** is inconclusive as a *racing* readability intervention. **D1** improved the original but an earlier repaired reference was preferred in comparative review; **D2** produced a more differentiated static press/magnet with comparison dissent retained. Historical 4 Platinum-candidate / 3 No-change / 1 Inconclusive summary is explicitly provisional.
- **Experimental blinding limitation:** frozen qualification admits `fully_blinded_review=false`; curator saw some references during corpus selection. Prior repair-worker artifacts should not be labelled human-authored without proof. A final assessor-by-assessor post-lock comparison is not yet a definitive immutable decision record.
- **Native limitation:** standard hosted Windows headless acceptance was actually executed, but no physical owner NVIDIA/Firefox/Windows graphical playfeel, all-world route flight, machinery movement or extended-duration behavior has been certified.
- **Data-retention limitation:** GitHub Actions ZIP artifacts expire after 90 days (20 February 2027). The recovery PR preserves immutable scripts, complete source SHA registries and manifests to rebuild them later, and retains Windows log text directly. Do not claim the live ZIP downloads are perpetual.
- **Owner acceptance:** do not merge this archive or the original PRs automatically. An independent review should confirm the archival scope and no-geometry-change rule; the owner remains sole Gold/Platinum/Pyrite acceptance authority.

**Verdict: exact-source custody and full evaluator recovery COMPLETE; source and original-vs-candidate static integrity PASS; original implementer no longer needed to rebuild these artifacts. Scientific art comparison and owner GUI acceptance remain OPEN, and no further experiments or merges are authorised by this recovery.**
