---
name: creating-agentic-subagents
description: Create specialized agent configurations (subagents and primary agents) for OpenCode following research-backed best practices. Use when creating agents, configuring subagents, implementing multi-agent workflows, or when user mentions creating agents, subagents, agent configuration, specialized agents, multi-agent systems, or agent orchestration.
---

# Create Agentic Subagents

Create specialized agent configurations (subagents and primary agents) for OpenCode. Primary agents are main assistants users switch between with Tab, while subagents are specialists invoked via @mention for focused tasks with isolated context.

## Understanding Agents in OpenCode

OpenCode provides two types of agents:

### Primary Agents

**Primary agents** are the main assistants you interact with directly:

- Switch between them using **Tab** key
- Handle the main conversation
- Can access all configured tools
- Can invoke subagents for specialized tasks
- Examples: `build` (default, full access), `plan` (restricted, for analysis)

### Subagents

**Subagents** are specialized assistants invoked for focused tasks:

- Invoked by **@mentioning** them or automatically by primary agents
- Operate in isolated context (don't pollute main conversation)
- Can have restricted tool access for safety
- Can use different models or temperatures
- Return compressed results to parent agent
- Examples: `general` (research), `explore` (fast codebase analysis)

### Decision Tree

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

**Important**: Start with the simplest solution. Many tasks only need a single LLM call with good prompting.

## File Structure

**Project-specific:**

```
.opencode/agent/{name}.md
```

**Global (all projects):**

```
~/.config/opencode/agent/{name}.md
```

**Naming conventions:**

- Lowercase with hyphens: `test-fixer.md`, `code-reviewer.md`
- Use noun or role: `reviewer`, `auditor`, `fixer`, `builder`
- File name becomes agent: `test-fixer.md` → `@test-fixer`

## Agent Configuration Structure

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
```

### Configuration Options

#### Required Fields

**`description`** (required):

- Clear description of agent's purpose and when to use it
- Used for semantic matching by primary agents
- Include trigger phrases users might say
- Format: "Does X. Use when Y or when user mentions Z."

#### Optional Fields

**`mode`** (optional, defaults to `all`):

- `primary`: Main agent, switch with Tab key
- `subagent`: Invoked with @mention or automatically
- `all`: Can be used as both primary and subagent

**`temperature`** (optional):

- **0.0-0.2**: Focused, deterministic (code review, analysis, planning)
- **0.3-0.5**: Balanced (general development)
- **0.6-1.0**: Creative (brainstorming, exploration)

**`hidden`** (optional, subagents only):

- Set to `true` to hide from @autocomplete menu
- Still invokable by other agents via Task tool

**`tools`** (optional):

- Control which tools are available: `write`, `edit`, `bash`, `read`, `glob`, `grep`
- Set to `true` (enable) or `false` (disable)

**`permission`** (optional):

- Fine-grained control: `allow`, `ask`, `deny`
- Can specify per-tool or per-bash-command
- Last matching rule wins

**`maxSteps`** (optional):

- Limit agentic iterations for cost control

**Important**: Do NOT include `model` field unless user explicitly requests a specific model.

## Quick Reference: Common Configurations

### Read-Only Reviewer

```yaml
tools:
  write: false
  edit: false
  bash: false
permission:
  edit: deny
```

### Test Fixer (Full Access)

```yaml
temperature: 0.2
# No tool restrictions - needs to edit and run tests
```

### Documentation Writer (Path-Restricted)

```yaml
permission:
  bash: deny
  edit:
    'docs/*': allow
    'README.md': allow
    '*': deny
```

### Orchestrator (Controlled Delegation)

```yaml
permission:
  task:
    '*': deny
    'code-reviewer': allow
    'test-fixer': allow
```

See `references/patterns.md` for complete pattern templates.

## Anti-Patterns

### Don't Do This

**Creating too many agents:**
Over-specialization creates confusion. Most tasks need a single `quality-auditor` or commands.

**Vague descriptions:**

```yaml
description: Helps with code review # ❌ No triggers, no context
```

**Missing tool restrictions for reviewers:**
Reviewers should be read-only. Without restrictions, they might make unintended changes.

**Unnecessarily specifying model:**
Only add `model` if user explicitly asks for specific model.

**No workflow in iterative agents:**
Include clear steps, exit criteria, and success conditions.

### Do This Instead

**Focused agents with clear purposes:**

```yaml
.opencode/agent/
├── code-reviewer.md       # Comprehensive code review
├── test-fixer.md         # Iterative test fixing
└── quality-auditor.md    # All quality checks
```

**Rich descriptions with triggers:**

```yaml
description: Reviews code for quality, security, and best practices without making changes. Use for code review, quality checks, or when user mentions reviewing code, checking security, or auditing quality.
```

**Clear workflow steps:**

```markdown
Workflow:

1. Run tests to identify failures
2. If all pass → Report success and exit
3. If failures → Fix each failure
4. Re-run tests
5. Repeat until all pass
```

## Quality Checklist

Before finalizing an agent:

- [ ] Clear `description` with purpose and trigger keywords
- [ ] Appropriate `mode` (primary vs subagent)
- [ ] System prompt defines role and behavior clearly
- [ ] Tool restrictions appropriate for agent purpose
- [ ] Permissions configured for safety
- [ ] Temperature set appropriately (if needed)
- [ ] `model` field omitted unless user specifically requested it
- [ ] Workflow has clear steps (for iterative agents)
- [ ] Exit criteria defined
- [ ] Output format specified
- [ ] Agent documented in AGENTS.md

## References

- `references/patterns.md` - Complete pattern templates for common agent types
- `references/examples.md` - Full production-ready agent configurations
- `references/permissions.md` - Permission patterns, context management, and cost considerations
