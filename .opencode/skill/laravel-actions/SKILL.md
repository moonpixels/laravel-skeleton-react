---
name: laravel-actions
description: Create and use Laravel Action classes for business logic operations
compatibility: opencode
metadata:
  category: architecture
  domain: backend
---

## What Actions Are

Actions encapsulate single business logic operations in dedicated classes.

## Naming & Location

- **Suffix**: Always end with `Action` (e.g., `RegisterUserAction`, `UpdateProfileAction`)
- **Location**: `app/Actions/{Domain}/` organized by domain
  - `app/Actions/Auth/` - Authentication actions
  - `app/Actions/User/` - User management actions
  - `app/Actions/Todo/` - Todo operations

## Structure Pattern

```php
<?php

declare(strict_types=1);

namespace App\Actions\Auth;

use App\DTOs\Auth\RegisterData;
use App\Models\User;

final readonly class RegisterUserAction
{
    public function __construct(
        private Localisation $localisation
    ) {}

    public function handle(RegisterData $data): User
    {
        // Single business operation here
        return $user;
    }
}
```

## Key Patterns

- Use `final readonly class` for Actions
- Name the main method `handle()` or `execute()`
- Accept DTOs as parameters, not arrays
- Return DTOs or models, never arrays
- Use constructor injection for dependencies
- Alternative: Use `resolve(ServiceClass::class)` for conditional dependencies

## Dependency Injection

**Preferred (Constructor):**

```php
public function __construct(
    private ImageProcessor $processor,
    private Storage $storage
) {}
```

**Alternative (resolve helper):**

```php
public function handle(): User
{
    $processor = resolve(ImageProcessor::class);
}
```

## Usage in Controllers

```php
public function store(
    RegisterRequest $request,
    RegisterUserAction $action
): RedirectResponse {
    $data = $request->toDTO();
    $user = $action->handle($data);

    return redirect()->route('dashboard');
}
```

## When to Use Actions

- Complex business logic
- Multi-step operations
- Reusable operations across controllers
- Operations needing isolated testing
- Background job logic

## Anti-Patterns

❌ Multiple methods (create, update, delete) in one Action
❌ Returning arrays instead of DTOs/models
❌ Simple CRUD operations (use controllers directly)
❌ Placing business logic in controllers instead of Actions
