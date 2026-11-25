extends SceneTree

# Independent hostile-fixture runner against the actual delivered browser IO.
# All fixture writes are performed by the Python driver in a temporary folder.
const IO = preload("res://package_io.gd")

func _initialize() -> void:
	_run.call_deferred()

func _run() -> void:
	var path := OS.get_environment("GOLDMAPS_BOUNDARY_FIXTURES")
	var parsed := IO.bounded_json(path)
	if parsed.has("error"):
		push_error(str(parsed.error)); quit(2); return
	var records: Array = []
	var passed := true
	for fixture: Dictionary in parsed.data.cases:
		var inspected := IO.manifest_rows(str(fixture.root))
		var error := str(inspected.get("error", ""))
		if error.is_empty():
			for row: Dictionary in inspected.rows:
				error = IO.verify_row(str(fixture.root), row)
				if not error.is_empty(): break
		var accepted := error.is_empty()
		var correct := accepted == bool(fixture.expected_accepted)
		passed = passed and correct
		records.append({"id":fixture.id,"expected_accepted":fixture.expected_accepted,
			"actual_accepted":accepted,"error":error,"pass":correct})
	print("GOLDMAPS_PACKAGE_BOUNDARY ", JSON.stringify({"schema":"goldmaps.runtime-package-boundary.v1",
		"pass":passed,"cases":records,"os":OS.get_name(),"godot":Engine.get_version_info(),
		"claim":"Actual delivered GDScript manifest and per-file verifier; no native map execution or owner adoption."}))
	quit(0 if passed else 1)
