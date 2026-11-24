# GOLDMAPS — open the collection

**Extract the whole ZIP, then double-click `Open GOLDMAPS.cmd`.**

This is an isolated CyberSand evaluation copy. It includes the game runtime,
maps, previews and local review tools. You do not need to compile CyberSand,
install maps one at a time, or use PowerShell to browse the collection.

## First launch

1. Extract `CyberSand-GOLDMAPS-Owner-Evaluator-<source-id>.zip` to an ordinary
   local folder where you can save files. A path containing spaces is supported.
   If GitHub gave you an outer artifact ZIP, extract that first, then extract
   the named evaluator ZIP inside it.
2. Open **Open GOLDMAPS.cmd**. Keep the executable, browser, runtime,
   collection and manifests together.
3. The gallery checks its original files before enabling map selection. This
   initial check can take a moment. Errors are shown; a damaged or incomplete
   package does not silently open an alternative map.
4. Start with **Gold25 nominees**. Select a map, inspect its overview and source
   identity, then choose **Open in Workbench** if it is enabled.

The launcher does not install software or change your ordinary CyberSand
profile. It runs locally after extraction. Source links are optional online
references; map browsing, play, saves and review export do not need a network.

## Find the map you want

| Collection | What it contains |
| --- | --- |
| Gold25 nominees | The 25 frozen recommendations, all still awaiting your decisions |
| Repaired portraits | Seven separately identified repairs, with original parents |
| Astra comparisons | Eight original/candidate pairs and the D1/D2 prior references |
| All 70 sources | The complete read-only corpus index, including supplementary donors |
| Policy descendants | The recovered #155 descendant and the separate #183 default-policy variant |
| All variants | Every logical collection entry, including comparison aliases |

Search by title, architecture, source PR or variant. Filter by family,
orientation, native eligibility and your local review status. **Ctrl+F** focuses
search; **Page Up / Page Down** move through the filtered list. Click an overview
to inspect the image at greater detail. Previews identify their provenance:
archived material-plane images are not physical GPU screenshots.

Every entry keeps its original source commit, Setup digest and variant role.
Different logical entries can share exact Setup bytes; their review records
remain separate. A disabled Open button explains why an entry is reference
only or refused. Bundling a source file does not by itself qualify it for play.

## Play and edit in the ordinary Workbench

Opening an eligible map starts a separate ordinary CyberSand Workbench window.
The gallery remains open. The top identity strip names the loaded map and the
accepted engine revision. Native admission verifies the actual authored
material plane before making the session available.

| Control | Action |
| --- | --- |
| **Play / Pause**, or **P** | Start or pause native simulation |
| **Pilot** selector | Select an authored actor to control, where present |
| **W / A / D** with a Midge selected | Thrust and steer through the ordinary actor controls |
| Mouse wheel over the canvas | Zoom |
| Middle mouse drag | Pan |
| **Overview** | Fit the map for inspection |
| **Focus pilot** | Return the camera to the selected actor |
| Ordinary paint/tool controls | Paint, erase and edit the active evaluation World |
| **Screenshot** in the identity strip | Save a local session-linked image |
| **Return to collection**, or **F2** | Choose whether to save, leave, or keep playing |

Click back on the game canvas after editing a text field before using pilot
keys. All authored actors and supported settings are retained. Decorative
machinery may look functional without being simulated machinery.

The browser waits for the current Workbench to close before opening another
map. Returning warns that unsaved edits and evolving simulation state will be
discarded. Your saved copies and explicit review records remain available.

## Save an evaluation copy

Use **Save evaluation copy…** and give it a new name. Names use letters, digits,
hyphens or underscores and must fit within 48 characters. Existing names are
protected by the evaluation save action. The ordinary Workbench **Save start**
also remains available; keep a new evaluation name in its name field.

**Save start stores the authored starting layout, actors and settings. It does
not serialize the current evolving physical World.** This distinction matters
after fluids, fire or moving actors have changed the live scene.

Close that Workbench, then choose **My saved copies** for the map in the
gallery to reopen a saved evaluation in a new process. Original collection
Setups remain immutable. A saved copy has its own digest and is labelled as
your authored copy; original-plane equality is not claimed for edits.

All evaluation data stays below `userdata/` in this extracted kit. Review
records are in `userdata/reviews/decisions.json`; exported reviews are below
`userdata/reviews/exports/`; screenshots are below
`userdata/reviews/screenshots/`; session identities/logs are below
`userdata/sessions/`. Copy the whole extracted folder if you want to retain
your evaluation data while moving the kit.

## Compare and record your decision

The comparison view shows images, site coordinates and source metadata beside
one another. Actual gameplay is sequential: close one World and open the next
variant. Independently simulated Worlds are not presented as a synchronized
state. Use the archived sites and authored spawns as reference points.

Choose **Record decision** to save a status, optional classification, preferred
variant and playability/presentation notes. **Ctrl+S** opens the review action.
Each entry starts pending and unclassified. Nothing becomes accepted because
it has a Gold nomination or a native PASS.

| Frozen arm | Existing conclusion and your remaining question |
| --- | --- |
| B1 — Keelbone Switchback | Positive uplift; inspect the receiver and retained detour |
| B2 — Umbra Rotor | Positive uplift; inspect the central apparatus and distinct islands |
| B3 — Brackenfold | Racing benefit remains inconclusive; judge the forks at actual flight speed |
| C1, C2, C3 | Correct abstention: exact unchanged material-plane controls |
| D1 — Orthant | Assessor disagreement remains; compare original, Astra and prior reference |
| D2 — Warden | Prior reference preferred in the frozen assessment; your choice remains open |

**Gold** is an exemplar you choose to adopt. **Platinum** is a derived
intervention you judge improves the source while preserving its identity and
topology. **Pyrite** records a derivative that regressed or remains substandard;
preserve the original and explain why. **No-change** is useful when an already
strong source should remain untouched. **Other** and **Needs review** remain
available. The full historical decision guide is
`collection/DECISION-GUIDE.md`.

**Export my reviews** writes Markdown, JSON and CSV into the local export
folder. No reviews, screenshots or decisions are uploaded. Export does not
update GitHub, merge a PR or change production adoption.

## Refused originals and policy variants

Original #155 remains a Gold nominee with a malformed native policy. Its
separate recovered descendant preserves the material plane and actors while
using the supported native-default envelope. It does not retroactively qualify
the original.

Original #183 is outside Gold25 and has a separate malformed-policy refusal.
Its explicitly labelled default-policy variant changes only that unusable
policy field. Equivalence to an invalid all-zero policy is not asserted.
Read the per-variant derivation and current native status before deciding
whether to use either descendant. Neither variant is automatically adopted.

## Evidence, source and limits

The current playable delivery uses accepted CyberSand
`00cdb02f103265b6dc5224c68283e9a0c8cb449f` and Godot
`4.7.stable.official.5b4e0cb0f`. The original scientific engine remains
`662df51cd8409a52332fa7ef15d06d8ab8945aed`; new delivery tests do not replace
the frozen research.

- `payload-manifest.v1.json` and `payload-manifest.sha256`: exact immutable kit inventory.
- `runtime/source-provenance.v1.json`: accepted engine source, runtime hashes and origins.
- `collection/delivery-qualification.v1.json`: actual current per-Setup native eligibility.
- `qualification/`: shipped execution evidence, platform scope and remaining gates.
- `corpus-export/`: read-only architectural knowledge, protected states, negative evidence and Batch Lab handoff.
- `corpus-export/frozen/FINAL-DECISION-PACKET.md`: preserved scientific conclusions.
- `LICENSE-AND-SOURCE.md`: source and license notices.

Hosted headless tests can prove exact load, actor adoption, simulation,
controlled movement/contact and authored save/reopen. They do not decide
physical Windows/NVIDIA presentation, high-speed route readability, subjective
playfeel or your classifications. Keep those questions explicit in your review.

If launch or load fails, keep the error message and the relevant `userdata/`
log with the map ID. Re-extract the same verified ZIP into a fresh folder to
rule out accidental file damage; preserve your existing userdata separately.
Do not mix engine DLLs, scripts or maps from another build into this package.
