<?php

declare(strict_types=1);

use App\Enums\Horizon\Queue;

test('horizon queues are configured', function (): void {
    $horizonQueues = collect(config('horizon.defaults'))
        ->map(fn ($supervisor): mixed => $supervisor['queue'])
        ->flatten()
        ->toArray();

    $appQueues = array_column(Queue::cases(), 'value');

    expect($horizonQueues)->toEqualCanonicalizing($appQueues);
});
