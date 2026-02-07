# Laravel Skeleton React

Laravel 12 + Inertia v2 + React 19 starter for building full-stack Moon Pixels applications.

## What

### Tech Stack

- Backend: PHP 8.5, Laravel 12, PostgreSQL, Redis
- Frontend: React 19, TypeScript 5, Inertia.js v2, Tailwind CSS v4, Vite 7
- Realtime/ops: Laravel Reverb, Horizon, Telescope
- Testing and quality: Pest 4, Playwright (browser tests), PHPStan/Larastan, Rector, Pint, ESLint, Prettier

### Key Directories

- `app/Actions/` - business logic entry points
- `app/DTOs/` - readonly data transfer objects
- `app/Http/Controllers/` - HTTP orchestration only
- `app/Http/Requests/` - validation and request-to-DTO mapping
- `app/Http/Resources/` - API response transformers
- `app/Support/` - internal support modules (ImageProcessor, Localisation, TwoFactorAuthentication, query filters)
- `resources/js/pages/` - Inertia page components
- `resources/js/components/` - reusable React components
- `resources/js/layouts/` - application/page layout wrappers
- `resources/js/contexts/` - shared React state providers
- `routes/` - route definitions (`web.php`, `auth.php`, `console.php`, `channels.php`)
- `tests/Feature`, `tests/Unit`, `tests/Browser` - HTTP, unit, and browser test suites

## Why

### Architecture Decisions

- Business logic lives in Actions; controllers stay thin and delegate.
- Input validation belongs in Form Requests, then mapped to DTOs.
- Inertia routes render React pages from `resources/js/pages` instead of Blade page views.
- Strict typing is enforced in both PHP and TypeScript (`declare(strict_types=1);`, strict TS config).
- Architecture constraints are tested (naming, strict types, DTO/read-only patterns, env usage).

## How

### Quick Commands

- Install dependencies: `composer install --no-interaction --prefer-dist --optimize-autoloader && npm ci`
- Start frontend dev server: `npm run dev`
- Build assets: `npm run build`
- Run frontend checks: `npm run checks`
- Run tests (parallel Pest): `composer test`
- Run full backend gate: `composer run checks`
- Run focused tests while iterating: `php artisan test --compact --filter=TestName`
- Reset local database: `php artisan migrate:fresh --seed`

### Universal Workflow Rules

- Reuse existing components/modules before creating new files.
- Keep new files in the existing directory structure unless a new base folder is approved.
- Prefer Eloquent models/relationships over raw SQL; avoid `env()` outside config files.
- Use Laravel Boost tooling for docs, logs, routes, and app-aware debugging.
- For frontend work not reflected in browser, run `npm run dev` or `npm run build`.

### Before Committing

Run the same checks expected by CI:

- `npm run checks`
- `composer run checks`
- `npm run build`

### Available Skills

- Core app skills: `pest-testing`, `inertia-react-development`, `tailwindcss-development`
- Agentic/meta skills: `agentic-config`, `agentic-commands`, `agentic-subagents`, `agentic-skills`

### Specialized Agents

- No project-local specialized subagents are configured in `.opencode/agents/`.
- Use built-in `general` and `explore` subagents for multi-step research/execution tasks.

### Progressive Disclosure

- Project overview and setup: `README.md`
- CI quality gates: `.github/workflows/standards.yml`, `.github/workflows/tests.yml`
- Laravel Boost and project operating rules: `CLAUDE.md`
