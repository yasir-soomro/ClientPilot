from datetime import UTC, date, datetime
from uuid import uuid4

from fastapi.testclient import TestClient
from sqlalchemy import Engine, select
from sqlalchemy.orm import Session

from app.db.session import create_database_engine
from app.models.project import Project
from app.models.task import Task
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
        "/api/auth/login", json={"email": email, "password": OWNER_PASSWORD}
    )
    assert response.status_code == 200


def create_project(client: TestClient, name: str = "Project") -> dict[str, object]:
    created_client = client.post("/api/clients", json={"name": "Client"}).json()
    response = client.post(
        "/api/projects", json={"client_id": created_client["id"], "name": name}
    )
    assert response.status_code == 201
    return response.json()


def test_task_create_list_detail_and_status_update(
    api_client: TestClient, db_session: Session
) -> None:
    create_owner(db_session, "owner@example.com")
    login(api_client, "owner@example.com")
    project = create_project(api_client)

    created = api_client.post(
        f"/api/projects/{project['id']}/tasks",
        json={
            "title": "  Build the dashboard  ",
            "description": "  Initial implementation  ",
            "due_date": "2027-04-15",
        },
    )
    assert created.status_code == 201
    task = created.json()
    assert task["title"] == "Build the dashboard"
    assert task["description"] == "Initial implementation"
    assert task["due_date"] == "2027-04-15"
    assert task["status"] == "todo"
    assert task["project_id"] == project["id"]
    assert "owner_id" not in task

    task_url = f"/api/projects/{project['id']}/tasks/{task['id']}"
    listed = api_client.get(f"/api/projects/{project['id']}/tasks")
    detail = api_client.get(task_url)
    assert listed.status_code == detail.status_code == 200
    assert listed.json() == [task]
    assert detail.json() == task

    updated = api_client.patch(task_url, json={"status": "in_progress"})
    assert updated.status_code == 200
    assert updated.json()["status"] == "in_progress"
    assert updated.json()["created_at"] == task["created_at"]
    assert updated.json()["updated_at"] > task["updated_at"]

    for status in ("done", "todo", "in_progress"):
        response = api_client.patch(task_url, json={"status": status})
        assert response.status_code == 200
        assert response.json()["status"] == status


def test_task_validation_rejects_invalid_fields_and_status(
    api_client: TestClient, db_session: Session
) -> None:
    create_owner(db_session, "owner@example.com")
    login(api_client, "owner@example.com")
    project = create_project(api_client)
    url = f"/api/projects/{project['id']}/tasks"

    invalid_create_payloads = [
        {},
        {"title": " "},
        {"title": "x" * 256},
        {"title": "Valid", "description": "x" * 5001},
        {"title": "Valid", "status": "blocked"},
        {"title": "Valid", "status": None},
        {"title": "Valid", "due_date": "2027-02-29"},
        {"title": "Valid", "due_date": "2027-04-15T00:00:00Z"},
        {"title": "Valid", "project_id": str(uuid4())},
        {"title": "Valid", "owner_id": str(uuid4())},
    ]
    assert [api_client.post(url, json=payload).status_code for payload in invalid_create_payloads] == [422] * len(invalid_create_payloads)
    assert api_client.get(url).json() == []

    task = api_client.post(url, json={"title": "Valid", "description": "  "}).json()
    assert task["description"] is None
    task_url = f"{url}/{task['id']}"
    invalid_updates = [{}, {"status": "blocked"}, {"status": None}, {"title": "Changed"}, {"project_id": str(uuid4())}]
    assert [api_client.patch(task_url, json=payload).status_code for payload in invalid_updates] == [422] * len(invalid_updates)
    assert api_client.get(task_url).json() == task


def test_task_routes_require_auth_and_missing_records_return_404(
    api_client: TestClient, db_session: Session
) -> None:
    owner = create_owner(db_session, "owner@example.com")
    login(api_client, owner.email)
    project = create_project(api_client)
    task = api_client.post(
        f"/api/projects/{project['id']}/tasks", json={"title": "Protected"}
    ).json()
    api_client.post("/api/auth/logout")
    urls = [
        ("get", f"/api/projects/{project['id']}/tasks"),
        ("post", f"/api/projects/{project['id']}/tasks"),
        ("get", f"/api/projects/{project['id']}/tasks/{task['id']}"),
        ("patch", f"/api/projects/{project['id']}/tasks/{task['id']}"),
    ]
    responses = [
        api_client.request(
            method.upper(),
            url,
            json={"title": "No auth"}
            if method == "post"
            else {"status": "done"}
            if method == "patch"
            else None,
        )
        for method, url in urls
    ]
    assert [response.status_code for response in responses] == [401] * len(responses)

    login(api_client, owner.email)
    missing_project = str(uuid4())
    missing_task = str(uuid4())
    assert api_client.get(f"/api/projects/{missing_project}/tasks").json() == {"detail": "Project not found"}
    assert api_client.post(f"/api/projects/{missing_project}/tasks", json={"title": "x"}).status_code == 404
    missing_detail = api_client.get(f"/api/projects/{project['id']}/tasks/{missing_task}")
    assert missing_detail.status_code == 404
    assert missing_detail.json() == {"detail": "Task not found"}
    deleted = api_client.delete(f"/api/projects/{project['id']}/tasks/{task['id']}")
    assert deleted.status_code == 204
    assert api_client.get(f"/api/projects/{project['id']}/tasks/{task['id']}").status_code == 404


def test_task_access_is_scoped_through_owned_project_and_client(
    api_client: TestClient, db_session: Session
) -> None:
    first_owner = create_owner(db_session, "first@example.com")
    second_owner = create_owner(db_session, "second@example.com")
    login(api_client, first_owner.email)
    foreign_project = create_project(api_client, "Foreign project")
    foreign_task = api_client.post(
        f"/api/projects/{foreign_project['id']}/tasks", json={"title": "Private task"}
    ).json()

    login(api_client, second_owner.email)
    owned_project = create_project(api_client, "Owned project")
    missing_project_url = f"/api/projects/{foreign_project['id']}/tasks"
    foreign_task_url = f"/api/projects/{foreign_project['id']}/tasks/{foreign_task['id']}"
    missing_task_url = f"/api/projects/{owned_project['id']}/tasks/{foreign_task['id']}"
    assert api_client.get(missing_project_url).json() == {"detail": "Project not found"}
    assert api_client.post(missing_project_url, json={"title": "No"}).status_code == 404
    assert api_client.get(foreign_task_url).json() == {"detail": "Project not found"}
    assert api_client.patch(foreign_task_url, json={"status": "done"}).status_code == 404
    assert api_client.get(missing_task_url).json() == {"detail": "Task not found"}
    assert api_client.patch(missing_task_url, json={"status": "done"}).status_code == 404
    assert api_client.get(f"/api/projects/{owned_project['id']}/tasks").json() == []
    assert api_client.delete(foreign_task_url).status_code == 404

    login(api_client, first_owner.email)
    assert api_client.get(foreign_task_url).json() == foreign_task
    deleted = api_client.delete(foreign_task_url)
    assert deleted.status_code == 204
    assert api_client.get(foreign_task_url).status_code == 404


def test_task_records_persist_after_database_reopen(
    api_client: TestClient, db_session: Session, test_engine: Engine
) -> None:
    create_owner(db_session, "owner@example.com")
    login(api_client, "owner@example.com")
    project_data = create_project(api_client, "Persistent project")
    created = api_client.post(
        f"/api/projects/{project_data['id']}/tasks",
        json={"title": "Persistent task", "description": "Saved", "due_date": "2027-08-09"},
    )
    assert created.status_code == 201
    api_client.patch(
        f"/api/projects/{project_data['id']}/tasks/{created.json()['id']}",
        json={"status": "done"},
    )

    db_session.commit()
    test_engine.dispose()
    reopened_engine = create_database_engine(str(test_engine.url))
    try:
        with Session(reopened_engine) as reopened_session:
            persisted = reopened_session.scalar(select(Task).where(Task.id == created.json()["id"]))
            persisted_project = reopened_session.get(Project, project_data["id"])
        assert persisted is not None
        assert persisted.project_id == project_data["id"]
        assert persisted.title == "Persistent task"
        assert persisted.description == "Saved"
        assert persisted.due_date == date(2027, 8, 9)
        assert persisted.status == "done"
        assert persisted_project is not None
    finally:
        reopened_engine.dispose()
