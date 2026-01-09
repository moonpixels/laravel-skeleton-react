---
name: creating-agentic-commands
description: Creating custom slash commands to automate repetitive workflows and shortcuts. Use when creating commands, adding shortcuts, automating workflows, or when user mentions creating commands, slash commands, /command, workflow automation, or custom commands.
---

# Creating Agentic Commands

## When to Use This Skill

Use this skill when:

- User requests "create a command for X"
- Automating repetitive workflows (testing, deployment, reviews)
- Creating team shortcuts for common operations
- Converting repeated prompts into reusable shortcuts
- Need explicit triggering vs automatic skill activation
- User mentions "/command", "slash command", "workflow automation"
- Building discoverable shortcuts with autocomplete

## Understanding Why Commands Exist

Slash commands solve a specific problem: **repeatability without context loss**. When you type a conversational request, the agent interprets your intent each time, potentially varying its approach. Commands encode intent into reusable templates with consistent behavior, argument handling, and tool restrictions.

### The Core Problem

**Without commands:**

- Each request gets interpreted fresh
- Approach may vary between invocations
- No guarantee of consistency
- Hard to share exact workflows

**With commands:**

- Explicit `/command` trigger
- Consistent behavior every time
- Parameterized for flexibility
- Discoverable through autocomplete
- Team-shareable workflows

### Key Differences from Conversation

| Aspect         | Conversation              | Commands                       |
| -------------- | ------------------------- | ------------------------------ |
| **Triggering** | Implicit interpretation   | Explicit `/command` invocation |
| **Behavior**   | Varies by interpretation  | Consistent from template       |
| **Parameters** | Conversational extraction | Structured `$ARGUMENTS`        |
| **Discovery**  | Not listed                | Autocomplete surfaces          |
| **Sharing**    | Hard to replicate exactly | Version controlled templates   |

### When Commands Are Better

**Use commands for:**

- Repeated workflows (run tests, deploy, review code)
- Multi-step processes with checkpoints
- Team-standardized operations
- Operations requiring specific tool restrictions
- Workflows you want to optimize over time

**Use conversation for:**

- Exploratory questions
- One-off requests
- Tasks requiring clarification
- Novel problems

## Commands vs Skills vs Agents

Understanding when to use each primitive prevents overengineering:

| Primitive     | Trigger                  | Purpose                   | Context                  |
| ------------- | ------------------------ | ------------------------- | ------------------------ |
| **Commands**  | Explicit `/command`      | Repeatable shortcuts      | Shared with conversation |
| **Skills**    | Auto-detected            | Domain expertise          | Injected when relevant   |
| **Agents**    | Delegation or `@mention` | Parallel workers          | Isolated context window  |
| **AGENTS.md** | Always active            | Project conventions       | Always loaded            |
| **Hooks**     | Lifecycle events         | Deterministic enforcement | Pre/post tool execution  |

### The Decision Framework

**Use commands when:**

- "I want a button to run code review"
- "I need a shortcut for deploying"
- "I repeat this workflow daily"
- User must explicitly invoke the operation

**Use skills when:**

- "Always check docs when writing database code"
- "Load testing patterns automatically in test files"
- "Inject conventions when creating Actions"
- Context should load automatically when relevant

**Use agents when:**

- Parallel execution needed
- Work requires isolated context
- Task is completely independent
- "Research this while I work on that"

**Use AGENTS.md when:**

- Conventions apply to ALL work
- Always-true project standards
- Architecture decisions
- Code style preferences

**Use hooks when:**

- Mandatory validation gates
- "Always run linter before commit"
- "Format on save"
- Deterministic enforcement needed

### Decision Examples

```
❌ Wrong: Create a command that auto-loads when writing Actions
✅ Right: Create a skill that auto-loads when writing Actions

❌ Wrong: Create a skill the user must manually invoke
✅ Right: Create a command the user manually invokes

✅ Command: "/fix-issue [number]" - explicit workflow trigger
✅ Skill: Automatically load testing patterns when in test files
✅ Agent: "@test-fixer fix these 20 failing tests" - isolated work
✅ AGENTS.md: "Always use TypeScript strict mode"
✅ Hook: Run Prettier after every file write
```

## File Structure

### Command File Locations

**Project commands:**

```
.opencode/command/{name}.md
```

**Global commands:**

```
~/.config/opencode/command/{name}.md
```

Commands are markdown files with YAML frontmatter. The filename (minus `.md`) becomes the command name.

### Namespace Organization

Organize commands in subdirectories for discoverability:

```
.opencode/command/
├── dev/
│   ├── code-review.md      → /code-review (project:dev)
│   ├── refactor.md
│   └── debug.md
├── test/
│   ├── run-tests.md
│   └── coverage.md
├── deploy/
│   ├── release.md
│   └── hotfix.md
└── docs/
    └── api-docs.md
```

The subdirectory appears in help as `(project:namespace)`.

### Naming Conventions

**Best practices:**

- Use verb-noun pattern: `create-feature`, `run-tests`, `fix-issue`
- Hyphenate multi-word names: `fix-github-issue` not `fixGithubIssue`
- Keep to 2-4 words for quick typing
- Filename (minus `.md`) becomes command name

**Examples:**

```
✅ create-action.md        → /create-action
✅ run-tests.md            → /run-tests
✅ fix-github-issue.md     → /fix-github-issue
✅ security-review.md      → /security-review

❌ action.md               → Too vague
❌ createAction.md         → Wrong case
❌ create_action.md        → Use hyphens
```

## Core Conventions

### YAML Frontmatter Structure

Every command starts with YAML frontmatter between `---` markers.

```yaml
---
description: Brief description shown in autocomplete
agent: build # Target specific agent (optional)
subtask: true # Force subagent isolation (optional)
model: provider/model-name # Override default model (optional)
---
```

**Required fields:**

- `description` - Brief description shown in autocomplete

**Optional fields:**

- `agent` - Target specific agent for execution
- `subtask` - Force isolated subagent execution
- `model` - Override default model for this command

### Template Anatomy

The template is the content below the frontmatter. Structure matters for clarity.

**Effective template structure:**

```markdown
---
description: Run tests with coverage
---

## Context

- Current test results: !`npm test`
- Recent changes: !`git diff HEAD --stat`

## Your task

1. Analyze test failures
2. For each failure:
   - Identify root cause
   - Implement fix
   - Verify fix works
3. IF any test still fails, STOP and report

## Success criteria

- All tests pass
- No breaking changes introduced
- Coverage remains above 90%
```

**Why structure matters:**

- **Headers** (`## Context`, `## Your task`) help parse sections clearly
- **Numbered steps** provide explicit sequencing
- **Markdown formatting** (lists, bold, code) improves clarity
- **Explicit checkpoints** prevent overreach ("STOP and report")

### Bad vs Good Templates

**❌ Bad - Vague and unstructured:**

```markdown
---
description: Run tests
---

Run tests and fix issues. Make it work.
```

Problems:

- No context provided
- No clear steps
- No success criteria
- Vague instructions
- No checkpoints

**✅ Good - Clear structure and steps:**

```markdown
---
description: Run tests with coverage report
---

## Context

Current test results:
!`npm test -- --coverage`

## Your task

1. Review the test output above
2. For each failing test:
   - Read the test file
   - Identify the root cause
   - Implement a fix
   - Run the specific test to verify
3. IF any test still fails after 3 attempts, STOP and report:
   - Test name
   - Error message
   - Attempted fixes
4. After all tests pass, verify coverage meets 90% minimum

## Success criteria

- All tests pass
- Coverage ≥ 90%
- No console warnings
```

Benefits:

- Context provided via shell injection
- Clear numbered steps
- Explicit checkpoint (STOP after 3 attempts)
- Specific commands to run
- Measurable success criteria

### Model Configuration

**When to specify a model:**

```yaml
model: provider/model-name
```

**Use cases for model override:**

- Complex reasoning tasks requiring stronger models
- Speed-critical operations needing faster models
- Specific capabilities (code generation, analysis, etc.)
- Cost optimization for simple commands

**Default behavior:**

- Commands use your configured default model
- Override only when specific model characteristics needed
- Consider available models in your setup

### Discoverability

**The `description` field is critical for autocomplete:**

```yaml
description: Run tests with coverage report
```

**Description best practices:**

1. **Start with action verb**

   ```yaml
   ✅ description: Run tests with coverage
   ✅ description: Fix GitHub issue with tests
   ✅ description: Deploy to production environment
   ❌ description: Tests and coverage
   ```

2. **Be specific but concise (2-8 words ideal)**

   ```yaml
   ✅ description: Run security vulnerability scan
   ✅ description: Prepare release with validation
   ❌ description: A command that does various testing things
   ```

3. **Describe WHAT, not HOW**

   ```yaml
   ✅ description: Create feature branch from issue
   ❌ description: Uses git to checkout a new branch
   ```

4. **Enable quick recognition**
   ```yaml
   ✅ description: Review PR for security issues
   ✅ description: Generate API documentation
   ```

**Why this matters:**

- Users discover commands through autocomplete
- Clear descriptions enable quick selection
- Good descriptions reduce need for memorization
- Team members can find relevant commands easily

## Writing Model-Agnostic Commands

Commands should work across different LLM providers and models.

### Principles for Model-Agnostic Templates

**1. Use clear, explicit instructions**

Don't rely on provider-specific behaviors or capabilities:

```markdown
❌ Model-specific assumptions:
"Think carefully before responding"
"Use your advanced reasoning"

✅ Universal instructions:
"Analyze all test failures before suggesting fixes"
"List pros and cons for each approach"
```

**2. Structure for universal parsing**

```markdown
## Section headers help parse content clearly

1. Numbered steps work universally
2. Each step builds on previous
3. Clear sequencing

- Markdown lists improve clarity
- Bullet points for related items
- **Bold** for emphasis
```

**3. Provide examples in instructions**

Examples work across all models:

```markdown
Generate commit message following this format:

- feat: Add new authentication system
- fix: Resolve login redirect bug
- refactor: Improve database query performance
- docs: Update API documentation

Your message should be: <type>: <description>
```

**4. Use universal checkpoints**

```markdown
✅ Universal checkpoints:

- IF tests fail, STOP and report details
- IF conflicts detected, STOP and ask for guidance
- STOP after 3 attempts if issue persists

❌ Model-specific:

- "Think deeply about this"
- "Use chain-of-thought reasoning"
```

**5. Be explicit about sequencing**

```markdown
✅ Clear sequence:

1. First, read all related files
2. Then, analyze the issue
3. Next, propose a solution
4. Finally, implement the fix

❌ Vague sequence:
Analyze the issue and fix it.
```

### Testing Across Models

**Best practices:**

- Test commands with available models
- Ensure instructions work regardless of provider
- Adjust wording if specific models struggle
- Keep templates clear and structured

**If a command fails with certain models:**

- Add more explicit instructions
- Break down complex steps
- Provide more examples
- Use simpler language

### When to Use Model Override

**Consider overriding the default model when:**

- Command requires specific capabilities
- Default model insufficient for task complexity
- Speed vs accuracy tradeoffs matter
- Cost optimization is important

**Example scenarios:**

```yaml
# Complex analysis requiring strong reasoning
---
model: anthropic/claude-sonnet-4
---
# Simple formatting tasks
---
model: anthropic/claude-haiku
---
# Code generation tasks
---
model: openai/gpt-4o
---
```

## Parameter Patterns

Commands support several parameter types for flexibility.

### Arguments - $ARGUMENTS

**All arguments together:**

```yaml
---
description: Create new component
---
Create a React component named $ARGUMENTS.
Include TypeScript types and proper structure.
```

Usage: `/create-component UserProfile`
Result: `$ARGUMENTS` = "UserProfile"

### Positional Parameters

**Individual arguments:**

- `$1` - First argument
- `$2` - Second argument
- `$3` - Third argument
- And so on...

**Example:**

```yaml
---
description: Review PR with priority
---

Review PR #$1 with priority $2 and assign to $3.

1. Fetch PR details: !`gh pr view $1`
2. Focus on security and performance
3. Priority level: $2
4. Tag @$3 for review
```

Usage: `/review-pr 456 high alice`

Result:

- `$1` = "456"
- `$2` = "high"
- `$3` = "alice"

### Shell Output Injection

**Execute commands and inject output:**

```markdown
!`command`
```

**Syntax:**

- Prefix with `!`
- Wrap command in backticks
- Command executes before template runs
- Output replaces the injection

**Examples:**

```yaml
---
description: Analyze test coverage
---

## Current test results
!`npm test -- --coverage`

## Your task
Based on the test results above, identify:
1. Files with low coverage
2. Untested code paths
3. Suggested tests to write
```

```yaml
---
description: Review recent changes
---

## Recent commits
!`git log --oneline -10`

## Changed files
!`git diff HEAD~5 --stat`

## Your task
Review these changes for:
- Breaking changes
- Security implications
- Documentation needs
```

**Common shell injections:**

```markdown
!`git status` # Current git state
!`git diff HEAD` # Uncommitted changes
!`npm test` # Test results
!`git log --oneline -10` # Recent commits
!`git branch --show-current` # Current branch
```

### File References

**Include file contents:**

```markdown
@path/to/file.ts
```

**Examples:**

```yaml
---
description: Review component
---

Review the component in @src/components/Button.tsx.

Check for:
- Performance issues
- Accessibility problems
- Type safety
- Best practices
```

```yaml
---
description: Refactor with pattern
---

Refactor @src/services/api.ts to follow the pattern in @src/services/auth.ts.

Maintain the same:
- Error handling approach
- Type definitions
- Documentation style
```

## Examples

### Example 1: GitHub Issue Workflow

```yaml
---
description: Fix GitHub issue following conventions
---

Fix GitHub issue #$ARGUMENTS.

## Context
Issue details:
!`gh issue view $ARGUMENTS`

## Your task

1. **Understand the issue**
   - Read the issue description above
   - Review any linked PRs or discussions
   - Identify affected files

2. **Search codebase**
   - Use grep and glob to find relevant files
   - Read related code
   - Understand current implementation

3. **Implement fix**
   - Make necessary changes following project standards
   - Ensure code is properly typed
   - Add/update tests

4. **Validate**
   - Run tests: `npm test`
   - Run linting: `npm run lint`
   - IF any checks fail, STOP and report

5. **Create PR**
   - Create descriptive commit: `fix: resolve issue #$ARGUMENTS - <description>`
   - Push changes
   - Create PR linking to issue
   - Request review

## Success criteria
- Issue requirements met
- All tests pass
- Code follows project standards
- PR created and linked to issue
```

### Example 2: Security Vulnerability Scan

```yaml
---
description: Scan codebase for security vulnerabilities
---

Analyze the codebase for security vulnerabilities.

## Your task

### 1. Authentication & Authorization
Search for potential issues:
- Unchecked access controls
- Missing token validation
- Weak password policies
- Session management problems

Files to check:
- Authentication logic
- Authorization middleware
- API endpoints
- User management

### 2. Input Validation
Identify injection points:
- SQL injection risks
- XSS vulnerabilities
- Command injection
- Path traversal

Check:
- User input handling
- Database queries
- File operations
- Shell command execution

### 3. Data Protection
Review security practices:
- Exposed credentials or API keys
- Unencrypted sensitive data
- Insecure communication
- Logging sensitive information

Look for:
- Environment variables
- Configuration files
- Database connections
- API integrations

## Output format

Provide a markdown report:

# Security Scan Results

## Critical Issues (Immediate action required)
- [Issue description]
- Location: [file:line]
- Fix: [suggestion]

## High Priority (Address soon)
- [Issue description]
- Location: [file:line]
- Fix: [suggestion]

## Medium Priority (Plan to address)
- [Issue description]
- Location: [file:line]
- Fix: [suggestion]

## Low Priority (Nice to have)
- [Issue description]
- Location: [file:line]
- Fix: [suggestion]

## Summary
- Total issues found: X
- Critical: X
- High: X
- Medium: X
- Low: X
```

### Example 3: Release Preparation

```yaml
---
description: Prepare and validate release
---

Prepare release: $1 version bump

## Pre-flight checks

1. **Run tests**
   Execute: !`npm test`
   IF any failures, STOP and report

2. **Run linting**
   Execute: !`npm run lint`
   IF any errors, STOP and report

3. **Check for uncommitted changes**
   Execute: !`git status --porcelain`
   IF any uncommitted changes, STOP and report

## Version bump

4. **Update version**
   - Read current version from package.json
   - Calculate new version based on $1:
     - patch: increment patch number (1.2.3 → 1.2.4)
     - minor: increment minor, reset patch (1.2.3 → 1.3.0)
     - major: increment major, reset minor and patch (1.2.3 → 2.0.0)
   - Update package.json with new version

5. **Update CHANGELOG.md**
   - Get commits since last tag: !`git log $(git describe --tags --abbrev=0)..HEAD --oneline`
   - Add new version section
   - Group changes by type (feat, fix, refactor, etc.)
   - Add date

## Build and validate

6. **Run production build**
   Execute: `npm run build`
   IF build fails, STOP and report

7. **Verify bundle size**
   - Check build output sizes
   - Compare to previous version
   - IF size increased significantly (>20%), note in summary

## Release

8. **Create git tag**
   - Tag format: `v{version}`
   - Example: `v1.2.4`
   - Add release notes from CHANGELOG

9. **Push changes**
   - Push commits: `git push`
   - Push tags: `git push --tags`

10. **Report summary**
    Provide:
    - Version number
    - Key changes
    - Breaking changes (if any)
    - Migration notes (if needed)

## Success criteria
- All tests pass
- Version updated correctly
- CHANGELOG updated
- Build succeeds
- Tag created and pushed
```

### Example 4: Multi-Agent Research

```yaml
---
description: Research problem using parallel subagents
agent: general
subtask: true
---

# Research: $ARGUMENTS

Launch parallel subagents for comprehensive research.

## Subagent 1: Web Documentation
**Task:** Search official documentation and resources

1. Search for relevant official docs
2. Find best practices and patterns
3. Identify version-specific considerations
4. Note common pitfalls and solutions

**Deliverable:** Summary of official recommendations

## Subagent 2: Codebase Analysis
**Task:** Analyze existing codebase patterns

1. Search for similar patterns in current code
2. Identify integration points
3. Note existing implementations to build on
4. Review related architecture decisions

**Deliverable:** List of relevant files and patterns

## Subagent 3: Implementation Planning
**Task:** Draft implementation approach

1. Based on research above, propose approach
2. List required changes:
   - Files to create
   - Files to modify
   - New dependencies needed
3. Identify potential risks and edge cases
4. Estimate complexity and time

**Deliverable:** Step-by-step implementation plan

## Final synthesis

Combine all findings into:

1. **Summary**
   - Key learnings from research
   - Recommended approach
   - Critical considerations

2. **Implementation Plan**
   - Specific steps to take
   - Files to modify/create
   - Testing strategy

3. **Risks and Mitigations**
   - Potential issues
   - How to address them

4. **Next Steps**
   - Immediate actions
   - Follow-up items
```

## The Developer Workflow Pattern

**Where commands fit in your development workflow:**

### The Recommended Pattern

```
1. Explore → 2. Plan → 3. Code → 4. Commit
```

### How Commands Integrate

**1. Exploration Phase**

Before implementing, understand the context:

```markdown
## Your task

Before making changes:

1. Read relevant files:
   - @src/auth/login.ts
   - @src/middleware/auth.ts

2. Search for similar patterns:
   - Use grep to find related implementations
   - Review existing tests

3. Understand architecture:
   - Review AGENTS.md for conventions
   - Note integration points
```

**2. Planning Phase**

Create an implementation plan:

```markdown
## Your task

Create an implementation plan:

1. List files to modify:
   - [file name] - [what to change]

2. List files to create:
   - [file name] - [purpose]

3. Identify potential risks:
   - [risk] - [mitigation]

4. Note dependencies to test:
   - [dependency] - [test approach]

Present the plan and wait for approval before coding.
```

**3. Coding Phase**

Implement the solution:

```markdown
## Your task

Implement the solution:

1. Make changes following project conventions
2. Ensure type safety throughout
3. Add comprehensive tests
4. Update documentation if needed

Follow patterns from existing code.
```

**4. Commit Phase**

Finalize and commit:

```markdown
## Your task

Finalize the changes:

1. Run tests: !`npm test`
   IF failures, STOP and fix

2. Run quality checks: !`npm run lint`
   IF errors, STOP and fix

3. Create descriptive commit message
4. Push changes and create PR
```

### Commands Work WITH Conversation

**Don't replace conversation:**

- Commands provide structure for complex workflows
- Use conversation for exploration and clarification
- Commands for final execution with consistency
- Mix both based on task needs

**Example workflow:**

```
User: "I need to add authentication to the settings page"
Agent: [Conversational exploration of requirements]

User: "/implement-auth settings"
Agent: [Command executes structured implementation]

User: "Actually, also add role-based permissions"
Agent: [Conversational adjustment to implementation]

User: "/test"
Agent: [Command runs structured test suite]
```

### Context Management

**Commands share conversation context:**

- Commands inherit the conversation context window
- Previous messages inform command execution
- Context accumulates over time

**Clean context between workflows:**

```
User: "/fix-issue 123"
Agent: [Completes issue fix]

User: "/compact"
Agent: [Cleans up context]

User: "/security-review"
Agent: [Fresh context for new workflow]
```

**Best practices:**

- Use `/compact` between unrelated command invocations
- Clean context prevents confusion across workflows
- Don't assume commands start with clean slate

## Agent Integration

### Agent Targeting

**Specify which agent executes the command:**

```yaml
---
description: Run quality checks
agent: quality-auditor
---
```

**Common agent types:**

- `plan` - Planning and strategy
- `build` - Implementation and coding
- `explore` - Research and discovery
- `general` - General-purpose tasks

**When to specify an agent:**

- Command aligns with agent's expertise
- Specific agent mode needed
- Different agent than current conversation

### Subtask Mode

**Force isolated subagent execution:**

```yaml
---
description: Analyze codebase structure
agent: explore
subtask: true
---
```

**What `subtask: true` does:**

- Forces isolated subagent execution
- Doesn't pollute primary context window
- Creates clean separation of concerns
- Useful for parallel work

**When to use subtask mode:**

- Long-running operations
- Independent workflows
- Parallel research tasks
- Isolated analysis

**Example:**

```yaml
---
description: Research multiple solutions
agent: general
subtask: true
---

Research these approaches in parallel:
1. Solution A using library X
2. Solution B using library Y
3. Solution C using custom implementation

For each, analyze:
- Pros and cons
- Implementation complexity
- Maintenance burden
- Performance characteristics

Present comparison matrix.
```

### Agent Delegation in Template

**Delegate to specific agents within command:**

```markdown
## Your task

1. Run tests
2. IF tests fail, use @test-fixer agent to fix them
3. Report results
```

**Benefits:**

- Command orchestrates multiple agents
- Each agent handles its specialty
- Clear separation of responsibilities

## Best Practices

### Command Creation Checklist

Before creating a command, verify:

1. ✓ **Clear, specific instructions** that work across models
2. ✓ **Frontmatter metadata** (description, agent, etc.)
3. ✓ **Parameter flexibility** ($ARGUMENTS or positional)
4. ✓ **Numbered steps** for explicit sequencing
5. ✓ **Explicit checkpoints** ("IF X fails, STOP")
6. ✓ **Single responsibility** per command
7. ✓ **Version control** commands for team sharing
8. ✓ **Template under** reasonable character limits
9. ✓ **Success criteria** clearly defined
10. ✓ **Model-agnostic** instructions

### Character Budget Considerations

**Keep templates reasonably sized:**

- Very long templates may hit tool limits
- Break complex workflows into multiple commands
- Use file references instead of inline documentation
- Link to detailed docs in references/ if needed

**Example - Too long:**

```yaml
---
description: Complete CI/CD pipeline
---
[200 lines of detailed instructions]
```

**Better - Composable:**

```yaml
# run-tests.md
---
description: Run test suite
---
[Focused on testing]
# build-production.md
---
description: Build for production
---
[Focused on building]
# deploy.md
---
description: Deploy to environment
---
[Focused on deployment]
```

### Composability

**Design commands to work together:**

```yaml
# check-quality.md
Run linting and type checking

# run-tests.md
Run test suite

# prepare-commit.md
Run quality checks, tests, then commit
Steps:
1. Run /check-quality
2. Run /run-tests
3. IF all pass, create commit
```

**Benefits:**

- Reusable components
- Easier maintenance
- Team can combine as needed
- Reduces duplication

### Context Awareness

**Commands inherit conversation context:**

```markdown
# This command sees previous conversation

---

## description: Continue implementation

Based on our discussion above, implement the planned changes.
```

**Implications:**

- Don't repeat information from conversation
- Reference previous context naturally
- Clean context when starting new workflows
- Use `/compact` strategically

### Naming and Organization

**Effective naming:**

```
✅ create-component      # Clear action + target
✅ run-security-scan     # Explicit about what it does
✅ fix-github-issue      # Platform + action clear

❌ do-stuff              # Vague
❌ helper                # Unclear purpose
❌ command1              # Not descriptive
```

**Organize by domain:**

```
.opencode/command/
├── dev/              # Development workflow
├── test/             # Testing commands
├── deploy/           # Deployment commands
└── review/           # Code review commands
```

### Version Control

**Treat commands as code:**

- Commit to version control
- Review changes in PRs
- Document in changelog
- Share with team

**Good commit messages:**

```
feat(commands): add security scan command
fix(commands): improve test error reporting
docs(commands): update release command with checks
```

## Anti-Patterns

### The Magic Command Proliferation Problem

> "If you have a long list of complex, custom slash commands, you've created an anti-pattern. The entire point of an agent is that you can type almost whatever you want and get a useful result."

**Keep commands as simple shortcuts**, not replacements for intuitive AGENTS.md instructions.

**Warning signs:**

- More than 20-30 commands in a project
- Commands replicating conversation functionality
- Complex commands trying to handle every edge case
- Team members confused about which command to use

**Solution:**

- Keep 5-10 core commands
- Use skills for auto-loading context
- Use AGENTS.md for always-true conventions
- Let conversation handle novel requests

### Don't Do This

**❌ Monolithic commands:**

```yaml
---
description: Do everything for a feature
---
Build feature, write tests, run checks, deploy, document, create PR, notify team, update docs, send email...

[200 lines of instructions trying to handle everything]
```

**❌ Blocking agents mid-plan:**

```yaml
---
description: Write file with validation
---
Write the file.
Run linter.
IF linter fails, STOP and revert all changes.
```

This blocks natural planning and prevents recovering from minor issues.

**❌ Overly specific searches:**

```yaml
---
description: Find auth files
---
Search for files named Auth* in src/app/auth/ and src/middleware/ but not in tests/ unless they're integration tests...
```

Too prescriptive - let the agent explore.

**❌ Magic command instead of skill:**

```yaml
---
description: Always validate Actions
---
Every time an Action is created, check it follows patterns...
```

This should be a skill that auto-loads, not a command to manually invoke.

**❌ No error handling:**

```yaml
---
description: Deploy to production
---
Build the app.
Deploy to server.
Done.
```

No checkpoints, no validation, no failure handling.

### Do This Instead

**✅ Focused commands:**

```yaml
---
description: Run quality checks
---

Run all quality checks:
1. Linting
2. Type checking
3. Tests
4. Coverage

Report any failures.
```

**✅ Validate at commit time:**
Use hooks for mandatory validation, not commands that block mid-work.

**✅ General guidance:**

```yaml
---
description: Find authentication implementation
---
Find files related to authentication.
Review the implementation patterns used.
```

Let the agent explore appropriately.

**✅ Use skills for auto-loading:**
Commands for explicit invocation, skills for automatic context injection.

**✅ Error handling with recovery:**

```yaml
---
description: Deploy with validation
---

## Pre-deploy checks
1. Run tests - IF fail, STOP
2. Run build - IF fail, STOP
3. Check environment - IF issues, STOP

## Deploy
4. Deploy to staging
5. Run smoke tests
6. IF smoke tests pass:
   - Deploy to production
7. IF smoke tests fail:
   - Rollback staging
   - STOP and report

## Post-deploy
8. Verify production health
9. Monitor for 5 minutes
10. Report deployment status
```

### Additional Anti-Patterns

**Ignoring context management:**

- Not using `/compact` between unrelated tasks
- Assuming clean context for every command
- Letting context window fill with irrelevant history

**Skipping planning steps:**

- Jumping straight to implementation
- Not reading related files first
- Missing architectural context

**Poor composability:**

- Commands that can't be chained
- Duplicate logic across commands
- No reusable building blocks

## Configuration Approaches

### Approach 1: Markdown Files (Recommended)

Create individual `.md` files in the command directory:

**Structure:**

```
.opencode/command/test.md
```

**Example:**

```yaml
---
description: Run tests with coverage
agent: build
---

## Context
Current test results:
!`npm test -- --coverage`

## Your task
Review results and fix any failures.
```

**Advantages:**

- Easy to read and edit
- Better version control diffs
- Syntax highlighting in editors
- Portable across tools
- Can include comments
- One command per file (clear organization)

### Approach 2: JSON Configuration

Define commands in `opencode.json`:

```json
{
  "command": {
    "test": {
      "template": "Run the full test suite with coverage report.\nFocus on failing tests and suggest fixes.",
      "description": "Run tests with coverage",
      "agent": "build"
    },
    "deploy": {
      "template": "Deploy to production:\n1. Run checks\n2. Build\n3. Deploy",
      "description": "Deploy to production",
      "agent": "build",
      "subtask": true
    }
  }
}
```

**Advantages:**

- All commands in one file
- Programmatic generation possible
- Easy to see all commands at once

**Disadvantages:**

- Harder to read long templates
- JSON escaping required for newlines
- Worse version control diffs
- No syntax highlighting for templates

**Recommendation:** Use markdown files for better maintainability.

## Hooks Integration

**Commands are optional. Hooks enforce mandatory behavior.**

Hooks run at lifecycle events (pre/post tool use):

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash(git commit:*)",
        "hooks": [
          {
            "type": "command",
            "command": "npm test --silent || exit 2"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "prettier --write \"$FILE_PATH\""
          }
        ]
      }
    ]
  }
}
```

**Key insight:** Block at commit time, not write time.

**When to use hooks vs commands:**

- **Hooks**: Mandatory enforcement (linting, testing gates)
- **Commands**: Optional workflows (code review, deployment)

**Example - Good hook usage:**

```json
// Enforce tests pass before commit
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash(git commit:*)",
        "hooks": [
          {
            "type": "command",
            "command": "npm test || (echo 'Tests must pass' && exit 2)"
          }
        ]
      }
    ]
  }
}
```

Let the agent complete its work, then validate at commit.

## Testing Your Commands

### Testing Before Sharing

**Test commands thoroughly:**

1. **Run with expected arguments**

   ```
   /your-command arg1 arg2
   ```

   Verify behavior matches expectations

2. **Test edge cases**

   ```
   /your-command                # No arguments
   /your-command too many args  # Too many arguments
   /your-command ""             # Empty argument
   ```

3. **Test with different models (if available)**
   - Verify instructions are clear enough
   - Check that templates work universally
   - Adjust wording if specific models struggle

4. **Test shell injections**
   - Ensure commands execute correctly
   - Verify output is as expected
   - Check for errors in edge cases

5. **Test file references**
   - Confirm files load correctly
   - Check paths are valid
   - Verify content is included

### Iterating on Templates

**Common issues and fixes:**

**Issue:** Command doesn't follow instructions precisely

**Fix:** Add more explicit steps and checkpoints

```yaml
# Before
Review the code and fix issues.

# After
1. Read all files in the module
2. For each file, check:
   - Type safety
   - Error handling
   - Test coverage
3. For each issue found:
   - Document the issue
   - Implement fix
   - Verify fix works
4. STOP after all issues addressed
```

**Issue:** Command produces inconsistent results

**Fix:** Add examples and success criteria

```yaml
## Expected output format

Use this structure:
  # Summary
  - Issue: [description]
  - Files affected: [list]
  - Fix applied: [description]

  ## Success criteria
  - All issues documented
  - All fixes implemented
  - Tests pass
```

**Issue:** Command goes off track

**Fix:** Add explicit checkpoints

```yaml
1. Analyze the issue
2. STOP and present analysis before proceeding
3. After approval, implement fix
4. STOP and verify before committing
```

### Debugging Failed Commands

**When commands don't work:**

1. **Check frontmatter syntax**
   - YAML properly formatted?
   - All required fields present?
   - Quotes escaped correctly?

2. **Verify shell commands**
   - Do shell injections execute?
   - Are paths correct?
   - Do commands have permission?

3. **Test file references**
   - Do files exist?
   - Are paths relative to project root?
   - Can agent read the files?

4. **Review template clarity**
   - Are instructions explicit enough?
   - Are steps numbered?
   - Are checkpoints clear?

## Sharing Commands with Your Team

### Version Control Practices

**Commit commands to version control:**

```bash
git add .opencode/command/
git commit -m "feat(commands): add deployment workflow"
```

**Use conventional commits:**

```
feat(commands): add new security scan command
fix(commands): improve error handling in test command
docs(commands): clarify release preparation steps
refactor(commands): simplify deployment process
```

**Review in pull requests:**

- Treat command changes like code changes
- Review template clarity
- Verify parameter handling
- Test before merging

### Documentation Standards

**Document your commands:**

Create `.opencode/command/README.md`:

```markdown
# Project Commands

## Development Commands

### /create-component [name]

Creates a new React component with TypeScript.

Usage: `/create-component UserProfile`

### /run-tests

Runs full test suite with coverage report.

Usage: `/run-tests`

## Deployment Commands

### /deploy [environment]

Deploys to specified environment.

Usage: `/deploy staging`
```

**Include in project docs:**

- List available commands
- Document common workflows
- Provide usage examples
- Note any prerequisites

### Team Conventions

**Establish command standards:**

1. **Naming convention**
   - Verb-noun pattern required
   - Use hyphens not underscores
   - Keep to 2-4 words

2. **Organization**
   - Group by domain (dev/, test/, deploy/)
   - Keep related commands together
   - Maintain consistent structure

3. **Template standards**
   - Always include success criteria
   - Use explicit checkpoints
   - Provide clear error messages
   - Number steps for clarity

4. **Review process**
   - All commands require PR review
   - Test before merging
   - Update documentation
   - Announce new commands to team

## Quality Standards

### Command Quality Checklist

Before finalizing a command:

- [ ] Clear, actionable description
- [ ] Single responsibility
- [ ] Explicit error handling
- [ ] Checkpoint validation ("IF X fails, STOP")
- [ ] Composable with other commands
- [ ] Version controlled
- [ ] Documented arguments
- [ ] Team conventions encoded
- [ ] Model-agnostic instructions
- [ ] Success criteria defined
- [ ] Tested with expected inputs
- [ ] Reviewed by team member

### Production Command Traits

**Effective commands share these characteristics:**

**Focused scope:**

- One task per command
- Clear purpose
- Well-defined boundaries

**Explicit error handling:**

- Checkpoints at critical steps
- "STOP" instructions when failures occur
- Clear error messages
- Recovery steps when possible

**Clear parameterization:**

- Documented arguments
- Examples in documentation
- Validation of inputs

**Composability:**

- Commands can be chained
- Reusable building blocks
- Clear inputs and outputs
- Minimal dependencies

**Discoverability:**

- Clear description
- Logical organization
- Discoverable through autocomplete
- Documented in team resources

**Maintainability:**

- Version controlled
- Well documented
- Easy to update
- Clear ownership

## Summary

Slash commands sit at a specific point in the agentic coding tool hierarchy—more structured than conversation, less comprehensive than skills, more user-controlled than hooks.

**Key takeaways:**

1. **Commands solve repeatability** - Consistent behavior without context loss
2. **Use the right primitive** - Commands for explicit invocation, skills for auto-loading
3. **Structure templates clearly** - Headers, steps, checkpoints help all models
4. **Write model-agnostic** - Instructions that work across providers
5. **Keep focused** - One responsibility per command
6. **Handle errors explicitly** - Checkpoints and STOP instructions
7. **Make discoverable** - Clear descriptions enable autocomplete
8. **Share with team** - Commands are executable documentation
9. **Compose for flexibility** - Small, reusable building blocks
10. **Iterate and improve** - Test, refine, document

**Commands encode not just what to do, but how your team expects tasks to be done.** Start with 3-5 commands covering your most repeated workflows, then expand based on actual usage patterns rather than anticipated needs.
