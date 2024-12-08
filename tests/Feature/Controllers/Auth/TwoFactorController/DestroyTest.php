<?php

declare(strict_types=1);

use App\Models\User;
use App\Support\TwoFactorAuthentication\Facades\TwoFactorAuthentication;

beforeEach(function (): void {
    $this->user = User::factory()->withTwoFactorAuth()->create();
    $this->actingAs($this->user);
});

test('two factor authentication can be disabled with a valid code', function (): void {
    $validOtp = TwoFactorAuthentication::getCurrentOtp($this->user->two_factor_secret);

    $this->delete(route('two-factor.disable'), ['code' => $validOtp])
        ->assertValid()
        ->assertRedirect();

    expect($this->user)
        ->two_factor_secret->toBeNull()
        ->two_factor_recovery_codes->toBeNull()
        ->two_factor_confirmed_at->toBeNull();
});

test('two factor authentication cannot be disabled with an invalid code', function (): void {
    $this->delete(route('two-factor.disable'), ['code' => 'invalid-code'])
        ->assertInvalid(['code']);

    expect($this->user)
        ->two_factor_secret->not->toBeNull()
        ->two_factor_recovery_codes->not->toBeNull()
        ->two_factor_confirmed_at->not->toBeNull();
});
