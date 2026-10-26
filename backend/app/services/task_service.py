from datetime import UTC, datetime, timedelta
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.project import Project
from app.models.task import Task
from app.repositories.project_repository import ProjectRepository
from app.repositories.task_repository import TaskRepository
from app.schemas.tasks import TaskCreate, TaskStatusUpdate


class ProjectNotFoundError(Exception):
    pass


class TaskNotFoundError(Exception):
    pass


class TaskService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.projects = ProjectRepository(db)
        self.tasks = TaskRepository(db)

    def _get_project(self, project_id: UUID, owner_id: str) -> Project:
        project = self.projects.get_for_owner(project_id, owner_id)
        if project is None:
            raise ProjectNotFoundError
        return project

    def create(
        self, project_id: UUID, owner_id: str, payload: TaskCreate
    ) -> Task:
        project = self._get_project(project_id, owner_id)
        task = self.tasks.create(
            project_id=project.id,
            title=payload.title,
            description=payload.description,
            due_date=payload.due_date,
            status=payload.status,
        )
        self.db.commit()
        self.db.refresh(task)
        return task

    def list_for_project(self, project_id: UUID, owner_id: str) -> list[Task]:
        project = self._get_project(project_id, owner_id)
        return self.tasks.list_for_project(project.id)

    def get_for_project(
        self, project_id: UUID, task_id: UUID, owner_id: str
    ) -> Task:
        project = self._get_project(project_id, owner_id)
        task = self.tasks.get_for_project(task_id, project.id)
        if task is None:
            raise TaskNotFoundError
        return task

    def update_status(
        self,
        project_id: UUID,
        task_id: UUID,
        owner_id: str,
        payload: TaskStatusUpdate,
    ) -> Task:
        task = self.get_for_project(project_id, task_id, owner_id)
        task.status = payload.status
        task.updated_at = max(
            datetime.now(UTC), task.updated_at + timedelta(microseconds=1)
        )
        self.db.commit()
        self.db.refresh(task)
        return task
