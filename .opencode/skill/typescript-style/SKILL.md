---
name: typescript-style
description: TypeScript coding standards for the project
compatibility: opencode
metadata:
  category: frontend
  domain: typescript
---

## Key Standards

- Strict mode enabled in tsconfig.json
- Named imports for components
- Type imports with `type` keyword: `import { type FC } from 'react'`
- Explicit return types on functions (where beneficial)
- Interfaces for props (not types)
- Use `@/` path alias for imports

## Patterns

```typescript
// Props interface
interface UserProfileProps {
  user: User;
  onUpdate?: (user: User) => void;
}

// Functional component with types
export const UserProfile: FC<UserProfileProps> = ({ user, onUpdate }) => {
  // Component logic
};

// Type imports
import { type FC, type ReactNode } from 'react';
import { type User } from '@/types/models';
```

## Utils

- Use `cn()` from `@/utils/utils` for conditional className
- Type utility functions explicitly

## Follow Existing Patterns

Check sibling components for TypeScript patterns in use.
