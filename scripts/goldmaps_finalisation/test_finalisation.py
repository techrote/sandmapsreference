"""Meaningful contract and adversarial consumer tests; no native claims."""
import copy
import json
import os
from pathlib import Path
import sys
import tempfile
import unittest

import numpy as np
from PIL import Image

sys.path.insert(0,str(Path(__file__).resolve().parent))
from core import clear_centres, decode_setup, digest, git_blob, image_parity, safe_relative, write_json
from corpus import Corpus, DEFAULT, corpus_lock, source_identity


def setup(edits):
    return {'version':2,'extent':[512,512],'actors':[],'next_id':1,'selected':0,'edits':edits,
            'response':'LA-SELECTIVE','liquid_policy':[1],'normalize':False,'rule_radius':2,
            'source':[],'material':58,'brush':8,'fire':False}


class ReplayContracts(unittest.TestCase):
    def decode(self,value):
        with tempfile.TemporaryDirectory() as directory:
            path=Path(directory)/'setup.json';write_json(path,value)
            return decode_setup(path)

    def test_ordered_erase_and_disc_exact_cells(self):
        _,grid,receipt=self.decode(setup([[0,0,5,5,58],[2,2,2,2,0],[0,0,2,62]]))
        expected=np.zeros((512,512),dtype=np.uint8);expected[:5,:5]=58;expected[2:4,2:4]=0
        for y in range(3):
            for x in range(3):
                if x*x+y*y<=4:expected[y,x]=62
        self.assertTrue(np.array_equal(grid,expected))
        self.assertEqual(receipt['full_plane_cells'],512*512)
        self.assertGreater(receipt['overlapped_cells'],0)

    def test_invalid_material_ten_refused(self):
        with self.assertRaises(ValueError):self.decode(setup([[0,0,1,1,10]]))

    def test_outside_rectangle_refused(self):
        with self.assertRaises(ValueError):self.decode(setup([[511,511,2,2,58]]))

    def test_boolean_coordinates_refused(self):
        with self.assertRaises(ValueError):self.decode(setup([[True,0,1,1,58]]))

    def test_nonintegral_coordinates_refused(self):
        with self.assertRaises(ValueError):self.decode(setup([[0.5,0,1,1,58]]))

    def test_nonempty_unknown_source_refused(self):
        value=setup([]);value['source']=[1]
        with self.assertRaises(ValueError):self.decode(value)

    def test_unknown_fields_refused(self):
        value=setup([]);value['automatic_gold_acceptance']=True
        with self.assertRaises(ValueError):self.decode(value)

    def test_foreign_generated_base_not_fabricated(self):
        with self.assertRaises(ValueError):self.decode({'format':'cybersand-generated-start-v1','version':1,'starting_setup':setup([])})

    def test_clearance_matches_brute_windows_and_boundaries(self):
        blocked=np.zeros((17,23),dtype=bool);blocked[7,9]=True;blocked[12,20]=True
        actual=clear_centres(blocked,5,3);expected=np.zeros_like(actual)
        for y in range(1,16):
            for x in range(2,21):expected[y,x]=not blocked[y-1:y+2,x-2:x+3].any()
        self.assertTrue(np.array_equal(actual,expected))

    def test_palette_index_is_not_assumed_material(self):
        with tempfile.TemporaryDirectory() as directory:
            path=Path(directory)/'image.png';Image.fromarray(np.ones((4,4),dtype=np.uint8),'P').save(path)
            grid=np.full((4,4),58,dtype=np.uint8)
            self.assertEqual(image_parity(path,grid)['status'],'FAIL')
            self.assertEqual(image_parity(path,grid,{1:58})['status'],'PASS')
            self.assertEqual(image_parity(path,grid,{0:0})['status'],'UNDECLARED_INDEX')

    def test_rgb_without_authoritative_palette_is_unknown(self):
        with tempfile.TemporaryDirectory() as directory:
            path=Path(directory)/'image.png';Image.new('RGB',(4,4),(0,0,0)).save(path)
            self.assertEqual(image_parity(path,np.zeros((4,4),dtype=np.uint8))['status'],'UNKNOWN_ENCODING')

    def test_path_escape_refused(self):
        for path in ('../setup.json','/tmp/setup.json','C:/setup.json','a\\..\\setup.json'):
            with self.subTest(path=path),self.assertRaises(ValueError):safe_relative(path)

    def test_mutated_input_cannot_reuse_immutable_source_label(self):
        with tempfile.TemporaryDirectory() as directory:
            root=Path(directory);path=root/'setup.json';write_json(path,setup([]))
            raw=path.read_bytes();head='1'*40
            authority={(210,head,'setup.json'):{'sha256':digest(raw),'git_blob':git_blob(raw)}}
            self.assertEqual(source_identity(path,root,head,210,authority)['sha256'],digest(raw))
            value=setup([[0,0,1,1,58]]);write_json(path,value)
            with self.assertRaises(ValueError):source_identity(path,root,head,210,authority)

    def test_unregistered_file_cannot_claim_source_identity(self):
        with tempfile.TemporaryDirectory() as directory:
            root=Path(directory);path=root/'setup.json';write_json(path,setup([]))
            with self.assertRaises(ValueError):source_identity(path,root,'1'*40,210,{})


class ConsumerContracts(unittest.TestCase):
    @classmethod
    def setUpClass(cls):cls.corpus=Corpus(DEFAULT)

    def test_frozen_counts_and_owner_control(self):
        self.assertEqual(self.corpus.data['counts']['frozen_gold_nominees'],25)
        self.assertEqual(len(self.corpus.features),27)
        self.assertEqual(len(self.corpus.data['feature_history']),76)
        self.assertEqual({r['owner_acceptance'] for r in self.corpus.maps},{'PENDING'})

    def test_every_feature_keeps_protected_space_including_preserve(self):
        for feature in self.corpus.features:
            result=self.corpus.recommend(feature['feature_id'])
            self.assertEqual(result['do_not_fill'],feature['do_not_fill'])
            self.assertEqual(result['do_preserve'],feature['must_preserve'])
            self.assertIsNone(result['verified_feature_bbox_xyxy'])
            self.assertFalse(result['evidence_crop_is_edit_mask'])
            self.assertFalse(result['geometry_edits_authorized'])
        self.assertTrue(any(f['treatment']=='DO-PRESERVE' and f['do_not_fill'] for f in self.corpus.features))

    def test_exact_head_mismatch_has_no_fallback(self):
        with self.assertRaises(ValueError):self.corpus.get(125,'0'*40)

    def test_missing_metadata_is_unknown_not_failure(self):
        row=self.corpus.get(125);row['metadata']=None
        self.assertEqual(Corpus._tokens(row),set())
        self.assertEqual(row['source_static_qualification']['status'],'PASS')

    def test_unknown_feature_never_invents_constraints(self):
        with self.assertRaises(ValueError):self.corpus.recommend('invented-feature')

    def test_advice_does_not_assert_machinery_or_authorize_fill(self):
        for feature in self.corpus.features:
            result=self.corpus.recommend(feature['feature_id'])
            self.assertIn('Functional animated machinery',result['do_not_assert'])
            self.assertFalse(result['geometry_edits_authorized'])

    def test_caller_cannot_mutate_corpus_by_returned_object(self):
        row=self.corpus.get(125);row['owner_acceptance']='ACCEPTED'
        self.assertEqual(self.corpus.get(125)['owner_acceptance'],'PENDING')

    def test_weakened_protection_or_acceptance_manifest_refused(self):
        for mutation in ('mask','fill','accepted'):
            data=copy.deepcopy(self.corpus.data)
            if mutation=='mask':data['features'][0]['evidence_crop_is_edit_mask']=True
            elif mutation=='fill':data['features'][0]['do_not_fill']=[]
            else:data['maps'][0]['owner_acceptance']='ACCEPTED'
            with tempfile.TemporaryDirectory() as directory:
                path=Path(directory)/'corpus.json';write_json(path,data)
                corpus_lock(path,data)
                with self.assertRaises(ValueError):Corpus(path)

    def test_dataset_byte_tampering_refused(self):
        with tempfile.TemporaryDirectory() as directory:
            path=Path(directory)/'corpus.json';write_json(path,self.corpus.data);corpus_lock(path,self.corpus.data)
            path.write_bytes(path.read_bytes()+b' ')
            with self.assertRaises(ValueError):Corpus(path)

    def test_failed_interventions_are_negative_and_nearby(self):
        related=self.corpus.related(152)
        self.assertEqual(len(related['negative_interventions']),2)
        self.assertTrue(all(r['status']=='FAILED_INTERVENTION' and not r['accepted_positive_example'] for r in related['negative_interventions']))
        self.assertEqual(len(self.corpus.data['negative_examples']),5)

    def test_portrait_ancestry_is_explicit_not_a_duplicate_verdict(self):
        family=self.corpus.related(197)['comparative_families'][0]
        self.assertEqual(family['donor_pr'],37)
        self.assertIn('does not imply redundant',family['interpretation'])

    def test_all_zero_policy_remains_a_visible_native_warning(self):
        for pr in (155,183):
            row=self.corpus.get(pr)
            self.assertTrue(row['material_plane']['liquid_policy_all_zeroes'])
            self.assertTrue(row['source_static_qualification']['warnings'])

    def test_native_evidence_never_inferred_from_static_pass(self):
        for row in self.corpus.maps:
            if row['native_qualification'] is None:
                self.assertNotIn('NATIVE_PASS',json.dumps(row['source_static_qualification']))

    def test_source_crop_tampering_refused(self):
        feature=self.corpus.features[0]
        with tempfile.TemporaryDirectory() as directory:
            root=Path(directory)/'sources';path=root/feature['image']['archive_path'];path.parent.mkdir(parents=True)
            path.write_bytes(b'tampered')
            output=Path(directory)/'out.png'
            with self.assertRaises(ValueError):self.corpus.retrieve_crop(feature['feature_id'],root,output)
            self.assertFalse(output.exists())

    def test_source_crop_symlink_escape_refused(self):
        feature=self.corpus.features[0]
        with tempfile.TemporaryDirectory() as directory:
            root=Path(directory)/'sources';path=root/feature['image']['archive_path'];path.parent.mkdir(parents=True)
            outside=Path(directory)/'outside';outside.write_bytes(b'not-a-source');path.symlink_to(outside)
            with self.assertRaises(ValueError):self.corpus.retrieve_crop(feature['feature_id'],root,Path(directory)/'out.png')


if __name__=='__main__':unittest.main(verbosity=2)
