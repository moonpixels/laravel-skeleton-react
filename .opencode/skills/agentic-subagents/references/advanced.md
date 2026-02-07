# Advanced Patterns

## Task Delegation Controls (Optional)

Use `permission.task` to restrict which subagents can be invoked via the Task tool.
Only use this when you need a strict orchestrator.

```yaml
permission:
  task:
    "*": deny
    "code-reviewer": allow
    "test-fixer": allow
    "security-auditor": ask
```

## Hidden Internal Helpers

Hide internal subagents from the @ menu:

```yaml
hidden: true
```

## Iteration Limits

Use `steps` to cap agentic loops on costly workflows:

```yaml
steps: 25
```
