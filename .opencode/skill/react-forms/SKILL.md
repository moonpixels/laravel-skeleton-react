---
name: react-forms
description: Create forms with React Hook Form and Zod validation
compatibility: opencode
metadata:
  category: frontend
  domain: react
---

## Form Pattern

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { router } from '@inertiajs/react';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

type FormData = z.infer<typeof schema>;

export const RegisterForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    router.post('/register', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
      
      <input {...register('email')} type="email" />
      {errors.email && <span>{errors.email.message}</span>}
      
      <button type="submit">Submit</button>
    </form>
  );
};
```

## Key Patterns

- Zod for validation schema
- React Hook Form for state management
- Type inference from Zod schema
- Inertia for form submission
- Display validation errors from backend

## Syncing with Backend

Backend validation (Form Request) and frontend validation (Zod) should match.
