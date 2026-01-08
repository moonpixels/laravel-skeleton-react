---
name: creating-actions
description: Create Laravel Action classes for business logic operations following domain-driven design. Use when creating Actions, implementing business logic, handling user operations, or when user mentions Action classes, domain operations, business rules, or service classes.
---

# Creating Laravel Actions

## When to Use This Skill

Use this skill when:

- User requests "create a [Name]Action"
- Implementing business logic that doesn't belong in controllers or models
- Handling complex operations that require multiple steps
- User mentions business rules, domain operations, or service layer
- Refactoring fat controllers into smaller, testable units

## File Structure

Actions are organized by domain context:

```
app/Actions/{Domain}/{Name}Action.php
```

**Examples:**

- `app/Actions/Auth/RegisterUserAction.php`
- `app/Actions/User/UpdateUserPasswordAction.php`
- `app/Actions/Order/ProcessOrderAction.php`

## Core Conventions

### 1. Action Class Structure

Actions must follow these patterns:

```php
<?php

declare(strict_types=1);

namespace App\Actions\{Domain};

use App\DTOs\{Domain}\{Name}Data;
use App\Models\{Model};

final readonly class {Name}Action
{
    public function __construct(
        private DependencyOne $dependencyOne,
        private DependencyTwo $dependencyTwo
    ) {}

    public function handle({Name}Data $data): {ReturnType}
    {
        // Business logic here

        return $result;
    }
}
```

**Key Requirements:**

- Always include `declare(strict_types=1);`
- Use `final readonly` class modifier
- Constructor injection for all dependencies
- Single `handle()` method as the entry point
- Accept DTOs, not Form Requests
- Return domain objects, not HTTP responses

### 2. Naming Conventions

- **Class name:** `{Verb}{Noun}Action` (e.g., `RegisterUserAction`, `UpdateUserPasswordAction`)
- **Method name:** Always `handle()`
- **Namespace:** `App\Actions\{Domain}`

### 3. Dependency Injection

```php
public function __construct(
    private UserRepository $users,
    private EmailService $emailService,
    private Localisation $localisation
) {}
```

- Inject services, repositories, facades, or other dependencies
- Do NOT inject Request or other HTTP-specific classes
- Keep Actions framework-agnostic where possible

## Examples

### Example 1: Simple Action

```php
<?php

declare(strict_types=1);

namespace App\Actions\User;

use App\DTOs\User\DeleteUserData;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

final readonly class DeleteUserAction
{
    public function handle(DeleteUserData $data): void
    {
        $user = User::query()->findOrFail($data->userId);

        if ($user->avatar_path) {
            Storage::disk('public')->delete($user->avatar_path);
        }

        $user->delete();
    }
}
```

### Example 2: Action with Dependencies

```php
<?php

declare(strict_types=1);

namespace App\Actions\Auth;

use App\DTOs\Auth\RegisterData;
use App\Models\User;
use App\Support\Localisation\Localisation;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Hash;

final readonly class RegisterUserAction
{
    public function __construct(
        private Localisation $localisation
    ) {}

    public function handle(RegisterData $data): User
    {
        $user = User::query()->create([
            'name' => $data->name,
            'email' => $data->email,
            'language' => $this->getLanguage($data->language),
            'password' => Hash::make($data->password),
        ]);

        event(new Registered($user));

        return $user;
    }

    private function getLanguage(string $locale): string
    {
        $locales = [
            $this->localisation->getIso15897Locale($locale),
            $this->localisation->getLanguageFromLocale($locale),
        ];

        foreach ($locales as $locale) {
            if ($this->localisation->isSupportedLocale($locale)) {
                return $locale;
            }
        }

        return $this->localisation->getDefaultLocale();
    }
}
```

## Anti-Patterns

### ❌ Don't Do This

```php
// Don't inject Request directly
public function __construct(private Request $request) {}

// Don't return Response objects
public function handle($data): JsonResponse
{
    return response()->json(['success' => true]);
}

// Don't use mutable class properties
final class UpdateUserAction
{
    private User $user; // ❌ No mutable state
}

// Don't skip type declarations
public function handle($data) // ❌ Must type hint
{
    // ...
}
```

### ✅ Do This Instead

```php
// Accept DTOs
public function handle(UpdateUserData $data): User

// Return domain objects
public function handle(RegisterData $data): User

// Use readonly class
final readonly class UpdateUserAction

// Always type hint
public function handle(UpdateUserData $data): User
```

## Integration with Controllers

Controllers should be thin and delegate to Actions:

```php
public function store(
    RegisterRequest $request,
    RegisterUserAction $action
): RedirectResponse {
    $user = $action->handle($request->toDTO());

    auth('web')->login($user);

    return redirect('dashboard');
}
```

## Quality Standards

- All Actions must pass PHPStan level 9
- 100% type coverage required
- Code formatted with Pint
- Refactored with Rector
- Covered by feature tests (see `writing-feature-tests` skill)
