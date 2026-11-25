extends SceneTree

# Actual browser containers and source previews, without package execution or
# a native World. Bounds are a regression fixture, not rendered acceptance.
class GalleryFixture extends "res://browser.gd":
	func _ready() -> void:
		_build_ui()

func _initialize() -> void:
	_run.call_deferred()

func _run() -> void:
	var browser := GalleryFixture.new()
	browser.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	root.add_child(browser)
	browser.package_root = OS.get_environment("GOLDMAPS_PACKAGE_ROOT")
	var source: Dictionary = browser.IO.bounded_json(browser.package_root.path_join(browser.IO.COLLECTION))
	if source.has("error"): push_error(str(source.error)); quit(2); return
	browser.collection = source.data
	browser.manifest = {"engine_head":"00cdb02f103265b6dc5224c68283e9a0c8cb449f"}
	browser.verified = true
	browser._refresh_list()
	browser.status.text = "Verified 1505 payload files · engine 00cdb02f1032 · reviews and saves stay inside userdata/ · owner acceptance pending"
	var checks: Array[Dictionary] = []
	for dimensions: Vector2i in [Vector2i(992,656),Vector2i(1280,720),Vector2i(1380,880)]:
		root.size = dimensions
		root.content_scale_size = dimensions
		for frame: int in 4: await process_frame
		var layout: Dictionary = browser._qa_gallery_layout()
		var grid: Array = layout.map_list_bounds
		var nav: Array = layout.navigation_bounds
		var item: Array = layout.first_item_bounds_local
		var source_link := "[url=https://github.com/techrote/sandmapsreference/pull/%d]" % int(browser.selected.source.pr)
		var link_is_integer: bool = browser.source_label.text.contains(source_link)
		var passed: bool = layout.map_count == 25 and layout.map_list_visible and layout.visible_popup_titles.is_empty() and grid[2] >= 225 and grid[3] >= 180 and nav[3] <= 50 and grid[1]+grid[3] <= dimensions.y and nav[1]+nav[3] <= dimensions.y and item[2] >= 210 and item[3] >= 126 and link_is_integer
		checks.append({"pass":passed,"requested_viewport":[dimensions.x,dimensions.y],"layout":layout,"source_link_is_integer":link_is_integer})
		print("GOLDMAPS_GALLERY_LAYOUT " + JSON.stringify(checks.back()))
	var passed := true
	for check: Dictionary in checks: passed = passed and bool(check.pass)
	print("GOLDMAPS_GALLERY_LAYOUT_SUMMARY " + JSON.stringify({"pass":passed,"cases":checks.size(),"scope":"Actual headless container bounds and startup Window visibility only; no rendered or native acceptance"}))
	quit(0 if passed else 2)
