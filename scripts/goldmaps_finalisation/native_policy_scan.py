#!/usr/bin/env python3
"""Validate every recovered primary Setup's policy with the pinned native bridge.

This is narrower than map admission. Native policy refusals remain failures of
the original sources; an expected-refusal count does not qualify those maps.
"""
import argparse
import json
import os
from pathlib import Path
import subprocess

from native_matrix import ENGINE, HERE, LINUX_GODOT, LINUX_NATIVE, LINUX_RAPIER, record, run, sha, verify_package, write_json


def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--corpus',type=Path,required=True)
    ap.add_argument('--source-archive',type=Path,required=True)
    ap.add_argument('--project',type=Path,required=True)
    ap.add_argument('--package',type=Path,required=True)
    ap.add_argument('--godot',type=Path,required=True)
    ap.add_argument('--out',type=Path,required=True)
    args=ap.parse_args()
    if args.out.exists():raise ValueError('Refuse overwriting native policy evidence')
    libraries={
        args.godot:LINUX_GODOT,
        args.project/'addons/cybersand_native/bin/libcybersand_native.linux.x86_64.so':LINUX_NATIVE,
        args.project/'addons/godot-rapier2d/bin/libgodot_rapier.linux.x86_64-unknown-linux-gnu.so':LINUX_RAPIER,
    }
    for path,digest in libraries.items():
        if sha(path)!=digest:raise ValueError('Pinned native policy runtime identity mismatch')
    package_check=verify_package(args.package)
    source_checks=[]
    for item in json.loads((args.package/'package-files.v1.json').read_text())['files']:
        path=Path(item['path'])
        if path.parts[0]!='godot' or path.suffix not in ('.gd','.tscn','.tres','.json','.gdextension'):
            continue
        if 'runtime-provenance' in path.name or 'runtime-manifest' in path.name:continue
        actual=args.project/Path(*path.parts[1:])
        if sha(actual)!=item['sha256']:raise ValueError('Project schema/actor source differs from frozen package: '+str(path))
        source_checks.append({'path':str(path),'sha256':item['sha256']})
    corpus=json.loads(args.corpus.read_text())
    inputs=[]
    for row in corpus['maps']:
        source=row['source']
        if source['archive_collection']!='sources':continue
        path=(args.source_archive/source['archive_path']).resolve()
        if sha(path)!=source['sha256']:raise ValueError('Corpus Setup identity mismatch')
        inputs.append({'id':row['id'],'pr':row['pr'],'head':row['head'],
                       'setup_sha256':source['sha256'],'path':str(path)})
    args.out.mkdir(parents=True)
    write_json(args.out/'inputs.json',inputs)
    env=os.environ.copy();env['GOLDMAPS_POLICY_INPUTS']=str((args.out/'inputs.json').resolve())
    rec,text=run([args.godot,'--headless','--path',args.project,'--script',HERE/'native_policy_probe.gd'],args.out/'native-policy.log',env=env,timeout=60)
    rows=record(text,'GOLDMAPS_POLICY_PROBE ')
    if rec['exit_code'] or not rows or len(rows)!=len(inputs):raise RuntimeError('Native policy probe did not complete')
    refused=[r for r in rows if not r['validation']['accepted']]
    schema_refused=[r for r in rows if not r['workbench_schema_accepted']]
    source_head=subprocess.check_output(['git','-C',str(HERE.parent.parent),'rev-parse','HEAD'],text=True).strip()
    summary={'schema':'goldmaps.native-policy.v1','engine_head':ENGINE,
             'executed_checkout_head':source_head,'runner_sha256':sha(Path(__file__)),
             'probe_sha256':sha(HERE/'native_policy_probe.gd'),'corpus_sha256':sha(args.corpus),
             'godot_sha256':LINUX_GODOT,'native_bridge_sha256':LINUX_NATIVE,'rapier_sha256':LINUX_RAPIER,
             'package_check':package_check,'frozen_project_source_files_verified':len(source_checks),
             'project_source_files':source_checks,
             'execution':rec,'sources_checked':len(rows),'accepted_policies':len(rows)-len(refused),
             'refused_policies':len(refused),'accepted_workbench_schemas':len(rows)-len(schema_refused),
             'refused_workbench_schemas':len(schema_refused),'results':rows,'pass':not refused and not schema_refused,
             'validation_completed':all(r['source_unchanged'] for r in rows),
             'scope':'Actual pinned native policy-envelope validation and source-matched Workbench Setup.validate (including actor definition/options/control). No full map load, movement, save, visual or owner acceptance.'}
    write_json(args.out/'summary.json',summary)
    print(json.dumps({k:summary[k] for k in ('sources_checked','accepted_policies','refused_policies','pass','validation_completed')}))
    return 0 if summary['validation_completed'] else 1


if __name__=='__main__':raise SystemExit(main())
