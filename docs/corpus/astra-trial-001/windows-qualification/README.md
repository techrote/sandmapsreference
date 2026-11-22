# GOLD-ASTRA-001 bounded Windows qualification

This is a single mission-specific, public-repository Windows job. It does not
build native code, inspect the full corpus, schedule future work, or edit an
existing workflow. Root publishes and triggers it; the reviewer does not make
remote mutations.

## Publication layout

Place `gold-astra-001-windows.yml` at
`.github/workflows/gold-astra-001-windows.yml`. Place the other scripts and the
exact `owner-package-files.v1.json` under
`docs/corpus/astra-trial-001/windows-qualification/` on the mission PR.

The input manifest SHA256 is:

`a0bce08c63121c5dc84971813b241c835f5b586773f6192fcc45af4855276270`

It pins 585 files, accepted engine
`662df51cd8409a52332fa7ef15d06d8ab8945aed`, and all-eight output lock
`0bdbf3fc524e85c30c7095b7e1dad53159fd7d9c`.

The workflow runs only on pushes changing the named tooling paths on the
`astra-trial-001/ledger` branch of public `techrote/sandmapsreference`. It uses the
standard `windows-2022` label, `contents: read`, a 20-minute job timeout, sparse
checkout of the exact push commit and mission tooling, and cancellation of an
obsolete in-progress run for the same branch. It has no PR, schedule, or dispatch
trigger. Unrelated later ledger-document pushes do not rerun the native job. There are
no cache or artifact uploads. Small textual evidence is printed into the job
log and a concise result is written to the job summary.

GitHub's current official [runner reference](https://docs.github.com/en/actions/reference/runners/github-hosted-runners)
identifies `windows-2022` as a standard public-repository runner and states that
standard public-repository runner use is free. The [billing documentation](https://docs.github.com/en/billing/concepts/product-billing/github-actions)
distinguishes larger billed runners. The repository's API metadata was checked
and reports `private: false`. No larger runner or paid service is requested.

## Acquisition and package identity

`acquire_package.py` uses only the standard Python library. Eight bounded
download workers acquire immutable raw/LFS URLs and the exact official Godot
ZIP member. Every file's bytes, size and SHA256 must match the manifest.
Unresolved origins, duplicate or unsafe paths, unexpected scope and mismatched
bytes fail before native execution.

The input manifest is copied verbatim into the reconstructed package as
`package-files.v1.json`; it is intentionally excluded from its own file list.
The script builds a new ZIP, extracts it into a separate directory, then
verifies all 585 files plus the exact manifest bytes and rejects extra files.
This establishes **package file identity**, not identical compressed ZIP bytes.

The reviewer's local verification of the already assembled owner package
passed all 585 file checks and manifest-byte equality. The acquisition Python
script and runner compile, and workflow trigger/runner/permission/timeout
constraints passed local parsing. These are not Windows execution results.

## Windows execution

`run_windows_package.py` refuses to run on Linux. It uses actual Windows
PowerShell5.1 to parse the unchanged installer and test script and execute the
21 synthetic helper tests. A skipped symlink case is reported as unexecuted
and prevents claiming all21 cases passed.

The accepted owner project stays unchanged. A separate runtime copy omits the
accepted generated `.godot` cache, has a new minimal project configuration with
a unique application name, and receives the unchanged native admission harness
plus an unchanged owner preflight script. `--import` regenerates caches only in
that runtime copy. The actual preflight output supplies the Workbench path;
Windows `APPDATA` redirection is not assumed. The reported directory must be
fresh and contain the unique qualification project name.

The real helper stages each of the eight locked candidates into that fresh
directory and verifies the Windows runtime identities. Each map then runs two
separate Godot processes with the unchanged GDScript: load/full-grid/actor
adoption/controlled W movement/terrain contact/ordinary save, followed by fresh
reopen of the actual saved bytes. Candidate Setup hashes are independently
hard-pinned in the wrapper. A 14-minute native-phase deadline and per-process
timeouts keep the job within its overall20-minute boundary. Timed-out child
process trees are terminated.

After execution the script rechecks the complete extracted package and all
runtime-copy source files. Runtime-only generated caches are counted and
identified separately. The final status requires all21 helper cases, all8
native cases including contact, separate saved-file reopens, and unchanged
package/source identities.

## Result interpretation

Retrieve the public job log and extract these JSON records:

- `GOLD_WINDOWS_PACKAGE`: acquisition, ZIP/extraction and inventory evidence.
- `GOLD_WINDOWS_HELPER_TESTS`: actual parser version and all21 test outcomes.
- `GOLD_WINDOWS_MAP_RECEIPT`: eight per-map stage/load/contact/save/reopen records.
- `GOLD_WINDOWS_SUMMARY`: final runtime, source custody and aggregate status.

Godot logs are also printed between named `GOLD_WINDOWS_LOG_BEGIN` and
`GOLD_WINDOWS_LOG_END` delimiters. No output ZIP is uploaded by the workflow.
Root's owner ZIP remains bound by the same input inventory.

A successful hosted run would establish the described Windows headless checks.
It would not establish an owner-machine installation, GUI rendering/playfeel,
complete route flight, collision at every edited apparatus, machinery
animation, or owner acceptance. Before the actual run completes, those Windows
checks remain **UNTESTED**.
