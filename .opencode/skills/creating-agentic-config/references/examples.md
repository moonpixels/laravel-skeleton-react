# AGENTS.md Examples

Complete examples for different project types. Keep every section universal and high-signal.

## Example 1: Astro + React (Web App)

```markdown
# Project Name - Astro + React

Brief one-sentence description of what this website does.

## Quick Commands

- **Dev**: `npm run dev`
- **Build**: `npm run build`
- **Preview**: `npm run preview`
- **Lint**: `npm run lint`
- **Format**: `npm run format`
- **Check**: `npm run checks`

## Tech Stack

- **Framework**: Astro 5
- **UI**: React 19 islands
- **Styling**: Tailwind CSS v4
- **Types**: TypeScript strict
- **Quality**: ESLint, Prettier, astro check

## Key Directories

- `src/pages/` - Route pages
- `src/layouts/` - Layout shells
- `src/components/` - UI components (Astro/React)
- `src/content/` - Content collections (if used)

## Architecture Decisions

- **Rendering**: Server-first with selective `client:*` hydration
- **Routing**: File-based routes in `src/pages/`
- **Content**: Collections via `src/content.config.ts`
- **Type Safety**: Strict TypeScript, no `any`

## Before Committing

All code must pass:

- `npm run checks`
```

## Example 2: React SPA (Frontend Only)

```markdown
# Project Name - React TypeScript SPA

Brief description of the application.

## Quick Commands

- **Dev**: `npm run dev` (Vite dev server)
- **Build**: `npm run build` (production bundle)
- **Test**: `npm test` (Vitest)
- **Lint**: `npm run lint`
- **Type Check**: `npm run type-check`

## Tech Stack

- **Framework**: React 19, TypeScript 5
- **Build**: Vite 6
- **Routing**: React Router
- **State**: TanStack Query + Zustand
- **Styling**: Tailwind CSS v4
- **Testing**: Vitest + React Testing Library

## Key Directories

- `src/components/` - Reusable components
- `src/pages/` - Route pages
- `src/features/` - Feature modules
- `src/api/` - API client + endpoints
- `tests/` - Test files

## Architecture Decisions

- **Component Organization**: Feature-based modules
- **State**: Server state via Query, client via Zustand
- **API Layer**: Typed endpoints in `src/api/`
- **Type Safety**: Strict TypeScript, no `any`

## Before Committing

All code must pass:

- `npm run lint`
- `npm test -- --coverage`
- `npm run build`
```

## Example 3: Python CLI Tool

```markdown
# Project Name - Python CLI Tool

Brief description of what the CLI does.

## Quick Commands

- **Setup**: `uv venv && uv pip install -e ".[dev]"`
- **Run**: `project-name [command]`
- **Test**: `pytest --cov`
- **Lint**: `ruff check .`
- **Format**: `ruff format .`
- **Type Check**: `mypy src/`

## Tech Stack

- **Python**: 3.12+
- **CLI Framework**: Click
- **Testing**: pytest + pytest-cov
- **Linting**: Ruff
- **Type Checking**: mypy strict

## Key Directories

- `src/project_name/` - Main package
- `src/project_name/commands/` - CLI commands
- `src/project_name/utils/` - Utilities
- `tests/` - Test suite

## Architecture Decisions

- **CLI Pattern**: Command groups with decorators
- **Error Handling**: Custom exception hierarchy
- **Testing**: Unit tests + integration tests
- **Type Safety**: Full type hints

## Before Committing

All code must pass:

- `ruff check .`
- `ruff format .`
- `mypy src/`
- `pytest --cov`
```

## Example 4: Monorepo

```markdown
# Monorepo Name

Turborepo monorepo with multiple packages.

## Quick Commands

- **Dev**: `turbo run dev`
- **Test**: `turbo run test`
- **Build**: `turbo run build`
- **Workspace**: `turbo run dev --filter=@scope/package`

## Key Directories

- `apps/web/` - Web app (see `apps/web/AGENTS.md`)
- `apps/api/` - API server (see `apps/api/AGENTS.md`)
- `packages/ui/` - Shared UI package
- `packages/types/` - Shared types

## Architecture Decisions

- Shared packages in `packages/` with exports
- Apps consume packages via workspace names
- Turborepo for caching + parallel execution

## Before Committing

Run from root:

- `turbo run lint`
- `turbo run test`
- `turbo run build`
```
