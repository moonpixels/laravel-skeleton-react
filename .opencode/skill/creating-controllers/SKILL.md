---
name: creating-controllers
description: Create thin Laravel controllers that delegate to Actions for business logic. Use when creating controllers, handling HTTP requests, routing logic, or when user mentions controllers, HTTP handlers, or request handling.
---

# Creating Laravel Controllers

## When to Use This Skill

Use this skill when:

- User requests "create a controller"
- Handling HTTP requests and responses
- Routing requests to business logic
- User mentions controllers, HTTP handlers, or routes
- Rendering Inertia pages

## File Structure

Controllers are organized by domain/feature:

```
app/Http/Controllers/{Domain}/{Name}Controller.php
```

**Examples:**

- `app/Http/Controllers/Auth/RegisteredUserController.php`
- `app/Http/Controllers/Account/AccountController.php`
- `app/Http/Controllers/DashboardController.php`

## Core Conventions

### 1. Controller Structure

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\{Domain};

use App\Actions\{Domain}\{Name}Action;
use App\Http\Controllers\Controller;
use App\Http\Requests\{Domain}\{Name}Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class {Name}Controller extends Controller
{
    public function index(): Response
    {
        return Inertia::render('{domain}/{page}');
    }

    public function store(
        {Name}Request $request,
        {Name}Action $action
    ): RedirectResponse {
        $result = $action->handle($request->toDTO());

        return redirect()->route('resource.index');
    }
}
```

**Key Requirements:**

- Always include `declare(strict_types=1);`
- Use `final class` modifier
- Extend base `Controller` class
- Inject Form Requests for validation
- Inject Actions for business logic
- Keep methods thin (3-7 lines typical)
- Return appropriate response types

### 2. Method Naming (RESTful)

Follow Laravel's resource controller conventions:

- `index()` - Display list of resources
- `create()` - Show form to create resource
- `store()` - Store new resource
- `show()` - Display single resource
- `edit()` - Show form to edit resource
- `update()` - Update resource
- `destroy()` - Delete resource

### 3. Inertia Rendering

```php
public function create(): Response
{
    return Inertia::render('auth/register');
}

public function edit(User $user): Response
{
    return Inertia::render('account/general', [
        'user' => UserResource::make($user),
    ]);
}
```

## Examples

### Example 1: Resource Controller

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Actions\Auth\RegisterUserAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    public function store(
        RegisterRequest $request,
        RegisterUserAction $action
    ): RedirectResponse {
        $user = $action->handle($request->toDTO());

        auth('web')->login($user);

        $request->session()->regenerate();

        return redirect('dashboard');
    }
}
```

### Example 2: Single Action Controller

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\Account;

use App\Actions\User\UpdateUserAvatarAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Account\UpdateAccountAvatarRequest;
use Illuminate\Http\RedirectResponse;

final class AccountAvatarController extends Controller
{
    public function update(
        UpdateAccountAvatarRequest $request,
        UpdateUserAvatarAction $action
    ): RedirectResponse {
        $action->handle($request->toDTO());

        return back();
    }

    public function destroy(
        DeleteUserAvatarAction $action
    ): RedirectResponse {
        $action->handle(auth()->id());

        return back();
    }
}
```

### Example 3: Dashboard Controller

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\QueryBuilder\QueryBuilder;

final class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $users = QueryBuilder::for(User::class)
            ->allowedFilters(['name', 'email'])
            ->allowedSorts(['name', 'created_at'])
            ->paginate($request->integer('per_page', 10))
            ->withQueryString();

        return Inertia::render('dashboard/index', [
            'users' => UserResource::collection($users),
        ]);
    }
}
```

## Response Types

### Inertia Responses

```php
use Inertia\Response;

public function create(): Response
{
    return Inertia::render('page/name', [
        'prop' => $value,
    ]);
}
```

### Redirect Responses

```php
use Illuminate\Http\RedirectResponse;

public function store(): RedirectResponse
{
    return redirect()->route('resource.index');
    return redirect()->back();
    return redirect('dashboard');
}
```

### JSON Responses

```php
use Illuminate\Http\JsonResponse;

public function store(): JsonResponse
{
    return response()->json(['success' => true]);
}
```

## Anti-Patterns

### ❌ Don't Do This

```php
// Don't put business logic in controllers
public function store(Request $request)
{
    $user = User::create([...]); // ❌ Use Action
    Mail::send(...); // ❌ Use Action
    event(new Registered($user)); // ❌ Use Action
}

// Don't inject Request directly for validation
public function store(Request $request) // ❌ Use FormRequest
{
    $validated = $request->validate([...]);
}

// Don't return arrays
public function index(): array // ❌ Type hint Response
{
    return ['users' => $users];
}
```

### ✅ Do This Instead

```php
// Delegate to Actions
public function store(
    RegisterRequest $request,
    RegisterUserAction $action
): RedirectResponse {
    $user = $action->handle($request->toDTO());

    return redirect('dashboard');
}

// Use Form Requests
public function store(RegisterRequest $request)

// Type hint responses
public function index(): Response
{
    return Inertia::render('page', ['data' => $data]);
}
```

## Quality Standards

- All controllers must pass PHPStan level 8
- 100% type coverage required
- Code formatted with Pint
- Refactored with Rector
- Covered by feature tests (see `writing-feature-tests` skill)
