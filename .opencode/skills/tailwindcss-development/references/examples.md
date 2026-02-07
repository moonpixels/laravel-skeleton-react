# Tailwind CSS v4 Examples

Use this file for expanded styling guidance beyond the quick start.

## v4 Basics

- Import syntax: `@import "tailwindcss";`
- Theme tokens live in CSS with `@theme`.
- `corePlugins` is not used in v4 CSS-first workflows.

## Utility Replacements

- `flex-shrink-*` -> `shrink-*`
- `flex-grow-*` -> `grow-*`
- `overflow-ellipsis` -> `text-ellipsis`
- `bg-opacity-*` style patterns -> color slash opacity syntax (for example `bg-black/50`)

## Layout Snippets

- Flex row: `class="flex items-center justify-between gap-4"`
- Responsive grid: `class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"`
- Stack spacing: `class="flex flex-col gap-3"`

## Dark Mode

- If established in the project, pair new foreground/background classes with `dark:` equivalents.
- Example: `bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50`.

## Common Pitfalls

- Reintroducing deprecated v3 utilities.
- Overusing one-off arbitrary values when existing design tokens already cover the need.
- Building spacing with margin chains instead of parent `gap-*`.
