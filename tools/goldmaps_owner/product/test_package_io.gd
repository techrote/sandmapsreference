extends SceneTree

# Executed with the browser project so its exact delivered shared boundary is
# exercised. Fixture files are confined to the caller's isolated user:// data.
const IO = preload("res://package_io.gd")
var checks: Array[Dictionary] = []

func _initialize() -> void:
	_run.call_deferred()

func _check(name: String, passed: bool) -> void:
	checks.append({"name":name, "pass":passed})

func _run() -> void:
	var args := OS.get_cmdline_user_args()
	if args.size() != 1:
		push_error("Pass one absolute collection.v1.json path after --")
		quit(2); return
	var source := IO.bounded_json(args[0])
	if source.has("error"): push_error(source.error); quit(2); return
	var baseline: Dictionary = source.data
	_check("actual81logical70source25goldroster", IO.collection_error(baseline).is_empty())
	var altered := baseline.duplicate(true)
	altered.schema = "unknown"
	_check("unknown_collection_schema_refused", not IO.collection_error(altered).is_empty())
	altered = baseline.duplicate(true)
	altered.maps[0].owner_accepted = true
	_check("automatic_owner_acceptance_refused", not IO.collection_error(altered).is_empty())
	altered = baseline.duplicate(true)
	altered.maps[0].setup = null
	_check("null_setup_refused", not IO.collection_error(altered).is_empty())
	altered = baseline.duplicate(true)
	altered.maps[0].comparison = "not a dictionary"
	_check("malformed_comparison_refused", not IO.collection_error(altered).is_empty())
	altered = baseline.duplicate(true)
	altered.maps[0].setup.dimensions[0] = 2048.5
	_check("fractional_extent_refused", not IO.collection_error(altered).is_empty())
	altered = baseline.duplicate(true)
	altered.maps[0].setup.dimensions[0] = 8192
	_check("oversized_extent_refused", not IO.collection_error(altered).is_empty())
	altered = baseline.duplicate(true)
	altered.maps[1].id = altered.maps[0].id
	_check("duplicate_logical_identity_refused", not IO.collection_error(altered).is_empty())
	altered = baseline.duplicate(true)
	altered.maps[0].collections.erase("gold25")
	_check("missing_gold_nominee_refused", not IO.collection_error(altered).is_empty())
	for path: String in ["../outside.json", "collection/../outside.json", "/absolute.json", "C:/escape.json", "collection\\setup.json", "CON.json", "collection/COM1.txt", "name\nfile.json", "name?.json"]:
		_check("unsafe_path_refused:" + path.c_escape(), not IO.safe_relative(path))
	_check("ordinary_relative_path_admitted", IO.safe_relative("collection/setups/abcdef.json"))
	var reviews := {"schema":"goldmaps.owner-reviews.v1", "decisions":{}}
	_check("empty_pending_review_store_admitted", IO.review_error(reviews).is_empty())
	reviews.decisions["gold-125"] = "invalid"
	_check("malformed_review_record_refused", not IO.review_error(reviews).is_empty())
	reviews.decisions["gold-125"] = {"map_id":"gold-125", "status":"Reviewed / classification recorded", "classification":"Platinum", "preferred_variant":"", "playability_notes":"", "presentation_notes":"", "setup_sha256":"", "engine_head":"", "recorded_at":""}
	_check("neutral_completed_classification_status_admitted", IO.review_error(reviews).is_empty())
	var destination := "user://goldmaps-io-contract/replace.json"
	var first := IO.atomic_json(destination, {"revision":1, "value":"first"})
	var second := IO.atomic_json(destination, {"revision":2, "value":"second"})
	var observed := IO.bounded_json(destination)
	_check("atomic_initial_write", first.is_empty())
	_check("atomic_existing_path_replacement", second.is_empty() and observed.get("data", {}).get("revision", 0) == 2)
	var passed := true
	for check: Dictionary in checks: passed = passed and bool(check.pass)
	print("GOLDMAPS_IO_CONTRACT " + JSON.stringify({"pass":passed, "checks":checks, "count":checks.size(), "os":OS.get_name(), "user_data_dir":OS.get_user_data_dir(), "godot":Engine.get_version_info()}))
	quit(0 if passed else 1)
