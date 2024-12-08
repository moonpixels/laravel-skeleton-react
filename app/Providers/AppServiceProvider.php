<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Override;

final class AppServiceProvider extends ServiceProvider
{
    #[Override]
    public function register(): void
    {
        // @codeCoverageIgnoreStart

        if ($this->app->isLocal()) {
            $this->app->register(\Laravel\Telescope\TelescopeServiceProvider::class);
            $this->app->register(TelescopeServiceProvider::class);
        }

        // @codeCoverageIgnoreEnd
    }

    public function boot(): void
    {
        $this->configureCommands();
        $this->configureModels();
        $this->configureVite();
    }

    public function configureCommands(): void
    {
        DB::prohibitDestructiveCommands($this->app->isProduction());
    }

    public function configureModels(): void
    {
        Model::unguard();
        Model::shouldBeStrict(! $this->app->isProduction());
    }

    public function configureVite(): void
    {
        Vite::usePrefetchStrategy('aggressive');
    }
}
