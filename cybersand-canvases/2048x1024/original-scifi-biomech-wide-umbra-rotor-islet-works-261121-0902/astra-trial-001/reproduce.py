"""Deterministic GOLD-ASTRA-001 cell replay; all paths relative to this bundle.

Requirements: Python 3, numpy, scipy, Pillow. The frozen original builder is
preserved byte-for-byte in baseline/. Its pruning remains intact. This bounded
post-baseline intervention also applies the frozen final anchoring policy.
"""
from pathlib import Path
import argparse, hashlib, json, math, shutil, subprocess, tempfile
import numpy as np
from scipy import ndimage
from geometry_core import reconstruct,encode_rectangles,cell_sha256,changed_cell_report,render_native,FOUR_NEIGHBOUR


def read_json(p):return json.loads(Path(p).read_text())
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def apply_operations(grid,groups):
    h,w=grid.shape;counts=[]
    for group in groups:
        before=grid.copy()
        for op in group['operations']:
            kind,*v=op
            if kind=='R':
                x,y,ww,hh,m=v
                if min(x,y)<0 or min(ww,hh)<=0 or x+ww>w or y+hh>h:raise ValueError('OOB operation '+str(op))
                grid[y:y+hh,x:x+ww]=m
            elif kind=='L':
                x,y,X,Y,t,m=v;radius=t/2
                x0=math.floor(min(x,X)-radius);x1=math.ceil(max(x,X)+radius)
                y0=math.floor(min(y,Y)-radius);y1=math.ceil(max(y,Y)+radius)
                if min(x0,y0)<0 or x1>=w or y1>=h:raise ValueError('OOB line '+str(op))
                yy,xx=np.mgrid[y0:y1+1,x0:x1+1];dx=X-x;dy=Y-y;den=dx*dx+dy*dy
                fraction=np.clip(((xx-x)*dx+(yy-y)*dy)/(den or 1),0,1)
                mask=(xx-x-fraction*dx)**2+(yy-y-fraction*dy)**2<=radius*radius
                view=grid[y0:y1+1,x0:x1+1];view[mask]=m
            elif kind=='D':
                x,y,r,m=v
                if min(x-r,y-r)<0 or x+r>=w or y+r>=h:raise ValueError('OOB disc '+str(op))
                yy,xx=np.mgrid[-r:r+1,-r:r+1];view=grid[y-r:y+r+1,x-r:x+r+1];view[xx*xx+yy*yy<=r*r]=m
            else:raise ValueError('Unsupported explicit cell operation '+kind)
        counts.append({'group':group['id'],'cells_changed_at_operation_stage':int((before!=grid).sum())})
    return counts


def final_prune(grid,fixture):
    labels,n=ndimage.label(grid!=0,FOUR_NEIGHBOUR)
    seeds=[labels[-1,:]]
    for x,y,w,h in fixture.get('anchor_boxes',[]):seeds.append(labels[y:y+h,x:x+w].ravel())
    anchored=np.unique(np.concatenate(seeds));anchored=anchored[anchored!=0]
    keep=np.isin(labels,anchored);remove=(grid!=0)&~keep
    npruned=int(remove.sum());grid[remove]=0
    return npruned


def verify_original_builder(root):
    cfg=read_json(root/'build-config.json')
    with tempfile.TemporaryDirectory(prefix='gold-astra-original-') as d:
        d=Path(d)
        for f in (root/'baseline').iterdir():
            if f.is_file():shutil.copyfile(f,d/f.name)
        build=cfg['original_builder_filename'];cmd=['python',build] if build.endswith('.py') else ['node',build]
        subprocess.run(cmd,cwd=d,check=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
        result=d/cfg['original_setup_filename']
        if sha(result)!=cfg['baseline_setup_sha256']:raise ValueError('Original builder does not reproduce frozen Setup bytes.')
    return True


def build(root,output):
    root=Path(root);output=Path(output);output.mkdir(parents=True,exist_ok=True)
    cfg=read_json(root/'build-config.json');fixture=read_json(root/'fixture.json')
    baseline_path=root/'baseline'/cfg['original_setup_filename']
    if sha(baseline_path)!=cfg['baseline_setup_sha256']:raise ValueError('Baseline Setup bytes differ from freeze.')
    for name,digest in cfg['original_builder_inputs'].items():
        if sha(root/'baseline'/name)!=digest:raise ValueError('Frozen original builder input differs: '+name)
    source=read_json(baseline_path);w,h=source['extent']
    before,_=reconstruct(w,h,source['edits'],legal_materials=set(range(132))-{10})
    if cell_sha256(before)!=cfg['baseline_material_plane_sha256_uint8']:raise ValueError('Baseline plane differs from freeze.')
    after=before.copy();groups=read_json(root/'operations.json')['groups']
    operation_counts=apply_operations(after,groups)
    pruned=final_prune(after,fixture) if groups else 0
    edits=encode_rectangles(after)
    candidate=dict(source);candidate['edits']=edits
    if not groups:
        (output/'setup.json').write_bytes(baseline_path.read_bytes())
    else:
        (output/'setup.json').write_text(json.dumps(candidate,separators=(',',':'))+'\n')
    palette={int(k):v for k,v in read_json(root/'palette.json').items()}
    images=[]
    for name,crop in [['overview',[0,0,w,h]],*cfg['crops']]:
        for label,grid in [('before',before),('after',after)]:
            images.append(render_native(grid,palette,output/'images'/f'{name}-{label}.png',crop))
    for image in images:image['path']=str(Path(image['path']).relative_to(output))
    result={'arm':cfg['arm'],'source_head':cfg['source_head'],'frozen_commit':cfg['frozen_commit'],
            'cell_difference':changed_cell_report(before,after),'final_pruned_provisional_cells':pruned,
            'operation_groups':operation_counts,'rectangle_count':len(edits),'setup_sha256':sha(output/'setup.json'),
            'images':images,'native_status':'NATIVE-UNTESTED','source_static_only':True}
    (output/'build-result.json').write_text(json.dumps(result,indent=2)+'\n')
    expected=cfg.get('expected_candidate_material_plane_sha256_uint8')
    if expected and cell_sha256(after)!=expected:raise ValueError('Candidate plane replay differs from pinned output.')
    return result

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--out',default='reproduced');parser.add_argument('--verify-original-build',action='store_true');args=parser.parse_args()
    root=Path(__file__).resolve().parent
    if args.verify_original_build:verify_original_builder(root)
    output=Path(args.out)
    if not output.is_absolute():output=root/output
    if output.resolve()==(root/'baseline').resolve():raise ValueError('Cannot write into frozen baseline.')
    print(json.dumps(build(root,output),separators=(',',':')))
