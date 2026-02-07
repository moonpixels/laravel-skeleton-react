---
name: tailwindcss-development
description: Build interface styling with Tailwind CSS v4 utility patterns. Use when adding or refactoring CSS classes for layout, spacing, responsive behavior, theme variants, or visual polish.
---

# Tailwind CSS Development

Use Tailwind v4 conventions to build consistent, maintainable UI styling.

## Quick Start

```html
<section class="mx-auto max-w-5xl px-6 py-12">
  <h1 class="text-3xl font-semibold tracking-tight">Dashboard</h1>
  <div class="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    <article class="rounded-xl border p-4 shadow-sm">Card</article>
  </div>
</section>
```

## Core Rules

- Follow existing project class patterns before introducing new utility combinations.
- Use Tailwind v4 syntax (`@import "tailwindcss"` and CSS-first `@theme` config).
- Prefer `gap-*` for sibling spacing over margin chains.
- Remove deprecated v3 utilities and use modern replacements (`shrink-*`, `grow-*`, `text-ellipsis`).
- If the project supports dark mode, add matching `dark:` variants for new UI.

## Common Pattern

Build layout structure first (container, grid/flex, spacing), then layer typography, borders, and color utilities for readability and hierarchy.

## References

- [references/examples.md](references/examples.md) - v4 migration notes, layout snippets, and pitfalls
