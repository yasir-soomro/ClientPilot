from datetime import UTC, date, datetime, timedelta
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.client import Client
from app.models.project import Project
from app.repositories.client_repository import ClientRepository
from app.repositories.project_repository import ProjectRepository
from app.schemas.projects import ProjectCreate, ProjectUpdate


class ProjectNotFoundError(Exception):
    pass


class ClientNotFoundError(Exception):
    pass


class ProjectService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.client_repository = ClientRepository(db)
        self.repository = ProjectRepository(db)

    def _get_owned_client(self, client_id: UUID, owner_id: str) -> Client:
        client = self.client_repository.get_for_owner(str(client_id), owner_id)
        if client is None:
            raise ClientNotFoundError
        return client

    def create(self, owner_id: str, payload: ProjectCreate) -> Project:
        client = self._get_owned_client(payload.client_id, owner_id)
        project = self.repository.create(
            client_id=client.id,
            name=payload.name,
            status=payload.status,
            due_date=payload.due_date,
        )
        self.db.commit()
        self.db.refresh(project)
        return project

    def list_for_owner(self, owner_id: str) -> list[Project]:
        return self.repository.list_for_owner(owner_id)

    def get_for_owner(self, project_id: UUID, owner_id: str) -> Project:
        project = self.repository.get_for_owner(project_id, owner_id)
        if project is None:
            raise ProjectNotFoundError
        return project

    def update(
        self, project_id: UUID, owner_id: str, payload: ProjectUpdate
    ) -> Project:
        project = self.get_for_owner(project_id, owner_id)
        changes = payload.model_dump(exclude_unset=True)

        if "client_id" in changes:
            client = self._get_owned_client(changes["client_id"], owner_id)
            changes["client_id"] = client.id

        for field, value in changes.items():
            setattr(project, field, value)
        project.updated_at = max(
            datetime.now(UTC), project.updated_at + timedelta(microseconds=1)
        )
        self.db.commit()
        self.db.refresh(project)
        return project
