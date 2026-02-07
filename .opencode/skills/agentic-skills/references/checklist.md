# Skill Quality Checklist

Use this checklist before finalizing or publishing a skill.

## Contents

- [Pre-Creation Checklist](#pre-creation-checklist)
- [SKILL.md Checklist](#skillmd-checklist)
- [Progressive Disclosure Checklist](#progressive-disclosure-checklist)
- [Testing Checklist](#testing-checklist)

---

## Pre-Creation Checklist

Before writing the skill:

- [ ] Identified 3-5 concrete usage examples
- [ ] Listed trigger phrases users would say
- [ ] Determined what context agent doesn't already have
- [ ] Planned which resources to include (scripts/references/assets)
- [ ] Confirmed this isn't duplicate of existing skill

---

## SKILL.md Checklist

### Frontmatter

- [ ] `name` is lowercase with single hyphen separators
- [ ] `name` is 1-64 characters
- [ ] `name` matches parent directory name
- [ ] `name` matches regex `^[a-z0-9]+(-[a-z0-9]+)*$`
- [ ] `description` is one line only
- [ ] `description` is <= 300 characters (warn > 200)
- [ ] `description` includes what the skill does
- [ ] `description` includes `Use when`, `Use for`, or `Use to`
- [ ] `description` includes natural trigger keywords
- [ ] `description` is third person and action-oriented

### Body Content (Level 2)

- [ ] `## Quick Start` exists with ONE minimal example
- [ ] Body is <= 50 lines (frontmatter excluded)
- [ ] 1 code block preferred (warn if >2, error if >3)
- [ ] 3-5 sections recommended (warn if >8)
- [ ] No verbose explanations of common knowledge
- [ ] No README, CHANGELOG, or auxiliary files

### References (Level 3)

- [ ] All `references/*.md` links resolve
- [ ] No nested references beyond depth 1
- [ ] No orphaned reference files
- [ ] Relative paths used: `[file](references/examples.md)`

---

## Progressive Disclosure Checklist

### Level 1: Metadata

- [ ] Description is short and triggerable
- [ ] Description keywords match skill content

### Level 2: SKILL.md

- [ ] Essential workflow only
- [ ] Extra detail moved to references

### Level 3: Resources

- [ ] References are focused and self-contained
- [ ] Scripts are tested and executable

---

## Testing Checklist

### Before Finalizing

- [ ] Triggered skill with natural phrases from description
- [ ] Verified correct skill loads (not a similar one)
- [ ] Tested main workflow end-to-end
- [ ] Confirmed examples work
- [ ] Ran validator: `node .opencode/skills/agentic-skills/scripts/validate-skill.mjs <path>`
- [ ] Fixed multiline description with doctor if needed

### After Real Usage

- [ ] Observed agent using the skill on real tasks
- [ ] Noted any confusion or misses
- [ ] Updated skill based on observations
- [ ] Re-tested after changes
