extends Control

const IO = preload("res://package_io.gd")
const COLLECTION_NAMES := {"gold25":"Gold25 nominees", "portraits":"Repaired portraits", "astra":"Astra comparisons", "corpus":"All 70 sources", "policy":"Policy descendants", "all":"All variants"}
const DECISIONS := ["Pending / not reviewed", "Gold nominee confirmed", "Gold nominee declined", "Needs review"]
const CLASSES := ["Unclassified", "Gold", "Platinum", "Pyrite", "No-change", "Other"]
const BG := Color("10151f")
const SURFACE := Color("192230")
const GOLD := Color("e8c97c")
const MUTED := Color("a4b3c7")

var package_root := ""
var manifest: Dictionary = {}
var collection: Dictionary = {}
var qualification: Dictionary = {}
var reviews: Dictionary = {"schema":"goldmaps.owner-reviews.v1", "decisions":{}}
var filtered: Array[Dictionary] = []
var selected: Dictionary = {}
var active_collection := "gold25"
var verified := false
var active_pid := -1
var active_id := ""
var active_session := ""
var last_pid_check := 0
var texture_cache: Dictionary = {}
var tabs := HFlowContainer.new()
var search := LineEdit.new()
var orientation := OptionButton.new()
var eligibility := OptionButton.new()
var review_filter := OptionButton.new()
var family := OptionButton.new()
var map_list := ItemList.new()
var status := Label.new()
var title_label: Label
var source_label := RichTextLabel.new()
var preview := TextureRect.new()
var preview_caption: Label
var detail := RichTextLabel.new()
var open_button: Button
var copies_button: Button
var count_label := Label.new()
var error_dialog := AcceptDialog.new()
var zoom_dialog := Window.new()
var compare_dialog := Window.new()
var decision_dialog := Window.new()
var guide_dialog := AcceptDialog.new()
var copies_dialog := AcceptDialog.new()
var discard_review_dialog := ConfirmationDialog.new()
var decision_baseline := ""
var decision_status := OptionButton.new()
var decision_class := OptionButton.new()
var preferred := LineEdit.new()
var play_notes := TextEdit.new()
var presentation_notes := TextEdit.new()
var review_notice: Label

func _ready() -> void:
	package_root = OS.get_environment("GOLDMAPS_PACKAGE_ROOT").simplify_path()
	get_window().min_size = Vector2i(1000, 680)
	get_tree().auto_accept_quit = false
	get_window().close_requested.connect(_request_browser_close)
	_build_ui()
	_start.call_deferred()

func _box(parent: Node, vertical: bool = true) -> BoxContainer:
	var node: BoxContainer = VBoxContainer.new() if vertical else HBoxContainer.new()
	node.add_theme_constant_override("separation", 10)
	parent.add_child(node)
	return node

func _label(parent: Node, value: String, font_size: int = 15, color: Color = Color.WHITE) -> Label:
	var label := Label.new()
	label.text = value
	label.add_theme_font_size_override("font_size", font_size)
	label.add_theme_color_override("font_color", color)
	label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	parent.add_child(label)
	return label

func _button(parent: Node, value: String, action: Callable) -> Button:
	var button := Button.new()
	button.text = value
	button.custom_minimum_size.y = 38
	button.pressed.connect(action)
	parent.add_child(button)
	return button

func _panel_style(color: Color, border: Color = Color("344255")) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = color
	style.set_corner_radius_all(7)
	style.set_border_width_all(1)
	style.border_color = border
	style.content_margin_left = 12
	style.content_margin_right = 12
	style.content_margin_top = 8
	style.content_margin_bottom = 8
	return style

func _build_ui() -> void:
	var theme_value := Theme.new()
	theme_value.default_font_size = 16
	theme_value.set_stylebox("normal", "Button", _panel_style(SURFACE))
	theme_value.set_stylebox("hover", "Button", _panel_style(Color("283447"), GOLD))
	theme_value.set_stylebox("pressed", "Button", _panel_style(Color("35405a"), GOLD))
	theme_value.set_stylebox("focus", "Button", _panel_style(Color(0,0,0,0), GOLD))
	theme = theme_value
	var background := ColorRect.new()
	background.color = BG
	background.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	background.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(background)
	var margin := MarginContainer.new()
	margin.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	for side: String in ["left", "right", "top", "bottom"]: margin.add_theme_constant_override("margin_" + side, 24)
	add_child(margin)
	var column := _box(margin)
	var heading := _box(column, false)
	var wordmark := _box(heading)
	wordmark.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	_label(wordmark, "GOLDMAPS", 34, GOLD)
	_label(wordmark, "A native CyberSand collection · browse, play, compare, decide", 15, MUTED)
	_button(heading, "Decision guide", _show_guide)
	_button(heading, "Export my reviews", _export_reviews)
	column.add_child(tabs)
	for key: String in COLLECTION_NAMES:
		var button := _button(tabs, COLLECTION_NAMES[key], func() -> void:
			active_collection = key
			_refresh_list())
		button.set_meta("collection", key)
	var filters := HFlowContainer.new()
	filters.add_theme_constant_override("h_separation", 8)
	filters.add_theme_constant_override("v_separation", 6)
	column.add_child(filters)
	search.placeholder_text = "Search maps, architecture, source PR or variant…  Ctrl+F"
	search.custom_minimum_size = Vector2(390, 38)
	search.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	search.text_changed.connect(func(_value: String) -> void: _refresh_list())
	filters.add_child(search)
	for text: String in ["Any orientation", "Landscape", "Portrait", "Square"]: orientation.add_item(text)
	for text: String in ["Any native status", "Playable in this kit", "Reference / refused"]: eligibility.add_item(text)
	for text: String in ["Any review status", "Not reviewed", "Reviewed locally"]: review_filter.add_item(text)
	family.add_item("Any family")
	family.fit_to_longest_item = false
	family.custom_minimum_size.x = 190
	for picker: OptionButton in [orientation, eligibility, review_filter, family]:
		picker.custom_minimum_size.y = 38
		picker.item_selected.connect(func(_index: int) -> void: _refresh_list())
		filters.add_child(picker)
	var content := HSplitContainer.new()
	content.size_flags_vertical = Control.SIZE_EXPAND_FILL
	content.split_offset = 495
	column.add_child(content)
	var catalogue := _box(content)
	catalogue.custom_minimum_size.x = 340
	catalogue.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	count_label.text = "Verifying the portable collection…"
	count_label.add_theme_color_override("font_color", MUTED)
	catalogue.add_child(count_label)
	map_list.size_flags_vertical = Control.SIZE_EXPAND_FILL
	map_list.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	map_list.max_columns = 2
	map_list.fixed_column_width = 225
	map_list.fixed_icon_size = Vector2i(210, 126)
	map_list.icon_mode = ItemList.ICON_MODE_TOP
	map_list.max_text_lines = 4
	map_list.add_theme_constant_override("v_separation", 14)
	map_list.item_selected.connect(_select_index)
	map_list.item_activated.connect(func(index: int) -> void:
		_select_index(index)
		_open_selected())
	catalogue.add_child(map_list)
	var navigation := _box(catalogue, false)
	_button(navigation, "← Previous", func() -> void: _step(-1))
	_button(navigation, "Next →", func() -> void: _step(1))
	_label(navigation, "Arrow keys · Enter opens", 13, MUTED)
	var details_scroll := ScrollContainer.new()
	details_scroll.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	details_scroll.custom_minimum_size.x = 520
	details_scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	content.add_child(details_scroll)
	var details := _box(details_scroll)
	details.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	title_label = _label(details, "Preparing your collection", 25, GOLD)
	source_label.bbcode_enabled = true
	source_label.fit_content = true
	source_label.scroll_active = false
	source_label.custom_minimum_size.y = 36
	details.add_child(source_label)
	preview.custom_minimum_size = Vector2(0, 255)
	preview.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	preview.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	preview.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	preview.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	preview.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	preview.gui_input.connect(func(event: InputEvent) -> void:
		if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT: _show_zoom())
	details.add_child(preview)
	preview_caption = _label(details, "", 13, MUTED)
	var actions := HFlowContainer.new()
	actions.add_theme_constant_override("h_separation", 8)
	actions.add_theme_constant_override("v_separation", 8)
	details.add_child(actions)
	open_button = _button(actions, "Open in Workbench", _open_selected)
	open_button.add_theme_color_override("font_color", GOLD)
	open_button.disabled = true
	_button(actions, "Compare variants", _show_compare)
	_button(actions, "Record my decision", _show_decision)
	copies_button = _button(actions, "My saved copies", _show_copies)
	detail.bbcode_enabled = true
	detail.fit_content = true
	detail.scroll_active = false
	detail.custom_minimum_size.y = 220
	details.add_child(detail)
	status.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	status.add_theme_color_override("font_color", MUTED)
	column.add_child(status)
	for dialog: Window in [error_dialog, zoom_dialog, compare_dialog, decision_dialog, guide_dialog, copies_dialog, discard_review_dialog]:
		dialog.initial_position = Window.WINDOW_INITIAL_POSITION_CENTER_MAIN_WINDOW_SCREEN
		dialog.transient = true
		if dialog != decision_dialog: dialog.close_requested.connect(dialog.hide)
		add_child(dialog)
	error_dialog.title = "GOLDMAPS"
	error_dialog.min_size = Vector2i(480, 180)
	guide_dialog.title = "Owner decision guide"
	guide_dialog.dialog_text = "All classifications begin pending. Frozen research recommendations are evidence, not your acceptance.\n\nGold: a baseline architectural exemplar you choose to adopt; a nominated baseline may itself be an earlier repair.\nPlatinum: a derived intervention you judge demonstrably improves its baseline while preserving identity and topology.\nPyrite: a derived result you judge regressed or remains substandard; retain its baseline and record why.\nNo-change: a useful outcome when a strong source should remain untouched.\n\nB1/B2: positive uplift in the frozen assessment. B3: racing benefit inconclusive. C1–C3: exact unchanged controls. D1: assessor disagreement. D2: prior reference preferred overall.\n\nLocal choices never update GitHub. Hosted native PASS is separate from your Windows/NVIDIA graphical and flight-speed judgement."
	decision_dialog.exclusive = true
	decision_dialog.close_requested.connect(_close_decision)
	discard_review_dialog.title = "Keep or discard this review draft"
	discard_review_dialog.dialog_text = "Your changes to this review have not been saved. Discard this draft? The previously saved decision stays unchanged."
	discard_review_dialog.ok_button_text = "Discard draft"
	discard_review_dialog.cancel_button_text = "Keep editing"
	discard_review_dialog.confirmed.connect(func() -> void: decision_dialog.hide())
	discard_review_dialog.reparent(decision_dialog)
	source_label.meta_clicked.connect(_open_source_link)
	_build_decision_form()

func _start() -> void:
	if package_root.is_empty() or not package_root.is_absolute_path():
		_fail("Launch with Open GOLDMAPS.cmd from the fully extracted kit.")
		return
	var isolation := IO.profile_error(package_root)
	if not isolation.is_empty(): _fail(isolation); return
	IO.configure_child_environment(package_root)
	var checked := IO.manifest_rows(package_root)
	if checked.has("error"): _fail(checked.error); return
	manifest = checked.document
	var rows: Array = checked.rows
	for index: int in rows.size():
		var reason := IO.verify_row(package_root, rows[index])
		if not reason.is_empty(): _fail(reason); return
		status.text = "Checking original bytes and runtime… %d / %d files" % [index + 1, rows.size()]
		if index % 4 == 0: await get_tree().process_frame
	var loaded := IO.bounded_json(package_root.path_join(IO.COLLECTION))
	if loaded.has("error"): _fail(loaded.error); return
	collection = loaded.data
	if not collection.get("maps") is Array: _fail("Collection has no map roster."); return
	var ids: Dictionary = {}
	for row: Variant in collection.maps:
		if not row is Dictionary or not _safe_id(str(row.get("id", ""))) or ids.has(str(row.id)):
			_fail("Collection contains a duplicate or unsafe logical map identity."); return
		ids[str(row.id)] = true
	loaded = IO.bounded_json(package_root.path_join(IO.QUALIFICATION))
	if loaded.has("error"): _fail(loaded.error); return
	qualification = loaded.data
	var review_path := package_root.path_join("userdata/reviews/decisions.json")
	if FileAccess.file_exists(review_path):
		loaded = IO.bounded_json(review_path)
		if loaded.has("error") or loaded.get("data", {}).get("schema", "") != "goldmaps.owner-reviews.v1" or not loaded.get("data", {}).get("decisions") is Dictionary:
			_fail("The local review file is invalid. Preserve userdata/reviews/decisions.json and recover it before continuing; it was not overwritten."); return
		reviews = loaded.data
	var families: Array[String] = []
	for row: Dictionary in collection.maps:
		var name := _family(row)
		if not name.is_empty() and not name in families: families.append(name)
	families.sort()
	for name: String in families: family.add_item(name)
	verified = true
	_refresh_list()
	status.text = "Verified %d payload files · engine %s · reviews and saves stay inside userdata/ · owner acceptance pending" % [rows.size(), str(manifest.engine_head).left(12)]
	print("GOLDMAPS_BROWSER_READY " + JSON.stringify({"engine_head":manifest.engine_head, "logical_maps":collection.maps.size(), "verified_files":rows.size(), "user_data_dir":OS.get_user_data_dir(), "package_root":package_root}))
	if OS.get_environment("GOLDMAPS_QA_CAPTURE") == "1" and DisplayServer.get_name() != "headless":
		await get_tree().process_frame
		await RenderingServer.frame_post_draw
		var capture_path := package_root.path_join("userdata/qa/browser.png")
		DirAccess.make_dir_recursive_absolute(capture_path.get_base_dir())
		get_viewport().get_texture().get_image().save_png(capture_path)
		var capture := {"schema":"goldmaps.browser-graphical.v1", "path":capture_path, "sha256":FileAccess.get_sha256(capture_path), "renderer":RenderingServer.get_video_adapter_name(), "display_driver":DisplayServer.get_name(), "viewport":str(get_viewport_rect().size), "scope":"actual hosted rendered UI; physical owner GPU acceptance not inferred"}
		IO.atomic_json(package_root.path_join("userdata/qa/browser-graphical.json"), capture)
		print("GOLDMAPS_BROWSER_GRAPHICAL " + JSON.stringify(capture))
		if OS.get_environment("GOLDMAPS_QA_MAP").is_empty():
			get_tree().quit(0)
			return
	if "--self-test" in OS.get_cmdline_user_args():
		print("GOLDMAPS_BROWSER_SELF_TEST " + JSON.stringify({"gold25":_count_collection("gold25"), "corpus":_count_collection("corpus"), "owner_accepted":0, "profile_isolated":true}))
		get_tree().quit(0)
	var qa_map := OS.get_environment("GOLDMAPS_QA_MAP")
	if not qa_map.is_empty():
		selected = IO.find_map(collection, qa_map)
		if selected.is_empty(): _fail("QA map identity unavailable."); return
		_open_selected()

func _safe_id(id: String) -> bool:
	if id.is_empty() or id.length() > 80: return false
	for character: String in id:
		if character not in "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_": return false
	return true

func _family(row: Dictionary) -> String:
	var value: Variant = row.get("family", row.get("architectural_family", ""))
	if value is Dictionary: return str(value.get("name", value.get("id", "")))
	return str(value)

func _count_collection(key: String) -> int:
	var count := 0
	for row: Dictionary in collection.get("maps", []):
		if key in row.get("collections", []): count += 1
	return count

func _refresh_list() -> void:
	if not verified: return
	var retained := str(selected.get("id", ""))
	filtered.clear()
	map_list.clear()
	for child: Button in tabs.get_children():
		child.add_theme_color_override("font_color", GOLD if child.get_meta("collection") == active_collection else Color.WHITE)
	for row: Dictionary in collection.maps:
		if active_collection != "all" and active_collection not in row.get("collections", []): continue
		var searchable := (str(row.get("title", "")) + " " + str(row.id) + " " + _family(row) + " " + str(row.get("tags", [])) + " " + str(row.get("variant_role", "")) + " " + str(row.get("source", {}).get("pr", ""))).to_lower()
		if not search.text.strip_edges().to_lower() in searchable: continue
		if orientation.selected > 0 and str(row.get("orientation", "")).to_lower() != orientation.get_item_text(orientation.selected).to_lower(): continue
		var playable := IO.playable_reason(row, qualification, str(manifest.engine_head)).is_empty()
		if eligibility.selected == 1 and not playable or eligibility.selected == 2 and playable: continue
		var local_record: Dictionary = reviews.decisions.get(str(row.id), {})
		var reviewed: bool = not local_record.is_empty() and local_record.get("status", DECISIONS[0]) != DECISIONS[0]
		if review_filter.selected == 1 and reviewed or review_filter.selected == 2 and not reviewed: continue
		if family.selected > 0 and _family(row) != family.get_item_text(family.selected): continue
		filtered.append(row)
		var role := str(row.get("variant_role", "source")).replace("_", " ")
		var caption := str(row.get("title", row.id)) + "\n" + str(row.id) + " · " + role + "\n" + ("PLAYABLE" if playable else "REFERENCE / REFUSED") + " · " + str(local_record.get("status", "owner pending"))
		var index := map_list.add_item(caption, _texture(row, true))
		map_list.set_item_tooltip(index, str(row.get("title", row.id)) + "\n" + role)
		if not playable: map_list.set_item_custom_fg_color(index, MUTED)
	count_label.text = "%s · %d shown / %d collection identities" % [COLLECTION_NAMES[active_collection], filtered.size(), collection.maps.size() if active_collection == "all" else _count_collection(active_collection)]
	var index := 0
	for i: int in filtered.size():
		if str(filtered[i].id) == retained: index = i; break
	if not filtered.is_empty():
		map_list.select(index)
		_select_index(index)
	else:
		selected = {}
		title_label.text = "No maps match these filters"
		source_label.text = ""
		preview.texture = null
		preview_caption.text = ""
		detail.text = "Clear the search or choose another collection."
		open_button.disabled = true

func _texture(row: Dictionary, small: bool = false) -> Texture2D:
	var data: Dictionary = row.get("preview", {})
	var path := str(data.get("path", ""))
	if not IO.safe_relative(path): return null
	var key := path + ("#thumb" if small else "#full")
	if texture_cache.has(key): return texture_cache[key]
	var img := Image.new()
	if img.load(package_root.path_join(path)) != OK: return null
	if img.get_width() > 8192 or img.get_height() > 8192: return null
	if small:
		var scale_value := minf(210.0 / img.get_width(), 126.0 / img.get_height())
		img.resize(maxi(1, int(img.get_width() * scale_value)), maxi(1, int(img.get_height() * scale_value)), Image.INTERPOLATE_NEAREST)
	var texture := ImageTexture.create_from_image(img)
	if small: texture_cache[key] = texture
	return texture

func _select_index(index: int) -> void:
	if index < 0 or index >= filtered.size(): return
	selected = filtered[index]
	title_label.text = str(selected.get("title", selected.id))
	var source: Dictionary = selected.get("source", {})
	var commit := str(source.get("commit", source.get("head", "")))
	var source_url := "https://github.com/techrote/sandmapsreference/pull/" + str(source.get("pr", ""))
	source_label.text = "[color=#a4b3c7]%s · [url=%s]PR #%s[/url] · %s\n%s[/color]" % [_escape(str(selected.id)), source_url, _escape(str(source.get("pr", "—"))), commit.left(12), _escape(str(selected.get("variant_role", "source")).replace("_", " "))]
	preview.texture = _texture(selected)
	var preview_info: Dictionary = selected.get("preview", {})
	preview_caption.text = str(preview_info.get("kind", "Preview unavailable")).replace("_", " ") + " · click to inspect full resolution"
	var setup: Dictionary = selected.get("setup", {})
	var dims: Variant = setup.get("dimensions", selected.get("dimensions", []))
	var reason := IO.playable_reason(selected, qualification, str(manifest.engine_head))
	open_button.disabled = not reason.is_empty() or active_pid > 0
	open_button.tooltip_text = reason if not reason.is_empty() else "Open this exact native Setup in the ordinary Workbench."
	var local: Dictionary = reviews.decisions.get(str(selected.id), {})
	var text := "[b]%s[/b]\n" % ("Natively qualified for this kit · physical owner review pending" if reason.is_empty() else _escape(reason))
	var art: Dictionary = _dict(selected.get("art"))
	var portrait_art: Dictionary = _dict(art.get("portrait_art_review"))
	var source_static: Dictionary = _dict(selected.get("source_static_qualification"))
	var technical: Dictionary = _dict(source_static.get("portrait_technical_review"))
	var nomination: Dictionary = _dict(art.get("historical_gold_nomination"))
	var review_evidence: Dictionary = _dict(nomination.get("review_evidence"))
	text += "\n[b]Frozen Art recommendation[/b]  %s\n" % _escape(str(art.get("frozen_finalisation_recommendation")) if art.get("frozen_finalisation_recommendation") != null else "No Gold classification inferred")
	if not portrait_art.is_empty(): text += "[b]Historical portrait Art[/b]  %s at %s\n" % [_escape(str(portrait_art.get("verdict", ""))), str(portrait_art.get("reviewed_head", "")).left(12)]
	elif not review_evidence.is_empty(): text += "[b]Earlier Art record[/b]  %s\n" % _escape(str(review_evidence.get("qualification", "")))
	if not technical.is_empty(): text += "[b]Historical source-static review[/b]  %s\n" % _escape(str(technical.get("verdict", "")))
	var replay: Dictionary = _dict(source_static.get("corpus_replay"))
	if not replay.is_empty(): text += "[b]Material replay[/b]  %s · native execution is a separate gate\n" % _escape(str(replay.get("status", "")))
	var historical_native: Dictionary = _dict(_dict(selected.get("native")).get("historical"))
	if not historical_native.is_empty(): text += "[b]Historical native[/b]  %s · engine %s\n" % [_escape(str(historical_native.get("status", ""))), str(historical_native.get("engine_head", "")).left(12)]
	if not str(art.get("note", "")).is_empty(): text += "\n" + _escape(str(art.get("note", ""))) + "\n"
	text += "\n[b]Architecture[/b]  %s\n[b]Dimensions[/b]  %s · %s\n" % [_escape(_family(selected)), _escape(str(dims)), _escape(str(selected.get("orientation", "")))]
	text += "[b]Tags[/b]  %s\n" % _escape(", ".join(PackedStringArray(selected.get("tags", []))))
	text += "\n[b]Owner-local decision[/b]  %s\n" % _escape(str(local.get("status", "Pending / not reviewed")))
	if not local.is_empty(): text += "[b]Classification[/b]  %s\n" % _escape(str(local.get("classification", "Unclassified")))
	var comparison: Dictionary = _dict(selected.get("comparison"))
	if not comparison.is_empty():
		text += "\n[b]Frozen comparison %s[/b]\n%s\n" % [_escape(str(comparison.get("arm", ""))), _escape(str(comparison.get("frozen_result", comparison.get("verdict", ""))))]
		text += _escape(str(comparison.get("owner_prompt", ""))) + "\n"
	var notes: Variant = selected.get("review_notes", selected.get("notes", ""))
	if not str(notes).is_empty(): text += "\n" + _escape(str(notes)) + "\n"
	var derived: Dictionary = _dict(selected.get("derived_source"))
	text += "\n[b]%s[/b]  %s\n" % ["Original parent source" if not derived.is_empty() else "Source", _escape(str(source.get("path", "")))]
	if not derived.is_empty():
		text += "[b]Separate descendant custody[/b]  %s\n%s\n" % [_escape(str(derived.get("commit")) if derived.get("commit") != null else "Deterministic delivery-source derivation; see product provenance"), _escape(str(derived.get("path", "")))]
		text += "[b]Policy correction limit[/b]  The invalid original envelope does not establish equivalent intent. This is a separately qualified native-default integration candidate with unchanged material geometry and actors.\n"
		if str(selected.id) == "derived-183-policy": text += "#183 is outside the Gold25 nomination.\n"
	text += "[b]Setup SHA-256[/b]\n%s\n[b]Engine[/b]  %s\n" % [str(setup.get("sha256", "not bundled")), str(manifest.engine_head)]
	detail.text = text

func _escape(value: String) -> String:
	return value.replace("[", "[lb]")

func _step(direction: int) -> void:
	if filtered.is_empty(): return
	var indices := map_list.get_selected_items()
	var index := int(indices[0]) if not indices.is_empty() else 0
	index = posmod(index + direction, filtered.size())
	map_list.select(index)
	map_list.ensure_current_is_visible()
	_select_index(index)

func _open_selected(saved: Dictionary = {}, map_override: Dictionary = {}) -> void:
	var opening := map_override if not map_override.is_empty() else selected
	if not verified or opening.is_empty(): return
	if active_pid > 0 and OS.is_process_running(active_pid):
		_notice("The current Workbench is still open. Save your named copy and use Return to collection in that window before opening another map.")
		return
	var reason := IO.playable_reason(opening, qualification, str(manifest.engine_head))
	if not reason.is_empty(): _notice(reason); return
	var setup: Dictionary = opening.get("setup", {})
	if FileAccess.get_sha256(package_root.path_join(str(setup.path))) != str(setup.sha256):
		_fail("The selected original Setup changed after package verification. Open refused."); return
	IO.configure_child_environment(package_root)
	var bootstrap_error := IO.prepare_bootstrap(package_root)
	if not bootstrap_error.is_empty(): _fail(bootstrap_error); return
	active_id = str(opening.id)
	active_session = active_id + "-" + IO.timestamp() + "-" + Crypto.new().generate_random_bytes(3).hex_encode()
	var args := PackedStringArray(["--path", package_root.path_join("runtime/project"), "--script", "res://goldmaps/session.gd", "--log-file", package_root.path_join("userdata/sessions/" + active_session + ".log")])
	if DisplayServer.get_name() == "headless": args.append("--headless")
	args.append_array(PackedStringArray(["--", "--goldmaps-id", active_id, "--goldmaps-session", active_session]))
	if not saved.is_empty():
		args.append_array(PackedStringArray(["--goldmaps-saved-label", str(saved.label), "--goldmaps-saved-sha256", str(saved.sha256)]))
	var executable := OS.get_executable_path()
	active_pid = OS.create_process(executable, args, false)
	if active_pid <= 0: _notice("Could not start the bundled Workbench process."); active_pid = -1; return
	open_button.disabled = true
	status.text = "Workbench opened for %s. Save a named evaluation copy there; Return to collection closes it safely. The browser stays available." % active_id
	print("GOLDMAPS_BROWSER_LAUNCHED " + JSON.stringify({"id":active_id, "pid":active_pid, "session":active_session, "engine_head":manifest.engine_head}))

func _process(_delta: float) -> void:
	if active_pid <= 0 or Time.get_ticks_msec() - last_pid_check < 500: return
	last_pid_check = Time.get_ticks_msec()
	if OS.is_process_running(active_pid): return
	var ended := active_id
	active_pid = -1
	var receipt_path := package_root.path_join("userdata/sessions/" + active_session + ".json")
	var receipt := IO.bounded_json(receipt_path)
	if receipt.has("error"):
		status.text = "Workbench closed without a completion receipt. See userdata/sessions/%s.log. Your local reviews remain saved." % active_session
	else:
		var data: Dictionary = receipt.data
		status.text = "Returned from %s · %s · local reviews and named saves retained." % [ended, str(data.get("status", "closed"))]
		if data.get("status") == "REFUSED": _notice(str(data.get("error", "Workbench load refused.")))
	if not selected.is_empty(): open_button.disabled = not IO.playable_reason(selected, qualification, str(manifest.engine_head)).is_empty()
	if not OS.get_environment("GOLDMAPS_QA_MAP").is_empty():
		print("GOLDMAPS_BROWSER_QA_COMPLETED " + JSON.stringify(receipt))
		get_tree().quit(0 if not receipt.has("error") and receipt.data.get("status") == "QA_SAVED" else 2)

func _show_zoom() -> void:
	if selected.is_empty(): return
	for child: Node in zoom_dialog.get_children(): child.queue_free()
	zoom_dialog.title = str(selected.get("title", selected.id)) + " — full-resolution source preview"
	zoom_dialog.size = Vector2i(1100, 760)
	var scroll := ScrollContainer.new()
	scroll.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	zoom_dialog.add_child(scroll)
	var image := TextureRect.new()
	image.texture = _texture(selected)
	image.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	image.stretch_mode = TextureRect.STRETCH_KEEP
	scroll.add_child(image)
	zoom_dialog.popup_centered_clamped(Vector2i(1100, 760), 0.9)

func _variants() -> Array[Dictionary]:
	var rows: Array[Dictionary] = []
	if selected.is_empty(): return rows
	var comparison: Dictionary = _dict(selected.get("comparison"))
	var arm := str(comparison.get("arm", ""))
	var family_id := str(comparison.get("family_id", ""))
	var parent := str(selected.get("parent_id")) if selected.get("parent_id") != null else ""
	for row: Dictionary in collection.maps:
		var other: Dictionary = _dict(row.get("comparison"))
		if (not arm.is_empty() and other.get("arm", "") == arm) or (not family_id.is_empty() and other.get("family_id", "") == family_id) or row.id == selected.id or row.get("parent_id", "") == selected.id or (not parent.is_empty() and (row.id == parent or row.get("parent_id", "") == parent)):
			rows.append(row)
	return rows

func _show_compare() -> void:
	if selected.is_empty(): return
	for child: Node in compare_dialog.get_children(): child.queue_free()
	compare_dialog.title = "Compare source identities — independent play sessions"
	var margin := MarginContainer.new()
	margin.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	for side: String in ["left", "right", "top", "bottom"]: margin.add_theme_constant_override("margin_" + side, 16)
	compare_dialog.add_child(margin)
	var col := _box(margin)
	_label(col, "Reference images side by side. Each Open starts its own ordinary native World; the simulations are not synchronized.", 16, MUTED)
	var comparison: Dictionary = _dict(selected.get("comparison"))
	var cards_path := str(collection.get("comparison_cards", "collection/comparisons.v1.json"))
	if IO.safe_relative(cards_path) and not comparison.is_empty():
		var cards := IO.bounded_json(package_root.path_join(cards_path))
		if not cards.has("error"):
			for card: Dictionary in cards.data.get("cards", []):
				if card.get("arm", "") != comparison.get("arm", ""): continue
				var legend_parts := PackedStringArray()
				for variant: Dictionary in card.get("variants", []):
					legend_parts.append("%s = %s (PR #%s)" % [str(variant.get("neutral_label", "")), str(variant.get("id", "")), str(variant.get("source_pr", ""))])
				var legend := "Archived crop legend · " + " · ".join(legend_parts)
				_label(col, legend, 14, GOLD)
				_label(col, "Frozen sites · x right, y down · bounds are [x, y, width, height]", 13, MUTED)
				var sites := HFlowContainer.new()
				sites.add_theme_constant_override("h_separation", 6)
				col.add_child(sites)
				for site: Dictionary in card.get("site_views", []):
					var image_path := str(site.get("image", ""))
					var caption := str(site.get("source_evidence_name", "Site detail"))
					var site_title := caption + " · " + str(site.get("world_xywh", []))
					_button(sites, caption, func() -> void: _show_archived_image(image_path, site_title, legend))
	var scroll := ScrollContainer.new()
	scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	col.add_child(scroll)
	var row_box := _box(scroll, false)
	for row: Dictionary in _variants():
		var card := _box(row_box)
		card.custom_minimum_size.x = 340
		_label(card, str(row.get("title", row.id)), 20, GOLD)
		_label(card, str(row.id) + " · " + str(row.get("variant_role", "source")), 14, MUTED)
		var image := TextureRect.new()
		image.texture = _texture(row)
		image.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		image.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		image.custom_minimum_size = Vector2(340, 320)
		image.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
		card.add_child(image)
		_label(card, str(row.get("preview", {}).get("kind", "Preview unavailable")), 13, MUTED)
		_label(card, str(_dict(row.get("comparison")).get("frozen_result", "")) + "\n" + str(_dict(row.get("comparison")).get("owner_prompt", "")), 15)
		var button := _button(card, "Open " + str(row.get("variant_role", "variant")), func() -> void:
			_open_selected({}, row))
		button.disabled = not IO.playable_reason(row, qualification, str(manifest.engine_head)).is_empty()
		_label(card, "SHA-256 " + str(row.get("setup", {}).get("sha256", "not bundled")), 12, MUTED)
	compare_dialog.popup_centered_clamped(Vector2i(1180, 680), 0.95)

func _show_archived_image(path: String, caption: String, legend: String = "") -> void:
	if not IO.safe_relative(path): return
	for child: Node in zoom_dialog.get_children(): child.queue_free()
	zoom_dialog.title = caption + " — archived material comparison"
	var column := VBoxContainer.new()
	column.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	zoom_dialog.add_child(column)
	_label(column, legend, 15, GOLD)
	var scroll := ScrollContainer.new()
	scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	column.add_child(scroll)
	var image := TextureRect.new()
	image.texture = _texture({"preview":{"path":path}})
	image.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	image.stretch_mode = TextureRect.STRETCH_KEEP
	scroll.add_child(image)
	zoom_dialog.popup_centered_clamped(Vector2i(1150, 760), 0.95)

func _build_decision_form() -> void:
	decision_dialog.title = "Your local review — explicit human choice"
	var margin := MarginContainer.new()
	margin.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	for side: String in ["left", "right", "top", "bottom"]: margin.add_theme_constant_override("margin_" + side, 20)
	decision_dialog.add_child(margin)
	var scroll := ScrollContainer.new()
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	margin.add_child(scroll)
	var col := _box(scroll)
	col.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	review_notice = _label(col, "", 18, GOLD)
	_label(col, "These choices stay on this computer. Research verdicts remain unchanged.", 14, MUTED)
	var row := _box(col, false)
	for value: String in DECISIONS: decision_status.add_item(value)
	for value: String in CLASSES: decision_class.add_item(value)
	row.add_child(decision_status)
	row.add_child(decision_class)
	preferred.placeholder_text = "Preferred variant ID (optional)"
	col.add_child(preferred)
	_label(col, "Playability notes", 15)
	play_notes.custom_minimum_size.y = 115
	play_notes.wrap_mode = TextEdit.LINE_WRAPPING_BOUNDARY
	col.add_child(play_notes)
	_label(col, "Presentation / classification notes", 15)
	presentation_notes.custom_minimum_size.y = 115
	presentation_notes.wrap_mode = TextEdit.LINE_WRAPPING_BOUNDARY
	col.add_child(presentation_notes)
	_label(col, "Screenshots taken in Workbench are saved in userdata/reviews/screenshots/ and linked to that map's session record.", 13, MUTED)
	_button(col, "Save my explicit review", _save_decision)

func _show_decision() -> void:
	if selected.is_empty(): return
	decision_dialog.set_meta("map_id", str(selected.id))
	review_notice.text = str(selected.id) + " · " + str(selected.get("title", ""))
	var previous: Dictionary = reviews.decisions.get(str(selected.id), {})
	decision_status.select(maxi(0, DECISIONS.find(str(previous.get("status", DECISIONS[0])))))
	decision_class.select(maxi(0, CLASSES.find(str(previous.get("classification", CLASSES[0])))))
	preferred.text = str(previous.get("preferred_variant", ""))
	play_notes.text = str(previous.get("playability_notes", ""))
	presentation_notes.text = str(previous.get("presentation_notes", ""))
	decision_baseline = _decision_form_state()
	decision_dialog.popup_centered_clamped(Vector2i(760, 660), 0.95)

func _save_decision() -> void:
	var id := str(decision_dialog.get_meta("map_id", ""))
	var row := IO.find_map(collection, id)
	if row.is_empty(): return
	if play_notes.text.length() > 20000 or presentation_notes.text.length() > 20000: _review_error("Please keep each note below 20,000 characters."); return
	if not preferred.text.is_empty() and IO.find_map(collection, preferred.text.strip_edges()).is_empty():
		_review_error("Preferred variant must be an exact logical ID from this collection, or left blank."); return
	if decision_class.selected > 0 and decision_status.selected == 0:
		_review_error("Choose a review status before recording a classification, or leave the classification Unclassified."); return
	var record := {"map_id":id, "status":DECISIONS[decision_status.selected], "classification":CLASSES[decision_class.selected], "preferred_variant":preferred.text.strip_edges(), "playability_notes":play_notes.text, "presentation_notes":presentation_notes.text, "source":row.get("source", {}), "setup_sha256":row.get("setup", {}).get("sha256", ""), "engine_head":manifest.engine_head, "recorded_at":Time.get_datetime_string_from_system(true) + "Z", "decision_origin":"explicit_owner_local_choice", "physical_graphical_acceptance":"not_inferred"}
	var updated := reviews.duplicate(true)
	updated.decisions[id] = record
	var reason := IO.atomic_json(package_root.path_join("userdata/reviews/decisions.json"), updated)
	if not reason.is_empty(): _review_error(reason); return
	reviews = updated
	decision_dialog.hide()
	_refresh_list()
	status.text = "Saved your local review for %s. Export my reviews writes JSON, CSV and Markdown beside the local review store." % id

func _export_reviews() -> void:
	if not verified: return
	var out := package_root.path_join("userdata/reviews/exports/" + IO.timestamp())
	var value := reviews.duplicate(true)
	value["engine_head"] = manifest.engine_head
	value["exported_at"] = Time.get_datetime_string_from_system(true) + "Z"
	var error := IO.atomic_json(out.path_join("decisions.json"), value)
	if not error.is_empty(): _notice(error); return
	var csv := "map_id,title,status,classification,preferred_variant,playability_notes,presentation_notes,setup_sha256,engine_head,recorded_at\n"
	var markdown := "# GOLDMAPS — owner-local decisions\n\nThese are explicit local records. They do not merge, adopt or update any repository.\n\nEngine: `%s`\n\n" % str(manifest.engine_head)
	var ids: Array = reviews.decisions.keys()
	ids.sort()
	for id: String in ids:
		var record: Dictionary = reviews.decisions[id]
		var row := IO.find_map(collection, id)
		var fields := [id, str(row.get("title", "")), record.get("status", ""), record.get("classification", ""), record.get("preferred_variant", ""), record.get("playability_notes", ""), record.get("presentation_notes", ""), record.get("setup_sha256", ""), record.get("engine_head", ""), record.get("recorded_at", "")]
		var encoded: Array[String] = []
		for field: Variant in fields: encoded.append('"' + str(field).replace('"', '""') + '"')
		csv += ",".join(encoded) + "\n"
		markdown += "## %s — %s\n\n- Decision: %s\n- Classification: %s\n- Preferred variant: %s\n- Source Setup SHA-256: `%s`\n- Date: %s\n\n### Playability\n\n%s\n\n### Presentation\n\n%s\n\n" % [id, str(row.get("title", "")), str(record.get("status", "")), str(record.get("classification", "")), str(record.get("preferred_variant", "")), str(record.get("setup_sha256", "")), str(record.get("recorded_at", "")), str(record.get("playability_notes", "")), str(record.get("presentation_notes", ""))]
	for file_name: String in ["decisions.csv", "decisions.md"]:
		var file := FileAccess.open(out.path_join(file_name), FileAccess.WRITE)
		if file == null: _notice("Could not complete review export."); return
		file.store_string(csv if file_name.ends_with("csv") else markdown)
		file.close()
	status.text = "Exported %d explicit reviews to %s" % [ids.size(), out]
	_notice("Export complete: %d reviews.\n\n%s\n\nNothing was uploaded or sent." % [ids.size(), out])

func _show_copies() -> void:
	if selected.is_empty(): return
	for child: Node in copies_dialog.get_children():
		if child.get_meta("goldmaps_list", false): child.queue_free()
	var col := VBoxContainer.new()
	col.set_meta("goldmaps_list", true)
	copies_dialog.add_child(col)
	copies_dialog.title = "Named evaluation copies — " + str(selected.id)
	var saved: Array[Dictionary] = []
	var dir := DirAccess.open(package_root.path_join("userdata/sessions"))
	if dir != null:
		for name: String in dir.get_files():
			if not name.ends_with(".json"): continue
			var parsed := IO.bounded_json(package_root.path_join("userdata/sessions").path_join(name), 1024 * 1024)
			if parsed.has("error") or parsed.data.get("map_id", "") != selected.id: continue
			for item: Variant in parsed.data.get("saved_copies", []):
				if item is Dictionary: saved.append(item)
	if saved.is_empty(): _label(col, "No evaluation copies have been recorded for this identity. Use Save evaluation copy in its Workbench window.")
	for copy: Dictionary in saved:
		_button(col, "Open " + str(copy.get("label", "")), func() -> void:
			copies_dialog.hide()
			_open_selected(copy))
	copies_dialog.popup_centered_clamped(Vector2i(660, 360), 0.9)

func _show_guide() -> void:
	guide_dialog.popup_centered_clamped(Vector2i(760, 570), 0.95)

func _notice(message: String) -> void:
	error_dialog.dialog_text = message
	error_dialog.popup_centered_clamped(Vector2i(680, 280), 0.95)

func _fail(message: String) -> void:
	verified = false
	open_button.disabled = true
	status.text = "Open refused: " + message
	title_label.text = "The collection could not be verified"
	print("GOLDMAPS_BROWSER_REFUSED " + JSON.stringify({"error":message, "user_data_dir":OS.get_user_data_dir()}))
	if DisplayServer.get_name() == "headless": get_tree().quit(2)
	else: _notice(message)

func _request_browser_close() -> void:
	if active_pid > 0 and OS.is_process_running(active_pid):
		_notice("A Workbench session is still open. Save your named copy and return to the collection from that window first. Your edits are still in that process.")
		return
	get_tree().quit()

func _unhandled_key_input(event: InputEvent) -> void:
	if not event is InputEventKey or not event.pressed or event.echo: return
	if event.ctrl_pressed and event.keycode == KEY_F:
		search.grab_focus()
		get_viewport().set_input_as_handled()
	elif event.keycode == KEY_PAGEUP: _step(-1)
	elif event.keycode == KEY_PAGEDOWN: _step(1)
	elif event.ctrl_pressed and event.keycode == KEY_S:
		if decision_dialog.visible: _save_decision()
		else: _show_decision()

func _dict(value: Variant) -> Dictionary:
	return value if value is Dictionary else {}

func _decision_form_state() -> String:
	return JSON.stringify([decision_status.selected, decision_class.selected, preferred.text, play_notes.text, presentation_notes.text])

func _close_decision() -> void:
	if _decision_form_state() != decision_baseline:
		discard_review_dialog.popup_centered_clamped(Vector2i(640, 240), 0.9)
	else:
		decision_dialog.hide()

func _review_error(message: String) -> void:
	review_notice.text = str(decision_dialog.get_meta("map_id", "")) + "\n" + message

func _open_source_link(value: Variant) -> void:
	var url := str(value)
	if url.begins_with("https://github.com/techrote/sandmapsreference/"):
		OS.shell_open(url)
