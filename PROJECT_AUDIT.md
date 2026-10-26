# ClientPilot V1 Project Audit

**Audit date:** 2026-10-27  
**Scope:** Documentation and current frontend, backend, database models/migrations, and tests. This audit is read-only; no existing files or application behavior were changed.  
**Audit baseline:** Checked-in repository plus the updated `docs/specification.md` supplied with the request. The supplied document is referred to below as the *supplied draft* to distinguish it from the checked-in [specification](docs/specification.md).

## Executive summary

ClientPilot is a functioning V1 foundation: owners can register and authenticate with email/password; clients and projects are owner-scoped; tasks can be created and managed inside projects; and records are persisted in SQLite through SQLAlchemy and Alembic. The checked-in README accurately notes that task progress, pending-task metrics, and task deadline views are not yet available.

The supplied draft changes the target considerably. It adds email OTP verification, Google and GitHub sign-in, safe account linking, authentication-aware public navigation, and specific public landing-page sections. Those requirements are not implemented. The draft also refers to an unavailable change-decision record and reopens several decisions that the checked-in specification already records as settled. A requirements/design reconciliation is therefore the safest next task before additional feature code.

## 1. Documentation structure and source of truth

The repository has five documents in `docs/`:

- [product-overview.md](docs/product-overview.md) is explicitly a source-derived draft. It says the software specification supersedes it when approved V1 clarifications differ.
- [specification.md](docs/specification.md) is the detailed feature and API requirements document. Its checked-in version records decisions for owner registration/session handling, clients, projects, and tasks. It is marked “Working draft.”
- [architecture.md](docs/architecture.md) combines HLD and LLD material and is marked “Draft.”
- [plan.md](docs/plan.md) sequences implementation milestones and is marked “Draft.”
- [tasks.md](docs/tasks.md) is the milestone checklist.

[README.md](README.md) summarizes current capabilities and setup. [AGENTS.md](AGENTS.md) and [.github/copilot-instructions.md](.github/copilot-instructions.md) set repository workflow and V1 boundaries; they are not feature specifications. No separate ADR, API contract, security design, or standalone LLD document is present. The supplied draft references `docs/change-decisions.md`, but that file is absent both from the repository and the supplied docs folder. The source PDF referenced by `product-overview.md` is also not present in the repository.

**Verified source guidance:** the product overview defers to the specification. **Approval provenance limit:** the supplied draft labels CD-001 and CD-002 approved, but the referenced decision record is not available to check their rationale or approval history. Treat that approval as stated by the supplied draft, not independently verified by repository evidence.

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

- The supplied draft requires email OTP before private access for email/password accounts. The current implementation registers an account and permits ordinary email/password login without email verification.
- The supplied draft requires Google and GitHub authentication, provider identity verification, safe account linking, and OTP fallback when provider email verification is unavailable. No provider routes, identity records, OTP models, email-delivery integration, or related tests were found.
- The current register form requires a phone number, but the supplied draft says phone verification/SMS OTP is not required and does not clearly settle whether collecting the number itself remains required.
- The dashboard currently summarizes clients, projects, and projects with `in_progress` status. It has no pending-task metric, task-derived project progress, or deadline view, and no dashboard API endpoint was found. See [summary.ts](frontend/src/features/dashboard/summary.ts) and [dashboard-overview.tsx](frontend/src/components/workspace/dashboard-overview.tsx).
- The supplied draft specifies Home/Features/About in-page navigation and logged-in navigation that includes Dashboard and logout controls. The current public page has a hero and feature cards, but no About section or authentication-aware navbar.
- Workspace components check the current owner client-side, while private APIs enforce authentication on the backend. **Verification gap:** the supplied draft says direct navigation to private routes must not reveal private data. No server-side page gate was found; verify that requirement explicitly, while retaining backend authorization regardless.

## 5. Three most important blockers to V1 completion

1. **No reconciled active requirements baseline.** The supplied draft says implementation is pending and reopens client/project/task decisions that the checked-in specification records as decided and the code already implements. It introduces substantial CD-001/CD-002 scope, but its referenced decision record is unavailable. The checked-in task list also leaves task decision and implementation items unchecked even though task code and tests exist. This makes scope and sequencing unclear.
2. **Authentication is short of the supplied draft.** Email OTP, Google/GitHub sign-in, provider verification, safe account linking, OTP abuse controls, and related tests are absent. The supplied draft explicitly requires an LLD before those changes, and the repository does not contain one.
3. **Core user-facing V1 surfaces remain incomplete.** The dashboard lacks pending-task counts, task-based progress, and deadline presentation. Deadline-window, time-zone, and overdue rules remain open in the checked-in specification. The supplied draft’s landing navigation/sections and private-route requirement also do not fully match the current UI/route handling.

## 6. One recommended next task

### Task: Finalize and approve the V1 authentication design before coding it

**Constraints**

- Do not start authentication implementation until the active specification and LLD agree.
- Preserve current client, project, and task behavior unless an approved decision explicitly changes it.
- Keep ownership authorization on the backend; frontend navigation and redirects are not security controls.
- Resolve whether phone numbers remain collected at registration, separately from the explicit decision not to require phone verification.

**Deliverables**

- A repository decision record for CD-001/CD-002 with approval status, rationale, and superseded decisions.
- An authentication LLD covering email OTP, Google/GitHub identity verification, account linking, sessions, email delivery, recovery, and private-route behavior.
- Reconciled specification and plan/task entries that agree with the checked-in implementation and approved new scope.

**Acceptance criteria**

- One active V1 requirements baseline is identifiable from the repository.
- OTP expiry, resend and attempt controls, provider identity rules, account linking, and session behavior are concrete and testable.
- Registration fields and verification requirements are unambiguous.
- Private route and API access criteria explicitly require authentication and, where specified, verified email; backend ownership checks remain mandatory.
- Existing and newly required test scenarios are listed before implementation begins.

## 7. Audit limits

- This report is based on documentation and source inspection; automated tests were not run.
- CD-001/CD-002 approval is stated in the supplied draft but could not be checked against its referenced decision record.
- “Implemented” means code paths and tests were found, not that production behavior or all tests were independently verified during this audit.
