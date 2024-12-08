<?php

declare(strict_types=1);

use App\Support\TwoFactorAuthentication\Providers\Google2FA\GoogleTwoFactorAuthentication;

it('generates a secret key', function (): void {
    $twoFactor = app(GoogleTwoFactorAuthentication::class);

    expect($twoFactor->generateSecretKey())->toBeString();
});

it('generates a recovery code', function (): void {
    $twoFactor = app(GoogleTwoFactorAuthentication::class);

    expect($twoFactor->generateRecoveryCode())->toBeString();
});

it('can get a QR code URL', function (): void {
    $twoFactor = app(GoogleTwoFactorAuthentication::class);

    expect($twoFactor->getQrCodeUrl('company', 'email', 'secret'))->toBeUrl();
});

it('can get the current OTP', function (): void {
    $twoFactor = app(GoogleTwoFactorAuthentication::class);

    $secret = $twoFactor->generateSecretKey();

    expect($twoFactor->getCurrentOtp($secret))->toBeString();
});

it('returns null if it cannot get the current OTP', function (): void {
    $twoFactor = app(GoogleTwoFactorAuthentication::class);

    expect($twoFactor->getCurrentOtp('invalid-secret'))->toBeNull();
});

it('can verify a valid code', function (): void {
    $twoFactor = app(GoogleTwoFactorAuthentication::class);

    $secret = $twoFactor->generateSecretKey();

    $code = $twoFactor->getCurrentOtp($secret);

    expect($twoFactor->verify($secret, $code))->toBeTrue();
});

it('does not verify a code that has already been used', function (): void {
    $twoFactor = app(GoogleTwoFactorAuthentication::class);

    $secret = $twoFactor->generateSecretKey();

    $code = $twoFactor->getCurrentOtp($secret);

    expect($twoFactor->verify($secret, $code))->toBeTrue()
        ->and($twoFactor->verify($secret, $code))->toBeFalse();
});

it('does not verify an invalid code', function (): void {
    $twoFactor = app(GoogleTwoFactorAuthentication::class);

    $secret = $twoFactor->generateSecretKey();

    expect($twoFactor->verify($secret, 'invalid-code'))->toBeFalse();
});

it('does not verify an invalid secret', function (): void {
    $twoFactor = app(GoogleTwoFactorAuthentication::class);

    expect($twoFactor->verify('invalid-secret', 'code'))->toBeFalse();
});
