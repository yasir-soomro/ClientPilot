# ClientPilot V1 — Software Specification

| Document detail | Value |
|---|---|
| Product | ClientPilot |
| Version | V1 |
| Status | Approved V1 requirements baseline, including CD-001 and CD-002; implementation is in progress and unresolved design details are listed in section 17 |
| Product baseline | Source-derived overview; approved V1 clarifications in this specification supersede it |
| Initial technology direction | Next.js frontend + FastAPI backend + SQLite database |

## 1. Purpose
ClientPilot V1 has a public single-page landing experience and a private workspace for a freelancer or small-agency Owner to organize existing clients, their projects, project tasks, deadlines, and delivery progress in one place.

ClientPilot V1 does not find clients, run a client/provider marketplace, or give business clients their own accounts. A business client is a contact record managed by the Owner.

## 2. Goals and Success Criteria
V1 should allow its Owner to:
1. Explore the public landing page without signing in; register or sign in as an Owner using an approved V1 method and log out securely.
2. Verify email ownership when required by the selected sign-in method.
3. Use a private workspace only after authentication and required email verification; each Owner can access only their own data.
4. Create, list, view, and update multiple client records without duplicates within that Owner's workspace.
5. Create, list, view, and update projects linked to their own clients.
6. Create and view tasks within accessible projects and update task status.
7. See dashboard counts, task-based progress, pending tasks, and deadlines.
8. Close and restart the application without losing saved records.
9. Be prevented from accessing another Owner's private records, including by guessing record IDs.
V1 is successful when the above behaviors work and are covered by automated tests, including invalid-input and cross-owner-access cases.

## 3. Users and Access Model
### 3.1 Owner
Owners are the application's account users in V1. Multiple Owners can register, each with a unique email address, and each Owner signs in to manage a private workspace. An Owner can access only records belonging to that workspace.

### 3.2 Business client
A business client is a contact record stored by an Owner. Business clients do not sign in and do not receive a portal or dashboard in V1.

### 3.3 Account registration and sign-in

V1 supports public Owner registration and sign-in using email/password, Google, or GitHub. Email/password registration requires email OTP verification before private workspace access. A provider-verified email from Google or GitHub satisfies this requirement; when the provider response does not establish email verification, ClientPilot requires its own email OTP. Phone-number verification and SMS OTP are not required.

The existing email/password profile requirements remain in force: registration requires full name, email, password, and an E.164 phone number. This is a phone-number collection requirement, not a phone verification requirement. Whether social sign-in onboarding must collect a phone number when the provider does not supply one is unresolved; see section 17.

Business clients are never account users. A provider identity is associated using its stable provider identity, not email alone. Existing Owner accounts are not automatically merged or linked based only on matching email addresses. Detailed authentication decisions are in section 16.2.

### 3.4 Public landing page and navigation (CD-001)

The public experience is one landing page. Home, Features, and About are in-page sections, not separate marketing routes. The logged-out navigation shows the ClientPilot brand, Home, Features, About, Login, and Register. When an Owner is signed in, Home, Features, and About remain available and the navigation provides Dashboard and account/logout controls while hiding or replacing Login/Register as appropriate. The page includes a hero, product-relevant visual, concise benefits, How It Works content, a call to action, and a footer. Use `frontend/public/ClientPilot.png` as the hero asset unless the Owner approves a replacement. Public previews use sample/static content only and must not expose an Owner's workspace data.

## 4. V1 Scope
### 4.1 Included
- Public single-page landing experience and navigation as defined in section 3.4.
- Owner email/password registration with email OTP verification, Google/GitHub sign-in, and secure logout as defined in sections 11 and 16.2.
- Client create, list, detail, and update.
- Project create, list, detail, and update.
- Task create and list/view.
- Task status update.
- Dashboard metrics and deadline overview.
- Persistent database storage.
- Input validation and predictable API errors.
- Server-side authentication, authorization, and record ownership checks.
- Private workspace access gated by authentication and required email verification, independently of frontend navigation state.
- Automated tests for successful operations, validation failures, missing records, authentication failures, and cross-owner access attempts.
### 4.2 Excluded
- Business-client accounts or a client portal.
- Marketplace or client/provider matching.
- In-app chat, notifications, file uploads, or approval/revision workflow.
- Invoices, payments, or escrow.
- AI agents, automatic project planning, or AI recommendations.
- Teams, complex role/permission systems, microservices, queues, or caching.
- Permanent deletion of client, project, or task records.
- Phone-number verification and SMS OTP.
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

The approved authentication requirements are recorded in section 16.2. This section defines required security properties; concrete OTP/provider/API details that remain open are listed in section 17 and must be settled in the existing architecture/LLD before implementation.

- Supported V1 sign-in methods are email/password, Google OAuth/OIDC, and GitHub OAuth.
- Email/password accounts must verify their email address through ClientPilot email OTP before receiving private workspace access. A Google/GitHub identity with a provider-verified email satisfies this requirement. If the provider response does not establish verified ownership of the email, require ClientPilot email OTP before private access.
- Provider identity is based on the stable provider identity (provider and provider user ID), never email alone. Do not automatically merge or link accounts because email addresses match.
- Passwords must never be stored in plaintext. Continue using the approved Argon2 password-hashing design for password accounts.
- Existing linked provider identities authenticate their associated Owner. Linking an unlinked provider to an existing Owner requires authentication to that Owner account, an explicit action in account settings, fresh provider authorization, and appropriate re-authentication. A provider identity already linked to another Owner cannot be linked again through this flow.
- OTPs must be one-time, expire, be stored/protected safely, and have resend throttling and attempt limits. Exact format, durations, thresholds, storage representation, and delivery-failure behavior remain open until the LLD is approved.
- OAuth callbacks must validate provider responses and restrict redirect destinations. Exact callback, state/CSRF, and session-handling mechanics are defined in the LLD.
- A private API request is authorized only when the session is valid and the Owner has met the email-verification requirement. Authentication and verification checks are backend-enforced on every private operation, including client, project, task, and dashboard operations. Ownership is checked through Owner → Client → Project → Task as relevant.
- The public landing page and its navigation are not a security boundary. A direct request to a private page must not expose Owner data before the backend has confirmed an authenticated, email-verified Owner. Private APIs independently enforce that same gate and ownership.
- Cross-owner access attempts must not reveal or change another Owner's records. Secrets and environment-specific configuration must not be hard-coded in source code.
- Preserve the approved session design in section 16: opaque high-entropy token, only its SHA-256 hash persisted, `HttpOnly`, `SameSite=Strict`, path `/`, eight-hour default lifetime, `Secure` on HTTPS, and immediate revocation on logout. Successful verified password and provider sign-in use this server-managed session unless an approved decision supersedes it.
## 12. API Error Contract
The API must return predictable errors for at least:
- Invalid or missing fields.
- Missing records or records the current Owner cannot access.
- Missing/invalid authentication.
- Invalid relationship references, such as linking a project to an inaccessible client.
- Invalid task status values.
The Owner/client response and status contract, including the missing-versus-inaccessible client policy, is documented in section 16. The project response and status contract is documented in section 8.3. The task response and status contract is documented in section 9.3. The OTP, provider callback, account-linking, and unverified-account response contracts and dashboard endpoint details remain to be finalized in the LLD/API contract before implementation. Regardless of response choice, cross-owner data must not be disclosed or modified.
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
- [ ] Email/password Owners must complete email OTP verification before private access.
- [ ] Google and GitHub sign-in validate provider identity server-side; unverified provider emails go through ClientPilot email OTP.
- [ ] Matching email addresses never auto-link Owner accounts; provider linking follows the explicit authenticated flow in section 16.2.
- [ ] Private pages/APIs do not expose Owner data before authentication and required email verification; backend checks are independent of navbar state.
- [ ] The public landing page has the approved Home, Features, and About sections and adapts navigation to signed-in state.
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

### 16.2 Approved V1 authentication and public-experience decisions (CD-001 and CD-002)

This subsection records the approved amendments supplied for CD-001 and CD-002 in the existing specification so there is one in-repository decision source. These amendments extend V1 and supersede older wording that limited Owner sign-in to email/password or omitted the public landing-page navigation requirements. They do not change the settled client, project, task, or session contracts in sections 7–9 and 16.

1. **Email/password registration and phone number:** Email/password registration continues to require `full_name`, `email`, `password`, and `phone_number`. The phone number is trimmed, validated as E.164, and collected as an Owner profile field. Phone verification and SMS OTP are not required. This preserves the existing approved collection rule and treats collection separately from verification. Existing legacy accounts may retain null profile fields as specified in section 16.
2. **Email verification:** A newly registered email/password Owner remains ineligible for private workspace access until a valid ClientPilot email OTP has verified the address. Verification is required before Dashboard or private API access. No email/password path may bypass this gate.
3. **Google/GitHub sign-in:** Google OAuth/OIDC and GitHub sign-in are included in V1. The backend validates provider responses and uses the provider's stable user ID with the provider as identity key. A trusted provider-verified email satisfies the email-verification gate; otherwise ClientPilot email OTP is required before private access.
4. **Account linking:** Never auto-link or merge Owner accounts solely because their emails match. An existing linked provider identity authenticates its associated Owner. Linking a new provider to an existing Owner requires an authenticated existing account, an explicit account-settings action, fresh provider authorization, and appropriate re-authentication. A provider identity already linked to another Owner cannot be linked to a second Owner through this flow.
5. **Sessions:** Preserve the existing persisted opaque-session design: cryptographically random token, SHA-256 token hash stored in the database, browser cookie marked `HttpOnly` and `SameSite=Strict` at path `/`, eight-hour default lifetime, `Secure` for HTTPS, and server-side revocation on logout. Password and provider sessions are server-issued and are created only after the corresponding sign-in and verification requirements are met. The backend resolves the Owner from the session, never request data.
6. **Private access:** Backend authorization independently checks session validity, required email verification, and owner-scoped resource access on every private API. The Next.js workspace shell may use the current-owner API to decide what to render and where to navigate, but it is only a user-experience guard. Direct navigation and altered client-side state must never expose private Owner data.
7. **Public experience:** The marketing site is one public landing page with in-page Home, Features, and About sections. Logged-out navigation provides the brand, section links, Login, and Register. Signed-in navigation retains the public section links and provides Dashboard and account/logout controls instead of Login/Register. The hero uses `frontend/public/ClientPilot.png` unless an alternative is approved. Public examples/previews are static/sample data only. The page includes product benefits, a How It Works section, a CTA, and a footer.
8. **No phone verification:** CD-002 excludes phone verification/SMS OTP. It does not revoke the existing phone-number collection requirement for email/password registration. Whether social-provider onboarding must collect a phone number when the provider does not supply one is not specified and remains open in section 17.

## 17. Decisions Still Open

The following details are not settled by CD-001/CD-002 or the existing feature contracts. Resolve only the decisions needed for the next milestone; do not reopen sections 7–9 or the approved session-cookie design.

### 17.1 Authentication LLD and API details required before CD-002 implementation

1. OTP format, lifetime, resend cooldown/limits, attempt limits, safe storage/cleanup, and email-delivery provider/failure/retry behavior.
2. Registration and verification response/status contracts, duplicate-email disclosure behavior, and whether successful OTP verification creates a session or requires a separate password login. In all cases, no private access is allowed before verification.
3. Whether first-time Google/GitHub sign-in provisions a new Owner, which profile fields it requires, and whether social onboarding must collect a phone number when the provider does not supply one. For email/password registration, phone collection remains required as recorded in 16.2; phone verification remains excluded.
4. Provider scopes/configuration, callback and CSRF/state mechanics, provider failure behavior, safe redirect allowlist, and re-authentication details for account linking.
5. Account recovery, password reset/change, changing a verified email, and lost-provider access behavior.
6. Database representation/migration for email verification state, OTP challenges, and provider identities, including compatibility for existing password accounts. Exact records must support the stable-provider-identity and no-auto-link rules.

### 17.2 Other unresolved V1 decisions

1. Dashboard deadline window, date/time-zone boundaries, overdue grouping and display, and which project/task deadline types appear together.
2. Dashboard API endpoint/response contract and its error behavior.
3. Backups, deployment environment, production database/migration, and performance targets when release deployment is planned.

The project-status, client, task-field, task-transition, task-list, and session-cookie decisions already recorded in sections 8.3, 9, and 16 are settled and are not reopened by this list.

## 18. Next Step
Owner/client, Project, Task, and authentication/public-experience requirements are documented in sections 7–9 and 16. Before implementing the CD-002 authentication extension, finalize the authentication LLD/API decisions in section 17.1. Resolve section 17.2 dashboard decisions before dashboard deadline implementation. Continue in small, testable increments; do not implement unresolved behavior by assumption.
