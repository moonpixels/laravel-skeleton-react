---
name: laravel-enums
description: Create and use PHP enums for type-safe value sets
compatibility: opencode
metadata:
  category: architecture
  domain: backend
---

## What Enums Are

Enums provide type-safe sets of predefined values.

## Naming & Location

- **Location**: `app/Enums/{Domain}/`
- **Naming**: Singular noun (e.g., `StatusEnum`, `RoleEnum`, `PriorityEnum`)

## Structure Pattern

```php
<?php

declare(strict_types=1);

namespace App\Enums;

enum StatusEnum: string
{
    case Active = 'active';
    case Inactive = 'inactive';
    case Pending = 'pending';

    public function label(): string
    {
        return match ($this) {
            self::Active => 'Active',
            self::Inactive => 'Inactive',
            self::Pending => 'Pending',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Active => 'green',
            self::Inactive => 'red',
            self::Pending => 'yellow',
        };
    }
}
```

## Key Patterns

- Use backed enums with string values for database storage
- Case names in PascalCase, values in lowercase
- Add helper methods for labels, colors, descriptions
- Use `match` expressions for case-specific logic
- Add `from()` and `tryFrom()` for safe instantiation

## Usage in Models

```php
final class User extends Model
{
    protected function casts(): array
    {
        return [
            'status' => StatusEnum::class,
        ];
    }
}
```

## Usage in Code

```php
$user->status = StatusEnum::Active;

if ($user->status === StatusEnum::Pending) {
    // Handle pending status
}

$label = $user->status->label(); // 'Active'
$color = $user->status->color(); // 'green'
```

## Static Helper Methods

```php
public static function active(): array
{
    return [self::Active, self::Pending];
}

public static function names(): array
{
    return array_column(self::cases(), 'name');
}
```

## When to Use Enums

- Database column with fixed set of values
- Type-safe status/state management
- Dropdown/select options
- Replacing magic strings

## Anti-Patterns

❌ Using strings instead of enums for fixed values
❌ Not backing enums (use `: string` or `: int`)
❌ Missing label/display methods
