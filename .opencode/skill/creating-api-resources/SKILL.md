---
name: creating-api-resources
description: Create Laravel JSON API Resource classes for formatting HTTP responses with type safety. Use when creating API resources, formatting JSON responses, transforming models to JSON, or when user mentions API resources, JSON responses, resource transformers, or response formatting.
---

# Creating Laravel API Resources

## When to Use This Skill

Use this skill when:

- User requests "create a [Name]Resource" or "create an API Resource"
- Formatting model data for JSON responses
- Transforming data for Inertia.js pages
- User mentions API resources, JSON responses, or resource transformers
- Need consistent response formatting

## File Structure

API Resources are organized by model:

```
app/Http/Resources/{Model}Resource.php
```

**Examples:**

- `app/Http/Resources/UserResource.php`
- `app/Http/Resources/OrderResource.php`
- `app/Http/Resources/ProductResource.php`

## Core Conventions

### 1. Resource Structure

```php
<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\{Model};
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Override;

/**
 * @mixin {Model}
 */
final class {Model}Resource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    #[Override]
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'created_at' => $this->created_at?->toAtomString(),
        ];
    }
}
```

**Key Requirements:**

- Always include `declare(strict_types=1);`
- Use `final class` modifier
- Extend `JsonResource` base class
- Add `@mixin` PHPDoc for IDE support
- Use `#[Override]` attribute on `toArray()`
- Type hint `toArray()` return as `array<string, mixed>`
- Format dates with `toAtomString()` or similar

### 2. @mixin PHPDoc

The `@mixin` annotation enables IDE autocomplete:

```php
/**
 * @mixin User
 */
final class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id, // IDE knows $this->id exists
            'name' => $this->name, // IDE knows $this->name exists
        ];
    }
}
```

### 3. Date Formatting

```php
'created_at' => $this->created_at?->toAtomString(),
'updated_at' => $this->updated_at?->toIso8601String(),
'deleted_at' => $this->deleted_at?->format('Y-m-d H:i:s'),
```

## Examples

### Example 1: Simple Resource

```php
<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\User;
use App\Support\Localisation\Facades\Localisation;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Override;

/**
 * @mixin User
 */
final class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    #[Override]
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'first_name' => $this->firstName,
            'email' => $this->email,
            'email_verified_at' => $this->email_verified_at?->toAtomString(),
            'two_factor_confirmed_at' => $this->two_factor_confirmed_at?->toAtomString(),
            'language' => Localisation::getIso639Locale($this->language),
            'avatar_url' => $this->avatarUrl,
        ];
    }
}
```

### Example 2: Resource with Relationships

```php
<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Override;

/**
 * @mixin Order
 */
final class OrderResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    #[Override]
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'total' => $this->total,
            'status' => $this->status->value,
            'user' => UserResource::make($this->user),
            'items' => OrderItemResource::collection($this->items),
            'created_at' => $this->created_at?->toAtomString(),
        ];
    }
}
```

### Example 3: Conditional Attributes

```php
<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Override;

/**
 * @mixin User
 */
final class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    #[Override]
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'is_admin' => $this->when($request->user()?->isAdmin(), true),
            'secret_data' => $this->whenHas('secret_data'),
            'posts' => PostResource::collection($this->whenLoaded('posts')),
        ];
    }
}
```

## Using Resources

### In Controllers

```php
public function index(): Response
{
    $users = User::query()->paginate(10);

    return Inertia::render('users/index', [
        'users' => UserResource::collection($users),
    ]);
}

public function show(User $user): Response
{
    return Inertia::render('users/show', [
        'user' => UserResource::make($user),
    ]);
}
```

### In API Controllers

```php
public function index(): JsonResponse
{
    $users = User::query()->paginate(10);

    return UserResource::collection($users)
        ->response()
        ->setStatusCode(200);
}
```

## Anti-Patterns

### ❌ Don't Do This

```php
// Don't omit @mixin
final class UserResource extends JsonResource // ❌ Missing @mixin

// Don't skip #[Override] attribute
public function toArray(Request $request): array // ❌ Missing #[Override]

// Don't omit type hints
public function toArray($request) // ❌ Type hint required
{
    return ['id' => $this->id];
}

// Don't return all model attributes
public function toArray(Request $request): array
{
    return $this->resource->toArray(); // ❌ Explicit fields only
}

// Don't format dates inconsistently
return [
    'created_at' => $this->created_at, // ❌ Format dates
];
```

### ✅ Do This Instead

```php
// Include @mixin
/**
 * @mixin User
 */
final class UserResource extends JsonResource

// Use #[Override] attribute
#[Override]
public function toArray(Request $request): array

// Type hint parameters and return
public function toArray(Request $request): array

// Explicitly define fields
return [
    'id' => $this->id,
    'name' => $this->name,
];

// Format dates consistently
return [
    'created_at' => $this->created_at?->toAtomString(),
];
```

## Quality Standards

- All Resources must pass PHPStan level 9
- 100% type coverage required
- Code formatted with Pint
- Refactored with Rector
- Consistent date formatting across all resources
