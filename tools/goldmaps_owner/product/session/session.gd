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
var last_save_check := 0

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
	row = IO.find_map(roster.data, map_id)
	if row.is_empty(): _refuse("Logical map identity was not found."); return
	var reason := IO.playable_reason(row, qualification.data, str(manifest.engine_head))
	if not reason.is_empty(): _refuse(reason); return
	original_path = package_root.path_join(str(row.setup.path))
	original_sha = str(row.setup.sha256)
	if FileAccess.get_sha256(original_path) != original_sha: _refuse("Selected Setup bytes no longer match the collection."); return
	report["engine_head"] = manifest.engine_head
	report["source"] = row.get("source", {})
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
		if Setup._path(saved_label).is_empty() or saved_label.begins_with("gm-source-") or saved_sha.length() != 64:
			_refuse("Invalid saved-copy identity."); return
		if FileAccess.get_sha256(Setup._path(saved_label)) != saved_sha: _refuse("Named evaluation copy changed or is unavailable. Reopen its current copy through ordinary Workbench Load if that change was intentional."); return
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
		report["status"] = "QA_SAVED"
		_write_report()
		quit(0)

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
	if Setup._path(label).is_empty() or label.begins_with("gm-source-"):
		controls.notice("Choose 1–48 letters, digits, underscores or hyphens; source labels are reserved.")
		return false
	if FileAccess.file_exists(Setup._path(label)):
		controls.notice("That named copy already exists. Choose a new name to preserve it; ordinary Workbench Save remains available when you intentionally update your own copy.")
		return false
	ui._name.text = label
	if not ui.save_setup(): controls.notice(str(ui.message)); return false
	_record_saved(label)
	return true

func _record_saved(label: String) -> void:
	var path: String = Setup._path(label)
	if path.is_empty() or label.begins_with("gm-source-") or not FileAccess.file_exists(path): return
	var digest := FileAccess.get_sha256(path)
	for previous: Dictionary in report.get("saved_copies", []):
		if previous.label == label and previous.sha256 == digest: return
	report.saved_copies.append({"label":label, "sha256":digest, "path":ProjectSettings.globalize_path(path), "saved_at":Time.get_datetime_string_from_system(true) + "Z", "semantics":"authored starting layout; current dynamic state is not serialized"})
	_write_report()
	if controls != null: controls.saved_copy(label)

func check_ordinary_save() -> void:
	if loaded and not closing and Time.get_ticks_msec() - last_save_check > 1000:
		last_save_check = Time.get_ticks_msec()
		_record_saved(str(ui._name.text))

func capture_screenshot() -> void:
	if not loaded: return
	if DisplayServer.get_name() == "headless": controls.notice("A rendered window is required for a screenshot."); return
	var destination := package_root.path_join("userdata/reviews/screenshots/" + session_id + "-" + str(Time.get_ticks_msec()) + ".png")
	DirAccess.make_dir_recursive_absolute(destination.get_base_dir())
	await RenderingServer.frame_post_draw
	var image := root.get_texture().get_image()
	if image.save_png(destination) != OK: controls.notice("Could not save the screenshot."); return
	report.screenshots.append({"path":destination, "sha256":FileAccess.get_sha256(destination), "kind":"actual owner-rendered Workbench viewport", "captured_at":Time.get_datetime_string_from_system(true) + "Z"})
	_write_report()
	controls.notice("Screenshot saved to userdata/reviews/screenshots/ and linked to this exact session.")

func request_close() -> void:
	if closing: return
	if controls == null:
		finish_close()
	else:
		controls.confirm_close()

func finish_close() -> void:
	if closing: return
	closing = true
	report["status"] = "RETURNED" if loaded else "CANCELLED_BEFORE_LOAD"
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
