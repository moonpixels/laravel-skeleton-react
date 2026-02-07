# Agent Basics for Commands

Use these pointers when choosing `agent:` or `subtask: true` in command files.

## Built-in Agents

| Agent     | Mode     | Use Case                                |
| --------- | -------- | --------------------------------------- |
| `build`   | primary  | Default agent for most command workflows |
| `plan`    | primary  | Planning/analysis only, no writes        |
| `general` | subagent | Research or multi-step assistance        |
| `explore` | subagent | Fast codebase exploration                |

## Agent Selection Tips

- Omit `agent` to use the current/default agent.
- Use `plan` when you need analysis only (no edits).
- Use specialized agents (like `code-reviewer`) for focused tasks.

## When to Use `subtask: true`

- Long-running workflows
- Commands that generate large output
- Tasks you want isolated from the main conversation
