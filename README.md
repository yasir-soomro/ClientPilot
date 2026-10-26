# ClientPilot

ClientPilot is a private client and project management workspace for freelancers and small agencies. It helps an owner keep client contact records together, connect projects to the right clients, and review project status in one place instead of relying on scattered notes and spreadsheets.

The current V1 implementation provides owner registration and authentication, owner-scoped client, project, and task management, and an overview of client/project records. Dashboard task metrics and deadline summaries remain planned work.

## What ClientPilot solves

- **Scattered client information:** Store client names, contact emails, and company details in one searchable workspace.
- **Unclear client-to-project relationships:** Link each project to a client and view the related projects from that client’s details.
- **Limited visibility into ongoing work:** Track project status and optional due dates, and review client/project totals and active projects on the overview.
- **Privacy and ownership concerns:** Keep private operations behind owner authentication and enforce record ownership in the FastAPI backend.
- **Lost or temporary records:** Persist owner, client, and project data in the database so it is not dependent on frontend or process memory.

ClientPilot is for organizing work with existing clients. It is not a client/provider marketplace, and business clients do not create accounts or sign in.

## Current V1 capabilities

- Public landing page and owner registration, login, and logout.
- Private workspace routes:
  - `/dashboard` — client/project overview and counts.
  - `/clients` and `/clients/{client_id}` — create, list, view, and update client records.
  - `/projects` and `/projects/{project_id}` — create, list, view, and update projects linked to owned clients.
- Task creation, listing, details, and status updates are available within project details. Tasks can have an optional description and date-only due date.
- Owner-scoped client duplicate prevention on create and update.
- Project statuses (`planned`, `in_progress`, `completed`) and optional date-only due dates.
- Backend validation, authentication, authorization, parent-resource ownership checks, and persistent database storage.
- Responsive public landing, authentication, and workspace layouts.

Project and client lists, forms, and details use the existing authenticated API. The frontend is not an authorization boundary; the backend determines access and ownership.

### Not yet available

Task-based project progress, pending-task metrics, and task deadline views have not been implemented. Dashboard deadline presentation decisions remain open. Settings and permanent deletion are also not available in the current V1 scope.

## Repository layout

- `frontend/` — Next.js application.
- `backend/` — FastAPI application, database migrations, and tests.
- `docs/` — Product overview, specification, architecture, implementation plan, and task list.

See the [product overview](docs/product-overview.md), [software specification](docs/specification.md), [architecture](docs/architecture.md), [implementation plan](docs/plan.md), and [task list](docs/tasks.md) for detailed requirements and decisions.

## Prerequisites

- Node.js and npm.
- Python 3.13 or newer.
- [uv](https://docs.astral.sh/uv/) for backend environment and dependency management.

## Run locally

### Start the backend

In PowerShell:

```powershell
Set-Location backend
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
uv sync --group dev
uv run alembic upgrade head
uv run uvicorn app.main:app --reload
```

The FastAPI server listens at `http://127.0.0.1:8000`. Backend settings are loaded from `backend/.env`. SQLite is used by default; set `DATABASE_URL` there to use another database URL. Relative SQLite paths resolve from the backend directory. Keep credentials and environment-specific values in `.env`, not in source files. For HTTPS deployments, set `AUTH_COOKIE_SECURE=true`.

### Start the frontend

In another PowerShell window:

```powershell
Set-Location frontend
Copy-Item .env.example .env.local
npm ci
npm run dev
```

Open `http://localhost:3000`. The frontend proxies `/api` requests to the backend using `BACKEND_API_URL`, which defaults to `http://127.0.0.1:8000`.

Register an owner at `/register`, then sign in at `/login`. Registration does not sign the owner in automatically. After login, the private workspace is available at `/dashboard`. The backend hashes passwords and manages the session cookie.

## API overview

- `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- Authenticated client create/list/detail/update under `/api/clients`
- Authenticated project create/list/detail/update under `/api/projects`
- Authenticated task create/list/detail/status updates under `/api/projects/{project_id}/tasks`

Client, project, and task delete operations are not provided. See the [software specification](docs/specification.md) for request validation, response behavior, and ownership rules.

## Run checks

Frontend:

```powershell
Set-Location frontend
npm test
npm run lint
npx tsc --noEmit
npm run build
```

Backend:

```powershell
Set-Location backend
uv run pytest
```
