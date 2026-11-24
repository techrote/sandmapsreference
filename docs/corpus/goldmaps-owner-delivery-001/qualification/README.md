# Independent owner-delivery qualification

Disposition: **Draft / HOLD. No owner classification or adoption is inferred.**

Specialist C reviews the collection and product authored by the other lanes, and
the lead reviews C's qualification implementation. These are different agent
roles in one technical session, not independent human assessors. The frozen
GOLD-ASTRA scientific adjudication remains authoritative for its original
question; the tools in this directory test the new delivery product.

## Qualification boundaries

The source-pinned contemporary engine is
`00cdb02f103265b6dc5224c68283e9a0c8cb449f`; the frozen scientific engine is
`662df51cd8409a52332fa7ef15d06d8ab8945aed`. Exact Godot 4.7 stable and both native
libraries must be verified through the package inventory and runtime provenance.
Linux execution is not Windows execution. Headless behavior is not displayed
rendering, physical NVIDIA behavior, full-route playability, artistic preference,
or owner acceptance.

`run_native_collection.py` groups aliases by exact Setup SHA-256. Each positive
unique Setup executes an ordinary Workbench load with complete native material
readback, adoption of every authored actor, acknowledged simulation, applicable
Midge movement and genuine Rapier contact, an authored save under a new label,
and a second Godot process reopening that save. The saved authored recipe must
equal the source semantically, including policy and actor fields. The immutable
source file and native material plane are checked separately. Actorless maps
keep the movement/contact fields explicitly not applicable.

Original #155 and #183 are expected negative fixtures. Their successful negative
test means an actual native `malformed_policy / bad magic` refusal before map
adoption; it never means the original map passed. The recovered #155 descendant
and separately identified #183 default-policy descendant must pass their own
positive tests. Zero-filled invalid policies have no executable equivalent:
admitting the supported native-default envelope is an explicit integration
choice, with all non-policy fields and material geometry preserved.

## Tools and reproducible commands

All commands run from the additive delivery repository checkout. Receipt
directories must be new. Package paths with spaces are supported through
structured subprocess arguments. Python source/receipt JSON is UTF-8; no checkout
conversion may alter the pinned native inputs. `audit_collection.py` and the
product paint comparison require NumPy and Pillow; the acquisition tool and its
hostile fixtures use only the Python standard library.

```sh
python tools/goldmaps_owner/qualification/verify_payload.py <kit-or-zip> --out <new-custody-receipt.json>

python tools/goldmaps_owner/qualification/audit_collection.py \
  --package <kit> --frozen-repo . --out <new-roster-review.json>

python tools/goldmaps_owner/qualification/run_native_collection.py \
  --package <kit> --godot <kit/Godot_v4.7-stable_win64_console.exe> \
  --engine-head 00cdb02f103265b6dc5224c68283e9a0c8cb449f \
  --manifest-sha256 <externally-recorded-manifest-sha256> --jobs 1 --out <new-native-receipts>

python tools/goldmaps_owner/qualification/run_package_boundary_qa.py \
  --package <kit> --godot <kit/Godot_v4.7-stable_win64_console.exe> --out <new-boundary-receipts>

python tools/goldmaps_owner/qualification/run_product_qa.py \
  --package <fresh-disposable-kit> --godot <kit/Godot_v4.7-stable_win64_console.exe> \
  --disposable-test-profile --actual-windows-launcher --out <new-product-receipts>

python tools/goldmaps_owner/qualification/test_payload_contract.py
python tools/goldmaps_owner/qualification/test_acquisition_contract.py
```

For a displayed product run, append `--graphical`; a real displayed receipt and
capture must exist before claiming graphical coverage. The separate optional
corpus campaign uses `--inputs collection/native-inputs-optional.v1.json`. Its
Setups are disjoint from the required campaign, so there is no duplicate native
qualification. Merge final matrix statuses by exact digest and retain platform,
source and per-case evidence. Never turn an absent or skipped gate into a pass.

The native runner accepts `--routes` for the existing source-bound route fixtures.
Their receipts describe bounded scripted pilot behavior; they do not adjudicate
B3 flight readability or resolve D1/D2 artistic preference. Keep those questions
in the owner checklist.

## Product and hostile fixture coverage

The runtime package-boundary test calls the **delivered** GDScript verifier. It
checks an intact fixture and rejects missing, extra, corrupted, truncated,
duplicated, case-aliased, traversing, incorrectly sized and substituted payloads,
as well as missing or incorrect manifest checksums. New files are allowed only
under the declared owner/cache roots. Immutable source cannot hide inside a
mutable root. Separate Python fixtures inspect ZIP structure, CRC, exact bytes,
symlinks, Windows path aliases and the deterministic acquisition fallback.

The product QA opens the actual shipped browser scene. It checks collection
navigation, a three-way D1 comparison, a visibly disabled refused original,
pending-review draft cancellation, two successive writes to the same local
review file, fresh-process review restoration and exact JSON/CSV/Markdown export
of multiline quoted notes. Its synthetic choices remain **Pending / Unclassified**.
They belong only in a disposable test profile and must not enter an owner ZIP.

Its representative native edit case uses the ordinary Workbench paint operation,
saves a distinct named copy, and reopens that copy through the actual browser's
child-process path. A separate material-plane replay checks the saved recipe and
the fresh native world. The primary source input stays immutable. This proves
one representative editing path; it does not assert all-map editing acceptance.

## Environment limitations and preserved negative evidence

The initial local campaign used two required workers plus one optional worker.
Several native processes exited with signal 9 before producing native map
receipts. Available RAM and shared-memory pressure made resource exhaustion the
leading explanation, but kernel OOM counters were unavailable. The lead stopped
only these owned jobs, preserved every partial receipt and moved bulk staging to
disk-backed storage. The resumed local campaign uses one worker. No map,
simulation, geometry, physics or contact parameter was changed to obtain a pass.

The interrupted campaign is explicitly **environment-interrupted / unqualified**,
not a map incompatibility verdict. Final evidence must retain both this limit
and the separately executed continuation; it must not silently replace the
negative logs. A local Xorg/display socket restriction also prevents a local
graphical claim. Hosted displayed execution and physical owner inspection remain
separate gates.

## Final independent acceptance checklist

- Verify the actual downloadable inner ZIP and external SHA-256; inspect CRC,
  full immutable inventory, exact source origins and runtime dependency pins.
- Extract into a fresh directory containing spaces, verify the launcher and
  browser, load a qualified original and both policy descendants, and retain
  native receipts against the freshly extracted payload.
- Confirm all required logical views, source/variant/engine labels, refusal
  labels, local decisions and named saves are understandable and persistent.
- Inspect real rendered landscape and portrait examples, comparison sites and
  corrected descendants. Label material previews, hosted captures and physical
  owner captures accurately.
- Confirm final Windows per-unique-Setup admission, authored actor adoption,
  progression, material readback, applicable movement/contact, save and reopen
  statuses; retain any exceptions or unqualified payloads explicitly.
- Confirm all 70 source identities, all seven portraits, all Gold25 nominees,
  all comparison aliases, #125's actual finalisation recommendation and history,
  both original refusals and the exact recovered #155 derivative.
- Confirm the architectural export preserves protected states, negative
  interventions, source/licensing limits and the 28 hash-only missing failed
  occurrences; inferred module hints must remain unapproved and non-native.
- Leave physical Windows/NVIDIA playfeel, B3 high-speed readability, D1/D2
  preference, Gold/Platinum/Pyrite decisions, adoption and merge to the owner.

The final independent review must report the actual completed checks and remaining
gates. This checklist itself is not a pass receipt.
