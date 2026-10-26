"""Add owner-scoped projects.

Revision ID: 0003_projects
Revises: 0002_owner_profile
Create Date: 2026-10-26
"""
from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa

revision: str = "0003_projects"
down_revision: str | None = "0002_owner_profile"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "projects",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("client_id", sa.String(length=36), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column(
            "status",
            sa.String(length=20),
            server_default="planned",
            nullable=False,
        ),
        sa.Column("due_date", sa.Date(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["client_id"], ["clients.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_projects_client_created_at",
        "projects",
        ["client_id", "created_at"],
    )


def downgrade() -> None:
    op.drop_index("ix_projects_client_created_at", table_name="projects")
    op.drop_table("projects")
