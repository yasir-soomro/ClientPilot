"""Client management routes: create, list, detail, and update."""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies.auth import CurrentUser
from app.db.session import get_db
from app.schemas.clients import ClientCreate, ClientRead, ClientUpdate
from app.services.client_service import ClientNotFoundError, ClientService

router = APIRouter()


@router.post("", response_model=ClientRead, status_code=status.HTTP_201_CREATED)
def create_client(
    payload: ClientCreate,
    owner: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
) -> ClientRead:
    client = ClientService(db).create(owner.id, payload)
    return ClientRead.model_validate(client)


@router.get("", response_model=list[ClientRead])
def list_clients(
    owner: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
) -> list[ClientRead]:
    clients = ClientService(db).list_for_owner(owner.id)
    return [ClientRead.model_validate(c) for c in clients]


@router.get("/{client_id}", response_model=ClientRead)
def read_client(
    client_id: UUID,
    owner: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
) -> ClientRead:
    try:
        client = ClientService(db).get_for_owner(client_id, owner.id)
    except ClientNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Client not found"
        ) from None
    return ClientRead.model_validate(client)


@router.patch("/{client_id}", response_model=ClientRead)
def update_client(
    client_id: UUID,
    payload: ClientUpdate,
    owner: CurrentUser,
    db: Annotated[Session, Depends(get_db)],
) -> ClientRead:
    try:
        client = ClientService(db).update(client_id, owner.id, payload)
    except ClientNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Client not found"
        ) from None
    return ClientRead.model_validate(client)
