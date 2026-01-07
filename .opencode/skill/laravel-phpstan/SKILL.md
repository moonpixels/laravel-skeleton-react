---
name: laravel-phpstan
description: Static analysis with PHPStan/Larastan for type safety
compatibility: opencode
metadata:
  category: quality
  domain: backend
---

## What PHPStan Is

PHPStan performs static analysis to find type errors and bugs before runtime.

## Running PHPStan

**Command:**

```bash
composer run stan
# or directly
./vendor/bin/phpstan analyse --memory-limit=3G
```

## What PHPStan Checks

- Type mismatches
- Undefined methods/properties
- Missing return types
- Incorrect parameter types
- Nullable type issues
- Dead code
- Unreachable code

## Configuration

- **Level**: Maximum (strictest)
- **Memory**: 3GB limit
- **Type Coverage**: 100% required

## Common Errors

**Missing return type:**

```php
// ❌ Error
public function handle($data)

// ✅ Fixed
public function handle(RegisterData $data): User
```

**Nullable types:**

```php
// ❌ Error
public function getAvatar(): string
{
    return $this->avatar_path; // might be null
}

// ✅ Fixed
public function getAvatar(): ?string
{
    return $this->avatar_path;
}
```

**Array shapes:**

```php
// ❌ Error - unclear array structure
public function toArray(): array

// ✅ Fixed - explicit structure
/**
 * @return array<string, mixed>
 */
public function toArray(): array
```

## PHPDoc Annotations

Use PHPDoc for complex types:

```php
/**
 * @property-read int $id
 * @property string $name
 */

/**
 * @return array<string, mixed>
 */

/**
 * @param list<string> $items
 */

/**
 * @return HasMany<Post>
 */
```

## Integration

Runs as part of:

- `composer run checks`
- Pre-commit hooks (if configured)
- CI/CD pipeline

## When to Run PHPStan

- After adding new methods
- When changing signatures
- Before committing
- When type errors occur
- After refactoring

## Type Coverage

Project requires 100% type coverage:

```bash
composer run type-coverage
```

Ensures all methods have explicit return types and parameters.
