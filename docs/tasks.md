# ClientPilot V1 — Task List

This task list turns the staged implementation plan into actionable work items. Complete prerequisite decisions before starting the related implementation tasks. Do not treat unresolved choices as approved behavior.

**Source documents:** [Specification](./specification.md) · [Architecture](./architecture.md) · [Implementation plan](./plan.md)

## Milestone 0 — Requirements and design

- [x] **T00.1 — Decide registration and authentication**
  Original email/password registration fields, authentication, secure logout behavior, and cookie/session handling are decided in specification section 16. New approved CD-001/CD-002 requirements are tracked separately below and do not reopen the existing session or profile decisions.

- [x] **T00.2 — Define API and error contract**
  Document initial API routes, methods, request/response shapes, error schema, status mapping, and how missing records are distinguished from inaccessible records.

- [x] **T00.3 — Finalize client data rules**
  Decide email/company optionality and validation, identifier format, timestamp handling, and updateable fields.

- [x] **T00.4 — Decide list behavior**
  Specify pagination, sorting, and filtering for list operations, or explicitly defer them from the relevant milestone.

- [x] **T00.5 — Approve persistence setup**
  Document SQLite configuration and the database initialization/migration approach required for the MVP.

- [x] **T00.6 — Update and review design documents**
  Record approved decisions in the relevant specification, architecture, security, or API documents. Confirm Milestone 1 acceptance criteria are testable and no required decision remains open.

- [x] **T00.7 — Define owner-scoped client duplicate rule**
  Decided and documented in specification section 16: duplicate on non-null normalized email match OR normalized name-and-non-null-company match; trim and compare name/company case-insensitively; null optional values do not match; scope checks to the authenticated Owner; return HTTP 409 with the documented detail for duplicate create/update attempts. Handling pre-existing duplicates and concurrent writes remains recorded as implementation considerations.

## Milestone 1 — Application foundation, authentication, and clients

**Depends on:** T00.1–T00.6

- [x] **T01.1 — Set up frontend and backend applications**
  Create separate Next.js and FastAPI application areas in the repository and establish their documented local development workflows.

- [x] **T01.2 — Configure SQLite persistence**
  Implement the approved SQLite setup and schema initialization/migration approach. Verify records persist after restart.

- [x] **T01.3 — Implement Owner authentication**
  Implement secure password hashing, registration, login, logout, and authenticated identity handling according to the approved design.

- [x] **T01.4 — Implement client API and ownership enforcement**
  Implement authenticated client create, list, detail, and update operations. Derive ownership from the authenticated identity; do not trust request-body `owner_id`. Prevent duplicate clients within the Owner's workspace using the approved matching rule.

- [x] **T01.5 — Add client frontend flows**
  Add client create/list/detail/update flows that use the backend API. Authentication pages are tracked in T01.9. Frontend visibility or validation must not be treated as a security control.

- [x] **T01.6 — Test authentication and client operations**
  Cover multiple registered Owners and unique emails, valid operations, invalid/blank names, duplicate-client behavior under the approved rule, missing records, unauthenticated requests, cross-owner access, system-managed fields, and persistence across restart. Confirm permanent deletion is unavailable.

- [x] **T01.7 — Align backend modules with the layered architecture**
  Keep HTTP handling, application services, persistence repositories, authentication dependencies, security utilities, models, schemas, and database setup in their documented layers without changing API behavior.

- [x] **T01.8 — Implement public Owner registration**
  Add `POST /api/auth/register` with validated full name, email, password, and E.164 phone number; reject duplicate email, hash passwords with Argon2, return a safe response, migrate Owner profile fields without breaking existing accounts, and test login and ownership behavior.

- [x] **T01.9 — Add authentication frontend**
  Provide responsive Owner registration and login pages connected to the existing API, with client-side validation, loading and error/success states, session-cookie login, and redirect to an authenticated workspace landing page.

## Milestone 1 follow-on — Approved public experience and authentication changes

**Scope:** Approved CD-001/CD-002 requirements recorded in specification section 16.2. Preserve the settled email/password profile and session rules; details still requiring design approval are listed in specification section 17.1.

- [ ] **T01.10 — Finalize authentication LLD and API contract**
  Decide OTP format/lifetime/throttling/attempt and delivery behavior; registration/verification responses; social first-login provisioning/profile requirements; provider callback/redirect controls; account recovery; and verification/provider identity storage. Preserve required E.164 phone collection for email/password registration and keep phone verification/SMS out of scope. Do not reopen client/project/task or existing session-cookie decisions.

- [ ] **T01.11 — Implement email verification and verified-access gate**
  Require ClientPilot email OTP for email/password accounts. Ensure unverified accounts cannot access private pages or APIs, and issue private-capable sessions only in accordance with the approved LLD.

- [ ] **T01.12 — Implement Google/GitHub sign-in and safe account linking**
  Validate provider identities server-side, use stable provider IDs, honor provider-verified email, require ClientPilot OTP when verification is absent, and implement explicit authenticated account linking without automatic email-based merges.

- [ ] **T01.13 — Complete public landing sections and authentication-aware navigation**
  Provide Home, Features, and About in-page sections; public logged-out navigation; signed-in Dashboard/account/logout navigation; responsive content, How It Works, CTA, and footer; use approved hero image and static/sample-only previews.

- [ ] **T01.14 — Test CD-001/CD-002 flows and regressions**
  Cover OTP and provider verification, callback/linking failures, verified/unverified private access, direct route/API access, owner isolation, navigation states, and regression of existing email/password, client, project, and task behavior.

- [ ] **T01.15 — Align Owner name-length validation with the approved contract**
  The specification permits a full name up to 255 characters, while the current backend schema limits it to 50. Align frontend/backend validation and boundary tests with the approved specification without changing the other registration fields or rules.

## Milestone 2 — Projects

**Depends on:** T01.6 and the approved Project contract documented by T02.1.

- [x] **T02.1 — Finalize project decisions**
  Approved and documented project statuses/default, transitions, active-project definition, mutable fields and PATCH semantics, name validation, date-only due-date behavior, owner-scoped list behavior, routes, responses, and error handling in specification section 8.3. See project acceptance criteria in section 8.4.

- [x] **T02.2 — Implement project API**
  Implement authenticated create, list, detail, and update operations with owner-scoped persistence, client relationship validation, documented status/date/name rules, and the approved API/error contract.

- [x] **T02.3 — Add project frontend flows**
  Add project create/list/detail/update flows using the documented API.

- [x] **T02.4 — Test project behavior and access control**
  Cover valid and invalid project data, missing records, cross-owner access, creation/relinking to inaccessible clients, status transitions, and persistence. Confirm permanent deletion is unavailable.

## Milestone 3 — Tasks

**Depends on:** T02.4 and approved task due-date, editable-field, status-transition, validation, and API rules.

- [x] **T03.1 — Finalize task decisions**
  Document whether tasks have due dates, which fields may be edited, and the permitted transitions between `todo`, `in_progress`, and `done`.

- [x] **T03.2 — Implement task API**
  Implement task create and list/view operations and status updates. Enforce access through the owning project on every operation.

- [x] **T03.3 — Add task frontend flows**
  Add task creation, viewing, and status update flows using the documented API.

- [ ] **T03.4 — Test task validation and ownership**  
  Cover missing/blank titles, invalid statuses and transitions, missing tasks/projects, cross-owner access, approved due-date behavior, and persistence. Confirm permanent deletion is unavailable. Test code is present; this item remains open until the relevant tests are run and reviewed.

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

**Depends on:** T01.6, T01.14, T02.4, T03.4, and T04.4

- [ ] **T05.1 — Run end-to-end and regression tests**  
  Verify Owner login/logout and client, project, task, and dashboard flows across the frontend, API, and database.

- [ ] **T05.2 — Verify security and persistence invariants**  
  Confirm unauthenticated requests are rejected; every private API is owner-scoped; cross-owner records are not exposed or modified; project/client and task/project relationships are enforced; records survive restart.

- [ ] **T05.3 — Review V1 scope and documentation**  
  Compare implementation with the V1 specification and completion checklist. Update setup/API documentation and record any incomplete items; ensure excluded features have not been added.

- [ ] **T05.4 — Record verification results**  
  Run relevant test suites and report what passed, failed, or was not run. Do not mark V1 complete while required checks or decisions remain unresolved.

## V1 boundaries

Public email/password registration with email verification, Google/GitHub Owner sign-in, and the public landing experience are approved V1 requirements. E.164 phone collection remains required for email/password registration; phone verification/SMS OTP is excluded. Do not add a business-client portal, a marketplace, in-app chat/notifications, file uploads, approval/revision workflows, invoices, payments, AI features, teams, complex roles, microservices, queues, caching, or permanent-delete operations without an explicitly approved scope change.
