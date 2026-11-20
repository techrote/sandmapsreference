# CORPUS-INDEX-001 — CyberSand exemplar corpus

Issue: https://github.com/techrote/sandmapsreference/issues/99

## Purpose

The original/world-group mapping fleet is producing a long-term design corpus for three downstream uses:

1. manual human refinement,
2. SWARM/GENTEK/example-derived procedural rule mining,
3. scripted-event set-piece source geometry.

This layer is descriptive. It does **not** change Setup-v2, CyberSand engine formats, map acceptance, material physics or native qualification.

## Canonical exemplar metadata

New maps should place `exemplar.json` in the map's owned folder and follow
[`exemplar-schema-v1.json`](exemplar-schema-v1.json).

Stable required fields describe the map's role, structural thesis, routes, motifs,
relationships, human-edit affordances, candidate set pieces and what nearby
corpus pattern it deliberately avoids.

`diversity_axes` is an optional controlled classification. New authors should
classify at least three axes when the committed geometry supports the claim.
The validator warns rather than rejecting metadata when fewer are classified,
because the axes are for corpus coverage, not map validity.

Example:

```json
{
  "schema_version": 1,
  "purpose": ["human_editable_canvas", "procedural_exemplar", "scripted_setpiece_source"],
  "family": "Example Family",
  "map_role": "suspended salvage transfer",
  "anchor_donors": ["wide-example"],
  "macro_topology": ["asymmetric basin", "suspended transfer crown"],
  "density_profile": "dense shoulders around open central traversal",
  "route_grammar": ["high bypass", "main traverse", "lower recovery"],
  "strong_motifs": ["twin rooted piers", "offset crane crown"],
  "interesting_relationships": ["service route passes beneath cargo transfer"],
  "authoring_affordances": ["open east annex seam", "vacant lower service bay"],
  "setpiece_candidates": ["crane activation", "bridge failure", "arrival stage"],
  "procedural_exemplar_value": ["asymmetric support relationship", "three-height rejoin"],
  "similarity_avoidance": ["not another central-wheel or linear-quay composition"],
  "diversity_axes": {
    "macro_topology": ["basin"],
    "route_structure": ["branch_rejoin"],
    "support_form": ["twin_pier"],
    "incompleteness": ["editable_gaps"]
  }
}
```

Extra fields are allowed. The stable top-level vocabulary exists so future
consumers do not need a custom parser for every creator.

## Legacy and missing metadata

Older maps do **not** need metadata retrofits to remain valid.

The first experimental world-group exemplars used a different vocabulary such
as `schema`, `world_family`, `worksite`, `topology`, `routing` and
`event_sites`. The indexer maps only direct semantic aliases and reports the
record as `legacy-partial`. It never invents missing `density_profile`,
relationships, authoring affordances or procedural-value claims.

A map without `exemplar.json` is indexed as `missing`. That status is corpus
coverage information, **not** a technical/art/native failure.

## Tool

The implementation is stdlib-only:

```bash
python tools/test_corpus_index.py
python tools/corpus_index.py validate path/to/exemplar.json
python tools/corpus_index.py validate --allow-legacy path/to/old-exemplar.json
python tools/corpus_index.py index-github --repo techrote/sandmapsreference --output-dir build/corpus-index
```

The live indexer inspects open PRs and includes 2048x1024 map folders whose names
begin `original-` or `worldgroup-`. Each record carries PR number/URL,
exact HEAD SHA/branch, map directory and metadata SHA-256.

Generated outputs:

- `corpus-index.json` — exact snapshot records, validation state, explicit diversity counts and nearest neighbours.
- `diversity-report.md` — human-readable coverage/gap report.

## Diversity matrix

The controlled v1 axes are:

- macro topology,
- altitude grammar,
- density cadence,
- route structure,
- landmark family,
- support form,
- environment relationship,
- incompleteness / authoring-affordance state.

Unclassified values remain explicitly unclassified. The tool does not infer a
classification from geometry or prose because doing so would turn guesses into
machine-readable facts.

## Similarity

Nearest-neighbour scores use a lexical Jaccard heuristic over declared structural
metadata. This is intentionally cheap and reproducible.

It is **not**:

- image similarity,
- geometry similarity,
- proof of copied design,
- an automatic rejection/quality gate.

A high score is a prompt for human inspection. A low score does not prove
structural novelty.

## Intended review use

Corpus guidance is secondary to hard map validity:

- `EXEMPLAR-KEEP`: memorable, non-redundant idea worth retaining, including deliberate editable gaps.
- `EXEMPLAR-REWORK`: strong idea obscured by a bounded defect.
- `EXEMPLAR-REDUNDANT`: technically valid but adds little beyond stronger corpus examples; steer future work elsewhere rather than polishing indefinitely.

No corpus classification merges, closes, deletes or changes the review state of
a map PR.

## Next programme gate

After this index has accumulated enough explicit classifications, select a
carefully reviewed Gold Corpus of roughly 20–30 structurally informative
exemplars. That curated subset should be the first input to later SWARM/GENTEK
example-derived rule extraction.
