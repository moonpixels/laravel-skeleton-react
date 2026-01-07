---
name: laravel-middleware
description: Create middleware for request filtering and modification
compatibility: opencode
metadata:
  category: architecture
  domain: backend
---

## What Middleware Is

Middleware filters HTTP requests entering your application.

## Location

- **Location**: `app/Http/Middleware/`

## Structure Pattern

```php
<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final readonly class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()?->isAdmin()) {
            abort(403);
        }

        return $next($request);
    }
}
```

## Key Patterns

- Use `final readonly class`
- `handle()` method signature: `(Request $request, Closure $next): Response`
- Call `$next($request)` to pass request to next middleware
- Return response from `$next($request)`
- Modify request before calling `$next()`
- Modify response after calling `$next()`

## Terminating Middleware

For cleanup after response sent:

```php
public function handle(Request $request, Closure $next): Response
{
    return $next($request);
}

public function terminate(Request $request, Response $response): void
{
    // Cleanup code here
}
```

## Middleware with Parameters

```php
public function handle(Request $request, Closure $next, string $role): Response
{
    if (! $request->user()?->hasRole($role)) {
        abort(403);
    }

    return $next($request);
}
```

Usage in routes:

```php
Route::get('/admin', AdminController::class)
    ->middleware('role:admin');
```

## Registration in bootstrap/app.php

**Global middleware:**

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->append(EnsureUserIsAdmin::class);
})
```

**Route-specific middleware:**

```php
Route::middleware([EnsureUserIsAdmin::class])->group(function () {
    Route::get('/admin', AdminController::class);
});
```

**Middleware alias:**

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'admin' => EnsureUserIsAdmin::class,
    ]);
})
```

## Before vs After Middleware

**Before (modify request):**

```php
public function handle(Request $request, Closure $next): Response
{
    // Before logic
    $request->merge(['processed' => true]);

    return $next($request);
}
```

**After (modify response):**

```php
public function handle(Request $request, Closure $next): Response
{
    $response = $next($request);

    // After logic
    $response->header('X-Custom-Header', 'value');

    return $response;
}
```

## When to Use Middleware

- Authentication/authorization checks
- Request logging
- CORS handling
- Request/response transformation
- Rate limiting

## Anti-Patterns

❌ Business logic in middleware (use Actions)
❌ Not calling `$next($request)`
❌ Forgetting to return response
❌ Heavy processing (use queued jobs)
