#!/usr/bin/env python3
"""Validate actual contact-sidecar inventory and isolated hostile fixtures."""
from __future__ import annotations
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
sys.path.insert(0, str(HERE.parent / "corpus"))
from query import Collection

MANIFEST = "collection/collection-files.v1.json"
INPUT = "collection/native-contact-followup-inputs.v1.json"
AUDIT = "collection/contact-followup-source-static-audit.v1.json"


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def demand(condition, message):
    if not condition:
        raise ValueError(message)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--package", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    kit = args.package.resolve()
    demand(not args.out.exists(), "Refuse to overwrite fixture evidence")
    head = subprocess.check_output(["git", "-C", str(ROOT), "rev-parse", "HEAD"], text=True).strip()
    source_files = {}
    for relative in ("tools/goldmaps_owner/integration/test_contact_manifest_extension.py",
                     "tools/goldmaps_owner/integration/contact_followup.py",
                     "tools/goldmaps_owner/corpus/query.py"):
        path = ROOT / relative
        committed = subprocess.check_output(["git", "-C", str(ROOT), "show", head + ":" + relative])
        demand(committed == path.read_bytes(), "Fixture source differs from executing commit")
        source_files[relative] = sha(path)
    original_manifest = (kit / MANIFEST).read_bytes()
    manifest = json.loads(original_manifest)
    extensions = manifest.get("delivery_extensions", [])
    demand(len(extensions) == 1 and extensions[0]["added_paths"] == [INPUT, AUDIT],
           "Unexpected fragment extension")
    prior = extensions[0]["prior_counts"]
    demand(prior["files"] == 267 and manifest["counts"]["files"] == 269,
           "Unexpected corpus fragment population")
    demand([row["path"] for row in manifest["files"][prior["files"]:]] == [INPUT, AUDIT]
           and not {INPUT, AUDIT} & {row["path"] for row in manifest["files"][:prior["files"]]},
           "Declared sidecars replace or duplicate a prior member")
    demand(sum(row["bytes"] for row in manifest["files"][:prior["files"]]) == prior["bytes"],
           "Prior fragment byte count changed")
    original_fragment = json.loads(original_manifest)
    original_fragment.pop("delivery_extensions")
    original_fragment["files"] = original_fragment["files"][:prior["files"]]
    original_fragment["counts"] = prior
    canonical_prior = (json.dumps(original_fragment, ensure_ascii=False, indent=2, sort_keys=True) + "\n").encode("utf-8")
    # core.write_json emits generated metadata through write_text: Windows
    # uses CRLF, Linux uses LF. Match the actual prior digest exactly; never
    # normalize copied Setups, source files, runtime inputs or evidence.
    prior_forms = {"LF": canonical_prior, "CRLF": canonical_prior.replace(b"\n", b"\r\n")}
    matched_forms = [name for name, raw in prior_forms.items()
                     if hashlib.sha256(raw).hexdigest() == extensions[0]["prior_manifest_sha256"]]
    demand(len(matched_forms) == 1, "Original canonical fragment records or provenance changed")
    before = Collection(kit).validate()
    snapshots = {relative: sha(kit / relative) for relative in (MANIFEST, INPUT, AUDIT)}
    checks = [{"name": "actual prepared fragment validates all 269 declared members", "pass": True}]
    with tempfile.TemporaryDirectory(prefix="goldmaps-contact-fixtures-", dir=kit.parent) as temp:
        fixture = Path(temp)
        def copy_file(source, target):
            try:
                os.link(source, target)
            except OSError:
                shutil.copyfile(source, target)
            return target
        for folder in ("collection", "corpus-export"):
            shutil.copytree(kit / folder, fixture / folder, copy_function=copy_file)

        def refuse(name, expected_error):
            try:
                Collection(fixture).validate()
            except expected_error as error:
                checks.append({"name": name, "pass": True, "refusal": str(error)})
            else:
                raise AssertionError("Strict corpus validator admitted " + name)

        for sidecar in (INPUT, AUDIT):
            missing = fixture / sidecar
            missing.unlink()
            refuse("missing " + sidecar + " is refused", FileNotFoundError)
            shutil.copyfile(kit / sidecar, missing)

            corrupt = fixture / sidecar
            corrupt.unlink()  # Never write through a link into the real kit.
            corrupt.write_bytes((kit / sidecar).read_bytes() + b" ")
            refuse("corrupted " + sidecar + " bytes are refused", ValueError)
            corrupt.unlink()
            shutil.copyfile(kit / sidecar, corrupt)

        extra = fixture / "collection/unlisted-contact-extra.json"
        extra.write_text("{}\n", encoding="utf-8")
        refuse("undeclared extra file is refused", ValueError)
        extra.unlink()

        altered = fixture / MANIFEST
        altered.unlink()
        invalid = json.loads(original_manifest)
        invalid["counts"]["files"] -= 1
        altered.write_text(json.dumps(invalid), encoding="utf-8")
        refuse("altered fragment count is refused", ValueError)
        altered.write_bytes(original_manifest)
        demand(Collection(fixture).validate()["status"] == "PASS",
               "Restored isolated fixture no longer validates")
    after = Collection(kit).validate()
    demand(before == after and snapshots == {relative: sha(kit / relative) for relative in snapshots},
           "Hostile fixture mutated the actual collection")
    checks.append({"name": "actual prepared kit remains unchanged after hostile fixtures", "pass": True})
    report = {"schema": "goldmaps.owner-contact-fragment-boundary.v1", "pass": True,
              "source_head": head, "source_files": source_files,
              "github_run_id": os.environ.get("GITHUB_RUN_ID"),
              "prepared_fragment": before, "prior_fragment_newlines": matched_forms[0], "checks": checks,
              "scope": "Actual strict offline corpus validation and isolated hostile fixtures. No native execution or owner acceptance."}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
