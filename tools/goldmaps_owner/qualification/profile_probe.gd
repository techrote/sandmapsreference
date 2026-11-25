extends SceneTree

# Observe the platform's real user:// resolution before staging any Setup.
func _initialize() -> void:
	var actual := OS.get_user_data_dir().replace("\\", "/").simplify_path()
	var expected := OS.get_environment("GOLDMAPS_EXPECTED_PROFILE_ROOT").replace("\\", "/").simplify_path()
	var compare_actual := actual.to_lower() if OS.get_name() == "Windows" else actual
	var compare_expected := expected.to_lower() if OS.get_name() == "Windows" else expected
	var isolated := not expected.is_empty() and compare_actual.begins_with(compare_expected + "/")
	var error := OK
	var default_policy: Array = []
	var default_admission: Dictionary = {}
	if ClassDB.class_exists(&"CyberDemoBridge"):
		var bridge: Object = ClassDB.instantiate(&"CyberDemoBridge")
		var words: PackedInt32Array = bridge.default_liquid_policy()
		default_policy = Array(words)
		default_admission = bridge.validate_liquid_policy(words)
		bridge = null
	if isolated:
		error = DirAccess.make_dir_recursive_absolute(actual.path_join("workbench"))
	print("GOLDMAPS_PROFILE ", JSON.stringify({
		"user_data_dir":actual, "expected_root":expected, "isolated":isolated,
		"workbench_dir":actual.path_join("workbench"), "mkdir_error":error,
		"godot_version":Engine.get_version_info(), "os":OS.get_name(),
		"display_server":DisplayServer.get_name(), "process_id":OS.get_process_id(),
		"native_bridge":ClassDB.class_exists(&"CyberDemoBridge"),
		"native_default_policy":default_policy,
		"native_default_admission":default_admission,
		"project_path":ProjectSettings.globalize_path("res://")
	}))
	quit(0 if isolated and error == OK and ClassDB.class_exists(&"CyberDemoBridge") else 1)
