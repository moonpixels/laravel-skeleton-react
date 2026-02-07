# Command Examples

Short, safe templates for OpenCode `.opencode/commands/*.md` files.

## Example 1: Targeted Test Run

`.opencode/commands/test-filter.md`:

```markdown
---
description: Run a specific test by name and summarize failures
agent: build
---

Run tests matching: $ARGUMENTS

!`npm test -- --testNamePattern="$ARGUMENTS" --verbose`

If tests fail, summarize each failure with file:line and likely cause.
```

## Example 2: Lint and Fix Guidance

`.opencode/commands/lint.md`:

```markdown
---
description: Run ESLint and report errors with suggested fixes
agent: build
---

Run ESLint:

!`npm run lint`

If errors exist, list each error with file:line and suggested fix.
```

## Example 3: Code Review (Subtask)

`.opencode/commands/review.md`:

```markdown
---
description: Review recent changes for quality issues
agent: code-reviewer
subtask: true
---

Review changes from the last commit:

!`git diff HEAD~1`

Report issues with file:line references and concise recommendations.
```
