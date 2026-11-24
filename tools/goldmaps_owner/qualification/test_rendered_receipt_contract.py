#!/usr/bin/env python3
"""Pure receipt fixtures; these do not execute Godot or prove rendered quality."""
import copy
import unittest

from review_final_artifact import ENGINE, UI_CASES, digest, inspect_browser_capture


class RenderedReceiptContract(unittest.TestCase):
    def setUp(self):
        self.preview = b"exact archived material preview fixture"
        ids = ("repair-203", "trial-D1-original", "trial-D1-candidate", "trial-D1-reference", "gold-125", "gold-197")
        self.maps = {name: {"setup": {"sha256": digest(name.encode())},
                           "preview": {"path": "collection/previews/portrait.png", "kind": "material-plane visualization"}}
                     for name in ids}
        self.maps["repair-203"]["setup"] = copy.deepcopy(self.maps["trial-D1-reference"]["setup"])

    def fixture(self, kind):
        selected = UI_CASES[kind]
        case = {"name": kind, "map_id": None, "requested_ui_action": kind,
                "requested_ui_map_id": selected, "new_session_count": 0}
        capture = {"selected_id": selected, "selected_setup_sha256": self.maps[selected]["setup"]["sha256"],
                   "engine_head": ENGINE, "view_kind": kind, "active_collection": "all", "visible_maps": len(self.maps),
                   "popup": {"visible": True, "title": "Actual popup fixture", "window_size": [1180, 680]},
                   "width": 1180, "height": 680, "native_world_opened": False, "owner_decision_written": False,
                   "review_file_unchanged": True, "review_file_sha256_before": "", "review_file_sha256_after": "",
                   "initial_gallery_layout": {"viewport_size": [1280, 720], "map_count": 25,
                     "map_list_visible": True, "map_list_bounds": [24, 240, 700, 370],
                     "first_item_bounds_local": [4, 4, 230, 244], "navigation_bounds": [24, 620, 700, 39],
                     "visible_popup_titles": []}}
        if kind == "comparison-popup":
            legend = "Archived crop legend · A = trial-D1-reference (PR #203) · B = trial-D1-candidate (PR #214) · C = trial-D1-original (PR #186)"
            shown = ["repair-203", "trial-D1-original", "trial-D1-candidate"]
            capture.update(mounted_variant_ids=[*shown, "trial-D1-reference"], depicted_variant_ids=shown,
                           neutral_label_legend=legend, visible_label_records=[{"text": legend, "bounds": [16, 16, 1148, 28]}]
                           + [{"text": name + " · source", "bounds": [16 + index * 350, 120, 340, 20]}
                              for index, name in enumerate(shown)])
            for label in capture["visible_label_records"]:
                label.update(visible_bounds=label["bounds"].copy(), fully_visible=True)
        elif kind == "decision-dialog":
            capture.update(decision_map_id=selected, decision_status="Pending / not reviewed", decision_classification="Unclassified")
        else:
            capture.update(preview_path=self.maps[selected]["preview"]["path"], preview_kind=self.maps[selected]["preview"]["kind"],
                           preview_sha256=digest(self.preview),
                           image_scope="Full-resolution archived material-plane visualization inside actual rendered UI; not a native World screenshot")
        return capture, case

    def inspect(self, capture, case):
        return inspect_browser_capture(capture, case, self.maps, lambda _: self.preview, UI_CASES)

    def test_all_three_popup_receipt_contracts(self):
        for kind in UI_CASES:
            with self.subTest(kind=kind):
                capture, case = self.fixture(kind)
                self.assertEqual(self.inspect(capture, case)["view_kind"], kind)

    def test_legacy_gallery_retains_its_actual_selection(self):
        capture = {"selected_id": "gold-197", "engine_head": ENGINE, "visible_maps": 25, "active_collection": "gold25"}
        result = inspect_browser_capture(capture, {"name": "D1-original"}, self.maps, lambda _: self.preview, {})
        self.assertEqual(result["depicted_map_id"], "gold-197")

    def test_wrong_selected_setup_is_refused(self):
        capture, case = self.fixture("decision-dialog")
        capture["selected_setup_sha256"] = "0" * 64
        with self.assertRaises(ValueError): self.inspect(capture, case)

    def test_collapsed_catalogue_is_refused(self):
        capture, case = self.fixture("comparison-popup")
        capture["initial_gallery_layout"]["map_list_bounds"][3] = 0
        with self.assertRaises(ValueError): self.inspect(capture, case)

    def test_stretched_navigation_is_refused(self):
        capture, case = self.fixture("comparison-popup")
        capture["initial_gallery_layout"]["navigation_bounds"][3] = 438
        with self.assertRaises(ValueError): self.inspect(capture, case)

    def test_unrequested_startup_popup_is_refused(self):
        capture, case = self.fixture("decision-dialog")
        capture["initial_gallery_layout"]["visible_popup_titles"] = ["Your local review"]
        with self.assertRaises(ValueError): self.inspect(capture, case)

    def test_wrong_requested_map_is_refused(self):
        capture, case = self.fixture("decision-dialog")
        case["requested_ui_map_id"] = "gold-197"
        with self.assertRaises(ValueError): self.inspect(capture, case)

    def test_popup_cannot_claim_a_native_world(self):
        capture, case = self.fixture("overview-zoom")
        capture["native_world_opened"] = True
        with self.assertRaises(ValueError): self.inspect(capture, case)

    def test_changed_review_file_is_refused(self):
        capture, case = self.fixture("decision-dialog")
        capture["review_file_sha256_after"] = "0" * 64
        with self.assertRaises(ValueError): self.inspect(capture, case)

    def test_automatic_classification_is_refused(self):
        capture, case = self.fixture("decision-dialog")
        capture["decision_classification"] = "Gold"
        with self.assertRaises(ValueError): self.inspect(capture, case)

    def test_dropped_logical_reference_alias_is_refused(self):
        capture, case = self.fixture("comparison-popup")
        capture["mounted_variant_ids"].remove("trial-D1-reference")
        with self.assertRaises(ValueError): self.inspect(capture, case)

    def test_different_reference_alias_bytes_are_refused(self):
        capture, case = self.fixture("comparison-popup")
        self.maps["repair-203"]["setup"]["sha256"] = "0" * 64
        with self.assertRaises(ValueError): self.inspect(capture, case)

    def test_offscreen_legend_is_not_visible_evidence(self):
        capture, case = self.fixture("comparison-popup")
        capture["visible_label_records"][0]["bounds"][0] = 1181
        with self.assertRaises(ValueError): self.inspect(capture, case)

    def test_unlabelled_depicted_variant_is_refused(self):
        capture, case = self.fixture("comparison-popup")
        capture["visible_label_records"].pop()
        with self.assertRaises(ValueError): self.inspect(capture, case)

    def test_partly_visible_candidate_is_not_a_readable_role(self):
        capture, case = self.fixture("comparison-popup")
        label = capture["visible_label_records"][-1]
        label["visible_bounds"][2] = 80
        label["fully_visible"] = False
        with self.assertRaises(ValueError): self.inspect(capture, case)

    def test_partly_visible_legend_is_not_a_readable_legend(self):
        capture, case = self.fixture("comparison-popup")
        label = capture["visible_label_records"][0]
        label["visible_bounds"][3] = 8
        label["fully_visible"] = False
        with self.assertRaises(ValueError): self.inspect(capture, case)

    def test_wrong_zoom_source_is_refused(self):
        capture, case = self.fixture("overview-zoom")
        capture["preview_sha256"] = "0" * 64
        with self.assertRaises(ValueError): self.inspect(capture, case)

    def test_zoom_cannot_be_relabelled_native(self):
        capture, case = self.fixture("overview-zoom")
        capture["image_scope"] = "actual native World"
        with self.assertRaises(ValueError): self.inspect(capture, case)


if __name__ == "__main__":
    unittest.main()
