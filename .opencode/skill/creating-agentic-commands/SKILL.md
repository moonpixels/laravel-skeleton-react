---
name: creating-agentic-commands
description: Create custom slash commands and configure specialized agents for workflow automation in OpenCode. Use when creating commands, configuring agents, automating workflows, or when user mentions slash commands, custom commands, /command patterns, @agent patterns, subagents, agent configuration, or workflow automation.
---

# Create Agentic Commands

Create custom slash commands for workflow automation in OpenCode. Commands are prompt shortcuts that execute predefined prompts with arguments, shell output injection, and file references. For specialized AI assistants with tool restrictions, see `creating-agentic-subagents`.

## Understanding Commands vs Agents

### Custom Commands (Slash Commands)

Slash commands like `/test`, `/component`, `/quality` are **prompt shortcuts** that:

- Execute predefined prompts with optional arguments
- Can inject shell output or file contents into prompts
- Can specify which agent and model to use
- Can trigger subagent invocations for isolated tasks
- Live in `.opencode/command/` as markdown files

### Agents

Agents like `@test-fixer`, `@code-reviewer` are **specialized AI assistants**. For comprehensive agent creation, see the `creating-agentic-subagents` skill.

### Decision Tree

```
Need automation?
├─ Just a prompt shortcut? → Custom command
├─ Need specialized AI behavior? → Agent (see creating-agentic-subagents skill)
├─ Need to restrict tools? → Agent with permissions
├─ Workflow with multiple steps? → Command that invokes subagent
└─ Complex orchestration? → Primary agent that invokes subagents
```

## File Structure

**Project-specific:**

```
.opencode/command/{name}.md
```

**Global (all projects):**

```
~/.config/opencode/command/{name}.md
```

**Naming conventions:**

- Lowercase with hyphens: `test.md`, `fix-style.md`, `test-coverage.md`
- Use verb or action: `test`, `build`, `analyze`, `create-component`
- File name becomes command: `test.md` → `/test`

## Command Structure

```markdown
---
description: Brief description shown in TUI
agent: build # Optional: which agent runs this
subtask: true # Optional: run as isolated subagent
---

Your prompt template goes here.
Can use $ARGUMENTS for user input.
Can use !`shell command` for dynamic content.
Can use @filename for file references.
```

### Configuration Options

**`description`** (required):
Brief description shown in TUI autocomplete.

**`agent`** (optional):
Which agent executes: `build`, `plan`, or custom agent name.

**`subtask`** (optional):
Set to `true` to invoke as subagent (separate context).

**`model`** (optional - only use when user explicitly requests):
Override the default model. Omit unless user asks for specific model.

## Template Syntax

### Arguments

**All arguments:**

```markdown
Create a React component named $ARGUMENTS with TypeScript support.
```

Usage: `/component Button` → `$ARGUMENTS` becomes `Button`

**Positional arguments:**

```markdown
Create a file named $1 in directory $2 with content: $3
```

Usage: `/create-file config.json src "{ \"key\": \"value\" }"`

### Shell Output

Inject shell command output with `` !`command` ``:

```markdown
Here are the current test results:

!`npm test -- --coverage`

Based on these results, suggest improvements.
```

### File References

Include file contents with `@filename`:

```markdown
Review the component in @src/components/Button.tsx.
Check for performance issues.
```

## Command Patterns

| Pattern             | Description                 | Key Feature                        |
| ------------------- | --------------------------- | ---------------------------------- |
| Simple Automation   | Run tests, builds           | Shell output with `` !`command` `` |
| Code Generation     | Create components, actions  | `$ARGUMENTS` for user input        |
| Multi-Step Workflow | Quality checks, deploys     | `subtask: true` for isolation      |
| Argument Handling   | Filter tests, target files  | `$1`, `$2` for positional args     |
| Subagent Invocation | Code review, security audit | `agent: code-reviewer`             |

See `references/examples.md` for complete implementations of each pattern.

## Built-in Commands

OpenCode includes:

- `/init` - Initialize OpenCode for project
- `/undo` - Undo last changes
- `/redo` - Redo undone changes
- `/share` - Share conversation
- `/help` - Show help
- `/connect` - Configure providers

Custom commands can override built-ins.

## Recommended Project Commands

**Development:**

- `/test` - Run all tests with coverage
- `/test-filter TestName` - Run specific test
- `/dev` - Start development servers

**Quality:**

- `/quality` - Run all quality checks
- `/fix-style` - Run Pint auto-formatter
- `/analyze` - Run PHPStan analysis

**Code Generation:**

- `/action ActionName` - Create Action class
- `/component ComponentName` - Create React component
- `/migration TableName` - Create migration
- `/endpoint ResourceName` - Create full API endpoint

**Build:**

- `/build` - Build production assets
- `/fresh` - Fresh database with seeders

## Anti-Patterns

### Don't Do This

**Vague description:**

```yaml
description: Run tests # ❌ Doesn't explain analysis
```

**Missing argument handling:**

```markdown
Create a component # ❌ No way to specify which
```

**No error handling:**

```markdown
!`npm test`
Report if successful # ❌ Doesn't handle failures
```

**Unnecessarily specifying model:**

```yaml
model: anthropic/claude-sonnet-4-20250514 # ❌ Not needed
```

### Do This Instead

**Clear description:**

```yaml
description: Run all tests with coverage and suggest fixes for failures
```

**Proper argument handling:**

```markdown
Create a React component named $ARGUMENTS in resources/js/components/$ARGUMENTS.tsx
```

**Error handling:**

```markdown
!`npm test`

Analyze results:

- ✅ If tests pass: Confirm success
- ❌ If tests fail: Identify failures and suggest fixes
```

**Omit model field:**

```yaml
# No model specified - uses user's configured default
```

## Quality Checklist

Before finalizing a command:

- [ ] Clear, descriptive `description` field
- [ ] Appropriate agent selected
- [ ] Model field only included if user requested
- [ ] Arguments handled with `$ARGUMENTS` or `$1`, `$2`, etc.
- [ ] Shell commands use `` !`command` `` syntax
- [ ] Error cases handled in prompt
- [ ] File references use `@filename` syntax
- [ ] Command tested and works as expected

## References

- `references/examples.md` - Full production-ready command examples
- `references/agent-basics.md` - Quick agent reference for commands
- See `creating-agentic-subagents` skill for comprehensive agent patterns
