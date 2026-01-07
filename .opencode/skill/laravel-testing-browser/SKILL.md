---
name: laravel-testing-browser
description: Create browser tests using Pest v4 with Playwright for end-to-end testing
compatibility: opencode
metadata:
  category: testing
  domain: frontend
---

## What Browser Tests Are

Browser tests run in real browsers using Playwright for end-to-end testing.

## Creating Browser Tests

**Command:**

```bash
php artisan make:test --pest --browser BrowserName
```

## Location

- **Location**: `tests/Browser/`

## Structure Pattern

```php
<?php

declare(strict_types=1);

use App\Models\User;

test('user can login', function (): void {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => bcrypt('password'),
    ]);

    $this->visit('/login')
        ->type('#email', 'test@example.com')
        ->type('#password', 'password')
        ->click('button[type="submit"]')
        ->waitForURL('/dashboard')
        ->assertSee('Dashboard');
});

test('registration form works', function (): void {
    $this->visit('/register')
        ->type('#name', 'John Doe')
        ->type('#email', 'john@example.com')
        ->type('#password', 'password123')
        ->type('#password_confirmation', 'password123')
        ->click('button[type="submit"]')
        ->waitForURL('/dashboard')
        ->assertAuthenticated();
});
```

## Key Methods

**Navigation:**

- `visit($url)` - Navigate to URL
- `waitForURL($url)` - Wait for URL to match
- `reload()` - Reload page

**Interactions:**

- `click($selector)` - Click element
- `type($selector, $text)` - Type into input
- `fill($selector, $value)` - Fill input (replaces existing)
- `select($selector, $value)` - Select dropdown option
- `check($selector)` - Check checkbox
- `uncheck($selector)` - Uncheck checkbox

**Waiting:**

- `waitForText($text)` - Wait for text to appear
- `waitForURL($url)` - Wait for URL
- `waitFor($selector)` - Wait for element
- `pause($milliseconds)` - Wait for duration

**Assertions:**

- `assertSee($text)` - Text visible on page
- `assertDontSee($text)` - Text not visible
- `assertAuthenticated()` - User is authenticated
- `assertNoJavascriptErrors()` - No JS errors
- `assertURL($url)` - Current URL matches

**Screenshots:**

- `screenshot($name)` - Take screenshot for debugging

## Laravel Features Work

All Laravel features work in browser tests:

```php
test('events are dispatched', function (): void {
    Event::fake([UserRegistered::class]);

    $this->visit('/register')
        ->fill('form', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
        ])
        ->click('button[type="submit"]')
        ->waitForURL('/dashboard');

    Event::assertDispatched(UserRegistered::class);
});
```

## Using Factories

```php
test('user can view their posts', function (): void {
    $user = User::factory()
        ->hasPosts(3)
        ->create();

    $this->actingAs($user)
        ->visit('/posts')
        ->assertSee($user->posts->first()->title);
});
```

## Testing JavaScript Interactions

```php
test('modal opens and closes', function (): void {
    $this->visit('/dashboard')
        ->click('[data-modal-trigger]')
        ->waitForText('Modal Content')
        ->assertSee('Modal Content')
        ->click('[data-modal-close]')
        ->waitFor('[data-modal]', ['state' => 'hidden'])
        ->assertDontSee('Modal Content');
});
```

## Testing Forms

```php
test('form validation displays errors', function (): void {
    $this->visit('/posts/create')
        ->click('button[type="submit"]')
        ->waitForText('The title field is required')
        ->assertSee('The title field is required');
});
```

## Debugging with Screenshots

```php
test('complex interaction', function (): void {
    $this->visit('/dashboard')
        ->screenshot('before-click')
        ->click('[data-action]')
        ->screenshot('after-click')
        ->assertSee('Success');
});
```

## Running Browser Tests

```bash
php artisan test tests/Browser/
php artisan test --filter=BrowserTestName
```

## Configuration

Browser tests use Playwright under the hood. Configuration in `pest.php`:

- Headless mode by default
- Automatic browser management
- Parallel execution supported

## When to Use Browser Tests

- Testing JavaScript interactions
- Testing full user workflows
- Testing form submissions with client-side validation
- Testing SPAs (Inertia.js pages)
- Testing real browser behavior
- Visual regression testing

## Anti-Patterns

❌ Over-relying on browser tests (slower than feature tests)
❌ Testing backend logic (use unit/feature tests)
❌ Not using `waitFor` methods (flaky tests)
❌ Hardcoding wait times (use explicit waits)
❌ Testing every scenario in browser (test critical paths only)
