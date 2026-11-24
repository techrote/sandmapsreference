extends Node

# Session-only UI: preserves the engine's ordinary play/edit/save code paths.
var owner_tree
var host: Control
var ui: Control
var banner := Label.new()
var notice_dialog := AcceptDialog.new()
var close_dialog := ConfirmationDialog.new()
var save_dialog := ConfirmationDialog.new()
var save_field := LineEdit.new()
var return_after_save := false

func mount(controller, controller_host: Control, workbench: Control) -> void:
	owner_tree = controller
	host = controller_host
	ui = workbench
	var layout: Node = host.get_node("Layout")
	var panel := PanelContainer.new()
	panel.name = "GoldmapsIdentity"
	var style := StyleBoxFlat.new()
	style.bg_color = Color("172332")
	style.border_color = Color("bfa362")
	style.set_border_width_all(1)
	style.content_margin_left = 12
	style.content_margin_right = 12
	style.content_margin_top = 7
	style.content_margin_bottom = 7
	panel.add_theme_stylebox_override("panel", style)
	layout.add_child(panel)
	layout.move_child(panel, 0)
	var content := VBoxContainer.new()
	panel.add_child(content)
	banner.text = "GOLDMAPS · preparing the exact native map…"
	banner.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	banner.add_theme_color_override("font_color", Color("ead497"))
	content.add_child(banner)
	var actions := HFlowContainer.new()
	actions.add_theme_constant_override("h_separation", 8)
	content.add_child(actions)
	_button(actions, "← Return to collection [F2]", owner_tree.request_close)
	_button(actions, "Save evaluation copy…", func() -> void: ask_save(false))
	_button(actions, "Screenshot", owner_tree.capture_screenshot)
	_button(actions, "Overview", func() -> void: ui.set_camera(2))
	_button(actions, "Focus pilot", func() -> void: ui.set_camera(1))
	var hint := Label.new()
	hint.text = "P play/pause · W/A/D pilot · mouse wheel zoom · middle-drag pan · all original Workbench editing controls below"
	hint.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	hint.add_theme_font_size_override("font_size", 13)
	hint.add_theme_color_override("font_color", Color("afbdd0"))
	content.add_child(hint)
	for dialog: Window in [notice_dialog, close_dialog, save_dialog]:
		get_tree().root.add_child(dialog)
		dialog.transient = true
		dialog.close_requested.connect(dialog.hide)
	close_dialog.title = "Return to GOLDMAPS collection"
	close_dialog.dialog_text = "Save a named evaluation copy before leaving if you want to keep your authored changes.\n\nReturning closes this World and discards unsaved edits and current simulation progress. Existing saved copies and your local review record stay available."
	close_dialog.ok_button_text = "Return without saving"
	close_dialog.cancel_button_text = "Keep playing"
	close_dialog.add_button("Save a copy and return…", false, "save")
	close_dialog.confirmed.connect(owner_tree.finish_close)
	close_dialog.custom_action.connect(func(action: StringName) -> void:
		if action == &"save":
			close_dialog.hide()
			ask_save(true))
	save_dialog.title = "Save a new evaluation copy"
	save_dialog.ok_button_text = "Save copy"
	var column := VBoxContainer.new()
	save_dialog.add_child(column)
	var text := Label.new()
	text.text = "Named authored start, using ordinary Workbench Save.\nExisting names are protected. Use letters, digits, '-' or '_'."
	text.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	column.add_child(text)
	save_field.max_length = 48
	save_field.custom_minimum_size.x = 560
	column.add_child(save_field)
	save_dialog.confirmed.connect(_save)
	# The ordinary Menu button normally replaces the active World. In this
	# opt-in evaluator it routes through the same explicit close warning as F2.
	_replace_menu(ui)

func _button(parent: Node, text: String, callback: Callable) -> void:
	var button := Button.new()
	button.text = text
	button.focus_mode = Control.FOCUS_NONE
	button.pressed.connect(callback)
	parent.add_child(button)

func _replace_menu(parent: Node) -> void:
	for child: Node in parent.get_children():
		if child is Button and child.text == "Menu [F2]":
			for connection: Dictionary in child.pressed.get_connections():
				child.pressed.disconnect(connection.callable)
			child.pressed.connect(owner_tree.request_close)
		else:
			_replace_menu(child)

func loaded_map() -> void:
	banner.text = "GOLDMAPS · %s · %s · engine %s · owner review pending%s" % [str(owner_tree.row.get("title", owner_tree.map_id)), owner_tree.map_id, str(owner_tree.manifest.engine_head).left(12), " · YOUR SAVED COPY" if not owner_tree.saved_label.is_empty() else ""]

func saved_copy(label: String) -> void:
	banner.text = "GOLDMAPS · %s · saved authored copy: %s · original source remains %s" % [owner_tree.map_id, label, owner_tree.original_sha.left(12)]

func notice(message: String) -> void:
	notice_dialog.dialog_text = message
	notice_dialog.popup_centered_clamped(Vector2i(720, 250), 0.9)

func confirm_close() -> void:
	close_dialog.popup_centered_clamped(Vector2i(760, 300), 0.95)

func ask_save(and_return: bool) -> void:
	if not owner_tree.loaded: notice("Wait for native map admission before saving a copy."); return
	return_after_save = and_return
	save_field.text = owner_tree.save_name
	save_dialog.popup_centered_clamped(Vector2i(650, 210), 0.95)
	save_field.grab_focus()
	save_field.select_all()

func _save() -> void:
	if owner_tree.save_copy(save_field.text.strip_edges()):
		if return_after_save: owner_tree.finish_close()
		else: notice("Saved " + save_field.text + " to this kit's isolated Workbench folder. It is available from My saved copies in the collection browser.")

func _process(_delta: float) -> void:
	if owner_tree != null: owner_tree.check_ordinary_save()

func _input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and not event.echo and event.keycode == KEY_F2:
		get_viewport().set_input_as_handled()
		owner_tree.request_close()
