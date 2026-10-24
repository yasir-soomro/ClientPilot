"""Add full name and phone number to owner accounts.

Revision ID: 0002_owner_profile
Revises: 0001_auth_cli
Create Date: 2026-10-25
"""
from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa

revision: str = "0002_owner_profile"
down_revision: str | None = "0001_auth_cli"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("full_name", sa.String(length=255), nullable=True),
    )
    op.add_column(
        "users",
        sa.Column("phone_number", sa.String(length=16), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("users", "phone_number")
    op.drop_column("users", "full_name")
