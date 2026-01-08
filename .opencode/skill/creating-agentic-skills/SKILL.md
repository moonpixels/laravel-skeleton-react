---
name: creating-agentic-skills
description: Creating agentic coding skills for OpenCode/Claude Code with proper structure, descriptions, and conventions. Use when creating skills, adding new skills, documenting workflows, or when user mentions creating skills, skill development, SKILL.md files, or skill documentation.
---

# Creating Agentic Coding Skills

## When to Use This Skill

Use this skill when:

- User requests "create a new skill"
- Adding workflow documentation as a skill
- Converting repeated patterns into skills
- User mentions creating skills, SKILL.md files, or skill development
- Documenting domain-specific conventions
- Building reusable instruction sets

## Understanding Agentic Skills

Skills transform general-purpose coding agents into specialized tools by packaging domain expertise into discoverable, reusable instruction sets. Both Claude Code and OpenCode use **progressive disclosure** to load context only when needed.

### How Skills Work

1. **Startup**: Agent loads only skill names and descriptions (~100 tokens each)
2. **Matching**: User request semantically matches against descriptions
3. **Loading**: Full SKILL.md is read when matched (~5000 tokens)
4. **References**: Additional files load on-demand (unlimited)

### Critical Insight

**Description quality is the single most important factor.** There's no algorithmic routing - the agent uses pure LLM reasoning to match user requests against descriptions.

## File Structure

Skills live in `.opencode/skill/{name}/SKILL.md`:

```
.opencode/skill/
├── creating-actions/
│   ├── SKILL.md              # Required: Core instructions
│   ├── references/           # Optional: Detailed docs
│   │   └── examples.md
│   ├── scripts/              # Optional: Deterministic operations
│   │   └── generate.php
│   └── assets/               # Optional: Templates, files
│       └── template.php
└── README.md
```

### Directory Structure

- **SKILL.md** - Required, keep under 500 lines
- **references/** - Extended documentation loaded on-demand
- **scripts/** - Executable code for deterministic operations
- **assets/** - Templates, boilerplate, files for output

## SKILL.md Structure

### 1. YAML Frontmatter (Required)

```yaml
---
name: creating-actions
description: Create Laravel Action classes for business logic operations following domain-driven design. Use when creating Actions, implementing business logic, handling user operations, or when user mentions Action classes, domain operations, business rules, or service classes.
---
```

**Required fields:**

- `name`: Lowercase with hyphens, 1-64 chars, matches directory name
- `description`: 1-1024 chars (optimal under 200)

**Naming convention:**

- Use **gerund form** (verb + -ing): `creating-actions`, `managing-models`, `defining-routes`
- Lowercase only
- Single hyphens between words
- No leading/trailing hyphens

### 2. Description Formula

```
[Action verbs describing capabilities]. Use when [trigger contexts] or when the user mentions [keywords/file types/task types].
```

**Effective description components:**

1. **Action verbs**: "Create", "Manage", "Define", "Write", "Ensure"
2. **Capabilities**: What the skill does
3. **Trigger contexts**: When to use it
4. **Keywords**: Natural phrases users would say

**Example - Effective:**

```yaml
description: Create Laravel Action classes for business logic operations following domain-driven design. Use when creating Actions, implementing business logic, handling user operations, or when user mentions Action classes, domain operations, business rules, or service classes.
```

**Example - Ineffective:**

```yaml
description: Helps with actions # ❌ Too vague, no triggers
```

### 3. Content Structure

Every skill should include these sections:

```markdown
# Creating {Feature}

## When to Use This Skill

- Bullet points of specific scenarios
- When user requests X
- When user mentions Y

## File Structure

- Where files live
- Naming conventions
- Directory organization

## Core Conventions

- Key patterns with code examples
- Required conventions
- Important rules

## Examples

- 2-3 real examples from codebase
- Show complete, working code
- Cover common use cases

## Anti-Patterns

### ❌ Don't Do This

- Show wrong patterns
- Explain why they're wrong

### ✅ Do This Instead

- Show correct patterns
- Explain why they're better

## Quality Standards

- Testing requirements
- Code quality requirements
- Style requirements
```

## Creating Skills: Step-by-Step Process

### Step 1: Identify the Need

**Questions to ask:**

- Is this a repeated pattern in the codebase?
- Do we give the same instructions multiple times?
- Is this a domain-specific workflow?
- Would automation/guidance help here?

### Step 2: Gather Information

**Collect:**

- Existing code examples from the codebase
- Common patterns and conventions
- Anti-patterns to avoid
- Quality standards to enforce
- Trigger phrases users might say

### Step 3: Design the Skill

**Plan:**

- Choose a gerund name (creating-_, managing-_, etc.)
- Draft description with action verbs + triggers + keywords
- Identify core conventions (3-5 key patterns)
- Select 2-3 real examples
- List anti-patterns
- Define quality standards

### Step 4: Write the SKILL.md

**Structure:**

1. Write YAML frontmatter (name + description)
2. "When to Use This Skill" section (5-10 bullets)
3. "File Structure" with examples
4. "Core Conventions" with code blocks
5. "Examples" with real code (2-3 examples)
6. "Anti-Patterns" (❌ Don't / ✅ Do)
7. "Quality Standards" section

**Keep it light (~200 lines) for baseline:**

- Focus on core patterns
- Real examples from codebase
- Clear anti-patterns
- Essential conventions

### Step 5: Test the Skill

**Test by:**

- Using natural phrases that should trigger it
- Ensuring it loads correctly
- Verifying examples work
- Checking it doesn't load for out-of-scope requests

## Examples

### Example 1: Laravel Action Skill

```yaml
---
name: creating-actions
description: Create Laravel Action classes for business logic operations following domain-driven design. Use when creating Actions, implementing business logic, handling user operations, or when user mentions Action classes, domain operations, business rules, or service classes.
---

# Creating Laravel Actions

## When to Use This Skill

Use this skill when:
- User requests "create a [Name]Action"
- Implementing business logic that doesn't belong in controllers
- User mentions business rules or domain operations

## File Structure

Actions are organized by domain:

\`\`\`
app/Actions/{Domain}/{Name}Action.php
\`\`\`

## Core Conventions

\`\`\`php
<?php

declare(strict_types=1);

namespace App\Actions\{Domain};

final readonly class {Name}Action
{
    public function __construct(
        private DependencyOne $dep
    ) {}

    public function handle({Name}Data $data): {ReturnType}
    {
        // Business logic
        return $result;
    }
}
\`\`\`

## Examples

[Real examples from codebase]

## Anti-Patterns

### ❌ Don't Do This
[Wrong patterns]

### ✅ Do This Instead
[Correct patterns]

## Quality Standards

- PHPStan level 9
- 100% type coverage
- Covered by feature tests
```

### Example 2: React Component Skill

```yaml
---
name: creating-react-components
description: Creating reusable React components with TypeScript, Tailwind CSS, and shadcn/ui. Use when creating components, building UI elements, implementing reusable widgets, or when user mentions components, UI, buttons, cards, forms, or reusable elements.
---

# Creating React Components

## When to Use This Skill

Use this skill when:
- User requests "create a [Name] component"
- Building reusable UI elements
- User mentions components, widgets, or UI elements

## File Structure

\`\`\`
resources/js/components/{name}.tsx
resources/js/components/ui/{name}.tsx      # shadcn/ui
resources/js/components/icons/{name}.tsx   # Icons
\`\`\`

## Core Conventions

\`\`\`tsx
import type { PropsWithChildren } from 'react'

export function ComponentName({
  prop,
  children,
}: PropsWithChildren<{
  prop: string
}>) {
  return (
    <div className="space-y-4">
      {children}
    </div>
  )
}
\`\`\`

[Rest of skill content...]
```

### Example 3: Testing Skill

```yaml
---
name: writing-feature-tests
description: Writing feature tests for HTTP endpoints, controllers, and full request/response cycles using Pest v4. Use when any business logic is added to codebase, when creating Actions, Controllers, Form Requests, or modifying application behavior that affects HTTP endpoints.
---

# Writing Feature Tests

## When to Use This Skill

Use this skill when:
- **Any business logic is added to the codebase**
- Creating or modifying Controllers
- Creating or modifying Actions
- Adding new HTTP endpoints
- User mentions feature tests, HTTP tests, or integration tests

[Rest of skill content...]
```

## Best Practices

### Description Writing

**✅ Good descriptions:**

```yaml
# Specific, with triggers and keywords
description: Create Laravel Action classes for business logic operations following domain-driven design. Use when creating Actions, implementing business logic, handling user operations, or when user mentions Action classes, domain operations, business rules, or service classes.
```

**❌ Bad descriptions:**

```yaml
# Too vague
description: Helps with actions

# No triggers
description: Create Action classes

# No keywords
description: Business logic patterns
```

### Content Organization

**Keep skills focused:**

- One capability per skill
- Split large topics into multiple skills
- Keep SKILL.md under 500 lines
- Move extensive docs to references/

**Example split:**

- `creating-actions` - How to create Actions
- `writing-feature-tests` - How to test (separate skill)
- `ensuring-laravel-quality` - Quality checks (separate skill)

### Progressive Disclosure

**Layer information:**

1. **Always loaded**: Name + description (~100 tokens)
2. **When triggered**: SKILL.md content (~5000 tokens)
3. **As needed**: Reference files (unlimited)

**Example:**

```
creating-actions/
├── SKILL.md                    # Core conventions
├── references/
│   ├── advanced-patterns.md    # Advanced topics
│   └── testing-actions.md      # Testing guide
└── scripts/
    └── generate-action.php     # Code generator
```

### Testing Emphasis

For any skill involving code creation, emphasize proactive testing:

```yaml
description: Create Laravel Action classes... Use when any business logic is added to codebase, when creating Actions...
```

Key phrases:

- "Use when any business logic is added"
- "Use when creating or modifying [feature]"
- "Write tests alongside implementation"

## Quality Checklist for Skills

Before finalizing a skill:

- [ ] Name uses gerund form (creating-, managing-, etc.)
- [ ] Name matches directory name exactly
- [ ] Description under 200 characters (optimal)
- [ ] Description includes action verbs
- [ ] Description includes trigger contexts
- [ ] Description includes natural keywords
- [ ] "When to Use This Skill" section present
- [ ] "File Structure" with examples
- [ ] "Core Conventions" with code examples
- [ ] 2-3 real examples from codebase
- [ ] "Anti-Patterns" section (❌ / ✅)
- [ ] "Quality Standards" section
- [ ] Content under 500 lines (or use references/)
- [ ] All code examples work and are tested

## Anti-Patterns

### ❌ Don't Do This

```yaml
# Vague name
name: actions

# No trigger keywords
description: Action classes for Laravel

# Missing "Use when" in description
description: Create Action classes for business logic

# No examples
## Core Conventions
[Text only, no code]

# No anti-patterns section
[Missing ❌ / ✅ comparisons]

# Too long (use references/ instead)
SKILL.md: 1000 lines
```

### ✅ Do This Instead

```yaml
# Gerund name
name: creating-actions

# Rich description with triggers
description: Create Laravel Action classes for business logic operations following domain-driven design. Use when creating Actions, implementing business logic, or when user mentions Action classes, domain operations, business rules.

# Clear "When to Use This Skill"
## When to Use This Skill
- User requests "create a [Name]Action"
- Implementing business logic

# Real code examples
## Examples
\`\`\`php
<?php
// Real working example from codebase
\`\`\`

# Anti-patterns included
## Anti-Patterns
### ❌ Don't Do This
### ✅ Do This Instead

# Right length with references
SKILL.md: 200 lines
references/advanced.md: Extended content
```

## Common Skill Types

### Architecture Patterns

- creating-actions
- creating-dtos
- creating-controllers
- managing-models

### Feature Implementation

- creating-react-components
- creating-inertia-pages
- creating-hooks
- creating-layouts

### Testing

- writing-feature-tests
- writing-unit-tests
- writing-browser-tests

### Quality & Maintenance

- ensuring-laravel-quality
- ensuring-frontend-quality

### Configuration & Setup

- managing-config-files
- managing-npm-packages
- defining-routes

## Maintaining Skills

### When to Update Skills

Update when:

- Conventions change in the codebase
- New patterns emerge
- Anti-patterns are discovered
- Tools/packages are updated
- Examples become outdated

### Versioning

Consider including version info for major changes:

```yaml
# Optional metadata
metadata:
  version: '1.0.0'
  updated: '2024-01-08'
  laravel: '12.x'
  react: '19.x'
```

### Deprecation

When deprecating a skill:

1. Update description to mention it's deprecated
2. Point to replacement skill
3. Keep file for historical reference

## Summary

Creating effective skills requires:

1. **Focused scope** - One capability per skill
2. **Semantic trigger alignment** - Descriptions match natural language
3. **Real examples** - Working code from the codebase
4. **Clear anti-patterns** - Show what NOT to do
5. **Quality standards** - Enforce project conventions
6. **Progressive disclosure** - Layer information appropriately
7. **Iterative refinement** - Test and improve over time

The most effective skills solve specific problems at the right abstraction level, with clear descriptions that match how users naturally phrase requests.
