extends "res://goldmaps/session.gd"

# Focused product regression fixture. It executes the actual additive control
# and receipt methods with a synthetic Workbench; it does not construct a
# native World and is never evidence of map admission or graphical acceptance.

class SyntheticPaint extends RefCounted:
	var enabled := true
	func paint_mode_active() -> bool: return enabled

class SyntheticWorkbench extends Control:
	const Store = preload("res://scripts/workbench_setup.gd")
	var _name := LineEdit.new()
	var _tool := OptionButton.new()
	var paint_editor := SyntheticPaint.new()
	var save_calls := 0
	var commits := 0
	var replacement_calls := 0
	var save_succeeds := true
	var _actor_panel: Window
	func _commit_field(_viewport: Viewport = null) -> void: commits += 1
	func set_camera(_mode: int) -> void: pass
	func save_setup() -> bool:
		save_calls += 1
		if not save_succeeds: return false
		var file := FileAccess.open(Store._path(_name.text), FileAccess.WRITE)
		if file == null: return false
		file.store_string("{\"synthetic_authored_save\":true,\"save_call\":%d}\n" % save_calls)
		file.close()
		return true
	var message := "synthetic save refusal"
	func add_action(caption: String, callback: Callable, parent: Node = null) -> Button:
		var button := Button.new()
		button.text = caption
		button.pressed.connect(callback)
		(self if parent == null else parent).add_child(button)
		return button
	func open_actor_composition() -> void:
		_actor_panel = Window.new()
		_actor_panel.hide()
		add_child(_actor_panel)
		add_action("Mixed Actor Workshop",func() -> void: replacement_calls += 1,_actor_panel)
		_actor_panel.popup_centered(Vector2i(400,300))

var checks: Array[Dictionary] = []

func _initialize() -> void:
	_run_fixture.call_deferred()

func _check(name: String, accepted: bool) -> void:
	checks.append({"name":name,"pass":accepted})
	print("GOLDMAPS_SYNTHETIC_CONTROL " + JSON.stringify(checks.back()))

func _run_fixture() -> void:
	package_root = OS.get_environment("GOLDMAPS_PACKAGE_ROOT")
	if package_root.is_empty():
		push_error("Set GOLDMAPS_PACKAGE_ROOT to a dedicated temporary fixture directory.")
		quit(2); return
	DirAccess.make_dir_recursive_absolute(Setup.DIRECTORY)
	map_id = "synthetic-source-a"
	session_id = "synthetic-control-" + Crypto.new().generate_random_bytes(8).hex_encode()
	row = {"title":"Synthetic control fixture"}
	manifest = {"engine_head":"00cdb02f103265b6dc5224c68283e9a0c8cb449f"}
	original_sha = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
	report = {"schema":"goldmaps.synthetic-controls.v1","saved_copies":[],"screenshots":[],"scope":"Synthetic Workbench; no native World or graphical acceptance"}
	host = Control.new()
	var layout := VBoxContainer.new()
	layout.name = "Layout"
	host.add_child(layout)
	root.add_child(host)
	var synthetic := SyntheticWorkbench.new()
	ui = synthetic
	layout.add_child(ui)
	ui.add_child(synthetic._name)
	ui.add_child(synthetic._tool)
	synthetic._tool.add_item("Paint")
	synthetic._tool.add_item("Other")
	for action: String in Controls.REPLACEMENT_ACTIONS:
		if action != "Mixed Actor Workshop": synthetic.add_action(action,func() -> void: synthetic.replacement_calls += 1)
	synthetic.add_action("Actor Composition…",synthetic.open_actor_composition)
	synthetic.add_action("Save start [Ctrl+S]",synthetic.save_setup)
	synthetic.add_action("Flatten / Bake History…",func() -> void: synthetic.replacement_calls += 1)
	synthetic.add_action("Menu [F2]",func() -> void: synthetic.replacement_calls += 1)
	controls = Controls.new()
	root.add_child(controls)
	controls.mount(self,host,ui)
	loaded = true
	controls.loaded_map()
	controls.actor_composition_button.pressed.emit()
	await process_frame
	_check("lazy Actor Composition replacement is guarded",controls.replacement_buttons.has("Mixed Actor Workshop"))
	for action: String in Controls.REPLACEMENT_ACTIONS:
		controls.replacement_buttons[action].pressed.emit()
		await process_frame
		_check(action + " warns before replacement",controls.close_dialog.visible and synthetic.replacement_calls == 0)
		controls.close_dialog.get_cancel_button().pressed.emit()
		await process_frame
		_check(action + " Cancel retains the synthetic owner",not controls.close_dialog.visible and not closing and synthetic.replacement_calls == 0)
	synthetic._actor_panel.hide()
	controls.flatten_button.pressed.emit()
	_check("Flatten is a visible non-mutating limitation",controls.notice_dialog.visible and synthetic.replacement_calls == 0)
	controls.notice_dialog.get_ok_button().pressed.emit()
	var foreign_label := "synthetic-foreign-" + Crypto.new().generate_random_bytes(6).hex_encode()
	var foreign := FileAccess.open(Setup._path(foreign_label),FileAccess.WRITE)
	foreign.store_string("{\"foreign_source\":\"b\"}\n")
	foreign.close()
	var foreign_hash := FileAccess.get_sha256(Setup._path(foreign_label))
	var banner_before: String = controls.banner.text
	synthetic._name.text = foreign_label
	await create_timer(1.2).timeout
	_check("typing an existing foreign label creates no receipt",report.saved_copies.is_empty() and controls.banner.text == banner_before)
	controls.ordinary_save_button.pressed.emit()
	_check("ordinary Save protects a pre-existing name",synthetic.save_calls == 0 and report.saved_copies.is_empty() and FileAccess.get_sha256(Setup._path(foreign_label)) == foreign_hash)
	controls.notice_dialog.get_ok_button().pressed.emit()
	var reserved_label := "GM-SOURCE-" + original_sha.left(20)
	_check("uppercase reserved source name cannot save",not save_copy(reserved_label) and not FileAccess.file_exists(Setup._path(reserved_label)) and report.saved_copies.is_empty())
	controls.notice_dialog.get_ok_button().pressed.emit()
	var button_label := "synthetic-button-" + Crypto.new().generate_random_bytes(6).hex_encode()
	synthetic._name.text = button_label
	controls.ordinary_save_button.pressed.emit()
	_check("ordinary Save invokes the save implementation once",synthetic.save_calls == 1 and synthetic.commits == 2 and _has_saved_receipt(button_label))
	var key_label := "synthetic-key-" + Crypto.new().generate_random_bytes(6).hex_encode()
	synthetic._name.text = key_label
	var key := InputEventKey.new()
	key.keycode = KEY_S
	key.ctrl_pressed = true
	key.pressed = true
	Input.parse_input_event(key)
	await process_frame
	key.pressed = false
	Input.parse_input_event(key)
	await process_frame
	_check("Ctrl+S invokes protected save once",synthetic.save_calls == 2 and synthetic.commits == 3 and _has_saved_receipt(key_label))
	synthetic.paint_editor.enabled = false
	key.pressed = true
	Input.parse_input_event(key)
	await process_frame
	key.pressed = false
	Input.parse_input_event(key)
	await process_frame
	_check("Ctrl+S retains Paint Editor eligibility",synthetic.save_calls == 2 and synthetic.commits == 3)
	synthetic.save_succeeds = false
	var refused_label := "synthetic-refused-" + Crypto.new().generate_random_bytes(6).hex_encode()
	synthetic._name.text = refused_label
	controls.ordinary_save_button.pressed.emit()
	_check("unsuccessful ordinary save creates no receipt",synthetic.save_calls == 3 and not _has_saved_receipt(refused_label) and report.saved_copies.size() == 2)
	controls.notice_dialog.get_ok_button().pressed.emit()
	synthetic._name.text = foreign_label
	finish_close()
	_check("closing with a foreign label creates no receipt",not _has_saved_receipt(foreign_label) and report.saved_copies.size() == 2 and FileAccess.get_sha256(Setup._path(foreign_label)) == foreign_hash)
	var passed := 0
	for check: Dictionary in checks:
		if check.pass: passed += 1
	var summary := {"schema":"goldmaps.synthetic-control-review.v1","scope":"Actual additive callbacks with synthetic Workbench; no native World, map admission or graphical claim","checks":checks,"passed":passed,"total":checks.size(),"validation":passed == checks.size()}
	IO.atomic_json(package_root.path_join("synthetic-control-summary.json"),summary)
	print("GOLDMAPS_SYNTHETIC_CONTROL_SUMMARY " + JSON.stringify(summary))
	quit(0 if summary.validation else 2)
