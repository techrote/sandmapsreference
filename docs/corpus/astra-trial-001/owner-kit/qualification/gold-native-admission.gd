extends SceneTree

# Temporary standalone Godot 4.7 SceneTree script, outside accepted CyberSand source.
# Uses the real Workbench/worker/GDExtension/Rapier path; never edits source or geometry.
# Two independent processes: CYBERSAND_ADMISSION_PHASE=load and =reopen.
const Setup = preload("res://scripts/workbench_setup.gd")
const MAX_MS := 240000

class FocusHost extends "res://scripts/main.gd":
	# Headless runner cannot own a focused OS window; preserves actual keyboard dispatch.
	func _actor_window_has_focus() -> bool:
		return true

var host: Control
var ui
var errors: Array[String] = []
var report: Dictionary = {}

func _initialize() -> void:
	_run.call_deferred()

func _need(condition: bool, message: String) -> bool:
	if not condition:
		errors.append(message)
		push_error("CANVAS_NATIVE_FAIL " + message)
	return condition

func _wait(predicate: Callable, message: String, max_ms: int = MAX_MS) -> bool:
	var deadline := Time.get_ticks_msec() + max_ms
	while Time.get_ticks_msec() < deadline and not predicate.call():
		if host != null and host.simulation_worker != null and host.simulation_worker.has_failed():
			break
		await process_frame
	return _need(bool(predicate.call()), "timeout " + message + " / " + str(host.microscenario_error))

func _image_matches(recipe: Dictionary) -> Dictionary:
	var w := int(recipe.extent[0])
	var h := int(recipe.extent[1])
	if host.image == null or host.image.get_width() != w or host.image.get_height() != h:
		return {"ok":false, "reason":"native image dimensions"}
	var fmt: int = host.image.get_format()
	if fmt != Image.FORMAT_R8 and fmt != Image.FORMAT_RG8:
		return {"ok":false,"reason":"unexpected image format " + str(fmt)}
	var channels := 2 if fmt == Image.FORMAT_RG8 else 1
	var actual: PackedByteArray = host.image.get_data()
	if actual.size() != w * h * channels:
		return {"ok":false,"reason":"native image storage size"}
	var expected := PackedByteArray()
	expected.resize(w * h)
	for stamp: Array in recipe.edits:
		if stamp.size() == 5:
			for y: int in range(int(stamp[1]),int(stamp[1]) + int(stamp[3])):
				var offset := y * w
				for x: int in range(int(stamp[0]),int(stamp[0]) + int(stamp[2])):
					expected[offset + x] = int(stamp[4])
		elif stamp.size() == 4:
			var cx := int(stamp[0])
			var cy := int(stamp[1])
			var radius := int(stamp[2])
			for y: int in range(maxi(0, cy-radius), mini(h, cy+radius+1)):
				var offset := y*w
				for x: int in range(maxi(0,cx-radius), mini(w,cx+radius+1)):
					if (x-cx)*(x-cx)+(y-cy)*(y-cy) <= radius*radius:
						expected[offset+x] = int(stamp[3])
		else:
			return {"ok":false,"reason":"invalid edit arity"}
	var mismatch := 0
	var first := -1
	for i: int in range(w*h):
		if expected[i] != actual[i*channels]:
			mismatch += 1
			if first == -1: first = i
	return {"ok":mismatch == 0,"pixels":w*h,"mismatches":mismatch,
		"first_mismatch":[first%w,first/w] if first >= 0 else [],"format":fmt}

func _key(code: Key, pressed: bool) -> void:
	var event := InputEventKey.new()
	event.keycode = code
	event.pressed = pressed
	Input.parse_input_event(event)
	Input.flush_buffered_events()

func _run() -> void:
	var label := OS.get_environment("CYBERSAND_ADMISSION_LABEL")
	var phase := OS.get_environment("CYBERSAND_ADMISSION_PHASE")
	var saved := OS.get_environment("CYBERSAND_ADMISSION_SAVED_LABEL")
	report = {"label":label,"phase":phase,"version":Engine.get_version_info().get("string",""),
		"native_bridge":false,"load":false,"full_grid":false,"actor_adopted":false,
		"physics_tick":false,"midge_drive":false,"collision_observed":false,"fresh_reopen":false,
		"process_id":OS.get_process_id(),"saved_label":saved}
	if not _need(label.length() >= 1 and saved.length() >= 1 and phase in ["load","reopen"],"environment labels/phase"):
		_finish(); return
	set_meta("cybersand_feature","shared_workbench")
	host = load("res://main.tscn").instantiate()
	host.set_script(FocusHost)
	root.add_child(host)
	ui = host.shared_workbench
	if not _need(ui != null,"actual Workbench scene"): _finish(); return
	if not await _wait(func()->bool: return not ui.applied.is_empty() and not ui.busy(),"initial native Workbench",60000):
		_finish(); return
	var active := saved if phase == "reopen" else label
	# CI adapter adds custody fields; the Fleet native contract below is unchanged.
	report["active_label"] = active
	report["setup_sha256"] = FileAccess.get_sha256(Setup._path(active))
	var read: Dictionary = Setup.read_named(active)
	if not _need(read.has("setup"),"source setup read " + str(read.get("error",""))):
		_finish(); return
	var recipe: Dictionary = read.setup
	report["rectangles"] = recipe.edits.size()
	report["extent"] = recipe.extent
	report["source_parse"] = Setup.validate(recipe).is_empty()
	if not _need(bool(report.source_parse),"source parser in actual Godot"): _finish(); return
	var before: int = host._physical_epoch
	ui._name.text = active
	if not _need(ui.load_setup(),"real Load start request / " + ui.message): _finish(); return
	var installed := await _wait(func()->bool:
		return ui != null and not ui.applied.is_empty() and not ui.busy() \
			and host.pending_microscenario_apply.is_empty() \
			and host._physical_epoch > before and host._physical_terrain_ready \
			and host.tower_context.has("workbench_gcr") \
			and host.image != null and host.image.get_width() == int(recipe.extent[0]) \
			and host.image.get_height() == int(recipe.extent[1]),
		"actual native Workbench preparation/adoption")
	if not installed: _finish(); return
	report.native_bridge = true
	report.load = true
	report["acknowledged_epoch"] = host._physical_epoch
	report["worker_failed"] = host.simulation_worker.has_failed()
	# Wait for actual published material snapshot, not only the prepared owner transaction.
	var publication_ready := await _wait(func()->bool:
		return host.latest_snapshot != null and host.last_uploaded_render_snapshot_serial >= host.latest_snapshot.render_snapshot_serial,
		"native published material image",30000)
	report["published_image"] = publication_ready
	if not publication_ready: _finish(); return
	var pixels: Dictionary = _image_matches(recipe)
	report["grid_check"] = pixels
	report.full_grid = bool(pixels.get("ok",false))
	_need(bool(report.full_grid),"full committed material-grid/native image parity: " + str(pixels))
	var midge_id := -1
	for actor: Dictionary in recipe.actors:
		if str(actor.model) == "midge":
			midge_id = int(actor.id)
			break
	report["midge_id"] = midge_id
	if midge_id >= 0 and host.physical_actor_session != null:
		var state: Dictionary = host.physical_actor_session.workbench_actor_state(midge_id)
		report.actor_adopted = state.get("model","") == "midge" and host.physical_actor_session.bodies().size() > 0
		if report.actor_adopted:
			var body: RigidBody2D = host.physical_actor_session.bodies()[0]
			report["rapier_space_valid"] = PhysicsServer2D.body_get_space(body.get_rid()).is_valid()
			report.actor_adopted = bool(report.rapier_space_valid)
		var actor_position: Vector2 = state.get("position",Vector2.ZERO)
		report["initial_actor_position"] = [actor_position.x,actor_position.y]
	else:
		report.actor_adopted = false
	_need(bool(report.actor_adopted),"real Rapier Midge actor was not adopted")
	if phase == "reopen":
		report.fresh_reopen = bool(report.load and report.full_grid and report.actor_adopted)
		_finish(); return
	var tick: int = int(host.latest_snapshot.tick_index)
	if _need(ui.step_once(),"native single-step accepted"):
		report.physics_tick = await _wait(func()->bool:
			return int(host.latest_snapshot.tick_index) >= tick + 1 and not host.simulation_worker.has_failed(),
			"actual native simulation tick",30000)
	if midge_id >= 0 and bool(report.physics_tick) and ui.select_instance(midge_id):
		var original: Dictionary = host.physical_actor_session.workbench_actor_state(midge_id)
		var start: Vector2 = original.get("position",Vector2.ZERO)
		if ui.toggle_pause():
			var start_tick := int(host.physical_actor_session.tick)
			if await _wait(func()->bool: return int(host.physical_actor_session.tick) >= start_tick + 4,"neutral rearm",30000):
				var drive_state: Dictionary = host.physical_actor_session.workbench_actor_state(midge_id)
				var drive_start: Vector2 = drive_state.get("position",Vector2.ZERO)
				report["drive_start"] = [drive_start.x,drive_start.y]
				report["drive_key"] = "W"
				_key(KEY_W,true)
				var drive_tick := int(host.physical_actor_session.tick)
				await _wait(func()->bool: return int(host.physical_actor_session.tick) >= drive_tick + 20,"actual Midge controlled ticks",45000)
				_key(KEY_W,false)
				var moved: Dictionary = host.physical_actor_session.workbench_actor_state(midge_id)
				var end: Vector2 = moved.get("position",Vector2.ZERO)
				report["midge_displacement_cells"] = start.distance_to(end)
				report["midge_end"] = [end.x,end.y]
				report["drive_end"] = [end.x,end.y]
				report["drive_ticks_elapsed"] = int(host.physical_actor_session.tick) - drive_tick
				report["directed_up_displacement_cells"] = drive_start.y - end.y
				# Current CI strengthens the donor distance-only observation: W must
				# produce measurable upward travel over at least twenty controlled ticks.
				report.midge_drive = drive_start.y - end.y > 0.05 and int(report.drive_ticks_elapsed) >= 20
				# No collision PASS from merely having a terrain collider.
				report.collision_observed = false
			ui.toggle_pause()
	# GOLD-ASTRA-001 addition: observe real native/Rapier contact after the
	# original controlled-drive probe, with unchanged exact saved spawn/geometry.
	# Ground proximity alone is not accepted as a collision witness.
	if bool(report.actor_adopted) and phase == "load":
		var contact_start_tick: int = int(host.physical_actor_session.tick)
		var contact_deadline: int = Time.get_ticks_msec() + 30000
		var contact_witnesses: Array = []
		var max_contacts := 0
		if host.paused: ui.toggle_pause()
		while int(host.physical_actor_session.tick) < contact_start_tick + 900 and Time.get_ticks_msec() < contact_deadline:
			await process_frame
			if host.simulation_worker.has_failed(): break
			for body: RigidBody2D in host.physical_actor_session.bodies():
				var direct: PhysicsDirectBodyState2D = PhysicsServer2D.body_get_direct_state(body.get_rid())
				if direct == null: continue
				max_contacts = maxi(max_contacts,direct.get_contact_count())
				for ci: int in direct.get_contact_count():
					var p: Vector2 = direct.get_contact_collider_position(ci)
					var n: Vector2 = direct.get_contact_local_normal(ci)
					contact_witnesses.append({"tick":int(host.physical_actor_session.tick),"collider_rid_valid":direct.get_contact_collider(ci).is_valid(),"point":[p.x,p.y],"normal":[n.x,n.y]})
					break
			if not contact_witnesses.is_empty(): break
		if not host.paused: ui.toggle_pause()
		report["collision_observed"] = not contact_witnesses.is_empty()
		report["collision_probe"] = {"method":"gravity-only after controlled W release; unchanged spawn and map; real PhysicsDirectBodyState2D contacts", "start_tick":contact_start_tick,"end_tick":int(host.physical_actor_session.tick),"max_contacts":max_contacts,"witnesses":contact_witnesses,"worker_failed":host.simulation_worker.has_failed()}
		report["collision_claim_limit"] = "Observed contact on this local fixture; not route completion or playfeel qualification."
	# Write only to a distinct new label; NEVER overwrite the source-pinned fixture.
	ui._name.text = saved
	if not _need(not FileAccess.file_exists(Setup._path(saved)),"refuse overwrite of pre-existing admission save"): _finish(); return
	if not _need(ui.save_setup(),"save admission copy / " + ui.message): _finish(); return
	report["saved_label"] = saved
	report["save_readback"] = Setup.read_named(saved).has("setup")
	_need(bool(report.save_readback),"saved starting setup readback")
	_finish()

func _finish() -> void:
	_key(KEY_W,false)
	report["errors"] = errors
	print("CANVAS_NATIVE_EVIDENCE ",JSON.stringify(report))
	if host != null:
		host.queue_free()
	await process_frame
	await process_frame
	quit(1 if not errors.is_empty() else 0)
