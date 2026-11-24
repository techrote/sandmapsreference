#!/usr/bin/env python3
"""Bounded transport/custody fixtures. No native World or visual acceptance."""
import base64
import contextlib
import copy
import gzip
import hashlib
import io
import json
from pathlib import Path
import tempfile
import unittest
import zipfile

import emit_review_artifacts as emitter


class EvidenceTransferTests(unittest.TestCase):
    def test_git_blob_hash(self):
        self.assertEqual(emitter.git_blob_sha1(b""), "e69de29bb2d1d6434b8b29ae775ad8c2e48c5391")

    def test_gzip_recovers_exact_original_bytes(self):
        source = b'{"source":"exact","line":"one\\ntwo"}\n' * 100
        compressed = emitter.gzip_deterministic(source)
        self.assertEqual(compressed, emitter.gzip_deterministic(source))
        self.assertEqual(compressed[4:8], b"\0\0\0\0")
        self.assertEqual(compressed[9], 255)
        self.assertEqual(gzip.decompress(compressed), source)

    def test_chunk_round_trip_and_complete_manifest(self):
        source = bytes(range(256)) * 1000
        item = emitter.make_item("package/fixture.bin", "fixture", source)
        stream = io.StringIO()
        authority = {"archive_sha256": "a" * 64, "independent_report_sha256": "b" * 64}
        with contextlib.redirect_stdout(stream):
            emitter.emit("handoff", authority, [item], {"selection_complete": True})
        rows = [(line.split(" ", 1)[0], json.loads(line.split(" ", 1)[1]))
                for line in stream.getvalue().splitlines()]
        chunks = [row for marker, row in rows if marker == "GOLDMAPS_REVIEW_CHUNK"]
        metadata = next(row for marker, row in rows if marker == "GOLDMAPS_REVIEW_FILE")
        self.assertGreater(len(chunks), 1)
        self.assertEqual([row["index"] for row in chunks], list(range(len(chunks))))
        self.assertTrue(all(row["total"] == len(chunks) and len(row["data"]) <= 16384 for row in chunks))
        restored = base64.b64decode("".join(row["data"] for row in chunks), validate=True)
        self.assertEqual(restored, source)
        self.assertEqual(metadata["sha256"], hashlib.sha256(restored).hexdigest())
        self.assertEqual(metadata["git_blob_sha1"], emitter.git_blob_sha1(restored))
        header = rows[0][1]
        complete = rows[-1][1]
        manifest = json.dumps(header["files"], sort_keys=True, ensure_ascii=True, separators=(",", ":")).encode()
        self.assertEqual(complete["file_manifest_sha256"], emitter.sha(manifest))
        self.assertTrue(complete["transfer_complete"])

    def test_duplicate_transfer_path_refused(self):
        item = emitter.make_item("package/proof.json", "fixture", b"{}")
        with self.assertRaisesRegex(ValueError, "duplicate transfer path"):
            emitter.plan_records([item, item], "handoff", {}, {})

    def test_owner_userdata_never_selected(self):
        with self.assertRaisesRegex(ValueError, "owner-local data"):
            emitter.make_item("userdata/reviews/decisions.json", "owner file", b"{}")

    def test_single_png_budget_refused(self):
        with self.assertRaisesRegex(ValueError, "PNG exceeds"):
            emitter.plan_records([emitter.make_item("qualification/graphical/large.png", "PNG", b"x" * (emitter.MIB + 1))],
                                 "images", {}, {})

    def test_aggregate_image_budget_refused(self):
        source = b"x" * emitter.MIB
        items = [emitter.make_item("qualification/graphical/%d.png" % i, "PNG", source) for i in range(13)]
        with self.assertRaisesRegex(ValueError, "total byte budget"):
            emitter.plan_records(items, "images", {}, {})

    def test_handoff_budget_refused(self):
        source = b"x" * emitter.MIB
        items = [emitter.make_item("package/%d.json" % i, "metadata", source) for i in range(17)]
        with self.assertRaisesRegex(ValueError, "total byte budget"):
            emitter.plan_records(items, "handoff", {}, {})

    def report(self):
        rows = [{"case": case, "kind": spec[1], "path": "qualification/graphical/" + spec[0],
                 "depicted_map_id": spec[2] or "gold-197", "display_driver": "windows"}
                for case, spec in emitter.IMAGE_SPECS.items()]
        rows.append({"case": "landscape", "kind": "browser gallery",
                     "path": "qualification/graphical/landscape-gallery.png",
                     "depicted_map_id": "gold-197", "display_driver": "windows"})
        return {"graphical_status": "CAPTURED_ALL_PLANNED", "rendered_capture_inventory": rows}

    def test_exact_18_selection_excludes_native_case_initial_gallery(self):
        selected, missing = emitter.choose_images(self.report())
        self.assertEqual(len(selected), 18)
        self.assertEqual(missing, [])
        self.assertEqual(selected["landscape"]["depicted_map_id"], "gold-125")
        self.assertEqual(selected["gallery"]["depicted_map_id"], "gold-197")

    def test_missing_complete_image_refused(self):
        report = self.report()
        report["rendered_capture_inventory"].pop(0)
        with self.assertRaisesRegex(ValueError, "lacks a planned image"):
            emitter.choose_images(report)

    def test_partial_display_scope_remains_explicit(self):
        report = self.report()
        report["rendered_capture_inventory"].pop(0)
        report["graphical_status"] = "PARTIAL_DISPLAY_LIMITATION"
        selected, missing = emitter.choose_images(report)
        self.assertEqual(len(selected), 17)
        self.assertEqual(missing, ["gallery"])

    def test_substituted_source_image_refused(self):
        report = self.report()
        next(row for row in report["rendered_capture_inventory"] if row["case"] == "landscape")["depicted_map_id"] = "gold-197"
        with self.assertRaisesRegex(ValueError, "different source"):
            emitter.choose_images(report)

    def test_unexpected_image_path_refused(self):
        report = self.report()
        report["rendered_capture_inventory"][0]["path"] = "userdata/private.png"
        with self.assertRaisesRegex(ValueError, "unexpected image path"):
            emitter.choose_images(report)

    def test_duplicate_selected_image_refused(self):
        report = self.report()
        report["rendered_capture_inventory"].append(copy.deepcopy(report["rendered_capture_inventory"][0]))
        with self.assertRaisesRegex(ValueError, "duplicate selected"):
            emitter.choose_images(report)

    def test_substituted_outer_receipt_refused(self):
        with tempfile.TemporaryDirectory() as name:
            root = Path(name).resolve()
            original = b'{"pass":true}\n'
            (root / "final-extracted-product.json").write_bytes(b'{"pass":false}\n')
            artifact = object.__new__(emitter.VerifiedArtifact)
            artifact.directory = root
            artifact.report = {"actual_launcher_and_reconstruction_receipts": {
                "final-extracted-product.json": {"bytes": len(original), "sha256": emitter.sha(original)}}}
            with self.assertRaisesRegex(ValueError, "independently audited bytes"):
                artifact.external("final-extracted-product.json")

    def test_missing_outer_audit_entry_refused(self):
        with tempfile.TemporaryDirectory() as name:
            root = Path(name).resolve()
            (root / "campaign.json").write_bytes(b"{}")
            artifact = object.__new__(emitter.VerifiedArtifact)
            artifact.directory = root
            artifact.report = {"actual_launcher_and_reconstruction_receipts": {}}
            with self.assertRaisesRegex(ValueError, "lacks its independent audit entry"):
                artifact.external("campaign.json")

    def test_exact_outer_audit_entry_is_preserved(self):
        with tempfile.TemporaryDirectory() as name:
            root = Path(name).resolve()
            original = b'{"pass":true}\n'
            (root / "final-extracted-product.json").write_bytes(original)
            artifact = object.__new__(emitter.VerifiedArtifact)
            artifact.directory = root
            artifact.report = {"actual_launcher_and_reconstruction_receipts": {
                "final-extracted-product.json": {"bytes": len(original), "sha256": emitter.sha(original)}}}
            self.assertEqual(artifact.external("final-extracted-product.json"), original)

    def artifact_fixture(self, root):
        archive = root / "CyberSand-GOLDMAPS-Owner-Evaluator-fixture.zip"
        source = b"exact fixture\n"
        manifest = {"schema": "goldmaps.owner-payload.v1", "engine_head": "1" * 40,
                    "delivery_source_head": "2" * 40,
                    "files": [{"path": "fixture.txt", "bytes": len(source),
                               "sha256": emitter.sha(source), "origin": {"kind": "fixture"}}]}
        raw = (json.dumps(manifest) + "\n").encode()
        with zipfile.ZipFile(archive, "w") as opened:
            opened.writestr("fixture.txt", source)
            opened.writestr(emitter.MANIFEST, raw)
            opened.writestr(emitter.SIDECAR, emitter.sha(raw) + "  " + emitter.MANIFEST + "\n")
        verified = emitter.verify_zip(archive)
        report = {"schema": "goldmaps.independent-final-artifact-review.v1", "pass": True,
                  "owner_accepted": False, "archive": verified}
        return archive, report

    def test_actual_zip_hash_must_match_independent_report(self):
        with tempfile.TemporaryDirectory() as name:
            root = Path(name).resolve()
            _, report = self.artifact_fixture(root)
            report["archive"]["archive_sha256"] = "0" * 64
            path = root / "review.json"
            path.write_text(json.dumps(report), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "differs from the audited archive"):
                emitter.VerifiedArtifact(root, path, root)

    def test_extra_zip_member_refused_even_with_matching_outer_hash(self):
        with tempfile.TemporaryDirectory() as name:
            root = Path(name).resolve()
            archive, report = self.artifact_fixture(root)
            with zipfile.ZipFile(archive, "a") as opened:
                opened.writestr("extra.txt", b"unlisted")
            report["archive"]["archive_sha256"] = emitter.file_sha256(archive)
            path = root / "review.json"
            path.write_text(json.dumps(report), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "inventory mismatch"):
                emitter.VerifiedArtifact(root, path, root)


if __name__ == "__main__":
    unittest.main()
