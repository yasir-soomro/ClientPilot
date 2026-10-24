from datetime import UTC, datetime, timedelta

from pydantic import EmailStr, TypeAdapter
from sqlalchemy.orm import Session

from app.core.security import (
    DUMMY_PASSWORD_HASH,
    create_session_token,
    hash_password,
    hash_session_token,
    verify_password,
)
from app.core.config import get_settings
from app.models.user import User
from app.repositories.auth_repository import AuthRepository

_email_adapter = TypeAdapter(EmailStr)


class InvalidCredentialsError(Exception):
    pass


class DuplicateOwnerError(Exception):
    pass


class AuthService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.repository = AuthRepository(db)

    def provision_owner(self, email: str, password: str) -> User:
        if not 12 <= len(password) <= 128:
            raise ValueError("Password must be between 12 and 128 characters.")
        normalized_email = str(_email_adapter.validate_python(email.strip())).lower()
        if self.repository.get_user_by_email(normalized_email) is not None:
            raise DuplicateOwnerError("An owner with this email already exists.")

        user = self.repository.create_user(
            email=normalized_email, password_hash=hash_password(password)
        )
        self.db.commit()
        self.db.refresh(user)
        return user

    def login(self, email: str, password: str) -> tuple[User, str]:
        user = self.repository.get_user_by_email(email.strip().lower())
        password_hash = user.password_hash if user is not None else DUMMY_PASSWORD_HASH
        if not verify_password(password, password_hash) or user is None:
            raise InvalidCredentialsError

        now = datetime.now(UTC)
        token = create_session_token()
        expires_at = now + timedelta(hours=get_settings().auth_session_ttl_hours)
        self.repository.delete_expired_sessions(now)
        self.repository.create_session(
            owner_id=user.id,
            token_hash=hash_session_token(token),
            expires_at=expires_at,
        )
        self.db.commit()
        self.db.refresh(user)
        return user, token

    def get_owner_for_token(self, token: str) -> User | None:
        return self.repository.get_owner_for_active_session(
            hash_session_token(token), datetime.now(UTC)
        )

    def logout(self, token: str) -> None:
        self.repository.delete_session(hash_session_token(token))
        self.db.commit()
