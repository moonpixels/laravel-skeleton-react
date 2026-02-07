# Pest 4 Examples

Use these patterns for more advanced test scenarios.

## Running Tests

- Entire suite: `php artisan test --compact`
- Specific file: `php artisan test --compact tests/Feature/UsersTest.php`
- Filter by name: `php artisan test --compact --filter=creates_user`

## Better Assertions

- Prefer semantic response assertions instead of raw status codes.
- Example: `assertSuccessful()` over `assertStatus(200)`.
- Example: `assertNotFound()` over `assertStatus(404)`.

## Datasets

```php
it('validates email values', function (string $email) {
    expect($email)->toContain('@');
})->with([
    'admin' => 'admin@example.com',
    'support' => 'support@example.com',
]);
```

## Mocking

- Import helper: `use function Pest\Laravel\mock;`
- Mock external integrations and focus assertions on observable behavior.

## Browser and Architecture Tests

- Browser tests live in `tests/Browser` and should assert no JS console/runtime errors when relevant.
- Architecture tests enforce project conventions (namespaces, suffixes, dependencies).

## Common Pitfalls

- Overusing integration-heavy tests for simple pure logic.
- Forgetting to use factories or database refresh traits where isolation is required.
