<?php

declare(strict_types=1);

namespace App\Actions\Auth;

use App\Models\User;

final class DisableTwoFactorAction
{
    public function handle(User $user): bool
    {
        return $user->update([
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,
        ]);
    }
}
