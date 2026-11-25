extends SceneTree

# Delivery qualification derivative of frozen native_probe.gd; scientific predecessor unchanged.
# Temporary standalone Godot 4.7 SceneTree script, outside accepted CyberSand source.
# Uses the real Workbench/worker/GDExtension/Rapier path; never edits source or geometry.
# Two independent processes: CYBERSAND_ADMISSION_PHASE=load and =reopen.
const Setup = preload("res://scripts/workbench_setup.gd")
const MAX_MS := 240000

class FocusHost extends "res://scripts/main.gd":
	# Headless runner cannot own a focused OS window; preserves actual keyboard dispatch.
	func _actor_window_has_focus() -> bool:
		return true
	var route_active := false
	var route_target := Vector2.ZERO
	var route_speed := 35.0
	var route_submissions := 0
	var route_refusals := 0
	func _publish_workbench_keyboard() -> void:
		if not route_active:
			super._publish_workbench_keyboard()
			return
		if physical_actor_session == null or shared_workbench.pilot_slot < 0 or paused:
			return
		var observed: Dictionary = physical_actor_session.workbench_actor_state(shared_workbench.pilot_id())
		if observed.is_empty(): return
		var position: Vector2 = observed.position
		var velocity: Vector2 = observed.linear_velocity
		var displacement := route_target - position
		var desired_velocity := (displacement * 1.1).limit_length(route_speed)
		var desired_acceleration := ((desired_velocity-velocity)*2.3).limit_length(90.0)
		var force_direction := desired_acceleration + velocity*0.22 - Vector2(0.0,float(observed.gravity))
		var desired_angle := clampf(atan2(force_direction.x,-force_direction.y),-1.0,1.0)
		var angle: float = float(observed.rotation)
		var desired_angular_velocity := clampf(wrapf(desired_angle-angle,-PI,PI)*3.8,-4.0,4.0)
		var throttle := clampf(force_direction.dot(Vector2.UP.rotated(angle))/180.0,0.0,1.0)
		var action := {"move":Vector2(desired_angular_velocity/8.0,-throttle),
			"aim":Vector2.RIGHT,"effort":1.0,"trim":0.0,"primary":false,"secondary":false,"auxiliary":false}
		var accepted: bool = physical_actor_session.submit_workbench_action(shared_workbench.pilot_id(),action,
			{"q":false,"e":false,"s":false,"boost":false},false)
		route_submissions += 1
		if not accepted: route_refusals += 1

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
	var actual_material := PackedByteArray()
	actual_material.resize(w*h)
	for i: int in range(w*h): actual_material[i] = actual[i*channels]
	var expected_hash := HashingContext.new()
	expected_hash.start(HashingContext.HASH_SHA256)
	expected_hash.update(expected)
	var native_hash := HashingContext.new()
	native_hash.start(HashingContext.HASH_SHA256)
	native_hash.update(actual_material)
	return {"ok":mismatch == 0,"pixels":w*h,"mismatches":mismatch,
		"expected_plane_sha256":expected_hash.finish().hex_encode(),
		"native_plane_sha256":native_hash.finish().hex_encode(),
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
		"process_id":OS.get_process_id(),"saved_label":saved,
		"user_data_dir":OS.get_user_data_dir(),"display_server":DisplayServer.get_name()}
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
	var policy_bridge: Object = ClassDB.instantiate(&"CyberDemoBridge")
	var policy_result: Dictionary = policy_bridge.validate_liquid_policy(PackedInt32Array(recipe.liquid_policy))
	policy_bridge = null
	report["native_policy"] = policy_result
	if not _need(bool(policy_result.get("accepted",false)),"native liquid policy refused: "+str(policy_result.get("refusal",{}))):
		_finish(); return
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
	report["authored_actor_count"] = recipe.actors.size()
	var actor_checks: Array = []
	for actor: Dictionary in recipe.actors:
		var observed: Dictionary = {} if host.physical_actor_session == null else host.physical_actor_session.workbench_actor_state(int(actor.id))
		actor_checks.append({"id":actor.id,"authored_model":actor.model,"adopted_model":observed.get("model",""),"adopted":observed.get("model","") == actor.model})
	report["all_authored_actors"] = actor_checks
	report["all_authored_actors_adopted"] = actor_checks.all(func(check:Dictionary)->bool: return bool(check.adopted))
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
		report.actor_adopted = bool(report.all_authored_actors_adopted)
	_need(bool(report.actor_adopted) and bool(report.all_authored_actors_adopted),"authored native actors were not adopted")
	if not OS.get_environment("GOLDMAPS_ROUTE_FILE").is_empty():
		if report.actor_adopted:
			await _route_probe(midge_id)
		_finish(); return
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
	if bool(report.actor_adopted) and midge_id >= 0 and phase == "load":
		var contact_start_tick: int = int(host.physical_actor_session.tick)
		var contact_tick_limit := 900
		if OS.get_environment("GOLDMAPS_CONTACT_TICK_LIMIT") == "1800":
			contact_tick_limit = 1800
		var initial_900_tick_observation: Dictionary = {}
		# Expanded Gold corpus includes active liquid maps whose native ticks are
		# slower than the frozen eight-map suite. Increase wall allowance only;
		# retain the original 900-tick maximum and actual contact witness gate.
		var contact_deadline: int = Time.get_ticks_msec() + 90000
		var contact_witnesses: Array = []
		var max_contacts := 0
		if host.paused: ui.toggle_pause()
		while int(host.physical_actor_session.tick) < contact_start_tick + contact_tick_limit and Time.get_ticks_msec() < contact_deadline:
			await process_frame
			if host.simulation_worker.has_failed(): break
			if contact_tick_limit > 900 and initial_900_tick_observation.is_empty() and int(host.physical_actor_session.tick) >= contact_start_tick+900:
				var first_state: Dictionary = host.physical_actor_session.workbench_actor_state(midge_id)
				var first_position: Vector2 = first_state.position
				initial_900_tick_observation = {"tick":int(host.physical_actor_session.tick),"collision_observed":not contact_witnesses.is_empty(),"position":[first_position.x,first_position.y]}
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
		var contact_end_state: Dictionary = host.physical_actor_session.workbench_actor_state(midge_id)
		var contact_end_position: Vector2 = contact_end_state.position
		report["collision_probe"] = {"method":"gravity-only after controlled W release; unchanged spawn and map; real PhysicsDirectBodyState2D contacts", "wall_budget_ms":90000,"tick_budget":contact_tick_limit,"initial_900_tick_observation":initial_900_tick_observation,"end_position":[contact_end_position.x,contact_end_position.y],"start_tick":contact_start_tick,"end_tick":int(host.physical_actor_session.tick),"max_contacts":max_contacts,"witnesses":contact_witnesses,"worker_failed":host.simulation_worker.has_failed()}
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


func _route_probe(midge_id: int) -> void:
	var route_path := OS.get_environment("GOLDMAPS_ROUTE_FILE")
	var parsed: Variant = JSON.parse_string(FileAccess.get_file_as_string(route_path))
	if not _need(parsed is Dictionary and parsed.get("waypoints") is Array,"route fixture schema"):
		return
	var fixture: Dictionary = parsed
	var waypoints: Array = fixture.waypoints
	if not _need(waypoints.size() >= 2 and waypoints.size() <= 4096,"route fixture capacity"):
		return
	if not _need(str(fixture.setup_sha256) == str(report.setup_sha256),"route/input SHA256 mismatch"):
		return
	if not _need(ui.select_instance(midge_id),"route pilot selection"):
		return
	var actor_start: Dictionary = host.physical_actor_session.workbench_actor_state(midge_id)
	var starting_position: Vector2 = actor_start.position
	var first := Vector2(float(waypoints[0][0]),float(waypoints[0][1]))
	if not _need(starting_position.distance_to(first) <= 1.0,"route starts at unchanged authored spawn"):
		return
	var tick_start: int = int(host.physical_actor_session.tick)
	var wall_start := Time.get_ticks_msec()
	var max_ticks: int = int(fixture.get("max_ticks",7200))
	var max_wall: int = int(fixture.get("max_wall_ms",240000))
	var radius: float = float(fixture.get("waypoint_radius",7.0))
	var reached := 1
	var last_progress_tick := tick_start
	var previous_tick := -1
	var last_sample_tick := -1
	var trace: Array = []
	var contacts: Array = []
	var speed_max := 0.0
	var submitted_start: int = host.route_submissions
	var failure := ""
	host.route_speed = float(fixture.get("speed_limit",35.0))
	host.route_target = Vector2(float(waypoints[1][0]),float(waypoints[1][1]))
	host.route_active = true
	if host.paused: ui.toggle_pause()
	while reached < waypoints.size():
		await process_frame
		var tick: int = int(host.physical_actor_session.tick)
		if tick == previous_tick: continue
		previous_tick = tick
		if host.simulation_worker.has_failed(): failure = "native_worker_failed"; break
		if tick-tick_start >= max_ticks: failure = "tick_budget"; break
		if Time.get_ticks_msec()-wall_start >= max_wall: failure = "wall_budget"; break
		var state: Dictionary = host.physical_actor_session.workbench_actor_state(midge_id)
		var position: Vector2 = state.position
		var velocity: Vector2 = state.linear_velocity
		speed_max = maxf(speed_max,velocity.length())
		var distance := position.distance_to(host.route_target)
		if distance <= radius:
			reached += 1
			last_progress_tick = tick
			if reached < waypoints.size():
				host.route_target = Vector2(float(waypoints[reached][0]),float(waypoints[reached][1]))
		if tick-last_sample_tick >= 12 or distance <= radius:
			trace.append({"tick":tick,"position":[position.x,position.y],"velocity":[velocity.x,velocity.y],
				"rotation":float(state.rotation),"next_waypoint":reached,"distance":distance})
			last_sample_tick = tick
		for body: RigidBody2D in host.physical_actor_session.bodies():
			var direct: PhysicsDirectBodyState2D = PhysicsServer2D.body_get_direct_state(body.get_rid())
			if direct == null or direct.get_contact_count() == 0: continue
			if contacts.size() < 128:
				var p: Vector2 = direct.get_contact_collider_position(0)
				var n: Vector2 = direct.get_contact_local_normal(0)
				contacts.append({"tick":tick,"position":[p.x,p.y],"normal":[n.x,n.y],"next_waypoint":reached})
		if tick-last_progress_tick >= int(fixture.get("stuck_ticks",900)):
			failure = "no_waypoint_progress"; break
	host.route_active = false
	if not host.paused: ui.toggle_pause()
	var final: Dictionary = host.physical_actor_session.workbench_actor_state(midge_id)
	var final_position: Vector2 = final.position
	report["route"] = {"id":fixture.id,"setup_id":fixture.setup_id,"fixture_sha256":FileAccess.get_sha256(route_path),
		"controller":"bounded observation-to-thrust and angular-rate feedback; actual human action lease API",
		"position_or_velocity_setters":false,"geometry_edits":false,"authored_spawn_unchanged":true,
		"waypoints_total":waypoints.size(),"waypoints_reached":reached,"completed":reached==waypoints.size(),
		"failure":failure,"start_tick":tick_start,"end_tick":int(host.physical_actor_session.tick),
		"wall_ms":Time.get_ticks_msec()-wall_start,"speed_limit":host.route_speed,"observed_max_speed":speed_max,
		"controller_submissions":host.route_submissions-submitted_start,"controller_refusals":host.route_refusals,
		"final_position":[final_position.x,final_position.y],"contacts":contacts,"trace":trace,
		"claim_limit":"One bounded scripted pilot and precomputed route; completion is not human racing legibility, complete map acceptance, or operational machinery."}
