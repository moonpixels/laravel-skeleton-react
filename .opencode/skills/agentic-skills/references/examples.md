# Skill Examples

Compact examples that comply with the 50-line Level 2 rule.

## Example 1: Simple Skill

**Directory structure:**

```
types/
└── SKILL.md
```

**SKILL.md:**

```markdown
---
name: types
# prettier-ignore
description: Create TypeScript types and interfaces for data models. Use when defining types, interfaces, data shapes, or when user mentions TypeScript types.
---

# Types

Define type-safe models and interfaces for data shapes.

## Quick Start

    export interface User {
      id: string
      email: string
    }

## Core Rules

- Use `interface` for object shapes
- Use `type` for unions and computed types
- Prefer `as const` objects for enum-like values

## References

- [references/examples.md](references/examples.md) - Extended examples
```

## Example 2: Skill with References

**Directory structure:**

```

hooks/
├── SKILL.md
└── references/
  ├── patterns.md
  └── examples.md

```

**SKILL.md:**

```markdown
---
name: hooks
# prettier-ignore
description: Create custom React hooks for reusable logic. Use when creating hooks, extracting shared state, or when user mentions custom hooks.
---

# Hooks

Encapsulate reusable stateful logic in hook functions.

## Quick Start

    export function useFlag() {
      const [value, setValue] = useState(false)
      return { value, setValue }
    }

## Core Rules

- Prefix names with `use`
- Return objects, not arrays
- Accept options objects for >1 param

## References

- [references/patterns.md](references/patterns.md) - Advanced patterns
- [references/examples.md](references/examples.md) - Full examples
```
