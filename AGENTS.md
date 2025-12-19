# Repository Guidelines

## Project Structure & Module Organization

- `app/`: Next.js App Router pages/layouts and API routes (e.g. `app/api/**`).
- `components/`: React components for the UI; `components/ui/` contains vendored UI primitives and is excluded from Biome formatting/linting.
- `contexts/`: React context providers (notably diagram state).
- `lib/`: Core logic (AI provider adapters, prompts, XML/Draw.io utilities, storage).
- `public/`: Static assets and example images/diagrams.
- `packages/mcp-server/`: MCP server package used by external agents/clients.
- `docs/`: Provider and deployment documentation.
- `scripts/`: One-off utilities (e.g. `scripts/test-diagram-operations.mjs`).

## Build, Test, and Development Commands

- `npm install`: Install dependencies.
- `cp env.example .env.local`: Create local configuration (edit `.env.local` as needed).
- `npm run dev`: Run the app in development (Turbopack) on port `6002`.
- `npm run build`: Build production output.
- `npm run start`: Start the production server on port `6001`.
- `docker compose up --build`: Run the app on `:3000` with a local draw.io instance on `:8080`.

## Coding Style & Naming Conventions

- TypeScript + React (Next.js App Router). Keep changes compatible with `strict: true` (`tsconfig.json`).
- Biome is the primary formatter/linter:
  - `npm run format` (write formatting), `npm run lint` (lint), `npm run check` (CI checks).
  - Formatting defaults: 4-space indentation, double quotes, semicolons as needed (`biome.json`).
- Naming: component filenames typically use kebab-case (e.g. `components/chat-panel.tsx`); React components use PascalCase.

## Testing Guidelines

- There is no dedicated unit test runner in the root app yet; rely on `npm run check` plus manual QA (create/edit/export diagrams, file uploads, history restore).
- For diagram operation changes, run `node scripts/test-diagram-operations.mjs`.

## Commit & Pull Request Guidelines

- Follow Conventional Commit style used in history: `feat: …`, `fix(scope): …`, `chore: …`, `refactor: …`.
- Keep PRs focused; include screenshots for UI changes and note AI provider/model for behavioral changes.
- Pre-commit hooks run via Husky + lint-staged (Biome on staged files); ensure `npm run check` passes before requesting review.

## Security & Configuration Tips

- Never commit secrets (`.env.local`, API keys). Use `ACCESS_CODE_LIST` to protect public deployments.
- If self-hosting draw.io or running offline, set `NEXT_PUBLIC_DRAWIO_BASE_URL` (see `docs/offline-deployment.md`).

