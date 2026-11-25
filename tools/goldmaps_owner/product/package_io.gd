extends RefCounted

# Additive GOLDMAPS delivery boundary. No source Setups or engine files are edited.
const MANIFEST := "payload-manifest.v1.json"
const COLLECTION := "collection/collection.v1.json"
const QUALIFICATION := "collection/delivery-qualification.v1.json"
const MUTABLE_ROOTS := ["userdata/", "browser/.godot/", "runtime/project/.godot/"]
const METADATA := [MANIFEST, "payload-manifest.sha256"]
const MAX_JSON := 32 * 1024 * 1024
const GOLD_PRS := [106,109,125,130,131,136,143,146,147,148,150,153,155,159,163,168,174,175,176,179,182,184,193,197,207]

static func safe_relative(value: Variant) -> bool:
	if not value is String or value.is_empty() or value.length() > 500:
		return false
	if value.begins_with("/") or value.contains("\\") or value.contains(":"):
		return false
	for character: String in value:
		if character.unicode_at(0) < 32 or character.unicode_at(0) == 127:
			return false
	for part: String in value.split("/"):
		if part.is_empty() or part in [".", ".."] or part.ends_with(".") or part.ends_with(" "):
			return false
		var stem := part.split(".")[0].to_upper()
		if stem in ["CON", "PRN", "AUX", "NUL", "COM1", "COM2", "COM3", "COM4", "COM5", "COM6", "COM7", "COM8", "COM9", "LPT1", "LPT2", "LPT3", "LPT4", "LPT5", "LPT6", "LPT7", "LPT8", "LPT9"]:
			return false
		if part.contains("*") or part.contains("?") or part.contains('"') or part.contains("<") or part.contains(">") or part.contains("|"):
			return false
	return true

static func bounded_json(path: String, limit: int = MAX_JSON) -> Dictionary:
	var file := FileAccess.open(path, FileAccess.READ)
	if file == null: return {"error":"Cannot read " + path.get_file()}
	if file.get_length() > limit: return {"error":"JSON file exceeds the bounded size: " + path.get_file()}
	var parser := JSON.new()
	if parser.parse(file.get_as_text()) != OK or not parser.data is Dictionary:
		return {"error":"Invalid JSON object: " + path.get_file()}
	return {"data":parser.data}

static func mutable_path(path: String) -> bool:
	for prefix: String in MUTABLE_ROOTS:
		if path.begins_with(prefix): return true
	return false

static func walk(root: String, relative: String = "") -> Dictionary:
	var dir := DirAccess.open(root.path_join(relative))
	if dir == null: return {"error":"Cannot inspect package directory: " + relative}
	var files: Array[String] = []
	dir.include_hidden = true
	dir.include_navigational = false
	dir.list_dir_begin()
	var name := dir.get_next()
	while not name.is_empty():
		var path := relative.path_join(name) if not relative.is_empty() else name
		if dir.is_link(name):
			dir.list_dir_end()
			return {"error":"Package symlinks are not supported: " + path}
		if dir.current_is_dir():
			if not mutable_path(path + "/"):
				var nested := walk(root, path)
				if nested.has("error"): return nested
				files.append_array(nested.files)
		elif not mutable_path(path):
			files.append(path)
		name = dir.get_next()
	dir.list_dir_end()
	return {"files":files}

static func manifest_rows(root: String) -> Dictionary:
	var sidecar := FileAccess.open(root.path_join("payload-manifest.sha256"), FileAccess.READ)
	if sidecar == null or sidecar.get_length() > 256:
		return {"error":"Payload manifest checksum is missing or invalid."}
	var sidecar_parts := sidecar.get_as_text().strip_edges().split(" ", false)
	var expected_hash := sidecar_parts[0] if not sidecar_parts.is_empty() else ""
	if expected_hash.length() != 64 or not expected_hash.is_valid_hex_number(false) or expected_hash != FileAccess.get_sha256(root.path_join(MANIFEST)):
		return {"error":"Payload manifest SHA-256 mismatch."}
	var parsed := bounded_json(root.path_join(MANIFEST))
	if parsed.has("error"): return parsed
	var document: Dictionary = parsed.data
	if document.get("schema", "") != "goldmaps.owner-payload.v1" or not document.get("files") is Array:
		return {"error":"Unsupported payload manifest schema."}
	if str(document.get("engine_head", "")).length() != 40 or not str(document.get("engine_head", "")).is_valid_hex_number(false):
		return {"error":"Payload manifest lacks the exact engine source identity."}
	var expected: Dictionary = {}
	var folded: Dictionary = {}
	for row: Variant in document.files:
		if not row is Dictionary or not safe_relative(row.get("path")):
			return {"error":"Unsafe or malformed payload entry."}
		var path: String = row.path
		if mutable_path(path) or path in METADATA:
			return {"error":"Manifest includes reserved mutable/metadata path: " + path}
		if folded.has(path.to_lower()): return {"error":"Duplicate/case-colliding payload path: " + path}
		if not row.get("sha256") is String or row.sha256.length() != 64 or not row.get("bytes") is float and not row.get("bytes") is int:
			return {"error":"Payload row lacks a bounded byte identity: " + path}
		if not is_finite(float(row.bytes)) or float(row.bytes) != floorf(float(row.bytes)) or float(row.bytes) < 0 or float(row.bytes) > 1024 * 1024 * 1024:
			return {"error":"Invalid payload byte length: " + path}
		if not str(row.sha256).is_valid_hex_number(false): return {"error":"Invalid payload SHA-256: " + path}
		folded[path.to_lower()] = true
		expected[path] = row
	var found := walk(root)
	if found.has("error"): return found
	for path: String in found.files:
		if path not in METADATA and not expected.has(path):
			return {"error":"Unexpected static package file: " + path}
	if found.files.size() < expected.size(): return {"error":"Package files are missing."}
	return {"document":document, "rows":document.files}

static func verify_row(root: String, row: Dictionary) -> String:
	var path: String = root.path_join(str(row.path))
	var file := FileAccess.open(path, FileAccess.READ)
	if file == null: return "Missing payload: " + str(row.path)
	if file.get_length() != int(row.bytes): return "Payload size mismatch: " + str(row.path)
	file.close()
	if FileAccess.get_sha256(path) != str(row.sha256): return "Payload SHA-256 mismatch: " + str(row.path)
	return ""

static func profile_error(root: String) -> String:
	var expected := root.path_join("userdata").simplify_path().replace("\\", "/").trim_suffix("/") + "/"
	var observed := OS.get_user_data_dir().simplify_path().replace("\\", "/").trim_suffix("/") + "/"
	if OS.get_name() == "Windows":
		expected = expected.to_lower()
		observed = observed.to_lower()
	if not observed.begins_with(expected):
		return "Portable profile isolation failed. Expected userdata inside this kit, observed: " + OS.get_user_data_dir()
	return ""

static func configure_child_environment(root: String) -> void:
	var bindings := {"APPDATA":"roaming", "LOCALAPPDATA":"local", "XDG_DATA_HOME":"data", "XDG_CONFIG_HOME":"config", "XDG_CACHE_HOME":"cache", "TMP":"temp", "TEMP":"temp", "TMPDIR":"temp"}
	for variable: String in bindings:
		var path := root.path_join("userdata").path_join(str(bindings[variable]))
		DirAccess.make_dir_recursive_absolute(path)
		OS.set_environment(variable, path)
	OS.set_environment("GOLDMAPS_PACKAGE_ROOT", root)

static func prepare_bootstrap(root: String) -> String:
	# These are the three byte-exact, repository-supported portable bootstrap
	# files. Normal runtime does not import editor assets or generate sidecars.
	var target := root.path_join("runtime/project/.godot")
	if DirAccess.make_dir_recursive_absolute(target) != OK:
		return "Cannot create the local Godot runtime cache."
	for name: String in [".gdignore", "extension_list.cfg", "global_script_class_cache.cfg"]:
		var source := root.path_join("runtime/bootstrap").path_join(name)
		if not FileAccess.file_exists(source): return "Portable source bootstrap is missing: " + name
		var result := DirAccess.copy_absolute(source, target.path_join(name))
		if result != OK: return "Cannot prepare the portable Godot runtime: " + error_string(result)
	return ""

static func atomic_json(path: String, value: Dictionary) -> String:
	if DirAccess.make_dir_recursive_absolute(path.get_base_dir()) != OK:
		return "Cannot create the local data folder."
	var temp := path + "." + Crypto.new().generate_random_bytes(8).hex_encode() + ".tmp"
	var file := FileAccess.open(temp, FileAccess.WRITE)
	if file == null: return "Cannot write local record."
	file.store_string(JSON.stringify(value, "  ") + "\n")
	file.flush()
	var error := file.get_error()
	file.close()
	if error == OK: error = DirAccess.rename_absolute(temp, path)
	if error != OK:
		DirAccess.remove_absolute(temp)
		return "Cannot commit local record: " + error_string(error)
	return ""

static func find_map(collection: Dictionary, id: String) -> Dictionary:
	for row: Variant in collection.get("maps", []):
		if row is Dictionary and row.get("id", "") == id: return row
	return {}

static func collection_error(document: Dictionary) -> String:
	if document.get("schema", "") != "goldmaps.owner-collection.v1" or not document.get("maps") is Array:
		return "Unsupported collection schema."
	if document.maps.size() < 70 or document.maps.size() > 256:
		return "Collection logical roster is outside its bounded population."
	var ids: Dictionary = {}
	var gold: Array[int] = []
	var corpus: Dictionary = {}
	for row: Variant in document.maps:
		if not row is Dictionary or not row.get("id") is String or row.id.is_empty() or row.id.length() > 80:
			return "Malformed logical map identity."
		for character: String in row.id:
			if character not in "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_": return "Unsafe logical map identity."
		if ids.has(str(row.id).to_lower()): return "Duplicate/case-colliding logical map identity: " + str(row.id)
		ids[str(row.id).to_lower()] = true
		if not row.get("title") is String or not row.get("variant_role") is String or not row.get("tags") is Array or not row.get("collections") is Array:
			return "Malformed display metadata: " + str(row.id)
		if row.title.length() > 1000 or row.tags.size() > 256: return "Unbounded display metadata: " + str(row.id)
		for tag: Variant in row.tags:
			if not tag is String or tag.length() > 2000: return "Malformed architecture tag: " + str(row.id)
		for name: Variant in row.collections:
			if name not in ["gold25", "portraits", "astra", "corpus", "policy"]: return "Unknown collection view."
		for key: String in ["source", "setup", "preview", "art", "native", "owner"]:
			if not row.get(key) is Dictionary: return "Malformed " + key + " metadata: " + str(row.id)
		for key: String in ["comparison", "source_static_qualification", "derived_source"]:
			if row.get(key) != null and not row.get(key) is Dictionary: return "Malformed optional " + key + " metadata."
		if not row.get("owner_accepted") is bool or not row.owner.get("accepted") is bool or row.owner_accepted != false or row.owner.accepted != false or row.owner.get("status") != "pending" or row.owner.get("classification") != null:
			return "Bundled maps must remain unaccepted. Owner choices belong only in the local review file."
		var source: Dictionary = row.source
		if source.get("repo") != "techrote/sandmapsreference" or not source.get("commit") is String or str(source.commit).length() != 40 or not str(source.commit).is_valid_hex_number(false) or not safe_relative(source.get("path")):
			return "Source identity is not exact and repository-pinned: " + str(row.id)
		if not source.get("pr") is float and not source.get("pr") is int: return "Invalid source PR identity."
		if float(source.pr) != floorf(float(source.pr)) or float(source.pr) < 1: return "Invalid source PR number."
		var setup: Dictionary = row.setup
		if setup.get("schema") != 2 or not safe_relative(setup.get("path")) or not str(setup.path).begins_with("collection/setups/"):
			return "Unsupported bundled Setup: " + str(row.id)
		for key: String in ["sha256", "material_plane_sha256"]:
			if not setup.get(key) is String or str(setup[key]).length() != 64 or not str(setup[key]).is_valid_hex_number(false): return "Invalid Setup digest: " + str(row.id)
		if not setup.get("dimensions") is Array or setup.dimensions.size() != 2: return "Invalid map dimensions."
		for dimension: Variant in setup.dimensions:
			if not dimension is float and not dimension is int: return "Invalid map dimension type."
			if not is_finite(float(dimension)) or float(dimension) != floorf(float(dimension)) or int(dimension) < 512 or int(dimension) > 2048 or int(dimension) % 64 != 0: return "Unbounded map dimensions."
		if not safe_relative(row.preview.get("path")): return "Invalid source-preview path."
		if "gold25" in row.collections: gold.append(int(source.pr))
		if "corpus" in row.collections:
			if not row.get("source_corpus_id") is String: return "Invalid corpus source identity type."
			var corpus_id := str(row.get("source_corpus_id", ""))
			if corpus_id.is_empty() or corpus.has(corpus_id): return "Duplicate/missing corpus source identity."
			corpus[corpus_id] = true
	gold.sort()
	if gold != GOLD_PRS or corpus.size() != 70: return "The frozen Gold25 or 70-source roster is incomplete or changed."
	return ""

static func review_error(document: Dictionary) -> String:
	if document.get("schema", "") != "goldmaps.owner-reviews.v1" or not document.get("decisions") is Dictionary or document.decisions.size() > 256:
		return "Unsupported or unbounded local review store."
	for key: Variant in document.decisions:
		var value: Variant = document.decisions[key]
		if not key is String or not value is Dictionary or value.get("map_id", "") != key: return "Malformed local review identity."
		if value.get("status", "") not in ["Pending / not reviewed", "Gold nominee confirmed", "Gold nominee declined", "Needs review", "Reviewed / classification recorded"]:
			return "Unknown local review status."
		if value.get("classification", "") not in ["Unclassified", "Gold", "Platinum", "Pyrite", "No-change", "Other"]:
			return "Unknown local classification."
		for field: String in ["preferred_variant", "playability_notes", "presentation_notes", "setup_sha256", "engine_head", "recorded_at"]:
			if not value.get(field) is String or str(value[field]).length() > 20000: return "Malformed local review field."
	return ""

static func playable_reason(row: Dictionary, qualification: Dictionary, engine_head: String) -> String:
	var setup: Dictionary = row.get("setup", {})
	if not safe_relative(setup.get("path", "")) or str(setup.get("sha256", "")).length() != 64:
		return "Reference only: no playable Setup payload is bundled."
	if qualification.get("schema", "") != "goldmaps.owner-qualification.v1" or qualification.get("engine_head", "") != engine_head:
		return "Current delivery qualification does not match the bundled engine."
	var evidence: Dictionary = qualification.get("setups", {}).get(str(setup.sha256), {})
	if evidence.get("status", "") == "REFUSED_INVALID_SOURCE":
		return "Native policy refused this original. Its separately identified descendant can be reviewed instead."
	if evidence.get("status", "") != "QUALIFIED_HEADLESS":
		return "Reference only: this exact Setup has no completed native qualification for the delivered runtime."
	return ""

static func timestamp() -> String:
	return Time.get_datetime_string_from_system(true).replace(":", "").replace("-", "")
