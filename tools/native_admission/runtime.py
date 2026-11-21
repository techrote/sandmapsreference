"""Acquire and prove the exact accepted CyberSand Windows runtime (stdlib only)."""
from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import stat
import subprocess
import zipfile

ENGINE_REPOSITORY = "techrote/cybersand"
NATIVE_PATH = "godot/addons/cybersand_native/bin/cybersand_native.windows.x86_64.dll"
RAPIER_PATH = "godot/addons/godot-rapier2d/bin/libgodot_rapier.windows.x86_64-pc-windows-msvc.dll"
RAPIER_SHA256 = "b54e54bd1a03ae9094b788bf869212b5405b4a04793792d5a7cd81632cb10dd7"
GODOT_VERSION = "4.7.stable.official.5b4e0cb0f"
GODOT_URL = "https://github.com/godotengine/godot-builds/releases/download/4.7-stable/Godot_v4.7-stable_win64.exe.zip"
GODOT_SHA512 = "41645a908eb3181d6f2d1201ed7b6d6f095f6a23aaed8903d5d255277cc8d142814f3e6817f865b3cac142c39b8aff99280091d3bbdaa301517730b3ba0522b9"
SOURCE_SCOPES = ("native/include", "native/src", "godot/native_extension")
SOURCE_SUFFIXES = {".c", ".cc", ".cpp", ".cxx", ".h", ".hh", ".hpp", ".hxx", ".inc", ".inl", ".tpp"}
MAX_ARCHIVE = 128 * 1024 * 1024
MAX_UNPACKED = 320 * 1024 * 1024
SHA40 = re.compile(r"[0-9a-f]{40}\Z")
SHA64 = re.compile(r"[0-9a-f]{64}\Z")


class RuntimeIntegrityError(ValueError):
    pass


def digest(path: Path, kind: str = "sha256") -> str:
    h = hashlib.new(kind)
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            h.update(block)
    return h.hexdigest()


def strict_json(data: bytes | str):
    def pairs(items):
        result = {}
        for key, value in items:
            if key in result:
                raise RuntimeIntegrityError("Duplicate JSON key: " + key)
            result[key] = value
        return result
    def invalid(value):
        raise RuntimeIntegrityError("Non-finite JSON number: " + value)
    return json.loads(data, object_pairs_hook=pairs, parse_constant=invalid)


def write_json(path: Path, value) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + ".tmp")
    temporary.write_text(json.dumps(value, indent=2, sort_keys=True, allow_nan=False) + "\n", encoding="utf-8")
    os.replace(temporary, path)


def safe_relative(value: str) -> str:
    if (not isinstance(value, str) or not value or "\\" in value or ":" in value
            or any(ord(c) < 32 for c in value) or value.startswith("/")
            or any(p in ("", ".", "..") for p in value.split("/"))):
        raise RuntimeIntegrityError("Unsafe relative path")
    for part in value.split("/"):
        if part.rstrip(" .") != part or re.fullmatch(r"(?i)(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\..*)?", part):
            raise RuntimeIntegrityError("Unsafe Windows path component")
    return value


def safe_extract(archive: Path, target: Path, *, maximum: int = MAX_UNPACKED) -> list[str]:
    """Validate every member before extracting any; reject Windows aliases too."""
    if target.exists() and any(target.iterdir()):
        raise RuntimeIntegrityError("Extraction target must be empty")
    with zipfile.ZipFile(archive) as bundle:
        infos = bundle.infolist()
        if len(infos) > 10000 or sum(i.file_size for i in infos) > maximum:
            raise RuntimeIntegrityError("Archive resource budget exceeded")
        seen = set()
        names = []
        for item in infos:
            name = item.filename.rstrip("/")
            safe_relative(name)
            folded = name.casefold()
            if folded in seen:
                raise RuntimeIntegrityError("Duplicate archive destination")
            seen.add(folded)
            kind = stat.S_IFMT(item.external_attr >> 16)
            if kind not in (0, stat.S_IFREG, stat.S_IFDIR) or item.flag_bits & 1:
                raise RuntimeIntegrityError("Archive symlink/special/encrypted member")
            if item.compress_size and item.file_size > max(1024 * 1024, item.compress_size * 1000):
                raise RuntimeIntegrityError("Archive expansion ratio exceeded")
            if not item.is_dir():
                names.append(name)
        target.mkdir(parents=True, exist_ok=True)
        for item in infos:
            destination = target.joinpath(*PurePosixPath(item.filename).parts)
            if item.is_dir():
                destination.mkdir(parents=True, exist_ok=True)
            else:
                destination.parent.mkdir(parents=True, exist_ok=True)
                with bundle.open(item) as source, destination.open("xb") as out:
                    shutil.copyfileobj(source, out, length=1024 * 1024)
    return names


def git(root: Path, *args: str) -> str:
    return subprocess.check_output(["git", "-C", str(root), *args], timeout=60).decode("utf-8").strip()


def validate_checkout(root: Path, engine_sha: str, expected_tree: str | None = None) -> tuple[str, dict]:
    if not SHA40.fullmatch(engine_sha) or git(root, "rev-parse", "HEAD") != engine_sha:
        raise RuntimeIntegrityError("Engine checkout differs from exact accepted revision")
    tree = git(root, "rev-parse", "HEAD^{tree}")
    if expected_tree and tree != expected_tree:
        raise RuntimeIntegrityError("Engine source tree mismatch")
    git(root, "diff", "--exit-code", "HEAD", "--", *SOURCE_SCOPES, "godot", ":!godot/.godot")
    extra = git(root, "ls-files", "--others", "--exclude-standard", "--", *SOURCE_SCOPES, "godot")
    if any(p and not p.startswith("godot/.godot/") for p in extra.splitlines()):
        raise RuntimeIntegrityError("Untracked engine inputs")
    tracked = set(git(root, "ls-files", "--", *SOURCE_SCOPES).splitlines())
    inputs = {}
    for scope in SOURCE_SCOPES:
        for path in sorted((root / scope).rglob("*")):
            if path.is_symlink():
                raise RuntimeIntegrityError("Symlink in engine source inputs")
            if path.is_file() and path.suffix in SOURCE_SUFFIXES:
                relative = path.relative_to(root).as_posix()
                if relative not in tracked:
                    raise RuntimeIntegrityError("Untracked native source")
                inputs[relative] = hashlib.sha256(path.read_bytes().replace(b"\r\n", b"\n")).hexdigest()
    if not inputs:
        raise RuntimeIntegrityError("Missing native source inventory")
    return tree, inputs


def verify_candidate(root: Path, directory: Path, engine_sha: str,
                     expected_dll: str | None = None, expected_tree: str | None = None) -> dict:
    tree, inputs = validate_checkout(root, engine_sha, expected_tree)
    manifest = strict_json((directory / "candidate-provenance.json").read_bytes())
    binary = directory / Path(NATIVE_PATH).name
    actual = digest(binary)
    if (manifest.get("schema_version") != 1 or manifest.get("kind") != "source-built-windows-candidate"
            or manifest.get("artifact") != NATIVE_PATH or manifest.get("source_commit") != engine_sha
            or manifest.get("build_commit") != engine_sha or manifest.get("source_tree") != tree
            or manifest.get("source_inputs") != inputs or manifest.get("sha256") != actual
            or type(manifest.get("size")) is not int or manifest["size"] != binary.stat().st_size
            or binary.read_bytes()[:2] != b"MZ" or expected_dll and actual != expected_dll
            or (directory / "source-sha.txt").read_text().strip() != engine_sha):
        raise RuntimeIntegrityError("Exact-source Windows candidate identity mismatch")
    sha_line = (directory / "runtime.sha256").read_text().strip()
    if sha_line != actual + "  " + binary.name:
        raise RuntimeIntegrityError("Candidate runtime.sha256 mismatch")
    return manifest


def resolve_runtime(client, engine_sha: str) -> dict:
    if not SHA40.fullmatch(engine_sha):
        raise RuntimeIntegrityError("Invalid exact engine SHA")
    runs = client.get_json(f"/repos/{ENGINE_REPOSITORY}/actions/runs?head_sha={engine_sha}&per_page=100")
    candidates = [r for r in runs.get("workflow_runs", [])
                  if r.get("head_sha") == engine_sha and r.get("head_branch") == "main"
                  and r.get("event") == "push" and r.get("status") == "completed"
                  and r.get("conclusion") == "success" and r.get("path") == ".github/workflows/gdextension.yml"]
    if not candidates:
        raise RuntimeIntegrityError("No successful exact-main native runtime workflow")
    for run in sorted(candidates, key=lambda r: r["id"], reverse=True):
        run_id, attempt = run["id"], run["run_attempt"]
        name = f"native-candidate-windows-{run_id}-{attempt}"
        response = client.get_json(f"/repos/{ENGINE_REPOSITORY}/actions/runs/{run_id}/artifacts?name={name}&per_page=100")
        matches = [a for a in response.get("artifacts", []) if a.get("name") == name and not a.get("expired")]
        if len(matches) != 1:
            continue
        artifact = matches[0]
        verify_artifact_metadata(run, artifact, engine_sha, run_id, attempt)
        return {"run_id": run_id, "attempt": attempt, "artifact_id": artifact["id"],
                "artifact_name": name, "artifact_sha256": artifact["digest"].removeprefix("sha256:"),
                "artifact_size": artifact["size_in_bytes"], "workflow_id": run["workflow_id"],
                "workflow_path": run["path"], "source_branch": "main"}
    raise RuntimeIntegrityError("No available uniquely identified native candidate artifact")


def verify_artifact_metadata(run: dict, artifact: dict, engine_sha: str, run_id: int, attempt: int) -> None:
    name = f"native-candidate-windows-{run_id}-{attempt}"
    if (run.get("id") != run_id or run.get("run_attempt") != attempt
            or run.get("head_sha") != engine_sha or run.get("head_branch") != "main"
            or run.get("event") != "push" or run.get("status") != "completed"
            or run.get("conclusion") != "success" or run.get("path") != ".github/workflows/gdextension.yml"
            or artifact.get("name") != name or artifact.get("expired") is not False
            or artifact.get("workflow_run", {}).get("id") != run_id
            or artifact.get("workflow_run", {}).get("head_sha") != engine_sha
            or not re.fullmatch(r"sha256:[0-9a-f]{64}", artifact.get("digest", ""))
            or not 0 < artifact.get("size_in_bytes", 0) <= 32 * 1024 * 1024):
        raise RuntimeIntegrityError("Wrong, expired or unproven runtime workflow artifact")


def native_environment(extra: dict | None = None) -> dict[str, str]:
    """Allowlist OS essentials; GitHub tokens and every other runner secret stay out."""
    allowed = {"SYSTEMROOT", "WINDIR", "PATH", "TEMP", "TMP", "USERPROFILE", "APPDATA",
               "LOCALAPPDATA", "HOME", "COMSPEC", "PROCESSOR_ARCHITECTURE", "NUMBER_OF_PROCESSORS",
               "OS", "LANG", "LC_ALL"}
    result = {key: value for key, value in os.environ.items() if key.upper() in allowed}
    result.update({"GODOT_SILENCE_ROOT_WARNING": "1", "PYTHONUTF8": "1"})
    if extra:
        result.update({str(k): str(v) for k, v in extra.items()})
    return result


def prepare(plan: dict, engine_root: Path, work_root: Path, client, *,
            candidate_archive: Path | None = None, godot_archive: Path | None = None) -> dict:
    engine = plan["engine"]
    if engine.get("repository") != ENGINE_REPOSITORY:
        raise RuntimeIntegrityError("Unexpected engine authority")
    engine_sha = engine["head_sha"]
    work_root.mkdir(parents=True, exist_ok=True)
    descriptor = plan.get("runtime") or resolve_runtime(client, engine_sha)
    run_id, attempt, artifact_id = descriptor["run_id"], descriptor["attempt"], descriptor["artifact_id"]
    run = client.get_json(f"/repos/{ENGINE_REPOSITORY}/actions/runs/{run_id}")
    artifact = client.get_json(f"/repos/{ENGINE_REPOSITORY}/actions/artifacts/{artifact_id}")
    verify_artifact_metadata(run, artifact, engine_sha, run_id, attempt)
    expected_zip = artifact["digest"].removeprefix("sha256:")
    if descriptor.get("artifact_sha256") != expected_zip or artifact["id"] != artifact_id:
        raise RuntimeIntegrityError("Runtime artifact changed from discovery")
    acquisition = "supplied-official-artifact"
    if candidate_archive is None:
        candidate_archive = work_root / "native-candidate.zip"
        try:
            data = client.get_bytes(f"https://api.github.com/repos/{ENGINE_REPOSITORY}/actions/artifacts/{artifact_id}/zip", max_bytes=32 * 1024 * 1024)
            acquisition = "github-actions-api"
        except Exception as exc:
            # Public read-only mirror is transport only; the authenticated official
            # GitHub artifact digest above is the mandatory trust anchor.
            data = client.get_bytes(f"https://nightly.link/{ENGINE_REPOSITORY}/actions/artifacts/{artifact_id}.zip", max_bytes=32 * 1024 * 1024)
            acquisition = "nightly-link-official-digest-verified"
        candidate_archive.write_bytes(data)
    if candidate_archive.stat().st_size != artifact["size_in_bytes"] or digest(candidate_archive) != expected_zip:
        raise RuntimeIntegrityError("Official runtime artifact digest/size mismatch")
    candidate = work_root / "candidate"
    safe_extract(candidate_archive, candidate, maximum=64 * 1024 * 1024)
    manifest = verify_candidate(engine_root, candidate, engine_sha,
                                descriptor.get("native_dll_sha256"), engine.get("tree_sha"))
    rapier = engine_root / RAPIER_PATH
    rapier_pointer = git(engine_root, "show", "HEAD:" + RAPIER_PATH)
    if rapier_pointer != f"version https://git-lfs.github.com/spec/v1\noid sha256:{RAPIER_SHA256}\nsize 9987072":
        raise RuntimeIntegrityError("Accepted engine selected an unreviewed Rapier runtime")
    if digest(rapier) != RAPIER_SHA256 or rapier.read_bytes()[:2] != b"MZ":
        raise RuntimeIntegrityError("Pinned Rapier LFS runtime is absent or mismatched; materialize it first")
    if godot_archive is None:
        godot_archive = work_root / "godot.zip"
        godot_archive.write_bytes(client.get_bytes(GODOT_URL, max_bytes=MAX_ARCHIVE))
    if digest(godot_archive, "sha512") != GODOT_SHA512:
        raise RuntimeIntegrityError("Official Godot archive SHA-512 mismatch")
    godot_root = work_root / "godot"
    safe_extract(godot_archive, godot_root)
    console = godot_root / "Godot_v4.7-stable_win64_console.exe"
    executable = godot_root / "Godot_v4.7-stable_win64.exe"
    version = subprocess.check_output([str(console.resolve()), "--version"],
                                      env=native_environment(), timeout=30, text=True).strip()
    if version != GODOT_VERSION:
        raise RuntimeIntegrityError("Godot full version mismatch")
    return {"schema": "cybersand-native-runtime-v1", "repository": ENGINE_REPOSITORY,
            "engine_sha": engine_sha, "source_tree_sha": manifest["source_tree"],
            "native_dll_sha256": manifest["sha256"], "rapier_dll_sha256": RAPIER_SHA256,
            "godot_version": version, "godot_archive_sha512": GODOT_SHA512,
            "godot_console_sha256": digest(console), "godot_runtime_sha256": digest(executable),
            "local": {"engine_root": str(engine_root.resolve()), "candidate_dir": str(candidate.resolve()),
                      "native_dll": str((candidate / Path(NATIVE_PATH).name).resolve()),
                      "rapier_dll": str(rapier.resolve()), "godot_console": str(console.resolve()),
                      "godot_runtime": str(executable.resolve())},
            "provenance": {"runtime_run_id": str(run_id), "runtime_attempt": attempt,
                           "workflow_id": run["workflow_id"], "workflow_path": run["path"],
                           "artifact_id": str(artifact_id), "artifact_name": artifact["name"],
                           "artifact_sha256": expected_zip, "acquisition": acquisition,
                           "candidate_manifest_sha256": digest(candidate / "candidate-provenance.json"),
                           "source_inputs": manifest["source_inputs"],
                           "run_url": run.get("html_url", f"https://github.com/{ENGINE_REPOSITORY}/actions/runs/{run_id}")}}


def main() -> int:
    from .github import GitHubClient
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=["prepare"])
    parser.add_argument("--plan", type=Path, required=True)
    parser.add_argument("--engine-root", type=Path, required=True)
    parser.add_argument("--work-root", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--candidate-archive", type=Path)
    parser.add_argument("--godot-archive", type=Path)
    args = parser.parse_args()
    result = prepare(strict_json(args.plan.read_bytes()), args.engine_root, args.work_root,
                     GitHubClient(token=os.environ.get("GITHUB_TOKEN")), candidate_archive=args.candidate_archive, godot_archive=args.godot_archive)
    write_json(args.output, result)
    print(json.dumps({k: result[k] for k in ("engine_sha", "native_dll_sha256", "godot_version")}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
