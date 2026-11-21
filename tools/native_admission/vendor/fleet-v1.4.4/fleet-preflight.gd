extends SceneTree

# Execute under the owner-supplied Godot project, with the real installed GDExtension.
# This does not qualify an individual canvas; it only discovers runtime capabilities.
func _initialize() -> void:
    var present := ClassDB.class_exists(&"CyberDemoBridge")
    var capacity := -1
    if present:
        var bridge: Object = ClassDB.instantiate(&"CyberDemoBridge")
        if bridge != null and bridge.has_method(&"workbench_start_rectangle_capacity"):
            capacity = int(bridge.call(&"workbench_start_rectangle_capacity"))
    var report := {
        "godot_version": Engine.get_version_info().get("string", ""),
        "godot_userdir": ProjectSettings.globalize_path("user://workbench"),
        "native_bridge_available": present,
        "reported_rectangle_capacity": capacity,
        "godot_platform": OS.get_name()
    }
    print("FLEET_PREFLIGHT ", JSON.stringify(report))
    quit(0 if present and capacity > 0 else 2)
