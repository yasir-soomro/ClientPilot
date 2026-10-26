# ClientPilot V1 — Architecture

| Document detail | Value |
|---|---|
| Status | Draft |
| Scope | ClientPilot V1 |
| Requirements source | [Software specification](./specification.md) |

This document describes the ClientPilot V1 architecture. Owner authentication and client-management decisions are recorded in the specification; decisions for later feature milestones remain open.

## 1. High-Level Design (HLD)

### 1.1 Components

| Component | Responsibility |
|---|---|
| Next.js frontend | Screens, forms, and user interactions for the authenticated Owner. Calls the backend over HTTP/JSON. |
| FastAPI backend | Authentication, request validation, ownership authorization, business rules, and coordination of database access. |
| SQLite database | Persistent storage for Owners, clients, projects, and tasks. |

The frontend and backend are separate applications in one repository. The backend is a modular monolith; V1 does not require microservices, queues, or caching.

### 1.2 Request and data flow

```text
Owner
  │
  ▼
Next.js frontend
  │  HTTP/JSON
  ▼
FastAPI API
  ├── Authenticate the Owner for private operations
  ├── Validate the request
  ├── Enforce record ownership and business rules
  └── Read/write through backend data-access modules
         │
         ▼
      SQLite
```

For every private API request, the backend establishes the current Owner from the authenticated identity and scopes access to that Owner's workspace. It must not trust an `owner_id` supplied by the frontend. The frontend is not a security boundary.

### 1.3 Main flows

- **Sign-in:** The Owner submits credentials; the backend verifies them and establishes an authenticated identity using the authentication approach selected in the security design.
- **Client, project, and task operations:** The frontend sends requests to the backend. The backend authenticates, validates, checks ownership and relationships, persists successful changes, and returns a documented response.
- **Dashboard:** The backend calculates counts, progress, and deadline data from persisted records belonging to the current Owner. Upcoming-window and overdue presentation rules remain to be finalized.

## 2. Low-Level Design (LLD)

### 2.1 Backend layout

```text
frontend/                 Next.js application
backend/
  app/
    routes/               HTTP endpoints and request/response handling
    services/             Application rules and use cases
    repositories/         Database queries and persistence
    models/               SQLAlchemy models
    schemas/              Pydantic request and response schemas
    dependencies/         Authentication and shared FastAPI dependencies
    core/                 Environment configuration and security utilities
    db/                   SQLAlchemy Base, engine, and database sessions
    main.py               FastAPI application and router registration
  alembic/                Versioned database migrations
  tests/                  Backend tests
```

Routes translate HTTP inputs into service calls and format responses. Services own application rules and coordinate repositories. Repositories contain database queries and persistence operations. Authentication dependencies resolve the current Owner before protected routes run. The backend remains responsible for validation and authorization; frontend checks are for user experience only.

The implemented Owner/client/project operations use these layers: `routes/auth.py`, `routes/clients.py`, and `routes/projects.py`; corresponding services and repositories; and `dependencies/auth.py`. Password/session cryptography lives in `core/security.py`. Owners are created through the documented registration endpoint.

### 2.2 Data model and relationships

```text
Owner 1 ─── * Client 1 ─── * Project 1 ─── * Task
```

| Entity | Required design concepts |
|---|---|
| Owner | Account identity with a globally unique email, full name, E.164 phone number, and securely hashed password; multiple Owners may register and each has a private workspace. The profile columns remain nullable for pre-existing accounts during migration, but registration requires both values. |
| Client | UUID and UTC timestamps are system-managed; belongs to one Owner; name is required; email and company are optional under the rules in the specification. Duplicate prevention is owner-scoped and follows the matching and conflict contract in specification section 16. |
| Project | System-managed UUID and timestamps; linked to a Client owned by the current Owner; trimmed nonblank name (maximum 255 characters); status `planned`, `in_progress`, or `completed` (new projects default to `planned`); optional date-only `due_date` (`YYYY-MM-DD`). Approved Project API and update rules are in specification section 8.3. |
| Task | System-managed identifier and timestamps; belongs to a Project accessible to the current Owner; title is required; status is `todo`, `in_progress`, or `done`. Task due-date support remains open. |

Use persistent database records. Ownership must be enforced on every private API read and write, including dashboard calculations: clients are scoped to their Owner, projects must reference that Owner's client, and tasks must belong to an accessible project. Enforce the approved client-duplicate rule within the Owner boundary as specified in section 16. The Owner/client identifiers, columns, constraints, UTC timestamps, and Alembic migration are implemented; define remaining project/task schema details with those milestones.

### 2.3 Backend boundaries

- **API:** Exposes logical operation groups for authentication, clients, and projects. The implemented Owner/client/project routes and their status behavior are documented in the specification; task and dashboard routes remain pending.
- **Authentication:** Verifies a registered Owner and supplies the authenticated identity to private operations. The Owner registration, session, logout, and cookie decisions are documented in the specification.
- **Feature modules:** Validate feature inputs, apply business rules, and enforce ownership and relationship checks before accessing data.
- **Database access:** Persists and retrieves records from SQLite. Data must survive application restarts.
- **Dashboard:** Calculates owner-scoped counts and task-based progress. A project with no tasks has 0% progress; only projects with status `in_progress` count as active. Deadline window, time-zone display, and overdue grouping remain open.

### 2.4 Frontend boundaries

The frontend provides a public landing page at `/`, authentication at `/login` and `/register`, and authenticated workspace routes at `/dashboard`, `/clients`, `/clients/{client_id}`, `/projects`, and `/projects/{project_id}`. Workspace routes verify the current Owner through the existing authentication API; resource data continues to use the shared authenticated API client and owner-scoped backend endpoints. The overview derives client and project counts from those existing list APIs; task counts, task-based progress, and deadline summaries remain unavailable until their backend contracts and milestone decisions are implemented. Task and settings pages are not exposed. The frontend may guide input and hide unavailable actions, but it must not be relied on for authentication, authorization, ownership, or validation.

### 2.5 V1 boundaries

Public email/password Owner registration is an approved V1 feature. Do not add a business-client portal, marketplace, chat, notifications, file uploads, approval workflows, invoices, payments, AI features, teams, permanent deletion, or infrastructure excluded by the V1 specification.

## 3. First Implementation Milestone

### Milestone 1: Application foundation and Owner/client slice

The backend foundation, SQLite persistence, Owner registration and login/logout, authenticated client create/list/detail/update operations, and client frontend flows are implemented. The approved owner-scoped duplicate-client policy is enforced on create and update and covered by backend API tests. Registration creates an account but does not authenticate it.

### Acceptance criteria

- An Owner can register, then authenticate and log out using the approved authentication design.
- Unauthenticated callers cannot use private client operations.
- An authenticated Owner can create, list, view, and update only their own clients.
- Missing or blank client names are rejected; system-managed identifiers, ownership, and timestamps cannot be changed through ordinary requests.
- Another Owner's client cannot be viewed or changed by guessing its identifier.
- Successful changes persist across application restarts.
- Automated tests cover successful operations, invalid input, missing records, authentication failures, and cross-owner access.
- No permanent client-delete operation is exposed.
- API error responses and status codes are predictable and documented.

## 4. Decisions Required Before Implementation

Owner registration/authentication, client fields and update behavior, session handling, first API routes and error behavior, list behavior, and SQLite migration setup are decided in [the software specification](./specification.md#16-owner-and-client-decisions). The backend package boundaries above are implemented for the Owner/client slice. Do not change those decisions silently.

Resolve and document these remaining decisions before the related future implementation:

1. Handling of duplicate client records that predate enforcement and concurrency behavior for simultaneous duplicate writes; recommendations are recorded in specification section 17.
2. Task due-date support, editable fields, and status transitions.
3. Dashboard deadline window, time-zone handling, and overdue presentation.
4. List behavior for future task endpoints.
5. Backups and deployment-specific database requirements.

Project status, update, validation, due-date, list, and API decisions are recorded in specification section 8.3. Task milestones must resolve task due-date, edit, and status-transition rules; dashboard work must resolve deadline-window, display time-zone, and overdue presentation. Permanent deletion remains outside V1 unless the scope is explicitly changed.
