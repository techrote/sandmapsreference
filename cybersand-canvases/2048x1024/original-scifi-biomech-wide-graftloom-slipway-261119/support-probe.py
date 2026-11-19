"""Bounded, read-only structural connection probe for Graftloom; does not publish failed cells.
The probe treats the builder's current full material grid as authority and tries actual
steel paths, requiring 31x27 exact-centre and upper/lower restricted route survival.
"""
import array
import collections
import importlib.util
import json
from pathlib import Path
import time

HERE=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location("graftloom_build", HERE/"build.py")
B=importlib.util.module_from_spec(spec)
spec.loader.exec_module(B)
W,H=B.W,B.H
A=B.A
N=len(A)
S=B.SITES
COL=62
def components(a):
    labels=array.array('i',[-1])*N
    info=[]
    for i,m in enumerate(a):
        if not m or labels[i]!=-1: continue
        cid=len(info);labels[i]=cid
        q=collections.deque([i]);xs=[];ys=[];count=0;bound=False
        minx=W;maxx=0;miny=H;maxy=0
        # Store extreme points by columns and rows; allows fast directional paths.
        top={};bottom={};left={};right={}
        while q:
            p=q.popleft();x=p%W;y=p//W;count+=1
            bound=bound or x in (0,W-1) or y in (0,H-1)
            minx=min(minx,x);maxx=max(maxx,x);miny=min(miny,y);maxy=max(maxy,y)
            if x not in top or y<top[x][1]:top[x]=(x,y)
            if x not in bottom or y>bottom[x][1]:bottom[x]=(x,y)
            if y not in left or x<left[y][0]:left[y]=(x,y)
            if y not in right or x>right[y][0]:right[y]=(x,y)
            for u in (p-1 if x else -1,p+1 if x<W-1 else -1,p-W if y else -1,p+W if y<H-1 else -1):
                if u>=0 and a[u] and labels[u]==-1:
                    labels[u]=cid;q.append(u)
        info.append(dict(id=cid,count=count,bound=bound,bbox=[minx,miny,maxx,maxy],top=top,bottom=bottom,left=left,right=right))
    return labels,info

def candidate_segments(labels, info, part, limit=60):
    # Connect detached component to existing boundary-rooted materials.
    candidates=[]
    for side, endpoints, direction in [
      ("up",part["top"].values(),(0,-1)),
      ("down",part["bottom"].values(),(0,1)),
      ("left",part["left"].values(),(-1,0)),
      ("right",part["right"].values(),(1,0))]:
        for x,y in endpoints:
            dx,dy=direction;xx=x+dx;yy=y+dy;steps=0
            while 0<=xx<W and 0<=yy<H:
                steps+=1;v=yy*W+xx
                lab=labels[v]
                if lab>=0 and info[lab]["bound"]:
                    candidates.append(dict(side=side, start=[x,y], end=[xx,yy], gap=steps-1, component=part["id"]))
                    break
                if steps>460:break
                xx+=dx;yy+=dy
    candidates.sort(key=lambda v:v["gap"])
    # Distinct anchor positions across the component, not just five near-identical candidates.
    selected=[];seen=set()
    for cand in candidates:
        x,y=cand["start"]
        zone=(cand["side"],x//35 if cand["side"] in ("up","down") else y//35)
        if zone in seen:continue
        seen.add(zone);selected.append(cand)
        if len(selected)>=limit:break
    return selected

def trial(base,c):
    a=bytearray(base)
    x,y=c["start"];xx,yy=c["end"]
    if x==xx:
        B.box  # no mutation: B.box addresses global grid
        y0,y1=sorted((y,yy))
        for ay in range(y0,y1+1):
            for ax in range(max(12,x-2),min(W-12,x+3)):
                if not a[ay*W+ax]:a[ay*W+ax]=COL
    else:
        x0,x1=sorted((x,xx))
        for ay in range(max(26,y-2),min(H-24,y+3)):
            for ax in range(x0,x1+1):
                if not a[ay*W+ax]:a[ay*W+ax]=COL
    legal=B.legal_centres(a,31,27)
    try:seen,total=B.flood(legal,S["spawn_receiving_dock"])
    except AssertionError:return "spawn-blocked",0
    for name,(sx,sy) in S.items():
        if not legal[sy*W+sx]:return "site-collision:"+name,total
        if not seen[sy*W+sx]:return "site-isolated:"+name,total
    for label,ban in [
      ("upper",lambda x,y:650<=x<=1200 and y>=390),
      ("lower",lambda x,y:650<=x<=1200 and y<=650)]:
        visited,_=B.flood(legal,S["spinal_gate_west"],ban)
        x,y=S["spinal_gate_east"]
        if not visited[y*W+x]:return "alternate-isolated:"+label,total
    return "PASS",total

def main():
    t=time.monotonic()
    labs,info=components(A)
    roots=[p for p in info if p["bound"]]
    detached=sorted((p for p in info if not p["bound"]),key=lambda p:-p["count"])
    print(json.dumps({"baseline":{"occupied":sum(bool(x) for x in A),
         "components":len(info),"grounded_components":len(roots),
         "floating_components":len(detached),"floating_cells":sum(p["count"] for p in detached)},
         "elapsed_seconds":round(time.monotonic()-t,1)}),flush=True)
    report=[]
    for part in detached[:8]:
        candidates=candidate_segments(labs,info,part,50)
        outcomes=[]
        for c in candidates[:14]:
            status,n=trial(A,c)
            outcomes.append({**c,"status":status,"reachable_centres":n})
            if status=="PASS":break
        summary={"component":part["id"],"cells":part["count"],"bbox":part["bbox"],
             "candidates_found":len(candidates),"outcomes":outcomes}
        report.append(summary)
        print(json.dumps(summary),flush=True)
    output={"baseline_grounding": {"detached_cells":sum(p["count"] for p in detached), "detached_components":len(detached)},
            "trials":report,"seconds":round(time.monotonic()-t,2),
            "note":"All candidates are discarded; no produced Setup or image altered."}
    (HERE/"support-probe.json").write_text(json.dumps(output,indent=2)+"\n")
    print(json.dumps({"probe_seconds":output["seconds"],"trialled":sum(len(q["outcomes"]) for q in report)}),flush=True)
if __name__=="__main__":main()
