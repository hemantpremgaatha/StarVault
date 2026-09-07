import datetime as dt
import json
import secrets

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.challenge_store import pop_challenge, store_challenge
from app.db import get_db
from app.models import Credential, User
from app.schemas import (
    AddCredentialCompleteRequest,
    LoginBeginRequest,
    LoginCompleteRequest,
    ProfileResponse,
    RegisterBeginRequest,
    RegisterCompleteRequest,
    TokenResponse,
)
from app.security import create_access_token, get_current_user
from app.webauthn_service import (
    InvalidAuthenticationResponse,
    InvalidRegistrationResponse,
    b64url_decode,
    b64url_encode,
    build_authentication_options,
    build_registration_options,
    verify_authentication,
    verify_registration,
)

router = APIRouter(prefix="/identity", tags=["identity"])


def _new_starvault_id() -> str:
    # DID-shaped identifier. Not (yet) a registered DID method - see
    # docs/ARCHITECTURE_GAP.md for what's still open around identity.
    return f"did:sv:{secrets.token_hex(16)}"


@router.post("/register/begin")
def register_begin(payload: RegisterBeginRequest, db: Session = Depends(get_db)) -> dict:
    if payload.email and db.scalar(select(User).where(User.email == payload.email)):
        raise HTTPException(status.HTTP_409_CONFLICT, "An account with this email already exists")

    starvault_id = _new_starvault_id()
    options_json, challenge = build_registration_options(starvault_id, payload.display_name, exclude_credential_ids=[])

    flow_id = secrets.token_urlsafe(16)
    store_challenge(
        "register",
        flow_id,
        {
            "challenge": b64url_encode(challenge),
            "starvault_id": starvault_id,
            "display_name": payload.display_name,
            "email": payload.email,
        },
    )
    return {"flow_id": flow_id, "options": json.loads(options_json)}


@router.post("/register/complete", response_model=TokenResponse)
def register_complete(payload: RegisterCompleteRequest, db: Session = Depends(get_db)) -> TokenResponse:
    pending = pop_challenge("register", payload.flow_id)
    if pending is None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Registration flow expired or already used")

    try:
        credential_id, public_key, sign_count = verify_registration(
            payload.credential, b64url_decode(pending["challenge"])
        )
    except InvalidRegistrationResponse as exc:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f"Passkey registration failed: {exc}") from exc

    user = User(id=pending["starvault_id"], display_name=pending["display_name"], email=pending["email"])
    db.add(user)
    db.add(
        Credential(
            id=credential_id,
            user_id=user.id,
            public_key=public_key,
            sign_count=sign_count,
            nickname=payload.nickname,
        )
    )
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, "Account or passkey already registered") from exc

    return TokenResponse(access_token=create_access_token(user.id), starvault_id=user.id)


@router.post("/login/begin")
def login_begin(payload: LoginBeginRequest, db: Session = Depends(get_db)) -> dict:
    user = db.get(User, payload.identifier) or db.scalar(select(User).where(User.email == payload.identifier))
    if user is None or user.status != "active" or not user.credentials:
        # Deliberately vague: don't reveal whether the identifier exists.
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Unable to start sign-in for this identifier")

    credential_ids = [cred.id for cred in user.credentials]
    options_json, challenge = build_authentication_options(credential_ids)

    flow_id = secrets.token_urlsafe(16)
    store_challenge("login", flow_id, {"challenge": b64url_encode(challenge), "user_id": user.id})
    return {"flow_id": flow_id, "options": json.loads(options_json)}


@router.post("/login/complete", response_model=TokenResponse)
def login_complete(payload: LoginCompleteRequest, db: Session = Depends(get_db)) -> TokenResponse:
    pending = pop_challenge("login", payload.flow_id)
    if pending is None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Sign-in flow expired or already used")

    responded_credential_id = payload.credential.get("id")
    credential = db.get(Credential, responded_credential_id)
    if credential is None or credential.user_id != pending["user_id"]:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Passkey not recognized for this account")

    try:
        new_sign_count = verify_authentication(
            payload.credential, b64url_decode(pending["challenge"]), credential.public_key, credential.sign_count
        )
    except InvalidAuthenticationResponse as exc:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f"Sign-in failed: {exc}") from exc

    credential.sign_count = new_sign_count
    credential.last_used_at = dt.datetime.now(dt.timezone.utc)
    db.commit()

    return TokenResponse(access_token=create_access_token(credential.user_id), starvault_id=credential.user_id)


@router.get("/me", response_model=ProfileResponse)
def me(user: User = Depends(get_current_user)) -> User:
    return user


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def deactivate_me(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> None:
    # Soft delete: other services (consent, audit) may hold references to
    # this StarVault ID, so it's disabled rather than removed outright.
    user.status = "disabled"
    db.commit()


@router.post("/me/credentials/begin")
def add_credential_begin(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    existing_ids = [cred.id for cred in user.credentials]
    options_json, challenge = build_registration_options(user.id, user.display_name, exclude_credential_ids=existing_ids)

    flow_id = secrets.token_urlsafe(16)
    store_challenge("add_credential", flow_id, {"challenge": b64url_encode(challenge), "user_id": user.id})
    return {"flow_id": flow_id, "options": json.loads(options_json)}


@router.post("/me/credentials/complete", status_code=status.HTTP_201_CREATED)
def add_credential_complete(
    payload: AddCredentialCompleteRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    pending = pop_challenge("add_credential", payload.flow_id)
    if pending is None or pending["user_id"] != user.id:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Flow expired or already used")

    try:
        credential_id, public_key, sign_count = verify_registration(
            payload.credential, b64url_decode(pending["challenge"])
        )
    except InvalidRegistrationResponse as exc:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f"Passkey registration failed: {exc}") from exc

    db.add(
        Credential(
            id=credential_id,
            user_id=user.id,
            public_key=public_key,
            sign_count=sign_count,
            nickname=payload.nickname,
        )
    )
    db.commit()
    return {"credential_id": credential_id}


@router.delete("/me/credentials/{credential_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_credential(credential_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> None:
    credential = db.get(Credential, credential_id)
    if credential is None or credential.user_id != user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Passkey not found")
    if len(user.credentials) <= 1:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "Can't remove your only passkey - register another one first or you'll be locked out",
        )
    db.delete(credential)
    db.commit()
