import base64
import hashlib
from io import BytesIO
import json
import unittest
from urllib.error import HTTPError, URLError
from urllib.request import Request

from tools.native_admission.github import GitHubClient, GitHubError, _SafeRedirect, final_status, strict_json


class Response(BytesIO):
    def __init__(self, data, headers=None):
        super().__init__(data)
        self.headers = headers or {}


class ScriptedOpener:
    def __init__(self, *replies):
        self.replies = list(replies)
        self.requests = []

    def open(self, request, timeout):
        self.requests.append((request, timeout))
        reply = self.replies.pop(0)
        if isinstance(reply, Exception):
            raise reply
        return Response(json.dumps(reply).encode() if not isinstance(reply, bytes) else reply)


def pr_response(head="a" * 40, state="open"):
    return {"number": 25, "state": state, "draft": True, "head": {"sha": head},
            "base": {"repo": {"full_name": "techrote/sandmapsreference"}}}


class GitHubTests(unittest.TestCase):
    def test_token_only_on_api_and_no_env_dump(self):
        opener = ScriptedOpener({}, b"raw")
        client = GitHubClient("private-test-token", opener=opener)
        client.get_json("/repos/techrote/sandmapsreference")
        client.get_bytes("https://raw.githubusercontent.com/techrote/sandmapsreference/a/README.md")
        self.assertEqual(opener.requests[0][0].get_header("Authorization"), "Bearer private-test-token")
        self.assertIsNone(opener.requests[1][0].get_header("Authorization"))
        self.assertEqual(opener.requests[0][1], 20)

    def test_redirect_strips_credentials_and_counts(self):
        count = []
        handler = _SafeRedirect(lambda: count.append(True))
        request = Request("https://api.github.com/repos/a/b/actions/artifacts/1/zip",
                          headers={"Authorization": "Bearer SECRET", "Cookie": "SECRET"})
        redirected = handler.redirect_request(request, None, 302, "redirect", {},
                                               "https://example.blob.core.windows.net/signed.zip?sig=SECRET")
        self.assertIsNone(redirected.get_header("Authorization"))
        self.assertIsNone(redirected.get_header("Cookie"))
        self.assertEqual(len(count), 1)
        with self.assertRaises(GitHubError):
            handler.redirect_request(request, None, 302, "redirect", {}, "http://169.254.169.254/secret")

    def test_untrusted_hosts_and_userinfo_rejected(self):
        client = GitHubClient(opener=ScriptedOpener())
        for url in ("https://api.github.com.evil.test/a", "https://SECRET@api.github.com/a",
                    "file:///tmp/a", "https://api.github.com:8080/a", "https://[broken/a"):
            with self.subTest(url=url), self.assertRaises(GitHubError):
                client.get_bytes(url)
        self.assertEqual(client.request_count, 0)

    def test_rate_limit_is_unverified_never_stale(self):
        responses = [HTTPError("https://api.github.com/SECRET", 403, "SECRET", {"X-RateLimit-Remaining": "0"}, None)
                     for _ in range(3)]
        client = GitHubClient(opener=ScriptedOpener(*responses), sleeper=lambda _: None)
        result = client.verify_pr("techrote/sandmapsreference", 25, "a" * 40)
        self.assertEqual(result["state"], "UNVERIFIED")
        self.assertEqual(result["diagnostic"], "RATE_LIMITED")
        self.assertEqual(client.request_count, 3)
        self.assertNotIn("SECRET", json.dumps(result))
        self.assertEqual(final_status(True, result), "NATIVE_PASS_PENDING_HEAD")

    def test_head_closed_changed_current_and_missing(self):
        client = GitHubClient(opener=ScriptedOpener(pr_response(), pr_response("b" * 40),
                                                  pr_response(state="closed"), {}))
        states = [client.verify_pr("techrote/sandmapsreference", 25, "a" * 40)["state"] for _ in range(4)]
        self.assertEqual(states, ["VERIFIED_CURRENT", "STALE_CONFIRMED", "CLOSED", "UNVERIFIED"])
        self.assertEqual(final_status(False, {"state": "VERIFIED_CURRENT"}), "FAIL_NATIVE")
        self.assertEqual(final_status(True, {"state": "STALE_CONFIRMED"}), "STALE_CONFIRMED")
        self.assertEqual(final_status(True, {"state": "CLOSED"}), "CLOSED")

    def test_wrong_pr_repository_and_malformed_head_are_unverified(self):
        for mutation in ({"number": 26}, {"head": None}, {"base": {"repo": {"full_name": "other/repo"}}}):
            response = pr_response()
            response.update(mutation)
            client = GitHubClient(opener=ScriptedOpener(response))
            self.assertEqual(client.verify_pr("techrote/sandmapsreference", 25, "a" * 40)["state"], "UNVERIFIED")

    def test_request_and_response_limits(self):
        client = GitHubClient(max_requests=1, opener=ScriptedOpener({}, {}))
        client.get_json("/a")
        with self.assertRaisesRegex(GitHubError, "REQUEST_LIMIT"):
            client.get_json("/b")
        with self.assertRaisesRegex(GitHubError, "RESPONSE_TOO_LARGE"):
            GitHubClient(opener=ScriptedOpener(b"12345")).get_bytes("https://api.github.com/a", max_bytes=4)

    def test_unavailable_request_hides_sensitive_details(self):
        client = GitHubClient(opener=ScriptedOpener(URLError("token=SECRET")), retries=0)
        with self.assertRaises(GitHubError) as caught:
            client.get_json("/a")
        self.assertNotIn("SECRET", str(caught.exception))

    def test_json_duplicate_nonfinite_deep_and_oversized_fail(self):
        for data in (b'{"a":1,"a":2}', b'{"a":NaN}', b'{"a":1e999}', b"[" * 50 + b"0" + b"]" * 50):
            with self.subTest(data=data[:30]), self.assertRaises(GitHubError):
                strict_json(data)
        with self.assertRaises(GitHubError):
            strict_json(b"12345", max_bytes=4)

    def test_blob_validates_git_identity_and_size(self):
        raw = b'{"version":2}\n'
        sha = hashlib.sha1(b"blob " + str(len(raw)).encode() + b"\0" + raw).hexdigest()
        envelope = {"sha": sha, "encoding": "base64", "size": len(raw), "content": base64.b64encode(raw).decode()}
        client = GitHubClient(opener=ScriptedOpener(envelope))
        self.assertEqual(client.fetch_blob("techrote/sandmapsreference", sha), raw)
        envelope["content"] = base64.b64encode(b"X" * len(raw)).decode()
        with self.assertRaisesRegex(GitHubError, "BLOB_MISMATCH"):
            GitHubClient(opener=ScriptedOpener(envelope)).fetch_blob("techrote/sandmapsreference", sha)

    def test_pagination_never_silently_truncates(self):
        client = GitHubClient(opener=ScriptedOpener([1, 2], [3]))
        self.assertEqual(client.pages("/repos/a/b/pulls?state=open", per_page=2, max_pages=2), [1, 2, 3])
        with self.assertRaisesRegex(GitHubError, "PAGINATION_LIMIT"):
            GitHubClient(opener=ScriptedOpener([1, 2])).pages("/repos/a/b/pulls", per_page=2, max_pages=1)


if __name__ == "__main__":
    unittest.main()
