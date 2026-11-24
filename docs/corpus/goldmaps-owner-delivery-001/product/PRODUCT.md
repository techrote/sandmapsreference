# GOLDMAPS portable collection — product contract

Status: additive delivery candidate; owner classifications and physical graphical
acceptance remain pending. The source preparation and qualification records in
the principal delivery packet determine which exact engine and Setups ship.

## Ordinary native boundary

`Open GOLDMAPS.cmd` starts the bundled Godot 4.7 executable with a small standalone
collection browser. The browser verifies every immutable payload against
`payload-manifest.v1.json` and its checksum before enabling map opening. It reads
the independent current-runtime `collection/delivery-qualification.v1.json` gate;
historical scientific PASS, artistic nomination and a bundled Setup do not enable
an unqualified map.

The browser starts one ordinary CyberSand Workbench process at a time, using the
exact accepted engine project plus the additive `goldmaps/session.gd` adapter.
That adapter uses `Setup.read_named`, native policy validation, the actual
`main.tscn`/SharedWorkbench, ordinary `load_setup`, and native acknowledgment and
material publication. It verifies full native material-plane SHA-256 and authored
actor adoption before reporting the source as loaded. No simulation or graphical
result is substituted for the engine. The original authored actor configuration
and geometry remain unchanged.

The engine is prepared using its three source-exact portable bootstrap files,
copied from immutable `runtime/bootstrap/` into mutable `.godot/`. The kit never
runs a first-use editor import, which would generate source-adjacent UID sidecars.
No accepted engine script is edited. The session-only Menu/F2 adapter displays
the same explicit save/discard/cancel return dialog as closing the game window.

## Isolated owner data and lifecycle

The launcher scopes APPDATA, LOCALAPPDATA, XDG data/config/cache and temporary
locations to `userdata/` inside the extracted kit. Both browser and game verify
the actual `OS.get_user_data_dir()` is beneath that folder, refusing to proceed
otherwise. Environment changes are process-local; the installed game profile
and system configuration are not modified.

Map inputs are copied byte-exact into the isolated Workbench input directory and
read through the ordinary named Setup boundary. After acknowledgment, that
temporary input copy is removed and the ordinary save name becomes a distinct
`eval-…` label. The immutable collection copy is never the save destination.
`Save evaluation copy` refuses an existing name. Ordinary Workbench Save remains
available when the owner deliberately updates their own named file. Saves are
authored starting layouts; they do not serialize current simulation state.

The gallery cannot replace or terminate an active World. It waits for that
process to exit before allowing another map, and closing the game requires a
visible save/discard/cancel decision. Saved-copy receipts include the label,
SHA-256, exact source/runtime and time; `My saved copies` reopens that exact local
copy in a fresh Workbench process. A changed saved file is refused by the shortcut
until deliberately loaded through the ordinary Workbench interface.

## Browse, compare and decide

The collection views are Gold25, seven repaired portraits, Astra comparisons,
the 70-source corpus index, policy-only descendants and all logical variants.
Search, family/orientation/native/review filters, arrow-key selection, Enter,
previous/next, Ctrl+F and full-resolution source previews are provided. Preview
labels distinguish material-plane visualizations from native graphical captures.
Original/refused states remain visible; policy descendants retain separate IDs.

Comparison panels show independent source images and identities. Their Open
actions create separate ordinary native sessions; no synchronized-world claim
is made. Frozen experimental verdicts remain separate from owner-local review.

Review forms start pending and unclassified. Choosing a status/classification
and pressing Save is an explicit local action. Closing an edited review asks
before discarding it. The kit writes no GitHub data. JSON, CSV and Markdown
exports include source/runtime hashes and timestamps under `userdata/reviews/`.
Screenshots captured in the ordinary rendered Workbench are recorded separately
from archived corpus visualizations.

## Reproducible product assembly

The integration staging script acquires the exact engine project, Godot,
native/Rapier libraries and notices. Corpus assembly supplies `collection/` and
`corpus-export/`. Then run:

```sh
python tools/goldmaps_owner/product/assemble_product.py \
  --output /absolute/staged-kit \
  --engine-head EXACT_ACCEPTED_ENGINE_SHA \
  --source-head EXACT_DELIVERY_SOURCE_SHA
```

This adds the browser, session adapter, launcher and product provenance only.
The caller runs qualification, inserts its per-Setup overlay, creates the final
payload manifest, and independently validates the actual extracted archive.
Owners need neither Python nor PowerShell to browse/open the shipped kit.

## Validation boundary

`--self-test` checks browser startup, package custody, collection counts and
profile routing without accepting any map. A qualification driver may set
`GOLDMAPS_QA_MAP`, `GOLDMAPS_QA_SMOKE=1` and `GOLDMAPS_QA_EDIT=1` in an isolated
test extraction to drive the real browser/session opening path, native paint,
save and separate-process reopen. These are explicit developer fixtures;
normal owner launch never sets them. Native campaign evidence and product
fixtures are complementary, and neither establishes physical NVIDIA playfeel
or final Gold/Platinum/Pyrite adoption.
