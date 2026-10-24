from datetime import datetime

from sqlalchemy import delete, func, select
from sqlalchemy.orm import Session

from app.models.auth_session import AuthSession
from app.models.user import User


class AuthRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_user_by_email(self, email: str) -> User | None:
        return self.db.scalar(
            select(User).where(func.lower(User.email) == email.lower())
        )

    def create_user(
        self,
        email: str,
        password_hash: str,
        full_name: str,
        phone_number: str,
    ) -> User:
        user = User(
            email=email,
            password_hash=password_hash,
            full_name=full_name,
            phone_number=phone_number,
        )
        self.db.add(user)
        self.db.flush()
        return user

    def delete_expired_sessions(self, now: datetime) -> None:
        self.db.execute(delete(AuthSession).where(AuthSession.expires_at <= now))

    def create_session(
        self, owner_id: str, token_hash: str, expires_at: datetime
    ) -> AuthSession:
        auth_session = AuthSession(
            owner_id=owner_id, token_hash=token_hash, expires_at=expires_at
        )
        self.db.add(auth_session)
        self.db.flush()
        return auth_session

    def get_owner_for_active_session(
        self, token_hash: str, now: datetime
    ) -> User | None:
        return self.db.scalar(
            select(User)
            .join(AuthSession, AuthSession.owner_id == User.id)
            .where(
                AuthSession.token_hash == token_hash,
                AuthSession.expires_at > now,
            )
        )

    def delete_session(self, token_hash: str) -> None:
        self.db.execute(
            delete(AuthSession).where(AuthSession.token_hash == token_hash)
        )
