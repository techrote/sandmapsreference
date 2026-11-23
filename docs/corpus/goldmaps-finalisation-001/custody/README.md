# Goldmaps custody and provenance — finalisation v1

**Byte custody is complete for the original 71-source recovery and three newly recovered portrait donors. Historical negative evidence is partly recoverable, with explicit per-file gaps. These statements do not assign Art, native, Gold, Platinum, or owner acceptance.**

## Verified source authority

The unchanged recovery foundation is PR #215 at `6c4edd3d05476848cbebb800090080ae824ad208`; accepted main remains `99a166e7fcae45eb22be1740e9f33f62faccbcc7`. The original 71 source HEADs were fetched independently using Git, and compared with fresh GitHub PR responses on 23 November 2026. All 71 matched their frozen identities and remained open Drafts. No original branch was modified.

[master-artifacts.v1.json](master-artifacts.v1.json) indexes **1,343 source-file occurrences, 1,124 unique Git blobs, 604 genuine PNG occurrences and 77 Setup-v2 occurrences**. Each row has source PR, exact commit, Git blob/mode, SHA-256, byte length, image/Setup dimensions where applicable, immutable source URL, archive-relative recovery location, scientific roles and explicit pending owner acceptance. A source PR occurrence is not a claim about the file's earliest historical author. Repeated baseline or reference files remain distinct provenance occurrences.

The archive is each PR's complete changed-file delta against accepted main. Unchanged accepted-main files are intentionally omitted. All 1,343 occurrences were checked against independently read exact Git trees, the archived SHA-256 receipts, and the actual extracted bytes. The original container also matches SHA-256 `ea32029b77983e8d2b12f3ee485629347239f11537e77f8e21f1ced3e0953419`, 6,730,063 bytes. [verification.v1.json](verification.v1.json) records the executed result. The frozen 586-file Windows evaluator has its separate authoritative manifest in the unchanged recovery snapshot; native qualification owns its runtime evidence.

## Additional donor recovery

The original 71-source archive did not include three genuine ancestors referenced by the frozen portrait transfer metadata:

| Donor | Exact commit | Original portrait |
|---|---|---|
| #37 Silt Meridian Twin Bascule | `e2b53fb95ea93576afdc15c114e29b853c4b2c05` | #197 |
| #124 Warden Scrapline | `99616a8c8d2475ad4145a8489c0cc8850b1bd783` | #196 |
| #135 Spindlebreak Fault-Cable | `a3f9962a0107d07bca1116940fde1c825ac76a4f` | #192 |

All **36 map-directory files** were acquired from those immutable commits and checked against Git object identities. [supplementary-donors.v1.json](supplementary-donors.v1.json) provides their individual hashes and paths. This is additive recovery; the original 71-source inventory is unchanged. Unrelated donor CI workflow files are outside this supplemental map-directory scope.

## Recovered failed experiments

The original author's scratch path no longer exists in this execution. Exact retained Git histories contain the five failed-attempt inventories, but not the complete five failed bundles. We matched all surviving shared file hashes, then reversed only changes explicitly described in the final frozen `fix-evidence.json` and rationale.

| Historical failed attempt | Recovery result | Re-executed original failure |
|---|---|---|
| B1 / 001 | Hash inventory, shared files and exact build configuration; unique Setup unavailable | Not claimed |
| B1 / 002 | **Exact original Setup, full plane, images and validation bytes reconstructed** | Obstruction detour disconnects at all three hulls |
| B3 / 001 | Hash inventory, shared files and exact build configuration; unique Setup unavailable | Not claimed |
| B3 / 002 | **Exact original Setup, full plane, images and validation bytes reconstructed** | Downstream 31×27 throat disconnects |
| D1 / 001 | **Exact original Setup, full plane, operations, images and validation bytes reconstructed** | 17,472 changed cells exceed the frozen 16,000 cap |

**154 of 182 failed-bundle file occurrences are recovered; 28 remain hash records only.** Every newly recovered original file is admitted only when both its byte length and SHA-256 match the pre-existing ledger. The three recovered Setup files also reproduce the exact original material-plane hashes and transition counts. The frozen validators were executed and reproduced their complete original issue lists and `validation.json` hashes. The original five failure verdicts remain FAIL.

B1/B3 inverse operations are stored under `RECONSTRUCTION-INPUTS` and are expressly derived input metadata; their prose is not the author's lost `operations.json`. Their output Setup bytes nevertheless match the original frozen hashes. D1's restored operations file also matches its original hash. No plausible substitute was created for B1/001 or B3/001. The historical `input-access.jsonl` and `attempt-history.jsonl` remain hash-only records; their complete original bytes are not present in the recovered repository or current scratch.

[failed-reconstruction/failed-attempt-custody.v1.json](failed-reconstruction/failed-attempt-custody.v1.json) records every recovered, reconstructed and unrecovered file separately. This prevents a recovered hash manifest from being confused with recovered artifact bytes.

## Exact review provenance

[review-provenance.v1.json](review-provenance.v1.json) indexes the original portrait baseline, all seven repaired children, and the union of 40 prepass sources with Gold25 (47 sources). Full review text is durably preserved in the adjacent `source-discussions`, `original-portrait-discussions` and `portrait-repair-discussions` files; each indexed review has its immutable reviewed HEAD, URL, comment ID, time and body SHA-256.

The original portrait programme independently records **5 PASS / 7 REWORK**. All seven repaired children have current-HEAD role-labelled Art PASS plus separate Technical SOURCE-STATIC PASS; those historical reviews do not establish native acceptance. Earlier failed repair reviews remain present and are never reassigned to a later HEAD.

Two Gold sources, #136 and #148, have earlier-HEAD Art PASS followed by Setup root-schema repairs. Independent complete material replay proves identical material planes, extent and actors before/after; changed nongeometry fields are explicitly listed in [art-geometry-equivalence.v1.json](art-geometry-equivalence.v1.json). Their status remains `PASS_SAME_MATERIAL_EARLIER_HEAD`, not invented exact-current-HEAD specialist review.

Current #116, #123 and #172 repair geometry has no subsequent specialist Art verdict in the live discussions. Older REWORK findings belong to older geometry. #125 has a current curator note, but no historical specialist Art PASS. New finalisation artistic adjudication is recorded by the separate scientific workstream.

Historical reviewers used the same GitHub account. Role-labelled independence is preserved as a historical claim; account attribution alone cannot prove distinct human assessors.

## Executed compatibility and refusal tests

- Frozen Corpus Index #102 at `3bfd70978de680ba459da2d32744a78dee64493a`: **9/9 tests PASS**. All **67** archived `exemplar.json` occurrences are `canonical-valid` under its unmodified validator. Its historical GitHub discovery intentionally covers landscape originals/worldgroups; portrait discovery belongs in the additive finalisation consumer.
- Frozen Feature Atlas #201 at `41721453f784373e0cd7bde48287e3f8d11a3315`: both Node validators **PASS**, covering 76 immutable states, 12 portraits, 38 unchanged baseline states, seven repair lanes and 27 exact-child current records. These are metadata checks, not renderer or physics tests.
- New custody refusal suite: **10/10 PASS**, including byte tampering, conflicting pins, unsafe paths, missing/extra/duplicate archive members, unsupported inverse reconstruction and source-input preservation.
- Real-archive repack tests **PASS**: all original file contents accepted in a new ZIP container; the optional exact-container gate rejects that repack; an added byte in one actual Setup is rejected by Git object identity. A separately rebuilt 71-source archive also passes the independent complete verifier.

The executable logs and machine-readable receipts are committed beside this document. Source-static findings do not claim native movement or owner GPU testing.

## Reproduction

These tools are in `scripts/goldmaps_finalisation/`. The original recovery acquisition scripts remain unchanged. The added source rebuilder avoids dependence on Actions retention or more than 60 unauthenticated GitHub REST calls: it uses exact Git commits plus immutable raw file URLs, with a bounded verified cache.

From an isolated clone of the finalisation candidate:

```bash
python scripts/goldmaps_finalisation/custody_rebuild_sources.py \
  --repo . --fetch \
  --inventory docs/corpus/goldmaps-recovery-001/inventory.v1.json \
  --cache build/goldmaps-blob-cache --out build/GOLDMAPS-all-71-source-PR-deltas.zip

python scripts/goldmaps_finalisation/custody_verify.py \
  --repo . --archive build/GOLDMAPS-all-71-source-PR-deltas.zip \
  --inventory docs/corpus/goldmaps-recovery-001/inventory.v1.json \
  --out build/custody-recheck

git fetch --no-tags origin \
  e2b53fb95ea93576afdc15c114e29b853c4b2c05 \
  99616a8c8d2475ad4145a8489c0cc8850b1bd783 \
  a3f9962a0107d07bca1116940fde1c825ac76a4f

python scripts/goldmaps_finalisation/custody_supplementary.py \
  --repo . --out build/supplementary-sources \
  --manifest build/supplementary-donors.v1.json

python scripts/goldmaps_finalisation/custody_test.py
```

The original archive container gate (`--require-original-container`) is only for validating the historical downloaded ZIP. Rebuilt ZIP metadata may differ; complete source file identities remain mandatory. To reconstruct the three recoverable failed maps, extract the validated source ZIP into a new directory, then run `custody_failed_attempts.py --source-root <extraction> --master <matching-master-artifacts.v1.json> --out <new-output> --execute-validation`. This uses the archived frozen Python helpers and requires NumPy, SciPy and Pillow. Source authoring inputs are read-only; every admitted reconstructed original remains hash-checked.
