"""Format-neutral cell diagnostics. No source builder or geometry edit logic.

Source adapters must supply the engine-verified rectangle, solidity, palette,
and hull-anchor conventions. Unsupported assumptions are intentionally absent.
"""
from __future__ import annotations
from collections import Counter, deque
import hashlib
import json
import struct
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage

FOUR_NEIGHBOUR = np.array([[0,1,0],[1,1,1],[0,1,0]], dtype=np.uint8)
RECTANGLE_CAPACITY = 32768


def reconstruct(width, height, rectangles, *, legal_materials):
    """Expand normalized (x,y,width,height,material) rectangles exactly."""
    if not all(type(v) is int and v > 0 for v in (width,height)):
        raise ValueError('Extent must be positive integral dimensions.')
    if len(rectangles) > RECTANGLE_CAPACITY:
        raise ValueError('Rectangle capacity 32768 exceeded.')
    grid=np.zeros((height,width),dtype=np.uint16)
    covered=np.zeros_like(grid,dtype=bool)
    for i,r in enumerate(rectangles):
        if len(r)!=5 or not all(type(v) is int for v in r):
            raise ValueError(f'Rectangle {i}: nonintegral or malformed normalized values.')
        x,y,w,h,m=r
        if w<=0 or h<=0 or x<0 or y<0 or x+w>width or y+h>height:
            raise ValueError(f'Rectangle {i}: out of bounds or empty extent: {r}')
        if m not in legal_materials or m<0 or m>65535:
            raise ValueError(f'Rectangle {i}: unsupported material {m}')
        if covered[y:y+h,x:x+w].any():
            raise ValueError(f'Rectangle {i}: overlap with previous rectangle.')
        grid[y:y+h,x:x+w]=m
        covered[y:y+h,x:x+w]=True
    values,counts=np.unique(grid,return_counts=True)
    return grid,{'width':width,'height':height,'rectangle_count':len(rectangles),
                 'rectangle_capacity':RECTANGLE_CAPACITY,'overlap_count':0,'out_of_bounds_count':0,
                 'histogram':{str(int(v)):int(c) for v,c in zip(values,counts)},
                 'material_plane_sha256_uint8':cell_sha256(grid),'diagnostic_dimension_prefixed_uint16_sha256':diagnostic_cell_sha256(grid)}


def cell_sha256(grid):
    """Primary engine/source identity: raw row-major uint8 material bytes."""
    if int(grid.max())>255: raise ValueError("Material ID exceeds byte representation.")
    return hashlib.sha256(np.ascontiguousarray(grid,dtype=np.uint8).tobytes()).hexdigest()


def diagnostic_cell_sha256(grid):
    """Diagnostic only: fixed header plus little-endian uint16 row-major cells."""
    h,w=grid.shape
    digest=hashlib.sha256(b'GOLD-ASTRA-CELLS-v1\0'+struct.pack('<II',w,h))
    digest.update(np.ascontiguousarray(grid,dtype='<u2').tobytes())
    return digest.hexdigest()


def clearance_mask(solids, offsets):
    """Exact cell-centre hull clearance. offsets=(left,right,up,down), inclusive.

    Caller must supply anchor convention, especially for an even-width hull.
    Extent is closed: a hull extending beyond the source plane is rejected.
    """
    left,right,up,down=offsets
    if not all(type(v) is int and v>=0 for v in offsets):
        raise ValueError('Nonnegative explicit integral hull offsets required.')
    h,w=solids.shape
    hullw=left+right+1; hullh=up+down+1
    valid=np.zeros((h,w),dtype=bool)
    if hullw>w or hullh>h: return valid
    integral=np.pad(solids.astype(np.int32),((1,0),(1,0))).cumsum(0,dtype=np.int32).cumsum(1,dtype=np.int32)
    sums=integral[hullh:,hullw:]-integral[:-hullh,hullw:]-integral[hullh:,:-hullw]+integral[:-hullh,:-hullw]
    valid[up:h-down,left:w-right]=(sums==0)
    return valid


def site_reachability(passable, spawn, sites):
    h,w=passable.shape
    labels,count=ndimage.label(passable,FOUR_NEIGHBOUR)
    sx,sy=spawn
    spawn_valid=0<=sx<w and 0<=sy<h and bool(passable[sy,sx])
    root=int(labels[sy,sx]) if spawn_valid else 0
    result=[]
    for name,x,y in sites:
        in_bounds=0<=x<w and 0<=y<h
        valid=in_bounds and bool(passable[y,x])
        result.append({'name':name,'centre':[int(x),int(y)],'centre_clear':valid,
                       'reachable':bool(valid and root and labels[y,x]==root)})
    return {'spawn':list(spawn),'spawn_clear':spawn_valid,'components':int(count),
            'sites_total':len(result),'sites_reached':sum(r['reachable'] for r in result),'sites':result}


def shortest_path(passable, start, goal):
    """Deterministic four-neighbour BFS; returns every exact centre or None."""
    h,w=passable.shape
    for x,y in (start,goal):
        if not (0<=x<w and 0<=y<h and passable[y,x]): return None
    source=start[1]*w+start[0]; target=goal[1]*w+goal[0]
    parent=np.full(h*w,-2,dtype=np.int32)
    parent[source]=-1
    queue=deque([source]); cells=passable.ravel()
    while queue:
        q=queue.popleft()
        if q==target: break
        x=q%w; y=q//w
        # Fixed order is part of replay, not a preference for a named district.
        for k,allowed in ((q-1,x>0),(q+1,x+1<w),(q-w,y>0),(q+w,y+1<h)):
            if allowed and cells[k] and parent[k]==-2:
                parent[k]=q; queue.append(k)
    if parent[target]==-2:return None
    path=[]; q=target
    while q!=-1:
        path.append((int(q%w),int(q//w))); q=int(parent[q])
    path.reverse(); return path


def path_report(path, *, named_regions=None):
    if path is None:return {'reachable':False,'length_steps':None,'region_visits':{}}
    visits={}
    for name,(x,y,w,h) in (named_regions or {}).items():
        indices=[i for i,(px,py) in enumerate(path) if x<=px<x+w and y<=py<y+h]
        visits[name]={'visited':bool(indices),'count':len(indices),
                      'first_index':indices[0] if indices else None,'last_index':indices[-1] if indices else None}
    blob=json.dumps(path,separators=(',',':')).encode()
    return {'reachable':True,'length_steps':len(path)-1,'path_sha256':hashlib.sha256(blob).hexdigest(),
            'region_visits':visits}


def grounded_report(inert_solids):
    labels,n=ndimage.label(inert_solids,FOUR_NEIGHBOUR)
    rooted_labels=np.unique(labels[-1,:]); rooted_labels=rooted_labels[rooted_labels!=0]
    grounded=np.isin(labels,rooted_labels)&inert_solids
    boundary_labels=np.unique(np.concatenate((labels[0,:],labels[-1,:],labels[:,0],labels[:,-1])))
    boundary_labels=boundary_labels[boundary_labels!=0]
    boundary_rooted=np.isin(labels,boundary_labels)&inert_solids
    return {'solid_cells':int(inert_solids.sum()),'bottom_grounded_cells':int(grounded.sum()),
            'not_bottom_rooted_cells':int((inert_solids&~grounded).sum()),'boundary_rooted_cells':int(boundary_rooted.sum()),'not_boundary_rooted_cells':int((inert_solids&~boundary_rooted).sum()),'solid_components':int(n)}


def changed_cell_report(before,after):
    if before.shape!=after.shape:raise ValueError('Extent changed.')
    changed=before!=after; yy,xx=np.where(changed)
    bounds=None if not len(xx) else [int(xx.min()),int(yy.min()),int(xx.max()-xx.min()+1),int(yy.max()-yy.min()+1)]
    pairs=Counter((int(a),int(b)) for a,b in zip(before[changed],after[changed]))
    return {'changed_cells':int(changed.sum()),'bounds_xywh':bounds,
            'before_material_plane_sha256_uint8':cell_sha256(before),'after_material_plane_sha256_uint8':cell_sha256(after),
            'material_transitions':[{'from':a,'to':b,'cells':c} for (a,b),c in sorted(pairs.items())]}


def render_native(grid,palette,output,crop=None):
    """One source cell per output pixel. No scaling, labels or interpolation."""
    if crop is not None:
        x,y,w,h=crop
        if min(x,y)<0 or min(w,h)<=0 or x+w>grid.shape[1] or y+h>grid.shape[0]:
            raise ValueError('Crop exceeds exact source extent.')
        grid=grid[y:y+h,x:x+w]
    missing=set(map(int,np.unique(grid)))-set(palette)
    if missing:raise ValueError(f'No authoritative colour for materials: {sorted(missing)}')
    rgb=np.zeros((*grid.shape,3),dtype=np.uint8)
    for material,colour in palette.items():rgb[grid==material]=colour[:3]
    output=Path(output);output.parent.mkdir(parents=True,exist_ok=True)
    Image.fromarray(rgb).save(output)
    return {'path':str(output),'source_crop_xywh':list(crop) if crop else [0,0,grid.shape[1],grid.shape[0]],
            'pixels':[grid.shape[1],grid.shape[0]],'scale':1,'sha256':hashlib.sha256(output.read_bytes()).hexdigest()}


def encode_rectangles(grid):
    """Canonical nonempty horizontal runs, vertically coalesced by exact key."""
    h,w=grid.shape;rectangles=[];active={}
    for y in range(h):
        row=grid[y];changes=np.concatenate(([0],np.nonzero(row[1:]!=row[:-1])[0]+1,[w]))
        following={}
        for left,right in zip(changes[:-1],changes[1:]):
            material=int(row[left])
            if not material:continue
            key=(int(left),int(right-left),material)
            if key in active:
                index=active[key];rectangles[index][3]+=1
            else:
                index=len(rectangles);rectangles.append([int(left),y,int(right-left),1,material])
            following[key]=index
        active=following
    return rectangles
