# ClientPilot

ClientPilot V1 is a private workspace for managing clients, projects, tasks, and delivery progress. See [the product overview](docs/product-overview.md), [specification](docs/specification.md), [architecture](docs/architecture.md), [implementation plan](docs/plan.md), and [task list](docs/tasks.md).

## Repository layout

- `frontend/` — Next.js application.
- `backend/` — FastAPI application and tests.
- `docs/` — V1 product and engineering documents.

The backend owns authentication, validation, authorization, business rules, and persistence. Do not treat frontend visibility as a security boundary.

## Prerequisites

- Node.js and npm.
- Python 3.13 or newer.
- [uv](https://docs.astral.sh/uv/) for backend environment and dependency management.

## Run the frontend

In PowerShell:

```powershell
Set-Location frontend
Copy-Item .env.example .env.local
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Run the backend

In another PowerShell window:

```powershell
Set-Location backend
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
uv sync --group dev
uv run alembic upgrade head
uv run uvicorn app.main:app --reload
```

Backend settings are loaded from `backend/.env`. The local file uses SQLite by default; set `DATABASE_URL` there to configure another database URL. Keep credentials and other private values in `.env`, not in source files. `.env` is ignored by Git; `.env.example` contains only non-secret setup defaults and can be committed. For HTTPS deployments, set `AUTH_COOKIE_SECURE=true`.

Provision an Owner from the backend command line. The command prompts for a password twice and does not accept it as a command-line argument:

```powershell
uv run python -m app.auth.provision_owner --email owner@example.com
```

The API provides `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`, and authenticated client create/list/detail/update routes under `/api/clients`. There is no public signup or client-delete endpoint. API behavior and validation decisions are documented in [the specification](docs/specification.md).

The FastAPI development server listens at `http://127.0.0.1:8000`.

## Run checks

Frontend:

```powershell
Set-Location frontend
npm run lint
npm run build
```

Backend:

```powershell
Set-Location backend
uv run pytest
```

Projects, tasks, dashboard operations, and their frontend flows are not implemented in this milestone.
