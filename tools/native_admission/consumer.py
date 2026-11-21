"""Read-only, stdlib-only evidence consumer. No owner files or write token needed."""
from __future__ import annotations

import argparse
import json
import os
from pathlib import Path

from . import catalog
from .common import (EVIDENCE_BRANCH, REPOSITORY, IntegrityError, require,
                     safe_path, write_json)
from .github import GitHubClient, GitHubError, commit_sha


def remote_snapshot(client: GitHubClient, commit: str | None = None):
    if commit is None:
        ref = client.get_json(f"/repos/{REPOSITORY}/git/ref/heads/{EVIDENCE_BRANCH}")
        commit = commit_sha(ref["object"]["sha"])
    else:
        commit_sha(commit)
    # Pin every read to this commit. A concurrent publisher cannot split the view.
    def fetch(path):
        safe_path(path)
        return client.get_bytes(f"https://raw.githubusercontent.com/{REPOSITORY}/{commit}/{path}")
    index, records = catalog.read_snapshot(fetch)
    return commit, index, records


def consume(client, records, prs, *, expected_dll, prove_superseded=False, origin=None):
    require(1 <= len(prs) <= 6 and len(set(prs)) == len(prs), "one to six unique PRs required")
    engine = client.get_json("/repos/techrote/cybersand/commits/main")
    engine_sha = commit_sha(engine["sha"])
    if origin is not None:
        records = [r for r in records if r["execution"]["origin"] == origin]
    results, negative = [], []
    for pr in prs:
        candidates = [r for r in records if r["map"]["pr"] == pr and
                      r["runtime"]["engine_sha"] == engine_sha and r["runtime"]["native_dll_sha256"] == expected_dll]
        if not candidates:
            results.append({"pr": pr, "status": "MISSING", "current": False})
            continue
        paths = sorted({r["map"]["setup_path"] for r in candidates})
        for path in paths:
            current = client.get_json(f"/repos/{REPOSITORY}/pulls/{pr}")
            # verify_pr validates the response independently; raw lookup is used
            # only to choose the exact requested key, never to infer PASS.
            head = commit_sha(current["head"]["sha"])
            matching = [r for r in candidates if r["map"]["setup_path"] == path and r["map"]["head_sha"] == head]
            source = matching[0] if matching else next(r for r in candidates if r["map"]["setup_path"] == path)
            m = source["map"]
            verification = client.verify_pr(REPOSITORY, pr, head)
            result = catalog.query(records, pr=pr, head_sha=head, setup_path=path,
                setup_sha256=m["setup_sha256"], engine_sha=engine_sha, native_dll_sha256=expected_dll,
                current_head=verification, current_engine_sha=engine_sha)
            results.append(result)
            if prove_superseded:
                changed = "f" * 40 if head != "f" * 40 else "e" * 40
                shifted = catalog.query(records, pr=pr, head_sha=changed, setup_path=path,
                    setup_sha256=m["setup_sha256"], engine_sha=engine_sha, native_dll_sha256=expected_dll)
                require(shifted["status"] == "SUPERSEDED" and shifted["current"] is False,
                        "changed-HEAD consumer regression")
                negative.append({"pr": pr, "setup_path": path, "simulated_head": changed,
                                 "status": shifted["status"], "modified_repository": False})
    return {"schema": "cybersand-native-consumer-v1", "accepted_engine_sha": engine_sha,
            "native_dll_sha256": expected_dll, "required_origin": origin, "results": results, "changed_head_checks": negative,
            "status": "VERIFIED_CURRENT" if results and all(r.get("current") is True for r in results) else "NOT_ACCEPTED",
            "art": "UNTESTED", "shepherd": "UNTESTED", "gui": "UNTESTED", "collision": "UNTESTED", "hazards": "UNTESTED"}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--commit", help="Optional immutable evidence commit; default resolves evidence branch once")
    parser.add_argument("--prs", default="25,26,17,22")
    parser.add_argument("--native-dll-sha256", required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--prove-superseded", action="store_true")
    parser.add_argument("--origin", choices=["github-hosted-windows", "owner-local-windows"])
    args = parser.parse_args()
    try:
        require(len(args.native_dll_sha256) == 64 and all(x in "0123456789abcdef" for x in args.native_dll_sha256), "invalid DLL digest")
        prs = [int(x) for x in args.prs.split(",")]
        client = GitHubClient(token=os.environ.get("GITHUB_TOKEN"), max_requests=180)
        commit, index, records = remote_snapshot(client, args.commit)
        result = consume(client, records, prs, expected_dll=args.native_dll_sha256,
                         prove_superseded=args.prove_superseded, origin=args.origin)
        result.update(evidence_commit=commit, indexed_observations=len(index["records"]),
                      consumer_source_sha=os.environ.get("GITHUB_SHA"))
        write_json(args.output, result)
        print(json.dumps(result, sort_keys=True))
        return 0 if result["status"] == "VERIFIED_CURRENT" else 3
    except (IntegrityError, GitHubError, OSError, KeyError, ValueError) as exc:
        result = {"schema": "cybersand-native-consumer-v1", "status": "UNAVAILABLE_OR_INVALID",
                  "current": False, "error": str(exc)}
        write_json(args.output, result)
        print(json.dumps(result, sort_keys=True))
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
