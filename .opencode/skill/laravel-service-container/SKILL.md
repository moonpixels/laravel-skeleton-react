---
name: laravel-service-container
description: Use Laravel's service container for dependency injection
compatibility: opencode
metadata:
  category: architecture
  domain: backend
---

## What the Service Container Is

Laravel's IoC container manages class dependencies and performs dependency injection.

## Constructor Injection (Preferred)

```php
final readonly class RegisterUserAction
{
    public function __construct(
        private Localisation $localisation,
        private ImageProcessor $processor
    ) {}

    public function handle(RegisterData $data): User
    {
        // Use $this->localisation, $this->processor
    }
}
```

## Using resolve() Helper

For conditional or late binding:

```php
public function handle(): void
{
    $processor = resolve(ImageProcessor::class);
    $processor->process();
}
```

## Binding in Service Providers

In `App\Providers\AppServiceProvider`:

```php
public function register(): void
{
    // Bind interface to implementation
    $this->app->bind(PaymentGatewayInterface::class, StripeGateway::class);

    // Singleton binding
    $this->app->singleton(Cache::class, RedisCache::class);

    // Bind with closure
    $this->app->bind(ApiClient::class, function ($app) {
        return new ApiClient($app->config->get('api.key'));
    });
}
```

## Controller Injection

Controllers automatically resolve dependencies:

```php
public function store(
    RegisterRequest $request,
    RegisterUserAction $action
): RedirectResponse {
    $user = $action->handle($request->toDTO());
    return redirect()->route('dashboard');
}
```

## Method Injection

```php
public function handle(Request $request, UserRepository $users): void
{
    // Dependencies resolved automatically
}
```

## When to Use Constructor vs resolve()

**Constructor Injection (preferred):**

- Always-needed dependencies
- Testability is important
- Clear dependency declaration

**resolve() Helper:**

- Conditional dependencies
- Circular dependency issues
- Late binding required
- Simple one-off resolutions

## Contextual Binding

```php
$this->app->when(PhotoController::class)
    ->needs(Storage::class)
    ->give(function () {
        return Storage::disk('s3');
    });
```

## Testing with Mocks

```php
test('it registers user', function () {
    $localisation = Mockery::mock(Localisation::class);
    $localisation->shouldReceive('getDefaultLocale')->andReturn('en-GB');

    $this->app->instance(Localisation::class, $localisation);

    $action = resolve(RegisterUserAction::class);
    // Test action
});
```

## Anti-Patterns

❌ Using `new ClassName()` for framework services
❌ Not type-hinting dependencies
❌ Overusing resolve() when constructor injection works
❌ Circular dependencies (redesign instead)
