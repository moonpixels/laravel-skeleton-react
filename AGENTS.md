# Laravel Skeleton React

Full-stack Laravel + React + Inertia.js application with domain-driven design patterns.

## Quick Commands

- **Dev**: `npm run dev` (Vite HMR - auto-starts via Herd)
- **Build**: `npm run build` (production assets)
- **Test**: `composer test` (Pest with coverage)
- **Backend Quality**: `composer run checks` (Rector, Pint, PHPStan, coverage, type coverage)
- **Frontend Quality**: `npm run checks` (ESLint + Prettier)
- **Fresh DB**: `php artisan migrate:fresh --seed`

## Tech Stack

- **Backend**: PHP 8.5, Laravel 12, PostgreSQL 17
- **Frontend**: React 19, TypeScript 5, Inertia.js v2, Tailwind CSS v4
- **Testing**: Pest v4 with browser testing (Playwright)
- **Quality**: Rector, Pint, PHPStan/Larastan (level 8), 90% code coverage, 100% type coverage
- **Environment**: Laravel Herd (auto HTTPS, PostgreSQL, Redis, MinIO, Reverb)
- **Real-time**: Laravel Reverb for WebSockets, Laravel Echo for frontend

## Key Directories

- `app/Actions/{Domain}/` - Business logic operations (domain-driven)
- `app/DTOs/{Domain}/` - Data transfer objects for type-safe data passing
- `app/Http/Controllers/` - Thin route handlers (delegate to Actions)
- `app/Http/Requests/` - Form validation with `toDTO()` methods
- `app/Http/Resources/` - API response formatting
- `app/Models/` - Eloquent models with PHPDoc properties
- `app/Support/` - Custom packages (ImageProcessor, Localisation, TwoFactorAuthentication)
- `resources/js/components/` - Reusable React components
- `resources/js/components/ui/` - Base UI components (Radix UI primitives)
- `resources/js/pages/` - Inertia page components
- `resources/js/layouts/` - Layout wrappers for pages
- `resources/js/contexts/` - React Context providers for global state
- `resources/js/hooks/` - Custom React hooks
- `resources/js/locales/` - Frontend i18n translations (i18next)
- `tests/Feature/` - HTTP endpoint tests (most common)
- `tests/Unit/` - Isolated business logic tests
- `tests/Browser/` - End-to-end browser tests (Playwright)

## Architecture Decisions

- **Business Logic**: Action classes in `app/Actions/{Domain}/` following domain-driven design
- **Validation**: Form Requests with `toDTO()` methods convert to type-safe DTOs
- **Controllers**: Thin controllers that delegate to Actions (single responsibility)
- **React Components**: Function components with TypeScript, no `FC` type, use `import type`
- **State Management**: React Context for global state, form state via React Hook Form
- **Testing Strategy**: Feature tests for all HTTP endpoints, browser tests for complex UI flows
- **Type Safety**: 100% type coverage (PHPStan level 8, TypeScript strict mode)
- **Strict Types**: All PHP files use `declare(strict_types=1);`
- **Final Classes**: PHP classes marked `final` by default
- **Internationalization**: i18next for React, Laravel localization for backend
- **Component Library**: Radix UI primitives following shadcn/ui patterns
- **Form Handling**: React Hook Form with Zod validation schemas

## Before Committing

All code must pass:

- Rector (automated refactoring)
- Pint (code formatting)
- PHPStan level 8 (static analysis)
- 90% code coverage minimum
- 100% type coverage
- ESLint + Prettier (frontend)
- TypeScript compilation (no errors)

Run `composer run checks` to verify all backend checks.
Run `npm run checks` to verify all frontend checks.

Formatters run automatically on save (Pint for PHP, Prettier for JS/TS/JSON).

## Environment Notes

- Laravel Herd provides automatic HTTPS at URL in `APP_URL` (.env)
- No need to run `php artisan serve` - always available via Herd
- PostgreSQL, Redis, MinIO, and Reverb automatically configured and running
- Vite HMR works with Herd's HTTPS automatically
- MinIO dashboard: [https://minio.herd.test](https://minio.herd.test)
- Horizon dashboard: `/horizon` in development
- Telescope dashboard: `/telescope` in development

## Available Skills

Load skills on-demand for specific tasks:

**Backend**: `creating-actions`, `creating-dtos`, `creating-form-requests`, `creating-controllers`, `creating-migrations`, `managing-models`, `creating-enums`, `creating-helpers`, `creating-middleware`, `creating-service-providers`, `creating-support-classes`, `creating-api-resources`, `creating-factories`, `creating-seeders`, `managing-config-files`, `defining-routes`, `managing-localisation`, `creating-model-mixins`

**Frontend**: `creating-react-components`, `creating-inertia-pages`, `creating-hooks`, `creating-layouts`, `creating-contexts`, `defining-typescript-types`, `creating-react-utils`, `managing-react-localisation`, `managing-npm-packages`

**Testing**: `writing-feature-tests`, `writing-unit-tests`, `writing-browser-tests`

**Quality**: `ensuring-laravel-quality`, `ensuring-frontend-quality`

**Meta**: `creating-agentic-skills`, `creating-agentic-commands`

## For More Context

- Skill files in `.opencode/skill/` provide detailed patterns for specific tasks
- Load skills automatically by mentioning task types (e.g., "create an Action")
- README.md contains comprehensive setup and feature documentation
