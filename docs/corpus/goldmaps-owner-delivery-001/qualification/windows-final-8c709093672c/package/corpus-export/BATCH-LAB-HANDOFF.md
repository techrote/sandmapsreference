# GOLDMAPS architectural knowledge handoff v1

This is a read-only source corpus and reference-knowledge export. It grants no
World editing authority, module adoption, training label or owner classification.
All 70 source maps, 27 current protected features, 76 immutable feature states,
12 comparative families and five retained negative interventions preserve their
frozen identities. The two policy-only integration variants are separate from
that 70-map population and do not replace original negative evidence.

## Files and authority

| File | Purpose |
| --- | --- |
| `corpus-export/knowledge.v1.json` | Normalized source identities, exact Setup paths, material digests, authored spatial metadata, feature states, negatives and explicit limits. |
| `corpus-export/frozen/corpus.v1.json` and lock | Unchanged archival corpus with its original integrity lock. |
| `corpus-export/frozen/failed-attempt-custody.v1.json` | Unchanged per-file recovery states for all 182 failed-attempt occurrences, identifying the 28 hash-only gaps. |
| `collection/setups/<sha256>.json` | Exact native Setup bytes deduplicated by byte identity. A bundled file alone is not native qualification. |
| `corpus-export/crops/<sha256>.png` | Exact archived evidence crops with source and coordinate metadata. |
| `corpus-export/batch-lab/architectural_design_cards.v1.json` | Unchanged 25-card consumer-compatible file from the M3–M5 successor; exact hash below. |
| `collection/native-inputs.v1.json` | New delivery qualification targets. |
| `collection/delivery-qualification.v1.json` | Separate fresh execution overlay when present. It must match the delivery engine and Setup hashes. |
| `collection/collection-files.v1.json` | Strict file manifest for this fragment. The final evaluator manifest also covers its runtime, browser and qualification. |

Frozen Goldmaps archival authority:
`b9535405853a5cd16e4bba968ec7167222861c42`; scientific/native evidence authority:
`40f196f792e4d9e19bbd57fdafd6a90420fadf32`.

The immutable assembly manifest deliberately supplies no fresh playable count.
Each map's `native.eligibility` describes assembly scheduling and known historical
refusal, with that limited scope stated beside it. Resolve actual delivered
availability through `native.delivery_evidence`: load the referenced
`collection/delivery-qualification.v1.json`, require its exact engine identity,
and look up `setups[setup.sha256]`. The top-level
`authoritative_delivery_qualification` records the same contract. Missing or
mismatched evidence means unavailable; `QUALIFIED_HEADLESS` still conveys no
graphical or owner acceptance. Frozen scientific fields are never patched to
represent this new delivery execution.

The current read-only consumer contract was inspected at CyberSand
`fe2395c7060dae736dc2e5dc8d1e4e050b2d2e52`, successor
[PR #770](https://github.com/techrote/cybersand/pull/770) of
[PR #720](https://github.com/techrote/cybersand/pull/720). This does not make that
unmerged branch the playable evaluator engine. Its compatibility cards have
SHA-256 `9153480ea622d5dc6a78543269840af64b3adbef43074af8cf78cfe685d0b057`.

## Coordinate and representation contract

Material coordinates start at the top left, with x increasing rightward and y
downward. Extents are `[width,height]`; crop windows are `[x,y,width,height]`, with
exclusive far edges. A crop is an inspection window. It is not an edit mask or
a measured feature boundary. Unknown `feature_bbox_xyxy` remains null.

The source-static full-plane identity uses one row-major unsigned byte per
material cell, including Empty=0. The Batch Lab native-module contract stores
little-endian unsigned 16-bit material IDs. Conversion must widen the IDs without
changing dimensions, cell order or values. It must retain the original byte-plane
digest and record the separate uint16 digest; it cannot relabel one as the other.
Source plane replay is not native observation.

`source_authored_metadata` retains structural intent, geometry observations,
route grammar, districts, deliberate negative space and attachment/editing
affordances when the source supplied them. These are attributed annotations.
Words such as crane, pipe or pressure gate do not establish working machinery,
structural strength, a native connector or a traversable actor route.

## Use with the existing retrieval contract

The copied 25-card file already conforms to
`cybersand.architectural-design-cards.v1` and retains its reference-only authority.
Use the existing caller-supplied corpus parameter; do not replace the consumer's
hash-pinned default corpus behind its back:

```gdscript
var cards: Dictionary = JSON.parse_string(FileAccess.get_file_as_string(cards_path))
var checked: Dictionary = ArchitecturalRetrieval.validate_corpus(cards)
if checked.ok:
    var pack: Dictionary = ArchitecturalRetrieval.retrieve({
        "text": "suspended roof supports and a clear lower service route",
        "required_parts": ["beam_truss", "service_gallery"],
        "excluded_families": ["bioindustrial", "civic", "vessel_dock"],
        "limit": 3
    }, [], cards)
```

The shipped `corpus-export/tools/query.py` offers offline
queries, exact crop retrieval, whole-plane replay and manifest validation. An
example, from the extracted kit root:

```sh
python corpus-export/tools/query.py --package PATH_TO_EXTRACTED_KIT validate
python corpus-export/tools/query.py --package PATH_TO_EXTRACTED_KIT search "fault" --limit 5
python corpus-export/tools/query.py --package PATH_TO_EXTRACTED_KIT replay gold-125
python corpus-export/tools/query.py --package PATH_TO_EXTRACTED_KIT feature P185-CROSSBANK-ASSAY
python corpus-export/tools/query.py --package PATH_TO_EXTRACTED_KIT crop P185-CROSSBANK-ASSAY --out new-crop.png
```

The expanded 70-map knowledge export is deliberately a different schema. A
future adapter must choose which attributed fields become retrieval facets,
preserve authority, limit context and maintain visual-family exclusions. It must
not silently introduce the expanded source population into a sealed experiment.
The existing consumer excludes `bioindustrial`, `civic` and `vessel_dock` in its
registered family-transfer evaluation. Preserve both those exclusions and the
corpus's donor/portrait/repair ancestry groups. The export also records all eight
source-pinned Astra original/candidate/reference relationships. Its
`visual_family_groups` use conservative connected ancestry closure: a candidate
such as #214 shares the #177 donor/#186 portrait/#203 repair holdout ancestry,
and #211 shares the #124 donor/#196 portrait/#208 repair ancestry. Existing
group names remain present. A source must be excluded when **any** of its group
labels intersects the held-out group set. Module hints inherit the same groups.
These additive relationship annotations do not alter the frozen corpus file,
its artistic verdicts or the existing consumer's 25-card compatibility file.

## Native module harvesting boundary

The 27 semantic module hints identify promising features and preserve warnings,
but provide no directly importable module geometry or invented sockets. A later
authorized workflow can open a qualified Setup in ordinary Workbench, inspect a
specific native region, and use the consumer's existing native-region harvest
path. That path must freshly observe material IDs and validate any attachment,
clearance, role and transform declarations. Imported historical qualification
flags cannot confer current-session native observation.

Whole-map images and evidence crops must never be supplied to native module
import as if they were programs. Owner approval of a map also does not silently
approve every potential reusable part. Transformations beyond inspection require
their own permissions; portrait recompositions are distinct authored maps, not
rotations or rescalings of their donors.

## Negative evidence and reuse limits

Original #155 and #183 refusals remain explicit. Policy-only candidates retain
parents, field changes and runtime scope. Failed interventions retain their
reasons and file identities: 154 of 182 failed-bundle occurrences are recovered;
28 are hash-only. Missing bytes are not reconstructed success.

The exact failed-attempt custody record is bundled offline. Its per-file
`status` distinguishes recovered shared bytes, exact frozen-byte reconstruction
and unrecovered hash-only records. Three failed Setup byte sequences had been
recovered; the unique failed geometry of B1 attempt 1 and B3 attempt 1 remained
unavailable. These are historical recovery locations, not a claim that all 154
recovered occurrences are payload files in this owner kit. The five negative
intervention records retain their failure reasons and remain explicitly
`accepted_positive_example=false`.

No map-specific license or individual human authorship is inferred from a shared
publishing account. Exact repository/PR/commit attribution is included. This
owner-authorized reference delivery is not a blanket redistribution or training
license. Keep the relevant source and engine notices with any separately
authorized reuse.
