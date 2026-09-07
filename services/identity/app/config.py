from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+psycopg://starvault:starvault@localhost:5432/starvault"
    redis_url: str = "redis://localhost:6379/0"

    jwt_secret: str = "dev-secret-change-me"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60

    # WebAuthn relying party config. rp_id must be a domain the browser is
    # actually served from (no scheme/port) - "localhost" for local dev.
    rp_id: str = "localhost"
    rp_name: str = "StarVault"
    rp_origin: str = "http://localhost:3000"

    challenge_ttl_seconds: int = 300


settings = Settings()
