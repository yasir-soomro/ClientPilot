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

Before implementing authentication or private data operations, document and approve the decisions below. The Owner/client decisions needed for the current backend slice are recorded in the specification. A decision may be staged so that only the choices needed by an upcoming milestone block that milestone; do not silently choose defaults.

| Decision | Status |
|---|---|
| Owner email/password registration, authentication, secure logout behavior, and cookie handling | Decided for Owner/client slice; see [specification](./specification.md#16-owner-and-client-decisions) |
| Preventing duplicate clients within one Owner's workspace | Decided: non-null normalized email match OR normalized name-and-non-null-company match; owner-scoped; duplicate writes return `409`; see [specification](./specification.md#16-owner-and-client-decisions) |
| Client email/company optionality, validation, UUID identifiers, UTC timestamps, and allowed update fields | Decided for client slice; see [specification](./specification.md#16-owner-and-client-decisions) |
| Initial API routes, request/response formats, validation errors, and status mapping | Decided for Owner/client slice; see [specification](./specification.md#16-owner-and-client-decisions) |
| Missing versus inaccessible client records | Same `404` response; see [specification](./specification.md#16-owner-and-client-decisions) |
| Client-list pagination, sorting, and filtering | Deferred; clients are unpaginated and newest-first |
| Project statuses, default, active definition, transitions, update fields, name validation, date-only due dates, list behavior, and API errors | Decided for Projects in specification section 8.3 |
| Project-list pagination, sorting, and filtering | Deferred; projects are unpaginated and newest-first |
| Task due-date support, editable fields, and allowed status transitions | Task implementation |
| Deadline window, time-zone handling, and overdue grouping/display | Dashboard implementation |
| SQLite setup and Alembic migration approach; backup/deployment details when required by the delivery environment | SQLite/Alembic setup implemented; backup/deployment deferred |
| Delete/archive policy | Any deletion/archive work; permanent deletion remains excluded from V1 |

The implementation plan does not prescribe behavior for the remaining project, task, and dashboard decisions where the specification leaves it open.

## 3. Milestones

### Milestone 0 — Requirements and design decisions

**Goal:** Make the first implementation slice sufficiently specified.

**Status:** Owner/client requirements are documented. The approved client duplicate rule is enforced by the backend and covered by API tests. Decisions for later project, task, and dashboard milestones remain open.

**Completed work:**

- Recorded the registration, authentication, logout, and credential-storage approach.
- Added the approved public email/password Owner registration route, validation, duplicate-email behavior, safe response, and registration/login separation.
- Extended registration to require validated full name and E.164 phone number, persisted as Owner profile fields with a backward-compatible migration for legacy accounts.
- Defined the initial API error contract and missing-versus-inaccessible client policy.
- Finalized client fields, validation, update semantics, identifiers, and timestamp behavior.
- Decided owner-scoped client duplicate matching, normalization, null handling, and the duplicate conflict response.
- Deferred pagination/filtering for the initial client-list endpoint.
- Recorded the SQLite and Alembic migration approach.
- Updated the specification and architecture to reflect these decisions.
- Organized the backend Owner/client implementation into routes, services, repositories, schemas, models, dependencies, core, and database modules without changing its API contract.

**Acceptance criteria:**

- Decisions needed by Milestone 1 are explicitly recorded and do not conflict with the V1 scope.
- The first milestone's API behavior and testable acceptance criteria are documented.
- No unresolved decision required for Milestone 1 is replaced by an implementation assumption.
- Backend layers remain independently understandable, with route registration and Owner registration preserved.

**Verification:** The decisions are recorded in the specification and architecture and are implemented/tested as part of Milestone 1.

### Milestone 1 — Application foundation, authentication, and clients

**Prerequisite:** Milestone 0 decisions required for authentication, clients, API behavior, and persistence are approved.

**Goal:** Establish the frontend/backend foundation and a working private Owner/client slice.

**Work:**

- Set up the Next.js frontend and FastAPI backend in separate application folders.
- Configure SQLite persistence and the agreed database initialization/migration approach.
- Implement public email/password Owner registration and login/logout using the approved security design.
- Implement client create, list, detail, and update operations.
- Enforce authentication and current-Owner scoping in the backend.
- Prevent duplicate clients within each Owner's workspace using the matching rule approved in the specification, on both create and update.
- Add client UI flows that use the backend API; do not rely on frontend checks for security.

**Acceptance criteria:**

- A registered Owner can authenticate; passwords are stored using Argon2 and never in plaintext.
- Multiple Owners can register with distinct email addresses; email uniqueness applies across all Owner accounts.
- Registration rejects invalid input and duplicate emails, returns no password data, and does not implicitly create a login session.
- Registration requires a nonblank name of at most 255 characters and an international E.164 phone number; existing accounts remain readable with null profile fields until updated through a future approved flow.
- Unauthenticated requests cannot access private client operations.
- An Owner can create, list, view, and update their own clients.
- Missing or blank client names are rejected; other fields follow the approved validation rules.
- Client list results are restricted to the authenticated Owner.
- Duplicate client records are prevented on create and update within an Owner's workspace according to the matching rule in the specification; another Owner's records do not participate in that check.
- Another Owner's client cannot be viewed or changed by guessing its identifier.
- Ordinary requests cannot overwrite system-managed ownership, identifiers, or timestamps.
- Successful client changes persist across application restarts.
- No permanent client-delete operation is exposed.

**Tests:**

- Authentication success/failure, logout behavior, and unauthenticated private requests.
- Registration validation, duplicate-email rejection, hashed password persistence, safe response shape, and successful login after registration.
- Required name/phone validation, E.164 phone format, profile-field persistence, and legacy-user migration compatibility.
- Valid client create/list/detail/update flows and invalid or blank required name.
- Duplicate create and update attempts within one Owner's workspace, including normalized email, normalized name/company, optional null values, self-exclusion on update, and no mutation on conflict; identical client data in separate Owners' workspaces remains isolated.
- Duplicate response contract: HTTP `409` with `{"detail":"A client with these details already exists"}`.
- Missing record and cross-owner read/update attempts.
- Rejection/protection of system-managed fields.
- Persistence across application restart.
- Frontend flow checks for the agreed login and client operations where frontend tests are configured.

### Milestone 2 — Projects

**Prerequisite:** Project decisions are recorded in specification section 8.3. T02.1 is complete.

**Goal:** Manage projects linked only to the current Owner's clients.

**Work:**

- Implement project create, list, detail, and update operations and corresponding frontend flows.
- Validate required client/name fields, the approved status set/default, and optional date-only due date.
- Enforce that a project can only reference a client owned by the authenticated Owner.
- Apply the approved transition rules; any listed status may transition to any other listed status.
- Follow the documented owner-scoped list order, response shapes, and API error/status contract.

**Acceptance criteria:**

- An authenticated Owner can create, list, view, and update accessible projects.
- Project names are trimmed, nonblank, and at most 255 characters.
- New projects default to `planned`; only `planned`, `in_progress`, and `completed` are accepted, and status changes may move between any of them.
- Optional due dates use ISO `YYYY-MM-DD` calendar dates and can be cleared with `null`.
- PATCH changes only supplied, documented fields; empty patches and unknown/system-managed fields are rejected.
- A project cannot be created or moved to another Owner's client.
- Lists and detail/update operations are owner-scoped.
- Project lists are unpaginated and newest-first with an ID tie-breaker.
- Missing/foreign projects and missing/foreign linked clients follow the same 404 contracts recorded in the specification.
- Authenticated frontend create/list/detail/update flows use the shared API client, display loading/empty/success/validation/API-error states, and redirect expired sessions to sign-in.
- Project changes persist across application restarts.
- No permanent project-delete operation is exposed.

**Tests:**

- Valid create/list/detail/update, default status, and invalid project fields.
- Missing project and cross-owner project access.
- Project creation/relinking against an inaccessible client.
- Status validation and every permitted transition, including reopening a completed project.
- Name trimming, blank/overlong name rejection, date-only due-date validation, and due-date clearing.
- PATCH partial updates, empty-patch rejection, system-managed/unknown field rejection, and list ordering.
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

**Prerequisite:** Project status and active-project definition are documented in specification section 8.3. Dashboard deadline window, date/time-zone handling, and overdue display behavior must be decided before implementing dashboard deadline behavior.

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
- Verify that every private API operation is owner-scoped, including project/task relationships and dashboard results.
- Verify database persistence across application restarts.
- Review API and user-facing behavior against the approved specification.
- Update setup, API, and operational documentation for the implemented behavior.

**Acceptance criteria:**

- The V1 completion checklist in the specification is satisfied or each remaining item is explicitly documented as incomplete.
- Automated tests cover successful flows, validation failures, missing records, authentication failures, and cross-owner access.
- No client portal, marketplace, payments, AI features, teams, permanent deletion, or other excluded capability has been introduced. Public email/password Owner registration is an approved V1 feature.
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
