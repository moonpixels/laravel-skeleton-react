<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('new users can register', function (): void {
    $this->post(route('register'), getRegistrationData())
        ->assertValid()
        ->assertRedirect(route('dashboard.index'));

    $this->assertAuthenticated();

    $user = User::sole();

    expect($user)
        ->name->toBe('Test User')
        ->email->toBe('test@example.com')
        ->language->toBe(config('app.locale'))
        ->email_verified_at->toBeNull()
        ->and(Hash::check('password', $user->password))->toBeTrue();
});

test('users are registered with the default locale when no locale is provided', function (): void {
    $this->post(route('register'), getRegistrationData(['language' => null]))
        ->assertValid()
        ->assertRedirect(route('dashboard.index'));

    $user = User::sole();

    expect($user->language)->toBe(config('app.locale'));
});

test('users are registered with the default locale when an invalid locale is provided', function (): void {
    $this->post(route('register'), getRegistrationData(['language' => 'invalid-locale']))
        ->assertValid()
        ->assertRedirect(route('dashboard.index'));

    $user = User::sole();

    expect($user->language)->toBe(config('app.locale'));
});

function getRegistrationData(array $overrides = []): array
{
    return array_merge([
        'name' => 'Test User',
        'email' => 'test@example.com',
        'language' => 'en',
        'password' => 'password',
        'password_confirmation' => 'password',
    ], $overrides);
}
