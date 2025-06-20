<?php

declare(strict_types=1);

namespace App\Providers;

use App\Mixins\RequestMixin;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Override;
use ReflectionException;

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

    /**
     * @throws ReflectionException
     */
    public function boot(): void
    {
        $this->configureCommands();
        $this->configureModels();
        $this->configureVite();
        $this->configureDates();
        $this->configureMixins();
    }

    private function configureCommands(): void
    {
        DB::prohibitDestructiveCommands($this->app->isProduction());
    }

    private function configureModels(): void
    {
        Model::unguard();
        Model::shouldBeStrict(! $this->app->isProduction());
        Model::automaticallyEagerLoadRelationships();
    }

    private function configureVite(): void
    {
        Vite::usePrefetchStrategy('aggressive');
    }

    private function configureDates(): void
    {
        Date::use(CarbonImmutable::class);
    }

    /**
     * @throws ReflectionException
     */
    private function configureMixins(): void
    {
        Request::mixin(new RequestMixin);
    }
}
