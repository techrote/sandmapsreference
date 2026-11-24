extends SceneTree

# Opt-in delivery adapter. The accepted Workbench, Setup validator, worker,
# native World, physical actors and save implementation remain unchanged.
const IO = preload("res://goldmaps/package_io.gd")
const Setup = preload("res://scripts/workbench_setup.gd")
const Controls = preload("res://goldmaps/session_controls.gd")

var package_root := ""
var map_id := ""
var session_id := ""
var row: Dictionary = {}
var manifest: Dictionary = {}
var report: Dictionary = {}
var host: Control
var ui: Control
var controls: Node
var loaded := false
var closing := false
var save_name := ""
var original_path := ""
var original_sha := ""
var saved_label := ""
var saved_sha := ""

func _initialize() -> void:
	_start.call_deferred()

func _arguments() -> Dictionary:
	var values := OS.get_cmdline_user_args()
	var parsed: Dictionary = {}
	var i := 0
	while i < values.size():
		if values[i] in ["--goldmaps-id", "--goldmaps-session", "--goldmaps-saved-label", "--goldmaps-saved-sha256"]:
			if i + 1 >= values.size(): return {"error":"Missing session argument."}
			parsed[values[i]] = values[i+1]
			i += 2
		else:
			return {"error":"Unknown session argument: " + values[i]}
	return parsed

func _safe_id(id: String, maximum: int = 100) -> bool:
	if id.is_empty() or id.length() > maximum: return false
	for character: String in id:
		if character not in "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_": return false
	return true

func _start() -> void:
	auto_accept_quit = false
	# The accepted engine requests a 1920x1080 window and logical canvas.
	# Fit this opt-in process to the desktop and use the fitted client size
	# as its logical canvas. Ordinary responsive Workbench controls keep
	# their accepted font sizes instead of shrinking to unreadable text.
	if DisplayServer.get_name() != "headless":
		var usable := DisplayServer.screen_get_usable_rect(root.current_screen)
		if usable.size.x > 0 and usable.size.y > 0:
			var fitting := Vector2i(mini(root.size.x, maxi(960, usable.size.x-32)), mini(root.size.y, maxi(600, usable.size.y-64)))
			root.min_size = Vector2i(mini(root.min_size.x, fitting.x), mini(root.min_size.y, fitting.y))
			root.content_scale_size = fitting
			root.size = fitting
			root.position = usable.position + (usable.size-fitting)/2
	package_root = OS.get_environment("GOLDMAPS_PACKAGE_ROOT").simplify_path()
	var args := _arguments()
	if args.has("error"): _refuse(args.error); return
	map_id = str(args.get("--goldmaps-id", ""))
	session_id = str(args.get("--goldmaps-session", ""))
	saved_label = str(args.get("--goldmaps-saved-label", ""))
	saved_sha = str(args.get("--goldmaps-saved-sha256", ""))
	if not _safe_id(map_id, 80) or not _safe_id(session_id, 130): _refuse("Invalid map/session identity."); return
	if package_root.is_empty() or not package_root.is_absolute_path(): _refuse("Open this map from the GOLDMAPS collection browser."); return
	report = {"schema":"goldmaps.owner-session.v1", "map_id":map_id, "session_id":session_id, "status":"STARTING", "process_id":OS.get_process_id(), "user_data_dir":OS.get_user_data_dir(), "package_root":package_root, "godot_version":Engine.get_version_info(), "opened_at":Time.get_datetime_string_from_system(true) + "Z", "saved_copies":[], "screenshots":[], "owner_acceptance":"pending"}
	var isolation := IO.profile_error(package_root)
	if not isolation.is_empty(): _refuse(isolation); return
	var checked := IO.manifest_rows(package_root)
	if checked.has("error"): _refuse(checked.error); return
	manifest = checked.document
	for index: int in checked.rows.size():
		var reason := IO.verify_row(package_root, checked.rows[index])
		if not reason.is_empty(): _refuse(reason); return
		if index % 8 == 0: await process_frame
	var roster := IO.bounded_json(package_root.path_join(IO.COLLECTION))
	var qualification := IO.bounded_json(package_root.path_join(IO.QUALIFICATION))
	if roster.has("error") or qualification.has("error"): _refuse("Collection or native qualification is missing."); return
	var collection_problem := IO.collection_error(roster.data)
	if not collection_problem.is_empty(): _refuse(collection_problem); return
	row = IO.find_map(roster.data, map_id)
	if row.is_empty(): _refuse("Logical map identity was not found."); return
	var reason := IO.playable_reason(row, qualification.data, str(manifest.engine_head))
	if not reason.is_empty(): _refuse(reason); return
	original_path = package_root.path_join(str(row.setup.path))
	original_sha = str(row.setup.sha256)
	if FileAccess.get_sha256(original_path) != original_sha: _refuse("Selected Setup bytes no longer match the collection."); return
	report["engine_head"] = manifest.engine_head
	report["source"] = row.get("source", {})
	report["derived_source"] = row.get("derived_source")
	report["derivation_path"] = row.get("derivation_path")
	report["original_setup_sha256"] = original_sha
	report["variant_role"] = row.get("variant_role", "source")
	var source_label := "gm-source-" + original_sha.left(20)
	if DirAccess.make_dir_recursive_absolute(Setup.DIRECTORY) != OK: _refuse("Cannot create isolated Workbench save folder."); return
	if saved_label.is_empty():
		var bytes := FileAccess.get_file_as_bytes(original_path)
		var file := FileAccess.open(Setup._path(source_label), FileAccess.WRITE)
		if file == null: _refuse("Cannot stage this map in the isolated owner profile."); return
		file.store_buffer(bytes)
		file.close()
		if FileAccess.get_sha256(Setup._path(source_label)) != original_sha: _refuse("Isolated Setup copy differs from its source."); return
	else:
		if Setup._path(saved_label).is_empty() or saved_label.to_lower().begins_with("gm-source-") or saved_sha.length() != 64:
			_refuse("Invalid saved-copy identity."); return
		if FileAccess.get_sha256(Setup._path(saved_label)) != saved_sha: _refuse("Named evaluation copy changed or is unavailable. Return to the collection and reopen My saved copies; only the current recorded bytes can reopen under this source identity."); return
		source_label = saved_label
		report["evaluation_copy"] = {"label":saved_label, "sha256":saved_sha, "identity":"owner-authored copy; original geometry equality is not asserted"}
	var source := Setup.read_named(source_label)
	if source.has("error"): _refuse(str(source.error)); return
	if not ClassDB.class_exists(&"CyberDemoBridge"): _refuse("The source-matched native CyberSand runtime did not load."); return
	var bridge: Object = ClassDB.instantiate(&"CyberDemoBridge")
	var policy: Dictionary = bridge.validate_liquid_policy(PackedInt32Array(source.setup.liquid_policy))
	bridge = null
	report["native_policy"] = policy
	if not policy.get("accepted", false): _refuse("Native policy refused: " + str(policy.get("refusal", {}))); return
	set_meta("cybersand_feature", "shared_workbench")
	host = load("res://main.tscn").instantiate()
	root.add_child(host)
	current_scene = host
	ui = host.shared_workbench
	if ui == null: _refuse("Ordinary Shared Workbench did not initialize."); return
	var navigator := root.get_node_or_null("FeatureNavigation")
	if navigator != null: navigator.set_process_input(false)
	controls = Controls.new()
	root.add_child(controls)
	controls.mount(self, host, ui)
	root.title = "GOLDMAPS · " + str(row.get("title", map_id)) + " · " + map_id
	root.close_requested.connect(request_close)
	if not await _wait(func() -> bool: return not ui.applied.is_empty() and not ui.busy(), 90000): _refuse("Initial Workbench preparation did not complete: " + str(host.microscenario_error)); return
	var before: int = host._physical_epoch
	ui._name.text = source_label
	if not ui.load_setup(): _refuse("Ordinary Workbench Load refused: " + str(ui.message)); return
	if not await _wait(func() -> bool:
		return not ui.busy() and not ui.applied.is_empty() and host.pending_microscenario_apply.is_empty() and host._physical_epoch > before and host._physical_terrain_ready and host.image != null and host.image.get_width() == int(source.setup.extent[0]) and host.image.get_height() == int(source.setup.extent[1]), 240000):
		_refuse("Native map preparation/adoption did not complete: " + str(host.microscenario_error)); return
	if not await _wait(func() -> bool: return host.latest_snapshot != null and host.last_uploaded_render_snapshot_serial >= host.latest_snapshot.render_snapshot_serial, 60000):
		_refuse("The acknowledged map did not publish its native material image."); return
	var native_plane := _native_plane()
	if native_plane.is_empty(): _refuse("Unsupported native material readback format."); return
	var material_sha := _sha_bytes(native_plane)
	var expected_material_sha := str(row.setup.get("material_plane_sha256", "")) if saved_label.is_empty() else _recipe_plane_sha(source.setup)
	if material_sha != expected_material_sha: _refuse("Loaded native material plane differs from the exact authored map. Open refused."); return
	var adopted: Array[Dictionary] = []
	for actor: Dictionary in source.setup.actors:
		if host.physical_actor_session == null: _refuse("The authored physical actor session was not adopted."); return
		var state: Dictionary = host.physical_actor_session.workbench_actor_state(int(actor.id))
		if state.get("model", "") != actor.model: _refuse("An authored actor failed native adoption."); return
		adopted.append({"id":int(actor.id), "model":str(actor.model)})
	loaded = true
	report["status"] = "LOADED"
	report["native_load"] = {"ordinary_workbench":true, "acknowledged_epoch":host._physical_epoch, "worker_failed":host.simulation_worker.has_failed(), "extent":source.setup.extent, "actors":source.setup.actors, "actors_adopted":adopted, "native_image_format":host.image.get_format(), "native_image_storage_sha256":_sha_bytes(host.image.get_data()), "material_plane_sha256":material_sha, "expected_material_plane_sha256":expected_material_sha, "full_grid_match":true, "native_tick":host.latest_snapshot.tick_index}
	report["source_sha256_after_load"] = FileAccess.get_sha256(original_path)
	save_name = "eval-" + map_id.left(21) + "-" + IO.timestamp().replace("T", "-")
	save_name = save_name.left(48)
	ui._name.text = save_name
	if saved_label.is_empty(): DirAccess.remove_absolute(Setup._path(source_label))
	ui.set_camera(2)
	controls.loaded_map()
	_write_report()
	print("GOLDMAPS_SESSION_LOADED " + JSON.stringify(report))
	if OS.get_environment("GOLDMAPS_QA_CAPTURE") == "1" and DisplayServer.get_name() != "headless":
		await capture_screenshot()
	if OS.get_environment("GOLDMAPS_QA_SMOKE") == "1":
		if OS.get_environment("GOLDMAPS_QA_EDIT") == "1":
			var before_cell := _native_cell(32, 32)
			var after_cell := 58 if before_cell == 28 else 28
			if saved_label.is_empty():
				if not ui.paint(Vector2i(32,32), after_cell): _refuse("QA ordinary paint request refused: " + str(ui.message)); return
				if not await _wait(func() -> bool:
					var paint_state: Dictionary = host.simulation_worker.paint_state()
					return not bool(paint_state.get("busy",false)) and not bool(paint_state.get("legacy_busy",false)) and _native_cell(32, 32) == after_cell, 60000):
					_refuse("QA native painted material was not acknowledged."); return
				report["qa_edit"] = {"center":[32,32], "before":before_cell, "after":after_cell, "radius":int(ui.applied.brush), "native_seen":true, "ordinary_workbench_paint":true}
			else:
				report["qa_edit_reopen"] = {"center":[32,32], "native_material":before_cell, "full_authored_grid_match":true}
		var tick: int = int(host.latest_snapshot.tick_index)
		if not ui.step_once() or not await _wait(func() -> bool: return int(host.latest_snapshot.tick_index) > tick, 30000): _refuse("QA smoke native progression failed."); return
		if not save_copy(save_name): _refuse("QA smoke ordinary authored save failed."); return
		var epoch: int = host._physical_epoch
		controls.confirm_close()
		await process_frame
		var close_visible: bool = controls.close_dialog.visible
		controls.close_dialog.get_cancel_button().pressed.emit()
		await process_frame
		var cancel_keeps_world: bool = not controls.close_dialog.visible and not closing and loaded and host._physical_epoch == epoch
		var preserved_hash := FileAccess.get_sha256(Setup._path(save_name))
		var overwrite_refused := not save_copy(save_name)
		var saved_bytes_preserved := FileAccess.get_sha256(Setup._path(save_name)) == preserved_hash
		controls.notice_dialog.get_ok_button().pressed.emit()
		report["qa_lifecycle"] = {"scope":"Programmatic execution of actual UI button handlers; no physical input or graphical acceptance inferred", "close_warning_visible":close_visible, "cancel_preserved_same_world":cancel_keeps_world, "existing_name_refused":overwrite_refused, "saved_copy_sha256_unchanged":saved_bytes_preserved}
		if controls.actor_composition_button == null: _refuse("QA ordinary Actor Composition entry was not found."); return
		controls.actor_composition_button.pressed.emit()
		await process_frame
		report.qa_lifecycle["actor_composition_opened"] = is_instance_valid(ui._actor_panel) and ui._actor_panel.visible
		if not report.qa_lifecycle.actor_composition_opened: _refuse("QA ordinary Actor Composition did not open."); return
		var replacement_checks: Array[Dictionary] = []
		for action: String in Controls.REPLACEMENT_ACTIONS:
			if not controls.replacement_buttons.has(action): _refuse("QA ordinary replacement control was not guarded: " + action); return
			controls.replacement_buttons[action].pressed.emit()
			await process_frame
			var warned: bool = controls.close_dialog.visible and host._physical_epoch == epoch and not closing
			controls.close_dialog.get_cancel_button().pressed.emit()
			await process_frame
			var retained: bool = not controls.close_dialog.visible and host._physical_epoch == epoch and loaded and not closing
			replacement_checks.append({"action":action, "warning_before_replacement":warned, "cancel_preserved_same_world":retained})
			if not warned or not retained: _refuse("QA ordinary replacement guard failed: " + action); return
		report.qa_lifecycle["ordinary_replacement_controls"] = replacement_checks
		ui._actor_panel.hide()
		if controls.flatten_button == null: _refuse("QA ordinary Flatten control was not guarded."); return
		var authored_before := _sha_bytes(JSON.stringify(ui.applied).to_utf8_buffer())
		var baseline_before := _sha_bytes(JSON.stringify(ui._material_baseline).to_utf8_buffer())
		controls.flatten_button.pressed.emit()
		await process_frame
		var flatten_check := {"warning_visible":controls.notice_dialog.visible, "same_world_epoch":host._physical_epoch == epoch, "authored_setup_unchanged":_sha_bytes(JSON.stringify(ui.applied).to_utf8_buffer()) == authored_before, "material_baseline_unchanged":_sha_bytes(JSON.stringify(ui._material_baseline).to_utf8_buffer()) == baseline_before, "no_flatten_pending":not ui.is_flatten_pending()}
		report.qa_lifecycle["flatten_guard"] = flatten_check
		controls.notice_dialog.get_ok_button().pressed.emit()
		for accepted: bool in flatten_check.values():
			if not accepted: _refuse("QA unsupported Flatten guard changed the authored World or format."); return
		var save_attribution: Dictionary = await _qa_ordinary_save_attribution(roster.data)
		report.qa_lifecycle["ordinary_save_attribution"] = save_attribution
		if save_attribution.has("error"): _refuse(str(save_attribution.error)); return
		if not close_visible or not cancel_keeps_world or not overwrite_refused or not saved_bytes_preserved:
			_refuse("QA close/cancel/saved-copy protection failed."); return
		controls.confirm_close()
		controls.save_return_button.pressed.emit()
		await process_frame
		report.qa_lifecycle["save_and_return_dialog_visible"] = controls.save_dialog.visible
		if not controls.save_dialog.visible: _refuse("QA Save a copy and return did not open its name dialog."); return
		controls.save_field.text = "qa-return-" + Crypto.new().generate_random_bytes(8).hex_encode()
		report.qa_lifecycle["return_copy_label"] = controls.save_field.text
		report["qa_completed"] = true
		_write_report()
		controls.save_dialog.get_ok_button().pressed.emit()
		if not closing: _refuse("QA Save a copy and return did not complete through the ordinary save boundary.")

func _qa_ordinary_save_attribution(roster: Dictionary) -> Dictionary:
	if controls.ordinary_save_button == null: return {"error":"QA ordinary Save button was not found."}
	var foreign: Dictionary = {}
	for candidate: Dictionary in roster.maps:
		if str(candidate.setup.sha256) != original_sha:
			foreign = candidate
			break
	if foreign.is_empty(): return {"error":"QA requires an independently identified existing-name fixture."}
	var foreign_label := "qa-foreign-" + Crypto.new().generate_random_bytes(8).hex_encode()
	var foreign_path: String = Setup._path(foreign_label)
	var fixture := FileAccess.open(foreign_path, FileAccess.WRITE)
	if fixture == null: return {"error":"QA could not create the isolated existing-name fixture."}
	fixture.store_buffer(FileAccess.get_file_as_bytes(package_root.path_join(str(foreign.setup.path))))
	fixture.close()
	var foreign_sha := FileAccess.get_sha256(foreign_path)
	if foreign_sha != str(foreign.setup.sha256): return {"error":"QA existing-name fixture differs from its exact foreign source."}
	var count_before: int = report.saved_copies.size()
	var banner_before: String = controls.banner.text
	ui._name.text = foreign_label
	# This exceeds the removed filename poll interval and exercises ordinary
	# frames with a different source's existing label but no Save action.
	await create_timer(1.2).timeout
	var typing_safe: bool = report.saved_copies.size() == count_before and not _has_saved_receipt(foreign_label)
	var banner_safe: bool = controls.banner.text == banner_before
	controls.ordinary_save_button.pressed.emit()
	await process_frame
	var protected: bool = controls.notice_dialog.visible and str(controls.notice_dialog.dialog_text).contains("already exists") and not _has_saved_receipt(foreign_label)
	var bytes_safe: bool = FileAccess.get_sha256(foreign_path) == foreign_sha
	controls.notice_dialog.get_ok_button().pressed.emit()
	var reserved_label := "GM-SOURCE-" + original_sha.left(20)
	var reserved_path: String = Setup._path(reserved_label)
	var reserved_before := FileAccess.get_sha256(reserved_path) if FileAccess.file_exists(reserved_path) else ""
	ui._name.text = reserved_label
	controls.ordinary_save_button.pressed.emit()
	await process_frame
	var reserved_after := FileAccess.get_sha256(reserved_path) if FileAccess.file_exists(reserved_path) else ""
	var reserved_refused: bool = controls.notice_dialog.visible and str(controls.notice_dialog.dialog_text).contains("source labels are reserved") and not _has_saved_receipt(reserved_label) and reserved_before == reserved_after
	controls.notice_dialog.get_ok_button().pressed.emit()
	var button_label := "qa-button-" + Crypto.new().generate_random_bytes(8).hex_encode()
	ui._name.text = button_label
	controls.ordinary_save_button.pressed.emit()
	await process_frame
	var button_saved := _has_saved_receipt(button_label)
	var keyboard_label := "qa-keyboard-" + Crypto.new().generate_random_bytes(8).hex_encode()
	ui._name.text = keyboard_label
	var previous_tool: int = ui._tool.selected
	ui._tool.select(0)
	var key := InputEventKey.new()
	key.keycode = KEY_S
	key.ctrl_pressed = true
	key.pressed = true
	Input.parse_input_event(key)
	await process_frame
	key.pressed = false
	Input.parse_input_event(key)
	await process_frame
	ui._tool.select(previous_tool)
	var keyboard_saved := _has_saved_receipt(keyboard_label)
	var receipt := {"scope":"Exact foreign-source bytes in an isolated developer fixture; actual ordinary Save button and dispatched Ctrl+S event; no physical keyboard claim", "foreign_source_map_id":foreign.id, "foreign_label":foreign_label, "foreign_setup_sha256":foreign_sha, "receipt_count_before_typing":count_before, "typing_existing_name_did_not_register":typing_safe, "typing_existing_name_left_banner":banner_safe, "existing_name_button_refused":protected, "foreign_file_sha256_unchanged":bytes_safe, "uppercase_reserved_name_refused":reserved_refused, "reserved_label":reserved_label, "reserved_before_sha256":reserved_before, "reserved_after_sha256":reserved_after, "ordinary_button_new_label_saved":button_saved, "ordinary_button_label":button_label, "keyboard_new_label_saved":keyboard_saved, "keyboard_label":keyboard_label}
	if not typing_safe or not banner_safe or not protected or not bytes_safe or not reserved_refused or not button_saved or not keyboard_saved:
		receipt["error"] = "QA ordinary Save attribution or existing-name protection failed."
	return receipt

func _has_saved_receipt(label: String) -> bool:
	var path: String = Setup._path(label)
	if path.is_empty() or not FileAccess.file_exists(path): return false
	var digest := FileAccess.get_sha256(path)
	for previous: Dictionary in report.get("saved_copies", []):
		if previous.label == label and previous.sha256 == digest: return true
	return false

func _native_cell(x: int, y: int) -> int:
	if host.image == null: return -1
	var stride := 2 if host.image.get_format() == Image.FORMAT_RG8 else 1
	return int(host.image.get_data()[(y * host.image.get_width() + x) * stride])

func _native_plane() -> PackedByteArray:
	if host.image == null or host.image.get_format() not in [Image.FORMAT_R8, Image.FORMAT_RG8]: return PackedByteArray()
	var bytes: PackedByteArray = host.image.get_data()
	if host.image.get_format() == Image.FORMAT_R8: return bytes
	var plane := PackedByteArray()
	plane.resize(host.image.get_width() * host.image.get_height())
	for index: int in plane.size(): plane[index] = bytes[index * 2]
	return plane

func _recipe_plane_sha(recipe: Dictionary) -> String:
	var w := int(recipe.extent[0])
	var h := int(recipe.extent[1])
	var expected := PackedByteArray()
	expected.resize(w*h)
	for stamp: Array in recipe.edits:
		if stamp.size() == 5:
			for y: int in range(int(stamp[1]), int(stamp[1])+int(stamp[3])):
				for x: int in range(int(stamp[0]), int(stamp[0])+int(stamp[2])): expected[y*w+x] = int(stamp[4])
		else:
			var cx := int(stamp[0])
			var cy := int(stamp[1])
			var radius := int(stamp[2])
			for y: int in range(maxi(0,cy-radius), mini(h,cy+radius+1)):
				for x: int in range(maxi(0,cx-radius), mini(w,cx+radius+1)):
					if (x-cx)*(x-cx)+(y-cy)*(y-cy) <= radius*radius: expected[y*w+x] = int(stamp[3])
	return _sha_bytes(expected)

func _sha_bytes(bytes: PackedByteArray) -> String:
	var hash := HashingContext.new()
	hash.start(HashingContext.HASH_SHA256)
	hash.update(bytes)
	return hash.finish().hex_encode()

func _wait(predicate: Callable, timeout: int) -> bool:
	var deadline := Time.get_ticks_msec() + timeout
	while Time.get_ticks_msec() < deadline:
		if closing: return false
		if predicate.call(): return true
		if host != null and host.simulation_worker != null and host.simulation_worker.has_failed(): return false
		await process_frame
	return false

func save_copy(label: String) -> bool:
	if not loaded or closing: return false
	if Setup._path(label).is_empty() or label.to_lower().begins_with("gm-source-"):
		controls.notice("Choose 1–48 letters, digits, underscores or hyphens; source labels are reserved.")
		return false
	if FileAccess.file_exists(Setup._path(label)):
		controls.notice("That named copy already exists. Choose a new name to preserve the existing authored copy.")
		return false
	ui._name.text = label
	if not ui.save_setup(): controls.notice(str(ui.message)); return false
	_record_saved(label)
	return true

func _record_saved(label: String) -> void:
	var path: String = Setup._path(label)
	if path.is_empty() or label.to_lower().begins_with("gm-source-") or not FileAccess.file_exists(path): return
	var digest := FileAccess.get_sha256(path)
	for previous: Dictionary in report.get("saved_copies", []):
		if previous.label == label and previous.sha256 == digest: return
	report.saved_copies.append({"label":label, "sha256":digest, "path":ProjectSettings.globalize_path(path), "saved_at":Time.get_datetime_string_from_system(true) + "Z", "semantics":"authored starting layout; current dynamic state is not serialized"})
	_write_report()
	if controls != null: controls.saved_copy(label)

func capture_screenshot() -> void:
	if not loaded: return
	if DisplayServer.get_name() == "headless": controls.notice("A rendered window is required for a screenshot."); return
	var destination := package_root.path_join("userdata/reviews/screenshots/" + session_id + "-" + str(Time.get_ticks_msec()) + ".png")
	DirAccess.make_dir_recursive_absolute(destination.get_base_dir())
	await RenderingServer.frame_post_draw
	var image := root.get_texture().get_image()
	if image.save_png(destination) != OK: controls.notice("Could not save the screenshot."); return
	report.screenshots.append({"path":destination, "sha256":FileAccess.get_sha256(destination), "kind":"actual rendered Workbench viewport", "renderer":RenderingServer.get_video_adapter_name(), "display_driver":DisplayServer.get_name(), "window_size":[root.size.x,root.size.y], "window_position":[root.position.x,root.position.y], "content_scale_size":[root.content_scale_size.x,root.content_scale_size.y], "viewport_size":[int(root.get_visible_rect().size.x),int(root.get_visible_rect().size.y)], "capture_size":[image.get_width(),image.get_height()], "physical_owner_acceptance":"not_inferred", "captured_at":Time.get_datetime_string_from_system(true) + "Z"})
	_write_report()
	if OS.get_environment("GOLDMAPS_QA_CAPTURE") != "1": controls.notice("Screenshot saved to userdata/reviews/screenshots/ and linked to this exact session.")

func request_close() -> void:
	if closing: return
	if controls == null:
		finish_close()
	else:
		controls.confirm_close()

func finish_close() -> void:
	if closing: return
	closing = true
	report["status"] = "QA_SAVED" if report.get("qa_completed",false) else ("RETURNED" if loaded else "CANCELLED_BEFORE_LOAD")
	if report.get("qa_completed",false): report["returned_via_close_confirmation"] = true
	report["closed_at"] = Time.get_datetime_string_from_system(true) + "Z"
	if not original_path.is_empty(): report["source_sha256_on_close"] = FileAccess.get_sha256(original_path)
	_write_report()
	quit(0)

func _write_report() -> void:
	if package_root.is_empty() or not _safe_id(session_id, 130): return
	var reason := IO.atomic_json(package_root.path_join("userdata/sessions/" + session_id + ".json"), report)
	if not reason.is_empty(): push_error("GOLDMAPS session receipt write failed: " + reason)

func _refuse(reason: String) -> void:
	report["status"] = "REFUSED"
	report["error"] = reason
	_write_report()
	print("GOLDMAPS_SESSION_REFUSED " + JSON.stringify(report))
	if DisplayServer.get_name() == "headless": quit(2); return
	var dialog := AcceptDialog.new()
	dialog.title = "GOLDMAPS · map not opened"
	dialog.dialog_text = reason + "\n\nThe original collection files were not changed. Close this window to return to the browser."
	dialog.confirmed.connect(func() -> void: quit(2))
	dialog.close_requested.connect(func() -> void: quit(2))
	root.add_child(dialog)
	dialog.popup_centered_clamped(Vector2i(760, 320), 0.95)
