# GitHub Copilot Instructions — ClientPilot V1

Before proposing or changing code, read:

- `AGENTS.md`
- `docs/product-overview.md`
- `docs/specification.md` if present
- Approved architecture and implementation-plan documents if present

Follow the approved ClientPilot V1 scope and the repository's requirements-first workflow. Keep the Next.js frontend and FastAPI backend separate within the same repository. The backend is responsible for validation, authentication, ownership authorization, business rules, and database persistence. Do not treat frontend visibility as a security control.

Do not silently resolve open product decisions, invent acceptance criteria, or implement features excluded from V1. If a requirement or project-document conflict blocks implementation, state the exact ambiguity and request a decision. Make small, testable changes, add relevant tests, run them where possible, and accurately report verification results.
