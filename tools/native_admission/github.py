"""Bounded, read-only GitHub transport for native-admission evidence.

Credentials are sent only to api.github.com and are removed on every redirect.
No response body, URL query, token or underlying exception is included in errors.
"""
from __future__ import annotations

import base64
import binascii
import hashlib
import json
import math
import re
import time
from datetime import datetime, timezone
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener

API_ROOT = "https://api.github.com"
SHA_RE = re.compile(r"[0-9a-f]{40}\Z")
REPO_RE = re.compile(r"[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+\Z")


class GitHubError(RuntimeError):
    """A sanitized failure, suitable for inclusion in public evidence."""

    def __init__(self, code: str, message: str, status: int | None = None):
        self.code = code
        self.status = status
        super().__init__(f"{code}: {message}")


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def repository_name(value: str) -> str:
    if not isinstance(value, str) or not REPO_RE.fullmatch(value) or ".." in value:
        raise GitHubError("INVALID_REPOSITORY", "expected owner/repository")
    return value


def commit_sha(value: str) -> str:
    if not isinstance(value, str) or not SHA_RE.fullmatch(value):
        raise GitHubError("INVALID_SHA", "expected full lowercase Git SHA")
    return value


def _no_duplicates(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError("duplicate JSON key")
        result[key] = value
    return result


def strict_json(data: bytes, *, max_bytes: int = 8 * 1024 * 1024,
                max_depth: int = 40, max_nodes: int = 500000):
    if not isinstance(data, bytes) or len(data) > max_bytes:
        raise GitHubError("JSON_LIMIT", "JSON byte limit exceeded")
    try:
        result = json.loads(data.decode("utf-8"), object_pairs_hook=_no_duplicates,
                            parse_constant=lambda _: (_ for _ in ()).throw(ValueError("nonfinite")))
        stack = [(result, 0)]
        count = 0
        while stack:
            value, depth = stack.pop()
            count += 1
            if depth > max_depth or count > max_nodes:
                raise ValueError("JSON structural limit")
            if isinstance(value, float) and not math.isfinite(value):
                raise ValueError("nonfinite JSON number")
            if isinstance(value, dict):
                stack.extend((item, depth + 1) for item in value.values())
            elif isinstance(value, list):
                stack.extend((item, depth + 1) for item in value)
        return result
    except (ValueError, UnicodeError, RecursionError, OverflowError):
        raise GitHubError("JSON_INVALID", "invalid, duplicate-key or excessive JSON") from None


def _safe_url(url: str) -> str:
    if not isinstance(url, str) or len(url) > 16384 or any(ord(c) < 32 for c in url):
        raise GitHubError("UNSAFE_URL", "invalid download URL")
    try:
        parsed = urlsplit(url)
    except ValueError:
        raise GitHubError("UNSAFE_URL", "invalid download URL") from None
    host = parsed.hostname or ""
    allowed = host in {"api.github.com", "github.com", "raw.githubusercontent.com",
                       "codeload.github.com", "objects.githubusercontent.com",
                       "release-assets.githubusercontent.com", "nightly.link"}
    allowed = allowed or host.endswith(".blob.core.windows.net") or host.endswith(".actions.githubusercontent.com")
    try:
        port_ok = parsed.port in (None, 443)
    except ValueError:
        port_ok = False
    if (parsed.scheme != "https" or not allowed or not port_ok or parsed.username is not None
            or parsed.password is not None or parsed.fragment or "\\" in url):
        raise GitHubError("UNSAFE_URL", "download host or scheme is not allowed")
    return url


class _SafeRedirect(HTTPRedirectHandler):
    def __init__(self, count_request):
        self.count_request = count_request

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        _safe_url(newurl)
        self.count_request()
        redirected = super().redirect_request(req, fp, code, msg, headers, newurl)
        if redirected is not None:
            for name in ("Authorization", "Cookie", "Proxy-Authorization"):
                redirected.remove_header(name)
        return redirected


class GitHubClient:
    def __init__(self, token: str | None = None, *, max_requests: int = 120,
                 timeout: int = 20, retries: int = 2, opener=None, sleeper=time.sleep):
        if (type(max_requests) is not int or not 1 <= max_requests <= 500
                or type(timeout) is not int or not 1 <= timeout <= 20
                or type(retries) is not int or not 0 <= retries <= 2):
            raise ValueError("invalid GitHub resource limits")
        if token is not None and (not isinstance(token, str) or any(c in token for c in "\r\n")):
            raise ValueError("invalid token")
        self._token = token
        self.max_requests = max_requests
        self.timeout = timeout
        self.retries = retries
        self.request_count = 0
        self._sleep = sleeper
        self._opener = opener or build_opener(_SafeRedirect(self._count_request))

    def _count_request(self):
        if self.request_count >= self.max_requests:
            raise GitHubError("REQUEST_LIMIT", "GitHub request budget exhausted")
        self.request_count += 1

    def get_bytes(self, url: str, max_bytes: int = 8 * 1024 * 1024) -> bytes:
        _safe_url(url)
        if type(max_bytes) is not int or not 1 <= max_bytes <= 512 * 1024 * 1024:
            raise ValueError("invalid response byte budget")
        for attempt in range(self.retries + 1):
            self._count_request()
            headers = {"Accept": "application/vnd.github+json", "User-Agent": "CyberSand-Native-Admission/1",
                       "X-GitHub-Api-Version": "2022-11-28"}
            if self._token and urlsplit(url).hostname == "api.github.com":
                headers["Authorization"] = "Bearer " + self._token
            try:
                request = Request(url, headers=headers, method="GET")
                with self._opener.open(request, timeout=self.timeout) as response:
                    declared = response.headers.get("Content-Length")
                    if declared and declared.isdigit() and int(declared) > max_bytes:
                        raise GitHubError("RESPONSE_TOO_LARGE", "download exceeds byte budget")
                    chunks = []
                    size = 0
                    while True:
                        chunk = response.read(min(65536, max_bytes + 1 - size))
                        if not chunk:
                            break
                        size += len(chunk)
                        if size > max_bytes:
                            raise GitHubError("RESPONSE_TOO_LARGE", "download exceeds byte budget")
                        chunks.append(chunk)
                    return b"".join(chunks)
            except HTTPError as exc:
                status = exc.code
                limited = status == 429 or (status == 403 and (exc.headers.get("X-RateLimit-Remaining") == "0"
                                                                              or exc.headers.get("Retry-After") is not None))
                retryable = limited or status in {500, 502, 503, 504}
                exc.close()
                if retryable and attempt < self.retries:
                    self._sleep(min(2.0, 0.5 * (2 ** attempt)))
                    continue
                code = "RATE_LIMITED" if limited else f"HTTP_{status}"
                raise GitHubError(code, "GitHub request did not succeed", status) from None
            except (URLError, TimeoutError, OSError):
                if attempt < self.retries:
                    self._sleep(min(2.0, 0.5 * (2 ** attempt)))
                    continue
                raise GitHubError("NETWORK_ERROR", "GitHub request could not be verified") from None
        raise AssertionError("unreachable")

    def get_json(self, path: str, max_bytes: int = 8 * 1024 * 1024):
        if not isinstance(path, str) or not path.startswith("/") or path.startswith("//"):
            raise GitHubError("INVALID_API_PATH", "expected relative GitHub API path")
        return strict_json(self.get_bytes(API_ROOT + path, max_bytes=max_bytes), max_bytes=max_bytes)

    def pages(self, path: str, *, max_pages: int = 10, per_page: int = 100) -> list:
        if type(max_pages) is not int or not 1 <= max_pages <= 20 or not 1 <= per_page <= 100:
            raise ValueError("invalid pagination budget")
        parsed = urlsplit(path)
        query = [(k, v) for k, v in parse_qsl(parsed.query) if k not in {"page", "per_page"}]
        result = []
        for page in range(1, max_pages + 1):
            page_path = urlunsplit(("", "", parsed.path,
                                   urlencode(query + [("per_page", per_page), ("page", page)]), ""))
            data = self.get_json(page_path)
            if not isinstance(data, list) or len(data) > per_page:
                raise GitHubError("PAGINATION_INVALID", "expected a bounded GitHub list")
            result.extend(data)
            if len(data) < per_page:
                return result
        raise GitHubError("PAGINATION_LIMIT", "complete inventory could not be established")

    def fetch_blob(self, repository: str, sha: str, max_bytes: int = 1024 * 1024) -> bytes:
        repository_name(repository)
        commit_sha(sha)
        envelope = self.get_json(f"/repos/{repository}/git/blobs/{sha}", max_bytes=max_bytes * 2 + 4096)
        if (not isinstance(envelope, dict) or envelope.get("sha") != sha
                or envelope.get("encoding") != "base64" or not isinstance(envelope.get("content"), str)
                or type(envelope.get("size")) is not int or not 0 <= envelope["size"] <= max_bytes):
            raise GitHubError("BLOB_INVALID", "invalid immutable Git blob response")
        try:
            data = base64.b64decode("".join(envelope["content"].split()), validate=True)
        except (ValueError, binascii.Error):
            raise GitHubError("BLOB_INVALID", "invalid immutable Git blob encoding") from None
        actual = hashlib.sha1(b"blob " + str(len(data)).encode("ascii") + b"\0" + data).hexdigest()
        if len(data) != envelope["size"] or len(data) > max_bytes or actual != sha:
            raise GitHubError("BLOB_MISMATCH", "immutable Git blob identity mismatch")
        return data

    def verify_pr(self, repository: str, pr: int, head_sha: str) -> dict:
        repository_name(repository)
        commit_sha(head_sha)
        if type(pr) is not int or pr < 1:
            raise ValueError("invalid pull request number")
        result = {"state": "UNVERIFIED", "expected_head_sha": head_sha,
                  "observed_head_sha": None, "checked_at": utc_now(), "diagnostic": None}
        try:
            data = self.get_json(f"/repos/{repository}/pulls/{pr}")
            if (not isinstance(data, dict) or type(data.get("number")) is not int or data.get("number") != pr
                    or data.get("base", {}).get("repo", {}).get("full_name") != repository
                    or data.get("state") not in {"open", "closed"}):
                raise GitHubError("PR_RESPONSE_INVALID", "direct PR response was incomplete")
            actual = commit_sha(data.get("head", {}).get("sha"))
            result.update(observed_head_sha=actual, draft=data.get("draft"), pr_state=data["state"])
            result["state"] = ("CLOSED" if data["state"] == "closed" else
                               "VERIFIED_CURRENT" if actual == head_sha else "STALE_CONFIRMED")
        except (GitHubError, TypeError, AttributeError) as exc:
            result["diagnostic"] = exc.code if isinstance(exc, GitHubError) else "PR_RESPONSE_INVALID"
        return result


def final_status(native_pass: bool, verification: dict) -> str:
    """A network failure cannot manufacture either stale or basic-native PASS."""
    if native_pass is not True:
        return "FAIL_NATIVE"
    state = verification.get("state")
    return {"VERIFIED_CURRENT": "PASS_BASIC_NATIVE", "STALE_CONFIRMED": "STALE_CONFIRMED",
            "CLOSED": "CLOSED"}.get(state, "NATIVE_PASS_PENDING_HEAD")


GitHub = GitHubClient
