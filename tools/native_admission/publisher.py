"""Narrow publisher: validate completed Actions evidence; write one evidence ref.

No artifact member is executed. The only writable ref is hard-coded, and its
complete tree is constrained to native-admission/v1. A fast-forward Git ref
update is the commit point; competing publishers reload and merge, never force.
"""
from __future__ import annotations

import argparse
import base64
import json
import os
from pathlib import Path
import urllib.error
import urllib.request

from . import catalog
from .common import (EVIDENCE_BRANCH, PREFIX, REPOSITORY, IntegrityError,
                     canonical_bytes, load_json, record_id, require, safe_path, safe_zip, sha256, validate_record)
from .evidence import verify_archive
from .github import GitHubClient, GitHubError


class WriteError(RuntimeError):
    def __init__(self, status: int):
        self.status = status
        super().__init__("GitHub publication request failed (HTTP %d)" % status)


class Writer:
    """Authenticated Git data writes; callers cannot choose another repository."""
    def __init__(self, client=None, token=None):
        self.token = token if token is not None else os.environ.get("GITHUB_TOKEN", "")
        require(bool(self.token), "publisher token missing")
        self.reader = client or GitHubClient(token=self.token, max_requests=160)
        self.writes = 0

    def get(self, path):
        return self.reader.get_json("/repos/" + REPOSITORY + path)

    def write(self, method, path, value):
        require(method in ("POST", "PATCH"), "unsupported publication method")
        require(path in ("/git/blobs", "/git/trees", "/git/commits", "/git/refs",
                         "/git/refs/heads/" + EVIDENCE_BRANCH), "publisher write path forbidden")
        if path == "/git/refs":
            require(value.get("ref") == "refs/heads/" + EVIDENCE_BRANCH, "publisher ref forbidden")
        if method == "PATCH":
            require(value.get("force") is False, "force publication forbidden")
        self.writes += 1
        require(self.writes <= 200, "publisher API write budget exhausted")
        request = urllib.request.Request("https://api.github.com/repos/" + REPOSITORY + path,
            data=canonical_bytes(value), method=method,
            headers={"Authorization": "Bearer " + self.token, "Accept": "application/vnd.github+json",
                     "Content-Type": "application/json", "User-Agent": "CyberSand-Native-Evidence-v1",
                     "X-GitHub-Api-Version": "2022-11-28"})
        class NoRedirect(urllib.request.HTTPRedirectHandler):
            def redirect_request(self, *args, **kwargs):
                return None
        try:
            with urllib.request.build_opener(NoRedirect).open(request, timeout=20) as response:
                data = response.read(8 * 1024 * 1024 + 1)
            return load_json(data)
        except urllib.error.HTTPError as exc:
            raise WriteError(exc.code) from None
        except (urllib.error.URLError, TimeoutError):
            raise WriteError(0) from None

    def read_file(self, path, commit):
        require(path.startswith(PREFIX + "/"), "publication read path forbidden")
        return self.reader.get_bytes("https://raw.githubusercontent.com/" + REPOSITORY + "/" + commit + "/" + path)


def publish(writer, run: dict, records: list[dict], *, extra_files=None) -> dict:
    for retry in range(4):
        ref_exists = True
        try:
            head = writer.get("/git/ref/heads/" + EVIDENCE_BRANCH)["object"]["sha"]
        except GitHubError as exc:
            if exc.status != 404:
                raise
            ref_exists = False
            head = writer.get("/commits/main")["sha"]
        commit = writer.get("/git/commits/" + head)
        tree_sha = commit["tree"]["sha"]
        if ref_exists:
            tree = writer.get("/git/trees/" + tree_sha + "?recursive=1")
            require(tree.get("truncated") is False, "evidence tree truncated")
            require(all(e["path"] == "native-admission" or e["path"] == PREFIX or
                        e["path"].startswith(PREFIX + "/") for e in tree["tree"]),
                    "evidence branch contains unexpected paths")
            index_raw = writer.read_file(PREFIX + "/latest.json", head)
            checksum = writer.read_file(PREFIX + "/latest.sha256", head).decode("ascii").strip().split()
            require(checksum == [sha256(index_raw), "latest.json"], "existing index checksum mismatch")
            index = catalog.validate_index(load_json(index_raw))
        else:
            index = catalog.empty_index()
        prior = next((r for r in index["runs"] if r["run_key"] == run["run_key"]), None)
        if prior:
            raw = writer.read_file(prior["path"], head)
            require(sha256(raw) == prior["sha256"], "existing run checksum mismatch")
            old = load_json(raw)
            # HEAD verification is an observation at first publication. A retry
            # may see a newer HEAD/time; it must retain the immutable first record.
            for field in ("run_key", "origin", "run_id", "attempt", "archive_sha256", "artifact", "workflow_sha", "manifest_sha256"):
                require(old.get(field) == run.get(field), "immutable publication source contradiction")
            return {"status": "ALREADY_PUBLISHED", "commit": head, "run_key": run["run_key"],
                    "records": len(old["record_ids"]), "archive_sha256": run["archive_sha256"]}
        updated, changed, did_change = catalog.merge(index, run, records)
        if not did_change:
            return {"status": "ALREADY_PUBLISHED", "commit": head, "run_key": run["run_key"], "records": len(records)}
        if extra_files:
            for name, data in extra_files.items():
                safe_path(name)
                require(name.startswith(PREFIX + "/schemas/") or name == PREFIX + "/README.md", "extra evidence path forbidden")
                changed[name] = data
        tree_entries = []
        for path, data in sorted(changed.items()):
            safe_path(path)
            require(path.startswith(PREFIX + "/"), "publisher escaped evidence prefix")
            blob = writer.write("POST", "/git/blobs", {"content": base64.b64encode(data).decode("ascii"), "encoding": "base64"})
            tree_entries.append({"path": path, "mode": "100644", "type": "blob", "sha": blob["sha"]})
        tree_request = {"tree": tree_entries}
        if ref_exists:
            tree_request["base_tree"] = tree_sha
        new_tree = writer.write("POST", "/git/trees", tree_request)
        new_commit = writer.write("POST", "/git/commits", {
            "message": "Record immutable native evidence " + run["run_key"],
            "tree": new_tree["sha"], "parents": [head]})
        try:
            if ref_exists:
                writer.write("PATCH", "/git/refs/heads/" + EVIDENCE_BRANCH, {"sha": new_commit["sha"], "force": False})
            else:
                writer.write("POST", "/git/refs", {"ref": "refs/heads/" + EVIDENCE_BRANCH, "sha": new_commit["sha"]})
        except WriteError as exc:
            if exc.status not in (409, 422):
                raise
            continue
        # Read exactly the created commit, not the mutable ref, and verify published bytes.
        require(writer.read_file(PREFIX + "/latest.json", new_commit["sha"]) == canonical_bytes(updated),
                "published index readback mismatch")
        for path, data in changed.items():
            if path.endswith(".json") and "/records/" in path:
                require(writer.read_file(path, new_commit["sha"]) == data, "published record readback mismatch")
        return {"status": "PUBLISHED", "commit": new_commit["sha"], "run_key": run["run_key"],
                "records": len(records), "retries": retry, "archive_sha256": run["archive_sha256"]}
    raise IntegrityError("publication contention budget exhausted; no forced ref update")


def verified_actions_bundle(client, artifact_id: int, run_id: str, attempt: int, workflow_sha: str):
    require(str(run_id).isdigit() and type(attempt) is int and attempt > 0, "invalid Actions run identity")
    base = "/repos/" + REPOSITORY
    api_run = client.get_json(base + "/actions/runs/" + run_id + "/attempts/" + str(attempt))
    require(str(api_run.get("id")) == run_id and api_run.get("run_attempt") == attempt, "wrong workflow attempt")
    require(api_run.get("head_sha") == workflow_sha, "workflow source mismatch")
    require(api_run.get("path") == ".github/workflows/native-admission-windows.yml", "wrong producer workflow")
    require(api_run.get("event") in ("push", "workflow_dispatch"), "unexpected qualification trigger")
    artifact = client.get_json(base + "/actions/artifacts/" + str(artifact_id))
    require(artifact.get("id") == artifact_id and artifact.get("expired") is False, "artifact absent/expired")
    require(artifact.get("name") == f"native-evidence-{run_id}-{attempt}", "wrong evidence artifact")
    require(str(artifact.get("workflow_run", {}).get("id")) == run_id and
            artifact.get("workflow_run", {}).get("head_sha") == workflow_sha, "artifact source mismatch")
    wrapper = client.get_bytes("https://api.github.com" + base + "/actions/artifacts/" + str(artifact_id) + "/zip",
                               max_bytes=64 * 1024 * 1024)
    require(artifact.get("digest") == "sha256:" + sha256(wrapper), "Actions artifact digest mismatch")
    outer = safe_zip(wrapper)
    require(set(outer) == {"native-evidence.zip"}, "unexpected Actions artifact wrapper")
    archive = outer["native-evidence.zip"]
    artifact_info = {"artifact_id": artifact_id, "artifact_sha256": sha256(wrapper),
                     "archive_sha256": sha256(archive),
                     "artifact_url": f"https://github.com/{REPOSITORY}/actions/runs/{run_id}/artifacts/{artifact_id}",
                     "run_url": f"https://github.com/{REPOSITORY}/actions/runs/{run_id}",
                     "artifact_retention": "Actions artifact may expire; immutable metadata remains"}
    files, run, records = verify_archive(archive, artifact_info)
    e = run["execution"]
    require(str(e.get("run_id")) == run_id and e.get("attempt") == attempt, "embedded workflow attempt mismatch")
    require(e.get("workflow_sha") == workflow_sha, "embedded workflow source mismatch")
    jobs = client.get_json(base + "/actions/runs/" + run_id + "/attempts/" + str(attempt) + "/jobs?per_page=100")
    require(jobs.get("total_count", 0) <= 100, "job inventory truncated")
    matching = [j for j in jobs.get("jobs", []) if str(j.get("id")) == str(e.get("job_id"))]
    require(len(matching) == 1, "qualification job missing")
    job = matching[0]
    require(job.get("name") == "Windows native qualification" and job.get("status") == "completed", "qualification job incomplete")
    require("windows-2022" in job.get("labels", []) and "self-hosted" not in job.get("labels", []), "unapproved runner")
    require(job.get("conclusion") in ("success", "failure"), "cancelled qualification cannot publish")
    # Verify source artifact provenance independently of the unprivileged runner's claims.
    runtime = run["runtime"]
    provenance = runtime.get("provenance", {})
    upstream_id = provenance.get("artifact_id")
    require(str(upstream_id).isdigit(), "native source artifact identity missing")
    upstream = client.get_json("/repos/techrote/cybersand/actions/artifacts/" + str(upstream_id))
    require(upstream.get("workflow_run", {}).get("head_sha") == runtime["engine_sha"], "native artifact engine mismatch")
    require(str(upstream.get("workflow_run", {}).get("id")) == str(provenance.get("runtime_run_id")) and
            upstream.get("name") == f"native-candidate-windows-{provenance.get('runtime_run_id')}-{provenance.get('runtime_attempt')}",
            "native artifact run/attempt mismatch")
    require(upstream.get("digest") == "sha256:" + provenance.get("artifact_sha256", ""), "native artifact archive mismatch")
    source_run = client.get_json("/repos/techrote/cybersand/actions/runs/" + str(provenance.get("runtime_run_id")))
    require(source_run.get("head_sha") == runtime["engine_sha"] and source_run.get("conclusion") == "success" and
            source_run.get("path") == ".github/workflows/gdextension.yml" and source_run.get("run_attempt") == provenance.get("runtime_attempt"),
            "source runtime workflow mismatch")
    # Official GitHub metadata is the trust anchor even if a public mirror is
    # needed to transport a cross-repository artifact. Never execute its files.
    try:
        source_archive = client.get_bytes("https://api.github.com/repos/techrote/cybersand/actions/artifacts/" + str(upstream_id) + "/zip", max_bytes=32 * 1024 * 1024)
    except GitHubError:
        source_archive = client.get_bytes("https://nightly.link/techrote/cybersand/actions/artifacts/" + str(upstream_id) + ".zip", max_bytes=32 * 1024 * 1024)
    require("sha256:" + sha256(source_archive) == upstream["digest"], "authoritative runtime archive digest mismatch")
    source_files = safe_zip(source_archive)
    require("candidate-provenance.json" in source_files and "cybersand_native.windows.x86_64.dll" in source_files, "authoritative runtime members missing")
    require(source_files["candidate-provenance.json"] == files["candidate-provenance.json"], "authoritative candidate manifest mismatch")
    require(sha256(source_files["cybersand_native.windows.x86_64.dll"]) == runtime["native_dll_sha256"], "authoritative native DLL mismatch")
    # Bind each map to its independently fetched immutable file and record
    # publication-time freshness separately from the original execution receipt.
    for record in records:
        m = record["map"]
        blob = client.fetch_blob(REPOSITORY, m["setup_blob_sha"], max_bytes=1024 * 1024)
        require(sha256(blob) == m["setup_sha256"] and len(blob) == m["setup_bytes"], "authoritative Setup blob mismatch")
        from urllib.parse import quote
        content = client.get_json(f"/repos/{REPOSITORY}/contents/{quote(m['setup_path'], safe='/')}?ref={m['head_sha']}")
        require(content.get("type") == "file" and content.get("sha") == m["setup_blob_sha"] and content.get("path") == m["setup_path"], "Setup path/commit binding mismatch")
        live = client.verify_pr(REPOSITORY, m["pr"], m["head_sha"])
        record["publication_head_verification"] = live
        record["provenance"]["qualification_at_execution"] = record["qualification"]["basic_native"]
        if record["provenance"]["native_status"] == "PASS_BASIC_NATIVE":
            record["qualification"]["basic_native"] = {"VERIFIED_CURRENT": "PASS_BASIC_NATIVE", "STALE_CONFIRMED": "STALE_CONFIRMED", "CLOSED": "CLOSED"}.get(live.get("state"), "NATIVE_PASS_PENDING_HEAD")
        record["record_id"] = record_id(record)
        validate_record(record)
    run_key = f"github-windows-{run_id}-{attempt}-{sha256(archive)[:16]}"
    publication = {"schema": "cybersand-native-publication-v1", "run_key": run_key,
                   "origin": "github-hosted-windows", "run_id": run_id, "attempt": attempt,
                   "archive_sha256": sha256(archive), "artifact": artifact_info,
                   "workflow_sha": workflow_sha, "record_ids": [r["record_id"] for r in records],
                   "manifest_sha256": sha256(files["manifest.json"]), "validation": "VERIFIED"}
    return publication, records


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--artifact-id", type=int, required=True)
    parser.add_argument("--run-id", required=True)
    parser.add_argument("--attempt", type=int, required=True)
    parser.add_argument("--workflow-sha", required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    from .common import write_json
    try:
        client = GitHubClient(token=os.environ.get("GITHUB_TOKEN"), max_requests=180)
        run, records = verified_actions_bundle(client, args.artifact_id, args.run_id, args.attempt, args.workflow_sha)
        schema_path = Path(__file__).with_name("qualification.schema.json")
        extras = {PREFIX + "/schemas/qualification.schema.json": schema_path.read_bytes(),
                  PREFIX + "/README.md": b"# Native admission evidence\n\nImmutable source-bound records. Basic native PASS confers no Art, Shepherd, GUI, collision, hazards or performance acceptance. Read latest.json together with latest.sha256 at one immutable commit.\n"}
        result = publish(Writer(client=client), run, records, extra_files=extras)
        write_json(args.output, result)
        print(json.dumps(result, sort_keys=True))
    except (IntegrityError, GitHubError, WriteError, OSError) as exc:
        write_json(args.output, {"status": "REJECTED", "error": str(exc)})
        print(json.dumps({"status": "REJECTED", "error": str(exc)}))
        raise SystemExit(2)


if __name__ == "__main__":
    main()
