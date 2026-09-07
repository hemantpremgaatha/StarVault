"""Smoke tests that don't require a live Postgres/Redis.

Full WebAuthn ceremony testing needs a virtual authenticator and is out of
scope here - run through the endpoints manually (or with a browser-based
e2e test against the real frontend) before treating this as verified.
"""

from fastapi.testclient import TestClient

from app.main import app
from app.routers.identity import _new_starvault_id

client = TestClient(app)


def test_health():
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json() == {"ok": True, "service": "identity"}


def test_me_requires_auth():
    resp = client.get("/identity/me")
    assert resp.status_code == 401


def test_me_rejects_garbage_token():
    resp = client.get("/identity/me", headers={"Authorization": "Bearer not-a-real-jwt"})
    assert resp.status_code == 401


def test_starvault_id_shape():
    sv_id = _new_starvault_id()
    assert sv_id.startswith("did:sv:")
    assert len(sv_id) == len("did:sv:") + 32
    int(sv_id.removeprefix("did:sv:"), 16)  # raises if not hex
