from typing import TYPE_CHECKING
from uuid import uuid4

from datetime import datetime

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.timestamps import TimestampMixin

if TYPE_CHECKING:
    from app.models.auth_session import AuthSession
    from app.models.client import Client


class User(TimestampMixin, Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid4())
    )

    email: Mapped[str] = mapped_column(
        String(320), unique=True, index=True, nullable=False
    )

    full_name: Mapped[str | None] = mapped_column(
        String(255), nullable=True
    )
    phone_number: Mapped[str | None] = mapped_column(
        String(16), nullable=True
    )

    password_hash: Mapped[str] = mapped_column(
        String(255), nullable=False
    )
    email_verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    clients: Mapped[list["Client"]] = relationship(
        back_populates="owner",
        cascade="all, delete-orphan",
    )

    auth_sessions: Mapped[list["AuthSession"]] = relationship(
        back_populates="owner",
        cascade="all, delete-orphan",
    )

    @property
    def email_verified(self) -> bool:
        return self.email_verified_at is not None
