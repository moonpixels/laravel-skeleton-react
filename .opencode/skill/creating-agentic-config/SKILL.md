---
name: agentic-config
description: Create or update AGENTS.md project instructions for agentic coding tools. Use when initializing projects or tuning agent context.
---

# Create Agentic Configuration Files

Create concise AGENTS.md files that capture universal, actionable project guidance. Keep task-specific detail in skills and ensure every instruction applies broadly.

## Quick Start

Example workflow:

```
1) Read package scripts and configs for dev/test/lint commands.
2) Identify stack, key directories, and 3-5 architecture decisions.
3) Draft AGENTS.md with only universal instructions and verification steps.
```

## Rules

- Include only instructions that apply to every task.
- Commands must be exact and runnable.
- Prefer skills for task-specific guidance and keep AGENTS.md high-signal.
- Avoid large code snippets; only tiny, stable snippets when unavoidable.
- Keep the file concise and remove anything that will go stale.

## Output Checklist

- Project name + one-line description.
- Quick Commands (dev, lint, test, build or equivalent).
- Tech Stack with versions.
- Key Directories with purpose.
- Architecture Decisions (3-5 critical choices).
- Before Committing checklist with exact commands.
- Available Skills and Specialized Agents sections when configured.

## References

- [Examples](references/examples.md)
- [Research process](references/research-process.md)
