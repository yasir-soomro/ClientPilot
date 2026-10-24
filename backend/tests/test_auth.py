from datetime import UTC, datetime, timedelta

from fastapi.testclient import TestClient
import pytest
from sqlalchemy import select
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session

from app.core.config import Settings
from app.core.security import hash_session_token
from app.models.auth_session import AuthSession
from app.models.user import User
from app.services.auth_service import AuthService, DuplicateOwnerError


OWNER_EMAIL = "owner@example.com"
OWNER_PASSWORD = "correct horse battery staple"
OWNER_FULL_NAME = "Test Owner"
OWNER_PHONE_NUMBER = "+14155552671"


def create_owner(db_session: Session, email: str = OWNER_EMAIL) -> User:
    AuthService(db_session).register_owner(
        email, OWNER_PASSWORD, OWNER_FULL_NAME, OWNER_PHONE_NUMBER
    )
    return db_session.scalar(select(User).where(User.email == email.lower()))


def test_registration_stores_only_a_password_hash(
    db_session: Session,
) -> None:
    owner = create_owner(db_session)

    assert owner.email == OWNER_EMAIL
    assert owner.password_hash != OWNER_PASSWORD
    assert owner.password_hash.startswith("$argon2")


def test_registration_service_rejects_invalid_password_and_duplicate_email(
    db_session: Session,
) -> None:
    with pytest.raises(ValueError, match="12 and 128"):
        AuthService(db_session).register_owner(
            "short@example.com", "short", OWNER_FULL_NAME, OWNER_PHONE_NUMBER
        )

    create_owner(db_session)
    with pytest.raises(DuplicateOwnerError):
        AuthService(db_session).register_owner(
            OWNER_EMAIL, OWNER_PASSWORD, OWNER_FULL_NAME, OWNER_PHONE_NUMBER
        )


def test_registration_creates_owner_with_hashed_password_and_safe_response(
    api_client: TestClient, db_session: Session
) -> None:
    response = api_client.post(
        "/api/auth/register",
        json={
            "email": "  New.Owner@Example.com ",
            "password": OWNER_PASSWORD,
            "full_name": "  New Owner  ",
            "phone_number": f" {OWNER_PHONE_NUMBER} ",
        },
    )

    assert response.status_code == 201
    assert response.json()["email"] == "new.owner@example.com"
    assert response.json()["full_name"] == "New Owner"
    assert response.json()["phone_number"] == OWNER_PHONE_NUMBER
    assert "password" not in response.json()
    assert "password_hash" not in response.json()

    owner = db_session.scalar(
        select(User).where(User.email == "new.owner@example.com")
    )
    assert owner is not None
    assert owner.password_hash != OWNER_PASSWORD
    assert owner.password_hash.startswith("$argon2")
    assert owner.full_name == "New Owner"
    assert owner.phone_number == OWNER_PHONE_NUMBER
    assert api_client.get("/api/clients").status_code == 401


def test_registered_owner_can_log_in_and_access_only_their_clients(
    api_client: TestClient,
) -> None:
    registration = api_client.post(
        "/api/auth/register",
        json={
            "email": OWNER_EMAIL,
            "password": OWNER_PASSWORD,
            "full_name": OWNER_FULL_NAME,
            "phone_number": OWNER_PHONE_NUMBER,
        },
    )
    assert registration.status_code == 201

    login_response = api_client.post(
        "/api/auth/login",
        json={"email": OWNER_EMAIL, "password": OWNER_PASSWORD},
    )

    assert login_response.status_code == 200
    assert api_client.get("/api/auth/me").json()["id"] == registration.json()["id"]
    created_client = api_client.post(
        "/api/clients", json={"name": "Owned by registered user"}
    )
    assert created_client.status_code == 201
    assert [item["name"] for item in api_client.get("/api/clients").json()] == [
        "Owned by registered user"
    ]


def test_registered_owner_persists_across_database_sessions(
    api_client: TestClient, test_engine: Engine
) -> None:
    registration = api_client.post(
        "/api/auth/register",
        json={
            "email": OWNER_EMAIL,
            "password": OWNER_PASSWORD,
            "full_name": OWNER_FULL_NAME,
            "phone_number": OWNER_PHONE_NUMBER,
        },
    )
    assert registration.status_code == 201

    with Session(test_engine) as reopened_session:
        owner = reopened_session.scalar(
            select(User).where(User.id == registration.json()["id"])
        )

    assert owner is not None
    assert owner.email == OWNER_EMAIL
    assert owner.password_hash.startswith("$argon2")

    login_response = api_client.post(
        "/api/auth/login",
        json={"email": OWNER_EMAIL, "password": OWNER_PASSWORD},
    )
    assert login_response.status_code == 200
    assert login_response.json()["id"] == registration.json()["id"]


def test_registration_rejects_duplicate_email_case_insensitively(
    api_client: TestClient,
) -> None:
    assert api_client.post(
        "/api/auth/register",
        json={
            "email": OWNER_EMAIL,
            "password": OWNER_PASSWORD,
            "full_name": OWNER_FULL_NAME,
            "phone_number": OWNER_PHONE_NUMBER,
        },
    ).status_code == 201

    duplicate = api_client.post(
        "/api/auth/register",
        json={
            "email": "  OWNER@EXAMPLE.COM ",
            "password": OWNER_PASSWORD,
            "full_name": OWNER_FULL_NAME,
            "phone_number": OWNER_PHONE_NUMBER,
        },
    )

    assert duplicate.status_code == 409
    assert duplicate.json() == {
        "detail": "An owner with this email already exists"
    }


def test_registration_rejects_invalid_email_password_and_extra_fields(
    api_client: TestClient,
) -> None:
    valid_data = {
        "email": "new@example.com",
        "password": OWNER_PASSWORD,
        "full_name": OWNER_FULL_NAME,
        "phone_number": OWNER_PHONE_NUMBER,
    }
    invalid_payloads = [
        {**valid_data, "email": "not-an-email"},
        {**valid_data, "password": "too-short"},
        {**valid_data, "password": "x" * 129},
        {**valid_data, "full_name": "  "},
        {**valid_data, "full_name": "x" * 256},
        {**valid_data, "phone_number": "4155552671"},
        {**valid_data, "phone_number": "+0123456789"},
        {**valid_data, "phone_number": "+14155552671x"},
        {key: value for key, value in valid_data.items() if key != "full_name"},
        {key: value for key, value in valid_data.items() if key != "phone_number"},
        {**valid_data, "owner_id": "other"},
    ]

    for payload in invalid_payloads:
        assert api_client.post("/api/auth/register", json=payload).status_code == 422


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
    assert response.json()["full_name"] == OWNER_FULL_NAME
    assert response.json()["phone_number"] == OWNER_PHONE_NUMBER
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


def test_private_clients_require_login_but_registration_is_public(
    api_client: TestClient,
) -> None:
    assert api_client.get("/api/clients").status_code == 401
    assert api_client.get("/api/auth/me").status_code == 401
