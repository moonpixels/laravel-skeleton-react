---
name: laravel-resources
description: Create API Resource classes for consistent response formatting
compatibility: opencode
metadata:
  category: architecture
  domain: backend
---

## What API Resources Are

API Resources transform Eloquent models into consistent JSON responses for APIs and Inertia.

## Naming & Location

- **Naming**: Model name + `Resource` (e.g., `UserResource`, `PostResource`, `TodoResource`)
- **Location**: `app/Http/Resources/`

## Structure Pattern

```php
<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read User $resource
 */
final class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'name' => $this->resource->name,
            'email' => $this->resource->email,
            'avatar_url' => $this->resource->avatarUrl,
            'created_at' => $this->resource->created_at,
        ];
    }
}
```

## Key Patterns

- Use `final class` for Resources
- Add `@property-read` PHPDoc for IDE support
- Use `$this->resource` to access the model (not `$this`)
- Return array with explicit keys
- Include relationships conditionally with `whenLoaded()`
- Format dates/times consistently
- Hide sensitive data (passwords, tokens)

## Conditional Relationships

```php
public function toArray(Request $request): array
{
    return [
        'id' => $this->resource->id,
        'name' => $this->resource->name,
        'posts' => PostResource::collection($this->whenLoaded('posts')),
        'meta' => $this->when($this->resource->isAdmin(), [
            'role' => 'admin',
        ]),
    ];
}
```

## Usage in Controllers

```php
public function show(User $user): JsonResponse
{
    return response()->json(
        new UserResource($user)
    );
}

public function index(): JsonResponse
{
    $users = User::query()->paginate();

    return UserResource::collection($users)->response();
}
```

## Usage in Inertia

```php
public function show(User $user): Response
{
    return inertia('Users/Show', [
        'user' => new UserResource($user),
    ]);
}
```

## When to Use Resources

- API responses
- Inertia page props
- Consistent data formatting across application
- Hiding/transforming model attributes
- Including/excluding relationships

## Anti-Patterns

❌ Returning raw models in API responses
❌ Inconsistent response formats
❌ Including sensitive data (passwords, secrets)
❌ Business logic in Resources (use Actions)
