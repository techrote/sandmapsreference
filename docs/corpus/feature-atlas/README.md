# FEATURE-ATLAS-001 — material-cell feature evidence

**Draft/HOLD sidecar; no geometry writes, no Gold finalisation, no Astra execution.**
Authority: [Feature Atlas #200](https://github.com/techrote/sandmapsreference/issues/200), [exclusive portrait repairs #199](https://github.com/techrote/sandmapsreference/issues/199), [corpus preparation #181](https://github.com/techrote/sandmapsreference/issues/181). Source lineage semantics are borrowed from [CORPUS-INDEX #99](https://github.com/techrote/sandmapsreference/issues/99) but that programme's Draft PR #102 is untouched.

## Read the evidence

- `states.v1.jsonl`: one feature *state* per line; seven independently reviewed REWORK baselines and five independently PASS control portraits. The feature ID is stable; state ID is `feature_id@exact40characterPortraitHEAD`. Revisions append, **never replace** the baseline.
- `manifest.v1.json`: exact paired portrait and donor revisions, setup hashes, counts and scope. Does not infer newer donor revisions.
- `schema.v1.json`: versioned JSON-Schema shape, plus `validate.mjs` for offline identity, exact-HEAD, uniqueness, bounds, provenance, lineage and manifest consistency. `baseline.lock.v1.json` additionally pins the original 38 JSONL lines by their Git blob SHA-1, preventing silent edits/deletions when subsequent repair states are appended.
- `astra-handoff.v1.json`: advisory DO-PRESERVE / DO-REPAIR / DO-NOT-FILL / DO-NOT-ASSERT feature-state references with no unreviewed map changes.

Run `node docs/corpus/feature-atlas/validate.mjs` from any directory with Node 18+; requires no packages. Validator checks **metadata integrity**, not source raster parity, Midge physics or independent reviewer authenticity. Reviewer comments and source Setup are the authority. No source-map material is copied into this branch.

## Coordinates and evidence

Each record cites a full 40-SHA portrait HEAD and donor HEAD, exact map folder, `setup.json` SHA-256 from committed `receipt.json`, committed PNG overview and an actual **1:1 material crop** whose exact `xywh` is recovered from that committed receipt. The validated `evidence_window_xyxy` is `[x,y,x+w,y+h]` with exclusive right/bottom. This is *not falsely labelled a feature's tight bounding box*: `feature_bbox_xyxy=null` and `precision=EVIDENCE_WINDOW_ONLY` until an independent reviewer confirms more precise edges. Coordinates describe the exact PR HEAD, never the wide donor coordinate system.

`analysis.intended_function_author_claim` describes the author's claim; `observed_source_static` describes what the independent transfer reviewer actually found. GOOD may coexist with an overall REWORK map; it is a *feature judgment*, **not** an independent Art/Technical PASS for the map. PENDING marks a materially unproved claim, not a defect by itself. INTENTIONAL marks negative space worth protecting; no arbitrary prop-density threshold is imposed.

## Repair-state protocol

1. Before changing a portrait, retain its immutable `BASELINE` feature states and exact-HEAD reviewer URLs. Portrait artists own their own stacked child branches. This atlas manager edits **only** this sidecar.
2. For any changed child HEAD, fetch the live child PR and parent donor, inspect exact committed Setup + crop pixel evidence and separate independent reviewer comments. Append a new `POST_REPAIR` state using **the same feature_id**, new `state_id`, `provenance.material_pr` (stacked repair PR), `provenance.parent_portrait_head` (original parent revision), `lineage.previous_state_id` and `lineage.before_state_id`. Never rewrite earlier lines, reassign old review URLs or infer a new independent PASS.
3. Record child-branch provenance in lineage.notes and update the manifest and advisory export; re-run the validator. If a claim has no exact feature bbox, leave it null. Conflicting or incomplete evidence is `PENDING`/`DISPUTED`.
4. Request independent Art and Technical evidence rather than self-approving. State changes do not establish native Workbench/Godot/Rapier collision, dynamics or cold save/reopen. Owner alone decides acceptance.

## Meaning of the treatment export

`DO-REPAIR` means bounded, reviewer-backed *functional/relational* changes, never blanket embellishment. `DO-PRESERVE` means preserve the recorded structural relationship. `DO-NOT-FILL` means keep deliberately traversable, editable or staged negative space. `DO-NOT-ASSERT` flags an unproven narrative or forced-route claim which should be tested with exact waypoints or described more narrowly. Every export entry points back to the immutable feature state and reviewer.

## Boundaries

All original wide/portrait PRs and accepted main are read-only. No map Setup, geometry, PNG, builder, exemplar.json, existing corpus index PR, accepted CyberSand source, labels, merges, Ready promotion or paid CI are modified. All source-static evidence remains **NATIVE-UNTESTED** unless separately qualified with exact binary/map/source hashes and real actor/collision/save-reopen.
