---
name: laravel-providers
description: Create service providers for registering and bootstrapping services
compatibility: opencode
metadata:
  category: architecture
  domain: backend
---

## What Service Providers Are

Service providers register bindings, bootstrap services, and configure the application.

## Location

- **Location**: `app/Providers/`

## Structure Pattern

```php
<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

final class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register bindings in the container
        $this->app->bind(PaymentGateway::class, StripeGateway::class);

        $this->app->singleton(Cache::class, function ($app) {
            return new RedisCache($app->config->get('cache.redis'));
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Bootstrap application (run after all providers registered)
        View::share('siteName', config('app.name'));

        Model::unguard();
    }
}
```

## Key Methods

**`register()`:**

- Register service container bindings
- Should NOT interact with other services
- Called before `boot()` on all providers

**`boot()`:**

- Bootstrap application
- Can use other registered services
- Called after all providers' `register()` methods

## When to Create Custom Providers

- Registering third-party packages
- Binding interfaces to implementations
- Publishing package config/assets
- Registering event listeners
- View composers
- Route model binding

## Registration in bootstrap/app.php

```php
->withProviders([
    PaymentServiceProvider::class,
])
```

## Deferred Providers

For performance, defer loading:

```php
final class PaymentServiceProvider extends ServiceProvider implements DeferrableProvider
{
    public function provides(): array
    {
        return [PaymentGateway::class];
    }
}
```

## Common Patterns

**Binding Interface to Implementation:**

```php
public function register(): void
{
    $this->app->bind(
        PaymentGatewayInterface::class,
        StripeGateway::class
    );
}
```

**Singleton Binding:**

```php
public function register(): void
{
    $this->app->singleton(ApiClient::class, function ($app) {
        return new ApiClient($app->config->get('api.key'));
    });
}
```

**View Composers:**

```php
public function boot(): void
{
    View::composer('layouts.app', function ($view) {
        $view->with('currentUser', auth()->user());
    });
}
```

**Event Listeners:**

```php
public function boot(): void
{
    Event::listen(OrderShipped::class, SendShipmentNotification::class);
}
```

## Anti-Patterns

❌ Business logic in providers (use Actions)
❌ Using boot() when register() is appropriate
❌ Heavy processing in boot() (slows app startup)
❌ Not deferring when possible
