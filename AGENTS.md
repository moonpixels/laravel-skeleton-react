# AGENTS.md - Laravel React Skeleton

## Quick Commands

- **Development**: `npm run dev` (Vite), `composer run dev` (alias)
- **Testing**: `composer run test`, `php artisan test --filter=testName`
- **Quality**: `composer run checks` (all), `npm run checks` (frontend)
- **Build**: `npm run build`, `php artisan migrate:fresh --seed`
- **Debug**: `/horizon` (queues), `/telescope` (debug dashboard)

## Laravel Boost Tools (MCP)

Available Laravel-specific development tools:

- **`search-docs`** - Search Laravel ecosystem documentation (Laravel, Inertia, Pest, Tailwind)
- **`tinker`** - Execute PHP code in Laravel context
- **`database-query`** - Run read-only SQL queries
- **`browser-logs`** - Read browser console logs for frontend debugging
- **`get-absolute-url`** - Generate correct URLs for Laravel Herd
- **`application-info`** - Get app info (PHP version, packages, models)
- **`list-routes`** - List all routes with filters
- **`read-log-entries`** - Read application log entries
- **`last-error`** - Get last backend error details

## Project Overview

This is a Laravel 12 + React 19 + Inertia.js application using:

- **Backend**: PHP 8.5, Laravel 12, PostgreSQL
- **Frontend**: React 19, TypeScript, Inertia.js, Tailwind CSS v4, shadcn/ui
- **Testing**: Pest v4 with browser testing (Playwright)
- **Quality**: Pint, PHPStan/Larastan, Rector
- **Environment**: Laravel Herd (auto HTTPS, Redis, MinIO)

## Project Structure

```
app/
├── Actions/{Domain}/        # Business logic operations
├── DTOs/{Domain}/          # Data transfer objects
├── Http/
│   ├── Controllers/        # Route handlers
│   ├── Requests/          # Form validation
│   └── Resources/         # API response formatting
├── Models/                # Eloquent models
├── Enums/{Domain}/        # Enum types
└── Providers/             # Service providers

resources/
├── js/
│   ├── components/        # React components
│   ├── pages/            # Inertia pages
│   └── layouts/          # Layout components
└── locales/              # i18n translations

tests/
├── Feature/              # Feature tests
├── Unit/                # Unit tests
└── Browser/             # Browser tests (Pest + Playwright)
```

## Available Skills

Load skills on-demand using the skill tool when working on specific tasks.

### Laravel Backend Skills

**Architecture Patterns:**

- `laravel-actions` - Creating Action classes for business logic
- `laravel-dtos` - Creating DTOs for data transfer
- `laravel-form-requests` - Creating Form Requests for validation
- `laravel-resources` - Creating API Resources for responses
- `laravel-models` - Creating or modifying Eloquent models
- `laravel-enums` - Creating or using enums
- `laravel-service-container` - Dependency injection patterns
- `laravel-middleware` - Creating middleware
- `laravel-providers` - Service provider patterns

**Testing:**

- `laravel-testing-feature` - Creating feature tests (most common)
- `laravel-testing-unit` - Creating unit tests for isolated logic
- `laravel-testing-browser` - Creating browser tests with Playwright
- `laravel-testing-factories` - Using factories for test data

**Code Quality:**

- `laravel-pint` - Auto-formatting with Pint
- `laravel-phpstan` - Static analysis with PHPStan/Larastan
- `laravel-rector` - Automated refactoring with Rector

### React/TypeScript Frontend Skills

- `react-components` - Creating React components with TypeScript
- `react-radix-ui` - Using shadcn/ui components (Radix UI + Tailwind)
- `react-inertia` - Working with Inertia.js pages and navigation
- `react-forms` - Creating forms with React Hook Form + Zod
- `typescript-style` - TypeScript coding standards

### Environment & Debugging Skills

- `laravel-herd` - Laravel Herd environment (HTTPS, services)
- `laravel-vite` - Vite asset building and HMR
- `laravel-debugging` - Debugging with Horizon, Telescope, logs
- `laravel-i18n` - Internationalization (i18next + Laravel)

### Agentic Development Skills

- `creating-agentic-skills` - Creating new skills for OpenCode
- `creating-agentic-commands` - Creating custom slash commands and agents
- `creating-agentic-config` - Creating or updating AGENTS.md configuration files

## Skill Loading Best Practice

Load skills on-demand based on the task at hand. The AI will automatically load relevant skills when you mention specific concepts or use custom commands.

**Examples:**

✅ "Create a RegisterUserAction" → Loads `laravel-actions`
✅ "Add validation to the login form" → Loads `laravel-form-requests`
✅ "Create a browser test for checkout" → Loads `laravel-testing-browser`
✅ "Build a UserProfile component" → Loads `react-components`, `typescript-style`

## Custom Commands

Use `/` to access custom commands:

**Testing:**

- `/test` - Run all tests in parallel
- `/test-coverage` - Run with 90% coverage requirement
- `/test-filter TestName` - Run specific test
- `/test-browser FeatureName` - Create & run browser test

**Quality:**

- `/quality` - Run all quality checks (rector, pint, stan, coverage, tests)
- `/fix-style` - Auto-fix code style with Pint
- `/analyze` - Run PHPStan static analysis

**Build:**

- `/build` - Build production assets with Vite
- `/fresh` - Fresh database with seeders

**Development:**

- `/component Name` - Create React component with TypeScript
- `/action ActionName` - Create Action class
- `/endpoint ResourceName` - Create complete API endpoint

## Specialized Agents

Use `@agent-name` to invoke specialized workflow agents:

- `@test-fixer` - Runs tests and fixes failures iteratively
- `@quality-auditor` - Runs quality checks and fixes issues
- `@migration-builder` - Creates database migrations safely
- `@api-designer` - Designs complete API endpoints
- `@component-builder` - Creates React components with TypeScript
- `@docs-writer` - Writes technical documentation

## Troubleshooting

### Common Issues

- **Vite manifest error**: Run `npm run build` or restart `npm run dev`
- **Tests failing**: Run `/fix-style` to auto-format code
- **Type errors**: Run `/analyze` for detailed type checking
- **Frontend not updating**: Check if `npm run dev` is running
- **Queue not processing**: Check `/horizon` dashboard

### Debug Workflow

1. Check browser logs: Laravel Boost `browser-logs` tool
2. Check app logs: Laravel Boost `read-log-entries` tool
3. Check last error: Laravel Boost `last-error` tool
4. Test PHP code: Laravel Boost `tinker` tool
5. Inspect database: Laravel Boost `database-query` tool
6. Check Telescope: `/telescope` dashboard

## Important Notes

- Laravel Herd provides automatic HTTPS at URL in `APP_URL` (.env)
- No need to run `php artisan serve` - always available via Herd
- Redis, MinIO automatically configured and running
- Browser tests use Playwright under the hood (via Pest)
- All code must pass: Rector, Pint, PHPStan, 90% coverage, 100% type coverage
- Formatters run automatically on save: Pint for PHP, Prettier for JS/TS/JSON
