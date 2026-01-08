---
name: writing-feature-tests
description: Writing feature tests for HTTP endpoints, controllers, and full request/response cycles using Pest v4. Use when any business logic is added to codebase, when creating Actions, Controllers, Form Requests, or modifying application behavior that affects HTTP endpoints.
---

# Writing Feature Tests

## When to Use This Skill

Use this skill **proactively** when:

- Creating or modifying Controllers
- Creating or modifying Actions that are called from HTTP endpoints
- Creating or modifying Form Requests for validation
- Adding new routes or API endpoints
- Implementing authentication or authorization logic
- Making any changes to HTTP request/response behavior
- User mentions "feature test", "HTTP test", or "endpoint test"
- **Any business logic is added to codebase that affects user-facing functionality**

Feature tests should be written **at the same time** as the code being tested, not after. This ensures code quality and prevents regressions.

## File Structure

Feature tests mirror the application structure, organized by HTTP layer:

```
tests/Feature/Http/Controllers/{ControllerName}/{MethodName}Test.php
```

**Examples:**

- `tests/Feature/Http/Controllers/Auth/RegisteredUserController/StoreTest.php`
- `tests/Feature/Http/Controllers/User/ProfileController/UpdateTest.php`
- `tests/Feature/Http/Controllers/Order/OrderController/IndexTest.php`
- `tests/Feature/Http/Controllers/Order/OrderController/ShowTest.php`

**Naming Conventions:**

- Test file named after the controller method: `StoreTest.php`, `UpdateTest.php`, `DestroyTest.php`
- One test file per controller method
- Multiple test cases in each file covering different scenarios

## Core Conventions

### 1. Test File Structure

All feature tests must follow this structure:

```php
<?php

declare(strict_types=1);

use App\Models\User;

test('descriptive test name in sentence case', function (): void {
    // Arrange
    $user = User::factory()->create();
    
    // Act
    $response = $this->actingAs($user)->post(route('endpoint'), getData());
    
    // Assert
    $response->assertValid()->assertRedirect();
    
    expect($user->fresh())
        ->property->toBe('expected value');
});

// Helper functions at bottom of file
function getData(array $overrides = []): array
{
    return array_merge([
        'field' => 'value',
    ], $overrides);
}
```

**Key Requirements:**

- Always include `declare(strict_types=1);`
- Use `test('description', function (): void {})` syntax (Pest v4)
- Descriptive test names in plain English
- Follow Arrange-Act-Assert (AAA) pattern
- Use `expect()` for assertions
- Helper functions at bottom of file for test data
- Test function must have `void` return type

### 2. Pest Testing Helpers

**HTTP Methods:**

```php
// GET requests
$this->get(route('users.index'))

// POST requests
$this->post(route('users.store'), getData())

// PUT/PATCH requests
$this->put(route('users.update', $user), getData())
$this->patch(route('users.update', $user), getData())

// DELETE requests
$this->delete(route('users.destroy', $user))
```

**Authentication:**

```php
// Acting as authenticated user
$this->actingAs($user)->get(route('dashboard'))

// Acting as guest
$this->get(route('login'))

// Assert authenticated
$this->assertAuthenticated()
$this->assertGuest()
```

**Response Assertions:**

```php
// Status codes
->assertOk()
->assertCreated()
->assertNoContent()
->assertNotFound()

// Redirects
->assertRedirect(route('dashboard'))
->assertRedirectToRoute('dashboard')

// Validation
->assertValid()
->assertInvalid(['email'])
->assertSessionHasErrors(['email'])

// JSON responses
->assertJson(['key' => 'value'])
->assertJsonStructure(['data' => ['id', 'name']])
```

**Database Assertions:**

```php
// Database state
$this->assertDatabaseHas('users', ['email' => 'test@example.com'])
$this->assertDatabaseMissing('users', ['email' => 'deleted@example.com'])
$this->assertDatabaseCount('users', 5)

// Soft deletes
$this->assertSoftDeleted($model)
```

### 3. Expect Assertions

Use `expect()` for fluent assertions:

```php
$user = User::query()->sole();

expect($user)
    ->name->toBe('Test User')
    ->email->toBe('test@example.com')
    ->email_verified_at->toBeNull()
    ->and($user->posts)->toHaveCount(3);
```

### 4. Helper Functions

Place helper functions at the bottom of the test file:

```php
function getData(array $overrides = []): array
{
    return array_merge([
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ], $overrides);
}

function createUserWithPosts(int $count = 3): User
{
    return User::factory()
        ->has(Post::factory()->count($count))
        ->create();
}
```

## Examples

### Example 1: Simple Registration Test

```php
<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('new users can register', function (): void {
    $this->post(route('register'), getRegistrationData())
        ->assertValid()
        ->assertRedirect(route('dashboard.index'));

    $this->assertAuthenticated();

    $user = User::query()->sole();

    expect($user)
        ->name->toBe('Test User')
        ->email->toBe('test@example.com')
        ->language->toBe(config('app.locale'))
        ->email_verified_at->toBeNull()
        ->and(Hash::check('password', $user->password))->toBeTrue();
});

test('registration requires valid email', function (): void {
    $this->post(route('register'), getRegistrationData(['email' => 'invalid']))
        ->assertInvalid(['email']);

    $this->assertGuest();
    $this->assertDatabaseCount('users', 0);
});

function getRegistrationData(array $overrides = []): array
{
    return array_merge([
        'name' => 'Test User',
        'email' => 'test@example.com',
        'language' => 'en',
        'password' => 'password',
        'password_confirmation' => 'password',
    ], $overrides);
}
```

### Example 2: Update Profile Test

```php
<?php

declare(strict_types=1);

use App\Models\User;

test('authenticated users can update their profile', function (): void {
    $user = User::factory()->create([
        'name' => 'Old Name',
        'email' => 'old@example.com',
    ]);

    $this->actingAs($user)
        ->patch(route('profile.update'), getProfileData())
        ->assertValid()
        ->assertRedirect(route('profile.edit'))
        ->assertSessionHas('status', 'profile-updated');

    expect($user->fresh())
        ->name->toBe('New Name')
        ->email->toBe('new@example.com');
});

test('users cannot update profile with duplicate email', function (): void {
    $existingUser = User::factory()->create(['email' => 'existing@example.com']);
    $user = User::factory()->create();

    $this->actingAs($user)
        ->patch(route('profile.update'), getProfileData([
            'email' => 'existing@example.com',
        ]))
        ->assertInvalid(['email']);

    expect($user->fresh()->email)->not->toBe('existing@example.com');
});

function getProfileData(array $overrides = []): array
{
    return array_merge([
        'name' => 'New Name',
        'email' => 'new@example.com',
    ], $overrides);
}
```

### Example 3: API Resource Test

```php
<?php

declare(strict_types=1);

use App\Models\Order;
use App\Models\User;

test('authenticated users can list their orders', function (): void {
    $user = User::factory()->create();
    $orders = Order::factory()->count(3)->for($user)->create();

    $this->actingAs($user)
        ->get(route('api.orders.index'))
        ->assertOk()
        ->assertJsonCount(3, 'data')
        ->assertJsonStructure([
            'data' => [
                '*' => ['id', 'total', 'status', 'created_at'],
            ],
        ]);
});

test('users can only see their own orders', function (): void {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    
    Order::factory()->for($otherUser)->create();
    Order::factory()->for($user)->create();

    $this->actingAs($user)
        ->get(route('api.orders.index'))
        ->assertOk()
        ->assertJsonCount(1, 'data');
});
```

## Anti-Patterns

### ❌ Don't Do This

```php
// Don't forget strict types
<?php
use App\Models\User;

// Don't skip return type
test('users can register', function () {
    // ...
});

// Don't use PHPUnit syntax
public function testUsersCanRegister(): void
{
    $this->post('/register', []);
}

// Don't hardcode URLs
$this->get('/dashboard');

// Don't create test data inline
$this->post(route('register'), [
    'name' => 'Test User',
    'email' => 'test@example.com',
    // ...
]);

// Don't skip assertions
$this->post(route('register'), getData());
// No assertions!
```

### ✅ Do This Instead

```php
// Always include strict types
<?php

declare(strict_types=1);

// Always type hint return type
test('users can register', function (): void {
    // ...
});

// Use Pest syntax
test('users can register', function (): void {
    // ...
});

// Use named routes
$this->get(route('dashboard.index'));

// Use helper functions
function getData(array $overrides = []): array
{
    return array_merge([
        'name' => 'Test User',
        'email' => 'test@example.com',
    ], $overrides);
}

// Always assert results
$this->post(route('register'), getData())
    ->assertValid()
    ->assertRedirect();
```

## Quality Standards

- All feature tests must pass PHPStan level 9
- 100% type coverage required
- Code formatted with Pint
- 90% overall test coverage required
- Tests must be independent (no test order dependency)
- Use `LazilyRefreshDatabase` trait (configured in Pest.php)
- Every controller method must have at least one feature test
- Critical paths must have multiple test cases (happy path + edge cases)

## Integration with Actions

Controllers should delegate to Actions, and feature tests should verify the full flow:

```php
test('order is processed successfully', function (): void {
    $user = User::factory()->create();
    $product = Product::factory()->create(['price' => 1000]);

    $this->actingAs($user)
        ->post(route('orders.store'), [
            'product_id' => $product->id,
            'quantity' => 2,
        ])
        ->assertValid()
        ->assertRedirect(route('orders.index'));

    // Verify Action results
    $order = Order::query()->sole();

    expect($order)
        ->user_id->toBe($user->id)
        ->total->toBe(2000)
        ->status->toBe('pending');
});
```

## Running Tests

```bash
# Run all feature tests
php artisan test --testsuite=Feature

# Run specific test file
php artisan test tests/Feature/Http/Controllers/Auth/RegisteredUserController/StoreTest.php

# Run with coverage
php artisan test --coverage --min=90

# Run specific test by name
php artisan test --filter="new users can register"
```
