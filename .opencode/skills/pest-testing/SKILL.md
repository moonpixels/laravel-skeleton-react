---
name: pest-testing
description: Test Laravel applications with Pest 4 workflows for unit, feature, browser, and architecture coverage. Use when writing or debugging tests, assertions, datasets, mocks, or browser checks.
---

# Pest Testing

Apply Pest-first testing workflows that match Laravel and project quality standards.

## Quick Start

```php
it('creates a user', function () {
    $this->post(route('users.store'), ['name' => 'Taylor'])
        ->assertRedirect();

    expect(
        \App\Models\User::query()->where('name', 'Taylor')->exists()
    )->toBeTrue();
});
```

## Core Rules

- Create tests with `php artisan make:test --pest Name`.
- Prefer feature tests for HTTP behavior and user flows; use unit tests for isolated logic.
- Run the smallest affected scope first with `php artisan test --compact <file-or-filter>`.
- Prefer semantic assertions like `assertSuccessful()`, `assertNotFound()`, and `assertForbidden()`.
- Use factories, datasets, and mocks to keep tests readable and deterministic.

## Common Pattern

Start with a failing test, implement the smallest change, then re-run only the impacted tests before running broader suites.

## References

- [references/examples.md](references/examples.md) - Browser, dataset, mocking, and architecture testing patterns
