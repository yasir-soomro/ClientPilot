"""Owner-scoped task management routes."""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import CurrentUser
from app.schemas.tasks import TaskCreate, TaskRead, TaskStatusUpdate
from app.services.task_service import (
    ProjectNotFoundError,
    TaskNotFoundError,
    TaskService,
)

router = APIRouter()


def _project_not_found() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
    )


def _task_not_found() -> HTTPException:
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")


@router.post(
    "/{project_id}/tasks", response_model=TaskRead, status_code=status.HTTP_201_CREATED
)
def create_task(
    project_id: UUID,
    payload: TaskCreate,
    owner: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
) -> TaskRead:
    try:
        task = TaskService(db).create(project_id, owner.id, payload)
    except ProjectNotFoundError:
        raise _project_not_found() from None
    return TaskRead.model_validate(task)


@router.get("/{project_id}/tasks", response_model=list[TaskRead])
def list_tasks(
    project_id: UUID,
    owner: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
) -> list[TaskRead]:
    try:
        tasks = TaskService(db).list_for_project(project_id, owner.id)
    except ProjectNotFoundError:
        raise _project_not_found() from None
    return [TaskRead.model_validate(task) for task in tasks]


@router.get("/{project_id}/tasks/{task_id}", response_model=TaskRead)
def read_task(
    project_id: UUID,
    task_id: UUID,
    owner: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
) -> TaskRead:
    try:
        task = TaskService(db).get_for_project(project_id, task_id, owner.id)
    except ProjectNotFoundError:
        raise _project_not_found() from None
    except TaskNotFoundError:
        raise _task_not_found() from None
    return TaskRead.model_validate(task)


@router.patch("/{project_id}/tasks/{task_id}", response_model=TaskRead)
def update_task_status(
    project_id: UUID,
    task_id: UUID,
    payload: TaskStatusUpdate,
    owner: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
) -> TaskRead:
    try:
        task = TaskService(db).update_status(
            project_id, task_id, owner.id, payload
        )
    except ProjectNotFoundError:
        raise _project_not_found() from None
    except TaskNotFoundError:
        raise _task_not_found() from None
    return TaskRead.model_validate(task)


@router.delete(
    "/{project_id}/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT
)
def delete_task(
    project_id: UUID,
    task_id: UUID,
    owner: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
) -> Response:
    try:
        TaskService(db).delete(project_id, task_id, owner.id)
    except ProjectNotFoundError:
        raise _project_not_found() from None
    except TaskNotFoundError:
        raise _task_not_found() from None
    return Response(status_code=status.HTTP_204_NO_CONTENT)
