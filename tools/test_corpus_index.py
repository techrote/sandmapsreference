#!/usr/bin/env python3
import importlib.util
import pathlib
import unittest

HERE=pathlib.Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location("corpus_index",HERE/"corpus_index.py")
ci=importlib.util.module_from_spec(spec); spec.loader.exec_module(ci)

def canonical(role="test yard", motif="gantry"):
    return {
      "schema_version":1,
      "purpose":["human_editable_canvas","procedural_exemplar"],
      "family":"Test Family",
      "map_role":role,
      "anchor_donors":["wide-test"],
      "macro_topology":["asymmetric yard","lower service cut"],
      "density_profile":"dense edges around open centre",
      "route_grammar":["upper bypass","lower recovery"],
      "strong_motifs":[motif,"offset tower"],
      "interesting_relationships":["service route crosses below main plant"],
      "authoring_affordances":["open annex seam"],
      "setpiece_candidates":["bridge failure"],
      "procedural_exemplar_value":["asymmetric support relationship"],
      "similarity_avoidance":["not another central wheel"],
      "diversity_axes":{
        "macro_topology":["yard"],
        "route_structure":["branch_rejoin"],
        "incompleteness":["editable_gaps"]
      }
    }

class CorpusIndexTests(unittest.TestCase):
    def test_canonical_valid(self):
        checked=ci.validate(canonical())
        self.assertEqual(checked["status"],"canonical-valid")
        self.assertFalse(checked["errors"])
        self.assertFalse(checked["warnings"])

    def test_flexible_similarity_string_is_normalized(self):
        value=canonical(); value["similarity_avoidance"]="not another drydock"
        checked=ci.validate(value)
        self.assertEqual(checked["status"],"canonical-valid")
        self.assertEqual(checked["normalized"]["similarity_avoidance"],["not another drydock"])

    def test_singular_descriptive_strings_are_normalized(self):
        value=canonical(); value["macro_topology"]="braided canyon"; value["route_grammar"]="branch and rejoin"
        checked=ci.validate(value)
        self.assertEqual(checked["status"],"canonical-valid")
        self.assertEqual(checked["normalized"]["macro_topology"],["braided canyon"])
        self.assertEqual(checked["normalized"]["route_grammar"],["branch and rejoin"])

    def test_legacy_is_partial_without_fabricating_missing_claims(self):
        legacy={
          "schema":"cybersand-exemplar-v1",
          "world_family":"Underroot Relay System",
          "worksite":"Seepage Catchment",
          "uses":["human-editable-canvas","spatial-procedural-exemplar","scripted-event-setpiece"],
          "topology":["vertical fault","stepped catchment"],
          "routing":["upper bypass","lower return"],
          "distinctive_material_motifs":["basalt shoulders"],
          "event_sites":["pressure release"]
        }
        checked=ci.validate(legacy)
        self.assertEqual(checked["status"],"legacy-partial")
        self.assertEqual(checked["normalized"]["family"],"Underroot Relay System")
        self.assertIn("density_profile",checked["missing_fields"])
        self.assertNotIn("density_profile",checked["normalized"])

    def test_nearest_neighbor_prefers_shared_structure(self):
        a=canonical("A","gantry"); b=canonical("B","gantry")
        c=canonical("C","biological cavern")
        c["macro_topology"]=["nested fungal cavities"]; c["route_grammar"]=["vertical shafts"]
        records=[{"id":"a","metadata":a},{"id":"b","metadata":b},{"id":"c","metadata":c}]
        near=ci.neighbors(records)
        self.assertEqual(near["a"][0]["id"],"b")
        self.assertGreater(near["a"][0]["score"],near["a"][-1]["score"])

    def test_diversity_reports_explicit_gaps(self):
        records=[{"id":"a","metadata":canonical()}]
        d=ci.diversity(records)
        self.assertEqual(d["macro_topology"]["counts"]["yard"],1)
        self.assertIn("ring",d["macro_topology"]["unrepresented"])
        text=ci.report({"records":records,"open_prs_inspected":1,"diversity":d,"nearest_neighbors":{"a":[]},"repository":"x"})
        self.assertIn("Explicit diversity-axis gaps",text)

    def test_scope_discovery_ignores_non_corpus(self):
        self.assertEqual(ci.mapdir("cybersand-canvases/2048x1024/worldgroup-test/overview.png"),
                         "cybersand-canvases/2048x1024/worldgroup-test")
        self.assertIsNone(ci.mapdir("artwork/reference.png"))

if __name__=="__main__":
    unittest.main()
