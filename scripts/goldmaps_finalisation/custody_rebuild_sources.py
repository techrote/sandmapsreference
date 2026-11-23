#!/usr/bin/env python3
"""Rebuild all 71 source deltas with Git + immutable raw URLs; no REST token needed.

Every downloaded byte is checked against the exact Git tree before packaging.
ZIP timestamps and compression are not scientific identities: use custody_verify
without --require-original-container to verify a new container's frozen contents.
"""
from __future__ import annotations
import argparse
import concurrent.futures
import json
import urllib.parse
import urllib.request
import zipfile
from pathlib import Path
from custody_verify import MAIN, REPO, git, sha256, source_set, tree, verify_bytes


def rebuild(repo: Path, inventory: Path, out: Path, cache: Path,
            source_root: Path | None = None, fetch: bool = False) -> dict:
    index = json.loads(inventory.read_text())
    sources = source_set(index)
    if index["accepted_main"] != MAIN or len(sources) != 71:
        raise ValueError("Not the frozen 71-source recovery inventory")
    if out.exists():
        raise ValueError("Refusing to overwrite an archive")
    if fetch:
        git(repo, "fetch", "--no-tags", "origin", MAIN, *(x["commit"] for x in sources))
    baseline = tree(repo, MAIN)
    work = []
    for source in sources:
        for path, obj in sorted(tree(repo, source["commit"]).items()):
            if path not in baseline or obj != baseline[path]:
                name = f"PR-{source['pr']:04d}-{source['commit'][:12]}/{path}"
                work.append((source, path, obj, name))
    unique = {}
    for item in work:
        unique.setdefault(item[2]["git_blob"], item)
    if len(work) != 1343 or len(unique) != 1124:
        raise ValueError("Source tree deltas differ from frozen recovery cardinality")
    cache.mkdir(parents=True, exist_ok=True)

    def acquire(item):
        source, path, obj, name = item
        oid = obj["git_blob"]
        cached = cache / oid
        if cached.is_file():
            data = cached.read_bytes()
        elif source_root is not None:
            data = (source_root / name).read_bytes()
        else:
            url = f"https://raw.githubusercontent.com/{REPO}/{source['commit']}/" + urllib.parse.quote(path, safe="/")
            with urllib.request.urlopen(url, timeout=90) as response:
                data = response.read(64 * 1024 * 1024 + 1)
        if len(data) > 64 * 1024 * 1024:
            raise ValueError("Source blob exceeds 64 MiB cap")
        verify_bytes(data, oid)
        if data.startswith(b"version https://git-lfs.github.com/spec/v1"):
            raise ValueError("Unexpected LFS pointer in frozen non-LFS corpus")
        cached.write_bytes(data)
        return oid, {"sha256": sha256(data), "lfs": False}

    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        receipts = dict(pool.map(acquire, unique.values()))
    total = sum((cache / x[2]["git_blob"]).stat().st_size for x in work)
    if total > 2 * 1024 * 1024 * 1024:
        raise ValueError("Source archive exceeds 2 GiB cap")
    out.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(out, "x", zipfile.ZIP_DEFLATED, compresslevel=4) as archive:
        def write(name, data):
            info = zipfile.ZipInfo(name, (1980, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            archive.writestr(info, data, compresslevel=4)
        write("inventory.v1.json", inventory.read_bytes())
        write("README.txt", ("Read-only, exact changed-file deltas of 71 source PRs relative to " + MAIN +
              ". Git object SHA1 and SHA256 verified. Unchanged accepted-main files omitted.\n").encode())
        for _, _, obj, name in work:
            write(name, (cache / obj["git_blob"]).read_bytes())
        write("source-blob-receipts.json", (json.dumps(receipts, sort_keys=True, indent=2) + "\n").encode())
    report = {"schema_version": "goldmaps-source-rebuild.v1", "result": "PASS", "sources": 71,
              "file_occurrences": len(work), "unique_blobs": len(unique), "uncompressed_artifact_bytes": total,
              "archive_sha256": sha256(out.read_bytes()), "archive_bytes": out.stat().st_size,
              "contract": "All file identities, not byte identity of the historical ZIP container",
              "network": "Git and immutable raw URLs only; no GitHub REST token or Actions artifact required"}
    out.with_suffix(".receipt.json").write_text(json.dumps(report, indent=2) + "\n")
    return report


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--repo", required=True, type=Path)
    ap.add_argument("--inventory", required=True, type=Path)
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--cache", required=True, type=Path)
    ap.add_argument("--source-root", type=Path, help="Verified existing extraction; omit to acquire immutable raw URLs")
    ap.add_argument("--fetch", action="store_true", help="Fetch exact immutable source commits into the supplied clone")
    args = ap.parse_args()
    print(json.dumps(rebuild(args.repo, args.inventory, args.out, args.cache, args.source_root, args.fetch), indent=2))


if __name__ == "__main__":
    main()
