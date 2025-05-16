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

### Frontend Features

- **React 19** with TypeScript for the frontend
- **Inertia.js** for connecting Laravel with React without building an API
- **Tailwind CSS 4** for styling
- **Radix UI** components for accessible UI elements
- **React Hook Form** for form handling with Zod validation
- **Laravel Echo** for real-time features

### Development Tools

- **PHPStan** for static analysis of PHP code
- **Laravel Pint** for PHP code styling
- **Rector** for automatic PHP code refactoring
- **Pest** for PHP testing with coverage reports
- **ESLint** for JavaScript/TypeScript linting
- **Prettier** for JavaScript/TypeScript code formatting
- **Vite** for fast frontend builds
- **Laravel Debugbar** and **Laravel Telescope** for debugging

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

## Deployment

The project includes a basic GitHub Actions workflow for CI/CD in the `.github/workflows` directory. You may need to
customize this for your specific deployment needs.

## License

This project is proprietary software. See the LICENSE file for more information.
