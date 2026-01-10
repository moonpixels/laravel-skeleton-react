<?php

declare(strict_types=1);

namespace App\Providers;

use App\Mixins\RequestMixin;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Pagination\LengthAwarePaginator;
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
        $this->configurePagination();
        $this->configureResources();
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

    private function configurePagination(): void
    {
        $this->app->extend(LengthAwarePaginator::class, function (LengthAwarePaginator $paginator): LengthAwarePaginator {
            // Ensures there are not too many links in the pagination
            $paginator->onEachSide(1);

            return $paginator;
        });
    }

    private function configureResources(): void
    {
        JsonResource::withoutWrapping();
    }
}
