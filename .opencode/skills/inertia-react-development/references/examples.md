# Inertia React Examples

Use these patterns when the quick-start snippet is not enough.

## Navigation

- Basic links: `import { Link } from '@inertiajs/react'`
- Method links: `<Link href="/logout" method="post" as="button">Logout</Link>`
- Programmatic visits: `router.visit('/users', { method: 'post', data })`
- Prefetch: `<Link href="/users" prefetch>Users</Link>`

## Forms

- Prefer `<Form action="..." method="post">` for standard form submission.
- Use slot props for state: `errors`, `processing`, `wasSuccessful`, `progress`.
- Use `resetOnSuccess` and `setDefaultsOnSuccess` when appropriate.
- Use `useForm` when you need full data control, custom submission logic, or targeted resets.

## Inertia v2 Data Loading

- Deferred props: render loading skeletons while props are undefined.
- Polling: use interval + `router.reload({ only: ['field'] })`.
- Infinite scrolling: use `WhenVisible` and merge paginated props safely.

## Common Pitfalls

- Using plain `<a>` for internal navigation.
- Missing undefined/loading handling for deferred props.
- Submitting raw `<form>` without `preventDefault()` when not using `<Form>`.
