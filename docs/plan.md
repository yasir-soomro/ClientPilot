# ClientPilot V1 — Implementation Plan

| Document detail | Value |
|---|---|
| Status | Draft |
| Scope | Full ClientPilot V1, delivered in small milestones |
| Requirements | [Software specification](./specification.md) |
| Architecture | [Architecture (HLD/LLD)](./architecture.md) |

This plan sequences implementation after requirements and architecture decisions are approved. It does not finalize open product or security decisions. Record those decisions in the relevant specification, architecture, security, or API documents before implementing features that depend on them.

## 1. Delivery Principles

- Keep the Next.js frontend and FastAPI backend in separate application folders within one repository.
- Treat the backend as the authority for validation, authentication, authorization, ownership, business rules, and persistence.
- Persist application data in SQLite; process memory is not durable storage.
- Implement in small, testable milestones. Do not build the whole application in one step.
- For each milestone, add automated tests for its acceptance criteria, including invalid input, missing records, authentication, and cross-owner access where applicable.
- Do not add V1-excluded features or infrastructure.

## 2. Prerequisites and Decision Gate

Before implementing authentication or private data operations, document and approve the decisions below. A decision may be staged so that only the choices needed by an upcoming milestone block that milestone; do not silently choose defaults.

| Decision | Must be documented before |
|---|---|
| Authentication mechanism, secure logout behavior, cookie/token handling, and initial Owner provisioning | Authentication implementation |
| Client email/company optionality, validation rules, identifier format, timestamp handling, and allowed update fields | Client implementation |
| API routes, request/response formats, error schema, and status-code mapping | First API implementation |
| Policy for missing records versus inaccessible records | First private resource API |
| List pagination, sorting, and filtering behavior | List endpoint implementation |
| Project status values, definition of active, and allowed transitions | Project and dashboard implementation |
| Project update fields/semantics and due-date format/time-zone behavior | Project implementation |
| Task due-date support, editable fields, and allowed status transitions | Task implementation |
| Deadline window, time-zone handling, and overdue grouping/display | Dashboard implementation |
| SQLite setup and migration approach; backup/deployment details when required by the delivery environment | Database foundation and deployment planning, respectively |
| Delete/archive policy | Any deletion/archive work; permanent deletion remains excluded from V1 |

The implementation plan does not prescribe a particular authentication scheme, API contract, date/time policy, or validation rule where the specification leaves it open.

## 3. Milestones

### Milestone 0 — Requirements and design decisions

**Goal:** Make the first implementation slice sufficiently specified.

**Work:**

- Resolve the authentication, logout, Owner provisioning, and credential-storage approach.
- Define the first API error contract and missing-versus-inaccessible record policy.
- Finalize client field optionality, validation, update semantics, identifier format, and timestamp behavior.
- Decide whether pagination, sorting, or filtering is part of the first client-list endpoint.
- Record database setup and migration decisions needed for the MVP.
- Update the specification and architecture/security/API documents to reflect approved decisions.

**Acceptance criteria:**

- Decisions needed by Milestone 1 are explicitly recorded and do not conflict with the V1 scope.
- The first milestone's API behavior and testable acceptance criteria are documented.
- No unresolved decision required for Milestone 1 is replaced by an implementation assumption.

**Tests:** Documentation review against the specification, product overview, and architecture; no application tests are required for this documentation-only milestone.

### Milestone 1 — Application foundation, authentication, and clients

**Prerequisite:** Milestone 0 decisions required for authentication, clients, API behavior, and persistence are approved.

**Goal:** Establish the frontend/backend foundation and a working private Owner/client slice.

**Work:**

- Set up the Next.js frontend and FastAPI backend in separate application folders.
- Configure SQLite persistence and the agreed database initialization/migration approach.
- Implement controlled Owner provisioning and login/logout using the approved security design; do not add public signup.
- Implement client create, list, detail, and update operations.
- Enforce authentication and current-Owner scoping in the backend.
- Add client UI flows that use the backend API; do not rely on frontend checks for security.

**Acceptance criteria:**

- Only a provisioned Owner can authenticate; passwords are stored using an approved secure password-hashing approach.
- Unauthenticated requests cannot access private client operations.
- An Owner can create, list, view, and update their own clients.
- Missing or blank client names are rejected; other fields follow the approved validation rules.
- Client list results are restricted to the authenticated Owner.
- Another Owner's client cannot be viewed or changed by guessing its identifier.
- Ordinary requests cannot overwrite system-managed ownership, identifiers, or timestamps.
- Successful client changes persist across application restarts.
- No permanent client-delete operation is exposed.

**Tests:**

- Authentication success/failure, logout behavior, and unauthenticated private requests.
- Valid client create/list/detail/update flows and invalid or blank required name.
- Missing record and cross-owner read/update attempts.
- Rejection/protection of system-managed fields.
- Persistence across application restart.
- Frontend flow checks for the agreed login and client operations where frontend tests are configured.

### Milestone 2 — Projects

**Prerequisite:** Project status and active definition, allowed transitions, update semantics, name validation, due-date/time-zone rules, and API behavior are documented.

**Goal:** Manage projects linked only to the current Owner's clients.

**Work:**

- Implement project create, list, detail, and update operations and corresponding frontend flows.
- Validate the required project name and approved optional fields.
- Enforce that a project can only reference a client owned by the authenticated Owner.
- Apply the approved project status and transition rules.

**Acceptance criteria:**

- An authenticated Owner can create, list, view, and update accessible projects.
- Projects require a valid name according to the approved validation contract.
- A project cannot be created or moved to another Owner's client.
- Lists and detail/update operations are owner-scoped.
- Project changes persist across application restarts.
- No permanent project-delete operation is exposed.

**Tests:**

- Valid create/list/detail/update and invalid project fields.
- Missing project and cross-owner project access.
- Project creation/relinking against an inaccessible client.
- Status validation and transitions.
- Persistence across restart.

### Milestone 3 — Tasks

**Prerequisite:** Task due-date support, editable fields, status-transition rules, validation, and API behavior are documented.

**Goal:** Manage tasks inside projects accessible to the current Owner.

**Work:**

- Implement task creation and list/view within accessible projects.
- Implement task status updates and only other edits explicitly approved for V1.
- Enforce project ownership on every task operation.
- Use the V1 statuses `todo`, `in_progress`, and `done`.

**Acceptance criteria:**

- An authenticated Owner can create and view tasks only within accessible projects.
- Task titles are required and missing or blank titles are rejected.
- Only the approved task statuses are accepted, with transitions following the documented rules.
- A task cannot be accessed or changed through another Owner's project.
- Task records persist across application restarts.
- No permanent task-delete operation is exposed.

**Tests:**

- Valid task creation/listing and invalid or blank title.
- Valid and invalid status changes, including transition rules.
- Missing task/project and cross-owner access attempts.
- Due-date behavior if task due dates are approved for V1.
- Persistence across restart.

### Milestone 4 — Dashboard and deadlines

**Prerequisite:** Project status and active definition, deadline window, date/time-zone handling, and overdue display behavior are documented.

**Goal:** Show persisted, current-Owner dashboard counts, task-based progress, and agreed deadline information.

**Work:**

- Implement owner-scoped dashboard calculations in the backend.
- Display the agreed metrics and deadline groups in the frontend.
- Preserve overdue items in the deadline view as required by the specification.

**Acceptance criteria:**

- Dashboard results include only records belonging to the authenticated Owner.
- Client, active-project, and pending-task counts match the agreed definitions.
- Project progress is completed tasks divided by total tasks multiplied by 100.
- A project with zero tasks has 0% progress.
- Upcoming and overdue items follow the approved date/time and display rules; overdue items are not silently hidden.

**Tests:**

- Dashboard metric calculations against persisted fixtures.
- Owner isolation for every dashboard metric and deadline entry.
- Zero-task progress and projects with mixed task statuses.
- Upcoming, overdue, and time-zone boundary behavior according to the approved rules.

### Milestone 5 — V1 integration and release verification

**Prerequisite:** Milestones 1–4 are complete and the remaining V1 decisions needed for release are recorded.

**Goal:** Verify end-to-end V1 behavior and close documented gaps without expanding scope.

**Work:**

- Run frontend/backend integration and regression tests.
- Verify ownership enforcement across client → project → task relationships and dashboard queries.
- Verify database persistence across application restarts.
- Review API and user-facing behavior against the approved specification.
- Update setup, API, and operational documentation for the implemented behavior.

**Acceptance criteria:**

- The V1 completion checklist in the specification is satisfied or each remaining item is explicitly documented as incomplete.
- Automated tests cover successful flows, validation failures, missing records, authentication failures, and cross-owner access.
- No public signup, client portal, marketplace, payments, AI features, teams, permanent deletion, or other excluded capability has been introduced.
- The approved API error contract and setup instructions match the implementation.
- All relevant tests pass; failures and tests not run are reported accurately.

## 4. Cross-Cutting Definition of Done

Every implementation milestone is done only when:

- Its behavior matches approved requirements and design decisions.
- Backend validation and authorization protect private operations and relationships.
- Relevant normal-flow, invalid-input, missing-record, and cross-owner tests pass.
- Persistent data survives restart where applicable.
- Frontend and backend remain separate, and the frontend is not treated as a security boundary.
- Relevant documentation is updated.
- No unresolved decision has been silently converted into product behavior.
