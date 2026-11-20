#!/usr/bin/env python3
from __future__ import annotations
import argparse, base64, collections, datetime as dt, hashlib, json, os, pathlib, re
import urllib.error, urllib.parse, urllib.request

REQ = ["schema_version","purpose","family","map_role","anchor_donors","macro_topology",
"density_profile","route_grammar","strong_motifs","interesting_relationships",
"authoring_affordances","setpiece_candidates","procedural_exemplar_value","similarity_avoidance"]
PURPOSES = {"human_editable_canvas","procedural_exemplar","scripted_setpiece_source"}
ALIASES = {"human-editable-canvas":"human_editable_canvas",
"spatial-procedural-exemplar":"procedural_exemplar","procedural-exemplar":"procedural_exemplar",
"scripted-event-setpiece":"scripted_setpiece_source","scripted-setpiece-source":"scripted_setpiece_source"}
AXES = {
"macro_topology":{"linear","braided","ring","crater","suspended","islands","nested_cavities","cascade","multi_settlement","basin","yard","corridor","bridge","vertical_fault","drydock","mixed","other"},
"altitude_grammar":{"single_level","dual_level","tri_level","vertical_spine","high_low_bypass","multi_strata","mixed","other"},
"density_cadence":{"uniform_sparse","uniform_dense","dense_open_dense","edge_dense_center_open","alternating","clustered","mixed","other"},
"route_structure":{"linear","branch_rejoin","loop","hub_spoke","parallel_lanes","layered","switchback","dead_end_recovery","mixed","other"},
"landmark_family":{"central_machine","bridge","vessel","tower","ring","rotor","crane","dish","crater","gate","gantry","basin","cableway","mixed","other"},
"support_form":{"edge_rooted","floor_rooted","roof_rooted","suspended","twin_pier","multi_leg","arch","cliff_embedded","mixed","other"},
"environment_relation":{"dry","fluid_containment","thermal","biological","geological","damaged","mixed","other"},
"incompleteness":{"finished","editable_gaps","damaged","excavation","abandoned","modular_append_zones","mixed","other"}}
SIM_FIELDS = ["macro_topology","density_profile","route_grammar","strong_motifs",
"interesting_relationships","authoring_affordances","procedural_exemplar_value","similarity_avoidance"]
STOP = {"the","and","for","from","with","into","route","routes","world","map","canvas","material",
"materials","cells","new","original","future","human","editable","procedural","exemplar","scripted"}

def strings(v):
    out=[]
    if isinstance(v,str) and v.strip(): out.append(v.strip())
    elif isinstance(v,list):
        for x in v: out += strings(x)
    elif isinstance(v,dict):
        for x in v.values(): out += strings(x)
    return out

def purpose(v):
    vals=v if isinstance(v,list) else ([] if v is None else [v]); out=[]
    for x in vals:
        if isinstance(x,str):
            y=ALIASES.get(x,x)
            if y not in out: out.append(y)
    return out

def normalize(raw):
    if not isinstance(raw,dict): return {},["metadata root is not an object"],False
    if raw.get("schema_version")==1:
        n=dict(raw); n["purpose"]=purpose(n.get("purpose"))
        for field in ["macro_topology","route_grammar","strong_motifs","interesting_relationships","procedural_exemplar_value","similarity_avoidance"]:
            if isinstance(n.get(field),str): n[field]=[n[field]]
        for field in ["authoring_affordances","setpiece_candidates"]:
            if field in n and not isinstance(n[field],list): n[field]=[n[field]]
        return n,[],False
    legacy=raw.get("schema")=="cybersand-exemplar-v1" or "world_family" in raw
    if not legacy: return dict(raw),["unrecognized exemplar schema"],False
    n={"schema_version":1,"purpose":purpose(raw.get("uses"))}
    for a,b in {"world_family":"family","worksite":"map_role","topology":"macro_topology",
                "routing":"route_grammar","distinctive_material_motifs":"strong_motifs",
                "event_sites":"setpiece_candidates","native":"native_status"}.items():
        if a in raw: n[b]=raw[a]
    if "anchor_donors" in raw: n["anchor_donors"]=raw["anchor_donors"]
    return n,["legacy metadata mapped only where semantics are direct"],True

def validate(raw):
    n,w,legacy=normalize(raw); err=[]; missing=[x for x in REQ if x not in n]
    if n.get("schema_version")!=1: err.append("schema_version must be 1")
    if missing: err.append("missing required fields: "+", ".join(missing))
    p=n.get("purpose")
    if not isinstance(p,list) or not p: err.append("purpose must be a non-empty array")
    elif any(x not in PURPOSES for x in p): err.append("unsupported purpose value")
    for k in ["family","map_role","density_profile"]:
        if k in n and (not isinstance(n[k],str) or not n[k].strip()): err.append(k+" must be a non-empty string")
    for k in ["macro_topology","route_grammar","strong_motifs","interesting_relationships","procedural_exemplar_value"]:
        if k in n and (not isinstance(n[k],list) or any(not isinstance(x,str) or not x.strip() for x in n[k])):
            err.append(k+" must be a string or array of non-empty strings")
    for k in ["authoring_affordances","setpiece_candidates"]:
        if k in n and not isinstance(n[k],list): err.append(k+" must be an item or array")
    if "anchor_donors" in n and not isinstance(n["anchor_donors"],list): err.append("anchor_donors must be an array")
    axes=n.get("diversity_axes"); populated=0
    if axes is not None:
        if not isinstance(axes,dict): err.append("diversity_axes must be an object")
        else:
            for k,vals in axes.items():
                if k not in AXES: err.append("unknown diversity axis: "+k); continue
                if not isinstance(vals,list) or not vals: err.append("diversity_axes."+k+" must be non-empty"); continue
                populated += 1
                bad=[x for x in vals if x not in AXES[k]]
                if bad: err.append("unsupported "+k+" values: "+str(bad))
    if populated<3: w.append("fewer than three explicit diversity axes are classified")
    status="legacy-partial" if legacy else ("invalid" if err else "canonical-valid")
    return {"status":status,"errors":err,"warnings":w,"missing_fields":missing,"normalized":n}

def tokens(m):
    out=set()
    for k in SIM_FIELDS:
        for text in strings(m.get(k)):
            out |= {x for x in re.findall(r"[a-z0-9]+",text.lower().replace("_"," ")) if len(x)>2 and x not in STOP and not x.isdigit()}
    axes=m.get("diversity_axes",{})
    if isinstance(axes,dict):
        for k,vals in axes.items():
            for v in strings(vals): out.add(k+":"+v)
    return out

def neighbors(records):
    sig={r["id"]:tokens(r.get("metadata",{})) for r in records}; out={}
    for r in records:
        scores=[]; a=sig[r["id"]]
        for o in records:
            if o["id"]==r["id"] or len(a)<4 or len(sig[o["id"]])<4: continue
            u=a|sig[o["id"]]; score=len(a&sig[o["id"]])/len(u) if u else 0
            if score: scores.append((score,o["id"]))
        scores.sort(key=lambda x:(-x[0],x[1]))
        out[r["id"]]=[{"id":i,"score":round(s,4)} for s,i in scores[:3]]
    return out

def diversity(records):
    result={}
    for axis,allowed in AXES.items():
        c=collections.Counter(); classified=0
        for r in records:
            vals=r.get("metadata",{}).get("diversity_axes",{}).get(axis,[])
            if vals: classified+=1; c.update(vals)
        result[axis]={"classified_records":classified,"unclassified_records":len(records)-classified,
                      "counts":dict(c.most_common()),"unrepresented":sorted(allowed-set(c))}
    return result

class GitHub:
    def __init__(self,token=None): self.token=token
    def get(self,url,allow404=False):
        if not url.startswith("http"): url="https://api.github.com"+url
        h={"Accept":"application/vnd.github+json","User-Agent":"corpus-index-001","X-GitHub-Api-Version":"2022-11-28"}
        if self.token: h["Authorization"]="Bearer "+self.token
        try:
            with urllib.request.urlopen(urllib.request.Request(url,headers=h),timeout=60) as r: return json.load(r)
        except urllib.error.HTTPError as e:
            if allow404 and e.code==404: return None
            raise
    def pages(self,url):
        page=1
        while True:
            sep="&" if "?" in url else "?"
            batch=self.get(url+sep+"per_page=100&page="+str(page))
            yield from batch
            if len(batch)<100: break
            page+=1
    def text(self,repo,path,ref):
        p=urllib.parse.quote(path,safe="/"); r=urllib.parse.quote(ref)
        data=self.get("/repos/"+repo+"/contents/"+p+"?ref="+r,True)
        if data is None: return None
        raw=base64.b64decode(data["content"]); return raw.decode(),hashlib.sha256(raw).hexdigest()

def mapdir(path):
    pre="cybersand-canvases/2048x1024/"
    if not path.startswith(pre): return None
    parts=path.split("/")
    if len(parts)<4 or not (parts[2].startswith("original-") or parts[2].startswith("worldgroup-")): return None
    return "/".join(parts[:3])

def build(repo,gh):
    pulls=list(gh.pages("/repos/"+repo+"/pulls?state=open")); records=[]
    for pr in pulls:
        num=pr["number"]; head=pr["head"]["sha"]
        files=[x["filename"] for x in gh.pages("/repos/"+repo+"/pulls/"+str(num)+"/files")]
        dirs=sorted({d for f in files if (d:=mapdir(f)) and (f.endswith("/overview.png") or f.endswith("/exemplar.json") or re.search(r"/setup[^/]*[.]json$",f))})
        for d in dirs:
            ep=d+"/exemplar.json"; loaded=gh.text(repo,ep,head); meta={}; status="missing"; errs=[]; warns=[]; miss=list(REQ); msha=None
            if loaded:
                text,msha=loaded
                try: checked=validate(json.loads(text))
                except json.JSONDecodeError as e: status="invalid"; errs=["invalid JSON: "+str(e)]
                else: status=checked["status"]; meta=checked["normalized"]; errs=checked["errors"]; warns=checked["warnings"]; miss=checked["missing_fields"]
            rid="pr-"+str(num)+":"+d.rsplit("/",1)[-1]
            records.append({"id":rid,"display_name":meta.get("map_role") or d.rsplit("/",1)[-1],
                "scope":"worldgroup" if d.rsplit("/",1)[-1].startswith("worldgroup-") else "original",
                "pr_number":num,"pr_title":pr["title"],"pr_url":pr["html_url"],"head_sha":head,"head_branch":pr["head"]["ref"],
                "map_directory":d,"exemplar_file":ep if loaded else None,"metadata_sha256":msha,
                "metadata_status":status,"metadata_errors":errs,"metadata_warnings":warns,"metadata_missing_fields":miss,"metadata":meta})
    records.sort(key=lambda x:(x["scope"],x["pr_number"],x["map_directory"]))
    return {"schema_version":1,"generated_at_utc":dt.datetime.now(dt.timezone.utc).isoformat(),"repository":repo,
            "open_prs_inspected":len(pulls),"records":records,"diversity":diversity(records),"nearest_neighbors":neighbors(records),
            "similarity_method":{"name":"declared-metadata lexical Jaccard","advisory_only":True}}

def report(idx):
    rs=idx["records"]; st=collections.Counter(x.get("metadata_status","unknown") for x in rs)
    lines=["# CyberSand exemplar corpus diversity report","",
           "Open PRs inspected: **"+str(idx["open_prs_inspected"])+"**  ","Corpus map records: **"+str(len(rs))+"**","",
           "## Metadata coverage","","| Status | Maps |","|---|---:|"]
    for k,v in sorted(st.items()): lines.append("| "+k+" | "+str(v)+" |")
    lines += ["","Missing metadata never invalidates a map; legacy-partial records do not fabricate missing design claims.","","## Explicit diversity-axis gaps",""]
    for k,d in idx["diversity"].items():
        lines += ["### "+k,"","Classified: **"+str(d["classified_records"])+" / "+str(len(rs))+"**.",
                  "Observed: "+(", ".join(x+" x "+str(n) for x,n in d["counts"].items()) if d["counts"] else "none")+".",
                  "Unrepresented: "+", ".join(d["unrepresented"])+".",""]
    lines += ["## Similarity watch","","Lexical Jaccard over declared structural metadata is advisory only; it is not geometric similarity or an automatic rejection gate.",""]
    pairs=[]; by={x["id"]:x for x in rs}
    for a,ns in idx["nearest_neighbors"].items():
        for n in ns:
            if a<n["id"] and n["score"]>=0.35: pairs.append((n["score"],a,n["id"]))
    pairs.sort(reverse=True)
    if pairs:
        lines += ["| Score | A | B |","|---:|---|---|"]
        for s,a,b in pairs[:20]: lines.append("| %.3f | %s | %s |"%(s,by[a]["display_name"],by[b]["display_name"]))
    else: lines.append("No pair crossed the 0.35 advisory threshold.")
    return "\n".join(lines)+"\n"

def main():
    ap=argparse.ArgumentParser(); sub=ap.add_subparsers(dest="cmd",required=True)
    v=sub.add_parser("validate"); v.add_argument("file"); v.add_argument("--allow-legacy",action="store_true")
    g=sub.add_parser("index-github"); g.add_argument("--repo",default="techrote/sandmapsreference"); g.add_argument("--output-dir",default="build/corpus-index")
    r=sub.add_parser("report"); r.add_argument("index"); r.add_argument("--output")
    a=ap.parse_args()
    if a.cmd=="validate":
        c=validate(json.loads(pathlib.Path(a.file).read_text())); print(json.dumps(c,indent=2,sort_keys=True))
        return 0 if c["status"]=="canonical-valid" or (a.allow_legacy and c["status"]=="legacy-partial") else 1
    if a.cmd=="index-github":
        idx=build(a.repo,GitHub(os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN"))); out=pathlib.Path(a.output_dir); out.mkdir(parents=True,exist_ok=True)
        (out/"corpus-index.json").write_text(json.dumps(idx,indent=2,sort_keys=True)+"\n"); (out/"diversity-report.md").write_text(report(idx))
        print(json.dumps({"records":len(idx["records"]),"status":dict(collections.Counter(x["metadata_status"] for x in idx["records"]))},sort_keys=True)); return 0
    idx=json.loads(pathlib.Path(a.index).read_text()); text=report(idx)
    pathlib.Path(a.output).write_text(text) if a.output else print(text,end=""); return 0

if __name__=="__main__": raise SystemExit(main())
