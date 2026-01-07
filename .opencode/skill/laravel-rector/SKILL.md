---
name: laravel-rector
description: Automated refactoring with Rector for code modernization
compatibility: opencode
metadata:
  category: quality
  domain: backend
---

## What Rector Is

Rector automatically refactors code to modern PHP and Laravel patterns.

## Running Rector

**Command:**

```bash
composer run rector
# or directly
./vendor/bin/rector process --ansi
```

## What Rector Does

- Upgrades to newer PHP syntax
- Applies Laravel best practices
- Modernizes deprecated code
- Converts to constructor promotion
- Adds strict types declarations
- Removes dead code

## Laravel-Specific Rules

Project uses `driftingly/rector-laravel`:

- Convert to new Laravel syntax
- Update deprecated methods
- Modern Eloquent patterns
- Updated validation rules
- Route syntax modernization

## Example Transformations

**Constructor Promotion:**

```php
// Before
public function __construct(Service $service)
{
    $this->service = $service;
}

// After
public function __construct(
    private Service $service
) {}
```

**Strict Types:**

```php
// Adds to all PHP files
declare(strict_types=1);
```

**Readonly Classes:**

```php
// Suggests readonly for immutable classes
final readonly class RegisterData
```

## Integration

Runs as part of:

- `composer run checks` (first step)
- Pre-commit hooks (if configured)

## Safe Refactoring

Rector only applies safe transformations.Always run tests after Rector:

```bash
composer run rector
composer run test
```

## When to Run Rector

- Before starting new features
- After updating PHP/Laravel version
- Periodically for code modernization
- As part of checks before commit

## Configuration

Configured in `rector.php` in project root.
