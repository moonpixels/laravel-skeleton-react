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
- Building REST APIs

## File Structure

### Web Controllers (Inertia.js)

```
app/Http/Controllers/{Domain}/{Name}Controller.php
```

**Examples:**

- `app/Http/Controllers/Auth/RegisteredUserController.php`
- `app/Http/Controllers/Account/AccountController.php`
- `app/Http/Controllers/Account/AccountAvatarController.php` (nested resource)
- `app/Http/Controllers/DashboardController.php`

### API Controllers

```
app/Http/Controllers/Api/V1/{Domain}/{Name}Controller.php
app/Http/Controllers/Api/V2/{Domain}/{Name}Controller.php
```

**Examples:**

- `app/Http/Controllers/Api/V1/UserController.php`
- `app/Http/Controllers/Api/V1/Auth/AuthController.php`
- `app/Http/Controllers/Api/V2/UserController.php`

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

### 2. Middleware Declaration (Laravel 11+)

Controllers can implement `HasMiddleware` to define middleware:

```php
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

final class VerifiedEmailController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware(['signed', 'throttle:6,1'], only: ['store']),
            new Middleware('auth', except: ['index', 'show']),
        ];
    }

    // ... controller methods
}
```

**Options:**

- `only: ['store', 'update']` - Apply to specific methods
- `except: ['index', 'show']` - Apply to all except these

**Alternative:** Define middleware in routes file (still valid)

```php
Route::get('/profile', [UserController::class, 'show'])->middleware('auth');
```

### 3. RESTful Method Naming + Cruddy by Design

**The 7 Standard Actions:**

Follow Laravel's resource controller conventions strictly:

- `index()` - Display list of resources
- `create()` - Show form to create resource
- `store()` - Store new resource
- `show()` - Display single resource
- `edit()` - Show form to edit resource
- `update()` - Update resource
- `destroy()` - Delete resource

**Cruddy by Design Philosophy:**

Always stick to these 7 actions. If you need a custom action, you should create a new controller instead. This forces you to think about what resource the user is actually interacting with.

**When to Create New Controllers:**

#### Pattern 1: Nested Resources

If you have a route like `/podcasts/{id}/episodes`, create a dedicated controller:

```php
// ✅ Do this
final class PodcastEpisodesController extends Controller
{
    public function index($podcastId): Response
    {
        $podcast = Podcast::with('episodes')->findOrFail($podcastId);

        return Inertia::render('podcast-episodes/index', [
            'podcast' => $podcast,
        ]);
    }
}
```

```php
// ❌ Don't do this
final class PodcastsController extends Controller
{
    public function listEpisodes($id) { } // ❌ Custom action
}
```

#### Pattern 2: Properties Edited Independently

If a model property is edited through a separate form, treat it as its own resource:

```php
// ✅ Do this
final class PodcastCoverImageController extends Controller
{
    public function update($podcastId): RedirectResponse
    {
        // Handle cover image update
    }
}

Route::put('/podcasts/{id}/cover-image', [PodcastCoverImageController::class, 'update']);
```

```php
// ❌ Don't do this
final class PodcastsController extends Controller
{
    public function update($id) { }             // Updates basic fields
    public function updateCoverImage($id) { }   // ❌ Custom action
}
```

**Real examples from this codebase:**

- `AccountAvatarController` - Avatar edited separately from account details
- `AccountPreferencesController` - Preferences edited separately from account
- `AccountSecurityController` - Security settings edited separately

#### Pattern 3: Pivot Models

Treat pivot tables as their own resource:

```php
// For a user_podcast pivot table
final class UserPodcastSubscriptionController extends Controller
{
    public function index(User $user): Response
    {
        $subscriptions = $user->podcastSubscriptions()->get();

        return Inertia::render('subscriptions/index', [
            'subscriptions' => $subscriptions,
        ]);
    }

    public function store(User $user, Podcast $podcast): RedirectResponse
    {
        $user->podcastSubscriptions()->attach($podcast->id);

        return back();
    }

    public function destroy(User $user, Podcast $podcast): RedirectResponse
    {
        $user->podcastSubscriptions()->detach($podcast->id);

        return back();
    }
}
```

#### Pattern 4: Different States

Different states of the same model are different resources:

```php
// ✅ Do this
final class PublishedPostsController extends Controller
{
    public function index() { }
}

final class DraftPostsController extends Controller
{
    public function index() { }
}
```

```php
// ❌ Don't do this
final class PostsController extends Controller
{
    public function index($status = 'published') { }  // ❌ Optional parameter
    public function listDrafts() { }                  // ❌ Custom action
}
```

**Key Insight:** Resources in your controllers don't have to map 1:1 with database tables. Think about what the user is actually doing, not what database table you're updating.

### 4. Dependency Injection

#### Method Injection (Preferred for Actions)

```php
public function store(
    RegisterRequest $request,
    RegisterUserAction $action  // ✅ Injected per method
): RedirectResponse {
    $user = $action->handle($request->toDTO());

    return redirect('dashboard');
}
```

**Use when:** Actions, Form Requests, one-time dependencies

**Why:** Cleaner for single-use dependencies, explicit about what each method needs

#### Constructor Injection (For Shared Services)

```php
final class PodcastController extends Controller
{
    public function __construct(
        protected PodcastRepository $podcasts,
    ) {}

    public function index(): Response
    {
        $podcasts = $this->podcasts->all();

        return Inertia::render('podcasts/index', compact('podcasts'));
    }

    public function show(Podcast $podcast): Response
    {
        $stats = $this->podcasts->getStats($podcast);

        return Inertia::render('podcasts/show', compact('podcast', 'stats'));
    }
}
```

**Use when:** Repositories, services used across multiple methods

**Why:** Avoids repeating injection in every method

#### CurrentUser Attribute (Modern Pattern)

```php
use Illuminate\Container\Attributes\CurrentUser;

public function update(
    #[CurrentUser] User $user,  // ✅ Auto-injects authenticated user
    UpdateAccountRequest $request,
    UpdateAccountAction $action
): RedirectResponse {
    $action->handle($user, $request->toDTO());

    return back();
}
```

**Use when:** You need the authenticated user

**Why:** Type-safe, explicit, no need for `auth()->user()`

### 5. Invokable (Single Action) Controllers

When a controller naturally has only one action, use the `__invoke()` method:

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Server\ProvisionServerAction;
use App\Http\Requests\ProvisionServerRequest;
use Illuminate\Http\RedirectResponse;

final class ProvisionServerController extends Controller
{
    public function __invoke(
        ProvisionServerRequest $request,
        ProvisionServerAction $action
    ): RedirectResponse {
        $server = $action->handle($request->toDTO());

        return redirect()->route('servers.show', $server);
    }
}
```

**Generate:** `php artisan make:controller ProvisionServer --invokable`

**Route:** `Route::post('/server', ProvisionServerController::class);`

**When to use:**

- Controller naturally has only one action
- Better than adding custom action to existing controller
- Follows Cruddy by Design (prefer new controller over custom action)

### 6. API Controllers

API controllers return JSON instead of Inertia pages. They follow the same conventions but with different response types.

**Directory Structure:**

```
app/Http/Controllers/Api/
├── V1/
│   ├── UserController.php
│   └── Auth/
│       └── AuthController.php
└── V2/
    └── UserController.php
```

**Key Differences from Web Controllers:**

| Aspect         | Web (Inertia)                          | API                        |
| -------------- | -------------------------------------- | -------------------------- |
| Returns        | `Inertia\Response`, `RedirectResponse` | `JsonResponse`, `Resource` |
| Authentication | Session (`auth:web`)                   | Token (`auth:sanctum`)     |
| Errors         | Redirects with flash messages          | JSON with status codes     |
| CSRF           | Required                               | Not required (stateless)   |

**Example API Controller:**

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Actions\User\CreateUserAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreUserRequest;
use App\Http\Resources\V1\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

final class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::paginate(15);

        return UserResource::collection($users)->response();
    }

    public function store(
        StoreUserRequest $request,
        CreateUserAction $action
    ): JsonResponse {
        $user = $action->handle($request->toDTO());

        return UserResource::make($user)
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(User $user): UserResource
    {
        return UserResource::make($user);
    }

    public function destroy(User $user): JsonResponse
    {
        $user->delete();

        return response()->noContent();
    }
}
```

**Routes:**

```php
// routes/api.php
Route::prefix('v1')->group(function (): void {
    Route::apiResource('users', App\Http\Controllers\Api\V1\UserController::class);
});
```

**Note:** This codebase is primarily Inertia.js. Only create API controllers when building a REST API.

### 7. Inertia Rendering

```php
use Inertia\Response;

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

**Best Practices:**

- Page names match route structure: `auth/register`, `account/general`
- Always pass data through API Resources for consistency
- Use `compact()` or array syntax for props

## Examples

### Example 1: Resource Controller

From the codebase: `app/Http/Controllers/Auth/RegisteredUserController.php`

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

        $request->session()->regenerate();  // Security: Prevent session fixation

        return redirect('dashboard');
    }
}
```

**Key Points:**

- Only 2 methods: `create()` and `store()`
- Delegates to `RegisterUserAction` for business logic
- Session regeneration for security after login
- Type-safe with FormRequest and typed returns

### Example 2: Nested Resource Controller

Example of "properties edited independently" pattern:

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\Account;

use App\Actions\User\UpdateUserPhoneAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Account\UpdatePhoneRequest;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\RedirectResponse;
use App\Models\User;

final class AccountPhoneController extends Controller
{
    public function update(
        UpdatePhoneRequest $request,
        #[CurrentUser] User $user,
        UpdateUserPhoneAction $action
    ): RedirectResponse {
        $action->handle($user, $request->toDTO());

        return back();
    }

    public function destroy(
        #[CurrentUser] User $user,
        UpdateUserPhoneAction $action
    ): RedirectResponse {
        $action->handle($user, new UpdateUserPhoneData(phone: null));

        return back();
    }
}
```

**Key Points:**

- Phone number edited separately from main account details
- Uses `#[CurrentUser]` for type-safe authenticated user
- Both `update` and `destroy` use same Action with different DTOs
- Follows "nested resource" pattern (account → phone)

### Example 3: QueryBuilder Controller

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

**Note:** For advanced QueryBuilder patterns (search callbacks, DateFilter, dynamic operators, `getSorts()`/`getFilters()` helpers), see `app/Http/Controllers/DashboardController.php` in the codebase.

### Example 4: Pivot Resource Controller

Treating a many-to-many relationship as its own resource:

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Subscription\SubscribeAction;
use App\Actions\Subscription\UnsubscribeAction;
use App\Http\Controllers\Controller;
use App\Models\Podcast;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class UserPodcastSubscriptionController extends Controller
{
    // List user's podcast subscriptions
    public function index(User $user): Response
    {
        $subscriptions = $user->podcastSubscriptions()
            ->with('podcast')
            ->get();

        return Inertia::render('subscriptions/index', [
            'subscriptions' => $subscriptions,
        ]);
    }

    // Subscribe user to podcast
    public function store(
        User $user,
        Podcast $podcast,
        SubscribeAction $action
    ): RedirectResponse {
        $action->handle($user, $podcast);

        return back();
    }

    // Unsubscribe user from podcast
    public function destroy(
        User $user,
        Podcast $podcast,
        UnsubscribeAction $action
    ): RedirectResponse {
        $action->handle($user, $podcast);

        return back();
    }
}
```

**Routes:**

```php
Route::get('/users/{user}/subscriptions', [UserPodcastSubscriptionController::class, 'index']);
Route::post('/users/{user}/podcasts/{podcast}/subscription', [UserPodcastSubscriptionController::class, 'store']);
Route::delete('/users/{user}/podcasts/{podcast}/subscription', [UserPodcastSubscriptionController::class, 'destroy']);
```

**Key Points:**

- Treats `user_podcast` pivot as its own resource: "subscription"
- All route parameters are type-hinted and auto-resolved
- Each method follows RESTful conventions
- Business logic delegated to Actions

### Example 5: Invokable Controller

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Report\GenerateReportAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\GenerateReportRequest;
use Illuminate\Http\RedirectResponse;

final class GenerateReportController extends Controller
{
    public function __invoke(
        GenerateReportRequest $request,
        GenerateReportAction $action
    ): RedirectResponse {
        $report = $action->handle($request->toDTO());

        return redirect()->route('reports.show', $report);
    }
}
```

**Route:**

```php
Route::post('/reports/generate', GenerateReportController::class);
```

**When to use:** Single-purpose operations that don't fit standard CRUD pattern.

### Example 6: API Controller

```php
<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Actions\User\CreateUserAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreUserRequest;
use App\Http\Resources\V1\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

final class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::paginate(15);

        return UserResource::collection($users)->response();
    }

    public function store(
        StoreUserRequest $request,
        CreateUserAction $action
    ): JsonResponse {
        $user = $action->handle($request->toDTO());

        return UserResource::make($user)
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(User $user): UserResource
    {
        return UserResource::make($user);
    }

    public function update(
        User $user,
        UpdateUserRequest $request,
        UpdateUserAction $action
    ): UserResource {
        $user = $action->handle($user, $request->toDTO());

        return UserResource::make($user);
    }

    public function destroy(User $user): JsonResponse
    {
        $user->delete();

        return response()->noContent();
    }
}
```

**Note:** This is a versioned API controller under `Api/V1/` namespace.

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
    return redirect()->back();  // or back()
    return redirect('dashboard');
}
```

### JSON Responses (API Controllers)

```php
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

// Success with resource (200 OK)
return UserResource::make($user);

// Created (201)
return UserResource::make($user)
    ->response()
    ->setStatusCode(Response::HTTP_CREATED);

// No content (204) - for deletes
return response()->noContent();

// Collection
return UserResource::collection($users)->response();

// Custom JSON
return response()->json([
    'success' => true,
    'data' => $data,
], Response::HTTP_OK);

// Validation error (422)
return response()->json([
    'message' => 'Validation failed',
    'errors' => $errors,
], Response::HTTP_UNPROCESSABLE_ENTITY);
```

**Common Status Codes:**

- `200 OK` - Successful GET, PUT, PATCH
- `201 CREATED` - Successful POST creating a resource
- `204 NO CONTENT` - Successful DELETE
- `401 UNAUTHORIZED` - Not authenticated
- `403 FORBIDDEN` - Authenticated but not authorized
- `404 NOT FOUND` - Resource not found
- `422 UNPROCESSABLE ENTITY` - Validation failed
- `500 INTERNAL SERVER ERROR` - Server error

### Exception Handling

```php
use Illuminate\Validation\ValidationException;

public function store(
    StoreRequest $request,
    CreateAction $action
): RedirectResponse {
    try {
        $result = $action->handle($request->toDTO());
    } catch (SpecificException $e) {
        report($e);  // Log for debugging

        throw ValidationException::withMessages([
            'field' => __('validation.custom_message'),
        ]);
    }

    return redirect()->route('resource.show', $result);
}
```

**Best Practices:**

- Catch specific exceptions, not generic `Exception`
- Always `report()` exceptions for debugging
- Transform technical exceptions to user-friendly messages
- Re-throw as `ValidationException` for form errors

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

// Don't add custom actions (Cruddy by Design)
final class PodcastsController extends Controller
{
    public function update($id) { }
    public function updateCoverImage($id) { }   // ❌ Custom action
    public function listEpisodes($id) { }       // ❌ Custom action
    public function approve($id) { }            // ❌ Custom action
}

// Don't reuse one action for multiple intents
public function index($id = null)  // ❌ Optional parameter
{
    if ($id === null) {
        // List all episodes
    } else {
        // List specific podcast's episodes
    }
}

// Don't make $id mean different things in different methods
final class EpisodesController extends Controller
{
    public function show($id) {
        $episode = Episode::find($id);  // $id is Episode ID
    }

    public function create($id) {
        $podcast = Podcast::find($id);  // ❌ $id is Podcast ID - Confusing!
    }
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

// Create new controllers with standard actions (Cruddy by Design)
final class PodcastCoverImageController extends Controller
{
    public function update($id) { }  // ✅ Standard RESTful action
}

final class PodcastEpisodesController extends Controller
{
    public function index($id) { }   // ✅ $id always means Podcast ID
    public function create($id) { }  // ✅ $id always means Podcast ID
}

final class PublishedPostsController extends Controller
{
    public function index() { }      // ✅ Separate resource for published posts
}

// Each controller concerned with one type of resource ID
final class PodcastEpisodesController extends Controller
{
    public function index($podcastId) { }   // ✅ Clear naming
    public function create($podcastId) { }  // ✅ Consistent parameter
}
```

**Key Principles:**

- **One action per user intent** - Don't reuse methods for different purposes
- **Consistent parameter meaning** - `$id` should mean the same thing across all methods
- **No custom actions** - Create new controllers instead
- **Thin controllers** - All business logic in Actions
- **Type safety** - FormRequests for validation, typed returns

## Quality Standards

- All controllers must pass PHPStan level 8
- 100% type coverage required
- Code formatted with Pint
- Refactored with Rector
- Covered by feature tests (see `writing-feature-tests` skill)
- Follow Cruddy by Design: only 7 standard RESTful actions
- Delegate all business logic to Actions
- Use Form Requests with `toDTO()` for validation
