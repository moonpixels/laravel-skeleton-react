# Routing-Friendly Descriptions

OpenCode auto-invokes subagents based on `description`. Keep it short and aligned to user phrasing.

## Recommended Format

1) Capability statement
2) Auto-invoke trigger
3) "Use when" clause with 4-8 high-signal keywords

Example:

```
description: Runs tests and fixes failures until all pass. Automatically invoke this agent when tests fail or after code changes. Use when fixing tests, debugging failures, or stabilizing CI.
```

## Avoid

- Long keyword lists or unrelated terms
- Implementation detail in description
- Vague triggers like "use when needed"
