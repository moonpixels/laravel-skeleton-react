<?php

declare(strict_types=1);

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmedPasswordController;
use App\Http\Controllers\Auth\ConfirmedTwoFactorController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\TwoFactorAuthenticatedSessionController;
use App\Http\Controllers\Auth\TwoFactorController;
use App\Http\Controllers\Auth\TwoFactorRecoveryCodeController;
use App\Http\Controllers\Auth\VerifiedEmailController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function (): void {
    Route::controller(RegisteredUserController::class)->group(function (): void {
        Route::get('register', 'create')->name('register');
        Route::post('register', 'store');
    });

    Route::controller(AuthenticatedSessionController::class)->group(function (): void {
        Route::get('login', 'create')->name('login');
        Route::post('login', 'store');
    });

    Route::controller(TwoFactorAuthenticatedSessionController::class)->group(function (): void {
        Route::get('two-factor-challenge', 'create')->name('two-factor.login');
        Route::post('two-factor-challenge', 'store');
    });

    Route::controller(PasswordResetLinkController::class)->group(function (): void {
        Route::get('forgot-password', 'create')->name('password.request');
        Route::post('forgot-password', 'store')->name('password.email');
    });

    Route::controller(NewPasswordController::class)->group(function (): void {
        Route::get('reset-password/{token}', 'create')->name('password.reset');
        Route::post('reset-password', 'store')->name('password.store');
    });
});

Route::middleware('auth')->group(function (): void {
    Route::controller(VerifiedEmailController::class)->group(function (): void {
        Route::get('verify-email', 'show')->name('verification.notice');
        Route::get('verify-email/{id}/{hash}', 'store')->name('verification.verify');
    });

    Route::controller(EmailVerificationNotificationController::class)->group(function (): void {
        Route::post('email/verification-notification', 'store')->name('verification.send');
    });

    Route::controller(ConfirmedPasswordController::class)->group(function (): void {
        Route::get('confirm-password', 'create')->name('password.confirm');
        Route::post('confirm-password', 'store');
    });

    Route::controller(TwoFactorController::class)->group(function (): void {
        Route::post('two-factor', 'store')->name('two-factor.enable');
        Route::delete('two-factor', 'destroy')->name('two-factor.disable');
    });

    Route::controller(ConfirmedTwoFactorController::class)->group(function (): void {
        Route::post('two-factor/confirm', 'store')->name('two-factor.confirm');
    });

    Route::controller(TwoFactorRecoveryCodeController::class)->group(function (): void {
        Route::get('two-factor/recovery-codes', 'index')->name('two-factor.recovery-codes');
    });

    Route::controller(PasswordController::class)->group(function (): void {
        Route::put('account/password', 'update')->name('account.password.update');
    });

    Route::controller(AuthenticatedSessionController::class)->group(function (): void {
        Route::post('logout', 'destroy')->name('logout');
    });
});
