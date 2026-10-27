# ClientPilot frontend

The frontend uses the Next.js App Router with a small feature-oriented structure.

## Structure

- `src/app/` — route entry points and route metadata. Public pages live at `/`, `/about`, and `/how-it-works`; auth and private workspace routes remain separate.
- `src/components/layout/` — shared page shells, including `PublicShell` for public navigation and footer composition.
- `src/components/main/` — public marketing sections such as the hero, feature grid, Why ClientPilot section, navbar, and footer.
- `src/components/pages/` — larger page-specific public content such as the How It Works workflow.
- `src/components/ui/` — reusable primitives such as buttons, inputs, and the brand mark.
- `src/components/auth/` and `src/components/workspace/` — existing authentication and private application surfaces.
- `src/features/` — API services, schemas, and types for auth, clients, projects, tasks, and dashboard summaries.

## Commands

Run from `frontend/`:

```bash
npm run dev
npm run lint
npm test
npm run build
```

The frontend talks to the existing FastAPI API through the feature service modules. Public pages do not require authentication; private routes continue to verify the existing owner session through `WorkspaceShell` and the backend authorization boundary.
