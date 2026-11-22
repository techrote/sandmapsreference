#!/usr/bin/env python3
"""Independent GOLD-ASTRA-001 exact-cell validator. Never authors map geometry.

Fixture coordinates are frozen from approved originals. A blocked literal centre
is a failed centre; no nearest-point or hidden endpoint substitution exists.
Native runtime results belong in a separate report.
"""
from __future__ import annotations

import argparse
from collections import Counter, deque
import hashlib
import json
import math
from pathlib import Path
import sys

import numpy as np
from scipy import ndimage as ndi
from PIL import Image

HERE = Path(__file__).resolve().parent
ENGINE_HEAD = "662df51cd8409a52332fa7ef15d06d8ab8945aed"
FOUR = np.array([[0,1,0],[1,1,1],[0,1,0]], dtype=bool)
ENVELOPES = ((19,15),(23,19),(31,27))
ROOT_KEYS = {"version","extent","actors","next_id","selected","edits","response","liquid_policy","normalize","rule_radius","source","material","brush","fire"}


def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def integer(x) -> bool:
    return isinstance(x, (int,float)) and not isinstance(x,bool) and math.isfinite(x) and x == int(x)


def load_catalogue():
    data = json.loads((HERE / "material-catalogue.json").read_text())
    assert data["engine_head"] == ENGINE_HEAD
    return {m["id"]:m for m in data["materials"]}, data["pairs"]


def read_setup(path: Path):
    raw = path.read_bytes()
    value = json.loads(raw)
    if isinstance(value,dict) and value.get("format") == "cybersand-generated-start-v1":
        return value["starting_setup"], raw, value
    return value, raw, None


def schema_errors(setup, raw: bytes, catalogue):
    errors=[]
    if len(raw)>1048576: errors.append("JSON exceeds1048576bytes")
    if not isinstance(setup,dict): return ["Setup is not an object"]
    if set(setup) not in (ROOT_KEYS, ROOT_KEYS|{"equipment"}): errors.append("Setup root keys differ from accepted v2")
    if setup.get("version")!=2: errors.append("Setup version is not2")
    size=setup.get("extent",[])
    if not isinstance(size,list) or len(size)!=2 or any(not integer(n) or not 512<=n<=2048 or n%64 for n in size):
        return errors+["Invalid extent"]
    if size not in ([2048,1024],[1024,2048]): errors.append("Extent outside fixed trial orientations")
    if not isinstance(setup.get("edits"),list): errors.append("edits is not an array")
    elif len(setup["edits"])>32768: errors.append("More than32768stamps")
    if setup.get("response") not in ["LA-SELECTIVE","LA","LA-EVENT-OFF","RFT"]: errors.append("Invalid response")
    for key in ["normalize","fire"]:
        if not isinstance(setup.get(key),bool): errors.append("Invalid boolean:"+key)
    if setup.get("rule_radius") not in [2,3]: errors.append("Invalid rule radius")
    if not integer(setup.get("brush")) or not 2<=setup["brush"]<=24: errors.append("Invalid brush")
    if setup.get("material") not in [2,14,29,13,19,23,25,26,27,3,58,0,8,16,12,7,9,28]: errors.append("Invalid selected brush material")
    actors=setup.get("actors",[])
    if not isinstance(actors,list) or len(actors)>8: errors.append("Invalid actor array")
    else:
        ids=set()
        for actor in actors:
            if not isinstance(actor,dict): errors.append("Actor is not object");continue
            expected={"id","model","hash","spawn","options"}
            if set(actor) not in (expected,expected|{"control"}): errors.append("Actor keys invalid")
            aid=actor.get("id")
            if not integer(aid) or aid in ids or not 1<=aid<setup.get("next_id",0): errors.append("Actor id/next_id invalid")
            ids.add(aid)
            p=actor.get("spawn",[])
            if not isinstance(p,list) or len(p)!=2 or any(not isinstance(v,(int,float)) or not math.isfinite(v) for v in p):
                errors.append("Actor spawn invalid")
            elif actor.get("model")=="midge" and not (2<=p[0]<=size[0]-2 and 1.5<=p[1]<=size[1]-1.5): errors.append("Midge hull outside extent")
        if setup.get("selected") not in ids|{0}: errors.append("Selected actor missing")
    policy=setup.get("liquid_policy")
    if not isinstance(policy,list) or not 1<=len(policy)<=4096 or any(not integer(x) or not -2147483648<=x<=2147483647 for x in policy): errors.append("Invalid liquid policy words")
    return errors


def replay(setup, catalogue, base: np.ndarray|None=None):
    width,height=map(int,setup["extent"])
    grid=np.zeros((height,width),dtype=np.uint8) if base is None else base.copy()
    touched=np.zeros_like(grid,dtype=np.uint16)
    errors=[]; clipped_discs=[]; replay_work=0; changed_overlaps=0
    for i,stamp in enumerate(setup["edits"]):
        if not isinstance(stamp,list) or len(stamp) not in (4,5) or any(not integer(v) for v in stamp):
            errors.append({"stamp":i,"error":"invalid integer stamp"});continue
        vals=list(map(int,stamp));x,y=vals[:2];m=vals[-1]
        if m not in catalogue or not catalogue[m]["valid"]:
            errors.append({"stamp":i,"error":"invalid material","material":m});continue
        if not (0<=x<width and 0<=y<height): errors.append({"stamp":i,"error":"centre/origin outside extent"});continue
        if len(vals)==5:
            w,h=vals[2:4]
            if w<1 or h<1 or x+w>width or y+h>height: errors.append({"stamp":i,"error":"box outside extent"});continue
            sl=np.s_[y:y+h,x:x+w]
            changed_overlaps+=int(np.count_nonzero((touched[sl]>0)&(grid[sl]!=m)))
            grid[sl]=m;touched[sl]+=1;replay_work+=w*h
        else:
            r=vals[2]
            if not 2<=r<=24: errors.append({"stamp":i,"error":"radius outside2..24"});continue
            if x-r<0 or y-r<0 or x+r>=width or y+r>=height: clipped_discs.append(i)
            replay_work+=(min(width,x+r+1)-max(0,x-r))*(min(height,y+r+1)-max(0,y-r))
            for dy in range(max(-r,-y),min(r,height-1-y)+1):
                half=math.isqrt(r*r-dy*dy);lo=max(0,x-half);hi=min(width,x+half+1)
                sl=np.s_[y+dy,lo:hi]
                changed_overlaps+=int(np.count_nonzero((touched[sl]>0)&(grid[sl]!=m)))
                grid[sl]=m;touched[sl]+=1
    return grid,{"errors":errors,"stamps":len(setup["edits"]),"raw_overlapped_cells":int(np.count_nonzero(touched>1)),"raw_conflicting_overwrite_visits":changed_overlaps,"clipped_discs":clipped_discs,"replay_work":replay_work,"generated_work_limit":min(64*width*height,32000000)}


def replay_independent(setup, base: np.ndarray|None=None):
    """Separate bytearray implementation of the accepted overwrite contract."""
    width,height=map(int,setup["extent"])
    out=bytearray(width*height) if base is None else bytearray(base.tobytes())
    for v in setup["edits"]:
        x,y=map(int,v[:2]);m=int(v[-1])
        if len(v)==5:
            w,h=map(int,v[2:4]);row=bytes([m])*w
            for yy in range(y,y+h): out[yy*width+x:yy*width+x+w]=row
        else:
            r=int(v[2])
            for yy in range(max(0,y-r),min(height,y+r+1)):
                # Deliberately avoid the primary implementation's isqrt.
                d=int(math.floor(math.sqrt(r*r-(yy-y)*(yy-y))))
                a=max(0,x-d);b=min(width,x+d+1)
                out[yy*width+a:yy*width+b]=bytes([m])*(b-a)
    return bytes(out)


def compact_rectangles(grid):
    rectangles=[];open_runs={}
    for y,row in enumerate(grid):
        ends=np.r_[0,np.flatnonzero(row[1:]!=row[:-1])+1,len(row)]
        for a,b in zip(ends[:-1],ends[1:]):
            material=int(row[a])
            if material==0:continue
            key=(int(a),int(b-a),material);index=open_runs.get(key,-1)
            if index>=0 and rectangles[index][1]+rectangles[index][3]==y:
                rectangles[index][3]+=1
            else:
                open_runs[key]=len(rectangles);rectangles.append([int(a),y,int(b-a),1,material])
    return rectangles


def compact_check(grid,rectangles):
    reconstructed=np.zeros_like(grid);coverage=np.zeros_like(grid,dtype=np.uint16)
    for x,y,w,h,m in rectangles:
        reconstructed[y:y+h,x:x+w]=m;coverage[y:y+h,x:x+w]+=1
    return {"rectangles":len(rectangles),"within_capacity":len(rectangles)<=32768,"overlap_cells":int(np.count_nonzero(coverage>1)),"mismatch_cells":int(np.count_nonzero(reconstructed!=grid)),"painted_area":int(np.count_nonzero(coverage))}


def component_report(mask, anchor_boxes=None):
    labels,n=ndi.label(mask,FOUR)
    sizes=np.bincount(labels.ravel());sizes[0]=0
    root_labels=set(map(int,np.unique(labels[-1,:])))-{0}
    for x,y,w,h in anchor_boxes or []:
        root_labels.update(set(map(int,np.unique(labels[y:y+h,x:x+w])))-{0})
    rooted=np.isin(labels,list(root_labels)) if root_labels else np.zeros_like(mask)
    unrooted=[int(sizes[i]) for i in range(1,n+1) if i not in root_labels]
    return {"cells":int(np.count_nonzero(mask)),"components":int(n),"rooted_cells":int(np.count_nonzero(rooted)),"unrooted_cells":int(np.count_nonzero(mask&~rooted)),"unrooted_component_count":len(unrooted),"largest_unrooted_components":sorted(unrooted,reverse=True)[:20]}


def clear_centres(blocked,width,height):
    # Odd envelopes centred exactly at integer cell indices. Exterior is blocked.
    return ndi.maximum_filter(blocked.astype(np.uint8),size=(height,width),mode="constant",cval=1)==0


def point_status(free,point,labels=None):
    if not isinstance(point,list) or len(point)!=2 or any(not integer(n) for n in point):
        return {"clear":False,"reason":"literal centre not an integer pair"}
    x,y=map(int,point)
    if not (0<=y<free.shape[0] and 0<=x<free.shape[1]):return {"clear":False,"reason":"centre outside extent"}
    good=bool(free[y,x])
    return {"clear":good,"reason":"clear" if good else "exact footprint blocked","component":int(labels[y,x]) if labels is not None else None}


def shortest_path(free,start,goal):
    for p in (start,goal):
        if not point_status(free,p)["clear"]:return None
    w=free.shape[1];h=free.shape[0];s=int(start[1])*w+int(start[0]);g=int(goal[1])*w+int(goal[0])
    if s==g:return [s]
    eligible=free.ravel();parent=np.full(h*w,-1,dtype=np.int32);parent[s]=s;q=deque([s]);found=False
    while q:
        cur=q.popleft();x=cur%w
        for nxt in ((cur-w if cur>=w else -1),(cur+1 if x<w-1 else -1),(cur+w if cur<(h-1)*w else -1),(cur-1 if x else -1)):
            if nxt<0 or not eligible[nxt] or parent[nxt]!=-1:continue
            parent[nxt]=cur
            if nxt==g:found=True;break
            q.append(nxt)
        if found:break
    if not found:return None
    path=[g]
    while path[-1]!=s:path.append(int(parent[path[-1]]))
    path.reverse();return path


def route_report(grid,fixture,catalogue):
    points=fixture.get("points",[]);spawn=fixture.get("spawn")
    if spawn is None:return {"status":"NO_FROZEN_ORIGINAL_SPAWN"}
    hard_ids=[i for i,m in catalogue.items() if m["valid"] and m["hard_surface"]]
    report={"spawn":spawn,"point_count":len(points),"envelopes":{}}
    for mode,blocked in [("nonempty",grid!=0),("native-hard-only",np.isin(grid,hard_ids))]:
        mode_report={}
        for ew,eh in ENVELOPES:
            free=clear_centres(blocked,ew,eh);labels,n=ndi.label(free,FOUR)
            origin=point_status(free,spawn,labels);rows=[]
            for point in points:
                status=point_status(free,point["xy"],labels)
                status.update({"id":point["id"],"xy":point["xy"],"reachable":bool(origin["clear"] and status["clear"] and origin.get("component")==status.get("component"))})
                rows.append(status)
            mode_report[f"{ew}x{eh}"]={"spawn":origin,"reachable":sum(r["reachable"] for r in rows),"points":rows,"free_components":int(n),"free_centres":int(np.count_nonzero(free))}
        report["envelopes"][mode]=mode_report
    point_map={p["id"]:p["xy"] for p in points};point_map["spawn"]=spawn
    report["original_declared_graphs"]=[]
    for name,chain in fixture.get("original_route_graphs",{}).items():
        chains=chain if chain and isinstance(chain[0],list) else [chain]
        missing=sorted({p for seq in chains for p in seq if p not in point_map})
        report["original_declared_graphs"].append({"id":name,"sequences":chains,"unresolved_original_site_names":missing,"note":"No aliases or replacement destinations inferred. Existing sequence legs are connected exactly when both frozen centres share the reported free component."})
    report["obstruction_reachability"]={}
    for obs in fixture.get("obstruction_cases",[]):
        blocked=grid!=0;x,y,w,h=obs["rect"];blocked[y:y+h,x:x+w]=True
        found={}
        for ew,eh in ENVELOPES:
            free=clear_centres(blocked,ew,eh);labels,n=ndi.label(free,FOUR)
            origin=point_status(free,spawn,labels);rows=[]
            for p in points:
                s=point_status(free,p["xy"],labels)
                rows.append({"id":p["id"],"xy":p["xy"],"clear":s["clear"],"reachable":bool(origin["clear"] and s["clear"] and origin.get("component")==s.get("component")),"expected_covered":p["id"] in obs.get("expected_covered_sites",[])})
            found[f"{ew}x{eh}"]={"reachable":sum(p["reachable"] for p in rows),"points":rows}
        report["obstruction_reachability"][obs["id"]]=found
    routes=[]
    for route in fixture.get("routes",[]):
        envelope=route.get("envelope",[31,27]);blocked=grid!=0
        for rect in route.get("obstructions",[]):
            x,y,w,h=map(int,rect);blocked[y:y+h,x:x+w]=True
        free=clear_centres(blocked,*envelope)
        for x,y,w,h in route.get("forbidden_centres",[]):
            free[y:y+h,x:x+w]=False
        chain=[point_map[p] if isinstance(p,str) else p for p in route["via"]]
        legs=[]
        for a,b in zip(chain[:-1],chain[1:]):
            path=shortest_path(free,a,b)
            result={"start":a,"goal":b,"reachable":path is not None,"length":len(path)-1 if path is not None else None}
            if path is not None:
                result["path_sha256"]=sha(np.array(path,dtype="<u4").tobytes())
                result["path_bounds"]=[min(v%grid.shape[1] for v in path),min(v//grid.shape[1] for v in path),max(v%grid.shape[1] for v in path),max(v//grid.shape[1] for v in path)]
                result["closest_manhattan_to_original_sites"]={p["id"]:min(abs(v%grid.shape[1]-p["xy"][0])+abs(v//grid.shape[1]-p["xy"][1]) for v in path) for p in points}
            legs.append(result)
        out={"id":route["id"],"via":route["via"],"envelope":envelope,"obstructions":route.get("obstructions",[]),"forbidden_centres":route.get("forbidden_centres",[]),"legs":legs}
        if route.get("forced_region") is not None:
            x,y,w,h=route["forced_region"];restricted=free.copy();restricted[y:y+h,x:x+w]=False
            out["forced_region_necessity"]={"region":route["forced_region"],"same_endpoints_still_connected_without_region":shortest_path(restricted,chain[0],chain[-1]) is not None}
        routes.append(out)
    report["declared_routes"]=routes
    return report


def contacts_report(grid,catalogue,pairs):
    lookup={(p["source"],p["target"]):p["rule"] for p in pairs}
    reactive=Counter();acid=Counter();hot=Counter();opposing=Counter()
    combustible={i for i,m in catalogue.items() if m["kernel"]=="combustible"}|{11,18,16,27}
    hot_ids={6,8,34,36};liquids={i for i,m in catalogue.items() if m["state"]=="liquid"}
    for dy,dx in [(0,1),(1,-1),(1,0),(1,1)]:
        h,w=grid.shape;ys=slice(0,h-dy);yt=slice(dy,h)
        xs=slice(max(0,-dx),min(w,w-dx));xt=slice(max(0,dx),min(w,w+dx))
        a=grid[ys,xs];b=grid[yt,xt]
        codes=a.astype(np.uint16)*256+b
        for code,count in zip(*np.unique(codes,return_counts=True)):
            aa=int(code)//256;bb=int(code)%256;count=int(count)
            if aa==bb:continue
            key=f"{min(aa,bb)}:{max(aa,bb)}"
            if (aa,bb) in lookup or (bb,aa) in lookup:reactive[key]+=count
            if (aa==12 and bb not in (0,1,12)) or (bb==12 and aa not in (0,1,12)):acid[key]+=count
            if (aa in hot_ids and bb in combustible|{9}) or (bb in hot_ids and aa in combustible|{9}):hot[key]+=count
            if aa in liquids and bb in liquids:opposing[key]+=count
    return {"neighbourhood":"Moore8, unordered geometric contacts counted once","pair_reactive_contacts":dict(reactive),"generic_acid_dissolvable_contacts":dict(acid),"hot_combustible_or_ice_contacts":dict(hot),"different_liquid_contacts":dict(opposing)}


def liquid_report(grid,catalogue):
    hard=np.isin(grid,[i for i,m in catalogue.items() if m["valid"] and m["hard_surface"]])
    results=[];h,w=grid.shape
    for mid in sorted(i for i,m in catalogue.items() if m["state"]=="liquid"):
        mask=grid==mid
        if not mask.any():continue
        labels,n=ndi.label(mask,FOUR);sizes=np.bincount(labels.ravel())
        # Directed left/right/down flood is a conservative geometric drainage
        # witness, not a model of liquid pressure, viscosity, reactions or mass.
        passable=~hard if mid!=12 else ((grid==0)|(grid==mid))
        reachable=mask.copy();front=deque(map(int,np.flatnonzero(mask)));flat=reachable.ravel();allowed=passable.ravel()
        while front:
            at=front.popleft();x=at%w
            for nx in ((at-1 if x else -1),(at+1 if x<w-1 else -1),(at+w if at<(h-1)*w else -1)):
                if nx>=0 and allowed[nx] and not flat[nx]:flat[nx]=True;front.append(nx)
        results.append({"id":mid,"name":catalogue[mid]["name"],"cells":int(mask.sum()),"components":int(n),"largest_components":sorted(map(int,sizes[1:]),reverse=True)[:10],"gravity_lateral_reachable_cells":int(reachable.sum()),"touches_boundary_initial":bool(mask[0].any() or mask[-1].any() or mask[:,0].any() or mask[:,-1].any()),"drainage_can_reach_side_or_bottom":bool(reachable[-1].any() or reachable[:,0].any() or reachable[:,-1].any()),"interpretation":"static geometric witness only; no pressure/viscosity/chemical containment proof"})
    return results


def image_parity(path,grid,catalogue,palette_path=None,index_to_material=None):
    with Image.open(path) as image:
        if image.size!=(grid.shape[1],grid.shape[0]):return {"status":"SIZE_MISMATCH","image_size":list(image.size),"grid_size":[grid.shape[1],grid.shape[0]]}
        if image.mode=="P":
            indices=np.array(image,dtype=np.uint8)
            if index_to_material is not None:
                missing=set(map(int,np.unique(indices)))-set(map(int,index_to_material))
                if missing:return {"status":"UNDECLARED_PALETTE_INDICES","missing":sorted(missing)}
                lut=np.zeros(256,dtype=np.uint8)
                for i,m in index_to_material.items():lut[int(i)]=int(m)
                actual=lut[indices]
            else:actual=indices
            return {"status":"PASS" if np.array_equal(actual,grid) else "INDEX_MISMATCH","method":"documented original palette-index-to-material map" if index_to_material is not None else "palette indices declared as exact material IDs","index_to_material":index_to_material,"mismatch_cells":int(np.count_nonzero(actual!=grid)),"image_sha256":sha(Path(path).read_bytes())}
        palette={i:m["rgba"] for i,m in catalogue.items()}
        if palette_path:
            value=json.loads(Path(palette_path).read_text());palette={int(k):v for k,v in value.items()}
        lut=np.zeros((256,4),dtype=np.uint8);lut[:,3]=255
        for k,v in palette.items():lut[k,:len(v)]=v
        actual=np.asarray(image.convert("RGBA"));expected=lut[grid]
        mismatch=np.any(actual!=expected,axis=2)
        return {"status":"PASS" if not mismatch.any() else "PALETTE_MISMATCH_OR_UNDECLARED_RENDERING","method":"full RGBA comparison with explicit palette" if palette_path else "full RGBA comparison with accepted native base palette","mismatch_cells":int(mismatch.sum()),"image_sha256":sha(Path(path).read_bytes()),"limitation":"A mismatched render requires its original documented palette/compositing rule; no silent colour fitting."}


def validate(setup_path:Path,fixture:dict,exactcells:Path|None=None,image_path:Path|None=None,palette_path:Path|None=None,base_path:Path|None=None):
    catalogue,pairs=load_catalogue();setup,raw,generated=read_setup(setup_path)
    errors=schema_errors(setup,raw,catalogue)
    if any("extent" in e.lower() or "not an object" in e for e in errors):return {"status":"INVALID","errors":errors}
    base=np.frombuffer(base_path.read_bytes(),dtype=np.uint8).reshape(tuple(reversed(setup["extent"]))) if base_path else None
    if generated and base is None:return {"status":"GENERATED_BASE_REQUIRED","errors":errors,"limitation":"No fabricated base cells or hash waiver"}
    grid,replay_receipt=replay(setup,catalogue,base)
    if replay_receipt["errors"]:return {"status":"INVALID_REPLAY","schema_errors":errors,"replay":replay_receipt}
    independent=replay_independent(setup,base);rects=compact_rectangles(grid);ids,counts=np.unique(grid,return_counts=True)
    hashes={"setup_sha256":sha(raw),"cells_sha256":sha(grid.tobytes()),"independent_replay_sha256":sha(independent)}
    report={"schema_version":1,"label":"SOURCE-STATIC","engine_head":ENGINE_HEAD,"fixture_id":fixture.get("id"),"extent":setup["extent"],"hashes":hashes,"schema_errors":errors,"json_bytes":len(raw),"replay":replay_receipt,"full_cell_replay_equal":grid.tobytes()==independent,"compact":compact_check(grid,rects),"material_histogram":{str(int(i)):int(n) for i,n in zip(ids,counts)},"materials_used":[catalogue[int(i)] for i in ids],"actors":setup["actors"]}
    if exactcells:
        candidate=np.load(exactcells) if exactcells.suffix==".npy" else np.frombuffer(exactcells.read_bytes(),dtype=np.uint8).reshape(grid.shape)
        report["supplied_exactcells"]={"sha256":sha(candidate.tobytes()),"shape":list(candidate.shape),"equal":np.array_equal(candidate,grid),"mismatch_cells":int(np.count_nonzero(candidate!=grid)) if candidate.shape==grid.shape else None}
    if image_path:report["image_parity"]=image_parity(image_path,grid,catalogue,palette_path,fixture.get("image_index_to_material"))
    hard_ids=[i for i,m in catalogue.items() if m["valid"] and m["hard_surface"]]
    fixed_ids=[i for i,m in catalogue.items() if m["valid"] and m["hard_surface"] and not m["movable"] and m["kernel"]=="none"]
    report["support"]={"native_hard":component_report(np.isin(grid,hard_ids),fixture.get("anchor_boxes")),"fixed_kernel_none":component_report(np.isin(grid,fixed_ids),fixture.get("anchor_boxes")),"bottom_only_fixed_kernel_none":component_report(np.isin(grid,fixed_ids)),"limitation":"Kernel-none support may still be chemically consumed; geometry rooted to bottom and any declared anchors, not a strength simulation."}
    report["contacts"]=contacts_report(grid,catalogue,pairs);report["liquids"]=liquid_report(grid,catalogue)
    report["routes"]=route_report(grid,fixture,catalogue)
    report["native"]={"status":"NATIVE-UNTESTED","note":"This validator does not execute engine cells, actor motion or saved-session reopen."}
    report["original_spawn_preserved"]=any(a.get("model")=="midge" and a.get("spawn")==fixture.get("spawn") for a in setup["actors"]) if fixture.get("spawn") is not None else None
    return report


def main():
    p=argparse.ArgumentParser();p.add_argument("--setup",type=Path,required=True);p.add_argument("--fixture",type=Path,required=True);p.add_argument("--out",type=Path,required=True)
    for name in ["exactcells","image","palette","base"]:p.add_argument("--"+name,type=Path)
    a=p.parse_args();fixture=json.loads(a.fixture.read_text());report=validate(a.setup,fixture,a.exactcells,a.image,a.palette,a.base)
    a.out.parent.mkdir(parents=True,exist_ok=True);a.out.write_text(json.dumps(report,indent=2,sort_keys=True)+"\n")
    print(json.dumps({"report":str(a.out),"fixture":fixture.get("id"),"cells_sha256":report.get("hashes",{}).get("cells_sha256"),"status":report.get("status","REPORTED"),"schema_errors":report.get("schema_errors",[])}))


if __name__=="__main__":main()
