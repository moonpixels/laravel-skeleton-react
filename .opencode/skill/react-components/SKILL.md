---
name: react-components
description: Create React components with TypeScript following project patterns
compatibility: opencode
metadata:
  category: frontend
  domain: react
---

## Structure Pattern

```typescript
import { type FC } from 'react';
import { cn } from '@/utils/utils';

interface ComponentNameProps {
  className?: string;
  // Other props
}

export const ComponentName: FC<ComponentNameProps> = ({ 
  className,
  ...props 
}) => {
  return (
    <div className={cn('', className)}>
      {/* Component content */}
    </div>
  );
};
```

## Key Patterns

- Location: `resources/js/components/`
- Functional components with hooks
- TypeScript with strict typing
- Import alias: `@/` for `resources/js/`
- Named exports (not default)
- Props interface with descriptive name
- Use `cn()` for conditional className merging
- Tailwind CSS v4 for styling

## Common Imports

```typescript
import { type FC, useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/utils';
```

## When to Use

- Reusable UI elements
- Complex feature components
- Page sections
- Layout components
