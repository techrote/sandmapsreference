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
The hosted smoke proof additionally uses `--require-own-source`, requiring a
producer from its own exact implementation commit. An earlier hosted pass for
the same map and runtime cannot satisfy that final-source demonstration.

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

## Draft execution and scheduling

The native and consumer workflows expose only `workflow_dispatch` and
`workflow_call`. Their prototype push triggers have been removed. A disposable
caller on exactly `codex/canvas-native-ci-001-proof` can invoke the reusable
workflow pinned to the final implementation commit before any merge. Its own
one-time push trigger is deactivated after the proof; it is not a production
automation. The caller must grant `contents: write` and `actions: read` to the
native reusable workflow so its separate publisher can run; the called native
job explicitly downgrades its own token to read-only.

Before checkout, trusted inline code resolves the implementation from GitHub's
official run and `referenced_workflows` metadata. It accepts only the known
workflow and proof-branch paths and a single exact SHA. There is no arbitrary
checkout-ref input. Evidence records distinguish the caller's commit from the
actual implementation checkout. The publisher independently validates that
reference chain, and the separate consumer requires that same implementation.

The initial resource budget is at most three Windows pilot jobs; the first
stopped at a test gate before any native execution. Manual `workflow_dispatch`
is the entry point after owner acceptance and default-branch availability. There
is no cron, automatic map qualification, paid runner or production schedule.
Cheap source checks are scoped to infrastructure paths and never run Godot.

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

## Demonstrated baseline and owner reproduction

The first complete native/publication demonstration is Actions run
`44924882225`, implementation `9d70f1e07aa3e554136fe7de31e88f611494532e`.
All four pilot maps passed; independent consumer run `44925254764` consumed the
published index from a clean checkout. These are historical baseline identities,
not claims about a future implementation revision. The PR handoff supplies the
subsequent exact final-source proof and current evidence commit.

An owner can reproduce an already qualified exact-source run without merging or
reactivating a push trigger:

```bash
gh run view RUN_ID --repo techrote/sandmapsreference
gh run rerun RUN_ID --repo techrote/sandmapsreference
gh run download RUN_ID --repo techrote/sandmapsreference --name native-evidence-RUN_ID-ATTEMPT
python3 -m tools.native_admission.evidence verify native-evidence.zip
```

Use the actual run ID and attempt from the owner handoff or Actions metadata.
Rerunning is an explicit bounded owner action; this implementation does not do
it automatically. The original run's commit-pinned reusable source remains
available after its disposable caller trigger is deactivated.

The live compact index is at
`https://raw.githubusercontent.com/techrote/sandmapsreference/refs/heads/evidence/native-admission/native-admission/v1/latest.json`.
Consumers resolve and pin the evidence branch commit before fetching its index,
checksum and records, so a concurrent publication cannot mix snapshots.
