from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine, make_url
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import get_settings


def create_database_engine(database_url: str) -> Engine:
    connect_args = (
        {"check_same_thread": False}
        if make_url(database_url).get_backend_name() == "sqlite"
        else {}
    )
    return create_engine(database_url, connect_args=connect_args, pool_pre_ping=True)


engine = create_database_engine(get_settings().database_url)
SessionLocal: sessionmaker[Session] = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
