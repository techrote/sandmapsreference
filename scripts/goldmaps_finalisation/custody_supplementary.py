#!/usr/bin/env python3
"""Recover the three portrait donors omitted from the original 71-PR delta archive.

The exact commits and map paths come from frozen portrait aspect_transfer.json,
not from mutable default branches. This adds custody; it changes no originals.
"""
from __future__ import annotations
import argparse
import concurrent.futures
import json
import urllib.parse
import urllib.request
from pathlib import Path
from custody_verify import REPO, git, tree, classify, sha256, verify_bytes

DONORS = [
    {"pr": 37, "commit": "e2b53fb95ea93576afdc15c114e29b853c4b2c05", "portrait_pr": 197,
     "path": "cybersand-canvases/2048x1024/original-industrial-transit-wide-silt-meridian-bascule-ferry-261120/"},
    {"pr": 124, "commit": "99616a8c8d2475ad4145a8489c0cc8850b1bd783", "portrait_pr": 196,
     "path": "cybersand-canvases/2048x1024/original-industrial-transit-wide-warden-scrapline-fractured-trestle-261121/"},
    {"pr": 135, "commit": "a3f9962a0107d07bca1116940fde1c825ac76a4f", "portrait_pr": 192,
     "path": "cybersand-canvases/2048x1024/original-industrial-foundry-wide-spindlebreak-fault-cable-smeltery-261121/"},
]


def recover(repo: Path, out: Path) -> dict:
    work = []
    for source in DONORS:
        for path, item in tree(repo, source["commit"]).items():
            if path.startswith(source["path"]):
                work.append((source, path, item))

    def acquire(item):
        source, path, obj = item
        relative = f"PR-{source['pr']:04d}-{source['commit'][:12]}/{path}"
        local = out / relative
        if local.exists():
            data = local.read_bytes()
        else:
            url = f"https://raw.githubusercontent.com/{REPO}/{source['commit']}/" + urllib.parse.quote(path, safe="/")
            with urllib.request.urlopen(url, timeout=60) as response:
                data = response.read(64 * 1024 * 1024 + 1)
            if len(data) > 64 * 1024 * 1024:
                raise ValueError("Supplementary artifact exceeds bounded download")
        verify_bytes(data, obj["git_blob"])
        local.parent.mkdir(parents=True, exist_ok=True)
        local.write_bytes(data)
        kind, dimensions = classify(path, data)
        return {"source_pr": source["pr"], "commit": source["commit"], "path": path,
                "git_blob": obj["git_blob"], "sha256": sha256(data), "size_bytes": len(data),
                "type": kind, "dimensions": dimensions, "recovery_location": relative,
                "source_uri": f"https://github.com/{REPO}/blob/{source['commit']}/{path}",
                "scientific_roles": ["PORTRAIT_DONOR"], "verification_status": "BYTE_VERIFIED",
                "owner_acceptance": "PENDING"}

    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        artifacts = sorted(pool.map(acquire, work), key=lambda x: (x["source_pr"], x["path"]))
    return {"schema_version": "goldmaps-supplementary-donors.v1", "result": "PASS",
            "authority": "Frozen original portrait aspect_transfer.json for #192, #196, #197",
            "original_71_source_archive_changed": False, "sources": DONORS,
            "artifact_count": len(artifacts), "artifacts": artifacts,
            "limits": ["Only donor map directories are recovered here; unrelated workflow files are omitted",
                       "Byte custody does not infer Art, native, or owner acceptance"]}


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--repo", required=True, type=Path)
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--manifest", required=True, type=Path)
    args = ap.parse_args()
    report = recover(args.repo, args.out)
    args.manifest.parent.mkdir(parents=True, exist_ok=True)
    args.manifest.write_text(json.dumps(report, indent=2) + "\n")
    print(f"PASS: {len(DONORS)} extra donors; {report['artifact_count']} exact Git blobs recovered")


if __name__ == "__main__":
    main()
