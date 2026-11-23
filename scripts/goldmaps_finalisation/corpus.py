#!/usr/bin/env python3
"""Build and consume the additive, read-only Goldmaps corpus.

This is an external reference interface, not an authoring permission system.
It never paints a map, accepts an exemplar, or infers missing annotations.
"""
from __future__ import annotations
import argparse
import copy
import json
from pathlib import Path
import re
import shutil
from urllib.parse import urlsplit

from PIL import Image
from core import (LEDGER, RECOVERY, decode_setup, digest, git_blob, json_load,
                  safe_relative, source_dir, write_json)

HERE = Path(__file__).resolve().parents[2]
DEFAULT = HERE/"docs/corpus/goldmaps-finalisation-001/corpus.v1.json"
REPOSITORY = "techrote/sandmapsreference"
GLOBAL_LIMITS = [
    "No automatic geometry editing or owner Gold/Platinum/Pyrite acceptance.",
    "Evidence crop rectangles are viewing windows, never editable masks or exact feature bounds.",
    "Every must_preserve and do_not_fill instruction applies regardless of primary treatment.",
    "Decorative or functional-looking machinery is not demonstrated simulated machinery.",
    "Source-static clearance, topological connection and boundary rooting are not native movement or structural-strength proof.",
    "Missing metadata means unknown; it is not an absent feature or failed example.",
    "Historical failed interventions remain negative evidence, not accepted training examples.",
    "Prior reworker variants are post-lock references and cannot be inserted into frozen experimental inputs.",
]


def source_identity(path, root, head, pr):
    raw = path.read_bytes()
    rel = path.relative_to(root).as_posix()
    return {"repository":REPOSITORY,"pr":pr,"head":head,"path":rel,
            "url":f"https://github.com/{REPOSITORY}/blob/{head}/{rel}",
            "raw_url":f"https://raw.githubusercontent.com/{REPOSITORY}/{head}/{rel}",
            "sha256":digest(raw),"git_blob_sha1":git_blob(raw),"bytes":len(raw),
            "archive_path":f"PR-{pr:04d}-{head[:12]}/{rel}"}


def pins_from(value, out):
    if isinstance(value,dict):
        if isinstance(value.get("pr"),int) and isinstance(value.get("sha"),str) and re.fullmatch(r'[0-9a-f]{40}',value["sha"]):
            pr,head=value["pr"],value["sha"]
            if pr in out and out[pr]!=head:
                raise ValueError(f"Conflicting source pin for PR{pr}")
            out[pr]=head
        for v in value.values():
            pins_from(v,out)
    elif isinstance(value,list):
        for v in value:
            pins_from(v,out)


def historical_roles(pr, inventory):
    result=[]
    for field,label in [("gold25","frozen_gold25_nomination"),("prepass","original_prepass"),
                        ("original_portraits","original_portrait"),("repair_children","portrait_repair"),
                        ("trial_children","astra_material_candidate"),("original_arms","trial_original")]:
        if any(r['pr']==pr for r in inventory[field]):
            result.append(label)
    return result


def build(sources, recovery, science_dir=None, native_dir=None):
    inventory=json_load(recovery/'inventory.v1.json')
    pins={};pins_from(inventory,pins)
    ledger=source_dir(sources,209,LEDGER)/'docs/corpus/astra-trial-001'
    gold={r['pr']:r for r in json_load(ledger/'gold-candidates.v1.json')['records']}
    locks={r['output_pr']:r for r in json_load(ledger/'all-eight-output-lock.v1.json')['arms'] if r['output_pr']}
    manifest=json_load(ledger/'experiment-manifest.v1.json')
    arms={r['pr']:r['arm'] for r in manifest['arms']}
    atlasroot=source_dir(sources,201,pins[201])/'docs/corpus/feature-atlas'
    atlas=json_load(atlasroot/'astra-current.v1.json')
    history=[json.loads(line) for line in (atlasroot/'states.v1.jsonl').read_text().splitlines() if line]
    records=[]
    for pr,head in sorted(pins.items()):
        directory=source_dir(sources,pr,head)
        if pr in locks:
            setup=directory/locks[pr]['setup_path']
        else:
            paths=[p for p in directory.glob('cybersand-canvases/**/*setup*.json') if 'astra-trial-001' not in p.parts]
            if not paths:
                continue
            if len(paths)!=1:
                raise ValueError(f"Ambiguous primary Setup for PR{pr}: {paths}")
            setup=paths[0]
        setup_value,grid,replay=decode_setup(setup)
        parentdir=setup.parent.parent if pr in locks else setup.parent
        exemplar_path=parentdir/'exemplar.json'
        exemplar=json_load(exemplar_path) if exemplar_path.exists() else None
        nom=gold.get(pr)
        title=nom['name'] if nom else (exemplar or {}).get('map_role') or parentdir.name
        images=[]
        image_dir=setup.parent/'images' if pr in locks else parentdir
        for path in sorted(image_dir.glob('*.png')):
            image=source_identity(path,directory,head,pr)
            with Image.open(path) as im:
                image['dimensions']=list(im.size)
            image['role']='material_cell_overview' if 'overview' in path.name or 'preview' in path.name else 'source_evidence_image'
            images.append(image)
        record={
            "id":f"PR{pr}@{head}","pr":pr,"head":head,"name":title,
            "source":source_identity(setup,directory,head,pr),"material_plane":replay,
            "aspect_ratio":"portrait" if grid.shape[0]>grid.shape[1] else "landscape" if grid.shape[1]>grid.shape[0] else "square",
            "roles":historical_roles(pr,inventory),"trial_arm":locks[pr]['arm'] if pr in locks else arms.get(pr),
            "owner_acceptance":"PENDING","native_qualification":None,
            "source_static_qualification":{"status":"PASS","scope":"Independent full Setup replay, schema bounds, material legality and complete plane identity; not full native acceptance."},
            "historical_gold_nomination":None if not nom else {"status":nom['status'],"rank":nom['rank'],"rank_meaning":nom['rank_meaning'],"review_evidence":nom['review_evidence'],"criteria":nom['criteria']},
            "current_recommendation":None,
            "metadata":exemplar,"metadata_authority":"source-authored annotation, not independently demonstrated machinery or flight" if exemplar else "UNKNOWN",
            "metadata_source":source_identity(exemplar_path,directory,head,pr) if exemplar else None,
            "images":images,
            "atlas_feature_ids":[r['feature_id'] for r in atlas['records'] if r['child_pr']==pr and r['child_head']==head],
            "limitations":GLOBAL_LIMITS,
        }
        if nom and (replay['setup_sha256']!=nom['source']['setup_sha256'] or replay['plane_sha256']!=nom['source']['plane_sha256']):
            raise ValueError(f"Frozen Gold source mismatch PR{pr}")
        records.append(record)
    features=[]
    for item in atlas['records']:
        feature=copy.deepcopy(item)
        pr,head=feature['child_pr'],feature['child_head']
        if pins[pr]!=head:
            raise ValueError('Atlas current-child HEAD differs from pinned source')
        raw=urlsplit(feature['crop_url'])
        prefix=f'/{REPOSITORY}/{head}/'
        if raw.scheme!='https' or raw.netloc!='raw.githubusercontent.com' or not raw.path.startswith(prefix):
            raise ValueError('Feature crop is not exact-source pinned')
        rel=safe_relative(raw.path[len(prefix):])
        path=source_dir(sources,pr,head)/rel
        feature['image']=source_identity(path,source_dir(sources,pr,head),head,pr)
        with Image.open(path) as image:
            feature['image']['dimensions']=list(image.size)
        feature['evidence_crop_is_edit_mask']=False
        feature['geometry_edits_authorized']=False
        feature['simulation_function']='NOT_DEMONSTRATED'
        feature['owner_acceptance']='PENDING'
        features.append(feature)
    science=[]
    if science_dir:
        for name in ('corpus-advisory.v1.json','adjudication.v1.json'):
            path=science_dir/name
            if path.exists():
                science.append({'path':str(path.relative_to(HERE)) if path.is_relative_to(HERE) else name,'sha256':digest(path.read_bytes()),'data':json_load(path)})
    return {'schema_version':'goldmaps-corpus.v1','repository':REPOSITORY,'recovery_head':RECOVERY,'ledger_head':LEDGER,
            'read_only':True,'owner_accepted':False,'maps':records,'features':features,
            'feature_history':history,'feature_atlas_head':pins[201],
            'feature_atlas_source_sha256':digest((atlasroot/'astra-current.v1.json').read_bytes()),
            'feature_history_sha256':digest((atlasroot/'states.v1.jsonl').read_bytes()),
            'scientific_advisories':science,'safeguards':GLOBAL_LIMITS,
            'selection_policy':'Frozen nominations are preserved. New advisory conclusions are separate, and absent evidence remains null.',
            'counts':{'maps':len(records),'frozen_gold_nominees':len(gold),'current_features':len(features),'immutable_feature_states':len(history),'owner_accepted':0}}


class Corpus:
    def __init__(self,path=DEFAULT):
        self.path=Path(path);self.data=json_load(self.path)
        if self.data.get('schema_version')!='goldmaps-corpus.v1' or not self.data.get('read_only'):
            raise ValueError('Unsupported or unsafe corpus schema')
        if self.data.get('owner_accepted'):
            raise ValueError('This advisory corpus has no owner acceptance authority')
        if any(m.get('owner_acceptance')!='PENDING' for m in self.data['maps']):
            raise ValueError('Unexpected automatic map acceptance')
        self.maps=self.data['maps'];self.features=self.data['features']
        for feature in self.features:
            if feature.get('evidence_crop_is_edit_mask') is not False or feature.get('geometry_edits_authorized') is not False:
                raise ValueError('Feature safety contract weakened')
            if not feature.get('do_not_fill') or not feature.get('must_preserve'):
                raise ValueError('Feature protection lost')

    def get(self,pr,head=None):
        found=[r for r in self.maps if r['pr']==int(pr) and (head is None or r['head']==head)]
        if len(found)!=1:
            raise ValueError('No unique source-pinned map; no fallback to mutable HEAD')
        return copy.deepcopy(found[0])

    def search(self,query='',role=None,qualified=False):
        words=query.casefold().split();rows=[]
        for r in self.maps:
            haystack=json.dumps({'name':r['name'],'metadata':r['metadata'],'roles':r['roles']},ensure_ascii=False).casefold()
            if not all(w in haystack for w in words) or (role and role not in r['roles']):
                continue
            if qualified and r['source_static_qualification']['status']!='PASS':
                continue
            rows.append(copy.deepcopy(r))
        return rows

    def feature(self,feature_id):
        rows=[r for r in self.features if r['feature_id']==feature_id]
        if len(rows)!=1:
            raise ValueError('Feature missing or ambiguous; unknown does not mean absent')
        return copy.deepcopy(rows[0])

    def recommend(self,feature_id):
        f=self.feature(feature_id)
        return {'feature_id':feature_id,'source':{'pr':f['child_pr'],'head':f['child_head'],'state_id':f['state_id']},
            'treatment':f['treatment'],'observed':f['observed'],'bounded_action':f['bounded_action'],
            'do_preserve':f['must_preserve'],'do_not_fill':f['do_not_fill'],
            'do_repair':f['safe_to_change'] if f['treatment']=='DO-REPAIR' else [],
            'safe_to_change_is_advisory_only':f['safe_to_change'],
            'do_not_assert':['Functional animated machinery','Native traversability from static evidence','Structural strength from component attachment','Exact feature bounds from evidence crop','Owner Gold acceptance'],
            'evidence_crop_xywh':f['crop_rect_xywh'],'verified_feature_bbox_xyxy':f['feature_bbox_xyxy'],
            'geometry_edits_authorized':False,'evidence_crop_is_edit_mask':False,
            'limitations':GLOBAL_LIMITS}

    @staticmethod
    def _tokens(record):
        metadata=record.get('metadata') or {}
        axes=metadata.get('diversity_axes')
        if not isinstance(axes,dict):
            return set()
        return {f'{k}:{v}' for k,values in axes.items() for v in (values if isinstance(values,list) else [values])}

    def neighbours(self,pr,limit=5):
        source=self.get(pr);tokens=self._tokens(source)
        rows=[]
        for r in self.maps:
            if r['id']==source['id']:
                continue
            other=self._tokens(r)
            score=len(tokens&other)/len(tokens|other) if tokens and other else None
            rows.append({'pr':r['pr'],'head':r['head'],'name':r['name'],'shared_diversity_axes':sorted(tokens&other),'similarity':score,'roles':r['roles'],
                'interpretation':'Annotation similarity; not a duplicate verdict or art score. Missing axes remain unknown.','owner_acceptance':r['owner_acceptance']})
        return sorted(rows,key=lambda r:(r['similarity'] is None,-(r['similarity'] or 0),r['pr']))[:limit]

    def retrieve_crop(self,feature_id,sources,output):
        feature=self.feature(feature_id);identity=feature['image']
        path=Path(sources)/safe_relative(identity['archive_path'])
        root=Path(sources).resolve()
        if not path.resolve().is_relative_to(root):
            raise ValueError('Crop escaped source archive')
        raw=path.read_bytes()
        if digest(raw)!=identity['sha256'] or git_blob(raw)!=identity['git_blob_sha1']:
            raise ValueError('Crop integrity mismatch; refusing output')
        with Image.open(path) as image:
            if list(image.size)!=identity['dimensions']:
                raise ValueError('Crop dimensions changed')
        output=Path(output)
        receipt_path=output.with_suffix(output.suffix+'.receipt.json')
        if output.exists() or receipt_path.exists():
            raise ValueError('Refusing to overwrite an existing crop or receipt')
        output.parent.mkdir(parents=True,exist_ok=True)
        with output.open('xb') as out:
            out.write(raw)
        receipt={'feature_id':feature_id,'image':identity,'coordinate_window_xywh':feature['crop_rect_xywh'],'verified_feature_bbox_xyxy':feature['feature_bbox_xyxy'],
                 'pixel_bytes_unchanged':True,'evidence_crop_is_edit_mask':False,'protections':self.recommend(feature_id)}
        write_json(receipt_path,receipt)
        return receipt


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--corpus',type=Path,default=DEFAULT)
    subs=parser.add_subparsers(dest='command',required=True)
    p=subs.add_parser('build');p.add_argument('--sources',type=Path,required=True)
    p.add_argument('--recovery',type=Path,default=HERE/'docs/corpus/goldmaps-recovery-001')
    p.add_argument('--science',type=Path,default=HERE/'docs/corpus/goldmaps-finalisation-001/science')
    p=subs.add_parser('search');p.add_argument('query',nargs='?',default='');p.add_argument('--role');p.add_argument('--qualified',action='store_true')
    p=subs.add_parser('get');p.add_argument('pr',type=int);p.add_argument('--head')
    p=subs.add_parser('feature');p.add_argument('feature_id')
    p=subs.add_parser('recommend');p.add_argument('feature_id')
    p=subs.add_parser('neighbours');p.add_argument('pr',type=int);p.add_argument('--limit',type=int,default=5)
    p=subs.add_parser('crop');p.add_argument('feature_id');p.add_argument('--sources',type=Path,required=True);p.add_argument('--output',type=Path,required=True)
    args=parser.parse_args()
    if args.command=='build':
        data=build(args.sources,args.recovery,args.science);write_json(args.corpus,data);print(json.dumps(data['counts']));return
    corpus=Corpus(args.corpus)
    if args.command=='search':
        data=corpus.search(args.query,args.role,args.qualified)
    elif args.command=='get':data=corpus.get(args.pr,args.head)
    elif args.command=='feature':data=corpus.feature(args.feature_id)
    elif args.command=='recommend':data=corpus.recommend(args.feature_id)
    elif args.command=='neighbours':data=corpus.neighbours(args.pr,args.limit)
    else:data=corpus.retrieve_crop(args.feature_id,args.sources,args.output)
    print(json.dumps(data,ensure_ascii=False,indent=2))


if __name__=='__main__':
    main()
