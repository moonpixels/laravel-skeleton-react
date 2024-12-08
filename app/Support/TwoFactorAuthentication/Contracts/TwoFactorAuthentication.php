<?php

declare(strict_types=1);

namespace App\Support\TwoFactorAuthentication\Contracts;

interface TwoFactorAuthentication
{
    public function generateSecretKey(): string;

    public function generateRecoveryCode(): string;

    public function getQrCodeUrl(string $company, string $email, string $secret): string;

    public function verify(string $secret, string $code): bool;

    public function getCurrentOtp(string $secret): ?string;
}
