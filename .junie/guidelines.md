# Junie Guidelines

This document provides guidelines for JetBrains's smart coding agent, Junie, to aid in future development on this
project. It includes build/configuration instructions, testing information, and additional development information
specific to this project.

## Testing Information

### Testing Framework

The project uses Pest for PHP testing, which is a testing framework built on top of PHPUnit with a more expressive
syntax.

### Running Tests

```shell
# Run all tests
composer test

# Run tests with coverage reports (minimum 90% coverage required)
composer coverage

# Run tests with type coverage (minimum 100% coverage required)
composer type-coverage

# Run a specific test file or filter
composer test -- --filter=TestName
```

### Writing Tests

1. **Test Organization**:

- Unit tests go in `tests/Unit/`
- Feature tests go in `tests/Feature/`
- Controller tests are organized by controller and method in
  `tests/Feature/Http/Controllers/{ControllerName}/{MethodName}Test.php`

2. **Test Structure**:

- Tests use Pest's functional syntax with `test()` functions
- Use `beforeEach()` for common setup code
- Use `expect()` for assertions with chainable methods

3. **Example Test**:

   ```php
   <?php

   declare(strict_types=1);

   test('example test', function (): void {
       // Arrange
       $data = ['key' => 'value'];

       // Act
       $result = doSomething($data);

       // Assert
       expect($result)
           ->toBeArray()
           ->toHaveCount(1)
           ->toHaveKey('processed');
   });
   ```

4. **Database Testing**:

- Tests use `LazilyRefreshDatabase` trait to refresh the database only when needed
- Use factories to create test data: `User::factory()->create()`
- SQLite in-memory database is used for testing

5. **Authentication in Tests**:

- Use `$this->actingAs($user)` to authenticate a user
- For testing routes that require authentication, create a user first

6. **File Storage in Tests**:

- Use `Storage::fake()` to create a fake storage disk
- Use `UploadedFile::fake()->image('avatar.jpg')` to create fake file uploads

7. **Mocking**:

- Use Mockery for mocking dependencies: `Mockery::mock(ImageProcessor::class)`
- Use `$this->app->instance(ImageProcessor::class, $mock)` to bind mocks to the container

### Test Coverage Requirements

- Minimum code coverage: 90%
- Minimum type coverage: 100%

### Guidelines for Junie When Adding or Modifying Code

1. **Always Write Tests**:

- Write tests for all new code
- Update tests when modifying existing code
- Ensure tests cover both happy paths and edge cases

2. **Run Tests to Verify Changes**:

- Run `composer test` to ensure all tests pass
- Run `composer coverage` to ensure code coverage requirements are met
- Run `composer type-coverage` to ensure type coverage requirements are met

3. **Use Test Results for Improvement**:

- If tests fail, analyze the failures and fix the issues
- Use code coverage reports to identify untested code paths
- Use type coverage reports to identify missing type declarations

## Code Style and Development Guidelines

### PHP Coding Standards

1. **Strict Types**:

- All PHP files must use `declare(strict_types=1);`

2. **Class Design**:

- Classes should be marked as `final` by default to prevent inheritance unless specifically designed for extension
- Use private properties and methods by default to enforce encapsulation
- Use constructor injection for dependencies

3. **Type Declarations**:

- All method parameters and return types must be explicitly typed
- Use PHPDoc blocks for documenting exceptions and complex types that use generics

4. **Architectural Patterns**:

- Use the Action pattern for business logic (single-purpose Action classes)
- Use Data Transfer Objects (DTOs) for passing structured data
- Use Value Objects for encapsulating domain concepts
- Use Enums for representing a fixed set of related values

5. **Code Quality Tools**:

   ```shell
   # Run Rector automatic refactoring
   composer rector

   # Run Pint code styling
   composer pint

   # Run PHPStan static analysis
   composer stan

   # Run all checks (including code coverage)
   composer checks
   ```

### TypeScript/React Coding Standards

1. **TypeScript**:

- Use strict type checking
- Explicitly type function parameters and returns

2. **React Components**:

- Use functional components with hooks
- Use component composition for building UI
- Use React Hook Form for form state management
- Use Zod for form validation

3. **State Management**:

- Use Context API for global state management
- Use Toast notifications for user feedback

4. **Internationalization**:

- All user-facing strings must be internationalized

5. **Code Quality Tools**:

   ```shell
   # Run ESLint static analysis
   npm run lint

   # Run Prettier code styling
   npm run format

   # Run all checks
   npm run checks
   ```

### Guidelines for Junie When Adding or Modifying Code

1. **Follow Existing Patterns**:

- Study the existing codebase to understand the patterns and conventions
- Follow the same patterns when adding new code
- Maintain consistency with the existing codebase

2. **Run Code Quality Tools**:

- Run `composer checks` before submitting PHP code changes
- Run `npm run checks` before submitting TypeScript/React code changes
- Fix any issues reported by the tools

3. **Documentation**:

- Add PHPDoc blocks for complex methods
- Document exceptions that can be thrown
- Add comments for complex logic

## Additional Development Information

### Key Technologies

- **Laravel 12.0** with PHP 8.4 support
- **React 19** with TypeScript
- **Inertia.js** for connecting Laravel with React
- **Tailwind CSS 4** for styling
- **Radix UI** components for accessible UI elements
- **PostgreSQL** database
- **Redis** for caching, session management, and queue processing
- **MinIO** for S3-compatible object storage
- **Two-factor authentication** via Google2FA
- **Advanced image processing** with Intervention Image and Imagick

### Debugging Tools

- **Laravel Debugbar**: For debugging Laravel applications
- **Laravel Telescope**: For monitoring Laravel applications
- **Laravel Horizon**: For monitoring queues

### Performance Considerations

- Use Redis for caching when appropriate
- Use queued jobs for long-running tasks
- Optimize database queries with proper indexing
- Use eager loading to avoid N+1 query problems

### Security Considerations

- The project includes two-factor authentication support
- Password confirmation is required for sensitive operations
- Email verification is implemented for new users
- CSRF protection is enabled for all forms

### Deployment

The project includes a basic GitHub Actions workflow for CI/CD in the `.github/workflows` directory. Customize this for
your specific deployment needs.

## Conclusion

This document provides guidelines for JetBrains's smart coding agent, Junie, to aid in future development on this
project. By following these guidelines, Junie can produce code that meets the project's coding standards and practices.
