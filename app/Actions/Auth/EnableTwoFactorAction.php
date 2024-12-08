<?php

declare(strict_types=1);

namespace App\Actions\Auth;

use App\Models\User;
use App\Support\TwoFactorAuthentication\Contracts\TwoFactorAuthentication;
use Illuminate\Support\Collection;
use Throwable;

final readonly class EnableTwoFactorAction
{
    public function __construct(
        private TwoFactorAuthentication $twoFactorAuthentication
    ) {}

    public function handle(User $user): bool
    {
        try {
            return $user->update([
                'two_factor_secret' => $this->twoFactorAuthentication->generateSecretKey(),
                'two_factor_recovery_codes' => Collection::times(
                    8,
                    fn (): string => $this->twoFactorAuthentication->generateRecoveryCode()
                )->all(),
            ]);
        } catch (Throwable $throwable) {
            report($throwable);

            return false;
        }
    }
}
