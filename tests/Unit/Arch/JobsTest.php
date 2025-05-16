<?php

declare(strict_types=1);

use Illuminate\Contracts\Queue\ShouldQueue;

arch('jobs')
    ->expect('App\Jobs')
    ->toBeClasses()
    ->toImplement(ShouldQueue::class)
    ->toUseStrictTypes();
