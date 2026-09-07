import datetime as dt

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.config import settings
from app.db import get_db
from app.models import User

_bearer = HTTPBearer(auto_error=False)


def create_access_token(user_id: str) -> str:
    now = dt.datetime.now(dt.timezone.utc)
    payload = {
        "sub": user_id,
        "iat": now,
        "exp": now + dt.timedelta(minutes=settings.jwt_expire_minutes),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
    db: Session = Depends(get_db),
) -> User:
    unauthorized = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    if credentials is None:
        raise unauthorized
    try:
        payload = jwt.decode(credentials.credentials, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except JWTError as exc:
        raise unauthorized from exc

    user_id = payload.get("sub")
    user = db.get(User, user_id) if user_id else None
    if user is None or user.status != "active":
        raise unauthorized
    return user
