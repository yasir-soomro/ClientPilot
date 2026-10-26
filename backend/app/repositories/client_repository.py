from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.client import Client


def _normalize_text(value: str) -> str:
    return value.strip().casefold()


class ClientRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(
        self,
        owner_id: str,
        name: str,
        email: str | None,
        company: str | None,
    ) -> Client:
        client = Client(owner_id=owner_id, name=name, email=email, company=company)
        self.db.add(client)
        self.db.flush()
        return client

    def list_for_owner(self, owner_id: str) -> list[Client]:
        return list(
            self.db.scalars(
                select(Client)
                .where(Client.owner_id == owner_id)
                .order_by(Client.created_at.desc(), Client.id)
            )
        )

    def get_for_owner(self, client_id: str, owner_id: str) -> Client | None:
        return self.db.scalar(
            select(Client).where(
                Client.id == client_id,
                Client.owner_id == owner_id,
            )
        )

    def has_duplicate(
        self,
        owner_id: str,
        name: str,
        email: str | None,
        company: str | None,
        exclude_client_id: str | None = None,
    ) -> bool:
        existing_clients = self.db.execute(
            select(Client.id, Client.name, Client.email, Client.company).where(
                Client.owner_id == owner_id
            )
        )
        normalized_name = _normalize_text(name)
        normalized_email = email.strip().lower() if email is not None else None
        normalized_company = (
            _normalize_text(company) if company is not None else None
        )

        for client_id, existing_name, existing_email, existing_company in existing_clients:
            if client_id == exclude_client_id:
                continue

            if (
                normalized_email is not None
                and existing_email is not None
                and existing_email.strip().lower() == normalized_email
            ):
                return True

            if (
                normalized_company is not None
                and existing_company is not None
                and _normalize_text(existing_name) == normalized_name
                and _normalize_text(existing_company) == normalized_company
            ):
                return True

        return False
