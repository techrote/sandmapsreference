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

## Build and validate

From this delivery repository checkout:

```sh
python tools/goldmaps_owner/corpus/build_collection.py --out NEW_FRAGMENT_DIRECTORY --cache VERIFIED_SOURCE_CACHE --engine-head EXACT_DELIVERY_ENGINE_COMMIT
python tools/goldmaps_owner/corpus/query.py --package NEW_FRAGMENT_DIRECTORY validate
```

The builder verifies the frozen corpus lock, retrieves immutable SHA-pinned
source bytes, checks both SHA-256 and recorded Git blob identities, and independently
replays every full material plane. It rejects a populated output directory.
Exact Setup payloads are deduplicated by SHA-256. Source overviews remain full
resolution; cropped evidence is copied unchanged. The build tool is not launched
by the owner-facing browser. After extraction all reference use is offline.

`collection/collection-files.v1.json` records the precise fragment file inventory,
hashes, sizes and origins. It excludes its own bytes. The final kit's broader
manifest must cover the runtime, browser, fragment manifest and fresh qualification
overlay. Fragment validation never asserts executable-runtime integrity.

`source-static-validation.v1.json` records successful independent stdlib replay
of all 72 unique Setup planes against the locked material digests. This is
source-static evidence. `query-crop-example.v1.json` records a bounded query and
byte-identical protected-feature crop retrieval with its source coordinate window.
Native gameplay qualification belongs to the separate assurance lane.

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

## Architectural consumer handoff

`corpus-export/knowledge.v1.json` retains all 70 source identities, metadata,
protected states, comparison families and negative interventions. Twenty-seven
semantic module hints remain explicitly inferred and lack invented native
geometry, attachment sockets or edit permissions. Evidence crop bounds are not
feature masks. The frozen 154/182 recovered and 28 hash-only failed-bundle
occurrences remain separate.

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
