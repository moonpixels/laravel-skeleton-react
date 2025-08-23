# Laravel Skeleton (React)

This is the Moon Pixels skeleton for building Laravel applications with Inertia and React. This project serves as a
starting point for new Laravel applications with a modern frontend setup and enhanced development tools.

## Features

This skeleton provides several enhancements over a standard Laravel application:

### Backend Features

- **Laravel 12.0** with PHP 8.4 support
- **PostgreSQL** database integration
- **Redis** for caching, session management, and queue processing
- **Laravel Horizon** for queue monitoring and management
- **Laravel Reverb** for WebSockets support
- **MinIO** integration for S3-compatible object storage
- **Two-factor authentication** support via Google2FA
- **Advanced image processing** with Intervention Image and Imagick
- **Laravel Boost** MCP server integration for enhanced development workflow
- **Custom support packages** for common functionality (Localisation, ImageProcessor, TwoFactorAuthentication)

### Frontend Features

- **React 19** with TypeScript for the frontend
- **Inertia.js v2** for connecting Laravel with React without building an API
- **Tailwind CSS 4** for styling with modern utility classes
- **Radix UI** components for accessible UI elements (shadcn/ui patterns)
- **React Hook Form** for form handling with Zod validation
- **Laravel Echo** for real-time features
- **TanStack Table** for advanced data table functionality
- **Internationalization** with i18next and browser language detection
- **Comprehensive component library** with consistent design patterns

### Development Tools

- **PHPStan** for static analysis of PHP code
- **Laravel Pint** for PHP code styling
- **Rector** for automatic PHP code refactoring
- **Pest v4** for PHP testing with coverage reports and browser testing
- **ESLint** for JavaScript/TypeScript linting
- **Prettier** for JavaScript/TypeScript code formatting
- **Vite** for fast frontend builds
- **Laravel Debugbar** and **Laravel Telescope** for debugging
- **Laravel Boost** MCP server with powerful development tools
- **Comprehensive CI/CD** with GitHub Actions workflows

## Local Installation

The project uses Laravel Herd for local development. Laravel Herd provides a lightweight, native development environment
for macOS.

### Prerequisites

1. Install [Laravel Herd](https://herd.laravel.com/) on your Mac
2. Make sure Herd is running

### Installation Steps

1. Clone the repository and cd into the project directory

   ```shell
   git clone git@github.com:moonpixels/laravel-skeleton-react.git && cd laravel-skeleton-react
   ```

2. Install the PHP dependencies

   ```shell
   composer install
   ```

3. Copy the `.env.example` file to `.env` and update the environment variables

   ```shell
   cp .env.example .env
   ```

4. Generate the application key

   ```shell
   php artisan key:generate
   ```

5. Initialize Herd for the project

   ```shell
   herd init
   ```

6. Run the migrations and seed the database

   ```shell
   php artisan migrate:fresh --seed
   ```

7. Install the NPM dependencies

   ```shell
   npm install
   ```

8. Build the assets

   ```shell
   npm run build
   ```

9. Run the tests to ensure everything is working

   ```shell
   composer test
   ```

If the tests pass, you should be good to go.

### Post-installation steps

Once you have the project set up, you may also want to perform the following post-installation steps:

#### Starting the development server

You can start the development server by running:

```shell
npm run dev
```

The application should now be available at [http://skeleton.test](http://skeleton.test) (or the URL you configured in
your `.env` file).

#### Setting up MinIO storage

This project uses MinIO for S3-compatible object storage. You need to create a bucket in MinIO that matches the bucket
name in your `.env` file:

1. Access the MinIO dashboard at [https://minio.herd.test](https://minio.herd.test) using the credentials from your
   `.env` file (default: username `herd`, password `secretkey`)
2. Create a new bucket with the name specified in your `.env` file (default: `skeleton`)
3. Set the bucket's access policy to "public" if you want files to be publicly accessible

## Development Workflow

### Laravel Boost Integration

This project includes Laravel Boost, a powerful MCP (Model Context Protocol) server that provides enhanced development tools:

- **Documentation Search**: Version-specific documentation for Laravel ecosystem packages
- **Code Execution**: Execute PHP code in Laravel context (like tinker)
- **Database Tools**: Read-only SQL queries and schema inspection
- **Debugging**: Browser logs, application logs, and error tracking
- **URL Generation**: Correct URLs for Laravel Herd environment

Laravel Boost automatically provides context about your installed packages and their versions, ensuring you get accurate, version-specific guidance.

### Browser Testing with Pest v4

This project leverages Pest v4's powerful browser testing capabilities.

Browser tests can:

- Interact with real browsers (Chrome, Firefox, Safari)
- Test different viewports and devices
- Capture screenshots for debugging
- Assert JavaScript functionality
- Test real user workflows

### Backend Code Quality Tools

There are several composer scripts available for maintaining code quality:

```shell
# Run Rector automatic refactoring
composer rector

# Run Pint code styling
composer pint

# Run PHPStan static analysis
composer stan

# Run Pest tests
composer test

# Run tests with coverage reports
composer coverage

# Check type coverage
composer type-coverage

# Optimize class autoloading
composer dump

# Run all checks (including code coverage)
composer checks
```

> You should always run `composer checks` before pushing your code. This will ensure that your code is clean and passes
> all checks that are enforced by the project CI/CD pipeline.

### Component Library

The project includes a comprehensive component library built on Radix UI primitives:

- **Base Components**: `@/components/ui/` - Button, Dialog, DropdownMenu, Table, etc.
- **Composite Components**: `@/components/` - DataTable, PageHeader, UserDropdown, etc.
- **Layout Components**: `@/layouts/` - AuthenticatedLayout, GuestLayout, DefaultLayout
- **Page Components**: `@/pages/` - Inertia.js page components

All components follow consistent patterns with TypeScript, Tailwind CSS v4, and accessibility best practices.

### Internationalization

The application supports multiple languages with i18next:

- **Frontend**: React components use `useTranslation()` hook
- **Backend**: Laravel localization with custom Localisation package
- **Files**: Translation files in `resources/locales/` and `lang/`
- **Detection**: Automatic browser language detection

### Custom Support Packages

The project includes several custom support packages:

- **TwoFactorAuthentication**: Google2FA integration with recovery codes
- **ImageProcessor**: Intervention Image wrapper with multiple formats
- **Localisation**: Enhanced Laravel localization with validation rules
- **SpatieQueryBuilder**: Custom filters for advanced querying

### Architecture Patterns

The codebase follows consistent architectural patterns:

- **Actions**: Single-purpose business logic classes (`app/Actions/`)
- **DTOs**: Data transfer objects for structured data passing (`app/DTOs/`)
- **Form Requests**: Validation logic separated from controllers (`app/Http/Requests/`)
- **Resources**: API response transformation (`app/Http/Resources/`)
- **Value Objects**: Domain concept encapsulation
- **Enums**: Type-safe constants and states

### Frontend Code Quality Tools

There are also npm scripts available for maintaining frontend code quality:

```shell
# Run ESLint static analysis
npm run lint

# Run Prettier code styling
npm run format

# Run all checks
npm run checks
```

> You should always run `npm run checks` before pushing your code. This will ensure that your code is clean and passes
> all checks that are enforced by the project CI/CD pipeline.

### Data Tables

The project includes a sophisticated data table implementation using TanStack Table:

- **Features**: Sorting, filtering, pagination, row selection, bulk actions
- **Server-side**: Laravel backend handles sorting and filtering with Spatie Query Builder
- **Components**: Reusable DataTable component with customizable columns and filters
- **Accessibility**: Full keyboard navigation and screen reader support

### Queue Management

Laravel Horizon provides comprehensive queue monitoring:

- **Dashboard**: Available at `/horizon` in development
- **Metrics**: Job throughput, failed jobs, wait times
- **Monitoring**: Real-time queue status and worker management
- **Configuration**: Redis-based queue processing

## Coding Practices

This project follows a set of coding practices and conventions to ensure code quality, maintainability, and consistency.

### Backend (PHP)

- **Strict Types**: All PHP files use `declare(strict_types=1);` to enforce strict type checking
- **Final Classes**: Classes are marked as `final` by default to prevent inheritance unless specifically designed for
  extension
- **Action Pattern**: Business logic is encapsulated in single-purpose Action classes
- **Data Transfer Objects (DTOs)**: Used for passing structured data between components
- **Type Declarations**: All method parameters and return types are explicitly typed
- **Private Over Protected**: Class members are private by default to enforce encapsulation
- **Imports Over Namespaces**: Classes are imported with `use` statements rather than using fully qualified namespaces
- **PHPDoc Blocks**: Used for documenting exceptions, and complex parameters / return types that use generics
- **Dependency Injection**: Constructor injection is used for dependencies
- **Value Objects**: Used for encapsulating domain concepts
- **Enums**: Used for representing a fixed set of related values

### Frontend (TypeScript/React)

- **TypeScript**: Used throughout with strict type checking
- **Functional Components**: React components are written as functional components with hooks
- **Zod Validation**: Form validation is handled with Zod schemas
- **React Hook Form**: Used for form state management
- **Component Composition**: UI is built from small, reusable components
- **Internationalization**: All user-facing strings are internationalized
- **Import Aliases**: Used for better organization and shorter import paths
- **Explicit Typing**: Function parameters and returns are explicitly typed
- **Async/Await**: Used for handling asynchronous operations
- **Toast Notifications**: Used for user feedback
- **Context API**: Used for global state management
- **Form Validation**: Zod schemas with React Hook Form integration
- **Error Boundaries**: Graceful error handling in React components

## Testing Strategy

The project employs a comprehensive testing strategy:

### Unit Tests

- **Location**: `tests/Unit/`
- **Purpose**: Test individual classes and methods in isolation
- **Coverage**: Models, Actions, DTOs, Support packages

### Feature Tests

- **Location**: `tests/Feature/`
- **Purpose**: Test HTTP endpoints and application workflows
- **Coverage**: Controllers, middleware, authentication, authorization

### Browser Tests

- **Location**: `tests/Browser/`
- **Purpose**: Test complete user workflows in real browsers
- **Coverage**: Authentication flows, form submissions, JavaScript interactions
- **Tools**: Pest v4 browser testing with Playwright integration

### Test Data

- **Factories**: Model factories for consistent test data
- **Seeders**: Database seeders for development and testing
- **Datasets**: Pest datasets for parameterized testing

## Debugging and Monitoring

### Development Tools

- **Laravel Telescope**: Request debugging, queries, exceptions, logs
- **Laravel Debugbar**: Request profiling, database queries, view data
- **Laravel Boost**: MCP tools for enhanced debugging workflow

### Production Monitoring

- **Laravel Horizon**: Queue monitoring and management
- **Error Tracking**: Comprehensive error logging and reporting
- **Performance Monitoring**: Query optimization and response time tracking

## Deployment

The project includes a comprehensive GitHub Actions workflow for CI/CD in the `.github/workflows` directory:

### Continuous Integration

- **Code Quality**: PHPStan, Pint, Rector, ESLint, Prettier
- **Testing**: Pest tests with coverage reporting
- **Security**: Dependency vulnerability scanning
- **Standards**: Automated code formatting and style checking

### Deployment Considerations

- **Environment Variables**: Comprehensive `.env.example` with all required variables
- **Asset Building**: Vite production builds with optimization
- **Database Migrations**: Automated migration deployment
- **Queue Workers**: Horizon configuration for production queues
- **Storage**: MinIO/S3 configuration for file uploads

You may need to customize the workflows for your specific deployment environment and requirements.

## License

This project is proprietary software. See the LICENSE file for more information.
