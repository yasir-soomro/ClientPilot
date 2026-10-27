from datetime import UTC, datetime
from uuid import uuid4

from fastapi.testclient import TestClient
from sqlalchemy import Engine, select
from sqlalchemy.orm import Session

from app.db.session import create_database_engine
from app.models.client import Client
from app.models.user import User
from app.services.auth_service import AuthService


OWNER_PASSWORD = "correct horse battery staple"
OWNER_FULL_NAME = "Test Owner"
OWNER_PHONE_NUMBER = "+14155552671"


def create_owner(db_session: Session, email: str) -> User:
    AuthService(db_session).register_owner(
        email, OWNER_PASSWORD, OWNER_FULL_NAME, OWNER_PHONE_NUMBER
    )
    owner = db_session.scalar(select(User).where(User.email == email.lower()))
    owner.email_verified_at = datetime.now(UTC)
    db_session.commit()
    return owner


def login(client: TestClient, email: str) -> None:
    response = client.post(
        "/api/auth/login",
        json={"email": email, "password": OWNER_PASSWORD},
    )
    assert response.status_code == 200


def test_client_create_list_detail_and_update(
    api_client: TestClient, db_session: Session
) -> None:
    owner = create_owner(db_session, "owner@example.com")
    login(api_client, owner.email)

    created = api_client.post(
        "/api/clients",
        json={
            "name": "  Ali  ",
            "email": "Ali@example.com",
            "company": "  Ali Clothing  ",
        },
    )

    assert created.status_code == 201
    client_data = created.json()
    assert client_data["name"] == "Ali"
    assert client_data["email"] == "ali@example.com"
    assert client_data["company"] == "Ali Clothing"
    assert client_data["created_at"].endswith("Z")
    assert client_data["updated_at"].endswith("Z")
    assert "owner_id" not in client_data

    client_id = client_data["id"]
    listed = api_client.get("/api/clients")
    detailed = api_client.get(f"/api/clients/{client_id}")
    assert listed.status_code == detailed.status_code == 200
    assert [record["id"] for record in listed.json()] == [client_id]
    assert detailed.json() == client_data

    updated = api_client.patch(
        f"/api/clients/{client_id}",
        json={"name": "  Ali Khan ", "email": None, "company": None},
    )
    assert updated.status_code == 200
    assert updated.json()["name"] == "Ali Khan"
    assert updated.json()["email"] is None
    assert updated.json()["company"] is None
    assert updated.json()["created_at"] == client_data["created_at"]
    assert updated.json()["updated_at"] > client_data["updated_at"]


def test_client_create_validation_rejects_blank_missing_and_invalid_fields(
    api_client: TestClient, db_session: Session
) -> None:
    create_owner(db_session, "owner@example.com")
    login(api_client, "owner@example.com")

    missing_name = api_client.post("/api/clients", json={"company": "Company"})
    blank_name = api_client.post("/api/clients", json={"name": "  "})
    invalid_email = api_client.post(
        "/api/clients", json={"name": "Name", "email": "not-an-email"}
    )
    too_long_company = api_client.post(
        "/api/clients", json={"name": "Name", "company": "x" * 256}
    )

    assert [
        missing_name.status_code,
        blank_name.status_code,
        invalid_email.status_code,
        too_long_company.status_code,
    ] == [422, 422, 422, 422]


def test_duplicate_client_create_matches_normalized_email_and_name_company(
    api_client: TestClient, db_session: Session
) -> None:
    owner = create_owner(db_session, "owner@example.com")
    login(api_client, owner.email)
    first = api_client.post(
        "/api/clients",
        json={
            "name": "Ali Khan",
            "email": "ALI@example.com",
            "company": "Ali Clothing",
        },
    )
    assert first.status_code == 201

    duplicate_email = api_client.post(
        "/api/clients",
        json={
            "name": "Different Name",
            "email": "  ali@EXAMPLE.com ",
            "company": "Different Company",
        },
    )
    duplicate_name_company = api_client.post(
        "/api/clients",
        json={
            "name": "  ALI KHAN ",
            "email": "different@example.com",
            "company": " ali clothing ",
        },
    )
    expected = {
        "detail": "A client with these details already exists"
    }

    assert duplicate_email.status_code == duplicate_name_company.status_code == 409
    assert duplicate_email.json() == duplicate_name_company.json() == expected
    assert len(api_client.get("/api/clients").json()) == 1


def test_duplicate_client_create_ignores_null_optional_values(
    api_client: TestClient, db_session: Session
) -> None:
    owner = create_owner(db_session, "owner@example.com")
    login(api_client, owner.email)
    first = api_client.post(
        "/api/clients",
        json={"name": "Same Name", "email": None, "company": None},
    )
    second = api_client.post(
        "/api/clients",
        json={"name": "Same Name", "email": None, "company": None},
    )
    assert first.status_code == second.status_code == 201


def test_duplicate_client_create_is_scoped_to_authenticated_owner(
    api_client: TestClient, db_session: Session
) -> None:
    first_owner = create_owner(db_session, "first@example.com")
    second_owner = create_owner(db_session, "second@example.com")
    login(api_client, first_owner.email)
    original = api_client.post(
        "/api/clients",
        json={
            "name": "Owner One",
            "email": "shared@example.com",
            "company": "Shared Company",
        },
    )
    assert original.status_code == 201

    login(api_client, second_owner.email)
    same_values_for_other_owner = api_client.post(
        "/api/clients",
        json={
            "name": "Owner One",
            "email": "shared@example.com",
            "company": "Shared Company",
        },
    )

    assert same_values_for_other_owner.status_code == 201
    assert len(api_client.get("/api/clients").json()) == 1


def test_client_update_rejects_empty_system_and_invalid_updates(
    api_client: TestClient, db_session: Session
) -> None:
    create_owner(db_session, "owner@example.com")
    login(api_client, "owner@example.com")
    created = api_client.post("/api/clients", json={"name": "Client"}).json()
    client_url = f"/api/clients/{created['id']}"

    empty = api_client.patch(client_url, json={})
    blank_name = api_client.patch(client_url, json={"name": " "})
    null_name = api_client.patch(client_url, json={"name": None})
    owner_id = api_client.patch(client_url, json={"owner_id": str(uuid4())})
    system_id = api_client.patch(client_url, json={"id": str(uuid4())})

    assert [
        empty.status_code,
        blank_name.status_code,
        null_name.status_code,
        owner_id.status_code,
        system_id.status_code,
    ] == [422, 422, 422, 422, 422]

    unchanged = api_client.get(client_url).json()
    assert unchanged["name"] == "Client"


def test_client_update_excludes_itself_from_duplicate_matching(
    api_client: TestClient, db_session: Session
) -> None:
    owner = create_owner(db_session, "owner@example.com")
    login(api_client, owner.email)
    created = api_client.post(
        "/api/clients",
        json={
            "name": "Ali Khan",
            "email": "ali@example.com",
            "company": "Ali Clothing",
        },
    )
    client_id = created.json()["id"]

    unchanged_duplicate_fields = api_client.patch(
        f"/api/clients/{client_id}", json={"name": "  ALI KHAN "}
    )
    same_email_and_company = api_client.patch(
        f"/api/clients/{client_id}", json={"company": " ali clothing "}
    )

    assert unchanged_duplicate_fields.status_code == same_email_and_company.status_code == 200
    assert same_email_and_company.json()["email"] == "ali@example.com"


def test_client_update_conflicts_return_409_without_mutating_record(
    api_client: TestClient, db_session: Session
) -> None:
    owner = create_owner(db_session, "owner@example.com")
    login(api_client, owner.email)
    original = api_client.post(
        "/api/clients",
        json={
            "name": "Ali Khan",
            "email": "ali@example.com",
            "company": "Ali Clothing",
        },
    ).json()
    other = api_client.post(
        "/api/clients",
        json={
            "name": "Sara Noor",
            "email": "sara@example.com",
            "company": "Sara Design",
        },
    ).json()

    duplicate_email = api_client.patch(
        f"/api/clients/{other['id']}", json={"email": " ALI@EXAMPLE.COM "}
    )
    duplicate_name_company = api_client.patch(
        f"/api/clients/{other['id']}",
        json={"name": " ali khan ", "company": " ALI CLOTHING "},
    )
    unchanged = api_client.get(f"/api/clients/{other['id']}")

    assert duplicate_email.status_code == duplicate_name_company.status_code == 409
    assert duplicate_email.json() == {
        "detail": "A client with these details already exists"
    }
    assert duplicate_name_company.json() == duplicate_email.json()
    assert unchanged.json() == other
    assert api_client.get(f"/api/clients/{original['id']}").json() == original


def test_missing_and_foreign_clients_are_indistinguishable_and_unmodified(
    api_client: TestClient, db_session: Session
) -> None:
    first_owner = create_owner(db_session, "first@example.com")
    second_owner = create_owner(db_session, "second@example.com")
    login(api_client, first_owner.email)
    client_data = api_client.post(
        "/api/clients", json={"name": "First owner's client"}
    ).json()

    login(api_client, second_owner.email)
    foreign_url = f"/api/clients/{client_data['id']}"
    missing_url = f"/api/clients/{uuid4()}"

    assert api_client.get("/api/clients").json() == []
    foreign_read = api_client.get(foreign_url)
    missing_read = api_client.get(missing_url)
    foreign_update = api_client.patch(foreign_url, json={"name": "Stolen"})
    missing_update = api_client.patch(missing_url, json={"name": "Missing"})
    assert foreign_read.status_code == missing_read.status_code == 404
    assert foreign_read.json() == missing_read.json()
    assert foreign_update.status_code == missing_update.status_code == 404
    assert foreign_update.json() == missing_update.json()

    login(api_client, first_owner.email)
    assert api_client.get(foreign_url).json()["name"] == "First owner's client"


def test_client_records_persist_across_database_sessions(
    api_client: TestClient, db_session: Session, test_engine: Engine
) -> None:
    owner = create_owner(db_session, "owner@example.com")
    login(api_client, owner.email)
    created = api_client.post("/api/clients", json={"name": "Persistent"}).json()
    updated = api_client.patch(
        f"/api/clients/{created['id']}",
        json={
            "name": "Updated after persistence",
            "email": "updated@example.com",
            "company": "Persistent Company",
        },
    )
    assert updated.status_code == 200
    assert api_client.get("/api/clients").json() == [updated.json()]

    db_session.commit()
    test_engine.dispose()
    reopened_engine = create_database_engine(str(test_engine.url))
    try:
        with Session(reopened_engine) as reopened_session:
            persisted = reopened_session.scalar(
                select(Client).where(
                    Client.id == created["id"], Client.owner_id == owner.id
                )
            )

        assert persisted is not None
        assert persisted.name == "Updated after persistence"
        assert persisted.email == "updated@example.com"
        assert persisted.company == "Persistent Company"
    finally:
        reopened_engine.dispose()


def test_client_delete_is_not_exposed(
    api_client: TestClient, db_session: Session
) -> None:
    create_owner(db_session, "owner@example.com")
    login(api_client, "owner@example.com")
    created = api_client.post("/api/clients", json={"name": "Protected"}).json()

    response = api_client.delete(f"/api/clients/{created['id']}")

    assert response.status_code == 405
    assert api_client.get(f"/api/clients/{created['id']}").status_code == 200
