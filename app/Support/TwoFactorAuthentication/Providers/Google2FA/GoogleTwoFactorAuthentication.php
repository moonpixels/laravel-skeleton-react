<?php

declare(strict_types=1);

namespace App\Support\TwoFactorAuthentication\Providers\Google2FA;

use App\Support\TwoFactorAuthentication\Contracts\TwoFactorAuthentication as TwoFactorAuthenticationContract;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Override;
use PragmaRX\Google2FA\Exceptions\IncompatibleWithGoogleAuthenticatorException;
use PragmaRX\Google2FA\Exceptions\InvalidCharactersException;
use PragmaRX\Google2FA\Exceptions\SecretKeyTooShortException;
use PragmaRX\Google2FA\Google2FA;
use Throwable;

final readonly class GoogleTwoFactorAuthentication implements TwoFactorAuthenticationContract
{
    public function __construct(
        private Google2FA $google2FA
    ) {}

    /**
     * @throws IncompatibleWithGoogleAuthenticatorException
     * @throws SecretKeyTooShortException
     * @throws InvalidCharactersException
     */
    #[Override]
    public function generateSecretKey(): string
    {
        return $this->google2FA->generateSecretKey();
    }

    #[Override]
    public function generateRecoveryCode(): string
    {
        return Str::random(10);
    }

    #[Override]
    public function getQrCodeUrl(string $company, string $email, string $secret): string
    {
        return $this->google2FA->getQRCodeUrl($company, $email, $secret);
    }

    #[Override]
    public function verify(string $secret, string $code): bool
    {
        $cacheKey = 'two_factor_authentication:'.hash('xxh128', $secret);

        try {
            $timestamp = $this->google2FA->verifyKeyNewer($secret, $code, Cache::get($cacheKey));

            if ($timestamp) {
                $timestamp = is_bool($timestamp) ? $this->google2FA->getTimestamp() : $timestamp;

                Cache::put($cacheKey, $timestamp, $this->google2FA->getWindow() * 60);

                return true;
            }

            return false;
        } catch (Throwable) {
            return false;
        }
    }

    #[Override]
    public function getCurrentOtp(string $secret): ?string
    {
        try {
            return $this->google2FA->getCurrentOtp($secret);
        } catch (Throwable) {
            return null;
        }
    }
}
