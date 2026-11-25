extends SceneTree

const Retrieval = preload("res://architectural_retrieval.gd")

func _initialize() -> void:
    var args := OS.get_cmdline_user_args()
    var cards_path := ""
    var output_path := ""
    for arg: String in args:
        if arg.begins_with("--cards="): cards_path = arg.trim_prefix("--cards=")
        if arg.begins_with("--output="): output_path = arg.trim_prefix("--output=")
    if cards_path.is_empty() or output_path.is_empty():
        push_error("Need --cards=ABSOLUTE_JSON --output=NEW_RECEIPT_JSON")
        quit(2)
        return
    if FileAccess.file_exists(output_path):
        push_error("Refuse to overwrite consumer compatibility evidence")
        quit(2)
        return
    var raw := FileAccess.get_file_as_string(cards_path)
    var cards: Variant = JSON.parse_string(raw)
    var result := {"schema":"goldmaps.existing-consumer-adapter-check.v1", "consumer_source":"fe2395c7060dae736dc2e5dc8d1e4e050b2d2e52", "consumer_file_sha256":FileAccess.get_sha256("res://architectural_retrieval.gd"), "cards_sha256":raw.sha256_text(), "godot_version":Engine.get_version_info(), "scope":"Existing read-only consumer script validation and retrieval; no native module harvest, scene mutation or model inference", "validation":{}, "queries":[], "negative_guards":{}}
    if not cards is Dictionary:
        result.validation = {"ok":false,"errors":["not a dictionary"]}
    else:
        result.validation = Retrieval.validate_corpus(cards)
        var query_cases: Array = [
            {"text":"suspended roof supports and a clear lower service route","required_parts":["beam_truss","service_gallery"],"excluded_families":["bioindustrial","civic","vessel_dock"],"limit":3},
            {"text":"opposed banks and a protected open fault","topologies":["opposed_banks"],"excluded_families":["bioindustrial","civic","vessel_dock"],"limit":3}
        ]
        for query: Dictionary in query_cases:
            var found: Dictionary = Retrieval.retrieve(query, [], cards)
            result.queries.append({"query":query,"result":found})
        var unsafe: Dictionary = cards.duplicate(true)
        unsafe.authority.execution_authority = true
        result.negative_guards["execution_permission_refused"] = not Retrieval.validate_corpus(unsafe).ok
        var changed: Dictionary = cards.duplicate(true)
        changed.cards[0].qualification.direct_module_import = "ACCEPTED"
        result.negative_guards["map_as_module_refused"] = not Retrieval.validate_corpus(changed).ok
        var no_native: Dictionary = Retrieval.retrieve({"text":"suspended roof","require_native_geometry":true,"limit":3}, [], cards)
        result.negative_guards["no_native_module_authority_inferred"] = no_native.ok and no_native.results.is_empty()
    var passed: bool = bool(result.validation.get("ok",false))
    for q: Dictionary in result.queries:
        passed = passed and q.result.ok and not q.result.results.is_empty()
    for guard: bool in result.negative_guards.values():
        passed = passed and guard
    result["pass"] = passed
    var file := FileAccess.open(output_path,FileAccess.WRITE)
    file.store_string(JSON.stringify(result,"\t")+"\n")
    print("GOLDMAPS_ADAPTER_CHECK ",JSON.stringify({"pass":passed,"queries":result.queries.size(),"negative_guards":result.negative_guards}))
    quit(0 if passed else 1)
