---
name: creating-agentic-commands
description: Create custom slash commands and configure specialized agents for workflow automation in OpenCode. Use when creating commands, configuring agents, automating workflows, or when user mentions slash commands, custom commands, /command patterns, @agent patterns, subagents, agent configuration, or workflow automation.
---

# Creating Agentic Commands

## When to Use This Skill

Use this skill when:

- User requests "create a /command" or "add a slash command"
- Automating repetitive development workflows
- User mentions custom commands, slash commands, or /command patterns
- Creating specialized agents for specific tasks
- User mentions @agent patterns, subagents, or agent configuration
- Configuring workflow automation
- Setting up task-specific AI assistants
- User asks about command arguments, shell output, or file references
- Organizing multi-step development processes

## Understanding OpenCode Automation

OpenCode provides two primary automation mechanisms:

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

### Agents (Primary and Subagents)

Agents like `@test-fixer`, `@code-reviewer` are **specialized AI assistants** that:

- Have custom system prompts for specific domains
- Can have restricted tool access (read-only, no bash, etc.)
- Can use different models or temperatures
- Can be invoked by other agents or manually with @mention
- Live in `.opencode/agent/` as markdown files

**Use agents when:**

- You need a specialized AI personality
- You want to restrict tool access (read-only, no edits)
- You need different behavior (planning vs building)
- You're creating reusable specialized assistants

### Decision Tree

```
Need automation?
├─ Just a prompt shortcut? → Custom command
├─ Need specialized AI behavior? → Agent
├─ Need to restrict tools? → Agent with permissions
├─ Workflow with multiple steps? → Command that invokes subagent
└─ Complex orchestration? → Primary agent that invokes subagents
```

## File Structure

### Custom Commands

**Project-specific:**

```
.opencode/command/{name}.md
```

**Global (all projects):**

```
~/.config/opencode/command/{name}.md
```

**Example:**

```
.opencode/command/
├── test.md              # /test command
├── quality.md           # /quality command
├── component.md         # /component Name command
└── fresh.md             # /fresh command
```

### Agents

**Project-specific:**

```
.opencode/agent/{name}.md
```

**Global (all projects):**

```
~/.config/opencode/agent/{name}.md
```

**Example:**

```
.opencode/agent/
├── test-fixer.md        # @test-fixer agent
├── quality-auditor.md   # @quality-auditor agent
└── code-reviewer.md     # @code-reviewer agent
```

### Naming Conventions

**Commands:**

- Lowercase with hyphens: `test.md`, `fix-style.md`, `test-coverage.md`
- Use verb or action: `test`, `build`, `analyze`, `create-component`
- File name becomes command: `test.md` → `/test`

**Agents:**

- Lowercase with hyphens: `test-fixer.md`, `code-reviewer.md`
- Use noun or role: `reviewer`, `auditor`, `fixer`, `builder`
- File name becomes agent: `test-fixer.md` → `@test-fixer`

## Creating Custom Commands

### Basic Command Structure

Every command file follows this pattern:

```markdown
---
description: Brief description shown in TUI
agent: build # Optional: which agent runs this
model: anthropic/claude-sonnet # Optional: override model
subtask: false # Optional: invoke as subagent
---

Your prompt template goes here.
Can use $ARGUMENTS for user input.
Can use !`shell command` for dynamic content.
Can use @filename for file references.
```

### Command Configuration Options

**`description`** (required):

- Brief description shown in TUI autocomplete
- Should clearly explain what the command does

**`agent`** (optional):

- Which agent should execute this command
- Options: `build`, `plan`, or custom agent name
- Defaults to current agent if not specified

**`model`** (optional):

- Override the default model for this command
- Format: `provider/model-id`
- Example: `anthropic/claude-sonnet-4-20250514`

**`subtask`** (optional):

- Set to `true` to invoke command as subagent (separate context)
- Useful for isolated tasks that shouldn't pollute main context
- Creates a child session accessible with Leader+Left/Right

### Template Syntax

Commands support several special placeholders:

#### 1. Arguments

**All arguments:**

```markdown
Create a React component named $ARGUMENTS with TypeScript support.
```

Usage: `/component Button` → `$ARGUMENTS` becomes `Button`

**Positional arguments:**

```markdown
Create a file named $1 in the directory $2 with content: $3
```

Usage: `/create-file config.json src "{ \"key\": \"value\" }"`

- `$1` → `config.json`
- `$2` → `src`
- `$3` → `{ "key": "value" }`

#### 2. Shell Output

Inject shell command output with `` !`command` ``:

```markdown
---
description: Analyze test coverage
---

Here are the current test results:

!`npm test -- --coverage`

Based on these results, suggest improvements to increase coverage.
```

Commands run in project root directory.

#### 3. File References

Include file contents with `@filename`:

```markdown
---
description: Review component
---

Review the component in @src/components/Button.tsx.
Check for performance issues and suggest improvements.
```

File content is automatically included in the prompt.

## Core Command Patterns

### Pattern 1: Simple Automation

**Use case:** Run a specific task with predefined instructions

**Example: Test Command**

`.opencode/command/test.md`:

```markdown
---
description: Run all tests with coverage report
agent: build
model: anthropic/claude-sonnet-4-20250514
---

Run the full test suite with coverage reporting:

!`composer test -- --coverage`

Analyze the results:

1. If all tests pass, confirm success
2. If tests fail, identify the failing tests
3. Suggest fixes for any failures
4. Check if coverage meets 90% threshold
```

### Pattern 2: Code Generation

**Use case:** Generate code following project patterns

**Example: Component Command**

`.opencode/command/component.md`:

```markdown
---
description: Create a new React component with TypeScript
agent: build
---

Create a new React component named $ARGUMENTS following these requirements:

1. Use React 19 function component syntax (no FC type)
2. Include TypeScript with proper typing
3. Use PropsWithChildren if it accepts children
4. Follow Tailwind CSS conventions
5. Place in resources/js/components/$ARGUMENTS.tsx
6. Create a simple example with proper exports

After creating the component, explain how to use it.
```

Usage: `/component UserProfile`

### Pattern 3: Multi-Step Workflow

**Use case:** Execute a sequence of related tasks

**Example: Quality Command**

`.opencode/command/quality.md`:

```markdown
---
description: Run all quality checks and fix issues
agent: build
subtask: true
---

Execute the complete quality workflow:

1. Run Rector and apply fixes:
   !`composer rector`

2. Run Pint and apply fixes:
   !`composer pint`

3. Run PHPStan static analysis:
   !`composer stan`

4. Run frontend checks:
   !`npm run checks`

5. Run tests with coverage:
   !`composer test -- --coverage`

For each step:

- Report results
- If failures occur, analyze and fix
- Re-run the failing step after fixes

Final report:

- Summary of all checks
- Any remaining issues
- Coverage metrics
```

### Pattern 4: Debugging Helper

**Use case:** Inspect logs, errors, or state

**Example: Debug Command**

`.opencode/command/debug.md`:

```markdown
---
description: Analyze recent errors and logs
agent: build
---

Analyze the application state:

1. Recent Laravel logs:
   !`tail -n 50 storage/logs/laravel.log`

2. Recent git changes:
   !`git log --oneline -10`
   !`git diff HEAD~1`

3. Current test status:
   !`composer test`

Based on this information:

- Identify any errors or failures
- Suggest potential causes
- Recommend fixes or next debugging steps
```

### Pattern 5: Workflow with Arguments

**Use case:** Dynamic commands based on user input

**Example: Test Filter Command**

`.opencode/command/test-filter.md`:

```markdown
---
description: Run specific test by name
agent: build
---

Run the specific test: $ARGUMENTS

!`php artisan test --filter=$ARGUMENTS`

Analyze the results:

- If the test passes, confirm success
- If it fails, show the failure details
- Suggest fixes if applicable
```

Usage: `/test-filter RegisterUserActionTest`

## Creating Specialized Agents

### Basic Agent Structure

Every agent file follows this pattern:

```markdown
---
description: What the agent does and when to use it
mode: subagent # primary, subagent, or all
model: anthropic/claude-sonnet # Optional: override model
temperature: 0.1 # Optional: 0.0-1.0
hidden: false # Optional: hide from @autocomplete
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

### Agent Configuration Options

**`description`** (required):

- Clear description of agent's purpose
- Include when to use it
- Used for semantic matching by primary agents

**`mode`** (optional):

- `primary`: Main agent, switch with Tab key
- `subagent`: Invoked with @mention or automatically
- `all`: Can be used as both primary and subagent
- Defaults to `all` if not specified

**`model`** (optional):

- Override the default model
- Example: Use faster model for planning agents

**`temperature`** (optional):

- Control creativity vs determinism
- Range: 0.0 (focused) to 1.0 (creative)
- Typical values:
  - 0.0-0.2: Analysis, code review, planning
  - 0.3-0.5: General development
  - 0.6-1.0: Brainstorming, creative tasks

**`hidden`** (optional):

- Set to `true` to hide from @autocomplete menu
- Only for `mode: subagent` agents
- Still invokable by other agents via Task tool

**`tools`** (optional):

- Control which tools are available
- Set tools to `true` (enable) or `false` (disable)
- Overrides global tool configuration
- Examples: `write`, `edit`, `bash`, `read`, `glob`, `grep`

**`permission`** (optional):

- Control tool permissions
- Options: `allow`, `ask`, `deny`
- Can specify per-tool or per-bash-command
- Examples: See permission patterns below

### Agent Patterns

#### Pattern 1: Read-Only Reviewer

**Use case:** Code review without making changes

`.opencode/agent/code-reviewer.md`:

```markdown
---
description: Reviews code for best practices, security, and performance without making changes
mode: subagent
temperature: 0.1
tools:
  write: false
  edit: false
  bash: false
permission:
  edit: deny
---

You are a senior code reviewer specializing in Laravel and React.

Focus on:

- Code quality and best practices
- Security vulnerabilities
- Performance implications
- Type safety and error handling
- Test coverage gaps

Provide constructive feedback with:

- Specific file and line references (file:line)
- Clear explanations of issues
- Suggested fixes (without making changes)
- Priority levels (critical, high, medium, low)

Format feedback as:

## Critical Issues

## High Priority

## Medium Priority

## Low Priority / Suggestions
```

#### Pattern 2: Test Fixer

**Use case:** Iteratively run tests and fix failures

`.opencode/agent/test-fixer.md`:

```markdown
---
description: Runs tests and fixes failures iteratively until all pass
mode: subagent
agent: build
subtask: true
---

You are a test fixing specialist.

Your workflow:

1. Run all tests: `composer test`
2. If all pass, report success and exit
3. If tests fail:
   - Identify the failing test(s)
   - Analyze the failure reason
   - Fix the issue in the code or test
   - Re-run tests
4. Repeat until all tests pass

After all tests pass:

- Summarize what was fixed
- Confirm final test results
- Check code coverage if applicable
```

#### Pattern 3: Quality Auditor

**Use case:** Run all quality checks systematically

`.opencode/agent/quality-auditor.md`:

```markdown
---
description: Runs all quality checks and fixes issues systematically
mode: subagent
agent: build
subtask: true
---

You are a quality auditor for Laravel + React projects.

Execute in order:

1. **Rector**: Run `composer rector` and fix any issues
2. **Pint**: Run `composer pint` to format code
3. **PHPStan**: Run `composer stan`, fix issues, re-run until clean
4. **Type Coverage**: Check 100% type coverage is met
5. **Frontend**: Run `npm run checks`, fix any issues
6. **Tests**: Run `composer test -- --coverage`
7. **Coverage**: Verify 90% code coverage threshold

For each step:

- Report current status
- Fix issues immediately
- Re-run until step passes
- Track overall progress

Final report:
✅ All checks passing
✅ 90%+ code coverage
✅ 100% type coverage
✅ No linting errors
```

#### Pattern 4: Migration Builder

**Use case:** Create database migrations safely

`.opencode/agent/migration-builder.md`:

```markdown
---
description: Creates database migrations safely following Laravel conventions
mode: subagent
temperature: 0.2
---

You are a Laravel migration specialist.

When creating migrations:

1. Use `php artisan make:migration` for generation
2. Follow Laravel conventions:
   - `up()` and `down()` methods
   - Reversible operations when possible
   - Proper foreign key constraints
   - Appropriate indexes
3. Consider:
   - Column types and nullability
   - Default values
   - Indexes for foreign keys and frequently queried columns
   - Cascading deletes when appropriate

After creating migration:

- Show the migration file
- Explain key decisions
- Warn about any irreversible operations
- Suggest running `php artisan migrate` to test
```

### Permission Patterns

#### Pattern 1: Bash Command Restrictions

Allow specific commands, ask for others:

```yaml
permission:
  bash:
    '*': ask # Ask for all commands by default
    'git status': allow # Always allow git status
    'git log*': allow # Allow all git log variations
    'git diff*': allow # Allow all git diff variations
    'npm test': allow # Allow running tests
```

#### Pattern 2: Complete Lockdown

Read-only agent:

```yaml
tools:
  write: false
  edit: false
  bash: false
permission:
  edit: deny
  bash: deny
```

#### Pattern 3: Safe Operations Only

Allow safe operations, restrict destructive ones:

```yaml
permission:
  bash:
    '*': deny # Deny all by default
    'git status': allow # Safe read operations
    'git log*': allow
    'git diff*': allow
    'composer test*': allow
    'npm test*': allow
    'php artisan route:list': allow
    'git push*': ask # Ask for pushes
    'rm *': deny # Never allow destructive ops
```

## Advanced: Subagent Invocation

### Commands that Invoke Subagents

Commands can trigger subagent invocations using `subtask: true`:

`.opencode/command/review.md`:

```markdown
---
description: Comprehensive code review
agent: code-reviewer
subtask: true
---

Review all recent changes:

!`git diff HEAD~1`

Analyze:

- Code quality
- Security issues
- Performance concerns
- Test coverage
```

When `subtask: true`:

- Creates a new isolated session
- Uses specified agent in subagent mode
- Doesn't pollute main conversation context
- Navigate with Leader+Left/Right

### Agent Task Permissions

Control which subagents can be invoked:

`.opencode/agent/orchestrator.md`:

```markdown
---
description: Orchestrates complex workflows
mode: primary
permission:
  task:
    '*': deny # Deny all subagents by default
    'orchestrator-*': allow # Allow orchestrator-prefixed agents
    'code-reviewer': ask # Ask before invoking reviewer
---

You orchestrate complex development workflows.
```

Rules evaluated in order, **last matching rule wins**.

## OpenCode Built-in Commands

OpenCode includes these built-in commands:

- `/init` - Initialize OpenCode for project
- `/undo` - Undo last changes
- `/redo` - Redo undone changes
- `/share` - Share conversation
- `/help` - Show help
- `/connect` - Configure providers

**Note:** Custom commands can override built-in commands.

## OpenCode Built-in Agents

### Primary Agents (Tab to switch)

**build** (default):

- Full development work
- All tools enabled
- Best for implementation

**plan**:

- Analysis and planning
- File edits and bash require approval
- Best for reviewing before implementation

### Subagents (@mention or auto-invoke)

**general**:

- General-purpose research and exploration
- Multi-step task execution
- Use for complex searches

**explore**:

- Fast codebase exploration
- Pattern matching
- Quick answers about code structure

## Integration with Project Patterns

### Laravel + React Project Commands

For a Laravel + React + Inertia.js project, consider these commands:

**Development:**

- `/test` - Run all tests with coverage
- `/test-filter TestName` - Run specific test
- `/test-browser Feature` - Create & run browser test
- `/dev` - Start development servers (Vite + Herd)

**Quality:**

- `/quality` - Run all quality checks
- `/fix-style` - Run Pint auto-formatter
- `/analyze` - Run PHPStan analysis
- `/check-types` - Check TypeScript types

**Code Generation:**

- `/action ActionName` - Create Action class
- `/component ComponentName` - Create React component
- `/migration TableName` - Create migration
- `/endpoint ResourceName` - Create full API endpoint

**Build:**

- `/build` - Build production assets
- `/fresh` - Fresh database with seeders

### Agent Specialization Ideas

**Backend specialists:**

- `@migration-builder` - Database migrations
- `@api-designer` - Complete API endpoints
- `@action-creator` - Action class generator

**Frontend specialists:**

- `@component-builder` - React components
- `@layout-designer` - Layout components
- `@form-builder` - React Hook Form + Zod

**Quality specialists:**

- `@test-fixer` - Fix failing tests
- `@quality-auditor` - Run all quality checks
- `@security-auditor` - Security review

**Documentation:**

- `@docs-writer` - Technical documentation
- `@readme-generator` - README files
- `@api-documenter` - API documentation

## Examples

### Example 1: Testing Command

`.opencode/command/test.md`:

```markdown
---
description: Run all tests with coverage report
agent: build
model: anthropic/claude-sonnet-4-20250514
---

Run the full test suite with coverage:

!`composer test -- --coverage`

Analyze the results:

1. If all tests pass and coverage ≥ 90%, report success
2. If tests fail, identify failures and suggest fixes
3. If coverage < 90%, identify untested code
```

### Example 2: Component Generation Command

`.opencode/command/component.md`:

```markdown
---
description: Create a new React component with TypeScript
agent: build
---

Create a React component named $ARGUMENTS with these requirements:

1. File location: resources/js/components/$ARGUMENTS.tsx
2. React 19 function component (no FC type)
3. TypeScript with full type annotations
4. Use `import type` for type imports
5. PropsWithChildren if it accepts children
6. Tailwind CSS v4 for styling
7. Include JSDoc comment explaining the component

Example structure:

- Props interface with proper types
- Clean component implementation
- Export at bottom

After creation:

- Show the complete file
- Provide usage example
- Suggest where to import it
```

Usage: `/component UserAvatar`

### Example 3: Quality Workflow Command

`.opencode/command/quality.md`:

```markdown
---
description: Run all quality checks and fix issues
agent: build
subtask: true
---

Execute the complete quality workflow:

**Step 1: Rector**
!`./vendor/bin/rector`
Fix any issues found, then re-run.

**Step 2: Pint**
!`./vendor/bin/pint`

**Step 3: PHPStan**
!`./vendor/bin/phpstan analyse`
Fix issues until clean.

**Step 4: Frontend**
!`npm run checks`
Fix any ESLint or TypeScript errors.

**Step 5: Tests**
!`composer test -- --coverage`

Report results:

- ✅ All checks passing
- ✅ Coverage: X%
- ✅ Type coverage: 100%
```

### Example 4: Code Review Agent

`.opencode/agent/code-reviewer.md`:

```markdown
---
description: Reviews code for quality, security, and best practices without making changes
mode: subagent
temperature: 0.1
tools:
  write: false
  edit: false
permission:
  edit: deny
  bash:
    'git diff*': allow
    'git log*': allow
    '*': deny
---

You are a senior code reviewer specializing in Laravel and React.

Review focus areas:

1. **Security**: SQL injection, XSS, authentication, authorization
2. **Type Safety**: Full type coverage, no `any` types
3. **Testing**: Adequate test coverage, test quality
4. **Performance**: N+1 queries, unnecessary re-renders
5. **Best Practices**: SOLID, DRY, project conventions

Feedback format:

## 🔴 Critical Issues

[Issues that must be fixed]

## 🟡 High Priority

[Important improvements]

## 🟢 Suggestions

[Nice-to-have improvements]

## ✅ Good Practices

[What's working well]

For each issue:

- File and line reference (file.php:123)
- Clear explanation
- Code example of the fix
```

### Example 5: Test Fixer Agent

`.opencode/agent/test-fixer.md`:

````markdown
---
description: Runs tests and fixes failures iteratively until all pass
mode: subagent
agent: build
subtask: true
temperature: 0.2
---

You are a test fixing specialist for Laravel + React applications.

Your workflow:

1. **Run Tests**
   ```bash
   composer test
   ```
````

2. **Analyze Results**
   - If all pass → Report success and exit
   - If failures → Continue to step 3

3. **Fix Failures**
   For each failing test:
   - Identify the test file and assertion
   - Analyze the failure reason
   - Determine root cause (code bug vs test bug)
   - Implement the fix
   - Explain the fix

4. **Re-run Tests**
   Run tests again and repeat from step 2

5. **Final Report**
   - Total tests fixed
   - Summary of changes
   - Current coverage metrics

Guidelines:

- Fix code bugs in source files
- Fix test bugs in test files
- Maintain 90%+ code coverage
- Ensure 100% type coverage
- Follow project conventions

````

## Anti-Patterns

### ❌ Don't Do This

**Vague command description:**
```markdown
---
description: Run tests
---
````

_Issue: Doesn't explain what tests or what analysis happens_

**Missing argument handling:**

```markdown
Create a component
```

_Issue: No way to specify which component to create_

**No error handling:**

```markdown
!`npm test`
Report if successful
```

_Issue: Doesn't handle failures_

**Wrong agent for task:**

```markdown
---
description: Code review
agent: build
tools:
  write: true
---
```

_Issue: Review shouldn't have write access_

**Overly complex single command:**

```markdown
Run tests, fix them, run quality checks, build assets, and deploy
```

_Issue: Too many concerns in one command_

### ✅ Do This Instead

**Clear command description:**

```markdown
---
description: Run all tests with coverage and suggest fixes for failures
---
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

**Appropriate agent for task:**

```markdown
---
description: Code review
agent: code-reviewer
mode: subagent
tools:
  write: false
  edit: false
---
```

**Focused single-purpose command:**

```markdown
# Separate commands:

/test # Just run tests
/quality # Just quality checks
/build # Just build assets
/deploy # Just deployment
```

## Quality Standards

### Command Quality Checklist

- [ ] Clear, descriptive `description` field
- [ ] Appropriate agent selected (or defaults to current)
- [ ] Arguments handled with `$ARGUMENTS` or `$1`, `$2`, etc.
- [ ] Shell commands use `` !`command` `` syntax correctly
- [ ] Error cases are handled in prompt
- [ ] File references use `@filename` syntax
- [ ] Command tested and works as expected
- [ ] Documentation explains usage with examples

### Agent Quality Checklist

- [ ] Clear `description` with "when to use it" guidance
- [ ] Appropriate `mode` (primary, subagent, or all)
- [ ] System prompt defines role and behavior clearly
- [ ] Tool restrictions appropriate for agent purpose
- [ ] Permissions configured for safety
- [ ] Temperature set appropriately for task type
- [ ] Agent tested with various inputs
- [ ] Documentation explains purpose and usage

### Best Practices

**Commands:**

- Keep commands focused on a single workflow
- Use descriptive names that match user intent
- Include error handling in prompt instructions
- Test with various argument patterns
- Document expected usage in AGENTS.md

**Agents:**

- Write clear system prompts that define role
- Restrict tools appropriately (read-only for review)
- Use lower temperature for analytical tasks
- Use higher temperature for creative tasks
- Test agent behavior across different scenarios

**Integration:**

- Reference existing skills when applicable
- Follow project structure conventions
- Align with existing quality standards
- Document in AGENTS.md for discoverability
- Test workflows end-to-end

## Summary

Creating effective agentic commands requires:

1. **Clear purpose** - Commands and agents solve specific problems
2. **Appropriate automation** - Choose command vs agent based on need
3. **Proper configuration** - Use correct agent, model, tools, permissions
4. **Robust prompts** - Handle success and failure cases
5. **Safety controls** - Restrict tools and permissions appropriately
6. **User experience** - Clear descriptions, helpful feedback
7. **Testing** - Verify commands work as expected
8. **Documentation** - Record in AGENTS.md for team awareness

The most effective automation:

- Solves real workflow pain points
- Matches how users naturally phrase requests
- Provides helpful feedback and error handling
- Integrates with existing project patterns
- Maintains safety and quality standards
