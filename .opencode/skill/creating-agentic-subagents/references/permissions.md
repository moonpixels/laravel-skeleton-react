# Permission Patterns

Fine-grained permission configurations for agent security.

## Pattern 1: Bash Command Restrictions

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

## Pattern 2: Complete Lockdown

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

## Pattern 3: Path-Specific Write Access

Documentation writer with limited scope:

```yaml
permission:
  edit:
    'docs/*': allow # Allow docs directory
    'README.md': allow # Allow README
    '*.md': ask # Ask for other markdown
    '*': deny # Deny everything else
```

## Pattern 4: Safe Operations Only

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

## Pattern 5: Task Orchestration Control

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
