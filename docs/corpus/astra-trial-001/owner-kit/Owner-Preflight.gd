extends SceneTree

# Evaluation-only script. It does not edit accepted source or create a World.
func _initialize() -> void:
	var workbench_dir := OS.get_user_data_dir().path_join("workbench")
	var error := DirAccess.make_dir_recursive_absolute(workbench_dir)
	var result := {
		"programme": "GOLD-ASTRA-001",
		"engine_source": "662df51cd8409a52332fa7ef15d06d8ab8945aed",
		"godot_version": Engine.get_version_info(),
		"user_data_dir": OS.get_user_data_dir(),
		"workbench_dir": workbench_dir,
		"native_bridge_class_registered": ClassDB.class_exists("CyberDemoBridge"),
		"workbench_directory_error": error,
		"scope": "Path discovery and class registration only; no map load, gameplay or owner acceptance."
	}
	print("GOLD_ASTRA_OWNER_PREFLIGHT=" + JSON.stringify(result))
	quit(0 if error == OK and ClassDB.class_exists("CyberDemoBridge") else 1)
