# GOLDMAPS owner-delivery corpus lane

**Draft / HOLD. No owner acceptance.** This lane makes the frozen research
corpus usable through additive source-exact collection metadata, immutable
payloads, comparison cards and an independently consumable architectural export.
It changes neither an original map nor the frozen scientific adjudication.

## Population and identity

| Population | Count and meaning |
| --- | --- |
| Gold nominees | 25 logical aliases, including #125's finalisation recommendation and original #155's retained refusal. |
| Repaired portraits | Seven logical aliases, #202–208, with exact original portrait and landscape donor relationships. |
| Astra comparisons | 18 logical aliases: eight original/candidate pairs and two prior reworker references. |
| Policy-only variants | Two distinct integration descendants: recovered #155 and explicit default-policy #183 candidate. Neither replaces an original. |
| All-corpus source index | 70 unique source identities, including three supplementary landscape donors used by portraits. |
| Complete browser roster | 81 logical entries. Alias deduplication never removes scientific roles. |
| Bundled Setup payloads | 72 unique byte identities: 70 source maps and two policy-only variants. |
| Required fresh native targets | 53 aliases / 44 unique Setups, including two expected original refusals. Bundling the other references does not qualify them. |
| Optional extra native targets | 28 aliases / 28 unique Setups, disjoint from every required digest. These remain references unless their own fresh qualification succeeds. |
| Owner accepted | Zero. |

`roster-summary.v1.json` records every logical source, parent, exact commit/path,
Setup digest, plane digest and required-target status. The generated collection
adds source-authored family/topology information, material-ID counts, actors,
protected features, original preview provenance, separate Art/source-static/native
fields and the decision guide.

The all-corpus view chooses one logical alias for each of the 70 sources. Other
views retain their aliases: for example, #207 is both a Gold nominee and a repaired
portrait; the three no-change controls retain separate original/candidate roles
while sharing exact bytes.

`comparison-custody-review.v1.json` verifies all eight arms, 18 logical trial
aliases, 56 archived site images and exact source/coordinate identities against
the final decision packet. Independent full-plane replay reproduces the frozen
34,353 changed-cell total and the three exact unchanged controls. This is a
delivery custody check, not another artistic assessment. The shipped
`collection/COMPARISON-GUIDE.md` keeps the B3, D1 and D2 owner questions prominent.

## Build and validate

From this delivery repository checkout:

```sh
python tools/goldmaps_owner/corpus/build_collection.py --out NEW_FRAGMENT_DIRECTORY --cache VERIFIED_SOURCE_CACHE --engine-head EXACT_DELIVERY_ENGINE_COMMIT
python tools/goldmaps_owner/corpus/query.py --package NEW_FRAGMENT_DIRECTORY validate
```

The builder verifies the frozen corpus lock, retrieves immutable SHA-pinned
source bytes, checks both SHA-256 and recorded Git blob identities, and independently
replays every full material plane. It rejects a populated output directory.
Final publication supplies `--delivery-source-head EXACT_DELIVERY_SOURCE_COMMIT`.
The builder checks that commit's generator file against its own bytes before
recording the generated #183 descendant's source. The record distinguishes the
tracked generator path/function from the generated Setup's artifact path and
SHA-256; it does not pretend the generated map was an original tracked source.

Exact Setup payloads are deduplicated by SHA-256. Source overviews remain full
resolution; cropped evidence is copied unchanged. The build tool is not launched
by the owner-facing browser. After extraction all reference use is offline.

`collection/collection-files.v1.json` records the precise fragment file inventory,
hashes, sizes and origins. It excludes its own bytes. The final kit's broader
manifest must cover the runtime, browser, fragment manifest and fresh qualification
overlay. Fragment validation never asserts executable-runtime integrity.

The assembly manifest does not carry a fresh-qualified count that could become
stale after execution. `authoritative_delivery_qualification` and every map's
`native.delivery_evidence` point to the external current-engine overlay keyed by
exact Setup SHA-256. The original `native.eligibility` is explicitly limited to
assembly scheduling and known historical refusals; consumers must resolve the
overlay before deciding actual delivered availability. The architectural export
preserves the same lookup boundary.

`source-static-validation.v1.json` records successful independent stdlib replay
of all 72 unique Setup planes against the locked material digests. This is
source-static evidence. `query-crop-example.v1.json` records a bounded query and
byte-identical protected-feature crop retrieval with its source coordinate window.
Native gameplay qualification belongs to the separate assurance lane.

`collection/native-inputs-optional.v1.json` contains only the 28 extra immutable
Setup identities outside the required 44. It enables a separate, bounded
continuation after the required campaign starts without repeating its work.
The default `native-inputs.v1.json` is unchanged. A positive optional receipt may
enable its exact source in the current-engine overlay; an unavailable or failed
optional source stays visible as a reference. Optional execution never changes
frozen scientific verdicts, minimum-delivery requirements or owner acceptance.

## Policy corrections

The #155 variant is recovered exactly from archival source
`docs/corpus/goldmaps-finalisation-001/native/descendants/pr155-policy-repair/setup.json`:
SHA-256 `3d0f9c9efd293eed5a38b59c89fd0754a0a202a730bcd0fbe011237fb58772f0`.
Its original malformed 55-word all-zero policy remains refused.

The #183 generator explicitly wrote 48 zero policy words. Its source README
describes an initially dry/inert material world. The delivery candidate replaces
only `liquid_policy` with the exact frozen native-default envelope already present
in the recovered #155 variant; every other parsed field, actor, stamp and complete
material plane remains identical. The emitted derivation enumerates old/new words,
source evidence, default-law semantics and the original refusal.

An invalid envelope encodes no accepted policy. **Equivalence to the author's
policy intent cannot be proved.** This is therefore a separately labelled
native-default integration candidate, outside Gold25, with adoption pending even
if its own runtime qualification succeeds. Independent assurance must examine the
field diff and actual admission. The original stays unavailable.

The shipped `collection/POLICY-DESCENDANTS.md` and
`collection/policy-field-audit.v1.json` explain every replacement wire field,
all eleven material/family/variant assignments and the unchanged authored fields.
The audit independently confirms that the decoder, generated catalogue and
wire-contract document have identical bytes at both engine authorities. This
static explanation never substitutes for the descendants' own native receipts.

## Architectural consumer handoff

`corpus-export/knowledge.v1.json` retains all 70 source identities, metadata,
protected states, comparison families and negative interventions. Twenty-seven
semantic module hints remain explicitly inferred and lack invented native
geometry, attachment sockets or edit permissions. Evidence crop bounds are not
feature masks. The frozen 154/182 recovered and 28 hash-only failed-bundle
occurrences remain separate.

The complete frozen `failed-attempt-custody.v1.json` is also included unchanged
in the export, so every hash-only gap is individually identifiable offline.
It describes historical recovery and does not claim that all 154 recovered file
occurrences are bundled in the owner kit. Its missing geometry remains missing.

An independent product-lane review identified a future holdout gap in the first
export: Astra-derived sources were not connected to their original/reference
ancestry. The additive export now records all eight exact-source experiment
relationships and conservatively closes group membership across donors,
portraits, repairs and Astra variants. It preserves all previous group labels
and the unchanged frozen corpus, and propagates the same exclusions to module
hints. This is source-lineage evidence, not a new scientific preference.

Live read-only consumer inspection found that #720 now points to completed
M3–M5 successor #770. Its tested application source
`fe2395c7060dae736dc2e5dc8d1e4e050b2d2e52` exposes the existing caller-supplied
reference-card contract. The export includes that consumer's exact existing
25-card file unchanged. This is a compatibility artifact, not an evaluator
runtime dependency or permission to modify the consumer branch.

`consumer-adapter-replay.v1.json` records actual Godot 4.7 execution of the unchanged
consumer retrieval script against the shipped cards: schema admission and two
bounded reference queries passed; attempts to confer execution authority or map
module import were refused; requiring native geometry without current-session
modules returned no matches. This proves read-only adapter compatibility, not
native harvesting or learned retrieval quality.

Reproduce with the source-hash-verifying wrapper:

```sh
python tools/goldmaps_owner/corpus/check_consumer.py --package EXTRACTED_KIT --godot EXACT_GODOT_4_7 --out NEW_RECEIPT_JSON
```

The wrapper can accept `--adapter EXACT_LOCAL_ARCHITECTURAL_RETRIEVAL_GD` for a
fully offline repeat. The source and binary hashes remain mandatory. The
standalone export guide explains uint8 source-plane versus uint16 native-module
representations, family holdouts, native-region harvesting boundaries and reuse
limits. Unknown map-specific licensing and individual authorship remain unknown.

## Independent review obligations

Specialist C independently challenged the initial schema, #125 presentation and
portrait review provenance. The revised data preserves each latest Art/technical
review and superseded REWORK history, explicit final #125 support, and #207's
repair identity. Product lane compatibility fixes are separately owned. Final
archive custody and native/UI qualification remain with the independent assurance
lane and root integration review; this implementation report does not certify
its own owner acceptance.
