<?php

declare(strict_types=1);

use App\Providers\TelescopeServiceProvider;
use Illuminate\Support\ServiceProvider;

arch('providers')
    ->expect('App\Providers')
    ->toBeClasses()
    ->toExtend(ServiceProvider::class)
    ->toUseStrictTypes()
    ->not->toBeUsed()
    ->ignoring(TelescopeServiceProvider::class);
