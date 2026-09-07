"""Thin wrapper around the `webauthn` package (py_webauthn).

Kept separate from the route handlers so the FastAPI layer only deals with
StarVault concepts (StarVault ID, Credential rows) and this module owns the
WebAuthn ceremony details. Written against webauthn>=2.2 - if the installed
version's API has drifted, this is the one file that needs updating.
"""

import base64
import json

from webauthn import (
    generate_authentication_options,
    generate_registration_options,
    options_to_json,
    verify_authentication_response,
    verify_registration_response,
)
from webauthn.helpers.exceptions import InvalidAuthenticationResponse, InvalidRegistrationResponse
from webauthn.helpers.structs import (
    AttestationConveyancePreference,
    AuthenticatorSelectionCriteria,
    PublicKeyCredentialDescriptor,
    ResidentKeyRequirement,
    UserVerificationRequirement,
)

from app.config import settings


def b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def b64url_decode(data: str) -> bytes:
    padding = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + padding)


def build_registration_options(starvault_id: str, display_name: str, exclude_credential_ids: list[str]) -> tuple[str, bytes]:
    """Returns (options_json, raw_challenge_bytes)."""
    options = generate_registration_options(
        rp_id=settings.rp_id,
        rp_name=settings.rp_name,
        user_id=starvault_id.encode("utf-8"),
        user_name=starvault_id,
        user_display_name=display_name,
        attestation=AttestationConveyancePreference.NONE,
        authenticator_selection=AuthenticatorSelectionCriteria(
            resident_key=ResidentKeyRequirement.PREFERRED,
            user_verification=UserVerificationRequirement.PREFERRED,
        ),
        exclude_credentials=[
            PublicKeyCredentialDescriptor(id=b64url_decode(cred_id)) for cred_id in exclude_credential_ids
        ],
    )
    return options_to_json(options), options.challenge


def verify_registration(credential: dict, expected_challenge: bytes) -> tuple[str, bytes, int]:
    """Returns (credential_id_b64url, public_key_bytes, sign_count). Raises InvalidRegistrationResponse on failure."""
    verified = verify_registration_response(
        credential=json.dumps(credential),
        expected_challenge=expected_challenge,
        expected_rp_id=settings.rp_id,
        expected_origin=settings.rp_origin,
    )
    return b64url_encode(verified.credential_id), verified.credential_public_key, verified.sign_count


def build_authentication_options(allow_credential_ids: list[str]) -> tuple[str, bytes]:
    options = generate_authentication_options(
        rp_id=settings.rp_id,
        user_verification=UserVerificationRequirement.PREFERRED,
        allow_credentials=[
            PublicKeyCredentialDescriptor(id=b64url_decode(cred_id)) for cred_id in allow_credential_ids
        ],
    )
    return options_to_json(options), options.challenge


def verify_authentication(credential: dict, expected_challenge: bytes, public_key: bytes, current_sign_count: int) -> int:
    """Returns the new sign count. Raises InvalidAuthenticationResponse on failure."""
    verified = verify_authentication_response(
        credential=json.dumps(credential),
        expected_challenge=expected_challenge,
        expected_rp_id=settings.rp_id,
        expected_origin=settings.rp_origin,
        credential_public_key=public_key,
        credential_current_sign_count=current_sign_count,
    )
    return verified.new_sign_count


__all__ = [
    "InvalidRegistrationResponse",
    "InvalidAuthenticationResponse",
    "build_registration_options",
    "verify_registration",
    "build_authentication_options",
    "verify_authentication",
    "b64url_encode",
    "b64url_decode",
]
