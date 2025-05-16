<?php

declare(strict_types=1);

use App\Models\User;

test('two factor recovery codes can be retrieved', function (): void {
    $user = User::factory()->withTwoFactorAuth()->create();

    $this->actingAs($user)
        ->get(route('two-factor.recovery-codes'))
        ->assertJson(['recoveryCodes' => $user->two_factor_recovery_codes]);
});
