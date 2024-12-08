<?php

declare(strict_types=1);

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Laravel\Horizon\HorizonApplicationServiceProvider;
use Override;

final class HorizonServiceProvider extends HorizonApplicationServiceProvider
{
    #[Override]
    protected function gate(): void
    {
        // @codeCoverageIgnoreStart
        Gate::define('viewHorizon', fn (User $user): bool => $user->email === 'adam@moonpixels.co.uk');
        // @codeCoverageIgnoreEnd
    }
}
