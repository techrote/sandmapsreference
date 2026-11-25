extends SceneTree
const Setup = preload("res://scripts/workbench_setup.gd")

# Read-only native envelope admission. This does not load a map or qualify play.
func _initialize() -> void:
	var input_path := OS.get_environment("GOLDMAPS_POLICY_INPUTS")
	var inputs = JSON.parse_string(FileAccess.get_file_as_string(input_path))
	if not inputs is Array or not ClassDB.class_exists(&"CyberDemoBridge"):
		push_error("Native policy inputs or bridge unavailable")
		quit(1)
		return
	var bridge: Object = ClassDB.instantiate(&"CyberDemoBridge")
	var results: Array = []
	for item: Dictionary in inputs:
		var path: String = item.path
		var source_hash := FileAccess.get_sha256(path)
		if source_hash != item.setup_sha256:
			push_error("Source changed before native policy validation")
			quit(1)
			return
		var setup = JSON.parse_string(FileAccess.get_file_as_string(path))
		if not setup is Dictionary or not setup.get("liquid_policy") is Array:
			push_error("Source policy is unavailable")
			quit(1)
			return
		var result: Dictionary = bridge.validate_liquid_policy(PackedInt32Array(setup.liquid_policy))
		var setup_error: String = Setup.validate(setup)
		results.append({"id":item.id,"pr":item.pr,"head":item.head,
			"setup_sha256":source_hash,"policy_words":setup.liquid_policy.size(),
			"workbench_schema_accepted":setup_error.is_empty(),"workbench_setup_error":setup_error,
			"validation":result,"source_unchanged":FileAccess.get_sha256(path)==source_hash})
	print("GOLDMAPS_POLICY_PROBE ", JSON.stringify(results))
	bridge = null
	quit()
