---
name: agentic-skills
# prettier-ignore
description: Create OpenCode agent skills with strict progressive disclosure rules. Use when creating skills, updating SKILL.md files, validating skill format, or when user mentions skills, SKILL.md, skill validation, or skill documentation.
---

# Create Agent Skills

Create OpenCode skills that are compact, triggerable, and enforce progressive disclosure with validation.

## Skill Locations

```
.opencode/skills/{skill-name}/SKILL.md # Project skills
~/.config/opencode/skills/{skill-name}/SKILL.md # Global skills
```

## Frontmatter Rules (Level 1)

- `name` matches directory and regex: `^[a-z0-9]+(-[a-z0-9]+)*$`
- `description` is ONE line, 1–300 chars (warn >200)
- `description` MUST include `Use when`, `Use for`, or `Use to`
- `description` is action-oriented and third person

## SKILL.md Body Rules (Level 2)

- Hard limit: 50 lines (frontmatter excluded)
- Must include `## Quick Start` with ONE minimal example
- 1 code block preferred; warn if >2, error if >3
- 3–5 sections recommended; warn if >8
- Long explanations move to `references/`

## References (Level 3)

- Linked with `[text](references/examples.md)` from SKILL.md
- No nesting beyond depth 1
- No orphaned reference files

## Workflow

1. Draft SKILL.md using the template in `assets/template.md`
2. Add detailed docs to `references/`
3. Run `node .opencode/skills/agentic-skills/scripts/validate-skill.mjs <skill-path>`
4. Fix errors, re-run validation
5. Use `node .opencode/skills/agentic-skills/scripts/doctor-skill.mjs <skill-path>` for multiline description
   fixes

## Validator Expectations

- Detects multiline descriptions and missing trigger phrases
- Enforces 50-line Level 2 limit
- Validates reference links and nesting depth
- Checks keyword overlap between description and body

## References

- [references/checklist.md](references/checklist.md) - Full quality checklist
- [references/examples.md](references/examples.md) - Short, compliant examples
