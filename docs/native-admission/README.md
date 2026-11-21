# CANVAS-NATIVE-CI-001 — Windows native admission

**Draft/HOLD.** This infrastructure qualifies immutable Setup-v2 data against a
verified accepted CyberSand runtime. It does not modify maps, engine source,
corpus metadata, map PR state, or schedules. Programme: issue #194, related to
CORPUS-PREP-001 and CORPUS-INDEX-001.

## Execution and trust boundaries

The Windows workflow uses one standard `windows-2022` job, two isolated workers,
at most six fixtures, a 35-minute job timeout, five-minute native phases, 3 GiB
per process tree, bounded logs and bounded GitHub requests. The initial pilot
resolves current Long Pour, Ternbreak, Thunderclap and Graftloom Setup identities
dynamically; no creator scripts or map-branch workflows are checked out or run.

The qualification job has only `contents: read` and `actions: read`. Checkout
does not retain credentials. Native child processes receive an explicit OS
environment allowlist, excluding tokens. The Windows process is created
suspended, attached to a bounded kill-on-close job, and then resumed. Separate
worker projects, import caches and user directories prevent cross-map state.

Runtime discovery requires a successful exact-main CyberSand GDExtension run and
its exact Windows artifact attempt. Git HEAD, tree, complete native source-input
inventory and binary hashes are verified. An older DLL retained in the accepted
checkout is never substituted. Public nightly.link may transport an artifact
when cross-repository download permission is unavailable; the official GitHub
artifact digest remains mandatory. Godot 4.7 and the selected Rapier LFS binary
have independently pinned hashes. Unknown runtime identities fail closed.

A separate Ubuntu publisher validates the completed Windows job, run attempt,
workflow source, uploaded artifact digest, every ZIP member, native receipts,
authoritative runtime artifact bytes, immutable Setup path/blob identity, and
individual PR freshness. It executes no artifact content. Its only writable ref
is `evidence/native-admission`; all paths are beneath `native-admission/v1`.
Publication is one atomic non-forced Git ref advance, with bounded conflict
retries. Duplicate publication preserves the first immutable observation.

## Contract

`PASS_BASIC_NATIVE` requires actual native bridge installation, all 2,097,152
material cells, a Midge in a valid Rapier space, native ticks, W input over at
least 20 physical ticks and observed upward movement, a saved starting Setup,
and full-grid/actor verification from a separate Godot process opening the
exact saved bytes. Both wrapper and Godot process identities are recorded.
Unexpected Godot errors, nonnumeric/nonzero exits and incomplete receipts fail.

Collision, hazards, GUI, performance, Art and Shepherd acceptance remain separate
and untested. Native success with unavailable final HEAD verification is
`NATIVE_PASS_PENDING_HEAD`. Only an actually different observed commit establishes
`STALE_CONFIRMED`. Closed PRs are `CLOSED`; they are not inferred changed HEADs.

## Local deterministic validation

```bash
python3 -m unittest discover -s tests/native_admission -p 'test_*.py' -v
```

The real Windows process-containment regression is explicitly skipped on Linux
and executed on Windows before native qualification.

## Evidence consumer

The independent consumer workflow starts from a clean checkout and reads one
immutable evidence commit. No local owner files or qualification-job state are
available to it. It validates index, record and run hashes and exact identities.

```bash
python3 -m tools.native_admission.consumer \
  --prs 25,26,17,22 \
  --native-dll-sha256 7231276de9362327816b67fb457e1eb5e836402f34c22684fd41250b315f0a6a \
  --origin github-hosted-windows --prove-superseded --output consumer.json
```

The DLL above identifies this pilot only. Later accepted engine revisions must
resolve a new exact-source runtime; never carry the hash forward by assumption.
`--commit` can pin a particular immutable evidence snapshot. Omit `--origin` to
inspect all origins through the generic consumer; require hosted Windows for a
hosted qualification claim. Exit 0 means all requested current keys were verified;
exit 3 means not accepted; exit 2 means unavailable or invalid evidence.

For future corpus automation prompts: resolve the current PR HEAD, exact Setup
path/SHA-256 and accepted engine/native DLL pair; query the immutable evidence
snapshot; require `current: true` and an explicitly allowed execution origin.
Treat missing, pending, superseded, mismatched, conflicting or unavailable results
as unqualified. Never infer Art/Shepherd or GUI acceptance. Retain record IDs,
evidence commit, artifact URL and archive digest in any downstream annotation.
This mission does not edit those prompts or annotations.

## Owner history

```bash
python3 -m tools.native_admission.history owner-evidence.zip
python3 -m tools.native_admission.history owner-evidence.zip --output imported-history
```

The first command is dry-run only. Explicit output creates an immutable import
report and records after validating every input. The old export's omitted saved
copy bytes, runtime binaries, source audits and raw GitHub responses stay explicit
in `missing_evidence`; archived logs and receipts are not relabelled as hosted CI.
Original verification errors and reconciliation sidecars are retained by hash.
Summary-only qualification-index exports cannot establish a verified PASS.

## Bootstrap and scheduling

New workflows need a supported Draft-branch execution route before any merge.
The temporary proof uses exactly `codex/canvas-native-ci-001` plus an explicit
request-file path. The initial resource budget is at most three four-map native
pilot runs. Those push triggers will be removed before delivery. Manual
`workflow_dispatch` is the eventual entry point after owner acceptance; no cron,
automatic map trigger, paid runner or production schedule is enabled here.

The historical Original Canvas Native Admission schedule was observed paused;
this implementation does not edit it. Routine execution can move to this system
after its acceptance gates pass. Art review, unusual-failure investigation and
owner graphical acceptance remain independent work.

## Recovery

Canceling qualification leaves raw Actions diagnostics and cannot advance the
evidence ref. A rejected or interrupted publication leaves the old index intact;
repeat publication against the same artifact to recover. An expiring Actions
artifact does not delete immutable metadata, but raw revalidation requires a
retained original ZIP. A temporary API failure never proves stale or PASS.
