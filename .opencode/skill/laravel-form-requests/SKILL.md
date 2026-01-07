---
name: laravel-form-requests
description: Create Form Request classes for validation logic
compatibility: opencode
metadata:
  category: architecture
  domain: backend
---

## What Form Requests Are

Form Requests handle all validation logic, keeping controllers clean.

## Naming & Location

- **Naming**: Action + `Request` (e.g., `RegisterRequest`, `UpdateUserRequest`, `CreatePostRequest`)
- **Location**: `app/Http/Requests/{optional-domain}/`

## Structure Pattern

```php
<?php

declare(strict_types=1);

namespace App\Http\Requests\Auth;

use App\DTOs\Auth\RegisterData;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

final class RegisterRequest extends FormRequest
{
    /**
     * @return array<string, list<ValidationRule|string>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users'],
            'language' => ['sometimes', 'nullable', 'string'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ];
    }

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

## Key Patterns

- Use `final class` for Form Requests
- All validation in `rules()` method
- Include PHPDoc type hints for `rules()` return type
- Add `toDTO()` method to convert validated data to DTO
- Use named parameters in DTO construction
- Check sibling Form Requests for array vs string validation patterns
- Authorization logic in `authorize()` method if needed

## Validation Rules

- Use array syntax for rules: `['required', 'string', 'max:255']`
- Use Laravel's validation rule objects: `Password::defaults()`, `Rule::unique()`
- For arrays: `'items' => ['required', 'array']`, `'items.*' => ['string']`

## Custom Error Messages

```php
public function messages(): array
{
    return [
        'email.unique' => 'This email is already registered.',
        'password.confirmed' => 'Password confirmation does not match.',
    ];
}
```

## Usage in Controllers

```php
public function store(RegisterRequest $request, RegisterUserAction $action): RedirectResponse
{
    $data = $request->toDTO();
    $user = $action->handle($data);

    return redirect()->route('dashboard');
}
```

## When to Use Form Requests

- All form validation (never validate in controllers)
- Converting validated data to DTOs
- Authorization checks specific to the request
- Custom validation messages

## Anti-Patterns

❌ Validation logic in controllers
❌ Missing `toDTO()` method (passing arrays to Actions)
❌ Using arrays without `toDTO()` conversion
❌ Mixing validation and business logic
