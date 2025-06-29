<?php

declare(strict_types=1);

use App\Models\User;
use App\Support\TwoFactorAuthentication\Facades\TwoFactorAuthentication;

beforeEach(function (): void {
    $this->user = User::factory()->withTwoFactorAuth()->create();

    $this->withSession([
        'login.id' => $this->user->id,
        'login.remember' => false,
    ]);
});

test('users can authenticate using two factor authentication with a valid code', function (): void {
    $validOtp = TwoFactorAuthentication::getCurrentOtp($this->user->two_factor_secret);

    $this->post(route('two-factor.login'), [
        'code' => $validOtp,
    ])
        ->assertValid()
        ->assertRedirect(route('dashboard.index'))
        ->assertSessionMissing(['login.id', 'login.remember']);

    $this->assertAuthenticatedAs($this->user);
});

test('users cannot authenticate using two factor authentication with an invalid code', function (): void {
    $this->post(route('two-factor.login'), [
        'code' => 'invalid-otp',
    ])->assertInvalid(['code']);

    $this->assertGuest();
});

test('users can authenticate using two factor authentication with a valid recovery code', function (): void {

    $this->post(route('two-factor.login'), [
        'code' => 'recovery-code-1',
        'is_recovery' => true,
    ])
        ->assertValid()
        ->assertRedirect(route('dashboard.index'))
        ->assertSessionMissing(['login.id', 'login.remember']);

    $this->assertAuthenticatedAs($this->user);

    $this->user->refresh();

    expect($this->user->two_factor_recovery_codes)->not->toContain('recovery-code-1');
});

test('users cannot authenticate using two factor authentication with an invalid recovery code', function (): void {
    $this->post(route('two-factor.login'), [
        'code' => 'invalid-recovery-code',
        'is_recovery' => true,
    ])->assertInvalid(['code']);

    $this->assertGuest();
});

test('users are throttled when attempting to authenticate using two factor authentication too many times', function (): void {
    for ($i = 0; $i < 5; ++$i) {
        $this->post(route('two-factor.login'), [
            'code' => 'invalid-otp',
        ]);
    }

    $this->post(route('two-factor.login'), [
        'code' => 'invalid-otp',
    ])->assertInvalid();

    $this->assertGuest();
});
