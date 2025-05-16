<?php

declare(strict_types=1);

use App\Models\User;
use App\Support\TwoFactorAuthentication\Contracts\TwoFactorAuthentication as TwoFactorAuthenticationContract;
use Mockery\MockInterface;

beforeEach(function (): void {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('two factor authentication can be enabled', function (): void {
    $this->post(route('two-factor.enable'))
        ->assertOk()
        ->assertJsonStructure(['qrCode', 'secret']);

    expect($this->user)
        ->two_factor_secret->not->toBeNull()
        ->two_factor_recovery_codes->toBeArray()
        ->two_factor_confirmed_at->toBeNull();
});

test('a new secret is generated when enabling two factor authentication', function (): void {
    $user = User::factory()->withTwoFactorAuth()->create();

    $oldValue = $user->two_factor_secret;

    $this->actingAs($user)
        ->post(route('two-factor.enable'))
        ->assertOk();

    expect($user->two_factor_secret)->not->toBe($oldValue);
});

test('it does not enable two factor authentication if the 2FA provider throws an exception', function (): void {
    $this->mock(TwoFactorAuthenticationContract::class, function (MockInterface $mock): void {
        $mock->shouldReceive('generateSecretKey')
            ->once()
            ->andThrow(new Exception);
    });

    $this->post(route('two-factor.enable'))
        ->assertServerError();

    expect($this->user)
        ->two_factor_secret->toBeNull()
        ->two_factor_recovery_codes->toBeNull()
        ->two_factor_confirmed_at->toBeNull();
});
