#!/usr/bin/env python3
"""Freeze exact original-only coordinates and claim probes; no map generation."""
import hashlib,json
from pathlib import Path
HERE=Path(__file__).resolve().parent
SAFE=HERE.parent/'coordinator'/'author-safe'
out=HERE/'fixtures';out.mkdir(exist_ok=True)
packet=json.loads((SAFE/'original-packets.v1.json').read_text())
index=[]
def read(path):return json.loads(path.read_text())
def digest(path):return hashlib.sha256(path.read_bytes()).hexdigest()
for arm in packet['arms']:
    aid=arm['arm'];folder=SAFE/'originals'/aid
    setup_path=next(folder.glob('setup*.json'));setup=read(setup_path)
    receipt_path=folder/('qualification.json' if aid in ['B2','B3'] else 'receipt.json');receipt=read(receipt_path)
    sources=[setup_path,receipt_path];graphs={};obstruction=[];routes=[]
    if aid=='B2':
        data_path=folder/'design.json';sources.append(data_path);data=read(data_path);sites=data['sites']
        obs=data['obstruction'];endpoints=[data['gates']['west'],data['gates']['east']]
        obstruction=[{'id':'original-solid-block','rect':obs,'expected_covered_sites':[]}]
        routes=[{'id':'original-unblocked-shortest','via':endpoints},{'id':'original-blocked-shortest','via':endpoints,'obstructions':[obs]}]
        bans=data['route_bans'];span=bans['xmax']-bans['xmin']+1
        routes.append({'id':'original-blocked-upper','via':endpoints,'obstructions':[obs],'forbidden_centres':[[bans['xmin'],bans['upper_max_y']+1,span,setup['extent'][1]-bans['upper_max_y']-1]]})
        routes.append({'id':'original-blocked-lower','via':endpoints,'obstructions':[obs],'forbidden_centres':[[bans['xmin'],0,span,bans['lower_min_y']]]})
    elif aid=='B3':
        sites=receipt['sites'];graphs={k:receipt[k] for k in ['primary_route','alternate_route','service_route']}
        obs=receipt['obstruction_xywh'];obstruction=[{'id':'original-solid-block','rect':obs,'expected_covered_sites':[receipt['blocked_site']]}]
        routes=[{'id':'original-start-finish-shortest','via':[receipt['start_site'],receipt['finish_site']]},
                {'id':'original-blocked-alternate-sequence','via':receipt['alternate_route'],'obstructions':[obs]}]
    elif aid=='D1':
        data_path=folder/'route_graph.json';sources.append(data_path);data=read(data_path)
        sites={p['name']:p['xy'] for p in data['sites']};graphs={'primary':data['primary']}
        if isinstance(data.get('branches'),dict):graphs.update(data['branches'])
        obs=data['obstruction']['rect'];obstruction=[{'id':'original-solid-block','rect':obs,'expected_covered_sites':[]}]
        routes=[{'id':'original-unblocked-shortest','via':[data['spawn'],data['goal']]},
                {'id':'original-blocked-shortest','via':[data['spawn'],data['goal']],'obstructions':[obs],
                 'forced_region':[700,850,200,450],
                 'forced_region_reason':'Conservative complete east drill gallery zone from original named centres756..780 and original review crop; test same endpoint connectivity with whole zone forbidden, not nearest waypoint.'}]
    else:
        sites=receipt.get('exact_sites',receipt.get('literal_sites'));graphs=receipt.get('route_graph',{})
        ob=receipt['obstruction']
        if aid=='C2':
            x0,y0,x1,y1=ob['box'];obs=[x0,y0,x1-x0,y1-y0]
            obstruction=[{'id':'original-solid-block','rect':obs,'expected_covered_sites':[ob['blocked_site']]}]
        else:
            obs=ob['rect'];obstruction=[{'id':'original-solid-block','rect':obs,'expected_covered_sites':[]}]
            routes=[{'id':'original-unblocked-shortest','via':[ob['from'],ob['to']]},{'id':'original-blocked-shortest','via':[ob['from'],ob['to']],'obstructions':[obs]}]
    fixture={'schema_version':1,'id':aid,'source_pr':arm['pr'],'source_head':arm['head'],
             'original_inputs':{str(p.relative_to(SAFE)):digest(p) for p in sources},
             'extent':setup['extent'],'spawn':setup['actors'][0]['spawn'],
             'points':[{'id':k,'xy':v} for k,v in sites.items()],
             'original_route_graphs':graphs,'anchor_boxes':[],
             'anchor_policy':'Bottom-boundary four-neighbour component; no inferred anchors.',
             'obstruction_cases':obstruction,'routes':routes,
             'regression_policy':'Original baseline determines inherited failures. Preserve every passing exact-centre test, no moved destinations; resolve declared intervention P1 independently.'}
    fp=out/(aid+'.v1.json');fp.write_text(json.dumps(fixture,indent=2,sort_keys=True)+'\n')
    index.append({'id':aid,'fixture':str(fp.relative_to(HERE)),'sha256':digest(fp),'setup':str(setup_path),'point_count':len(sites),'original_head':arm['head']})
(out/'index.v1.json').write_text(json.dumps({'schema_version':1,'fixtures':index},indent=2)+'\n')
print(json.dumps(index,indent=2))
