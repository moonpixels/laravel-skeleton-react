---
name: writing-browser-tests
description: Writing browser tests for end-to-end user workflows and JavaScript interactions using Pest v4 with Playwright. Use when creating interactive features, JavaScript-heavy pages, multi-step workflows, or when verifying complete user journeys through the application.
---

# Writing Browser Tests

## When to Use This Skill

Use this skill **proactively** when:

- Creating interactive UI components with JavaScript
- Implementing multi-step user workflows (checkout, registration, onboarding)
- Creating features that rely on client-side JavaScript
- Testing React/Inertia page interactions
- Verifying form submissions with client-side validation
- Testing modals, dropdowns, or dynamic UI elements
- Testing real-time features or WebSocket interactions
- User mentions "browser test", "E2E test", or "end-to-end test"
- **Any user-facing feature that requires JavaScript or complex interactions**

Browser tests should be written **for critical user paths** and features that cannot be adequately tested with feature tests alone. They use Playwright under the hood for real browser automation.

## File Structure

Browser tests are organized by feature or user workflow:

```
tests/Browser/{FeatureName}Test.php
```

**Examples:**

- `tests/Browser/LoginTest.php`
- `tests/Browser/RegistrationTest.php`
- `tests/Browser/CheckoutTest.php`
- `tests/Browser/ProfileManagementTest.php`

**Naming Conventions:**

- Test file named after the feature: `{FeatureName}Test.php`
- Use descriptive feature names (e.g., `CheckoutTest`, not `OrderTest`)
- One test file per major feature or workflow
- Multiple test cases covering different scenarios

## Core Conventions

### 1. Test File Structure

All browser tests must follow this structure:

```php
<?php

declare(strict_types=1);

use App\Models\User;

test('users can complete the workflow', function (): void {
    // Arrange
    $user = User::factory()->create();
    
    // Act & Assert
    visit(route('feature.index'))
        ->fill('field', 'value')
        ->press('Submit')
        ->assertSee('Success message')
        ->assertRoute('dashboard.index');
});
```

**Key Requirements:**

- Always include `declare(strict_types=1);`
- Use `test('description', function (): void {})` syntax (Pest v4)
- Descriptive test names describing user actions
- Use `visit()` to navigate to pages
- Chain browser actions for readability
- Test function must have `void` return type
- Uses Playwright under the hood for browser automation

### 2. Pest Browser Testing Helpers

**Navigation:**

```php
// Visit a URL
visit(route('login'))
visit('https://example.com')

// Click links
click('Dashboard')
clickLink('View Profile')

// Go back
back()
```

**Form Interactions:**

```php
// Fill input fields
fill('email', 'test@example.com')
fill('password', 'password')

// Select from dropdown
select('country', 'US')

// Check/uncheck checkboxes
check('terms')
uncheck('newsletter')

// Choose radio button
choose('payment_method', 'credit_card')

// Submit form
press('Submit')
submit()
```

**Assertions:**

```php
// Text assertions
assertSee('Welcome')
assertDontSee('Error')

// URL/Route assertions
assertRoute('dashboard.index')
assertUrl('/dashboard')
assertPath('/dashboard')

// Element assertions
assertPresent('#element-id')
assertMissing('.error-message')

// Input value assertions
assertInputValue('email', 'test@example.com')
assertChecked('terms')
assertNotChecked('newsletter')
```

**Waiting:**

```php
// Wait for text to appear
waitForText('Loading complete')

// Wait for element
waitFor('.modal')

// Wait for navigation
waitForRoute('dashboard.index')

// Pause for specific time (use sparingly)
pause(1000) // milliseconds
```

**JavaScript Execution:**

```php
// Execute JavaScript
script("window.scrollTo(0, document.body.scrollHeight)")

// Get value from JavaScript
$value = script("return document.title")
```

### 3. Testing User Authentication

```php
test('users can login', function (): void {
    $user = User::factory()->create();

    visit(route('login'))
        ->fill('email', $user->email)
        ->fill('password', 'password')
        ->press('Log in')
        ->assertSee('Welcome')
        ->assertRoute('dashboard.index');
});

test('authenticated users can access dashboard', function (): void {
    $user = User::factory()->create();

    loginAs($user);

    visit(route('dashboard.index'))
        ->assertSee($user->name)
        ->assertSee('Dashboard');
});

// Helper function
function loginAs(User $user): void
{
    visit(route('login'))
        ->fill('email', $user->email)
        ->fill('password', 'password')
        ->press('Log in')
        ->assertRoute('dashboard.index');
}
```

### 4. Testing Multi-Step Workflows

```php
test('users can complete checkout process', function (): void {
    $user = User::factory()->create();
    $product = Product::factory()->create(['price' => 1000]);

    loginAs($user);

    // Step 1: Add to cart
    visit(route('products.show', $product))
        ->press('Add to Cart')
        ->assertSee('Added to cart');

    // Step 2: View cart
    click('Cart')
        ->assertRoute('cart.index')
        ->assertSee($product->name)
        ->assertSee('$10.00');

    // Step 3: Proceed to checkout
    press('Checkout')
        ->assertRoute('checkout.index');

    // Step 4: Fill shipping info
    fill('address', '123 Main St')
        ->fill('city', 'New York')
        ->select('country', 'US')
        ->press('Continue');

    // Step 5: Fill payment info
    fill('card_number', '4242424242424242')
        ->fill('expiry', '12/25')
        ->fill('cvc', '123')
        ->press('Place Order');

    // Step 6: Verify success
    waitForText('Order confirmed')
        ->assertRoute('orders.show')
        ->assertSee('Order #');
});
```

## Examples

### Example 1: Simple Login Test

```php
<?php

declare(strict_types=1);

use App\Models\User;

test('users can login', function (): void {
    $user = User::factory()->create();

    visit(route('login'))
        ->fill('email', $user->email)
        ->fill('password', 'password')
        ->press('Log in')
        ->assertSee('Welcome')
        ->assertRoute('dashboard.index');
});

test('users with invalid credentials cannot login', function (): void {
    visit(route('login'))
        ->fill('email', 'test@example.com')
        ->fill('password', 'wrong-password')
        ->press('Log in')
        ->assertSee('These credentials do not match our records.');
});
```

### Example 2: Registration Flow

```php
<?php

declare(strict_types=1);

use App\Models\User;

test('new users can register', function (): void {
    visit(route('register'))
        ->fill('name', 'Test User')
        ->fill('email', 'test@example.com')
        ->fill('password', 'password')
        ->fill('password_confirmation', 'password')
        ->select('language', 'en')
        ->check('terms')
        ->press('Register')
        ->assertRoute('dashboard.index')
        ->assertSee('Welcome, Test User');

    $user = User::query()->where('email', 'test@example.com')->sole();

    expect($user)
        ->name->toBe('Test User')
        ->email->toBe('test@example.com')
        ->language->toBe('en');
});

test('registration validates required fields', function (): void {
    visit(route('register'))
        ->press('Register')
        ->assertSee('The name field is required')
        ->assertSee('The email field is required')
        ->assertSee('The password field is required');
});
```

### Example 3: Interactive UI Testing

```php
<?php

declare(strict_types=1);

use App\Models\User;

test('users can update profile with image upload', function (): void {
    $user = User::factory()->create();

    loginAs($user);

    visit(route('profile.edit'))
        ->fill('name', 'Updated Name')
        ->attach('avatar', storage_path('testing/avatar.jpg'))
        ->press('Save')
        ->waitForText('Profile updated')
        ->assertSee('Updated Name');

    expect($user->fresh())
        ->name->toBe('Updated Name')
        ->avatar_path->not->toBeNull();
});

test('users can toggle notification settings', function (): void {
    $user = User::factory()->create([
        'email_notifications' => true,
    ]);

    loginAs($user);

    visit(route('settings.notifications'))
        ->assertChecked('email_notifications')
        ->uncheck('email_notifications')
        ->press('Save')
        ->waitForText('Settings saved')
        ->assertNotChecked('email_notifications');

    expect($user->fresh()->email_notifications)->toBeFalse();
});

test('modal opens and closes correctly', function (): void {
    $user = User::factory()->create();

    loginAs($user);

    visit(route('dashboard.index'))
        ->assertMissing('.modal')
        ->press('Open Modal')
        ->waitFor('.modal')
        ->assertSee('Modal Content')
        ->press('Close')
        ->waitForMissing('.modal')
        ->assertMissing('.modal');
});

function loginAs(User $user): void
{
    visit(route('login'))
        ->fill('email', $user->email)
        ->fill('password', 'password')
        ->press('Log in')
        ->assertRoute('dashboard.index');
}
```

## Anti-Patterns

### ❌ Don't Do This

```php
// Don't forget strict types
<?php
use App\Models\User;

// Don't skip return type
test('users can login', function () {
    // ...
});

// Don't use hardcoded URLs
visit('/login');
visit('/dashboard');

// Don't test everything with browser tests
test('validation rules work', function (): void {
    visit(route('form'))
        ->press('Submit')
        ->assertSee('The field is required');
});

// Don't skip factories
$user = new User;
$user->name = 'Test';
$user->email = 'test@example.com';
$user->save();

// Don't chain too many actions without assertions
visit(route('page'))
    ->fill('field1', 'value1')
    ->fill('field2', 'value2')
    ->fill('field3', 'value3')
    ->fill('field4', 'value4')
    ->press('Submit'); // No intermediate assertions!
```

### ✅ Do This Instead

```php
// Always include strict types
<?php

declare(strict_types=1);

// Always type hint return type
test('users can login', function (): void {
    // ...
});

// Use named routes
visit(route('login'));
visit(route('dashboard.index'));

// Use feature tests for simple validation
test('form requires email', function (): void {
    $this->post(route('form.submit'), [])
        ->assertInvalid(['email']);
});

// Use factories
$user = User::factory()->create();

// Add assertions between major steps
visit(route('checkout'))
    ->fill('address', '123 Main St')
    ->press('Continue')
    ->assertSee('Payment Information') // ✅ Intermediate assertion
    ->fill('card', '4242424242424242')
    ->press('Submit');
```

## Quality Standards

- All browser tests must pass PHPStan level 9
- 100% type coverage required
- Code formatted with Pint
- Tests must be independent and idempotent
- Use `RefreshDatabase` trait (configured in Pest.php)
- Browser tests should test critical user paths only
- Prefer feature tests for simple HTTP flows
- Use browser tests for JavaScript-heavy interactions
- Keep browser tests focused (one workflow per test)

## Browser Tests vs Feature Tests

**Use Browser Tests When:**

- Testing JavaScript interactions
- Testing multi-step user workflows
- Testing real-time UI updates
- Testing file uploads with preview
- Testing modals, tooltips, dropdowns
- Testing drag-and-drop functionality
- Testing any feature requiring real browser

**Use Feature Tests When:**

- Testing HTTP endpoints
- Testing validation rules
- Testing authentication/authorization
- Testing API responses
- Testing database operations
- No JavaScript required

## Running Tests

```bash
# Run all browser tests
php artisan test --testsuite=Browser

# Run specific browser test
php artisan test tests/Browser/LoginTest.php

# Run specific test by name
php artisan test --filter="users can login"

# Run in headed mode (see browser)
HEADED=1 php artisan test --testsuite=Browser
```

## Playwright Configuration

Browser tests use Playwright under the hood (configured in Pest.php):

- Chromium browser by default
- Headless mode by default (set `HEADED=1` to see browser)
- Screenshots saved on failure
- Uses `RefreshDatabase` trait for clean state

## Debugging Browser Tests

```php
// Take screenshot
screenshot('debug-screen.png')

// Pause execution (headless won't help)
pause(5000)

// Output page HTML
dump(script('return document.body.innerHTML'))

// Check console logs
// See Laravel Boost `browser-logs` tool

// Use headed mode to watch test
// HEADED=1 php artisan test tests/Browser/LoginTest.php
```

## Best Practices

1. **Test critical paths only** - Browser tests are slower than feature tests
2. **Use factories** - Always use factories to create test data
3. **Wait for dynamic content** - Use `waitForText()` or `waitFor()` for AJAX
4. **Keep tests focused** - One workflow per test, avoid testing too much
5. **Use helper functions** - Extract common actions like `loginAs()`
6. **Assert intermediate steps** - Don't just assert the final state
7. **Prefer feature tests** - Use browser tests only when necessary
8. **Clean up** - Use `RefreshDatabase` to ensure clean state

## Integration with Feature Tests

Browser tests verify complete workflows, feature tests verify business logic:

```php
// Feature test - Fast, tests business logic
test('order total is calculated correctly', function (): void {
    $user = User::factory()->create();
    $product = Product::factory()->create(['price' => 1000]);

    $this->actingAs($user)
        ->post(route('orders.store'), [
            'product_id' => $product->id,
            'quantity' => 2,
        ])
        ->assertRedirect();

    expect(Order::query()->sole()->total)->toBe(2000);
});

// Browser test - Slower, tests full user experience
test('users can complete checkout and see confirmation', function (): void {
    $user = User::factory()->create();
    $product = Product::factory()->create(['price' => 1000]);

    loginAs($user);

    visit(route('products.show', $product))
        ->press('Add to Cart')
        ->click('Checkout')
        ->fill('address', '123 Main St')
        ->press('Place Order')
        ->waitForText('Order confirmed')
        ->assertSee('Order #');
});
```

Write feature tests for business logic, write browser tests for user experience.
