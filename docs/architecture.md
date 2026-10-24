# ClientPilot V1 — Architecture

| Document detail | Value |
|---|---|
| Status | Draft |
| Scope | ClientPilot V1 |
| Requirements source | [Software specification](./specification.md) |

This document describes the initial architecture for ClientPilot V1. Decisions still open in the specification are called out rather than assumed.

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

For private requests, the backend establishes the current Owner from the authenticated identity. It must not trust an `owner_id` supplied by the frontend. The frontend is not a security boundary.

### 1.3 Main flows

- **Sign-in:** The Owner submits credentials; the backend verifies them and establishes an authenticated identity using the authentication approach selected in the security design.
- **Client, project, and task operations:** The frontend sends requests to the backend. The backend authenticates, validates, checks ownership and relationships, persists successful changes, and returns a documented response.
- **Dashboard:** The backend calculates counts, progress, and deadline data from persisted records belonging to the current Owner. Upcoming-window and overdue presentation rules remain to be finalized.

## 2. Low-Level Design (LLD)

### 2.1 Proposed repository layout

```text
frontend/                 Next.js application
backend/
  app/
    api/                  HTTP routes and request/response schemas
    auth/                 Authentication and current-Owner dependency
    clients/              Client operations and ownership checks
    projects/             Project operations and client relationship checks
    tasks/                Task operations and project relationship checks
    dashboard/            Owner-scoped dashboard calculations
    database/             SQLite configuration, models, and data access
```

This is a proposed module organization, not a requirement to create every directory at once. Keep backend validation and authorization in the backend; frontend checks are for user experience only.

### 2.2 Data model and relationships

```text
Owner 1 ─── * Client 1 ─── * Project 1 ─── * Task
```

| Entity | Required design concepts |
|---|---|
| Owner | Account identity and securely hashed password; public signup is excluded. |
| Client | System-managed identifier and timestamps; belongs to one Owner; name is required. Email and company rules remain open. |
| Project | System-managed identifier and timestamps; belongs to a Client owned by the current Owner; name is required. Status and due-date details remain open. |
| Task | System-managed identifier and timestamps; belongs to a Project accessible to the current Owner; title is required; status is `todo`, `in_progress`, or `done`. Task due-date support remains open. |

Use persistent database records. Ownership must be enforced on every read and write: clients are scoped to their Owner, projects must reference that Owner's client, and tasks must belong to an accessible project. Exact column types, identifier format, constraints, and migration approach belong in the detailed database design.

### 2.3 Backend boundaries

- **API:** Exposes logical operation groups for authentication, clients, projects, tasks, and dashboard data. Exact route paths, HTTP methods, request/response schemas, and status codes are pending the API contract.
- **Authentication:** Verifies the provisioned Owner and supplies the authenticated identity to private operations. Authentication mechanism, logout behavior, and provisioning method are open decisions.
- **Feature modules:** Validate feature inputs, apply business rules, and enforce ownership and relationship checks before accessing data.
- **Database access:** Persists and retrieves records from SQLite. Data must survive application restarts.
- **Dashboard:** Calculates owner-scoped counts and task-based progress. A project with no tasks has 0% progress. Active-project and deadline display definitions remain open.

### 2.4 Frontend boundaries

The frontend provides the login, dashboard, client, project, and task user flows and sends requests through a shared HTTP/JSON API client. It may guide input and hide unavailable actions, but it must not be relied on for authentication, authorization, ownership, or validation.

### 2.5 V1 boundaries

Do not add public signup, a business-client portal, marketplace, chat, notifications, file uploads, approval workflows, invoices, payments, AI features, teams, permanent deletion, or infrastructure excluded by the V1 specification.

## 3. First Implementation Milestone (Proposal)

### Milestone 1: Application foundation and Owner/client slice

Establish the separate frontend and backend applications, SQLite persistence, and a provisioned Owner's login/logout plus authenticated client create, list, detail, and update operations. Do not begin this milestone's authentication or API implementation until the relevant open decisions below are approved.

### Acceptance criteria

- An Owner can authenticate and log out using the approved authentication design; public signup is unavailable.
- Unauthenticated callers cannot use private client operations.
- An authenticated Owner can create, list, view, and update only their own clients.
- Missing or blank client names are rejected; system-managed identifiers, ownership, and timestamps cannot be changed through ordinary requests.
- Another Owner's client cannot be viewed or changed by guessing its identifier.
- Successful changes persist across application restarts.
- Automated tests cover successful operations, invalid input, missing records, authentication failures, and cross-owner access.
- No permanent client-delete operation is exposed.
- API error responses and status codes are predictable and documented.

## 4. Decisions Required Before Implementation

Resolve and document the following in the relevant security, data, and API designs:

1. Authentication mechanism, secure logout behavior, and Owner provisioning.
2. Client email/company optionality and validation.
3. Identifier format, timestamp handling, and allowed client update fields.
4. API route, request/response, error schema, and status-code contract.
5. Client-list pagination, sorting, and filtering behavior, if supported in the first milestone.

Project and task milestones must additionally resolve project statuses and transitions, project/task update semantics, due-date and time-zone behavior, deadline-window and overdue presentation, and task status-transition rules. Permanent deletion remains outside V1 unless the scope is explicitly changed.
