#!/usr/bin/env python3
"""Separate current-main compatibility evidence; never replace frozen authority.

Runs three representative exact Setups through the actual current Workbench,
with source-content comparisons for schema, actor, material and native ABI.
This is a deliberately separate receipt, not requalification of the experiment
against a substituted engine and not exhaustive current-main corpus admission.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import uuid

from native_matrix import ENGINE, HERE, LINUX_GODOT, record, run, sha, write_json

CONTRACTS = [
    'godot/scripts/workbench_setup.gd', 'godot/scripts/workbench_actor_catalog.gd',
    'godot/scripts/physical_actor_session.gd', 'godot/scripts/main.gd',
    'godot/authoring/flyers/midge.json', 'native/include/cybersand/material.hpp',
    'godot/addons/cybersand_native/cybersand_native.gdextension',
    'godot/addons/cybersand_native/runtime-provenance.linux.json',
    'godot/addons/cybersand_native/runtime-provenance.json',
    'godot/addons/godot-rapier2d/runtime-provenance.linux.json',
    'godot/scripts/shared_workbench.gd',
]


def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--engine-repo',type=Path,required=True)
    ap.add_argument('--current-project',type=Path,required=True)
    ap.add_argument('--current-head',required=True)
    ap.add_argument('--godot',type=Path,required=True)
    ap.add_argument('--native-matrix-out',type=Path,required=True)
    ap.add_argument('--out',type=Path,required=True)
    args=ap.parse_args()
    if args.out.exists():raise ValueError('Refuse existing compatibility evidence')
    if sha(args.godot)!=LINUX_GODOT:raise ValueError('Compatibility probe requires the same Godot4.7 runtime')
    tree=subprocess.check_output(['git','-C',str(args.engine_repo),'rev-parse',args.current_head+'^{tree}'],text=True).strip()
    comparisons=[]
    for path in CONTRACTS:
        before=subprocess.check_output(['git','-C',str(args.engine_repo),'rev-parse',ENGINE+':'+path],text=True).strip()
        after=subprocess.check_output(['git','-C',str(args.engine_repo),'rev-parse',args.current_head+':'+path],text=True).strip()
        comparisons.append({'path':path,'frozen_blob':before,'current_blob':after,'unchanged':before==after})
    listing=subprocess.check_output(['git','-C',str(args.engine_repo),'ls-tree','-r',args.current_head,'godot'],text=True)
    source_files_verified=0
    for line in listing.splitlines():
        meta,name=line.split('\t',1)
        if Path(name).suffix not in ('.gd','.json','.tscn','.tres','.gdextension','.godot'):
            continue
        data=(args.current_project/Path(name).relative_to('godot')).read_bytes()
        blob=hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()
        if blob!=meta.split()[2]:raise ValueError('Actual current project differs from claimed commit: '+name)
        source_files_verified+=1
    for provenance_path in ('addons/cybersand_native/runtime-provenance.linux.json','addons/godot-rapier2d/runtime-provenance.linux.json'):
        provenance=json.loads((args.current_project/provenance_path).read_text())
        binary=args.current_project/Path(provenance['artifact']).relative_to('godot')
        if sha(binary)!=provenance['sha256']:raise ValueError('Current native binary differs from committed provenance')
    args.out.mkdir(parents=True)
    project=args.out/'current-runtime'
    shutil.copytree(args.current_project,project,ignore=shutil.ignore_patterns('.godot','project.godot','tests','tools'))
    nonce=uuid.uuid4().hex[:10]
    project_name='GOLDMAPS Current Compatibility '+nonce
    config=('config_version=5\n[application]\nconfig/name='+json.dumps(project_name)+
            '\nconfig/features=PackedStringArray("4.7")\n[autoload]\nFeatureNavigation="*res://scripts/feature_navigation.gd"\n'
            '[cybersand]\nnative_worker_threads=2\n[physics]\n2d/physics_engine="Rapier2D"\n[rendering]\nrenderer/rendering_method="gl_compatibility"\n')
    (project/'project.godot').write_text(config)
    shutil.copyfile(HERE/'native_probe.gd',project/'compat-probe.gd')
    preflight_script='extends SceneTree\nfunc _initialize()->void:\n var p=OS.get_user_data_dir().path_join("workbench")\n DirAccess.make_dir_recursive_absolute(p)\n print("COMPAT_PROFILE ",JSON.stringify({"path":p}))\n quit()\n'
    (project/'compat-profile.gd').write_text(preflight_script)
    before_hashes={p.relative_to(project).as_posix():sha(p) for p in project.rglob('*') if p.is_file()}
    imp,_=run([args.godot,'--headless','--path',project,'--import'],args.out/'import.log',timeout=240)
    if imp['exit_code']:raise RuntimeError('Current accepted engine import failed')
    pre,text=run([args.godot,'--headless','--path',project,'--script','res://compat-profile.gd'],args.out/'preflight.log')
    profile=record(text,'COMPAT_PROFILE ')
    if pre['exit_code'] or not profile:raise RuntimeError('Current accepted engine profile unavailable')
    workbench=Path(profile['path'])
    if project_name not in workbench.parts or any(workbench.iterdir()):raise ValueError('Current compatibility profile not isolated')
    rows=json.loads((HERE/'native_inputs.v1.json').read_text())['records']
    cases=[]
    for name in ('trial-C1-candidate','trial-B3-candidate','derived-155-policy'):
        row=next(r for r in rows if r['id']==name)
        source=args.native_matrix_out/'inputs'/(row['setup_sha256']+'.json')
        if sha(source)!=row['setup_sha256']:raise ValueError('Representative input identity mismatch')
        label='compat-'+name.lower();saved=label+'-saved'
        staged=workbench/('setup-'+label+'.json');staged.write_bytes(source.read_bytes())
        case={'id':name,'setup_sha256':row['setup_sha256'],'phases':{}}
        for phase in ('load','reopen'):
            env=os.environ.copy();env.update(CYBERSAND_ADMISSION_LABEL=label,CYBERSAND_ADMISSION_SAVED_LABEL=saved,CYBERSAND_ADMISSION_PHASE=phase)
            rec,text=run([args.godot,'--headless','--path',project,'--script','res://compat-probe.gd'],args.out/(name+'.'+phase+'.log'),env=env,timeout=240)
            rec['evidence']=record(text,'CANVAS_NATIVE_EVIDENCE ');case['phases'][phase]=rec
            if rec['exit_code']:break
        savedpath=workbench/('setup-'+saved+'.json')
        case['authored_save_equal']=savedpath.exists() and json.loads(savedpath.read_text())==json.loads(source.read_text())
        case['source_unchanged']=sha(staged)==row['setup_sha256']
        le=case['phases'].get('load',{}).get('evidence') or {};re=case['phases'].get('reopen',{}).get('evidence') or {}
        case['pass']=bool(le.get('full_grid') and le.get('actor_adopted') and le.get('midge_drive') and le.get('collision_observed') and re.get('fresh_reopen') and case['authored_save_equal'] and case['source_unchanged']
                          and case['phases']['load']['process_id']!=case['phases'].get('reopen',{}).get('process_id'))
        cases.append(case);write_json(args.out/(name+'.receipt.json'),case)
        print('GOLDMAPS_COMPATIBILITY_CASE '+json.dumps(case),flush=True)
    changed=[p for p,h in before_hashes.items() if sha(project/p)!=h]
    summary={'schema':'goldmaps.current-engine-compatibility.v1','frozen_authority':ENGINE,'current_accepted_head':args.current_head,'current_tree':tree,
             'godot_sha256':sha(args.godot),'native_probe_sha256':sha(HERE/'native_probe.gd'),'contract_source_comparisons':comparisons,
             'native_binary_sha256':sha(project/'addons/cybersand_native/bin/libcybersand_native.linux.x86_64.so'),
             'rapier_sha256':sha(project/'addons/godot-rapier2d/bin/libgodot_rapier.linux.x86_64-unknown-linux-gnu.so'),
             'source_export':'git archive CURRENT_HEAD godot; new isolated runtime/project configuration',
             'source_files_git_blob_verified':source_files_verified,
             'runtime_source_changes':changed,'cases':cases,'pass':all(c['pass'] for c in cases) and not changed,
             'scope':'Three representative native load/full-grid/Midge movement/contact/authored save/fresh reopen cases on separately pinned current main. Schema/material/actor/ABI source identity audited; not exhaustive current-engine corpus qualification. Frozen experiment remains at original engine.'}
    write_json(args.out/'summary.json',summary);print('GOLDMAPS_COMPATIBILITY_SUMMARY '+json.dumps(summary),flush=True)
    return 0 if summary['pass'] else 1


if __name__=='__main__':raise SystemExit(main())
