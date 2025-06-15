<?php

declare(strict_types=1);

use App\Http\Controllers\Account\AccountAvatarController;
use App\Http\Controllers\Account\AccountController;
use App\Http\Controllers\Account\AccountPreferencesController;
use App\Http\Controllers\Account\AccountSecurityController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => redirect()->route('login'));

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::get('dashboard', fn () => Inertia::render('dashboard', ['snake_case' => 'testing']))->name('dashboard');

    Route::controller(AccountAvatarController::class)->group(function (): void {
        Route::put('account/avatar', 'update')->name('account.avatar.update');
        Route::delete('account/avatar', 'destroy')->name('account.avatar.destroy');
    });

    Route::controller(AccountController::class)->group(function (): void {
        Route::get('account', 'edit')->name('account.edit');
        Route::put('account', 'update')->name('account.update');
        Route::delete('account', 'destroy')->name('account.destroy');
    });

    Route::controller(AccountPreferencesController::class)->group(function (): void {
        Route::get('account/preferences', 'edit')->name('account.preferences.edit');
        Route::put('account/preferences', 'update')->name('account.preferences.update');
    });

    Route::controller(AccountSecurityController::class)->group(function (): void {
        Route::get('account/security', 'edit')->name('account.security.edit');
    });
});

require __DIR__.'/auth.php';
