from collections.abc import Generator
from pathlib import Path

import pytest
from sqlalchemy import Engine, inspect, text
from sqlalchemy.engine import make_url
from sqlalchemy.orm import Session, sessionmaker

import app.db.session as database_session
from app.core.config import Settings
from app.db.session import create_database_engine


@pytest.fixture
def sqlite_engine(tmp_path: Path) -> Generator[Engine, None, None]:
    database_path = tmp_path / "test.db"
    engine = create_database_engine(f"sqlite:///{database_path.as_posix()}")
    try:
        yield engine
    finally:
        engine.dispose()


def test_database_url_is_read_from_environment(monkeypatch: pytest.MonkeyPatch) -> None:
    database_name = "configured-from-environment.db"
    database_url = f"sqlite:///{database_name}"
    monkeypatch.setenv("DATABASE_URL", database_url)

    settings = Settings(_env_file=None)

    expected_path = (Path(__file__).resolve().parents[1] / database_name).as_posix()
    assert make_url(settings.database_url).database == expected_path


def test_relative_sqlite_url_is_independent_of_working_directory(
    monkeypatch: pytest.MonkeyPatch, tmp_path: Path
) -> None:
    monkeypatch.chdir(tmp_path)
    settings = Settings(_env_file=None, database_url="sqlite:///./clientpilot.db")

    expected_path = (
        Path(__file__).resolve().parents[1] / "clientpilot.db"
    ).as_posix()
    assert make_url(settings.database_url).database == expected_path


def test_database_engine_connects_to_sqlite(sqlite_engine: Engine) -> None:
    with sqlite_engine.connect() as connection:
        assert connection.scalar(text("SELECT 1")) == 1
        assert connection.scalar(text("PRAGMA foreign_keys")) == 1


def test_database_dependency_closes_session(
    sqlite_engine: Engine, monkeypatch: pytest.MonkeyPatch
) -> None:
    session_factory: sessionmaker[Session] = sessionmaker(bind=sqlite_engine)
    monkeypatch.setattr(database_session, "SessionLocal", session_factory)
    database_dependency = database_session.get_db()

    session = next(database_dependency)
    assert session.execute(text("SELECT 1")).scalar_one() == 1
    assert sqlite_engine.pool.checkedout() == 1

    database_dependency.close()

    assert sqlite_engine.pool.checkedout() == 0


def test_database_engines_use_isolated_sqlite_files(tmp_path: Path) -> None:
    first_path = tmp_path / "first.db"
    second_path = tmp_path / "second.db"
    first_engine = create_database_engine(f"sqlite:///{first_path.as_posix()}")
    second_engine = create_database_engine(f"sqlite:///{second_path.as_posix()}")

    try:
        with first_engine.begin() as connection:
            connection.execute(
                text("CREATE TABLE isolation_probe (id INTEGER PRIMARY KEY)")
            )

        assert inspect(first_engine).has_table("isolation_probe")
        assert not inspect(second_engine).has_table("isolation_probe")
    finally:
        first_engine.dispose()
        second_engine.dispose()
