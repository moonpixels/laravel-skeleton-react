---
name: agentic-subagents
description: Create OpenCode subagents for automatic routing and safe workflows. Use when defining .opencode/agents, descriptions, and permissions.
---

# Create OpenCode Subagents

## Quick Start

Create `.opencode/agents/code-reviewer.md`:

```markdown
---
description: Reviews code for bugs, security, and maintainability without changes. Automatically invoke this agent after code changes or when the user requests review. Use when reviewing diffs, PRs, refactors, or audits.
mode: subagent
temperature: 0.1
permission:
  edit: deny
  bash:
    "*": deny
    "git diff*": allow
    "git log*": allow
    "git status*": allow
---
You are a code reviewer. Provide prioritized findings with file:line references and fixes.
```

## Rules

- Store subagents in `.opencode/agents/` with kebab-case filenames; set `mode: subagent`.
- Treat `description` as the routing contract: capability + auto-invoke trigger + "Use when" clause.
- Prefer `permission` over legacy `tools`; grant only the tools the workflow needs.
- Use `steps` to cap iteration loops; include exit criteria for test/lint/run loops.
- Keep each subagent focused on one workflow; delegate for multi-specialist tasks.

## References

- [references/agent-files.md](references/agent-files.md)
- [references/description-routing.md](references/description-routing.md)
- [references/permission-recipes.md](references/permission-recipes.md)
- [references/advanced.md](references/advanced.md)
- [references/patterns.md](references/patterns.md)
- [references/examples.md](references/examples.md)
