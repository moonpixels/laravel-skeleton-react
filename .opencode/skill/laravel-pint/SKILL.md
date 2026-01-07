---
name: laravel-pint
description: Auto-format PHP code with Laravel Pint following project standards
compatibility: opencode
metadata:
  category: quality
  domain: backend
---

## What Pint Is

Laravel Pint automatically formats PHP code to follow project coding standards.

## Running Pint

**Command:**

```bash
composer run pint
# or directly
./vendor/bin/pint
```

## What Pint Fixes

- Code formatting (indentation, spacing)
- Import organization
- Enforces `final` classes
- Removes trailing whitespace
- Consistent bracket placement
- PSR-12 compliance

## Key Rules Enforced

- `declare(strict_types=1);` at top of files
- `final` classes by default
- Import all classes at top
- No unused imports
- Consistent array syntax
- Method visibility declarations

## Integration

Pint runs automatically:

- As part of `composer run checks`
- On file save (if configured in editor)
- Via Prettier formatter in opencode.json

## When to Run Pint

- Before committing code
- After generating code/files
- When tests fail due to style issues
- After refactoring

## Common Issues Fixed

- ✅ Fixes indentation automatically
- ✅ Removes unused imports
- ✅ Adds missing `final` keywords
- ✅ Organizes imports alphabetically
- ✅ Fixes array syntax
- ✅ Removes trailing commas where needed

## Usage in Commands

```bash
# Fix all files
composer run pint

# Fix specific file
./vendor/bin/pint app/Actions/RegisterUserAction.php

# Dry run (show what would be fixed)
./vendor/bin/pint --test
```
