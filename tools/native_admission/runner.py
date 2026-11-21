"""Bounded Windows adaptation of Fleet Native Admission v1.4.4's real harness.

Only the coordinator reads GitHub. Workers receive already hashed JSON fixtures,
copy the trusted accepted project, and launch the unchanged donor GDScript.
"""
from __future__ import annotations

import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
import hashlib
import json
import math
import os
from pathlib import Path
import re
import shutil
import signal
import subprocess
import sys
import time
from urllib.parse import quote
import uuid

from .runtime import (GODOT_VERSION, NATIVE_PATH, RAPIER_PATH, RuntimeIntegrityError,
                      digest, git, native_environment, safe_relative, strict_json,
                      validate_checkout, verify_candidate, write_json)

VENDOR = Path(__file__).resolve().parent / "vendor" / "fleet-v1.4.4"
MAX_LOG_BYTES = 8 * 1024 * 1024
MAX_PHASE_SECONDS = 300
JOB_MEMORY_BYTES = 3 * 1024 * 1024 * 1024
MAX_PROJECT_BYTES = 512 * 1024 * 1024
ERROR_PATTERN = re.compile(r"(?im)^\s*(?:SCRIPT ERROR:|ERROR:|USER ERROR:|CANVAS_NATIVE_FAIL\b)|Parse Error:")


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def public_runtime(runtime: dict) -> dict:
    return {key: value for key, value in runtime.items() if key not in {"local", "schema"}}


def fixture_key(identity: dict) -> str:
    fields = [identity[k] for k in ("repository", "pr", "head_sha", "setup_path", "setup_sha256")]
    return hashlib.sha256(json.dumps(fields, separators=(",", ":")).encode()).hexdigest()[:24]


def _integer(value, message: str) -> int:
    if type(value) is not int:
        raise RuntimeIntegrityError(message)
    return value


def material_grid(setup: dict) -> bytes:
    """Independent material-grid digest; catches a different valid saved fixture."""
    if setup.get("version") != 2 or setup.get("extent") != [2048, 1024]:
        raise RuntimeIntegrityError("Expected 2048x1024 Setup-v2")
    edits = setup.get("edits")
    if not isinstance(edits, list) or not 0 < len(edits) <= 32768:
        raise RuntimeIntegrityError("Setup stamp bound exceeded")
    actors = setup.get("actors")
    if not isinstance(actors, list) or len(actors) != 1 or actors[0].get("model") != "midge":
        raise RuntimeIntegrityError("Pilot contract requires exactly one authored Midge actor")
    width, height = setup["extent"]
    grid = bytearray(width * height)
    operations = 0
    for stamp in edits:
        if not isinstance(stamp, list) or len(stamp) not in (4, 5):
            raise RuntimeIntegrityError("Invalid stamp arity")
        if any(type(v) is not int for v in stamp):
            raise RuntimeIntegrityError("Non-integer stamp")
        material = stamp[-1]
        if not 0 <= material <= 131 or material == 10:
            raise RuntimeIntegrityError("Unsupported accepted-engine material")
        if len(stamp) == 5:
            x, y, w, h, _ = stamp
            if x < 0 or y < 0 or w < 1 or h < 1 or x + w > width or y + h > height:
                raise RuntimeIntegrityError("Out-of-bounds rectangle")
            operations += w * h
            if operations > 128 * width * height:
                raise RuntimeIntegrityError("Fixture material expansion budget exceeded")
            row = bytes([material]) * w
            for yy in range(y, y + h):
                grid[yy * width + x: yy * width + x + w] = row
        else:
            x, y, radius, _ = stamp
            if not 0 <= x < width or not 0 <= y < height or not 1 <= radius <= 64:
                raise RuntimeIntegrityError("Out-of-bounds circular stamp")
            operations += (2 * radius + 1) ** 2
            if operations > 128 * width * height:
                raise RuntimeIntegrityError("Fixture material expansion budget exceeded")
            for yy in range(max(0, y - radius), min(height, y + radius + 1)):
                half = math.isqrt(radius * radius - (yy - y) ** 2)
                left, right = max(0, x - half), min(width, x + half + 1)
                grid[yy * width + left: yy * width + right] = bytes([material]) * (right - left)
    return bytes(grid)


class WindowsJob:
    """Nested Windows job caps process-tree memory and kills descendants on close."""
    def __init__(self, process):
        self.handle = None
        if os.name != "nt":
            return
        import ctypes
        from ctypes import wintypes
        class Basic(ctypes.Structure):
            _fields_ = [("PerProcessUserTimeLimit", ctypes.c_longlong), ("PerJobUserTimeLimit", ctypes.c_longlong),
                        ("LimitFlags", wintypes.DWORD), ("MinimumWorkingSetSize", ctypes.c_size_t),
                        ("MaximumWorkingSetSize", ctypes.c_size_t), ("ActiveProcessLimit", wintypes.DWORD),
                        ("Affinity", ctypes.c_size_t), ("PriorityClass", wintypes.DWORD), ("SchedulingClass", wintypes.DWORD)]
        class Counters(ctypes.Structure):
            _fields_ = [(name, ctypes.c_ulonglong) for name in ("ReadOperationCount", "WriteOperationCount", "OtherOperationCount",
                                                              "ReadTransferCount", "WriteTransferCount", "OtherTransferCount")]
        class Extended(ctypes.Structure):
            _fields_ = [("BasicLimitInformation", Basic), ("IoInfo", Counters),
                        ("ProcessMemoryLimit", ctypes.c_size_t), ("JobMemoryLimit", ctypes.c_size_t),
                        ("PeakProcessMemoryUsed", ctypes.c_size_t), ("PeakJobMemoryUsed", ctypes.c_size_t)]
        self.api = ctypes.WinDLL("kernel32", use_last_error=True)
        self.api.CreateJobObjectW.argtypes = [ctypes.c_void_p, wintypes.LPCWSTR]
        self.api.CreateJobObjectW.restype = wintypes.HANDLE
        self.api.SetInformationJobObject.argtypes = [wintypes.HANDLE, ctypes.c_int, ctypes.c_void_p, wintypes.DWORD]
        self.api.AssignProcessToJobObject.argtypes = [wintypes.HANDLE, wintypes.HANDLE]
        self.api.CloseHandle.argtypes = [wintypes.HANDLE]
        self.api.TerminateJobObject.argtypes = [wintypes.HANDLE, wintypes.UINT]
        handle = self.api.CreateJobObjectW(None, None)
        if not handle:
            raise RuntimeIntegrityError("Cannot create bounded Windows process job")
        info = Extended()
        info.BasicLimitInformation.LimitFlags = 0x2000 | 0x200  # KILL_ON_JOB_CLOSE | JOB_MEMORY
        info.JobMemoryLimit = JOB_MEMORY_BYTES
        if (not self.api.SetInformationJobObject(handle, 9, ctypes.byref(info), ctypes.sizeof(info))
                or not self.api.AssignProcessToJobObject(handle, wintypes.HANDLE(int(process._handle)))):
            self.api.CloseHandle(handle)
            raise RuntimeIntegrityError("Cannot enforce Windows process-tree memory limit")
        self.handle = handle

    def close(self):
        if self.handle is not None:
            self.api.CloseHandle(self.handle)
            self.handle = None


class SuspendedWindowsProcess:
    """Create a suspended process with an explicit, per-worker handle allowlist.

    subprocess.Popen closes the primary thread handle before returning, so it
    cannot supply our atomic assign-before-resume contract. These are the Win32
    CreateProcessW/STARTUPINFOEX APIs; no code in the child runs until resume().
    """
    def __init__(self, command, stdout, stderr, environment):
        import ctypes
        from ctypes import wintypes
        import msvcrt
        self.returncode = None
        self._handle = None
        self._thread = None
        self.api = ctypes.WinDLL("kernel32", use_last_error=True)
        class StartupInfo(ctypes.Structure):
            _fields_ = [("cb", wintypes.DWORD), ("lpReserved", wintypes.LPWSTR),
                        ("lpDesktop", wintypes.LPWSTR), ("lpTitle", wintypes.LPWSTR),
                        ("dwX", wintypes.DWORD), ("dwY", wintypes.DWORD),
                        ("dwXSize", wintypes.DWORD), ("dwYSize", wintypes.DWORD),
                        ("dwXCountChars", wintypes.DWORD), ("dwYCountChars", wintypes.DWORD),
                        ("dwFillAttribute", wintypes.DWORD), ("dwFlags", wintypes.DWORD),
                        ("wShowWindow", wintypes.WORD), ("cbReserved2", wintypes.WORD),
                        ("lpReserved2", ctypes.POINTER(ctypes.c_ubyte)),
                        ("hStdInput", wintypes.HANDLE), ("hStdOutput", wintypes.HANDLE),
                        ("hStdError", wintypes.HANDLE)]
        class StartupInfoEx(ctypes.Structure):
            _fields_ = [("StartupInfo", StartupInfo), ("lpAttributeList", ctypes.c_void_p)]
        class ProcessInfo(ctypes.Structure):
            _fields_ = [("hProcess", wintypes.HANDLE), ("hThread", wintypes.HANDLE),
                        ("dwProcessId", wintypes.DWORD), ("dwThreadId", wintypes.DWORD)]
        api = self.api
        api.GetCurrentProcess.restype = wintypes.HANDLE
        api.DuplicateHandle.argtypes = [wintypes.HANDLE, wintypes.HANDLE, wintypes.HANDLE,
                                       ctypes.POINTER(wintypes.HANDLE), wintypes.DWORD,
                                       wintypes.BOOL, wintypes.DWORD]
        api.DuplicateHandle.restype = wintypes.BOOL
        api.InitializeProcThreadAttributeList.argtypes = [ctypes.c_void_p, wintypes.DWORD,
                                                         wintypes.DWORD, ctypes.POINTER(ctypes.c_size_t)]
        api.InitializeProcThreadAttributeList.restype = wintypes.BOOL
        api.UpdateProcThreadAttribute.argtypes = [ctypes.c_void_p, wintypes.DWORD, ctypes.c_size_t,
                                                ctypes.c_void_p, ctypes.c_size_t, ctypes.c_void_p,
                                                ctypes.c_void_p]
        api.UpdateProcThreadAttribute.restype = wintypes.BOOL
        api.DeleteProcThreadAttributeList.argtypes = [ctypes.c_void_p]
        api.DeleteProcThreadAttributeList.restype = None
        api.CreateProcessW.argtypes = [wintypes.LPCWSTR, wintypes.LPWSTR, ctypes.c_void_p,
                                      ctypes.c_void_p, wintypes.BOOL, wintypes.DWORD, ctypes.c_void_p,
                                      wintypes.LPCWSTR, ctypes.c_void_p, ctypes.POINTER(ProcessInfo)]
        api.CreateProcessW.restype = wintypes.BOOL
        api.ResumeThread.argtypes = [wintypes.HANDLE]
        api.ResumeThread.restype = wintypes.DWORD
        api.WaitForSingleObject.argtypes = [wintypes.HANDLE, wintypes.DWORD]
        api.WaitForSingleObject.restype = wintypes.DWORD
        api.GetExitCodeProcess.argtypes = [wintypes.HANDLE, ctypes.POINTER(wintypes.DWORD)]
        api.GetExitCodeProcess.restype = wintypes.BOOL
        api.TerminateProcess.argtypes = [wintypes.HANDLE, wintypes.UINT]
        api.TerminateProcess.restype = wintypes.BOOL
        api.CloseHandle.argtypes = [wintypes.HANDLE]
        api.CloseHandle.restype = wintypes.BOOL
        duplicates = []
        initialized = False
        attributes = None
        try:
            with open(os.devnull, "rb") as devnull:
                current = api.GetCurrentProcess()
                for stream in (devnull, stdout, stderr):
                    handle = wintypes.HANDLE()
                    if not api.DuplicateHandle(current, wintypes.HANDLE(msvcrt.get_osfhandle(stream.fileno())),
                                               current, ctypes.byref(handle), 0, True, 2):
                        raise RuntimeIntegrityError("Cannot duplicate bounded process log handle")
                    duplicates.append(handle.value)
            size = ctypes.c_size_t()
            api.InitializeProcThreadAttributeList(None, 1, 0, ctypes.byref(size))
            if size.value == 0:
                raise RuntimeIntegrityError("Cannot size explicit process handle list")
            attributes = ctypes.create_string_buffer(size.value)
            if not api.InitializeProcThreadAttributeList(attributes, 1, 0, ctypes.byref(size)):
                raise RuntimeIntegrityError("Cannot initialize explicit process handle list")
            initialized = True
            handles = (wintypes.HANDLE * len(duplicates))(*duplicates)
            # PROC_THREAD_ATTRIBUTE_HANDLE_LIST: concurrent workers cannot inherit
            # each other's temporarily inheritable duplicate stdout/stderr handles.
            if not api.UpdateProcThreadAttribute(attributes, 0, 0x20002, handles,
                                                  ctypes.sizeof(handles), None, None):
                raise RuntimeIntegrityError("Cannot restrict inherited process handles")
            startup = StartupInfoEx()
            startup.StartupInfo.cb = ctypes.sizeof(startup)
            startup.StartupInfo.dwFlags = 0x100  # STARTF_USESTDHANDLES
            startup.StartupInfo.hStdInput, startup.StartupInfo.hStdOutput, startup.StartupInfo.hStdError = duplicates
            startup.lpAttributeList = ctypes.cast(attributes, ctypes.c_void_p)
            env_text = "\0".join(f"{key}={value}" for key, value in sorted(environment.items(), key=lambda item: item[0].upper())) + "\0\0"
            environment_block = ctypes.create_unicode_buffer(env_text)
            command_line = ctypes.create_unicode_buffer(subprocess.list2cmdline(command))
            info = ProcessInfo()
            # CREATE_SUSPENDED | CREATE_UNICODE_ENVIRONMENT | EXTENDED_STARTUPINFO_PRESENT.
            if not api.CreateProcessW(str(command[0]), command_line, None, None, True,
                                      0x4 | 0x400 | 0x80000, environment_block,
                                      None, ctypes.byref(startup), ctypes.byref(info)):
                raise RuntimeIntegrityError("Cannot create suspended Windows native process")
            self._handle, self._thread, self.pid = info.hProcess, info.hThread, int(info.dwProcessId)
        finally:
            if initialized:
                api.DeleteProcThreadAttributeList(attributes)
            for handle in duplicates:
                api.CloseHandle(handle)

    def resume(self):
        if self._thread is None or self.api.ResumeThread(self._thread) != 1:
            raise RuntimeIntegrityError("Cannot resume bounded Windows native process")
        self.api.CloseHandle(self._thread)
        self._thread = None

    def poll(self):
        import ctypes
        from ctypes import wintypes
        if self.returncode is not None:
            return self.returncode
        state = self.api.WaitForSingleObject(self._handle, 0)
        if state == 0x102:  # WAIT_TIMEOUT
            return None
        code = wintypes.DWORD()
        if state != 0 or not self.api.GetExitCodeProcess(self._handle, ctypes.byref(code)):
            raise RuntimeIntegrityError("Cannot observe Windows process exit")
        self.returncode = int(code.value)
        return self.returncode

    def wait(self, timeout=None):
        milliseconds = 0xFFFFFFFF if timeout is None else max(0, min(0xFFFFFFFE, int(timeout * 1000)))
        if self.api.WaitForSingleObject(self._handle, milliseconds) == 0x102:
            raise subprocess.TimeoutExpired("bounded Windows process", timeout)
        return self.poll()

    def kill(self):
        if self.poll() is None and not self.api.TerminateProcess(self._handle, 137):
            raise RuntimeIntegrityError("Cannot terminate Windows process")

    def close(self):
        if self._thread is not None:
            self.api.CloseHandle(self._thread)
            self._thread = None
        if self._handle is not None:
            self.api.CloseHandle(self._handle)
            self._handle = None


def start_process(command, stdout, stderr, environment):
    """Return only after the Windows child belongs to its bounded job."""
    if os.name != "nt":
        process = subprocess.Popen(command, stdout=stdout, stderr=stderr, stdin=subprocess.DEVNULL,
                                   env=environment, start_new_session=True)
        return process, WindowsJob(process)
    process = SuspendedWindowsProcess(command, stdout, stderr, environment)
    job = None
    try:
        job = WindowsJob(process)
        process.resume()
        return process, job
    except BaseException:
        process.kill()
        process.wait(timeout=15)
        if job is not None:
            job.close()
        process.close()
        raise


def terminate_tree(process, job=None):
    if job and job.handle is not None:
        job.api.TerminateJobObject(job.handle, 137)
    elif os.name == "nt":
        subprocess.run(["taskkill.exe", "/PID", str(process.pid), "/T", "/F"],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=15,
                       env=native_environment(), check=False)
    else:
        try:
            os.killpg(process.pid, signal.SIGKILL)
        except ProcessLookupError:
            pass
    try:
        process.wait(timeout=15)
    except subprocess.TimeoutExpired:
        process.kill()
        process.wait(timeout=5)


def run_process(command: list[str], stem: Path, environment: dict, *, timeout: int = MAX_PHASE_SECONDS,
                evidence_root: Path | None = None) -> dict:
    if type(timeout) is not int or not 1 <= timeout <= MAX_PHASE_SECONDS:
        raise RuntimeIntegrityError("Process timeout must be bounded integer seconds")
    stem.parent.mkdir(parents=True, exist_ok=True)
    out_path, err_path = stem.with_suffix(".stdout.log"), stem.with_suffix(".stderr.log")
    started = time.monotonic()
    record = {"exit_code": None, "timeout": False, "log_limit_exceeded": False,
              "pid": None, "started_at": utc_now(), "timeout_seconds": timeout,
              "memory_limit_bytes": JOB_MEMORY_BYTES if os.name == "nt" else None}
    process, job = None, None
    with out_path.open("xb") as out, err_path.open("xb") as err:
        try:
            process, job = start_process(command, out, err, environment)
            record["pid"] = process.pid
            while process.poll() is None:
                if time.monotonic() - started > timeout:
                    record["timeout"] = True
                    terminate_tree(process, job)
                    break
                if out_path.stat().st_size > MAX_LOG_BYTES or err_path.stat().st_size > MAX_LOG_BYTES:
                    record["log_limit_exceeded"] = True
                    terminate_tree(process, job)
                    break
                time.sleep(0.1)
            record["exit_code"] = process.wait(timeout=15)
        except BaseException:
            if process is not None:
                terminate_tree(process, job)
            raise
        finally:
            if job is not None:
                job.close()
            if isinstance(process, SuspendedWindowsProcess):
                process.close()
    record.update({"finished_at": utc_now(), "duration_seconds": round(time.monotonic() - started, 3),
                   "stdout": out_path.relative_to(evidence_root).as_posix() if evidence_root else str(out_path),
                   "stderr": err_path.relative_to(evidence_root).as_posix() if evidence_root else str(err_path),
                   "stdout_sha256": digest(out_path), "stderr_sha256": digest(err_path)})
    if out_path.stat().st_size > MAX_LOG_BYTES or err_path.stat().st_size > MAX_LOG_BYTES:
        record["log_limit_exceeded"] = True
    text = out_path.read_text(encoding="utf-8", errors="replace") + "\n" + err_path.read_text(encoding="utf-8", errors="replace")
    record["unexpected_godot_errors"] = bool(ERROR_PATTERN.search(text))
    return record


def parse_marker(stdout: str, marker: str) -> dict:
    matches = re.findall(r"(?m)^" + re.escape(marker) + r"\s+(\{[^\r\n]*\})\r?$", stdout)
    if len(matches) != 1:
        raise RuntimeIntegrityError("Expected exactly one " + marker + " receipt")
    result = strict_json(matches[0])
    if not isinstance(result, dict):
        raise RuntimeIntegrityError("Receipt is not an object")
    return result


def validate_process(record: dict) -> None:
    if (type(record.get("exit_code")) is not int or record["exit_code"] != 0
            or record.get("timeout") is not False or record.get("log_limit_exceeded") is not False
            or record.get("unexpected_godot_errors") is not False):
        raise RuntimeIntegrityError("Native process failed, timed out, exceeded limits or emitted Godot errors")


def validate_receipt(receipt: dict, phase: str, label: str, saved_label: str, rectangle_count: int, midge_id: int,
                     expected_setup_sha256: str) -> None:
    if receipt.get("label") != label or receipt.get("phase") != phase:
        raise RuntimeIntegrityError("Receipt belongs to a different fixture or phase")
    if (receipt.get("active_label") != (label if phase == "load" else saved_label)
            or receipt.get("saved_label") != saved_label or receipt.get("setup_sha256") != expected_setup_sha256
            or type(receipt.get("process_id")) is not int or receipt["process_id"] <= 0):
        raise RuntimeIntegrityError("Native receipt fixture-byte/process custody mismatch")
    # Godot Engine.get_version_info().string omits the official build hash.
    if receipt.get("version") not in {"4.7-stable (official)", "4.7.stable.official", GODOT_VERSION}:
        raise RuntimeIntegrityError("Receipt Godot version mismatch")
    required = ["source_parse", "native_bridge", "load", "full_grid", "published_image", "actor_adopted", "rapier_space_valid"]
    if phase == "load":
        required += ["physics_tick", "midge_drive", "save_readback"]
        if receipt.get("saved_label") != saved_label:
            raise RuntimeIntegrityError("Load receipt saved a different fixture")
        distance = receipt.get("midge_displacement_cells")
        if type(distance) not in (int, float) or not math.isfinite(distance) or distance <= 0.05:
            raise RuntimeIntegrityError("No numerically observed Midge movement")
        start, end = receipt.get("drive_start"), receipt.get("drive_end")
        if (not isinstance(start, list) or not isinstance(end, list) or len(start) != 2 or len(end) != 2
                or any(type(n) not in (int, float) or not math.isfinite(n) for n in start + end)
                or receipt.get("drive_key") != "W" or type(receipt.get("drive_ticks_elapsed")) is not int
                or receipt["drive_ticks_elapsed"] < 20):
            raise RuntimeIntegrityError("Missing directed W input interval evidence")
        directed = receipt.get("directed_up_displacement_cells")
        if (type(directed) not in (int, float) or not math.isfinite(directed) or directed <= 0.05
                or abs((start[1] - end[1]) - directed) > 0.00001):
            raise RuntimeIntegrityError("Midge motion did not follow commanded upward direction")
    elif phase == "reopen":
        required += ["fresh_reopen"]
    else:
        raise RuntimeIntegrityError("Invalid native phase")
    if any(receipt.get(key) is not True for key in required) or receipt.get("worker_failed") is not False:
        raise RuntimeIntegrityError("Native contract fields incomplete or contradictory")
    grid = receipt.get("grid_check", {})
    if (grid.get("ok") is not True or type(grid.get("pixels")) is not int or grid["pixels"] != 2097152
            or type(grid.get("mismatches")) is not int or grid["mismatches"] != 0
            or receipt.get("extent") != [2048, 1024]
            or type(receipt.get("rectangles")) is not int or receipt["rectangles"] != rectangle_count
            or receipt.get("midge_id") != midge_id or receipt.get("collision_observed") is not False
            or receipt.get("errors") != []):
        raise RuntimeIntegrityError("Full grid, Midge identity or failure receipt mismatch")


def validate_runtime_files(runtime: dict) -> None:
    local = runtime["local"]
    for field, expected in (("native_dll", "native_dll_sha256"), ("rapier_dll", "rapier_dll_sha256"),
                            ("godot_console", "godot_console_sha256"), ("godot_runtime", "godot_runtime_sha256")):
        if digest(Path(local[field])) != runtime[expected]:
            raise RuntimeIntegrityError("Runtime changed before native execution: " + field)
    verify_candidate(Path(local["engine_root"]), Path(local["candidate_dir"]), runtime["engine_sha"],
                     runtime["native_dll_sha256"], runtime["source_tree_sha"])


def make_worker(slot: int, work_root: Path, evidence_root: Path, runtime: dict, run_label: str) -> dict:
    engine = Path(runtime["local"]["engine_root"])
    root = work_root / f"worker-{slot}"
    project = root / "project"
    project.mkdir(parents=True, exist_ok=False)
    source_files = git(engine, "ls-files", "--", "godot").splitlines()
    copied = {}
    total = 0
    for relative in source_files:
        safe_relative(relative)
        if relative.startswith("godot/.godot/") or Path(relative).suffix in {".dll", ".so", ".dylib", ".wasm"}:
            continue
        source = engine / relative
        if source.is_symlink() or not source.is_file():
            raise RuntimeIntegrityError("Non-regular project source")
        total += source.stat().st_size
        if total > MAX_PROJECT_BYTES:
            raise RuntimeIntegrityError("Worker project disk budget exceeded")
        destination = project / relative.removeprefix("godot/")
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, destination)
        if digest(source) != digest(destination):
            raise RuntimeIntegrityError("Worker source copy mismatch")
        copied[relative] = digest(destination)
    for path, local_key in ((NATIVE_PATH, "native_dll"), (RAPIER_PATH, "rapier_dll")):
        target = project / path.removeprefix("godot/")
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(runtime["local"][local_key], target)
        copied[path] = digest(target)
    namespace = f"CyberSandNativeCI-{run_label}-worker{slot}"
    config = project / "project.godot"
    original = config.read_text(encoding="utf-8")
    if len(re.findall(r"(?m)^\[application\]$", original)) != 1:
        raise RuntimeIntegrityError("Ambiguous application settings")
    modified = re.sub(r"(?m)^(config/name|config/use_custom_user_dir|config/custom_user_dir_name)=.*\n", "", original)
    modified = modified.replace("[application]", '[application]\nconfig/name="' + namespace + '"\nconfig/use_custom_user_dir=true\nconfig/custom_user_dir_name="' + namespace + '"', 1)
    config.write_text(modified, encoding="utf-8", newline="\n")
    appdata = root / "userdata"
    appdata.mkdir()
    environment = native_environment({"APPDATA": str(appdata.resolve()), "LOCALAPPDATA": str(appdata.resolve()),
                                      "XDG_DATA_HOME": str(appdata.resolve()), "HOME": str(appdata.resolve())})
    output = evidence_root / "workers" / f"worker-{slot}"
    command = [runtime["local"]["godot_console"], "--headless", "--path", str(project.resolve())]
    imported = run_process(command + ["--import"], output / "import", environment, timeout=240, evidence_root=evidence_root)
    write_json(output / "import.json", imported)
    validate_process(imported)
    preflight = run_process(command + ["--script", str((VENDOR / "fleet-preflight.gd").resolve())],
                            output / "preflight", environment, timeout=90, evidence_root=evidence_root)
    write_json(output / "preflight-process.json", preflight)
    validate_process(preflight)
    cap = parse_marker((evidence_root / preflight["stdout"]).read_text(encoding="utf-8"), "FLEET_PREFLIGHT")
    userdir = Path(cap.get("godot_userdir", "")).resolve()
    if (cap.get("native_bridge_available") is not True or cap.get("reported_rectangle_capacity") != 32768
            or cap.get("godot_platform") != "Windows" or namespace not in str(userdir)
            or not userdir.is_relative_to(appdata.resolve()) or userdir.name != "workbench"):
        raise RuntimeIntegrityError("Native capacity or isolated user directory preflight failed")
    userdir.mkdir(parents=True, exist_ok=True)
    write_json(output / "preflight.json", cap)
    write_json(output / "source-manifest.json", {"source_files": copied, "canonical_project_settings_sha256": copied["godot/project.godot"],
               "isolated_project_settings_sha256": digest(config), "override_scope": "application identity only; fresh import cache"})
    return {"slot": slot, "project": project, "userdir": userdir, "environment": environment,
            "command": command, "source_manifest": copied, "settings_sha256": digest(config)}


def native_phase(worker: dict, runtime: dict, label: str, saved_label: str, phase: str,
                 output: Path, evidence_root: Path, rectangle_count: int, midge_id: int,
                 expected_setup_sha256: str) -> dict:
    environment = dict(worker["environment"])
    environment.update({"CYBERSAND_ADMISSION_LABEL": label, "CYBERSAND_ADMISSION_SAVED_LABEL": saved_label,
                        "CYBERSAND_ADMISSION_PHASE": phase})
    process = run_process(worker["command"] + ["--script", str((VENDOR / "native-workbench-admission.gd").resolve())],
                          output / phase, environment, evidence_root=evidence_root)
    write_json(output / (phase + "-process.json"), process)
    validate_process(process)
    receipt = parse_marker((evidence_root / process["stdout"]).read_text(encoding="utf-8"), "CANVAS_NATIVE_EVIDENCE")
    process["receipt"] = receipt
    write_json(output / (phase + "-receipt.json"), receipt)
    validate_receipt(receipt, phase, label, saved_label, rectangle_count, midge_id, expected_setup_sha256)
    return process


def verify_worker_source(worker: dict, runtime: dict) -> None:
    for relative, expected in worker["source_manifest"].items():
        if relative == "godot/project.godot":
            expected = worker["settings_sha256"]
        target = worker["project"] / relative.removeprefix("godot/")
        # Godot import canonicalizes a small number of tracked text .import files.
        if target.suffix == ".import":
            continue
        if digest(target) != expected:
            raise RuntimeIntegrityError("Worker source/runtime drift: " + relative)


def qualify_one(identity: dict, worker: dict, runtime: dict, execution: dict,
                evidence_root: Path, head_before: dict) -> dict:
    started = time.monotonic()
    key = fixture_key(identity)
    output = evidence_root / "maps" / key
    original = output / "original-setup.json"
    label = f"ci-pr{identity['pr']}-{identity['head_sha'][:8]}-{key[:12]}"
    saved_label = label + "-native-copy"
    record = {"schema": "cybersand-native-qualification-v1", "key": key, "map": identity,
              "runtime": public_runtime(runtime), "execution": execution, "status": "FAIL_NATIVE",
              "native_status": "FAIL_NATIVE", "qualification": {"basic_native": "FAIL_NATIVE", "collision": "UNTESTED", "hazards": "UNTESTED", "gui": "UNTESTED"},
              "head_before": head_before, "head_after": None, "load_evidence": None, "reopen_evidence": None,
              "original_setup_path": original.relative_to(evidence_root).as_posix(), "saved_setup_path": None,
              "saved_setup_sha256": None, "worker_id": worker["slot"], "label": label, "saved_label": saved_label,
              "started_at": utc_now(), "error": ""}
    try:
        verify_worker_source(worker, runtime)
        if digest(original) != identity["setup_sha256"] or original.stat().st_size != identity["setup_bytes"]:
            raise RuntimeIntegrityError("Immutable Setup hash/size mismatch")
        setup = strict_json(original.read_bytes())
        grid = material_grid(setup)
        record["expected_grid_sha256"] = hashlib.sha256(grid).hexdigest()
        if len(setup["edits"]) != identity["rectangle_count"]:
            raise RuntimeIntegrityError("Selected rectangle count mismatch")
        midge_id = setup["actors"][0]["id"]
        installed = worker["userdir"] / ("setup-" + label + ".json")
        saved = worker["userdir"] / ("setup-" + saved_label + ".json")
        if installed.exists() or saved.exists():
            raise RuntimeIntegrityError("Refuse overwriting an existing fixture/save")
        shutil.copyfile(original, installed)
        if digest(installed) != identity["setup_sha256"]:
            raise RuntimeIntegrityError("Installed fixture bytes differ")
        record["load_evidence"] = native_phase(worker, runtime, label, saved_label, "load", output, evidence_root,
                                                identity["rectangle_count"], midge_id, identity["setup_sha256"])
        if not saved.is_file() or saved.stat().st_size > 1024 * 1024:
            raise RuntimeIntegrityError("Missing or oversized saved copy")
        saved_hash = digest(saved)
        saved_doc = strict_json(saved.read_bytes())
        if material_grid(saved_doc) != grid or saved_doc["actors"] != setup["actors"]:
            raise RuntimeIntegrityError("Saved copy is not the original authored world/actor fixture")
        shutil.copyfile(saved, output / "saved-setup.json")
        record["saved_setup_sha256"] = saved_hash
        record["saved_setup_path"] = (output / "saved-setup.json").relative_to(evidence_root).as_posix()
        record["reopen_evidence"] = native_phase(worker, runtime, label, saved_label, "reopen", output, evidence_root,
                                                  identity["rectangle_count"], midge_id, saved_hash)
        if (digest(saved) != saved_hash or record["load_evidence"]["pid"] == record["reopen_evidence"]["pid"]
                or record["load_evidence"]["receipt"]["process_id"] == record["reopen_evidence"]["receipt"]["process_id"]):
            raise RuntimeIntegrityError("Saved bytes changed or reopen was not a distinct process")
        if digest(installed) != identity["setup_sha256"]:
            raise RuntimeIntegrityError("Original installed fixture was modified")
        verify_worker_source(worker, runtime)
        record["native_status"] = "PASS_BASIC_NATIVE"
        record["status"] = "NATIVE_PASS_PENDING_HEAD"
        record["qualification"]["basic_native"] = "NATIVE_PASS_PENDING_HEAD"
    except Exception as exc:
        record["error"] = str(exc)[:1500]
    record["finished_at"] = utc_now()
    record["execution"] = {**execution, "finished_at": record["finished_at"]}
    record["duration_seconds"] = round(time.monotonic() - started, 3)
    write_json(output / "qualification.json", record)
    return record


def final_status(native_status: str, before: dict, after: dict) -> str:
    if native_status == "UNTESTED":
        return {"STALE_CONFIRMED": "STALE_CONFIRMED", "CLOSED": "CLOSED"}.get(before.get("state"), "INCOMPLETE")
    if native_status != "PASS_BASIC_NATIVE":
        return "FAIL_NATIVE"
    states = {before.get("state"), after.get("state")}
    if "STALE_CONFIRMED" in states:
        return "STALE_CONFIRMED"
    if "CLOSED" in states:
        return "CLOSED"
    if states != {"VERIFIED_CURRENT"}:
        return "NATIVE_PASS_PENDING_HEAD"
    return "PASS_BASIC_NATIVE"


def execution_identity(client) -> dict:
    if sys.platform != "win32" or os.environ.get("GITHUB_ACTIONS") != "true" or os.environ.get("RUNNER_ENVIRONMENT") != "github-hosted":
        raise RuntimeIntegrityError("Native qualification requires standard GitHub-hosted Windows")
    repository = os.environ.get("GITHUB_REPOSITORY")
    run_id = os.environ.get("GITHUB_RUN_ID", "")
    attempt = os.environ.get("GITHUB_RUN_ATTEMPT", "")
    if repository != "techrote/sandmapsreference" or not run_id.isdigit() or not attempt.isdigit():
        raise RuntimeIntegrityError("Missing trusted workflow execution identity")
    jobs = client.get_json(f"/repos/{repository}/actions/runs/{run_id}/attempts/{attempt}/jobs?per_page=100")
    matches = [j for j in jobs.get("jobs", []) if j.get("runner_name") == os.environ.get("RUNNER_NAME")
               and j.get("status") == "in_progress" and "windows-2022" in j.get("labels", [])]
    if len(matches) != 1:
        raise RuntimeIntegrityError("Cannot prove current standard Windows job identity")
    job = matches[0]
    return {"origin": "github-hosted-windows", "repository": repository, "run_id": run_id,
            "attempt": int(attempt), "workflow_ref": os.environ.get("GITHUB_WORKFLOW_REF"),
            "workflow_sha": os.environ.get("GITHUB_WORKFLOW_SHA"), "job_name": job["name"], "job_id": str(job["id"]),
            "runner_os": os.environ.get("RUNNER_OS"), "runner_environment": os.environ["RUNNER_ENVIRONMENT"],
            "runner_labels": job["labels"], "started_at": utc_now(), "finished_at": None}


def execute(plan: dict, runtime: dict, evidence_root: Path, work_root: Path, client, *, workers: int = 2) -> dict:
    if type(workers) is not int or workers not in (1, 2):
        raise RuntimeIntegrityError("Exactly one or two workers allowed")
    identities = plan.get("maps", [])
    if not 1 <= len(identities) <= 6 or len({fixture_key(m) for m in identities}) != len(identities):
        raise RuntimeIntegrityError("Require one to six unique map/setup identities")
    if runtime["engine_sha"] != plan["engine"]["head_sha"]:
        raise RuntimeIntegrityError("Plan/runtime engine mismatch")
    validate_runtime_files(runtime)
    execution = execution_identity(client)
    if evidence_root.exists() and any(evidence_root.iterdir()):
        raise RuntimeIntegrityError("Evidence output must be a new empty directory")
    evidence_root.mkdir(parents=True, exist_ok=True)
    work_root.mkdir(parents=True, exist_ok=True)
    result = {"schema": "cybersand-native-run-v1", "execution": execution, "runtime": public_runtime(runtime),
              "selection": identities, "records": [], "qualifications": [], "complete": False, "errors": [],
              "limits": {"map_count": len(identities), "max_maps": 6, "workers": min(workers, len(identities)),
                         "phase_timeout_seconds": MAX_PHASE_SECONDS, "process_tree_memory_bytes": JOB_MEMORY_BYTES,
                         "log_bytes_per_stream": MAX_LOG_BYTES, "project_bytes_per_worker": MAX_PROJECT_BYTES},
              "harness": {"origin": "Fleet Native Admission v1.4.4", "native_script_sha256": digest(VENDOR / "native-workbench-admission.gd"),
                          "preflight_script_sha256": digest(VENDOR / "fleet-preflight.gd")}}
    write_json(evidence_root / "run.json", result)
    write_json(evidence_root / "selection.json", plan)
    write_json(evidence_root / "runtime.json", public_runtime(runtime))
    shutil.copyfile(Path(runtime["local"]["candidate_dir"]) / "candidate-provenance.json", evidence_root / "candidate-provenance.json")
    head_before = {}
    try:
        for identity in identities:
            if identity.get("repository") != "techrote/sandmapsreference":
                raise RuntimeIntegrityError("Unexpected fixture repository")
            key = fixture_key(identity)
            head_before[key] = client.verify_pr(identity["repository"], identity["pr"], identity["head_sha"])
            output = evidence_root / "maps" / key
            output.mkdir(parents=True)
            safe_relative(identity["setup_path"])
            url = f"https://raw.githubusercontent.com/{identity['repository']}/{identity['head_sha']}/{quote(identity['setup_path'], safe='/')}"
            data = client.get_bytes(url, max_bytes=1024 * 1024)
            if len(data) != identity["setup_bytes"] or hashlib.sha256(data).hexdigest() != identity["setup_sha256"]:
                raise RuntimeIntegrityError("Selected Setup bytes changed or mismatched")
            if identity.get("setup_blob_sha"):
                blob = hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest()
                if blob != identity["setup_blob_sha"]:
                    raise RuntimeIntegrityError("Selected Setup Git blob mismatch")
            material_grid(strict_json(data))
            (output / "original-setup.json").write_bytes(data)
        run_label = f"{execution['run_id']}-{execution['attempt']}-{uuid.uuid4().hex[:8]}"
        eligible = [m for m in identities if head_before[fixture_key(m)].get("state") == "VERIFIED_CURRENT"]
        for identity in identities:
            key = fixture_key(identity)
            if identity in eligible:
                continue
            before = head_before[key]
            after = client.verify_pr(identity["repository"], identity["pr"], identity["head_sha"])
            status = final_status("UNTESTED", before, after)
            relative = f"maps/{key}/qualification.json"
            record = {"schema": "cybersand-native-qualification-v1", "key": key, "map": identity,
                      "runtime": public_runtime(runtime), "execution": {**execution, "finished_at": utc_now()},
                      "status": status, "native_status": "UNTESTED", "head_before": before, "head_after": after,
                      "qualification": {"basic_native": status, "collision": "UNTESTED", "hazards": "UNTESTED", "gui": "UNTESTED"},
                      "original_setup_path": f"maps/{key}/original-setup.json", "saved_setup_path": None,
                      "saved_setup_sha256": None, "load_evidence": None, "reopen_evidence": None,
                      "error": "Native execution withheld: initial direct PR HEAD not verified current"}
            write_json(evidence_root / relative, record)
            result["qualifications"].append(relative)
            result["records"].append({"map": identity, "status": status, "native_status": "UNTESTED", "qualification_path": relative})
        slots = [make_worker(i + 1, work_root, evidence_root, runtime, run_label) for i in range(min(workers, len(eligible)))]
        if len({str(s["userdir"]).casefold() for s in slots}) != len(slots):
            raise RuntimeIntegrityError("Worker user directories overlap")
        # Each slot owns a serial batch. No simultaneous jobs share imports/user://.
        def batch(slot, selected):
            return [qualify_one(item, slot, runtime, execution, evidence_root, head_before[fixture_key(item)]) for item in selected]
        with ThreadPoolExecutor(max_workers=max(1, len(slots))) as pool:
            futures = [pool.submit(batch, slot, eligible[index::len(slots)]) for index, slot in enumerate(slots)]
            for future in as_completed(futures):
                for record in future.result():
                    identity = record["map"]
                    after = client.verify_pr(identity["repository"], identity["pr"], identity["head_sha"])
                    record["head_after"] = after
                    record["status"] = final_status(record["native_status"], record["head_before"], after)
                    record["qualification"]["basic_native"] = record["status"]
                    relative = f"maps/{record['key']}/qualification.json"
                    write_json(evidence_root / relative, record)
                    result["records"].append({"map": identity, "status": record["status"], "native_status": record["native_status"], "qualification_path": relative})
                    result["qualifications"].append(relative)
                    write_json(evidence_root / "run.json", result)
        validate_runtime_files(runtime)
        result["records"].sort(key=lambda r: fixture_key(r["map"]))
        result["complete"] = len(result["records"]) == len(identities)
    except Exception as exc:
        result["errors"].append(str(exc)[:1500])
    result["execution"]["finished_at"] = utc_now()
    result["publication_status"] = "UNPUBLISHED"
    result["validation_status"] = "COMPLETE" if result["complete"] and not result["errors"] else "INCOMPLETE"
    write_json(evidence_root / "run.json", result)
    return result


def main() -> int:
    from .github import GitHubClient
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--plan", type=Path, required=True)
    parser.add_argument("--runtime", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--work-root", type=Path, required=True)
    parser.add_argument("--workers", type=int, default=2)
    args = parser.parse_args()
    result = execute(strict_json(args.plan.read_bytes()), strict_json(args.runtime.read_bytes()),
                     args.output.resolve(), args.work_root.resolve(), GitHubClient(token=os.environ.get("GITHUB_TOKEN")), workers=args.workers)
    print(json.dumps({"complete": result["complete"], "records": result["records"], "errors": result["errors"]}))
    return 0 if result["complete"] and not result["errors"] and all(r["status"] == "PASS_BASIC_NATIVE" for r in result["records"]) else 2


if __name__ == "__main__":
    raise SystemExit(main())
