#!/usr/bin/env python3
"""Replay committed bounded archaeological repairs on the unmodified deterministic base builder.

From this directory: python3 build.py && python3 replay_rework.py
Uses no source-image pixels. Exact material-cell PNGs are deterministic by palette.
"""
import json, hashlib
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parent
W = H = 2048
STEM = 'setup-strat-0024-amber-fossil-vault.json'
BASE_EDIT_COUNT = 24943
BASE_PLANE_SHA = '5104f4227e83d48b7b224d4b625e3dc637bbcfd662ac06e92c9ee031cd146ef2'
START_HEAD = '3302306cd2136172f363b3f4dbcf812a2f55a86c'
CROPS = {
    'detail-upper-access.png': (225,270,768,512),
    'detail-fossil-nave.png': (365,640,1024,512),
    'detail-lower-excavation.png': (415,1440,1024,512),
}

def paint(grid, runs):
    for x,y,w,h,m in runs:
        assert 0 <= x < W and 0 <= y < H and 0 < w <= W-x and 0 < h <= H-y
        assert isinstance(m,int) and 0 <= m <= 255
        grid[y:y+h,x:x+w] = m

def main():
    patchdoc = json.loads((ROOT/'rework_patch.json').read_text())
    assert patchdoc['base_head'] == START_HEAD and patchdoc['extent'] == [W,H]
    patch = patchdoc['patch']
    wrap = json.loads((ROOT/STEM).read_text())
    setup = wrap['starting_setup']
    assert setup['extent'] == [W,H]
    edits = setup['edits']
    if len(edits) == BASE_EDIT_COUNT+len(patch):
        assert edits[-len(patch):] == patch, 'Unexpected already-reworked tail'
        edits = edits[:BASE_EDIT_COUNT]
    assert len(edits) == BASE_EDIT_COUNT, 'Regenerate the baseline with python3 build.py before replay'
    baseline=np.zeros((H,W),np.uint8);paint(baseline,edits)
    assert hashlib.sha256(baseline.tobytes()).hexdigest() == BASE_PLANE_SHA, 'Baseline drift detected'
    new=baseline.copy();paint(new,patch)
    setup['edits']=edits+patch
    wire=json.dumps(wrap,separators=(',',':'))+'\n'
    assert len(wire.encode()) < 1048576 and len(setup['edits'])<=32768
    (ROOT/STEM).write_text(wire)
    check=np.zeros((H,W),np.uint8);paint(check,setup['edits'])
    assert np.array_equal(check,new)
    report=json.loads((ROOT/'evidence.json').read_text())
    assert report['destinations'] and len(report['destinations'])==17
    free=ndimage.binary_erosion(new==0,np.ones((15,19),bool),border_value=0)
    labels,count=ndimage.label(free)
    root=int(labels[470,460]);assert root>0
    bad=[d['name'] for d in report['destinations'] if int(labels[d['point'][1],d['point'][0]])!=root]
    assert not bad, f'Unreachable exact 19x15 destinations: {bad}'
    hist={str(int(k)):int(v) for k,v in zip(*np.unique(new,return_counts=True))}
    allowed={p['id'] for p in json.loads((ROOT/'material-palette.json').read_text()) if p.get('valid')}
    assert set(map(int,hist)).issubset(allowed)
    palette={int(p['id']):p['rgba'][:3] for p in json.loads((ROOT/'material-palette.json').read_text())}
    ids=sorted(map(int,hist));bright={0,3,77,78,79,80,122,127,120}
    colors=[];mapping={}
    for i in ids:
        mapping[i]=(len(colors),i not in bright)
        rgb=palette[i]
        for shade in range(5 if i not in bright else 1):
            colors.append([min(255,max(0,v+shade-2)) for v in rgb])
    assert len(colors)<=256
    yy,xx=np.indices((H,W),dtype=np.int32)
    shade=(xx*7+yy*11+(xx//17)*5)%5
    indexed=np.zeros((H,W),np.uint8)
    for i,(first,stable) in mapping.items():indexed[new==i]=(first+shade[new==i] if stable else first)
    palflat=np.array(colors,np.uint8).flatten().tolist()+[0]*(768-len(colors)*3)
    def save(name,raw):
        pic=Image.fromarray(raw,'P');pic.putpalette(palflat);pic.save(ROOT/name)
    save('preview.png',indexed)
    save('overview.png',indexed[::2,::2])
    for name,(x,y,w,h) in CROPS.items():save(name,indexed[y:y+h,x:x+w])
    sha=hashlib.sha256(new.tobytes()).hexdigest()
    changed=int(np.count_nonzero(new!=baseline))
    report.update(rectangle_count=len(setup['edits']), json_bytes=len(wire.encode()),
                  plane_sha256=sha,reconstructed_sha256=sha,materials=dict(sorted(hist.items(),key=lambda x:int(x[0]))))
    report['preview']='Direct indexed-palette rendering from exact amended material grid, reproducing original ±2 rock graining; the overview samples true material cells without source-image pixels.'
    report['rework']={
       'identifier':'CANVAS-REWORK-A/PR-6','input_head':START_HEAD,
       'original_rectangle_count':BASE_EDIT_COUNT,'added_rectangle_count':len(patch),
       'actual_material_cells_changed':changed,
       'total_stamped_cell_operations':sum(w*h for x,y,w,h,m in setup['edits']),
       'midge_clearance':[19,15],'original_actor_spawn':[460,470],
       'connected_clearance_centres':int(np.count_nonzero(labels==root)),
       'exact_destinations_reachable':len(report['destinations']),
       'hidden_waypoint_offsets':0,
       'source_reference_pixel_comparison':'UNVERIFIED - source binary not decoded',
       'runtime_native_validation':'NOT EXECUTED',
       'technical_note':'Original fossil anatomy retained. Additive rock-strata/scaffold/field-analysis/dig-tram repairs appended in exact stamped edit order.',
       'preview_crops':list(CROPS),
       'deterministic_replay':'python3 build.py && python3 replay_rework.py'
    }
    (ROOT/'evidence.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps({'extent':[W,H],'rectangles':len(setup['edits']),'json_bytes':len(wire.encode()),
        'material_sha256':sha,'changed_cells':changed,
        'exact_clearance':f'{len(report["destinations"])}/{len(report["destinations"])}',
        'reachable_centres':int(np.count_nonzero(labels==root)),
        'native_executed':False},indent=2))

if __name__ == '__main__':main()
