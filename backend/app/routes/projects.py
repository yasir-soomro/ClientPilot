"""Project management routes: create, list, detail, and update."""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import CurrentUser
from app.schemas.projects import ProjectCreate, ProjectRead, ProjectUpdate
from app.services.project_service import (
    ClientNotFoundError,
    ProjectNotFoundError,
    ProjectService,
)

router = APIRouter()


@router.post("", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
def create_project(
    payload: ProjectCreate,
    owner: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
) -> ProjectRead:
    try:
        project = ProjectService(db).create(owner.id, payload)
    except ClientNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Client not found"
        ) from None
    return ProjectRead.model_validate(project)


@router.get("", response_model=list[ProjectRead])
def list_projects(
    owner: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
) -> list[ProjectRead]:
    projects = ProjectService(db).list_for_owner(owner.id)
    return [ProjectRead.model_validate(project) for project in projects]


@router.get("/{project_id}", response_model=ProjectRead)
def read_project(
    project_id: UUID,
    owner: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
) -> ProjectRead:
    try:
        project = ProjectService(db).get_for_owner(project_id, owner.id)
    except ProjectNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        ) from None
    return ProjectRead.model_validate(project)


@router.patch("/{project_id}", response_model=ProjectRead)
def update_project(
    project_id: UUID,
    payload: ProjectUpdate,
    owner: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
) -> ProjectRead:
    try:
        project = ProjectService(db).update(project_id, owner.id, payload)
    except ProjectNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        ) from None
    except ClientNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Client not found"
        ) from None
    return ProjectRead.model_validate(project)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: UUID,
    owner: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
) -> Response:
    try:
        ProjectService(db).delete(project_id, owner.id)
    except ProjectNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        ) from None
    return Response(status_code=status.HTTP_204_NO_CONTENT)
