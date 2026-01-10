# Command Examples

Complete, production-ready command configurations.

## Example 1: Testing Command

`.opencode/command/test.md`:

```markdown
---
description: Run all tests with coverage report
agent: build
---

Run the full test suite with coverage:

!`composer test -- --coverage`

Analyze the results:

1. If all tests pass and coverage ≥ 90%, report success
2. If tests fail, identify failures and suggest fixes
3. If coverage < 90%, identify untested code
```

## Example 2: Component Generation Command

`.opencode/command/component.md`:

```markdown
---
description: Create a new React component with TypeScript
agent: build
---

Create a React component named $ARGUMENTS with these requirements:

1. File location: resources/js/components/$ARGUMENTS.tsx
2. React 19 function component (no FC type)
3. TypeScript with full type annotations
4. Use `import type` for type imports
5. PropsWithChildren if it accepts children
6. Tailwind CSS v4 for styling
7. Include JSDoc comment explaining the component

Example structure:

- Props interface with proper types
- Clean component implementation
- Export at bottom

After creation:

- Show the complete file
- Provide usage example
- Suggest where to import it
```

Usage: `/component UserAvatar`

## Example 3: Quality Workflow Command

`.opencode/command/quality.md`:

```markdown
---
description: Run all quality checks and fix issues
agent: build
subtask: true
---

Execute the complete quality workflow:

**Step 1: Rector**
!`./vendor/bin/rector`
Fix any issues found, then re-run.

**Step 2: Pint**
!`./vendor/bin/pint`

**Step 3: PHPStan**
!`./vendor/bin/phpstan analyse`
Fix issues until clean.

**Step 4: Frontend**
!`npm run checks`
Fix any ESLint or TypeScript errors.

**Step 5: Tests**
!`composer test -- --coverage`

Report results:

- ✅ All checks passing
- ✅ Coverage: X%
- ✅ Type coverage: 100%
```

## Example 4: Test Filter Command

`.opencode/command/test-filter.md`:

```markdown
---
description: Run specific test by name
agent: build
---

Run the specific test: $ARGUMENTS

!`php artisan test --filter=$ARGUMENTS`

Analyze the results:

- If the test passes, confirm success
- If it fails, show the failure details
- Suggest fixes if applicable
```

Usage: `/test-filter RegisterUserActionTest`

## Example 5: Debug Command

`.opencode/command/debug.md`:

```markdown
---
description: Analyze recent errors and logs
agent: build
---

Analyze the application state:

1. Recent Laravel logs:
   !`tail -n 50 storage/logs/laravel.log`

2. Recent git changes:
   !`git log --oneline -10`
   !`git diff HEAD~1`

3. Current test status:
   !`composer test`

Based on this information:

- Identify any errors or failures
- Suggest potential causes
- Recommend fixes or next debugging steps
```

## Example 6: Code Review Command (Using Subagent)

`.opencode/command/review.md`:

```markdown
---
description: Comprehensive code review
agent: code-reviewer
subtask: true
---

Review all recent changes:

!`git diff HEAD~1`

Analyze:

- Code quality
- Security issues
- Performance concerns
- Test coverage
```

## Example 7: Fresh Database Command

`.opencode/command/fresh.md`:

```markdown
---
description: Reset database with fresh migrations and seeders
agent: build
---

Reset the database to a fresh state:

!`php artisan migrate:fresh --seed`

After reset:

- Confirm all migrations ran successfully
- List tables created
- Confirm seeders populated data
- Report any errors encountered
```

## Example 8: Action Creation Command

`.opencode/command/action.md`:

```markdown
---
description: Create a new Action class following domain patterns
agent: build
---

Create an Action class named $ARGUMENTS following these patterns:

1. Location: app/Actions/{Domain}/$ARGUMENTS.php
2. Use `declare(strict_types=1);`
3. Mark class as `final`
4. Accept DTO as input parameter
5. Return typed result
6. Include PHPDoc annotations
7. Follow single responsibility principle

Structure:

- Constructor injection for dependencies
- Single public `execute()` method
- Type-safe return value

After creation:

- Show the complete Action file
- Create corresponding DTO if needed
- Suggest FormRequest integration
- Provide usage example in Controller
```

Usage: `/action CreateUser` or `/action User/UpdateProfile`

## Example 9: Migration Command

`.opencode/command/migration.md`:

```markdown
---
description: Create a new database migration
agent: build
---

Create a migration for: $ARGUMENTS

Use `php artisan make:migration` with appropriate naming:

- create\_[table]\_table for new tables
- add*[column]\_to*[table]\_table for adding columns
- update\_[table]\_table for modifications

Include:

- Proper column types and nullability
- Default values where appropriate
- Foreign key constraints with cascading
- Indexes for frequently queried columns

After creation:

- Show the migration file
- Explain key decisions
- Warn about irreversible operations
- Suggest testing with `php artisan migrate`
```

Usage: `/migration create_posts_table` or `/migration add_avatar_to_users_table`

## Example 10: Endpoint Command

`.opencode/command/endpoint.md`:

```markdown
---
description: Create a complete API endpoint with all layers
agent: build
---

Create a complete endpoint for: $ARGUMENTS

Generate all required files following domain-driven patterns:

1. **DTO** (app/DTOs/{Domain}/)
   - Immutable data container
   - Named constructor fromRequest()

2. **FormRequest** (app/Http/Requests/)
   - Validation rules
   - toDTO() conversion method

3. **Action** (app/Actions/{Domain}/)
   - Business logic
   - Accept DTO, return result

4. **Controller** (app/Http/Controllers/)
   - Thin handler
   - Delegate to Action
   - Return Inertia response

5. **Route** (routes/web.php or routes/api.php)
   - RESTful naming
   - Proper middleware

6. **Feature Test** (tests/Feature/)
   - Test happy path
   - Test validation
   - Test authorization

After creation:

- Show all generated files
- Provide usage documentation
- List next steps (React page, etc.)
```

Usage: `/endpoint CreatePost` or `/endpoint User/UpdateSettings`
