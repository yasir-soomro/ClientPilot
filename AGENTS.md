# ClientPilot — AI Coding Agent Instructions

Read these instructions before planning or changing code in this repository.

## 1. Read Project Context First

1. Read `docs/product-overview.md` for the product baseline extracted from the supplied PDF.
2. Read `docs/specification.md` if present for the current detailed feature requirements.
3. Read the architecture and implementation-plan documents if present before making structural changes.
4. If two project documents conflict, do not guess which one should win. Identify the conflict and ask the project owner to resolve it, unless the more recent decision is explicitly recorded.

## 2. Version Scope

- The active scope is **ClientPilot V1 only**.
- Do not add V2+ features to V1, even if they seem useful.
- Future versions will be planned, specified, implemented, and tested as separate incremental updates.
- Do not expand requirements without explicit approval.

## 3. Product Model

- ClientPilot V1 is a private workspace for a freelancer or small-agency owner.
- The owner is the application's account user.
- A business client is a record in the owner's workspace, not an account holder.
- Business clients do not have a client portal or their own login in V1.
- Initial stack direction: Next.js frontend, FastAPI backend, SQLite for the initial MVP.

## 4. Architecture and Engineering Boundaries

- Keep frontend and backend in separate application folders while maintaining one project repository, unless the approved architecture document says otherwise.
- The frontend handles presentation and user interaction; it is not the security boundary.
- The FastAPI backend must validate requests, authenticate private operations, enforce authorization/ownership, and apply business rules.
- Persist records in the database. Do not rely on process memory as the durable data store.
- Do not introduce microservices, message queues, caching, teams, complex role systems, or other V1-excluded infrastructure without explicit approval.
- Follow the architecture and module boundaries documented for the project. Do not introduce a new pattern or dependency just for convenience.

## 5. Security Invariants

- Never store passwords in plaintext; use suitable password hashing.
- Reject unauthenticated private API requests.
- Every client operation must enforce current-owner ownership.
- A project may only be linked to a client owned by the current owner.
- A task may only be created or updated in a project the current owner can access.
- Guessing record IDs must not expose or modify another owner's data.
- Keep secrets and environment-specific settings out of source code.
- Enforce security on the backend even when the frontend hides pages, buttons, or records.

## 6. Known Domain Rules

- Required: client name, project name, task title.
- Task status values: `todo`, `in_progress`, `done`.
- Pending tasks include `todo` and `in_progress`.
- Project progress is completed tasks divided by total tasks multiplied by 100.
- If a project has zero tasks, progress is `0%`.
- Permanent client/project deletion is not included in initial V1 scope until a deletion policy is approved.
- Overdue items should not be hidden from deadline views; the exact upcoming window is still open.
- Exact project statuses, project transitions, validation rules, API error schemas, pagination/filtering, authentication strategy, and owner provisioning must be decided in project docs before implementing those unresolved details.

## 7. How to Work

- Follow a requirements/specification-first workflow: requirements -> architecture (HLD/LLD) -> implementation plan -> small implementation tasks -> tests and verification.
- Do not jump directly into a large code implementation when the relevant requirement or design is not approved.
- Before modifying files, summarize the task scope and identify the files likely to change.
- Make the smallest coherent change that satisfies the approved requirement.
- Explain important engineering decisions briefly and clearly.
- Do not silently invent product behavior for unresolved requirements. Mark the gap and ask for a decision.
- After coding, run relevant tests and report exactly what passed, failed, or was not run. Do not claim verification without evidence.
- Add or update tests for normal flows, validation failures, missing records, authentication failures, and cross-owner access where relevant.
- Avoid unrelated refactoring or adding dependencies without need and approval.

## 8. V1 Features

- Owner account provisioning and login/logout.
- Client create, list/view, and update.
- Project create, list/view, and update, linked to a client.
- Task create, list/view, and status update, linked to a project.
- Dashboard counts, progress, and upcoming deadlines.
- Database persistence, input validation, ownership enforcement, and automated tests.

## 9. Explicitly Excluded from V1

Do not implement these unless the project owner approves a later version:

- Client login/client portal.
- Public signup or provider marketplace.
- Chat, notifications, file uploads, approval/revision workflows.
- Invoices, payment processing, or escrow.
- AI agent features or AI project planning/recommendations.
- Teams or complex roles.
- Microservices, queues, or caching.

## 10. Definition of Done

A feature is not done merely because code exists. Verify that:

- It matches the approved specification.
- Input validation and predictable errors are covered.
- Authentication and owner-ownership rules are tested where applicable.
- Data persists across application restarts where expected.
- Relevant tests pass, or any failure/unrun test is clearly reported.
- Documentation is updated when behavior or decisions change.
