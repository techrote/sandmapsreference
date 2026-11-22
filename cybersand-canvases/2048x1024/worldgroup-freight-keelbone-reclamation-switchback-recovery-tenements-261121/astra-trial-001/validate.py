"""Exact-cell preservation and frozen conservative-route validation."""
from pathlib import Path
import argparse,hashlib,json
import numpy as np
from scipy import ndimage
from geometry_core import *


def read_json(p):return json.loads(Path(p).read_text())
def blocked_grid(grid,rects):
 s=grid!=0
 for x,y,w,h in rects:s[y:y+h,x:x+w]=True
 return s

def route_mask(grid,hull,route):
 mask=clearance_mask(blocked_grid(grid,route.get('obstructions',[])),(hull[0]//2,hull[0]//2,hull[1]//2,hull[1]//2))
 for x,y,w,h in route.get('forbidden_centres',[]):mask[y:y+h,x:x+w]=False
 return mask

def connected_points(mask,points):
 labels,n=ndimage.label(mask,FOUR_NEIGHBOUR);w=mask.shape[1];h=mask.shape[0]
 values=[int(labels[y,x]) if 0<=x<w and 0<=y<h else 0 for x,y in points]
 return all(values) and len(set(values))==1

def validate(root):
 root=Path(root);cfg=read_json(root/'build-config.json');fixture=read_json(root/'fixture.json');allow=read_json(root/'preservation-contract.json')
 source=read_json(root/'baseline'/cfg['original_setup_filename']);candidate=read_json(root/'setup.json');w,h=source['extent']
 before,_=reconstruct(w,h,source['edits'],legal_materials=set(range(132))-{10})
 after,structure=reconstruct(w,h,candidate['edits'],legal_materials=set(range(132))-{10})
 issues=[];difference=changed_cell_report(before,after);changed=before!=after
 if {k:v for k,v in source.items() if k!='edits'}!={k:v for k,v in candidate.items() if k!='edits'}:issues.append('Non-edit Setup settings changed.')
 allowed=np.zeros((h,w),dtype=bool)
 for r in allow['regions']:
  x,y,ww,hh=r['xywh'];allowed[y:y+hh,x:x+ww]=True
 outside=int((changed&~allowed).sum())
 if outside:issues.append(f'{outside} changed cells outside approved ROI union.')
 if difference['changed_cells']>allow['maximum_changed_cells']:issues.append('Changed-cell cap exceeded.')
 protected=[]
 for point in fixture['points']:
  x,y=point['xy'];count=int(changed[y-13:y+14,x-15:x+16].sum())
  if count:protected.append({'id':point['id'],'changed_cells':count})
 if protected:issues.append('Named conservative hull footprint changed.')
 used=set(map(int,np.unique(after)))-{0}
 catalogue=read_json(root/'material-catalogue.json');materials={r['id']:r for r in catalogue['materials']}
 invalid=[m for m in used if not (materials[m]['valid'] and materials[m]['hard_surface'] and not materials[m]['movable'] and materials[m]['kernel']=='none')]
 if invalid:issues.append('Nonpermanent/non-hard material used.')
 vocabulary=set(cfg['original_used_material_vocabulary'])
 new_vocab=sorted(used-vocabulary)
 if new_vocab:issues.append('Material not present in actual original source vocabulary.')
 present_pairs=[r for r in catalogue.get('pairs',[]) if r['source'] in used and r['target'] in used]
 # Pair rules are preserved explicitly; zero potential current-material pairs is a definite check.
 if present_pairs:issues.append('Present material pair requires separate permanence inspection.')
 grounding=grounded_report(after!=0)
 if fixture.get('anchor_boxes'):
  if grounding['not_boundary_rooted_cells']:issues.append('Unrooted final cells under frozen all-boundary policy.')
 elif grounding['not_bottom_rooted_cells']:issues.append('Unrooted final cells under frozen bottom policy.')
 if (root/'setup.json').stat().st_size>1048576:issues.append('Setup exceeds current engine JSON capacity.')
 occupied=int((after!=0).sum())
 if occupied>8*w*h:issues.append('Native rectangle work budget exceeded.')
 routes={};site_records={};site_tuples=[(p['id'],*p['xy']) for p in fixture['points']]
 points={p['id']:p['xy'] for p in fixture['points']}
 for hull in ((19,15),(23,19),(31,27)):
  name=f'{hull[0]}x{hull[1]}';mask=route_mask(after,hull,{})
  result=site_reachability(mask,fixture['spawn'],site_tuples);site_records[name]={'normal':result,'obstructed':[]}
  if result['sites_reached']!=result['sites_total']:issues.append(name+' normal sites unreachable.')
  for case in fixture['obstruction_cases']:
   cmask=route_mask(after,hull,{'obstructions':[case['rect']]})
   result=site_reachability(cmask,fixture['spawn'],site_tuples)
   missed=sorted(r['name'] for r in result['sites'] if not r['reachable'])
   if missed!=sorted(case['expected_covered_sites']):issues.append(name+' obstruction exception set changed: '+str(missed))
   site_records[name]['obstructed'].append({'case':case['id'],'expected_covered_sites':case['expected_covered_sites'],'observed_unreachable_sites':missed,'result':result})
  routes[name]=[]
  for route in fixture['routes']:
   via=[points[v] if isinstance(v,str) else v for v in route['via']]
   rm=route_mask(after,hull,route);reachable=bool(connected_points(rm,via))
   r={'id':route['id'],'via':via,'reachable':reachable,'obstructions':route.get('obstructions',[]),'forbidden_centres':route.get('forbidden_centres',[])}
   if not reachable:issues.append(name+' frozen route unreachable: '+route['id'])
   if hull==(31,27) and len(via)==2 and reachable:
    path=shortest_path(rm,via[0],via[-1]);r.update(path_report(path))
   if 'forced_region' in route:
    x,y,ww,hh=route['forced_region'];excluded=rm.copy();excluded[y:y+hh,x:x+ww]=False
    without=bool(connected_points(excluded,via));r['forced_region_test']={'region':route['forced_region'],'endpoints_connected_with_gallery_forbidden':without,'necessity_proved':not without}
   routes[name].append(r)
 regions=[]
 for r in allow['regions']:
  x,y,ww,hh=r['xywh'];regions.append({'id':r['id'],'xywh':r['xywh'],'changed_cells':int(changed[y:y+hh,x:x+ww].sum()),'before_material_plane_sha256_uint8':hashlib.sha256(before[y:y+hh,x:x+ww].astype(np.uint8).tobytes()).hexdigest(),'after_material_plane_sha256_uint8':hashlib.sha256(after[y:y+hh,x:x+ww].astype(np.uint8).tobytes()).hexdigest()})
 result={'schema_version':1,'arm':cfg['arm'],'status':'PASS' if not issues else 'FAIL','qualification_scope':'SOURCE-STATIC AUTHOR CHECK; independent ART and native qualification separate','issues':issues,
 'engine_head':catalogue['engine_head'],'frozen_commit':cfg['frozen_commit'],'difference':difference,'changed_cell_cap':allow['maximum_changed_cells'],'outside_approved_regions_changed_cells':outside,
 'protected_named_31x27_footprint_changes':protected,'regions':regions,'structure':structure,'setup_bytes':(root/'setup.json').stat().st_size,'original_settings_preserved':not any('settings' in x for x in issues),
 'used_material_ids':sorted(used),'newly_restored_original_source_ids':sorted(used-set(map(int,np.unique(before)))),'invalid_permanent_material_ids':invalid,'present_pair_reaction_rules':present_pairs,
 'material_scope':'Hard, immovable, kernel-none cells; no active fluid/hot/acid drivers present. This is initial static permanence, not immunity under future authored hazards.',
 'rooting':grounding,'rooting_policy':fixture['anchor_policy'],'sites':site_records,'routes':routes,'actual_midge':{'size':[4,3],'continuous_COM_bounds':[-2,-1.5,4,3],'native_collision_test':'NOT_PERFORMED_BY_AUTHOR'},'native_status':'NATIVE-UNTESTED'}
 (root/'validation.json').write_text(json.dumps(result,indent=2)+'\n');(root/'cell-diff.json').write_text(json.dumps(difference,indent=2)+'\n')
 return result

if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--bundle',default=str(Path(__file__).resolve().parent));args=parser.parse_args();r=validate(Path(args.bundle));print(json.dumps({'arm':r['arm'],'status':r['status'],'issues':r['issues'],'changed_cells':r['difference']['changed_cells']}))
 if r['status']!='PASS':raise SystemExit(1)
