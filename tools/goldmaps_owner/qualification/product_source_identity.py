#!/usr/bin/env python3
"""Bind product-only qualification drivers to their actual committed source.

This deliberately does not change the native corpus runner or its source lock.
Runtime/browser/session inputs are independently bound by the package manifest.
"""
from __future__ import annotations

import hashlib
import os
from pathlib import Path
import subprocess


def product_source_identity(names):
    here = Path(__file__).resolve().parent
    repo = here.parents[2]
    paths = [(here / name).resolve() for name in sorted(set(names) | {"product_source_identity.py"})]
    files = {path.relative_to(repo).as_posix(): hashlib.sha256(path.read_bytes()).hexdigest() for path in paths}
    head = subprocess.check_output(["git", "-C", str(repo), "rev-parse", "HEAD"], text=True).strip()
    for path, expected in files.items():
        raw = subprocess.check_output(["git", "-C", str(repo), "show", head + ":" + path], stderr=subprocess.DEVNULL)
        if hashlib.sha256(raw).hexdigest() != expected:
            raise ValueError("Product qualification source differs from committed bytes: " + path)
    requested = os.environ.get("GOLDMAPS_TEST_SOURCE_HEAD")
    if requested and requested != head:
        raise ValueError("Product qualification source differs from requested commit")
    return {"checkout_head": head, "files_match_commit": True, "files": files,
            "scope": "Actual external product qualification driver/probe/helper bytes; delivered runtime/UI bytes are separately bound by the immutable package manifest."}
