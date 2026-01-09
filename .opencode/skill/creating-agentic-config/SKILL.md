---
name: creating-agentic-config
description: Create or update AGENTS.md configuration files for AI coding assistants following research-backed best practices. Use when initializing projects, improving agent context, creating AGENTS.md files, or when user mentions project initialization, agent configuration, context files, or /init command.
---

# Creating Agentic Configuration Files

## When to Use This Skill

Use this skill when:

- User runs `/init` command to initialize OpenCode for a project
- User requests "create AGENTS.md" or "improve my AGENTS.md"
- User asks to "set up OpenCode for this project"
- User mentions "agent configuration", "context file", or "project rules"
- Updating or improving existing AGENTS.md files
- Setting up AI coding assistant context for a new project
- User wants better AI understanding of their project

## Critical Research-Backed Principles

### The Core Constraint: Token Budget

**LLMs can reliably follow only ~150-200 instructions, and the system prompt already consumes ~50.**

This means your AGENTS.md has a budget of approximately **60-100 lines maximum** for optimal effectiveness. Beyond this, instruction-following degrades uniformly across ALL instructions, not just the new ones.

### The Golden Rules

1. **Universal Instructions Only**: Include ONLY instructions that apply to EVERY task
2. **Progressive Disclosure**: Reference external docs instead of bloating the file
3. **Actionable Commands**: Exact syntax for build/test/lint commands
4. **Avoid Anti-Patterns**: No style rules (use linters), no code snippets (they go stale), no task-specific instructions

### What Makes Instructions Effective

From 130+ production configuration files, effective instructions are:

- **Universally applicable**: Relevant to every task, not just specific scenarios
- **Specific and actionable**: Not vague (e.g., "Run `npm test -- --coverage`" not "test the code")
- **Positive framing**: "Use Y" rather than "don't use X"

### The WHAT-WHY-HOW Framework

Every effective AGENTS.md follows this structure:

1. **WHAT**: Your stack, versions, key tools
2. **WHY**: Architecture decisions, critical conventions
3. **HOW**: Commands to verify changes work

## AGENTS.md Structure

### Required Sections

Every AGENTS.md should include these sections in order:

```markdown
# Project Name - Brief Description

## Quick Commands (or Quick Facts)

List the most essential commands developers need daily:

- **Build**: Exact command
- **Test**: Exact command with coverage flags
- **Lint**: Exact command
- **Dev**: How to start development environment

## Key Directories

Map the 5-10 most important directories with their PURPOSE:

- `src/components/` - React components (one per file)
- `tests/` - Test files mirror src/ structure

## Architecture Decisions

Document the 3-5 CRITICAL decisions that affect daily work:

- State management approach
- Code organization pattern
- Key conventions that can't be automated

## Before Committing (or Verification Requirements)

Clear checklist of what must pass before committing:

- Run X to verify no type errors
- Hooks handle Y automatically
- Coverage must be ≥ Z%

## For More Context (Progressive Disclosure)

Reference external documentation for details:

- @docs/frontend-patterns.md for component conventions
- @docs/api-design.md for endpoint patterns
```

### Optional Sections (Use Sparingly)

Only include these if universally relevant:

- **MCP Tools**: If project-specific MCP servers are available
- **Custom Commands**: If custom slash commands are defined
- **Specialized Agents**: If custom agents are configured
- **Environment Setup**: If non-standard (e.g., Laravel Herd auto-HTTPS)

## Research Process for Creating AGENTS.md

### Step 1: Analyze Project Structure

**Investigate thoroughly:**

1. **Identify tech stack:**
   - Backend: Check `composer.json`, `package.json`, `requirements.txt`, `go.mod`, etc.
   - Frontend: Check `package.json` for React, Vue, Svelte, etc.
   - Build tools: Vite, Webpack, esbuild, etc.
   - Testing: Jest, Vitest, Pest, Playwright, etc.

2. **Find version information:**
   - Parse package managers for versions
   - Check framework-specific files (e.g., `bootstrap/app.php` for Laravel)
   - Identify language versions from config files

3. **Locate configuration files:**
   - Build: `vite.config.js`, `webpack.config.js`, `tsconfig.json`
   - Test: `vitest.config.js`, `jest.config.js`, `phpunit.xml`, `pest.php`
   - Lint: `.eslintrc`, `pint.json`, `phpstan.neon`, `rector.php`
   - Format: `.prettierrc`, `pint.json`

4. **Map directory structure:**
   - Read top-level directories
   - Identify key source directories
   - Find test directories
   - Locate asset directories

### Step 2: Identify Commands

**Extract from multiple sources:**

1. **Package manager scripts:**
   - `package.json` → `scripts` section
   - `composer.json` → `scripts` section
   - `Makefile` → targets
   - `justfile` → recipes

2. **Common commands to find:**
   - Development server: `npm run dev`, `composer run dev`, `make dev`
   - Build: `npm run build`, `composer run build`
   - Test: `npm test`, `composer test`, `pytest`, `go test`
   - Lint: `npm run lint`, `composer run lint`
   - Format: `npm run format`, `composer run pint`
   - Type check: `npm run type-check`, `composer run stan`
   - Quality: `composer run checks`, `npm run checks`

3. **Look for combined commands:**
   - All-in-one quality checks
   - Pre-commit hooks
   - CI/CD scripts in `.github/workflows/`

### Step 3: Discover Architecture Decisions

**Read project documentation and code:**

1. **Check existing documentation:**
   - README.md
   - CONTRIBUTING.md
   - docs/ directory
   - Architecture Decision Records (ADRs)
   - Inline comments in config files

2. **Infer from code patterns:**
   - State management: Redux, Zustand, Vuex, Context API
   - Data fetching: TanStack Query, SWR, Apollo
   - Routing: React Router, Next.js, Inertia.js
   - API layer: tRPC, REST, GraphQL
   - Code organization: Feature-based, domain-driven, MVC

3. **Identify conventions:**
   - File naming (camelCase, kebab-case, PascalCase)
   - Component patterns (hooks, composition, class components)
   - Import patterns (absolute vs relative, barrel exports)
   - Error handling approaches
   - Testing strategies (unit, integration, e2e)

### Step 4: Find Quality Standards

**Determine verification requirements:**

1. **Coverage thresholds:**
   - Check test config files for coverage thresholds
   - Look for coverage requirements in CI

2. **Type coverage:**
   - TypeScript strict mode settings
   - PHPStan level
   - Type coverage requirements

3. **Linting rules:**
   - ESLint configuration
   - Pint/PHP-CS-Fixer rules
   - Custom rule sets

4. **Pre-commit hooks:**
   - Check `.husky/`, `lefthook.yml`, `.git/hooks/`
   - Identify automated checks

### Step 5: Create Progressive Disclosure Structure

**Organize detailed documentation:**

1. **Identify what should be external:**
   - Detailed API patterns
   - Component style guides
   - Testing strategies
   - Deployment procedures
   - Troubleshooting guides

2. **Create `docs/` or `agent_docs/` directory if needed**

3. **Reference in AGENTS.md:**
   - Use `@path/to/doc.md` syntax
   - Keep references concise
   - Only reference truly useful docs

### Step 6: Draft AGENTS.md

**Writing process:**

1. **Start with the stack summary** (1-2 sentences)
2. **Add Quick Commands** (5-10 most essential)
3. **Map Key Directories** (5-10 most important with PURPOSE)
4. **Document Architecture Decisions** (3-5 critical ones)
5. **List Verification Requirements** (clear checklist)
6. **Add Progressive Disclosure references** (if applicable)
7. **Count lines** - aim for 60-100 lines
8. **Review and ruthlessly cut** anything not universal

### Step 7: Validate and Refine

**Quality checklist:**

1. **Length check**: Is it under 100 lines? If not, move content to external docs
2. **Universal check**: Is every instruction applicable to EVERY task?
3. **Actionable check**: Are commands exact with no ambiguity?
4. **Freshness check**: Will this stay fresh or go stale? (No code snippets!)
5. **Verification check**: Can developers actually follow the "Before Committing" steps?

## Examples for Different Project Types

### Example 1: Laravel + React + Inertia.js (Full-Stack)

This is the optimal structure for Laravel + React + Inertia.js projects:

```markdown
# Project Name - Laravel + React + Inertia.js

Brief one-sentence description of what this application does.

## Quick Commands

- **Dev**: `npm run dev` (Vite HMR - auto-starts in Herd)
- **Build**: `npm run build` (production assets)
- **Test**: `composer test` (Pest with coverage)
- **Quality**: `composer run checks` (Rector, Pint, PHPStan, coverage)
- **Frontend Quality**: `npm run checks` (ESLint, Prettier, TypeScript)
- **Fresh DB**: `php artisan migrate:fresh --seed`

## Tech Stack

- **Backend**: PHP 8.5, Laravel 12, PostgreSQL
- **Frontend**: React 19, TypeScript, Inertia.js, Tailwind CSS v4
- **Testing**: Pest v4 with browser testing (Playwright)
- **Quality**: Rector, Pint, PHPStan/Larastan (level 9)
- **Environment**: Laravel Herd (auto HTTPS, Redis, MinIO)

## Key Directories

- `app/Actions/{Domain}/` - Business logic operations (domain-driven)
- `app/DTOs/{Domain}/` - Data transfer objects for type-safe data passing
- `app/Http/Controllers/` - Thin route handlers (delegate to Actions)
- `app/Http/Requests/` - Form validation with toDTO() methods
- `app/Http/Resources/` - API response formatting
- `app/Models/` - Eloquent models with PHPDoc properties
- `resources/js/components/` - React components (one per file)
- `resources/js/pages/` - Inertia page components
- `resources/js/layouts/` - Layout wrappers for pages
- `tests/Feature/` - HTTP endpoint tests (most common)
- `tests/Unit/` - Isolated business logic tests
- `tests/Browser/` - End-to-end browser tests (Playwright)

## Architecture Decisions

- **Business Logic**: Action classes in `app/Actions/{Domain}/` following domain-driven design
- **Validation**: Form Requests with `toDTO()` methods convert to type-safe DTOs
- **Controllers**: Thin controllers that delegate to Actions (single responsibility)
- **React Components**: Function components with TypeScript, no `FC` type, use `import type`
- **State Management**: React Context for global state, TanStack Query for server state
- **Testing Strategy**: Feature tests for all HTTP endpoints, browser tests for complex UI flows
- **Type Safety**: 100% type coverage required (PHPStan level 9, TypeScript strict)

## Before Committing

All code must pass:

- Rector (automated refactoring)
- Pint (code formatting)
- PHPStan level 9 (static analysis)
- 90% code coverage minimum
- 100% type coverage
- ESLint + Prettier (frontend)
- TypeScript compilation (no errors)

Run `composer run checks` to verify all backend checks.
Run `npm run checks` to verify all frontend checks.

Formatters run automatically on save (Pint for PHP, Prettier for JS/TS/JSON).

## Environment Notes

- Laravel Herd provides automatic HTTPS at URL in `APP_URL` (.env)
- No need to run `php artisan serve` - always available via Herd
- Redis and MinIO automatically configured and running
- Vite HMR works with Herd's HTTPS automatically

## Available Skills

Load skills on-demand for specific tasks:

**Backend**: creating-actions, creating-dtos, creating-form-requests, creating-controllers, creating-migrations, managing-models, writing-feature-tests, writing-unit-tests

**Frontend**: creating-react-components, creating-inertia-pages, creating-hooks, creating-layouts, defining-typescript-types

**Quality**: ensuring-laravel-quality, ensuring-frontend-quality, writing-browser-tests

## Custom Commands

Quick access patterns:

- `/test` - Run all tests with coverage
- `/quality` - Run all quality checks and fix issues
- `/component Name` - Create React component
- `/action ActionName` - Create Action class

## For More Context

- Skill files in `.opencode/skill/` provide detailed patterns for specific tasks
- Load skills automatically by mentioning task types (e.g., "create an Action")
```

**Key features of this example:**

- **Concise**: Around 80-90 lines
- **Actionable**: Exact commands with flags
- **Universal**: Everything applies to most tasks
- **Fresh**: No code snippets that go stale
- **Progressive**: References skills for detailed patterns

### Example 2: React SPA (Frontend Only)

For a React single-page application:

```markdown
# Project Name - React TypeScript SPA

Brief description of the application.

## Quick Commands

- **Dev**: `npm run dev` (Vite dev server)
- **Build**: `npm run build` (production bundle)
- **Test**: `npm test` (Vitest with coverage)
- **Lint**: `npm run lint` (ESLint + Prettier)
- **Type Check**: `npm run type-check` (TypeScript compiler)
- **Preview**: `npm run preview` (test production build)

## Tech Stack

- **Framework**: React 19, TypeScript 5
- **Build**: Vite 6
- **Routing**: React Router v7
- **State**: TanStack Query + Zustand
- **Styling**: Tailwind CSS v4
- **Testing**: Vitest + React Testing Library + Playwright

## Key Directories

- `src/components/` - Reusable React components
- `src/pages/` - Route page components
- `src/features/` - Feature-based modules (components + hooks + utils)
- `src/lib/` - Shared utilities and helpers
- `src/api/` - API client and endpoint definitions
- `tests/` - Test files mirror src/ structure

## Architecture Decisions

- **Component Organization**: Feature-based in `src/features/`, shared in `src/components/`
- **State Management**: TanStack Query for server state, Zustand for client state
- **API Layer**: All API calls through `src/api/client.ts` with typed endpoints
- **Component Pattern**: Function components with hooks, no class components
- **Type Safety**: Strict TypeScript, no `any` types, use `unknown` for unsafe data
- **Testing**: Unit tests for logic, integration tests for features, e2e for critical flows

## Before Committing

All code must pass:

- TypeScript compilation (`npm run type-check`)
- ESLint with no warnings (`npm run lint`)
- Prettier formatting (auto-formatted on save)
- Test suite with 90% coverage (`npm test -- --coverage`)
- Production build succeeds (`npm run build`)

## For More Context

- @docs/component-patterns.md for component conventions
- @docs/state-management.md for state patterns
- @docs/testing-strategy.md for test organization
```

### Example 3: Python CLI Tool

For a Python command-line application:

```markdown
# Project Name - Python CLI Tool

Brief description of what the CLI does.

## Quick Commands

- **Setup**: `uv venv && uv pip install -e ".[dev]"` (create venv and install)
- **Run**: `project-name [command]` (main CLI entry point)
- **Test**: `pytest --cov` (tests with coverage)
- **Lint**: `ruff check .` (linting)
- **Format**: `ruff format .` (auto-formatting)
- **Type Check**: `mypy src/` (static type checking)

## Tech Stack

- **Python**: 3.12+
- **CLI Framework**: Click 8
- **Testing**: pytest with pytest-cov
- **Linting**: Ruff (replaces flake8, isort, black)
- **Type Checking**: mypy with strict mode
- **Package Manager**: uv (fast pip alternative)

## Key Directories

- `src/project_name/` - Main package code
- `src/project_name/commands/` - CLI command implementations
- `src/project_name/utils/` - Shared utilities
- `tests/` - Test files mirror src/ structure
- `tests/fixtures/` - Test data and fixtures

## Architecture Decisions

- **CLI Pattern**: Click-based command groups with decorators
- **Configuration**: Load from `~/.config/project-name/config.toml`
- **Error Handling**: Custom exception hierarchy, user-friendly error messages
- **Testing**: Unit tests for pure functions, integration tests for commands
- **Type Safety**: Full type hints with mypy strict mode

## Before Committing

All code must pass:

- Ruff linting (`ruff check .`)
- Ruff formatting (`ruff format .`)
- mypy type checking (`mypy src/`)
- pytest with 90% coverage (`pytest --cov --cov-report=term-missing`)

## For More Context

- @docs/commands.md for adding new CLI commands
- @docs/testing.md for testing patterns
```

## Anti-Patterns to Avoid

### ❌ Don't Do This

**1. Including style rules:**

```markdown
## Code Style

- Use single quotes for strings
- Max line length 100 characters
- No trailing commas
- 2 space indentation
```

_Issue: This should be in linter config, not AGENTS.md. LLMs are slower and more expensive than deterministic linters._

**2. Including code snippets:**

```markdown
## Action Example

\`\`\`php

<?php

declare(strict_types=1);

namespace App\Actions\Auth;

final readonly class RegisterUserAction
{
    public function handle(RegisterUserData $data): User
    {
        // ... 30 lines of code
    }
}
\`\`\`
```

_Issue: Code goes stale quickly. Reference `file:line` locations or use skills instead._

**3. Task-specific instructions:**

```markdown
## Creating User Registration

When creating user registration:

1. Create the Action in app/Actions/Auth/
2. Create the DTO in app/DTOs/Auth/
3. Create the Form Request in app/Http/Requests/Auth/
4. Create the Controller in app/Http/Controllers/Auth/
5. Add the route in routes/web.php
```

_Issue: This is task-specific. Use a skill or custom command instead._

**4. Vague instructions:**

```markdown
## Testing

Write good tests for all features.
Make sure everything is covered.
Test edge cases.
```

_Issue: Not actionable. What commands? What coverage threshold? What constitutes "good"?_

**5. Bloating the file:**

```markdown
# Project Name

[200+ lines of every possible detail about the project]
```

_Issue: Beyond ~100 lines, ALL instruction-following degrades. Use progressive disclosure._

### ✅ Do This Instead

**1. Reference linter configs:**

```markdown
## Code Quality

All code formatted automatically:

- PHP: Pint (Laravel style preset)
- TypeScript: Prettier + ESLint
- Formatters run on save

Run `composer run checks` to verify quality.
```

**2. Reference skills or files:**

```markdown
## Code Patterns

Use skill `creating-actions` for Action class patterns.
See example Actions in app/Actions/Auth/ directory.
```

**3. Create a skill or command:**

Create `.opencode/skill/creating-user-auth/SKILL.md` with detailed steps, then reference it:

```markdown
## Custom Workflows

Use skill `creating-user-auth` for user registration workflows.
```

**4. Specific, actionable instructions:**

```markdown
## Testing

Run `composer test -- --coverage` before committing.
Minimum 90% code coverage required.
Feature tests for all HTTP endpoints.
Browser tests for complex UI flows.
```

**5. Ruthless prioritization:**

```markdown
# Project Name - Laravel + React

[Only 60-80 lines of UNIVERSAL, ACTIONABLE instructions]

## For More Context

- @docs/detailed-patterns.md for comprehensive patterns
- @docs/architecture.md for architecture decisions
- @docs/deployment.md for deployment procedures
```

## Implementation Workflow

When creating or updating an AGENTS.md file:

### Step 1: Thorough Analysis

1. **Explore the project structure:**

   ```
   Use Task tool with explore agent for comprehensive codebase exploration:
   - Find all package manager files
   - Identify test configurations
   - Locate linter and formatter configs
   - Map key directories
   ```

2. **Read configuration files:**
   - Parse package.json, composer.json for scripts and dependencies
   - Read build configs (vite.config.js, etc.)
   - Check test configs (vitest.config.js, phpunit.xml, etc.)
   - Review linter configs (.eslintrc, phpstan.neon, etc.)

3. **Infer architecture:**
   - Look at directory structure
   - Read README.md and docs/
   - Check for ADRs (Architecture Decision Records)
   - Examine key source files for patterns

### Step 2: Draft Content

1. **Write each section in order:**
   - Start with project name and one-sentence description
   - Quick Commands (extract from package.json, composer.json)
   - Tech Stack (from dependencies and configs)
   - Key Directories (from directory structure)
   - Architecture Decisions (from code patterns and docs)
   - Before Committing (from test/lint configs)
   - Progressive Disclosure (if needed)

2. **Keep it concise:**
   - Aim for 60-100 lines total
   - Every line must be universally applicable
   - No code snippets, no style rules
   - Only actionable commands

### Step 3: Handle Existing AGENTS.md

If AGENTS.md already exists:

1. **Read the current file completely**
2. **Analyze what's working:**
   - Accurate commands?
   - Current tech stack?
   - Useful architecture notes?
3. **Identify improvements:**
   - Outdated information?
   - Non-universal instructions?
   - Missing critical commands?
   - Too long (>100 lines)?
4. **Preserve good content:**
   - Keep accurate, universal instructions
   - Keep valid custom commands/agents references
   - Keep working progressive disclosure links
5. **Improve or replace:**
   - Update outdated tech versions
   - Remove non-universal instructions
   - Add missing critical commands
   - Move detailed content to external docs
   - Reduce to 60-100 lines if too long

### Step 4: Create External Documentation (If Needed)

If content exceeds 100 lines:

1. **Create docs directory:**

   ```bash
   mkdir -p docs/agent_docs
   ```

2. **Move detailed content to separate files:**
   - `docs/agent_docs/architecture.md` - Detailed architecture
   - `docs/agent_docs/testing-guide.md` - Testing strategies
   - `docs/agent_docs/api-patterns.md` - API conventions
   - `docs/agent_docs/component-guide.md` - Component patterns

3. **Reference in AGENTS.md:**

   ```markdown
   ## For More Context

   - @docs/agent_docs/architecture.md for architecture details
   - @docs/agent_docs/testing-guide.md for testing strategies
   ```

### Step 5: Write or Update the File

1. **Create or overwrite AGENTS.md** in project root
2. **Use the researched content**
3. **Follow the structure from examples**
4. **Aim for 60-100 lines**
5. **Ensure every instruction is universal and actionable**

### Step 6: Validate

After writing, verify:

- [ ] File is 60-100 lines (optimal) or has valid reason to be longer
- [ ] All commands are exact and tested
- [ ] Tech stack versions are accurate
- [ ] Architecture decisions are critical and universal
- [ ] No code snippets included
- [ ] No style rules (those belong in linters)
- [ ] No task-specific instructions
- [ ] Progressive disclosure used if content would exceed 100 lines
- [ ] File will stay fresh (no content that goes stale quickly)

### Step 7: Explain to User

After creating/updating AGENTS.md, explain:

1. **What was created/updated**
2. **Key sections included**
3. **Why certain decisions were made**
4. **What was intentionally excluded (and why)**
5. **How to use the file**
6. **Suggestion to commit to Git**

## Common Questions

### Q: Should I include all available commands?

**A:** No. Only include commands used for **daily development**. Rare commands belong in documentation, not AGENTS.md.

**Daily commands:**

- ✅ Dev server
- ✅ Test runner
- ✅ Linter/formatter
- ✅ Build

**Rare commands:**

- ❌ Database migrations (not daily)
- ❌ Deployment (not daily)
- ❌ Cache clearing (not daily)
- ❌ One-off scripts (not daily)

### Q: How do I handle monorepos?

**A:** Use hierarchical configuration:

1. **Root AGENTS.md:** Cross-cutting concerns, workspace commands
2. **Package-level AGENTS.md:** Package-specific conventions

Example root:

```markdown
# Monorepo Name

Turborepo monorepo with multiple packages.

## Quick Commands

- **Dev**: `turbo run dev` (all packages)
- **Test**: `turbo run test` (all packages)
- **Build**: `turbo run build` (all packages)
- **Workspace**: `turbo run dev --filter=@scope/package` (single package)

## Key Directories

- `apps/web/` - Next.js web application (see apps/web/AGENTS.md)
- `apps/api/` - Express API server (see apps/api/AGENTS.md)
- `packages/ui/` - Shared UI components (see packages/ui/AGENTS.md)
- `packages/types/` - Shared TypeScript types

## Architecture Decisions

- Shared packages in `packages/` with proper exports
- Apps in `apps/` consume packages via workspace names
- Turborepo for caching and parallel execution
```

### Q: What if the project has no tests?

**A:** Document the current state honestly:

```markdown
## Before Committing

- Run build to verify no errors: `npm run build`
- ESLint must pass: `npm run lint`

Note: Test suite is not yet implemented.
```

Don't add aspirational instructions that don't match reality.

### Q: Should I include deployment instructions?

**A:** Only if deployment happens frequently (daily/weekly). For most projects, deployment instructions belong in external documentation:

```markdown
## For More Context

- @docs/deployment.md for deployment procedures
```

### Q: How do I handle pre-commit hooks?

**A:** Document what runs automatically:

```markdown
## Before Committing

Pre-commit hooks run automatically:

- Pint formats PHP code
- Prettier formats JS/TS/JSON
- ESLint checks TypeScript

Additional manual checks:

- Run `composer test` to verify tests pass
- Run `npm run type-check` for TypeScript errors
```

## Quality Checklist

Before finalizing AGENTS.md:

- [ ] File is 60-100 lines (or has valid reason to be longer)
- [ ] Project name and brief description at top
- [ ] Quick Commands section with exact syntax
- [ ] Tech Stack section with versions
- [ ] Key Directories mapped with PURPOSE
- [ ] Architecture Decisions (3-5 critical ones)
- [ ] Before Committing checklist is actionable
- [ ] All commands tested and work
- [ ] No style rules (use linters)
- [ ] No code snippets (they go stale)
- [ ] No task-specific instructions (use skills/commands)
- [ ] Every instruction is universal (applies to every task)
- [ ] Progressive disclosure used if needed (external docs)
- [ ] File will stay fresh over time

## Summary

Creating effective AGENTS.md files requires:

1. **Thorough research** - Analyze project structure, configs, and patterns
2. **Ruthless prioritization** - Only universal, actionable instructions
3. **Optimal length** - 60-100 lines for best LLM instruction-following
4. **WHAT-WHY-HOW framework** - Stack, decisions, verification
5. **Progressive disclosure** - External docs for detailed guides
6. **Freshness** - No content that goes stale (code snippets, versions that change)
7. **Actionability** - Exact commands, no vague instructions

The most effective AGENTS.md files keep the AI focused on what matters for EVERY task, with easy access to detailed information when needed.

**Remember: Your AGENTS.md is the highest-leverage customization point for AI coding assistants. Treat it like a carefully-crafted prompt that you iterate on based on friction points.**
