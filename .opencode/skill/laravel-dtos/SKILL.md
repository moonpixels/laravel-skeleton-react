---
name: laravel-dtos
description: Create DTOs for structured data transfer between application layers
compatibility: opencode
metadata:
  category: architecture
  domain: backend
---

## What DTOs Are

DTOs (Data Transfer Objects) carry data between layers without business logic.

## Naming & Location

- **Naming**: Describe the data purpose (e.g., `RegisterData`, `UpdateUserData`, `CreatePostData`)
- **Location**: `app/DTOs/{Domain}/`
  - `app/DTOs/Auth/` - Authentication data
  - `app/DTOs/User/` - User data
  - `app/DTOs/Todo/` - Todo data

## Structure Pattern

```php
<?php

declare(strict_types=1);

namespace App\DTOs\Auth;

final readonly class RegisterData
{
    public function __construct(
        public string $name,
        public string $email,
        public string $language,
        public string $password,
    ) {}
}
```

## Key Patterns

- Use `final readonly class` for all DTOs
- Use constructor property promotion for properties
- All properties are public readonly
- No methods except simple getters if absolutely needed
- No business logic - pure data containers

## Creating DTOs from Form Requests

```php
final class RegisterRequest extends FormRequest
{
    public function toDTO(): RegisterData
    {
        return new RegisterData(
            name: $this->validated('name'),
            email: $this->validated('email'),
            language: $this->validated('language') ?? 'en-GB',
            password: $this->validated('password'),
        );
    }
}
```

## Usage in Actions

```php
final readonly class RegisterUserAction
{
    public function handle(RegisterData $data): User
    {
        return User::query()->create([
            'name' => $data->name,
            'email' => $data->email,
            'language' => $data->language,
            'password' => Hash::make($data->password),
        ]);
    }
}
```

## When to Use DTOs

- Passing validated form data to Actions
- Returning complex data from Actions
- API request/response data structures
- Passing data between services

## Anti-Patterns

❌ Adding business logic to DTOs
❌ Using arrays instead of DTOs
❌ Mutable properties (not readonly)
❌ Using protected/private properties in DTOs
