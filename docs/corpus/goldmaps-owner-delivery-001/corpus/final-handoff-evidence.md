# Frozen policy scope and Batch Lab handoff evidence

This note resolves two source-authority questions for the owner decision packet.
The adjacent `final-handoff-evidence.v1.json` carries full digests, source pins,
executed compatibility results and explicit limits. Neither this note nor its
JSON changes the assembled evaluator, frozen corpus or downstream branches.

## Original #183: an actual frozen native policy refusal

The authoritative receipt is
[`policy-schema-all67/summary.json`](../../goldmaps-finalisation-001/native/receipts/policy-schema-all67/summary.json),
present byte-identically at scientific evidence head
`40f196f792e4d9e19bbd57fdafd6a90420fadf32` and archival head
`b9535405853a5cd16e4bba968ec7167222861c42`.
Its SHA-256 is
`f322d2a347a1aff3638b0120542d99a1f6818d9452ce3b5411a000fec2944750`.

| Authority | Observed scope |
| --- | --- |
| Source #183 | `c1bd6fcf2cb4c002aa7906a13543a0a5e4af8f2b`; exact Setup SHA-256 `2b402fed48fd3ce0370de527a2038e91f090297d008dd7133fc730c83897dde0`; 48 policy words; original bytes unchanged. |
| Frozen native engine | `662df51cd8409a52332fa7ef15d06d8ab8945aed`, exact Godot 4.7 Linux, native bridge and Rapier hashes recorded in the receipt. |
| Executed checkout | `06ee711f103502abcac2bdb83c1bebc691b7f2b5`, as recorded by the historical process. |
| Schema result | Ordinary Workbench `Setup.validate` accepted the source schema and actor configuration. |
| Native result | Actual `CyberDemoBridge.validate_liquid_policy` refused `malformed_policy` / `bad magic`. |
| Process evidence | Exit code 0; no timeout; 1.569 seconds; raw log SHA-256 `ab044ffc808a22ef1058c8291db3b446963665bc858ad42e72c1e153d3e441ad`. The successful scanner exit means validation completed; it does not mean every source was admitted. |
| Excluded claims | No World creation, full map admission, movement, Save start, reopen, rendered output or owner acceptance in this receipt. No hosted Actions run ID is recorded for this process. |

The archived runner and probe match the hashes recorded by that process at both
frozen heads. The probe calls native policy validation and Workbench schema
validation directly; it does not construct a map World. The preceding
`policy-all67` receipt also reports the same #183 refusal, at recorded checkout
`dd74b18cea745650f7ad6b507b7ce6c7f12a6913`.

Historical Windows campaign `45217389899` covered original #155, not #183.
The new delivery's current-engine original refusals and positive descendants
belong to its separate per-variant execution matrix. The newly generated #183
native-default policy descendant has no fresh frozen-engine execution claim and
remains outside Gold25. Supported default semantics do not prove equivalence to
the original invalid all-zero representation.

## Current Batch Lab consumer boundary

Read-only live inspection confirmed that
[foundation PR #720](https://github.com/techrote/cybersand/pull/720) still has head
`76fcf209e0cda5820aa64e104bfae732075ae7c3` and points to
[successor PR #770](https://github.com/techrote/cybersand/pull/770).
Both remain open Draft/HOLD and unmerged. The successor's tested application is
`fe2395c7060dae736dc2e5dc8d1e4e050b2d2e52`; its archival documentation head is
`f5f6e9f35727d81868bcced4da8b913b470ea635`. Its reported campaign
`45454711939` belongs to the downstream programme and is not a new GOLDMAPS run.

The owner kit includes the consumer's existing 25-card file unchanged:
`corpus-export/batch-lab/architectural_design_cards.v1.json`, SHA-256
`9153480ea622d5dc6a78543269840af64b3adbef43074af8cf78cfe685d0b057`.
The unchanged source adapter is
`godot/scripts/batch_lab/architectural_retrieval.gd`, SHA-256
`a9c130afc9cdf3b53f45bab00c950eb573168021074ed004c926e55e83f8c1f2`.

The supported entry points are `ArchitecturalRetrieval.validate_corpus(cards)`
and `ArchitecturalRetrieval.retrieve(query, [], cards)`. Caller-supplied cards
must retain schema `cybersand.architectural-design-cards.v1`, at most 200 cards,
the bounded serialized size, `reference_knowledge_only`,
`execution_authority=false` and `direct_module_import=NOT_ADMITTED_BY_RETRIEVAL`.
The consumer's hash-pinned default is not replaced. Neither downstream branch is
an evaluator runtime dependency.

[`consumer-adapter-replay.v1.json`](consumer-adapter-replay.v1.json) records
actual exact-Godot-4.7 execution of this unchanged adapter and unchanged cards
in an isolated temporary project. Schema admission and both bounded queries
passed:

| Query | Returned cards |
| --- | --- |
| Suspended roof supports and a clear lower service route; beam/truss and service-gallery facets | #176, #106, #146 |
| Opposed banks and a protected open fault; opposed-bank topology | #182, #197, #109 |

Both queries retained the consumer's sealed-family exclusions. Three negative
guards passed: granting execution authority was refused; authorizing map-as-module
import was refused; requesting native geometry with no current-session modules
returned no authority or matches. This demonstrates actual read-only import and
retrieval compatibility. It establishes no native harvesting, model quality,
training permission or owner-approved reusable geometry.

## Expanded corpus and future import

`corpus-export/knowledge.v1.json` intentionally uses a separate, richer schema:
70 exact source maps, 27 protected features, 76 immutable states, 12 comparative
families, five negative interventions and 27 inferred semantic module hints.
The hints contain no fabricated native module geometry or verified sockets.
All eight frozen Astra relationships preserve conservative donor/portrait/repair
ancestry, so derived candidates cannot silently escape a family holdout. The
unchanged 25-card compatibility file retains its registered population.

The export preserves the original uint8 row-major material-plane identity;
a future native-module conversion must explicitly widen values to the consumer's
little-endian uint16 representation and record a separate digest. Images and
evidence crops remain references. Native harvesting must use the consumer's
supported current-session observation path and its normal admission rules.

All 182 failed-bundle file occurrences are individually identified in the
bundled frozen custody record: 154 recovered, 28 hash-only. The export does not
claim to bundle all historical recovered payloads or manufacture the missing
failed geometry. All owner decisions remain pending. Source-linked license and
individual authorship unknowns remain explicit.

See the shipped `corpus-export/BATCH-LAB-HANDOFF.md` and `corpus-export/tools/query.py`
for query, crop, exact-plane replay and manifest-validation examples. The
source wrapper `tools/goldmaps_owner/corpus/check_consumer.py` can repeat the
adapter check fully offline using its `--adapter` option and the exact pinned
Godot binary. No changes to PR #720, PR #770 or the consumer's live defaults are
required.
