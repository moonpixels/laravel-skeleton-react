# Laravel React Skeleton - Agentic Coding Skills

This directory contains **33 specialized skills** for Laravel + React + Inertia.js development, following the agentic coding skills guide.

## Overview

Skills are automatically loaded by OpenCode when semantically matched to user requests. Each skill provides:

- Core conventions and patterns
- Real code examples from the codebase
- Anti-patterns to avoid
- Quality standards enforcement

## Skill Categories

### Laravel Backend (18 skills)

**Architecture & Patterns:**

- `creating-actions` - Business logic Action classes
- `creating-dtos` - Data transfer objects
- `creating-enums` - Type-safe enums
- `creating-helpers` - Global utility functions
- `creating-controllers` - Thin HTTP controllers
- `creating-middleware` - Request/response middleware
- `creating-form-requests` - Validation with toDTO()
- `creating-api-resources` - JSON response formatting
- `creating-model-mixins` - Reusable model traits
- `managing-models` - Eloquent models with PHPDoc
- `creating-service-providers` - Service container bindings
- `creating-support-classes` - Custom utilities

**Database & Configuration:**

- `creating-factories` - Model factories with state methods
- `creating-migrations` - Database schema migrations
- `creating-seeders` - Database seeding
- `managing-config-files` - Configuration patterns
- `managing-localisation` - Translation files (PHP arrays)
- `defining-routes` - RESTful route definitions

### React Frontend (9 skills)

- `creating-react-components` - TypeScript components with shadcn/ui
- `creating-contexts` - Context providers for state
- `creating-hooks` - Custom React hooks
- `creating-layouts` - Layout components with Inertia
- `creating-inertia-pages` - Full-page components
- `defining-typescript-types` - Type definitions
- `creating-react-utils` - Utility functions
- `managing-npm-packages` - Frontend dependencies
- `managing-react-localisation` - i18next integration

### Testing (3 skills)

- `writing-feature-tests` - HTTP endpoint tests (Pest v4)
- `writing-unit-tests` - Isolated business logic tests
- `writing-browser-tests` - E2E tests with Playwright

### Quality (2 skills)

- `ensuring-laravel-quality` - Rector, Pint, PHPStan, coverage
- `ensuring-frontend-quality` - ESLint, Prettier, TypeScript

### Meta (1 skill)

- `creating-agentic-skills` - Creating new skills with proper structure and conventions

## Key Conventions

### Laravel Backend

- `declare(strict_types=1);` on all PHP files
- `final readonly` classes for Actions/DTOs
- Full type hints on everything
- PHPStan level 9, 90% code coverage, 100% type coverage
- Domain-organized structure (Auth/, User/, etc.)
- Controllers delegate to Actions
- Form Requests convert to DTOs via `toDTO()`

### React Frontend

- React 19 function components (no `FC` type)
- TypeScript strict mode
- `import type` for type imports
- `PropsWithChildren` pattern
- Inertia.js for pages
- React Hook Form + Zod validation
- i18next for translations
- Tailwind CSS v4 + shadcn/ui

### Testing

- Pest v4 syntax: `test('description', function() {})`
- Helper functions at bottom of files
- AAA pattern (Arrange-Act-Assert)
- Feature tests for HTTP, unit tests for logic
- Browser tests for E2E flows

## Usage

Skills are model-invoked (automatic) based on semantic matching:

```
User: "Create a RegisterUserAction"
→ Loads: creating-actions

User: "Add validation to the login form"
→ Loads: creating-form-requests

User: "Create a UserProfile component"
→ Loads: creating-react-components, defining-typescript-types

User: "Run quality checks"
→ Loads: ensuring-laravel-quality, ensuring-frontend-quality
```

## Skill Structure

Each skill follows this pattern:

```yaml
---
name: creating-actions
description: Create Laravel Action classes... Use when creating Actions, implementing business logic, or when user mentions Action classes...
---
# Creating Laravel Actions

## When to Use This Skill
## File Structure
## Core Conventions
## Examples
## Anti-Patterns
## Quality Standards
```

## Next Steps

The baseline skills are now created (~200 lines each, light depth). To refine:

1. Review each skill one-by-one
2. Add project-specific conventions
3. Expand examples with real use cases
4. Add reference files to `references/` subdirectories if needed
5. Add scripts to `scripts/` subdirectories for deterministic operations

## Notes

- All skills use gerund naming (creating-, managing-, defining-, etc.)
- Descriptions include trigger keywords for semantic matching
- Testing skills emphasize proactive testing ("use when business logic is added")
- Quality skills separate from development skills
- Light baseline for initial setup, refinement to follow
