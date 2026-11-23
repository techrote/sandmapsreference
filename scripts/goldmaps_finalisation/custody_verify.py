#!/usr/bin/env python3
"""Independently verify the frozen Goldmaps archive against exact Git trees.

This deliberately does not import or execute archived author code.  A PASS means
byte custody, not artistic, native, or owner acceptance.  The source archive is
the changed-file delta of each source PR against accepted_main, not 71 redundant
copies of accepted main.  Artifact paths are relative to an extracted archive.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import struct
import subprocess
import zipfile
from collections import Counter
from pathlib import Path, PurePosixPath

SCHEMA = "goldmaps-master-artifacts.v1"
REPO = "techrote/sandmapsreference"
RECOVERY_HEAD = "6c4edd3d05476848cbebb800090080ae824ad208"
MAIN = "99a166e7fcae45eb22be1740e9f33f62faccbcc7"
SOURCE_ARCHIVE_SHA256 = "ea32029b77983e8d2b12f3ee485629347239f11537e77f8e21f1ced3e0953419"
SOURCE_ARCHIVE_BYTES = 6730063
SOURCE_GROUPS = {
    "prepass": "PREPASS", "original_portraits": "PORTRAIT_ORIGINAL",
    "gold25": "GOLD25", "original_arms": "ASTRA_ORIGINAL",
    "trial_children": "ASTRA_CHILD", "repair_children": "PORTRAIT_REPAIR",
    "independent_corpus_prs": "INFRASTRUCTURE",
}


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def git_blob(data: bytes) -> str:
    return hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest()


def safe_path(path: str) -> str:
    if not isinstance(path, str) or not path or "\\" in path or ":" in path:
        raise ValueError(f"Ambiguous archive path: {path!r}")
    p = PurePosixPath(path)
    if p.is_absolute() or any(part in ("", ".", "..") or part.endswith((".", " "))
                              for part in path.split("/")):
        raise ValueError(f"Unsafe archive path: {path!r}")
    return path


def verify_bytes(data: bytes, oid: str, digest: str | None = None) -> None:
    if git_blob(data) != oid:
        raise ValueError(f"Git object identity mismatch: {oid}")
    if digest is not None and sha256(data) != digest:
        raise ValueError(f"SHA-256 mismatch: {oid}")


def source_set(index: dict) -> list[dict]:
    found: dict[int, dict] = {}
    entries = [(role, row) for group, role in SOURCE_GROUPS.items()
               for row in index[group]]
    entries.append(("TRIAL_LEDGER", index["trial_ledger"]))
    for role, row in entries:
        pr, commit = int(row["pr"]), row["sha"]
        if not re.fullmatch(r"[0-9a-f]{40}", commit):
            raise ValueError(f"Unpinned source PR {pr}")
        if pr in found and found[pr]["commit"] != commit:
            raise ValueError(f"Conflicting exact source PR {pr}")
        entry = found.setdefault(pr, {"pr": pr, "commit": commit, "roles": []})
        if role not in entry["roles"]:
            entry["roles"].append(role)
    return [found[pr] for pr in sorted(found)]


def git(repo: Path, *args: str) -> bytes:
    return subprocess.check_output(["git", "-C", str(repo), *args])


def tree(repo: Path, commit: str) -> dict:
    result = {}
    for row in git(repo, "ls-tree", "-rz", commit).split(b"\0"):
        if not row:
            continue
        info, path_bytes = row.split(b"\t", 1)
        mode, kind, oid = info.decode("ascii").split()
        path = safe_path(path_bytes.decode("utf-8"))
        if kind == "blob":
            result[path] = {"git_blob": oid, "mode": mode}
        elif kind != "commit":
            raise ValueError(f"Unexpected Git object kind at {path}: {kind}")
    return result


def classify(path: str, data: bytes) -> tuple[str, list[int] | None]:
    suffix = PurePosixPath(path).suffix.lower()
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        if len(data) < 33 or data[12:16] != b"IHDR":
            raise ValueError(f"Malformed PNG header: {path}")
        return "png", list(struct.unpack(">II", data[16:24]))
    if suffix in (".json", ".jsonl"):
        if suffix == ".json":
            obj = json.loads(data)
            if isinstance(obj, dict) and obj.get("version") == 2 and "extent" in obj and "edits" in obj:
                return "setup-v2", obj["extent"]
        return "structured-evidence", None
    if suffix in (".py", ".js", ".mjs", ".cjs", ".gd", ".ps1", ".cmd"):
        return "builder-or-verifier", None
    if suffix in (".yml", ".yaml"):
        return "workflow", None
    if suffix in (".dll", ".so", ".exe"):
        return "native-binary", None
    if suffix in (".md", ".txt", ".log"):
        return "narrative-evidence", None
    return "other", None


def compare_archive_members(actual: list[str], expected: set[str]) -> None:
    if len(actual) != len(set(actual)):
        raise ValueError("Duplicate archive members")
    for name in actual:
        safe_path(name)
    missing, extra = sorted(expected - set(actual)), sorted(set(actual) - expected)
    if missing or extra:
        raise ValueError(f"Archive member mismatch: missing={missing[:8]}, extra={extra[:8]}")


def verify_archive(repo: Path, archive: Path, index: dict, live: list[dict] | None,
                   extracted: Path | None = None, require_original_container: bool = False) -> tuple[dict, dict]:
    if index["accepted_main"] != MAIN:
        raise ValueError("Accepted baseline mismatch")
    sources = source_set(index)
    if len(sources) != 71:
        raise ValueError(f"Expected 71 distinct sources, got {len(sources)}")
    data = archive.read_bytes()
    container_sha256 = sha256(data)
    matches_historical_container = len(data) == SOURCE_ARCHIVE_BYTES and container_sha256 == SOURCE_ARCHIVE_SHA256
    if require_original_container and not matches_historical_container:
        raise ValueError("Frozen source archive container hash/size mismatch")
    baseline = tree(repo, MAIN)
    live_by_pr = {x["number"]: x for x in live or []}
    expected = {"README.txt", "inventory.v1.json", "source-blob-receipts.json"}
    changes = []
    source_records = []
    deviations = []
    for s in sources:
        current = tree(repo, s["commit"])
        rows = {path: item for path, item in current.items()
                if path not in baseline or item != baseline[path]}
        prefix = f"PR-{s['pr']:04d}-{s['commit'][:12]}/"
        for path, item in sorted(rows.items()):
            name = prefix + path
            expected.add(name)
            changes.append((s, path, name, item))
        record = {**s, "source_uri": f"https://github.com/{REPO}/pull/{s['pr']}",
                  "archived_file_count": len(rows),
                  "deleted_paths_vs_accepted_main": sorted(set(baseline) - set(current))}
        if live is not None:
            if s["pr"] not in live_by_pr:
                raise ValueError(f"Missing live PR response: {s['pr']}")
            lp = live_by_pr[s["pr"]]
            ref = git(repo, "rev-parse", f"refs/remotes/goldmaps/pr-{s['pr']}").decode().strip()
            state = {"head": lp["head"]["sha"], "git_ref_head": ref,
                     "state": lp["state"], "draft": lp["draft"],
                     "updated_at": lp["updated_at"], "merged_at": lp["merged_at"]}
            record["live_observation"] = state
            if state["head"] != s["commit"] or ref != s["commit"] or lp["state"] != "open" or not lp["draft"]:
                deviations.append({"pr": s["pr"], "frozen_head": s["commit"], **state})
        source_records.append(record)
    artifacts = []
    seen_blobs = set()
    with zipfile.ZipFile(archive) as z:
        compare_archive_members(z.namelist(), expected)
        if json.loads(z.read("inventory.v1.json")) != index:
            raise ValueError("Archive inventory does not match recovery authority")
        receipts = json.loads(z.read("source-blob-receipts.json"))
        for s, path, name, item in changes:
            content = z.read(name)
            oid = item["git_blob"]
            receipt = receipts[oid]
            if receipt.get("lfs"):
                raise ValueError("Unexpected hydrated LFS source in this frozen archive")
            verify_bytes(content, oid, receipt["sha256"])
            if item["mode"] not in ("100644", "100755"):
                raise ValueError(f"Unexpected nonregular source: {path}")
            if extracted is not None:
                local = extracted / name
                if local.is_symlink() or not local.is_file():
                    raise ValueError(f"Missing/nonregular extracted artifact: {name}")
                verify_bytes(local.read_bytes(), oid, receipt["sha256"])
            kind, dims = classify(path, content)
            seen_blobs.add(oid)
            artifacts.append({
                "artifact_id": f"pr-{s['pr']}:{path}", "type": kind,
                "source_pr": s["pr"], "commit": s["commit"], "git_blob": oid,
                "git_mode": item["mode"], "path": path,
                "source_uri": f"https://github.com/{REPO}/blob/{s['commit']}/{path}",
                "sha256": receipt["sha256"], "size_bytes": len(content),
                "dimensions": dims, "recovery_location": name,
                "scientific_roles": s["roles"], "verification_status": "BYTE_VERIFIED",
                "owner_acceptance": "PENDING", "supersession": "see source_relationships",
            })
        if seen_blobs != set(receipts):
            raise ValueError("Receipt blob set differs from actual source archive")
    if len(artifacts) != 1343 or len(seen_blobs) != 1124:
        raise ValueError(f"Frozen archive cardinality changed: {len(artifacts)}/{len(seen_blobs)}")
    relationships = [{"relationship": "portrait_repair_child", "parent_pr": x["parent"],
                      "child_pr": x["pr"], "child_commit": x["sha"],
                      "substitutes_frozen_trial_original": False}
                     for x in index["repair_children"]]
    original_by_arm = {x.get("arm", x.get("slot")): x for x in index["original_arms"]}
    for child in index["trial_children"]:
        arm = child.get("arm", child.get("slot"))
        parent = original_by_arm.get(arm, {})
        relationships.append({"relationship": "frozen_astra_candidate", "arm": arm,
                              "parent_pr": parent.get("pr"), "child_pr": child["pr"],
                              "child_commit": child["sha"], "replaces_parent": False})
    result = {
        "schema_version": SCHEMA, "repository": REPO, "recovery_head": RECOVERY_HEAD,
        "accepted_main": MAIN, "source_archive_sha256": container_sha256,
        "source_archive_bytes": len(data), "matches_historical_container": matches_historical_container,
        "historical_source_archive_sha256": SOURCE_ARCHIVE_SHA256,
        "recovery_layout": "Paths are relative to the extracted GOLDMAPS-all-71-source-PR-deltas.zip",
        "producing_pr_semantics": "source_pr identifies the archived PR occurrence, not the earliest historical author",
        "acceptance_semantics": "Byte verification infers no Art, native, Gold, Platinum, or owner acceptance",
        "missing_metadata_semantics": "Unknown, never absent or failed",
        "sources": source_records, "source_relationships": relationships, "artifacts": artifacts,
    }
    counts = Counter(x["type"] for x in artifacts)
    report = {
        "schema_version": "goldmaps-custody-verification.v1", "result": "PASS",
        "recovery_head": RECOVERY_HEAD, "accepted_main": MAIN,
        "source_archive_sha256": container_sha256,
        "matches_historical_container": matches_historical_container,
        "distinct_source_prs": len(sources), "verified_file_occurrences": len(artifacts),
        "verified_unique_git_blobs": len(seen_blobs), "artifact_type_counts": dict(counts),
        "extracted_bytes_verified": extracted is not None,
        "live_pr_checked": live is not None, "live_deviations": deviations,
        "historical_source_preserved": True,
        "scope": ["Exact Git-tree delta comparison", "Every archive member Git-SHA1 and SHA-256",
                  "Extracted bytes when --extracted is supplied", "No author code executed"],
        "limitations": ["Custody is not artistic or native acceptance", "Source archive contains PR deltas, not unchanged accepted-main assets",
                        "Current PR drift, if any, is reported without replacing frozen authorities"],
    }
    return result, report


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--repo", required=True, type=Path)
    ap.add_argument("--archive", required=True, type=Path)
    ap.add_argument("--inventory", required=True, type=Path)
    ap.add_argument("--live-pr-audit", type=Path)
    ap.add_argument("--extracted", type=Path)
    ap.add_argument("--require-original-container", action="store_true",
                    help="Also require exact original recovery ZIP bytes; omit for hash-identical rebuilt contents")
    ap.add_argument("--out", required=True, type=Path)
    args = ap.parse_args()
    index = json.loads(args.inventory.read_text())
    live = json.loads(args.live_pr_audit.read_text()) if args.live_pr_audit else None
    master, report = verify_archive(args.repo, args.archive, index, live, args.extracted, args.require_original_container)
    args.out.mkdir(parents=True, exist_ok=True)
    master_bytes = (json.dumps(master, indent=2, ensure_ascii=False) + "\n").encode()
    (args.out / "master-artifacts.v1.json").write_bytes(master_bytes)
    report["master_inventory_sha256"] = sha256(master_bytes)
    (args.out / "verification.v1.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
