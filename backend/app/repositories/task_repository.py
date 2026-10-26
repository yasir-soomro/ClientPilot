from datetime import date
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.task import Task


class TaskRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(
        self,
        project_id: str,
        title: str,
        description: str | None,
        due_date: date | None,
        status: str,
    ) -> Task:
        task = Task(
            project_id=project_id,
            title=title,
            description=description,
            due_date=due_date,
            status=status,
        )
        self.db.add(task)
        self.db.flush()
        return task

    def list_for_project(self, project_id: str) -> list[Task]:
        return list(
            self.db.scalars(
                select(Task)
                .where(Task.project_id == project_id)
                .order_by(Task.created_at.desc(), Task.id)
            )
        )

    def get_for_project(self, task_id: UUID, project_id: str) -> Task | None:
        return self.db.scalar(
            select(Task).where(
                Task.id == str(task_id), Task.project_id == project_id
            )
        )
