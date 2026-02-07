---
name: inertia-react-development
description: Build Inertia.js v2 React pages, forms, and navigation flows. Use when building or updating Inertia React pages with Link, Form/useForm, deferred props, prefetching, or polling.
---

# Inertia React Development

Apply Inertia v2 React patterns for pages, navigation, forms, and data-loading UX.

## Quick Start

```tsx
import { Form, Link } from '@inertiajs/react'

export default function UsersCreate() {
  return (
    <>
      <Link href="/users" prefetch>
        Users
      </Link>
      <Form action="/users" method="post">
        {({ processing, errors }) => (
          <>
            <input name="name" />
            {errors.name && <p>{errors.name}</p>}
            <button disabled={processing}>Create</button>
          </>
        )}
      </Form>
    </>
  )
}
```

## Core Rules

- Keep page components in `resources/js/pages`.
- Use `<Link>` or `router` for internal navigation; avoid plain `<a>` links.
- Prefer `<Form>` for standard forms and `useForm` for programmatic workflows.
- For deferred props, include a loading skeleton and a real empty state.
- Use `search-docs` before implementing v2 features and follow project conventions.

## Common Pattern

Use route prefetching for high-traffic links and polling/partial reloads (`router.reload({ only: [...] })`) for live dashboard fragments.

## References

- [references/examples.md](references/examples.md) - Additional Inertia React patterns and snippets
