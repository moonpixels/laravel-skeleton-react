# CRUSH.md - Laravel React Skeleton

## Quick Commands

- **Development**: `npm run dev` (Vite), `composer run dev` (alias)
- **Testing**: `composer run test`, `php artisan test --filter=testName`
- **Quality**: `composer run checks` (all), `npm run checks` (frontend)
- **Build**: `npm run build`, `php artisan migrate:fresh --seed`
- **Debug**: `/horizon` (queues), `/telescope` (debug dashboard)

## Laravel Boost Tools (MCP)

This project uses Laravel Boost MCP server with powerful development tools:

- **`search-docs`** - Search version-specific Laravel ecosystem documentation (Laravel, Inertia, Pest, Tailwind, etc.)
- **`tinker`** - Execute PHP code in Laravel application context (like `php artisan tinker`)
- **`database-query`** - Run read-only SQL queries against the configured database
- **`browser-logs`** - Read browser console logs, errors, and exceptions for frontend debugging
- **`get-absolute-url`** - Generate correct URLs for Laravel Herd environment
- **`application-info`** - Get comprehensive app info (PHP version, packages, models)
- **`list-routes`** - List all available routes with filters
- **`list-artisan-commands`** - List all available Artisan commands
- **`read-log-entries`** - Read application log entries
- **`last-error`** - Get details of the last backend error/exception

## Build/Test Commands

- `composer run test` - Run all tests with Pest (parallel, compact output)
- `php artisan test --filter=testName` - Run specific test by name
- `php artisan test tests/Feature/ExampleTest.php` - Run specific test file
- `php artisan test --coverage` - Run tests with coverage report
- `composer run pint` - Format PHP code with Laravel Pint
- `composer run stan` - Run PHPStan static analysis (3GB memory limit)
- `composer run rector` - Run Rector code refactoring
- `composer run coverage` - Run tests with 90% minimum coverage
- `composer run type-coverage` - Check 100% type coverage
- `composer run checks` - Run all quality checks (rector, pint, stan, coverage, type-coverage, test)
- `npm run lint` - Lint TypeScript/React code with ESLint
- `npm run format` - Format code with Prettier
- `npm run checks` - Run frontend linting and formatting
- `npm run dev` - Start Vite dev server with HMR
- `npm run build` - Build frontend assets for production

## Testing Patterns

### Test Creation

- **Feature Tests**: `php artisan make:test --pest FeatureName` (most common)
- **Unit Tests**: `php artisan make:test --pest --unit UnitName`
- **Browser Tests**: `php artisan make:test --pest --browser BrowserName` (Pest v4)
- Tests auto-use `RefreshDatabase` trait and factories

### Test Execution

- **All tests**: `php artisan test`
- **Specific test**: `php artisan test --filter=testName`
- **Test file**: `php artisan test tests/Feature/ExampleTest.php`
- **Parallel**: Tests run in parallel by default for speed
- **Coverage**: `composer run coverage` (90% minimum required)

### Browser Testing (Pest v4)

- Browser tests in `tests/Browser/`
- Use `visit('/path')` to navigate
- Interact with page: `click()`, `type()`, `fill()`, `select()`
- Assert content: `assertSee()`, `assertNoJavascriptErrors()`
- Laravel features work: `Event::fake()`, `assertAuthenticated()`, factories
- Take screenshots: `screenshot()` for debugging

### Test Data

- Use factories: `User::factory()->create()`, `User::factory()->make()`
- Check factory states before creating custom data
- Use `fake()` or `$this->faker` for random data (follow existing patterns)
- Datasets for validation testing: `->with(['email1', 'email2'])`

## Architecture Patterns

### Actions (Business Logic)

- Location: `app/Actions/`
- Single-purpose classes for business operations
- Example: `UpdateUserAction`, `RegisterUserAction`
- Use constructor injection for dependencies
- Return DTOs or models, not arrays

### DTOs (Data Transfer Objects)

- Location: `app/DTOs/`
- Structured data passing between layers
- Example: `UpdateUserData`, `RegisterData`
- Use readonly properties and constructor promotion

### Form Requests (Validation)

- Location: `app/Http/Requests/`
- All validation in Form Request classes, not controllers
- Include custom error messages
- Check siblings for array vs string validation rule patterns

### Resources (API Responses)

- Location: `app/Http/Resources/`
- Transform models for API/frontend consumption
- Use for consistent data formatting

### Models

- Use `final` classes by default
- Constructor property promotion: `public function __construct(public GitHub $github) {}`
- Explicit return types: `public function users(): HasMany`
- Casts in `casts()` method, not `$casts` property
- Relationships with proper return type hints

## Component Patterns

### UI Components (Radix UI + shadcn/ui)

- **Location**: `@/components/ui/` (base components)
- **Pattern**: Radix UI primitives with Tailwind styling
- **Variants**: Use `class-variance-authority` for component variants
- **Examples**: `Button`, `Dialog`, `DropdownMenu`, `Table`
- **Composition**: Build complex components from primitives

### Page Components

- **Location**: `@/pages/` (Inertia page components)
- **Layout**: Use layout components (`AuthenticatedLayout`, `GuestLayout`)
- **Props**: Typed with TypeScript interfaces
- **Navigation**: Use `<Link>` or `router.visit()`, never regular `<a>` tags

### Layout Components

- **Location**: `@/layouts/`
- **Default**: `DefaultLayout` wraps all pages
- **Authenticated**: `AuthenticatedLayout` for logged-in users
- **Guest**: `GuestLayout` for auth pages

### Import Patterns

- **Alias**: `@/` for `resources/js/`
- **Components**: `import { Button } from '@/components/ui/button'`
- **Utils**: `import { cn } from '@/utils/utils'`
- **Types**: `import { User } from '@/types/models'`

## Database & Debugging

### Database Tools

- **Migrations**: `php artisan migrate:fresh --seed`
- **Tinker**: Use Laravel Boost `tinker` tool or `php artisan tinker`
- **Query**: Use Laravel Boost `database-query` tool for read-only queries
- **Schema**: Use Laravel Boost `database-schema` tool

### Debugging Tools

- **Horizon**: Queue monitoring at `/horizon`
- **Telescope**: Debug dashboard at `/telescope` (dev only)
- **Debugbar**: Laravel Debugbar for request debugging
- **Browser Logs**: Use Laravel Boost `browser-logs` tool
- **App Logs**: Use Laravel Boost `read-log-entries` tool
- **Last Error**: Use Laravel Boost `last-error` tool

### Queue Management

- **Horizon**: Monitor queues, failed jobs, metrics
- **Commands**: `php artisan queue:work`, `php artisan queue:restart`
- **Jobs**: Implement `ShouldQueue` interface for background processing

## Internationalization (i18n)

### Frontend (React)

- **Setup**: i18next with browser language detection
- **Usage**: `const { t } = useTranslation()`
- **Files**: `resources/locales/en-GB/translation.json`
- **Validation**: `resources/locales/en-GB/validation.json`

### Backend (Laravel)

- **Usage**: `__('key')`, `trans('key')`, or `@lang('key')`
- **Files**: `lang/en_GB/` directory
- **Custom**: Use Localisation support package

## PHP Code Style

- Always use `declare(strict_types=1);` at top of PHP files
- Use PHP 8.4+ constructor property promotion: `public function __construct(public GitHub $github) {}`
- Always use explicit return type declarations for methods
- Use `final` classes by default (enforced by Pint)
- Import all classes, constants, and functions at top of file
- Use strict comparison operators (`===`, `!==`)
- Follow Laravel conventions: Eloquent models, Form Requests for validation, API Resources
- PHPDoc for complex generics and array shapes only
- Private over protected members for encapsulation

## TypeScript/React Code Style

- Use TypeScript with strict typing enabled
- Import React components with named imports: `import { Component } from '@/components/component'`
- Use Inertia.js for navigation: `<Link>` components and `router.visit()`
- Follow existing component patterns in `resources/js/components/`
- Use Tailwind CSS v4 classes for styling (no deprecated utilities)
- Use `@/` path alias for imports from `resources/js/`
- Prefer functional components with hooks over class components
- Use React Hook Form with Zod validation for forms
- Use `cn()` utility for conditional class names

## Environment & Deployment

### Laravel Herd

- **URL**: Project available at URL specified by `APP_URL` in `.env`
- **No server commands needed**: Always available through Herd
- **SSL**: Automatic HTTPS certificates
- **Services**: Redis, MinIO automatically configured

### Asset Building

- **Development**: `npm run dev` for HMR
- **Production**: `npm run build` for optimized assets
- **Vite Error**: If manifest error, run `npm run build` or restart dev server

### Services

- **MinIO**: S3-compatible storage at `https://minio.herd.test`
- **Redis**: Caching, sessions, queues
- **PostgreSQL**: Primary database

## Troubleshooting

### Common Issues

- **Vite manifest error**: Run `npm run build` or `npm run dev`
- **Frontend not updating**: Check if dev server is running
- **Tests failing**: Run `composer run pint` to fix formatting
- **Type errors**: Run `composer run stan` for static analysis
- **Queue not processing**: Check Horizon dashboard

### Debug Workflow

1. Check browser logs with Laravel Boost `browser-logs` tool
2. Check application logs with `read-log-entries` tool
3. Use `tinker` tool to test PHP code
4. Use `database-query` tool to inspect data
5. Check `/telescope` for request debugging
6. Use browser tests to verify frontend behavior
