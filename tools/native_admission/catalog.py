"""Immutable evidence catalog assembly, shared with the offline consumer."""
from __future__ import annotations

from .common import (INDEX_SCHEMA, PREFIX, IntegrityError, canonical_bytes,
                     load_json, require, safe_path, sha256, validate_record)


def empty_index() -> dict:
    return {"schema": INDEX_SCHEMA, "records": [], "runs": [], "inventories": []}


def validate_index(index: dict) -> dict:
    require(isinstance(index, dict) and index.get("schema") == INDEX_SCHEMA, "index schema mismatch")
    require(isinstance(index.get("records"), list) and len(index["records"]) <= 10000, "invalid index records")
    require(isinstance(index.get("runs"), list) and len(index["runs"]) <= 10000, "invalid index runs")
    seen = set()
    for entry in index["records"]:
        require(isinstance(entry, dict), "invalid index entry")
        rid = entry.get("record_id", "")
        require(isinstance(rid, str) and len(rid) == 64 and all(c in "0123456789abcdef" for c in rid), "bad record id")
        require(rid not in seen, "duplicate index record")
        seen.add(rid)
        require(entry.get("path") == f"{PREFIX}/records/{rid}.json", "index record path mismatch")
        digest = entry.get("sha256", "")
        require(isinstance(digest, str) and len(digest) == 64 and all(c in "0123456789abcdef" for c in digest), "bad record digest")
    run_seen = set()
    for entry in index["runs"]:
        key = entry.get("run_key", "")
        require(key and key not in run_seen, "duplicate/missing run key")
        run_seen.add(key)
        require(entry.get("path") == f"{PREFIX}/runs/{key}.json", "index run path mismatch")
        safe_path(entry["path"])
    require(all(entry.get("run_key") in run_seen for entry in index["records"]), "orphan record without indexed run")
    return index


def validate_publication(run: dict, records: list[dict]) -> None:
    require(isinstance(run, dict) and isinstance(run.get("run_key"), str), "missing run key")
    ids = [record.get("record_id") for record in records]
    require(len(ids) == len(set(ids)) and isinstance(run.get("record_ids"), list) and
            len(run["record_ids"]) == len(set(run["record_ids"])) and set(run["record_ids"]) == set(ids),
            "publication record inventory mismatch")
    for record in records:
        validate_record(record)
        require(record["execution"]["origin"] == run.get("origin") and record["execution"]["run_id"] == run.get("run_id") and
                record["evidence"].get("archive_sha256", record["evidence"].get("index_sha256")) == run.get("archive_sha256"),
                "publication record/run provenance contradiction")
        if run["origin"].startswith("github-hosted"):
            e = record["execution"]
            require(e.get("workflow_sha") == run.get("workflow_sha") and e.get("attempt") == run.get("attempt") and
                    e.get("implementation_sha", e.get("workflow_sha")) == run.get("implementation_sha", run.get("workflow_sha")),
                    "publication implementation source contradiction")


def merge(index: dict, run: dict, records: list[dict]) -> tuple[dict, dict[str, bytes], bool]:
    """Return an atomic change set; never remove or replace existing observations."""
    validate_index(index)
    validate_publication(run, records)
    key = run["run_key"]
    require(1 <= len(key) <= 180 and all(c.isalnum() or c in "-." for c in key), "unsafe run key")
    run_path = f"{PREFIX}/runs/{key}.json"
    run_bytes = canonical_bytes(run)
    old_runs = {r["run_key"]: r for r in index["runs"]}
    if key in old_runs:
        require(old_runs[key]["sha256"] == sha256(run_bytes), "immutable run contradiction")
        return index, {}, False
    # A repeated Actions attempt cannot become a different artifact after publication.
    for previous in old_runs.values():
        if (previous.get("origin"), previous.get("run_id"), previous.get("attempt")) == (
                run.get("origin"), run.get("run_id"), run.get("attempt")):
            if run.get("origin", "").startswith("github-hosted"):
                raise IntegrityError("workflow attempt already published with another archive")
    changed = {run_path: run_bytes}
    entries = {r["record_id"]: r for r in index["records"]}
    for record in records:
        validate_record(record)
        rid = record["record_id"]
        data = canonical_bytes(record)
        path = f"{PREFIX}/records/{rid}.json"
        entry = {"record_id": rid, "path": path, "sha256": sha256(data),
                 "map": record["map"], "runtime": record["runtime"],
                 "execution": record["execution"], "qualification": record["qualification"],
                 "quality": record["provenance"]["quality"], "run_key": key}
        if rid in entries:
            require(entries[rid]["sha256"] == entry["sha256"], "immutable record contradiction")
        else:
            entries[rid] = entry
            changed[path] = data
    old_runs[key] = {"run_key": key, "path": run_path, "sha256": sha256(run_bytes),
                     "origin": run["origin"], "run_id": run["run_id"],
                     "attempt": run.get("attempt", 1), "archive_sha256": run["archive_sha256"]}
    updated = {"schema": INDEX_SCHEMA, "records": sorted(entries.values(), key=lambda x: x["record_id"]),
               "runs": sorted(old_runs.values(), key=lambda x: x["run_key"]),
               "inventories": index.get("inventories", [])}
    index_bytes = canonical_bytes(updated)
    changed[f"{PREFIX}/latest.json"] = index_bytes
    changed[f"{PREFIX}/latest.sha256"] = (sha256(index_bytes) + "  latest.json\n").encode("ascii")
    return updated, changed, True


def read_snapshot(fetch) -> tuple[dict, list[dict]]:
    """fetch(path) must read every object from ONE immutable evidence commit."""
    index_bytes = fetch(f"{PREFIX}/latest.json")
    checksum = fetch(f"{PREFIX}/latest.sha256").decode("ascii").strip().split()
    require(checksum == [sha256(index_bytes), "latest.json"], "index checksum mismatch")
    index = validate_index(load_json(index_bytes))
    records = []
    for entry in index["records"]:
        raw = fetch(entry["path"])
        require(sha256(raw) == entry["sha256"], "published record digest mismatch")
        record = validate_record(load_json(raw))
        require(record["record_id"] == entry["record_id"], "published record id mismatch")
        for key in ("map", "runtime", "execution", "qualification"):
            require(record[key] == entry[key], "index/record identity contradiction")
        records.append(record)
    for entry in index["runs"]:
        raw = fetch(entry["path"])
        require(sha256(raw) == entry["sha256"], "published run digest mismatch")
        run = load_json(raw)
        require(run.get("run_key") == entry["run_key"], "published run identity mismatch")
        record_ids = run.get("record_ids", [])
        require(isinstance(record_ids, list) and len(record_ids) == len(set(record_ids)), "invalid run record inventory")
        require(set(record_ids) == {x["record_id"] for x in index["records"] if x["run_key"] == entry["run_key"]},
                "run record inventory contradiction")
        validate_publication(run, [r for r in records if r["record_id"] in record_ids])
        for record in records:
            if record["record_id"] in record_ids:
                require(record["execution"]["origin"] == run.get("origin") and record["execution"]["run_id"] == run.get("run_id") and
                        record["evidence"].get("archive_sha256", record["evidence"].get("index_sha256")) == run.get("archive_sha256"),
                        "record/run provenance contradiction")
    return index, records


def query(records: list[dict], *, pr: int, head_sha: str, setup_path: str,
          setup_sha256: str, engine_sha: str, native_dll_sha256: str,
          current_head: dict | None = None, current_engine_sha: str | None = None) -> dict:
    """Exact-key lookup. Historical successes never silently satisfy a new key."""
    require(type(pr) is int, "invalid query PR")
    related = [r for r in records if r["map"]["pr"] == pr and r["map"]["setup_path"] == setup_path]
    source = [r for r in related if r["map"]["head_sha"] == head_sha and r["map"]["setup_sha256"] == setup_sha256]
    exact = [r for r in source if r["runtime"]["engine_sha"] == engine_sha and r["runtime"]["native_dll_sha256"] == native_dll_sha256]
    result = {"schema": "cybersand-native-query-v1", "status": "MISSING", "current": False,
              "query": {"pr": pr, "head_sha": head_sha, "setup_path": setup_path,
                        "setup_sha256": setup_sha256, "engine_sha": engine_sha,
                        "native_dll_sha256": native_dll_sha256},
              "record_ids": [r["record_id"] for r in exact],
              "native_acceptance_only": True,
              "art": "UNTESTED", "shepherd": "UNTESTED", "collision": "UNTESTED",
              "hazards": "UNTESTED", "gui": "UNTESTED"}
    if exact:
        passes = [r for r in exact if r["qualification"]["basic_native"] == "PASS_BASIC_NATIVE"]
        statuses = {r["qualification"]["basic_native"] for r in exact}
        # Preserve a pass AND contradictory failure. Never resolve a conflict by recency.
        if passes and "FAIL_NATIVE" in statuses:
            result["status"] = "CONFLICT"
        elif passes:
            result["status"] = "PASS_BASIC_NATIVE"
        elif "NATIVE_PASS_PENDING_HEAD" in statuses:
            result["status"] = "NATIVE_PASS_PENDING_HEAD"
        elif "FAIL_NATIVE" in statuses:
            result["status"] = "FAIL_NATIVE"
        else:
            result["status"] = sorted(statuses)[0]
        result["origins"] = sorted({r["execution"]["origin"] for r in exact})
        result["evidence"] = [r.get("evidence", {}) for r in exact]
    elif source:
        result["status"] = "RUNTIME_MISMATCH"
    elif related:
        result["status"] = "SUPERSEDED" if all(r["map"]["head_sha"] != head_sha for r in related) else "SETUP_MISMATCH"
    if current_engine_sha is not None and current_engine_sha != engine_sha:
        result["status"] = "ENGINE_SUPERSEDED"
    if current_head is not None:
        state = current_head.get("state")
        result["head_verification"] = current_head
        if state == "UNVERIFIED":
            if result["status"] == "PASS_BASIC_NATIVE":
                result["status"] = "NATIVE_PASS_PENDING_HEAD"
        elif state in ("STALE_CONFIRMED", "CLOSED"):
            result["status"] = "SUPERSEDED" if state == "STALE_CONFIRMED" else "CLOSED"
        elif state == "VERIFIED_CURRENT":
            require(current_head.get("expected_head_sha") == head_sha and current_head.get("observed_head_sha") == head_sha and
                    current_head.get("pr_state") == "open", "contradictory live HEAD verification")
            result["current"] = result["status"] == "PASS_BASIC_NATIVE" and current_engine_sha == engine_sha
        else:
            raise IntegrityError("unknown live HEAD verification")
    return result
