#!/usr/bin/env python3
"""Seal an explicitly sourced GOLDMAPS kit and its exact-byte acquisition record.

The manifest is an inventory, not owner acceptance. Only known source inputs and
explicit evidence/doc outputs may enter it. Cache/profile data are never shipped.
"""
from __future__ import annotations

import argparse
import base64
import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys
import zipfile
import zlib

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
sys.path.insert(0, str(HERE.parent / "qualification"))
from verify_payload import MANIFEST, SIDECAR, MUTABLE_ROOTS, safe_path, file_sha256, verify_zip
from prepare_runtime import ENGINE, SCIENTIFIC_ENGINE


def raw_url(repo, commit, path):
    if not re.fullmatch(r"[0-9a-f]{40}", str(commit)):
        raise ValueError("Unpinned source origin")
    safe_path(path)
    return "https://raw.githubusercontent.com/" + repo + "/" + commit + "/" + path


def product_source(relative):
    if relative.startswith("browser/"):
        name = relative.removeprefix("browser/")
        if "/" not in name:
            return "tools/goldmaps_owner/product/" + (name if name == "package_io.gd" else "browser/" + name)
    if relative.startswith("runtime/project/goldmaps/"):
        name = relative.removeprefix("runtime/project/goldmaps/")
        if "/" not in name:
            return "tools/goldmaps_owner/product/" + (name if name == "package_io.gd" else "session/" + name)
    return None


def source_indexes(root):
    result = {}
    for name in ("runtime/source-provenance.v1.json", "collection/collection-files.v1.json"):
        path = root / name
        if not path.is_file():
            raise ValueError("Source inventory missing: " + name)
        data = json.loads(path.read_text())
        if name.startswith("runtime/") and data["engine_head"] != ENGINE:
            raise ValueError("Staged engine differs from selected accepted source")
        for row in data["files"]:
            path = safe_path(row["path"])
            if path in result:
                raise ValueError("Source inventories overlap: " + path)
            result[path] = row
    return result


def acquisition_origin(row, path):
    origin = row["origin"]
    if origin.get("kind") in ("url", "zip_member"):
        return origin
    if all(origin.get(k) for k in ("repo", "commit", "path")):
        return {"kind": "url", "url": raw_url(origin["repo"], origin["commit"], origin["path"])}
    # Small generated metadata/evidence is preserved as exact bytes, not
    # reconstructed from a later run with new timestamps or new judgments.
    raw = path.read_bytes()
    if len(raw) > 16 * 1024 * 1024:
        raise ValueError("Generated artifact needs a separately pinned blob origin: " + str(path))
    return {"kind": "inline_zlib_base64", "data": base64.b64encode(zlib.compress(raw, 9)).decode("ascii")}


def seal(root, source_head, receipt_path=None, archive=None):
    if not re.fullmatch(r"[0-9a-f]{40}", source_head):
        raise ValueError("Exact delivery source commit is required")
    try:
        resolved = subprocess.check_output(["git", "-C", str(ROOT), "rev-parse", source_head + "^{commit}"], text=True).strip()
    except subprocess.CalledProcessError as error:
        raise ValueError("Delivery source commit is not available for byte verification") from error
    if resolved != source_head:
        raise ValueError("Delivery authority must be an exact commit")
    verified_sources = {}
    def committed_source(relative):
        if relative not in verified_sources:
            safe_path(relative)
            try:
                committed = subprocess.check_output(["git", "-C", str(ROOT), "show", source_head + ":" + relative], stderr=subprocess.DEVNULL)
            except subprocess.CalledProcessError as error:
                raise ValueError("Delivery authority lacks source: " + relative) from error
            if not (ROOT / relative).is_file() or (ROOT / relative).read_bytes() != committed:
                raise ValueError("Working source differs from the supplied delivery commit: " + relative)
            verified_sources[relative] = committed
        return verified_sources[relative]
    for relative in ("tools/goldmaps_owner/integration/seal_payload.py", "tools/goldmaps_owner/integration/stage_engine.py",
                     "tools/goldmaps_owner/integration/prepare_runtime.py", "tools/goldmaps_owner/product/assemble_product.py",
                     "tools/goldmaps_owner/corpus/build_collection.py"):
        committed_source(relative)
    known = source_indexes(root)
    generated = {
        "runtime/source-provenance.v1.json": "tools/goldmaps_owner/integration/stage_engine.py",
        "product-provenance.v1.json": "tools/goldmaps_owner/product/assemble_product.py",
        "collection/collection-files.v1.json": "tools/goldmaps_owner/corpus/build_collection.py",
        "collection/delivery-qualification.v1.json": "tools/goldmaps_owner/qualification/run_native_collection.py",
        "Open GOLDMAPS.cmd": "tools/goldmaps_owner/product/assemble_product.py",
        "Open GOLDMAPS.sh": "tools/goldmaps_owner/product/assemble_product.py",
    }
    docs = {"START-HERE.md": "tools/goldmaps_owner/integration/START-HERE.md",
            "LICENSE-AND-SOURCE.md": "tools/goldmaps_owner/integration/LICENSE-AND-SOURCE.md"}
    rows = []
    for path in sorted(root.rglob("*")):
        rel = safe_path(path.relative_to(root).as_posix())
        if path.is_symlink():
            raise ValueError("Symlink in staging payload")
        if not path.is_file() or rel in (MANIFEST, SIDECAR) or rel.startswith(MUTABLE_ROOTS):
            continue
        digest, size = file_sha256(path), path.stat().st_size
        if rel in known:
            prior = known[rel]
            if (digest, size) != (prior["sha256"], prior["bytes"]):
                raise ValueError("Staged file differs from its source custody: " + rel)
            origin = dict(prior["origin"])
            if origin.get("generator"):
                generator = origin["generator"]
                origin["delivery_source_commit"] = source_head
                origin["generator_sha256"] = hashlib.sha256(committed_source(generator)).hexdigest()
        elif (source := product_source(rel)) and (ROOT / source).is_file():
            if committed_source(source) != path.read_bytes():
                raise ValueError("Product overlay differs from reviewed source: " + rel)
            origin = {"kind": "url", "url": raw_url("techrote/sandmapsreference", source_head, source),
                      "role": "additive product source"}
        elif rel in docs:
            source = docs[rel]
            if committed_source(source) != path.read_bytes():
                raise ValueError("Owner instructions differ from source")
            origin = {"kind": "url", "url": raw_url("techrote/sandmapsreference", source_head, source)}
        elif rel in generated:
            generator = generated[rel]
            origin = {"kind": "delivery_generated", "source_commit": source_head, "generator": generator,
                      "generator_sha256": hashlib.sha256(committed_source(generator)).hexdigest()}
        elif rel.startswith("qualification/") and path.suffix in (".json", ".log", ".png", ".md"):
            origin = {"kind": "actual_delivery_evidence", "source_commit": source_head,
                      "scope": "Read individual receipt platform/source/limitations; no owner acceptance"}
        else:
            raise ValueError("Unexpected file has no approved input or output role: " + rel)
        rows.append({"path": rel, "bytes": size, "sha256": digest, "origin": origin})
    required = {"Open GOLDMAPS.cmd", "browser/project.godot", "runtime/project/project.godot",
                "runtime/bootstrap/global_script_class_cache.cfg", "collection/collection.v1.json",
                "collection/native-inputs.v1.json", "Godot_v4.7-stable_win64.exe"}
    if not required <= {row["path"] for row in rows}:
        raise ValueError("Required owner product files are absent")
    manifest = {"schema": "goldmaps.owner-payload.v1", "engine_head": ENGINE,
                "scientific_engine_head": SCIENTIFIC_ENGINE, "delivery_source_head": source_head,
                "mutable_roots": list(MUTABLE_ROOTS), "files": rows, "owner_accepted": False,
                "counts": {"immutable_payload_files": len(rows), "immutable_payload_bytes": sum(row["bytes"] for row in rows)},
                "scope": "Exact payload custody; execution and owner acceptance remain separate receipt fields."}
    encoded = (json.dumps(manifest, indent=2, ensure_ascii=False) + "\n").encode()
    (root / MANIFEST).write_bytes(encoded)
    (root / SIDECAR).write_text(hashlib.sha256(encoded).hexdigest() + "  " + MANIFEST + "\n", encoding="ascii")
    if receipt_path:
        acquisition = []
        for row in rows:
            acquisition.append({"path": row["path"], "bytes": row["bytes"], "sha256": row["sha256"],
                                "origin": acquisition_origin(row, root / row["path"])})
        for name in (MANIFEST, SIDECAR):
            path = root / name
            row = {"path": name, "bytes": path.stat().st_size, "sha256": file_sha256(path), "origin": {"kind": "generated_manifest"}}
            row["origin"] = acquisition_origin(row, path)
            acquisition.append(row)
        reconstruction = {"schema": "goldmaps.owner-acquisition.v1", "delivery_source_head": source_head,
                          "engine_head": ENGINE, "files": acquisition, "payload_manifest_sha256": hashlib.sha256(encoded).hexdigest(),
                          "identity_claim": "Reconstruct exact qualified file bytes, including original evidence; compressed ZIP identity is separately recorded."}
        receipt_path.parent.mkdir(parents=True, exist_ok=True)
        receipt_path.write_text(json.dumps(reconstruction, indent=2) + "\n", encoding="utf-8")
    result = {"payload_manifest_sha256": hashlib.sha256(encoded).hexdigest(), **manifest["counts"]}
    if archive:
        archive.parent.mkdir(parents=True, exist_ok=True)
        if archive.exists():
            raise ValueError("Refuse to overwrite final archive")
        with zipfile.ZipFile(archive, "x", zipfile.ZIP_DEFLATED, compresslevel=6) as z:
            for name in sorted([row["path"] for row in rows] + [MANIFEST, SIDECAR]):
                info = zipfile.ZipInfo(name, date_time=(2026, 11, 24, 0, 0, 0))
                info.compress_type = zipfile.ZIP_DEFLATED
                info.external_attr = (0o100755 if name.endswith(".sh") else 0o100644) << 16
                z.writestr(info, (root / name).read_bytes(), compresslevel=6)
        result["archive"] = verify_zip(archive, hashlib.sha256(encoded).hexdigest())
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--package", type=Path, required=True)
    parser.add_argument("--source-head", required=True)
    parser.add_argument("--acquisition-manifest", type=Path)
    parser.add_argument("--archive", type=Path)
    args = parser.parse_args()
    print(json.dumps(seal(args.package.resolve(), args.source_head, args.acquisition_manifest, args.archive), indent=2))


if __name__ == "__main__":
    main()
