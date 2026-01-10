---
name: writing-unit-tests
description: Writing unit tests for isolated business logic, Actions, DTOs, Services, and domain code using Pest v4. SUPPLEMENTARY to feature tests - use for complex, concentrated areas of the codebase that benefit from focused isolated testing. Feature tests should be your primary approach.
---

# Writing Unit Tests

## Testing Philosophy

**Unit tests are supplementary to feature tests.** Feature tests are the primary testing approach for all business logic. Unit tests should be "sprinkled in" for particularly complex areas that benefit from isolated, focused testing.

### Testing Hierarchy

1. **Feature Tests (PRIMARY)** - Default for all business logic and HTTP endpoints
2. **Unit Tests (SUPPLEMENTARY)** - For complex, concentrated areas (you're here)
3. **Browser Tests (MINIMAL)** - Only for core areas and functionality that cannot be tested with feature tests

## When to Use This Skill

Use this skill **selectively** when you have particularly complex logic that benefits from isolated testing:

- **Complex** Action classes with intricate business rules that warrant focused testing
- **Complex** Service classes in `app/Support/` with sophisticated algorithms
- **Complex** Helper functions with edge cases that need thorough coverage
- **Complex** Model methods (business logic, scopes, accessors, mutators) with intricate rules
- Isolated domain logic where mocking dependencies provides clearer test cases
- User explicitly mentions "unit test", "test in isolation", or "mock dependencies"

**Important:** Unit tests supplement, not replace, feature tests. Most Actions, DTOs, Services, and domain code should first be tested via feature tests. Add unit tests when:

- The logic is particularly complex and benefits from focused testing
- You need to test many edge cases or permutations
- Mocking dependencies makes the test clearer than a full integration test
- The complexity warrants additional test coverage beyond feature tests

**Default Approach:** Write feature tests first. Add unit tests for complex areas that need additional isolated testing coverage.

## File Structure

Unit tests mirror the application structure, organized by domain:

```
tests/Unit/{Domain}/{ClassName}Test.php
```

**Examples:**

- `tests/Unit/Support/Localisation/LocalisationTest.php`
- `tests/Unit/Support/ImageProcessor/InterventionImageProcessorTest.php`
- `tests/Unit/Helpers/HelpersTest.php`
- `tests/Unit/Models/UserTest.php`
- `tests/Unit/Mixins/RequestMixinTest.php`

**Naming Conventions:**

- Test file named after the class: `{ClassName}Test.php`
- One test file per class
- Multiple test cases covering all public methods

## Core Conventions

### 1. Test File Structure

All unit tests must follow this structure:

```php
<?php

declare(strict_types=1);

use App\Actions\Domain\MyAction;
use App\DTOs\Domain\MyData;

test('it can perform expected behavior', function (): void {
    // Arrange
    $action = createAction();
    $data = MyData::from(['field' => 'value']);

    // Act
    $result = $action->handle($data);

    // Assert
    expect($result)
        ->toBeInstanceOf(ExpectedClass::class)
        ->property->toBe('expected value');
});

// Helper functions at bottom of file
function createAction(): MyAction
{
    return new MyAction(
        dependency: mock(DependencyClass::class)
    );
}
```

**Key Requirements:**

- Always include `declare(strict_types=1);`
- Use `test('it can...', function (): void {})` syntax (Pest v4)
- Descriptive test names starting with "it can" or "it throws"
- Follow Arrange-Act-Assert (AAA) pattern
- Use `expect()` for assertions
- Helper functions at bottom of file
- Test function must have `void` return type
- Avoid database when possible (use mocks/fakes)

### 2. Pest Testing Helpers

**Expect Assertions:**

```php
// Value assertions
expect($value)->toBe('expected')
expect($value)->toEqual(['key' => 'value'])
expect($value)->toBeTrue()
expect($value)->toBeFalse()
expect($value)->toBeNull()
expect($value)->toBeEmpty()

// Type assertions
expect($value)->toBeString()
expect($value)->toBeInt()
expect($value)->toBeArray()
expect($value)->toBeInstanceOf(User::class)

// Collection assertions
expect($collection)->toHaveCount(3)
expect($array)->toHaveKey('key')
expect($array)->toHaveKeys(['key1', 'key2'])

// Chaining assertions
expect($user)
    ->name->toBe('John Doe')
    ->email->toBe('john@example.com')
    ->and($user->isActive())->toBeTrue();
```

**Exception Testing:**

```php
test('it throws exception for invalid input', function (): void {
    $action = createAction();

    $action->handle(invalidData());
})->throws(InvalidArgumentException::class);

test('it throws exception with message', function (): void {
    $action = createAction();

    $action->handle(invalidData());
})->throws(InvalidArgumentException::class, 'Expected error message');
```

**Mocking Dependencies:**

```php
test('it calls dependency method', function (): void {
    $mock = mock(EmailService::class);
    $mock->shouldReceive('send')
        ->once()
        ->with(Mockery::type(Email::class))
        ->andReturn(true);

    $action = new SendEmailAction($mock);

    $result = $action->handle($data);

    expect($result)->toBeTrue();
});
```

### 3. Testing Actions

Actions should be tested in isolation:

```php
<?php

declare(strict_types=1);

use App\Actions\User\DeleteUserAction;
use App\DTOs\User\DeleteUserData;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

test('it can delete a user and their avatar', function (): void {
    Storage::fake('public');

    $user = User::factory()->create([
        'avatar_path' => 'avatars/test.jpg',
    ]);

    Storage::disk('public')->put('avatars/test.jpg', 'content');

    $action = new DeleteUserAction;

    $action->handle(DeleteUserData::from(['userId' => $user->id]));

    $this->assertDatabaseMissing('users', ['id' => $user->id]);
    Storage::disk('public')->assertMissing('avatars/test.jpg');
});

test('it can delete a user without avatar', function (): void {
    $user = User::factory()->create(['avatar_path' => null]);

    $action = new DeleteUserAction;

    $action->handle(DeleteUserData::from(['userId' => $user->id]));

    $this->assertDatabaseMissing('users', ['id' => $user->id]);
});
```

### 4. Testing Services

Test services without HTTP dependencies:

```php
<?php

declare(strict_types=1);

use App\Support\Localisation\Localisation;

test('it can get the ISO 15897 locale', function (): void {
    $localisation = createLocalisation();

    expect($localisation->getIso15897Locale('en-GB'))->toBe('en_GB')
        ->and($localisation->getIso15897Locale('en_GB'))->toBe('en_GB')
        ->and($localisation->getIso15897Locale('en'))->toBe('en');
});

test('it can check if a locale is supported', function (): void {
    $localisation = createLocalisation();

    expect($localisation->isSupportedLocale('en_GB'))->toBeTrue()
        ->and($localisation->isSupportedLocale('fr_FR'))->toBeTrue()
        ->and($localisation->isSupportedLocale('invalid'))->toBeFalse();
});

test('it throws an exception when setting an unsupported locale', function (): void {
    $localisation = createLocalisation();

    $localisation->setLocale('invalid');
})->throws(InvalidArgumentException::class);

function createLocalisation(): Localisation
{
    return new Localisation(
        defaultLocale: 'en_GB',
        supportedLocales: [
            'en_GB' => ['name' => 'English', 'nativeName' => 'English', 'regional' => 'en_GB'],
            'fr_FR' => ['name' => 'French', 'nativeName' => 'Français', 'regional' => 'fr_FR'],
        ],
        request: new Request
    );
}
```

### 5. Helper Functions

Place helper functions at the bottom of the test file:

```php
function createAction(
    ?DependencyOne $depOne = null,
    ?DependencyTwo $depTwo = null
): MyAction {
    return new MyAction(
        dependencyOne: $depOne ?? new DependencyOne,
        dependencyTwo: $depTwo ?? new DependencyTwo
    );
}

function createValidData(array $overrides = []): MyData
{
    return MyData::from(array_merge([
        'field1' => 'value1',
        'field2' => 'value2',
    ], $overrides));
}
```

## Examples

### Example 1: Testing Model Business Logic

```php
<?php

declare(strict_types=1);

use App\Models\User;

test('it can determine if user is admin', function (): void {
    $admin = User::factory()->create(['role' => 'admin']);
    $user = User::factory()->create(['role' => 'user']);

    expect($admin->isAdmin())->toBeTrue()
        ->and($user->isAdmin())->toBeFalse();
});

test('it can get user full name', function (): void {
    $user = User::factory()->create([
        'first_name' => 'John',
        'last_name' => 'Doe',
    ]);

    expect($user->fullName())->toBe('John Doe');
});

test('it can check if user has verified email', function (): void {
    $verified = User::factory()->create(['email_verified_at' => now()]);
    $unverified = User::factory()->create(['email_verified_at' => null]);

    expect($verified->hasVerifiedEmail())->toBeTrue()
        ->and($unverified->hasVerifiedEmail())->toBeFalse();
});
```

### Example 2: Testing Helper Functions

```php
<?php

declare(strict_types=1);

test('it can format currency', function (): void {
    expect(formatCurrency(1000))->toBe('$10.00')
        ->and(formatCurrency(1050))->toBe('$10.50')
        ->and(formatCurrency(0))->toBe('$0.00');
});

test('it can truncate string', function (): void {
    expect(truncate('Hello World', 5))->toBe('Hello...')
        ->and(truncate('Hello', 10))->toBe('Hello')
        ->and(truncate('', 5))->toBe('');
});

test('it can generate slug from string', function (): void {
    expect(slugify('Hello World'))->toBe('hello-world')
        ->and(slugify('Test & Demo'))->toBe('test-and-demo')
        ->and(slugify('  Spaces  '))->toBe('spaces');
});
```

### Example 3: Testing Action with Dependencies

```php
<?php

declare(strict_types=1);

use App\Actions\Order\ProcessOrderAction;
use App\DTOs\Order\ProcessOrderData;
use App\Models\Order;
use App\Services\PaymentGateway;
use Illuminate\Support\Facades\Event;

test('it can process order with successful payment', function (): void {
    Event::fake();

    $paymentGateway = mock(PaymentGateway::class);
    $paymentGateway->shouldReceive('charge')
        ->once()
        ->with(1000, 'tok_visa')
        ->andReturn(['id' => 'ch_123', 'status' => 'succeeded']);

    $order = Order::factory()->create(['total' => 1000]);

    $action = new ProcessOrderAction($paymentGateway);

    $result = $action->handle(ProcessOrderData::from([
        'orderId' => $order->id,
        'paymentToken' => 'tok_visa',
    ]));

    expect($result)
        ->toBeInstanceOf(Order::class)
        ->status->toBe('paid')
        ->payment_id->toBe('ch_123');

    Event::assertDispatched(OrderProcessed::class);
});

test('it throws exception when payment fails', function (): void {
    $paymentGateway = mock(PaymentGateway::class);
    $paymentGateway->shouldReceive('charge')
        ->once()
        ->andThrow(new PaymentException('Card declined'));

    $order = Order::factory()->create();

    $action = new ProcessOrderAction($paymentGateway);

    $action->handle(ProcessOrderData::from([
        'orderId' => $order->id,
        'paymentToken' => 'tok_visa',
    ]));
})->throws(PaymentException::class, 'Card declined');
```

## Anti-Patterns

### ❌ Don't Do This

```php
// Don't forget strict types
<?php
use App\Actions\MyAction;

// Don't skip return type
test('it can do something', function () {
    // ...
});

// Don't use unclear test names
test('test 1', function (): void {
    // ...
});

// Don't test multiple behaviors in one test
test('it can do everything', function (): void {
    expect($service->methodOne())->toBeTrue();
    expect($service->methodTwo())->toBe('value');
    expect($service->methodThree())->toBeNull();
});

// Don't use database when unnecessary
test('it can calculate total', function (): void {
    $order = Order::factory()->create(['subtotal' => 100]);
    expect($order->calculateTotal())->toBe(110);
});

// Don't skip helper functions
test('it can process data', function (): void {
    $action = new MyAction(
        new DependencyOne('arg1', 'arg2'),
        new DependencyTwo('arg3', 'arg4')
    );
    // ...
});
```

### ✅ Do This Instead

```php
// Always include strict types
<?php

declare(strict_types=1);

// Always type hint return type
test('it can do something', function (): void {
    // ...
});

// Use clear, descriptive names
test('it can calculate order total with tax', function (): void {
    // ...
});

// One behavior per test
test('it can validate email format', function (): void {
    expect($validator->isValidEmail('test@example.com'))->toBeTrue();
});

test('it can check password strength', function (): void {
    expect($validator->isStrongPassword('Test123!'))->toBeTrue();
});

// Avoid database when possible
test('it can calculate total', function (): void {
    $calculator = new OrderCalculator;
    expect($calculator->calculateTotal(100, 0.1))->toBe(110);
});

// Use helper functions
function createAction(): MyAction
{
    return new MyAction(
        dependencyOne: new DependencyOne('arg1', 'arg2'),
        dependencyTwo: new DependencyTwo('arg3', 'arg4')
    );
}
```

## Quality Standards

- All unit tests must pass PHPStan level 8
- 100% type coverage required
- Code formatted with Pint
- 90% overall test coverage required
- Tests must be independent and run in any order
- Use `LazilyRefreshDatabase` only when necessary (configured in Pest.php)
- Prefer mocks/fakes over real dependencies
- Every public method should have unit tests
- Test edge cases, not just happy paths

## Unit Tests vs Feature Tests vs Browser Tests

### When to Choose Unit Tests (You Are Here)

**Unit tests are for complex, concentrated logic that benefits from isolated testing.** Use when:

- The logic is particularly complex with many edge cases
- You're testing intricate algorithms or business rules
- Mocking dependencies provides clearer, more focused test cases
- You want to supplement feature test coverage with focused isolation tests
- Testing many permutations of inputs/outputs

**Example:** A complex pricing calculation service with many rules, discounts, and edge cases. Feature tests verify it works end-to-end, unit tests verify each calculation rule in isolation.

### When to Use Feature Tests (Primary Approach)

**Feature tests should be your default.** Use for:

- Testing HTTP endpoints (always)
- Testing full request/response cycle
- Testing authentication/authorization
- Testing validation rules
- Testing Actions called from controllers
- **Most business logic in the application**

Feature tests are fast and test the full integration. Start here, add unit tests for complex areas.

### When to Use Browser Tests (Minimal Usage)

**Browser tests are for critical user journeys and JavaScript interactions.** Use sparingly for:

- Core workflows (login, registration, checkout)
- Happy path user journeys
- Functionality that cannot be tested with feature tests
- **NOT for business logic already covered by feature tests**

## Running Tests

```bash
# Run all unit tests
php artisan test --testsuite=Unit

# Run specific test file
php artisan test tests/Unit/Support/Localisation/LocalisationTest.php

# Run with coverage
php artisan test --coverage --min=90

# Run specific test by name
php artisan test --filter="it can get the ISO 15897 locale"
```

## Integration with Feature Tests

**Feature tests are primary, unit tests are supplementary.** Most code should be tested via feature tests first. Add unit tests for complex areas that warrant additional focused coverage.

### Example: Supplementing Feature Tests with Unit Tests

```php
// Feature test (PRIMARY) - Tests full HTTP flow
// This should ALWAYS be written first
test('new users can register with locale', function (): void {
    $this->post(route('register'), [
        'name' => 'Test',
        'email' => 'test@example.com',
        'language' => 'fr',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertRedirect(route('dashboard.index'));

    expect(User::query()->sole()->language)->toBe('fr_FR');
});

// Unit test (SUPPLEMENTARY) - Tests Action in isolation
// Only add this if the locale handling logic is particularly complex
// and warrants additional focused testing beyond the feature test
test('it can register user with correct locale normalization', function (): void {
    $localisation = createLocalisation();
    $action = new RegisterUserAction($localisation);

    // Test complex edge cases that are harder to test via HTTP
    $user = $action->handle(RegisterData::from([
        'name' => 'Test',
        'email' => 'test@example.com',
        'language' => 'fr', // Tests normalization from 'fr' to 'fr_FR'
        'password' => 'password',
    ]));

    expect($user->language)->toBe('fr_FR');
});
```

**Guideline:** If you're only writing the feature test, that's often sufficient. Only add unit tests when the complexity justifies additional focused coverage.
