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
- Use `final` class modifier (always required)
- Add `readonly` modifier when all class properties are readonly
- Constructor injection for all dependencies
- Single `handle()` method as the entry point
- Accept DTOs for external data, primitives/models for internal logic
- Return domain objects, not HTTP responses

### 2. The `readonly` Keyword

**Rules:**

- **`final`** - Always required for all Action classes
- **`readonly`** - Add when all class properties are readonly (typically when using constructor injection)

**When to use `readonly`:**

```php
// ✅ Use readonly - all properties are readonly via constructor
final readonly class RegisterUserAction
{
    public function __construct(
        private Localisation $localisation,
        private EmailService $emailService
    ) {}
}

// ✅ No readonly - no constructor properties
final class DeleteUserAction
{
    public function handle(User $user): bool
    {
        return (bool) $user->delete();
    }
}
```

**Why use `readonly`:**

- Prevents accidental mutation of dependencies
- Makes Action classes immutable and thread-safe
- Modern PHP best practice for value objects and services
- Clear signal that Action has no internal state

### 3. Naming Conventions

- **Class name:** `{Verb}{Noun}Action` (e.g., `RegisterUserAction`, `UpdateUserPasswordAction`)
- **Method name:** Always `handle()`
- **Namespace:** `App\Actions\{Domain}`

### 4. Dependency Injection

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
- Can inject other Actions for composition (see Advanced Patterns)

## Input & Output Patterns

### Input Parameters: DTOs vs Primitives

**Use DTOs when:**

- Accepting data from external sources (HTTP requests, API calls, external dependencies)
- Data originates from Form Requests
- Multiple related fields need to be passed together
- Type safety and validation are critical

```php
// ✅ DTO for external data from request
public function handle(RegisterData $data): User
{
    return User::create([
        'name' => $data->name,
        'email' => $data->email,
        'password' => Hash::make($data->password),
    ]);
}
```

**Use Primitives/Models when:**

- Handling internal business logic (triggered by jobs, events, services)
- Simple single-field operations
- Data is already validated/trusted
- Action is called from within the application

```php
// ✅ Primitives for internal logic
public function handle(User $user, string $password): bool
{
    $user->password = Hash::make($password);
    return $user->save();
}
```

**Decision criteria:**

- **3+ parameters?** → Use DTO
- **From HTTP request?** → Use DTO
- **Internal service call?** → Primitives are fine
- **Single parameter?** → Primitive or Model is fine

### Return Types

Choose return types based on what the caller needs:

**Return Model** - When caller needs the updated instance:

```php
public function handle(RegisterData $data): User
{
    $user = User::create([...]);
    event(new Registered($user));
    return $user; // ← Caller will use this (API resource, response, etc.)
}
```

**Return bool** - For success/failure operations:

```php
public function handle(User $user, string $password): bool
{
    $user->password = Hash::make($password);
    return $user->save(); // ← Caller only needs success status
}
```

**Return void** - For fire-and-forget operations:

```php
public function handle(User $user): void
{
    if ($user->avatar_path) {
        Storage::disk('public')->delete($user->avatar_path);
    }
    $user->delete();
    // ← No return needed, operation is complete
}
```

**Never return:**

- HTTP Response objects (`JsonResponse`, `RedirectResponse`)
- Request objects
- Framework-specific types (keep Actions portable)

## Advanced Patterns

### Private Helper Methods

Extract private methods when:

- Logic is reusable within the Action
- It improves readability by naming a block of logic
- The `handle()` method becomes too long (>20 lines as guideline)

```php
final readonly class RegisterUserAction
{
    public function __construct(
        private Localisation $localisation
    ) {}

    public function handle(RegisterData $data): User
    {
        return User::create([
            'name' => $data->name,
            'email' => $data->email,
            'language' => $this->getLanguage($data->language), // ← Extract complex logic
            'password' => Hash::make($data->password),
        ]);
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

**When NOT to extract:**

- Logic is only 2-3 lines
- Extraction would make code harder to follow
- Consider extracting to a separate Action or Service instead

### Exception Handling

**Default approach:** Let exceptions bubble to Laravel's global exception handler

```php
public function handle(UpdateUserAvatarData $data): User
{
    // Let ImageProcessorException bubble up
    $path = ImageProcessor::process($data->image);

    $user->update(['avatar_path' => $path]);
    return $user;
}
```

**Catch only for recoverable errors** with graceful degradation:

```php
final readonly class EnableTwoFactorAction
{
    public function __construct(
        private TwoFactorAuthentication $twoFactorAuthentication
    ) {}

    public function handle(User $user): bool
    {
        try {
            return $user->update([
                'two_factor_secret' => $this->twoFactorAuthentication->generateSecretKey(),
                'two_factor_recovery_codes' => Collection::times(
                    8,
                    fn (): string => $this->twoFactorAuthentication->generateRecoveryCode()
                )->all(),
            ]);
        } catch (Throwable $throwable) {
            report($throwable); // ← Log to Laravel's error handler
            return false; // ← Graceful failure, caller can handle
        }
    }
}
```

**Document uncaught exceptions** with `@throws`:

```php
/**
 * @throws ImageProcessorException
 */
public function handle(User $user, UpdateUserAvatarData $data): User
{
    // Exception can be thrown, let it bubble
    $path = ImageProcessor::process($data->image);
    return $user->update(['avatar_path' => $path]);
}
```

**When to catch:**

- Error is recoverable and Action can return a fallback value
- You want to log additional context before re-throwing
- Graceful degradation is acceptable (e.g., optional features)

**When NOT to catch:**

- Validation errors (should be caught in Form Request layer)
- Database constraint violations (let global handler manage)
- Authorization failures (let middleware/policies handle)

### Action Composition

Actions can call other Actions for complex workflows:

```php
final readonly class RegisterUserAction
{
    public function __construct(
        private SyncUserRolesAction $syncUserRoles,
        private AssignTeamAction $assignTeam,
        private SendWelcomeEmailAction $sendWelcomeEmail
    ) {}

    public function handle(RegisterData $data): User
    {
        $user = User::create([
            'name' => $data->name,
            'email' => $data->email,
            'password' => Hash::make($data->password),
        ]);

        // Compose multiple Actions for complex workflow
        $this->syncUserRoles->handle($user, $data->roles);
        $this->assignTeam->handle($user, $data->teamId);
        $this->sendWelcomeEmail->handle($user);

        event(new Registered($user));

        return $user;
    }
}
```

**Benefits:**

- Each Action remains single-responsibility
- Easy to test individual Actions in isolation
- Reusable Actions across different workflows
- Clear separation of concerns

### Database Transactions

**When to use transactions:**

- Action performs multiple database writes
- Data integrity requires all-or-nothing execution
- Calling multiple Actions that modify the database

```php
final readonly class RegisterUserAction
{
    public function __construct(
        private SyncUserRolesAction $syncUserRoles,
        private AssignTeamAction $assignTeam
    ) {}

    public function handle(RegisterData $data): User
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data->name,
                'email' => $data->email,
                'password' => Hash::make($data->password),
            ]);

            // Both must succeed or transaction rolls back
            $this->syncUserRoles->handle($user, $data->roles);
            $this->assignTeam->handle($user, $data->teamId);

            return $user;
        });
    }
}
```

**Note:** Database transactions are a general best practice for data consistency, not specific to the Action pattern. Use them whenever multiple database operations must succeed or fail together.

## Examples

### Example 1: Simple Action (No Dependencies)

```php
<?php

declare(strict_types=1);

namespace App\Actions\User;

use App\Models\User;

final class DeleteUserAction
{
    public function handle(User $user): bool
    {
        if ($user->avatar_path) {
            Storage::disk('public')->delete($user->avatar_path);
        }

        return (bool) $user->delete();
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

### Example 3: Action with Exception Handling

```php
<?php

declare(strict_types=1);

namespace App\Actions\Auth;

use App\Models\User;
use App\Support\TwoFactorAuthentication\Contracts\TwoFactorAuthentication;
use Illuminate\Support\Collection;
use Throwable;

final readonly class EnableTwoFactorAction
{
    public function __construct(
        private TwoFactorAuthentication $twoFactorAuthentication
    ) {}

    public function handle(User $user): bool
    {
        try {
            return $user->update([
                'two_factor_secret' => $this->twoFactorAuthentication->generateSecretKey(),
                'two_factor_recovery_codes' => Collection::times(
                    8,
                    fn (): string => $this->twoFactorAuthentication->generateRecoveryCode()
                )->all(),
            ]);
        } catch (Throwable $throwable) {
            report($throwable);
            return false; // Graceful failure
        }
    }
}
```

### Example 4: Action Composition with Transaction

```php
<?php

declare(strict_types=1);

namespace App\Actions\Order;

use App\Actions\Inventory\ReserveInventoryAction;
use App\Actions\Payment\ProcessPaymentAction;
use App\Actions\Notification\SendOrderConfirmationAction;
use App\DTOs\Order\CreateOrderData;
use App\Models\Order;
use Illuminate\Support\Facades\DB;

final readonly class CreateOrderAction
{
    public function __construct(
        private ReserveInventoryAction $reserveInventory,
        private ProcessPaymentAction $processPayment,
        private SendOrderConfirmationAction $sendConfirmation
    ) {}

    public function handle(CreateOrderData $data): Order
    {
        return DB::transaction(function () use ($data) {
            // Create order
            $order = Order::create([
                'user_id' => $data->userId,
                'total' => $data->total,
            ]);

            // Reserve inventory (must succeed)
            $this->reserveInventory->handle($order, $data->items);

            // Process payment (must succeed)
            $this->processPayment->handle($order, $data->paymentMethod);

            // Send confirmation (fire and forget, outside transaction)
            dispatch(fn () => $this->sendConfirmation->handle($order));

            return $order;
        });
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

// Don't use readonly without all properties being readonly
final readonly class BadAction
{
    public string $mutableProperty; // ❌ Breaks readonly contract
}

// Don't catch all exceptions without good reason
public function handle($data): mixed
{
    try {
        // complex logic
    } catch (Throwable $e) {
        return null; // ❌ Swallowing errors, hard to debug
    }
}

// Don't make helper methods public
final class RegisterUserAction
{
    public function getLanguage(string $locale): string // ❌ Should be private
    {
        // ...
    }
}
```

### ✅ Do This Instead

```php
// Accept DTOs from external sources
public function handle(UpdateUserData $data): User

// Accept primitives for internal logic
public function handle(User $user, string $password): bool

// Return domain objects
public function handle(RegisterData $data): User

// Use readonly when all properties are readonly
final readonly class UpdateUserAction
{
    public function __construct(
        private UserRepository $users
    ) {}
}

// Use final without readonly when no properties
final class DeleteUserAction
{
    public function handle(User $user): bool
}

// Let exceptions bubble (default)
public function handle(User $user): void
{
    $user->delete(); // Let exceptions bubble
}

// Catch only recoverable errors
try {
    $result = $service->attemptOperation();
} catch (RecoverableException $e) {
    report($e);
    return $fallbackValue;
}

// Make helper methods private
private function getLanguage(string $locale): string
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

**Controller responsibilities:**

- Validate input (via Form Request)
- Call Action with validated DTO
- Handle HTTP response formatting
- Manage session/auth state

**Action responsibilities:**

- Execute business logic
- Interact with models/services
- Return domain objects
- Maintain data integrity

## Quality Standards

- All Actions must pass PHPStan level 8
- 100% type coverage required
- Code formatted with Pint
- Refactored with Rector
- Covered by feature tests (see `writing-feature-tests` skill)
