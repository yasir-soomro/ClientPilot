from datetime import UTC, datetime, timedelta
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.client import Client
from app.repositories.client_repository import ClientRepository
from app.schemas.clients import ClientCreate, ClientUpdate


class ClientNotFoundError(Exception):
    pass


class ClientService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.repository = ClientRepository(db)

    def create(self, owner_id: str, payload: ClientCreate) -> Client:
        client = self.repository.create(
            owner_id=owner_id,
            name=payload.name,
            email=str(payload.email) if payload.email is not None else None,
            company=payload.company,
        )
        self.db.commit()
        self.db.refresh(client)
        return client

    def list_for_owner(self, owner_id: str) -> list[Client]:
        return self.repository.list_for_owner(owner_id)

    def get_for_owner(self, client_id: UUID, owner_id: str) -> Client:
        client = self.repository.get_for_owner(str(client_id), owner_id)
        if client is None:
            raise ClientNotFoundError
        return client

    def update(
        self, client_id: UUID, owner_id: str, payload: ClientUpdate
    ) -> Client:
        client = self.get_for_owner(client_id, owner_id)
        changes = payload.model_dump(exclude_unset=True)
        if "email" in changes and changes["email"] is not None:
            changes["email"] = str(changes["email"]).lower()
        for field, value in changes.items():
            setattr(client, field, value)
        client.updated_at = max(
            datetime.now(UTC), client.updated_at + timedelta(microseconds=1)
        )
        self.db.commit()
        self.db.refresh(client)
        return client
