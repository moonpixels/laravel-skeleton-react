---
name: react-radix-ui
description: Use shadcn/ui components (Radix UI + Tailwind) following project patterns
compatibility: opencode
metadata:
  category: frontend
  domain: react
---

## What shadcn/ui Is

Accessible component primitives with Radix UI and Tailwind styling.

## Location

- Base components: `resources/js/components/ui/`
- Already installed: Button, Dialog, Popover, Table, DatePicker, etc.

## Usage Pattern

```typescript
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export const MyComponent = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <p>Dialog content here</p>
      </DialogContent>
    </Dialog>
  );
};
```

## Available Components

Check `resources/js/components/ui/` for installed components.
Use shadcn MCP to add new components.

## Variant Patterns

Components use `class-variance-authority` for variants:
```typescript
<Button variant="default" | "destructive" | "outline" | "ghost">
<Button size="default" | "sm" | "lg" | "icon">
```

## Composition

Build complex components from primitives:
```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
```

## Styling

- Tailwind v4 classes
- CSS variables for theming
- Dark mode support built-in
