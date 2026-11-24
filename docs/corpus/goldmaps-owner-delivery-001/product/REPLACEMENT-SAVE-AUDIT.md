# GOLDMAPS ordinary Workbench replacement and save audit

Status: additive product correction; fresh product execution is required before
final delivery. This source audit does not replace a native, graphical or physical
input receipt. Reviewer role: Specialist B, product implementer; Specialists A
and C independently review the changes and C owns execution assertions.

## Authority and scope

The read-only engine authority is CyberSand
`00cdb02f103265b6dc5224c68283e9a0c8cb449f`. No accepted engine file is changed.
The audit follows actual calls into SharedWorkbench `apply`, `new_canvas`,
`load_setup`, `load_equipment_start`, `load_water_comparison`,
`load_mixed_actor_workshop`, `install_generated_start`, and main
`workbench_apply`/`workbench_restart`. It also examines the ordinary main-window
keyboard dispatch, relevant generator/file-dialog entries and save callers.

The product adapter starts one ordinary Workbench World with a pinned source
identity. Replacing it through another laboratory's start would lose that
identity and bypass the collection's unsaved-work warning. These controls now
open the same explicit save/return/cancel dialog used by Menu, F2 and window
close. Cancel leaves the active World and source identity intact.

## Replacement entries

| Ordinary control | Exact accepted source path | Additive behavior |
|---|---|---|
| Load start | `shared_workbench.gd` button → `load_setup` → Setup/flattened/generated/builtin admission | Save/return/cancel; direct initial `ui.load_setup()` is preserved |
| New blank | `shared_workbench.gd` button → `new_canvas` → fresh Setup | Save/return/cancel |
| New from generator… | `shared_workbench.gd` → generator `open_new` → verified proposal → `install_generated_start` | Save/return/cancel before opening the generator |
| Load / reset scene | `workbench_water_spray_panel.gd` → `_load_comparison` → `load_water_comparison` | Save/return/cancel |
| Load liquid-lab | `workbench_liquid_equipment_panel.gd` → `load_equipment_start` | Save/return/cancel |
| Load reservoir-lab | `workbench_liquid_equipment_panel.gd` → `load_equipment_start` | Save/return/cancel |
| Mixed Actor Workshop | lazy `workbench_actor_panel.gd` → `load_mixed_actor_workshop` | Scoped node-added guard; save/return/cancel |

The accepted `_button` helper sets text and connects its original callback
before adding a Button to the tree. The session's node-added hook is limited to
Buttons beneath the current SharedWorkbench. It replaces only the identified
replacement/save/unsupported-flatten callbacks. Actor Composition itself and its
ordinary actor-placement, selection, equipment and control editing remain
available.

All other SharedWorkbench `apply` calls either preserve live terrain while
changing the current source's actor/settings/policy configuration, or restore
the current authored start. `restore_start` and failed-owner recovery of
`applied` remain ordinary. There is one SharedWorkbench call into main's
`workbench_apply`; `workbench_restart` callers are the already identified
replacement paths or current-start recovery.

## Keyboard, import and alternate windows

With SharedWorkbench active, main's key handler returns from its Workbench
branch before generic F4/L/O and other prototype actions. Its retained keys
control play, actor reset, stepping and equipment; they do not admit a different
map. SharedWorkbench/Paint Editor's L/O/N meanings are drawing or actor actions,
not hidden map loaders. No file-drop admission callback is present in the
inspected ordinary Workbench/main/generator/paint code.

The generator FileDialog imports a generator recipe into its proposal dialog;
the only ordinary open paths are the guarded New-from-generator and generated
saved-Load paths. The accepted install method remains unchanged. Materials Lab
file imports operate on its separate experiment/preset owner and do not call
the current SharedWorkbench replacement methods. Art traffic export is a save
dialog, not map admission. Standalone developer scripts that explicitly invoke
Workbench methods are outside the shipped user entry path.

Menu/F2/window close remain routed through the explicit return dialog. Accepted
main has no earlier close-request callback that quits this session; the adapter
sets `auto_accept_quit=false` and disables the ordinary FeatureNavigation F2
input handler for its own process only.

## Successful saves and source attribution

The old filename poll and close-time file-existence check could incorrectly
attach another map's existing file after a user merely typed its name. Those
paths are removed. Receipts are written only after a successful ordinary
`ui.save_setup()` call inside the evaluator's protected save method.

The actual **Save start [Ctrl+S]** button retains its pending-field commit.
Ctrl+S retains the accepted Paint Editor's `paint_mode_active()` eligibility,
non-echo keypress check and pending-field commit. Both enter the same new-name
protection as **Save evaluation copy**. A pre-existing name is refused and its
bytes are preserved; a new name uses the unchanged engine save implementation.
The adapter consumes the dispatched shortcut to prevent a second unprotected
ordinary Save. Merely naming a file, closing the window or opening a laboratory
does not create a saved-copy receipt.

Flatten/Bake History would produce the engine's MaterialBaseline binary format,
whereas this product's source-bound saved-copy replay is qualified for authored
Setup JSON. Its control now shows an explicit limitation before any bake. The
current authored history, material baseline and native World are retained.

## Execution evidence required for final acceptance

The extended product fixture must execute all seven actual replacement buttons,
including opening lazy Actor Composition, and observe warning → Cancel → same
World epoch. It must also exercise the real Flatten button without a transaction
or authored-format change. The save fixture copies exact bytes of a different
bundled source into the isolated developer save folder, types that existing name
without Save, and verifies no receipt/banner attribution. An actual ordinary
Save attempt on that name must preserve its bytes. New-label ordinary Save and
dispatched Ctrl+S must each write a correctly hashed receipt, followed by the
existing actual Save-and-return and fresh-process reopen gates.

These assertions run in both initial edited and reopened product sessions.
They are execution of actual handlers and a dispatched key event, not physical
mouse/keyboard acceptance. Historical native map qualification remains bound to
its own source; continuation receipts must name the newly executed product
source separately. All owner classifications remain pending.

The focused `test_session_controls.gd` regression fixture executed the actual
additive callbacks against a synthetic Workbench under exact Godot 4.7 stable:
**23/23 checks passed**. It includes the lazy seventh control, all cancellation
paths, foreign-name typing/closing, protected ordinary Save, successful and
ineligible Ctrl+S, and failed-save receipt suppression. The exact product/test
file hashes and scope are recorded in
[`synthetic-controls-review.v1.json`](synthetic-controls-review.v1.json).
It constructed no native World; fresh actual-map product execution remains a
required separate gate.
