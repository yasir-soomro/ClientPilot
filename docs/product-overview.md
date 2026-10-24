# ClientPilot V1 — Product Overview and User Guide

> **Source:** Converted and structured from `ClientPilot_V1_Product_Overview_and_User_Guide.pdf`.
>
> **Document status:** Draft 0.1 — requirements still need to be finalized.
>
> **Version scope:** ClientPilot V1 only. Future product versions must be planned separately.
>
> **Current requirements:** Approved V1 clarifications in the [software specification](./specification.md) supersede this source-derived overview where they differ.

## 1. Project Baseline

| Item | Definition |
|---|---|
| Product | ClientPilot |
| Version | V1 |
| Product model | Model A — personal client/project management workspace |
| Primary user | Freelancer or small-agency owner |
| Initial stack direction | Next.js + FastAPI + SQLite |
| Document status | Draft 0.1 — requirements to finalize |

## 2. Product Purpose

ClientPilot V1 is a private workspace where a freelancer can:

- Keep records of existing business clients.
- Create projects linked to those clients.
- Break projects into actionable tasks.
- Track task status, deadlines, and progress.
- Review workload and upcoming deadlines on a dashboard.

ClientPilot V1 does **not** find new clients or provide a marketplace where clients can select service providers.

**Core idea:** The freelancer already has a client, records that client in ClientPilot, then organizes and tracks the work through delivery.

## 3. Problems the Product Solves

| Current problem | ClientPilot V1 response | Intended benefit |
|---|---|---|
| Client details are spread across WhatsApp, email, or notes. | Keep each client's record in one place. | Client information is easier to find. |
| It is difficult to remember which projects belong to each client. | Link projects to client records. | See each client's active work clearly. |
| Work is tracked mentally or in informal to-do lists. | Track tasks and statuses inside each project. | See pending, ongoing, and completed work. |
| Deadlines can be missed. | Store project/task due dates and show upcoming deadlines on the dashboard. | Understand priorities and next actions. |
| Temporary data may be lost after the app closes or restarts. | Persist records in a database. | Saved records remain available. |
| Weak permissions could expose private client data to another user. | Require login and enforce ownership on the server. | Each owner accesses only their own records. |

## 4. Intended Users and Account Model

### 4.1 Intended users

- Freelancers delivering websites, backend systems, design, automation, or other services.
- Solo consultants or small agencies organizing work for existing clients.
- Owners who want a private dashboard for tracking projects and delivery.

### 4.2 Owner versus business client

- The **Owner** is the account user who logs in and uses the application.
- A **business client** is a contact record stored in the owner's workspace.
- Business clients do not receive their own logins or dashboards in V1.
- Multiple Owners may register with unique email addresses. A visitor cannot access private dashboards or records without authentication.

## 5. Owner User Journey

Example: Ali contacts the freelancer on WhatsApp to request a website. The freelancer uses ClientPilot to organize and deliver Ali's project.

1. **Register and log in:** An Owner registers with a unique email address, then signs in to their private workspace.
2. **Add a client:** The owner opens Clients, chooses Add Client, enters the required details, and saves the record. Example: name `Ali`, email `ali@example.com`, company `Ali Clothing`.
3. **Create a project:** The owner creates a project linked to Ali's client record, enters a project name, and optionally sets a due date. Example: `Ali Clothing Website`.
4. **Create tasks:** The owner divides delivery work into actionable tasks. Examples: Homepage design, frontend build, FastAPI integration, and testing.
5. **Update task status:** When work starts, a task can become `in_progress`; when finished, it can become `done`. Example flow: `todo` -> `in_progress` -> `done`.
6. **Review the dashboard:** The owner reviews client/project/task counts, incomplete work, and upcoming deadlines. If 2 of 4 tasks are done, task-based project progress is 50%.
7. **Log out:** The owner logs out after finishing, especially when using a shared device.

## 6. Typical Daily Routine

1. Log in and review pending tasks and upcoming deadlines.
2. Add a new client record when needed and create a project for agreed work.
3. Break projects into tasks, assign due dates, and update statuses as work progresses.
4. Review progress and overdue items, decide the next action, then log out.

## 7. Screen-by-Screen Overview

| Screen | Owner activity | Expected result |
|---|---|---|
| Login | Enter email and password. | An authenticated owner session. |
| Dashboard | Review counts, incomplete tasks, and upcoming deadlines. | A quick overview of workload. |
| Clients | Create, list, view details, and update clients. | Client records in one place. |
| Projects | Create, list, view details, and update projects. | Work organized by client. |
| Tasks | Create tasks within projects and update task status. | Daily work can be tracked. |

## 8. Core System Rules

### 8.1 Authentication

Only an authenticated owner may perform private operations.

### 8.2 Client ownership

Each Owner has a private workspace and may view or update only their own client records. Duplicate clients are not allowed within one Owner's workspace; the matching rule must be finalized in the detailed specification.

### 8.3 Project-client relationship

When creating a project, the selected client must belong to the current owner.

### 8.4 Task-project relationship

A task may be created or updated only within a project the current owner is allowed to access.

### 8.5 Required fields

- Client name is required.
- Project name is required.
- Task title is required.

### 8.6 Allowed task statuses

Only these task status values are defined for V1:

- `todo`
- `in_progress`
- `done`

### 8.7 Progress calculation

- If a project has zero tasks, progress is `0%`.
- Otherwise: `completed tasks / total tasks * 100`.

### 8.8 Persistence

Successful create/update operations must save data to the database.

### 8.9 Errors

Invalid input, missing records, and unauthorized access must produce predictable responses. Exact API error schemas remain to be finalized in the detailed specification.

## 9. Data Model and Relationships

| Entity | Meaning |
|---|---|
| User | The owner account. |
| Client | The person or company receiving services. |
| Project | A defined piece of work linked to a client. |
| Task | An actionable part of a project. |

Relationships:

- Multiple Owners can register with distinct email addresses; each has a private workspace.
- One Owner can have multiple clients, without duplicate client records in that workspace.
- One client can have multiple projects.
- One project can have multiple tasks.

Conceptually:

```text
User (Owner)
  └── many Clients
        └── many Projects
              └── many Tasks
```

## 10. Dashboard Metrics

| Metric | Meaning | V1 rule / note |
|---|---|---|
| Total clients | Number of client records owned by the signed-in owner. | Count only the current owner's clients. |
| Active projects | Projects currently being worked on. | Exact project status values must be finalized in LLD; an active status is initially proposed. |
| Pending tasks | Tasks that are not done. | Count both `todo` and `in_progress`. |
| Upcoming deadlines | Due dates approaching soon. | Exact time window remains to be defined. Overdue items should not be hidden. |
| Project progress | Portion of tasks completed. | `completed tasks / total tasks * 100`; zero tasks = `0%`. |

## 11. Initial Architecture Direction

The initial stack direction is **Next.js + FastAPI + SQLite**.

| Layer | Responsibility | Example |
|---|---|---|
| Frontend — Next.js | Screens and forms used by the owner. | Add Client form; task-status button. |
| Backend — FastAPI | Validate requests, authenticate users, enforce permissions, and apply business rules. | Verify that the selected client belongs to the current owner. |
| Database — SQLite initially | Persist clients, projects, and tasks. | Ali's client record remains after the app restarts. |

**Architecture principle:** The frontend provides the interface, the backend enforces rules, and the database stores records. Hiding a screen in the frontend is not sufficient security; the backend must authorize every private request.

This document defines the initial stack direction only. Exact module structure, API contracts, authentication strategy, and deployment details must be defined in the architecture and detailed specification documents.

## 12. Features Included in V1

- Controlled owner-account setup and secure login/logout.
- Client records: create, list/view, and update.
- Projects: create,pro list/view, and update; each project is linked to a client.
- Tasks: create, list/view, and update task status; each task is linked to a project.
- Dashboard counts, task-based progress, and upcoming deadlines.
- Database persistence, input validation, and ownership enforcement.
- Tests for normal operations and security edge cases.

## 13. Features Excluded from V1

The following are not included in V1:

- Business-client login accounts or a client portal.
- Business-client signup, a provider marketplace, or client-provider matching. Public Owner registration is included in V1.
- In-app chat, notifications, file uploads, or approval/revision workflows.
- Invoices, payment processing, or escrow.
- AI agents, automatic project planning, or AI-based recommendations.
- Teams, complex role permissions, microservices, queues, or caching.
- Permanent client/project deletion is not part of the initial V1 scope; the source document recommends omitting it for data safety until a deletion policy is finalized.

## 14. Security and Error-Handling Expectations

- Passwords must not be stored in plaintext; use suitable password hashing.
- Reject private API requests without authentication.
- Guessing a client/project/task ID must not reveal or modify another owner's data.
- Invalid fields should produce validation errors.
- A missing record that the owner is allowed to access should produce a not-found response.
- Invalid credentials should produce a generic authentication error.
- Secrets and environment-specific settings must not be hard-coded into source code.

## 15. V1 Acceptance Criteria

V1 is considered complete when all of the following are verified:

- The owner can log in and log out using valid credentials.
- Multiple Owners can register with unique email addresses and access only their own workspaces.
- The owner can create, view, and update clients.
- An Owner cannot create duplicate clients within their workspace under the approved matching rule.
- The owner can create a project for their own client, but not for another owner's client.
- The owner can create tasks within a project and update task status.
- The dashboard calculates counts and progress from actual database records.
- Client, project, and task records remain available after the app restarts.
- Unauthenticated requests cannot access private data.
- Cross-owner access tests confirm unauthorized data access is denied.
- Validation and not-found errors are predictable and documented.

## 16. Decisions That Must Be Finalized Before Implementation

The source PDF explicitly leaves these decisions open for the detailed specification / LLD:

- Which client fields and normalization rules determine whether records are duplicates within one Owner's workspace.
- Exact project status values and allowed status transitions.
- Client/project update fields and validation requirements.
- Deletion/archival policy.
- Upcoming-deadline time window and overdue-item behavior.
- Authentication strategy (session-based or token-based) and initial owner-account provisioning.
- List pagination, sorting/filtering, and API error-response format.
- Production database and deployment requirements after the initial local SQLite MVP.

Do not silently treat these open decisions as settled requirements. Record and resolve them in the appropriate project document before implementing behavior that depends on them.

## 17. Recommended Development Sequence

The source PDF recommends this order:

1. Treat this overview as the product baseline.
2. Create a detailed `specification.md` defining each feature's exact inputs, outputs, validation, error cases, and acceptance tests.
3. Design HLD/LLD.
4. Create an implementation plan.
5. Implement and test in small milestones.

---

## Source and interpretation notes

- This Markdown file is a structured, AI-readable conversion of the supplied **ClientPilot V1 Product Overview & User Guide, Draft 0.1** PDF.
- Product scope, rules, metrics, and acceptance criteria above are derived from that PDF.
- Where the PDF leaves a decision open, this file preserves it as unresolved instead of inventing an answer.
