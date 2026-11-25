#!/usr/bin/env python3
"""Install the additive GOLDMAPS UI into an independently staged portable kit.

The caller owns runtime acquisition, source custody, qualification and the final
payload manifest. This does not modify an engine checkout or a frozen map.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import shutil

HERE = Path(__file__).resolve().parent


def install(output: Path, engine_head: str, source_head: str) -> dict:
    output = output.resolve()
    if len(engine_head) != 40 or len(source_head) != 40:
        raise ValueError("Exact 40-character source identities are required")
    project = output / "runtime/project"
    if not (project / "project.godot").is_file():
        raise ValueError("Stage the source-matched engine at runtime/project first")
    if not (output / "collection/collection.v1.json").is_file():
        raise ValueError("Stage the collection fragment first")
    browser = output / "browser"
    session = project / "goldmaps"
    browser.mkdir(parents=True, exist_ok=True)
    session.mkdir(parents=True, exist_ok=True)
    for source in sorted((HERE / "browser").glob("*")):
        if source.is_file() and source.suffix != ".uid":
            shutil.copyfile(source, browser / source.name)
    for source in sorted((HERE / "session").glob("*")):
        if source.is_file() and source.suffix != ".uid":
            shutil.copyfile(source, session / source.name)
    for target in (browser, session):
        shutil.copyfile(HERE / "package_io.gd", target / "package_io.gd")
    launcher = r'''@echo off
setlocal
cd /d "%~dp0."
if not exist "%~dp0Godot_v4.7-stable_win64.exe" goto missing
if not exist "%~dp0payload-manifest.v1.json" goto missing
if not exist "%~dp0browser\project.godot" goto missing
for %%D in (roaming local data config cache temp reviews sessions) do if not exist "%~dp0userdata\%%D" mkdir "%~dp0userdata\%%D"
set "APPDATA=%~dp0userdata\roaming"
set "LOCALAPPDATA=%~dp0userdata\local"
set "XDG_DATA_HOME=%~dp0userdata\data"
set "XDG_CONFIG_HOME=%~dp0userdata\config"
set "XDG_CACHE_HOME=%~dp0userdata\cache"
set "TEMP=%~dp0userdata\temp"
set "TMP=%~dp0userdata\temp"
set "GOLDMAPS_PACKAGE_ROOT=%~dp0."
set "GOLDMAPS_DISPLAY_ARG="
if "%GOLDMAPS_QA_HEADLESS%"=="1" set "GOLDMAPS_DISPLAY_ARG=--headless"
"%~dp0Godot_v4.7-stable_win64.exe" %GOLDMAPS_DISPLAY_ARG% --path "%~dp0browser" --log-file "%~dp0userdata\browser.log"
if errorlevel 1 (
  echo.
  echo GOLDMAPS could not start. Read userdata\browser.log for details.
  pause
)
exit /b
:missing
echo Extract the complete evaluator ZIP to a normal folder before launching.
echo Keep Open GOLDMAPS.cmd beside the bundled Godot executable and payload manifest.
pause
exit /b 1
'''
    (output / "Open GOLDMAPS.cmd").write_bytes(launcher.replace("\n", "\r\n").encode("utf-8"))
    linux_launcher = '''#!/bin/sh
set -eu
KIT_ROOT=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
mkdir -p "$KIT_ROOT/userdata/data" "$KIT_ROOT/userdata/config" "$KIT_ROOT/userdata/cache" "$KIT_ROOT/userdata/temp"
export XDG_DATA_HOME="$KIT_ROOT/userdata/data"
export XDG_CONFIG_HOME="$KIT_ROOT/userdata/config"
export XDG_CACHE_HOME="$KIT_ROOT/userdata/cache"
export TMPDIR="$KIT_ROOT/userdata/temp"
export GOLDMAPS_PACKAGE_ROOT="$KIT_ROOT"
exec "$KIT_ROOT/Godot_v4.7-stable_linux.x86_64" --path "$KIT_ROOT/browser" --log-file "$KIT_ROOT/userdata/browser.log" "$@"
'''
    # Linux is a qualification convenience only when its exact runtime is bundled.
    if (output / "Godot_v4.7-stable_linux.x86_64").is_file():
        path = output / "Open GOLDMAPS.sh"
        path.write_text(linux_launcher, encoding="utf-8")
        path.chmod(0o755)
    stamp = {
        "schema": "goldmaps.owner-product.v1",
        "engine_head": engine_head,
        "delivery_source_head": source_head,
        "entrypoint": "Open GOLDMAPS.cmd",
        "browser_project": "browser",
        "runtime_project": "runtime/project",
        "runtime_entry_script": "res://goldmaps/session.gd",
        "source_changes": "additive delivery files only; accepted engine files remain byte-identical",
        "mutable_roots": ["userdata/", "browser/.godot/", "runtime/project/.godot/"],
        "owner_classifications": "pending until explicit local human decision",
        "files": {},
        "origins": {},
    }
    for path in sorted([*browser.glob("*"), *session.glob("*"), output / "Open GOLDMAPS.cmd"]):
        if path.is_file():
            stamp["files"][path.relative_to(output).as_posix()] = hashlib.sha256(path.read_bytes()).hexdigest()
            relative = path.relative_to(output).as_posix()
            if path.name == "package_io.gd":
                source_path = "tools/goldmaps_owner/product/package_io.gd"
            elif path.parent == browser:
                source_path = "tools/goldmaps_owner/product/browser/" + path.name
            elif path.parent == session:
                source_path = "tools/goldmaps_owner/product/session/" + path.name
            else:
                source_path = "tools/goldmaps_owner/product/assemble_product.py"
            stamp["origins"][relative] = {
                "kind": "generated_launcher" if path.suffix == ".cmd" else "source_file",
                "repo": "techrote/sandmapsreference",
                "commit": source_head,
                "path": source_path,
            }
    (output / "product-provenance.v1.json").write_text(json.dumps(stamp, indent=2) + "\n", encoding="utf-8")
    return stamp


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--engine-head", required=True)
    parser.add_argument("--source-head", required=True)
    args = parser.parse_args()
    result = install(args.output, args.engine_head, args.source_head)
    print(json.dumps({"installed_files": len(result["files"]), "engine_head": result["engine_head"]}))


if __name__ == "__main__":
    main()
