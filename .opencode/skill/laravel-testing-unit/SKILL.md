---
name: laravel-testing-unit
description: Create unit tests for isolated business logic using Pest
compatibility: opencode
metadata:
  category: testing
  domain: backend
---

## What Unit Tests Are

Unit tests test individual classes/methods in isolation without database or HTTP.

## Creating Unit Tests

**Command:**

```bash
php artisan make:test --pest --unit UnitName
```

## Location

- **Location**: `tests/Unit/`
- **Organization**: Mirror app structure (e.g., `tests/Unit/Actions/`, `tests/Unit/Models/`)

## Structure Pattern

```php
<?php

declare(strict_types=1);

use App\Actions\User\CalculateUserScoreAction;
use App\DTOs\User\UserScoreData;
use App\Models\User;

test('user score is calculated correctly', function (): void {
    $action = new CalculateUserScoreAction();

    $result = $action->handle(
        posts: 10,
        comments: 5,
        likes: 20
    );

    expect($result)->toBeInstanceOf(UserScoreData::class)
        ->and($result->score)->toBe(150);
});

test('score cannot be negative', function (): void {
    $action = new CalculateUserScoreAction();

    $result = $action->handle(
        posts: -10,
        comments: 0,
        likes: 0
    );

    expect($result->score)->toBeGreaterThanOrEqual(0);
});
```

## Key Patterns

- Use `test()` function (not `it()`)
- Return type `: void` on all tests
- No database interactions (or use `RefreshDatabase` if absolutely needed)
- No HTTP requests
- Test single responsibility
- Mock external dependencies
- Use `expect()` for assertions

## Testing Actions

```php
test('register user action creates user', function (): void {
    $localisation = Mockery::mock(Localisation::class);
    $localisation->shouldReceive('getDefaultLocale')->andReturn('en-GB');

    $action = new RegisterUserAction($localisation);

    $data = new RegisterData(
        name: 'John Doe',
        email: 'john@example.com',
        language: 'en-GB',
        password: 'password123'
    );

    $user = $action->handle($data);

    expect($user)->toBeInstanceOf(User::class)
        ->and($user->email)->toBe('john@example.com');
});
```

## Testing DTOs

```php
test('register data can be instantiated', function (): void {
    $data = new RegisterData(
        name: 'John Doe',
        email: 'john@example.com',
        language: 'en-GB',
        password: 'password123'
    );

    expect($data->name)->toBe('John Doe')
        ->and($data->email)->toBe('john@example.com')
        ->and($data->language)->toBe('en-GB');
});
```

## Testing Enums

```php
test('status enum returns correct label', function (): void {
    expect(StatusEnum::Active->label())->toBe('Active')
        ->and(StatusEnum::Inactive->label())->toBe('Inactive');
});

test('status enum returns correct color', function (): void {
    expect(StatusEnum::Active->color())->toBe('green')
        ->and(StatusEnum::Inactive->color())->toBe('red');
});
```

## Testing Model Methods

```php
test('user firstName accessor returns first name', function (): void {
    $user = new User(['name' => 'John Doe']);

    expect($user->firstName)->toBe('John');
});

test('user avatarUrl returns null when no avatar', function (): void {
    $user = new User(['avatar_path' => null]);

    expect($user->avatarUrl)->toBeNull();
});
```

## Mocking Dependencies

```php
use Mockery;

test('action uses injected service', function (): void {
    $service = Mockery::mock(PaymentService::class);
    $service->shouldReceive('charge')
        ->once()
        ->with(100)
        ->andReturn(true);

    $action = new ChargeUserAction($service);

    $result = $action->handle(100);

    expect($result)->toBeTrue();
});
```

## Expectations (Pest)

Common Pest expectations:

- `toBe($value)` - Strict equality
- `toEqual($value)` - Loose equality
- `toBeInstanceOf(Class::class)`
- `toBeTrue()` / `toBeFalse()`
- `toBeNull()`
- `toBeEmpty()`
- `toHaveCount($count)`
- `toContain($value)`

## Running Tests

```bash
composer run test                # All tests
php artisan test --filter=testName  # Specific test
php artisan test tests/Unit/       # All unit tests
```

## When to Use Unit Tests

- Testing Actions in isolation
- Testing pure functions/methods
- Testing calculations/algorithms
- Testing DTOs/Enums
- Testing model accessors/mutators
- Testing transformations

## Anti-Patterns

❌ Testing framework code (Eloquent, validation)
❌ Testing trivial getters/setters
❌ Not mocking external dependencies
❌ Database queries in unit tests (use feature tests)
❌ HTTP requests in unit tests
