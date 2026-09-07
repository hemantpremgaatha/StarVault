import datetime as dt

from pydantic import BaseModel, EmailStr


class RegisterBeginRequest(BaseModel):
    display_name: str
    email: EmailStr | None = None


class RegisterCompleteRequest(BaseModel):
    flow_id: str
    credential: dict
    nickname: str | None = None


class LoginBeginRequest(BaseModel):
    identifier: str  # StarVault ID or email


class LoginCompleteRequest(BaseModel):
    flow_id: str
    credential: dict


class AddCredentialCompleteRequest(BaseModel):
    flow_id: str
    credential: dict
    nickname: str | None = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    starvault_id: str


class CredentialOut(BaseModel):
    id: str
    nickname: str | None
    created_at: dt.datetime
    last_used_at: dt.datetime | None

    model_config = {"from_attributes": True}


class ProfileResponse(BaseModel):
    id: str
    display_name: str
    email: EmailStr | None
    status: str
    created_at: dt.datetime
    credentials: list[CredentialOut]

    model_config = {"from_attributes": True}
