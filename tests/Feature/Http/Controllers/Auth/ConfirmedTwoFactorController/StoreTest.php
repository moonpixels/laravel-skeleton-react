<?php

declare(strict_types=1);

use App\Models\User;
use App\Support\TwoFactorAuthentication\Facades\TwoFactorAuthentication;

beforeEach(function (): void {
    $this->user = User::factory()->withUnconfirmedTwoFactorAuth()->create();
    $this->actingAs($this->user);
});

test('two factor authentication can be confirmed', function (): void {
    $validOtp = TwoFactorAuthentication::getCurrentOtp($this->user->two_factor_secret);

    $this->post(route('two-factor.confirm'), ['code' => $validOtp])
        ->assertValid()
        ->assertRedirect();

    expect($this->user->two_factor_confirmed_at)->not->toBeNull();
});

test('two factor authentication cannot be confirmed with an invalid code', function (): void {
    $this->post(route('two-factor.confirm'), ['code' => 'invalid-otp'])
        ->assertInvalid(['code']);

    expect($this->user->two_factor_confirmed_at)->toBeNull();
});
