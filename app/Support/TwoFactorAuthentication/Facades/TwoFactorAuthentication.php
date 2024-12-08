<?php

declare(strict_types=1);

namespace App\Support\TwoFactorAuthentication\Facades;

use Illuminate\Support\Facades\Facade;
use Override;

/**
 * @method static string generateSecretKey()
 * @method static string generateRecoveryCode()
 * @method static string getQrCodeUrl(string $company, string $email, string $secret)
 * @method static bool verify(string $secret, string $code)
 * @method static string | null getCurrentOtp(string $secret)
 *
 * @see \App\Support\TwoFactorAuthentication\Contracts\TwoFactorAuthentication
 */
final class TwoFactorAuthentication extends Facade
{
    #[Override]
    protected static function getFacadeAccessor(): string
    {
        return \App\Support\TwoFactorAuthentication\Contracts\TwoFactorAuthentication::class;
    }
}
