<?php

declare(strict_types=1);

namespace App\Actions\Auth;

use App\Models\User;

final class ConfirmTwoFactorAction
{
    public function handle(User $user): bool
    {
        return $user->update([
            'two_factor_confirmed_at' => now(),
        ]);
    }
}
