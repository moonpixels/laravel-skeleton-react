<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Schedule;

Schedule::onOneServer()
    ->runInBackground()
    ->withoutOverlapping()
    ->group(function (): void {
        Schedule::command('auth:clear-resets')->everyFifteenMinutes();
        Schedule::command('horizon:snapshot')->everyFiveMinutes();
        Schedule::command('model:prune')->daily();
    });
