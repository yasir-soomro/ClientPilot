# ClientPilot V1 — Task List

This task list turns the staged implementation plan into actionable work items. Complete prerequisite decisions before starting the related implementation tasks. Do not treat unresolved choices as approved behavior.

**Source documents:** [Specification](./specification.md) · [Architecture](./architecture.md) · [Implementation plan](./plan.md)

## Milestone 0 — Requirements and design

- [x] **T00.1 — Decide registration and authentication**
  Document Owner registration, authentication, secure logout behavior, and cookie/token handling.

- [x] **T00.2 — Define API and error contract**
  Document initial API routes, methods, request/response shapes, error schema, status mapping, and how missing records are distinguished from inaccessible records.

- [x] **T00.3 — Finalize client data rules**
  Decide email/company optionality and validation, identifier format, timestamp handling, and updateable fields.

- [x] **T00.4 — Decide list behavior**
  Specify pagination, sorting, and filtering for list operations, or explicitly defer them from the relevant milestone.

- [x] **T00.5 — Approve persistence setup**
  Document SQLite configuration and the database initialization/migration approach required for the MVP.

- [ ] **T00.6 — Update and review design documents**
  Record approved decisions in the relevant specification, architecture, security, or API documents. Confirm Milestone 1 acceptance criteria are testable and no required decision remains open.

- [ ] **T00.7 — Define owner-scoped client duplicate rule**
  Decide which client fields and normalization rules identify duplicates within one Owner's workspace and document the duplicate-attempt response. Do not infer a matching rule from the existing client fields.

## Milestone 1 — Application foundation, authentication, and clients

**Depends on:** T00.1–T00.6

- [x] **T01.1 — Set up frontend and backend applications**
  Create separate Next.js and FastAPI application areas in the repository and establish their documented local development workflows.

- [x] **T01.2 — Configure SQLite persistence**
  Implement the approved SQLite setup and schema initialization/migration approach. Verify records persist after restart.

- [x] **T01.3 — Implement Owner authentication**
  Implement secure password hashing, registration, login, logout, and authenticated identity handling according to the approved design.

- [ ] **T01.4 — Implement client API and ownership enforcement**
  Implement authenticated client create, list, detail, and update operations. Derive ownership from the authenticated identity; do not trust request-body `owner_id`. Prevent duplicate clients within the Owner's workspace using the approved matching rule.

- [x] **T01.5 — Add client frontend flows**
  Add client create/list/detail/update flows that use the backend API. Authentication pages are tracked in T01.9. Frontend visibility or validation must not be treated as a security control.

- [ ] **T01.6 — Test authentication and client operations**
  Cover multiple registered Owners and unique emails, valid operations, invalid/blank names, duplicate-client behavior under the approved rule, missing records, unauthenticated requests, cross-owner access, system-managed fields, and persistence across restart. Confirm permanent deletion is unavailable.

- [x] **T01.7 — Align backend modules with the layered architecture**
  Keep HTTP handling, application services, persistence repositories, authentication dependencies, security utilities, models, schemas, and database setup in their documented layers without changing API behavior.

- [x] **T01.8 — Implement public Owner registration**
  Add `POST /api/auth/register` with validated full name, email, password, and E.164 phone number; reject duplicate email, hash passwords with Argon2, return a safe response, migrate Owner profile fields without breaking existing accounts, and test login and ownership behavior.

- [x] **T01.9 — Add authentication frontend**
  Provide responsive Owner registration and login pages connected to the existing API, with client-side validation, loading and error/success states, session-cookie login, and redirect to an authenticated workspace landing page.

## Milestone 2 — Projects

**Depends on:** T01.6, T00.7, and approved project status, transition, update, name-validation, due-date/time-zone, and API rules.

- [ ] **T02.1 — Finalize project decisions**  
  Document project status values and transitions, active-project definition, editable fields/update semantics, name validation, and due-date/time-zone behavior.

- [ ] **T02.2 — Implement project API**  
  Implement create, list, detail, and update operations. Enforce that every project is linked only to a client owned by the current Owner.

- [ ] **T02.3 — Add project frontend flows**  
  Add project create/list/detail/update flows using the documented API.

- [ ] **T02.4 — Test project behavior and access control**  
  Cover valid and invalid project data, missing records, cross-owner access, creation/relinking to inaccessible clients, status transitions, and persistence. Confirm permanent deletion is unavailable.

## Milestone 3 — Tasks

**Depends on:** T02.4 and approved task due-date, editable-field, status-transition, validation, and API rules.

- [ ] **T03.1 — Finalize task decisions**  
  Document whether tasks have due dates, which fields may be edited, and the permitted transitions between `todo`, `in_progress`, and `done`.

- [ ] **T03.2 — Implement task API**  
  Implement task create and list/view operations and status updates. Enforce access through the owning project on every operation.

- [ ] **T03.3 — Add task frontend flows**  
  Add task creation, viewing, and status update flows using the documented API.

- [ ] **T03.4 — Test task validation and ownership**  
  Cover missing/blank titles, invalid statuses and transitions, missing tasks/projects, cross-owner access, approved due-date behavior, and persistence. Confirm permanent deletion is unavailable.

## Milestone 4 — Dashboard and deadlines

**Depends on:** T02.1, T03.1, and approved deadline window, time-zone, and overdue display rules.

- [ ] **T04.1 — Finalize dashboard and deadline rules**  
  Document active-project counting, upcoming deadline window, time-zone handling, and overdue grouping/display.

- [ ] **T04.2 — Implement owner-scoped dashboard calculations**  
  Calculate dashboard counts, task-based progress, and deadline data only from the authenticated Owner's persisted records.

- [ ] **T04.3 — Add dashboard frontend view**  
  Display the documented metrics and deadline groups. Do not silently hide overdue items.

- [ ] **T04.4 — Test dashboard calculations and isolation**  
  Verify owner scoping, metric definitions, mixed task statuses, zero-task projects (0% progress), upcoming deadlines, overdue items, and date/time boundaries.

## Milestone 5 — V1 integration and release verification

**Depends on:** T01.6, T02.4, T03.4, and T04.4

- [ ] **T05.1 — Run end-to-end and regression tests**  
  Verify Owner login/logout and client, project, task, and dashboard flows across the frontend, API, and database.

- [ ] **T05.2 — Verify security and persistence invariants**  
  Confirm unauthenticated requests are rejected; every private API is owner-scoped; cross-owner records are not exposed or modified; project/client and task/project relationships are enforced; records survive restart.

- [ ] **T05.3 — Review V1 scope and documentation**  
  Compare implementation with the V1 specification and completion checklist. Update setup/API documentation and record any incomplete items; ensure excluded features have not been added.

- [ ] **T05.4 — Record verification results**  
  Run relevant test suites and report what passed, failed, or was not run. Do not mark V1 complete while required checks or decisions remain unresolved.

## V1 boundaries

Public email/password Owner registration is approved for V1. Do not add a business-client portal, a marketplace, chat, notifications, file uploads, approval/revision workflows, invoices, payments, AI features, teams, complex roles, microservices, queues, caching, or permanent-delete operations without an explicitly approved scope change.
