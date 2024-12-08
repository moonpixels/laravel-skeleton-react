<?php

declare(strict_types=1);

use App\Providers\AppServiceProvider;
use App\Providers\ImageProcessorServiceProvider;
use App\Providers\TwoFactorAuthenticationServiceProvider;

return [
    AppServiceProvider::class,
    ImageProcessorServiceProvider::class,
    TwoFactorAuthenticationServiceProvider::class,
];
