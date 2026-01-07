---
name: laravel-testing-feature
description: Create feature tests for HTTP endpoints and application workflows using Pest
compatibility: opencode
metadata:
  category: testing
  domain: backend
---

## What Feature Tests Are

Feature tests test complete HTTP requests/responses and application workflows.

## Creating Feature Tests

**Command:**

```bash
php artisan make:test --pest FeatureName
# or with subdirectories
php artisan make:test --pest Http/Controllers/PostControllerTest
```

## Location

- **Location**: `tests/Feature/`
- **Organization**: Mirror app structure (e.g., `tests/Feature/Http/Controllers/`)

## Structure Pattern

```php
<?php

declare(strict_types=1);

use App\Models\User;

test('users can register', function (): void {
    $this->post(route('register'), [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ])->assertRedirect(route('dashboard'));

    $this->assertDatabaseHas('users', [
        'email' => 'john@example.com',
    ]);
});

test('registration requires valid email', function (): void {
    $this->post(route('register'), [
        'name' => 'John Doe',
        'email' => 'invalid-email',
        'password' => 'password123',
    ])->assertSessionHasErrors('email');
});
```

## Key Patterns

- Use `test()` function (not `it()`)
- Return type `: void` on all tests
- Use `$this` to access test helpers (actingAs, get, post, etc.)
- Use factories for test data: `User::factory()->create()`
- Database automatically refreshed with `RefreshDatabase` trait (auto-applied)
- Use descriptive test names in plain English

## Authentication

```php
test('authenticated users can view dashboard', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk();
});

test('guests cannot view dashboard', function (): void {
    $this->get(route('dashboard'))
        ->assertRedirect(route('login'));
});
```

## Common Assertions

**HTTP:**

- `assertOk()` - 200 status
- `assertRedirect($uri)` - Redirects to URI
- `assertJson($data)` - JSON response contains data
- `assertSessionHas($key)` - Session has key
- `assertSessionHasErrors($key)` - Session has validation error

**Database:**

- `assertDatabaseHas('users', ['email' => 'test@example.com'])`
- `assertDatabaseMissing('users', ['email' => 'deleted@example.com'])`

**Expectations (Pest):**

- `expect($user)->toBeInstanceOf(User::class)`
- `expect($user->email)->toBe('test@example.com')`
- `expect($posts)->toHaveCount(3)`

## Testing JSON APIs

```php
test('api returns user list', function (): void {
    User::factory()->count(3)->create();

    $this->getJson(route('api.users.index'))
        ->assertOk()
        ->assertJsonCount(3, 'data')
        ->assertJsonStructure([
            'data' => [
                '*' => ['id', 'name', 'email'],
            ],
        ]);
});
```

## Testing Validation

```php
test('post creation requires title', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('posts.store'), [
            'content' => 'Some content',
        ])
        ->assertSessionHasErrors('title');
});
```

## Using Datasets

```php
test('invalid emails are rejected', function (string $email): void {
    $this->post(route('register'), ['email' => $email])
        ->assertSessionHasErrors('email');
})->with([
    'missing @' => 'notanemail',
    'missing domain' => 'test@',
    'invalid format' => '@example.com',
]);
```

## Running Tests

```bash
composer run test                # All tests
php artisan test --filter=testName  # Specific test
php artisan test tests/Feature/PostTest.php  # Specific file
```

## When to Use Feature Tests

- Testing HTTP endpoints
- Testing authentication/authorization
- Testing complete user workflows
- Testing API responses
- Testing database interactions via HTTP

## Anti-Patterns

❌ Testing internal implementation details
❌ Not using factories (hardcoding test data)
❌ Testing business logic (use unit tests for Actions)
❌ Slow tests (mock external services)
