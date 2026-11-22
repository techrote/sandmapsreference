import unittest
import numpy as np
import validate_cells as v


class IndependentAdversaries(unittest.TestCase):
    def test_compact_roundtrip_preserves_all_cells(self):
        a=np.array([[0,58,58,0],[0,58,58,0],[0,58,0,77],[0,58,0,77]],dtype=np.uint8)
        rects=v.compact_rectangles(a);r=v.compact_check(a,rects)
        self.assertEqual(r['overlap_cells'],0);self.assertEqual(r['mismatch_cells'],0)
        self.assertEqual(rects,[[1,0,2,2,58],[1,2,1,2,58],[3,2,1,2,77]])

    def test_two_replayers_match_clipped_circle_and_ordered_erase(self):
        cat,_=v.load_catalogue();s={'extent':[12,10],'edits':[[0,0,12,10,58],[1,1,3,0],[5,5,4,4,77]]}
        a,r=v.replay(s,cat);self.assertEqual(a.tobytes(),v.replay_independent(s));self.assertGreater(r['raw_overlapped_cells'],0)
        self.assertEqual(int(a[0,0]),0);self.assertEqual(int(a[9,11]),58)

    def test_exact_centre_is_never_relocated(self):
        free=np.ones((12,12),dtype=bool);free[4,4]=False
        self.assertIsNone(v.shortest_path(free,[4,4],[9,9]))
        self.assertFalse(v.point_status(free,[4,4])['clear'])

    def test_no_row_wrap_and_no_diagonal_route(self):
        a=np.zeros((3,3),dtype=bool);a[0,2]=True;a[1,0]=True
        self.assertIsNone(v.shortest_path(a,[2,0],[0,1]))
        a[1,0]=False;a[1,1]=True
        self.assertIsNone(v.shortest_path(a,[2,0],[1,1]))

    def test_full_envelope_and_exterior_are_blocked(self):
        b=np.zeros((45,45),dtype=bool);b[22,22]=True
        f=v.clear_centres(b,19,15)
        self.assertFalse(f[22,31]);self.assertTrue(f[22,32])
        self.assertFalse(f[22,8]);self.assertTrue(f[22,9]);self.assertFalse(f[6,10])

    def test_diagonal_reaction_and_acid_concrete(self):
        cat,pairs=v.load_catalogue();a=np.zeros((5,5),dtype=np.uint8)
        a[1,1]=3;a[2,2]=8;a[4,3]=12;a[4,4]=58
        r=v.contacts_report(a,cat,pairs)
        self.assertEqual(r['pair_reactive_contacts']['3:8'],1)
        self.assertEqual(r['generic_acid_dissolvable_contacts']['12:58'],1)
        a[4,4]=1;r=v.contacts_report(a,cat,pairs)
        self.assertNotIn('1:12',r['generic_acid_dissolvable_contacts'])

    def test_rooting_uses_four_neighbours(self):
        a=np.zeros((4,4),dtype=bool);a[3,0]=True;a[2,1]=True
        r=v.component_report(a)
        self.assertEqual(r['rooted_cells'],1);self.assertEqual(r['unrooted_cells'],1)


if __name__=='__main__':unittest.main()
