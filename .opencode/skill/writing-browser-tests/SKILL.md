---
name: writing-browser-tests
description: Writing browser tests for end-to-end user workflows and JavaScript interactions using Pest v4 with Playwright. Use MINIMALLY - only for core areas, happy paths, and functionality that CANNOT be tested with feature tests. Browser tests replace QA smoke testing, not feature tests.
---

# Writing Browser Tests

## Testing Philosophy

**Browser tests should be used minimally.** They are slow, complex, and should not duplicate feature test coverage. Think of browser tests as automated QA smoke tests.

### Testing Hierarchy

1. **Feature Tests (PRIMARY)** - Default for all business logic and HTTP endpoints
2. **Unit Tests (SUPPLEMENTARY)** - For complex, concentrated areas
3. **Browser Tests (MINIMAL)** - Only for core areas and JS interactions (you're here)

**Critical Rule: DO NOT write browser tests for functionality already covered by feature tests.** Feature tests are fast and comprehensive. Browser tests are for what feature tests cannot test.

## When to Use This Skill

Use this skill **sparingly and selectively** when:

- Testing **core critical workflows** that must work end-to-end (login, registration, checkout)
- Testing **happy path user journeys** that verify the app works in a real browser
- Testing functionality that **CANNOT** be tested with feature tests:
  - Client-side JavaScript interactions
  - Real browser rendering behavior
  - Complex React component interactions that require a real DOM
  - WebSocket/real-time features with client-side updates
  - File uploads with JavaScript preview/manipulation
  - Drag-and-drop functionality
  - Canvas/SVG interactions
- User explicitly mentions "browser test", "E2E test", "smoke test", or "end-to-end test"

**Important:** Browser tests are:

- **Slow** - 10-100x slower than feature tests
- **Complex** - More brittle, harder to debug
- **Expensive** - Require more maintenance

## What NOT to Use Browser Tests For

**❌ DO NOT use browser tests for:**

- Testing validation rules (use feature tests)
- Testing authentication/authorization logic (use feature tests)
- Testing API endpoints (use feature tests)
- Testing business logic (use feature tests or unit tests)
- Testing database operations (use feature tests)
- Anything that can be adequately tested with feature tests

**Browser tests replace manual QA smoke testing, not automated feature testing.**

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

- All browser tests must pass PHPStan level 8
- 100% type coverage required
- Code formatted with Pint
- Tests must be independent and idempotent
- Use `RefreshDatabase` trait (configured in Pest.php)
- **MINIMAL BROWSER TESTS** - Should have far fewer browser tests than feature tests
- **NO DUPLICATION** - Never test with browser tests what feature tests already cover
- Browser tests test **critical user paths only** (happy paths for smoke testing)
- Prefer feature tests for **all** HTTP flows and business logic
- Use browser tests **only** for JavaScript-heavy interactions that cannot be tested otherwise
- Keep browser tests focused (one happy path workflow per test)
- **Before writing a browser test, write feature tests for the same functionality first**

## Browser Tests vs Feature Tests vs Unit Tests

### Use Browser Tests (MINIMAL - You Are Here)

**Only use browser tests for what feature tests cannot test.** Use when:

- Testing **critical workflows** (login, registration, checkout) in a real browser
- Testing **happy path smoke tests** that verify core functionality works end-to-end
- Testing functionality that **requires JavaScript or real browser:**
  - Client-side validation that runs before server
  - Complex React component interactions
  - Real-time UI updates (WebSockets)
  - File uploads with JavaScript preview
  - Modals, tooltips, dropdowns with complex JS behavior
  - Drag-and-drop functionality
  - Canvas/SVG interactions

**Key Question:** Can this be tested with a feature test? If yes, use a feature test instead.

### Use Feature Tests (PRIMARY - Prefer This)

**Feature tests are fast and comprehensive.** Use for:

- Testing HTTP endpoints (always)
- Testing validation rules
- Testing authentication/authorization
- Testing API responses
- Testing database operations
- Testing form submissions
- Testing business logic
- **Most application functionality**

### Use Unit Tests (SUPPLEMENTARY)

**Unit tests are for complex isolated logic.** Use for:

- Particularly complex business rules
- Intricate algorithms
- Isolated domain logic with many edge cases

## Common Mistakes

### ❌ Don't Do This

```php
// Don't test validation with browser tests (use feature tests instead)
test('form validation works', function (): void {
    visit(route('register'))
        ->press('Submit')
        ->assertSee('The email field is required');
});

// Don't test simple form submissions (use feature tests instead)
test('users can update profile', function (): void {
    $user = User::factory()->create();
    loginAs($user);

    visit(route('profile.edit'))
        ->fill('name', 'New Name')
        ->press('Save')
        ->assertSee('Profile updated');
});
```

### ✅ Do This Instead

```php
// Feature test - Fast and comprehensive
test('registration requires email', function (): void {
    $this->post(route('register'), [])
        ->assertInvalid(['email']);
});

// Feature test - Fast and tests the same thing
test('users can update profile', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->patch(route('profile.update'), ['name' => 'New Name'])
        ->assertValid()
        ->assertRedirect();

    expect($user->fresh()->name)->toBe('New Name');
});

// Browser test - Only for what feature tests can't test
test('profile image preview updates when file selected', function (): void {
    $user = User::factory()->create();
    loginAs($user);

    visit(route('profile.edit'))
        ->attach('avatar', storage_path('testing/avatar.jpg'))
        ->waitFor('.image-preview') // JavaScript-driven preview
        ->assertPresent('.image-preview img'); // Real DOM interaction
});
```

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

1. **MINIMAL USAGE** - Browser tests are slow and complex. Use sparingly for smoke tests.
2. **DON'T DUPLICATE** - Never test with browser tests what feature tests can test
3. **SMOKE TEST MENTALITY** - Think "Would a QA tester manually check this?" not "Does this logic work?"
4. **Critical paths only** - Login, registration, checkout happy paths
5. **JavaScript-only features** - Only test features that require real browser/JavaScript
6. **Use factories** - Always use factories to create test data
7. **Wait for dynamic content** - Use `waitForText()` or `waitFor()` for AJAX
8. **Use helper functions** - Extract common actions like `loginAs()`
9. **Prefer feature tests** - Always prefer feature tests when possible
10. **Clean up** - Use `RefreshDatabase` to ensure clean state

### The Golden Rule

**Before writing a browser test, ask: "Can I test this with a feature test?"**

If yes, write a feature test instead. Browser tests are for:

- Core workflow smoke tests (happy paths only)
- Functionality that literally cannot be tested without a real browser

## Relationship with Feature Tests

**Feature tests are primary. Browser tests are supplementary smoke tests.**

### Example: Proper Test Distribution

```php
// ✅ Feature tests (PRIMARY) - Test all the logic
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

test('order requires valid payment method', function (): void {
    // ... feature test for validation
});

test('order updates inventory', function (): void {
    // ... feature test for inventory logic
});

// ✅ Browser test (MINIMAL) - Just the happy path smoke test
// This assumes all the logic is already tested via feature tests above
test('users can complete checkout happy path', function (): void {
    $user = User::factory()->create();
    $product = Product::factory()->create(['price' => 1000]);

    loginAs($user);

    // Only testing the critical path works end-to-end in a real browser
    visit(route('products.show', $product))
        ->press('Add to Cart') // Assumes JS cart interaction
        ->click('Checkout')
        ->fill('address', '123 Main St')
        ->press('Place Order')
        ->waitForText('Order confirmed') // JS-driven confirmation
        ->assertSee('Order #');
});
```

**Guideline:**

- Feature tests: Test ALL the logic comprehensively (validation, edge cases, business rules)
- Browser tests: Test ONE happy path to verify it works in a real browser

You should have many feature tests and very few browser tests.
