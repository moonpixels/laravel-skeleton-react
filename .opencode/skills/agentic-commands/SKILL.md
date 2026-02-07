---
name: agentic-commands
description: Create OpenCode command files for workflow automation. Use when defining slash commands, updating .opencode/commands, or when asked to add/modify OpenCode command templates.
---

# Create Agentic Commands

Write OpenCode command templates that agents can execute reliably in TUI or headless mode.

## Quick Start

```markdown
---
description: Run tests with coverage and report failures
agent: build
---

Run the full test suite:

!`npm test -- --coverage`

If tests fail, list each failure with file:line and suggest fixes.
```

## Core Rules

- Store commands in `.opencode/commands/{name}.md` (global: `~/.config/opencode/commands/{name}.md`).
- Use `$ARGUMENTS` (or `$1`, `$2`) for user input, ``!`cmd` `` for shell output, and `@file` to include file contents.
- Write explicit success/failure handling and verification steps.
- Avoid destructive shell commands unless the user explicitly asks; if needed, require confirmation.
- Prefer `subtask: true` for noisy or multi-step workflows.
- Do not set `model` unless the user requests it.

## References

- [references/examples.md](references/examples.md) - Compact, safe command templates
- [references/agent-basics.md](references/agent-basics.md) - Agent selection and subtask behavior
