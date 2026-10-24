from typing import TYPE_CHECKING
from uuid import uuid4

from sqlalchemy import ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.timestamps import TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User

class Client(TimestampMixin, Base):
    __tablename__ = "clients"
    __table_args__ = (Index("ix_clients_owner_created_at", "owner_id", "created_at"),)

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid4())
    )
    owner_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str | None] = mapped_column(String(320), nullable=True)
    company: Mapped[str | None] = mapped_column(String(255), nullable=True)

    owner: Mapped["User"] = relationship(back_populates="clients")
