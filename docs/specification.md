# ClientPilot V1 — Software Specification

| Document detail | Value |
|---|---|
| Product | ClientPilot |
| Version | V1 |
| Status | Working draft — review before architecture and implementation |
| Product baseline | `ClientPilot_V1_Product_Overview_and_User_Guide.pdf` |
| Initial technology direction | Next.js frontend + FastAPI backend + SQLite database |

## 1. Purpose
ClientPilot V1 is a private workspace for a freelancer or small-agency owner to organize existing clients, their projects, project tasks, deadlines, and delivery progress in one place.

ClientPilot V1 does not find clients, run a client/provider marketplace, or give business clients their own accounts. A business client is a contact record managed by the Owner.

## 2. Goals and Success Criteria
V1 should allow its Owner to:
1. Log in to a private workspace and log out securely.
2. Create, list, view, and update client records.
3. Create, list, view, and update projects linked to their own clients.
4. Create and view tasks within accessible projects and update task status.
5. See dashboard counts, task-based progress, pending tasks, and deadlines.
6. Close and restart the application without losing saved records.
7. Be prevented from accessing another Owner's private records, including by guessing record IDs.
V1 is successful when the above behaviors work and are covered by automated tests, including invalid-input and cross-owner-access cases.

## 3. Users and Access Model
### 3.1 Owner
The Owner is the single type of application user in V1. The Owner signs in and manages their own workspace.

### 3.2 Business client
A business client is a contact record stored by an Owner. Business clients do not sign in and do not receive a portal or dashboard in V1.

### 3.3 Account provisioning
Public signup is out of scope. An initial Owner account must be provisioned through a controlled method. The exact provisioning method and authentication strategy must be decided before authentication is implemented.

## 4. V1 Scope
### 4.1 Included
- Owner login and logout.
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
- Business-client accounts, client portal, or public signup.
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
| `email` | Client contact email | Optionality and validation rules must be finalized |
| `company` | Client's company name | Optionality and validation rules must be finalized |
| `created_at` | Creation timestamp | System-managed |
| `updated_at` | Most recent update timestamp | System-managed; refreshed after successful update |

### 7.2 Operations
- Create: an authenticated Owner can create a client in their workspace.
- List: an Owner receives only their own client records.
- Detail: an Owner can view a client record they own.
- Update: an Owner can update an existing client record they own.
- Delete: no permanent-delete endpoint or UI action in V1.
### 7.3 Validation and authorization
- `name` is required on create; missing or blank names are rejected.
- Updates must not allow the caller to change `id`, `owner_id`, `created_at`, or other system-managed fields.
- Create, list, detail, and update require authentication.
- Client listing must be scoped to the authenticated Owner.
- A caller must not view or modify another Owner's client by supplying or guessing its ID.
- The exact API response format and status code for each validation, missing-record, and unauthorized case must be finalized in the API error contract.
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
## 8. Project Management Requirements
### 8.1 Required behavior
- An authenticated Owner can create a project linked to one of their own clients.
- An Owner can list and view only projects they are authorized to access.
- An Owner can update an accessible project.
- A project must have a name.
- A project may have a due date; exact date/time handling must be defined before implementation.
- A project cannot be linked to a client belonging to another Owner.
- Permanent deletion is not supported in V1.
### 8.2 Project fields to define in the data design
At minimum, a project needs a system-managed identifier, owner-safe client relationship, name, optional due date, creation/update timestamps, and any agreed status field.
### 8.3 Open project decisions
Before project implementation, finalize:
- Project status values and allowed transitions (the product overview says these are to be finalized in detailed design).
- Which fields may be updated and whether update requests use PUT, PATCH, or a clearly defined equivalent.
- Name validation rules and due-date format/time-zone behavior.
- Exact API error response contract.
### 8.4 Project acceptance criteria
Tests must prove that:
1. An Owner can create a project linked to their own client.
2. A project cannot be created or moved to a client owned by another Owner.
3. An Owner can list, view, and update only accessible projects.
4. A project must have a valid name.
5. Project data persists after restart.
6. Permanent deletion is unavailable in V1.
## 9. Task Management Requirements
### 9.1 Required behavior
- An authenticated Owner can create a task inside a project they can access.
- An Owner can list/view tasks belonging to accessible projects.
- An Owner can update a task's status.
- A task must have a title.
- Task status is restricted to `todo`, `in_progress`, or `done`.
- A task cannot be created or changed through a project belonging to another Owner.
- Permanent deletion is not supported in V1.
### 9.2 Task fields to define in the data design
At minimum, a task needs a system-managed identifier, project relationship, title, status, creation/update timestamps, and an optional due date if due dates are confirmed for tasks in V1.
### 9.3 Open task decisions
Before task implementation, finalize:
- Whether tasks have a due date in V1 and its exact behavior.
- Whether title and other task fields can be edited after creation, beyond status changes.
- Whether any status transitions are restricted or all listed statuses may transition to one another.
- Exact API error response contract.
### 9.4 Task acceptance criteria
Tests must prove that:
1. An Owner can create and list tasks within an accessible project.
2. A missing or blank task title is rejected.
3. Only `todo`, `in_progress`, and `done` are accepted as task statuses.
4. An Owner can update a task status within an accessible project.
5. Tasks cannot be accessed or changed through another Owner's project.
6. Task data persists after restart.
7. Permanent deletion is unavailable in V1.
## 10. Dashboard Requirements
All dashboard metrics must be calculated from persisted records belonging to the currently authenticated Owner. Data from another Owner must never be included.

| Metric | Definition |
|---|---|
| Total clients | Number of client records owned by the current Owner |
| Active projects | Count of projects classified as active; the status values and definition of active must be finalized with project statuses |
| Pending tasks | Tasks with status `todo` or `in_progress` |
| Project progress | Completed tasks divided by total tasks, multiplied by 100 |
| Zero-task project | Progress is 0% when the project has no tasks |
| Upcoming deadlines | Show approaching due dates; the exact time window must be finalized |
| Overdue items | Must not be silently hidden; exact grouping and display behavior must be finalized |

Dashboard acceptance requires tests that compare the displayed/returned metrics with the authenticated Owner's actual database records, including zero-task and overdue cases.
## 11. Authentication and Security Requirements
- Only a provisioned Owner account can authenticate in V1; public signup is out of scope.
- Passwords must never be stored in plaintext. Use a suitable password-hashing approach.
- Unauthenticated private API requests must be rejected.
- The backend must establish the current Owner from the authenticated identity.
- All database queries and mutations must enforce ownership where applicable.
- Cross-owner access attempts must not reveal or change another Owner's records.
- Secrets and environment-specific configuration must not be hard-coded in source code.
- The authentication mechanism (session-based or token-based), secure logout behavior, cookie/token handling, and initial account provisioning method must be decided in the architecture/security design before implementation.
## 12. API Error Contract
The API must return predictable errors for at least:
- Invalid or missing fields.
- Missing records or records the current Owner cannot access.
- Missing/invalid authentication.
- Invalid relationship references, such as linking a project to an inaccessible client.
- Invalid task status values.
The exact response body schema, status-code mapping, and policy for distinguishing a truly missing record from a record owned by someone else must be documented in the API contract before implementation is accepted. Regardless of response choice, cross-owner data must not be disclosed or modified.
## 13. Initial Architecture Direction
The initial architecture direction is:
- Frontend: Next.js, responsible for screens, forms, and user interactions.
- Backend: FastAPI, responsible for API validation, authentication, authorization, business rules, and database access coordination.
- Database: SQLite for the initial V1 MVP, responsible for persistent records.
- Communication: frontend and backend communicate through a documented HTTP/JSON API.
- Backend style: a modular monolith (one backend application separated into internal modules), not microservices.
- Repository layout: frontend and backend live in separate directories within one project repository.
The detailed module boundaries, API routes, database schema, and authentication mechanism belong in the architecture and implementation design documents.
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
- [ ] Provisioned Owner can log in and log out.
- [ ] Owner can create, list, view, and update their own clients.
- [ ] Owner can create, list, view, and update projects linked to their own clients.
- [ ] Owner can create and view tasks and update task status.
- [ ] Client, project, and task relationships are enforced by the backend.
- [ ] Dashboard metrics reflect the current Owner's database records and agreed deadline rules.
- [ ] Data persists after an application restart.
- [ ] Unauthenticated requests cannot access private records.
- [ ] Automated tests deny cross-owner access and cover validation/error cases.
- [ ] V1 has no public signup, client portal, payments, AI agent, or permanent-delete operation.
- [ ] All decisions marked as required before implementation have been resolved in the relevant design/API documents.
## 16. Decisions to Finalize Before Implementation
1. Authentication strategy and logout behavior.
2. Initial Owner provisioning method.
3. Whether email and company are optional, and their validation rules.
4. Client/project/task update semantics and allowed fields.
5. Project status values and status transitions.
6. Task due-date support and status-transition rules.
7. Deadline window, time-zone handling, and overdue display behavior.
8. API error response schema and status-code mapping.
9. List pagination, sorting, and filtering behavior.
10. Delete/archive policy; permanent deletion remains excluded from V1.
11. Local SQLite setup, backups, and future production deployment/database requirements.
## 17. Next Step
After reviewing this specification and resolving decisions needed for the first implementation milestone, create docs/architecture.md with:
1. High-Level Design (HLD): components and request/data flow.
2. Low-Level Design (LLD): backend modules, entity relationships, and API boundaries.
3. A first implementation milestone with tests and explicit acceptance criteria.
Implementation should then proceed in small, testable milestones. Do not generate the whole application in one step.
