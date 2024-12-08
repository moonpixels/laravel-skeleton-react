<?php

declare(strict_types=1);

namespace App\Providers;

use App\Support\TwoFactorAuthentication\Contracts\TwoFactorAuthentication;
use App\Support\TwoFactorAuthentication\Providers\Google2FA\GoogleTwoFactorAuthentication;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\ServiceProvider;
use Override;
use PragmaRX\Google2FA\Google2FA;

final class TwoFactorAuthenticationServiceProvider extends ServiceProvider
{
    #[Override]
    public function register(): void
    {
        $this->app->singleton(
            TwoFactorAuthentication::class,
            fn (Application $app): TwoFactorAuthentication => new GoogleTwoFactorAuthentication(
                $app->make(Google2FA::class)
            )
        );
    }
}
