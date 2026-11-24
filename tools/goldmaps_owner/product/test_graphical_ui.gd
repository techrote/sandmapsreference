extends SceneTree

# Headless preparation check for the display-only fixture. It verifies actual
# popup controls and metadata, never claims to have captured rendered pixels.
var cases: Array[Dictionary] = []

func _initialize() -> void:
	_run.call_deferred()

func _run() -> void:
	var browser: Control = load("res://browser.tscn").instantiate()
	root.add_child(browser)
	var deadline := Time.get_ticks_msec() + 90000
	while not browser.verified and Time.get_ticks_msec() < deadline: await process_frame
	if not browser.verified: quit(2); return
	await process_frame
	for spec: Array in [["comparison-popup","trial-D1-original"], ["decision-dialog","gold-125"], ["overview-zoom","gold-197"]]:
		var value: Dictionary = await browser._qa_prepare_view(spec[0],spec[1])
		var passed: bool = not value.has("error") and value.get("view_kind") == spec[0] and browser.selected.id == spec[1] and value.get("review_file_unchanged",false) and not value.get("native_world_opened",true)
		if spec[0] == "comparison-popup":
			# Headless reports a 1x1 desktop, so viewport-intersection evidence
			# belongs to the later real displayed capture. This fixture checks
			# the actual mounted control text without claiming visible pixels.
			var text_values: Array[String] = []
			_mounted_labels(value.window,text_values)
			value["headless_mounted_label_text"] = text_values
			for id: String in ["trial-D1-original","trial-D1-candidate","trial-D1-reference"]:
				var found := false
				for label: String in text_values: found = found or label.begins_with(id + " · ")
				passed = passed and found
			for label: String in ["A = trial-D1-reference (PR #203)","B = trial-D1-candidate (PR #214)","C = trial-D1-original (PR #186)"]:
				var found := false
				for text_value: String in text_values: found = found or text_value.contains(label)
				passed = passed and found
		elif spec[0] == "decision-dialog":
			passed = passed and value.get("decision_map_id") == spec[1] and value.get("decision_status") == "Pending / not reviewed" and value.get("decision_classification") == "Unclassified"
		else:
			passed = passed and value.get("preview_path") == browser.selected.preview.path and str(value.get("preview_sha256","")).length() == 64
		var popup: Window = value.get("window")
		if popup != null:
			passed = passed and popup.visible
			popup.hide()
		value.erase("window")
		value["selected_id"] = browser.selected.id
		value["selected_setup_sha256"] = browser.selected.setup.sha256
		cases.append({"action":spec[0],"pass":passed,"evidence":value})
		print("GOLDMAPS_UI_PREPARATION " + JSON.stringify(cases.back()))
	var all_passed := true
	for result: Dictionary in cases: all_passed = all_passed and bool(result.pass)
	print("GOLDMAPS_UI_PREPARATION_SUMMARY " + JSON.stringify({"pass":all_passed,"cases":cases.size(),"scope":"Actual popup handlers and mounted identities only; headless 1x1 desktop cannot qualify viewport geometry; no screenshot, native World or physical graphical acceptance"}))
	quit(0 if all_passed else 2)

func _mounted_labels(parent: Node, values: Array[String]) -> void:
	for child: Node in parent.get_children():
		if child is Label: values.append(child.text)
		_mounted_labels(child,values)
