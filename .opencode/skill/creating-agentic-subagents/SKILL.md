---
name: creating-agentic-subagents
description: Create specialized agent configurations (subagents and primary agents) for OpenCode following research-backed best practices. Use when creating agents, configuring subagents, implementing multi-agent workflows, or when user mentions creating agents, subagents, agent configuration, specialized agents, multi-agent systems, or agent orchestration.
---

# Creating Agentic Subagents

## When to Use This Skill

Use this skill when:

- User requests "create an agent" or "create a subagent"
- Building specialized AI assistants for specific tasks
- User mentions agent configuration, @agent patterns, or subagents
- Implementing multi-agent workflows or orchestration
- Creating read-only reviewers or specialized builders
- Setting up task-specific AI personalities
- User asks about agent restrictions, permissions, or tool access
- Organizing complex development workflows with multiple agents
- Need to isolate context for specific tasks

## Understanding Agents in OpenCode

OpenCode provides two types of agents:

### Primary Agents

**Primary agents** are the main assistants you interact with directly:

- Switch between them using **Tab** key
- Handle the main conversation
- Can access all configured tools
- Can invoke subagents for specialized tasks
- Examples: `build` (default, full access), `plan` (restricted, for analysis)

**Use primary agents when:**

- Creating a fundamentally different mode of operation
- Need an alternative to Build/Plan that users switch to frequently
- Building domain-specific primary workflows (rare)

### Subagents

**Subagents** are specialized assistants invoked for focused tasks:

- Invoked by **@mentioning** them or automatically by primary agents
- Operate in isolated context (don't pollute main conversation)
- Can have restricted tool access for safety
- Can use different models or temperatures
- Return compressed results to parent agent
- Examples: `general` (research), `explore` (fast codebase analysis)

**Use subagents when:**

- Need specialized behavior for specific tasks
- Want to restrict tool access (read-only reviewers)
- Context isolation is valuable (keep main conversation clean)
- Different model/temperature would help (fast exploration, focused review)
- Building reusable specialists (code review, test fixing, security audits)

### Decision Tree: When to Create What

```
Need automation?
├─ Just a prompt shortcut with arguments?
│  └─ → Custom command (.opencode/command/)
│
├─ Need specialized AI behavior?
│  ├─ Will users switch to it frequently as main agent?
│  │  └─ → Primary agent (mode: primary)
│  │
│  └─ Invoked for focused subtasks?
│     └─ → Subagent (mode: subagent)
│
├─ Need to restrict tools for safety?
│  └─ → Subagent with tool restrictions
│
├─ Need isolated context to avoid pollution?
│  └─ → Subagent with subtask: true
│
└─ Complex orchestration of multiple specialists?
   └─ → Primary orchestrator agent + multiple subagents
```

**Important**: Start with the simplest solution. Many tasks only need a single LLM call with good prompting. Use commands for prompt shortcuts, and only create agents when specialized behavior or restrictions are genuinely needed.

## File Structure

### Subagents and Primary Agents

**Project-specific:**

```
.opencode/agent/{name}.md
```

**Global (all projects):**

```
~/.config/opencode/agent/{name}.md
```

**Example structure:**

```
.opencode/agent/
├── code-reviewer.md        # @code-reviewer (read-only subagent)
├── test-fixer.md          # @test-fixer (subagent with bash/edit)
├── quality-auditor.md     # @quality-auditor (orchestrator subagent)
├── security-auditor.md    # @security-auditor (read-only security)
└── docs-writer.md         # @docs-writer (docs/ write access only)
```

### Naming Conventions

**Agents (both primary and subagents):**

- Lowercase with hyphens: `test-fixer.md`, `code-reviewer.md`
- Use noun or role: `reviewer`, `auditor`, `fixer`, `builder`, `orchestrator`
- File name becomes agent: `test-fixer.md` → `@test-fixer`
- Descriptive and memorable: `security-auditor` not `agent1`

## Agent Configuration Structure

Every agent file follows this markdown structure:

```markdown
---
description: What the agent does and when to use it (REQUIRED)
mode: subagent # primary, subagent, or all (optional, defaults to all)
temperature: 0.1 # 0.0-1.0 (optional, for creativity control)
hidden: false # Hide from @autocomplete (optional, subagents only)
tools: # Tool restrictions (optional)
  write: false
  edit: false
  bash: false
permission: # Permission overrides (optional)
  edit: deny
  bash:
    '*': ask
    'git status': allow
---

System prompt for the agent.
Define its role, capabilities, and behavior clearly.
Provide specific instructions and guidelines.
```

### Configuration Options

#### Required Fields

**`description`** (required):

- Clear description of agent's purpose and when to use it
- Used for semantic matching by primary agents
- Include trigger phrases users might say
- Format: "Does X. Use when Y or when user mentions Z."

Example:

```yaml
description: Reviews code for best practices, security, and performance without making changes. Use when reviewing code, checking quality, or when user mentions code review, security audit, or quality check.
```

#### Optional Fields

**`mode`** (optional, defaults to `all`):

- `primary`: Main agent, switch with Tab key
- `subagent`: Invoked with @mention or automatically
- `all`: Can be used as both primary and subagent

**`temperature`** (optional):

- Control creativity vs determinism (0.0 to 1.0)
- **0.0-0.2**: Focused, deterministic (code review, analysis, planning)
- **0.3-0.5**: Balanced (general development)
- **0.6-1.0**: Creative (brainstorming, exploration)
- If not specified, uses model defaults

**`hidden`** (optional, subagents only):

- Set to `true` to hide from @autocomplete menu
- Still invokable by other agents via Task tool
- Useful for internal subagents used only programmatically

**`tools`** (optional):

- Control which tools are available
- Set to `true` (enable) or `false` (disable)
- Overrides global tool configuration
- Available tools: `write`, `edit`, `bash`, `read`, `glob`, `grep`

Example:

```yaml
tools:
  write: false # Disable file writing
  edit: false # Disable file editing
  bash: false # Disable bash commands
```

**`permission`** (optional):

- Fine-grained control over tool permissions
- Options: `allow`, `ask`, `deny`
- Can specify per-tool or per-bash-command
- Last matching rule wins

Example:

```yaml
permission:
  edit: deny # Never allow edits
  bash:
    '*': ask # Ask for all bash commands
    'git status': allow # Always allow git status
    'git log*': allow # Allow all git log commands
    'git diff*': allow # Allow all git diff commands
  webfetch: deny # Never allow web fetching
```

**`maxSteps`** (optional):

- Limit number of agentic iterations before forced text-only response
- Useful for cost control
- If not set, agent continues until model stops or user interrupts

**Important**: Do NOT include `model` field unless user explicitly requests a specific model. Agents should use the model of the invoking primary agent (for subagents) or user's configured default (for primary agents).

## Core Subagent Patterns

### Pattern 1: Read-Only Reviewer

**Use case:** Code review, analysis, auditing without making changes

**Configuration:**

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

You are a senior code reviewer specializing in [your tech stack].

Focus on:

- Code quality and best practices
- Security vulnerabilities (injection, auth flaws, data exposure)
- Performance issues (N+1 queries, memory leaks, unnecessary re-renders)
- Type safety and error handling
- Test coverage gaps
- Adherence to project conventions

Provide feedback with:

- Specific file and line references (file.php:123)
- Clear explanations of issues
- Suggested fixes (without making changes)
- Priority levels (critical, high, medium, low)

Format:

## 🔴 Critical Issues

[Must fix before deployment]

## 🟡 High Priority

[Important improvements]

## 🟢 Suggestions

[Nice-to-have improvements]

## ✅ Good Practices

[What's working well]
```

**Key characteristics:**

- `temperature: 0.1` for consistent, deterministic reviews
- All edit tools disabled for safety
- Clear output format for actionable feedback
- Specialized domain knowledge in system prompt

### Pattern 2: Test Fixer

**Use case:** Iteratively run tests and fix failures

**Configuration:**

```markdown
---
description: Runs tests and fixes failures iteratively until all pass. Use when fixing tests, debugging test failures, or ensuring test suite passes.
mode: subagent
temperature: 0.2
---

You are a test fixing specialist.

Workflow:

1. **Run Tests**
   Execute the test suite to identify failures

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
- Maintain code coverage thresholds
- Follow project conventions
- Never remove failing tests to make them pass
```

**Key characteristics:**

- Has bash and edit access for fixing
- Iterative workflow with clear steps
- Explains fixes for transparency
- Guards against shortcut solutions

### Pattern 3: Quality Auditor

**Use case:** Systematically run all quality checks

**Configuration:**

````markdown
---
description: Runs all quality checks systematically (Rector, Pint, PHPStan, tests) and fixes issues. Use when running quality checks, ensuring code quality, or preparing for commit.
mode: subagent
---

You are a quality auditor for this project.

Execute in order:

**Step 1: Rector**
Run automated refactoring:

```bash
composer rector
```
````

Fix any issues, then re-run until clean.

**Step 2: Pint**
Run code formatting:

```bash
composer pint
```

**Step 3: PHPStan**
Run static analysis:

```bash
composer stan
```

Fix issues until clean (level 8, 100% type coverage).

**Step 4: Frontend Checks**
Run frontend quality:

```bash
npm run checks
```

Fix any ESLint or TypeScript errors.

**Step 5: Tests**
Run test suite with coverage:

```bash
composer test -- --coverage
```

**Step 6: Coverage Verification**
Ensure minimum coverage thresholds met.

For each step:

- Report current status
- Fix issues immediately
- Re-run until step passes
- Track overall progress

Final report:

✅ All checks passing
✅ Coverage: X% (threshold: Y%)
✅ Type coverage: 100%
✅ No linting errors

````

**Key characteristics:**

- Systematic, ordered workflow
- Re-runs steps until clean
- Clear success criteria
- Comprehensive quality assurance

### Pattern 4: Exploration Agent

**Use case:** Fast codebase discovery and research

**Configuration:**

```markdown
---
description: Fast codebase exploration and pattern discovery. Use when searching codebase, understanding architecture, or finding specific implementations.
mode: subagent
temperature: 0.3
tools:
  write: false
  edit: false
  bash: false
---

You are a codebase exploration specialist.

Your role:

- Quickly discover relevant files and patterns
- Understand codebase architecture
- Find specific implementations
- Identify conventions and patterns
- Return compressed, relevant findings

Tools available:

- Read: Read file contents
- Glob: Find files by pattern
- Grep: Search code for keywords

Workflow:

1. Understand the search goal
2. Use Glob to find relevant files
3. Use Grep to search for keywords/patterns
4. Read key files to understand implementation
5. Return compressed findings with file references

Output format:

## Findings

### Relevant Files
- path/to/file.php:123 - Brief description
- path/to/other.php:45 - Brief description

### Key Patterns
- Pattern 1: Explanation
- Pattern 2: Explanation

### Recommendations
- Next steps or suggestions
````

**Key characteristics:**

- Read-only for safety
- Fast discovery focus
- Compressed output to avoid context pollution
- Clear file references for follow-up

### Pattern 5: Security Auditor

**Use case:** Security-focused code review

**Configuration:**

```markdown
---
description: Performs security audits identifying vulnerabilities, insecure patterns, and data exposure risks. Use for security reviews, vulnerability scanning, or security audits.
mode: subagent
temperature: 0.1
tools:
  write: false
  edit: false
  bash: false
---

You are a security expert specializing in web application security.

Focus areas:

1. **Input Validation**
   - SQL injection vulnerabilities
   - XSS (Cross-Site Scripting)
   - Command injection
   - Path traversal

2. **Authentication & Authorization**
   - Authentication bypass
   - Authorization flaws
   - Session management issues
   - Token handling

3. **Data Exposure**
   - Sensitive data in logs
   - API key exposure
   - Information disclosure
   - Insecure data storage

4. **Dependencies**
   - Vulnerable dependencies
   - Outdated packages
   - Known CVEs

5. **Configuration**
   - Insecure defaults
   - Debug mode in production
   - Exposed secrets

Output format:

## 🔴 Critical Vulnerabilities

[Immediate security risks]

## 🟠 High Risk

[Significant security concerns]

## 🟡 Medium Risk

[Moderate security issues]

## 🟢 Low Risk / Best Practices

[Minor improvements]

For each issue:

- File and line reference
- Vulnerability description
- Impact assessment
- Remediation steps
```

**Key characteristics:**

- Security-focused system prompt
- Read-only for non-invasive auditing
- Low temperature for consistent analysis
- Clear risk categorization

### Pattern 6: Documentation Writer

**Use case:** Write and maintain documentation

**Configuration:**

```markdown
---
description: Writes and maintains project documentation with clear explanations and examples. Use for creating docs, updating README, or documenting features.
mode: subagent
temperature: 0.4
permission:
  bash: deny
  edit:
    'docs/*': allow
    'README.md': allow
    '*.md': ask
    '*': deny
---

You are a technical documentation specialist.

Guidelines:

- Write clear, concise documentation
- Include code examples
- Use proper markdown formatting
- Structure content logically
- Keep explanations user-friendly

Focus on:

- Clear explanations of functionality
- Step-by-step instructions
- Code examples with comments
- Use cases and scenarios
- Troubleshooting guidance

File restrictions:

- Can edit files in docs/ directory
- Can edit README.md
- Must ask before editing other .md files
- Cannot edit source code files

Format:

- Use headings for structure
- Code blocks with language specification
- Lists for steps or features
- Examples for clarity
```

**Key characteristics:**

- Path-specific permissions (docs/ only)
- Cannot touch source code
- Slightly higher temperature for clarity
- Clear formatting guidelines

### Pattern 7: Orchestrator Agent

**Use case:** Coordinate multiple subagents for complex workflows

**Configuration:**

```markdown
---
description: Orchestrates complex workflows by coordinating multiple specialized subagents. Use for complex multi-step tasks requiring multiple specialists.
mode: subagent
temperature: 0.3
permission:
  task:
    '*': deny # Deny all subagents by default
    'code-reviewer': allow # Allow code reviewer
    'test-fixer': allow # Allow test fixer
    'quality-auditor': allow # Allow quality auditor
    'security-auditor': ask # Ask before security audit
---

You are a workflow orchestrator managing complex development tasks.

Available subagents:

- @code-reviewer: Code quality and best practices review
- @test-fixer: Fix failing tests iteratively
- @quality-auditor: Run all quality checks systematically
- @security-auditor: Security vulnerability assessment

Workflow:

1. **Analyze Task**
   Break down the task into subtasks
   Identify which specialists are needed

2. **Delegate to Specialists**
   Invoke appropriate subagents with clear instructions
   Provide each with focused, specific tasks

3. **Coordinate Results**
   Gather findings from all subagents
   Identify conflicts or dependencies
   Synthesize comprehensive solution

4. **Final Verification**
   Ensure all aspects addressed
   Run final validation
   Provide complete summary

Guidelines:

- Delegate to specialists rather than doing work yourself
- Provide clear, focused instructions to each subagent
- Coordinate timing and dependencies
- Synthesize results into cohesive output
- Track overall progress
```

**Key characteristics:**

- Task permissions control which subagents can be invoked
- Delegates rather than executes
- Coordinates multiple specialists
- Synthesizes results

## Permission Patterns

### Pattern 1: Bash Command Restrictions

Allow specific safe commands, ask for others:

```yaml
permission:
  bash:
    '*': ask # Ask for all commands by default
    'git status': allow # Always allow git status
    'git log*': allow # Allow all git log variations
    'git diff*': allow # Allow all git diff variations
    'npm test': allow # Allow running tests
    'composer test': allow # Allow running tests
```

### Pattern 2: Complete Lockdown

Read-only agent for pure analysis:

```yaml
tools:
  write: false
  edit: false
  bash: false
permission:
  edit: deny
  bash: deny
  webfetch: deny
```

### Pattern 3: Path-Specific Write Access

Documentation writer with limited scope:

```yaml
permission:
  edit:
    'docs/*': allow # Allow docs directory
    'README.md': allow # Allow README
    '*.md': ask # Ask for other markdown
    '*': deny # Deny everything else
```

### Pattern 4: Safe Operations Only

Allow safe reads, restrict destructive operations:

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
    'git reset --hard*': deny # Never allow destructive git ops
```

### Pattern 5: Task Orchestration Control

Control which subagents can be invoked:

```yaml
permission:
  task:
    '*': deny # Deny all subagents by default
    'orchestrator-*': allow # Allow orchestrator-prefixed agents
    'code-reviewer': ask # Ask before invoking reviewer
    'test-fixer': allow # Allow test fixer
```

**Note:** Rules are evaluated in order, and **last matching rule wins**. Place `*` wildcards first, then specific rules after.

## Context Management

### How Context Flows

**Parent → Subagent:**

- Task description via Task tool invocation
- Subagent receives prompt but NOT parent's conversation history
- Fresh, isolated context for each invocation

**Subagent → Parent:**

- Condensed findings returned through Task tool result
- Subagents act as intelligent filters
- Return conclusions, not raw search results

**Between Invocations:**

- Subagents have NO memory between invocations
- Each spawn starts fresh with clean context
- Parent maintains conversation history

### Context Isolation Benefits

1. **Prevents pollution**: Exploration and analysis don't clutter main conversation
2. **Enables longer sessions**: Parent context doesn't fill with intermediate work
3. **Focuses attention**: Each subagent has clean context for its specific task
4. **Compresses information**: Only relevant findings returned to parent

### Navigation Between Sessions

When subagents create child sessions:

- **Leader+Right**: Cycle forward through parent → child1 → child2 → parent
- **Leader+Left**: Cycle backward through parent ← child1 ← child2 ← parent

## Model Selection Strategy

While agents should generally use the invoking agent's model (or user's configured default), understanding model characteristics helps inform agent design:

### General Model Characteristics

**Larger/More Capable Models** (e.g., Opus-tier):

- Better for: Complex reasoning, orchestration, planning
- Use for: Orchestrator agents, complex analysis
- Tradeoff: Higher cost, slower response

**Mid-Tier Models** (e.g., Sonnet-tier):

- Better for: Balanced tasks, code implementation, reviews
- Use for: Most subagents, general development
- Tradeoff: Good balance of cost and capability

**Smaller/Faster Models** (e.g., Haiku-tier):

- Better for: Fast exploration, simple tasks, read-only operations
- Use for: Exploration agents, simple checks
- Tradeoff: Lower cost, faster, less capable reasoning

### When User Might Request Specific Models

Only include `model` field when user explicitly requests it:

- "Use a fast model for exploration" → `model: [provider]/haiku`
- "Use the most capable model for analysis" → `model: [provider]/opus`
- "Use Sonnet for this reviewer" → `model: [provider]/sonnet`

**Default behavior**: Omit `model` field entirely. Let the system use appropriate defaults.

## Cost Considerations

### The 15× Token Multiplier

Multi-agent systems use approximately **15× more tokens** than single conversations due to:

- Multiple isolated context windows
- Repeated tool calls across agents
- Parent-child communication overhead
- Model running multiple times in parallel

### When the Cost Is Worth It

✅ **Use multi-agent when:**

- Tasks genuinely benefit from parallelization
- Context would overflow single agent
- Specialization produces measurably better results
- High-value outcomes justify increased cost
- Need isolated contexts to prevent pollution

❌ **Stay single-agent when:**

- Simple fact-finding or direct queries
- Sequential tasks with cumulative context
- Task value doesn't justify 15× overhead
- No genuine need for specialization

### Cost Optimization Strategies

1. **Use lighter models for exploration subagents** (if user requests it)
2. **Compress subagent outputs before returning** (in system prompt)
3. **Limit subagent invocations** to necessary tasks only
4. **Clear, focused task descriptions** reduce wasted iterations
5. **Appropriate tool restrictions** prevent unnecessary work

## Examples

### Example 1: Code Reviewer Subagent

`.opencode/agent/code-reviewer.md`:

```markdown
---
description: Reviews code for quality, security, and best practices without making changes. Use for code review, quality checks, or when user mentions reviewing code, checking security, or auditing quality.
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

You are a senior code reviewer specializing in Laravel and React applications.

Review focus areas:

1. **Security**
   - SQL injection, XSS, authentication/authorization flaws
   - Data exposure, insecure dependencies

2. **Type Safety**
   - Full type coverage (PHPStan level 8, TypeScript strict)
   - No `any` types in TypeScript
   - Proper PHPDoc annotations

3. **Testing**
   - Adequate test coverage (≥90%)
   - Quality of test assertions
   - Edge case coverage

4. **Performance**
   - N+1 queries in Laravel
   - Unnecessary React re-renders
   - Inefficient algorithms

5. **Best Practices**
   - SOLID principles
   - DRY (Don't Repeat Yourself)
   - Project conventions (Actions, DTOs, etc.)

Feedback format:

## 🔴 Critical Issues

[Security vulnerabilities, type safety violations, breaking changes]

## 🟡 High Priority

[Performance issues, missing tests, maintainability concerns]

## 🟢 Suggestions

[Code improvements, refactoring opportunities]

## ✅ Good Practices

[What's working well, positive patterns to reinforce]

For each issue:

- **File reference**: `path/to/file.php:123`
- **Issue**: Clear description of the problem
- **Impact**: Why this matters
- **Fix**: Code example showing the solution
```

### Example 2: Test Fixer Subagent

`.opencode/agent/test-fixer.md`:

````markdown
---
description: Runs tests iteratively and fixes failures until all tests pass. Use when fixing tests, debugging test failures, or ensuring test suite is green.
mode: subagent
temperature: 0.2
---

You are a test fixing specialist for Laravel + React applications.

Workflow:

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
   - Identify test file and failing assertion
   - Analyze the failure reason
   - Determine root cause:
     - Code bug → Fix in source files
     - Test bug → Fix in test files
     - Missing feature → Implement feature
   - Implement the fix
   - Explain what was fixed and why

4. **Re-run Tests**

   ```bash
   composer test
   ```

   Repeat from step 2

5. **Final Report**
   - Total tests fixed
   - Summary of changes made
   - Current coverage metrics
   - Any remaining concerns

Guidelines:

- Fix the root cause, not the symptom
- Maintain 90%+ code coverage
- Ensure 100% type coverage (PHPStan level 8)
- Follow project conventions
- Never remove failing tests to make them pass
- Never skip tests with `->skip()`
- Write additional tests if coverage drops

After all tests pass:

✅ All tests passing
✅ Coverage: X% (threshold: 90%)
✅ Type coverage: 100%
✅ Summary of fixes applied

````

### Example 3: Security Auditor Subagent

`.opencode/agent/security-auditor.md`:

```markdown
---
description: Performs security audits identifying vulnerabilities and security risks. Use for security reviews, vulnerability scanning, or security audits.
mode: subagent
temperature: 0.1
tools:
  write: false
  edit: false
  bash: false
permission:
  edit: deny
  bash: deny
---

You are a security expert specializing in web application security.

Audit checklist:

## 1. Input Validation

- SQL injection vulnerabilities (use parameterized queries)
- XSS (Cross-Site Scripting) risks
- Command injection possibilities
- Path traversal vulnerabilities
- CSRF protection

## 2. Authentication & Authorization

- Authentication bypass opportunities
- Authorization flaws (access control)
- Session management security
- Token handling (JWT, API keys)
- Password storage (hashing, salting)

## 3. Data Exposure

- Sensitive data in logs or error messages
- API keys or secrets in code/config
- Information disclosure in responses
- Insecure data storage
- Missing encryption for sensitive data

## 4. Dependencies & Configuration

- Vulnerable dependencies (outdated packages)
- Known CVEs in dependencies
- Debug mode enabled in production
- Exposed secrets in `.env` or config files
- Insecure defaults

## 5. API Security

- Missing rate limiting
- Weak authentication on endpoints
- Insufficient input validation
- Information leakage in error responses
- Missing HTTPS enforcement

Output format:

## 🔴 Critical Vulnerabilities

**File**: path/to/file.php:123
**Issue**: SQL injection in user search
**Impact**: Attacker can access entire database
**Fix**: Use parameterized queries with bindings

## 🟠 High Risk

[Significant security concerns requiring prompt attention]

## 🟡 Medium Risk

[Security issues that should be addressed]

## 🟢 Low Risk / Best Practices

[Minor improvements and security hardening]

## ✅ Security Strengths

[What's implemented well, good security practices]
````

## Anti-Patterns

### ❌ Don't Do This

**Creating too many agents:**

```yaml
# Creating 20+ hyper-specialized agents
.opencode/agent/
├── fix-imports.md
├── fix-types.md
├── fix-formatting.md
├── fix-tests.md
└── ... (16 more)
```

_Issue:_ Over-specialization creates confusion and maintenance burden. Most of these could be a single `quality-auditor` agent or even simple commands.

**Vague descriptions:**

```yaml
description: Helps with code review
```

_Issue:_ No trigger keywords, no context for when to use. Agent won't be matched correctly.

**Missing tool restrictions for reviewers:**

```yaml
---
description: Code reviewer
mode: subagent
# ❌ No tool restrictions - reviewer can edit files!
---
```

_Issue:_ Reviewers should be read-only. Without restrictions, they might make unintended changes.

**Unnecessarily specifying model:**

```yaml
---
description: Create a React component
mode: subagent
model: anthropic/claude-sonnet-4-20250514 # ❌ Not needed!
---
```

_Issue:_ Overrides user's model preference without user requesting it. Only add `model` if user explicitly asks for specific model.

**No workflow in iterative agents:**

```markdown
You fix tests.
```

_Issue:_ No clear steps, no exit criteria, no success conditions. Agent won't know when to stop.

**Wrong agent type for task:**

```yaml
---
description: Quick file search
mode: primary # ❌ Should be subagent
---
```

_Issue:_ File search is a focused subtask, not something users switch to as main agent.

### ✅ Do This Instead

**Focused agents with clear purposes:**

```yaml
.opencode/agent/
├── code-reviewer.md       # Comprehensive code review
├── test-fixer.md         # Iterative test fixing
└── quality-auditor.md    # All quality checks
```

_Better:_ Small number of focused, well-designed agents that cover key workflows.

**Rich descriptions with triggers:**

```yaml
description: Reviews code for quality, security, and best practices without making changes. Use for code review, quality checks, or when user mentions reviewing code, checking security, or auditing quality.
```

_Better:_ Clear purpose, trigger contexts, and keywords for semantic matching.

**Proper tool restrictions:**

```yaml
---
description: Code reviewer
mode: subagent
tools:
  write: false
  edit: false
  bash: false
permission:
  edit: deny
---
```

_Better:_ Read-only agent can't accidentally modify files.

**Omit model field by default:**

```yaml
---
description: Create a React component
mode: subagent
# No model specified - uses appropriate defaults
---
```

_Better:_ Respects user's model configuration unless they request otherwise.

**Clear workflow steps:**

```markdown
Workflow:

1. Run tests to identify failures
2. If all pass → Report success and exit
3. If failures → Fix each failure
4. Re-run tests
5. Repeat until all pass
```

_Better:_ Clear process, exit criteria, and iterative loop.

**Appropriate agent type:**

```yaml
---
description: Fast codebase exploration
mode: subagent # ✅ Correct for focused subtask
---
```

_Better:_ Subagent for focused tasks, primary for main workflows.

## Quality Standards

### Agent Quality Checklist

Before finalizing an agent:

- [ ] Clear `description` with purpose and trigger keywords
- [ ] Appropriate `mode` (primary vs subagent)
- [ ] System prompt defines role and behavior clearly
- [ ] Tool restrictions appropriate for agent purpose
- [ ] Permissions configured for safety
- [ ] Temperature set appropriately for task type (if needed)
- [ ] `model` field omitted unless user specifically requested it
- [ ] Workflow has clear steps (for iterative agents)
- [ ] Exit criteria defined (when does agent stop?)
- [ ] Output format specified (for consistency)
- [ ] Agent tested with various inputs
- [ ] Agent documented in AGENTS.md (if project-specific)

### Best Practices

**Agents:**

- Write clear system prompts that define role and expectations
- Restrict tools appropriately (read-only for reviewers, full access for builders)
- Use lower temperature (0.1-0.2) for analytical tasks
- Use moderate temperature (0.3-0.5) for balanced tasks
- Use higher temperature (0.6+) only for creative tasks (rare)
- Test agent behavior across different scenarios
- Start simple, add complexity only when needed

**Descriptions:**

- Include action verbs: "Reviews", "Fixes", "Analyzes", "Creates"
- Add trigger contexts: "Use when...", "Use for..."
- Include keywords users might say naturally
- Keep under 200 characters (optimal) for quick loading
- Be specific about what agent does and doesn't do

**Integration:**

- Reference existing skills when applicable
- Follow project structure conventions
- Align with existing quality standards
- Document new agents in AGENTS.md
- Test workflows end-to-end before committing

**Cost Awareness:**

- Remember 15× token multiplier for multi-agent workflows
- Only use subagents when simpler solutions insufficient
- Compress output to essential findings
- Clear task descriptions reduce wasted iterations

## When NOT to Create Agents

Before creating an agent, ask:

1. **Can this be a simple prompt?** Many tasks only need good prompting.
2. **Can this be a command?** If it's a prompt shortcut with arguments, use `/command`.
3. **Will this be used frequently?** One-off tasks don't need agents.
4. **Does specialization add value?** Generic agents often work fine.
5. **Is the 15× cost justified?** Multi-agent workflows are expensive.

**Prefer simpler solutions:**

- Single LLM call with good prompt
- Custom command for repeated prompts
- Existing Build/Plan agents for most work
- Commands that invoke subagents only when needed

**Create agents only when:**

- Need specialized behavior that can't be prompted
- Need tool restrictions for safety
- Context isolation provides clear value
- Specialization produces measurably better results
- Will be reused across many tasks

## Summary

Creating effective agents requires:

1. **Clear purpose** - Agents solve specific problems
2. **Appropriate type** - Primary vs subagent based on usage
3. **Proper configuration** - Tools, permissions, temperature
4. **Safety controls** - Restrictions appropriate to agent role
5. **Quality prompts** - Clear role definition and workflows
6. **Cost awareness** - Understanding 15× token multiplier
7. **Testing** - Verify agents work as expected
8. **Documentation** - Record in AGENTS.md for discoverability

The most effective agents:

- Solve real workflow pain points
- Match how users naturally phrase requests
- Provide focused, specialized behavior
- Maintain safety through appropriate restrictions
- Integrate seamlessly with existing workflows
- Justify their cost through measurable value

**Start simple.** Begin with good prompts and commands. Add agents only when their specialized behavior, tool restrictions, or context isolation provides genuine value worth the additional complexity and cost.
