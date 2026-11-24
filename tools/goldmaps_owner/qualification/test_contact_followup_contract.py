#!/usr/bin/env python3
"""Synthetic authority/history fixtures only; no native execution or PASS claim."""
import copy
import json
import unittest
from unittest.mock import patch

from review_final_artifact import (CONTACT_INPUT, CONTACT_KIND, CONTACT_TARGETS, ENGINE, SCIENTIFIC,
                                   digest, inspect_contact_followup)


def encoded(value):
    return (json.dumps(value, sort_keys=True) + "\n").encode()


class ContactFollowupContract(unittest.TestCase):
    def setUp(self):
        self.files = {}
        self.new_head, self.old_head = "f" * 40, "a" * 40
        self.new_run, self.old_run = "22", "11"
        old_input = {"schema": "fixture-input.v1", "engine_head": ENGINE, "scientific_engine_head": SCIENTIFIC,
                     "records": [{"id": name, "extent": [1024, 2048],
                                  "setup_sha256": target["setup_sha256"],
                                  "material_plane_sha256": target["material_plane_sha256"]}
                                 for name, target in CONTACT_TARGETS.items()]}
        old_input_path = "collection/native-inputs-optional.v1.json"
        self.files[old_input_path] = encoded(old_input)
        self.audit = encoded({"scope": "synthetic authority fixture, no actual geometry assessment"})
        self.files["collection/contact-followup-source-static-audit.v1.json"] = self.audit
        self.inputs = {**old_input, "counts": {"logical_aliases": 3, "unique_setups": 3},
                       "records": [{**row, "contact_probe_tick_limit": 1800} for row in old_input["records"]],
                       "source_static_contact_targets": copy.deepcopy(CONTACT_TARGETS),
                       "source_static_audit": {"path": "docs/corpus/goldmaps-owner-delivery-001/corpus/optional-contact-static-assessment.v1.json",
                                               "sha256": digest(self.audit)},
                       "prior_input": {"path": old_input_path, "sha256": digest(self.files[old_input_path])}}
        self.files[CONTACT_INPUT] = encoded(self.inputs)
        old_summary_path = "qualification/windows-optional/summary.json"
        self.files[old_summary_path] = encoded({"scope": "synthetic prior summary"})
        old_overlay, self.fresh_overlay = {"setups": {}}, {"setups": {}}
        self.overlay = {"setups": {}}
        self.summary = {"results": [], "route_results": [], "github_run_id": self.new_run}
        transitions = []
        for name, target in CONTACT_TARGETS.items():
            setup_hash = target["setup_sha256"]
            filename = name + ".receipt.json"
            old_result = {"pass": False, "contact_pass": False, "movement_pass": True,
                          "phases": {"load": {"evidence": {"collision_probe": {"tick_budget": 900}}}}}
            old_path = "qualification/windows-optional/" + filename
            self.files[old_path] = encoded(old_result)
            old_entry = {"status": "UNQUALIFIED", "aliases": [name], "owner_accepted": False,
                         "receipt": filename, "receipt_sha256": digest(self.files[old_path])}
            old_overlay["setups"][setup_hash] = old_entry
            history = {**old_entry, "receipt": old_path, "native_execution_source_head": self.old_head,
                       "native_execution_run_id": self.old_run,
                       "native_execution_summary_sha256": digest(self.files[old_summary_path])}
            result = {"id": name, "setup_sha256": setup_hash, "pass": False, "contact_pass": False,
                      "phases": {"load": {"evidence": {"collision_observed": False,
                         "collision_probe": {"tick_budget": 1800, "wall_budget_ms": 90000,
                                             "max_contacts": 0, "witnesses": []}}}}}
            self.summary["results"].append(result)
            current_path = "qualification/" + CONTACT_KIND + "/" + filename
            self.files[current_path] = encoded(result)
            new_entry = {"status": "UNQUALIFIED", "aliases": [name], "owner_accepted": False,
                         "receipt": filename, "receipt_sha256": digest(self.files[current_path])}
            self.fresh_overlay["setups"][setup_hash] = new_entry
            self.overlay["setups"][setup_hash] = {**new_entry, "receipt": current_path,
                "native_execution_source_head": self.new_head, "native_execution_run_id": self.new_run,
                "native_history": [history], "followup_reason": "Bounded synthetic follow-up fixture"}
            transitions.append({"id": name, "setup_sha256": setup_hash, "prior_status": "UNQUALIFIED",
                "prior_receipt": old_path, "prior_receipt_sha256": old_entry["receipt_sha256"],
                "current_status": "UNQUALIFIED", "current_receipt": current_path,
                "current_receipt_sha256": new_entry["receipt_sha256"]})
        self.files["qualification/windows-optional/delivery-qualification.v1.json"] = encoded(old_overlay)
        self.authority = {"source_head": self.new_head, "github_run_id": self.new_run,
                          "summary": "qualification/" + CONTACT_KIND + "/summary.json",
                          "inputs": CONTACT_INPUT, "inputs_sha256": digest(self.files[CONTACT_INPUT]),
                          "targets": list(CONTACT_TARGETS), "transitions": transitions}
        self.overlay["native_followup_authority"] = self.authority
        self.refresh_summary()

    def refresh_summary(self):
        self.files[self.authority["summary"]] = encoded(self.summary)
        self.authority["summary_sha256"] = digest(self.files[self.authority["summary"]])
        self.files["qualification/" + CONTACT_KIND + "/delivery-qualification.v1.json"] = encoded(self.fresh_overlay)
        for entry in self.overlay["setups"].values():
            entry["native_execution_summary_sha256"] = self.authority["summary_sha256"]

    def inspect(self):
        with patch("review_final_artifact.committed_digest", return_value=digest(self.audit)):
            return inspect_contact_followup(self.files.__getitem__, self.overlay, self.new_head, self.new_run,
                                            self.old_head, self.old_run, None)

    def test_complete_negative_followup_retains_reference_status(self):
        result = self.inspect()
        self.assertEqual(result["additional_distinct_setups"], 0)
        self.assertTrue(all(row["current_status"] == "UNQUALIFIED" for row in result["observations"]))

    def test_rewritten_prior_status_is_refused(self):
        next(iter(self.overlay["setups"].values()))["native_history"][0]["status"] = "QUALIFIED_HEADLESS"
        with self.assertRaises(ValueError): self.inspect()

    def test_missing_prior_history_is_refused(self):
        next(iter(self.overlay["setups"].values()))["native_history"] = []
        with self.assertRaises(ValueError): self.inspect()

    def test_old_run_masquerading_as_fresh_is_refused(self):
        next(iter(self.overlay["setups"].values()))["native_execution_run_id"] = self.old_run
        with self.assertRaises(ValueError): self.inspect()

    def test_changed_setup_in_fresh_input_is_refused(self):
        self.inputs["records"][0]["setup_sha256"] = "0" * 64
        self.files[CONTACT_INPUT] = encoded(self.inputs)
        self.authority["inputs_sha256"] = digest(self.files[CONTACT_INPUT])
        with self.assertRaises(ValueError): self.inspect()

    def test_larger_or_missing_population_is_refused(self):
        self.inputs["records"].pop()
        self.files[CONTACT_INPUT] = encoded(self.inputs)
        self.authority["inputs_sha256"] = digest(self.files[CONTACT_INPUT])
        with self.assertRaises(ValueError): self.inspect()

    def test_unreviewed_observation_budget_is_refused(self):
        self.summary["results"][0]["phases"]["load"]["evidence"]["collision_probe"]["tick_budget"] = 3600
        self.refresh_summary()
        with self.assertRaises(ValueError): self.inspect()

    def test_positive_without_actual_contact_witness_is_refused(self):
        result = self.summary["results"][0]
        result["pass"], result["contact_pass"] = True, True
        result["phases"]["load"]["evidence"]["collision_observed"] = True
        setup_hash = result["setup_sha256"]
        self.overlay["setups"][setup_hash]["status"] = "QUALIFIED_HEADLESS"
        self.fresh_overlay["setups"][setup_hash]["status"] = "QUALIFIED_HEADLESS"
        self.authority["transitions"][0]["current_status"] = "QUALIFIED_HEADLESS"
        self.refresh_summary()
        with self.assertRaisesRegex(ValueError, "actual native contact witness"):
            self.inspect()


if __name__ == "__main__":
    unittest.main()
