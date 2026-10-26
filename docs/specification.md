# ClientPilot V1 — Software Specification

| Document detail | Value |
|---|---|
| Product | ClientPilot |
| Version | V1 |
| Status | Working draft — Owner/client baseline implemented; later feature decisions remain open |
| Product baseline | `ClientPilot_V1_Product_Overview_and_User_Guide.pdf` |
| Initial technology direction | Next.js frontend + FastAPI backend + SQLite database |

## 1. Purpose
ClientPilot V1 is a private workspace for a freelancer or small-agency owner to organize existing clients, their projects, project tasks, deadlines, and delivery progress in one place.

ClientPilot V1 does not find clients, run a client/provider marketplace, or give business clients their own accounts. A business client is a contact record managed by the Owner.

## 2. Goals and Success Criteria
V1 should allow its Owner to:
1. Register multiple Owner accounts with unique email addresses and log in/out securely.
2. Use a private workspace where each Owner can access only their own data.
3. Create, list, view, and update multiple client records without duplicates within that Owner's workspace.
4. Create, list, view, and update projects linked to their own clients.
5. Create and view tasks within accessible projects and update task status.
6. See dashboard counts, task-based progress, pending tasks, and deadlines.
7. Close and restart the application without losing saved records.
8. Be prevented from accessing another Owner's private records, including by guessing record IDs.
V1 is successful when the above behaviors work and are covered by automated tests, including invalid-input and cross-owner-access cases.

## 3. Users and Access Model
### 3.1 Owner
Owners are the application's account users in V1. Multiple Owners can register, each with a unique email address, and each Owner signs in to manage a private workspace. An Owner can access only records belonging to that workspace.

### 3.2 Business client
A business client is a contact record stored by an Owner. Business clients do not sign in and do not receive a portal or dashboard in V1.

### 3.3 Account registration
Owner accounts are created through public email/password registration. Registration creates an account but does not sign the user in; login and session decisions are recorded in section 16.

## 4. V1 Scope
### 4.1 Included
- Owner email/password registration, login, and logout.
- Client create, list, detail, and update.
- Project create, list, detail, and update.
- Task create and list/view.
- Task status update.
- Dashboard metrics and deadline overview.
- Persistent database storage.
- Input validation and predictable API errors.
- Server-side authentication, authorization, and record ownership checks.
- Automated tests for successful operations, validation failures, missing records, authentication failures, and cross-owner access attempts.
### 4.2 Excluded
- Business-client accounts or a client portal.
- Marketplace or client/provider matching.
- In-app chat, notifications, file uploads, or approval/revision workflow.
- Invoices, payments, or escrow.
- AI agents, automatic project planning, or AI recommendations.
- Teams, complex role/permission systems, microservices, queues, or caching.
- Permanent deletion of client, project, or task records.
Future features belong to later versions and must not be pulled into V1 without an explicit scope change.

## 5. Core Data Concepts and Relationships
- User/Owner: the account that owns a private workspace.
- Client: a person or company record belonging to one Owner.
- Project: a defined piece of work linked to one Client.
- Task: an actionable work item linked to one Project.
**Relationships:**
- One Owner can have many Clients.
- Owner email addresses are unique across the application.
- Duplicate Client records must be prevented within one Owner's workspace using the approved matching and normalization rules in section 16.
- One Client can have many Projects.
- One Project can have many Tasks.
- Every Client must belong to an Owner.
- A Project can only be linked to a Client belonging to the current Owner.
- A Task can only be created or changed within a Project the current Owner can access.
Ownership values are system-controlled. The backend must not trust an owner_id provided by the frontend request body to decide who owns a record.
## 6. General Rules
1. Private operations require an authenticated Owner.
2. The backend is the authority for validation, business rules, authentication, and authorization. Hiding frontend screens or buttons is not a security control.
3. A successful create or update must persist to the database.
4. Saved records must remain available after an application restart.
5. Required text values must not be accepted as missing or blank.
6. Record identifiers and system-managed timestamps must not be freely overwritten by ordinary create/update requests.
7. Permanent delete operations are not available in V1.
8. API errors must be predictable and documented before implementation is accepted.
## 7. Client Management Requirements
### 7.1 Client fields

| Field | Meaning | Requirement status |
|---|---|---|
| `id` | Unique client identifier | System-managed; generation format to be chosen in design |
| `owner_id` | Owner who owns the record | System-managed; determined from authentication |
| `name` | Client's name | Required; missing or blank value is rejected |
| `email` | Client contact email | Optional; validation and normalization are defined in section 16 |
| `company` | Client's company name | Optional; validation and normalization are defined in section 16 |
| `created_at` | Creation timestamp | System-managed |
| `updated_at` | Most recent update timestamp | System-managed; refreshed after successful update |

### 7.2 Operations
- Create: an authenticated Owner can create a client in their workspace.
- Duplicate prevention: an Owner cannot create or update a client into a duplicate of another client in their workspace. The approved matching rule, normalization, optional-value behavior, and conflict response are defined in section 16.
- List: an Owner receives only their own client records.
- Detail: an Owner can view a client record they own.
- Update: an Owner can update an existing client record they own.
- Delete: no permanent-delete endpoint or UI action in V1.
### 7.3 Validation and authorization
- `name` is required on create; missing or blank names are rejected.
- Updates must not allow the caller to change `id`, `owner_id`, `created_at`, or other system-managed fields.
- Create, list, detail, and update require authentication.
- Client listing must be scoped to the authenticated Owner.
- Client duplicate checks for create and update must be scoped to the authenticated Owner and must not treat another Owner's records as duplicates.
- An update duplicate check compares the resulting client values against other clients owned by the current Owner, excluding the client being updated.
- A caller must not view or modify another Owner's client by supplying or guessing its ID.
- Duplicate create/update attempts return the conflict response defined in section 16.
### 7.4 Client acceptance criteria
Client Management is accepted when tests verify that:
1. An unauthenticated caller cannot use private client operations.
2. An authenticated Owner can create a client with a valid name.
3. A missing or blank name is rejected.
4. An Owner sees only their own clients in list results.
5. An Owner can view and update a client they own.
6. An Owner cannot view or update another Owner's client by supplying its ID.
7. Successful create/update operations persist, and updated_at changes after a successful update.
8. Client records remain available after restart.
9. Permanent deletion is not available in the V1 interface or API.
10. Duplicate clients are rejected on create and update within an Owner's workspace according to the approved matching rule; identical data in different Owners' workspaces remains isolated.
11. Duplicate matching applies the approved normalization consistently to create and update, while null optional values do not match each other.
12. Updating a client without changing its duplicate-key values does not conflict with itself; an update that would duplicate another owned client is rejected without changing the record.
13. A duplicate create or update returns `409 {"detail":"A client with these details already exists"}`.
## 8. Project Management Requirements
### 8.1 Required behavior
- An authenticated Owner can create a project linked to one of their own clients.
- An Owner can list and view only projects they are authorized to access.
- An Owner can update an accessible project.
- A project must have a name.
- A project may have an optional calendar due date, represented as an ISO `YYYY-MM-DD` date with no time-zone conversion.
- A project cannot be linked to a client belonging to another Owner.
- Permanent deletion is not supported in V1.
### 8.2 Project fields
At minimum, a project has a system-managed UUID, an owner-safe `client_id`, a name, a status, an optional date-only due date, and system-managed creation/update timestamps. The Owner is derived through the linked Client and is never accepted from request data.
### 8.3 Approved project decisions
1. **Status and default:** A project's status is one of `planned`, `in_progress`, or `completed`. Create requests may omit status; a new project defaults to `planned`. Null or any other status is invalid.
2. **Transitions and active projects:** Any listed status may transition to any other listed status, including reopening a completed project. Only `in_progress` projects count as active for the dashboard.
3. **Name validation:** Project names are trimmed, required, nonblank, and limited to 255 characters, matching Client name validation.
4. **Due date:** `due_date` is optional and accepts an ISO calendar date (`YYYY-MM-DD`) only. It has no time-of-day or time-zone conversion. It may be set to `null` when updating to clear it. Invalid dates or date-time values are rejected with `422`.
5. **Create and update fields:** Create requires `client_id` and `name`; `status` is optional with the default above; `due_date` is optional and may be null. `PATCH /api/projects/{project_id}` updates supplied fields among `name`, `client_id`, `due_date`, and `status`; an empty patch is invalid. `name`, `client_id`, and `status` cannot be null. `client_id` may be changed only to a client owned by the current Owner. Unknown and system-managed fields (`id`, `owner_id`, `created_at`, `updated_at`) are rejected.
6. **Routes and responses:** `POST /api/projects` creates a project and returns `201`; `GET /api/projects` returns the current Owner's list; `GET /api/projects/{project_id}` reads one project; and `PATCH /api/projects/{project_id}` updates it. Successful reads and updates return `200`. Project responses contain `id`, `client_id`, `name`, `status`, `due_date`, `created_at`, and `updated_at`; `due_date` is serialized as `YYYY-MM-DD` or `null`. Responses do not expose `owner_id`.
7. **List behavior:** The project list is unpaginated and has no filters or client-supplied sorting in V1. Results are ordered newest first, with project ID as a stable tie-breaker, matching the client-list behavior.
8. **Errors and ownership:** Private operations require authentication (`401`). Invalid request fields return `422`. A missing project and a project not owned by the current Owner both return `404 {"detail":"Project not found"}`. A missing or foreign-owned linked client returns `404 {"detail":"Client not found"}`. These responses do not reveal another Owner's records. No project-delete route is provided.
### 8.4 Project acceptance criteria
Tests must prove that:
1. An Owner can create a project linked to their own client.
2. A project cannot be created or moved to a client owned by another Owner.
3. An Owner can list, view, and update only accessible projects.
4. Missing, blank, and overlong names are rejected; surrounding whitespace is trimmed.
5. Status values are restricted to the approved set, new projects default to `planned`, and all transitions including reopening are accepted.
6. Only projects with status `in_progress` count as active in dashboard calculations.
7. Due dates accept valid `YYYY-MM-DD` dates, permit `null`, reject invalid or date-time values, and have no time-zone conversion.
8. PATCH accepts only the documented mutable fields, rejects empty patches and system-managed/unknown fields, and can clear the due date.
9. Project lists are owner-scoped, unpaginated, and newest-first with a stable ID tie-breaker.
10. Missing and foreign-owned projects return the same 404; missing and foreign-owned linked clients return the documented 404.
11. Project data persists after restart.
12. Permanent deletion is unavailable in V1.
## 9. Task Management Requirements
### 9.1 Required behavior
- An authenticated Owner can create a task inside a project they can access.
- An Owner can list/view tasks belonging to accessible projects.
- An Owner can update a task's status.
- A task must have a title.
- Task status is restricted to `todo`, `in_progress`, or `done`.
- A task cannot be created or changed through a project belonging to another Owner.
- Permanent deletion is not supported in V1.
### 9.2 Task fields and API contract
- `id`: system-managed UUID.
- `project_id`: system-managed relationship, inferred from the project route and never accepted from the request body.
- `title`: required, trimmed, nonblank, and at most 255 characters.
- `description`: optional; trimmed; at most 5,000 characters; blank input is stored as `null`.
- `due_date`: optional date-only value in `YYYY-MM-DD` format; `null` is accepted; date-times and invalid calendar dates are rejected.
- `status`: `todo`, `in_progress`, or `done`; omitted on create defaults to `todo`. Any listed status may transition to any other listed status.
- `created_at` and `updated_at`: system-managed UTC timestamps.
- Only status may be updated after creation. Title and description are not editable, and task deletion is unavailable.

### 9.3 Routes, lists, and errors
- `POST /api/projects/{project_id}/tasks` creates a task and returns `201`.
- `GET /api/projects/{project_id}/tasks` returns the project's tasks, unpaginated and newest-first with ID as a stable tie-breaker.
- `GET /api/projects/{project_id}/tasks/{task_id}` returns task details.
- `PATCH /api/projects/{project_id}/tasks/{task_id}` accepts exactly a non-empty `{ "status": ... }` body and returns the updated task.
- Task responses contain `id`, `project_id`, `title`, `description`, `due_date`, `status`, `created_at`, and `updated_at`; they do not expose owner identifiers.
- Every route requires authentication and verifies ownership through project → client → current Owner. Missing and inaccessible projects/tasks return `404` (`Project not found` or `Task not found`); unauthenticated requests return `401`; invalid request data returns `422` using FastAPI's existing validation response format.

### 9.4 Task acceptance criteria
Tests must prove that:
1. An Owner can create and list tasks within an accessible project.
2. A missing or blank task title is rejected.
3. Only `todo`, `in_progress`, and `done` are accepted as task statuses.
4. An Owner can update a task status within an accessible project.
5. Tasks cannot be accessed or changed through another Owner's project.
6. Task data persists after restart.
7. Permanent deletion is unavailable in V1.
8. Create, list, detail, and status-update routes return the documented response shapes and status codes.
9. Optional descriptions and date-only due dates are persisted and validated.
## 10. Dashboard Requirements
All dashboard metrics must be calculated from persisted records belonging to the currently authenticated Owner. Data from another Owner must never be included.

| Metric | Definition |
|---|---|
| Total clients | Number of client records owned by the current Owner |
| Active projects | Count of projects with status `in_progress` |
| Pending tasks | Tasks with status `todo` or `in_progress` |
| Project progress | Completed tasks divided by total tasks, multiplied by 100 |
| Zero-task project | Progress is 0% when the project has no tasks |
| Upcoming deadlines | Show approaching due dates; the exact time window must be finalized |
| Overdue items | Must not be silently hidden; exact grouping and display behavior must be finalized |

Dashboard acceptance requires tests that compare the displayed/returned metrics with the authenticated Owner's actual database records, including zero-task and overdue cases.
## 11. Authentication and Security Requirements
- Only an Owner account created through registration can authenticate in V1.
- Passwords must never be stored in plaintext. Use a suitable password-hashing approach.
- Unauthenticated private API requests must be rejected.
- The backend must establish the current Owner from the authenticated identity.
- Every private API operation, including client, project, task, and dashboard operations, must enforce ownership on database reads and mutations. Ownership must be checked through the relevant relationships (Owner → Client → Project → Task).
- Cross-owner access attempts must not reveal or change another Owner's records.
- Secrets and environment-specific configuration must not be hard-coded in source code.
- The registration, authentication, secure logout behavior, and cookie handling are decided for the Owner/client slice in section 16.
## 12. API Error Contract
The API must return predictable errors for at least:
- Invalid or missing fields.
- Missing records or records the current Owner cannot access.
- Missing/invalid authentication.
- Invalid relationship references, such as linking a project to an inaccessible client.
- Invalid task status values.
The Owner/client response and status contract, including the missing-versus-inaccessible client policy, is documented in section 16. The project response and status contract is documented in section 8.3. The task response and status contract is documented in section 9.3. Dashboard endpoint details remain to be finalized. Regardless of response choice, cross-owner data must not be disclosed or modified.
## 13. Initial Architecture Direction
The initial architecture direction is:
- Frontend: Next.js, responsible for screens, forms, and user interactions.
- Backend: FastAPI, responsible for API validation, authentication, authorization, business rules, and database access coordination.
- Database: SQLite for the initial V1 MVP, responsible for persistent records.
- Communication: frontend and backend communicate through a documented HTTP/JSON API.
- Backend style: a modular monolith (one backend application separated into internal modules), not microservices.
- Repository layout: frontend and backend live in separate directories within one project repository.
The current Owner/client, Project, and Task module boundaries, routes, data rules, and authentication mechanism are documented in the architecture and this specification. Dashboard deadline details remain open.
## 14. Non-Functional Requirements
- Security: server-side authentication and ownership checks are mandatory for private data.
- Persistence: committed records survive application restarts.
- Correctness: business rules and validation have automated tests.
- Maintainability: keep frontend and backend code separate; keep backend responsibilities organized into clear modules.
- Predictability: document API request/response formats and error behavior.
- Scope control: no feature from a later product version is added to V1 without an explicit scope decision.
Performance targets, backup/restore requirements, deployment environment, and production database migration criteria remain to be defined when deployment scope is planned.
## 15. V1 Completion Checklist
V1 is complete when all of the following are verified:
- [ ] An Owner can register, then log in and log out.
- [ ] Owner can create, list, view, and update their own clients.
- [ ] Owner can create, list, view, and update projects linked to their own clients.
- [ ] Owner can create and view tasks and update task status.
- [ ] Client, project, and task relationships are enforced by the backend.
- [ ] Dashboard metrics reflect the current Owner's database records and agreed deadline rules.
- [ ] Data persists after an application restart.
- [ ] Unauthenticated requests cannot access private records.
- [ ] Automated tests deny cross-owner access and cover validation/error cases.
- [ ] V1 has no client portal, payments, AI agent, or permanent-delete operation.
- [ ] All decisions marked as required before implementation have been resolved in the relevant design/API documents.
## 16. Owner and Client Decisions

The following decisions are the approved V1 implementation baseline for Owner registration/authentication and client management. The approved public-registration change supersedes the earlier no-public-signup decision.

1. **Registration:** Multiple Owners may register through `POST /api/auth/register`; each requires `full_name`, `email`, `password`, and `phone_number`. Full name is trimmed, nonblank, and at most 255 characters. Emails are trimmed, validated, normalized to lowercase, and unique across all Owner accounts; passwords must be 12–128 characters. Phone numbers must use E.164 format (`+` followed by 7–15 digits, with a nonzero first digit) and are stored in that format. Successful registration returns `201` with the safe Owner representation (`id`, `full_name`, `email`, `phone_number`, `created_at`, and `updated_at`), does not include password data, and does not create a login session. The user must call `POST /api/auth/login`. There is no public account-management or role-assignment endpoint.
2. **Password storage:** Passwords are hashed with Argon2 through `pwdlib`; plaintext passwords are never persisted.
3. **Authentication and logout:** Login creates a cryptographically random opaque session token. Only its SHA-256 hash is stored in the database. The browser receives the token in an `HttpOnly`, `SameSite=Strict`, path `/` cookie with an eight-hour default lifetime. Logout deletes the stored session and clears the cookie, immediately invalidating that token. `AUTH_COOKIE_SECURE=true` is required when serving over HTTPS; it is false in the local development template.
4. **Authentication errors:** Invalid email and password return the same `401` response. Missing, expired, or logged-out sessions return `401`. Session lookup derives the Owner from the persisted session, never from request data.
5. **Client fields and duplicate detection:** Name is required, trimmed, nonblank, and limited to 255 characters. Email and company are optional. A supplied email must be valid and is trimmed and normalized to lowercase; a blank email is invalid. Company is trimmed, blank company becomes `null`, and its maximum length is 255 characters. Within one Owner's workspace, two clients are duplicates when either (a) both have non-null emails that match after the existing trim/lowercase normalization, or (b) their names and non-null company values match after trimming and case-insensitive comparison. The name-and-company rule applies whether or not either client has an email. Null email values do not match one another; null company values do not match one another and cannot satisfy the name-and-company rule. Duplicate checks use only the authenticated Owner's records. Create or update attempts that would produce a duplicate return `409 {"detail":"A client with these details already exists"}`.
6. **Identifiers and timestamps:** User and client identifiers are server-generated UUIDs. Created and updated timestamps are UTC and serialized as ISO 8601 UTC. Client timestamps and identifiers cannot be changed through client requests.
7. **Client updates:** `PATCH /api/clients/{client_id}` updates only supplied `name`, `email`, and `company` fields. An empty patch is invalid. Email and company may be set to `null`; name may not. Unknown/system-managed fields are rejected.
8. **Client list behavior:** `GET /api/clients` is owner-scoped and ordered newest first, with identifier as a stable tie-breaker. Pagination, sorting options, and filters are deferred.
9. **Error and missing-record contract:** Request validation uses FastAPI's `422` validation response. Duplicate registration email returns `409 {"detail":"An owner with this email already exists"}`. Duplicate client create or update returns `409 {"detail":"A client with these details already exists"}`. Invalid login credentials return the same `401` response. Unauthenticated private operations return `401`. A client that is missing and a client owned by another Owner both return `404 {"detail":"Client not found"}` so the API does not disclose whether a foreign record exists. Client deletion is not exposed (`405`).
10. **Routes:** `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`, `POST /api/clients`, `GET /api/clients`, `GET /api/clients/{client_id}`, and `PATCH /api/clients/{client_id}`. No public delete or role-management route is provided.

### 16.1 Decision rationale

- A persisted opaque session is chosen over a self-contained token so logout can revoke access immediately. The browser token is high-entropy and only its digest is stored, limiting exposure if the session table is read.
- Argon2 is selected through the existing `pwdlib[argon2]` dependency because passwords require a deliberately slow, salted password hash. Registration hashes passwords before persistence; API transport must use HTTPS outside local development. A 12-character minimum raises the cost of guessing.
- Full name and phone number are nullable in the database only to preserve existing accounts when the profile migration is applied. New registrations must provide both validated values; the safe response exposes `null` for legacy accounts that predate these fields.
- Registration intentionally does not create a session, so account creation and authentication remain separate operations. The unique database constraint remains authoritative if concurrent requests attempt the same email.
- `HttpOnly` prevents ordinary browser scripts from reading the session cookie, `SameSite=Strict` reduces cross-site request forgery risk, and `Secure` is enabled for HTTPS deployments. The local HTTP development template disables `Secure` so the cookie works on localhost.
- Returning the same `404` for missing and foreign-owned clients avoids confirming another Owner's record exists. Backend queries still apply the Owner filter before returning or changing a client.
- Client duplicate detection uses a non-null normalized email as one duplicate key, and a non-null normalized name/company pair as another. Name/company matching is case-insensitive after trimming. This permits multiple clients with the same name when company is absent, while preventing a repeated email or repeated name-and-company pair within one Owner's workspace. Null optional values do not create matches. The same `409` response is used for create and update conflicts.
- UTC timestamps and UUID identifiers provide consistent API timestamps and non-sequential resource identifiers. Pagination is deferred to keep the initial client list simple while the dataset is small.

## 17. Decisions Still Open

1. Handling of duplicate client records that already exist when duplicate enforcement is introduced. Recommendation: preserve existing records without automatic merge or deletion; enforce the rule for new creates and updates, and separately report any pre-existing duplicate data for an owner-approved resolution.
2. Concurrency handling for simultaneous client create/update requests that would otherwise pass separate duplicate checks. Recommendation: enforce the check within the write transaction and add a database-level safeguard where feasible; if the compound rule cannot be expressed safely as a constraint, document and test the chosen transaction/locking behavior.
3. Task due-date, editable-field, and status-transition rules are decided in section 9.2.
4. Dashboard deadline window, time-zone handling, and overdue display behavior.
5. Task list behavior is decided in section 9.3.
6. Delete/archive policy; permanent deletion remains excluded from V1.
7. Backups and future production database/deployment requirements.

## 18. Next Step
Owner/client, Project, and Task contracts are documented in sections 16, 8.3, and 9. Task implementation follows the Task API and acceptance criteria in section 9. Dashboard deadline and deployment decisions remain open and must be resolved before their respective implementation milestones. Continue in small, testable increments; do not implement unresolved behavior by assumption.
