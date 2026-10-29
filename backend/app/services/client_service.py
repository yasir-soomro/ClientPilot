from datetime import UTC, datetime, timedelta
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.client import Client
from app.repositories.client_repository import ClientRepository
from app.schemas.clients import ClientCreate, ClientUpdate


class ClientNotFoundError(Exception):
    pass


class DuplicateClientError(Exception):
    pass


class ClientService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.repository = ClientRepository(db)

    def create(self, owner_id: str, payload: ClientCreate) -> Client:
        email = str(payload.email) if payload.email is not None else None
        if self.repository.has_duplicate(
            owner_id,
            name=payload.name,
            email=email,
            company=payload.company,
        ):
            raise DuplicateClientError

        client = self.repository.create(
            owner_id=owner_id,
            name=payload.name,
            email=email,
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
        resulting_values = {
            "name": changes.get("name", client.name),
            "email": changes.get("email", client.email),
            "company": changes.get("company", client.company),
        }
        if self.repository.has_duplicate(
            owner_id,
            **resulting_values,
            exclude_client_id=str(client_id),
        ):
            raise DuplicateClientError

        for field, value in changes.items():
            setattr(client, field, value)
        client.updated_at = max(
            datetime.now(UTC), client.updated_at + timedelta(microseconds=1)
        )
        self.db.commit()
        self.db.refresh(client)
        return client

    def delete(self, client_id: UUID, owner_id: str) -> None:
        client = self.get_for_owner(client_id, owner_id)
        self.repository.delete(client)
        self.db.commit()
