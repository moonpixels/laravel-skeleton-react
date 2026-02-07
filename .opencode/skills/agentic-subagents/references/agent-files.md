# Subagent Files (.opencode/agents)

Create each subagent as a markdown file in `.opencode/agents/`.
The filename (kebab-case) becomes the agent name for `@` mentions.

## Required Frontmatter

- `description` (required): routing contract for auto-delegation
- `mode: subagent`

## Common Frontmatter

- `temperature` (defaults vary by model)
- `model` (optional override; otherwise inherits from invoker)
- `steps` (max agentic iterations; use for iterative workflows)
- `permission` (preferred over legacy `tools`)

## Notes

- Prefer `permission` over deprecated `tools` booleans.
- Use kebab-case names like `code-reviewer.md`, `test-fixer.md`.
