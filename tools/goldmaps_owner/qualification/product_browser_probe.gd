extends SceneTree

# Exercise the actual shipped browser and local review controls in an explicitly
# disposable qualification profile. Test choices remain Pending/Unclassified.
var browser: Control
var checks: Array = []
var failures: Array[String] = []
var phase := ""

func _initialize() -> void:
	_run.call_deferred()

func _check(condition: bool, name: String, detail: Variant = null) -> void:
	checks.append({"name":name,"pass":condition,"detail":detail})
	if not condition: failures.append(name)

func _run() -> void:
	phase = OS.get_environment("GOLDMAPS_BROWSER_QA_PHASE")
	if phase not in ["author","reopen","open_saved"]:
		_check(false,"explicit disposable test phase required")
		_finish(); return
	browser = load("res://browser.tscn").instantiate()
	root.add_child(browser)
	var deadline := Time.get_ticks_msec() + 120000
	while not browser.verified and Time.get_ticks_msec() < deadline:
		await process_frame
	_check(browser.verified,"actual package verified before gallery")
	if not browser.verified: _finish(); return
	# The verification flag is set immediately before the gallery is refreshed;
	# observe the populated UI on the next frame rather than interrupting startup.
	await process_frame
	if phase == "open_saved":
		var map_id := OS.get_environment("GOLDMAPS_QA_SAVED_MAP")
		browser.selected = {}
		for row: Dictionary in browser.collection.maps:
			if row.id == map_id: browser.selected = row; break
		_check(not browser.selected.is_empty(),"saved-copy logical map exists")
		if browser.selected.is_empty(): _finish(); return
		OS.set_environment("GOLDMAPS_QA_MAP",map_id)
		var saved := {"label":OS.get_environment("GOLDMAPS_QA_SAVED_LABEL"),"sha256":OS.get_environment("GOLDMAPS_QA_SAVED_SHA")}
		print("GOLDMAPS_BROWSER_SAVED_REQUEST ",JSON.stringify({"map_id":map_id,"saved":saved,"browser_process":OS.get_process_id()}))
		browser._open_selected(saved)
		return
	_check(browser._count_collection("gold25") == 25,"Gold25 visible")
	_check(browser._count_collection("corpus") == 70,"all70 reference index visible")
	_check(browser._count_collection("portraits") == 7,"all7 repaired portraits visible")
	_check(browser._count_collection("astra") == 18,"18 comparison aliases visible")
	_check(browser._count_collection("policy") == 2,"policy descendants separate")
	_check(not browser.selected.is_empty(),"initial map selection works with nullable metadata", {
		"filtered":browser.filtered.size(),"active_collection":browser.active_collection,"search":browser.search.text,
		"orientation":browser.orientation.selected,"eligibility":browser.eligibility.selected,
		"review":browser.review_filter.selected,"family":browser.family.selected,"title":browser.title_label.text,
		"selected_id":browser.selected.get("id","")})
	var fixture := "gold-106"
	browser.active_collection = "gold25"
	browser.search.text = fixture
	browser._refresh_list()
	_check(browser.filtered.size() == 1 and browser.selected.id == fixture,"search selects exact logical map")
	var review_path: String = browser.package_root.path_join("userdata/reviews/decisions.json")
	var second_note := "QA FIXTURE — NOT OWNER CLASSIFICATION\nsecond write, comma, \"quoted\" text"
	if phase == "author":
		_check(browser.reviews.decisions.is_empty(),"all local decisions initially pending")
		if not browser.reviews.decisions.is_empty(): _finish(); return
		browser._show_decision()
		browser.play_notes.text = "unsaved QA draft"
		browser._close_decision()
		_check(browser.decision_dialog.visible and browser.discard_review_dialog.visible,"unsaved review draft warns before discard")
		browser.discard_review_dialog.hide()
		_check(browser.play_notes.text == "unsaved QA draft","cancel discard preserves draft")
		browser.decision_status.select(0)
		browser.decision_class.select(1)
		browser._save_decision()
		_check(not FileAccess.file_exists(review_path),"classification cannot be inferred from pending status")
		browser.error_dialog.hide()
		browser.decision_class.select(0)
		browser.play_notes.text = "QA FIXTURE — NOT OWNER CLASSIFICATION / first write"
		browser._save_decision()
		_check(FileAccess.file_exists(review_path),"local pending note saved")
		browser._show_decision()
		browser.play_notes.text = second_note
		browser.presentation_notes.text = "Pending visual inspection; synthetic persistence fixture only."
		browser._save_decision()
		var stored: Variant = JSON.parse_string(FileAccess.get_file_as_string(review_path))
		_check(stored is Dictionary and stored.decisions[fixture].playability_notes == second_note,"second atomic write replaces existing file")
		_check(stored.decisions[fixture].classification == "Unclassified" and stored.decisions[fixture].status == "Pending / not reviewed","test never records adoption")
		var saved_hash := FileAccess.get_sha256(review_path)
		browser._show_decision()
		browser.preferred.text = "not-an-existing-map"
		browser._save_decision()
		_check(FileAccess.get_sha256(review_path) == saved_hash,"unknown preferred variant cannot overwrite review")
		browser.preferred.text = ""
		browser.error_dialog.hide()
		browser.decision_dialog.hide()
		browser.review_filter.select(1)
		browser._refresh_list()
		_check(browser.filtered.size() == 1 and browser.selected.id == fixture,"explicit Pending remains in not-reviewed filter")
		browser.review_filter.select(0)
		browser._refresh_list()
		browser._export_reviews()
		browser.error_dialog.hide()
	else:
		var saved: Dictionary = browser.reviews.decisions.get(fixture,{})
		_check(saved.get("playability_notes","") == second_note,"fresh browser process restores repeated write")
		_check(saved.get("classification","") == "Unclassified" and saved.get("status","") == "Pending / not reviewed","fresh process preserves pending decision semantics")
		_check(saved.get("setup_sha256","") == browser.selected.setup.sha256 and saved.get("engine_head","") == browser.manifest.engine_head,"saved review retains exact source and runtime")
	browser.active_collection = "astra"
	browser.search.text = "trial-D1"
	browser._refresh_list()
	_check(browser.filtered.size() == 3,"D1 exposes original candidate and prior reference")
	browser._show_compare()
	_check(browser.compare_dialog.visible,"actual comparison window opens")
	browser.compare_dialog.hide()
	browser.active_collection = "gold25"
	browser.search.text = "gold-155"
	browser._refresh_list()
	_check(browser.filtered.size() == 1 and browser.open_button.disabled,"refused original is selectable but not launchable")
	var old_pid: int = browser.active_pid
	browser._open_selected()
	_check(browser.active_pid == old_pid,"refused original never starts a Workbench child")
	browser.error_dialog.hide()
	if DisplayServer.get_name() != "headless" and not OS.get_environment("GOLDMAPS_QA_OUTPUT").is_empty():
		browser.active_collection = "gold25"
		browser.search.text = ""
		browser._refresh_list()
		await RenderingServer.frame_post_draw
		var image := root.get_texture().get_image()
		var path := OS.get_environment("GOLDMAPS_QA_OUTPUT").path_join("browser-" + phase + ".png")
		_check(image.save_png(path) == OK,"actual display-backed browser capture",path)
	_finish()

func _finish() -> void:
	print("GOLDMAPS_BROWSER_CONTRACT ",JSON.stringify({"schema":"goldmaps.browser-contract.v1",
		"phase":phase,"process_id":OS.get_process_id(),"display_server":DisplayServer.get_name(),
		"user_data_dir":OS.get_user_data_dir(),"checks":checks,"failures":failures,"pass":failures.is_empty(),
		"fixture_classifications":"Pending / Unclassified; no owner decision"}))
	if browser != null: browser.queue_free()
	await process_frame
	await process_frame
	quit(0 if failures.is_empty() else 1)
