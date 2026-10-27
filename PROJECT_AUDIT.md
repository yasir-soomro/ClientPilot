# ClientPilot V1 Project Audit

**Audit date:** 2026-10-27  
**Scope:** Documentation and current frontend, backend, database models/migrations, and tests. The initial audit was read-only. A later documentation reconciliation incorporated the supplied CD-001/CD-002 requirements into the existing [specification](docs/specification.md); application code, database, migrations, and tests were not changed.
**Audit baseline:** Checked-in repository and the approved V1 requirements supplied for CD-001/CD-002.

## Executive summary

ClientPilot is a functioning V1 foundation: owners can register and authenticate with email/password; clients and projects are owner-scoped; tasks can be created and managed inside projects; and records are persisted in SQLite through SQLAlchemy and Alembic. The README accurately notes that task progress, pending-task metrics, and task deadline views are not yet available. The supplied CD-001/CD-002 requirements are now consolidated in section 16.2 of the existing specification; prior client, project, task, and session decisions remain settled.

CD-001/CD-002 extend the target with email OTP verification, Google and GitHub sign-in, safe account linking, authentication-aware public navigation, and specific landing-page sections. Those requirements are not implemented. Their approval is treated as authoritative for this audit and is recorded in the existing specification rather than in a duplicate change-decision document. The code-level authentication design and dashboard deadline behavior still need decisions before their implementation phases.

## 1. Documentation structure and source of truth

The repository has five documents in `docs/`:

- [product-overview.md](docs/product-overview.md) is explicitly a source-derived draft. It says the software specification supersedes it when approved V1 clarifications differ.
- [specification.md](docs/specification.md) is the detailed feature and API requirements document. It records settled owner/session, client, project, and task decisions, plus the approved CD-001/CD-002 amendments. Remaining choices are listed in section 17.
- [architecture.md](docs/architecture.md) combines HLD and LLD material and is marked “Draft.”
- [plan.md](docs/plan.md) sequences implementation milestones and is marked “Draft.”
- [tasks.md](docs/tasks.md) is the milestone checklist.

[README.md](README.md) summarizes current capabilities and setup. [AGENTS.md](AGENTS.md) and [.github/copilot-instructions.md](.github/copilot-instructions.md) set repository workflow and V1 boundaries; they are not feature specifications. No separate ADR, API contract, security design, or standalone LLD document is present. The supplied draft references `docs/change-decisions.md`, but that file is absent both from the repository and the supplied docs folder. The source PDF referenced by `product-overview.md` is also not present in the repository.

**Source guidance:** the product overview defers to the specification. The supplied package referenced a separate `change-decisions.md`, but it was not included. To avoid duplicate decision sources, CD-001/CD-002 requirements and rationale are recorded in specification section 16.2.

## 2. Architecture in beginner-friendly language

ClientPilot has three main layers:

1. **Next.js frontend:** routes render pages; React components handle interactive forms and workspace views. Feature services send API requests. `/api` requests are forwarded to FastAPI by [next.config.ts](frontend/next.config.ts).
2. **FastAPI backend:** HTTP routes receive requests, Pydantic schemas validate them, services apply business rules, and repositories issue database queries. Backend dependencies identify the signed-in owner and enforce ownership. The backend—not the visible page—is the security boundary.
3. **Database:** SQLAlchemy models describe the records and relationships. Alembic migrations create and evolve the database schema. SQLite is the documented initial store.

Backend tests use pytest. Frontend tests use Node’s test runner. Tests exist for authentication, clients, projects, tasks, and dashboard summary calculations. Their existence does not establish that they were run in this audit.

## 3. Complete flow: creating a task

The following is verified by static code inspection:

1. The project detail interface renders the task form in [project-management.tsx](frontend/src/components/projects/project-management.tsx#L633), using [task-management.tsx](frontend/src/components/tasks/task-management.tsx). The form validates its input and calls the task service.
2. `createTask` sends the request to the project’s task endpoint in [tasks service](frontend/src/features/tasks/service.ts#L50). The frontend API path is routed to the backend through the Next.js `/api` rewrite.
3. FastAPI registers the task router under `/api/projects` in [main.py](backend/app/main.py#L13). The create route receives the project ID, a validated `TaskCreate` payload, and the current owner in [tasks.py](backend/app/routes/tasks.py#L31).
4. The current owner is derived from the session cookie by [auth dependency](backend/app/dependencies/auth.py#L11). The task service looks up the project through the owner-scoped project repository before creating a task in [task service](backend/app/services/task_service.py#L27).
5. The repository adds and flushes the task record in [task repository](backend/app/repositories/task_repository.py#L14); the service commits and refreshes it. The SQLAlchemy task model is [task.py](backend/app/models/task.py#L16), and migration [0004_tasks.py](backend/alembic/versions/0004_tasks.py#L13) creates the table and project relationship.
6. FastAPI validates the returned shape as `TaskRead`; the frontend refreshes the list. [test_tasks.py](backend/tests/test_tasks.py#L42) contains create/list/detail/status coverage, and its persistence test reopens the database.

In plain terms: the browser sends the task details, the backend checks the signed-in owner and project, and the database stores the task.

## 4. Current implementation compared with requirements

### Implemented in the checked-in code

- Email/password owner registration, login, logout, hashed passwords, and persisted opaque sessions. Relevant code includes [auth routes](backend/app/routes/auth.py), [auth service](backend/app/services/auth_service.py), [User model](backend/app/models/user.py), and [AuthSession model](backend/app/models/auth_session.py).
- Owner-scoped client create/list/detail/update operations and project create/list/detail/update operations, with backend checks on relationships.
- Task create/list/detail/status update operations under accessible projects; task fields include title, optional description and due date, status, and timestamps.
- SQLite persistence, Alembic schema migrations, and backend/frontend tests for existing behavior.
- A public landing page, login/register pages, and responsive workspace UI. The landing page uses the supplied `ClientPilot.png` hero image.

### Not implemented or incomplete

- CD-002 requires email OTP before private access for email/password accounts. The current implementation registers an account and permits ordinary email/password login without email verification.
- CD-002 requires Google and GitHub authentication, provider identity verification, safe account linking, and OTP fallback when provider email verification is unavailable. No provider routes, identity records, OTP models, email-delivery integration, or related tests were found.
- The current register form requires an E.164 phone number. The reconciled specification preserves that settled collection requirement for email/password registration and separately excludes phone verification/SMS OTP. Whether social onboarding must collect a phone number when the provider does not supply one remains open.
- The dashboard currently summarizes clients, projects, and projects with `in_progress` status. It has no pending-task metric, task-derived project progress, or deadline view, and no dashboard API endpoint was found. See [summary.ts](frontend/src/features/dashboard/summary.ts) and [dashboard-overview.tsx](frontend/src/components/workspace/dashboard-overview.tsx).
- CD-001 specifies Home/Features/About in-page navigation and signed-in navigation that includes Dashboard and logout controls. The current public page has a hero and feature cards, but no About section or authentication-aware navbar.
- Workspace components check the current owner client-side and render children only after owner verification; private APIs enforce authentication on the backend. The reconciled requirement clarifies that private APIs must also enforce email verification. The current implementation has no verified-email state, so it cannot satisfy that gate yet.

## 5. Three most important blockers to V1 completion

1. **Authentication LLD and implementation remain outstanding.** Email OTP, Google/GitHub sign-in, provider verification, safe account linking, OTP abuse controls, and related tests are absent. The reconciled specification lists unresolved protocol/provider choices that must be completed in the LLD before implementation.
2. **Dashboard work and its requirements remain incomplete.** The dashboard lacks pending-task counts, task-based project progress, and deadline presentation. Deadline window, time-zone, overdue, and dashboard API rules remain open.
3. **Public experience and authentication-aware navigation remain incomplete.** The current landing page lacks the approved Home/Features/About in-page navigation, How It Works content, and signed-in navbar state. Private data APIs are protected, but the new verified-email authorization gate is not implemented.

## 6. One recommended next task

### Task: T01.10 — Finalize the authentication LLD and API contract

**Constraints**

- Do not start authentication implementation until the active specification and LLD agree.
- Preserve current client, project, and task behavior unless an approved decision explicitly changes it.
- Keep ownership authorization on the backend; frontend navigation and redirects are not security controls.
- Preserve required E.164 phone collection for email/password registration and the explicit exclusion of phone verification/SMS OTP. Decide only whether social onboarding needs a phone number if the provider does not supply one.

**Deliverables**

- An authentication LLD/API contract covering email OTP, Google/GitHub identity verification, account linking, existing sessions, email delivery, recovery, and private-route behavior.
- Implementation plan and task entries sequenced against the reconciled specification. CD-001/CD-002 are recorded in specification section 16.2; do not create a duplicate decision document.

**Acceptance criteria**

- OTP expiry, resend and attempt controls, provider identity rules, account linking, and session behavior are concrete and testable.
- Email/password fields are unambiguous; social-onboarding phone collection remains an explicit open decision and is recorded before auth implementation.
- Private route and API access criteria explicitly require authentication and, where specified, verified email; backend ownership checks remain mandatory.
- Existing and newly required test scenarios are listed before implementation begins.

## 7. Audit limits

- This report is based on documentation and source inspection; automated tests were not run.
- CD-001/CD-002 are treated as approved requirements as directed; their requirements and rationale are now recorded in the existing specification.
- Static inspection found a potential full-name validation mismatch: the approved specification allows up to 255 characters, while the current backend registration schema limits names to 50. This audit did not change code; implementation must be aligned with the approved rule in a future code task.
- “Implemented” means code paths and tests were found, not that production behavior or all tests were independently verified during this audit.
