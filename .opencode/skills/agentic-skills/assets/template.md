# SKILL.md Template

Copy this template to create a new skill. Replace all `{placeholders}` with actual values.

---

```markdown
---
name: {skill-name}
# prettier-ignore
description: {Action-oriented summary}. Use when {trigger contexts} or when user mentions {keywords}.
---

# {Skill Title}

{Brief overview: 1-2 sentences.}

## Quick Start

    {ONE minimal working example.}

## Core Rules

- {Rule 1}
- {Rule 2}
- {Rule 3}

## Common Pattern

{Short pattern description (<= 80 words).}

## References

- [references/patterns.md](references/patterns.md) - Advanced patterns
- [references/examples.md](references/examples.md) - Additional examples

<!--
PROGRESSIVE DISCLOSURE RULES:
- Description must be ONE line and <= 300 chars
- SKILL.md body must be <= 50 lines (frontmatter excluded)
- Include a Quick Start section with one minimal example
- Prefer 1 code block (warn if >2, error if >3)
- Move details to references/
-->
```
