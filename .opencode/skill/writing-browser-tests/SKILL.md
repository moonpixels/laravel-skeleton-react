---
name: writing-browser-tests
description: Writing browser tests for end-to-end user workflows and JavaScript interactions using Pest v4 with Playwright. Use MINIMALLY - only for core areas, happy paths, and functionality that CANNOT be tested with feature tests. Browser tests replace QA smoke testing, not feature tests.
---

# Writing Browser Tests

**Browser tests should be used minimally.** They are slow, complex, and should not duplicate feature test coverage. Think of browser tests as automated QA smoke tests.

## Testing Hierarchy

1. **Feature Tests (PRIMARY)** - Default for all business logic and HTTP endpoints
2. **Unit Tests (SUPPLEMENTARY)** - For complex, concentrated areas
3. **Browser Tests (MINIMAL)** - Only for core areas and JS interactions (you're here)

**Critical Rule: DO NOT write browser tests for functionality already covered by feature tests.**

## When to Use Browser Tests

Use **sparingly and selectively** when:

- Testing **core critical workflows** (login, registration, checkout)
- Testing **happy path user journeys** that verify the app works end-to-end
- Testing functionality that **CANNOT** be tested with feature tests:
  - Client-side JavaScript interactions
  - Real browser rendering behavior
  - Complex React component interactions requiring a real DOM
  - WebSocket/real-time features with client-side updates
  - File uploads with JavaScript preview/manipulation
  - Drag-and-drop, canvas, or SVG interactions

## What NOT to Test with Browser Tests

- Validation rules (use feature tests)
- Authentication/authorization logic (use feature tests)
- API endpoints (use feature tests)
- Business logic (use feature tests or unit tests)
- Database operations (use feature tests)
- **Anything that can be adequately tested with feature tests**

## File Structure

```
tests/Browser/{FeatureName}Test.php
```

**Examples:** `LoginTest.php`, `RegistrationTest.php`, `CheckoutTest.php`

## Core Conventions

### Test Structure

```php
<?php

declare(strict_types=1);

use App\Models\User;

test('users can complete the workflow', function (): void {
    $user = User::factory()->create();

    visit(route('feature.index'))
        ->fill('field', 'value')
        ->press('Submit')
        ->assertSee('Success message')
        ->assertRoute('dashboard.index');
});
```

### Browser Testing Helpers

**Navigation:**

```php
visit(route('login'))
click('Dashboard')
back()
```

**Form Interactions:**

```php
fill('email', 'test@example.com')
select('country', 'US')
check('terms')
uncheck('newsletter')
press('Submit')
```

**Assertions:**

```php
assertSee('Welcome')
assertDontSee('Error')
assertRoute('dashboard.index')
assertPresent('#element-id')
assertMissing('.error-message')
assertChecked('terms')
```

**Waiting:**

```php
waitForText('Loading complete')
waitFor('.modal')
waitForRoute('dashboard.index')
```

### Authentication Helper

```php
function loginAs(User $user): void
{
    visit(route('login'))
        ->fill('email', $user->email)
        ->fill('password', 'password')
        ->press('Log in')
        ->assertRoute('dashboard.index');
}
```

## Anti-Patterns

### Don't Do This

```php
// Don't test validation with browser tests (use feature tests)
test('form validation works', function (): void {
    visit(route('register'))
        ->press('Submit')
        ->assertSee('The email field is required');
});

// Don't test simple form submissions (use feature tests)
test('users can update profile', function (): void {
    loginAs($user);
    visit(route('profile.edit'))
        ->fill('name', 'New Name')
        ->press('Save')
        ->assertSee('Profile updated');
});
```

### Do This Instead

```php
// Feature test - Fast and comprehensive
test('registration requires email', function (): void {
    $this->post(route('register'), [])
        ->assertInvalid(['email']);
});

// Browser test - Only for what feature tests can't test
test('profile image preview updates when file selected', function (): void {
    $user = User::factory()->create();
    loginAs($user);

    visit(route('profile.edit'))
        ->attach('avatar', storage_path('testing/avatar.jpg'))
        ->waitFor('.image-preview') // JavaScript-driven preview
        ->assertPresent('.image-preview img');
});
```

## The Golden Rule

**Before writing a browser test, ask: "Can I test this with a feature test?"**

If yes, write a feature test instead. Browser tests are for:

- Core workflow smoke tests (happy paths only)
- Functionality that literally cannot be tested without a real browser

## Running Tests

```bash
# Run all browser tests
php artisan test --testsuite=Browser

# Run in headed mode (see browser)
HEADED=1 php artisan test --testsuite=Browser
```

## Debugging

```php
screenshot('debug-screen.png')
pause(5000)
dump(script('return document.body.innerHTML'))
```

## Quality Standards

- All browser tests must pass PHPStan level 8
- Tests must be independent and idempotent
- **MINIMAL BROWSER TESTS** - Far fewer than feature tests
- **NO DUPLICATION** - Never test what feature tests already cover
- Keep tests focused on ONE happy path workflow

## References

- [references/examples.md](references/examples.md) - Complete working examples and patterns
