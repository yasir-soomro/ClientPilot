from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy.engine import make_url


BACKEND_DIRECTORY = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=BACKEND_DIRECTORY / ".env",
        env_file_encoding="utf-8",
    )

    database_url: str
    auth_cookie_secure: bool = False
    auth_session_ttl_hours: int = Field(default=8, ge=1, le=168)
    app_environment: Literal["development", "test", "staging", "production"] = "development"
    development_otp_enabled: bool = False
    email_otp_ttl_minutes: int = Field(default=10, ge=1, le=60)
    email_otp_resend_cooldown_seconds: int = Field(default=60, ge=1, le=3600)
    email_otp_max_attempts: int = Field(default=5, ge=1, le=20)
    email_otp_max_resends_per_hour: int = Field(default=5, ge=1, le=20)
    smtp_host: str | None = None
    smtp_port: int = Field(default=587, ge=1, le=65535)
    smtp_username: str | None = None
    smtp_password: str | None = None
    smtp_from_email: str | None = None
    google_client_id: str | None = None
    google_client_secret: str | None = None
    google_redirect_uri: str = "http://localhost:8000/api/auth/oauth/google/callback"
    github_client_id: str | None = None
    github_client_secret: str | None = None
    github_redirect_uri: str = "http://localhost:8000/api/auth/oauth/github/callback"
    frontend_base_url: str = "http://localhost:3000"

    @field_validator("database_url")
    @classmethod
    def resolve_sqlite_database_path(cls, value: str) -> str:
        database_url = make_url(value)
        database_path = database_url.database
        if (
            database_url.get_backend_name() != "sqlite"
            or database_path is None
            or database_path == ":memory:"
        ):
            return value

        path = Path(database_path)
        if path.is_absolute():
            return value

        resolved_path = (BACKEND_DIRECTORY / path).resolve()
        return database_url.set(database=resolved_path.as_posix()).render_as_string(
            hide_password=False
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()
