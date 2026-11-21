"""Strict data and archive primitives shared by the publisher and consumer.

These routines treat evidence as data. No archive member or map-supplied program
is ever executed. All budgets are deliberately small for the first milestone.
"""
from __future__ import annotations

import hashlib
import io
import json
import math
import os
from pathlib import Path, PurePosixPath
import re
import stat
import tempfile
import zipfile

SCHEMA = "cybersand-native-admission-v1"
INDEX_SCHEMA = "cybersand-native-index-v1"
PREFIX = "native-admission/v1"
REPOSITORY = "techrote/sandmapsreference"
ENGINE_REPOSITORY = "techrote/cybersand"
EVIDENCE_BRANCH = "evidence/native-admission"
MAX_JSON = 8 * 1024 * 1024
MAX_ARCHIVE = 64 * 1024 * 1024
MAX_EXPANDED = 256 * 1024 * 1024
HEX40 = re.compile(r"^[0-9a-f]{40}$")
HEX64 = re.compile(r"^[0-9a-f]{64}$")
STATUSES = {"PASS_BASIC_NATIVE", "NATIVE_PASS_PENDING_HEAD", "STALE_CONFIRMED",
            "FAIL_NATIVE", "CLOSED", "NATIVE_PASS_PENDING_EVIDENCE", "INCOMPLETE"}


class IntegrityError(ValueError):
    """Evidence cannot support the requested claim."""


def require(condition: bool, message: str) -> None:
    if not condition:
        raise IntegrityError(message)


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def canonical_bytes(value) -> bytes:
    return (json.dumps(value, sort_keys=True, ensure_ascii=True, allow_nan=False,
                       separators=(",", ":")) + "\n").encode("utf-8")


def _pairs(items):
    result = {}
    for key, value in items:
        require(key not in result, "duplicate JSON key")
        result[key] = value
    return result


def _finite(value):
    raise IntegrityError("non-finite JSON number")


def load_json(data: bytes | str, max_bytes: int = MAX_JSON):
    if isinstance(data, str):
        data = data.encode("utf-8")
    require(isinstance(data, bytes) and len(data) <= max_bytes, "JSON size budget exceeded")
    try:
        value = json.loads(data.decode("utf-8-sig"), object_pairs_hook=_pairs,
                           parse_constant=_finite)
    except (UnicodeError, json.JSONDecodeError, RecursionError, ValueError) as exc:
        raise IntegrityError("invalid strict JSON: " + str(exc)[:160]) from exc
    stack = [(value, 0)]
    nodes = 0
    while stack:
        item, depth = stack.pop()
        nodes += 1
        require(depth <= 48 and nodes <= 400000, "JSON structural budget exceeded")
        if isinstance(item, dict):
            stack.extend((v, depth + 1) for v in item.values())
        elif isinstance(item, list):
            stack.extend((v, depth + 1) for v in item)
        elif isinstance(item, float):
            require(math.isfinite(item), "non-finite JSON number")
        elif isinstance(item, str):
            require(not any(0xD800 <= ord(c) <= 0xDFFF for c in item), "invalid JSON Unicode")
    return value


def read_json(path: str | Path):
    p = Path(path)
    require(p.stat().st_size <= MAX_JSON, "JSON size budget exceeded")
    return load_json(p.read_bytes())


def write_json(path: str | Path, value) -> None:
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    data = canonical_bytes(value)
    with tempfile.NamedTemporaryFile(dir=p.parent, delete=False) as handle:
        temporary = Path(handle.name)
        handle.write(data)
    try:
        os.replace(temporary, p)
    finally:
        temporary.unlink(missing_ok=True)


def safe_path(name: str) -> str:
    require(isinstance(name, str) and 0 < len(name) <= 320, "unsafe path length/type")
    require("\\" not in name and ":" not in name and not name.startswith("/"), "unsafe path")
    require(all(32 <= ord(c) < 127 for c in name), "unsafe path character")
    parts = name.split("/")
    require(all(part not in ("", ".", "..") and part == part.rstrip(". ") for part in parts),
            "unsafe path component")
    reserved = {"CON", "PRN", "AUX", "NUL", *("COM" + str(n) for n in range(1, 10)),
                *("LPT" + str(n) for n in range(1, 10))}
    require(all(p.split(".")[0].upper() not in reserved for p in parts), "reserved Windows path")
    require(str(PurePosixPath(name)) == name, "noncanonical path")
    return name


def safe_zip(path_or_bytes, *, max_archive=MAX_ARCHIVE, max_expanded=MAX_EXPANDED,
             max_entries=2048, max_member=32 * 1024 * 1024) -> dict[str, bytes]:
    if isinstance(path_or_bytes, bytes):
        raw = path_or_bytes
    else:
        p = Path(path_or_bytes)
        require(p.stat().st_size <= max_archive, "archive size budget exceeded")
        raw = p.read_bytes()
    require(len(raw) <= max_archive, "archive size budget exceeded")
    result, seen, total = {}, set(), 0
    try:
        with zipfile.ZipFile(io.BytesIO(raw)) as archive:
            require(len(archive.infolist()) <= max_entries, "archive file-count budget exceeded")
            for info in archive.infolist():
                name = info.filename.rstrip("/") if info.is_dir() else info.filename
                safe_path(name)
                folded = name.casefold()
                require(folded not in seen, "duplicate/case-colliding archive path")
                seen.add(folded)
                mode = info.external_attr >> 16
                kind = stat.S_IFMT(mode)
                require(kind in (0, stat.S_IFREG, stat.S_IFDIR), "archive link/special file")
                require(not info.flag_bits & 1, "encrypted archive member")
                require(info.file_size <= max_member, "archive member budget exceeded")
                total += info.file_size
                require(total <= max_expanded, "archive expansion budget exceeded")
                if not info.is_dir():
                    data = archive.read(info)
                    require(len(data) == info.file_size, "archive member size mismatch")
                    result[name] = data
    except (zipfile.BadZipFile, RuntimeError, EOFError) as exc:
        raise IntegrityError("invalid archive") from exc
    return result


def record_id(record: dict) -> str:
    return sha256(canonical_bytes({k: v for k, v in record.items() if k != "record_id"}))


def identity(record: dict) -> tuple:
    m, r = record["map"], record["runtime"]
    return (m["repository"], m["pr"], m["head_sha"], m["setup_path"],
            m["setup_sha256"], r["engine_sha"], r["native_dll_sha256"])


def validate_record(record: dict, *, check_id=True, require_published=True) -> dict:
    require(isinstance(record, dict) and record.get("schema") == SCHEMA, "record schema mismatch")
    for key in ("map", "runtime", "execution", "qualification", "provenance", "evidence"):
        require(isinstance(record.get(key), dict), "missing record section: " + key)
    m, r, e, q = (record[x] for x in ("map", "runtime", "execution", "qualification"))
    require(m.get("repository") == REPOSITORY, "wrong map repository")
    require(type(m.get("pr")) is int and 0 < m["pr"] < 10000000, "invalid PR")
    require(bool(HEX40.fullmatch(str(m.get("head_sha", "")))), "invalid map HEAD")
    safe_path(m.get("setup_path"))
    require(bool(HEX64.fullmatch(str(m.get("setup_sha256", "")))), "invalid Setup digest")
    require(r.get("repository") == ENGINE_REPOSITORY, "wrong runtime repository")
    require(bool(HEX40.fullmatch(str(r.get("engine_sha", "")))), "invalid engine SHA")
    require(bool(HEX64.fullmatch(str(r.get("native_dll_sha256", "")))), "invalid DLL digest")
    require(str(r.get("godot_version", "")).startswith("4.7"), "wrong Godot version")
    require(e.get("origin") in {"owner-local-windows", "github-hosted-windows", "github-hosted-linux"},
            "unknown execution origin")
    require(isinstance(e.get("run_id"), str) and 0 < len(e["run_id"]) <= 100, "invalid run identity")
    require(q.get("basic_native") in STATUSES, "unknown basic-native status")
    for area in ("collision", "hazards", "gui"):
        require(q.get(area) == "UNTESTED", "basic-native cannot confer " + area + " acceptance")
    require(record["provenance"].get("quality") in {
        "raw-evidence-verified", "historical-reconciled", "summary-only", "unverified-report"},
        "unknown evidence quality")
    if record["provenance"].get("quality") in {"summary-only", "unverified-report"}:
        require(q["basic_native"] != "PASS_BASIC_NATIVE", "weak evidence cannot claim verified native PASS")
    evidence = record["evidence"]
    require(bool(HEX64.fullmatch(str(evidence.get("receipt_sha256", "")))), "missing receipt digest")
    if e["origin"] == "owner-local-windows":
        field = "index_sha256" if record["provenance"]["quality"] == "summary-only" else "archive_sha256"
        require(bool(HEX64.fullmatch(str(evidence.get(field, "")))), "owner evidence identity missing")
        require(e.get("evidence_id") == ("owner-index-sha256:" if field == "index_sha256" else "owner-archive-sha256:") + evidence[field], "owner evidence origin/id mismatch")
    elif e["origin"] == "github-hosted-windows":
        require(e.get("repository") == REPOSITORY and e.get("runner_environment") == "github-hosted" and
                str(e.get("runner_os", "")).lower() == "windows", "hosted execution identity mismatch")
        require(bool(HEX40.fullmatch(str(e.get("workflow_sha", "")))) and str(e.get("job_id", "")).isdigit() and
                type(e.get("attempt")) is int and e["attempt"] > 0, "hosted workflow identity incomplete")
        if require_published:
            for field in ("archive_sha256", "artifact_sha256"):
                require(bool(HEX64.fullmatch(str(evidence.get(field, "")))), "hosted artifact digest missing")
            require(type(evidence.get("artifact_id")) is int and evidence["artifact_id"] > 0 and
                    e.get("evidence_id") == str(evidence["artifact_id"]), "hosted artifact id missing")
            require(evidence.get("artifact_url") == f"https://github.com/{REPOSITORY}/actions/runs/{e['run_id']}/artifacts/{evidence['artifact_id']}", "hosted evidence URL mismatch")
    if check_id:
        require(record.get("record_id") == record_id(record), "record identity digest mismatch")
    return record
