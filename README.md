# ClientPilot

ClientPilot V1 is a private workspace for managing clients, projects, tasks, and delivery progress. See [the product overview](docs/product-overview.md), [specification](docs/specification.md), [architecture](docs/architecture.md), [implementation plan](docs/plan.md), and [task list](docs/tasks.md).

## Repository layout

- `frontend/` — Next.js application.
- `backend/` — FastAPI application and tests.
- `docs/` — V1 product and engineering documents.

The backend owns authentication, validation, authorization, business rules, and persistence. Do not treat frontend visibility as a security boundary.

## Authentication

The frontend provides:

- `/register` — create an Owner account using full name, email, password, and phone number.
- `/login` — sign in with email and password.
- `/dashboard` — verify the current session and provide a private workspace landing page. Client and dashboard features are not implemented yet.

Registration does not sign the Owner in. After the success message, use the sign-in link. Successful login creates the existing backend session cookie and redirects to `/dashboard`; signing out revokes the session and returns to `/login`. Invalid fields, duplicate email, and invalid credentials are reported in the forms.

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

Open `http://localhost:3000`. The frontend's `BACKEND_API_URL` setting defaults to `http://127.0.0.1:8000`; configure it in `frontend/.env.local` if the backend runs at another address. Frontend `/api` requests are proxied to FastAPI so authentication cookies remain same-origin.

## Run the backend

In another PowerShell window:

```powershell
Set-Location backend
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
uv sync --group dev
uv run alembic upgrade head
uv run uvicorn app.main:app --reload
```

Backend settings are loaded from `backend/.env`. Relative SQLite file paths in `DATABASE_URL` resolve from the backend directory, regardless of the process working directory. The local file uses SQLite by default; set `DATABASE_URL` there to configure another database URL. Keep credentials and other private values in `.env`, not in source files. `.env` is ignored by Git; `.env.example` contains only non-secret setup defaults and can be committed. For HTTPS deployments, set `AUTH_COOKIE_SECURE=true`.

The API provides public registration at `POST /api/auth/register`, login/logout and current-owner routes under `/api/auth`, and authenticated client create/list/detail/update routes under `/api/clients`. Registration requires full name, email, password, and an E.164 phone number; passwords are hashed by the backend. Registration does not create a login session. There is no client-delete endpoint. API behavior and validation decisions are documented in [the specification](docs/specification.md).

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

Projects, tasks, dashboard data and metrics, and client-management frontend flows are not implemented in this milestone. `/dashboard` is currently an authenticated landing page, not a completed dashboard.
