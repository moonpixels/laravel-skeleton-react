<?php

declare(strict_types=1);

use App\Models\User;

beforeEach(function (): void {
    $this->user = User::factory()->create();
});

test('users can authenticate using the login page', function (): void {
    $this->post(route('login'), getLoginData($this->user))
        ->assertRedirect(route('home'));

    $this->assertAuthenticated();
});

test('users can not authenticate with an invalid password', function (): void {
    $this->post(route('login'), [
        'email' => $this->user->email,
        'password' => 'wrong-password',
    ])->assertInvalid();

    $this->assertGuest();
});

test('users are throttled when attempting to authenticate too many times', function (): void {
    for ($i = 0; $i < 5; ++$i) {
        $this->post(route('login'), [
            'email' => $this->user->email,
            'password' => 'wrong-password',
        ]);
    }

    $this->post(route('login'), getLoginData($this->user))
        ->assertInvalid();

    $this->assertGuest();
});

test('users are redirected to the two factor authentication page if 2FA is enabled', function (): void {
    $user = User::factory()->withTwoFactorAuth()->create();

    $this->post(route('login'), getLoginData($user))
        ->assertRedirect(route('two-factor.login'));
});

test('users remember me preference is preserved when using two factor authentication', function (): void {
    $user = User::factory()->withTwoFactorAuth()->create();

    $this->post(route('login'), getLoginData($user, true))
        ->assertRedirect(route('two-factor.login'))
        ->assertSessionHas('login.remember', true);
});

test('users are not redirected to the two factor authentication page if 2FA is unconfirmed', function (): void {
    $user = User::factory()->withUnconfirmedTwoFactorAuth()->create();

    $this->post(route('login'), getLoginData($user))
        ->assertRedirect(route('home'));
});

function getLoginData(User $user, bool $remember = false): array
{
    return [
        'email' => $user->email,
        'password' => 'password',
        'remember' => $remember,
    ];
}
