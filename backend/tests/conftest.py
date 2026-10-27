from collections.abc import Generator
import os
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import Engine
from sqlalchemy.orm import Session

os.environ["DATABASE_URL"] = "sqlite://"
os.environ["AUTH_COOKIE_SECURE"] = "false"
os.environ["APP_ENVIRONMENT"] = "test"
os.environ["DEVELOPMENT_OTP_ENABLED"] = "true"

from app.db.base import Base
from app.db.session import create_database_engine, get_db
from app.main import app


@pytest.fixture
def test_engine(tmp_path: Path) -> Generator[Engine, None, None]:
    engine = create_database_engine(f"sqlite:///{(tmp_path / 'test.db').as_posix()}")
    Base.metadata.create_all(engine)
    try:
        yield engine
    finally:
        Base.metadata.drop_all(engine)
        engine.dispose()


@pytest.fixture
def db_session(test_engine: Engine) -> Generator[Session, None, None]:
    with Session(test_engine) as session:
        yield session


@pytest.fixture
def api_client(test_engine: Engine) -> Generator[TestClient, None, None]:
    def override_get_db() -> Generator[Session, None, None]:
        with Session(test_engine) as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db
    try:
        with TestClient(app) as client:
            yield client
    finally:
        app.dependency_overrides.pop(get_db, None)
