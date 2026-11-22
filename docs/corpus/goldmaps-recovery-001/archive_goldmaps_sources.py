#!/usr/bin/env python3
"""Read-only source-delta archive for every SHA-pinned Goldmaps PR (no code execution)."""
import argparse,base64,concurrent.futures,hashlib,json,os,re,time,urllib.error,urllib.parse,urllib.request,zipfile
from pathlib import Path

REPO="techrote/sandmapsreference"
MAIN="99a166e7fcae45eb22be1740e9f33f62faccbcc7"
MAX_FILE=64*1024*1024
MAX_TOTAL=2*1024*1024*1024

def git_blob(data):
    return hashlib.sha1(b"blob "+str(len(data)).encode()+b"\0"+data).hexdigest()

def fetch(url,limit=MAX_FILE,api=False):
    headers={"User-Agent":"Goldmaps-Recovery-001-read-only","Accept":"application/vnd.github+json"}
    if api and os.getenv("GITHUB_TOKEN"):
        headers["Authorization"]="Bearer "+os.environ["GITHUB_TOKEN"]
    for attempt in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url,headers=headers),timeout=90) as resp:
                data=resp.read(limit+1)
            if len(data)>limit: raise ValueError("Response exceeds file limit: "+url)
            return data
        except (urllib.error.URLError,TimeoutError):
            if attempt==3: raise
            time.sleep(min(2**attempt,8))

def api_json(route):
    return json.loads(fetch("https://api.github.com/repos/"+REPO+"/"+route,8*1024*1024,True))

def tree(sha):
    d=api_json("git/trees/"+sha+"?recursive=1")
    if d.get("truncated"):raise ValueError("Refuse truncated Git tree "+sha)
    return {x["path"]:x for x in d["tree"] if x.get("type")=="blob"}

def safe(p):
    if not isinstance(p,str) or not p or p.startswith("/") or "\\" in p or ":" in p:
        raise ValueError("Unsafe Git path "+repr(p))
    if any(x in ("",".","..") or x.endswith(("."," ")) for x in p.split("/")):
        raise ValueError("Ambiguous path "+repr(p))
    return p

def sources(idx):
    found={}
    def add(pr,sha,role):
        pr=int(pr)
        if not re.fullmatch("[a-f0-9]{40}",sha):raise ValueError("Invalid SHA for "+str(pr))
        old=found.get(pr)
        if old:
            if old["sha"]!=sha:raise ValueError("Inconsistent HEAD for "+str(pr))
            if role not in old["roles"]:old["roles"].append(role)
        else:found[pr]={"pr":pr,"sha":sha,"roles":[role]}
    for label,key in [("PREPASS","prepass"),("PORTRAIT_ORIGINAL","original_portraits"),
                      ("GOLD25","gold25"),("ASTRA_ORIGINAL","original_arms"),
                      ("ASTRA_CHILD","trial_children"),("PORTRAIT_REPAIR","repair_children"),
                      ("INFRASTRUCTURE","independent_corpus_prs")]:
        for x in idx[key]:add(x["pr"],x["sha"],label)
    add(idx["trial_ledger"]["pr"],idx["trial_ledger"]["sha"],"TRIAL_LEDGER")
    return [found[n] for n in sorted(found)]

def blob_contents(ref,path,oid,gitbytes):
    url="https://raw.githubusercontent.com/"+REPO+"/"+ref+"/"+urllib.parse.quote(path,safe="/")
    a=fetch(url)
    if git_blob(a)==oid and len(a)==gitbytes:
        if not a.startswith(b"version https://git-lfs.github.com/spec/v1"):
            return a,{"sha256":hashlib.sha256(a).hexdigest(),"lfs":False}
        ptr=a
    else:
        data=api_json("git/blobs/"+oid)
        if data.get("encoding")!="base64":raise ValueError("Invalid Git blob encoding")
        ptr=base64.b64decode(data["content"])
        if git_blob(ptr)!=oid or len(ptr)!=gitbytes:raise ValueError("Git blob mismatch "+path)
    if not ptr.startswith(b"version https://git-lfs.github.com/spec/v1"):
        raise ValueError("Content mismatch "+path)
    mo=re.search(rb"oid sha256:([a-f0-9]{64})",ptr)
    ms=re.search(rb"(?m)^size ([0-9]+)$",ptr)
    if not mo or not ms:raise ValueError("Invalid LFS pointer "+path)
    digest=mo.group(1).decode();length=int(ms.group(1))
    if length>MAX_FILE:raise ValueError("LFS media exceeds file cap "+path)
    if hashlib.sha256(a).hexdigest()==digest and len(a)==length:
        result=a
    else:
        media="https://media.githubusercontent.com/media/"+REPO+"/"+ref+"/"+urllib.parse.quote(path,safe="/")
        result=fetch(media,length)
    if hashlib.sha256(result).hexdigest()!=digest or len(result)!=length:
        raise ValueError("LFS media mismatch "+path)
    return result,{"sha256":digest,"lfs":True,"length":length}

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--inventory",required=True,type=Path)
    ap.add_argument("--out",required=True,type=Path)
    args=ap.parse_args()
    idx=json.loads(args.inventory.read_text())
    if idx.get("schema_version")!="goldmaps-recovery.v1" or idx.get("accepted_main")!=MAIN:
        raise ValueError("Invalid frozen inventory")
    entries=sources(idx)
    if len(entries)!=71:raise ValueError("Unexpected set of source PRs: "+str(len(entries)))
    out=args.out.resolve()
    if out.exists():raise ValueError("Refusing to overwrite output")
    out.mkdir(parents=True)
    cache=out/"cache";cache.mkdir()
    base=tree(MAIN);work=[];projected=0;per=[]
    for i,e in enumerate(entries,1):
        t=tree(e["sha"])
        diffs=[]
        for path,data in t.items():
            if path not in base or base[path]["sha"]!=data["sha"]:
                safe(path)
                if data.get("size",0)>MAX_FILE:raise ValueError("File exceeds bound "+path)
                projected+=data.get("size",0)
                diffs.append({"path":path,"git_blob":data["sha"],"git_bytes":data.get("size",0)})
        if not diffs:raise ValueError("No source changes for PR#"+str(e["pr"]))
        e["files"]=sorted(diffs,key=lambda x:x["path"])
        work.extend((e,f) for f in diffs)
        per.append({"pr":e["pr"],"sha":e["sha"],"roles":e["roles"],"files":len(diffs)})
        print("SOURCES",i,"/",len(entries),"PR",e["pr"],"files",len(diffs),flush=True)
    if projected>MAX_TOTAL:raise ValueError("Source snapshot over 2 GiB bound")
    unique={}
    for e,f in work:unique.setdefault(f["git_blob"],(e,f))
    print("UNIQUE_GIT_BLOBS",len(unique),"FILE_OCCURRENCES",len(work),flush=True)
    def acquire(item):
        oid,(e,f)=item
        data,receipt=blob_contents(e["sha"],f["path"],oid,f["git_bytes"])
        (cache/oid).write_bytes(data)
        return oid,receipt
    receipts={}
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        futures=[pool.submit(acquire,item) for item in unique.items()]
        for i,f in enumerate(concurrent.futures.as_completed(futures),1):
            oid,r=f.result();receipts[oid]=r
            if i%100==0:print("VERIFIED_BLOBS",i,flush=True)
    result=out/"GOLDMAPS-all-71-source-PR-deltas.zip"
    with zipfile.ZipFile(result,"x",zipfile.ZIP_DEFLATED,compresslevel=4,allowZip64=True) as z:
        z.writestr("inventory.v1.json",args.inventory.read_bytes())
        z.writestr("README.txt","Read-only, exact changed-file deltas of 71 source PRs relative to "+MAIN+
                   ". Git object SHA1 and any hydrated LFS SHA256 verified. Unchanged accepted-main files omitted.\n")
        for e,f in work:
            z.writestr("PR-%04d-%s/"%(e["pr"],e["sha"][:12])+f["path"],(cache/f["git_blob"]).read_bytes())
        z.writestr("source-blob-receipts.json",json.dumps(receipts,indent=2)+"\n")
    with result.open("rb") as h:archive_sha=hashlib.file_digest(h,"sha256").hexdigest()
    report={"schema_version":1,"result":"PASS","repository":REPO,"main_sha":MAIN,
        "source_pr_count":len(entries),"source_file_occurrences":len(work),
        "unique_git_blobs":len(unique),
        "hydrated_lfs_unique_blobs":sum(int(x["lfs"]) for x in receipts.values()),
        "archive_bytes":result.stat().st_size,"archive_sha256":archive_sha,
        "prs":per,"limitations":["Only changes relative to accepted main, not redundant base source",
                              "No author code is executed","Art/native acceptance not inferred"]}
    (out/"source-recovery-receipt.json").write_text(json.dumps(report,indent=2)+"\n")
    print("GOLDMAPS_SOURCE_RECOVERY_PASS",len(entries),len(work),archive_sha,flush=True)

if __name__=="__main__":
    main()
