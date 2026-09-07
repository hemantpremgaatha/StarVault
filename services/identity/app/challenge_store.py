import json

import redis

from app.config import settings

_redis = redis.from_url(settings.redis_url, decode_responses=True)


def _key(namespace: str, flow_id: str) -> str:
    return f"identity:challenge:{namespace}:{flow_id}"


def store_challenge(namespace: str, flow_id: str, data: dict) -> None:
    _redis.set(_key(namespace, flow_id), json.dumps(data), ex=settings.challenge_ttl_seconds)


def pop_challenge(namespace: str, flow_id: str) -> dict | None:
    """Read and delete in one shot - a WebAuthn challenge is single-use."""
    key = _key(namespace, flow_id)
    pipe = _redis.pipeline()
    pipe.get(key)
    pipe.delete(key)
    raw, _ = pipe.execute()
    if raw is None:
        return None
    return json.loads(raw)
