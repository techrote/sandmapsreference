#!/usr/bin/env python3
"""Preserve actual Linux receipts and negatives in a deterministic evidence ZIP.

This archive is qualification evidence, not the playable owner evaluator. Every
original log/receipt is included byte-for-byte with an internal SHA-256 inventory.
No runtime executable, private owner data, or new classification is included.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import zipfile


def sha(data):
    return hashlib.sha256(data).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--qa", type=Path, required=True)
    parser.add_argument("--package", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    qa, package, out = args.qa.resolve(), args.package.resolve(), args.out.resolve()
    if out.exists():
        raise ValueError("refuse to replace a checkpoint")
    required = json.loads((qa / "required44-linux-serial/summary.json").read_text())
    product = json.loads((qa / "product-linux-final-preflight/summary.json").read_text())
    if not required["validation_pass"] or (required["aliases_checked"], required["unique_setups_checked"],
                                          required["qualified_unique_setups"], required["verified_refused_unique_setups"]) != (53, 44, 42, 2):
        raise ValueError("required Linux campaign is not the complete recorded checkpoint")
    if not product["pass"] or len(product["checks"]) != 26 or not all(row["pass"] for row in product["checks"]):
        raise ValueError("product checkpoint is incomplete")
    if sha((package / "payload-manifest.v1.json").read_bytes()) != product["package_after"]["manifest_sha256"]:
        raise ValueError("product source inventory moved before checkpoint capture")
    files, origins = {}, {}

    def add(name, path, origin):
        if name in files or path.is_symlink() or not path.is_file():
            raise ValueError("invalid or duplicate evidence input: " + name)
        files[name] = path.read_bytes()
        origins[name] = origin

    directories = ("required44-linux", "required44-linux-serial", "linux-optional", "early-native-smoke",
                   "product-linux-final-preflight", "browser-contract-linux", "browser-contract-linux-continuation",
                   "browser-startup-diagnostic", "runtime-boundary-linux")
    for directory in directories:
        source = qa / directory
        if not source.is_dir():
            raise ValueError("known evidence directory missing: " + directory)
        for path in sorted(source.iterdir()):
            if path.is_file() and path.suffix in (".json", ".log", ".png", ".md", ".sha256"):
                add(directory + "/" + path.name, path, "actual Linux qualification output, unchanged bytes")
    for name in ("collection-independent-final.v1.json", "collection-independent-product-freeze.v1.json",
                 "policy-independent-review.v1.json", "material-preview-review.v1.json", "independent-ci-policy.json",
                 "acquisition-contracts.log", "payload-contracts.log"):
        add("independent-review/" + name, qa / name, "independent review or executed fixture receipt")
    for name in ("payload-manifest.v1.json", "payload-manifest.sha256", "product-provenance.v1.json"):
        add("product-source-inventory/" + name, package / name, "exact product kit inventory at the successful product test")
    # Retain only explicitly synthetic fixtures created by the qualification
    # driver, never an unrecognized owner review store or saved file.
    reviews = package / "userdata/reviews/decisions.json"
    data = json.loads(reviews.read_text())
    if list(data["decisions"]) != ["gold-106"] or data["decisions"]["gold-106"]["status"] != "Pending / not reviewed" \
            or data["decisions"]["gold-106"]["classification"] != "Unclassified" \
            or not data["decisions"]["gold-106"]["playability_notes"].startswith("QA FIXTURE"):
        raise ValueError("refuse to archive anything other than the explicit synthetic pending review fixture")
    add("product-synthetic-fixtures/decisions.json", reviews, "synthetic QA Pending/Unclassified review; not owner data")
    for path in sorted((package / "userdata/reviews/exports").rglob("*")):
        if path.is_file():
            relative = path.relative_to(package / "userdata/reviews/exports").as_posix()
            add("product-synthetic-fixtures/exports/" + relative, path, "synthetic QA export; not owner data")
    for name in ("native-edited-session.json", "native-reopened-session.json"):
        session = json.loads((qa / "product-linux-final-preflight" / name).read_text())
        for saved in session["saved_copies"]:
            path = Path(saved["path"])
            if not path.resolve().is_relative_to((package / "userdata").resolve()) or sha(path.read_bytes()) != saved["sha256"]:
                raise ValueError("synthetic saved-copy evidence moved or changed")
            destination = "product-synthetic-fixtures/saved/" + path.name
            if destination not in files:
                add(destination, path, "synthetic ordinary Workbench paint/save QA output; not an adopted corpus map")
    description = """# Linux qualification evidence checkpoint

This is an evidence archive. It is NOT the playable Windows evaluator ZIP.

It preserves the interrupted concurrent campaign's original SIGKILL logs and
annotations, the completed serial Linux campaign (53 aliases / 44 unique
Setups: 42 positive passes and 2 verified original policy refusals), and the
actual browser/native editing product test (26/26 checks). All receipt and
log bytes are original. The early empty-search gallery defect and successful
post-fix product run remain distinguishable.

The contemporary engine is 00cdb02f103265b6dc5224c68283e9a0c8cb449f with exact
Godot 4.7 stable. The separate frozen scientific baseline and verdicts are not
replaced or newly reproduced. This archive establishes Linux headless scope,
not Windows launch, displayed rendering, physical GPU quality, full routes,
or owner preference. Original #155/#183 native refusals remain refusals.

Product-synthetic-fixtures contains clearly labelled Pending/Unclassified QA
review/export files and deliberately painted named copies. These are test
outputs, not owner data, accepted labels, recovered originals or corpus additions.

ARCHIVE-MANIFEST.v1.json records every evidence file's exact byte count and
SHA-256. ZIP member order, timestamps and mode bits are fixed for deterministic
repacking; use the original bytes unchanged. No source/runtime executable is
inside this archive. The actual Windows evaluator is a separately qualified
and separately hashed deliverable.
"""
    files["README.md"] = description.encode()
    origins["README.md"] = "checkpoint scope, generated by archive_linux_checkpoint.py"
    inventory = {"schema": "goldmaps.linux-evidence-inventory.v1", "owner_accepted": False,
                 "scope": "Linux qualification evidence only; not a playable package or Windows acceptance",
                 "files": [{"path": name, "bytes": len(files[name]), "sha256": sha(files[name]), "origin": origins[name]}
                           for name in sorted(files)]}
    files["ARCHIVE-MANIFEST.v1.json"] = (json.dumps(inventory, indent=2) + "\n").encode()
    out.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(out, "x", zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for name in sorted(files):
            info = zipfile.ZipInfo(name, date_time=(2026, 11, 24, 0, 0, 0))
            info.create_system = 3
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            archive.writestr(info, files[name], compresslevel=9)
    with zipfile.ZipFile(out) as archive:
        if archive.testzip() is not None or set(archive.namelist()) != set(files):
            raise ValueError("evidence archive failed ZIP integrity")
        for name, data in files.items():
            if archive.read(name) != data:
                raise ValueError("evidence archive substituted bytes")
    receipt = {"schema": "goldmaps.linux-evidence-checkpoint.v1", "archive": out.name, "sha256": sha(out.read_bytes()),
               "archive_bytes": out.stat().st_size, "files": len(files), "uncompressed_bytes": sum(map(len, files.values())),
               "inventory_sha256": sha(files["ARCHIVE-MANIFEST.v1.json"]), "zip_crc_pass": True,
               "engine_head": required["engine_head"], "godot_sha256": required["godot_sha256"],
               "required_native_summary_sha256": sha((qa / "required44-linux-serial/summary.json").read_bytes()),
               "required_native": {key: required[key] for key in ("aliases_checked", "unique_setups_checked", "qualified_unique_setups", "verified_refused_unique_setups", "validation_pass", "executed_source")},
               "product_summary_sha256": sha((qa / "product-linux-final-preflight/summary.json").read_bytes()),
               "product_checks": 26, "product_manifest_sha256": product["package_after"]["manifest_sha256"],
               "interrupted_evidence_preserved": True, "owner_accepted": False,
               "scope": "Linux headless custody/native/product evidence only; actual Windows package qualification and owner acceptance are separate."}
    out.with_suffix(".json").write_text(json.dumps(receipt, indent=2) + "\n")
    out.with_suffix(".sha256").write_text(receipt["sha256"] + "  " + out.name + "\n", encoding="ascii")
    print(json.dumps(receipt, indent=2))


if __name__ == "__main__":
    main()
