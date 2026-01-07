---
name: laravel-models
description: Create and modify Eloquent model classes following project conventions
compatibility: opencode
metadata:
  category: architecture
  domain: backend
---

## What Eloquent Models Are

Models represent database tables and handle data persistence and relationships.

## Structure Pattern

```php
<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property ?CarbonImmutable $created_at
 */
final class User extends Authenticatable
{
    /**
     * @use HasFactory<UserFactory>
     */
    use HasFactory;

    public ?string $avatarUrl {
        get => $this->avatar_path ? Storage::url($this->avatar_path) : null;
    }

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'immutable_datetime',
            'created_at' => 'immutable_datetime',
            'updated_at' => 'immutable_datetime',
        ];
    }

    /**
     * @return HasMany<Post>
     */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }
}
```

## Key Patterns

- Use `final class` for all models
- Add PHPDoc `@property` annotations for all database columns
- Add PHPDoc type hints for trait generics: `@use HasFactory<UserFactory>`
- Use `casts()` method (not `$casts` property)
- Use PHP 8.4 property hooks for computed properties: `public ?string $avatarUrl { get => ... }`
- Explicit return types on all relationships
- Return type generics on relationships: `@return HasMany<Post>`
- Use constructor property promotion for injected dependencies
- Hide sensitive attributes in `$hidden`

## Relationship Patterns

```php
// One to Many
public function posts(): HasMany
{
    return $this->hasMany(Post::class);
}

// Belongs To
public function user(): BelongsTo
{
    return $this->belongsTo(User::class);
}

// Many to Many
public function roles(): BelongsToMany
{
    return $this->belongsToMany(Role::class);
}
```

## Casts

Use the `casts()` method for type casting:

```php
protected function casts(): array
{
    return [
        'email_verified_at' => 'immutable_datetime',
        'is_admin' => 'boolean',
        'settings' => 'array',
        'status' => StatusEnum::class,
    ];
}
```

## Property Hooks (PHP 8.4)

For computed properties:

```php
public string $firstName {
    get => Str::before($this->name, ' ');
}

public ?string $avatarUrl {
    get => $this->avatar_path ? Storage::url($this->avatar_path) : null;
}
```

## When to Modify Models

- Adding new database columns (update `@property` annotations)
- Adding relationships
- Adding computed properties
- Configuring casts
- Hiding sensitive attributes

## Anti-Patterns

❌ Business logic in models (use Actions)
❌ Missing return type hints on relationships
❌ Using `$casts` property instead of `casts()` method
❌ Missing PHPDoc annotations
❌ Mutable properties when not needed
