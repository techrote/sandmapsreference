# Source-pinned corpus and Batch Lab usage

This engineering handoff is read-only. Owner launch and play use `Open GOLDMAPS.cmd`; these examples grant no World editing permission, reusable-module approval, training authority or owner classification.

## Source and current consumer

The tool examples are pinned to delivery candidate `2d984a981da99348bbf9b44612b058cd048f3474`. Packaged `corpus-export/tools/query.py` matches repository `tools/goldmaps_owner/corpus/query.py`, SHA-256 `9ab8818d2951f82d9b9bd2ad6d08d31bd29fcc82cc9ae4058397427e9befd11e`. The final downloaded package must independently retain that identity and pass its exact inventories.

A read-only refresh at 21:51 UTC on 24 November 2026 found no consumer drift: [#720](https://github.com/techrote/cybersand/pull/720) remains open Draft at `76fcf209e0cda5820aa64e104bfae732075ae7c3`; [#770](https://github.com/techrote/cybersand/pull/770) remains open Draft/unmerged at archival `f5f6e9f35727d81868bcced4da8b913b470ea635`. Its tested adapter stays `fe2395c7060dae736dc2e5dc8d1e4e050b2d2e52`. [#579](https://github.com/techrote/cybersand/issues/579) remains the unchanged open roadmap. See [the exact refresh record](consumer-live-refresh.v1.json). Neither consumer branch supplies the evaluator runtime.

## Offline query, replay and crop

From the extracted evaluator root, with a Python 3 interpreter:

```sh
python corpus-export/tools/query.py --package . validate
python corpus-export/tools/query.py --package . search "fault" --limit 3
python corpus-export/tools/query.py --package . get gold-125
python corpus-export/tools/query.py --package . replay gold-125
python corpus-export/tools/query.py --package . feature P185-CROSSBANK-ASSAY
python corpus-export/tools/query.py --package . crop P185-CROSSBANK-ASSAY --out my-crops/crossbank-assay.png
```

The tools use the standard library and open no native World. Validation covers exact fragment files, inventory, roster and source/owner boundaries; the broader evaluator manifest covers executable/runtime custody. Preserve strict extra-file refusal. The source-only correction for the two later contact sidecars is recorded in [fragment-extension-source-review.v1.json](fragment-extension-source-review.v1.json); its actual hosted validation remains a separate gate.

`replay gold-125` preserves the 2048 × 1024 layout. Expected Setup SHA-256 is `e87c376aa71e6f232d887646d2a5b8172a65f6566f63c72b16c4f95c1661191e`; expected row-major uint8 material-plane SHA-256 is `de56ecc67744576902ff681768932747cf291608b89adc5078730fc2bfc3f9a3`. This is source-static replay, distinct from actual native readback.

The crop copies exact archived #202 bytes, SHA-256 `cb9fad4fe4171f5bebc7940f11f7d9b3c1b8676d915da9b380248a149c26a569`, and writes its provenance receipt. The source window is `[240, 739, 563, 446]`: x right, y down, width/height, exclusive far edges. The verified feature boundary stays null. The crop is no edit mask or permission to fill protected negative space. Existing output files are protected from overwrite.

## Resolve actual native availability

Search returns attributed source/assembly metadata. Its `native` field is not the latest delivered execution status. After verifying the package inventory, resolve the map's exact digest-keyed evidence:

```python
import json
from pathlib import Path

root = Path(".")
collection = json.loads((root / "collection/collection.v1.json").read_text(encoding="utf-8"))
entry = next(row for row in collection["maps"] if row["id"] == "gold-125")
reference = entry["native"]["delivery_evidence"]
assert reference["path"] == "collection/delivery-qualification.v1.json"
overlay = json.loads((root / reference["path"]).read_text(encoding="utf-8"))
assert overlay["schema"] == reference["schema"]
assert overlay["engine_head"] == reference["engine_head"]
status = overlay["setups"].get(entry["setup"]["sha256"])
eligible = status is not None and status["status"] == "QUALIFIED_HEADLESS"
print(entry["id"], eligible, status)
```

Missing or mismatched evidence leaves a source unavailable. Retain receipt hashes, executed source/run and `native_history`. Later product source does not imply a new native execution. Frozen artistic results, rendered evidence and explicit local owner choices remain separate. Original #155/#183 remain refused; the two policy descendants have their own identities.

## Existing Batch Lab API

The unchanged compatibility file `corpus-export/batch-lab/architectural_design_cards.v1.json` has schema `cybersand.architectural-design-cards.v1` and SHA-256 `9153480ea622d5dc6a78543269840af64b3adbef43074af8cf78cfe685d0b057`. The tested consumer's `godot/scripts/batch_lab/architectural_retrieval.gd` has SHA-256 `a9c130afc9cdf3b53f45bab00c950eb573168021074ed004c926e55e83f8c1f2`. Use its existing caller-supplied corpus parameter:

```gdscript
const ArchitecturalRetrieval = preload("res://scripts/batch_lab/architectural_retrieval.gd")

func read_goldmaps_reference(cards_path: String) -> Dictionary:
    var raw := FileAccess.get_file_as_string(cards_path)
    if raw.sha256_text() != "9153480ea622d5dc6a78543269840af64b3adbef43074af8cf78cfe685d0b057":
        return {"ok": false, "errors": ["Reference-card identity differs."]}
    var cards: Variant = JSON.parse_string(raw)
    if not cards is Dictionary:
        return {"ok": false, "errors": ["Reference cards are not an object."]}
    var admitted: Dictionary = ArchitecturalRetrieval.validate_corpus(cards)
    if not admitted.ok:
        return admitted
    return ArchitecturalRetrieval.retrieve({
        "text": "suspended roof supports and a clear lower service route",
        "required_parts": ["beam_truss", "service_gallery"],
        "excluded_families": ["bioindustrial", "civic", "vessel_dock"],
        "limit": 3
    }, [], cards)
```

The empty module catalogue supplies no current-session native geometry. With `require_native_geometry: true`, it produces no native module matches. Retrieval scores reflect the existing deterministic facet/text matcher; they establish no artistic quality or retrieval causality. Preserve the consumer's hash-pinned default and sealed evaluation exclusions.

[consumer-adapter-replay.v1.json](consumer-adapter-replay.v1.json), SHA-256 `9283011c090a0691cf062c07b2169253c336db6a47783b9142e9387648f51df4`, retains the earlier actual exact-Godot-4.7 card validation, two bounded queries and three authority-refusal checks. From the delivery repository, repeat using a new receipt path:

```sh
python tools/goldmaps_owner/corpus/check_consumer.py --package EXTRACTED_KIT --godot EXACT_GODOT_4_7_EXECUTABLE --adapter EXACT_ARCHITECTURAL_RETRIEVAL_GD --out NEW_RECEIPT.json
```

Supplying the exact adapter makes the repeat fully offline; omitting it retrieves only the pinned immutable script and verifies its hash. The wrapper creates an isolated temporary reference project. It neither changes the consumer branch nor harvests geometry, opens a native map World or calls a model.

## Expanded knowledge boundary

`corpus-export/knowledge.v1.json` uses the separate `goldmaps.architectural-knowledge.v1` schema: 70 sources, 27 protected features, 76 immutable states, 12 comparative families and five negative interventions. Its 27 module hints remain inferred, without included native module geometry, invented connectors, verified feature bounds or owner adoption. The 25-card API does not directly admit this expanded schema.

Preserve all `visual_family_groups` and exclude a source when any label intersects a held-out set. D1 connects donor #177, original #186, repair #203 and Astra #214; D2 connects donor #124, original #196, repair #208 and Astra #211. Eight experiment relationships retain original/candidate/reference roles and unchanged controls without rewriting the frozen science.

Later authorized module harvesting must freshly inspect a chosen native region and validate materials, placement, clearance and owner choice. Widening uint8 source planes to Batch's uint16 little-endian representation must preserve every value and retain both separately named digests. Images are not native programs; map acceptance does not automatically approve every possible part. Preserve the 154 recovered versus 28 hash-only failed-bundle occurrences and explicit unknown license/attribution limits.
