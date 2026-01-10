# Agent Basics for Commands

Quick reference for creating agents that work with commands. For comprehensive agent patterns, see the `creating-agentic-subagents` skill.

## Basic Agent Structure

```markdown
---
description: What the agent does and when to use it
mode: subagent # primary, subagent, or all
temperature: 0.1 # Optional: 0.0-1.0
tools: # Optional: tool restrictions
  write: false
  edit: false
  bash: false
permission: # Optional: permission overrides
  edit: deny
  bash:
    '*': ask
    'git status': allow
---

System prompt for the agent.
Define its role, capabilities, and behavior.
```

## Agent Configuration Quick Reference

| Field         | Required | Values                       | Notes                              |
| ------------- | -------- | ---------------------------- | ---------------------------------- |
| `description` | Yes      | String                       | Include "when to use" guidance     |
| `mode`        | No       | `primary`, `subagent`, `all` | Defaults to `all`                  |
| `temperature` | No       | 0.0-1.0                      | Lower = focused, higher = creative |
| `hidden`      | No       | Boolean                      | Hide from @autocomplete            |
| `tools`       | No       | Object                       | Enable/disable specific tools      |
| `permission`  | No       | Object                       | Fine-grained permissions           |
| `model`       | No       | String                       | Only if user explicitly requests   |

## Common Agent Types for Commands

### Read-Only Reviewer

```yaml
mode: subagent
temperature: 0.1
tools:
  write: false
  edit: false
  bash: false
permission:
  edit: deny
```

### Test Fixer (Full Access)

```yaml
mode: subagent
temperature: 0.2
# No restrictions - needs edit and bash
```

### Quality Auditor

```yaml
mode: subagent
subtask: true
# Full access for running checks and fixing
```

## Commands that Invoke Agents

Use `subtask: true` to invoke as subagent:

```markdown
---
description: Comprehensive code review
agent: code-reviewer
subtask: true
---

Review all recent changes:
!`git diff HEAD~1`
```

When `subtask: true`:

- Creates isolated session
- Uses specified agent
- Doesn't pollute main context
- Navigate with Leader+Left/Right

## For More Detail

See the `creating-agentic-subagents` skill for:

- Complete pattern templates
- Permission patterns
- Context management
- Cost considerations
- Full production examples
