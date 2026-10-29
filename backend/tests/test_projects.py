from datetime import UTC, date, datetime
from uuid import uuid4

from fastapi.testclient import TestClient
from sqlalchemy import Engine, select, update
from sqlalchemy.orm import Session

from app.db.session import create_database_engine
from app.models.client import Client
from app.models.project import Project
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


def create_client(api_client: TestClient, name: str = "Client") -> dict[str, object]:
    response = api_client.post("/api/clients", json={"name": name})
    assert response.status_code == 201
    return response.json()


def test_project_create_list_detail_and_update(
    api_client: TestClient, db_session: Session
) -> None:
    owner = create_owner(db_session, "owner@example.com")
    login(api_client, owner.email)
    client = create_client(api_client)

    created = api_client.post(
        "/api/projects",
        json={
            "client_id": client["id"],
            "name": "  Website refresh  ",
            "due_date": "2027-04-15",
        },
    )

    assert created.status_code == 201
    project_data = created.json()
    assert project_data["name"] == "Website refresh"
    assert project_data["status"] == "planned"
    assert project_data["due_date"] == "2027-04-15"
    assert project_data["client_id"] == client["id"]
    assert project_data["created_at"].endswith("Z")
    assert project_data["updated_at"].endswith("Z")
    assert "owner_id" not in project_data

    project_id = project_data["id"]
    listed = api_client.get("/api/projects")
    detailed = api_client.get(f"/api/projects/{project_id}")
    assert listed.status_code == detailed.status_code == 200
    assert [project["id"] for project in listed.json()] == [project_id]
    assert detailed.json() == project_data

    updated = api_client.patch(
        f"/api/projects/{project_id}",
        json={
            "client_id": client["id"],
            "name": "  Launch  ",
            "status": "completed",
            "due_date": None,
        },
    )
    assert updated.status_code == 200
    assert updated.json()["name"] == "Launch"
    assert updated.json()["status"] == "completed"
    assert updated.json()["due_date"] is None
    assert updated.json()["created_at"] == project_data["created_at"]
    assert updated.json()["updated_at"] > project_data["updated_at"]


def test_project_statuses_allow_every_transition_including_reopening(
    api_client: TestClient, db_session: Session
) -> None:
    create_owner(db_session, "owner@example.com")
    login(api_client, "owner@example.com")
    client = create_client(api_client)
    project = api_client.post(
        "/api/projects",
        json={"client_id": client["id"], "name": "Status transitions"},
    ).json()

    for status in ("in_progress", "completed", "planned", "in_progress"):
        response = api_client.patch(
            f"/api/projects/{project['id']}", json={"status": status}
        )
        assert response.status_code == 200
        assert response.json()["status"] == status


def test_project_create_validates_required_fields_status_and_due_date(
    api_client: TestClient, db_session: Session
) -> None:
    create_owner(db_session, "owner@example.com")
    login(api_client, "owner@example.com")
    client = create_client(api_client)

    invalid_payloads = [
        {"name": "Missing client"},
        {"client_id": "not-a-uuid", "name": "Malformed client ID"},
        {"client_id": client["id"]},
        {"client_id": client["id"], "name": " "},
        {"client_id": client["id"], "name": "x" * 256},
        {
            "client_id": client["id"],
            "name": "Invalid status",
            "status": "active",
        },
        {
            "client_id": client["id"],
            "name": "Null status",
            "status": None,
        },
        {
            "client_id": client["id"],
            "name": "Invalid date",
            "due_date": "2027-02-29",
        },
        {
            "client_id": client["id"],
            "name": "Date-time rejected",
            "due_date": "2027-04-15T00:00:00Z",
        },
        {
            "client_id": client["id"],
            "name": "Week date rejected",
            "due_date": "2027-W01-1",
        },
        {
            "client_id": client["id"],
            "name": "Unknown field",
            "owner_id": str(uuid4()),
        },
    ]

    responses = [
        api_client.post("/api/projects", json=payload)
        for payload in invalid_payloads
    ]
    assert [response.status_code for response in responses] == [422] * len(
        invalid_payloads
    )
    assert api_client.get("/api/projects").json() == []


def test_project_create_rejects_missing_or_foreign_client(
    api_client: TestClient, db_session: Session
) -> None:
    first_owner = create_owner(db_session, "first@example.com")
    second_owner = create_owner(db_session, "second@example.com")
    login(api_client, first_owner.email)
    foreign_client_id = create_client(api_client)["id"]

    login(api_client, second_owner.email)
    response = api_client.post(
        "/api/projects",
        json={"client_id": foreign_client_id, "name": "Foreign relationship"},
    )
    missing_client = api_client.post(
        "/api/projects",
        json={"client_id": str(uuid4()), "name": "Missing relationship"},
    )

    expected = {"detail": "Client not found"}
    assert response.status_code == missing_client.status_code == 404
    assert response.json() == missing_client.json() == expected
    assert api_client.get("/api/projects").json() == []


def test_project_patch_rejects_empty_null_and_system_fields_without_mutation(
    api_client: TestClient, db_session: Session
) -> None:
    create_owner(db_session, "owner@example.com")
    login(api_client, "owner@example.com")
    client = create_client(api_client)
    project = api_client.post(
        "/api/projects",
        json={"client_id": client["id"], "name": "Unchanged"},
    ).json()
    project_url = f"/api/projects/{project['id']}"

    invalid_updates = [
        {},
        {"name": None},
        {"client_id": None},
        {"status": None},
        {"status": "archived"},
        {"client_id": "not-a-uuid"},
        {"owner_id": str(uuid4())},
        {"id": str(uuid4())},
        {"created_at": "2026-01-01T00:00:00Z"},
        {"unknown": "value"},
        {"name": "x" * 256},
        {"due_date": "2027-04-15T00:00:00"},
    ]
    responses = [
        api_client.patch(project_url, json=payload) for payload in invalid_updates
    ]

    assert [response.status_code for response in responses] == [422] * len(
        invalid_updates
    )
    assert api_client.get(project_url).json() == project


def test_project_relink_rejects_foreign_client_without_mutating_project(
    api_client: TestClient, db_session: Session
) -> None:
    first_owner = create_owner(db_session, "first@example.com")
    second_owner = create_owner(db_session, "second@example.com")
    login(api_client, first_owner.email)
    owned_client_id = create_client(api_client, "Owned client")["id"]
    project = api_client.post(
        "/api/projects",
        json={"client_id": owned_client_id, "name": "Original"},
    ).json()

    login(api_client, second_owner.email)
    foreign_client_id = create_client(api_client, "Foreign client's owner")["id"]
    login(api_client, first_owner.email)
    foreign_client_update = api_client.patch(
        f"/api/projects/{project['id']}",
        json={"client_id": foreign_client_id},
    )
    missing_client_update = api_client.patch(
        f"/api/projects/{project['id']}",
        json={"client_id": str(uuid4())},
    )

    assert foreign_client_update.status_code == missing_client_update.status_code == 404
    assert foreign_client_update.json() == missing_client_update.json() == {
        "detail": "Client not found"
    }
    assert api_client.get(f"/api/projects/{project['id']}").json() == project


def test_project_access_is_owner_scoped_and_missing_matches_foreign(
    api_client: TestClient, db_session: Session
) -> None:
    first_owner = create_owner(db_session, "first@example.com")
    second_owner = create_owner(db_session, "second@example.com")
    login(api_client, first_owner.email)
    client = create_client(api_client)
    project = api_client.post(
        "/api/projects",
        json={"client_id": client["id"], "name": "Private project"},
    ).json()

    login(api_client, second_owner.email)
    foreign_url = f"/api/projects/{project['id']}"
    missing_url = f"/api/projects/{uuid4()}"
    foreign_read = api_client.get(foreign_url)
    missing_read = api_client.get(missing_url)
    foreign_update = api_client.patch(foreign_url, json={"name": "Changed"})
    missing_update = api_client.patch(missing_url, json={"name": "Changed"})
    foreign_delete = api_client.delete(foreign_url)
    missing_delete = api_client.delete(missing_url)

    assert api_client.get("/api/projects").json() == []
    assert foreign_read.status_code == missing_read.status_code == 404
    assert foreign_read.json() == missing_read.json() == {
        "detail": "Project not found"
    }
    assert foreign_update.status_code == missing_update.status_code == 404
    assert foreign_update.json() == missing_update.json()
    assert foreign_delete.status_code == missing_delete.status_code == 404

    login(api_client, first_owner.email)
    assert api_client.get(foreign_url).json() == project


def test_project_list_is_newest_first_and_owner_scoped(
    api_client: TestClient, db_session: Session
) -> None:
    first_owner = create_owner(db_session, "first@example.com")
    second_owner = create_owner(db_session, "second@example.com")
    login(api_client, first_owner.email)
    first_client = create_client(api_client, "First client")
    second_client = create_client(api_client, "Second client")
    first_project = api_client.post(
        "/api/projects",
        json={"client_id": first_client["id"], "name": "First"},
    ).json()
    second_project = api_client.post(
        "/api/projects",
        json={"client_id": second_client["id"], "name": "Second"},
    ).json()
    tied_project = api_client.post(
        "/api/projects",
        json={"client_id": first_client["id"], "name": "Tied"},
    ).json()
    db_session.execute(
        update(Project)
        .where(Project.id == first_project["id"])
        .values(created_at=datetime(2026, 1, 1, tzinfo=UTC))
    )
    db_session.execute(
        update(Project)
        .where(Project.id == second_project["id"])
        .values(created_at=datetime(2026, 1, 2, tzinfo=UTC))
    )
    db_session.execute(
        update(Project)
        .where(Project.id == tied_project["id"])
        .values(created_at=datetime(2026, 1, 1, tzinfo=UTC))
    )
    db_session.commit()

    login(api_client, second_owner.email)
    client = create_client(api_client, "Other owner client")
    api_client.post(
        "/api/projects",
        json={"client_id": client["id"], "name": "Other owner's project"},
    )
    login(api_client, first_owner.email)

    listed = api_client.get("/api/projects")

    assert listed.status_code == 200
    assert [item["id"] for item in listed.json()] == [
        second_project["id"],
        *sorted([first_project["id"], tied_project["id"]]),
    ]


def test_project_delete_requires_authentication_and_cascades_tasks(
    api_client: TestClient, db_session: Session
) -> None:
    owner = create_owner(db_session, "owner@example.com")
    login(api_client, owner.email)
    client = create_client(api_client)
    project = api_client.post(
        "/api/projects",
        json={"client_id": client["id"], "name": "Protected"},
    ).json()
    task = api_client.post(
        f"/api/projects/{project['id']}/tasks",
        json={"title": "Project task"},
    ).json()

    api_client.post("/api/auth/logout")
    responses = [
        api_client.post(
            "/api/projects",
            json={"client_id": client["id"], "name": "Unauthenticated"},
        ),
        api_client.get("/api/projects"),
        api_client.get(f"/api/projects/{project['id']}"),
        api_client.patch(f"/api/projects/{project['id']}", json={"name": "No auth"}),
        api_client.delete(f"/api/projects/{project['id']}"),
    ]

    assert [response.status_code for response in responses] == [401] * len(responses)
    login(api_client, owner.email)
    deleted = api_client.delete(f"/api/projects/{project['id']}")
    assert deleted.status_code == 204
    assert api_client.get(f"/api/projects/{project['id']}").status_code == 404
    assert (
        api_client.get(f"/api/projects/{project['id']}/tasks/{task['id']}").status_code
        == 404
    )


def test_project_records_persist_across_database_sessions(
    api_client: TestClient, db_session: Session, test_engine: Engine
) -> None:
    owner = create_owner(db_session, "owner@example.com")
    login(api_client, owner.email)
    client = create_client(api_client, "Persistent client")
    created = api_client.post(
        "/api/projects",
        json={
            "client_id": client["id"],
            "name": "Persistent project",
            "due_date": "2027-08-09",
        },
    )
    assert created.status_code == 201
    updated = api_client.patch(
        f"/api/projects/{created.json()['id']}",
        json={"status": "in_progress"},
    )
    assert updated.status_code == 200

    db_session.commit()
    test_engine.dispose()
    reopened_engine = create_database_engine(str(test_engine.url))
    try:
        with Session(reopened_engine) as reopened_session:
            persisted = reopened_session.scalar(
                select(Project).where(Project.id == created.json()["id"])
            )

        assert persisted is not None
        assert persisted.client_id == client["id"]
        assert persisted.name == "Persistent project"
        assert persisted.status == "in_progress"
        assert persisted.due_date == date(2027, 8, 9)
    finally:
        reopened_engine.dispose()
