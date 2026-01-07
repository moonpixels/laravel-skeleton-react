---
name: react-inertia
description: Work with Inertia.js for server-driven SPAs
compatibility: opencode
metadata:
  category: frontend
  domain: react
---

## Navigation

Use `<Link>` or `router.visit()`, never `<a>` tags:
```typescript
import { Link, router } from '@inertiajs/react';

// Link component
<Link href="/dashboard">Dashboard</Link>

// Programmatic navigation
router.visit('/dashboard');
router.post('/posts', formData);
```

## Page Components

Location: `resources/js/pages/`
```typescript
import { type FC } from 'react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

interface Props {
  user: User;
  posts: Post[];
}

const Dashboard: FC<Props> = ({ user, posts }) => {
  return (
    <AuthenticatedLayout>
      <h1>Welcome, {user.name}</h1>
    </AuthenticatedLayout>
  );
};

export default Dashboard;
```

## Layout Components

- `AuthenticatedLayout` - For logged-in users
- `GuestLayout` - For auth pages
- `DefaultLayout` - Base layout

## Props

Props come from Laravel controllers:
```php
return inertia('Dashboard', [
    'user' => new UserResource($user),
    'posts' => PostResource::collection($posts),
]);
```

TypeScript interface matches controller props.
