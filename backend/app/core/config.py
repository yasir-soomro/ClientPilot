from functools import lru_cache
from pathlib import Path

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
