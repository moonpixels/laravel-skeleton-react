---
name: creating-agentic-commands
description: Create custom slash commands and configure specialized agents for workflow automation in OpenCode. Use when creating commands, configuring agents, automating workflows, or when user mentions slash commands, custom commands, /command patterns, @agent patterns, subagents, agent configuration, or workflow automation.
---

# Creating Agentic Commands

Custom slash commands for workflow automation in OpenCode.

## Understanding Commands vs Agents

### Custom Commands (Slash Commands)

Slash commands like `/test`, `/component`, `/quality` are **prompt shortcuts** that:

- Execute predefined prompts with optional arguments
- Can inject shell output or file contents into prompts
- Can specify which agent and model to use
- Can trigger subagent invocations for isolated tasks
- Live in `.opencode/command/` as markdown files

**Use commands when:**

- You have a repeated prompt pattern
- You need to run shell commands before prompting
- You want to inject dynamic content (git diff, test results)
- You're automating a specific workflow

### Agents

Agents like `@test-fixer`, `@code-reviewer` are **specialized AI assistants**. For comprehensive agent creation, see the `creating-agentic-subagents` skill.

**Use agents when:**

- You need a specialized AI personality
- You want to restrict tool access (read-only, no edits)
- You need different behavior (planning vs building)

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

## Core Command Patterns

### Pattern 1: Simple Automation

```markdown
---
description: Run all tests with coverage report
agent: build
---

Run the full test suite with coverage:

!`composer test -- --coverage`

Analyze the results:

1. If all tests pass, confirm success
2. If tests fail, identify failures and suggest fixes
3. Check if coverage meets 90% threshold
```

### Pattern 2: Code Generation

```markdown
---
description: Create a new React component with TypeScript
agent: build
---

Create a React component named $ARGUMENTS following these requirements:

1. Use React 19 function component syntax (no FC type)
2. Include TypeScript with proper typing
3. Place in resources/js/components/$ARGUMENTS.tsx

After creating, explain how to use it.
```

Usage: `/component UserProfile`

### Pattern 3: Multi-Step Workflow

```markdown
---
description: Run all quality checks and fix issues
agent: build
subtask: true
---

Execute the complete quality workflow:

1. Run Rector: !`composer rector`
2. Run Pint: !`composer pint`
3. Run PHPStan: !`composer stan`
4. Run frontend checks: !`npm run checks`
5. Run tests: !`composer test -- --coverage`

For each step, fix issues and re-run until clean.
```

### Pattern 4: Workflow with Arguments

```markdown
---
description: Run specific test by name
agent: build
---

Run the specific test: $ARGUMENTS

!`php artisan test --filter=$ARGUMENTS`

Analyze the results and suggest fixes if applicable.
```

Usage: `/test-filter RegisterUserActionTest`

### Pattern 5: Subagent Invocation

```markdown
---
description: Comprehensive code review
agent: code-reviewer
subtask: true
---

Review all recent changes:

!`git diff HEAD~1`

Analyze code quality, security, and performance.
```

When `subtask: true`:

- Creates isolated session
- Doesn't pollute main context
- Navigate with Leader+Left/Right

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
