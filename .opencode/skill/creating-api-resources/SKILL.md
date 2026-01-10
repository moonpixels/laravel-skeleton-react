---
name: creating-api-resources
description: Create Laravel JSON API Resource classes for formatting HTTP responses with type safety. Use when creating API resources, formatting JSON responses, transforming models to JSON, or when user mentions API resources, JSON responses, resource transformers, or response formatting.
---

# Creating Laravel API Resources

## Quick Reference

**Create a resource:**

- Single model: `UserResource::make($user)`
- Collection: `UserResource::collection($users)`
- Paginated: `UserResource::collection($users->paginate())`

**Inertia usage:**

```php
Inertia::render('page', [
    'user' => UserResource::make($user),
    'users' => UserResource::collection($users),
]);
```

**Common methods:**

- `when($condition, $value)` - Conditional attributes
- `whenLoaded('relation')` - Conditional relationships (N+1 prevention)
- `whenCounted('relation')` - Relationship counts
- `mergeWhen($condition, [...])` - Multiple conditional attributes
- `whenNotNull($value)` - Null-safe conditionals

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
- Format dates with `toAtomString()` consistently

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

Always use `toAtomString()` for consistent ISO 8601 formatting with timezone:

```php
'created_at' => $this->created_at?->toAtomString(),
'updated_at' => $this->updated_at?->toAtomString(),
'deleted_at' => $this->deleted_at?->toAtomString(),
```

### 4. Resource Attribute Organization

Organize resource attributes with core model properties first, followed by relationships. Each relationship group (collection + count) should be separated by a blank line:

```php
public function toArray(Request $request): array
{
    return [
        // Core attributes
        'id' => $this->id,
        'name' => $this->name,
        'email' => $this->email,
        'status' => $this->status->value,
        'created_at' => $this->created_at?->toAtomString(),

        // Relationships (each group separated by blank line)
        'posts' => PostResource::collection($this->whenLoaded('posts')),
        'posts_count' => $this->whenCounted('posts'),

        'comments' => CommentResource::collection($this->whenLoaded('comments')),
        'comments_count' => $this->whenCounted('comments'),

        'team' => TeamResource::make($this->whenLoaded('team')),
    ];
}
```

**Key principles:**

- Core model attributes always come first
- Blank line separates core attributes from relationships
- Include both collection and count for many relationships (hasMany, belongsToMany)
- Each relationship group separated by blank line for readability
- Singular relationships (belongsTo, hasOne) don't need counts

## Data Wrapping Behavior

This project has `JsonResource::withoutWrapping()` enabled in `AppServiceProvider`.

**Single resources** return unwrapped:

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Paginated responses** still wrap automatically:

```json
{
  "data": [
    { "id": 1, "name": "John Doe" },
    { "id": 2, "name": "Jane Smith" }
  ],
  "links": {
    "first": "http://example.com/users?page=1",
    "last": "http://example.com/users?page=1",
    "prev": null,
    "next": null
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 1,
    "per_page": 15,
    "to": 10,
    "total": 10
  }
}
```

**Nested resources** are never double-wrapped by Laravel automatically.

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
            // Core attributes
            'id' => $this->id,
            'order_number' => $this->order_number,
            'total' => $this->total,
            'status' => $this->status->value,
            'created_at' => $this->created_at?->toAtomString(),
            'updated_at' => $this->updated_at?->toAtomString(),

            // Relationships
            'user' => UserResource::make($this->whenLoaded('user')),

            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'items_count' => $this->whenCounted('items'),
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
            // Core attributes
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'middle_name' => $this->whenNotNull($this->middle_name),
            'is_admin' => $this->when($request->user()?->isAdmin(), true),

            // Admin-only attributes
            $this->mergeWhen($request->user()?->isAdmin(), [
                'internal_notes' => $this->internal_notes,
                'last_login_ip' => $this->last_login_ip,
                'created_by_user_id' => $this->created_by_user_id,
            ]),

            'secret_data' => $this->whenHas('secret_data'),
            'created_at' => $this->created_at?->toAtomString(),
            'updated_at' => $this->updated_at?->toAtomString(),

            // Relationships
            'posts' => PostResource::collection($this->whenLoaded('posts')),
            'posts_count' => $this->whenCounted('posts'),

            'comments' => CommentResource::collection($this->whenLoaded('comments')),
            'comments_count' => $this->whenCounted('comments'),
        ];
    }
}
```

## Resource Collections

### When to Use Which Approach

**Use `UserResource::collection()` when:**

- Simple list transformation
- Standard pagination (no custom meta)
- Default response structure is sufficient

**Example:**

```php
public function index(): Response
{
    return Inertia::render('users/index', [
        'users' => UserResource::collection(User::paginate()),
    ]);
}
```

**Create custom `UserCollection extends ResourceCollection` when:**

- Need custom meta data (links, timestamps, etc.)
- Custom top-level response structure required
- Custom pagination information formatting

**Example:**

```php
<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Override;

final class UserCollection extends ResourceCollection
{
    /**
     * @return array<string, mixed>
     */
    #[Override]
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection,
            'meta' => [
                'total_active' => User::where('active', true)->count(),
                'generated_at' => now()->toAtomString(),
            ],
        ];
    }
}
```

Usage:

```php
return new UserCollection(User::paginate());
```

## Using Resources

### In Inertia.js Controllers

**Single resource:**

```php
use App\Http\Resources\UserResource;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

public function show(User $user): Response
{
    return Inertia::render('users/show', [
        'user' => UserResource::make($user),
    ]);
}
```

**Collection:**

```php
public function index(): Response
{
    return Inertia::render('users/index', [
        'users' => UserResource::collection(User::all()),
    ]);
}
```

**Paginated:**

```php
public function index(): Response
{
    $users = User::query()->paginate(15);

    return Inertia::render('users/index', [
        'users' => UserResource::collection($users),
    ]);
}
```

### In API Controllers

**Single resource:**

```php
use App\Http\Resources\UserResource;
use App\Models\User;

public function show(User $user): UserResource
{
    return UserResource::make($user);
}
```

**Collection:**

```php
use Illuminate\Http\Resources\Json\ResourceCollection;

public function index(): ResourceCollection
{
    return UserResource::collection(User::all());
}
```

**Paginated:**

```php
public function index(): ResourceCollection
{
    return UserResource::collection(User::paginate(15));
}
```

## Resource Organization

### Attribute Ordering

Always organize resource attributes in this specific order:

1. **Core attributes** - Model properties (id, name, email, status, timestamps)
2. **Blank line separator**
3. **Relationships** - Related resources with their counts, each group separated by blank line

### Relationship Count Pattern

For many relationships (hasMany, belongsToMany), always include both the collection and count:

```php
// In controller - load both relationship and count
$user = User::with('posts')->withCount('posts')->find($id);

// In resource - return both collection and count (separated by blank line from next relationship)
return [
    // ... core attributes ...

    'posts' => PostResource::collection($this->whenLoaded('posts')),
    'posts_count' => $this->whenCounted('posts'),

    'comments' => CommentResource::collection($this->whenLoaded('comments')),
    'comments_count' => $this->whenCounted('comments'),
];
```

**Benefits:**

- Frontend can display counts without loading full collections (e.g., "5 comments")
- Better performance - counts are cheaper than loading full relationships
- Consistent structure across all resources
- Clear visual separation between relationship groups

### Complete Example

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
            // Core model attributes
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'status' => $this->status->value,
            'is_verified' => $this->email_verified_at !== null,
            'created_at' => $this->created_at?->toAtomString(),
            'updated_at' => $this->updated_at?->toAtomString(),

            // Many relationship with count
            'posts' => PostResource::collection($this->whenLoaded('posts')),
            'posts_count' => $this->whenCounted('posts'),

            // Another many relationship with count
            'comments' => CommentResource::collection($this->whenLoaded('comments')),
            'comments_count' => $this->whenCounted('comments'),

            // Singular relationship (no count needed)
            'team' => TeamResource::make($this->whenLoaded('team')),
        ];
    }
}
```

### Controller Integration

```php
use App\Http\Resources\UserResource;
use App\Models\User;
use Inertia\Response;

public function index(): Response
{
    // Load counts for index page (show "5 posts" without loading all posts)
    $users = User::query()
        ->withCount(['posts', 'comments'])
        ->paginate(15);

    return Inertia::render('users/index', [
        'users' => UserResource::collection($users),
    ]);
}

public function show(User $user): Response
{
    // Load full relationships for detail page
    $user->load(['posts', 'comments', 'team'])
         ->loadCount(['posts', 'comments']);

    return Inertia::render('users/show', [
        'user' => UserResource::make($user),
    ]);
}
```

## Common Patterns

### Pattern 1: Resource with Optional Relationships

Use `whenLoaded()` to prevent N+1 queries by only including relationships that were explicitly eager loaded.

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
            // Core attributes
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'created_at' => $this->created_at?->toAtomString(),
            'updated_at' => $this->updated_at?->toAtomString(),

            // Relationships (only included if eager loaded - prevents N+1)
            'posts' => PostResource::collection($this->whenLoaded('posts')),
            'posts_count' => $this->whenCounted('posts'),

            'comments' => CommentResource::collection($this->whenLoaded('comments')),
            'comments_count' => $this->whenCounted('comments'),
        ];
    }
}
```

**Controller usage:**

```php
// Without relationships - posts/comments not included
public function index(): Response
{
    $users = User::query()->paginate();

    return Inertia::render('users/index', [
        'users' => UserResource::collection($users),
    ]);
}

// With relationships - posts/comments included
public function show(User $user): Response
{
    $user->load(['posts', 'comments']);

    return Inertia::render('users/show', [
        'user' => UserResource::make($user),
    ]);
}

// With counts only
public function index(): Response
{
    $users = User::query()->withCount('posts')->paginate();

    return Inertia::render('users/index', [
        'users' => UserResource::collection($users), // includes posts_count
    ]);
}
```

### Pattern 2: Paginated List with Filters in Inertia

```php
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

public function index(Request $request): Response
{
    $users = User::query()
        ->when(
            $request->search,
            fn ($query) => $query->where('name', 'like', "%{$request->search}%")
        )
        ->when(
            $request->status,
            fn ($query) => $query->where('status', $request->status)
        )
        ->when(
            $request->role,
            fn ($query) => $query->whereHas('roles', fn ($q) => $q->where('name', $request->role))
        )
        ->paginate(15)
        ->withQueryString(); // Preserve query params in pagination links

    return Inertia::render('users/index', [
        'users' => UserResource::collection($users),
        'filters' => $request->only(['search', 'status', 'role']),
    ]);
}
```

## Testing Resources

### Feature Test Examples

```php
use App\Http\Resources\UserResource;
use App\Models\Post;
use App\Models\User;

it('transforms user resource correctly', function () {
    $user = User::factory()->create([
        'name' => 'John Doe',
        'email' => 'john@example.com',
    ]);

    $resource = UserResource::make($user);
    $array = $resource->toArray(request());

    expect($array)
        ->toHaveKey('id', $user->id)
        ->toHaveKey('name', 'John Doe')
        ->toHaveKey('email', 'john@example.com')
        ->toHaveKey('created_at')
        ->and($array['created_at'])->toContain('T'); // ISO 8601 format
});

it('includes relationships when loaded', function () {
    $user = User::factory()
        ->has(Post::factory()->count(3))
        ->create();

    $user->load('posts');

    $resource = UserResource::make($user);
    $array = $resource->toArray(request());

    expect($array)
        ->toHaveKey('posts')
        ->and($array['posts'])->toHaveCount(3);
});

it('excludes relationships when not loaded', function () {
    $user = User::factory()->create();

    $resource = UserResource::make($user);
    $array = $resource->toArray(request());

    expect($array)->not->toHaveKey('posts');
});

it('includes counts when loaded', function () {
    $user = User::factory()
        ->has(Post::factory()->count(5))
        ->create();

    $user->loadCount('posts');

    $resource = UserResource::make($user);
    $array = $resource->toArray(request());

    expect($array)
        ->toHaveKey('posts_count', 5)
        ->not->toHaveKey('posts'); // Count loaded, but not full relationship
});

it('transforms collections correctly', function () {
    $users = User::factory()->count(3)->create();

    $collection = UserResource::collection($users);
    $array = $collection->toArray(request());

    expect($array)->toHaveCount(3);
});

it('includes conditional attributes based on permissions', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create(['internal_notes' => 'Secret note']);

    // As admin - should see internal notes
    actingAs($admin);
    $resource = UserResource::make($user);
    $array = $resource->toArray(request());

    expect($array)->toHaveKey('internal_notes', 'Secret note');

    // As regular user - should not see internal notes
    actingAs($user);
    $resource = UserResource::make($user);
    $array = $resource->toArray(request());

    expect($array)->not->toHaveKey('internal_notes');
});
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
    'updated_at' => $this->updated_at->format('Y-m-d'), // ❌ Use toAtomString()
];

// Don't use new for resources (inconsistent)
return [
    'user' => new UserResource($this->user), // ❌ Use ::make()
];

// Don't eager load inside resources (causes N+1)
public function toArray(Request $request): array
{
    return [
        'id' => $this->id,
        'posts' => PostResource::collection($this->posts), // ❌ Should use whenLoaded()
    ];
}

// Don't mix attributes and relationships
return [
    'id' => $this->id,
    'posts' => PostResource::collection($this->whenLoaded('posts')), // ❌ Mixed in with attributes
    'name' => $this->name,
    'created_at' => $this->created_at?->toAtomString(),
];

// Don't forget relationship counts
return [
    'id' => $this->id,
    'name' => $this->name,

    'posts' => PostResource::collection($this->whenLoaded('posts')), // ❌ Missing posts_count
];

// Don't group relationship and count together without blank line separator
return [
    'id' => $this->id,

    'posts' => PostResource::collection($this->whenLoaded('posts')),
    'posts_count' => $this->whenCounted('posts'),
    'comments' => CommentResource::collection($this->whenLoaded('comments')), // ❌ No blank line
    'comments_count' => $this->whenCounted('comments'),
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

// Format dates consistently with toAtomString()
return [
    'created_at' => $this->created_at?->toAtomString(),
    'updated_at' => $this->updated_at?->toAtomString(),
];

// Use ::make() for consistency
return [
    'user' => UserResource::make($this->whenLoaded('user')),
];

// Use whenLoaded() to prevent N+1 and proper organization
public function toArray(Request $request): array
{
    return [
        // Core attributes
        'id' => $this->id,
        'name' => $this->name,
        'created_at' => $this->created_at?->toAtomString(),

        // Relationships (each group separated by blank line)
        'posts' => PostResource::collection($this->whenLoaded('posts')),
        'posts_count' => $this->whenCounted('posts'),

        'comments' => CommentResource::collection($this->whenLoaded('comments')),
        'comments_count' => $this->whenCounted('comments'),
    ];
}
```

## Quality Standards

- All Resources must pass PHPStan level 8
- 100% type coverage required
- Code formatted with Pint
- Refactored with Rector
- Consistent date formatting with `toAtomString()` across all resources
- Consistent resource instantiation with `::make()` and `::collection()`
- Feature tests for all resources covering transformations and conditional logic
