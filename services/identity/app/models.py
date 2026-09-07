import datetime as dt

from sqlalchemy import ForeignKey, LargeBinary, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class User(Base):
    __tablename__ = "users"

    # The StarVault ID: a DID-shaped identifier, e.g. "did:sv:<32 hex chars>".
    # This is the identity other services (consent, audit, ...) reference.
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    display_name: Mapped[str] = mapped_column(String(120))
    # Recovery/contact address, not a login credential - auth is passkey-only.
    email: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="active")
    created_at: Mapped[dt.datetime] = mapped_column(default=lambda: dt.datetime.now(dt.timezone.utc))

    credentials: Mapped[list["Credential"]] = relationship(back_populates="user", cascade="all, delete-orphan")


class Credential(Base):
    """A single registered passkey/authenticator for a user.

    A user can hold more than one (phone + laptop + hardware key) - that is
    the closest thing this service has to a key-recovery story today: losing
    one authenticator doesn't lock the account out as long as another
    registered credential survives. See docs/ARCHITECTURE_GAP.md.
    """

    __tablename__ = "credentials"

    # WebAuthn credential ID, base64url-encoded, as returned by the authenticator.
    id: Mapped[str] = mapped_column(String(255), primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    public_key: Mapped[bytes] = mapped_column(LargeBinary)
    sign_count: Mapped[int] = mapped_column(default=0)
    transports: Mapped[str | None] = mapped_column(String(120), nullable=True)
    nickname: Mapped[str | None] = mapped_column(String(80), nullable=True)
    created_at: Mapped[dt.datetime] = mapped_column(default=lambda: dt.datetime.now(dt.timezone.utc))
    last_used_at: Mapped[dt.datetime | None] = mapped_column(nullable=True)

    user: Mapped[User] = relationship(back_populates="credentials")
