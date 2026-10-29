from datetime import date
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.client import Client
from app.models.project import Project


class ProjectRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(
        self,
        client_id: str,
        name: str,
        status: str,
        due_date: date | None,
    ) -> Project:
        project = Project(
            client_id=client_id,
            name=name,
            status=status,
            due_date=due_date,
        )
        self.db.add(project)
        self.db.flush()
        return project

    def list_for_owner(self, owner_id: str) -> list[Project]:
        return list(
            self.db.scalars(
                select(Project)
                .join(Client, Project.client_id == Client.id)
                .where(Client.owner_id == owner_id)
                .order_by(Project.created_at.desc(), Project.id)
            )
        )

    def get_for_owner(self, project_id: UUID, owner_id: str) -> Project | None:
        return self.db.scalar(
            select(Project)
            .join(Client, Project.client_id == Client.id)
            .where(Project.id == str(project_id), Client.owner_id == owner_id)
        )

    def delete(self, project: Project) -> None:
        self.db.delete(project)
