from datetime import UTC, datetime, timedelta

from fastapi.testclient import TestClient
import pytest
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import Settings
from app.auth.provision_owner import provision_owner
from app.core.security import hash_session_token
from app.models.auth_session import AuthSession
from app.models.user import User
from app.services.auth_service import DuplicateOwnerError


OWNER_EMAIL = "owner@example.com"
OWNER_PASSWORD = "correct horse battery staple"


def create_owner(db_session: Session, email: str = OWNER_EMAIL) -> User:
    provision_owner(db_session, email, OWNER_PASSWORD)
    return db_session.scalar(select(User).where(User.email == email.lower()))


def test_controlled_provisioning_stores_only_a_password_hash(
    db_session: Session,
) -> None:
    owner = create_owner(db_session)

    assert owner.email == OWNER_EMAIL
    assert owner.password_hash != OWNER_PASSWORD
    assert owner.password_hash.startswith("$argon2")


def test_provisioning_rejects_short_and_duplicate_password_accounts(
    db_session: Session,
) -> None:
    with pytest.raises(ValueError, match="12 and 128"):
        provision_owner(db_session, "short@example.com", "short")

    create_owner(db_session)
    with pytest.raises(DuplicateOwnerError):
        provision_owner(db_session, OWNER_EMAIL, OWNER_PASSWORD)


def test_login_uses_httponly_cookie_and_persists_only_token_hash(
    api_client: TestClient, db_session: Session
) -> None:
    owner = create_owner(db_session)

    response = api_client.post(
        "/api/auth/login",
        json={"email": OWNER_EMAIL, "password": OWNER_PASSWORD},
    )

    assert response.status_code == 200
    assert response.json()["id"] == owner.id
    assert "password" not in response.json()
    cookie = response.cookies["clientpilot_session"]
    cookie_header = response.headers["set-cookie"].lower()
    assert "httponly" in cookie_header
    assert "samesite=strict" in cookie_header
    assert "secure" not in cookie_header

    auth_session = db_session.scalar(select(AuthSession))
    assert auth_session is not None
    assert auth_session.token_hash == hash_session_token(cookie)
    assert auth_session.token_hash != cookie
    assert auth_session.expires_at.tzinfo == UTC

    owner_response = api_client.get("/api/auth/me")
    assert owner_response.status_code == 200
    assert owner_response.json()["email"] == OWNER_EMAIL


def test_login_marks_session_cookie_secure_when_configured(
    api_client: TestClient, db_session: Session, monkeypatch: pytest.MonkeyPatch
) -> None:
    create_owner(db_session)
    secure_settings = Settings(
        _env_file=None,
        database_url="sqlite://",
        auth_cookie_secure=True,
    )
    monkeypatch.setattr("app.routes.auth.get_settings", lambda: secure_settings)

    response = api_client.post(
        "/api/auth/login",
        json={"email": OWNER_EMAIL, "password": OWNER_PASSWORD},
    )

    assert response.status_code == 200
    assert "secure" in response.headers["set-cookie"].lower()


def test_login_rejects_invalid_credentials_with_same_error(
    api_client: TestClient, db_session: Session
) -> None:
    create_owner(db_session)

    wrong_password = api_client.post(
        "/api/auth/login",
        json={"email": OWNER_EMAIL, "password": "wrong password value"},
    )
    unknown_email = api_client.post(
        "/api/auth/login",
        json={"email": "missing@example.com", "password": OWNER_PASSWORD},
    )

    assert wrong_password.status_code == unknown_email.status_code == 401
    assert wrong_password.json() == unknown_email.json()
    assert db_session.scalar(select(AuthSession)) is None


def test_logout_revokes_session_and_clears_cookie(
    api_client: TestClient, db_session: Session
) -> None:
    create_owner(db_session)
    api_client.post(
        "/api/auth/login",
        json={"email": OWNER_EMAIL, "password": OWNER_PASSWORD},
    )
    assert api_client.get("/api/auth/me").status_code == 200

    response = api_client.post("/api/auth/logout")

    assert response.status_code == 204
    assert response.content == b""
    assert "max-age=0" in response.headers["set-cookie"].lower()
    assert db_session.scalar(select(AuthSession)) is None
    assert api_client.get("/api/auth/me").status_code == 401


def test_expired_session_is_rejected(
    api_client: TestClient, db_session: Session
) -> None:
    owner = create_owner(db_session)
    token = "expired-session-token"
    db_session.add(
        AuthSession(
            owner_id=owner.id,
            token_hash=hash_session_token(token),
            expires_at=datetime.now(UTC) - timedelta(seconds=1),
        )
    )
    db_session.commit()
    api_client.cookies.set("clientpilot_session", token)

    response = api_client.get("/api/auth/me")

    assert response.status_code == 401


def test_private_clients_require_login_and_public_signup_is_absent(
    api_client: TestClient,
) -> None:
    assert api_client.get("/api/clients").status_code == 401
    assert api_client.post("/api/auth/register").status_code == 404
