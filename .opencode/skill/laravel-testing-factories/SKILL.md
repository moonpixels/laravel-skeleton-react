---
name: laravel-testing-factories
description: Use Laravel model factories for generating test data
compatibility: opencode
metadata:
  category: testing
  domain: backend
---

## What Factories Are

Factories generate fake model instances for testing.

## Location

- **Location**: `database/factories/`
- **Naming**: `{Model}Factory.php` (e.g., `UserFactory.php`, `PostFactory.php`)

## Basic Usage

```php
// Create and persist to database
$user = User::factory()->create();

// Create multiple
$users = User::factory()->count(3)->create();

// Make without persisting
$user = User::factory()->make();

// Override attributes
$user = User::factory()->create([
    'email' => 'specific@example.com',
    'name' => 'Specific Name',
]);
```

## Factory States

Check existing factories for states before creating custom data:

```php
// Using existing states
$user = User::factory()->unverified()->create();
$user = User::factory()->withTwoFactorAuth()->create();
$admin = User::factory()->admin()->create();
```

## Factory Definition Pattern

```php
<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<User>
 */
final class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => bcrypt('password'),
            'language' => 'en-GB',
            'email_verified_at' => now(),
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_admin' => true,
        ]);
    }
}
```

## Using Relationships

```php
// Create user with posts
$user = User::factory()
    ->hasPosts(3)
    ->create();

// Create post with user
$post = Post::factory()
    ->forUser()
    ->create();

// Manually attach relationships
$user = User::factory()->create();
$posts = Post::factory()->count(5)->create([
    'user_id' => $user->id,
]);
```

## Using fake() Helper

Use `fake()` or `$this->faker` in tests following existing patterns:

```php
test('user can create post', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('posts.store'), [
            'title' => fake()->sentence(),
            'content' => fake()->paragraphs(3, true),
        ])
        ->assertRedirect();
});
```

## Common Faker Methods

- `fake()->name()` - Full name
- `fake()->firstName()` - First name
- `fake()->email()` - Email address
- `fake()->safeEmail()` - Safe email (for testing)
- `fake()->password()` - Random password
- `fake()->sentence()` - Random sentence
- `fake()->paragraph()` - Random paragraph
- `fake()->text(200)` - Random text (max 200 chars)
- `fake()->numberBetween(1, 100)` - Random number
- `fake()->randomElement(['a', 'b', 'c'])` - Pick random from array
- `fake()->boolean()` - Random true/false

## Sequences

For predictable variations:

```php
$users = User::factory()
    ->count(3)
    ->sequence(
        ['name' => 'First User'],
        ['name' => 'Second User'],
        ['name' => 'Third User'],
    )
    ->create();
```

## Callbacks

After creating or making:

```php
$user = User::factory()
    ->afterCreating(function (User $user) {
        $user->assignRole('admin');
    })
    ->create();
```

## When to Use Factories

- All test data generation
- Seeding development database
- Creating related models
- Testing with realistic data
- Avoiding hardcoded test data

## When to Check Existing States

Before creating custom factory data:

```php
// ❌ Don't do this if state exists
$user = User::factory()->create([
    'email_verified_at' => null,
]);

// ✅ Do this - check factory for existing state
$user = User::factory()->unverified()->create();
```

## Anti-Patterns

❌ Not using factories (hardcoding test data)
❌ Not checking for existing factory states
❌ Creating factories for every test (reuse when possible)
❌ Complex logic in factory definitions
❌ Not following existing faker patterns in codebase
