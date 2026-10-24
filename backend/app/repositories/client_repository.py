from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.client import Client


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
