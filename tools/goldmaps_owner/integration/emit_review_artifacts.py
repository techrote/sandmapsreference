#!/usr/bin/env python3
"""Transfer already audited owner-kit bytes through bounded GitHub log records.

This is a read-only evidence transport. It executes no game, renders no image,
makes no visual-quality judgment and changes no owner decision. All selected
files come from the actual downloaded inner ZIP, its exact outer handoff, or
the independently generated audit report. Standard library + repository's
existing standard-library payload verifier only.
"""
from __future__ import annotations

import argparse
import base64
import gzip
import hashlib
import io
import json
from pathlib import Path
import re
import struct
import subprocess
import sys
import zipfile

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
sys.path.insert(0, str(HERE.parent / "qualification"))
import verify_payload as payload_verifier
from verify_payload import MANIFEST, SIDECAR, file_sha256, read_manifest, safe_path, strict_json, verify_zip

MIB = 1024 * 1024
CHUNK_CHARACTERS = 16 * 1024
PNG_LIMIT = MIB
IMAGE_TOTAL_LIMIT = 12 * MIB
HANDOFF_TOTAL_LIMIT = 16 * MIB
MAX_ACQUISITION_INPUT = 64 * MIB
SHA256 = re.compile(r"[0-9a-f]{64}")
SHA1 = re.compile(r"[0-9a-f]{40}")
PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"

# The first gallery shown by a native case is intentionally excluded. Its
# depicted source may be the default selection rather than that case's map.
IMAGE_SPECS = {
    "gallery": ("gallery-gallery.png", "browser gallery", None),
    "gallery-1280x720": ("gallery-1280x720-gallery.png", "browser gallery", None),
    "gallery-1380x880": ("gallery-1380x880-gallery.png", "browser gallery", None),
    "landscape": ("landscape-workbench.png", "actual native Workbench", "gold-125"),
    "portrait": ("portrait-workbench.png", "actual native Workbench", "gold-197"),
    "B3-original": ("B3-original-workbench.png", "actual native Workbench", "trial-B3-original"),
    "B3-candidate": ("B3-candidate-workbench.png", "actual native Workbench", "trial-B3-candidate"),
    "D1-original": ("D1-original-workbench.png", "actual native Workbench", "trial-D1-original"),
    "D1-candidate": ("D1-candidate-workbench.png", "actual native Workbench", "trial-D1-candidate"),
    "D1-reference": ("D1-reference-workbench.png", "actual native Workbench", "trial-D1-reference"),
    "D2-original": ("D2-original-workbench.png", "actual native Workbench", "trial-D2-original"),
    "D2-candidate": ("D2-candidate-workbench.png", "actual native Workbench", "trial-D2-candidate"),
    "D2-reference": ("D2-reference-workbench.png", "actual native Workbench", "trial-D2-reference"),
    "policy-155": ("policy-155-workbench.png", "actual native Workbench", "derived-155-policy"),
    "policy-183": ("policy-183-workbench.png", "actual native Workbench", "derived-183-policy"),
    "comparison-popup": ("comparison-popup-popup.png", "rendered comparison-popup", "trial-D1-original"),
    "decision-dialog": ("decision-dialog-popup.png", "rendered decision-dialog", "gold-125"),
    "overview-zoom": ("overview-zoom-popup.png", "rendered overview-zoom", "gold-197"),
}
OUTER_HANDOFF = (
    "campaign.json", "archive-verification.json", "reconstruction-integrity.json",
    "fresh-extraction-integrity.json", "final-extracted-after.json",
    "final-pristine-launcher.json", "final-extracted-product.json",
    "owner-package-acquisition.v1.json.sha256", "acquire_owner_package.py",
)
AUDITED_OUTER = frozenset(OUTER_HANDOFF[:7] + ("owner-package-acquisition.v1.json",))
INNER_HANDOFF = (
    MANIFEST, SIDECAR, "product-provenance.v1.json", "runtime/source-provenance.v1.json",
    "collection/collection-files.v1.json", "collection/collection.v1.json",
    "collection/delivery-qualification.v1.json",
    "qualification/per-variant-matrix.v1.json", "qualification/PER-VARIANT-MATRIX.md",
    "qualification/campaign.json", "qualification/graphical/summary.json",
)
OPTIONAL_INNER_HANDOFF = (
    "qualification/contact-fragment-boundary.json",
    "qualification/native-evidence-reuse.v1.json",
    "qualification/windows-contact-followup/summary.json",
)


def demand(condition, message):
    if not condition:
        raise ValueError("Review evidence transfer refused: " + message)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def git_blob_sha1(data):
    return hashlib.sha1(b"blob " + str(len(data)).encode("ascii") + b"\0" + data).hexdigest()


def gzip_deterministic(data):
    # Empty filename and mtime=0 prevent host paths and wall-clock timestamps
    # entering the transport. GzipFile also fixes the OS header byte to 255.
    output = io.BytesIO()
    with gzip.GzipFile(filename="", mode="wb", fileobj=output, compresslevel=9, mtime=0) as stream:
        stream.write(data)
    return output.getvalue()


def bounded_file(path, limit):
    demand(path.is_file() and not path.is_symlink(), "missing or nonregular input: " + str(path))
    demand(path.stat().st_size <= limit, "input exceeds byte budget: " + path.name)
    data = path.read_bytes()
    demand(len(data) <= limit, "input grew beyond byte budget: " + path.name)
    return data


def committed_bytes(repo, head, path):
    demand(SHA1.fullmatch(head), "source commit is not exact")
    safe_path(path)
    return subprocess.check_output(
        ["git", "-C", str(repo), "show", head + ":" + path],
        stderr=subprocess.DEVNULL,
    )


def execution_identity(repo):
    demand(Path(__file__).resolve() == (repo / "tools/goldmaps_owner/integration/emit_review_artifacts.py").resolve()
           and Path(payload_verifier.__file__).resolve() == (repo / "tools/goldmaps_owner/qualification/verify_payload.py").resolve(),
           "executed emitter/dependency paths differ from the claimed checkout")
    head = subprocess.check_output(["git", "-C", str(repo), "rev-parse", "HEAD"], text=True).strip()
    files = {}
    for path in (
        "tools/goldmaps_owner/integration/emit_review_artifacts.py",
        "tools/goldmaps_owner/qualification/verify_payload.py",
    ):
        local = bounded_file(repo / path, MIB)
        demand(committed_bytes(repo, head, path) == local, "emitter dependency differs from its committed source")
        files[path] = sha(local)
    return {"checkout_head": head, "files_match_commit": True, "files": files}


class VerifiedArtifact:
    def __init__(self, directory, report_path, repo):
        self.directory = directory.resolve(strict=True)
        demand(self.directory.is_dir(), "artifact directory is absent")
        archives = list(self.directory.glob("CyberSand-GOLDMAPS-Owner-Evaluator-*.zip"))
        demand(len(archives) == 1 and not archives[0].is_symlink(), "expected exactly one actual inner evaluator ZIP")
        self.archive = archives[0]
        self.report_raw = bounded_file(report_path, 8 * MIB)
        self.report = strict_json(self.report_raw)
        demand(isinstance(self.report, dict)
               and self.report.get("schema") == "goldmaps.independent-final-artifact-review.v1"
               and self.report.get("pass") is True and self.report.get("owner_accepted") is False,
               "independent final audit is absent or unsuccessful")
        recorded = self.report.get("archive", {})
        demand(recorded.get("pass") is True and recorded.get("zip_crc") == "PASS"
               and SHA256.fullmatch(str(recorded.get("archive_sha256", "")))
               and SHA256.fullmatch(str(recorded.get("manifest_sha256", ""))),
               "independent archive authority is malformed")
        demand(file_sha256(self.archive) == recorded["archive_sha256"], "actual inner ZIP differs from the audited archive")
        self.verified = verify_zip(self.archive, recorded["manifest_sha256"])
        demand(self.verified == recorded, "strict current ZIP inventory differs from the independent audit")
        self.opened = zipfile.ZipFile(self.archive)
        self.prefix = self.verified["envelope_directory"]
        manifest_raw = self.opened.read(self.prefix + MANIFEST)
        self.manifest, self.index = read_manifest(manifest_raw, self.verified["manifest_sha256"])
        self.source = self.manifest["delivery_source_head"]
        demand(SHA1.fullmatch(str(self.source)) and self.report.get("delivery_source_head") == self.source
               and self.report.get("engine_head") == self.manifest["engine_head"],
               "audit and payload source/runtime authorities differ")
        self.campaign = strict_json(self.external("campaign.json"))
        demand(self.campaign.get("source_head") == self.source
               and str(self.campaign.get("github_run_id")) == str(self.report.get("github_run_id"))
               and self.campaign.get("engine_head") == self.manifest["engine_head"]
               and self.campaign.get("actual_final_extracted_launcher") == "PASS"
               and self.campaign.get("archive") == self.verified,
               "outer campaign is not the audited completed delivery")
        auditor_path = "tools/goldmaps_owner/qualification/review_final_artifact.py"
        demand(sha(committed_bytes(repo, self.source, auditor_path)) == self.report.get("review_tool_sha256"),
               "audit report does not name the artifact source's committed independent reviewer")
        self.executed_source = execution_identity(repo)

    def close(self):
        self.opened.close()

    def raw(self, path, limit=HANDOFF_TOTAL_LIMIT):
        safe_path(path)
        info = self.opened.getinfo(self.prefix + path)
        demand(info.file_size <= limit, "selected archive file exceeds budget: " + path)
        data = self.opened.read(info)
        demand(len(data) == info.file_size and len(data) <= limit, "selected archive file size changed")
        if path not in (MANIFEST, SIDECAR):
            row = self.index[path]
            demand(len(data) == row["bytes"] and sha(data) == row["sha256"], "selected bytes differ from their exact manifest")
        return data

    def external(self, name, limit=HANDOFF_TOTAL_LIMIT):
        safe_path(name)
        demand("/" not in name, "outer handoff path is not a fixed flat artifact file")
        path = self.directory / name
        demand(path.resolve(strict=True).parent == self.directory, "outer handoff path escapes the artifact directory")
        data = bounded_file(path, limit)
        audited = self.report.get("actual_launcher_and_reconstruction_receipts", {})
        demand(name not in AUDITED_OUTER or name in audited,
               "required outer handoff lacks its independent audit entry: " + name)
        if name in audited:
            row = audited[name]
            demand(row.get("bytes") == len(data) and row.get("sha256") == sha(data),
                   "outer handoff differs from its independently audited bytes: " + name)
        return data

    def authority(self):
        return {
            "delivery_source_head": self.source,
            "delivery_run_id": str(self.report["github_run_id"]),
            "engine_head": self.manifest["engine_head"],
            "archive_name": self.archive.name,
            "archive_sha256": self.verified["archive_sha256"],
            "payload_manifest_sha256": self.verified["manifest_sha256"],
            "independent_report_sha256": sha(self.report_raw),
            "executed_source": self.executed_source,
            "owner_accepted": False,
        }


def make_item(path, role, data, **metadata):
    safe_path(path)
    demand(not path.startswith("userdata/"), "owner-local data is never an evidence-transfer input")
    return {"path": path, "role": role, "data": data, **metadata}


def choose_images(report):
    selected = {}
    for capture in report["rendered_capture_inventory"]:
        case = capture["case"]
        if case not in IMAGE_SPECS:
            continue
        filename, kind, map_id = IMAGE_SPECS[case]
        if capture["kind"] != kind:
            continue
        demand(case not in selected, "duplicate selected rendered case")
        demand(capture["path"] == "qualification/graphical/" + filename
               and capture.get("display_driver") not in (None, "", "headless"),
               "unexpected image path or headless scope")
        if map_id is not None:
            demand(capture.get("depicted_map_id") == map_id, "selected image depicts a different source")
        selected[case] = capture
    missing = [case for case in IMAGE_SPECS if case not in selected]
    status = report["graphical_status"]
    demand(status in ("CAPTURED_ALL_PLANNED", "PARTIAL_DISPLAY_LIMITATION"), "unrecognized audited displayed scope")
    demand(status != "CAPTURED_ALL_PLANNED" or not missing, "complete graphical claim lacks a planned image")
    return selected, missing


def image_items(artifact):
    selected, missing = choose_images(artifact.report)
    items = []
    for case in IMAGE_SPECS:
        if case not in selected:
            continue
        capture = selected[case]
        data = artifact.raw(capture["path"], PNG_LIMIT)
        demand(sha(data) == capture["sha256"] and len(data) >= 33
               and data[:8] == PNG_SIGNATURE and data[12:16] == b"IHDR"
               and struct.unpack(">II", data[16:24]) == (capture["width"], capture["height"]),
               "original rendered PNG differs from its independent capture identity")
        items.append(make_item(capture["path"], "original rendered PNG", data,
                               mime_type="image/png", case=case,
                               depicted_map_id=capture["depicted_map_id"],
                               requested_case_map_id=capture.get("requested_case_map_id"),
                               requested_ui_map_id=capture.get("requested_ui_map_id"),
                               view_kind=capture.get("view_kind", "native-workbench"),
                               width=capture["width"], height=capture["height"],
                               renderer=capture.get("renderer"), display_driver=capture["display_driver"]))
    return items, {"expected_images": len(IMAGE_SPECS), "missing_images": missing,
                   "selection_complete": not missing, "graphical_status": artifact.report["graphical_status"]}


def handoff_items(artifact, repo):
    items = [make_item("audit/independent-published-artifact-review.v1.json",
                       "independent actual-archive audit report", artifact.report_raw,
                       mime_type="application/json")]
    acquisition = artifact.external("owner-package-acquisition.v1.json", MAX_ACQUISITION_INPUT)
    digest = sha(acquisition)
    sidecar = artifact.external("owner-package-acquisition.v1.json.sha256", 1024)
    demand(sidecar.decode("ascii").strip().split() == [digest, "owner-package-acquisition.v1.json"]
           and artifact.campaign["acquisition_manifest_sha256"] == digest,
           "exact acquisition bytes do not match their sidecar/campaign")
    document = strict_json(acquisition)
    expected = {path: (row["bytes"], row["sha256"]) for path, row in artifact.index.items()}
    for path in (MANIFEST, SIDECAR):
        value = artifact.raw(path)
        expected[path] = (len(value), sha(value))
    demand(document.get("schema") == "goldmaps.owner-acquisition.v1"
           and document["delivery_source_head"] == artifact.source
           and document["payload_manifest_sha256"] == artifact.verified["manifest_sha256"]
           and len(document["files"]) == len(expected)
           and {row["path"]: (row["bytes"], row["sha256"]) for row in document["files"]} == expected,
           "acquisition inventory differs from the actual audited ZIP")
    compressed = gzip_deterministic(acquisition)
    items.append(make_item("artifact/owner-package-acquisition.v1.json.gz",
                           "exact acquisition manifest, deterministic gzip transport", compressed,
                           mime_type="application/gzip", compression="gzip", gzip_mtime=0,
                           original_path="owner-package-acquisition.v1.json",
                           original_bytes=len(acquisition), original_sha256=digest,
                           original_git_blob_sha1=git_blob_sha1(acquisition)))
    for name in OUTER_HANDOFF:
        data = artifact.external(name)
        if name == "acquire_owner_package.py":
            demand(data == committed_bytes(repo, artifact.source,
                   "tools/goldmaps_owner/integration/acquire_owner_package.py"),
                   "acquisition helper differs from the artifact source")
        items.append(make_item("artifact/" + name, "exact published handoff file", data))
    archive_sidecar = artifact.external(artifact.archive.name + ".sha256", 1024)
    demand(archive_sidecar.decode("ascii").strip().split()
           == [artifact.verified["archive_sha256"], artifact.archive.name], "archive SHA sidecar differs")
    items.append(make_item("artifact/" + artifact.archive.name + ".sha256",
                           "actual inner ZIP SHA-256 sidecar", archive_sidecar))
    for path in INNER_HANDOFF:
        items.append(make_item("package/" + path, "exact immutable payload metadata", artifact.raw(path)))
    for path in OPTIONAL_INNER_HANDOFF:
        if path in artifact.index:
            items.append(make_item("package/" + path, "exact additional native authority receipt", artifact.raw(path)))
    return items, {"selection_complete": True,
                   "acquisition_original_sha256": digest,
                   "acquisition_original_bytes": len(acquisition),
                   "compression_scope": "Original JSON bytes recover exactly; gzip is transport only"}


def plan_records(items, mode, authority, selection):
    demand(mode in ("images", "handoff"), "unknown transfer mode")
    limit = IMAGE_TOTAL_LIMIT if mode == "images" else HANDOFF_TOTAL_LIMIT
    demand(len({item["path"] for item in items}) == len(items), "duplicate transfer path")
    demand(sum(len(item["data"]) for item in items) <= limit, "selected transfer exceeds total byte budget")
    if mode == "images":
        demand(all(len(item["data"]) <= PNG_LIMIT for item in items), "selected PNG exceeds byte budget")
    metadata, transfers = [], []
    for number, item in enumerate(items, 1):
        data = item["data"]
        encoded = base64.b64encode(data).decode("ascii")
        chunks = [encoded[offset:offset + CHUNK_CHARACTERS]
                  for offset in range(0, len(encoded), CHUNK_CHARACTERS)] or [""]
        file_id = mode + "-" + str(number).zfill(3)
        record = {key: value for key, value in item.items() if key != "data"}
        record.update(file_id=file_id, bytes=len(data), sha256=sha(data),
                      git_blob_sha1=git_blob_sha1(data), encoding="base64",
                      chunk_characters=CHUNK_CHARACTERS, chunks=len(chunks))
        metadata.append(record)
        transfers.append((record, chunks))
    header = {"schema": "goldmaps.review-evidence-transfer.v1", "mode": mode, **authority,
              "files": metadata, "total_transfer_bytes": sum(row["bytes"] for row in metadata),
              "total_base64_characters": sum(sum(map(len, chunks)) for _, chunks in transfers),
              "maximum_transfer_bytes": limit, **selection,
              "scope": "Transfer of original verified bytes only; no new native execution, rendering, visual review, owner classification or acceptance"}
    return header, transfers


def emit(mode, authority, items, selection):
    # Complete all custody, size and selection checks before writing any data.
    header, transfers = plan_records(items, mode, authority, selection)
    def line(marker, record):
        print(marker + " " + json.dumps(record, sort_keys=True, ensure_ascii=True, separators=(",", ":")), flush=True)
    line("GOLDMAPS_REVIEW_TRANSFER", header)
    for record, chunks in transfers:
        line("GOLDMAPS_REVIEW_FILE", {"mode": mode, **record})
        for index, chunk in enumerate(chunks):
            line("GOLDMAPS_REVIEW_CHUNK", {
                "mode": mode, "file_id": record["file_id"], "path": record["path"],
                "index": index, "total": len(chunks), "sha256": record["sha256"], "data": chunk,
            })
    line("GOLDMAPS_REVIEW_COMPLETE", {
        "schema": "goldmaps.review-evidence-transfer-complete.v1", "mode": mode,
        "files": len(transfers), "total_transfer_bytes": header["total_transfer_bytes"],
        "archive_sha256": authority["archive_sha256"],
        "independent_report_sha256": authority["independent_report_sha256"],
        "selection_complete": selection["selection_complete"], "transfer_complete": True,
        "file_manifest_sha256": sha(json.dumps(header["files"], sort_keys=True, ensure_ascii=True,
                                               separators=(",", ":")).encode("utf-8")),
    })


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--artifact-dir", type=Path, required=True)
    parser.add_argument("--report", type=Path, required=True)
    parser.add_argument("--mode", choices=("images", "handoff"), required=True)
    parser.add_argument("--source-repo", type=Path, default=ROOT)
    args = parser.parse_args()
    repo = args.source_repo.resolve(strict=True)
    artifact = VerifiedArtifact(args.artifact_dir, args.report, repo)
    try:
        items, selection = image_items(artifact) if args.mode == "images" else handoff_items(artifact, repo)
        emit(args.mode, artifact.authority(), items, selection)
    finally:
        artifact.close()


if __name__ == "__main__":
    main()
