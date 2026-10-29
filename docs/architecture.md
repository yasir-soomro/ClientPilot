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
| Next.js frontend | Public landing experience and Owner screens/forms. Calls the backend over HTTP/JSON; frontend visibility is not a security boundary. |
| FastAPI backend | Email/password and provider authentication, email-verification gate, request validation, ownership authorization, business rules, and coordination of database access. |
| SQLite database | Persistent storage for Owners, verification/provider identity records, clients, projects, and tasks. |
| Email delivery and identity providers | Deliver email-verification OTPs and provide Google/GitHub identity responses that the backend validates. |

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

For every private API request, the backend establishes the current Owner from the authenticated identity, verifies the email-verification requirement, and scopes access to that Owner's workspace. It must not trust an `owner_id` supplied by the frontend. The frontend is not a security boundary.

### 1.3 Main flows

- **Email/password sign-in:** Registration creates an Owner account and starts email OTP verification. The account cannot access private pages or APIs before verification. After verification, password sign-in establishes the approved persisted session. OTP interaction and failure handling follow the LLD/API contract.
- **Google/GitHub sign-in:** The backend validates the provider response and identifies the account by provider plus stable provider user ID. A verified provider email satisfies the verification gate; otherwise ClientPilot email OTP is required. Matching email alone never merges or links accounts.
- **Account linking:** Linking a provider to an existing Owner requires the Owner's authenticated existing account, explicit account-settings action, fresh provider authorization, and appropriate re-authentication. An identity already linked to another Owner cannot be linked again.
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
| Owner | Account identity with a globally unique email, full name, E.164 phone number for email/password registration, and securely hashed password for password accounts. Email/password accounts have an email-verification state. Existing profile fields remain nullable for legacy accounts as currently migrated. Social sign-in may require an additional onboarding step if provider data does not satisfy required profile fields. |
| Verification challenge | Short-lived email OTP challenge with protected code storage, expiry, resend throttling, and attempt limits. Exact schema and settings remain LLD decisions. |
| Provider identity | Stable provider key (provider plus provider user ID) linked to one Owner. Email is profile/verification data, not an automatic account-link key. Exact columns and uniqueness constraints remain LLD decisions. |
| Client | UUID and UTC timestamps are system-managed; belongs to one Owner; name is required; email and company are optional under the rules in the specification. Duplicate prevention is owner-scoped and follows the matching and conflict contract in specification section 16. |
| Project | System-managed UUID and timestamps; linked to a Client owned by the current Owner; trimmed nonblank name (maximum 255 characters); status `planned`, `in_progress`, or `completed` (new projects default to `planned`); optional date-only `due_date` (`YYYY-MM-DD`). Approved Project API and update rules are in specification section 8.3. |
| Task | System-managed UUID and timestamps; belongs to an accessible Project; trimmed title (maximum 255 characters); optional description (maximum 5,000 characters) and date-only due date; status `todo`, `in_progress`, or `done` (default `todo`). Only status is editable; all listed status transitions are allowed. |

Use persistent database records. Ownership must be enforced on every private API read and write, including dashboard calculations: clients are scoped to their Owner, projects must reference that Owner's client, and tasks must belong to an accessible project. Enforce the approved client-duplicate rule within the Owner boundary as specified in section 16. Owner/client, Project, and Task identifiers, columns, constraints, UTC timestamps, and Alembic migrations follow the documented feature contracts.

### 2.3 Backend boundaries

- **API:** Exposes logical operation groups for authentication, clients, projects, and tasks. Task routes are nested under projects and all task reads/mutations verify ownership through the project's client.
- **Authentication:** Validates password credentials or provider identity, applies the email-verification gate, and supplies the authenticated Owner to private operations. It preserves the approved opaque persisted session and logout contract. OTP, provider callback, error, identity-record, and account-linking implementation details are governed by specification sections 16.2 and 17.1.
- **Feature modules:** Validate feature inputs, apply business rules, and enforce ownership and relationship checks before accessing data.
- **Database access:** Persists and retrieves records from SQLite. Data must survive application restarts.
- **Dashboard:** Calculates owner-scoped counts and task-based progress. A project with no tasks has 0% progress; only projects with status `in_progress` count as active. Deadline window, time-zone display, and overdue grouping remain open.

### 2.4 Frontend boundaries

The frontend provides the public single-page landing page at `/` with Home, Features, and About in-page sections, plus login/register and authenticated workspace routes. The public navigation adapts to signed-in state, as specified in section 16.2 of the specification. During the temporary email-verification deferral recorded in the specification, workspace routes require an authenticated Owner but do not require a verified email. This is a user-experience guard only: every private backend API independently checks session validity and ownership. Project detail includes task creation, listing, and status updates.

### 2.5 V1 boundaries

Email/password registration, Google/GitHub sign-in, email verification, and the public landing experience in specification section 16.2 are approved V1 scope. Mandatory email verification is temporarily deferred as recorded in the specification; preserve its future design while allowing authenticated, owner-scoped private access. Email/password registration collects an E.164 phone number; phone verification/SMS OTP is not part of V1. Do not add a business-client portal, marketplace, in-app notifications, file uploads, approval workflows, invoices, payments, AI features, teams, or infrastructure excluded by the V1 specification. Client, project, and task deletion is owner-scoped; parent deletion cascades to its child records.

## 3. First Implementation Milestone

### Milestone 1: Application foundation and Owner/client slice

The backend foundation, SQLite persistence, Owner registration and login/logout, authenticated client create/list/detail/update operations, and client frontend flows are implemented. The approved owner-scoped duplicate-client policy is enforced on create and update and covered by backend API tests. Registration creates an account but does not authenticate it.

This describes the implemented email/password baseline only. CD-001's authentication-aware public navigation and CD-002's email OTP, Google/GitHub sign-in, verified-email gate, and safe account linking are approved V1 extensions and are not yet implemented. The LLD/API details listed in specification section 17.1 are prerequisites.

### Acceptance criteria

- An Owner can register, then authenticate and log out using the approved authentication design.
- Unauthenticated callers cannot use private client operations.
- An authenticated Owner can create, list, view, and update only their own clients.
- Missing or blank client names are rejected; system-managed identifiers, ownership, and timestamps cannot be changed through ordinary requests.
- Another Owner's client cannot be viewed or changed by guessing its identifier.
- Successful changes persist across application restarts.
- Automated tests cover successful operations, invalid input, missing records, authentication failures, and cross-owner access.
- Client, project, and task deletion is available only through authenticated, owner-scoped operations; parent deletes cascade to child records.
- API error responses and status codes are predictable and documented.

## 4. Decisions Required Before Implementation

Owner registration/authentication, client fields and update behavior, session handling, first API routes and error behavior, list behavior, and SQLite migration setup are decided in [the software specification](./specification.md#16-owner-and-client-decisions). The backend package boundaries above are implemented for the Owner/client slice. Do not change those decisions silently.

Resolve and document these remaining decisions before the related implementation:

1. Handling of duplicate client records that predate enforcement and concurrency behavior for simultaneous duplicate writes; recommendations are recorded in specification section 17.
2. Authentication LLD/API details for CD-002 are listed in specification section 17.1. Existing registration fields, phone collection for email/password users, opaque session behavior, and no-auto-link rule in section 16.2 are settled.
3. Dashboard deadline window, time-zone handling, overdue presentation, and dashboard API details in specification section 17.2.
4. Backups and deployment-specific database requirements.

Project status, update, validation, due-date, list, and API decisions are recorded in specification section 8.3. Task fields, due-date, transition, list, and API decisions are recorded in section 9. The approved session-cookie contract and CD-001/CD-002 requirements are recorded in section 16. Only the operational/authentication design details listed in section 17.1 and the dashboard/deployment details listed in section 17.2 remain open.
